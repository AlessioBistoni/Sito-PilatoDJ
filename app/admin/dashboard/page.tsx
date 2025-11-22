'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Image as ImageIcon, FileText, LogOut, Settings } from 'lucide-react'

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState({ dates: 0, images: 0, posts: 0 })

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const isAuthenticated = localStorage.getItem('admin_authenticated')
    if (!isAuthenticated) {
      router.push('/admin')
      return
    }

    // Carica statistiche
    const dates = JSON.parse(localStorage.getItem('dates') || '[]').length
    const images = JSON.parse(localStorage.getItem('gallery_images') || '[]').length
    const posts = JSON.parse(localStorage.getItem('blog_posts') || '[]').length
    
    setStats({ dates, images, posts })
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated')
    router.push('/admin')
  }

  const menuItems = [
    {
      title: 'Gestione Date',
      description: 'Aggiungi o rimuovi date degli eventi',
      icon: Calendar,
      href: '/admin/dates',
      color: 'from-pink-500 to-rose-500',
    },
    {
      title: 'Gestione Gallery',
      description: 'Aggiungi o rimuovi immagini delle serate',
      icon: ImageIcon,
      href: '/admin/gallery',
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Gestione Blog',
      description: 'Pubblica aggiornamenti e pensieri',
      icon: FileText,
      href: '/admin/blog',
      color: 'from-blue-500 to-purple-500',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard Admin</h1>
            <p className="text-gray-400">Gestisci contenuti del sito</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white hover:bg-gray-700 transition-colors"
          >
            <LogOut size={20} />
            <span>Esci</span>
          </button>
        </div>

        {/* Menu Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-pink-500/50 transition-all group"
              >
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${item.color} mb-4`}>
                  <Icon className="text-white" size={24} />
                </div>
                <h2 className="text-xl font-bold text-white mb-2 group-hover:text-pink-500 transition-colors">
                  {item.title}
                </h2>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </Link>
            )
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h3 className="text-gray-400 text-sm mb-2">Date Attive</h3>
            <p className="text-3xl font-bold text-white">{stats.dates}</p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h3 className="text-gray-400 text-sm mb-2">Immagini Gallery</h3>
            <p className="text-3xl font-bold text-white">{stats.images}</p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h3 className="text-gray-400 text-sm mb-2">Post Blog</h3>
            <p className="text-3xl font-bold text-white">{stats.posts}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

