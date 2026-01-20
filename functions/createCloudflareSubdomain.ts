import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Authenticate user
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { subdomain, targetIp = '135.181.42.223' } = body;

    if (!subdomain) {
      return Response.json({ error: 'Subdomain is required' }, { status: 400 });
    }

    // Validate subdomain format
    if (!/^[a-z0-9-]+$/.test(subdomain)) {
      return Response.json({ error: 'Invalid subdomain format' }, { status: 400 });
    }

    const zoneId = Deno.env.get('CLOUDFLARE_ZONE_ID');
    const apiToken = Deno.env.get('CLOUDFLARE_API_TOKEN');

    if (!zoneId || !apiToken) {
      return Response.json({ error: 'Cloudflare credentials not configured' }, { status: 500 });
    }

    // Create DNS A record for subdomain.rentapog.com
    const dnsRecord = {
      type: 'A',
      name: subdomain,
      content: targetIp,
      ttl: 1, // Auto (Cloudflare proxy)
      proxied: true
    };

    const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dnsRecord)
    });

    const result = await response.json();

    if (!result.success) {
      return Response.json({ 
        error: 'Failed to create DNS record', 
        details: result.errors 
      }, { status: 500 });
    }

    return Response.json({
      success: true,
      subdomain: `${subdomain}.rentapog.com`,
      recordId: result.result.id
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});