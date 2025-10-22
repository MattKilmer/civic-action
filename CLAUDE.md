# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Civic Action MVP is a Next.js 14 web app that helps citizens contact their elected officials. Users enter an address, select an issue/stance, and receive AI-generated email drafts for every official from local to federal level.

**Key Flow**: Address → Officials Lookup (5 Calls API) → Issue Selection (with **Federal + State Bill Autocomplete** or Bill Explorer) → **Voting Power Indicators** (if bill selected) → AI Draft Generation (OpenAI) → Contact Methods

**Alternative Bill Explorer Flow**: Bill Explorer Page (`/bills`) → Search/Filter Bills → Select Bill → Homepage with Bill + Topic Pre-filled → Draft Generation

**Production URL**: https://takecivicaction.org

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

#### Main Flow (Homepage)
1. **Client**: User enters address in `AddressForm.tsx`
2. **API Route** (`/api/reps/route.ts`): Calls 5 Calls API (no auth required)
3. **Mapper** (`lib/civic.ts`): Transforms 5 Calls response into `OfficialContact[]`
4. **Client**: Officials displayed immediately in `OfficialsList.tsx` (with disabled draft buttons)
5. **Client**: User selects issue in `IssuePicker.tsx`
   - **Dropdown Selection**: Choose from 10 research-backed topics or "Other" (reveals custom field)
   - **Optional Bill Search**: Types bill number/title → debounced **unified search** via:
     - `/api/bills/search` (Federal bills - Congress.gov API)
     - `/api/bills/search-state?jurisdiction={state}` (State bills - LegiScan API)
   - **Merged Results**: State bills shown first (more relevant to user's location), then federal bills
   - **Visual Distinction**: Green "California" badges for state bills, blue "Federal" badges for federal bills
   - **Optional Autocomplete**: Selects bill from autocomplete dropdown → topic auto-detected from bill title
6. **Client**: If bill is selected, `OfficialsList.tsx` intelligently highlights voting power:
   - **Bill Detection**: Determines level (federal vs state) and chamber (via `lib/billVoting.ts`)
     - Federal: "HR 683" → {chamber: "house", level: "federal"}
     - State: "CA AB 123" → {chamber: "state-house", jurisdiction: "California", level: "state"}
   - **Official Reordering**: Voting officials automatically move to top
   - **Jurisdiction Matching**: State bills only match legislators from that specific state
     - Example: CA bill → only CA state legislators get "Can vote" badge
   - **Visual Indicators**: "Can vote" badge appears on eligible officials
   - **Info Banner**: Dismissible banner explains who can vote directly (includes state name for state bills)
7. **Client**: Issue selection enables "Draft email" buttons
8. **Client**: User clicks "Draft email" button on any official
9. **API Route** (`/api/ai/draft/route.ts`): Calls OpenAI via `actions/draftEmail.ts`
10. **Client**: Draft appears in `OfficialCard.tsx` with mailto: link

#### Bill Explorer Flow (Alternative Entry Point)
1. **Client**: User visits `/bills` page
2. **Client**: Searches/filters bills by:
   - Search query (bill number or keywords)
   - Status (Active, Enacted, Passed House/Senate, Introduced, All)
   - Bill type (HR, S, HJRES, SJRES)
   - Sort order (Most Recent, Oldest)
3. **API Route** (`/api/bills/search`): Fetches 200 bills from Congress.gov API
4. **Client**: Status filtering happens client-side (fast, no extra API calls)
5. **Client**: User clicks "Use this bill" → navigates to `/?bill={number}&billTitle={title}`
6. **Client**: Homepage detects URL params:
   - Pre-fills bill number in `IssuePicker.tsx`
   - Runs `mapBillTitleToTopic()` to auto-detect topic from bill title
   - Pre-selects topic in dropdown (or "Other" if no keyword match)
   - Scrolls to issue picker section
7. **Client**: Continues from step 6 of Main Flow

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
  /about
    page.tsx                # About / How It Works page
  /bills
    page.tsx                # Bill Explorer page with search/filters
    layout.tsx              # SEO metadata for bill explorer
  /privacy
    page.tsx                # Privacy Policy page
  /api
    /reps/route.ts          # Officials lookup (5 Calls API)
    /ai/draft/route.ts      # Email draft generation (OpenAI)
    /bills
      /search/route.ts      # Federal bill search (Congress.gov API)
      /search-state/route.ts # State bill search (LegiScan API)
      /[congress]/[type]/[number]/route.ts # Federal bill details
  /actions
    draftEmail.ts           # Core AI drafting logic
  /components
    TopNav.tsx              # Sticky navigation with About/Privacy links
    Footer.tsx              # Professional footer with commitments
    AddressForm.tsx         # Simple controlled input
    LocationStatus.tsx      # User feedback for address submission
    IssuePicker.tsx         # Dropdown topic selector with auto-detection + bill autocomplete
    OfficialCard.tsx        # Individual official with draft UI
    OfficialsList.tsx       # Manages drafts state for all officials
  /lib
    civic.ts                # Maps 5 Calls API → OfficialContact[]
    mailto.ts               # Generates mailto: URLs
    rateLimit.ts            # In-memory rate limiter
    schemas.ts              # Zod validation schemas (includes BillSchema, BillLevel)
    billVoting.ts           # Bill chamber detection + official voting eligibility **ENHANCED**
    legiscan.ts             # LegiScan API client for state bills
  page.tsx                  # Main page with state coordination + URL param handling
  layout.tsx                # Root layout with metadata and JSON-LD
  sitemap.ts                # Auto-generated sitemap.xml (includes /bills)
  robots.ts                 # Auto-generated robots.txt
  icon.svg                  # Favicon (capitol building)
  apple-icon.svg            # Apple touch icon
  opengraph-image.tsx       # Dynamic OG image generation
  twitter-image.tsx         # Twitter card image

/docs
  IMPACT_ANALYSIS.md        # Research: civic action vs protests
  ISSUE_TOPICS.md           # Issue selection methodology
  SEO.md                    # SEO optimization guide
  SESSION_SUMMARY.md        # Development session summaries (original)
  SESSION_SUMMARY_2025-10-19_PART2.md  # Bill explorer & topic selection session
  /strategy                 # Strategic planning documents
```

## Environment Variables

Required in `.env.local`:
- `OPENAI_API_KEY` - OpenAI API key (required for email drafting)
- `CONGRESS_API_KEY` - Congress.gov API key (optional for federal bill autocomplete)
- `LEGISCAN_API_KEY` - LegiScan API key (optional for state bill autocomplete)
- `APP_BASE_URL` - Base URL (optional, mainly for development)

**Note**: The 5 Calls API requires no authentication. Congress.gov and LegiScan APIs are optional—bill autocomplete will gracefully degrade if not provided.

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

**Congress.gov API** (`/api/bills/search/route.ts`):
- Public API endpoint: `https://api.congress.gov/v3/bill/{congress}`
- Requires free API key (5,000 requests/hour)
- Searches bills by number (e.g., "HR 1234") or title keywords (e.g., "climate")
- Enhanced query parameters:
  - `q` - Search query (bill number or keywords)
  - `type` - Bill type filter (hr, s, hjres, sjres, or 'all')
  - `limit` - Number of results (default: 10 for autocomplete, 200 for explorer)
  - `sort` - Sort order ('recent' or 'oldest')
- Returns: bill number, full title, truncated title, latest action status, date, type, congress
- **Used by**:
  - Homepage autocomplete (inline search)
  - Bill Explorer page (`/bills`) with advanced filtering
- **Auto-Topic Detection**: `mapBillTitleToTopic()` function in `IssuePicker.tsx` analyzes bill title and auto-selects topic from 10 predefined categories via keyword matching
- Debounced search (300ms) to reduce API calls
- 1-hour caching via Next.js revalidation
- Graceful degradation: feature is optional if API key not provided

**LegiScan API** (`/api/bills/search-state/route.ts`, `lib/legiscan.ts`):
- API endpoint: `https://api.legiscan.com`
- Requires free API key (register at legiscan.com/legiscan-register)
- **Rate Limits**: 30,000 requests/month (free tier) - much more generous than previous provider
- Covers all 50 states + DC + Puerto Rico + Congress
- Searches state legislature bills by query and jurisdiction
- Query parameters:
  - `key` - API key
  - `op` - Operation (getSearch, getBill, etc.)
  - `query` - Search query (bill number or keywords)
  - `state` - State abbreviation (e.g., "CA", "NY") - optional, pre-filtered to user's state
- Returns: bill identifier (e.g., "S03376", "A03420"), title, chamber, jurisdiction, session, sponsors, description, latest action
- **Bill Format Detection**: Automatically detects state bills by format (e.g., "NY S 3376")
  - Extracts state abbreviation, determines chamber (S/Senate vs A/H/Assembly/House)
  - Maps to full state name for jurisdiction matching
- **Normalized Response**: Converts LegiScan format to match federal bill structure for UI consistency
- **Unified Search**: Merged with federal bills in `IssuePicker.tsx`
  - State bills shown first (more relevant to user's location)
  - Federal bills shown second
  - Visual distinction via green "California" vs blue "Federal" badges
- **Voting Power Integration**: State bills matched to state legislators via jurisdiction
  - "NY S 3376" → only NY state legislators get "Can vote" badge
  - Prevents false matches (e.g., TX legislator on NY bill)
- Debounced search (300ms) to reduce API calls
- In-memory rate limiting (100 req/min)
- Graceful degradation: returns empty array with error message if API key not provided or rate limit exceeded
- **Reliability**: LegiScan is generally faster and more reliable than previous Open States API, with better rate limits

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
- Bill explorer shows 200 most recent bills (not all 19,315 in 118th Congress)
  - Search by specific bill number will still find any bill
  - Status filtering is client-side text analysis (not API-provided)
- No bill sponsors, vote tallies, or related bills displayed (planned for post-MVP)
- No analytics or tracking (planned for post-MVP)
- No phone script generation (planned for post-MVP)
- Limited to U.S. addresses (5 Calls API constraint)
- Federal + state coverage only (no local officials yet)
