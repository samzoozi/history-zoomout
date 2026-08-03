---
name: wikipedia-research
description: >
  Research a topic (civilization, country, sport, or any future category) from
  Wikipedia and produce a reviewed seed-data JSON file plus a tracking-doc entry,
  in this project's Topic/Event/Location shape. Use when asked to pull, source,
  research, or extract Wikipedia data for a topic -- e.g. "get data for Egypt",
  "source the Rome topic from Wikipedia", "do the same thing you did for Persia
  but for basketball". Does NOT merge into the live seed file or database --
  that's always a separate, explicit step.
---

# Wikipedia topic research

Turns a topic name into a reviewed `data/wikipedia-data/<topic-id>.json` file, built
the same way the Persia pilot was: real Wikipedia sources, verified facts, licensed
images, geocoded event locations, and a paper trail. The JSON output lands in `data/`
(gitignored -- fetched/generated, not committed) and the tracking-doc entry in `docs/`
(committed -- it's the durable, human-curated record). Neither is the live seed file
(`backend/src/history_zoomout/db/seed_data/civilizations.json`) or the database --
merging is a separate step the user asks for explicitly.

## Before starting

Confirm with the user, if not already given:
- **Topic id, name, category, and date range** (start/end year). For an existing
  civilization already in `civilizations.json`, use its existing `id`/`colorIndex` so a
  future merge is a drop-in replacement rather than a rename.
- **Scope for this pass** -- one topic, or several? (Bias toward one at a time; each
  topic pilot is worth reviewing before repeating the process.)

Read `backend/src/history_zoomout/db/models.py` and `schemas.py` first if it's been a
while -- the field list below is a snapshot and the schema can evolve. Field names in
JSON are camelCase (matching what `seed.py`'s `.get()` calls expect); model attributes
are snake_case.

## Output shape

Topic-level fields: `id`, `name`, `colorIndex`, `start`, `end`, `summary`, `sourceUrl`,
`imageUrl`, `imageAttribution`, `wikidataId`, `events[]`.

Each event: `year`, `sig` (`"major"` | `"minor"`), `title`, `body`, `sourceUrl`,
`imageUrl`, `imageAttribution`, `wikidataId`, and optionally `location`.

Each `location`: `historicalName` (the place as known at the time, e.g. "Carrhae"),
`city`/`country` (modern equivalents, e.g. "Harran", "Turkey" -- these often differ from
the historical name), `latitude`, `longitude`. Omit the whole `location` object if
there's no natural single place for the event (e.g. a broad campaign or long institutional
change); set individual fields `null` rather than guessing when a coordinate genuinely
isn't findable but the city/country still is.

## Process

### 1. Map out sub-periods before picking events

Check whether the topic actually spans multiple distinct eras or successor states (this
is what the Persia pilot got wrong on the first pass -- picked 5 events, only realized
after user review that it skipped the entire ~470-year Parthian Empire and never
mentioned the Achaemenid Empire's own fall). List the major sub-periods first, *then*
pick events so every one is represented -- don't let event selection cluster in whichever
era has the most-famous Wikipedia articles.

### 2. Topic-level source

Prefer the Wikipedia article whose scope actually matches the topic's full date range,
not just its founding era -- e.g. "History of Iran" over "Achaemenid Empire" for a topic
spanning multiple Persian empires. If that broad article's lead image is generic/unrelated
(common for "History of X" articles), it's fine to source the image from a more visually
relevant sub-article instead and note the mismatch in the tracking doc.

Fetch:
```
WebFetch(
  url: "https://en.wikipedia.org/api/rest_v1/page/summary/<Title>",
  prompt: "Return verbatim from this JSON: title, description, extract,
           thumbnail.source, wikibase_item, content_urls.desktop.page"
)
```
`wikibase_item` -> `wikidataId`. `content_urls.desktop.page` -> `sourceUrl`.
`thumbnail.source` -> candidate `imageUrl` (get its attribution -- see step 4).
Write `summary` yourself from the extract plus whatever event-level research turns up;
don't just copy the extract verbatim (see Copyright below).

### 3. Pick and research events

Aim for one event per major sub-period turning point (founding, a defining
war/battle/crisis, and the fall/end, at minimum) rather than a fixed count. For each:

- Fetch the REST summary (same call as above) for the event's own article.
- If the summary's `extract` doesn't have the specific fact you need (exact year,
  who/what/where), fetch the full article and ask a targeted question:
  ```
  WebFetch(url: "https://en.wikipedia.org/wiki/<Title>", prompt: "<specific question>")
  ```
- Cross-check dates/facts against any existing seed data for this topic. Don't silently
  overwrite a wrong fact -- note the correction and why in the tracking doc (see the
  Persia entry in `docs/wikipedia-sources.md` for the format: it caught a date/fact
  conflation between two separate events that had been merged into one).
- Write `body` from scratch based on the verified facts, 1-2 sentences, present/active
  tense, matching the existing dataset's tone. Never copy Wikipedia's prose (see
  Copyright below).
- Assign `sig` by judgment -- Wikipedia doesn't rank event significance. Use `"major"`
  for foundings, falls, and famous decisive turning points; `"minor"` for supporting
  detail. Don't feel obliged to harmonize the rating of events you're not touching.
- Order the final list chronologically ascending (negative years = BC).

### 4. Images and attribution

Get a thumbnail either from the REST summary (`thumbnail.source`) or, if that's missing
or generic, from the article's embedded images:
```
WebFetch(
  url: "https://en.wikipedia.org/w/api.php?action=query&titles=<Title>&prop=images&imlimit=25&format=json",
  prompt: "List all the file titles from the images array"
)
```
Pick something illustrative (a photo of the actual place/artifact, a period-appropriate
map, a relevant painting) over the first result in the list.

**Every image needs attribution before it's usable -- this is not optional.** Wikimedia
Commons images are openly licensed but almost all require attribution under their
license terms; showing one without credit is a license violation, not a style choice.
Fetch it with:
```
WebFetch(
  url: "https://en.wikipedia.org/w/api.php?action=query&titles=File:<Filename>&prop=imageinfo&iiprop=extmetadata&format=json",
  prompt: "From this JSON, return extmetadata fields: Artist, LicenseShortName, Credit
           (plain text, strip HTML tags)."
)
```
Build `imageAttribution` as `"<Photo/Painting/Map> by <Artist>, <License>, via Wikimedia
Commons"`. If an image has no usable artist/license info, don't use it.

Don't hotlink raw Commons file pages or scrape them directly -- the URLs these two APIs
return (`thumbnail.source` and the `imageinfo` result) are Wikimedia's own
externally-facing endpoints, built for exactly this kind of use.

### 5. Locations

For each event with a natural single place, get coordinates:
```
WebFetch(
  url: "https://en.wikipedia.org/w/api.php?action=query&titles=<Title1>|<Title2>|...&prop=coordinates&format=json",
  prompt: "For each page, return the title and its coordinates (lat, lon) if present."
)
```
Batch multiple titles in one call (pipe-separated) rather than one fetch per place.

If the specific historical-site article has no coordinates, try its nearest modern-day
named equivalent (e.g. "Battle of Carrhae" has none, but "Harran" -- the modern town on
the same site -- does). When even that comes up empty, leave `latitude`/`longitude`
`null` but still fill in `city`/`country` if those are reasonably well established from
the article text -- don't null out a whole location just because the coordinate lookup
failed.

`historicalName` is the name as used *at the time* (may differ substantially from the
modern name -- Carrhae/Harran, Edessa/Şanlıurfa, Merv/Mary are all the same kind of
same-place-different-name situation). `city`/`country` are today's.

### 6. Write the output

- `data/wikipedia-data/<topic-id>.json` -- the full topic object, in the shape above.
- A new section in `docs/wikipedia-sources.md`, following the existing Persia section's
  structure: status line, topic-level source with reasoning if non-obvious, an
  event-source table (event / year / article / Wikidata / image credit), a locations
  table, and a corrections/decisions section explaining any judgment calls or fixes to
  existing data.

### 7. Validate before calling it done

1. `python3 -c "import json; json.load(open(...))"` -- well-formed, and check years are
   ascending.
2. Dry-run construct the real ORM objects (`Topic`, `Event`, `Location` from
   `history_zoomout.db.models`) from the parsed JSON, without touching the database --
   catches key-name mismatches between the JSON and what `seed.py`/the models actually
   expect. This has caught real bugs before (a missing `selectinload` on `Event.location`
   caused a 500 on the live API that the migration test alone didn't catch) -- if a live
   dev server is running, it's worth an actual API smoke-test too, not just the dry run.

## Copyright

Wikipedia's article text is CC BY-SA -- reproducing it verbatim requires attribution and
share-alike, which a seed-data field isn't set up to carry. Facts themselves aren't
copyrightable, so **always paraphrase into original sentences**; never copy-paste
extract/article text into `summary` or `body`.

## Scope discipline

This skill produces files under `data/` and `docs/` only. It does not:
- Edit `civilizations.json` or run `history-zoomout-seed`
- Change the database schema (if a topic needs a field that doesn't exist yet -- e.g.
  the `location`/image/citation fields all started as a separate ask before any topic
  research happened -- that's a schema change to raise with the user first, not something
  to add unilaterally mid-research)
- Expand scope to additional topics beyond what was asked, or add extra events beyond
  what's needed for reasonable sub-period coverage, without checking in first
