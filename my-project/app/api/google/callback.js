import { NextResponse } from 'next/server';

export async function GET(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  // Exchange the authorization code for an access token
  // You might use a library like 'googleapis' or directly make HTTP requests to Google API

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: 'http://localhost:3000/api/auth/callback/google',
      grant_type: 'authorization_code',
    }),
  });

  const data = await response.json();

  if (data.access_token) {
    // You have the access token, you can use it to access Google Calendar API
    // Redirect to the appropriate page
    return NextResponse.redirect('/connected-calendar');
  }

  // Handle errors or invalid token
  return NextResponse.redirect('/connect-calendar');
}
