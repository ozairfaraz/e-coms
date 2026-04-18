function getEnv(key, defaultValue = undefined) {
  const value = import.meta.env[key];

  if (value === undefined || value === "") {
    if (defaultValue !== undefined) {
      console.warn(`⚠️ Missing env ${key}, using default: ${defaultValue}`);
      return defaultValue;
    }

    throw new Error(`❌ Missing required environment variable: ${key}`);
  }

  return value;
}

// Validate and structure config
export const config = {
  BASE_URL: getEnv("VITE_BASE_URL"),

  BACKEND_PORT: getEnv("VITE_BACKEND_PORT", "3000"),

  FRONTEND_PORT: getEnv("VITE_FRONTEND_PORT", "5173"),

  ENV: getEnv("VITE_APP_ENV", "development"),

};
