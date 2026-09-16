# Map: The Frozen Fortress (the finale)

> Written during the design conversation of 2026-09-15, not after it, because the Nimbus spec was lost
> once by waiting until the session was over. Status tags follow [`story-canon.md`](../story-canon.md):
> `SHIPPED` is in the data now, `LOCKED` is decided and unbuilt, `PROPOSED` is floated, `OPEN` is
> undecided. Decisions are Jeremy's unless the tag says `PROPOSED`. The canon's
> [Chapter 5 section](../story-canon.md#chapter-5--the-frozen-fortress-locked-design--unbuilt--the-finale)
> stays the story authority for the sins, the split and the gent; this page is the build spec and must
> agree with it.

The Frozen Fortress is the final dungeon of the main story: band 115-130, with the gent at ~150 in the
courtyard. It is the empty castle from the summit of the Negative Peaks, paused mid-moment on green land
beside Lakeside Road, and it opens to the RGB Technohypercube once both chapter 4 technodisk dungeons are
cleared.

**It is not Skye's castle.** The shipped summit scene (`Map320` "Lord of the Peaks", the post-boss
story) has Skye say there "used to be a pretty cool castle up here", already "basically empty" when
Skye arrived, which is why Skye chose it for the SOS and the nap. Skye was shaken awake there by the
faceless red-eyed gent and remembers nothing after. Whose castle it was, and who built a castle on a
green summit and then left it empty, is not said anywhere in the game. Three sections,
two gates: the basement (Lust) and the tower (Envy) must both fall before the courtyard unseals.

---

## What exists in the data today `SHIPPED`

| Thing | State on 2026-09-15 |
|---|---|
| `Map116` "Frozen Fortress" | the Lakeside Road **exterior**, 50x35, tileset 12 Outside (VisuStella): event 1 "overly advanced gate", event 5 "story: need more keys", the four elemental NPC events, a save platform. Not the dungeon |
| A `DUNGEON:` tree node | **none**. Nimbus has `Map122` and the Subterranean has `Map290`; the Fortress has no node and no child maps |
| `Items[174]` RGB Technohypercube | authored; its description still ends "This is not yet implemented" |
| Enemies `583-590` | all `=== TBD Sin` at lv15. `583` is Gloria's slot per [nimbus.md](nimbus.md); Lust, Envy and the gent have no chosen slots. `593-597` are `=== TBD Sin Votary` stubs |
| `ice-cavern_A2` / `_A5` / `_B` | on disk under `img/tilesets/`, referenced by **no** Tilesets row |
| `SnowForest.png` | the only wintry parallax on disk |
| [progression-bands.md](progression-bands.md) | planned section already carries Fortress 115-130 and the gent ~150 |
| [todo.md](../todo.md) | describes the exterior gate as keycard-gated and unimplemented |

Not the Fortress, despite the names: `Map264` "AREA: Courtyard" and its children belong to the Fallen
Kingdom (`Map259`), `Map75` "Basement" is the Forest of Dreams, and `Map343` "FLOOR: Basement Level" is
the Pearl Salt Mines. Canon has two castles; Lucian's is the built one.

---

## Where even is this place `PROPOSED (2026-09-15)`

The question Jeremy opened with, and the one a player will ask, because the game has been asking it
since chapter 2: why would Grudj drag a summit castle across the continent? Why does he need a castle
at all? Why not build one, or magic one, or take Raevula, or take the Kingdom?

**The answer is one rule: Grudj's only verb is undo.** His power is regression, aging a place to death
or pausing it mid-moment. He has no make button, so the only castle a being like that can have is one
somebody else built, frozen at the instant he took it. It is the same pattern as everything else he
owns: a name he took from a word, weapons lifted off the clown ship (the gate tech is `SHIPPED` as
recognized from it), an army made of a kinsman he scrambled and an elemental whose devotion he never
returned. Grudj owns nothing he made.

The four "why nots" fall out of the rule:

- **Why not build?** He cannot.
- **Why not the Kingdom?** He did take it. He took it apart; regression aged it to death. That is what
  taking looks like for him.
- **Why not Raevula?** He erased it four times and it kept coming back, so he hid. A town has tenants,
  and tenants are exactly the uninvited adventurers he has spent twenty years un-happening.
- **Why not strive for more?** "More" is everyone else's arc. Naer traded his person for a tower; Envy
  wanted the power. Grudj is the one being in the cosmology who wanted less, exactly one thing, and the
  castle is precisely as much building as that want requires. Ambition would have made him a Lord. A
  grudge made him a squatter in a frozen house.

**Why the lake:** it is not a home, it is a mailbox. Parked on the one road every adventurer walks,
gate keyed to three disks he seeded across the continent, sitting in plain view for three chapters.
Jerald's shipped "probably the last level" lampshade is correct, and that is the joke: a challenge
letter the duo cannot open yet.

Lineage rhyme, `REMEMBERED` per [prequel-jr2.md](../prequel-jr2.md): Jeremy recalls Majik's lair as a
spaceship crashed into a castle. Ship tech bolted onto a stolen castle is the same silhouette one
generation on. Not evidence, just a shape worth keeping.

How the player learns any of this: `OPEN`, being discussed. Channels floated, none chosen: the gent's
final-fight kit being pure subtraction (mute, disarm, root, paralysis, the SDP blackout, never a summon
or a buff); an interior where nothing belongs to him after four centuries in residence; his tech visibly
bolted onto stone he did not cut; Lust and Envy as the exhibit of the only gift he ever gave; the
trapdoor as the rule in miniature.

### Whose castle was it `OPEN (pinned 2026-09-15)`

Pinned by Jeremy, unsatisfied for reasons he could not yet name. What is on the table:

- **Nobody's, and it stays that way.** The house style default.
- **Sigil-kind** `PROPOSED`: the castle is the same class of object as the save sigils, Lord-grade
  infrastructure no local can operate, standing on the summit in every era and the one building on the
  continent regression cannot un-happen. Grudj can pause it and move it but not erase it, which is why he
  lives in it. Nobody says so; a sigil in the entry hall is the tell. Jeremy is not sold.
- **Retired:** a new named owner (a stranger in the last dungeon, or four chapters of retro-seeding), and
  Trainer Lord (he trains in omnidimensional space and has no use for a building).

---

## The dungeon is the castle `LOCKED (2026-09-15)`

Two facts from Jeremy, stated plainly:

- **The dungeon is that castle.** Not a shell with a door to elsewhere; the interior the player runs is the
  summit castle itself, displaced.
- **It is the only dungeon in the game the player tackles solo.** The canon's split, drafted `PROPOSED`
  on 2026-08-06, is ratified in its premise: one protagonist per lane, no partner, no party-cycle. The
  mechanics under it (assignment, sigils, the freeze, the interlock) remain as tagged in the canon until
  this page says otherwise.

---

## The look `OPEN`

## Topology `OPEN`

## The split `OPEN`

Canon's drafting lives under
[THE SPLIT](../story-canon.md#the-split--the-duo-runs-the-fortress-alone-proposed-2026-08-06) and is
`PROPOSED`, not locked. What this page ratifies goes here.

### Structure: free shifting, lanes that meet at the gate `PROPOSED (Jeremy, 2026-09-16)`

The two lanes run at the same time and the player moves between them at sigils (canon's option, the
one Jeremy's gut picked). What is **retired** is canon's symmetric interlock, "progress above unlocks
progress below and vice versa." Jeremy's objection is the architect test: no builder wires a lever in
the tower to a door in the basement, and a player will notice the contrivance.

What survives the test is a dependency that converges on the goal instead of crossing the lanes:

- **The basement holds the power switch.** Throwing it powers the castle.
- **The tower holds a techno-key** of some kind.
- **The courtyard gate needs both**: a powered gate and the key that opens it. Both lanes must finish;
  neither lane needs the other to finish.

### The accidental interlock `PROPOSED (Jeremy, 2026-09-16)`

The lanes do depend on each other after all, but never by wiring. **By physics, and by accident.**
Weight falls and power rises, and neither protagonist has any idea he is doing anything for the other.
Both of them credit the heavens. The player is the only one who sees both halls, which is the canon's
double-ellipsis idea stretched across the whole dungeon.

Jeremy's two scenes, as drafted:

> **Scene 1**
> Rupert: *(climbing up the busted-up tower)*
> Jerald: eww, whats all this purple shit? I don't wanna take even a STEP into that disgusting sludge. 🤢
> *(impassable toxic autotiles or similar)*
> Rupert: *(slips and stumbles a bit, breaking off a massive chunk of floor tile that falls)* wow that
> could've been me!
> Jerald: *(as if blessed by the heavens, a gigantic rock plummets from the sky and thunks into the
> purple sludge, forming a makeshift bridge)* how convenient! Now I can keep my shoes clean...

> **Scene 2**
> Jerald: *(spelunking while whistling a chipper tune in an otherwise ominous and dark basement)*
> Rupert: oh, this looks like an elevator... but it seems to be out of power and I don't see any other
> ways to ascend. 🤔
> Jerald: oh hey, a completely-out-of-place and high-tech-as-fuck lever. I wonder what it does?
> *(because Rupert is not there to caution him about traps, he eagerly flips it)* Wow. Lame. Nothing
> happened.
> Rupert: *(sees the elevator come to life before him)* how convenient! Now I can ascend without having
> to cheat by casting float magic!

What this is, structurally:

- **Bidirectional, but physical.** Tower to basement is gravity (debris falls). Basement to tower is
  the breaker (power rises). Both pass the architect test because neither is a mechanism somebody built
  to link the lanes; they are the building behaving like a building.
- **Ignorant on both ends.** The cause never knows he caused anything; the beneficiary never knows who
  to thank. "How convenient" is the refrain. Nobody ever finds out. The courtyard reunion is two men who
  each think they got lucky, and one player who knows better.
- **Each beat is a block, a shift, a cause, and a cross-cut.** The beneficiary hits a hard block with a
  sigil at it (canon's "keep the mechanism near the sigil"), shifts, plays the other lane up to the
  cause, and the game cross-cuts to the blocked man receiving the effect. Because the block is what
  sends the player to the other lane, **the block is always hit before the cause**, and the frozen
  protagonist is guaranteed to be standing exactly where the cross-cut needs him.

**Switching is free at any time** (Jeremy, 2026-09-16). Progress still requires every cause to
happen: Rupert must stumble, Jerald must flip the lever, and whatever else gets authored. So the
causes are mandatory and the order is not.

**Order-independence is handled with a second line, not a lock.** If the cause lands before the
beneficiary reaches the block, he never learns there was a block: Jerald trots across the rock unaware
there was ever sludge to cross; Rupert finds a working elevator and says something like "glad there is
power to this elevator in this otherwise dilapidated castle." The cross-cut only fires when the
beneficiary is already standing at the block; otherwise the cause side gets its own beat and the
effect is simply present on arrival.

**Control is never seized; the first beat is forced by geography** `LOCKED (2026-09-16)`. Nimbus
already spent "control forfeited to events" on its gatehouse joke, and the Fortress takes the button
away; taking the choice away too would turn the solo run into a corridor. So the player is never told
who to be. The one beat that must land as drafted is the first, because it teaches the player what
these two are unknowingly doing for each other, and the trapdoor guarantees it without touching
control: Jerald's first room ends in the sludge, and Rupert's first stumble sits a few screens up his
lane, so whichever lane the player starts in, the block is reached before the cause. Every beat after
that is free, with the second line catching whichever order the player produces.

### Assignment `LOCKED (2026-09-16)`

**Rupert falls to the basement and Lust. Jerald springs to the tower and Envy.** The reverse of
canon's 2026-08-06 default, decided by painting all four protagonist-and-sin scenes and comparing
them (the drafts and the verdict table are under the two boss sections below). Each man's strong
scene is with the sin that touches his own wound: Rupert did the genocide, so he meets its victim;
Jerald swallowed his monster, so he meets the one who never could. Both lanes carry an origin
flashback this way and neither does the other way.

Consequences carried into the rest of the page: Jerald's weight breaks the tower floor and Rupert
inspects the lever before flipping it; the ambush launches Jerald and drops Rupert; the tower yields
the **key** and the basement holds the switch (Jeremy, 2026-09-16: "not a switch or lever, key up in
a tower. Still, same thing happens").

## The basement: Lust `OPEN`

### The pre-fight scene `PROPOSED (Jeremy, drafted 2026-09-16)`

Lust is scrambled to zero: not himself by any stretch, the first and only intentional
scramble-to-sin on a junction, done to a sibling of the species, for whatever "ultimate power" Grudj
can speak to. He cannot talk. Jerald talks anyway, and reads the silence as being *ignored* rather
than as something awful having happened to the thing in front of him. The scene escalates on that
misreading until Jerald's hurt feelings start the fight.

> Jerald: oh. One of those void clown thingies. I thought we merc'd all of you like 25 years ago or
> something.
> Lust: *(says nothing, because totally scrambled, but lurches towards Jerald)*
> Jerald: uhh, you okay? your legs look fine but you're kinda floppy and walking at me with a rather
> aggressive stance.
> Lust: *(still says nothing, takes another step towards Jerald)*
> Jerald: so come on, spill the beans 🫘🫛. How'd you survive? I totally thought we were VERY thorough
> in blowing up that space ship.
> Lust: *(continues wobbling in the general direction of Jerald)*
> Jerald: *(annoyance rising)* Were you hiding somewhere else? On one of those Weird Islands or
> something?
> Lust: *(maybe a groan, zombie-ish, still slowly creeping towards Jerald)*
> Jerald: *(exiting frustration and entering anger)* Why are you keeping your SECRETS from me, Floppy
> Clown Man!?!! 💢💢💢
> Lust: *(getting pretty close now)*
> Jerald: *(now visibly pissed, believing he is being ignored and not that something awful has
> happened to them)* WHAT IS YOUR FUCKING PROBLEM!?
> Lust: *(gets basically into melee range)*
> Jerald: *(immediately blasts Lust back)* DONT YOU DARE TRY TO SUCK UP TO ME AS IF YOU DIDNT SPEND THE
> LAST 5 MINUTES IGNORING MY EXPOSITION. YOU ARE DEAD TO ME, FIGURATIVELY AND LITERALLY.
> *(boss fight begins)*

Notes on the draft:

- **"25 years ago" is meta.** It is when Jeremy was handed and finished the first Jeremy & Robert game,
  this game's predecessor. Jerald speaks in the Maker's clock, which is in keeping with a duo that
  already talks about the dev and The Player.
- **The horror is delivered by comedy and never named.** Every escalation is about Jerald being
  ignored; the player is the only one in the room who can see a mutilated victim. The fight starts
  because Jerald's feelings are hurt. That is the protagonism thesis and the no-redemption rule in one
  gag, and it is the reason the casting is Jerald and not Rupert, who would have understood what he was
  looking at and said so.
- **The pacing is Lust's walk.** In RMMZ the eyes-and-camera version of this scene reduces to one slow
  moving character, so the map is big on purpose and the beats fire on **proximity, not timers**: each
  line triggers as Lust crosses a distance threshold on his approach. The scene lasts exactly as long as
  the walk.
- `OPEN`: canon's "one line about volunteering for the Nimbus split, not a joke" was written for
  Jerald alone in the basement. Jerald is now alone in the tower instead, and his Envy scene is all
  noise until the fight. Whether the line lands somewhere on his climb, after the fight, or is
  dropped, is undecided.

### The same scene with Rupert `PROPOSED (Jeremy, drafted 2026-09-16)`

Painted to weigh the swap. Same room, same mute Lust, the other protagonist:

> Rupert: wait, is that one of the void clown species? I could've sworn I obliterated them with
> Meltima back on that ship...
> *(flashback)*
> Past Rupert: HOW DARE YOU TRY TO TAKE OVER MY PLANET EARTH! YOU WILL SUFFER!
> Past Rupert: *(backsteps deftly out of the castle and jumps into the sky, glaring downward, and
> charges his hadouken)*
> Majik: *(quivers in fear as a literal twin-Ultima crossed with FF6's Merton is dropped on the entire
> space ship dungeon)*
> *(the space ship dungeon, the castle it crashed into, and the entire island are vaporized; nothing is
> left but an enormous crater of void. Even space, the absence of matter, was erased by Rupert's spell)*
> *(end flashback)*
> Rupert: yeah I definitely remember beating that boss. But I thought the whole place was destroyed
> including all its siblings? Where are you from?
> Lust: *(lurches slowly toward Rupert)*
> Rupert: *(steps forward and looks closer)* hey are you... okay? *(steps back in horror as he realizes
> what transpired)*
> Lust: *(groans something incomprehensible and staggers forward)*
> Rupert: what... have they done to you?!
> Lust: *(still unable to answer, slowly continues forward)*
> Rupert: this is unbelievable... what did he do to you? *(appalled as it occurs to him what must have
> happened here)*
> Rupert: *(sighs quietly)* I'll deal with this, then. Then onto the one who did this to you, next.
> *(draws weapon)*

What the Rupert version has that the Jerald version does not:

- **The flashback.** The only time the player would ever see the predecessor game's finale: the ship,
  the castle it crashed into (Jeremy's remembered image, now drafted as in-fiction), the island, and
  the crater of void where it stood. The species is called void clowns and the last thing Rupert left
  of their world was a crater of void. Not a claim about intent; a rhyme now on the page.
- **The thesis in one mouth, unheard by its owner.** Rupert remembers vaporizing the species fondly
  ("yeah I definitely remember beating that boss") and is appalled, thirty seconds later, that
  somebody did something cruel to one of them. He sees, and does not connect. Jerald's version is
  obliviousness; Rupert's is the ex-hero's blind spot, which is the more damning of the two, and it
  is exactly what canon's Lust section asked for: the dread arrives spoken, and Rupert begins to
  question the shape of the plot.
- **A mercy kill narrated as strategy.** "I'll deal with this, then. Then onto the one who did this to
  you." Not heroism, not remorse; a list.

What it costs: the basement stops being the comedy-over-horror lane, the eager lever flip becomes a
deliberate one, and the flashback fires before the courtyard accusation rather than during it (which
may be fine: two tellings of one story, theirs first, then his).

**The swap's other half, Jerald against Envy** `PROPOSED (discussion)`: Envy's grievance is that the
only gift Grudj ever gave went to the sibling and not to her. But Grudj gave a second gift, in scene
one of this game: he handed two tourists their Node Junctions. Jerald walks into her tower wearing the
thing she spent centuries wanting, and he has never once thought about it. She reaches into him for
envy and finds a man who got the gift for free and is mostly interested in whether she drops recipes.

## The tower: Envy `OPEN`

### The pre-fight scene, Jerald version `PROPOSED (Jeremy, drafted 2026-09-16)`

Staging note from the draft: **for the whole conversation, between the spoken lines, Envy's chatter
surfaces as thought bubbles**, furiously fuming and spiraling: "why didn't he choose me", "I deserved
it", "you are worthless", "HATE", and so on. She never stops, even while he is talking.

> Jerald: *(takes the final step, winded, annoyed that he chose "up" instead of "try to find a way
> back down")*
> Envy: YOUUUUUUU *(voice full of malice and hate)*
> Jerald: *(confused)* do I know you? You look kinda familiar...
> Envy: I can FEEL it on you. HE CHOSE YOU.
> Jerald: I literally have no fucking clue what you're talking about. But sure!
> Envy: *(screams)* YOU MONSTER!!!
> Jerald: I mean, yeah I've heard I'm not a very righteous person, but at least I'm honest with myself.
> Envy: *(caught off guard by the unusual sentiment)* what?
> Jerald: yeah its pretty obvious. I'm a little rash and sometimes a tad rude.
> *(flashback montage: Jerald's many, many conversational moments of being absolutely ruthless and
> murderous, and his blunders from earlier in the game)*
> Jerald: But at least I recognize who i am.
> *(flashback: the summit of Weird Island, far-past Jerald with past Rupert; his defeated doppelganger,
> the Raving Lunatic, stands before him)*
> Far-past Jerald: you know, I hate that you wear my skin.
> RL: you hate that I accept who i am, and you don't.
> Far-past Jerald: *(eyes blazing)* Hey fuck you, asshole! *(slashes with his axe)*
> RL: *(slashed, laughing, obviously defeated and dying)* Haha yes that is it, keep at it and you'll be
> like me in no time!
> Far-past Jerald: *(fuming, knowing he is being goaded and unable to help it)* You are MINE to control!
> You do not control ME!
> *(far-past Jerald takes RL into himself)*
> Far-past Rupert: wow, did you just absorb him?
> Far-past Jerald: I have him contained... for now.
> *(end flashback; another flashback)*
> Past Jerald, morphed as RL?: *(bleeding, still laughing as he hacks at a dead monster)*
> Past Rupert: Hey Jerald? I think its dead. You can stop.
> Past Jerald, morphed as RL?: *(clearly does not stop)*
> Past Rupert: oh, are you RL again? I can never tell. you both look so alike and even wear the same
> armor these days.
> Past Jerald, morphed as RL?: What is the point of being two entities when you can be one? It is
> easier this way anyway, I'm just accepting a new piece of myself.
> Past Rupert: ahh. morph manifestation. Got it. You know that means you give up morphing forever,
> right?
> Past Jerald: the deed is done! And I feel so FREE for it! *(facing Rupert, still hacking up monsters)*
> Past Rupert: *(shrugs)*
> *(end flashback)*
> Envy: *(appalled)*
> Jerald: whats the matter? cat got your tongue? *(smirk)*
> Envy: you... YOUUU.... you already HAD that immense power and STILLL ACCEPTED HIS GIFT?!?!! 💢💢
> Jerald: yeah when you take breaks, sometimes your level goes back down. I wanted an easy-mode way to
> carry me till i got my fighting legs back! Easy peasy. 🏋️
> Envy: I WILL KILLL YOUUUU AND TAKE IT FOR MYYYYSELF! 😡😡💢💢

Notes on the draft:

- **"HE CHOSE YOU."** She reads the junction on him at a glance. The second gift, the one that went to
  two tourists in scene one, is the wound she leads with.
- **The knife is the crutch line.** She wanted it for centuries. He took it as a starter buff to carry
  him until his fighting legs came back, and says so cheerfully. Nothing in the game will make her
  angrier than that sentence, and it is true.
- **Self-acceptance is the actual axis, not envy.** Her origin is exile for what she was; she spent the
  centuries since trying to be chosen instead of being herself. Jerald's origin, shown here for the
  first time, is a man who fought the monster wearing his skin, lost the argument, and swallowed him
  whole: "I'm just accepting a new piece of myself." She is the sin of wanting to be someone else; he
  is the one character in the game who has fully stopped. "At least I recognize who I am" is the line
  that lands, and he does not know it landed.
- **Both flashbacks are lineage payload.** Weird Island, the Raving Lunatic as a defeated doppelganger,
  morph manifestation as a permanent choice: the roleplay-era morph mechanic (see
  [origins-the-roleplay.md](../origins-the-roleplay.md)) becomes in-fiction history, and canon's "the
  RL fused with him between games" is finally shown rather than asserted. Under the swap, each man
  alone gets his own past: Rupert's Meltima at Lust, Jerald's RL at Envy.
- **"You look kinda familiar"** `OPEN`: needs a payoff. Either she resembles the four elementals
  (she is the fifth), or the player has seen her before, beside the cloaked man in the chapter 1
  intro. Undecided which, or whether the line stays.
- **The chatter bubbles are a build requirement**: a stream of short popups running concurrently with
  a normal dialogue exchange. Worth checking against what the messaging upgrade in flight can do
  before assuming it is free.

### The same scene with Rupert `PROPOSED (Jeremy, drafted 2026-09-16)`

Painted to complete the set, with Jeremy's own prediction that it would fall flat by comparison:

> Rupert: *(ascends the final step)*
> Envy: YOUUUUUUU *(voice full of malice and hate)*
> Rupert: *(looks backward as if she must be talking to someone else, and back again)* huh?
> Envy: i KNOW you have it, the GIFT! *(her dialogue shaking with rage)*
> Rupert: I'm not really sure what you're talking about. Can you spell it out for me like im five?
> Envy: THE GIFT. *(patience already wearing thin)* LOOK. YOU WEAR IT ON YOUR RIGHT ARM.
> Rupert: Ohhhhhh, this! My Node Junction System! Yeah some ominous dude in a cloak gave it to me at
> the beginning of the game. Its pretty buff to be honest. What about it?
> Envy: *(frustration boils over because he so casually accepts it)*
> Rupert: oops, was that the wrong answer here? Dang, didn't even get a choice to see if there was a
> right one... Well tell ya what: you can stay there, seething and being an angry ... elemental or
> whatever you are, and I'm gonna go flip that obviously important switch behind you and be on my way.
> No harm, no foul.
> Envy: 💢💢💢 You will DIE! That GIFT is MINE!!! 🎁
> *(encounter begins abruptly)*

It is a good scene and a flat one. Rupert has nothing for her to reach: no self-conflict, no history
with the question of being chosen. He deflects, declines to engage, and walks past her toward the
objective. The junction is "pretty buff." (Consistency note: the tower yields the key and the basement
holds the switch under the current structure; the line says switch.)

### Verdict on the four scenes `LOCKED (2026-09-16)`

| | Lust (mute, done-to) | Envy (talker, wanted) |
|---|---|---|
| **Jerald** | funny, shallow: a monologue at a wall, no memory to prick | deep: the RL flashbacks, self-acceptance against the sin of wanting to be someone else, the crutch line |
| **Rupert** | deep: the Meltima flashback, sees and does not connect, mercy kill as a to-do list | flat: nothing for her to reach, walks past her |

The pattern is that each man's strong scene is with the sin that touches *his* wound. Rupert did the
genocide; put him in front of its victim. Jerald swallowed his monster; put him in front of the one
who never could. The weak scenes are the two where the protagonist has no stake. Both lanes carry an
origin flashback under the swap and neither does under the default.

**Locked as the swap.** Rupert falls to the basement and Lust; Jerald springs to the tower and Envy.
The physics gags trade owners (Jerald's weight breaks the tower floor, which suits him
better; Rupert inspects the lever and flips it deliberately, "Wow. Lame."), the ambush lines swap
(Jerald is the one launched; a large man going *up* is the funnier image), canon's assignment line
flips, and canon's "Rupert begins to question the shape of the plot at Lust" turns out to have been
right all along.

## The courtyard: the gent `OPEN`

## Rosters `OPEN`

---

## Open items

---

## Build punch list
