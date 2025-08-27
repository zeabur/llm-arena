import {NextRequest} from "next/server";
import {ObjectId} from "mongodb";
import { getDb } from "@/lib/mongo";
import {generateToken} from "@/lib/jwt";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return new Response('Missing code parameter', {status: 400});
  }

  const discordUserInfo = await getDiscordUserInfoFromCode(code);

  const db = await getDb('arena');

  try {
    const existing = await db.collection('users').findOne({discordID: discordUserInfo.id});

    if (!existing) {
      const newUserDoc = {
        _id: new ObjectId(),
        discordID: discordUserInfo.id,
        username: discordUserInfo.username,
        avatar: `https://cdn.discordapp.com/avatars/${discordUserInfo.id}/${discordUserInfo.avatar}`,
      };

      await db.collection('users').insertOne(newUserDoc);

      const token = generateToken(newUserDoc._id);

      return new Response('<html><script>window.location.href="/";</script></html>', {
        status: 200,
        headers: {
          'Set-Cookie': `token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict`,
          'Content-Type': 'text/html',
        },
      });
    }

    const token = generateToken(existing._id);

    return new Response('<html><script>window.location.href="/";</script></html>', {
      status: 200,
      headers: {
        'Set-Cookie': `token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict`,
        'Content-Type': 'text/html',
      },
    });

  } catch {
    return new Response('Internal Error.', {status: 500});
  }
}

interface DiscordUserResponse {
  user: {
    id: string;
    username: string;
    avatar?: string;
  };
}

async function getDiscordUserInfoFromCode(code: string) {
  const token = await getDiscordTokenFromCode(code);

  const response = await fetch('https://discord.com/api/oauth2/@me', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: DiscordUserResponse = await response.json();

  if (!data.user?.id) {
    throw new Error('Invalid response format');
  }

  return data.user;
}

interface DiscordTokenResponse {
  error?: string;
  error_description?: string;
  access_token?: string;
}

async function getDiscordTokenFromCode(code: string) {
  const CLIENT_ID = process.env.OAUTH_CLIENT_ID;
  const CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET;

  if (!CLIENT_ID || !CLIENT_SECRET || !process.env.OAUTH_CALLBACK_URL) {
    throw new Error('OAUTH_CALLBACK_URL is not set');
  }

  const formData = new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: process.env.OAUTH_CALLBACK_URL
  });

  const response = await fetch('https://discord.com/api/v10/oauth2/token', {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded',},
    body: formData.toString(),
  });

  const data: DiscordTokenResponse = await response.json();

  // Handle error responses
  if (data.error) {
    throw new Error(`Discord error: ${data.error} - ${data.error_description}`);
  }

  if (!data.access_token) {
    throw new Error('No access token in response');
  }

  return data.access_token;
}
