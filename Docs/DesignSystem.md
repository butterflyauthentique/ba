# Design System - Butterfly Authentique

## 1. Design Tokens

### Color Palette

#### Primary Colors
```css
:root {
  /* Primary Brand Colors */
  --primary-red: #e12a47;
  --primary-gray: #929793;
  
  /* Primary Color Variations */
  --primary-red-50: #fef2f2;
  --primary-red-100: #fee2e2;
  --primary-red-200: #fecaca;
  --primary-red-300: #fca5a5;
  --primary-red-400: #f87171;
  --primary-red-500: #e12a47;
  --primary-red-600: #dc2626;
  --primary-red-700: #b91c1c;
  --primary-red-800: #991b1b;
  --primary-red-900: #7f1d1d;
  
  --primary-gray-50: #f9fafb;
  --primary-gray-100: #f3f4f6;
  --primary-gray-200: #e5e7eb;
  --primary-gray-300: #d1d5db;
  --primary-gray-400: #9ca3af;
  --primary-gray-500: #929793;
  --primary-gray-600: #4b5563;
  --primary-gray-700: #374151;
  --primary-gray-800: #1f2937;
  --primary-gray-900: #111827;
}
```

#### Secondary Colors
```css
:root {
  /* Secondary Brand Colors */
  --warm-cream: #f8f6f1;
  --deep-navy: #1a1a2e;
  --soft-gold: #d4af37;
  --muted-sage: #9caa8b;
  --pure-white: #ffffff;
  
  /* Secondary Color Variations */
  --warm-cream-50: #fefefe;
  --warm-cream-100: #fdfcf9;
  --warm-cream-200: #f8f6f1;
  --warm-cream-300: #f0ede6;
  --warm-cream-400: #e8e4db;
  --warm-cream-500: #d4d0c7;
  
  --deep-navy-50: #f8f9fa;
  --deep-navy-100: #e9ecef;
  --deep-navy-200: #dee2e6;
  --deep-navy-300: #ced4da;
  --deep-navy-400: #adb5bd;
  --deep-navy-500: #6c757d;
  --deep-navy-600: #495057;
  --deep-navy-700: #343a40;
  --deep-navy-800: #212529;
  --deep-navy-900: #1a1a2e;
  
  --soft-gold-50: #fefce8;
  --soft-gold-100: #fef3c7;
  --soft-gold-200: #fde68a;
  --soft-gold-300: #fcd34d;
  --soft-gold-400: #fbbf24;
  --soft-gold-500: #d4af37;
  --soft-gold-600: #d97706;
  --soft-gold-700: #b45309;
  --soft-gold-800: #92400e;
  --soft-gold-900: #78350f;
}
```

#### Semantic Colors
```css
:root {
  /* Success Colors */
  --success-50: #f0fdf4;
  --success-100: #dcfce7;
  --success-500: #22c55e;
  --success-600: #16a34a;
  --success-700: #15803d;
  
  /* Warning Colors */
  --warning-50: #fffbeb;
  --warning-100: #fef3c7;
  --warning-500: #f59e0b;
  --warning-600: #d97706;
  --warning-700: #b45309;
  
  /* Error Colors */
  --error-50: #fef2f2;
  --error-100: #fee2e2;
  --error-500: #ef4444;
  --error-600: #dc2626;
  --error-700: #b91c1c;
  
  /* Info Colors */
  --info-50: #eff6ff;
  --info-100: #dbeafe;
  --info-500: #3b82f6;
  --info-600: #2563eb;
  --info-700: #1d4ed8;
}
```

### Typography

#### Font Families
```css
:root {
  /* Primary Font - Inter */
  --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  
  /* Secondary Font - Playfair Display */
  --font-secondary: 'Playfair Display', Georgia, serif;
  
  /* Accent Font - Dancing Script */
  --font-accent: 'Dancing Script', cursive;
}
```

#### Font Sizes
```css
:root {
  /* Base Font Size */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
  --text-5xl: 3rem;      /* 48px */
  --text-6xl: 3.75rem;   /* 60px */
  --text-7xl: 4.5rem;    /* 72px */
  --text-8xl: 6rem;      /* 96px */
  --text-9xl: 8rem;      /* 128px */
}
```

#### Font Weights
```css
:root {
  --font-thin: 100;
  --font-extralight: 200;
  --font-light: 300;
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-extrabold: 800;
  --font-black: 900;
}
```

#### Line Heights
```css
:root {
  --leading-none: 1;
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 2;
}
```

### Spacing Scale
```css
:root {
  --space-0: 0;
  --space-px: 1px;
  --space-0-5: 0.125rem;  /* 2px */
  --space-1: 0.25rem;     /* 4px */
  --space-1-5: 0.375rem;  /* 6px */
  --space-2: 0.5rem;      /* 8px */
  --space-2-5: 0.625rem;  /* 10px */
  --space-3: 0.75rem;     /* 12px */
  --space-3-5: 0.875rem;  /* 14px */
  --space-4: 1rem;        /* 16px */
  --space-5: 1.25rem;     /* 20px */
  --space-6: 1.5rem;      /* 24px */
  --space-7: 1.75rem;     /* 28px */
  --space-8: 2rem;        /* 32px */
  --space-9: 2.25rem;     /* 36px */
  --space-10: 2.5rem;     /* 40px */
  --space-11: 2.75rem;    /* 44px */
  --space-12: 3rem;       /* 48px */
  --space-14: 3.5rem;     /* 56px */
  --space-16: 4rem;       /* 64px */
  --space-20: 5rem;       /* 80px */
  --space-24: 6rem;       /* 96px */
  --space-28: 7rem;       /* 112px */
  --space-32: 8rem;       /* 128px */
  --space-36: 9rem;       /* 144px */
  --space-40: 10rem;      /* 160px */
  --space-44: 11rem;      /* 176px */
  --space-48: 12rem;      /* 192px */
  --space-52: 13rem;      /* 208px */
  --space-56: 14rem;      /* 224px */
  --space-60: 15rem;      /* 240px */
  --space-64: 16rem;      /* 256px */
  --space-72: 18rem;      /* 288px */
  --space-80: 20rem;      /* 320px */
  --space-96: 24rem;      /* 384px */
}
```

### Border Radius
```css
:root {
  --radius-none: 0;
  --radius-sm: 0.125rem;   /* 2px */
  --radius-base: 0.25rem;  /* 4px */
  --radius-md: 0.375rem;   /* 6px */
  --radius-lg: 0.5rem;     /* 8px */
  --radius-xl: 0.75rem;    /* 12px */
  --radius-2xl: 1rem;      /* 16px */
  --radius-3xl: 1.5rem;    /* 24px */
  --radius-full: 9999px;
}
```

### Shadows
```css
:root {
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-base: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  --shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  --shadow-inner: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);
}
```

## 2. Component Library

### Buttons

#### Primary Button
```css
.btn-primary {
  background-color: var(--primary-red-500);
  color: var(--pure-white);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-lg);
  font-weight: var(--font-semibold);
  font-size: var(--text-base);
  line-height: var(--leading-normal);
  border: none;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  min-height: 44px;
}

.btn-primary:hover {
  background-color: var(--primary-red-600);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-primary:active {
  background-color: var(--primary-red-700);
  transform: translateY(0);
}

.btn-primary:disabled {
  background-color: var(--primary-gray-300);
  color: var(--primary-gray-500);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
```

#### Secondary Button
```css
.btn-secondary {
  background-color: transparent;
  color: var(--primary-red-500);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-lg);
  font-weight: var(--font-semibold);
  font-size: var(--text-base);
  line-height: var(--leading-normal);
  border: 2px solid var(--primary-red-500);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  min-height: 44px;
}

.btn-secondary:hover {
  background-color: var(--primary-red-500);
  color: var(--pure-white);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-secondary:active {
  background-color: var(--primary-red-600);
  border-color: var(--primary-red-600);
  transform: translateY(0);
}

.btn-secondary:disabled {
  background-color: transparent;
  color: var(--primary-gray-400);
  border-color: var(--primary-gray-300);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
```

#### Icon Button
```css
.btn-icon {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-full);
  background-color: var(--primary-gray-100);
  color: var(--primary-gray-700);
  border: none;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-icon:hover {
  background-color: var(--primary-gray-200);
  color: var(--primary-gray-800);
  transform: scale(1.05);
}

.btn-icon:active {
  background-color: var(--primary-gray-300);
  transform: scale(1);
}
```

### Forms

#### Input Field
```css
.input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border: 2px solid var(--primary-gray-200);
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  line-height: var(--leading-normal);
  color: var(--primary-gray-900);
  background-color: var(--pure-white);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 44px;
}

.input:focus {
  outline: none;
  border-color: var(--primary-red-500);
  box-shadow: 0 0 0 3px rgb(225 42 71 / 0.1);
}

.input:disabled {
  background-color: var(--primary-gray-50);
  color: var(--primary-gray-500);
  cursor: not-allowed;
}

.input.error {
  border-color: var(--error-500);
}

.input.error:focus {
  border-color: var(--error-500);
  box-shadow: 0 0 0 3px rgb(239 68 68 / 0.1);
}
```

#### Label
```css
.label {
  display: block;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--primary-gray-700);
  margin-bottom: var(--space-2);
  line-height: var(--leading-normal);
}

.label.required::after {
  content: " *";
  color: var(--error-500);
}
```

#### Error Message
```css
.error-message {
  font-size: var(--text-sm);
  color: var(--error-600);
  margin-top: var(--space-1);
  line-height: var(--leading-normal);
  display: flex;
  align-items: center;
  gap: var(--space-1);
}
```

### Cards

#### Product Card
```css
.product-card {
  background-color: var(--pure-white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-base);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid var(--primary-gray-100);
}

.product-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.product-card__image {
  width: 100%;
  height: 240px;
  object-fit: cover;
  background-color: var(--primary-gray-50);
}

.product-card__content {
  padding: var(--space-4);
}

.product-card__title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--primary-gray-900);
  margin-bottom: var(--space-2);
  line-height: var(--leading-tight);
}

.product-card__price {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--primary-red-500);
  margin-bottom: var(--space-3);
}

.product-card__actions {
  display: flex;
  gap: var(--space-2);
  align-items: center;
}
```

#### Blog Card
```css
.blog-card {
  background-color: var(--pure-white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-base);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid var(--primary-gray-100);
}

.blog-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.blog-card__image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  background-color: var(--primary-gray-50);
}

.blog-card__content {
  padding: var(--space-4);
}

.blog-card__category {
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  color: var(--primary-red-500);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--space-2);
}

.blog-card__title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--primary-gray-900);
  margin-bottom: var(--space-2);
  line-height: var(--leading-tight);
}

.blog-card__excerpt {
  font-size: var(--text-sm);
  color: var(--primary-gray-600);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-3);
}

.blog-card__meta {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--text-xs);
  color: var(--primary-gray-500);
}
```

### Navigation

#### Header
```css
.header {
  background-color: var(--pure-white);
  border-bottom: 1px solid var(--primary-gray-200);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(8px);
  background-color: rgb(255 255 255 / 0.95);
}

.header__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-4);
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
}

.header__logo {
  font-family: var(--font-secondary);
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--primary-red-500);
  text-decoration: none;
}

.header__nav {
  display: flex;
  align-items: center;
  gap: var(--space-6);
}

.header__nav-link {
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  color: var(--primary-gray-700);
  text-decoration: none;
  transition: color 0.2s ease;
  position: relative;
}

.header__nav-link:hover {
  color: var(--primary-red-500);
}

.header__nav-link.active {
  color: var(--primary-red-500);
}

.header__nav-link.active::after {
  content: "";
  position: absolute;
  bottom: -8px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: var(--primary-red-500);
  border-radius: var(--radius-full);
}
```

#### Mobile Navigation
```css
.mobile-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--pure-white);
  z-index: 200;
  transform: translateX(-100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.mobile-nav.open {
  transform: translateX(0);
}

.mobile-nav__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4);
  border-bottom: 1px solid var(--primary-gray-200);
}

.mobile-nav__close {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-full);
  background-color: var(--primary-gray-100);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-nav__menu {
  padding: var(--space-4);
}

.mobile-nav__item {
  margin-bottom: var(--space-2);
}

.mobile-nav__link {
  display: block;
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-lg);
  font-weight: var(--font-medium);
  color: var(--primary-gray-700);
  text-decoration: none;
  border-radius: var(--radius-lg);
  transition: all 0.2s ease;
}

.mobile-nav__link:hover {
  background-color: var(--primary-gray-50);
  color: var(--primary-red-500);
}

.mobile-nav__link.active {
  background-color: var(--primary-red-50);
  color: var(--primary-red-500);
}
```

## 3. Layout Components

### Container
```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-4);
}

.container.small {
  max-width: 768px;
}

.container.large {
  max-width: 1400px;
}
```

### Grid System
```css
.grid {
  display: grid;
  gap: var(--space-6);
}

.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }

@media (max-width: 768px) {
  .grid-cols-2,
  .grid-cols-3,
  .grid-cols-4 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .grid-cols-3,
  .grid-cols-4 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
```

### Section
```css
.section {
  padding: var(--space-16) 0;
}

.section.small {
  padding: var(--space-8) 0;
}

.section.large {
  padding: var(--space-24) 0;
}

.section__header {
  text-align: center;
  margin-bottom: var(--space-12);
}

.section__title {
  font-family: var(--font-secondary);
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  color: var(--primary-gray-900);
  margin-bottom: var(--space-4);
  line-height: var(--leading-tight);
}

.section__subtitle {
  font-size: var(--text-lg);
  color: var(--primary-gray-600);
  max-width: 600px;
  margin: 0 auto;
  line-height: var(--leading-relaxed);
}
```

## 4. Utility Classes

### Spacing Utilities
```css
.m-0 { margin: 0; }
.m-1 { margin: var(--space-1); }
.m-2 { margin: var(--space-2); }
.m-4 { margin: var(--space-4); }
.m-6 { margin: var(--space-6); }
.m-8 { margin: var(--space-8); }

.mt-0 { margin-top: 0; }
.mt-1 { margin-top: var(--space-1); }
.mt-2 { margin-top: var(--space-2); }
.mt-4 { margin-top: var(--space-4); }
.mt-6 { margin-top: var(--space-6); }
.mt-8 { margin-top: var(--space-8); }

.mb-0 { margin-bottom: 0; }
.mb-1 { margin-bottom: var(--space-1); }
.mb-2 { margin-bottom: var(--space-2); }
.mb-4 { margin-bottom: var(--space-4); }
.mb-6 { margin-bottom: var(--space-6); }
.mb-8 { margin-bottom: var(--space-8); }

.p-0 { padding: 0; }
.p-1 { padding: var(--space-1); }
.p-2 { padding: var(--space-2); }
.p-4 { padding: var(--space-4); }
.p-6 { padding: var(--space-6); }
.p-8 { padding: var(--space-8); }
```

### Text Utilities
```css
.text-xs { font-size: var(--text-xs); }
.text-sm { font-size: var(--text-sm); }
.text-base { font-size: var(--text-base); }
.text-lg { font-size: var(--text-lg); }
.text-xl { font-size: var(--text-xl); }
.text-2xl { font-size: var(--text-2xl); }
.text-3xl { font-size: var(--text-3xl); }
.text-4xl { font-size: var(--text-4xl); }

.font-thin { font-weight: var(--font-thin); }
.font-light { font-weight: var(--font-light); }
.font-normal { font-weight: var(--font-normal); }
.font-medium { font-weight: var(--font-medium); }
.font-semibold { font-weight: var(--font-semibold); }
.font-bold { font-weight: var(--font-bold); }

.text-left { text-align: left; }
.text-center { text-align: center; }
.text-right { text-align: right; }

.text-red { color: var(--primary-red-500); }
.text-gray { color: var(--primary-gray-500); }
.text-white { color: var(--pure-white); }
```

### Display Utilities
```css
.block { display: block; }
.inline-block { display: inline-block; }
.inline { display: inline; }
.flex { display: flex; }
.inline-flex { display: inline-flex; }
.grid { display: grid; }
.hidden { display: none; }

.flex-col { flex-direction: column; }
.flex-row { flex-direction: row; }
.flex-wrap { flex-wrap: wrap; }
.flex-nowrap { flex-wrap: nowrap; }

.items-start { align-items: flex-start; }
.items-center { align-items: center; }
.items-end { align-items: flex-end; }

.justify-start { justify-content: flex-start; }
.justify-center { justify-content: center; }
.justify-end { justify-content: flex-end; }
.justify-between { justify-content: space-between; }
.justify-around { justify-content: space-around; }
```

## 5. Animation & Transitions

### Standard Transitions
```css
.transition {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.transition-fast {
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

.transition-slow {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Hover Effects
```css
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.hover-scale:hover {
  transform: scale(1.05);
}

.hover-glow:hover {
  box-shadow: 0 0 20px rgb(225 42 71 / 0.3);
}
```

### Loading States
```css
.loading {
  position: relative;
  overflow: hidden;
}

.loading::after {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgb(255 255 255 / 0.4),
    transparent
  );
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% { left: -100%; }
  100% { left: 100%; }
}
```

## 6. Responsive Design

### Breakpoints
```css
/* Mobile First Approach */
/* Base styles for mobile (320px+) */

/* Tablet (768px+) */
@media (min-width: 768px) {
  .md\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .md\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .md\:text-lg { font-size: var(--text-lg); }
  .md\:text-xl { font-size: var(--text-xl); }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .lg\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .lg\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .lg\:text-2xl { font-size: var(--text-2xl); }
  .lg\:text-3xl { font-size: var(--text-3xl); }
}

/* Large Desktop (1280px+) */
@media (min-width: 1280px) {
  .xl\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .xl\:grid-cols-5 { grid-template-columns: repeat(5, minmax(0, 1fr)); }
}
```

## 7. Accessibility

### Focus States
```css
.focus-visible:focus-visible {
  outline: 2px solid var(--primary-red-500);
  outline-offset: 2px;
}

.focus-ring:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgb(225 42 71 / 0.1);
}
```

### Screen Reader Only
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 8. Dark Mode Support

### Dark Mode Variables
```css
@media (prefers-color-scheme: dark) {
  :root {
    --primary-gray-50: #111827;
    --primary-gray-100: #1f2937;
    --primary-gray-200: #374151;
    --primary-gray-300: #4b5563;
    --primary-gray-400: #6b7280;
    --primary-gray-500: #9ca3af;
    --primary-gray-600: #d1d5db;
    --primary-gray-700: #e5e7eb;
    --primary-gray-800: #f3f4f6;
    --primary-gray-900: #f9fafb;
    
    --pure-white: #111827;
    --warm-cream: #1f2937;
  }
}
```

This comprehensive design system provides all the necessary tokens, components, and utilities for building a consistent and beautiful e-commerce experience for Butterfly Authentique. 