'use client'

import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { setUser } from "@/redux/reducers/user"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { FaShoppingCart, FaSignOutAlt, FaUserAlt, FaUserCircle } from "react-icons/fa"
import { FaListUl } from "react-icons/fa6"

type PropsType = {
  user: {
    name: string
    email: string
  }
}

export default function UserInfoMenu({ user }: PropsType) {

  const [isOpen, setIsOpen] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const numberOfItemsInCart = useAppSelector(state => state.cart.items).length

  const flag = searchParams.get('s')

  const handleLogOut = () => {
    document.cookie = `token=expired; SameSite=strict;`
    document.cookie = `name=; SameSite=strict;`
    document.cookie = `email=; SameSite=strict;`
    router.refresh()
  }

  useEffect(() => {
    dispatch(setUser({ name: user.name, email: user.email }))
  }, [dispatch, user.name, user.email])

  useEffect(() => {
    if (flag !== null || flag === 'search') {
      setIsOpen(false)
    }
  }, [flag])

  return (
    <div className="relative z-0">
      <span className="px-1 flex items-center gap-2 cursor-pointer select-none hover:underline" title={user.name} onClick={() => setIsOpen(o => !o)}>
        <FaUserCircle />
        <span className="max-w-32 line-clamp-1">{user.name}</span>
      </span>
      {
        isOpen && (
          <ul className="mt-5 absolute top-full right-0 w-max bg-neutral-100 rounded-b shadow-md overflow-hidden">
            <Link href="/orders" onClick={() => setIsOpen(o => !o)}>
              <li className="px-4 py-2 flex items-center gap-3 cursor-pointer select-none hover:bg-neutral-200">
                <FaListUl />
                <span>My Orders</span>
              </li>
            </Link>
            <Link href="/cart" onClick={() => setIsOpen(o => !o)}>
              <li className="px-4 py-2 flex items-center gap-3 cursor-pointer select-none hover:bg-neutral-200">
                <FaShoppingCart />
                <span>My Cart {numberOfItemsInCart > 0 && <span className="text-xs">({numberOfItemsInCart})</span>}</span>
              </li>
            </Link>
            <Link href="/account" onClick={() => setIsOpen(o => !o)}>
              <li className="px-4 py-2 flex items-center gap-3 cursor-pointer select-none hover:bg-neutral-200">
                <FaUserAlt />
                <span>My Account</span>
              </li>
            </Link>
            <li className="px-4 py-2 flex items-center gap-3 cursor-pointer select-none hover:bg-neutral-200" onClick={handleLogOut}>
              <FaSignOutAlt />
              <span>Log Out</span>
            </li>
          </ul>
        )
      }
    </div>
  )
}