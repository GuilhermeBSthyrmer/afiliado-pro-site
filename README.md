# Afiliado Pro · landing page

Landing page for **Afiliado Pro**, a Windows desktop app I built that watches WhatsApp and Telegram groups for product links (Shopee, Mercado Livre, Amazon, AliExpress), swaps them for the user's own affiliate link and reposts the offer in the user's groups.

The page is in Portuguese, because the product is for Brazilian affiliates.

**Live:** `https://cururupernatorta.github.io/afiliado-pro-site/` (after GitHub Pages is enabled)

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

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
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
