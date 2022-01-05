import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserObj } from "../../types";
import {
  getTokens,
  removeTokens,
  saveAccessTokens,
  saveTokens,
} from "../../utils/helpers";

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: UserObj | null;
}

const initialState: AuthState = {
  accessToken: getTokens().accessToken,
  refreshToken: getTokens().refreshToken,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginUser: (state, action: PayloadAction<Tokens>) => {
      const { accessToken, refreshToken } = action.payload;

      state.accessToken = accessToken;
      state.refreshToken = refreshToken;

      saveTokens(accessToken, refreshToken);
    },
    logoutUser: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;

      removeTokens();
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      const accessToken = action.payload;
      state.accessToken = accessToken;

      saveAccessTokens(accessToken);
    },
    setCurrentUser: (state, action: PayloadAction<UserObj>) => {
      state.user = action.payload;
    },
  },
});

export const { loginUser, logoutUser, setAccessToken, setCurrentUser } =
  authSlice.actions;

export default authSlice.reducer;
