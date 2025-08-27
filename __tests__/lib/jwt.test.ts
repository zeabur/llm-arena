describe('lib/jwt', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('throws if JWT_SECRET missing on generateToken', async () => {
    delete process.env.JWT_SECRET;
    const { generateToken } = await import('../../lib/jwt');
    // @ts-expect-error pass dummy object
    expect(() => generateToken({ toHexString: () => 'id' })).toThrow('JWT_SECRET is not defined');
  });

  it('throws if JWT_SECRET missing on verifyToken', async () => {
    delete process.env.JWT_SECRET;
    const { verifyToken } = await import('../../lib/jwt');
    expect(() => verifyToken('token')).toThrow('JWT_SECRET is not defined');
  });

  it('generates and verifies token when JWT_SECRET set', async () => {
    process.env.JWT_SECRET = 'secret';
    const { generateToken, verifyToken } = await import('../../lib/jwt');
    const userId = { toHexString: () => '507f1f77bcf86cd799439011' } as any;
    const token = generateToken(userId);
    const objectId = verifyToken(token);
    expect(objectId.toHexString()).toBe('507f1f77bcf86cd799439011');
  });
});


