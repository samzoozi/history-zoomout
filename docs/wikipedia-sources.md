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

## Egypt (topic id: `egypt`) — pulled 2026-08-02

Status: **merged into live seed data 2026-08-02** (replacing the old 5-event entry wholesale) and reseeded.

Old data (5 events) clustered almost entirely in the Early Dynastic/Old Kingdom, with a
~3,000-year span otherwise represented by one New Kingdom battle and Cleopatra's death.
Added coverage for the Middle Kingdom, New Kingdom's rise (and Akhenaten's reign, since
the New Kingdom otherwise had only Kadesh), the Late Period's fall to Persia, and
Alexander's conquest founding the Ptolemaic period.

### Topic-level source

- **Ancient Egypt** — https://en.wikipedia.org/wiki/Ancient_Egypt — Wikidata Q11768

### Event-level sources

| Event | Year | Article | Wikidata | Image credit |
|---|---|---|---|---|
| Narmer unites Egypt | 3100 BC | [Narmer](https://en.wikipedia.org/wiki/Narmer) | Q189582 | Public domain |
| Djoser builds the Step Pyramid | c. 2670 BC | [Pyramid of Djoser](https://en.wikipedia.org/wiki/Pyramid_of_Djoser) | Q192158 | CC BY-SA 3.0 (artist not in metadata) |
| Great Pyramid completed | c. 2560 BC | [Great Pyramid of Giza](https://en.wikipedia.org/wiki/Great_Pyramid_of_Giza) | Q37200 | Douwe C. van der Zee, CC BY-SA 4.0 |
| Mentuhotep II reunifies Egypt (Middle Kingdom) | c. 2055 BC | [Mentuhotep II](https://en.wikipedia.org/wiki/Mentuhotep_II) | Q296439 | Prof. Mortel, CC BY 2.0 |
| Ahmose I expels the Hyksos (New Kingdom) | c. 1550 BC | [Ahmose I](https://en.wikipedia.org/wiki/Ahmose_I) | Q7222 | Metropolitan Museum of Art, CC0 |
| Akhenaten's religious revolution | c. 1353 BC | [Akhenaten](https://en.wikipedia.org/wiki/Akhenaten) | Q81794 | CC BY-SA 2.5 (artist not in metadata) |
| Battle of Kadesh | 1274 BC | [Battle of Kadesh](https://en.wikipedia.org/wiki/Battle_of_Kadesh) | Q203729 | CC BY-SA 3.0 (artist not in metadata) |
| Cambyses II conquers Egypt for Persia | 525 BC | [First Achaemenid conquest of Egypt](https://en.wikipedia.org/wiki/First_Achaemenid_conquest_of_Egypt) | *(none found)* | Mossmaps, CC BY-SA 4.0 (map) |
| Alexander conquers Egypt | 332 BC | [Alexander the Great](https://en.wikipedia.org/wiki/Alexander_the_Great) | Q8409 | Public domain (Alexander Mosaic detail) |
| Death of Cleopatra VII | 30 BC | [Cleopatra](https://en.wikipedia.org/wiki/Cleopatra) | Q635 | Louis le Grand, Public domain |

### Event locations

| Event | Historical name | Modern city, country | Coordinates |
|---|---|---|---|
| Narmer unites Egypt | Hierakonpolis | Kom el-Ahmar, Egypt | 25.097, 32.779 |
| Djoser builds the Step Pyramid | Saqqara | Saqqara, Egypt | 29.871, 31.217 |
| Great Pyramid completed | Giza | Giza, Egypt | 29.987, 31.212 |
| Mentuhotep II reunifies Egypt | Thebes | Luxor, Egypt | 25.721, 32.610 |
| Ahmose I expels the Hyksos | Avaris | Tell el-Dab'a, Egypt | 30.783, 31.833 |
| Akhenaten's religious revolution | Akhetaten | Amarna, Egypt | 27.645, 30.896 |
| Battle of Kadesh | Kadesh | Homs (approx.), Syria | *(none found)* |
| Cambyses II conquers Egypt | Pelusium | Tell el-Farama, Egypt | 31.042, 32.545 |
| Alexander conquers Egypt | Memphis | Mit Rahina, Egypt | 29.849, 31.255 |
| Death of Cleopatra VII | Alexandria | Alexandria, Egypt | 31.198, 29.893 |

### Corrections / decisions made vs. the original 5-event seed data

- Refined the vague "Old Kingdom Begins" (2686 BC, no concrete action) into "Djoser Builds
  the Step Pyramid at Saqqara" (c. 2670 BC) — a specific, well-documented event with a
  matching image, marking the same transition more concretely.
- Several new-event dates (Mentuhotep II's reunification, Ahmose I's expulsion of the
  Hyksos) are approximate by Wikipedia's own admission — ancient Egyptian chronology has
  competing dating systems. Used the commonly-cited round figures (2055 BC, 1550 BC) that
  match standard Egyptological convention, per Wikipedia's own caveats.
- No Wikidata item found for the First Achaemenid conquest of Egypt event specifically
  (the Wikidata ID present is for the disambiguation page, not a specific battle item) —
  left `wikidataId` null rather than pointing at the wrong item.

## Greece (topic id: `greece`) — pulled 2026-08-02

Status: **merged into live seed data 2026-08-02** (replacing the old 5-event entry wholesale) and reseeded.

Old data (5 events) covered the Archaic period well but stopped at Marathon (490 BC) --
missing the rest of the Persian Wars, the Peloponnesian War, and the entire Hellenistic
period (Alexander's conquests) before jumping straight to Rome's conquest in 146 BC.

### Topic-level source

- **Ancient Greece** — https://en.wikipedia.org/wiki/Ancient_Greece — Wikidata Q11772

### Event-level sources

| Event | Year | Article | Wikidata | Image credit |
|---|---|---|---|---|
| First Olympic Games | 776 BC | [Ancient Olympic Games](https://en.wikipedia.org/wiki/Ancient_Olympic_Games) | Q188468 | Bgabel, CC BY-SA 3.0 |
| Draco's laws | c. 621 BC | [Draco (legislator)](https://en.wikipedia.org/wiki/Draco_(legislator)) | Q28626 | Max Karl Baldamus, Public domain |
| Cleisthenes founds democracy | 508 BC | [Cleisthenes](https://en.wikipedia.org/wiki/Cleisthenes) | Q207634 | Unknown artist, CC BY |
| Battle of Marathon | 490 BC | [Battle of Marathon](https://en.wikipedia.org/wiki/Battle_of_Marathon) | Q31900 | John Steeple Davis, Public domain |
| Battle of Salamis | 480 BC | [Battle of Salamis](https://en.wikipedia.org/wiki/Battle_of_Salamis) | Q178850 | US Military Academy, Public domain |
| Peloponnesian War begins | 431 BC | [Peloponnesian War](https://en.wikipedia.org/wiki/Peloponnesian_War) | Q33745 | Captain Blood/Kenmayer, CC BY-SA 3.0 (map) |
| Alexander invades Persia (Granicus) | 334 BC | [Battle of the Granicus](https://en.wikipedia.org/wiki/Battle_of_the_Granicus) | Q192938 | Charles Le Brun, Public domain |
| Rome conquers Greece (Corinth) | 146 BC | [Battle of Corinth (146 BC)](https://en.wikipedia.org/wiki/Battle_of_Corinth_(146_BC)) | Q587983 | Tony Robert-Fleury / Sailko, CC BY 3.0 |

### Event locations

| Event | Historical name | Modern city, country | Coordinates |
|---|---|---|---|
| First Olympic Games | Olympia | Olympia, Greece | 37.64, 21.63 |
| Draco's laws | Athens | Athens, Greece | 37.98, 23.73 |
| Cleisthenes founds democracy | Athens | Athens, Greece | 37.98, 23.73 |
| Battle of Marathon | Marathon | Marathon, Greece | 38.15, 23.96 |
| Battle of Salamis | Salamis | Salamis Island, Greece | 37.93, 23.50 |
| Peloponnesian War begins | Sparta | Sparta, Greece | 37.08, 22.42 |
| Alexander invades Persia | Granicus | Biga, Turkey | 40.228, 27.242 |
| Rome conquers Greece | Corinth | Corinth, Greece | 37.905, 22.880 |

### Corrections / decisions made vs. the original 5-event seed data

- "Peloponnesian War begins" is located at Sparta (the side that formally declared war),
  not a battle site -- the war had no single opening battle, so this uses the same
  "symbolic capital" logic as founding events without one pinpointed location.
- "Alexander invades Persia" uses the Battle of the Granicus (334 BC, his first battle in
  Asia) rather than 336 BC (when he became king of Macedon, sometimes loosely cited as
  when his campaigns "began") -- 334 BC is when the actual invasion started.

## Rome (topic id: `rome`) — pulled 2026-08-02

Status: **merged into live seed data 2026-08-02** (replacing the old 5-event entry wholesale) and reseeded.

Old data (5 events) had no Punic Wars at all and, more importantly, no event for Augustus
becoming the first emperor (27 BC) -- arguably the single most significant date missing,
since it's the Republic-to-Empire transition the whole rest of Roman history hinges on.
Also added Diocletian's Tetrarchy (293 AD), which explains *why* Rome and the Byzantine
Empire end up as separate topics in this dataset.

### Topic-level source

- **Ancient Rome** — https://en.wikipedia.org/wiki/Ancient_Rome — Wikidata Q1747689

### Event-level sources

| Event | Year | Article | Wikidata | Image credit |
|---|---|---|---|---|
| Founding of Rome | 753 BC | [Founding of Rome](https://en.wikipedia.org/wiki/Founding_of_Rome) | Q1247524 | Rabax63, CC BY-SA 4.0 (Capitoline Wolf) |
| Roman Republic established | 509 BC | [Roman Republic](https://en.wikipedia.org/wiki/Roman_Republic) | Q17167 | Ifly6, CC BY-SA 4.0 (map) |
| Battle of Zama | 202 BC | [Battle of Zama](https://en.wikipedia.org/wiki/Battle_of_Zama) | Q200056 | Sébastien Slodtz, Public domain (sculpture) |
| Assassination of Julius Caesar | 44 BC | [Assassination of Julius Caesar](https://en.wikipedia.org/wiki/Assassination_of_Julius_Caesar) | Q1025466 | Vincenzo Camuccini, Public domain |
| Augustus becomes first Emperor | 27 BC | [Augustus](https://en.wikipedia.org/wiki/Augustus) | Q1405 | Justin Benttinen, CC BY-SA 4.0 |
| Colosseum opens | 80 AD | [Colosseum](https://en.wikipedia.org/wiki/Colosseum) | Q10285 | FeaturedPics, CC BY-SA 4.0 |
| Diocletian splits the Empire (Tetrarchy) | 293 AD | [Diocletian](https://en.wikipedia.org/wiki/Diocletian) | Q43107 | Dosseman, CC BY-SA 4.0 |
| Fall of the Western Roman Empire | 476 AD | [Romulus Augustulus](https://en.wikipedia.org/wiki/Romulus_Augustulus) | Q608613 | American Numismatic Society, CC0 (coin) |

### Event locations

| Event | Historical name | Modern city, country | Coordinates |
|---|---|---|---|
| Founding of Rome | Rome | Rome, Italy | 41.89, 12.48 |
| Roman Republic established | Rome | Rome, Italy | 41.89, 12.48 |
| Battle of Zama | Zama | *(unconfirmed)*, Tunisia | *(none found)* |
| Assassination of Julius Caesar | Rome | Rome, Italy | 41.89, 12.48 |
| Augustus becomes first Emperor | Rome | Rome, Italy | 41.89, 12.48 |
| Colosseum opens | Rome | Rome, Italy | 41.89, 12.48 |
| Diocletian splits the Empire | Nicomedia | İzmit, Turkey | 40.76, 29.92 |
| Fall of the Western Roman Empire | Ravenna | Ravenna, Italy | 44.42, 12.20 |

### Corrections / decisions made vs. the original 5-event seed data

- Diocletian's location is Nicomedia (his actual capital, modern İzmit, Turkey), not
  Rome -- he rarely visited Rome itself, which is itself a notable fact about the later
  Empire's shift away from the city.
- The Western Empire's fall is located at Ravenna (the Western capital by 476 AD, where
  Romulus Augustulus was actually deposed), not Rome -- another case where "Rome" the
  empire and Rome the city had diverged by this point.
- Zama's modern location isn't confidently identified (Wikipedia doesn't pin a specific
  modern town), so `city` is left null alongside the missing coordinates -- only `country`
  (Tunisia) is filled in.
- All ten image URLs across Persia/Egypt/Greece/Rome were spot-verified with direct HTTP
  requests after a transcription error was caught (a guessed Commons hash prefix that
  didn't match the real file path) -- worth doing this check rather than trusting
  fetched/retyped URLs by inspection alone.
