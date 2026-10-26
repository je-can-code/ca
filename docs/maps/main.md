# Map Details

> NOTE: This is WIP; I am writing it for myself at this time so I can return back to this more seamlessly later.
>   This will likely be enhanced as a full guide as time goes on. If you found this without me personally directing
>   you to it, read at your own discretion!

Here you can dig into specific regions and learn more about them.

- [Raevula][1]
- [Nimbus][4] — the chapter 4 Pride dungeon, unbuilt. The build spec: gate staging, tileset, island
  chain, the split, the palace, Gloria's fight, and what has moved since it was designed.
- [The Subterranean][5] — the chapter 4 Sloth dungeon, rough pass drafted. The look, the snake-shaped
  descent, the two entrances, the heartbeat, and the rosters it needs. Much of it is still open.
- [The Frozen Fortress][6] — the chapter 5 finale, rough pass drafted. The entry hall, Jerald's tower,
  Rupert's basement and the courtyard, with every map's squares for the story events.
- [The Crystalline Ravine][7] — a chapter 4 optional area, rough pass drafted and installed. A crystal
  cavern of gaping holes crossed by Snake Rope, ending at the oldest structure anyone knows of.
- [The Seashell Shores][8] — a chapter 4 optional area, rough pass drafted and installed. A short way
  down from the Outer Cliffs' Hidey Hole, a beach whose tide follows the clock, and a cove that exists
  twice, once for each tide, with two sea caves.
- [The Desolate Graves][9] — a chapter 4 optional area, rough pass drafted and installed. A forest of
  graves north of the Crossroads laid out like a compass: a necropolis round the shrine at the heart, an
  arm of graves out to a great stone at each point, and underground, which the torch opens, a second
  compass of catacombs bigger than the surface and the smith's crypt, three maps deep.
- [The Windward Tunnels][10] — the Deluge Caverns, rough pass drafted and installed. Three ways in from
  the Deluge Valley braid into one long cave road west to the Pearl Salt Mines' Overmined Corner, then on
  north and colder into the Negative Peaks, with the wind blowing down its gust lanes the whole way.

## Progression

- [progression-bands][3] — where the player goes, in what order, against what enemy levels. A dated
  snapshot derived from the shipped data, with the per-map table beneath it. Read the Derivation
  section before quoting a number: harvestables and tool gimmicks carry levels too, and counting them
  distorts every band.

## Tooling

- [map-atlas][2] — a CLI that reads the shipped map data and describes the shape of a dungeon: room
  layout, connectivity, which tool gates actually block which routes, and where the points of no
  return are. Start with `bun tools/map-atlas.js dungeons`.


[1]: raevula

[2]: atlas.md

[3]: progression-bands.md

[4]: nimbus.md

[5]: subterranean.md

[6]: fortress.md

[7]: ravine.md

[8]: shores.md

[9]: graves.md

[10]: tunnels.md