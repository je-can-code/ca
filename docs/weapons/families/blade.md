# Blade (wtype 1)

> Index: [`../families.md`](../families.md) · Named drops: [`../main.md`](../main.md) · **Target skill IDs:** **1–30** (three 10-row lots) · Stat lean: **ATK**
>
> **Planning (locked):** [`../skill-lots.md`](../skill-lots.md) · FG framing: [`../secondary-hits.md`](../secondary-hits.md)

Last updated: **2026-06-04**

---

## Family thesis

**Blade is cutting *style* — three answers to “how do I relate to melee danger?”**

Not “sword but bigger.” Kitchen-cut naming (Rough Chop, Julienne, etc.) is the family voice: **controlled aggression earned through sequence**, not one button.

## Family principle

**All three blade subgroups are viable main paths** — none objectively worse than the others as a full-time choice. Each has a **correct way to play**; mastery feels clever, misuse feels punished — that's healthy. **Viable ≠ forgiving.**

## Subgroups (target lots)

| Subgroup | Doc | IDs | Theme | One-line job |
|---|---|---|---|---|
| **1H** | [`blade/1h.md`](./blade/1h.md) | **1–10** | **sharp** | Tight 3-hit main; **wide sweep → circle** on secondary (~5s+ CD) |
| **2H** | [`blade/2h.md`](./blade/2h.md) | **11–20** | **beast** | **Wide** 3-hit cleave main; **stun → charge Melter** secondary — **stun lord** |
| **Dual** | [`blade/dual.md`](./blade/dual.md) | **21–30** | **twist** | **4-hit** chain, **two buttons / one prof track**; prof = blender depth |

### How the three blades differ (planned)

| | **1H sharp** | **2H beast** | **Dual twist** |
|---|---|---|---|
| **Main** | Narrow arcs (100→120→120) | Wide arcs (210→240→270) | 4 hits, widening arcs → circle |
| **Secondary** | 210° → 360° (long CD) | 90° long stun → charge 180° execute | *Same chain* on 2nd button |
| **Charge** | None | Offchain only (Melter) | None |
| **Prof hook** | Bleed / sweep range | Stun → execute ladder | Hit count, radius, **%target max HP** chip |
| **Reach** | Longest blade reach (main) | Whale arcs | ~0.9 tile base; Spatia ≈1.45 — still shortest |

**Legacy shipped IDs** (pre-migration): 1H **1–6**, 2H **7–10**, dual **11–15** — see subgroup docs for playtest notes.

## Playtest summary (Jeremy — pre-migration)

| Subgroup | Felt identity | Why it wins / loses *today* |
|---|---|---|
| **1H** | Mobile skirmisher | Wins vs undertuned 2H; neutral path when dual is element-countered |
| **2H** | Slow cleave | **"1H but slower"** until stun/execute on secondary at minute 0 |
| **Dual** | Blender (two CDs) | System strong; mine heat/liquid counters push back to 1H |

**After migration:** balance pass against **planned** identities above — not legacy numbers alone.

## Skill lots

**Blade planning complete** for all three subgroups — [`../skill-lots.md`](../skill-lots.md).

## Backlog (migration — not started)

- [ ] Remaining **15** subgroups × 10 rows, then **one** migration pass (**1–180** + relocate kit bands)
- [ ] Implement blade lots in `Skills.json`, weapons, `config.proficiency.json`
- [ ] Playtest: 2H stun-immune content; dual **~25% max HP** ceiling on full connect; 1H secondary CD

## Revision log

| Date | Note |
|---|---|
| 2026-06-03 | Playtest notes; 2H/dual/1H diagnosis. |
| 2026-06-04 | **All three blade 10-row lots locked** (sharp / beast / twist); family comparison table. |
