# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Civic Action MVP is a Next.js 14 web app that helps citizens contact their elected officials. Users enter an address, select an issue/stance, and receive AI-generated email drafts for every official from local to federal level.

**Key Flow**: Address → Officials Lookup (5 Calls API) → Issue Selection → AI Draft Generation (OpenAI) → Contact Methods

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
2. **API Route** (`/api/reps/route.ts`): Calls 5 Calls API (no auth required)
3. **Mapper** (`lib/civic.ts`): Transforms 5 Calls response into `OfficialContact[]`
4. **Client**: Officials displayed immediately in `OfficialsList.tsx` (with disabled draft buttons)
5. **Client**: User optionally selects issue in `IssuePicker.tsx` (enables draft generation)
6. **Client**: User clicks "Draft email" button on any official
7. **API Route** (`/api/ai/draft/route.ts`): Calls OpenAI via `actions/draftEmail.ts`
8. **Client**: Draft appears in `OfficialCard.tsx` with mailto: link

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
    /reps/route.ts          # Officials lookup (5 Calls API)
    /ai/draft/route.ts      # Email draft generation (OpenAI)
  /actions
    draftEmail.ts           # Core AI drafting logic
  /components
    TopNav.tsx              # Sticky navigation with mobile menu
    Footer.tsx              # Professional footer with commitments
    AddressForm.tsx         # Simple controlled input
    LocationStatus.tsx      # User feedback for address submission
    IssuePicker.tsx         # Multi-field issue selector
    OfficialCard.tsx        # Individual official with draft UI
    OfficialsList.tsx       # Manages drafts state for all officials
  /lib
    civic.ts                # Maps 5 Calls API → OfficialContact[]
    mailto.ts               # Generates mailto: URLs
    rateLimit.ts            # In-memory rate limiter
    schemas.ts              # Zod validation schemas
  page.tsx                  # Main page with state coordination
  icon.svg                  # Favicon (capitol building)
  apple-icon.svg            # Apple touch icon
  opengraph-image.tsx       # Dynamic OG image generation
  twitter-image.tsx         # Twitter card image
```

## Environment Variables

Required in `.env.local`:
- `OPENAI_API_KEY` - OpenAI API key
- `APP_BASE_URL` - Base URL (optional, mainly for development)

**Note**: The 5 Calls API requires no authentication, so no API key is needed for officials lookup.

See `.env.local.example` for setup instructions.

## State Management

**No global state library**. State is managed through React hooks:

- `page.tsx` - Coordinates `officials` and `issue` state, passes to children
- `OfficialsList.tsx` - Manages `drafts` dictionary keyed by `official.name + official.role`
- Each component uses local `useState` for UI concerns (loading, input values)

## API Integration Notes

**5 Calls API** (`lib/civic.ts`):
- Public API endpoint: `https://api.5calls.org/v1/reps?location=<address>`
- No authentication required
- Returns flat structure with `representatives[]` array
- Response includes: location, state, district, lowAccuracy flag
- Each representative includes: id, name, phone, photoURL, party, state, reason, area, field_offices[]
- Mapper (`mapFiveCallsToOfficials`) transforms this into `OfficialContact[]`
- Collects all phone numbers (main + field offices)
- Note: 5 Calls API does not provide email addresses (emails array will be empty)
- Coverage: Federal (House, Senate), State (Governor, AG, Sec of State, legislators)

**OpenAI API** (`actions/draftEmail.ts`):
- Uses `gpt-4o-mini` with temperature 0.3
- System prompt enforces structure: opening paragraph + 2-3 bullets + closing ask
- User prompt includes: recipient, stance, topic, bill, personal impact, desired action, jurisdiction, tone

## Styling

Tailwind CSS with minimal custom config. Uses rounded-2xl consistently for modern feel. Dark mode support via `globals.css` but not actively used in components.

## Visual Development

### Design Principles
- Comprehensive design checklist in `/context/design-principles.md`
- Brand style guide in `/context/style-guide.md`
- When making visual (front-end, UI/UX) changes, always refer to these files for guidance

### Quick Visual Check
IMMEDIATELY after implementing any front-end change:
1. **Identify what changed** - Review the modified components/pages
2. **Navigate to affected pages** - Use `mcp__playwright__browser_navigate` to visit each changed view
3. **Verify design compliance** - Compare against `/context/design-principles.md` and `/context/style-guide.md`
4. **Validate feature implementation** - Ensure the change fulfills the user's specific request
5. **Check acceptance criteria** - Review any provided context files or requirements
6. **Capture evidence** - Take full page screenshot at desktop viewport (1440px) of each changed view
7. **Check for errors** - Run `mcp__playwright__browser_console_messages`

This verification ensures changes meet design standards and user requirements.

### Comprehensive Design Review
Invoke the `@agent-design-review` subagent for thorough design validation when:
- Completing significant UI/UX features
- Before finalizing PRs with visual changes
- Needing comprehensive accessibility and responsiveness testing

## Type Safety

TypeScript strict mode enabled. Import paths use `@/*` alias pointing to project root.

## Known Limitations (MVP Scope)

- In-memory rate limiting (not shared across serverless instances)
- No email addresses for officials (5 Calls API limitation)
- No bill context fetching (planned for post-MVP)
- No analytics or tracking (planned for post-MVP)
- No phone script generation (planned for post-MVP)
- Limited to U.S. addresses (5 Calls API constraint)
