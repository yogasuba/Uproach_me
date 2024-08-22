import { google } from 'googleapis';

// Configure OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export const getGoogleAuthUrl = () => {
  const scopes = ['https://www.googleapis.com/auth/calendar'];
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });
};

export const getOAuth2Client = () => oauth2Client;
