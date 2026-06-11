# Spear — Basher (war staff)

> Parent: [`../spear.md`](../spear.md) · Skill lot: **mortar** (IDs **41–50** when migrated)
>
> Full row table: [`../../skill-lots.md`](../../skill-lots.md#spear-basher--lot-mortar-ids-4150-when-migrated)

Last updated: **2026-06-03**

---

## Identity

| | |
|---|---|
| **Fantasy** | War staff — wide **mortar** sweeps + one **circle** “release” button |
| **Verb** | **Coverage** main string; secondary = **room control** + optional **charged waves** |
| **Tempo** | Main: **connect** combo `1→2→3→4`; offchain **~8s CD** |
| **Stat** | **MAT** + **MP** (not ATK-primary) — supports **caster archetypes** without wand/tome lock-in |
| **Theme** | **mortar** (prof: plausible deniability, magic touch, …) |

**Family fit:** spear still **AGI-lean** at family level; this subgroup is the **MAT/MP outlet** inside spear — deliberate contrast to **pierce** (thin lines, pin/dive).

**Not baseline identity:** stacked crit on every hit; ATK-only formulas. Damage and spikes lean **MAT**; prof adds **MP sustain** and **spend** on waves.

## Row layout exception

**Four main rows (1–4)** + **one offchain row (5)** — no offchain finisher row. `<offhandSkillId>` points at row **5** only.

## Main chain (rows 1–4)

| Row | Hitbox (draft) | Job |
|---|---|---|
| 1 | Line **2.5**, **0.5** | Mid wide thrust — starter |
| 2 | Line **2.5**, **0.7** | Mid, slightly wider |
| 3 | Arc **~150°**, **1.5** | Short wide swing — pivot beat |
| 4 | Line **2.5**, **1.5** | Mid, rather wide — **chain ends** |

**Combo:** `1→2→3→4` on **connect** — row **4** ends string (no loop to row **1**).

**No `<freeCombo>`** — melee mortar uses standard connect gates only.

## Offchain (row 5)

| Row | Job |
|---|---|
| 5 | **Circle** hitbox, radius **~4** — secondary starter/finisher in one skill; **~8s CD** |

Prof rows **8** and **10** add **charge tiers** on this skill (MP cost) — see lot table.

## Prof rows (6–10)

| Row | Name | Effect |
|---|---|---|
| 6 | Plausible deniability | Offchain1: apply **disarm** (no weapon/basic attacks) |
| 7 | Magic touch | All mainchain hits (1–4): recover a **small amount of MP** |
| 8 | Energy release | Offchain1: **charge tier 1** → **magic wave** (costs **MP**) |
| 9 | Implausible deniability | Offchain1: apply **mute** (no spells / combat skills) |
| 10 | Cosmic release | Offchain1: **charge tier 2** → **crippling wave** (costs **MP**) |

**Denial fantasy:** rows **6** and **9** are separate prof extends on the **same** circle skill — disarm vs mute branches. Full-build stacking is a **migration tuning** question (duration, chance, immunity bands).

**MP loop:** row **7** fuels rows **8** / **10**; caster mains can stay on basher without defaulting to staff/tome gear.

## Weapon tags (migration)

- `<skillId:41>` row 1
- `<offhandSkillId:45>` row 5 circle

## Open (migration)

- [ ] Formula coefficients: **MAT**-weighted on all action rows
- [ ] Charge tier MP costs and wave hitbox/element tags
- [ ] Cosmic wave “crippling” debuff package (slow, def shred, duration)
- [ ] Disarm + mute both owned: exclusivity vs stacked prof at max rank

## Revision log

| Date | Note |
|---|---|
| 2026-06-03 | **Mortar lot locked:** 4× main + circle offchain, MAT/MP caster support, denial + charge prof ladder. |
| 2026-06-03 | **No `<freeCombo>`** on melee mortar. |
