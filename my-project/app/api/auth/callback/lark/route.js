// app/api/auth/callback/lark/route.js
import { NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import admin from 'firebase-admin';
import axios from 'axios';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect('/calendar?error=NoCode');
  }

  try {
    const response = await axios.post('https://open.larksuite.com/open-apis/auth/v3/app_access_token/internal', {
      app_id: process.env.LARK_CLIENT_ID,
      app_secret: process.env.LARK_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/lark`,
    });

    const { access_token } = response.data;

    // Store access token in Firebase
    const db = getFirestore();
    const userRef = db.collection('users').doc('your-unique-user-id');
    await userRef.set({ larkAccessToken: access_token }, { merge: true });

    return NextResponse.redirect('/calendar?connected=Lark');
  } catch (error) {
    console.error('Lark OAuth Error:', error);
    return NextResponse.redirect('/calendar?error=OAuthFailed');
  }
}
