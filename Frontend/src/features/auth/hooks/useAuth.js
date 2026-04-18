import { setUser, setError, setLoading } from "../state/auth.slice";
import { register, login } from "../services/auth.api";
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

  return { handleRegister, handleLogin };
}
