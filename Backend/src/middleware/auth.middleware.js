import userModel from "../models/user.model.js";
import { verifyAccessToken } from "../utils/auth.utils.js";

export const authenticateUser = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken)
    return res.status(401).json({ message: "Access token not found" });

  try {
    const decoded = verifyAccessToken(accessToken);

    if (!decoded)
      return res.status(401).json({ message: "Invalid accessToken" });

    const userId = decoded.sub;

    const user = await userModel.findById(userId);

    if (!user) return res.status(404).json({ message: " User not found" });

    if (decoded.tokenVersion !== user.tokenVersion)
      return res
        .status(401)
        .json({ message: "accessToken's tokenversion mismatch" });

    req.user = user;

    next();
  } catch (error) {
    console.log("accessToken not found: ", error);
    return res.status(401).json({
      message: "accessToken not found",
      error: error.message,
    });
  }
};

export const authenticateVendor = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken)
    return res
      .status(401)
      .json({ message: "accessToken not found in the cookies" });

  try {
    const decoded = verifyAccessToken(accessToken);

    if (!decoded)
      return res.status(401).json({ message: "accessToken invalid" });

    const userId = decoded.sub;

    const user = await userModel.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role !== "vendor")
      return res
        .status(403)
        .json({ message: "Forbidded! only vendors and admin can access" });

    if (user.tokenVersion !== decoded.tokenVersion)
      return res.status(401).json({ message: "accessToken invalid" });

    req.user = user;

    next();
  } catch (error) {
    console.log("accessToken not found: ", error);
    return res.status(401).json({
      message: "accessToken not found",
      error: error.message,
    });
  }
};
