const fs = require('fs');
const path = require('path');

const replacements = [
  { search: /bg-slate-900\/50/g, replace: 'bg-[var(--card-bg)] shadow-sm' },
  { search: /bg-slate-900/g, replace: 'bg-[var(--card-bg)]' },
  { search: /border-slate-800/g, replace: 'border-[var(--border-color)]' },
  { search: /border-slate-700/g, replace: 'border-[var(--border-color)]' },
  { search: /bg-slate-800\/50/g, replace: 'bg-[var(--background)]' },
  { search: /bg-slate-800\/20/g, replace: 'bg-[var(--background)]' },
  { search: /bg-slate-800/g, replace: 'bg-[var(--border-color)]' },
  { search: /text-slate-400/g, replace: 'text-[var(--text-muted)]' },
  { search: /text-slate-500/g, replace: 'text-[var(--text-muted)] opacity-70' },
  { search: /text-slate-300/g, replace: 'text-[var(--foreground)]' },
  { search: /text-white/g, replace: 'text-[var(--foreground)]' },
  { search: /divide-slate-800\/50/g, replace: 'divide-[var(--border-color)]' },
  { search: /bg-slate-950/g, replace: 'bg-[var(--background)]' },
  { search: /hover:bg-slate-800\/20/g, replace: 'hover:bg-[var(--background)]' },
  { search: /hover:bg-slate-800/g, replace: 'hover:bg-[var(--border-color)]' },
  { search: /<div className="p-4 md:p-6 lg:p-8 space-y-6">/g, replace: '<div className="p-4 md:p-6 lg:p-8 space-y-6 bg-[var(--background)] min-h-screen text-[var(--foreground)]">' }
];

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      for (const rule of replacements) {
        if (rule.search.test(content)) {
          content = content.replace(rule.search, rule.replace);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log('Fixed theme in: ' + fullPath);
      }
    }
  }
}

processDir(path.join(__dirname, 'src', 'app', 'crm'));
