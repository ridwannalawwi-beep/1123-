---
name: 1123-nav
description: Add or fix the sticky navigation bar across 1123 WORKSHOP pages. Covers header structure, links, active states, and right-side icons (cart/person/menu).
---

# 1123 NAV — Navigation Bar

Use this when adding or fixing the navigation bar on any 1123 WORKSHOP page.

## Required Structure

```html
<header class="fixed top-0 left-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-outline-variant h-20 flex items-center">
  <div class="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop">
    <!-- Logo -->
    <a class="text-headline-md font-headline-md text-primary" href="home page.html">1123</a>
    <!-- Desktop nav links -->
    <nav class="hidden md:flex gap-8 items-center">
      <a class="text-label-caps font-label-caps uppercase tracking-widest text-on-surface-variant hover:text-primary" href="home page.html">HOME</a>
      <a class="text-label-caps font-label-caps uppercase tracking-widest text-on-surface-variant hover:text-primary" href="shop.html">SHOP</a>
    </nav>
    <!-- Right icons -->
    <div class="flex items-center gap-4">
      <a class="text-on-surface-variant hover:text-primary relative" href="cart.html">
        <span class="material-symbols-outlined">shopping_bag</span>
        <span class="absolute -top-1 -right-1 bg-primary text-on-primary text-[8px] h-3 w-3 flex items-center justify-center rounded-full">0</span>
      </a>
      <button class="text-on-surface-variant hover:text-primary">
        <span class="material-symbols-outlined">person</span>
      </button>
      <button class="md:hidden text-on-surface-variant">
        <span class="material-symbols-outlined">menu</span>
      </button>
    </div>
  </div>
</header>
```

## Active Page
Add `text-primary font-bold border-b-2 border-primary` to the link matching the current page.

## Icon Rules
- Cart MUST be `<a href="cart.html">` (not `<button>`)
- Person and menu MUST be `<button>`
- All icons use `text-on-surface-variant hover:text-primary`
- Cart badge uses `text-on-primary text-[8px] h-3 w-3 rounded-full bg-primary`
- Icons use `<span class="material-symbols-outlined">icon_name</span>`
