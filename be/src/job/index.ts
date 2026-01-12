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
        console.error('❌ Cron nutriplate error:', error);
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
        const result = await prisma.user.deleteMany({
          where: {
            isVerify: false,
            OR: [
              {
                expOtp: {
                  lt: now,
                },
              },
              {
                AND: [
                  { expOtp: null },
                  {
                    createdAt: {
                      lt: new Date(now.getTime() - 60 * 60 * 1000),
                    },
                  },
                ],
              },
            ],
          },
        });

        if (result.count > 0) {
          console.log(`🧹 ${result.count} unverified user(s) deleted`);
        }
      } catch (error) {
        console.error('❌ OTP cleanup cron error:', error);
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
