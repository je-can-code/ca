# Axe — 2H Battleaxe

> Parent: [`../axe.md`](../axe.md) · Skill lot: **cleave** (IDs **101–110** when migrated)
>
> Full row table: [`../../skill-lots.md`](../../skill-lots.md#axe-2h-battleaxe--lot-cleave-ids-101110-when-migrated)

Last updated: **2026-06-03**

---

## Identity

| | |
|---|---|
| **Fantasy** | **Fast hack-and-slash** — “slow 1H with **both** hands” → finally allowed to go fast |
| **Verb** | **Five-hit connect** string — accelerate through the chain; prof escalates bleed → crit → devastation |
| **Tempo** | **Tight** combo windows; inter-hit CDs **step down** through the string (contrast **1H** slow + end pause) |
| **Stat** | **ATK** (no **MHP** on skill formulas — gear may still lean weight) |
| **Theme** | **cleave** (prof: Hamstring, Moonshot, Genocide, Euphoria, Bloodlust) |

**No `<freeCombo>`** — connect gates only. **No offchain** — the main string **is** the weapon.

**Payoffs:** **enemy** debuff (slow, bleed, stun) + **finisher** self spike (Euphoria) — not 1H-style self buffers.

## Row layout exception

**Five main rows (1–5)** + **five prof rows (6–10)** — no separate offchain. `<skillId>` row **1** only.

## Main chain (rows 1–5)

| Row | Hitbox (draft) | Job |
|---|---|---|
| 1 | Arc **75°**, **1.5** | Narrow opener — starter |
| 2 | Arc **160°** (reverse), **1.5** | Wide horizontal slice |
| 3 | **Circle**, **2** | Spin step — pivot beat |
| 4 | Arc **120°** (reverse from spin), **1.5** | Wave — keep string moving |
| 5 | Arc **200°**, **1.5** | **Finisher** — string **ends** (terminal) |

**Connect:** `1→2→3→4→5` on hit. Tuning: combo window, per-step CD curve — **playtest**.

## Prof rows (6–10)

| Row | Name | Effect |
|---|---|---|
| 6 | **Hamstring** | All mains: **−25%** move speed + **25%** chance **bleed** |
| 7 | **Moonshot** | Mainchain3: **+1** radius + **100%** **stun** (duration — tune at migration) |
| 8 | **Genocide** | All mains: **guaranteed crit** vs **bleeding** targets |
| 9 | **Euphoria** | Mainchain5 on hit: self buff — **move speed**, **crit**, **CDM** |
| 10 | **Bloodlust** | When **any** mainchain **crits:** apply devastating debuff — **unique bleed** + **stun** (separate state from row **6** bleed — no accidental double-dip) |

**Prof ladder:** **Hamstring** sets bleed → **Genocide** rewards bleeders → **Bloodlust** rewards crits (often via **Genocide**). **Moonshot** gates stun behind reaching row **3**.

## Archetype partners (draft)

**Natural:** Berserker, Skirmisher, War Priest (panels — not skill LST). **Friction:** Guardian (slow / GRD fantasy fights tempo).

## Weapon tags (migration)

- `<skillId:101>` row **1**

## Open (migration)

- [ ] Stun duration on **Moonshot**; bleed uptime vs **Genocide**
- [ ] **Bloodlust** unique bleed state id + stacking rules
- [ ] Inter-hit CD curve + combo window frames
- [ ] **Euphoria** buff durations / magnitudes

## Revision log

| Date | Note |
|---|---|
| 2026-06-03 | **Cleave lot locked:** 5× connect main, bleed/crit prof ladder, no offchain. |
