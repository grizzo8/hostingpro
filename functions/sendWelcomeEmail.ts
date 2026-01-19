import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email, full_name, password, subdomain } = await req.json();

    if (!email || !password || !subdomain) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const emailBody = `
Hi ${full_name},

Welcome to HostingPro Affiliate Program! 🎉

Your account has been created. Here are your login credentials:

📧 Email: ${email}
🔐 Password: ${password}
🌐 Your Site: ${subdomain}.hostingpro.com

IMPORTANT: You are currently logged in. To maintain access to your dashboard and promotional features, please DO NOT log out right now.

Next Steps:
1. ✅ You're already logged in - dashboard is ready
2. Add your PayPal email in the dashboard settings (required to receive payouts)
3. Start promoting your referral link
4. Once you get 3 referrals, daily payouts activate!

Promotional Benefits:
- Exclusive partner offers
- Monthly bonus opportunities
- Early access to new packages

REMEMBER: Keep your password safe. You can change it anytime in settings.

Questions? Contact us at support@hostingpro.com

Happy promoting!
HostingPro Team
`;

    await base44.integrations.Core.SendEmail({
      to: email,
      subject: `Welcome to HostingPro! Your Login: ${email}`,
      body: emailBody
    });

    return Response.json({ success: true, message: 'Welcome email sent' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});