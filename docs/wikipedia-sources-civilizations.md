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

### Tag enrichment — 2026-08-04

Targeted every tag that was at zero or thin for Persia (per `docs/wikipedia-tags.md`):
`art`, `governance`, `rebellion`, and `science` had no events at all; `religion` had
only one. `battle` was already carrying 9 of the original 10 events, so no new events
were added there. Four events added, merged into the existing `events[]` and re-sorted
chronologically; the previously-merged events' `tags` (already live in
`backend/src/history_zoomout/db/seed_data/civilizations.json` since the tags feature
shipped, but missing from this file, which predates that merge) were also backfilled
here so this file matches what's actually live.

| Event | Year | Article | Wikidata | Tags | Image credit |
|---|---|---|---|---|---|
| Darius I suppresses rebellions, carves the Behistun Inscription | 521 BC | [Behistun inscription](https://en.wikipedia.org/wiki/Behistun_inscription) | Q180012 | rebellion, governance | Patrick C (Pentocelo), CC BY-SA 2.0 |
| The Ionian Revolt challenges Persian rule | 499 BC | [Ionian Revolt](https://en.wikipedia.org/wiki/Ionian_Revolt) | Q208261 | rebellion | Eric Gaba & MinisterForBadTimes (map), CC BY-SA 3.0 |
| Shapur I founds the Academy of Gondishapur | 270 AD | [Academy of Gondishapur](https://en.wikipedia.org/wiki/Academy_of_Gondishapur) | Q414464 | science | Alireza.heydear, CC BY-SA 4.0 |
| Khosrow II commissions the grand reliefs at Taq-e Bostan | c. 600 AD | [Taq-e Bostan](https://en.wikipedia.org/wiki/Taq-e_Bostan) | Q940045 | art, religion | جواد, CC BY-SA 3.0 |

Locations:

| Event | Historical name | Modern city, country | Coordinates |
|---|---|---|---|
| Behistun Inscription | Behistun | Bisotun, Iran | 34.391, 47.436 |
| Ionian Revolt | Miletus | Balat, Turkey | 37.530, 27.278 |
| Academy of Gondishapur | Gondishapur | Dezful, Iran | 32.283, 48.517 |
| Taq-e Bostan reliefs | Taq-e Bostan | Kermanshah, Iran | 34.388, 47.132 |

Notes and judgment calls:

- **Behistun year**: the inscription/relief itself wasn't carved on one single day; the
  campaign it documents ran through 522–521 BC ending in nineteen battles by December
  521 BC. Used 521 BC as the event year (the campaign's conclusion / when the record was
  made), not 522 BC (when Darius took the throne).
- **Behistun tags**: `governance` alongside `rebellion` because the inscription is as
  much a legitimacy/administrative record — Darius justifying and documenting his rule —
  as it is a chronicle of the revolts themselves.
- **Ionian Revolt tags**: deliberately left off `battle` despite real battles occurring
  (Battle of Lade, 494 BC) — `battle` was already carrying 9/10 of Persia's events, and
  the revolt's defining feature for this pass is the uprising itself, not a single named
  battle the way Thermopylae or Carrhae are.
- **Gondishapur year**: Wikipedia gives a range (240–270 AD, Shapur I's reign) rather
  than a precise founding date; used 270 AD (the end of that range) to avoid colliding
  with the existing 260 AD Valerian-capture event, while staying within the sourced
  window and after Shapur I's Antioch/Roman POW campaigns that populated the city.
- **Taq-e Bostan year**: the site's large reliefs are usually attributed to Khosrow II's
  reign (590–628 AD) without one precise carving date; used 600 AD as an approximate
  mid-reign placeholder. (The site also has separate, more precisely dated 4th-century
  investiture reliefs of Ardashir II and Shapur III — used the Khosrow II reliefs instead
  since they're the more famous, more extensively described set.)
- **Taq-e Bostan image**: used a photo of the equestrian relief of Khosrow II in armor
  rather than a general site photo, since it's a specific, recognizable piece of the
  carving rather than a wide establishing shot.

### Tag enrichment — 2026-08-04 (round 2: religion/Zoroastrianism, architecture)

The first enrichment round (above) treated `religion` and `architecture` as adequately
covered at 1 event each and left them alone, focusing only on the zero-count tags. On
review, that undersold both: the one `religion` event (Cyrus freeing the Jewish
captives) says nothing about Zoroastrianism, arguably the more central religious thread
for Persia specifically, and the one `architecture` event (Persepolis) doesn't represent
the range of Persian building across three empires. Two more events added, both
Sasanian-era to balance the existing Achaemenid-heavy `architecture` coverage.

| Event | Year | Article | Wikidata | Tags | Image credit |
|---|---|---|---|---|---|
| Adur Gushnasp fire temple enshrined at Takht-e Soleymān | c. 420 AD | [Adur Gushnasp](https://en.wikipedia.org/wiki/Adur_Gushnasp) | Q6419581 | religion, architecture | Salar Arkan, CC BY-SA 4.0 |
| Khosrow I builds the Grand Arch at Ctesiphon (Taq Kasra) | c. 540 AD | [Taq Kasra](https://en.wikipedia.org/wiki/Taq_Kasra) | Q1486703 | architecture | Safa Daneshvar, CC BY-SA 4.0 |

Locations:

| Event | Historical name | Modern city, country | Coordinates |
|---|---|---|---|
| Adur Gushnasp | Adur Gushnasp | Takht-e Soleyman, Iran | 36.603, 47.236 |
| Taq Kasra | Ctesiphon | Salman Pak, Iraq | 33.1, 44.583 |

Notes and judgment calls:

- **Adur Gushnasp year**: no single founding date is recorded — archaeology suggests the
  fire arrived at the site in the late 4th or early 5th century, and Bahram V (r.
  420–438) is the first king recorded endowing it. Used 420 AD, the start of his reign,
  as the anchor rather than the vaguer "late 4th century."
  Zoroastrianism itself has no useful single "founding" event to add as its own entry —
  the prophet Zoroaster's own dates are disputed across a 900-year range depending on the
  source — so this event (a specific, dateable shrine with recorded royal patronage) was
  the more defensible way to give the religion its own representation.
- **Taq Kasra year/builder**: genuinely disputed in the source — Wikipedia notes
  historians differ between Shapur I (242–272 AD, i.e. the same era as the already-covered
  Valerian capture and Gondishapur founding) and Khosrow I (construction beginning
  c. 540 AD). Went with Khosrow I/540 AD both because it's the more specific of the two
  and because it spreads Persia's architecture coverage across reigns instead of
  clustering everything in Shapur I's.
- **Taq Kasra sig**: rated `major`, unlike Persepolis's `minor` — it's arguably the most
  recognizable surviving Sasanian structure and an engineering record-holder (largest
  free-standing brick vault built before the modern era). Not harmonized against
  Persepolis's existing rating, per the skill's own guidance not to re-litigate events
  outside the current scope.

### Tag enrichment — 2026-08-04 (round 3: governance, science, art, religion)

User asked to research tags for Persia broadly; a tally of the then-current 16 events
showed `battle` dominant at 9 while `governance`, `science`, and `art` each had only 1
event across the full ~1200-year span, and `religion` (3 events) had nothing at all in
the ~470-year Parthian era. Confirmed scope with the user (all four tags) before
researching. Ten events added, spread across all three empires — the Parthian era in
particular goes from two events (founding, Battle of Carrhae) to five, gaining its first
governance, art, and religion representation.

| Event | Year | Article | Wikidata | Tags | Image credit |
|---|---|---|---|---|---|
| Darius I commissions the Old Persian cuneiform script | 521 BC | [Old Persian cuneiform](https://en.wikipedia.org/wiki/Old_Persian_cuneiform) | Q1471822 | science | Diego Delso, CC BY-SA 4.0 |
| Darius I reorganizes the empire into satrapies | c. 519 BC | [Satrap](https://en.wikipedia.org/wiki/Satrap) | Q170305 | governance | Georges Jansoone, CC BY 2.5 |
| The Apadana reliefs depict delegations from across the empire | c. 515 BC | [Apadana](https://en.wikipedia.org/wiki/Apadana) | Q617256 | art, architecture | Adam Jones, CC BY-SA 2.0 |
| The Nisa helmeted warrior blends Hellenistic and Iranian art | c. 150–100 BC | [Nisa helmeted warrior](https://en.wikipedia.org/wiki/Nisa_helmeted_warrior) | Q134469651 | art | Bruce Allardice, CC BY-SA 4.0 |
| Mithridates II adopts the title King of Kings | c. 108 BC | [Mithridates II of Parthia](https://en.wikipedia.org/wiki/Mithridates_II_of_Parthia) | Q297763 | governance | Classical Numismatic Group, CC BY-SA 3.0 |
| Vologases I preserves the scattered Avesta texts | c. 60 AD | [Vologases I of Parthia](https://en.wikipedia.org/wiki/Vologases_I_of_Parthia) | Q312446 | religion | Classical Numismatic Group, CC BY-SA 3.0 |
| Shapur I founds Bishapur, fusing Persian and Roman art | 266 AD | [Bishapur](https://en.wikipedia.org/wiki/Bishapur) | Q477898 | art, architecture | Carole Raddato, CC BY-SA 2.0 |
| Kartir lays the foundations of a Zoroastrian state church | c. 272 AD | [Kartir](https://en.wikipedia.org/wiki/Kartir) | Q557619 | religion | Darafsh Kaviyani, CC BY 3.0 |
| Khosrow I reforms taxation and the military | c. 550 AD | [Khosrow I](https://en.wikipedia.org/wiki/Khosrow_I) | Q207381 | governance | Classical Numismatic Group, CC BY-SA 3.0 |
| Borzuya translates the Panchatantra into Pahlavi | c. 570 AD | [Borzuya](https://en.wikipedia.org/wiki/Borzuya) (date from [Kalila wa Dimna](https://en.wikipedia.org/wiki/Kalila_wa_Dimna)) | Q1017211 | science | Unknown, Public domain |

Locations:

| Event | Historical name | Modern city, country | Coordinates |
|---|---|---|---|
| Apadana reliefs | Persepolis | Marvdasht, Iran | 29.935, 52.89 |
| Nisa helmeted warrior | Nisa | Ashgabat, Turkmenistan | 37.967, 58.195 |
| Bishapur | Bishapur | Kazerun, Iran | 29.778, 51.571 |

Notes and judgment calls:

- **Satrapy reform year**: not precisely dated by Wikipedia — the article only says the
  36-satrapy tribute schedule comes "according to the Behistun inscription," which is
  itself dated 521 BC. Used 519 BC (a couple of years after Behistun, distinct from both
  it and the 518 BC Persepolis construction-start event) rather than reusing 521 BC.
- **Royal Road considered and dropped**: initially researched as an Achaemenid
  governance candidate, but the article hedges its own dating ("Darius I improved the
  existing road network... but lacks a citation for this specific claim") — the satrapy
  reform had firmer sourcing (via the Behistun inscription) so it was used instead.
- **Mithridates II year**: the "King of Kings" title adoption is dated specifically
  (c. 109/108 BC); the vassal-state reorganization of the Caucasus/Mesopotamia it's
  paired with in the body text happened across his wider reign (124–91 BC), not on that
  same date — phrased to not overclaim a single date for both.
- **Khosrow I reform year**: Wikipedia doesn't give a specific year for the tax/military
  reforms beyond "after the 531 peace agreement with Rome." Used 550 AD as a placeholder
  mid-reign date, distinct from the already-existing 540 AD Taq Kasra event for the same
  king.
- **Khosrow I image swap**: the first candidate image (Plate of the Sasanian king
  Khosrow I Anushirvan) had a license but no listed artist, so per the skill's rule it
  was dropped in favor of a Khosrow I coin from Gundeshapur mint with full attribution.
- **Kartir persecution claim**: Wikipedia notes historian Parvaneh Pourshariati flags
  that Kartir's own inscriptions claiming persecution of Christians, Jews, Mandaeans,
  Manichaeans, and Buddhists may not reflect what was actually implemented — Jewish and
  Christian sources from the period don't mention it. Body text says he "claims to have
  suppressed" rather than stating the persecutions as settled fact.
- **Kartir/Bishapur sig**: rated `minor` like the rest of this batch, for consistency
  with the existing pattern where architecture/art/religion/science events are `minor`
  and only foundings/falls/major battles are `major` — not because the events are
  individually less significant.

### `sig` re-review — 2026-08-05

Applied the same stricter bar used for Greece's and Rome's re-reviews (would a
history-literate reader recognize this event by name as pivotal) across all 26 Persia
events. Three changed:

- **Upgraded** "Cyrus Conquers Babylon, Frees the Jewish Captives" (539 BC) from `minor`
  to `major` -- one of the most widely cited events of the ancient Near East (the Cyrus
  Cylinder, and Cyrus's role in the biblical account of the Jewish return from exile in
  Ezra and Isaiah); under-rated relative to how broadly it's recognized outside
  specialist ancient-history circles.
- **Upgraded** "The Sasanian Dynasty Rises" (224 AD) from `minor` to `major` -- this is
  the founding of the Sasanian Empire (Ardashir I's overthrow of the Parthians), and
  founding-tier events are treated as `major` elsewhere in this dataset (Cyrus's
  founding, the Parthian Empire's founding); it was inconsistent for this one alone to
  sit at `minor`.
- **Downgraded** "Khosrow I Builds the Grand Arch at Ctesiphon" (540 AD) from `major` to
  `minor` -- a genuinely famous monument (Taq Kasra), but per the same "construction is
  supporting detail, not a remembered turning point" logic applied to the Parthenon in
  Greece and the Colosseum/Pantheon in Rome.

Net effect: 9 major / 17 minor → 10 major / 16 minor.

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

### Tag-focused enrichment — 2026-08-05

Status: **merged into live seed data 2026-08-05** (replaced the `egypt` entry in
`civilizations.json` wholesale, going from 10 to 26 events) and reseeded.

Before this pass Egypt's 10 events carried zero `art`, `science`, `governance`, or
`rebellion` tags, and only 2 `architecture` / 1 `religion` — everything clustered on
`battle`/`founding`/`collapse`. Also fixed the underlying `data/wikipedia-data` file,
which predated the tags field entirely (the live seed data had tags, this file didn't);
synced tags onto the original 10 events from the merged seed data before appending the
16 new ones below.

Targeted all four zero-coverage tags plus bolstered `architecture`/`religion`, spanning
Old Kingdom through Ptolemaic. Post-enrichment tally (26 events): battle 7, founding 5,
collapse 4, architecture 4, religion 4, rebellion 4, governance 4, art 3, science 3.

#### Event-level sources (16 new events)

| Event | Year | Article | Wikidata | Image credit |
|---|---|---|---|---|
| Old Kingdom collapses into rival dynasties | c. 2181 BC | [First Intermediate Period of Egypt](https://en.wikipedia.org/wiki/First_Intermediate_Period_of_Egypt) | Q232211 | British Museum, CC BY-SA 4.0 |
| Story of Sinuhe composed | c. 1971 BC | [Story of Sinuhe](https://en.wikipedia.org/wiki/Story_of_Sinuhe) | Q645904 | Olaf Tausch, CC BY 3.0 |
| Senusret I founds Karnak | c. 1950 BC | [Karnak](https://en.wikipedia.org/wiki/Karnak) | Q522862 | Francis Frith, 1857, public domain (Rijksmuseum) |
| Senusret III abolishes the nomarch system | c. 1850 BC | [Senusret III](https://en.wikipedia.org/wiki/Senusret_III) | Q19248 | ArchaiOptix, CC BY-SA 4.0 |
| Edwin Smith Papyrus copied | c. 1600 BC | [Edwin Smith Papyrus](https://en.wikipedia.org/wiki/Edwin_Smith_Papyrus) | Q842363 | Public domain |
| Seqenenre Tao rebels against the Hyksos | c. 1558 BC | [Seqenenre Tao](https://en.wikipedia.org/wiki/Seqenenre_Tao) | Q31526 | Flinders Petrie, public domain |
| Nefertiti Bust sculpted | c. 1345 BC | [Nefertiti Bust](https://en.wikipedia.org/wiki/Nefertiti_Bust) | Q582172 | Philip Pikart, CC BY-SA 3.0 |
| Tutankhamun restores traditional religion | c. 1330 BC | [Tutankhamun](https://en.wikipedia.org/wiki/Tutankhamun) | Q12154 | Roland Unger, public domain |
| First recorded labor strike (Deir el-Medina) | c. 1156 BC | [Ramesses III](https://en.wikipedia.org/wiki/Ramesses_III) | Q1528 | Diego Delso, CC BY-SA 4.0 |
| Psamtik I's artistic archaism | c. 650 BC | [Psamtik I](https://en.wikipedia.org/wiki/Psamtik_I) | Q328763 | CC0 (Metropolitan Museum of Art) |
| Necho II's canal and circumnavigation | c. 609 BC | [Necho II](https://en.wikipedia.org/wiki/Necho_II) | Q125102 | Keith Schengili-Roberts, CC BY 2.5 |
| Amyrtaeus ends Persian rule | 404 BC | [Amyrtaeus](https://en.wikipedia.org/wiki/Amyrtaeus) | Q318000 | Public domain |
| Ptolemy I promotes the cult of Serapis | c. 286 BC | [Serapis](https://en.wikipedia.org/wiki/Serapis) | Q214554 | Public domain |
| Library of Alexandria takes shape | c. 283 BC | [Library of Alexandria](https://en.wikipedia.org/wiki/Library_of_Alexandria) | Q435 | O. Von Corven, public domain |
| Lighthouse of Alexandria completed | c. 280 BC | [Lighthouse of Alexandria](https://en.wikipedia.org/wiki/Lighthouse_of_Alexandria) | Q43244 | Hermann Thiersch, 1909, public domain |
| Rosetta Stone decree issued | 196 BC | [Rosetta Stone](https://en.wikipedia.org/wiki/Rosetta_Stone) | Q48584 | Hans Hillewaert, CC BY-SA 4.0 |

#### New event locations

| Event | Historical name | Modern city, country | Coordinates |
|---|---|---|---|
| Old Kingdom collapses | Herakleopolis Magna | Ihnasya el-Medina, Egypt | *(none found)* |
| Senusret I founds Karnak | Ipet-Isut | Luxor, Egypt | 25.718, 32.658 |
| Seqenenre Tao rebels | Thebes | Luxor, Egypt | 25.721, 32.610 |
| Nefertiti Bust sculpted | Akhetaten | Amarna, Egypt | 27.645, 30.896 |
| Tutankhamun restores religion | Thebes | Luxor, Egypt | 25.721, 32.610 |
| Deir el-Medina strike | Set Maat | Deir el-Medina, Egypt | 25.728, 32.601 |
| Amyrtaeus ends Persian rule | Sais | Sa el-Hagar, Egypt | 30.965, 30.768 |
| Serapis cult promoted | Alexandria | Alexandria, Egypt | 31.198, 29.893 |
| Library of Alexandria | Alexandria | Alexandria, Egypt | 31.198, 29.893 |
| Lighthouse of Alexandria | Pharos | Alexandria, Egypt | 31.198, 29.893 |
| Rosetta Stone decree | Memphis | Mit Rahina, Egypt | 29.849, 31.255 |

Story of Sinuhe, Senusret III's reform, the Edwin Smith Papyrus, Necho II's canal, and
Psamtik I's archaism have no natural single place (a literary work, an administrative
reform, an artifact of uncertain origin, an incomplete route project, and a reign-long
style trend, respectively) — `location` omitted rather than guessed.

#### Corrections / decisions made in this pass

- **Senusret III's nomarch reform**: the `Senusret_III` article itself only says his reign
  "reduced the power of regional rulers" without mechanism or date; the specific fact
  (replacing the nome system with three large administrative districts) came from the
  `Twelfth_Dynasty_of_Egypt` article instead. Kept `sourceUrl` pointing at the person
  article (matches the `wikidataId`) since that's the event's subject, but the
  corroborating detail lives on the dynasty page.
- **Psamtik I's archaism** dated to c. 650 BC as a reign-spanning cultural trend rather
  than his 664 BC accession, to avoid clustering it on the same year as the 26th
  Dynasty's founding (already implicit via the Amyrtaeus/Necho events bracketing it).
  Considered a dedicated "Saite Renaissance" art event first, but couldn't verify it on
  Wikipedia (`Twenty-sixth_Dynasty_of_Egypt`, `Late_Period_of_ancient_Egypt`, and
  `Saite_period` — the last returned a 404 — none discuss an artistic revival); used
  Psamtik I's colossal-statue archaism instead, which the `Psamtik_I` article does
  document concretely.
- **Library of Alexandria / Museum founding year**: genuinely disputed on Wikipedia
  itself — traditionally credited to Ptolemy I, but `Musaeum` says it "more likely...
  took shape under Ptolemy II." Used 283 BC (Ptolemy I's death / Ptolemy II's sole reign
  beginning) as a reasonable anchor for "takes shape" rather than picking a side.
- **Serapis cult founding year**: Wikipedia only gives "third century BC" / "on the
  orders of" Ptolemy I, no specific year — used c. 286 BC, within Ptolemy I's later
  reign, as an approximate placeholder rather than invented precision.
- Cross-checked the "first labor strike" framing against the `Deir_el-Medina` article
  (which hedges with "may have been") and the `Ramesses_III` article (which states it
  more directly as "the first known labour strike in recorded history") — used the
  latter's framing and cited it as `sourceUrl` since it also had the firm Year
  29/c. 1156 BC date the `Deir_el-Medina` article lacked.

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

### Tag enrichment — 2026-08-05

Targeted every tag from `docs/wikipedia-tags.md`: `architecture`, `art`, `science`, and
`rebellion` had zero events; `religion`, `founding`, and `collapse` had only 1 each
against Greece's 654-year span. Twelve events added, merged into the existing `events[]`
and re-sorted chronologically. The previously-merged events' `tags` (already live in
`backend/src/history_zoomout/db/seed_data/civilizations.json` since the tags feature
shipped, but missing from this file, which predates that merge) were also backfilled
here so this file matches what's actually live.

| Event | Year | Article | Wikidata | Tags | Image credit |
|---|---|---|---|---|---|
| Solon enacts sweeping reforms | 594 BC | [Solon](https://en.wikipedia.org/wiki/Solon) | Q133337 | governance | Sailko, CC BY-SA 3.0 (bust photo) |
| The Ionian Revolt begins | 499 BC | [Ionian Revolt](https://en.wikipedia.org/wiki/Ionian_Revolt) | Q208261 | rebellion, battle | Eric Gaba & MinisterForBadTimes, CC BY-SA 3.0 (map) |
| Construction begins on the Parthenon | 447 BC | [Parthenon](https://en.wikipedia.org/wiki/Parthenon) | Q10288 | architecture, religion | Steve Swayne, CC BY 2.0 |
| Phidias completes the Statue of Zeus at Olympia | 435 BC | [Statue of Zeus at Olympia](https://en.wikipedia.org/wiki/Statue_of_Zeus_at_Olympia) | Q46239 | art, religion | Quatremère de Quincy, Public domain (illustration) |
| Sparta installs the Thirty Tyrants | 404 BC | [Thirty Tyrants](https://en.wikipedia.org/wiki/Thirty_Tyrants) | Q643488 | governance | Guillaume Rouillé (publisher), Public domain (engraving) |
| Thrasybulus restores democracy | 403 BC | [Thrasybulus](https://en.wikipedia.org/wiki/Thrasybulus) | Q354403 | rebellion, governance | Andrea Alciato's *Emblemata*, Public domain (woodcut) |
| Athens puts Socrates on trial | 399 BC | [Trial of Socrates](https://en.wikipedia.org/wiki/Trial_of_Socrates) | Q3110066 | science | Jacques-Louis David, Public domain (painting) |
| Philip II defeats the Greek alliance at Chaeronea | 338 BC | [Battle of Chaeronea (338 BC)](https://en.wikipedia.org/wiki/Battle_of_Chaeronea_(338_BC)) | Q200716 | battle, collapse | Kirill Lokshin & Dipa_1965, Public domain (map) |
| Aristotle founds the Lyceum | 335 BC | [Lyceum (classical)](https://en.wikipedia.org/wiki/Lyceum_(classical)) | Q1160664 | science, founding | Raphael, Public domain (painting detail) |
| The Wars of the Diadochi begin | 323 BC | [Wars of the Diadochi](https://en.wikipedia.org/wiki/Wars_of_the_Diadochi) | Q2912306 | battle, rebellion | Derived from Shepherd's 1911 Historical Atlas, CC BY-SA 3.0 (map) |
| The Colossus of Rhodes is completed | 280 BC | [Colossus of Rhodes](https://en.wikipedia.org/wiki/Colossus_of_Rhodes) | Q41553 | architecture, art | Sidney Barclay, Public domain (engraving) |
| Eratosthenes calculates the Earth's circumference | c. 240 BC | [Eratosthenes](https://en.wikipedia.org/wiki/Eratosthenes) | Q43182 | science | cmglee, David Monniaux & jimht, CC BY-SA 4.0 (diagram) |

Locations:

| Event | Historical name | Modern city, country | Coordinates |
|---|---|---|---|
| Solon's reforms | Athens | Athens, Greece | 37.98, 23.73 |
| Ionian Revolt | Miletus | Balat, Turkey | 37.530, 27.278 |
| Parthenon construction | Athens | Athens, Greece | 37.98, 23.73 |
| Statue of Zeus at Olympia | Olympia | Olympia, Greece | 37.64, 21.63 |
| Thirty Tyrants | Athens | Athens, Greece | 37.98, 23.73 |
| Thrasybulus restores democracy | Munychia | Piraeus, Greece | 37.943, 23.647 |
| Trial of Socrates | Athens | Athens, Greece | 37.98, 23.73 |
| Battle of Chaeronea | Chaeronea | Chaeronea, Greece | 38.495, 22.848 |
| Aristotle's Lyceum | Athens | Athens, Greece | 37.98, 23.73 |
| Wars of the Diadochi | *(no location — see notes)* | -- | -- |
| Colossus of Rhodes | Rhodes | Rhodes, Greece | 36.17, 27.92 |
| Eratosthenes' measurement | Alexandria | Alexandria, Egypt | 31.198, 29.893 |

Notes and judgment calls:

- **Wars of the Diadochi**: no `location` set, same reasoning as Rome's Third Servile War
  and Constitutio Antoniniana entries -- a multi-front succession war across Alexander's
  former empire with no single defining site.
- **Eratosthenes' measurement year**: Wikipedia's Eratosthenes article doesn't state a
  specific year for the Earth-circumference calculation, only that it falls within his
  tenure as Alexandria's chief librarian (from c. 246 BC until his death c. 194 BC); used
  the commonly-cited approximate year of 240 BC, flagged here as an estimate rather than
  a sourced date.
- **Eratosthenes' location is Alexandria, Egypt, not mainland Greece**: kept in scope
  since Eratosthenes was a Greek scholar working at a Greek-founded institution (the
  Library of Alexandria, under the Macedonian Greek Ptolemaic dynasty) during the
  Hellenistic period -- consistent with "Alexander invades the Persian Empire" already
  anchoring an event in modern Turkey.
- **Thirty Tyrants vs. Thrasybulus's restoration split into two events**: the oligarchy's
  installation (404 BC) is tagged `governance` only -- it was a regime change imposed by
  Sparta's military victory, not a bottom-up revolt, so `rebellion` didn't fit. The
  democratic counter-uprising against it the following year (403 BC) is what earns the
  `rebellion` tag, alongside `governance` for the constitutional restoration itself.
- **Thrasybulus's image has no `Artist` field in Commons' extmetadata** (only a source
  URL and description) -- used per the user's guidance mid-pass that a well-described,
  clearly-licensed image without a machine-readable Artist field is still usable,
  crediting it to the named historical work (Alciato's *Emblemata*) rather than omitting
  the image.
- **Solon's reform year**: 594 BC per Diogenes Laertius, the standard cited date, though
  the article notes some ancient-source disagreement on the exact chronology.
- **`sig` re-review, same day**: on reflection the initial pass over-used `major` --
  applying it to any event that was narratively pivotal within this dataset rather than
  reserving it for events a history-literate reader would actually recognize by name.
  Downgraded four to `minor`: Solon's reforms (real, but overshadowed by Cleisthenes as
  *the* founding-of-democracy event), the Ionian Revolt (matters mainly as the cause of
  the more-remembered Marathon/Salamis), the Parthenon's construction start (the building
  is iconic; "construction began in 447 BC" is a dating fact, not a remembered turning
  point), and Thrasybulus's restoration of democracy (consequential but specialist
  Athenian-history knowledge, not a textbook landmark). Kept `major` for Socrates' trial,
  Chaeronea, and the Wars of the Diadochi -- each is the standard remembered answer to
  "what happened next" in its era. Final split: 9 major / 11 minor across all 20 events.

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

### Tag enrichment — 2026-08-05

Targeted every tag from `docs/wikipedia-tags.md`: `art`, `religion`, and `science` had
zero events; `architecture`, `battle`, `collapse`, `governance`, and `rebellion` had only
1-2 each against Rome's 1,229-year span. Twelve events added, merged into the existing
`events[]` and re-sorted chronologically. The previously-merged events' `tags` (already
live in `backend/src/history_zoomout/db/seed_data/civilizations.json` since the tags
feature shipped, but missing from this file, which predates that merge) were also
backfilled here so this file matches what's actually live.

| Event | Year | Article | Wikidata | Tags | Image credit |
|---|---|---|---|---|---|
| Rome codifies the Twelve Tables | 449 BC | [Twelve Tables](https://en.wikipedia.org/wiki/Twelve_Tables) | Q203686 | governance | Unknown author, Public domain (engraving) |
| Gauls rout Rome at the Allia | 387 BC | [Battle of the Allia](https://en.wikipedia.org/wiki/Battle_of_the_Allia) | Q655777 | battle | Gustave Surand, Public domain (painting) |
| Spartacus leads a slave revolt | 73 BC | [Third Servile War](https://en.wikipedia.org/wiki/Third_Servile_War) | Q194378 | rebellion, battle | Soerfm, CC BY-SA 3.0 (statue photo) |
| Caesar reforms the calendar | 46 BC | [Julian calendar](https://en.wikipedia.org/wiki/Julian_calendar) | Q11184 | science, governance | Ángel M. Felicísimo, Public domain |
| Octavian defeats Antony and Cleopatra at Actium | 31 BC | [Battle of Actium](https://en.wikipedia.org/wiki/Battle_of_Actium) | Q160387 | battle | Mark Landon, CC BY 4.0 (relief photo) |
| The Ara Pacis is dedicated | 9 BC | [Ara Pacis](https://en.wikipedia.org/wiki/Ara_Pacis) | Q623612 | art, religion | Rabax63, CC BY-SA 4.0 |
| Germanic tribes destroy three Roman legions | 9 AD | [Battle of the Teutoburg Forest](https://en.wikipedia.org/wiki/Battle_of_the_Teutoburg_Forest) | Q87779 | battle | Agnete, Public domain |
| Hadrian rebuilds the Pantheon | 126 AD | [Pantheon, Rome](https://en.wikipedia.org/wiki/Pantheon,_Rome) | Q99309 | architecture, science, religion | NikonZ7II, CC BY-SA 4.0 |
| Caracalla grants citizenship to all free subjects | 212 AD | [Constitutio Antoniniana](https://en.wikipedia.org/wiki/Constitutio_Antoniniana) | Q312584 | governance | Unknown author, Public domain (papyrus) |
| The Edict of Milan legalizes Christianity | 313 AD | [Edict of Milan](https://en.wikipedia.org/wiki/Edict_of_Milan) | Q180764 | religion, governance | Marie-Lan Nguyen, Public domain |
| Goths crush the Eastern Roman army at Adrianople | 378 AD | [Battle of Adrianople](https://en.wikipedia.org/wiki/Battle_of_Adrianople) | Q192473 | battle, collapse | Elias84 & Dipa_1965, Public domain (map) |
| Alaric's Visigoths sack Rome | 410 AD | [Sack of Rome (410)](https://en.wikipedia.org/wiki/Sack_of_Rome_(410)) | Q1463845 | battle, collapse | Joseph-Noël Sylvestre, Public domain (painting) |

Locations:

| Event | Historical name | Modern city, country | Coordinates |
|---|---|---|---|
| Twelve Tables | Rome | Rome, Italy | 41.89, 12.48 |
| Battle of the Allia | River Allia | *(unconfirmed)*, Italy | 42.0175, 12.52 |
| Third Servile War | *(no location — see notes)* | -- | -- |
| Julian calendar reform | Rome | Rome, Italy | 41.89, 12.48 |
| Battle of Actium | Actium | *(unconfirmed)*, Greece | 38.925, 20.725 |
| Ara Pacis | Rome | Rome, Italy | 41.89, 12.48 |
| Battle of the Teutoburg Forest | Teutoburg Forest | Kalkriese, Germany | 52.408, 8.129 |
| Pantheon | Rome | Rome, Italy | 41.89, 12.48 |
| Constitutio Antoniniana | *(no location — see notes)* | -- | -- |
| Edict of Milan | Mediolanum | Milan, Italy | 45.46694, 9.19 |
| Battle of Adrianople | Adrianople | Edirne, Turkey | 41.81, 26.5 |
| Sack of Rome (410) | Rome | Rome, Italy | 41.89, 12.48 |

Notes and judgment calls:

- **Twelve Tables year**: used 449 BC, the tables' final promulgation, rather than 451 BC
  when the decemviri were first appointed to draft them.
- **Battle of the Allia year**: Wikipedia's infobox gives 387 BC as the modern scholarly
  date (from Polybius's Greek chronology) ahead of the traditional Varronian 390 BC (from
  Livy) -- used 387 BC as the primary date.
- **Third Servile War / Spartacus**: used 73 BC, the year of the escape from the Capuan
  gladiator school, over 71 BC (the final defeat at the Silarius) since the revolt itself
  -- not its suppression -- is what earns it the `rebellion` tag. No `location` set: the
  revolt ranged across most of Italy over two years with no single defining site, fitting
  the "broad campaign" case for omitting the field entirely.
- **Constitutio Antoniniana**: no `location` set for the same reason -- it's an
  empire-wide edict with no single issuing site pinned down.
- **Julian calendar image**: used a photo of a Caesar bust rather than a calendar diagram,
  since Caesar-as-reformer reads more clearly at thumbnail size than a grid of month
  names would.
- **Teutoburg Forest location**: the battle article itself has no coordinates; used
  Kalkriese, the archaeological site now most widely accepted as the battlefield, as the
  modern equivalent.
- **Spartacus statue attribution**: the file's extmetadata has no machine-readable
  `Artist` field (Commons flags it as such); credited the photo to its uploader (Soerfm)
  per the license's attribution requirement, consistent with how other uploader-only Rome
  images in this file are credited (e.g. the Capitoline Wolf photo by Rabax63).
- **Existing "Assassination of Julius Caesar" event** still carries an empty `tags: []`
  in both this file and the live seed data -- left untouched since fixing pre-existing
  tags on events outside this enrichment's target list wasn't part of the ask; flagging
  here in case a future pass wants to pick it up (`rebellion` would fit, as an elite
  succession crisis rather than a mass uprising).

### `sig` re-review — 2026-08-05

Applied the same stricter bar used for Greece's re-review (would a history-literate
reader recognize this event by name as pivotal, not just "it supports the narrative")
across all 20 Rome events, in both directions -- correcting under-rated events, not just
over-rated ones. Four changed:

- **Upgraded** "The Roman Republic Is Established" (509 BC) from `minor` to `major` --
  the overthrow of the monarchy and founding of the Republic is at least as widely
  recognized as any other founding-tier event in this dataset (on par with "Cyrus founds
  the Achaemenid Empire" or "Augustus becomes Rome's first emperor"), and was originally
  under-rated relative to its actual fame.
- **Upgraded** "Diocletian Splits the Empire Into the Tetrarchy" (293 AD) from `minor` to
  `major` -- this is the standard textbook origin of the later East/West Roman Empire
  split, a genuinely recognized turning point, not merely an administrative detail.
- **Downgraded** "Gauls Rout Rome at the Allia" (387 BC) from `major` to `minor` -- known
  to Roman historians (dies Alliensis) but not a name a general history-literate reader
  would recognize, unlike the Gallic sack of Rome it enabled.
- **Downgraded** "Caracalla Grants Citizenship to All Free Subjects" (212 AD) from
  `major` to `minor` -- a genuinely important legal reform, but specialist-level
  administrative history rather than a widely-remembered landmark, consistent with how
  Solon's reforms were treated in Greece's re-review.

Net effect: still 13 major / 7 minor overall, but with a more defensible composition.
"The Colosseum Opens" and "Hadrian Rebuilds the Pantheon" were considered for upgrade
(both are famous landmarks) but kept `minor`, consistent with the Parthenon precedent in
Greece -- a monument's fame doesn't make "construction began/was rebuilt in year X" a
remembered turning point in the way a battle or founding is.

## Mesopotamia (topic id: `mesopotamia`) — pulled 2026-08-03

Status: **merged into live seed data 2026-08-03** (replacing the old 5-event entry wholesale) and reseeded. Re-merged 2026-08-05 with the 12-event enrichment pass below (now 20 events total) and reseeded again.

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

### Enrichment pass — 2026-08-05

The 8-event set above only showed the *foundings* of the Akkadian Empire and Third
Dynasty of Ur and the *falls* of the Neo-Assyrian and Neo-Babylonian Empires -- every
other transition (Akkad's own collapse, Ur III's collapse, the Old Babylonian collapse,
the Neo-Assyrian and Neo-Babylonian foundings) was unrepresented, and the tag set had
zero `art`, zero `religion`, and zero `rebellion` events. Also note: the existing
`data/wikipedia-data/civilization/mesopotamia.json` predates the `tags` field entirely
(it was added to the live seed data in a later pass without being synced back to this
file) -- this pass adds `tags` to all 8 pre-existing events too, copied from the current
values in `backend/src/history_zoomout/db/seed_data/civilizations.json`, purely to bring
the research file back in sync; none of those 8 events' facts, images, or locations
changed.

Twelve new events added, spanning every previously-missing sub-period:

#### Event-level sources (new events only)

| Event | Year | Article | Wikidata | Image credit |
|---|---|---|---|---|
| Enheduanna composes sacred hymns | c. 2285 BC | [Enheduanna](https://en.wikipedia.org/wiki/Enheduanna) | Q232505 | Mefman00, CC0 |
| Gutian invaders topple the Akkadian Empire | 2154 BC | [Gutian rule in Mesopotamia](https://en.wikipedia.org/wiki/Gutian_rule_in_Mesopotamia) | Q1064034 | Osama Shukir Muhammed Amin FRCP(Glasg), CC BY-SA 4.0 |
| Ur-Nammu begins the Great Ziggurat of Ur | c. 2100 BC | [Ziggurat of Ur](https://en.wikipedia.org/wiki/Ziggurat_of_Ur) | Q202927 | Tla2006, Public domain |
| Elamites sack Ur, ending the Third Dynasty | 2004 BC | [Third Dynasty of Ur](https://en.wikipedia.org/wiki/Third_Dynasty_of_Ur) | *(none found)* | Metropolitan Museum of Art, CC0 |
| Hittites sack Babylon, ending Hammurabi's dynasty | 1595 BC | [Mursili I](https://en.wikipedia.org/wiki/Mursili_I) | Q222536 | MapMaster, CC BY-SA 4.0 (map) |
| The Epic of Gilgamesh reaches its standard form | c. 1100 BC | [Epic of Gilgamesh](https://en.wikipedia.org/wiki/Epic_of_Gilgamesh) | Q8272 | BabelStone, CC0 |
| Adad-nirari II founds the Neo-Assyrian Empire | 911 BC | [Neo-Assyrian Empire](https://en.wikipedia.org/wiki/Neo-Assyrian_Empire) | Q10914393 | Ningyou, Public domain (map) |
| Sennacherib destroys Babylon | 689 BC | [Sennacherib](https://en.wikipedia.org/wiki/Sennacherib) | Q207140 | Gary Todd, CC0 |
| Esarhaddon rebuilds Babylon | 680 BC | [Esarhaddon](https://en.wikipedia.org/wiki/Esarhaddon) | Q193912 | Osama Shukir Muhammed Amin FRCP(Glasg), CC BY-SA 4.0 |
| Nabopolassar founds the Neo-Babylonian Empire | 626 BC | [Nabopolassar](https://en.wikipedia.org/wiki/Nabopolassar) | Q273514 | ܥܘܡܪܐ, Public domain (map) |
| Nebuchadnezzar II rebuilds the Etemenanki ziggurat | c. 600 BC | [Etemenanki](https://en.wikipedia.org/wiki/Etemenanki) | Q285788 | Jona Lendering, Public domain |
| Nabonidus abandons Babylon for Tayma | 552 BC | [Nabonidus](https://en.wikipedia.org/wiki/Nabonidus) | Q239414 | Osama Shukir Muhammed Amin FRCP(Glasg), CC BY-SA 4.0 |

#### Event locations (new events only)

| Event | Historical name | Modern city, country | Coordinates |
|---|---|---|---|
| Enheduanna composes sacred hymns | Ur | Nasiriyah, Iraq | 30.962, 46.105 |
| Gutian invaders topple the Akkadian Empire | Akkad | *(unlocated)*, Iraq | *(none found)* |
| Ur-Nammu begins the Great Ziggurat of Ur | Ur | Nasiriyah, Iraq | 30.962, 46.105 |
| Elamites sack Ur | Ur | Nasiriyah, Iraq | 30.962, 46.105 |
| Hittites sack Babylon | Babylon | Al-Hillah, Iraq | 32.543, 44.421 |
| The Epic of Gilgamesh reaches its standard form | — | *(no single place -- authorship/compilation site uncertain)* | — |
| Adad-nirari II founds the Neo-Assyrian Empire | Assur | Qal'at Sherqat, Iraq | 35.457, 43.263 |
| Sennacherib destroys Babylon | Babylon | Al-Hillah, Iraq | 32.543, 44.421 |
| Esarhaddon rebuilds Babylon | Babylon | Al-Hillah, Iraq | 32.543, 44.421 |
| Nabopolassar founds the Neo-Babylonian Empire | Babylon | Al-Hillah, Iraq | 32.543, 44.421 |
| Nebuchadnezzar II rebuilds the Etemenanki ziggurat | Babylon | Al-Hillah, Iraq | 32.543, 44.421 |
| Nabonidus abandons Babylon for Tayma | Tayma | Tayma, Saudi Arabia | 27.630, 38.540 |

#### Corrections / decisions made in this pass

- **Fall of Ur III has no dedicated Wikidata item or clean image**: the same
  `Third_Dynasty_of_Ur` article covers both its founding (already in the dataset) and
  its fall, and no event-specific Wikidata item exists -- left `wikidataId` null (same
  reasoning as the existing Ashurbanipal-library decision) rather than reusing the
  dynasty's own item (`Q723587`) across two different events. Image is a Met Museum
  depiction of Ibbi-Sin, the dynasty's last king, rather than a generic dynasty map.
- **"Nebuchadnezzar II Rebuilds the Etemenanki Ziggurat" vs. the Hanging Gardens**: the
  Hanging Gardens of Babylon were the initial candidate for this slot, but their
  historicity is genuinely disputed among scholars (some attribute the "hanging
  gardens" descriptions to Sennacherib's gardens at Nineveh instead) -- Etemenanki is
  the actual, archaeologically documented ziggurat Nebuchadnezzar II rebuilt, and is
  independently notable as a likely inspiration for the Tower of Babel story. Chose the
  well-attested structure over the legendary one.
- **Epic of Gilgamesh's standard-version date**: Sin-Leqi-Unninni's own lifetime is only
  bracketed to "sometime between 1300 and 1000 BCE" by the sources checked -- used 1100
  BC as a midpoint placeholder, not a precise compilation date.
- **No single location for the Epic of Gilgamesh event**: unlike most events in this
  dataset, the compilation of the standard text isn't tied to one place in the sources
  checked (Sin-Leqi-Unninni's own city isn't established) -- `location` omitted entirely
  rather than guessing Uruk (Gilgamesh's legendary city, but not the compiler's).
- **Adad-nirari II's Neo-Assyrian founding located at Assur, not Nineveh**: Nineveh only
  became the Neo-Assyrian capital under Sennacherib, decades after 911 BC -- Assur
  (modern Qal'at Sherqat) was still the capital at the founding date used here.
- **Akkad reused as the Gutian-invasion event's location**: same open
  archaeological-identification problem as the existing Sargon-founding event at this
  site (no definitive site ID) -- reused the same `city: null` / country-only pattern
  rather than treating it differently.

## China (topic id: `china`) — pulled 2026-08-03

Status: **merged into live seed data 2026-08-03** (replacing the old 5-event entry wholesale) and reseeded. Re-merged 2026-08-05 with the 15-event enrichment pass below (now 24 events total) and reseeded again.

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

### Enrichment pass — 2026-08-05

The original 9-event set covered Qin, Han's founding, Sui, Tang, and Song's founding and
fall, but left a ~360-year hole between Cai Lun's papermaking (105 AD) and Sui Wendi's
reunification (581 AD) completely empty -- the entire Three Kingdoms, Jin, and Northern
and Southern Dynasties period, one of the most consequential stretches in Chinese
history, had zero events. The tag set also had zero `art`, zero `religion`, and zero
`governance` events. Also note: like the Mesopotamia file before its own enrichment pass,
`data/wikipedia-data/civilization/china.json` predates the `tags` field -- this pass adds
`tags` to all 9 pre-existing events too, copied from the current values in
`backend/src/history_zoomout/db/seed_data/civilizations.json`, purely to resync the
research file; none of those 9 events' facts, images, or locations changed.

Fifteen new events added, spanning every previously-missing sub-period (Three Kingdoms,
Jin, Northern and Southern Dynasties, the Tang's religious and political high points, and
Song governance and warfare beyond its founding):

#### Event-level sources (new events only)

| Event | Year | Article | Wikidata | Image credit |
|---|---|---|---|---|
| The Yellow Turban Rebellion erupts | 184 AD | [Yellow Turban Rebellion](https://en.wikipedia.org/wiki/Yellow_Turban_Rebellion) | Q751743 | SY (Seasonsinthesun), CC BY-SA 4.0 (map) |
| The Battle of Red Cliffs | 208 AD | [Battle of Red Cliffs](https://en.wikipedia.org/wiki/Battle_of_Red_Cliffs) | Q830059 | User Jie, CC BY-SA 3.0 |
| Cao Pi ends the Han dynasty | 220 AD | [Cao Pi](https://en.wikipedia.org/wiki/Cao_Pi) | Q313333 | Yan Liben (painting), Public domain |
| The Jin dynasty reunifies China | 280 AD | [Jin dynasty (266–420)](https://en.wikipedia.org/wiki/Jin_dynasty_(266%E2%80%93420)) | Q7352 | Ian Kiu, CC BY-SA 3.0 (map) |
| The Yungang Grottoes are carved | 460 AD | [Yungang Grottoes](https://en.wikipedia.org/wiki/Yungang_Grottoes) | Q308805 | xiquinhosilva, CC BY 2.0 |
| Northern Wei moves its capital and adopts Han customs | 494 AD | [Emperor Xiaowen of Northern Wei](https://en.wikipedia.org/wiki/Emperor_Xiaowen_of_Northern_Wei) | Q1327614 | Public domain |
| The Grand Canal is completed | 609 AD | [Grand Canal (China)](https://en.wikipedia.org/wiki/Grand_Canal_(China)) | Q31347 | EditQ, CC BY-SA 4.0 |
| The Sui dynasty falls | 618 AD | [Emperor Yang of Sui](https://en.wikipedia.org/wiki/Emperor_Yang_of_Sui) | Q7419 | Yan Liben (painting), Public domain |
| Xuanzang returns from his pilgrimage to India | 645 AD | [Xuanzang](https://en.wikipedia.org/wiki/Xuanzang) | Q42063 | Public domain |
| Wu Zetian becomes emperor | 690 AD | [Wu Zetian](https://en.wikipedia.org/wiki/Wu_Zetian) | Q9738 | wanghongliu, CC BY-SA 3.0 |
| The Diamond Sutra is printed | 868 AD | [Diamond Sutra](https://en.wikipedia.org/wiki/Diamond_Sutra) | Q494235 | Public domain |
| The Tang dynasty falls | 907 AD | [Zhu Wen](https://en.wikipedia.org/wiki/Zhu_Wen) | Q1275305 | Public domain |
| Bi Sheng invents movable type printing | 1041 AD | [Bi Sheng](https://en.wikipedia.org/wiki/Bi_Sheng) | Q200662 | Popolon, CC BY-SA 4.0 |
| Wang Anshi launches the New Policies | 1069 AD | [Wang Anshi](https://en.wikipedia.org/wiki/Wang_Anshi) | Q319618 | Public domain |
| The Jingkang Incident ends the Northern Song | 1127 AD | [Jingkang incident](https://en.wikipedia.org/wiki/Jingkang_incident) | Q1326831 | Public domain (portrait of Emperor Huizong) |

#### Event locations (new events only)

| Event | Historical name | Modern city, country | Coordinates |
|---|---|---|---|
| The Yellow Turban Rebellion erupts | — | *(no single site -- uprising spanned multiple provinces)* | — |
| The Battle of Red Cliffs | Chibi | Chibi, China | 29.72, 113.90 |
| Cao Pi ends the Han dynasty | Luoyang | Luoyang, China | 34.62, 112.45 |
| The Jin dynasty reunifies China | Luoyang | Luoyang, China | 34.62, 112.45 |
| The Yungang Grottoes are carved | Pingcheng | Datong, China | 40.10, 113.37 |
| Northern Wei moves its capital and adopts Han customs | Luoyang | Luoyang, China | 34.62, 112.45 |
| The Grand Canal is completed | — | *(no single site -- canal spans multiple river basins)* | — |
| The Sui dynasty falls | Jiangdu | Yangzhou, China | 32.39, 119.41 |
| Xuanzang returns from his pilgrimage to India | Chang'an | Xi'an, China | 34.26, 108.94 |
| Wu Zetian becomes emperor | Luoyang | Luoyang, China | 34.62, 112.45 |
| The Diamond Sutra is printed | Dunhuang | Dunhuang, China | 40.14, 94.66 |
| The Tang dynasty falls | Luoyang | Luoyang, China | 34.62, 112.45 |
| Bi Sheng invents movable type printing | — | *(no single site -- workshop location not established)* | — |
| Wang Anshi launches the New Policies | Bianjing | Kaifeng, China | 34.80, 114.35 |
| The Jingkang Incident ends the Northern Song | Bianjing | Kaifeng, China | 34.80, 114.35 |

#### Corrections / decisions made in this pass

- **Cao Pi's abdication-ceremony site vs. Luoyang**: primary-source accounts place the
  actual abdication ceremony near Fanyang (in modern Linying County, Henan), not at
  Luoyang itself -- but Luoyang, which Cao Pi made Wei's capital immediately afterward,
  is the well-documented, geocodable seat of the new state and is used here as a
  reasonable simplification, the same way "Liu Bang Founds the Han Dynasty" (already in
  the dataset) anchors to Chang'an rather than the exact battlefield-adjacent site of his
  proclamation.
- **Diamond Sutra located at Dunhuang, not its likely print origin**: scholarship
  suggests the scroll was probably printed in Sichuan, but it was found in 1900 at the
  Mogao Caves near Dunhuang, where it had been sealed for centuries, and Dunhuang is the
  only site tied to the object that's well documented -- used as the find-site, not a
  claim about where it was printed.
- **Jingkang Incident's image is a portrait of Emperor Huizong**, not a battle scene or
  map -- no freely licensed depiction of the siege of Bianjing itself was found; Huizong,
  one of the two emperors captured in the incident, is the closest well-attributed image
  available.
- **Reused capital coordinates**: Luoyang (34.62, 112.45) anchors four different new
  events (Cao Pi, the Jin reunification, the Northern Wei capital move, and the Tang's
  fall) and Bianjing/Kaifeng (34.80, 114.35) anchors two (Wang Anshi, Jingkang) -- these
  repeats are accurate, not mistakes; both cities really did serve as the imperial seat
  across multiple of these events, the same pattern already noted for Chang'an/Xi'an in
  the original pass.
- **Grand Canal and Bi Sheng's invention have no `location` object**, following the same
  precedent as "Great Wall construction begins" in the original pass -- the canal spans
  multiple river basins with no single site, and Bi Sheng's own workshop location isn't
  established in the sources checked.

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

### Gap-filling enrichment — 2026-08-05

The original 8-event pass covered the founding, Justinian's legal/architectural legacy,
the 718 siege, Basil II's peak, the Great Schism, the 1204 sack, and the 1453 fall -- but
left three huge stretches of the 1,123-year span essentially empty: nothing between 537
and 718 (Justinian's reconquest wars and the plague that undercut them, then the
catastrophic loss of Syria and Egypt to the Arab conquests), nothing between 718 and 1014
(nearly 300 years, spanning the entire Iconoclasm controversy and the Christianization of
the Rus), and nothing between 1054 and 1204 (Manzikert -- arguably the single most
consequential Byzantine defeat before 1204 -- and the Komnenian recovery that followed
it). Also nothing at all between 1204 and 1453 covering the empire's actual restoration.
Fourteen events added to close these gaps, merged into the existing `events[]` and
re-sorted chronologically. The previously-existing 8 events' `tags` (already live in
`backend/src/history_zoomout/db/seed_data/civilizations.json` since the tags feature
shipped, but missing from this file, which predates that merge) were also backfilled here
so this file matches what's actually live.

| Event | Year | Article | Wikidata | Tags | Image credit |
|---|---|---|---|---|---|
| The Nika riots nearly topple Justinian | 532 AD | [Nika riots](https://en.wikipedia.org/wiki/Nika_riots) | Q162665 | rebellion | Dennis G. Jarvis, CC BY-SA 2.0 (photo) |
| Belisarius retakes Carthage | 533 AD | [Vandalic War](https://en.wikipedia.org/wiki/Vandalic_War) | Q1136575 | battle | Cplakidas, CC BY-SA 3.0 (map) |
| The Plague of Justinian strikes | 541 AD | [Plague of Justinian](https://en.wikipedia.org/wiki/Plague_of_Justinian) | Q821711 | *(none)* | Jniemenmaa, CC BY-SA 3.0 (map) |
| The Byzantines lose Syria at Yarmouk | 636 AD | [Battle of the Yarmuk](https://en.wikipedia.org/wiki/Battle_of_the_Yarmuk) | Q194226 | battle | Anonymous, 14th c. Catalonian manuscript, Public domain |
| Alexandria falls, ending Roman Egypt | 642 AD | [Arab conquest of Egypt](https://en.wikipedia.org/wiki/Arab_conquest_of_Egypt) | Q317519 | battle | Mohammad Adil, CC BY-SA 3.0 (map) |
| Iconoclasm divides the church | 726 AD | [Byzantine Iconoclasm](https://en.wikipedia.org/wiki/Byzantine_Iconoclasm) | Q1018769 | religion | Unknown, 9th c. Chludov Psalter, Public domain |
| The Second Council of Nicaea restores icons | 787 AD | [Second Council of Nicaea](https://en.wikipedia.org/wiki/Second_Council_of_Nicaea) | Q187201 | religion | Menologion of Basil II, Public domain |
| Emperor Nikephoros I is killed at Pliska | 811 AD | [Battle of Pliska](https://en.wikipedia.org/wiki/Battle_of_Pliska) | Q403416 | battle | Manasses Chronicle, Public domain |
| The Rus convert to Orthodox Christianity | 988 AD | [Christianization of Kievan Rus'](https://en.wikipedia.org/wiki/Christianization_of_Kievan_Rus%27) | Q573211 | religion | Klavdy Lebedev, Public domain (painting) |
| The Byzantines are routed at Manzikert | 1071 AD | [Battle of Manzikert](https://en.wikipedia.org/wiki/Battle_of_Manzikert) | Q200032 | battle | O. Mustafin, Public domain (illustration) |
| Byzantines recover Nicaea with crusader help | 1097 AD | [Siege of Nicaea](https://en.wikipedia.org/wiki/Siege_of_Nicaea) | Q642117 | battle | Anonymous, 13th c. French manuscript, Public domain |
| The Byzantines recapture Constantinople | 1261 AD | [Reconquest of Constantinople](https://en.wikipedia.org/wiki/Reconquest_of_Constantinople) | Q1400402 | battle | Gatteri & Zanotto, Public domain (illustration) |
| The Hesychast controversy is resolved | 1351 AD | [Hesychast controversy](https://en.wikipedia.org/wiki/Hesychast_controversy) | Q5746591 | religion | Public domain (icon) |
| The Union of Florence attempts to reunite the churches | 1439 AD | [Council of Florence](https://en.wikipedia.org/wiki/Council_of_Florence) | Q321032 | religion | Wolgemut & Pleydenwurff, Public domain (woodcut) |

Locations:

| Event | Historical name | Modern city, country | Coordinates |
|---|---|---|---|
| Nika riots | Constantinople | Istanbul, Turkey | 41.014, 28.955 |
| Belisarius retakes Carthage | Carthage | Tunis, Tunisia | 36.806, 10.182 |
| Plague of Justinian | Constantinople | Istanbul, Turkey | 41.014, 28.955 |
| Battle of Yarmouk | Yarmouk | Yarmouk River, Syria | 32.814, 35.955 |
| Fall of Alexandria | Alexandria | Alexandria, Egypt | 31.198, 29.893 |
| Iconoclasm begins | Constantinople | Istanbul, Turkey | 41.014, 28.955 |
| Second Council of Nicaea | Nicaea | İznik, Turkey | 40.429, 29.721 |
| Battle of Pliska | Pliska | Pliska, Bulgaria | 43.387, 27.132 |
| Christianization of the Rus | Kiev | Kyiv, Ukraine | 50.450, 30.523 |
| Battle of Manzikert | Manzikert | Malazgirt, Turkey | 39.148, 42.544 |
| Siege of Nicaea | Nicaea | İznik, Turkey | 40.429, 29.721 |
| Recapture of Constantinople | Constantinople | Istanbul, Turkey | 41.014, 28.955 |
| Hesychast controversy | Constantinople | Istanbul, Turkey | 41.014, 28.955 |
| Union of Florence | Florence | Florence, Italy | 43.771, 11.254 |

Notes and judgment calls:

- **Plague of Justinian has no tag**: none of the existing vocabulary
  (architecture/art/battle/collapse/founding/governance/rebellion/religion/science) fits
  a pandemic. Left `tags: []` rather than force-fitting one; per the tag vocabulary's own
  rule, a new tag is only worth adding when it'll actually recur across topics, and a
  one-off doesn't clear that bar.
- **Plague of Justinian's image**: the article's own top thumbnail
  (`Plaguet03.jpg`) turns out to depict a *different*, later outbreak (the 7th-century
  Plague of Pavia) per its own Commons description -- using it would have been a factual
  mismatch. Substituted a map of Byzantine territory circa 550 (`Byzantium550.png`) as
  contextual illustration instead, and wrote `imageDescription` to describe the map
  itself rather than implying it depicts the plague.
- **Christianization of the Rus is anchored at Kyiv, not Chersonesus**: Vladimir's own
  baptism happened at Byzantine Chersonesus (Crimea), but the event as commonly
  understood -- and the one with lasting consequence for Byzantine-Rus relations -- is
  the mass baptism of his people at Kyiv immediately after. Chersonesus is mentioned in
  the event body for context.
- **Siege of Nicaea (1097) kept `minor`, Manzikert (1071) kept `major`**: both are
  battles in the same rough era, but Manzikert is the outcome a general reader would
  recognize by name (the opening of Anatolia to Turkish settlement); the Nicaea siege is
  a real but secondary episode of the Komnenian recovery, notable mainly as the First
  Crusade's opening battle.
- **The Fourth Crusade's sack of Constantinople (1204) and its recapture (1261) now
  bracket a real narrative arc**: the empire's exile and restoration under the Nicaean
  successor state, previously invisible in this dataset since the timeline jumped
  straight from the sack to the final fall 249 years later.

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

### Gap-filling enrichment — 2026-08-06

Not yet re-merged into live seed data -- this is a research pass only; merging is a
separate step.

The original 8-event pass covered the Hijra, the Rashidun founding, the Umayyad and
Abbasid foundings, Tours, the House of Wisdom, the Seljuk takeover, and the Mongol sack --
but left the Rashidun conquests themselves unrepresented, skipped the entire First
Fitna/Karbala rupture that founded the Sunni-Shia split, had no Umayyad-era architecture
or administrative history, and never mentioned either of the caliphate's two great rival
successor states: the Umayyad Emirate/Caliphate of Córdoba in al-Andalus or the Fatimid
Caliphate in North Africa and Egypt. Fifteen events added to close these gaps, merged
into the existing `events[]` and re-sorted chronologically (now 23 events total).

| Event | Year | Article | Wikidata | Tags | Image credit |
|---|---|---|---|---|---|
| Rashidun army shatters Byzantine power at Yarmouk | 636 AD | [Battle of the Yarmuk](https://en.wikipedia.org/wiki/Battle_of_the_Yarmuk) | Q194226 | battle | Anonymous, 14th c. Catalonian manuscript, Public domain |
| Qadisiyyah breaks Sasanian power in Iraq | 636 AD | [Battle of al-Qadisiyyah](https://en.wikipedia.org/wiki/Battle_of_al-Qadisiyyah) | Q836844 | battle | Shahnameh manuscript, Public domain |
| The First Fitna splits the Muslim community | 656 AD | [First Fitna](https://en.wikipedia.org/wiki/First_Fitna) | Q1417059 | rebellion, battle, religion | Al Ameer son, CC BY-SA 4.0 (map) |
| Husayn is killed at Karbala | 680 AD | [Battle of Karbala](https://en.wikipedia.org/wiki/Battle_of_Karbala) | Q626058 | religion, battle | Abbas Al-Musavi, Public domain (painting) |
| The Dome of the Rock is completed in Jerusalem | 691 AD | [Dome of the Rock](https://en.wikipedia.org/wiki/Dome_of_the_Rock) | Q172077 | architecture, religion | Ludvig14, CC BY-SA 4.0 (photo) |
| Abd al-Malik reforms coinage and administration | 697 AD | [Abd al-Malik ibn Marwan](https://en.wikipedia.org/wiki/Abd_al-Malik_ibn_Marwan) | Q36788 | governance | PHGCOM, Public domain (photo) |
| Abd al-Rahman I founds the Emirate of Córdoba | 756 AD | [Abd al-Rahman I](https://en.wikipedia.org/wiki/Abd_al-Rahman_I) | Q29000 | founding | Numismática Pliego, CC BY-SA 3.0 (photo) |
| Al-Khwarizmi writes the book that names algebra | 820 AD | [Al-Jabr](https://en.wikipedia.org/wiki/Al-Jabr) | Q8369 | science | Public domain (manuscript) |
| The Zanj Rebellion convulses southern Iraq | 869 AD | [Zanj Rebellion](https://en.wikipedia.org/wiki/Zanj_Rebellion) | Q759988 | rebellion | Ro4444, CC BY-SA 3.0 (map) |
| The Fatimid Caliphate is founded in North Africa | 909 AD | [Fatimid Caliphate](https://en.wikipedia.org/wiki/Fatimid_Caliphate) | Q160307 | founding, religion | Omar-toons, CC BY-SA 4.0 (map) |
| Abd al-Rahman III proclaims himself caliph | 929 AD | [Abd al-Rahman III](https://en.wikipedia.org/wiki/Abd_al-Rahman_III) | Q190418 | founding, governance | Numismática Pliego, CC BY-SA 3.0 (photo) |
| The Buyids take control of Baghdad | 945 AD | [Buyid dynasty](https://en.wikipedia.org/wiki/Buyid_dynasty) | Q273874 | governance | Ro4444, Public domain (map) |
| The Fatimids found Cairo and al-Azhar | 969 AD | [Al-Azhar Mosque](https://en.wikipedia.org/wiki/Al-Azhar_Mosque) | Q312342 | architecture, religion, science | Wildoo78, CC BY-SA 4.0 (photo) |
| The Caliphate of Córdoba dissolves into Taifa kingdoms | 1031 AD | [Taifa](https://en.wikipedia.org/wiki/Taifa) | Q217177 | collapse | Falconaumanni, CC BY-SA 3.0 (map) |
| Saladin ends Fatimid rule in Egypt | 1171 AD | [Saladin](https://en.wikipedia.org/wiki/Saladin) | Q8581 | collapse | Classical Numismatic Group, CC BY-SA 2.5 (photo) |

Locations:

| Event | Historical name | Modern city, country | Coordinates |
|---|---|---|---|
| Battle of Yarmouk | Yarmouk | Yarmouk River, Syria | 32.814, 35.955 |
| Battle of al-Qadisiyyah | Qadisiyyah | Kufa, Iraq | 32.03, 44.4 |
| First Fitna | *(no single place -- multi-year civil war)* | -- | -- |
| Battle of Karbala | Karbala | Karbala, Iraq | 32.617, 44.033 |
| Dome of the Rock | Jerusalem | Jerusalem, Israel | 31.779, 35.226 |
| Abd al-Malik's reforms | Damascus | Damascus, Syria | 33.513, 36.309 |
| Founding of the Emirate of Córdoba | Córdoba | Córdoba, Spain | 37.89, -4.78 |
| Al-Jabr | Baghdad | Baghdad, Iraq | 33.315, 44.366 |
| Zanj Rebellion | Basra | Basra, Iraq | 30.515, 47.81 |
| Fatimid Caliphate founded | Raqqada | Raqqada, Tunisia | 35.596, 10.057 |
| Abd al-Rahman III's caliphate | Córdoba | Córdoba, Spain | 37.89, -4.78 |
| Buyids take Baghdad | Baghdad | Baghdad, Iraq | 33.315, 44.366 |
| Founding of Cairo and al-Azhar | al-Qahira | Cairo, Egypt | 30.044, 31.236 |
| Taifa dissolution | Córdoba | Córdoba, Spain | 37.89, -4.78 |
| Saladin ends Fatimid rule | Cairo | Cairo, Egypt | 30.044, 31.236 |

Notes and judgment calls:

- **Two rival successor caliphates now appear as real strands, not just the
  Rashidun/Umayyad/Abbasid line**: the Umayyad Emirate of Córdoba (756), its elevation to
  a full Caliphate under Abd al-Rahman III (929) explicitly in response to Fatimid
  religious claims, and its 1031 dissolution into Taifa kingdoms; and the Fatimid
  Caliphate's founding (909), its move to Cairo/al-Azhar (969), and its end under Saladin
  (1171). These were previously invisible even though "Islamic Caliphates" as a topic
  name implies more than one lineage.
- **First Fitna has no `location`**: it's a multi-year civil war fought across several
  named battles (Basra, Siffin, Nahrawan) rather than a single place, so the `location`
  object is omitted entirely per the skill's guidance rather than picking one battle site
  arbitrarily.
- **Yarmouk (636) and Qadisiyyah (636) share a year but are kept as two separate
  events**: they're different campaigns against different empires (Byzantine and Sasanian
  respectively) fought roughly concurrently, both independently significant as the
  conquests that opened the Levant and Iraq/Persia to Muslim rule.
- **Karbala tagged `religion` and `battle`, not `rebellion`**: Husayn's small band was
  making a stand rather than waging an uprising against an existing government it hoped
  to overthrow: the lasting significance is doctrinal (the Sunni-Shia split and Ashura),
  which the tags reflect.
- **No new tags needed** -- everything added fit the existing vocabulary
  (architecture/battle/collapse/founding/governance/rebellion/religion/science).

## Japan (topic id: `japan`) — pulled 2026-08-03

Status: **merged into live seed data 2026-08-03** (`backend/src/history_zoomout/db/seed_data/civilizations.json`, new topic — not previously present) and reseeded. Re-merged 2026-08-06 with the 18-event enrichment pass below (now 28 events total) and reseeded again.

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

### Enrichment pass — 2026-08-05

The original 10-event set was turning-points-only -- foundings, battles, and the
Perry/Meiji bookends. It also skipped the entire 84-year Nara period outright: the
timeline jumped straight from Buddhism's arrival in 552 to the move to Heian-kyō in
794, with nothing in between. This research file (`data/wikipedia-data/civilization/japan.json`)
had no `tags` field on any event, unlike every other topic here -- but the live seed
(`backend/src/history_zoomout/db/seed_data/civilizations.json`) already had tags on all
10 events, added in a bulk tagging pass (`a29b5fc`) that this research file predates and
never absorbed. Initially wrote fresh tags from scratch for those 10 without checking
the seed first, which produced 4 mismatches (Isshi Incident, the Heian-kyō move, the
Ōnin War, and Perry) against what's already live; caught this before merging and
resynced the research file to the seed's existing tags verbatim, same as the China
enrichment pass did. This pass adds eighteen new events spanning the full 300-1868
range: the missing Nara period (capital move, the Kojiki, the Great Buddha's
dedication), Heian court literature, the Genpei War's decisive battle, Zen Buddhism's
introduction, the Kamakura shogunate's fall, the Ashikaga shogunate's founding and
cultural high point, Christianity's arrival and later suppression, Oda Nobunaga and
Toyotomi Hideyoshi's unification campaigns, early Edo governance and rebellion, and
Rangaku scholarship under sakoku.

#### Event-level sources (new events only)

| Event | Year | Article | Wikidata | Image credit |
|---|---|---|---|---|
| Capital moves to Heijō-kyō | 710 AD | [Nara period](https://en.wikipedia.org/wiki/Nara_period) | Q189178 | Binabik155, CC BY 3.0 (map) |
| The Kojiki records Japan's origin myths | 712 AD | [Kojiki](https://en.wikipedia.org/wiki/Kojiki) | Q813031 | Ken'yu / Koten Hozonkai, Public domain |
| Great Buddha of Tōdai-ji is dedicated | 752 AD | [Tōdai-ji](https://en.wikipedia.org/wiki/T%C5%8Ddai-ji) | Q460367 | Anonymous (1930 rubbing), Public domain |
| Murasaki Shikibu writes The Tale of Genji | 1008 AD | [The Tale of Genji](https://en.wikipedia.org/wiki/The_Tale_of_Genji) | Q8269 | Imperial court in Kyoto (Genji emaki), Public domain |
| Battle of Dan-no-ura ends the Genpei War | 1185 AD | [Battle of Dan-no-ura](https://en.wikipedia.org/wiki/Battle_of_Dan-no-ura) | Q968676 | Tosa Mitsunobu (painting), Public domain |
| Eisai introduces Zen Buddhism | 1191 AD | [Eisai](https://en.wikipedia.org/wiki/Eisai) | Q366128 | Unknown artist, Public domain |
| Kenmu Restoration ends the Kamakura shogunate | 1333 AD | [Kenmu Restoration](https://en.wikipedia.org/wiki/Kenmu_Restoration) | Q826021 | Monkan-bō Kōshin (portrait), Public domain |
| Ashikaga Takauji becomes shogun | 1338 AD | [Ashikaga Takauji](https://en.wikipedia.org/wiki/Ashikaga_Takauji) | Q297107 | Unknown artist, Public domain |
| Kinkaku-ji rises as a symbol of Muromachi culture | 1397 AD | [Kinkaku-ji](https://en.wikipedia.org/wiki/Kinkaku-ji) | Q270983 | Nacaru, CC BY-SA 4.0 |
| Francis Xavier introduces Christianity | 1549 AD | [Francis Xavier](https://en.wikipedia.org/wiki/Francis_Xavier) | Q163900 | Illustrated history volume, Public domain |
| Oda Nobunaga topples the Ashikaga shogunate | 1573 AD | [Oda Nobunaga](https://en.wikipedia.org/wiki/Oda_Nobunaga) | Q171411 | Kanō Sōshū (portrait), Public domain |
| Hideyoshi orders the sword hunt | 1588 AD | [Sword hunt](https://en.wikipedia.org/wiki/Sword_hunt) | Q1133763 | Kanō Mitsunobu (portrait), Public domain |
| Japan invades Korea | 1592 AD | [Imjin War](https://en.wikipedia.org/wiki/Imjin_War) | Q576338 | Unknown artist, Public domain |
| Izumo no Okuni originates kabuki | 1603 AD | [Izumo no Okuni](https://en.wikipedia.org/wiki/Izumo_no_Okuni) | Q1334304 | Unknown artist (screen painting), Public domain |
| Shimabara Rebellion erupts | 1637 AD | [Shimabara Rebellion](https://en.wikipedia.org/wiki/Shimabara_Rebellion) | Q696217 | Unknown artist (map), Public domain |
| Sakoku edict seals Japan's borders | 1639 AD | [Sakoku](https://en.wikipedia.org/wiki/Sakoku) | Q332075 | Isaac Titsingh, Public domain |
| Kaitai Shinsho introduces Western medicine | 1774 AD | [Kaitai Shinsho](https://en.wikipedia.org/wiki/Kaitai_Shinsho) | Q1324350 | Babi Hijau, Public domain |
| Ōshio Heihachirō's rebellion | 1837 AD | [Ōshio Heihachirō](https://en.wikipedia.org/wiki/%C5%8CShio_Heihachir%C5%8D) | Q1056715 | Kikuchi Yōsai (portrait), Public domain |

#### Event locations (new events only)

| Event | Historical name | Modern city, country | Coordinates |
|---|---|---|---|
| Capital moves to Heijō-kyō | Heijō-kyō | Nara, Japan | 34.691, 135.796 |
| The Kojiki records Japan's origin myths | Heijō-kyō | Nara, Japan | 34.691, 135.796 |
| Great Buddha of Tōdai-ji is dedicated | Heijō-kyō | Nara, Japan | 34.691, 135.796 |
| Murasaki Shikibu writes The Tale of Genji | Heian-kyō | Kyoto, Japan | 35.012, 135.768 |
| Battle of Dan-no-ura ends the Genpei War | Dan-no-ura | Shimonoseki, Japan | 33.965, 130.957 |
| Eisai introduces Zen Buddhism | Hakata | Fukuoka, Japan | 33.597, 130.414 |
| Kenmu Restoration ends the Kamakura shogunate | Heian-kyō | Kyoto, Japan | 35.012, 135.768 |
| Ashikaga Takauji becomes shogun | Heian-kyō | Kyoto, Japan | 35.012, 135.768 |
| Kinkaku-ji rises as a symbol of Muromachi culture | Kitayama | Kyoto, Japan | 35.040, 135.729 |
| Francis Xavier introduces Christianity | Kagoshima | Kagoshima, Japan | 31.597, 130.557 |
| Oda Nobunaga topples the Ashikaga shogunate | Heian-kyō | Kyoto, Japan | 35.012, 135.768 |
| Hideyoshi orders the sword hunt | — | *(no single site -- nationwide edict)* | — |
| Japan invades Korea | Busanjin | Busan, South Korea | 35.18, 129.075 |
| Izumo no Okuni originates kabuki | Heian-kyō | Kyoto, Japan | 35.012, 135.768 |
| Shimabara Rebellion erupts | Hara Castle | Minamishimabara, Japan | 32.660, 130.298 |
| Sakoku edict seals Japan's borders | Dejima | Nagasaki, Japan | 32.745, 129.874 |
| Kaitai Shinsho introduces Western medicine | Edo | Tokyo, Japan | 35.684, 139.774 |
| Ōshio Heihachirō's rebellion | Osaka | Osaka, Japan | 34.694, 135.502 |

#### Corrections / decisions made this pass

- Tags on the 10 pre-existing events are copied verbatim from the live seed
  (`civilizations.json`), not invented -- Japan was already merged and already tagged
  there (via the `a29b5fc` bulk tagging pass); this research file was just out of sync
  with it. Facts, images, and locations on those 10 are unchanged.
- The Kamakura shogunate's collapse (Kenmu Restoration, 1333, Go-Daigo's restoration) is
  unambiguous. Its successor, the Ashikaga shogunate, has the same disputed-founding
  pattern as Yoritomo's Kamakura shogunate: Takauji is conventionally dated to power in
  1336 (when he issued the Kenmu Code) or 1338 (when he received the shogun title). Went
  with 1338 for the same reason as the original 1192 Yoritomo call -- the event is about
  *becoming shogun* specifically, not the earlier de facto seizure of power.
- Sakoku is usually cited as a series of edicts (1633-1639) rather than a single date;
  used 1639, the final and most restrictive edict (expelling the Portuguese), as the
  single representative year, matching Wikipedia's own framing of that year as when
  "the most comprehensive measures" took effect.
- The Sakoku edict's location is given as Nagasaki/Dejima rather than Edo (where the
  shogunate actually issued it from) because Dejima is the tangible, enduring
  manifestation of the policy -- Japan's sole surviving point of contact with the West
  for the next two centuries -- and the chosen image depicts Dejima specifically.
- Hideyoshi's sword hunt edict has no location field: it was a nationwide policy with no
  single site of issuance, consistent with how the Yellow Turban Rebellion and Grand
  Canal events were handled without locations in China's enrichment pass.

## Indus Valley (topic id: `indus`) — pulled 2026-08-03

Status: **merged into live seed data** (`data/wikipedia-data/civilization/indus.json`).

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

### Tag enrichment — all tags — 2026-08-05

Requested scope: audit and fill gaps across the full tag vocabulary, not one tag.

**Tag sync note**: `data/wikipedia-data/indus.json` had never carried a `tags` field on
any event -- the topic was merged into the live seed data (`eebf7d7`) before the tagging
system existed, and tags were added straight to `civilizations.json` later
(`a29b5fc`) without updating this source file. Before adding anything new, synced the
7 existing events' tags from the live seed data into the source file so the two don't
diverge further: `architecture` x1 (Harappa/Mohenjo-daro rise), `science` x1 (script),
`collapse` x2 (Mature Harappan decline, final fade), the other 4 events untagged.

**Tally before new research**: `architecture` 1, `science` 1, `collapse` 2, `founding` 0,
`governance` 0, `art` 0, `religion` 0, `battle` 0, `rebellion` 0.

**Two existing events also got a tag correction**, not just new events, since these were
plainly missing tags that fit the existing vocabulary's own definitions:
- "Early Farming Villages Rise at Kot Diji" -> added `founding` (it's the civilization's
  origin point).
- "Harappa and Mohenjo-daro Rise" -> added `founding` (twin cities founded) and
  `governance` (the grid planning and standardized brick sizes cited here are the same
  evidence the Metrology literature uses for centralized administrative authority).

**Six new events**, aimed at the zero-coverage tags (`art`, `religion`, `governance`)
plus deepening `architecture` and `science`, all within the existing 3300-1300 BC range:

| Event | Year | Article | Wikidata | Image credit |
|---|---|---|---|---|
| Standardized Weights Regulate Harappan Trade | 2600 BC | [History of measurement systems in India](https://en.wikipedia.org/wiki/History_of_measurement_systems_in_India) | Q1661530 | Nomu420, CC BY-SA 3.0 |
| The Great Bath Is Built at Mohenjo-daro | 2500 BC | [Great Bath](https://en.wikipedia.org/wiki/Great_Bath) | Q3346415 | Aakashaliraza, CC BY-SA 4.0 |
| Terracotta Figurines Spark a 'Mother Goddess' Debate | 2400 BC | [Religion of the Indus Valley Civilisation](https://en.wikipedia.org/wiki/Religion_of_the_Indus_Valley_Civilisation) | Q107969856 | Ismoon, CC0 |
| Dholavira's Reservoirs Turn a Desert City Water-Secure | 2350 BC | [Dholavira](https://en.wikipedia.org/wiki/Dholavira) | Q9468 | Bhajish Bharathan, CC BY-SA 4.0 |
| The 'Dancing Girl' Bronze Is Cast at Mohenjo-daro | 2300 BC | [Dancing Girl (prehistoric sculpture)](https://en.wikipedia.org/wiki/Dancing_Girl_(prehistoric_sculpture)) | Q17008494 | Gary Todd, CC0 |
| The Pashupati Seal Depicts a Horned Deity | 2200 BC | [Pashupati seal](https://en.wikipedia.org/wiki/Pashupati_seal) | Q1942840 | Unknown Indus Valley sealmaker, Public domain |

### New event locations

| Event | Historical name | Modern city, country | Coordinates |
|---|---|---|---|
| The Great Bath Is Built at Mohenjo-daro | Mohenjo-daro | Larkana, Pakistan | 27.329, 68.139 |
| Dholavira's Reservoirs Turn a Desert City Water-Secure | Dholavira | Bhachau, India | 23.889, 70.214 |
| The 'Dancing Girl' Bronze Is Cast at Mohenjo-daro | Mohenjo-daro | Larkana, Pakistan | 27.329, 68.139 |
| The Pashupati Seal Depicts a Horned Deity | Mohenjo-daro | Larkana, Pakistan | 27.329, 68.139 |

Standardized weights and the Mother Goddess figurine tradition are both civilization-wide
practices without one natural findspot, so left without a `location`, consistent with how
the script and Mesopotamia-trade events are already handled.

### Corrections / notes from this pass

- The Pashupati seal's find-year is given as 1928 or 1929 by its own article but its
  *subject matter* dates to roughly 2350-2000 BC (the "Intermediate I" period); used
  2200 BC, the midpoint commonly cited, as the event year -- the seal's creation date,
  not its excavation date.
- "Mother Goddess" is presented as a live scholarly debate, not settled fact: Marshall's
  original fertility-cult reading is widely doubted today (Sharri Clark and others argue
  the figurines are more likely dolls or ornaments). The event body reflects that
  uncertainty rather than asserting the goddess-cult reading as established.
- Lothal's dockyard was considered and dropped: whether the structure was a maritime dock
  at all is actively disputed in the sources checked (critics read it as an irrigation
  tank; Wadi al-Jarf in Egypt has a stronger claim to "world's earliest dock"), so it
  didn't clear the "genuinely significant, independently verifiable" bar as cleanly as
  the six events above.
- `battle` and `rebellion` are still at zero and deliberately left that way -- the
  Indus Valley Civilisation's archaeological record is notably light on evidence of
  warfare or internal conflict (no fortified elite quarters, no depicted battle scenes,
  no weapons caches on the scale seen in Mesopotamia or Egypt), and Wikipedia's own
  coverage reflects that absence. Forcing events into either tag here would misrepresent
  the civilization rather than fill a real gap.
- The tracking-doc status line at the top of this topic's entry previously read
  "researched, not yet merged into live seed data," which was stale even before this
  pass -- `eebf7d7` had already merged Indus Valley into `civilizations.json` back on
  2026-08-03. Corrected it above to reflect that, since this pass also merges the new
  enrichment in.

**Tally after this pass**: `architecture` 3, `art` 3, `battle` 0, `collapse` 2,
`founding` 2, `governance` 2, `religion` 3, `rebellion` 0, `science` 4.

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

### Enrichment pass — 2026-08-06

The original 9-event pass was entirely political/military (foundings, sieges, battles,
one treaty, two reform/constitutional moments) and covered only the empire's rise,
classical-age peak, and final collapse. Missing entirely: `architecture`, `art`,
`science`, `religion`, and every sub-period between 1571 and 1839 except the 1699
treaty. This pass fills those gaps across the full 1299–1922 span rather than targeting
a single tag, adding 14 events and roughly doubling the topic's coverage.

New events by theme/sub-period:
- **Classical-age religion/architecture/science**: Selim I's 1517 conquest of the
  Mamluk Sultanate and assumption of the caliphate; the 1557 completion of the
  Süleymaniye Mosque; Taqi al-Din's 1577 Istanbul observatory.
- **18th-century Tulip Era arc**: its 1718 opening (art/architecture), the 1727
  founding of the first Ottoman printing press (science), and the 1730 Patrona Halil
  revolt that ended it (rebellion/governance) — three events covering one coherent
  cultural period from three different angles, rather than one flat entry.
- **18th–19th century retreat**: the 1774 Treaty of Küçük Kaynarca (first major
  territorial/diplomatic retreat, distinct from and earlier than the 1699 Karlowitz
  entry already in the dataset); the 1826 Auspicious Incident (Mahmud II abolishes the
  janissary corps); the 1830 London Protocol recognizing Greek independence (the
  empire's first loss of a subject nation to nationalist revolution); the 1876 first
  Ottoman constitution; the 1878 Congress of Berlin.
- **WWI-era end**: the 1913 Treaty of London/Balkan Wars (loss of nearly all remaining
  European territory); the 1915 Gallipoli campaign (a rare late Ottoman military
  success); the 1915 Armenian genocide.

#### Event-level sources

| Event | Year | Article | Wikidata | Image credit |
|---|---|---|---|---|
| Selim I conquers the Mamluk Sultanate, claims the caliphate | 1517 | [Ottoman–Mamluk War (1516–1517)](https://en.wikipedia.org/wiki/Ottoman%E2%80%93Mamluk_War_(1516%E2%80%931517)) | Q4338038 | 1518 Basel news pamphlet, Public domain |
| Mimar Sinan completes the Süleymaniye Mosque | 1557 | [Süleymaniye Mosque](https://en.wikipedia.org/wiki/S%C3%BCleymaniye_Mosque) | Q178643 | Hunanuk, CC0 |
| Taqi al-Din founds the Istanbul Observatory | 1577 | [Constantinople observatory of Taqi ad-Din](https://en.wikipedia.org/wiki/Constantinople_observatory_of_Taqi_ad-Din) | Q3348357 | Ala ad-Din Mansur-Shirazi (Şehinşahname miniature), Public domain |
| The Tulip Era begins | 1718 | [Tulip Period](https://en.wikipedia.org/wiki/Tulip_Period) | Q1343901 | Julien Maury, Public domain |
| İbrahim Müteferrika opens the first Ottoman printing press | 1727 | [Ibrahim Muteferrika](https://en.wikipedia.org/wiki/Ibrahim_Muteferrika) | Q561445 | Ogodej (statue photo), CC BY-SA 3.0 |
| Patrona Halil Revolt ends the Tulip Era | 1730 | [Patrona Halil](https://en.wikipedia.org/wiki/Patrona_Halil) | Q2305326 | Jean Baptiste Vanmour, Public domain |
| Treaty of Küçük Kaynarca | 1774 | [Treaty of Küçük Kaynarca](https://en.wikipedia.org/wiki/Treaty_of_K%C3%BC%C3%A7%C3%BCk_Kaynarca) | Q123227 | 18th-c. allegorical engraving, Cabinet of Engravings of the Romanian Academy, Public domain |
| Auspicious Incident (abolition of the janissaries) | 1826 | [Auspicious Incident](https://en.wikipedia.org/wiki/Auspicious_Incident) | Q2665576 | Christoph Weigel the Elder / Caspar Luyken, Public domain |
| London Protocol recognizes Greek independence | 1830 | [London Protocol (1830)](https://en.wikipedia.org/wiki/London_Protocol_(1830)) | Q839396 | Ludwig Michael von Schwanthaler (fresco), Public domain |
| First Ottoman constitution | 1876 | [First Constitutional Era](https://en.wikipedia.org/wiki/First_Constitutional_Era) | Q3545916 | The Graphic (1877), Public domain |
| Congress of Berlin | 1878 | [Congress of Berlin](https://en.wikipedia.org/wiki/Congress_of_Berlin) | Q151423 | Anton von Werner, Public domain |
| Balkan Wars / Treaty of London | 1913 | [Treaty of London (1913)](https://en.wikipedia.org/wiki/Treaty_of_London_(1913)) | Q584617 | Public domain (self-scanned) |
| Gallipoli campaign | 1915 | [Gallipoli campaign](https://en.wikipedia.org/wiki/Gallipoli_campaign) | Q164983 | George Washington Lambert, Public domain |
| Armenian genocide | 1915 | [Armenian genocide](https://en.wikipedia.org/wiki/Armenian_genocide) | Q80034 | *Ravished Armenia* (1918), Public domain |

#### Event locations

| Event | Historical name | Modern city, country | Coordinates |
|---|---|---|---|
| Selim I / Mamluk conquest | Cairo | Cairo, Egypt | 30.040, 31.240 |
| Süleymaniye Mosque | Constantinople | Istanbul, Turkey | 41.014, 28.955 |
| Taqi al-Din observatory | Constantinople | Istanbul, Turkey | 41.014, 28.955 |
| Tulip Era | Constantinople | Istanbul, Turkey | 41.014, 28.955 |
| Müteferrika printing press | Constantinople | Istanbul, Turkey | 41.014, 28.955 |
| Patrona Halil Revolt | Constantinople | Istanbul, Turkey | 41.014, 28.955 |
| Treaty of Küçük Kaynarca | Küçük Kaynarca | Kaynardzha, Bulgaria | 43.983, 27.500 |
| Auspicious Incident | Constantinople | Istanbul, Turkey | 41.014, 28.955 |
| London Protocol | London | London, United Kingdom | 51.510, -0.130 |
| First Ottoman constitution | Constantinople | Istanbul, Turkey | 41.014, 28.955 |
| Congress of Berlin | Berlin | Berlin, Germany | 52.520, 13.405 |
| Balkan Wars / Treaty of London | London | London, United Kingdom | 51.510, -0.130 |
| Gallipoli campaign | Gallipoli | Gelibolu, Turkey | 40.410, 26.670 |
| Armenian genocide | Constantinople | Istanbul, Turkey | 41.014, 28.955 |

#### Decisions / judgment calls

- **Backfilled `tags` on the original 9 events.** The source JSON (`data/wikipedia-data/civilization/ottoman.json`)
  was missing the `tags` field on every event from the first pass, even though the live
  merged seed (`backend/.../civilizations.json`) already has them — an inconsistency
  predating this pass, not introduced by it. Restored the tags from the live seed
  (`founding`, `battle`/`collapse`, etc.) so this source file is now internally complete
  and a future merge from it won't silently drop the existing tags.
- **No new tag added for the Armenian genocide**, even though none of the existing nine
  tags (`architecture`, `art`, `battle`, `collapse`, `founding`, `governance`,
  `rebellion`, `religion`, `science`) describes it precisely. Tagged it `collapse` as
  the closest fit (it's part of the empire's terminal wartime unraveling) rather than
  inventing a dedicated tag for a single event across the whole dataset.
- **Treaty of Küçük Kaynarca (1774) kept distinct from Karlowitz (1699).** Both are
  Ottoman treaty losses, but 75 years apart and different in kind: Karlowitz ends a
  war after the 1683 Vienna defeat (already captured by that `major` entry per the
  original pass's reasoning), while Küçük Kaynarca is the empire's first loss of a
  Muslim vassal state's sovereignty and the origin of Russia's claimed protector role
  over Ottoman Orthodox Christians — a distinct, longer-running precedent, not a
  restatement of the 1699 retreat.
- **Balkan Wars represented via the Treaty of London (1913)** rather than the war
  itself, since the topic already has several `battle`-tagged sieges and the treaty is
  what fixes the war's actual consequence for the empire (loss of nearly all European
  territory) in a single dated, sourceable event.
- **Location for the London Protocol and Treaty of London events set to London**, not a
  Balkan/Greek location, since both are diplomatic instruments signed there and neither
  war has one natural single battlefield to anchor the entry to.
- **Two 1915 events (Gallipoli, Armenian genocide) both present.** They're unrelated in
  substance (a military campaign vs. a civilian atrocity) and both independently
  significant to the empire's final years, so neither is redundant with the other.
- Kept full diacritics for non-English names introduced in this pass (İbrahim
  Müteferrika, Küçük Kaynarca, Kaynardzha), consistent with the original pass's
  approach.

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

### Tag enrichment — 2026-08-05

This file predates the tags feature (shipped 2026-08-04, after Maya's original pull and
merge), so its 12 events carried no `tags` field even though the live
`backend/src/history_zoomout/db/seed_data/civilizations.json` copy already had them
(added directly to the seed data at merge time). Backfilled all 12 existing events'
tags here first so this file matches what's live, then tallied coverage per
`docs/wikipedia-tags.md`: `governance` and `religion` had zero events; `art`, `science`,
`founding`, and `rebellion` had only one each across the full ~3700-year span;
`architecture`, `collapse`, and `battle` were already reasonably covered (3-4 events
each). User asked to research all tags for Maya broadly. Six events added, spread
across all three sub-periods, targeting the zero/thin tags — `rebellion` (already
covered by the existing 1441 Mayapan-collapse event) was left alone since no comparably
significant, independently-dateable second rebellion turned up in research.

| Event | Year | Article | Wikidata | Tags | Image credit |
|---|---|---|---|---|---|
| The San Bartolo murals depict Maya creation mythology and kingship | c. 100 BC | [San Bartolo (Maya site)](https://en.wikipedia.org/wiki/San_Bartolo_(Maya_site)) | Q795599 | religion, art | Authenticmaya, CC BY-SA 3.0 |
| K'inich Yax K'uk' Mo' founds the Copán dynasty | 426 AD | [Kʼinich Yax Kʼukʼ Moʼ](https://en.wikipedia.org/wiki/K%CA%BCinich_Yax_K%CA%BCuk%CA%BC_Mo%CA%BC) | Q4164172 | founding | DuendeThumb, CC BY-SA 3.0 |
| Kan Bahlam II dedicates the Group of the Cross at Palenque | c. 690 AD | [Temple of the Cross Complex](https://en.wikipedia.org/wiki/Temple_of_the_Cross_Complex) | Q7698757 | religion, art | Mdcarrasco, Public domain |
| Yajaw Chan Muwaan II commissions the Bonampak murals | c. 790 AD | [Bonampak](https://en.wikipedia.org/wiki/Bonampak) | Q605455 | art, battle | Jacob Rus, CC BY-SA 2.0 |
| Scribes compile the Dresden Codex | c. 1200 AD | [Dresden Codex](https://en.wikipedia.org/wiki/Dresden_Codex) | Q200944 | science | Unknown, Public domain |
| Mayapan adopts multepal, a council of noble lineages | c. 1221 AD | [Mayapan](https://en.wikipedia.org/wiki/Mayapan) | Q567966 | governance | HJPD, CC BY-SA 3.0 |

Locations:

| Event | Historical name | Modern city, country | Coordinates |
|---|---|---|---|
| San Bartolo murals | San Bartolo | —, Guatemala | not found |
| Copán dynasty founding | Copán | Copán Ruinas, Honduras | 14.838, -89.143 |
| Group of the Cross | Lakamha | Palenque, Mexico | 17.484, -92.046 (reused from the existing Pakal event, same site) |
| Bonampak murals | Bonampak | Bonampak, Mexico | 16.704, -91.065 |
| Dresden Codex | Chichen Itza | Chichen Itza, Mexico | 20.683, -88.569 (the codex's region of origin per its Wikipedia article, not its current home in Dresden) |
| Mayapan multepal | Mayapan | Telchaquillo, Mexico | not found (same as the existing Mayapan events) |

Notes and judgment calls:

- **San Bartolo year**: the murals are carbon-dated to "100 BC" without a narrower range
  given; used -100 as a single-year anchor.
- **San Bartolo image**: Commons lists the uploader as "Authenticmaya~commonswiki" —
  treated as the artist name (a Commons username, not a blank/missing Artist field) per
  the skill's attribution rule.
- **Group of the Cross year**: Wikipedia confirms Kʼinich Kan Bʼalam II reigned 684-702
  AD and built the complex during that reign, but gives no specific dedication year (the
  c. 692 AD date commonly cited elsewhere isn't sourced in the Wikipedia article text, so
  it wasn't used). Used c. 690 AD — early-to-mid reign, distinct from Pakal's 615 AD
  accession — as a placeholder, same approach as Persia's Taq-e Bostan/Khosrow I
  reform-year placeholders.
- **Group of the Cross image**: used a public-domain reconstruction illustration
  (showing all three temples together) instead of a single-temple photo, since the event
  is about the whole complex's dedication rather than one building.
- **Bonampak commissioner**: confirmed against the article that Bonampak's own ruler,
  Yajaw Chan Muwaan II — a Yaxchilan vassal since 600 AD — commissioned the murals to
  commemorate his son Chooj's accession; an initial fetch had this garbled as "Yaxchilan's
  king... installing Chan Muwaan II," which the article's actual text doesn't support.
  Lintel dates run 780-787 AD; used 790 AD as the murals' overall completion estimate.
- **Dresden Codex year**: Wikipedia cites a range of scholarly estimates (Thompson:
  1200-1250 AD; Satterthwaite: no later than 1345 AD); used 1200 AD, the earliest end of
  the range, to keep it clearly distinct from the existing 1220 AD Mayapan-founding event.
- **Multepal year**: no exact founding year given; anchored to "a revolt around 1221 CE"
  against Chichen Itza that Wikipedia ties to Mayapan's rise — placed one year after the
  existing 1220 AD Mayapan-founding event (same city, distinct subject: the political
  structure rather than the city's construction).
- **Copán founding image**: the ceramic incense burner (Yax_Kuk_Mo.jpg) is a later,
  7th-century artifact believed to depict the founder, not a contemporary 426 AD image —
  noted here since no image from the founding's own era exists.

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

### Enrichment pass — pulled 2026-08-06

Status: **merged into live seed data 2026-08-06** (`backend/src/history_zoomout/db/seed_data/civilizations.json`) and reseeded (local dev database). The original 11-event pass
was entirely political/military (foundings and battles, plus one religion event) with
no governance, art, or trade/eastern-diaspora coverage -- the same skew the skill's
process warns against. Added 6 events spanning governance, art, and the Rus'
diaspora's eastward reach into Byzantium, taking the topic from 11 to 17 events. The
existing `data/wikipedia-data/civilization/vikings.json` file was also brought back in
sync with the live seed's `tags` field, which it had been missing entirely (a gap from
before tags existed in this dataset -- carried the seed's existing tag assignments over
unchanged rather than editorializing on them while doing an unrelated pass).

**New events:**

| Event | Year | Article | Wikidata | Image credit |
|---|---|---|---|---|
| The Oseberg ship burial | 834 | [Oseberg ship](https://en.wikipedia.org/wiki/Oseberg_ship) | Q832395 | Petter Ulleland (photo), CC BY-SA 4.0 |
| Alfred the Great defeats Guthrum at Edington | 878 | [Battle of Edington](https://en.wikipedia.org/wiki/Battle_of_Edington) | Q2305651 | Trish Steel (photo, memorial stone), CC BY-SA 2.0 |
| Icelandic settlers found the Althing at Þingvellir | 930 | [Althing](https://en.wikipedia.org/wiki/Althing) | Q131279 | W. G. Collingwood (painting), Public domain |
| Byzantine emperor Basil II forms the Varangian Guard | 988 | [Varangian Guard](https://en.wikipedia.org/wiki/Varangian_Guard) | Q1464130 | Unknown (Piraeus Lion runestone photo), Public domain |
| Iceland adopts Christianity by vote of the Althing | 1000 | [Christianization of Iceland](https://en.wikipedia.org/wiki/Christianization_of_Iceland) | Q2965816 | Andreas Tille (photo, Goðafoss), CC BY-SA 4.0 |
| Brian Boru breaks Viking power at Clontarf | 1014 | [Battle of Clontarf](https://en.wikipedia.org/wiki/Battle_of_Clontarf) | Q868027 | Hugh Frazer (1826 painting), Public domain |

**New event locations:**

| Event | Historical name | Modern city, country | Coordinates |
|---|---|---|---|
| Oseberg ship burial | Oseberg | Tønsberg, Norway | 59.268, 10.408 |
| Battle of Edington | Edington | Edington, United Kingdom | 51.277, -2.106 |
| Althing founded | Þingvellir | Þingvellir, Iceland | 64.254, -21.037 |
| Varangian Guard formed | Constantinople | Istanbul, Turkey | 41.013, 28.980 |
| Iceland adopts Christianity | Þingvellir | Þingvellir, Iceland | 64.254, -21.037 |
| Battle of Clontarf | Clontarf | Dublin, Ireland | 53.365, -6.210 |

Oseberg has no coordinates on its own article -- used Tønsberg, the nearest named
modern town, per the skill's fallback pattern.

**Corrections / decisions made:**

- **Piraeus Lion image has no `Artist` field in its Commons extmetadata.** Per this
  project's relaxed image-attribution guidance, used it anyway since it carries a clear
  license (public domain) and a real description (runic inscriptions naming the
  Varangians/Swedish warriors who served as Byzantine mercenaries) -- credited the named
  work ("Photo of the Piraeus Lion") in place of a missing artist.
- **Iceland's Christianization (1000) and Leif Erikson's Vinland voyage (1000) share a
  year** -- both are conventional/traditional dates rather than exactly-dated events, so
  no ordering significance was implied between them; they're simply adjacent in the
  chronological list.
- **Christianization of Iceland's image is Goðafoss, not Þingvellir**, even though the
  event's `location` is set to Þingvellir (where the Althing vote actually happened).
  The waterfall illustrates the well-known legend, mentioned in the body, that lawspeaker
  Thorgeir cast his pagan idols into it after the vote -- kept as the image since it's a
  more visually distinctive and directly-cited detail than a generic site photo of
  Þingvellir, which is already used for the Althing-founding event two entries earlier.
- **Considered but not added:** the Siege of Paris (845) and Sweyn Forkbeard's 1013
  conquest of England. Siege of Paris would be additive but Rollo's Normandy founding
  (911) already covers the Viking-Francia thread; Sweyn's conquest is largely redundant
  with his son Cnut's already-covered 1016 event one entry later, since the political
  substance (a Danish king briefly holding the English throne) is the same beat told
  twice three years apart.

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

## Khmer Empire (topic id: `khmer`) — pulled 2026-08-03

Status: **merged into live seed data 2026-08-03** (`backend/src/history_zoomout/db/seed_data/civilizations.json`, replacing the old 5-event entry wholesale) and reseeded. Kept the existing `id` (`khmer`), `colorIndex` (3), and date range (802-1431).

The original 5-event pilot entry (802 founding, 900 capital move, 1113 Angkor Wat, 1296
Zhou Daguan, 1431 fall) skipped the entire Jayavarman VII era (r. 1181-1218) — the reign
historians generally consider the empire's most powerful, and the one that built Angkor
Thom and the Bayon — along with the 1177 Cham sack of Angkor that made his rise possible.
Same pattern as the Persia pilot's missing Parthian era: the most-famous monument
(Angkor Wat) was covered, but the empire's actual military/political peak wasn't.
Expanded to 7 events adding the 1177 sack and the 1181 restoration under Jayavarman VII.

### Topic-level source

- **Khmer Empire** — https://en.wikipedia.org/wiki/Khmer_Empire — Wikidata Q201705 —
  this article's own scope (802-1431) matches the topic's date range exactly.
- Image: **Map of Southeast Asia, c. 900 CE** (Jembezmamy, CC0), the article's own lead
  thumbnail, showing the Khmer Empire's territory next to Champa and other neighboring
  states — kept as a genuinely informative period map rather than swapped for a temple
  photo, since Angkor Wat and Angkor Thom photos are already used at the event level and
  a third photo of the same temple complex would have been redundant.

### Event-level sources

| Event | Year | Article | Wikidata | Image credit |
|---|---|---|---|---|
| Jayavarman II founds the Khmer Empire | 802 | [Jayavarman II](https://en.wikipedia.org/wiki/Jayavarman_II) | Q379239 | Xufanc, CC BY-SA 3.0 |
| Yasodharapura becomes the capital | 900 | [Yasovarman I](https://en.wikipedia.org/wiki/Yasovarman_I) | Q559810 | Satdeep Gill, CC BY-SA 4.0 |
| Construction of Angkor Wat begins | 1113 | [Angkor Wat](https://en.wikipedia.org/wiki/Angkor_Wat) | Q43473 | Bjørn Christian Tørrissen, CC BY-SA 4.0 |
| The Cham sack Angkor | 1177 | [Battle of Tonlé Sap](https://en.wikipedia.org/wiki/Battle_of_Tonl%C3%A9_Sap) | Q23719075 | Photo Dharma, CC BY 2.0 (Bayon bas-relief) |
| Jayavarman VII expels the Cham and rebuilds Angkor | 1181 | [Jayavarman VII](https://en.wikipedia.org/wiki/Jayavarman_VII) | Q335273 | Suzan Black, CC BY 3.0 (Bayon-style sculpture, Musée Guimet) |
| A Chinese envoy records daily life | 1296 | [Zhou Daguan](https://en.wikipedia.org/wiki/Zhou_Daguan) | Q197958 | Photo Dharma, CC BY 2.0 (Bayon bas-relief) |
| Ayutthaya sacks Angkor | 1431 | [Fall of Angkor](https://en.wikipedia.org/wiki/Fall_of_Angkor) | Q24945556 | Supanut Arunoprayote, CC BY 4.0 (Ta Prohm) |

### Event locations

Every event is anchored to Angkor itself (13.4125, 103.866667) except the founding, which
uses the mountain where Jayavarman II was consecrated:

| Event | Historical name | Modern city, country | Coordinates |
|---|---|---|---|
| Jayavarman II founds the empire | Mahendraparvata | —, Cambodia (Phnom Kulen) | 13.613, 104.113 |
| Yasodharapura becomes the capital | Yasodharapura | Angkor, Cambodia | 13.4125, 103.867 |
| Angkor Wat construction begins | Angkor Wat | Angkor, Cambodia | 13.4125, 103.867 |
| The Cham sack Angkor | Yasodharapura | Angkor, Cambodia | 13.4125, 103.867 |
| Jayavarman VII rebuilds Angkor | Angkor Thom | Angkor, Cambodia | 13.4125, 103.867 |
| Chinese envoy records daily life | Angkor | Angkor, Cambodia | 13.4125, 103.867 |
| Ayutthaya sacks Angkor | Angkor | Angkor, Cambodia | 13.4125, 103.867 |

Angkor Thom has no coordinates on Wikipedia or Wikidata (checked both); it sits a few
hundred meters north of Angkor Wat, so Angkor's own coordinates were reused rather than
left null, consistent with how this dataset reuses a shared city's coordinates across
multiple events already anchored there (e.g. Japan's repeated Heian-kyō/Kyoto
coordinates).

### Corrections / decisions made vs. the original 5-event seed data

- **Added "The Cham Sack Angkor" (1177) and "Jayavarman VII Expels the Cham and Rebuilds
  Angkor" (1181), both `major`.** These fill the empire's actual military/political peak,
  entirely absent from the original 5 events — Jayavarman VII is the king who built
  Angkor Thom and the Bayon and is "generally considered the most powerful of the Khmer
  monarchs" per his own Wikipedia article, yet no event referenced him at all.
- **"Yasodharapura Becomes the Capital" (900) kept its existing year, title, and framing**
  — Wikipedia doesn't give an exact founding year for Yasodharapura (inscriptional
  evidence points to roughly 897-902), so 900 was kept as a reasonable circa figure
  already falling within that range, same approach as Persepolis (Persia) and Ashurbanipal's
  library (Mesopotamia).
- **Corrected a popular myth almost repeated into the dataset**: the "Leper King" epithet
  is commonly but incorrectly associated with Yasovarman I. Wikipedia's own Terrace of the
  Leper King article clarifies the statue actually depicts Yama and dates from the 12th-13th
  century, a century-plus after Yasovarman I's 889-910 reign — the body text was written to
  avoid repeating this conflation.
- **"The Cham Sack Angkor" and "Jayavarman VII..." both located at Angkor**, not a
  battle-specific site — the Battle of Tonlé Sap was a naval engagement on the lake/river
  approach to the capital, and the sack itself happened at the city (Yasodharapura); no
  single battlefield coordinate is documented separately from the capital.
- No usable photo found for Jayavarman II or Zhou Daguan themselves (neither article's
  images list contained anything but icons/wiki-chrome). Used Phnom Kulen (the
  consecration site) for Jayavarman II, and a Bayon bas-relief of everyday domestic life
  for Zhou Daguan, whose account is famous for describing exactly that kind of scene — both
  thematically fitting rather than literal depictions, consistent with the Mongol topic's
  Toluid Civil War precedent for events with no direct image match.
- "Ayutthaya Sacks Angkor" uses a photo of Ta Prohm (jungle-reclaimed ruins) rather than a
  period map or battle scene — no contemporary depiction of the 1431 siege itself was
  found, and Ta Prohm's overgrown state is a widely recognized visual shorthand for
  Angkor's abandonment, similar in spirit to Vikings' image swap to a directly-tied site
  photo over a more generic option.

### Gap-filling enrichment — 2026-08-06

Not yet re-merged into live seed data -- this is a research pass only; merging is a
separate step. Note: the live-merged copy of this topic already carries `tags` on every
event (added during the original 2026-08-03 merge, evidently by hand rather than by this
skill), while the `data/wikipedia-data/civilization/khmer.json` file on disk before this
pass did not. This pass pulled the live tags forward into the JSON file so it matches
what's actually deployed, then added the eleven new events below with tags of their own,
so the file is now the accurate superset going into any future merge.

The original 7-event pass covered the founding, the move to Yasodharapura, Angkor Wat,
the Cham sack, Jayavarman VII's recovery, Zhou Daguan's visit, and the 1431 fall -- but
had zero events tagged `science`, `governance`, `art`, or `rebellion`, only one
`collapse` event, and skipped entire reigns: Indravarman I's founding building program,
the succession war that brought Suryavarman I to power, the two-century swing from
Buddhism back to Hinduism and permanently to Theravada Buddhism under Jayavarman VII's
13th-century successors, the Mongol Yuan threat, and two Ayutthaya captures of Angkor
before the final one in 1431. Eleven events added to close these gaps, merged into the
existing `events[]` and re-sorted chronologically (now 18 events total).

| Event | Year | Article | Wikidata | Tags | Image credit |
|---|---|---|---|---|---|
| Indravarman I builds Bakong and a new reservoir | 881 | [Bakong](https://en.wikipedia.org/wiki/Bakong) | Q788982 | architecture, science | Photo Dharma, CC BY 2.0 (photo) |
| Yasovarman I completes the East Baray | 900 | [East Baray](https://en.wikipedia.org/wiki/East_Baray) | Q307080 | science, architecture | Diego Delso, CC BY-SA 3.0 (photo of East Mebon) |
| Courtiers consecrate Banteay Srei | 967 | [Banteay Srei](https://en.wikipedia.org/wiki/Banteay_Srei) | Q790099 | art, religion, architecture | Public domain (bas relief photo) |
| Suryavarman I ends a civil war and reforms the bureaucracy | 1010 | [Suryavarman I](https://en.wikipedia.org/wiki/Suryavarman_I) | Q501356 | governance, rebellion | Diego Delso, CC BY-SA 3.0 (photo of Phimeanakas) |
| Jayavarman VII builds a network of hospitals | 1186 | [Ta Prohm Kel](https://en.wikipedia.org/wiki/Ta_Prohm_Kel) | Q15530942 | governance, science | Arabsalam, CC BY-SA 3.0 (photo) |
| Jayavarman VIII reverses course to Hinduism | 1243 | [Jayavarman VIII](https://en.wikipedia.org/wiki/Jayavarman_VIII) | Q879224 | religion | Dmitry A. Mottl, CC BY-SA 4.0 (photo of the Bayon) |
| Jayavarman VIII buys peace with the Mongol Yuan court | 1285 | [Jayavarman VIII](https://en.wikipedia.org/wiki/Jayavarman_VIII) | Q879224 | governance | Araniko, public domain (portrait of Kublai Khan) |
| Indravarman III makes Theravada Buddhism the state religion | 1295 | [Indravarman III](https://en.wikipedia.org/wiki/Indravarman_III) | Q7495118 | religion, rebellion | Cerie1914, CC BY-SA 4.0 (photo of a Preah Khan statue) |
| Ayutthaya captures Angkor for the first time | 1353 | [Fall of Angkor](https://en.wikipedia.org/wiki/Fall_of_Angkor) | Q24945556 | battle | Colin W, CC BY-SA 3.0 (photo of Angkor Thom's south gate) |
| Khmer forces retake Angkor from Siamese rule | 1357 | [Fall of Angkor](https://en.wikipedia.org/wiki/Fall_of_Angkor) | Q24945556 | battle | Stephen Bain, CC BY-SA 4.0 (photo of Angkor Thom's east gate) |
| Ayutthaya captures Angkor a second time | 1393 | [Fall of Angkor](https://en.wikipedia.org/wiki/Fall_of_Angkor) | Q24945556 | battle, collapse | Sabyk2001, CC BY-SA 4.0 (photo of Wat Phra Si Sanphet) |

Locations:

| Event | Historical name | Modern city, country | Coordinates |
|---|---|---|---|
| Indravarman I's Bakong and reservoir | Hariharalaya | Roluos, Cambodia | 13.34, 103.97 |
| East Baray | Yasodharapura | Angkor, Cambodia | 13.45, 103.92 |
| Banteay Srei | Banteay Srei | Angkor, Cambodia | 13.60, 103.96 |
| Suryavarman I's reforms | Yasodharapura | Angkor, Cambodia | 13.4125, 103.866667 |
| Jayavarman VII's hospitals | Ta Prohm Kel | Angkor, Cambodia | 13.42, 103.86 |
| Jayavarman VIII's reversal to Hinduism | Angkor Thom | Angkor, Cambodia | 13.4125, 103.866667 |
| Mongol tribute | *(no single place -- empire-wide diplomatic decision)* | -- | -- |
| Indravarman III's Theravada shift | Angkor Thom | Angkor, Cambodia | 13.4125, 103.866667 |
| 1353 Ayutthaya capture | Angkor Thom | Angkor, Cambodia | 13.4125, 103.866667 |
| 1357 Khmer recapture | Angkor Thom | Angkor, Cambodia | 13.4125, 103.866667 |
| 1393 Ayutthaya capture | Angkor Thom | Angkor, Cambodia | 13.4125, 103.866667 |

Notes and judgment calls:

- **Dropped a claimed 1268 Mongol invasion of Cambodia.** The Jayavarman VIII article
  states a "Mongol army of approximately 300,000" invaded and was repelled by "100,000"
  Khmer war elephants -- these figures are wildly out of scale for any documented Mongol
  or Khmer military force of the era and aren't corroborated by the Mongol invasions of
  Southeast Asia literature, so this was treated as unreliable and left out. The 1283
  naval campaign and 1285 tribute are kept: they're corroborated by the historically
  well-documented Yuan campaign against neighboring Champa under general Sagatu, and the
  1291 tribute mission is independently attested in Chinese records cited by the same
  article.
- **The 1285 tribute event carries no `battle` tag and no `location`.** No Mongol force
  is documented as having engaged Khmer territory directly -- the empire avoided invasion
  precisely by paying tribute while the Yuan fleet campaigned against Champa -- so this
  reads as a diplomatic/administrative decision (`governance`), not a military one, and
  has no single physical site.
- **Also skipped a same-article claim that Rajendravarman II "drove back the Cholas" in
  947 and "captured the capital of Srivijaya" in 952.** Neither claim is corroborated
  elsewhere (Chola-Khmer contact is otherwise first documented around 1012, under
  Suryavarman I, and a Khmer capture of Srivijaya's own overseas capital isn't attested
  in the wider literature), so no event was built from this and Rajendravarman
  II's reign otherwise remains uncovered by this pass.
- **"Indravarman III" is the correct title, not "Srindravarman."** The REST summary for
  `/wiki/Srindravarman` actually resolves to the "Indravarman III" article/title
  (`Srindravarman` is a secondary regnal name); used the canonical title as `sourceUrl`.
- **1353, 1357, and 1393 all reuse the "Fall of Angkor" article and its Wikidata ID
  (`Q24945556`)**, same as the existing 1431 event -- that article's own scope already
  covers the full sequence of Ayutthaya-Angkor conflicts from 1352 through 1431, so it's
  the correct single source for all four entries in the series, not just the last one.
- **No usable photo exists for the 1357 recapture or Mongol tribute events as standalone
  subjects**, so both use thematically-tied substitutes (a second Angkor Thom gate for
  the recapture, a Kublai Khan court portrait for the tribute) rather than a literal
  depiction -- consistent with the precedent already set by this topic's original pass
  (Phnom Kulen for Jayavarman II, a Bayon bas-relief for Zhou Daguan).
- **The Banteay Srei bas-relief image is hosted on English Wikipedia itself, not
  Wikimedia Commons** (`upload.wikimedia.org/wikipedia/en/...`), and carries no `Artist`
  field -- verified directly on the file's description page that it's a genuine public-domain
  release by the copyright holder rather than fair-use/non-free content before using it,
  and attributed it "via Wikipedia" rather than "via Wikimedia Commons" to reflect where
  it actually lives, credit going to the work rather than a named artist, consistent with
  this project's relaxed-attribution approach for images that are properly licensed and
  described but lack an artist name.
- **No new tags needed** -- everything added fit the existing vocabulary
  (architecture/art/battle/collapse/founding/governance/rebellion/religion/science).

## Inca (topic id: `inca`) — pulled 2026-08-03

Status: **merged into live seed data 2026-08-03**
(`backend/src/history_zoomout/db/seed_data/civilizations.json`, replacing the old 5-event
entry wholesale). Kept the existing `id` (`inca`), `colorIndex` (7), and date range
(1438-1572). Not yet reseeded into the database.

The original 5-event seed entry covered the founding (1438), Machu Picchu (1450),
Cajamarca (1532), Atahualpa's execution (1533), and the fall of Vilcabamba (1572), but
skipped the empire's entire succession crisis: Huayna Capac's death in 1527 and the
1529-1532 Inca Civil War between his sons Huáscar and Atahualpa. That civil war is the
reason Pizarro's tiny force could ambush and capture an emperor at all — Atahualpa had
just finished a war that gutted his own army and left the empire politically split. Also
missing was Manco Inca's 1536-37 siege of Cusco, the rebellion that produced the Neo-Inca
State at Vilcabamba in the first place — without it, "The Last Inca Stronghold Falls"
(1572) has no stronghold origin story. Expanded to 8 events adding the 1527 succession
crisis, the 1532 civil-war battle of Quipaipan, and the 1536 siege of Cusco.

### Topic-level source

- **Inca Empire** — https://en.wikipedia.org/wiki/Inca_Empire — Wikidata Q28573 — this
  article's own scope (1438-1533) covers the imperial period; the topic's 1572 end date
  (Neo-Inca State resistance) is documented in the article's "Spanish conquest" section.
- Image: **Tawantinsuyu (orthographic projection)** map (L'Américain, CC BY-SA 3.0),
  showing the empire's full Andean extent — used instead of the article's own lead
  thumbnail (a heraldic Suntur Paucar/royal-scepter icon, not very illustrative on its
  own) and instead of a Machu Picchu photo, since Machu Picchu is already used at the
  event level and a map gives better geographic context for a topic spanning four modern
  countries.

### Event-level sources

| Event | Year | Article | Wikidata | Image credit |
|---|---|---|---|---|
| Pachacuti begins the Inca expansion | 1438 | [Pachacuti](https://en.wikipedia.org/wiki/Pachacuti) | Q213758 | Unknown artist, Public domain (Brooklyn Museum portrait) |
| Machu Picchu is built | 1450 | [Machu Picchu](https://en.wikipedia.org/wiki/Machu_Picchu) | Q676203 | Jorge Castro Ruso, CC BY-SA 2.0 |
| Huayna Capac dies, triggering a succession crisis | 1527 | [Huayna Capac](https://en.wikipedia.org/wiki/Huayna_Capac) | Q311433 | Felipe Guaman Poma de Ayala, Public domain |
| Atahualpa wins the Inca Civil War | 1532 | [Inca Civil War](https://en.wikipedia.org/wiki/Inca_Civil_War) | Q1763918 | John Harris Valda, Public domain |
| Atahualpa is captured at Cajamarca | 1532 | [Battle of Cajamarca](https://en.wikipedia.org/wiki/Battle_of_Cajamarca) | Q1425362 | Juan Lepiani, Public domain |
| Atahualpa is executed | 1533 | [Atahualpa](https://en.wikipedia.org/wiki/Atahualpa) | Q179577 | Luis Montero, Public domain |
| Manco Inca's rebellion fails; the Neo-Inca State is founded | 1536 | [Siege of Cusco](https://en.wikipedia.org/wiki/Siege_of_Cusco) | Q2398589 | Felipe Guaman Poma de Ayala, Public domain |
| The last Inca stronghold falls | 1572 | [Túpac Amaru](https://en.wikipedia.org/wiki/T%C3%BApac_Amaru) | Q296269 | Unidentified Cuzco School painter, Public domain |

### Event locations

| Event | Historical name | Modern city, country | Coordinates |
|---|---|---|---|
| Pachacuti begins the expansion | Cusco | Cusco, Peru | -13.5169, -71.9786 |
| Machu Picchu is built | Machu Picchu | Machu Picchu, Peru | -13.163, -72.546 |
| Huayna Capac dies | Quito | Quito, Ecuador | -0.220, -78.513 |
| Atahualpa wins the civil war | Quipaipan | Cusco, Peru | -13.5169, -71.9786 |
| Atahualpa captured at Cajamarca | Cajamarca | Cajamarca, Peru | -7.1575, -78.5175 |
| Atahualpa executed | Cajamarca | Cajamarca, Peru | -7.1575, -78.5175 |
| Manco Inca's siege fails | Cusco | Cusco, Peru | -13.5169, -71.9786 |
| The last stronghold falls | Vilcabamba | Vilcabamba, Peru | -12.904, -73.203 |

Quipaipan (the decisive civil-war battle site) has no coordinates on Wikipedia or
Wikidata; its own article places it "only miles from Cuzco," so Cusco's coordinates were
reused rather than left null, same approach as Khmer's Angkor Thom.

### Corrections / decisions made vs. the original 5-event seed data

- **Added "Huayna Capac Dies, Triggering a Succession Crisis" (1527, `major`) and
  "Atahualpa Wins the Inca Civil War" (1532, `minor`).** Wikipedia's own Battle of
  Cajamarca article credits Pizarro's ambush partly to the fact that Atahualpa's army had
  just fought a multi-year civil war — omitting that war from the dataset made Cajamarca
  read as a clean ambush of a healthy empire rather than the endgame of an empire already
  fractured by a succession crisis. Huayna Capac's death is also notable in its own right:
  he died of a disputed epidemic (measles or smallpox is suspected, though historians
  disagree) more than a decade after first hearing of Spanish ships off his coast in
  1515 — disease reaching the empire ahead of the conquistadors themselves.
- **Added "Manco Inca's Rebellion Fails; the Neo-Inca State Is Founded" (1536, `major`).**
  The existing "Last Inca Stronghold Falls" (1572) event referenced Vilcabamba without any
  prior event explaining how or why an independent Inca state existed there to begin
  with — this fills that gap with the failed 1536-37 siege of Cusco that forced Manco
  Inca's retreat.
- **"Atahualpa Is Executed" relocated to Cajamarca, not Cusco.** The original seed body
  said Spanish forces "install a puppet ruler in Cusco" without specifying where the
  execution itself happened; Atahualpa was tried and garroted at Cajamarca on 26 July
  1533, the same town where he'd been held captive since his capture — he never reached
  Cusco alive.
- **"The Last Inca Stronghold Falls" body clarifies the execution happened at Cusco, not
  Vilcabamba.** Túpac Amaru was captured in the forests west of Vilcabamba but marched to
  Cusco and publicly beheaded there on 24 September 1572, three days after arriving —
  kept the event's location field at Vilcabamba (where the campaign that ended the
  Neo-Inca State culminated) while noting the Cusco execution in the body text, consistent
  with how Khmer's "Ayutthaya Sacks Angkor" anchors location to the falling capital.
- **Huayna Capac's death location given as Quito, not Tumipampa.** His own Wikipedia
  infobox lists Tumipampa as the death location while the article's body text says Quito;
  went with Quito since it has documented coordinates and is the more consistently
  reported location across the article's own prose.
- Two of the eight events (1527 and 1536) reuse Guaman Poma de Ayala illustrations from
  his 17th-century chronicle *El primer nueva corónica y buen gobierno* — no photographic
  or painted portraits of Huayna Capac or documentary scenes of the Cusco siege were found
  on Commons, and Guaman Poma's chronicle is the standard period-illustration source for
  this era, same role Bayon bas-reliefs played for Khmer's harder-to-photograph events.

## Mali Empire (topic id: `mali`) — pulled 2026-08-03

Status: **merged into live seed data 2026-08-03**
(`backend/src/history_zoomout/db/seed_data/civilizations.json`, replacing the old 5-event
entry wholesale). Kept the existing `id` (`mali`) and `colorIndex` (5), but the date range
changed from **1235–1468 to 1235–1610** — see corrections below. Not yet reseeded into the
database.

The original 5-event seed entry ended at "Songhai Captures Timbuktu" (1468) as if that were
the empire's fall. It wasn't: Wikipedia's own Mali Empire summary gives the empire's span
as c. 1235 to c. 1610. Mali survived another 140+ years as a shrinking, contested state
after losing Timbuktu, finally disintegrating after a catastrophic 1599 defeat at Djenné
and the 1610 death of its last emperor, Mahmud Keita IV, whose sons split what remained of
the realm among themselves. Expanded from 5 to 7 events to cover that missing final
sub-period (1468-1610), which the old entry skipped entirely.

### Topic-level source

- **Mali Empire** — https://en.wikipedia.org/wiki/Mali_Empire — Wikidata Q184536
- Image: **Map of the Mali Empire** (HetmanTheResearcher, CC BY 4.0) — this is the
  article's own REST-summary thumbnail and was illustrative enough to keep as-is.

### Event-level sources

| Event | Year | Article | Wikidata | Image credit |
|---|---|---|---|---|
| Sundiata Keita founds the Mali Empire | 1235 | [Battle of Kirina](https://en.wikipedia.org/wiki/Battle_of_Kirina) | Q1319855 | Franko Khoury, Public domain (Smithsonian terracotta equestrian figure) |
| Sakura seizes the throne and expands Mali | 1285 | [Mansa Sakura](https://en.wikipedia.org/wiki/Mansa_Sakura) | Q3025939 | Franko Khoury, Public domain (Smithsonian terracotta archer figure) |
| Mansa Musa's pilgrimage to Mecca | 1324 | [Mansa Musa](https://en.wikipedia.org/wiki/Mansa_Musa) | Q309333 | Attr. Abraham Cresques, Public domain (1375 Catalan Atlas) |
| Djinguereber Mosque built in Timbuktu | 1327 | [Djinguereber Mosque](https://en.wikipedia.org/wiki/Djinguereber_Mosque) | Q2480949 | KaTeznik, CC BY-SA 2.0 FR |
| Songhai captures Timbuktu | 1468 | [Timbuktu](https://en.wikipedia.org/wiki/Timbuktu) | Q9427 | HetmanTheResearcher, CC BY-SA 4.0 (Songhai Empire map) |
| Mali's defeat at the Battle of Djenné | 1599 | [Mahmud IV (mansa)](https://en.wikipedia.org/wiki/Mahmud_IV_(mansa)) | Q6734486 | Ondřej Havelka, CC BY-SA 4.0 |
| Mali Empire ends with the death of Mahmud Keita IV | 1610 | [Mahmud IV (mansa)](https://en.wikipedia.org/wiki/Mahmud_IV_(mansa)) | Q6734486 | Jansen.2, CC BY-SA 4.0 (Keita dynasty family tree diagram) |

No dedicated Wikipedia article exists for the 1599 Battle of Djenné or for Mahmud IV's
1610 death specifically — both are sourced to the Mahmud IV (mansa) biography article,
which covers both facts directly.

### Event locations

| Event | Historical name | Modern city, country | Coordinates |
|---|---|---|---|
| Sundiata Keita founds the empire | Kirina | Koulikoro, Mali | *(none found)* |
| Sakura expands Mali's reach | — | — | *(no single site — broad campaign)* |
| Mansa Musa's pilgrimage | Mecca | Mecca, Saudi Arabia | 21.4225, 39.8233 |
| Djinguereber Mosque built | Timbuktu | Timbuktu, Mali | 16.7758, -3.0094 |
| Songhai captures Timbuktu | Timbuktu | Timbuktu, Mali | 16.7758, -3.0094 |
| Mali's defeat at Djenné | Djenné | Djenné, Mali | 13.9056, -4.555 |
| Death of Mahmud Keita IV | — | — | *(no single site — Sorokuru fortress not on Wikipedia)* |

Kirina has no coordinates on Wikipedia or Wikidata; its own article places it in the
Koulikoro Region of Mali, so that region's principal city is given for `city` with
`latitude`/`longitude` left `null`. Sakura's 1285 campaign and Mahmud IV's 1610 death (at
a fortress called Sorokuru, which has no Wikipedia article at all) have no natural single
place, so both events omit the `location` object entirely rather than guessing.

### Corrections / decisions made vs. the original 5-event seed data

- **End date changed from 1468 to 1610.** The old entry's last event, "Songhai Captures
  Timbuktu," was written as if it were the empire's fall ("marking the empire's decline as
  Songhai rises in its place"). Mali actually persisted as a contracting, contested state
  for another 140+ years after that loss. Added two events to cover this: the catastrophic
  1599 Battle of Djenné (Mansa Mahmud Keita IV's failed attempt to exploit Songhai's own
  collapse after Morocco's 1591 invasion, defeated by Moroccan musketeers) and the 1610
  death of Mahmud Keita IV, after which his three sons divided the remaining realm and no
  single Keita ruler ever governed a unified Mali again.
- **"Songhai Captures Timbuktu" (1468) body corrected — not a direct Mali-to-Songhai
  handoff.** The old body implied Songhai took the city straight from Mali. Per Wikipedia's
  Timbuktu article, Mali had already lost the city to Tuareg raiders decades earlier (early-
  to-mid 15th century); Sunni Ali's Songhai forces captured it from the Tuareg in 1468, not
  from Mali directly. Body text now reflects that sequence. (One source, *History of the
  Mali Empire*, gives 1469 instead of 1468 for this capture — kept 1468 since it's what the
  Timbuktu article and the existing seed data both use, and the two dates likely reflect a
  siege-to-fall span rather than a real conflict.)
- **Replaced "Sankoré Madrasa Flourishes in Timbuktu" (1327) with "Djinguereber Mosque
  Built in Timbuktu" (1327, same year).** The old event's claim doesn't hold up: per the
  Sankoré Madrasah article, that institution's actual golden age was in the 15th-16th
  century under Songhai's Askia dynasty, not under Mali. The Djinguereber Mosque is
  well-documented as built in 1327 under Mali's own Mansa Musa (commissioned on his return
  from Mecca), making it a more accurate and better-sourced stand-in for the same "Timbuktu
  becomes a scholarly/architectural center under Mali" beat.
- **Sakura's body text expanded with sourced detail not in the old entry**: he was likely a
  freed dependent of the Keita court rather than definitively "a palace slave" (Ibn
  Khaldun's Arabic term *mawlā* is ambiguous between "slave" and "client"), and he was
  killed returning from his own hajj around 1300, after which the Keita dynasty was
  restored — this is why Mansa Musa (a Keita) is back on the throne by 1312.
- Mansa Musa's pilgrimage body corrected to match Wikipedia's own caveats: the "tons of
  gold" figure comes from disputed Arabic-source estimates that modern historians (e.g.
  Warren Schultz) treat skeptically, and the trip spanned 1324-1325, not a single year —
  kept the existing seed year of 1324 (departure year) since that's still accurate and
  matches the empire's conventional "golden age" framing.
- `sig` ratings kept from the existing entry where events carried over (1235 major, 1285
  minor, 1324 major); assigned by judgment for the three new/replaced events, consistent
  with the pattern used elsewhere in this file.

### Enrichment pass — pulled 2026-08-06

Status: **merged into live seed data 2026-08-06** (`backend/src/history_zoomout/db/seed_data/civilizations.json`) and reseeded (local dev database). General "add more
events" pass, not scoped to a specific tag. Went sub-period by sub-period across the
empire's full 1235-1610 span looking for
genuinely significant events beyond the founding/pilgrimage/collapse turning points
already covered. The existing 7-event set had zero events tagged `governance`,
`science`, or `rebellion` — all four new events land on at least one of those, plus one
standalone event for the previously-undocumented 1433 loss of Timbuktu to the Tuareg
(before now, that fact only existed as a parenthetical in the 1468 Songhai event's body).
Also backfilled the `tags` array onto all 7 existing events in this JSON file, which
predates that field — copied from what's already live in
`backend/src/history_zoomout/db/seed_data/civilizations.json` (unchanged by this pass)
rather than reassigned from scratch.

Considered and rejected: a `science`/`architecture` event for the Sankoré Madrasah's
rise as a center of Islamic scholarship. Per its own Wikipedia article, the madrasa's
documented golden age was under the *Songhai* Empire in the 16th century — the same
conclusion the original 2026-08-03 pass reached when it swapped this exact claim out for
the Djinguereber Mosque event (see corrections above). Also considered an `art` event
for Djenné-Djenno terracotta figurines (used as illustrations on two existing events),
but per the Djenné-Djenno article that tradition predates the Mali Empire's founding and
belongs to an earlier, separate culture — not a genuine Mali Empire event.

#### New events

| Event | Year | Article | Wikidata | Image credit |
|---|---|---|---|---|
| Ibn Battuta visits Mali and documents Suleyman's rule | 1352 | [Sulayman of Mali](https://en.wikipedia.org/wiki/Sulayman_of_Mali) | Q3028531 | Unattributed map, CC BY-SA 3.0 |
| Mari Djata II wins a civil war and squanders the treasury | 1360 | [Mari Djata II of Mali](https://en.wikipedia.org/wiki/Mari_Djata_II_of_Mali) | Q947664 | Gabriel Moss, CC BY-SA 4.0 |
| Tuareg forces seize Timbuktu from Mali | 1433 | [History of the Mali Empire](https://en.wikipedia.org/wiki/History_of_the_Mali_Empire) | Q130271155 | Anne and David, Public domain (Flickr) |
| Mansa Mahmud Keita II opens relations with Portugal | 1487 | [Mahmud II (mansa)](https://en.wikipedia.org/wiki/Mahmud_II_(mansa)) | Q6734478 | Public domain (Behaim's 1492 Erdapfel globe) |

Notes on sourcing:
- **Ibn Battuta / Suleyman (1352)** — no dedicated Wikipedia article exists for this
  specific visit; sourced to the Sulayman of Mali biography, which covers his reign
  (c. 1341-1360) and Ibn Battuta's account of it, including the "no need to worry about
  thieves" security assessment and his blunter judgment that Suleyman was "a miserly
  king" compared to Mansa Musa. Tagged both `governance` (the security/administration
  observation) and `science` (Ibn Battuta's own scholarly travel account, the first
  detailed outside record of the empire).
- **Mari Djata II (1360)** — dated to his accession after winning the civil war that
  followed his predecessor Qanba's nine-month reign, though the event's body also covers
  his fourteen-year record of financial mismanagement (selling a 20-qintar gold boulder
  under value), since that's one continuous story rather than two separate events. No
  dedicated article exists for Qanba (404 on Wikipedia) so his civil war is covered as
  context within this event rather than its own entry. Ibn Khaldun's assessment that this
  reign marks "the beginning of the decline of the Mali Empire" is paraphrased, not
  quoted, into the body. Tagged `rebellion` (the civil war) and `governance` (the
  treasury mismanagement) rather than `collapse`, since the empire continues for another
  ~250 years — this is the onset of decline, not a fall.
- **Tuareg capture of Timbuktu (1433)** — no dedicated article for the Tuareg leader
  Akil Ag-Amalwal exists either, so this is sourced to *History of the Mali Empire*,
  which gives the precise year and names both Timbuktu and Oualata as captured together.
  This same fact was already implied in the existing 1468 Songhai event's body ("which
  Mali had already lost to Tuareg raiders decades earlier") but had never had its own
  entry; that 1468 body is left as-is since it's still accurate.
- **Portugal relations (1487)** — no dedicated article exists for "Mahmud Keita II" by
  that exact name; Wikipedia's article on this ruler is titled "Mahmud II (mansa)"
  (reign 1481-1496), which matches. Sourced primarily via the main Mali Empire article,
  which places the initial Portuguese-envoy reception in 1487 and a follow-up Malian
  request for an alliance against the warlord Tenguella in 1493 (unsuccessful) as two
  distinct contacts — both folded into one event since they're the same diplomatic
  episode.

#### New event locations

| Event | Historical name | Modern city, country | Coordinates |
|---|---|---|---|
| Ibn Battuta visits Mali | — | — | *(no single site — an empire-wide account, not one place)* |
| Mari Djata II's civil war | — | — | *(no single site — Mali's traditional capital, Niani, has no confirmed location)* |
| Tuareg seize Timbuktu | Timbuktu | Timbuktu, Mali | 16.7758, -3.0094 |
| Portugal relations opened | — | — | *(no single site — a cross-border diplomatic exchange)* |

All new events validated: JSON well-formed, years ascending (1235→ 1610, 11 events
total), and dry-run constructed against the real `Topic`/`Event`/`Location` ORM classes
in `history_zoomout.db.models` without error.
