jest.mock('next/server', () => ({
  NextResponse: {
    json: (body: any, init?: any) => ({ status: init?.status || 200, json: async () => body }),
  },
}));

describe('/api/hot-topics', () => {
  it('returns mock list with default limit', async () => {
    const { GET } = await import('../../app/api/hot-topics/route');
    const res = await GET({ url: 'https://x.test/api/hot-topics' } as any);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
  });
});


