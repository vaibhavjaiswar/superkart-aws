import { dynamoDBClient } from "@/utils/aws"
import { JWTVerifyReturnType } from "@/utils/types"
import { UpdateItemCommand } from "@aws-sdk/client-dynamodb"
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken"
import { NextRequest, NextResponse } from "next/server"

export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value

    if (typeof token !== 'string' || !token) {
      return NextResponse.json({ ok: false, message: 'Token not provided.' }, { status: 400 })
    }

    const { email } = jwt.verify(token, process.env.JWT_SECRET_KEY || '', {}) as JWTVerifyReturnType

    const command = new UpdateItemCommand({
      TableName: 'superkart-users',
      Key: { email: { S: email } },
      AttributeUpdates: { cart: { Action: 'PUT', Value: { L: [] } } },
    })

    const response = await dynamoDBClient.send(command)

    if (response.$metadata.httpStatusCode !== 200) {
      return NextResponse.json({ ok: false, message: 'Error occured while removing cart items.' }, { status: 400 })
    }

    return NextResponse.json({ ok: true, message: 'All product removed from your cart with checkout.' }, { status: 200 })
  } catch (error) {
    if (error instanceof TokenExpiredError)
      return NextResponse.json({ ok: false, message: 'Token is expired. Please login again.' }, { status: 401 })
    if (error instanceof JsonWebTokenError)
      return NextResponse.json({ ok: false, message: 'Token cannot be autheticated. Please login again.' }, { status: 401 })
    console.log(error)
    return NextResponse.json({ ok: false, message: 'Some (internal server) error occured.' }, { status: 500 })
  }
}