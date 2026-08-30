# Harvest nodes — what grows where

> **Status: 2026-08-29.** The single record of every harvestable node in the game, what each one is,
> what it drops, which biome it lives in, and what it looks like.
>
> | Layer | State |
> |---|---|
> | **Node enemies** | all authored — grass, 7 woods, 7 ores, and the 22 crop/fruit/flower/coral nodes |
> | **Sprites** | all 36 cut, named per node, live in `img/characters/` |
> | **Grass** | fully placed and affixed — 420 placements |
> | **Woods and ores** | placed, and **336 event pages repointed** at their own sprites |
> | **Crops** | **authored but not placed** — this is the remaining work |
>
> **Related:** [`drop-sources.md`](drop-sources.md) covers the other half — what *creatures* drop, and
> the 46 monster material blocks. [`../maps/progression-bands.md`](../maps/progression-bands.md) is the
> ordered biome list these placements hang off.

---

## What a harvest node is

A destructible in `Enemies.json` **1-100**: a plant, a deposit or a container rather than a creature.
Mechanically it is an ordinary JABS enemy — you swing at it and it dies — so `drop` versus `farm` in
[`../food/ingredient-sorting.md`](../food/ingredient-sorting.md) describes *where a node lives in the
fiction*, not how it is harvested. **There is no separate farming system and there does not need to be
one.** A grapevine on a farm plot and a bramble on a roadside are the same event with different
scenery.

## Ladders and peer sets are different, and price does not tell you which

Some ingredient families **ladder** — Brown Potato → Gold → Big Ass → Is This Even Still A Potato is a
real progression, and a node should drop the later rungs more rarely.

Others are **peer sets**. Salt, Cumin, Garlic and Nutmeg are not tiers of one another; they are four
spices hanging next to each other. The same is true of the four herbs. **Do not read the 20/40/60/80
gold prices as a tier order** — the prices are arbitrary for these families, and treating them as a
ladder would make Nutmeg rare for no reason.

When authoring a node's drop table, decide which kind of family it is first. **The peer sets are
`*Bean Vine`, `*Salad Patch` and `*Spice Patch`** — flat rates across every rung. Everything else ladders at
**50 / 30 / 15 / 5**.

**A node's database level is where the player first meets it.** `*Mushroom Cluster` is level 7 because the Pearl
Salt Mines is the earliest place it appears, even though it also grows in the Earthen Layer and the
Subterranean. Later biomes carry a `<level:N>` tag on the map event instead, which overrides the
database — so one node row serves every band it appears in.

---

## The nodes

**Scaffolded into `Enemies.json` on 2026-08-28**, into the `=== OPEN` slots: ground crops at **61-73**,
fruit and tree crops at **81-87**, `*Faerie Flower` at **91** and `*Coral Growth` at **92**. Two body templates were
copied from the existing destructibles — soft ground plants follow `*Grass (Erocian)` (50 base HP,
double damage from Cut, Heat and anti-Plant) and anything woody follows `*Sapling (Oak)` (500 base HP,
plus a Ground resistance a rooted thing would have). Each carries its biome's level from the
distribution table below.

### Ground crops

| Node | What it is | Drops |
|---|---|---|
| `*Grain Stalks` | A stand of cereal stalks | Oat `i331` · Wheat `i332` · Rice `i333` · Millet `i334` |
| `*Potato Plant` | A potato plant, dug up | Brown `i316` · Gold `i317` · Big Ass `i318` · Is This Even Still A Potato `i319` |
| `*Carrot Plant` | Leafy tops in a row | Sad `i291` · Orange `i292` · Perky `i293` · Happiness `i294` |
| `*Onion Plant` | Bulbs under a green fan | Yellow Onion `i296` · Ao Negi `i297` · Shallot `i298` · Tropea `i299` |
| `*Pepper Bush` | A low bush hung with pods | Red `i251` · Green `i252` · Heat `i253` · Tingly `i254` |
| `*Tomato Vine` | A staked, sprawling vine | Red `i256` · Green Tomatillo `i257` · Vine `i258` · Crimson `i259` |
| `*Bean Vine` | Climbing bean vines | Green `i266` · Round `i267` · Sugar `i268` · Scarlet Beans `i269` |
| `*Sprout Patch` | Low sprouting greens | Sprouts `i271` · Fermented `i272` · Sticky `i273` · Sour `i274` |
| `*Salad Patch` | Leafy heads | Lettuce `i276` · Cabbage `i277` · Romaine `i278` · Kale `i279` |
| `*Gourd Vine` | Gourd vines sprawling on the ground | Eggplant `i311` · Zucchini `i312` · Pumpkin `i313` |
| `*Mushroom Cluster` | Mushrooms on soil, deadwood or cave wall | Button `i301` · Whitecap `i302` · Shiitake `i303` · Maitake `i304` |
| `*Sugar Cane` | Tall sugarcane stalks | Cane Sugar `i391` |
| `*Spice Patch` | Mixed aromatic plants | Cumin `i427` · Garlic `i428` · Nutmeg `i429` |

### Fruit and tree crops

| Node | What it is | Drops |
|---|---|---|
| `*Berry Bush` | A thorny berry bush | Grapes `i341` · Raspberry `i342` · Currants `i343` · Elderberry `i344` |
| `*Palm Tree` | Palm and broadleaf, warm coast | Banana `i346` · Coconut `i347` · Mango `i348` · Papaya `i349` |
| `*Citrus Tree` | A small glossy-leaved tree | Lemon `i351` · Orange `i352` · Pomelo `i353` · Yuzu `i354` |
| `*Orchard Tree` | A temperate fruit tree | Apple `i356` · Pear `i357` · Cherry `i358` · Plum `i359` |
| `*Melon Vine` | Melon vines running along the ground | Melon `i361` · Watermelon `i362` · Canteloupe `i363` · Honeydew `i364` |
| `*Nut Tree` | A nut-bearing tree | Stale Nuts `i321` · Peanuts `i322` · Walnuts `i323` · Hazelnuts `i324` |
| `*Cacao Tree` | A cacao tree hung with pods | Cacao `i401` · Burgundy `i402` · Double Dark `i403` · Black `i404` |

### The rest

| Node | What it is | Drops |
|---|---|---|
| `*Faerie Flower` | A flowering plant | Faerie Petal `i286` · Bud `i287` · Blossom `i288` · Bouquet `i289` |
| `*Coral Growth` | Mineral growth, submerged or fossil | Dry `i306` · River `i307` · Layered `i308` · Ancient `i309` |
| `*Shrub` / `*Tree` / `*Sapling` / `*Snag` / `*Thicket` | Woody growth, cut for timber | Oak `i45` · Dreamwood `i47` · Negapine `i49` and siblings, plus `511 plank` |
| `*Vein` / `*Lode` / `*Geode` / `*Outcrop` | Mineral in rock | ore `i30-36` · gems `i60-70` · the `401 stone` block · **Salt `i426`, Sea Salt `i438`** |
| `*Crate` | A container, not a plant | mixed ore, stone and gems |

### Three items that must never get a node

- **Tofu `i314`** sits in the sponge block but is *cooked* from Round Beans and Mineral Water. The
  `vegetable+sponge` tag says what it **is**, not how it is obtained — exactly as `carb+noodle` on Soba
  does not imply a noodle plant.
- **Salt `i426` and Sea Salt `i438`** carry the `spice` tag but come out of the ground. They belong on
  mineral nodes — a beach deposit yielding salt commonly and sea salt rarely, alongside ordinary stone.

### The one-off that is not a family

**Ice, in the Negative Peaks.** Water `i421-424` has no plant to grow on and a pond has nothing to
swing at, so the only destructible water source that holds up is a shatterable ice formation. It is one
node rather than a family, and it belongs with the mineral nodes. Everything else water comes from
creatures that are full of it — Kappa, Polliwog, Spitting Frog, the wetter slimes — or from the shop.

### What this changes about acquisition modes

`ingredient-sorting.md` marks tropical, citrus, orchard and rind as `farm` only. Giving them nodes makes
them **farm *and* drop**, the same dual mode greens and herbs already carry. Since a farm plot and a
roadside are the same event with different scenery, that is a labelling correction rather than a design
change — but it is a change to that file, and it is Jeremy's to make.

---

## Grass is one node with an elemental affix

Rather than a different grass per biome, there is **one grass carrying an elemental affix**, and the
affix decides what it yields. The suffix tells the player what they are about to get instead of making
them infer it from where they are standing, and it reuses the elemental vocabulary the affix system
already speaks.

The affixes are the existing `<enemy-suffix>` states in `States.json`, ten blocks of five, one block per
element. Grass uses the first of each block. **The drop tags live on the state, not on the grass** —
`J-Drops-Passive` adds `this.allStates()` to an enemy's drop sources, so anything wearing the affix
yields the herb and the grass enemy itself knows nothing about herbs.

| Element | State | Affix | Yields |
|---|---|---|---|
| **Ground** | 381 | Clay | Earthy Herbs `i416` |
| **Liquid** | 371 | Brine | Minty Herbs `i417` — *the name wants revisiting to read liquid-elemental* |
| **Heat** | 366 | Char | Spicy Herbs `i418` |
| **Air** | 376 | Froth | Wispy Herbs `i419` |
| **Void** | 391 | Smoke | Nutmeg `i429` |
| **Energy** | 386 | Purity | Salt `i426` — *not yet tagged* |

Each drops its item three times at **50 / 25 / 10**, so one kill can yield up to three.

**Plain grass with no affix is a legitimate state.** The Crossroads and the road into Raevula carry
bare grass on purpose — it is just grass, and the elemental variants are what make a biome read as
somewhere in particular.

Every grass also drops the ordinary greens line — Leafy `i281`, Bouncy `i282`, Fine `i283`, Verdant
`i284` — which *is* a genuine ladder and should rarify accordingly.

**Salt and Nutmeg deliberately have two sources each.** Salt comes off beach mineral nodes and off
energy grass; Nutmeg is grown and also comes off void grass. Two routes to one item is not a conflict —
it is the same reasoning that lets scales drop from ten different subgroups.

**Wispy Herbs `i419` currently has no source anywhere.** It was authored during the recipe redesign and
never placed. `Grass of Mist` is what fixes that.

---

## Grass as placed, 2026-08-28

The grass half is **built**. 420 placements carry their biome's affix or are deliberately bare.

| Affix | Element | Placements | Where |
|---|---|---|---|
| Clay 381 | Ground | 112 | Forest of Dreams, one in the Pearl Salt basement |
| Brine 371 | Liquid | 176 | Lakeside Road, Erocia Isthmus, Highwater Way |
| Froth 376 | Air | 109 | Outer Cliffs, Negative Peaks |
| Smoke 391 | Void | 82 | Fallen Kingdom courtyard |
| Char 366 | Heat | 65 | Volcanis Grotto |
| *(bare)* | — | 63 | Crossroads, the road into Raevula |

The **Fallen Kingdom courtyard** was not in the plan below — grass went in because the courtyard has
bare dirt, and it reads dreary, which is why it draws Void and yields nutmeg rather than a herb.

The **Earthen Layer's sixteen** are deliberately left bare and untagged: that cave is `*Mushroom Cluster`
territory, and its old `*Puff (Earthen)` events are awaiting conversion rather than an affix.

## The sprites

**Every node has art, one sprite per node, as of 2026-08-29.** They live in
`chef-adventure/img/characters/potential-crops/` — crops at the root, `trees/` for the seven lumber
woods, `ores/` for the seven ores — with `sheets/` holding the same files converted to RMMZ character
sheets. Filenames match the node: `*Carrot Plant` eats `$o_crop-carrot`.

**A `$`-prefixed character sheet is 3W x 4H**, the still repeated into all twelve cells — three
animation frames across, four facings down. `$o_grass.png` was the reference at 141x188, a 47x47
sprite tiled 3x4.

**Everything is true-colour RGBA, and it matters.** These were cropped out of indexed tilesets, so
each file initially carried its own private palette; copying a sprite between two of them made
Aseprite remap every pixel to the nearest colour the destination happened to have, which silently
shifted the reds. Converting to colour-type 6 removed the palette entirely. **Keep new sprites RGB.**

**Fruit trees were built by stamping, not by recolouring.** Four different canopies were cut first —
squat and gnarled for orchard, compact and round for citrus, tall and layered for nut, weeping for
cacao — and then the same apple was pasted onto each and recoloured per tree. Colour alone could never
have separated them, because a recoloured silhouette is still the same silhouette. **Cacao carries its
pods on the trunk**, which is how cacao actually fruits and makes it the one tree nobody can mistake.

**Two art rules learned the hard way.** Recolour by sampling the sprite's existing shading ramp and
swapping it rung for rung with a tight fuzz — the original artist's light and volume survive because
only the hue moves, and the *contrast spacing* between rungs has to be preserved or the form goes flat.
And **shape beats colour every time**: grapes read as grapes until they stopped being clustered,
pumpkins read as pumpkins until the ribs came off, carrots read as carrots until the fronds became
upright shoots.

## Biome distribution

Bands are from [`../maps/progression-bands.md`](../maps/progression-bands.md). Bolded biomes are
unbuilt.

| Biome | Band | Nodes |
|---|---|---|
| Intro Cave | 1 | — tutorial, deliberately empty |
| Crossroads | 2-25 | `Grass of Clay`, `*Grain Stalks`, `*Salad Patch` |
| Raevula + Heartbeat | 3-8 | `Grass of Clay`, `*Carrot Plant`, `*Onion Plant`, `*Tomato Vine`, `*Berry Bush` |
| Academy | 3-12 | — sampler map |
| Pearlsalt Ground | 6-9 | `*Vein (Iron)`, `*Mushroom Cluster` |
| Pearlsalt Basement | 6-40 | `*Vein (Silver)`, `*Vein (Bleu)`, `*Mushroom Cluster` |
| Forest of Dreams | 10-12 | `Grass of Clay`, `*Mushroom Cluster`, `*Carrot Plant`, `*Nut Tree`, `*Faerie Flower` |
| Forlorn Basin v1 | 11-19 | `*Vein (Iron)`, `*Mushroom Cluster` |
| Outer Cliffs | 20-25 | `Grass of Mist`, `*Nut Tree`, `*Gourd Vine` |
| Earthen Layer | 23-28 | `*Mushroom Cluster`, `*Vein` |
| Lakeside Road | 23-25 | `Grass of Brine`, `*Bean Vine`, `*Sprout Patch` |
| Forlorn Basin v2 | 30-32 | `*Vein (Bleu)`, `*Mushroom Cluster` |
| Erocia Isthmus | 32-38 | `Grass of Brine`, `*Sugar Cane`, `*Citrus Tree` |
| Highwater Way | 32-38 | `Grass of Brine`, `*Melon Vine`, `*Sprout Patch` |
| Volcanis Grotto | 39-43 | `Grass of Char`, `*Pepper Bush`, `*Spice Patch` |
| Fallen Kingdom | 49-55 | `*Orchard Tree`, `*Berry Bush`, `*Faerie Flower` |
| Negative Peaks | 61-65 | `Grass of Mist`, `*Potato Plant`, `*Bean Vine` |
| **Crystalline Ravine** | 75-90 | `*Coral Growth`, `*Berry Bush`, `*Geode` |
| **Seashell Shores** | 80-95 | `*Palm Tree`, `*Coral Growth`, `*Melon Vine`, `*Cacao Tree`, beach salt deposit |
| **Deluge Plains** | 85-100 | `Grass of Brine`, `*Grain Stalks`, `*Bean Vine` |
| **Desolate Graves** | 90-105 | `*Mushroom Cluster`, `*Faerie Flower`, `*Spice Patch` |
| **Windward Tunnels** | — | `Grass of Mist`, `*Mushroom Cluster`, `*Vein` |
| **Nimbus** | 85-100 | salty grass, `*Orchard Tree`, `*Nut Tree` |
| **The Subterranean** | 95-110 | aromatic grass, `*Mushroom Cluster`, `*Vein (Deepe)` |
| **Frozen Fortress** | 115-130 | — nothing grows; it is the finale |

**Two placements doing storytelling for free.** `*Orchard Tree` gone feral in the **Fallen Kingdom** —
somebody planted those trees, and then the kingdom was aged to death. And **rice in the Deluge Plains**,
because a flooded valley is a paddy and nowhere else in the game is.

**Coral Growth gives the Crystalline Ravine a job.** `story-canon.md` records the ravine's purpose as open, and
coral is otherwise the one ingredient family with nowhere at all to come from. A coral field at 75-90
answers both at once.

**The Earthen Layer keeps a node deliberately.** It is already the thinnest dungeon in the game — three
species across seven maps — so removing `*Puff (Earthen)` without replacement would leave it with
nothing at all. `*Mushroom Cluster` fits a cave, and its band at 23-28 is a sensible place for the mushroom line
to appear.

---

## Material tiers and the level bands they belong to `SET 2026-08-29`

**Both wood and ore are tiered, and the crafting recipes already declare the ladder** — a tier-N weapon
consumes 12x the tier-N wood or ingot, so material tier *is* weapon tier. Nothing needs inferring.

| Tier | Metal | Wood | Paper | Level band |
|---|---|---|---|---|
| 1 | Iron | Oak | Basic Paper | **1-15** |
| 2 | Silver | Dreamwood | Lofty Sheet | **10-35** — the ⭐ named weapon shows up here |
| 3 | Bleu | Negapine | Dense Vellum | **25-50** |
| 4 | Sandwraith | Grimwood | Grim Stock | **45-75** — ⭐⭐ available around here |
| 5 | Engle | Subwood | Sheer Papyrus | **60-100** |
| 6 | Deepe | Heartwood | Decadent Parchment | **90-130** — a player probably finishes the game on this; ⭐⭐⭐ lands here |
| legendary | Ultanium | Digiwood | Holographic Viewer | **125+** — postgame, or for smashing the main content |

The bands overlap deliberately. A player is not pushed off one tier the moment the next appears; they
run alongside each other for a stretch.

**Price is not tier.** The wood rows all sit at 400g and the ore rows past Silver at 0g, both of which
are copy-paste artefacts. Reading a ladder out of the prices produces a wrong answer — Claude did
exactly that on 2026-08-29 and concluded the woods were a peer set. The recipes are the authority.

**Monster materials are not a universal backstop either.** It is tempting to assume high-tier wood and
ore found early cannot be exploited because the recipe still demands monster parts, and for some
weapons that holds — `w-sword-06` wants skull, powder and wings. But `w-warstaff-06` is **12x Heartwood
plus cloth, an essence and a gem**, with no monster material at all. So where a wood or ore is found
genuinely does gate weapon tier, and placement has to respect the bands above.

## The wood and ore drop ladders `SET 2026-08-29`

Both families had the same bug, and it is worth naming because it will recur: **nodes cloned from a
sibling keep the sibling's drops.** Grimwood, Subwood, Heartwood and Digiwood all dropped *Negapine*;
Engle, Deepe and Ultanium all dropped *Silver and Bleu*. Seven items were unobtainable, and nothing
complained, because a wrong drop tag is still a valid drop tag.

**Woods are uniform.** Each of the seven drops **only its own wood**, five tags at
**100 / 80 / 50 / 25 / 10**. There is no lesser-wood consolation: an oak gives oak.

**Ores ladder into each other.** Each drops **its own ore at 100 / 80 / 50 / 25 / 10**, plus **the tier
directly below it at 40 / 20**. So a Bleu druse also yields silver, and a Lode of Ultanium also yields
deepe. Iron is the floor and drops only itself. The ore order is
`Iron -> Silver -> Bleu -> Sandwraith -> Engle -> Deepe -> Ultanium`.

Ore nodes additionally carry **stone-block materials that climb with the node's tier** — iron gives
Worn and Round Stone, sandwraith gives Round through Trapezoidal. That ladder predates this pass and
is left as it was; it is the same one-block-across-many-nodes pattern the whole drop grid uses.

### Gems: signature, not exclusive

Every ore node drops **all six gem types**, so no gem is ever gated behind late-game access — a player
can grind rubies off a chapter-one iron deposit if they are stubborn enough. But each node has a
**signature gem at 20%** against **4%** for the rest, and **the rare cut only drops from its signature
node** at 3%.

| Node | Crystal colour | Signature gem |
|---|---|---|
| `*Deposit (Iron)` | black | Crystal |
| `*Vein (Silver)` | white | Diamond |
| `*Druse (Bleu)` | blue | Sapphire |
| `*Outcrop (Sandwraith)` | olive-yellow | Topaz |
| `*Geode (Engle)` | green | Emerald |
| `*Cluster (Deepe)` | violet | Ruby |
| `*Lode (Ultanium)` | gold | **none — all six, both cuts, at 10 / 5%** |

**The signature is readable off the sprite.** The blue crystal gives sapphires; the green one gives
emeralds. A player learns that without being told, and it gives someone hunting a specific gem
somewhere to go rather than a wall to grind. Ultanium is deliberately the exception: the last node in
the game is a lottery, which makes it different in *kind* rather than merely in rate.

## Placement status

**The graphic lives on the map event, not on the enemy**, so every placement carries its own pointer
and they drift. On 2026-08-29 all existing wood and ore placements were repointed at the per-node
sprites; before that, every oak in the game shared one generic tree and every ore was a tile.

| Node | Pages | Maps | Sprite |
|---|---|---|---|
| `*Sapling (Oak)` | 83 | 16 | `$o_tree-oak` |
| `*Shrub (Dreamwood)` | 54 | 25 | `$o_tree-dreamwood` |
| `*Tree (Negapine)` | 40 | 8 | `$o_tree-negapine` |
| `*Deposit (Iron)` | 102 | 39 | `$o_ore-iron` |
| `*Vein (Silver)` | 29 | 14 | `$o_ore-silver` |
| `*Druse (Bleu)` | 10 | 1 | `$o_ore-bleu` |
| `*Outcrop (Sandwraith)` | 18 | 5 | `$o_ore-sandwraith` |

**Not placed anywhere yet:** all 22 crop nodes, plus `*Snag (Grimwood)`, `*Shrub (Subwood)`,
`*Tree (Heartwood)`, `*Branching (Digiwood)`, `*Geode (Engle)`, `*Cluster (Deepe)` and
`*Lode (Ultanium)`. Use the biome distribution above as the checklist.

### Where the placed materials sit against their tier band

| Material | Tier | Band | Found in | |
|---|---|---|---|---|
| Iron | 1 | 1-15 | Pearl Salt Mines 6-9, Forlorn Basin 11-19 | ok |
| Silver | 2 | 10-35 | Forlorn Basin 11-19, Volcanis Grotto 39-43 | ok, Volcanis a little over |
| Bleu | 3 | 25-50 | Forlorn Basin v2 30-32 | ok |
| Sandwraith | 4 | 45-75 | Fallen Kingdom 49-55 | ok |
| Engle | 5 | 60-100 | Negative Peaks and its caves 61-65 | ok |
| Oak | 1 | 1-15 | Raevula 3-8, Crossroads | ok |
| Dreamwood | 2 | 10-35 | Forest of Dreams 10-12 | ok |
| Negapine | 3 | 25-50 | **Frozen Fortress 23-25**, Negative Peaks 61-65 | fixed — see below |
| Grimwood | 4 | 45-75 | Fallen Kingdom courtyard 49-55 | ok |

**The Fallen Kingdom courtyard is now a double node.** Its 77 grimwood snags are interleaved with the
82 grass carrying the **Smoke (Void)** affix, so the same square of ruins yields both tier-4 wood and
nutmeg. It also happens to be botanically right: grass colonises where a canopy has opened up, so a
dead stand with grass beneath it is what a died-back woodland actually looks like.

**Negapine was the one real mismatch, and the fix is diegetic.** It is a tier-3 wood named for the
mountain range it grows on, but that range sits at level 61-65 — so a t3 wooden weapon was unbuildable
until two-thirds through the game, while t1 and t2 arrive in chapter one.

The answer is **`Map116 — Frozen Fortress`, on Lakeside Road at level 23-25**. That map is the summit
castle, *physically displaced down from the Negative Peaks* by the pause. A stand of negapines around
it is not a concession to game balance — **the castle brought its forest with it.** The trees explain
themselves, the name stays honest, and the tier-3 gate opens where the band says it should.

The natural range on the Peaks stays exactly as it is; it simply stops being the only source. This is
the shape to reach for whenever a material's tier and its flavour disagree: **find the place where the
fiction already justifies an exception**, rather than either moving the material somewhere arbitrary or
leaving the gate broken.

### Still unplaced, and why

Every material whose band falls inside built content is now placed. The remaining five all sit at
tier 5 and above, and their proposed homes are all **chapter 4 and 5 maps that do not exist yet.**

| Material | Tier | Band | Proposed home |
|---|---|---|---|
| Subwood | 5 | 60-100 | The Subterranean 95-110 |
| Deepe | 6 | 90-130 | The Subterranean 95-110 |
| Heartwood | 6 | 90-130 | Nimbus 85-100 |
| Digiwood | legendary | 125+ | Frozen Fortress 115-130 |
| Ultanium | legendary | 125+ | Frozen Fortress 115-130 |

This is the same shape as the tier 4-5 monster materials: **the gap is not authoring, it is that the
back half of the level ladder has no maps.** See [`../maps/progression-bands.md`](../maps/progression-bands.md)
— built content covers levels 1-70, and everything above that is planned rather than built.

**Five stale enemy ids surfaced during that sweep and were corrected**, all of them events left
pointing at ids that used to hold something else before the database was reorganised: four Academy
"ghostie" events and one oasis dummy were on tree ids, three Bellows lava traps were on Negapine, and
"maxotaur" was on the silver vein. **Expect more of these** wherever an event's graphic and its
`<enemyId>` disagree about what the thing is — the graphic is usually the truthful one.

## Open

- **Minty Herbs wants renaming** to something that reads liquid-elemental — Dewy, Briny, Tidal.
- **Whether every grass drops every greens rung**, or the greens ladder is itself banded by where the
  grass is.
**Crop and fruit nodes never take a variant parenthetical.** `*Tomato Vine` is the whole name and it drops
tomatoes. The parenthetical exists on grass, wood and ore because those genuinely have variants —
`*Vein (Silver)` versus `*Vein (Iron)` yield different ore. A tomato plant is a tomato plant wherever
it grows, so a regional copy would be a second row saying the same thing.
