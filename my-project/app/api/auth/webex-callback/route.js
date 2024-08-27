import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const { WEBEX_CLIENT_ID, WEBEX_CLIENT_SECRET } = process.env;

  if (!code) {
    return NextResponse.json({ error: 'Authorization code not provided' }, { status: 400 });
  }

  try {
    const tokenResponse = await axios.post('https://webexapis.com/v1/access_token', null, {
      params: {
        grant_type: 'authorization_code',
        client_id: WEBEX_CLIENT_ID,
        client_secret: WEBEX_CLIENT_SECRET,
        code,
        redirect_uri: 'http://localhost:3000/api/auth/webex-callback', // Replace with your actual callback URL
      },
    });

    const { access_token } = tokenResponse.data;

    // Here you would typically store the access token in the session or database

    return NextResponse.redirect('/connectvideo');
  } catch (error) {
    console.error('Failed to exchange code for access token:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
