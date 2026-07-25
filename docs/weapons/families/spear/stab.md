# Spear — Stab (conventional)

> Parent: [`../spear.md`](../spear.md) · Skill lot: **pierce** (IDs **31–40** when migrated) · Named: **Akai Supeeya** ([`../../main.md`](../../main.md))
>
> Full row table: [`../../skill-lots.md`](../../skill-lots.md#spear-stab--lot-pierce-ids-3140-when-migrated)

Last updated: **2026-06-04**

---

## Identity

| | |
|---|---|
| **Fantasy** | Conventional thrust — endless line rhythm + occasional **dragoon dive** |
| **Verb** | Cyclic **line** main; secondary = **pin** → gap-close **star** at mark |
| **Tempo** | Main: **connect** combo; offchain: **~12s** pin CD (prof → ~8s) |
| **Stat** | AGI |
| **Theme** | **pierce** (prof names: heart-throb, star-struck, …) |

**Not baseline identity:** stacked crit on every hit (moved to prof / conditional moments).

## Main chain (rows 1–3 → 1)

| Row | Line (proximity, thickness) |
|---|---|
| 1 | **2.5**, **0.3** — mid thin |
| 2 | **2.8**, **0.5** |
| 3 | **3.0**, **0.7** → **combos to 1** |

**No `<freeCombo>`** — row **3** combos to row **1** only on **connect** (standard melee combo).

## Offchain (rows 4–5)

| Row | Job |
|---|---|
| 4 | **Pin** ~range **10** — **connect required** for row 5; **~12s CD** |
| 5 | **Gap-close** + **cross (4-dir)** at mark (**3.5**, **0.3**) |

Pin whiff = no dive; main loop still runs.

## Prof rows (6–10)

| Row | Name | Effect |
|---|---|---|
| 6 | Heart-throb | Mainchain3: **guaranteed crit** |
| 7 | Star-struck | Offchain2 → **nova 8-dir** (**4.5**, **0.5**) |
| 8 | Clear-eyed | Mainchain3: **line → ~45° arc**, ~**4** reach |
| 9 | Speed-demon | Offchain1 **−33% CD** (~8s) |
| 10 | Wall-breaker | Offchain2 + mainchain3: **slow**, **defense down** |

## Legacy playtest notes

Old kit: high crit chance on chain, charge felt unused; CDM scaling reduced skill expression. Target lot replaces with cycle + earned dive AOE.

## Open (migration)

- [ ] Pin mark state + jump targeting rules
- [ ] Star center: marked body vs landing tile
- [ ] Damage tuning: pin setup vs dive payoff

## Revision log

| Date | Note |
|---|---|
| 2026-06-04 | **Pierce lot locked:** cyclic main, pin→dive star, prof ladder. |
| 2026-06-03 | **No `<freeCombo>`** on melee pierce (connect-driven cycle). |
