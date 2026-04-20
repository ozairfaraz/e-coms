import userModel from "../../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendMailHandler } from "../../services/mail.service.js";
import { config } from "../../config/config.js";
import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
} from "../../utils/auth.utils.js";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import bcrypt from "bcryptjs";

function appUrl() {
  return config.appUrl || `${config.BASE_URL}:${config.FRONTEND_PORT}`;
}

function getGoogleClient() {
  const clientId = config.GOOGLE_CLIENT_ID;
  const clientSecret = config.GOOGLE_CLIENT_SECRET;
  const redirectUri = `${config.BASE_URL}:${config.BACKEND_PORT}/api/auth/google/callback`;

  return new OAuth2Client({
    clientId,
    clientSecret,
    redirectUri,
  });
}

/**
 * @route POST /api/auth/registere
 * @description to register users
 * @access public
 */
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
      providers: ["local"],
    });

    // email verification logic

    const verificationToken = jwt.sign(
      { sub: newlyCreatedUser._id },
      config.JWT_SECRET,
      { expiresIn: "1d" },
    );

    const verificationLink = `${appUrl()}/verify-email?token=${verificationToken}`;

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
      await userModel.findByIdAndDelete(newlyCreatedUser._id);
      console.error(
        "Failed to send verification email",
        sendMailResponse.info.response,
      );

      return res.status(500).json({
        message: "User registered but failed to send verification email",
        mailResponse: sendMailResponse.info.response,
      });
    }

    return res.status(201).json({
      message:
        "User registered successfully. Please check your email to verify your account.",
      mailResponse: sendMailResponse.info.response,
    });
  } catch (error) {
    console.error("Error in registerHandler:", error);
    if (error.name === "TokenExpiredError") {
      return res
        .status(400)
        .json({ message: "Verification token has expired" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(400).json({ message: "Invalid verification token" });
    }

    return res.status(500).json({
      message: "An error occurred while registering the user",
      error: error.message,
    });
  }
};

/**
 * @route GET /api/auth/verify-email
 * @description checks query token in url to verify email
 * @access public (Token Protected)
 */
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

    user.isEmailVerified = true;
    await user.save();

    return res.status(200).json({
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Error in verification of email: ", error);
    if (error.name === "TokenExpiredError") {
      return res
        .status(400)
        .json({ message: "Verification token has expired" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(400).json({ message: "Invalid verification token" });
    }

    return res.status(500).json({
      message: "An error occurred while verifying the email",
      error: error.message,
    });
  }
};

/**
 * @route POST /api/auth/resend-verification
 * @description resends the verification email during registration
 * @access public
 */
export const resendVerificationEmailController = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await userModel.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        message: "User with this email not found",
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        message: "This email is already verified",
      });
    }

    // Generate new verification token
    const verificationToken = jwt.sign({ sub: user._id }, config.JWT_SECRET, {
      expiresIn: "1d",
    });

    const verificationLink = `${appUrl()}/verify-email?token=${verificationToken}`;

    // Send verification email
    const sendMailResponse = await sendMailHandler({
      to: email,
      subject: "Verify Your Email - Ecoms",
      text: "",
      html: `<p>Hi ${user.fullName},</p>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationLink}">Verify Email</a>
      <p>This link will expire in 24 hours.</p>
      <p>If you did not request this email, please ignore it.</p>
      <p>Best regards,<br/>The Ecoms Team</p>`,
    });

    if (!sendMailResponse.success) {
      console.error(
        "Failed to send verification email",
        sendMailResponse.info.response,
      );

      return res.status(500).json({
        message: "Failed to send verification email",
        mailResponse: sendMailResponse.info.response,
      });
    }

    return res.status(200).json({
      message: "Verification email sent successfully",
      mailResponse: sendMailResponse.info.response,
    });
  } catch (error) {
    console.error("Error in resendVerificationEmail:", error);
    return res.status(500).json({
      message: "An error occurred while resending verification email",
      error: error.message,
    });
  }
};

/**
 * @route POST /api/auth/login
 * @description to login user
 * @access public
 */
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

    if (!user.isEmailVerified)
      return res
        .status(403)
        .json({ message: "Please verify your email before logging in" });

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
      sameSite: "strict",
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "strict",
      maxAge: 1000 * 60 * 15, // short-lived (15 min)
    });

    return res.status(200).json({
      message: "User logged in successfully!",
      accessToken,
      user,
    });
  } catch (error) {
    console.error("Error in logging in: ", error);
    if (error.name === "TokenExpiredError") {
      return res
        .status(400)
        .json({ message: "Verification token has expired" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(400).json({ message: "Invalid verification token" });
    }
    return res.status(500).json({
      message: "An error occurred while logging in: ",
      error: error.message,
    });
  }
};

/**
 * @route POST /api/auth/refresh
 * @description to refresh the refresh token and access token
 * @access public (Token Protected)
 */
export const refreshTokenController = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken)
      return res.status(404).json({ message: "Refresh token missing" });

    const decoded = verifyRefreshToken(refreshToken);

    if (!decoded || !decoded.sub)
      return res.status(401).json({ message: "Invalid refresh token" });

    const user = await userModel.findById(decoded.sub);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.tokenVersion !== decoded.tokenVersion)
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
      sameSite: "strict",
    });

    return res.status(200).json({
      message: "Tokens refreshed successfully!",
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error("Error in logging in: ", error);
    if (error.name === "TokenExpiredError") {
      return res
        .status(400)
        .json({ message: "Verification token has expired" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(400).json({ message: "Invalid verification token" });
    }
    return res.status(500).json({
      message: "An error occurred while refreshing tokens: ",
      error: error.message,
    });
  }
};

/**
 * @route POST /api/auth/logout
 * @description to logout user
 * @access public 
 */
export const logoutController = async (req, res) => {
  try {
    res.clearCookie("refreshToken", { path: "/" });

    res.status(200).json({ message: "Logout succesful" });
  } catch (error) {
    console.log("Logout failed: ", error);
    res.status(500).json({ message: "Logout failed: ", error: error.message });
  }
};

/**
 * @route POST /api/auth/forgot-password
 * @description sends a forgot password email to reset password
 * @access public
 */
export const forgotPasswordController = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) return res.status(400).json({ message: "email is required" });

    const normalizedEmail = email.trim().toLowerCase();

    const user = await userModel.findOne({ email: normalizedEmail });

    if (!user) return res.status(404).json({ message: "User not found" });

    const rawToken = crypto.randomBytes(32).toString("hex");

    const tokenHash = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    user.resetPasswordToken = tokenHash;
    user.resetPasswordExpires = new Date(Date.now() + 1000 * 60 * 15); // 15 mins

    await user.save();

    const resetUrl = `${appUrl()}/api/auth/reset-password?token=${rawToken}`;

    const sendMailResponse = await sendMailHandler({
      to: user.email,
      subject: "Reset password your password",
      text: "",
      html: `<p>Hi ${user.fullName},</p>
      <p>Please click the link below to reset your password:</p>
      <a href="${resetUrl}">reset password</a>
      <p>If you did not request for a password reset, please ignore this email.</p>
      <p>Best regards,<br/>The Ecoms Team</p>`,
    });

    if (!sendMailResponse.success) {
      console.error(
        "Failed to send reset password email",
        sendMailResponse.info.response,
      );

      return res.status(500).json({
        message: "User registered but failed to send verification email",
        mailResponse: sendMailResponse.info.response,
      });
    }

    return res.status(201).json({
      message:
        "User reset password mail send succesfull. Please check your email to reset your password.",
      mailResponse: sendMailResponse.info.response,
    });
  } catch (error) {
    console.log("Forgot password failed: ", error);

    return res
      .status(500)
      .json({ message: "Forgot password failed: ", error: error.message });
  }
};

/**
 * @route POST /api/auth/reset-password
 * @description resets the users password
 * @access public (Token Protected)
 */
export const resetPasswordController = async (req, res) => {
  const { token, password } = req.body;

  if (!token) return res.status(400).json({ message: "token is missing" });

  if (!password || password.length < 6)
    return res
      .status(400)
      .json({ message: "Password must be atleast 6 character long" });

  try {
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await userModel.findOne({
      resetPasswordToken: tokenHash,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res
        .status(404)
        .json({ message: "Reset token expired or User not found" });

    user.passwordHash = password;

    user.resetPasswordExpires = undefined;
    user.resetPasswordToken = undefined;

    user.tokenVersion = user.tokenVersion + 1;

    await user.save();

    return res.status(200).json({ message: "Password reset succesfull!" });
  } catch (error) {
    console.log("Reset password failed: ", error);
    return res
      .status(500)
      .json({ message: "Reset password failed: ", error: error.message });
  }
};

/**
 * @route GET /api/auth/google
 * @description Redirect user to Google for authentication
 * @access public (OAuth)
 */
export const googleAuthStartController = async (req, res) => {
  try {
    const client = getGoogleClient();

    const url = client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: ["openid", "email", "profile"],
    });

    return res.redirect(url);
  } catch (error) {
    console.log("Oauth authentication failed:", error);
    return res
      .status(500)
      .json({ message: "Oauth authentication failed", error: error.message });
  }
};

/**
 * @route GET /api/auth/google/callback
 * @description handles google OAuth callback authentication
 * @access public (OAuth)
 */
export const googleAuthCallbackController = async (req, res) => {
  const code = req.query.code;

  if (!code)
    return res
      .status(400)
      .json({ message: "code not found in google callback" });

  try {
    const client = getGoogleClient();

    const { tokens } = await client.getToken(code);

    if (!tokens.id_token)
      return res
        .status(400)
        .json({ message: "No id_token is present in google callback code" });

    // verify id token and read the users info from it
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: config.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const email = payload?.email;
    const emailVerified = payload?.email_verified;

    if (!email || !emailVerified)
      return res.status(400).json({ message: "google email is not verified" });

    const normalizedEmail = email.toLowerCase().trim();

    let user = await userModel.findOne({ email: normalizedEmail });

    if (!user) {
      const passwordHash = crypto.randomBytes(16).toString("hex");

      user = await userModel.create({
        fullName: payload.name,
        email: normalizedEmail,
        isEmailVerified: true,
        passwordHash,
        providers: ["google"],
      });
    } else {
      let changed = false;
      if (!user.isEmailVerified) {
        user.isEmailVerified = true;
        changed = true;
      }
      if (!user.providers.includes("google")) {
        user.providers.push("google");
        changed = true;
      }
      if (changed) await user.save();
    }

    const accessToken = createAccessToken(
      user._id,
      user.role,
      user.tokenVersion,
    );

    const refreshToken = createRefreshToken(user._id, user.tokenVersion);

    const isProd = config.NODE_ENV === "production";

    res.cookie("refreshToken", refreshToken, {
      secure: isProd,
      maxAge: 1000 * 60 * 60 * 24 * 7, // long-lived (7 days)
      sameSite: "strict",
      httpOnly: true,
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "strict",
      maxAge: 1000 * 60 * 15, // short-lived (15 min)
    });

    return res.redirect(`${config.BASE_URL}:${config.FRONTEND_PORT}`);
  } catch (error) {
    console.log("Oauth authentication failed:", error);
    return res
      .status(500)
      .json({ message: "Oauth authentication failed", error: error.message });
  }
};
