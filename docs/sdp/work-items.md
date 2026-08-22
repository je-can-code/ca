# SDP archetype restructure — work items

> Derived from the archetype mapping session. Organized by dependency order.
> See [`archetype-mapping.md`](./archetype-mapping.md) for full design context.
>
> **For what is already built, see [`implementation-status.md`](./implementation-status.md).**
> That doc is the source of truth for shipped vs pending; this file is the backlog.

Last updated: **2026-06-06** — P4-1 Ghosty reference strip; **%-only policy** + class/job **ship blocker** documented.

---

## Current focus (2026-06-02)

| Track | Now | Next |
|---|---|---|
| **P4-0 food** | Chain states + `<stateDuration>` done | Items 151–182, recipe audit, scarcity, in-map verification |
| **P4-1 panels** | Ghosty (`GHO_1`–`10`) reference strip ✅ | Remaining ~100+ panels; **%-only** policy locked ([`panel-parameters-cheatsheet.md`](./panel-parameters-cheatsheet.md)) |
| **P4-2 masteries** | **In progress** (7/48 verified) | One subgroup at a time — [`mastery-cheatsheet.md` § Authoring progress](./mastery-cheatsheet.md#authoring-progress-one-subgroup-at-a-time) |
| **Tier A polish** | Non-blocking | Respec cost model, CMS breakdowns, P2 gaps on demand |
| **Class / job tree** | Design backlog open | **Strict ship blocker** for `%`-only SDP — see below |

See **Next engineering** in [`implementation-status.md`](./implementation-status.md).

---

## Phase 0: Registry parameters

Most Phase 0 **machinery is shipped**.

> **Policy (2026-06-02):** P3 archetype hooks are **12/12 complete**. P4 content authoring is **active**.
> Tier A plugin polish (P1 respec, P2 gaps, CMS breakdowns) runs **in parallel** with P4 — not a blocker
> unless a specific mastery needs a missing hook during P4-2.

### P0-1: LST / MST / TST — ✅ DONE (validated 2026-05-29)

- **Keys:** `lst` (35), `mst` (36), `tst` (37) in `J-Resources-ABS`.
- **Combat:** after ABS hit with `hpDamage > 0`, attacker gains `floor(damage × rate)` HP/MP/TP.
- **Sources:** notetags `<lst:N>` etc. on `getAllNotes()` sources + SDP panel rows (actors only).
- **Consumers (content, not code):** War Priest (high LST), Berserker (mod), Treant/Vanguard (mod).

### P0-2: Shield amplification — ✅ DONE (as `sar`)

- **Key:** `sar` (38). Design name SHA → runtime **Shield Amplification Rate**.
- **Where:** `JABS_Shield` multiplies outgoing shield points by attacker `sar`.
- **Consumers (content):** Medic (high), War Priest (small).

### P0-3: Shield effectiveness — ✅ DONE (as `ser`)

- **Key:** `ser` (39). Design name SHE → runtime **Shield Effectiveness Rate**.
- **Where:** `JABS_Shield` multiplies incoming shield on target by `ser`.
- **Consumers (content):** Cleric (+), Berserker/Skirmisher/Artillery (penalties).

### P0-4: AP multiplier — ✅ DONE (as `apr`)

- **Key:** `apr` (40).
- **Where:** `ApManager.gainAp()` scales award by `actor.apr` (notetag `<aptMultiplier:X>` + SDP).
- **Consumers (content):** Generalist.

### P0-5: Gold / drop rate — ✅ DONE (as `gdr` / `dor`)

- **Keys:** `gdr` (41), `dor` (42).
- **Where:** `Game_Actor.getGoldMultiplier()` / `getDropMultiplierBonus()` — notetags + SDP panel bonus; party sums for drops.
- **Consumers (content):** Generalist (Rat subgroup).

---

## Phase 1: Mastery model (enables the reward system)

### P1-1: Per-panel mastery with intra-subgroup replacement — ⚠️ PARTIAL

**Shipped:**

- Panel `mastery.subgroupKey`, `subgroupTier`, optional `masterySkillId`.
- `enrolledInSubgroup()` vs `grantsMasterySkill()` split.
- Highest tier **mastery skill** within a subgroup wins; lower-tier skills forgotten.
- `Window_SdpMastery` + subgroup display in SDP scene.

**Not shipped:**

- Mastery **passive state** granted on max rank (still design / P4-2).
- Full “mastered” UX polish; no-op feedback when tier contest is a no-op (deferred).

### P1-2: Panel respec system

- **What:** allow players to undo panel investments. Full respec or per-panel.
- **Cost model:** TBD (gold sink? free with cooldown? item-gated?).
- **Critical for:** encouraging experimentation. If respec is too punishing, players default to
  "safe" builds and the archetype system loses its purpose.

---

## Phase 2: Conditional mastery gates (mostly shipped)

### P2-1: Conditional stat modifier system — ⚠️ MOSTLY DONE

**Shipped:** **`J-Passive-Conditional`** 1.0.0 — `passiveSourceRule`, `passiveStateRule`, `passiveStateCount`,
plus **`autoApplyState`** (real combat states on timer/events). Map reconcile + damage/heal/crit hooks.
Covers most mastery passives below via passive states or auto-apply (P4-2).

| Trigger | Example mastery | Gate / plugin |
|---|---|---|
| HP threshold | Skeleton, Dargin | ✅ `passiveSourceRule:[hpBelow/hpAbove, …]` |
| Self state count | Titan | ✅ `passiveStateCount` |
| Cooldown state | Fungus | ✅ `passiveSourceRule:[allOffCooldown]` |
| Proximity (enemies) | Crawler, Wisp aura | ✅ `passiveSourceRule:[enemiesNearby, N]` for trait gates; Wisp burn = ⏳ [`autoExecuteSkill`](./implementation-status.md#auto-execute-skill-auras--j-passive-conditional-next-release-merge-pending) (merge pending) |
| Proximity (allies) | Bat, Orc, Quadruped | ✅ `passiveSourceRule:[alliesNearby, N]` |
| Damage gap | Treant Ironbark | ✅ `passiveSourceRule:[sinceLastHit, FRAMES]` |
| Post-skill / post-attack window | Beaker, Fish | ✅ `passiveSourceRule:[attackedWithin, FRAMES]` |
| Standing still | Draconite, Frog (partial) | ✅ `passiveSourceRule:[sinceLastMoved, FRAMES]` |
| Target debuff → **damage** | Puppet, Roper (damage variant) | ✅ `perDebuffBuff`, `bonusDamageIfState` (`J-ABS` 4.12.3+) |
| Target state-type → **damage** | Needler (vs poison-type) | ✅ `bonusDamageIfStateType`, `bonusDamagePerStateType` + `<type:CLASSIFIER>` on states (`J-Base` / `J-ABS` core) — see [`implementation-status.md` § State type classifiers](./implementation-status.md#state-type-classifiers--j-base--j-abs-core) |
| On-crit state apply | Snake | ✅ `onCritApply` (`J-CriticalFactors` 1.1.0) |
| Heal cascades | Jelly, Emotion | ✅ heal-event tags (`J-Resources-ABS` 1.1.0) |

**Still unshipped (P2 gaps or P3):**

| Trigger | Example mastery | Status |
|---|---|---|
| Target debuff → **CRI/CDM trait** | Roper | ⏳ true trait hook (stat-level CRI/CDM modifier) on target state still unbuilt; Needler routed around this via the type-classifier **damage** tags instead (see shipped table above) — no longer blocking Needler authoring |
| Party HP threshold | Dryad | ⏳ P2 gap |
| Last-element resist tracker | Puddle | ⏳ P2 gap |
| Hit count without moving (escalating) | Frog | ⏳ P2 gap (movement + consecutive-hit counter) |
| Movement charge / cash-out (stacked state) | Minotaur | ✅ **J-Passive-Conditional** 1.0.0 (`move` + `removeOnSkillExecution`; P4-2 content) |
| Viral debuff spread | Brood | ✅ **P3-3** verified (`J-ABS` 4.12.4) |
| Periodic / reactive state apply | Reborn (Ghastly Ward pulse) | ✅ `autoApplyState` (`J-Passive-Conditional` 1.0.0) |
| MP-before-HP magic barrier | Reborn (optional layer) | ✅ **J-ABS-Shield** (P3-8) |
| Retaliate / reflect | Crab, Scorpion | ⏳ experiment with existing counter hooks |
| "Recently hit by enemy" DR | Cephalopod | ⏳ P2 gap (attacker-side debuff aura or new stamp) |

---

## Phase 3: Archetype-specific plugin extensions

> Items are ordered easiest → hardest to implement. **12/12 done** — P3-3 state spread verified (`J-ABS` 4.12.4). P3-8 MP barrier shipped; P3-6 superseded by Conditional 1.0.0.

### P3-1: J-CriticalFactors — on-crit trigger ✅ DONE (2026-05-30)
- **For:** Snake (Venom Strike) — crits apply/extend poison.
- **What:** hook into crit resolution to apply a state on critical hit.
- **Tags:** `<onCritApply:[STATE_ID, CHANCE]>` / `<onCritSelf:[STATE_ID, CHANCE]>` on any notetag source.
  `<thisCritApply:[…]>` / `<thisCritSelf:[…]>` on a specific skill.
- **Source:** `J-CriticalFactors` 1.1.0 — reads `getAllNotes()` for `onCrit*`; skill note for `thisCrit*`.

### P3-5: Resistance piercing modifier ✅ DONE (2026-05-30)
- **For:** Elemental (Elemental Saturation) — elemental damage ignores X% of target's resist.
- **What:** in damage formula or element rate calculation, reduce effective resistance by pierce amount.
  `effectiveResist = Math.max(0, targetResist - pierceAmount)`. Never goes negative (no bonus damage).
- **Tags:** `<pierceElement:[ELEMENT_ID, PCT]>` on `getAllNotes()` sources (global — applies to all skills); `<thisPierceElement:[ELEMENT_ID, PCT]>` on a specific skill (that skill only). Multiple tags on the same element are summed.
- **Source:** `J-Elementalistics` 1.1.0.

### P3-9: Shield-break explosion ✅ DONE (2026-05-30)
- **For:** Orb (Overcharge) — on-shield-break, explode for X% of shield value as AoE.
- **What:** on-shield-break hook already exists. Wire in AoE damage event at shield break location.
- **Source:** `J-ABS-Shield`.

### P3-10: Heal-event hooks ✅ DONE (2026-05-30)
- **For:** Jelly (Mana Transfusion — heals restore MP to target), Emotion (Empathic Bond — nearby
  ally healed → you receive X% of that heal).
- **What:** `onHeal(resource, amount)` broadcast hook in J-Base fires after any positive recovery.
  `J-Resources-ABS` dispatches `HealEventManager` for tag-driven cascades; `J-Passive-Conditional`
  stamps heal timestamps for new gate conditions.
- **Tags:** `<onSelf{Trigger}Heal{Output}:[PCT, RANGE]>` and `<onAlly{Trigger}Heal{Output}:[PCT, RANGE]>`.
  Trigger/Output each one of `Hp | Mp | Tp | Any`. RANGE=0 = self only.
- **Passive gate:** `<passiveSourceRule:[onHealHp, FRAMES]>` (also onHealMp, onHealTp).
- **Chain depth:** `healChainDepth` plugin parameter on `J-Resources-ABS` (default 5).

### P3-2: Skill execution history tracker ✅ DONE (2026-05-30)
- **For:** Ghosty (Spectral Cascade) — damage +X% per unique skill used in last 10s.
- **What:** rolling skill log on `JABS_Engine` keyed by battler uuid, aged + pruned once per second.
  Two tag scopes: `<thisSkillHistoryBonus:[WINDOW, PCT, COUNT_MODE]>` on a skill;
  `<skillHistoryBonus:[TYPE_ID, WINDOW, PCT, COUNT_MODE]>` on any `getAllNotes()` source.
  COUNT_MODE: `all` | `unique` | `streak` | `distinct_types`. Log survives map transfer.
- **Source:** `J-ABS` core 4.12.2.

### P3-4: AoE scaling modifier ✅ DONE (2026-05-30)
- **For:** Hazard (Blast Radius) — AoE skills have +X% increased area size.
- **What:** `<rangeBuff:N>` (flat tile addition) and `<rangeRate:N>` (base-1.0 multiplier) on any
  `getAllNotes()` source. Applied to radius, proximity, and thickness simultaneously via
  `JABS_Action.applyRangeModifiers()`. Dead `<size:N>` tag fully obliterated.
- **Source:** `J-ABS` core 4.12.3.

### P3-12: State damage multipliers ✅ DONE (2026-05-31)
- **For:** Puppet (Soul Thread) — bonus damage against debuffed/controlled targets.
- **What:** two tag types on any `getAllNotes()` source, both applied before guard reduction.
  `<perDebuffBuff:N>` adds N% per negative (`jabsNegative`) state on the target.
  `<bonusDamageIfState:[STATE_ID, PCT]>` adds PCT% if the target has a specific state active.
  Both stack additively into a single pre-guard multiplier.
- **Source:** `J-ABS` core 4.12.3+.
- **Note:** original "exactly one target hit" design was not codeable in an ABS (hitbox scope is
  positional, not intent-driven). Redesigned to state-exploitation identity instead.

### P3-11: Food group chains + Field Medic — ✅ DONE (2026-06-01)

**Supersedes** the original "item-use splash" design. Food already applies heals/cures to the whole party;
Field Medic mastery is **chain timing**, not item sharing.

**Shipped plugins:**

| Plugin | What |
|---|---|
| **J-ABS** core | `<applyStateOnExpire:[STATE_ID, CHANCE]>` — natural expiry chains (`JABS_StateExpireData`) |
| **J-ABS-FOOD** 1.0.0 | `<food:TYPE>` → R2 slot; `JABS_FoodChainPlan` boot registry; `JABS_FoodChainResolver` eat tree |
| **J-HUD-FOOD** 1.0.0 | Food frame: icon, phase labels, segmented duration bar |

**Field Medic mastery hook:** `<overstuffedImpervious>` on leader note sources — re-feed during Well Fed
or peak snaps to the new group's Well Fed instead of triggering Overstuffed. Tail-phase eat always
rescues into the new arc (all players).

**CA content (P4-0 — in progress):**

- ✅ **Chain states** 251–278, 281–282: six meal arcs + overstuffed/bloated; traits; `<foodChain>`;
  `<foodGroupColor>`; **`<stateDuration>`** per phase ([`../food/food-chain-durations.md`](../food/food-chain-durations.md)).
- ⏳ **Food items + crafting redo** — see `rmmz-plugins/.backlog/unstarted/ca-food-recipes-crafting-redo.md`
  (family recipe books, ingredient lanes, revisit `config.crafting.json`; interim `<food:TYPE>` on items)
  (Erocian Pudding = protein reference item).
- ⏳ Recipe identity audit (ingredient → group mapping).
- ⏳ Ingredient scarcity pass so ~10 min chains feel earned.
- ⏳ Kobold Field Medic mastery passive with `<overstuffedImpervious>` — **P4-2**, not P4-0.

**J-ABS core (not food-only):** `<stateDuration:FRAMES>` / optional `<stateDurationSec:SECONDS>` on any
state row; overrides MZ-capped `stepsToRemove` for map timers.

Design source: `rmmz-plugins/.backlog/unstarted/ca-food-group-chain-system.md`.

### P3-13: autoApplyState scheduler — ✅ DONE (2026-06-01)
- **For:** Reborn (Ghastly Ward) and any mastery that needs timed or reactive **combat** states without a skill slot.
- **What:** **`J-Passive-Conditional` 1.0.0** (initial release) — `<autoApplyState:[STATE_ID, CONDITION, COOLDOWN_FRAMES]>`.
  Conditions: `time`, `hpDmg`, `mpDmg`, `tpDmg`, `whenCrit` (victim), `negaStateAdded`.
  Scans `getPassiveStateSources()` (mastery skills included). Cooldowns in **frames**.
- **Reborn authoring:** mastery state **1111–1120** → `<autoApplyState:[1001–1010, time, FRAMES]>`; ward rows → `<shield:[…]>` (+ optional cap/stack). MP-weighted formulas; pulse **3600→900** frames by tier — see [`mastery-cheatsheet.md` § Reborn reference](../sdp/mastery-cheatsheet.md#reference-reborn--ghastly-ward-undead-reborn).

### P3-14: autoExecuteSkill scheduler — ⏳ IMPLEMENTED (merge pending; version bump on main)
- **For:** Wisp (Blistering Aura), inanimate hazards, gear tread/heal auras, stomp-on-move, and any “skill on cadence” identity.
- **What:** `<autoExecuteSkill:[SKILL_ID, CONDITION, PARAM]>` (+ optional `enemiesNearby` 4/5-tuple) — mirrors `autoApplyState` conditions; executes payload via `forceMapAction` (parry/retaliate allowed); depth guard; same `getPassiveStateSources()` scan.
- **Pattern library (durable):** [`implementation-status.md` § Auto-execute skill](./implementation-status.md#auto-execute-skill-auras--j-passive-conditional-next-release-merge-pending) — mastery alternatives, accessory ideas, two-radius notes.
- **Wisp authoring (P4-2, after ship):** mastery **1121–1130** → gated burn payload skills; see cookbook § Pattern catalog.

### P3-7: Cast time damage scaling — ✅ DONE (2026-06-01)
- **For:** Lamia (Focusing Beam) — direct skill damage +X% per second of **cast** time (not Charge-ext hold).
- **What:** `J-ABS` core 4.12.3 — resolved cast frames stamped on `Game_Action` at JABS action creation;
  `applyCastTimeDamageBonus` in `makeDamageValue` (before guard, with state damage multipliers).
- **Tags:** `<castTimeDamageBonus:N>` on any `getAllNotes()` source;
  `<thisCastTimeDamageBonus:N>` on the skill note. HP/MP damage types only; no slip DoT.
- **Formula:** `bonusPct = sum(N/sec) × (castFrames / 60)`; no cap.

### P3-8: Shield plugin — mana barrier extension — ✅ DONE (2026-06-02)
- **For:** optional Reborn layer — magic damage drains MP before HP (orthogonal to pulsed shield via P3-13).
- **What:** **`J-ABS-Shield`** — MP absorbs magic damage before HP (state/notetag-driven; P4-2 Reborn authoring optional).

### P3-6: Movement momentum toolkit — ✅ SUPERSEDED (2026-06-02) by `J-Passive-Conditional` 1.0.0

**Was:** Pixelistics extension — hidden distance → damage % in `makeDamageValue`.

**Now:** stackable combat state toolkit (Minotaur and others compose in P4-2):

| Tag | Role |
|---|---|
| `<autoApplyState:[STATE_ID, move, TILES]>` | +1 stack apply per whole tiles traveled (Pixelistics `updatePixelStepping`) |
| `<autoApplyState:[STATE_ID, stand, FRAMES]>` | apply while idle (inverse; optional for other archetypes) |
| `<removeOnSkillExecution:[STYPE_ID, CHANCE]>` | on state row — peel stacks on skill exec (`stype` 0 = any) |

**Minotaur P4-2:** mastery `move` → momentum state (`stackMax`, additive ATK% traits) → `removeOnSkillExecution` on charge stype.

### P3-3: State spread / viral propagation — ✅ SHIPPED + VERIFIED (`J-ABS` 4.12.4)
- **For:** Brood (Plague Swarm) — debuffs spread to nearby battlers on a cadence.
- **Shipped:** `<spread:[CHANCE, RANGE]>`, `<viral>`, `<spreadTick:N>`, `<spreadPerTick:N>`,
  `<spreadPreferUnafflicted>`, `<spreadSkipAfflicted>`; plugin param `defaultStateSpreadTickInterval`
  (default 30 frames). See [`implementation-status.md`](./implementation-status.md) cookbook.
- **Verified (2026-06-01):** Chef Adventure map — Brood viral recipe (`spread` + `viral` +
  `spreadPerTick:1` + `spreadSkipAfflicted`). Vitest: `rmmz-plugins/test/plugins/abs/core/jabs-state-spread.test.js`.
- **P4-2 (content):** author plague debuff states for Brood enemies at scale; runtime hook is done.

---

## Phase 4: Panel data authoring (the big grind)

### P4-0: Food recipe + chain state retune (CA data) — ⚠️ IN PROGRESS

- **What:** migrate items 151–182 from legacy 7-dice RNG to `<food:TYPE>` + deterministic chain entry;
  chain **states** fully authored in `States.json`.
- **Done:** states 251–278, 281–282 — traits, `<stateDuration>`, colors, expire links ([`../food/food-chain-durations.md`](../food/food-chain-durations.md)).
- **Remaining:** items 151–182 `<food:TYPE>` + item effect retune; recipe→group audit; scarcity; verify one full arc per group in-map.
- **Depends on:** P3-11 plugins (shipped).
- **Open design:** food item scope (party vs user) + optional buffet accessory — see archetype-mapping food section.

### P4-1: Rework all existing panel stat distributions

- **What:** update every existing panel in `config.sdp.json` to match its
  archetype's stat profile — correct core stats, correct penalties, correct magnitudes.
- **Policy:** **all `%` rows** (`isFlat: false`) — panels amplify base stats; they do not grant flat chunks.
  See [`panel-parameters-cheatsheet.md`](./panel-parameters-cheatsheet.md) §5 and §11.
- **Reference strip:** `undead-ghosty` (`GHO_1`…`GHO_10`) — first authored pass.
- **Scale:** all currently implemented enemies (~100+ panels).
- **Depends on:** Phase 0 content (registry keys exist); families/subgroups authored.
- **Ship blocker (strict):** [**protag class / job tree**](../../../rmmz-plugins/.backlog/unstarted/ca-protag-class-job-tree-system.md)
  — without class swapping (or equivalent base-param pivot), `%`-only panels leave low-base actors
  (e.g. Jerald on Wizard strips) with no meaningful growth path. **Not a nice-to-have.**

### P4-2: Author mastery passives as states
- **What:** create the passive states in the database for each implemented subgroup's mastery.
  Each state carries the mastery effect (traits, conditional triggers, etc.).
- **Scale:** ~15-20 mastery states initially (for subgroups with implemented enemies).
- **Depends on:** **`J-Passive-Conditional`** (most gates) + remaining P2 gaps; Brood spread hook verified — P4-2 plague state DB pass.

### P4-3: Place unplaced enemies on maps
- **Where:**
  - Armor → Pearl Salt Mines (~lv7-12)
  - Kobold → outside Raevula hub town
  - Cyclops → cliffsides (~lv20+ area)
  - Bot, Orb, Puppet → TBD map placements
- **Why:** ensures all 10 archetypes are accessible by mid-game.

---

## Dependency graph (updated — P4 active)

```
Phase 0 (registry params) ── DONE
         │
P1 respec + mastery UX ── plugin
         │
Class / job tree ───────→ **STRICT ship blocker** for P4-1 `%`-only panels (parallel design OK; must ship before SDP build identity is "done")
         │
P2 (conditionals) ──────→ mostly **`J-Passive-Conditional`**; P4-2 mastery states + remaining P2 gaps
         │
P3 (plugin extensions) ─→ **12/12 shipped** (P3-3 state spread verified 4.12.4)
         │
         ▼
P4 (panels, states, maps) ── CONTENT **active** (parallel with Tier A polish)
         │
         ├─ P4-0 food — states ✅; items ⏳
         ├─ P4-1 panel stat rework (Ghosty ✅ reference)
         ├─ P4-2 mastery states/skills
         └─ P4-3 map placement
```

Infrastructure **already landed**: parameter registry, SDP families strip,
editor Families/Subgroups tabs — see [`implementation-status.md`](./implementation-status.md).
