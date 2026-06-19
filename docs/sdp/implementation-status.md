# SDP implementation status

> **Living doc.** Update this when runtime, editor, or CA data changes so design sessions
> do not rely on stale chat memory. Pair with [`work-items.md`](./work-items.md) (backlog)
> and [`archetype-mapping.md`](./archetype-mapping.md) (design).

Last updated: **2026-06-06** — P4 content **active**. Food chain states 251–282 authored with `<stateDuration>`; P4-0 food **items** still pending. **`autoExecuteSkill`** implemented on feature branch (version bump on merge to main).

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
| **Passive conditional ext** | ✅ | **`J-Passive-Conditional` 1.0.0** (unreleased) — passive gates + **`autoApplyState`** (`move`/`stand` via Pixel `updatePixelStepping`) + **`removeOnSkillExecution`** on states; map reconcile + combat timestamps. |
| **MP barrier (Shield ext)** | ✅ | **`J-ABS-Shield`** — magic damage drains MP before HP (Reborn optional layer; orthogonal to pulsed ward via Conditional `time`). |
| **Mastery enrollment vs skill** | ✅ | `enrolledInSubgroup()` vs `grantsMasterySkill()`. Tier contest only among panels with `masterySkillId > 0`. Org-only higher tiers do not strip lower mastery skills. Wrapper skill on max-rank rankUp; optional idempotent `reconcileAllForParty()` on map start for dev ([`mastery-cheatsheet.md` § Save policy](./mastery-cheatsheet.md#save-policy-no-player-migration-obligation)). |
| **State expire chains** | ✅ | `JABS_StateExpireData` + `<applyStateOnExpire:[STATE_ID, CHANCE]>` in **J-ABS** core — natural expiry only; forced strip does not advance chains. |
| **Map state duration override** | ✅ | **J-ABS** core — `<stateDuration:FRAMES>` / optional `<stateDurationSec:SECONDS>` on state row; `jabsStateDurationFrames` overrides MZ-capped `stepsToRemove` when tag present. |
| **Food group chains** | ✅ | **`J-ABS-FOOD`** (`J.ABS.EXT.FOOD` 1.0.0): `<food:TYPE>` → R2 food slot; boot-time `JABS_FoodChainPlan` registry; `JABS_FoodChainResolver.resolveEat` (buffet heals party-wide, chain states on leader only). |
| **Food chain HUD** | ✅ | **`J-HUD-FOOD`** (`J.HUD.EXT.FOOD` 1.0.0): vertical strip — equipped food icon, phase labels, segmented duration bar (`<foodGroupColor:HEX>` per state). |
| **Field Medic mastery hook** | ✅ | `<overstuffedImpervious>` on leader `getAllNotes()` — mid-arc re-feed snaps to new Well Fed instead of Overstuffed; tail-phase rescue unchanged. |
| **Cast-time damage bonus** | ✅ | **`J-ABS` 4.12.3** — `castTimeDamageBonus`, `thisCastTimeDamageBonus`; direct HP/MP damage only |
| **State spread** | ✅ verified | **`J-ABS` 4.12.4** — spread tags incl. `<spreadSkipAfflicted>`; param `defaultStateSpreadTickInterval` (30f). Brood viral recipe playtested in CA. |
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

## Plugin completion roadmap

**Policy (2026-06-02):** P3 hooks are **complete** — P4 content authoring is **underway**. Tier A items below are parallel polish, not gates for P4-0 food items or P4-1 panels unless a mastery needs a missing hook.

### Tier A — SDP core loop (do first)

| # | Item | Work items | Notes |
|---|---|---|---|
| A1 | **P2 conditional mastery gates** | P2-1 | **`J-Passive-Conditional` shipped** — `passiveSourceRule`, `passiveStateRule`, `passiveStateCount`. Remaining P2 gaps: party HP threshold, element tracker, movement-reset counter, some target-state trait hooks. |
| A2 | **P1-2 panel respec** | P1-2 | `rankDownPanel`, refund SDP points, scene UX; cost model TBD. |
| A3 | **CMS registry breakdowns** | — | `Window_StatusStatBreakdown`: lst, mst, tst, sar, ser, apr, gdr, dor, hcr still “No breakdown”. |
| A4 | **Mastery UX polish** | P1-1 tail | No-op feedback when tier contest changes nothing; optional archetype hint on SDP scene (backlog). |

**Mastery passive states:** no separate SDP grant hook — max rank → **mastery wrapper skill** → **J-Passive** applies state(s). Most conditional masteries use **`J-Passive-Conditional`** gates on those states; authoring is P4-2 (content).

### Tier B — P3 archetype hooks (build before content; order by mastery dependency)

**Progress:** **12/12 shipped.** **P3-3** state spread (`J-ABS` 4.12.4) — **playtest verified** (Brood Plague Swarm). **P3-6** superseded by Conditional 1.0.0 momentum toolkit; **P3-8** MP barrier shipped.

Survey [`work-items.md`](./work-items.md) P3-1…P3-12. Build when a planned mastery passive needs it; suggested batch:

| # | Item | Status |
|---|---|---|
| P3-1 | **On-crit state application** (`J-CriticalFactors` 1.1.0) | ✅ — `onCritApply/Self`, `thisCritApply/Self` |
| P3-10 | **Heal-event hooks** (`J-Resources-ABS` 1.1.0 + `J-Base` 3.3.0) | ✅ — `onSelf*Heal*`, `onAlly*Heal*`, `onHealHp/Mp/Tp` passive gates |
| P3-5 | **Resistance piercing** (`J-Elementalistics` 1.1.0) | ✅ — `pierceElement`, `thisPierceElement` |
| P3-9 | **Shield-break explosion** (`J-ABS-Shield`) | ✅ — on-break AoE hook |
| P3-2 | **Skill history bonus** (`J-ABS` core 4.12.2+) | ✅ — `skillHistoryBonus`, `thisSkillHistoryBonus`; COUNT_MODE: `all/unique/streak/distinct_types` |
| P3-4 | **Range scaling** (`J-ABS` core 4.12.3+) | ✅ — `rangeBuff`, `rangeRate`; applies to radius + proximity + thickness |
| P3-12 | **State damage multipliers** (`J-ABS` core 4.12.3+) | ✅ — `perDebuffBuff`, `bonusDamageIfState`, `bonusDamageIfStateType`, `bonusDamagePerStateType` (+ `<type:CLASSIFIER>` on states, `J-Base`); applied before guard |
| P3-11 | **Food chain + Field Medic** (was item-use splash) | ✅ — superseded; see food cookbook below |
| P3-7 | **Cast time damage scaling** (`J-ABS` core 4.12.3+) | ✅ — `castTimeDamageBonus`, `thisCastTimeDamageBonus`; direct HP/MP damage only |
| P3-8 | **MP barrier (Shield ext)** | ✅ — MP before HP on magic damage (`J-ABS-Shield`) |
| P3-6 | **Momentum toolkit** (`move` / `removeOnSkillExecution`) | ✅ superseded Pixelistics ext — Conditional 1.0.0 |
| P3-3 | **State spread / viral propagation** | ✅ verified — `J-ABS` 4.12.4 (see cookbook below) |

### Tier C — Gates & satellite (can slip to 1.0.0 / parallel)

| Item | Notes |
|---|---|
| Family boot throw | `_pluginMetadata.js` TODO — unassigned subgroup → throw at CA 1.0.0 |
| Inanimate enemies no EXP/SDP | `.backlog/unstarted/inanimate-enemies-no-exp-sdp-rewards.md` |
| Natural SDP+ reward bug | `.backlog/unstarted/natural-sdp-plus-reward-bonus-bug.md` |

### Phase 4 content (active)

| Item | Status | Notes |
|---|---|---|
| **P4-0** food | ⚠️ in progress | **States** 251–282 ✅ (traits, `<stateDuration>`, colors). **Items** 151–182 ⏳ (RNG → `<food:TYPE>`). See [`../food/food-chain-durations.md`](../food/food-chain-durations.md). |
| **P4-1** panel stat rework | ⏳ | ~100+ panels — see [`panel-parameters-cheatsheet.md`](./panel-parameters-cheatsheet.md) |
| **P4-2** mastery states/skills | ⚠️ in progress (7/48) | Sequential subgroup pass — tracker: [`mastery-cheatsheet.md` § Authoring progress](./mastery-cheatsheet.md#authoring-progress-one-subgroup-at-a-time) |
| **P4-3** map placement | ⏳ | Armor, Kobold, Cyclops, Bot/Orb/Puppet |

---

## Next engineering (suggested order)

1. **P4-0 finish** — food items 151–182: `<food:TYPE>`, drop 7-dice RNG, per-group item heals; recipe audit; scarcity; in-map playtest (one arc per group).
2. **P4-0 decision** — food item scope: keep party-wide heals vs user-only + future buffet accessory.
3. **P4-1** (or one archetype vertical slice) — panel tradeoff magnitudes before bulk rework; litmus test: no “all offense + HRG on six chars” wins everything.
4. **Parallel (non-blocking):** P1-2 respec (after cost model), CMS registry breakdowns, P2 gaps only when P4-2 hits Dryad / Puddle / Frog / Roper-Needler.
5. **P4-2** mastery DB pass — wrapper skills + passive states using shipped tag cookbook.
6. **P4-3** placements — fill archetype gaps on maps (Kobold near hub, etc.).

---

## Tag authoring reference

> Cookbook for mastery state / skill authoring. Tags marked **⏳ planned** are spec-only until the listed plugin version ships.

---

### Map state duration — J-ABS core

RPG Maker MZ caps `stepsToRemove` at **9999** (~2.8 min). For longer map-state timers (food arcs, long buffs):

```
<stateDuration:FRAMES>
<stateDurationSec:SECONDS>   // optional convenience; SECONDS × 60
```

When a tag is present and **> 0**, J-ABS uses it and **ignores** `stepsToRemove` for `addJabsState` and the food HUD.
Keep `stepsToRemove: 9999` in MZ as a placeholder. Food phase tables: [`../food/food-chain-durations.md`](../food/food-chain-durations.md).

Applicator bonuses (`stateDurationFlat` / `stateDurationPerc` on gear) still add on top of this base.

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

// active only while standing still for at least 3 seconds (180f) — Frog Rooted Barrage
<passiveSourceRule:[sinceLastMoved, 180]>

// active for 1 second after receiving any HP heal — post-heal buff
<passiveSourceRule:[onHealHp, 60]>
```

Passive **stack count** modifier: `<passiveStateCount:[FORMULA_USING_STACKS]>` — scales traits by stack multiplier.  
Passive **state rule**: `<passiveStateRule:[STATE_ID, KIND, PARAM]>` — applies a secondary state when the gate passes.

---

### Auto-apply combat states — J-Passive-Conditional 1.0.0

Schedules **real JABS states** (shields, buffs, momentum stacks, etc.) from the same sources as passives (mastery skills, gear, class, actor, enemy, …).  
**Not** a passive grant — do **not** also put the same state id in `<passive:[…]>` on that row.

**Tag:** `<autoApplyState:[STATE_ID, CONDITION, PARAM]>` — **PARAM meaning depends on CONDITION.**

| Condition | PARAM | When it fires |
|---|---|---|
| `time` | frames | Every PARAM frames on the ABS map |
| `hpDmg` / `mpDmg` / `tpDmg` | frames | Combat loss via `gain* < 0` (not skill pay) |
| `anyDmg` | frames | Any HP/MP/TP combat damage |
| `whenCrit` | frames | This battler critically hit (victim) |
| `negaStateAdded` / `posiStateAdded` / `anyStateAdded` | frames | State added (polarity as named) |
| `move` | **tiles** | One apply per PARAM **whole tiles** (J-Pixelistics `onStep`; requires `@orderAfter J-Pixelistics`) |
| `stand` | frames | While idle on map, at most once per PARAM frames |

**Remove on skill execution (state note only):** `<removeOnSkillExecution:[STYPE_ID, CHANCE]>` — `STYPE_ID` **0** = any type; on success peels stacks via `decrementStateStacks` (`loseAllStacksAtOnce` on the state row).

**vs on-crit tags:** `onCritApply` (J-CriticalFactors) runs when **you land** a crit. `whenCrit` runs when **you are crit**.

**Reborn Ghastly Ward (P4-2):** two-layer authoring — mastery **1111–1120** carry `<autoApplyState:[WARD_ID, time, FRAMES]>`; ward payloads **1001–1010** carry shield notetags. See [`mastery-cheatsheet.md` § Reborn reference](./mastery-cheatsheet.md#reference-reborn--ghastly-ward-undead-reborn) for CA timer table and MP-weighted formulas.

**Minotaur Momentum (P4-2):** `<autoApplyState:[MOMENTUM_ID, move, N]>` on wrapper; momentum state (`stackMax`, additive ATK% traits); `<removeOnSkillExecution:[CHARGE_STYPE, 100]>` on that state.

---

### Auto-execute skill (auras) — J-Passive-Conditional (next release; merge pending)

⏳ **Implemented on feature branch** — ships with the next **`J-Passive-Conditional`** version bump when merged to main. Schedules **map skill execution** via `forceMapAction` from the same sources as `autoApplyState` (`getPassiveStateSources()` — mastery skills, gear, class, actor, enemy, state, …).

**Functional definition:** an **aura** is a **skill fired on a cadence or combat event** — not a hidden trait on a passive state.

- **Scheduler** (tag on grant row): when to call `forceMapAction`
- **Payload** (skill row): radius, proximity, hitbox, element, formula, heal/damage, effects

Same two-layer split as Reborn (`autoApplyState` → ward state); payload is always a **skill**. Executions are normal map skills — **parryable**; victims **can retaliate**.

**vs `autoApplyState`:**

| Need | Use |
|---|---|
| Shield, stack, trait buff, slip DoT **on bearer** | **`autoApplyState`** → state row |
| Spatial hitbox, damage/heal formula, **map skill identity** | **`autoExecuteSkill`** → skill row |
| Ward pulse (Reborn) | **`autoApplyState`** → ward state with `<shield>` |
| Burn bubble (Wisp) | **`autoExecuteSkill`** → burn skill |

**Two radii (trigger vs effect):**

| Layer | Lives on | Question |
|---|---|---|
| Trigger proximity | Tag (`enemiesNearby` only) | “Should I **fire** this tick?” |
| Effect reach | Payload skill | “When it fires, **who gets hit** and how far?” |

Example: gate at **2 tiles** (`TRIGGER_TILES`), payload skill **`radius: 5`**. Tag never overrides skill hitbox.

#### Tag shape

**Standard 3-tuple** (mirrors `autoApplyState`):

```text
<autoExecuteSkill:[SKILL_ID, CONDITION, PARAM]>
```

| CONDITION | PARAM |
|---|---|
| `time` | Min **frames** between ticks on ABS map |
| `hpDmg` / `mpDmg` / `tpDmg` / `anyDmg` | Cooldown **frames** after that combat event |
| `whenCrit` | Cooldown **frames** after this battler is critically hit |
| `negaStateAdded` / `posiStateAdded` / `anyStateAdded` | Cooldown **frames** after matching state add |
| `move` | Whole **tiles** per tick (Pixelistics tile step) |
| `stand` | Min **frames** between ticks while standing still |

**`enemiesNearby`** (4- or 5-tuple — not in `autoApplyState`):

```text
<autoExecuteSkill:[SKILL_ID, enemiesNearby, MIN_COUNT, FRAMES]>
<autoExecuteSkill:[SKILL_ID, enemiesNearby, MIN_COUNT, FRAMES, TRIGGER_TILES]>
```

- **`MIN_COUNT`** — opposing battlers in trigger range (**Wisp: `1`**). Values **`> 1`** = density-gated (“dogpile”) identities.
- **`FRAMES`** — cadence when gate passes
- **`TRIGGER_TILES`** — optional gate radius; omitted → `default-proximity-tiles` plugin param

Heal auras use **`time`** — no enemy gate.

**Convention:** scheduler on **grant row**; payload skill stays dumb (`<hideFromJabsMenu>`, geometry + effect). Do not tag payload with `autoExecuteSkill` (depth guard).

#### Pattern catalog

```text
<!-- Wisp mastery 1121–1130 (P4-2) -->
<autoExecuteSkill:[1021, enemiesNearby, 1, 60]>

<!-- Hazard turret — replaces move-route forceMapAction loops -->
<autoExecuteSkill:[HAZARD_SKILL, time, 60]>

<!-- Heal pulse ~2s — no enemy gate -->
<autoExecuteSkill:[PARTY_REGEN_SKILL, time, 120]>

<!-- Stomp tread — skill every whole tile (not Minotaur momentum cash-out) -->
<autoExecuteSkill:[STOMP_SKILL, move, 1]>

<!-- Idle regen -->
<autoExecuteSkill:[MEDITATION_HEAL, stand, 120]>

<!-- Capstone: tight trigger, huge payload radius on skill row -->
<autoExecuteSkill:[1030, enemiesNearby, 1, 30, 2]>
```

Wisp payload skills **1021+** — clone [**275 Burning Body**](../chef-adventure/data/Skills.json) family. Tier ramp = **FRAMES** and/or stronger payload per tier.

#### Mastery alternatives (design stash)

Ideas that **compete or combine** with current [`archetype-mapping.md`](./archetype-mapping.md) rows — pick one per strip at authoring.

| Subgroup | Current hook | `autoExecuteSkill` alternative |
|---|---|---|
| **Wisp** | Burn aura (planned) | Primary — `enemiesNearby` + fire payload |
| **Construct Hazard** | Blast Radius (cast AoE size) | Enemy **`time`** turret; player **`time`** zone pulse |
| **Aerial / Flower** | HRG / cleanse (traits) | **`time`** heal or cleanse skill pulse |
| **Cube** | Slow melee (movespeed debuff) | **`time`** / **`enemiesNearby`** slow via payload skill |
| **Minotaur** | Momentum (`autoApplyState` move + cash-out) | **`move, 1`** stomp tread — simpler identity |
| **Brood** | Viral spread | **`time`** plague cloud skill |
| **Titan** | KB + debuff stacks | **`anyDmg`** reactive shockwave |
| **Kobold Field Medic** | Food chain | **`time`** small party heal (orthogonal to food) |

#### Gear & accessory ideas (non-mastery)

| Item fantasy | Tag sketch | Payload skill idea |
|---|---|---|
| Ring of Embers | `enemiesNearby, 1, 90` on equip | Small heat tick |
| Tread boots | `move, 1` | Light physical AoE per step |
| Medic's locket | `time, 180` | Weak AoE heal |
| Hazard spawn core | `time, 60` on enemy note | Replace move-route scripting |
| Parry furnace | `whenCrit, 60` on armor | Fire nova when **you** are crit |
| Standstill sanctuary | `stand, 120` | Regen while idle |

**Wisp P4-2 (after ship):** mastery **1121–1130** → gated burn payloads; see [`mastery-cheatsheet.md`](./mastery-cheatsheet.md) Wisp row.

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
// Snake Venom Strike — any crit has 40% to apply Poison (state 14) to the target
<onCritApply:[14, 40]>

// Snake passive — wearing this armor, all crits have 15% to also apply Blind (state 22)
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

### Skill history bonus — J-ABS core

Rewards a battler for their recent skill execution pattern. Both tags read the caster's `getAllNotes()`. History survives map transfers; entries age by seconds and are pruned once per second.

**COUNT_MODE values:**

| Mode | What is counted |
|---|---|
| `all` | total executions matching the type/skill filter in the window |
| `unique` | distinct skill ids matching the filter |
| `streak` | consecutive executions of the same skill/type backward from the most recent entry |
| `distinct_types` | distinct skill type ids in the window |

**Per-skill tag** — fires only when this specific skill is being resolved:
```
<thisSkillHistoryBonus:[WINDOW, PCT, COUNT_MODE]>
```
- `WINDOW` — lookback in seconds (must be ≤ plugin max window)
- `PCT` — integer percent bonus per unit of COUNT
- `COUNT_MODE` — one of the modes above

**Passive/equip/state tag** — fires on every attack from the bearer; TYPE_ID `0` = any skill type:
```
<skillHistoryBonus:[TYPE_ID, WINDOW, PCT, COUNT_MODE]>
```

Damage multiplier: `1 + (PCT × COUNT / 100)`.

Examples:
```
// Taser skill — each consecutive cast in the last 3 seconds adds 8% damage
<thisSkillHistoryBonus:[3, 8, streak]>

// Ghosty mastery state — +5% per unique skill used in last 10s (any type)
<skillHistoryBonus:[0, 10, 5, unique]>

// Berserker mastery — +5% per consecutive weapon-skill execution (stype 7) in last 5s
<skillHistoryBonus:[7, 5, 5, streak]>
```

---

### Range scaling — J-ABS core

Scales the effective reach of every outgoing JABS action. Reads from the caster's `getAllNotes()`. Applies simultaneously to **radius**, **proximity**, and **thickness**.

Modifiers are skipped if the skill has no explicit tag for that dimension (e.g. a skill with no `<proximity:N>` is unaffected on the proximity axis). Floor at 0 — negative tile counts break collision geometry.

**Formula:** `finalValue = max(0, (base + totalBuff) * totalRate)`  
where `totalRate = 1.0 + sum(each rangeRate − 1.0)`.

```
<rangeBuff:N>     // flat tile addition (signed; negative = penalty)
<rangeRate:N>     // base-1.0 multiplier; 1.5 = 1.5x, 0.8 = 0.8x penalty
```

Examples:
```
// Hazard mastery — 1.3x radius, proximity, and thickness on all outgoing actions
<rangeRate:1.3>

// Reach penalty — reduce a build's effective range by 0.5 tiles
<rangeBuff:-0.5>

// Stacking rates: two <rangeRate:1.5> tags → 1.0 + 0.5 + 0.5 = 2.0x
<rangeRate:1.5>
<rangeRate:1.5>
```

---

### State damage multipliers — J-ABS core

Applies damage bonuses based on the current states of the target at resolution time. All four tags read the caster's `getAllNotes()`. Applied **before** guard reduction so flat guard values cannot fully negate the bonus.

**Formula:** `finalDamage = round(baseDamage × (1 + (perDebuffTotal + specificStateTotal + typePresenceTotal + typeCountTotal) / 100))`

**Per-debuff bonus** — adds N% per negative state (`<negative>` tagged) active on the target:
```
<perDebuffBuff:N>
```
Multiple tags sum their N before multiplying by debuff count.

**Specific state bonus** — adds PCT% if the target has `STATE_ID` active:
```
<bonusDamageIfState:[STATE_ID, PCT]>
```
Multiple tags for different state ids each fire independently and stack additively.

Examples:
```
// Puppet mastery state — +5% per debuff on target
<perDebuffBuff:5>

// Puppet mastery state — +25% if target is paralyzed (state 14)
<bonusDamageIfState:[14, 25]>

// Puppet mastery state — +25% if target is rooted (state 15)
<bonusDamageIfState:[15, 25]>

// Combined: target has Paralyzed + Rooted + Poisoned (3 debuffs)
// totalPct = (5 × 3) + 25 + 25 = 65% bonus damage (before guard eats it)
```

---

### State type classifiers — J-Base / J-ABS core

A lightweight tagging layer so masteries can react to a *category* of state (e.g. "any poison-ish state") instead of enumerating specific state ids. Lets independent subgroups compose without one hardcoding the other's payload ids — e.g. Snake's venom ladder (1021–1030) and Needler's own on-crit poison both just carry `<type:poison>`, and Needler's mastery reacts to the category.

**Classifier tag** — on any state's notebox, marks it as belonging to a named category. Multiple tags on the same state are allowed (a state can belong to more than one type):
```
<type:CLASSIFIER>
```
Read via `RPG_State.stateTypes()` (`J.BASE.RegExp.StateType`); comparison is case-insensitive at consumption time.

**Type presence bonus** — adds PCT% if the target has **at least one** active state carrying `TYPE` (boolean check, does not scale with count):
```
<bonusDamageIfStateType:[TYPE, PCT]>
```
Multiple tags for different types each fire independently and stack additively. Mirrors `bonusDamageIfState` but keyed on classifier instead of a specific state id.

**Type count bonus** — multiplies PCT% by the number of **distinct** active states on the target carrying `TYPE`:
```
<bonusDamagePerStateType:[TYPE, PCT]>
```
Mirrors `perDebuffBuff` but keyed on classifier instead of the `<negative>` tag. Counts distinct matching states, not stacks on a single state.

Examples:
```
// State notebox — classify as poison-type
<type:poison>

// Needler mastery state — +30% damage if target carries any poison-type state
<bonusDamageIfStateType:[poison, 30]>

// Hypothetical "venom executioner" build — +10% per distinct poison-type state on target
<bonusDamagePerStateType:[poison, 10]>
```

Both type-aware tags sum into the same multiplier bucket as `perDebuffBuff` / `bonusDamageIfState` — see combined formula above.

---

### Cast time damage bonus — J-ABS core 4.12.3

Scales **direct** HP/MP skill damage by resolved cast duration. Casting ≠ charging (J-ABS-Charge is separate).
Resolved cast frames are stamped on the shared `Game_Action` when JABS actions are built (`JABS_Action.getCastTime()`,
includes J-ABS-Timing cast speed). Every hit from that execution (pierce ticks, duration beams, volley spokes) uses
the same stamp.

**Does not affect:** healing/recovery, slip DoT ticks. DoT amps → future DoT revamp backlog (`abs-dot-slip-revamp`).

**Formula:** `bonusPct = sum(N per sec from tags) × (castFrames / 60)` → `round(base × (1 + bonusPct / 100))`. No cap.

```
<castTimeDamageBonus:N>        // getAllNotes() — mastery passive, gear, etc.
<thisCastTimeDamageBonus:N>    // this skill's note only; stacks additively
```

Examples:
```
// Lamia Focusing Beam mastery — +12% direct damage per second of cast
<castTimeDamageBonus:12>

// Signature laser — 3s cast +20/sec on skill → +60% from skill tag alone
<castTime:180>
<thisCastTimeDamageBonus:20>
```

---

### State spreading — J-ABS 4.12.4

Tracked combat states tick a spread cadence (default **30 frames** via plugin param
`defaultStateSpreadTickInterval`; override per state with `<spreadTick:N>`). Each pulse rolls
**independently per candidate** in tile range; applies with the **original source** battler
(`JABS_State#source`), not the current carrier. Not tied to slip/regen.

| Tag | Role |
|---|---|
| `<spread:[CHANCE, RANGE]>` | Enables spread; CHANCE 1–100 per target; RANGE = tile distance |
| `<viral>` | Candidates = all battlers in range (not only allies) |
| `<spreadTick:N>` | Frames between pulses; when omitted uses plugin default |
| `<spreadPerTick:N>` | Max **successful** spreads per pulse (failed rolls do not count) |
| `<spreadPreferUnafflicted>` | Try battlers **without this state id** first, then those who already have it |
| `<spreadSkipAfflicted>` | Never spread to battlers who already have this state id (no spread refresh in crowds) |

**`spreadPreferUnafflicted` vs `spreadSkipAfflicted`:** prefer only reorders candidates — afflicted
battlers can still receive spread (refreshing duration). skip removes afflicted targets entirely
(Brood crowds use skip to avoid plague ping-pong).

**Brood Plague Swarm (authoring recipe):**

```
<spread:[40, 4]>
<viral>
<spreadPerTick:1>
<spreadSkipAfflicted>
```

**Playtest (2026-06-01):** verified in Chef Adventure — viral spread to nearby enemies, per-tick cap,
and skip-afflicted behavior match design. Automated coverage:
`rmmz-plugins/test/plugins/abs/core/jabs-state-spread.test.js`.

**P4-2 remaining:** wire the same tag stack onto Brood enemy plague debuff states at scale (content pass).

---

### Food group chains — J-ABS core + J-ABS-FOOD + J-HUD-FOOD

Replaces the old 7-dice RNG food model and the cancelled **P3-11 item-use splash** design.
Kobold **Field Medic** SDP mastery is expressed via `<overstuffedImpervious>` (not ally item duplication —
food already heals/buffs the whole party).

**Eat decision tree** (`JABS_FoodChainResolver.resolveEat`):

| Situation | Result |
|---|---|
| No active food chain | Apply new group's Well Fed entry; store plan on `$jabsEngine` |
| Tail phase (Hangry, Crashing, etc.) | Strip all food states (no expire cascade); start new Well Fed |
| Well Fed or peak, leader has `<overstuffedImpervious>` | Same as tail rescue — free re-feed |
| Well Fed or peak, no immunity | Strip all; apply **Overstuffed** punishment chain |

Chain progression between phases uses **`<applyStateOnExpire>`** (J-ABS core). Forced `removeState`
during strip/rescue does **not** fire expire links.

**Item tags:**

```
<food:TYPE>          TYPE = chain group key (protein, vegetable, fruit, carb, dairy, sweet)
```

Food items route to the **R2** dedicated food slot (separate from Triangle tools). Equip via ABS quick-menu
**Equip Food** command.

**State tags:**

```
<foodChain:TYPE>              every state in an arc shares TYPE (incl. overstuffed)
<foodGroupColor:#RRGGBB>      HUD segment color for this phase
<stateDuration:FRAMES>        map timer (J-ABS core; bypasses MZ stepsToRemove cap)
<applyStateOnExpire:[ID, PCT]>   link to next phase (Well Fed → peak → tail)
```

Boot walks `$dataStates` to build one `JABS_FoodChainPlan` per TYPE; duplicate entry states for the same
TYPE throw at boot.

**Field Medic tag:**

```
<overstuffedImpervious>       on mastery passive, class, equip, etc. — any leader note source
```

**Duration:** `<stateDuration:FRAMES>` per phase — overrides `stepsToRemove`; see cookbook above and
   [`../food/food-chain-durations.md`](../food/food-chain-durations.md).

**CA content status (P4-0):** ✅ Chain **states** 251–278, 281–282 (traits, colors, durations). ⏳ Food
   **items** 151–182 (legacy 7-dice RNG except Erocian Pudding `<food:protein>`). ⏳ Recipe audit, scarcity,
   playtest. Open: party vs user item scope — [`work-items.md`](./work-items.md) P4-0.

---

## Deferred / backlog pointers

- **P2 gaps** — party HP threshold, element tracker, movement-reset counter (see `work-items.md` P2-1); most gates live in **`J-Passive-Conditional`**
- **autoApplyState** — in **J-Passive-Conditional** 1.0.0; Ghastly Ward uses `time` + ward states **1001–1010** (P4-2 authored in CA)
- **P3** — **12/12 shipped** (P3-3 state spread verified in `J-ABS` 4.12.4); P3-6 superseded by Conditional 1.0.0
- **DoT revamp** — `rmmz-plugins/.backlog/unstarted/abs-dot-slip-revamp.md` (DoT amps deferred from cast-time hook)
- Food recipe + chain state retune (P4-0)
- Archetype panel rework at scale (P4-1)
- Boot throw: every subgroup must belong to a family (CA 1.0.0)
- See [`.backlog/unstarted/`](../../../rmmz-plugins/.backlog/unstarted/) in `rmmz-plugins` for plugin-level ideas
