const fs = require('node:fs');
const path = require('node:path');
const { profile } = require('../src/data/portfolio.json');
const publicDir = path.join(__dirname, '../public');
const escape = value => value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[character]));
const origin = new URL(profile.website).origin;
if (!origin.startsWith('https://')) throw new Error('The portfolio website must use HTTPS.');
const title = escape(`${profile.name} — ${profile.role}`);
const description = escape(profile.bio);
fs.writeFileSync(path.join(publicDir, 'index.html'), `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#050a05" />
    <meta name="description" content="${description}" />
    <meta name="author" content="${escape(profile.name)}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${escape(origin)}/" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <link rel="icon" type="image/svg+xml" href="%PUBLIC_URL%/favicon.svg" />
    <title>${title}</title>
  </head>
  <body>
    <noscript>This portfolio uses JavaScript. You can contact ${escape(profile.name)} at <a href="mailto:${escape(profile.email)}">${escape(profile.email)}</a>.</noscript>
    <div id="root"></div>
  </body>
</html>
`);
fs.writeFileSync(path.join(publicDir, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`);
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${['/', '/about', '/projects', '/contact'].map(route => `  <url><loc>${escape(origin + route)}</loc></url>`).join('\n')}
</urlset>
`);
console.log('Metadata and sitemap generated from portfolio.json.');
