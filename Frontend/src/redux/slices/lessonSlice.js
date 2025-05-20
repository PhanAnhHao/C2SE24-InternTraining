import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getLessonDataByCourseId = createAsyncThunk(
    'lessons/getLessonDataByCourseId',
    async (courseId, { rejectWithValue }) => {
        try {
            // Retrieve studentId from localStorage
            const studentId = localStorage.getItem('studentId');

            // Construct the API URL with studentId as a query parameter if it exists
            const url = studentId
                ? `http://localhost:5000/lessons/course/${courseId}?studentId=${studentId}`
                : `http://localhost:5000/course/${courseId}`;

            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.error || error.message || 'Failed to fetch lessons'
            );
        }
    }
);

// Define lessonSlice
const lessonSlice = createSlice({
    name: 'lesson',
    initialState: {
        lessons: [],
        singleLessonData: {},
        loading: false,
        error: null,
    },
    reducers: {
        // Other reducers if needed
    },
    extraReducers: (builder) => {
        // --- Get Lesson By Course ID ---
        builder
            .addCase(getLessonDataByCourseId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getLessonDataByCourseId.fulfilled, (state, action) => {
                state.loading = false;
                state.lessons = action.payload.lessons; // Store only the lessons array
                state.courseId = action.payload.courseId; // Optionally store courseId
                state.lessonsCount = action.payload.lessonsCount; // Optionally store lessonsCount
            })
            .addCase(getLessonDataByCourseId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default lessonSlice.reducer;