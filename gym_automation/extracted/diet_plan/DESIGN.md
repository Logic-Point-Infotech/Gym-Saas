---
name: Kinetic Dark
colors:
  surface: '#0d1419'
  surface-dim: '#0d1419'
  surface-bright: '#333a40'
  surface-container-lowest: '#080f14'
  surface-container-low: '#151c22'
  surface-container: '#192026'
  surface-container-high: '#242b30'
  surface-container-highest: '#2f363b'
  on-surface: '#dce3ea'
  on-surface-variant: '#dec0bb'
  inverse-surface: '#dce3ea'
  inverse-on-surface: '#2a3137'
  outline: '#a68a87'
  outline-variant: '#57423f'
  surface-tint: '#ffb4aa'
  primary: '#ffb4aa'
  on-primary: '#660706'
  primary-container: '#ff7a6b'
  on-primary-container: '#72120e'
  inverse-primary: '#a7392f'
  secondary: '#89d2e2'
  on-secondary: '#00363f'
  secondary-container: '#00606f'
  on-secondary-container: '#90d8e9'
  tertiary: '#accbdd'
  on-tertiary: '#143442'
  tertiary-container: '#88a7b8'
  on-tertiary-container: '#1e3d4b'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdad5'
  primary-fixed-dim: '#ffb4aa'
  on-primary-fixed: '#410001'
  on-primary-fixed-variant: '#86211a'
  secondary-fixed: '#a5eeff'
  secondary-fixed-dim: '#89d2e2'
  on-secondary-fixed: '#001f25'
  on-secondary-fixed-variant: '#004e5a'
  tertiary-fixed: '#c7e7f9'
  tertiary-fixed-dim: '#accbdd'
  on-tertiary-fixed: '#001f2a'
  on-tertiary-fixed-variant: '#2c4b59'
  background: '#0d1419'
  on-background: '#dce3ea'
  surface-variant: '#2f363b'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  title-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: '8'
  container-padding-mobile: '20'
  container-padding-desktop: '40'
  gutter: '16'
  stack-sm: '8'
  stack-md: '16'
  stack-lg: '32'
---

## Brand & Style

The design system is engineered for a high-performance fitness environment, blending the precision of data tracking with an inviting, modern aesthetic. The brand personality is **motivating, technical, and sophisticated**. 

The visual style utilizes a refined **Glassmorphism** approach. By layering semi-transparent surfaces over a deep, atmospheric background, the UI achieves a sense of depth and focus without feeling cluttered. This "elevated dashboard" feel ensures that users remain focused on their progress while feeling immersed in a premium digital coaching experience.

## Colors

The palette is anchored by a **Cool Gray (#C1C8CF)** neutral base, which provides a balanced, professional foundation for the dark mode environment. This neutral tone ensures high legibility and a modern, desaturated backdrop that allows functional colors to stand out.

- **Primary (Soft Coral):** Used exclusively for key "high-momentum" actions such as starting a workout or indicating active progress.
- **Secondary (Teal/Light Blue):** Applied to supporting data points, icons, and secondary visual highlights to maintain a calm, technical balance.
- **Tertiary (Muted Slate):** Utilized for container backgrounds and non-interactive decorative elements to provide structural hierarchy.
- **Neutral:** A range of sophisticated cool grays ensures maximum legibility for body text and labels while grounding the interface in a sleek, industrial aesthetic.

## Typography

This design system relies on **Inter** to deliver a clean, utilitarian aesthetic that emphasizes data clarity. 

The typographic hierarchy uses tight letter spacing for large headlines to create a sense of urgency and power. For body copy, standard tracking is maintained for readability. **All-caps labels** are reserved for category headers and overlines to distinguish metadata from primary content. High contrast (White/Off-white) is strictly enforced against the dark backgrounds to ensure accessibility in active environments.

## Layout & Spacing

The layout follows a **fluid grid** model designed for rapid information scanning. 

- **Mobile:** A 4-column grid with 20px side margins. Elements are stacked vertically to prioritize the "Active Plan" and quick-start actions.
- **Desktop:** A 12-column grid that allows for a multi-pane dashboard view, where nutrition and fitness metrics can sit side-by-side.
- **Rhythm:** A strict 8px spacing system governs all component relationships, ensuring a consistent density that feels organized and professional.

## Elevation & Depth

Depth is established through **Tonal Layering and Backdrop Blurs** rather than traditional heavy shadows.

- **Base Layer:** The solid dark neutral background.
- **Mid Layer (Cards):** Semi-transparent surfaces (`rgba(62, 92, 107, 0.4)`) with a `20px` backdrop blur. This creates a "frosted glass" effect that allows the background colors to subtly bleed through.
- **Top Layer (Interactives):** Buttons and active chips use solid, high-saturation colors (Coral/Teal) to "pop" off the glass surfaces.
- **Shadows:** When used, shadows are extremely diffused (`blur: 30px`) and tinted with the primary color to create a soft "glow" effect rather than a dark silhouette.

## Shapes

The shape language is defined by **Soft Geometricism**. 

All primary containers and cards use a `1rem` (16px) corner radius to feel approachable and modern. Smaller elements like input fields and secondary buttons use a `0.5rem` (8px) radius. This differentiation helps users distinguish between major content blocks and individual interactive elements. Avatars should be strictly circular to provide a soft organic contrast to the rectangular grid.

## Components

- **Buttons:** Primary buttons are pill-shaped or rounded-lg with a solid Coral background and white text. Secondary buttons use an outlined style or a muted Teal glass background.
- **Cards:** Defined by semi-transparent fills and subtle 1px inner borders (`rgba(255,255,255,0.1)`) to define edges against the dark background.
- **Progress Bars:** Background tracks use a dark neutral semi-transparent fill; the active progress indicator uses a solid Coral or Teal gradient.
- **Chips:** Small, rounded-pill indicators for categories (e.g., "Leg Day", "Cardio") using Tertiary background colors with white text.
- **Input Fields:** Dark, recessed backgrounds with a soft Teal glow on focus.
- **Navigation:** A floating bottom bar or top header with a heavy backdrop blur to maintain legibility over scrolling content.