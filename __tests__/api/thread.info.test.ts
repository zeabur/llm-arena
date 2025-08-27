import { ObjectId } from 'mongodb';

jest.mock('../../lib/mongo', () => ({ getDb: jest.fn() }));
jest.mock('../../lib/jwt', () => ({ verifyToken: jest.fn() }));
jest.mock('next/server', () => ({
  NextResponse: {
    json: (body: any, init?: any) => ({ status: init?.status || 200, json: async () => body }),
  },
}));

import { getDb } from '../../lib/mongo';
import { verifyToken } from '../../lib/jwt';

describe('/api/thread/info', () => {
  const threads = { findOne: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    (getDb as jest.Mock).mockResolvedValue({ collection: () => threads });
  });

  it('returns 401 without token', async () => {
    const { POST } = await import('../../app/api/thread/info/route');
    const res = await POST({ json: async () => ({ threadId: 'x' }), cookies: { get: () => undefined } } as any);
    expect(res.status).toBe(401);
  });

  it('returns 404 when not found or access denied', async () => {
    const uid = new ObjectId();
    (verifyToken as jest.Mock).mockReturnValue(uid);
    threads.findOne.mockResolvedValue(null);
    const { POST } = await import('../../app/api/thread/info/route');
    const res = await POST({ json: async () => ({ threadId: uid.toHexString() }), cookies: { get: () => ({ value: 'token' }) } } as any);
    expect(res.status).toBe(404);
  });

  it('returns thread info when found', async () => {
    const uid = new ObjectId();
    (verifyToken as jest.Mock).mockReturnValue(uid);
    const thread = { _id: new ObjectId(), category: 'c', initialContext: { question: 'q', source: 's' }, createdAt: new Date(), updatedAt: new Date(), selectedModels: [] };
    threads.findOne.mockResolvedValue(thread);
    const { POST } = await import('../../app/api/thread/info/route');
    const res = await POST({ json: async () => ({ threadId: thread._id.toHexString() }), cookies: { get: () => ({ value: 'token' }) } } as any);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.threadId).toBe(thread._id.toHexString());
  });
});


