# Class Skill Suspects

As of 2026-11-25.

**Status, 2026-11-27:** the review is finished. It lands with Chef Adventure #111 and rmmz-plugins #135, which merge
together. The tables below were its starting list, worked through kit by kit. What it left for the end is in the last
three sections, and each entry there carries what it needs to be picked up on its own.

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
- **The design:** Tendrils adds state 73 and Crashdown adds Corroding Resistance (74) only to targets that already
  have Null Acid (72). Crashdown also deals much more damage to those targets. The source is the skill table in
  `docs/classes/jerald/trunk-1-fucking-oni/fork-b-painbringer.md`, which calls 73 Tangling Shadows; the database
  names it Creeping Tendrils, the same as the skill.
- **Today's data:** both skills apply both of their states on every hit, and their descriptions say so.
  - 332: Add State 72 at 100%, then Add State 73 at 100%. "Applies \state[72] and \state[73] to everything in a wide
    line in front."
  - 333: Add State 72 at 100%, then Add State 74 at 100%. "Applies \state[72] and \state[74]."
  - 72 Null Acid: `<stackMax:25> <hpFormula:[a.hp*0.02]> <stateDuration:60> <type:poison> <stackOnExpire>`.
  - 73: `<stackMax:25> <indefiniteState> <speedBoost:-3> <type:poison>`.
  - 74: `<stackMax:50> <indefiniteState> <type:poison>`.
  - 334 Flambé du Vide reads all three: `<thisBonusDamagePerStateStack:[72,10]>`, `[73,10]` and `[74,5]`.
- **Why it stalled:** nothing in the engine can apply a state only when the target already has another one, and that
  question is where the skills were left unfinished.
- **What exists:**
  - The `IfAfflicted` tags check the caster, not the target.
  - `<autoInflictState>` isn't tied to one skill.
  - `<stacksConvertToState>` reads only its first tag.
- **The ordering trap:** J-ABS's `Game_Action#executeJabsAction` works out a hit's damage first, then applies the
  skill's effects in list order. So by the time the 73 or 74 effect runs, that same hit's Null Acid has already
  landed, and a gate that only asks "does the target have 72?" at that moment passes on the target's very first hit.
  The gate has to judge the target as it stood before the hit.
- **Crashdown's bonus is safe to build on:** `<thisBonusDamageIfState:[72, PCT]>` is read while the damage is worked
  out (`makeDamageValue`, then `applyStateDamageMultipliers`), before any of the hit's effects land. So it only counts
  Null Acid from earlier hits.
- **The new tag rolls like every other chance state:** through the shared fate roll
  (`Game_Action#resolveStateProcCountAgainst`, into `JABS_Fate`), so resistances, luck on `<type:negative>` states and
  `<immuneToFate>` keep applying to it.
- **To settle:**
  - Where the condition lives: on the skill, gating only that skill's application, or on the state, so 73 and 74
    never land without 72 whatever applies them.
  - Whether the Null Acid has to be the caster's own (Melting counts only the states Jerald authored) or anyone's.
  - Crashdown's bonus PCT.
  - 72, 73 and 74 carry only `<type:poison>`. The later kits gave their debuffs `<type:negative>` (151-153, 176, 178
    and 180), which is what luck weighs on, and what the refresh diminishing below would key on.
- **Once the tag exists:** both skills stop applying their second debuff unconditionally, their descriptions say so,
  and Crashdown gets its bonus.
- **Built 2026-11-27, his calls:** J-Extend 1.10.0 (rmmz-plugins #135) adds `<thisApplyStateWhenAfflicted:[APPLYING,
  NECESSARY, CHANCE]>` on the skill, plus the caster-wide `<applyStateWhenAfflicted>` for weapons and states ("a
  weapon that applied terrible bleeding if already bleeding"). It judges the target before the hit and rolls through
  the shared fate roll. Anyone's Null Acid counts; only 331-334 apply it. Tendrils carries `[73, 72, 100]`, Crashdown
  `[74, 72, 100]` and `<thisBonusDamageIfState:[72, 300]>` (+300%, so x4), and both descriptions say so.
  - **Live, 20 trials each through `Game_Action#apply` on the Parry Floor dummy:** the first hit left 72 alone 20/20
    and the second added the gated state 20/20, for both skills. Crashdown's median damage went 148 -> 592 (x4.00).
  - **Still open:** whether 72-74 should also carry `<type:negative>`.

**State refresh diminishing returns never engage (J-ABS).**
- **What it should do:** CA's J-ABS settings cut each repeat refresh of a state by 120 frames
  (`defaultStateRefreshDiminish`), counted within a 900-frame window (`defaultStateRefreshReset`), so a state
  reapplied over and over gets shorter each time. A state can set its own with `<stateRefreshDiminish:N>` and
  `<stateRefreshReset:N>`.
- **What happens:** `JABS_Engine#refreshJabsState` multiplies the cut by `JABS_State.timesRefreshed`, and nothing ever
  increments that count. Its declaration, that read and the reset to 0 (`JABS_State#handleDiminishedRefresh`, once the
  window runs out) are the only references, and `JABS_State#hasDiminishingRefresh` has no callers. So the cut is
  always zero, and every refresh, stuns and roots included, gets full duration.
- **How far it reaches:** CA's default reapply type is `stack` (`defaultStateReapplyType` in
  `chef-adventure/js/plugins.js`), and a stack reapply ends in `refreshJabsState` too. So a working cut would reach
  every timed state but the seven `<stackType:extend>` ones (16 Poison, 17 Seal, 1021, 1022, 1025, 1656 and 1658).
  64 states carry `<type:negative>`. Only 19 Serum Regen and 20 Ether Regen opt out, with `<stateRefreshDiminish:0>`,
  and no state sets its own `<stateRefreshReset>`.
- **Two faults the dead count hides:**
  - **No floor.** The refreshed duration is clamped at -1, not at a minimum. A cut equal to the new duration skips the
    refresh, and a bigger one sets -1, which runs the state's expiry on the next frame. If the count went up after
    each refresh, Shell Cracker's 180-frame stun (one stack, CA's default cap) would last 60 frames on its second
    refresh inside the window, and its third would end the stun on the spot.
  - **The per-state window never sticks.** `refreshJabsState` sets the reset counter to the state's
    `<stateRefreshReset>`, then `JABS_State#refreshDuration` sets it back to the global default straight after.
  - **The count dies with the state (found 2026-11-27).** The count and its window live on the state's tracker, and
    J-ABS's `Game_Battler#removeState` alias deletes the tracker when the state ends, so the next application takes
    the add path with a fresh tracker. Even a working count only sees a reapply while the state is still on: stun,
    let it lapse, stun again starts at zero every time, which is the chain-stun the design exists to stop.
- **Scope data:** 15 of the 64 `<type:negative>` states also carry `<type:cc>` (4-8, 10, 148, 151, 175, 1696, 1770,
  2006, 2067, 2076, 2080), all single-stack. The other negatives include the stack-builders (Burn x30, Bleed and
  Hemorrhage x1000, Blind and Impaled x10), where every stack-adding hit is also a refresh under CA's stack default.
  Pinned (28) is negative without `cc`, so the `cc` list may not be the whole stun-lock set.
- **His design:** it exists so nobody gets stun-locked forever. Only `<type:negative>` states should diminish. Every
  other state is opted out by default, so buffs recast to stack, like Fine. and Confetti every 8 s, are never cut.
- **To settle:** a flat cut or a share of the new duration, since 120 frames is most of a short stun; the floor, as a
  minimum duration or as no refresh at all; and whether a reapply that adds stacks counts toward the cut.
- **Why it waits:** it's a balance question as much as a bug, to talk through at the end.
- **Parked, 2026-11-27 (his call):** full refresh every time stays for now. The cut has never engaged in anything CA
  loads, so every kit and enemy stun was tuned on full refresh; turning diminishing on is the change that would need
  re-tuning. Pick it back up once play shows whether stun-lock is a real problem.

**Boss payloads with a telegraph never show it (2318 Mycelial Net, 2337 Nine Worlds, 2596 Goop Geyser).** Read in
source, not seen in play. These are the ones a sweep of skill, state, equipment, actor, class and enemy notes found.
Boss routine steps were swept by an assumed config shape, so treat that part as unchecked.
- **Who fires them:**
  - Mycelial Net: vessel skill 2315's `<onCastExecuteSkill:[2318, 100]>`, cast by Mycelich (314) and Fungod (315).
  - Nine Worlds: vessel skill 2335's `<onCastExecuteSkill:[2337, 100]>`, cast by Yggdrasil (340).
  - Goop Geyser: the Goop Vent enemy (590), an inanimate vent, through
    `<autoExecuteSkill:[2596, enemiesNearby, 1, 120, 6]>`.
- **What they should do:** each is a placed, telegraphed hit. It has its own action event (32, 48 and 47), a radius
  (3, 1.5 and 1) and a `<delay>` (30, 45 and 45 frames).
- **What happens:** all three are `<direct>` payloads fired through a forced path. J-Extend's on-cast execute calls
  `JABS_Engine#forceMapAction(caster, skillId, false)` with no target tile, and J-Passive-Conditional's
  `AutoExecuteSkillManager` aims only the hit-driven `onDamageDealt`/`onWeaponHit` rules at a target (since
  J-Passive-Conditional 1.6.0); Goop Vent's proximity rule is not one. A direct action with no coordinates never
  spawns on the map (`JABS_Engine#handleActionGeneration`, pinned by its tests). Instead it takes the caster-proximity
  collision path, and the delay still counts down. So nothing is drawn, and when the delay ends the hit lands on every
  party member within the payload's proximity of the caster (20, 20 and 6 tiles), with nowhere to dodge.
- **Knockback:** a direct action never knocks back; it hops in place. That's why Goop Geyser's `<knockback:2>` became
  `<hitstop:8>`, along with the other direct enemy skills.
- **Not affected:** the aura payloads (Regeneration Aura, Purifying Bloom and the rest) and the gap-close landings
  2594 Embrace and 2612 Execute. They are `<direct>` with a `<proximity>` sized as their reach, so the caster-proximity
  path is what they want.
- **Seen in play, 2026-11-27** (the Parry Floor dummy casting each boss's own skill through the same engine calls;
  probe `/tmp/claude-scratch/dr/watch-probe-2.js`, clip sent to him):
  - Mycelial Net: the vessel's purple swirl landed on the tile the player stood on and missed once he stepped 5
    tiles off. The payload had no map event; its only visual was a faint radius ring around the caster. It hit
    Jerald 6 tiles away 5 times, about once a second, poisoning him each time.
  - Nine Worlds: the 2336 nova's eight crescents fly visibly out from the caster. 2337 had no map event and hit Jerald
    11 tiles away after its 45-frame delay, with nothing on screen first.
  - Goop Geyser: nothing on screen, then a splash on Jerald for 54 at 5 tiles; at 9 tiles it never landed.
  - Rupert stood on Jerald's tile throughout and none of the payloads hit him; not looked into.
- **`<targeted>` is J-ABS-Targeting's player reticle:** only the player's input adapter reads it, so it does nothing
  on a boss skill. The boss casts already get the target's tile from the AI.
- **Boss routine `forceSkill` steps, now checked** (the key is `skill`, not `skillId`): 34 steps, 13 skills, 11
  direct. `cast: true` steps wind up and execute through the AI's decided-action path at the boss's target (Earthie's
  Rockfall 2554, Sloth's Heartbeat 2590, Lust's Desire 2593). The `cast: false` ones are arena-wide by design
  (Brand of Cynder 2552 proximity 50; Absolute Solitude 2587, Wings of Wrath 2375 radius 99) or radius-less (Power
  of Wrath 2589). So the three above are the whole list.
- **His call 17:07: stop force-firing them; the boss casts them like normal spells.** Proposed (not yet approved):
  - Mycelial Net and Nine Worlds through J-ABS's enemy combo chain, the Hard Syrup (2256 -> 2257) and Big Bad
    (2396 -> 2397) pattern: the vessel drops `<onCastExecuteSkill>` for the direct payload and gains
    `<combo:[PAYLOAD, 0]>`, `<comboStarter>` and `<freeCombo>`; the payload joins the boss's action list with
    `<aiSkillExclusion>`. Nine Worlds' nova 2336 stays force-fired (non-direct, visible).
  - The Goop Vent is `<jabsConfig:inanimate>`, which suppresses all combat AI, so it cannot cast. Asked him: make it
    a pinned real caster (drop inanimate) or keep it a prop and make the geyser a visible non-direct eruption at the
    vent.
- **His calls 17:18:** Net and Worlds "sounds good for now". Geyser: "make it a real caster, but lock it down from
  moving (`<rooted>` or passive with rooted?)".
  - **Snag, read in source:** `JABS_Battler#isMovementLockedByState` reads `getBattler().states()`, which holds no
    passives (J-Passive adds them to `allStates()` only), so a passive `<rooted>` pins nothing. A real root
    pins, but `JABS_AiManager.needsRepositioning` bails when `canBattlerMove()` is false, and the only AI path to
    `setInPosition(true)` is `decideAiPhase2Movement` behind it, so a rooted AI battler decides and never fires.
    Only `JabsBossManager`'s forced cast sets in-position for immobile bosses.
  - **Proposed J-ABS fix (#135):** movement lock reads passives too (no CA passive grants a locking state today), and
    a battler that cannot move fires from where it stands once its target is in reach. This also stops ordinary roots
    from freezing an in-reach enemy's attack. Vent data: drop inanimate and the auto-execute, add Bolted Down (2091)
    to its passives, keep the HP bar hidden.
- **His calls 18:20-18:31:** "passive SHOULD count towards AI decisions like movement. Fix that." Fire-from-where-it-
  stands: "Yep add that" (after proximity 20 was shown not to help: the reach check lives inside the movement step).
- **Found before building (18:4x), raised with him:**
  - The scan for lock passives is now complete: database notes, every map's event comments (the vent template's own
    `<passive:[2079, 183]>` is Scrambled and No Rewards), configs, and the rule tags. None grants a lock. Event comment
    passives add to the enemy row's (J-Passive-Affix's postConvertMutate), so 2091 goes on enemy 590.
  - Bolted Down's `<disabled>` only blocks the vent's basic attack (trait 35 -> skill 2511), not 2596.
  - Idle wandering ignores roots: `JABS_AiManager.canMoveIdly` never checks the movement lock (seekForAlerter and goHome
    do), so a rooted idle battler still `moveRandom`s. Needs a guard for the vent.
  - **Boss scripts root their bosses:** Earthie (Sealed), Wrath (Rooted x8), Garuda (x6), Skye (x10), Gloria (Sealed),
    Sloth (Sealed, Stilled), Lust (Stilled, Overreached), Grudj (Bolted Down, so I was wrong that nothing uses 2091).
    All eight are `aiControl: shared`, so their normal AI runs alongside; today a root stalls it short of position.
    A general fire-from-where-it-stands would let those bosses cast regular skills during their scripted holds.
    Offered: narrow (only a passive movement lock fires from where it stands) or broad (all roots, plus muting the
    holds meant to stop everything, fight by fight). Leaned narrow.
- **His call 19:09: broad, with "bosses don't get rooted, they get paralyzed ... because the boss script force
  executes the action".** Confirmed in source: neither forced path (`cast: false` through `forceMapAction`, `cast:
  true` through the decided-action path and `#landForcedCast`) checks mute or disable, and a paralyzed boss's own AI
  can decide nothing.
- **Built 2026-11-27:**
  - J-ABS 4.30.0 (#135): the three lock checks read `allStates()`; `isSkillLockedOutByState` (keeps the both-locked
    fast path); `canFireFromWhereItStands` plus one `aiPhase2` step, which also refuses a decided action the locks now
    forbid; `canMoveIdly` respects the movement lock. Tests, book pages for all four lock tags, glossary, changelog.
  - CA (#111, `kit-boss-payloads.js`): the combo chains (2315 -> 2318, 2335 -> 2337, followers in the action lists
    with `<aiSkillExclusion>`); the vent (no inanimate or auto-execute, Bolted Down passive, noHpBar, sight 6 MY pick);
    Sealed, Stilled and Overreached are `<paralyzed>`. Wrath's, Garuda's and Skye's 24 self-roots first went to
    Paralyzed (4), but Wrath's boss (enemy 582, Vampire King) resists state 4 by id, so they now use a new state, Held
    (2092, `kit-boss-held.js`): Rooted's row (120 frames, EVA -10, negative and cc) with `<paralyzed>`, Paralyzed's
    icon; name and icon are MY picks. Live on a spawned Lucian, added the way the script adds it: Paralyzed landed false,
    Held landed with movement, attacks and skills locked, a cast:false Wave of the Void fired through it, and his own AI
    decided nothing for the 100 frames watched (the wave then knocked Jerald onto the stairs). A boss already lined up
    to fire when a hold lands still fires that one action (needsActionExecution does not re-check locks), as it did
    under the old roots.
  - **Live (probes `watch-probe-4.js`, `-5.js`):** Mycelich's drop landed on the player's tile with its swirl, then
    its AI followed up with the lingering net on the same tile, map event and all, ticking about once a second.
    Yggdrasil's crescents flew, then the ninth root came as its own cast with a map event on the player's tile, landing
    about 45 frames later. The vent held its spot (Bolted Down among its states), waited while the player stood 8
    tiles off, then dropped the geyser on a telegraphed tile; stepping out during it made it miss. Yggdrasil has
    `<sight:2>`, so it needs a player within 2 tiles to engage. Clip sent.
- **To settle:** where each hit should land once a forced path can aim it: on whoever the boss is targeting, on a
  party member in range, or, for Goop Geyser, on the foe that tripped `enemiesNearby`.
- **Why it waits:** a fix needs the forced paths to supply a target tile, and it can't change what the aura payloads
  rely on. That's an engine call, and these are boss skills, outside the class review.
- **Found while:** building Melufa. Its follow-ups 267 and 268 and Orbiter's 266 had the same fault, and with no
  `<proximity>` they hit every enemy on the map. 267 and 268 now carry `<proximity:1.5>` and action event 2, and since
  rmmz-plugins #135 the enchant's weapon-hit rule lands them on the foe each hit struck. 266 dropped `<direct>`, so it
  spawns on its caster and its knockback works.

## To discuss at the end of the review

**A pass on passive descriptions (his, 2026-11-26).**
- **How the lines get drawn:** the Passives detail window draws a passive's traits, then one line for each tag that
  has a describer. Describers register with J-Base's `NotetagDescriber` at boot, from one `describe*Notetags.js` per
  plugin: J-ABS, J-CriticalFactors, J-DropsControl, J-Elementalistics, J-NaturalGrowth, J-Passive, J-Passive-Affix,
  J-Passive-Conditional and J-Proficiency. The words live in `chef-adventure/data/config.notetag-lines.json` under
  each tag's key, and a tag with no line there says nothing.
- **The example:** Deliberate Position (144) got its line on 11-26 through J-ABS's first describer
  (`pierceDamageRateIfStateType`). It is still J-ABS's only one, so most J-ABS tags draw nothing.
- **Scope:** he wrote the SDP passives' lines, but likely skipped the passives earned from weapon proficiency (each
  conditional's `skillRewards` in `config.proficiency.json`) and from class skills (the skills each class teaches
  through `<aptitude>`, whose `<passive:[...]>` names the states).
- **First step:** list every tag those passive states carry that has no describer, or no line, so the work is sized
  before any words get written.

**AP gaining vs "AP spending" for class skill and passive unlocks (his, 2026-11-26).** Whether a class skill or passive
unlocks by earning AP toward it, or by spending AP on it.
- **How it works today, by earning (J-Aptitude):** each class lists the skills it teaches as
  `<aptitude:[SKILL_ID, REQUIRED_AP]>`, 282 of them across Classes.json. Defeated enemies pay `<ap:N>`, scaled by
  `<aptMultiplier>`, into every source active on the actor: its class, plus any equipment or state with an
  `<aptitude>` of its own (CA has none). Progress is tracked per source, and a skill is learned the moment one source's
  requirement is crossed. The capstones sit at 3000 AP and up.
- **Spending would mean:** AP becomes a currency the player spends on the skills and passives they pick, in the order
  they pick. J-Aptitude has no such mode today.

## Live check still to run

**The shared fate roll on the Parry Floor.** rmmz-plugins' tests cover this; the check confirms it in the running game.
- **What it confirms:** every chance state rolls through the shared fate roll wherever it lands, so a Certain Hit no
  longer skips the target's resistances, and luck weighs only on `<type:negative>` states.
- **Where:** the Parry Floor (Map555), against the Parry Dummy (enemy 603: LUK 10, no immunities). Blocks A and B hold
  the dummy's State Rate for their state at 100%, 50% and 0%, and count landings over 2000 trials per rate.
  - **A, `<thisApplyState>`:** Shell Cracker (552) carries `<thisApplyState:[8,100,180]>`, Stunned at 100%. Landings
    should follow the State Rate, down to none at 0%.
  - **B, a Certain Hit's Add State:** Doom (593) puts Doom Countdown (165) on at 75%. A Certain Hit used to skip the
    State Rate. Doom Countdown is `<type:negative>`, so the luck between caster and dummy moves the 75%; what matters
    is that landings fall with the State Rate and stop at 0%.
  - **C, a buff across a LUK gap:** Radiate (243, Certain Hit, all allies) puts Radiant (264) on actor 2 at 100%,
    first at the pair's own LUK, then with actor 2's LUK raised by 300. Radiant isn't `<type:negative>`, so it should
    land every time at both.
- **How:** a one-off `--probe` script for `tools/playtest/run.js`, which plays a private copy of the game on a hidden
  display.
- **Ran 2026-11-27, all three confirmed** (fresh copy with the #135 build, Jerald LUK 6 vs the dummy's 10, 2000 trials
  per line):
  - A, Shell Cracker's stun: 100.0% / 49.4% / 0.0% at State Rate 100 / 50 / 0.
  - B, Doom's Certain Hit at 75%: 74.2% / 36.5% / 0.0% at State Rate 100 / 50 / 0.
  - C, Radiate on Rupert: 100.0% at the pair's own LUK and 100.0% with Rupert's LUK raised to 310.
