# Deployment

The site is deployed to [Cloudflare Pages](https://pages.cloudflare.com) by direct upload of the `dist/` folder. Production is at https://noir-parfums.pages.dev.

## Publishing a change

```bash
npm run verify
SITE_URL=https://noir-parfums.pages.dev npm run build
npm run deploy
```

`SITE_URL` makes canonical and social image tags absolute. In PowerShell, set it with `$env:SITE_URL = "https://noir-parfums.pages.dev"` before the build.

Deployment is manual and requires a Cloudflare login: `npx wrangler@4 login`.

## Deploying your own copy

```bash
npx wrangler@4 login
npx wrangler@4 pages project create noir-parfums --production-branch main --force
```

Wrangler prints the assigned address. Use it as `SITE_URL`. If you pick a different project name, update the `deploy` script in `package.json` and `name` in `wrangler.toml`.

`--force` creates the project directly on Pages. Without it, recent versions of Wrangler try to create it on Workers, which fails with this configuration. It is only needed once.

## Checks after deploying

1. Walk through the page.
2. Confirm that an unknown path returns the 404 page with a 404 status.
3. Confirm that the headers in `public/_headers` are present in the response.

## Notes

- `public/_headers` uses Cloudflare's format.
- A direct upload project cannot later switch to Git integration.
