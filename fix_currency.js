const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

const crmDir = path.join(__dirname, 'src', 'app', 'crm');

walk(crmDir, (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.js')) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace $ that is not immediately followed by {
    let newContent = content.replace(/\$(?!\{)/g, 'GH₵');
    
    // Also fix cases where $ is inside quotes like "$"
    newContent = newContent.replace(/\(\$\)/g, '(GH₵)');

    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent);
      console.log('Fixed currency in:', filePath);
    }
  }
});
