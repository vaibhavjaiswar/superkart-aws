import { dynamoDBClient } from "@/utils/aws";
import { ProductDBSchema } from "@/utils/types";
import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

type RequestType = {
  name: string
  description: string
  features: string
  price: number
  discountPrice: number
  fileKey: string
  category: string
  subcategory: string
}

export async function POST(request: NextRequest) {
  try {
    const { description, discountPrice, features, fileKey, name, price, category, subcategory } = await request.json() as RequestType

    const item: Omit<ProductDBSchema, 'imageurl' | 'imageurltimestamp'> = {
      id: { S: nanoid() },
      category: { S: category },
      creationtimestamp: { S: Date.now().toString() },
      description: { S: description },
      discountprice: { N: discountPrice.toString() },
      features: { SS: features.split('\n') },
      imagekey: { S: fileKey },
      name: { S: name },
      price: { N: price.toString() },
      rating: { M: { average: { N: "0" }, count: { N: "0" } } },
      subcategory: { S: subcategory },
    }

    const command = new PutItemCommand({
      TableName: 'superkart-products',
      Item: item,
    })

    const response = await dynamoDBClient.send(command)

    if (response.$metadata.httpStatusCode !== 200) {
      return NextResponse.json({ ok: false, message: 'Unable to add the product.' }, { status: response.$metadata.httpStatusCode })
    }

    return NextResponse.json({ ok: true, message: 'Product added successfully.' }, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ ok: false, message: 'Internal server error occurred.' }, { status: 500 })
  }
}