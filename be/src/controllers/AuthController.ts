import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

import {
  PickRegister,
  PickLogin,
  JwtPayload,
  PickForgotPassword,
  PickVerify,
  PickSendOtp,
  PickResetPassword,
} from '@/types/auth.types';
import prisma from 'prisma/client';
import { AppContext } from '@/contex/appContex';
import { generateOtp } from '@/utils/generate-otp';
import { sendOTPEmail } from '@/utils/mailer';

class AuthController {
  public async register(c: AppContext) {
    try {
      const auth = c.body as PickRegister;
      const { email, phone } = auth;
      if (!auth.fullName || !auth.password) {
        return c.json?.({ status: 400, message: 'All fields are required' }, 400);
      }

      if (!auth.email && !auth.phone) {
        return c.json?.(
          {
            status: 400,
            message: 'email of phone is required',
          },
          400,
        );
      }

      const isAlreadyRegistered = await prisma.user.findFirst({
        where: {
          OR: [{ email }, { phone }],
        },
      });

      if (isAlreadyRegistered) {
        return c.json?.({ status: 400, message: 'Email already registered' }, 400);
      }

      const hashedPassword = await bcryptjs.hash(auth.password, 10);
      let newUsers;

      if (auth.email) {
        const otp = generateOtp(6);
        const otpExpiress = new Date(Date.now() + 5 * 60 * 1000);
        newUsers = await prisma.user.create({
          data: {
            fullName: auth.fullName,
            password: hashedPassword,
            role: auth.role || 'PARENT',
            email: auth.email,
            phone: auth.phone,
            otp: otp,
            expOtp: otpExpiress,
            isVerify: false,
          },
        });
        await sendOTPEmail(email, otp);
        return c.json?.(
          {
            status: 201,
            message: 'successfully registed use email',
            data: newUsers,
          },
          201,
        );
      }
      if (phone) {
        newUsers = await prisma.user.create({
          data: {
            fullName: auth.fullName,
            password: hashedPassword,
            phone: phone,
            role: auth.role || 'PARENT',
            isVerify: true,
          },
        });
        return c.json?.(
          {
            status: 201,
            message: 'successfully registed use phone',
            data: newUsers,
          },
          201,
        );
      }
      return c.json?.(
        {
          status: 400,
          message: 'Invalid register request',
        },
        400,
      );
    } catch (error) {
      console.error(error);
      return c.json?.(
        {
          status: 500,
          message: 'Server Interval Error',
          error: error instanceof Error ? error.message : error,
        },
        500,
      );
    }
  }

  public async login(c: AppContext) {
    try {
      const auth = c.body as PickLogin;
      const { email, phone } = auth;

      if (!auth.password) {
        return c.json?.(
          {
            status: 400,
            message: 'password is required',
          },
          400,
        );
      }

      if (!auth.email && !auth.phone) {
        return c.json?.(
          {
            status: 400,
            message: 'email of phone is required',
          },
          400,
        );
      }

      const selectLogin = await prisma.user.findFirst({
        where: {
          OR: [{ email }, { phone }],
        },
      });

      if (!selectLogin) {
        return c.json?.(
          {
            status: 400,
            message: 'email & phone not registed',
          },
          400,
        );
      }

      await prisma.userSession.deleteMany({
        where: {
          userId: selectLogin.id,
        },
      });

      if (!selectLogin.isVerify) {
        return c.json?.(
          {
            status: 400,
            message: 'account not verify',
          },
          400,
        );
      }

      const validatePassword = await bcryptjs.compare(auth.password, selectLogin.password!);
      if (!validatePassword) {
        return c.json?.(
          {
            status: 400,
            message: 'Email or Phone & Password Not Match',
          },
          400,
        );
      }

      const ipAddress =
        c.headers['x-forwarded-for']?.split(',')[0] ||
        c.headers['x-real-ip'] ||
        c.headers['cf-connecting-ip'] ||
        'unknown';

      const session = await prisma.userSession.create({
        data: {
          userId: selectLogin.id,
          userAgent: c.headers['user-agent'] ?? 'unknown',
          ipAddress: ipAddress,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      });

      const payload: JwtPayload = {
        id: selectLogin.id,
        sessionId: session.id,
        role: selectLogin.role,
      };
      if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET not set');

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1d',
      });
      await prisma.user.update({
        where: { id: selectLogin.id },
        data: { token },
      });

      return c.json?.(
        {
          status: 200,
          data: { ...selectLogin, token },
          message: 'Login successfully',
        },
        200,
      );
    } catch (error) {
      console.error(error);
      return c.json?.(
        {
          status: 500,
          message: 'Internal server error',
          error: error instanceof Error ? error.message : error,
        },
        500,
      );
    }
  }

  public async logout(c: AppContext) {
    try {
      const auth = c.user as JwtPayload;

      if (!auth?.id) {
        return c.json?.({ status: 401, message: 'Unauthorized' }, 401);
      }

      const user = await prisma.user.findUnique({
        where: { id: auth.id },
      });

      if (!user) {
        return c.json?.({ status: 404, message: 'Account not found' }, 404);
      }

      await prisma.user.update({
        where: { id: auth.id },
        data: { token: null },
      });

      return c.json?.(
        {
          status: 200,
          message: 'Account logged out successfully',
        },
        200,
      );
    } catch (error) {
      console.error(error);
      return c.json?.(
        {
          status: 500,
          message: 'Internal server error',
          error: error instanceof Error ? error.message : error,
        },
        500,
      );
    }
  }
  public async forgotPassword(c: AppContext) {
    try {
      const auth = c.body as PickForgotPassword;
      const { email, phone } = auth;
      if (!auth.email && !auth.phone) {
        return c.json?.(
          {
            status: 400,
            message: 'Email Required',
          },
          400,
        );
      }
      const user = await prisma.user.findFirst({
        where: {
          OR: [{ email }, { phone }],
        },
      });

      if (!user) {
        return c.json?.(
          {
            status: 404,
            message: 'Email & Phone Not Found',
          },
          404,
        );
      }
      let newForgot;
      if (email) {
        const otp = generateOtp(6);
        const otpExpiress = new Date(Date.now() + 5 * 60 * 1000);
        await sendOTPEmail(auth.email, otp);

        newForgot = await prisma.user.update({
          where: {
            email: auth.email,
          },
          data: {
            otp: otp,
            expOtp: otpExpiress,
          },
        });

        return c.json?.(
          {
            status: 200,
            data: newForgot,
            message: 'successfully found email',
          },
          200,
        );
      }
      if (phone) {
        newForgot = await prisma.user.findFirst({
          where: {
            phone: phone,
          },
        });
        return c.json?.(
          {
            status: 200,
            message: 'successfully found phone',
            data: newForgot,
          },
          200,
        );
      }
    } catch (error) {
      console.error(error);
      return c.json?.(
        {
          status: 500,
          message: 'Server Internal Error',
          error: error instanceof Error ? error.message : error,
        },
        500,
      );
    }
  }
  public async verifyOtp(c: AppContext) {
    try {
      const auth = c.body as PickVerify;
      if (!auth.email || !auth.otp) {
        return c.json?.(
          {
            status: 400,
            message: 'Email & Otp requaired',
          },
          400,
        );
      }
      const user = await prisma.user.findFirst({
        where: {
          email: auth.email,
          otp: auth.otp,
        },
      });

      if (!user) {
        return c.json?.(
          {
            status: 404,
            message: 'Email or OTP Not Found / OTP Failed',
          },
          404,
        );
      }

      const updateUser = await prisma.user.update({
        where: { id: user!.id },
        data: { isVerify: true, otp: null },
      });

      return c.json?.(
        {
          status: 200,
          message: 'Otp isVerify',
          data: updateUser,
        },
        200,
      );
    } catch (error) {
      console.error(error);
      return c.json?.(
        {
          status: 500,
          message: 'Server Internal Error',
          error: error instanceof Error ? error.message : error,
        },
        500,
      );
    }
  }

  public async sendOtp(c: AppContext) {
    try {
      const auth = c.body as PickSendOtp;
      if (!auth.email) {
        return c.json?.(
          {
            status: 400,
            message: 'Email is required',
          },
          400,
        );
      }
      const user = await prisma.user.findFirstOrThrow({
        where: {
          email: auth.email,
        },
      });

      if (!user) {
        return c.json?.(
          {
            status: 404,
            message: 'Account Not Found',
          },
          404,
        );
      }

      const otp = generateOtp(6);
      const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

      const newOtp = await prisma.user.update({
        where: { id: user.id },
        data: { otp: otp, expOtp: otpExpires },
      });

      await sendOTPEmail(auth.email, otp);

      return c.json?.(
        {
          status: 200,
          message: 'Succes Update Otp',
          data: newOtp,
        },
        200,
      );
    } catch (error) {
      console.error(error);
      return c.json?.(
        {
          status: 500,
          message: 'Server Internal Error',
          error: error instanceof Error ? error.message : error,
        },
        500,
      );
    }
  }
  public async resetPassword(c: AppContext) {
    try {
      const auth = c.body as PickResetPassword;
      const { email, phone } = auth;
      if (!auth.password) {
        return c.json?.(
          {
            status: 404,
            message: 'NewPassword required ',
          },
          404,
        );
      }
      if (!auth.email && !auth.phone) {
        return c.json?.(
          {
            status: 400,
            message: 'email or phone is required',
          },
          400,
        );
      }

      const user = await prisma.user.findFirst({
        where: {
          OR: [{ email }, { phone }],
        },
      });
      if (!user) {
        return c.json?.(
          {
            status: 404,
            message: 'accound Not Found',
          },
          404,
        );
      }
      if (!user.isVerify) {
        return c.json?.(
          {
            status: 400,
            message: 'accound not verify',
          },
          400,
        );
      }

      const hashedPassword = await bcryptjs.hash(auth.password, 10);

      const newPassword = await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });

      return c.json?.(
        {
          status: 200,
          message: 'Succes Reset Password',
          data: newPassword,
        },
        200,
      );
    } catch (error) {
      console.error(error);
      return c.json?.(
        {
          status: 500,
          message: 'Server Internal Error',
          error: error instanceof Error ? error.message : error,
        },
        500,
      );
    }
  }
}

export default new AuthController();
