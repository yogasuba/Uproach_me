import { google } from 'googleapis';
import { getOAuth2Client } from './googleAuth';

const calendar = google.calendar('v3');

export const getCalendarEvents = async (authToken) => {
  const oauth2Client = getOAuth2Client();
  oauth2Client.setCredentials({ access_token: authToken });

  const res = await calendar.events.list({
    calendarId: 'primary',
    auth: oauth2Client,
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
    timeMin: new Date().toISOString(),
  });

  return res.data.items;
};
