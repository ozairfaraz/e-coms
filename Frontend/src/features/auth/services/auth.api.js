import axios from "axios";
import { config } from "../../../config/config";

const authApiInstance = axios.create({
  baseURL: `${config.BASE_URL}:${config.BACKEND_PORT}/api/auth`,
  withCredentials: true,
});

export async function register({ email, password, fullname }) {
  const responce = await authApiInstance.post("/register", {
    email,
    password,
    fullName: fullname,
  });
  return responce.data;
}

export async function login({ email, password }) {
  const responce = await authApiInstance.post("/login", {
    email,
    password,
  });
  return responce.data;
}

export async function verifyEmail(token) {
  const response = await authApiInstance.get("/verify-email", {
    params: { token },
  });
  return response.data;
}

export async function resendVerificationEmail(email) {
  const response = await authApiInstance.post("/resend-verification", {
    email,
  });
  return response.data;
}
