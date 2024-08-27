// app/api/auth/graph/route.js
import { NextResponse } from 'next/server';
import fetch from 'node-fetch';

export async function GET(request) {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');

    if (!code) {
        return NextResponse.redirect('/error');
    }

    try {
        const tokenResponse = await fetch(`https://login.microsoftonline.com/${process.env.GRAPH_TENANT_ID}/oauth2/v2.0/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                client_id: process.env.GRAPH_CLIENT_ID,
                client_secret: process.env.GRAPH_CLIENT_SECRET,
                code,
                redirect_uri: process.env.REDIRECT_URI,
                scope: 'openid profile User.Read Calendars.ReadWrite'
            })
        });

        const data = await tokenResponse.json();

        if (data.access_token) {
            // Save access token (e.g., in session or database)
            // Redirect to connect calendar page
            return NextResponse.redirect('/connect-calendar');
        } else {
            console.error('Failed to obtain access token:', data);
            return NextResponse.redirect('/error');
        }
    } catch (error) {
        console.error('Error during token exchange:', error);
        return NextResponse.redirect('/error');
    }
}
