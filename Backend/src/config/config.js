import dotenv from "dotenv";
dotenv.config();

function requireEnv(key) {
  const value = process.env[key];
  if (value === undefined)
    throw new Error(`${key} is not defined in the environment variables`);
  return value;
}

export const config = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  BACKEND_PORT: Number(requireEnv("BACKEND_PORT")),
  MONGO_URI: requireEnv("MONGO_URI"),
  GOOGLE_CLIENT_ID: requireEnv("GOOGLE_CLIENT_ID"),
  GOOGLE_CLIENT_SECRET: requireEnv("GOOGLE_CLIENT_SECRET"),
  GOOGLE_REFRESH_TOKEN: requireEnv("GOOGLE_REFRESH_TOKEN"),
  GOOGLE_USER: requireEnv("GOOGLE_USER"),
  JWT_SECRET: requireEnv("JWT_SECRET"),
  BASE_URL: requireEnv("BASE_URL"),
  FRONTEND_PORT: requireEnv("FRONTEND_PORT"),
  IMAGEKIT_PRIVATE_KEY: requireEnv("IMAGEKIT_PRIVATE_KEY"),
};
