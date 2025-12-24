import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OtpState {
  email: string | null;
  phone: string | null;
  soure: "Register" | "Forgot-Password" | null;
}

const initialState: OtpState = {
  email: null,
  phone: null,
  soure: null,
};

const otpSlice = createSlice({
  name: "otp",
  initialState,
  reducers: {
    setEmail(state, action: PayloadAction<string>) {
      state.email = action.payload;
    },
    setPhone(state, action: PayloadAction<string>) {
      state.phone = action.payload;
    },
    setSoure(state, action: PayloadAction<"Register" | "Forgot-Password">) {
      state.soure = action.payload;
    },
    clearOtp(state) {
      state.email = null;
      state.phone = null;
      state.soure = null;
    },
  },
});

export const { setEmail, setPhone, setSoure, clearOtp } = otpSlice.actions;
export default otpSlice.reducer;
