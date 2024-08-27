export default function handler(req, res) {
    const clientId = process.env.AROUND_CLIENT_ID;
    const redirectUri = 'https://yourapp.com/api/auth/around-callback';
    const state = 'someRandomState'; // Replace with a better state management approach
  
    const authorizationUrl = `https://api.around.co/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&state=${state}`;
    res.redirect(authorizationUrl);
  }
  