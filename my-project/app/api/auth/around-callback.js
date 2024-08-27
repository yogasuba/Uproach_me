export default async function handler(req, res) {
    const code = req.query.code;
  
    if (!code) {
      res.status(400).json({ error: 'Authorization code is missing' });
      return;
    }
  
    const tokenResponse = await fetch('https://api.around.co/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.AROUND_CLIENT_ID,
        client_secret: process.env.AROUND_CLIENT_SECRET,
        code: code,
        redirect_uri: 'https://yourapp.com/api/auth/around-callback',
        grant_type: 'authorization_code',
      }),
    });
  
    const tokenData = await tokenResponse.json();
  
    if (tokenData.error) {
      res.status(400).json({ error: tokenData.error });
    } else {
      // Save the access token securely (e.g., in a database or session)
      // Redirect to your desired page
      res.redirect('/connect-video?connected=around');
    }
  }
  