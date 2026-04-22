import apiInstance from "../../../config/api";

export async function register({ email, password, fullname }) {
  const response = await apiInstance.post("/auth/register", {
    email,
    password,
    fullName: fullname,
  });
  return response.data;
}

export async function login({ email, password }) {
  const response = await apiInstance.post("/auth/login", {
    email,
    password,
  });
  return response.data;
}

export async function verifyEmail(token) {
  const response = await apiInstance.get("/auth/verify-email", {
    params: { token },
  });
  return response.data;
}

export async function resendVerificationEmail({ email }) {
  const response = await apiInstance.post("/auth/resend-verification", {
    email,
  });
  return response.data;
}

export async function forgotPassword({ email }) {
  const response = await apiInstance.post("/auth/forgot-password", {
    email,
  });
  return response.data;
}

export async function resetPassword({ token, password }) {
  const response = await apiInstance.post("/auth/reset-password", {
    token,
    password,
  });
  return response.data;
}

export async function getMe() {
  const response = await apiInstance.get("/auth/get-me");
  return response.data;
}

export async function refreshAccessToken() {
  const response = await apiInstance.post(
    "/auth/refresh",
    {},
    {
      withCredentials: true,
    },
  );
  return response.data;
}
