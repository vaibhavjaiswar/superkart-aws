import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/app/globals.css"
import Image from "next/image"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SuperKart 🛒",
  description: "A online e-commerce web application project",
}

export default function SignUpLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.className} relative h-screen flex flex-col`}>
        <Image className="blur-sm object-cover" alt="Background pattern image" src="/images/e-commerce-bg-pattern.jpg" fill />
        <main className="flex-grow z-0">
          <div className="h-full global-responsive-px py-4 flex justify-center items-center">
            <div className="w-full max-w-4xl min-h-[52vh] md:max-h-[82vh] flex flex-col md:flex-row bg-neutral-100 text-neutral-900 rounded-lg shadow-2xl">
              <section className="p-8 pb-0 md:p-12 flex-1 flex flex-col justify-center items-start">
                <h1 className="text-2xl sm:text-3xl">Welcome to</h1>
                <h1 className="text-4xl sm:text-5xl">SuperKart 🛒</h1>
                <p className="max-w-xl mt-3 text-xs">Lorem ipsum dolor sit amet consectetur adipisicing elit. Non, corporis qui, error vitae inventore optio facilis dolores libero dolor rerum ullam molestiae odio. Maiores repellat, nam quisquam ipsum cupiditate facere.</p>
              </section>
              <section className="p-8 md:p-12 flex-1 md:overflow-scroll">
                {children}
              </section>
            </div>
          </div>
        </main>
      </body>
    </html>
  )
}