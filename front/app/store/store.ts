import {
  configureStore,
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { User } from "~/utils/user";
import cookieStore from "~/utils/cookies";

// Je type le state général de l'application, obligatoire pour utiliser le hook useSelector
export type RootState = ReturnType<typeof store.getState>;
// Je type le dispatch de l'application, obligatoire pour utiliser le hook useDispatch
export type AppDispatch = typeof store.dispatch;

export const initializeStore = createAsyncThunk("user/initialize", async () => {
  const userToken = await cookieStore.get("userToken");

  if (userToken) {
    const res = await fetch("http://localhost:3001/api/v1/user/profile", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${userToken.value}`,
        "Content-Type": "application/json",
        accept: "application/json",
      },
    });
    const data = await res.json();
    return data.body as User;
  }
});

export const fetchUser = createAsyncThunk("user/fetch", async ({}: {}) => {
  const userToken = await cookieStore.get("userToken");

  const res = await fetch("http://localhost:3001/api/v1/user/profile", {
    method: "POST",
    headers: { Authorization: `Bearer ${userToken?.value}` },
  });
  const data = await res.json();
  return data.body as User;
});

export const updateUser = createAsyncThunk(
  "user/update",
  async (userData: Pick<User, "firstName" | "lastName">) => {
    const userToken = await cookieStore.get("userToken");

    const res = await fetch("http://localhost:3001/api/v1/user/profile", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${userToken?.value}`,
        "Content-Type": "application/json",
        accept: "application/json",
      },

      body: JSON.stringify(userData),
    });
    const data = await res.json();
    return data.body as User;
  }
);

const initialState = {
  data: null as User | null,
  status: "idle" as "idle" | "loading" | "success" | "error",
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
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = "success";
      })
      .addCase(fetchUser.rejected, (state) => {
        state.status = "error";
      });
    builder
      .addCase(updateUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = "success";
        state.isEditing = false;
      })
      .addCase(updateUser.rejected, (state) => {
        state.status = "error";
      });
    builder
      .addCase(initializeStore.pending, (state) => {
        state.status = "loading";
      })
      .addCase(initializeStore.fulfilled, (state, action) => {
        if (action.payload) {
          state.data = action.payload;
          state.isUserLoggedIn = true;
        }
        state.status = "success";
      })
      .addCase(initializeStore.rejected, (state) => {
        state.status = "error";
      });
  },
});

export const { setUser, setStatus, setIsUserLoggedIn, setIsEditing } =
  userSlice.actions;

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
  },
});
