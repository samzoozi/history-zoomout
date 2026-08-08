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

## Germany (topic id: `country-germany`) — pulled 2026-08-08

Status: **new topic** — file written to `data/wikipedia-data/country/germany.json` only;
merging into the live seed is a separate step.

**The start year, 962, was an explicit user decision**, made after weighing three
candidates against the France precedent (843, Treaty of Verdun): 843 itself (East
Francia, the direct territorial ancestor of the German lands, keeping symmetry with
France), 962 (Otto I's coronation as Holy Roman Emperor, the traditional start of a
distinctly *German* kingdom), and 1871 (German unification, the literal birth of the
modern nation-state). The user asked to weight the topic toward the modern concept of
the country without losing historical context entirely, so 962 was chosen as the
middle path: it skips the ~120 years of East Francia that are arguably more "Frankish"
than "German," while still tracing real medieval roots rather than starting cold at
1871. Per that same steer, the pre-1806 stretch of the timeline (962–1806, 844 years)
is deliberately kept sparse — 9 events, one per major turning point (imperial founding,
Investiture Controversy, Golden Bull, Gutenberg, the Reformation, Peace of Augsburg, the
Thirty Years' War, Peace of Westphalia, the rise of Prussia under Frederick the Great) —
while the 1806–2026 span (220 years) carries the bulk of the research, 32 events, matching
the "focus more on the modern concept" instruction.

There is also an existing `civilization` topic, `hre` (Holy Roman Empire), covering
roughly the same medieval centuries in a founding→fall framing. This `country` topic is
scoped deliberately differently — it doesn't stop at a "fall" (the Empire's 1806
dissolution is a single event here, not an ending point) and continues straight through
Prussia's rise, unification, both World Wars, division, and reunification to the present
day. The two topics' early events (e.g. Otto I's coronation) may overlap in subject
matter, which is expected — they're answering different questions ("what was the Holy
Roman Empire's own arc" vs. "how did the German nation-state get here") — but this pass
did not attempt to deduplicate against `hre.json`'s own event list.

`colorIndex: 2` was assigned in the `country` category's own index space (France already
uses `1`), not coordinated with the `civilization` category's rotation.

### Topic-level source

- **History of Germany** — https://en.wikipedia.org/wiki/History_of_Germany — Wikidata
  Q122131
  - The article's own lead thumbnail is a flat 18th-century map of the "Imperium
    Romano-Germanicum," similar to France's own generic-map problem. Used a photo of the
    **Brandenburg Gate** instead (sourced from its own article, not embedded in History
    of Germany) — it's the single most recognizable visual shorthand for Germany as a
    nation, and it also appears as the backdrop to two of the topic's own 20th-century
    events (the Fall of the Wall and reunification), tying the topic image to the
    timeline's own modern climax.

### Event-level sources

| Event | Year | Article | Wikidata | Image credit |
|---|---|---|---|---|
| Otto I crowned Holy Roman Emperor | 962 | [Otto the Great](https://en.wikipedia.org/wiki/Otto_the_Great) | Q43915 | Otto Posse (illustration), Public domain |
| Henry IV's Walk to Canossa | 1077 | [Road to Canossa](https://en.wikipedia.org/wiki/Road_to_Canossa) | Q325656 | Eduard Schwoiser (painting), Public domain |
| Golden Bull of 1356 issued | 1356 | [Golden Bull of 1356](https://en.wikipedia.org/wiki/Golden_Bull_of_1356) | Q567601 | Document photo, Public domain |
| Gutenberg invents the printing press | 1450 | [Johannes Gutenberg](https://en.wikipedia.org/wiki/Johannes_Gutenberg) | Q8958 | Kenneth C. Zirkel (photo), CC BY-SA 4.0 |
| Luther posts the Ninety-Five Theses | 1517 | [Ninety-five Theses](https://en.wikipedia.org/wiki/Ninety-five_Theses) | Q157506 | Document image, Public domain |
| Peace of Augsburg | 1555 | [Peace of Augsburg](https://en.wikipedia.org/wiki/Peace_of_Augsburg) | Q154577 | Document photo, Public domain |
| Thirty Years' War begins | 1618 | [Thirty Years' War](https://en.wikipedia.org/wiki/Thirty_Years%27_War) | Q2487 | Carl Friedrich Lessing (painting), Public domain |
| Peace of Westphalia ends the war | 1648 | [Peace of Westphalia](https://en.wikipedia.org/wiki/Peace_of_Westphalia) | Q150995 | Dietmar Rabich (photo), CC BY-SA 4.0 |
| Frederick the Great ascends the Prussian throne | 1740 | [Frederick the Great](https://en.wikipedia.org/wiki/Frederick_the_Great) | Q33550 | Johann Georg Ziesenis (painting), Public domain |
| Holy Roman Empire dissolved | 1806 | [Dissolution of the Holy Roman Empire](https://en.wikipedia.org/wiki/Dissolution_of_the_Holy_Roman_Empire) | Q19902208 | Alphathon (map), CC0 |
| German Confederation formed | 1815 | [German Confederation](https://en.wikipedia.org/wiki/German_Confederation) | Q151624 | TRAJAN 117 (map), CC BY-SA 3.0 |
| Zollverein customs union established | 1834 | [Zollverein](https://en.wikipedia.org/wiki/Zollverein) | Q155707 | 52 Pickup (map), CC BY-SA 3.0 |
| Revolutions of 1848 sweep the German states | 1848 | [German revolutions of 1848–1849](https://en.wikipedia.org/wiki/German_revolutions_of_1848%E2%80%931849) | Q3699 | Unknown (illustration), Public domain |
| Austro-Prussian War | 1866 | [Austro-Prussian War](https://en.wikipedia.org/wiki/Austro-Prussian_War) | Q153650 | Georg Bleibtreu (painting), Public domain |
| German Empire proclaimed at Versailles | 1871 | [Proclamation of the German Empire](https://en.wikipedia.org/wiki/Proclamation_of_the_German_Empire) | Q10354157 | Anton von Werner (painting), Public domain |
| Cologne Cathedral completed | 1880 | [Cologne Cathedral](https://en.wikipedia.org/wiki/Cologne_Cathedral) | Q4176 | Raimond Spekking (photo), CC BY-SA 4.0 |
| Bismarck enacts social insurance laws | 1883 | [Otto von Bismarck](https://en.wikipedia.org/wiki/Otto_von_Bismarck) | Q8442 | Unknown (portrait), Public domain |
| Carl Benz patents the automobile | 1886 | [Carl Benz](https://en.wikipedia.org/wiki/Carl_Benz) | Q40224 | Bahnfrend (photo), CC BY-SA 4.0 |
| World War I begins | 1914 | [World War I](https://en.wikipedia.org/wiki/World_War_I) | Q361 | Collection DocAnciens/docpix.fr (photo), Public domain |
| German Revolution ends the Kaiserreich | 1918 | [German revolution of 1918–1919](https://en.wikipedia.org/wiki/German_revolution_of_1918%E2%80%931919) | Q170306 | Unknown (photo), Public domain |
| Bauhaus school founded | 1919 | [Bauhaus](https://en.wikipedia.org/wiki/Bauhaus) | Q124354 | Spyrosdrakopoulos (photo), CC BY-SA 4.0 |
| Weimar Constitution adopted | 1919 | [Weimar Constitution](https://en.wikipedia.org/wiki/Weimar_Constitution) | Q156003 | Document photo, Public domain |
| Hyperinflation devastates the economy | 1923 | [Hyperinflation in the Weimar Republic](https://en.wikipedia.org/wiki/Hyperinflation_in_the_Weimar_Republic) | Q695052 | Bundesarchiv (photo), CC BY-SA 3.0 DE |
| Hitler appointed Chancellor | 1933 | [Adolf Hitler's rise to power](https://en.wikipedia.org/wiki/Adolf_Hitler%27s_rise_to_power) | Q4684105 | Bundesarchiv (photo), CC BY-SA 3.0 DE |
| Enabling Act passed | 1933 | [Enabling Act of 1933](https://en.wikipedia.org/wiki/Enabling_Act_of_1933) | Q310218 | Georg Pahl / Bundesarchiv (photo), CC BY-SA 3.0 DE |
| Nuremberg Laws enacted | 1935 | [Nuremberg Laws](https://en.wikipedia.org/wiki/Nuremberg_Laws) | Q27906 | Document photo, Public domain |
| Kristallnacht pogrom | 1938 | [Kristallnacht](https://en.wikipedia.org/wiki/Kristallnacht) | Q36756 | Unknown (photo), Public domain |
| Invasion of Poland starts World War II | 1939 | [Invasion of Poland](https://en.wikipedia.org/wiki/Invasion_of_Poland) | Q150812 | Ai6z83xl3g (photo montage), CC BY-SA 3.0 |
| Wannsee Conference plans the Holocaust | 1942 | [Wannsee Conference](https://en.wikipedia.org/wiki/Wannsee_Conference) | Q152120 | A.Savin (photo), CC BY-SA 3.0 |
| Germany surrenders, ending WWII in Europe | 1945 | [German Instrument of Surrender](https://en.wikipedia.org/wiki/German_Instrument_of_Surrender) | Q700983 | National Archives, restored by Adam Cuerden (photo), Public domain |
| Potsdam Conference divides Germany | 1945 | [Potsdam Conference](https://en.wikipedia.org/wiki/Potsdam_Conference) | Q151187 | US Dept. of Energy (photo), Public domain |
| Berlin Blockade and Airlift | 1948 | [Berlin Blockade](https://en.wikipedia.org/wiki/Berlin_Blockade) | Q151349 | Henry Ries / Library of Congress (photo), Public domain |
| Federal Republic of Germany founded | 1949 | [West Germany](https://en.wikipedia.org/wiki/West_Germany) | Q713750 | Katherine Young / Bundesarchiv (photo), CC BY-SA 3.0 DE |
| German Democratic Republic founded | 1949 | [East Germany](https://en.wikipedia.org/wiki/East_Germany) | Q16957 | Züchlsdorf / Bundesarchiv (photo), CC BY-SA 3.0 DE |
| Berlin Wall built | 1961 | [Berlin Wall](https://en.wikipedia.org/wiki/Berlin_Wall) | Q5086 | Thierry Noir (photo), CC BY-SA 3.0 |
| Basic Treaty normalizes inter-German relations | 1972 | [Basic Treaty, 1972](https://en.wikipedia.org/wiki/Basic_Treaty,_1972) | Q672112 | Engelbert Reineke / Bundesarchiv (photo), CC BY-SA 3.0 DE |
| Fall of the Berlin Wall | 1989 | [Fall of the Berlin Wall](https://en.wikipedia.org/wiki/Fall_of_the_Berlin_Wall) | Q69163529 | Reproduction by Lear 21 (photo), CC BY-SA 3.0 |
| German reunification | 1990 | [German reunification](https://en.wikipedia.org/wiki/German_reunification) | Q56039 | Thomas Uhlemann / Bundesarchiv (photo), CC BY-SA 3.0 DE |
| Euro replaces the Deutsche Mark | 2002 | [Euro](https://en.wikipedia.org/wiki/Euro) | Q4916 | The RedBurn (photo) |
| Angela Merkel becomes Chancellor | 2005 | [Angela Merkel](https://en.wikipedia.org/wiki/Angela_Merkel) | Q567 | Raimond Spekking (photo), CC BY-SA 4.0 |
| Zeitenwende speech marks defense policy shift | 2022 | [Zeitenwende speech](https://en.wikipedia.org/wiki/Zeitenwende_speech) | Q113649169 | Sandro Halank (photo), CC BY-SA 4.0 |

### Event locations

| Event | Historical name | Modern city, country | Coordinates |
|---|---|---|---|
| Otto I crowned | Rome | Rome, Italy | 41.9028, 12.4964 |
| Walk to Canossa | Canossa | Canossa, Italy | 44.58, 10.46 |
| Golden Bull issued | Nuremberg | Nuremberg, Germany | 49.4521, 11.0767 |
| Gutenberg's press | Mainz | Mainz, Germany | 50.00, 8.2711 |
| Luther's Theses | Wittenberg | Lutherstadt Wittenberg, Germany | 51.8671, 12.6484 |
| Peace of Augsburg | Augsburg | Augsburg, Germany | 48.37, 10.90 |
| Thirty Years' War begins | — | (no single place; a continent-spanning war) | — |
| Peace of Westphalia | Münster | Münster, Germany | 51.96, 7.63 |
| Frederick the Great ascends | Berlin | Berlin, Germany | 52.52, 13.41 |
| Holy Roman Empire dissolved | Vienna | Vienna, Austria | 48.21, 16.37 |
| German Confederation formed | Vienna | Vienna, Austria | 48.21, 16.37 |
| Zollverein established | — | (no single place; a multi-state union) | — |
| Revolutions of 1848 | Berlin | Berlin, Germany | 52.52, 13.41 |
| Austro-Prussian War | Königgrätz | Hradec Králové, Czech Republic | 50.2092, 15.8322 |
| German Empire proclaimed | Versailles | Versailles, France | 48.8047, 2.1203 |
| Cologne Cathedral completed | Cologne | Cologne, Germany | 50.9364, 6.9528 |
| Bismarck's social insurance laws | Berlin | Berlin, Germany | 52.52, 13.41 |
| Carl Benz patents the automobile | Mannheim | Mannheim, Germany | 49.4878, 8.4661 |
| World War I begins | — | (no single place; a multi-front war) | — |
| German Revolution / Kaiserreich ends | Berlin | Berlin, Germany | 52.52, 13.41 |
| Bauhaus founded | Weimar | Weimar, Germany | 50.9811, 11.3294 |
| Weimar Constitution adopted | Weimar | Weimar, Germany | 50.9811, 11.3294 |
| Hyperinflation crisis | Berlin | Berlin, Germany | 52.52, 13.41 |
| Hitler appointed Chancellor | Berlin | Berlin, Germany | 52.52, 13.41 |
| Enabling Act passed | Berlin | Berlin, Germany | 52.52, 13.41 |
| Nuremberg Laws enacted | Nuremberg | Nuremberg, Germany | 49.4521, 11.0767 |
| Kristallnacht | — | (nationwide pogrom, no single place) | — |
| Invasion of Poland | Westerplatte | Gdańsk, Poland | 54.4075, 18.6714 |
| Wannsee Conference | Wannsee | Berlin, Germany | 52.52, 13.41 |
| Germany surrenders | Berlin-Karlshorst | Berlin, Germany | 52.52, 13.41 |
| Potsdam Conference | Potsdam | Potsdam, Germany | 52.4006, 13.0592 |
| Berlin Blockade and Airlift | Berlin | Berlin, Germany | 52.52, 13.41 |
| FRG founded | Bonn | Bonn, Germany | 50.7353, 7.1022 |
| GDR founded | East Berlin | Berlin, Germany | 52.52, 13.41 |
| Berlin Wall built | Berlin | Berlin, Germany | 52.52, 13.41 |
| Basic Treaty | East Berlin | Berlin, Germany | 52.52, 13.41 |
| Fall of the Berlin Wall | Berlin | Berlin, Germany | 52.52, 13.41 |
| German reunification | Berlin | Berlin, Germany | 52.52, 13.41 |
| Euro replaces the Deutsche Mark | — | (nationwide currency change) | — |
| Merkel becomes Chancellor | Berlin | Berlin, Germany | 52.52, 13.41 |
| Zeitenwende speech | Berlin | Berlin, Germany | 52.52, 13.41 |

### Corrections / decisions made

- N/A on corrections to existing seed data — this is a brand-new topic, not a
  replacement.
- **Wannsee Conference and the Basic Treaty use Berlin's general coordinates**, not the
  specific villa/signing-site coordinates, since those weren't cleanly available from
  the article's own coordinate data — both are within Berlin, so the approximation is
  minor.
- **Hitler's appointment as Chancellor (30 January 1933) uses a photo from 1 February
  1933** — his first radio address as the new Chancellor — since no well-attributed
  photo from the appointment date itself turned up in the article's image list. Same
  gap-filling approach as France's 1958/1961 de Gaulle photo.
- **Angela Merkel's becoming Chancellor (2005) uses a 2019 photo** — no photo from
  around 2005 specifically tied to her turned up in the article's image list. Same
  gap-filling approach as above; the gap here is wider (14 years) but she's the same
  clearly-identified figure throughout.
- **Carl Benz's automobile patent (1886) uses a photo of an 1888 Patent-Motorwagen**
  rather than a portrait of Benz himself, on the judgment that a photo of the actual
  invention is more illustrative than a portrait for a `science`-tagged event; the two-year
  gap is the vehicle's model year, not a different invention.
- **Golden Bull, Peace of Augsburg, Weimar Constitution, and Nuremberg Laws all use
  "Document photo, Public domain" as their attribution** rather than a named
  artist/photographer — these are photographs of the documents/decrees themselves, which
  don't have a credited photographer in their extmetadata, matching the France doc's
  precedent for the Edict of Nantes.
- **Overlap with the `hre` civilization topic** is expected and not treated as a
  duplication bug — see the scope note above. This pass did not cross-check
  `hre.json`'s own event list for exact date/fact conflicts, since the two topics are
  answering different questions and are not being merged into one.
- Every event and topic-level image URL used in the final JSON was fetched with a real
  Wikimedia API call (either the REST summary's `thumbnail.source` or an explicit
  `imageinfo` lookup with `iiprop=url`) rather than pattern-matched from another file's
  hash path.
- **`id` is `country-germany`, not `germany`**, for the same global-primary-key reason as
  `country-france` — see that entry's note above.
