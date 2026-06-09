const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const JWT_SECRET = process.env.JWT_SECRET || "supersecretmealnesttoken";

const createError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const generateToken = (user) =>
  jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, {
    expiresIn: "7d",
  });

const getTransporter = () => {
  if (
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
  ) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  return {
    sendMail: async (mailOptions) => {
      console.log("[email simulated] to=", mailOptions.to);
      console.log(mailOptions.subject);
      console.log(mailOptions.text || mailOptions.html);
      return Promise.resolve();
    },
  };
};

const sendEmail = async (mailOptions) => {
  const transporter = getTransporter();
  await transporter.sendMail(mailOptions);
};

const sendResetEmail = async (user, token) => {
  const resetUrl = `${FRONTEND_URL}/reset-password?token=${token}`;
  const mailOptions = {
    from: process.env.EMAIL_FROM || "no-reply@mealnest.local",
    to: user.email,
    subject: "Reset your MealNest password",
    text: `Reset your password using: ${resetUrl}`,
    html: `<p>Reset your password by clicking <a href="${resetUrl}">this link</a>.</p>`,
  };
  await sendEmail(mailOptions);
};

const sendVerificationEmail = async (user, token) => {
  const verifyUrl = `${FRONTEND_URL}/verify-email?token=${token}`;
  const mailOptions = {
    from: process.env.EMAIL_FROM || "no-reply@mealnest.local",
    to: user.email,
    subject: "Verify your MealNest email",
    text: `Verify your email using: ${verifyUrl}`,
    html: `<p>Verify your email by clicking <a href="${verifyUrl}">this link</a>.</p>`,
  };
  await sendEmail(mailOptions);
};

exports.registerUser = async ({ name, email, phone, password }) => {
  if (!name || !email || !password) {
    throw createError(400, "Missing required registration fields");
  }

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase(),
    phone,
    password: hash,
    role: "user",
    isVerified: true,
  });

  return {
    token: generateToken(user),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  };
};

exports.loginUser = async ({ email, password }) => {
  if (!email || !password) {
    throw createError(400, "Email and password are required");
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw createError(400, "User with this email does not exist");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw createError(400, "Invalid password credentials");
  }

  return {
    token: generateToken(user),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  };
};

exports.forgotPassword = async (email) => {
  if (!email) {
    throw createError(400, "Email is required");
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw createError(400, "User with this email does not exist");
  }

  const resetToken = crypto.randomBytes(20).toString("hex");
  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  user.resetPasswordExpire = Date.now() + 3600000;

  await user.save({ validateBeforeSave: false });

  try {
    await sendResetEmail(user, resetToken);
  } catch (mailErr) {
    console.warn("Failed to send reset email:", mailErr.message || mailErr);
  }

  return { message: "Password reset email sent if account exists." };
};

exports.resetPassword = async (token, password) => {
  if (!token || !password) {
    throw createError(400, "Reset token and password are required");
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw createError(400, "Invalid or expired reset token");
  }

  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  return {
    message: "Password reset successful",
    token: generateToken(user),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  };
};

exports.verifyEmail = async (token) => {
  if (!token) {
    throw createError(400, "Verification token is required");
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    verificationToken: hashedToken,
    verificationExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw createError(400, "Invalid or expired verification token");
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationExpire = undefined;
  await user.save();

  return {
    message: "Email verified",
    token: generateToken(user),
  };
};

exports.resendVerification = async (email) => {
  if (!email) {
    throw createError(400, "Email is required");
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw createError(400, "User with this email does not exist");
  }

  if (user.isVerified) {
    throw createError(400, "Email already verified");
  }

  const verificationToken = crypto.randomBytes(20).toString("hex");
  user.verificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");
  user.verificationExpire = Date.now() + 3600000;

  await user.save({ validateBeforeSave: false });

  try {
    await sendVerificationEmail(user, verificationToken);
  } catch (mailErr) {
    console.warn(
      "Failed to send verification email:",
      mailErr.message || mailErr,
    );
  }

  return { message: "Verification email resent if account exists." };
};

exports.getAllUsers = async () => {
  return User.find(
    {},
    "-password -resetPasswordToken -resetPasswordExpire -verificationToken -verificationExpire",
  ).sort({ createdAt: -1 });
};

exports.updateUserRole = async (id, role) => {
  const normalizedRole = role?.toLowerCase();
  if (!["user", "admin"].includes(normalizedRole)) {
    throw createError(400, "Role must be either user or admin");
  }

  const user = await User.findByIdAndUpdate(
    id,
    { role: normalizedRole },
    { new: true },
  ).select(
    "-password -resetPasswordToken -resetPasswordExpire -verificationToken -verificationExpire",
  );

  if (!user) {
    throw createError(404, "User not found");
  }

  return user;
};
