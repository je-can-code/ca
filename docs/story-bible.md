# WIP: Story Bible (spoilers, obviously)

> **SUPERSEDED (2026-07-24): see [story-canon.md](./story-canon.md)** — the complete, corrected, chapter-by-chapter
> canon that absorbs and replaces this doc. This file is retained temporarily and will ultimately vanish.

> NOTE: This is WIP; I am writing it for myself at this time so I can return back to this more seamlessly later.
>   This will likely be enhanced as a full guide as time goes on. If you found this without me personally directing
>   you to it, read at your own discretion!

This doc captures the connective-tissue decisions for chapters 4-6 (and postgame) that came out of a long
worldbuilding conversation. Chapters 1-3 are already implemented and walked through in [the walkthrough section][1];
this is the "what happens next, and why" doc for everything past that point. Canon is marked as such; anything
still undecided is called out explicitly as **OPEN**.

## Chapter structure (revised)

- **Ch1-3 (done):** learn to play, recruit elementals, defeat Gluttony (Wyatt) and Wrath (Lucian). Plot goes from
  "vacation for recipes" to "someone's sabotaging the elementals, let's find out who."
- **Ch4:** no wrapper needed — the player already knows the why, so this chapter is pure execution. Go to two
  locations to retrieve technodisks, each guarded by a sin ambush ("go get the thing" → "surprise, a sin lives
  here"). The two disks then get fused at a third location into the **RGB Technohypercube** (see `Items.json`),
  which is the key to the final dungeon. **The fusion-pedestal location has no guardian/sin** — locked, Greed
  doesn't live there and nothing else does either; it's just the fusion location.
- **Ch5:** final dungeon (a castle), ends in the fight against the red-eyed gent. End of the main story.
- **Ch6 as originally conceived (extra wrap-up chapter) is cut** — chapter 3 already concretizes the plot enough
  that no separate wrap-up chapter is needed. What was going to be "chapter 6" is now **postgame**.

## The red-eyed gent

- He is the surviving void clown from the genocide 440 years ago (the same event that created the
  save-a-life-serve-for-life pact with the four elementals). Leveled in isolation ever since — cap was 50,
  J&R1 was beatable ~40, he's level 175 by the time you fight him.
- **He is also the "shady dude"** from the intro cave — the one who hands the party their node junctions and
  vanishes in a lightning strike. He armed them himself, on a leash, so he'd have a "rigged" fight later. He's not
  been watching them continuously since — he's been *waiting* — so he has no idea Classes or SKS (both postdate
  the device he understands) exist. When he scrambles what he believes is their one true source of power in the
  final fight, he's not outsmarted by a twist, he's outsmarted by three games' worth of systems he's never seen.
- **His signature power is limiter-scrambling** (same tech axis as elemental limiters: throughput maxed = rage,
  zeroed = stasis). He uses it on the party in the Ch5 final fight, and the player has already seen what it does
  to someone else first (see Lust, below) — the dread is earned, not sprung.
- His power over TIME (see below) is **regression**, not looping — deliberately avoiding a time-loop narrative.
  He can un-happen things (age a place to death, freeze a place mid-moment). Defeating him transfers this power
  to the party, which becomes the in-fiction justification for the postgame "replay any dungeon/boss as if you'd
  never done it" feature (FF14 Echo-style) — tie-in to the level-sync plugin. Still need to encapsulate
  dungeons/bosses for this mechanically. **OPEN: implementation.**
- **"Everyone is the protagonist of their own story"** is the thesis of the Ch5 fight, not just a line: from his
  side, this is a righteous revenge arc against the two beings who ended his entire race. From the party's side,
  it's Tuesday, and he's in the way of the recipes. The game never tells the player who's "right."

## TIME, as world-building (not a full time-loop)

- Fast-forward: explains a kingdom that reads as fallen "ages ago" when it actually happened recently — someone
  aged it to death.
- Pause: explains the out-of-place, snow-covered Frozen Fortress on an otherwise lush road — it's not weather,
  it's the preserved season of the day it was taken from Skye's summit.
- Loops are explicitly **not** being used — too much causality bookkeeping for the payoff. The gent's power is
  regression/un-happening, not repetition.
- The whole game spans roughly 10 in-game days / ~20 hours of playtime — the "centuries" only apply to backstory
  (the gent's isolation, Trainer Lord's prep), not to anything happening on-screen.

## The Seven Sins (+1 postgame)

Sins are **regulator-failure patterns, personified** — not people. A sin's essence can install into a Node
Junction because it's the same underlying technology as the limiter/junction system. This is why "the sin will
live on... even after I pass" is mechanically true, not just a boss quote: killing the host doesn't kill the
pattern.

**Drop mechanic (locked, applies to the 6 "fought" sins — Greed is the exception, see below):** defeating a
named sin boss does **not** hand you their SDP. Instead, defeat spawns a permanent population of "lesser"
versions of that sin throughout the region (named via the pattern **boss-title → common-noun**, e.g.
Gluttonwolf **Mayor** → **Gluttonwolf** in the Forest of Dreams; Vampire **King** → **Vampire Shade** in the
Fallen Kingdom). Those lesser spawns are a flat rare-drop roll for the unique SDP. All 6 fought sins are on the
**main critical path** (not optional/postgame-gated) — what gates postgame is actually looting all 7 SDPs
(6 fought + Greed), which may require farming lesser spawns long after their story beat, using the gent's
inherited regression power for locations that aren't naturally revisitable.

**Origin taxonomy:** each sin's transformation happens for a different reason, and it's worth keeping these
distinct rather than letting them blur together:
- **Forced** — Lust. Done *to* him, an act of violence by the gent.
- **Self-generated through grief** — Sloth. She did this to herself, watching her sibling's forced transformation.
- **Self-generated through want** — Envy. They did this to themself too, but out of jealousy rather than grief —
  resentment at *not* being the one it happened to.
- **Self-generated through the party's own behavior** — Greed. Not the gent's doing at all; see below.

**Roster (all 7 + postgame locked):**

| # | Sin      | Boss / location                                   | Status |
|---|----------|----------------------------------------------------|--------|
| 1 | Gluttony | Wyatt, "Gluttonwolf Mayor" — Forest of Dreams       | Done (Ch1) |
| 2 | Wrath    | Lucian, "Vampire King" — Fallen Kingdom             | Done (Ch3) |
| 3 | Pride    | Nimbus (see below) — one of the two Ch4 technodisk guardians | Locked |
| 4 | Lust     | Void clown kin (male), scrambled by the gent — castle basement | Locked |
| 5 | Sloth    | Void clown kin (female), sibling to #4 — Subterranean/Hell | Locked |
| 6 | Envy     | Castle tower — see below | Locked |
| 7 | Greed    | No boss/location — bestowed by Trainer Lord mid-game, see below | Locked |
| — | ???      | Ch4 fusion-pedestal guardian — **OPEN AGAIN** now that Greed doesn't live there | Open |
| 8 (postgame) | Hunger (Ammit the Devourer, aka "Big Bertha") | See postgame trigger, below | Locked |

**Important correction:** Lust and Sloth are **siblings to each other** (both void clowns, kin to the gent only
by species/race, not blood relatives of the gent himself). Don't write them as "the gent's brother/sister."

### Pride — Nimbus

- "A new world" in the master alchemist's farewell note (see Leo the Alchemist, Map034/035) isn't a literal
  planet — it's **Nimbus**, a "Heaven" dungeon beyond the Negative Peaks, above the sacrificial shrine near the
  summit. Matches her established flavor exactly: already world-famous, insufficient, needs a bigger stage than
  the one she already conquered. "Brimming with righteous glory" fits Pride's own vocabulary.
- Bonus geography: the giant bird that stole Leo's journal pages lives in the Negative Peaks and scatters things
  "to the four winds" in that same airspace — Nimbus's gate being up there was already quietly seeded before the
  sin was assigned to it.
- **The shrine sacrifice** to open the gate: `Armor[401]` — **"Big Gelatin"** (price 30, dropped by slimes, the
  first enemy in the game). The gag: Pride's gate, guardian of glory, wants the single most disposable material
  in the game. Jerald/Rupert banter beat already drafted — Jerald in disbelief, Rupert deadpanning "read the
  scripture yourself," Jerald reading it and immediately vindicated, places the gelatin, gate opens.
- This is one of the two **Ch4 technodisk guardians**.

### Lust — the castle basement (the brother)

- The gent scrambles his kin's node junction — deliberately, as an act of violence/control, not an accident.
  This retcons "sole survivor of the genocide" to "at least a few void clowns survived" — worth remembering for
  any future genocide-backstory references.
- Housed in the castle basement. Foreshadows the Ch5 final-fight scramble mechanic — the player watches what the
  gent's signature move does to a person before it's used on the party.

### Sloth — the Subterranean (the sister)

- She watched her brother get warped and fled below (Pearlsalt Mines / Forlorn Basin, diveable deeper with the
  snakerope/hookshot — the game's "Hell"/abyss). Her own node junction amplified as she descended, but the
  result wasn't rage — it was total stasis. Not weakness: **immense power, zero will to act**, because acting is
  what she watched destroy her brother.
- Physically manifests as an immobile **void statue** — a shielded, reclusive form. She cannot be damaged
  directly (hitting the statue deals **zero damage, period** — a deliberate design statement: strength isn't
  always equal to victory).
- **Fight structure (locked, two-phase):**
  1. **Phase 1 — attrition/survival.** Not a boss-gauge fight; the statue is invulnerable. She summons endless
     voidal minions from the depths. Every X waves (or Y minutes), the statue **chips** — visible progress that
     isn't tied to damage dealt to her.
  2. **Phase 2 — she snaps.** After enough waves/time, her mental fortitude breaks and she chooses to re-enter
     her own body's will ("you or me"). This is the first real, damageable fight — and it only happens because
     she opts back in, not because the party forced it.
  - The technodisk is implied to be behind/within the statue; claiming it doubles as the first time she's moved
    in centuries.
- Discovery is **not** signposted by the main quest (unlike Nimbus) — the party doesn't know Subterranean exists
  going in. Learned via NPC whispers / an unrelated side quest that happens to lead there.
- This is the other **Ch4 technodisk guardian**.

### Envy — the castle tower

- The tower was originally built/intended for Sloth's sister — the room meant to be where the gent scrambled
  her too, the way he did her brother. She fled before it could happen to her, and the room sat empty and
  meant-for-someone.
- **Someone else wanted to be the one it was meant for.** Their transformation is self-generated through
  jealousy, the same way Sloth's was self-generated through grief — nothing was done *to* them, they did this to
  themselves by festering. "Why do YOU get the power? I WANTED that power."
- **Identity, locked: the fifth (void) elemental.** Chef Adventure has six magical elements — heat, liquid,
  ground, air, energy, and **void** (coded dark/evil). The four playable elementals cover the other four; a
  fifth exists, embodying void, and was **exiled from her own kind for what she was, not for anything she did**
  — no act, no failure, just a verdict written into her element before agency ever entered the picture. That's
  distinct from every other origin in the roster (Lust = violence done to him; Sloth/Envy's jealousy-shape =
  self-inflicted) — hers is the one that happened *to* her for simply existing, which is the closest parallel to
  what happened to the gent (also condemned to isolation for nothing he did).
  - She latched onto him for exactly that shared condition: two beings with **no race left to belong to**,
    arrived at from opposite directions (his taken from him; hers exiled her). "Void clown" and "void elemental"
    literally share the word "void" — deliberate, not coincidental.
  - Centuries of devotion, never deemed "good enough" by him, and then the first time he actually *does* bestow
    the gift on someone, it's the sibling (Lust) — not her. That's the festering that becomes Envy.
- Tower (up) / basement (down) deliberately rhymes with the elemental limiter extremes already established
  (throughput maxed = rage, zeroed = stasis) — vertical geography mirroring the same failure axis, at dungeon
  scale instead of person scale.

### Greed — no boss, no location

- Greed isn't the gent's doing at all, and doesn't need an external body. **It's a manifestation of what Jerald
  and Rupert are already doing** — hoarding SDPs, hoarding recipes, hoarding levels, for the entire game. Ties
  directly into the game's core consumption theme ("everything eats — sins devour power, protagonists consume
  recipes, the endgame mechanic is consume-all-builds-into-godhood") that's been present since Ch1, just never
  named as a sin until now.
- **Mid-game reveal:** unlock condition is a hoarding threshold — collect X SDPs, learn Y recipes, craft Z foods
  (exact numbers still open). Once crossed, **Trainer Lord** delivers it directly: *"Something has... grown from
  within you. Allow me to show you a part of what you've become over this journey, protagonists!"* — and
  extracts the SDP from the party's own essence. Unsettling, not celebratory; no fight, no drop roll.
- This also sets the precedent for the postgame's Ammit reveal — see below.

## Technodisks & the RGB Technohypercube

- Two technodisks (guarded by Pride/Nimbus and Sloth/Subterranean) get fused at a third location into the
  **RGB Technohypercube** (`Items.json`) — the key that opens the final dungeon (the castle). **Locked: the
  fusion-pedestal location has no guardian.** Ch4 has two sin fights, not three.

## The final dungeon (the castle)

Three sections:
1. **The tower** — Envy, see above.
2. **The basement** — Lust, see above.
3. **The courtyard** — an interior courtyard at the center of the keep (not a front yard), gated off by
   "inexplicable powers" until both tower and basement sins are cleared. This is where the gent himself is
   fought.

## Postgame

- **Trainer Lord is the light mirror to the gent** — total foreknowledge, benevolent manipulation of junction
  tech vs. malevolent. His postgame content is an "exam," not a betrayal: full-kit suppression (panels dark),
  testing weapon identity/class verbs/food/parry — structurally the same beat as the gent's scramble,
  recontextualized as pedagogy instead of violence. Passing it unlocks the option to prove mastery of all seven
  sins (fully invest/master all seven SDPs, Greed included).
- **The Ammit trigger:** doing so makes Trainer Lord's eyes narrow — *"Protagonists... do you realize what you
  have done? Here, let me show you."* He plucks a much bigger essence out of the party (same gesture as the
  Greed reveal, vastly larger scale) and casts it to a distant, not-yet-visited region of Erocia: *"face what you
  value, if you want a true challenge."* That region, wherever it ends up being, is where **Hunger (Ammit the
  Devourer, aka "Big Bertha")** is actually fought. Ties to Mike's long-running "Big Bertha" postgame boss idea;
  "Big Bertha" survives as her self-announced gag name.
- Exact new region for the Ammit fight is **OPEN**.

## Open threads

- **Ammit's actual region:** open — somewhere on Erocia not yet built/visited. Confirmed ordering: postgame,
  after the main-story final boss (the gent), triggered by mastering all 7 sin SDPs.
- **The fox:** deferred, low priority. Current lean is it belongs to Trainer Lord (he's more interested in how
  things play out than the end result, fits a "messenger" role) — not committed, not urgent.
- **Ending architecture:** deliberately parked until the gent's identity/motivation is fully settled. The
  question the game asks throughout ("what will you two be, now that your story is ending? gods again? Lords? or
  two guys who go home with the recipes?") is meant to land right before credits, not be resolved mid-conversation.

With this pass, the full sin roster, the gent's identity and motive, TIME, the castle layout, and the postgame
trigger are all locked. The only remaining open items are the ones listed above.

[1]: ./walk/main.md
