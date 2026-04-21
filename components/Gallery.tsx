'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface GalleryImage {
  id: string
  src: string
  alt: string
}

const defaultImages = Array.from({ length: 8 }, (_, i) => ({
  id: `default-${i + 1}`,
  src: `/immagini/serate/${i + 1}.jpg`,
  alt: `Serata ${i + 1}`,
}))

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>(defaultImages)
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const response = await fetch('/api/data/gallery')
        const data = await response.json()
        const parsedImages = data.images || []
        if (!cancelled) {
          setImages(parsedImages.length > 0 ? parsedImages : defaultImages)
        }
      } catch {
        if (!cancelled) setImages(defaultImages)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const openModal = (index: number) => setSelectedImage(index)
  const closeModal = () => setSelectedImage(null)
  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % images.length)
    }
  }
  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + images.length) % images.length)
    }
  }

  return (
    <section id="gallery" className="section-y relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />

      <div className="container relative z-10 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Le Mie Serate</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto mb-6" />
          <p className="mx-auto max-w-3xl px-1 text-base leading-relaxed text-gray-300 sm:text-lg md:text-xl">
            Un assaggio delle serate che ho animato. Musica, energia e atmosfera unica.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl md:transition-transform md:hover:z-10 md:hover:scale-[1.03]"
              onClick={() => openModal(index)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  openModal(index)
                }
              }}
              aria-label={`Apri immagine: ${image.alt}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-300 md:group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100" />
              <div className="absolute bottom-2 left-2 right-2 text-white sm:bottom-3 sm:left-3 sm:right-3 md:bottom-4 md:left-4 md:right-4">
                <p className="line-clamp-2 text-xs font-semibold sm:text-sm">{image.alt}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedImage !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/92 p-2 pt-[max(0.5rem,env(safe-area-inset-top))] pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:p-4"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-label="Galleria a schermo intero"
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            className="relative flex h-[min(92dvh,100vh)] w-full max-w-6xl flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeModal}
              className="tap-target absolute right-1 top-1 z-20 rounded-full glass-effect hover:bg-pink-500 sm:right-2 sm:top-2"
              aria-label="Chiudi"
            >
              <X size={22} />
            </button>

            <button
              type="button"
              onClick={prevImage}
              className="tap-target absolute left-1 top-1/2 z-20 -translate-y-1/2 rounded-full glass-effect hover:bg-pink-500 sm:left-3"
              aria-label="Immagine precedente"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              type="button"
              onClick={nextImage}
              className="tap-target absolute right-1 top-1/2 z-20 -translate-y-1/2 rounded-full glass-effect hover:bg-pink-500 sm:right-3"
              aria-label="Immagine successiva"
            >
              <ChevronRight size={24} />
            </button>

            <div className="relative min-h-0 flex-1">
              <Image
                src={images[selectedImage].src}
                alt={images[selectedImage].alt}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>

            <div className="shrink-0 px-2 pb-1 pt-3 text-center sm:pt-4">
              <p className="text-sm font-semibold text-white sm:text-lg">
                {images[selectedImage].alt}
              </p>
              <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                {selectedImage + 1} / {images.length}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}
