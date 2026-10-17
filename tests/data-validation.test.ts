import { describe, it, expect } from 'vitest';
import { formatCurrencyEGP, maskPhoneNumber, HOUSING_TYPE_LABELS } from '../src/lib/utils';
import { EGYPT_GOVERNORATES } from '../src/types/database';

describe('Data Formatting & Validation', () => {
  it('formats amounts in Egyptian Pounds with symbol', () => {
    expect(formatCurrencyEGP(2500)).toContain('ج.م');
    expect(formatCurrencyEGP(0)).toContain('ج.م');
  });

  it('masks phone numbers safely to prevent public scraping', () => {
    const masked = maskPhoneNumber('+201012345678');
    expect(masked).toBe('+201****678');
    expect(masked).not.toBe('+201012345678');
  });

  it('contains all 27 Egyptian governorates correctly', () => {
    expect(EGYPT_GOVERNORATES.length).toBe(27);
    const names = EGYPT_GOVERNORATES.map((g) => g.nameAr);
    expect(names).toContain('القاهرة');
    expect(names).toContain('الجيزة');
    expect(names).toContain('الإسكندرية');
    expect(names).toContain('الدقهلية');
    expect(names).toContain('أسيوط');
    expect(names).toContain('مطروح');
    expect(names).toContain('شمال سيناء');
    expect(names).toContain('جنوب سيناء');
  });

  it('provides Arabic labels for all housing types', () => {
    expect(HOUSING_TYPE_LABELS['room']).toBeDefined();
    expect(HOUSING_TYPE_LABELS['studio']).toBeDefined();
    expect(HOUSING_TYPE_LABELS['shared_apartment']).toBeDefined();
    expect(HOUSING_TYPE_LABELS['full_apartment']).toBeDefined();
  });
});
