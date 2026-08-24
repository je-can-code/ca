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
> **⭐ rung: 13 of 18 placed and live in the maps.** ⭐⭐, ⭐⭐⭐ and all 18 legendaries: nothing placed,
> nothing decided.

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

## Open decisions

These are the questions this doc exists to close. Nothing below is settled.

### 1. How are the ⭐⭐ and ⭐⭐⭐ named weapons found?

**The ⭐ rung is already answered — thirteen of eighteen are placed in the maps today**, each as a
hand-placed pickup event named `named weapon: <subgroup>`. See the roster below for exact maps. So
the open question is narrower than it first appears: it is only about the upper two rungs.

Five ⭐ weapons remain unplaced: `"Blaster"` (Boomstick), `"Crescent Blossom"` (Glaive),
`"Plate Peeler"` (Mace), `"Brought Down"` (Claws), `"Meta Arm"` (Arm). Whether those follow the same
hand-placed pattern or adopt whatever is chosen for ⭐⭐/⭐⭐⭐ is open.

Candidates for the upper rungs:

- **Rare drop** from a themed enemy or family
- **Chest** in optional/late content, still hand-placed but not pre-announced
- **Boss reward**, one named weapon per major fight
- **Vendor** for an unusual currency
- **Quest reward**, tied to the questline that fits the weapon's story

Likely a **mix**, weighted by rung. Worth deciding whether the rung determines the *method* or only
the *rarity* — the ⭐ answer is already "hand-placed in a dungeon", so a different method for ⭐⭐⭐
would be a deliberate change of kind, not just of frequency.

### 2. How is a legendary blueprint acquired?

Candidate under discussion (2026-08-22): **trade a bulk quantity of a top-tier monster material for the
blueprint.** The worked example was **20× `Impervious Seashell`** (`Armors[455]`, top rung of the `ctr`
block) for the sword blueprint — a deliberate Link's Awakening echo, where twenty shells bought the
Koholint Sword.

What makes this attractive:

- It gives top-tier materials a **sink**, which they currently lack entirely.
- It is a **goal, not a lottery** — the same doctrine already adopted for recipe pages in
  [`../food/recipe-system.md`](../food/recipe-system.md): rarity is the price, and an unaffordable
  thing is something to work toward.
- It scales: eighteen legendaries × one bulk material each is eighteen material lines given purpose.

Open sub-questions:

- **One material per subgroup, or a shared legendary currency?** Per-subgroup ties each legendary to a
  region and an enemy family. Shared makes the economy legible but flattens it.
- **Who trades it?** Viktor is already the smithing "taught" tier in the found/taught/inherited ladder.
  A dedicated legendary vendor is a different feel from Viktor grudgingly agreeing.
- **Does the blueprint need the ⭐⭐⭐ in hand to purchase**, or only to craft? Requiring it at purchase
  makes the sequence explicit; requiring it only at craft lets a player buy early and aspire.
- **Bulk count.** Twenty is the Link's Awakening number and reads well. Whether every subgroup uses
  twenty, or the count varies by material rarity, is undecided.

### 3. Where do the bulk materials come from?

Any bulk requirement needs a drop source that can actually supply it. As of 2026-08-22 **no top-tier
material has a drop source** — see the coverage note at the bottom of this file.

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
