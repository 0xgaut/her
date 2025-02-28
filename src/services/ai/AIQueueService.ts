import { QueuedMessage, AIResponse, AIServiceError, AIErrorCode } from './types';
import { storageService } from '../storage/storageService';

export class AIQueueService {
  private static readonly QUEUE_STORAGE_KEY = 'ai_message_queue';
  private queue: QueuedMessage[] = [];
  private isProcessing = false;
  private processingPromise: Promise<void> | null = null;
  private sendRequestCallback: (message: QueuedMessage) => Promise<AIResponse>;
  
  constructor(sendRequestCallback: (message: QueuedMessage) => Promise<AIResponse>) {
    this.sendRequestCallback = sendRequestCallback;
  }
  
  async initialize(): Promise<void> {
    // Load queue from storage
    try {
      const storedQueue = await storageService.getData<QueuedMessage[]>(AIQueueService.QUEUE_STORAGE_KEY);
      if (storedQueue) {
        this.queue = storedQueue;
      }
    } catch (error) {
      console.error('Failed to load message queue:', error);
    }
  }
  
  async enqueue(message: QueuedMessage): Promise<void> {
    // Add message to queue
    this.queue.push(message);
    
    // Sort queue by priority and timestamp
    this.sortQueue();
    
    // Save queue to storage
    await this.saveQueue();
    
    // Start processing if not already processing
    this.startProcessing();
  }
  
  async clear(): Promise<void> {
    this.queue = [];
    await this.saveQueue();
  }
  
  getQueueLength(): number {
    return this.queue.length;
  }
  
  private sortQueue(): void {
    // Sort by priority (high > normal > low) and then by timestamp (oldest first)
    this.queue.sort((a, b) => {
      const priorityOrder = { high: 0, normal: 1, low: 2 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      
      if (priorityDiff !== 0) {
        return priorityDiff;
      }
      
      return a.timestamp - b.timestamp;
    });
  }
  
  private async saveQueue(): Promise<void> {
    try {
      await storageService.storeData(AIQueueService.QUEUE_STORAGE_KEY, this.queue);
    } catch (error) {
      console.error('Failed to save message queue:', error);
    }
  }
  
  private startProcessing(): void {
    if (this.isProcessing) {
      return;
    }
    
    this.isProcessing = true;
    this.processingPromise = this.processQueue().finally(() => {
      this.isProcessing = false;
      this.processingPromise = null;
    });
  }
  
  private async processQueue(): Promise<void> {
    while (this.queue.length > 0) {
      const message = this.queue[0];
      
      try {
        const response = await this.sendRequestCallback(message);
        
        // Remove message from queue on success
        this.queue.shift();
        await this.saveQueue();
        
        // Call success callback if provided
        if (message.onSuccess) {
          message.onSuccess(response);
        }
      } catch (error) {
        const aiError = error as AIServiceError;
        
        // Handle retryable errors
        if (
          message.retryCount < message.maxRetries &&
          [
            AIErrorCode.NETWORK_ERROR,
            AIErrorCode.TIMEOUT,
            AIErrorCode.RATE_LIMIT,
            AIErrorCode.SERVER_ERROR
          ].includes(aiError.code)
        ) {
          // Increment retry count
          message.retryCount++;
          
          // Calculate backoff time (exponential backoff with jitter)
          const baseBackoff = Math.min(1000 * Math.pow(2, message.retryCount), 60000);
          const jitter = Math.random() * 0.3 * baseBackoff;
          const backoff = baseBackoff + jitter;
          
          // For rate limit errors, use the retry-after header if available
          if (aiError.code === AIErrorCode.RATE_LIMIT && aiError.retryAfter) {
            await new Promise(resolve => setTimeout(resolve, aiError.retryAfter * 1000));
          } else {
            await new Promise(resolve => setTimeout(resolve, backoff));
          }
          
          // Update the message in the queue
          await this.saveQueue();
          
          // Continue processing (will retry this message)
          continue;
        }
        
        // For non-retryable errors or max retries reached, remove from queue
        this.queue.shift();
        await this.saveQueue();
        
        // Call error callback if provided
        if (message.onError) {
          message.onError(aiError);
        }
      }
    }
  }
} 