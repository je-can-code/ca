# Engine Requirements — Class Skills

All engine work flagged during combat skill design for Jerald and Rupert.
Class files contain only skill descriptions. Implementation dependencies live here.

---

## Tactical Targeting System

Cursor-driven target selection UI. Skills with a targeting tag pause combat and enter a target-selection mode, scoped to allies or enemies per skill scope. Projected hitbox renders on hover; AoE radius highlights all battlers in range.

**Blocked skills:**
- Rupert / Strategist trunk: Magic Bomb
- Rupert / Debilitator trunk: Miasma
- Rupert / The Architect: Compression, Meteor
- Rupert / Equilibrium: Distribute
- Jerald / Orbiter: Dismiss, Reverse Injection
- Jerald / Malpractician: SHIELD

---

## Pull-Forward (Inverted Knockback)

Enemies are dragged toward the caster rather than pushed away. Inverted knockback vector.

**Blocked skills:**
- Rupert / The Architect: Converge

---

## `<innerRadius:N>` Tag

Excludes targets within N tiles of the action origin from any hitbox shape. Universal dead zone applicable to any hitbox.

**Blocked skills:**
- Jerald / Quicksilver trunk: Mah Lazer (inner dead zone — cannot fire point-blank)

---

## Channeling System

First-class JABS feature. Movement cancels the channel; a visible gauge shows channel duration. The battler is locked in place for the duration.

**Blocked skills:**
- Jerald / Just Enough: Skyeroll

---

## Battler-Level Roll Counts (positiveRolls / negativeRolls)

Battler-level `positiveRolls` and `negativeRolls` counts that feed into all `chanceIn100` and `JABS_OnChanceEffect.shouldTrigger()` call sites.
- **Positive rolls:** roll N times, take any success. More rolls = better effective odds.
- **Negative rolls:** must succeed consecutively or the whole check fails. More rolls = harder to proc.

Threading and centralization needed — some chance checks live outside `JABS_OnChanceEffect` proper. The infrastructure (`chanceIn100` params, `shouldTrigger` params) already exists; call sites need to read from the battler.

**Blocked skills:**
- Rupert / Fate trunk: Curry Favor (grants positive rolls), Court Disaster (applies negative rolls)

---

## Miracle Flag (All Procs Guaranteed)

Battler-level flag that bypasses all chance checks entirely — short-circuits `chanceIn100` to always return true, or forces `positiveRolls` to an absurd value.

**Blocked skills:**
- Rupert / RNGesus: Miracle

---

## Lobotomized Flag (All Procs Nullified)

Hard 0% cap on all on-chance effects for a target. Inverse of the Miracle flag. Bypasses the roll system entirely rather than just stacking negative rolls.

**Blocked skills:**
- Rupert / Hexagonal: Lobotomized

---

## Encore Mechanic (Proc Echo)

On proc resolution, fire the proc again. New repeat-multiplier concept on `JABS_OnChanceEffect` or a hook into proc resolution. Combined with Miracle: everything guaranteed and doubled.

**Blocked skills:**
- Rupert / RNGesus: Encore

---

## Accumulate Mode (Multi-Apply Procs)

`rollMode: accumulate` on `JABS_OnChanceEffect`. Instead of stopping at the first successful roll, counts every successful roll and applies the associated state once per success. One hit can stack states multiple times from a single proc.

**Blocked passives:**
- Rupert / RNGesus: unnamed passive P1

---

## New autoExecuteSkill / autoApplyState Conditions

New trigger conditions for J-Passive-Conditional. All follow the existing `[SKILL_ID, CONDITION, PARAM]` tuple shape. Generalizing to "fire a skill" rather than baking in effects keeps the engine unopinionated.

| Condition | Fires when... |
|---|---|
| `onSelfHeal` | this battler is healed |
| `onAllyHeal` | a nearby ally is healed |
| `onDamageDealt` / `onEnemyHit` | this battler successfully deals damage to an enemy |
| `onKill` | this battler lands a kill |
| `onKnockback` | this battler knocks an enemy back |

**Blocked passives:**
- Rupert / Equilibrium: Rebalance mechanics (`onAllyHeal` → damage nearby enemy, `onDamageDealt` → heal nearby ally — mode-gated, not standalone passives), Reallocate (`onKill` → heal nearby ally), Equalize (`onSelfHeal` → damage nearby enemy, `onDamageDealt` → heal self)
- Jerald / Just Enough: Trauma (`onKnockback` → apply stun)

---

## HAR — Heal Amplification Rate

New battler parameter matching the naming convention of SAR (Shield Amplification Rate). Sender-side outgoing heal potency multiplier — distinct from REC which is recipient-side. Both multiply together at heal resolution.

- `SAR` — outgoing shields land harder (existing)
- `HAR` — outgoing heals land harder (new)
- `REC` — incoming heals are absorbed better (existing, recipient-side)

**Blocked passives:**
- Jerald / Medick trunk: HAR +100% passive (name TBD)

---

## State-Type-Specific Tick Rate Modifier

Modifies the tick rate of states carrying a specific type classifier (e.g. `<type:bleed>`), independently of the generic tick speed modifier used by Festering. Allows per-type tick acceleration without affecting other state types.

**Blocked passives:**
- Jerald / Contemptuous: Exsanguination (bleed states tick 50% more often)

---

## Self-Accumulating State Stacks

A state that gains stacks passively over time — once per second, independent of any external hit or application. After the state is initially planted on a target (by a skill hit), it ticks up on its own indefinitely. No external input required after the first application.

Distinct from:
- Slip/regen ticks (those deal damage/heal HP, they don't add stacks)
- Spread system (that is lateral, applying to nearby targets — this is vertical, deepening on one target)
- Accumulate Mode (that is per-hit multi-proc — this is autonomous over time)

**Blocked skills/passives:**
- Jerald / Painbringer: Null Acid state (self-stacks over time)
- Jerald / Just Enough: Overdue state (self-stacks over time; see also `bonusDamagePerStateStack` below)

---

## Dynamic Knockback Multiplier (Nearby Battler Count)

Knockback distance scales with the number of battlers currently within a defined radius of the caster. Each nearby battler contributes a flat % bonus to outgoing knockback. Evaluated at cast time.

**Blocked passives:**
- Jerald / Orbiter: proximity knockback passive (+25% per nearby battler, enemy or ally)

---

## Formula-Driven Hit Count

Skill hit count accepts a formula expression referencing battler stats rather than a fixed integer. Evaluated at cast time against the caster's current stats.

```
<hitsFormula:EXPR>
```

Where EXPR is a JS-style expression (e.g. `LUK/10`, `floor(1 + LUK/250 + AGI/250)`).

**Blocked skills/passives:**
- Jerald / Try Hard: Button Mash (`hitsFormula: LUK/10`)
- Jerald / Try Hard: Fully Committed (basic attack bonus hits: `floor(1 + LUK/250 + AGI/250)`)

---

## Time Collapse (Free Instant Cast)

After casting a skill, the next skill cast is instant (no cast time) and costs 0 MP. Implemented as a state applied on skill execution — the state marks the next cast as free and instant, then is consumed on use.

**Blocked passives:**
- Rupert / The Architect: Time Collapse

---

## `<bonusDamagePerStateStack:[STATE_ID, PCT]>`

Adds PCT% bonus damage per stack of a specific state currently active on the target. Unlike `bonusDamagePerStateType` (which counts distinct states of a type), this reads the stack count of one named state and multiplies accordingly. No stack cap — damage scales limitlessly with stack count.

```
<bonusDamagePerStateStack:[STATE_ID, PCT]>
```

Where STATE_ID is the database id of the state to read stacks from.
Where PCT is the percent bonus per stack.

Example: Overdue — +2% damage per stack of the Overdue state on the target:
```
<bonusDamagePerStateStack:[OVERDUE_ID, 2]>
```

At 50 stacks: +100% damage. At 100 stacks: +200% damage. No ceiling.

**Blocked passives:**
- Jerald / Just Enough: Overdue (P10)

---

## `<bonusDamageForMyStateCount:PCT>` / `<thisBonusDamageForMyStateCount:PCT>`

Adds PCT% bonus damage per state currently active on the target that this battler personally applied. State authorship is already tracked internally — this is a damage-formula lookup, not a new tracking system. `bonusDamageForMyStateCount` lives on a passive state (always active); `thisBonusDamageForMyStateCount` lives on a skill (applies only when that skill lands). Counts distinct authored states on the target, not stack depth of any one state — distinct from `bonusDamagePerStateStack` above, which reads one named state's stack count regardless of authorship.

```
<bonusDamageForMyStateCount:PCT>
<thisBonusDamageForMyStateCount:PCT>
```

Where PCT is the percent bonus per authored state currently on the target.

**Blocked passives:**
- Rupert / Debilitator trunk: Decompose
- Jerald / Painbringer: Melting (P11)

---

## Party-Wide Authored-State Damage Bonus

`bonusDamageForMyStateCount` above always reads authorship as "the battler dealing this hit." Devastated needs the same stack-count lookup, but read from a fixed author (Rupert) and applied to *any* party member's damage — not gated to hits Rupert personally lands. Requires the tag to accept an explicit author reference instead of implicitly resolving to the current attacker.

```
<bonusDamageForAuthoredStateCount:[AUTHOR_REF, PCT]>
```

Where AUTHOR_REF identifies the authoring battler (Rupert) rather than "self," and PCT is the percent bonus per stack of Rupert-authored states currently on the target. Lives on a passive state, checked at damage resolution regardless of which ally is attacking.

**Blocked passives:**
- Rupert / Hexagonal: Devastated
