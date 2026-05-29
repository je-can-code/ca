# SDP archetype restructure — work items

> Derived from the archetype mapping session. Organized by dependency order.
> See [`archetype-mapping.md`](./archetype-mapping.md) for full design context.
>
> **For what is already built, see [`implementation-status.md`](./implementation-status.md).**
> That doc is the source of truth for shipped vs pending; this file is the backlog.

Last updated: **2026-05-29**

---

## Phase 0: Registry parameters

Most Phase 0 **machinery is shipped**. Remaining **plugin** work is P1–P3 below; **content** (P4) waits until plugins are done.

> **Policy (2026-05-29):** finish all plugin/engine work before P4 panel rework or mastery DB authoring.

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
- **Consumers (content):** Generalist (Rot Rat subgroup).

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

## Phase 2: Conditional stat modifier plugin (enables most mastery passives)

### P2-1: Core conditional stat modifier system

- **What:** a single tag-driven plugin that applies trait modifications based on runtime conditions.
  Build ONCE, reuse across all archetypes.
- **Trigger types needed (from mastery passives):**
  - HP threshold (below X% → apply trait) — Skeletor, Dargin
  - Self state count (per debuff on me → apply per stack) — Heated Titan
  - Cooldown state (no skills cooling down → apply trait) — Fungrowth
  - Target state (attacking debuffed enemy → apply trait) — Roper, Needler (Drilling Sting)
  - Proximity: enemies in range (→ apply trait) — Crawler (Spire Network), Wisp (Blistering Aura)
  - Proximity: allies in range (→ apply trait) — Cave Bat (Swarm Instinct), Quadruped (Alpha Presence), Orc (Warchief's Command)
  - Damage gap (X seconds since last damage taken → apply trait) — Treant (Ironbark)
  - Post-damage (deal damage → apply trait for X seconds) — Fish (Slippery)
  - Post-skill (use a skill → apply trait for X seconds) — Garuda (Tailwind)
  - Movement state (standing still for X seconds → apply trait) — Polliwog (Rooted Barrage), Draconite (Stone Scales)
  - Movement-to-damage (distance traveled → damage bonus) — Minotaur (Momentum)
  - Party HP threshold (all allies above X% → apply trait) — Dryad (Nature's Wrath)
  - Last-element tracker (last element that hit you → temporary resist) — Hard Syrup (Adaptive Slime)
  - Hit count (consecutive hits without moving → escalating bonus) — Polliwog (Rooted Barrage)

---

## Phase 3: Archetype-specific plugin extensions

### P3-1: J-CriticalFactors — on-crit trigger
- **For:** Cobra (Venom Strike) — crits apply/extend poison.
- **What:** hook into crit resolution to apply a state on critical hit.

### P3-2: Skill execution history tracker
- **For:** Ghosty (Spectral Cascade) — damage +X% per unique skill used in last 10s.
- **What:** new tracking on `Game_Battler` — rolling window of skill IDs used with timestamps.

### P3-3: Viral debuff propagation
- **For:** Brood (Plague Swarm) — debuffs have X% per-tick chance to spread to nearby enemies.
- **What:** on-tick hook for states + proximity check for nearby battlers. Tag-driven: notetag on the
  state marks it as "viral" with spread chance and range.

### P3-4: AoE scaling modifier
- **For:** Hazard (Blast Radius) — AoE skills have +X% increased area size.
- **What:** hook into JABS action hitbox size calculation, multiply by a battler stat/trait.

### P3-5: Resistance piercing modifier
- **For:** Elemental (Elemental Saturation) — elemental damage ignores X% of target's resist.
- **What:** in damage formula or element rate calculation, reduce effective resistance by pierce amount.
  `effectiveResist = Math.max(0, targetResist - pierceAmount)`. Never goes negative (no bonus damage).

### P3-6: Pixelistics extension — movement-to-damage
- **For:** Minotaur (Momentum) — damage +X% based on distance traveled before attacking.
- **What:** track distance traveled since last attack, convert to damage multiplier, reset on attack.

### P3-7: Cast time damage scaling
- **For:** Lamia (Focusing Beam) — skill damage +X% per second of cast time.
- **What:** extend existing cast time plugin. At damage resolution, check how long the skill was
  charging and apply a multiplier.

### P3-8: Shield plugin — mana barrier extension
- **For:** Wraith (Spectral Ward) — magic damage drains MP before HP.
- **What:** extend existing Shield plugin to support MP-backed shields (instead of HP-backed).

### P3-9: Shield-break explosion
- **For:** Runic Orb (Overcharge) — on-shield-break, explode for X% of shield value as AoE.
- **What:** on-shield-break hook already exists. Wire in AoE damage event at shield break location.

### P3-10: Heal-event hooks
- **For:** Jelly (Mana Transfusion — heals restore MP to target), Emotion (Empathic Bond — nearby
  ally healed → you receive X% of that heal).
- **What:** hook into HP recovery resolution to dispatch heal events. Listeners can apply secondary
  effects (MP restore, proximity splash).

### P3-11: Item-use splash
- **For:** Kobold (Field Medic) — items used have X% chance to also affect nearest ally.
- **What:** hook into item application, chance-based duplication to nearest ally in range.

### P3-12: Soul Thread — hit count inference
- **For:** Puppet (Soul Thread) — +X% damage when attack hits exactly one target.
- **What:** at damage resolution, check how many targets the action actually hit. If exactly 1,
  apply bonus. Inferred at runtime, not tag-based (because skills evolve via proficiency).

---

## Phase 4: Panel data authoring (the big grind)

### P4-1: Rework all existing panel stat distributions
- **What:** update every existing panel in `config.sdp.json` to match its
  archetype's stat profile — correct core stats, correct penalties, correct magnitudes.
- **Scale:** all currently implemented enemies (~100+ panels).
- **Depends on:** Phase 0 content (registry keys exist); families/subgroups authored.

### P4-2: Author mastery passives as states
- **What:** create the passive states in the database for each implemented subgroup's mastery.
  Each state carries the mastery effect (traits, conditional triggers, etc.).
- **Scale:** ~15-20 mastery states initially (for subgroups with implemented enemies).
- **Depends on:** P2 (conditional stat modifier system) for most passives.

### P4-3: Place unplaced enemies on maps
- **Where:**
  - Rust Bucket → Pearl Salt Mines (~lv7-12)
  - Kobold → outside Raevula hub town
  - Cyclops → cliffsides (~lv20+ area)
  - Bot, Runic Orb, Puppet → TBD map placements
- **Why:** ensures all 10 archetypes are accessible by mid-game.

---

## Dependency graph (updated — plugins before content)

```
Phase 0 (registry params) ── DONE
         │
P1 respec + mastery UX ── plugin
         │
P2 (conditionals) ──────→ enables conditional mastery states (P4-2 content later)
         │
P3 (plugin extensions) ─→ enables bespoke masteries (P4-2 content later)
         │
         ▼
P4 (panels, states, maps) ── CONTENT — after A/B tiers above
```

Infrastructure **already landed**: parameter registry, SDP families strip,
editor Families/Subgroups tabs — see [`implementation-status.md`](./implementation-status.md).
