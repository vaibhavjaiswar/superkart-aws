export const dynamic = 'force-dynamic'

import { dynamoDBClient } from "@/utils/aws"
import { UserDBSchema } from "@/utils/types"
import { GetItemCommand } from "@aws-sdk/client-dynamodb"
import { cookies } from "next/headers"
import Link from "next/link"
import OrderItem from "./OrderItem"
import { Metadata } from "next"

type ItemType = Pick<UserDBSchema, 'orders'>

export const metadata: Metadata = {
  title: "My Orders | SuperKart 🛒",
}

export default async function OrdersPage() {
  try {
    const cookieStore = cookies()
    const email = cookieStore.get('email')?.value

    if (!email) {
      return (
        <section className="h-full global-responsive-px py-8 xl:py-10 flex justify-center items-center">
          <p>Some issue occured. Please <Link href='/login'>login</Link> again.</p>
        </section>
      )
    }

    const command = new GetItemCommand({
      TableName: 'superkart-users',
      Key: { email: { S: email } },
      AttributesToGet: ['orders'],
    })

    const response = await dynamoDBClient.send(command)

    if (response.$metadata.httpStatusCode !== 200) {
      return (
        <section className="h-full global-responsive-px py-8 xl:py-10 flex justify-center items-center">
          <p>Unable to fetch your orders. Please try again.</p>
        </section>
      )
    }

    const { orders } = response.Item as ItemType
    const ordersArray = orders.L.map(order => ({
      productid: order.M.productid.S,
      price: parseFloat(order.M.price.N),
      quantity: parseFloat(order.M.quantity.N),
      rating: parseInt(order.M.rating.N),
      timestamp: parseInt(order.M.timestamp.S),
    }))

    return (
      <section className="global-responsive-px py-8 xl:py-10">
        <h3 className="text-2xl md:text-3xl xl:text-4xl mb-6 xl:mb-8">Your Orders</h3>
        <div className="max-w-3xl flex flex-col gap-4">
          {
            ordersArray.length < 1 ? (
              <p>You do not have any orders.</p>
            ) : (
              ordersArray.map((order, i) => <OrderItem key={order.productid + i} index={i} order={order} />)
            )
          }
        </div>
      </section>
    )
  } catch (error: any) {
    console.log(error)
    return (
      <section className="global-responsive-px py-8 xl:py-10">
        <h3 className="text-2xl md:text-3xl xl:text-4xl mb-6 xl:mb-8">Your Orders</h3>
        <p>{error.message}</p>
      </section>
    )
  }
}