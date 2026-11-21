# NirvanAir Accessibility (a11y) & WCAG 2.2 Compliance Manifest

## 1. Compliance Standard

NirvanAir is architected to satisfy **WCAG 2.2 Level AA** compliance across all user touchpoints.

---

## 2. Structural & Semantic Accessibility Features

### A. Semantic HTML5 Landmarks
- Applications screens are partitioned using standard HTML5 landmarks:
  - `<header role="banner">` for navigation and telemetry status
  - `<aside role="navigation">` for intelligence module switching
  - `<main role="main">` for active dashboard content
  - `<article>` for actionable intelligence cards and swap items

### B. High Contrast Color Palettes
- **Text Contrast**: Text elements maintain minimum **4.5:1** contrast ratios against light backgrounds (`#191d19` on `#f1f5ed` achieves >12:1).
- **Graphical AQI Badges**: Color coding for NAQI categories is paired with explicit numerical text and descriptive text labels (e.g., "Poor", "Severe") so color is never the single differentiator of critical health information (WCAG 1.4.1).

### C. Screen Reader Twins for Complex Visualizations
- All Recharts diurnal graphs and pollutant breakdown progress bars feature accessible text summaries and ARIA labels (`aria-label`, `aria-describedby`) detailing numerical sub-indices, peak hours, and dominant pollutants for assistive screen readers.

### D. Keyboard Navigation & Focus Management
- Interactive buttons, modal dialogs, and preset city selectors feature standard focus rings (`focus:ring-2 focus:ring-[#1e6b45]`).
- Modals (Onboarding, Settings, Scenario configuration) support `<Escape>` key dismissal and retain focus trapping within the active overlay until closed.

### E. Motion & Reduced Motion Preferences
- Animations respect `prefers-reduced-motion` media queries, removing abrupt transitions for users prone to vestibular motion triggers.
