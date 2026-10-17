import { describe, it, expect } from 'vitest';
import { normalizeEgyptianPhone } from '../src/lib/utils';

describe('Egyptian Phone Normalizer & Validator', () => {
  it('normalizes standard 11-digit numbers with leading zero', () => {
    const res = normalizeEgyptianPhone('01012345678');
    expect(res.isValid).toBe(true);
    expect(res.normalized).toBe('+201012345678');
  });

  it('normalizes 10-digit number without leading zero', () => {
    const res = normalizeEgyptianPhone('1123456789');
    expect(res.isValid).toBe(true);
    expect(res.normalized).toBe('+201123456789');
  });

  it('normalizes numbers already starting with +20', () => {
    const res = normalizeEgyptianPhone('+201234567890');
    expect(res.isValid).toBe(true);
    expect(res.normalized).toBe('+201234567890');
  });

  it('supports WE prefix (015)', () => {
    const res = normalizeEgyptianPhone('01598765432');
    expect(res.isValid).toBe(true);
    expect(res.normalized).toBe('+201598765432');
  });

  it('cleans spaces, dashes, and parentheses', () => {
    const res = normalizeEgyptianPhone(' (010) 1234-5678 ');
    expect(res.isValid).toBe(true);
    expect(res.normalized).toBe('+201012345678');
  });

  it('converts Arabic eastern digits to standard western digits', () => {
    const res = normalizeEgyptianPhone('٠١٠١٢٣٤٥٦٧٨');
    expect(res.isValid).toBe(true);
    expect(res.normalized).toBe('+201012345678');
  });

  it('rejects invalid Egyptian prefixes like 013, 014, 017', () => {
    const res = normalizeEgyptianPhone('01312345678');
    expect(res.isValid).toBe(false);
    expect(res.normalized).toBe('');
    expect(res.error).toBeDefined();
  });

  it('rejects numbers that are too short or too long', () => {
    expect(normalizeEgyptianPhone('010123456').isValid).toBe(false);
    expect(normalizeEgyptianPhone('01012345678999').isValid).toBe(false);
  });
});
