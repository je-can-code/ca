# Progression bands

Where the player goes, in what order, against what levels. The map tree records authoring hierarchy,
not play order, and `story-canon.md` records narrative order without numbers, so this is the one place
that puts the two together.

The bands below are design, and enemies are levelled to them. Who actually stands in a band is never
written down here, because a roster in a doc goes stale the moment an enemy moves. Ask the data instead:

```bash
bun tools/bestiary.js              # every area in play order, with its band and who lives there
bun tools/bestiary.js first        # every line, where the player first meets it, and the tally by chapter
bun tools/bestiary.js line Titan   # one line's tiers and named, and where each one stands
```

---

## The bands, in play order

`tools/bestiary.js` reads this table, so keep its shape. The last column is where the area sits in the
map tree: a folder or map id, plus `from lvN` when two visits to the same maps are told apart by level.

| Area | Band | Chapter | Map tree |
|---|---|---|---|
| Intro Cave | 1 | 1 | 3 |
| Crossroads | 2-5 | 1 | 14 |
| Raevula fields | 3-8 | 1 | 119 |
| Mines: Ground | 6-9 | 1 | 342 |
| Mines: Basement | 6-10 | 1 | 343 |
| Forest of Dreams | 10-12 | 1 | 24 |
| Forlorn Basin | 11-19 | 2 | 93 |
| Outer Cliffs | 20-25 | 2 | 117 |
| Crossroads return | 23-25 | 2 | 14 from lv20 |
| Earthen Layer | 23-28 | 2 | 70 |
| Lakeside Road | 23-25 | 2 | 118 |
| Basin Floor 5 | 30-32 | 2 | 187 |
| Erocia Isthmus | 32-38 | 3 | 213 |
| Highwater Way | 32-38 | 3 | 239 |
| Volcanis Grotto | 39-43 | 3 | 242 |
| Mines: Back half | 40-45 | 3 | 343 from lv40 |
| Fallen Kingdom | 49-55 | 3 | 259 |
| Negative Peaks | 61-65 | 3 | 120 |
| Crystalline Ravine | 75-90 | 4 | 291 |
| Seashell Shores | 80-95 | 4 | 450 |
| Deluge Valley | 85-100 | 4 | 125 |
| Windward Tunnels | 85-100 | 4 | 328 |
| Nimbus | 85-100 | 4 | 122 |
| Desolate Graves | 90-105 | 4 | 124 |
| Subterranean | 95-110 | 4 | 290 |
| Frozen Fortress | 115-130 | 5 | 410 |

The gent waits past the Frozen Fortress's Courtyard at about 150.

**A band is what a spot names, not a ceiling on what it can roll.** A spot's `<enemyIds:[...]>` pool can
land on a higher tier, and that tier brings its own row level with it. T5s stand at their own level on
one hardcoded spot each, and a named's level is decoupled from its stats.

### Chapter 4 is a parallel set

Chapter 4 is deliberately wrapperless: the continent opens and the player mounts expeditions in whatever
order they like. So its bands overlap on purpose, and they are not rungs.

| Area | Reached from |
|---|---|
| Crystalline Ravine | Erocia Isthmus |
| Seashell Shores | Outer Cliffs |
| Deluge Valley | the chapter 4 continent |
| Windward Tunnels | Deluge Valley, running to the Pearlsalt Mines |
| Nimbus ("Heaven") | Negative Peaks, Room of Sacrifice `Map322` |
| Desolate Graves | the chapter 4 continent |
| The Subterranean ("Hell") | Pearlsalt Mines and Forlorn Basin, snakerope-gated |
| Frozen Fortress | RGB Technohypercube |

**The two technodisk retrievals are the only mandatory beats in chapter 4**: Nimbus and the Subterranean.
The other areas are optional content the player may skip entirely, which is a constraint on anything
that gates progress behind them. "Deluge Valley" is the map-tree name and "Deluge Plains" the design name.

The ravine should stay the softest landing of the four optional areas. `story-canon.md` estimates about
75 entering chapter 4, while the Negative Peaks top out at 65 with bosses at 70, so a real player lands
nearer 65-70.

### The two visits to the Forlorn Basin

The basin is entered twice, and the split is a clean tree boundary rather than a judgement call:

- **Visit 1 = `FLOOR: 1` through `FLOOR: 4`** (Passages 1-8, side rooms 2a/4a, and the 8-cluster), boss
  Sandy Pudding 22. Reached **before** the Outer Cliffs.
- **Visit 2 = `FLOOR: 5`** (Passages 9-13), Aqualock at Passage 13. Reached **after** the first run down
  Lakeside Road, once Treis's bombs open the false bottom at `Passage - 8descend`.

Anything that averages the basin as one dungeon produces a meaningless 11-32 spread.

### Deliberate off-band pockets

These are all intentional, and none of them should be "corrected" to fit their band:

| Where | What | Why |
|---|---|---|
| Mines: Basement | Chonky Orc 40, Beefcorc 41, !Forcman 45 | The mayor's slaves. The player is told to leave them alone and cannot beat them in chapter 1. They are their own band in the table above. |
| Crossroads | Its second-pass population | The only map in the game with one: enemies level to match the returning player, on sw44 pages that carry no pool. |
| Volcanis Grotto | Titan 65, Wriggling Caverns `Map244` ev34 | The fence on the lane to Direct Heat, Extended Tunnel and the named pistol. A player walking back after the Fallen Kingdom should be able to stomp it, so it has no pool: a roll could land Atlas. |
| Fallen Kingdom | Vampire Shade 72 | Gated behind switch 147 ("after the vampire"), the post-Lucian farm spawns. Does not exist during the normal run. |
| Fallen Kingdom, Castle Gate | Mercenary 82 | The "deadly guard". |
| Fallen Kingdom, Entrance | Zaphazard 33 | The odd direction: 16 levels *under* its band. |

---

## How a level is read

An enemy placement is an event page carrying an `<enemyId:N>` comment, or a plugin command spawning one.
Its level is the page's own `<level:N>` when present, otherwise the `<level:N>` in that enemy's note in
`Enemies.json`. Map event tags override the database, so the page is always checked first.

Harvestables (`*`), tool gimmicks (`@`) and placeholders (`===`) carry levels too, and counting them
distorts a band badly, so `tools/bestiary.js` only ever counts the rows on a line. Test maps sit outside
the areas above and never enter it.
