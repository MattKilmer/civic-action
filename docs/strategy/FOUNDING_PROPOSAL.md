# Civic Action: Founding Proposal

**Making Civic Engagement Accessible Through AI**

*Executive Summary for Co-Founders and Advisors*
*Updated: January 2026*

---

## The Opportunity

**Problem**: 71% of Americans want to contact their representatives, but only 22% do. The barrier isn't apathy—it's friction. Citizens don't know who represents them, how to reach them, or what to say.

**Our Solution**: Civic Action removes all barriers. Enter your address, select your issue, and receive AI-drafted letters to every elected official from local to federal—with their actual contact information. One click sends professional, personalized advocacy.

**Why Now**:
- AI makes personalized civic communication possible at scale for the first time
- Political polarization has driven record civic interest (2024 election: highest turnout in 120 years)
- Google Civic API shutdown (April 2025) created market gap we're filling
- Trust in civic tech requires nonprofit structure—we're positioned perfectly

---

## Vision & Mission

### 10-Year Vision
By 2036, Civic Action is the default civic engagement platform in America:
- **50 million active users** (15% of U.S. population)
- **500 million constituent contacts** delivered to elected officials
- **Measurable policy impact** through aggregated sentiment analysis shared with policymakers
- **Hybrid organization**: 501(c)(3) parent + sustainable revenue streams
- **Gold standard** for AI-powered civic tools trusted across the political spectrum

### Mission Statement
Civic Action empowers every American to make their voice heard by their elected representatives through accessible, AI-powered communication tools that preserve democracy and civic participation for future generations.

### Core Values
1. **Nonpartisan**: We serve all Americans regardless of political affiliation
2. **Privacy-First**: We never store addresses, political positions, or communication content
3. **Transparency**: Open-source core technology, public impact metrics
4. **Accessibility**: Free for individual citizens, always
5. **Quality**: AI-drafted communications are respectful, factual, and effective

---

## Why Nonprofit Structure

### The Strategic Case

**Mission Lock**: 501(c)(3) structure ensures civic mission can never be compromised by investor pressure or acquisition. This tool is too important to democracy to risk commercial exploitation.

**User Trust**: Citizens sharing their political positions and addresses require absolute trust. Nonprofit status signals we'll never sell their data or manipulate their advocacy for profit.

**Foundation Funding**: Access to $300K-$500K in early funding from:
- Knight Foundation (democracy tech track record)
- MacArthur Foundation (civic engagement focus)
- Democracy Fund (direct precedent: Resistbot, 5 Calls)
- Mozilla Foundation (open-source civic tech)

**Government Partnerships**: State and local governments prefer nonprofit partners for civic tools. Opens doors to:
- Integration with official government websites
- Voter registration system partnerships
- Government contracts for civic education programs

**Volunteer & Community Power**: Nonprofits attract passionate volunteers, academic researchers, and community partnerships that for-profits cannot. This is a force multiplier for impact.

### The Hybrid Model Path (Years 4-5)

We're starting as pure 501(c)(3), but following Mozilla/NPR precedent with optional for-profit subsidiary at scale:

**Nonprofit (Parent) - Always Free**:
- Individual citizen tools
- Core open-source platform
- Public policy research & impact metrics
- Civic education programs

**For-Profit (Subsidiary) - Premium B2B**:
- Enterprise advocacy campaign management for nonprofits/advocacy groups
- White-label civic engagement platform licensing
- Advanced analytics & sentiment tracking for organizations
- Bulk communication tools for membership organizations

This structure preserves mission while creating sustainability. Decision point: Year 3 board review.

---

## Product & Technology

### Current Status (January 2026)

**Working MVP**:
- ✅ Address-to-officials lookup (temporarily using mock data)
- ✅ AI email draft generation (OpenAI GPT-4o-mini)
- ✅ Issue selection with stance and personal impact
- ✅ Direct contact integration (mailto: links, phone numbers)
- ✅ Edge runtime for global distribution
- ✅ Privacy-first (zero data storage)

**Tech Stack**:
- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes, Edge Runtime
- **AI**: OpenAI GPT-4o-mini (150-220 word letters, enforced civil tone)
- **Validation**: Zod schemas for all inputs
- **APIs**: Migrating to 5 Calls API (free, nonprofit-focused)

**What's Working**:
- AI letter generation is production-ready (tested, validated, excellent quality)
- UI/UX is clean, simple, accessible
- Performance is excellent (edge deployment)
- Privacy model is bulletproof (stateless architecture)

**What Needs Work**:
- Replace Google Civic API (shut down April 2025) with 5 Calls or Cicero
- Add phone script generation (same AI approach)
- Build impact tracking (aggregate anonymized data)
- Add bill context fetching (OpenStates API)

### 12-Month Product Roadmap

**Q1 2026 (Months 1-3): Foundation**
- Integrate 5 Calls API for officials lookup
- Add phone script generation
- Build analytics dashboard (anonymized aggregate data)
- Launch beta with 100 power users
- Set up monitoring, error tracking, uptime
- **Milestone**: 500 letters/calls generated

**Q2 2026 (Months 4-6): Growth**
- Add bill context (OpenStates API integration)
- Build impact visualization (heat maps of constituent contacts by district)
- Add social sharing ("I just contacted my representative about climate change")
- Partner with 3-5 advocacy organizations for co-promotion
- Launch public v1.0
- **Milestone**: 5,000 monthly active users, 25,000 contacts delivered

**Q3 2026 (Months 7-9): Expansion**
- Add legislative tracking (bill status updates)
- Build email/SMS notification system (opt-in)
- Add community features (issue trending, impact leaderboards)
- Launch mobile-optimized PWA
- Expand to state/local issue templates
- **Milestone**: 25,000 monthly active users

**Q4 2026 (Months 10-12): Partnerships**
- Partner with voter registration platforms
- Integrate with nonprofit CRM systems (Action Network, EveryAction)
- Add API for third-party integrations
- Launch research partnership with academic institutions
- Build policy impact reports (share aggregated sentiment with officials)
- **Milestone**: 50,000 monthly active users, 250,000+ contacts delivered in Year 1

### Technology Philosophy

**Open Source Core**: We'll open-source the core platform (MIT license) to:
- Build trust through transparency
- Enable academic research
- Allow advocacy groups to self-host if needed
- Attract technical volunteers and contributors

**Privacy by Design**: Stateless architecture means:
- No database of user addresses or political positions
- No tracking or analytics cookies
- No data to breach, sell, or subpoena
- Users can verify privacy through open-source code

**AI Safety & Quality**:
- All AI outputs are reviewed by users before sending
- System prompts enforce civil, factual communication
- No fabrication of bill numbers or policy details
- Temperature tuning (0.3) for consistency
- Continuous prompt engineering based on feedback

---

## Market Analysis

### Target Addressable Market

**Primary Market: Engaged Citizens**
- 158M Americans voted in 2024 (highest turnout percentage in 120 years)
- 71% want to contact representatives but only 22% do
- **Reachable market**: ~112M engaged citizens who aren't currently contacting officials
- If we capture just 1% in Year 3: 1.1M active users

**Secondary Market: Advocacy Organizations**
- 1.5M nonprofits in the U.S.
- Tens of thousands focus on advocacy and civic engagement
- Current tools: 5 Calls, Resistbot, Countable (all have limitations)
- Many would partner for co-promotion or integration

**Tertiary Market: Educational Institutions**
- 4,000+ colleges and universities
- Civic education programs seeking digital tools
- K-12 social studies curriculum integration potential

### Competitive Landscape

| Tool | Strength | Limitation | Our Advantage |
|------|----------|------------|---------------|
| **5 Calls** | Great issue scripts | No AI personalization, pre-written scripts only | AI drafts custom letters based on user's personal story |
| **Resistbot** | SMS convenience, 3M+ users | Basic templating, limited customization | Full AI personalization + better official data |
| **Countable** | Bill tracking | Focused on federal only, commercialized | Local to federal + nonprofit trust |
| **Town Hall Project** | Event tracking | No communication tools | We enable action, not just awareness |
| **Democracy.io** | Simple fax/email | Shut down (unsustainable) | Better tech stack + sustainable nonprofit model |

**Key Differentiators**:
1. **AI Personalization**: Only tool using AI to draft from personal stories
2. **Comprehensive Coverage**: Local, state, and federal in one place
3. **Nonprofit Trust**: No ads, no data selling, mission-locked
4. **Open Source**: Transparent, verifiable, forkable
5. **Modern Tech**: Edge deployment, fast, mobile-first

### Market Validation

**Proven Demand**:
- Resistbot: 3M+ users, 20M+ letters delivered (since 2017)
- 5 Calls: Sustained usage since 2016, active community
- 2024 election: Record civic engagement metrics

**Timing Factors**:
- Google Civic API shutdown created immediate gap
- AI capabilities now make personalization possible
- Trust in institutions low → nonprofit structure is advantage
- Political engagement at generational high

---

## Business Model & Financial Projections

### Revenue Model (Nonprofit-First)

**Years 1-3: Pure Nonprofit (100% Foundation Funded)**

**Revenue Streams**:
1. **Foundation Grants** (Primary: 70-80%)
   - Democracy Fund, Knight Foundation, MacArthur, Mozilla
   - Target: $300K-$500K over first 2 years

2. **Individual Donations** (15-20%)
   - In-app donation prompts (optional, no gate-keeping)
   - Target: $50K-$100K/year at scale

3. **Government Contracts** (5-10%)
   - Civic education programs with state/local governments
   - Target: $25K-$75K/year starting Year 2

**Years 4-5: Hybrid Model Evaluation**

**Option A: Add For-Profit Subsidiary**
- Enterprise tools for advocacy organizations ($2-10K/month)
- White-label platform licensing ($25-100K/year per client)
- API access for commercial integrations ($500-5K/month)
- Target additional revenue: $500K-$1.5M/year by Year 5

**Option B: Remain Pure Nonprofit**
- Scale foundation funding ($750K-$1.5M/year)
- Grow individual donation base ($200-500K/year)
- Expand government contracts ($100-300K/year)
- Target total budget: $1.5-$2.5M/year by Year 5

Board decides based on mission impact vs. sustainability needs.

### 5-Year Financial Projections (Conservative)

**Year 1 (2026)**
- Foundation grants: $200K
- Individual donations: $20K
- **Total: $220K**
- Team: 2 co-founders (deferred salary), 5 volunteers
- Burn: $180K (salaries: $120K total, infrastructure: $20K, legal/admin: $40K)
- Users: 50K

**Year 2 (2027)**
- Foundation grants: $300K
- Individual donations: $75K
- Government contracts: $25K
- **Total: $400K**
- Team: 2 full-time, 1 part-time developer, 10 volunteers
- Burn: $360K (salaries: $260K, infrastructure: $40K, programs: $60K)
- Users: 200K

**Year 3 (2028)**
- Foundation grants: $400K
- Individual donations: $150K
- Government contracts: $100K
- **Total: $650K**
- Team: 4 full-time, 15 volunteers
- Burn: $600K (salaries: $400K, infrastructure: $80K, programs: $120K)
- Users: 750K
- **Decision Point**: Evaluate hybrid model

**Year 4 (2029) - Hybrid Model Path**
- Foundation grants: $500K
- Individual donations: $250K
- Government contracts: $150K
- For-profit subsidiary revenue: $400K (enterprise customers)
- **Total: $1.3M**
- Team: 6 full-time, 2 contractors
- Burn: $1.2M
- Users: 2M

**Year 5 (2030)**
- Foundation grants: $600K
- Individual donations: $400K
- Government contracts: $200K
- For-profit subsidiary revenue: $1M
- **Total: $2.2M**
- Team: 10 full-time, 5 contractors
- Burn: $2M (healthy surplus for reserves)
- Users: 4M
- Impact: 50M+ constituent contacts delivered (cumulative)

### Unit Economics (Year 3)

**Cost Per Active User**:
- Infrastructure (OpenAI API, hosting): $0.12 per user/month
- Support & moderation: $0.05 per user/month
- **Total variable cost**: $0.17 per user/month

**Average Revenue Per User**:
- Donations (2% donate avg $25/year): $0.04 per user/month
- Foundation funding (allocated per user): $0.44 per user/month
- **Total revenue**: $0.48 per user/month

**Unit Margin**: $0.31 per user/month (healthy for nonprofit)

At 750K users in Year 3: $2.79M annual value created vs $650K budget = 4.3x impact efficiency

---

## Impact Metrics & Theory of Change

### How We Measure Success

**Tier 1: Output Metrics**
- Monthly active users
- Letters/calls generated
- Officials contacted
- Geographic coverage (% of U.S. districts reached)

**Tier 2: Outcome Metrics**
- User retention (repeat contact rate)
- Issue diversity (breadth of topics)
- Response rate from officials (track via user surveys)
- Media mentions & coverage
- Partnership growth (advocacy orgs using our tools)

**Tier 3: Impact Metrics**
- Policy changes influenced (case studies)
- Aggregate sentiment shared with officials (data products)
- Civic education outcomes (knowledge gain in student users)
- Community building (user forums, volunteer contributions)

**Tier 4: Long-Term Systemic Change**
- Shift in civic participation rates (compared to national averages)
- Changes in representative responsiveness (longitudinal studies)
- Academic research enabled by our platform
- Normative change: "contacting representatives" becomes culturally expected

### Theory of Change

**If** we remove all friction from civic communication (address lookup, contact info, AI-drafted letters),

**Then** more citizens will contact their representatives regularly,

**Because** the barriers are logistical (not motivational),

**Leading to**:
1. Officials receive more constituent input
2. Policy decisions better reflect constituent needs
3. Citizens feel more heard and engaged
4. Democracy becomes more representative and responsive

**Long-term outcome**: Healthier democratic institutions with higher trust and participation.

### Research & Validation

**Academic Partnerships** (Years 2-3):
- Stanford Digital Democracy Lab (test effectiveness of AI-drafted vs template letters)
- Harvard Ash Center (measure impact on official responsiveness)
- MIT Media Lab (study AI ethics in civic communication)

**Open Data Commitments**:
- Publish anonymized aggregate data quarterly
- Annual impact reports with transparent methodology
- Open API for researchers (IRB-approved access)

---

## Team & Governance

### Current Team

**Matt Kilmer** (Founding Team)
- Role: Product & Strategy
- Background: [To be filled in]
- Commitment: Full-time, deferred salary Year 1

**[Open Position]: Technical Co-Founder**
- Role: CTO, lead engineering
- Required skills: Full-stack TypeScript/React, AI integration, API design
- Desired: Civic tech passion, open-source contributions, startup experience
- Commitment: Full-time, deferred salary Year 1, 50/50 equity split

### Equity Structure (Nonprofit Membership Model)

501(c)(3) nonprofits don't have traditional equity, but we'll structure founding team control through:

**Board of Directors**:
- 5-7 members
- 2 seats reserved for co-founders (permanent)
- 2 seats for mission-aligned advisors
- 1 seat for major foundation funder representative
- 2 seats for community/user representatives (elected by users at scale)

**Membership Classes**:
- Founding members (co-founders): voting rights, permanent board seats
- Contributing members (major donors/volunteers): advisory voting
- Community members (users): representation through elected board seats

**If For-Profit Subsidiary Launches (Year 4-5)**:
- Nonprofit owns 100% of subsidiary
- Co-founders receive deferred compensation structure tied to subsidiary revenue
- Incentive alignment: 10-15% of subsidiary profits distributed to founding team
- Example: If subsidiary generates $1M profit in Year 5, co-founders split $100-150K bonus

### Hiring Plan

**Year 1**:
- 2 co-founders (full-time)
- 5-10 volunteer developers (open-source contributors)
- 1 part-time community manager (volunteer → paid at $200K funding)

**Year 2** (at $400K budget):
- Hire 1 full-time software engineer ($100K)
- Hire 1 part-time operations/grants manager ($40K)
- Expand volunteer team to 15-20

**Year 3** (at $650K budget):
- Hire 1 designer/UX researcher ($90K)
- Hire 1 policy/partnerships lead ($85K)
- Hire 1 additional engineer ($100K)
- Total team: 6 paid + 20+ volunteers

**Compensation Philosophy**:
- Fair nonprofit salaries (50-70th percentile for civic tech)
- Co-founders take below-market Year 1-2, market rate Year 3+
- Remote-first, flexible schedules
- Mission-driven culture, generous time off
- Professional development budgets

### Advisory Board

**Target Advisors** (to recruit):
1. **Civic Tech Expert**: Former leadership from Code for America, Resistbot, or 5 Calls
2. **Foundation Relations**: Someone with track record securing Knight/MacArthur/Democracy Fund grants
3. **AI Ethics**: Academic or industry expert in responsible AI (Stanford HAI, Partnership on AI)
4. **Legal/Governance**: Nonprofit attorney specializing in 501(c)(3) structures
5. **Policy Expert**: Former congressional staffer or state legislator who understands constituent communications

**Advisor Compensation**:
- 0.5-1% advisory shares (if for-profit subsidiary launches)
- Or: $2-5K/year stipend (starting Year 3)
- Quarterly meetings, ongoing strategic guidance

---

## Go-to-Market Strategy

### Phase 1: Beta Launch (Q1 2026)

**Target**: 100 power users in 90 days

**Channels**:
1. **Direct outreach** to existing civic engagement communities:
   - Indivisible local chapters (6,000+ groups)
   - Swing Left volunteers
   - 5 Calls and Resistbot user forums

2. **Partnership launches**:
   - Co-promotion with 2-3 advocacy nonprofits
   - Joint webinar series: "How to contact your representatives effectively"

3. **Press outreach**:
   - Pitch to TechCrunch, Fast Company, Wired (civic tech angle)
   - Democracy-focused media: Democracy Docket, Civics Center newsletter

**Success Metrics**: 100 users, 500 letters generated, <5% error rate, 80%+ satisfaction

### Phase 2: Public Launch (Q2 2026)

**Target**: 5,000 monthly active users by end of Q2

**Channels**:
1. **Organic**:
   - Product Hunt launch
   - Hacker News post (open-source civic tech)
   - Reddit (r/politics, r/civic_tech, state/city subreddits)

2. **Partnerships**:
   - Integrate with voter registration platforms (TurboVote, Rock the Vote)
   - Partner with university civic engagement programs
   - Cross-promotion with complementary tools (Town Hall Project, Ballotpedia)

3. **Content Marketing**:
   - Blog: "How to effectively contact your representatives"
   - Case studies: "This citizen's letter led to X policy change"
   - Press coverage in democracy/civic engagement outlets

**Success Metrics**: 5,000 MAU, 25,000 letters sent, 10+ media mentions, 3+ active partnerships

### Phase 3: Growth (Q3-Q4 2026)

**Target**: 50,000 monthly active users by end of Year 1

**Channels**:
1. **Viral Mechanics**:
   - Social sharing: "I just contacted my representative about climate change—you can too"
   - Referral program: "Invite friends to amplify your issue"
   - Impact visualization: "See how many people in your district contacted officials this week"

2. **Paid Acquisition** (if foundation grants allow):
   - Facebook/Instagram ads targeting civic engagement interests ($10K test budget)
   - Google Ads for issue-based searches ("contact representative about housing")

3. **Events & Community**:
   - Virtual town halls on trending issues
   - Community calls: "Monthly civic action roundup"
   - User success stories featured on homepage

**Success Metrics**: 50,000 MAU, 250K+ letters sent, 25+ media features, 10+ active org partnerships

### Partnership Strategy

**Tier 1: Co-Promotion Partners** (Year 1)
- 5 Calls, Resistbot, Countable (non-competitive features)
- Voter registration platforms (TurboVote, Rock the Vote)
- Issue-specific advocacy groups (climate, healthcare, immigration)

**Tier 2: Integration Partners** (Year 2)
- CRM systems for nonprofits (Action Network, EveryAction)
- University civic engagement programs
- Local journalism platforms (link to relevant bill coverage)

**Tier 3: Research Partners** (Year 2-3)
- Stanford, Harvard, MIT civic tech labs
- Democracy research organizations (Brennan Center, Protect Democracy)

---

## Funding Strategy

### Year 1 Funding Plan (Target: $220K)

**Q1 2026** (Immediate):
- **Personal investment**: $20K from co-founders (deferred salary equivalent)
- **Friends & family**: $30K from personal networks
- **Fiscal sponsorship**: Apply to Code for America, Tech Soup (provides 501(c)(3) status while incorporating)
- **Total secured**: $50K to start

**Q2 2026**:
- **Foundation grants** (apply in Q1, receive Q2):
  - Democracy Fund ($50K) - "Technology & Civic Participation" program
  - Knight Foundation ($75K) - "Informed & Engaged Communities" track
  - Mozilla Foundation ($50K) - "Open Source Civic Tech" grants
- **Target**: $175K additional ($225K total for Year 1)

**Q3-Q4 2026**:
- Launch individual donation functionality
- Target: $20K from users by end of Year 1

### Years 2-3 Funding Pipeline

**Major Foundation Grants** (build relationships in Year 1, apply in Year 2):
- MacArthur Foundation ($100-200K over 2 years)
- Carnegie Corporation ($150K)
- Omidyar Network ($200K)
- Google.org ($100K)

**Government Contracts** (starting Year 2):
- State civic education programs ($25-50K/year)
- County voter engagement partnerships ($10-25K each)

**Earned Revenue** (starting Year 2):
- Workshops for advocacy organizations ($2-5K per workshop)
- API licensing to research institutions ($5-10K/year)

### Foundation Application Timeline

**January 2026**:
- Submit Democracy Fund LOI (rolling applications)
- Submit Knight Foundation grant (deadline Feb 1)
- Submit Mozilla Foundation application (deadline Jan 31)

**March 2026**:
- Submit MacArthur Foundation LOI (deadline March 15)
- Submit Omidyar Network application (rolling)

**May 2026**:
- Submit Carnegie Corporation (deadline May 30)
- Submit Google.org (rolling)

**Requirements for Applications**:
- 501(c)(3) status (via fiscal sponsor initially, then independent)
- Working product demo (MVP ready by January)
- Impact metrics from beta (need 100 users by February)
- Clear theory of change (documented in this proposal)
- Budget and financial projections (included here)
- Advisory board commitments (recruit 2-3 advisors by March)

---

## Legal & Incorporation

### Entity Structure

**Phase 1: Fiscal Sponsorship (Q1 2026)**
- Partner with established 501(c)(3) fiscal sponsor:
  - **Code for America** (top choice - civic tech focus)
  - Or: Tech Soup, Fractured Atlas, Open Collective Foundation
- Benefits: Immediate 501(c)(3) status, accept tax-deductible donations, apply for grants
- Cost: 5-10% of funds raised
- Timeline: 2-4 weeks to establish

**Phase 2: Independent 501(c)(3) (Q3 2026)**
- Incorporate in Delaware (nonprofit standard)
- File IRS Form 1023-EZ (streamlined for orgs expecting <$50K revenue)
- Timeline: 3-6 months for IRS approval
- Cost: $2K in legal fees + $275 IRS filing fee
- Transition from fiscal sponsor to independent org

### Intellectual Property

**Open Source Strategy**:
- Core platform: MIT License (most permissive)
- Allows anyone to use, modify, fork
- Builds trust, enables research, attracts contributors

**Trademark Protection**:
- Register "Civic Action" trademark for software/services
- Prevents commercial exploitation of brand
- Cost: $500-1K for registration

**AI Training Data**:
- We do NOT train on user inputs (privacy commitment)
- OpenAI's data usage policy: API inputs not used for training by default
- Document this clearly in privacy policy

### Compliance & Governance

**Required Policies** (by end of Q1 2026):
- Privacy policy (GDPR-compliant even though U.S.-focused)
- Terms of service
- Acceptable use policy (no spam, harassment)
- Conflict of interest policy (board members)
- Whistleblower policy (required for 501(c)(3))

**Annual Requirements**:
- IRS Form 990 (annual tax return for nonprofits)
- State charitable solicitation registration (varies by state)
- Annual board meeting minutes
- Financial audit (required at $1M+ budget or by some foundations)

**Insurance**:
- Directors & Officers (D&O) insurance: $2-3K/year
- General liability: $1-2K/year
- Cyber liability: $2-3K/year (important for AI/data tool)

---

## Risks & Mitigation

### Technical Risks

**Risk: AI outputs are low quality or harmful**
- *Mitigation*:
  - Extensive prompt engineering and testing (already done)
  - User review before sending (mandatory)
  - Feedback loop to improve prompts
  - Temperature tuning (0.3 = consistent, safe)
  - Content moderation for hate speech/harassment

**Risk: API dependencies (OpenAI, 5 Calls) change pricing or shut down**
- *Mitigation*:
  - Abstraction layer allows swapping providers
  - Budget buffer for API cost increases
  - Open-source alternative models as backup (Llama, Mixtral)
  - 5 Calls is nonprofit with similar mission (aligned incentives)

**Risk: Scaling costs exceed projections**
- *Mitigation*:
  - Edge caching reduces API calls
  - Rate limiting prevents abuse
  - Tiered processing (free users get slightly slower responses)
  - Monitor unit economics monthly

### Market Risks

**Risk: Low user adoption**
- *Mitigation*:
  - Strong competitive validation (Resistbot's 3M users)
  - Partnership-driven growth (not solely organic)
  - Multiple acquisition channels tested early
  - Pivot to B2B (advocacy orgs) if B2C stalls

**Risk: Existing tools copy our features**
- *Mitigation*:
  - Open-source strategy means copying is expected/encouraged
  - Compete on execution, UX, trust, and brand
  - Nonprofit structure is competitive moat (can't be easily replicated)
  - Network effects from partnerships

**Risk: Political polarization makes bipartisan tool hard to build**
- *Mitigation*:
  - Strict nonpartisan positioning from day one
  - Serve users across political spectrum equally
  - Never take positions on issues (just enable communication)
  - Advisory board with diverse political representation

### Financial Risks

**Risk: Foundation grants don't materialize**
- *Mitigation*:
  - Apply to 10+ foundations (need 2-3 to hit target)
  - Strong precedent: Democracy Fund, Knight, Mozilla all fund civic tech
  - Diversify: government contracts, donations, earned revenue
  - Co-founders can self-fund at ramen profitability for 6-12 months if needed

**Risk: For-profit subsidiary creates mission drift**
- *Mitigation*:
  - Don't launch subsidiary unless nonprofit board approves (majority vote)
  - Subsidiary always owned 100% by nonprofit (control preserved)
  - Clear firewalls: enterprise features never impact free tier
  - Annual mission alignment audits

### Regulatory & Legal Risks

**Risk: Lobbying restrictions for 501(c)(3)**
- *Context*: 501(c)(3) nonprofits can't do substantial lobbying (>20% of activities)
- *Mitigation*:
  - We're not lobbying—we're enabling constituent communications (explicitly allowed)
  - Legal review of positioning and messaging
  - Track activities to ensure <5% could be construed as lobbying

**Risk: Data privacy regulations (state laws, potential federal law)**
- *Mitigation*:
  - Our stateless architecture is advantage (no data to regulate)
  - Privacy-by-design from day one
  - Legal review of terms/privacy policy
  - Monitor regulatory landscape and adapt

**Risk: AI regulation (potential licensing, auditing requirements)**
- *Mitigation*:
  - We use third-party API (OpenAI), not building models
  - Transparency through open-source code
  - Academic partnerships for third-party audits
  - Join AI civic tech working groups to shape policy

### Reputational Risks

**Risk: Tool is used for spam or harassment campaigns**
- *Mitigation*:
  - Rate limiting (15 AI drafts per hour per user)
  - Content moderation (flag hate speech, threats)
  - Acceptable use policy with enforcement
  - Revoke access for abusers (IP bans, browser fingerprinting)

**Risk: AI generates factually incorrect or embarrassing content**
- *Mitigation*:
  - User reviews all content before sending (we're a drafting tool, not auto-send)
  - Prompt engineering prevents fabrication
  - Disclaimer: "Review for accuracy before sending"
  - Feedback mechanism to report bad outputs

**Risk: Perceived as partisan despite nonpartisan positioning**
- *Mitigation*:
  - Track usage across political spectrum (show balanced user base)
  - Never feature specific issues/stances on homepage
  - Diverse advisory board
  - Testimonials from both sides of aisle

---

## Why Join as Co-Founder

### The Mission Case

**This is democracy infrastructure**. Contacting representatives is a fundamental democratic act, but it's been gatekept by complexity. We're removing that barrier for millions of Americans. This isn't a feature—it's a public good.

**Proven demand, perfect timing**:
- 112M engaged Americans who want to contact reps but don't (proven market)
- Google Civic API shutdown created vacuum we're filling
- AI makes personalization possible for first time
- Political moment demands better civic tools

**Outsized impact potential**:
- By Year 5: 4M users, 50M contacts delivered
- By Year 10: 50M users, 500M contacts delivered
- Measurable influence on policy through aggregated constituent data
- Become civic infrastructure (like voter registration tools)

### The Personal Case

**Build something that matters**:
- Your work will directly strengthen democracy
- Every user is a citizen who feels heard
- Tangible policy impact (not abstract engagement metrics)

**Technical excellence meets purpose**:
- Cutting-edge AI applied to civic good
- Interesting technical challenges (scaling, privacy, AI safety)
- Open-source contributions that outlive the organization

**Mission-aligned team**:
- Co-founders who prioritize impact over exits
- Nonprofit structure means no investor pressure
- Culture of transparency, collaboration, public service

### The Practical Case

**Competitive compensation (by Year 3)**:
- Market-rate salaries once funded ($120-150K for senior engineers in civic tech)
- If for-profit subsidiary launches: profit-sharing (10-15% of profits to founding team)
- Health insurance, retirement matching, generous time off

**Equity-like upside**:
- Permanent board seats (governance control)
- Deferred compensation tied to subsidiary revenue (if launched)
- Example: $1M subsidiary profit in Year 5 = $100-150K bonus to co-founders

**Career acceleration**:
- High-profile role: founding CTO of democracy infrastructure
- Visible open-source contributions
- Speaking opportunities (civic tech conferences, academic talks)
- Strong network in civic tech, philanthropy, and policy

**Flexibility & autonomy**:
- Remote-first (work from anywhere)
- Significant technical decision-making authority
- Build the team and culture you want
- Set your own schedule (outcomes over hours)

### The Growth Case

**If this works, the opportunities compound**:
- Year 3: Evaluate for-profit subsidiary (significant revenue potential)
- Year 5: Potentially $2M+ organization with national impact
- Year 10: Could become essential civic infrastructure (Ballotpedia-level recognition)

**Even if it doesn't scale massively, success looks like**:
- 100K+ users empowered to participate in democracy
- Open-source civic tool that outlives the organization
- Strong relationships with foundations, policymakers, civic tech leaders
- Meaningful work with sustainable nonprofit salaries

**This is high floor, high ceiling**:
- Floor: Sustainable $500K/year nonprofit serving 200K users (still huge impact)
- Ceiling: $2M+ hybrid org serving 5M+ users, shaping policy nationwide

---

## What We're Looking For in a Co-Founder

### Must-Haves

**Technical Skills**:
- Full-stack TypeScript/React experience (Next.js or similar framework)
- API design and integration experience
- Understanding of edge computing / serverless architecture
- AI/LLM integration experience (or strong willingness to learn fast)

**Values Alignment**:
- Passionate about democracy and civic engagement
- Committed to nonprofit mission (not seeking traditional startup exit)
- Privacy-first mindset
- Nonpartisan or able to park personal politics at door

**Practical**:
- Can commit full-time starting Q1 2026
- Comfortable with deferred/reduced salary in Year 1 (ramen profitability)
- Located in U.S. (for 501(c)(3) compliance and mission focus)
- Strong communicator (we'll be pitching foundations, partners, press)

### Nice-to-Haves

- Previous civic tech or social impact experience
- Open-source contributions or community involvement
- Startup experience (especially early-stage 0→1)
- Fundraising or grant writing experience
- Design skills (full-stack + design is powerful combo)
- Connections in philanthropy, civic tech, or policy worlds

### What We're NOT Looking For

- Someone seeking quick financial exit (we're nonprofit-first)
- Hyper-partisan individuals (we must serve all Americans)
- Pure contractors (need co-founder commitment and ownership)
- Non-technical co-founders (we need technical leadership)

---

## Next Steps

### For Prospective Co-Founders

**Step 1: Initial Conversation** (30 minutes)
- Meet Matt, discuss vision and mutual fit
- Review this proposal in detail
- Discuss your background and motivations

**Step 2: Technical Deep Dive** (1-2 hours)
- Review current MVP codebase together
- Discuss technical architecture and roadmap
- Pair on a small feature or refactor

**Step 3: Working Session** (Half day)
- Spend 4 hours working together on product strategy
- Draft grant application together
- Discuss governance, equity, and decision-making

**Step 4: Decision** (1 week)
- Both sides take time to reflect
- Reference checks (mutual)
- Finalize co-founder agreement and equity structure

### For Advisors

**Commitment**:
- Quarterly 1-hour calls (4 hours/year)
- Responsive to email for strategic questions
- Introductions to foundations, partners, or hires
- Optional: Join advisory board (formalized governance)

**Compensation**:
- Years 1-2: Equity in for-profit subsidiary (if launched) - 0.5-1%
- Year 3+: $2-5K annual stipend
- Gratitude, impact, and association with meaningful work

**How to Get Involved**:
- Email: [contact email]
- 30-minute intro call to discuss expertise and fit

### Immediate Priorities (Next 90 Days)

1. **Recruit technical co-founder** (Weeks 1-6)
2. **Establish fiscal sponsorship** (Weeks 2-4)
3. **Integrate 5 Calls API** (Weeks 3-6)
4. **Submit first 3 foundation grants** (Weeks 4-8)
5. **Launch beta with 100 users** (Weeks 8-12)
6. **Recruit 2-3 advisors** (Weeks 6-10)

---

## Conclusion

**Civic Action is democracy infrastructure for the AI age.**

We're building the tool that makes civic participation accessible to every American—from the politically engaged to the curious first-timer. By combining modern AI with comprehensive official contact data, we're removing the friction that keeps 78% of engaged citizens from contacting their representatives.

**This is the right mission, at the right time, with the right structure.**

The nonprofit path preserves our civic mission, builds user trust, and unlocks foundation funding. The hybrid model option gives us sustainability and scale. We have a working MVP, clear product roadmap, validated market demand, and realistic financial projections.

**What we need is a technical co-founder who shares this vision.**

Someone who wants to build something that matters, who believes democracy requires better tools, and who's ready to commit to making civic engagement the default instead of the exception.

If that's you, let's talk.

---

**Contact**

Matt Kilmer
[Email to be added]
[Phone to be added]

**Resources**
- Live MVP: [URL to be added]
- GitHub: github.com/MattKilmer/civic-action
- Supporting Documents:
  - API_MIGRATION_PLAN.md
  - STRATEGIC_RECOMMENDATION.md
  - NONPROFIT_ANALYSIS.md

---

*This proposal was created with assistance from Claude (Anthropic). The vision, strategy, and commitment are entirely human.*
