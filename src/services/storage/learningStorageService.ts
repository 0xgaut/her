import { storageService } from './storageService';
import { LearningModule, StorageError, StorageKey } from './types';

class LearningStorageService {
  /**
   * Get all learning modules
   */
  async getAllModules(): Promise<LearningModule[]> {
    try {
      const modules = await storageService.getData<LearningModule[]>(StorageKey.LEARNING_MODULES);
      return modules || [];
    } catch (error) {
      throw new StorageError(
        'Failed to get learning modules',
        StorageKey.LEARNING_MODULES,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Get a specific learning module
   */
  async getModule(id: string): Promise<LearningModule | null> {
    try {
      const modules = await this.getAllModules();
      return modules.find((m) => m.id === id) || null;
    } catch (error) {
      throw new StorageError(
        `Failed to get learning module: ${id}`,
        StorageKey.LEARNING_MODULES,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Add a new learning module
   */
  async addModule(module: Omit<LearningModule, 'id'>): Promise<LearningModule> {
    try {
      const modules = await this.getAllModules();
      const newModule: LearningModule = {
        ...module,
        id: Date.now().toString(),
      };
      
      modules.push(newModule);
      await storageService.storeData(StorageKey.LEARNING_MODULES, modules);
      return newModule;
    } catch (error) {
      throw new StorageError(
        'Failed to add learning module',
        StorageKey.LEARNING_MODULES,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Update a learning module
   */
  async updateModule(id: string, updates: Partial<LearningModule>): Promise<LearningModule | null> {
    try {
      const modules = await this.getAllModules();
      const index = modules.findIndex((m) => m.id === id);
      
      if (index === -1) return null;
      
      const updatedModule = { ...modules[index], ...updates };
      modules[index] = updatedModule;
      
      await storageService.storeData(StorageKey.LEARNING_MODULES, modules);
      return updatedModule;
    } catch (error) {
      throw new StorageError(
        `Failed to update learning module: ${id}`,
        StorageKey.LEARNING_MODULES,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Update module progress
   */
  async updateProgress(id: string, progress: number): Promise<LearningModule | null> {
    try {
      return this.updateModule(id, { 
        progress, 
        lastAccessed: Date.now(),
        completed: progress >= 100
      });
    } catch (error) {
      throw new StorageError(
        `Failed to update module progress: ${id}`,
        StorageKey.LEARNING_MODULES,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Toggle saved for later status
   */
  async toggleSavedForLater(id: string): Promise<LearningModule | null> {
    try {
      const module = await this.getModule(id);
      if (!module) return null;
      
      return this.updateModule(id, { 
        savedForLater: !module.savedForLater,
        lastAccessed: Date.now()
      });
    } catch (error) {
      throw new StorageError(
        `Failed to toggle saved status for module: ${id}`,
        StorageKey.LEARNING_MODULES,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Get modules by category
   */
  async getModulesByCategory(category: LearningModule['category']): Promise<LearningModule[]> {
    try {
      const modules = await this.getAllModules();
      return modules.filter((m) => m.category === category);
    } catch (error) {
      throw new StorageError(
        `Failed to get modules by category: ${category}`,
        StorageKey.LEARNING_MODULES,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Get saved modules
   */
  async getSavedModules(): Promise<LearningModule[]> {
    try {
      const modules = await this.getAllModules();
      return modules.filter((m) => m.savedForLater);
    } catch (error) {
      throw new StorageError(
        'Failed to get saved modules',
        StorageKey.LEARNING_MODULES,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Get completed modules
   */
  async getCompletedModules(): Promise<LearningModule[]> {
    try {
      const modules = await this.getAllModules();
      return modules.filter((m) => m.completed);
    } catch (error) {
      throw new StorageError(
        'Failed to get completed modules',
        StorageKey.LEARNING_MODULES,
        error instanceof Error ? error : undefined
      );
    }
  }
}

export const learningStorageService = new LearningStorageService(); 