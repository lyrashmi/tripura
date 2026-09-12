// update-indexes.js
const fs = require('fs');
const path = require('path');

const DIR = '/var/www/tripura/word';
const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');

function makePage({title, desc, canonical, h1, content}) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${canonical}">
<meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
<main style="font-family:serif;max-width:700px;margin:40px auto;padding:0 20px;line-height:1.6">
<h1>${h1}</h1>
<div>
${content}
</div>
<p style="margin-top:40px"><a href="/kosha">\u2190 Search all 286,525 Sanskrit words on Tripura Ko\u1E63a</a></p>
</main>
</body>
</html>`;
}

// 1. Update a.html... z.html
for (const l of letters) {
  const file = path.join(DIR, `${l}.html`);
  if (!fs.existsSync(file)) continue;
  const old = fs.readFileSync(file, 'utf8');

  // extract the <li>...</li> parts
  const lis = [...old.matchAll(/<li>.*?<\/li>/gs)].map(m => m[0]).join('\n');
  const content = `<p>${lis.match(/<li>/g)?.length || 0} words starting with ${l.toUpperCase()}</p>\n<ul>\n${lis}\n</ul>`;

  const html = makePage({
    title: `Sanskrit words starting with ${l} - ${lis.match(/<li>/g)?.length || 0} words | Tripura`,
    desc: `Browse all ${(old.match(/<li>/g) || []).length} Sanskrit words starting with ${l} on Tripura Ko\u1E63a - Monier-Williams Dictionary`,
    canonical: `https://tripura.io/word/${l}.html`,
    h1: `Words starting with <b>${l.toUpperCase()}</b>`,
    content
  });

  fs.writeFileSync(file, html);
  console.log(`Updated ${l}.html`);
}

// 2. Update word/index.html - the All Words page
const mainFile = path.join(DIR, 'index.html');
const oldMain = fs.readFileSync(mainFile, 'utf8');
const mainLis = [...oldMain.matchAll(/<li>.*?<\/li>/gs)].map(m => m[0]).join('\n');

const mainHtml = makePage({
  title: `All Sanskrit Words A-Z - 286,525 Words | Tripura Ko\u1E63a`,
  desc: `Browse all 286,525 Sanskrit words from Monier-Williams Dictionary A-Z on Tripura Ko\u1E63a`,
  canonical: `https://tripura.io/word/`,
  h1: `All Words - 286,525 Sanskrit Dictionary`,
  content: `<ul>\n${mainLis}\n</ul>`
});

fs.writeFileSync(mainFile, mainHtml);
console.log('Updated word/index.html - Done');