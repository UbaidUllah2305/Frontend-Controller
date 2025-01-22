import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ICounterState {
  val: number;
}
 
const initialState: ICounterState = {
  val: 0,
};

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    // Increment the counter
    IncrementCounter: (state) => {
      state.val = state.val + 1;
    },
    // Decrement the counter
    DecrementCounter: (state) => {
      state.val = state.val - 1;
    },
    // Increment the counter by amount
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.val += action.payload;
    },
    // Decrement the counter by amount
    decrementByAmount: (state, action: PayloadAction<number>) => {
      state.val -= action.payload;
    },
    // Set the counter by amount
    setByAmount: (state, action: PayloadAction<number>) => {
      state.val = action.payload;
    },
    // Reset to default state
    resetCounter: (state) => {
      state.val = 0;
    },
  },
});
// All the Reducers are in the counterSlice.actions export as a single object 
export const CounterActions = counterSlice.actions;
export default counterSlice.reducer;
