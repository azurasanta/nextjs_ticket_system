
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from "../components/funcComponents/ThemeProvider"
import { Navbar, Footer } from '../components'
import { NextAuthProvider } from "../components/funcComponents/AuthProvider";
import Providers from '../redux/Provider'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Devonit',
  description: 'Official Homepage of Devonit',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" >
      <body className={`${inter.className}`}>
        <Providers>
          <NextAuthProvider>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
              <Navbar />
                {children}
            </ThemeProvider>
          </NextAuthProvider>
        </Providers>
      </body>
    </html>
  )
}
