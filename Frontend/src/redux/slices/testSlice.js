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

            return response.data; // Trả về dữ liệu thành công
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message;
            return rejectWithValue(errorMessage); // ✅ Trả đúng thông báo từ server // Trả về lỗi nếu thất bại
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

export const getAllTests = createAsyncThunk(
    'tests/getAllTests',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('http://localhost:5000/tests');
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.error || error.message || 'Failed to fetch tests'
            );
        }
    }
);

export const updateTest = createAsyncThunk(
    'tests/updateTest',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`http://localhost:5000/tests/${id}`, data);
            return response.data;
        } catch (error) {
            const errorMessage =
                error.response?.data?.error ||   // Ưu tiên lấy từ backend nếu có { error: '...' }
                error.response?.data?.message || // fallback nếu backend dùng { message: '...' }
                error.message ||                 // Lỗi mặc định
                'Không thể cập nhật bài kiểm tra';
            return rejectWithValue(errorMessage);
        }
    }
);

export const deleteTest = createAsyncThunk(
    'tests/deleteTest',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`http://localhost:5000/tests/${id}`);
            return { id }; // Trả về id của bài kiểm tra đã xóa
        } catch (error) {
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                error.message ||
                'Không thể xóa bài kiểm tra';
            return rejectWithValue(errorMessage);
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

        // --- Get All Tests ---
        builder
            .addCase(getAllTests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllTests.fulfilled, (state, action) => {
                state.loading = false;
                state.tests = action.payload;
            })
            .addCase(getAllTests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
        // --- Update Test ---
        builder
            // Khi action updateTest bắt đầu (pending)
            .addCase(updateTest.pending, (state) => {
                state.testLoading = true;
                state.testError = null;
            })
            // Khi action updateTest thành công (fulfilled)
            .addCase(updateTest.fulfilled, (state, action) => {
                state.testLoading = false;
                // Cập nhật bài kiểm tra đã được sửa trong state
                const updatedTestIndex = state.tests.findIndex(test => test.idTest === action.payload.idTest);
                if (updatedTestIndex !== -1) {
                    state.tests[updatedTestIndex] = action.payload;
                }
            })
            // Khi action updateTest thất bại (rejected)
            .addCase(updateTest.rejected, (state, action) => {
                state.testLoading = false;
                state.testError = action.payload || 'Đã xảy ra lỗi khi cập nhật bài kiểm tra';
            });
        // --- Delete Test ---
        builder
            .addCase(deleteTest.pending, (state) => {
                state.testLoading = true;
                state.testError = null;
            })
            .addCase(deleteTest.fulfilled, (state, action) => {
                state.testLoading = false;
                // Xóa bài kiểm tra khỏi danh sách
                state.tests = state.tests.filter(test => test.idTest !== action.payload.id);
            })
            .addCase(deleteTest.rejected, (state, action) => {
                state.testLoading = false;
                state.testError = action.payload || 'Đã xảy ra lỗi khi xóa bài kiểm tra';
            });
    },
});

export default testSlice.reducer;