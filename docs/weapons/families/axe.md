# Axe (wtype 4)

> Index: [`../families.md`](../families.md) · Named drops: [`../main.md`](../main.md) · **Target skill IDs:** **91–120** · Stat lean: **MHP** (family); **2H skills ATK-only**
>
> **Planning:** [`../skill-lots.md`](../skill-lots.md) — **family complete**

Last updated: **2026-06-03**

---

## Family thesis

**Axe is three questions about weight:**

| Subgroup | Tempo | Question |
|---|---|---|
| **Hatchet** (1H) | **Slow** | How do I **outlast** while I chop? (self **buffers**) |
| **Glaive** (2H) | **Fast** | How do I **overwhelm** with tempo? (enemy bleed / crit) |
| **Mace** (2H) | **Deliberate** | How do I **unwrap** them for the **party**? (**−PDR** → **Exposed**) |

**Mace is the family's one blunt subgroup** — Hatchet and Glaive cut small and cut wide, and Mace does
not cut at all. It swings `Blunt` and carries `x Shields` on every rung, which is the mechanical form of
the `breaker` lot: its finisher is **SHATTER** and its first proficiency extension puts `<shieldDamage>`
on the whole main chain. Weapons are maces, picks and beaks — the things built to open armour rather
than get through it.

**Skill poison:** removed from **1H** skills by design; gear may still carry poison.

## Subgroups

| Subgroup | `wtypeId` | Doc | IDs | Status |
|---|---|---|---|---|
| **Hatchet** | 10 | [`axe/hatchet.md`](./axe/hatchet.md) | **91–100** | **Locked** |
| **Glaive** | 11 | [`axe/battleaxe.md`](./axe/battleaxe.md) | **101–110** | **Locked** |
| **Mace** | 12 | [`axe/breaker.md`](./axe/breaker.md) | **111–120** | **Locked** |

Subgroup doc filenames still carry their old names (`battleaxe.md`, `breaker.md`) and were left alone —
renaming them would break every cross-link in the tree for no gain.

## Revision log

| Date | Note |
|---|---|
| 2026-06-03 | **1H hatchet** locked (slow buffer, charge offchain). |
| 2026-06-03 | **2H battleaxe** locked (fast cleave, bleed/crit prof). |
| 2026-06-03 | **Breaker** locked (LLRL→SHATTER, Tenderizing→Exposed, party PDR shred). **Axe family planning complete.** |
