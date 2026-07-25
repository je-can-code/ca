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
| **Family** | [`families/<family>.md`](./families/blade.md) | Family thesis, playtest summary, subgroup table, family backlog |
| **Subgroup** | [`families/<family>/<subgroup>.md`](./families/blade/1h.md) | Full identity, prof direction, open questions — split when a family doc gets long |

---

## Framework

**Build = Weapon identity × SDP panel investment** (see archetype mapping).

| Family | Doc | `wtypeId` | Skill IDs | Stat lean |
|---|---|---|---|---|
| Blade | [`families/blade.md`](./families/blade.md) | 1 | **1–30** (target) · legacy 1–15 | ATK |
| Spear | [`families/spear.md`](./families/spear.md) | 2 | **31–60** (target) · legacy 16–30 | AGI |
| Gun | [`families/gun.md`](./families/gun.md) | 3 | **61–90** (target) · legacy 31–45 | LUK (+ MAT taser) |
| Axe | [`families/axe.md`](./families/axe.md) | 4 | **91–120** (target) · legacy 46–60 | MHP |
| Wand | [`families/wand.md`](./families/wand.md) | 5 | **121–150** (target) · legacy 61–75 | MAT |
| Fist | [`families/fist.md`](./families/fist.md) | 6 | **151–180** (target) · legacy 76–90 | ATK |

Each family has **three subgroups**. **Target:** **10 skill rows per subgroup** in **one contiguous weapon band** (**1–180**) — see [`skill-lots.md`](./skill-lots.md). Default shape: **3 main + 2 offchain + 5 prof**; **dual** uses **4 main + 6 prof** (no offchain).

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
| 2026-06-03 | Created; blade family from playtest discussion. |
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
