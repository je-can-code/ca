# SDP mastery prose

> Player-facing description templates for every subgroup mastery, written against the real tags,
> traits and gates rather than the design notes. Companion to [`mastery-cheatsheet.md`](./mastery-cheatsheet.md)
> (what each mastery *is*) and [`flow.md`](./flow.md) (the authoring loop).
>
> **Why templates instead of sentences.** Balance numbers get nudged; mechanics rarely do. A token
> resolves from live data at draw time, so a retune never leaves the prose describing a number that
> no longer exists. Tokens emit the **value only**, signed and formatted. Every noun is authored.

## Reading a mastery: three layers

1. **The wrapper skill** (`Skills.json`, same id) carries `<hideFromJabsMenu>` + `<passive:[N]>`, and
   often `<passiveSourceRule:[KIND, PARAM]>`, which **gates the entire passive**. 110 of the 500 do.
2. **The mastery state** (`States.json`, same id) holds the effect tags and traits.
3. **The payload**: whatever state or skill those tags point at, where the real numbers usually live.

Skipping layer 1 makes a conditional mechanic read as an unconditional one. Skipping layer 3 leaves
the prose with nothing quantitative to say.

## Authoring conventions

- **A pipe marks the line break.** `line one|line two` is honoured exactly as written when both lines
  fit; wrapping is only the safety net beneath it, for a line whose live values came out longer than
  expected. The break belongs at a clause a person chose, not wherever the pixel count ran out.
- **Tokens are tinted by the resolver, not by the template.** Never write a colour code around a
  token; it already wears one. The colour follows **what the value is**, not which namespace wrote it:
  stats `\C[1]`, measures of time and distance `\C[6]`, quantities `\C[3]`, lists `\C[2]`.
  A gate takes the colour of whatever its phrase turned out to be, so "3 tiles" reads as a measure
  while "below 20% Life" reads as a stat. A tag naming a registered parameter (`lst`, `cdr`) is a
  stat too, so lifesteal and regeneration are not painted differently in the same sentence.
- **An uppercase namespace names the parameter.** `{P.def}` renders "Endurance +12%" with the name
  inside the tint; `{p.def}` renders "+12%" alone. Use the uppercase form when the noun you would
  write is simply the parameter's name, and the lowercase form when friendlier wording reads better
  ("damage taken" beats "Phys Dmg Rate").
- **A gate phrase is the whole condition.** `{s.gate}` already reads "below 20% Life", so
  "Below {s.gate} Life" says it twice.
- **Name a state with `\state[ID]`**, so it renders with its icon. Watch for names that are also
  mastery names: `aquatic-frog`'s "Rooted cataclysm" is the mastery, not state 5.
- **Never repeat a noun the token supplies.** `{s.payload}` already reads "10% of the shield broken",
  so "bursts for {s.payload} of what it was holding" says it twice. Same for `{s.radius}`, which
  carries its own "tiles".

## Budget

**Two lines**, at the width of the SDP header window. No overflow handling; the constraint lives in
the writing.

## Token vocabulary

Normalised 2026-09-07, after all 48 subgroups were written. Every token names **where its value comes
from**, so the resolver is four rules rather than a lookup table of invented names. Tokens emit the
**value only**, signed and formatted. Every noun is authored.

| Namespace | Reads | Example |
|---|---|---|
| `{p.<key>}` | A parameter delta on **the mastery state itself**, from its traits or its `<keyBuffPlus>` / `<keyBuffRate>` tags. Keys are ParameterRegistry keys. | `{p.def}` -> `+6%` |
| `{d.<key>}` | The same, but on **the delivered payload** the mastery points at, one hop down. | `{d.speedBoost}` -> `-5` |
| `{s.<field>}` | A **structural** value derived from the three-layer walk. Closed set, listed below. | `{s.radius}` -> `4 tiles` |
| `{v.<tag>}` | The raw value of a **named tag**, with `[n]` selecting an argument or an element id when the tag repeats. | `{v.boostElement[8]}` -> `+50%` |

`p.` and `d.` are the same rule pointed at different layers, and that distinction is load-bearing:
`aquatic-cephalopod` carries a permanent `{p.pdr}` on the mastery **and** a larger `{d.pdr}` on the
ink cloud it applies. Collapsing them would print one number twice.

`v.` needs no vocabulary of its own, being whatever tag the mastery happens to use. Only `s.` is a
closed set the resolver has to implement:

| Field | Resolves to |
|---|---|
| `s.gate` | The wrapper skill's `passiveSourceRule`, phrased per kind ("below 20% Life", "an ally within 6 tiles", "3 seconds") |
| `s.interval` | The cadence argument of `autoExecuteSkill` / `autoApplyState`, frames rendered as seconds |
| `s.duration` | The payload state's `stateDuration`, frames rendered as seconds |
| `s.window` | A lookback or validity window (`skillHistoryBonus` window, `attackedWithin`) |
| `s.radius` | Proximity, radius, or trigger tiles, whichever the mastery actually uses |
| `s.stacks` | The payload's `stackMax` |
| `s.chance` | A probability: an on-hit trait's value, `onCritApply`'s percent, a spread chance |
| `s.count` | A discrete count (`spreadPerTick`, `purgeStates` count) |
| `s.perStack` | The divisor of a `passiveStateCount` scaler ("every 4% of missing Life") |
| `s.payload` | The payload skill's damage or heal formula, pretty-printed ("2% of their Max Life + 2x your Resist") |
| `s.foodTypes` | The list of `extendType` food categories this tier covers |
| `s.statList` | The list of parameters this tier's traits raise |

**Formula-valued tags print their formula.** `aquatic-kappa`'s capstone is `<evaBuffPlus:[a.level]>`,
so `{v.evaBuffPlus}` renders as "your level" rather than a number. The same applies to
`{v.matBuffPlus}` (`beast-bearcat`) and `{v.sdpBonusFormula}` (`deity-devil`).

---

## Resolution status

**All 48 authored subgroups render every tier**, verified against the live database rather than
asserted. The resolver still **fails closed**: a subgroup shows fully-correct prose or none at all,
never a half-filled sentence quoting a number that is not the number.

| Namespace | How it resolves |
|---|---|
| `{v.<tag>}` | Reads the tag off the mastery state. A shape table says which argument holds the magnitude, because `onSelfHpHealMp:[PCT, RANGE]` and `boostElement:[ELEM, PCT]` disagree and guessing prints a plausible wrong number. Repeated tags that agree on a magnitude are not ambiguous; ones that disagree are refused. |
| `{p.<key>}` | Reads the parameter off the mastery state, from a buff tag, a plain tag, or the trait `ParameterTraitMap` names. A `BuffPlus` tag renders without a percent sign, because it adds points rather than a proportion. |
| `{d.<key>}` | The same, one hop down, against the payload the mastery delivers. |
| `{s.<field>}` | Derived from the three-layer walk: gates phrased per kind, cadences and durations rendered in seconds, reaches taken from the tag or the delivering skill, and damage or shield formulas read aloud. |

**Formulas are phrased, not quoted.** `(b.mhp * 0.02) + (a.mdf * 2)` becomes "2% of their Max Life
plus 2x your Resist"; `(b.mhp - b.hp) * 0.035` becomes "3.5% of their missing Life"; the standard
mitigation clause is dropped rather than read out. A formula that cannot be read term by term without
changing its meaning is refused outright.

---

## Status

**48 of 50 subgroups are written and approved.** All ten families are covered.

| Family | Subgroups | State |
|---|---|---|
| Undead | ghosty, reborn, wisp, skeleton, armor | approved |
| Reptile | snake, dargin, draconite, lamia, salamander | approved |
| Aquatic | kappa, frog, crab, fish, cephalopod | approved |
| Slime | puddle, roper, jelly, aerial, cube | approved |
| Plant | trap, fungus, dryad, treant, flower | approved |
| Beast | bearcat, bat, beaker, rat, quadruped | approved |
| Insect | needler, crawler, brood, scorpion, parasite | approved |
| Humanoid | minotaur, orc, bandit, cyclops, kobold | approved |
| Construct | titan, hazard, bot, puppet, orb | approved |
| Deity | elemental, emotion, devil | approved |
| Deity | sin, sin-votary | **undecided, and staying that way** |

`deity-sin` (1581-1590) carries ten named shells with zero tags: Glutton's, Wrath's, Envy's, Pride's,
Sloth's, Greed's, Lust's, Vanity's, Despair's and Irony's Dogma. `deity-sin-votary` (1591-1600) is ten
"Reserved" shells. Both are deliberately undecided; prose cannot precede mechanics, so neither gets
written until that changes.

> The cheatsheet still lists `SIN_8`-`SIN_10` as "Meta / padding, TBD", but those three are named now.

---

## Undead

### `undead-ghosty` (1101-1110)

| Act | Mechanics |
|---|---|
| 1-3 | +4/7/10% damage per unique skill used in the last 6s |
| 4-9 | +10% per unique, window grows 9 -> 24s |
| 10 | +15% per unique over 30s, plus 15% chance to inflict Emptiness on hit |

- **Beginning:** `Every trick you pull lingers. {v.skillHistoryBonus} damage for each unique skill in the last {s.window}.`
- **Middle:** `The dead remember longer than the living: {v.skillHistoryBonus} per unique skill, now recalled across {s.window}.`
- **End:** `Nothing you do is forgotten. {v.skillHistoryBonus} per unique skill over {s.window}, and your strikes leave Emptiness behind.`

### `undead-reborn` (1111-1120)

Payload: ward states 1001-1010.

| Act | Mechanics |
|---|---|
| 1-3 | Every 60s, a ward absorbing 5/10/15% Max Life + 10/20/30% Max Magi |
| 4-9 | Every 55 -> 30s, ward to 40% Life + 80% Magi, accumulating up to 2x a single pulse |
| 10 | Every 15s, 100% Life + 200% Magi, stacking 3x, and it protects rather than merely absorbs |

- **Beginning:** `Death did not finish the job. Every {s.interval}, a ward gathers worth {d.shield}.`
- **Middle:** `The pale wall thickens: a ward worth {d.shield} every {s.interval}, pooling up to {d.shieldCap}.`
- **End:** `Wraithwall eternal. Every {s.interval}, {d.shield} of ward, three layers deep, and it holds where flesh would fold.`

### `undead-wisp` (1121-1130)

Payload: aura skills 1001-1010.

| Act | Mechanics |
|---|---|
| 1-3 | Every 3s with an enemy within 3 tiles, a fire burst (radius 3) for MAT x3 -> x4; also on taking Life damage (0.5s cd) |
| 4-9 | MAT x5 -> x7.5, blast radius 3.33 -> 5, trigger range widens to 4 tiles at tier 7 |
| 10 | MAT x10, radius 5, extra pulses at 2 and 4 enemies near (1s each), damage-trigger loses its cooldown |

- **Beginning:** `You burn at the edges. Every {s.interval}, anything close enough takes {s.payload} fire, and hurting you only stokes it.`
- **Middle:** `The mantle spreads to {s.radius} tiles and bites for {s.payload}, still answering every wound with flame.`
- **End:** `A scorched halo. {s.payload} to everything within {s.radius}, pulsing faster the more of them there are, and every hit you take answers instantly.`

### `undead-skeleton` (1131-1140)

Payload: rage states 1011-1020. All states are per-stack.

| Act | Mechanics |
|---|---|
| 1-3 | One stack per 4% missing Life; each gives +1/2/3% Power and Force (caps 25 stacks) |
| 4-9 | +3% per stack, earned per 3.5% -> 1% missing Life (up to 100 stacks) |
| 10 | +5% Power and Force per stack, one per 1% missing Life, and Phys/Magi damage taken -50% |

- **Beginning:** `Bones do not flinch. Every {s.perStack} of Life you are missing feeds {d.atk} Power and Force.`
- **Middle:** `Graveborn fury sharpens as you fail: {d.atk} Power and Force for every {s.perStack} of Life gone.`
- **End:** `Deathless. {d.atk} Power and Force per {s.perStack} of missing Life, and everything that hits you does half of what it meant to.`

### `undead-armor` (1141-1150)

| Act | Mechanics |
|---|---|
| 1-3 | Endurance +6/9/12%, Max Life -2/4/6% |
| 4-9 | Endurance +28 -> +58%, Max Life -15 -> -34%, Parry +10 -> +30 |
| 10 | Endurance +100%, Max Life -50%, Parry +50, Crit Block +50%, crit damage taken -30% |

- **Beginning:** `The hollow armor plates over what it cannot heal: Endurance {p.def}, Max Life {p.mhp}.`
- **Middle:** `A brittle bastion still turns a blade. Endurance {p.def} and Parry {p.grd}, paid for with Max Life {p.mhp}.`
- **End:** `A paper fortress: Endurance {p.def} against Max Life {p.mhp}. Parry {p.grd}, Crit Block {p.ctr}, and crits land {v.critReduction} softer.`

---

## Reptile

### `reptile-snake` (1151-1160)

Payload: venom states 1021-1030.

| Act | Mechanics |
|---|---|
| 1-3 | Crits inject venom at 50/75/100%; ticks 1.5/2.0/2.5% of target Max Life (softened by their Resist). Reapply extends +3s, cap 10s |
| 4-9 | Every crit injects. Venom stacks 1 -> 6 deep, ticking 2.8 -> 3.8% each |
| 10 | 6% of current Life + 3.5% of missing Life per tick, extending +6s up to 20s |

- **Beginning:** `Your crits carry poison: {s.chance} to sink venom worth {d.hpFormula} a tick, and every fang after that keeps it alive longer.`
- **Middle:** `Nothing survives the second bite. Venom pools {s.stacks} deep, each layer draining {d.hpFormula}.`
- **End:** `A deluge. Venom takes {d.hpFormula} every tick and only ever gets worse the longer you keep landing crits.`

### `reptile-dargin` (1161-1170)

**Skill-gated:** `passiveSourceRule:[hpBelow, 20/30/40]`. A last-stand, not flat mitigation.

| Act | Mechanics |
|---|---|
| 1-3 | Below 20% Life: Phys/Magi damage taken -10/-15/-20% |
| 4-9 | Below 30% Life: -30 -> -60%, and Heat/Liquid/Air/Ground/Energy/Void 33% weaker |
| 10 | Below 40% Life: -80%, elements 66% weaker, immune to Burn, Trudge, Soften, Crush, Radiance, Emptiness |

- **Beginning:** `A dragon's heart only wakes when the end is close. Below {s.gate} Life, damage taken {p.pdr}.`
- **Middle:** `Dragonheart stirring, and stirring sooner: below {s.gate} Life, {p.pdr} to every blow and {p.elementRate} off every element.`
- **End:** `Dragonheart aflame. Below {s.gate} Life you take {p.pdr}, shrug {p.elementRate} off the elements, and nothing lesser can touch you at all.`

### `reptile-draconite` (1171-1180)

**Skill-gated:** `passiveSourceRule:[sinceLastMoved, 300/240/180]`. The Beginning act ramps the *wait*, not the number.

| Act | Mechanics |
|---|---|
| 1-3 | Still for 5s / 4s / 3s: Endurance +50% |
| 4-9 | Still for 3s: Endurance +75 -> +200% |
| 10 | Still for 3s: Endurance +300%, Parry +1000 |

- **Beginning:** `Hold still and the scales set like stone. Stand {s.gate} without moving for Endurance {p.def}.`
- **Middle:** `Stone mantle. {s.gate} of stillness and Endurance climbs {p.def}. The longer you plant, the less anything moves you.`
- **End:** `A granite bastion. {s.gate} unmoving buys Endurance {p.def} and Parry {p.grd}; blows simply stop arriving anywhere.`

### `reptile-lamia` (1181-1190)

`castTimeDamageBonus` is percent-per-second-of-cast.

| Act | Mechanics |
|---|---|
| 1-3 | +8/12/16% damage per second spent casting |
| 4-9 | +25 -> +50% per second, casts charge 5 -> 30% faster |
| 10 | +100% per second, charging 50% faster |

- **Beginning:** `Patience sharpens the beam: {v.castTimeDamageBonus} damage for every second you hold the cast.`
- **Middle:** `Converging light. {v.castTimeDamageBonus} per second charged, and the charge itself comes {v.castSpeedRate} quicker.`
- **End:** `Everything collapses to a point. {v.castTimeDamageBonus} damage per second held, at {v.castSpeedRate} the charge rate.`

### `reptile-salamander` (1191-1200)

| Act | Mechanics |
|---|---|
| 1-3 | Energy and Void damage +11/22/33% |
| 4-9 | Energy and Void at +50%; Heat, Liquid, Air, Ground climb +5 -> +30% |
| 10 | Cut/Poke/Blunt +25%, Heat/Liquid/Air/Ground +50%, Energy/Void +100% |

- **Beginning:** `Something primal runs under the skin. Energy and Void strike {v.boostElement[8]} harder.`
- **Middle:** `Attunement spreads outward: Energy and Void at {v.boostElement[8]}, and the four base elements answer to you too at {v.boostElement[4]}.`
- **End:** `A primal conduit. Every element in the world bends: nothing you throw lands at less than {v.boostElement[4]}, and Energy and Void hit for {v.boostElement[8]}.`

---

## Aquatic

### `aquatic-kappa` (1201-1210)

Tiers 1-9 use `dropMultiplier`; the capstone swaps to `dorBuffPlus` (drop *rate*). They math out
loosely equivalent, and deliberate.

| Act | Mechanics |
|---|---|
| 1-3 | Drops +4/7/10% |
| 4-9 | Drops +25 -> +50%, Grace +25 -> +50 |
| 10 | Drop rate, Grace and Luck each +your level |

- **Beginning:** `A kappa's luck rubs off. Enemies part with {v.dropMultiplier} more than they meant to.`
- **Middle:** `Fortune favors you twice: {v.dropMultiplier} more loot, and {p.eva} Grace to walk away with it.`
- **End:** `A trickster's gambit. Drop rate, Grace and Luck each climb by {v.evaBuffPlus}, and keep climbing every level you earn.`

### `aquatic-frog` (1211-1220)

Payload: Rooted Stance states 1031-1040. Stand still to build; moving strips.

| Act | Mechanics |
|---|---|
| 1-3 | A stack every 3s standing, max 3, each +5/10/15% Force. Moving loses **all** |
| 4-9 | A stack every 2s, max 3 -> 8, each +15 -> 25% Force. Still all-or-nothing |
| 10 | A stack every 1s, max 10, each +30% Force, and moving now costs **one** stack (`loseAllStacksAtOnce` is dropped) |

- **Beginning:** `Root yourself and the power gathers: a stack every {s.interval} standing still, {d.mat} Force each, gone the moment you move.`
- **Middle:** `A rooted tempest, {s.stacks} layers deep at {d.mat} Force apiece, but one step still costs you everything.`
- **End:** `Rooted cataclysm. {s.stacks} stacks at {d.mat} Force each, and at last you can move without losing it all: a step costs one stack, no more.`

### `aquatic-crab` (1221-1230)

Payload: thorn skills 1011-1020. `d` in those formulas is the HP damage that triggered the action.

| Act | Mechanics |
|---|---|
| 1-3 | Every physical hit taken returns 50/75/100% of that damage, unparryable, within 2 tiles |
| 4-9 | 133 -> 300% |
| 10 | 500% of the damage taken, plus 2.5x your Endurance |

- **Beginning:** `The shell answers for you. Every physical blow returns {s.payload} of what it dealt.`
- **Middle:** `An iron rebuke: {s.payload} of every hit thrown straight back, and nothing can parry it.`
- **End:** `Shellbreaker's retort returns {s.payload}, and it lands before they have finished swinging.`

### `aquatic-fish` (1231-1240)

**Skill-gated:** `passiveSourceRule:[attackedWithin, N]`, so it only runs just after something hits you.

| Act | Mechanics |
|---|---|
| 1-3 | For 1s after being attacked, move speed +5/10/15 |
| 4-9 | Window widens 1.25 -> 2.5s, speed +20 |
| 10 | Window 3s, speed +30, crit rate +1.25% |

- **Beginning:** `Too slippery to pin down. For {s.gate} after anything hits you, move {v.speedBoost} faster.`
- **Middle:** `A swift current carries you {s.gate} clear of whatever landed, at {v.speedBoost} speed.`
- **End:** `Slipstream. {s.gate} of {v.speedBoost} movement after every hit taken, and the opening you make is sharper for it.`

### `aquatic-cephalopod` (1241-1250)

Payload: ink states 1041-1050.

| Act | Mechanics |
|---|---|
| 1-3 | Taking Life damage clouds you 1s: -10/20/30% damage taken (8s cooldown) |
| 4-9 | 1.5 -> 3s of -40 -> -60% |
| 10 | Triggers on **any** damage, 4s of -60%, plus a permanent -10% phys/magi |

- **Beginning:** `Wounded, you vanish into ink: {s.duration} at {d.pdr} damage taken.`
- **Middle:** `A murky pall, {s.duration} long and {d.pdr} deep. They lose you exactly when it matters.`
- **End:** `The abyssal veil answers any harm at all: {s.duration} at {d.pdr}, and even in clear water you take {p.pdr} less.`

---

## Slime

### `slime-puddle` (1251-1260)

Payload: gel states 1051-1060. Taking Life damage coats you.

| Act | Mechanics |
|---|---|
| 1-3 | Every 3s, a 3s coat: 5/10/15% less Heat/Liquid/Air/Ground/Energy/Void |
| 4-9 | Every 2s, lasting 5 -> 8s, 25% less on those six, stacking 1 -> 3 |
| 10 | Every 1s, lasting 10s, 25% less on **all nine** elements, stacking 4 |

- **Beginning:** `Wounds teach the slime what hit it: {s.duration} of {d.elementRate} against the elements.`
- **Middle:** `Reactive gel, {s.stacks} layers thick and {s.duration} long. The more they burn you, the less it works.`
- **End:** `Elemental osmosis. {s.stacks} coats of {d.elementRate}, and now nothing elemental is unfamiliar: every element in the world, blunted.`

### `slime-roper` (1261-1270)

`perDebuffBuff:N` is +N% damage per `<type:negative>` state on the target.

| Act | Mechanics |
|---|---|
| 1-3 | +5/10/15% damage per debuff on them |
| 4-9 | +20 -> +45% per debuff, every hit inflicts Suffering (state 70, stacks to 25) |
| 10 | +50% per debuff, every hit inflicts **five** stacks of Suffering at once |

- **Beginning:** `Misery is an opening. {v.perDebuffBuff} more damage for every affliction already on them.`
- **Middle:** `An eldritch tempest feeds itself: {v.perDebuffBuff} per affliction, and every strike adds another.`
- **End:** `Eldritch maelstrom. {v.perDebuffBuff} per affliction, and each blow heaps five more on. The wound teaches the next one where to land.`

The synergy is the point: Suffering is itself a negative state, so it feeds the multiplier that applied it.

> **Known and deliberate (2026-09-07):** Suffering's `hpFormula` is `a.mhp*0.05`, meaning 5% of the
> **caster's** Max Life per tick, not the target's, arriving at tier 4 rather than the capstone.
> Jeremy is aware it was probably meant to be `b.mhp` and is leaving it to see how it plays.
> **Do not "fix" this without asking.**

### `slime-jelly` (1271-1280)

`onSelfHpHealMp:[PCT, RANGE]`: PCT of HP healing received also returns as MP; RANGE is the tile
radius of allies who also benefit (0 = self only).

| Act | Mechanics |
|---|---|
| 1-3 | Healing received also restores 10/20/30% of it as Magi, self only |
| 4-9 | 50%, reaching allies within 1 -> 6 tiles |
| 10 | Triggers on **any** healing, 50% within 6 tiles |

- **Beginning:** `Flesh knits and something else fills the gap: {v.onSelfHpHealMp} of any healing you take returns as Magi.`
- **Middle:** `Mana weave. {v.onSelfHpHealMp} of your healing becomes Magi, yours and every ally's within {s.radius}.`
- **End:** `Arcane transfusion: any healing at all, of any kind, pays {v.onSelfHpHealMp} back as Magi to everyone within {s.radius}.`

### `slime-aerial` (1281-1290)

Payload: heal-aura skills 1021-1030 (damage type 3, so recovery).

| Act | Mechanics |
|---|---|
| 1-3 | Every 8/7/6s, heal allies within 2 tiles for 2% of their Max Life + 2x your Resist |
| 4-9 | Every 5.5 -> 3s, 5% + 4x Resist, radius 2.5 -> 5 |
| 10 | Every 2s, 10% + 5x Resist, radius 5, plus a silent self-regen of 5% (`<hpPercent:5>` + `<noHpPopup>`) |

- **Beginning:** `Something restorative drifts off you. Every {s.interval}, allies nearby mend for {s.payload}.`
- **Middle:** `A miasma of life, {s.radius} tiles wide, mending {s.payload} every {s.interval}.`
- **End:** `Spore bloom. {s.payload} to everyone within {s.radius} every {s.interval}, and you knit yourself back together whether anyone notices or not.`

The capstone's self-regen is deliberately popup-less, so the prose is the only place a player learns it exists.

### `slime-cube` (1291-1300)

Payload: slow states 1061-1070. Every second, nearby enemies are re-slowed.

| Act | Mechanics |
|---|---|
| 1-3 | Gooped, stacking 1 -> 3, each -5 move speed, 1.5s |
| 4-9 | Enmired, stacking 5 -> 10, each -5 speed and -5% cast speed |
| 10 | Subsumed, stacking to 1000, each -5 speed, -5% cast, and +1% damage taken |

- **Beginning:** `You are an obstacle now. Anything near you slows by {d.speedBoost}, and keeps slowing while it stays.`
- **Middle:** `A living bulwark: {s.stacks} layers of mire, each stealing {d.speedBoost} of speed and fouling their casting.`
- **End:** `Immovable bulk. The mire never stops deepening: {d.speedBoost} slower with every stack, and every stack opens them {d.pdr} wider.`

---

## Plant

### `plant-trap` (1301-1310)

`stateDurationPerc:N` extends the duration of states this battler inflicts by N%.

| Act | Mechanics |
|---|---|
| 1-3 | States you inflict last +10/20/30% longer |
| 4-9 | +50 -> +100% longer |
| 10 | +200% longer, and +100% damage against anything Rooted (state 5) |

- **Beginning:** `What you inflict takes root. Every affliction you land lingers {v.stateDurationPerc} longer.`
- **Middle:** `A thorned curse holds twice as long: {v.stateDurationPerc} added to everything you put on them.`
- **End:** `Stranglethorn. Afflictions last {v.stateDurationPerc} longer, and anything already Rooted takes {v.bonusDamageIfState} from you.`

### `plant-fungus` (1311-1320)

**Skill-gated:** `passiveSourceRule:[allOffCooldown]`, so it pays out only while nothing is spent.
The Power line begins as a penalty and climbs out of it.

| Act | Mechanics |
|---|---|
| 1-3 | Crit Rate +10/20/30 |
| 4-9 | Crit +50 -> +100, Power -80% -> 0% |
| 10 | Crit +255, Power +155%, and `<bonus-hits-basic:2>` |

- **Beginning:** `Instinct sharpens in the waiting. With every skill ready, Crit Rate {p.cri}.`
- **Middle:** `A primal surge. Crit Rate {p.cri} while nothing is spent, though the coiling costs you {p.atk} Power to hold.`
- **End:** `Primal apex. Nothing spent, everything ready: Crit Rate {p.cri}, Power {p.atk}, and every basic attack lands {v.bonusHitsBasic} more times.`

### `plant-dryad` (1321-1330)

**Skill-gated:** `passiveSourceRule:[hpAbove, 75, allAllies, 8]`, so every ally within 8 tiles must be
above the threshold. The capstone makes the **gate easier**, not just the number bigger.

| Act | Mechanics |
|---|---|
| 1-3 | All allies above 75% Life: Force +10/20/30% |
| 4-9 | All allies above 75% Life: Force +50 -> +100%, Resist +50% |
| 10 | All allies above **50%** Life: Force +200%, Resist +100% |

- **Beginning:** `The grove answers a healthy wood. While every ally near you stands above {s.gate} Life, Force {p.mat}.`
- **Middle:** `Nature's ire: {p.mat} Force and {p.mdf} Resist, for as long as nobody around you is bleeding badly.`
- **End:** `Nature's judgment asks less and gives more. Allies need only hold {s.gate} Life for Force {p.mat} and Resist {p.mdf}.`

### `plant-treant` (1331-1340)

**Skill-gated:** `passiveSourceRule:[sinceLastHit, 480/300/120]`, and the wait shortens as you invest.

| Act | Mechanics |
|---|---|
| 1-3 | Untouched 8s: physical damage taken -5/10/15% |
| 4-9 | Untouched 5s: -20 -> -70%, Endurance +10 -> +35% |
| 10 | Untouched 2s: -90%, Endurance +50% |

- **Beginning:** `Bark thickens where nothing disturbs it. {s.gate} untouched and physical blows land {p.pdr} softer.`
- **Middle:** `Tempered ironbark, and quicker to set: {s.gate} clear buys {p.pdr} against physical harm and Endurance {p.def}.`
- **End:** `Ancient ironbark. Barely {s.gate} between blows and the wood closes over: physical damage {p.pdr}, Endurance {p.def}.`

### `plant-flower` (1341-1350)

The wrapper skill is a **real map skill** (radius/hitbox/direct/proximity + J-ABS-Juice tags), and the
state's `autoExecuteSkill` points at **the wrapper's own id**, so the skill is both the passive and its
own payload. Deliberate, not a mistake. `purgeStates:[TYPE, ALLOW_DEATH, COUNT]`.

| Act | Mechanics |
|---|---|
| 1-3 | Every 6s, cleanse 1 negative state from allies within 2/3/4 tiles |
| 4-9 | Every 5s, radius 5, cleansing 1 -> 6 states |
| 10 | Every 4s, radius 8, cleansing up to 100 (everything) |

- **Beginning:** `A quiet bloom every {s.interval} lifts one affliction from anyone within {s.radius}.`
- **Middle:** `Cleansing petals, {s.radius} tiles wide, stripping {s.count} afflictions off your allies every {s.interval}.`
- **End:** `A sacred bloom. Every {s.interval}, everything within {s.radius} is simply made clean, however much they were carrying.`

---

## Beast

### `beast-bearcat` (1351-1360)

`matBuffPlus:[a.atk*N]` converts Power into Force. The capstone makes the conversion **mutual**.

| Act | Mechanics |
|---|---|
| 1-3 | Force gains 10/20/30% of your Power |
| 4-9 | Force gains 50 -> 100% of Power, hits inflict Emptiness (state 14) at 3 -> 18% |
| 10 | Force gains 100% of Power **and** Power gains 100% of Force; Emptiness at 20% |

- **Beginning:** `Muscle and magic start to rhyme: Force rises by {v.matBuffPlus} of your Power.`
- **Middle:** `A void chord runs through every swing. Force takes {v.matBuffPlus} of your Power, and {s.chance} of your blows leave Emptiness behind.`
- **End:** `Void harmonics. Power feeds Force and Force feeds Power, each carrying {v.matBuffPlus} of the other, and {s.chance} of what you touch is unmade.`

### `beast-bat` (1361-1370)

**Skill-gated:** `passiveSourceRule:[alliesNearby, 1, N]`, and the radius grows as you invest.

| Act | Mechanics |
|---|---|
| 1-3 | An ally within 3 tiles: Accuracy +10/15/20% |
| 4-9 | Within 3 -> 8 tiles: Accuracy +33 -> +200%, Grace +5 -> +30% |
| 10 | Within 10 tiles: Accuracy +250%, Grace +50%, Tech Cost -25% |

- **Beginning:** `Bats do not hunt alone. With an ally inside {s.gate}, Accuracy {p.hit}.`
- **Middle:** `A chittering frenzy carries {s.gate} now: Accuracy {p.hit} and Grace {p.eva} for as long as someone flies with you.`
- **End:** `A wingbeat chorus reaches {s.gate}. Accuracy {p.hit}, Grace {p.eva}, and everything you do costs {p.tcr} less.`

### `beast-beaker` (1371-1380)

Payload: tailwind states 1071-1080. Any damage taken triggers a 3s burst.

| Act | Mechanics |
|---|---|
| 1-3 | Every 15/14/13s, damage grants +30 move speed for 3s |
| 4-9 | Cooldown 11 -> 6s, the gust adds Grace +30 -> +80 |
| 10 | Cooldown 6s, Grace +100 and Autocounter +100 |

- **Beginning:** `Harm sends you skyward: {s.duration} of {d.speedBoost} movement, once every {s.interval}.`
- **Middle:** `A rising gust, now every {s.interval}: {d.speedBoost} faster and {d.eva} harder to touch while it lasts.`
- **End:** `Gale force. Every {s.interval}, {s.duration} of {d.speedBoost} movement, {d.eva} Grace, and everything that swings at you answers to itself.`

### `beast-rat` (1381-1390)

**Skill-gated:** `passiveSourceRule:[alliesNearby, 1, N]`. The theme is the **leash lengthening**:
Jerald and Rupert drifting further apart and still sharing the hoard.

> **Fixed 2026-09-07.** Tiers 4-9 gated on `[alliesNearby, 2]` and tier 10 on `[alliesNearby, 3]`,
> which a two-person party can never satisfy (`nearbyAlliesExcludingSelf` caps at 1), so seven of the
> ten masteries, capstone included, were dead. The count is now 1 everywhere and the ramp moved to
> distance. **This was the only count-gate in all 500 masteries that assumed a bigger party.**

| Act | Mechanics |
|---|---|
| 1-3 | An ally within 5 tiles (plugin default): Aptitude gains +10/15/20% |
| 4-9 | Within 6 -> 11 tiles: Aptitude +25 -> +50%, Experience +25 -> +50% |
| 10 | Within 15 tiles: SDP points +100%, Aptitude +100%, Experience +100% |

- **Beginning:** `Rats hoard together. Keep an ally within {s.gate} and everything you learn sticks {v.aptMultiplier} better.`
- **Middle:** `A nest egg travels: the bond holds out to {s.gate} now, paying Aptitude {v.aptMultiplier} and Experience {p.exr}.`
- **End:** `Compound interest. Even {s.gate} apart the share still counts: points, Aptitude and Experience all at {v.aptMultiplier}.`

### `beast-quadruped` (1391-1400)

Payload: aura skills 1031-1040 (damage type 0, an add-state effect at 100%) delivering pack states
1081-1090. `mdfBuffPlus:[a.def * 0.5]` on the capstone state reads `a` as the **alpha** who applied it.

| Act | Mechanics |
|---|---|
| 1-3 | Every 10s, radius 2, allies gain Endurance +10/20/30% for 15s |
| 4-9 | Radius 3 -> 8, Endurance +50 -> +100% |
| 10 | Radius 8, Endurance +100%, and their Resist gains half of **your** Endurance |

- **Beginning:** `The pack looks to you. Every {s.interval}, allies within {s.radius} take Endurance {d.def}.`
- **Middle:** `An alpha's howl carries {s.radius}, bringing Endurance {d.def} to everyone who hears it.`
- **End:** `Pack sovereignty. Endurance {d.def} to all within {s.radius}, and your own guard becomes theirs: Resist rises by {d.mdf} of what you carry.`

---

## Insect

**Family combo:** Needler applies Poison and punishes the poisoned; Brood turns one poisoned target
into a room full of them. The two strips are built to be run together.

### `insect-needler` (1401-1410)

State 16 is Poison (ticks 3% of current Life, extends +3s on reapply).

| Act | Mechanics |
|---|---|
| 1-3 | Hits inflict Poison at 11/22/33% |
| 4-9 | Poison at 50 -> 100%, and +33 -> +200% damage against anything already poisoned |
| 10 | Poison at 100%, +250% damage against the poisoned |

- **Beginning:** `The sting carries something. {s.chance} of your hits leave Poison behind.`
- **Middle:** `A hive puncture finds the sickness first: {s.chance} to poison, and {v.bonusDamageIfStateType} more damage to anything already carrying it.`
- **End:** `Lance of the hive. Everything you touch is poisoned, and everything poisoned takes {v.bonusDamageIfStateType} from you.`

### `insect-crawler` (1411-1420)

Not a gate. `passiveStateCount:[N, enemiesNearby, 1]` on the **skill** stacks the mastery once per
nearby enemy. Every number is per enemy surrounding you. Being surrounded goes from lethal to desirable.

| Act | Mechanics (per nearby enemy) |
|---|---|
| 1-3 | Lifesteal +1/2/3% |
| 4-9 | Lifesteal +5 -> +10%, HP Regen +5 -> +30% |
| 10 | Lifesteal +15%, HP Regen +50%, crit damage taken -10% |

- **Beginning:** `The network feeds on company. Every enemy near you is worth {v.lst} Lifesteal.`
- **Middle:** `A spire synapse: {v.lst} Lifesteal and {p.hrg} regeneration for each one that crowds you.`
- **End:** `Spire dominion. Every body around you gives {v.lst} Lifesteal, {p.hrg} regeneration, and {v.critReduction} off the crits they land. Being surrounded is the point.`

### `insect-brood` (1421-1430)

| Act | Mechanics |
|---|---|
| 1-3 | Poison spreads at 33/66/100%, within 2 tiles, every 1.5s, 1 target at a time, preferring the clean |
| 4-9 | Always spreads, radius 3 -> 8, every 1.5s -> 0.67s, 2 -> 7 targets per tick, no longer choosy |
| 10 | Radius 10, every 0.5s, 10 targets per tick |

- **Beginning:** `Plague wants company. Poison you inflict jumps {v.spread[0]} of the time to anything within {v.spread[1]}.`
- **Middle:** `An endemic swarm: poison leaps {v.spread[1]}, taking {v.spreadPerTick} more of them every {v.spreadTick}.`
- **End:** `Pandemic. {v.spreadPerTick} new hosts every {v.spreadTick} out to {v.spread[1]}. Put it on one of them and it belongs to all of them.`

### `insect-scorpion` (1431-1440)

Payload: retaliation skills 1041-1050. The capstone carries `retaliate` **twice**, and that is the
qualitative shift, not a duplicated tag.

| Act | Mechanics |
|---|---|
| 1-3 | Physical hits taken strike back for Power x1 -> x2 + 5% of their Max Life, less their Endurance, within 2 tiles |
| 4-9 | Power x2 + 6 -> 11% of Max Life, within 4 tiles |
| 10 | Power x2 + 15% of Max Life, within 8 tiles, fired twice |

- **Beginning:** `Barbs answer every blow: {s.payload} back to whatever struck you within {s.radius}.`
- **Middle:** `A chitin lash reaches {s.radius} now, returning {s.payload} for every physical hit you take.`
- **End:** `Barbed retribution, and it lands twice: {s.payload} each time, to anything within {s.radius}.`

### `insect-parasite` (1441-1450)

`onSelfHpHealHp:[PCT, RANGE, MAX_DEPTH]`: being healed splashes a share onto everyone nearby.

| Act | Mechanics |
|---|---|
| 1-3 | Healing received splashes 11/22/33% to allies within 2 tiles |
| 4-9 | 50 -> 100% within 3 tiles, plus Magi restoration splashing 5 -> 30% |
| 10 | 100% Life within 4 tiles, 50% Magi, 25% Tech |

- **Beginning:** `What mends you mends the swarm: {v.onSelfHpHealHp} of any healing you take reaches allies within {s.radius}.`
- **Middle:** `A siphon weave, {s.radius} wide, sharing out {v.onSelfHpHealHp} of your healing and {v.onSelfMpHealMp} of your Magi.`
- **End:** `Cradle of leech. Every drop of Life, Magi and Tech that reaches you reaches everyone within {s.radius} too.`

---

## Humanoid

### `humanoid-minotaur` (1451-1460)

Payload: momentum states 1091-1100. `autoApplyState:[N, move, 1]` builds a stack per step;
`removeOnSkillResolution:[0, 100]` + `loseAllStacksAtOnce` spends every stack when a skill resolves.

| Act | Mechanics |
|---|---|
| 1-3 | Each step grants a stack, max 10, each +5/6/7% Power |
| 4-9 | Max 30 stacks, each +10 -> +15% Power |
| 10 | Max 1000 stacks, each +25% Power |

- **Beginning:** `Keep moving and it builds: {d.atk} Power a step, {s.stacks} deep, and the next skill you throw spends all of it.`
- **Middle:** `Gathering thunder, {s.stacks} steps' worth at {d.atk} apiece. Run further, hit once, hit enormously.`
- **End:** `Stampede. There is no ceiling worth naming: {d.atk} Power per step, and every step you have ever taken goes into the swing.`

### `humanoid-orc` (1461-1470): **one template**

The only strip so far that genuinely does not need three. Nothing changes across the acts except the
number: `cdr` 3/7/10% -> 12 -> 25% -> 30%. Proof that granularity is a per-subgroup call, not a rule.

- **All acts:** `A warchief does not wait. Every cooldown you carry runs {v.cdr} shorter.`

### `humanoid-bandit` (1471-1480)

The capstone chases three states deep: `onEvadeApplySelf:[63, 100]` applies **Very Grabby** (63),
which extends **Grab Ready!** (62), whose `skillTransform:[174,175]` turns *Half Roundhouse* into
*Nut Obliteration*, with a wider arc and no cooldown.

| Act | Mechanics |
|---|---|
| 1-3 | Hits Blind (state 18) at 10/20/30% |
| 4-9 | Blind at 50 -> 100%, Grace +5 -> +30 |
| 10 | Blind at 100%, Grace +50, and every dodge primes the grab |

- **Beginning:** `Fight dirty. {s.chance} of your hits leave them clawing at their eyes.`
- **Middle:** `A dirty trick every time: {s.chance} to Blind, and {p.eva} Grace while they swing at nothing.`
- **End:** `A blinding gambit. Everything you hit goes blind, and every dodge you make leaves them wide open to something far worse.`

### `humanoid-cyclops` (1481-1490)

State 5 is **Rooted** (cannot move), state 7 is **Disabled** (cannot use main/off/dodge/tool skills).
The cheatsheet said "disarmed" for the latter; corrected 2026-09-07.

| Act | Mechanics |
|---|---|
| 1-3 | Rooted resistance 34/67%, then immunity at tier 3 |
| 4-9 | Immune to Rooted; Disabled resistance 17 -> 84%, immunity at tier 9 |
| 10 | Immune to both, plus knockback resistance 50% |

- **Beginning:** `A thick skull has its uses. Roots hold you {p.stateRate} less, until they stop holding you at all.`
- **Middle:** `Stone temper: nothing roots you, and what would disable you slips {p.stateRate} of the time.`
- **End:** `An adamant mind. Neither root nor disabling touches you, and half of what would move you simply doesn't.`

### `humanoid-kobold` (1491-1500)

The most legible ramp in the set: one more food group and one more stat per tier.

> **Pending a tag swap (as of 2026-09-07):** the capstone currently carries `<overstuffedImpervious>`.
> Overstuffed is being retired as a concept in a separate food pass; `<foodChainImpervious>` replaces
> it, meaning "executing Metabolize no longer consumes the food chain." The End template below is
> already written for the replacement. **Do not swap the tag here.** That belongs to the food work.

| Act | Mechanics |
|---|---|
| 1-3 | Item Effects +33/66/100% |
| 4-9 | Item Effects +100%, food durations extend one category at a time (protein, veggie, fruit, carb, dairy, sweet), each tier adding +25% to another stat |
| 10 | All food extends, and Metabolize no longer consumes the chain |

- **Beginning:** `A field medic wastes nothing. Everything you consume works {p.pha} harder.`
- **Middle:** `Trail rations keep: {s.foodTypes} last longer on you, and the keeping shows in {s.statList} across the board.`
- **End:** `A battlefield banquet. Every food lingers, every stat it feeds climbs, and Metabolize no longer costs you the meal.`
- *End, alternate (implies rather than names the mechanic):* `A battlefield banquet. Every food you eat lingers and every stat it touches rises, and metabolizing burns none of it away.`

---

## Construct

**Family mirror:** Roper and Puppet pay for debuffs on *them*; Titan pays for debuffs on *you*.
Same verb, opposite direction.

### `construct-titan` (1501-1510)

`passiveStateCount:[N, negativeStateCount, 1]` on the **skill** stacks once per negative state on
**self**, to 100. Every number is per affliction you are carrying.

| Act | Mechanics (per debuff on you) |
|---|---|
| 1-3 | Power and Force +10/20/30% |
| 4-9 | Power and Force +50 -> +100%, Phys/Magi/Env damage taken -2 -> -7% |
| 10 | Power and Force +200%, all three damage types -10%, Lifesteal +10% |

- **Beginning:** `Nothing sticks to a titan. Every affliction you carry is worth {p.atk} Power and Force.`
- **Middle:** `A relentless march: each curse on you gives {p.atk} Power and Force, and {p.pdr} off everything they throw.`
- **End:** `Juggernaut. Every affliction feeds you {p.atk} Power and Force, {p.pdr} of protection, and {v.lst} Lifesteal. Let them pile on.`

### `construct-hazard` (1511-1520)

| Act | Mechanics |
|---|---|
| 1-3 | Areas are x1.05/1.10/1.15 wider |
| 4-9 | Radius **and** thickness x1.25 -> x1.50 |
| 10 | x1.50 both, plus a flat +0.5 radius and +0.5 thickness on top of the multiplier |

- **Beginning:** `Everything you throw lands wider: blast radius {v.radiusRate}.`
- **Middle:** `A blast front, not a blast point: {v.radiusRate} across and {v.thicknessRate} deep.`
- **End:** `Ground zero. {v.radiusRate} and {v.thicknessRate} on everything, and then more on top of that. There is no edge left to stand on.`

### `construct-bot` (1521-1530)

Payload: self-repair skills 1051-1060 (damage type 3). Every 5s, unconditionally. The capstone folds
`p`, skill proficiency, into the heal.

| Act | Mechanics |
|---|---|
| 1-3 | Repairs 1/2/3% of Max Life |
| 4-9 | 5 -> 10% of Max Life + 0.5 -> 1.0x your Resist |
| 10 | Same, plus your skill proficiency |

- **Beginning:** `The chassis maintains itself. Every {s.interval}, {s.payload} back, no thought required.`
- **Middle:** `A maintenance cycle worth {s.payload} every {s.interval}. Attrition simply stops working on you.`
- **End:** `Autonomic overdrive. {s.payload} every {s.interval}, and the better you get at fighting the more it mends.`

### `construct-puppet` (1531-1540)

State 7 is Disabled (cannot use main/off/dodge/tool skills), state 6 is Muted (cannot use combat skills).

| Act | Mechanics |
|---|---|
| 1-3 | +3/7/10% damage per debuff on the target |
| 4-9 | +10 -> +22% per debuff, hits Disable at 1 -> 6% |
| 10 | +33% per debuff, Disable at 10% and Mute at 10% |

- **Beginning:** `Every thread you tie pulls harder: {v.perDebuffBuff} more damage for each affliction on them.`
- **Middle:** `A soul bind. {v.perDebuffBuff} per affliction, and {s.chance} of your hits take their hands away entirely.`
- **End:** `Soul rend. {v.perDebuffBuff} per affliction, and every strike risks silencing them and disabling them both at once.`

### `construct-orb` (1541-1550)

Payload: shield-break skills 1061-1070. `s` in those formulas is `lastShieldBreakValue`; `a.sar` on the
capstone is the Shield Amp parameter.

| Act | Mechanics |
|---|---|
| 1-3 | Breaking a shield explodes for 10/15/20% of it, radius 2 |
| 4-9 | 30 -> 80%, radius 3 |
| 10 | The whole shield x your Shield Amp x 1.5, radius 4 |

- **Beginning:** `What you break, you spend. Shattering a shield bursts for {s.payload} of what it was holding, out to {s.radius}.`
- **Middle:** `A capacitor surge: {s.payload} of every broken shield thrown back out across {s.radius}.`
- **End:** `Meltdown. The entire shield detonates, amplified by your own, and everything within {s.radius} learns what it was holding back.`

---

## Deity

### `deity-elemental` (1551-1560)

`pierceElement:[ELEM, PCT]` cuts through their resistance rather than boosting your damage.

| Act | Mechanics |
|---|---|
| 1-3 | Pierce Heat, Liquid, Air, Ground resistance by 5/10/15% |
| 4-9 | Six elements, adding Energy and Void, at 25 -> 50% |
| 10 | All nine, including Cut, Poke and Blunt, at 75% |

- **Beginning:** `Resistance is a suggestion. The four great elements pierce {v.pierceElement} deeper.`
- **Middle:** `Elemental flux: six elements now, each cutting {v.pierceElement} through whatever they hide behind.`
- **End:** `An elemental singularity. Every element there is pierces {v.pierceElement}, and nothing is safe from anything.`

### `deity-emotion` (1561-1570)

The exact mirror of `insect-parasite`: there, healing **you** splashes onto allies. Here, healing an
**ally** feeds **you**.

| Act | Mechanics |
|---|---|
| 1-3 | An ally healed within 2 tiles gives you 5/10/15% of it |
| 4-9 | 25 -> 50% within 3 tiles, Magi as well as Life |
| 10 | 50% within 4 tiles, across Life, Magi and Tech |

- **Beginning:** `You feel what they feel. Whenever an ally within {s.radius} is mended, {v.onAllyHpHealHp} of it reaches you too.`
- **Middle:** `An empathic echo carries {s.radius}: {v.onAllyHpHealHp} of every kindness they receive lands on you as Life and Magi both.`
- **End:** `An empathic nexus. Life, Magi, Tech: anything that restores an ally within {s.radius} restores {v.onAllyHpHealHp} of it in you.`

### `deity-devil` (1571-1580)

`sdpBonusFormula:[a.getMasteryCount() * 0.01]` on the capstone reads the count of panels already
mastered, so the reward compounds against your own progress.

| Act | Mechanics |
|---|---|
| 1-3 | SDP points +3/7/10% |
| 4-9 | +15 -> +27% |
| 10 | +33%, plus a further +1% for every panel already mastered |

- **Beginning:** `A small bargain, honestly struck: {v.sdpMultiplier} more points from everything you kill.`
- **Middle:** `The devil's wager pays {v.sdpMultiplier}, and it has never yet asked for anything back.`
- **End:** `The devil's due. {v.sdpMultiplier} more points, and another {v.sdpBonusFormula} for every mastery you already carry. The debt compounds in your favor.`
