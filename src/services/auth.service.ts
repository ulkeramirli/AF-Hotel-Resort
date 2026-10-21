import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateOtp } from "@/lib/generate-otp";
import { sendMail } from "@/lib/send-email";
import { verifyEmailTemplate } from "@/lib/emails/verify-email";
import { forgotPasswordTemplate } from "@/lib/emails/forgot-password";
export class AuthService {
  static async register(name: string, email: string, password: string) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = generateOtp();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpires: new Date(Date.now() + 10 * 60 * 1000),
      isVerified: false,
    });

    const mail = verifyEmailTemplate(name, otp);
    await sendMail(email, mail.subject, mail.html);
    return {
      message: "Verification code sent to email",
    };
  }

  static async login(email: string, password: string) {
    let user = await User.findOne({ email });

    // Auto-create demo admin if it doesn't exist
    if (!user && email === "admin@afhotel.az" && password === "admin123") {
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await User.create({
        name: "Admin",
        email: "admin@afhotel.az",
        password: hashedPassword,
        role: "admin",
        isVerified: true,
      });
    }

    if (!user) {
      throw new Error("Invalid email or password");
    }
    if (!user.isVerified) {
      throw new Error("Please verify your email first");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    if (user.role === "admin") {
      const otp = generateOtp();
      user.otp = otp;
      user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
      await user.save();
      
      const mail = verifyEmailTemplate(user.name, otp);
      await sendMail(user.email, "Admin 2FA Code - AF Hotel", mail.html);
      
      return {
        requiresTwoFactor: true,
        email: user.email,
      };
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      },
    );
    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  static async verifyLogin2FA(email: string, otp: string) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
    if (user.otp !== otp) {
      throw new Error("Invalid OTP");
    }
    if (!user.otpExpires || user.otpExpires < new Date()) {
      throw new Error("OTP expired");
    }
    
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      },
    );
    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }
  static async verifyOTP(email: string, otp: string) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
    if (user.otp !== otp) {
      throw new Error("Invalid OTP");
    }
    if (!user.otpExpires || user.otpExpires < new Date()) {
      throw new Error("OTP expired");
    }
    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();
    return {
      message: "Email verified successfully",
    };
  }
  static async forgotPassword(email: string) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
    const otp = generateOtp();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    const mail = forgotPasswordTemplate(user.name, otp);
    await sendMail(user.email, mail.subject, mail.html);
    return {
      message: "Password reset code sent to email",
    };
  }
  static async resetPassword(email: string, otp: string, newPassword: string) {
    const user = await User.findOne({
      email,
    });
    if (!user) {
      throw new Error("User not found");
    }
    if (user.otp !== otp) {
      throw new Error("Invalid OTP");
    }
    if (!user.otpExpires || user.otpExpires < new Date()) {
      throw new Error("OTP expired");
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();
    return {
      message: "Password reset successfully",
    };
  }
  static async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new Error("Current password is incorrect");
    }
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      throw new Error("New password must be different from current password");
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    return {
      message: "Password changed successfully",
    };
  }
  static async me(userId: string) {
    const user = await User.findById(userId).select("-password");

    if (!user) {
      throw new Error("User not found");
    }

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }
}
