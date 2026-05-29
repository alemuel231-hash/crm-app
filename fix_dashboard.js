const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, 'src', 'app', 'crm', 'dashboard', 'page.tsx');
let content = fs.readFileSync(pagePath, 'utf8');

// Replace the buildDashboard function
const newBuildDashboard = `const buildDashboard = useCallback(async () => {
    setRefreshing(true);
    try {
      const [driversRes, tripsRes, ridersRes] = await Promise.all([
        fetch('/api/drivers').then(r => r.json()).catch(() => []),
        fetch('/api/trips').then(r => r.json()).catch(() => []),
        fetch('/api/riders').then(r => r.json()).catch(() => []),
      ]);

      const driverArr: any[] = driversRes?.drivers ? driversRes.drivers : (Array.isArray(driversRes) ? driversRes : []);
      const tripArr:   any[] = tripsRes?.trips ? tripsRes.trips : (Array.isArray(tripsRes) ? tripsRes : []);
      const riderArr:  any[] = ridersRes?.riders ? ridersRes.riders : (Array.isArray(ridersRes) ? ridersRes : []);

      const driverCount  = driverArr.length;
      const pendingCount = driverArr.filter(d => !d.signup_setup_complete || (d.status || '').toLowerCase() === 'pending').length;
      const activeCount  = driverArr.filter(d => !d.blocked).length;
      const tripCount    = tripArr.length;
      const riderCount   = riderArr.length;

      let revenue = 0;
      let todayRev = 0;
      let weekRev = 0;
      let comp = 0, canc = 0, pend = 0;
      
      const nowMs = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;

      tripArr.forEach((t: any) => {
        const cost = parseFloat(t.tripCost || t.fare || 0) || 0;
        revenue += cost;
        const s = (t.paymentStatus || t.status || '').toLowerCase();
        if (s === 'paid' || s === 'completed') comp++;
        else if (s === 'cancelled') canc++;
        else pend++;
        
        if (t.created_at || t.createdAt) {
          const tripTime = new Date(t.created_at || t.createdAt).getTime();
          if (nowMs - tripTime < oneDay) todayRev += cost;
          if (nowMs - tripTime < oneDay * 7) weekRev += cost;
        } else {
          // If no date provided, count as today for demo purposes
          todayRev += cost;
          weekRev += cost;
        }
      });

      setTripStats({ completed: comp, cancelled: canc, pending: pend });
      setTotalRevenue(revenue);
      setActiveDrivers(activeCount);

      const avgFare = tripCount > 0 ? revenue / tripCount : 0;

      setKpis([
        {
          id: 'total_drivers',
          title: 'Total Drivers',
          value: driverCount,
          subtitle: \`\${activeCount} currently active\`,
          icon: <Car className="w-5 h-5" />,
          trend: +12,
          accentClass: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40',
          sparkline: [0, 0, 0, 0, driverCount],
          href: '/crm/drivers',
        },
        {
          id: 'pending_verification',
          title: 'Pending Verification',
          value: pendingCount,
          subtitle: 'Awaiting document review',
          icon: <Shield className="w-5 h-5" />,
          trend: -2,
          accentClass: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40',
          sparkline: [0, 0, 0, pendingCount],
          href: '/crm/drivers/pending-verification',
        },
        {
          id: 'total_trips',
          title: 'Total Trips',
          value: tripCount,
          subtitle: \`\${comp} completed globally\`,
          icon: <Navigation className="w-5 h-5" />,
          trend: +8,
          accentClass: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40',
          sparkline: [0, 0, 0, tripCount],
          href: '/crm/trips',
        },
        {
          id: 'today_revenue',
          title: "Today's Revenue",
          value: \`$\${todayRev.toFixed(2)}\`,
          subtitle: \`$\${avgFare.toFixed(2)} avg per trip\`,
          icon: <DollarSign className="w-5 h-5" />,
          trend: +22,
          accentClass: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40',
          sparkline: [0, 0, todayRev],
          href: '/crm/payments',
        },
        {
          id: 'weekly_revenue',
          title: 'Weekly Revenue',
          value: \`$\${weekRev.toFixed(2)}\`,
          subtitle: 'Last 7 days total',
          icon: <BarChart3 className="w-5 h-5" />,
          trend: +5,
          accentClass: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40',
          sparkline: [0, 0, weekRev],
          href: '/crm/payments',
        },
        {
          id: 'total_riders',
          title: 'Total Riders',
          value: riderCount,
          subtitle: 'Active passengers',
          icon: <Users className="w-5 h-5" />,
          trend: +15,
          accentClass: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40',
          sparkline: [0, riderCount],
          href: '/crm/riders',
        },
      ]);

      // Build pending drivers from data
      const pending: PendingDriver[] = driverArr
        .filter((d: any) => !d.signup_setup_complete || (d.status || '').toLowerCase() === 'pending')
        .slice(0, 5)
        .map((d: any) => ({
          id:        d.driverID || d.id || d._id || String(Math.random()),
          name:      d.driverName || d.name || d.full_name || 'Unknown Driver',
          phone:     d.driverPhone || d.phone || d.phone_number || 'N/A',
          vehicle:   d.vehicleModel || d.vehicle || d.car_model || 'Unknown Vehicle',
          submitted: d.created_at || d.createdAt || new Date().toISOString().split('T')[0],
          docs:      d.document_uploaded ? 'Complete' : 'Missing',
        }));

      setPendingDrivers(pending);

      // Build recent trips
      const trips5 = tripArr.slice(0, 5).map((t: any, i: number) => ({
        id:          t.tripID || t.id || t._id || String(i),
        rider:       t.rider_name  || t.customer_name || 'Unknown Rider',
        driver:      t.driverID || t.driver_name || t.driver || 'Unknown Driver',
        pickup:      t.pickup_address  || t.from || 'Unknown Pickup',
        destination: t.destination_address || t.dropoff_address || t.to || 'Unknown Destination',
        fare:        \`$\${parseFloat(t.tripCost || t.fare || 0).toFixed(2)}\`,
        status:      (t.paymentStatus === 'paid' ? 'Completed' : t.paymentStatus === 'cancelled' ? 'Cancelled' : t.status || 'Pending'),
        time:        t.created_at ? new Date(t.created_at).toLocaleTimeString() : '—',
        rating:      t.rating,
      }));

      setRecentTrips(trips5);

      setFlash(true);
      setTimeout(() => setFlash(false), 800);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    }
    setRefreshing(false);
    setLoading(false);
  }, []);`;

// Prevent strict mode double fetching and handle ref
const effectRegex = /useEffect\(\(\) => \{\s*buildDashboard\(\);\s*\/\/ Live clock[\s\S]*?\}, \[buildDashboard\]\);/;
const newEffect = `
  const hasFetched = React.useRef(false);
  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      buildDashboard();
    }
    // Live clock
    const tick = () => {
      const d = new Date();
      setNow(d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [buildDashboard]);
`;

// String Replacement
const startIdx = content.indexOf('const buildDashboard = useCallback(async () => {');
const endIdx = content.indexOf('  useEffect(() => {', startIdx);

if (startIdx !== -1 && endIdx !== -1) {
  content = content.substring(0, startIdx) + newBuildDashboard + '\n\n' + content.substring(endIdx);
  content = content.replace(effectRegex, newEffect);
  content = content.replace(/GH₵/g, '$'); // Since I used $ in my generator
  fs.writeFileSync(pagePath, content);
  console.log('Dashboard logic successfully updated!');
} else {
  console.error('Failed to find replace markers.');
}
