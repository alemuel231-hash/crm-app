const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    if (f === 'node_modules' || f === '.next' || f === '.git') return;
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

const dirsToCheck = [
  path.join(__dirname, 'src', 'app', 'crm'),
  path.join(__dirname, 'src', 'components'),
  __dirname
];

dirsToCheck.forEach(dir => {
  if (dir === __dirname) {
    ['rebuild_ride_modules.js'].forEach(f => {
      let p = path.join(dir, f);
      if (fs.existsSync(p)) processFile(p);
    });
  } else {
    walk(dir, processFile);
  }
});

function processFile(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.js') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Replace all variations of GH? GH, GH₵ with GHS
    content = content.replace(/GH[^\w\s\$\{\(\<]+/g, 'GHS ');
    content = content.replace(/GH₵/g, 'GHS ');
    
    // If it became GHS ${ it is correct.
    // Let's fix specific dashboard variables safely if they lost their $
    content = content.replace(/GHS \{/g, 'GHS ${');
    content = content.replace(/GHS \(\{/g, 'GHS (${');
    content = content.replace(/GHS \(/g, 'GHS ${'); // if `GHS (totalRevenue...` occurred
    
    // Check specific broken stuff from previous attempts:
    content = content.replace(/GHS \$\{totalRevenue - \\ncashRevenue\}\.toFixed\(2\)\}/g, 'GHS ${(totalRevenue - cashRevenue).toFixed(2)}');
    content = content.replace(/GHS \$\(totalRevenue - \\ncashRevenue\)\.toFixed\(2\)\}/g, 'GHS ${(totalRevenue - cashRevenue).toFixed(2)}');
    
    // Rebuild ride module specific fix for missing $
    content = content.replace(/GHS \$\{totalRevenue\./g, 'GHS ${totalRevenue.');
    content = content.replace(/GHS \$\(totalRevenue -/g, 'GHS ${(totalRevenue -');
    
    // Also remove the "Budget (GH,)]">" syntax error in generated files (if any remain)
    content = content.replace(/Budget \(GHS [^\)]*\)\]">/g, 'Budget (GHS)</th>');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Fixed GHS in:', filePath);
    }
  }
}
