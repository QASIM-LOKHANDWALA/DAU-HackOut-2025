import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("auth/login/", userData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.status === 200) {
                const { token, user } = response.data;
                console.log(response.data);

                localStorage.setItem("token", token);
                return { user, token };
            }

            return rejectWithValue(
                error.response.data.error ||
                    error.response.data.message ||
                    "Login failed"
            );
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(
                    response.data.msg || response.data.message || "Server error"
                );
            }
            return rejectWithValue(error.message || "Network error");
        }
    }
);

const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                "auth/register/",
                userData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.status === 201) {
                console.log(response.data);
                return response.data;
            }

            return rejectWithValue(
                response.data.msg ||
                    response.data.error ||
                    "Registration failed"
            );
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(
                    error.response.data.error ||
                        error.response.data.message ||
                        "Server error"
                );
            }
            return rejectWithValue(error.message || "Network error");
        }
    }
);

const fetchUserProfile = createAsyncThunk(
    "auth/fetchUserProfile",
    async (_, { getState, rejectWithValue }) => {
        const token = getState().auth.token;
        try {
            const response = await axiosInstance.get("auth/profile/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                return response.data.user;
            }

            return rejectWithValue("Failed to fetch user profile");
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.error || error.message || "Fetch error"
            );
        }
    }
);

export const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        token: localStorage.getItem("token") || null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        logoutUser: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;

            localStorage.removeItem("token");
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                state.error = action.payload || "Login failed";
            })

            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Sign up failed";
            })

            .addCase(fetchUserProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to refresh user data";
            });
    },
});

export const { clearError, logoutUser } = authSlice.actions;
export { loginUser, registerUser, fetchUserProfile };
export default authSlice.reducer;
