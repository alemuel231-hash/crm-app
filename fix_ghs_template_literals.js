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

const srcDir = path.join(__dirname, 'src');

walk(srcDir, (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts') || filePath.endsWith('.js')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // 1. Fix JSX blocks where it's literal `GHS ${...}` -> `GHS {...}`
    // e.g. <h3>GHS ${totalRevenue}</h3> => <h3>GHS {totalRevenue}</h3>
    content = content.replace(/>GHS \$\{/g, '>GHS {');
    
    // 2. Fix classNames where `GHS ${` was injected. It should just be `${`
    content = content.replace(/className=\{`([^`]*?) GHS \$\{/g, 'className={`$1 ${');
    
    // 3. Fix cases like <span className={`badge GHS ${t.paymentStatus...
    content = content.replace(/<span className={`badge GHS \$\{/g, '<span className={`badge ${');
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Fixed:', filePath);
    }
  }
});
