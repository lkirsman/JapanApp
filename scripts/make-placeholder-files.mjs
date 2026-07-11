// One-off generator for the placeholder sample PDFs in public/placeholder-files/.
// Computes xref offsets so the PDFs are valid on any viewer. Run: node scripts/make-placeholder-files.mjs
import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'

function minimalPdf(title, lines) {
  const esc = (s) => s.replace(/[\\()]/g, (c) => '\\' + c)
  const content = [
    'BT /F1 16 Tf 60 760 Td (' + esc(title) + ') Tj ET',
    ...lines.map(
      (line, i) => 'BT /F1 11 Tf 60 ' + (730 - i * 18) + ' Td (' + esc(line) + ') Tj ET'
    ),
  ].join('\n')
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
    '<< /Length ' + content.length + ' >>\nstream\n' + content + '\nendstream',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ]
  let pdf = '%PDF-1.4\n'
  const offsets = []
  objects.forEach((body, i) => {
    offsets.push(pdf.length)
    pdf += `${i + 1} 0 obj\n${body}\nendobj\n`
  })
  const xrefStart = pdf.length
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
  for (const off of offsets) pdf += String(off).padStart(10, '0') + ' 00000 n \n'
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`
  return Buffer.from(pdf, 'latin1')
}

const outDir = path.join(process.cwd(), 'public', 'placeholder-files')
mkdirSync(outDir, { recursive: true })

writeFileSync(
  path.join(outDir, 'flight-booking.pdf'),
  minimalPdf('Flight booking - PLACEHOLDER', [
    'This is a sample document served by the placeholder datastore.',
    'Replace it with the real flight confirmation during',
    'infrastructure activation (tasks Phase 8).',
    '',
    'Yuval & Luz in Japan - 2026',
  ])
)

writeFileSync(
  path.join(outDir, 'hotel-reservation.pdf'),
  minimalPdf('Ryokan reservation - PLACEHOLDER', [
    'Sample reservation document attached to the Hakone ryokan.',
    'Replace with the real confirmation in Phase 8.',
  ])
)

console.log('placeholder PDFs written to', outDir)
