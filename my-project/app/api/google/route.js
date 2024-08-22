import { google } from 'googleapis';

export async function GET(request) {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } = process.env;

  const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI
  );

  const scopes = ['https://www.googleapis.com/auth/calendar'];

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: scopes,
  });

  return new Response(JSON.stringify({ url }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
