# Map: The Subterranean (Hell, the Sloth dungeon)

> Transcribed 2026-09-11 from a design conversation that was still in progress when it was written
> down, which is the point — the Nimbus spec was lost once by waiting until the session was over.
> Status tags follow [`story-canon.md`](../story-canon.md): `SHIPPED` is in the data now, `LOCKED` is
> decided and unbuilt, `PROPOSED` is floated, `OPEN` is undecided. Decisions are Jeremy's unless the
> tag says `PROPOSED`, which means it came out of the discussion and has not been ratified.
> The canon's [Disk 2 section](../story-canon.md#disk-2--the-subterranean-sloth-locked) stays the
> story authority for Sloth herself; this page is the build spec and must agree with it.

The Subterranean is chapter 4's second technodisk dungeon and the second of the two **mandatory**
beats in the chapter — band 95-110, home to the Sin of Sloth. It is the tonal opposite of Nimbus by
design. Nimbus is the comedy control group; here the joking stops, and it only lands because Nimbus
spent a whole dungeon establishing the reflex it breaks.

---

## What exists in the data today `SHIPPED`

| Thing | State on 2026-09-11 |
|---|---|
| `Map290` "DUNGEON: Subterranean Depths" | the tree node, 0x0, one child |
| `Map331` "Subterranean Entrance" | **built**, 40x25, tileset 14, save platform, two durable posts, `_FF8-Flashback` BGM |
| `Map137` "Deeper We Go..." | mines-side room; its event 18 is the only transfer into the dungeon |
| `Map54` "Downward Spiral" | mines-side room; seven `Spire` events (enemy 31) clustered at (18-21, 8-11) |
| `Map332` "Shortcut" | 60x25 corridor joining `Map54` and `Map137` — **mines-internal**, despite the tree calling it "Shortcut to Subterranean" |
| `Map180` "Deeper Dive" | Forlorn Basin floor 4, descends to floor 5. **Nothing here reaches the Subterranean** |
| `Map385` "Shaft 1b", `Map386` "Shaft 1c" | **drafted 2026-10-23** by `tools/mapgen/dungeons/subterranean.js`: layer 1's mineshafts, 50x38 each, floor, walls and doors only, the doors in Jeremy's area-event format. 1b's south door lands on `Map331` at (35,2); `Map331`'s own half of that door is Jeremy's to place: an event at (34,1), the top of the corridor between its two wall lamps, with `<areaEvent:[3,1]>`, transferring to `Map385` (25,35) facing up. 1c's drop shaft leads down into 2a |
| `Map391` "Rib 1c", `Map392` "Rib 2b" | **drafted 2026-10-23**: the first ribs, side maps at the end of a dead-end tunnel, each exactly one screen (40x23). Rib 1c hangs below Shaft 1c's dead-end chamber (an old ore seam, as floated); Rib 2b sits up Shaft 2b's side passage (an abandoned miners' camp, as floated) |
| `Map408` "Prelude", `Map409` "Arena" | **drafted 2026-10-23**, layer 6 (under `Map407` "FLOOR: 6"), pitch black. The prelude is "a map that obviously is the last map before something bad", and otherwise "just a regular map": a winding path from the Respite's way down to its west door. The arena is the path again until it simply stops at one wide platform (about 27x19) with drops on every side but the way in; the statue and its purple-red light are Jeremy's to place. It autoplays no track, so the theme stops at its door: layer 6 takes the sound |
| `Map404` "Dark 5a", `Map405` "Dark 5b", `Map406` "Respite" | **drafted 2026-10-23**, layer 5 (under `Map403` "FLOOR: 5"): `<ambient:[100]>` throughout, "zero passive visibility" (Jeremy). 5a and 5b are 60x45 paths over the chasm with no rope crossings, since nobody can find a post they cannot see. 5b's fork platform has the Basin's way in cut up to its top edge at x 37-39, waiting on the Basin floor Jeremy picks; its door will be an event at (37,1) with `<areaEvent:[3,1]>`, arriving facing down at (38,2). The Respite is one 40x23 chamber on solid ground with its way down to layer 6 at x 19-21; its sigil, its teleportal and the hub's teleportal room are Jeremy's to build ("You can leave the actual implementation of the room to me") |
| `Map400` "Islands 4a", `Map401` "Islands 4b", `Map402` "Islands 4c" | **drafted 2026-10-23**, layer 4 (under `Map399` "FLOOR: 4"): 60x45 each, the ground broken into teal islands over the chasm, joined by land bridges or by the Snake Rope. Every rope crossing has a durable post (enemy 33, shaped like `Map331`'s) on a jetty tip either side, the two on one row or column four or five tiles apart; `map-atlas gates 290` counts all 16 as hookshot anchors. 4a and 4c each have a dead-end island to rope out to. 4c's way down runs off its bottom edge at x 7-9 |
| `Map393` "Snake 3a", `Map394` "Snake 3b", `Map395` "Snake 3c" | **drafted 2026-10-23**, layer 3: 60x45 each, a five-wide teal path winding over one great chasm, wider platforms at the turns to fight on, the teal walls standing well back. 3a's top door lands on Cavern 2d at (9,37); Cavern 2d's own half of that door is Jeremy's to place (see below). 3c's way down runs off its bottom edge at x 46-48 |
| `Map387` "Shaft 2a", `Map388` "Shaft 2b", `Map389` "Shaft 2c", `Map390` "Cavern 2d" | **drafted 2026-10-23**, layer 2: three 50x38 mineshafts running back west, then the 60x40 cavern where Jeremy builds the snakerope switch to teal ground. 2d's way down to layer 3 runs off its bottom edge at x 8-10 |

**Both built approaches are in the Pearl Salt Mines.** The Forlorn Basin side of the canon's
two-entrance promise has no map and no link yet; see [the entrances](#the-two-entrances) below.

`Map331` is the design reference for the whole dungeon and is worth opening before drafting anything.
It uses the same tileset as the mines and looks nothing like them.

---

## The look `LOCKED`

Tileset 14 "Dungeon (VisuStella)", tiled and decorated nothing like the Pearl Salt Mines that share
it. Teal scaled rock, a magenta pool with an orange-crusted shoreline, red growths, a pink rim light
along every ledge, black drops into nothing, and two skeletons.

The intent is **alien and dark, and above all claustrophobic** (Jeremy, 2026-09-11). Not a cave —
somewhere you should not be, that does not care that you are there.

- **The lights go out.** Each map's `<ambient:[DARKNESS]>` note (J-Lighting) sets how much light is taken
  away, keyed to its layer (see Layers, under Topology). Torches, bioluminescence and the player's own
  lighting gear are the only light sources.
- **Ambient critters** drift slowly through — glowing butterflies as the working idea. They are not
  enemies, they ignore the player entirely, and their glow is what reads as "well, that's safe.
  Probably."
- **Even the lit chambers are dark.** Light is local and never fills a room.
- **The walls descend too** (Jeremy, 2026-10-23). The Pearl Salt Mines moved to the lighter A4 ceiling
  38 + wall 46 `SHIPPED (2026-10-23)`, all 47 maps, with tileset 14's passage and terrain-tag flags
  identical shape for shape, so nothing about collision changed. The mines' old, darker ceiling 2 +
  wall 10 is now the Subterranean's mine look: `Map331` took it the same day `SHIPPED`, and the
  mineshaft layers use it too. The alien ceiling 8 + wall 16 (`Map331`'s original walls) takes over at
  layer 3 `PROPOSED`. The numbers are the map editor's palette labels, which count from 1 within the
  sheet.
- A **biological** reading of the same art — vascular growths, a membrane, something you are inside
  of rather than under — was floated and is compatible with alien-and-dark rather than a replacement
  for it. `PROPOSED`

---

## Topology

**The shape is a snake** `LOCKED (2026-09-11)`. The player should feel they are descending through
the body of one enormous serpent: a single winding descent rather than a branching cave system, with
corridors that bend so you never see far ahead. That is where the claustrophobia comes from, and it
is the structural commitment the whole dungeon hangs on.

**Both entrances lead to the same path** `LOCKED (2026-09-11)`. They are not two dungeons and not two
branches that merge.

`PROPOSED` — if the dungeon is a tube, the two entrances are not converging branches but **two
punctures into the same tube at different depths**. The Basin is deeper than the mines, so the Basin
mouth opens further down and a player arriving that way skips the upper section. That is a reward for
having explored the Basin, in the same spirit as the Basin's own central-spire shortcut.

`PROPOSED` — the consequence worth building around: **key every gradient to depth, not to progress.**
Darkness, bioluminescence density and heartbeat volume are per-map properties, so a player dropping
in from the Basin lands at the correct intensity with no scripting at all. Anything keyed to "how far
through the dungeon are you" breaks the moment somebody uses the second mouth.

### Layers `PROPOSED (Jeremy, 2026-10-23)`

**About six layers deep, and each layer is a few maps**, two to four, the way the Forlorn Basin was
built ("each floor has like 2-4 maps"). **The maps coil around like a spring**, so the descent keeps
turning back on itself instead of running straight down.

**The layer sets the darkness.** Starting values, which Jeremy expects to tune in playtest. First drafted
as 20/40/60/80/100/100, then raised once the mines settled at 70 (see below):

| Layer | Darkness | What it is |
|---|---|---|
| 1 | 75 | mineshafts, with walls and torches |
| 2 | 80 | mineshafts for 2a-2c; 2d opens up into a cavern, the mouth of the snake |
| 3 | 85 | the mineshafts are gone: a wide-ish path with a bottomless pit on both sides, the back of a snake |
| 4 | 90 | the snake's back |
| 5 | 100 | pitch black; the fork: **the Basin entrance lands here**, and the rest room ends it |
| 6 | 100 | pitch black: a prelude map, then the arena |

In the bottom two layers nothing can be seen but the bioluminescent critters and the player's own
lighting gear, "assuming you brought some."

**Revisited the same morning** `PROPOSED`: the mines themselves are being darkened ("They are
literally a cave with no sunlight, how the fuck can the player see clear as day?"), **to 70**: "dark,
but not SUPER dark. There is a lot going on in the mines." (The outer ring has carried `<ambient:[85]>`
since #97.) The snake must never be brighter than the room the player walked in from, so the ramp
starts above the mines' 70 and still reaches pitch black by layer 5; the exact steps are for playtest.
The torches help carry the descent: fewer in each shaft map, none past layer 2.

Both proposals above now hold by construction. The Basin mouth opens two layers above the arena, deeper
than the mines mouth, and darkness keyed to the layer is darkness keyed to depth, so a player arriving
from the Basin lands pitch black with no scripting at all.

**`Map331` stays the entrance, the first map of layer 1** `LOCKED (2026-10-23)`. Jeremy built it because
he "wanted an entrance that looked different from the existing mines," and once the mines took the
lighter walls and `Map331` took their old dark ones, that was solved: "the mines wall and ceiling
recoloring fixed it." He will strip its alien pieces and make it "a bit more mineshaft-ey" himself. The
draft extends the dungeon from it, and the breakthrough into the snake happens in layer 3's first map.

**Layer 5 is the fork, and the rest room closes it** (Jeremy, 2026-10-23). The player comes in from layer
4 or from the Basin, has "a moment of respite" at the rest room at the end of the layer, with the save
sigil and the teleportal, and proceeds into layer 6. **Layer 6 is just two maps**: a prelude, then the
arena. Both mouths converge on the same rest stop, and it is the same rhythm as Nimbus, whose Hall of
Repose sits right before The Final Door and the throne room. The rest room holds only the sigil and the
teleportal, as every rest room does, "because the mapping is a bit fiddly." Its light is the sigil's
own: **every save sigil gets a light**, since "all save sigils are the same" (a universal pass, already
on Jeremy's agenda), and a couple of bioluminescent critters are the only other light on the layer.

### The arena `PROPOSED (Jeremy, 2026-10-23)`

The snaking path again, except it comes to an **abrupt end**: cliffs on every side but the path that led
there, and the statue sitting ominously in its own purple-red light. The whole fight happens in this one
area, so it is sizeable, with room to move around and for two people to fight a swarm of spawned monsters.

### The draft layout `LOCKED (2026-10-23)`

What the rough pass builds. Jeremy: "the snake looks silly and cute 🐍 perfect. It doesn't coil like i
thought (like a spring) but snakes ACTUALLY coil like your suggestion is, so... it works." Three maps a
layer and the Basin dropping into `5b` were the proposal's guesses; everything else is his. **Layer 2 is four maps** (Jeremy, 2026-10-23): 2a to 2c are
mineshafts, and 2d is "a bit cavernous as it opens up into what becomes the subterranean we know and
love," so that reaching layer 3 is never "oh, I arrived on a new map and suddenly its super different."
The switch happens inside 2d, and it is Jeremy's to build: a few snakerope connection pieces, one of
which zips the player from mine ground across to a different, teal ground. The rough draft leaves 2d a
plain cave in the mine look.
Seventeen new maps plus `Map331`, and a teleportal room under the hub the way Nimbus has one.

**Layer 3 is where the snake begins** (Jeremy, 2026-10-23). Teal ground is normal from here on, the
cavern at the end of layer 2 being where he transitions into it "across a chasm", with the teal walls as
well: the map editor's A4 ceiling 8 + wall 16 over `Map331`'s teal floor, A2 ground 26. The paths stay
"about as wide as they are in the previous (not-cavern) maps", three tiles, "but the walls will be
further and there will be chasms on each side": the chasm is A2 decoration 30 (impassable on every
shape), laid over the teal floor the way a decoration sits. **This is also where the heartbeat starts
to be audible.** No heartbeat sound is in `audio/bgs` yet, so the draft carries no BGS.

**Every passage is five wide** (Jeremy, 2026-10-23): "Having enemies on a 3-tile wide path means you just
run at them and swing until dead lmao. 4-6 gives room for sidestepping/dodging/manuevering." Layer 3
was drafted that way, with wider platforms at the turns, and the layer 1 and 2 shafts were widened the
same day, growing to 50x38 so the layouts kept their shape ("just widening the tunnel will functionally
shorten the maps otherwise"). Only a door's last few squares narrow to a three-wide neck.

**Every layer mutates** (Jeremy, 2026-10-23: "each layer should change and mutate in some way, but I'm
not sure how"). `PROPOSED`, the same day: each layer takes something away, which is Sloth's whole
character, a place that strips you down until there is nothing left but her. Layers 1 and 2 take the
mine you knew (the torches thin out), 3 takes the walls (open chasm), 4 takes the ground (the path
breaks into islands crossed by snakerope; Jeremy: "yeah thats fine, its an extension of the cavernous
area anyway. More of that."), 5 takes the light, and 6 takes the sound (the heartbeat stopping, as
floated under Sound). Layer 4 was first floated as taking the space, the snake closing
around you with ribs jutting toward the path, and Jeremy turned it: the chasm layers are where the
dungeon "opens up the most," so a layer that closes in reads wrong there, and the tileset has no
wall-sized rib bones. Taking the ground leans into the openness instead.

What the tileset does have, for dressing: `Dungeon_B_VS` has a fossil-like beast skeleton at the bottom
of the sheet (a huge toothy skull and its ribcage, about 2x2 tiles), two small skeletons (where
`Map331`'s came from) and mining gear (shovel, pickaxe, rope, gold); `Dungeon_C_VS` has a run of
pillars in several stones, skull-carved ones among them.

**The map tree reads layer by layer** (Jeremy, 2026-10-23). Each layer's maps hang under a 0x0 folder
named like the Forlorn Basin's floors (`Map396` "FLOOR: 1", `Map397` "FLOOR: 2", `Map398` "FLOOR: 3"),
and each rib under the shaft it branches from. The recipe's `FLOORS` table adds a folder per new layer.

**Ribs** (Jeremy, 2026-10-23: "go ahead and add a few of the 'ribs'"): some dead-end tunnels lead on to
a small side map of their own instead of stopping, so a side trip reads as a discovery while the maps on
the main path stay a size that is quick to polish. The rest stay pockets for loot or an ambush. No map
is smaller than one screen, 40x23: the game runs at 1920x1080 with 48-pixel tiles and no zoom, so a
screen is 40x22.5 tiles, and the engine centres any smaller map in a black border. Each layer runs the opposite way from the one above it, which is the coil.

```text
  Pearl Salt Mines (70) · Deeper We Go (137)
                                  │
  L1  75 ┊ shafts                [331] ──── [1b] ───── [1c]
                                                        │
  L2  80 ┊ shafts     [2d] ───── [2c] ───── [2b] ───── [2a]
         ┊ 2d cavern   │
  L3  85 ┊ snake      [3a] ───── [3b] ───── [3c]
                                             │
  L4  90 ┊ snake      [4c] ───── [4b] ───── [4a]
                       │
  L5 100 ┊ the fork   [5a] ───── [5b] ───── [REST] ◄─► teleportal
                                  ▲           │
                            Forlorn Basin     │
  L6 100 ┊ the end             [ARENA] ── [prelude]
```

---

## The two entrances

### Mines side `SHIPPED`

`Map137` "Deeper We Go..." → `Map331` "Subterranean Entrance". Built, reachable, save platform in
place. `Map331` currently dead-ends — it has no exit except back the way it came.

### Basin side `OPEN`

Canon promises a descent beneath the Forlorn Basin, snakerope-gated, and nothing is built. The Basin
is one enormous hole with grey stone walls, spires and rocks, descended by hopping between layers and
passing through holes; a single spire up the middle serves as a faster exit than backtracking
(Jeremy, 2026-09-11). The Basin is **deeper than the mines**, which is what sets the two mouths at
different depths.

**It opens into layer 5 of 6** (Jeremy, 2026-10-23), so a player arriving this way skips everything
above it. Which Basin floor and passage lead there, and whether it needs its own entrance map the way
the mines side got `Map331`, is still undecided.

---

## Sound `LOCKED (2026-09-11)`

A **heartbeat as passive BGS**, growing louder as the player approaches the boss. Map BGS volume is
a map property, so the escalation is authored per map and costs nothing at runtime.

**The theme is `_SMRPG-Remachination`** (Jeremy, 2026-10-23: "That would be perfect!"). It is DDRKirby's
OC ReMix "Remachination" (OCR04809, 2025) of "Weapons Factory" from Super Mario RPG: dark liquid drum
and bass that keeps the source's 13/8, with industrial effects up front and reverb-soaked synths. OC
ReMix tags it high-energy, but Jeremy: "It's also not THAT high-energy, especially not when put alongside
what the actual mines soundtrack is." It has sat in `audio/bgm` since April, used by no map.

**It fades as the heartbeat rises** (Jeremy, 2026-10-23: "That... would make sense. BGM fades out as
heartbeat fades in."). Map BGM volume falls layer by layer while the heartbeat's BGS volume climbs, so
the bottom is the heartbeat alone. The song never restarts on the way down: when the next map names the
track already playing, `AudioManager.playBgm` only updates its volume (`js/rmmz_managers.js`; no CA
plugin replaces it). `Map331` still plays `_FF8-Flashback`, Laguna's battle theme, and that is not the
dungeon's music; Jeremy is "explicitly choosing not that." It dates from when
he pictured the Subterranean as a lava-centric, demon-filled place, before the story work made it
Sloth's and "suddenly that wasn't appropriate anymore." Proposing it drew: "How in the WORLD did you look at my
available music and pluck Laguna's battle theme from FF8 to be the entire dungeon's music."

`PROPOSED` — the heartbeat **stops** when the player reaches her. She is the one thing down there
with no will to act and the beat is the only part of her still moving; silence after a descent's
worth of rising pulse is the strongest beat available and it is free. In phase two, when she opts
back in, it spikes.

---

## Rosters

The subgroups wanted here `LOCKED (intent, 2026-09-11)`:

- **snake reptiles** — slithering minions, the dungeon's signature
- **cube slimes** — needs a character sprite; nothing exists
- **crawler bugs** — centipedes
- **brood bugs** — spiders
- **orb constructs** — dangerous supporters of ruins

Every one of the five already has its subgroup allocated in `Enemies.json`, read from the live table
on 2026-09-11 rather than from [`../enemies/main.md`](../enemies/main.md), which predates the
five-tier recut and disagrees in several places:

| Wanted | Subgroup | What is actually in the slots |
|---|---|---|
| snake reptiles | Reptile → **Snake** `151-155` | Prince Cobra lv24, Asp lv51, then three `=== TBD Snake`. `!Vice Cobra` sits apart at `160` as a named rare |
| cube slimes | Slime → **Cube** `291-295` | five `=== TBD Cube` stubs and nothing else — **no rows authored and no character sprite** |
| crawler bugs | Insect → **Worm** `411-415` | Crawler lv17, Magma Worm lv43, Wriggle Worm lv64, then two stubs |
| brood bugs | Insect → **Lonewolf** `421-425` | the base row is literally named **`Brood`** (lv17), then four stubs. The subgroup label says Lonewolf and the row says Brood, so there is no conflict to resolve — the slots are there |
| orb constructs | Construct → **Runic Orb** `541-545` | base `Runic Orb` lv9, then four `=== TBD Runebound` at 26/34/42/50. [`nimbus.md`](./nimbus.md) earmarks the base for the Pearl Salt Mines "to imply technology and depth" and gives Nimbus a high Runebound tier. The Subterranean sits between those two, so the thread already runs through its doorstep |

So no new families are needed and no new subgroups either — what is missing is **authored rows in
band**. Every ladder above stops well short of 95-110, and the `<level:>` tags on the `TBD` stubs are
copy-pasted placeholders rather than plan, so they set no expectation.

The Cube slimes are the one subgroup with nothing at all in it. If the Subterranean takes all five
slots, cube slimes become a dungeon-exclusive family, which is a reasonable thing for them to be.

Already placed nearby and worth reusing: **cave bats** (enemy 361) appear in both mines-side rooms,
and **`@Durable Post`** (enemy 33) is standing in `Map331` itself — hookshot is the established
traversal verb here before the dungeon has a single room.

---

## The voidal question `OPEN`

Canon has Sloth manifesting endless voidal minion waves. Whether the player ever sees one **before**
the fight is undecided.

The facts that bear on it:

- **Void is element 9**, first-class.
- The **Undead block `101-150`** is already the void faction: its members attack with Void and most
  carry a Void rate of x0. Four subgroups, with open stubs in Ghost (`104-105`), Reborn (`113-115`),
  Wisp (`123-125`) and Hollow (`143-145`).
- But Undead's natural home is the **Desolate Graves** — that is the floated meaning of the hub's
  "voidal" door. Spending it here leaves the Graves with nothing to be.

`PROPOSED` — her minions are *manifested*, not native fauna; they are pieces of her rather than
things that live down there, so they should not be Undead at all. The foreshadowing then writes
itself: the player finds them **inert** on the way down, standing, not attacking, several of them
across several maps, and nothing ever happens. Not acting is the entire sin. Then the fight begins
and all of them move at once.

**`Skills[2587]` "Absolute Solitude"** — 180-frame cast, radius 99, *"a foul fog melts the field with
the despair of absolute solitude. Scales rapidly"* — exists and is referenced by **no enemy and no
class**. It sits next to `2585` Soul Siphon, `2586` Unholy Smite and `2588` Wave of the Void in what
reads as an unassigned void set.

---

## Open items

- **The Basin mouth.** It lands in layer 5; no map, no link and no chosen Basin floor yet.
- **Whether voidal minions appear before the fight**, per above.
- **The cube slime sprite** does not exist, and neither do the rows.

---

## Build punch list

- [ ] Decide the Basin mouth's floor and passage, and whether it needs its own entrance map.
- [x] Draft the six layers and the arena with `tools/mapgen` (all six drafted 2026-10-23, each after
      Jeremy had looked over the one before: `Map385`-`Map409`, under the folders "FLOOR: 1" to
      "FLOOR: 6"). What is left is the polish, the populating and the playing, all his. Layer 3 is teal from
      its first map on (Jeremy: "remember that layer 3 will be teal, just that last big map will be where
      I transition").
- [ ] Cavern 2d (`Map390`) is Jeremy's now (the recipe's `HANDED_OVER`), so its door down is his to
      place: an event at (8,38), the foot of its drop shaft, with `<areaEvent:[3,1]>`, transferring to
      `Map393` (9,2) facing down (until then `map-atlas oneways 290` lists 393 -> 390). If the drop moves
      while he polishes, 3a's door needs its landing moved to match.
- [ ] Rest map at the end of layer 5 with save sigil and teleportal, plus its hub door.
- [ ] `Map331` needs its door onward: an event at (34,1), the top of the corridor between its wall
      lamps, with `<areaEvent:[3,1]>`, transferring to `Map385` (25,35) facing up (until then
      `map-atlas oneways 290` lists 385 -> 331).
- [ ] Enemy rows in band: Snake `153-155`, Cube `291-295` (and a sprite), Worm `414-415`,
      Lonewolf `422-425`, an orb-construct tier, plus Sloth herself.
- [ ] Darkness pass: `<ambient:[N]>` per layer (20/40/60/80/100/100 to start), torches, bioluminescent
      props, the drifting critters.
- [ ] Heartbeat BGS as an `.ogg`, and per-map volume keyed to depth.
- [ ] Assign or deliberately retire `Skills[2587]` and its neighbours.
