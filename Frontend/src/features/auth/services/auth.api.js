import axios from "axios";

const authApiInstance = axios.create({
  baseURL: "http://localhost:3000/api/auth",
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
