# Drop sources — what every creature and destructible yields

> **Status: draft proposal, 2026-08-24.** The single answer to a question that had none: *which kinds
> of thing in the world leave behind which materials and which ingredients.* It stops deliberately
> short of naming individual enemies, rungs, drop rates or map locations — that is the next pass.
>
> **Two classes of claim live here and they must never be blurred.** Rows in **bold** are **existing** —
> read out of the `<drops:[a|i,ID,CHANCE]>` tags already in `Enemies.json`, so they are facts about the
> shipped database. Everything in plain text is **proposed** and is Jeremy's to accept, reject or
> rewrite.
>
> **Related:** [`../food/ingredient-sorting.md`](../food/ingredient-sorting.md) is the authority on
> *how* an ingredient family is acquired; [`../crafting/material-tools.md`](../crafting/material-tools.md)
> on which tool works which material; [`../maps/progression-bands.md`](../maps/progression-bands.md) on
> where everything lives and at what level.

---

## The organizing principle: does it fight back

Everything that yields anything in this game is one of two things, and the split does more work than
any lane or family taxonomy.

| | Ids | What it is | What it yields |
|---|---|---|---|
| **Destructibles** | `Enemies.json` **1-100** | A plant, a deposit, a container — a thing rather than a creature | Everything that grows or is quarried: greens, herbs, petals, coral, seeds, berries, fruit, lumber, ore, gems, stone |
| **Combat enemies** | `Enemies.json` **101-600** | Actual creatures | Everything that was part of an animal: eggs, meat, offal, gel, fish, milk, jelly — plus all 46 monster material blocks |

**The split is fiction, not mechanism.** Everything in JABS is an enemy you swing at, so a grapevine on
a farm plot and a bramble on a roadside are the same event with different scenery — and
`ingredient-sorting.md`'s `drop` versus `farm` tags describe *where a node lives*, not how it is
harvested. There is no separate farming system to build, and there does not need to be one.

A destructible is still a JABS enemy and still carries `<drops>`; it simply cannot be reasoned about
as a creature. **The test for a candidate yield is whether there is something to swing at.** That is
the reason water is *not* a harvest node — a pond has no strike surface, so water comes out of
creatures that are full of it and out of the shop, never out of the ground.

---

# Part 1 — Destructibles

## The id grammar of block 1-100

Groups of ten, same as everywhere else in this database. Nothing declares this; it is read off the
data.

Two entries in this block are **not** harvest nodes and must never be given a yield: `*Crumbly Wall`
(id 41) is a one-time story wall the player breaks to proceed, and the `@` groups are gimmicks and
training dummies. Being in the range does not make something farmable.

| Ids | Family | Members today | Free |
|---|---|---|---|
| 1-10 | `*Grass` | Erocian lv3, Dream lv8, Puff (Earthen) lv20, Grotto lv35, Airy lv55 | 6-10 |
| 11-20 | `*Shrub` / `*Tree` | Oak lv10, Dreamwood lv20, Negapine lv60 | 14-20 |
| 21-30 | `*Deposit` | Iron lv10, Silver lv15, Bleu lv25, Sandwraith lv45, Bluesilver lv60 | 26-30 |
| 31-40 | `@` gimmicks | Spire, Suspicious Crack, Durable Post, Torch | 35-40 |
| 41-50 | destructibles | Crumbly Wall, Crate (Mines) | 43-50 |
| 51-60 | `@` dummies | Regen, Aggro, Passive | 54-60 |
| **61-100** | — | **nothing at all** | **four full groups** |

## The Deposit ladder is the worked example for this whole document

`*Deposit` already does exactly what the drop grid is supposed to do, and nobody wrote it down:

| Node | Level | Stone rungs | Ore |
|---|---|---|---|
| **Iron** | 10 | `a401`, `a402` | Iron, a little Silver |
| **Silver** | 15 | `a401`, `a402` | Iron, Silver |
| **Bleu** | 25 | `a402`, `a403` | Iron, Silver, Bleu |
| **Sandwraith** | 45 | `a403`, `a404` | Silver, Sandwraith |
| **Bluesilver** | 60 | `a403`, `a404` | Silver, Bleu |

**One material block, five nodes, rungs climbing with the level band.** That is the model in miniature,
already shipped. Every gem is on every node at a flat 5%, which is a separate decision and reads as
deliberate: gems are the lottery, ore is the yield.

## Existing families and what they carry

| Family | Yields | Status |
|---|---|---|
| `*Grass` | **greens** `i281-284`, **herbs** `i416-418` | live |
| `*Shrub` / `*Tree` | **lumber** — Oak `i45`, Dreamwood `i47`, Negapine `i49` — plus `511 plank` | live |
| `*Deposit` | **ore** `i30-36`, **gems** `i60-70`, **stone block 401** | live |
| `*Crate (Mines)` | **stone**, **ore**, **gems** — a mixed container, not a family | live |

## The node roster

**Moved.** The full roster of harvest nodes — what each one is, what it drops, the elemental grass
affixes, and which biome each lives in — is now [`harvest-nodes.md`](harvest-nodes.md). This file keeps
the *creature* half: material blocks and the ingredient families that come off animals.


---

# Part 2 — Combat enemies and the ingredient families

## What actually needs a home

`ingredient-sorting.md` already tags every family with `shop` / `drop` / `farm` / `cook`, so the list
of families needing an enemy is not a judgement call — it is a filter. Families marked only `farm`,
`cook` or `shop` are deliberately not drops and appear nowhere below.

After the destructible split, these are the `drop` families that belong on creatures:

| Family | Items | Subgroups |
|---|---|---|
| `protein+egg` | `i201-204` Avian, Bug, Froggo, Ghosty Eggs | beast-beaker, insect-brood, aquatic-frog, undead-ghosty |
| `protein+meat+tail` | `i206-208` Lanky, Beefy, Dargin Tail | beast-rat, beast-quadruped, reptile-dargin |
| `protein+meat+flank` | `i211-213` Ripped, Bearcat, Giga Flank | beast-bearcat, humanoid-minotaur, beast-quadruped |
| `protein+meat+ribs` | `i216-218` Boney, Lamia, Ouroboros Ribs | reptile-lamia, reptile-snake, undead-skeleton |
| `protein+meat+wing` | `i221-223` Flappy, Double, Iridescent Wing | beast-bat, beast-beaker, insect-brood, reptile-dargin |
| `protein+offal+eyeball` | `i226-228` Detached, Snooping, Peerless Eyeball | humanoid-cyclops, aquatic-cephalopod, undead-wisp |
| `protein+offal+blood` | `i231-233` Dried, Virgin, Blue Blood | humanoid-orc, humanoid-bandit, undead-reborn, deity-devil |
| `protein+offal+heart` | `i236-238` Beast, Hydro, Titan Heart | beast-bearcat, aquatic-kappa, construct-titan, reptile-dargin |
| `protein+gel` | `i241-244` Droopy, Big, Oversized, Colossus Gelatin | slime-puddle, slime-jelly, slime-cube |
| `protein+fish` | `i246-249` Smelly, Fresh, Sparkling, Pristine Fish | aquatic-fish |
| `vegetable+vine` | `i261-264` Wolftrap, Subtrap, Voidtrap, Doomtrap Vine | plant-trap |
| `sweet+jelly` | `i396-399` Leftover, Slimy, Putrid, Archaic Slime | slime-jelly, slime-roper, slime-aerial |
| `dairy+milk` | `i372-374` Moo, Bug, Dragon Juice | humanoid-minotaur, insect-brood, reptile-dargin |
| `liquid` | `i421-424` Water and its refinements | aquatic-kappa, aquatic-frog, slime-puddle |

**The item names already did most of this work.** Bearcat Flank, Lamia Ribs, Dargin Tail, Froggo Eggs,
Ghosty Eggs, Moo Juice, Bug Juice, Dragon Juice, Wolftrap Vine — the mapping was authored years ago in
the names and never written down as a table. Where a name names its creature, that assignment is not a
proposal at all; it is transcription.

## The three notes worth keeping

**Dairy needs no new creature.** `dairy+milk` is `drop`, not `shop`, and its three rungs are Moo Juice,
Bug Juice and Dragon Juice. Bugs and dargins exist. And `humanoid-minotaur` — implemented, Minitaur
lv10 in the Pearl Salt Mines and Megataur lv25 on the Outer Cliffs and Lakeside Road — is a bovine
standing in an early band waiting to be milked. That is funnier and cheaper than authoring a cow.

**Fish has a subgroup and no members.** `aquatic-fish` is one of nine subgroups with zero implemented
enemies. Fish is a four-rung `drop` family. The Seashell Shores at 80-95 is the natural home for the
upper rungs, and something has to swim in the early water for the lower ones.

**Birds are one creature deep.** `beast-beaker`'s only implemented member is Garuda, a level-70 unique.
Avian Eggs, Flappy Wing and Feather all want a bird that is not a boss.

---

# Part 3 — Monster materials

The material half. `Armors.json` rows 301-535, 47 contiguous blocks of five, each block one parameter
escalating across its rungs. The block's identity here is its `<ingredientType:X>` tag, not its
parameter, because that is the word the game uses and the word a creature can be said to yield.

**46 blocks are assignable.** Block 471-475 (`=== TBD lp34`) is a deliberate reserved gap for a
parameter Jeremy has not defined; it gets no creature and must not be named.

## The rule this follows

From the drops decision of 2026-08-07: **material groups are a vocabulary, not an allocation.** A
subgroup yields whatever it *plausibly yields*, existing blocks get reused freely, and overlap is the
system working rather than drift to correct. Scales are dropped by ten subgroups across three families
today, and that is right.

"Plausibly yields" is wider than "is made of." A construct remembers, so it yields a memory. Undead
carry syringes. Flying insects bottle their own glow. A treant is conveniently pre-planked. Nothing
here needs a separate rule for the blocks that are objects rather than anatomy.

**Counts are deliberately uneven.** A subgroup with two materials is not underserved and a block with
one home is not underspecified. No symmetry was forced anywhere in this table.

## Subgroup to material block

`Enemies.json` runs `id = 101 + (family * 50) + (subgroup * 10)` — ten families of five subgroups of
ten. Names come from `config.sdp.json`'s `mastery.subgroupKey`; forty-nine names cover the fifty slots
because Deity 4 and Deity 5 (the Sins and their Shades) deliberately share one.

### Undead — ids 101-150

| Subgroup | Materials |
|---|---|
| `undead-ghosty` | **306 powder**, **396 veil**, 506 urn, 521 dust |
| `undead-reborn` | **306 powder**, **396 veil**, 476 syringe, 416 liquids |
| `undead-wisp` | **366 core**, **396 veil**, 491 jar |
| `undead-skeleton` | **356 fangs**, **421 bone**, 516 skull, 446 tooth, 441 fossil |
| `undead-armor` | **306 powder**, **396 veil**, 436 plate, 466 rune |

Urns and dust go to the ghosts because both are grave goods rather than body parts — an urn is what a
haunting is *attached to*. The syringe lands on `reborn` specifically: something reanimated it, and the
needle is the evidence. Plate on `undead-armor` is the animate suit shedding its own pieces, and it is
the block already declared to feed `a-feet-medium` sabatons.

### Reptile — ids 151-200

| Subgroup | Materials |
|---|---|
| `reptile-snake` | **326 tongue**, **331 scales**, **356 fangs** |
| `reptile-dargin` | **331 scales**, 351 wings, 356 fangs, 361 talon |
| `reptile-draconite` | **331 scales**, 316 horn, 446 tooth, 441 fossil, 516 skull |
| `reptile-lamia` | **331 scales**, 326 tongue, 396 veil |
| `reptile-salamander` | 331 scales, 381 liver, 336 toe |

Dargin is Jeremy's worked example — fangs, wings, scales, and a heart. The first three are blocks and
are assigned here. **The heart is not a material at all**: `protein+offal+heart` is an existing
*ingredient* family, `i236-238`, and a Dargin Heart is a fourth rung on it. No 48th block is needed.

### Aquatic — ids 201-250

| Subgroup | Materials |
|---|---|
| `aquatic-kappa` | **331 scales**, 451 seashell, 406 saline, 431 caviar |
| `aquatic-frog` | **331 scales**, 336 toe, 406 saline, 381 liver |
| `aquatic-crab` | **376 spines**, **401 stone**, 451 seashell, 441 fossil, 426 mineral |
| `aquatic-fish` | 431 caviar, 406 saline, 331 scales |
| `aquatic-cephalopod` | 416 liquids, 406 saline, 451 seashell, 431 caviar |

The kappa's shell is the whole point of a kappa. "Spinny Fossil" reads as an ammonite, which is why the
crab carries fossil. Cephalopod gets liquids because ink is the obvious answer and nothing else in the
roster produces it.

**Caviar is not fish-only.** Roe comes off whatever *eats* fish as readily as off the fish — a kappa is
a river predator, a cephalopod hunts, and a shore bird fishes. Restricting a block to the animal it is
named after is exactly the narrowing the 2026-08-07 rule warns against.

### Slime — ids 251-300

| Subgroup | Materials |
|---|---|
| `slime-puddle` | 416 liquids, 481 aid |
| `slime-roper` | 416 liquids, 531 stick |
| `slime-jelly` | **396 veil**, 416 liquids, 481 aid |
| `slime-aerial` | **386 pelt**, 351 wings, 491 jar |
| `slime-cube` | 301 coremata, 426 mineral, 416 liquids |

**`311 crumbles` does not belong here, and the reason is worth recording.** The puddle slimes are all
desserts — Hard Syrup, Wet Mousse, Sandy Pudding, Radiant Flan, Blinking Custard, Molten Souffle,
Umbral Molasses, Crystalline Candy, Majestic Meringue — so "Hot Crumbles to Critical Crumbles" looked
like it belonged on the dessert menu. It does not: **a slime is wet and cohesive, and a crumble is dry
and falling apart.** Matching the menu while ignoring the texture is a category error. Materials are
assigned by what a thing physically *is*, and a name that rhymes with the theme is not evidence.

### Plant — ids 301-350

| Subgroup | Materials |
|---|---|
| `plant-trap` | **371 branch**, 526 leaf, 341 clover |
| `plant-fungus` | **321 root**, **371 branch**, 306 powder, 311 crumbles |
| `plant-dryad` | 526 leaf, 321 root, 531 stick |
| `plant-flower` | 341 clover, 526 leaf, 306 powder |
| `plant-treant` | 511 plank, 371 branch, 531 stick, 321 root |

Powder goes to fungus and flower for the same reason from two directions: spores and pollen are the
same object with different manners.

**Plank is not the treant's alone.** An actual tree is the more obvious source of a plank than an
animate one, so `*Shrub` / `*Tree` and `*Orchard` carry it as well. The treant is the version that
fights back, not the only version that exists.

### Beast — ids 351-400

| Subgroup | Materials |
|---|---|
| `beast-bearcat` | **361 talon**, **386 pelt**, 446 tooth, 381 liver, 516 skull |
| `beast-bat` | **356 fangs**, **386 pelt**, 351 wings, 391 ear, 456 feather |
| `beast-beaker` | 456 feather, 361 talon, 351 wings, 431 caviar |
| `beast-rat` | **356 fangs**, **386 pelt**, 336 toe, 446 tooth, 516 skull |
| `beast-quadruped` | 386 pelt, 336 toe, 381 liver, 316 horn, 516 skull |

Ear on the bat is not filler — the block's rungs escalate a hearing-flavoured parameter and a bat is
the animal whose ears are the interesting part.

**Feather belongs to feathered wings, not to birds.** A leathery wing is a `351 wings` drop and a
feathered one is both.

**`beast-bat` is misnamed by its SDP key — the subgroup is `Winger`.** Its unbuilt rows are literally
`=== TBD Winger` (365-370), and it already holds a non-bat: Redeye uses the Timebomb battler, not the
Bat one. So the subgroup is *anything that flies*, and a feathered flyer belongs here as naturally as a
skin-flapped one. `beast-beaker` — `=== TBD Beaks` — is the separate bird line.

### Insect — ids 401-450

| Subgroup | Materials |
|---|---|
| `insect-needler` | **346 stinger**, 461 acupuncture, 351 wings |
| `insect-crawler` | **331 scales**, **356 fangs**, **376 spines** |
| `insect-brood` | **331 scales**, **376 spines**, 491 jar, 351 wings |
| `insect-scorpion` | **331 scales**, **376 spines**, 346 stinger, 361 talon |
| `insect-parasite` | **331 scales**, **376 spines**, 476 syringe, 381 liver |

Acupuncture on `insect-needler` is the closest thing to a free win in the table — the family is named
for needles and the block is a set of needles that improves proficiency. Talon on the scorpion means
pincers.

### Humanoid — ids 451-500

| Subgroup | Materials |
|---|---|
| `humanoid-minotaur` | **316 horn**, 386 pelt, 336 toe, 516 skull |
| `humanoid-orc` | **391 ear**, **421 bone**, 446 tooth, 381 liver, 516 skull |
| `humanoid-bandit` | **391 ear**, **421 bone**, 411 pills, 506 urn, 516 skull |
| `humanoid-cyclops` | **391 ear**, **421 bone**, 446 tooth, 401 stone, 516 skull |
| `humanoid-kobold` | **391 ear**, **421 bone**, 411 pills, 531 stick, 516 skull |

Pills are contraband, which is what a bandit has and a kobold tinkers with. Urn on the bandit is loot
he was carrying rather than anything he is made of — the same logic that puts a syringe on the undead.

A hoof is a toe — ungulates walk on their toenails — so `336 toe` is the minotaur's feet, not a
stretch. Nothing needed a hoof block.

### Construct — ids 501-550

| Subgroup | Materials |
|---|---|
| `construct-titan` | 426 mineral, 401 stone, 496 radiator, 311 crumbles |
| `construct-hazard` | **366 core**, 486 cell, 521 dust, 491 jar |
| `construct-bot` | 501 memory, 486 cell, 436 plate, 496 radiator |
| `construct-puppet` | 501 memory, 511 plank, 531 stick |
| `construct-orb` | 301 coremata, 466 rune, 366 core |

Memory is Jeremy's call — a machine remembers. It sits on both `bot` and `puppet` because a puppet is
the homunculus-shaped slot in this family and a borrowed memory is the more unsettling read. Cell and
Radiator were built on 2026-08-22 specifically to feed the Taser and Arm weapon subgroups, so they are
homed on the constructs credibly carrying that hardware.

**Rune on `construct-orb` has a receipt.** The subgroup's first and only implemented member is
`Runic Orb` (541). The block was the weakest guess in the first draft and turns out to have been
answered years ago by a name nobody had cross-referenced.

### Deity — ids 551-600

| Subgroup | Materials |
|---|---|
| `deity-elemental` | 366 core, 301 coremata, 466 rune, 456 feather |
| `deity-emotion` | 521 dust, 396 veil, 481 aid |
| `deity-devil` | 316 horn, 516 skull, 466 rune, 456 feather |
| `deity-sin` (Sins, 581-590) | 396 veil, 521 dust, 506 urn |
| `deity-sin` (Shades, 591-600) | **361 talon**, **386 pelt**, **396 veil** |

The Shades already drop talon and pelt because the two implemented ones are the Gluttonwolf and the
Vampire Shade, which are beasts wearing a Deity id. That is the sole reason those rows are bold, and it
is not evidence that the Deity family is beast-flavoured.

## Block to subgroup — the coverage proof

The inverted view. Its only job is to prove every assignable block has somewhere to come from.

| Block | Type | Subgroups |
|---|---|---|
| 301 | coremata | slime-cube, construct-orb, deity-elemental |
| 306 | powder | **undead-ghosty**, **undead-reborn**, **undead-armor**, plant-fungus, plant-flower |
| 311 | crumbles | construct-titan, plant-fungus |
| 316 | horn | **humanoid-minotaur**, reptile-draconite, beast-quadruped, deity-devil |
| 321 | root | **plant-fungus**, plant-dryad, plant-treant |
| 326 | tongue | **reptile-snake**, reptile-lamia |
| 331 | scales | **reptile-snake**, **reptile-dargin**, **reptile-draconite**, **reptile-lamia**, **aquatic-kappa**, **aquatic-frog**, **insect-crawler**, **insect-brood**, **insect-scorpion**, **insect-parasite**, reptile-salamander, aquatic-fish |
| 336 | toe | aquatic-frog, beast-rat, beast-quadruped, humanoid-minotaur, reptile-salamander |
| 341 | clover | plant-flower, plant-trap |
| 346 | stinger | **insect-needler**, insect-scorpion |
| 351 | wings | reptile-dargin, slime-aerial, beast-bat, beast-beaker, insect-needler, insect-brood |
| 356 | fangs | **undead-skeleton**, **reptile-snake**, **beast-bat**, **beast-rat**, **insect-crawler**, reptile-dargin |
| 361 | talon | **beast-bearcat**, **deity-sin**, reptile-dargin, beast-beaker, insect-scorpion |
| 366 | core | **undead-wisp**, **construct-hazard**, construct-orb, deity-elemental |
| 371 | branch | **plant-trap**, **plant-fungus**, plant-treant |
| 376 | spines | **aquatic-crab**, **insect-crawler**, **insect-brood**, **insect-scorpion**, **insect-parasite** |
| 381 | liver | reptile-salamander, aquatic-frog, beast-bearcat, beast-quadruped, insect-parasite, humanoid-orc |
| 386 | pelt | **slime-aerial**, **beast-bearcat**, **beast-bat**, **beast-rat**, **deity-sin**, beast-quadruped, humanoid-minotaur |
| 391 | ear | **humanoid-orc**, **humanoid-bandit**, **humanoid-cyclops**, **humanoid-kobold**, beast-bat |
| 396 | veil | **undead-ghosty**, **undead-reborn**, **undead-wisp**, **undead-armor**, **slime-jelly**, **deity-sin**, reptile-lamia, deity-emotion |
| 401 | stone | **aquatic-crab**, **\*Deposit**, **\*Crate**, **@Spire**, construct-titan, humanoid-cyclops |
| 406 | saline | aquatic-kappa, aquatic-frog, aquatic-fish, aquatic-cephalopod |
| 411 | pills | humanoid-bandit, humanoid-kobold |
| 416 | liquids | undead-reborn, slime-puddle, slime-roper, slime-jelly, slime-cube, aquatic-cephalopod |
| 421 | bone | **undead-skeleton**, **humanoid-orc**, **humanoid-bandit**, **humanoid-cyclops**, **humanoid-kobold** |
| 426 | mineral | aquatic-crab, slime-cube, construct-titan |
| 431 | caviar | aquatic-fish, aquatic-kappa, aquatic-cephalopod, beast-beaker |
| 436 | plate | undead-armor, construct-bot |
| 441 | fossil | undead-skeleton, reptile-draconite, aquatic-crab |
| 446 | tooth | undead-skeleton, reptile-draconite, beast-bearcat, beast-rat, humanoid-orc, humanoid-cyclops |
| 451 | seashell | aquatic-kappa, aquatic-crab, aquatic-cephalopod |
| 456 | feather | beast-bat *(Winger)*, beast-beaker, deity-devil, deity-elemental |
| 461 | acupuncture | insect-needler |
| 466 | rune | undead-armor, construct-orb, deity-elemental, deity-devil |
| 471 | *(reserved)* | **none — do not assign** |
| 476 | syringe | undead-reborn, insect-parasite |
| 481 | aid | slime-puddle, slime-jelly, deity-emotion |
| 486 | cell | construct-hazard, construct-bot |
| 491 | jar | insect-brood, undead-wisp, slime-aerial, construct-hazard |
| 496 | radiator | construct-titan, construct-bot |
| 501 | memory | construct-bot, construct-puppet |
| 506 | urn | undead-ghosty, humanoid-bandit, deity-sin |
| 511 | plank | plant-treant, construct-puppet, `*Shrub`/`*Tree`, `*Orchard` |
| 516 | skull | undead-skeleton, deity-devil, reptile-draconite, beast-bearcat, beast-rat, beast-quadruped, humanoid-minotaur, humanoid-orc, humanoid-bandit, humanoid-cyclops, humanoid-kobold — *anything with a head* |
| 521 | dust | undead-ghosty, construct-hazard, deity-emotion, deity-sin |
| 526 | leaf | plant-trap, plant-dryad, plant-flower |
| 531 | stick | plant-dryad, plant-treant, slime-roper, humanoid-kobold, construct-puppet |

**All 46 assignable blocks have at least one home.** Sixteen already had one in the database; thirty are
proposed here for the first time.

`461 acupuncture` is the only single-home block left, and it is single-home because a set of needles
comes off the subgroup named for needles and nowhere else. That is a finished answer, not a gap.
**Every other narrow block widened on review**, which is the 2026-08-07 rule asserting itself: caviar
belongs to fish *and their predators*, feather to feathered wings rather than to birds, plank to actual
trees as much as to the tree that fights back, and `516 skull` to more or less anything with a head.
The instinct to file a material under the one creature it is named after is the failure mode to watch
for.

---

# Part 4 — Availability and placement

Given the mapping above and the enemies actually placed on maps today, **the earliest point a player
can hold every material group is the Volcanis Grotto — band 15, levels 39-43.**

## The availability curve

| By the end of | Blocks available |
|---|---|
| Band 1 · Intro Cave | 9 |
| Band 2 · Crossroads | 26 |
| Band 4 · Academy | 36 |
| Band 5 · Pearlsalt Ground | 38 |
| Band 8 · Forlorn Basin v1 | 39 — `376 spines`, via Crawler |
| Band 9 · Outer Cliffs | 40 — `441 fossil`, via Skeletor |
| Band 15 · Volcanis Grotto | 43 — `426 mineral` via Crimson Vice, `496 radiator` via Heated Titan |

**Thirty-eight of forty-six arrive in the first five bands, and the remaining five take ten more
bands.** Twenty-six of them arrive at the Crossroads alone, off four creatures. This mirrors the
front-loading already recorded in [`../maps/progression-bands.md`](../maps/progression-bands.md) —
levels 6-17 span roughly eighty-four maps — but it also means the back half of chapters 2 and 3
introduces almost no new material vocabulary. Whether that is a problem depends on whether *rungs*
keep climbing while blocks stay flat, which is the next pass's question.

Boss-only sources are excluded from these figures. A one-time unique cannot be a material source in
any useful sense, and counting Aqualock as the supplier of a block is how a block ends up looking
solved when it is not.

## The three blocks with no repeatable source

| Block | Only assigned to | Status |
|---|---|---|
| `301 coremata` (MHP) | slime-cube, construct-orb, deity-elemental | orb is placeable; cube is unauthored; elementals are all bosses |
| `456 feather` | beast-bat, beast-beaker, deity-devil, deity-elemental | **no ordinary feathered flyer exists** |
| `501 memory` | construct-bot, construct-puppet | both authored, neither placed |

**An empty slot is headroom, not backlog.** A subgroup holds ten ids, but ten is deliberate room to
grow rather than a target — most will settle well short of it, the same reasoning as the SDP tier
capacity. So neither the nine subgroups with no members nor the partly-filled ones should be read as
work outstanding; the id space is larger than the roster is ever meant to be.

**Most of this is a map job, not an authoring job.** `Bot` (521), `Puppet` (531) and `Runic Orb` (541)
all exist in `Enemies.json` with stats, families and levels — they appear on **zero maps**. Placing
them closes `501 memory` outright and gives `301 coremata` a repeatable home.

## Placements

Decided 2026-08-25. Levels are the enemies' database levels; a map event page's own `<level:N>`
overrides the database, so a mismatch is a cost rather than a blocker.

| Enemy | Level | Placement | Band fit |
|---|---|---|---|
| **Puppet** (531) | 12 | **Forest of Dreams** — the cabin at the end | 10-12. Exact. No override needed |
| **Bot** (521) | 14 | Forest of Dreams, or Forlorn Basin v1 | 8-17 / 11-19. Fits either natively |
| **Runic Orb** (541) | 9 | **open** — see below | — |
| **Pegasus** (571) | 15 | open — Forest of Dreams fits natively | 8-17 |

### The Runic Orb question

The orb was proposed for the **Fallen Kingdom**, which reads well — a ruined castle full of animate
runic spheres is a good image. But the orb is **level 9** and the Fallen Kingdom bands at 49-55, so
that placement needs a forty-level override on the event page.

The competing consideration is not thematic. **The orb is the only placeable source of
`301 coremata`, and coremata is the MHP block** — the first of the three resource pools and about as
fundamental as a refinement material gets. Gating it to band 16 means a player spends fifteen bands
unable to refine maximum HP at all. Its native level 9 fits the **Pearl Salt Mines** exactly.

Both are legitimate; they are answering different questions. Fallen Kingdom is the better *scene*,
Pearlsalt is the better *economy*.

## The two things placement cannot fix

**Slime cubes do not exist.** All ten rows of `slime-cube` (291-300) are `=== TBD Cube`. The subgroup
is entirely unauthored, so cubes cannot be placed anywhere until they are written. Until then
`301 coremata` rests on the Runic Orb alone.

**There is no ordinary feathered flyer.** The only feathered creatures in the database are **Garuda**
(level 70, unique) and **Pegasus** (level 15, and a *deity*), so feather is currently supplied only by
a boss or by a god — neither of which is something a player farms. This is an authoring gap rather
than a placement one, and it is unusually cheap to close: **one common feathered flyer** would supply
`456 feather`, `351 wings`, the `protein+egg` family's Avian Eggs and the `protein+meat+wing` family's
Flappy Wing — four holes, one creature.

**The slots are already waiting**: `beast-bat` has six unbuilt rows (365-370) and `beast-beaker` nine
(372-380). Either is a legitimate home — Winger covers anything that flies, Beaks is the literal bird
line.

**Do not read anything into a placeholder's stats.** An unbuilt row is a duplicate of the last real
row in its subgroup — `=== TBD Winger` carries Cave Bat's level 6 and Bat battler, `=== TBD Beaks`
carries Garuda's level 70 and Garuda battler — because that is what copying a row does, not because
anyone chose a band for the slot. **The placeholder *name* is the only real signal an unbuilt row
carries.** Its level, battler and traits are copy artifacts and mean nothing.

---

## Coverage as it stands

| Layer | Total | Has a source today |
|---|---|---|
| Monster material blocks | 46 assignable | 16 |
| Tagged ingredients | 303 | 70 |

By lane, ingredients with a live drop source: protein 26/33, vegetable 11/52, elemental 10/18, metal
6/14, gem 6/12, lumber 3/14, sweet 2/18, **dairy 1/20**, and **zero** for carb, fruit, textile, liquid,
crunch, electronic, oil and spice. Several of those zeros are correct — Roll, Croissant, Cheddar and
Brie are `cook` outputs and were never meant to drop. Fruit's zero is the real one, and `*Orchard`
closes it.

## A warning about a neighbouring document

[`../food/ingredient-roster.md`](../food/ingredient-roster.md) is dated 2026-08-05 and its item
references are **stale**. It refers to food as armor ids — `a321` Dead Greens, `a401` Big Gelatin —
and those ids now hold monster materials: `Armors[321]` is Tough Root and `Armors[401]` is Worn Stone.
The food migrated to `Items.json` (Leafy Greens is `i281`, the gelatin line is `i241-244`). Its lane
reasoning is still useful; its ids point at the wrong rows and its "clean migrate / contested" verdicts
describe a migration that already happened.

## What this pass deliberately does not decide

- **Which individual enemy or node drops what**, and at what rate. Nine combat subgroups have zero
  implemented members and exist here purely as reservations — and that is fine: a subgroup can be
  built and placed when the area that needs it is built. Fish on the beach, a milk-giver in the
  Deluge Plains.
- **Which rung comes from where.** Rungs track the level curve, and built content stops at level 70
  while the ladder runs to 150 — so tiers 4 and 5 will land overwhelmingly on the planned bands in
  [`../maps/progression-bands.md`](../maps/progression-bands.md), not on anything shipped.
- **Whether a subgroup's yields split into signature and incidental.** A creature carrying six drop
  lines risks having no drop that feels like *its* drop; whether that matters is unresolved.
- **Whether the fruit families become `farm` *and* `drop`** in `ingredient-sorting.md`.
- **Where the Runic Orb goes** — Fallen Kingdom as a scene, or the Pearl Salt Mines as an economy.
- **Whether the flat back half matters.** Blocks stop arriving after band 5 and the last five trickle
  in over ten bands. If rungs climb steadily through that stretch the shape is fine; if they do not,
  chapters 2 and 3 have a long middle with nothing new to collect.
