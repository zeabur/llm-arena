/**
 * @jest-environment node
 */
import { ObjectId } from 'mongodb';

// Mock the mongo module
jest.mock('../../lib/mongo', () => ({
  getDb: jest.fn(),
}));

import { getDb } from '../../lib/mongo';
import { getAvailableModels, selectRandomModels, ModelConfig } from '../../lib/services/models';

describe('Models Service', () => {
  let mockCollection: any;
  let mockDb: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockCollection = {
      find: jest.fn(),
    };
    
    mockDb = {
      collection: jest.fn().mockReturnValue(mockCollection),
    };
    
    (getDb as jest.Mock).mockResolvedValue(mockDb);
  });

  describe('getAvailableModels with enabled field', () => {
    it('should return only enabled models when enabled field is true', async () => {
      const mockModels: ModelConfig[] = [
        { model: 'model1', baseURL: 'url1', apiKey: 'key1', enabled: true },
        { model: 'model2', baseURL: 'url2', apiKey: 'key2', enabled: false },
        { model: 'model3', baseURL: 'url3', apiKey: 'key3', enabled: true },
      ];

      mockCollection.find.mockReturnValue({
        toArray: jest.fn().mockResolvedValue(mockModels),
      });

      const result = await getAvailableModels();

      expect(result).toHaveLength(2);
      expect(result[0].model).toBe('model1');
      expect(result[1].model).toBe('model3');
      expect(result.every(model => model.enabled === true)).toBe(true);
    });

    it('should return all models when enabled field is missing (backward compatibility)', async () => {
      const mockModels = [
        { model: 'model1', baseURL: 'url1', apiKey: 'key1' },
        { model: 'model2', baseURL: 'url2', apiKey: 'key2' },
      ];

      mockCollection.find.mockReturnValue({
        toArray: jest.fn().mockResolvedValue(mockModels),
      });

      const result = await getAvailableModels();

      expect(result).toHaveLength(2);
      expect(result[0].model).toBe('model1');
      expect(result[1].model).toBe('model2');
    });

    it('should return empty array when all models are disabled', async () => {
      const mockModels: ModelConfig[] = [
        { model: 'model1', baseURL: 'url1', apiKey: 'key1', enabled: false },
        { model: 'model2', baseURL: 'url2', apiKey: 'key2', enabled: false },
      ];

      mockCollection.find.mockReturnValue({
        toArray: jest.fn().mockResolvedValue(mockModels),
      });

      const result = await getAvailableModels();

      expect(result).toHaveLength(0);
    });
  });

  describe('selectRandomModels with enabled field', () => {
    it('should only select from enabled models', async () => {
      const mockModels: ModelConfig[] = [
        { model: 'enabled1', baseURL: 'url1', apiKey: 'key1', enabled: true },
        { model: 'disabled1', baseURL: 'url2', apiKey: 'key2', enabled: false },
        { model: 'enabled2', baseURL: 'url3', apiKey: 'key3', enabled: true },
        { model: 'enabled3', baseURL: 'url4', apiKey: 'key4', enabled: true },
      ];

      mockCollection.find.mockReturnValue({
        toArray: jest.fn().mockResolvedValue(mockModels),
      });

      const result = await selectRandomModels(2);

      expect(result).toHaveLength(2);
      expect(result.every(model => ['enabled1', 'enabled2', 'enabled3'].includes(model))).toBe(true);
      expect(result.includes('disabled1')).toBe(false);
    });

    it('should handle case when there are fewer enabled models than requested', async () => {
      const mockModels: ModelConfig[] = [
        { model: 'enabled1', baseURL: 'url1', apiKey: 'key1', enabled: true },
        { model: 'disabled1', baseURL: 'url2', apiKey: 'key2', enabled: false },
      ];

      mockCollection.find.mockReturnValue({
        toArray: jest.fn().mockResolvedValue(mockModels),
      });

      const result = await selectRandomModels(3);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe('enabled1');
    });
  });
});