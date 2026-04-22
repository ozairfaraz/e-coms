import axios from "axios";

// Create a base API instance with refresh interceptor
const apiInstance = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

// Response interceptor to handle token refresh
apiInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and we haven't already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call refresh API to get new access token
        await axios.post(
          "/api/auth/refresh",
          {},
          {
            withCredentials: true,
          },
        );

        // Retry the original request with new token
        return apiInstance(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed. Redirecting to login.");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default apiInstance;
