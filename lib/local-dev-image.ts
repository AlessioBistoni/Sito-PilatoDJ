import { promises as fs } from 'fs'
import path from 'path'
import sharp from 'sharp'
import { isSupabaseConfigured } from '@/lib/supabase'
import { toGallerySquareJpegBuffer } from '@/lib/gallery-image-format'

const CARICATE_PATH = '/immagini/caricate/'

/**
 * In `npm run dev` senza variabili Supabase, salva sotto `public/immagini/caricate/`
 * così l’URL `/immagini/caricate/...` funziona come le altre statiche.
 */
export function isLocalDevImageUploadEnabled(): boolean {
  return process.env.NODE_ENV === 'development' && !isSupabaseConfigured()
}

export async function saveLocalDevGalleryJpeg(
  buffer: Buffer,
  originalName: string
): Promise<string> {
  const timestamp = Date.now()
  const safe = (originalName || 'image').replace(/[^a-zA-Z0-9.-]/g, '_')
  const base = `dev-${timestamp}-${safe.replace(/\.[^.]+$/i, '')}.jpg`
  const dir = path.join(process.cwd(), 'public', 'immagini', 'caricate')
  await fs.mkdir(dir, { recursive: true })
  const resized = await toGallerySquareJpegBuffer(buffer, 85)
  const fullPath = path.join(dir, base)
  await fs.writeFile(fullPath, resized)
  return `${CARICATE_PATH}${base}`
}

/** Stesso criterio della galleria in dev: `npm run dev` senza Supabase per lo storage. */
export async function saveLocalDevBlogJpeg(
  buffer: Buffer,
  originalName: string
): Promise<string> {
  const timestamp = Date.now()
  const safe = (originalName || 'image').replace(/[^a-zA-Z0-9.-]/g, '_')
  const base = `blog-dev-${timestamp}-${safe.replace(/\.[^.]+$/i, '')}.jpg`
  const dir = path.join(process.cwd(), 'public', 'immagini', 'caricate')
  await fs.mkdir(dir, { recursive: true })
  const resized = await sharp(buffer)
    .rotate()
    .resize(1920, 1920, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 92 })
    .toBuffer()
  const fullPath = path.join(dir, base)
  await fs.writeFile(fullPath, resized)
  return `${CARICATE_PATH}${base}`
}

/**
 * Rimuove un file sotto `public/immagini/` (caricate, serate con nomi “upload” ecc.),
 * ma non le 8 serate d’esempio (`serate/1.jpg` … `serate/8.jpg`).
 * Accetta `src` tipo `/immagini/caricate/dev-....jpg` o path completo da URL.
 */
export async function tryDeleteLocalPublicImmaginiFile(
  publicPathOrUrl: string
): Promise<boolean> {
  let pathname = publicPathOrUrl.trim()
  if (pathname.startsWith('http://') || pathname.startsWith('https://')) {
    try {
      pathname = new URL(pathname).pathname
    } catch {
      return false
    }
  }
  if (!pathname.startsWith('/')) {
    return false
  }
  if (!pathname.startsWith('/immagini/') || pathname.includes('..')) {
    return false
  }
  // 8 default stock del sito
  if (/^\/immagini\/serate\/[1-8]\.jpe?g$/i.test(pathname)) {
    return false
  }
  const rel = pathname.replace(/^\//, '')
  const cwd = process.cwd()
  const filePath = path.join(cwd, 'public', rel)
  const immaginiRoot = path.join(cwd, 'public', 'immagini')
  const absFile = path.normalize(filePath)
  const absRoot = path.normalize(immaginiRoot)
  if (absFile.length < absRoot.length + 1 || !absFile.startsWith(absRoot + path.sep)) {
    return false
  }
  try {
    const st = await fs.stat(absFile)
    if (!st.isFile()) return false
    await fs.unlink(absFile)
    return true
  } catch {
    return false
  }
}

/** @deprecated usare tryDeleteLocalPublicImmaginiFile */
export const tryDeleteLocalCaricateFile = tryDeleteLocalPublicImmaginiFile
