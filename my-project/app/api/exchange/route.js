import { NextResponse } from 'next/server';
import fetch from 'node-fetch';

export async function POST() {
  try {
    // OAuth 2.0 Token Endpoint
    const tokenEndpoint = `https://login.microsoftonline.com/${process.env.EXCHANGE_TENANT_ID}/oauth2/v2.0/token`;

    // Request token
    const tokenResponse = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.EXCHANGE_CLIENT_ID,
        client_secret: process.env.EXCHANGE_CLIENT_SECRET,
        scope: 'https://graph.microsoft.com/.default',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      throw new Error('Failed to obtain access token');
    }

    // Example API request to Microsoft Graph API
    const userProfileResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    const userProfile = await userProfileResponse.json();

    return NextResponse.json({ success: true, profile: userProfile });

  } catch (error) {
    console.error('Error connecting to Exchange:', error);
    return NextResponse.json({ success: false, message: error.message });
  }
}
