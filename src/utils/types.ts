export type SignUpFormInputType = {
  name: string
  email: string
  password: string
  retypePassword: string
}

export type LoginFormInputType = {
  email: string
  password: string
}

export type AddProductFormData = {
  name: string
  description: string
  features: string
  price: number
  discountprice: number
  image: FileList | null
  category: '' | 'electronics' | 'fashion' | 'home-appliances'
  subcategory: string
}

export type CommonResponseType = {
  ok: boolean
  message: string
  data: any
}

export type JWTVerifyReturnType = {
  name: string
  email: string
  iat: number
  exp: number
}

export type UserDBSchema = {
  password: { S: string }
  email: { S: string }
  name: { S: string }
  timestamp: { N: string }
  cart: {
    L: {
      M: {
        productid: { S: string }
        quantity: { N: string }
      }
    }[]
  }
  orders: {
    L: {
      M: {
        quantity: { N: string }
        productid: { S: string }
        price: { N: string }
        rating: { N: string }
        timestamp: { S: string }
      }
    }[]
  }
}

export type ProductDBSchema = {
  id: { S: string },
  category: { S: string }
  creationtimestamp: { S: string },
  description: { S: string },
  discountprice: { N: string },
  features: { SS: string[] }
  imagekey: { S: string },
  imageurl: { S: string },
  imageurltimestamp: { S: string },
  name: { S: string },
  price: { N: string },
  rating: { M: { count: { N: string }, average: { N: string } } },
  subcategory: { S: string }
}