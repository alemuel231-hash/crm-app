const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

const firebaseDir = path.join(__dirname, 'node_modules', '@firebase');

walk(firebaseDir, (filePath) => {
  if (filePath.endsWith('.js') || filePath.endsWith('.ts') || filePath.endsWith('.d.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Revert the corrupted strings caused by the rogue script
    content = content.replace(/GH₵1/g, '$1');
    content = content.replace(/GH₵2/g, '$2');
    content = content.replace(/GH₵3/g, '$3');
    content = content.replace(/GH₵4/g, '$4');
    content = content.replace(/GH₵5/g, '$5');
    content = content.replace(/GH₵6/g, '$6');
    content = content.replace(/GH₵7/g, '$7');
    content = content.replace(/GH₵8/g, '$8');
    content = content.replace(/GH₵9/g, '$9');
    content = content.replace(/GH₵0/g, '$0');
    content = content.replace(/\(GH₵\)/g, '($)'); // Wait, maybe it did ($) ? Let's just fix GH₵
    
    // Some were replaced with GHS  because of `to_ghs.js`
    content = content.replace(/GHS 1/g, '$1');
    content = content.replace(/GHS 2/g, '$2');
    content = content.replace(/GHS 3/g, '$3');
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Fixed corrupted node_module:', filePath);
    }
  }
});
