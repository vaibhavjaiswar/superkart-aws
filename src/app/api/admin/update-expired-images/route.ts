export const dynamic = 'force-dynamic'

import { ImagePreSignedURLExpiryInterval } from "@/constants";
import { dynamoDBClient } from "@/utils/aws";
import { ScanCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { NextRequest, NextResponse } from "next/server";

type ResponseItem = {
  id: { S: string }
  imagekey: { S: string }
  imageurltimestamp: { S: string }
}

export async function GET(request: NextRequest) {
  try {
    const command = new ScanCommand({
      TableName: 'superkart-products',
      AttributesToGet: ['id', 'imagekey', 'imageurltimestamp'],
    })

    const response = await dynamoDBClient.send(command)

    if (response.$metadata.httpStatusCode !== 200) {
      return NextResponse.json({ ok: false, message: 'Some error occured.' }, { status: response.$metadata.httpStatusCode })
    }

    const items = response.Items as ResponseItem[]

    const expiredImageItems = items.filter(item => !item.imageurltimestamp || Date.now() - parseInt(item.imageurltimestamp.S) > ImagePreSignedURLExpiryInterval)

    const responses = await Promise.all(
      expiredImageItems.map(item => new Promise(async (resolve, reject) => {
        const response = await fetch(request.nextUrl.origin + '/api/get-signed-url?filekey=' + item.imagekey.S)
        const { ok, url } = await response.json() as { ok: boolean, message: string, url: string }

        if (ok) {
          const command = new UpdateItemCommand({
            TableName: 'superkart-products',
            Key: { id: { S: item.id.S } },
            AttributeUpdates: {
              imageurl: { Action: "PUT", Value: { S: url } },
              imageurltimestamp: { Action: "PUT", Value: { S: Date.now().toString() } },
            },
          })
          const response = await dynamoDBClient.send(command)
          if (response.$metadata.httpStatusCode === 200) {
            resolve(true)
          } else {
            resolve(false)
          }
        } else {
          resolve(false)
        }
      })
      )
    ) as boolean[]

    let count = 0
    responses.forEach(updated => { if (updated) count++ })

    return NextResponse.json({ ok: true, message: `${count} product images updated.` }, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ ok: false, message: 'Internal server error.' }, { status: 500 })
  }
}