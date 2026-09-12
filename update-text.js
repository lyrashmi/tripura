// update-search-text.js
const fs = require('fs');
const path = require('path');

const OUT = '/var/www/tripura/word';
let count = 0;

for (const folder of fs.readdirSync(OUT)) {
  const dir = path.join(OUT, folder);
  if (!fs.statSync(dir).isDirectory()) continue;
  const file = path.join(dir, 'index.html');
  if (!fs.existsSync(file)) continue;

  let html = fs.readFileSync(file, 'utf8');
  
  if (!html.includes('Search all 286,525')) continue;
  
  // also handle 286,525 variant you have in some files
  html = html.replace(
    'Search all 286,525 words on Tripura Koṣa',
    'Search all 286,525 Sanskrit words on Tripura Koṣa'
  );

  fs.writeFileSync(file, html);
  count++;
}

console.log(`Done - updated ${count} files`);