import { NextResponse } from 'next/server';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { encrypt } from '@/utils/encryption';

// Initialize Firebase Admin SDK
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

if (!serviceAccount) {
  throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY is not set');
}

const app = initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore(app);

export async function POST(request) {
  try {
    const { email, appSpecificPassword, userId } = await request.json();

    // Encrypt credentials
    const encryptedEmail = encrypt(email);
    const encryptedPassword = encrypt(appSpecificPassword);

    // Store encrypted credentials in Firestore
    await db.collection('appleCalendarTokens').doc(userId).set({
      email: encryptedEmail,
      password: encryptedPassword,
      connectedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, message: 'Apple Calendar connected successfully.' });
  } catch (error) {
    console.error('Error connecting to Apple Calendar:', error);
    return NextResponse.json({ success: false, message: 'Failed to connect to Apple Calendar.' }, { status: 500 });
  }
}
