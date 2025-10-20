import { AddressSchema, StanceSchema, IssueDraftSchema } from '../schemas';

describe('schemas.ts', () => {
  describe('AddressSchema', () => {
    it('should accept valid addresses', () => {
      const validAddresses = [
        { address: '1600 Pennsylvania Ave NW, Washington, DC 20500' },
        { address: '123 Main St' },
        { address: 'P.O. Box 12345, New York, NY 10001' },
        { address: 'Apt 5B, 789 Broadway, San Francisco, CA 94102' },
      ];

      validAddresses.forEach((data) => {
        const result = AddressSchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });

    it('should reject addresses that are too short', () => {
      const invalid = { address: '123' };
      const result = AddressSchema.safeParse(invalid);

      expect(result.success).toBe(false);
      if (!result.success) {
        // In Zod v4, errors are in the 'issues' property
        expect(result.error.issues).toBeDefined();
        expect(result.error.issues.length).toBeGreaterThan(0);
        expect(result.error.issues[0].message).toBe('Please enter a full street address');
      }
    });

    it('should reject empty addresses', () => {
      const invalid = { address: '' };
      const result = AddressSchema.safeParse(invalid);

      expect(result.success).toBe(false);
    });

    it('should reject missing address field', () => {
      const invalid = {};
      const result = AddressSchema.safeParse(invalid);

      expect(result.success).toBe(false);
    });
  });

  describe('StanceSchema', () => {
    it('should accept "support"', () => {
      const result = StanceSchema.safeParse('support');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('support');
      }
    });

    it('should accept "oppose"', () => {
      const result = StanceSchema.safeParse('oppose');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('oppose');
      }
    });

    it('should reject invalid stance values', () => {
      const invalidValues = ['neutral', 'abstain', 'yes', 'no', ''];

      invalidValues.forEach((value) => {
        const result = StanceSchema.safeParse(value);
        expect(result.success).toBe(false);
      });
    });
  });

  describe('IssueDraftSchema', () => {
    it('should accept valid issue draft with all fields', () => {
      const validData = {
        stance: 'support' as const,
        topic: 'Climate Change & Environmental Policy',
        bill: 'HR 1234',
        city: 'San Francisco',
        state: 'California',
        personalImpact: 'As a resident of coastal California, rising sea levels directly threaten my community.',
        desiredAction: 'Please vote yes on this critical climate legislation',
        tone: 'urgent' as const,
      };

      const result = IssueDraftSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should accept valid issue draft with only required fields', () => {
      const validData = {
        stance: 'oppose' as const,
        topic: 'Healthcare Access & Costs',
      };

      const result = IssueDraftSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject topic that is too short', () => {
      const invalid = {
        stance: 'support' as const,
        topic: 'A', // Too short
      };

      const result = IssueDraftSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('should reject topic that is too long', () => {
      const invalid = {
        stance: 'support' as const,
        topic: 'A'.repeat(81), // More than 80 characters
      };

      const result = IssueDraftSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('should reject personalImpact that is too long', () => {
      const invalid = {
        stance: 'support' as const,
        topic: 'Healthcare',
        personalImpact: 'A'.repeat(301), // More than 300 characters
      };

      const result = IssueDraftSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('should reject desiredAction that is too long', () => {
      const invalid = {
        stance: 'support' as const,
        topic: 'Education',
        desiredAction: 'A'.repeat(121), // More than 120 characters
      };

      const result = IssueDraftSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('should accept valid tone values', () => {
      const tones = ['neutral', 'urgent', 'friendly'] as const;

      tones.forEach((tone) => {
        const data = {
          stance: 'support' as const,
          topic: 'Test Topic',
          tone,
        };

        const result = IssueDraftSchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });

    it('should default tone to "neutral" when not provided', () => {
      const data = {
        stance: 'support' as const,
        topic: 'Test Topic',
      };

      const result = IssueDraftSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.tone).toBe('neutral');
      }
    });

    it('should reject invalid tone values', () => {
      const invalid = {
        stance: 'support' as const,
        topic: 'Test',
        tone: 'aggressive' as any,
      };

      const result = IssueDraftSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('should require stance field', () => {
      const invalid = {
        topic: 'Test Topic',
      };

      const result = IssueDraftSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('should require topic field', () => {
      const invalid = {
        stance: 'support' as const,
      };

      const result = IssueDraftSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('should accept optional fields as undefined', () => {
      const data = {
        stance: 'support' as const,
        topic: 'Test Topic',
        bill: undefined,
        city: undefined,
        state: undefined,
        personalImpact: undefined,
        desiredAction: undefined,
      };

      const result = IssueDraftSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should accept optional fields when omitted', () => {
      const data = {
        stance: 'oppose' as const,
        topic: 'Immigration & Border Policy',
      };

      const result = IssueDraftSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.bill).toBeUndefined();
        expect(result.data.personalImpact).toBeUndefined();
        expect(result.data.desiredAction).toBeUndefined();
      }
    });

    it('should handle edge cases for string lengths', () => {
      const data = {
        stance: 'support' as const,
        topic: 'AB', // Exactly 2 characters (minimum)
        personalImpact: 'A'.repeat(300), // Exactly 300 characters (maximum)
        desiredAction: 'A'.repeat(120), // Exactly 120 characters (maximum)
      };

      const result = IssueDraftSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });
});
