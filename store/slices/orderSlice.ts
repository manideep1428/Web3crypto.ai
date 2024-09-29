import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

export type Order = {
  id: string
  transactionType: 'Buy' | 'Sell'
  amount: number
  status: 'Pending' | 'Success' | 'Failed'
  crypto: {
    currency: string
  }
}

type OrderState = {
  orders: Order[]
  loading: boolean
  error: string | null
}

const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null
}

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/orders')
      const data = await response.json()
      if (data.success) {
        return data.orders
      } else {
        return rejectWithValue(data.message)
      }
    } catch (error) {
      return rejectWithValue('Failed to fetch orders')
    }
  }
)

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
        state.loading = false
        state.orders = action.payload
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

export default orderSlice.reducer