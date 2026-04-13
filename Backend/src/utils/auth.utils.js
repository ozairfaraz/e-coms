import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

export const createAccessToken = (userId, role, tokenVersion) => {
  const payload = { sub: userId, role, tokenVersion };
  return jwt.sign(payload, config.JWT_SECRET, { expiresIn: "30m" });
};

export const createRefreshToken = (userId, tokenVersion) => {
  const payload = { sub: userId, tokenVersion };
  return jwt.sign(payload, config.JWT_SECRET, { expiresIn: "7d" });
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, config.JWT_SECRET);
};
