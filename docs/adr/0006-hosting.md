# 6. Host on Cloudflare Pages by direct upload

**Status:** Accepted

## Context

The site needs free static hosting with HTTPS, custom response headers and a free subdomain. Provider terms were checked in November 2026.

## Decision

Deploy to Cloudflare Pages by direct upload with Wrangler, run through `npx`. GitHub Actions runs all checks on every push and pull request, but does not deploy.

## Alternatives considered

| Provider     | Free plan                                  | Drawback                           |
| ------------ | ------------------------------------------ | ---------------------------------- |
| Vercel Hobby | Guideline of 100 GB of transfer a month    | Non-commercial use only            |
| Netlify Free | 300 credits, with 15 per production deploy | Every deploy uses credits          |
| GitHub Pages | 1 GB site, soft limit of 100 GB a month    | No custom headers                  |
| Workers      | Static asset requests are free             | Address includes account subdomain |

Cloudflare Pages allows 500 builds a month and 20,000 files, and states no bandwidth limit.

## Consequences

- No provider token is stored in the repository.
- Deploys are manual, with no previews per pull request.
- Wrangler stays out of `package.json`, avoiding dozens of packages for an occasional step.
- A direct upload project cannot later move to Git integration.
- Recent versions of Wrangler treat direct Pages projects as a previous generation. If Cloudflare retires them, follow its [migration guide](https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/).
