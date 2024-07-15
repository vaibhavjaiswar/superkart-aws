import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/app/globals.css"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import StoreProvider from "@/redux/StoreProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SuperKart 🛒",
  description: "A online e-commerce web application project",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <StoreProvider>
      <html lang="en">
        <body className={`${inter.className} relative h-screen flex flex-col`}>
          {/* <Header /> */}
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </body>
      </html>
    </StoreProvider>
  )
}