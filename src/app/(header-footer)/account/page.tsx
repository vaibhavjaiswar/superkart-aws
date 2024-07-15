export const dynamic = 'force-dynamic'

import { CommonResponseType } from "@/utils/types"
import { Metadata } from "next"
import { cookies } from "next/headers"

interface ResponseType extends CommonResponseType {
  data: {
    name: string
    email: string
    timestamp: number
  }
}

export const metadata: Metadata = {
  title: "My Account | SuperKart 🛒",
}

export default async function AccountPage() {
  try {
    const cookieStore = cookies()
    const emailCookie = cookieStore.get('email')?.value

    const response = await fetch(process.env.NEXT_PUBLIC_HOST + '/api/get-account-details?email=' + emailCookie || '')
    const { ok, message, data } = await response.json() as ResponseType

    if (!ok) {
      throw Error(message)
    }

    const { email, name, timestamp } = data

    return (
      <section className="min-h-[64vh] global-responsive-px py-8 xl:py-10">
        <h3 className="text-2xl md:text-3xl xl:text-4xl mb-6 xl:mb-8">Account Details</h3>
        <p>Name: <span className="font-semibold">{name}</span></p>
        <p>Email: <span className="font-semibold">{email}</span></p>
        <p>Account created on <span className="font-semibold">{(new Date(timestamp)).toLocaleString()}</span>.</p>
      </section>
    )
  } catch (error: any) {
    console.log(error)
    return (
      <section className="min-h-[64vh] global-responsive-px py-8 xl:py-10">
        <h3 className="text-2xl md:text-3xl xl:text-4xl mb-6 xl:mb-8">Account Details</h3>
        <p>{error.message}</p>
      </section>
    )
  }
}