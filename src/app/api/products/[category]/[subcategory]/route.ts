import { Categories } from "@/constants/category";
import { SubCategories } from "@/constants/subcategory";
import { dynamoDBClient } from "@/utils/aws";
import { ScanCommand } from "@aws-sdk/client-dynamodb";
import { NextRequest, NextResponse } from "next/server";

type ParamsType = {
  params: { category: Categories, subcategory: SubCategories }
}

export async function GET(request: NextRequest, { params }: ParamsType) {
  try {
    const { category, subcategory } = params

    const command = new ScanCommand({
      TableName: 'superkart-products',
      ScanFilter: {
        category: { ComparisonOperator: "EQ", AttributeValueList: [{ S: category }] },
        subcategory: { ComparisonOperator: "EQ", AttributeValueList: [{ S: subcategory }] }
      }
    })

    const response = await dynamoDBClient.send(command)

    if (response.$metadata.httpStatusCode !== 200) {
      return NextResponse.json({ ok: false, message: 'Some error occured while fetching products.' }, { status: response.$metadata.httpStatusCode })
    }

    return NextResponse.json({ ok: true, message: 'Products fetched successfully.', data: response.Items }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ ok: false, message: 'Internal server error occurred.' }, { status: 500 })
  }
}