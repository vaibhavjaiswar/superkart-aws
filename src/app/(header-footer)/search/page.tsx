import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Search | SuperKart 🛒",
}

type PropsType = {
  params: {}
  searchParams: { key: string }
}

export default function SearchPage({ params, searchParams }: PropsType) {
  return (
    <section className="min-h-[72vh] global-responsive-px py-8 xl:py-10">
      <h3 className="text-2xl md:text-3xl xl:text-4xl mb-6 xl:mb-8">Search results for &quot;{searchParams.key}&quot;</h3>
    </section>
  )
}