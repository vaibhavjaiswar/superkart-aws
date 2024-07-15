import { PayloadAction, createSlice } from "@reduxjs/toolkit"

const initialState = { name: '', email: '' }

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, { payload: { name, email } }: PayloadAction<{ name: string, email: string }>) {
      state.name = name
      state.email = email
    },
    clearUser(state) {
      state.name = ''
      state.email = ''
    },
  }
})

export const { clearUser, setUser } = userSlice.actions

const userReducer = userSlice.reducer

export default userReducer