// update-existing.js
const fs = require('fs');
const path = require('path');
const Sanscript = require('@sanskrit-coders/sanscript');

const OUT = '/var/tripura/word';

for (const folder of fs.readdirSync(OUT)) {
  const file = path.join(OUT, folder, 'index.html');
  if (!fs.existsSync(file)) continue;

  let html = fs.readFileSync(file, 'utf8');
  const m = html.match(/<h1>(.*?)<\/h1>/);
  if (!m) continue;
  const key1 = m[1]; // e.g. "a"

  // key1 is Harvard-Kyoto -> convert
  const iast = Sanscript.t(key1, 'hk', 'iast');
  const deva = Sanscript.t(key1, 'hk', 'devanagari');

  // Update title + h1
  html = html.replace(
    /<title>.*?<\/title>/,
    `<title>${iast} (${deva}) - Sanskrit Meaning | Monier-Williams | Tripura</title>`
  );
  html = html.replace(
    /<h1>.*?<\/h1>/,
    `<h1>${iast} <span style="color:#666">| ${deva} |</span> ${key1}</h1>`
  );
  // Also update json-ld name
  html = html.replace(
    /"name":".*?"/,
    `"name":"${iast}"`
  );

  fs.writeFileSync(file, html);
}
console.log('Done updating 194k files');