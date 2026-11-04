# 9. Do not use containers

**Status:** Accepted

## Context

The build output is a small folder of static files, with no server, database or background process.

## Decision

Do not add a Dockerfile. Use `.nvmrc` and `npm ci` to reproduce the environment.

## Alternatives considered

- **A production image with nginx:** means running a server to do what static hosting already does.
- **A development image:** file watching is often slower in containers on Windows and macOS, and CI already proves the setup on a clean machine.
- **The Playwright image for tests:** mainly useful for comparing screenshots across machines, which this project does not do.

## Consequences

- Contributors need Node.js installed.
- There is no image to maintain or patch.
- Revisit this if a backend is added, if the target infrastructure requires containers, or if reference screenshots are added.
