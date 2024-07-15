export const dynamic = 'force-dynamic'

import { dynamoDBClient } from "@/utils/aws"
import { JWTVerifyReturnType, UserDBSchema } from "@/utils/types"
import { GetItemCommand } from "@aws-sdk/client-dynamodb"
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken"
import { NextRequest, NextResponse } from "next/server"

type ItemType = Pick<UserDBSchema, 'cart'>

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value

    if (typeof token !== 'string' || !token) {
      return NextResponse.json({ ok: false, message: 'Token not provided.' }, { status: 400 })
    }

    const { email } = jwt.verify(token, process.env.JWT_SECRET_KEY || '', {}) as JWTVerifyReturnType

    const command = new GetItemCommand({
      TableName: 'superkart-users',
      Key: { email: { S: email } },
      AttributesToGet: ['cart'],
    })

    const response = await dynamoDBClient.send(command)

    if (response.$metadata.httpStatusCode !== 200) {
      return NextResponse.json({ ok: false, message: 'Error occured while adding item to cart.' }, { status: 400 })
    }

    const { cart } = response.Item as ItemType
    const cartItems = cart.L.map(item => ({ productid: item.M.productid.S, quantity: parseInt(item.M.quantity.N) }))

    return NextResponse.json({ ok: true, message: 'Cart items fetched.', data: cartItems }, { status: 200 })
  } catch (error) {
    if (error instanceof TokenExpiredError)
      return NextResponse.json({ ok: false, message: 'Token is expired. Please login again.' }, { status: 401 })
    if (error instanceof JsonWebTokenError)
      return NextResponse.json({ ok: false, message: 'Token cannot be autheticated. Please login again.' }, { status: 401 })
    console.log(error)
    return NextResponse.json({ ok: false, message: 'Some (internal server) error occured.' }, { status: 500 })
  }
}