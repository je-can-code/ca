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
- Jerald / Spear Chucker: Spiky Clouds

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

**Blocked passives:**
- Rupert / Equilibrium: P-eq1 (`onAllyHeal` → damage nearby enemy), P-eq2 (`onDamageDealt` → heal nearby ally), P-eq3 (`onKill` → heal nearby ally)
