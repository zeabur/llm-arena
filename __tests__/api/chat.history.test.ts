jest.mock('../../lib/mongo', () => ({ getDb: jest.fn() }));
jest.mock('next/server', () => ({
  NextResponse: {
    json: (body: any, init?: any) => ({ status: init?.status || 200, json: async () => body }),
  },
}));

import { getDb } from '../../lib/mongo';
import { ObjectId } from 'mongodb';

describe('/api/chat/history', () => {
  const threads = { findOne: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    (getDb as jest.Mock).mockResolvedValue({ collection: () => threads });
  });

  it('returns empty arrays when thread not found', async () => {
    threads.findOne.mockResolvedValue(null);
    const { POST } = await import('../../app/api/chat/history/route');
    const res = await POST({ json: async () => ({ threadId: new ObjectId().toHexString() }) } as any);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data).toEqual({ messagesLeft: [], messagesRight: [] });
  });

  it('returns history when thread exists', async () => {
    threads.findOne.mockResolvedValue({ model1Messages: [{ role: 'assistant', content: 'A' }], model2Messages: [] });
    const { POST } = await import('../../app/api/chat/history/route');
    const res = await POST({ json: async () => ({ threadId: new ObjectId().toHexString() }) } as any);
    const data = await res.json();
    expect(data.messagesLeft.length).toBe(1);
  });
});


