import { readFile, access } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const html = await readFile('index.html', 'utf8');
const siteJs = await readFile('site.js', 'utf8');
const requiredFiles = [
  'styles.css',
  'site.js',
  'robots.txt',
  'sitemap.xml',
  '404.html',
  'privacy.html',
  'terms.html',
  'uploads/DH.jpg',
  'uploads/server-room.jpg',
  'uploads/network-hardware.jpg',
  'uploads/office-it.jpg'
];

for (const file of requiredFiles) await access(file);

const htmlFiles = ['index.html', 'privacy.html', 'terms.html', '404.html'];
const localReferences = [];

for (const file of htmlFiles) {
  const source = await readFile(file, 'utf8');
  for (const match of source.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const reference = match[1];
    if (/^(?:#|https?:|mailto:|tel:|data:)/.test(reference)) continue;
    localReferences.push([file, reference]);
  }
}

for (const [file, reference] of localReferences) {
  let cleanPath = reference.split(/[?#]/, 1)[0];
  cleanPath = cleanPath.replace(/^\/dh-technology-solutions\//, '');
  await access(resolve(dirname(file), cleanPath));
}

const checks = [
  ['document title', /<title>[^<]+<\/title>/],
  ['meta description', /<meta name="description"/],
  ['mobile viewport', /<meta name="viewport"/],
  ['phone link', /href="tel:0941151103"/],
  ['email action', /mailto:cqh\.techsolutions\.company@gmail\.com/],
  ['privacy link', /href="privacy\.html"/],
  ['terms link', /href="terms\.html"/],
  ['Vietnamese language', /<html lang="vi">/],
  ['semantic main', /<main id="noi-dung">/],
  ['contact form', /<form id="contact-form">/],
  ['incident form', /<form id="ticket-form">/],
  ['canonical URL', /rel="canonical" href="https:\/\/behieu0305\.github\.io\/dh-technology-solutions\/"/]
];

if (/support\.js|unpkg\.com\/(react|@babel)|class Component extends DCLogic/.test(html)) {
  console.error('Legacy design runtime is still referenced by index.html.');
  process.exit(1);
}

if (!/function validatePhone\(input\)/.test(siteJs)) {
  console.error('Phone validation is missing from site.js.');
  process.exit(1);
}

const productionOrigin = 'https://behieu0305.github.io/dh-technology-solutions/';
const [robots, sitemap] = await Promise.all([
  readFile('robots.txt', 'utf8'),
  readFile('sitemap.xml', 'utf8')
]);

if (!robots.includes(`${productionOrigin}sitemap.xml`) || !sitemap.includes(productionOrigin)) {
  console.error('Production URL is inconsistent across robots.txt and sitemap.xml.');
  process.exit(1);
}

const missing = checks.filter(([, pattern]) => !pattern.test(html)).map(([name]) => name);
if (missing.length) {
  console.error(`Missing checks: ${missing.join(', ')}`);
  process.exit(1);
}

console.log(`Site checks passed (${checks.length} markup checks, ${requiredFiles.length} required files, ${localReferences.length} local references).`);
