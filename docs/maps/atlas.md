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
| `atlas <mapId>` | What does this dungeon *look* like — named boxes joined by their doors, one picture per floor. Naming any room of a dungeon draws the whole dungeon |
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

**Passability comes from the tileset and CA's own wall rules, not from guessing.** `checkPassage` is a
faithful port of `Game_Map.checkPassage` as J-RegionEffects overwrites it — four tile layers read
top-down, first tile with an opinion wins, `[*]` star tiles abstain, and a tile carrying a denied terrain
tag is a wall whatever its direction bits say. Stepping onto a denied region is refused and an allowed
one is waved through. The denied tags and regions are read from the plugin's own parameters in
`js/plugins.js`, plus any map's `<denyRegions>` / `<allowRegions>` note tags, so the atlas walls off what
the game does: CA seals its voids and ceilings with terrain tag 1, which plain tileset passability calls
floor. Movement between two tiles is a two-sided agreement: leaving a tile going DOWN requires the tile
below to admit you from UP.

**Room placement comes from where each door sits, read from both of its ends.** A door near a map
border (within four tiles, or a fifth of the map's size) leads that way; one out in the middle of a room
is a hole, a stairwell or a portal and carries no compass reading. Both ends count: leaving through one
room's east wall and arriving through the next room's south wall puts the next room to the north-east,
because that is the trip the player takes. When the cell a room wants is taken, it shuffles one cell
sideways while keeping its bearing, and only when that is taken too does a whole new column or row
open, so a room that was east of another is never drawn west of it. This is why the ground floor of the
Pearl Salt Mines draws as an actual ring — that ring is real, and the tool did not have to be told.

**Lines are routed, not just drawn.** Each door's line is found by a cheapest-path search through the
gaps between boxes: length costs, a turn costs more, and crossing another line costs a lot, so lines run
straight where they can and never pass through a room. Lines leaving one side of a box are spread along
it in the order of the rooms they lead to, so they never cross on the way out.

**Locks come from walking the dungeon the way a player could.** `atlas` starts at the entrance, floods
every room it can reach on foot, sets off every event it can get to, follows their transfers and
scripted jumps, and flips the switches they flip; then it walks again with those switches on, until a
walk opens nothing new. It does that several times over, cheapest first: no tools and nothing flipped,
then each tool, then plain switches, then puzzles. Whatever a walk reaches first is labelled with
exactly what that walk carried, and a line is tagged only where a requirement first appears, so a gate is
marked once, at the gate, not on every line past it. The whole dungeon is walked as one, even when it is
drawn a floor at a time, because a switch on one floor can open a door on another.

- **A plain switch** is one an event flips outright: an orb you touch, a lever, a teleportal switch.
- **A puzzle** is anything an event only flips after checking something you arranged: a boulder's
  position, a kill count, a script's answer. Branches on variables, positions and scripts all count.
- **A switch something can also turn off** stands either way, so an obstacle that depends on it only
  counts as blocking when it is certainly there. That is how a boss room's lock that comes down after
  the fight reads as passable.
- **Ground already reached stays reached.** Beating the Syrup flips the switch that brings the exit
  vine in, and the same switch reroutes the way into the boss room; the player never had to come back
  in, because they are standing there.
- **The Snake Rope reaches 8 tiles**, straight along a row or a column, and a post already pulled to is
  somewhere to fire it again from. 8 is the widest crossing a shipped dungeon asks for (Erocia Isthmus;
  the Mines' NW Corner needs 7). Change `ROPE_REACH` if a new crossing goes wider.

**JABS tags live in page comments, not in `event.note`.** This is the single easiest thing to get
wrong when writing your own script against this data. Looking for `<enemyId:31>` on `event.note`
finds nothing and makes a map full of gates look empty.

**Tool gates are invincible JABS enemies.** `@Spire` (31, shatter/crush), `@Suspicious Crack` (32,
explosive), `@Durable Post` (33, hookshot), `@Torch` (34, ignite). Only some of them block: a Spire
is `through: false` and stands in a doorway, while a Durable Post is `through: true` and is an anchor
you cross a gap *to*. The atlas keeps those apart, because treating an anchor as a wall would invent
gates that do not exist.

**Which tool clears which gate is read from the database too.** A gate's `<strictElements>` name the
elements that can hurt it and a post names its `<gapCloseTarget>`; the tool items (`<jabsTool>`) cast
the skills dealing those elements or carrying that key. Each tool is known by the last word of its
item's name, so the tags read `ukelele` (Spires), `bomb` (Cracks, and Spires too), `rope` (posts) and
`wand` (Torches), and a renamed tool renames its tag.

---

## Reading an `atlas` picture

- **A square box** is on the main route: the shortest way from the entrance to the deepest room, the
  one the most doors away, which in a dungeon is the boss or the throne. The entrance is the first room
  in the map tree with a way in from outside.
- **A rounded box** is off the main route: a side room or a dead end. A rounded box on the end of a
  **dashed line** is a map outside the picture: the room before the dungeon, a teleportal, or a room on
  another floor.
- **`>` on a line** marks a one-way door. The arrowhead points into the room it drops you in.
- **A tag on a line** says what it takes to get through there, beyond what it took to reach the room
  it leads out of:
  - `[ukelele]`, `[bomb]`, `[rope]`, `[wand]` — bring that tool.
  - `[switch]` — flip a switch somewhere in the dungeon first.
  - `[puzzle]` — solve something in the dungeon first.
  - `[locked]` — needs progress made somewhere else: a story switch, or a tool from a later dungeon
    that makes something appear (the Mines' Dangerous Oneway posts only exist once you have the rope).
  - `[blocked]` — no walk gets through at all, even carrying everything with every switch either way.
    On a map being built that is usually the missing piece (the Long Span before its posts); on a
    finished one it is a real fault, like Extended Tunnel's "teleport north" sitting inside solid wall.
  Parts join with `+`, so `[bomb+puzzle]` needs both.
- **`(ukelele)`, `(rope)`, `(puzzle)`, …** inside a box are what the room asks for: the tool made for
  each kind of gate standing in it, and `puzzle` when solving something there flips a switch. A room tag
  does not have to be on the way anywhere; a Spire guarding a chest counts.
- **One line joins a pair of rooms**, however many doorways connect them. `links` lists every doorway.
- A line meets a box on the wall its door really stands in, and roughly where along that wall.

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
- `links`, `gates` and `oneways` scan every page's commands as a flat set and do not evaluate page
  conditions, so to them a transfer gated behind a switch counts the same as one that is always live.
  `atlas` is the one that plays the conditions out.
- `atlas`'s walk follows what events do through switches, self switches, transfers, scripted jumps,
  common events and `$gameSwitches.setValue` in scripts. It cannot see a switch flipped by a plugin
  command, an event erased with Erase Event, or a mechanic that lives entirely in plugin code. A lock
  that depends on one of those reads as `[locked]` or `[blocked]`, which is the cue to look.
- `atlas` is honest, not magic. A loop whose two halves add up differently on equal squares (the intro
  cave) gets one long line closing it, a big floor like the Mines basement draws wide and busy, and lines
  cross where there is no way around. Raevula's building doors stand in the middle of its streets and
  carry no compass, so the town draws busy; the picture is meant for dungeons.
- `event` narrates the command codes this project actually uses and prints anything else as a bare
  `[code]`. That is deliberate — an unrecognised command is exactly the one worth noticing, and
  silently dropping it would make an event look simpler than it is. Teach it a new code by adding a
  reader to `COMMAND_READERS`.
