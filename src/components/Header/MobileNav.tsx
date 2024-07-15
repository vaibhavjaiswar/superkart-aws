'use client'

import Link from "next/link";
import { Suspense } from "react";
import { useState } from "react"
import { FaMagnifyingGlass } from "react-icons/fa6";
import { FaBars } from "react-icons/fa";
import MobileUserInfo from "../UserInfo/MobileUserInfo";
import MobileNavSearch from "../NavSearch/MobileNavSearch";

export default function MobileNav() {

  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <span className="absolute top-0 right-0 global-responsive-pr p-2 pt-5 text-xl sm:hidden" onClick={() => setIsOpen(o => !o)}>
        <FaBars />
      </span>
      <Suspense>
        <MobileNavSearch />
      </Suspense>
      {
        isOpen && (
          <nav className="sm:hidden flex flex-col items-center gap-2">
            <Link href="/categories" onClick={() => setIsOpen(o => !o)}>
              <span className="inline-block px-1 hover:underline">Categories</span>
            </Link>
            <Link href="?ms=search" className="inline-block px-1 hover:underline" onClick={() => setIsOpen(o => !o)}>
              <span className="flex items-center gap-2"><FaMagnifyingGlass /> Search</span>
            </Link>
            <Suspense>
              <MobileUserInfo setIsOpen={setIsOpen} />
            </Suspense>
          </nav>
        )
      }
    </>
  )
}