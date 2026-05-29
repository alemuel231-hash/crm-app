const fs = require('fs');
const path = require('path');

let f1 = path.join(__dirname, 'fix_generated_pages.js');
if (fs.existsSync(f1)) {
  let c1 = fs.readFileSync(f1, 'utf8');
  c1 = c1.replace(/\(\$\)/g, '(GH₵)');
  fs.writeFileSync(f1, Buffer.from(c1, 'utf8'));
}

let f2 = path.join(__dirname, 'rebuild_ride_modules.js');
if (fs.existsSync(f2)) {
  let c2 = fs.readFileSync(f2, 'utf8');
  // Rebuild ride modules needs literal GH₵ instead of $
  // Look for ${totalRevenue} -> GH₵${totalRevenue}
  // Let's just fix it by downloading the exact version we had before the mess, or we just write a brand new script to rebuild all 18 generic + 5 ride pages safely!
}
