import { mailtoHref } from '../mailto';

describe('mailto.ts', () => {
  describe('mailtoHref', () => {
    it('should generate a correct mailto URL with all parameters', () => {
      const email = 'senator@example.com';
      const subject = 'Support for Climate Bill HR 1234';
      const body = 'Dear Senator,\n\nI am writing to express my support for HR 1234.';

      const result = mailtoHref(email, subject, body);

      expect(result).toContain('mailto:senator@example.com');
      expect(result).toContain('?subject=');
      expect(result).toContain('&body=');
      expect(decodeURIComponent(result)).toContain('Support for Climate Bill HR 1234');
      expect(decodeURIComponent(result)).toContain('Dear Senator');
    });

    it('should properly encode special characters in subject', () => {
      const email = 'test@example.com';
      const subject = 'Re: Healthcare & Education Reform';
      const body = 'Test';

      const result = mailtoHref(email, subject, body);

      // The & character should be encoded as %26
      expect(result).toContain('subject=Re%3A%20Healthcare%20%26%20Education%20Reform');
    });

    it('should properly encode special characters in body', () => {
      const email = 'test@example.com';
      const subject = 'Test';
      const body = 'Dear Representative,\n\nI support HR 1234 @ 100%!';

      const result = mailtoHref(email, subject, body);

      // Newlines, @, and % should be encoded
      expect(result).toContain('body=Dear%20Representative%2C%0A%0AI%20support%20HR%201234%20%40%20100%25!');
    });

    it('should handle empty strings', () => {
      const result = mailtoHref('', '', '');

      expect(result).toBe('mailto:?subject=&body=');
    });

    it('should handle very long body text', () => {
      const email = 'test@example.com';
      const subject = 'Test Subject';
      const body = 'A'.repeat(1000);

      const result = mailtoHref(email, subject, body);

      expect(result).toContain('mailto:test@example.com');
      expect(result).toContain('subject=Test%20Subject');
      expect(result.length).toBeGreaterThan(1000);
    });

    it('should preserve line breaks in body', () => {
      const email = 'test@example.com';
      const subject = 'Multi-line Test';
      const body = 'Line 1\nLine 2\nLine 3';

      const result = mailtoHref(email, subject, body);

      const decodedBody = decodeURIComponent(result.split('body=')[1]);
      expect(decodedBody).toBe('Line 1\nLine 2\nLine 3');
    });

    it('should handle Unicode characters', () => {
      const email = 'test@example.com';
      const subject = 'Testing 中文 and émojis 🎉';
      const body = 'This is a test with 中文 characters and émojis 🌟';

      const result = mailtoHref(email, subject, body);

      expect(result).toContain('mailto:test@example.com');
      expect(decodeURIComponent(result)).toContain('中文');
      expect(decodeURIComponent(result)).toContain('émojis');
      expect(decodeURIComponent(result)).toContain('🎉');
      expect(decodeURIComponent(result)).toContain('🌟');
    });

    it('should handle quotes and apostrophes correctly', () => {
      const email = 'test@example.com';
      const subject = 'Bill "HR 1234" Analysis';
      const body = "I believe this is an important bill. It's crucial.";

      const result = mailtoHref(email, subject, body);

      expect(decodeURIComponent(result)).toContain('"HR 1234"');
      expect(decodeURIComponent(result)).toContain("It's");
    });

    it('should handle email addresses with special characters', () => {
      const email = 'senator.john+staff@senate.gov';
      const subject = 'Test';
      const body = 'Test';

      const result = mailtoHref(email, subject, body);

      expect(result).toContain('mailto:senator.john+staff@senate.gov');
    });
  });
});
