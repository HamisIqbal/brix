/**
 * Build gate. Fails the build if a [[CLIENT: ...]] placeholder would ship into
 * metadata or structured data, and lists what is still outstanding.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'

const PLACEHOLDER = /\[\[CLIENT:\s*([^\]]+)\]\]/g

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry)
    if (statSync(full).isDirectory()) walk(full, out)
    else if (/\.(ts|tsx)$/.test(entry)) out.push(full)
  }
  return out
}

const outstanding = new Set<string>()
const files = [...walk('content'), ...walk('components'), ...walk('app')]

for (const file of files) {
  const source = readFileSync(file, 'utf8')
  for (const match of source.matchAll(PLACEHOLDER)) {
    const name = match[1]?.trim()
    if (!name) continue
    const isDeclaration = file.split(path.sep).join('/').endsWith('content/business.ts')
    if (!isDeclaration) {
      console.error(`FAIL  placeholder used outside content/business.ts: ${file} -> ${name}`)
      process.exit(1)
    }
    outstanding.add(name)
  }
}

if (outstanding.size > 0) {
  console.log('Client facts still outstanding (rendered as nothing until supplied):')
  for (const name of [...outstanding].sort()) console.log(`  - ${name}`)
} else {
  console.log('All client facts supplied.')
}
