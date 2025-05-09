// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk để login
export const login = createAsyncThunk(
    'auth/login',
    async ({ username, password }, { rejectWithValue }) => {
        try {
            const response = await fetch("http://localhost:5000/auth/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.error || error.message || 'Somethings wrongs'
            );
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: "",
        role: {},
        userId: "",
        studentId: "",
        businessId: "",
        loading: false,
        error: null
    },
    reducers: {
        setUserLoginInfo: (state, action) => {
            state.token = action?.payload?.token;
            state.role = action?.payload?.role;
            state.userId = action?.payload?.userId;
            state.studentId = action?.payload?.studentId ?? "";
            state.businessId = action?.payload?.businessId ?? "";

        },
        logout: (state) => {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('businessId');
            localStorage.removeItem('studentId');
            state.token = "";
            state.role = {};
            state.userId = "";
            state.studentId = "";
            state.businessId = "";
            state.token = null;
            state.role = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action?.payload?.token;
                state.role = action?.payload?.role;
                state.userId = action?.payload?.userId;
                state.studentId = action?.payload?.studentId ?? "";
                state.businessId = action?.payload?.businessId ?? "";
                localStorage.setItem('token', data.token);
                localStorage.setItem('userId', data.userId);
                localStorage.setItem('businessId', data.businessId);
                localStorage.setItem('studentId', data.studentId);
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer