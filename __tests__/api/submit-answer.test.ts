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

describe('/api/submit-answer', () => {
  const threads = {
    findOne: jest.fn(),
    updateOne: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getDb as jest.Mock).mockResolvedValue({ collection: () => threads });
  });

  it('returns 401 without token', async () => {
    const { POST } = await import('../../app/api/submit-answer/route');
    const res = await POST({ json: async () => ({ threadID: 't1', userAnswer: 'A' }), cookies: { get: () => undefined } } as any);
    expect(res.status).toBe(401);
  });

  it('returns 403 when thread does not belong to user', async () => {
    (verifyToken as jest.Mock).mockReturnValue(new ObjectId('507f1f77bcf86cd799439011'));
    threads.findOne.mockResolvedValue({ _id: new ObjectId('507f1f77bcf86cd799439012'), userID: new ObjectId('507f1f77bcf86cd799439013') });

    const { POST } = await import('../../app/api/submit-answer/route');
    const res = await POST({ json: async () => ({ threadID: '507f1f77bcf86cd799439012', userAnswer: 'A' }), cookies: { get: () => ({ value: 'token' }) } } as any);
    expect(res.status).toBe(403);
  });

  it('updates userAnswer when authorized', async () => {
    const uid = new ObjectId('507f1f77bcf86cd799439011');
    (verifyToken as jest.Mock).mockReturnValue(uid);
    threads.findOne.mockResolvedValue({ _id: new ObjectId('507f1f77bcf86cd799439012'), userID: uid });

    const { POST } = await import('../../app/api/submit-answer/route');
    const res = await POST({ json: async () => ({ threadID: '507f1f77bcf86cd799439012', userAnswer: 'A' }), cookies: { get: () => ({ value: 'token' }) } } as any);
    expect(res.status).toBe(200);
    expect(threads.updateOne).toHaveBeenCalled();
  });
});


