import { dynamoDBClient } from "@/utils/aws";
import { GetItemCommand } from "@aws-sdk/client-dynamodb";
import { NextRequest, NextResponse } from "next/server";

type ParamsType = { params: { id: string } }

export async function GET(request: NextRequest, { params }: ParamsType) {
  try {
    if (!params.id) {
      return NextResponse.json({ ok: false, message: 'Product not provided.' }, { status: 400 })
    }

    const command = new GetItemCommand({
      TableName: 'superkart-products',
      Key: { id: { S: params.id } }
    })

    const response = await dynamoDBClient.send(command)

    if (response.$metadata.httpStatusCode !== 200) {
      return NextResponse.json({ ok: false, message: 'Some issue occured.' }, { status: response.$metadata.httpStatusCode })
    }

    return NextResponse.json({ ok: true, message: 'Product fetched successfully.', data: response.Item }, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ ok: false, message: 'Internal server error.' }, { status: 500 })
  }
}