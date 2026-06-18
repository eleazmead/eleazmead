# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.
An identical copy exists as `AGENTS.md` for OpenAI Codex. **Always update both files together.**

## Commands

```bash
npm start                    # Dev server at localhost:4200 (auto-generates gallery manifest first)
npm run start:staging        # Dev server with staging environment
npm run build                # Production build (auto-generates gallery manifest first)
npm run build:staging        # Staging build
npm run build:production     # Explicit production build
npm run generate-gallery     # Regenerate public/gallery/manifest.json manually
npm test                     # Run tests with Vitest via Angular CLI
```

To run a single test file, use Vitest directly:
```bash
npx vitest run src/app/app.spec.ts
```

There is no lint script configured — use Prettier for formatting:
```bash
npx prettier --write "src/**/*.{ts,html,scss}"
npx prettier --check "src/**/*.{ts,html,scss}"
```

## Architecture

This is an **Angular 22** single-page application (SPA) bootstrapped with standalone components — no `NgModule`. The entry point is `src/main.ts`, which bootstraps `AppComponent` via `src/app/app.config.ts`.

### Key architectural decisions

- **Standalone components throughout.** Every component uses `imports: [...]` directly; there is no shared module.
- **Test runner is Vitest**, not Karma/Jasmine. Test types come from `vitest/globals` (see `tsconfig.spec.json`). The Angular CLI delegates to Vitest via `@angular/build:unit-test`.
- **SCSS, not CSS.** Despite the project being scaffolded with CSS intent, `angular.json` configures `inlineStyleLanguage: scss` and all component style files use `.scss`.
- **Multi-environment config.** Three environment files under `src/environments/` (`development`, `staging`, `production`). The production build sets `baseHref: /eleazmead/` for GitHub Pages hosting.
- **Path-based routing** with a `404.html` workaround for GitHub Pages. `postbuild` copies `index.html` → `404.html` so direct navigation to `/admin` works. No hash prefix.

### CI/CD

GitHub Actions (`.github/workflows/deploy.yml`) runs on every push/PR to `main`:
- PRs: builds with `--configuration development` (no deploy)
- Merges to `main`: injects secrets → production build → deploys to GitHub Pages at `dist/eleazmead/browser`

**Secrets** — set these in GitHub repo → Settings → Secrets and variables → Actions. CI injects them into `environment.production.ts` before the build (replaces `REPLACE_*` placeholders). Never stored in git.

| Secret name | Description |
|---|---|
| `ADMIN_PASSWORD` | Password for the `/admin` dashboard |
| `SHEETS_SPREADSHEET_ID` | Google Sheets spreadsheet ID |
| `SHEETS_API_KEY` | Google Sheets simple API key (not OAuth) |
| `GAS_WEB_APP_URL` | Deployed Google Apps Script Web App URL |

### Local setup after cloning

`environment.ts` and `environment.staging.ts` are gitignored — only template files are committed. Copy and fill in real values before running locally:

```bash
cp src/environments/environment.ts.example src/environments/environment.ts
cp src/environments/environment.staging.ts.example src/environments/environment.staging.ts
# Fill in sheetsSpreadsheetId, sheetsApiKey, gasWebAppUrl in both files
```

### Formatter

Prettier with `singleQuote: true`, `printWidth: 100`, and the `angular` HTML parser for `.html` files.

### App structure

`AppComponent` is a thin router shell (`<router-outlet />`). Two routes:
- `/` → `HomeComponent` (`src/app/components/home/`) — the public wedding website
- `/admin` → `AdminComponent` (`src/app/components/admin/`) — password-protected RSVP dashboard

The public site renders five sections in order: Hero → Our Story → RSVP → Gallery → Footer, all inside `HomeComponent`.

**Config layer** — `src/app/config/app.config.ts` exports `APP_CONFIG` (`as const`), a typed constant holding all couple details, theme tokens, section strings, main course options, and contact info. This is the single source of truth for content.

Notable `APP_CONFIG` fields:
- `sections.ourStory.images` — `readonly string[]` of image URLs shown in the Our Story section
- `sections.mainCourse.options` — the two meal choices (beef / fish) with label and description
- `contacts.whatsappUrl` — WhatsApp CTA link used in the RSVP not-found state

**i18n** — `TranslationService` (`src/app/shared/translation.service.ts`) fetches `public/i18n/{locale}.json` at runtime via `HttpClient`. A `pure: false` `TranslatePipe` exposes `'key.path' | translate` to templates. When a `fil.json` value is empty, the service falls back to the `en.json` value automatically. `provideHttpClient()` must be present in `src/app/app.config.ts` (Angular's ApplicationConfig) for this to work.

**Animations** — Hero uses CSS `@keyframes` fade-in with staggered delays. Section headings use `FadeUpDirective` (`src/app/shared/fade-up.directive.ts`) which attaches an `IntersectionObserver` and adds `.fade-up--visible` when the element enters the viewport. The `.fade-up` / `.fade-up--visible` classes are defined globally in `src/styles.scss` (they can't be scoped because they're applied programmatically).

**Gallery** — Images are served from `public/gallery/`. A build-time script (`scripts/generate-gallery-manifest.mjs`) lists all image files and writes `public/gallery/manifest.json`. `GalleryComponent` fetches this manifest at runtime via `HttpClient` and renders the images. Drop new images into `public/gallery/` and re-run `npm run generate-gallery` (or restart the dev server). Lightbox uses a `selectedIndex` signal; opening sets `document.body.style.overflow = 'hidden'`.

**Asset paths** — i18n JSON and gallery assets live under `public/` (served at `/` in dev, at `/eleazmead/` in production due to `baseHref`). All fetch URLs use relative paths so they resolve correctly in both environments.

**RSVP Google Sheets integration** — RSVP is backed by two Google services:
- **Reads** (guest list): Google Sheets REST API v4 GET via `SheetsService.fetchGuestList()`.
- **Writes** (submissions): Google Apps Script Web App POST via `SheetsService.submitRsvp()`. Uses `Content-Type: text/plain` to avoid CORS preflight.
- Config lives in `src/app/config/sheets.config.ts` (`SHEETS_CONFIG`), which reads `apiKey`, `spreadsheetId`, and `gasWebAppUrl` from the environment file. Fill these into `environment.ts` locally (see "Local setup after cloning"). The spreadsheet must be shared as "Anyone with the link can view".
- `GuestSearchService` (`src/app/shared/guest-search.service.ts`) caches the guest list in memory and exposes a token-overlap fuzzy search (threshold ≥ 0.5) with **exact word matching** (no substring) across `fullName`, `guest1Name`, `guest2Name`.
- **RSVP state machine**: `idle → searching → found → confirming → submitting → success / not_found / error`. Once in `success`, there is no reset.
- **rsvpRaw structure**: always keyed by `row.fullName` (primary guest), with one flat `RsvpEntry[]` covering all group members. When a related guest responds separately, their entry is merged into the existing array (preserving others). Never use separate initiator keys.
- **Meal selection**: each attending guest must pick a main course (beef or fish). `MealChoice` is stored on `RsvpEntry`. `rsvpBeefCount` / `rsvpFishCount` are sent in the submission payload and written to sheet columns F / G.
- **rsvpTotal** counts only `RSVP: true` entries across the merged array (not just the current submission). Computed from `mergedEntries.filter(e => e.RSVP).length` before submitting.
- **Related guests** default to `included: false` — users must explicitly include them.
- **Already-responded check** is per-guest (looks for the initiator's name in the entries array), not per-row. A related guest excluded by the initiator can still search and respond separately; they'll see other group members' responses as read-only.
- **Already-responded message** shows who submitted (`row.rsvpSubmittedBy`), falling back to the first key in `rsvpRaw` for older rows.
- All timestamps use SGT (UTC+8) via `nowSGT()` in `src/app/shared/utils/date.utils.ts`, producing ISO 8601 with `+08:00` offset.
- Data models: `GuestRow`, `RsvpEntry`, `MealChoice`, `RsvpRawPayload`, `RsvpSubmission` in `src/app/shared/models/guest.model.ts`; `LogRow` in `src/app/shared/models/log.model.ts`.
- Signal reactivity with Map: always create `new Map(this.selections())` when mutating — in-place Map mutations do not trigger Angular change detection.

**GuestList sheet column mapping** (enforced in `SHEETS_CONFIG.guestListColumns`):
| Col | Index | Field |
|-----|-------|-------|
| A | 0 | FullName |
| B | 1 | Guest1Name |
| C | 2 | Guest2Name |
| D | 3 | RSVP_Raw (JSON) |
| E | 4 | RSVPTotal |
| F | 5 | RSVPBeef_Count |
| G | 6 | RSVPFish_Count |
| H | 7 | RSVPSubmittedAt |
| I | 8 | RSVPSubmittedBy |

**Apps Script** — source of truth is `scripts/google-apps-script.js` in this repo. To deploy: copy contents into the Apps Script editor → Deploy → New deployment. Always create a new deployment version (not "Manage deployments") for changes to take effect. The deployed Web App URL goes into `SHEETS_CONFIG.gasWebAppUrl`.

**Admin page** (`/admin`) — Password-protected RSVP dashboard:
- Password stored in `environment.adminPassword`. Dev: `dev-admin`. Production: injected from GitHub secret at build time.
- Fetches guest list live from Sheets on login. Manual refresh button available.
- Table enumerates all individual guests (not grouped by row) with: Guest Name, Party Of, Meal Choice, RSVP badge, Date Submitted.
- Summary cards: Total / Attending / Declined / Pending / Beef / Fish counts.
- Export button downloads `EleazMeadRSVP_<datetime>.xlsx` via SheetJS (`xlsx` package).
