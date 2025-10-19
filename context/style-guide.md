# Civic Action Style Guide

## Brand Identity

### Mission Statement
Civic Action empowers every American to make their voice heard by their elected representatives through accessible, AI-powered communication tools.

### Brand Values
1. **Nonpartisan** - We serve all Americans regardless of political affiliation
2. **Privacy-First** - We never store addresses, political positions, or communication content
3. **Accessible** - Free for individual citizens, always
4. **Trustworthy** - Professional, transparent, and reliable

## Visual Identity

### Brand Colors

**Primary Palette:**
- **Primary Blue:** `#2563eb` (blue-600) - Civic institutions, trust, nonpartisan
- **Background:** `#ffffff` (white), `#f9fafb` (gray-50)
- **Text Primary:** `#111827` (gray-900)
- **Text Secondary:** `#6b7280` (gray-600)

**Semantic Palette:**
- **Success:** `#059669` (emerald-600)
- **Error:** `#dc2626` (red-600)
- **Warning:** `#d97706` (amber-600)
- **Info:** `#0284c7` (sky-600)

**Why These Colors:**
- Blue chosen to avoid partisan association (not Democratic blue, not Republican red)
- Professional, civic institution aesthetic
- Neutral grays for readability and trust

### Typography

**Font Stack:**
```css
font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

**Type Scale:**
- **Page Titles:** 30px (text-3xl), bold
- **Section Titles:** 20px (text-xl), semibold
- **Card Titles:** 18px (text-lg), semibold
- **Body:** 16px (text-base) or 14px (text-sm)
- **Captions:** 14px (text-sm), gray-600

**Font Weights:**
- Regular (400) - body text
- Semibold (600) - headings, emphasis
- Bold (700) - page titles only

### Spacing & Layout

**Spacing Scale (base 4px):**
- xs: 4px (space-1)
- sm: 8px (space-2)
- md: 16px (space-4)
- lg: 24px (space-6)
- xl: 32px (space-8)
- 2xl: 40px (space-10)

**Page Layout:**
- Max width: 80rem (max-w-5xl)
- Mobile padding: 24px (p-6)
- Desktop padding: 40px (p-10)
- Section spacing: 32px (space-y-8)

### Border Radius

**Consistent Rounding:**
- **Cards:** 16px (rounded-2xl) - modern, friendly
- **Buttons/Inputs:** 6px (rounded-md) - professional
- **Badges:** 9999px (rounded-full) - pills

### Shadows

**Elevation Scale:**
- **Subtle:** `shadow-sm` - inputs
- **Card:** `shadow` - default cards
- **Hover:** `shadow-md` - interactive cards
- **Modal:** `shadow-xl` - overlays

## Components

### Buttons

**Primary (Call-to-Action):**
```tsx
className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md transition-colors"
```
- Use for main action per section
- Examples: "Find officials", "Draft email", "Send email"

**Secondary (Alternative Action):**
```tsx
className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold px-4 py-2 rounded-md transition-colors"
```
- Use for less important actions
- Examples: "Cancel", "Reset", "Clear"

**Link Style (Tertiary):**
```tsx
className="text-blue-600 hover:text-blue-800 underline"
```
- Use for inline or low-priority actions

### Form Inputs

**Text Input:**
```tsx
className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
```

**Label:**
```tsx
className="block font-semibold text-gray-700 mb-1"
```

**Helper Text:**
```tsx
className="text-sm text-gray-600 mt-1"
```

**Error Text:**
```tsx
className="text-sm text-red-600 mt-1"
```

### Cards

**Official Card:**
```tsx
className="border border-gray-200 rounded-2xl p-6 space-y-4 hover:shadow-md transition-shadow"
```

**Content Structure:**
1. Official info (name, role, party)
2. Contact methods (phone, email, website)
3. Action (draft button → draft display)

## Voice & Tone

### Writing Principles

**Clear, Not Clever:**
- ✓ "Enter your address to find your representatives"
- ✗ "Let's find your peeps in Washington!"

**Professional, Not Stuffy:**
- ✓ "Contact your elected officials about issues you care about"
- ✗ "Engage your civic representatives in discourse regarding policy matters"

**Encouraging, Not Pushy:**
- ✓ "Make your voice heard"
- ✗ "You MUST contact your representatives NOW!"

**Neutral, Not Partisan:**
- ✓ "Your representatives"
- ✗ "Hold politicians accountable"

### Microcopy Examples

**Page Titles:**
- "Take action with your representatives"
- "Contact your elected officials"

**Button Labels:**
- "Find officials" (not "Submit" or "Search")
- "Draft email" (not "Generate email")
- "Send email to [Name]" (be specific)

**Helper Text:**
- "Enter your address (e.g., San Francisco, CA or full street address)"
- "This usually takes 5-10 seconds"
- "Your address is never stored"

**Loading States:**
- "Loading your officials…"
- "Drafting your email…"

**Empty States:**
- "Enter an address above to find your officials"
- "Select an issue above to enable drafting"

**Error Messages:**
- "We couldn't find your representatives. Try a different address format."
- "Something went wrong. Please try again."

## Iconography

### Icon Set
Using system/semantic icons where available, Font Awesome or Heroicons for custom icons.

**Common Icons:**
- 📞 Phone: Phone icon
- ✉️ Email: Envelope icon
- 🌐 Website: Globe icon
- ⚠️ Warning: Exclamation triangle
- ✓ Success: Check circle
- ℹ️ Info: Information circle

**Icon Size:**
- Small: 16px (w-4 h-4)
- Medium: 20px (w-5 h-5)
- Large: 24px (w-6 h-6)

**Icon Color:**
- Match text color for context
- Use semantic colors for status (green check, red error)

## Accessibility Guidelines

### Color Contrast
All text must meet WCAG AA standards:
- Body text (14-16px): 4.5:1 minimum
- Large text (18px+): 3:1 minimum

**Verified Combinations:**
- gray-900 on white: 15:1 ✓
- gray-600 on white: 7:1 ✓
- blue-600 on white: 4.5:1 ✓

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Visible focus states on all focusable elements
- Logical tab order following visual flow

### Screen Readers
- Semantic HTML (`<main>`, `<nav>`, `<form>`, `<button>`)
- Labels for all form inputs (`htmlFor` + `id`)
- Alt text for all meaningful images
- ARIA labels for icon-only buttons

### Touch Targets
- Minimum 44x44px for all interactive elements
- Adequate spacing between touch targets (8px+)

## Responsive Behavior

### Breakpoints
- **Mobile:** < 640px (default)
- **Tablet:** 640px - 1024px (sm:, md:)
- **Desktop:** > 1024px (lg:, xl:)

### Layout Patterns

**Mobile (<640px):**
- Single column
- Full-width cards
- Stacked form fields
- 24px padding

**Tablet (640px-1024px):**
- 2-column grid for official cards
- Maintained form layout
- 40px padding

**Desktop (>1024px):**
- 3-column grid for official cards
- Max-width container (max-w-5xl)
- Generous spacing

## Privacy & Trust

### Privacy Signals

**Prominent Placement:**
- Near address input: "Your address is never stored"
- Footer: Link to privacy policy
- About page: Detailed privacy commitment

**Key Messages:**
- "Privacy-first: no tracking, no data storage"
- "We never sell your data"
- "Open-source and transparent"

### Trust Indicators

**Nonpartisan Positioning:**
- "Serving all Americans, regardless of party"
- Show examples from both political perspectives
- Avoid any partisan colors or language

**Transparency:**
- Open-source code (link to GitHub)
- Clear about how AI works
- Honest about beta status and limitations

## Animation & Interaction

### Transition Timing
- **Fast:** 150ms - button hover, color change
- **Medium:** 200ms - shadow, transform
- **Slow:** 300ms - modal, drawer

### Hover States
- Buttons: Background color darkens
- Cards: Shadow increases
- Links: Color darkens, underline appears

### Loading States
- Immediate feedback (<100ms)
- Clear indication of progress
- Disable interaction during loading
- Maintain layout (no shift)

## Content Guidelines

### Political Neutrality

**Always Neutral:**
- Use "representatives" or "elected officials"
- Show all political parties equally
- Never favor one political perspective

**Avoid:**
- Partisan language ("fight", "resist", "defend")
- Political colors (red states, blue states)
- Ideological framing

### Inclusive Language

**Be Inclusive:**
- "All Americans" not "citizens" (some users may not be citizens)
- "Your representatives" not "your elected officials" (more accessible)
- Gender-neutral language throughout

**Accessibility:**
- Plain language (not technical jargon)
- Clear, simple sentences
- Active voice preferred

## Quality Checklist

Before any visual change is complete:

**Visual Consistency:**
- ✓ Uses design system colors (no custom hex)
- ✓ Follows spacing scale (no magic numbers)
- ✓ Typography is from type scale
- ✓ Border radius is consistent

**Interaction:**
- ✓ Hover states implemented
- ✓ Focus states visible
- ✓ Loading states handled
- ✓ Error states graceful

**Responsive:**
- ✓ Works at 375px (mobile)
- ✓ Works at 768px (tablet)
- ✓ Works at 1440px (desktop)
- ✓ No horizontal scroll

**Accessible:**
- ✓ WCAG AA contrast
- ✓ Keyboard navigable
- ✓ Screen reader friendly
- ✓ Touch targets 44x44px+

**Content:**
- ✓ Nonpartisan language
- ✓ Clear, plain language
- ✓ No jargon or technical terms
- ✓ Spelling and grammar correct

## Brand Don'ts

**Never:**
- ❌ Use red or blue as primary brand color
- ❌ Show political party colors prominently
- ❌ Use partisan language or imagery
- ❌ Make political jokes or commentary
- ❌ Favor one political perspective
- ❌ Use complex jargon or political terminology
- ❌ Store or track user data
- ❌ Show ads or sponsored content
- ❌ Compromise accessibility for aesthetics
- ❌ Use custom colors outside design system

**Always:**
- ✓ Maintain nonpartisan visual identity
- ✓ Use inclusive, accessible language
- ✓ Respect user privacy
- ✓ Follow design system consistently
- ✓ Prioritize clarity over cleverness
- ✓ Test across devices and browsers
- ✓ Ensure WCAG AA compliance
- ✓ Use semantic HTML
- ✓ Provide clear feedback for user actions
- ✓ Keep it simple and fast
