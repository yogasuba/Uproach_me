import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.WHEREBY_CLIENT_ID; // Make sure to set this in your .env file
  const redirectUri = `${process.env.BASE_URL}/api/connect/whereby/callback`;

  const authUrl = `https://api.whereby.dev/v1/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}`;

  return NextResponse.redirect(authUrl);
}
