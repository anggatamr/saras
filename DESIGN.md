---
name: SARAS Design System
colors:
  surface: '#fff8f6'
  surface-dim: '#ebd6cc'
  surface-bright: '#fff8f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff1eb'
  surface-container: '#ffeae0'
  surface-container-high: '#f9e4da'
  surface-container-highest: '#f3ded5'
  on-surface: '#241913'
  on-surface-variant: '#574238'
  inverse-surface: '#3a2e27'
  inverse-on-surface: '#ffede5'
  outline: '#8a7266'
  outline-variant: '#dec1b2'
  surface-tint: '#9b4500'
  primary: '#974300'
  on-primary: '#ffffff'
  primary-container: '#be5600'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb68d'
  secondary: '#5e5f5c'
  on-secondary: '#ffffff'
  secondary-container: '#e0e0dc'
  on-secondary-container: '#626360'
  tertiary: '#005ea3'
  on-tertiary: '#ffffff'
  tertiary-container: '#0077cc'
  on-tertiary-container: '#fdfcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbc9'
  primary-fixed-dim: '#ffb68d'
  on-primary-fixed: '#331200'
  on-primary-fixed-variant: '#763300'
  secondary-fixed: '#e3e2df'
  secondary-fixed-dim: '#c7c7c3'
  on-secondary-fixed: '#1b1c1a'
  on-secondary-fixed-variant: '#464744'
  tertiary-fixed: '#d2e4ff'
  tertiary-fixed-dim: '#a1c9ff'
  on-tertiary-fixed: '#001c37'
  on-tertiary-fixed-variant: '#004880'
  background: '#fff8f6'
  on-background: '#241913'
  surface-variant: '#f3ded5'
typography:
  headline-xl:
    fontFamily: Syne
    fontSize: 64px
    fontWeight: '800'
    lineHeight: '1.0'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Syne
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.03em
  headline-md:
    fontFamily: Syne
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Syne
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '500'
    lineHeight: '1.5'
    letterSpacing: '0'
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
  label-lg:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: 0.05em
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style

The design system is built upon a **Gen Z Neobrutalist** aesthetic—a deliberate rejection of soft, minimalist corporate gradients in favor of raw, high-contrast, and structurally honest interfaces. It communicates a sense of urgency, confidence, and digital-native authenticity.

The style is characterized by "Hard-UI" principles: thick strokes, unapologetic solid shadows, and a warm, tactile foundation that prevents the industrial aesthetic from feeling cold. It is designed for a target audience that values transparency, bold statements, and a "post-minimalist" digital experience.

**Key Visual Pillars:**
- **Raw Structure:** 2px solid borders define the architecture of every element.
- **Physicality:** Use of hard-offset shadows creates a "sticker" or "cut-out" effect, suggesting the UI elements are physical objects layered on a warm canvas.
- **Controlled Chaos:** A balance between high-energy accents and a stable, warm-toned neutral background.

## Colors

The palette avoids pure whites and grays to maintain a "printed" or "vintage-digital" feel. 

- **Primary (Burned-Orange):** Used for primary actions, critical highlights, and brand-defining moments. 
- **Secondary (Pastel Sand):** A subtle, low-contrast alternative for decorative elements, secondary containers, or background depth.
- **Background (Warm-White Cream):** The foundational canvas. It provides a softer contrast against the Ink-Black than a standard pure white.
- **Foreground (Ink-Black):** Used for all borders, shadows, and primary text. 

Contrast ratios are kept intentionally high to ensure maximum readability and a striking visual impact.

## Typography

Typography in this design system is aggressive and functional. 

- **Headlines:** Utilizes **Syne** for its avant-garde, geometric character. Headings use tight tracking (letter-spacing) and a heavy weight to create a "blocky" feel that complements the thick borders of the UI.
- **Body & Labels:** Utilizes **Hanken Grotesk** for clarity. Body text is kept clean and spacious to balance the intensity of the headlines.
- **Scale:** On mobile devices, `headline-xl` should scale down to 40px, and `headline-lg` to 32px to maintain layout integrity.

## Layout & Spacing

This design system uses a **Rigid Grid** philosophy. Elements should feel like they are "locked" into a modular structure.

- **The 4px Base:** All spacing, padding, and margins must be multiples of 4px.
- **Container Margins:** Use 24px internal padding for cards and sections to provide breathing room against the heavy 2px borders.
- **Grid:** On desktop, a 12-column grid with 16px gutters is preferred. On mobile, a 4-column grid with 16px gutters.
- **Alignment:** Never use soft alignment; everything should snap to the grid or be centered with high intentionality.

## Elevation & Depth

Depth is conveyed through **Hard-Offset Shadows**, not blurs or gradients. This "Neobrutalist shadow" mimics 2D physical layering.

- **Standard Elevation:** All interactive cards and buttons feature a `4px 4px 0px 0px` solid Ink-Black (#1C1917) shadow.
- **Hover State:** Upon hover, the element should translate `-2px -2px` while the shadow expands to `6px 6px` or stays fixed, creating an "elevation" effect.
- **Active/Pressed State:** The element translates `4px 4px` to perfectly cover its own shadow, simulating a physical button press.
- **Layering:** Background layers remain flat. Only primary interactive components or modal-level containers receive the hard-offset shadow.

## Shapes

The shape language is strictly **Sharp/Angular**. 

- **Default:** A 0px border radius is applied to all buttons, input fields, cards, and containers.
- **Exceptions (Badges):** Badges and chips are the only elements allowed a "Pill" shape (full rounding) to create a visual distinction between a clickable action (sharp) and a status indicator (pill).
- **Stroke:** A consistent 2px solid stroke of Ink-Black (#1C1917) must be applied to the perimeter of all components.

## Components

### Buttons
- **Primary:** Burned-Orange fill, 2px Ink-Black border, 4px hard shadow. Text is bold and centered.
- **Secondary:** Pastel Sand fill, 2px Ink-Black border, 4px hard shadow.
- **Interaction:** Must include the translate-on-hover effect defined in the Elevation section.

### Input Fields
- **Style:** Background of Warm-White, 2px Ink-Black border, sharp corners.
- **Focus:** The border remains 2px, but the background shifts to a very light tint of Burned-Orange or the shadow increases in size.

### Cards
- **Style:** Background of either Secondary Sand or Background Cream. Always bounded by a 2px Ink-Black border and a 4px hard shadow.
- **Content:** Large headline-sm typography for titles.

### Badges & Chips
- **Style:** Pill-shaped (fully rounded). 2px Ink-Black border. 
- **Colors:** High-contrast fills (e.g., Burned-Orange for "New", Sand for "Category"). No shadows for badges to keep them visually "lighter" than buttons.

### Checkboxes & Radio Buttons
- **Checkbox:** Square (0px radius), 2px Ink-Black border. Checked state fills with Burned-Orange and a black "X" or "Check" mark.
- **Radio:** Circular (the only other exception to sharp corners), 2px Ink-Black border. Selected state features a solid black inner circle.

### Lists
- Separate list items with a 2px solid Ink-Black bottom border. Avoid using dividers that don't span the full width of the container.