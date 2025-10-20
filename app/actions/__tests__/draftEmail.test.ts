import { draftEmail } from '../draftEmail';

// Mock global fetch
global.fetch = jest.fn();

describe('draftEmail', () => {
  const mockOpenAIKey = 'test-openai-key';

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.OPENAI_API_KEY = mockOpenAIKey;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  function mockOpenAIResponse(content: string) {
    return {
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content,
            },
          },
        ],
      }),
    };
  }

  describe('Input Validation', () => {
    it('should reject invalid input', async () => {
      const invalidInput = {
        stance: 'neutral', // Invalid stance
        topic: 'Climate Change',
      };

      await expect(draftEmail(invalidInput)).rejects.toThrow('Invalid input');
    });

    it('should reject missing stance', async () => {
      const invalidInput = {
        topic: 'Climate Change',
      };

      await expect(draftEmail(invalidInput)).rejects.toThrow('Invalid input');
    });

    it('should reject missing topic', async () => {
      const invalidInput = {
        stance: 'support',
      };

      await expect(draftEmail(invalidInput)).rejects.toThrow('Invalid input');
    });

    it('should accept valid input with only required fields', async () => {
      const validInput = {
        stance: 'support' as const,
        topic: 'Climate Change & Environmental Policy',
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockOpenAIResponse('Draft email'));

      await expect(draftEmail(validInput)).resolves.toBeDefined();
    });

    it('should accept valid input with all fields', async () => {
      const validInput = {
        stance: 'oppose' as const,
        topic: 'Healthcare Access & Costs',
        bill: 'HR 1234',
        city: 'San Francisco',
        state: 'California',
        personalImpact: 'This affects my healthcare coverage',
        desiredAction: 'Please vote no on this bill',
        tone: 'urgent' as const,
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockOpenAIResponse('Draft email'));

      await expect(draftEmail(validInput)).resolves.toBeDefined();
    });
  });

  describe('OpenAI API Integration', () => {
    it('should call OpenAI API with correct endpoint', async () => {
      const input = {
        stance: 'support' as const,
        topic: 'Climate Change',
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockOpenAIResponse('Draft'));

      await draftEmail(input);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.openai.com/v1/chat/completions',
        expect.any(Object)
      );
    });

    it('should include correct headers', async () => {
      const input = {
        stance: 'support' as const,
        topic: 'Healthcare',
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockOpenAIResponse('Draft'));

      await draftEmail(input);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: {
            Authorization: `Bearer ${mockOpenAIKey}`,
            'Content-Type': 'application/json',
          },
        })
      );
    });

    it('should use gpt-4o-mini model', async () => {
      const input = {
        stance: 'oppose' as const,
        topic: 'Immigration',
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockOpenAIResponse('Draft'));

      await draftEmail(input);

      const callArgs = (global.fetch as jest.Mock).mock.calls[0][1];
      const body = JSON.parse(callArgs.body);

      expect(body.model).toBe('gpt-4o-mini');
    });

    it('should use temperature 0.3', async () => {
      const input = {
        stance: 'support' as const,
        topic: 'Education',
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockOpenAIResponse('Draft'));

      await draftEmail(input);

      const callArgs = (global.fetch as jest.Mock).mock.calls[0][1];
      const body = JSON.parse(callArgs.body);

      expect(body.temperature).toBe(0.3);
    });

    it('should include system and user messages', async () => {
      const input = {
        stance: 'support' as const,
        topic: 'Climate Change',
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockOpenAIResponse('Draft'));

      await draftEmail(input);

      const callArgs = (global.fetch as jest.Mock).mock.calls[0][1];
      const body = JSON.parse(callArgs.body);

      expect(body.messages).toHaveLength(2);
      expect(body.messages[0].role).toBe('system');
      expect(body.messages[1].role).toBe('user');
    });
  });

  describe('Prompt Generation', () => {
    it('should include stance in user prompt', async () => {
      const input = {
        stance: 'oppose' as const,
        topic: 'Healthcare',
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockOpenAIResponse('Draft'));

      await draftEmail(input);

      const callArgs = (global.fetch as jest.Mock).mock.calls[0][1];
      const body = JSON.parse(callArgs.body);
      const userMessage = body.messages[1].content;

      expect(userMessage).toContain('OPPOSE');
    });

    it('should include topic in user prompt', async () => {
      const input = {
        stance: 'support' as const,
        topic: 'Climate Change & Environmental Policy',
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockOpenAIResponse('Draft'));

      await draftEmail(input);

      const callArgs = (global.fetch as jest.Mock).mock.calls[0][1];
      const body = JSON.parse(callArgs.body);
      const userMessage = body.messages[1].content;

      expect(userMessage).toContain('Climate Change & Environmental Policy');
    });

    it('should include bill number when provided', async () => {
      const input = {
        stance: 'support' as const,
        topic: 'Healthcare',
        bill: 'HR 1234',
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockOpenAIResponse('Draft'));

      await draftEmail(input);

      const callArgs = (global.fetch as jest.Mock).mock.calls[0][1];
      const body = JSON.parse(callArgs.body);
      const userMessage = body.messages[1].content;

      expect(userMessage).toContain('Bill: HR 1234');
    });

    it('should include personal impact when provided', async () => {
      const input = {
        stance: 'oppose' as const,
        topic: 'Healthcare',
        personalImpact: 'This will affect my family coverage',
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockOpenAIResponse('Draft'));

      await draftEmail(input);

      const callArgs = (global.fetch as jest.Mock).mock.calls[0][1];
      const body = JSON.parse(callArgs.body);
      const userMessage = body.messages[1].content;

      expect(userMessage).toContain('Personal impact: This will affect my family coverage');
    });

    it('should include desired action when provided', async () => {
      const input = {
        stance: 'support' as const,
        topic: 'Education',
        desiredAction: 'Please vote yes on this bill',
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockOpenAIResponse('Draft'));

      await draftEmail(input);

      const callArgs = (global.fetch as jest.Mock).mock.calls[0][1];
      const body = JSON.parse(callArgs.body);
      const userMessage = body.messages[1].content;

      expect(userMessage).toContain('Desired action: Please vote yes on this bill');
    });

    it('should include city and state when provided', async () => {
      const input = {
        stance: 'support' as const,
        topic: 'Climate',
        city: 'San Francisco',
        state: 'California',
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockOpenAIResponse('Draft'));

      await draftEmail(input);

      const callArgs = (global.fetch as jest.Mock).mock.calls[0][1];
      const body = JSON.parse(callArgs.body);
      const userMessage = body.messages[1].content;

      expect(userMessage).toContain('in San Francisco, California');
    });

    it('should include only state when city is not provided', async () => {
      const input = {
        stance: 'oppose' as const,
        topic: 'Immigration',
        state: 'Texas',
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockOpenAIResponse('Draft'));

      await draftEmail(input);

      const callArgs = (global.fetch as jest.Mock).mock.calls[0][1];
      const body = JSON.parse(callArgs.body);
      const userMessage = body.messages[1].content;

      expect(userMessage).toContain('in Texas');
      expect(userMessage).not.toContain(', Texas');
    });

    it('should include tone when provided', async () => {
      const input = {
        stance: 'support' as const,
        topic: 'Healthcare',
        tone: 'urgent' as const,
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockOpenAIResponse('Draft'));

      await draftEmail(input);

      const callArgs = (global.fetch as jest.Mock).mock.calls[0][1];
      const body = JSON.parse(callArgs.body);
      const userMessage = body.messages[1].content;

      expect(userMessage).toContain('Tone: urgent');
    });

    it('should include official information when provided', async () => {
      const input = {
        stance: 'support' as const,
        topic: 'Climate Change',
      };
      const official = {
        name: 'Senator Smith',
        role: 'U.S. Senator',
        party: 'Democratic',
        level: 'federal',
        phones: ['555-1234'],
        emails: [],
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockOpenAIResponse('Draft'));

      await draftEmail(input, official);

      const callArgs = (global.fetch as jest.Mock).mock.calls[0][1];
      const body = JSON.parse(callArgs.body);
      const userMessage = body.messages[1].content;

      expect(userMessage).toContain('Recipient: U.S. Senator Senator Smith');
    });

    it('should use generic recipient when official not provided', async () => {
      const input = {
        stance: 'oppose' as const,
        topic: 'Education',
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockOpenAIResponse('Draft'));

      await draftEmail(input);

      const callArgs = (global.fetch as jest.Mock).mock.calls[0][1];
      const body = JSON.parse(callArgs.body);
      const userMessage = body.messages[1].content;

      expect(userMessage).toContain('Recipient: my representative');
    });
  });

  describe('System Prompt', () => {
    it('should include word count requirement', async () => {
      const input = {
        stance: 'support' as const,
        topic: 'Climate',
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockOpenAIResponse('Draft'));

      await draftEmail(input);

      const callArgs = (global.fetch as jest.Mock).mock.calls[0][1];
      const body = JSON.parse(callArgs.body);
      const systemMessage = body.messages[0].content;

      expect(systemMessage).toContain('150–220 words');
    });

    it('should include tone requirements', async () => {
      const input = {
        stance: 'oppose' as const,
        topic: 'Healthcare',
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockOpenAIResponse('Draft'));

      await draftEmail(input);

      const callArgs = (global.fetch as jest.Mock).mock.calls[0][1];
      const body = JSON.parse(callArgs.body);
      const systemMessage = body.messages[0].content;

      expect(systemMessage).toContain('calm, civil, professional');
    });

    it('should prohibit bill number fabrication', async () => {
      const input = {
        stance: 'support' as const,
        topic: 'Education',
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockOpenAIResponse('Draft'));

      await draftEmail(input);

      const callArgs = (global.fetch as jest.Mock).mock.calls[0][1];
      const body = JSON.parse(callArgs.body);
      const systemMessage = body.messages[0].content;

      expect(systemMessage).toContain('no fabrication');
    });
  });

  describe('Response Handling', () => {
    it('should return trimmed draft text', async () => {
      const input = {
        stance: 'support' as const,
        topic: 'Climate Change',
      };
      const draftText = '  Draft email content  ';

      (global.fetch as jest.Mock).mockResolvedValue(mockOpenAIResponse(draftText));

      const result = await draftEmail(input);

      expect(result).toBe('Draft email content');
    });

    it('should handle empty response from OpenAI', async () => {
      const input = {
        stance: 'oppose' as const,
        topic: 'Healthcare',
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          choices: [
            {
              message: {
                content: '',
              },
            },
          ],
        }),
      });

      const result = await draftEmail(input);

      expect(result).toBe('');
    });

    it('should handle missing choices in response', async () => {
      const input = {
        stance: 'support' as const,
        topic: 'Education',
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({}),
      });

      const result = await draftEmail(input);

      expect(result).toBe('');
    });

    it('should handle missing message in response', async () => {
      const input = {
        stance: 'oppose' as const,
        topic: 'Immigration',
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          choices: [{}],
        }),
      });

      const result = await draftEmail(input);

      expect(result).toBe('');
    });
  });

  describe('Error Handling', () => {
    it('should throw error when OpenAI API returns non-ok response', async () => {
      const input = {
        stance: 'support' as const,
        topic: 'Climate Change',
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500,
      });

      await expect(draftEmail(input)).rejects.toThrow('LLM error');
    });

    it('should throw error when OpenAI API returns 401', async () => {
      const input = {
        stance: 'oppose' as const,
        topic: 'Healthcare',
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 401,
      });

      await expect(draftEmail(input)).rejects.toThrow('LLM error');
    });

    it('should throw error when OpenAI API returns 429 (rate limit)', async () => {
      const input = {
        stance: 'support' as const,
        topic: 'Education',
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 429,
      });

      await expect(draftEmail(input)).rejects.toThrow('LLM error');
    });

    it('should throw error when fetch fails', async () => {
      const input = {
        stance: 'oppose' as const,
        topic: 'Immigration',
      };

      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      await expect(draftEmail(input)).rejects.toThrow('Network error');
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long topic at max length', async () => {
      const input = {
        stance: 'support' as const,
        topic: 'A'.repeat(80),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockOpenAIResponse('Draft'));

      await expect(draftEmail(input)).resolves.toBeDefined();
    });

    it('should handle all tone options', async () => {
      const tones = ['neutral', 'urgent', 'friendly'] as const;

      for (const tone of tones) {
        const input = {
          stance: 'support' as const,
          topic: 'Climate',
          tone,
        };

        (global.fetch as jest.Mock).mockResolvedValue(mockOpenAIResponse('Draft'));

        const result = await draftEmail(input);

        expect(result).toBeDefined();

        const callArgs = (global.fetch as jest.Mock).mock.calls[
          (global.fetch as jest.Mock).mock.calls.length - 1
        ][1];
        const body = JSON.parse(callArgs.body);
        const userMessage = body.messages[1].content;

        expect(userMessage).toContain(`Tone: ${tone}`);
      }
    });

    it('should handle Unicode characters in all fields', async () => {
      const input = {
        stance: 'support' as const,
        topic: 'Climate Change 气候变化',
        city: 'São Paulo',
        state: 'São Paulo',
        personalImpact: 'This affects everyone 🌍',
        desiredAction: 'Please support this 👍',
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockOpenAIResponse('Draft with 中文'));

      const result = await draftEmail(input);

      expect(result).toBe('Draft with 中文');
    });
  });
});
