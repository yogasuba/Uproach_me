import { NextResponse } from 'next/server';

export async function GET(req) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');

  const tokenResponse = await fetch('https://api.whereby.dev/v1/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: process.env.WHEREBY_CLIENT_ID,
      client_secret: process.env.WHEREBY_CLIENT_SECRET,
      redirect_uri: `${process.env.BASE_URL}/api/connect/whereby/callback`,
    }),
  });

  const tokenData = await tokenResponse.json();

  if (tokenData.access_token) {
    // Store the tokenData securely in your database for the user
    // You can redirect the user back to the ConnectVideo page
    return NextResponse.redirect('/connect-video');
  }

  return NextResponse.json({ error: 'Failed to authenticate with Whereby' }, { status: 401 });
}
