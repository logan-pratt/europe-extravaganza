# Europe Extravaganza Agent Notes

## Project Summary

This repository is a static GitHub Pages trip-planning site for Logan Pratt's June/July 2026 Europe trip.

The project started as the London Love Letter interactive site, then was renamed and expanded into `europe-extravaganza` with a shared landing hub plus separate trip planners.

Current repo:

- GitHub: `logan-pratt/europe-extravaganza.git`
- Main branch: `main`
- Expected Pages URL: `https://logan-pratt.github.io/europe-extravaganza/`
- Local workspace path: `/Users/loganpratt/Downloads/london_love_letter_interactive_site`
- Static only: no build step, no backend, no package install required

Keep the site GitHub Pages-compatible. Prefer plain HTML, CSS, and vanilla JS.

## User Preferences

- Be concise.
- Do the requested work directly when the request is clear.
- Do not overwrite unrelated user changes.
- Use `apply_patch` for manual file edits.
- Prefer `rg` / `rg --files` for searching.
- When making frontend changes, verify in the browser if practical.
- Do not push unless the user asks for it, except when the current request explicitly includes pushing.
- If pushing, run focused checks first and report the commit hash.

## Repository Layout

```text
.
├── index.html                 # Europe Extravaganza landing hub
├── styles.css                 # Landing hub styles
├── assets/
│   ├── lisbon.jpg             # User-provided Lisbon image
│   └── dublin-temple-bar.jpg  # User-provided Dublin image
├── dublin/
│   ├── index.html             # Dublin planner shell
│   ├── styles.css             # Dublin planner styles
│   ├── data.js                # Dublin trip data
│   ├── app.js                 # Dublin render/interactions
│   ├── notes-logic.js         # Pure note/share/final-cut logic
│   └── notes-logic.test.mjs   # Node test coverage
├── london/
│   ├── index.html             # London planner shell
│   ├── styles.css             # London base styles
│   ├── enhancements.css       # London enhancement styles
│   ├── data.js                # London trip data
│   ├── app.js                 # London render/interactions
│   ├── notes-logic.js         # Pure note/share/final-cut logic
│   └── notes-logic.test.mjs   # Node test coverage
├── .github/workflows/pages.yml
├── README.md
└── AGENTS.md
```

## Current Trip Outline

Landing page covers five chapters:

- Lisbon, Portugal: June 24-30, 2026
- Kilkea Castle, Kildare, Ireland: June 30-July 2, 2026
- Galway, Ireland: July 1-3, 2026
- Dublin, Ireland: July 3-5, 2026
- London, England: July 5-9, 2026

Lisbon, Kilkea, and Galway are currently hub cards only and should stay disabled/TBD until their own planners are built.

Known context:

- Lisbon includes Ashley and Max and a Sintra day trip.
- Kilkea Castle is for Taylor and Austin's wedding.
- Galway includes Ashley and Max, a bus tour, and the Cliffs of Moher.
- Dublin is for Logan, Emily, Ashley, and Max.
- London is not for Ashley and Max, so hub copy should not frame London as something shared by the whole group.

Important wording preference:

- Avoid phrases like "couples trip" on shared pages. Use "trip."
- Avoid "London carries the romantic final act" on the hub. Use "London carries the final act."
- Hub copy should be share-safe for Ashley and Max.

## Landing Hub

Files:

- `index.html`
- `styles.css`

The hub is a cinematic trip overview with cards for all five destinations.

Current hub behavior:

- Lisbon/Kilkea/Galway buttons are greyed-out TBD buttons.
- Dublin and London link to their planners.
- Hub includes a collaboration explainer:
  - React on cards.
  - Add notes and ideas.
  - Send Logan a share packet.

Images:

- Lisbon card uses `assets/lisbon.jpg`, provided by the user.
- Dublin card uses `assets/dublin-temple-bar.jpg`, provided by the user.
- Do not use inaccurate generic landmark images. A previous Kilkea/wedding image showed the Taj Mahal and was rejected.
- Do not use `source.unsplash.com`.

## Dublin Planner

Files:

- `dublin/index.html`
- `dublin/styles.css`
- `dublin/data.js`
- `dublin/app.js`
- `dublin/notes-logic.js`
- `dublin/notes-logic.test.mjs`

Core trip facts:

- Dates: July 3-5, 2026
- Travelers: Logan, Emily, Ashley, Max
- Arrival: Galway to Dublin train
  - Depart Galway: 3:05pm
  - Arrive Dublin: 5:44pm
  - Likely station: Dublin Heuston
- Hotel: Marlin Hotel Dublin
- Mood: pub-warm, Georgian green, whiskey gold, literary, social/fun, premium but not precious

Dublin must respect the content pack and known closure/avoid notes:

- Dublin Castle campus is unavailable / should not be routed through.
- Chester Beatty is unavailable.
- Guinness Storehouse should be skipped unless the group says it is a must-do.
- Howth, Poolbeg, hop-on-hop-off, long excursions, and long museum blocks are intentionally discouraged.

Recent Dublin updates:

- Restaurant and pub/nightlife cards have website or Google Maps links.
- Notes review includes instructions for sending Logan notes/reactions.
- Hero train animation was enhanced with:
  - `2h 39m` duration badge
  - animated track fill
  - glowing train
  - Galway/Dublin station markers
  - arrival beats: Drop bags, First pint, Mister S, Music if alive

When editing Dublin, preserve:

- Add / Maybe / Skip status controls.
- Per-card notes dropdowns.
- Four-author notes: Logan, Emily, Ashley, Max.
- Reactions: Love, Maybe, Nope, Concern.
- Missing suggestion form.
- Copy readable notes.
- Copy share packet.
- Import share packet and merge behavior.
- Review section showing notes grouped by option/person.
- Final-cut logic.
- Passport/stamp progress.
- Countdown/booking timeline.
- Constellation/map-like section.

## London Planner

Files:

- `london/index.html`
- `london/styles.css`
- `london/enhancements.css`
- `london/data.js`
- `london/app.js`
- `london/notes-logic.js`
- `london/notes-logic.test.mjs`

London was the original visual/design/interaction baseline. Do not break it when editing the hub or Dublin.

London should remain a separate static experience under `/london/`.

When editing shared patterns, check both Dublin and London because they have similar notes/share/final-cut concepts but separate implementations.

## Notes And Sharing Model

The planners use browser `localStorage`.

Nothing syncs automatically between devices. The collaboration flow is:

1. Each person opens a trip page.
2. They add reactions and notes locally.
3. They can add missing suggestions.
4. They use `Copy share packet`.
5. They send the copied packet to Logan.
6. Logan imports packets into his browser using the import UI.

Share packets and missing suggestions must remain portable static text. Do not add a backend or cloud sync unless explicitly requested.

When changing note/share logic, update tests in the matching `notes-logic.test.mjs`.

## Deployment

GitHub Pages deploys through GitHub Actions:

- Workflow: `.github/workflows/pages.yml`
- Trigger: push to `main` or manual dispatch
- Pages source: GitHub Actions
- Artifact path: repository root `.`
- `actions/configure-pages@v5` uses `enablement: true`
- Workflow sets `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true`

Important: the previous Pages failure was fixed by enabling Pages for GitHub Actions and adding `enablement: true`.

## Local Development

No install is needed.

Recommended local server:

```bash
python3 -m http.server 4174
```

Open:

```text
http://127.0.0.1:4174/
http://127.0.0.1:4174/dublin/
http://127.0.0.1:4174/london/
```

Opening `index.html` directly works for much of the site, but local server testing is better for browser smoke tests and relative links.

## Verification Commands

Run focused checks after JS or interaction changes:

```bash
node --check dublin/app.js
node --check dublin/data.js
node --check london/app.js
node --check london/data.js
node --test dublin/notes-logic.test.mjs london/notes-logic.test.mjs
```

For Dublin-only changes, at minimum:

```bash
node --check dublin/app.js
node --check dublin/data.js
node --test dublin/notes-logic.test.mjs
```

For London-only changes, at minimum:

```bash
node --check london/app.js
node --check london/data.js
node --test london/notes-logic.test.mjs
```

For HTML/CSS-only changes, still do a browser smoke test on the affected page.

## Browser QA Checklist

For hub changes:

- Landing page renders at `/`.
- Lisbon/Kilkea/Galway remain disabled/TBD unless explicitly building them.
- Dublin and London links work.
- Collaboration instructions are visible and readable.
- Card images look accurate enough for their destination.
- Mobile width does not cause text overlap.

For Dublin changes:

- `/dublin/` renders without console errors.
- Hero train card is readable and animated unless reduced motion is enabled.
- Filters/cards still render.
- Notes dropdowns open.
- Copy readable notes works.
- Copy share packet works.
- Import packet UI still exists.
- Missing suggestions are visible in review/export flows.

For London changes:

- `/london/` renders without console errors.
- Existing London planner interactions still work.
- Print/PDF/share functionality is not broken.

## Design Direction

Overall:

- Cinematic, premium, travel-magazine feel.
- Not a generic travel dashboard.
- Use rich atmosphere, careful typography, and polished cards.
- Keep the first screen useful, not a marketing landing page.
- Avoid UI text that explains obvious UI mechanics unless it is needed for collaboration or sharing.
- Avoid text overlap on mobile and desktop.
- Avoid one-note palettes dominated by a single hue.

Dublin:

- Literary
- Pub-warm
- Georgian
- Whiskey gold
- Dark wood
- Social/fun for four people

London:

- Preserve the original love-letter polish and interaction quality.
- Keep London distinct from Dublin.

Hub:

- Shared, inclusive trip overview.
- Must be readable over the light background.
- Copy should work for Logan, Emily, Ashley, and Max.

## Content Source Of Truth

Dublin source material came from:

```text
/Users/loganpratt/Downloads/final_unified_dublin_trip_codex_pack_v2_train_arrival.md
```

If future Dublin facts conflict with memory or assumptions, prefer the content pack if available.

Do not invent facts that conflict with existing trip constraints.

## Git Notes

Typical flow:

```bash
git status --short
git diff --stat
git add <changed files>
git commit -m "<clear message>"
git push origin main
```

Push only after verification when the user asks for it.

Recent useful commits:

- `7c2c147` - Enhance Dublin train and collaboration notes
- `525a282` - Add Dublin links and note sharing instructions
- `83139ac` - Use provided Lisbon and Dublin photos
- `9a6606a` - Use accurate landing page trip photos
- `af4865e` - Clarify collaborative trip planning features
- `53d5439` - Fix GitHub Pages workflow enablement

## Known Gotchas

- The repo folder is still named `london_love_letter_interactive_site` locally even though the project is Europe Extravaganza.
- There may be a local static server already running on port `4174`.
- Browser screenshot capture has timed out before, but DOM smoke tests through the in-app browser have worked.
- Some CSS/JS references use cache-busting query strings. Update them when needed so Pages/browser cache does not hide changes.
- Do not remove the Pages workflow environment settings unless replacing the deployment strategy.
- Do not add npm dependencies unless explicitly needed.
- Keep assets local or stable. Avoid unstable image URLs.

