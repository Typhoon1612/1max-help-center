# 1MAX Help Center (Vue 3 + Vite)

This repository contains the 1MAX Help Center built with Vue 3 and Vite. It provides a responsive FAQ UI that fetches content at runtime from an AWS CloudFront distribution (no hardcoded Q/A in source files).

Key features

- Runtime JSON fetching from CloudFront (configured via `VITE_CLOUDFRONT_URL`)
- Generic category renderer supporting multiple FAQ categories
- Accordion-based FAQ UI with sanitized list rendering (preserves ordered lists across blocks)
- Responsive layout: fixed sidebar on desktop, overlay drawer with hamburger on mobile
- Accessibility: ARIA attributes, Esc to close drawer, focus management

Quick start

1. Install deps: `npm install`
2. Set environment: create `.env` with `VITE_CLOUDFRONT_URL=https://dep52ncmdw0n1.cloudfront.net`
3. Run dev server: `npm run dev`

Notes

- Follow `rules_&_info/CLAUDE.md` — FAQ content must be loaded from the CloudFront JSON files at runtime.
- If you see CORS errors when fetching JSON, ensure CloudFront/S3 CORS headers allow requests from your dev origin.

See the `src/` folder for component structure and the `rules_&_info/` directory for design and data-source guidelines.
