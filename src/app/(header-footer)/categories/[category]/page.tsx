import ProductsGrid from "@/components/ProductsGrid"
import { Categories, CategoryMap } from "@/constants/category"
import { ProductDBSchema, CommonResponseType } from "@/utils/types"
import { redirect } from "next/navigation"

type CategoryPageType = {
  params: { category: Categories }
}

interface ResponseJsonType extends CommonResponseType {
  data: ProductDBSchema[]
}

export function generateMetadata({ params }: CategoryPageType) {
  return {
    title: `${CategoryMap.get(params.category)} | SuperKart 🛒`
  }
}

export default async function CategoryPage({ params }: CategoryPageType) {

  if (!CategoryMap.has(params.category)) {
    return redirect('/categories')
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/products/${params.category}`)
  const json = await response.json() as ResponseJsonType

  let error = null

  if (!json.ok) {
    error = json.message
  }

  const products = json.data.length > 0 ? json.data.map(product => ({
    id: product.id.S,
    image: {
      src: product.imageurl.S,
      alt: product.name.S
    },
    name: product.name.S,
    price: parseInt(product.price.N),
    discountPrice: parseInt(product.discountprice.N),
    rating: {
      average: product.rating.M.average.N,
      count: product.rating.M.count.N,
    },
  })) : []

  return (
    <>
      <ProductsGrid category={params.category} items={products} />
    </>
  )
}