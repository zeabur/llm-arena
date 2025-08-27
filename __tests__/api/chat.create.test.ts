import { ObjectId } from 'mongodb';

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

jest.mock('next/server', () => ({
  NextResponse: {
    json: (body: any, init?: any) => ({
      status: (init && init.status) || 200,
      headers: init && init.headers,
      json: async () => body,
    }),
  },
}));

jest.mock('../../lib/mongo', () => ({
  getDb: jest.fn(),
}));

jest.mock('../../lib/jwt', () => ({
  verifyToken: jest.fn(),
}));

import { cookies } from 'next/headers';
import { getDb } from '../../lib/mongo';
import { verifyToken } from '../../lib/jwt';

describe('/api/chat/create POST', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 401 when no token', async () => {
    (cookies as jest.Mock).mockReturnValue({ get: () => undefined });

    const { POST } = await import('../../app/api/chat/create/route');
    const res = await POST({ json: async () => ({}) } as any);
    expect(res.status).toBe(401);
  });

  it('creates a thread and returns threadId on success', async () => {
    const userId = new ObjectId();
    (cookies as jest.Mock).mockReturnValue({ get: () => ({ value: 'token' }) });
    (verifyToken as jest.Mock).mockReturnValue(userId);

    const insertOne = jest.fn();
    (getDb as jest.Mock).mockResolvedValue({ collection: () => ({ insertOne }) });

    const { POST } = await import('../../app/api/chat/create/route');
    const reqBody = {
      category: 'general',
      initialContext: { initialQuestion: 'Hi?', source: 'user', metadata: {} },
    };
    const res = await POST({ json: async () => reqBody } as any);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(typeof data.threadId).toBe('string');
    expect(insertOne).toHaveBeenCalledTimes(1);
  });
});


