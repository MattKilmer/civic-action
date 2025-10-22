# Analytics Setup Guide - Plausible

**Purpose**: Privacy-respecting analytics to measure user behavior and optimize the product

---

## Why Plausible?

- ✅ **Privacy-first**: No cookies, GDPR compliant, no personal data collected
- ✅ **Lightweight**: <1KB script, doesn't slow down site
- ✅ **Simple**: Easy dashboard, no complex configuration
- ✅ **Open source**: Transparent, trustworthy
- ✅ **No cookie banner needed**: Compliant without consent popups

**Cost**: $9/month for up to 10,000 monthly visitors (first 30 days free)

---

## Setup Steps

### 1. Create Plausible Account

1. Go to https://plausible.io/register
2. Sign up for an account (30-day free trial)
3. Add your website: `takecivicaction.org`
4. Choose plan: Start (10k visitors/month)

### 2. Get Your Site ID

1. After setup, you'll see your site: `takecivicaction.org`
2. Copy the script snippet (you'll need the `data-domain` value)

### 3. Add Script to App

The script is already added to `app/layout.tsx` but commented out:

```typescript
// To enable: Uncomment the line below and add your domain
// <Script defer data-domain="takecivicaction.org" src="https://plausible.io/js/script.js" />
```

**Steps**:
1. Open `app/layout.tsx`
2. Find the commented Plausible script near line 255
3. Uncomment it
4. Verify `data-domain="takecivicaction.org"` matches your domain
5. Commit and deploy

### 4. Verify Tracking

1. Wait 2-3 minutes after deployment
2. Visit https://takecivicaction.org
3. Go to Plausible dashboard: https://plausible.io/takecivicaction.org
4. You should see your visit appear within 1-2 minutes
5. Check that "Real-time visitors" shows 1 (you)

---

## Key Metrics to Track

### Traffic Metrics

**Unique Visitors**:
- How many people visit the site
- Target: Growth month-over-month
- Good: 10-20% MoM growth

**Pageviews**:
- Total page loads
- Shows engagement (multiple pages per visit)
- Target: 2-3 pages per visitor

**Bounce Rate**:
- % who leave after one page
- Target: <50% for homepage
- Lower = better engagement

**Visit Duration**:
- How long users stay
- Target: 2-3 minutes average
- Shows they're using the tool, not bouncing

### Traffic Sources

**Direct**:
- Typed URL or bookmarked
- Shows repeat users, brand awareness

**Referral**:
- Links from other sites
- Track which sites send traffic

**Google**:
- Organic search traffic
- Track keyword performance

**Social**:
- Twitter, Reddit, etc.
- Shows viral potential

### Top Pages

1. `/` (homepage) - Entry point
2. `/bills` - Bill explorer engagement
3. `/about` - Learning about the tool
4. `/privacy` - Trust signals

### Goal: Custom Events

Plausible allows tracking custom events (button clicks, form submissions).

**High-Value Events to Track**:
1. `Address Submitted` - User entered address
2. `Draft Generated` - AI draft created
3. `Email Sent` - Mailto link clicked
4. `Web Form Clicked` - Web form contact initiated
5. `Phone Clicked` - Tel link clicked
6. `Bill Search` - User searched for a bill
7. `Bill Selected` - User selected a specific bill

These show real engagement, not just page views.

---

## How to Track Custom Events

### Using Plausible Events API

Add to relevant components (example):

```typescript
// Track when user submits address
const handleAddressSubmit = (address: string) => {
  // Existing logic...

  // Track event in Plausible
  if (window.plausible) {
    window.plausible('Address Submitted');
  }
};

// Track when user generates draft
const handleDraftGenerate = () => {
  // Existing logic...

  if (window.plausible) {
    window.plausible('Draft Generated', {
      props: { official: official.name, hasB ill: !!bill }
    });
  }
};
```

### TypeScript Declaration

Add to `global.d.ts` or create one:

```typescript
declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string | number | boolean> }) => void;
  }
}
```

---

## Dashboard Overview

### Real-Time View
- See current visitors
- Pages they're on
- Where they came from
- Useful for testing new features

### Historical Data
- Last 30 days default
- Compare to previous period
- Identify trends and patterns

### Filters
- Filter by source (Google, Twitter, etc.)
- Filter by page (/bills, /, etc.)
- Filter by country
- Drill down into specific traffic

---

## Key Questions Analytics Answers

### Product Questions
- ❓ Do users find officials for their address?
- ✅ Track "Address Submitted" event rate

- ❓ Do users generate drafts?
- ✅ Track "Draft Generated" event rate

- ❓ Do users actually contact representatives?
- ✅ Track "Email Sent" + "Web Form Clicked" rates

- ❓ Is the bill explorer useful?
- ✅ Track `/bills` page visits and "Bill Selected" events

### Growth Questions
- ❓ Where is traffic coming from?
- ✅ Check traffic sources (Google, referrals, social)

- ❓ Which keywords drive traffic?
- ✅ Use Google Search Console + Plausible referrers

- ❓ Are we growing?
- ✅ Compare unique visitors month-over-month

### UX Questions
- ❓ Where do users drop off?
- ✅ Check bounce rates by page

- ❓ What pages do users visit?
- ✅ Check top pages and navigation flow

- ❓ How long do users stay?
- ✅ Check visit duration

---

## Monthly Review Checklist

### Week 1
- [ ] Verify tracking is working
- [ ] Check unique visitors count
- [ ] Review top pages

### Week 2-4
- [ ] Track week-over-week growth
- [ ] Identify top traffic sources
- [ ] Review bounce rates by page

### Month 1
- [ ] Set baseline metrics
- [ ] Document what's working
- [ ] Identify optimization opportunities

### Month 2+
- [ ] Compare to previous month
- [ ] Track event conversion rates (address → draft → contact)
- [ ] Optimize pages with high bounce rates
- [ ] Double down on top traffic sources

---

## Privacy Commitment

**What Plausible Does NOT Track**:
- ❌ No personal data
- ❌ No IP addresses stored
- ❌ No cookies or local storage
- ❌ No cross-site tracking
- ❌ No behavioral profiling

**What Plausible DOES Track**:
- ✅ Page views (which pages visited)
- ✅ Traffic sources (where visitors came from)
- ✅ Geographic data (country/region only, not city)
- ✅ Device type (desktop/mobile)
- ✅ Custom events (button clicks we define)

**Result**: Fully GDPR compliant, no consent banner needed.

---

## Cost Breakdown

**Starter Plan**: $9/month (10,000 visitors/month)
- Sufficient for first 6-12 months
- Upgrade when you exceed 10k monthly visitors

**Alternatives**:
- **Simple Analytics**: Similar to Plausible, €19/month
- **Fathom Analytics**: $14/month for 10k visitors
- **Self-hosted Plausible**: Free (requires server, technical setup)

**Recommendation**: Start with Plausible cloud for ease of use.

---

## Next Steps After Setup

1. **Week 1**: Verify tracking, set up dashboard
2. **Week 2**: Add custom event tracking (address submit, draft generate)
3. **Month 1**: Establish baseline metrics
4. **Month 2**: Optimize based on data (improve high-bounce pages)
5. **Month 3**: Track conversion funnel (visitor → address → draft → contact)

---

## Useful Resources

- Plausible Docs: https://plausible.io/docs
- Event Tracking Guide: https://plausible.io/docs/custom-event-goals
- Dashboard Guide: https://plausible.io/docs/guided-tour
- API Reference: https://plausible.io/docs/events-api

---

**Last Updated**: October 22, 2025
**Next Review**: After first month of data
