const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src');

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let original = content;

  // Replace literal ₵ with GH₵
  content = content.replace(/₵/g, 'GH₵');
  
  // Fix double occurrences that might have been created
  content = content.replace(/GHGH₵/g, 'GH₵');
  
  // Replace $ followed by numbers or variables (like GH₵100 or ${val})
  // We ONLY want to replace $ when it acts as a currency, e.g. `$${` inside a template string
  // or `$` followed by digits.
  
  // $ followed by a number -> GH₵ number
  content = content.replace(/\$([0-9]+)/g, 'GH₵GH₵1');
  
  // $${ -> GH₵{
  content = content.replace(/\$\$\{/g, 'GH₵{');
  
  // (GH₵) -> (GH₵)
  content = content.replace(/\(\$\)/g, '(GH₵)');

  // `$ ` -> `GH₵(when followed by a number)
  content = content.replace(/\$ ([0-9]+)/g, 'GH₵ GH₵1');

  if(content !== original) {
    fs.writeFileSync(f, content);
    console.log('Updated ' + f);
  }
});
