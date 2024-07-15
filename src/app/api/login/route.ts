import { dynamoDBClient } from "@/utils/aws";
import { LoginFormInputType } from "@/utils/types";
import { GetItemCommand } from "@aws-sdk/client-dynamodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

interface RequestDataType extends LoginFormInputType { }

export async function POST(request: NextRequest) {
  try {
    const user: RequestDataType = await request.json()
    const cookieStore = cookies()

    // check if user exists
    const userExistsCommand = new GetItemCommand({
      TableName: 'superkart-users',
      Key: { email: { S: user.email } },
    })

    const userExistsResponse = await dynamoDBClient.send(userExistsCommand)

    if (userExistsResponse.$metadata.httpStatusCode === 200) {
      if (userExistsResponse.Item?.email.S === user.email && typeof userExistsResponse.Item.name.S === 'string') {
        const { password: { S: hashedPassword } } = userExistsResponse.Item as { password: { S: string } }
        const username = userExistsResponse.Item.name.S

        const isPasswordValid = await bcrypt.compare(user.password, hashedPassword)

        if (isPasswordValid) {
          cookieStore.set(
            'token',
            jwt.sign({ name: username, email: user.email }, process.env.JWT_SECRET_KEY || '', { expiresIn: '1h' }),
            { sameSite: 'strict' }
          )
          cookieStore.set('name', username, { sameSite: 'strict' })
          cookieStore.set('email', user.email, { sameSite: 'strict' })
          return NextResponse.json({ ok: true, message: 'User authentication successful.' }, { status: 200 })
        } else {
          return NextResponse.json({ ok: true, message: 'Invalid credentials. Incorrect Password.' }, { status: 401 })
        }
      } else {
        return NextResponse.json({ ok: true, message: 'Invalid credentials. No Account found with given credentials.' }, { status: 401 })
      }
    } else {
      return NextResponse.json({ ok: false, message: 'Some error occured.' }, { status: 400 })
    }
  } catch (error) {
    console.log(error)
    return NextResponse.json({ ok: false, message: 'Some (internal server) error occured.' }, { status: 500 })
  }
}