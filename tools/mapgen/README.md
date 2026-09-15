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

Staging is gitignored, so a bad run costs a re-run rather than a `git checkout` over real data.
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
