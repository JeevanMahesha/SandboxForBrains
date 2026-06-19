# Theming & Customization

## How It Works

1. CSS variables defined in `:root` (light) and `.dark` (dark mode)
2. Spartan's Tailwind preset maps them to utilities: `bg-primary`, `text-muted-foreground`, etc.
3. Helm components use these utilities — changing a variable changes all components

## Tailwind Preset Setup

### Tailwind v4

```css
@import "tailwindcss";
@plugin "@spartan-ng/brain/hlm-tailwind-preset";
```

### Tailwind v3

```js
// tailwind.config.js
module.exports = {
  presets: [require('@spartan-ng/brain/hlm-tailwind-preset')],
}
```

## Color Variables (OKLCH)

| Variable | Purpose |
|----------|---------|
| `--background` / `--foreground` | Page background and default text |
| `--card` / `--card-foreground` | Card surfaces |
| `--primary` / `--primary-foreground` | Primary buttons and actions |
| `--secondary` / `--secondary-foreground` | Secondary actions |
| `--muted` / `--muted-foreground` | Muted/disabled states |
| `--accent` / `--accent-foreground` | Hover and accent states |
| `--destructive` / `--destructive-foreground` | Error and destructive actions |
| `--border` | Default border color |
| `--input` | Form input borders |
| `--ring` | Focus ring color |
| `--sidebar-*` | Sidebar-specific colors |

Colors use OKLCH format: `oklch(lightness chroma hue)`.

## Adding Custom Colors

Always add to the project's global CSS file. Never create new CSS files.

```css
:root {
  --warning: oklch(0.84 0.16 84);
  --warning-foreground: oklch(0.28 0.07 46);
}
.dark {
  --warning: oklch(0.41 0.11 46);
  --warning-foreground: oklch(0.99 0.02 95);
}
```

For Tailwind v4, register with `@theme inline`:

```css
@theme inline {
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
}
```

For Tailwind v3, register in `tailwind.config.js`:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        warning: "oklch(var(--warning) / <alpha-value>)",
        "warning-foreground": "oklch(var(--warning-foreground) / <alpha-value>)",
      },
    },
  },
}
```

## Customizing Components

Priority order:

1. **CVA variants** — `variant="outline"`, `size="sm"`
2. **`hlm()` / `classes()`** — layout classes only, not colors
3. **CSS variables** — define custom tokens in global CSS
4. **Wrapper components** — compose Spartan primitives into higher-level components

## Dark Mode

Class-based toggle via `.dark` on the root element. Semantic tokens handle light/dark automatically — never write manual `dark:` overrides.

## Border Radius

`--radius` controls border radius globally. Components derive from it. Change in global CSS to affect all components.
