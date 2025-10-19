# Civic Action MVP

**Empowering effective civic action through streamlined communication between constituents and their elected officials.**

A web app that makes it simple for citizens to contact their representatives with well-crafted, respectful messages. Enter an address, pick an issue, and get a ready-to-send email draft for every official from local to federal level—enabling meaningful dialogue that strengthens democracy.

## Features

- **Officials Lookup**: Find all elected officials (local → federal) for any U.S. address using the Google Civic Information API
- **Issue Selection**: Choose from common issues or enter your own, with support/oppose stance
- **AI-Generated Drafts**: Get personalized, respectful email drafts using GPT-4o-mini
- **Contact Paths**: Direct links to email, phone, and official websites
- **Privacy-First**: No address storage, no auto-sending—users maintain full control
- **Rate Limited**: Built-in protection (30 req/min for lookups, 15 req/min for AI)

## Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **APIs**: Google Civic Information API + OpenAI
- **Validation**: Zod
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Google Cloud account (for Civic Information API)
- OpenAI account (for GPT-4o-mini)

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd civic-action
npm install
```

### 2. Set Up API Keys

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

Then add your API keys to `.env.local`:

**Google Civic Information API:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable "Google Civic Information API" in APIs & Services
4. Create credentials → API Key
5. Copy the key to `GOOGLE_CIVIC_API_KEY`

**OpenAI API:**
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Copy the key to `OPENAI_API_KEY`

### 3. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Test It Out

Try entering a test address:
- **1600 Pennsylvania Ave NW, Washington, DC 20500** (White House)
- Your own address

Then:
1. Pick an issue and stance (support/oppose)
2. Optionally add bill number, personal impact, desired action
3. Click "Generate email draft" for any official
4. Copy the draft or click "Open in Mail"

## Project Structure

```
/app
  /api
    /reps/route.ts          # Officials lookup endpoint
    /ai/draft/route.ts      # Email draft generation endpoint
  /actions
    draftEmail.ts           # Server action for OpenAI calls
  /components
    AddressForm.tsx         # Address input
    IssuePicker.tsx         # Issue & stance selection
    OfficialCard.tsx        # Single official display
    OfficialsList.tsx       # Officials grid
  /lib
    civic.ts                # Civic API response mapper
    mailto.ts               # mailto: URL builder
    rateLimit.ts            # In-memory rate limiter
    schemas.ts              # Zod validation schemas
  page.tsx                  # Main page
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `GOOGLE_CIVIC_API_KEY`
   - `OPENAI_API_KEY`
4. Deploy

The app uses Edge Runtime for all API routes, making it fast and globally distributed.

## Roadmap (Post-MVP)

- [ ] **Bill Context**: Fetch bill titles/summaries from Congress.gov
- [ ] **Phone Scripts**: Generate 30-second call scripts
- [ ] **Action Tracking**: "I sent it" button to track impact
- [ ] **OpenStates Integration**: Enhanced state-level coverage
- [ ] **Upstash/Vercel KV**: Production-grade Redis rate limiting
- [ ] **Analytics**: Measure messages sent, issues addressed, responses

## Privacy & Ethics

- **No address storage**: Addresses are only used for real-time API calls
- **No auto-sending**: Users copy/paste drafts themselves
- **Respectful tone**: AI is prompted to generate calm, civil, professional messages
- **Transparency**: Open source, auditable code

## Contributing

Issues and PRs welcome! This is an MVP—help make it better.

## License

MIT

## Support

Questions? Open an issue or reach out via GitHub discussions.
