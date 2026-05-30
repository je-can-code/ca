# SDP implementation status

> **Living doc.** Update this when runtime, editor, or CA data changes so design sessions
> do not rely on stale chat memory. Pair with [`work-items.md`](./work-items.md) (backlog)
> and [`archetype-mapping.md`](./archetype-mapping.md) (design).

Last updated: **2026-05-30** — policy: **finish all plugin/engine work before P4 content authoring.**

> See **Tag authoring reference** at the bottom of this file for full notetag cookbook.

---

## Shipped (runtime — `rmmz-plugins`)

| Area | Status | Notes |
|---|---|---|
| **Parameter registry** (`J-Base`) | ✅ | `ParameterRegistry`, `Game_Battler.parameter(key)`, CMS status reads catalog keys. |
| **SDP config shape** | ✅ | Nested `identity` / `progression` / `mastery`; panel rows use string `parameterKey`. |
| **Subgroups** | ✅ | `config.sdp.json` → `subgroups[]`; panel `mastery.subgroupKey` + `subgroupTier`. |
| **Families** | ✅ | `families[]` group `subgroupKeys[]`; panel family **derived** (not stored on panel). In-game **family strip**; L2/R2 cycle (All → Unknown → families with unlocked panels). |
| **Passive affix ext** | ✅ | Renamed from `J-Passive-ABS` → **`J-Passive-Affix`** (`J.PASSIVE.EXT.AFFIX`); enemy prefix/suffix RNG + tier presentation. |
| **Passive conditional ext** | ✅ | `J-Passive-Conditional` — three tag families (`passiveSourceRule`, `passiveStateRule`, `passiveStateCount`), full gate/stack evaluators wired into passive core via `canIncludePassiveStateFromSource` + `getPassiveStackContributionFromSource` hooks. Throttled map reconcile + movement/hit/attack/heal timestamps. `onHealHp/Mp/Tp` gate kinds added in 1.1.0. |
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

| # | Item | Status |
|---|---|---|
| P3-1 | **On-crit state application** (`J-CriticalFactors` 1.1.0) | ✅ — `onCritApply/Self`, `thisCritApply/Self` |
| P3-10 | **Heal-event hooks** (`J-Resources-ABS` 1.1.0 + `J-Base` 3.3.0) | ✅ — `onSelf*Heal*`, `onAlly*Heal*`, `onHealHp/Mp/Tp` passive gates |
| P3-5 | **Resistance piercing** (`J-Elementalistics` 1.1.0) | ✅ — `pierceElement`, `thisPierceElement` |
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

## Tag authoring reference

> Cookbook for mastery state / skill authoring. All tags below are live and built.
> Put them on a **state** (or any notetag source) and they work.

---

### Passive conditional gates — J-Passive-Conditional

A passive state only contributes its traits while ALL its `passiveSourceRule` gates pass.

**Tag:** `<passiveSourceRule:[KIND, PARAM]>` on the passive state.

| Gate kind | Behavior |
|---|---|
| `hpAbove:X` | HP% ≥ X |
| `hpBelow:X` | HP% ≤ X |
| `mpAbove:X` / `mpBelow:X` | same for MP |
| `tpAbove:X` / `tpBelow:X` | same for TP |
| `stateApplied:ID` | battler has state ID active |
| `noStateApplied:ID` | battler does NOT have state ID |
| `allOffCooldown` | no skill slots are cooling down |
| `sinceLastMoved:F` | hasn't moved in ≥ F frames |
| `movedWithin:F` | moved within the last F frames |
| `sinceLastHit:F` | hasn't taken damage in ≥ F frames |
| `hitWithin:F` | took damage within the last F frames |
| `sinceLastAttacked:F` | hasn't used a skill in ≥ F frames |
| `attackedWithin:F` | used a skill within the last F frames |
| `onHealHp:F` | received HP healing within the last F frames |
| `onHealMp:F` | received MP healing within the last F frames |
| `onHealTp:F` | received TP healing within the last F frames |
| `enemiesNearby:N` | ≥ N enemies within pursuit range |
| `alliesNearby:N` | ≥ N allies within pursuit range |

Multiple rules on the same state are **AND**-ed. Examples:

```
// active only while below 30% HP and having taken damage in the last 2 seconds (120f)
<passiveSourceRule:[hpBelow, 30]>
<passiveSourceRule:[hitWithin, 120]>

// active only while standing still for at least 3 seconds (180f) — Polliwog Rooted Barrage
<passiveSourceRule:[sinceLastMoved, 180]>

// active for 1 second after receiving any HP heal — post-heal buff
<passiveSourceRule:[onHealHp, 60]>
```

Passive **stack count** modifier: `<passiveStateCount:[FORMULA_USING_STACKS]>` — scales traits by stack multiplier.  
Passive **state rule**: `<passiveStateRule:[STATE_ID, KIND, PARAM]>` — applies a secondary state when the gate passes.

---

### On-crit state application — J-CriticalFactors

Tags apply to **any notetag source** (actor, class, equip, skill, state). Two scopes:

- **`onCrit*`** — fires whenever this battler lands any crit; reads all `getAllNotes()` sources.
- **`thisCrit*`** — fires only when this specific **skill** crits; put on the skill itself.

| Tag | Target | When fires |
|---|---|---|
| `<onCritApply:[STATE_ID, CHANCE]>` | the enemy being hit | any crit from this battler |
| `<onCritSelf:[STATE_ID, CHANCE]>` | the battler critting | any crit from this battler |
| `<thisCritApply:[STATE_ID, CHANCE]>` | the enemy being hit | only when this skill crits |
| `<thisCritSelf:[STATE_ID, CHANCE]>` | the battler critting | only when this skill crits |

`CHANCE` is an integer 1–100 (percent). `STATE_ID` is the database state ID.

Examples:

```
// Cobra Venom Strike — any crit has 40% to apply Poison (state 14) to the target
<onCritApply:[14, 40]>

// Cobra passive — wearing this armor, all crits have 15% to also apply Blind (state 22)
// (on the armor's notetag — reads via getAllNotes())
<onCritApply:[22, 15]>

// This specific skill — on crit, 100% apply Burning (state 7) to target
<thisCritApply:[7, 100]>

// On crit, this battler gains Adrenaline (state 55) for the rush
<onCritSelf:[55, 60]>
```

---

### Heal event cascades — J-Resources-ABS

Tags apply to **any notetag source** (actor, class, equip, skill, state).  
Format: `[PERCENT, RANGE]` where PERCENT is an integer (50 = 50% of the triggering heal) and RANGE is tile radius (0 = self only).

**`onSelf` family** — when THIS battler's trigger resource is healed:

| Tag | What happens |
|---|---|
| `<onSelfHpHealHp:[PCT, R]>` | HP heal → also heal self (+ allies in R tiles) for PCT% as HP |
| `<onSelfHpHealMp:[PCT, R]>` | HP heal → also restore PCT% as MP |
| `<onSelfHpHealTp:[PCT, R]>` | HP heal → also restore PCT% as TP |
| `<onSelfMpHealHp/Mp/Tp:[PCT, R]>` | same, triggered by MP healing |
| `<onSelfTpHealHp/Mp/Tp:[PCT, R]>` | same, triggered by TP healing |
| `<onSelfAnyHealHp/Mp/Tp:[PCT, R]>` | triggers on ANY resource healing |

**`onAlly` family** — when an ALLY within RANGE tiles is healed, the bearer receives secondary:

| Tag | What happens |
|---|---|
| `<onAllyHpHealHp:[PCT, R]>` | ally within R tiles gets HP healed → this battler also gains PCT% of that as HP |
| `<onAllyHpHealMp:[PCT, R]>` | ally healed → restore PCT% of their heal as MP to self |
| `<onAllyAnyHealHp:[PCT, R]>` | ally healed for anything → gain PCT% as HP |
| *(etc — 12 total onAlly variants)* | |

Cascades chain naturally and stop at `healChainDepth` (default 5, plugin parameter).

Examples:

```
// Jelly Mana Transfusion — HP heals also restore 50% as MP, self only
<onSelfHpHealMp:[50, 0]>

// Jelly splash — HP heals also splash 25% HP to allies within 3 tiles
<onSelfHpHealHp:[25, 3]>

// Emotion Empathic Bond — when an ally within 4 tiles is HP healed, I also gain 30% of it
<onAllyHpHealHp:[30, 4]>

// Momentum healing — any heal (HP, MP, or TP) restores 10% of its value as TP (charge through recovery)
<onSelfAnyHealTp:[10, 0]>

// Conditional passive: "I become more powerful for 1 second after any HP heal"
// Put on the passive state's notetag:
<passiveSourceRule:[onHealHp, 60]>
```

---

### Resistance piercing — J-Elementalistics

Tags reduce a target's effective elemental resistance, nudging it toward neutral (1.0×) damage.  
Pierce **never** turns a resistance into a weakness, and it has no effect on weaknesses or absorbed elements.

Two scopes are available:

- **`pierceElement`** — reads from the attacker's full `getAllNotes()` (actor, class, equip, states, learned skills).  
  If placed on a **skill**, the attacker passively benefits from the pierce on all casts for as long as they know that skill.
- **`thisPierceElement`** — reads from the **current skill only**. Only affects the one cast; no passive benefit.

**Tag format:**
```
<pierceElement:[ELEMENT_ID, PIERCE_PERCENT]>
<thisPierceElement:[ELEMENT_ID, PIERCE_PERCENT]>
```
`ELEMENT_ID` is the numeric ID from the Types tab. `PIERCE_PERCENT` is an integer (30 = raise effective rate by 0.30).

Multiple pierce tags on the same element are summed.

**Valid sources:**
- `pierceElement` — Actors, Enemies, Classes, Skills, Weapons, Armors, States
- `thisPierceElement` — Skills only

**Examples:**

```
// Pyroclasm — passive: fully immune target takes 50% fire damage while this state is active
// (on a mastery state, reads via getAllNotes())
<pierceElement:[4, 50]>

// Lava Geyser — this specific skill penetrates 40% of the target's fire resistance
<thisPierceElement:[4, 40]>

// Combo: state grants 30 pierce, skill adds 40 more → 70 total fire pierce on this cast
// (state) <pierceElement:[4, 30]>
// (skill) <thisPierceElement:[4, 40]>

// Ice Shatter ring — wearer's ice attacks ignore 25% of any target's cold resistance
<pierceElement:[6, 25]>
```

**Math example:**  
Target has 0% fire rate (immune). Attacker has 50 total fire pierce.  
Effective rate = min(1.0, 0.0 + 0.50) = **0.50** → target takes 50% fire damage.

**What pierce does NOT do:**
- Does not push weaknesses higher (target already at 200% fire stays 200%).
- Does not strip absorption (if target absorbs fire, they still absorb it regardless of pierce).

---

## Deferred / backlog pointers

- Conditional stat modifier plugin (P2) — mastery passives
- Archetype panel rework at scale (P4-1)
- Boot throw: every subgroup must belong to a family (CA 1.0.0)
- See [`.backlog/unstarted/`](../../../rmmz-plugins/.backlog/unstarted/) in `rmmz-plugins` for plugin-level ideas
