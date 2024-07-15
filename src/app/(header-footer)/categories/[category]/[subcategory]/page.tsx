import ProductsGrid from "@/components/ProductsGrid"
import { Categories, CategoryMap } from "@/constants/category"
import { SubCategories, SubCategoryMap } from "@/constants/subcategory"
import { ProductDBSchema, CommonResponseType } from "@/utils/types"
import { redirect } from "next/navigation"

type CategoryPageType = {
  params: { category: Categories, subcategory: SubCategories }
}

interface ResponseJsonType extends CommonResponseType {
  data: ProductDBSchema[]
}

export function generateMetadata({ params }: CategoryPageType) {
  return {
    title: `${SubCategoryMap.get(params.subcategory)} | ${CategoryMap.get(params.category)} | SuperKart 🛒`
  }
}

export default async function SubcategoryPage({ params }: CategoryPageType) {

  if (!CategoryMap.has(params.category) || !SubCategoryMap.has(params.subcategory)) {
    return redirect('/categories')
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/products/${params.category}/${params.subcategory}`)
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
      <ProductsGrid category={params.category} subcategory={params.subcategory} items={products} />
    </>
  )
}