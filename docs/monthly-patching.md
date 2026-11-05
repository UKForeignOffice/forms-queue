# Monthly patching

Add a dated section after each month's dependency review. Record resolved versions, the reason for each change, and any findings left for follow-up.

## 2026-10-01

| Dependency | From | To | Why |
| --- | --- | --- | --- |
| Axios (worker dependency, root resolution, and lockfile) | 1.18.0 | 1.20.0 | Fix production advisories involving outbound request manipulation, header injection, proxy/DNS bypass, and denial of service. |

The production Yarn audit reported no advisories after patching. Worker unit tests passed before and after; the worker TypeScript build passed after. The full audit still reports advisories in development/release tooling, which need separate review.

## 2026-11-05

| Dependency | From | To | Why |
| --- | --- | --- | --- |
| `@babel/cli` | 7.28.6 | 7.29.7 | Compatible Babel parent refresh while updating the affected Babel toolchain. |
| `@babel/core` | 7.23.7, 7.29.0 | 7.29.13 | Fix the Babel core advisory with a patched 7.x release. |
| `@babel/helpers` | 7.23.8, 7.29.2 | 7.29.13 | Fix the helpers advisory through compatible Babel 7 resolutions. |
| `@babel/preset-env` | 7.29.5 | 7.29.7 | Keep the Babel 7 parent set current with the compatible core update. |
| `@babel/preset-typescript` | 7.28.5 | 7.29.7 | Keep the Babel 7 parent set current with the compatible core update. |
| `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser` | 8.70.0 | 8.72.1 | Compatible same-major tooling refresh for the affected lint dependency tree. |
| `eslint` | 10.10.0 | 10.14.0 | Compatible same-major tooling refresh for the affected lint dependency tree. |
| `handlebars` | 4.7.8, 4.7.9 | 4.7.10 | Fix the production Handlebars advisories, including the root dependency and release-tool dependency. |
| `follow-redirects` | 1.16.0 | 1.16.2 | Fix the production Axios redirect advisories using the existing resolution. |
| `baseline-browser-mapping` | 2.10.20 | 2.11.35 | Move to a patched compatible release. |
| `brace-expansion` | 1.1.11, 2.0.1, 2.1.0, 5.0.5, 5.0.9 | 1.1.21, 2.1.7, 5.0.12 | Update each existing major-compatible range; no cross-major resolution was used. |
| `browserslist` | 4.22.2, 4.28.2 | 4.29.5 | Fix the compatible 4.x advisory. |
| `diff` | 5.1.0 | 5.2.2 | Fix the compatible 5.x advisory. |
| `glob` | 10.3.10 | 10.5.0 | Fix the compatible high-severity advisory; the separate broad-range advisory remains below. |
| `socks-proxy-agent`, `socks`, `ip` | 8.0.2, 2.7.1, 2.0.0 | 8.0.5, 2.8.9, removed | Refresh the compatible parent and remove the vulnerable `ip` dependency path. |
| `ip-address` | 10.2.0 | 10.7.6 | Fix the compatible 10.x advisories. |
| `js-yaml` | 3.14.1, 4.1.0 | 3.15.2, 4.3.2 | Fix advisories while retaining each dependent's existing major. |
| `lodash-es` | 4.17.21 | 4.18.1 | Move to a compatible patched release. |
| `minimatch` | 3.1.2, 9.0.3, 9.0.5, 10.2.5 | 3.1.5, 9.0.9, 10.2.6 | Fix older compatible advisories; the broad v9/v10 advisory remains below. |
| `pacote` | 19.0.2 | 19.0.3 | Apply the latest compatible v19 update; the advisory requires a newer major and remains below. |
| `picomatch` | 2.3.1, 4.0.4 | 2.3.2, 4.0.7 | Fix the compatible 2.x advisories and refresh the matching 4.x locator. |
| `postcss-selector-parser` | 7.1.1 | 7.1.7 | Fix the compatible 7.x advisories. |
| `tar` | 6.2.0, 7.5.15 | 6.2.1, 7.5.22 | Update both compatible ranges; the v6 findings remain because current parents constrain tar to v6. |

### Audit and verification

Audits used the vendored Yarn 4.0.2 CLI with `yarn npm audit --all --recursive --json`, plus `--environment production` for the production-only scope. The all-dependency audit includes development and release tooling. No advisories or denial-of-service findings were filtered.

| Audit scope | Before | After |
| --- | --- | --- |
| All dependencies | 99 records: 4 critical, 51 high, 36 moderate, 8 low; exit 1 | 22 records: 1 critical, 10 high, 10 moderate, 1 low; exit 1 |
| Production dependencies | 7 records: 2 critical, 3 high, 2 moderate; exit 1 | 1 moderate deprecation record; exit 1 |

Both audit scopes completed and returned JSON; the Yarn audit endpoint did not return HTTP 400, so the OSV fallback was not needed. The inherited `NODE_TLS_REJECT_UNAUTHORIZED=0` was unset for individual network audit and package-update commands; audit stderr was empty. These results are not clean or vulnerability-free: the all-dependency scope retains security findings, and the production audit still exits nonzero for the `cron-parser` deprecation record.

The baseline `yarn worker test` passed before edits (3 suites, 11 tests). After patching, the same command passed (3 suites, 11 tests), `yarn worker build` passed, and `yarn worker lint` passed.

### Remaining audit findings

Ranges below are the audit's affected ranges; the installed versions are the exact versions reported by the post-patching audit. Yarn also reports deprecations without GHSA identifiers.

| Installed package | Advisory, severity, affected range | Why deferred |
| --- | --- | --- |
| `@sigstore/core@2.0.0` | GHSA-jfc7-64v2-mr8c, moderate, `<=3.2.0` | Current `sigstore@3.1.0` parent requires the older core line. Fixing this requires an upstream signing-tooling parent migration; no cross-major override was applied. |
| `cron-parser@4.9.0` | Yarn deprecation, moderate, `4.9.0` | Production `pg-boss@10.3.3` requires `cron-parser ^4.9.0`; even `pg-boss@10.4.2` retains that range. Moving to v5 requires a `pg-boss` migration and validation. |
| `deepmerge@4.3.1` | GHSA-gcqx-w48m-w2h4, low, `>=4.2.0 <=4.3.1` | Jest 29's `jest-config@29.7.0` keeps this on the 4.x line, whose latest version remains affected. Defer to a tested Jest/tooling migration. |
| `glob@10.5.0` | GHSA-3g3m-2fjr-6pw4, moderate, `>=9.0.0 <=14.0.1` | Current parents constrain glob to v10; the affected range spans that entire major. Do not force a v14 resolution across parent ranges. |
| `glob@7.2.3` | Yarn deprecation, moderate, `7.2.3` | Retained by older Babel/Jest tooling ranges; removing it requires a parent/tooling migration. |
| `inflight@1.0.6` | Yarn deprecation, moderate, `1.0.6` | Comes from the older glob 7 dependency tree; defer with the Babel/Jest tooling migration. |
| `minimatch@9.0.9`, `minimatch@10.2.6` | GHSA-g3hv-75wg-m249, moderate, `>=7.0.0 <11.0.1` | Existing parents require v9/v10 ranges. Updating to fixed v11 would cross those ranges and was not forced. |
| `pacote@19.0.3`, `pacote@20.0.1` | GHSA-w4pp-8pjf-rmxw, high, `>=11.2.7 <21.5.1` | The current npm/release-tooling parents require v19/v20. The fixed version requires a parent major migration. |
| `semver-diff@5.0.0` | Yarn deprecation, moderate, `5.0.0` | Used by the current semantic-release toolchain; removal is deferred to a release-tooling migration. |
| `sigstore@3.1.0` | GHSA-52v5-jr5w-gjxr, high, `<=4.1.0` | The current npm/release-tooling dependency ranges do not permit the fixed line. Defer to a compatible parent migration rather than override across majors. |
| `tar@6.2.1` | GHSA-34x7-hfp2-rc4v (high, `<7.5.7`); GHSA-8qq5-rm4j-mr97 (high, `<=7.5.2`); GHSA-83g3-92jg-28cx (high, `<7.5.8`); GHSA-qffp-2rhf-9h96 (high, `<=7.5.9`); GHSA-9ppj-qmqm-q256 (high, `<=7.5.10`); GHSA-r6q2-hw4h-h46w (high, `<=7.5.3`); GHSA-vmf3-w455-68vh (moderate, `<=7.5.15`); GHSA-w8wr-v893-vjvp (moderate, `<=7.5.17`); GHSA-23hp-3jrh-7fpw (critical, `<=7.5.18`); GHSA-8x88-c5mf-7j5w (high, `<=7.5.17`); GHSA-gvwx-54wh-qm9j (moderate, `<=7.5.16`); GHSA-r292-9mhp-454m (high, `<=7.5.20`) | Current `node-gyp@10`/`cacache@18` parents require tar v6. The patched v7 line is present where compatible, but moving these remaining parents to v7 needs a validated parent-major migration. This includes the reported denial-of-service findings. |
