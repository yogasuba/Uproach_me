import { NextResponse } from 'next/server';
import axios from 'axios';

const OUTLOOK_AUTH_URL = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize';
const OUTLOOK_REDIRECT_URI = 'http://localhost:3000/api/outlook/callback'; // Replace with your redirect URI

export async function GET() {
  try {
    const authUrl = `${OUTLOOK_AUTH_URL}?client_id=${process.env.EXCHANGE_CLIENT_ID}&response_type=code&redirect_uri=${OUTLOOK_REDIRECT_URI}&response_mode=query&scope=openid%20profile%20offline_access%20https://outlook.office.com/calendars.readwrite`;
    return NextResponse.json({ url: authUrl });
  } catch (error) {
    console.error('Error generating Outlook auth URL:', error);
    return NextResponse.json({ success: false, message: 'Error generating Outlook auth URL' }, { status: 500 });
  }
}
