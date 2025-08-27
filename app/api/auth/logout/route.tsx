export const dynamic = 'force-dynamic';

export async function GET() {
  return new Response(null, {
    status: 302,
    headers: {
      'Set-Cookie': 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
      'Location': '/'
    }
  });
}

export async function POST() {
  return new Response(JSON.stringify({
    message: '登出成功！',
    redirectUrl: '/'
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
      'Cache-Control': 'no-store'
    }
  });
}
