import {
  createEntityAdapter,
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

export const studentsAdapter = createEntityAdapter();

// Add async thunk to fetch students
export const fetchStudents = createAsyncThunk(
  "students/fetchStudents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:3000/students");
      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const initialState = studentsAdapter.getInitialState({
  loading: false,
  error: null,
});

const studentsSlice = createSlice({
  name: "students",
  initialState,
  reducers: {
    addStudent: studentsAdapter.addOne,
    editStudent: studentsAdapter.upsertOne,
    deleteStudent: studentsAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        studentsAdapter.setAll(state, action.payload);
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch students";
      });
  },
});

export const { addStudent, editStudent, deleteStudent } = studentsSlice.actions;
export default studentsSlice.reducer;
