export const dynamic = 'force-dynamic'

import { dynamoDBClient } from "@/utils/aws";
import { UserDBSchema } from "@/utils/types";
import { GetItemCommand } from "@aws-sdk/client-dynamodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email')

    if (!email) {
      return NextResponse.redirect(request.nextUrl.origin + '/login')
    }

    const command = new GetItemCommand({
      TableName: 'superkart-users',
      Key: { email: { S: email } },
      AttributesToGet: ['name', 'email', 'timestamp'],
    })

    const response = await dynamoDBClient.send(command)

    if (response.$metadata.httpStatusCode !== 200) {
      return NextResponse.json({ ok: false, message: 'Some error occured while fetching account details.' }, { status: 400 })
    }

    const userData = response.Item as UserDBSchema
    const data = { name: userData.name.S, email: userData.email.S, timestamp: parseInt(userData.timestamp.N) }

    return NextResponse.json({ ok: true, message: 'Account details fetched.', data }, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ ok: false, message: 'Internal server error occured.' }, { status: 500 })
  }
}