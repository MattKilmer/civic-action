# Civic Action Design Principles

## I. Core Design Philosophy

*   **Trust & Transparency First:** As a civic engagement tool, every design decision must reinforce user trust. Users are sharing political positions and personal information—the UI must feel secure, professional, and nonpartisan.
*   **Accessibility is Non-Negotiable:** Democracy tools must be accessible to all citizens. Aim for WCAG AA+ compliance minimum.
*   **Speed & Performance:** Civic engagement is time-sensitive. Fast load times and snappy interactions remove friction from democratic participation.
*   **Simplicity Over Features:** Most users are occasional civic engagers, not power users. Prioritize clarity and ease of use over advanced functionality.
*   **Nonpartisan Visual Language:** Avoid colors, imagery, or design patterns that could be perceived as politically aligned. Stick to neutral, professional design.
*   **Mobile-First Mindset:** Many users will engage on mobile devices. Design for small screens first.

## II. Design System Foundation

### Color Palette

**Primary Colors:**
*   **Brand Primary:** Blue (`#2563eb` / `blue-600`) - chosen for nonpartisan association with civic institutions
*   **Background:** White (`#ffffff`) and light grays (`#f9fafb` to `#f3f4f6`)
*   **Text Primary:** Dark gray (`#111827` / `gray-900`)
*   **Text Secondary:** Medium gray (`#6b7280` / `gray-600`)

**Semantic Colors:**
*   **Success/Affirmative:** Green (`#059669` / `emerald-600`)
*   **Warning/Caution:** Amber (`#d97706` / `amber-600`)
*   **Error/Destructive:** Red (`#dc2626` / `red-600`)
*   **Informational:** Blue (`#0284c7` / `sky-600`)

**Interactive States:**
*   **Hover:** Darken by one shade (e.g., `blue-600` → `blue-700`)
*   **Focus:** Visible focus ring with `ring-2 ring-blue-500 ring-offset-2`
*   **Disabled:** 50% opacity with cursor-not-allowed

**Accessibility:**
*   All text-background combinations must meet WCAG AA contrast ratio (4.5:1 for body text, 3:1 for large text)
*   Color must never be the only indicator of state (use icons, text labels, or patterns)

### Typography

**Font Family:**
*   Primary: System font stack (`system-ui, -apple-system, sans-serif`) for performance and familiarity
*   Fallback to native sans-serif on all platforms

**Type Scale (Tailwind defaults):**
*   **Page Title (H1):** `text-3xl font-bold` (30px)
*   **Section Title (H2):** `text-xl font-semibold` (20px)
*   **Card Title (H3):** `text-lg font-semibold` (18px)
*   **Body Large:** `text-base` (16px)
*   **Body Default:** `text-sm` (14px)
*   **Caption/Helper:** `text-sm text-gray-600` (14px, muted)

**Font Weights:**
*   Regular: `font-normal` (400)
*   Semibold: `font-semibold` (600) - for headings, emphasis
*   Bold: `font-bold` (700) - for page titles only

**Line Height:**
*   Body text: Default Tailwind (1.5-1.7)
*   Headings: Tighter (`leading-tight` or `leading-snug`)

### Spacing

**Base Unit:** 4px (Tailwind's spacing scale)

**Common Spacing:**
*   **Tight:** `space-y-2` (8px) - form fields within groups
*   **Default:** `space-y-4` or `space-y-6` (16-24px) - between sections
*   **Generous:** `space-y-8` (32px) - between major page sections
*   **Page Padding:** `p-6` on mobile, `p-10` on desktop (24px / 40px)

**Consistent Patterns:**
*   Cards: `p-4` or `p-6` padding inside (16-24px)
*   Buttons: `px-4 py-2` (horizontal 16px, vertical 8px)
*   Form inputs: `px-3 py-2` (horizontal 12px, vertical 8px)

### Border Radii

*   **Small (Inputs/Buttons):** `rounded-md` (6px)
*   **Medium (Cards):** `rounded-lg` (8px)
*   **Large (Modals/Major Elements):** `rounded-xl` (12px)
*   **Full (Pills/Badges):** `rounded-full`

**Project Standard:** Use `rounded-2xl` (16px) for cards and major UI elements to create modern, friendly feel (already established in codebase)

### Shadows

*   **Subtle:** `shadow-sm` - for input fields
*   **Card Default:** `shadow` - for elevated cards
*   **Hover State:** `shadow-md` - for interactive cards on hover
*   **Modal/Overlay:** `shadow-lg` or `shadow-xl`

## III. Component Standards

### Buttons

**Primary Button:**
```
bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md
transition-colors disabled:opacity-50 disabled:cursor-not-allowed
```
*   Use for primary action on page (e.g., "Find officials", "Draft email")
*   Maximum one primary button per viewport section

**Secondary Button:**
```
bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold px-4 py-2 rounded-md
transition-colors
```
*   Use for secondary actions (e.g., "Cancel", "Reset")

**Link-Style Button:**
```
text-blue-600 hover:text-blue-800 underline
```
*   Use for tertiary actions or inline navigation

**Button States:**
*   Hover: Darken background by one shade
*   Focus: Visible focus ring (`focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`)
*   Disabled: 50% opacity, cursor-not-allowed, no hover effects
*   Loading: Show spinner, disable interaction, maintain button width

### Form Inputs

**Text Input:**
```
border border-gray-300 rounded-md px-3 py-2 text-sm
focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
disabled:bg-gray-100 disabled:cursor-not-allowed
```

**Select/Dropdown:**
*   Same styling as text inputs
*   Include down arrow icon on right side
*   Use native `<select>` for accessibility unless custom behavior required

**Textarea:**
*   Same base styling as text input
*   Minimum height: `min-h-[120px]`
*   Resize vertical only: `resize-y`

**Labels:**
*   Always associate labels with inputs (`htmlFor` + `id`)
*   Use `font-semibold text-gray-700 mb-1 block` for labels
*   Place labels above inputs, not beside (better mobile UX)

**Helper Text:**
*   Use `text-sm text-gray-600 mt-1` for helpful hints
*   Use `text-sm text-red-600 mt-1` for error messages

**Validation States:**
*   Error: Red border (`border-red-500`), red helper text, error icon
*   Success: Green border (`border-green-500`), optional checkmark icon

### Cards (Official Cards)

**Standard Card:**
```
border border-gray-200 rounded-2xl p-6 space-y-4
hover:shadow-md transition-shadow
```

**Card Sections:**
*   Header: Official name, role, party (if available)
*   Contact info: Phone, email, website links (with icons)
*   Actions: Draft button, then draft display area
*   Clear visual hierarchy: Name is largest, most prominent

**Official Photo:**
*   If available: `w-16 h-16 rounded-full` (64px circle)
*   If unavailable: Show initials in colored circle background
*   Position: Top-left or inline with name depending on layout

### Loading States

**Page Loading:**
*   Use simple text: "Loading your officials…"
*   No complex spinners for civic context (keep it professional and calm)

**Button Loading:**
*   Replace button text with "Loading…" or "Drafting…"
*   Optional: Small spinner icon
*   Disable button, maintain width to prevent layout shift

**Skeleton Screens:**
*   For official cards while loading: gray placeholder boxes with subtle pulse animation
*   Use `animate-pulse bg-gray-200` for skeleton elements

### Empty States

**No Results:**
*   Clear, friendly message explaining why there are no results
*   Suggest action: "Enter an address above to find your officials"
*   Avoid generic "No data" - be specific and helpful

**Error States:**
*   Clear error message in plain language
*   Suggest remedy when possible
*   Use orange/amber for warnings, red only for critical errors

## IV. Page-Specific Design Patterns

### Main Page (app/page.tsx)

**Layout Structure:**
1. **Page Header:** Title + subtitle explaining the tool
2. **Address Form Section:** Clear, focused input area
3. **Issue Picker Section:** Numbered step (1), clear section boundary (`border-t`)
4. **Officials List Section:** Numbered step (2), conditional display

**Progressive Disclosure:**
*   Don't show issue picker until user enters address (or use mock data)
*   Don't enable "Contact officials" section until issue is selected
*   Use clear helper text to guide next step

**Visual Hierarchy:**
*   Page title is most prominent (`text-3xl font-bold`)
*   Section titles use numbered steps and medium weight (`text-xl font-semibold`)
*   Clear visual breaks between sections (`border-t pt-6`)

### Address Form (components/AddressForm.tsx)

**Input Requirements:**
*   Single text input for full address (city, state, or full street address)
*   Clear placeholder: "Enter your address (e.g., San Francisco, CA)"
*   Submit button: Primary blue button, clear label ("Find officials")
*   Full-width on mobile, constrained width on desktop (max-w-md or max-w-lg)

**States:**
*   Default: Ready for input
*   Loading: Button shows "Loading…", input disabled
*   Error: Red border, error message below input

### Issue Picker (components/IssuePicker.tsx)

**Form Layout:**
*   Vertical form layout (labels above inputs)
*   Logical grouping: Issue topic → Your stance → Optional details
*   Clear labels with helpful placeholder text
*   Use semantic HTML (`<select>`, `<textarea>`) for accessibility

**Field Hierarchy:**
1. **Issue (required):** Most prominent, first field
2. **Stance (required):** Second field, clear binary choice
3. **Optional fields:** Visually de-emphasized, clearly marked as optional

### Officials List (components/OfficialsList.tsx)

**Grid Layout:**
*   Single column on mobile
*   2 columns on tablet and desktop (`md:grid-cols-2`)
*   Consistent gap between cards (`gap-6`)
*   **Note:** 2 columns (not 3) on desktop provides better readability and prevents cramped card layouts

**Card Order:**
*   Federal officials first (President, Senators, Representatives)
*   Then state officials (Governor, State legislators)
*   Then local officials (Mayor, City council)
*   This matches user expectation of "most impactful first"

### Official Card (components/OfficialCard.tsx)

**Information Display:**
*   Name: Most prominent (`text-lg font-semibold`)
*   Role: Secondary prominence (`text-sm text-gray-600`)
*   Party: Subtle badge or text (if included)
*   Contact methods: Clear icons (phone, email, web) with links

**Draft Flow:**
1. **Initial State:** "Draft email" button prominent
2. **Loading State:** Button shows "Drafting…", disabled
3. **Draft Display:** Show draft in light gray box, "Send email" button (mailto link)
4. **Error State:** Clear error message, "Try again" button

**Mailto Link Button:**
*   Primary blue button
*   Clear label: "Send email to [Name]"
*   Opens default email client with pre-filled draft

## V. Interaction & Animation Guidelines

### Transitions

**Standard Timing:**
*   Fast interactions (hover, button press): `transition-colors duration-150`
*   Medium (card hover, shadow): `transition-shadow duration-200`
*   Slow (modal, drawer): `transition-all duration-300`

**Easing:**
*   Default: `ease-in-out` (Tailwind default)
*   Avoid custom easing curves unless necessary

### Hover States

**Interactive Elements:**
*   Buttons: Background color change + slight shadow increase
*   Cards: Shadow increase (`hover:shadow-md`)
*   Links: Color change + underline (if not already underlined)
*   Form inputs: Border color change on focus (not hover)

**Cursor:**
*   Clickable elements: `cursor-pointer`
*   Disabled elements: `cursor-not-allowed`
*   Text inputs: `cursor-text` (default)

### Focus States

**Keyboard Navigation:**
*   All interactive elements must have visible focus state
*   Use ring utility: `focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`
*   Never use `outline-none` without replacing with custom focus state

**Focus Order:**
*   Logical tab order following visual layout
*   Skip navigation link at top of page for screen readers (future enhancement)

## VI. Accessibility Requirements

### WCAG AA Compliance

**Color Contrast:**
*   Text on white: `#111827` (gray-900) = 15:1 contrast ratio ✓
*   Links: `#2563eb` (blue-600) = 4.5:1 contrast ratio ✓
*   Helper text: `#6b7280` (gray-600) = 7:1 contrast ratio ✓

**Keyboard Navigation:**
*   All functionality available via keyboard
*   Visible focus indicators on all interactive elements
*   Logical tab order (follows visual layout)
*   Enter key activates buttons and links
*   Esc key closes modals/dropdowns (future enhancement)

**Screen Reader Support:**
*   Semantic HTML (`<main>`, `<nav>`, `<form>`, `<button>`)
*   Associated labels for all form inputs
*   Alt text for all images (official photos)
*   ARIA labels for icon-only buttons
*   Loading state announcements (`aria-live` regions)

**Touch Targets:**
*   Minimum 44x44px for all interactive elements (WCAG AA)
*   Adequate spacing between touch targets (8px minimum)

### Form Accessibility

**Labels:**
*   Every input has an associated `<label>` with `htmlFor`
*   Labels are visible (not placeholder-only)

**Error Messages:**
*   Associated with inputs via `aria-describedby`
*   Announced to screen readers
*   Visible and clear (not color-only)

**Required Fields:**
*   Marked with asterisk and/or "required" text
*   Use `required` attribute on inputs

## VII. Responsive Design

### Breakpoints (Tailwind defaults)

*   **Mobile:** < 640px (default, no prefix)
*   **Tablet:** 640px - 1024px (`sm:` and `md:`)
*   **Desktop:** > 1024px (`lg:` and `xl:`)

### Mobile Design (< 640px)

**Layout:**
*   Single column layout for all content
*   Full-width cards and forms
*   Adequate padding: `p-6` (24px)
*   Comfortable touch targets (minimum 44x44px)

**Typography:**
*   Slightly smaller headings on mobile if needed
*   Maintain readability (minimum 16px body text to prevent zoom on iOS)

**Forms:**
*   Full-width inputs
*   Vertical label placement (never side-by-side)
*   Large, easy-to-tap buttons

### Tablet Design (640px - 1024px)

**Layout:**
*   2-column grid for official cards
*   Slightly more generous spacing
*   Maintain good use of whitespace

### Desktop Design (> 1024px)

**Layout:**
*   3-column grid for official cards
*   Maximum content width: `max-w-5xl` (80rem) centered
*   Generous spacing: `p-10` (40px)

**Considerations:**
*   Don't make text lines too long (max 70-80 characters for readability)
*   Use grid layouts effectively (don't waste horizontal space)

## VIII. Privacy & Trust Signals

### Transparent Data Handling

**No Data Storage:**
*   Clearly communicate that addresses and political positions are never stored
*   Consider adding a privacy notice near address input
*   "Your address is never stored. We only use it to find your representatives."

**Stateless Indicator:**
*   Could add a small badge or notice: "Privacy-first: no tracking, no data storage"
*   Builds trust in civic context

### Nonpartisan Design

**Avoid:**
*   Red or blue as primary brand colors (politically coded in US)
*   Political imagery or partisan symbols
*   Language that sounds affiliated with any party

**Embrace:**
*   Neutral blue (like civic institutions)
*   Professional, clean design
*   Inclusive language ("your representatives" not "your elected officials")

## IX. Performance Standards

### Core Web Vitals

**Largest Contentful Paint (LCP):** < 2.5s
*   Optimize image loading (official photos)
*   Use Next.js Image component for automatic optimization
*   Prioritize above-fold content

**First Input Delay (FID):** < 100ms
*   Minimize JavaScript bundle size
*   Use code splitting for AI/API integrations
*   Defer non-critical scripts

**Cumulative Layout Shift (CLS):** < 0.1
*   Reserve space for dynamic content (loading states)
*   Use skeleton screens to prevent layout shift
*   Define dimensions for images

### API Performance

**OpenAI Draft Generation:**
*   Show immediate loading state (don't leave user wondering)
*   Estimate time: "This usually takes 5-10 seconds"
*   Graceful error handling if API fails

**Edge Runtime:**
*   Already using edge runtime for API routes (good!)
*   Ensures fast response times globally

## X. Future Enhancements (Post-MVP)

### Planned Features to Design For

*   Phone script generation (similar UI to email drafts)
*   Bill context (show related legislation info)
*   Impact visualization (heat maps, aggregate data)
*   Social sharing (celebrate civic action)
*   Legislative tracking (follow bill status)

### Design System Scalability

**Component Library:**
*   Extract reusable components (Button, Input, Card, Badge)
*   Create shared variants and props
*   Document component usage

**Design Tokens:**
*   Consider moving to CSS variables or Tailwind config for tokens
*   Makes theme changes (including dark mode) easier

**Dark Mode:**
*   Design system should support dark mode
*   Implementation: `dark:` variants in Tailwind
*   User preference detection: `prefers-color-scheme`

## XI. Content & Tone

### Voice & Tone

**Characteristics:**
*   Clear, not clever
*   Professional, not stuffy
*   Encouraging, not pushy
*   Neutral, not partisan

**Examples:**
*   ✓ "Enter your address to find your representatives"
*   ✗ "Enter your address to find your reps!" (too casual)
*   ✓ "Contact your elected officials about issues you care about"
*   ✗ "Make your voice heard!" (too pushy)

### Microcopy

**Buttons:**
*   "Find officials" (not "Submit" or "Search")
*   "Draft email" (not "Generate" or "Create draft")
*   "Send email" (not "Send" - be clear about action)

**Helper Text:**
*   Specific and helpful (not generic)
*   "Enter your full address or just city and state" (not "Enter address")

**Error Messages:**
*   Plain language (not technical jargon)
*   "We couldn't find your representatives. Try a different address format." (not "API error 404")

## XII. Testing & Validation Checklist

Before considering any UI change complete, verify:

**Visual:**
*   ✓ Follows spacing scale (no magic numbers)
*   ✓ Uses design system colors (no random hex codes)
*   ✓ Typography scale is consistent
*   ✓ Border radii are consistent
*   ✓ Alignment is precise (no eyeballed positioning)

**Interactive:**
*   ✓ All interactive elements have hover states
*   ✓ All interactive elements have focus states
*   ✓ Loading states are implemented
*   ✓ Error states are handled gracefully

**Responsive:**
*   ✓ Tested at 375px (mobile)
*   ✓ Tested at 768px (tablet)
*   ✓ Tested at 1440px (desktop)
*   ✓ No horizontal scrolling
*   ✓ Touch targets are 44x44px minimum on mobile

**Accessible:**
*   ✓ Color contrast meets WCAG AA
*   ✓ Keyboard navigation works
*   ✓ Focus states are visible
*   ✓ Form labels are associated
*   ✓ Semantic HTML is used

**Performance:**
*   ✓ No layout shift when content loads
*   ✓ Images are optimized
*   ✓ Interactions feel snappy (<100ms)
