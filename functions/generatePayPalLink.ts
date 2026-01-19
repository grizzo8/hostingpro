import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { packageId, billingType } = body;

    if (!packageId || !billingType) {
      return Response.json({ error: 'Missing packageId or billingType' }, { status: 400 });
    }

    // Get package details using service role
    const pkg = await base44.asServiceRole.entities.HostingPackage.get(packageId);
    if (!pkg) {
      return Response.json({ error: 'Package not found' }, { status: 404 });
    }

    const amount = billingType === 'daily' ? pkg.daily_price : pkg.monthly_price;
    const clientId = Deno.env.get('PAYPAL_CLIENT_ID');
    const clientSecret = Deno.env.get('PAYPAL_API_SECRET');

    // Get PayPal access token
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

    // Create PayPal order
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
          description: `${pkg.name} - ${billingType === 'daily' ? 'Daily' : 'Monthly'} Plan`
        }],
        payment_source: {
          paypal: {
            experience_context: {
              return_url: `${new URL(req.url).origin}/packages?success=true`,
              cancel_url: `${new URL(req.url).origin}/packages?cancelled=true`
            }
          }
        }
      })
    });

    const orderData = await orderRes.json();
    if (!orderData.id) {
      return Response.json({ error: 'Failed to create PayPal order' }, { status: 500 });
    }

    // Find the approval link
    const approvalLink = orderData.links.find(link => link.rel === 'approve')?.href;

    return Response.json({ 
      paypalUrl: approvalLink,
      orderId: orderData.id
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});