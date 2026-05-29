# SDP implementation status

> **Living doc.** Update this when runtime, editor, or CA data changes so design sessions
> do not rely on stale chat memory. Pair with [`work-items.md`](./work-items.md) (backlog)
> and [`archetype-mapping.md`](./archetype-mapping.md) (design).

Last updated: **2026-05-29** — policy: **finish all plugin/engine work before P4 content authoring.**

---

## Shipped (runtime — `rmmz-plugins`)

| Area | Status | Notes |
|---|---|---|
| **Parameter registry** (`J-Base`) | ✅ | `ParameterRegistry`, `Game_Battler.parameter(key)`, CMS status reads catalog keys. |
| **SDP config shape** | ✅ | Nested `identity` / `progression` / `mastery`; panel rows use string `parameterKey`. |
| **Subgroups** | ✅ | `config.sdp.json` → `subgroups[]`; panel `mastery.subgroupKey` + `subgroupTier`. |
| **Families** | ✅ | `families[]` group `subgroupKeys[]`; panel family **derived** (not stored on panel). In-game **family strip**; L2/R2 cycle (All → Unknown → families with unlocked panels). |
| **Passive affix ext** | ✅ | Renamed from `J-Passive-ABS` → **`J-Passive-Affix`** (`J.PASSIVE.EXT.AFFIX`); enemy prefix/suffix RNG + tier presentation. |
| **Passive conditional ext** | ✅ scaffold | `J-Passive-Conditional` — HP threshold rules + passive refresh hook (v1.0.0). |
| **Mastery enrollment vs skill** | ✅ | `enrolledInSubgroup()` vs `grantsMasterySkill()`. Tier contest only among panels with `masterySkillId > 0`. Org-only higher tiers do not strip lower mastery skills. |
| **Family boot policy** | ⏳ | Unassigned subgroup → **Unknown** at runtime. **TODO:** throw at boot when CA hits **1.0.0** if any registered subgroup lacks a family. |

**PR (2026-05):** `feature/sdp-families-parameter-registry` — rmmz-plugins #65, ca #55, jmz-data-editor #11.

---

## Shipped (editor — `jmz-data-editor`)

| Area | Status | Notes |
|---|---|---|
| **Subgroups tab** | ✅ | Author subgroup rows; panel mastery picks subgroup. |
| **Families tab** | ✅ | Multiselect subgroups per family; Go API `families[]` round-trips. |
| **Registry parameter picker** | ✅ | SDP panel parameters include **Registry Parameters** (lst, mst, sar, gdr, …). |
| **Derived family on panel** | ✅ | Read-only on Mastery when subgroup set. |

---

## Phase 0 parameters — registry keys & combat wiring

Registry keys live in `ParameterKeys.LEGACY_LONG_PARAM_TO_KEY` (`rmmz-plugins`). Design doc names **SHA/SHE** map to runtime **`sar` / `ser`**.

| Key | Id | Combat / runtime | SDP panels | Playtest |
|---|---|---|---|---|
| **lst** | 35 | ✅ `ResourceHitManager` — `floor(hpDamage × lst)` HP to **attacker** on hit w/ `hpDamage > 0` | ✅ picker | ✅ **2026-05-29** |
| **mst** | 36 | ✅ same hook → MP | ✅ picker | ✅ (same path as LST) |
| **tst** | 37 | ✅ same hook → TP | ✅ picker | ✅ **2026-05-29** |
| **sar** | 38 | ✅ Shield apply multiplier (`JABS_Shield`) | ✅ picker | — |
| **ser** | 39 | ✅ Shield receive multiplier | ✅ picker | — |
| **apr** | 40 | ✅ `ApManager.gainAp()` × `actor.apr` | ✅ picker | — |
| **gdr** | 41 | ✅ `<goldMultiplier>` notetags + party sum + **SDP panel bonus** | ✅ picker | — |
| **dor** | 42 | ✅ same pattern as gdr for drop multiplier | ✅ picker | — |
| **msb** | 31 | ✅ Speed plugin | ✅ picker | — |
| **prof** | 32 | ✅ Proficiency plugin | ✅ picker | — |
| **sdr** | 33 | ✅ SDP multiplier | ✅ picker | — |
| **hcr** | 43 | ✅ HP cost reduction (Resources) | ✅ picker | — |

### LST / MST / TST — notetag reference

**Tags:** `<lst:N>`, `<mst:N>`, `<tst:N>` — **N** = percent points (summed, then ÷ 100).  
`<lst:25>` → rate `0.25` → recover 25% of **HP damage dealt** as HP/MP/TP (not crit-style pseudo-%).

**Hook:** `J-Resources-ABS` → `JABS_Engine.postPrimaryBattleEffects` → `ResourceHitManager.applyOnAttackEffects`.  
Requires **`isHit()`** and **`hpDamage > 0`**. Steal applies to the **attacker**, not the target.

**Notetag sources** (anything in attacker `getAllNotes()`):

| Source | Actors | Enemies |
|---|---|---|
| Database row (actor / enemy) | ✅ | ✅ |
| Class | ✅ | — |
| Equipped weapons / armors | ✅ | — |
| States (incl. passive plugin states) | ✅ | ✅ |
| Learned skills (skill note on known skills) | ✅ | ✅ |
| Party passive states | ✅ (actors) | — |
| **SDP panel rank** | ✅ actors only (`getSdpBonusForParameterKey`) | ❌ |

**Not on:** target being hit; skills as the damage packet (use `<on-attack-*-gain>` on skills for separate on-hit resource tags).

**Authoring:** prefer **% growth** panel rows for lst/mst/tst (rates, not flat ATK-sized numbers).

---

## Phase 1 mastery — partial

| Item | Status |
|---|---|
| Subgroup + tier on panels | ✅ |
| Highest tier **mastery skill** wins within subgroup | ✅ |
| Subgroup enrollment without `masterySkillId` | ✅ valid (org hierarchy only) |
| Mastery **passive state** on max rank | ❌ not implemented (P1 / P4) |
| Mastery no-op UI feedback | ❌ deferred design pass |
| Panel respec | ❌ P1-2 |

---

## Plugin completion roadmap (before any P4 content)

**Policy:** no panel rework, mastery state DB rows, or map placement until runtime + editor can express the full archetype design.

### Tier A — SDP core loop (do first)

| # | Item | Work items | Notes |
|---|---|---|---|
| A1 | **P2 conditional modifier plugin** | P2-1 | Tag-driven “apply state / trait while condition”. Covers HP%, proximity, debuff stacks, damage gap, etc. **Blocks most mastery passives.** |
| A2 | **P1-2 panel respec** | P1-2 | `rankDownPanel`, refund SDP points, scene UX; cost model TBD. |
| A3 | **CMS registry breakdowns** | — | `Window_StatusStatBreakdown`: lst, mst, tst, sar, ser, apr, gdr, dor, hcr still “No breakdown”. |
| A4 | **Mastery UX polish** | P1-1 tail | No-op feedback when tier contest changes nothing; optional archetype hint on SDP scene (backlog). |

**Mastery passive states:** no separate SDP grant hook — max rank → **mastery wrapper skill** → **J-Passive** applies state(s). P2 makes those states *conditional*; authoring states/skills is P4-2 (content, after plugins).

### Tier B — P3 archetype hooks (build before content; order by mastery dependency)

Survey [`work-items.md`](./work-items.md) P3-1…P3-12. Build when a planned mastery passive needs it; suggested batch:

1. **P3-10 heal-event hooks** — Cleric/Medic/Emotion/Jelly masteries
2. **P3-1 on-crit state apply** — Cobra Venom Strike
3. **P3-5 resistance piercing** — Elemental Saturation
4. **P3-9 shield-break explosion** — Runic Orb (hook may exist)
5. Remaining P3 as masteries are scoped (skill history, viral debuff, AoE scale, pixel movement-to-damage, cast-time scale, MP shield, item splash, single-target hit inference)

### Tier C — Gates & satellite (can slip to 1.0.0 / parallel)

| Item | Notes |
|---|---|
| Family boot throw | `_pluginMetadata.js` TODO — unassigned subgroup → throw at CA 1.0.0 |
| Inanimate enemies no EXP/SDP | `.backlog/unstarted/inanimate-enemies-no-exp-sdp-rewards.md` |
| Natural SDP+ reward bug | `.backlog/unstarted/natural-sdp-plus-reward-bonus-bug.md` |

### Explicitly deferred until plugins done

- **P4-1** panel stat rework (~100+ panels)
- **P4-2** mastery states/skills in DB
- **P4-3** enemy map placement

---

## Next engineering (suggested order)

1. **P2 conditional stat modifier** — design notetag schema + tick/eval hook in ABS.
2. **P1-2 respec** — parallel once cost model decided.
3. **CMS breakdown** for registry keys (lst, gdr, …).
4. **P3 hooks** — batch per mastery dependency list above.
5. **Then** P4 content (`config.sdp.json`, States.json, maps).

---

## Deferred / backlog pointers

- Conditional stat modifier plugin (P2) — mastery passives
- Archetype panel rework at scale (P4-1)
- Boot throw: every subgroup must belong to a family (CA 1.0.0)
- See [`.backlog/unstarted/`](../../../rmmz-plugins/.backlog/unstarted/) in `rmmz-plugins` for plugin-level ideas
