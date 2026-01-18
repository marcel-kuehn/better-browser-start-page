import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    const result = cn('foo', 'bar');
    expect(result).toBe('foo bar');
  });

  it('should handle conditional classes', () => {
    // eslint-disable-next-line no-constant-binary-expression
    const result = cn('foo', false && 'bar', 'baz');
    expect(result).toBe('foo baz');
  });

  it('should merge Tailwind classes correctly', () => {
    const result = cn('px-2 py-1', 'px-4');
    // tailwind-merge should deduplicate and keep the last one
    expect(result).toContain('px-4');
    expect(result).toContain('py-1');
  });

  it('should handle empty inputs', () => {
    const result = cn();
    expect(result).toBe('');
  });

  it('should handle undefined and null values', () => {
    const result = cn('foo', undefined, null, 'bar');
    expect(result).toBe('foo bar');
  });
});
