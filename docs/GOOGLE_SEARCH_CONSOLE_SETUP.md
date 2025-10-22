# Google Search Console Setup Guide

**Purpose**: Submit sitemap and monitor organic search performance

---

## Setup Steps

### 1. Add Property to Google Search Console

1. Go to https://search.google.com/search-console
2. Click "Add Property"
3. Choose "URL prefix" method
4. Enter: `https://takecivicaction.org`
5. Click "Continue"

### 2. Verify Ownership

**Method A: HTML Tag (Recommended)**
1. Choose "HTML tag" verification method
2. Copy the content value from the meta tag
   - Example: `<meta name="google-site-verification" content="ABC123..." />`
   - Copy only `ABC123...` part
3. Open `app/layout.tsx`
4. Find the `verification` object
5. Uncomment the google line and paste your code:
   ```typescript
   verification: {
     google: "ABC123...", // Paste your code here
   },
   ```
6. Commit and push to deploy
7. Wait 1-2 minutes for deployment
8. Return to Search Console and click "Verify"

**Method B: HTML File (Alternative)**
1. Download the HTML verification file from Google
2. Place it in `public/` directory
3. Commit and deploy
4. Click "Verify" in Search Console

### 3. Submit Sitemap

1. In Search Console, go to "Sitemaps" (left sidebar)
2. Enter sitemap URL: `https://takecivicaction.org/sitemap.xml`
3. Click "Submit"
4. Wait 24-48 hours for Google to crawl

### 4. Monitor Key Metrics

**Performance (Search Results)**:
- Total clicks
- Total impressions
- Average CTR (click-through rate)
- Average position
- Top queries
- Top pages

**Coverage (Indexing)**:
- Total indexed pages (expect 4: home, about, privacy, bills)
- Errors (should be 0)
- Valid pages
- Excluded pages (API routes should be excluded)

**Core Web Vitals**:
- Largest Contentful Paint (LCP) - Target: < 2.5s
- First Input Delay (FID) - Target: < 100ms
- Cumulative Layout Shift (CLS) - Target: < 0.1

### 5. Enable Email Alerts

1. Go to "Settings" → "Users and permissions"
2. Ensure email notifications are enabled
3. You'll get alerts for:
   - Indexing issues
   - Security issues
   - Manual actions
   - Critical errors

---

## What to Monitor Weekly

### Week 1-4 (Initial Indexing)
- [ ] Verify all 4 pages are indexed
- [ ] Check for crawl errors
- [ ] Monitor indexing status

### Month 1-3 (Early Growth)
- [ ] Track keyword impressions (shows you're appearing in search)
- [ ] Monitor click-through rates
- [ ] Identify top-performing pages
- [ ] Look for queries with high impressions but low clicks (optimization opportunity)

### Month 3+ (Optimization)
- [ ] Track organic traffic growth
- [ ] Analyze top queries and optimize pages
- [ ] Monitor mobile usability
- [ ] Check Core Web Vitals
- [ ] Identify pages with declining performance

---

## Expected Timeline

- **Day 1**: Verification complete, sitemap submitted
- **Day 2-3**: Google begins crawling sitemap
- **Day 7**: Most pages indexed
- **Week 2**: Initial search impressions appear
- **Week 4**: Enough data for basic analysis
- **Month 2-3**: Meaningful traffic data

---

## Common Issues & Solutions

### "Sitemap couldn't be read"
- Check that sitemap.xml is accessible at https://takecivicaction.org/sitemap.xml
- Verify XML format is valid
- Check robots.txt allows sitemap

### "Discovered - currently not indexed"
- Normal for new sites
- Google is evaluating page quality
- Be patient, can take 2-4 weeks
- Keep adding quality content

### Low click-through rate
- Improve meta descriptions (more compelling)
- Test different titles
- Add structured data for rich snippets

### Pages not indexing
- Check robots.txt doesn't block pages
- Verify canonical URLs are correct
- Ensure no noindex tags
- Check for JavaScript rendering issues

---

## Next Steps After Setup

1. **Week 1**: Verify indexing is working
2. **Week 2**: Review initial queries and impressions
3. **Month 1**: Analyze top queries, optimize meta descriptions
4. **Month 2**: Create content targeting high-impression queries
5. **Month 3**: Build backlinks to high-performing pages

---

## Useful Resources

- Google Search Console Help: https://support.google.com/webmasters
- Search Console Training: https://developers.google.com/search/docs/beginner/seo-starter-guide
- Sitemap protocol: https://www.sitemaps.org/
- Structured data testing: https://search.google.com/test/rich-results

---

**Last Updated**: October 22, 2025
**Next Review**: After first month of data
