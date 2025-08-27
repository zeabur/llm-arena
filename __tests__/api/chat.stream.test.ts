import { ObjectId } from 'mongodb';

jest.mock('../../lib/services/models', () => ({
  getAvailableModels: jest.fn(),
  selectRandomModels: jest.fn(),
  getModelTextStream: jest.fn(),
}));

jest.mock('../../lib/services/threads', () => ({
  getThreadById: jest.fn(),
  saveThreadModels: jest.fn(),
  appendThreadMessage: jest.fn(),
}));

jest.mock('../../lib/jwt', () => ({ verifyToken: jest.fn() }));

import { getAvailableModels, selectRandomModels, getModelTextStream } from '../../lib/services/models';
import { getThreadById, appendThreadMessage } from '../../lib/services/threads';
import { verifyToken } from '../../lib/jwt';

async function collectStreamText(res: any): Promise<string> {
  const reader = (res as any).body.getReader();
  const decoder = new TextDecoder();
  let out = '';
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    out += decoder.decode(value, { stream: true });
  }
  return out;
}

describe('/api/chat stream', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Minimal Response stub to work with ReadableStream
    // @ts-ignore
    global.Response = function(body: any, init?: any) {
      return { body, headers: init?.headers, status: init?.status || 200 } as any;
    } as any;
  });

  it('emits model1/model2 events from getModelTextStream', async () => {
    const threadId = new ObjectId();
    (verifyToken as jest.Mock).mockReturnValue(new ObjectId());

    (getAvailableModels as jest.Mock).mockResolvedValue([
      { model: 'm1', baseURL: 'x', apiKey: 'k' },
      { model: 'm2', baseURL: 'x', apiKey: 'k' },
    ]);
    (selectRandomModels as jest.Mock).mockResolvedValue(['m1', 'm2']);

    (getThreadById as jest.Mock).mockResolvedValue({
      _id: threadId,
      selectedModels: ['m1', 'm2'],
      model1Messages: [],
      model2Messages: [],
      category: 'c',
      initialContext: { question: 'q', source: 's' },
    });

    // yield two chunks per model
    (getModelTextStream as jest.Mock).mockImplementation(async function* (_cfg: any, _msgs: any) {
      yield 'X';
      yield 'Y';
    });

    const { POST } = await import('../../app/api/chat/route');
    const res = await POST({
      json: async () => ({ threadId: threadId.toHexString(), message: 'hello' }),
      cookies: { get: () => ({ value: 'token' }) },
    } as any);

    const text = await collectStreamText(res as any);
    const lines = text.trim().split('\n').map((l) => JSON.parse(l));

    const model1 = lines.filter((e) => e.type === 'model1');
    const model2 = lines.filter((e) => e.type === 'model2');
    expect(model1.length).toBeGreaterThan(0);
    expect(model2.length).toBeGreaterThan(0);
    expect(appendThreadMessage).toHaveBeenCalled();
  });
});


