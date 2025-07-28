import {
  configureStore,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { User } from "~/utils/user";

// Je type le state général de l'application, obligatoire pour utiliser le hook useSelector
export type RootState = ReturnType<typeof store.getState>;
// Je type le dispatch de l'application, obligatoire pour utiliser le hook useDispatch
export type AppDispatch = typeof store.dispatch;

const initialState = {
  data: {
    firstName: "Tony",
    lastName: "Stark",
    email: "tony@stark.com",
    id: "1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as User,
  status: "loading" as "loading" | "success" | "error",
  isUserLoggedIn: false,
  isEditing: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.data = action.payload;
      state.status = "success";
    },
    setStatus: (
      state,
      action: PayloadAction<"loading" | "success" | "error">
    ) => {
      state.status = action.payload;
    },
    setIsUserLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isUserLoggedIn = action.payload;
    },
    setIsEditing: (state, action: PayloadAction<boolean>) => {
      state.isEditing = action.payload;
    },
  },
});

export const { setUser, setStatus, setIsUserLoggedIn, setIsEditing } =
  userSlice.actions;

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
  },
});
