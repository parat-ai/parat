import type { Metadata } from 'next'
import { DM_Sans, DM_Mono, Instrument_Serif } from 'next/font/google'
import '@/styles/globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-mono',
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-instrument-serif',
})

export const metadata: Metadata = {
  title: 'Parat',
  description: 'AI-powered legal assistant',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="no" className={`${dmSans.variable} ${dmMono.variable} ${instrumentSerif.variable}`}>
      <body>{children}</body>
    </html>
  )
}
