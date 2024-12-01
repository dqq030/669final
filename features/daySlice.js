import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { firebaseConfig } from "../Secrets.js";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  doc,
  getDocs,
  updateDoc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export const uploadImageToFirebase = async (uri) => {
  const filename = uri.split("/").pop(); 
  const imageRef = ref(storage, `images/${filename}`); 

  try {
    const response = await fetch(uri);
    const blob = await response.blob(); 
    await uploadBytes(imageRef, blob); 
    const downloadURL = await getDownloadURL(imageRef);
    return downloadURL;
  } catch (error) {
    console.error("Image upload failed:", error);
    throw error;
  }
};


export const addDayThunk = createAsyncThunk(
  "dayfirebase/addDays",
  async (day) => {
    const dayCollRef = collection(db, "days");
    if (day.picture) {
      try {
        const imageUrl = await uploadImageToFirebase(day.picture);
        day.picture = imageUrl;
      } catch (error) {
        console.error("Image upload failed:", error);
      }
    }
    const daySnap = await addDoc(dayCollRef, day);
    return { ...day, key: daySnap.id };
  }
);

export const getDaysThunk = createAsyncThunk(
  "dayfirebase/getDays",
  async () => {
    const initList = [];
    const collRef = collection(db, "days");
    const q = query(collRef);
    const querySnapshot = await getDocs(q);
    querySnapshot.docs.forEach((docSnapshot) => {
      const day = docSnapshot.data();
      day.key = docSnapshot.id;
      initList.push(day);
    });
    return initList;
  }
);

export const updateDayThunk = createAsyncThunk(
  "dayfirebase/updateDay",
  async (day) => {
    const dayDocRef = doc(db, "days", day.key);
    await updateDoc(dayDocRef, day);
    return day;
  }
);

export const deleteDayThunk = createAsyncThunk(
  "dayfirebase/deleteDay",
  async (key) => {
    const dayDocRef = doc(db, "days", key);
    await deleteDoc(dayDocRef);
    return key;
  }
);

export const daySlice = createSlice(
  {
  name: "day",
  initialState: {
    value: [],
  },
  extraReducers: (builder) => {
    builder.addCase(updateDayThunk.fulfilled, (state, action) => {
      const newDay = action.payload;
      state.value = state.value.map((elem) =>
        elem.key === newDay.key ? newDay : elem
      );
    });
    builder.addCase(addDayThunk.fulfilled, (state, action) => {
      state.value.push(action.payload);
    });
    builder.addCase(getDaysThunk.fulfilled, (state, action) => {
      state.value = action.payload;
    });
    builder.addCase(deleteDayThunk.fulfilled, (state, action) => {
      state.value = state.value.filter((elem) => elem.key !== action.payload);
    });
  },
}
);

export default daySlice.reducer;
