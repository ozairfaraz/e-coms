import { setUser, setError, setLoading } from "../state/auth.slice";
import { register } from "../services/auth.api";
import { useDispatch } from "react-redux";

export function useAuth() {
  const dispatch = useDispatch();

  async function handleRegister({ email, password, fullname }) {
    const data = register({ email, password, fullname });

    dispatch(setUser(data.user));
  }

  return { handleRegister };
}
