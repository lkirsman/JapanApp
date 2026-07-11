// Generate PWA icons: a minimal white torii gate on the coral brand color.
// Pure vector (no fonts), rasterized to PNG with sharp. Run: node scripts/gen-icons.mjs
import sharp from 'sharp'
import path from 'node:path'
import { mkdirSync } from 'node:fs'

const BRAND = '#ff5a4d'
const torii = `
  <g fill="#ffffff">
    <rect x="132" y="138" width="248" height="20" rx="6"/>
    <rect x="146" y="162" width="220" height="34" rx="6"/>
    <rect x="168" y="196" width="42" height="196"/>
    <rect x="302" y="196" width="42" height="196"/>
    <rect x="156" y="224" width="200" height="30"/>
  </g>`

function svg(size, { rounded }) {
  const rx = rounded ? 112 : 0
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="${rx}" fill="${BRAND}"/>
  ${torii}
</svg>`
}

const outDir = path.join(process.cwd(), 'public')
mkdirSync(outDir, { recursive: true })

const jobs = [
  { file: 'icon-192.png', size: 192, rounded: true },
  { file: 'icon-512.png', size: 512, rounded: true },
  { file: 'icon-maskable-512.png', size: 512, rounded: false },
  { file: 'apple-touch-icon.png', size: 180, rounded: true },
  { file: 'favicon-32.png', size: 32, rounded: true },
]

for (const j of jobs) {
  await sharp(Buffer.from(svg(j.size, { rounded: j.rounded })))
    .png()
    .toFile(path.join(outDir, j.file))
  console.log('wrote public/' + j.file)
}
console.log('done')
