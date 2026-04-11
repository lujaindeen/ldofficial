# CLAUDE.md — Lujain Deen Portfolio

## Always Do First
- **Invoke the `frontend-design` skill** before writing any frontend code, every session, no exceptions.
- **Before every `git push`**, scan staged files for sensitive content: API keys, tokens, passwords, `.env` files, private keys. If anything looks sensitive, stop and alert the user before proceeding.

## Project Overview
Personal portfolio for Lujain Deen — Site Reliability Engineer, researcher, and thinker.
Aesthetic direction: **mystical-warm-minimal meets technical credibility.**
Think candlelight in a server room: warm, precise, and intentional.

## File Structure
- `index.html` — main HTML (structure and content)
- `style.css` — all styles (do NOT inline styles into HTML)
- `script.js` — all JavaScript
- `serve.mjs` — local dev server (port 3000)
- `screenshot.mjs` — Puppeteer screenshot tool
- `brand_assets/` — logos, color guides, images (check before designing)

## Brand
**Colours:**
- Background: `#12100e`
- Surface: `#1c1916`
- Surface 2: `#242019`
- Gold accent: `#d4a84a` (use sparingly)
- Text: `#f5ede0` (warm cream)
- Muted text: `#b0a090`
- Border: `rgba(212, 168, 74, 0.2)`

**Typography:**
- Display/headings: `Cormorant Garamond` — weight 300–500, italic for mood
- Body: `Inter` — weight 300–400 only, always light
- Technical labels: `Courier New` monospace — for index numbers, status indicators
- Never introduce a third Google Font without asking

**Do NOT use:** Tailwind CSS, inline styles, purple/blue/cool tones, pill buttons, rounded card shadows, generic icon grids, GitHub contribution graphs, skills progress bars.

## Local Server
- Always serve on localhost — never work from `file:///`
- Start: `node serve.mjs` (runs at `http://localhost:3000`)
- Start it in the background before taking screenshots
- If already running, do not start a second instance

## Screenshot Workflow
- Puppeteer: `C:/Users/lujai/AppData/Local/Temp/puppeteer-test/`
- Chrome cache: `C:/Users/lujai/.cache/puppeteer/`
- Screenshot command: `node screenshot.mjs http://localhost:3000`
- Optional label: `node screenshot.mjs http://localhost:3000 label`
- Screenshots saved to `./temporary screenshots/screenshot-N.png` (auto-incremented)
- After screenshotting, read the PNG with the Read tool and analyze it visually
- Always do at least 2 comparison rounds when matching a reference

## Reference Images
- If a reference image is provided: match layout, spacing, typography, and color exactly
- Do not improve or add to the design — match it
- If no reference: design from scratch using brand guidelines above

## Brand Assets
- Always check `brand_assets/` before designing
- If a logo exists, use it — never use a placeholder where a real asset is available
- If a color palette is defined there, use those exact values

## Anti-Generic Guardrails
- **Colors:** Never use default Tailwind palette. Always derive from the brand gold/dark palette
- **Shadows:** Never flat shadows. Use layered, warm-tinted shadows at low opacity
- **Typography:** Never same font for headings and body. Tight tracking (`-0.03em`) on large headings, generous line-height (`1.7`) on body
- **Gradients:** Layer multiple radial gradients. Add grain/texture via SVG noise for depth
- **Animations:** Only animate `transform` and `opacity`. Never `transition-all`. Slow and subtle — nothing energetic
- **Interactive states:** Every clickable element needs hover, focus-visible, and active states
- **Spacing:** Intentional, consistent spacing — not arbitrary values
- **Depth:** Surfaces should have a layering system (base → elevated → floating)

## Hard Rules
- Keep `index.html`, `style.css`, and `script.js` as separate files
- Do not add sections or content not asked for
- Do not use `transition-all`
- Do not use default blue/indigo as any colour
- Do not stop after one screenshot pass when matching a reference
- Always push changes to GitHub after a session: `git add index.html style.css script.js && git commit -m "..." && git push`
