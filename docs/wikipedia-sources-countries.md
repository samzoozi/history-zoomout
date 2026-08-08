# Wikipedia source tracking — Countries

Log of what's been pulled from Wikipedia/Wikidata/Wikimedia Commons for seed data, so we
know what's already sourced and don't re-scrape blind. One section per topic.

This file covers the `country` category only. The `civilization` category (Persia, Rome,
Japan, etc.) is tracked separately in `wikipedia-sources-civilizations.md` — topic ids and
topic names can otherwise collide across categories (e.g. a civilization "Japan" and a
country "Japan"), so each category gets its own file and its own subfolder under
`data/wikipedia-data/`.

`country` topics are scoped differently from `civilization` topics: civilization topics run
founding → defining eras → fall/conquest/dissolution (e.g. Rome, Persia, the Ottomans).
Countries run origin of the modern nation-state → defining transformations → straight
through to the present day, with no "fall" event, since the polity is still here today.

To keep the `topics.id` primary key globally unique across categories (it's a plain string
PK in `backend/src/history_zoomout/db/models.py`, not scoped by category), every topic `id`
in this category is prefixed `country-` (e.g. `country-france`). Existing `civilization`
topics keep their original unprefixed ids for backward compatibility — only new categories
need the prefix.

Sourced JSON files live in `data/wikipedia-data/country/` — reviewed there before being
merged into the live seed data (a new `data/seed_data/country/` subfolder, one file per
topic, matching the layout `data/seed_data/civilization/` already uses — not created yet
as of this writing).

Body text is written from scratch based on the facts in these articles, not copied from
Wikipedia's prose (Wikipedia's text is CC BY-SA and requires attribution/share-alike if
reproduced; facts themselves aren't copyrightable, so we paraphrase).

## France (topic id: `country-france`) — pulled 2026-08-03

Status: **new topic, new category** — file written to `data/wikipedia-data/country/france.json`
only; merging into the live seed (as a new `country` category alongside the existing
`civilization` one) is a separate step.

France is the first topic in the new `country` category, which is scoped differently from
the `civilization` entries tracked in `wikipedia-sources-civilizations.md`. Civilization
topics run founding → defining eras → fall/conquest/dissolution (e.g. Rome, Persia, the
Ottomans). Countries in this new category instead run origin of the modern nation-state →
defining transformations → straight through to the present day, with no "fall" event,
because the polity is still here. `colorIndex: 1` was assigned freely since this is a
brand-new category with its own index space, not shared with `civilization`'s rotation.

The **start year, 843, was an explicit user decision** made after weighing three
candidates: 987 (Hugh Capet and the Capetian dynasty — the traditional "Kingdom of
France" starting point), 1789 (the Revolution — arguably where "modern France" as a
political idea begins), and 843 (the Treaty of Verdun, which first draws West Francia's
borders out of Charlemagne's empire). The user chose 843 as France's true origin point,
so Hugh Capet's coronation (987) appears as an early *event* within the timeline rather
than as the topic's start year. This is the same "runs to the present, no fall" shape as
the `civilization` category's Japan entry, with one deliberate difference: Japan's own
topic was scoped to stop at 1868 (the Meiji Restoration) by design, treating "pre-modern
Japan" as a bounded pilot. France has no such cutoff — the whole point of the `country`
category is that it runs all the way to the present (`end: 2026`), so no artificial
stopping point before the modern day was introduced here.

### Topic-level source

- **History of France** — https://en.wikipedia.org/wiki/History_of_France — Wikidata Q7778
  - The article's own lead thumbnail is an 18th-century map of French administrative
    districts — accurate but visually flat and not very recognizable. Used Eugène
    Delacroix's *Liberty Leading the People* (1830) instead, sourced from the article's
    embedded images — it's the single most widely recognized image standing in for
    France/the Republic as an idea, which fits a topic spanning 843–2026 better than any
    single period-specific map or flag would.

### Event-level sources

| Event | Year | Article | Wikidata | Image credit |
|---|---|---|---|---|
| Treaty of Verdun creates West Francia | 843 | [Treaty of Verdun](https://en.wikipedia.org/wiki/Treaty_of_Verdun) | Q134840 | Illustration, artist unknown, Public domain |
| Hugh Capet crowned king | 987 | [Hugh Capet](https://en.wikipedia.org/wiki/Hugh_Capet) | Q159575 | LeThéodorus (photo of seal), CC BY-SA 3.0 |
| Battle of Bouvines | 1214 | [Battle of Bouvines](https://en.wikipedia.org/wiki/Battle_of_Bouvines) | Q830626 | Horace Vernet (painting), Public domain |
| Hundred Years' War begins | 1337 | [Hundred Years' War](https://en.wikipedia.org/wiki/Hundred_Years%27_War) | Q12551 | Loyset Liédet (illustration), Public domain |
| Joan of Arc relieves the Siege of Orléans | 1429 | [Siege of Orléans (1428–1429)](https://en.wikipedia.org/wiki/Siege_of_Orl%C3%A9ans_(1428%E2%80%931429)) | Q392213 | Eugène Lenepveu (painting), Public domain |
| Battle of Castillon ends the Hundred Years' War | 1453 | [Battle of Castillon](https://en.wikipedia.org/wiki/Battle_of_Castillon) | Q932613 | Unknown, Public domain |
| Edict of Nantes | 1598 | [Edict of Nantes](https://en.wikipedia.org/wiki/Edict_of_Nantes) | Q179788 | Document photo, Public domain |
| Court moves to Versailles | 1682 | [Palace of Versailles](https://en.wikipedia.org/wiki/Palace_of_Versailles) | Q2946 | ToucanWings (aerial photo), CC BY-SA 3.0 |
| Storming of the Bastille | 1789 | [Storming of the Bastille](https://en.wikipedia.org/wiki/Storming_of_the_Bastille) | Q6539 | Unidentified painter, Public domain |
| Napoleon crowned Emperor | 1804 | [Coronation of Napoleon](https://en.wikipedia.org/wiki/Coronation_of_Napoleon) | Q973118 | Jacques-Louis David (painting), Public domain |
| Battle of Waterloo | 1815 | [Battle of Waterloo](https://en.wikipedia.org/wiki/Battle_of_Waterloo) | Q48314 | William Sadler (painting), Public domain |
| Second French Empire proclaimed | 1852 | [Second French Empire](https://en.wikipedia.org/wiki/Second_French_Empire) | Q71092 | Adolphe Yvon (painting), Public domain |
| Third Republic proclaimed | 1870 | [French Third Republic](https://en.wikipedia.org/wiki/French_Third_Republic) | Q70802 | @lankazame (map), CC BY-SA 3.0 |
| Armistice ends World War I | 1918 | [Armistice of 11 November 1918](https://en.wikipedia.org/wiki/Armistice_of_11_November_1918) | Q253224 | Unknown photographer, Public domain |
| Fall of France | 1940 | [Battle of France](https://en.wikipedia.org/wiki/Battle_of_France) | Q151340 | Heinz Fremke, CC BY-SA 3.0 de (Bundesarchiv) |
| Liberation of Paris | 1944 | [Liberation of Paris](https://en.wikipedia.org/wiki/Liberation_of_Paris) | Q696835 | Jack Downey, US Office of War Information, Public domain |
| Fifth Republic established | 1958 | [French Fifth Republic](https://en.wikipedia.org/wiki/French_Fifth_Republic) | Q200686 | Egon Steiner, CC BY-SA 3.0 de (Bundesarchiv) |

### Event locations

| Event | Historical name | Modern city, country | Coordinates |
|---|---|---|---|
| Treaty of Verdun | Verdun | Verdun, France | 49.162, 5.3876 |
| Hugh Capet crowned | Noyon | Noyon, France | 49.5817, 2.9997 |
| Battle of Bouvines | Bouvines | Bouvines, France | 50.583, 3.183 |
| Hundred Years' War begins | — | (no single place; a war, not a battle) | — |
| Siege of Orléans relieved | Orléans | Orléans, France | 47.9025, 1.909 |
| Battle of Castillon | Castillon | Castillon-la-Bataille, France | 44.854, -0.043 |
| Edict of Nantes | Nantes | Nantes, France | 47.2181, -1.5528 |
| Court moves to Versailles | Versailles | Versailles, France | 48.8047, 2.1203 |
| Storming of the Bastille | Paris | Paris, France | 48.8567, 2.3522 |
| Napoleon crowned Emperor | Notre-Dame de Paris | Paris, France | 48.85306, 2.35 |
| Battle of Waterloo | Waterloo | Waterloo, Belgium | 50.71747, 4.39791 |
| Second French Empire proclaimed | Paris | Paris, France | 48.8567, 2.3522 |
| Third Republic proclaimed | Paris | Paris, France | 48.8567, 2.3522 |
| Armistice ends World War I | Compiègne Forest | Compiègne, France | 49.4149, 2.8231 |
| Fall of France | — | (no single place; a country-wide campaign) | — |
| Liberation of Paris | Paris | Paris, France | 48.8567, 2.3522 |
| Fifth Republic established | Paris | Paris, France | 48.8567, 2.3522 |

Note: "Hundred Years' War Begins" and "Fall of France" both have no `location` object at
all (rather than null fields), matching the existing precedent for broad wars/campaigns
without a single natural site (e.g. China's "Great Wall construction begins" in the
civilizations doc).

### Corrections / decisions made

- N/A on corrections to existing seed data — this is a brand-new topic, not a
  replacement.
- **Event count is 17, not the drafted 15.** Added two events — Second French Empire
  proclaimed (1852) and the Armistice ending World War I (1918) — to fill what would
  otherwise have been a 125-year gap (1815–1940) with only one event (the 1870 Third
  Republic). These bridge the July Monarchy/Second Empire era and the whole of World War
  I, both of which are too consequential to France's history to skip entirely just
  because they weren't on the original draft list.
- **Hugh Capet's coronation location**: he was actually crowned twice in 987 — first at
  Noyon (1 June), then again in Paris (3 July). Used Noyon, the first and traditionally
  cited coronation site, as the event's location.
- **Napoleon's coronation location** uses Notre-Dame de Paris's own coordinates rather
  than generic Paris coordinates, since the cathedral itself is the specific, well-known
  site of the event (unlike the other Paris-based events here — Bastille, Second Empire,
  Third Republic, Liberation, Fifth Republic — which are city-wide/institutional events
  without one specific building, so plain Paris coordinates were used for those).
- **Battle of Castillon's `historicalName`** is given as "Castillon" (the name used in
  1453) while `city` is "Castillon-la-Bataille" — the town was renamed after the battle
  to commemorate it, so historical and modern names genuinely differ here, same pattern
  as Carrhae/Harran in the Persia entry (civilizations doc).
- **De Gaulle's photo for the Fifth Republic event is from 1961**, three years after the
  1958 founding — no well-attributed 1958 photo of de Gaulle specifically tied to the
  constitutional founding turned up in the article's image list, so a slightly later
  photo of the same figure/era was used instead and the gap is noted in its
  `imageDescription`.
- All image URLs used were spot-checked with a direct HTTP request (not just inspected
  from the fetched JSON) and returned 200.
- **`id` is `country-france`, not `france`.** `topics.id` is a global primary key not
  scoped by category (see `backend/src/history_zoomout/db/models.py`), and the
  `civilization` category already uses the bare id `japan` — a future country topic for
  Japan would collide with it. Every `country` topic id is prefixed `country-` to avoid
  this; the JSON's `name` field ("France") is unaffected and still displays normally.
