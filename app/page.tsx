import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Collaborations from '@/components/Collaborations'
import Services from '@/components/Services'
import Dates from '@/components/Dates'
import Gallery from '@/components/Gallery'
import BlogPreview from '@/components/Blog'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="relative min-w-0 overflow-x-hidden pb-safe">
      <Navigation />
      <Hero />
      <About />
      <Collaborations />
      <Services />
      <Dates />
      <Gallery />
      <BlogPreview />
      <Contact />
      <Footer />
    </main>
  )
}

