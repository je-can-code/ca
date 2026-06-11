# Fist — Claw (bleed rakes)

> Parent: [`../fist.md`](../fist.md) · Skill lot: **gore** (IDs **161–170** when migrated)
>
> Full row table: [`../../skill-lots.md`](../../skill-lots.md#fist-claw--lot-gore-ids-161170-when-migrated)

Last updated: **2026-06-03**

---

## Identity

| | |
|---|---|
| **Fantasy** | **Messy claw rakes** — wide sloppy arcs, blood everywhere, not a budget 1H sword |
| **Verb** | **Connect** bleed string → **`freeCombo` pounce** gap-close → **360° blood sprinkler** |
| **Tempo** | Fast messy mains; offhand **pounce** on demand; **circle** is the room commit (Gambit capstone) |
| **Stat** | **ATK** · **CRI** · **ignore parry** (prof **8**) |
| **Theme** | **gore** (prof: Bloodthirst, Bloodfest, Bloodgambit, …) |

**Bleed:** **baseline on the whole kit** — stacking bleed on connect (not prof-gated like **sharp**). Prof escalates stacks, self buff, parry bypass, lottery kill, circle cashout.

**Connect only** on mains — no `<freeCombo>` on rows **1–3**. **Offchain row 4 (pounce)** uses `<freeCombo>` — gap-close to a target, not a blind hop.

**Loop (base):** rake string → pounce when you need range → **360°** when the room’s messy. Prof **6+:** every hit feeds **Bloodthirst**; prof **10:** **offchain2** circle **consumes Bloodthirst** for a defense-ignored nearby nuke.

## Bloodthirst (prof 6+)

| | |
|---|---|
| **Source** | **+1 stack** per hit from **any** kit row (**1–5**) |
| **Cap** | **10** stacks |
| **Per stack** | **+5% ATK**, **+5% AGI**, **−5% DEF** |
| **Spend** | Prof **10 Bloodgambit** — **offchain2** (row **5**) **purges all stacks** on use |

## Row layout

**Three main rows (1–3)** + **offchain A/B (rows 4–5)** + **five prof rows (6–10)** — same shape as **sharp** / **arm**.

**Weapon tags (migration):** `<skillId:161>` row **1**; `<offhandSkillId:164>` row **4**.

## Main chain (rows 1–3)

| Row | Hitbox (draft) | Job |
|---|---|---|
| 1 | Arc **150°**, **2** | Medium rake — **stacking bleed** |
| 2 | Arc **120°**, **2** (**reverse**) | Smaller reverse rake — **more bleed stacks** |
| 3 | Line **1.5** thick, **2** reach | Narrow finisher slash — **yet more bleed** |

**Main:** **connect** `1→2→3`. Escalating bleed per row (tune stacks at migration).

## Offchain (rows 4–5)

| Row | Hitbox (draft) | Job |
|---|---|---|
| 4 | **offchainA** — Line **0.5** thick, **4** reach | **Pouncing slash** — **`freeCombo`** gap-close; bleed |
| 5 | **offchainB** — Arc **360°**, **2** | **Circle slash** — bleed sprinkler; prof **10** **Bloodgambit** spend |

Prof **10 (Bloodgambit):** row **5** **consumes all Bloodthirst stacks**; add **100% + 10% per stack** damage to **nearby foes**, **defense ignored** (on top of base circle — tune at migration).

## Prof rows (6–10)

| Row | Name | Effect |
|---|---|---|
| 6 | **Bloodthirst** | All kit hits: **+1 Bloodthirst stack** (see above) |
| 7 | **Bloodfest** | All kit hits: **+1 bleed stack** on apply |
| 8 | **Bloodcircuit** | All kit: **ignore parry** entirely |
| 9 | **Bloodlet** | All kit: **2%** instant kill vs **bleeding** targets *(placeholder — revisit at migration)* |
| 10 | **Bloodgambit** | **Offchain2** (row **5**): purge **Bloodthirst** → **100% + 10%/stack**, def ignored, nearby |

## Archetype partners (draft)

**Natural:** Assassin / berserker bleed paths; **CRI** + glass (**−DEF** at high Bloodthirst). Contrast **sharp** (mobile sweep CD, bleed prof-gated) and **boomstick** (spread + shell clap).

## Open (migration)

- [ ] **Bloodthirst** state id, stack cap **10**, per-stack stat modifiers
- [ ] Baseline bleed chance / stack count per row (**1** < **2** < **3**)
- [ ] **Bloodlet** proc scope (all hits vs finisher/pounce only); boss immune
- [ ] **Bloodgambit** AOE radius + whether base circle damage still applies at **0** stacks
- [ ] Offchain **4** gap-close targeting rules; offchain **5** CD (~**5s+** target, **sharp** parallel)
- [ ] Row **2** **`arc-reverse`** juice motion

## Revision log

| Date | Note |
|---|---|
| 2026-06-03 | **Gore lot locked:** connect bleed mains, freeCombo pounce, Bloodthirst → Gambit circle spend; Bloodlet placeholder. |
