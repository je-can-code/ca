# Map: The Windward Tunnels

> Written during the conversation of 2026-10-25, not after it. Status tags follow
> [`story-canon.md`](../story-canon.md): `SHIPPED` is in the data now, `LOCKED` is decided and unbuilt,
> `PROPOSED` is floated, `OPEN` is undecided. Decisions are Jeremy's unless the tag says `PROPOSED`.

The Windward Tunnels are the cave road under the Deluge Valley, in the map tree as `Map328` "DUNGEON: Deluge
Caverns". Canon names them in its chapter 4 sketch, "the **Deluge Plains** and **Windward Tunnels** (cavern route
from Deluge to the Pearlsalt Mines)" ([story-canon.md](../story-canon.md)), and lists them with no band
([progression-bands.md](progression-bands.md)); the draft takes the valley's 85-100.

---

## What exists in the data `SHIPPED`

| Thing | State on 2026-10-25 |
|---|---|
| `Map325` "Cavern North Access", `Map326` "Cavern West Access", `Map327` "Cavern East Access" | Jeremy's three access caves, 40x25 each on tileset 14, no events. Each has a nub at its foot for the valley's door (325 at x 12, 326 and 327 at x 21, rows 20-21) and one far opening into the dark: 326 east (x 39, rows 9-16), 327 west (x 0, rows 7-13), 325 down its bottom edge (x 26-34) |
| `Map232` "Far Eastern Valley" | event 3 "Transfer (TODO)" at (8,28), into `Map327` (21,20). It is the only way in today, and one-way: 327 has no door back |
| `Map229` "Western Valley", `Map233` "Northern Valley" | each already has a cave mouth drawn into its cliff (B tiles 375 over 383): 229 at (10,23)-(10,24), 233 at (18,1)-(18,2). Neither has a door yet |
| `Map148` "Overmined Corner", Pearl Salt Mines | a mining tunnel running north to a dead end (x 11-16), timber-framed wall on rows 1-2, behind the mines' ukelele gates |
| `Map302` "Where It Gets Colder", Negative Peaks | the Peaks' first ice cave, tileset 19, its walls drawn on layer 1 over a floor on layer 0 |

---

## Jeremy's picture `LOCKED (Jeremy, 2026-10-25)`

"There is a cave that is found in the Deluge Valley. It was going to have three entrances from around the massive
maps of the valley and all funnel the player into the pearl salt mines again- into one of the areas that is
blocked off sorta till you have the ukelele."

On where it breaks out, Overmined Corner: "That's actually precisely where I expected it to lead. And then it keeps
going past there to maybe… idk, the negative peaks caves? So it's logical that there is wind blowing lol."

On its length: "Also this cave tunnel needs to be rather long. If you look at the surface maps and try to calculate
how long it would be I'm sure a few maps would be a sad amount lol."

## How long `LOCKED (2026-10-25)`

The surface walks were measured door to door through the shipped maps, as the straight distance between each map's
doors with walls ignored, so they understate the real walk a little:

- **The Western Valley to Overmined Corner: about 720 squares across 19 maps** (the valley, the Derelict Fork,
  Lakeside Road, the Crossroads, Riverside Stroll, and the mines' basement).
- **Overmined Corner to `Map302`: about 620 squares across 17 maps**, through the mines, the Forest of Dreams'
  edge, Raevula's heartbeat and the Peaks' foothills, not counting the teleportal shortcut.

The tunnels match them. The recipe counts every map's shortest walk from the square a door lands on to the next door:

| Stretch | Through the tunnels | Overland |
|---|---|---|
| West Access to Overmined Corner | 735 | 720 |
| North Access to Overmined Corner | 715 | |
| East Access to Overmined Corner | 731 | |
| Overmined Corner to `Map302` | 698 | 620 |

## The gust lanes `LOCKED (Jeremy, 2026-10-25)`

Jeremy wanted a light gimmick: "it doesn't have to be thrilling, but it should be… mildly engaging somehow. Perhaps
some gimmick that can… accelerate movement while there? Make fights a bit sillier lol." And on the gust lanes:
"Lmao I was just about to suggest basically the same thing! Region states finally getting an interesting use. And
probably more like 400 amp on knockback to really send you flying."

- **Region 30 is painted along the way-on of every tunnel map**: the long passages, the braids, and the chambers on
  them. It is used nowhere else, and it is in neither of J-RegionEffects' global lists (region 10 is the one that is
  denied), so it changes nothing about who can stand where.
- **Every tunnel's note carries `<regionAddState:[30, 182]>`**: anyone standing on region 30 gets state 182
  "Windswept" (`<stateDuration:90>`, `<speedBoost:60>`, `<knockbackAmp:400>`, icon 917). **That means enemies too,
  which is the point**: a fight in the wind sends everyone flying.
- **The calm squares are left unpainted on purpose**: the dead-end pockets, the two rest chambers (the Lee in
  Windward 3 and the Hollow in Northward 3, each up a calm spur), and the two breakthroughs into Jeremy's maps (the
  last stretch down into Overmined Corner, and the way out into `Map302`).

## The air `PROPOSED (2026-10-25)`

Every tunnel's note:

```
<noToneChange>
<weather:draft>
<ambient:[75]>
<regionAddState:[30, 182]>
```

- **`draft`**, a new preset (id 18) in `config.weather.json`: dust and grit streaming sideways on the wind
  (`drift` at a gale's speed), with a thin dusty haze dragged along under them (the `fog` preset's `crawl`, sped
  up), and the wind sounds `maple` uses (Wind1, then Wind4 at heavy). `<noToneChange>` holds it at moderate, so
  underground the wind never drops.
- **`<ambient:[75]>`**: dark-ish, 75% of the light gone. The lights are Jeremy's to place.
- **No music**: every tunnel autoplays silence, which stops the valley's music at the first tunnel, so the wind is
  the sound down here.

## The look `PROPOSED (2026-10-25)`

| Part | Grey cave (tileset 14) | Ice (tileset 19) |
|---|---|---|
| Floor | A2 24, "A2 ground 9" | A2 32, "A2 ground 17" |
| Ceiling | A4 81, "A4 ceiling 2" | A4 80, "A4 ceiling 1" |
| Wall | A4 89, "A4 wall 10", two rows tall | A4 88, "A4 wall 9", three rows tall |

The grey is the access caves' own, read off `Map325`-`Map327`; the ice is `Map302`'s. The tunnels stay grey until the
last two maps of the Peaks leg, where the ice begins, so the cold arrives before the Peaks do.

---

## The tunnels, map by map

**Drafted and installed** `SHIPPED (2026-10-25)` by `tools/mapgen/dungeons/tunnels.js`: fourteen maps under
`Map328`, after the three access caves. Floors, walls, doorways and gust lanes only. Every passage is five or six
wide, so a fight has room to move, with a few pinches about three wide. The doors are wired in the area-event format
and every one keeps the player's heading.

| Map | What it is | Squares for Jeremy |
|---|---|---|
| `Map479` "Feeder West", 60x36 | in from the West Access through the west wall (rows 16-18), winding east, out through the east wall (rows 19-21) to the Confluence | a chamber around (41,22); a dead-end pocket around (24,3), off the passage at x 26 |
| `Map480` "Feeder North", 40x50 | in from the North Access through the top wall (x 18-20), south in an S, out through the bottom wall (x 19-21) | a chamber around (12,20); a pocket around (33,30) |
| `Map481` "Feeder East", 60x36 | in from the East Access through the east wall (rows 13-15), west, out through the west wall (rows 17-19) | a chamber around (34,23); a pocket around (47,31) |
| `Map482` "The Confluence", 80x60 | the three feeders' winds meet: in through the west wall (rows 20-22), the top wall (x 38-40) and the east wall (rows 24-26), into one great chamber around (38,31), and the one road on leaves through the bottom wall (x 40-42) | a pocket around (66,15), off the east braid |
| `Map483` "Windward 1", 90x50 | in through the top wall (x 78-80), west past a chamber, through a pinch around (48,27), down to a second chamber, out through the west wall (rows 25-27) | chambers around (62,15) and (50,33); a pocket around (17,45) |
| `Map484` "Windward 2", 100x50 | in through the east wall (rows 25-27), up into a chamber, through a pinch around (54,27), down into another, out through the west wall (rows 19-21) | chambers around (64,13) and (42,39); a pocket around (88,6) |
| `Map485` "Windward 3", 100x50 | in through the east wall (rows 19-21), west past a chamber, out through the west wall (rows 35-37) | a chamber around (62,33); **the Lee**, the calm rest chamber around (50,12), up a calm spur at x 50; a pocket around (33,46) |
| `Map486` "Windward 4", 100x50 | in through the east wall (rows 35-37), north through a pinch around (77,20), west past a chamber, out through the west wall (rows 11-13) | chambers around (86,37) and (48,14); a pocket around (43,39) |
| `Map487` "The Breakthrough", 60x50 | in from Windward 4 through the east wall (rows 11-13) to a junction chamber around (28,26); down a calm passage through the bottom wall (x 27-29) into Overmined Corner; up through the top wall (x 23-25) onto the Peaks leg | the last stretch down, within seven squares of (28,46), is calm. It displays as "The Breakthrough" |
| `Map488` "Northward 1", 70x60 | in through the bottom wall (x 34-36), three long switchbacks north, out through the top wall (x 39-41) | a chamber around (40,35), on the middle switchback; a pocket around (8,47) |
| `Map489` "Northward 2", 90x50 | in through the bottom wall (x 19-21), north into a chamber, through a pinch around (60,26), east past a second chamber, out through the east wall (rows 27-29) | chambers around (46,12) and (70,38); a pocket around (15,13) |
| `Map490` "Northward 3", 70x60 | in through the west wall (rows 43-45), past a chamber, north, out through the top wall (x 47-49) | a chamber around (40,49); **the Hollow**, the calm rest chamber around (60,21), off a calm spur from around (52,34); a pocket around (12,14) |
| `Map491` "Cold Draft 1", 70x60, ice | in through the bottom wall (x 47-49), past a chamber, switchbacks north, out through the top wall (x 29-31). The ice begins | a chamber around (31,46); a pocket around (62,30) |
| `Map492` "Cold Draft 2", 80x50, ice | in through the bottom wall (x 29-31), north into a chamber, then east, out through the east wall (rows 13-15) into `Map302` | a chamber around (42,18); a pocket around (6,40); within six squares of (75,14), the way out, is calm |

Everything but the Breakthrough displays as "Windward Tunnels". The chambers are where the fights fit; the pockets
are dead ends, for loot.

### The doors on Jeremy's maps

None of these is written: each stands on one of Jeremy's maps. The recipe writes the other half of every one,
except the valley's.

| Map | The door | Leads to | The way back lands on |
|---|---|---|---|
| `Map326` West Access | event at **(38,11)**, `<areaEvent:[1,3]>`, in its open east edge | `Map479` (2,17) facing right | (37,12) facing left |
| `Map325` North Access | event at **(29,23)**, `<areaEvent:[3,1]>`, in its open bottom edge | `Map480` (19,2) facing down | (30,22) facing up |
| `Map327` East Access | event at **(1,9)**, `<areaEvent:[1,3]>`, in its open west edge | `Map481` (57,14) facing left | (2,10) facing right |
| `Map148` Overmined Corner | **the north wall opened at x 12-14, rows 0-2** (timber face and ceiling taken down to floor, A2 24), then an event at **(12,1)**, `<areaEvent:[3,1]>` | `Map487` (28,47) facing up | (13,2) facing down, inside the opening |
| `Map302` Where It Gets Colder | **the west wall opened at x 0-2, rows 6-8** (the layer-1 ceiling, A4 80, cleared off the floor already beneath it), then an event at **(1,6)**, `<areaEvent:[1,3]>` | `Map492` (77,14) facing left | (2,7) facing right, inside the opening |
| `Map229` Western Valley | an event on its drawn cave mouth at **(10,24)** | `Map326` (21,20) facing up, the West Access's nub | 326 needs a door back on its nub at (21,21), to `Map229` (10,25) facing down |
| `Map233` Northern Valley | an event on its drawn cave mouth at **(18,2)** | `Map325` (12,20) facing up, the North Access's nub | 325 needs a door back on its nub at (12,21), to `Map233` (18,3) facing down |
| `Map327` East Access | a door back on its nub at **(21,21)**, since `Map232`'s "Transfer (TODO)" is one-way | `Map232` (8,29) facing down | |

**Overmined Corner's dead end is furnished, and as drawn it walls the breakthrough off.** The lamp (event 13) hangs
at (14,1), on the wall the opening takes down, so it moves. Below the landing at (13,2), rows 3-5 are a barricade:
the ore heap at (12,3)-(13,3), rocks at (11,3), (13,4) and (12,5), and crates (events 21-27) at (14,3)-(16,3),
(14,4)-(15,4) and (11,4)-(11,5). Every smallest way through takes two of them: crates 21 and 25 at (14,3)-(14,4), or
the heap and the rock at (13,4), or the heap and the rock at (12,5).

Until these doors are written, nothing in play reaches the tunnels, and both far doors set the player down inside a
wall, in Overmined Corner and in `Map302`. `map-atlas atlas 328` draws the access caves, Overmined Corner and
`Map302` one-way until then.

---

## Open items

- **Rosters**, 85-100. The chambers are sized for real fights, and the gust lanes run through most of them.
- **The loot** in the pockets.
- **The lights** for `<ambient:[75]>`.
- **The doors on Jeremy's maps** (above), the two breakthroughs among them.
- **Windswept's feel in play**: 60 speed and 400 knockback are first numbers.
- **Music**, if the wind alone turns out too bare.

---

## Build punch list

- [x] Draft and install the feeders, the Confluence, the Deluge leg, the Breakthrough and the Peaks leg
  (`Map479`-`Map492`).
- [x] The gust lanes (region 30) and Windswept (state 182) on every tunnel map.
- [x] The `draft` weather (preset 18).
- [ ] Wire the doors on Jeremy's maps, the two breakthroughs included, and clear a way through Overmined Corner's
  dead end (two crates, or the ore heap and a rock).
- [ ] Polish: rocks, stalagmites, timber where the miners reached, frost on the Cold Draft maps.
- [ ] Enemies, loot and lights.
