import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
const routes = JSON.parse(fs.readFileSync('assets/routes.json', 'utf8'));
const files = ['index.html', 'food/index.html', 'food/reviews/index.html', ...new Set(Object.values(routes).map(url => url.slice(1) + 'index.html'))];
let links = 0;
for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  assert(!html.includes('<zero-md'), `${file}: runtime Markdown remains`);
  assert.match(html, /<meta name="description" content="[^"]+"/, `${file}: description`);
  assert.match(html, /<h1\b/, `${file}: heading`);
  assert(!html.includes('{{'), `${file}: unexpanded template`);
  for (const match of html.matchAll(/\b(?:href|src)="(\/[^"#?]*)(?:[?#][^"]*)?"/g)) {
    const target = match[1];
    const local = target.endsWith('/') ? target.slice(1) + 'index.html' : target.slice(1);
    assert(fs.existsSync(local), `${file}: missing ${target}`);
    links++;
  }
}
for (const file of ['assets/site.js', 'assets/appearance.js', 'assets/legacy-routes.js', 'assets/food-reviews.js']) execFileSync(process.execPath, ['--check', file]);
for (const [file, id] of [['pages/pathofthejedi/index.html', '313947832?h=a1a40b6526'], ['works/zeman/index.html', '476994664']]) {
  const html = fs.readFileSync(file, 'utf8');
  assert(html.includes(id));
  assert.match(html, /data-video-src="https:\/\/www.youtube-nocookie.com\/embed\//);
}
console.log(`Checked ${files.length} static pages, ${links} local links/assets, scripts, metadata and both video switchers.`);
