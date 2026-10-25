# `tools/mapgen`

Drafts whole dungeons as map JSON: terrain, structures, and the teleport events that wire them
together. It exists for the part of mapping that is tedious rather than creative — laying out a
dozen islands, keeping every doorway paired with a landing square that is actually walkable, and
proving nothing is stranded — so that what arrives in the editor is a skeleton worth decorating
instead of a blank grid.

It does **not** place enemies, treasure, harvest nodes, switches, or dialogue. Those are the parts
worth doing by hand.

## Running it

```bash
bun tools/mapgen/dungeons/nimbus.js             # paint the recipe into tools/mapgen/.staging/
bun tools/mapgen/validate.js --staged 363 364   # prove it is walkable before believing it
bun tools/mapgen/plan.js --staged 363 372       # read a map as a text floor plan
bun tools/mapgen/install.js                     # move staging into data/ and register in MapInfos
bun tools/mapgen/validate.js 363 364            # after installing, check the real thing
bun tools/mapgen/snapshot.js 83 --out room.png  # see it the way the game draws it
```

A text plan answers "can you walk there". `snapshot.js` answers "does it look right", which is the
only question that matters once the map is somebody's art — it composites the real tileset sheets
through the quadrant tables copied out of `js/rmmz_core.js`, so a wall corner that is wrong in the
PNG is wrong in the game too.

`validate.js` and `plan.js` read `data/` by default and staging only with `--staged`. That is the
right way round once a dungeon is installed, because events get hand-added afterwards and a tool
still reading the generator's output would report a fully-wired room as having no events at all.

Staging is gitignored, so a bad run costs a re-run rather than a `git checkout` over real data. It holds
one manifest, `_built.json`, written by whichever recipe ran last, so run a dungeon's recipe right before
installing it.
`install.js` skips maps that are already installed and still match their recipe, and **throws if an
installed map has drifted from what the recipe produces** — because drift means somebody hand-edited
it, and hand-edits outrank the generator. Registering in `MapInfos.json` is an append of only the
ids that are missing, and the result is parsed before it is written.

After installing, the project's own `bun tools/map-atlas.js links <rootId>` is the second opinion:
it reads the shipped data rather than the generator's intentions, and its "connected islands" count
is the honest answer to whether the dungeon holds together.

## The files

| File | What it is |
|---|---|
| `paths.js` | Every path, resolved from the file rather than the shell's cwd |
| `autotile.js` | The neighbour-mask → shape table, and the lookup that applies it |
| `learn-tables.js` | Re-derives that table from the shipped maps; run it after adding tilesets |
| `terrain.js` | The shape vocabulary (`blob`, `span`, `box`, `ring`) and the map-file writer |
| `cave.js` | Caves: a carved grid becomes floor, two-row wall faces and ceiling, shaped by the jmz map editor's rules, with the shadows MZ's editor casts beside walls; a void square holds nothing, which MZ treats as solid; and the tidy pass that sands blob noise off a carving |
| `doors.js` | The doors between drafted maps in Jeremy's area-event format, and the proof that every link keeps the player's heading; shared by the recipes |
| `dungeons/*.js` | One recipe per dungeon: sizes, painting, and the link table |
| `validate.js` | `Game_Map#checkPassage` reproduced, plus a flood fill and a landing-square check |
| `plan.js` | Text floor plans, for staged maps the atlas cannot see yet |
| `snapshot.js` | Renders a map to PNG using the engine's own autotile tables, events included |
| `install.js` | The only file here that writes to `data/` |

## Three things that cost real time to work out

**Empty sky is impassable for free.** Tile id `0` carries the star flag, and `checkPassage` skips
star tiles and then falls out of its loop returning false. So a square with nothing painted on any
layer blocks the player, shows the parallax through, and needs no wall. Cloud islands are built out
of that: the void *is* the collision, and there is no invisible-wall layer to maintain.

**The autotile shape table is measured, not remembered.** An A2 ground tile's id is its kind's base
plus a shape in 0..47 chosen by which neighbours share its kind, and writing that table from memory
is how a generator produces coastlines that are wrong in a way nobody can name. `learn-tables.js`
derives it from every shipped map instead — 216,000 worked examples — and lands on 98% agreement,
where the missing 2% is almost entirely shape 0 appearing at squares somebody shift-clicked by hand.
Canonicalising the neighbourhood first (a corner only counts when both its edges are joined) reduces
256 raw states to exactly 47, and all 47 appear in the data, so nothing is guessed.

**A transfer is two halves and both can be wrong.** The doorway can sit on sky and the landing
square can sit inside a wall, and neither is visible in the editor's tile view — the first playtest
is where you find out. A recipe's link table names both doorways and the facing the player arrives
with, the generator derives each landing one step inward from that facing (so a player-touch event
never re-fires on arrival), and `validate.js` follows every `201` command to the square it actually
lands on, including landings on maps that shipped years ago.

## Caves

A cave is carved rather than painted: `dungeons/subterranean.js` digs floor out of solid rock and
`cave.js` hangs the wall faces, fills the ceiling and casts the shadows. Two of the tools above cannot
judge one. **`validate.js` reproduces vanilla passability, and CA's cave ceilings are walkable in
vanilla**, sealed only by terrain tag 1 through J-RegionEffects, so its flood pours into the rock; the
cave recipe proves its own floors connected before writing, and after installing,
`bun tools/map-atlas.js plan <id>` reads the real rule. And **`snapshot.js` does not draw the shadow
layer**, so a render shows none of the shadows that are in the data.

A castle is carved the same way, in rectangles: `dungeons/fortress.js`. A dig can name its own floor (the
palette's `floorAt` in `cave.js`), and a raised floor such as a balcony is a floor exactly two rows of stone
above the one below it, since those two rows become its wall face. The Fortress's tileset 21 follows the EX
rows' flag convention, whose ceilings carry no terrain tag and are sealed by their edge shapes alone.

## Doors

**Doors are area events, in Jeremy's format.** The transfer event stands on the top-left square of the
opening, one in from the map's edge, and an `<areaEvent:[W,H]>` page comment (J-Pixelistics) leads its
page, stretching it across the whole opening: `[1,3]` for a door in a left or right edge, `[3,1]` for
one in the top or bottom. A single event in the middle of a three-wide door makes the player find its
exact centre, so he converted every Nimbus door to this by hand. `doors.js` writes doors this way for the
Subterranean and Fortress recipes (each side of a link has `at` and `span`, landing in the middle of the
opening one step in); copy their links rather than `nimbus.js`'s.

**A door keeps the player's heading.** Walking out of one side of a map lands on the opposite side of the
next, still facing the way they walked: out the right, in on the left facing right; down out of the
bottom, in at the top facing down. Arriving turned around means that holding the key they walked out
with carries them straight back through the door, over and over, which is Jeremy's "one major peeve"
about maps. So the two sides of every link arrive facing opposite ways, and `doors.js` refuses to write one
that does not. Some of `nimbus.js`'s links turn the player sideways (Sunlit
Terrace's doors to The Aerie and the Gilded Causeway); do not copy those either.

## The map tree

`install.js` registers each map under its manifest entry's `parentId`, so a recipe decides where a map
sits in the tree, and the tree is never meant to be one flat list. Jeremy's dungeons group their maps
under 0x0 folder maps (the Forlorn Basin's "FLOOR: 1" to "FLOOR: 5", the mines' "FLOOR: Ground Level"),
and a side map hangs under the map it branches from. The Subterranean and Fortress recipes give a spec a
`parent` for that, and the Fortress gives one an `order` when a map drafted early has to sort after maps
drafted later.

## Adding a dungeon

Copy `dungeons/nimbus.js`. It is two tables and a loop:

- `LINKS` — every doorway pair. `ev` is where the transfer event sits; `dir` is the way the player
  faces on arrival, which always points *into* the map. Mark a side `silent: true` when the other
  map owns that transfer already (the Nimbus ascent belongs to the Room of Sacrifice's ritual).
- `SPECS` — one entry per map: size, parallax, and a `paint` function that draws with the shape
  vocabulary. Blobs take a seed, so a re-run reproduces the same coastline exactly.

The generator then prunes every walkable square the entrance cannot reach. Islands grown from noise
produce stray shelves behind walls as a matter of course, and ground the player can never stand on
is a lie the map tells — turning it back into sky is both honest and better-looking, because the
cloud edges then close around the real shoreline.
