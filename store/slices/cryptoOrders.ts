import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface OrderState {
  price: string
  quantity: string
  activeTab: 'buy' | 'sell'
  orderType: 'limit' | 'market'
  marketPrice: number
}

const initialState: OrderState = {
  price: '',
  quantity: '',
  activeTab: 'buy',
  orderType: 'limit',
  marketPrice: 0,
}

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setPrice: (state, action: PayloadAction<string>) => {
      state.price = action.payload
    },
    setQuantity: (state, action: PayloadAction<string>) => {
      state.quantity = action.payload
    },
    setActiveTab: (state, action: PayloadAction<'buy' | 'sell'>) => {
      state.activeTab = action.payload
    },
    setOrderType: (state, action: PayloadAction<'limit' | 'market'>) => {
      state.orderType = action.payload
    },
    setMarketPrice: (state, action: PayloadAction<number>) => {
      state.marketPrice = action.payload
    },
  },
})

export const { setPrice, setQuantity, setActiveTab, setOrderType, setMarketPrice } = orderSlice.actions

export default orderSlice.reducer