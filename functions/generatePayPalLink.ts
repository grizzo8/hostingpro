import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { packageId, billingType, referralCode } = body;

    if (!packageId || !billingType) {
      return Response.json({ error: 'Missing packageId or billingType' }, { status: 400 });
    }

    const pkg = await base44.asServiceRole.entities.HostingPackage.get(packageId);
    if (!pkg) {
      return Response.json({ error: 'Package not found' }, { status: 404 });
    }

    const amount = billingType === 'daily' ? pkg.daily_price : pkg.monthly_price;
    const clientId = Deno.env.get('PAYPAL_CLIENT_ID');
    const clientSecret = Deno.env.get('PAYPAL_API_SECRET');

    const authString = btoa(`${clientId}:${clientSecret}`);
    const tokenRes = await fetch('https://api.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      return Response.json({ error: 'Failed to get PayPal token' }, { status: 500 });
    }

    const returnUrl = new URL(req.url).origin + '/packages?success=true' + (referralCode ? `&ref=${referralCode}` : '');
    
    const orderRes = await fetch('https://api.paypal.com/v2/checkout/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: amount.toFixed(2)
          },
          description: `${pkg.name} - ${billingType === 'daily' ? 'Daily' : 'Monthly'} Plan`,
          custom_id: referralCode || 'direct'
        }],
        payment_source: {
          paypal: {
            experience_context: {
              return_url: returnUrl,
              cancel_url: new URL(req.url).origin + '/packages'
            }
          }
        }
      })
    });

    const orderData = await orderRes.json();
    if (!orderData.id) {
      return Response.json({ error: 'Failed to create PayPal order' }, { status: 500 });
    }

    const approvalLink = orderData.links?.find(link => link.rel === 'approve')?.href;
    if (!approvalLink) {
      return Response.json({ error: 'No payment link available' }, { status: 500 });
    }

    return Response.json({ 
      paypalUrl: approvalLink,
      orderId: orderData.id
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});