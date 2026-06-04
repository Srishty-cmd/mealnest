const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET || "supersecretmealnesttoken",
    { expiresIn: "7d" },
  );
};

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

  // Fallback to direct console logging transporter
  return {
    sendMail: async (mailOptions) => {
      console.log("[email simulated] to=", mailOptions.to);
      console.log(mailOptions.subject);
      console.log(mailOptions.text || mailOptions.html);
      return Promise.resolve();
    },
  };
};

const sendResetEmail = async (user, token) => {
  const transporter = getTransporter();
  const resetUrl = `${FRONTEND_URL}/reset-password?token=${token}`;
  const mailOptions = {
    from: process.env.EMAIL_FROM || "no-reply@mealnest.local",
    to: user.email,
    subject: "Reset your MealNest password",
    text: `Reset your password using: ${resetUrl}`,
    html: `<p>Reset your password by clicking <a href="${resetUrl}">this link</a>.</p>`,
  };
  await transporter.sendMail(mailOptions);
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    // All validation is handled by express-validator middleware
    const hash = await bcrypt.hash(password, 10);
    let user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      phone,
      password: hash,
      role: "user",
      isVerified: true,
    });

    const token = generateToken(user);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res
        .status(400)
        .json({ error: "User with this email does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password credentials" });
    }

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res
        .status(400)
        .json({ error: "User with this email does not exist" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpire = Date.now() + 3600000; // 1 hour

    await user.save({ validateBeforeSave: false });

    try {
      await sendResetEmail(user, resetToken);
    } catch (mailErr) {
      console.warn("Failed to send reset email:", mailErr.message || mailErr);
    }

    res.json({ message: "Password reset email sent if account exists." });
  } catch (error) {
    console.error("Forgot password error:", error);
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    const authToken = generateToken(user);

    res.json({
      message: "Password reset successful",
      token: authToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Reset password error:", error);
    next(error);
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.body;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ error: "Invalid or expired verification token" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationExpire = undefined;
    await user.save();

    const authToken = generateToken(user);

    res.json({ message: "Email verified", token: authToken });
  } catch (error) {
    console.error("Verify email error:", error);
    next(error);
  }
};

exports.resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res
        .status(400)
        .json({ error: "User with this email does not exist" });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: "Email already verified" });
    }

    const verificationToken = crypto.randomBytes(20).toString("hex");
    user.verificationToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");
    user.verificationExpire = Date.now() + 3600000; // 1 hour

    await user.save({ validateBeforeSave: false });

    try {
      await sendVerificationEmail(user, verificationToken);
    } catch (mailErr) {
      console.warn(
        "Failed to send verification email:",
        mailErr.message || mailErr,
      );
    }

    res.json({ message: "Verification email resent if account exists." });
  } catch (error) {
    console.error("Resend verification error:", error);
    next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find(
      {},
      "-password -resetPasswordToken -resetPasswordExpire -verificationToken -verificationExpire",
    ).sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error("Get all users error:", error);
    next(error);
  }
};

exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const normalizedRole = role?.toLowerCase();
    if (!["user", "admin"].includes(normalizedRole)) {
      return res
        .status(400)
        .json({ error: "Role must be either user or admin" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: normalizedRole },
      { new: true },
    ).select(
      "-password -resetPasswordToken -resetPasswordExpire -verificationToken -verificationExpire",
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Update user role error:", error);
    next(error);
  }
};
