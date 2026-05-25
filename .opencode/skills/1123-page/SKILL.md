---
name: 1123-page
description: Create a new 1123 WORKSHOP page from scratch. Includes template for head, tailwind config, nav, shared assets, and footer.
---

# 1123 PAGE — New Page Skeleton

Use when adding a brand new HTML page to the site.

## Minimal Bootstrapper

```html
<!DOCTYPE html><html class="dark" lang="en"><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>PAGE TITLE | 1123 WORKSHOP</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Anton&amp;family=Geist:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles.css">
<script id="tailwind-config">
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#121414", "on-surface": "#e2e2e2", "on-surface-variant": "#c4c7c8",
        primary: "#ffffff", "on-primary": "#2f3131",
        "surface-container": "#1e2020", "surface-container-low": "#1a1c1c",
        "surface-container-high": "#282a2b", "surface-container-lowest": "#0c0f0f",
        "outline-variant": "#444748", outline: "#8e9192", error: "#ffb4ab",
        "on-error": "#690005", "error-container": "#93000a"
      },
      borderRadius: { DEFAULT: "0px", lg: "0px", xl: "0px", full: "9999px" },
      spacing: { unit: "4px", gutter: "24px", "section-padding": "120px", "margin-mobile": "16px", "margin-desktop": "64px" },
      fontFamily: { "headline-md": ["Anton"], "headline-xl": ["Anton"], "label-caps": ["Geist"], "body-lg": ["Geist"], "mono-metric": ["Geist"] },
      fontSize: { "headline-xl": ["120px", "1"], "headline-lg-mobile": ["64px", "1"], "headline-md": ["56px", "1"], "body-lg": ["18px", "1.6"], "label-caps": ["12px", { letterSpacing: "0.1em" }] },
      fontWeight: { "headline-xl": "400", "headline-md": "400", "label-caps": "500" }
    }
  }
};
</script>
</head>
<body class="bg-background text-on-surface font-['Geist',sans-serif] antialiased">
```

## Always Include at Bottom
```html
<script src="app.js"></script>
</body>
</html>
```

## Rules
- bg is `#121414` for most pages. If shop-style `#000000`, change `background` in colors to `"#000000"`.
- Do NOT duplicate cursor, scroll-reveal, page-transition, or magnetic code — they're in styles.css + app.js.
- Grain overlay background-image is page-specific — keep inline in the `<body>` if needed.
- Add `reveal-up` or `fade-in` class for scroll animations.
