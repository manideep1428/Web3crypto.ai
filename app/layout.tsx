import './globals.css'
import NextTopLoader from 'nextjs-toploader';
import { Providers } from './Providers';
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
      <html lang="en">
        <body>
           <NextTopLoader/>
           <Providers>
           {children}
           </Providers>
        </body>
      </html>
  )
}