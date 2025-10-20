import { rateLimit } from '../rateLimit';

describe('rateLimit.ts', () => {
  beforeEach(() => {
    // Clear the rate limit buckets before each test
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('rateLimit', () => {
    it('should allow requests within the limit', () => {
      const key = 'test-user-1';
      const max = 5;

      // First 5 requests should succeed
      for (let i = 0; i < max; i++) {
        const result = rateLimit(key, max);
        expect(result.ok).toBe(true);
      }
    });

    it('should block requests exceeding the limit', () => {
      const key = 'test-user-2';
      const max = 3;

      // First 3 requests succeed
      expect(rateLimit(key, max).ok).toBe(true);
      expect(rateLimit(key, max).ok).toBe(true);
      expect(rateLimit(key, max).ok).toBe(true);

      // 4th request should be blocked
      expect(rateLimit(key, max).ok).toBe(false);
      expect(rateLimit(key, max).ok).toBe(false);
    });

    it('should reset the count after the time window', () => {
      const key = 'test-user-3';
      const max = 2;
      const windowMs = 60000; // 1 minute

      // First 2 requests succeed
      expect(rateLimit(key, max, windowMs).ok).toBe(true);
      expect(rateLimit(key, max, windowMs).ok).toBe(true);

      // 3rd request should be blocked
      expect(rateLimit(key, max, windowMs).ok).toBe(false);

      // Advance time past the window
      jest.advanceTimersByTime(windowMs + 1);

      // Should allow requests again
      expect(rateLimit(key, max, windowMs).ok).toBe(true);
      expect(rateLimit(key, max, windowMs).ok).toBe(true);
    });

    it('should use default parameters when not provided', () => {
      const key = 'test-user-4';

      // Default is 20 requests per 60 seconds
      // First 20 should succeed
      for (let i = 0; i < 20; i++) {
        expect(rateLimit(key).ok).toBe(true);
      }

      // 21st should fail
      expect(rateLimit(key).ok).toBe(false);
    });

    it('should maintain separate counters for different keys', () => {
      const key1 = 'user-1';
      const key2 = 'user-2';
      const max = 2;

      // User 1 makes 2 requests
      expect(rateLimit(key1, max).ok).toBe(true);
      expect(rateLimit(key1, max).ok).toBe(true);

      // User 1 is now rate limited
      expect(rateLimit(key1, max).ok).toBe(false);

      // User 2 should still be able to make requests
      expect(rateLimit(key2, max).ok).toBe(true);
      expect(rateLimit(key2, max).ok).toBe(true);

      // Now user 2 is also rate limited
      expect(rateLimit(key2, max).ok).toBe(false);
    });

    it('should handle very small time windows', () => {
      const key = 'test-user-5';
      const max = 3;
      const windowMs = 100; // 100ms

      // Make 3 requests
      expect(rateLimit(key, max, windowMs).ok).toBe(true);
      expect(rateLimit(key, max, windowMs).ok).toBe(true);
      expect(rateLimit(key, max, windowMs).ok).toBe(true);

      // Should be rate limited
      expect(rateLimit(key, max, windowMs).ok).toBe(false);

      // Advance time by the window
      jest.advanceTimersByTime(windowMs + 1);

      // Should allow requests again
      expect(rateLimit(key, max, windowMs).ok).toBe(true);
    });

    it('should handle very large limits', () => {
      const key = 'test-user-6';
      const max = 1000;

      // Make 1000 requests
      for (let i = 0; i < max; i++) {
        expect(rateLimit(key, max).ok).toBe(true);
      }

      // 1001st should fail
      expect(rateLimit(key, max).ok).toBe(false);
    });

    it('should handle edge case of max = 0', () => {
      const key = 'test-user-7';
      const max = 0;

      // First request succeeds (creates bucket with count=1)
      expect(rateLimit(key, max).ok).toBe(true);
      // Subsequent requests should be blocked (count=1 >= max=0)
      expect(rateLimit(key, max).ok).toBe(false);
      expect(rateLimit(key, max).ok).toBe(false);
    });

    it('should handle edge case of max = 1', () => {
      const key = 'test-user-8';
      const max = 1;

      // First request succeeds
      expect(rateLimit(key, max).ok).toBe(true);

      // All subsequent requests should be blocked
      expect(rateLimit(key, max).ok).toBe(false);
      expect(rateLimit(key, max).ok).toBe(false);
    });

    it('should not interfere between different time windows', () => {
      const key = 'test-user-9';
      const max = 2;
      const windowMs = 1000;

      // Window 1
      expect(rateLimit(key, max, windowMs).ok).toBe(true);
      expect(rateLimit(key, max, windowMs).ok).toBe(true);
      expect(rateLimit(key, max, windowMs).ok).toBe(false);

      // Advance to window 2
      jest.advanceTimersByTime(windowMs + 1);
      expect(rateLimit(key, max, windowMs).ok).toBe(true);
      expect(rateLimit(key, max, windowMs).ok).toBe(true);
      expect(rateLimit(key, max, windowMs).ok).toBe(false);

      // Advance to window 3
      jest.advanceTimersByTime(windowMs + 1);
      expect(rateLimit(key, max, windowMs).ok).toBe(true);
    });
  });
});
