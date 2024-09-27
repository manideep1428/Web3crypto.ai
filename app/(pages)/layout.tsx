import { Appbar } from '@/components/core/Appbar'
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
      <html lang="en">
        <body>
        <Appbar/> 
        {children}
        </body>
      </html>
  )
}