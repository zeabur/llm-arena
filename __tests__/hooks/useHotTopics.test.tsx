import { renderHook, waitFor } from '@testing-library/react';
import { useHotTopics } from '../../app/hooks/useHotTopics';

describe('useHotTopics', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('loads topics successfully', async () => {
    (global.fetch as any) = jest.fn().mockResolvedValue({
      json: async () => ({ success: true, data: [{ id: '1', title: 't', views: 1, days: 1 }] })
    });

    const { result } = renderHook(() => useHotTopics(5));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.hotTopics.length).toBe(1);
    expect(result.current.error).toBeNull();
  });

  it('handles error response', async () => {
    (global.fetch as any) = jest.fn().mockResolvedValue({ json: async () => ({ success: false, error: 'e' }) });

    const { result } = renderHook(() => useHotTopics());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('e');
  });
});


