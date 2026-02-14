import { Role } from "@/types/partial";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PosyanduAuthState {
  posyanduId: string | null;
  role: Role | null;
  token: string | null;
}

const initialState: PosyanduAuthState = {
  posyanduId: null,
  role: null,
  token: null,
};

const posyanduSlice = createSlice({
  name: "posyandu",
  initialState,
  reducers: {
    setPosyanduId(state, action: PayloadAction<string | null>) {
      state.posyanduId = action.payload;
    },

    setRole(state, action: PayloadAction<Role | null>) {
      state.role = action.payload;
    },

    setPosyanduAuth(state, action: PayloadAction<PosyanduAuthState>) {
      state.posyanduId = action.payload.posyanduId;
      state.role = action.payload.role;
    },
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
    },

    clearPosyanduAuth(state) {
      state.posyanduId = null;
      state.role = null;
      state.token = null;
    },
  },
});

export const {
  setPosyanduId,
  setRole,
  setPosyanduAuth,
  clearPosyanduAuth,
  setToken,
} = posyanduSlice.actions;

export default posyanduSlice.reducer;
