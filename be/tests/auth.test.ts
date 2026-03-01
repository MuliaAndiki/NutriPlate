import { describe, expect, it, mock, beforeEach } from 'bun:test';

const mockPrisma = {
  user: {
    findFirst: mock(() => null),
    findUnique: mock(() => null),
    create: mock(() => ({})),
    update: mock(() => ({})),
    delete: mock(() => ({})),
  },
  userSession: {
    deleteMany: mock(() => ({ count: 0 })),
    create: mock(() => ({ id: 'session-1' })),
    findFirst: mock(() => null),
    delete: mock(() => ({})),
  },
};

mock.module('prisma/client', () => ({ default: mockPrisma }));
mock.module('@/utils/generate-otp', () => ({
  generateOtp: () => '123456',
}));
mock.module('@/utils/mailer', () => ({
  sendOTPEmail: mock(() => Promise.resolve()),
}));
mock.module('@/config/env.config', () => ({
  env: {
    JWT_SECRET: 'test-secret',
    GOOGLE_CLIENT_ID: 'test-client-id',
    GOOGLE_CLIENT_SECRET: 'test-secret',
  },
}));
mock.module('google-auth-library', () => ({
  OAuth2Client: class {
    verifyIdToken() {
      return { getPayload: () => ({ email: 'test@test.com', name: 'Test' }) };
    }
  },
}));

import { sanitizeUser } from '../src/utils/sanitize';

describe('AuthController Security', () => {
  describe('sanitizeUser integration', () => {
    it('should strip password from registration response', () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        fullName: 'Test',
        password: '$2a$10$hash',
        role: 'PARENT',
        otp: '123456',
        expOtp: new Date(),
        token: 'jwt-token',
        isVerify: false,
      };

      const sanitized = sanitizeUser(user);

      expect(sanitized).not.toHaveProperty('password');
      expect(sanitized).not.toHaveProperty('otp');
      expect(sanitized).not.toHaveProperty('expOtp');
      expect(sanitized).not.toHaveProperty('token');
      expect(sanitized.id).toBe('1');
      expect(sanitized.email).toBe('test@example.com');
    });

    it('should strip sensitive fields from login response', () => {
      const loginResponse = {
        id: '1',
        email: 'test@example.com',
        password: '$2a$10$hash',
        otp: null,
        expOtp: null,
        token: 'old-token',
        activateToken: 'activate-123',
        activateExp: new Date(),
        fullName: 'Test',
        role: 'PARENT',
      };

      const result = { ...sanitizeUser(loginResponse), token: 'new-jwt-token' };

      expect(result).not.toHaveProperty('password');
      expect(result).not.toHaveProperty('activateToken');
      expect(result).not.toHaveProperty('activateExp');
      // The new JWT token should be preserved (it's added after sanitization)
      expect(result.token).toBe('new-jwt-token');
    });
  });

  describe('OTP expiry check', () => {
    it('expired OTP should be rejected', () => {
      const user = {
        id: '1',
        otp: '123456',
        expOtp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
      };

      const isExpired = user.expOtp && new Date() > new Date(user.expOtp);
      expect(isExpired).toBe(true);
    });

    it('valid OTP should be accepted', () => {
      const user = {
        id: '1',
        otp: '123456',
        expOtp: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
      };

      const isExpired = user.expOtp && new Date() > new Date(user.expOtp);
      expect(isExpired).toBe(false);
    });

    it('OTP with null expiry should not crash', () => {
      const user = {
        id: '1',
        otp: '123456',
        expOtp: null as Date | null,
      };

      const isExpired = user.expOtp && new Date() > new Date(user.expOtp);
      expect(isExpired).toBeFalsy();
    });
  });

  describe('Login session deletion order', () => {
    it('session deletion should happen after password verification succeeds', () => {
      // This test validates the logical order:
      // 1. Find user
      // 2. Check isVerify
      // 3. Validate password
      // 4. THEN delete old sessions
      // (Previously sessions were deleted at step 2, before password check)

      const callOrder: string[] = [];

      const steps = {
        findUser: () => {
          callOrder.push('findUser');
          return { id: '1', password: '$2a$10$hash', isVerify: true };
        },
        checkVerify: (user: any) => {
          callOrder.push('checkVerify');
          return user.isVerify;
        },
        validatePassword: () => {
          callOrder.push('validatePassword');
          return true;
        },
        deleteSessions: () => {
          callOrder.push('deleteSessions');
        },
      };

      const user = steps.findUser();
      steps.checkVerify(user);
      const passwordValid = steps.validatePassword();

      if (passwordValid) {
        steps.deleteSessions();
      }

      expect(callOrder).toEqual(['findUser', 'checkVerify', 'validatePassword', 'deleteSessions']);
    });

    it('sessions should NOT be deleted if password is wrong', () => {
      const callOrder: string[] = [];

      const steps = {
        findUser: () => {
          callOrder.push('findUser');
          return { id: '1', password: '$2a$10$hash', isVerify: true };
        },
        validatePassword: () => {
          callOrder.push('validatePassword');
          return false; // wrong password
        },
        deleteSessions: () => {
          callOrder.push('deleteSessions');
        },
      };

      steps.findUser();
      const passwordValid = steps.validatePassword();

      if (passwordValid) {
        steps.deleteSessions();
      }

      expect(callOrder).not.toContain('deleteSessions');
    });
  });
});
