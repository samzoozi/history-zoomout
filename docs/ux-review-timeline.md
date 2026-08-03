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
| 2 | Two disconnected browse mechanisms | Medium | P3 | L | Open |
| 3 | Zoom doesn't add precision; markers overlap | Medium | P2 | M | ✅ Fixed |
| 4 | No off-screen orientation cue | Medium | P2 | S–M | ✅ Fixed |
| 5 | Competing filter controls read as one | Low | P3 | S | Open |
| 6 | Detail panel fixed-width, no overflow cue | Low | P3 | S | Open |
| 7 | "Civilizations" label may go stale | Low | P4 | S | Open |

## Fixed items

### 1. No responsive design — mobile layout is broken
Status: **✅ Fixed (2026-08-03)** · Severity: **High** · Priority: **P1** · Effort: **M**

`timeline.css` had a single `@media` query (dark mode) and zero width-based breakpoints.
At a 390px viewport:

- `.nav-toggle` is `position: fixed; top: 30px; left: 8px` (`timeline.css:245-248`), a 34px box
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

## Open items

### 2. Two disconnected "browse" mechanisms for one concept
Status: **Open** · Severity: **Medium** · Priority: **P3** · Effort: **L**

The hamburger-triggered nav drawer (top left) and the "Civilizations 16/16" checklist dropdown
(top right) are both, conceptually, "what topics am I looking at" — but they sit on opposite
corners with different visual languages (drawer vs. dropdown, icon vs. text pill). Nothing
suggests a second, different filtering mechanism exists on the other side of the header.

Fix direction: either merge them (drawer becomes "browse categories → select topics within
category") or visually group them so the relationship is obvious. Marked L because that's a
product/IA decision to settle before any code changes, not just a CSS tweak.

### 5. Competing filter controls read as one continuous control
Status: **Open** · Severity: **Low** · Priority: **P3** · Effort: **S**

"Civilizations 16/16" (topic filter) sits directly beside "Landmark events / All events"
(significance filter) with no visual grouping or label distinguishing the two filter axes —
at a glance they read as one control.

Fix direction: add a subtle label or divider so the two axes are legible as separate concerns.

### 6. Detail panel is fixed-width, not proportional, with no overflow cue
Status: **Open** · Severity: **Low** · Priority: **P3** · Effort: **S**

The detail panel is a fixed pixel width on the right, so on a ~1024px window it eats roughly
40% of the screen. It requires internal scrolling to reach the description/map, but nothing
above the fold hints that there's more content below (no fade gradient, no scroll indicator).

Fix direction: add a bottom fade/scroll-shadow when content overflows; consider a
percentage-based max-width so it doesn't dominate mid-size windows.

### 7. "Civilizations" label may go stale as the app generalizes beyond civilizations
Status: **Open** · Severity: **Low** · Priority: **P4** · Effort: **S**

Recent commits generalized the app beyond civilizations (categories, generic topics). The
topic-filter button's fallback text is "Topics" (`timeline.html:52`) but gets overwritten at
runtime with the active category's name — today that happens to be "Civilizations" since it's
the only seeded category. Worth a deliberate check once a second category (e.g. a sports
dataset) exists, so the button doesn't misrepresent non-civilization data.

## What's working well (no action needed)

- Detail panel content composition (image, eyebrow, title, body, historical/modern map inset)
  is well composed with good hierarchy.
- "Landmark events" vs "All events" toggle is immediately understandable.
- Topic filter's checkbox list (Select all / Clear + per-item toggles) is a solid pattern that
  scales fine to 16 items with internal scroll.
- Typographic identity (Marcellus display / Work Sans UI) and the brass/ink color system read
  as coherent and considered, not generic.
