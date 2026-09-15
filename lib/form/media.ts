import { form } from '@/content/form'

const L = form.mediaLimits
const m = form.messages

// Some browsers report HEIC/HEIF with an empty MIME type, so the extension is
// the fallback signal.
const EXTRA_EXT = /\.(heic|heif)$/i

type FileLike = { name: string; size: number; type: string }

export function isMedia(file: FileLike): boolean {
  return file.type.startsWith('image/') || file.type.startsWith('video/') || EXTRA_EXT.test(file.name)
}

/**
 * Adds `incoming` to `current` under the shared caps. Returns the files that
 * fit and one message per file that was turned away. Used by the client when
 * files are picked, and by the Route Handler to re-check what arrived.
 */
export function acceptMedia<T extends FileLike>(
  current: readonly T[],
  incoming: readonly T[],
): { files: T[]; rejected: string[] } {
  const files = [...current]
  const rejected: string[] = []
  let total = files.reduce((sum, f) => sum + f.size, 0)

  for (const file of incoming) {
    if (!isMedia(file)) rejected.push(m.fileType(file.name))
    else if (file.size > L.maxFileBytes) rejected.push(m.fileSize(file.name))
    else if (files.length >= L.maxFiles) rejected.push(m.fileCount)
    else if (total + file.size > L.maxTotalBytes) rejected.push(m.fileTotal)
    else {
      files.push(file)
      total += file.size
    }
  }

  return { files, rejected: [...new Set(rejected)] }
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
