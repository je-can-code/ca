# Fist — Arm (cyber wrestler)

> Parent: [`../fist.md`](../fist.md) · Skill lot: **dirty** (IDs **171–180** when migrated)
>
> Full row table: [`../../skill-lots.md`](../../skill-lots.md#fist-arm--lot-dirty-ids-171180-when-migrated)

Last updated: **2026-06-03**

---

## Identity

| | |
|---|---|
| **Fantasy** | **Cyber wrestler** — slow slams, **Grab Ready!**, dirty nut kicks |
| **Verb** | Connect **slam string** → short **Ready** → **offchainB** nut; **offchainA** roundhouse when not Ready |
| **Tempo** | **Slow** connect mains; **~1s** buff window per slam — pistol grammar, fighting-game timing |
| **Stat** | **ATK** + **DEF** (bruiser) |
| **Theme** | **dirty** (prof: Collateral damage, Needlessly dirty, …) |

**Pistol parallel (`gunfu`):** rows **4–5** are **offchainA / offchainB**; one `<offhandSkillId>` on row **4** with **`skillTransform`** to row **5** while **Grab Ready! ≥ 1**. Buff is **~1s** per main connect (not “until spent” like Gun-fu).

**Loop (base):** slam → **nut kick** → slam → **nut kick** → slam → **nut kick**. No Ready → row **4** **roundhouse** only.

**Loop (prof 10):** slam → **both-feet nut** (**Violation Ready!**, consumes Violation) → **Grab Ready!** still up → **nut kick** (consumes Grab).

**Connect only** on mains — no `<freeCombo>`.

## Grab Ready! / Violation Ready!

| State | Source | Duration / cap |
|---|---|---|
| **Grab Ready!** | Each **mainchain** connect | **~1s**; **1 stack** base |
| **Grab Ready!** (prof **7**) | **Intentionally dirty** | **+1 stack** — two nut windows or one forgiving window |
| **Violation Ready!** | Each main connect (prof **10**) | **Cap 1**; **priority** over Grab for offchainB resolve |

**Offhand resolve (one button):** **Violation** both-feet nut → else **Grab** nut → else **roundhouse** (row **4**).

## Row layout

**Three main rows (1–3)** + **offchain A/B (rows 4–5)** + **five prof rows (6–10)** — same shape as **pistol gunfu**.

**Weapon tags (migration):** `<skillId:171>` row **1**; `<offhandSkillId:174>` row **4** (transforms to row **5** when **Grab Ready!** / Violation rules apply).

## Main chain (rows 1–3)

| Row | Hitbox (draft) | Job |
|---|---|---|
| 1 | Arc **90°**, **2** | **Over-arm slam** |
| 2 | Arc **150°**, **2.5** | **Full-body lariat** |
| 3 | Arc **120°**, **2.5** | **Cross-arm slam** — prof **8**: **100% stun** |

Each connect: **+Grab Ready!** (prof **10** also **+Violation Ready!**).

## Offchain (rows 4–5)

| Row | Hitbox (draft) | Job |
|---|---|---|
| 4 | **offchainA** — Arc **180°**, **1.5** | **Half roundhouse** — default offhand |
| 5 | **offchainB** — Arc **45°**, **2.5** | **Nut obliteration** — while **Grab Ready!**; **−1 Grab stack** on use |

Prof **9 (Full house):** **offchainA** → **360°**, **+50% damage**.

Prof **10 (Needlessly dirty):** while **Violation Ready!**, **offchainB** → **both-feet nut** (preposterous damage); **consumes Violation**, **Grab Ready!** remains → second press can **nut kick**.

## Prof rows (6–10)

| Row | Name | Effect |
|---|---|---|
| 6 | **Collateral damage** | All mains: **+500% damage to shields** |
| 7 | **Intentionally dirty** | **+1 Grab Ready!** stack per application |
| 8 | **Heavy duty** | Mainchain3: **100% stun** |
| 9 | **Full house** | OffchainA: **360°**, **+50% damage** |
| 10 | **Needlessly dirty** | Mains apply **Violation Ready!**; **both-feet nut** on offchainB (priority); leaves **Grab Ready!** for follow-up nut |

## Archetype partners (draft)

**Natural:** Berserker, Guardian-lean DEF bruiser; **stun** + **shield break** (+500% shields). Fist family **fighting-game Ready → special** anchor.

## Open (migration)

- [ ] **Grab Ready!** / **Violation Ready!** state ids, **~1s** decay, stack cap
- [ ] **`skillTransform:[174,175]`** (or equivalent) + Violation variant on row **5**
- [ ] Main/offchain CD tune (slow truck swings)
- [ ] Both-feet nut VFX / hit count at migration (“ask about the physics”)

## Revision log

| Date | Note |
|---|---|
| 2026-06-03 | **Dirty lot locked:** 3+2+5 pistol grammar, Grab Ready! → nut, prof 10 Violation double-kick line. |
