# SeeSmitty Web Tools

A collection of simple, fast, browser-based utility tools. No accounts, no tracking, no data ever leaves your device.

**Live site:** https://SeeSmitty.github.io/web-tools/

## Tools

| Tool | Description |
|------|-------------|
| [QR Code Generator](https://SeeSmitty.github.io/web-tools/#/qr) | Generate QR codes for text, URLs, or Wi-Fi credentials |
| [Color Picker](https://SeeSmitty.github.io/web-tools/#/color-picker) | Pick a color, get HEX/RGB/HSL values, generate palettes |
| [Base64 Encoder / Decoder](https://SeeSmitty.github.io/web-tools/#/base64) | Encode text or files to Base64, or decode back |
| [UUID Generator](https://SeeSmitty.github.io/web-tools/#/uuid) | Bulk-generate v4 UUIDs and copy with one click |
| [Password Generator](https://SeeSmitty.github.io/web-tools/#/password) | Generate secure passwords with strength meter |
| [JSON Formatter](https://SeeSmitty.github.io/web-tools/#/json) | Format or minify JSON with syntax highlighting |

## Tech Stack

- [Vue 3](https://vuejs.org/) — Composition API
- [Vite 6](https://vite.dev/) — build tool
- [Vue Router 4](https://router.vuejs.org/) — hash mode routing
- [Tailwind CSS 3](https://tailwindcss.com/) — utility-first styling

## Local Development

```bash
cd web-tools
npm install
npm run dev
```

## Deployment

Pushes to `main` automatically build and deploy to GitHub Pages via GitHub Actions.
