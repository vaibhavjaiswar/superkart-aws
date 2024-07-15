import Image from "next/image"

type CategoryCardPropType = {
  item: {
    image: {
      src: string
      alt: string
    }
    label: string
  }
}

export default function CategoryCard({ item }: CategoryCardPropType) {
  return (
    <div key={item.label} className="p-6 xl:p-8 bg-neutral-50 text-neutral-800 flex flex-col items-center gap-4 xl:gap-6 rounded transition hover:scale-105">
      <Image src={item.image.src} width={200} height={200} alt={item.image.alt} priority />
      <span className="text-lg xl:text-xl">{item.label}</span>
    </div>
  )
}