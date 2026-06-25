---
name: NutriScan AI
colors:
  surface: '#f9f9fc'
  surface-dim: '#dadadc'
  surface-bright: '#f9f9fc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f6'
  surface-container: '#eeeef0'
  surface-container-high: '#e8e8ea'
  surface-container-highest: '#e2e2e5'
  on-surface: '#1a1c1e'
  on-surface-variant: '#3d4a3f'
  inverse-surface: '#2f3133'
  inverse-on-surface: '#f0f0f3'
  outline: '#6d7a6e'
  outline-variant: '#bccabc'
  surface-tint: '#006d37'
  primary: '#006d37'
  on-primary: '#ffffff'
  primary-container: '#27ae60'
  on-primary-container: '#00391a'
  inverse-primary: '#61de8a'
  secondary: '#006492'
  on-secondary: '#ffffff'
  secondary-container: '#58bcfd'
  on-secondary-container: '#004a6d'
  tertiary: '#904d00'
  on-tertiary: '#ffffff'
  tertiary-container: '#d98437'
  on-tertiary-container: '#4d2700'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#7efba4'
  primary-fixed-dim: '#61de8a'
  on-primary-fixed: '#00210c'
  on-primary-fixed-variant: '#005228'
  secondary-fixed: '#cae6ff'
  secondary-fixed-dim: '#8ccdff'
  on-secondary-fixed: '#001e2f'
  on-secondary-fixed-variant: '#004b6f'
  tertiary-fixed: '#ffdcc3'
  tertiary-fixed-dim: '#ffb77d'
  on-tertiary-fixed: '#2f1500'
  on-tertiary-fixed-variant: '#6e3900'
  background: '#f9f9fc'
  on-background: '#1a1c1e'
  surface-variant: '#e2e2e5'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-padding: 20px
  stack-gap: 16px
  section-gap: 32px
  touch-target-min: 48px
  touch-target-ideal: 56px
---

## Brand & Style
The design system is anchored in the principles of **Empathetic Precision**. It balances the clinical reliability of a healthcare provider with the approachable, frictionless experience of a modern startup. Designed specifically for users aged 40–70, the visual language prioritizes cognitive ease, high legibility, and physical accessibility.

The style is a blend of **Minimalism** and **Modern Corporate**, utilizing generous whitespace to reduce visual noise. Every element is designed to feel intentional and supportive, evoking a sense of calm and control over one's health data.

## Colors
The palette is rooted in nature and trust. **Primary Green** (#27AE60) is used for "Go" actions, health progress, and vitality markers. **Secondary Blue** (#2D9CDB) represents the AI technology and professional guidance aspects of the app.

To maintain accessibility for older adults:
- All interactive text must meet WCAG AA standards against the white background.
- Backgrounds are kept clean and white to maximize contrast.
- **Warning Orange** and **Danger Red** are reserved for critical health alerts and corrective actions, ensuring they stand out immediately in a scan result.

## Typography
The design system utilizes **Inter** for its exceptional legibility and neutral, professional character. To accommodate the target demographic, font sizes are scaled up significantly compared to standard mobile apps.

- **Scale:** The base body size starts at 18px for primary content to ensure effortless reading without eye strain.
- **Hierarchy:** Strong weight contrasts (600 vs 400) are used to clearly distinguish headers from descriptive text.
- **Line Height:** Generous leading (line-height) is applied to all paragraph text to prevent lines from blurring together during reading.

## Layout & Spacing
The layout follows a **Fixed Grid** model for mobile devices to ensure a predictable and stable reading experience. 

- **Margins:** A 20px outer margin is used on mobile to prevent content from feeling cramped near the screen edges.
- **Rhythm:** An 8px linear scale governs all spacing. Vertical stacks use a 16px gap to ensure distinct separation between elements.
- **Touch Targets:** A strict minimum of 48px is enforced for all interactive elements, with an ideal "Large Target" of 56px for primary buttons to accommodate users with reduced dexterity.

## Elevation & Depth
This design system uses **Ambient Shadows** to create a sense of tactile layering. Depth is used functionally rather than decoratively—shadows indicate that an element is "above" the background and therefore interactable.

- **Cards:** Use a very soft, diffused shadow (Blur: 16px, Opacity: 6%, Color: Neutral Blue-Gray) to lift them from the white background.
- **Primary Buttons:** Feature a slightly stronger shadow to emphasize their importance and suggest they are "pressable."
- **Overlays:** Modals and bottom sheets use a standard 20% backdrop dimming to focus attention and reduce background distraction.

## Shapes
The shape language is defined by **Soft Friendliness**. A consistent 16px (1rem) corner radius is applied to all primary cards and containers to make the interface feel safe and modern.

- **Base Radius:** 8px for smaller components like inputs and chips.
- **Large Radius:** 16px (rounded-lg) for main content cards and scanning viewfinders.
- **Full Radius:** Pills are used for status indicators (e.g., "Healthy", "High Protein") to differentiate them from actionable buttons.

## Components
Consistent styling across components ensures the app remains intuitive for the 40-70 demographic.

### Buttons
- **Primary:** Solid #27AE60 background with White text. Height is 56px.
- **Secondary:** Outlined with a 2px stroke in #2D9CDB. 
- **States:** Hover/Tap states should darken the background color by 10% to provide immediate visual feedback.

### Input Fields
- Labels must always be visible (never use placeholder-only labels).
- Minimum height of 56px with 16px internal padding.
- 2px border on focus using the Primary Green color.

### Cards
- White background with the 16px corner radius and ambient shadow.
- Content inside cards should have a minimum of 16px internal padding to ensure the "breathability" of information.

### Chips & Lists
- **Lists:** Every list item must have a minimum height of 64px to ensure easy tapping. 
- **Chips:** Used for dietary tags; should be large enough to read easily (14px Bold text).

### Icons
- Use **Friendly, Rounded Icons** with a 2px stroke weight. Icons should always be accompanied by a text label where possible to ensure clarity of function.