const fs = require('fs');
const path = require('path');

const DICT = JSON.parse(fs.readFileSync('./dictionary.json', 'utf8'));
const OUT = './dist/word';
const BASE = 'https://tripura.io';
fs.mkdirSync(OUT, { recursive: true });

// Group by key1 so a, a (hom 1, hom 2) become one page
const grouped = {};
for (const e of DICT) {
  const key = e.key1;
  if (!key) continue;
  if (!grouped[key]) grouped[key] = [];
  grouped[key].push(e);
}

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

const urls = [];

for (const [key1, entries] of Object.entries(grouped)) {
  const slug = key1.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  const dir = path.join(OUT, slug);
  fs.mkdirSync(dir, { recursive: true });

  // Combine all homonyms for SEO text
  const combinedText = entries.map(e => stripHtml(e.body)).join(' | ').slice(0, 800);
  const firstBody = entries.map(e => e.body).join('<hr>');

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${key1} - Sanskrit Meaning | Monier-Williams | Tripura</title>
<meta name="description" content="${key1}: ${combinedText.replace(/"/g, "'").slice(0,150)}">
<link rel="canonical" href="${BASE}/word/${slug}/">
<meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
<main style="font-family:serif;max-width:700px;margin:40px auto;padding:0 20px;line-height:1.6">
<h1>${key1}</h1>
<div>${firstBody}</div>
<p style="margin-top:40px"><a href="/">← Search all 286,525 words on Tripura Koṣa</a></p>
</main>
<script type="application/ld+json">
{
  "@context":"https://schema.org",
  "@type":"DefinedTerm",
  "name":${JSON.stringify(key1)},
  "description":${JSON.stringify(combinedText.slice(0,500))},
  "inDefinedTermSet":"${BASE}/",
  "url":"${BASE}/word/${slug}/"
}
</script>
</body>
</html>`;

  fs.writeFileSync(path.join(dir, 'index.html'), html);
  urls.push(`${BASE}/word/${slug}/`);
}

console.log(`Built ${urls.length} unique headwords from ${DICT.length} entries`);

// sitemaps 10k each
const CHUNK = 10000;
let sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
for(let i=0; i<urls.length; i+=CHUNK){
  const chunk = urls.slice(i, i+CHUNK);
  const n = Math.floor(i/CHUNK);
  const name = `sitemap-${n}.xml`;
  const content = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${chunk.map(u=>` <url><loc>${u}</loc></url>`).join('\n')}\n</urlset>`;
  fs.writeFileSync(`./dist/${name}`, content);
  sitemapIndex += ` <sitemap><loc>${BASE}/${name}</loc></sitemap>\n`;
}
sitemapIndex += `</sitemapindex>`;
fs.writeFileSync('./dist/sitemap.xml', sitemapIndex);
console.log('Sitemaps done');