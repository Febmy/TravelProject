import type { Metadata, Viewport } from 'next'
import { Figtree } from 'next/font/google'
import './globals.css'

const figtree = Figtree({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-figtree',
})

export const metadata: Metadata = {
  title: 'Safara Travel — Temukan Perjalanan Terbaik untuk Jiwa dan Pikiran Anda',
  description:
    'Pilihan hotel kurasi terbaik dan paket perjalanan ibadah Umrah premium yang aman dan nyaman sesuai standar Safara.',
  icons: {
    icon: '/icon.svg',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#0F766E',
}

import { LanguageProvider } from '@/context/LanguageContext'

import { AuthProvider } from '@/components/AuthProvider'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className={`${figtree.variable}`}>
      <body className={`${figtree.className} bg-[#FAF9F6] text-[#1C1A16] min-h-screen antialiased selection:bg-[#CCFBF1] selection:text-[#0F766E]`}>
        <AuthProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
