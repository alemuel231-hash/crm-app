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
  walk(dir, processFile);
});

function processFile(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.js') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Very broad regex to catch GH followed by garbage before a bracket, number, or space
    content = content.replace(/GH[^a-zA-Z0-9\n]{1,6}\{/g, 'GH₵{');
    content = content.replace(/GH[^a-zA-Z0-9\n]{1,6}</g, 'GH₵<');
    content = content.replace(/GH[^a-zA-Z0-9\n]{1,6}\(/g, 'GH₵(');
    content = content.replace(/GH[^a-zA-Z0-9\n]{1,6} /g, 'GH₵ ');
    content = content.replace(/Budget \(GH[^\)]+\)/g, 'Budget (GH₵)');
    
    // Also change standard dollar signs
    content = content.replace(/\(\$\)/g, '(GH₵)');
    content = content.replace(/\$([0-9])/g, 'GH₵GH₵1');
    content = content.replace(/>\$/g, '>GH₵ 
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Fixed broken Cedi in:', filePath);
    }
  }
}
