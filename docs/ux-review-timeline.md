# Timeline UX review

Findings from a hands-on UX pass of `frontend/timeline.html` (2026-08-03), done by running the
full stack locally (Postgres → backend API → static frontend) and interacting with every control
across desktop and mobile viewport sizes. Each item tracks status independently — update as fixed.

Severity: **High** = actively confuses or breaks the experience. **Medium** = degrades usability
but has a workaround. **Low** = polish.

Priority: order to tackle in, weighing severity against effort — **P1** (do next) to **P4**
(whenever). Effort: **S** (well under a day), **M** (a day or two), **L** (multi-day, likely
needs a design decision first).

## Summary

| # | Item | Severity | Priority | Effort | Status |
|---|---|---|---|---|---|
| 1 | No responsive design — mobile broken | High | P1 | M | ✅ Fixed |
| 2 | Two disconnected browse mechanisms | Medium | P3 | L | ✅ Fixed |
| 3 | Zoom doesn't add precision; markers overlap | Medium | P2 | M | ✅ Fixed |
| 4 | No off-screen orientation cue | Medium | P2 | S–M | ✅ Fixed |
| 5 | Competing filter controls read as one | Low | P3 | S | ✅ Fixed (as a side effect of #2) |
| 6 | Detail panel fixed-width, no overflow cue | Low | P3 | S | ✅ Fixed |
| 7 | "Civilizations" label may go stale | Low | P4 | S | ✅ Fixed (as a side effect of #2) |

## Fixed items

### 1. No responsive design — mobile layout is broken
Status: **✅ Fixed (2026-08-03)** · Severity: **High** · Priority: **P1** · Effort: **M**

`timeline.css` had a single `@media` query (dark mode) and zero width-based breakpoints.
At a 390px viewport:

- `.nav-toggle` is `position: fixed; top: 30px; left: 8px` (`timeline.css:264-266` at the time
  of writing — line numbers have since drifted from later edits), a 34px box
  spanning x=8–42. The topbar's padding (`clamp(20px, 4vw, 44px)`, `timeline.css:159`) collapsed
  to its 20px floor on narrow screens, so the wordmark started at x=20 — the hamburger icon
  visibly overlapped and clipped the "H" in "History".
- The topbar controls (topic filter, Landmark/All toggle, zoom slider) wrapped into 3 stacked
  rows instead of collapsing into anything compact, consuming ~160px of vertical space before
  any timeline content was visible.
- Closing the detail panel left a ghost artifact: an empty rounded white box stayed pinned to
  the bottom of the viewport, overlapping the last visible lane's label — read as a rendering
  bug rather than a closed panel.

Fix applied, all under a new `@media (max-width: 520px)` breakpoint in `timeline.css`:

- Widened `.topbar`'s left padding to 52px so it clears the fixed hamburger button.
- Tightened topbar padding/gaps and control sizing to cut the stacked-controls' vertical
  footprint.
- Root-caused the ghost panel: the mobile bottom sheet used `position: absolute` inside
  `.stage` with `transform: translateY(100%)` to hide when closed — but that only moves the
  panel by its *own* rendered height, which shrinks to fit near-empty content. Since `.stage`'s
  bottom sits above the page footer, a short panel's 100%-of-itself translation undershoots the
  true viewport edge by that footer gap, leaving a sliver visible. Confirmed via computed
  styles (`getBoundingClientRect`): panel height 193px translated 193px down, but the viewport
  had 29.5px of room below `.stage` that the panel needed to clear and didn't. Switched the
  mobile variant to `position: fixed` so `bottom: 0` anchors to the real viewport instead of
  `.stage`, making `translateY(100%)` always fully clear it regardless of content height.

Verified via live interaction at 390×844 (reload, open panel, close panel) and confirmed
desktop (>900px) is unaffected since none of the changes apply above the new breakpoint.

### 3. Zooming in doesn't increase date precision, and landmark markers overlap
Status: **✅ Fixed (2026-08-03)** · Severity: **Medium** · Priority: **P2** · Effort: **M**

Axis ticks were fixed at 500-year intervals regardless of zoom level — confirmed at 100% and
310% zoom, tick spacing in *time* never changed, only pixel spacing did. Root cause: for the
`civilization` category, `TICK_YEARS` was a hardcoded array (`timeline.js`) rendered as-is.
Even the "auto" tick logic meant for future categories only computed its step once at load
(`span / AUTO_TICK_TARGET_COUNT`), a domain-driven target that's zoom-invariant — it was never
re-invoked when zoom changed, so it could only *reduce* density to avoid crowded labels, never
increase it on zoom-in. Separately, in "Landmark events" mode, markers close in time rendered
as literally overlapping circles (visible on the Greece/Persia rows) with no cluster indicator,
so you couldn't tell two markers were stacked or reliably click the one you wanted — `renderLanes()`
placed each marker at `yearToX(ev.year)` with no collision handling at all.

Fix applied in `timeline.js`:

- Replaced the span/target-count tick algorithm with a purely pixel-spacing-driven one:
  `pickTickStep()` now picks the finest round-number step (10/25/.../1000y) whose spacing at
  the *current* `pxPerYear()` still clears `AUTO_TICK_MIN_PX_SPACING`, and `generateTicks()` is
  called fresh inside `renderAxisAndEras()` on every render (including zoom-input events)
  instead of once at load and cached. Tuned the spacing constant (170px) so the default 100%
  zoom reproduces the original curated 500-year ticks exactly — verified no visual change at
  100%, and 100-year ticks appear by ~290% zoom.
  - Dropped the civilization category's hardcoded `tickYears` array and the unused
    `AUTO_TICK_TARGET_COUNT` constant now that generation is always dynamic.
- Added a minimum-gap pass in `renderLanes()`: events in a lane are sorted by their ideal x
  position, then any marker closer than `MIN_MARKER_GAP_PX` (16px) to its predecessor is pushed
  out to clear that gap. This is a small, bounded cosmetic nudge (not a data change) — labels/
  tooltips still show the event's true year. Doesn't add a cluster-count badge (that's a bigger
  follow-up if the nudge turns out insufficient at very dense clusters), but markers can no
  longer render as one fully-merged, unclickable blob.

Verified live: at 290% zoom the axis showed 100-year ticks instead of the fixed 500-year set;
in Landmark mode, two previously-merged Greece markers (508 BCE "Cleisthenes Founds Athenian
Democracy" and 480 BCE "The Battle of Salamis") are now visibly separated and independently
clickable, each opening its own correct event in the detail panel.

### 4. No orientation cue when a lane's events are off-screen
Status: **✅ Fixed (2026-08-03)** · Severity: **Medium** · Priority: **P2** · Effort: **S–M**

Scrolling vertically to a later-starting topic (e.g. Khmer, Mongol, Aztec — all 600–1500 CE)
while horizontally parked in the Bronze Age rendered a completely blank row: no line, no dot,
no hint at all. It read as broken/missing data rather than "scroll right." Horizontal (time)
and vertical (topic) scroll are fully independent with no minimap/overview, so it was easy to
get lost.

First pass added a small "622 CE →" / "← 1572 CE" chip pinned to the edge of the viewport
pointing toward the off-screen data (CSS `position: sticky` + a `scroll`-driven JS check of
each lane's date range against the current viewport). User feedback: the pill styling (bordered,
backgrounded chip) looked like a floating UI control rather than part of the timeline.

Replaced with a much simpler design per follow-up direction from the user: every lane now
renders a permanent, faint 1px gray "rail" (`.lane-rail` in `timeline.css`) spanning the lane's
*entire* domain width, sitting behind the topic's actual colored `.lane-line`. Where the colored
line exists it fully covers the rail (same vertical center, thicker); where it doesn't, the rail
alone signals "this lane continues, you're just not on its dated section yet" without any text,
arrows, or dates. This needed no scroll-position tracking at all — removed the entire
`updateBoundaryHints()` function, its `scroll`/`resize` listeners, and the sticky-hint markup
added in the first pass.

Verified live: scrolled to Islamic Caliphates/Khmer/Mongol/Mali/Aztec/Inca rows (622–1572 CE)
while horizontally parked in the Bronze Age — every row shows a continuous thin gray line
instead of empty space. Confirmed the rail is fully hidden under the brighter colored line
wherever a topic's actual dated line is on-screen (no visible seam).

### 2. Two disconnected "browse" mechanisms for one concept
Status: **✅ Fixed (2026-08-03)** · Severity: **Medium** · Priority: **P3** · Effort: **L**

The hamburger-triggered nav drawer (top left) and the "Civilizations 16/16" checklist dropdown
(top right) were both, conceptually, "what topics am I looking at" — but sat on opposite
corners with different visual languages (drawer vs. dropdown, icon vs. text pill). Nothing
suggested a second, different filtering mechanism existed on the other side of the header.

Went with the merge option (option 1 from the two directions discussed): the top-right pill and
its dropdown are gone entirely (`timeline.html`). The nav drawer is now the single place to
browse — each category renders as a row (`renderNavList()` in `timeline.js`), and the *current*
category's row expands in place to nest its topic checklist (Select all / Clear + per-topic
checkboxes with color swatches) directly underneath, indented with a brass rail to show
containment (`.cat-row` / `.cat-body` in `timeline.css`). The row is a toggle (click to
collapse/expand), defaulting open. Other categories stay as plain links for now — switching
category is a full page navigation today, so there's no topic list to nest under them yet — but
they render dimmed alongside the expanded one, so the hierarchy (category → topics within it)
is visible even with only one category seeded.

Implementation notes:
- `topicFilterList` / `topicFilterCountEl` are no longer static `getElementById` lookups (that
  markup doesn't exist anymore) — they're assigned when `renderNavList()` builds the current
  category's nested checklist, since that's the only place it now lives.
- Removed the dropdown-specific logic that's no longer needed with nothing to click outside of:
  `openTopicFilter`/`closeTopicFilter`, the document-level click-outside and Escape handlers, and
  `.topic-filter-toggle`/`.topic-filter-panel` CSS.
- As a side effect, this also resolves item 7 below — the category name in the drawer always
  comes from the live `/categories` response (`cat.label`), so there's no separate hardcoded
  "Topics" fallback label left to go stale.
- Caught during review (not in the original finding): the current category's checklist only
  auto-expands when it's the *sole* category (`categories.length === 1`, true today). With a
  second category seeded, auto-expanding a 16-item checklist would push that category's row off
  the bottom of the drawer with no hint it's there — the opposite of what this fix is for. Once
  there's more than one category, every row starts collapsed so the full category list is
  scannable first; clicking a row still expands its checklist in place.

Verified live: opening "Browse" shows "Civilizations 16/16" already expanded with all 16 topics
listed (today's sole-category case); unchecking "Indus Valley" updates the count to 15/16 and
immediately removes that lane from the timeline behind the drawer; re-checking and collapsing the
category row via its chevron both work; no console errors on load or interaction. Simulated a
second category in the live DOM (real CSS, no code changes) to confirm the collapsed-by-default
path: with "Civilizations" collapsed, a "Sports" row rendered immediately below it, fully visible
instead of scrolled out of view.

### 7. "Civilizations" label may go stale as the app generalizes beyond civilizations
Status: **✅ Fixed (2026-08-03, as a side effect of #2)** · Severity: **Low** · Priority: **P4** · Effort: **S**

The standalone topic-filter button with its "Topics" fallback text no longer exists — see #2.
The category name shown in the drawer is always the live label from `/categories`, so there's
nothing left to misrepresent non-civilization data once a second category ships.

### 5. Competing filter controls read as one continuous control
Status: **✅ Fixed (2026-08-03, as a side effect of #2)** · Severity: **Low** · Priority: **P3** · Effort: **S**

"Civilizations 16/16" (topic filter) used to sit directly beside "Landmark events / All events"
(significance filter) with no visual grouping or label distinguishing the two filter axes — at a
glance they read as one control.

With #2's fix, the topic filter no longer lives in the topbar at all — it moved into the nav
drawer, nested under its category. The topbar now only has the significance toggle and the
already-labeled "Scale" zoom control, so there are no two unlabeled filter axes sitting next to
each other to confuse anymore; the premise of this item no longer applies to the current layout.

### 6. Detail panel is fixed-width, not proportional, with no overflow cue
Status: **✅ Fixed (2026-08-03)** · Severity: **Low** · Priority: **P3** · Effort: **S**

The detail panel was a fixed pixel width (348px) on the right, so on a ~1024px window it ate
roughly 40% of the screen regardless of how wide the window actually was. It requires internal
scrolling to reach the description/map, but nothing above the fold hinted that there was more
content below (no fade gradient, no scroll indicator).

Fix applied:

- Width changed from a flat `348px` to `clamp(300px, 34vw, 400px)` (`timeline.css`) — scales
  with the window between a 300px readable floor and a 400px cap, so it no longer sits at a
  disproportionate fraction of mid-size (~900–1200px) windows while also not sprawling on very
  wide ones. Below the existing 900px breakpoint the panel already switches to the mobile bottom
  sheet, unaffected by this change.
- Added `.detail-scroll-fade`, a `pointer-events: none` gradient pinned to the bottom of
  `#detailPanel` (`timeline.html`/`timeline.css`). Placed as a direct child of the scrolling
  panel itself (not inside `.detail-content`), so it's positioned relative to the panel's padding
  box and stays fixed at the visible bottom edge rather than scrolling away with the content —
  the standard technique for an overlay that shouldn't move as its scroll container scrolls.
- `updateDetailScrollFade()` in `timeline.js` is what's shown *before* the reader has scrolled:
  it toggles `.visible` based purely on whether the content overflows at all
  (`scrollHeight > clientHeight`), wired to `window`'s `resize` event and the detail image's
  `load` event (since an unloaded image's unknown intrinsic size can under-report `scrollHeight`
  until it loads). A separate listener on the panel's own `scroll` event dismisses the fade for
  good — sets `detailScrollFadeDismissed = true` and hides it — the instant the reader scrolls at
  all, regardless of position; it does not come back even if they scroll back to the top.
  `selectEvent()` resets both `panel.scrollTop = 0` and the dismissal flag when opening a new
  event, so a previous event's scroll/dismiss state can't leak into the next one.

This final behavior (a one-time "there's more below" nudge, not a running scroll-shadow) took two
follow-up rounds after the first pass shipped, both from live user testing:

- **Round 1:** the first version cleared the fade only once `scrollTop` hit its literal maximum
  (`remaining > 4`). Real wheel/trackpad scrolling doesn't reliably land on that exact last pixel,
  so the fade — and the last line of text under it — could look permanently stuck even once the
  reader was, for all practical purposes, at the bottom. Tried widening the threshold to clear
  once within the fade's own height (44px) of the bottom instead of the exact last pixel.
- **Round 2:** that still wasn't right — user feedback was that *any* persistent scroll-shadow
  was the wrong model here: while scrolled partway through (not yet near the bottom), the fade
  sat over whatever line currently rendered at the panel's bottom edge, which read as "the fade
  won't go away" rather than as a helpful cue, regardless of exactly where the clear-threshold
  was set. Replaced the running scroll-shadow with the dismiss-on-first-scroll behavior described
  above — discarded the distance-based threshold (`DETAIL_SCROLL_FADE_PX`) entirely.
- **Round 3:** with the dismiss behavior settled, follow-up feedback was that the fade itself
  read as too weak to notice in some cases. Root cause: a plain two-stop `linear-gradient`
  reaches only ~50% opacity at its own midpoint, so across most of the (then-44px) band it barely
  tinted the content under it — especially over the map or a photo, which don't have the same
  contrast against `var(--surface)` that dark text does. Reworked `.detail-scroll-fade`'s
  background into two layered gradients that front-load the ramp (a soft dark tint reaching full
  strength by 55% down the band, a `var(--surface)` wash by 65%, both solid for the remainder)
  and increased the band from 44px to 60px, so it reads as a clear mask rather than a faint tint
  regardless of what's underneath.

Verified live: opening a short event (no overflow) shows no fade. Opening a long event (forced
overflow by constraining the panel's height) shows the fade on the pristine state; scrolling just
20px — nowhere near the bottom — dismisses it immediately, and it stays dismissed after scrolling
back to `scrollTop = 0`. Selecting a different event while the panel is already open (fade
previously dismissed) correctly re-shows the fade for the new event's content. Re-verified after
Round 3's contrast fix on the same event ("Cuneiform Emerges at Uruk") in both light and dark
theme (`data-theme="dark"`) — the last line of body text now visibly washes out to near-invisible
by the bottom of the band, a clear improvement over the original barely-perceptible lightening.
No console errors.

## What's working well (no action needed)

- Detail panel content composition (image, eyebrow, title, body, historical/modern map inset)
  is well composed with good hierarchy.
- "Landmark events" vs "All events" toggle is immediately understandable.
- Topic checklist (Select all / Clear + per-item toggles) is a solid pattern that scales fine
  to 16 items nested in the drawer.
- Typographic identity (Marcellus display / Work Sans UI) and the brass/ink color system read
  as coherent and considered, not generic.
