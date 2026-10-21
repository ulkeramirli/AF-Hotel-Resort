import { authMiddleware } from "@/middleware/auth.middleware";
import { AuthService } from "@/services/auth.service";
import { NextResponse } from "next/server";

export class AuthController {
  static async register(req: Request) {
    try {
      const { name, email, password } = await req.json();
      const result = await AuthService.register(name, email, password);
      return NextResponse.json(
        {
          success: true,
          data: result,
        },
        { status: 201 },
      );
    } catch (error: any) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 },
      );
    }
  }
  static async login(req: Request) {
    try {
      const { email, password } = await req.json();
      const result = await AuthService.login(email, password);
      return NextResponse.json(
        {
          success: true,
          data: result,
        },
        {
          status: 200,
        },
      );
    } catch (error: any) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        {
          status: 400,
        },
      );
    }
  }
  static async verifyOTP(req: Request) {
    try {
      const { email, otp } = await req.json();
      const result = await AuthService.verifyOTP(email, otp);
      return NextResponse.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        {
          status: 400,
        },
      );
    }
  }
  static async verifyLogin2FA(req: Request) {
    try {
      const { email, otp } = await req.json();
      const result = await AuthService.verifyLogin2FA(email, otp);
      return NextResponse.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        {
          status: 400,
        },
      );
    }
  }
  static async forgotPassword(req: Request) {
    try {
      const { email } = await req.json();
      const result = await AuthService.forgotPassword(email);
      return NextResponse.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        {
          status: 400,
        },
      );
    }
  }
  static async resetPassword(req: Request) {
    try {
      const { email, otp, newPassword } = await req.json();
      const result = await AuthService.resetPassword(email, otp, newPassword);
      return NextResponse.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        {
          status: 400,
        },
      );
    }
  }
  static async changePassword(req: Request) {
    try {
      const user = authMiddleware(req) as any;
      const { currentPassword, newPassword } = await req.json();
      const result = await AuthService.changePassword(
        user.id,
        currentPassword,
        newPassword,
      );

      return NextResponse.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        {
          status: 400,
        },
      );
    }
  }
  static async me(req: Request) {
    try {
      const user = authMiddleware(req) as any;

      const result = await AuthService.me(user.id);

      return NextResponse.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        {
          status: 401,
        },
      );
    }
  }
}
