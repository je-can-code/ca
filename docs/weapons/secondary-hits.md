# Secondary hits — framing (living)

> **Purpose:** Player-facing model for the **second attack button** — not equipment slots. Implementation: `<offhandSkillId>` on weapon (or dual-wield mirror of the **same** chain).
>
> **Authoritative row tables:** [`skill-lots.md`](./skill-lots.md) (10 rows per subgroup).
>
> Last updated: **2026-06-04**

---

## Framing

| Button | FG read | Typical job |
|---|---|---|
| **Main hit** | Light/normal string | Rows **1–3** (dual: **1–4** on one chain) — faster CD rhythm |
| **Secondary hit** | Heavy / special | Rows **4–5** — chunkier, wider, longer CD — **or** same chain on 2nd CD (dual) |

Gear pins (`Moist Clip`, `<offhandEligible>` kit skills) remain assignable on top — optional layer.

**Prof:** may buff secondary only, whole kit, or main — per subgroup lot.

---

## Blade (planned)

| Subgroup | Secondary | Detail |
|---|---|---|
| **1H sharp** | Table Clearer → 360 Garnish (~5s+ CD) | [`skill-lots.md`](./skill-lots.md), [`families/blade/1h.md`](./families/blade/1h.md) |
| **2H beast** | Meat Tenderizer → charge **Fat Melter** | [`skill-lots.md`](./skill-lots.md), [`families/blade/2h.md`](./families/blade/2h.md) |
| **Dual twist** | **Same 4-hit chain** on second button (no separate offchain rows) | [`families/blade/dual.md`](./families/blade/dual.md) |

---

## Other families

| Subgroup | Secondary | Detail |
|---|---|---|
| **Gun pistol (gunfu)** | **Gun-fu** ammo — **B** replaces A, **−1 stack** per strong shot (**5 TP**) | [`families/gun/pistol.md`](./families/gun/pistol.md) |
| **Gun taser (conduit)** | Independent **nuke**; main = pin→flip→mash | [`families/gun/taser.md`](./families/gun/taser.md) |
| **Spear pierce** | Pin → gap-close **star** (~12s CD) | [`families/spear/stab.md`](./families/spear/stab.md) |
| **Spear mortar** | **Circle** (~8s CD); charge waves via prof | [`families/spear/basher.md`](./families/spear/basher.md) |
| **Spear rend** | **RIP** on nearest stacked target (~4 reach) | [`families/spear/javelin.md`](./families/spear/javelin.md) |
| **Gun shotgun (boomstick)** | **Reload** shells → buff main presses (**load to clap**) | [`families/gun/shotgun.md`](./families/gun/shotgun.md) |
| **Axe 1H (buffer)** | Charge → follow-up; buffers on **execution** | [`families/axe/hatchet.md`](./families/axe/hatchet.md) |
| **Axe 2H (cleave)** | **5-hit** main only (no offchain) | [`families/axe/battleaxe.md`](./families/axe/battleaxe.md) |
| **Axe breaker** | **LLRL** main → **SHATTER** off; party **−PDR** / **Exposed** | [`families/axe/breaker.md`](./families/axe/breaker.md) |
| *Remaining 6 subgroups* | Row tables TBD | [`skill-lots.md`](./skill-lots.md) |

---

## Revision log

| Date | Note |
|---|---|
| 2026-06-03 | FG framing; blade 1H/2H offchain. |
| 2026-06-04 | Dual exception documented; blade trio synced. |
| 2026-06-04 | Spear stab pierce offchain documented. |
| 2026-06-03 | Spear basher mortar: single circle offchain + charge prof tiers. |
| 2026-06-03 | Spear javelin rend: RIP offchain, stack ledger main (`freeCombo`). |
| 2026-06-03 | Gun pistol gunfu: Gun-fu stack transform offhand. |
| 2026-06-03 | Gun taser conduit: off-chain nuke; main pin→mash. |
| 2026-06-03 | Gun shotgun boomstick: reload shells buff main (`freeCombo`). |
| 2026-06-03 | Axe 1H buffer: charge→follow-up offchain. |
| 2026-06-03 | Axe 2H cleave: 5× main exception (no offchain). |
| 2026-06-03 | Axe breaker: 4+1 LLRL→SHATTER; Tenderizing party PDR shred. |
