import fs from 'node:fs/promises'
const data = JSON.parse(await fs.readFile(new URL('../src/assets/projectList.json', import.meta.url), 'utf8'))
const images = JSON.parse(await fs.readFile(new URL('../src/assets/images.json', import.meta.url), 'utf8'))
export const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]))
const origin = 'https://lorenzodelsal.com'
const description = data.header.description.join(' ')
export const homeMarkup = `<main class="static-portfolio"><header class="static-header"><h1>Lorenzo Del Sal</h1><p>${escape(description)}</p><p>Art Direction · Digital Design · Motion Design</p><nav aria-label="Contacts"><a href="mailto:info@lorenzodelsal.com">Mail</a><a href="https://www.instagram.com/lorenzodelsal/">Instagram</a></nav></header><div class="project-list">${data.projects.map((p, i) => `<article><span class="project-number">${String(i + 1).padStart(2, '0')}</span><h2><a href="/projects/${p.slug}/">${escape(p.title)}</a></h2><p>${escape(p.desc)}</p></article>`).join('')}</div></main>`

export async function buildPages() {
  for (const p of data.projects) {
    const url = `${origin}/projects/${p.slug}/`
    const shortDescription = p.desc.length > 155 ? p.desc.slice(0, 152).replace(/\s+\S*$/, '') + '…' : p.desc
    const gallery = (p.extraInfo?.pictures || []).map(src => {
      const image = images[src]
      return `<img src="${image.src}" srcset="${image.srcset}" sizes="(max-width: 700px) 100vw, 900px" width="${image.width}" height="${image.height}" loading="lazy" decoding="async" alt="${escape(p.title)} — design detail" />`
    }).join('')
    const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escape(p.title)} — Lorenzo Del Sal</title><meta name="description" content="${escape(shortDescription)}"><link rel="canonical" href="${url}"><link rel="icon" href="/favicon-light.svg"><link rel="stylesheet" href="/project-pages.css"><meta property="og:type" content="article"><meta property="og:title" content="${escape(p.title)} — Lorenzo Del Sal"><meta property="og:description" content="${escape(shortDescription)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${origin}/og-image.png"><meta name="twitter:card" content="summary_large_image"><script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'CreativeWork', name: p.title, description: p.desc, url, creator: { '@type': 'Person', name: 'Lorenzo Del Sal', url: origin } }).replace(/</g, '\\u003c')}</script></head><body><main class="project-detail"><nav class="detail-nav" aria-label="Portfolio"><a href="/">lds — Lorenzo Del Sal</a><a href="/#${p.slug}">Back to portfolio ↗</a></nav><header><p class="eyebrow">Selected work</p><h1>${escape(p.title)}</h1><p class="project-description">${escape(p.desc)}</p>${p.link ? `<a class="external-link" href="${escape(p.link)}" target="_blank" rel="noopener noreferrer">${escape(p.linkText)} ↗</a>` : ''}</header><div class="detail-video"><img src="${p.poster}" alt="${escape(p.title)}" width="1440" height="900" fetchpriority="high"><button type="button" data-video="${escape(p.media)}" aria-label="Play ${escape(p.title)}">Play film ↗</button><noscript><a href="${escape(p.media)}">Watch film</a></noscript></div><div class="detail-gallery">${gallery}</div><footer><a href="/">Explore all projects ↗</a><a href="mailto:info@lorenzodelsal.com">Get in touch ↗</a></footer></main><script src="/project-page.js" defer data-cfasync="false"></script></body></html>`
    await fs.mkdir(`dist/projects/${p.slug}`, { recursive: true })
    await fs.writeFile(`dist/projects/${p.slug}/index.html`, html)
  }
  const urls = [`${origin}/`, ...data.projects.map(p => `${origin}/projects/${p.slug}/`)]
  await fs.writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(url => `<url><loc>${url}</loc></url>`).join('')}</urlset>\n`)
}
if (process.argv[1]?.endsWith('static-pages.mjs')) await buildPages()
