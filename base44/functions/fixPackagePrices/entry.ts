import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all packages
    const packages = await base44.asServiceRole.entities.HostingPackage.list();

    // Update each package with calculated daily_price and monthly_price
    for (const pkg of packages) {
      // If daily_price is missing, calculate it (use 50% of daily_payout as daily_price, or default)
      const dailyPrice = pkg.daily_price || (pkg.daily_payout ? pkg.daily_payout / 4 : 1);
      const monthlyPrice = pkg.monthly_price || (dailyPrice * 28);

      await base44.asServiceRole.entities.HostingPackage.update(pkg.id, {
        daily_price: parseFloat(dailyPrice.toFixed(2)),
        monthly_price: parseFloat(monthlyPrice.toFixed(2))
      });
    }

    return Response.json({ 
      success: true, 
      message: `Updated ${packages.length} packages with pricing`,
      packages: packages.length 
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});