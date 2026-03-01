import { Elysia } from 'elysia';
import { cron } from '@elysiajs/cron';
import prisma from 'prisma/client';

export const nutriplateProgramCron = new Elysia().use(
  cron({
    name: 'nutriplate-program-cron',
    pattern: '*/1 * * * *',
    async run() {
      const now = new Date();

      try {
        const result = await prisma.nutriplateProgram.updateMany({
          where: {
            durationRegister: { lte: now },
            startPrograms: null,
          },
          data: {
            startPrograms: now,
          },
        });

        if (result.count > 0) {
          console.log(` ${result.count} nutriplate program started`);
        }
      } catch (error) {
        console.error(' Cron nutriplate error:', error);
      }
    },
  }),
);

export const otpCleanupCron = new Elysia().use(
  cron({
    name: 'otp-cleanup-cron',
    pattern: '*/5 * * * *',
    async run() {
      const now = new Date();

      try {
        // Only clear OTP fields for unverified users with expired OTPs
        // Do NOT delete user records to prevent data loss
        const result = await prisma.user.updateMany({
          where: {
            isVerify: false,
            expOtp: {
              lt: now,
            },
            otp: { not: null },
          },
          data: {
            otp: null,
            expOtp: null,
          },
        });

        if (result.count > 0) {
          console.log(` ${result.count} expired OTP(s) cleared`);
        }
      } catch (error) {
        console.error(' OTP cleanup cron error:', error);
      }
    },
  }),
);

export const sessionCleanupCron = new Elysia().use(
  cron({
    name: 'session-cleanup-cron',
    pattern: '*/10 * * * *',
    async run() {
      const now = new Date();

      try {
        const result = await prisma.userSession.deleteMany({
          where: {
            expiresAt: {
              lt: now,
            },
          },
        });

        if (result.count > 0) {
          console.log(`🧹 ${result.count} expired session(s) deleted`);
        }
      } catch (error) {
        console.error('❌ Session cleanup cron error:', error);
      }
    },
  }),
);
