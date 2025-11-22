// redux/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { PURGE } from 'redux-persist';

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItemToCart: (state, action) => {
      const newItem = {
        ...action.payload,
        price: action.payload.price ?? action.payload.salePrice ?? 0,
        salePrice: action.payload.salePrice ?? action.payload.price ?? 0,
        total:
          (action.payload.salePrice ?? action.payload.price ?? 0) *
          (action.payload.quantity || 1),
      };

      const existingItem = state.items.find(
        item =>
          item.productId === newItem.productId &&
          item.variantId === newItem.variantId,
      );
      if (existingItem) {
        existingItem.quantity += newItem.quantity;
        existingItem.total =
          (existingItem.salePrice ?? existingItem.price ?? 0) *
          existingItem.quantity;
      } else {
        state.items.push(newItem);
      }
    },

    removeItemFromCart: (state, action) => {
      state.items = state.items.filter(
        item =>
          item.productId !== action.payload.productId ||
          item.variantId !== action.payload.variantId,
      );
    },
    setCart: (state, action) => {
      state.items = action.payload || [];
    },
    resetCart: state => {
      state.items = [];
    },
  },
  extraReducers: builder => {
    builder.addCase(PURGE, state => {
      state.items = [];
    });
  },
});

export const { addItemToCart, removeItemFromCart, setCart, resetCart } =
  cartSlice.actions;
export default cartSlice.reducer;
