# Map: The Crystalline Ravine

> Written during the conversation of 2026-10-25, not after it. Status tags follow
> [`story-canon.md`](../story-canon.md): `SHIPPED` is in the data now, `LOCKED` is decided and unbuilt,
> `PROPOSED` is floated, `OPEN` is undecided. Decisions are Jeremy's unless the tag says `PROPOSED`.

The Crystalline Ravine is one of chapter 4's optional areas: band 75-90, meant to stay "the softest landing"
of the four (see [progression-bands.md](progression-bands.md)), and reached from the Erocia Isthmus. Canon
only glimpses its entrance in chapter 3, "a Ch4 door", and records no purpose for it. Two docs have since given
it one:

- **Cerak's dig.** `cerak-002` "The Dig" ([the archaeologist](../quests/NE-raevula/archaeologist.md)) sends
  the duo here: "the oldest surviving structure anyone knows of (older than it has any right to be)". Cerak
  relocates to a dig camp ("zone doctrine: the Ravine is his"), and deep in the ravine the duo parse
  sigil-script that matches the Save Shrine's. Its script then points north, to the Desolate Graves.
- **The coral.** [harvest-nodes.md](../enemies/harvest-nodes.md) gives it `*Coral Growth`, `*Berry Bush` and
  `*Geode`; coral is otherwise the one ingredient family with nowhere to come from.

---

## What exists in the data today `SHIPPED`

| Thing | State on 2026-10-25 |
|---|---|
| `Map291` "DUNGEON: Crystalline Ravine" | the folder, under `Map118` "FIELD: Lakeside Road" beside the Erocia Isthmus and the Frozen Fortress |
| `Map330` "Entrance from Path" | Jeremy's own entrance, 40x25, tileset 14: a save platform at (10,14), the door home at (17,21), and a corridor running off the top edge (open at x 18-23 on row 0, x 19-23 on row 1) into nothing yet |
| `Map219` "Watery Path" (Erocia Isthmus) | the way in: a durable post pair at (22,36) and (29,32), then the transfer at (33,44) |

---

## Jeremy's picture `LOCKED (Jeremy, 2026-10-25)`

"The whole plan for the crystalline ravine was to be a crystalline cavern with massive gaping holes to
encourage you to use your snake rope a bunch. Get around, collect the loot, and also meet new enemies with new
SDPs and shit. Probably some named shit there too. It distinctly is supposed to be old- and magical. You pass by
it briefly through the erocian isthmus but I don't remember its purpose. Just wanted it (hence, optional).
Quests probably could take you there."

On the size: "Not a huge place in the sense that it has 500000 maps, but making the few maps it has enormous is
perfect. Lots of gaping holes and lots of beautiful crystals."

## No named gear here `LOCKED (Jeremy, 2026-10-25)`

"All named things should be achievable before end of chapter 3." The Ravine is chapter 4, so it holds no ⭐
weapon and no salvage; its rope-only islands are for ordinary treasure. Where the named pieces went instead is in
[acquisition.md](../acquisition.md#where-the-named-pieces-are-placed-decided-2026-10-25).

## The look `LOCKED (Jeremy, 2026-10-25)`

`Map330` is "the same tileset and even tiling+walls I intended to use" (Jeremy), so every cavern wears its
palette, read off the map rather than chosen:

| Part | Kind | jmz map editor label |
|---|---|---|
| Floor | A2 25, blue crystal | A2 ground 10 |
| Ceiling | A4 85, purple crystal | A4 ceiling 6 |
| Wall face | A4 93, purple crystal | A4 wall 14 |
| Holes | A2 29, the hole the sheet draws for that very floor, rimmed in the same blue crystal, impassable on every shape | A2 decoration 14 |

The chamber at the end is built rather than grown, so its look is different `PROPOSED (2026-10-25)`: white
stone walls whose faces end in columns (A4 112 and 120, "A4 ceiling 33" and "A4 wall 41"), floored with the
worked stone the Earthen Tomb (`Map172`) uses, A5 tile 1568. The crystal floor runs in from its door only as far
as row 26, where the worked stone begins.

**The holes stay black** for now, the way the sheet draws them. A parallax under that much chasm would have to
stay out of the player's way, and Jeremy doubts a crystal backdrop that manages it is easy to find: "given just
how much fucking chasm there is lol".

## The air `LOCKED (Jeremy, 2026-10-25)`

"I'm thinking as with before it should be dark-ish here with some glowing crystals and such." Every Ravine map,
`Map330` included, carries the same note:

```
<noToneChange>
<weather:glimmer>
<ambient:[80, #10103a]>
```

- **`<noToneChange>`**: no day or night underground, and J-Weather holds the weather at moderate.
- **`glimmer`**, a new preset (id 17) in `config.weather.json`: cyan motes drift through the dark, lavender sparks
  rise slowly out of the chasms, and a few glints wink on and off like light catching a facet. The rising sparks
  are what make that much hole read as deep without a parallax behind it.
- **`<ambient:[80, #10103a]>`**: 80% of the light gone, and the dark itself a deep navy rather than grey, so the
  blue floor and purple crystal stay in palette. For scale, the Intro cave sits at 85 and the Subterranean's first
  floor at 70.

**The glowing crystals are Jeremy's to place.** J-Lighting's own example of a crystal is
`<light:[3, #88ffcc, 70, pulse]>`, a crisp circle breathing in and out; recoloured for this place, a blue one is
`<light:[3, #8fd8ff, 70, pulse]>` and a violet one `<light:[3, #c79bff, 70, pulse]>`. Every light runs slightly
out of step with the rest, so a field of them shimmers rather than blinking together.

---

## The dungeon, map by map

**Drafted and installed** `SHIPPED (2026-10-25)`: four enormous caverns and the chamber, `Map445`-`Map449`, by
`tools/mapgen/dungeons/ravine.js`, under `Map291` after `Map330`. Jeremy, on seeing the draft: "That looks very
good actually."

Each cavern is mostly hole. The ground is broken into crystal islands, and the way on hops between them by
Snake Rope: every crossing is a durable post (enemy 33, shaped like `Map331`'s) on the tip of a three-wide jetty
either side, the two posts on one row or column, 4 or 5 tiles apart. The islands off the way on hold the loot,
each one rope away and reachable no other way. Every cavern keeps one island big enough for a named fight, and
crystal formations stand up out of the hole here and there. The recipe proves all of it before writing: every
door, post and loot square on ground, every rope over open hole and joining two places nothing joins on foot,
every square of ground reachable from the way in, and every loot island unreachable without the rope. Every hole
left is a real gap: a patch of hole that no three-by-three of hole fits inside, or one standing on its own under
25 squares, reads as noise rather than as a gaping hole, so it is filled in, as ground where ground borders it most
and as rock where wall does, and never so as to join two places that were apart. A rope's channel is never filled.

The doors are wired, in the area-event format, and every one keeps the player's heading.

| Map | What it is | Squares for Jeremy |
|---|---|---|
| `Map445` "Ravine 1", 90x64 | up from `Map330` through the bottom wall (x 43-47) onto a landing island; west over a land bridge to the **arena**; then roped north (18,34)-(18,29), east (28,21)-(33,21), and east again (59,16)-(64,16) to the last island, and out through the top wall (x 70-74). Three ropes on the way on | **arena** around (20,46), 577 squares of ground with the landing it shares a bridge with; **loot** at (70,51), roped east off the landing (56,51)-(61,51); **loot** on the north-west ledge at (11,7), roped (12,14)-(12,10); **loot** at (46,37), roped south off the middle island (46,29)-(46,33) |
| `Map446` "Ravine 2", 96x60 | up from Ravine 1 through the bottom wall (x 18-22); roped north (20,43)-(20,38), east (27,26)-(32,26) to the **arena**, and east again (65,30)-(70,30) to the last island, then out through the east wall (rows 26-30). Three ropes on the way on | **arena** around (48,30), 498 squares; **loot** at (50,8), roped north off the arena (50,17)-(50,13); **loot** at (48,52), roped south off the arena (48,43)-(48,48); **loot** at (84,10) in an alcove of the north-east wall, roped (84,21)-(84,16) |
| `Map447` "Ravine 3", 84x68 | in through the west wall (rows 38-42) onto a landing island; roped east (22,42)-(27,42) to the **arena**, north (50,34)-(50,29) to the last island, and out through the top wall (x 58-62) up a long neck. Two ropes on the way on | **arena** around (42,44), 406 squares; **loot** at (14,16), roped north off the landing (14,31)-(14,26); **loot** at (70,45), roped east off the arena (57,45)-(62,45); **loot** at (75,18), roped east off the last island (66,18)-(71,18) |
| `Map448` "Ravine 4", 90x66 | up from Ravine 3 through the bottom wall (x 42-46); the longest run of rope in the ravine: west (32,53)-(27,53), north (15,43)-(15,38), east (25,28)-(30,28) to the **arena**, north (44,17)-(44,13) to the last island, and out through the top wall (x 42-46). Four ropes on the way on | **arena** around (46,28), 486 squares; **loot** at (70,54), roped east off the landing (56,54)-(61,54); **loot** at (74,26), roped east off the arena (62,26)-(67,26); **loot** on the north-west ledge at (14,8), roped (14,18)-(14,13); **loot** at (66,9), roped east off the last island (54,9)-(59,9) |
| `Map449` "The Oldest Structure", 48x34 | up from Ravine 4 through the bottom wall (x 22-26), crystal underfoot to row 26; then the structure: a vestibule (x 16-32, rows 21-25), the hall (x 8-40, rows 7-19) with two columns either side of the nave (x 13-14 and 34-35, rows 9-12 and 14-17), a niche either side (x 3-7 and 41-45, rows 11-15), and the apse at its head (x 19-29, rows 3-6) | the apse's back wall (the face on rows 1-2) is left bare for Cerak's sigil-script; the rest of the room is his to dress |

Every cavern keeps `Map330`'s music, `_SM-InfectedWaters`, and wears [the air](#the-air-locked-jeremy-2026-10-25)'s
note. The caverns display as "Crystalline Ravine" and the chamber as "The Oldest Structure".

### The door on `Map330`

`Map330` is Jeremy's, so the recipe never writes it. Its half of the first door was added by hand on 2026-10-25, at
his go, together with the note above: event 3 "Transfer (Ravine 1)" at **(19,1)** with `<areaEvent:[5,1]>`, which
covers the whole of row 1 where his corridor opens (nothing reaches row 0 without crossing it), transferring to
**`Map445` (45,61) facing up**. Ravine 1's half lands the player back at (21,2) facing down. `map-atlas links 291`
reads the whole dungeon as one connected island of six maps.

---

## Open items

- **A parallax under the holes**, if a crystal backdrop that stays out of the player's way ever turns up: the holes
  would become void squares, which MZ draws as the parallax.
- **The Red Wand's resting place** `LOCKED (Jeremy, 2026-10-25)`: the torch tool is found in `Map449`, between two
  torches that never went out, under the sigil wall (see `cerak-002` in
  [the archaeologist](../quests/NE-raevula/archaeologist.md)). The pickup, the two torches and their light are
  Jeremy's to place; the apse (x 19-29, rows 3-6) is the natural spot.
- **Cerak's dig camp.** `cerak-002` needs a camp map. `Map330` has the room for it, or the chamber's vestibule.
- **When it opens.** The Watery Path's posts need only the Snake Rope, which arrives in chapter 3, so a brave
  player can walk in at 45 against a 75-90 band unless something gates the door to chapter 4.
- **Rosters.** New enemies with new SDPs, and named ones (Jeremy, 2026-10-25); the four arenas are sized for
  the named fights.
- **The loot.** Thirteen loot islands, all ordinary treasure.
- **The nodes.** `*Coral Growth`, `*Berry Bush`, `*Geode`.
- **The teleportal hub.** Jeremy liked "underwater becomes Crystalline Ravine" for one of `Map194`'s doors
  ([nimbus.md](nimbus.md)); nothing is decided.
- **The chamber's music.** It keeps the ravine's track for now.

---

## Build punch list

- [x] Install the five drafted maps (`Map445`-`Map449`) under `Map291`, and add `Map330`'s door.
- [x] The air: `glimmer`, the ambient dark and `<noToneChange>` on all six maps.
- [ ] Polish: crystals and their glow, plant life, ore, and the coral nodes.
- [ ] Enemies, the named fights, and the loot on the thirteen islands.
- [ ] Cerak's dig camp and the sigil-script in the apse (`cerak-002`).
- [ ] Decide when the door opens.
