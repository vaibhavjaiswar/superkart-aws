import { ReactElement } from "react";
import { FaStar, FaStarHalf } from "react-icons/fa";

type PropsType = {
  classname?: string
  rating: string
}

export default function StarRating({ classname, rating }: PropsType) {

  if (rating === '0') {
    return (
      <p className="font-light text-neutral-500">No ratings</p>
    )
  }

  const averageRating = parseFloat(rating)
  const partialStarCount = averageRating % 1
  const fullStarCount = averageRating - partialStarCount

  const Stars: ReactElement[] = []

  for (let i = 0; i < fullStarCount; i++) {
    Stars.push(<FaStar key={i} />)
  }

  if (0.8 <= partialStarCount) {
    Stars.push(<FaStar key="Last partialstar" />)
  } else if (0.28 <= partialStarCount) {
    Stars.push(<FaStarHalf key="Last partialstar" />)
  }

  return (
    <span className={`py-1 flex items-center ${classname}`}>
      {...Stars}
    </span>
  )
}