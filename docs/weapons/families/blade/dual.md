# Blade — Dual (dual-wielded swords)

> Parent: [`../blade.md`](../blade.md) · Skill lot: **twist** (IDs **21–30** when migrated) · Named: **Agility** & **Power** ([`../../main.md`](../../main.md))
>
> Full row table: [`../../skill-lots.md`](../../skill-lots.md#blade-dual--lot-twist-ids-2130-when-migrated)

Last updated: **2026-06-04**

---

## Identity

| | |
|---|---|
| **Fantasy** | Blender — overwhelm with overlapping flurries |
| **Verb** | **One** chain (4 hits, widening arcs → circle); **two buttons**, two CDs |
| **Tempo** | Fastest blade line; positive `speedBoost` on dual gear |
| **Stat** | ATK |
| **Downside** | Short reach (~**0.9** tile base); elemental gear can hard-counter wrong content |
| **Theme** | **twist** |
| **System** | **Dual-wield** — equip two blades, **no** `<offhandSkillId>` on main weapon |

## Main chain only (rows 1–4)

| Row | Arc / shape | Notes |
|---|---|---|
| 1 | ~180° wide arc | Short range |
| 2 | ~210° | |
| 3 | ~240° | |
| 4 | **Circle** | Chain ends — replaces old charge → Centrifugal Blender |

**Runtime:** main and secondary buttons both start row **1**; **one** prof pool for rows **1–4**.

**Reach:** base ~**0.9** tiles; **Twist of Spatia** (+50% radius) ≈ **1.45** tiles — still under 1H / 2H.

**Removed:** Twist Garnish charge → Centrifugal Blender.

**Weapon tags (migration):** both hands `<skillId:21>` (row 1 starter) — no offhandSkillId on dual weapons.

## Prof rows (5–10)

| Row | Name | Effect |
|---|---|---|
| 5 | Twist of Momentum | **+15% move speed** |
| 6 | Twist of Gemini | All mainchains: **2× hits** per swing |
| 7 | Twist of Fates | Mainchain4: **guaranteed crit** |
| 8 | Twist of Spatia | All mainchains: **+50% radius** |
| 9 | Twist of Stiletto | Formula rewrite: add **1% target max HP** per hit (see below) |
| 10 | Twist of Trine | All mainchains: **3× hits** per swing |

### Stiletto formula (row 9)

Chip vs armored / high-DEF bosses — **not** instant kill:

```text
before: (a.atk*2 - b.def*1)
after:  ((a.atk*2 + b.mhp*0.01) - b.def*1)
```

`b.mhp` = **target** max HP. DEF still matters on the ATK portion; the **0.01×mhp** slice keeps dual **relevant** on chonky targets.

**Balance watch:** full connect with Trine (3 hits/swing) × 4 chain × two overlapping tracks → **~20–25% max HP** on one target in a burst window.

**Gemini → Trine:** author so row 10 reaches **3× total**, not accidental 4× stack.

## Design questions (content)

- [ ] Neutral physical dual at tier 1–2 vs elemental-only early?
- [ ] Base combo neutral damage; element from weapon only?
- [ ] Off-hand mixing (Agility + Power)?

## Open (migration)

- [ ] Name rows 1–4 (Julienne lineage vs new)
- [ ] Stiletto / Trine boss tuning
- [ ] `bonus-hits` ladder for rows 6 + 10

## Revision log

| Date | Note |
|---|---|
| 2026-06-03 | **10-row twist lot**; charge cut; one prof track. |
| 2026-06-04 | Stiletto formula; range math; prof table; weapon tags. |
