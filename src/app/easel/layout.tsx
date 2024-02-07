export default function EaselLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body
        suppressHydrationWarning
        style={{
          minHeight: '100vh',
        }}
      >
        {children}
      </body>
    </html>
  )
}
