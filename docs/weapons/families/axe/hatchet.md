# Axe — 1H Hatchet

> Parent: [`../axe.md`](../axe.md) · Skill lot: **buffer** (IDs **91–100** when migrated)
>
> Full row table: [`../../skill-lots.md`](../../skill-lots.md#axe-1h-hatchet--lot-buffer-ids-91100-when-migrated)

Last updated: **2026-06-03**

---

## Identity

| | |
|---|---|
| **Fantasy** | **Slow face-tank chopper** — heavy swings, charge execute, **buffer** on delivery |
| **Verb** | Connect main string; offchain = **charge → follow-up** (+ prof tier‑2 **Calamity**) |
| **Tempo** | **Slow** inter-hit CDs + **end-of-string pause** (contrast **2H** fast chain) |
| **Stat** | **MHP** (+ ATK in formulas) |
| **Theme** | **buffer** (prof: Healthy / Stalwart / Calamity …) |

**Poison:** **deliberately not** on skills (placeholder removed). **Gear** may still carry poison typing.

**Buffers:** apply on **skill execution** (hit/delivery) — **not** on charge wind-up.

## Main chain (rows 1–3)

| Row | Hitbox (draft) | Job |
|---|---|---|
| 1 | Arc **135°**, **2.5** radius | Regular chop — starter |
| 2 | **360°** circle, **2.5** radius | Room clear slash |
| 3 | Narrow arc **75°**, **2.5** radius | Strong precision finisher |

**Connect only** — `1→2→3` on hit. **No `<freeCombo>`**.

## Offchain (rows 4–5)

| Row | Hitbox (draft) | Job |
|---|---|---|
| 4 | Arc **90°**, **3.5** radius | Quick power chop — tap to fire |
| 5 | Arc **90°**, **3.5** radius | Charged heavy chop — hold row **4** to charge |

**Charge:** hold on row **4**; **does not require landing row 4**. Charge CD is separate (self-limiting).

**Prof row 10 (Calamity buffer):** row **4** gains **tier‑2** charge → **75°**, **5** radius — **long CD**, **big** damage/reach (capstone “atmosphere cleave”).

## Prof rows (6–10)

| Row | Name | Effect |
|---|---|---|
| 6 | Healthy buffer | Offchain1 on **execution:** **+33% MHP** (self, brief) |
| 7 | Reaching chop | All mainchains: **+1** radius |
| 8 | Deflecting chop | Mainchain3 on **execution:** **1 HP** `<shieldProtect>` shield (soak one hit — any scale) |
| 9 | Stalwart buffer | Offchain2 on **execution:** **−50% PDR/MDR** (self, short — loud, intentional) |
| 10 | Calamity buffer | Offchain1: **charge tier 2** — very strong long-range cleave; **long CD** |

## Weapon tags (migration)

- `<skillId:91>` row **1**
- `<offhandSkillId:94>` row **4** (charge starter)

## Open (migration)

- [ ] Buffer **durations** (Healthy, Stalwart, MHP %)
- [ ] Calamity tier‑2 CD separate from tap charge
- [ ] Main inter-hit CD + end-of-string delay tuning

## Revision log

| Date | Note |
|---|---|
| 2026-06-03 | **Buffer lot locked:** slow connect main, charge offchain, execution buffers, no skill poison. |
