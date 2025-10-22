# Civic Action MVP

**Empowering effective civic action through streamlined communication between constituents and their elected officials.**

🌐 **Live at: [takecivicaction.org](https://takecivicaction.org)**

A web app that makes it simple for citizens to contact their representatives with well-crafted, respectful messages. Enter an address, pick an issue, and get a ready-to-send email draft for every official from local to federal level—enabling meaningful dialogue that strengthens democracy.

## Features

### Core Functionality
- **Officials Lookup**: Find elected officials (state → federal) for any U.S. address using the 5 Calls API
- **Comprehensive Coverage**: Includes federal (House, Senate) and state (Governor, AG, Sec of State, legislators)
- **Bill Explorer**: Browse and search **both federal and state legislation**
  - **Federal Bills**: Congress.gov API with status filtering (active, enacted, passed house/senate, introduced)
  - **State Bills**: Open States API covering all 50 states with search, pagination, and bill status
  - Load More pagination for extensive results
  - Direct links to official bill text on Congress.gov and OpenStates.org
- **Smart Voting Badges**: Automatically identifies which officials can directly vote on selected bills
  - Federal bills → highlights House Reps and Senators
  - State bills → highlights state legislators from the relevant state
  - Officials separated into "Can Vote" and "Can Advocate & Influence" sections
- **Research-Backed Issues**: Top 10 issues for young voters based on Harvard Youth Poll, Pew Research, and AP-NORC data
- **Smart Topic Selection**: Dropdown menu with intelligent auto-detection—select a bill and the topic is automatically filled based on bill content
- **Bill Search & Integration**: Search federal or state bills by number or keywords, then seamlessly return to homepage with bill info pre-filled
- **AI-Generated Drafts**: Get personalized, respectful email drafts using GPT-4o-mini
- **Web Form Contact Guide**: For officials without public email addresses
  - Auto-copy draft message to clipboard
  - Opens official's contact page in new tab
  - Step-by-step instructions for filling web forms
  - Visual toast notification confirming copy
- **Multiple Contact Methods**:
  - Email (direct mailto: links when available)
  - Web form guidance (with auto-copy)
  - Phone numbers with call links
  - Official website links
  - One-click copy-to-clipboard for all drafts
- **Privacy-First**: No address storage, no auto-sending—users maintain full control

### Pages & Information
- **Homepage**: Address lookup, issue selection, officials list, and email drafting
- **Bill Explorer** (`/bills`): Browse and search both federal and state legislation
  - Toggle between federal and state bills
  - State selector (defaults to user's state from address lookup)
  - Search by keywords or bill number
  - Status filtering and Load More pagination
- **About Page**: How it works, mission, research-backed impact data (CMF studies)
- **Privacy Policy**: Comprehensive transparency on data practices (we never store addresses or positions)

### Technical Features
- **Rate Limited & Cached**: Built-in protection with intelligent caching
  - Officials lookup: 30 req/min
  - AI drafting: 15 req/min
  - State bills: 100 req/min with 5-minute result caching
- **SEO Optimized**: Sitemap, robots.txt, structured data (JSON-LD), optimized metadata
- **Mobile-First**: Responsive design, accessible (WCAG AA compliant)
- **Edge Runtime**: Fast, globally distributed via Vercel

## Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **APIs**:
  - 5 Calls API (officials lookup, no auth required)
  - Congress.gov API (federal bills, free API key, 5,000 req/hr)
  - Open States API v3 (state bills, free API key, 500 req/day)
  - OpenAI GPT-4o-mini (email drafting)
- **Validation**: Zod
- **SEO**: Built-in sitemap, robots.txt, JSON-LD structured data
- **Deployment**: Vercel (Edge Runtime)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- OpenAI API key (required for email drafting)
- Congress.gov API key (optional for federal bill search)
- Open States API key (optional for state bill search)

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

**OpenAI API (Required):**
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Copy the key to `OPENAI_API_KEY`

**Congress.gov API (Optional - for federal bill search):**
1. Go to [Congress.gov API](https://api.congress.gov/sign-up/)
2. Sign up for a free API key (5,000 requests/hour)
3. Copy the key to `CONGRESS_API_KEY`

**Open States API (Optional - for state bill search):**
1. Go to [Open States API](https://openstates.org/api/register/)
2. Register for a free API key (500 requests/day)
3. Copy the key to `OPENSTATES_API_KEY`

**Note:** The app will work without the bill search API keys, but you won't be able to browse federal or state legislation.

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
  /about
    page.tsx                # About page (How It Works)
  /bills
    page.tsx                # Bill Explorer page with search/filters
    layout.tsx              # SEO metadata for bill explorer
  /privacy
    page.tsx                # Privacy Policy page
  /api
    /reps/route.ts                        # Officials lookup endpoint (5 Calls API)
    /ai/draft/route.ts                    # Email draft generation endpoint (OpenAI)
    /bills/search/route.ts                # Federal bill search (Congress.gov API)
    /bills/search-state/route.ts          # State bill search (Open States API)
    /bills/[congress]/[type]/[number]     # Federal bill details endpoint
  /actions
    draftEmail.ts           # Server action for OpenAI calls
  /components
    TopNav.tsx              # Sticky navigation with About/Privacy links
    Footer.tsx              # Professional footer with commitments
    AddressForm.tsx         # Address input
    LocationStatus.tsx      # Address submission feedback
    IssuePicker.tsx         # Issue & stance selection with dropdown + auto-topic detection
    OfficialCard.tsx        # Single official display
    OfficialsList.tsx       # Officials grid with draft management
  /lib
    civic.ts                # 5 Calls API response mapper
    openstates.ts           # Open States API client with caching
    billVoting.ts           # Bill voting logic (who can vote on what)
    mailto.ts               # mailto: URL builder
    rateLimit.ts            # In-memory rate limiter
    schemas.ts              # Zod validation schemas
    sessionStorage.ts       # Client-side session persistence
  page.tsx                  # Main page
  layout.tsx                # Root layout with metadata and JSON-LD
  sitemap.ts                # Auto-generated sitemap.xml
  robots.ts                 # Auto-generated robots.txt
  icon.svg                  # Favicon (capitol building)
  apple-icon.svg            # Apple touch icon
  opengraph-image.tsx       # Social media preview image
  twitter-image.tsx         # Twitter card image

/docs
  IMPACT_ANALYSIS.md        # Research on civic action vs protests
  ISSUE_TOPICS.md           # Issue topic selection methodology
  SEO.md                    # SEO optimization guide
  SESSION_SUMMARY.md        # Development session summaries (original)
  SESSION_SUMMARY_2025-10-19_PART2.md  # Bill explorer & topic selection session
  /strategy                 # Strategic planning documents
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `OPENAI_API_KEY` (required)
   - `CONGRESS_API_KEY` (optional, for federal bills)
   - `OPENSTATES_API_KEY` (optional, for state bills)
4. Deploy

The app uses Edge Runtime for all API routes, making it fast and globally distributed.

### Post-Deployment SEO

1. Submit sitemap to [Google Search Console](https://search.google.com/search-console)
   - Add property: `https://yourdomain.com`
   - Submit sitemap: `https://yourdomain.com/sitemap.xml`
2. Submit to [Bing Webmaster Tools](https://www.bing.com/webmasters)
3. Monitor indexing and keyword rankings

## Roadmap

### ✅ Completed (Production)
- [x] Officials lookup (5 Calls API)
- [x] AI email drafting (OpenAI)
- [x] **Federal Bills**: Congress.gov API integration
  - [x] Bill search and autocomplete
  - [x] Bill Explorer page with status filtering
  - [x] Load More pagination
  - [x] Direct links to Congress.gov
- [x] **State Bills**: Open States API v3 integration
  - [x] Search across all 50 states
  - [x] State-specific filtering
  - [x] Pagination and caching (5-min TTL)
  - [x] Direct links to OpenStates.org
- [x] **Smart Voting Logic**:
  - [x] "Can Vote" badges for eligible officials
  - [x] Officials separated by voting eligibility
  - [x] Federal/state bill detection
- [x] **Web Form Contact Guide**:
  - [x] Auto-copy draft to clipboard
  - [x] Opens contact form in new tab
  - [x] Step-by-step instructions
  - [x] Toast notifications
- [x] **UX Enhancements**:
  - [x] One-click copy-to-clipboard button
  - [x] Smart topic selection with auto-detection
  - [x] Seamless bill selection flow (explorer → homepage)
  - [x] Session persistence for address lookup
- [x] About and Privacy pages
- [x] SEO optimization (sitemap, robots.txt, structured data)
- [x] Research-backed issue topics
- [x] Mobile-responsive design
- [x] Professional navigation and footer

### 🔄 In Progress
- [ ] Submit to search consoles
- [ ] Monitor initial SEO performance
- [ ] Gather user feedback

### 📋 Planned (Post-MVP)
- [ ] **Phone Scripts**: Generate 30-second call scripts
- [ ] **Action Tracking**: "I sent it" button to measure impact
- [ ] **Blog/Content**: Educational content for SEO
- [ ] **Upstash Redis**: Production-grade rate limiting
- [ ] **Analytics**: Privacy-respecting usage metrics (Plausible)
- [ ] **Email Collection** (optional): For impact updates
- [ ] **Advanced Bill Context**: Full bill text, sponsors, vote history
- [ ] **Automated Web Form Filling**: Browser extension or automation

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
