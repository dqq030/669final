import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { initializeApp, getApps } from "firebase/app";
import {
  setDoc,
  doc,
  getFirestore,
  collection,
  onSnapshot,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { firebaseConfig } from "../Secrets";

let app;
const apps = getApps();
if (apps.length == 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = apps[0];
}
const db = getFirestore(app);

let snapshotUnsubscribe = undefined;
export const subscribeToUserUpdates = (dispatch) => {
  if (snapshotUnsubscribe) {
    snapshotUnsubscribe();
  }
  snapshotUnsubscribe = onSnapshot(collection(db, "users"), (usersSnapshot) => {
    const updatedUsers = usersSnapshot.docs.map((uSnap) => {
      return uSnap.data(); // already has key?
    });
    dispatch(loadUsers(updatedUsers));
  });
};

export const addUser = createAsyncThunk("chat/addUser", async (user) => {
  const userToAdd = {
    name: user.displayName,
    email: user.email,
    key: user.uid,
    friends: [],
    layout: "list",
    sort: "upcoming",
  };
  try {
    await setDoc(doc(db, "users", user.uid), userToAdd);
  } catch (e) {
    console.log("Error adding user", e);
  }
  return userToAdd;
});

export const loadUsers = createAsyncThunk("chat/loadUsers", async (users) => {
  return [...users];
});

export const loadUser= createAsyncThunk("chat/loadUser", async (user) => {
  const usersCollRef = collection(db, "users"); 
  const q = query(usersCollRef, where("key", "==", user.uid));

  try {
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error finding user:", error);
    return null;
  }
    
});

export const updateUser= createAsyncThunk("chat/updateUser", 
  async (user) => {
    const userDocRef = doc(db, "users", user.key);
    await updateDoc(userDocRef, user);
    return user;
});

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    users: [],
    authUser: null,
  },
  // reducers is a mandatory argument even if all of our reducers
  // are in extraReducers
  reducers: [],
  extraReducers: (builder) => {
    builder.addCase(addUser.fulfilled, (state, action) => {
      state.users = [...state.users, action.payload];
    });

    builder.addCase(loadUsers.fulfilled, (state, action) => {
      state.users = action.payload;
    });

    builder.addCase(loadUser.fulfilled, (state, action) => {
      state.authUser = action.payload;
    });

    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.authUser = action.payload;
    });
  },
});

export default authSlice.reducer;
