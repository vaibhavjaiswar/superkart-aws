import Link from "next/link";
import { Suspense } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import NavSearch from "../NavSearch";
import UserInfo from "../UserInfo";
import MobileNav from "./MobileNav";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 shadow-md">
      <div className="relative global-responsive-px py-4 bg-neutral-100 text-neutral-900 flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="flex justify-between items-center">
          <Link href="/"><h1 className="w-max text-2xl font-bold select-none">SuperKart 🛒</h1></Link>
        </div>
        <nav className="hidden sm:flex flex-row items-center gap-4">
          <Link href="/categories">
            <span className="inline-block px-1 hover:underline select-none">Categories</span>
          </Link>
          <Link href="?s=search" className="inline-block px-1 hover:underline">
            <span className="flex items-center gap-2 select-none"><FaMagnifyingGlass /> Search</span>
          </Link>
          <Suspense>
            <NavSearch />
          </Suspense>
          <Suspense>
            <UserInfo />
          </Suspense>
        </nav>
        <MobileNav />
      </div>
    </header>
  )
}