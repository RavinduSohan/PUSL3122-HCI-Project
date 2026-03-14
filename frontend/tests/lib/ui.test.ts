import { describe, expect, it } from 'vitest';
import { inputCls } from '../../lib/ui';

describe('inputCls', () => {
  it('returns error styles when hasError is true', () => {
    const cls = inputCls(true);
    expect(cls).toContain('border-red-400');
    expect(cls).toContain('focus:ring-red-400');
  });

  it('returns default styles and appends custom classes', () => {
    const cls = inputCls(false, 'custom-class');
    expect(cls).toContain('border-gray-300');
    expect(cls).toContain('custom-class');
  });
});
