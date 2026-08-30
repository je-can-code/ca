# Weapon acquisition — named weapons and legendary blueprints

> **Purpose:** the single record of **where the three named weapons of each subgroup come from**, and
> **how the blueprint for that subgroup's legendary is acquired**.
>
> Pair with [`families.md`](./families.md) (identity design) and [`skill-lots.md`](./skill-lots.md)
> (skill bands). This file owns *acquisition only* — not stats, not skills, not identity.
>
> **Status:** started 2026-08-22. Supersedes `main.md`, whose *weapon names* were stale — four had
> been renamed in the database since it was written. Its **locations were accurate**, and are carried
> forward below, re-derived from the maps rather than copied.
>
> **Status update, 2026-08-27:** the acquisition chain is **decided** — see [The chain](#the-chain-decided-2026-08-27).
> Only the ⭐ rung is ever placed; ⭐⭐, ⭐⭐⭐ and the legendaries are all forged. **13 of 18 ⭐ weapons are
> live in the maps**; five remain. The 27 named *armors* are a separate throughline and are not covered
> by this file's chain.

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

## The chain `DECIDED 2026-08-27`

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

`../unlockables/recipe-journals.md` already states the unlock doctrine, and states it as holding per
discipline: **found < taught < inherited. Loot < lessons < love.** Smithing's rungs are written there
as **scraps → Viktor → (an inherited tier)**. This chain is that doctrine applied to weapons rather
than a new idea: scraps buy n2, Viktor teaches n3, and the legendary comes from the inherited tier.

**The inherited tier is the ghost, not Viktor.** Viktor is already the *taught* rung, so having him
also hand over the legendary would collapse two tiers into one person. Knowledge from someone who is
gone is a stronger read of "inherited," and it gives the Desolate Graves the purpose `story-canon.md`
currently records as `OPEN`.

### Losing Viktor loses the ladder, and that is intended

`../quests/SE-raevula/smiths-apprentice.md` has a branch where **the Metal Petal closes forever and
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

- **Armor gets a different throughline entirely.** Viktor owns weapons; `design-contract.md` puts
  armor and survival crafting on **Millie**. The 27 named armors therefore do not route through this
  chain, and their ladder is unsorted (Jeremy, 2026-08-27). Whether the Desolate Graves holds a second
  ghost or one who covers both crafts is undecided.
- **The five unplaced ⭐ weapons** — `"Blaster"` (Boomstick), `"Crescent Blossom"` (Glaive),
  `"Plate Peeler"` (Mace), `"Brought Down"` (Claws), `"Meta Arm"` (Arm). Their switches
  (`got-named-shotgun` 208, `got-named-2h-axe` 211, `got-named-doubleaxe` 212, `got-named-claw` 217,
  `got-named-arm` 218) are already reserved and waiting.
- **The exact material bills** at each rung.

### Where the materials come from

Any material requirement needs a drop source that can actually supply it. This was the blocker as of
2026-08-22 and **is now answered** — see
[`../enemies/drop-sources.md`](../enemies/drop-sources.md), which maps all 46 material blocks onto
enemy subgroups and harvest nodes.

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
