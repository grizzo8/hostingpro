import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    const body = await req.json();
    const { email, full_name, password, referralCode } = body;

    if (!email || !full_name || !password) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const resendApiKey = Deno.env.get('RESEND_API_SECRET');
    if (!resendApiKey) {
      return Response.json({ error: 'Email service not configured' }, { status: 500 });
    }

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Welcome to HostingPro Affiliate Program!</h2>
        <p>Hi ${full_name},</p>
        <p>Thank you for signing up through our affiliate program! Here are your login credentials:</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 5px 0;"><strong>Password:</strong> ${password}</p>
          <p style="margin: 5px 0;"><strong>Dashboard:</strong> <a href="https://sales1.rentapog.com/#/AffiliateDashboard">Login Here</a></p>
        </div>

        <p>You can now browse our packages and make your first purchase to start earning commissions!</p>
        
        ${referralCode ? `<p style="color: #059669;">You were referred by: <strong>${referralCode}</strong></p>` : ''}
        
        <p style="margin-top: 30px;">Best regards,<br/>The HostingPro Team</p>
      </div>
    `;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'HostingPro <noreply@rentapog.com>',
        to: [email],
        subject: 'Welcome to HostingPro - Your Login Credentials',
        html: emailHtml
      })
    });

    const result = await response.json();

    if (!response.ok) {
      return Response.json({ error: 'Failed to send email', details: result }, { status: 500 });
    }

    return Response.json({ success: true, emailId: result.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});