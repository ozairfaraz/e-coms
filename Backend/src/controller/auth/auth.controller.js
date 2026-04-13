import userModel from "../../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendMailHandler } from "../../services/mail.service.js";
import { config } from "../../config/config.js";
import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
} from "../../utils/auth.utils.js";

function appUrl() {
  return config.appUrl || `http://localhost:${config.BACKEND_PORT}`;
}

export const registerController = async (req, res) => {
  const { email, password, fullName } = req.body;

  try {
    if (!email || !password || !fullName) {
      return res.status(400).json({
        message: "Email, password and full name are required fields ",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const isUserAlreadyExists = await userModel.findOne({
      email: normalizedEmail,
    });

    if (isUserAlreadyExists) {
      return res.status(409).json({
        message: "User with this email already exists",
      });
    }

    const newlyCreatedUser = await userModel.create({
      email: normalizedEmail,
      passwordHash: password,
      fullName,
    });

    // email verification logic

    const verificationToken = jwt.sign(
      { sub: newlyCreatedUser._id },
      config.JWT_SECRET,
      { expiresIn: "1d" },
    );

    const verificationLink = `${appUrl()}/api/auth/verify-email?token=${verificationToken}`;

    const sendMailResponse = await sendMailHandler({
      to: email,
      subject: "Welcome to Ecoms! Please verify your email",
      text: "",
      html: `<p>Hi ${fullName},</p>
      <p>Thank you for registering on Ecoms. Please click the link below to verify your email address:</p>
      <a href="${verificationLink}">Verify Email</a>
      <p>If you did not create an account, please ignore this email.</p>
      <p>Best regards,<br/>The Ecoms Team</p>`,
    });

    if (!sendMailResponse.success) {
      console.error(
        "Failed to send verification email",
        sendMailResponse.error,
      );
      return res.status(500).json({
        message: "User registered but failed to send verification email",
      });
    }

    return res.status(201).json({
      message:
        "User registered successfully. Please check your email to verify your account.",
      newlyCreatedUser,
    });
  } catch (error) {
    console.error("Error in registerHandler:", error);

    return res.status(500).json({
      message: "An error occurred while registering the user",
      error: error.message,
    });
  }
};

export const verifyEmailController = async (req, res) => {
  const token = req.query.token;

  if (!token) {
    return res.status(400).json({
      message: "Verification token is required",
    });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);

    if (!decoded || !decoded.sub) {
      return res.status(400).json({
        message: "Invalid verification token",
      });
    }

    const userId = decoded.sub;

    const user = await userModel.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isEmailVerified)
      return res.status(400).json({ message: "User is already verified" });

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { isEmailVerified: true },
      { new: true },
    );

    return res.status(200).json({
      message: "Email verified successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error in verification of email: ", error);

    return res.status(500).json({
      message: "An error occurred while verifying the email",
      error: error.message,
    });
  }
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "email and password are required fields" });

    const normalizedEmail = email.trim().toLowerCase();

    const user = await userModel
      .findOne({ email: normalizedEmail })
      .select("+passwordHash")
      .exec();

    if (!user) return res.status(404).json({ message: "user not found" });

    const isMatch = await user.comparePassword(password);

    if (!isMatch)
      return res.status(401).json({ message: "passord is incorrect" });

    const accessToken = createAccessToken(
      user._id,
      user.role,
      user.tokenVersion,
    );

    const refreshToken = createRefreshToken(user._id, user.tokenVersion);

    const isProd = config.NODE_ENV === "production";

    res.cookie("refreshToken", refreshToken, {
      secure: isProd,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });

    res.status(200).json({
      message: "User logged in successfully!",
      accessToken,
      user,
    });
  } catch (error) {
    console.error("Error in logging in: ", error);
    return res.status(500).json({
      message: "An error occurred while logging in: ",
      error: error.message,
    });
  }
};

export const refreshTokenController = async (req, res) => {
  try {
    const refreshToken = req.cookie?.refreshToken;

    if (!refreshToken)
      return res.status(404).json({ message: "Refresh token missing" });

    const decoded = verifyRefreshToken(refreshToken);

    if (!decoded || !decoded.sub)
      return res.status(401).json({ message: "Invalid refresh token" });

    const user = await userModel.findById(decoded.sub);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.tokenVersion !== decoded.tokenVersion)
      return res.status(401).json({ message: "Invalid refresh token" });

    const newAccessToken = createAccessToken(
      user._id,
      user.role,
      user.tokenVersion,
    );

    const newRefreshToken = createRefreshToken(user._id, user.tokenVersion);

    const isProd = config.NODE_ENV === "production";

    res.cookie("refreshToken", newRefreshToken, {
      secure: isProd,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });

    res.status(200).json({
      message: "Tokens refreshed successfully!",
      accessToken: newAccessToken,
      user,
    });
  } catch (error) {
    console.error("Error in logging in: ", error);
    return res.status(500).json({
      message: "An error occurred while refreshing tokens: ",
      error: error.message,
    });
  }
};

export const logoutController = async (req, res) => {
  
}
