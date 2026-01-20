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
    const useSandbox = Deno.env.get('PAYPAL_SANDBOX') === 'true';
    const clientId = Deno.env.get('PAYPAL_SANDBOX_CLIENT_ID');
    const clientSecret = Deno.env.get('PAYPAL_SECRET');
    const baseUrl = useSandbox ? 'https://api.sandbox.paypal.com' : 'https://api.paypal.com';

    const authString = btoa(`${clientId}:${clientSecret}`);
    const tokenRes = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });

    const tokenData = await tokenRes.json();
    console.log('PayPal token response:', JSON.stringify(tokenData, null, 2));
    if (!tokenData.access_token) {
      return Response.json({ error: 'Failed to get PayPal token', details: tokenData }, { status: 500 });
    }

    // Get the app URL from environment or use the referer header
    const appUrl = Deno.env.get('APP_URL') || req.headers.get('referer')?.split('/#/')[0] || 'https://sales1.rentapog.com';
    const returnUrl = `${appUrl}/#/AffiliateDashboard?payment=success&packageId=${packageId}` + (referralCode ? `&referralCode=${referralCode}` : '');
    const cancelUrl = `${appUrl}/#/Packages`;

    const orderRes = await fetch(`${baseUrl}/v2/checkout/orders`, {
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
              cancel_url: cancelUrl
            }
          }
        }
      })
    });

    const orderData = await orderRes.json();
    
    // Log the full response for debugging
    console.log('PayPal order response:', JSON.stringify(orderData, null, 2));
    
    if (!orderData.id) {
      return Response.json({ 
        error: 'Failed to create PayPal order', 
        details: orderData 
      }, { status: 500 });
    }

    // PayPal may return different link rel types
    const approvalLink = orderData.links?.find(link => 
      link.rel === 'approve' || link.rel === 'payer-action'
    )?.href;
    
    if (!approvalLink) {
      return Response.json({ 
        error: 'No payment link available',
        details: orderData 
      }, { status: 500 });
    }

    return Response.json({ 
      paypalUrl: approvalLink,
      orderId: orderData.id
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});