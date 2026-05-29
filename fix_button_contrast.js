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
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Fix active tabs
    content = content.replace(/bg-\[#39379e\] text-\[var\(--foreground\)\]/g, 'bg-[#39379e] text-white');
    
    // Fix standard primary buttons
    content = content.replace(/bg-\[#39379e\] hover:bg-\[#2f2d8c\]\s*text-\[var\(--foreground\)\]/g, 'bg-[#39379e] hover:bg-[#2f2d8c] text-white');
    content = content.replace(/bg-\[#39379e\]\s*text-\[var\(--foreground\)\]\s*hover:bg-\[#2f2d8c\]/g, 'bg-[#39379e] text-white hover:bg-[#2f2d8c]');

    // Fix other variants where bg-[#39379e] is used with text-[var(--foreground)]
    content = content.replace(/(bg-\[#39379e\][^"']*?)text-\[var\(--foreground\)\]/g, '$1text-white');
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Fixed button contrast in:', filePath);
    }
  }
});
