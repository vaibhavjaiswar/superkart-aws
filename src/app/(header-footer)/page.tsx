import Image from "next/image"
import SuggestionForm from "./SuggestionForm"
import Link from "next/link"

export default async function Home() {
  return (
    <>
      <section className="min-h-[72vh] flex flex-col md:flex-row md:gap-4">
        <div className="global-responsive-pl pt-8 pb-12 w-full md:w-5/12 lg:w-5/12 self-center">
          <div className="max-w-96">
            <h1 className="text-4xl md:text-5xl">Best deals on 5G mobiles!</h1>
            <p className="my-4 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            <Link href='/categories/electronics/mobiles' className="px-3 py-1 rounded bg-neutral-900 text-neutral-100 border-4 border-neutral-900 active:outline active:outline-2 active:outline-neutral-400">
              Explore Now
            </Link>
          </div>
        </div>
        <div className="h-[52vh] sm:h-[64vh] md:h-auto flex-grow relative">
          <Image src="/images/hero.webp" alt="Hero banner image" className="object-cover object-top" fill priority />
        </div>
      </section>
      <section className="global-responsive-px py-8 bg-neutral-100 flex flex-col md:flex-row gap-8 md:items-center">
        <div className="flex-1">
          <h3 className="text-3xl">Have a suggestion?</h3>
          <p className="text-xs max-w-md">Voluptates possimus aperiam molestias dolores est iure aliquid qui voluptas, laborum eligendi? Adipisci quia non eligendi consectetur fugit corrupti et quisquam vel?</p>
        </div>
        <div className="flex-1">
          <SuggestionForm />
        </div>
      </section>
    </>
  )
}