'use client'

import Button from "@/components/Button"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { checkoutCart } from "@/redux/reducers/cart"
import { CommonResponseType } from "@/utils/types"
import axios from "axios"
import Head from "next/head"
import { useEffect, useState } from "react"
import CartItemCard from "./CartItemCard"

type PricesType = {
  productid: string
  quantity: number
  price: number
}

export default function CartPage() {

  const [cartTotalPrice, setCartTotalPrice] = useState(0)
  const [isCartCheckingOut, setIsCartCheckingOut] = useState(false)
  const [products, setProducts] = useState<PricesType[]>([])

  const cartItems = useAppSelector(state => state.cart.items)
  const isFetchingCart = useAppSelector(state => state.cart.isFetchingCart)
  const dispatch = useAppDispatch()

  const pushProduct = (product: PricesType) => {
    setProducts(products => {
      const index = products.findIndex(item => item.productid === product.productid)
      if (index === -1) {
        products.push(product)
      }
      return [...products]
    })
  }

  const emptyProducts = () => setProducts([])

  const handleCartCheckout = async () => {
    try {
      setIsCartCheckingOut(true)
      if (products.length > 0) {
        const response = await axios.post('/api/buy-products', products)
        const { ok, message } = response.data as CommonResponseType
        if (ok) {
          setCartTotalPrice(0)
          dispatch(checkoutCart())
        }
        alert(message)
      }
    } catch (error: any) {
      console.log(error)
      alert(error.response.data.message)
    } finally {
      setIsCartCheckingOut(false)
    }
  }

  useEffect(() => {
    document.title = 'My Cart | SuperKart 🛒'
  }, [])

  useEffect(() => {
    const total = products.reduce((sum, product) => sum + product.price * product.quantity, 0)
    setCartTotalPrice(total)
  }, [products])

  return (
    <section className="global-responsive-px py-8 xl:py-10">
      <Head>
        <title>My Cart | SuperKart 🛒</title>
      </Head>
      <h3 className="text-2xl md:text-3xl xl:text-4xl mb-6 xl:mb-8">Your Cart</h3>
      {
        cartTotalPrice !== 0 && (
          <div className="mb-4 max-w-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <p>Cart Total: ₹{cartTotalPrice.toLocaleString('en-IN')}</p>
            <Button variant="solid" onClick={handleCartCheckout} disabled={isCartCheckingOut}>Checkout</Button>
          </div>
        )
      }
      <div className="max-w-3xl flex flex-col gap-4">
        {
          isFetchingCart ? (
            <p>Fetching cart items...</p>
          ) :
            cartItems.length === 0 ? (
              <p>Your cart is empty!</p>
            ) : (
              cartItems.map((item, i) => <CartItemCard key={item.productid} index={i} item={item} pushProduct={pushProduct} emptyProducts={emptyProducts} />)
            )
        }
      </div>
    </section>
  )
}