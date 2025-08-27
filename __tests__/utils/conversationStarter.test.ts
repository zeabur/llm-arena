import { createNewConversation, startNewConversation, ConversationInitConfig } from '../../app/utils/conversationStarter';

// Mock fetch globally
global.fetch = jest.fn();

describe('conversationStarter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createNewConversation', () => {
    it('should create a new conversation successfully', async () => {
      const mockConfig: ConversationInitConfig = {
        question: 'Hello, how are you?',
        category: 'general',
        source: 'user',
        metadata: { userId: '123' }
      };

      const mockResponse = {
        threadId: 'thread-123',
        success: true
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await createNewConversation(mockConfig);

      expect(result).toBe('thread-123');
      expect(fetch).toHaveBeenCalledWith('/api/chat/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          category: 'general',
          initialContext: {
            initialQuestion: 'Hello, how are you?',
            source: 'user',
            metadata: { userId: '123' }
          }
        }),
        credentials: 'include'
      });
    });

    it('should handle API errors gracefully', async () => {
      const mockConfig: ConversationInitConfig = {
        question: 'Hello',
        category: 'general',
        source: 'user'
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Server error' })
      });

      await expect(createNewConversation(mockConfig)).rejects.toThrow('Server error');
    });
  });

  describe('startNewConversation', () => {
    it('should call createNewConversation with the same config', async () => {
      const mockConfig: ConversationInitConfig = {
        question: 'Test question',
        category: 'test',
        source: 'test'
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ threadId: 'thread-456', success: true })
      });

      const result = await startNewConversation(mockConfig);

      expect(result).toBe('thread-456');
    });
  });
});