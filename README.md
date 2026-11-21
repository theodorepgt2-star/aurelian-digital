# Aurelian Digital

Static one-page site: HTML, CSS and vanilla JS with GSAP (ScrollTrigger, SplitText).

## Files
- `index.html` — structure and Greek copy (EN translations live in `main.js`)
- `styles.css` — ivory / autumn-brown theme, responsive, reduced-motion fallback
- `main.js` — GSAP animations, EL/EN toggle, contact form → Supabase
- `config.js` — Supabase URL and publishable key (safe to publish)
- `supabase.sql` — `contact_requests` table and RLS policy

## Run locally
Open `index.html` in a browser, or run `python3 -m http.server 8000` and visit http://localhost:8000.

## Deploy
Any static host works (GitHub Pages, Cloudflare Pages, Netlify). Upload the folder as-is.

## Enquiries
Form submissions are stored in the `contact_requests` table in Supabase. Email notifications are not wired up yet.
