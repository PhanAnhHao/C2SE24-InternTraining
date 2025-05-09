import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


export const getLessonDataByCourseId = createAsyncThunk(
    'lessons/getLessonDataByCourseId',
    async (courseId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`http://localhost:5000/lessons/by-course/${courseId}`);
            console.log("res: ", response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.error || error.message || 'Failed to fetch test'
            );
        }
    }
);

// Định nghĩa lessonSlice
const lessonSlice = createSlice({
    name: 'lesson',
    initialState: {
        lessons: [],
        singleLessonData: {},
        loading: false,
        error: null,
    },
    reducers: {
        // Các reducers khác nếu cần thiết
    },
    extraReducers: (builder) => {
        // --- Get Lesson By ID ---
        builder
            .addCase(getLessonDataByCourseId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getLessonDataByCourseId.fulfilled, (state, action) => {
                state.loading = false;
                state.lessons = action.payload;
            })
            .addCase(getLessonDataByCourseId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default lessonSlice.reducer;