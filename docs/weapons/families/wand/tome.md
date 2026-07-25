# Wand — Tome

> Parent: [`../wand.md`](../wand.md) · Skill lot: **lexicon** (IDs **141–150** when migrated)
>
> Full row table: [`../../skill-lots.md`](../../skill-lots.md#wand-tome--lot-lexicon-ids-141150-when-migrated)

Last updated: **2026-06-03**

---

## Identity

| | |
|---|---|
| **Fantasy** | **Read them to death** — point `<direct>` sentences; dictionary vitriol until they break |
| **Verb** | **Direct** mains (cast on target tile); offhand toggles **cast tempo** — **tap = fast**, **charge = slow artillery** |
| **Tempo** | Mains: **`<direct>`** + cast time; **`freeCombo`** — whiff doesn’t brick the next read |
| **Stat** | **MMP** (high) · **MDF** / **MAT** (low on gear) — not “another MAT stick”; formula tuned at migration |
| **Theme** | **lexicon** (prof: Cursed language, Booming voice, Mortal mindmelt, …) |

**Only implement with baseline `<direct>`** — spell resolves on the locked target’s tile (see J-ABS direct rules).

**Offchain cast fork (intentional):**

| Input | Mode |
|---|---|
| **Tap** offhand | **~10s** self buff — **cast time −50%** (weave reads) |
| **Charge → release** (prof **6**) | **Tier 1** buff **~20s** — **cast time +50%**, **MAT +50%**, **MDF +50%** |
| **Charge → release** (prof **10**) | **Tier 2** buff **~30s** — **cast time +100%**, **MAT +250%**, **MDF +250%** |

**Not channeling** — hold → **release** applies buff; duration is **buff lifetime**, not hold time.

**Artillery path:** slow casts stack with **`castTimeDamageBonus`** (Lamia / Artillery SDP mastery — +damage per cast second). Most players **tap** offhand until that mastery; charged tiers turn the tome into **self-inflicted artillery** if you want max wind-up.

**Contrast siblings:** **Staff** = spray + aura · **Wand** = bolt machine gun + MAT Saturation · **Tome** = **direct condemn + cast-time yin/yang**.

## Row layout

**Two main rows (1–2)** + **one offchain row (3)** + **seven prof rows (4–10)**.

**Weapon tags (migration):** `<skillId:141>` row **1**; `<offhandSkillId:143>` row **3**.

## Main chain (rows 1–2)

| Row | Job |
|---|---|
| 1 | **Point and sentence** — `<direct>` single target |
| 2 | **Further** — same verb, **longer reach** (proximity step at migration) |

**`<freeCombo>`** on both — alternate on tempo, not connect gates.

## Offchain (row 3)

| Row | Job |
|---|---|
| 3 | **Tap:** self buff **~10s**, **cast time −50%** |

Prof **6** / **10** add **charge tiers** on this button (see identity table).

## Prof rows (4–10)

| Row | Name | Effect |
|---|---|---|
| 4 | **Cursed language** | Mains apply **Curse** (**~5s**, **1 stack**) — while cursed, enemy **skills cost HP** (force self-harm when they press buttons) |
| 5 | **Booming voice** | Mains become **AOE** (**radius ~1.5**) |
| 6 | **Monotonous monologue** | Offchain **charge tier 1** → release: buff **~20s**, **cast +50%**, **MAT +50%**, **MDF +50%** |
| 7 | **Forked tongue** | Mains gain **MST (1%)** + **MP damage** (**10%** of base damage) |
| 8 | **Ruthless insult** | Mains: **+100% damage vs cursed** foes; **`anti-slime`** attack element |
| 9 | **Echoing voice** | Mains: **+2 hits**, **larger radius** |
| 10 | **Mortal mindmelt** | Offchain **charge tier 2** → release: buff **~30s**, **cast +100%**, **MAT +250%**, **MDF +250%** |

**Curse (row 4):** not HCR — debuff inflicts **HP costs on enemy skill use** (Resources / skill-cost hook at migration).

**Alienation-style elements:** **`anti-slime`** on row **8** is an attack **element** (slayer/family axis), not a freeform tag.

## Loop (base)

**Direct** sentence on **`freeCombo`** → **tap offhand** for fast casts → repeat. Prof adds **curse**, **AOE**, **charged slow buffs**, **manasteal**, **curse payoff**, **echo hits**, **mindmelt capstone**. With Lamia mastery: **charge offhand** → **long casts** → **`castTimeDamageBonus`** spike.

## Archetype partners (draft)

**Natural:** **Artillery** (Lamia **`castTimeDamageBonus`**), Enchanter, MMP/MDF panels. **Tome** is the weapon that **asks** for long cast times when you choose to charge.

## Open (migration)

- [ ] Damage formula (author at migration — **MMP/MDF** lean; CMS-scaling-compatible shape preferred)
- [ ] Curse state id + **HP cost on skill use** implementation for enemies
- [ ] Offchain charge tier frames + buff state ids (cast rate, MAT/MDF modifiers)
- [ ] `<direct>` proximity row **1** vs **2**; cast times per main row
- [ ] AOE radius / echo hit count / MP damage pipeline (Resources ABS **MST**)
- [ ] **`anti-slime`** element id on mains (prof **8**)

## Revision log

| Date | Note |
|---|---|
| 2026-06-03 | **Lexicon lot locked:** 2× direct main + cast-tempo offchain + prof 4–10; curse = enemy HP skill costs. |
