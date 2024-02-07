import '@radix-ui/themes/styles.css'
import type { Metadata } from 'next'
import './global-styles.scss'

export const metadata: Metadata = {
  title: 'Radix Studio',
  description: 'Radix Studio',
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
