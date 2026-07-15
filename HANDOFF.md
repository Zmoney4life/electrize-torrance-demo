# Electrize demo landing page - handoff

A prospect-facing demo landing page for **Electrize**, an electrical contractor in
Torrance, CA. Built by Mindframe Media as a sales demo (show the prospect what their
funnel could look like). The design is adapted from an Airo-built template; all of the
original template's roofing content/images were removed.

## Links

- **Live:** https://zmoney4life.github.io/electrize-torrance-demo/
- **Repo:** https://github.com/Zmoney4life/electrize-torrance-demo
- **GitHub account:** `Zmoney4life` (NOT `z-uni-account` - that is the personal/Meow Belle account)

## Files

| File | What it is |
|------|-----------|
| `index.html` | The landing page (all sections, hand-authored) |
| `thank-you.html` | Post-submit thank-you page |
| `form.js` | The 9-step estimate wizard (renders into `#estimate-form`) + the testimonials (renders into `#reviews-grid`) |
| `index.css` | Compiled Tailwind stylesheet (see gotcha below) |
| `favicon.svg` | Lightning-bolt favicon |
| `assets/img/*.jpg` | Stock photos (Pexels, free license) |

No build step. It is a plain static site: open `index.html` in a browser and it works.

## How the form works

`form.js` builds a 9-step wizard: 1) service type 2) situation 3) homeowner
4) timeline 5) other estimates 6) address 7) callback time 8) city 9) contact + SMS
consent. **Demo mode: on submit it just redirects to `thank-you.html`. Nothing is
saved or sent anywhere.** To capture real leads, wire the submit handler in `form.js`
(the `data-submit` click near the bottom) to POST to a webhook (e.g. a GoHighLevel
inbound webhook) before the redirect.

## Business details used (Electrize)

- Phone: **(310) 408-3448** · Email: **info@electrize.net**
- Address: **1972 Del Amo Blvd, Ste A, Torrance, CA 90501**
- **Since 2006**, serving Greater Los Angeles · C-10 electrical contractor
- Services: panel upgrades, EV charger installs, wiring/rewiring, new construction,
  recessed lighting/ceiling fans, troubleshooting
- Source: their Yelp (yelp.com/biz/electrize-torrance-2) + web. **License # unknown** -
  the footer currently says "C-10 Electrical Contractor" with no number. Add the real
  number when you have it.

## Theme

Light theme. Primary blue `#2563eb`, accent gold `#ebad25`, near-black `#1a1a1a`,
section gray `#f5f5f5`, navy CTA `#1e3a6e`. Font: Inter (loaded by `index.css`).

## Deploy

Push to `main`; GitHub Pages rebuilds in ~30-60s. Two GitHub accounts are configured
locally, so target the right one explicitly:

```
gh auth switch --user Zmoney4life
git push "https://Zmoney4life:$(gh auth token)@github.com/Zmoney4life/electrize-torrance-demo.git" main
```

(Enable Pages, if ever needed again: `gh api -X POST repos/Zmoney4life/electrize-torrance-demo/pages -f "source[branch]=main" -f "source[path]=/"`)

## Images

Stock photos from Pexels (free license, no attribution required). To swap: drop a new
JPG into `assets/img/` with the same filename, or edit the `<img src>` in `index.html`.
Current files: `hero, panel, ev, wiring, lighting, construction, team`.

## Testimonials

The 3 review cards are **placeholder samples** defined in the `reviews` array in
`form.js`. Swap them for the client's real Google/Yelp reviews.

## IMPORTANT build gotcha (read before editing markup)

`index.css` is a **purged** Tailwind build - it only contains the utility classes the
original template actually used. If you add NEW markup using a Tailwind class that
was not already in the template, that class may be **missing** and silently break the
layout (e.g. a `w-16` box collapsing). When you add markup, either reuse classes
already present or add the missing utility to the `<style>` block in the HTML
(see the "utilities not present in the purged build" section already there).

Quick check for a missing class:
`grep -c '\.the-class[{:]' index.css` (0 = missing, add it to the `<style>` block).

## Open items / TODO

- [ ] Real reviews (replace placeholders in `form.js`)
- [ ] Real CA license number in footer + about section
- [ ] Optional: wire the form to a real webhook (GHL) for live lead capture
- [ ] Optional: real project/team photos if the client provides them
- [ ] Optional: mobile hamburger menu (nav currently hides under 900px; only logo +
      Free Estimate button show on phones)
- [ ] Optional: custom domain via GitHub Pages settings
