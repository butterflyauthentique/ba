# Mobile-First Design System Guidelines - Butterfly Authentique

## 1. Design Foundations

### Spacing Scale (rem)
| Token | Value | Usage |
|-------|-------|-------|
| `space-xs` | 0.25rem (4px) | Minimal spacing, tight layouts |
| `space-sm` | 0.5rem (8px) | Small gaps, icon spacing |
| `space-md` | 1rem (16px) | Standard spacing, component padding |
| `space-lg` | 1.5rem (24px) | Section spacing, card padding |
| `space-xl` | 2rem (32px) | Large sections, page margins |
| `space-2xl` | 3rem (48px) | Hero sections, major breaks |
| `space-3xl` | 4rem (64px) | Page sections, content blocks |

### Border Radius Scale
| Token | Value | Usage |
|-------|-------|-------|
| `radius-none` | 0 | Sharp edges, modern look |
| `radius-sm` | 0.25rem (4px) | Small buttons, inputs |
| `radius-md` | 0.5rem (8px) | Cards, containers |
| `radius-lg` | 1rem (16px) | Large cards, modals |
| `radius-xl` | 1.5rem (24px) | Hero sections, featured content |
| `radius-full` | 9999px | Pills, avatars, circular elements |

### Grid & Layout System
- **Container Max Width**: 1200px for desktop
- **Grid Columns**: 12-column system
- **Gutters**: 1rem (16px) on mobile, 1.5rem (24px) on tablet, 2rem (32px) on desktop
- **Breakpoints**:
  - Mobile: 320px - 767px
  - Tablet: 768px - 1023px
  - Desktop: 1024px+

## 2. Component Library

### AppBar / Header
```css
.header {
  height: 60px (mobile) / 80px (desktop);
  background: white;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 100;
}
```

**Features:**
- Logo on left, navigation on right
- Mobile hamburger menu
- Search functionality
- Shopping cart icon with badge
- User account dropdown

### Navigation Drawer / Tab Bar
```css
.nav-drawer {
  width: 280px;
  background: white;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  transform: translateX(-100%);
  transition: transform 0.3s ease;
}
```

**Features:**
- Smooth slide-in animation
- Overlay background
- Close button
- Category navigation
- User account section

### Cards
```css
.card {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  padding: 1rem;
  transition: box-shadow 0.2s ease;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
```

**Product Card Features:**
- Product image (16:9 aspect ratio)
- Product title and price
- Quick add to cart button
- Wishlist icon
- Rating display

### Buttons
```css
.btn-primary {
  background: #e12a47;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-secondary {
  background: transparent;
  color: #e12a47;
  border: 2px solid #e12a47;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
}

.btn-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

**Button States:**
- Default, Hover, Active, Disabled
- Loading state with spinner
- Success/Error feedback

### Forms & Inputs
```css
.input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: #e12a47;
  box-shadow: 0 0 0 3px rgba(225, 42, 71, 0.1);
}
```

**Form Features:**
- Floating labels
- Validation states
- Error messages
- Success indicators
- Auto-complete support

### Modal / Bottom Sheet
```css
.modal {
  background: white;
  border-radius: 1rem 1rem 0 0;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
```

**Modal Features:**
- Backdrop overlay
- Close button
- Swipe to dismiss (mobile)
- Keyboard navigation
- Focus trap

### Lists & Tables
```css
.list-item {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}
```

## 3. Motion & Interaction

### Standard Easing
```css
/* Standard transitions */
transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

/* Smooth animations */
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

/* Bouncy interactions */
transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### Motion Duration Scale
| Token | Value | Usage |
|-------|-------|-------|
| `duration-fast` | 150ms | Hover states, micro-interactions |
| `duration-normal` | 250ms | Standard transitions |
| `duration-slow` | 350ms | Page transitions, complex animations |
| `duration-slower` | 500ms | Hero animations, loading states |

### Haptic Feedback
- **Light Impact**: Button taps, form submissions
- **Medium Impact**: Navigation changes, modal opens
- **Heavy Impact**: Error states, success confirmations

### Sound Design
- **Subtle click sounds**: Button interactions
- **Success chime**: Order confirmations
- **Error tone**: Validation failures
- **Volume control**: User preference setting

## 4. Responsive Design Patterns

### Mobile-First Approach
1. **Design for mobile first** (320px width)
2. **Progressive enhancement** for larger screens
3. **Touch-friendly interactions** (44px minimum touch targets)
4. **Thumb-friendly navigation** (bottom placement)

### Breakpoint Strategy
```css
/* Mobile */
@media (max-width: 767px) {
  /* Mobile-specific styles */
}

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) {
  /* Tablet-specific styles */
}

/* Desktop */
@media (min-width: 1024px) {
  /* Desktop-specific styles */
}
```

### Content Adaptation
- **Typography scaling**: Responsive font sizes
- **Image optimization**: Different sizes for different screens
- **Layout adjustments**: Stack to single column on mobile
- **Navigation patterns**: Hamburger menu on mobile, horizontal on desktop

## 5. Accessibility Guidelines

### Color & Contrast
- **Text contrast**: 4.5:1 minimum ratio
- **Large text**: 3:1 minimum ratio
- **Interactive elements**: 3:1 minimum ratio
- **Color independence**: Information not conveyed by color alone

### Touch Targets
- **Minimum size**: 44px × 44px
- **Spacing**: 8px minimum between targets
- **Visual feedback**: Clear pressed states

### Keyboard Navigation
- **Tab order**: Logical flow through interface
- **Focus indicators**: Visible focus states
- **Skip links**: Jump to main content
- **Keyboard shortcuts**: Common actions

### Screen Reader Support
- **Semantic HTML**: Proper heading structure
- **ARIA labels**: Descriptive labels for interactive elements
- **Alt text**: Descriptive image alternatives
- **Live regions**: Dynamic content announcements

## 6. Performance Guidelines

### Loading States
- **Skeleton screens**: Placeholder content while loading
- **Progressive loading**: Load critical content first
- **Lazy loading**: Load images and non-critical content on demand
- **Caching strategies**: Optimize for repeat visits

### Animation Performance
- **GPU acceleration**: Use transform and opacity for animations
- **Reduce motion**: Respect user preferences
- **Frame rate**: Target 60fps for smooth animations
- **Memory management**: Clean up event listeners

### Image Optimization
- **WebP format**: Modern image format with fallbacks
- **Responsive images**: Different sizes for different screens
- **Lazy loading**: Load images as they enter viewport
- **Compression**: Optimize file sizes without quality loss 