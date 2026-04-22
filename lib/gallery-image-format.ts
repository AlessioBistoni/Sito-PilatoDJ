import sharp from 'sharp'

/** Lato in pixel: tutte le foto in galleria hanno stessa base visiva; crop centrale. */
export const GALLERY_SQUARE_PX = 1200

/**
 * Rende ogni sorgente un JPEG quadrato (crop cover + centro) per griglia coerente sul sito.
 * Applica `rotate()` per rispettare l’EXIF (foto a telefono).
 */
export async function toGallerySquareJpegBuffer(
  buffer: Buffer,
  quality: number
): Promise<Buffer> {
  return sharp(buffer)
    .rotate()
    .resize(GALLERY_SQUARE_PX, GALLERY_SQUARE_PX, {
      fit: 'cover',
      position: 'centre',
    })
    .jpeg({ quality, mozjpeg: true })
    .toBuffer()
}
