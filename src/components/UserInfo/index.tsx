import { CommonResponseType } from "@/utils/types";
import { cookies } from "next/headers";
import Link from "next/link";
import UserInfoMenu from "./UserInfoMenu";
import { lazy, Suspense } from "react";

const FetchCartItems = lazy(() => import("./FetchCartItems"))

interface ResponseType extends CommonResponseType {
  data: { name: string, email: string }
}

export default async function UserInfo() {

  const cookieStorage = cookies()
  const token = cookieStorage.get('token')?.value

  const response = await fetch(process.env.NEXT_PUBLIC_HOST + '/api/verify-user', {
    method: 'post',
    body: JSON.stringify({ token: token }),
  })
  const json = await response.json() as ResponseType

  if (json.ok) {
    return (
      <>
        <Suspense><UserInfoMenu user={json.data} /></Suspense>
        <Suspense><FetchCartItems /></Suspense>
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