import { NextResponse } from 'next/server';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import caldav from 'node-caldav';
import { decrypt } from '@/utils/encryption';

// Initialize Firebase Admin SDK
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

if (!serviceAccount) {
  throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY is not set');
}

const app = initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore(app);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, message: 'User ID is required.' }, { status: 400 });
    }

    const doc = await db.collection('appleCalendarTokens').doc(userId).get();

    if (!doc.exists) {
      return NextResponse.json({ success: false, message: 'No credentials found for user.' }, { status: 404 });
    }

    const { email, password } = doc.data();

    const decryptedEmail = decrypt(email);
    const decryptedPassword = decrypt(password);

    const client = new caldav.Connection({
      username: decryptedEmail,
      password: decryptedPassword,
      host: 'caldav.icloud.com',
      ssl: true,
    });

    // Fetch calendar events
    const calendars = await caldav.listCalendars(client);

    const events = [];
    for (const calendar of calendars) {
      const calendarEvents = await caldav.listEvents(calendar);
      events.push(...calendarEvents);
    }

    return NextResponse.json({ success: true, events });
  } catch (error) {
    console.error('Error fetching Apple Calendar events:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch calendar events.' }, { status: 500 });
  }
}
