'use client'

import { motion } from 'framer-motion'
import { Music, Play, Volume2, VolumeX } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

const VIDEO_SRC = '/videos/hero-intro.mp4'
/** Ritardo prima della comparsa (dissolvenza) del testo per scorrere */
const SCROLL_CTA_DELAY_MS = 2500
/** Durata dissolvenza audio (ms) */
const VOLUME_FADE_MS = 500

/**
 * Home: su mobile solo video a tutto schermo (sotto la nav) che parte in automatico;
 * su desktop video + testo affiancati.
 */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const fadeRafRef = useRef<number | null>(null)
  const [muted, setMuted] = useState(true)
  const [showScrollCta, setShowScrollCta] = useState(false)

  const cancelVolumeFade = useCallback(() => {
    if (fadeRafRef.current !== null) {
      cancelAnimationFrame(fadeRafRef.current)
      fadeRafRef.current = null
    }
  }, [])

  /** Discesa del volume, poi muted (e callback opzionale, es. pausa). */
  const fadeOutAndMute = useCallback(
    (onComplete?: () => void) => {
      const video = videoRef.current
      cancelVolumeFade()
      if (!video) {
        setMuted(true)
        onComplete?.()
        return
      }

      if (video.muted) {
        setMuted(true)
        onComplete?.()
        return
      }

      const startVol = video.volume
      if (startVol === 0) {
        video.muted = true
        setMuted(true)
        onComplete?.()
        return
      }

      const t0 = performance.now()
      const step = (now: number) => {
        const elapsed = now - t0
        const t = Math.min(1, elapsed / VOLUME_FADE_MS)
        const eased = 1 - (1 - t) * (1 - t)
        const v = videoRef.current
        if (!v) {
          fadeRafRef.current = null
          return
        }
        v.volume = Math.max(0, startVol * (1 - eased))
        if (t < 1) {
          fadeRafRef.current = requestAnimationFrame(step)
        } else {
          v.volume = 1
          v.muted = true
          setMuted(true)
          fadeRafRef.current = null
          onComplete?.()
        }
      }
      fadeRafRef.current = requestAnimationFrame(step)
    },
    [cancelVolumeFade]
  )

  /** Sali in volume partendo da muto. */
  const fadeInUnmute = useCallback(() => {
    const video = videoRef.current
    cancelVolumeFade()
    if (!video) {
      setMuted(false)
      return
    }

    setMuted(false)
    video.muted = false
    video.volume = 0
    void video.play().catch(() => {})

    const t0 = performance.now()
    const step = (now: number) => {
      const elapsed = now - t0
      const t = Math.min(1, elapsed / VOLUME_FADE_MS)
      const eased = t * t
      const v = videoRef.current
      if (!v) {
        fadeRafRef.current = null
        return
      }
      v.volume = eased
      if (t < 1) {
        fadeRafRef.current = requestAnimationFrame(step)
      } else {
        v.volume = 1
        fadeRafRef.current = null
      }
    }
    fadeRafRef.current = requestAnimationFrame(step)
  }, [cancelVolumeFade])

  useEffect(() => {
    const t = window.setTimeout(() => setShowScrollCta(true), SCROLL_CTA_DELAY_MS)
    return () => window.clearTimeout(t)
  }, [])

  useEffect(() => {
    return () => cancelVolumeFade()
  }, [cancelVolumeFade])

  /** Pausa + dissolvenza volume quando la hero non è in vista. */
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return
        if (entry.isIntersecting) {
          const el = videoRef.current
          if (el) {
            el.currentTime = 0
            void el.play().catch(() => {})
          }
        } else {
          fadeOutAndMute(() => {
            const el = videoRef.current
            if (!el) return
            el.pause()
            el.currentTime = 0
          })
        }
      },
      { root: null, threshold: 0, rootMargin: '0px' }
    )
    io.observe(section)
    return () => io.disconnect()
  }, [fadeOutAndMute])

  const toggleAudio = useCallback(() => {
    if (muted) {
      fadeInUnmute()
    } else {
      fadeOutAndMute()
    }
  }, [muted, fadeInUnmute, fadeOutAndMute])

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative flex min-h-0 w-full min-w-0 flex-col overflow-hidden bg-black pt-20 md:min-h-screen md:pt-24"
    >
      <div className="flex w-full min-w-0 flex-1 flex-col md:min-h-[calc(100vh-5.5rem)] md:flex-row">
        {/* Video */}
        <div className="relative h-[calc(100dvh-5rem)] w-full shrink-0 overflow-hidden bg-black md:h-auto md:min-h-[min(100vh,56rem)] md:w-[42%] md:max-w-lg lg:max-w-xl">
          <video
            ref={videoRef}
            className="absolute inset-0 z-0 h-full w-full object-cover md:object-contain"
            autoPlay
            muted={muted}
            loop
            playsInline
            preload="auto"
            aria-label="Video introduttivo"
          >
            <source src={VIDEO_SRC} type="video/mp4" />
          </video>
          {/* Overlay: video più scuro, effetto sfondo */}
          <div
            className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/55 via-black/45 to-black/60"
            aria-hidden
          />
          <button
            type="button"
            onClick={toggleAudio}
            className="absolute bottom-4 right-4 z-40 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-white/30 bg-black/60 p-2.5 text-white shadow-lg backdrop-blur-md transition hover:border-pink-500/60 hover:bg-black/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 md:bottom-5 md:right-5"
            aria-label={muted ? 'Attiva audio del video' : 'Disattiva audio del video'}
            aria-pressed={!muted}
          >
            {muted ? (
              <VolumeX className="h-5 w-5 shrink-0" aria-hidden />
            ) : (
              <Volume2 className="h-5 w-5 shrink-0" aria-hidden />
            )}
          </button>
        </div>

        {/* Desktop: testi a destra — nascosti su mobile */}
        <div className="hidden min-h-0 min-w-0 flex-1 flex-col justify-center px-5 py-10 md:flex md:px-8 lg:px-12 xl:px-16">
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-xl"
          >
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-sm font-medium text-white/90 backdrop-blur-sm">
              <Music className="text-pink-500" size={16} aria-hidden />
              DJ professionista
            </p>
            <h1 className="mb-4 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              <span className="text-gradient">Francesco Pilato</span>
              <br />
              <span className="text-2xl text-white sm:text-3xl lg:text-4xl">
                Piluz per gli amici
              </span>
            </h1>
            <p className="mb-8 text-base leading-relaxed text-gray-300 sm:text-lg">
              La musica che più mi piace, quella che per me ha un significato, ma soprattutto quella
              che <span className="font-semibold text-pink-500">MI, CI e VI</span> farà ballare.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#contact"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white transition hover:opacity-95"
              >
                Contattami
                <Play size={16} className="shrink-0" />
              </a>
              <a
                href="#biografia"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-pink-500/50"
              >
                Scopri di più
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Testo per scorrere: solo scritta, centrata, dissolvenza, dopo ~2,5s */}
      {showScrollCta ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute inset-x-0 bottom-6 z-30 flex justify-center px-4 md:bottom-8"
          style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
        >
          <a
            href="#biografia"
            className="pointer-events-auto flex min-h-[44px] max-w-full flex-col items-center justify-center gap-1.5 text-center text-sm font-medium tracking-wide text-white/90 transition-colors hover:text-pink-200 focus:outline-none focus-visible:text-pink-200"
            aria-label="Scorri e vai alla biografia"
          >
            <span>Scopri il sito</span>
            <motion.span
              className="text-lg leading-none text-white/75"
              aria-hidden
              animate={{ y: [0, 3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              ↓
            </motion.span>
          </a>
        </motion.div>
      ) : null}
    </section>
  )
}
