import { RateLimitConfig } from './types';
import { storageService } from '../storage/storageService';

interface RateLimitState {
  requestsThisMinute: number;
  minuteStartTimestamp: number;
  requestsThisHour: number;
  hourStartTimestamp: number;
  tokensToday: number;
  dayStartTimestamp: number;
}

export class AIRateLimitService {
  private static readonly RATE_LIMIT_STORAGE_KEY = 'ai_rate_limit_state';
  private config: RateLimitConfig;
  
  constructor(config: RateLimitConfig = {
    maxRequestsPerMinute: 10,
    maxRequestsPerHour: 100,
    maxTokensPerDay: 100000
  }) {
    this.config = config;
  }
  
  async canMakeRequest(): Promise<boolean> {
    const state = await this.getRateLimitState();
    
    // Reset counters if time periods have elapsed
    const now = Date.now();
    const updatedState = this.resetCountersIfNeeded(state, now);
    
    // Check if any limits are exceeded
    if (
      updatedState.requestsThisMinute >= this.config.maxRequestsPerMinute ||
      updatedState.requestsThisHour >= this.config.maxRequestsPerHour ||
      updatedState.tokensToday >= this.config.maxTokensPerDay
    ) {
      return false;
    }
    
    return true;
  }
  
  async recordRequest(tokenCount: number = 0): Promise<void> {
    const state = await this.getRateLimitState();
    const now = Date.now();
    
    // Reset counters if time periods have elapsed
    const updatedState = this.resetCountersIfNeeded(state, now);
    
    // Update counters
    updatedState.requestsThisMinute += 1;
    updatedState.requestsThisHour += 1;
    updatedState.tokensToday += tokenCount;
    
    // Save updated state
    await this.saveRateLimitState(updatedState);
  }
  
  async getRemainingRequests(): Promise<{
    minuteRemaining: number;
    hourRemaining: number;
    tokensRemaining: number;
  }> {
    const state = await this.getRateLimitState();
    const now = Date.now();
    
    // Reset counters if time periods have elapsed
    const updatedState = this.resetCountersIfNeeded(state, now);
    
    return {
      minuteRemaining: Math.max(0, this.config.maxRequestsPerMinute - updatedState.requestsThisMinute),
      hourRemaining: Math.max(0, this.config.maxRequestsPerHour - updatedState.requestsThisHour),
      tokensRemaining: Math.max(0, this.config.maxTokensPerDay - updatedState.tokensToday)
    };
  }
  
  async resetLimits(): Promise<void> {
    const now = Date.now();
    const newState: RateLimitState = {
      requestsThisMinute: 0,
      minuteStartTimestamp: now,
      requestsThisHour: 0,
      hourStartTimestamp: now,
      tokensToday: 0,
      dayStartTimestamp: now
    };
    
    await this.saveRateLimitState(newState);
  }
  
  private resetCountersIfNeeded(state: RateLimitState, now: number): RateLimitState {
    const updatedState = { ...state };
    
    // Reset minute counter if a minute has passed
    if (now - state.minuteStartTimestamp >= 60 * 1000) {
      updatedState.requestsThisMinute = 0;
      updatedState.minuteStartTimestamp = now;
    }
    
    // Reset hour counter if an hour has passed
    if (now - state.hourStartTimestamp >= 60 * 60 * 1000) {
      updatedState.requestsThisHour = 0;
      updatedState.hourStartTimestamp = now;
    }
    
    // Reset day counter if a day has passed
    if (now - state.dayStartTimestamp >= 24 * 60 * 60 * 1000) {
      updatedState.tokensToday = 0;
      updatedState.dayStartTimestamp = now;
    }
    
    return updatedState;
  }
  
  private async getRateLimitState(): Promise<RateLimitState> {
    const state = await storageService.getData<RateLimitState>(AIRateLimitService.RATE_LIMIT_STORAGE_KEY);
    
    if (!state) {
      const now = Date.now();
      return {
        requestsThisMinute: 0,
        minuteStartTimestamp: now,
        requestsThisHour: 0,
        hourStartTimestamp: now,
        tokensToday: 0,
        dayStartTimestamp: now
      };
    }
    
    return state;
  }
  
  private async saveRateLimitState(state: RateLimitState): Promise<void> {
    await storageService.storeData(AIRateLimitService.RATE_LIMIT_STORAGE_KEY, state);
  }
} 