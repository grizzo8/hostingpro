import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import crypto from 'node:crypto';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { domain, years = 1, domainContact } = body;

    if (!domain) {
      return Response.json({ error: 'Domain is required' }, { status: 400 });
    }

    // Get affiliate for the user
    const affiliates = await base44.asServiceRole.entities.Affiliate.filter({ user_email: user.email });
    const affiliate = affiliates[0];

    if (!affiliate) {
      return Response.json({ error: 'Affiliate not found' }, { status: 404 });
    }

    const resellerId = Deno.env.get('OPENSRS_RESELLER_ID');
    const apiKey = Deno.env.get('OPENSRS_API_KEY');

    if (!resellerId || !apiKey) {
      return Response.json({ error: 'OpenSRS credentials not configured' }, { status: 500 });
    }

    // Check domain availability
    const checkBody = {
      protocol: 'XCP',
      action: 'LOOKUP',
      object: 'DOMAIN',
      attributes: {
        domain: domain,
        type: 'status'
      }
    };

    const checkSig = createOpenSRSSignature(checkBody, apiKey);
    
    const checkResponse = await fetch('https://api.opensrs.com:55443/', {
      method: 'POST',
      headers: {
        'X-OPENSRS-SIGNATURE': checkSig,
        'X-OPENSRS-UID': resellerId,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `X-OPENSRS-PROTOCOL=XCP&X-OPENSRS-DATA=${encodeURIComponent(JSON.stringify(checkBody))}`
    });

    const checkData = await checkResponse.text();
    
    if (checkData.includes('status: available') === false) {
      return Response.json({ error: 'Domain not available' }, { status: 400 });
    }

    // Register domain
    const registerBody = {
      protocol: 'XCP',
      action: 'CREATE',
      object: 'DOMAIN',
      attributes: {
        domain: domain,
        period: years,
        nameservers: [
          'ns1.openserversspeedydns.com',
          'ns2.openserversspeedydns.com'
        ],
        contact_set: {
          admin: domainContact || {
            first_name: user.full_name?.split(' ')[0] || 'Admin',
            last_name: user.full_name?.split(' ')[1] || 'User',
            email: user.email,
            phone: '+1.2025550123',
            address1: '123 Main St',
            city: 'Anytown',
            state: 'CA',
            postal_code: '12345',
            country: 'US'
          },
          billing: domainContact || {
            first_name: user.full_name?.split(' ')[0] || 'Admin',
            last_name: user.full_name?.split(' ')[1] || 'User',
            email: user.email,
            phone: '+1.2025550123',
            address1: '123 Main St',
            city: 'Anytown',
            state: 'CA',
            postal_code: '12345',
            country: 'US'
          },
          tech: domainContact || {
            first_name: user.full_name?.split(' ')[0] || 'Admin',
            last_name: user.full_name?.split(' ')[1] || 'User',
            email: user.email,
            phone: '+1.2025550123',
            address1: '123 Main St',
            city: 'Anytown',
            state: 'CA',
            postal_code: '12345',
            country: 'US'
          }
        }
      }
    };

    const registerSig = createOpenSRSSignature(registerBody, apiKey);

    const registerResponse = await fetch('https://api.opensrs.com:55443/', {
      method: 'POST',
      headers: {
        'X-OPENSRS-SIGNATURE': registerSig,
        'X-OPENSRS-UID': resellerId,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `X-OPENSRS-PROTOCOL=XCP&X-OPENSRS-DATA=${encodeURIComponent(JSON.stringify(registerBody))}`
    });

    const registerData = await registerResponse.json();

    if (registerData.reply_code !== 0) {
      return Response.json({ error: registerData.reply_msg || 'Domain registration failed' }, { status: 400 });
    }

    // Create domain record in database
    const domainRecord = await base44.asServiceRole.entities.Domain.create({
      affiliate_id: affiliate.id,
      affiliate_email: user.email,
      domain_name: domain,
      registration_date: new Date().toISOString(),
      years: years,
      status: 'active',
      opensrs_order_id: registerData.attributes?.order_id || null
    });

    // Create referral/commission for domain registration
    const domainPrice = 10; // $10 per domain registration
    const commission = domainPrice * 0.5; // 50% commission

    const referral = await base44.asServiceRole.entities.Referral.create({
      affiliate_id: affiliate.id,
      customer_email: user.email,
      customer_name: user.full_name,
      package_name: `Domain: ${domain}`,
      sale_amount: domainPrice,
      commission_amount: commission,
      status: 'approved',
      is_recurring: false,
      referral_source: 'domain_registration'
    });

    // Update affiliate balance
    await base44.asServiceRole.entities.Affiliate.update(affiliate.id, {
      pending_balance: (affiliate.pending_balance || 0) + commission,
      total_earnings: (affiliate.total_earnings || 0) + commission
    });

    return Response.json({
      success: true,
      domain: domainRecord,
      commission: commission,
      message: `Domain registered successfully! You earned $${commission.toFixed(2)} commission.`
    });
  } catch (error) {
    console.error('Domain registration error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function createOpenSRSSignature(body, apiKey) {
  const bodyString = JSON.stringify(body);
  const message = bodyString + apiKey;
  return crypto.createHash('md5').update(message).digest('hex');
}