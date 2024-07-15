import { CategoryMap } from "@/constants/category"
import { SubCategoryMap } from "@/constants/subcategory"
import { ProductDBSchema, CommonResponseType } from "@/utils/types"
import Image from "next/image"
import Link from "next/link"
// import ProductPageButtons from "./buttons"
import { notFound } from "next/navigation"
import ProductPageButtons from "./ProductPageButtons"
import StarRating from "@/components/StarRating"

type ProductPageType = {
  params: { id: string }
}

interface ResponseJsonType extends CommonResponseType {
  data: ProductDBSchema
}

export async function generateMetadata({ params }: ProductPageType) {

  const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/product/${params.id}`)
  const json = await response.json() as ResponseJsonType
  const { ok, message, data } = json

  return {
    title: `${data.name.S} | ${SubCategoryMap.get(data.subcategory.S)} | ${CategoryMap.get(data.category.S)} | SuperKart 🛒`
  }
}

export default async function ProductPage({ params }: ProductPageType) {

  const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/product/${params.id}`)
  const json = await response.json() as ResponseJsonType
  const { ok, message, data } = json

  if (!ok) {
    notFound()
  }

  const rating = { average: data.rating.M.average.N, count: data.rating.M.count.N }
  const finalPrice = parseFloat(data?.discountprice.N ? data.discountprice.N : data.price.N)

  return (
    <section className="min-h-[72vh] global-responsive-px py-8 xl:py-10">
      <div className="flex flex-col md:flex-row gap-8 md:gap-6 xl:gap-8">
        <div className="flex-1 relative">
          <div className="flex flex-col sm:items-center gap-4 sticky top-24">
            <h1 className="hidden md:block mb-4 text-2xl xl:text-3xl text-transparent">SuperKart Product</h1>
            <Image className="m-auto bg-neutral-100" src={data.imageurl.S} alt={data.name.S} width={300} height={300} priority />
            <div className="text-center">
              <span className="mr-2">₹{finalPrice.toLocaleString('en-IN')}</span>
              {data?.discountprice.N ? <span className="text-sm text-neutral-500 line-through">₹{data.price.N}</span> : ''}
            </div>
            <ProductPageButtons productID={params.id} price={finalPrice} />
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <h1 className="mb-2 text-2xl xl:text-3xl">{data.name.S}</h1>
          {rating.count !== '0' && (
            <div className="flex items-center">
              <span className="flex items-center" title={`${rating.average} out of 5`}>
                <span className="text-lg">Rating:</span>
                &nbsp;
                <StarRating rating={rating.average} />
              </span>
              &nbsp;
              <span className="text-xs" title={`Total ${rating.count} ratings`}>({rating.count} ratings)</span>
            </div>
          )}
          {
            data.description.S.split('\n').map((line, i) => <p key={i}>{line}</p>)
          }
          <ul>
            {
              data.features.SS.map(feature => <li key={feature} className="my-1 list-inside list-disc">{feature}</li>)
            }
          </ul>
          <p>Category : <Link href={`/categories/${data.category.S}`}>
            <span className="px-3 py-1 text-neutral-100 bg-neutral-800 rounded-full">
              {CategoryMap.get(data.category.S)}
            </span>
          </Link>
          </p>
          <p>Sub Category : <Link href={`/categories/${data.category.S}/${data.subcategory.S}`}>
            <span className="px-3 py-1 text-neutral-100 bg-neutral-800 rounded-full">
              {SubCategoryMap.get(data.subcategory.S)}
            </span>
          </Link>
          </p>
        </div>
      </div>
    </section>
  )
}