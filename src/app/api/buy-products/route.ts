import { dynamoDBClient } from "@/utils/aws";
import { JWTVerifyReturnType } from "@/utils/types";
import { UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

type RequestJsonType = {
  productid: string
  quantity: number
  price: number
}[]

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value

    if (typeof token !== 'string' || !token) {
      return NextResponse.json({ ok: false, message: 'Token not provided.' }, { status: 400 })
    }

    const { email } = jwt.verify(token, process.env.JWT_SECRET_KEY || '', {}) as JWTVerifyReturnType

    const products = await request.json() as RequestJsonType
    console.log(email, products)

    const command = new UpdateItemCommand({
      TableName: 'superkart-users',
      Key: { email: { S: email } },
      AttributeUpdates: {
        orders: {
          Action: 'ADD',
          Value: {
            L: products.map(product => ({
              M: {
                productid: { S: product.productid },
                quantity: { N: product.quantity.toString() },
                price: { N: product.price.toString() },
                rating: { N: '0' },
                timestamp: { S: Date.now().toString() },
              }
            }))
          }
        },
      },
    })

    const response = await dynamoDBClient.send(command)

    if (response.$metadata.httpStatusCode !== 200) {
      return NextResponse.json({ ok: false, message: 'Error occured while placing order.' }, { status: 400 })
    }

    return NextResponse.json({ ok: true, message: 'Order placed successfully.' }, { status: 200 })
  } catch (error) {
    if (error instanceof TokenExpiredError)
      return NextResponse.json({ ok: false, message: 'Token is expired. Please login again.' }, { status: 401 })
    if (error instanceof JsonWebTokenError)
      return NextResponse.json({ ok: false, message: 'Token cannot be autheticated. Please login again.' }, { status: 401 })
    console.log(error)
    return NextResponse.json({ ok: false, message: 'Internal server error occurred.' }, { status: 500 })
  }
}