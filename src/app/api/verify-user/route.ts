import { JWTVerifyReturnType } from "@/utils/types";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (typeof token !== 'string' || !token) {
      return NextResponse.json({ ok: false, message: 'Token not provided.' }, { status: 400 })
    }

    const { name, email } = jwt.verify(token, process.env.JWT_SECRET_KEY || '', {}) as JWTVerifyReturnType

    return NextResponse.json({ ok: true, message: 'User token is verified.', data: { name, email } }, { status: 200 })
  } catch (error) {
    if (error instanceof TokenExpiredError)
      return NextResponse.json({ ok: false, message: 'Token is expired. Please login again.' }, { status: 401 })
    if (error instanceof JsonWebTokenError)
      return NextResponse.json({ ok: false, message: 'Token cannot be autheticated. Please login again.' }, { status: 401 })
    console.log(error)
    return NextResponse.json({ ok: false, message: 'Some (internal server) error occured.' }, { status: 500 })
  }
}