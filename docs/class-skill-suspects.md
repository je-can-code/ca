# Class Skill Suspects

As of 2026-11-25.

The scripted checks flagged 78 suspects across CA's 245 class skills, and none of them is verified yet. Some will be
intentional, and a skill can show up in more than one table.

Two of the bug kinds found on 2026-11-24 came back clean. No skill costs a state that nothing grants, and no follow-up
hangs off a missing skill or an ungranted state.

## Descriptions promising a state the skill never applies (12 skills)

Each description names a state, but the skill never applies, needs or removes it.

| ID | Skill | Class | State named | Description |
| --- | --- | --- | --- | --- |
| 316 | Numbness | Raving Lunatic | 70 Suffering | Incoming damage taken is halved. When hit, receive a stack of \state[70], taking max life % damage over time. |
| 368 | Trudge | Just Enough | 10 Trudge | Your attacks inherently become more sticky. Applies \state[10] on-hit. |
| 369 | Overdue | Just Enough | 89 Exasperated | Being in your presence makes it increasingly harder to exist. Your attacks apply \state[89], which self-stacks increasingly miserable conditions of taking more damage. |
| 382 | Lock-On | Try-Hard | 92 Locked | Lock onto your targets lets you apply \state[92] at the cost of draining your own TP. Executing again will conveniently delock, meaning you stop losing TP. |
| 406 | I Prefer Violence | Contemptuous | 15 Bleed | Your choices are distinct, and particularly bloody. Targets afflicted with \state[15] take more damage from you. |
| 459 | Malpractice | Malpractician | 123 Anti-bioexistence | Your maliciousness applies broad spectrum anti-bioexistence. All hits apply \state[123], reducing everything by 1%, stacking 100 times. |
| 475 | Handle Without Care | Strategist | 127 Careless | You do not handle foes with care, making every hit apply \state[127]. Every stack reduces critical evasion and crit resistance, making crits more frequent and painful. |
| 486 | Wildfire | Lavos | 9 Burn | Your flames are uncontainable! Your applied \state[9] now spreads to nearby foes. |
| 488 | Accelerant | Lavos | 9 Burn | Your flames burn with more passion than ever before! Your applied \state[9] now ticks twice as fast. |
| 578 | Equalize | Equilibrium | 157 Equation: Life and 158 Equation: Entropy | When you are in perfect harmony with the universe, you can be two things at once. Both \state[157] and \state[158] are perpetually active. |
| 623 | Eyes of the Rupert | Hexagonal | 178 Rupertified | Glare in a way only \N[2] can. Causes enemies who hurt you to gain \state[178], costing % max life per attack. |
| 625 | Rupert's Retinas | Hexagonal | 180 Mild Rupertification | Similar to \skill[623], but to a lesser effect, still cursing foes when you're struck. Applies \state[180], which causes less pain for less time, but still hurts. |

## Formulas whose hit type doesn't match their stats (10 skills)

The check expects physical hits to read ATK and DEF, magical hits to read MAT and MDF, and damage to never be a certain
hit.

| ID | Skill | Class | Hit type | Formula | Why |
| --- | --- | --- | --- | --- | --- |
| 312 | Tri-Viscerate | Raving Lunatic | Certain | `(a.atk*4) - (b.def*1)` | Certain hit on a damaging skill |
| 314 | Puree | Raving Lunatic | Certain | `(a.atk*5) - (b.def*1)` | Certain hit on a damaging skill |
| 331 | Caustic Void | Painbringer | Magical | `((a.atk*2) + (a.mat*4)) - (b.def*1)` | Magical, but reduced by DEF |
| 332 | Creeping Tendrils | Painbringer | Magical | `((a.atk*2) + (a.mat*10)) - (b.def*1)` | Magical, but reduced by DEF |
| 333 | Crashdown Cloud | Painbringer | Magical | `((a.atk*2) + (a.mat*8)) - (b.def*1)` | Magical, but reduced by DEF |
| 334 | Flambé du Vide | Painbringer | Magical | `((a.atk*2) + (a.mat*20)) - (b.def*1)` | Magical, but reduced by DEF |
| 351 | Mah Lazer | "Quicksilver" | Physical | `(a.mat*10) - (b.mdf*1)` | Physical, but scales on MAT and is reduced by MDF |
| 353 | Personal Space | "Quicksilver" | Certain | `(a.atk*2) - (b.def*1)` | Certain hit on a damaging skill |
| 381 | Button Mash | Try-Hard | Certain | `(a.mat*2) - (b.mdf*1)` | Certain hit on a damaging skill |
| 384 | The Big Red Button | Try-Hard | Certain | `(a.mat*10) - (b.mdf*1)` | Certain hit on a damaging skill |

## Big skills with no wind-up (22 skills)

Each is a 3000+ AP capstone or a large area with no `<castTime>`. Tags are trimmed to the ones that show what the skill
does.

| ID | Skill | Class | Why | Tags |
| --- | --- | --- | --- | --- |
| 314 | Puree | Raving Lunatic | 3000+ AP capstone | `<cooldown:180> <radius:2> <hitbox:circle> <duration:300> <pierce:[9999, 6]>` |
| 317 | Violence First | Raving Lunatic | 3000+ AP capstone | `<hideFromJabsMenu> <autoExecuteSkill:[317,onKill,0]>` |
| 318 | Diabolical | Raving Lunatic | 3000+ AP capstone | `<onCritSelf:[71,100]>` |
| 334 | Flambé du Vide | Painbringer | 3000+ AP capstone | `<thisBonusDamagePerStateStack:[72,10]> <thisBonusDamagePerStateStack:[73,10]> <thisBonusDamagePerStateStack:[74,5]>` |
| 351 | Mah Lazer | "Quicksilver" | Radius-10 line | `<cooldown:360> <radius:10> <hitbox:line> <thickness:2> <innerRadius:2>` |
| 364 | I Said Back Off | Just Enough | 3000+ AP capstone | `<projectile:10> <knockback:2> <pierce:[9999, 30]>` |
| 384 | The Big Red Button | Try-Hard | 3000+ AP capstone | `<thisBonusDamageIfTargetHpBelow:[90,10]>` |
| 404 | Entire Clip | Contemptuous | 3000+ AP capstone | `<knockback:6>` |
| 434 | Redeye | Orbiter | 3000+ AP capstone | none |
| 436 | Low-effort Durability | Orbiter | 3000+ AP capstone | `<extendType:low-effort>` |
| 438 | Low-effort Repel | Orbiter | 3000+ AP capstone | `<extendType:low-effort>` |
| 454 | SHIELD | Malpractician | 3000+ AP capstone | `<radius:0.5> <proximity:10> <targeted>` |
| 457 | Low-effort Aggression | Malpractician | 3000+ AP capstone | `<extendType:low-effort>` |
| 458 | Low-effort Recovery | Malpractician | 3000+ AP capstone | `<extendType:low-effort>` |
| 504 | Mince | Melufa | 3000+ AP capstone | `<ogcd> <degrees:270> <hitbox:arc> <duration:15> <bonus-hits:2> <pierce:[9999, 4]> <stackCost:[136,1]>` |
| 554 | Avenge | Methodical Dismantler | 3000+ AP capstone | `<degrees:45> <radius:3> <hitbox:arc> <knockback:10> <applyState:[8,100,360]>` |
| 574 | Equilibrium | Equilibrium | 3000+ AP capstone | `<applyState:[157,100,900]> <applyState:[158,100,900]>` |
| 601 | Miracle | RNGesus | Radius-15 circle | `<radius:15> <hitbox:circle> <proximity:10>` |
| 602 | Blessed | RNGesus | Radius-15 circle | `<radius:15> <hitbox:circle> <proximity:10>` |
| 603 | Benediction | RNGesus | Radius-15 circle | `<radius:15> <hitbox:circle> <proximity:10>` |
| 604 | Encore | RNGesus | Radius-15 circle and 3000+ AP capstone | `<radius:15> <hitbox:circle> <proximity:10>` |
| 624 | Uninstall | Hexagonal | 3000+ AP capstone | `<actionId:2> <radius:1.5> <proximity:10> <targeted>` |

## Skills with no actionId (32 skills)

With no `<actionId>`, a skill falls back to action event 1, which plays on the caster. The 15 self-target ones were
flagged at a lower level, as notes.

| ID | Skill | Class | Kind | Tags |
| --- | --- | --- | --- | --- |
| 264 | Earthen Defenses | Medick, via 422 Earthen Armor | direct | `<radius:0.5> <hitbox:circle> <direct>` |
| 266 | Forced Insertion | Orbiter, via 433 Reverse Injection and 438 Low-effort Repel | direct | `<radius:0.5> <hitbox:circle> <direct> <knockback:8>` |
| 267 | Illusion | Melufa, via 501 Heated Enchant, 503 Enchanted Whip and 504 Mince | direct | `<radius:1> <hitbox:circle> <direct> <onHitSelfState:[136,100]>` |
| 268 | Rapids | Melufa, via 502 Liquid Enchant, 503 Enchanted Whip and 504 Mince | direct | `<radius:1> <hitbox:circle> <direct> <onHitSelfState:[136,100]>` |
| 272 | Reallocation | Equilibrium, via 575 Reallocate | direct | `<radius:3> <hitbox:circle> <direct>` |
| 453 | Doomganosis | Malpractician | directLock | `<radius:0.5> <directLock> <targeted>` |
| 472 | Magic Bomb | Strategist | directLock | `<castTime:60> <radius:2> <directLock> <proximity:4> <targeted>` |
| 521 | Converge | The Architect | direct | `<radius:1> <direct> <proximity:8> <pullForward:5>` |
| 522 | Repel | The Architect | direct | `<radius:1> <direct> <proximity:8> <knockback:5>` |
| 523 | Compression | The Architect | direct | `<castTime:120> <radius:2> <hitbox:circle> <direct> <proximity:10> <duration:90> <pierce:[9999, 15]> <targeted>` |
| 304 | Barrel In | Fucking Oni | travel or multi-hit | `<cooldown:60> <dodge:3> <moveType:forward> <invincibleDodge>` |
| 354 | Triple Backflip Swan-dive | "Quicksilver" | travel or multi-hit | `<cooldown:60> <dodge:6> <dodgeSpeed:1> <moveType:backward> <invincibleDodge>` |
| 361 | Back Off | Just Enough | travel or multi-hit | `<knockback:2> <pierce:[9999, 30]>` |
| 364 | I Said Back Off | Just Enough | travel or multi-hit | `<projectile:10> <knockback:2> <pierce:[9999, 30]>` |
| 474 | Excuse Me | Strategist | travel or multi-hit | `<dodge:3> <moveType:directional> <invincibleDodge>` |
| 504 | Mince | Melufa | travel or multi-hit | `<ogcd> <degrees:270> <hitbox:arc> <duration:15> <bonus-hits:2> <pierce:[9999, 4]>` |
| 544 | Backpedal | Debilitator | travel or multi-hit | `<cooldown:90> <dodge:3> <dodgeSpeed:0.5> <moveType:backward>` |
| 303 | Angy Stance | Fucking Oni | self | `<toggleOnExecute:65>` |
| 313 | Running with Scissors | Raving Lunatic | self | `<cooldown:1200>` |
| 352 | Quick Exit | "Quicksilver" | self | `<toggleOnExecute:80>` |
| 382 | Lock-On | Try-Hard | self | `<toggleOnExecute:91>` |
| 401 | March | Contemptuous | self | `<toggleOnExecute:96>` |
| 402 | Shrapnel | Contemptuous | self | none |
| 422 | Earthen Armor | Medick | self | `<cooldown:1800>` |
| 434 | Redeye | Orbiter | self | none |
| 451 | Collateral Care | Malpractician | self | `<toggleOnExecute:114>` |
| 471 | Upper Hand | Strategist | self | none |
| 501 | Heated Enchant | Melufa | self | `<onCastRemoveState:[135,100]>` |
| 502 | Liquid Enchant | Melufa | self | `<onCastRemoveState:[134,100]>` |
| 571 | Rebalance | Equilibrium | self | `<toggleGroupOnExecute:[157,158]>` |
| 574 | Equilibrium | Equilibrium | self | `<applyState:[157,100,900]> <applyState:[158,100,900]>` |
| 623 | Eyes of the Rupert | Hexagonal | self | none |

## Shelved until the end of the review

**Painbringer's Null Acid gate (332 Creeping Tendrils, 333 Crashdown Cloud).**
- **The design:** Tendrils adds Creeping Tendrils (73) and Crashdown adds Corroding Resistance (74) only to targets
  that already have Null Acid (72). Crashdown also deals much more damage to those targets.
- **Why it stalled:** nothing in the engine can apply a state only when the target already has another one, and that
  question is where the skills were left unfinished.
- **What exists:**
  - The `IfAfflicted` tags check the caster, not the target.
  - `<autoInflictState>` isn't tied to one skill.
  - `<stacksConvertToState>` reads only its first tag.
- **The plan:** a new tag is in order. Once it exists:
  - Both skills stop applying their second debuff unconditionally.
  - Crashdown gets `<thisBonusDamageIfState:[72, PCT]>`. Before relying on it, confirm the bonus is read before that
    hit's own Null Acid lands.

**State refresh diminishing returns never engage (J-ABS).**
- **What it should do:** CA's J-ABS settings cut each repeat refresh of a state by 120 frames
  (`defaultStateRefreshDiminish`), counted within a 900-frame window (`defaultStateRefreshReset`), so a state
  reapplied over and over gets shorter each time.
- **What happens:** `JABS_Engine.refreshJabsState` multiplies the cut by `JABS_State.timesRefreshed`, and nothing ever
  increments that count. Its declaration, that read and the reset to 0 are the only references. So the cut is always
  zero, and every refresh, stuns and roots included, gets full duration.
- **His design:** it exists so nobody gets stun-locked forever. Only `<type:negative>` states should diminish. Every
  other state is opted out by default, so buffs recast to stack, like Fine. and Confetti every 8 s, are never cut.
- **Why it waits:** it's a balance question as much as a bug, to talk through at the end.

**Boss payloads with a telegraph never show it (2318 Mycelial Net, 2337 Nine Worlds, 2596 Goop Geyser).** Read in
source, not seen in play. These are the ones a sweep of skill, state, equipment, actor, class and enemy notes found.
Boss routine steps were swept by an assumed config shape, so treat that part as unchecked.
- **What they should do:** each is a placed, telegraphed hit. It has its own action event (32, 48 and 47), a radius
  (3, 1.5 and 1) and a `<delay>`, and Goop Geyser also has `<knockback:2>`.
- **What happens:** all three are `<direct>` payloads fired through a forced path. Mycelial Net and Nine Worlds come
  from their vessel skills' `<onCastExecuteSkill>`, and Goop Geyser from Goop Vent's (590)
  `<autoExecuteSkill:[2596, enemiesNearby, 1, 120, 6]>`. Those paths hand `forceMapAction` no coordinates (since
  J-Passive-Conditional 1.6.0 only the hit-driven `onDamageDealt`/`onWeaponHit` rules aim at a target, and Goop Vent's
  proximity rule is not one), and a direct action with no coordinates never spawns on the map
  (`JABS_Engine.handleActionGeneration`, pinned by its tests). Instead it takes the caster-proximity collision path,
  and the delay still counts down. So nothing is drawn, and when the delay ends the hit lands on every party member
  within the payload's proximity of the caster (20, 20 and 6 tiles), with nowhere to dodge. A direct action also
  never knocks back; it hops in place.
- **Not affected:** the aura payloads (Regeneration Aura, Purifying Bloom and the rest) and the gap-close landings
  2594 Embrace and 2612 Execute. They are `<direct>` with a `<proximity>` sized as their reach, so the caster-proximity
  path is what they want.
- **Why it waits:** a fix needs the forced paths to supply a target tile, and it can't change what the aura payloads
  rely on. That's an engine call, and these are boss skills, outside the class review.
- **Found while:** building Melufa. Its follow-ups 267 and 268 and Orbiter's 266 had the same fault, and with no
  `<proximity>` they hit every enemy on the map. 267 and 268 now carry `<proximity:1.5>` and action event 2, and since
  rmmz-plugins #135 the enchant's weapon-hit rule lands them on the foe each hit struck. 266 dropped `<direct>`, so it
  spawns on its caster and its knockback works.
