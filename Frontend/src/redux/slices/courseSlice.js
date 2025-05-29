import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getAllCourses = createAsyncThunk(
    'courses/getAllCourses',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`http://localhost:5000/courses`);
            console.log("response.data: ", response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.error || error.message || 'Failed to fetch test'
            );
        }
    }
);

// Định nghĩa testSlice
const courseSlice = createSlice({
    name: 'courses',
    initialState: {
        courses: [],
        loading: false,
        error: null,
    },
    reducers: {
        // Các reducers khác nếu cần thiết
    },
    extraReducers: (builder) => {
        // --- Get All Courses ---
        builder
            .addCase(getAllCourses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllCourses.fulfilled, (state, action) => {
                state.loading = false;
                state.courses = action.payload;
            })
            .addCase(getAllCourses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

    },
});

export default courseSlice.reducer;