# Map Details

> NOTE: This is WIP; I am writing it for myself at this time so I can return back to this more seamlessly later.
>   This will likely be enhanced as a full guide as time goes on. If you found this without me personally directing
>   you to it, read at your own discretion!

Here you can dig into specific regions and learn more about them.

- [Raevula][1]

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