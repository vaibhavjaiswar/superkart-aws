import { dynamoDBClient } from "@/utils/aws";
import { SignUpFormInputType } from "@/utils/types";
import { PutItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

interface RequestDataType extends Omit<SignUpFormInputType, 'retypePassword'> { }

type UserSchema = {
  name: { S: string },
  email: { S: string },
  password: { S: string },
  timestamp: { N: string },
}

type UserExistsResponseType = {
  '$metadata': {
    httpStatusCode: number
    requestId: string
    extendedRequestId: undefined
    cfId: undefined
    attempts: number
    totalRetryDelay: number
  }
  Count: number
  Items: {
    password: { S: string }
    email: { S: string }
    name: { S: string }
    timestamp: { S: string }
  }[]
  ScannedCount: number
}

type AddUserResponeType = {
  '$metadata': {
    httpStatusCode: number
    requestId: string
    extendedRequestId: unknown
    cfId: unknown
    attempts: number
    totalRetryDelay: number
  }
}

const saltRounds = 10

export async function POST(request: NextRequest) {
  try {
    const user: RequestDataType = await request.json()

    // check if user exists
    const userExistsCommand = new QueryCommand({
      TableName: 'superkart-users',
      KeyConditions: { email: { ComparisonOperator: "EQ", AttributeValueList: [{ S: user.email }] } },
    })

    const userExistsResponse = await dynamoDBClient.send(userExistsCommand) as UserExistsResponseType

    if (userExistsResponse.$metadata.httpStatusCode === 200) {
      if (userExistsResponse.Count === 1) {
        return NextResponse.json({ ok: false, message: 'Account already exists with given email ID.' }, { status: 200 })
      }
    } else {
      return NextResponse.json({ ok: false, message: 'Some error occured' }, { status: 400 })
    }

    // add new user in database
    const hashedPassword = await bcrypt.hash(user.password, saltRounds)

    const item: UserSchema = {
      name: { S: user.name },
      email: { S: user.email },
      password: { S: hashedPassword },
      timestamp: { N: Date.now().toString() },
    }

    const command = new PutItemCommand({
      TableName: 'superkart-users',
      Item: item,
    })

    const response = await dynamoDBClient.send(command) as AddUserResponeType

    if (response.$metadata.httpStatusCode !== 200) {
      return NextResponse.json({ ok: false, message: 'Unable to create new user account.' }, { status: response.$metadata.httpStatusCode })
    }

    return NextResponse.json({ ok: true, message: 'New user account created successfully.' }, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ ok: false, message: 'Some (internal server) error occured.' }, { status: 500 })
  }
}