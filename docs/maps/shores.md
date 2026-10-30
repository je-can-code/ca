# Map: The Seashell Shores

> Written during the conversation of 2026-10-25, not after it. Status tags follow
> [`story-canon.md`](../story-canon.md): `SHIPPED` is in the data now, `LOCKED` is decided and unbuilt,
> `PROPOSED` is floated, `OPEN` is undecided. Decisions are Jeremy's unless the tag says `PROPOSED`.

The Seashell Shores are one of chapter 4's optional areas, band 80-95 (see
[progression-bands.md](progression-bands.md)), reached from the Outer Cliffs. Canon calls them "a *Disaster Of
Time* throwback" ([story-canon.md](../story-canon.md)): in J&R II, Jeremy fled Sabre through the sewers to a
cliffside, and down on the beach he found Robert ([prequel-jr2.md](../prequel-jr2.md)). Three other docs already
lean on the place:

- **Yelena's zone.** `yelena-003` "Surf & Turf" ([the innkeeper](../quests/NE-raevula/innkeeper.md)) wants
  seafood from the Shores, "some of it only present at certain tides (TIME-gated beach spawns)". Its gate is the
  torch.
- **The nodes.** [harvest-nodes.md](../enemies/harvest-nodes.md) gives the Shores `*Palm Tree`, `*Coral Growth`,
  `*Melon Vine`, `*Cacao Tree` and a beach salt deposit (salt commonly, sea salt rarely).
- **The fish.** [drop-sources.md](../enemies/drop-sources.md) names the Shores as the natural home for the upper
  rungs of the fish family, which has no members yet.

---

## What exists in the data `SHIPPED`

| Thing | State on 2026-10-25 |
|---|---|
| `Map113` "Inconspicuous Hole" ("Hidey Hole"), Outer Cliffs | Jeremy's: four Magic Torches (enemy 34) at (13,8), (17,8), (13,12) and (17,12), each setting only its own self switch A when the Red Wand lights it, and the "got wand?" chatter. The room ends in wall at x 21 |
| The Red Wand (`Items[123]`) | the torch tool; found on Cerak's dig in the Crystalline Ravine (`cerak-002`), decided 2026-10-25 |
| Tileset 17 "EX Outside Alt Beach" | set up long ago and never used before this draft. Its flags were already right: every sea and sandbar kind is impassable, both sands passable, so nothing was changed |

---

## Jeremy's picture `LOCKED (Jeremy, 2026-10-25)`

"The second exit was never really an "exit" per se… it was supposed to be a dungeon but in the old J&R2 game
that introduced time travel, Jeremy ran away from Sabre through some sewers and snuck out to what is effectively
the inverse of what leads the outer cliffs back to the crossroads. It goes down instead of up. Then there was a
small beach. Not at all dungeon-ey. However, the trip down can be short and sweet like before but when you get
down there I figured the Seashell Shores could be idk… more interesting? I don't really have any beach tilesets
as far as I know- some with sand but no beaches. To be honest, I'm not even sure how I could make the beach
interesting? Maybe a couple of caves? Perhaps it should just be a few maps and more of a place than a proper
dungeon."

On the J&R II beach itself: "I have no idea what the beach looked like then, only vaguely the descent and at the
bottom, a single-map width of beach and water and Rob was literally just standing there."

## The tide `PROPOSED (2026-10-25)`, drafted at Jeremy's go

What makes the Shores more than a beach is that the sea comes and goes with J-Time's clock, so it is a place you
come back to at different hours rather than one you clear once. Jeremy, on the pitch: "I am having a hard time
grasping it. Just go ahead and do what you're describing, I'll look at the maps and connect the dots from there."

- **Low tide comes twice a day, twelve hours apart**: J-Time's moontide (00:00-03:59) and afternoon
  (12:00-15:59). The day is six four-hour phases (`TimePhases`), and the first of them is already called moontide.
- **The beach is one set of maps.** The tide changes what stands on it: shellfish, crabs and Yelena's seafood
  at low tide, the bigger sea things at high tide. Every such spawn is an event page gated by
  `<timeOfDayPage:moontide>` or `<timeOfDayPage:afternoon>`, and none of them is drafted; they are Jeremy's.
- **Only the cove doubles.** At its far end the tide changes the ground itself, so the cove exists twice:
  `Map454` at high tide and `Map455` at low. The door from Shores 2 reads the clock and drops the player into
  whichever tide it is (see the tide door below). Once inside, the tide stays as found until the player leaves.
- **Out of a sea cave, the player always walks back onto the low-tide sand they walked in on**, never onto a
  shelf the sea has cut off: both caves lead back to `Map455` unconditionally.

## The look `PROPOSED (2026-10-25)`

| Part | Kind | jmz map editor label |
|---|---|---|
| Dry sand | A2 32, wavy | A2 ground 17 |
| Wet sand, where the tide comes and goes | A2 34, darker and grained; draws its own pale rim against the sea | A2 ground 19 |
| Sea, and the tide pools | A1 1, teal | A1 2 |
| Sandbars in the shallows | A1 0, sand under a teal waterline | A1 1 |
| Cliff top | A4 80, grass with a rim of grey stones | A4 ceiling 1 |
| Cliff face | A4 91, rock whose foot is sanded over | A4 wall 12 |

The sheet's own sand-topped cliffs (A4 83) looked exactly like the beach below them, so the cliffs here are
grass on top. The EX outside sheets draw the rims of their cliffs with see-through corners, made to sit over
ground, the way Jeremy's Negative Peaks maps keep their cliff edges on layer 1 (`Map303`). So every square of
cliff that touches open ground sits on layer 1 with the sand or sea drawn beneath it on layer 0; the rest of the
cliff stays on layer 0.

The way down wears the Hidey Hole's own orange rock (tileset 14: floor A2 16, ceiling A4 116, wall A4 124),
since it carries straight on from that cave. The sea caves wear the Deluge Caverns' grey rock and still water
(tileset 14: floor A2 24, ceiling A4 81, wall A4 89, pools A1 10).

The way down was first tried as switchback ledges on an open cliff face in the Outer Cliffs' own tileset 12, the
climb up `Map114` run downhill. That tileset's cliff tops are grass, and `Map114` builds its cliffs from hand-laid
A5 rock rather than autotiles, so a drawn cliff read as one big lawn. It became a winding stair inside the cliff
instead, which is also the closer throwback: J&R II's way down was a sewer.

---

## The area, map by map

**Drafted and installed** `SHIPPED (2026-10-25)` by `tools/mapgen/dungeons/shores.js`: the folder `Map450`
"FIELD: Seashell Shores", hung under `Map13` "REGION: Western Erocia" beside the Outer Cliffs (where it finally
sits in the tree is Jeremy's to move), and seven maps under it. Floors, walls, water and doorways only. The doors
are wired in the area-event format and every one keeps the player's heading.

| Map | What it is | Squares for Jeremy |
|---|---|---|
| `Map451` "The Way Down", 40x40, tileset 14 orange | in from the Hidey Hole through the west wall (rows 3-5), then switchbacks down the inside of the cliff: east along rows 3-5, down at x 31-33, west along rows 11-13, down at x 6-8, east along rows 19-21, down at x 31-33, a landing around (22,31), and out through the bottom wall (x 18-20) onto the beach | the landing around (22,31) is the one room with space for a fight; `<noToneChange>`, as a cave like the Hidey Hole |
| `Map452` "Shores 1", 40x23, tileset 17 | one screen of beach under the cliff, the J&R II nod: the way down comes out of a gully in the cliff (x 18-20), sand below, a band of wet sand, and the sea along the bottom, with spurs of cliff closing it either side. East through the spur (rows 8-10) to Shores 2 | **where Rob stood: (20,11)**, on the dry sand in the middle of the screen |
| `Map453` "Shores 2", 90x35, tileset 17 | the long beach: cliffs along the north with a headland jutting out around x 39, dry sand, the wet band around rows 20-25, and the sea below. West (rows 8-10) to Shores 1, east (rows 9-11) to the cove through the tide door | sandstone stacks on the sand around (20,13), (58,15) and (75,12) and out at sea around (31,29) and (66,31); tide pools in the wet band around (12,22), (47,22) and (71,22); sandbars around (24,31) and (52,30) |
| `Map454` "The Cove (high tide)", 60x40, tileset 17 | the sea right up to the cliffs. Only the dry strip at the door from Shores 2 (x 1-10, rows 8-14) stays above it, and the two sea-cave mouths are flooded | the strip is all there is to stand on; the rocks around (26,21), (46,24) and (12,30) stand in the sea; the high-tide spawns are Jeremy's |
| `Map455` "The Cove (low tide)", 60x40, tileset 17 | the same cove with the sea pulled back off a wide flat of wet sand (rows 8-28), the dry strip at the door, and the sea beyond. Two sea-cave mouths cut into the cliff foot: west at x 18-20 and east at x 40-42, rows 5-7 | tide pools around (14,19), (31,13), (37,22) and (46,15); rocks around (26,21), (46,24) and (12,30); the mouths' doors stand on row 5; the sixth Alchemy Page's chest at (50,15), added 2026-10-26 |
| `Map456` "Sea Cave 1", 40x30, tileset 14 grey | in from the cove's west mouth through the bottom wall (x 18-20); a first chamber around (19,19) with a pool, a passage west and up, and a back chamber around (12,8) with its own pool | the back chamber is a dead end, for loot; `<noToneChange>` and `<ambient:[70]>` |
| `Map457` "Sea Cave 2", 40x30, tileset 14 grey | in from the cove's east mouth through the bottom wall (x 18-20) into a flooded cavern: a big pool around (20,13) ringed by a rim to walk around it, and a side chamber around (32,5) off the far rim | the side chamber is a dead end, for loot; `<noToneChange>` and `<ambient:[70]>` |

The beach maps and the cove are outdoors and carry no note, so the day-night tone is what tells the player the
hour, and with it the tide. Their music is the Outer Cliffs' `_Ys9_DesertAfterTears` and the caves' is the Hidey
Hole's `_LoH_FeelingsOfHometownishness`, both placeholders.

### The tide door

`Map453` event 2 "Transfer (The Cove, by the tide)" at (88,9) is one event with three pages, each carrying its
own `<areaEvent:[1,3]>`:

| Page | Condition | Leads to |
|---|---|---|
| 0 | none | `Map454`, the cove at high tide, (2,11) facing right |
| 1 | `<timeOfDayPage:moontide>` | `Map455`, the cove at low tide, (2,11) facing right |
| 2 | `<timeOfDayPage:afternoon>` | `Map455`, the cove at low tide, (2,11) facing right |

MZ runs the last page whose conditions hold, so whenever the tide is out, a low-tide page wins. Both coves lead
back to Shores 2 at (87,10) facing left, and both land the player on the same dry square, which is why the strip
at the door never floods.

### The door on `Map113`

**Wired 2026-10-26**, at Jeremy's go. Whichever Magic Torch is lit last finds the other three lit and turns on
**switch 175 "hidey hole: torches lit"**. The door is a hole in the east wall at **(21,10)**, built like the bomb
walls (`Map111` event 26): the wall tiles stay, and once the switch is on, the event shows `$o_wall-hole` and walking
into it transfers to **`Map451` (2,4) facing right**. That's one square in the middle of the east wall, not the
three-tall opening at (21,9) first written here, so the way down's landing at (20,10) sits right in front of it.

---

## Open items

- **The tide's spawns.** Yelena's seafood, shellfish and crabs at low tide; the bigger sea things at high tide.
  Each one is an event page gated by `<timeOfDayPage>`.
- **Rosters**, 80-95, and the fish family's upper rungs.
- **The nodes.** `*Palm Tree`, `*Coral Growth`, `*Melon Vine`, `*Cacao Tree`, the beach salt deposit.
- **The cave mouths' look.** Both are plain recesses in the cliff today; a cave-mouth tile from the B or C sheet
  would sell them.
- **What marks Rob's spot**, if anything.
- **Where the folder sits in the tree**, and the music.

---

## Build punch list

- [x] Draft and install the way down, the beach, both coves and both sea caves (`Map450`-`Map457`).
- [x] Wire the Hidey Hole: the all-torches switch, the opening, and the door (above; switch 175, wired
  2026-10-26).
- [ ] Polish: rocks, shells, driftwood, palms, the cave mouths.
- [ ] Enemies and the tide spawns, as `<timeOfDayPage>` pages.
- [ ] `yelena-003` "Surf & Turf" against the tide.
