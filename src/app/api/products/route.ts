import { dynamoDBClient } from "@/utils/aws";
import { ScanCommand } from "@aws-sdk/client-dynamodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const command = new ScanCommand({ TableName: 'superkart-products' })

    const response = await dynamoDBClient.send(command)

    return NextResponse.json({ ok: true, message: 'temporary response.', data: response.Items }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ ok: false, message: 'Internal server error occurred.' }, { status: 500 })
  }
}