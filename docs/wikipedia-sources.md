# Wikipedia source tracking

Log of what's been pulled from Wikipedia/Wikidata/Wikimedia Commons for seed data, so we
know what's already sourced and don't re-scrape blind. One section per topic.

Sourced JSON files live in `data/wikipedia-data/` — reviewed there before being merged into
the live seed file at `backend/src/history_zoomout/db/seed_data/civilizations.json`.

Body text is written from scratch based on the facts in these articles, not copied from
Wikipedia's prose (Wikipedia's text is CC BY-SA and requires attribution/share-alike if
reproduced; facts themselves aren't copyrightable, so we paraphrase).

## Persia (topic id: `persia`) — pulled 2026-08-02, expanded same day

Status: **merged into live seed data 2026-08-02** (`backend/src/history_zoomout/db/seed_data/civilizations.json`, replacing the old 5-event entry wholesale) and reseeded.

Covers all three successive Persian empires as one topic (550 BC – 651 AD): Achaemenid,
Parthian, and Sasanian. The original 5-event pilot only covered Achaemenid + Sasanian with
a ~470-year Parthian gap and no event for the Achaemenid Empire's actual fall — both filled
in the expansion below.

### Topic-level source

- **History of Iran** — https://en.wikipedia.org/wiki/History_of_Iran — Wikidata Q28926
  (switched from the Achaemenid Empire article once the topic covered all three empires,
  since that's the article that actually matches the topic's full scope)
  - Image kept from the Achaemenid Empire article (`Achaemenid_Empire_500_BCE.jpg` —
    Cattette, CC BY 4.0) since it's the more recognizable/illustrative choice; History of
    Iran's own lead image is an unrelated 19th-century map.

### Event-level sources

| Event | Year | Article | Wikidata | Image credit |
|---|---|---|---|---|
| Cyrus founds the Achaemenid Empire | 550 BC | [Cyrus the Great](https://en.wikipedia.org/wiki/Cyrus_the_Great) | Q8423 | Surenae, CC BY-SA 4.0 |
| Cyrus conquers Babylon, frees the Jewish captives | 539 BC | [Cyrus Cylinder](https://en.wikipedia.org/wiki/Cyrus_Cylinder) | Q405008 | Prioryman, CC BY-SA 3.0 |
| Construction begins at Persepolis | c. 518 BC | [Persepolis](https://en.wikipedia.org/wiki/Persepolis) | Q129072 | Alborzagros, CC BY-SA 3.0 |
| Battle of Thermopylae | 480 BC | [Battle of Thermopylae](https://en.wikipedia.org/wiki/Battle_of_Thermopylae) | Q131969 | Jacques-Louis David (painting), Public domain |
| Achaemenid Empire falls to Alexander | 330 BC | [Darius III](https://en.wikipedia.org/wiki/Darius_III) | Q102865 | Carole Raddato, CC BY-SA 2.0 (Alexander Mosaic detail) |
| Parthian Empire founded | 247 BC | [Parthian Empire](https://en.wikipedia.org/wiki/Parthian_Empire) | Q1986139 | Ro4444 (edited), CC BY-SA 4.0 |
| Battle of Carrhae | 53 BC | [Battle of Carrhae](https://en.wikipedia.org/wiki/Battle_of_Carrhae) | Q205887 | Theodore Ayrault Dodge (1892 illustration), Public domain |
| Sasanian dynasty rises | 224 AD | [Sasanian Empire](https://en.wikipedia.org/wiki/Sasanian_Empire) | Q83891 | Ro4444 (edited), CC BY 4.0 |
| Shapur I captures Emperor Valerian | 260 AD | [Battle of Edessa](https://en.wikipedia.org/wiki/Battle_of_Edessa) | Q1165502 | Diego Delso, CC BY-SA 4.0 (Naqsh-e Rostam relief) |
| Sasanian Empire falls to Arab conquest | 651 AD | [Muslim conquest of Persia](https://en.wikipedia.org/wiki/Muslim_conquest_of_Persia), [Yazdegerd III](https://en.wikipedia.org/wiki/Yazdegerd_III) | Q887684 | Javierfv1212, ed. HistoryofIran, Public domain |

### Event locations

Each event now has a `location`: `historicalName` (the place as known at the time),
modern `city`/`country`, and `latitude`/`longitude` where findable via Wikipedia's own
geo-coordinates. One event has no coordinates — Wikipedia doesn't have a precisely
pinpointed site for it, so `latitude`/`longitude` are left `null` rather than guessed;
`city`/`country` are still filled in since those are reasonably well established.

| Event | Historical name | Modern city, country | Coordinates |
|---|---|---|---|
| Cyrus founds the Achaemenid Empire | Pasargadae | Pasargadae, Iran | 30.2, 53.179 |
| Cyrus conquers Babylon | Babylon | Al-Hillah, Iraq | 32.543, 44.421 |
| Persepolis construction begins | Persepolis | Marvdasht, Iran | 29.935, 52.89 |
| Battle of Thermopylae | Thermopylae | Thermopylae, Greece | 38.796, 22.537 |
| Achaemenid Empire falls | Hecatompylos | Damghan, Iran | *(none found)* |
| Parthian Empire founded | Nisa | Nisa, Turkmenistan | 37.97, 58.2 |
| Battle of Carrhae | Carrhae | Harran, Turkey | 36.871, 39.025 |
| Sasanian dynasty rises | Hormozdgan | Ramhormoz, Iran | 31.28, 49.6 |
| Shapur I captures Valerian | Edessa | Şanlıurfa, Turkey | 37.15, 38.8 |
| Sasanian Empire falls | Merv | Mary, Turkmenistan | 37.663, 62.193 |

Note on the founding event: "Cyrus founds the Achaemenid Empire" doesn't have one exact
battle site documented (he defeated the Medes over a campaign, not a single pinpointed
battle) — used Pasargadae, his own capital and the empire's founding symbol, as a
reasonable stand-in rather than leaving it empty.

### Corrections / decisions made vs. the original 5-event seed data

- The Cyrus event previously credited him with "freeing the Jews from Babylonian
  captivity" at 550 BC — that's the year he founded the empire by defeating the Medes, not
  when he took Babylon. Split into two events: founding (550 BC) and the Babylon
  conquest/Cyrus Cylinder (539 BC), which is where that fact actually belongs.
- Standardized "Sassanid" → "Sasanian" (Wikipedia's preferred spelling; "Sassanid" is
  listed as an alternate).
- Persepolis construction start: Wikipedia's own article gives slightly different figures
  in different places (earliest remains ~515 BC, stairway construction ~519 BC) rather than
  one precise date — kept the existing 518 BC as a reasonable "circa" figure that falls
  within that range and is the commonly cited date elsewhere.
- `sig` (major/minor) assigned by judgment, not sourced from Wikipedia — Wikipedia doesn't
  rank event significance. Kept the two existing empire-founding events at their original
  ratings (Cyrus: major, Ardashir/Sasanian: minor) rather than harmonizing them, since that
  wasn't asked for; used similar judgment for the new events (empire foundings and famous
  military upsets marked major, supporting details marked minor).
