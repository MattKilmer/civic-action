# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Civic Action MVP is a Next.js 14 web app that helps citizens contact their elected officials. Users enter an address, select an issue/stance, and receive AI-generated email drafts for every official from local to federal level.

**Key Flow**: Address → Officials Lookup (Google Civic API) → Issue Selection → AI Draft Generation (OpenAI) → Contact Methods

## Development Commands

```bash
# Development
npm run dev          # Start dev server at localhost:3000

# Production
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## Architecture Overview

### Data Flow Pattern
1. **Client**: User enters address in `AddressForm.tsx`
2. **API Route** (`/api/reps/route.ts`): Calls Google Civic Information API
3. **Mapper** (`lib/civic.ts`): Transforms Google's response into `OfficialContact[]`
4. **Client**: User selects issue in `IssuePicker.tsx`, sees officials in `OfficialsList.tsx`
5. **API Route** (`/api/ai/draft/route.ts`): Calls OpenAI via `actions/draftEmail.ts`
6. **Client**: Draft appears in `OfficialCard.tsx` with mailto: link

### Key Architectural Decisions

**Edge Runtime**: Both API routes use `export const runtime = "edge"` for global distribution and fast response times.

**No Database**: This is an intentional MVP design choice. Addresses are never stored. All data flows through real-time API calls only.

**In-Memory Rate Limiting**: `lib/rateLimit.ts` uses a Map-based limiter (30 req/min for lookups, 15 req/min for AI). This is sufficient for MVP but should be replaced with Redis/Upstash for production.

**Server Actions vs API Routes**: Email drafting is implemented as both:
- `actions/draftEmail.ts` - Server action (reusable logic)
- `/api/ai/draft/route.ts` - API route wrapper (adds rate limiting, validation)

### Validation Layer

All external inputs flow through Zod schemas in `lib/schemas.ts`:
- `AddressSchema` - Validates address input
- `IssueDraftSchema` - Validates issue selection + optional fields
- Type safety via `z.infer<>` exports

### Important Constraints

**Tone & Ethics**: The AI prompt in `actions/draftEmail.ts` enforces:
- 150-220 words
- Calm, civil, professional tone
- No fabricated bill numbers
- Always requests written response

**Privacy**: No addresses, issues, or drafts are stored anywhere. The app is fully stateless.

## File Organization

```
/app
  /api
    /reps/route.ts          # Officials lookup (Google Civic API)
    /ai/draft/route.ts      # Email draft generation (OpenAI)
  /actions
    draftEmail.ts           # Core AI drafting logic
  /components
    AddressForm.tsx         # Simple controlled input
    IssuePicker.tsx         # Multi-field issue selector
    OfficialCard.tsx        # Individual official with draft UI
    OfficialsList.tsx       # Manages drafts state for all officials
  /lib
    civic.ts                # Maps Google Civic API → OfficialContact[]
    mailto.ts               # Generates mailto: URLs
    rateLimit.ts            # In-memory rate limiter
    schemas.ts              # Zod validation schemas
  page.tsx                  # Main page with state coordination
```

## Environment Variables

Required in `.env.local`:
- `GOOGLE_CIVIC_API_KEY` - Google Civic Information API key
- `OPENAI_API_KEY` - OpenAI API key
- `APP_BASE_URL` - Base URL (optional, mainly for development)

See `.env.local.example` for setup instructions.

## State Management

**No global state library**. State is managed through React hooks:

- `page.tsx` - Coordinates `officials` and `issue` state, passes to children
- `OfficialsList.tsx` - Manages `drafts` dictionary keyed by `official.name + official.role`
- Each component uses local `useState` for UI concerns (loading, input values)

## API Integration Notes

**Google Civic Information API** (`lib/civic.ts`):
- Returns nested structure: `offices[]` with `officialIndices[]` pointing into `officials[]`
- Mapper flattens this into a simple `OfficialContact[]` array
- Each official gets `role` from office name, `level` from office levels

**OpenAI API** (`actions/draftEmail.ts`):
- Uses `gpt-4o-mini` with temperature 0.3
- System prompt enforces structure: opening paragraph + 2-3 bullets + closing ask
- User prompt includes: recipient, stance, topic, bill, personal impact, desired action, jurisdiction, tone

## Styling

Tailwind CSS with minimal custom config. Uses rounded-2xl consistently for modern feel. Dark mode support via `globals.css` but not actively used in components.

## Type Safety

TypeScript strict mode enabled. Import paths use `@/*` alias pointing to project root.

## Known Limitations (MVP Scope)

- In-memory rate limiting (not shared across serverless instances)
- No bill context fetching (planned for post-MVP)
- No analytics or tracking (planned for post-MVP)
- No phone script generation (planned for post-MVP)
- Limited to U.S. addresses (Google Civic API constraint)
