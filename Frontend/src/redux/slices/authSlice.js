// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk để login
export const login = createAsyncThunk(
    'auth/login',
    async ({ username, password, navigate }, { rejectWithValue }) => {
        try {
            const response = await fetch('http://localhost:5000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (!response.ok) {
                return rejectWithValue(data.message || 'Login failed. Please try again.');
            }

            if (data.token) {
                // Save token and role to localStorage
                localStorage.setItem('token', data.token);
                if (data.role && data.role.name) {
                    localStorage.setItem('role', data.role.name);
                    if (navigate) {
                        if (data.role.name === 'Business') {
                            navigate('/business-profile');
                        } else {
                            navigate('/student-profile');
                        }
                    }
                } else {
                    if (navigate) navigate('/');
                }
                return { token: data.token, role: data.role?.name || null };
            } else {
                return rejectWithValue('No token received. Please check your credentials.');
            }
        } catch (error) {
            return rejectWithValue(error.message || 'Something went wrong.');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: localStorage.getItem('token') || null,
        role: localStorage.getItem('role') || null,
        loading: false,
        error: null
    },
    reducers: {
        logout: (state) => {
            state.token = null;
            state.role = null;
            localStorage.removeItem('token');
            localStorage.removeItem('role');
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
                state.token = action.payload.token;
                state.role = action.payload.role;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer