import { dynamoDBClient } from "@/utils/aws"
import { JWTVerifyReturnType, ProductDBSchema, UserDBSchema } from "@/utils/types"
import { GetItemCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb"
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken"
import { NextRequest, NextResponse } from "next/server"

type RequestJsonType = {
  productid: string
  rating: number
  index: number
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value

    if (typeof token !== 'string' || !token) {
      return NextResponse.json({ ok: false, message: 'Token not provided.' }, { status: 400 })
    }

    const { email } = jwt.verify(token, process.env.JWT_SECRET_KEY || '', {}) as JWTVerifyReturnType

    const { productid, rating, index } = await request.json() as RequestJsonType

    // set rating in the order list
    const ordersCommand = new UpdateItemCommand({
      TableName: 'superkart-users',
      Key: { email: { S: email } },
      UpdateExpression: `SET orders[${index}].rating = :rating`,
      ExpressionAttributeValues: { ':rating': { N: rating.toString() } },
    })
    const ordersResponse = await dynamoDBClient.send(ordersCommand)
    if (ordersResponse.$metadata.httpStatusCode !== 200) {
      return NextResponse.json({ ok: false, message: 'Error occured while posting your rating.' }, { status: 400 })
    }

    // get product rating data
    const productCommand = new GetItemCommand({
      TableName: 'superkart-products',
      Key: { id: { S: productid } },
      AttributesToGet: ['rating'],
    })
    const productResponse = await dynamoDBClient.send(productCommand)
    if (productResponse.$metadata.httpStatusCode !== 200) {
      return NextResponse.json({ ok: false, message: 'Error occured while posting your rating.' }, { status: 400 })
    }
    const ratingSchema = productResponse.Item as Pick<ProductDBSchema, 'rating'>
    const productRating = {
      average: parseFloat(ratingSchema.rating.M.average.N),
      count: parseInt(ratingSchema.rating.M.count.N)
    }

    // calculate new rating according to user's new rating
    const newCount = productRating.count + 1
    const newAverage = (productRating.average * productRating.count + rating) / newCount

    // update new rating in product's table
    const updateCommand = new UpdateItemCommand({
      TableName: 'superkart-products',
      Key: { id: { S: productid } },
      AttributeUpdates: {
        rating: {
          Action: 'PUT',
          Value: { M: { count: { N: newCount.toString() }, average: { N: newAverage.toString() } } },
        }
      }
    })
    const updateResponse = await dynamoDBClient.send(updateCommand)
    if (updateResponse.$metadata.httpStatusCode !== 200) {
      return NextResponse.json({ ok: false, message: 'Error occured while posting your rating.' }, { status: 400 })
    }

    return NextResponse.json({ ok: true, message: 'Rating updated successfully.' }, { status: 200 })
  } catch (error) {
    if (error instanceof TokenExpiredError)
      return NextResponse.json({ ok: false, message: 'Token is expired. Please login again.' }, { status: 401 })
    if (error instanceof JsonWebTokenError)
      return NextResponse.json({ ok: false, message: 'Token cannot be autheticated. Please login again.' }, { status: 401 })
    console.log(error)
    return NextResponse.json({ ok: false, message: 'Internal server error occurred.' }, { status: 500 })
  }
}