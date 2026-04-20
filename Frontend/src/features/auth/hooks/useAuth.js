import { setUser, setError, setLoading } from "../state/auth.slice";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
} from "../services/auth.api";
import { useDispatch } from "react-redux";

export function useAuth() {
  const dispatch = useDispatch();

  async function handleRegister({ email, password, fullname }) {
    const data = await register({ email, password, fullname });

    dispatch(setUser(data.user));
  }

  async function handleLogin({ email, password }) {
    const data = await login({ email, password });

    dispatch(setUser(data.user));
  }

  async function handleStartGoogleAuth() {
    const googleAuthStartUrl = `/api/auth/google`;
    window.location.href = googleAuthStartUrl;
  }

  async function handleForgotPassword({ email }) {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const data = await forgotPassword({ email });
      console.log("Forgot password response:", data);
      return data;
    } catch (error) {
      console.error("Forgot password error:", error);
      dispatch(setError(error.response?.data?.message || error.message));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleResetPassword({ token, password }) {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const data = await resetPassword({ token, password });
      console.log("Reset password response:", data);
      return data;
    } catch (error) {
      console.error("Reset password error:", error);
      dispatch(setError(error.response?.data?.message || error.message));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }

  return {
    handleRegister,
    handleLogin,
    handleStartGoogleAuth,
    handleForgotPassword,
    handleResetPassword,
  };
}
