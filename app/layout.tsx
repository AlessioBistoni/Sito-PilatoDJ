import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Francesco Pilato DJ | Piluz',
  description: 'DJ professionista per le tue serate. Musica che fa ballare, esperienza che conta.',
  keywords: 'DJ, musica, serate, eventi, Francesco Pilato, Piluz',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  )
}

