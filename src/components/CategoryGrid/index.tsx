import Link from "next/link"
import CategoryCard from "../CategoryCard"

type CategoriesGridPropType = {
  title: string
  category: string
  items: {
    image: {
      src: string
      alt: string
    }
    label: string
    subcategory: string
  }[]
  className?: string
}

export default function CategoriesGrid({ title, category, items, className }: CategoriesGridPropType) {
  return (
    <section className={`px-6 sm:px-12 md:px-16 xl:px-36 py-8 xl:py-12 ${className}`}>
      <h3 className="inline-block text-2xl md:text-3xl xl:text-4xl mb-6 xl:mb-8 hover:underline"><Link href={`/categories/${category}`}>{title}</Link></h3>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {
          items.map(item => (
            <Link key={item.label} href={`/categories/${category}/${item.subcategory}`}>
              <CategoryCard item={item} />
            </Link>
          ))
        }
      </div>
    </section>
  )
}