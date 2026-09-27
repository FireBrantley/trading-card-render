# Trading Card Render

A responsive, customizable React trading card component built with Tailwind CSS and Lucide icons. Designed with automatic contrast calculation, full-bleed blueprint portrait grid, customizable color gradients, and structured card data attributes.

---

## 📦 Installation

### Prerequisites
- React 18+
- Tailwind CSS 3+
- Lucide React

### Install from GitHub

**Via npm command:**

```bash
npm install github:FireBrantley/trading-card-render
```

**Or add directly to `package.json`:**

```json
{
  "dependencies": {
    "@FireBrantley/trading-card-render": "github:FireBrantley/trading-card-render"
  }
}
```

Then run `npm install`.

**Import in your code:**

```tsx
import { TradingCard } from '@FireBrantley/trading-card-render';
```

### 💡 Tailwind CSS Integration Note

The card has all critical layout dimensions (width, height, aspect ratio, portrait frame) hardcoded into native inline CSS styles, so it **works 100% out of the box** even if `node_modules` is not scanned.

If you are using **Tailwind CSS v4** and want all utility classes to be compiled seamlessly by your build tool, add this line to your main CSS file:

```css
@import "tailwindcss";
@source "../node_modules/@FireBrantley/trading-card-render";
```

For **Tailwind CSS v3**, add the package path to your `tailwind.config.js`:

```js
content: [
  "./src/**/*.{js,ts,jsx,tsx}",
  "./node_modules/@FireBrantley/trading-card-render/**/*.{js,ts,jsx,tsx}"
]
```

---

## 🚀 Quick Start

```tsx
import React from 'react';
import { TradingCard } from '@FireBrantley/trading-card-render';

export function ExampleCard() {
  return (
    <TradingCard
      name="Ignis Draco"
      emoji="🐉"
      hp={260}
      elementEmoji="🔥"
      stageBadge="Stage 2"
      evolutionNote="Evolves from Pyroling"
      cardNumber="NO. 742"
      colorStart="#f59e0b"
      colorEnd="#b45309"
      cardColor="#0c0a09"
      showGrid={true}
      showCornerBrackets={true}
      ability={{
        name: "Pyre Resonance",
        description: "Once during your turn, you may attach an extra Fire energy to this creature and restore 30 HP."
      }}
      attacks={[
        {
          name: "Infernal Slash",
          energyCost: ["🔥", "⚡"],
          damage: 80,
          description: "Searing talons leave molten embers that burn opposing defenses."
        },
        {
          name: "Supernova Breath",
          energyCost: ["🔥", "🔥", "🔥"],
          damage: 190,
          description: "Unleashes solar plasma from the core. Discard 1 Energy attached."
        }
      ]}
      combatMatrix={{
        weakness: { element: "💧", multiplier: "×2" },
        resistance: { element: "🌿", value: "-30" },
        retreatCost: 2
      }}
    />
  );
}
```

---

## ⚙️ Props Reference

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | `'trading-card'` | HTML `id` attribute for the card root element. |
| `name` | `string` | `''` | Character / creature name displayed in the card header. |
| `emoji` | `string` | `''` | Primary character icon or emoji displayed in the portrait frame. |
| `hp` | `number` | `0` | Health points displayed in the top-right badge. |
| `elementEmoji` | `string` | `undefined` | Elemental icon displayed inside the HP pill (e.g., `'🔥'`, `'💧'`). |
| `stageBadge` | `string` | `undefined` | Stage badge text in the top-left (e.g., `'Basic'`, `'Stage 1'`, `'Stage 2'`). |
| `evolutionNote` | `string` | `undefined` | Evolution text displayed next to the stage badge. |
| `cardNumber` | `string` | `undefined` | Collector number banner below portrait (e.g., `'NO. 742'`). |
| `colorStart` | `string` | `'#3b82f6'` | Starting hex color for the card's outer gradient border and frame accents. |
| `colorEnd` | `string` | `'#1d4ed8'` | Ending hex color for the card's outer gradient border, damage numbers, and ability tags. |
| `cardColor` | `string` | `'#0c0a09'` | Background hex color of the inner card-stock surface. |
| `showGrid` | `boolean` | `true` | When `true`, renders the full-bleed edge-to-edge blueprint grid in the portrait frame. |
| `showCornerBrackets` | `boolean` | `true` | When `true`, renders the 4 corner viewfinder brackets aligned with the grid. |
| `ability` | `object \| null` | `undefined` | Optional passive ability with `name` and `description`. |
| `attacks` | `AttackInfo[]` | `[]` | Array of attacks (renders up to 2 attacks). |
| `combatMatrix` | `CardCombatMatrix` | `undefined` | Weakness, resistance, and retreat cost specifications. |
| `className` | `string` | `''` | Additional Tailwind or CSS classes applied to the root `<article>`. |

---

## 📐 Type Definitions

```typescript
export interface AttackInfo {
  name: string;
  energyCost: string[];
  damage: number | string;
  description: string;
}

export interface CardCombatMatrix {
  weakness: { element: string; multiplier: string };
  resistance: { element: string; value: string };
  retreatCost: number;
}

export interface TradingCardProps {
  schemaVersion?: number;
  id?: string;
  name?: string;
  emoji?: string;
  hp?: number;
  stageBadge?: string;
  evolutionNote?: string;
  cardNumber?: string;
  elementEmoji?: string;
  colorStart?: string;
  colorEnd?: string;
  cardColor?: string;
  showGrid?: boolean;
  showCornerBrackets?: boolean;
  ability?: {
    name: string;
    description: string;
  } | null;
  attacks?: AttackInfo[];
  combatMatrix?: CardCombatMatrix;
  className?: string;
}
```

---

## 🎨 Key Features

### Enforced Standard Trading Card Aspect Ratio
Strictly enforces the standard physical trading card aspect ratio (63mm × 88mm / 2.5in × 3.5in / `aspect-[63/88]`), preventing the card from collapsing into a square or stretching into an irregular shape.

### Locked Portrait Frame Geometry
The illustration portrait frame is strictly dimensioned and aspect-locked (`h-[160px] min-h-[160px] max-h-[160px] aspect-[2/1] shrink-0`), preventing flex parents or external styles from squashing or flattening the illustration.

### Photometric Relative Luminance & Accent Readability
Calculates WCAG 2.1 relative luminance on your `cardColor` and automatically switches between:
- White text (`text-white/90`) on dark or rich saturated colors (obsidian, royal blue, deep red, purple)
- Dark text (`text-stone-900`) on light backgrounds (cream, white, yellow)

**Accent Text Contrast Fallback:** When custom accent colors (such as `colorEnd` for damage numbers and ability names or `colorStart` for stage badges and card numbers) have low contrast against dark cards (below 3.2:1), they are automatically shifted to an accessible, illuminated tint (or crisp `#f1f5f9`) so numbers and text are immediately readable.

### Edge-to-Edge Blueprint Grid
A fully vector-scaled SVG grid spans the entire portrait canvas (`viewBox="0 0 320 160"`). Corner brackets snap mathematically to grid coordinate intersections at `(16, 16)`, `(304, 16)`, `(16, 144)`, and `(304, 144)`. Both grid and brackets can be toggled independently via `showGrid` and `showCornerBrackets`.

### Customizable Color Gradients
Fine-tune the card's look with `colorStart`, `colorEnd`, and `cardColor` hex values. The gradient applies to borders, accents, and damage numbers for a cohesive aesthetic.

### Unopinionated Component
No hardcoded game lore or preset assumptions—use it for Pokémon-style cards, Magic: The Gathering variants, or any custom card game you dream up.

---

## 📝 License

MIT

---

## 🤝 Contributing

Found a bug or have a feature request? Open an issue on the [GitHub repository](https://github.com/FireBrantley/trading-card-render).