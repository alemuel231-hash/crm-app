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

const dirsToCheck = [
  path.join(__dirname, 'src', 'app', 'crm'),
  path.join(__dirname, 'src', 'components'),
  __dirname
];

dirsToCheck.forEach(dir => {
  walk(dir, (filePath) => {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.js') || filePath.endsWith('.ts')) {
      let content = fs.readFileSync(filePath, 'utf8');
      let originalContent = content;
      
      // Fix the encoding issue caused by PowerShell
      content = content.replace(/GH\?/g, 'GH₵');
      content = content.replace(/GH\uFFFD/g, 'GH₵');
      
      // Replace $ prefix carefully. Look for \$ followed by numbers or inside template text
      // Instead of regex hacking, let's just replace exact known problematic strings:
      content = content.replace(/\(\$\)/g, '(GH₵)');
      content = content.replace(/\$([0-9])/g, 'GH₵GH₵1');
      content = content.replace(/>\$/g, '>GH₵ // e.g. >GH₵500
      
      // Dashboard specific fixes for buttons CSS
      if (filePath.includes('dashboard') && filePath.includes('page.tsx')) {
        // Upgrade approve button
        content = content.replace(
          /className="p-1\.5 rounded-md bg-emerald-50 dark:bg-emerald-950\/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-950\/70 border border-emerald-200\/40 dark:border-emerald-900\/30 transition-colors cursor-pointer"/g,
          'className="orbit-btn-primary bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 text-xs font-bold transition-all shadow-sm rounded-md flex items-center gap-1.5"'
        );
        // Upgrade Call button
        content = content.replace(
          /className="p-1\.5 rounded-md bg-blue-50 dark:bg-blue-950\/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-950\/70 border border-blue-200\/40 dark:border-blue-900\/30 transition-colors inline-block"/g,
          'className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-xs font-bold transition-all shadow-sm rounded-md flex items-center gap-1.5 inline-flex"'
        );
        // Upgrade view driver button
        content = content.replace(
          /className="p-1\.5 rounded-md bg-\[var\(--hover-bg\)\] text-\[var\(--text-secondary\)\] hover:text-\[#39379e\] hover:bg-\[var\(--hover-bg\)\]\/80 border border-\[var\(--border-color\)\] transition-colors cursor-pointer"/g,
          'className="bg-[var(--card-bg)] border border-[var(--border-color)] hover:bg-[#39379e] hover:text-white hover:border-[#39379e] text-[var(--text-secondary)] px-3 py-1.5 text-xs font-bold transition-all shadow-sm rounded-md flex items-center gap-1.5"'
        );
        // Change button icons in dashboard to have text too!
        content = content.replace(/<UserCheck size=\{13\} \/>/g, '<UserCheck size={14} /> Approve');
        content = content.replace(/<PhoneCall size=\{13\} \/>/g, '<PhoneCall size={14} /> Call');
        content = content.replace(/<Eye size=\{13\} \/>/g, '<Eye size={14} /> View');
      }

      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Fixed:', filePath);
      }
    }
  });
});
