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

## The basement: Lust `OPEN`

## The tower: Envy `OPEN`

## The courtyard: the gent `OPEN`

## Rosters `OPEN`

---

## Open items

---

## Build punch list
