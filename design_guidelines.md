# Brand Kit AI - Design Guidelines

## Design Approach

**Selected Approach**: Design System with Modern SaaS Aesthetics

Drawing inspiration from Linear's clean interface, Notion's card-based layouts, and Stripe's professional restraint. This SaaS platform requires:
- Efficiency-focused dashboard design for power users
- Clear visual hierarchy for subscription tiers
- Professional presentation suitable for B2B positioning
- Scalable component system supporting Free → Pro → Enterprise features

## Typography System

**Primary Font**: Inter (Google Fonts)
- Headings: Inter Semi-Bold (600) and Bold (700)
- Body: Inter Regular (400) and Medium (500)
- UI Elements: Inter Medium (500)

**Type Scale**:
- Hero/Page Titles: text-4xl to text-5xl (36-48px), font-bold
- Section Headers: text-2xl to text-3xl (24-30px), font-semibold
- Card Titles: text-lg to text-xl (18-20px), font-semibold
- Body Text: text-base (16px), font-normal
- Small Text/Captions: text-sm (14px), font-medium
- Micro Text (timestamps, labels): text-xs (12px), font-normal

## Layout System

**Spacing Primitives**: Consistently use Tailwind units of 2, 4, 6, 8, 12, 16, 20, and 24
- Component padding: p-4 to p-6 (small cards), p-6 to p-8 (large cards)
- Section spacing: py-12 to py-16 (mobile), py-16 to py-24 (desktop)
- Gap between elements: gap-4 for tight groupings, gap-6 to gap-8 for card grids

**Container Strategy**:
- Dashboard content: max-w-7xl mx-auto with px-6
- Form containers: max-w-md to max-w-lg for optimal readability
- Full-width sections: w-full with inner max-w-7xl constraint

**Grid Patterns**:
- Brand kit gallery: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
- Template marketplace: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Generation history: grid-cols-2 md:grid-cols-3 lg:grid-cols-4 (tighter spacing)
- Feature comparison table: grid-cols-1 md:grid-cols-3 (subscription tiers)

## Component Library

### Navigation Structure

**Sidebar Navigation** (Desktop):
- Fixed left sidebar, w-64, full height
- Logo/branding at top with padding p-6
- Navigation items with icons (Heroicons), py-3 px-4 spacing
- Subscription tier badge prominently displayed
- User profile section at bottom
- Collapsible sections for organized feature groups

**Mobile Navigation**:
- Sticky top header with hamburger menu
- Slide-out drawer navigation with backdrop overlay
- Same hierarchy as desktop but stacked vertically

### Dashboard Components

**Brand Kit Cards**:
- Aspect ratio 16:9 with rounded-xl corners
- Thumbnail preview occupying top 2/3 of card
- Title and metadata in bottom 1/3 with p-4 padding
- Hover state: subtle lift effect with shadow-lg
- Action buttons (edit, download, delete) appear on hover
- Folder/organization tags displayed as pills

**AI Generator Interface**:
- Split layout: 60% preview canvas, 40% controls panel (desktop)
- Stacked layout for mobile: controls first, preview below
- Real-time parameter adjustment sliders with value displays
- Aspect ratio selector as prominent button group
- Large "Generate" CTA button, full-width in controls panel
- Progress indicator with percentage and estimated time

**Generation History Grid**:
- Masonry-style grid for varied aspect ratios
- Each thumbnail clickable for full-screen view
- Overlay on hover showing metadata (date, parameters, download count)
- Checkbox select mode for batch operations
- Infinite scroll loading with skeleton states

### Forms & Inputs

**File Upload Zones**:
- Dashed border drag-and-drop area, min-h-48
- Icon-centered with clear instructions
- File preview thumbnails in grid below upload zone
- Progress bars for upload status
- Remove button on hover over previews

**Subscription Tier Cards**:
- Three-column layout on desktop (Free, Pro, Enterprise)
- Each card: rounded-2xl, p-8, equal height
- Tier name: text-2xl font-bold
- Price: text-5xl font-bold with monthly designation
- Feature list with checkmark icons, gap-3 between items
- CTA button at bottom, full-width within card
- "Current Plan" badge for active tier
- "Popular" badge for Pro tier with subtle accent treatment

### Marketplace Components

**Template Cards**:
- 3:4 aspect ratio for vertical template previews
- Preview image with rounded-t-xl
- Creator info and pricing in bottom section with p-4
- Star rating display with review count
- Purchase button and preview button side-by-side
- Category tags as small pills

**Template Detail Modal**:
- Full-screen overlay with max-w-6xl centered container
- Large preview carousel on left (60%)
- Details, pricing, purchase CTA on right (40%)
- Creator profile section with avatar and bio
- Related templates grid at bottom

### Feature Gating & Upgrade Prompts

**Locked Feature Overlays**:
- Semi-transparent overlay on locked features
- Lock icon centered with clear upgrade message
- "Upgrade to Pro" button as prominent CTA
- Brief feature benefit description
- Dismiss option for non-critical features

**Quota Indicators**:
- Progress bar showing usage (e.g., "3/5 generations used")
- Displayed in header for easy visibility
- Warning state when approaching limit (80%+)
- Upgrade prompt when limit reached

## Images

**Hero Section** (Marketing/Landing):
- Large hero image: Full-width banner showcasing AI-generated brand assets
- Image placement: Background with gradient overlay for text readability
- Dimensions: 16:9 aspect ratio, full viewport width
- Content: Grid of sample logos, business cards, and social graphics demonstrating platform capabilities
- Text overlay: Centered with buttons on blurred background panels

**Dashboard No-Content State**:
- Illustration-style image for empty brand kit library
- Placement: Center of empty grid area
- Style: Line art or minimalist illustration encouraging first creation

**Template Marketplace**:
- High-quality preview images for each template
- User-uploaded screenshots and mockups
- Organized in responsive grid layout

**Onboarding Flow**:
- Step illustrations guiding users through first AI generation
- Small, supportive images alongside tutorial text
- Placed to the right of instructional text on desktop

## Interaction Patterns

**Loading States**:
- Skeleton screens matching exact layout of loaded content
- Shimmer animation for data fetching
- Spinner with percentage for AI generation progress
- Optimistic UI updates for instant feedback

**Micro-interactions** (Minimal, purposeful):
- Smooth transitions between subscription tiers (ease-in-out 300ms)
- Button press effect: subtle scale transform
- Card hover: gentle lift with increased shadow
- Success confetti burst on subscription upgrade only
- Toast notifications slide in from top-right

**Drag & Drop**:
- Visual feedback on drag over upload zones
- File ghost preview follows cursor
- Drop zone highlights when valid file detected

## Responsive Behavior

**Breakpoints**:
- Mobile: < 768px (single column, stacked layouts)
- Tablet: 768px - 1024px (2-column grids, condensed sidebar)
- Desktop: > 1024px (full multi-column, expanded sidebar)

**Mobile Adaptations**:
- Sidebar converts to bottom tab bar for key actions
- Cards stack vertically with full-width
- Generator interface: controls collapse into expandable panel
- Template previews reduce to 2 columns maximum

## Accessibility

- Focus indicators: 2px outline offset by 2px on all interactive elements
- Skip navigation link for keyboard users
- ARIA labels on all icon-only buttons
- Form inputs with associated labels and error states
- Sufficient contrast ratios throughout (AA compliance minimum)

## Professional Polish

**Glassmorphism Effects**:
- Modal backgrounds: backdrop-blur-md with semi-transparent background
- Floating panels: blur effect with subtle border

**Gradient Accents**:
- Used sparingly on CTAs and premium feature highlights
- Subtle gradients on hero sections and headers
- Never on body text or functional UI elements

**Watermarking** (Free Tier):
- Semi-transparent diagonal text overlay on generated images
- Positioned to be visible but not destructive
- Removed completely for Pro/Enterprise users

**Premium Indicators**:
- Crown icon or "PRO" badge on premium templates
- Distinct visual treatment for Enterprise features
- Upgrade callouts in consistent positioning across UI