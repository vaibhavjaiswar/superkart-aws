import { CommonResponseType } from "@/utils/types"
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

type CartItemType = { productid: string, quantity: number }

type InitialStateType = { items: CartItemType[], isFetchingCart: boolean }

export const fetchCartItems = createAsyncThunk('cart/fetchCartItems', async (arg, thunkAPI) => {
  const response = await axios.get('/api/get-cart')
  const { ok, message, data } = response.data as CommonResponseType
  if (ok) {
    const cartItems = data as { productid: string, quantity: number }[]
    thunkAPI.dispatch(setCart(cartItems))
  } else {
    thunkAPI.rejectWithValue([])
  }
})

export const removeCartItem = createAsyncThunk('cart/removeCartItem', async (productIndex: number, thunkAPI) => {
  const response = await axios.delete('/api/remove-from-cart?productindex=' + productIndex)
  const { ok, message, data } = response.data as CommonResponseType
  if (ok) {
    thunkAPI.dispatch(fetchCartItems())
  } else {
    alert(message)
  }
})

export const checkoutCart = createAsyncThunk('cart/checkoutCartItems', async (arg, thunkAPI) => {
  const response = await axios.delete('/api/checkout-from-cart')
  const { ok, message } = response.data as CommonResponseType
  if (ok) {
    thunkAPI.dispatch(fetchCartItems())
  } else {
    alert(message)
  }
})

const initialState: InitialStateType = { items: [], isFetchingCart: true }

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart(state, action: PayloadAction<CartItemType[]>) {
      state.items = action.payload
    },
    setIsFetchingCart(state, action: PayloadAction<boolean>) {
      state.isFetchingCart = action.payload
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchCartItems.pending, (state) => {
        state.isFetchingCart = true
      })
      .addCase(fetchCartItems.fulfilled, (state) => {
        state.isFetchingCart = false
      })
      .addCase(fetchCartItems.rejected, (state) => {
        state.isFetchingCart = false
      })
      .addCase(removeCartItem.fulfilled, (state) => { })
    // .addCase(checkoutCart.fulfilled, (state) => { })
  },
})

export const { setCart, setIsFetchingCart } = cartSlice.actions

const cartReducer = cartSlice.reducer

export default cartReducer