# Fist — Glove (boxing)

> Parent: [`../fist.md`](../fist.md) · Skill lot: **flow** (IDs **151–160** when migrated)
>
> Full row table: [`../../skill-lots.md`](../../skill-lots.md#fist-glove--lot-flow-ids-151160-when-migrated)

Last updated: **2026-06-03**

---

## Identity

| | |
|---|---|
| **Fantasy** | **Boxing** — left/right strings, cross-hand buffs, **Flow** on finishers until the lights go out |
| **Verb** | **L1–L3** (main) + **R1–R3** (offhand); **L-boost** / **R-boost** ping-pong; **Flow** recurses on **L3** / **R3** **independently** |
| **Tempo** | Fast **line** jabs/straights; finishers **recurse to self**; weave **L↔R** for empowered alternating hits |
| **Stat** | **ATK** · **AGI** (prof **9**) · **LST** on cross-hand boosts |
| **Theme** | **flow** (prof: Double fisting, Ka-fisting, …) |

**Not main/offchain split** — **six action rows**: **left hand (1–3)** + **right hand (4–6)**. One prof track; **dual-wield** wiring: `<skillId:151>` row **1**, `<offhandSkillId:154>` row **4**.

**Flow gate:** **per hand** — no “both sides at 3” requirement. **Left** can Flow on **L3** without **R**; **right** can Flow on **R3** without **L**. Incentive: **alternate** so **R-boost** / **L-boost** empower the next opposite-hand hit (**+30%**).

**Connect** within each hand chain (tune gates at migration).

## Cross-hand boosts (base)

| State | Applied by | Effect (~**1s**) |
|---|---|---|
| **R-boost** | **L1–L3** | Opposite hand (**R1–R3**): **+30% damage** · **LST** (sustain — working the body) |
| **L-boost** | **R1–R3** | Opposite hand (**L1–L3**): **+30% damage** · **LST** |

Prof **8 (Familiar fisting):** **+1 stack** when L/R boosts are applied — longer **LL-R** / **RR-L** phrases.

## Flow state (L3 / R3 recurse)

| | |
|---|---|
| **Source** | **Left3** or **Right3** while recursing to self — **independent** per side |
| **Stack** | **+10% ATK**, **+5 TCR** per stack · **~2s** · **no cap** |
| **Cost** | Higher **TCR** while grinding finishers — TP bill on infinite |

Prof **7 (Double fisting):** **L3** / **R3** **+1 hit**.

Prof **9 (Rage fisting):** **All** L/R punches apply the **same** stacking **Rage** buff — **+3% ATK**, **+3% AGI** per stack, **no cap** (both hands feed **one** Rage stack, unlike cross-hand L/R boosts).

Prof **10 (Ka-fisting):** **L3** / **R3** also apply **unique** cross-boost variants — **stacks with** normal boosts + Flow + Rage:

| Finisher | Ka-boost to opposite hand |
|---|---|
| **L3** | **+3 hits**, **+100% HIT** (accuracy) |
| **R3** | **Guaranteed crit**, **+100% crit damage** |

## Row layout

**Left (rows 1–3)** + **Right (rows 4–6)** + **four prof rows (7–10)**.

## Left hand (rows 1–3)

| Row | Job | Hitbox (draft) |
|---|---|---|
| 1 | **Left jab** — applies **R-boost** | Line **1** thick, **1.1** reach |
| 2 | **Left straight** — applies **R-boost** | Line **1** thick, **1.3** |
| 3 | **Left flow** — **recurse to self**; **Flow** stack; **R-boost** | Line **1** thick, **1.5** |

## Right hand (rows 4–6)

| Row | Job | Hitbox (draft) |
|---|---|---|
| 4 | **Right jab** — applies **L-boost** | Line **1** thick, **1.1** |
| 5 | **Right straight** — applies **L-boost** | Line **1** thick, **1.3** |
| 6 | **Right flow** — **recurse to self**; **Flow** stack; **L-boost** | Line **1** thick, **1.5** |

## Prof rows (7–10)

| Row | Name | Effect |
|---|---|---|
| 7 | **Double fisting** | **L3** / **R3**: **+1 hit** |
| 8 | **Familiar fisting** | L/R cross-boosts: **+1 stack** when applied |
| 9 | **Rage fisting** | All L/R punches: shared **Rage** stack (**+3% ATK**, **+3% AGI**, no cap) |
| 10 | **Ka-fisting** | **L3** / **R3**: ka-boost to opposite hand (**HIT** vs **crit** — see above); stacks with other buffs |

## Loop (base)

**L1→L2→L3** (Flow grind) ↔ weave **R** while **R-boost** live → **R1→R2→R6** (Flow grind) ↔ back to **L** with **L-boost**. Cross-buffs = **+30%** + **LST** on empowered side. Prof adds hits, stacks, Rage snowball, ka capstones.

## Open (migration)

- [ ] **L-boost** / **R-boost** / **Flow** / **Rage** / **Ka-boost** state ids + duration/stack rules
- [ ] **`skillTransform`** or per-hand combo chains (L **1→2→3→3**, R **4→5→6→6**)
- [ ] Cross-hand damage multiplier application on opposite-row skills
- [ ] **LST** magnitude on L-boost / R-boost
- [ ] **TCR** +5 per Flow stack implementation

## Revision log

| Date | Note |
|---|---|
| 2026-06-03 | **Flow lot locked:** L/R 3+3, cross-boost + LST, independent Flow recurse, prof 7–10. |
