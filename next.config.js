const storagePublicPath = '/storage/v1/object/public/**'

function supabaseStorageRemotePatterns() {
  const list = [
    { protocol: 'https', hostname: '**.supabase.co', pathname: storagePublicPath },
    { protocol: 'http', hostname: '127.0.0.1', pathname: storagePublicPath },
    { protocol: 'http', hostname: 'localhost', pathname: storagePublicPath },
  ]
  const fromEnv = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  if (fromEnv) {
    try {
      const { hostname, protocol } = new URL(fromEnv)
      if (hostname) {
        const p = protocol === 'http:' ? 'http' : 'https'
        if (!list.some((x) => x.hostname === hostname && x.protocol === p)) {
          list.push({ protocol: p, hostname, pathname: storagePublicPath })
        }
      }
    } catch {
      // ignore
    }
  }
  return list
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
    ]
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  images: {
    remotePatterns: supabaseStorageRemotePatterns(),
    unoptimized: false,
  },
  reactStrictMode: true,
}

module.exports = nextConfig
