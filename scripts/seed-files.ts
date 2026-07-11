// Upload file blobs to the Supabase `trip-files` bucket. Each file row in
// placeholder-data.json has a storage_path (e.g. "placeholder-files/x.pdf");
// this uploads the matching local file from public/<storage_path> to that key.
// Replace the local sample files with the real documents, keep the paths, re-run.
// Usage: DATA_BACKEND=supabase in .env.local, then `npm run seed:files`.
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { loadEnv } from './loadEnv'

loadEnv()

interface FileRow {
  storage_path: string
  mime_type: string
  display_name: string
}

async function main() {
  const { getSupabase, FILES_BUCKET } = await import('../server/src/lib/supabase')
  const db = getSupabase()

  const data = JSON.parse(
    readFileSync(path.join(process.cwd(), 'server/src/data/placeholder-data.json'), 'utf-8')
  )
  const files: FileRow[] = data.files ?? []

  for (const f of files) {
    let bytes: Buffer
    try {
      bytes = readFileSync(path.join(process.cwd(), 'public', f.storage_path))
    } catch {
      console.warn(`! skip ${f.storage_path} — no local file at public/${f.storage_path}`)
      continue
    }
    const { error } = await db.storage
      .from(FILES_BUCKET)
      .upload(f.storage_path, bytes, { contentType: f.mime_type, upsert: true })
    if (error) {
      console.error(`✗ ${f.storage_path}: ${error.message}`)
      process.exit(1)
    }
    console.log(`✓ uploaded ${f.storage_path} (${f.display_name})`)
  }
  console.log('\nDone. Update file size_bytes in the data file if you swapped in larger files.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
