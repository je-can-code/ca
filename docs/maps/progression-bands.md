# Progression bands

> **Snapshot, 2026-08-04.** Everything below is derived from `chef-adventure/data/` — it was true the
> day it was written and will drift as enemies move. Prefer regenerating over trusting this file when
> the two disagree. See [Derivation](#derivation) for the exact rules used, and
> [`atlas.md`](atlas.md) for the tooling that reads the same data live.

This is the answer to "where does the player go, in what order, against what levels." It exists
because that question had no single answer anywhere — the map tree records authoring hierarchy, not
play order, and `story-canon.md` records narrative order without numbers.

The two agree. The band order below was produced by sorting purely on median enemy level, with no
reference to the canon, and it came out matching the chapters. That is the main reason to trust it.

---

## Bands, in play order

| # | Area | Band | Core | Maps | Spawns | Spp | Step | Boss |
|---|---|---|---|---|---|---|---|---|
| 1 | Intro Cave | 1-1 | 1 | 7 | 41 | 3 | - | !Ghastly Ghosty 5 |
| 2 | Crossroads | 2-25 | 3 | 1 | 44 | 7 | +2 | - |
| 3 | Raevula + Heartbeat | 3-8 | 6 | 10 | 211 | 6 | +3 | - |
| 4 | Academy | 3-12 | 6 | 1 | 23 | 12 | +0 | - |
| 5 | Pearlsalt - Ground | 6-9 | 7 | 10 | 251 | 8 | +1 | - |
| 6 | Pearlsalt - Basement | 6-40 | 9 | 35 | 383 | 8 | +2 | - |
| 7 | Forest of Dreams | 10-12 | 11 | 24 | 353 | 7 | +2 | Gluttonwolf Mayor 15 |
| 8 | Forlorn Basin v1 | 11-19 | 17 | 11 | 150 | 6 | +6 | Sandy Pudding 22 |
| 9 | Outer Cliffs | 20-25 | 23 | 3 | 38 | 5 | +6 | - |
| 10 | Earthen Layer | 23-28 | 26 | 7 | 67 | 3 | +3 | Earthie |
| 11 | Lakeside Road | 23-25 | 24 | 4 | 83 | 4 | -2 | - |
| 12 | Forlorn Basin v2 | 30-32 | 31 | 4 | 91 | 4 | +7 | Aqualock 30 |
| 13 | Erocia Isthmus | 32-38 | 35 | 3 | 66 | 7 | +4 | - |
| 14 | Highwater Way | 32-38 | 35 | 4 | 64 | 7 | +0 | - |
| 15 | Volcanis Grotto | 39-43 | 40 | 8 | 143 | 6 | +5 | Cynder 45 |
| 16 | Fallen Kingdom | 49-55 | 52 | 19 | 352 | 9 | +12 | Vampire King 70 |
| 17 | Negative Peaks | 61-65 | 64 | 15 | 311 | 8 | +12 | Skye 70 / Garuda 70 |
| 18 | Deluge Valley (Ch4) | 51-75 | 58 | 2 | 8 | 8 | - | - |

**168 maps carry enemies; 2,681 spawns.** *Band* is the 10th-90th percentile of enemy level. *Core* is
the median. *Step* is the change in median from the area above.

### The two visits to the Forlorn Basin

The basin is entered twice, and the split is a clean tree boundary rather than a judgement call:

- **Visit 1 = `FLOOR: 1` through `FLOOR: 4`** (Passages 1-8, side rooms 2a/4a, and the 8-cluster).
  Levels 11-23, boss Sandy Pudding 22. Reached **before** the Outer Cliffs.
- **Visit 2 = `FLOOR: 5`** (Passages 9-13). Levels 30-32, Aqualock at Passage 13. Reached **after**
  the first run down Lakeside Road, once Treis's bombs open the false bottom at `Passage - 8descend`.

Anything that averages the basin as one dungeon produces a meaningless 11-32 spread.

### Deliberate off-band pockets

These are all intentional, and none of them should be "corrected" to fit their band:

| Where | What | Why |
|---|---|---|
| Pearlsalt Basement | Chonky Orc 40, Orcan Mage 41, Forcman 45 | The mayor's slaves. The player is told to leave them alone and cannot beat them in ch1. Spread across ~20 basement maps, not one room. |
| Crossroads | Bloodtrap 23, Prince Cobra 24, Penetrator 25, Megataur 25 alongside Wolftrap 2 / Bearcat 3 | The only map in the game with a second-pass population; enemies level to match the returning player. |
| Fallen Kingdom | Vampire Shade 72 | Gated behind switch 147 ("after the vampire") - the post-Lucian farm spawns. Does not exist during the normal run. |
| Fallen Kingdom, Castle Gate | Mercenary 82 | The "deadly guard". |
| Volcanis Grotto | Heated Titan 69 | Unclassified - reads like an orc-style fence, but unconfirmed. |
| Fallen Kingdom, Entrance | Zaphazard 33 | Unclassified, and the odd direction: 16 levels *under* its band. |

### Shape notes

- **The curve doubles in steepness at Volcanis.** Steps run +1 to +7 across fourteen areas, then +12,
  +12. Bands 1-14 cover levels 1-35 over roughly 140 maps; bands 15-17 cover 35-64 over 47.
- **Erocia Isthmus and Highwater Way are the same roster** - identical seven species at identical
  levels, a `+0` step. Seven maps of ch3 introduce no new creature and therefore no new ingredient.
- **Earthen Layer runs three species across seven maps** - the thinnest real dungeon in the game.
- **Lakeside Road introduces nothing.** All four of its species already appear on Crossroads and the
  Outer Cliffs; it is connective tissue.
- **Playtime is front-loaded.** Levels 6-17 span about 84 maps - the single largest stretch of the
  game. Levels 20-35 span roughly 30; levels 39-65 span 47.
- `story-canon.md` estimates ~75 entering ch4. The data tops out at 64-65 with bosses at 70, so a
  player finishing ch3 lands nearer **65-70**.

### The chapter-1 pantry

Everything in the 6-17 band, which is where the player spends the most time by a wide margin:

Cave Bat, Polliwog, Wet Mousse, Rust Bucket, Will 'o' Wisp, Orcling, Creepy, Minitaur, Wraith, Kappa,
Fungrowth, Dryad, Bandit, Jelly, Gluttonwolf.

Fifteen creatures. Any food economy that wants to feel rich early has to be buildable out of those
drop tables plus the Raevula innkeeper.

---

## Maps

Columns are map id, name, level range, and spawn count. Ordered within each area by level, then id.

```
INTRO CAVE (7 maps / 41)                    FORLORN BASIN v1 (11 / 150)
    5  Cave - 2 - attacking     1-1    1       96  Passage - 2a           8-8     4
    6  Cave - 3 - skills        1-1    9       94  Passage - 1           11-19   12
    7  Cave - 4 - guarding      1-1    3       95  Passage - 2           11-19   15
    8  Cave - 5 - battle        1-1   16       97  Passage - 3           11-19    9
    9  Cave - 6a - ranged       1-1    8       98  Passage - 4           11-19   18
   11  Cave - 8a                2-2    1       99  Passage - 5           11-23   13
   15  Cave - 8b                6-6    3      100  Passage - 6           11-19   23
                                              101  Passage - 7           11-19   16
CROSSROADS (1 / 44)                           102  Passage - 8           11-19   36
   14  Crossroads               2-25  44      106  Passage - 4a          11-17    3
                                              103  Passage - 8boss       22-22    1
RAEVULA + HEARTBEAT (10 / 211)
   16  Riverside Stroll         2-3   13     OUTER CLIFFS (3 / 38)
  174  Up and Down              2-6   20      107  Soaring Path          20-25    8
   17  Stone's Throw            3-4   10      108  Terraced Cliffside    20-25   17
   18  Bearcat Congregation     3-5   12      114  Two-way Way           20-25   13
  200  A River Receded          3-6   10
  339  Way to the Forest        3-9   53     EARTHEN LAYER (7 / 67)
   26  Preparing to Ascend      4-6   12      164  Enter the Earthen     23-28   16
  337  Tons of Grass            6-8   50      165  Second Layer          23-28   20
  338  Green Greenery           6-7   27      166  Third Layer           23-28   13
  340  Northwestern Entrance    8-12   4      170  South Side            23-26    6
                                              168  West Side             26-26    5
ACADEMY (1 / 23)                              171  North Side            26-26    3
   90  Combat Area              3-17  23      169  East Side             28-28    4

PEARLSALT GROUND (10 / 251)                 LAKESIDE ROAD (4 / 83)
  344  Western Entrance         6-9   10      115  Meandering Way        23-25   12
  345  SW Corner                6-11  26      116  Frozen Fortress       23-25   12
  346  W Side                   6-11  45      121  Lakeside View         23-25   25
  348  SE Corner                6-9   40      175  Derelict Fork         23-25   34
  349  E Side                   6-9   21
  351  N Side                   6-9   30     FORLORN BASIN v2 (4 / 91)
  352  NW Corner                6-11  16      181  Passage - 9           30-31    8
  347  S Side                   7-9   22      188  Passage - 10          30-31   17
  350  NE Corner                7-11  30      189  Passage - 11          30-32   57
  353  To Ground Level          7-10  11      191  Passage - 13          30-32    9

PEARLSALT BASEMENT (35 / 383)               EROCIA ISTHMUS (3 / 66)
   46  Mansion Entrance         6-45   9      214  Forced Connection     32-38   22
   47  Dungeon's Breadth        6-41  30      215  Going Under           32-38   27
   51  Split Path               6-45  27      216  A Path Aside          32-38   17
   52  Western Danger           6-41  15
   53  Northwestern Depths      6-41  35     HIGHWATER WAY (4 / 64)
   54  Downward Spiral          6-41  13      240  Southern Way          32-38   14
   55  Tiny Pass                6-41  17      255  Northern Way          32-38   17
   56  Double Vision            6-45  19      256  Eastern Way           32-38   25
   57  Dangerous Oneway         6-41  11      257  Western Way           32-38    8
   58  Exit to Riverside        6-45   7
  127  Snakey Route             6-10   8     VOLCANIS GROTTO (8 / 143)
  128  Secret Darkness          6-10   5      243  Volcanis Pass         39-43   11
  129  Bulbous Cavern           6-10  13      244  Wriggling Caverns     39-69   36
  130  Offshoot NE              6-6    3      245  Kadepths              39-69   34
  134  Blue Skies               6-10   5      250  Direct Heat           39-43   23
  135  Main Body                6-10  14      251  Extended Tunnel       39-42   13
  136  Offshoot W               6-10   7      252  Hooked Stroll         39-43    8
  137  Deeper We Go             6-10   3      253  Fiery End             39-69   17
  138  Offshoot S               6-41   9      246  The Bellows           45-45    1
  140  Offshoot NE              6-45   6
  141  South Deposit            6-45  17     FALLEN KINGDOM (19 / 352)
  142  Maw of Sadness           6-45  14      280  Entrance              33-72   27
  143  Left Route               6-8    4      261  Left Path             49-52   17
  144  No Escape                6-10  12      267  Right Path            49-52   18
  145  NW Connector             6-10   6      268  Storage Entrance      49-52    9
  146  Right Route              6-10   5      272  Courtyard Entry       49-72   10
  147  Escalating Tunnel        6-8    4      273  Courtyard West        49-72   56
  148  Overmined Corner         6-41  10      274  Courtyard East        49-72   44
  149  S-Connector              6-41  19      276  Castle Gate           49-82   21
  131  Offshoot SE              8-10   4      285  Castle: West side     49-72   20
  133  Offshoot NW              8-10   3      286  Dungeon Entrance      51-72    9
   59  Offshoot N               9-45  10      287  Dungeon Path          51-72   12
  132  Offshoot SW              9-45  11      288  Dungeon-Sewer Conn.   51-72   13
  139  Offshoot SE              9-41   3      266  Guard Office          52-52   11
  150  Offshoot W               9-41   5      275  Courtyard Fountain    52-72   30
                                              277  Entrance to Sewers    55-55    6
FOREST OF DREAMS (24 / 353)                   278  Sewer Path            55-55   28
   44  Blue Delight             8-12  12      279  Exit to Castle Jail   55-55   11
  151  Riverside View           8-17  21      284  Throne Room           70-70    1
  154  Choosing the Dark        8-17  11      289  Deep Dungeon Entrance 72-72    9
  157  Blue View                8-17  17
  158  Rapid Hops               8-17  14     NEGATIVE PEAKS (15 / 311)
  161  Marshy Secret            8-17  16      301  Foothills             61-65   17
   25  Northeastern Entrance   10-17  12      302  Where It Gets Colder  61-64   20
   61  Dungeon in a Dungeon    10-17  10      303  Colder Ascent         61-65   15
   62  River Entrance          10-17  12      306  Shelter and Beyond    61-65   16
   63  Left Secret             10-17   8      308  Icy Foray             61-64   16
   64  Dreamy Expanse W        10-17  11      309  Second Level          61-64   13
   65  Nature Looms            10-17  22      310  Back Outside          61-64    9
   66  Inner Fork              10-17  16      313  More Icy Fun          61-64   16
   68  Another Hole            10-17  19      314  Last Icy Doozy        61-64    6
   69  Cliff Jumping           10-17  34      321  Frosty Hole           61-64   12
   71  Rounded Bend            10-17  11      311  Valley View           62-65   49
   72  Gluttinous Secret       10-17  23      312  Back Inside           62-65   26
  152  Natural Decision        10-12   6      315  No More Ice Caves     62-65   24
  153  Choosing the Light      10-17  11      316  Field in the Sky      62-65   69
  159  Mad Hops                10-17  13      320  Lord of the Peaks     70-70    3
  160  Reconnection            10-17  17
  163  Dreamy Expanse E        10-17  14     DELUGE VALLEY (2 / 8)  [ch4, barely built]
  162  Dreamy Expanse Core     11-12  22      220  Southern Valley       51-75    7
   75  Basement                15-15   1      229  Western Valley        69-69    1
```

The six heaviest single maps are Field in the Sky (69), Passage - 11 (57), Courtyard West (56), Way
to the Forest (53), Tons of Grass (50), and W Side (45).

Pearlsalt Basement at 35 maps and 383 spawns is the largest area in the game by a wide margin, and
almost all of its rooms are small named offshoots - the shape you would want for ingredient farming.

---

## Derivation

An enemy placement is an event page carrying an `<enemyId:N>` comment. Its level is the page's own
`<level:N>` tag when present, otherwise the `<level:N>` in that enemy's `note` in `Enemies.json`.
Map event tags override the database, so the page is always checked first.

Three classes of placement are excluded from every number above, because including them distorts a
band badly:

| Prefix | Meaning | Example |
|---|---|---|
| `*` | Harvestable or destructible | `*Grass (Airy)` lv55, `*Deposit (Iron)` lv10 |
| `@` | Tool gimmick or training dummy | `@Spire`, `@Suspicious Crack`, `@Passive Dummy` |
| `===` | Unassigned placeholder | `=== TBD Grass` |

The `*` exclusion matters more than it sounds. Field in the Sky carries 22 shrubbery events out of 93,
levelled 55 and 60, against a real enemy population of 62-65. Counting them drags the whole mountain's
apparent floor down.

Bosses (`!` prefix, plus named uniques like Aqualock and Skye) are reported in the Boss column and
excluded from band percentiles.

Test maps are excluded entirely: the various Oases, `_ActionMap`, `_EnemyMap`, and the FLASHBACKS
tree sit outside the `Map` root and never enter the tables.
