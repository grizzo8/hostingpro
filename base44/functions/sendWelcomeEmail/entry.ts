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

    const emailBody = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(to right, #dc2626, #2563eb); color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 30px; }
    .header h1 { margin: 0; font-size: 28px; }
    .section { margin-bottom: 25px; }
    .section-title { font-size: 16px; font-weight: bold; color: #dc2626; margin-bottom: 12px; border-bottom: 2px solid #dc2626; padding-bottom: 8px; }
    .credentials { background: #f3f4f6; padding: 15px; border-radius: 6px; border-left: 4px solid #dc2626; }
    .credential-row { margin-bottom: 10px; }
    .credential-label { font-weight: bold; color: #374151; }
    .credential-value { color: #1f2937; }
    .steps { background: #f9fafb; padding: 15px; border-radius: 6px; }
    .step { margin-bottom: 12px; padding-left: 10px; }
    .benefits { background: #fef2f2; padding: 15px; border-radius: 6px; border-left: 4px solid #2563eb; }
    .benefit { margin-bottom: 8px; padding-left: 10px; }
    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; }
    .cta-button { display: inline-block; background: linear-gradient(to right, #dc2626, #2563eb); color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; margin-top: 15px; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to HostingPro! 🎉</h1>
    </div>

    <p>Hi ${full_name},</p>
    
    <p>Your affiliate account has been successfully created. You're all set to start earning!</p>

    <div class="section">
      <div class="section-title">Your Login Credentials</div>
      <div class="credentials">
        <div class="credential-row">
          <span class="credential-label">📧 Email:</span>
          <span class="credential-value">${email}</span>
        </div>
        <div class="credential-row">
          <span class="credential-label">🔐 Password:</span>
          <span class="credential-value">${password}</span>
        </div>
        <div class="credential-row">
          <span class="credential-label">🌐 Your Site:</span>
          <span class="credential-value">${subdomain}.hostingpro.com</span>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Next Steps</div>
      <div class="steps">
        <div class="step">✅ <strong>Dashboard Ready</strong> - You're already logged in</div>
        <div class="step">💰 Add your PayPal email in settings (required for payouts)</div>
        <div class="step">🔗 Start promoting your referral link</div>
        <div class="step">🎯 After 3 referrals, earn $5/day automatic payouts!</div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Promotional Benefits</div>
      <div class="benefits">
        <div class="benefit">⭐ Exclusive partner offers</div>
        <div class="benefit">💎 Monthly bonus opportunities</div>
        <div class="benefit">🚀 Early access to new packages</div>
      </div>
    </div>

    <div class="section">
      <p><strong>⚠️ Important:</strong> Do NOT log out right now. Your dashboard access and promotional features depend on staying logged in.</p>
      <p>Keep your password safe and change it anytime in your settings.</p>
    </div>

    <p>Questions? Contact us at <strong>support@hostingpro.com</strong></p>

    <div class="footer">
      <p>© 2026 HostingPro. All rights reserved.<br>
      You're receiving this because you signed up for the HostingPro Affiliate Program.</p>
    </div>
  </div>
</body>
</html>
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