import { CommonResponseType } from "@/utils/types"
import axios from "axios"
import { useRouter } from "next/navigation"
import { ReactElement, useState } from "react"
import { FaRegStar, FaStar } from "react-icons/fa"

type PropsType = {
  productid: string
  index: number
}

export default function GiveRating({ productid, index }: PropsType) {

  const [rating, setRating] = useState(0)
  const [finalRating, setFinalRating] = useState(0)

  const router = useRouter()

  const Stars: ReactElement[] = []

  for (let i = 1; i <= 5; i++) {
    Stars.push(<Star key={i} index={i} rating={rating} setRating={setRating} />)
  }

  const handleMouseLeave = () => finalRating === 0 ? setRating(0) : setRating(finalRating)

  const handleClick = () => setFinalRating(rating)

  const handleSubmit = async () => {
    try {
      const response = await axios.post('/api/rate-product', { productid, rating: finalRating, index })
      const { ok, message } = response.data as CommonResponseType
      alert(message)
      if (ok) {
        router.refresh()
      }
    } catch (error) {
      alert('Some error occured.')
      console.log(error)
    }
  }

  const handleReset = () => {
    setFinalRating(0)
    setRating(0)
  }

  return (
    <div className="flex justify-normal items-center gap-2">
      <span>Give Rating:</span>
      <span className="flex justify-normal items-center" onMouseLeave={handleMouseLeave} onClick={handleClick}>
        {...Stars}
      </span>
      {
        finalRating !== 0 && <>
          <button className="px-2 py-0.5 text-xs bg-neutral-200 rounded" onClick={handleSubmit}>Submit</button>
          <button className="px-2 py-0.5 text-xs bg-neutral-200 rounded" onClick={handleReset}>Reset</button>
        </>
      }
    </div >
  )
}

type StarPropsType = {
  index: number
  rating: number
  setRating: React.Dispatch<React.SetStateAction<number>>
}

function Star({ index, rating, setRating }: StarPropsType) {

  const handleMouseEnter = () => setRating(index)

  return (
    <span className="p-0.5 cursor-pointer" onMouseEnter={handleMouseEnter}>
      {index <= rating ? <FaStar /> : <FaRegStar />}
    </span>
  )
}