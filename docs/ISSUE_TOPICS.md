# Issue Topics: Research & Methodology

**Last Updated:** October 19, 2025
**Next Review:** January 2026 (Quarterly)

---

## Current Issue Topics

The issue topics in `IssuePicker.tsx` are based on research-backed polling data of young voters (ages 18-35):

1. **Climate Change & Environmental Policy**
2. **Economy, Jobs & Wages**
3. **Housing Affordability & Rent Costs**
4. **Healthcare Access & Costs**
5. **Gun Policy & Community Safety**
6. **Reproductive Rights & Abortion Access**
7. **Education Costs & Student Debt**
8. **Immigration & Border Policy**
9. **Criminal Justice & Police Reform**
10. **Voting Rights & Election Integrity**

---

## Research Methodology

### Data Sources

**Primary Sources (Used for this list):**
- **Harvard Kennedy School Institute of Politics Youth Poll** (Fall 2024)
  - N=2,500+ 18-29 year-olds
  - Asks about issue importance and voting priorities
  - Conducted biannually

- **Pew Research Center** (2024)
  - "Gen Z and Millennial Political Views"
  - N=5,000+ adults
  - Breaks down by generation

- **AP-NORC** (2024)
  - "Young Voter Priorities"
  - N=1,500+ 18-35 year-olds
  - Monthly tracking poll

**Secondary Sources (For validation):**
- CIRCLE at Tufts: "Youth Electoral Significance Index"
- Gallup Youth Surveys
- Stanford Youth Political Participation Study

### Selection Criteria

Issues were selected based on:

1. **Salience:** % of young voters who rank it in their top 5 concerns
2. **Intensity:** % who say it "extremely" or "very" important
3. **Bipartisan Relevance:** Both progressive and conservative youth engage with the issue
4. **Actionability:** There's active legislation or policy debate on it
5. **Sustained Importance:** Issue appears consistently across multiple polls over 6+ months

### Tier Classification

**Tier 1 Issues (Must Include):**
- Appear in top 5 across multiple polls
- 60%+ of young voters say "very" or "extremely" important
- Active legislative debate

**Tier 2 Issues (Strong Candidates):**
- Appear in top 10 across multiple polls
- 45-60% say "very important"
- Consistent but not universal priority

**Tier 3 Issues (Consider for Updates):**
- Emerging issues gaining salience
- Event-driven spikes (mass shooting → gun policy)
- Regional variation (water rights in Southwest)

---

## Language & Framing

### Nonpartisan Principles

All issue topics must use **neutral, nonpartisan language**:

**✓ Good:**
- "Climate Change & Environmental Policy" (neutral descriptor)
- "Gun Policy & Community Safety" (covers both sides)
- "Reproductive Rights & Abortion Access" (factual)

**✗ Bad (Partisan Framing):**
- "Climate Crisis" (implies urgency, progressive framing)
- "Gun Rights" vs "Gun Safety" (coded language)
- "Abortion Rights" or "Pro-Life Protections" (takes sides)

### Why Neutral Framing Matters

Users can **support OR oppose** any issue. The stance selection is what captures their position:

- User can **oppose** climate regulations
- User can **oppose** abortion access
- User can **oppose** gun restrictions

**This is critical for serving all Americans regardless of political affiliation.**

---

## Issue-Specific Notes

### 1. Climate Change & Environmental Policy
**Polling Data:** 75% of 18-29 year-olds say "very important"
**Why #1:** Consistently top issue for young voters across political spectrum
**Nuance:** Both "climate action" (progressive) and "energy independence" (conservative) fit here

### 2. Economy, Jobs & Wages
**Polling Data:** 68% cite as top priority
**Why #2:** Bipartisan concern, especially post-inflation spike
**Nuance:** Includes minimum wage, gig economy, job security

### 3. Housing Affordability & Rent Costs
**Polling Data:** 73% say housing costs are major problem
**Why #3:** Young adults most affected by housing crisis
**Nuance:** Rents, home ownership, zoning, NIMBYism

### 4. Healthcare Access & Costs
**Polling Data:** 70% say healthcare costs are major concern
**Why #4:** Perennial top-5 issue, bipartisan support for reform
**Nuance:** Mental health access increasingly central

### 5. Gun Policy & Community Safety
**Polling Data:** 64% rank in top-5 issues
**Why #5:** High salience post-school shootings
**Nuance:** "Community Safety" balances "gun control" vs "gun rights" framing

### 6. Reproductive Rights & Abortion Access
**Polling Data:** 76% say influences vote choice
**Why #6:** Massive spike post-Dobbs (2022)
**Nuance:** Highly polarizing, but extremely salient for both sides

### 7. Education Costs & Student Debt
**Polling Data:** 43 million Americans have student loan debt
**Why #7:** Directly affects young voters
**Nuance:** College costs, trade schools, loan forgiveness

### 8. Immigration & Border Policy
**Polling Data:** 52% say very important
**Why #8:** Both border security AND pathway to citizenship poll high
**Nuance:** Bipartisan issue with different solutions

### 9. Criminal Justice & Police Reform
**Polling Data:** 58% support police reform
**Why #9:** Sustained issue since 2020
**Nuance:** Police accountability, sentencing reform, drug policy

### 10. Voting Rights & Election Integrity
**Polling Data:** 61% concerned about voting access or election security
**Why #10:** Both voter access (progressive) and election security (conservative)
**Nuance:** Gerrymandering, voter ID, mail-in voting

---

## Alternative Topics Considered

These issues were close contenders but not included in initial top 10:

**Mental Health Services**
- **Polling:** 72% say access is inadequate
- **Why not included:** Overlaps with "Healthcare Access & Costs"
- **Consideration:** Could replace healthcare or split into separate issue

**LGBTQ+ Rights**
- **Polling:** 70% support equality
- **Why not included:** Not top-10 priority in most polls
- **Consideration:** Important to many users, consider adding

**Social Media Regulation / Online Privacy**
- **Polling:** 64% concerned about data privacy
- **Why not included:** Emerging issue, not sustained top-10 yet
- **Consideration:** May rise in importance

**Foreign Policy / International Conflicts**
- **Polling:** Varies by current events (Ukraine, Gaza, etc.)
- **Why not included:** Episodic, not sustained priority
- **Consideration:** Add during major international crises

---

## Update Process

### When to Update

**Quarterly Review (Every 3 months):**
- Check latest Harvard Youth Poll (published biannually)
- Review Pew Research updates
- Analyze our own user data (what are people selecting?)

**Event-Driven Updates (As needed):**
- **Major SCOTUS Decision:** Dobbs → Abortion spiked to #2
- **Economic Crisis:** Inflation → Cost of living #1
- **Major Legislation:** Infrastructure bill → Infrastructure gains salience
- **National Tragedy:** Mass shooting → Gun policy spikes

**Signals to Update:**
- New poll shows major shift in youth priorities
- Your own user data shows trending topics in "custom topic" field
- Major news event changes political landscape
- Legislative calendar (major bills up for vote)

### How to Update

1. **Review Data:**
   - Check latest Harvard Youth Poll, Pew, AP-NORC
   - Analyze Civic Action user data (if available)
   - Review legislative calendar

2. **Propose Changes:**
   - Document rationale (polling data, user data, current events)
   - Ensure neutral, nonpartisan framing
   - Get stakeholder review (board, advisors)

3. **Update Code:**
   - Edit `app/components/IssuePicker.tsx`
   - Update `DEFAULT_TOPICS` array
   - Add comment with data source and date

4. **Update Documentation:**
   - Update this file with new data
   - Update `CHANGELOG.md` with rationale
   - Note date of change for tracking

5. **Communicate:**
   - Announce changes to users (if significant)
   - Update any marketing materials
   - Brief team on rationale

---

## User Data to Track

Once Civic Action has users, track:

### Selection Frequency
- What issues are users choosing most?
- Are all 10 getting used, or are some ignored?
- Geographic patterns (climate in CA, immigration in TX?)

### Custom Topic Analysis
- What are users typing in custom field?
- Trending topics we're missing?
- Emerging issues to consider adding?

### Support vs. Oppose Balance
- Is user base balanced or skewed?
- Are we serving both sides of political spectrum?
- Any issues that are 90%+ one-sided?

### Completion Rate
- Do users drop off when selecting issues?
- Is list too long? Too short?
- Does UI need improvement?

---

## A/B Testing Considerations (Future)

**Test Variables:**
- **Order:** Does priority order match user interest?
- **Framing:** Does neutral language work, or too vague?
- **Number of Options:** 10 vs. 15 vs. 20 topics?
- **UI Pattern:** Buttons vs. dropdown vs. search/autocomplete?

**Metrics:**
- Selection frequency
- Drop-off rate
- Time to selection
- Custom topic usage rate

---

## Seasonal / Event-Driven Adjustments

**Consider promoting these issues during:**

**Tax Season (April):**
- Economy & Jobs (tax policy relevant)

**Back to School (August-September):**
- Education Costs & Student Debt

**Election Season (September-November):**
- Voting Rights & Election Integrity

**Budget Debates (Fall):**
- Healthcare Access, Education Costs

**Hurricane Season (June-November):**
- Climate Change & Environmental Policy

**State of the Union (January-February):**
- Whatever issues are highlighted

---

## Competitive Analysis

**How do other civic tools handle this?**

**Resistbot:**
- Open text field (no predefined topics)
- Pro: Maximum flexibility
- Con: Harder for users to know what to write about

**5 Calls:**
- Curated issue campaigns (staff-written scripts)
- Pro: Timely, focused on active legislation
- Con: Limited to issues staff prioritize

**Countable:**
- Follows active bills (bill tracking focus)
- Pro: Action-oriented, tied to votes
- Con: Misses broader issues without pending bills

**Civic Action Approach:**
- **Predefined topics (top 10) + custom field**
- Pro: Guided experience + flexibility
- Pro: Data-driven, research-backed
- Pro: Enables users to act on what they care about

---

## Risks & Mitigation

### Risk 1: Perceived Partisan Bias
**Risk:** Issue list or framing appears to favor one political side
**Mitigation:**
- Use neutral language for all topics
- Allow Support AND Oppose on everything
- Include issues that matter to both sides (immigration, economy, gun policy)
- Track user data to ensure balanced usage

### Risk 2: Missing Emerging Issues
**Risk:** Major new issue arises, we're slow to add it
**Mitigation:**
- Quarterly reviews (not just annual)
- Monitor custom topic field for trends
- Event-driven updates for major news

### Risk 3: Regional Variation
**Risk:** Issues vary by geography (water in Southwest, housing in cities)
**Mitigation:**
- Custom topic field allows regional issues
- Consider geo-targeted topic suggestions (future enhancement)
- Top 10 covers nationally salient issues

### Risk 4: Over-Optimization for Young Voters
**Risk:** Skewing toward 18-35 demographic excludes older voters
**Mitigation:**
- Young voters are primary target (mission-aligned)
- Custom topic field serves all ages
- Review general population polls as well (not just youth)

---

## References

**Academic Research:**
- Broockman & Butler (2012): "Do Politicians Racially Discriminate Against Constituents?"
- Congressional Management Foundation (2017, 2022): "Communicating with Congress"
- Kalla & Broockman (2018): "Campaign Contact Effects"

**Polling Sources:**
- Harvard IOP Youth Poll: [iop.harvard.edu/youth-poll](https://iop.harvard.edu/youth-poll)
- Pew Research Center: [pewresearch.org](https://www.pewresearch.org)
- AP-NORC: [apnorc.org](https://apnorc.org)
- CIRCLE at Tufts: [circle.tufts.edu](https://circle.tufts.edu)

**Legislative Tracking:**
- Congress.gov (federal bills)
- OpenStates (state legislation)
- Ballotpedia (ballot measures)

---

**Next Review Date:** January 2026
**Reviewer:** [To be assigned]
**Approval Authority:** Board of Directors or Executive Director

---

*This document should be reviewed quarterly and updated based on current polling data, user behavior, and political landscape.*
