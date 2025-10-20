# Civic Action MVP

**Empowering effective civic action through streamlined communication between constituents and their elected officials.**

🌐 **Live at: [takecivicaction.org](https://takecivicaction.org)**

A web app that makes it simple for citizens to contact their representatives with well-crafted, respectful messages. Enter an address, pick an issue, and get a ready-to-send email draft for every official from local to federal level—enabling meaningful dialogue that strengthens democracy.

## Features

### Core Functionality
- **Officials Lookup**: Find elected officials (state → federal) for any U.S. address using the 5 Calls API
- **Comprehensive Coverage**: Includes federal (House, Senate) and state (Governor, AG, Sec of State, legislators)
- **Bill Explorer**: Dedicated page to browse and search federal legislation with status filtering (active, enacted, passed house/senate, introduced), Load More pagination, and direct links to official bill text on Congress.gov
- **Research-Backed Issues**: Top 10 issues for young voters based on Harvard Youth Poll, Pew Research, and AP-NORC data
- **Smart Topic Selection**: Dropdown menu with intelligent auto-detection—select a bill and the topic is automatically filled based on bill content. "Other" option reveals a custom field only when needed
- **Bill Search & Autocomplete**: Search Congress.gov API for federal bills by number or title (e.g., "HR 1234" or "climate") with inline autocomplete or via dedicated Bill Explorer page
- **Seamless Bill Integration**: Select a bill from the explorer and return to homepage with bill number and topic pre-filled automatically
- **AI-Generated Drafts**: Get personalized, respectful email drafts using GPT-4o-mini
- **Contact Paths**: Direct links to email, phone, and official websites
- **Privacy-First**: No address storage, no auto-sending—users maintain full control

### Pages & Information
- **Homepage**: Address lookup, issue selection, officials list, and email drafting
- **Bill Explorer** (`/bills`): Browse and search federal legislation with filters and status tracking
- **About Page**: How it works, mission, research-backed impact data (CMF studies)
- **Privacy Policy**: Comprehensive transparency on data practices (we never store addresses or positions)

### Technical Features
- **Rate Limited**: Built-in protection (30 req/min for lookups, 15 req/min for AI)
- **SEO Optimized**: Sitemap, robots.txt, structured data (JSON-LD), optimized metadata
- **Mobile-First**: Responsive design, accessible (WCAG AA compliant)
- **Edge Runtime**: Fast, globally distributed via Vercel

## Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **APIs**:
  - 5 Calls API (officials lookup, no auth required)
  - Congress.gov API (bill autocomplete, free API key)
  - OpenAI GPT-4o-mini (email drafting)
- **Validation**: Zod
- **SEO**: Built-in sitemap, robots.txt, JSON-LD structured data
- **Deployment**: Vercel (Edge Runtime)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- OpenAI API key (required for email drafting)
- Congress.gov API key (optional for bill autocomplete)

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

**Congress.gov API (Optional - for bill autocomplete):**
1. Go to [Congress.gov API](https://api.congress.gov/sign-up/)
2. Sign up for a free API key (5,000 requests/hour)
3. Copy the key to `CONGRESS_API_KEY`

**Note:** The app will work without the Congress API key, but bill autocomplete won't be available.

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
    /reps/route.ts          # Officials lookup endpoint (5 Calls API)
    /ai/draft/route.ts      # Email draft generation endpoint (OpenAI)
    /bills/search/route.ts  # Bill search endpoint (Congress.gov API)
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
    mailto.ts               # mailto: URL builder
    rateLimit.ts            # In-memory rate limiter
    schemas.ts              # Zod validation schemas
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
   - `CONGRESS_API_KEY` (optional)
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
- [x] Bill search and autocomplete (Congress.gov API)
- [x] Bill Explorer page with status filtering and Load More
- [x] Smart topic selection dropdown with auto-detection
- [x] Seamless bill selection flow (explorer → homepage pre-fill)
- [x] Direct links to official bill text on Congress.gov
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
- [ ] **State Bills**: OpenStates API integration
- [ ] **Upstash Redis**: Production-grade rate limiting
- [ ] **Analytics**: Privacy-respecting usage metrics (Plausible)
- [ ] **Email Collection** (optional): For impact updates
- [ ] **Advanced Bill Context**: Full bill text, sponsors, vote history

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
