# Afiliado Pro · landing page

[![CI](https://github.com/GuilhermeBSthyrmer/afiliado-pro-site/actions/workflows/ci.yml/badge.svg)](https://github.com/GuilhermeBSthyrmer/afiliado-pro-site/actions/workflows/ci.yml) [![CodeQL](https://github.com/GuilhermeBSthyrmer/afiliado-pro-site/actions/workflows/codeql.yml/badge.svg)](https://github.com/GuilhermeBSthyrmer/afiliado-pro-site/actions/workflows/codeql.yml)

Landing page for **Afiliado Pro**, a Windows desktop app I built that watches WhatsApp and Telegram groups for product links (Shopee, Mercado Livre, Amazon, AliExpress), swaps them for the user's own affiliate link and reposts the offer in the user's groups.

The page is in Portuguese, because the product is for Brazilian affiliates.

**Live:** https://guilhermebsthyrmer.github.io/afiliado-pro-site/

## Design

The visual language is a Brazilian supermarket offer flyer (*encarte*): drenched yellow, price-tag red, huge condensed italic prices, starbursts and dashed cut lines. That flyer is exactly what the app produces all day, so the page looks like its own output.

## What's on the page

- **Live pipeline demo** in the hero: an offer arrives in a monitored group, the app detects the store, fetches the price and swaps the link, and the formatted post lands in the user's group. Cycles through three products, with pause/next controls (WCAG 2.2.2) and a static version for `prefers-reduced-motion`.
- **Ad template editor**: edit the message template with variables (`{title}`, `{price_line}`, `{discount_line}`, `{pix_line}`, `{coupon_line}`…) and see a live preview rendered with WhatsApp formatting (`*bold*`, `_italic_`, `~strike~` with a single tilde). Line variables remove the whole line when the product has no data, mirroring the app's real `formatMessage`.
- **Honest discount rule**, taken from the app: a "from X to Y" price only appears when the store reports a real original price, and the percentage is rounded down.
- Niche-per-group routing diagram, a live-updating sample log, FAQ with `<details>`, and a validated sign-up form (demo only, nothing is sent).

## Technical notes

- Plain HTML, CSS and JavaScript. No build step, no dependencies.
- Strict Content Security Policy: no inline scripts or styles, `connect-src 'none'`.
- All illustrations are hand-authored inline SVG.
- Responsive down to 320 px, keyboard accessible, visible focus, themed selection and scrollbar.

## Tests

End-to-end tests with [Playwright](https://playwright.dev/), each scenario run on a desktop and a mobile viewport (Chromium). 4 scenarios: the page loads without console errors or horizontal overflow, the live demo switches offers and can be paused, the ad template editor renders WhatsApp formatting and drops empty lines, and the sign-up form validates and confirms.

Every push runs the suite on GitHub Actions, together with Lighthouse (accessibility and best practices must score 90 or more) and CodeQL security analysis. Dependabot keeps the dependencies up to date.

```bash
npm install
npx playwright install chromium
npm test
```

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
npm start   # http://localhost:4180
```

## Structure

```
index.html
css/style.css
js/main.js
assets/favicon.svg
```

Products, prices and links shown on the page are examples. Store and messaging app names belong to their owners.

## License

MIT
