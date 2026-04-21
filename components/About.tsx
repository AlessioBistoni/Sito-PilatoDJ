'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const BIO_TEXT = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.

At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Harum quidem rerum facilis est et expedita distinctio.`

const BIO_BG = '/immagini/biografia-sfondo.png'

export default function About() {
  return (
    <section
      id="biografia"
      className="relative isolate min-h-[min(100svh,900px)] overflow-hidden py-16 sm:min-h-[90svh] sm:py-20 md:min-h-[88svh] md:py-24 lg:min-h-[92svh] lg:py-28"
    >
      {/* z-0: stack sfondo; stesso trattamento su tutti i breakpoint */}
      <div className="pointer-events-none absolute inset-0 -z-10 min-h-full bg-black" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 -z-10 min-h-full overflow-hidden"
        aria-hidden
      >
        {/*
          Mobile: object-cover = riempie la larghezza (la colonna stretta con bg-contain restringeva troppo l’img).
          md+: object-contain = intera immagine visibile nello spazio orizzontale.
        */}
        <Image
          src={BIO_BG}
          alt=""
          fill
          className="object-cover object-center opacity-[0.1] sm:object-[center_30%] md:object-contain md:object-center md:opacity-[0.26] lg:opacity-[0.28]"
          sizes="100vw"
        />
      </div>
      {/* Velatura: mobile più coprente (foto più discreta); desktop più leggera (foto più leggibile) */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 min-h-full bg-gradient-to-b from-black/86 from-15% via-black/80 to-black/88 md:from-black/66 md:via-black/59 md:to-black/70"
        aria-hidden
      />

      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
            <span className="text-gradient">Biografia</span>
          </h2>
          <div className="mx-auto mb-8 h-1 w-24 bg-gradient-to-r from-pink-500 to-purple-500" />
          <div className="text-left text-base leading-relaxed text-gray-200 drop-shadow sm:text-lg md:text-xl [&>p+p]:mt-5">
            {BIO_TEXT.split('\n\n').map((block, i) => (
              <p key={i}>{block}</p>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
