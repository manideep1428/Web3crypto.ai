import './globals.css'
import NextTopLoader from 'nextjs-toploader';
import { Providers } from './Providers';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], weights: ['400', '500', '600', '700'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
      <html lang="en">
        <body className={inter.className}>
           <NextTopLoader/>
           <Providers>
           {children}
           </Providers>
        </body>
      </html>
  )
}