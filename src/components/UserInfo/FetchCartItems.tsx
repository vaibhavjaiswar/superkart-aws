'use client'

import { useAppDispatch } from "@/redux/hooks"
import { fetchCartItems } from "@/redux/reducers/cart"
import { useEffect } from "react"

export default function FetchCartItems() {

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchCartItems())
  }, [dispatch])

  return <></>
}