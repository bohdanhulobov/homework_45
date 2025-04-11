import {
  createEntityAdapter,
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

export const coursesAdapter = createEntityAdapter();

export const fetchCourses = createAsyncThunk(
  "courses/fetchCourses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:3000/courses");
      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const addCourse = createAsyncThunk(
  "courses/addCourse",
  async (courseData, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:3000/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(courseData),
      });

      if (!response.ok) {
        throw new Error("Failed to add course");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const updateCourse = createAsyncThunk(
  "courses/updateCourse",
  async (courseData, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `http://localhost:3000/courses/${courseData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(courseData),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update course");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const deleteCourse = createAsyncThunk(
  "courses/deleteCourse",
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `http://localhost:3000/courses/${courseId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete course");
      }

      return courseId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const assignStudentToCourse = createAsyncThunk(
  "courses/assignStudent",
  async ({ courseId, studentId }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `http://localhost:3000/courses/assign-student/${courseId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ studentId }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to assign student to course");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const initialState = coursesAdapter.getInitialState({
  loading: false,
  error: null,
});

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    deleteItem: coursesAdapter.removeOne,
    addItem: coursesAdapter.addOne,
    editItem: coursesAdapter.upsertOne,
    setAllCourses: coursesAdapter.setAll,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        coursesAdapter.setAll(state, action.payload);
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch courses";
      })

      .addCase(addCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCourse.fulfilled, (state, action) => {
        state.loading = false;
        coursesAdapter.addOne(state, action.payload);
      })
      .addCase(addCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add course";
      })

      .addCase(updateCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.loading = false;
        coursesAdapter.upsertOne(state, action.payload);
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update course";
      })

      .addCase(deleteCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.loading = false;
        coursesAdapter.removeOne(state, action.payload);
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete course";
      })

      .addCase(assignStudentToCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignStudentToCourse.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.id) {
          coursesAdapter.upsertOne(state, action.payload);
        }
      })
      .addCase(assignStudentToCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to assign student to course";
      });
  },
});

export const { addItem, deleteItem, editItem, setAllCourses } =
  coursesSlice.actions;

export default coursesSlice.reducer;
