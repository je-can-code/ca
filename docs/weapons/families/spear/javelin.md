# Spear — Javelin (throw)

> Parent: [`../spear.md`](../spear.md) · Skill lot: **rend** (IDs **51–60** when migrated) · Named: **Fish Eater** ([`../../main.md`](../../main.md))
>
> Full row table: [`../../skill-lots.md`](../../skill-lots.md#spear-javelin--lot-rend-ids-5160-when-migrated)

Last updated: **2026-06-03**

---

## Identity

| | |
|---|---|
| **Fantasy** | **Throw throw throw** — stack spears on a target, then **RIP** for a scaling payoff |
| **Verb** | Main = **stack ledger**; off = **rend** (cash out stacks at close range) |
| **Tempo** | Main: **`<freeCombo>`** two-throw loop; offchain: **high CD** RIP (tune at migration) |
| **Stat** | **AGI** (family lean) — damage tuning at migration |
| **Theme** | **rend** (prof names: RIP of …, Flight of the RIP, …) |

**Combo model:** not a 1-2-3 melee string. The “combo” is **pressure** — keep connecting throws to **add and refresh stacks**, then **RIP** when ready.

**Not baseline identity:** stacked crit on every throw; legacy **slayer typing** on skills (moved off kit — named gear may still carry typing).

## Row layout exception

**Two main rows (1–2)** + **one offchain row (3)** + **seven prof rows (4–10)** — no rows 4–5 offchain pair.

**Weapon tags (migration):** `<skillId:51>` row **1**; `<offhandSkillId:53>` row **3** (RIP).

## Stack state (“spear stuck”)

**On mainchain connect:** **+1 stack** on that target; **refresh** stack decay (each hit adds one and resets the decay clock).

**Baseline (no Limitless prof):**

| Rule | Value |
|---|---|
| **Cap** | **10** stacks |
| **Decay** | If you **stop landing throws**, stacks drop **one at a time** — **~3s** per stack (prof **Endurance** → **~6s**) |

**With RIP of the Limitless (row 6):** **no stack cap** — timer runs longer, but **all stacks fall off at once** if you goof (reward **constant pressure**, punish idle).

**RIP (row 3):** targets **nearest target with stacks** in range — **direct**, **~4** reach; **removes all stacks** on connect; deals **25% damage per stack** removed (baseline cap **10** → **250%** scaling before prof math). **Persevering RIP** removes **half** only.

## Main chain (rows 1–2)

| Row | Hitbox (draft) | Job |
|---|---|---|
| 1 | Line **8**, **0.2** | Thin throw — **+1 stack** on hit |
| 2 | Line **8**, **0.2** | Thin throw, **faster** (shorter duration / CD at migration) — **+1 stack** |

**`<freeCombo>`** on both — alternate **1↔2** on tempo, not connect gates.

## Offchain (row 3)

| Row | Job |
|---|---|
| 3 | **RIP** — nearest **stacked** target, **~4** range, **direct**; **25%/stack** damage; clears stacks (see above) |

## Prof rows (4–10)

Prof unlock follows **global numeric row order** (4 → 5 → … → 10).

| Row | Name | Effect |
|---|---|---|
| 4 | RIP of Endurance | Stack decay **~3s → ~6s** per stack (one-at-a-time model) |
| 5 | Flight of the RIP | Mainchains: **+25% projectile duration** (range **8 → ~10**) |
| 6 | RIP of the Limitless | **No stack cap**; **all stacks drop at once** on decay failure |
| 7 | Persevering RIP | RIP removes **half** of stacks (round policy at migration) |
| 8 | RIP of duality | Mainchains throw **two spears** at once |
| 9 | Chain RIP | RIP **splashes** (**~3** radius); splash onto another **stacked** target **chains** (max hops at migration) |
| 10 | RIP of penetration | Mainchains **pierce** — still **+1 stack per enemy** hit |

## Loop (base)

Throw loop on **`freeCombo`** to build/refresh stacks → step into **~4** tile RIP range → **RIP** nearest stacked target → repeat. Prof deepens decay window, range, cap mode, partial rip, stack rate, chain detonation, lane stacking.

## Open (migration)

- [ ] Custom stack state + HUD (per-target count)
- [ ] RIP **cooldown** (high)
- [ ] Chain RIP: max hops / one detonation per target per cast
- [ ] Damage formula base (AGI/ATK coefficients)
- [ ] Limitless: global decay duration vs per-stack Endurance interaction

## Revision log

| Date | Note |
|---|---|
| 2026-06-03 | **Rend lot locked:** stack ledger + RIP, 2× main + RIP off, seven prof extends. |
