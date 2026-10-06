# Monthly patching

Add a dated section after each month's dependency review. Record resolved versions, the reason for each change, and any findings left for follow-up.

## 2026-10-01

| Dependency | From | To | Why |
| --- | --- | --- | --- |
| Axios (worker dependency, root resolution, and lockfile) | 1.18.0 | 1.20.0 | Fix production advisories involving outbound request manipulation, header injection, proxy/DNS bypass, and denial of service. |

The production Yarn audit reported no advisories after patching. Worker unit tests passed before and after; the worker TypeScript build passed after. The full audit still reports advisories in development/release tooling, which need separate review.
