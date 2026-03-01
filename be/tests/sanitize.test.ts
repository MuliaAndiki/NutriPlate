import { describe, expect, it } from 'bun:test';
import { sanitizeUser, safeUserSelect } from '../src/utils/sanitize';

describe('sanitizeUser', () => {
  const fullUser = {
    id: 'user-1',
    email: 'test@example.com',
    phone: '08123456789',
    fullName: 'Test User',
    password: '$2a$10$hashedPassword',
    role: 'PARENT' as const,
    isVerify: true,
    avaUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    otp: '123456',
    expOtp: new Date(),
    token: 'jwt-token-value',
    activateToken: 'activate-token',
    activateExp: new Date(),
  };

  it('should remove password from user object', () => {
    const result = sanitizeUser(fullUser);
    expect(result).not.toHaveProperty('password');
  });

  it('should remove otp from user object', () => {
    const result = sanitizeUser(fullUser);
    expect(result).not.toHaveProperty('otp');
  });

  it('should remove expOtp from user object', () => {
    const result = sanitizeUser(fullUser);
    expect(result).not.toHaveProperty('expOtp');
  });

  it('should remove token from user object', () => {
    const result = sanitizeUser(fullUser);
    expect(result).not.toHaveProperty('token');
  });

  it('should remove activateToken from user object', () => {
    const result = sanitizeUser(fullUser);
    expect(result).not.toHaveProperty('activateToken');
  });

  it('should remove activateExp from user object', () => {
    const result = sanitizeUser(fullUser);
    expect(result).not.toHaveProperty('activateExp');
  });

  it('should preserve safe fields', () => {
    const result = sanitizeUser(fullUser);
    expect(result.id).toBe('user-1');
    expect(result.email).toBe('test@example.com');
    expect(result.fullName).toBe('Test User');
    expect(result.role).toBe('PARENT');
    expect(result.isVerify).toBe(true);
  });

  it('should not mutate the original object', () => {
    const original = { ...fullUser };
    sanitizeUser(fullUser);
    expect(fullUser.password).toBe(original.password);
    expect(fullUser.otp).toBe(original.otp);
  });

  it('should handle null/undefined gracefully', () => {
    expect(sanitizeUser(null as any)).toBeNull();
    expect(sanitizeUser(undefined as any)).toBeUndefined();
  });

  it('should handle objects without sensitive fields', () => {
    const safeObj = { id: '1', email: 'a@b.com', fullName: 'Test' };
    const result = sanitizeUser(safeObj);
    expect(result.id).toBe('1');
    expect(result.email).toBe('a@b.com');
  });
});

describe('safeUserSelect', () => {
  it('should include all expected safe fields', () => {
    expect(safeUserSelect.id).toBe(true);
    expect(safeUserSelect.email).toBe(true);
    expect(safeUserSelect.phone).toBe(true);
    expect(safeUserSelect.fullName).toBe(true);
    expect(safeUserSelect.role).toBe(true);
    expect(safeUserSelect.isVerify).toBe(true);
    expect(safeUserSelect.avaUrl).toBe(true);
    expect(safeUserSelect.createdAt).toBe(true);
    expect(safeUserSelect.updatedAt).toBe(true);
  });

  it('should NOT include sensitive fields', () => {
    const keys = Object.keys(safeUserSelect);
    expect(keys).not.toContain('password');
    expect(keys).not.toContain('otp');
    expect(keys).not.toContain('expOtp');
    expect(keys).not.toContain('token');
    expect(keys).not.toContain('activateToken');
    expect(keys).not.toContain('activateExp');
  });
});
