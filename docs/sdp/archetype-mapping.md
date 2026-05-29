# SDP archetype mapping

> Mapping each enemy subgroup to one of the ten combat archetypes.
> Archetypes mirror the ally AI presets from `JABS_AllyAI`.
> See [`design-contract.md`](../design-contract.md) for pillar context.
>
> **Runtime status:** [`implementation-status.md`](./implementation-status.md) — registry keys, combat hooks, playtest notes.

---

## Archetypes reference

| Archetype | Fantasy | Core stats | Tradeoff |
|---|---|---|---|
| **Berserker** | All-in melee aggressor | ATK, CRI, CDM, LST (mod), TRG (mod), TCR | PDR↑, MDR↑, GRD↓, SHE↓ |
| **Guardian** | Absorbs punishment | DEF, MDF, MHP, TGR, GRD, CDR, CEV, CNT (mod) | ATK↓, AGI↓, CRI↓, MSB↓ |
| **Vanguard** | Reliable frontliner | ATK, DEF, MHP (modest), CEV (mod) | CRI↓, CDM↓, MAT↓, MDF↓ |
| **War Priest** | Fight and sustain | ATK, HRG, REC, LST (high), CDR (mod), HIT (mod), SHA (small) | MAT↓, CRI↓ |
| **Skirmisher** | Speed kills | AGI, LUK, HIT, CRI, TRG | MHP↓, DEF↓, SHE↓, CDR↓ |
| **Generalist** | Foundation builder, meta-progression | LUK, EXR, gold rate, SDP Mult, PROF, AP Mult, PHA (mod), flat spread | No rate multipliers — modest combat |
| **Cleric** | Keep everyone alive | REC, PHA, MRG, MDF, SHE, CEV | ATK↓, TGR↓, CDM↓ |
| **Artillery** | One big shot from range | ATK/MAT, CRI, CDM, HIT (mod) | MHP↓, DEF↓, GRD↓, CEV↓, SHE↓, CDR↓ |
| **Wizard** | Magic damage | MAT, MMP, MCR | MHP↓, DEF↓, GRD↓, TGR↓, CEV↓, CDR↓ |
| **Medic** | Pure support/sustain | MDF, MRG, HRG, SHA, PHA | ATK↓, CRI↓, CDM↓ |

---

## Family 1: Undead (101–150)

| IDs | Subgroup | Description | Archetype |
|---|---|---|---|
| 101–110 | **Ghosty** | Sloppy mid-range caster, mascot enemy, escalating spell danger | **Wizard** |
| 111–120 | **Wraith** | Beefy, high elemental resists, drain-touch melee, annoying tank | **Guardian** |
| 121–130 | **Wisp** | Fragile, passive counter-aura (burns on contact), must kill at range | **Artillery** |
| 131–140 | **Skeletor** | Leader/follower pairs (Skeletor + Skeledoggo), aggressive melee | **Berserker** |
| 141–150 | **Rust Bucket** | Haunted armor (tsukumogami), low HP but absurd defense, otherwise dull | **Vanguard** |

## Family 2: Reptile (151–200)

| IDs | Subgroup | Description | Archetype |
|---|---|---|---|
| 151–160 | **Cobra** | High speed dive-and-bite, poison, crit-heavy, mean and relentless | **Skirmisher** |
| 161–170 | **Dargin** | Classic dragon, durable front-mid, elemental breath, strong all around, high PDEF+EDEF | **Vanguard** |
| 171–180 | **Draconite** | Slower, more durable, less offensive Dargin cousin — gargoyle vibes | **Guardian** |
| 181–190 | **Lamia** | Huge sprite, tons of HP, melee, devastating scaling laser ("live long enough to hadouken") | **Artillery** |
| 191–200 | **Salamander** (TBD) | Fast, elementally inclined, possibly supports allies | **War Priest** |

## Family 3: Aquatic (201–250)

| IDs | Subgroup | Description | Archetype |
|---|---|---|---|
| 201–210 | **Kappa** | Insanely fast, lucky, support spells + melee slaps, total douchebag jack-of-all-trades | **Generalist** |
| 211–220 | **Polliwog** | Stationary turret, ribbits at you for damage, basically a living trap | **Artillery** |
| 221–230 | **Crimson Vice** | Crab, recursive combo chains, strictly melee, anti-physical wall, melts to magic | **Guardian** |
| 231–240 | **Fish** (TBD) | Annoying mid-range poker, fast, kites you endlessly, opportunistic | **Skirmisher** |
| 241–250 | **Cephalopod** (TBD) | Beefy squid, long range, large hitbox, drowns you in ink/debuffs | **War Priest** |

## Family 4: Slime (251–300)

| IDs | Subgroup | Description | Archetype |
|---|---|---|---|
| 251–260 | **Hard Syrup** | Elemental variants (not tiered), wildly varied offense/defense, no parry, all have HRG | **Generalist** |
| 261–270 | **Roper** | Deadly magical melee, hits insanely hard, all magic damage, in-your-face aggression | **Berserker** |
| 271–280 | **Jelly** | Pure ranged support, heals allies, buffs friends, slurps your magi, adorable sprite | **Medic** |
| 281–290 | **Goo Bat** | Unchallenged king of regeneration, must Seal or one-shot, negligible damage | **Cleric** |
| 291–300 | **Cube** (TBD) | Big chonky blob, extra large hitbox, just... in the way | **Vanguard** |

## Family 5: Plant (301–350)

| IDs | Subgroup | Description | Archetype |
|---|---|---|---|
| 301–310 | **Wolftrap** | Venus fly trap, roots you, barely moves, dissolves you while stuck, escalating debuffs | **Wizard** |
| 311–320 | **Fungrowth** | Dumb, locks out skills but buffs offense, forces pure basic attack berserker mode | **Berserker** |
| 321–330 | **Dryad** | Backline healer, rains rocks when allies healthy, buffs friends, makes acorn pie | **Medic** |
| 331–340 | **Treant** (TBD) | Chonky frontliner, chonky tree things, wooden Cube energy | **Vanguard** |
| 341–350 | **Flower** (TBD) | Graveyard flower, passive sustain aura, cleanses debuffs, eerie Cleric | **Cleric** |

## Family 6: Beast (351–400)

| IDs | Subgroup | Description | Archetype |
|---|---|---|---|
| 351–360 | **Bearcat** | Brutal slaps, massive knockback, bleed, physical/HP/DEF core that evolves into void magic | **Berserker** |
| 361–370 | **Cave Bat** | Classic trash mob, fast annoying peckers, dies in 1–2 hits, sheer pest energy | **Skirmisher** |
| 371–380 | **Garuda** | Level 70+ boss bird, prefers backline razor winds, big and angry, can frontline if pressed | **Artillery** |
| 381–390 | **Rot Rat** | "Resourceful rodent," not scary alone, dangerous in numbers, stacking poison/chip damage | **Generalist** |
| 391–400 | **Quadruped** (TBD) | Hippogryph/chimera pack alpha, roars to buff allies, body-blocks, leader of the pack | **Guardian** |

## Family 7: Insect (401–450)

| IDs | Subgroup | Description | Archetype |
|---|---|---|---|
| 401–410 | **Needler** | Fast, poisonous bees, annoying→deadly pipeline, outrageous crits, melee→ranged evolution | **Skirmisher** |
| 411–420 | **Crawler** | Wall-lurking ambushers, elemental debuff spires, beefy with regen, low mobility area denial | **War Priest** |
| 421–430 | **Brood** (TBD) | Swarm debuffers, rain disabilities, never alone, force multiplier for accompanying enemies | **Wizard** |
| 431–440 | **Scorplite** (TBD) | Armored scorpions, stab and shrug, symbiotic bodyguards for Brood, chitin wall | **Vanguard** |
| 441–450 | **Parasite** (TBD) | Loner drain kings, every attack self-sustains, higher tiers disperse drain auras to allies | **War Priest** |

## Family 8: Humanoid (451–500)

| IDs | Subgroup | Description | Archetype |
|---|---|---|---|
| 451–460 | **Minotaur** | Beefy charger, tremendous knockback, telegraphed "dodge or die" charged nuke | **Artillery** |
| 461–470 | **Orc** | Hierarchical and versatile — bruisers, mages, chieftains, minions, the whole works | **Generalist** |
| 471–480 | **Bandit** | Dirty trickster, pocket sand→smoke bombs→pickpocket strikes, fights unfairly | **Skirmisher** |
| 481–490 | **Cyclops** (TBD) | Big, dumb, lumbering wall of flesh, club goes bonk, no gimmicks | **Vanguard** |
| 491–500 | **Kobold** (TBD) | Swarm trash that evolves into crude field medics, bandages/buffs for big allies | **Cleric** |

## Family 9: Construct/Arcane (501–550)

| IDs | Subgroup | Description | Archetype |
|---|---|---|---|
| 501–510 | **Heated Titan** | Level 69 golem joke, massive unkillable brute, pure walk-forward-and-kill aggression | **Berserker** |
| 511–520 | **Hazard** | Stationary traps, no AI, move-route skill spam, zone denial turrets | **Artillery** |
| 521–530 | **Bot** (TBD) | Robot killing machine with self-repair subroutines, relentless offense + mechanical sustain | **War Priest** |
| 531–540 | **Puppet** (TBD) | Marionette channels dark misery magic through puppet conduit, kill controller to disable | **Wizard** |
| 541–550 | **Runic Orb** (TBD) | Aura/buff battery, follows allies, regen support; death-explosion shorts nearby constructs | **Medic** |

## Family 10: Deity (551–600)

> Kaiju subgroup sacked — slots merged into Sins for 7 bosses + 7 helpers.

| IDs | Subgroup | Description | Archetype |
|---|---|---|---|
| 551–560 | **Elemental** | Bosses you fight then recruit as party members, elemental mastery incarnate | **Wizard** |
| 561–580 | **Sin** (expanded, 20 slots) | Seven deadly sins, each boss + helper pair; helpers drop sin-themed panels | **Multi** (see below) |
| 581–590 | **Emotion** (TBD) | Embodied emotions — Joy heals, Hope rekindles, Sorrow debuffs; emotional sustain | **Cleric** |
| 591–600 | **Devil** (TBD) | Imps, devils, alluring tricksters; too clever to commit to one strategy | **Generalist** |

### Sin archetype breakdown

| Sin | Boss Fantasy | Helper Panel Archetype |
|---|---|---|
| Wrath (Vampire) | Unrelenting fury | Berserker |
| Gluttony (Gluttonwolf) | Devours, self-sustains | War Priest |
| Sloth | Debilitating auras, can't move | Guardian |
| Pride | Invincible posturing, refuses to flinch | Vanguard |
| Envy | Steals your buffs/stats | Skirmisher |
| Lust | Charms, confuses, allures | Wizard |
| Greed | Hoards resources, drains everything | Generalist |

---

## Archetype tally

| Archetype | Count | Subgroups |
|---|---|---|
| Berserker | 5 | Skeletor, Roper, Fungrowth, Bearcat, Heated Titan |
| Guardian | 4 | Wraith, Draconite, Crimson Vice, Quadruped |
| Vanguard | 6 | Rust Bucket, Dargin, Cube, Treant, Scorplite, Cyclops |
| War Priest | 5 | Salamander, Cephalopod, Parasite, Bot, Crawler |
| Skirmisher | 5 | Cobra, Fish, Cave Bat, Needler, Bandit |
| Generalist | 5 | Kappa, Hard Syrup, Rot Rat, Orc, Devil |
| Cleric | 4 | Goo Bat, Flower, Kobold, Emotion |
| Artillery | 6 | Wisp, Lamia, Polliwog, Garuda, Minotaur, Hazard |
| Wizard | 5 | Ghosty, Brood, Puppet, Elemental, Wolftrap |
| Medic | 3 | Jelly, Dryad, Runic Orb |

> Sin helpers add +1 each to: Berserker, War Priest, Guardian, Vanguard, Skirmisher, Wizard, Generalist.

---

## Design decisions & open questions

### Build identity framework

**Build = Weapon Identity × Panel Investment**

Weapons are the PRIMARY build axis. Each weapon family (sword, spear, gun, axe, wand, fist)
has 3 subgroups with distinct combos, masteries, and primary stat leans:

| Weapon | Primary Stat |
|---|---|
| Sword | ATK |
| Spear | AGI |
| Gun | LUK |
| Axe | MHP |
| Wand | MAT |
| Fist | ATK |

SDP panels are the SECONDARY build axis — they determine the character's ROLE
on top of their weapon choice. Same weapon + different panels = different role:
- Sword + Berserker panels = physical DPS
- Sword + Guardian panels = physical tank
- Sword + War Priest panels = sustain fighter

### Party structure

- 6 active party members at once (Jerald, Rupert, 4 elementals).
- All members earn SDP points independently (kill = everyone gets points).
- Points are spent independently per character — no shared budget.
- No restrictions on who invests in which panels.

#### Existing character leans

| Character | Skill Kit | Natural Role |
|---|---|---|
| Jerald | 8 skills — offense + self-buff | Frontline flex |
| Rupert | 8 skills — offense + party sustain | Backline flex |
| Earthie | 4 skills — support | Support |
| Aqualock | 4 skills — short-range casting | Caster |
| Cynder | 4 skills — short-range tanking | Tank |
| Skye | 4 skills — mid-range skirmishing | Skirmisher |

Each skill has 4 proficiency ranks that enhance the base skill further.

### The tradeoff problem (critical)

**Current state:** Panels have no meaningful tradeoffs. A player can stack
offense + HRG on all 6 characters and regen-tank everything with zero strategy.

**Required state:** Every archetype must have REAL penalties — stats that go DOWN
when you invest. The penalty must be painful enough that:
1. No single build can do everything.
2. Party composition matters — your weakness is covered by a teammate's strength.
3. The "all offense + HRG" strategy hits walls where it genuinely fails.

**Design principle:** Panels can give both flat bonuses and rate multipliers,
and both positive and negative values. Tradeoffs are delivered through the
panel itself, not through opportunity cost alone.

**Litmus test (the grindy friend):** If a player can dump all points into
offense + HRG across all 6 characters and button-mash through all content,
the tradeoff system has failed.

### Mastery rewards (open)

Currently ~1/3 to 1/2 of panels teach enemy skills on mastery.
Problem: learned skills don't compete with the player's natural kit.

Options under consideration:
1. **Passive traits** — always-on bonuses ("+5% crit below 50% HP").
2. **Essence skills** — player-scaled reinterpretations of enemy skills.
3. **Cross-system unlocks** — crafting recipes, ally AI tweaks, Omnipedia entries.
4. **No skill rewards** — panels are pure stat growth; skills from other systems.
5. **Hybrid milestones** — ranks 1–9 give stats; rank max gives a tailored reward
   (some passives, some recipes, some gap-filling skills).

Decision: TBD. Likely option 5 (hybrid milestones) but needs prototyping.

### Stat identity per archetype (next step)

For each archetype, define:
- **Core stats** (3–5 stats that go UP) — the identity
- **Penalty stats** (1–3 stats that go DOWN) — the weakness
- **Subgroup flavor** — how the subgroup twists the archetype's stat profile
- **Tier magnitude** — how numbers scale from tier 1 to tier 10

Formula: `Panel Identity = Archetype Direction × Subgroup Flavor × Tier Magnitude`

### Healing/sustain system (four knobs)

MDF, REC, PHA, and LST all affect survival. Each support/sustain archetype claims different knobs:

| Archetype | Sustain Knobs | Fantasy |
|---|---|---|
| **Cleric** | REC + PHA | "Everything that heals you works better" — items, food, incoming heals |
| **Medic** | MDF + MRG | "Raw heal power + never run dry on mana" — the dedicated spellhealer |
| **War Priest** | HRG + REC + LST (high) | "Sustain trinity" — passive regen, amplified recovery, damage → HP |
| **Berserker** | LST (moderate) | "Rage sustains you" — aggression is the only lifeline |
| **Treant** (Vanguard) | HRG + LST (moderate) | "Regenerative wall" — absorbs life passively and through contact |

**LST (Lifesteal)** — registry key **`lst`** (id 35). After a hit with HP damage, the attacker
recovers `floor(damage × lst)` as HP (`mst` / `tst` mirror for MP/TP). War Priest is the primary
owner; Berserker and Treant get moderate amounts as cross-archetype bleed. All other archetypes
get zero. **Playtest validated 2026-05-29.** See [`implementation-status.md`](./implementation-status.md).

### Shield system (two knobs — mirrors CDM/CDR pattern)

| Parameter | What it does | Primary Archetype | Secondary |
|---|---|---|---|
| **SHA** → **`sar`** (Shield Amplification) | Shields you APPLY are stronger | **Medic** (high) | — |
| **SHE** → **`ser`** (Shield Effectiveness) | Shields applied TO you are stronger | **Cleric** (high) | — |

SHE also appears as a **penalty** on aggro/speed archetypes:
- **Berserker** — SHE↓ (don't shield me, I lifesteal)
- **Skirmisher** — SHE↓ (don't shield me, I dodge)

This creates party role clarity through stats: Medic shields are strongest on the Cleric
(SHA × SHE double-dip), weakest on the Berserker (SHE penalty). Heals go to the Berserker,
shields go to the Cleric.

### Crit defense spectrum (CDR + CEV placement)

CDR (Crit Damage Reduction) was already built. Negative CDR is supported out of the box
(`applyCriticalDamageReduction` uses `1 - defender.cdr`, so CDR = -0.2 → 1.2x crit bonus).

| Archetype | CDR | CEV | Combined Effect |
|---|---|---|---|
| **Guardian** | HIGH ↑ | HIGH ↑ | Crits rarely land AND barely hurt when they do |
| **War Priest** | MODERATE ↑ | — | Crits don't one-shot, regen handles the rest |
| **Vanguard** | — | MODERATE ↑ | Consistent — no surprise crit spikes |
| **Skirmisher** | PENALTY ↓ | — | If caught, crits DEVASTATE |
| **Artillery** | PENALTY ↓ | PENALTY ↓ | Crits land easily AND hit extra hard — pure glass |
| **Wizard** | PENALTY ↓ | PENALTY ↓ | Same as Artillery — if you're in range, you're dead |
| **Cleric** | — | MODERATE ↑ | Hard to crit the support — they're protected |

### LUK archetype assignment

LUK is a core stat for **Generalist** (jack of all trades, luck favors the prepared)
and a secondary stat for **Skirmisher** (speed + luck = crits and procs).
This gives all three gun subgroups (Pistol, Taser, Shotgun) natural panel partners.

### Weapon adjustments for archetype crossover (applied)

| Weapon | Change | Effect |
|---|---|---|
| **Book** | Added MDF to base params | Now viable for Cleric/Medic (healing grimoire) |
| **Bash Hammer** | Added MDF to base params | Now viable for War Priest (battle cleric hammer) |
| **Dual Sword** | Added GRD trait | Now viable for Guardian crossover (parry-fighter) |
| **Shotgun** | Added REC trait | Now viable for War Priest/Generalist crossover |

### Weapon identity matrix (6 families × 3 subgroups = 18)

| Weapon | Primary Stats | Speed | Identity |
|---|---|---|---|
| 1H Sword | ATK | Neutral | Balanced physical melee |
| 2H Sword | ATK (high) | Slow | Massive range, heavy hits, elemental |
| Dual Sword | ATK + AGI + GRD | Fast | Speedy dual-wield, parry-capable |
| Thrust Spear | ATK + AGI + CDM (huge) | Fast | Crit monster, bleed, 2H |
| Bash Hammer | ATK + AGI + MDF | Neutral | Balanced bonker, stun, ranged wave finisher |
| Javelin | ATK + MAT + AGI + CDM | Fast | Ranged hybrid, anti-family |
| Pistol | ATK + LUK | Neutral | Melee combo → gunshot, TP gen, 1H |
| Taser | MAT + LUK | Neutral | Pin → tase → mash, single target magic, 1H |
| Shotgun | ATK + LUK (heavy) + REC | Slow | Massive cone, knockback, anti-undead, 2H |
| 1H Axe | MHP + ATK | Slow | Tanky DPS, poison, anti-construct, deceptively large |
| 2H Axe | MHP + ATK | Fast | 1H axe wielded in 2H = hyper fast hack n slash |
| Dual-Ender | MHP + ATK + GRD | Slight slow | Helicopter blade, offense/defense hybrid, 2H |
| Staff | MAT + MDF | Neutral | Tanky mage / healer weapon, 2H |
| Wand | MAT (pure) | Fast | Glass cannon mage, liquid, MRG high, 1H |
| Book | MMP + MAT + MDF | Neutral | Mana battery caster / healing grimoire, void |
| Gauntlet | ATK | Fast | Fast puncher, ground element, anti-shield |
| Claw | ATK + Ignore Parry | Fast | Parry bypasser, anti-family, CRI |
| Mech Arm | ATK + DEF | Slow | Bruiser-tank, stun machine, anti-construct |

### Archetype prototype: Berserker (approved)

**Shared core (all Berserker panels):**
- UP: ATK, CRI, CDM, LST (moderate — aggression sustains you), TRG (moderate — fast TP gen from aggression), TCR (TP skills are cheaper — swing more, cast more)
- DOWN: PDR↑, MDR↑, GRD↓, SHE↓ (shields are weak on you — lifesteal, not barriers)

**Subgroup flavors:**

| Subgroup | Flavor Twist | Mastery Passive | Plugin Status |
|---|---|---|---|
| Skeletor | +HRG (small undead sustain) | **Undying Rage**: below 25% HP, ATK +15% | Needs conditional stat modifier |
| Roper | MAT replaces ATK (magic berserker) | **Eldritch Fury**: CRI +10% vs debuffed enemies | Needs target-state conditional |
| Fungrowth | +ATK (extra heavy), MCR↑/TCR↑ (skills costly) | **Primal Instinct**: ATK +X% while no skills on cooldown | Needs cooldown-state conditional |
| Bearcat | +MAT at higher tiers (void evolution) | **Void Resonance**: 15% of ATK adds to MAT | **Implementable now** |
| Heated Titan | +MHP (survive one mistake) | **Unstoppable**: knockback resist +50%, ATK +5% per debuff on self | Needs state-count conditional |

**Mastery reward philosophy:** Always-on passive traits that reinforce the subgroup fantasy.
Never active skills (compete with player kit). Occasional cross-system unlocks for non-combat archetypes.

### Archetype prototype: Guardian (approved)

**Shared core (all Guardian panels):**
- UP: DEF, MDF, MHP, TGR, GRD, CDR (crits barely scratch you), CEV (crits rarely land), CNT (moderate — hit me and I hit back)
- DOWN: ATK↓, AGI↓, CRI↓, MSB↓

**Subgroup flavors:**

| Subgroup | Flavor Twist | Weapon Affinity | Mastery Passive | Plugin Status |
|---|---|---|---|---|
| Wraith | +MDF heavy, mana shield | Book (MMP battery) | **Spectral Ward**: magic dmg drains MP before HP | Extend existing Shield plugin |
| Draconite | +DEF heavy, positional tank | 1H Axe (MHP) | **Stone Scales**: DEF +X% while standing still | Needs conditional stat modifier |
| Crimson Vice | +GRD, anti-physical wall | Mech Arm (ATK+DEF) | **Iron Shell**: reflect X% phys damage to attacker | Experiment with retaliate system |
| Quadruped | +TGR, pack leader aura | Weapon-agnostic (aggro) | **Alpha Presence**: nearby allies +X% DEF | **Current ecosystem** |

### Archetype prototype: Vanguard (approved)

**Shared core (all Vanguard panels):**
- UP: ATK, DEF, MHP (modest gains — adequate, not impressive), CEV (moderate — no surprise crits spiking you down)
- DOWN: CRI↓, CDM↓ (can't spike), MAT↓, MDF↓ (can't cast or heal)
- Philosophy: the per-rank stats are deliberately underwhelming. The mastery passive is the prize.

**Subgroup flavors:**

| Subgroup | Reliable How? | Flavor Twist | Mastery Passive | Plugin Status |
|---|---|---|---|---|
| Rust Bucket | Absurd DEF, paper HP | DEF spike, MHP↓ | **Hollow Armor**: DEF doubles, MHP halved | Conditional stat modifier |
| Dargin | Harder to kill when hurt | PDR↓ + MDR↓ | **Dragonheart**: PDR/MDR improve +X% below 50% HP | Conditional stat modifier |
| Cube | Giant HP, area denial | MHP spike + small TGR | **Living Obstacle**: enemies in melee range have -X% movespeed | JABS passive state aura |
| Treant | Recovery between exchanges | DEF + HRG + LST (moderate) | **Ironbark**: first hit after 3s of no damage deals X% less | New plugin (damage gap timer) |
| Scorplite | Hits back with debuffs | ATK + DEF + CNT | **Chitin Barbs**: counterattacks apply slow debuff | Retaliate system |
| Cyclops | Simple, untrickable | Raw flat stats, no rates | **Thick Skull**: immune to disable and mute | Passive state immunity |

### Archetype prototype: War Priest (approved)

**Shared core (all War Priest panels):**
- UP: ATK, HRG, REC, LST (high — signature stat), CDR (moderate — survive crit spikes long enough to regen), HIT (moderate — must connect to lifesteal), SHA (small — self-shield monk vibes)
- DOWN: MAT↓, CRI↓
- Sustain trinity: HRG (passive regen), REC (healing amplification), LST (damage → HP)
- War Priests survive by REGENERATING through the fight, not by avoiding or absorbing damage.

**Subgroup flavors:**

| Subgroup | Sustain Lean | Flavor Twist | Mastery Passive | Plugin Status |
|---|---|---|---|---|
| Salamander | Balanced (HRG/REC/LST even) + AGI | Fast sustainer, elemental | **Elemental Infusion**: attacks deal X% bonus damage matching weapon element | Needs elemental bonus system (passive state w/ element traits?) |
| Cephalopod | REC-heavy + MHP | Beefy, benefits most from ally/item healing | **Ink Shroud**: enemies you've recently hit deal X% less damage to you | Needs "recently hit" tracking + conditional DR |
| Parasite | LST-heavy | Almost entirely self-sufficient through damage | **Siphon Aura**: lifesteal splashes X% of recovered HP to nearby allies | JABS passive state aura |
| Bot | HRG-heavy + DEF | Mechanical durability, tick-based self-repair | **Self-Repair Subroutine**: auto-recover X% MHP every Y seconds | Passive state with periodic heal trigger |
| Crawler | HRG + LST, MSB↓ | Territorial area denier, immobile regen fortress | **Spire Network**: HRG and LST +X% while enemies are within melee range | Needs proximity conditional |

**Sustain spectrum within War Priest:**
- Salamander: agile — sustains evenly while moving fast, elemental damage rider
- Cephalopod: brawler — beefy HP pool, incoming heals stretch further, softens what hits back
- Parasite: vampire — loner drainer becomes team aura at mastery (loner → provider arc)
- Bot: mechanical — survives between auto-heal ticks via DEF, doesn't need to attack
- Crawler: territorial — regen and drain spike when enemies are close, penalized mobility

**LST as cross-archetype parameter:**
LST is the War Priest's signature stat (highest amounts), but it appears in two other places:
- **Berserker** — moderate LST (rage sustains you, aggression = survival)
- **Treant** (Vanguard subgroup) — moderate LST (the regenerative wall absorbs life)

This creates meaningful cross-archetype build tension:
- War Priest + Berserker stacking = max LST, but PDR↑/MDR↑ from Berserker + CRI↓/MAT↓ from War Priest = sustain treadmill
- Treant + War Priest stacking = unkillable regen wall, but CRI↓/CDM↓ from Vanguard stacks with CRI↓ = zero spike damage
- Berserker LST alone = moderate lifesteal + high CRI/CDM, but PDR↑/MDR↑ = glass cannon with a band-aid

### Archetype prototype: Skirmisher (approved)

**Shared core (all Skirmisher panels):**
- UP: AGI, LUK, HIT, CRI, TRG (fast hits = fast TP = more skill rotations)
- DOWN: MHP↓, DEF↓, SHE↓ (shields are weak on you — dodge, not barriers), CDR↓ (crits devastate you — don't get caught)
- MSB is a subgroup flavor (Fish, Cobra) rather than shared core — not all skirmishers are movers.
- Philosophy: survive by physically dodging in the ARPG, not stat-based evasion. If caught, you crumble.

**Subgroup flavors:**

| Subgroup | Speed Fantasy | Flavor Twist | Mastery Passive | Plugin Status |
|---|---|---|---|---|
| Cobra | Poison + burst assassin | +CRI (heavy), poison synergy | **Venom Strike**: crits apply/extend poison | J-CriticalFactors extension (on-crit trigger) |
| Fish | Kiter, never in range | +AGI (heavy), +MSB | **Slippery**: MSB +X% for 2s after dealing damage | Conditional stat modifier (post-damage) |
| Cave Bat | Swarm, quantity over quality | +HIT, +AGI, tiny flat boosts | **Swarm Instinct**: HIT +X% per ally within range | Proximity conditional (ally count — new) |
| Needler | Raw crit devastation | +CRI, +CDM (crit monster) | **Drilling Sting**: CDM +X% against debuffed targets | Target-state conditional (same as Roper) |
| Bandit | Dirty tricks, saboteur | +LUK (heavy), debuff chance | **Pocket Sand**: attacks X% chance to blind (HIT↓) | **Works now** — RMMZ native state-on-hit via passive state |

**Weapon affinities:**

| Subgroup | Natural Weapons | Why |
|---|---|---|
| Cobra | Claw (fast + ignore parry), Thrust Spear (CDM) | Poison delivery + crit multiplication |
| Fish | Javelin (ranged hybrid), Pistol (LUK + ranged) | Stay at range, kite forever |
| Cave Bat | Dual Sword (fast), Wand (fast) | Rapid hits, quantity over quality |
| Needler | Thrust Spear (CDM monster), Claw (fast + CRI) | Maximum crit damage per hit |
| Bandit | Pistol (LUK), Dual Sword (fast + GRD) | Dirty fighter, lucky shots |

**Cross-archetype tension:**
- Skirmisher + Berserker = glass cannon supreme (CRI stacks, but MHP↓ + PDR↑ = paper AND takes extra damage)
- Skirmisher + War Priest = CRI↓ from War Priest fights CRI↑ from Skirmisher — partial cancellation
- Skirmisher + Guardian = AGI↓ from Guardian kills the speed fantasy — contradicts itself

### Archetype prototype: Artillery (approved)

**Shared core (all Artillery panels):**
- UP: ATK or MAT (subgroup determines which), CRI, CDM, HIT (moderate — land the shot)
- DOWN: MHP↓, DEF↓, GRD↓ (can't parry from range), CEV↓ (wide open to crits), SHE↓ (shields don't save glass), CDR↓ (crits devastate)
- Philosophy: maximum damage from range. If anything closes the gap, you die.
  Berserker's backline cousin — same burst ceiling, different positioning.
  Unlike Berserker, Artillery gets NO sustain (no LST). Pure glass cannon.

**Subgroup flavors:**

| Subgroup | Artillery Fantasy | Flavor Twist | Mastery Passive | Plugin Status |
|---|---|---|---|---|
| Wisp | Fragile counter-aura, kill at range | +MAT, aura punisher | **Blistering Aura**: enemies in melee range take X% MHP fire damage/sec | JABS passive damage aura |
| Lamia | Devastating laser, patient destruction | +MAT (heavy), charge-up | **Focusing Beam**: skill damage +X% per second of cast time | Existing cast time plugin + scaling modifier |
| Polliwog | Stationary turret, commit to firing | +ATK or MAT | **Rooted Barrage**: consecutive attacks without moving deal +X% escalating damage (resets on movement) | Conditional modifier (movement-reset counter) |
| Garuda | Mobile artillery, fire and reposition | +ATK, +AGI | **Tailwind**: MSB +X% for 3s after using a skill (reposition window) | Conditional stat modifier (post-skill) |
| Minotaur | Wind-up charger, momentum = devastation | +ATK (heavy), knockback | **Momentum**: damage +X% based on distance traveled before attacking | Pixelistics extension (movement→damage) |
| Hazard | Zone denial turret, area saturation | +MAT, area damage | **Blast Radius**: AoE skills have +X% increased area size | Needs AoE scaling modifier |

**Cross-archetype synergies:**
- Artillery + Berserker = disgusting burst (CRI/CDM from both) but MHP↓ + DEF↓ + PDR↑ = tissue paper
- Polliwog's Rooted Barrage + Berserker = stand and mash for escalating damage — filthy combo
- Artillery + Skirmisher = crit monster, but double MHP↓/DEF↓ penalties = instant death on contact
- Artillery + Guardian = offset the squishiness, but ATK↓/AGI↓ from Guardian hurts damage output

### Archetype prototype: Wizard (approved)

**Shared core (all Wizard panels):**
- UP: MAT, MMP, MCR (mana cost reduction)
- DOWN: MHP↓, DEF↓, GRD↓ (hands full of spellcasting), TGR↓ (enemies ignore the nerd), CEV↓ (wide open to crits), CDR↓ (crits devastate)
- Philosophy: sustained magical pressure with deep mana pools. Where Artillery is one big hit
  (CRI/CDM), Wizard is "cast, cast, cast, never run dry" (MMP/MCR). Doesn't need to crit — just never stops.

**Subgroup flavors:**

| Subgroup | Wizard Fantasy | Flavor Twist | Mastery Passive | Plugin Status |
|---|---|---|---|---|
| Ghosty | Sloppy mid-range, escalating spells, first enemy in game | +MAT (steady) | **Spectral Cascade**: damage +X% per unique skill used in last 10s (reward rotation) | New plugin — skill execution history tracker |
| Wolftrap | Root + dissolve, debuff DOTs | +MAT, debuff affinity | **Entangling Curse**: debuffs you apply last X% longer | **Works now** — existing state duration modifier plugin |
| Brood | Swarm debuffer, poke and afflict | +ATK (physical poker), debuff spread | **Plague Swarm**: debuffs have X% per-tick chance to spread to nearby enemies (viral) | New — on-tick hook + viral propagation system |
| Puppet | Marionette dark magic, single-target | +MAT (heavy), focused | **Soul Thread**: +X% damage when attack hits exactly one target (inferred at runtime via hit count) | Damage hook — check actual targets hit |
| Elemental | Bosses you recruit, elemental mastery | +MAT, elemental | **Elemental Saturation**: elemental damage ignores X% of target's resist (cap at full damage, never bonus: `Math.max(0, resist - pierce)`) | Resistance-piercing modifier |

**Weapon affinities:**

| Subgroup | Natural Weapons | Why |
|---|---|---|
| Ghosty | Wand (pure MAT, fast), Staff (tanky mage) | Classic caster weapons |
| Wolftrap | Wand (MAT), Taser (single-target magic DOT) | Debuff delivery |
| Brood | Staff (AoE area), Book (MMP battery) | Physical pokes + deep pool for debuff casting |
| Puppet | Wand (pure MAT), Taser (single-target magic) | Single-target focus |
| Elemental | Book (elemental variety), Javelin (MAT+ATK hybrid) | Element matching |

### Archetype prototype: Cleric (approved)

**Shared core (all Cleric panels):**
- UP: REC, PHA, MRG, MDF, SHE (shields on you are amplified), CEV (hard to crit you — protected)
- DOWN: ATK↓, TGR↓, CDM↓ (even your crits mean nothing — you're support)
- Philosophy: amplify ALL incoming healing, items, and shields. You're not the healer (that's Medic) —
  you're the ideal RECIPIENT of healing. TGR↓ means enemies ignore you, which is the point.

**Subgroup flavors:**

| Subgroup | Cleric Fantasy | Flavor Twist | Mastery Passive | Plugin Status |
|---|---|---|---|---|
| Goo Bat | Regen king, must Seal or one-shot | +MRG (heavy), regen aura | **Regeneration Aura**: nearby allies gain +X% HRG | JABS passive state aura |
| Flower | Graveyard flower, cleanses debuffs | +MDF, debuff resistance | **Purifying Bloom**: X% chance per tick to auto-cleanse one debuff on self | On-tick self-cleanse (passive state) |
| Kobold | Swarm trash evolved into field medic | +PHA (heavy), item focus | **Field Medic**: items used have X% chance to also affect nearest ally | Needs item-use splash system |
| Emotion | Embodied emotions, emotional sustain | +REC (heavy), empathic | **Empathic Bond**: when an ally within range is healed, you receive X% of that heal | Needs heal-event listener + proximity check |

### Archetype prototype: Medic (approved)

**Shared core (all Medic panels):**
- UP: MDF, MRG, HRG, SHA (shields you apply are stronger), PHA (medicine knowledge)
- DOWN: ATK↓, CRI↓, CDM↓ (crits mean nothing — you're support)
- Philosophy: raw healing power + proactive shielding. MDF drives heal formulas, MRG sustains
  your mana, SHA makes your shields beefy. You're the PROVIDER; Cleric is the RECEIVER.

**Subgroup flavors:**

| Subgroup | Medic Fantasy | Flavor Twist | Mastery Passive | Plugin Status |
|---|---|---|---|---|
| Jelly | Pure ranged healer, mana battery, adorable | +MRG (heavy), mana sustain | **Mana Transfusion**: heals restore X% of heal value as MP to target | Needs heal-event hook + MP restore |
| Dryad | Backline healer, offense when idle | +MDF (heavy), flex offense | **Nature's Wrath**: MAT +X% when all allies above 75% HP | Conditional stat modifier (party HP threshold) |
| Runic Orb | Aura/buff battery, mana-hungry engine | +SHA (heavy), +MMP, MP-hungry skills | **Overcharge**: on-shield-break, explode for X% of shield value as AoE damage | On-shield-break hook exists — wire in explosion |

**Medic + Cleric synergy:** Medic casts SHA-boosted shields → lands on SHE-boosted Cleric = massive
barriers. Jelly refuels MP-hungry Orb users. ATK↓ from both = zero damage, pure support duo.

### Archetype prototype: Generalist (approved)

**Shared core (all Generalist panels):**
- UP: LUK, EXR, gold rate, SDP Mult, PROF (learn skills faster), AP Mult (earn AP faster), PHA (moderate — food/items), small flat boosts across many stats
- DOWN: no rate multipliers — modest combat stats that only shine when compounded by rate archetypes
- Philosophy: the "foundation builder" and meta-progression archetype. Invest early to accelerate
  everything else: EXP, gold, SDP points, broad stat base. Other archetypes are the paint; Generalist
  is the primer coat. Alone = functional but unremarkable. Combined with rate archetypes = fat base × rates.

**Subgroup flavors:**

| Subgroup | Generalist Flavor | Meta Stat Focus | Mastery Passive | Plugin Status |
|---|---|---|---|---|
| Kappa | Lucky jack-of-all-trades, fast + support | +LUK, +EXR | **Trickster's Luck**: X% chance to negate incoming attack (pseudo-EVA) | Passive state — on-hit chance |
| Hard Syrup | Elemental variants, reactive defense | +FDR, +small HRG, elemental variety | **Adaptive Slime**: resist to last element that hit you +X% for 5s | Conditional modifier (element tracker) |
| Rot Rat | Resourceful swarm, compounding investor | +SDP Mult, +gold rate | **Resourceful Rodent**: SDP Mult +X% (stacks with per-rank gains) | **`sdr` (33) + `gdr` (41) work now** |
| Orc | Hierarchical, versatile commander | Broadest flat spread, +MCR (small) | **Warchief's Command**: nearby allies +X% to their highest base stat | Proximity conditional (ally buff) |
| Devil | Alluring gambler, double-edged | +LUK (heavy), +EXR | **Devil's Bargain**: all damage dealt AND received +X% | Implementable via traits |

**Meta-progression stats housed in Generalist:**
- EXR (experience rate) — Kappa, Devil
- Gold rate — Rot Rat (`gdr` / id 41 — notetag + SDP panels)
- Drop rate — same pattern (`dor` / id 42)
- SDP Multiplier — Rot Rat (`sdr` / id 33)
- PROF (proficiency+) — spread across subgroups (id 32)
- AP Multiplier — spread across subgroups (`apr` / id 40 — **shipped** in `ApManager.gainAp()`)
- PHA (pharmacology, moderate) — food/items work better, the "prepared" archetype
- FDR (floor damage rate) — Hard Syrup subgroup flavor
- MCR (mana cost rate, small) — Orc (Wizard also uses MCR as core stat)

**Rot Rat = "invest first" panel:** per-rank SDP Mult + gold rate means every panel ranked AFTER
Rot Rat is cheaper in time. The compounding interest play — invest in rats early, benefit all game.

### Panel respec (must implement)

Players need a way to undo panel investments. Nobody should feel locked into bad decisions.
Options: full respec (gold sink?), per-panel respec, or free respec with cooldown. TBD on cost model.
Critical for encouraging experimentation — if respec is too punishing, players default to "safe" builds.

### Required plugin systems

**Shipped (Phase 0 — see [`implementation-status.md`](./implementation-status.md)):**

| Design name | Registry key | Status |
|---|---|---|
| LST / MST / TST | `lst`, `mst`, `tst` | ✅ Combat hook + SDP panels; LST/TST playtested |
| SHA / SHE | `sar`, `ser` | ✅ `JABS_Shield` multipliers |
| AP Mult | `apr` | ✅ `ApManager.gainAp()` |
| Gold / drop rate | `gdr`, `dor` | ✅ Notetags + SDP panels |

**Still future:**

**Conditional Stat Modifiers** — a single plugin/system to handle mastery passives:
- HP threshold triggers (below X% → apply trait)
- Self state count triggers (per debuff on me → apply trait per stack)
- Cooldown state triggers (no skills cooling down → apply trait)
- Target state triggers (attacking debuffed enemy → apply trait)
- Proximity triggers (enemies within melee range → apply trait)
- Damage gap triggers (X seconds since last damage taken → apply trait)

Many archetypes need this across Berserker, Guardian, Vanguard, and War Priest.
Build once, tag-driven, reuse everywhere.
Review ALL mastery passives across all 10 archetypes before building.

### Mastery model (decided)

**Every panel has its own mastery. Within a subgroup, mastery replaces. Across subgroups, mastery stacks.**

- Max any panel → get that subgroup's mastery passive (scaled to tier)
- Max a higher-tier panel in the same subgroup → mastery upgrades (replaces previous tier)
- Masteries from DIFFERENT subgroups stack (e.g., Venom Strike + Undying Rage both active)
- ~50 unique passive concepts (one per subgroup), each with tier-scaled potency
- Player typically has 8–15 active masteries at any given time (one per invested subgroup)

Why this works:
- Players discover mastery IMMEDIATELY (first maxed panel, could be level 3–5)
- Lower-tier masteries aren't wasted — they're stepping stones that introduced the passive
- Future enemies raise the mastery ceiling for existing subgroups (content = power growth)
- Doesn't require all 10 tiers to exist — works with 2–4 implemented enemies per subgroup

### Archetype encounter progression

Based on `Enemies.json` default levels + actual map placement:

| Level | Enemy | Archetype | Location |
|---|---|---|---|
| 1 | Ghosty | **Wizard** | Starting area |
| 3 | Hard Syrup | **Generalist** | Starting area (lost until ~lv20+ after intro boss) |
| 3 | Needler | **Skirmisher** | Starting area |
| 6 | Bearcat | **Berserker** | Early |
| 7 | Polliwog | **Artillery** | Early |
| ~7–12 | Rust Bucket | **Vanguard** | Pearl Salt Mines (planned placement) |
| 10 | Wraith | **Guardian** | |
| 11 | Dryad | **Medic** | Forest of Dreams |
| 17 | Crawler | **War Priest** | Basin |
| 19 | Goo Bat | **Cleric** | Basin |

All 10 archetypes available by ~lv19 (Basin). Seven available by lv11.

**Planned early placements to fill gaps:**
- Kobold (Cleric) → outside Raevula hub town (would make Cleric accessible earlier)
- Cyclops (Vanguard) → cliffsides, ~lv20+ area (replacing Minitaurs?)
- Bot/Runic Orb/Puppet → need map placements TBD

**Progression arc:** discover → collect broadly → upgrade deeply.
Early game builds are shaped by geography. Mid game opens archetype variety. Late game enables deep specialization.

**Hard Syrup note:** encountered at lv3 but access is lost after the intro boss.
Player doesn't see it again until ~lv20+ in Raevula. Generalist panel access is
temporarily gapped — could be filled by Kappa (lv8) or Orcling (lv9) if placed.

**Database vs placed:** many enemies exist in `Enemies.json` with stats and notes
but are NOT on any map yet. The `=== TBD` prefix indicates unimplemented enemies.
Some non-TBD enemies (Runic Orb, Cyclops, Kobold, Puppet, Bot) are in the database
but not placed. Default level ≠ encounter order for all cases.

### Mechanical questions to resolve

- **EVA/MRF:** Currently unused. Re-adding would create new build axes (dodge tank, spell reflector).
- **Guard/Parry builds:** Jeremy wants these buildable. Need stats that make guard/parry investment meaningful.
  Dual Sword + GRD trait and Dual-Ender with GRD are natural weapon homes for this.
- **LST (Lifesteal):** ✅ **Shipped** (`lst`). Cross-archetype: War Priest (high), Berserker (moderate), Treant/Vanguard (moderate). Panel authoring still pending.
- **Status effects:** Become relevant around level 20+. Debuffer builds need enough enemies that are vulnerable.
- **Diminishing returns:** Should stacking the same archetype have diminishing returns to prevent hyper-specialization?

---

## Full stat distribution matrix

### Base Parameters (bparams)

| Stat | UP | DOWN |
|---|---|---|
| MHP | Guardian, Vanguard (mod), subgroup twists | Skirmisher, Artillery, Wizard |
| MMP | Wizard, Runic Orb twist | — |
| ATK | Berserker, Vanguard (mod), War Priest, Artillery (phys subs), Brood twist | Guardian, Cleric, Medic |
| DEF | Guardian, Vanguard (mod), Bot/Scorplite twists | Skirmisher, Artillery, Wizard |
| MAT | Wizard, Artillery (magic subs), Roper twist | Vanguard, War Priest |
| MDF | Guardian, Cleric, Medic, Dryad twist | Vanguard |
| AGI | Skirmisher, subgroup twists (Salamander, Garuda) | Guardian |
| LUK | Skirmisher (secondary), Generalist | — |

### X-Parameters (xparams)

| Stat | UP | DOWN |
|---|---|---|
| HIT | Skirmisher, War Priest (mod), Artillery (mod) | — |
| EVA | — (repurposed as parry boost, re-add TBD) | — |
| CRI | Berserker, Skirmisher, Artillery | Guardian, Vanguard, War Priest, Medic |
| CEV | Guardian, Cleric, Vanguard (mod) | Artillery, Wizard |
| MEV | — (unused, pending) | — |
| MRF | — (unused, pending) | — |
| CNT | Guardian (mod), Scorplite twist | — |
| HRG | War Priest, Medic, Treant/Hard Syrup twists | — |
| MRG | Cleric, Medic | — |
| TRG | Skirmisher, Berserker (mod) | — |

### S-Parameters (sparams)

| Stat | UP | DOWN |
|---|---|---|
| TGR | Guardian, Cube twist | Cleric, Wizard |
| GRD | Guardian | Berserker, Artillery, Wizard |
| REC | War Priest, Cleric | — |
| PHA | Cleric, Medic, Generalist (mod) | — |
| MCR | Wizard, Orc twist (small) | Fungrowth twist (penalty) |
| TCR | Berserker | Fungrowth twist (penalty) |
| PDR | — | Berserker (penalty = ↑ = MORE phys damage taken) |
| MDR | — | Berserker (penalty = ↑ = MORE magic damage taken) |
| FDR | Hard Syrup twist | — |
| EXR | Generalist (Kappa, Devil) | — |

### Registry parameters (catalog keys — was longParam 28+)

| Key (id) | UP | DOWN |
|---|---|---|
| CDM (28) | Berserker, Artillery, Needler twist | Vanguard, Cleric, Medic |
| CDR (29) | Guardian, War Priest (mod) | Skirmisher, Artillery, Wizard |
| MSB (31) | Fish twist, subgroup flavors | Guardian, Crawler twist |
| PROF (32) | Generalist | — |
| SDP Mult / `sdr` (33) | Generalist (Rot Rat) | — |
| **`lst` (35)** | War Priest (high), Berserker (mod), Treant twist | — |
| **`mst` (36)** | (content TBD) | — |
| **`tst` (37)** | (content TBD) | — |
| **`sar` / SHA (38)** | Medic, War Priest (small) | — |
| **`ser` / SHE (39)** | Cleric | Berserker, Skirmisher, Artillery |
| **`apr` (40)** | Generalist | — |
| **`gdr` (41)** | Generalist (Rot Rat) | — |
| **`dor` (42)** | (content TBD) | — |
| **`hcr` (43)** | (content TBD) | — |

### Stat touch count per archetype

| Archetype | UP | DOWN | Total |
|---|---|---|---|
| Guardian | DEF, MDF, MHP, TGR, GRD, CDR, CEV, CNT | ATK, AGI, CRI, MSB | **12** |
| Berserker | ATK, CRI, CDM, LST, TRG, TCR | PDR, MDR, GRD, SHE | **10** |
| War Priest | ATK, HRG, REC, LST, CDR, HIT, SHA | MAT, CRI | **9** |
| Artillery | ATK/MAT, CRI, CDM, HIT | MHP, DEF, GRD, CEV, SHE, CDR | **10** |
| Cleric | REC, PHA, MRG, MDF, SHE, CEV | ATK, TGR, CDM | **9** |
| Skirmisher | AGI, LUK, HIT, CRI, TRG | MHP, DEF, SHE, CDR | **9** |
| Wizard | MAT, MMP, MCR | MHP, DEF, GRD, TGR, CEV, CDR | **9** |
| Vanguard | ATK, DEF, MHP, CEV | CRI, CDM, MAT, MDF | **8** |
| Medic | MDF, MRG, HRG, SHA, PHA | ATK, CRI, CDM | **8** |
| Generalist | LUK, EXR, gold, SDP, PROF, AP, PHA | (opportunity cost only) | **7+** |

### Still unassigned

| Stat | Status |
|---|---|
| EVA | Repurposed as parry boost. Re-add as dodge stat TBD. |
| MEV | Unused. Requires EVA re-add decision first. |
| MRF | Unused. Implementation has many implications (projectile vs direct). |