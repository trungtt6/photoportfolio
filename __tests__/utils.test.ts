import { formatPrice, slugify, validateEmail, truncateText } from '@/lib/utils';

describe('utils', () => {
  describe('formatPrice', () => {
    it('formats price correctly with USD currency', () => {
      expect(formatPrice(49.99)).toBe('$49.99');
      expect(formatPrice(100)).toBe('$100.00');
    });
  });

  describe('slugify', () => {
    it('slugifies string correctly', () => {
      expect(slugify('Hello World!')).toBe('hello-world');
      expect(slugify('test-string')).toBe('test-string');
      expect(slugify('Multiple   Spaces')).toBe('multiple-spaces');
    });
  });

  describe('validateEmail', () => {
    it('validates emails correctly', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('invalid-email')).toBe(false);
    });
  });

  describe('truncateText', () => {
    it('truncates long string correctly', () => {
      expect(truncateText('Hello World', 5)).toBe('Hello...');
      expect(truncateText('Hello', 10)).toBe('Hello');
    });
  });
});
