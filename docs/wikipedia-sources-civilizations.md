# Wikipedia source tracking — Civilizations

Log of what's been pulled from Wikipedia/Wikidata/Wikimedia Commons for seed data, so we
know what's already sourced and don't re-scrape blind. One section per topic.

This file covers the `civilization` category only. Other categories (e.g. `country`) are
tracked in their own `wikipedia-sources-<category>.md` file in this directory — topic ids
and topic names can otherwise collide across categories (e.g. a civilization "Japan" and a
country "Japan"), so each category gets its own file and its own subfolder under
`data/wikipedia-data/`.

Sourced JSON files live in `data/wikipedia-data/civilization/` — reviewed there before
being merged into the live seed file at
`backend/src/history_zoomout/db/seed_data/civilizations.json`.

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

## Mesopotamia (topic id: `mesopotamia`) — pulled 2026-08-03

Status: **merged into live seed data 2026-08-03** (replacing the old 5-event entry wholesale) and reseeded.

Old data (5 events) only showed the *fall* of both the Neo-Assyrian and Neo-Babylonian
Empires ("Nineveh Falls," "Cyrus Takes Babylon") with no events for either one's rise --
the same pattern as Persia's original pilot. Also missing the Sumerian revival under the
Third Dynasty of Ur entirely.

### Topic-level source

- **History of Mesopotamia** — https://en.wikipedia.org/wiki/History_of_Mesopotamia — Wikidata Q2481441

### Event-level sources

| Event | Year | Article | Wikidata | Image credit |
|---|---|---|---|---|
| Cuneiform emerges at Uruk | 3200 BC | [Cuneiform](https://en.wikipedia.org/wiki/Cuneiform) | Q401 | Bjørn Christian Tørrissen, CC BY-SA 3.0 |
| Sargon founds the Akkadian Empire | 2334 BC | [Sargon of Akkad](https://en.wikipedia.org/wiki/Sargon_of_Akkad) | Q199461 | ALFGRN, CC BY-SA 2.0 |
| Ur-Nammu founds the Third Dynasty of Ur | c. 2112 BC | [Third Dynasty of Ur](https://en.wikipedia.org/wiki/Third_Dynasty_of_Ur) | Q723587 | Sémhur/Zunkir, CC BY-SA 3.0 (map) |
| Hammurabi's Code | 1754 BC | [Code of Hammurabi](https://en.wikipedia.org/wiki/Code_of_Hammurabi) | Q93304 | Mbzt, CC BY 3.0 |
| Ashurbanipal builds the Library at Nineveh | c. 630 BC | [Library of Ashurbanipal](https://en.wikipedia.org/wiki/Library_of_Ashurbanipal) | *(none found)* | KeyolTranslater, CC BY-SA 4.0 |
| Nineveh falls | 612 BC | [Fall of Nineveh](https://en.wikipedia.org/wiki/Fall_of_Nineveh) | Q612286 | Mu-tamajo, CC BY-SA 4.0 |
| Nebuchadnezzar II conquers Jerusalem | 587 BC | [Nebuchadnezzar II](https://en.wikipedia.org/wiki/Nebuchadnezzar_II), [Siege of Jerusalem (587 BC)](https://en.wikipedia.org/wiki/Siege_of_Jerusalem_(587_BC)) | Q12591 | Public domain |
| Cyrus takes Babylon | 539 BC | [Fall of Babylon](https://en.wikipedia.org/wiki/Fall_of_Babylon) | Q28169617 | J. Martin (1831 mezzotint), CC BY 4.0 |

### Event locations

| Event | Historical name | Modern city, country | Coordinates |
|---|---|---|---|
| Cuneiform emerges at Uruk | Uruk | Warka, Iraq | 31.324, 45.637 |
| Sargon founds the Akkadian Empire | Akkad | *(unlocated)*, Iraq | *(none found)* |
| Ur-Nammu founds the Third Dynasty of Ur | Ur | Nasiriyah, Iraq | 30.962, 46.105 |
| Hammurabi's Code | Babylon | Al-Hillah, Iraq | 32.543, 44.421 |
| Ashurbanipal builds the Library | Nineveh | Mosul, Iraq | 36.359, 43.153 |
| Nineveh falls | Nineveh | Mosul, Iraq | 36.359, 43.153 |
| Nebuchadnezzar II conquers Jerusalem | Jerusalem | Jerusalem, Israel | 31.779, 35.226 |
| Cyrus takes Babylon | Babylon | Al-Hillah, Iraq | 32.543, 44.421 |

### Corrections / decisions made vs. the original 5-event seed data

- Akkad's location is a genuine open archaeological question -- its site has never been
  definitively identified, unlike every other location in this dataset. `city` and
  coordinates are left null; only `country` (Iraq, per scholarly consensus on the general
  region) is filled in.
- Ashurbanipal's library has no single founding year in the sources checked (his reign
  spanned 668–627 BC) -- used 630 BC as a reasonable "circa" figure within that range
  rather than a precise date.
- No Wikidata item found specifically for the Library of Ashurbanipal as an event (only
  for Ashurbanipal himself, and the source URL cites the library-specific article) --
  left `wikidataId` null rather than pointing at a mismatched item.

## China (topic id: `china`) — pulled 2026-08-03

Status: **merged into live seed data 2026-08-03** (replacing the old 5-event entry wholesale) and reseeded.

Old data (5 events) had a ~1500-year span but the Song dynasty (960–1279, over 300 years)
only appeared via its *fall* to the Mongols -- no founding event at all. Also missing the
Han dynasty's founding (only its papermaking event was represented) and the Sui reunification
that ended centuries of division after the Han collapse.

### Topic-level source

- **History of China** — https://en.wikipedia.org/wiki/History_of_China — Wikidata Q82972

### Event-level sources

| Event | Year | Article | Wikidata | Image credit |
|---|---|---|---|---|
| Qin Shi Huang unifies China | 221 BC | [Qin Shi Huang](https://en.wikipedia.org/wiki/Qin_Shi_Huang) | Q7192 | Public domain |
| Great Wall construction begins | 214 BC | [Great Wall of China](https://en.wikipedia.org/wiki/Great_Wall_of_China) | Q12501 | Severin.stalder, CC BY-SA 3.0 |
| Liu Bang founds the Han Dynasty | 202 BC | [Emperor Gaozu of Han](https://en.wikipedia.org/wiki/Emperor_Gaozu_of_Han) | Q7210 | Public domain |
| Cai Lun refines papermaking | 105 AD | [Cai Lun](https://en.wikipedia.org/wiki/Cai_Lun) | Q229235 | Public domain |
| Sui Wendi reunifies China | 581 AD | [Emperor Wen of Sui](https://en.wikipedia.org/wiki/Emperor_Wen_of_Sui) | Q7418 | Yan Liben (painting), Public domain |
| Tang Taizong becomes "Heavenly Khan" | 630 AD | [Emperor Taizong of Tang](https://en.wikipedia.org/wiki/Emperor_Taizong_of_Tang) | Q9701 | Public domain |
| An Lushan Rebellion | 755 AD | [An Lushan rebellion](https://en.wikipedia.org/wiki/An_Lushan_rebellion) | Q253774 | SY, CC BY-SA 4.0 (map) |
| Song Dynasty founded | 960 AD | [Emperor Taizu of Song](https://en.wikipedia.org/wiki/Emperor_Taizu_of_Song) | Q7471 | Public domain |
| Mongols conquer the Song Dynasty | 1279 AD | [Battle of Yamen](https://en.wikipedia.org/wiki/Battle_of_Yamen) | *(none found)* | 长夜无风, CC BY 3.0 |

### Event locations

| Event | Historical name | Modern city, country | Coordinates |
|---|---|---|---|
| Qin Shi Huang unifies China | Xianyang | Xianyang, China | 34.33, 108.71 |
| Great Wall construction begins | — | *(no single site)* | — |
| Liu Bang founds the Han Dynasty | Chang'an | Xi'an, China | 34.26, 108.94 |
| Cai Lun refines papermaking | Luoyang | Luoyang, China | 34.62, 112.45 |
| Sui Wendi reunifies China | Chang'an | Xi'an, China | 34.26, 108.94 |
| Tang Taizong becomes "Heavenly Khan" | Chang'an | Xi'an, China | 34.26, 108.94 |
| An Lushan Rebellion | Fanyang | Beijing, China | 39.91, 116.40 |
| Song Dynasty founded | Bianjing | Kaifeng, China | 34.80, 114.35 |
| Mongols conquer the Song Dynasty | Yamen | Jiangmen, China | 22.27, 113.08 |

### Corrections / decisions made vs. the original 5-event seed data

- "Great Wall construction begins" has no `location` object at all (not even null fields)
  -- the wall spans thousands of kilometers and was built by linking pre-existing regional
  walls, so there's no single site to anchor it to, unlike every other event here.
- Several capitals repeat the same coordinates (Chang'an/Xi'an is the capital across three
  different events spanning Han, Sui, and Tang) -- this is accurate, not a mistake; Xi'an
  really was the seat of power for most of this span.
- No Wikidata item found for the Battle of Yamen specifically -- left `wikidataId` null.

## Byzantine Empire (topic id: `byzantine`) — pulled 2026-08-03

Status: **merged into live seed data 2026-08-03** (replacing the old 5-event entry wholesale) and reseeded.

Old data (5 events) had a 1,123-year span with no mention of the Arab sieges that nearly
ended the empire in the 7th-8th centuries, its medieval territorial peak under Basil II,
or the Fourth Crusade's sack of Constantinople in 1204 -- arguably the single most
consequential setback in Byzantine history before the final fall in 1453, and completely
absent from the original data.

### Topic-level source

- **Byzantine Empire** — https://en.wikipedia.org/wiki/Byzantine_Empire — Wikidata Q12544

### Event-level sources

| Event | Year | Article | Wikidata | Image credit |
|---|---|---|---|---|
| Constantinople founded | 330 AD | [Constantinople](https://en.wikipedia.org/wiki/Constantinople) | Q16869 | Cplakidas, CC BY-SA 3.0 (map) |
| Justinian's Code compiled | 529 AD | [Code of Justinian](https://en.wikipedia.org/wiki/Code_of_Justinian) | Q735763 | Public domain |
| Hagia Sophia completed | 537 AD | [Hagia Sophia](https://en.wikipedia.org/wiki/Hagia_Sophia) | Q12506 | Adli Wahid, CC BY-SA 3.0 |
| Greek fire repels the Arab siege | 718 AD | [Siege of Constantinople (717-718)](https://en.wikipedia.org/wiki/Siege_of_Constantinople_(717%E2%80%93718)) | Q27900 | Manasses Chronicle, Public domain |
| Basil II crushes Bulgaria at Kleidion | 1014 AD | [Battle of Kleidion](https://en.wikipedia.org/wiki/Battle_of_Kleidion) | Q584047 | Manasses Chronicle, Public domain |
| The Great Schism | 1054 AD | [East-West Schism](https://en.wikipedia.org/wiki/East%E2%80%93West_Schism) | Q51648 | Barrikader, CC BY-SA 3.0 (map) |
| Fourth Crusade sacks Constantinople | 1204 AD | [Sack of Constantinople](https://en.wikipedia.org/wiki/Sack_of_Constantinople) | Q1750892 | Sailko, CC BY-SA 3.0 |
| Constantinople falls to the Ottomans | 1453 AD | [Fall of Constantinople](https://en.wikipedia.org/wiki/Fall_of_Constantinople) | Q160077 | DimiTalen, CC0 |

### Event locations

Every event in this topic happens at Constantinople itself (Istanbul, Turkey, 41.014,
28.955) except one:

| Event | Historical name | Modern city, country | Coordinates |
|---|---|---|---|
| Basil II crushes Bulgaria at Kleidion | Kleidion | Klyuch, Bulgaria | 41.363, 23.018 |

### Corrections / decisions made vs. the original 5-event seed data

- Chose the Battle of Kleidion (1014) over Basil II's final subjugation of Bulgaria
  (1018) for the "medieval peak" event -- 1014 is the specific, dated, famous battle (and
  the source of his "Bulgar Slayer" epithet); 1018 is a less dramatic formal submission.
- "The Great Schism" doesn't have a single battle-style location, but it's conventionally
  anchored to Constantinople since that's where the papal legates delivered the bull of
  excommunication (at Hagia Sophia) -- used the same coordinates as the rest of the topic
  rather than omitting location entirely.

## Islamic Caliphates (topic id: `islamic`) — pulled 2026-08-03

Status: **merged into live seed data 2026-08-03** (replacing the old 5-event entry wholesale) and reseeded.

Old data (5 events) jumped straight from the Rashidun Caliphate's start (632) to the
Abbasid Caliphate's founding (750) -- skipping the entire ~90-year Umayyad Caliphate,
including the Islamic conquests' peak expansion into Spain and the Battle of Tours that
halted its advance into the rest of Europe. Also a ~430-year gap between the House of
Wisdom (830) and the Mongol sack of Baghdad (1258) with nothing in between.

### Topic-level source

- **Caliphate** — https://en.wikipedia.org/wiki/Caliphate — Wikidata Q131401

### Event-level sources

| Event | Year | Article | Wikidata | Image credit |
|---|---|---|---|---|
| The Hijra | 622 AD | [Hijrah](https://en.wikipedia.org/wiki/Hijrah) | Q131482 | Public domain |
| Rashidun Caliphate begins | 632 AD | [Rashidun Caliphate](https://en.wikipedia.org/wiki/Rashidun_Caliphate) | Q12490507 | Mohammad adil, CC BY-SA 3.0 (map) |
| Muawiyah I founds the Umayyad Caliphate | 661 AD | [Mu'awiya I](https://en.wikipedia.org/wiki/Mu%27awiya_I) | Q181154 | Public domain |
| Battle of Tours halts Umayyad expansion | 732 AD | [Battle of Tours](https://en.wikipedia.org/wiki/Battle_of_Tours) | Q173077 | Charles de Steuben (painting), Public domain |
| Abbasid Caliphate founded | 750 AD | [Abbasid Caliphate](https://en.wikipedia.org/wiki/Abbasid_Caliphate) | Q12536 | Tarikhnama manuscript, Public domain |
| House of Wisdom flourishes | 830 AD | [House of Wisdom](https://en.wikipedia.org/wiki/House_of_Wisdom) | Q33018 | Maqamat al-Hariri manuscript, Public domain |
| Seljuks take control of Baghdad | 1055 AD | [Tughril I](https://en.wikipedia.org/wiki/Tughril_I) | Q144565 | Public domain |
| Mongols sack Baghdad | 1258 AD | [Siege of Baghdad](https://en.wikipedia.org/wiki/Siege_of_Baghdad) | Q369560 | Jami al-Tawarikh manuscript, Public domain |

### Event locations

| Event | Historical name | Modern city, country | Coordinates |
|---|---|---|---|
| The Hijra | Yathrib | Medina, Saudi Arabia | 24.47, 39.61 |
| Rashidun Caliphate begins | Yathrib | Medina, Saudi Arabia | 24.47, 39.61 |
| Muawiyah I founds the Umayyad Caliphate | Damascus | Damascus, Syria | 33.513, 36.309 |
| Battle of Tours | Tours | Tours, France | 47.394, 0.689 |
| Abbasid Caliphate founded | Kufa | Kufa, Iraq | 32.03, 44.4 |
| House of Wisdom flourishes | Baghdad | Baghdad, Iraq | 33.315, 44.366 |
| Seljuks take control of Baghdad | Baghdad | Baghdad, Iraq | 33.315, 44.366 |
| Mongols sack Baghdad | Baghdad | Baghdad, Iraq | 33.315, 44.366 |

### Corrections / decisions made vs. the original 5-event seed data

- The Abbasid Caliphate was proclaimed at Kufa in 750, not Baghdad -- Baghdad wasn't
  founded until 762, several years into the dynasty. Used Kufa for the founding event and
  Baghdad for everything afterward, once it became the actual seat of power.
- A guessed Commons image hash prefix for the Abbasid founding illustration turned out to
  be wrong (404) and was caught by the same direct-URL verification step used for every
  other topic -- fixed by re-querying the imageinfo API for the real thumbnail URL rather
  than trusting the guess.

## Japan (topic id: `japan`) — pulled 2026-08-03

Status: **new topic, not yet in `civilizations.json`** — file written to
`data/wikipedia-data/japan.json` only; merging into the live seed and reseeding is a
separate step.

Unlike the other topics here, Japan has no fall/conquest/dissolution to end on --
statehood continues to the present. Framed the topic as "pre-modern Japan," ending at
the 1868 Meiji Restoration (fall of the shogunate), matching how Byzantine/Islamic/etc.
end at a regime's collapse rather than drifting into the modern nation-state. `colorIndex`
8 was assigned as the next unused value following the existing rotation (mesopotamia..maya
= 1-8, byzantine..inca repeats 1-7); not derived from any app logic, just kept distinct
from its nearest neighbors on the timeline (maya=8, byzantine=1).

### Topic-level source

- **History of Japan** — https://en.wikipedia.org/wiki/History_of_Japan — Wikidata Q130436
- Lead article had no thumbnail image, so the topic-level image was sourced from Tōdai-ji's
  Great Buddha Hall in Nara instead (built 8th century, tied to Buddhism's establishment
  early in the timeline) rather than a generic map.

### Event-level sources

| Event | Year | Article | Wikidata | Image credit |
|---|---|---|---|---|
| Yamato polity unifies the Nara Basin | 300 AD | [Kofun period](https://en.wikipedia.org/wiki/Kofun_period) | Q459939 | Immanuelle (map), CC BY 4.0 |
| Buddhism arrives from Baekje | 552 AD | [Buddhism in Japan](https://en.wikipedia.org/wiki/Buddhism_in_Japan) | Q736311 | Chris 73, CC BY-SA 3.0 |
| Isshi Incident triggers the Taika Reform | 645 AD | [Taika Reform](https://en.wikipedia.org/wiki/Taika_Reform) | Q570140 | Gukei Sumiyoshi (scroll painting), Public domain |
| Capital moves to Heian-kyō | 794 AD | [Heian period](https://en.wikipedia.org/wiki/Heian_period) | Q193292 | Imperial court in Kyoto (Genji emaki), Public domain |
| Minamoto no Yoritomo becomes shogun | 1192 AD | [Kamakura shogunate](https://en.wikipedia.org/wiki/Kamakura_shogunate) | Q736839 | Utagawa Sadahide, Public domain |
| Kamikaze repel the second Mongol invasion | 1281 AD | [Mongol invasions of Japan](https://en.wikipedia.org/wiki/Mongol_invasions_of_Japan) | Q208156 | Qiushufang, CC BY-SA 4.0 |
| Ōnin War shatters central authority | 1467 AD | [Ōnin War](https://en.wikipedia.org/wiki/%C5%8Cnin_War) | Q385676 | Utagawa Yoshitora, Public domain |
| Tokugawa Ieyasu wins at Sekigahara | 1600 AD | [Battle of Sekigahara](https://en.wikipedia.org/wiki/Battle_of_Sekigahara) | Q234188 | Town of Sekigahara Archive (folding screen), Public domain |
| Commodore Perry forces Japan open | 1853 AD | [Perry Expedition](https://en.wikipedia.org/wiki/Perry_Expedition) | Q7169780 | Unknown artist, Public domain |
| Meiji Restoration ends the shogunate | 1868 AD | [Meiji Restoration](https://en.wikipedia.org/wiki/Meiji_Restoration) | Q8707 | Takahashi Yuichi (painting), Public domain |

### Event locations

| Event | Historical name | Modern city, country | Coordinates |
|---|---|---|---|
| Yamato polity unifies the Nara Basin | Yamato | Nara, Japan | 34.684, 135.805 |
| Buddhism arrives from Baekje | Asuka | Asuka, Japan | 34.471, 135.821 |
| Isshi Incident triggers the Taika Reform | Asuka | Asuka, Japan | 34.471, 135.821 |
| Capital moves to Heian-kyō | Heian-kyō | Kyoto, Japan | 35.012, 135.768 |
| Minamoto no Yoritomo becomes shogun | Kamakura | Kamakura, Japan | 35.320, 139.553 |
| Kamikaze repel the second Mongol invasion | Hakata Bay | Fukuoka, Japan | 33.590, 130.402 |
| Ōnin War shatters central authority | Heian-kyō | Kyoto, Japan | 35.012, 135.768 |
| Tokugawa Ieyasu wins at Sekigahara | Sekigahara | Sekigahara, Japan | 35.366, 136.467 |
| Commodore Perry forces Japan open | Uraga | Yokosuka, Japan | 35.233, 139.717 |
| Meiji Restoration ends the shogunate | Heian-kyō | Kyoto, Japan | 35.012, 135.768 |

### Corrections / decisions made vs. the original seed data

- N/A -- this is a brand-new topic, not a replacement of existing seed data.
- The Kamakura shogunate's founding date is genuinely disputed between 1185 (when
  Yoritomo established the shugo/jitō systems) and 1192 (when he received the title of
  shogun). Went with 1192, the traditional and more commonly cited date, since the event
  title centers on Yoritomo *becoming shogun* specifically.
- Buddhism's introduction date is also disputed between 538 and 552; Wikipedia's own
  article calls both "unreliable" but treats 552 (per the *Nihon Shoki*) as the one
  "usually considered" official. Went with 552.
- The Meiji Restoration's declaration and the Ōnin War both took place at the same
  Kyoto location as the Heian-kyō founding event -- reused the same coordinates rather
  than treating them as different places, since Kyoto has been continuously the same
  city under both names.

## Indus Valley (topic id: `indus`) — pulled 2026-08-03

Status: **researched, not yet merged into live seed data** (`data/wikipedia-data/indus.json`).

The existing 5-event pilot entry started at 2600 BC and covered only the Mature Harappan
phase forward -- it skipped the ~700-year Early Harappan period entirely, the same gap the
Persia pilot had for its Parthian era. Widened the topic's `start` from -2600 to -3300 to
add a founding event for the Early Harappan phase, matching the full 3300-1300 BC range
Wikipedia gives for the civilization as a whole. `colorIndex` (3) kept from the existing
entry for a drop-in merge.

### Topic-level source

- **Indus Valley Civilisation** — https://en.wikipedia.org/wiki/Indus_Valley_Civilisation — Wikidata Q42534
- Image is the lead thumbnail (a Mature Phase site-distribution map) since the article's
  own images are otherwise mostly artifact photos better suited to individual events.

### Event-level sources

| Event | Year | Article | Wikidata | Image credit |
|---|---|---|---|---|
| Early farming villages rise at Kot Diji | 3300 BC | [Kot Diji](https://en.wikipedia.org/wiki/Kot_Diji) | Q1017084 | *(none — see note below)* |
| Harappa and Mohenjo-daro rise | 2600 BC | [Harappa](https://en.wikipedia.org/wiki/Harappa) | Q185562 | Muhammad Bin Naveed, CC BY-SA 3.0 |
| A standardized script appears on seals | 2500 BC | [Indus script](https://en.wikipedia.org/wiki/Indus_script) | Q601388 | PHGCOM, CC BY-SA 3.0 |
| Trade networks reach Mesopotamia | 2334 BC | [Meluhha](https://en.wikipedia.org/wiki/Meluhha) | Q483421 | Sémhur (base) / Zunkir (derivative), CC BY-SA 3.0 |
| The Mature Harappan cities begin to decline | 1900 BC | [Indus Valley Civilisation](https://en.wikipedia.org/wiki/Indus_Valley_Civilisation) | Q42534 | Saqib Qayyum, CC BY-SA 3.0 |
| Cemetery H culture marks a Late Harappan shift | 1700 BC | [Cemetery H culture](https://en.wikipedia.org/wiki/Cemetery_H_culture) | Q2364797 | Avantiputra7, CC BY-SA 4.0 |
| The civilization fades | 1300 BC | [Indus Valley Civilisation](https://en.wikipedia.org/wiki/Indus_Valley_Civilisation) | Q42534 | Saqib Qayyum, CC BY-SA 3.0 |

### Event locations

| Event | Historical name | Modern city, country | Coordinates |
|---|---|---|---|
| Early farming villages rise at Kot Diji | Kot Diji | Khairpur, Pakistan | 27.346, 68.707 |
| Harappa and Mohenjo-daro rise | Harappa | Harappa, Pakistan | 30.629, 72.864 |
| Cemetery H culture marks a Late Harappan shift | Harappa (Cemetery H) | Harappa, Pakistan | 30.629, 72.864 |

Trade with Mesopotamia, the seal script, the Mature Harappan decline, and the final fade
are all civilization-wide developments without one natural place, so those four events
have no `location` -- consistent with how the original pilot data treated this topic (no
event had a location at all).

### Corrections / decisions made vs. the original seed data

- Widened `start` from -2600 to -3300 to add the Kot Diji founding event and cover the
  Early Harappan phase (see status note above).
- "Trade Networks Reach Mesopotamia" moved from -2350 to -2334: the earliest documented
  Mesopotamian reference to Meluhha (widely identified with the Indus Valley) is in
  Sargon of Akkad's inscriptions, and Sargon's reign begins 2334 BC. -2350 predates his
  reign and isn't otherwise attested in the sources checked.
- "The Great Bath Falls Out of Use" (-1900, minor) is retitled "The Mature Harappan
  Cities Begin to Decline." No source found gives a specific construction or
  disuse date for the Great Bath itself -- Mohenjo-daro's own article only dates the
  *city* to "built c. 2500 BC, abandoned c. 1700 BC," with no separate Great Bath date.
  1900 BC is well-attested as the point the Mature Harappan phase ends and population/trade
  contraction begins (Harappa's article gives its Mature phase as "2600 BC – 1900 BC"),
  so kept the year but reframed the fact to what's actually sourceable. Kept the Great
  Bath as the event's image (a real, dateable structure at the city) even though the
  title no longer centers on it.
- No usable image found for the Kot Diji founding event. The two images tagged to the
  Kot Diji Wikipedia article both depict Kot Diji Fort, an 18th-century Talpur-era
  fortification built on a hill above the ancient mound -- not the Bronze Age
  archaeological site itself. Left the event without an image rather than use a
  visually misleading one.
- "Cemetery H Culture Marks a Late Harappan Shift" (new, 1700 BC) fills the gap between
  Mohenjo-daro's abandonment (c. 1700 BC per its own article) and the civilization's
  final fade (1300 BC) -- the original pilot data jumped straight from the Great Bath
  event to the end with no Late Harappan representation at all.

## Mongol Empire (topic id: `mongol`) — pulled 2026-08-03

Status: **existing topic, replaces current seed data** — file written to
`data/wikipedia-data/mongol.json` only; merging into the live seed and reseeding is a
separate step. Kept the existing `id` (`mongol`), `colorIndex` (4), and date range
(1206-1368) for a drop-in replacement.

The original pilot data had 5 events, all clustered around the empire's founding and its
two most famous conquests (Baghdad, Yuan China), skipping three structurally important
sub-periods entirely: the invasion of Europe (Batu Khan and Subutai reached Hungary and
Poland in 1241), the empire's first major battlefield defeat (Ain Jalut, 1260, which set
the permanent western limit of Mongol expansion), and the Toluid Civil War (1260-1264),
which is the actual mechanism by which the "Mongol Empire" stopped being one empire and
became four separate khanates. Expanded to 9 events to cover unification, the western
campaigns (Khwarazm, Europe), the empire's territorial peak and its limit (Baghdad, Ain
Jalut), its fracture into khanates, and the rise and fall of its largest successor state,
the Yuan dynasty in China.

### Topic-level source

- **Mongol Empire** — https://en.wikipedia.org/wiki/Mongol_Empire — Wikidata Q12557 —
  this article's own scope (1206-1368) matches the topic's existing date range exactly.
- The lead thumbnail is an animated GIF of the empire's yearly expansion, not usable as a
  static image. Used **Asia in 1335** instead, a public-domain map showing the empire at
  its territorial height already split into the four khanates -- a more informative single
  frame than any one year of the animation.

### Event-level sources

| Event | Year | Article | Wikidata | Image credit |
|---|---|---|---|---|
| Genghis Khan unites the Mongol tribes | 1206 | [Genghis Khan](https://en.wikipedia.org/wiki/Genghis_Khan) | Q720 | Unknown artist (Yuan imperial album portrait), digitized by National Palace Museum, Public domain |
| The invasion of Khwarazm begins | 1219 | [Mongol invasion of the Khwarazmian Empire](https://en.wikipedia.org/wiki/Mongol_invasion_of_the_Khwarazmian_Empire) | Q431177 | Coopypasted (photo of Otrar ruins), CC BY-SA 4.0 |
| Mongol cavalry crush Hungary at Mohi | 1241 | [Battle of Mohi](https://en.wikipedia.org/wiki/Battle_of_Mohi) | Q705874 | Anonymous illumination, Chronicon Pictum (Cod. 2623), Public domain |
| The Mongols sack Baghdad | 1258 | [Siege of Baghdad (1258)](https://en.wikipedia.org/wiki/Siege_of_Baghdad_(1258)) | Q369560 | Sayf al-vâhidî et al. (Rashid al-Din's Jami al-tawarikh), Public domain |
| Mamluks halt the Mongols at Ain Jalut | 1260 | [Battle of Ain Jalut](https://en.wikipedia.org/wiki/Battle_of_Ain_Jalut) | Q244356 | MapMaster (campaign map), CC BY 3.0 |
| The Toluid Civil War splits the empire | 1264 | [Toluid Civil War](https://en.wikipedia.org/wiki/Toluid_Civil_War) | Q16871984 | Miskin (Mughal-era painting), Public domain |
| Kublai Khan founds the Yuan Dynasty | 1271 | [Yuan dynasty](https://en.wikipedia.org/wiki/Yuan_dynasty) | Q7313 | Araniko (Yuan imperial album portrait), Public domain |
| The Yuan complete the conquest of Song China | 1279 | [Battle of Yamen](https://en.wikipedia.org/wiki/Battle_of_Yamen) | Q1078359 | *(none — see note below)* |
| The Yuan Dynasty falls | 1368 | [Yuan dynasty](https://en.wikipedia.org/wiki/Yuan_dynasty) | Q7313 | Unknown artist (portrait of the Hongwu Emperor), digitized by National Palace Museum, Public domain |

### Event locations

| Event | Historical name | Modern city, country | Coordinates |
|---|---|---|---|
| Genghis Khan unites the Mongol tribes | Source of the Onon River | (no city), Mongolia | 47.317, 110.65 |
| The invasion of Khwarazm begins | Otrar | Otrar, Kazakhstan | 42.853, 68.303 |
| Mongol cavalry crush Hungary at Mohi | Muhi | Muhi, Hungary | 47.978, 20.913 |
| The Mongols sack Baghdad | Baghdad | Baghdad, Iraq | 33.315, 44.366 |
| Mamluks halt the Mongols at Ain Jalut | Ain Jalut | Ein Harod, Israel | 32.551, 35.357 |
| Kublai Khan founds the Yuan Dynasty | Dadu | Beijing, China | 39.915, 116.39 |
| The Yuan complete the conquest of Song China | Yamen | Jiangmen, China | 22.27, 113.08 |
| The Yuan Dynasty falls | Dadu | Beijing, China | 39.915, 116.39 |

The Toluid Civil War has no `location` -- it's a succession conflict fought across the
empire (Kublai based at Shangdu, Ariq Böke at Karakorum, with fighting well beyond both),
not a single-site event.

### Corrections / decisions made vs. the original seed data

- Both existing events kept close to their original framing ("Genghis Khan Unites the
  Mongol Tribes," "The Mongols Sack Baghdad," "The Yuan Dynasty Falls") since the facts
  held up against sourcing -- the kurultai at the Onon River in 1206, Hulagu's 1258 siege,
  and the Ming capture of Dadu on 14 September 1368 are all well-attested. Retitled "The
  Invasion of Khwarazm Begins" only in body text, adding the specific Otrar incident
  (a seized caravan, executed merchants) that the original body left unsourced/generic.
  "Kublai Khan Founds the Yuan Dynasty" (1271) kept its year and title but was re-rated
  `major` (was `minor`) since it's a dynastic founding, matching how foundings/falls are
  rated everywhere else in this dataset.
- No usable image found for "The Yuan Complete the Conquest of Song China" (Battle of
  Yamen, 1279). The only image tagged to that article is a modern photo of a tourism
  development built on the battle site, not a period depiction or a clear historical
  photo -- left the event without an image rather than use a misleading modern one.
- Added `location` to every event except the Toluid Civil War (see above), where the
  original seed data had none.

## Aztec (Mexica) (topic id: `aztec`) — pulled 2026-08-03

Status: **existing topic, replaces current seed data** — file written to
`data/wikipedia-data/aztec.json` only; merging into the live seed and reseeding is a
separate step. Kept the existing `id` (`aztec`), `name` (`Aztec (Mexica)`), `colorIndex`
(6), and date range (1325-1521) for a drop-in replacement.

The original pilot data had 5 events spanning founding, the Triple Alliance, the Great
Temple, and the Spanish conquest, but skipped the roughly six decades of imperial
expansion between the Triple Alliance (1428) and the Great Temple's dedication (1487),
and the ~32 years between the Great Temple and Cortés's arrival (1519) — both periods
during which Tenochtitlan absorbed its last major island rival and crowned its final
independent ruler. It also went straight from "Cortés arrives" to "the city falls,"
skipping La Noche Triste (1520), the mid-conquest reversal in which the Mexica drove the
Spanish out of the city and killed Moctezuma II — arguably the most dramatic single
turning point of the whole conquest narrative, and the reason Cortés needed a second,
larger campaign in 1521 at all. Expanded to 8 events to cover the conquest of Tlatelolco
(unifying the island), Moctezuma II's coronation, and La Noche Triste, alongside the
original five.

### Topic-level source

- **Aztecs** — https://en.wikipedia.org/wiki/Aztecs — Wikidata Q12542 — this article's
  own scope ("flourished in central Mexico from about 1300 to 1521") matches the topic's
  1325-1521 range far better than "Aztec Empire," whose own scope (1428-1521) only
  covers the Triple Alliance era and would exclude the 1325 founding event entirely.
- Image: **Aztec Empire (map, 1519)** by Aldan-2, showing the empire under Moctezuma II
  at its territorial peak — sourced from the "Aztecs" article's own lead thumbnail.

### Event-level sources

| Event | Year | Article | Wikidata | Image credit |
|---|---|---|---|---|
| Tenochtitlan Is Founded | 1325 | [Tenochtitlan](https://en.wikipedia.org/wiki/Tenochtitlan) | Q13695 | Roberto Cueva del Río (painting), CC BY-SA 3.0 |
| The Triple Alliance Forms | 1428 | [Aztec Empire](https://en.wikipedia.org/wiki/Aztec_Empire) | Q2608489 | XcepticZP & Goldenbrook (glyph diagram), Public domain |
| Axayacatl Conquers Tlatelolco | 1473 | [Tlatelolco (altepetl)](https://en.wikipedia.org/wiki/Tlatelolco_(altepetl)) | Q796925 | Codex Mendoza illustration, Public domain |
| The Great Temple Is Dedicated | 1487 | [Templo Mayor](https://en.wikipedia.org/wiki/Templo_Mayor) | Q774021 | GAED (photo), CC BY-SA 3.0 |
| Moctezuma II Becomes Tlatoani | 1502 | [Moctezuma II](https://en.wikipedia.org/wiki/Moctezuma_II) | Q141791 | Codex Durán illustration, Public domain |
| Cortés Arrives on the Coast | 1519 | [Hernán Cortés](https://en.wikipedia.org/wiki/Hern%C3%A1n_Cort%C3%A9s) | Q7326 | Unknown artist (Museo de América portrait), Public domain |
| The Spanish Are Driven Out on La Noche Triste | 1520 | [La Noche Triste](https://en.wikipedia.org/wiki/La_Noche_Triste) | Q1308854 | Anonymous 17th-century painting, Public domain |
| The Fall of Tenochtitlan | 1521 | [Fall of Tenochtitlan](https://en.wikipedia.org/wiki/Fall_of_Tenochtitlan) | Q593267 | Bernardino de Sahagún (Florentine Codex), Public domain |

### Event locations

| Event | Historical name | Modern city, country | Coordinates |
|---|---|---|---|
| Tenochtitlan Is Founded | Tenochtitlan | Mexico City, Mexico | 19.433, -99.133 |
| Axayacatl Conquers Tlatelolco | Tlatelolco | Mexico City, Mexico | 19.451, -99.138 |
| The Great Temple Is Dedicated | Templo Mayor, Tenochtitlan | Mexico City, Mexico | 19.433, -99.133 |
| Moctezuma II Becomes Tlatoani | Tenochtitlan | Mexico City, Mexico | 19.433, -99.133 |
| Cortés Arrives on the Coast | Veracruz | Veracruz, Mexico | 19.190, -96.153 |
| The Spanish Are Driven Out on La Noche Triste | Tenochtitlan (the Tacuba causeway) | Mexico City, Mexico | 19.433, -99.133 |
| The Fall of Tenochtitlan | Tenochtitlan | Mexico City, Mexico | 19.433, -99.133 |

The Triple Alliance's formation has no `location` -- it's a treaty between three
separate city-states (Tenochtitlan, Texcoco, Tlacopan), not a single-site event.

### Corrections / decisions made vs. the original seed data

- All three original event years (1325, 1428, 1487) held up against sourcing --
  Tenochtitlan's traditional founding date, the 1428 Tepanec war that produced the
  Triple Alliance, and the Templo Mayor's 19 December 1487 dedication under Ahuitzotl
  are all well-attested (the exact ceremony date came from the Templo Mayor article's
  discussion of the Aztec calendar; the original body's vaguer "near the height of its
  power" framing was kept since the article didn't corroborate a specific attendance or
  sacrifice figure -- several widely circulated numbers for this ceremony trace to a
  colonial-era chronicler and are considered exaggerated by modern historians, so no
  number was added).
- **"The Triple Alliance Forms" re-rated `major` (was `minor`)** -- Wikipedia's own
  "Aztec Empire" article defines the empire as beginning with this alliance, so treating
  its formation as more significant than a supporting detail matches how foundings are
  rated everywhere else in this dataset (same reasoning as the Mongol topic's Kublai
  Khan / Yuan dynasty re-rating).
- "Cortés Arrives on the Coast" gained the specific detail that he founded Veracruz and
  fought before allying with Tlaxcala, replacing the original's generic "rivals of the
  Aztecs." The `location` used is the modern city of Veracruz; Cortés's actual 1519
  landing/founding site (Villa Rica de la Vera Cruz, near modern La Antigua) was a few
  miles away and the city was later relocated to its current site in 1599 -- treated as
  the same place for this purpose, consistent with how this dataset handles other
  historical-name/modern-site pairs.
- "The Fall of Tenochtitlan" kept its year and title but the body was corrected: the
  smallpox epidemic (which killed the previous emperor Cuitláhuac) struck in late 1520,
  months before the 1521 siege itself, rather than during it as the original body's
  phrasing ("a smallpox epidemic that devastates the city") implied alongside the siege.
  Reworded to describe the epidemic as having already happened by the time of capture.

## Ottoman Empire (topic id: `ottoman`) — pulled 2026-08-03

Status: **merged into live seed data 2026-08-03** (`backend/src/history_zoomout/db/seed_data/civilizations.json`, new topic — not previously present) and reseeded. `colorIndex: 1` continues the color cycle (16 existing topics run through indices 1–8 twice; this is the first entry of a third cycle).

New topic covering the full 623-year span (1299–1922) from Osman I's founding beylik
through the empire's classical-age peak under Suleiman the Magnificent, its 17th-century
military reversal at Vienna, its long 18th–19th century retreat and reform era, and its
formal end with the 1922 abolition of the sultanate.

### Topic-level source

- **Ottoman Empire** — https://en.wikipedia.org/wiki/Ottoman_Empire — Wikidata Q12560
  - The article's own lead thumbnail is a late flag, not very illustrative. Used
    `File:OttomanEmpireMain.png` instead — a map of the empire's territorial extent in
    1683, sourced from the article body — since it's a much stronger visual match for a
    civilization-scale topic than a flag icon.

### Event-level sources

| Event | Year | Article | Wikidata | Image credit |
|---|---|---|---|---|
| Osman I founds the Ottoman beylik | 1299 | [Osman I](https://en.wikipedia.org/wiki/Osman_I) | Q83100 | Ottoman miniature painting, Public domain |
| Mehmed II conquers Constantinople | 1453 | [Fall of Constantinople](https://en.wikipedia.org/wiki/Fall_of_Constantinople) | Q160077 | DimiTalen, CC0 |
| Suleiman the Magnificent besieges Vienna | 1529 | [Siege of Vienna (1529)](https://en.wikipedia.org/wiki/Siege_of_Vienna_(1529)) | Q207576 | Bartel Beham (engraving), Public domain |
| Holy League destroys the Ottoman fleet at Lepanto | 1571 | [Battle of Lepanto](https://en.wikipedia.org/wiki/Battle_of_Lepanto) | Q165425 | Laureys a Castro (painting), Public domain |
| The Ottomans are routed at the Battle of Vienna | 1683 | [Battle of Vienna](https://en.wikipedia.org/wiki/Battle_of_Vienna) | Q200855 | Anonymous painter, Museum of Military History Vienna, Public domain |
| Treaty of Karlowitz ends the Great Turkish War | 1699 | [Treaty of Karlowitz](https://en.wikipedia.org/wiki/Treaty_of_Karlowitz) | Q192303 | O.Mustafin, CC0 |
| Edict of Gülhane launches the Tanzimat reforms | 1839 | [Tanzimat](https://en.wikipedia.org/wiki/Tanzimat), [Edict of Gülhane](https://en.wikipedia.org/wiki/Edict_of_G%C3%BClhane), [Abdülmecid I](https://en.wikipedia.org/wiki/Abd%C3%BClmecid_I) | Q330961 | David Wilkie (painting), Public domain |
| Young Turk Revolution restores the constitution | 1908 | [Young Turk Revolution](https://en.wikipedia.org/wiki/Young_Turk_Revolution) | Q4298662 | Charles Roden Buxton, Public domain |
| Grand National Assembly abolishes the sultanate | 1922 | [Abolition of the Ottoman sultanate](https://en.wikipedia.org/wiki/Abolition_of_the_Ottoman_sultanate) | Q3809270 | Unknown author, Public domain |

Image note: the Tanzimat article's own lead image (an 1877 parliament photo) postdates
the 1839 edict by decades, and the Edict of Gülhane article's thumbnail is the same
mismatched photo. Used a portrait of Sultan Abdülmecid I (from his own article) instead,
since he's the figure who actually proclaimed the edict.

### Event locations

| Event | Historical name | Modern city, country | Coordinates |
|---|---|---|---|
| Osman I founds the beylik | Söğüt | Söğüt, Turkey | 40.019, 30.181 |
| Mehmed II conquers Constantinople | Constantinople | Istanbul, Turkey | 41.014, 28.955 |
| Siege of Vienna (1529) | Vienna | Vienna, Austria | 48.208, 16.373 |
| Battle of Lepanto | Lepanto | Nafpaktos, Greece | 38.394, 21.831 |
| Battle of Vienna (1683) | Vienna | Vienna, Austria | 48.208, 16.373 |
| Treaty of Karlowitz | Karlowitz | Sremski Karlovci, Serbia | 45.203, 19.934 |
| Edict of Gülhane / Tanzimat | Constantinople | Istanbul, Turkey | 41.014, 28.955 |
| Young Turk Revolution | Monastir | Bitola, North Macedonia | 41.032, 21.335 |
| Abolition of the sultanate | Constantinople | Istanbul, Turkey | 41.014, 28.955 |

Note on city naming: "Constantinople" is used as the `historicalName` for all four
Istanbul-based events, including the two 19th/20th-century ones (1839, 1922) — the city
wasn't officially renamed to Istanbul until the 1930 Republic-era reform, so
"Constantinople" remained the common English/diplomatic name throughout the entire
Ottoman period, not just before 1453.

### Decisions / judgment calls

- **Karlowitz (1699) and the Young Turk Revolution (1908) rated `minor`.** Both are
  real turning points, but each sits alongside a `major`-rated event that already
  captures the same inflection (Karlowitz formalizes the retreat already marked by the
  1683 Vienna defeat; the 1908 revolution is a domestic constitutional shift rather than
  a founding/fall/decisive-battle event on the scale of the other `major` entries).
- **No separate Suleiman-the-Magnificent "peak" event.** The 1529 Siege of Vienna event
  covers the empire's classical-age high-water mark under Suleiman directly, so a
  second, separate "reign of Suleiman" entry would have been redundant with it.
- **Siege of Vienna (1529) duration given as "18 days"** rather than the vaguer "under
  three weeks" — the article gives exact dates (27 September – 15 October 1529), so the
  precise figure was used instead of an approximation.
- Kept full diacritics in the JSON itself (Söğüt, Gülhane, Abdülmecid, Topkapı),
  matching how this dataset already handles non-English names elsewhere (e.g. persia's
  `Şanlıurfa`, rome's `İzmit`, japan's `Tōdai-ji`/`Ōnin`) rather than transliterating to
  ASCII.

## Maya (topic id: `maya`) — pulled 2026-08-03

Status: **merged into live seed data 2026-08-03** (`backend/src/history_zoomout/db/seed_data/civilizations.json`, replacing the old 5-event entry wholesale) and reseeded. The
old entry had 5 events (250-909 AD, Classic Period only) with no sources, images, or
wikidata ids — a pre-enrichment placeholder like the original Persia pilot.

User confirmed expanding the date range to the civilization's full documented span
(c. 2000 BC – 1697 AD) rather than keeping the Classic-only 250-909 window, since the
Preclassic origins and Postclassic/Spanish-conquest era are both well documented on
Wikipedia. `colorIndex: 8` kept unchanged from the existing entry so a merge is a
drop-in replacement.

Covers three sub-periods: Preclassic (c. 2000 BC – 250 AD, first cities and monumental
architecture at Nakbe and El Mirador), Classic (250-909 AD, the rival city-state era —
kept the existing 5 events, verified and enriched with sources/images), and Postclassic
(909-1697 AD, the shift north to Chichen Itza and Mayapan, ending with the Spanish
conquest).

### Topic-level source

- **Maya civilization** — https://en.wikipedia.org/wiki/Maya_civilization — Wikidata
  Q28567
  - The article's own lead thumbnail (`Mayamap.png`) is a plain map, not very
    illustrative. Used `File:Tikal_Temple1_2006_08_11.JPG` (Tikal Temple I, the "Great
    Jaguar" pyramid) instead — a more recognizable visual signature for the civilization
    as a whole, and distinct from every per-event image so the topic image doesn't
    duplicate any event's.

### Event-level sources

| Event | Year | Article | Wikidata | Image credit |
|---|---|---|---|---|
| Monumental construction begins at Nakbe | c. 750 BC | [Nakbe](https://en.wikipedia.org/wiki/Nakbe) | Q1964016 | Simon Burchell, CC BY-SA 4.0 |
| El Mirador rises as the first great Maya city | c. 300 BC | [El Mirador](https://en.wikipedia.org/wiki/El_Mirador) | Q504904 | Konjiki1, CC0 |
| Preclassic Maya cities collapse | 150 AD | [El Mirador](https://en.wikipedia.org/wiki/El_Mirador) | Q504904 | Authenticmaya, CC BY-SA 2.5 |
| The Classic Period begins | 250 AD | [Tikal](https://en.wikipedia.org/wiki/Tikal) | Q181172 | Mundo Maya, CC BY-SA 4.0 |
| Teotihuacan's entrada remakes Tikal | 378 AD | [Tikal](https://en.wikipedia.org/wiki/Tikal) | Q181172 | Greg Willis, CC BY-SA 2.0 (Stela 31) |
| Pakal ascends the throne at Palenque | 615 AD | [Kʼinich Janaabʼ Pakal](https://en.wikipedia.org/wiki/K%CA%BCinich_Janaab%CA%BC_Pakal) | Q371384 | Gary Todd, CC0 |
| Quiriguá captures and sacrifices Copán's king | 738 AD | [Quiriguá](https://en.wikipedia.org/wiki/Quirigu%C3%A1) | Q318422 | Jan Pešula, CC BY 2.5 (Stela E) |
| The last Long Count date is carved | 909 AD | [Toniná](https://en.wikipedia.org/wiki/Tonin%C3%A1) | Q1042074 | J. Antonio Cruz Coutiño, CC BY-SA 4.0 |
| Chichen Itza rises to dominate the Yucatán | 950 AD | [Chichen Itza](https://en.wikipedia.org/wiki/Chichen_Itza) | Q5859 | Daniel Schwen, CC BY-SA 4.0 |
| Mayapan becomes the Yucatán's new capital | 1220s | [Mayapan](https://en.wikipedia.org/wiki/Mayapan) | Q567966 | SiMeCaIS, CC BY-SA 3.0 |
| Mayapan collapses, fragmenting the Yucatán | 1441 | [Mayapan](https://en.wikipedia.org/wiki/Mayapan) | Q567966 | Pavel Vorobiev, CC BY-SA 3.0 |
| Nojpetén falls, ending independent Maya rule | 1697 | [Nojpetén](https://en.wikipedia.org/wiki/Nojpet%C3%A9n) | Q1577053 | Rafael Amado Deras, CC BY 2.0 |

Image note: the Stela E used for the 738 AD event wasn't erected until 771 — it's a later
victory monument raised by the same king (Kʼakʼ Tiliw Chan Yopaat) commemorating his
reign following the Copán conquest, not a depiction of the 738 event itself, since no
image of the event's own year was found. Noted here rather than presented as
contemporary.

### Event locations

| Event | Historical name | Modern city, country | Coordinates |
|---|---|---|---|
| Nakbe | Nakbe | —, Guatemala | not found |
| El Mirador rises | El Mirador | —, Guatemala | 17.755, -89.921 |
| Preclassic collapse | El Mirador | —, Guatemala | 17.755, -89.921 |
| Classic Period begins | — | — | omitted (names two city-states, Tikal and Calakmul; no single place) |
| Teotihuacan's entrada | Yax Mutal | Tikal, Guatemala | 17.222, -89.624 |
| Pakal ascends | Lakamha | Palenque, Mexico | 17.484, -92.046 |
| Quiriguá captures Copán's king | Quiriguá | Quiriguá, Guatemala | 15.269, -89.040 |
| Last Long Count date | Toniná | Toniná, Mexico | 16.901, -92.010 |
| Chichen Itza rises | Chichen Itza | Chichen Itza, Mexico | 20.683, -88.569 |
| Mayapan founded / collapses | Mayapan | Telchaquillo, Mexico | not found |
| Nojpetén falls | Nojpetén | Flores, Guatemala | 16.930, -89.892 |

Nakbe and Mayapan have no coordinates on Wikipedia (checked the site article and, for
Mayapan, the nearest named modern town, Telchaquillo — neither has a coordinates
property); `city`/`country` filled in from article text per the skill's fallback
guidance, `latitude`/`longitude` left `null` rather than guessed.

### Corrections / decisions

- **Date range expanded from 250-909 AD to 2000 BC – 1697 AD**, per user confirmation —
  the existing seed data only covered the Classic Period. This is the same kind of gap
  the Persia pilot caught (missing the entire Parthian era): the old Maya entry skipped
  the Preclassic origins and the entire five-centuries-long Postclassic era, including
  the civilization's actual end (the 1697 fall of Nojpetén to Spain).
- **378 AD event retitled and rewritten for accuracy.** The existing body ("A political
  upheaval at Tikal, linked to contact with... Teotihuacan, installs a new ruling
  dynasty") understated what happened: Tikal's king was killed the same day a
  Teotihuacan-backed general arrived, and a new Teotihuacan-aligned king was installed
  within the year — a foreign-backed regime change (the "entrada"), not a vague
  "upheaval." Retitled from "Teotihuacan's Influence Reaches Tikal" to "Teotihuacan's
  Entrada Remakes Tikal" and rewrote the body with the verified sequence of events.
  Years (378/379) and Stela 31 as the depicting monument were both confirmed against the
  Tikal article.
- **738 AD event (Quiriguá/Copán) kept at `sig: "minor"`**, matching the existing
  rating — enriched the body with the verified beheading detail (3 May 738) and added
  sources/image, but didn't re-judge its significance rating per the skill's guidance
  not to feel obliged to harmonize events not otherwise being changed.
- **250, 615, 909 AD events (Classic Period Begins, Pakal Ascends, Last Long Count)
  verified as-is** — all facts in the existing bodies (Tikal/Calakmul peak era; Pakal's
  age-12 accession and 68-year reign; Toniná Monument 101 as the last Long Count
  inscription) checked out against Wikipedia. Only added sources, images, wikidata ids,
  and locations; body text essentially unchanged.
- **Diacritics kept** (Quiriguá, Copán, Toniná, Nojpetén, Petén, Yucatán, Martín de
  Ursúa), matching the Ottoman/Persia/Rome/Japan precedent of preserving native spelling
  rather than transliterating to ASCII. "Chichen Itza" and "Mayapan" kept unaccented
  since those are the actual English Wikipedia article titles for those two sites
  (inconsistently, some file captions on Commons do accent them, but the article titles
  themselves don't).

## Vikings (Norse) (topic id: `vikings`) — pulled 2026-08-03

Status: **merged into live seed data 2026-08-03** (`backend/src/history_zoomout/db/seed_data/civilizations.json`, new topic — not previously present) and reseeded. `colorIndex: 2` is the next unused value continuing the color rotation's third cycle (ottoman = 1, the first entry of that cycle).

New topic covering the full 273-year span conventionally called the Viking Age
(793–1066), from the raid on Lindisfarne through Norse expansion and settlement across
Ireland, Francia, Rus', the North Atlantic, Denmark, and Norway, ending at the Battle of
Stamford Bridge. Deliberately not framed around a single Scandinavian state -- unlike
every other topic in this file, the Vikings never had one capital or ruling dynasty --
so events span the full diaspora (Dublin, Novgorod, Rouen, Reykjavík, Vinland, Jelling,
London) rather than one region's political succession.

### Topic-level source

- **Viking Age** — https://en.wikipedia.org/wiki/Viking_Age — Wikidata Q213649
- Image: a Viking-age picture stone from Smiss, Gotland, sourced from the "Viking Age"
  article's own lead thumbnail — chosen over a map since it's a genuine period artifact
  rather than a modern-drawn overlay.

### Event-level sources

| Event | Year | Article | Wikidata | Image credit |
|---|---|---|---|---|
| Vikings raid the monastery at Lindisfarne | 793 | [Viking raid on Lindisfarne](https://en.wikipedia.org/wiki/Viking_raid_on_Lindisfarne) | *(none found)* | Eadfrith of Lindisfarne (attributed), Public domain |
| Vikings found a longphort at Dublin | 841 | [Dublin](https://en.wikipedia.org/wiki/Dublin) | *(none found)* | Yorkshirian (map), CC BY-SA 3.0 |
| Rurik founds the Rus' state at Novgorod | 862 | [Rurik](https://en.wikipedia.org/wiki/Rurik) | Q7990 | Дар Ветер, CC BY-SA 3.0 |
| The Great Heathen Army invades England | 865 | [Great Heathen Army](https://en.wikipedia.org/wiki/Great_Heathen_Army) | Q1419965 | Hel-hama (map), CC BY-SA 3.0 |
| Harald Fairhair unifies Norway at Hafrsfjord | 872 | [Battle of Hafrsfjord](https://en.wikipedia.org/wiki/Battle_of_Hafrsfjord) | Q515561 | Ole Peter Hansen Balling (painting), Public domain |
| Ingólfr Arnarson settles Iceland | 874 | [Settlement of Iceland](https://en.wikipedia.org/wiki/Settlement_of_Iceland) | Q2725768 | Oscar Wergeland (painting), Public domain |
| Rollo founds the Duchy of Normandy | 911 | [Rollo](https://en.wikipedia.org/wiki/Rollo) | Q273773 | Unknown artist (medieval roll), Public domain |
| Harald Bluetooth Christianizes Denmark | 965 | [Harald Bluetooth](https://en.wikipedia.org/wiki/Harald_Bluetooth) | Q201041 | Alicudi (photo of the Jelling stones), CC BY-SA 3.0 |
| Leif Erikson reaches Vinland | 1000 | [Leif Erikson](https://en.wikipedia.org/wiki/Leif_Erikson) | Q42838 | Dylan Kereluk (photo, L'Anse aux Meadows), CC BY 2.0 |
| Cnut becomes King of England | 1016 | [Cnut](https://en.wikipedia.org/wiki/Cnut) | Q134128 | Unknown artist (Liber Vitae, 1031), Public domain |
| The Battle of Stamford Bridge ends the Viking Age | 1066 | [Battle of Stamford Bridge](https://en.wikipedia.org/wiki/Battle_of_Stamford_Bridge) | Q203225 | Matthew Paris (13th-c. illustration), Public domain |

### Event locations

| Event | Historical name | Modern city, country | Coordinates |
|---|---|---|---|
| Vikings raid Lindisfarne | Lindisfarne | Holy Island, United Kingdom | 55.68, -1.803 |
| Vikings found Dublin | Dyflin | Dublin, Ireland | 53.35, -6.260 |
| Rurik founds the Rus' state | Novgorod | Veliky Novgorod, Russia | 58.55, 31.267 |
| Great Heathen Army invades England | — | *(no single site)* | — |
| Harald Fairhair unifies Norway | Hafrsfjord | Stavanger, Norway | 58.97, 5.731 |
| Ingólfr Arnarson settles Iceland | Reykjarvík | Reykjavík, Iceland | 64.146, -21.943 |
| Rollo founds Normandy | Rouen | Rouen, France | 49.443, 1.089 |
| Harald Bluetooth Christianizes Denmark | Jelling | Jelling, Denmark | 55.754, 9.415 |
| Leif Erikson reaches Vinland | Vinland | L'Anse aux Meadows, Canada | 51.596, -55.533 |
| Cnut becomes King of England | London | London, United Kingdom | 51.507, -0.128 |
| Battle of Stamford Bridge | Stamford Bridge | Stamford Bridge, United Kingdom | 53.993, -0.913 |

"The Great Heathen Army Invades England" has no `location` -- the army landed in East
Anglia and campaigned across multiple Anglo-Saxon kingdoms over several years, with no
single site standing in for the whole invasion, unlike every other event in this topic.

### Corrections / decisions made

- **No single "founding" or "fall" event, unlike every other civilization topic here.**
  The Vikings never coalesced into one state -- events instead trace the diaspora's
  major footholds (Ireland, Rus', Normandy, Iceland, Vinland) alongside the unification
  of Norway and Denmark as individual kingdoms. 793 (Lindisfarne) and 1066 (Stamford
  Bridge) are used as the conventional start/end bookends of the "Viking Age" as a
  cultural-historical period, per the Viking Age article's own framing, rather than any
  single polity's founding and collapse.
- **No Wikidata item found for the Lindisfarne raid or the Dublin longphort founding**
  specifically. "Viking raid on Lindisfarne" is a real, distinct English Wikipedia
  article (not just a redirect target) but carries no linked Wikidata item; Dublin's
  841 founding is documented on the "Dublin" article's own history section, but the
  only nearby Wikidata item ("Kingdom of Dublin," Q436994) covers the later 853–1170
  polity, not the initial 841 camp -- left both `wikidataId` fields null rather than
  pointing at a mismatched item, consistent with the pattern used elsewhere in this
  dataset (e.g. Persia's Achaemenid fall, Maya's Kot Diji).
- **Battle of Hafrsfjord's year is disputed.** Harald Fairhair's own article and popular
  tradition date the battle to 872, but the Battle of Hafrsfjord article itself is more
  cautious, giving a range of "sometime between 872 and 900." Used 872, the traditional
  and far more commonly cited date, matching how this dataset has handled other
  disputed-date events (e.g. Japan's Kamakura shogunate founding, 1185 vs. 1192).
- **Harald Bluetooth's conversion/Jelling stone year given as "965.**" The Harald
  Bluetooth article itself only says "around the 960s" without a precise year; 965 is
  the commonly cited figure elsewhere and was kept as a reasonable circa date within
  that range, the same approach used for Ashurbanipal's library (Mesopotamia) and
  Persepolis's construction start (Persia).
- **Leif Erikson's year (1000) vs. the L'Anse aux Meadows tree-ring date (1021).** The
  sagas give no exact year for Leif's own voyage, only "c. 1000" by scholarly
  convention; a 2021 tree-ring study precisely dated Norse-worked wood at L'Anse aux
  Meadows to 1021, but that dates the site's occupation broadly, not necessarily Leif's
  own specific landfall. Kept the event at the traditional c. 1000 date and used the
  1021 dating only as corroborating evidence of Norse presence in the body text, rather
  than replacing the year outright.
- **Cnut's event uses 1016 (accepted as king after Edmund Ironside's death), not 1017
  (his formal coronation in London)** -- matches how the Cnut article's own summary
  describes his reign as "King of England from 1016." Noted here since the coronation
  itself happened the following year.
- **Image swapped from a modern statue to a site photo for Leif Erikson.** The REST
  summary's own thumbnail was a Leif Erikson statue in Duluth, Minnesota (a 20th-century
  American memorial); used a photo of the reconstructed Norse longhouse at L'Anse aux
  Meadows instead, a real archaeological site tied directly to the event rather than a
  later monument.
- **Image swapped from a manuscript page to a battle painting for Harald Fairhair.**
  Switched the source article itself from the person (Harald Fairhair) to the specific
  event (Battle of Hafrsfjord), since that article's own lead image -- a 19th-century
  painting of the battle -- was a stronger visual match than the Flateyjarbók
  manuscript page found via the person's article.

## Mughal Empire (topic id: `mughal`) — pulled 2026-08-03

Status: **merged into live seed data 2026-08-03** (`backend/src/history_zoomout/db/seed_data/civilizations.json`, new topic — not previously present) and reseeded. `colorIndex: 3` is the next unused value continuing the
color rotation's third cycle (ottoman = 1, vikings = 2). Covers the empire's full
1526–1857 span, matching Wikipedia's own infobox dates for "Mughal Empire" rather than
the narrower 1526–1707 "peak era" some accounts use.

Ten events trace: the founding conquest, the ~15-year Sur Interregnum that briefly
ended Mughal rule entirely, Akbar's restoration and consolidation, his religious
policy, the East India Company's first foothold under Jahangir, the empire's cultural
peak (Taj Mahal) and territorial peak (Aurangzeb's Deccan conquests) under Shah Jahan
and Aurangzeb, the Persian sack of Delhi that broke the empire's wealth, the Battle of
Plassey that started British political dominance, and the 1857 Rebellion that ended
the dynasty.

### Topic-level source

- **Mughal Empire** — https://en.wikipedia.org/wiki/Mughal_Empire — Wikidata Q33296
- The article's own lead thumbnail is a period map (`Joppen1907India1700a.jpg`, from an
  1907 historical atlas) showing the empire's extent circa 1700 alongside European
  trading posts — used as-is since it's a genuinely informative period map, not a
  generic flag or portrait.

### Event-level sources

| Event | Year | Article | Wikidata | Image credit |
|---|---|---|---|---|
| Babur founds the Mughal Empire at Panipat | 1526 | [First Battle of Panipat](https://en.wikipedia.org/wiki/First_Battle_of_Panipat) | Q605321 | Baburnama manuscript painting, Public domain |
| Sher Shah Suri defeats Humayun (Sur Interregnum begins) | 1540 | [Battle of Kannauj](https://en.wikipedia.org/wiki/Battle_of_Kannauj) | Q108485662 | Tarikh-i-Khandan-i-Timuriya manuscript painting, Public domain |
| Akbar wins the Second Battle of Panipat | 1556 | [Second Battle of Panipat](https://en.wikipedia.org/wiki/Second_Battle_of_Panipat) | Q233414 | Kankar (Akbarnama painting), Public domain |
| Akbar promulgates the Din-i-Ilahi | 1582 | [Din-i Ilahi](https://en.wikipedia.org/wiki/Din-i_Ilahi) | Q2347558 | Unknown artist (MFA Boston portrait), Public domain |
| Thomas Roe's embassy gives the English a foothold at Surat | 1615 | [Thomas Roe](https://en.wikipedia.org/wiki/Thomas_Roe) | Q983131 | After Michiel Jansz. van Mierevelt, Public domain |
| Shah Jahan commissions the Taj Mahal | 1632 | [Taj Mahal](https://en.wikipedia.org/wiki/Taj_Mahal) | Q9141 | Yann Forget, ed. Jim Carter, CC BY-SA 4.0 |
| Aurangzeb conquers Golconda (greatest extent) | 1687 | [Siege of Golconda](https://en.wikipedia.org/wiki/Siege_of_Golconda) | Q16931432 | Anne S.K. Brown Military Collection, Public domain |
| Nader Shah sacks Delhi | 1739 | [Nader Shah's invasion of India](https://en.wikipedia.org/wiki/Nader_Shah's_invasion_of_India) | Q6957844 | Unknown artist (Red Fort painting, c. 1739), Public domain |
| The British win Bengal at Plassey | 1757 | [Battle of Plassey](https://en.wikipedia.org/wiki/Battle_of_Plassey) | Q203233 | Francis Hayman, Public domain |
| The Mughal Empire ends with the 1857 Rebellion | 1857 | [Bahadur Shah Zafar](https://en.wikipedia.org/wiki/Bahadur_Shah_Zafar) | Q127369 | Unknown photographer, Public domain |

### Event locations

| Event | Historical name | Modern city, country | Coordinates |
|---|---|---|---|
| Babur founds the empire | Panipat | Panipat, India | 29.388, 76.97 |
| Sher Shah Suri defeats Humayun | Kannauj | Kannauj, India | 27.07, 79.92 |
| Akbar wins the Second Battle of Panipat | Panipat | Panipat, India | 29.388, 76.97 |
| Akbar promulgates the Din-i-Ilahi | Fatehpur Sikri | Fatehpur Sikri, India | 27.091, 77.661 |
| Thomas Roe's embassy | Agra | Agra, India | 27.18, 78.02 |
| Taj Mahal commissioned | Agra | Agra, India | 27.18, 78.02 |
| Aurangzeb conquers Golconda | Golconda | Hyderabad, India | 17.383, 78.401 |
| Nader Shah sacks Delhi | Delhi | Delhi, India | 28.61, 77.23 |
| Battle of Plassey | Palashi | Palashi, India | 23.8, 88.25 |
| 1857 Rebellion ends the empire | Delhi | Delhi, India | 28.61, 77.23 |

### Corrections / decisions made

- N/A — this is a brand-new topic, not a replacement of existing seed data.
- **No usable thumbnail found for the Battle of Kannauj article itself** (its REST
  summary returned no `thumbnail.source`). Used a Sher Shah Suri court portrait from
  the Tarikh-i-Khandan-i-Timuriya manuscript instead, sourced via the "Sher Shah Suri"
  article. That file carries no `Artist`/`ImageDescription` in its extmetadata (only a
  license and object name) — `imageDescription` left `null` per the skill's guidance
  not to invent one, consistent with Persia's Achaemenid-fall and Maya's Kot Diji
  precedent for missing/unusable image detail.
- **"Thomas Roe's Embassy" event body reflects that his mission was a partial
  success, not a triumph.** The Jahangir article states plainly that "no major trading
  privileges were conceded" — the concrete outcome was permission for one factory at
  Surat, not a sweeping charter. Framed the event around that more accurate, more
  modest result rather than overstating it, since it's still the seed of the East
  India Company's eventual presence.
- **"Nader Shah Sacks Delhi" (1739) image swapped from the REST summary's default
  thumbnail to a different Commons file.** The REST-summary thumbnail URL
  (`Nadir_Shah_at_the_sack_of_delhi_-_Battle_scene...jpg`) 404'd against both
  Wikipedia's and Commons' `imageinfo` API under that exact filename — the live file on
  Commons uses "Abd-Bayg" without the space present in the REST summary's title.
  Rather than chase the exact-match filename, used a different, better-fitting image
  from the same article's own image list: a c. 1739 painting of Nader Shah enthroned in
  Delhi's Red Fort, which depicts the event's actual location more directly than a
  generic battle scene.
- **"Aurangzeb Conquers Golconda" used for the empire's "greatest extent" marker**,
  rather than his 1658 accession or the Bijapur conquest a year earlier (1686). The
  Aurangzeb article doesn't cite one specific year for peak territorial extent, but
  Golconda (1687) was his last conquest of an independent Deccan sultanate and is the
  conventional endpoint historians cite for "the empire's largest extent" — chosen over
  Bijapur since it's the culmination of the same campaign, not a mid-point.
- **1857, not 1858, used for the Mughal Empire's end event**, matching the 1526–1857
  span Wikipedia's own infobox gives for the empire as a whole. Bahadur Shah II was
  actually captured 20 September 1857 but not tried (April 1858) or exiled to Rangoon
  (7 October 1858) until the following year — the body text notes the later trial/exile
  without shifting the event's year away from the conventional 1857 boundary.
- Diacritics omitted (Nader Shah rather than Nāder Shāh, etc.), matching how the
  English Wikipedia article titles themselves are spelled — consistent with Maya's
  precedent of following actual article-title spelling rather than always maximally
  diacritic-preserving.
