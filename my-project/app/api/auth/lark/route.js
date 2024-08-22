import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.LARK_CLIENT_ID;
  const redirectUri = encodeURIComponent('http://localhost:3000/api/auth/callback/lark');
  const scope = 'calendar:readonly calendar:write';

  const larkAuthUrl = `https://open.feishu.cn/connect/qrconnect/page/sso/?app_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=your_state_value`;

  return NextResponse.redirect(larkAuthUrl);
}
