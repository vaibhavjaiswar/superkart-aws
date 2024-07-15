import CategoriesGrid from "@/components/CategoryGrid"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Categories | SuperKart 🛒"
}

export default function CategoriesPage() {

  const electronicsItems = [
    { image: { src: '/images/mobile1.png', alt: 'Mobile image' }, label: 'Mobiles', subcategory: 'mobiles' },
    { image: { src: '/images/laptop1.png', alt: 'Laptop image' }, label: 'Laptops', subcategory: 'laptops' },
    { image: { src: '/images/camera1.png', alt: 'Camera image' }, label: 'Cameras', subcategory: 'cameras' },
    { image: { src: '/images/headphone1.png', alt: 'Headphone image' }, label: 'Headphones', subcategory: 'headphones' },
    { image: { src: '/images/projector1.png', alt: 'Projector image' }, label: 'Projectors', subcategory: 'projectors' },
    { image: { src: '/images/powerbank1.png', alt: 'Powerbank image' }, label: 'Powerbanks', subcategory: 'powerbanks' },
  ]

  const homeAppliancesItems = [
    { image: { src: '/images/mixergrinder1.png', alt: 'Mixer/Grinder image' }, label: 'Mixer/Grinder', subcategory: 'mixer-grinders' },
    { image: { src: '/images/ironpress1.png', alt: 'Iron Press image' }, label: 'Iron Press', subcategory: 'iron-presses' },
    { image: { src: '/images/fan1.png', alt: 'Fan image' }, label: 'Fans', subcategory: 'fans' },
  ]

  const fashionItems = [
    { image: { src: '/images/wristwatch1.png', alt: 'Wrist watch image' }, label: 'Wrist Watches', subcategory: 'wrist-watches' },
    { image: { src: '/images/spectacle1.png', alt: 'Spectacle image' }, label: 'Spectacles', subcategory: 'spectacles' },
    { image: { src: '/images/shirt1.png', alt: 'Shirt image' }, label: 'Shirts', subcategory: 'shirts' },
    { image: { src: '/images/jeans1.png', alt: 'Jeans image' }, label: 'Jeans', subcategory: 'jeans' },
    { image: { src: '/images/shoe1.png', alt: 'Shoe image' }, label: 'Shoes', subcategory: 'shoes' },
    { image: { src: '/images/tshirt1.png', alt: 'T-Shirt image' }, label: 'T-Shirts', subcategory: 't-shirts' },
  ]
  return (
    <>
      <CategoriesGrid className="bg-neutral-800 text-neutral-100" title="Latest Electronics" category="electronics" items={electronicsItems} />
      <CategoriesGrid className="bg-neutral-100 text-neutral-800" title="Home Appliances" category="home-appliances" items={homeAppliancesItems} />
      <CategoriesGrid className="bg-neutral-800 text-neutral-100" title="Fashion" category="fashion" items={fashionItems} />
    </>
  )
}