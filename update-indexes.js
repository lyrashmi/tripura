// grey-count.js
const fs = require('fs');
const path = require('path');

const DIR = '/var/www/tripura/word';

for (const l of 'abcdefghijklmnopqrstuvwxyz') {
  const file = path.join(DIR, `${l}.html`);
  if (!fs.existsSync(file)) continue;
  
  let html = fs.readFileSync(file, 'utf8');

  // change <h1>Words starting with A | 20670</h1>
  // to <h1>Words starting with A <span style="color:#888;font-weight:400">| 20670</span></h1>
  html = html.replace(
    /<h1>Words starting with ([A-Z]) \| (\d+)<\/h1>/,
    `<h1>Words starting with $1 <span style="color:#888;font-weight:400">| $2</span></h1>`
  );

  fs.writeFileSync(file, html);
  console.log(`Updated ${l}.html`);
}
console.log('Done');