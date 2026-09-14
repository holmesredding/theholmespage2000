import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
process.chdir(root);
const read = file => fs.readFileSync(file, 'utf8');
const write = (file, text) => { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, text.replace(/^[ \t]+$/gm, ''));  };
const escape = text => String(text).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const plain = text => text.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim();
const template = (file, values) => read(file).replace(/\{\{(\w+)\}\}/g, (_, name) => {
  if (!(name in values)) throw new Error(`Missing ${name} in ${file}`);
  return values[name];
});
const sources = ['works', 'pages', 'blog', 'hidden', 'food/posts'].flatMap(dir => fs.readdirSync(dir).filter(name => name.endsWith('.md')).map(name => `${dir}/${name}`));
const routes = Object.fromEntries(sources.map(source => [source, '/' + source.replace(/\.md$/, '/') ]));
// The old blog address is a second copy of the same article, not a separate post.
routes['blog/pathofthejedi.md'] = routes['pages/pathofthejedi.md'];
const headingIds = new Set();
marked.use({ renderer: {
  heading({ tokens, depth }) {
    const text = this.parser.parseInline(tokens);
    const slug = plain(text).toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, '').trim().replace(/\s+/g, '-') || 'section';
    let id = slug, count = 1;
    while (headingIds.has(id)) id = `${slug}-${++count}`;
    headingIds.add(id);
    return `<h${depth} id="${id}">${text}</h${depth}>\n`;
  }
}});
function links(html, source = '') {
  return html.replace(/\b(href|src)="([^"]*)"/g, (_, attr, value) => {
    if (/^(https?:|mailto:|data:|#|\/\/)/.test(value)) return `${attr}="${value}"`;
    if (value.includes('?post=')) {
      const post = value.split('?post=')[1].split('#')[0];
      const key = source.startsWith('food/') && post.startsWith('posts/') ? `food/${post}` : post;
      if (routes[key]) value = routes[key] + (value.includes('#') ? '#' + value.split('#')[1] : '');
    } else if (value === '?reviews' || value === '/food/?reviews') value = '/food/reviews/';
    else if (value.startsWith('/theholmespage2000/')) value = value.replace('/theholmespage2000/', '/');
    else if (!value.startsWith('/')) {
      // Portfolio media historically lived at the site root; food media is beside its Markdown.
      const base = source.startsWith('food/posts/') ? '/food/posts/' : source.startsWith('food/') ? '/food/' : '/';
      value = path.posix.normalize(base + value);
    }
    return `${attr}="${value}"`;
  });
}
function renderMarkdown(source) {
  headingIds.clear();
  let html = links(marked.parse(read(source)), source);
  // Controls are progressive enhancements; an embed and provider links work without JS.
  html = html.replace(/target="_blank"(?!\s+rel=)/g, 'target="_blank" rel="noopener noreferrer"');
  return html;
}
function metadata(html) {
  const title = plain(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] || 'Writing');
  const paragraphs = [...html.matchAll(/<p(?:\s[^>]*)?>([\s\S]*?)<\/p>/g)].map(match => plain(match[1]));
  const description = paragraphs.find(p => p.length > 65) || paragraphs.find(p => p.length > 0) || title;
  return { title, description: description.length > 180 ? description.slice(0, 177).replace(/\s+\S*$/, '') + '…' : description };
}
function mainPage(content, values) {
  return links(template('templates/layout.html', {
    title: escape(values.title), description: escape(values.description), content,
    stars: values.stars ? 'true' : 'false', bodyClass: values.stars ? 'sw-page-mode' : '',
    type: values.url === '/' ? 'website' : 'article', url: values.url,
    image: values.image || '/images/emmettdrawingcircle.webp',
    robots: values.hidden ? '<meta name="robots" content="noindex">' : ''
  }));
}
write('index.html', mainPage(links(read('templates/home.html')), {
  title: 'Emmett Redding', description: 'Art and Media teacher in Melbourne. Films, animation, podcasts, writing and ScreenDiary, an app about movies.', url: '/'
}));
for (const source of sources.filter(source => !source.startsWith('food/'))) {
  if (source === 'blog/pathofthejedi.md') continue;
  const html = renderMarkdown(source);
  const meta = metadata(html);
  const image = html.match(/<img[^>]+src="([^\"]+)"/)?.[1];
  write(routes[source].slice(1) + 'index.html', mainPage(`<article class="article-body">\n${html}</article>\n<p class="article-back"><a href="/${source.startsWith('works/') ? '#works' : ''}">← ${source.startsWith('works/') ? 'Back to selected works' : 'Back to home'}</a></p>`, {
    ...meta, title: meta.title + ' — Emmett Redding', url: routes[source], stars: source === 'pages/pathofthejedi.md', image,
    hidden: source.startsWith('hidden/')
  }));
}
const foodPage = (content, values) => links(template('templates/food-layout.html', {
  title: escape(values.title), description: escape(values.description), url: values.url,
  content, scripts: values.scripts || ''
}), 'food/index').replace('<h1><a href="/food/">The Considered Palate</a></h1>', values.url.startsWith('/food/posts/') ? '<p class="masthead-name"><a href="/food/">The Considered Palate</a></p>' : '<h1><a href="/food/">The Considered Palate</a></h1>');
write('food/index.html', foodPage(read('templates/food-home.html'), {
  title: 'The Considered Palate', description: 'Independent food reviews from Melbourne, with close attention to flavour, texture and satisfaction.', url: '/food/'
}));
for (const source of sources.filter(source => source.startsWith('food/'))) {
  const html = renderMarkdown(source), meta = metadata(html);
  write(routes[source].slice(1) + 'index.html', foodPage(`<div class="container"><article class="food-article">${html}</article><p><a class="back-link" href="/food/reviews/">← Back to all writing</a></p></div>`, {
    ...meta, title: meta.title + ' — The Considered Palate', url: routes[source]
  }));
}
const reviews = JSON.parse(read('food/reviews.json'));
const reviewUrl = r => routes['food/' + r.file];
const reviewImage = r => r.image ? `/food/${r.image}` : '';
const latest = reviews[0];
const featured = latest ? `<article class="featured-article">
  ${latest.image ? `<img src="${reviewImage(latest)}" alt="${escape(latest.title)}" class="featured-thumb">` : ''}
  <p class="featured-label">Latest</p><h2><a href="${reviewUrl(latest)}">${escape(latest.title)}</a></h2>
  <p class="featured-meta">${escape(latest.dateDisplay)} · Review</p><p class="featured-excerpt">${escape(latest.excerpt)}</p>
</article>` : '';
const reviewList = reviews.map(r => `<li class="article-item" data-date="${escape(r.date)}" data-satisfaction="${r.satisfaction}" data-tags="${escape(JSON.stringify(r.tags))}" data-search="${escape([r.title, r.excerpt, ...r.tags].join(' ').toLowerCase())}">
  ${r.image ? `<img src="${reviewImage(r)}" alt="${escape(r.title)}" class="article-thumb" loading="lazy">` : ''}
  <div class="article-item-content"><p class="article-category">Review</p>
  <h3><a href="${reviewUrl(r)}">${escape(r.title)}</a></h3><p class="article-date">${escape(r.dateDisplay)}</p>
  <p class="article-excerpt">${escape(r.excerpt)}</p><p class="article-satisfaction">Satisfaction <span class="satisfaction-bar"><span class="satisfaction-fill" style="width: ${r.satisfaction}%"></span></span></p>
  <div class="article-tags">${r.tags.map(tag => `<span class="article-tag">${escape(tag)}</span>`).join('')}</div></div>
</li>`).join('\n');
write('food/reviews/index.html', foodPage(template('templates/food-reviews.html', { featured, reviews: reviewList }), {
  title: 'Reviews — The Considered Palate', description: 'Browse independent food reviews by date, satisfaction and category.', url: '/food/reviews/', scripts: '<script src="/assets/food-reviews.js" defer></script>'
}));
// Only known legacy URLs can redirect. Preserve incoming footnote/podcast fragments.
write('assets/legacy-routes.js', `(() => {\nconst routes = ${JSON.stringify(routes, null, 2)};\nconst params = new URLSearchParams(location.search);\nconst post = params.get('post');\nconst key = location.pathname.startsWith('/food/') && post?.startsWith('posts/') ? 'food/' + post : post;\nconst target = routes[key] || (location.pathname === '/food/' && params.has('reviews') ? '/food/reviews/' : null);\nif (target) location.replace(target + location.hash);\n})();\n`);
// Also support the old article name as an ordinary path.
write('blog/pathofthejedi/index.html', `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="refresh" content="0;url=/pages/pathofthejedi/"><link rel="canonical" href="https://emmettredding.com/pages/pathofthejedi/"><title>Path of the Jedi</title></head><body><a href="/pages/pathofthejedi/">Continue to Path of the Jedi</a><script>location.replace('/pages/pathofthejedi/' + location.hash)</script></body></html>`);
write('assets/routes.json', JSON.stringify(routes, null, 2) + '\n');
console.log(`Built home, ${sources.length - 1} articles, and the food review index.`);
