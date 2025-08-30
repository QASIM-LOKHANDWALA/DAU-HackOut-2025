import { useDispatch, useSelector } from "react-redux";
import { clearError, logoutUser } from "../redux/features/authSlice";
import {
    loginUser,
    registerUser,
    fetchUserProfile,
} from "../redux/features/authSlice";

const useAuth = () => {
    const dispatch = useDispatch();
    const { user, token, isAuthenticated, loading, error } = useSelector(
        (state) => state.auth
    );

    const login = (credentials) => dispatch(loginUser(credentials)).unwrap();
    const register = (credentials) =>
        dispatch(registerUser(credentials)).unwrap();
    const profile = () => dispatch(fetchUserProfile()).unwrap();
    const clearAuthErrors = () => dispatch(clearError());
    const logout = () => dispatch(logoutUser());

    return {
        user,
        token,
        isAuthenticated,
        clearAuthErrors,
        logout,
        login,
        register,
        profile,
        loading,
        error,
    };
};

export default useAuth;
