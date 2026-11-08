# Design: Let's Cook Curry

The locked system. Every Hallmark run reads this first and pages share it. Change it on purpose; the file is the rule.

## System
- Genre: editorial
- Shape of the first page: Split Studio
- Theme: brand (vibe: "Sydney culinary studio, warm saffron and curry leaf")
- Axes: light/roman-serif/warm · posture: restrained

## Tokens
`src/app/tokens.css` is the source of truth. The roles:
```css
:root {
  --color-paper: oklch(96.8% 0.018 82);  --color-paper-2: oklch(93.8% 0.025 80);  --color-paper-3: oklch(89.5% 0.035 78);
  --color-ink: oklch(22% 0.032 55);  --color-ink-2: oklch(34% 0.030 55);  --color-muted: oklch(46% 0.026 58);  --color-rule: oklch(83% 0.028 76);
  --color-accent: oklch(76% 0.155 68);  --color-accent-ink: oklch(20% 0.032 55);  --color-focus: oklch(62% 0.160 62);
  --color-leaf: oklch(36% 0.068 128);  --color-leaf-ink: oklch(97% 0.014 84);
  --font-display: var(--font-headline), "Playfair Display", Georgia, serif;  --font-body: var(--font-lato), "Lato", ui-sans-serif, system-ui, sans-serif;  --font-outlier: var(--font-body);
  --radius-card: 16px;  --radius-pill: 999px;  --rule-hair: 1px;  --shadow-card: 0 12px 32px -12px oklch(22% 0.032 55 / 0.10);
}
```
The spacing scale, the type scale, the easings and the durations are the scaffold's and live in `src/app/tokens.css`.

## Controls
- Primary: solid saffron (`--color-accent`) with dark umber ink (`--color-accent-ink`) · `12px` (`rounded-xl`) · `44px` (`h-11`)
- Secondary: 1px rule outline (`--color-rule`) or deep curry-leaf surface (`--color-leaf`) · same radius and height

## Motion
- Character: calm; diptych 80ms entrance stagger (`--dur-long` on `--ease-out`), scroll-linked statement wipe (`animation-timeline: view()`), tactile 1px active press (`--dur-micro`); under reduced motion everything ends at once.

## Exports
`src/app/tokens.css` and `tailwind.config.ts` (`paper`, `ink`, `rule`, `leaf`, `display`, `body`) in this project. DTCG or standalone shadcn blocks are added here on request, per `export-formats.md`.

