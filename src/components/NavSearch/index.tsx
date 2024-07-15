'use client'

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { FormEvent, useState } from "react"
import { FaX, FaMagnifyingGlass } from "react-icons/fa6"

export default function NavSearch() {

  const [search, setSearch] = useState('')
  const searchParams = useSearchParams()
  const router = useRouter()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    console.log(search)
    if (!search.trim()) {
      alert('Enter search keywords properly!')
      return
    }
    router.push(`/search?key=` + search)
  }

  const searchFlag = searchParams.get('s')

  if (searchFlag === null || searchFlag !== 'search') {
    return <></>
  }

  return (
    <div className="absolute left-0 top-0 z-40 w-full global-responsive-px py-4 bg-neutral-100 text-neutral-900 flex justify-between items-center">
      <Link href="/"><h1 className="text-2xl font-bold select-none">SuperKart 🛒</h1></Link>
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search keywords..." autoFocus className="px-3 py-0.5 border-2 border-neutral-400 rounded disabled:opacity-50" required />
        <button type="submit" className="p-2 bg-neutral-900 text-neutral-100 text-sm rounded-full active:bg-neutral-800"><FaMagnifyingGlass /></button>
        <button type="button" onClick={() => router.back()} className="p-2 bg-neutral-900 text-neutral-100 text-sm rounded-full active:bg-neutral-800"><FaX /></button>
      </form>
    </div>
  )
}