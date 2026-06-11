# Axe — Breaker (2H deconstruction axe)

> Parent: [`../axe.md`](../axe.md) · Doc index: **breaker** (IDs **111–120** when migrated)
>
> Full row table: [`../../skill-lots.md`](../../skill-lots.md#axe-breaker--ids-111120-when-migrated)

Last updated: **2026-06-03**

---

## Identity

| | |
|---|---|
| **Fantasy** | **Deconstruct** — peel plates, hack wiring, **SHATTER** what’s left |
| **Verb** | **LLRL** connect main → offhand **SHATTER**; one **Tenderizing** currency |
| **Tempo** | **Deliberate** string — not 1H slow, not 2H blender; setup → snap |
| **Stat** | **ATK** |
| **Mindset** | **Party-facing soften** — **−PDR stacks on the enemy help everyone’s physical hits**, not just yours |

**Almost support-ey:** you’re not healing — you’re **making the whole party hit harder** until the target is **Exposed**.

**Rhythm:** *left, left, right, left* → **SHATTER** (localized AOE, shield glass break).

**Replaces legacy twin/helicopter** — same ID band **111–120**.

## Row layout

**Four main rows (1–4)** + **one offchain row (5)** + **five prof rows (6–10)**.

## Main chain (rows 1–4)

| Row | Hitbox (draft) | Job |
|---|---|---|
| 1 | Arc **100°**, **1.8** | Small opener |
| 2 | Arc **120°**, **1.8** | Medium swing |
| 3 | Arc **180°** (reverse), **2** | Wide reverse |
| 4 | Arc **75°**, **2** | Face hit — string payoff before snap |

**Connect:** `1→2→3→4` on hit. **No `<freeCombo>`**.

## Offchain (row 5)

| Row | Hitbox (draft) | Job |
|---|---|---|
| 5 | **SHATTER** — **Circle**, **3** | Localized AOE; shatters shields; **+5 Tenderizing stacks** on hit (baseline) |

**Pistol grammar:** earn on main string → spend on offhand — currency is **enemy shred**, not stronger shot damage.

## Tenderizing (unified currency)

| | |
|---|---|
| **State** | **Tenderizing** — stack count on target |
| **Per stack** | **−PDR** (party buff — everyone’s physical hits benefit; tune per stack at migration) |
| **Cap** | **~20 stacks** |
| **Sources** | Mains **+1**/hit (prof **7**); **SHATTER** **+5** (row **5**); **Crushing shatter** (prof **8**) adds **+radius** and **more stacks** on SHATTER |

## Prof rows (6–10)

| Row | Name | Effect |
|---|---|---|
| 6 | **Breaking swings** | All mains: **+100% damage to shields** |
| 7 | **Tenderizing swings** | All mains: apply **Tenderizing** stacks |
| 8 | **Crushing shatter** | **SHATTER:** **+radius** + **more stacks** (not a separate debuff type) |
| 9 | **Descaling swings** | All mains: anti-**construct** / **dragon** / **aquatic** |
| 10 | **Exposed** | At **max Tenderizing stacks (~20):** convert → **Exposed** — **0 PDR**, target takes **×2 physical damage** (multiplies **with** CDM and other effects) |

**Capstone:** not a damage button — **structural failure**. Target is **naked**; the party finishes them.

## Archetype partners (draft)

**Natural:** Vanguard, Berserker (anti-armor content), party DPS enabler. **Unique axe lane:** only subgroup whose prof core is **enemy PDR shred for the team**.

## Weapon tags (migration)

- `<skillId:111>` row **1**
- `<offhandSkillId:115>` row **5** (**SHATTER**)

## Open (migration)

- [ ] PDR per Tenderizing stack; **Exposed** duration / cleanse
- [ ] **×2 physical taken** implementation tag vs **0 PDR** alone
- [ ] **Crushing shatter** stack bonus (+7? double application?) + radius tune
- [ ] **Exposed** state id + VFX read (“naked” target)

## Revision log

| Date | Note |
|---|---|
| 2026-06-03 | **Breaker lot locked:** 4+1 LLRL→SHATTER, Tenderizing→Exposed, party PDR shred. |
