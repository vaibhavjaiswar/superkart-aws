'use client'

import { useRouter, useSearchParams } from "next/navigation"
import { FormEvent, useState } from "react"
import { FaMagnifyingGlass, FaX } from "react-icons/fa6"

export default function MobileNavSearch() {

  const [search, setSearch] = useState('')
  const searchParams = useSearchParams()
  const router = useRouter()

  const mobileFlag = searchParams.get('ms')

  if (mobileFlag === null || mobileFlag !== 'search') {
    if (mobileFlag !== 'search') {
      return <></>
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    console.log(search)
    if (!search.trim()) {
      alert('Enter search keywords properly!')
      return
    }
    router.push(`/search?key=` + search)
  }

  return (
    <div className="absolute top-0 left-0 z-40 w-full h-full global-responsive-px py-4 bg-neutral-100 text-neutral-900">
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search keywords..." autoFocus className="flex-grow px-3 py-0.5 border-2 border-neutral-400 rounded disabled:opacity-50" required />
        <button type="submit" className="p-2 bg-neutral-900 text-neutral-100 text-sm rounded-full active:bg-neutral-800">
          <FaMagnifyingGlass />
        </button>
        <button type="button" onClick={() => router.back()} className="p-2 bg-neutral-900 text-neutral-100 text-sm rounded-full active:bg-neutral-800">
          <FaX />
        </button>
      </form>
    </div>
  )
}