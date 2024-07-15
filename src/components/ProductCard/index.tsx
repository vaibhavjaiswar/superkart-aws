import Image from "next/image";
import Link from "next/link";
import StarRating from "@/components/StarRating";

type ProductCardPropType = {
  item: {
    id: string,
    image: {
      src: string
      alt: string
    }
    name: string
    price: number
    discountPrice?: number
    rating: {
      count: string
      average: string
    }
  }
}

export default function ProductCard({ item }: ProductCardPropType) {
  return (
    <Link href={`/product/${item.id}`}>
      <div className="bg-neutral-50 text-neutral-800 rounded overflow-hidden shadow-md transition hover:scale-105">
        <div className="m-4 xl:m-6 rounded overflow-hidden">
          <Image className="m-auto" src={item.image.src} alt={item.image.alt} width={300} height={300} priority />
        </div>
        <div className="p-4 xl:p-6">
          <p className="font-semibold truncate" title={item.name}>{item.name}</p>
          {
            true && (
              <div><StarRating rating={item.rating.average} /></div>
            )
          }
          <div className="flex justify-between items-center">
            <div>
              <span>₹{(item?.discountPrice ? item.discountPrice : item.price).toLocaleString('en-IN')}</span>
              {item?.discountPrice ? <span className="ml-2 text-sm text-neutral-500 line-through">₹{item.price}</span> : ''}
            </div>
            {item?.discountPrice ? <span className="text-green-600">{Math.round((1 - item.discountPrice / item.price) * 100)}% Off</span> : ''}
          </div>
        </div>
      </div>
    </Link>
  )
}