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
  `got-named-arm` 218) are already reserved and waiting.
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
- **The 27 salvage placements**, and whether they sit in chests, behind tool gates, or both.
- **The exact material bills** at each rung.
- **Survival's inherited tier.** `./unlockables/recipe-journals.md` holds the doctrine — *found <
  taught < inherited* — and cooking, alchemy and smithing each have all three. Survival has pattern
  scraps and Millie, and nothing above her.

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
| **Boomstick** | ⭐ | `"Blaster"` | TBD |
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
| **Glaive** | ⭐ | `"Crescent Blossom"` | TBD |
| | ⭐⭐ | `"Half-Moon Bloom"` | TBD |
| | ⭐⭐⭐ | `"Ecliptic Efflorescence"` | TBD |
| | **legendary** | `"The Styrofoam Axe"` ← Gossamer Halberd | Blueprint: TBD |
| **Mace** | ⭐ | `"Plate Peeler"` | TBD |
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
| **Claws** | ⭐ | `"Brought Down"` | TBD |
| | ⭐⭐ | `"Opened Up"` | TBD |
| | ⭐⭐⭐ | `"Nemean's Talons"` | TBD |
| | **legendary** | `"Sparagmos"` ← Godflayers | Blueprint: TBD |
| **Arm** | ⭐ | `"Meta Arm"` | TBD |
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
