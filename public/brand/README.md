# untab — brand kit

Generated 2026-05-10.

## Typeface
**Satoshi** by Indian Type Foundry, via Fontshare:
```html
<link href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap" rel="stylesheet">
```

## Colors
- **Ink** `#0A0A0A`
- **Paper** `#FAFAFA`
- **Paper warm** `#F4F1EC`
- No accents. Contrast does the work.

## Files

| Folder | What it contains |
|--------|------------------|
| `mark/` | The U mark on its own — SVG (light/transparent) and PNGs (128–1024). |
| `lockups/` | Mark + "untab" wordmark · horizontal and stacked · light/dark/transparent. |
| `favicon/` | SVG favicon + PNGs at 16/32/48/180/192/512. `apple-touch-icon-180.png` is for iOS. |
| `app-icon/` | iOS / macOS app icons (1024) + square / circle avatars (400). |
| `og/` | Social share images: OG (1200×630), Twitter (1200×600), LinkedIn (1200×627). |

## HTML snippet for the website `<head>`

```html
<link rel="icon" href="/favicon/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon/favicon-32.png" sizes="32x32">
<link rel="icon" href="/favicon/favicon-16.png" sizes="16x16">
<link rel="apple-touch-icon" href="/favicon/apple-touch-icon-180.png">

<meta property="og:image" content="/og/og-image-dark.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="/og/twitter-card.png">

<link href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap" rel="stylesheet">
```

## Don't
- Don't recolor the mark (ink + paper only).
- Don't outline, gradient, shadow, or rotate it.
- Don't stretch — preserve aspect ratio always.
- Don't go below 20px on screen, 6mm in print.
