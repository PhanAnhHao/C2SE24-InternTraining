import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getLessonDataByCourseId = createAsyncThunk(
    'lessons/getLessonDataByCourseId',
    async (courseId, { rejectWithValue }) => {
        try {
            const studentId = localStorage.getItem('studentId');
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

const lessonSlice = createSlice({
    name: 'lesson',
    initialState: {
        lessons: [],
        singleLessonData: {},
        loading: false,
        error: null,
    },
    reducers: {
        // Thêm reducer để cập nhật tiến độ bài học
        updateLessonProgress(state, action) {
            const { lessonId, progress, watchTime, status } = action.payload;
            const lessonIndex = state.lessons.findIndex((lesson) => lesson._id === lessonId);
            if (lessonIndex !== -1) {
                state.lessons[lessonIndex].progress = { progress, watchTime, status };
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getLessonDataByCourseId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getLessonDataByCourseId.fulfilled, (state, action) => {
                state.loading = false;
                state.lessons = action.payload.lessons;
                state.courseId = action.payload.courseId;
                state.lessonsCount = action.payload.lessonsCount;
            })
            .addCase(getLessonDataByCourseId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { updateLessonProgress } = lessonSlice.actions;
export default lessonSlice.reducer;