# Boss ideas: everything left in the boss pass

> Written overnight on 2026-11-12 at Jeremy's ask ("come up with ideas and we will discuss them together in the
> morning for all remaining boss encounters"), so that what is left afterwards is the config and the battle testing.
> **Nothing on this page is decided.** Every pitch is `PROPOSED`; what is already Jeremy's is quoted with its date.
> Once a fight is talked through, its decisions move into the map doc that owns it (`maps/subterranean.md`,
> `maps/fortress.md`) and this page can go.

## How to read it

Every encounter has the same blocks:

- **Already yours**: what is decided, with its date. Not re-pitched.
- **Open slots**: what the docs themselves list as open, and the ideas aimed at each, a few at a time with a pick.
- **The clock**: how long the fight runs, counted in mechanics rather than HP, which demands it makes (the five
  verbs: Move, Wait, Look elsewhere, Spend, Know), and whether levels and gear can out-grind it.
- **Numbers**: rules to measure against in the hall, never stats invented here.
- **Build cost**: what each piece needs.

**Build cost tags**

| Tag | Means |
|---|---|
| `data` | skills, states, templates and config only; no plugin changes |
| `verb` | a change to J-ABS-Boss: plugin, tests, editor, validator and a hall probe. This is the usage-hungry kind |
| `engine` | a change to J-ABS or J-SDP core |
| `art` / `audio` | something only Jeremy can supply or pick |

**Where each engine claim comes from**: *proven* (seen working in a hall or arena run, dated), *read* (read in the
source tonight), or *unread* (an assumption to check before building on it).

**Every percentage here assumes equal levels.** J-Level scales every hit by the level gap between attacker and target
(*read*, `config.level.json`): free within one level either way, then 10% per level, from ×0.1 up to a cap of ×2. A hit a
boss lands on itself is always ×1.

**The duo stands at the top of the zone's band by its boss, and so does the boss** (Jeremy, 11-13: "her own level
should be the peak of the level band for the area"). The gap is 0, so J-Level is ×1 both ways, and every player bar
below is read at that level.
**Nobody is still in a base class by then** (Jeremy, 11-13: the base classes last to about level 2-4), so the reference
pair is his example, a Raving Lunatic Jerald and a Lavos Rupert. Naked max HP comes from each class's
`<mhpGrowthCurve>` (*read*: J-Level's `paramBase` reads the baked class row up to 99 and the tag past it, and the row is
the tag's own line). Gear, SDPs and natural growth add on top (natural growth is added to the class base, *read*), which
is what the hall measures. **Gear by zone** (Jeremy, 11-13): "PROBABLY ~tier5 equips" by the Subterranean, and "tier6 by
the frozen fortress", so that is what the hall dresses them in. SDPs are still unsaid.

| Where | Level | Rupert, Lavos `(180+30*(lv-1))*0.95` | Jerald, Raving Lunatic `(220+40*(lv-1))*1.15` |
|---|---|---|---|
| The Subterranean (Sloth) | 110 | 3,278 | 5,267 |
| The Fortress (Lust, Envy, the mini-bosses) | 130 | 3,848 | 6,187 |
| The Courtyard (Grudj) | about 150 | 4,418 | 7,107 |

Every class sits on one of two lines, physical `220+40*(lv-1)` or magical `180+30*(lv-1)`, times its own multiplier from
×0.80 (Quicksilver, Strategist, Melufa) to ×2.00 (Transcendant, Omniscient). So the class a player picks moves their bar
by up to 2.5×, and every "pulses to fall" count below moves with it: out-classing, working as intended.

## Contents

1. [Sloth](#sloth)
2. [Lust](#lust)
3. [Envy](#envy)
4. [Grudj](#grudj)
5. [The ghost (Tower 9)](#the-ghost-tower-9)
6. [The horde (Basement 9)](#the-horde-basement-9)
7. [One leak that touches four fights](#one-leak-that-touches-four-fights)
8. [Every boss's secondary stats](#every-bosss-secondary-stats)
9. [The shopping list](#the-shopping-list)

---

## Sloth

`Map409` "Arena", enemy `585`, votaries `595`. Band 95-110; the duo fights together.

### Built (2026-11-13, at your "Go"; uncommitted on `boss-pass`)

- **Data.** Enemy 585 "Sloth": lv110, a bar of exactly 100,000, DEF 0, MDF 0, GRD 0 (a crumbling statue can't parry),
  5% from elements 1-9, `<noSelfKill>`. Enemy 595 "Slothful Votary": lv110 with Prime and No Rewards on its template,
  so 198,500 HP; a basic attack (2591), Lethargy (2592) and Still Devotion. Skill 2590 "Heartbeat": your formula,
  Typeless (element 10, which CA has as its own element, not "none"), scope Everyone, Certain Hit, no crit, no
  variance, `<castTime:60>`, `<castAnimation:160>` ("charging up"), `<unparryable>`, radius 99, `<juiceMotion:pulse>`,
  animation 155 ("undying pulse"). States 2075 Stilled (rooted, disabled), 2076 Lethargic (speed -35% for 4s), 2077 Still
  Devotion (after 2 seconds standing still, stacks 2078 Hardened: +10% DEF and MDF per stack, up to 5, all gone on a
  step). Switch 192 "sloth defeated". Clone templates Map361 ev585 (her sheet, Stepping on, Earthie's death scene in
  her purple) and ev595 (`m_winter-spirits` index 2).
- **The fight**, encounter `sloth` (map 409): Sealed on at the start; fifteen waves 10 seconds apart, the pairs rotating
  from her feet (17,20)+(17,25) to the rims (28,14)+(28,30) to the path behind you (46,21)+(46,23), each arriving in
  "respawn" (154); at waves 5, 10 and 15 "Earth One 1" (86) on her and a one-second flicker into that crack's glowing
  sheet. The break at 2:30: a purple-red tint, "Transform Sin" (56), Sealed off, Stilled on, the most-cracked glowing
  sheet, and the dormant `heartbeat` routine started at `cadence: 4`. She stands at (15,22).
- **Her hall**: Map551 "Sloth Hall", with a door in the lobby. You arrive at (57,22), where the story's own transfer
  lands, and the test kit sits along the path's south edge.
- **Proven in the hall** (`dist/playtest/sloth-hall-probe.js`, six runs, a Raving Lunatic Jerald and a Lavos Rupert
  at 110 in tier 5): sealed, she held 100,000 through every hit, and a Tesla Coiling computed at 52,757 landed 0; 30
  votaries arrived on schedule, five on each tile; the flickers fired at waves 5, 10 and 15; Lethargy's slow took hold
  (19 separate slows) and Still Devotion fired (Hardened reached 5 stacks); the frame rate stayed at 56-60 with up to
  19 votaries standing. The first Heartbeat fires a second after the break, then one every 241-243 frames; each costs
  her exactly 4,000, Jerald 884 and Rupert 717, every time. With her at 2,500 HP a pulse took 2,499 and left her at 1,
  and she sat at exactly 1 through 79 more; an actor landed the kill and the hall reset clean, with 0 exceptions.
  *Read, not played*: a held guard and a timed parry against the pulse, her throb, the juice and the cast tell (yours
  to eyeball in Map551), and the payout itself (only "an actor landed the kill" was logged).
- **One quirk, J-ABS's own:** if the leader falls while she is winding a pulse up, that pulse is dropped, because J-ABS
  clears a battler's decided action when its target dies. The beat resumes on its next count, about 5 seconds later.
- **One engine fix it needed** (J-ABS-Boss, tests and book included): CA runs AI only within 15 tiles of the player
  (`maxAiUpdateRange`), and her platform and path run about 45 tiles. A forced cast with a cast time is fired by its
  boss's AI, so whenever the duo stood more than 15 tiles off, her pulse wound up and never landed (one run stalled 26
  seconds after the break). The fight now fires a finished forced cast itself when the AI isn't there to, through the
  AI's own methods. Earthie's Rockfall and the Gluttonwolf's Devour (`cast: true` too) had the same blind spot;
  Earthie's hall re-ran on the fix exactly as on 11-08 (rocks every 301 frames, 241 after a golem, about 200 after both).
- **My picks, all yours to change:** the names (her canon name is still `OPEN`, so the row just says "Sloth"),
  her two Monsterpedia lines, the animations, the break's tint, the tiles, the death scene, the votaries' bar,
  Lethargy's numbers (Certain Hit so EVA can't dodge it, a 1.5-second cast, radius 3, Void, light damage, 10-second
  cooldown; magical since 11-14, see [Every boss's secondary stats](#every-bosss-secondary-stats)), her GRD 0, and the stub traits I dropped from her row (a PDR of 0.9, an MDR of 1.1, and the
  Beast/Humanoid/Deity weaknesses copied from Wyatt's), since nothing on her side was meant to blunt or amplify a hit.
- **Two things I left alone, for you:** the votaries' HIT stayed the stub's 0.8, so their basic swing never landed on
  a floor-built Jerald (EVA 249%; 144 landed on Rupert, 0 on Jerald). **Since 11-14 the votary rides Enemy Rank T5**
  and lands on him too, and Lethargy is magical rather than Certain Hit (see
  [Every boss's secondary stats](#every-bosss-secondary-stats)). And skills with no element at all (Tesla Coiling,
  Overcharge, Capacitor Surge, Meltdown) skip her 5% the way Typeless does, since her rates only name elements 1-9.
- **The real arena, wired** (2026-11-13, at your "wire her up... like we did nimbus with placeholders... as soon as the
  player enters the map, the event kicks off"): Map409 ev2 "sloth: the statue" stands in at (15,22) until switch 193
  "sloth fight started"; ev3 "partner" is Jerald's sprite on switch 1; ev4 "story: pre-boss" is an autorun with
  `// TODO: fill in the pre-amble`, the watch/skip choice, Rupert leading and the two walking up the path to (40,22), a
  comment where the talk goes, then Show UI, the BigBoss music as a stand-in, switch 193, Start Boss Encounter `sloth`,
  the frame and the menu off; ev5 "story: post-boss" runs on switch 192: End Boss Encounter, CE104, `// TODO: fill in
  the post-amble`. The exit (ev1) is sealed by a statue while 193 is on, Earthie's way, and opens again on 192.
  **Proven** (`dist/playtest/sloth-arena-probe.js`, `SLOTH_PREAMBLE=watch|skip`): the scene starts on entry, both
  paths hand into the fight with her body on the statue's tile, the exit sealed, the frame up and the menu locked; she
  falls, the stub ends the encounter, the frame goes, the menu comes back, the exit reopens, and the scene never replays.
- **The heartbeat sound, found 11-13** (you: "Check the ME folder? I was pretty sure there was one"): not in CA's SE or
  ME, but in the MV Trinity Resource Pack DLC you own (RPG Maker MZ's `dlc` folder), whose art CA already uses:
  `Heartbeat1_mvt` (one deep thump that swells and fades, 2.75s), `Heartbeat2_mvt` (a slow lub-dub, 60 BPM, four beats)
  and `Heartbeat3_mvt` (a racing lub-dub, about 110 BPM). All three are now in `audio/se`. Heartbeat1 opens animation
  155, which only her pulse plays, in place of its Teleport whoosh; the frame-29 accents stay. Heartbeat2 is now the
  Subterranean's heartbeat BGS (your "Yeah set it up"): from layer 3 down, louder and deeper and slower by pitch layer
  by layer, silent in her arena. The table is in `maps/subterranean.md`'s Sound section.
- **Still open:** a line at the break, the pre-amble and post-amble themselves, her final bar after your playtest, and
  moving these decisions into `maps/subterranean.md`.

### Already yours

- **Canon** `LOCKED`: an immobile void statue that direct hits do nothing to; minion waves while the statue visibly
  chips; then she breaks and opts back in; the Bleu disk sits behind or inside her.
- **The fight** (2026-11-10): she stays a statue the whole fight, `$statue.png`'s gold winged angel recolored grey and
  purple. **Phase 1:** every 10 seconds for 2.5 minutes she summons two of her votaries, 30 in all, "probably Prime",
  wearing No Rewards (state 183) on their fight template. "A DPS check the whole way through": fall behind and it is
  a much worse version of Lucian's Doom Harbingers. **Phase 2, the break:** her statue radiates raw power and pulses
  screen-wide blasts that hurt everyone, her included, for 3% of max HP plus a flat. She takes 5% from elements 1-9
  and full damage from typeless, so the pulse is typeless. A perfectly timed dodge may slip a pulse; otherwise you
  eat it, so no new tag.
- **The count** (2026-11-12): about 25 pulses kill her, and about 5 kill a player.
- **Her level** (2026-11-13): 110, the peak of the Subterranean's band, level with the duo.
- **The pulse carries MDF** (2026-11-13): it ends `- (b.mdf * 1)`, "so that the players aren't eating unmitigatable
  %-based damage, just unavoidable %-based damage".
- **No DEF, no MDF** (2026-11-13): "She is a decomposing statue basically. You are watching it happen in realtime very
  fast." Every pulse costs her exactly 4,000, so she falls on pulse 25, and nothing on her side blunts the duo's
  formulas; only her 5% from elements does.
- **Exact, every time** (2026-11-13): no crits, no variance, "It will hit predictably for the same exact amount every
  single time", and `<unparryable>` ("No parrying though"), which turns J-ABS's passive parry roll off.
- **Skill still counts** (2026-11-13): a held guard trims the pulse ("if you're holding the guard, then you deserve the
  damage reduction"), and a timed parry slips it whole ("If you have the timing to do that, then i say go for it").
- **The last blow** (2026-11-13): she can't die by her own hand. `<noSelfKill>` on her row, a new battler-level J-ABS
  tag ("It should be battler-level, so i could create a skill for actors to have it, too"), so pulse 25 leaves her a
  sliver and an actor lands the kill, which is what pays EXP, SDP, AP and loot.
- **The votaries' look** (2026-11-13): #4 of the lineup, `img/characters/m_winter-spirits.png` at character index 2,
  the faceless shroud with the gold wreath ("the faceless ghost with the scary gold wreath is a good fit"). Unused
  anywhere else in the game.
- **Her sheets** (2026-11-13, built at your ask, approved: "it looks MUCH better. Nice."): `img/characters/$sloth-statue.png` for phase 1, still, and
  `$sloth-statue-pulse.png` for phase 2, a three-frame purple throb (the aura, her eyes, the scepter head and the
  pedestal band brighten together). Grey stone, a face in soft shadow with one violet eye (yours, 11-13: two eyes a
  pixel apart read wrong) whose light spills onto the stone around it, a purple scepter head and pedestal band. Both use 64×104 frames, three pattern columns by four identical rows, so her facing never changes the look and
  `changeImage` at the break swaps in place. Her body template needs Stepping on for the throb to play.
- **Arrivals and stragglers** (2026-11-13): votaries arrive at authored points, in pairs rotating between her feet,
  the drops and the path behind you (slot 5's pick); any still standing at the break stay and eat the pulses (slot 6).
- **The pulse's rhythm** (2026-11-13): "I want it to have a cast time that the player can see, so skilled players can
  perfect parry the pulses", so a 1-second cast, then 3 seconds of quiet. Build: `<castTime:60>` and a looping
  `<castAnimation>` on the skill as the tell, and `cadence: 4` on the routine, since its countdown restarts when the
  cast begins and runs through it (*read*, `JabsBossManager.#updateRoutine`). Phase 2 lasts 1:40 at most.
- **Phase 1's clock** (2026-11-13, "both, naturally"; "lets give her cracks"): at waves 5, 10 and 15 a crumbling-dust
  `animation` plays on her and she flickers awake for a heartbeat into the next crack stage (`changeImage` to that
  stage's pulse sheet, `wait` 1 second, `changeImage` to its still sheet), so each milestone leaves a new crack. The
  break wakes her in the most cracked glowing sheet.
- **Her cracks** (2026-11-13, built): `$sloth-statue-crack1.png`, `-crack2` and `-crack3`, each with a `-pulse`
  twin, same frame size as the first two. Stage 1 cracks the pedestal's top; stage 2 runs a crack up her robe and
  another across the pedestal; stage 3 splits her face, chest and wing. Still, the cracks show a faint violet; glowing,
  they brighten with the throb and ooze a pixel or three down from their lowest ends.
- **Juice** (2026-11-13, "omg we could juice her for pulsing"): J-ABS-Juice already swells and brightens a casting
  battler faster and faster until the cast lands (its default charge, *read*), which is her 1-second tell for free;
  `<juiceMotion:pulse>` on the pulse skill throbs her body once as it fires (my pick).
- **The votaries' kit** (2026-11-13): a basic attack, Lethargy (a slow, telegraphed AoE; the milder, speed-only
  state) and Still devotion as a passive, slot 4's pick ("it makes sense and is thematically fitting").

### Open slots

**1. The pulse dial** (settled 11-13; the decisions are under Already yours). One formula for everyone, one skill, no
branching (A):

`b.mhp * 0.03 + a.mhp * 0.01 - (b.mdf * 1)`: 3% of the target's bar, plus 1% of *hers*, minus the target's MDF.

- **MDF eats most of a small flat.** At 110 a naked Lavos Rupert has 339 MDF and a Raving Lunatic Jerald 279 (their
  `<mdfGrowthCurve>`s). At a 49k bar the flat was about 490, so MDF took more than half of every pulse and Rupert lasted
  13. **So her bar grows to 100k**, a flat of 1,000. Naked, at 110:

| Who | One pulse | Falls on |
|---|---|---|
| Rupert, Lavos (3,278 HP, 339 MDF) | 98 + 1,000 - 339 = 759, 23% | pulse 5 |
| Jerald, Raving Lunatic (5,267 HP, 279 MDF) | 158 + 1,000 - 279 = 879, 17% | pulse 6 |
| Sloth (100k, MDF 0) | 3,000 + 1,000 - 0 = 4,000, 4% | pulse 25 |

- **Her own MDF would come off her self-hit too**, and she has none (yours, 11-13: zero DEF and zero MDF), so she falls
  on exactly 25. At a duo-like 300 she would have lasted 28.
- **Against elements** her 5% makes 100k play like 2M (Jeremy, 11-13, on why a million-HP bar can't carry a flat of 1%
  of itself: at 1M the flat alone is 10,000, three whole Ruperts). Only typeless hits see the real bar, and those are the
  hits that should matter.
- **MDF gear now buys pulses**: every point of MDF a player adds takes a point off every pulse, so a geared duo outlasts
  the table. Out-gearing, as intended; the hall's real MDF numbers size the final bar.
- **The alternative, B, a split self-bite**: she takes 4% of her own bar per pulse and the duo takes a flat sized to a
  band player, so her bar can be any size. Needs a formula that branches on `a === b` (which works, *read*: see 2),
  and with a huge bar nothing the duo does moves her.

Six more things:

- **Out-levelling bends the duo's side only.** Her pulse on herself never bends with J-Level. A duo five levels over her
  takes ×0.6; ten over, ×0.1. That is out-grinding, working exactly as you like it.
- **Rupert falls first**, since his bar and his MDF are both smaller. A duo with no healing loses Rupert first, which
  reads right for a fight that tests healing.
- **No crits and no variance** (yours, 11-13): "It will hit predictably for the same exact amount every single time."
  The pulse is the one exception to your rule since Aqualock's fight that every move can crit. Both are boxes on the
  skill, *read*: with Critical Hits unticked, `itemCri` returns 0 (vanilla and J-CriticalFactors alike) and a 0% roll
  never lands, except for a caster under an absolute blessing, who passes every roll (she never is one). Variance comes
  from the skill's own Variance field (vanilla's `makeDamageValue`, and J-ABS's formula extension too).
- **And `<unparryable>`**, *read* (`JABS_Engine.executeSkillEffects`): J-ABS rolls a passive parry on any hit whose
  caster faces its target (GRD against HIT, skipped while the target guards, casts or dashes), and the roll can turn a
  hit into a glancing blow or negate it outright, Certain Hit or not. The tag turns that roll off for every target,
  her included.
- **What `<unparryable>` doesn't stop**, *read* (`Game_Action.handleGuardEffects`), and you want it that way (11-13): a
  held guard still trims the pulse (its percent, then its flat), and a timed parry still negates it whole, like the
  canon's perfect dodge.
- **Hit type** (for the build): Certain Hit keeps the pulse unavoidable, with no evasion roll, while the MDF term does
  the mitigating. A magical hit would also let MDR shrink it (*read*) and, as in vanilla, MEV dodge it (*unread* in
  J-ABS).

**2. Who lands the last blow** (settled 11-13: A, as your tag). *Read in source* (`JABS_Engine.handleDefeatedEnemy`):
a death scene plays whoever lands
the kill, but EXP, SDP, AP and loot are paid only when an actor lands it. **If pulse 25 kills her, she pays nothing.**

- **A, she can't die by her own hand** (Jeremy, 11-13: "maybe it means they need a tag on the enemy itself that says
  'can't die from skill cast by self'"). A new J-ABS tag on her row, `<noSelfKill>` (yours, 11-13: battler-level, so
  an actor's skill can grant it too): a skill she casts can't take her below 1 HP, while anyone else's still can, and
  the pulse still kills players. Pulse 25 leaves her a sliver and any touch finishes her. She broke herself; you only
  had to be there. `engine (small)`
- **Why a tag beats a formula floor.** The floor, `a === b ? Math.min(b.hp - 1, PULSE) : PULSE`, works today in pure
  data: `a === b` holds on her self-hit, *read* (`subject()` finds her live battler by uuid in `JABS_AiManager`'s
  registry, and the hit's target comes from that same registry). But J-ABS multiplies damage after the formula, and
  one multiplier counts whoever deals the damage, *read* (`calculateAuthoredVulnerabilityStackPct`): Devastated (state
  181, `<vulnerabilityPerAuthoredStateStack:10>`, from passive 626 on Hexagonal's `<aptitude>` list) adds 10% for each
  state stack its holder has put on her, so pulse 25 could punch through a formula cap. The tag clamps where her HP
  actually drops, after every multiplier, and the pulse stays one plain formula.
- **B, she pays nothing**: the disk and the votaries' SIN_5 roll later are the reward.
- **My pick: A, as your tag.** It keeps the sin paying like the others, and the last blow lands on a statue that has
  already given up.

**3. How phase 1 shows it is ticking** (settled 11-13: A and B both, plus a flicker awake; the sheets are built). Canon wants the statue to chip; the fight runs on a 2.5-minute clock, so the
chips are the clock.

- **A, crack frames**: `changeImage` at waves 5, 10 and 15 onto three cracked versions of her statue. `data` + `art`
- **B, a flare**: an `animation` (dust, crumbling) and a brief `tint` pulse at the same waves. No new art. `data`
- **My pick: B now, A when you want to draw cracks.** They stack: the flare plays with or without new frames.

**4. The votaries' kit** (settled 11-13: my pick below). `595` is a stub, and "the skills they get are the skills they get", so this is their whole kit.

- **Lethargy**: a slow, telegraphed AoE that slows whoever it catches. A slowed player kills slower, which feeds the
  flood: the vow is contagious. Either Trudge itself (state 10, which also halves cast speed and cooldowns and costs
  half your HIT; brutal in a DPS check) or a milder new state, speed only. `data`
- **Kneel**: an overhead slam that roots (state 5): they pull you down to kneel with them. `data`
- **Still devotion**: a votary left standing still hardens, stacking DEF or regen until it moves, then losing it all.
  The same tags the Rooted Stance masteries use (`<autoApplyState:[STATE, stand, FRAMES]>` + `<removeStateOnMove>`,
  read in States 1211-1215), and the worms' locked design, so the ones you neglect get worse. `data`; never yet tried on
  an enemy (*unread*).
- **My pick: a basic attack, the milder Lethargy, and Still devotion as a passive.** Kneel is a fine swap for Lethargy
  if you'd rather they root than slow.

**5. Where they arrive** (settled 11-13: my pick below). `spawn` places each body on a fixed tile, so the arrival points are authored. The platform is
about 31×19, the path coming in from the east; she presumably stands at the far west end, facing the way in.

- **A, at her feet**: they rise kneeling beside the statue. Clearly hers.
- **B, out of the drops**: they climb up over the rim, north and south. Horror; the whole platform is the front.
- **C, behind you**: they come up the path you walked in on.
- **My pick: rotate A, B and C in pairs**, so no single corner is safe to camp and the duo has to cover the platform.

**6. Stragglers at the break** (settled 11-13: A). The break lands at 2:30 whatever is still standing.

- **A, they stay and eat the pulses too**: each pulse takes 3% of a votary's bar plus 1% of hers.
- **B, the break consumes them**: they collapse as she wakes, so phase 2 is pure.
- **My pick: A.** It is the DPS check paying off. Whether they die before she does depends on their bar against hers,
  which is one more reason to size the votaries first (see Numbers).

**7. The break itself.** One `start` reaction plays the whole of phase 1 in one lane (two `spawn` steps and a 10-second
`wait`, fifteen times), then the break (a `tint` to purple-red, an `animation` over her, `removeState` Sealed, and a
line if you want one), then `startRoutine` wakes the dormant pulse routine. **Sealed is also what roots her**, and
unsealed Earthie walked and fought, so the break has to `addState` a "Stilled" state in the same breath: rooted and
disabled like Sealed, but with none of its immunity. Sealed itself can't stay, since its PDR and MDR of 0 would also
blunt the duo's hits in phase 2. A rooted body casts a forced skill from where it stands (proven on Earthie), so the
pulse needs no walking. **The pulse is the heartbeat:** its animation can carry a heartbeat sound effect (RMMZ animations
time their own sounds), so the beat that went silent when you reached her comes back as the thing killing you. `data`
+ `audio`

### The clock

- **Phase 1** is exactly 2:30, fixed, whatever the duo does.
- **Phase 2** is at most 25 pulses. At your **one pulse every 4 seconds** (a 1-second cast, 3 seconds of quiet) that is
  1:40, shorter if the duo's damage gets there first.
- About **4 minutes all told**, set by mechanics rather than by an HP bar.
- **Two verbs, one per phase:** phase 1 is Look elsewhere (the statue can't be hurt; the votaries are the fight) under
  a damage race, and phase 2 is Spend (healing, MP and items).
- **Out-grinding it works both ways.** More damage means no flood in phase 1. More max HP means surviving more pulses
  in phase 2, since her flat is pinned to *her* bar, not yours, and more MDF takes a point off every pulse.

### Numbers

- **Size the votaries first.** One votary should take about 5 seconds of a decent duo's damage at her level, so a pair
  dies inside its 10-second window. Measure that damage in her hall before anything else.
- **Her:** level 110, a bar of about 100k, DEF 0 and MDF 0 (yours, 11-13); final bar sized against the hall's geared
  MDF.
- **The pulse:** `b.mhp * 0.03 + a.mhp * 0.01 - (b.mdf * 1)`, typeless, radius 99, a 1-second cast (`<castTime:60>`) so a perfect
  parry or dodge is possible, no crit, no variance and `<unparryable>` (yours, 11-13), from a dormant routine at
  `cadence: 4`.

### Build cost

- **No new J-ABS-Boss verb** (the immunity leak below and 2A's no-self-kill tag are the two small J-ABS changes).
  `spawn`, `wait`, `startRoutine`, dormant routines, `addState`/`removeState`, `tint`, `animation` and `forceSkill` are
  all built and proven (Sealed on Earthie 11-08, spawns on Cynder 11-09, dormant routines on Lucian 11-09).
- `data`: her row (element rates, the pulse), the Stilled state, the votary row and its Prime fight template, the
  encounter, her hall.
- `art`: her statue is built, all eight sheets with the cracks (see Already yours). The votary sprite is chosen
  (`m_winter-spirits` index 2) and can ship as it stands, my take, since its void face already matches hers.
- `audio`: a heartbeat sound for the pulse (the Subterranean's heartbeat BGS is still missing too).
- *Read in source* (11-13): a skill scoped to Everyone reaches its own caster, her allies and her opponents
  (`JABS_Battler.isWithinScope`), so one pulse can land on her, the votaries and the duo, as designed.
- *Fixed* (11-13, uncommitted on rmmz-plugins' `boss-pass`): the glossary and the J-ABS book now say what the code
  does. `<unparryable>` turns off the passive parry only, so a timed parry still negates it (Sloth wants exactly
  that), `<thisIgnoreParry:100>` no longer claims to bypass a held guard, and `<guard>` takes its percent off first,
  then its flat, which is the order that actually favors the player.
- *Unread*: how thirty Prime votaries hold the frame rate (Lucian's swarm only buckled past 200).

## Lust

`Map443` "Basement 13: Lust", the 80×46 dome; enemy `587`. Rupert alone; Fortress band 115-130.

### Talked through (2026-11-13)

His answers on the picks below, after re-running them against the morning rules:

- **The re-run.** Lust sits at the band's peak, 130, and Rupert stands there too: his floor bar is 3,848 HP, 437 DEF
  and 579 MDF (`band-probe.js`, tier 6). Scrambled is simply `<noDamage>`, so the leak below no longer touches it. The
  grab is `b.mhp * 0.45 - (b.def * 1)`, about a third of the floor bar. The window is about 2.5-3 seconds: Lavos's
  longest everyday cast is Dargin Breath at 1.5.
- **Slot 1: a window after every reach (A), and the reach is a pounce.** Jeremy: "The leap is what my spear skill
  does... It works." *Read tonight*: a gap close is an on-hit effect (it runs on a hit or a parry), so D as written
  below, a leap that distance never protects against, can't come from the tags alone. The pounce has two beats
  instead, Cross Dive's own pattern (skill 35: `<gapClose:pierce>`, `<gapClosePosition:infront>`,
  `<thisOnGapCloseEnd:[36]>`): a tell, then a room-wide Certain Hit lock-on (`<gapCloseAny>`, `<gapCloseMode:jump>`)
  that leaps him at Rupert, and the grab goes off where he lands. Still *unread*:
  - the airtime at point-blank;
  - whether a body rooted for the tell still makes the leap (rooting is what lets a forced cast fire past the
    15-tile AI range);
  - how long the window really is once a fixed `wait` has absorbed the leap.

  A pounce-only hall probe goes first. The lunge (C) is the fallback.
- **Slots 2-5 as picked** (his "I see nothing wrong"):
  - a caught grab is damage plus a hold that drains MP;
  - between reaches, goop vents and a groan pulse;
  - he quickens at 66% and 33%, with the double-reach feint in the last third;
  - a flare and a flicker tell the player he's open.
- **Scene text**: TODO placeholders, as in Sloth's hall (his "Your TODO is perfect").
- **His look**: Jeremy said, "It's lust. Wanna find a luxurious elf dude or something?" A lineup of six went out.
  He picked CA's own unused incubus (`$m_incubus`), recolored: "Use option 1, but recolor with dark skin and red
  eyes as you described. Incubus through and through. The sin acceptance transforms you." Dark skin and red eyes
  are Majik's, the one look canon gives a void clown ("black-skinned, red-eyed", `prequel-jr2.md`). Three shades
  went out; the build uses the void black, installed as `$m_sin-incubus`. What "acceptance" means for a sin that
  was forced is in `story-canon.md` under the Basement: forced, then accepted with resignation.
- **The feint is not built.** *Read tonight*: no step stops or swaps a routine, and a second routine started at 33%
  would play during the first one's window (`#canExecuteRoutine` only holds a routine while the boss casts), so its
  own resealing would cut the window short. The feint waits on a small `verb`, if wanted.

### Built (2026-11-13, at his "Otherwise that all sounds good"; uncommitted on `boss-pass`)

Data only, so no plugin changed. Script `/tmp/claude-1000/lust/data/build-lust.js` (RAM); validate OK.

- **His look:** `$m_sin-incubus.png`, CA's incubus with the skin ramp taken to void black and the eyes to red.
- **Rows:**
  - Enemy 587 "Lust": lv130, a provisional bar of 60,000, his groan as his basic attack, GRD 0. His stub's SDP lines
    are kept.
  - Enemy 597 "Goop Vent": Liquihazard's row at lv130 with its rewards taken out.
  - Skills: 2593 Desire (the lock-on and leap), 2594 Embrace (the grab, `b.mhp * 0.45 - (b.def * 1)`), 2595 Groan
    (`b.mhp * 0.3 - (b.mdf * 1)`, radius 2), and 2596 Goop Geyser (Geyser Trap made Certain Hit). Since 11-14 none
    of the four is Certain Hit (see [Every boss's secondary stats](#every-bosss-secondary-stats)).
  - States: 2079 Scrambled (`<immuneToAll>`, `<noDamage>`) and 2080 Embraced (3 s, held, 5% of max MP a tick).
    2081 Overreached and 2082 Fraying (+20% speed a stack) are appended, since the table ended at 2080.
  - Switch 194 "lust defeated"; Map361 templates ev587 and ev597.
- **The encounter `lust`:** Map443, with Lust at (40, 9).
  - A reach every 10 s. The tell: lifted out of Scrambled, rooted, the lock-on cast, unrooted and rescrambled, all in
    one frame. A root makes a forced cast fire from where he stands past the AI's 15 tiles, and `<immuneToAll>` would
    refuse even his own root.
  - Then 2.5 s, then the window: 3 s of Overreached, with a Flash over him and a flicker of the room.
  - Two vents at the start and one each at 66% and 33%, which also quicken the reach by 2 s and add a Fraying stack.
- **His hall:** Map552 "Lust Hall", with its door in the lobby.

**Proven in the hall** (`dist/playtest/lust-pounce-probe.js`, Rupert alone, Lavos lv130, tier 6):

- **The pounce works at every range.** The lock-on lands 57-61 frames after the tell, and the leap follows.
  - Airtime runs about 19 frames point-blank, 31-33 at 6-7 tiles and 67 at 24 tiles.
  - The 24-tile case fired past the AI's reach.
  - Against the west wall he lands on the room side of Rupert, never in the wall.
- **The dodge works.** Stepped 3 tiles aside at takeoff, the grab misses at 2 tiles and at 8. Standing still, it
  lands every time for exactly 1,304, which is 34% of the floor bar.
- **The window** opens and shuts on time: 180 frames, with Scrambled back after it.
- **The vents** wake untouchable. Rupert never came within 6 tiles of one, so they never erupted.

**Open after the probe:**

- **The hold landed on only 12 of 23 caught grabs.** J-ABS skipped a target's state resistances for a Certain Hit, as
  its comment says, but still multiplied in luck, which its comment says it skips too (vanilla RMMZ skips both), and
  Lust's LUK is 1. **Fixed in the engine at his call** ("LUK should be fixed at the engine level"): J-ABS core's
  `calculateStateApplicationD100` now skips luck along with the resistances on a Certain Hit. Uncommitted on
  `boss-pass`; hotfix green.
- **The window opened on a timer, about 1.1 s after a short leap lands,** so a caught Rupert's 3 s hold ended with about
  a second of window left. **Now 1.5 s after the tell** (his default, 11-13): it opens as he lands on a leap of up to six
  tiles, and in the air on a longer one, which the landing grab doesn't mind.
- **His bar is still provisional.** The bot never once hit him in a window, so his 60,000 waits on Jeremy's own
  playtest, as Sloth's final bar does.
- **The vents didn't erupt as first built:** J-ABS gives an inanimate battler no combat AI at all (*read*), so a
  hazard's action list never fires. They now carry `<autoExecuteSkill:[2596, enemiesNearby, 1, 120, 6]>`.

**Proven in the second run** (`dist/playtest/lust-fight-probe.js`, the engine fix and both data fixes in):

- **Holds:** 5 of 5 caught grabs held, and Rupert's MP drained through each one.
- **The window opens as he lands:** 7-30 frames after touchdown, against 60-79 before.
- **The vents erupt:** Goop Geyser hit for 825 every two seconds while Rupert stood 3 tiles from one.
- **The reactions:** health set to 65%, then 32%, inside a window. Each time the next vent woke and Fraying stacked, and
  the gap between tells went 600, 480, 360 frames. One Fraying stack took his pace from 0.0313 to 0.0375 tiles a frame
  (+20%).
- **The kill:** Rupert lands it, and the hall resets: frame off, menu back, vents gone.

### The arena wired (2026-11-13, at his "Yeah let's go"; uncommitted)

Map443, by `/tmp/claude-1000/lust/data/arena.js` (RAM), modeled on Sloth's Map409. Switch 195 is "lust fight started".

- **The way back to Basement 12** (ev1) shuts while the fight is on and transfers again once he falls.
- **His stand-in** (ev2) waits at his post, (40, 9).
- **The pre-boss scene** (ev3) is an autorun on arrival, with watch or skip.
  - **Watched:** Rupert steps in three squares, and Lust lurches toward him in three stretches of eight, to (40, 33),
    seven squares short of him. A TODO marks each beat of the 9-16 draft where the walk has brought him, so the scene
    lasts exactly as long as the walk. The flashback is its own content item.
  - **Skipped:** both are set down where the walk would have left them.
  - Then the big boss music, the fight, the boss frame, and the menu off.
- **The encounter's participant now spawns at (40, 33),** where the approach leaves him; the hall's fight starts there
  too.
- **The post-boss stub** (ev4), on switch 194: ends the encounter, cleans up, and leaves a TODO for the post-amble.
- **The elevator** (ev5) stands in the back wall's recess at (39, 2) as a placeholder `!SF_Door1`, dead until he falls.
  Then it holds a TODO for the lane's exit, "How the two exits line up": the ride up to the entry hall, and the
  Rupert-first or Jerald-first scenes.
- **Proven both ways** (`dist/playtest/lust-arena-probe.js`, `LUST_PREAMBLE=watch|skip`). The scene starts on its own,
  15 s watched and 3 s skipped. His body lands on (40, 33), the way back shuts, and the frame, the menu lock and the
  boss music all come in. Once he falls: the frame goes, the menu comes back, the way back transfers again, and the
  elevator wakes.
- **Still his:** every TODO line, the flashback, the elevator's look and where it goes, and a look for the shut way back,
  which is invisible for now.

### Already yours

- **The hook** `LOCKED (2026-09-17)`: he is only vulnerable when he wants something. Scrambled to zero, nothing gets in
  while he lurches. When he reaches, a slow, telegraphed grab, the reach is the opening: dodge it and the recovery is
  where he takes damage. Move and Wait: a pure timing duel.
- **The grab is avoidable, never breakable**, and getting caught "hurts like a mistake, not like the end of the fight".
- **Tuned to the man in the room**: a timing duel is harder for a caster, on purpose; a Rupert built as a bruiser simply
  finds it easier.
- **The room**: big on purpose for his slow walk; Rupert comes in at the bottom middle, Lust waits around (40, 9), the
  elevator sits in the back wall's recess. Dark (`<ambient:[100]>`), lit by Rupert's own gear and a few machines.
- `OPEN` in `fortress.md`: whether he speeds up as he takes damage, and what the arena does while the player waits.

### Open slots

**1. How the window opens.** *Read in source:* no step can tell whether a skill landed or missed, so "open only if the
reach missed" can't be said with today's verbs.

- **A, a window after every reach.** One routine: `forceSkill` the reach, `wait` out its cast, `removeState` his
  immunity and `addState` a short rooted "Overreached", `wait` the window, then put the immunity back. A Rupert who got
  grabbed spends most of that window held, so the cost of a mistake is the window itself. `data`
- **B, a hit-or-miss trigger**: a new `on` for reactions, "this skill landed / missed", so a caught reach opens nothing.
  Strictly what the lock says. `verb`
- **My pick: A.** In play it is the same promise (dodge it and you get your hit; get caught and you don't), with no
  plugin work.

**Then what the reach is.** *Read in source:* a forced skill only fires once its caster has walked into the skill's
range, so a short-range reach could land late, after the fixed `wait` has already opened the window.

- **C, a lunge from anywhere**: a range that covers the room and a hitbox that is only the lunge (a line of five or six
  tiles toward Rupert). The cast starts where he stands and the window lands on time. **The hole:** a Rupert who just
  stays out of lunge range never has to dodge anything, and still gets every window. Spacing is still a skill, but the
  dodge in your lock is gone. `data`
- **D, a pounce**: J-ABS's gap-close tags (`<gapClose>`, with `<gapCloseMode:jump>`) make the reach a leap at Rupert from
  wherever Lust is. Distance never protects; step out from under the landing, or dodge through it. "Lust desires, and
  desires you", as a move. `data`; the tags are *read* in J-ABS's tag table, but how a gap-close picks its landing spot
  when the skill has a cast time is *unread*.
- **My pick: D, with C as the fallback** if the pounce misbehaves in the hall.

**2. What a caught grab costs.**

- **A, damage and a hold**: about 30% of Rupert's bar plain, and Stunned long enough to eat the window.
- **B, A plus a drain**: the hold also bleeds his MP. A skill deals one kind of damage, so the drain rides on a state,
  the way Smother (148) carries an `<mpFormula>`. He takes something, and for a caster that is where it hurts.
- **My pick: B.** It is the theme in one number, and a crit (×1.5) still leaves Rupert standing.

**3. What he does between reaches** (`OPEN`). The waiting has to be tense, or the duel becomes a jog around the dome.

- **A, nothing but him.** His slow walk is the pressure, as it is in the scene before. Cheapest, but the dome is huge.
- **B, the machinery vents.** The basement's whirring machines spit toxic goop on a slow cadence: `spawn` a few goop
  hazards (a Liquihazard-style row, or a new one) at fixed spots, so Rupert keeps choosing where to stand while he
  waits. Rupert hates sludge. `data`
- **C, he groans.** A short-range pulse around him while he lurches, so hugging him is punished and the reach is the
  only time he extends. `data`
- **D, his trail.** Every few steps he leaves a goop puddle behind him, so the dome slowly fills with what was done to
  him. The most Lust idea here, but `spawn` only takes fixed tiles, so it needs "spawn where a participant stands".
  `verb`
- **My pick: B and C together.** C keeps the distance honest and B keeps Rupert moving; both are data. D is the one
  worth a verb if you fall for it.

**4. Does he speed up as he takes damage** (`OPEN`)?

- **A, yes, in steps.** At 66% and 33%, `quickenRoutine` brings the reach round sooner (say every 10 seconds, then 8,
  then 6) and a small speed state makes him lurch faster. Windows stay the same length, so the punish stays fair;
  they just come more often. The scramble fraying, and the only tell that Rupert is winning. `data`
- **B, a feint at the end.** From 33%, the reach comes twice back to back, so a Rupert who dodges the first and
  starts casting greedily eats the second. It reads on sight (two telegraphs), so it is not a memorization wall.
  `data`
- **C, no.** The duel stays pure and the HP bar sets the length.
- **My pick: A, with B as the last third** if you want a final exam.

**5. Telling open from closed.** Hits landing for 0 is already a tell. On top of it:

- **A, a reach pose**: `changeImage` between his lurch and an overextended sheet. `art`
- **B, a flare**: an `animation` over him the moment he opens, and a brief `tint` flicker of the whole screen. `data`
- **My pick: B now, A when his sprite exists** (his row and sprite are still open anyway).

### The clock

- About **10-12 windows**. With the reach every 10 seconds, quickening to 6, that is roughly **1:30-2:00**.
- **Two verbs:** Move and Wait, as locked.
- **Out-grinding it works:** more damage per window means fewer windows, and more HP means more mistakes survived. No
  level skips the waiting itself, which is the point of the fight.

### Numbers

- **The window** has to fit Rupert's longest everyday cast plus a second, or a pure caster can never punish. Measure
  his cast times before setting it; my guess is 3-4 seconds.
- **His bar:** what a decent Rupert deals in one window, ×10-12.
- **The grab:** about 30% of Rupert's bar plain, plus the MP drain.

### Build cost

- **No new J-ABS-Boss verb** for the picks (the immunity leak below is the one small J-ABS change): routines, `wait`,
  `addState`/`removeState`, `quickenRoutine`, `spawn`, `animation` and `tint` are all built and proven.
- `data`: his row, the "Scrambled" immunity state (Sealed without the root or the disable: PDR 0, MDR 0, immune to
  states), the Overreached state, the reach and its draining hold, the groan, the goop hazard, the encounter, his hall.
- `art`: his sprite, and a reach pose if wanted.
- *Unread*: where a gap-close pounce lands when the skill has a cast time (does it leap at where Rupert was when the
  cast began, or where he is when it fires?); for the fallback, that a room-wide reach starts its cast where he stands.
- **The immunity leak** below applies to Scrambled too.

## Envy

`Map426` "Tower 13: Envy", 40×46, two screens tall; enemy `584`. Jerald alone; Fortress band 115-130.

### Already yours

- **The shape** (2026-08-03, reviewed 2026-09-17; "shape settled" in `fortress.md`'s open items): many copies, only one
  real, and the real one subtly *wrong*, because envy imitates but never achieves. The copies are **copies of Jerald**,
  not of her. One boss and one bar, the boss frame.
- **The tell is visual and the difficulty is the count** (2026-09-17): a sprite cue, "a hair color, say". Three with one
  off is obvious; thirty with one off is an effort.
- **The clones are invincible, so they mill about at random.** Clones that converged on Jerald would be impassable
  terrain and deadlock the fight; milling keeps her reachable.
- **The tax is wasted cooldowns**: a "Flambé du Vide" spent on a clone is the punishment, and it is self-inflicted. Know
  and Spend, the two verbs no earlier boss carries.
- **The room** (2026-10-24): sized for thirty "one every few tiles", "PLENTY of space for THIRTY fucking clones to
  wander around and be sufficiently annoying"; she waits on the paved floor (x 13-26, rows 6-12).
- `OPEN` in `fortress.md`: the exact sprite cue, the count, and whether she moves in the crowd.

### Open slots

**1. What "invincible" means.** The engine has two kinds (found during Gloria's fight, 2026-11-10):
`<jabsConfig:invincible>` on the clone template lets a hit pass straight through, while a state like Sealed (PDR 0, MDR 0,
immune to states) lets a hit land for 0.

- **A, land for 0**: a new "Hollow" state on the clone template, Sealed without the root. A skill that hits a clone
  connects, goes on cooldown and does nothing, so the tax is real. A sweep that catches her among clones still hurts
  her. `data`
- **B, pass through**: hits ignore clones. A projectile then flies through the crowd until it finds her, which deletes
  the tax and most of the search.
- **My pick: A.** It is the only one where a wrong guess costs anything.

**2. The sprite cue.**

- **A, the hair** (your example): Jerald's sheet with his hair shifted to her void purple. `art`
- **B, mirrored**: the one Jerald carrying his weapon in the wrong hand, a reflection rather than the man. Reads best
  side-on. `art`
- **C, the eyes**: too small at map scale to find in thirty.
- **My pick: A.** It is your idea and the cheapest sheet to make. B is the wittier one if you want to draw it.

**3. The count.**

- **A, thirty from the first frame.**
- **B, a ramp that teaches first**: 10 when the fight starts, 10 more at 66%, 10 more at 33%, each a `spawn` in a health
  reaction. The player learns what "off" looks like among ten, then has to find it among thirty. `data`
- **C, the crowd collapses at the end**: at 10% every clone fades and she fights as herself, the imitation spent.
  Nothing takes a body off the map mid-fight today: a `spawn` body can't be named by a step, and even a bystander can
  only be given the death state, which has never been tried under J-ABS-Boss. So either thirty bystander participants
  and an untested death state, or a new `despawn` verb. `verb`
- **My pick: B.** C is a nice last beat, but it is the expensive kind and it pays out the gimmick early.

**4. Does she move in the crowd** (`OPEN`)?

- **A, when hit**: a `blink` at every tenth of her bar (health reactions at 90, 80, ... 10) to one of about eight fixed
  tiles spread over the room. You found me; now find me again. `data`
- **B, on a timer**: a `blink` every 15-20 seconds whether she was found or not, so finding her and then dawdling costs.
  `data`
- **C, never**: she mills like the rest, and once found she can be chased down. Too easy after the first find.
- **My pick: A, with B as a slow fallback** (every 30 seconds) so she never stays found for long.

Three engine notes, all *read in source*:

- **The tiles come in the same order every attempt.** A `blink` names one tile and steps play in order, so the first
  reshuffle always goes to the same spot, the second to the next, and so on. A player who retries learns the route,
  which is out-grinding of a kind, but it hollows the search. A `blink` that picks one of several tiles at random
  would fix it. `verb`

- **A blink's flare gives her away.** `blink` fades her out and back in; any `animation` on it flares at both ends.
  Leave the animation off, and dim the whole room with a short `tint` while she moves, so the fade-in is hard to catch.
- **Home is set once, at spawn.** An idle J-ABS battler wanders near its home tile and walks back toward it when it
  isn't close. After a blink she would drift steadily back toward where she spawned, a line through a crowd that
  otherwise wanders. Either accept it as a tell for sharp eyes, or let `blink` (and `jump`) move the body's home.
  That second one needs a home setter in J-ABS (nothing sets it after spawn today) and J-ABS-Boss calling it, but no
  new field, so no editor or validator change. `engine (small)`

**5. What she does to Jerald.** Without a threat the search is free.

- **A, she imitates him**: her kit is Jerald-shaped (his swing, his dash) in void, because envy copies. She only
  swings when he comes within a couple of tiles, so attacking him gives her away. `data`
- **B, she can't keep it in**: every 12 seconds or so a routine forces a burst of hate around her, a short-range blast
  that punishes standing next to her and briefly shows where she is. `data`
- **C, she steals**: her hit takes one of his buffs, since she wants what he has. Nothing in J-ABS strips a buff to
  hand it over. `engine`
- **My pick: A and B.** The burst gives a player who is losing the search a way back in, at a price.

**6. Leaks.** Two things could out her without the eye test.

- **The targeting list names everything.** *Read in source:* the target-selection window draws each candidate's name,
  so a targeted skill would list thirty Jeralds and one Envy. **Make the clones her own row** on a second template
  (Hollow, `noHpBar`, a sight of 0, Jerald's sheet): `spawn` takes a `template`, so the clones need no row of their own
  and the names match for free. Naming that row "Jerald" is the funny version: her boss frame then says Jerald too,
  because she wears his name as well as his face. `data`
- **HP bars:** `noHpBar` on the clone template and on hers, so only the boss frame shows her bar. `data`
- Hits landing for 0 on a clone and for real on her is fine: you have already spent the cooldown to learn it.

### The clock

- About **ten finds** (pick 4A), each a search of 5-15 seconds plus a few seconds of hitting: roughly **2-3 minutes**.
- **Two verbs:** Know (which one is her) and Spend (what a wrong guess costs).
- **Out-grinding it works:** a hit big enough to cross several tenths at once fires those reactions together, and she
  only ends up in one place. Enough damage shortens the search itself, not just the bar.

### Numbers

- **Her bar:** ten times what a decent Jerald deals in about four seconds of contact.
- **The burst:** short range (about two tiles), about 20% of Jerald's bar plain.
- **Clones:** 10/20/30; eight blink tiles spread over both screens of the room.

### Build cost

- **No new J-ABS-Boss verb for the picks.** The small J-ABS changes are the immunity leak below (Hollow has it too)
  and, if you want it, the home fix (4, `engine (small)`). `spawn`, `blink`, health
  reactions and routines are built and proven.
- `data`: her row, the Hollow state, the clone template (her own row, Hollow, `noHpBar`, a sight of 0 so they never
  engage), her kit, the encounter, her hall.
- `art`: the off-Jerald sheet her fight body wears (and a mirrored one if you go with 2B).
- *Unread*: **whether a clone that gets hit starts chasing Jerald.** A J-ABS enemy that is hit usually engages whoever
  hit it, even for 0, and thirty clones converging on him is exactly the deadlock you ruled out. Check that a Hollow
  clone with sight and pursuit 0 goes back to milling. Also how far a spawned clone wanders from home (J-ABS's "close"
  distance), and thirty idle bodies' frame rate (fine for Lucian's swarm until 200).

## Grudj

`Map444` "The Courtyard", 60×40; no enemy slot chosen yet. The duo together again; about level 150.

### Already yours

- **A duel, not a phased battle** (2026-09-17), "but there will still be timed mechanics (the machine the scrambles
  followed by devastation)" (2026-11-12).
- **The scrambler is a machine in the room on auto-repeat**: about a 10-second wind-up the player can see, about a
  15-second cooldown. The lesson is to bring interrupts; the alternative is brute force, eating a couple of his AoEs on
  the way. **Only the Voltage Baton really hurts it**, "one zap... ridiculous damage" (2026-10-25).
- **Every scramble is followed by Meltima**, about a 10-second cast. Meltima is interruptible, but a scramble that
  lands paralyzes for the whole cast, so you eat it. With Treis's questline done the paralysis never lands and the SDP
  blackout drops to 3-5 seconds, or nothing.
- **The scramble** (canon): mute, disarm, root and paralysis, plus a 15-second full SDP disable.
- **His arsenal**: a battle mage who blinks to points and then does things. Beams, drowning spirals, zap traps set
  mid-fight (Zaphazards), stunning quakes, slow homing projectiles, void zones; an elemental rainbow, more local than
  Lucian's.
- **Desperation is tempo**: lower HP buys him cooldown reduction, the only tell that you are winning.
- **The opening**: he takes the initiative, scrambles them and slams the big one, and is baffled when they don't fall.
- **The room** (2026-10-25): the terrace across the top (rows 4-7) with the statue he steps out from at about (29, 5),
  stairs down the middle, the duel floor below (rows 10-36). The machine and the lights are yours to place.

### What the engine says about it (all *read in source* tonight)

- **Nothing can interrupt a cast yet.** J-ABS cuts a cast only when it is hit by a skill tagged `<interrupt:N>`, and no
  skill, item, weapon, armor or state in the game carries that tag (counted through the parsed JSON). "Bring interrupts"
  needs some player skills to get it. Rupert's own Meltima (skill 484) is instant and carries none, so the payoff in
  your draft, cutting his Meltima with Rupert's, needs `<interrupt:N>` on 484 at the very least.
- **The machine can't be inanimate.** J-ABS gives an inanimate battler that can't idle no AI at all, and a forced cast
  is finished by the AI, so an inanimate machine would wind up forever. Make it a rooted battler instead, the way
  sealed Earthie cast her rocks (proven 11-08).
- **A dead machine stops scrambling by itself.** A forced skill on a body that has fallen is skipped, while the steps
  acting on Grudj in the same routine still play.
- **The baton's zap is 1% of the target's *current* HP**, as tool-overload, which no enemy is weak to yet. A rate of
  ×100 makes one zap take whatever is left (a little more than ×100, if the zap's damage variance would leave a sliver);
  anything well under that takes a share of what is left, again and again, without killing. The machine also wants
  MDF 0, or the zap's `- b.mdf * 0.1` eats it.
- **Cooldown tags, both kinds.** `<cdr:[...]>` only shortens the global cooldown between actions; the per-skill tempo
  lives in J-ABS Timing's `<castSpeedRate:[...]>` and `<fastCooldownRate:[...]>`, which Trudge already uses to slow
  things down. Pointing them the other way is data; which direction the numbers run is to confirm in the hall.
- **The SDP blackout has a clean seam.** Every panel bonus flows through one call (`Game_Actor.getAllSdpRankings`), so a
  blackout state is a small J-SDP feature. Two catches: panels raise max HP, so a blackout shrinks it and RMMZ clamps
  current HP down to match, which a lifted blackout never gives back; and masteries come from somewhere else (not read
  tonight), so a blackout would have to decide about them too.

### Open slots

**1. The machine.**

- **Where** (yours): **A**, on the terrace beside his statue, so reaching it means going up the stairs while he
  blinks around the floor below; **B**, mid-floor, so the fight swirls around it; **C**, the far corner from his blink
  points, so it is always a choice between him and it. **My pick: A.** The terrace is already the stage he enters
  from, and the stairs make "go deal with it" a trip.
- **How it dies.** **A, one bar**: brute force takes about two cycles of focused damage, and once it is down there is
  no more scrambling at all. **B, it reboots**: it comes back after a while unless the baton finishes it. Nothing can
  bring a fallen body back today (a summoned participant arrives once), so that is a `verb`. **My pick: A.** "Obliterated
  machines cannot do machine things" is your own line.
- **The baton.** tool-overload at **×100**: one zap and it is gone. Or ×50, a few zaps while dodging, then anything
  finishes it.

**2. The cycle.** One routine, timed from Grudj:

1. `forceSkill` Scramble on the machine (its 10-second cast is the wind-up, flaring over the machine).
2. `wait` about 10 seconds.
3. `forceSkill` Meltima on Grudj, with a range that covers the room so he casts where he stands.

At a 35-second cadence that is 10 seconds of wind-up, 10 of Meltima, and 15 of breathing room. *Read in source:* a
routine that comes due while Grudj is mid-cast waits for him to finish, so a cycle can slip by a second or two. `data`

**3. The Treis gate.**

- **A, two encounters**: `grudj` and `grudj-treis`, and his scene starts whichever one the questline's switch says. The
  Treis one's Scramble carries no paralysis and a short blackout. Everything else is shared config. `data`, and map
  events choosing an encounter is how Aqualock's chain worked.
- **B, the baton grants it**: carrying the Voltage Baton gives the party paralysis immunity. Whether a held item can
  grant a passive is *unread*.
- **My pick: A.** It is certain, and it keeps the gate out of the inventory.

**4. The SDP blackout.**

- **A, build it** (`engine`): a state that turns the panels dark, minus max HP and MP so nobody loses HP to the clamp.
  Trainer Lord's exam wants the same thing after 1.0, so it would be built once for both.
- **B, stand it in**: a "Scrambled Junction" debuff (most parameters ×0.7 for 15 seconds). Reads the same to most players.
  `data`
- **C, drop it**: the four ailments carry the scramble alone.
- **My pick: B for this pass, A when the exam comes.** Neither the fight nor its testing waits on J-SDP work.

**5. The arsenal and how he moves.**

- **A, a rainbow rotation**: a routine blinks him to a point and casts the next element in a fixed order, Heat, Liquid,
  Air, Ground, Energy, Void. Predictable on purpose; each move is telegraphed, so knowing the order helps without being
  required.
- **B, his own AI picks**: five or six moves as his actions, and a routine only blinks him about every 8 seconds.
- **C, B plus the traps on their own clock**: a pair of Zaphazards `spawn` at fixed tiles about once a minute. Spawns are
  taken off the map with the fight.
- **My pick: C.** The scramble cycle is the authored spine; around it he should feel like a duelist, not a metronome.

Starting points for his moves, each cloned from a skill that already exists: a beam off Aegis Beam (2546), a drowning
spiral off Geyser Trap (2515), a stunning quake off Quake (2504), slow homing bolts (the `+Homing` overlay, 2007, on
his basic attack), a void zone off Eclipse Trap (2517), and Zaphazards (513) for the traps. `data`

**6. Desperation.**

- **A, in steps**: at 75%, 50% and 25%, `quickenRoutine` the cycle (35, then 30, 25, 20 seconds) and the blink routine,
  and add a state with the Timing tags pointed fast. At 20 seconds the breathing room is gone, which is the climax and
  also a reason to have killed the machine early. `data`
- **B, smooth**: one state whose Timing formulas read his HP, so the tempo climbs every hit. Whether those formulas
  re-read as HP falls is *unread*.
- **My pick: A.** Proven verbs, and each step is a moment the player feels.

**7. The opening.** A `start` reaction: his line, Scramble from the machine with `cast: false` (instant and unavoidable,
a set piece), then the big one, with a formula that takes **a third of current HP**, with no crit and no variance. Even
at J-Level's ×2 cap that is two thirds of what you have, so it can never kill, which is exactly his "why aren't you
falling over". (Half would not be safe: ×2 makes it all of it.) Then his baffled line, and the cycle begins. `data`

### The clock

- A cycle every 35 seconds at full HP, every 20 by the end. **About 4-5 minutes** for a decent duo: the length of a
  final duel, set by HP but paced by the cycle.
- **Which two verbs depends on the save**, which is the nice part. Without the baton, Look elsewhere (the machine) and
  Move (the arsenal). With the baton the machine falls early, and it becomes Move and Wait (dodging, and timing an
  interrupt on Meltima).
- **Out-grinding it works**: a strong duo brute-forces the machine and outlasts Meltima; the questline is the clever
  way through, and time spent on it buys power, which is your rule.

### Numbers

- **Meltima:** about 60% of a lead's bar plain, so a crit (×1.5) from full leaves a sliver. Brutal, never a one-shot from
  full.
- **The machine:** brute force in about two cycles of a decent duo's focused damage; the baton at ×100 or ×50.
- **The paralysis:** long enough to cover the wait and the whole Meltima cast, about 11 seconds.
- **His bar:** about four minutes of a decent duo's damage, less the time each cycle takes away.

### Build cost

- **No new J-ABS-Boss verb for the picks.** Bystanders, routines, `wait`, `blink`, `spawn`, `quickenRoutine` and
  health reactions are built and proven.
- `data`: his row and kit, the machine's row and template (a bystander participant, rooted, MDF 0, tool-overload
  ×100), Scramble, enemy Meltima, the stand-in debuff, both encounters, his hall.
- **Class kits:** `<interrupt:N>` on a few player skills, Rupert's Meltima at least. It is data, but it is a design pass
  over the class trees, and it is yours.
- `engine` (later): the real SDP blackout, shared with the exam.
- `art`: his sprite and the machine.

## The ghost (Tower 9)

**Why the mini-bosses exist:** there are two, one per lane, both on floor 9. The lanes are built in step, with switcher
rooms at 4, 8 and 12, so room 9 is each lane's big fight between its second switcher room and its last "how convenient"
beat (`fortress.md`, The lanes, room by room, `PROPOSED` 2026-09-17). Jerald gets the ghost, Rupert gets the horde.

`Map422` "Tower 9: Mini-Boss", 40×23, one screen. Jerald alone.

### Already yours

- "A MASSIVELY overpowered, elysian, high-level ghosty": one affix-laden ghost, target-leveled around 135.
- The floor is "left wide open for the ghost, which needs no cover"; the way on is the elevator in the back wall.
- Exactly one encounter per room `LOCKED (2026-10-24)`. Rosters and levels were deferred (2026-09-17).

### Open slots

**1. A row, or a fight?**

- **A, a placed row**: Reapy (`105`, the ghost line's T5) at level 135 wearing Elysian and a suffix. No frame, no door.
- **B, a small encounter**: the boss frame, the elevator sealed until it falls (the way Map172 seals its exits), and
  one twist. `data` and a hall.
- **My pick: B.** A frame and a shut door are what make a strong enemy read as a mini-boss, and both are free.

**2. The twist** (only one; it is a mini-boss).

- **A, it never stays put**: a `blink` routine every 10 seconds or so around six points on the open floor (ghosts
  need no doors), so Jerald has to keep catching it. The points come in the same order every time, which is fine for a
  chase. Its Reap, a half-circle swing that hits harder below half HP,
  punishes a careless approach. Move.
- **B, it goes cold**: at half HP it fades to a near-invisible sheet (`changeImage`), and only its attacks show where it
  is. `art`
- **C, it splits into copies.** **Don't.** That is Envy's trick four floors up, and it should land fresh there.
- **My pick: A.** Envy is the fight where Jerald's force is wasted; this one should let force feel good: a big target
  that won't hold still, hit hard whenever you catch it.

**3. How overpowered.** By its own formula (`(a.level ** 2) * 46.57`), a level-135 Reapy has about 849k HP. Elysian
(×50 HP) makes that about 42M; Grand (×20) about 17M; Prime (×10) about 8.5M. A suffix that also raises HP **adds** to
the prefix rather than multiplying (Gloria's masterworks: Grand's ×20 and Merit's ×2 made ×21). **Rule:** about two
minutes for a decent Jerald at the band; measure his damage, then pick the prefix that lands there. "MASSIVELY" is
yours to keep, and Elysian also pays ×10.

### The clock

About **2 minutes**. Move, plus a damage check. Out-grinding it is the whole intent.

### Build cost

`data` only: a fight template (Reapy, Elysian or your prefix, a suffix, level 135, a sight that covers the room), the
encounter with its blink routine, the elevator's sealed page, a hall. No art; the ghost line's sheet already exists.

## The horde (Basement 9)

`Map438` "Basement 9: The Horde", 60×45, "the biggest cavern yet, room for one man against a crowd". Rupert alone.

### Already yours

- "The horde of puppets, orbs and golems, not an actual boss": several affix-laden Origin-tier rows around 130.
- `OPEN`: robots or puppets. Your rule for reading the castle: puppets, orbs and golems are the castle's own, robots are
  his installs.
- **On the map today:** a Pandora (`535`) at (29, 33) on a night page (16:00-4:00), and a named-mob alert at (2, 2) on a
  day page. Whether the horde joins those or replaces them is yours.

### Open slots

**1. Robots or puppets** (`OPEN`)? **My pick: puppets, orbs and golems.** The basement is the castle's own underbelly,
and the robots already have their moment ambushing Jerald on the elevator ride, so each lane keeps its own reading.

**2. How it arrives.**

- **A, placed bodies**: four or five Origin T5s standing in the cavern. No encounter.
- **B, three surges**: an encounter whose participants are the horde. Three stand there from the start; the next three
  are `summon`ed when the first three have all fallen (one `fallen` reaction naming all three), and the last three when
  the second group falls. No boss frame needed. Built and proven for Gloria's masterworks (11-10), rematch included.
  `data`
- **C, a rising tide on a timer**: Sloth's phase 1, which the player has already lived through in chapter 4. Don't.
- **My pick: B.**

**3. What each surge is.** Rupert's sin fight downstairs tests what he is worst at, so this is the warm-up where a
caster shines: crowds that bunch up for area spells.

| Surge | Who | What it asks |
|---|---|---|
| 1 | three puppets (Pandora, Homunculus) | they rush and bunch up: the area spell's moment. Mind Hold Pose, which shrugs off hits and then counters (it crit for 2,109 in Gloria's run) |
| 2 | two orbs (Aegis, Bastion) and a puppet | beams from range while something is in his face: move and cast |
| 3 | a golem (Atlas) and two orbs | a tank with a ring-shaped quake, and the orbs still firing |

All Origin (×2 HP) at about 130.

### The clock

Three surges of about 45 seconds each, **about 2-2.5 minutes**. Move, plus a crowd to manage. Out-grinding it works.

### Build cost

`data` only: fight templates per row (the row, Origin, level 130), the encounter (nine participants, six of them
summoned, two `fallen` reactions), the west door's sealed page until the last surge falls, a hall. No art.

## One leak that touches four fights

Every "can't be hurt" state in this doc (Sealed on Sloth in phase 1, Scrambled on Lust, Hollow on Envy's clones) is
built the way Sealed is: PDR 0 and MDR 0. That is also how Earthie's shipped seal works. **It doesn't stop everything.**

- *Read in source:* PDR only scales physical hits and MDR only magical ones (J-ABS-Formula's `Game_Action`, the same
  rule as vanilla RMMZ), so a **Certain Hit** skill ignores both.
- *Read in source:* J-Elem skips element math entirely for a skill whose element is None (`calcElementRate` returns ×1
  when the action's elements include 0), so element rates can't catch those either.
- *Counted in the parsed data:* 21 player skills are Certain Hit with real damage. Twelve use the weapon's element and
  four are tools (Ukelele, Red Wand, the Voltage Baton, Snake Rope); every element rate at 0 on the immunity state
  would stop those. **Six are element None and would go straight through:** Tesla Coiling (80), Overcharge I and II
  (1061-1062), Capacitor Surge I and II (1063-1064), and Meltdown (1065).

Options:

- **A, zero every element rate on the immunity states, and give those six skills a real element.** `data`, but the
  second half changes six player skills everywhere.
- **B, a state tag that refuses all damage**: a hit still lands (so the cooldown tax and the targeting stay), it just
  does 0, whatever its kind. Closes it for all four fights at once without touching anyone's kit. `engine (small)`.
  This is not the toggleable invincibility you passed on for Gloria (11-10); that one lets hits pass through. Nor is it
  J-ABS's existing `<jabsConfig:invincible>` (*read*: "skills never connect"), which Earthie's build ruled out for
  seals (11-08): the player's target is their last hit, set even by a 0-damage hit, so a seal has to let hits connect.
  Working name `<noDamage>` (11-13, he asked "didn't we make the invincible tag?").
- **C, accept it**: six skills, and a player who finds the gap has earned it.
- **Settled (11-13): B, as `<noDamage>`, to your spec.** "a tag that is simply <noDamage> for things like states and
  whatnot, and while applied, the battler simply takes 0 damage, period. Can be healed, though. Just not hurt. Doesn't
  matter the damage type, or source. Not even damage over time (poison/bleed/etc) will hurt, though the tag won't
  prevent applicable of such a state, just won't do anything basically." My reading of "the damage type" is RMMZ's
  too: MP damage and both drains also come to 0, while both recovers still work. **Built 11-13**, see the shopping
  list's row 2. **On Sealed (state 2072) at his 15:10 "yeah slap <noDamage> on sealed"**, so Earthie's seal and
  Gloria's throne both stop the leak. Proven in both halls: Tesla Coiling (Certain Hit, no element) computes 5,397
  into sealed Earthie and lands 0, takes 5,538 off a golem and 5,068 off Earthie once unsealed; 362 hits on sealed
  Gloria all landed 0, and she hops down unsealed on cue. Both halls reset clean, 0 exceptions.

## Every boss's secondary stats

Built 2026-11-14 at Jeremy's "Go for it" (07:45), uncommitted on `boss-pass`. Script
`/tmp/claude-1000/envy/build-growth.js` (RAM), backups beside it; validate OK.

**His rulings** (11-13 and 11-14):

- "All bosses should have level-based growth for: HIT/EVA/CRI/CEV/MEV/GRD. In fact, ALL enemies should have it", but
  the sweep over every enemy is a later pass, not this one.
- "The sins are not tiered, they are bosses." Enemy Rank T1-T5 is the families' ladder.
- Sloth's pulse stays Certain Hit. The rest of the sins' kits don't.
- No trailing multipliers: "What's the point of the x2 or x0.5? Why not just halve or double the values?... Think:
  nested ternaries."
- "A basic formula for growth plus a base (like regular params)", and "keep the full growth formula in the tags... the
  traits aren't where i look first".

**The rule.** Each line is the whole stat in plain numbers: a base worth ten levels of growth, plus the growth per
level, `<hitBuffPlus:[25 + (a.level * 2.5)]>`. A stat that grows fast also starts high, so the base shows what the
boss grows up to be good at. The regular enemies near every boss level work out to about HIT 2, EVA 1.25, CRI 1, CEV
0.3, MEV 1 and GRD 0.75 a level: a rate above that leads, one below it lags. The six flat traits came off each boss
row, so every stat has one home. GRD adds on top of the engine's 100% (every battler starts there; it's how a
lv130 Raving Lunatic Jerald reads exactly 174.1%). Sloth's and Lust's GRD ×0 trait zeroes that 100%, so they end at
0.6 and 0.7. *Read in source:* J-ABS skips the parry roll only at GRD 0 or below, so it rolls for them again, but GRD
under 1.0 counts against the defender, and the odds come out 0% against an at-level duo. Sloth's hold against anyone
at her level; Lust's hold against a floor Rupert with half again the margin 0% needs.

Each cell is base + per level, then what it reaches at the boss's level:

| Boss | Lv | HIT | EVA | CRI | CEV | MEV | GRD |
|---|---|---|---|---|---|---|---|
| Gluttonwolf Mayor (581) | 15 | 30 + 3 (75%) | 5 + 0.5 (12.5%) | 15 + 1.5 (37.5%) | 2.5 + 0.25 (6.25%) | 5 + 0.5 (12.5%) | 7.5 + 0.75 (118.75%) |
| Vampire King (582) | 70 | 20 + 2 (160%) | 12.5 + 1.25 (100%) | 15 + 1.5 (120%) | 2.5 + 0.25 (20%) | 15 + 1.5 (120%) | 5 + 0.5 (140%) |
| Gloria (583) | 85 | 20 + 2 (190%) | 15 + 1.5 (142.5%) | 7.5 + 0.75 (71.25%) | 4 + 0.4 (38%) | 10 + 1 (95%) | 5 + 0.5 (147.5%) |
| Sloth (585) | 110 | 12.5 + 1.25 (150%) | 7.5 + 0.75 (90%) | 7.5 + 0.75 (90%) | 2 + 0.2 (24%) | 7.5 + 0.75 (90%) | 5 + 0.5 (60%) |
| Lust (587) | 130 | 25 + 2.5 (350%) | 10 + 1 (140%) | 10 + 1 (140%) | 2.5 + 0.25 (35%) | 10 + 1 (140%) | 5 + 0.5 (70%) |
| Envy (584) | 130 | 25 + 2.5 (350%) | 15 + 1.5 (210%) | 15 + 1.5 (210%) | 4 + 0.4 (56%) | 10 + 1 (140%) | 5 + 0.5 (170%) |

Envy's lines sit on her slot, which is otherwise still the lv15 stub until her own build, so hers read at 130 here.

- **Mayor:** gluttony is intake. The tongue finds you and Devour bites deep, but he's too gorged to dodge a blade or a
  spell.
- **Vampire King:** Lucian wields wrath, and wrath is output, so his smites crit. Spells slide off a vampire lord, and
  he drains instead of blocking.
- **Gloria:** pride. Nothing touches her and nothing catches her off guard, while her masterworks do the fighting.
- **Sloth:** the sin of not trying grows the slowest. Her pulse is Certain Hit and can't crit, so her lines only decide
  how easily the duo lands while racing her.
- **Lust:** all reach, no guard. Nothing he throws misses Rupert, and in his windows Rupert lands everything.
- **Envy:** Jerald's own class shape, sharp and slippery, soft to magic and guard. Her 350% lands on a floor Jerald
  (293% EVA) every swing: his shape, never his numbers.

**Also in this build:**

- The Mayor and the Vampire King left Enemy Rank T1 and T2. Garuda (373) keeps T3: it's the bird family's own T3, which
  Skye borrows.
- The Slothful Votary (595) rides Enemy Rank T5, the way its siblings ride theirs, so its swing now lands on Jerald.
- Off Certain Hit: Desire, Embrace and Goop Geyser are physical (Goop Geyser is Geyser Trap's own type again); Groan and
  Lethargy are magical, matching the stat each formula reads. Heartbeat stays Certain Hit.
- Lust's LUK grows 4 a level (521 at 130), so his hold still lands now that luck counts against Rupert's 457.

**Proven in Sloth's and Lust's halls** (re-run on the new lines, `sloth-hall-probe.js` and `lust-fight-probe.js`).
The Mayor, the Vampire King and Gloria have not been run on theirs; their probes are `gluttonwolf-probe.js`,
`wrath-hall-probe.js` and the `gloria-*-probe.js` set. Before → after at their own level:

- **Mayor (lv15):** HIT 55% → 75%, CRI 17% → 37.5%; the other four within a few points.
- **Vampire King (lv70):** HIT 125% → 160%, EVA 61% → 100%, CRI 56% → 120%, MEV 51% → 120%; CEV and GRD within a few
  points.
- **Gloria (lv85):** she had no growth at all, so HIT 10% → 190%, EVA 3% → 142.5%, CRI 0% → 71%, CEV 1% → 38%, MEV 6% →
  95%, GRD 102% → 147.5%.

In the two halls:

- **Sloth:** her GRD reads 0.6. Every pulse still costs her 4,000, Jerald 884 and Rupert 717, 242 frames apart; the kill
  floor held her at 1, Rupert landed the kill, and the hall reset clean. Lethargy, now magical, landed all 23 of its
  hits that reached the duo (all on Rupert, since the bot's Jerald stepped out of every telegraph), and its slow stuck
  on 12 of them, the same rate as before the change (23 of 43 in a control run on the old data). The votaries' basic
  swing now lands on Jerald too, where it never did before. These halls only prove that mechanics fire, so no damage
  number from them is a balance reading.
- **Lust:** his LUK reads 521. All 5 grabs landed and all 5 holds stuck, each draining Rupert's MP. The Goop Geyser
  still hits for 825 every two seconds, the reactions at 65% and 32% woke their vents and frayed him on time, Rupert's
  groan took the kill, and the hall reset clean.

**Still open:**

- The elementals get the same plain rewrite. Whether Skye (lv70, beside the Vampire King) and Cynder move up to their
  band's rates is Jeremy's call.
- Grudj gets his lines once he has a row.
- Every other enemy's growth (the 39 harvest nodes and breakables, the placeholder slots) is the later sweep.

## The shopping list

**The headline: none of the picks above needs a new J-ABS-Boss verb.** The earlier builds were expensive in part
because nearly every fight needed one, and every verb is the plugin, its tests, the editor, the validator and an
in-game probe. These six are data, art and measurements, one class-kit decision and three small J-ABS tags. Each
still needs its hall and its in-game run, so they won't be free, just lighter. Ordered by how many fights each item
unblocks:

| # | What | Kind | Unblocks |
|---|---|---|---|
| 1 | **Measure the duo at each band**: damage per second and max HP for each lead around 110, 130 and 150, plus Rupert's cast times. One probe per band, the way `boss-matchup-probe.js` was run. **Read 11-13 as a floor, your framing: "we're only testing that the mechanics fire, not for balance"** (SDPs, classes, passives and refinement are anyone's guess). `dist/playtest/band-probe.js`: Raving Lunatic Jerald and Lavos Rupert, crafted gear of the band's tier in what each class wears for free (RL: Glaive and Mail, no offhand type at all; Lavos: Rod, Relic, Cloth, so no Tome), no SDPs, no accessory. **Lv110, tier 5:** Jerald MHP 7,967, MDF 354; Rupert MHP 3,278, MDF 379. **Lv130, tier 6:** Jerald 9,687 / 439; Rupert 3,848 / 579. Sloth's pulse fires at both bands, never swallowed by MDF: 885 on Jerald and 719 on Rupert at 110, so Rupert drops on pulse 5 and Jerald on pulse 10 (the 1% of her bar does most of Jerald's). Anything a real build adds only stretches that. Floor stats also read EVA 249% (Jerald) and MEV 126% (Rupert), so a votary's basic attack may never land; check its HIT when the votary is built (done 11-14: it rides Enemy Rank T5) | measurement | all six (every Numbers block hangs off it) |
| 2 | **The immunity leak**: `<noDamage>` (yours, 11-13), on any note source: 0 damage of any type from any source, DoTs included (they still apply), healing still works. **Built 11-13** (rmmz-plugins `boss-pass`, uncommitted): hits, drains, formula packets, DoT ticks, regen run below zero, damage floors and below-zero Recover effects all land as nothing; skill costs, TP, event commands and the death state are left alone | `engine (small)` | Sloth, Lust, Envy, and Earthie's shipped seal |
| 3 | **Sprites**: Sloth is done (her statue built 11-13, her votary chosen: `m_winter-spirits` index 2); Lust; the off-Jerald sheet for Envy; Grudj and his machine | `art`, yours | Sloth, Lust, Envy, Grudj |
| 4 | **`<interrupt:N>` on some player skills**, Rupert's Meltima (484) at least. Nothing in the game can interrupt a cast today | class kits, yours | Grudj, and any later boss that casts |
| 5 | **A heartbeat sound** for Sloth's pulse (the Subterranean's heartbeat BGS is still missing too) | `audio`, yours | Sloth |
| 6 | **Two kill-floor tags** (yours, 11-13). `<noSelfKill>` on battlers, equips and states, `<thisNoSelfKill>` on a skill: a skill executed by the battler carrying it can't take that battler's own HP to 0 or less (Sloth 2A). `<noTargetKill>` / `<thisNoTargetKill>`, same homes: it can't take an *opposing* battler's HP to 0 or less, "think False Swipe from pokemon" (friendly fire can still kill). Both clamp where HP drops, after every multiplier. **Built 11-13** (same branch): a skill's damage and its formula packets stop one HP short, after shields absorb their share; "opposing" is J-ABS's team rules (an actor and an enemy count as opposed if the caster has already left the map); DoT ticks aren't a skill's damage, so they aren't held | `engine (small)` | Sloth, and any False Swipe you want |
| 7 | Optional: `blink` and `jump` also move the body's home tile (a setter in J-ABS, no new field) | `engine (small)` | Envy (4) |
| 8 | Later: the real SDP blackout in J-SDP, shared with Trainer Lord's exam after 1.0 | `engine` | Grudj (4A) |

**Nice-to-haves that would each cost a full verb**, none of them a pick: spawn where a participant stands (Lust 3D, his
goop trail), a "this skill landed / missed" trigger (Lust 1B), a `despawn` (Envy 3C), a machine that reboots
(Grudj 1B). Stealing a buff (Envy 5C) would be core J-ABS work.

**Checks to run in a hall before building on them** (all *unread*):

- Where a gap-close pounce lands when the skill has a cast time: Lust 1D.
- A forced skill with room-wide range starts its cast where its caster stands: Lust's fallback reach, Grudj's Meltima.
- A clone hit for 0 goes back to milling rather than chasing Jerald: Envy. **The most important one**, since a crowd
  that converges deadlocks the fight.
- J-ABS's "close" distance, which sets how far an idle clone wanders from its spawn: Envy.
- Which way J-ABS Timing's `<castSpeedRate>` and `<fastCooldownRate>` numbers run: Grudj 6.
- The worms' "harden while standing still" mechanism on a votary: Sloth 4.
- The frame rate with thirty Prime votaries, or thirty clones, on screen: Sloth, Envy.

**Suggested build order:** the leak fix first, since three of these fights stand on it, with the two kill-floor tags
beside it (the same kind of small J-ABS change), then Sloth (her design is
nearly all yours already and the Subterranean comes first in play), then Lust and Envy together (both lanes share a band, so one measurement serves both), then the two
mini-bosses (pure data), then Grudj (he waits on the class-kit decision).