# Wand — Staff (2H magic stick)

> Parent: [`../wand.md`](../wand.md) · Skill lot: **aura** (IDs **121–130** when migrated)
>
> Full row table: [`../../skill-lots.md`](../../skill-lots.md#wand-2h-staff--lot-aura-ids-121130-when-migrated)

Last updated: **2026-06-03**

---

## Identity

| | |
|---|---|
| **Fantasy** | **Magic stick** — full of energy; Gandalf or Mother Theresa, it’s all magic |
| **Verb** | **Mid-range spray** on main; **charge → aura** on offhand (resource recovery + party buff spine) |
| **Tempo** | Main: **`<freeCombo>`** — three spray presses on rhythm; whiff doesn’t brick the next shot |
| **Stat** | **MAT** (moderate) + **MDF** (high on gear); **low MMP / MRG** baseline — offchain earns MRG back after casting |
| **Theme** | **aura** (prof: Nurturing aura, Fractal aura, Prism aura, …) |

**Charge semantics (global):** **charge skills fire on button release** — not channeling. Nothing “happens while you hold” except **guard** and **dash**. Row **4** = hold → release → buff states apply.

**Contrast siblings:** **Staff** = wide spray + sustain aura · **Wand** = glass-cannon bolts · **Tome** = **direct reads + cast-tempo artillery**.

## Row layout

**Three main rows (1–3)** + **one offchain row (4)** + **six prof rows (5–10)** — no offchain row 5.

**Weapon tags (migration):** `<skillId:121>` row **1**; `<offhandSkillId:124>` row **4**.

## Main chain (rows 1–3)

| Row | Job |
|---|---|
| 1 | Mid-range **spray(3)** — center bolt + **±45°** fan (`formation:spray`) |
| 2 | Same spray verb — tune reach / damage step at migration |
| 3 | Same spray verb — string finisher step |

**`<freeCombo>`** on all mains — alternate **1↔2↔3** on tempo, not connect gates.

**Baseline shape:** W fan per press (one straight, one **+45°**, one **−45°**). Legacy anchor: **Sommelier’s Pulse** (`formation:spray` on staff **61–62**).

## Offchain (row 4)

| Row | Job |
|---|---|
| 4 | **Charged aura** — **on release**, apply self buff states (**heavy MRG** baseline). Tune charge tier frames + CD at migration |

Prof rows **5**, **6**, **8**, **10** extend this release — same button, louder effects.

## Prof rows (5–10)

| Row | Name | Effect |
|---|---|---|
| 5 | **Nurturing aura** | Offchain1: also applies **HRG** |
| 6 | **Fractal aura** | Offchain1: **AOE** — **same buff bundle as self** applies to **all allies nearby** (not selfish) |
| 7 | **Enduring waves** | All mainchains: **+1s** projectile / wave **duration** |
| 8 | **Energetic aura** | Offchain1: also applies **TRG** |
| 9 | **Gigant waves** | All mainchains: **+0.5 knockback** |
| 10 | **Prism aura** | Offchain1: applies massive **elemental-typed shield** (magic elements: **heat / liquid / ground / air / energy / void** — not cut/poke/blunt). **Poppable** lifetime (tune ~**20s** band — long enough to matter, not eternal). **Explodes on shield break** (wire to existing shield-break pipeline + damage skill) |

**Shield policy:** player should **choose** when to eat a hit for the **break boom** — not a permanent shell.

## Loop (base)

**Spray** mid-range on **`freeCombo`** → when spent, **charge offhand** → **release aura** (MRG recovery) → back to spray. Prof adds **HRG**, **party share**, **longer waves**, **TRG**, **knockback**, **prism shield capstone**.

## Archetype partners (draft)

**Natural:** War Priest, Runic Orb (shield break), caster-lean panels without locking wand/tome. **Party-facing** without heal rows — buff aura only; real Medic verbs live on **future class tree**.

## Open (migration)

- [ ] Spray proximity / duration / MP cost per main row
- [ ] Offchain charge tier frames + aura state ids (MRG / HRG / TRG rates)
- [ ] **Fractal aura** ally range + state mirroring rules
- [ ] **Prism aura** shield magnitude, element from gear, break explosion skill + formula
- [ ] Main CD policy with **`freeCombo`** (per-skill vs shared gate)

## Revision log

| Date | Note |
|---|---|
| 2026-06-03 | **Aura lot locked:** spray mains + charge→aura offchain, prof ladder 5–10. **Charge = on release only.** |
