import { NextResponse } from 'next/server';
import axios from 'axios';

const OUTLOOK_TOKEN_URL = 'https://login.microsoftonline.com/common/oauth2/v2.0/token';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ success: false, message: 'Authorization code not found' }, { status: 400 });
  }

  try {
    const response = await axios.post(OUTLOOK_TOKEN_URL, new URLSearchParams({
      client_id: process.env.EXCHANGE_CLIENT_ID,
      client_secret: process.env.EXCHANGE_CLIENT_SECRET,
      code,
      redirect_uri: 'http://localhost:3000/api/outlook/callback',
      grant_type: 'authorization_code',
    }));

    const { access_token } = response.data;

    // Store the access token securely (e.g., in a database or session)

    return NextResponse.json({ success: true, message: 'Connected to Outlook Calendar successfully!' });
  } catch (error) {
    console.error('Error exchanging authorization code for token:', error);
    return NextResponse.json({ success: false, message: 'Error connecting to Outlook Calendar' }, { status: 500 });
  }
}
