# Section #2 Optimization Plan - "Choose Your Issue & Stance"

**Created**: October 22, 2025
**Status**: Research complete, ready for implementation
**Priority**: High - Core UX improvement for civic impact

---

## 📊 Research Summary

### User Preferences Confirmed:
1. ✅ **Bill Priority**: Optional but elevated - Bill search moves to top, made prominent
2. ✅ **Topic Logic**: Optional - Auto-detect but allow override when bill selected
3. ✅ **User Education**: Yes - Add helper text explaining why bills matter
4. ✅ **Stance Position**: Move after bill/topic selection (logical flow: What → Position)

### Design Principles Applied:
- **Progressive Disclosure**: Don't show issue picker until address entered ✓
- **Visual Hierarchy**: Most impactful elements first (bills > topics)
- **Form Accessibility**: Labels above inputs, proper ARIA labels
- **Content Tone**: "Encouraging, not pushy" - educate without lecturing
- **Mobile-First**: Full-width inputs, adequate touch targets (44x44px min)

---

## 🎯 Core Problem

**Current Issues:**
1. Stance comes BEFORE context (asks "support or oppose" before user knows what)
2. Bill Number buried in 2-column grid as "optional"
3. Issue Topic required even when bill is selected (redundant)
4. No education on WHY bills > general topics
5. Bill search not visually prominent enough

**Impact:**
- Users miss the most impactful option (specific legislation)
- Illogical flow confuses users (position before topic)
- Missed opportunity to educate citizens on effective advocacy

---

## 🔄 Proposed New Structure

### Current Order (BEFORE):
```
1. Stance (support/oppose)           ❌ Asks position before knowing what
2. Issue Topic (required)             ❌ Required even when bill selected
3. Bill Number + Desired Action       ❌ Buried in 2-column grid
4. Personal Impact
5. Message Tone
```

### NEW Order (AFTER):
```
1. 🔍 Bill Number                     ✅ Promoted to #1, full-width, prominent
2. 📋 Issue Topic                     ✅ Optional when bill selected
3. 👍 Stance                          ✅ After user knows what
4. ✍️ Desired Action                  ✅ Full-width, moved up
5. 💬 Personal Impact                 ✅ Unchanged
6. 🎨 Message Tone                    ✅ Unchanged
```

---

## 📝 Detailed Field Specifications

### 1. Bill Number (NEW PRIORITY POSITION)

**Visual Treatment:**
- Light blue background box (`bg-blue-50 border border-blue-200 rounded-xl p-4`)
- Full-width (not in grid)
- Larger label font (`text-base` instead of `text-sm`)
- Increased input height (`py-3` instead of `py-2`)

**Label:**
```
Find Specific Legislation
```

**Helper Text (BEFORE input):**
```
For maximum influence, cite specific legislation your representative will vote on.
```

**Components:**
- "🔍 Not sure which bill? Browse legislation →" link (ABOVE input)
- Bill search input field
- Search button (more prominent: `px-5 py-3`, `font-semibold`)
- Autocomplete dropdown (federal + state bills)

**Helper Text (AFTER input):**
```
Citing specific legislation gives your message more weight with congressional staff who track bill-specific constituent feedback.
```

---

### 2. Issue Topic (MODIFIED LOGIC)

**Conditional Label:**
```tsx
Issue Topic {issue.bill ? '(auto-detected)' : '*'}
```

**Helper Text (when bill selected):**
```
You can change this if the auto-detection is incorrect
```

**Behavior:**
- Still shows dropdown with 10 topics + Other
- Auto-fills when bill selected
- User can override auto-detection
- **No longer required** when bill exists (validation updated)

---

### 3. Stance (MOVED POSITION)

**No visual changes**, just moved after Bill/Topic

**Rationale:**
- User now knows WHAT before deciding position
- Logical flow: Context → Position → Details

---

### 4. Desired Action (LAYOUT CHANGE)

**Changed from:** 2-column grid position (paired with Bill Number)
**Changed to:** Full-width standalone field

**Placeholder update:**
```
e.g., Please vote yes on this bill
```

---

### 5. Personal Impact (NO CHANGE)

Keep exactly as-is - current implementation is good.

---

### 6. Message Tone (NO CHANGE)

Keep exactly as-is - good placement at bottom.

---

## 🛠️ Implementation Details

### File to Modify:
**`app/components/IssuePicker.tsx`** (lines 384-681)

### Change 1: Reorganize JSX Return Statement

**Current order:**
```tsx
return (
  <div className="space-y-6">
    {/* Stance */}
    {/* Topic Dropdown */}
    {/* Custom Topic Input */}
    {/* Bill Summary Display */}
    {/* Grid: Bill Number + Desired Action */}
    {/* Personal Impact */}
    {/* Tone Selection */}
  </div>
);
```

**NEW order:**
```tsx
return (
  <div className="space-y-6">
    {/* 1. BILL NUMBER (new prominent section) */}
    {/* 2. TOPIC DROPDOWN (modified label/helper) */}
    {/* 3. CUSTOM TOPIC INPUT (if "Other") */}
    {/* 4. BILL SUMMARY DISPLAY */}
    {/* 5. STANCE (moved down) */}
    {/* 6. DESIRED ACTION (full-width) */}
    {/* 7. PERSONAL IMPACT (unchanged) */}
    {/* 8. TONE SELECTION (unchanged) */}
  </div>
);
```

---

### Change 2: Bill Number Section (NEW JSX)

```tsx
{/* Bill Number - Promoted to Top */}
<div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
  <label className="block font-semibold text-gray-900 text-base">
    Find Specific Legislation
  </label>

  <p className="text-sm text-gray-700">
    For maximum influence, cite specific legislation your representative will vote on.
  </p>

  {/* "Browse legislation" link - MOVED ABOVE input */}
  <Link
    href="/bills"
    className="flex items-center gap-2 text-base font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors"
  >
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
    Not sure which bill? Browse legislation
  </Link>

  {/* Bill search input + button */}
  <div className="relative">
    <div className="flex gap-2">
      <input
        id="bill-number"
        type="text"
        className="flex-1 border border-gray-300 rounded-md px-3 py-3 text-sm text-gray-900 bg-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        placeholder="e.g., HR 1234, CA AB 123"
        value={billSearchInput}
        onChange={(e) => setBillSearchInput(e.target.value)}
        onKeyDown={handleBillSearchKeyDown}
        onFocus={() => {
          if (billSuggestions.length > 0) setShowSuggestions(true);
        }}
        onBlur={() => {
          setTimeout(() => setShowSuggestions(false), 200);
        }}
      />
      <button
        type="button"
        onClick={handleBillSearch}
        disabled={searchingBills}
        className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {searchingBills ? (
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          'Search'
        )}
      </button>
    </div>

    {/* Autocomplete dropdown - KEEP EXISTING CODE */}
    {showSuggestions && billSuggestions.length > 0 && (
      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
        {/* ... existing suggestion mapping ... */}
      </div>
    )}
  </div>

  <p className="text-sm text-gray-600">
    Citing specific legislation gives your message more weight with congressional staff who track bill-specific constituent feedback.
  </p>
</div>
```

---

### Change 3: Topic Section (MODIFIED)

```tsx
{/* Topic Dropdown */}
<div>
  <label htmlFor="topic-select" className="block font-semibold text-gray-700 mb-2 text-sm">
    Issue Topic{' '}
    {issue.bill ? (
      <span className="text-gray-500 font-normal">(auto-detected)</span>
    ) : (
      <span className="text-red-600">*</span>
    )}
  </label>

  {issue.bill && (
    <p className="text-xs text-gray-600 mb-2">
      You can change this if the auto-detection is incorrect
    </p>
  )}

  <select
    id="topic-select"
    value={selectedTopicValue}
    onChange={(e) => handleTopicChange(e.target.value)}
    className="w-full border border-gray-300 text-gray-900 bg-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
  >
    {TOPIC_OPTIONS.map((option) => (
      <option key={option.value} value={option.value} disabled={!option.value && option.value !== "OTHER"}>
        {option.label}
      </option>
    ))}
  </select>
</div>
```

---

### Change 4: Desired Action (FULL-WIDTH)

```tsx
{/* Desired Action - Now full-width instead of in grid */}
<div>
  <label htmlFor="desired-action" className="block font-semibold text-gray-700 mb-2 text-sm">
    Desired Action <span className="text-gray-500 font-normal">(optional)</span>
  </label>
  <input
    id="desired-action"
    type="text"
    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 bg-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
    placeholder="e.g., Please vote yes on this bill"
    onChange={(e) => update("desiredAction", e.target.value)}
  />
</div>
```

---

### Change 5: Update Validation (Parent Component)

**File:** `app/page.tsx`

**Current validation:**
```tsx
const isIssueValid = issue && issue.topic && issue.stance;
```

**NEW validation:**
```tsx
// Topic is optional if bill is selected
const isIssueValid = issue && (issue.bill || issue.topic) && issue.stance;
```

---

## 📱 Mobile Responsiveness

### Breakpoint Considerations:

**Mobile (<640px):**
- Bill section: Full-width, no grid
- Search button: Stays inline with input (flex-wrap if too narrow)
- "Browse legislation" link: Full-width tap target
- All inputs: Full-width
- Touch targets: Minimum 44x44px

**Tablet (640-1024px):**
- Same as mobile (full-width)
- More generous spacing

**Desktop (>1024px):**
- Bill section: Max-width constrained by parent
- Blue box doesn't get too wide (constrained by form container)

---

## ✅ Testing Checklist

### Functional Testing:
- [ ] **Bill-first flow**: Search bill → auto-detect topic → choose stance → generate draft
- [ ] **Topic-first flow**: Choose topic → optionally add bill → choose stance → generate draft
- [ ] **Bill selection**: Verify topic label changes to "(auto-detected)"
- [ ] **Auto-detection**: Bill title correctly maps to topic (test all 10 topics)
- [ ] **Manual override**: User can change auto-detected topic
- [ ] **Validation with bill**: Form submits successfully with bill but no topic
- [ ] **Validation without bill**: Form still requires topic if no bill selected
- [ ] **"Browse legislation" link**: Opens `/bills` page
- [ ] **Helper text**: All new helper text displays correctly
- [ ] **Bill summary**: Still loads and displays correctly (not broken by reorder)
- [ ] **State bills**: Autocomplete works for both federal and state bills
- [ ] **Clear bill**: If user manually clears bill field, topic becomes required again

### Visual Testing:
- [ ] **Desktop (1440px)**: Blue box looks good, not too wide
- [ ] **Tablet (768px)**: Elements stack properly, no overflow
- [ ] **Mobile (375px)**: Touch targets adequate, button doesn't wrap awkwardly
- [ ] **Focus states**: Blue ring visible on all inputs/buttons
- [ ] **Hover states**: Button darkens, link underlines
- [ ] **Loading state**: Spinner shows during bill search
- [ ] **Blue box**: Distinct but not overwhelming, matches design system
- [ ] **Typography**: Font sizes follow design system (base/sm/xs)
- [ ] **Spacing**: Consistent gaps between sections (space-y-6, space-y-3)

### Accessibility Testing:
- [ ] **Keyboard navigation**: Tab through fields in logical order (bill → topic → stance → action → impact → tone)
- [ ] **Screen reader**: Labels read correctly
  - "Find Specific Legislation"
  - "Issue Topic, optional, auto-detected" (when bill selected)
  - "Issue Topic, required" (when no bill)
- [ ] **Screen reader**: Helper text associated with inputs (aria-describedby)
- [ ] **Color contrast**: All text meets WCAG AA
  - Gray text on blue-50 background: Check contrast
  - Blue-700 on blue-50: Check contrast
- [ ] **Focus visible**: Clear indication on all interactive elements
- [ ] **Required field**: Screen reader announces when topic is required vs optional
- [ ] **Error states**: If validation fails, appropriate ARIA messages

### Cross-Browser Testing:
- [ ] Chrome (desktop/mobile)
- [ ] Firefox (desktop/mobile)
- [ ] Safari (desktop/mobile)
- [ ] Edge (desktop)

---

## 📊 Expected Outcomes

### User Behavior Changes:
1. **More bill usage**: Prominent placement → +30-50% discovery rate
2. **Clearer mental model**: What (bill/topic) → Position (stance) → Details
3. **Better education**: Users understand concrete legislation = more impact
4. **Reduced friction**: Stance after context feels more natural
5. **Higher Bill Explorer clicks**: Link more visible → +30-50% click rate

### Civic Impact:
1. **Increased specificity**: More messages reference actual bills
2. **Trackable feedback**: Congressional staff can measure constituent opinion per bill
3. **Voting influence**: Representatives prioritize bill-specific constituent input over general complaints
4. **Democratic engagement**: Citizens learn effective advocacy tactics

### Conversion Metrics (Hypotheses):
- **Bill Explorer clicks**: Baseline → +30-50%
- **Bill selection rate**: Baseline → +20-40%
- **Form completion rate**: Baseline → +10-15% (logical flow reduces abandonment)
- **Draft generation**: Baseline → +0-5% (better UX, minimal friction)
- **Average message quality**: Higher (specificity = better advocacy)

---

## 💡 Open Questions for Implementation

### 1. Desired Action Placeholder
Should it change based on context?
- **With bill**: "e.g., Please vote yes on this bill"
- **Without bill**: "e.g., Please support climate action"

**Recommendation**: Keep bill-specific placeholder always. Simpler to implement, doesn't hurt UX.

---

### 2. Skip to General Topic Link
Should we add a subtle "Skip to general topic" link in the bill section for users who prefer not to search?

**Pros**: Reduces abandonment for non-bill users
**Cons**: Undermines our goal to promote bill usage

**Recommendation**: No. Keep bill optional by design, but don't actively encourage skipping it.

---

### 3. Analytics Tracking
Should we add event tracking for:
- Bill search performed
- Bill selected from autocomplete
- "Browse legislation" link clicked
- Topic auto-detection triggered
- User overrides auto-detected topic

**Recommendation**: Yes, if Plausible or similar privacy-respecting analytics are added in future.

---

### 4. Stance Button Text
Should stance buttons change when bill is selected?
- Current: "support" / "oppose"
- With bill: "I support this bill" / "I oppose this bill"

**Recommendation**: No. Current text is clear and concise. Longer text might cause button width issues on mobile.

---

### 5. Bill Summary Placement
Should bill summary stay where it is (between topic and stance) or move?

**Current placement** (between topic and stance): Makes sense because:
- User searches bill
- Sees summary
- Understands what it does
- Then decides stance

**Recommendation**: Keep current placement. It's logical.

---

## 🚀 Implementation Priority

### Phase 1: Core Changes (1-2 hours)
1. Reorganize JSX: Move bill to top, stance after topic
2. Add blue background box around bill section
3. Add educational helper text (before & after bill input)
4. Make topic conditional label (auto-detected vs required)
5. Move "Desired Action" out of grid to full-width

**Test after Phase 1**: Basic flow works, fields in correct order

---

### Phase 2: Polish (30-60 min)
6. Move "Browse legislation" link above input
7. Enhance link styling (larger font, icon)
8. Increase input/button heights for prominence
9. Update parent component validation logic
10. Add helper text for topic override

**Test after Phase 2**: All visual enhancements in place

---

### Phase 3: Testing & Refinement (1-2 hours)
11. Full functional testing (all flows)
12. Mobile responsive checks (3 breakpoints)
13. Accessibility audit (keyboard, screen reader, contrast)
14. Cross-browser testing
15. Refinements based on findings

**Test after Phase 3**: Production-ready

---

## 📁 Files Modified

### Primary:
- **`app/components/IssuePicker.tsx`** (lines 384-681)
  - Reorganize JSX return statement
  - Add new helper text
  - Conditional logic for optional topic
  - Enhanced bill section styling

### Secondary:
- **`app/page.tsx`** (validation logic)
  - Update `isIssueValid` to allow bill without topic

### Potentially:
- **`app/globals.css`** (if needed for custom styles)
  - May not be needed - all styles inline with Tailwind

---

## 🎓 Research & Rationale

### Why Bills > General Topics?

**From Congressional Staff Perspective:**
- Specific legislation is trackable
- Can tally constituent opinions per bill
- Informs representatives' voting decisions
- General complaints are harder to act on

**From Citizen Effectiveness:**
- Concrete ask (vote yes/no on HR 1234)
- Measurable outcome (did they vote as requested?)
- Educational (learn about actual legislation)
- Higher perceived impact (feels more concrete)

**From UX Research:**
- Users prefer specific over abstract
- Concrete goals increase motivation
- Learning by doing (discover bills through search)
- Success feels more attainable

### Why This Field Order?

**Cognitive Load Theory:**
- Context before decision (bill/topic before stance)
- Reduce working memory burden
- Natural information flow

**Form Design Best Practices:**
- Most important fields first
- Related fields grouped
- Optional fields after required
- Progressively reveal complexity

**User Testing Insights (hypothetical):**
- Users confused why stance is first
- Many skip bill search (not prominent)
- Some unclear if topic needed when bill selected
- Desired action placement awkward in grid

---

## 📋 Next Steps

1. **Review this plan** with team/stakeholders
2. **Confirm approach** or request modifications
3. **Execute Phase 1** changes
4. **Test thoroughly** at each phase
5. **Deploy to staging** for user testing (if available)
6. **Monitor metrics** post-launch (if analytics available)
7. **Iterate** based on real user data

---

**Document Status**: Complete and ready for implementation
**Estimated Total Time**: 3-5 hours (all phases)
**Risk Level**: Low (cosmetic reordering, no breaking changes)
**User Impact**: High (better UX, more civic impact)
