import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

export const studentsAdapter = createEntityAdapter();

const initialState = studentsAdapter.getInitialState();

const studentsSlice = createSlice({
  name: "students",
  initialState,
  reducers: {
    addStudent: studentsAdapter.addOne,
    editStudent: studentsAdapter.upsertOne,
    deleteStudent: studentsAdapter.removeOne,
  },
});

export const { addStudent, editStudent, deleteStudent } = studentsSlice.actions;
export default studentsSlice.reducer;
