'use client'

import { useAppSelector } from "@/redux/hooks"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FaListUl } from "react-icons/fa6"
import { FaShoppingCart, FaSignOutAlt, FaUserAlt } from "react-icons/fa"
import FetchCartItems from "./FetchCartItems"

type PropsType = { setIsOpen: React.Dispatch<React.SetStateAction<boolean>> }

export default function MobileUserInfo({ setIsOpen }: PropsType) {

  const router = useRouter()

  const { email, name } = useAppSelector(state => state.user)
  const numberOfItemsInCart = useAppSelector(state => state.cart.items).length

  const handleLogOut = () => {
    document.cookie = `token=expired; SameSite=strict;`
    document.cookie = `name=; SameSite=strict;`
    document.cookie = `email=; SameSite=strict;`
    router.refresh()
  }

  if (email !== '' && name !== '') {
    return (
      <>
        <>
          <Link href="/orders" onClick={() => setIsOpen(o => !o)}>
            <li className="flex items-center gap-3 cursor-pointer select-none">
              <FaListUl />
              <span>My Orders</span>
            </li>
          </Link>
          <Link href="/cart" onClick={() => setIsOpen(o => !o)}>
            <li className="flex items-center gap-3 cursor-pointer select-none">
              <FaShoppingCart />
              <span>My Cart {numberOfItemsInCart > 0 && <span className="text-xs">({numberOfItemsInCart})</span>}</span>
            </li>
          </Link>
          <Link href="/account" onClick={() => setIsOpen(o => !o)}>
            <li className="flex items-center gap-3 cursor-pointer select-none">
              <FaUserAlt />
              <span>My Account</span>
            </li>
          </Link>
          <li className="flex items-center gap-3 cursor-pointer select-none" onClick={handleLogOut}>
            <FaSignOutAlt />
            <span>Log Out</span>
          </li>
        </>
        <FetchCartItems />
      </>
    )
  }

  return (
    <>
      <Link href="/login">
        <span className="inline-block px-1 hover:underline">Login</span>
      </Link>
      <Link href="/signup">
        <span className="inline-block px-1 hover:underline">Sign Up</span>
      </Link>
    </>
  )
}