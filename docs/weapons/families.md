# Weapon families — index (living)

> **Purpose:** Entry point for weapon **family** and **subgroup** identity design.
> Pair with [`main.md`](./main.md) (named drop locations) and [`../sdp/archetype-mapping.md`](../sdp/archetype-mapping.md) (stat leans, build framework).
>
> **Order of work:** identity → proficiency depth → protag access (who mains what, when).
>
> **Scope:** Six families on **Jerald and Rupert** only. Elementals use exclusive weapon types and separate kits.
>
> Last updated: **2026-06-04** — **18/18** weapon lots planned (**1–180**); see [`skill-lots.md`](./skill-lots.md).

---

## Doc layout

| Level | Path | When to use |
|---|---|---|
| **Index** | This file | Framework, links, cross-family notes |
| **Family** | [`families/<family>.md`](./families/blade.md) | Family thesis, subgroup table, family backlog |
| **Subgroup** | [`families/<family>/<subgroup>.md`](./families/blade/1h.md) | Full identity, prof direction, open questions — split when a family doc gets long |

---

## Framework

**Build = Weapon identity × SDP panel investment** (see archetype mapping).

| Family | Doc | `wtypeId` | Skill IDs | Stat lean |
|---|---|---|---|---|
| Blade | [`families/blade.md`](./families/blade.md) | 1–3 | **1–30** (target) · legacy 1–15 | ATK |
| Spear | [`families/spear.md`](./families/spear.md) | 4–6 | **31–60** (target) · legacy 16–30 | AGI |
| Gun | [`families/gun.md`](./families/gun.md) | 7–9 | **61–90** (target) · legacy 31–45 | LUK (+ MAT taser) |
| Axe | [`families/axe.md`](./families/axe.md) | 10–12 | **91–120** (target) · legacy 46–60 | MHP |
| Wand | [`families/wand.md`](./families/wand.md) | 13–15 | **121–150** (target) · legacy 61–75 | MAT |
| Fist | [`families/fist.md`](./families/fist.md) | 16–18 | **151–180** (target) · legacy 76–90 | ATK |

**A family owns no `wtypeId` of its own — each of its three subgroups is a weapon type.** Families are a
design grouping and appear nowhere the player can see; the equip screen names the *subgroup*.

Each family has **three subgroups**. **Target:** **10 skill rows per subgroup** in **one contiguous weapon band** (**1–180**) — see [`skill-lots.md`](./skill-lots.md). Default shape: **3 main + 2 offchain + 5 prof**; **dual** uses **4 main + 6 prof** (no offchain).

### Canonical vocabulary

**Three names describe every subgroup, and they are not interchangeable.** The **subgroup noun** is the
`weaponTypes` entry in `System.json` — it is what the player reads, what the recipe key uses, and what
the proficiency key uses. The **lot codename** is the design theme, used for naming the skills inside the
lot and for nothing else. A **positional label** (1H / 2H / dual) describes how the thing is held and is
prose only; it must never become a key, because `1H` collides across four families.

| Family | `wtypeId` · subgroup noun | Lot codename | Recipe key | Proficiency key |
|---|---|---|---|---|
| Blade | 1 Sword · 2 Claymore · 3 Edge | sharp · beast · twist | `w-sword` `w-claymore` `w-edge` | `blade-sword` `blade-claymore` `blade-edge` |
| Spear | 4 Pike · 5 Warstaff · 6 Javelin | pierce · mortar · rend | `w-pike` `w-warstaff` `w-javelin` | `spear-pike` `spear-warstaff` `spear-javelin` |
| Gun | 7 Handgun · 8 Taser · 9 Boomstick | gunfu · conduit · boomstick | `w-handgun` `w-taser` `w-boomstick` | `gun-handgun` `gun-taser` `gun-boomstick` |
| Axe | 10 Hatchet · 11 Glaive · 12 Mace | buffer · cleave · breaker | `w-hatchet` `w-glaive` `w-mace` | `axe-hatchet` `axe-glaive` `axe-mace` |
| Wand | 13 Cane · 14 Rod · 15 Tome | aura · saturation · lexicon | `w-cane` `w-rod` `w-tome` | `wand-cane` `wand-rod` `wand-tome` |
| Fist | 16 Gloves · 17 Claws · 18 Arm | flow · gore · dirty | `w-gloves` `w-claws` `w-arm` | `fist-gloves` `fist-claws` `fist-arm` |

Offhands follow the same shape against `armorTypes`: `offhand-relic`, `offhand-gauntlet`,
`offhand-shield`.

**Why the nouns and not the codenames:** a noun is recoverable from the database — the Edge line reads
*Rain Edge, Blaze Edge, Vulcan Edge* — while nothing in any data file says "twist," so a codename key
would need this document to be legible at all.

**Two subgroups were renamed to end a collision:** wtype 1 `Blade` → **Sword** and wtype 4 `Spear` →
**Pike**, because each shared its family's name and produced keys like `blade-blade`. Wtype 12
`Breaker` → **Mace**, because `breaker` was serving as both a subgroup noun and a lot codename.

### The power curve, and why id order is not it

Each subgroup holds **ten weapons**: six craftable rungs, three named ones found in the world, and a
legendary. Their **ids are clustered** — craftables first, then the named, then the legendary — purely so
a subgroup reads as one contiguous block. **That clustering is not the progression.** Power interleaves:

```
t1  <  t2  <  ⭐  <  t3  <  t4  <  ⭐⭐  <  t5  <  t6  <  ⭐⭐⭐  <  legendary
```

Verified against ATK (or MAT, for the four caster subgroups) across **all eighteen subgroups, with no
exceptions**. So a named weapon is never "tier 7, 8 or 9" — the recipe `tier` field only ever holds 1–6
plus 7 for the legendary, and a named weapon has no recipe and therefore no tier at all.

What that buys, in play: you find **⭐** while you are still working toward t3 materials, and it is a
straight upgrade over the t2 in your hand. **⭐⭐** lands the same way against t5. **⭐⭐⭐** sits above
your best craftable *and* is a required ingredient for the legendary, which is why it is hidden hardest.

**⭐ lives in the weapon's `description`**, as its first character — that is the marker in the data, and
named weapons carry no other flag.

**Blade (planned):** **sharp** 1–10, **beast** 11–20, **twist** 21–30 — [`families/blade.md`](./families/blade.md).

**Spear (complete):** **pierce** 31–40, **mortar** 41–50, **rend** 51–60 — [`families/spear/`](./families/spear.md).

**Gun (complete):** **gunfu** 61–70, **conduit** 71–80, **boomstick** 81–90 — [`families/gun/`](./families/gun.md).

**Axe (complete):** **91–120** — [`families/axe/`](./families/axe.md).

**Wand (complete):** **121–150** — [`families/wand/`](./families/wand.md) (**aura** / **saturation** / **lexicon**).

**Fist (complete):** **flow** glove **151–160**, **gore** claw **161–170**, **dirty** arm **171–180** — [`families/fist/`](./families/fist.md).

**Today (legacy):** scattered IDs **1–90** + prof elsewhere. **Plan all 18 lots, migrate once** — skills, weapons, `JR-*` keys, relocate overlapping kit bands (e.g. Jerald **101–144**).

**Proficiency:** `config.proficiency.json` — **main skill + subskills**; prof rows unlock in **numeric row order** (row 6 → 7 → … unless lot starts prof at row 4/5). Offchain-only counters may count rows **4–5** usage only. See [`skill-lots.md`](./skill-lots.md).

**Secondary hits:** [`secondary-hits.md`](./secondary-hits.md)

**Deferred:** protag default weapons, equip tiers, SDP unlock gates.

---

## Cross-family notes

- **All subgroups are viable main paths:** every weapon subgroup (across all six families) must stand on its own as a full-time choice — not objectively worse than its siblings. **Skill expression is fine:** playing a subgroup *correctly* should feel clever; playing it *wrong* should feel punished. Viable ≠ forgiving.  
- **Weapon elements on gear:** intentional coverage (heat/liquid on dual blades, etc.) — can hard-counter a **subgroup main** if neutral path arrives late. See [`families/blade/dual.md`](./families/blade/dual.md). Policy TBD globally.  
- **Future tracker:** when engineering piles up, add a **weapon families redesign** item to [`../sdp/work-items.md`](../sdp/work-items.md) or tutorial backlog.

---

## Revision log

| Date | Note |
|---|---|
| 2026-06-03 | Created; blade family. |
| 2026-06-03 | Split into per-family and blade per-subgroup docs under [`families/`](./families/). |
| 2026-06-03 | Prof slot expansion policy drafted. |
| 2026-06-04 | **Blade lots complete** (sharp / beast / twist); skill-lots **1–30** map. |
| 2026-06-04 | **Spear stab pierce** lot locked (IDs **31–40**). |
| 2026-06-03 | **Spear basher mortar** lot locked (IDs **41–50**); MAT/MP caster path. |
| 2026-06-03 | **Spear javelin rend** lot locked (IDs **51–60**); **spear family complete**. |
| 2026-06-03 | **Gun pistol gunfu** lot locked (IDs **61–70**). |
| 2026-06-03 | **Gun taser conduit** lot locked (IDs **71–80**). |
| 2026-06-03 | **Global:** prof rows unlock in numeric row order for every weapon lot. |
| 2026-06-03 | **Gun shotgun boomstick** lot locked (IDs **81–90**); **gun family complete**. |
| 2026-06-03 | **Axe 1H hatchet buffer** lot locked (IDs **91–100**). |
| 2026-06-03 | **Axe 2H battleaxe cleave** lot locked (IDs **101–110**). |
| 2026-06-03 | **Axe breaker** lot locked (IDs **111–120**). **Axe family complete (91–120).** |
| 2026-06-03 | **Wand staff aura** lot locked (IDs **121–130**); charge = on release (global). |
| 2026-06-03 | **Wand 1H saturation** lot locked (IDs **131–140**); additive MAT stacks, bullet-hell prof ladder. |
| 2026-06-03 | **Wand tome lexicon** lot locked (IDs **141–150**). **Wand family complete (121–150).** |
| 2026-06-03 | **Fist arm dirty** lot locked (IDs **171–180**); Grab Ready! / Violation, offchain A/B. |
| 2026-06-03 | **Fist glove flow** lot locked (IDs **151–160**); L/R cross-boost + LST, independent Flow recurse. |
| 2026-06-03 | **Fist claw gore** lot locked (IDs **161–170**); baseline bleed, Bloodthirst → Gambit circle. **Fist family complete (151–180).** **All 18 lots planned (1–180).** |
