# 1123 WORKSHOP — Static HTML Site

Static HTML website (12 pages) for a car/garage brand. No build step — all Tailwind via CDN.

## Project Structure
- `*.html` — 10 pages: home page, shop, cart, checkout, contact person, galeri, product detail, build custom, build detail, screen
- `styles.css` — Shared CSS (cursor, scrollbar, grain overlay, reveals, animations, utilities)
- `app.js` — Shared JS (page transition, scroll reveal observer, custom cursor, magnetic hover)
- `.opencode/skills/` — Project-specific reusable skills

## Architecture
- All pages use `<link href="styles.css">` and `<script src="app.js"></script>` instead of inline shared code.
- Tailwind config is inline in each page's `<head>` (via `<script id="tailwind-config">`). Every page has its own config with the same design tokens.
- Grain overlay background-image is page-specific (different URLs per page) — keep inline.

## Design Tokens
- Background: `#121414` (most pages), shop uses `#000000`
- Primary: `#ffffff`, On-Surface-Variant: `#c4c7c8`, Outline-Variant: `#444748`, Error: `#ffb4ab`
- Fonts: Anton (headlines), Geist (body/caps)
- Spacing: `margin-mobile: 16px`, `margin-desktop: 64px`, `section-padding: 120px`, `gutter: 24px`
- Radii: all `0px` except `full: 9999px`

## Key Conventions
- **Navigation**: `fixed top-0 left-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-outline-variant h-20 flex items-center`
- **Nav links**: `text-label-caps uppercase tracking-widest text-on-surface-variant hover:text-primary` inside `hidden md:flex gap-8 items-center`
- **Active page**: add `text-primary font-bold border-b-2 border-primary` to the current page's link
- **Icons** (right side of header): cart is `<a>` to `cart.html`, person is `<a href="account.html">`, menu is `<button>`, all `text-on-surface-variant`. Cart badge: `text-on-primary text-[8px] h-3 w-3`
- **Inner Circle section**: white bg (`bg-white text-[#121414]`), `JOIN` outline text button, subscribe email form
- **Scroll reveal**: add `reveal-up` or `fade-in` class. Observer in app.js handles it.
- **Page transition**: internal link clicks get fade-out. Handled by app.js — do NOT add inline.
- **Brutalist**: sharp borders, no rounded corners, high contrast, `grayscale` on images
- **Material Symbols**: use `<span class="material-symbols-outlined">icon_name</span>`
- **Spec lists**: use `.spec-line` or `.dotted-leader` divs between label/value
- **Custom cursor**: `.cursor-dot` class. Handled by styles.css + app.js. Never inline.
- **macOS scrolling**: overlay scrollbar, momentum, bounce — handled globally in styles.css. See skill `.opencode/skills/macos-scroll`.

## Commands
No build/lint commands. Just open HTML files in browser to preview.

## Page List
1. `home page.html` — Landing page, hero, counter stats, inner circle, footer
2. `shop.html` — Merch grid, `#000000` bg
3. `cart.html` — Cart items, checkout flow
4. `checkout.html` — Shipping/payment form (manual address with city-based auto shipping)
5. `checkout-build.html` — Build deposit/payment form
6. `contact person.html` — Inquiry form
7. `galeri.html` — Gallery/builds
8. `product detail.html` — Single product view
9. `build custom.html` — Custom build configurator
10. `build detail.html` — Single build detail
11. `build-order.html` — Build order configurator
12. `order-confirmed.html` — Order confirmation / waiting for payment
13. `account.html` — Account page (login, order history, tracking)
14. `screen.html` — Minimal screen page (different DOCTYPE format)
15. `project-revenant.html` — Project Revenant page

**IMPORTANT**: When creating new pages, always tell the user the filename(s) of the new page(s).
