# API Migration Plan: Google Civic Information API Replacement

**Date:** October 19, 2025
**Status:** ✅ COMPLETED - Migrated to 5 Calls API
**Completion Date:** October 2025
**Production URL:** https://takecivicaction.org
**Solution:** 5 Calls Public API (free, no authentication required)

---

## Table of Contents

1. [Problem Statement](#problem-statement)
2. [Current Status](#current-status)
3. [Requirements Analysis](#requirements-analysis)
4. [Alternative APIs Evaluated](#alternative-apis-evaluated)
5. [Recommended Solution](#recommended-solution)
6. [Action Plan](#action-plan)
7. [Implementation Details](#implementation-details)
8. [Cost Analysis](#cost-analysis)
9. [Migration Timeline](#migration-timeline)

---

## Problem Statement

### What Happened

Google shut down the Civic Information API Representatives endpoint (`representativeInfoByAddress` and `representativeInfoByDivision`) on **April 30, 2025**.

**Error received:**
```json
{
  "error": {
    "code": 404,
    "message": "Method not found.",
    "status": "NOT_FOUND"
  }
}
```

**Official announcement:** [Google Groups - Notice of Turndown](https://groups.google.com/g/google-civicinfo-api/c/9fwFn-dhktA)

**Reason:** Google cited the availability of alternative providers (BallotReady, Ballotpedia, Cicero) who can provide authoritative representation data directly.

### Impact Assessment

**Broken Features:**
- ❌ Address → Officials lookup
- ❌ Representative contact information retrieval
- ❌ Full user flow from address entry to email generation

**Working Features:**
- ✅ AI email draft generation (OpenAI GPT-4o-mini)
- ✅ Issue selection interface
- ✅ Email formatting and mailto: link generation
- ✅ All core letter-writing functionality

**Conclusion:** The **unique value proposition** (AI letter drafting) works perfectly. Only the commodity feature (representative lookup) needs replacement.

---

## Current Status

### Temporary Workaround

Mock data implemented in `app/page.tsx` for testing:
```typescript
const mockOfficials: Official[] = [
  {
    name: "Nancy Pelosi",
    role: "U.S. Representative",
    party: "Democratic",
    phones: ["202-225-4965"],
    emails: ["sf.nancy@mail.house.gov"],
    urls: ["https://pelosi.house.gov"],
  },
  // ...
];
```

**Location:** Line 14-31 in `app/page.tsx`
**Purpose:** Allows testing of AI letter generation feature
**Status:** Temporary only - must be replaced before production deployment

### Test Results

**API Endpoint Test (via curl):**
```bash
✅ POST /api/ai/draft - Returns properly formatted email in 3-4 seconds
✅ OpenAI integration - Working with gpt-4o-mini
✅ Rate limiting - 15 requests/minute functional
✅ Input validation - Zod schemas working correctly
```

**UI Test (via Playwright):**
```bash
✅ Issue selection - Support/Oppose + topic picker working
✅ Generate draft button - Triggers AI generation
✅ Draft display - Shows formatted email with copy/paste
✅ "Open in Mail" - mailto: link with pre-filled content
```

---

## Requirements Analysis

### Coverage Requirements

**Must Have (80% of use cases):**
- ✅ Federal legislators (Senate, House) - Most legislation happens here
- ✅ State legislators - Critical for state-level issues

**Nice to Have (20% of use cases):**
- 🟡 Governors & statewide officials
- 🟡 Local officials (Mayor, City Council, County)

**Reality Check:**
- 80% of civic advocacy targets federal/state legislators
- Local officials often prefer phone calls or in-person meetings
- Federal/state coverage is sufficient for MVP validation

### Technical Requirements

**Maintain Current Architecture:**
- Simple: `address → API → officials[]`
- Stateless (no database)
- Edge runtime compatible
- Single API call (no multi-step orchestration)
- TypeScript type safety

**API Requirements:**
- Address-based lookup (not lat/long only)
- JSON response format
- Reasonable rate limits (100+ requests/day)
- HTTPS endpoint
- API key authentication (simple)

### Cost Constraints

**MVP Budget Reality:**
- ✅ Free is ideal but not required
- ✅ $25-50/month is acceptable for working solution
- ✅ ~$300/year is reasonable for 10,000+ lookups
- ❌ $1000+/year is too expensive without revenue model

### Success Criteria

1. ✅ Same or better coverage than Google Civic API
2. ✅ Simple integration (< 1 day of work)
3. ✅ Predictable costs
4. ✅ Stable, maintained service
5. ✅ Can migrate later if needed

---

## Alternative APIs Evaluated

### 1. 5 Calls Representatives API ⭐

**Website:** https://5calls.org/representatives-api/
**Documentation:** https://apidocs.5calls.org/representatives
**Contact:** nick@5calls.org

**Coverage:**
- ✅ US Federal (535 members of Congress)
- ✅ State Governors, Secretaries of State, Attorneys General
- ✅ State legislators (all 50 states)
- ❌ Local officials

**Pricing:**
- 🔍 Unknown - must contact for access
- Likely free/low-cost for nonprofit civic projects
- Purpose-built as Google Civic API replacement

**Pros:**
- Specifically designed as Google Civic replacement
- Mission-aligned nonprofit organization
- Federal + State coverage (80% of use cases)
- More metadata than Google Civic had
- Faster update cadence
- Multiple location input types (address, zip, lat/long)

**Cons:**
- Pricing not publicly listed
- Requires approval/contact
- No local official coverage
- Unknown API stability/uptime guarantees

**Integration Effort:** Low (1-2 hours)

**Recommendation:** **Try this first** - email them to request access

---

### 2. Cicero API by Azavea ⭐⭐⭐

**Website:** https://www.cicerodata.com/
**Documentation:** https://cicero.azavea.com/docs/
**Contact:** cicero@cicerodata.com

**Coverage:**
- ✅ US Federal (Congress)
- ✅ US State (all 50 states)
- ✅ US Local (city, county officials)
- ✅ International support available
- ✅ Photos, social media, unique IDs

**Pricing (2025):**
- 🆓 **Free Trial:** 1,000 credits for 90 days
- 💰 **Nonprofit/Gov/Edu:** $298/year for 10,000 credits
- 💰 **Commercial:** Custom pricing for high volume
- 📊 **Rate Limit:** 200 requests/minute

**Cost Breakdown:**
```
$298/year = $24.83/month = $0.82/day
10,000 credits = 27 lookups per day average
Per-lookup cost = $0.03 (with nonprofit pricing)
```

**Pros:**
- ✅ Most comprehensive coverage (local → federal)
- ✅ Known, predictable pricing
- ✅ Professional support from established company
- ✅ Nonprofit discount (already applied)
- ✅ Free trial to test before buying
- ✅ Simple REST API (matches current architecture)
- ✅ Rich metadata (photos, social media, addresses)
- ✅ Stable service (been around since 2006)
- ✅ Can migrate later if needed

**Cons:**
- ❌ Costs money ($298/year)
- ❌ Credits expire after 1 year
- ❌ Need to monitor usage

**Integration Effort:** Low (2-3 hours)

**Recommendation:** **Best fallback option** - reliable, complete, affordable

---

### 3. Geocodio + Data Combination

**Website:** https://www.geocod.io/
**Pricing:** Free tier - 2,500 lookups/day

**Approach:**
1. Geocodio: Address → Legislative Districts (2 credits)
2. Plural/OpenStates: Districts → State Legislators
3. Manual/ProPublica: Districts → Federal Legislators

**Pros:**
- ✅ Generous free tier
- ✅ No payment required
- ✅ Commercial use allowed

**Cons:**
- ❌ Complex multi-step process
- ❌ Multiple API integrations to maintain
- ❌ Data consistency issues across sources
- ❌ More points of failure
- ❌ Significant development time (1-2 weeks)
- ❌ Still missing local official contact info
- ❌ Requires geocoding + multiple lookups

**Integration Effort:** High (5-10 days)

**Recommendation:** ❌ **Not recommended** - too complex for MVP

---

### 4. Plural (formerly OpenStates)

**Website:** https://pluralpolicy.com/
**Documentation:** https://docs.openstates.org/api-v3/
**Pricing:** Free with API key

**Coverage:**
- ✅ State legislators (all 50 states)
- ❌ No federal coverage
- ❌ No local coverage
- ⚠️ Requires lat/long (need to geocode address first)

**Pros:**
- ✅ Free and open source (CC-0 license)
- ✅ Good state-level data
- ✅ GraphQL API available

**Cons:**
- ❌ State-only (misses Congress - most impactful targets)
- ❌ Breaks "local to federal" promise from README
- ❌ Requires geocoding step
- ❌ API v3 in beta (stability concerns)
- ❌ Significant scope reduction

**Integration Effort:** Medium (3-5 days)

**Recommendation:** ❌ **Not recommended alone** - insufficient coverage

---

### 5. USgeocoder API

**Website:** https://blog.usgeocoder.com/looking-for-a-google-civic-api-alternative-discover-usgeocoder-api/

**Coverage:**
- ✅ Geocoding + district matching
- ❌ No official contact information

**Pricing:**
- 🆓 2-week trial with 1,000 lookups
- 💰 Paid plans after trial

**Pros:**
- ✅ Free trial
- ✅ Tailored for former Google Civic users

**Cons:**
- ❌ Doesn't provide official contact info (only districts)
- ❌ Still need another API for actual representative data
- ❌ Pricing unclear

**Recommendation:** ❌ **Not recommended** - incomplete solution

---

### 6. BallotReady / Ballotpedia

**Status:** Recommended by Google as alternatives

**Pros:**
- ✅ Free web-based tools
- ✅ Good for reference

**Cons:**
- ❌ No public API for programmatic access
- ❌ Can only link to their websites, not integrate

**Recommendation:** ❌ **Not applicable** - no API available

---

## Recommended Solution

### Two-Phase Approach

## Phase 1: Contact 5 Calls (Immediate)

**Action:** Email nick@5calls.org to request API access

**Email Template:**

```
Subject: API Access Request for Civic Engagement MVP

Hi Nick,

I'm building an open-source civic action tool that helps constituents
generate respectful, AI-drafted emails to their representatives. The
app was using Google Civic API, which shut down in April 2025.

I found your Representatives API and it looks like exactly what I need
- federal + state coverage with a simple address lookup.

Project details:
- Open source civic engagement tool
- Helps citizens contact their elected representatives
- AI-generated respectful, well-formatted constituent emails
- No revenue model, focused on strengthening democracy
- MVP stage, looking to validate the concept

Could you share information about API access and pricing? I'm
particularly interested in nonprofit/civic project terms.

The app currently helps users:
1. Enter their address
2. Select an issue and stance (support/oppose)
3. Generate AI-drafted emails to all their representatives
4. Contact officials via email/phone

Thank you for maintaining this important civic infrastructure!

Best regards,
[Your Name]

GitHub: [link to repo if public]
Live demo: [link if deployed]
```

**Why this first:**
- Mission-aligned nonprofit (civic engagement)
- Purpose-built Google Civic replacement
- Likely to offer free/low-cost access for civic projects
- Federal + State = 80% of use cases
- Simple integration (matches current architecture)

**Timeline:** Wait 3-5 business days for response

---

## Phase 2: Implementation

### Path A: If 5 Calls Says Yes ✅

**Implementation Steps:**

1. **Get API key from 5 Calls**
2. **Update environment variables:**
   ```bash
   # .env.local
   FIVE_CALLS_API_KEY=your_api_key_here
   ```

3. **Update `/app/api/reps/route.ts`:**
   ```typescript
   const url = new URL("https://api.5calls.org/v1/representatives");
   url.searchParams.set("location", address);

   const r = await fetch(url.toString(), {
     headers: {
       "X-5Calls-Token": process.env.FIVE_CALLS_API_KEY || "",
     },
     cache: "no-store",
   });
   ```

4. **Map response to `OfficialContact[]` format**
5. **Test with real addresses**
6. **Remove mock data from `page.tsx`**
7. **Update README to note "state and federal officials"**
8. **Deploy**

**Timeline:** 2-4 hours

---

### Path B: If 5 Calls Says No or Too Expensive ❌ → Use Cicero

**Implementation Steps:**

1. **Sign up for Cicero free trial** (1,000 credits for 90 days)
   - Visit: https://cicero.azavea.com/
   - Create account
   - Get API key

2. **Test with trial credits:**
   ```bash
   curl "https://cicero.azavea.com/v3.1/legislative_district?lat=37.7749&lon=-122.4194&key=YOUR_KEY"
   ```

3. **Evaluate trial results:**
   - Coverage meets needs?
   - Response format works?
   - Performance acceptable?

4. **If satisfied, purchase nonprofit tier:**
   - $298/year for 10,000 credits
   - Contact cicero@cicerodata.com for nonprofit discount confirmation

5. **Update environment variables:**
   ```bash
   # .env.local
   CICERO_API_KEY=your_api_key_here
   ```

6. **Update `/app/api/reps/route.ts`:**
   ```typescript
   const url = new URL("https://cicero.azavea.com/v3.1/official");
   url.searchParams.set("search_loc", address);
   url.searchParams.set("key", process.env.CICERO_API_KEY || "");

   const r = await fetch(url.toString(), { cache: "no-store" });
   ```

7. **Create mapper in `/app/lib/civic.ts`:**
   ```typescript
   function mapCiceroToOfficials(data: any): OfficialContact[] {
     // Map Cicero response to your OfficialContact type
   }
   ```

8. **Test thoroughly:**
   - Multiple addresses (urban, rural, suburban)
   - Different states
   - Edge cases (territories, etc.)

9. **Remove mock data from `page.tsx`**
10. **Update README with new coverage details**
11. **Deploy**

**Timeline:** 3-5 hours

---

## Action Plan

### Immediate (Today)

- [x] Document problem and alternatives (this file)
- [ ] Send email to 5 Calls (nick@5calls.org)
- [ ] Sign up for Cicero free trial (backup plan)
- [ ] Add user-facing banner explaining temporary situation

### This Week (Oct 19-25)

- [ ] Wait for 5 Calls response (3-5 business days)
- [ ] Test Cicero trial in parallel
- [ ] Prepare implementation for both paths

### Next Week (Oct 26-Nov 1)

**If 5 Calls responds positively:**
- [ ] Implement 5 Calls integration
- [ ] Remove mock data
- [ ] Deploy to production
- [ ] Announce feature restored

**If no response or negative:**
- [ ] Implement Cicero integration
- [ ] Purchase nonprofit tier ($298/year)
- [ ] Remove mock data
- [ ] Deploy to production
- [ ] Set up usage monitoring

### Post-Launch

- [ ] Monitor API usage (are we hitting limits?)
- [ ] Gather user feedback (coverage adequate?)
- [ ] Document API costs in budget
- [ ] Reevaluate if better free alternatives emerge

---

## Implementation Details

### API Integration Checklist

**For either 5 Calls or Cicero:**

1. **Environment Variables**
   ```bash
   # .env.local.example
   # Add new API key variable
   [5CALLS/CICERO]_API_KEY=your_key_here
   ```

2. **Update `/app/api/reps/route.ts`**
   - Replace Google Civic URL
   - Update headers/auth method
   - Update query parameters
   - Add error handling for new API

3. **Update or create mapper in `/app/lib/civic.ts`**
   ```typescript
   export function map[NewAPI]ToOfficials(data: any): OfficialContact[] {
     // Transform new API response to OfficialContact[]
   }
   ```

4. **Type Safety**
   - Ensure response matches `OfficialContact` type
   - Update types if needed (shouldn't be necessary)

5. **Error Handling**
   ```typescript
   if (!r.ok) {
     const text = await r.text();
     console.log("[API] Error:", r.status, text);
     return new Response(text || "[API] error", { status: r.status });
   }
   ```

6. **Rate Limiting**
   - Current: 30 req/min (in-memory)
   - Verify new API limits
   - Adjust if necessary

7. **Testing**
   - Test multiple addresses
   - Test error cases (invalid address, no results)
   - Test rate limiting
   - Test with real UI flow

8. **Remove Mock Data**
   ```typescript
   // app/page.tsx
   // Delete lines 13-31 (mock officials)
   const [officials, setOfficials] = useState<Official[] | null>(null);
   const [location, setLocation] = useState<{ city?: string; state?: string }>({});
   ```

9. **Update Documentation**
   - README.md - Update coverage notes if changed
   - CLAUDE.md - Update API integration notes
   - Add migration notes

10. **Deploy**
    - Push to GitHub
    - Redeploy on Vercel
    - Verify environment variables in Vercel dashboard
    - Test production deployment

---

## Cost Analysis

### Option 1: 5 Calls (Unknown)

**Best Case:** Free for civic nonprofits
```
Cost: $0/year
Break-even: Immediate
```

**Worst Case:** Similar to Cicero pricing
```
Cost: ~$300/year
10,000 lookups/year = 27/day average
Per-lookup: ~$0.03
```

---

### Option 2: Cicero ($298/year nonprofit)

**Annual Cost Breakdown:**
```
Base: $298/year for 10,000 credits
Per month: $24.83/month
Per day: $0.82/day
Per lookup: $0.03/lookup

Comparison:
- Less than Netflix ($15.49/mo)
- Less than OpenAI costs (you're already paying)
- Less than domain name + hosting for most projects
```

**Usage Scenarios:**

**Low usage (5 lookups/day):**
```
5 lookups/day × 365 days = 1,825 lookups/year
Cost: $298/year
Unused: 8,175 credits (wasted ~$245)
Better option: Monthly plan if available
```

**Medium usage (27 lookups/day):**
```
27 lookups/day × 365 days = 9,855 lookups/year
Cost: $298/year
Utilization: 98.5%
Per-lookup: $0.03
Status: Perfect fit ✅
```

**High usage (50 lookups/day):**
```
50 lookups/day × 365 days = 18,250 lookups/year
Cost: $298 + overage charges
Need: Upgrade plan or optimize
Status: Good problem to have! (means success)
```

**ROI Calculation:**

If your app helps just **10 people** engage with their representatives in a year:
- That's 10 constituents who otherwise wouldn't have acted
- 10 well-crafted letters to officials
- Strengthening democratic participation
- Cost per engaged citizen: $29.80

**Is it worth it?** Absolutely.

---

### Option 3: Geocodio + Others (Free but complex)

**Direct Costs:**
```
Geocodio: Free (2,500 lookups/day)
Plural: Free
Manual federal data: Free
Total: $0/year
```

**Hidden Costs:**
```
Development time: 5-10 days @ $100/hr = $4,000-8,000
Maintenance burden: Ongoing
Reliability risk: Multiple points of failure
Opportunity cost: Delayed launch
```

**Conclusion:** "Free" is actually very expensive for an MVP.

---

## Migration Timeline

### Conservative Estimate (Use Cicero immediately)

```
Day 1: Sign up for Cicero trial → 1 hour
Day 2: Test API, verify coverage → 2 hours
Day 3: Implement integration → 3 hours
Day 4: Test thoroughly → 2 hours
Day 5: Purchase nonprofit tier, deploy → 1 hour
---
Total: 9 hours over 5 days
```

### Optimistic Estimate (5 Calls says yes immediately)

```
Day 1: Email 5 Calls → 15 min
Day 2-5: Wait for response
Day 6: Receive API key → 0 hours
Day 7: Implement integration → 2 hours
Day 8: Test and deploy → 1 hour
---
Total: 3 hours over 8 days
```

### Realistic Estimate (Try 5 Calls, fallback to Cicero)

```
Week 1 (Oct 19-25):
- Day 1: Email 5 Calls, sign up Cicero trial → 1 hour
- Day 2-5: Wait for response, test Cicero → 2 hours

Week 2 (Oct 26-Nov 1):
- Path A (5 Calls): Implement → 2 hours
- Path B (Cicero): Implement → 3 hours
- Either: Test and deploy → 1 hour
---
Total: 4-7 hours over 2 weeks
```

---

## Success Metrics

### MVP Validation Metrics

**Technical:**
- [ ] Address lookup working for 95%+ of valid US addresses
- [ ] API response time < 3 seconds
- [ ] Error rate < 1%
- [ ] Uptime > 99%

**Coverage:**
- [ ] Federal legislators: 535 members of Congress
- [ ] State legislators: All 50 states
- [ ] Contact info: Email, phone, website (at minimum)

**User Experience:**
- [ ] User can find their representatives
- [ ] User can generate email draft
- [ ] User can send/copy email
- [ ] < 3 clicks from address to draft

**Business:**
- [ ] API costs < $50/month
- [ ] User complaints about coverage < 5%
- [ ] Can justify costs if usage grows

---

## Risk Assessment & Mitigation

### Risk 1: 5 Calls doesn't respond or too expensive

**Likelihood:** Medium
**Impact:** Low
**Mitigation:** Cicero trial already signed up as backup
**Fallback:** Implement Cicero immediately

---

### Risk 2: Cicero coverage insufficient

**Likelihood:** Low (they're used by major orgs)
**Impact:** Medium
**Mitigation:** Test thoroughly during trial
**Fallback:** Multi-API approach or reduce scope temporarily

---

### Risk 3: Costs exceed budget

**Likelihood:** Low for MVP
**Impact:** Medium
**Mitigation:** Monitor usage, set up alerts
**Fallback:** Implement caching, reduce lookups, or seek funding

---

### Risk 4: API goes down/changes

**Likelihood:** Low (both are established services)
**Impact:** High
**Mitigation:**
- Good error handling
- User-friendly error messages
- Abstraction layer for easy API swapping

---

### Risk 5: User addresses not found

**Likelihood:** Medium (some addresses may not resolve)
**Impact:** Low
**Mitigation:**
- Clear error messages
- Suggest address format
- Allow manual entry fallback

---

## Appendix: Code Changes Required

### Files to Modify

1. **`.env.local.example`** - Add new API key variable
2. **`app/api/reps/route.ts`** - Replace API call
3. **`app/lib/civic.ts`** - Update/add mapper function
4. **`app/page.tsx`** - Remove mock data (lines 13-36)
5. **`README.md`** - Update coverage notes if needed
6. **`CLAUDE.md`** - Update API integration documentation

### Files to Add (Optional)

1. **`API_USAGE_MONITORING.md`** - Track API usage over time
2. **`BACKUP_PLAN.md`** - Document failover procedures

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| Oct 19, 2025 | Document migration plan | Need systematic approach |
| Oct 19, 2025 | Try 5 Calls first | Mission-aligned, likely affordable |
| Oct 19, 2025 | Cicero as fallback | Reliable, known cost, complete coverage |
| Oct 19, 2025 | Reject multi-API approach | Too complex for MVP stage |
| Pending | Final API selection | Awaiting 5 Calls response |

---

## Conclusion

**The path forward is clear:**

1. **Contact 5 Calls** - Best case scenario (free/low-cost civic project)
2. **Fallback to Cicero** - Reliable, affordable ($298/year), complete
3. **Don't overthink it** - Your AI letter writer works perfectly
4. **Ship quickly** - Every day broken is opportunity cost
5. **Iterate based on feedback** - Can always migrate later

**The hard part (AI email generation) is done and working beautifully.** Don't let the commodity part (data lookup) block your launch.

Get a working data source, deploy, and validate with real users.

---

**Next Steps:**
1. [ ] Send email to 5 Calls
2. [ ] Sign up for Cicero trial
3. [ ] Implement whichever responds positively first
4. [ ] Ship to production
5. [ ] Measure and iterate

**Questions?** See implementation details above or contact the team.

---

## Migration Complete Summary

**What was implemented:**
- ✅ Switched from Google Civic API to 5 Calls Public API
- ✅ No authentication required (cost: $0/year)
- ✅ Created `mapFiveCallsToOfficials()` mapper in `app/lib/civic.ts`
- ✅ Updated `/api/reps/route.ts` to call `https://api.5calls.org/v1/reps?location=<address>`
- ✅ Removed `GOOGLE_CIVIC_API_KEY` environment variable requirement
- ✅ Deployed to production at https://takecivicaction.org
- ✅ Tested and validated with multiple addresses

**Coverage achieved:**
- ✅ US Federal: House of Representatives, Senate (535 members of Congress)
- ✅ State-level: Governors, Attorneys General, Secretaries of State, State Legislators
- ✅ Multiple phone numbers per official (main office + field offices)
- ✅ Photo URLs, party affiliation, official websites
- ⚠️  Note: 5 Calls API does not provide email addresses (limitation documented)

**Benefits of 5 Calls API:**
- Zero cost (free public API)
- Better phone coverage (includes field office numbers)
- Faster response times
- No authentication overhead
- Mission-aligned nonprofit organization
- Purpose-built as Google Civic replacement

**Trade-offs accepted:**
- No email addresses (users can still use contact forms on official websites)
- No local official coverage (federal + state covers 80% of use cases)

---

*Last updated: October 19, 2025*
*Status: ✅ Completed - Live in production*
*Migration completed by: Claude Code*
