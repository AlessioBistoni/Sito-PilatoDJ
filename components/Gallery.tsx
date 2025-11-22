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
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      const savedImages = localStorage.getItem('gallery_images')
      if (savedImages) {
        const parsedImages = JSON.parse(savedImages)
        if (parsedImages.length > 0) {
          setImages(parsedImages)
        }
      }
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
    <section id="gallery" className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Le Mie Serate</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto mb-6" />
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Un assaggio delle serate che ho animato. Musica, energia e atmosfera unica.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer"
              onClick={() => openModal(index)}
              whileHover={{ scale: 1.05, zIndex: 10 }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <motion.div
                className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                initial={{ y: 20 }}
                whileHover={{ y: 0 }}
              >
                <p className="font-semibold">{image.alt}</p>
              </motion.div>
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={closeModal}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative max-w-6xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 p-2 glass-effect rounded-full hover:bg-pink-500 transition-colors"
            >
              <X size={24} />
            </button>

            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 glass-effect rounded-full hover:bg-pink-500 transition-colors"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 glass-effect rounded-full hover:bg-pink-500 transition-colors"
            >
              <ChevronRight size={24} />
            </button>

            <div className="relative w-full h-[90vh]">
              <Image
                src={images[selectedImage].src}
                alt={images[selectedImage].alt}
                fill
                className="object-contain"
                priority
              />
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
              <p className="text-white text-lg font-semibold">
                {images[selectedImage].alt}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                {selectedImage + 1} / {images.length}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}
