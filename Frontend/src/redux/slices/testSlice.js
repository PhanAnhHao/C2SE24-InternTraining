import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Định nghĩa một async thunk cho việc tạo bài kiểm tra
export const createTest = createAsyncThunk(
    'tests/createTest', // action type
    async (testData, { rejectWithValue }) => {
        try {
            const response = await axios.post('http://localhost:5000/tests', testData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to create test');
            }

            const data = await response.json();
            return data; // Trả về dữ liệu thành công
        } catch (error) {
            return rejectWithValue(error.message); // Trả về lỗi nếu thất bại
        }
    }
);

export const getTestDataById = createAsyncThunk(
    'tests/getTestById',
    async (testId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`http://localhost:5000/tests/${testId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.error || error.message || 'Failed to fetch test'
            );
        }
    }
);

// Định nghĩa testSlice
const testSlice = createSlice({
    name: 'tests',
    initialState: {
        tests: [],
        loading: false,
        error: null,
    },
    reducers: {
        // Các reducers khác nếu cần thiết
    },
    extraReducers: (builder) => {
        // --- Create Test ---
        builder
            .addCase(createTest.pending, (state) => {
                state.loading = true; // Khi API đang xử lý, đánh dấu loading
                state.error = null;
            })
            .addCase(createTest.fulfilled, (state, action) => {
                state.loading = false; // Khi API thành công, gán loading là false
                state.tests.push(action.payload.test); // Thêm bài kiểm tra mới vào danh sách
            })
            .addCase(createTest.rejected, (state, action) => {
                state.loading = false; // Khi API bị lỗi, gán loading là false
                state.error = action.payload || action.error.message; // Đặt lỗi nếu có
            });
        // --- Get Test By ID ---
        builder
            .addCase(getTestDataById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getTestDataById.fulfilled, (state, action) => {
                state.loading = false;
                state.testData = action.payload;
            })
            .addCase(getTestDataById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

    },
});

export default testSlice.reducer;