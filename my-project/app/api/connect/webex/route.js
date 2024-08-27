import { NextResponse } from 'next/server';

export async function GET() {
  const { WEBEX_CLIENT_ID } = process.env;
  
  const redirectUri = encodeURIComponent('http://localhost:3000/api/auth/webex-callback');
  
  const webexAuthUrl = `https://webexapis.com/v1/authorize?client_id=${WEBEX_CLIENT_ID}&response_type=code&redirect_uri=${redirectUri}&scope=spark:all&state=your_state`;

  return NextResponse.redirect(webexAuthUrl);
}
