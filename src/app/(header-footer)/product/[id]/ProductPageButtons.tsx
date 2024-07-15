'use client'

import Button from "@/components/Button"
import Input from "@/components/Input"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { fetchCartItems } from "@/redux/reducers/cart"
import { CommonResponseType } from "@/utils/types"
import { yupResolver } from "@hookform/resolvers/yup"
import axios from "axios"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import * as yup from "yup"

interface ResponseType extends CommonResponseType { }

type ProductPageButtonsType = {
  productID: string
  price: number
}

type FormDataType = { quantity: number }

const formSchema = yup.object().shape({
  quantity: yup.number().typeError("must be a number").required("required").moreThan(0, "must be greater than 0").lessThan(100, "must be less than 100"),
})

export default function ProductPageButtons({ productID, price }: ProductPageButtonsType) {

  const { control, formState: { errors, isSubmitting }, handleSubmit } = useForm<FormDataType>({
    defaultValues: { quantity: 1 },
    resolver: yupResolver(formSchema),
  })
  const dispatch = useAppDispatch()
  const user = useAppSelector(state => state.user)
  const cartItems = useAppSelector(state => state.cart.items)

  const handleAddToCart: SubmitHandler<FormDataType> = async (data) => {
    try {
      if (cartItems.map(item => item.productid).includes(productID)) {
        alert('This item is already in your cart!')
        return
      }
      if (!isLoggedIn()) {
        alert('You must be logged in to add this item to your cart.')
        return
      }
      const { quantity } = data
      const response = await axios.post('/api/add-to-cart', { productID, quantity })
      const { ok, message } = response.data as ResponseType
      if (ok) {
        dispatch(fetchCartItems())
      }
      alert(message)
    } catch (error: any) {
      console.log(error)
      alert(error.response.data.message)
    }
  }

  const handleBuy: SubmitHandler<FormDataType> = async (data) => {
    try {
      if (!isLoggedIn()) {
        alert('You must be logged in to but this item.')
        return
      }
      const { quantity } = data
      const response = await axios.post('/api/buy-products', [{ productid: productID, quantity, price }])
      const { ok, message } = response.data as CommonResponseType
      alert(message)
    } catch (error: any) {
      console.log(error)
      alert(error.response.data.message)
    }
  }

  const isLoggedIn = () => user.name !== '' && user.email !== ''

  return (
    <form>
      <div className="mb-4 sm:text-center">
        <label htmlFor="quantity">Quantity:</label>&nbsp;
        <div className="inline-block w-full sm:w-20">
          <Controller name="quantity" control={control} render={({ field }) => <Input type="number" field={field} />} />
        </div>
        {errors.quantity && <p className="text-xs text-red-500">({errors.quantity.message})</p>}
      </div>
      <div className="text-center flex flex-col sm:flex-row gap-4">
        <Button type="button" variant="outline" onClick={handleSubmit(handleAddToCart)} disabled={isSubmitting}>Add To Cart</Button>
        <Button type="button" variant="solid" onClick={handleSubmit(handleBuy)} disabled={isSubmitting}>Buy Now</Button>
      </div>
    </form>
  )
}