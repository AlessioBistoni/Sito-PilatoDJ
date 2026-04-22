import sharp from 'sharp'
import { getSupabase } from '@/lib/supabase'
import { toGallerySquareJpegBuffer } from '@/lib/gallery-image-format'

/** Estrae la chiave in bucket da un URL pubblico .../images/... */
export function pathFromPublicImageUrl(imageUrl: string): string | null {
  const parts = imageUrl.split('/images/')
  if (parts.length < 2) return null
  return parts[1]
}

export async function removeStorageObjectByPublicUrl(imageUrl: string): Promise<void> {
  const fileName = pathFromPublicImageUrl(imageUrl)
  if (!fileName) return
  const { error } = await getSupabase().storage.from('images').remove([fileName])
  if (error) throw error
}

export async function uploadJpegToImages(
  buffer: Buffer,
  storagePath: string,
  opts: { maxEdge: number; quality: number; variant?: 'contain' | 'gallery-square' }
): Promise<string> {
  const variant = opts.variant ?? 'contain'
  const resized =
    variant === 'gallery-square'
      ? await toGallerySquareJpegBuffer(buffer, opts.quality)
      : await sharp(buffer)
          .rotate()
          .resize(opts.maxEdge, opts.maxEdge, {
            fit: 'inside',
            withoutEnlargement: true,
          })
          .jpeg({ quality: opts.quality })
          .toBuffer()

  const sb = getSupabase()
  const { error } = await sb.storage.from('images').upload(storagePath, resized, {
    contentType: 'image/jpeg',
    upsert: false,
  })
  if (error) throw error

  const { data } = sb.storage.from('images').getPublicUrl(storagePath)
  return data.publicUrl
}
