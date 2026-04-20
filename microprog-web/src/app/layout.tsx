import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MicroTutor — Learn Code One Step at a Time',
  description: 'An AI-powered programming tutor that teaches you code step by step.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}