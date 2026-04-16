import axios from "axios";

const authApiInstance = axios.create({
  baseURL: "http://localhost:3000/api/auth",
  withCredentials: true,
});

export async function register({ email, password, fullname }) {
  const responce = await authApiInstance.post("/register", {
    email,
    password,
    fullname,
  });
  return responce.data;
}
