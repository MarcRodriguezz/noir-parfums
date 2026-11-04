# 10. Collect no data and set security headers

**Status:** Accepted

## Context

The site is public and static, and it takes no real orders. It should collect nothing and expose as little as possible.

## Decision

- No analytics, cookies or third-party requests, so no consent banner is needed.
- Fonts are hosted with the site.
- The reservation form sends one validated `GET` parameter and stores nothing.

| Header                                             | Reason                                 |
| -------------------------------------------------- | -------------------------------------- |
| `X-Content-Type-Options: nosniff`                  | Stops browsers guessing file types     |
| `X-Frame-Options: DENY`                            | Rules out clickjacking                 |
| `Referrer-Policy: strict-origin-when-cross-origin` | Keeps full URLs from other sites       |
| `Permissions-Policy`                               | Denies camera, microphone and location |
| Immutable cache on `/_astro/*`                     | File names contain a content hash      |

The 404 and reservation pages use `noindex`, because they have no value as search results.

## Alternatives considered

- **Analytics:** usage data is not needed for this project.
- **Google Fonts:** sends visitor addresses to a third party.
- **A strict Content Security Policy:** the site has no user content or third-party scripts, so the benefit is small, and the inline boot script would need a hash kept in sync. It is on the [roadmap](../roadmap.md).

## Consequences

- There is no record of how the site is used.
- `public/_headers` depends on Cloudflare's format.
