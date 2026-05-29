# SDP archetype restructure — work items

> Derived from the archetype mapping session. Organized by dependency order.
> See `archetype-mapping.md` for full design context.

---

## Phase 0: New parameters (must come first — everything else depends on these)

### P0-1: LST (Lifesteal) parameter
- **What:** new longParamId. After dealing damage, attacker recovers `damage * LST%` as HP.
- **Where:** damage pipeline hook in JABS (post-damage-apply).
- **Also:** TextManager, IconManager entries. SDP integration is automatic (just another param ID).
- **Consumers:** War Priest (high), Berserker (moderate), Treant/Vanguard (moderate).

### P0-2: SHA (Shield Amplification) parameter
- **What:** new longParamId. Multiplier on shields the caster APPLIES (outgoing).
- **Where:** hook into existing Shield plugin at shield-creation time.
- **Consumers:** Medic (high), War Priest (small).

### P0-3: SHE (Shield Effectiveness) parameter
- **What:** new longParamId. Multiplier on shields applied TO the target (incoming).
- **Where:** hook into existing Shield plugin at shield-application time.
- **Consumers:** Cleric (positive), Berserker (penalty), Skirmisher (penalty), Artillery (penalty).

### P0-4: AP Multiplier parameter
- **What:** new longParamId + `aptMultiplier()` on `Game_Actor`.
- **Pattern:** mirror `sdpMultiplier()` — notetag-based additive percent, applied in `ApManager.gainAp()`.
- **Currently:** APT has NO multiplier on AP gains. `gainAp()` takes raw amount with zero modifier.
- **Consumers:** Generalist.

### P0-5: Gold Rate parameter
- **What:** convert `goldMultiplier` from notetag-only (Drops plugin) to longParamId.
- **Currently:** `<goldMultiplier:X>` notetag on equipment/states, summed by `Game_Party`.
- **Options:** (a) new longParam that feeds into existing goldMultiplier sum, or (b) SDP panels grant
  a passive state carrying the notetag. Option (a) is cleaner.
- **Consumers:** Generalist (Rot Rat subgroup).

---

## Phase 1: Mastery model (enables the reward system)

### P1-1: Per-panel mastery with intra-subgroup replacement
- **What:** every panel has a mastery passive (state) that activates when the panel is maxed.
  Within a subgroup, only the highest-tier mastery is active (replacement). Across subgroups, all
  masteries stack.
- **Requires:** new tracking on `Game_Actor` — which panels are mastered, which mastery state is
  active per subgroup. Subgroup metadata on panels (which subgroup does this panel belong to?).
- **UI:** mastery indicator in the SDP menu. "Mastered" label + passive description.
- **Scale:** ~50 unique passive concepts (one per subgroup), each with tier-scaled potency.
  Only need to author passives for IMPLEMENTED enemies initially.

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
- **What:** update every existing panel in `Enemies.json` (via SDP panel data) to match its
  archetype's stat profile — correct core stats, correct penalties, correct magnitudes.
- **Scale:** all currently implemented enemies (~100+ panels).
- **Depends on:** P0 (new params exist), P1-1 (mastery model works).

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

## Dependency graph

```
P0 (new params) ──┬──→ P4-1 (panel data rework)
                   │
P1 (mastery model) ┤
                   │
P2 (conditionals) ─┴──→ P4-2 (mastery states)
                   │
P3 (plugin extensions) ─→ P4-2 (mastery states that need those plugins)
                   │
P4-3 (enemy placement) ── independent, can happen anytime
```

P0 and P1 can be built in parallel. P2 and P3 can also be built in parallel.
P4 (data authoring) is the final pass once systems are in place.