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
    // only check specific files in root
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
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    
    // Fix encoding
    content = content.replace(/GH\?/g, 'GH₵');
    content = content.replace(/GH\uFFFD/g, 'GH₵');
    
    // Replace currencies
    content = content.replace(/\(\$\)/g, '(GH₵)');
    content = content.replace(/\$([0-9])/g, 'GH₵GH₵1');
    content = content.replace(/>\$/g, '>GH₵ 
    
    // Dashboard specific button upgrades
    if (filePath.includes('dashboard') && filePath.includes('page.tsx')) {
      content = content.replace(
        /className="p-1\.5 rounded-md bg-emerald-50 dark:bg-emerald-950\/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-950\/70 border border-emerald-200\/40 dark:border-emerald-900\/30 transition-colors cursor-pointer"/g,
        'className="orbit-btn-primary bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 text-xs font-bold transition-all shadow-sm rounded-md flex items-center gap-1.5"'
      );
      content = content.replace(
        /className="p-1\.5 rounded-md bg-blue-50 dark:bg-blue-950\/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-950\/70 border border-blue-200\/40 dark:border-blue-900\/30 transition-colors inline-block"/g,
        'className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-xs font-bold transition-all shadow-sm rounded-md flex items-center gap-1.5 inline-flex"'
      );
      content = content.replace(
        /className="p-1\.5 rounded-md bg-\[var\(--hover-bg\)\] text-\[var\(--text-secondary\)\] hover:text-\[#39379e\] hover:bg-\[var\(--hover-bg\)\]\/80 border border-\[var\(--border-color\)\] transition-colors cursor-pointer"/g,
        'className="bg-[var(--card-bg)] border border-[var(--border-color)] hover:bg-[#39379e] hover:text-white hover:border-[#39379e] text-[var(--text-secondary)] px-3 py-1.5 text-xs font-bold transition-all shadow-sm rounded-md flex items-center gap-1.5"'
      );
      content = content.replace(/<UserCheck size=\{13\} \/>/g, '<UserCheck size={14} /> Approve');
      content = content.replace(/<PhoneCall size=\{13\} \/>/g, '<PhoneCall size={14} /> Call');
      content = content.replace(/<Eye size=\{13\} \/>/g, '<Eye size={14} /> View');
    }

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Fixed:', filePath);
    }
  }
}
