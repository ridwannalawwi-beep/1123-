---
name: 1123-inner-circle
description: Add or fix the Inner Circle newsletter/community section on 1123 WORKSHOP pages. White background, JOIN outline, subscribe form.
---

# 1123 INNER CIRCLE — Community Section

Use when adding or fixing the "Inner Circle" or community newsletter section.

## Standard Template

```html
<section class="relative z-10 px-margin-mobile md:px-margin-desktop py-section-padding bg-white text-[#121414]">
  <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-gutter items-center border-2 border-[#121414] p-12 md:p-24">
    <!-- Left: text -->
    <div>
      <h2 class="text-headline-lg-mobile md:text-headline-xl font-headline-xl text-[#121414] leading-none mb-6 uppercase">INNER CIRCLE</h2>
      <p class="text-body-lg text-[#444748] max-w-md mb-8">Get early access to drops, builds, and exclusive content.</p>
      <!-- JOIN outline button -->
      <a class="inline-block border-2 border-[#121414] text-[#121414] px-10 py-4 font-headline-md uppercase tracking-wider hover:bg-[#121414] hover:text-white transition-all" href="#">JOIN</a>
    </div>
    <!-- Right: subscribe form -->
    <form class="space-y-4">
      <input class="w-full bg-transparent border-2 border-[#121414] px-6 py-4 text-[#121414] uppercase placeholder:text-[#444748]" type="email" placeholder="YOUR EMAIL" required>
      <button class="w-full bg-[#121414] text-white px-10 py-4 font-headline-md uppercase tracking-wider hover:bg-transparent hover:text-[#121414] border-2 border-[#121414] transition-all" type="submit">SUBSCRIBE</button>
    </form>
  </div>
</section>
```

## Key Rules
- Background MUST be `bg-white text-[#121414]`
- Header text: `text-headline-lg-mobile md:text-headline-xl font-headline-xl text-[#121414]`
- JOIN button: outline with `border-2 border-[#121414] text-[#121414]`, hover fills dark
- Subscribe button: `bg-[#121414] text-white`, hover becomes outline
- Section uses `py-section-padding` and `px-margin-mobile md:px-margin-desktop`
- Grid: `grid grid-cols-1 md:grid-cols-2 gap-gutter`
- Outer container uses `border-2 border-[#121414]`
