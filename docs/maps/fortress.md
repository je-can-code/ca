# Map: The Frozen Fortress (the finale)

> Written during the design conversation of 2026-09-15 through 2026-09-17, not after it, because the Nimbus spec was lost
> once by waiting until the session was over. Status tags follow [`story-canon.md`](../story-canon.md):
> `SHIPPED` is in the data now, `LOCKED` is decided and unbuilt, `PROPOSED` is floated, `OPEN` is
> undecided. Decisions are Jeremy's unless the tag says `PROPOSED`. The canon's
> [Chapter 5 section](../story-canon.md#chapter-5--the-frozen-fortress-locked-design--unbuilt--the-finale)
> stays the story authority for the sins, the split and the gent; this page is the build spec and must
> agree with it.

The Frozen Fortress is the final dungeon of the main story: band 115-130, with the gent at ~150 in the
courtyard. It is the empty castle from the summit of the Negative Peaks, paused mid-moment on green land
beside Lakeside Road, and it opens to the RGB Technohypercube, the fusion of the three technodisks
(the Fallen Kingdom's in chapter 3, Nimbus's and the Subterranean's in chapter 4).

**It is not Skye's castle.** The shipped summit scene (`Map320` "Lord of the Peaks", the post-boss
story) has Skye say there "used to be a pretty cool castle up here", already "basically empty" when
Skye arrived, which is why Skye chose it for the SOS and the nap. Skye was shaken awake there by the
faceless red-eyed gent and remembers nothing after. Whose castle it was, and who built a castle on a
green summit and then left it empty, is not said anywhere in the game.

Three sections, two gates: the basement (Lust) and the tower (Envy) must both fall before the
courtyard unseals.

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

How the player learns any of this: `OPEN`. Nothing is said aloud, by house style. Channels floated:
the gent's kit being pure subtraction (mute, disarm, root, paralysis, the SDP blackout, never a summon
or a buff); an interior where nothing belongs to him after four centuries in residence; his tech
visibly bolted onto stone he did not cut; Lust and Envy as the exhibit of the only gift he ever gave;
the trapdoor as the rule in miniature. The one with the most traction is the rosters note under
Topology: the castle's own defenders versus the things he installed, told by what shoots at you.

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
  mechanics under it are worked out on this page, under [The split](#the-split): the assignment is
  reversed from canon's draft (locked), the symmetric interlock is retired for the accidental one,
  and switching is free (both Jeremy's, and built on by the lanes, though never formally locked).

## Once divided, no leaving `LOCKED (Jeremy, 2026-09-17)`

Once the player is split, **both lanes must be completed**. There is no returning to town from
inside the Fortress. The player prepares for every possible outcome before entering, and the game
should make that plain at the door: the exterior save platform on `Map116` is the last one with a way
out, and the switcher-room sigils inside save without offering an exit. This is why every fight in
the building is tuned to the specific man who is in the room; there is no swapping to the one who
would find it easy.

---

## Topology `PROPOSED (Jeremy, 2026-09-17)`

What is known with certainty (Jeremy, 2026-09-17): a castle; Jerald climbs a crusty tower; Rupert
descends a dank basement. The building follows from what happens on each path, so the paths come
first.

Sigils live only in the switcher rooms, which are enemy-free by convention, as rest rooms, not by
engine constraint: JABS enemies respawn on their own independent timers, not on map re-entry
(Jeremy, 2026-09-17; canon's "re-entering a populated map respawns everything" is stale). Each block
room sits directly past a switcher room, so "keep the mechanism near the sigil" holds. The lanes end with
Jerald slipping off the top of the tower and Rupert riding a very convenient elevator up from the
bottom of the basement, no backtrack in either.

### The reunion `LOCKED (Jeremy, 2026-09-17)`

Jerald defeats Envy, slips, and falls all the way to ground level, unscathed of course. Rupert
defeats Lust and finds a VERY convenient elevator going up (the lever powered something downstairs
after all). Rupert's elevator dings and opens at ground level as Jerald falls from the heavens and
lands with perfect grace in front of him. Weight falls, power rises, one last time; and for once
Rupert rides his own cause.

**How the two exits line up** `LOCKED (Jeremy, 2026-09-17)`: nobody is staged frozen mid-action;
the first lane to finish plays its exit scene *up to the point of departure*, then hands control
over. When the second lane finishes, the reunion plays directly. (Canon's *freeze* still stands as a
principle: the man not being played loses the time and does not feel it pass. What is rejected is
showing him stopped.)

- **Rupert first:** his concluding scene, he comments on the elevator and steps in, a thought bubble
  ("i wonder how jerald is doing?"), and control flips to Jerald, **forced**, to finish the tower.
  When it does, the reunion plays and Rupert remarks on how obscenely long the elevator took. (This
  supersedes canon's "Rupert does the math and goes quiet"; he says one line.)
- **Jerald first:** his concluding scene, the slip and the fall, and mid-fall a thought bubble
  ("i wonder how rupert is doing?"), and control flips to Rupert, forced, to finish the basement.
  When it does, the reunion plays and Jerald remarks that he DEFINITELY doesn't remember scaling high
  enough to fall as long as he did.

This is the one place the "control is never seized" rule bends, and it bends where there is nothing
left to do: the finished lane is closed, so the flip costs the player no choice. It is also the freeze
made visible without being explained: an elevator ride that lasted a whole dungeon, a fall that lasted
a whole dungeon, and one line each about it. They notice. They do not conclude.

`PROPOSED`: ground level is the entry hall. The elevator opens into it and Jerald lands in it, and
the courtyard gate is reached from it, which is why row 14 in each lane is a scene rather than a
map.

### The lanes, room by room `PROPOSED (Jeremy, drafted 2026-09-17)`

Each lane: a mini-boss guarding the second beat, a third free "how convenient" beat, then the sin
boss and the exit. About 10-15 maps per lane including switcher rooms and boss rooms; drafted at
fourteen each.

| # | Jerald's lane (tower) | Rupert's lane (basement) |
|---|---|---|
| 1 | balancing on the beams at the top of the entry hall, which Jerald does NOT want to go back down | the trapdoor's output room, with a fun slide you cannot walk back up |
| 2 | a boring floor, hazard trap enemies probably | a boring dark floor, environmental hazard floors probably |
| 3 | **first "how convenient"**: the ground that falls away below gives Rupert his bridge. Evented; he cannot skip walking over it | **first "how convenient"**: the lever that gives Jerald power for the elevator. Evented; he will not skip engaging with it |
| 4 | switcher room | switcher room |
| 5 | the dead elevator, needs power from the lever below | a massive ocean of purple goop, needs the fallen chunk from above |
| 6 | a room of traps firing deadly bolts (hazard enemies again). Jerald remarks it reminds him of that one castle from the original Jeremy & Robert game | yet more environmental hazard floors everywhere, manageable, a nuisance. Rupert hates sludge |
| 7 | a needless amount of hazards. Destroying all of them reverse-charges the circuit: an **optional** switch that turns on a light bridge over the unavoidable hazard floors on Rupert's #7 | completely covered in hazard floors, with a switch puzzle that opens a few jumps to lessen (not remove) the damage. If Jerald reverse-charged the circuit, a light bridge forms here instead and the crossing is free. If Rupert solves the puzzle, all the trap hazards on Jerald's #7 deactivate instead |
| 8 | switcher room | switcher room |
| 9 | **mini-boss**: a MASSIVELY overpowered, elysian, high-level ghosty (one affix-laden ghost, target-leveled ~135) | **mini-boss**: "the horde" of puppets, orbs and golems, not an actual boss (several affix-laden Origin-tier rows, ~130) |
| 10 | a boring long elevator ride further up, ambushed by robots. Defeat enough waves and Rupert gets a **care package** in his final switcher room | a long path Rupert can only read as a cultists' lair, torches lighting as he nears, a couple of platforms spawning waves of demons |
| 11 | a room with what appears to be a staircase up to some chamber | a room that "leads up to a large dome underground" per Rupert. A barely perceptible button here drops a **care package** in Jerald's final switcher room |
| 12 | final switcher room | final switcher room |
| 13 | Envy | Lust |
| 14 | the fall | the elevator |

Notes on the draft:

- **Exactly one encounter per room** `LOCKED (Jeremy, 2026-10-24)`, a standing rule for both lanes, so every
  room needs enough space for a real tussle of one against four or five. The switcher rooms stay enemy-free,
  as the rest stops above.
- **The lanes are in step**, which is the constraint canon put on free shifting: switchers at 4, 8
  and 12 in both, blocks and causes at matching depths, mini-boss at 9 in both. The zipper's teeth
  line up by construction.
- **Room 7 is a third tooth, and it makes arrival order matter.** Whoever reaches 7 first helps the
  second; the second's trigger still exists but its effect is moot, since the first has already
  passed his 7. `LOCKED (Jeremy, 2026-09-17)`: deactivated hazards are still hazards, they just stop shooting.
  They can still be destroyed and the reverse-charge still fires; it is simply moot, because the man
  it would help has already passed. The rule in one sentence: **whoever goes through first gets it
  rougher than the one the player controls second.**
- **The care packages are the third "how convenient" beat in each lane**, both optional, both
  landing in the other man's *final switcher room*, which is where the player arrives as him. "Who
  left this here?" is never answered. (Counting per lane: the mandatory beat at 3, the optional help
  at 7, the care package at 10 or 11.)
- **The rosters can carry the "he only bolts on" rule without a word of dialogue.** Ghosts, puppets,
  orbs and golems read as the castle's own: original, old, nobody's. Robots and hazard traps read as
  installed: his, and wrong for the building. If the two families are kept visually and mechanically
  distinct, the player learns which parts of the castle are Grudj's by what shoots at them.
- **Database homes already exist for most of it:** Hazards `511-520`; Ghost is an Undead subgroup and
  Undead is the void faction (per [subterranean.md](subterranean.md)), so a void ghost in the gent's
  castle is on-theme; Puppet `531-540` and Runic Orb `541-550` for the horde; and the cultists are the
  `=== TBD Sin Votary` stubs at `593-597`, which have been waiting for exactly this lair.
- **Fourteen maps a lane plus the entry hall and the courtyard is thirty maps**, the largest
  dungeon in the game (Nimbus is eighteen). Stated, not argued; it is the finale.
- **Robots or puppets in the horde** `OPEN`: the lane row says puppets, orbs and golems; the
  mini-boss note says robots, orbs and golems. Not cosmetic under the rosters note above, which makes
  robots Grudj's and puppets the castle's. Golems have no database home named here either.
- **Room 7 and the architect test.** Reverse-charging a circuit from the tower to light a bridge in
  the basement, and a basement switch puzzle disarming tower traps, are wired dependencies of the
  kind the structure section retires. Jeremy locked room 7 anyway on 2026-09-17; the difference is
  that both are *optional* and read as one castle's electrical system rather than as a puzzle
  designed to link the lanes. Noted so nobody rediscovers the tension.
- **Exactly one cross-cut lands per run, and which one depends on the start.** With cause at 3 and
  block at 5 in both lanes: Jerald-first, the lever lands on Jerald at the elevator; Rupert-first,
  the rock lands on Rupert at the goop. Putting the block before the cause in *both* lanes would
  deadlock, so this is as good as geography can do, and the control rule under [The split](#the-split)
  is worded to match. What is guaranteed is the *switch*: a player who refuses to change lanes is
  blocked in either one, Jerald by the need for power from below and Rupert by the need for the rock
  from above. Whether the cross-cut cutscene fires, or the player switched early and gets the
  variant line instead, is the player's doing and both are fine. (Build detail: "at the block" is a
  flag set on reaching room 5; the cross-cut is a scene on that map.)
- **The lever at Rupert's 3 is the castle's power** and Jerald's necessity to progress, both at
  once; **the key is behind Envy** (Jeremy, 2026-09-17). Neither is a gate in practice, because the
  player cannot reach the courtyard until both lanes are complete; power and key exist so the
  unsealing makes some amount of sense to the player.

**Open in the topology:**

- **What each lane is made of between the beats.** Enemies, hazards, tool gates, and the two rooms'
  own character: what a crusty tower and a dank basement of a paused, already-empty castle actually
  contain. See the look and the rosters.
- **Crusty versus preserved.** The castle was already "basically empty" when Skye napped in it, so
  the pause preserved a castle that was already old; the snow is the timestamp, the crust is
  original. Not a contradiction, worth stating once so the tileset choice does not reopen it.

## The split `LOCKED (premise) / PROPOSED (mechanics)`

Canon's drafting lives under
[THE SPLIT](../story-canon.md#the-split--the-duo-runs-the-fortress-alone-proposed-2026-08-06), tagged
`PROPOSED` there. What this page ratifies, retires, or reverses is below; canon's dead-button,
sigil, freeze and texture drafts stand as written, read with the assignment reversed.

### Structure: free shifting, lanes that meet at the gate `PROPOSED (Jeremy, 2026-09-16)`

The two lanes run at the same time and the player moves between them at sigils (canon's option, the
one Jeremy's gut picked). What is **retired** is canon's symmetric interlock, "progress above unlocks
progress below and vice versa." Jeremy's objection is the architect test: no builder wires a lever in
the tower to a door in the basement, and a player will notice the contrivance.

What survives the test is a dependency that converges on the goal instead of crossing the lanes:

- **The basement holds the power switch.** Throwing it powers the castle.
- **The tower holds a techno-key** of some kind.
- **The courtyard gate needs both**: a powered gate and the key that opens it. Both lanes must finish
  regardless, since each is blocked partway without the other's cause; the power and the key are
  there so the unsealing reads sensibly.

### The accidental interlock `PROPOSED (Jeremy, 2026-09-16)`

The lanes do depend on each other after all, but never by wiring. **By physics, and by accident.**
Weight falls and power rises, and neither protagonist has any idea he is doing anything for the other.
Both of them credit the heavens. The player is the only one who sees both halls, which is the canon's
double-ellipsis idea stretched across the whole dungeon.

Jeremy's two scenes, as first drafted (before the assignment swapped; the room-by-room lanes under
Topology carry the current owners, with Jerald breaking the floor and Rupert flipping the lever):

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
- **Each beat is a block and a cause, with a cross-cut when they line up.** The beneficiary's block
  has a sigil at it (canon's "keep the mechanism near the sigil"). When he is standing there as the
  cause fires in the other lane, the game cross-cuts to him receiving the effect; when he is not,
  the effect is simply waiting for him when he arrives.

**Switching is free at any time, at any sigil** (Jeremy, 2026-09-16). Progress still requires every cause to
happen: Jerald must break the floor, Rupert must flip the lever, and whatever else gets authored. So
the causes are mandatory and the order is not.

**Order-independence is handled with a second line, not a lock.** If the cause lands before the
beneficiary reaches the block, he never learns there was a block: Rupert trots across the rock unaware
there was ever goop to cross; Jerald finds a working elevator and says something like "glad there is
power to this elevator in this otherwise dilapidated castle." The cross-cut only fires when the
beneficiary is already standing at the block; otherwise the cause side gets its own beat and the
effect is simply present on arrival.

**Control is never seized mid-lane; geography guarantees one cross-cut** `LOCKED (2026-09-16)`.
Nimbus already spent "control forfeited to events" on its gatehouse joke, and the Fortress takes the
button away; taking the choice away too would turn the solo run into a corridor. So the player is
never told who to be while there is a choice left; the one exception is the forced flip when a lane
is finished, under the reunion above. What geography guarantees is that **at least one cross-cut lands as drafted every run**,
so the player always sees the two of them do something for each other without knowing it; which
cross-cut it is depends on which lane the player started in (see the room-by-room lanes under
Topology). Every other beat is free, with the second line catching whichever order the player
produces.

### Assignment `LOCKED (2026-09-16)`

**Rupert falls to the basement and Lust. Jerald springs to the tower and Envy.** The reverse of
canon's 2026-08-06 default, decided by painting all four protagonist-and-sin scenes and comparing
them (the verdict table is below; the two winning drafts are under their boss sections). Each man's strong
scene is with the sin that touches his own wound: Rupert did the genocide, so he meets its victim;
Jerald swallowed his monster, so he meets the one who never could. Both lanes carry an origin
flashback this way and neither does the other way.

Consequences carried into the rest of the page: Jerald's weight breaks the tower floor and Rupert
inspects the lever before flipping it; the ambush launches Jerald and drops Rupert; the tower yields
the **key** and the basement holds the switch (Jeremy, 2026-09-16: "not a switch or lever, key up in
a tower. Still, same thing happens").

**How the casting was decided:** all four protagonist-and-sin scenes were drafted and compared. The
two not chosen (Jerald at Lust, Rupert at Envy) were trashed on 2026-09-17 at Jeremy's request; the
verdict survives:

| | Lust (mute, done-to) | Envy (talker, wanted) |
|---|---|---|
| **Jerald** | funny, shallow: a monologue at a wall, no memory to prick | **deep**: the RL flashbacks, self-acceptance against the sin of wanting to be someone else, the crutch line |
| **Rupert** | **deep**: the Meltima flashback, sees and does not connect, mercy kill as a to-do list | flat: nothing for her to reach, walks past her |

Each man's strong scene is with the sin that touches *his* wound; the weak scenes are the two where
the protagonist has no stake; only the swap gives both lanes an origin flashback.

## The basement: Lust

### The basement itself `LOCKED (Jeremy, 2026-10-24)`

**The tower and the basement are opposites.** Jerald climbs a *tower*, and castle towers are narrow, which is
why every floor of his is one screen. Rupert's basement "probably actually isn't even a basement of the
castle at all": it is caves, with toxic stuff all around that Grudj never cared about, the toxic waste of
the castle's own machinery, or the growth the castle was poofed down on top of, dead and twisted.

- **Shape:** one or two levels deep, several maps to each level, and Lust on a final level of his own.
- **Dark:** `<ambient:[100]>` from the first step, except a small few tiles where Rupert lands, under the hole
  in the ceiling. Past that he relies on his own lighting gear, which he has by now from the Subterranean,
  and on a few whirring machines that give off a little light.
- **Digiwood glows down here** (Jeremy: "perhaps the digiwood trees... will be down here, and emit light?").
  That is the `*Branching (Digiwood)` harvest node (Enemies 17, sprite `$o_tree-digiwood`), limbs off a
  "Digital Holotree", the deliberately imported-looking tech wood. `docs/enemies/harvest-nodes.md` already
  proposes it, and Ultanium, the other legendary material, for the Fortress at 115-130.

**The plan** (2026-10-24, Jeremy: "sounds great"): caves carved like the Subterranean's, two levels and Lust's
own: B1 runs rooms 1-8 (the slide to the second switcher room), B2 runs rooms 9-12 (the horde to the last
switcher room), and B3 is Lust's alone. Within a level the maps run side to side, and the lane drops between
levels. Every map wears tileset 22 (see The look) and carries `<ambient:[100]>`.

**Drafted** `SHIPPED (2026-10-24)`, under `Map427` "AREA: Basement" and its `Map428` "FLOOR: B1", by
`tools/mapgen/dungeons/fortress.js`. The look: the dark purple-grey cobble ("A2 ground 9") under the dark
mossy cave whose face is all twisted roots ("A4 ceiling 18" and "A4 wall 26"). B1 runs east through doors in
the side walls, all wired.

| Map | What it is | Squares for Jeremy |
|---|---|---|
| `Map429` "Basement 1: Landing", 50x38 | the landing nook under the hole in the ceiling, the slide south out of it, the cavern at its foot, and a passage east | Rupert comes down at (9, 7), the one lit spot; the slide (x 7-11, rows 9-19) should not be climbable back up; how he gets here at all is the trap's event |
| `Map430` "Basement 2: Dark Floor", 50x38 | a passage in from the west, a cavern with two patches of hazard grate (tileset 19's, passable on every shape), and a way north and east | what the hazard floors do to Rupert |
| `Map431` "Basement 3: The Lever", 50x38 | in from the west and down into a cavern; the way out east passes a nook (x 35-38, rows 17-20) | the lever, at (36, 18), where he cannot pass it unseen |
| `Map432` "Basement 4: Switcher Room", 40x23 | a still chamber between passages west and east | the sigil |
| `Map433` "Basement 5: Goop Ocean", 120x40 | the goop wall to wall (tileset 19's green sludge, impassable); the west shore; **the block**, a six-wide channel nobody can hop (x 10-15, rows 18-20) between the shore and the first island; then eleven hops island to island, wandering up and down, with the big island halfway (around x 43-67, rows 7-18) for the encounter; the east shore | Jerald's chunk and the bridge it makes over the channel, and the cross-cut there (the sigil is one room back) |
| `Map434` "Basement 6: Hazard Floors", 50x38 | "manageable, a nuisance": a winding cave through two caverns, salted with four patches of hazard grate and two puddles of goop to step round; the first cavern is the encounter's | what the grate does to Rupert |
| `Map435` "Basement 7: Hazard Field", 60x40 | "completely covered in hazard floors": one great field of grate between safe ground at either end, with three safe stepping stones and the three hops between them covering about half the way | the switch puzzle, as the jumps' page condition (they are unconditional in the draft); the light bridge if Jerald reverse-charged the circuit, along row 23 from x 12 to x 47; the encounter |
| `Map436` "Basement 8: Switcher Room", 40x23 | a still chamber with the drop to the second level south out of it | the sigil |

**B2** `SHIPPED (2026-10-24)`, under `Map437` "FLOOR: B2", runs back west under B1 (Jeremy: "your suggestion is
actually about right").

| Map | What it is | Squares for Jeremy |
|---|---|---|
| `Map438` "Basement 9: The Horde", 60x45 | down from the switcher room into the biggest cavern yet, room for one man against a crowd; out west | the horde |
| `Map439` "Basement 10: Cultists' Lair", 80x30 | "a long path Rupert can only read as a cultists' lair": a winding five-wide path, along, down, along, up, along, with two platforms of dressed stone beside it (x 50-62, rows 20-27, and x 20-32, rows 10-17) | the torches lighting as he nears, the demon waves from the platforms (together the room's one encounter) |
| `Map440` "Basement 11: Dome Approach", 50x38 | a room that "leads up to a large dome underground": in from the east into a cavern, then a broad climb north to the dome, and a dead-end side passage west off the cavern | the barely perceptible button, at the side passage's end (9, 28); the encounter |
| `Map441` "Basement 12: Switcher Room", 40x23 | up from the climb into a still chamber | the sigil; Jerald's care package |

**B3** `SHIPPED (2026-10-25)`, under `Map442` "FLOOR: B3", Lust's level alone (Jeremy: "That is precisely
accurate... Do it").

| Map | What it is | Squares for Jeremy |
|---|---|---|
| `Map443` "Basement 13: Lust", 80x46 | the large dome underground, one great round vault two screens each way, big on purpose so his slow walk can pace the scene; Rupert comes in at the bottom middle, and a recess in the back wall dead ahead (x 38-41, rows 2-4) holds the elevator | Lust, waiting at the far end (around 40, 9), his proximity-paced approach and the fight; the VERY convenient elevator and the lane's exit scene |

**The ocean of goop** (Jeremy, 2026-10-24): big enough that you cannot see across it standing at one edge, and
since it is dark, nothing anyone can equip could ever light it all; "you MUST navigate across it", about
three screens of hops and jumps. **No tools in the basement or the tower:** both lanes "hop a little", and
the Snake Rope stays out, so the player never has to think about who had it equipped last. The hops are
built exactly as `Map158` "Rapid Hops" builds its own: a "jump" event on the edge square either side of a
two-square gap, three squares apart, each throwing the player four squares so they land past the other
side's event. The draft's proof checks every hop spans goop and lands on ground, and counts the channel
as bridged.

### The pre-fight scene `PROPOSED (Jeremy, drafted 2026-09-16)`

Lust is scrambled to zero: not himself by any stretch, the first and only intentional
scramble-to-sin on a junction, done to a sibling of the species, for whatever "ultimate power" Grudj
can speak to. He cannot talk. He lurches. Rupert does the rest.

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

Notes on the draft:

- **The flashback.** The only time the player ever sees the predecessor game's finale: the ship, the
  castle it crashed into (Jeremy's remembered image, now drafted as in-fiction), the island, and the
  crater of void where it stood. The species is called void clowns and the last thing Rupert left of
  their world was a crater of void. Not a claim about intent; a rhyme now on the page.
- **The thesis in one mouth, unheard by its owner.** Rupert remembers vaporizing the species fondly
  ("yeah I definitely remember beating that boss") and is appalled, thirty seconds later, that
  somebody did something cruel to one of them. He sees, and does not connect. The ex-hero's blind
  spot, and exactly what canon's Lust section asked for: the dread arrives spoken, and Rupert begins
  to question the shape of the plot.
- **A mercy kill narrated as strategy.** "I'll deal with this, then. Then onto the one who did this to
  you." Not heroism, not remorse; a list.
- **The pacing is Lust's walk.** In RMMZ the eyes-and-camera version of this scene reduces to one slow
  moving character, so the map is big on purpose and the beats fire on **proximity, not timers**: each
  line triggers as Lust crosses a distance threshold on his approach. The scene lasts exactly as long
  as the walk.
- The flashback fires before the courtyard accusation rather than during it. Two tellings of one
  story: theirs first, then his.

### The fight `LOCKED (hook, 2026-09-17)`

**He is only vulnerable when he wants something.** Scrambled to zero, nothing gets in while he
lurches; the sin reads as immunity, which is honest to what was done to him. When he *reaches*, a
slow, telegraphed grab, the reach is the opening: dodge it and the recovery is where he takes damage.
Lust desires, and desires you. Move and Wait, a pure timing duel, which is what a solo lane can
honestly ask of a player.

- **The grab is avoidable, never breakable.** There is nobody in the room to break it. Getting caught
  hurts like a mistake, not like the end of the fight.
- **It is tuned to the man who is there.** Rupert is largely a caster; a timing duel against a slow
  grabber is harder for him than it would be for Jerald, and Jeremy likes that. The fight would be
  easy for the man who is not in the room. Tuned to the *default* archetype, never gated on it: the
  class system lets a player build Rupert as a bruiser, and that player simply finds Lust easier.
  Canon's "build dependencies on the axis, never on their kits" is about puzzle gating, and this is
  difficulty, not gating.
- `OPEN`: whether he speeds up as he takes damage (the throughput creeping back as the scramble
  frays, rhyming with the gent's desperation CDR), and what the arena does while the player waits.

## The tower: Envy

### The pre-fight scene `PROPOSED (Jeremy, drafted 2026-09-16)`

Envy's grievance is that the only gift Grudj ever gave went to the sibling and not to her. But Grudj
gave a second gift, in scene one of this game: he handed two tourists their Node Junctions. Jerald
walks into her tower wearing the thing she spent centuries wanting, and has never once thought about
it.

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
- **"You look kinda familiar"** means only that all elementals look vaguely alike (Jeremy,
  2026-09-16), and she is the fifth. Not a plant. Whether the line stays is his call.
- **The chatter bubbles are a build requirement**: a stream of short popups running concurrently with
  a normal dialogue exchange. Worth checking against what the messaging upgrade in flight can do
  before assuming it is free.
- `OPEN`: canon's "one line about volunteering for the Nimbus split, not a joke" was written for
  Jerald alone in the basement. He is alone in the tower instead, and this scene is all noise until
  the fight. Whether the line lands somewhere on his climb, after the fight, or is dropped, is
  undecided.

### The fight `PROPOSED (2026-09-17, reviewing the August idea)`

The August idea (Jeremy's, from the boss-design conversation of 2026-08-03): many copies, only one
of them real, and the real one subtly *wrong*, because envy imitates but never achieves. The "Know"
verb nothing else in the game carries. There is one boss and one HP bar, the boss gauge; the clones
have nothing to show and nothing to share.

Reviewed against the tower as now drafted, it gets stronger, because the man in the room is Jerald:

- **It is the fight that is hard for him**, the same way Lust's timing duel is hard for Rupert. Jerald's
  answer to everything is force, and this is a fight where force at the wrong target is wasted. Each
  man gets the fight that would have been easy for the other.
- **The copies should be copies of Jerald, not of her** `PROPOSED`. Envy wants what he has; she
  imitates him. The player fights a room of Jeralds and has to know which one is not. That is his own
  flashback turned into a mechanic: a doppelganger wore his skin once and it broke him; now the room is
  full of them and he is fine, because "at least I recognize who I am." The player does the
  recognizing for him.
- **The tell is visual, and the difficulty is the count** (Jeremy, 2026-09-17). A behavioral tell
  is too vague: Jerald could be any class with any weapon, so "what only Jerald can do" does not
  describe a save file. A sprite cue does: she is the one that is slightly off, a hair color, say.
  Three copies with one off is obvious. **Thirty copies with one off is an effort.** Envy imitates but
  never achieves, rendered as one wrong pixel in a crowd.
- **The clones are invincible, and therefore they mill about at random.** They spawn everywhere and
  do nothing meaningful except get in the way of the time the player would otherwise spend chopping
  up the boss. They cannot home in on him: invincible bodies that converge on the player are
  impassable terrain and deadlock the fight (Jeremy, 2026-09-17). Random milling is what keeps the
  boss reachable.
- **The real cost is wasted cooldowns.** Skills have cooldowns; wasting "Flambé du Vide" on a clone
  is the punishment, and it is self-inflicted. That is the "Spend" verb, the other one the existing
  bosses lack, arriving in the same fight as "Know."

Open: the exact sprite cue, the count, and whether she reshuffles her position among the crowd on a
timer or on damage.

## The courtyard: the gent

No dialogue drafted beyond the sketch below. Canon's [Courtyard section](../story-canon.md#the-courtyard--the-red-eyed-gent-locked)
carries the shape: the reveal, the scramble (the core JABS ailments plus a 15-second SDP disable),
the Treis gate that defangs it, the thesis said out loud with no verdict, and the spoils `OPEN`. What
this page needs from it is the **fight**, because the fight decides the room and the room is the last
map; the dialogue can land whenever Jeremy wants to write it.

### The room `LOCKED (Jeremy, 2026-10-25)`

- **Its own weather.** The courtyard is the one place in the castle open to the sky, so it gets a weather of
  its own: a purple "gloom", with weird motes and a bit of fog. J-Weather presets are data
  (`data/config.weather.json`), and a layer takes a `tint`, so this is a new preset stacking tinted motes
  and fog the way `submerged` stacks motes and bubbles.
- **Perpetually dark, but not black,** with fluorescent lights around to light the area up.
- **The entrance:** when the two enter, the gent steps out from behind a statue and prepares his evil
  monologue.
- **No clock** (Jeremy: "You can't come here during the day and it'll be lighter or at night to get it
  darker").

**Drafted** `SHIPPED (2026-10-25)`: `Map444` "The Courtyard", 60x40, directly under the Fortress's folder,
tileset 21, noted `<noToneChange>`, `<weather:gloom>` and `<ambient:[85]>`. The `gloom` preset is new in
`data/config.weather.json` (id 16): a thin purple fog crawling low (`Cloud_05A`, tinted `#5b2d82`), violet
wisps (`Light_01B`, `#b26bff`), and at moderate and heavy a few pale sparks rising slowly (`#d9a6ff`); with
`<noToneChange>` the courtyard holds it at moderate, so the gloom never lifts. Every number is a first guess
for playtest.

| What | Where |
|---|---|
| The gate from the entry hall (needs the key and the power) | the gap in the front wall, x 28-31 on row 39; arrive on row 37 facing up |
| The terrace | rows 4-7 across the far end, paved in square tiles, its wall on rows 8-9 and stairs down the middle (x 27-32) |
| The statue he steps out from behind | the terrace's centre, around (29, 5) |
| The duel | everything below the terrace, rows 10-36, open floor for a battle mage who blinks from point to point |
| The scrambler machine, the fluorescent lights | Jeremy's to place |

### What Jeremy has `PROPOSED (Jeremy, 2026-09-17)`

Grudj is "my take" on a species whose source is gone: probably human-adjacent and different-looking,
probably good with magic. His schtick is scrambling the junctions he gave them, and he will do it
more than once. He probably blinks around the way Wrath did and fires beams. The scrambler may be a
**machine sitting in the boss room**, defeatable, so that beating it enough stops him scrambling at
all. First sketch:

> Grudj: HAHAHA I OWN YOUR POWER, FEEBLE PEASANTS
> Grudj: *(clicks SCRAMBLE on the node junctions he gave them)*
> Grudj: *(charges up and fires a massive unavoidable AoE damage blast)*
> Grudj: Wait why aren't you guys falling over to my overwhelming strength?
> *(Jerald and Rupert look at each other and grin)*
> Grudj: *(mumbles)* what is this power...

### The fight `PROPOSED (Jeremy, 2026-09-17)`

**A duel, not a phased battle.** He gets initiative: a scripted opening where he scrambles them and,
once he is fed up with conversation, slams the party with the big one. Then it is fight, fight,
fight.

- **This reverses canon's locked mechanism.** Canon has the scramble as an aura/skill suite with a
  single mid-battle 15-second SDP disable; this page makes it a machine that fires repeatedly. The
  ailment set and the Treis gate carry over unchanged.
- **The scrambler is a machine in the room on auto-repeat**: about a 15-second cooldown and about a
  10-second wind-up, so the player sees it coming and knows to go deal with it. The lesson it
  teaches is *remember to bring interrupts to the fight*. The alternative is brute force, because
  obliterated machines cannot do machine things, and a player who has to brute-force it eats a
  couple of his AoEs on the way: not weak, not lethal unless underleveled.
- **Every scramble is followed by Meltima.** Rupert's own ultimate, from times of yore. Grudj
  trained and trained and trained, and it still takes him about ten seconds to cast what takes
  Rupert a few. It hurts, for obvious reasons; the spell is brutal.
- **He is a battle mage who has trained for centuries to kill Jerald and Rupert**, and he fights
  like one: quick moves to specific points, then things. Beams, localized drowning spirals, zap traps
  set up mid-fight (Zaphazard enemies), quakes that stun, slow homing energy projectiles, dangerous
  void zones on the ground. An elemental rainbow arsenal. Not Lucian's blink-out-of-range-and-laser
  the-map; more localized than that.

The cycle, as it falls out of the above: wind-up (10s) → scramble → Meltima cast (10s) → cooldown
(15s) → wind-up. Two long tells per cycle, and everything the player does about them is the fight.

Why a machine and not an innate power, noted once: blinks and beams are studied, Meltima is stolen
from the man he is casting it at, and the one thing that is *his* is a device, and the device is ship
tech. Even his signature is something he took.

**Meltima is interruptible** (Jeremy, 2026-09-17), **but a scramble that lands paralyzes for the
entire cast**, so the player simply eats it. This is also how the Treis gate surfaces without a word
of UI: with the questline done the paralysis never takes, and a fumbled machine still leaves the
player a play on the cast itself. Interrupting Grudj's Meltima with Rupert's faster one is the payoff
the questline was for, when the player has it: Meltima is the signature of Rupert's Lavos fork (see
`classes/rupert/`), so it is a build the player may or may not have brought, and the interrupt
itself needs no particular skill. Canon's drafted gag ("did that side quest actually net us a meaningful
reward?!") already covers the moment.

**The only tell that you are winning is that he gets faster**: lower HP grants him cooldown
reduction, so desperation reads as tempo. No phases, no new mechanics; a 2v1 duel that Grudj
mistakenly thinks he will win, until he doesn't.

Numbers (the cooldown, the wind-up, the gap between scramble and Meltima, his level) are for the
playtest, and Jeremy expects to reach that point well under the planned band and adjust levels
accordingly.

## The entry hall `LOCKED (Jeremy, 2026-09-17)`

Not exciting, on purpose. The two walk in and revel at how mundane the castle looks for having such
a fancy gate. Then Jerald gets sprung up, Rupert gets dropped down, and the player picks who to start
with, in the manner of the FF6 moogle scene where the party divides and you choose who to follow.
Jerald's lane opens on the beams at the top of this very hall. This is also the last place with a way
out; see [Once divided, no leaving](#once-divided-no-leaving-locked-jeremy-2026-09-17).

**The room itself** (Jeremy, 2026-10-24): "a boring and conventional castle." A straight path leads
forward to the courtyard, some stairs lead up to a balcony floor that overlooks the hall, and a carpet
or something runs through it: "conventional castle types of things." The whole gimmick is that they take
about four steps in before the traps spring and drop the protagonists to their designated locations.

**Drafted** `SHIPPED (2026-10-24)`: `Map411` "Entry Hall", 40x46. It was first drafted one screen tall, and
Jeremy doubled it: at 23 rows it was "more like an entry closet". It hangs under `Map410` "DUNGEON: Frozen
Fortress", which sits under Map118 "FIELD: Lakeside Road" beside the Erocia Isthmus and the Crystalline
Ravine (Jeremy's placement). `tools/mapgen/dungeons/fortress.js` draws it. Every way in and out is a story
event, so the draft wires none of them; these are the squares they need:

| What | Where |
|---|---|
| The way in from the gate (`Map116` event 1) | the gap in the front wall, x 18-21 on row 45; arrive on row 44 facing up |
| The trap, about four steps in | the carpet around row 40 |
| The courtyard doors | the balcony's wall, x 18-21 on rows 6-7, dead ahead; the player stands on row 8 to touch them |
| The elevator | the balcony's wall, x 26-27 on rows 6-7 |
| The stairs | the openings at x 2-4 and x 35-37 on rows 6-7, paved like the balcony for the stair tiles |

The balcony (rows 3-5) is paved in square tiles so it reads as the floor above, and the carpet is the dark
framed runner. No music autoplays yet.

Order of beats: the trap springs, the pick, then the dead cycle button as the first thing that
happens in whichever lane was picked. The pick chooses who to *follow*; the button is still how the
player discovers, with their thumb, that following is all they can do. The reunion lands back here,
and the courtyard gate opens off this hall (see the reunion, `PROPOSED`).

## The tower's floors `LOCKED (Jeremy, 2026-10-24)`

- **The rafters** (Jerald's room 1) are the rafters at the top of the entry hall. The parallax is a still of
  the entry hall itself (Jeremy: "I could probably MAKE one, with a still of the entryhall"), so the player
  sees the hall below while treading along the rafters to the opposite side, where the ascent of the tower
  begins.
- **Every floor of the tower is one screen.** No map scrolling at all for Jerald.
- **The hole.** Every floor has one sectioned-off area to one of the sides that is inexplicably
  inaccessible. After beating Envy at the top, Jerald takes an evented tumble into it.
- **The fall** (row 14) is a tunnel, basically, maybe with windows, which makes it easy to read as falling.
  The `flip` motion (J-ABS Juice, `<motion:[flip, TURNS, DURATION, DIRECTION]>`) runs on repeat while he
  falls, with a bit of silly monologuing, and then control switches over to Rupert, per the reunion rules
  above.
- `PROPOSED`: the hole sits on the same side of every floor, so the stack reads as one shaft. Leaving it
  empty makes it solid in MZ for free: an invisible wall around an open pit.
- `PROPOSED`: the tunnel loops vertically (`scrollType` 1), so with Jerald on a move-down route the fall
  lasts exactly as long as the monologue, past the same windows, until the last line hands over.
- `OPEN`: whether a misstep on the rafters can fall. `PROPOSED`: no. An empty square is already solid,
  J-ABS knockback could shove him off a one-wide beam, a game over there sends the player back outside the
  castle (the last save is the platform on `Map116`), and the lane ends with Jerald's real fall, which a
  fall here would spend early. The fun alternative: drop him into the hall and let the spring launch him
  back up.

**Drafted** `SHIPPED (2026-10-24)`, under `Map412` "AREA: Tower" in the Fortress's folder, by
`tools/mapgen/dungeons/fortress.js`. The tower climbs up the screen: each floor is left by a stair at its top
and entered by a stair at the bottom of the next, the two standing over each other, so the way up zigzags
across every floor. The doors between floors are wired, in the area-event format.

| Map | What it is | Squares for Jeremy |
|---|---|---|
| `Map413` "Tower 1: Rafters", 40x23 | open air with beams zigzagging up the middle twenty columns, where the shrunk still of the hall will show, meeting halfway in a broad platform (x 11-28, rows 7-13) for the room's encounter; the beams themselves are one wide, for balancing, and grey brick standing in for wood (tileset 18 has wooden beams, 21 has none) | the spring lands Jerald on the bottom beam over the carpet, (19, 20); the parallax waits for the polished hall (Jeremy, 2026-10-24) |
| `Map414` "Tower 2: Boring Floor", 40x23 | the shared floor: the hole down the right side (x 31-37: its far wall on rows 5-6, the shaft on rows 7-17), up from the rafters at the bottom right, on up at the top left | |
| `Map415` "Tower 3: Crumbling Floor", 40x23 | the same floor, already fallen in across rows 10-12 and into the hole, with one crossing left standing | the crossing, x 14-16 on rows 10-12, is where the break event goes |
| `Map416` "Tower 4: Switcher Room", 40x23 | the same floor, up from the crumbling floor at the bottom middle | the sigil |
| `Map418` "Tower 5: Dead Elevator", 40x23 | the same floor with four pillars round the lobby for cover, and no stair on up: the elevator is the only way, its car in a recess in the back wall (x 18-21, rows 1-2) | the elevator, power-gated, riding up to the recess in the Bolt Gallery's front wall; until it is evented the atlas reads the tower as two runs split here |
| `Map419` "Tower 6: Bolt Gallery", 40x23 | the same floor with niches for the bolt traps, four down the left wall (x 1, rows 5-6, 9-10, 13-14, 17-18) and three along the back (x 9-10, 15-16, 21-22), so the bolts cross the floor both ways | the elevator arrives in the front wall's recess, x 18-21 on row 21, facing up |
| `Map420` "Tower 7: Needless Hazards", 40x23 | the same floor running in a ring round a great block of masonry (x 12-22, rows 8-14), so the fight circles it and the hazards have every wall to line | the reverse-charge switch |
| `Map421` "Tower 8: Switcher Room", 40x23 | the same floor, up from the hazards at the bottom left | the sigil |
| `Map422` "Tower 9: Mini-Boss", 40x23 | the same floor left wide open for the ghost, which needs no cover; up from the switcher room at the bottom middle, and on by another elevator, its car in a recess in the back wall (x 18-21, rows 1-2) | the ghost; the elevator into the ride |
| `Map423` "Tower 10: Elevator Ride", 40x23 | a static car, 6x6 (x 17-22, rows 8-13), on blue-lit tech flooring with a riveted steel front, hanging in a shaft of nothing (x 12-27, rows 3-18) inside stone walls: "a boring static elevator-like room, a little tight" (Jeremy, 2026-10-24) | everything: the parallax moved to make it climb, the sound and dialogue, the robot waves by eventing, and where the ride lets Jerald off |
| `Map424` "Tower 11: Grand Staircase", 40x23 | the same floor with the elevator's arrival recess in the front wall (x 18-21, row 21) and a grand staircase six wide through the back wall (x 17-22), between two pairs of pillars that make an aisle of the approach | where the elevator ride lets Jerald off |
| `Map425` "Tower 12: Switcher Room", 40x23 | the same floor, the grand staircase arriving at the bottom (x 17-22) and the last stair leaving from the top middle | the sigil; Rupert's care package |
| `Map426` "Tower 13: Envy", 40x46 | Envy's chamber, two screens tall: one screen left thirty milling clones "one every few tiles", so Jeremy asked for "size x 2 and see how it looks", and with thirty clones scattered over a render it looked "about right... PLENTY of space for THIRTY fucking clones to wander around and be sufficiently annoying" (2026-10-24); the hole at the top right as on every floor, and the floor she waits on paved in square tiles (x 13-26, rows 6-12) | the clones, Envy and her scene, and the tumble into the hole |
| `Map417` "Tower 14: The Fall", 40x46 | the shaft's stone wall seen face on (x 15-24) between two dark sides, looping vertically (`scrollType` 1) | the fall's route and the windows; it sorts last under the tower folder (order 9999), so later floors have to slot in above it |

## The look `LOCKED (Jeremy, 2026-10-24)`

On 2026-09-17 the question was whether one set could cover everything the lanes need at once:
**technology, sludge, cave, and castle.** Laid side by side on 2026-10-24, the EX family covered all four
between its two rows, and both rows are already the Negative Peaks' look (19 is every Peaks cave; 18 is
Peak Rest and the Room of Sacrifice), so a castle stolen off that summit still looks like it came from
there. Jeremy called it sound and asked for a row of its own.

- **Tileset 21 "EX Dungeon Fortress"** `SHIPPED (2026-10-24)`: a clone of 19 "EX Dungeon Icy" with two
  sheets swapped in.
  - **A4 is `EX_Dungeon_A4_2`**, which sat on disk in no row until now: grey castle stone, stone with
    blue-lit tech trim, riveted steel, rough fieldstone. His tech bolted onto stone he did not cut, as walls.
  - **E is 18's `EX_Dungeon_D`**, the industrial tech sheet: server racks, pipes, generators, goop tanks,
    hazard signs, chain-link. It replaced the ore sheet, because ore in CA is harvest events (`$o_ore-*`),
    never tiles.
  - The rest is 19's: A1 ice, lava, green sludge pools and a hazard grate; A2 snowy stone floors; A3
    castle exteriors; A5 gateways and cave mouths; B plants; C icy castle ruins and a spiral stair wrapped
    around a tower; D iron gates, cages, a portcullis, the portal ring.
- **Its flags** are 19's for 19's sheets. Every A4 kind takes 19's wall convention (ceilings walkable
  inside and blocked on their edges, with no terrain tag; faces solid), and E carries 18's flags for the
  tech sheet.
- **Its "goes on top" marks** in the map editor (`jmz-editor/tileset-marks.json`) are 19's A5 marks, since
  the A5 sheet is shared. 19's A4 marks belong to the other wall sheet, so 21 has none for A4 yet.
- **The trade:** A4 has no cave walls now, and the plain stone steps left with the ore sheet. A map that
  wants either can still use 18 or 19, since every map picks its own tileset; inside 21, the stairs are
  the spiral's stone steps (C) and the iron stairs (D).
- `OPEN`: the set's sludge is green and the drafted lines call the goop purple. Tileset 14 is the only
  candidate that had purple goop.
- **Tileset 22 "EX Dungeon Basement"** `SHIPPED (2026-10-24)`, for Rupert's caves (Jeremy: "sounds great"):
  a clone of 18 "EX Dungeon Normal" with 19's animated sheet (`EX_Dungeon_A1_2`) in A1, for the toxic sludge
  pools (impassable, A1 kind 6) and the hazard grate (passable, kind 12). 18 already carries the caves, the
  twisted roots and glowing growths, the gothic sheet whose pentagram suits room 10's cultist lair, and the
  industrial machines. 18 and 19 flag their A1 sheets identically, so 22's flags are 18's to the bit. 18 has
  no "goes on top" marks, so 22 has none either; 19's A4 marks cover the same walls if wanted.
- The `ice-cavern` tiles on disk have no Tilesets row; nothing currently plans to use them.
- Crusty is original and the snow is the timestamp; see the topology note.

## Rosters `OPEN`

Deferred by Jeremy on 2026-09-17: the enemies for the dungeons *before* this one are not laid out
yet, so the Fortress's rows and levels cannot be settled ahead of them. Family homes that already
exist are listed under the room-by-room notes. The two mini-bosses are rows, not designs: one
affix-laden ghost target-leveled around 135 for Jerald, several affix-laden Origin-tier robots, orbs
and golems around 130 for Rupert.

---

## Open items

- **Whose castle was it.** Pinned; see the section above.
- **The goop's colour.** Tileset 21's sludge is green; the drafted lines say purple.
- **Rosters and levels.** Deferred until the dungeons before this one have their enemies laid out.
- **Lust's fight.** Hook locked (vulnerable only when he reaches). Speed-up on damage and the
  arena's behavior are open.
- **Envy's fight.** Shape settled (clones of Jerald, invincible, milling; one off; cooldowns as the
  tax). The exact sprite cue, the count, and whether she moves in the crowd are open.
- **"You look kinda familiar."** Jeremy's intent was only that all elementals look vaguely alike.
  Whether the line stays is his call.
- **Jerald's "one line, not a joke."** Written for the basement; he is in the tower now. Somewhere on
  the climb, after the fight, or dropped.
- **The chatter bubbles** under Envy's dialogue: confirm the messaging upgrade can run a popup stream
  under a normal exchange.
- **Canon's split drafts** (the ambush, the dead button, the one line, the stillness paragraph) carry
  a reversed-assignment note each; the lines themselves are still written with Jerald below.
- **The spoils.** Whether the regression power transfers is canon's `OPEN`, untouched here.

---

## Build punch list

- [ ] A `DUNGEON:` tree node for the Fortress with the entry hall, both lanes (fourteen maps each as
      drafted), and the courtyard beneath it. The node (`Map410`), the entry hall (`Map411`), the whole
      tower lane (`Map412` "AREA: Tower" and `Map413`-`Map426`), the whole basement lane (`Map427`
      "AREA: Basement", its three levels and `Map429`-`Map443`) and the courtyard (`Map444`) are drafted:
      the rough pass is complete (2026-10-25).
- [x] Tileset decision, then a Tilesets row: tileset 21 "EX Dungeon Fortress" (2026-10-24).
- [ ] Entry hall: the mundane-castle exchange, the spring trap and trapdoor, the moogle-style pick.
- [ ] Both lanes room by room, with switcher rooms enemy-free and a sigil at every block.
- [ ] The two mandatory causes (floor collapse, lever), evented so they cannot be skipped, with the
      cross-cut and the variant line for each order.
- [ ] Room 7's mutual optional help, both triggers live, first-arriver-helps-second.
- [ ] The two care packages in the final switcher rooms.
- [ ] Lane exits: the fall, the elevator, the forced flip to the unfinished lane, the reunion, and the
      two duration lines.
- [ ] Party-cycle disabled from the trap until the reunion, and the sigils as the only way to move
      between lanes.
- [ ] Enemy rows in band: hazards, a void ghost tier, puppets and orbs for the horde, robots, Sin
      Votaries at `593-597`, Lust, Envy, Grudj, plus their material blocks.
- [ ] Lust's approach scene on proximity thresholds, and his fight (immune while lurching, open on
      the reach, an avoidable grab).
- [ ] The point of no return: signposting at the entry hall, and no teleportal anywhere inside.
- [ ] Envy's scene with the chatter stream, the two flashbacks, and her fight.
- [ ] The courtyard gate needing both the key and the power.
- [ ] The scrambler machine (cooldown, wind-up, interruptible), Grudj's Meltima as an enemy skill
      with a ten-second cast, his arsenal, the desperation CDR, and the Treis-gated paralysis.
- [ ] The off-sprite clone charset for Envy, and the clones as invincible, randomly milling enemies.
- [ ] `Items[174]`'s description still says "not yet implemented."
