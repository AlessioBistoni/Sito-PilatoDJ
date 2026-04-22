'use client'

import Image from 'next/image'
import { resolveBlogImageSrc } from '@/lib/blog-image-url'

type BlogImageProps = {
  src: string | undefined | null
  alt: string
  /** Uso con contenitore `relative` con altezza/larghezza definite */
  fill?: boolean
  /** `contain` = proporzioni corrette (possibili bande); `cover` = riempie il box tagliando i bordi */
  objectFit?: 'contain' | 'cover'
  className?: string
  sizes?: string
  priority?: boolean
}

/**
 * Gli URL Storage (https) a volte non passano l’ottimizzatore next/image in dev
 * se i remotePatterns non coincidono col progetto. Per gli URL http(s) usiamo <img> nativo.
 */
export default function BlogImage({
  src,
  alt,
  fill,
  objectFit = 'contain',
  className,
  sizes,
  priority,
}: BlogImageProps) {
  const resolved = resolveBlogImageSrc(src)
  if (!resolved) return null

  const fitClass = objectFit === 'cover' ? 'object-cover' : 'object-contain'
  const isRemote = resolved.startsWith('http://') || resolved.startsWith('https://')

  if (isRemote) {
    if (fill) {
      return (
        // eslint-disable-next-line @next/next/no-img-element -- URL esterni Storage: evita vincoli remotePatterns
        <img
          src={resolved}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className={`absolute inset-0 h-full w-full ${fitClass} ${className ?? ''}`}
        />
      )
    }
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={resolved}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className={className}
      />
    )
  }

  return (
    <Image
      src={resolved}
      alt={alt}
      fill={fill}
      className={`${fill ? fitClass : ''} ${className ?? ''}`.trim()}
      sizes={sizes}
      priority={priority}
    />
  )
}
