// fix-titles.js
const fs = require('fs');
const path = require('path');

const DIR = '/var/www/tripura/word';
const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');

for (const l of letters) {
  const file = path.join(DIR, `${l}.html`);
  if (!fs.existsSync(file)) continue;

  let html = fs.readFileSync(file, 'utf8');
  
  // get count from the file itself - count <li>
  const count = (html.match(/<li>/g) || []).length;
  
  // 1. remove the <p>XXX words starting with...</p>
  html = html.replace(/<p>\d+ words starting with .*?<\/p>\n?/gi, '');

  // 2. update <title> to "Words starting with A | 20670"
  html = html.replace(/<title>.*?<\/title>/, `<title>Words starting with ${l.toUpperCase()} | ${count} | Tripura Ko\u1E63a</title>`);

  // 3. update meta description to keep count for SEO
  html = html.replace(/<meta name="description" content=".*?">/, `<meta name="description" content="Browse all ${count} Sanskrit words starting with ${l.toUpperCase()} on Tripura Ko\u1E63a - Monier-Williams Dictionary">`);

  // 4. update <h1> to "Words starting with A | 20670"
  html = html.replace(/<h1>.*?<\/h1>/, `<h1>Words starting with ${l.toUpperCase()} | ${count}</h1>`);

  fs.writeFileSync(file, html);
  console.log(`Fixed ${l}.html -> ${count}`);
}

console.log('Done');