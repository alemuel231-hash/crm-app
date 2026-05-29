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
    ['fix_generated_pages.js', 'rebuild_ride_modules.js'].forEach(f => {
      let p = path.join(dir, f);
      if (fs.existsSync(p)) processFile(p);
    });
  } else {
    walk(dir, processFile);
  }
});

function processFile(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.js') || filePath.endsWith('.ts')) {
    let buffer = fs.readFileSync(filePath);
    let hex = buffer.toString('hex');
    
    // GH is 4748
    // The broken bytes for the Cedi are e282ace2809ae2809a or something similar
    // Actually, simpler: buffer to utf8, and globally replace all "GH₵ followed by non-ascii characters before the $
    
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Look for GH followed by any sequence of characters that is not A-Za-z0-9, up to $ or {
    content = content.replace(/GH[^\w\s{]+{/g, 'GH₵{');
    content = content.replace(/GH[^\w\s{]+</g, 'GH₵<');
    content = content.replace(/GH[^\w\s{]+ /g, 'GH₵ ');
    content = content.replace(/Budget \(GH[^\)]+\)/g, 'Budget (GH₵)');
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Fixed broken Cedi in:', filePath);
    }
  }
}
