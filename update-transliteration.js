// update-existing.js - with Devanagari next to it
const fs = require('fs');
const path = require('path');
const Sanscript = require('@sanskrit-coders/sanscript');

const OUT = '/var/www/tripura/word';

for (const folder of fs.readdirSync(OUT)) {
  const dir = path.join(OUT, folder);
  if (!fs.statSync(dir).isDirectory()) continue;
  const file = path.join(dir, 'index.html');
  if (!fs.existsSync(file)) continue;

  let html = fs.readFileSync(file, 'utf8');

  html = html.replace(/<span class="s">(.*?)<\/s>/gs, (full, inner) => {
    const raw = inner.replace(/<[^>]+>/g, '').trim();
    if (!raw || raw.length < 2) return full; // keep single "A"

    try {
      const iast = Sanscript.t(raw, 'hk', 'iast');
      const deva = Sanscript.t(raw, 'hk', 'devanagari');
      
      // This will become: ā-gacchati | आ-गच्छति |
      return `<span class="s">${iast} <span style="color:#888;font-size:0.9em">| ${deva} |</span></span>`;
    } catch {
      return full;
    }
  });

  fs.writeFileSync(file, html);
}

console.log('Done - added iast + devanagari');