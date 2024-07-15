'use client'

import GiveRating from "@/components/GiveRating"
import StarRating from "@/components/StarRating"
import { CategoryMap } from "@/constants/category"
import { SubCategoryMap } from "@/constants/subcategory"
import { useAppDispatch } from "@/redux/hooks"
import { CommonResponseType, ProductDBSchema } from "@/utils/types"
import axios from "axios"
import Image from "next/image"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"

type PropsType = {
  index: number
  order: {
    productid: string
    price: number
    quantity: number
    rating: number
    timestamp: number
  }
}

interface ResponseType extends CommonResponseType {
  data: ProductDBSchema
}

export default function OrderItem({ index, order }: PropsType) {

  const [product, setProduct] = useState<ProductDBSchema | null>(null)
  const [isFetching, setIsFetching] = useState(true)
  const [hasError, setHasError] = useState(false)

  const dispatch = useAppDispatch()

  const fetchProduct = useCallback(async () => {
    const response = await axios.get('/api/product/' + order.productid)
    const { ok, message, data } = response.data as ResponseType
    if (ok) {
      setProduct(data)
    } else {
      setHasError(true)
    }
  }, [order.productid])

  useEffect(() => {
    setIsFetching(true)
    fetchProduct()
    setIsFetching(false)
  }, [fetchProduct])

  if (isFetching || !product) {
    return <FallbackCard />
  }

  if (hasError) {
    return <ErrorCard />
  }

  return (
    <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-6 bg-white border border-neutral-300 rounded hover:shadow-md">
      <Image className="self-center" alt={product.name.S} src={product.imageurl.S} width={180} height={180} />
      <div className="flex flex-col justify-between gap-2">
        <div>
          <Link href={`/product/${product.id.S}`}>
            <h4 className="mb-2 text-lg font-semibold line-clamp-2 sm:line-clamp-1" title={product.name.S}>{product.name.S}</h4>
          </Link>
          <p className="my-2 text-sm line-clamp-4 sm:line-clamp-2" title={product.description.S}>{product.description.S}</p>
          <div className="flex gap-2">
            <Link href={`/categories/${product.category.S}`} className="px-3 py-1 text-xs sm:text-sm text-neutral-100 bg-neutral-900 rounded-full">
              {CategoryMap.get(product.category.S)}
            </Link>
            <Link href={`/categories/${product.category.S}/${product.subcategory.S}`} className="px-3 py-1 text-xs sm:text-sm text-neutral-100 bg-neutral-900 rounded-full">
              {SubCategoryMap.get(product.subcategory.S)}
            </Link>
          </div>
        </div>
        <div>
          <div className="mb-1 text-xs">
            <p>Price: ₹{order.price.toLocaleString('en-IN')}</p>
            <p>Quantity: {order.quantity}</p>
            <p>Total Price: ₹{(order.price * order.quantity).toLocaleString('en-IN')}</p>
            <p>Purchased On: {new Date(order.timestamp).toLocaleString()}</p>
          </div>
          {
            order.rating !== 0
              ? (
                <p className="flex gap-2">
                  <span>Your Rating:</span>
                  <StarRating classname="gap-0.5" rating={order.rating.toString()} />
                </p>
              ) : (
                <GiveRating productid={order.productid} index={index} />
              )
          }
        </div>
      </div>
    </div>
  )
}

function FallbackCard() {
  return (
    <div className="p-6 flex gap-6 bg-white border rounded">
      <div className="w-40 h-40 bg-neutral-300 rounded animate-pulse"></div>
      <div className="flex-grow flex flex-col gap-4">
        <div className="w-full h-7 bg-neutral-300 rounded animate-pulse"></div>
        <div className="w-1/2 h-7 bg-neutral-300 rounded animate-pulse"></div>
        <div className="w-3/4 h-7 bg-neutral-300 rounded animate-pulse"></div>
        <div className="w-1/3 h-7 bg-neutral-300 rounded animate-pulse"></div>
      </div>
    </div>
  )
}

function ErrorCard() {
  return (
    <div className="h-40 p-6 flex justify-center items-center text-neutral-500 bg-white border rounded">
      <p>Error in fetching this product. Please try again.</p>
    </div>
  )
}