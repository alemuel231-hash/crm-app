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
    // Read the file as binary buffer to handle mixed encodings safely
    let buffer = fs.readFileSync(filePath);
    let content = buffer.toString('utf8'); // Decode as UTF8
    
    let originalContent = content;
    
    // Fix all possible corrupted GH cedi combinations
    content = content.replace(/GH\?/g, 'GH₵');
    content = content.replace(/GH,/g, 'GH₵');
    content = content.replace(/GH\uFFFD,\uFFFD/g, 'GH₵');
    content = content.replace(/GH\uFFFD/g, 'GH₵');
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, Buffer.from(content, 'utf8'));
      console.log('Fixed encoding in:', filePath);
    }
  }
}
