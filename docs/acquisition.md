# Named equipment acquisition — weapons and armor

> **Purpose:** the single record of **where the three named weapons of each subgroup come from**, **how
> the blueprint for that subgroup's legendary is acquired**, and **how the 27 named armors are built**.
>
> The two chains are deliberately different mechanisms and are documented separately below. They meet
> again only at rung 10, where both consume a t6 craftable and use their ⭐⭐⭐ as a tool.
>
> Pair with [`weapons/families.md`](./weapons/families.md) (identity design) and
> [`weapons/skill-lots.md`](./weapons/skill-lots.md) (skill bands). This file owns *acquisition only* —
> not stats, not skills, not identity. It sits at the docs root rather than under `weapons/` because
> it stopped being about weapons on 2026-08-31.
>
> **Status:** started 2026-08-22. Supersedes `main.md`, whose *weapon names* were stale — four had
> been renamed in the database since it was written. Its **locations were accurate**, and are carried
> forward below, re-derived from the maps rather than copied.
>
> **Status update, 2026-08-27:** the weapon chain is **decided** — see [The weapon chain](#the-weapon-chain-decided-2026-08-27).
> Only the ⭐ rung is ever placed; ⭐⭐, ⭐⭐⭐ and the legendaries are all forged. **13 of 18 ⭐ weapons are
> live in the maps**; five remain.
>
> **Status update, 2026-08-31:** the **armor** chain is decided too — see
> [The armor chain](#the-armor-chain-decided-2026-08-31). It is a different mechanism on purpose, and it
> lands on the same rung-10 invariant the weapons already use.

---

## The shape

Every subgroup is ten weapon ids. The last four are what this doc covers.

| Rung | ids | How you get it |
|---|---|---|
| **1–6** craftable | `base+1` … `base+6` | Blueprints, ordinary crafting, ordinary materials |
| **⭐ named** | `base+7` | Found in the world |
| **⭐⭐ named** | `base+8` | Found in the world |
| **⭐⭐⭐ named** | `base+9` | Found in the world — a real myth weapon |
| **legendary** | `base+10` | **Crafted**, and only crafted |

`base = (wtypeId - 1) * 10`.

## The invariant that shapes everything

**Every legendary recipe consumes the tier-6 craftable and uses the ⭐⭐⭐ named weapon as a *tool*.**

```
w-sword-10 -> "The Corona"
     needs  1x w6  Lunar Vengeance      (consumed)
     tool      w9  "Claidheamh Soluis"  (required, not consumed)
```

This holds for all eighteen. Two consequences worth stating plainly:

1. **Finding the ⭐⭐⭐ is the real gate on the legendary.** The blueprint is the second lock, not the
   first. A player who never finds `Hrunting` can never forge `Gemini`, no matter what they own.
2. **The ⭐⭐⭐ is never spent.** It stays in inventory as a key. That means it can keep being a usable
   weapon, and a player is never punished for forging.

So ⭐⭐⭐ placement and blueprint acquisition are **two separate decisions** and both must land for a
legendary to be reachable. Neither is decided yet.

---

## The weapon chain `DECIDED 2026-08-27`

**Only the ⭐ rung is ever placed in the world. Everything above it is forged.**

| Rung | How | Unlocked by |
|---|---|---|
| **⭐ n1** | Found in the world, hand-placed | — |
| **⭐⭐ n2** | Forged, **consuming the ⭐** | Viktor's second quest teaches the enhancement |
| **⭐⭐⭐ n3** | Forged, **consuming the ⭐⭐** | Maxing Viktor's social link opens the n3 recipes |
| **legendary** | Forged from the t6 craftable, **⭐⭐⭐ as tool** | The rite, taught by the ghost of a dead master smith in the **Desolate Graves**, reachable only once the Viktor/Viskra line is maxed |

Recipes still cost scraps and materials at every rung. What the unlocks buy is the *right* to forge,
not the forging itself — the same shape the study shop already uses.

### Why the line consumes itself

**The sequence has to be forced.** A player must not be able to hold Claidheamh Soluis without having
carried Light Thrust and Sacred Spine first. Placement can never guarantee that — whatever you hide,
somebody finds it in the wrong order. Consumption guarantees it structurally: the n3 recipe cannot
run without the n2 in the bag, and the n2 cannot run without the n1.

It also reads better. The line is **one weapon growing**, not a collection accumulating. You are
never holding two rungs of the same family, and the sword you pulled out of the stone is the same
sword you finish the game with.

**The ⭐⭐⭐ is the exception and survives**, because it is the *tool* for the legendary rather than its
feedstock — the legendary consumes the t6 craftable instead. So the line eats itself upward until it
reaches the myth weapon, and that one is permanent. A player is never punished for forging.

### Why it routes through Viktor

`./unlockables/recipe-journals.md` already states the unlock doctrine, and states it as holding per
discipline: **found < taught < inherited. Loot < lessons < love.** Smithing's rungs are written there
as **scraps → Viktor → (an inherited tier)**. This chain is that doctrine applied to weapons rather
than a new idea: scraps buy n2, Viktor teaches n3, and the legendary comes from the inherited tier.

**The inherited tier is the ghost, not Viktor.** Viktor is already the *taught* rung, so having him
also hand over the legendary would collapse two tiers into one person. Knowledge from someone who is
gone is a stronger read of "inherited," and it gives the Desolate Graves the purpose `story-canon.md`
currently records as `OPEN`.

### Losing Viktor loses the ladder, and that is intended

`./quests/SE-raevula/smiths-apprentice.md` has a branch where **the Metal Petal closes forever and
Viktor exits the game entirely.** Under this chain that branch also costs the player every named
weapon above ⭐ and every legendary. **That is the accepted price of the decision** (Jeremy,
2026-08-27) — the tragedy is meant to have teeth, and no fallback path is provided.

### Materials come from outside weaponcrafting

Every rung above ⭐ demands high-tier materials **from disciplines other than weapon forging** —
armourcraft, alchemy, and cooking among them. Two reasons, and the second is the real one:

- Top-tier materials currently have **no sink at all**, and this gives them one.
- It breaks the closed loop. Most games gate the ultimate weapon behind ultimate *weapon* materials,
  so a weapon-focused player never leaves their own discipline. Requiring a dish to finish a sword is
  the premise of this game expressed as a mechanic rather than as a joke.

**The legendary's cross-discipline demand should be characteristic, not universal.** "One top-tier
item from every family" ×18 would give the most distinctive objects in the game the most generic
recipe. Ichor is the blood of gods and should want alchemy; Seismos shakes the ground and should want
heavy plate; Gemini is twins and should want two of something.

### What is still open

- **The five unplaced ⭐ weapons** — `"Blaster"` (Boomstick), `"Crescent Blossom"` (Glaive),
  `"Plate Peeler"` (Mace), `"Brought Down"` (Claws), `"Meta Arm"` (Arm). Their switches
  (`got-named-shotgun` 208, `got-named-2h-axe` 211, `got-named-doubleaxe` 212, `got-named-claw` 217,
  `got-named-arm` 218) are already reserved and waiting. Their homes were decided on 2026-10-25 (see
  [Where the named pieces are placed](#where-the-named-pieces-are-placed-decided-2026-10-25)); the chests
  themselves are not in the maps yet.
- **The exact material bills** at each rung.

### Where the materials come from

Any material requirement needs a drop source that can actually supply it. This was the blocker as of
2026-08-22 and **is now answered** — see
[`./enemies/drop-sources.md`](./enemies/drop-sources.md), which maps all 46 material blocks onto
enemy subgroups and harvest nodes.

---

## The armor chain `DECIDED 2026-08-31`

**A named armor has nobody inside it.** That is weapons-only lore and it does not transfer. A named
armor is simply **exceptional** — a cut above the rest of its class, roughly half a tier to a full tier
stronger, and carrying the class's identity without the class's usual cost. Straight-As armor. The
name is a distinction, not a haunting.

So armor needs no crafter's soul, no ghost, and no second Viktor. What it needs is a reason the player
cannot simply climb to it, and that reason is a **found, finite ingredient**.

### The mechanism

| Rung | How |
|---|---|
| **1-6** craftable | ordinary recipes, ordinary materials |
| **⭐ n1** | **crafted** — one salvage plus band-appropriate materials |
| **⭐⭐ n2** | crafted — another salvage, higher materials, **consuming the ⭐** |
| **⭐⭐⭐ n3** | crafted — another salvage, higher materials still, **consuming the ⭐⭐** |
| **10** legendary | the t6 craftable consumed, **⭐⭐⭐ as tool** — already recipe'd, all nine lines |

**Nothing named is ever found ready-made.** That is the clean inversion against weapons: a ⭐ weapon is
picked up because somebody already paid its price long ago, while every rung of armor is built, because
being *able* to build it is the entire gift Millie gives. She teaches once and gets out of the way —
she is not a relationship the player escalates through, and the chain deliberately does not route back
to her at each rung.

### The salvage

Three items, `Items.json` **95-97**, authored 2026-08-31 into the empty block between the fabric line
and the cooking tools:

| Id | Item | Feeds |
|---|---|---|
| `i95` | **Fractured Handgear** | relic · gauntlet · shield |
| `i96` | **Perforated Suit** | cloth · mail · armor |
| `i97` | **Dilapidated Footwear** | shoes · sabatons · greaves |

**They are deliberately generic, one per slot rather than one per line.** Nine specific wreck types
would let a player pull three ruined relics while maining shields and be stranded holding the wrong
corpses; three fungible ones can never block a build, and choosing which line to spend a salvage on is
a real decision instead of a lottery.

They are **priced at 0 and therefore unsellable**. One salvage gates one named armor, and a player who
sold one would break that line permanently without ever learning why.

The fiction is **salvage, not restoration** — you are stripping what is still good out of a ruin and
building around it, which is the carpenter's answer rather than the smith's. Reclaimed timber.

### The count

Three slots × three lines × three named rungs = **27 named armors, and 27 salvage pickups.**

| Slot | Lines |
|---|---|
| **Offhand** | relic · gauntlet · shield |
| **Body** | cloth · mail · armor |
| **Feet** | shoes · sabatons · greaves |

Salvage is **hand-placed in the world**, not dropped and not bought, so finishing a named armor means
having explored rather than having farmed — the same standard the ⭐ weapons already hold.

**Accessories are excluded.** `survive-extra` has 36 items, no named rungs under this scheme, and no
recipes authored at all. That is a deliberate gap rather than an oversight, and it stays open.

### Why the rungs land where they do

The material tier ladder in [`./enemies/harvest-nodes.md`](./enemies/harvest-nodes.md) already binds
a rung to a level band without anything new being tuned — t2 is 10-35, t4 is 45-75, t6 is 90-130. A
salvage plus t2 materials makes an ⭐; plus t4 an ⭐⭐; plus t6 an ⭐⭐⭐. Named armor therefore interleaves
against the craftable ladder exactly as named weapons do.

### The receipt that confirms this was right

All nine rung-10 armor recipes already exist and already follow the weapon invariant. `a-off-light-10`
outputs **Omni-Badge**, consumes **1x Pristine Artefact** (the t6 craftable), and requires
**`a9 Draupnir` — the ⭐⭐⭐ relic — as a tool.**

The database has been demanding a named armor that had no way to exist since before this chain was
designed. Rungs 7-9 were the only hole, and this fills it.

### What is still open for armor

- **The 27 recipes.** `config.crafting.json` carries rungs 1-6 and 10 for all nine lines; 7-9 are
  absent entirely.
- **The 27 salvage placements.** Their homes were decided on 2026-10-25 (see
  [Where the named pieces are placed](#where-the-named-pieces-are-placed-decided-2026-10-25)), mixing open
  dead ends with pockets behind tool gates; the chests themselves are not in the maps yet.
- **The exact material bills** at each rung.
- **Survival's inherited tier.** `./unlockables/recipe-journals.md` holds the doctrine — *found <
  taught < inherited* — and cooking, alchemy and smithing each have all three. Survival has pattern
  scraps and Millie, and nothing above her.

---

## Where the named pieces are placed `DECIDED 2026-10-25`

**Every named thing is reachable before chapter 3 ends** (Jeremy, 2026-10-25): "The world opens and you've
already theoretically got it all at 1-star at the very least." Chapter 4 never hides a ⭐ weapon or a
salvage, so after chapter 3 the only thing holding a line back is materials, never a missing piece. That
also brings the three salvage first pitched for the Crystalline Ravine's rope islands back into chapters
1-3.

The homes below came from walking every chapter 1-3 area the way `map-atlas` does, once with no tools and
once with each tool, and keeping the dead-end rooms and the ground only a tool opens. The tools set the
clock: the ukelele arrives around level 22 (Leo, `Map103`), bombs around 30 (Treis, `Map176`), and the Snake
Rope around 45 (`Map249`). A pocket in an early area pays out when the player comes back carrying the tool
that opens it.

### The five ⭐ weapons

| Weapon | Home | Opened by | Around level |
|---|---|---|---|
| `"Crescent Blossom"` (Glaive) | **Forest of Dreams** · Mad Hops `Map159`, the detour with no way back | nothing | 10-12 |
| `"Plate Peeler"` (Mace) | **Pearl Salt Mines** · Northern Caverns · Offshoot W `Map150`, among the maxotaur and orcs | ukelele | 22 on |
| `"Brought Down"` (Claws) | **Forlorn Basin** F4 · Passage - 8 `Map102`, the spire pocket at x 69-72, y 6-19 | ukelele | 22 |
| `"Blaster"` (Boomstick) | **Outer Cliffs** · Terraced Cliffside `Map108`, the walled-off ledge at x 43-45, y 13-15 behind its Spire | ukelele or bomb, once a way down to it exists | 25-30 |
| `"Meta Arm"` (Arm) | **Volcanis Grotto** · Fiery End `Map253`, the rope pocket at x 25-37, y 2-17 | rope | ~43 |

Two of them sit beside what their slayer line kills: Blaster among Terraced Cliffside's skeletons (undead,
family 48) and Meta Arm among Fiery End's heated titans (constructs, family 56). Crescent Blossom gives Mad
Hops the payoff `todo.md` says it lacks.

**Blaster's ledge has to be built first.** Nothing reaches it today, since wall stands above its Spire; it
looks like the drop-down spot `todo.md` describes. Without a way down, the home is the Pearl Salt Mines' Up or
Down (`Map353`), the spire pocket at x 18-19, y 20-25, among will 'o' wisps (undead, family 48 as well),
opened by the ukelele around 22.

Four of the five land in the ⭐ band of 10-35. Meta Arm arrives late, as Colossus and Concussivity already do.

### The 27 salvage

Nine per band and three of each kind, so each band holds exactly enough to build its rung in all nine armor
lines. **H** is Fractured Handgear (`i95`), **S** Perforated Suit (`i96`), **F** Dilapidated Footwear (`i97`).

| Band | Kind | Home | Opened by |
|---|---|---|---|
| **⭐: chapters 1-2** | H | Pearl Salt Mines · Western Caverns · Offshoot NE `Map130` | nothing |
| | S | Pearl Salt Mines · Western Caverns · Offshoot NW `Map133` | nothing |
| | F | Pearl Salt Mines · Southern Caverns · Offshoot SE `Map139` | nothing |
| | H | Forlorn Basin F1 · Passage - 1 `Map094`, spire pocket at x 31-43, y 3-11 | ukelele |
| | S | Forlorn Basin F2 · Passage - 5 `Map099`, spire pocket at x 48-53, y 21-28 | ukelele |
| | F | Forlorn Basin F2 · Passage - 4a `Map106`, spire pocket at x 22-31, y 4-27 | ukelele |
| | H | Earthen Layer · West Side `Map168`, past its boulder puzzle | nothing |
| | S | Earthen Layer · East Side `Map169`, past its boulder puzzle | nothing |
| | F | Earthen Layer · South Side `Map170`, past its boulder puzzle | nothing |
| **⭐⭐: chapter 3, the rope era** | H | Pearl Salt Mines · E Side `Map349`, rope pocket at x 0-6, y 11-13 | rope |
| | S | Raevulaen Heartbeat · A River Receded `Map200`, behind the waterfall | rope |
| | F | Forest of Dreams · Peaceful Respite `Map067`, the well | rope |
| | H | Lakeside Road · Frozen Fortress `Map116`, rope pocket at x 35-45, y 5-15 | rope |
| | S | Erocia Isthmus · Distant Hill `Map218`, beside Akai Supeeya | rope |
| | F | Highwater Way · Western Way `Map257` | nothing |
| | H | Volcanis Grotto · Volcanis Pass `Map243`, rope pocket at x 35-46, y 13-17 | rope |
| | S | Volcanis Grotto · The Bellows `Map246`, rope pocket at x 7-15, y 15-21 | rope |
| | F | Raevulaen Heartbeat · past Riverside Stroll's Suspicious Crack `Map179`, rope pocket at x 20-29, y 3-13 | rope |
| **⭐⭐⭐: late chapter 3 and the last rope backtracks** | H | Fallen Kingdom · The Drunken Sheep `Map292` | nothing |
| | S | Fallen Kingdom · Bathroom of Joy `Map294` | nothing |
| | F | Fallen Kingdom · The Backroom `Map298` | nothing |
| | H | Negative Peaks · Foothills `Map301`, rope pocket at x 34-42, y 19-24 | rope |
| | S | Negative Peaks · Shelter and Beyond `Map306`, its rope pocket | rope |
| | F | Negative Peaks · Icy Foray `Map308`, past its rope crossing | rope |
| | H | Pearl Salt Mines · W Side `Map346`, its rope pocket | rope |
| | S | Volcanis Grotto · Fiery End `Map253`, rope pocket at x 8-27, y 1-5 | rope |
| | F | Forest of Dreams · Heart of the Dream `Map077` | rope |

Left alone on purpose: the Dangerous Oneway's "tempting treasure" (`Map057`), which `todo.md` has in mind for
a flux drive, and Highwater's Eastern Way (`Map256`), whose door `map-atlas` reads as locked behind progress
made somewhere else.

---

## The roster

54 named weapons, 18 legendaries. `Location` = where the named weapon is found. `Blueprint` = how that
subgroup's legendary recipe is acquired. Both are open for every row.

### Blade

| Subgroup | Rung | Weapon | Location |
|---|---|---|---|
| **Sword** | ⭐ | `"Light Thrust"` | **Forlorn Basin** F1 · Passage - 2a `Map096` |
| | ⭐⭐ | `"Sacred Spine"` | TBD |
| | ⭐⭐⭐ | `"Claidheamh Soluis"` | TBD |
| | **legendary** | `"The Corona"` ← Lunar Vengeance | Blueprint: TBD *(20× Impervious Seashell proposed)* |
| **Claymore** | ⭐ | `"Colossus"` | **Negative Peaks** · Icy Foray · Frosty Hole `Map321` |
| | ⭐⭐ | `"Juggernaut"` | TBD |
| | ⭐⭐⭐ | `"Lævateinn"` | TBD |
| | **legendary** | `"Aeolian"` ← Sundering Cleaver | Blueprint: TBD |
| **Edge** | ⭐ | `"Agility"` | **Pearl Salt Mines** · Northern Caverns · Offshoot N `Map059` |
| | ⭐⭐ | `"Swiftness"` | TBD |
| | ⭐⭐⭐ | `"Hrunting"` | TBD |
| | **legendary** | `"Gemini"` ← Maelstrom Edge | Blueprint: TBD |

### Spear

| Subgroup | Rung | Weapon | Location |
|---|---|---|---|
| **Pike** | ⭐ | `"Akai Supeeya"` | **Erocia Isthmus** · Going Under · Distant Hill `Map218` |
| | ⭐⭐ | `"Crimson Stabber"` | TBD |
| | ⭐⭐⭐ | `"Rhongomyniad"` | TBD |
| | **legendary** | `"Ichor"` ← Bloodletter | Blueprint: TBD |
| **Warstaff** | ⭐ | `"Concussivity"` | **Negative Peaks** · Foothills · Gotta Go Fast `Map324` |
| | ⭐⭐ | `"Ground Pounder"` | TBD |
| | ⭐⭐⭐ | `"Daedalus"` | TBD |
| | **legendary** | `"Seismos"` ← Crasher | Blueprint: TBD |
| **Javelin** | ⭐ | `"Fish Eater"` | **Forlorn Basin** F5 · Passage - 12 `Map190` + 12b `Map192` |
| | ⭐⭐ | `"Sauroter"` | TBD |
| | ⭐⭐⭐ | `"Vel"` | TBD |
| | **legendary** | `"Stigmata"` ← Shrike | Blueprint: TBD |

### Gun

| Subgroup | Rung | Weapon | Location |
|---|---|---|---|
| **Handgun** | ⭐ | `"Burning Bullet"` | **Volcanis Grotto** · Wriggling Caverns · Extended Tunnel `Map251` |
| | ⭐⭐ | `"Hellfire Shot"` | TBD |
| | ⭐⭐⭐ | `"Xiuhcoatl"` | TBD |
| | **legendary** | `"Verdict"` ← KS Model 1337 | Blueprint: TBD |
| **Taser** | ⭐ | `"Fly Zapper"` | **Fallen Kingdom** · Courtyard East · Dargin's Tooth `Map295` |
| | ⭐⭐ | `"Defoliant"` | TBD |
| | ⭐⭐⭐ | `"Teen Baan"` | TBD |
| | **legendary** | `"Vitrification"` ← Exavolt Stun Gun | Blueprint: TBD *(Cell line is the natural material)* |
| **Boomstick** | ⭐ | `"Blaster"` | **Outer Cliffs** · Terraced Cliffside `Map108` once its ledge is reachable, else **Pearl Salt Mines** · Up or Down `Map353` *(decided, not yet placed)* |
| | ⭐⭐ | `"Spray of Death"` | TBD |
| | ⭐⭐⭐ | `"Astra"` | TBD |
| | **legendary** | `"Legion"` ← Megabarrel | Blueprint: TBD |

### Axe

| Subgroup | Rung | Weapon | Location |
|---|---|---|---|
| **Hatchet** | ⭐ | `"Glowing Hacker"` | **Intro** · Cave - 6b `Map323` |
| | ⭐⭐ | `"Sky Splitter"` | TBD |
| | ⭐⭐⭐ | `"Mjolnir"` | TBD |
| | **legendary** | `"Reckoning"` ← Deathtrap Broadaxe | Blueprint: TBD |
| **Glaive** | ⭐ | `"Crescent Blossom"` | **Forest of Dreams** · Mad Hops `Map159` *(decided, not yet placed)* |
| | ⭐⭐ | `"Half-Moon Bloom"` | TBD |
| | ⭐⭐⭐ | `"Ecliptic Efflorescence"` | TBD |
| | **legendary** | `"The Styrofoam Axe"` ← Gossamer Halberd | Blueprint: TBD |
| **Mace** | ⭐ | `"Plate Peeler"` | **Pearl Salt Mines** · Northern Caverns · Offshoot W `Map150` *(decided, not yet placed)* |
| | ⭐⭐ | `"Bared Truth"` | TBD |
| | ⭐⭐⭐ | `"Fragarach"` | TBD |
| | **legendary** | `"Ablation"` ← Wardbreaker Godendag | Blueprint: TBD |

### Wand

| Subgroup | Rung | Weapon | Location |
|---|---|---|---|
| **Cane** | ⭐ | `"Still Water"` | **Volcanis Grotto** · The Bellows `Map246` |
| | ⭐⭐ | `"Quiet Drowning"` | TBD |
| | ⭐⭐⭐ | `"Ruyi"` | TBD |
| | **legendary** | `"Opalescence"` ← Overwrought Staff | Blueprint: TBD |
| **Rod** | ⭐ | `"First Light"` | **Forest of Dreams** · Blue View · Marshy Secret `Map161` |
| | ⭐⭐ | `"Zenith"` | TBD |
| | ⭐⭐⭐ | `"Vajra"` | TBD |
| | **legendary** | `"Apotheosis"` ← Critical Mass | Blueprint: TBD |
| **Tome** | ⭐ | `"Chained Volume"` | **Fallen Kingdom** · Guard Station · Storage Archives `Map271` |
| | ⭐⭐ | `"Apocrypha"` | TBD |
| | ⭐⭐⭐ | `"Rauðskinna"` | TBD |
| | **legendary** | `"Anathema"` ← Unabridged | Blueprint: TBD |

### Fist

| Subgroup | Rung | Weapon | Location |
|---|---|---|---|
| **Gloves** | ⭐ | `"Empty Hand"` | **Highwater Way** · Treasure Hideout `Map262` |
| | ⭐⭐ | `"Nothing Left"` | TBD |
| | ⭐⭐⭐ | `"Hecatoncheire"` | TBD |
| | **legendary** | `"Concussion"` ← Meteor Knuckles | Blueprint: TBD |
| **Claws** | ⭐ | `"Brought Down"` | **Forlorn Basin** F4 · Passage - 8 `Map102` *(decided, not yet placed)* |
| | ⭐⭐ | `"Opened Up"` | TBD |
| | ⭐⭐⭐ | `"Nemean's Talons"` | TBD |
| | **legendary** | `"Sparagmos"` ← Godflayers | Blueprint: TBD |
| **Arm** | ⭐ | `"Meta Arm"` | **Volcanis Grotto** · Fiery End `Map253` *(decided, not yet placed)* |
| | ⭐⭐ | `"Sybirtek Arm"` | TBD |
| | ⭐⭐⭐ | `"Talos"` | TBD |
| | **legendary** | `"Tonnage"` ← Superstructure | Blueprint: TBD *(Radiator line is the natural material; Talos is itself an automaton)* |

---

## Constraints to respect when filling this in

**Every legendary recipe already exists** in `config.crafting.json` as `w-<subgroup>-10`, tier 7. The
recipes themselves are **not to be trusted** — they predate the monster-material palette and are due a
redesign. What is stable is the *shape*: tier-6 feeder consumed, ⭐⭐⭐ as tool.

**The material palette is complete enough to design against.** All 47 material blocks (`Armors`
301–535) have five named rungs, a tier order, a parameter and an icon. Description quality varies and
does not matter here.

**No top-tier material currently drops.** Of 231 monster materials, 50 have a drop source; the gaps are
overwhelmingly tiers 4–5. Any bulk-trade design needs the drop wiring to land first, or the blueprint
is unreachable by construction. The construct family (`monsterFamilyIcon:56`, 50 members across Golem /
Hazard / Robot / Homunculus / Runebound) has 30 members carrying **zero** drop tags.

**Three material lines were built specifically for mechanical gear** on 2026-08-22 and map onto
subgroups named above:

| Material block | `Armors` | Feeds |
|---|---|---|
| **Plate** (`fdr`) | 436–440 | `a-feet-medium` — sabatons |
| **Cell** (`tst`) | 486–490 | Taser subgroup |
| **Radiator** (`ser`) | 496–500 | Arm subgroup |
