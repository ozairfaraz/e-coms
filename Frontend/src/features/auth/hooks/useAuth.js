import { setUser, setError, setLoading } from "../state/auth.slice";
import { register, login } from "../services/auth.api";
import { useDispatch } from "react-redux";
import { config } from "../../../config/config";

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

  async function handleStartGoogleAuth (){
    const googleAuthStartUrl = `${config.BASE_URL}:${config.BACKEND_PORT}/api/auth/google`
    window.location.href = googleAuthStartUrl;
  }

  return { handleRegister, handleLogin, handleStartGoogleAuth };
}
