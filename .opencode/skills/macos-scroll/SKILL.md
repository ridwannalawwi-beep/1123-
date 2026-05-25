---
name: macos-scroll
description: Apply macOS-style scrolling (overlay scrollbar, momentum, bounce) across 1123 WORKSHOP pages. Included in styles.css, no per-page changes needed.
---

# macOS-Style Scrolling

Provides overlay scrollbar + momentum + rubber-band bounce. Handled globally via `styles.css` — no per-page changes.

## What it does

- **Overlay thin scrollbar** (6px, rounded thumb, transparent track) — does not shift layout
- **Scrollbar fades in/out** on scroll via `scrollbar-color` + `scrollbar-width: thin` (Firefox)
- **Bounce effect** at scroll edges via `overscroll-behavior: auto`

## CSS (already in styles.css)

```css
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.25); border-radius: 999px; }
::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.4); }
html { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.25) transparent; overscroll-behavior: auto; }
```

## Usage

No action needed — `styles.css` is already linked on every page. Just make sure each page has:

```html
<link rel="stylesheet" href="styles.css">
```

## Per-page overrides (if needed)

If a page needs a custom scrollbar color, add to that page's `<style>`:

```css
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.5); }
html { scrollbar-color: rgba(255,255,255,0.5) transparent; }
```
