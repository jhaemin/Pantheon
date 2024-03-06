import '@radix-ui/themes/styles.css'
import type { Metadata } from 'next'
import './global-styles.scss'

export const metadata: Metadata = {
  title: 'Radix Studio',
  description: 'Radix Studio',
  icons: [
    {
      rel: 'icon',
      url: '/favicon.png',
    },
    {
      rel: 'icon',
      url: '/favicon-black.svg',
    },
    {
      media: '(prefers-color-scheme: light)',
      rel: 'icon',
      url: '/favicon-black.svg',
    },
    {
      media: '(prefers-color-scheme: dark)',
      rel: 'icon',
      url: '/favicon-white.svg',
    },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
