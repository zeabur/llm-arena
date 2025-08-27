describe('lib/mongo - singleton', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('throws when MONGO_URI is missing', async () => {
    delete process.env.MONGO_URI;

    jest.doMock('server-only', () => ({}), { virtual: true });
    jest.doMock('mongodb', () => ({
      MongoClient: class {
        connect = jest.fn();
      }
    }));

    await jest.isolateModulesAsync(async () => {
      const { default: getMongoClient } = await import('../../lib/mongo');
      await expect(getMongoClient()).rejects.toThrow('MONGO_URI not set');
    });
  });

  it('returns the same client promise (singleton) when called multiple times', async () => {
    process.env.MONGO_URI = 'mongodb://localhost:27017/test';

    const connectMock = jest.fn().mockResolvedValue({
      db: jest.fn(() => ({ collection: jest.fn() })),
    });

    jest.doMock('server-only', () => ({}), { virtual: true });
    jest.doMock('mongodb', () => ({
      MongoClient: class {
        connect = connectMock;
      }
    }));

    await jest.isolateModulesAsync(async () => {
      const { default: getMongoClient } = await import('../../lib/mongo');
      const p1 = getMongoClient();
      const p2 = getMongoClient();
      const [c1, c2] = await Promise.all([p1, p2]);
      expect(c1).toBe(c2);
      expect(connectMock).toHaveBeenCalledTimes(1);
    });
  });
});


