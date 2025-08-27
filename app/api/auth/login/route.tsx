import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!process.env.OAUTH_CALLBACK_URL) {
    throw new Error('OAUTH_CALLBACK_URL is not set');
  }

  const oauthCallbackURLEncoded = encodeURIComponent(process.env.OAUTH_CALLBACK_URL);
  const oauthURL = `https://discord.com/oauth2/authorize?client_id=${process.env.OAUTH_CLIENT_ID}&response_type=code&redirect_uri=${oauthCallbackURLEncoded}&scope=identify+email`;

  redirect(oauthURL);
}