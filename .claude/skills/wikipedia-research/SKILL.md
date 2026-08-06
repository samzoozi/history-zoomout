---
name: wikipedia-research
description: >
  Research a topic (civilization, country, sport, or any future category) from
  Wikipedia and produce a reviewed seed-data JSON file plus a tracking-doc entry,
  in this project's Topic/Event/Location shape. Also handles enriching an
  already-researched topic with more events on an under-covered theme (e.g. "find
  more art and governance events for Persia"). Use when asked to pull, source,
  research, or extract Wikipedia data for a topic -- e.g. "get data for Egypt",
  "source the Rome topic from Wikipedia", "do the same thing you did for Persia
  but for basketball", "add more science-tagged events to Rome". Does NOT merge
  into the live seed file or database -- that's always a separate, explicit step.
---

# Wikipedia topic research

Turns a topic name into a reviewed `data/wikipedia-data/<category>/<slug>.json` file,
built the same way the Persia pilot was: real Wikipedia sources, verified facts, licensed
images, geocoded event locations, and a paper trail. The JSON output lands in `data/`
(gitignored -- fetched/generated, not committed) and the tracking-doc entry in
`docs/wikipedia-sources-<category>s.md` (committed -- it's the durable, human-curated
record). Neither is the live seed file (`backend/src/history_zoomout/db/seed_data/`) or
the database -- merging is a separate step the user asks for explicitly.

## Before starting

If the user names specific tags to focus on for a topic that's already been researched
(e.g. "find more art and governance events for Persia", "the science tag is thin for
Rome, add some") -- that's **Tag-focused enrichment mode** below, not a full
from-scratch pass. Skip the sub-period mapping and topic-level source steps in
Process; jump straight to that section instead.

**Always ask the user which category this topic belongs to** (`civilization`, `country`,
`sport`, or any other) if it isn't already obvious/stated -- the category determines
where the file goes (`data/wikipedia-data/<category>/`, `docs/wikipedia-sources-<category>s.md`)
and, for anything other than `civilization`, how the topic `id` must be built (see below).
Don't guess this from the topic name alone: e.g. "Japan" could be the existing
`civilization` topic or a new `country` topic, and those need different ids and land in
different files.

Confirm with the user, if not already given:
- **Topic id, name, category, and date range** (start/end year). For an existing
  civilization already in `civilizations.json`, use its existing `id`/`colorIndex` so a
  future merge is a drop-in replacement rather than a rename.
- **Scope for this pass** -- one topic, or several? (Bias toward one at a time; each
  topic pilot is worth reviewing before repeating the process.)

### Topic id uniqueness across categories

`Topic.id` is a plain string primary key in `backend/src/history_zoomout/db/models.py`,
*not* scoped by category -- two topics in different categories cannot share an id without
colliding at merge/seed time. The existing `civilization` category already has bare ids
like `japan`, `rome`, `persia`. To avoid collisions:
- `civilization` topics keep their existing bare ids (no change, for backward
  compatibility with what's already merged).
- Every other category prefixes its topic ids with `<category>-`, e.g. `country-france`,
  `country-japan`, `sport-basketball`. Pick this id up front when confirming topic
  parameters with the user, and use the prefixed form as the JSON's `id` field directly --
  don't leave it bare and expect the merge step to fix it later.

Read `backend/src/history_zoomout/db/models.py` and `schemas.py` first if it's been a
while -- the field list below is a snapshot and the schema can evolve. Field names in
JSON are camelCase (matching what `seed.py`'s `.get()` calls expect); model attributes
are snake_case.

## Output shape

Topic-level fields: `id`, `name`, `colorIndex`, `start`, `end`, `summary`, `sourceUrl`,
`imageUrl`, `imageAttribution`, `imageDescription`, `wikidataId`, `events[]`.

Each event: `year`, `sig` (`"major"` | `"minor"`), `title`, `body`, `tags` (string
array -- see "Gather the existing tag vocabulary" below), `sourceUrl`, `imageUrl`,
`imageAttribution`, `imageDescription`, `wikidataId`, and optionally `location`.

Each `location`: `historicalName` (the place as known at the time, e.g. "Carrhae"),
`city`/`country` (modern equivalents, e.g. "Harran", "Turkey" -- these often differ from
the historical name), `latitude`, `longitude`. Omit the whole `location` object if
there's no natural single place for the event (e.g. a broad campaign or long institutional
change); set individual fields `null` rather than guessing when a coordinate genuinely
isn't findable but the city/country still is.

## Research goal vs. tags

The research target is always **events about the topic that are genuinely interesting
and significant to readers** -- the kind of thing a knowledgeable, curious person would
want to know about that topic. Tags are a filtering/organizational layer applied to
whichever events clear that bar; they exist so readers can slice an already-good dataset
by theme, not to define what counts as worth researching. This holds in both the
full from-scratch Process below and Tag-focused enrichment mode -- when a pass is scoped
to a theme (e.g. "find more art events for Persia"), the ask is still "find the
genuinely interesting art-related events for this topic," not "produce N events that
can be labeled `art`." If a theme turns up nothing that clears the significance bar,
that's a legitimate outcome -- don't manufacture a marginal event just to give a tag
another entry.

## Process

### 1. Map out sub-periods before picking events

Check whether the topic actually spans multiple distinct eras or successor states (this
is what the Persia pilot got wrong on the first pass -- picked 5 events, only realized
after user review that it skipped the entire ~470-year Parthian Empire and never
mentioned the Achaemenid Empire's own fall). List the major sub-periods first, *then*
pick events so every one is represented -- don't let event selection cluster in whichever
era has the most-famous Wikipedia articles.

For each sub-period, also note what it's known for beyond politics/war -- a defining
religious development, a major building program, a scientific or artistic achievement --
so step 4 has real leads to chase instead of defaulting to whichever battle Wikipedia
covers most thoroughly.

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
`thumbnail.source` -> candidate `imageUrl` (get its attribution -- see step 5).
Write `summary` yourself from the extract plus whatever event-level research turns up;
don't just copy the extract verbatim (see Copyright below).

### 3. Gather the existing tag vocabulary

Before assigning any tags, read `docs/wikipedia-tags.md` -- the canonical list of tags
in use across every category, with a one-line description of what each is for. Tags are
open/topic-defined, not a fixed enum in the schema (the frontend just lists whatever
distinct values show up in the data, via `buildTagFilter` in `frontend/timeline.js`), but
this file is the source of truth for research purposes so a pass doesn't need to scan
every JSON under `data/` and `backend/src/history_zoomout/db/seed_data/` just to find
out what already exists.

Reuse an existing tag whenever an event genuinely fits one. Only introduce a new tag if
none of the existing ones fit -- if you do, follow the "Adding a new tag" steps in
`docs/wikipedia-tags.md` (add it to that file's table, and note the addition and why in
the topic's tracking-doc section) so it's a visible decision, not a silent vocabulary
drift.

### 4. Pick and research events

Every sub-period needs its political turning points (founding, a defining war/crisis,
the fall/end) -- but that triad is a floor, not the target. Once it's covered, keep
going: pull in the religious, artistic, scientific, architectural, and governance
history that a knowledgeable reader would expect to see, for every sub-period, not just
whichever one happens to be richest on Wikipedia. There is no fixed count and no cap --
a sub-period that produced ten genuinely significant events should end up with ten
events, not be trimmed to fit some notion of "already represented." Having a single
event for a theme (one religion event, one architecture event) is a sign a period is
under-covered, not evidence it's done -- don't stop pulling on a theme just because it
already has one entry. The only real ceiling is that each event has to be a genuinely
significant happening, independently verifiable on Wikipedia -- not padding for its own
sake. For each:

- Fetch the REST summary (same call as above) for the event's own article.
- If the summary's `extract` doesn't have the specific fact you need (exact year,
  who/what/where), fetch the full article and ask a targeted question:
  ```
  WebFetch(url: "https://en.wikipedia.org/wiki/<Title>", prompt: "<specific question>")
  ```
- Cross-check dates/facts against any existing seed data for this topic. Don't silently
  overwrite a wrong fact -- note the correction and why in the tracking doc (see the
  Persia entry in `docs/wikipedia-sources-civilizations.md` for the format: it caught a
  date/fact conflation between two separate events that had been merged into one).
- Write `body` from scratch based on the verified facts, 1-2 sentences, present/active
  tense, matching the existing dataset's tone. Never copy Wikipedia's prose (see
  Copyright below).
- Assign `sig` by judgment -- Wikipedia doesn't rank event significance. Use `"major"`
  for foundings, falls, and famous decisive turning points; `"minor"` for supporting
  detail. Don't feel obliged to harmonize the rating of events you're not touching.
- Assign `tags` from the vocabulary gathered in step 3, based on what the event actually
  is (a battle, a founding, a religious event, an artistic/scientific/governance
  milestone, etc.) -- same by-judgment spirit as `sig`. An event can carry more than one
  tag (e.g. Cyrus founding the Achaemenid Empire is both `founding` and `battle`). Tags
  are always applied *after* an event is picked, describing what it already is -- never
  the other way around. This holds in Tag-focused enrichment mode too (below): even
  there, the research target is interesting events on a theme, and tags are how those
  events get labeled once found.
- Order the final list chronologically ascending (negative years = BC).

### 5. Images and attribution

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
  prompt: "From this JSON, return extmetadata fields: Artist, LicenseShortName, Credit,
           ImageDescription (plain text, strip HTML tags)."
)
```
Build `imageAttribution` as `"<Photo/Painting/Map> by <Artist>, <License>, via Wikimedia
Commons"`. If an image has no usable artist/license info, don't use it.

`ImageDescription` is the uploader's own caption of what the image actually depicts (e.g.
"Capitoline she-wolf, a bronze figure showing Romulus and Remus") -- this is what a reader
sees under the image, distinct from the `imageAttribution` credit line. Not every file has
one. When present, don't copy it verbatim (same reasoning as the Copyright section below --
it's also uploader prose, often terse or awkwardly phrased); rewrite it as one short,
factual sentence identifying the subject, in the same plain tone as `body`. When absent,
leave `imageDescription` `null` rather than inventing a description from the image's
filename or your own guess at its contents.

Don't hotlink raw Commons file pages or scrape them directly -- the URLs these two APIs
return (`thumbnail.source` and the `imageinfo` result) are Wikimedia's own
externally-facing endpoints, built for exactly this kind of use.

### 6. Locations

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

### 7. Write the output

- `data/wikipedia-data/<category>/<slug>.json` -- the full topic object, in the shape
  above, in the subfolder matching this topic's category (create the subfolder if it's
  the first topic in a new category). `<slug>` is the id without its category prefix
  (e.g. `country-france` -> `data/wikipedia-data/country/france.json`) -- the folder
  already encodes the category, so the filename doesn't need to repeat it.
- A new section in `docs/wikipedia-sources-<category>s.md`, following the existing
  Persia section's structure (in `docs/wikipedia-sources-civilizations.md`): status
  line, topic-level source with reasoning if non-obvious, an event-source table (event /
  year / article / Wikidata / image credit), a locations table, and a
  corrections/decisions section explaining any judgment calls or fixes to existing data.
  If this is the first topic in a new category, create the file with the same intro
  boilerplate as the existing categories' files (what the category covers, where its
  JSON lives, the id-prefixing rule, a pointer to the sibling category files) before
  adding the topic's own section.

### 8. Validate before calling it done

1. `python3 -c "import json; json.load(open(...))"` -- well-formed, and check years are
   ascending.
2. Dry-run construct the real ORM objects (`Topic`, `Event`, `Location` from
   `history_zoomout.db.models`) from the parsed JSON, without touching the database --
   catches key-name mismatches between the JSON and what `seed.py`/the models actually
   expect. This has caught real bugs before (a missing `selectinload` on `Event.location`
   caused a 500 on the live API that the migration test alone didn't catch) -- if a live
   dev server is running, it's worth an actual API smoke-test too, not just the dry run.

## Tag-focused enrichment mode

Use this instead of the standard Process flow when the ask is to deepen an
already-researched topic's coverage of one or more themes (e.g. "Persia is all battles,
find more art/governance/science events") rather than to research a topic from scratch.
The theme narrows *where* to look, same as it does in full research -- it is not a quota
to fill. The research target is still genuinely interesting, significant events; tags
are just how those events get labeled afterward so readers can filter by them (see
"Research goal vs. tags" above). If a theme is genuinely thin for a topic -- there just
isn't much art-related material for a given sub-period -- add what's real and stop
there rather than stretching marginal events to hit a number.

1. **Load the existing topic and tally its tags.** Read
   `data/wikipedia-data/<category>/<slug>.json` if it exists, otherwise pull the topic's
   current events from the merged seed data
   (`backend/src/history_zoomout/db/seed_data/`). Count events per tag so the gap is
   concrete, not a guess.
2. **Confirm scope** if it isn't already precise: which theme(s), and roughly how many
   events to add. Don't assume "fill every under-represented tag" without checking --
   the user may want just one theme.
3. **Search by theme, across the full date range** -- not just turning points. For
   `art`/`architecture`: monuments, artistic works, building programs. For `science`:
   scholarly or technical achievements. For `governance`: administrative, legal, or
   institutional reforms. For `rebellion`: revolts and succession crises. Good starting
   points: the "History"/"Culture"/"Legacy" sections of the topic's broad article, and
   the sub-period articles already identified during the topic's original research.
   `"minor"` `sig` is expected and fine here -- this mode exists specifically to surface
   texture a turning-points-only pass would skip. Every event found still has to clear
   the same bar as full research: a genuinely significant happening a reader would want
   to know about, not a minor fact that merely happens to fit the theme.
4. **Research and write each new event** the same way as Process step 4 -- verify facts,
   paraphrase (never copy Wikipedia's prose, see Copyright below), and assign `sig` and
   the full set of tags that fit, not just the one being targeted -- then steps 5 and 6
   for images/attribution and locations.
5. **Merge, don't overwrite.** Append the new events to the existing `events[]`, re-sort
   chronologically ascending, and check for duplicates against what's already there
   (same year + title, or same `wikidataId`) before adding.
6. **Update the tracking doc** with a new dated subsection under the topic's existing
   entry (not a full rewrite) -- which tag(s) were targeted, and an event-source table
   for just the additions, same format as a full pass.
7. **Validate** the same way as Process step 8 (well-formed JSON, ascending years, ORM
   dry run).

## Copyright

Wikipedia's article text is CC BY-SA -- reproducing it verbatim requires attribution and
share-alike, which a seed-data field isn't set up to carry. Facts themselves aren't
copyrightable, so **always paraphrase into original sentences**; never copy-paste
extract/article text into `summary` or `body`.

## Scope discipline

This skill produces files under `data/` and `docs/` only. It does not:
- Edit any file under `backend/src/history_zoomout/db/seed_data/` or run `history-zoomout-seed`
- Change the database schema (if a topic needs a field that doesn't exist yet -- e.g.
  the `location`/image/citation fields all started as a separate ask before any topic
  research happened -- that's a schema change to raise with the user first, not something
  to add unilaterally mid-research)
- Expand scope to additional topics beyond what was asked -- e.g. researching a
  neighboring civilization mid-pass because it came up -- without checking in first.
  This doesn't limit event count *within* the topic actually being researched: per
  Process step 4, pull in every genuinely significant event for that topic, not a
  trimmed subset
