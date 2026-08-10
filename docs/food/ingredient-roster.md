# Ingredient roster

> **Working list, sorted 2026-08-05.** Every item and armor in the shipped database that is food or
> food-adjacent, bucketed into the six lanes plus shared, and tagged with a proposed sub-category.
> Lane and sub-category assignments are **proposals** - nothing in the database carries them yet.
> See [`recipe-system.md`](recipe-system.md) for what the buckets are for.

The database is the source of truth; regenerate rather than hand-editing if the two disagree.
Pre-nuke snapshots live in [`backup-items.yaml`](backup-items.yaml) and [`backup-recipes.json`](backup-recipes.json).

## Migration verdicts

| Verdict | Entries | Meaning |
|---|---|---|
| **Clean migrate** | 40 | Armor, but nothing in its family is used by smithing. Safe to become items. |
| **Contested** | 55 | Armor whose family smithing also consumes. Leave as armor; the lane needs new food items instead. |
| **Already an item** | 27 | The existing pantry. Stays put. |

### The eight clean families

Zero smithing use anywhere in the family, so these can move wholesale:

- **leaf** `a321-325` (VEGETABLE) - Dead Greens, Leafy Greens, Bouncy Greens, Fine Greens, Verdant Greens
- **meat** `a346-350` (PROTEIN) - Scavenged Tail, Sinewy Tail, Beefy Tail, Thicc Tail, Dargin Tail
- **offal** `a356-360` (PROTEIN) - Detached Eyeball, Lacerated Eyeball, Snooping Eyeball, Helicopter Eyeball, Peerless Eyeball
- **meat** `a386-390` (PROTEIN) - Bearcat Flank, Ripped Flank, Grim Flank, Volt Jelli Flank, Gigacat Flank
- **meat** `a396-400` (PROTEIN) - Boney Ribs, Lamia Ribs, Serpent Ribs, Moosnake Ribs, Ouroboros Ribs
- **gel** `a401-405` (PROTEIN) - Big Gelatin, Large Gelatin, Huge Gelatin, Massive Gelatin, Colossal Gelatin
- **petal** `a431-435` (VEGETABLE) - Faerie Petal, Faerie Bud, Faerie Flower, Faerie Blossom, Faerie Bouquet
- **egg** `a436-440` (PROTEIN) - Bug Eggs, Critter Eggs, Avian Eggs, Froggo Eggs, Ghosty Eggs

### Nearly-clean: one smithing recipe each

Worth decontesting rather than replacing, because each costs a single recipe rework and two of them
are the only drop source their lane has:

- **fish** `a426-430` - the entire fish supply
- **tuber** `a381-385` (Root) - CARB's only drop source
- **aquatic** `a341-345` (Coral) - VEGETABLE, less critical

---

## PROTEIN - 61

### `egg`

| Ref | Name | Icon | Source | Used by | Verdict |
|---|---|---|---|---|---|
| `i92` | Eggs | 248 | shop | cook | already an item |
| `a436` | Bug Eggs | 349 | lv3-42 (28) | cook | MIGRATE to item |
| `a437` | Critter Eggs | 349 | lv25-65 (23) | - | MIGRATE to item |
| `a438` | Avian Eggs | 349 | lv42-55 (20) | - | MIGRATE to item |
| `a439` | Froggo Eggs | 349 | NO SOURCE | - | MIGRATE to item |
| `a440` | Ghosty Eggs | 349 | NO SOURCE | - | MIGRATE to item |

### `meat`

| Ref | Name | Icon | Source | Used by | Verdict |
|---|---|---|---|---|---|
| `a346` | Scavenged Tail | 320 | lv17-43 (39) | - | MIGRATE to item |
| `a347` | Sinewy Tail | 320 | lv43-43 (1) | - | MIGRATE to item |
| `a348` | Beefy Tail | 320 | lv64-64 (1) | cook | MIGRATE to item |
| `a349` | Thicc Tail | 320 | lv64-64 (1) | - | MIGRATE to item |
| `a350` | Dargin Tail | 320 | lv75-75 (20) | - | MIGRATE to item |
| `a386` | Bearcat Flank | 330 | lv6-6 (7) | cook | MIGRATE to item |
| `a387` | Ripped Flank | 330 | lv56-56 (1) | - | MIGRATE to item |
| `a388` | Grim Flank | 330 | lv56-56 (1) | cook | MIGRATE to item |
| `a389` | Volt Jelli Flank | 330 | NO SOURCE | - | MIGRATE to item |
| `a390` | Gigacat Flank | 330 | NO SOURCE | - | MIGRATE to item |
| `a396` | Boney Ribs | 332 | lv10-37 (21) | cook | MIGRATE to item |
| `a397` | Lamia Ribs | 332 | lv37-37 (10) | cook | MIGRATE to item |
| `a398` | Serpent Ribs | 332 | lv51-51 (8) | cook | MIGRATE to item |
| `a399` | Moosnake Ribs | 332 | NO SOURCE | - | MIGRATE to item |
| `a400` | Ouroboros Ribs | 332 | NO SOURCE | - | MIGRATE to item |
| `a421` | Damaged Wing | 343 | lv3-39 (66) | **smith** | CONTESTED (3 smith uses in family) |
| `a422` | Flappy Wing | 343 | lv25-65 (21) | **smith** | CONTESTED (3 smith uses in family) |
| `a423` | Glossy Wing | 343 | lv61-65 (2) | - | CONTESTED (3 smith uses in family) |
| `a424` | Double Wing | 343 | lv64-64 (1) | **smith** | CONTESTED (3 smith uses in family) |
| `a425` | Iridescent Wing | 343 | NO SOURCE | - | CONTESTED (3 smith uses in family) |

### `offal`

| Ref | Name | Icon | Source | Used by | Verdict |
|---|---|---|---|---|---|
| `a356` | Detached Eyeball | 324 | lv20-54 (13) | - | MIGRATE to item |
| `a357` | Lacerated Eyeball | 324 | lv39-40 (2) | cook | MIGRATE to item |
| `a358` | Snooping Eyeball | 324 | NO SOURCE | - | MIGRATE to item |
| `a359` | Helicopter Eyeball | 324 | NO SOURCE | - | MIGRATE to item |
| `a360` | Peerless Eyeball | 324 | NO SOURCE | - | MIGRATE to item |
| `a366` | Old Bone | 326 | lv9-38 (40) | **smith** | CONTESTED (2 smith uses in family) |
| `a367` | Mossy Bone | 326 | lv22-45 (4) | **smith** | CONTESTED (2 smith uses in family) |
| `a368` | Earthen Bone | 326 | lv45-45 (1) | cook | CONTESTED (2 smith uses in family) |
| `a369` | Petrified Bone | 326 | NO SOURCE | - | CONTESTED (2 smith uses in family) |
| `a370` | Spiral Bone | 326 | NO SOURCE | - | CONTESTED (2 smith uses in family) |
| `a371` | Dried Blood | 327 | lv9-70 (22) | **smith** | CONTESTED (5 smith uses in family) |
| `a372` | Coagulated Blood | 327 | lv28-65 (12) | cook, **smith** | CONTESTED (5 smith uses in family) |
| `a373` | Virgin Blood | 327 | lv56-65 (2) | **smith** | CONTESTED (5 smith uses in family) |
| `a374` | Sinister Blood | 327 | lv72-72 (1) | **smith** | CONTESTED (5 smith uses in family) |
| `a375` | Blue Blood | 327 | NO SOURCE | **smith** | CONTESTED (5 smith uses in family) |
| `a391` | Imp Tongue | 331 | lv24-24 (1) | cook, **smith** | CONTESTED (5 smith uses in family) |
| `a392` | Goblin Tongue | 331 | lv30-30 (1) | **smith** | CONTESTED (5 smith uses in family) |
| `a393` | Froggo Tongue | 331 | lv30-30 (1) | **smith** | CONTESTED (5 smith uses in family) |
| `a394` | Dying Tongue | 331 | NO SOURCE | **smith** | CONTESTED (5 smith uses in family) |
| `a395` | Sinister Tongue | 331 | NO SOURCE | **smith** | CONTESTED (5 smith uses in family) |
| `a411` | Animal Heart | 336 | lv10-25 (10) | **smith** | CONTESTED (5 smith uses in family) |
| `a412` | Beast Heart | 336 | lv25-25 (1) | cook, **smith** | CONTESTED (5 smith uses in family) |
| `a413` | Hydro Heart | 336 | lv55-55 (1) | cook, **smith** | CONTESTED (5 smith uses in family) |
| `a414` | Titan Heart | 336 | lv12-69 (10) | **smith** | CONTESTED (5 smith uses in family) |
| `a415` | Dargin Heart | 336 | NO SOURCE | **smith** | CONTESTED (5 smith uses in family) |

### `gel`

| Ref | Name | Icon | Source | Used by | Verdict |
|---|---|---|---|---|---|
| `a401` | Big Gelatin | 333 | lv3-55 (38) | cook | MIGRATE to item |
| `a402` | Large Gelatin | 333 | lv19-55 (25) | - | MIGRATE to item |
| `a403` | Huge Gelatin | 333 | lv40-55 (2) | cook | MIGRATE to item |
| `a404` | Massive Gelatin | 333 | NO SOURCE | - | MIGRATE to item |
| `a405` | Colossal Gelatin | 333 | NO SOURCE | - | MIGRATE to item |

### `fish`

| Ref | Name | Icon | Source | Used by | Verdict |
|---|---|---|---|---|---|
| `a426` | Smelly Fish | 245 | lv7-36 (21) | cook | CONTESTED (1 smith uses in family) |
| `a427` | Ordinary Fish | 245 | lv31-36 (11) | cook | CONTESTED (1 smith uses in family) |
| `a428` | Fresh Fish | 245 | lv36-36 (1) | - | CONTESTED (1 smith uses in family) |
| `a429` | Sparkling Fish | 245 | NO SOURCE | **smith** | CONTESTED (1 smith uses in family) |
| `a430` | Pristine Fish | 245 | NO SOURCE | - | CONTESTED (1 smith uses in family) |

## VEGETABLE - 28

### `vine`

| Ref | Name | Icon | Source | Used by | Verdict |
|---|---|---|---|---|---|
| `i78` | Bell Pepper | 276 | shop | cook | already an item |
| `i79` | Tomato | 277 | shop | cook | already an item |
| `a446` | Wolftrap Vine | 794 | lv5-5 (9) | cook, **smith** | CONTESTED (3 smith uses in family) |
| `a447` | Bloodtrap Vine | 794 | lv23-23 (1) | cook, **smith** | CONTESTED (3 smith uses in family) |
| `a448` | Subtrap Vine | 794 | NO SOURCE | **smith** | CONTESTED (3 smith uses in family) |
| `a449` | Voidtrap Vine | 794 | NO SOURCE | - | CONTESTED (3 smith uses in family) |
| `a450` | Doomtrap Vine | 794 | NO SOURCE | - | CONTESTED (3 smith uses in family) |

### `pod`

| Ref | Name | Icon | Source | Used by | Verdict |
|---|---|---|---|---|---|
| `i80` | Green Beans | 278 | shop | cook | already an item |

### `leaf`

| Ref | Name | Icon | Source | Used by | Verdict |
|---|---|---|---|---|---|
| `i81` | Lettuce | 279 | shop | - | already an item |
| `a321` | Dead Greens | 797 | lv0-35 (59) | cook | MIGRATE to item |
| `a322` | Leafy Greens | 797 | lv20-61 (4) | - | MIGRATE to item |
| `a323` | Bouncy Greens | 797 | lv55-61 (3) | - | MIGRATE to item |
| `a324` | Fine Greens | 797 | lv61-61 (1) | - | MIGRATE to item |
| `a325` | Verdant Greens | 797 | NO SOURCE | - | MIGRATE to item |

### `root`

| Ref | Name | Icon | Source | Used by | Verdict |
|---|---|---|---|---|---|
| `i82` | Carrot | 280 | shop | cook | already an item |

### `bulb`

| Ref | Name | Icon | Source | Used by | Verdict |
|---|---|---|---|---|---|
| `i83` | Onion | 281 | shop | cook | already an item |

### `fungus`

| Ref | Name | Icon | Source | Used by | Verdict |
|---|---|---|---|---|---|
| `i86` | Mushrooms | 284 | lv10-64 (11) | cook | already an item |

### `stalk`

| Ref | Name | Icon | Source | Used by | Verdict |
|---|---|---|---|---|---|
| `i87` | Broccoli | 285 | shop | cook | already an item |

### `aquatic`

| Ref | Name | Icon | Source | Used by | Verdict |
|---|---|---|---|---|---|
| `a341` | Dry Coral | 319 | lv8-55 (20) | - | CONTESTED (1 smith uses in family) |
| `a342` | Gnarled Coral | 319 | lv32-55 (3) | - | CONTESTED (1 smith uses in family) |
| `a343` | River Coral | 319 | lv36-55 (3) | cook, **smith** | CONTESTED (1 smith uses in family) |
| `a344` | Layered Coral | 319 | NO SOURCE | - | CONTESTED (1 smith uses in family) |
| `a345` | Kapn Coral | 319 | NO SOURCE | - | CONTESTED (1 smith uses in family) |

### `petal`

| Ref | Name | Icon | Source | Used by | Verdict |
|---|---|---|---|---|---|
| `a431` | Faerie Petal | 347 | lv5-20 (38) | cook | MIGRATE to item |
| `a432` | Faerie Bud | 347 | lv61-61 (1) | - | MIGRATE to item |
| `a433` | Faerie Flower | 347 | lv61-61 (1) | - | MIGRATE to item |
| `a434` | Faerie Blossom | 347 | NO SOURCE | - | MIGRATE to item |
| `a435` | Faerie Bouquet | 347 | NO SOURCE | - | MIGRATE to item |

## CARB - 10

### `tuber`

| Ref | Name | Icon | Source | Used by | Verdict |
|---|---|---|---|---|---|
| `i84` | Potato | 282 | shop | cook | already an item |
| `a381` | Tough Root | 185 | lv10-64 (10) | - | CONTESTED (1 smith uses in family) |
| `a382` | Sprouting Root | 185 | lv64-64 (1) | **smith** | CONTESTED (1 smith uses in family) |
| `a383` | Petrified Root | 185 | lv64-64 (1) | - | CONTESTED (1 smith uses in family) |
| `a384` | Deep Root | 185 | NO SOURCE | - | CONTESTED (1 smith uses in family) |
| `a385` | Infinity Root | 185 | NO SOURCE | - | CONTESTED (1 smith uses in family) |

### `seed`

| Ref | Name | Icon | Source | Used by | Verdict |
|---|---|---|---|---|---|
| `i85` | Nuts | 283 | shop | cook | already an item |

### `noodle`

| Ref | Name | Icon | Source | Used by | Verdict |
|---|---|---|---|---|---|
| `i89` | Pasta | 1968 | shop | - | already an item |

### `grain`

| Ref | Name | Icon | Source | Used by | Verdict |
|---|---|---|---|---|---|
| `i93` | Rice | 303 | shop | cook | already an item |

### `bread`

| Ref | Name | Icon | Source | Used by | Verdict |
|---|---|---|---|---|---|
| `i94` | Bread | 246 | shop | cook | already an item |

## FRUIT - 3

### `berry`

| Ref | Name | Icon | Source | Used by | Verdict |
|---|---|---|---|---|---|
| `i88` | Erociberries | 267 | shop | cook | already an item |

### `tropical`

| Ref | Name | Icon | Source | Used by | Verdict |
|---|---|---|---|---|---|
| `i95` | Coconut | 261 | shop | - | already an item |

### `citrus`

| Ref | Name | Icon | Source | Used by | Verdict |
|---|---|---|---|---|---|
| `i96` | Lemon | 263 | shop | cook | already an item |

## DAIRY - 3

### `cheese`

| Ref | Name | Icon | Source | Used by | Verdict |
|---|---|---|---|---|---|
| `i90` | Cheese | 241 | shop | cook | already an item |

### `milk`

| Ref | Name | Icon | Source | Used by | Verdict |
|---|---|---|---|---|---|
| `i91` | Malk | 1953 | shop | cook | already an item |

### `butterfat`

| Ref | Name | Icon | Source | Used by | Verdict |
|---|---|---|---|---|---|
| `i98` | Butter | 291 | lv12-22 (35) | cook | already an item |

## SWEET - 5

### `jelly`

| Ref | Name | Icon | Source | Used by | Verdict |
|---|---|---|---|---|---|
| `a416` | Gross Slime | 342 | lv3-40 (6) | **smith** | CONTESTED (3 smith uses in family) |
| `a417` | Leftover Slime | 342 | lv22-54 (14) | **smith** | CONTESTED (3 smith uses in family) |
| `a418` | Slimy Slime | 342 | lv35-40 (2) | cook, **smith** | CONTESTED (3 smith uses in family) |
| `a419` | Putrid Slime | 342 | NO SOURCE | - | CONTESTED (3 smith uses in family) |
| `a420` | Ancient Slime | 342 | NO SOURCE | - | CONTESTED (3 smith uses in family) |

## SHARED - 12

### `vessel`

| Ref | Name | Icon | Source | Used by | Verdict |
|---|---|---|---|---|---|
| `i73` | Container | 2083 | lv25-25 (1) | cook | already an item |

### `herb`

| Ref | Name | Icon | Source | Used by | Verdict |
|---|---|---|---|---|---|
| `i74` | Earthy Herbs | 181 | lv0-35 (10) | cook | already an item |
| `i75` | Minty Herbs | 272 | lv8-55 (3) | cook | already an item |
| `i76` | Spicy Herbs | 273 | lv35-35 (3) | cook | already an item |

### `liquid`

| Ref | Name | Icon | Source | Used by | Verdict |
|---|---|---|---|---|---|
| `i77` | Water | 176 | shop | cook | already an item |

### `spice`

| Ref | Name | Icon | Source | Used by | Verdict |
|---|---|---|---|---|---|
| `i97` | Seasoning | 250 | shop | cook | already an item |
| `a331` | Odorless Powder | 303 | lv1-70 (22) | **smith** | CONTESTED (3 smith uses in family) |
| `a332` | Odorful Powder | 303 | lv26-52 (16) | cook, **smith** | CONTESTED (3 smith uses in family) |
| `a333` | Ghastly Powder | 303 | lv52-52 (9) | cook | CONTESTED (3 smith uses in family) |
| `a334` | Spectral Powder | 303 | NO SOURCE | **smith** | CONTESTED (3 smith uses in family) |
| `a335` | Transparent Powder | 303 | NO SOURCE | - | CONTESTED (3 smith uses in family) |

### `oil`

| Ref | Name | Icon | Source | Used by | Verdict |
|---|---|---|---|---|---|
| `i99` | Cooking Oil | 2089 | shop | cook | already an item |

---

## What the buckets say is missing

| Lane | Uncontested drop source | Needs |
|---|---|---|
| PROTEIN | meat, egg, gel, eyeball (+ fish after decontest) | nothing - sort, do not build |
| VEGETABLE | leaf, petal (+ aquatic after decontest) | nothing urgent |
| CARB | none until Root is decontested | harvest sources for grain, bread, noodle, seed |
| SWEET | **none** - Slime is forge-first | **a whole lane of new items** |
| FRUIT | **none** - three shop items only | **new items plus Tree harvest nodes** |
| DAIRY | **none** - three shop items only | **new items plus a bovine source** |
| SHARED | herbs drop; Powder is forge-first | fine as-is |

Two entries that cooking recipes consume are almost certainly not food, and want removing from those
recipes: **Raw Rouge** `i11` and **Raw Bleu** `i14`, both gem/technodisk raws.
