import { NextResponse } from 'next/server';

export async function GET(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  try {
    // Exchange the authorization code for an access token
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: 'http://localhost:3000/api/google/callback', // Match with your registered redirect URI
        grant_type: 'authorization_code',
      }),
    });

    const data = await response.json();

    if (response.ok && data.access_token) {
      // You have the access token, store it if necessary, and then redirect
      return NextResponse.redirect('/connected-calendar');
    } else {
      // Log error for debugging
      console.error('Error fetching access token:', data);
      return NextResponse.redirect('/connect-calendar'); // Redirect to error page
    }
  } catch (error) {
    console.error('Error during Google OAuth flow:', error);
    return NextResponse.redirect('/connect-calendar');
  }
}
