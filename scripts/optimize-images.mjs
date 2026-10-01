import fs from 'node:fs/promises'
import path from 'node:path'
import { createHash } from 'node:crypto'
import sharp from 'sharp'

const data = JSON.parse(await fs.readFile('src/assets/projectList.json', 'utf8'))
const images = {}
await fs.mkdir('public/images/optimized', { recursive: true })
await fs.mkdir('public/posters', { recursive: true })
for (const project of data.projects) {
  for (const src of project.extraInfo?.pictures || []) {
    const input = await fs.readFile(`public${src}`)
    const metadata = await sharp(input).metadata()
    const hash = createHash('sha256').update(input).update('webp-82-v1').digest('hex').slice(0, 10)
    const stem = path.basename(src, path.extname(src))
    const variants = []
    for (const width of [...new Set([Math.min(700, metadata.width), Math.min(1400, metadata.width)])]) {
      const file = `/images/optimized/${stem}-${hash}-${width}.webp`
      await sharp(input).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 82 }).toFile(`public${file}`)
      variants.push({ src: file, width })
    }
    images[src] = { src: variants.at(-1).src, srcset: variants.map(v => `${v.src} ${v.width}w`).join(', '), width: metadata.width, height: metadata.height }
  }
  const picture = project.extraInfo?.pictures?.[0]
  if (picture) {
    await sharp(`public${picture}`).rotate().resize({ width: 1440, withoutEnlargement: true }).webp({ quality: 82 }).toFile(`public${project.poster}`)
  } else {
    const title = project.title.replace(/[<&]/g, '')
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="900"><rect width="1440" height="900" fill="black"/><text x="720" y="450" text-anchor="middle" font-family="sans-serif" font-size="52" fill="white">${title}</text></svg>`
    await sharp(Buffer.from(svg)).webp().toFile(`public${project.poster}`)
  }
}
await fs.writeFile('src/assets/images.json', JSON.stringify(images, null, 2) + '\n')
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#f0f0f0"/><text x="64" y="150" font-family="sans-serif" font-size="120" font-weight="600" letter-spacing="-8">lds</text><path d="M64 235H1136" stroke="black"/><text x="64" y="365" font-family="sans-serif" font-size="72" letter-spacing="-3">Lorenzo Del Sal</text><text x="64" y="445" font-family="sans-serif" font-size="32">Digital Design &amp; Motion Graphics</text><text x="64" y="565" font-family="sans-serif" font-size="24">lorenzodelsal.com</text></svg>`
await sharp(Buffer.from(svg)).png().toFile('public/og-image.png')
const originals = Object.keys(images)
const originalBytes = (await Promise.all(originals.map(src => fs.stat(`public${src}`)))).reduce((s, x) => s + x.size, 0)
const optimizedBytes = (await Promise.all(Object.values(images).map(img => fs.stat(`public${img.src}`)))).reduce((s, x) => s + x.size, 0)
console.log(JSON.stringify({ images: originals.length, originalBytes, optimizedBytes }))

// p5 needs no more than six decimals; preserve every face and vertex index.
const model = await fs.readFile('src/assets/model.obj', 'utf8')
const compactModel = model.split('\n').map(line => {
  if (!/^(v|vn|vt) /.test(line)) return line
  const [type, ...coordinates] = line.trim().split(/\s+/)
  return [type, ...coordinates.map(coordinate => String(Number(Number(coordinate).toFixed(6))))].join(' ')
}).join('\n')
await fs.writeFile('src/assets/model.txt', compactModel)
