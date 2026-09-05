# map-atlas

A read-only CLI that describes the *shape* of a dungeon by reading `chef-adventure/data/` directly.
It exists because the RMMZ editor shows you one map at a time, and most of the questions worth asking
about a dungeon — is it a ring or a sprawl, can the player actually get there, is this a point of no
return — are questions about how the maps fit together.

```bash
bun tools/map-atlas.js <subcommand> [mapId]
```

Nothing is hand-maintained. There is no annotations file and there should never be one: a second
source of truth goes stale the moment an event moves. Everything below is derived from the shipped
JSON, and if the atlas says something is true, the data said it first.

---

## Subcommands

| Command | Answers |
|---|---|
| `dungeons` | What dungeon roots exist, and how big is each subtree |
| `atlas <rootId>` | What does this dungeon *look* like — rooms as boxes, doors as lines, one picture per floor |
| `links <rootId>` | Is it all one piece? What leads in from outside, what leads out, what is stranded |
| `gates <rootId>` | Which tool gates exist, and **which doors each one actually separates** |
| `oneways [rootId]` | Where are the points of no return — one-way transfers and scripted player jumps |
| `plan <mapId>` | What does this single room look like — walls, floor, and every event on it |
| `event <mapId> [eventId]` | What does that event actually *do* — page gates, triggers, dialogue, quest calls |

`oneways` with no id sweeps the whole project.

`plan` and `event` are companions: `plan` answers "what does this room look like and who is standing
in it", `event` answers "what happens when you walk up to that one". With no event id, `event` lists
every event on the map with its page gates, which is usually enough to find the one you want.

---

## How it knows what it knows

**Passability comes from the tileset, not from guessing.** `checkPassage` is a faithful port of
`Game_Map.checkPassage` — four tile layers read top-down, first tile with an opinion wins, `[*]` star
tiles abstain. Movement between two tiles is a two-sided agreement: leaving a tile going DOWN
requires the tile below to admit you from UP.

**Room placement comes from where the door sits.** A transfer event within four tiles of a map border
faces that way, so the atlas puts the destination in that direction. A transfer in the middle of a
room is a hole or a staircase and carries no compass reading, so it gets placed wherever there is
space. This is why the ground floor of the Pearl Salt Mines draws as an actual ring — that ring is
real, and the tool did not have to be told.

**JABS tags live in page comments, not in `event.note`.** This is the single easiest thing to get
wrong when writing your own script against this data. Looking for `<enemyId:31>` on `event.note`
finds nothing and makes a map full of gates look empty.

**Tool gates are invincible JABS enemies.** `@Spire` (31, shatter/crush), `@Suspicious Crack` (32,
explosive), `@Durable Post` (33, hookshot), `@Torch` (34, ignite). Only some of them block: a Spire
is `through: false` and stands in a doorway, while a Durable Post is `through: true` and is an anchor
you cross a gap *to*. The atlas keeps those apart, because treating an anchor as a wall would invent
gates that do not exist.

---

## What `gates` actually proves

This is the part worth understanding, because it is the difference between an observation and a fact.

"There are eight Spires in this room" is an observation. "These eight Spires are the only thing
between the north door and the south door" is a fact, and the tool establishes it by flooding the
map's walkable tiles twice from the first door — once with the gate tiles solid, once with them
removed — and comparing which other doors are reachable each time.

Three verdicts come out of that:

- **reachable without the tool** — the gate is decoration on this route.
- **SEPARATED by the gate** — removing the gate opens the route. This is a real lock.
- **unreachable even with the gate removed** — something else is in the way. Usually a gap crossed by
  a scripted jump, sometimes a ledge, occasionally a second obstacle. Cross-reference `oneways`.

---

## Points of no return

Two different mechanisms, both reported by `oneways`:

- **A one-way transfer** is a transfer whose mirror was never authored. `43 West Wing -> 46 Mansion
  Entrance` is the hole you fall through into the mines; there is no way back up, and the data says
  so without anyone recording it separately.
- **A scripted jump** is a `Set Movement Route` aimed at the player containing a `Jump` step with a
  non-zero offset. It never appears in the transfer graph at all, but it frequently moves the player
  somewhere they cannot walk back from — `54 Downward Spiral`'s "jump the gap" throws you eleven
  tiles down, and that is why the exit route reads as unreachable in the `gates` report.

Mirror detection always sweeps the whole project even when the report is scoped to one dungeon,
because the return trip out of a dungeon is authored on the map *outside* it. Scoping the search
rather than the report would make every exit look like a one-way.

---

## Limits

- It sees geometry, never art. A decorative impassable pillar and a load-bearing wall are the same
  wall. `[*]` star tiles abstain from passage entirely, so a tree canopy reads as open floor.
- Only page-1-and-beyond command lists are scanned as a flat set; it does not evaluate page
  conditions, so a transfer gated behind a switch counts the same as one that is always live.
- Region ids and terrain tags are not read yet.
- `atlas` room placement is a best effort. Rooms whose doors all point the same way get fanned
  sideways, and links between rooms that land far apart are listed rather than drawn.
- `event` narrates the command codes this project actually uses and prints anything else as a bare
  `[code]`. That is deliberate — an unrecognised command is exactly the one worth noticing, and
  silently dropping it would make an event look simpler than it is. Teach it a new code by adding a
  reader to `COMMAND_READERS`.
