import { NextFetchEvent, NextRequest, NextResponse } from "next/server"
import { CommonResponseType } from "@/utils/types"

interface ResponseType extends CommonResponseType {
  data: { name: string, email: string }
}

export async function middleware(request: NextRequest, next: NextFetchEvent) {

  const token = request.cookies.get('token')?.value

  if (!token) {
    return NextResponse.redirect(request.nextUrl.origin + '/login')
  }

  const response = await fetch(request.nextUrl.origin + '/api/verify-user', {
    method: 'post',
    body: JSON.stringify({ token: token }),
  })
  const json = await response.json() as ResponseType

  if (!json.ok) {
    return NextResponse.redirect(request.nextUrl.origin + '/login')
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/account', '/cart', '/orders', '/admin/:path*'],
}