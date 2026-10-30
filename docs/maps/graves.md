# Map: The Desolate Graves

> Written during the conversation of 2026-10-25, not after it. Status tags follow
> [`story-canon.md`](../story-canon.md): `SHIPPED` is in the data now, `LOCKED` is decided and unbuilt,
> `PROPOSED` is floated, `OPEN` is undecided. Decisions are Jeremy's unless the tag says `PROPOSED`.

The Desolate Graves are one of chapter 4's optional areas, band 90-105, the deepest of the four (see
[progression-bands.md](progression-bands.md)), north of the Crossroads. Canon records their purpose as `OPEN`
([story-canon.md](../story-canon.md)), but four other docs have since filled the place up:

- **Cerak's Four Great Stones.** `cerak-003` ([the archaeologist](../quests/NE-raevula/archaeologist.md)) sends
  the duo to touch four monuments "no living person built, beside a wreckage that isn't there". Touching the
  fourth wakes the Echoes, and the graves' massive shrine wakes as the original sigil site, the Mother-Sigil, with
  a unique Panel cache inside.
- **Gilbert's caravan.** `gilbert-003` "Where the Road Ends" ([the temporal merchant](../quests/NE-raevula/temporal-merchant.md))
  follows the old caravan road north into the Graves, where it ends in his caravan's graves.
- **The legendary rite.** The ghost of a dead master smith teaches it here, once the Viktor and Viskra line is
  maxed ([acquisition.md](../acquisition.md)).
- **Skye** once failed to reach "the beach and the graves shrine" ([story-canon.md](../story-canon.md)).

The nodes are `*Mushroom Cluster`, `*Faerie Flower` and `*Spice Patch` ([harvest-nodes.md](../enemies/harvest-nodes.md)).

---

## What exists in the data `SHIPPED`

| Thing | State on 2026-10-25 |
|---|---|
| `Map124` "FIELD: Desolate Graves" | the folder, under `Map333` "REGION: Central Erocia" |
| `Map329` "Entrance from Fork" ("Graves in my Backyard") | Jeremy's own entrance, 40x25, tileset 12: a forest clearing of stone paths and statues, a save platform at (34,6), the door home at (16,24), and the stone path running off the top edge at x 26-28 (rows 0-2) toward the South Graves |
| `Map14` Crossroads, event 36 "Transfer (Graves Entrance)" at (27,0) | `<areaEvent:[7,1]>` and no conditions: the Graves are open to anyone who walks north, level 1 included |
| The Magic Torch (enemy 34) and the Red Wand (`Items[123]`) | the torch gate and the tool that lights it; the wand is found on Cerak's dig in the Crystalline Ravine (`cerak-002`), decided 2026-10-25 |

---

## Jeremy's picture `LOCKED (Jeremy, 2026-10-25)`

"Literally you can go here at level 1 but obviously enemies there would take catastrophic shits on you."

On what the torch opens: "More likely it'll be "the torch gates the way in"..."to X" or "to Y". Not to the
graves as a whole. How is a torch gonna block what is effectively a forest with graves everywhere lmao"

On the first draft, which was a third of this size: "the graves should be bigger- probably more maps? It's not
just a little graveyard, it's The Desolate Graves!"

On the second, whose underground was still the first draft's three small maps: "the outside is better but now the
crypt and catacombs need to be a bit more expansive. At least as expansive as the entirety of the surface!"

## The compass `LOCKED (Jeremy, 2026-10-25)`, drafted at his go

The pitch, which Jeremy took ("it does"): a forest of graves laid out like a compass. The shrine stands at the
heart of a vast necropolis, with stone avenues out to the four points, and each point is an arm of the compass: a
field of graves, then its great stone in a clearing at the far end. Cerak's "go touch all four" walks the player
round the whole place. Gilbert's caravan graves lie in the West Graves, where the old road comes in and ends; the
dead master smith's crypt and the catacombs under the shrine are the X and Y the torch opens; and beside the north
stone one clearing is left empty for "the wreckage that isn't there".

```
                                [ North Stone ]
                                       |
                                [ North Graves ]
                                       |
[ West Stone ] - [ West Graves ] - [ The Heart: the shrine ] - [ East Graves ] - [ East Stone ]
                                       |   down: the Catacombs                   down: the Smith's Crypt
                        [ South Graves: the south stone ]
                                       |
                             [ Map329, his entrance ]
                                       |
                                 [ Crossroads ]
```

## Underground: a compass beneath the compass `PROPOSED (2026-10-25)`, drafted at his go

His word was the size, at least the whole surface; the shape is the proposal. The shrine's stair comes down into
a great hall under the shrine, with a tunnel out to each point, and each point is an arm of two maps: a gallery of
burial niches, ossuaries and side vaults, then a deep chamber at its far end, under the great stone above it. The
Lower Catacombs lie below the hall, down a stair in its north wall. The Smith's Crypt, which never joins the
catacombs, runs three maps deep from the mausoleum's door: the hall inside it, a burial gallery, and the burial
chamber where the ghost waits.

```
                                 [ North Deep ]
                                       |
                               [ North Catacombs ]   [ Lower Catacombs ]
                                       |            /
[ West Deep ] - [ West Catacombs ] - [ The great hall ] - [ East Catacombs ] - [ East Deep ]
                                       |
                               [ South Catacombs ]
                                       |
                                 [ South Deep ]

[ East Stone: the mausoleum ] - [ The Smith's Crypt ] - [ The Burial Gallery ] - [ The Burial Chamber ]
```

Underground is **43,878 squares to the surface's 40,900**, across thirteen maps to eight (the surface counted as
the eight drafted forest maps, leaving out Jeremy's `Map329`). Less of it is floor: **16,003 squares of floor to
the surface's 22,641 of ground**, since the catacombs are passages and rooms cut out of rock where the surface is
open field.

## The look `PROPOSED (2026-10-25)`

The forest is `Map329`'s own palette on tileset 12, read off the map:

| Part | Kind | jmz map editor label |
|---|---|---|
| Grass | A2 16 | A2 ground 1 |
| The stone paths and avenues | A2 18 | A2 ground 3 |
| Bare earth: the grave plots, the old road, the empty clearing | A2 17 | A2 ground 2 |
| The pond | A1 0 | A1 1 |
| The forest's canopy, black inside a leafy rim like the band above `Map329`'s trunks | A4 117 | A4 ceiling 38 |
| The trunks, hanging four rows the way `Map329`'s do | A4 125 | A4 wall 46 |
| The great stones, the shrine and the mausoleum: grey castle stone | A4 100 over A4 108 | A4 ceiling 21, A4 wall 29 |

The crypts are tileset 14: grey castle stone over a dark ceiling (A4 101, "A4 ceiling 22", sealed by terrain tag
1, and A4 109, "A4 wall 30"), hanging four rows the way the Earthen Tomb's (`Map172`) do, with that tomb's worked
stone underfoot (A5 1568). The worked stone is drawn as a stand-in autotile kind and swapped for the A5 tile
afterwards, the way the Ravine's oldest structure is.

**The graves are plots of bare earth, two squares by two, in blocks of rows** with an aisle of grass between them:
the place for headstones. **The fields carry no trees yet.** A stand of tree wall in the open reads as a pit, since
the canopy is black inside its rim, so the trees standing about the fields are left to Jeremy's polish.

`tools/mapgen/cave.js` learned two things for this: a `ceilingAt`, so grey stone can stand in a forest of tree
wall, and a `faceRows`, so the trunks hang four rows instead of a cave's two. Every earlier cave recipe (the
Subterranean, the Fortress, the Ravine and the Shores) was re-run and is byte-identical.

**Underground, the walls are lined with burial niches**, two squares by two, cut into the rock every six squares
along a wall wherever the rock has room for one. Every band of rock between two floors is at least five rows deep,
room for a wall face four rows tall and a row of ceiling over it, so no face ever runs straight into the floor
above. **The pillars and tombs are one row of top over four of face**, the great tombs included. A block with a
deeper top reads as a pit for the same reason a stand of trees does, the ceiling being black inside its rim.

---

## The area, map by map

**Drafted and installed** `SHIPPED (2026-10-25)` by `tools/mapgen/dungeons/graves.js`, redrawn the same day at
about three times the first draft's size, then its underground redrawn again to outgrow the surface. Floors, walls,
water, doorways and the four Magic Torches only. The doors are wired in the area-event format and every one keeps
the player's heading.

The forest's nine maps hang under `Map124` beside `Map329` in walking order. Underground, every map hangs under the
map it is entered from: the great hall under the Heart; the Lower Catacombs and the four galleries under the hall,
each deep chamber under its gallery; and the crypt's three maps in a chain under the East Stone. Each redraw kept
the ids already given out in their roles, so the first draft's upper catacombs (`Map463`) are now the great hall
and its Smith's Crypt (`Map462`) the hall inside the door, and gave the new maps the next free ids. Since
`install.js` never touches a tree entry it already has, the four new fields slot in between the old maps by
half-step orders (`457.5`, `458.5`, `459.5`, `460.5`), which MZ renumbers the first time it saves the tree.

| Map | What it is | Squares for Jeremy |
|---|---|---|
| `Map464` "South Graves", 90x60 | up from `Map329` through the bottom wall (x 44-46) into a field of graves: a path straight north through it to the Heart (top wall, x 44-46) and one across it (rows 26-28). Off the cross path to the east, a path through the trees (x 65-67) to **the south stone** in a clearing of its own | **the south stone**: x 76-78, rows 13-18, in its clearing around (77,17). **Grave blocks**: x 8-32 rows 9-24, x 50-59 rows 9-24, x 8-32 rows 31-49, x 50-59 rows 31-49 |
| `Map458` "The Heart", 110x80 | the necropolis: open ground edge to edge inside a fringe of forest. A paved plaza in the middle (x 40-68, rows 26-54) with **the shrine** in it, and an avenue five wide out to each point: north (x 52-56) to the North Graves, south to the South Graves, west (rows 38-42) to the West Graves, east to the East Graves. Sixteen blocks of graves fill the quarters between the avenues | **the shrine**: x 46-62, rows 27-38. **Its door**: event 5 at (53,37), in a recess at x 53-55, rows 37-38, down to the Catacombs, with **Magic Torches** at (51,39) and (57,39), events 6 and 7. **Grave blocks**, north-west: x 6-27 rows 7-16, x 31-49 rows 7-16, x 6-27 rows 21-33, x 31-37 rows 21-33; north-east: x 59-77 rows 7-16, x 81-102 rows 7-16, x 71-77 rows 21-33, x 81-102 rows 21-33; south-west: x 6-27 rows 47-59, x 31-37 rows 47-59, x 6-27 rows 64-73, x 31-49 rows 64-73; south-east: x 71-77 rows 47-59, x 81-102 rows 47-59, x 59-77 rows 64-73, x 81-102 rows 64-73. A pond around (65,61) |
| `Map465` "North Graves", 90x60 | up from the Heart through the bottom wall (x 44-46); a path winding north through a field of graves (west along rows 46-48, up x 25-27, east along rows 30-32, up x 63-65, west along rows 14-16) and out through the top wall (x 44-46) to the North Stone | **grave blocks**: x 8-23 rows 8-17, x 30-57 rows 18-27, x 68-83 rows 20-38, x 8-23 rows 22-43, x 32-59 rows 35-44, x 50-68 rows 49-55 |
| `Map459` "North Stone", 70x50 | up from the North Graves through the bottom wall (x 34-36) to **the north stone** in its clearing at the far end. A path west to a last clearing of graves, and one east to a long bare clearing: **the wreckage that isn't there**, empty and left to Jeremy. A dead end | **the north stone**: x 34-36, rows 10-15, in its clearing around (35,17). **The empty clearing**: bare earth at x 51-63, rows 36-40. **Grave block**: x 8-20, rows 32-41 |
| `Map466` "East Graves", 90x60 | in from the Heart through the west wall (rows 29-31); a path winding east through a field of graves (up x 21-23, east along rows 14-16, down x 61-63, east along rows 44-46, up x 75-77) and out through the east wall (rows 29-31) to the East Stone | **grave blocks**: x 8-20 rows 8-17, x 26-56 rows 19-28, x 66-84 rows 8-23, x 8-26 rows 34-49, x 30-57 rows 33-42, x 30-57 rows 47-53 |
| `Map460` "East Stone", 70x50 | in from the East Graves through the west wall (rows 24-26) to **the east stone** in its clearing at the far end. A path north to **the dead master smith's mausoleum**, and one south to a clearing of graves. A dead end | **the east stone**: x 58-60, rows 22-27, in its clearing around (56,25). **The mausoleum**: x 23-33, rows 4-12; **its door**: event 2 at (27,11), in a recess at x 27-29, rows 11-12, to the Smith's Crypt, with **Magic Torches** at (25,13) and (31,13), events 3 and 4. **Grave block**: x 7-22, rows 34-43 |
| `Map467` "West Graves", 90x60 | in from the Heart through the east wall (rows 29-31); a path winding west through a field of graves (up x 65-67, west along rows 14-16, down x 27-29) and out through the west wall (rows 29-31) to the West Stone. **Gilbert's caravan graves** lie to the south-west, where **the old caravan road**, bare earth, comes in off the bottom edge and ends at them | **the caravan's graves**: five plots in a row at x 10-13, 15-18, 20-23, 25-28 and 30-33, rows 44-46. **The old road**: x 19-21, rows 48-59, no door: where it leads is Jeremy's. **Grave blocks**: x 8-23 rows 8-23, x 34-61 rows 18-27, x 70-82 rows 8-23, x 36-60 rows 34-46, x 66-81 rows 36-51 |
| `Map461` "West Stone", 70x50 | in from the West Graves through the east wall (rows 24-26) to **the west stone** in its clearing at the far end, with clearings of graves north and south of the way. A dead end | **the west stone**: x 10-12, rows 22-27, in its clearing around (14,25). **Grave blocks**: x 43-58 rows 8-17, x 40-58 rows 33-42 |
| `Map462` "The Smith's Crypt", 48x36, tileset 14 | the crypt's entrance hall: in from the mausoleum through the bottom wall (x 22-24), up a passage into a hall (x 8-39, rows 9-26) between two colonnades (pillars at x 12-13, 17-18, 28-29 and 33-34, rows 12-16 and 20-24), niches round its walls, and on north through the top wall (x 22-24) to the Burial Gallery | **the hall**: x 8-39, rows 9-26 |
| `Map477` "The Burial Gallery", 70x50, tileset 14 | up from the entrance hall through the bottom wall (x 33-35) onto a gallery that switches back up through the rock, niches all along it: west along rows 40-42, up x 6-8, east along rows 26-28, up x 61-63, and west along rows 12-14 to the way on north (top wall, x 33-35). Off the middle reach, a hall of tombs above it and one below | **the halls of tombs**: x 6-27, rows 6-20, up a passage at x 15-17, with tombs at x 8-10, 12-14, 19-21 and 23-25, rows 11-15; and x 42-63, rows 34-47, down a passage at x 51-53, with tombs at x 44-46, 48-50, 55-57 and 59-61, rows 38-42 |
| `Map478` "The Burial Chamber", 50x40, tileset 14 | up from the Burial Gallery through the bottom wall (x 23-25) into the burial chamber (x 7-41, rows 7-29), niches round its walls, two pairs of pillars (x 15-16 and 32-33, rows 17-21 and 24-28) either side of the way up to the smith's tomb at its head. A dead end | **the smith's tomb**: x 20-28, rows 11-15. **Where the ghost waits** with the legendary rite: before it, around (24,17) |
| `Map463` "The Catacombs", 90x65, tileset 14 | **the great hall** under the shrine (x 14-74, rows 10-36), between two colonnades (pillars at x 18, 24, 30, 36, 51, 57, 63 and 69, rows 13-17 and 29-33), niches round its north, west and east walls. **The shrine's stair** comes down into a recess in the south wall (x 28-30, rows 37-38): event 1 at (28,38), landing at (29,37) facing up. **The stair down** to the Lower Catacombs stands in a recess in the north wall (x 58-60, rows 6-9): event 2 at (58,8). A tunnel out to each point, lined with niches: north (x 43-45, event 3 at (43,1)), east (rows 22-24, event 4 at (88,22)), west (rows 22-24, event 5 at (1,22)) and south (x 43-45, event 6 at (43,63)). Off the south tunnel, an ossuary either side | **the hall's middle**, around (44,23), where the four ways meet. **The ossuaries**: x 16-36 and 52-72, rows 47-58 |
| `Map468` "The Lower Catacombs", 60x40, tileset 14 | the level below the great hall: down its stair, in through the bottom wall (x 28-30), onto a gallery (rows 26-28, x 8-52) that splits round a long block of burial niches by two halls (x 8-10 and 50-52) and joins again above it (rows 12-14), then a passage north (x 28-30) to **the far chamber** (x 20-40, rows 1-6), under the heart of the shrine. A dead end | the far chamber is the natural home for the Mother-Sigil's Panel cache if it lives below the shrine; niches at x 14, 20, 38 and 44, rows 24-25 and 15-16 |
| `Map469` "North Catacombs", 80x55, tileset 14 | up from the great hall through the bottom wall (x 38-40) onto a long gallery (rows 44-46, x 6-73); from either end of it, up through an ossuary (x 4-20 and 59-75, rows 20-36, four pillars each) to a second gallery (rows 12-14), the way on north at its middle (top wall, x 38-40). Niches along both galleries and round the ossuaries | **side vaults**: x 25-33 and 46-54, rows 33-38 off the lower gallery and rows 20-25 off the upper |
| `Map470` "North Deep", 60x45, tileset 14 | up from the North Catacombs through the bottom wall (x 28-30) into a long nave (x 13-45, rows 14-36) under the north stone, between two colonnades (x 18-19 and 39-40, rows 16-20, 23-27 and 30-34), niches down its walls, with an apse at its head. A dead end | **the apse**: x 21-37, rows 8-13 |
| `Map471` "East Catacombs", 80x55, tileset 14 | in from the great hall through the west wall (rows 26-28); a gallery winding east the way the East Graves' path winds above it (up x 17-19, east along rows 8-10, down x 57-59, east along rows 43-45, up x 71-73) and out through the east wall (rows 26-28) to the East Deep. It runs round **a great ossuary** (x 25-50, rows 17-36, eight pillars) that opens off its north leg (x 36-38) and its east leg (rows 25-27), with **a lesser ossuary** below (x 22-52, rows 44-51). Niches along every leg | **side vaults**: x 4-14 rows 36-44, x 64-74 rows 7-17, and x 60-70 rows 51-53 |
| `Map472` "East Deep", 60x45, tileset 14 | in from the East Catacombs through the west wall (rows 21-23) to a chamber under the east stone built as a cross (x 13-50, rows 15-29, crossing x 24-39, rows 5-39), niches round its walls and four pillars round its crossing (x 27-28 and 35-36, rows 15-19 and 25-29). A dead end | **the crossing**: around (31,22) |
| `Map473` "West Catacombs", 80x55, tileset 14 | in from the great hall through the east wall (rows 26-28) onto a grid of galleries: three down (x 12-14, 38-40 and 64-66), two across the whole grid (rows 12-14 and 40-42), and the middle one (rows 26-28) only at its ends, broken by an ossuary either side of the centre (x 20-31 and 47-58, rows 20-34). So the way west goes through the ossuaries or round by the top and bottom galleries, out through the west wall (rows 26-28) to the West Deep. Niches along every gallery | **side vaults**: x 22-30 and 48-56, rows 4-6 above the top gallery and rows 48-51 below the bottom one |
| `Map474` "West Deep", 60x45, tileset 14 | in from the West Catacombs through the east wall (rows 21-23) to a square chamber under the west stone (x 8-46, rows 6-38), niches round its walls, with a great tomb at its heart and two rows of lesser tombs either side of the way to it (x 12-14, 19-21, 33-35 and 40-42, rows 9-13 and 30-34). A dead end | **the great tomb**: x 24-30, rows 20-24 |
| `Map475` "South Catacombs", 80x55, tileset 14 | down from the great hall through the top wall (x 38-40) into a ring of galleries (rows 8-10 and 44-46, x 10-69; down x 10-12 and 67-69), niches along its outer walls, round **a great ossuary** (x 20-59, rows 18-36, twelve pillars) that opens off the ring's west and east sides (rows 26-28); out through the bottom wall (x 38-40) to the South Deep | **side vaults**: x 2-7 and 72-77, rows 22-32, off the ring's sides |
| `Map476` "South Deep", 60x45, tileset 14 | down from the South Catacombs through the top wall (x 28-30) into a chamber under the south stone (x 8-51, rows 10-40), niches round its walls, where eight pillars stand in a ring round its middle. A dead end | **the ring's middle**: around (29,25) |

The forest keeps `Map329`'s note (none) and its music, `_FFL1-DoorToTheUnknown`. Every map underground has
`<noToneChange>` and `<ambient:[85]>` and borrows the Earthen Tomb's `_DKC1_DrowningInBrambles` as a placeholder.
The forest displays as "The Desolate Graves", the crypt's three maps as "The Smith's Crypt", and the catacombs'
ten as "The Catacombs".

### The torch gates

Each crypt door has a Magic Torch either side, cloned exactly from the Hidey Hole's (`Map113` events 1-4): an
invincible JABS target only the Red Wand can light, which turns its own self switch A on and shows its lit page.
Lit or not, a torch stays solid, and it stands beside the door rather than in it.

**Wired 2026-10-26.** Whichever torch is lit second finds its sibling lit and turns on its door's switch:

- **Switch 176 "graves: catacombs torches lit"** opens `Map458` event 5, the shrine's door to the Catacombs
  (torches `Map458` events 6 and 7).
- **Switch 177 "graves: crypt torches lit"** opens `Map460` event 2, the mausoleum's door to the Smith's Crypt
  (torches `Map460` events 3 and 4).

Each door's first page stands across its whole doorway (`<areaEvent:[3,1]>`, same as characters, no sprite) and
blocks it; its transfer is the second page, waiting on the switch. That first page is silent, so a line about why
the door won't open, or a sealed-door sprite, is Jeremy's to add.

Nothing below those two doors is gated: not the great hall's stair down or its four tunnels (`Map463` events 2-6),
and not the crypt's ways on (`Map462` event 2, `Map477` event 2). The torch opens each underground as a whole, at
its door.

### The door on `Map329`

**Wired 2026-10-26**, at Jeremy's go: an event at **(26,1)** with `<areaEvent:[3,1]>`, across the stone path where his
map opens to the north, transferring to **`Map464` (45,57) facing up**, the South Graves. The South Graves' half lands
the player back at (27,2) facing down, on that path. The recipe still leaves this half out; it lives in his map.

---

## Open items

- **The ghost** and the legendary rite, in the Burial Chamber (`Map478`).
- **The Mother-Sigil**: whether it wakes at the shrine above, in the great hall beneath it, or in the Lower
  Catacombs' far chamber, and the Echoes.
- **One-way ways up** at each arm's far end, if Jeremy wants them: a stair or shaft from each deep chamber up to
  its great stone, so a player at the end of an arm need not walk all the way back. Not built.
- **Rosters**, 90-105, and any named ones.
- **The headstones** on the plots, the trees about the fields, the statues.
- **The nodes**: `*Mushroom Cluster`, `*Faerie Flower`, `*Spice Patch`.
- **The wreckage that isn't there**: what the empty clearing holds, if anything.
- **The old road**: where it leads beyond the West Graves' south edge.
- **The teleportal hub.** Jeremy liked "voidal becomes the Desolate Graves" for one of `Map194`'s doors
  ([nimbus.md](nimbus.md)); nothing is decided.
- **The music**, and where the maps sit in the tree.

---

## Build punch list

- [x] Draft and install the Graves: the South Graves, the Heart, and the north, east and west arms; and underground,
  the great hall, the four arms of catacombs, the Lower Catacombs and the Smith's Crypt's three maps
  (`Map458`-`Map478`).
- [x] Place `Map329`'s door to the South Graves (above; wired 2026-10-26).
- [x] Wire both torch gates: a switch per door, and the door's page conditioned on it (switches 176 and 177,
  wired 2026-10-26).
- [ ] Polish: headstones on the plots, trees about the fields, statues, the shrine and the mausoleum's fronts, and
  the stairs, ossuaries and tombs underground.
- [ ] Enemies, the ghost and the rite, the Mother-Sigil and its cache.
- [x] Reword the torch gates in `cerak-003`, `gilbert-003` and `todo.md`: the Graves are open, and the torch opens
  only the two crypts.
