import '@radix-ui/themes/styles.css'
import type { Metadata } from 'next'
import './global-styles.scss'

export const metadata: Metadata = {
  title: 'Pantheon',
  description: 'A WYSIWYG web design editor',
  openGraph: {
    type: 'website',
    locale: 'en',
    siteName: 'Pantheon',
    title: 'Pantheon',
    description: 'A WYSIWYG web design editor',
    images: [
      {
        url: 'https://radix-ui.studio/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Pantheon',
      },
    ],
  },
  icons: [
    {
      rel: 'icon',
      url: '/favicon.png',
    },
    {
      rel: 'icon',
      url: '/favicon.svg',
    },
    {
      media: '(prefers-color-scheme: light)',
      rel: 'icon',
      url: '/favicon.svg',
    },
    {
      media: '(prefers-color-scheme: dark)',
      rel: 'icon',
      url: '/favicon.svg',
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
