# Map: The Subterranean (Hell, the Sloth dungeon)

> Transcribed 2026-09-11 from a design conversation that was still in progress when it was written
> down, which is the point — the Nimbus spec was lost once by waiting until the session was over.
> Status tags follow [`story-canon.md`](../story-canon.md): `SHIPPED` is in the data now, `LOCKED` is
> decided and unbuilt, `PROPOSED` is floated, `OPEN` is undecided. Decisions are Jeremy's unless the
> tag says `PROPOSED`, which means it came out of the discussion and has not been ratified.
> The canon's [Disk 2 section](../story-canon.md#disk-2--the-subterranean-sloth-locked) stays the
> story authority for Sloth herself; this page is the build spec and must agree with it.

The Subterranean is chapter 4's second technodisk dungeon and the second of the two **mandatory**
beats in the chapter — band 95-110, home to the Sin of Sloth. It is the tonal opposite of Nimbus by
design. Nimbus is the comedy control group; here the joking stops, and it only lands because Nimbus
spent a whole dungeon establishing the reflex it breaks.

---

## What exists in the data today `SHIPPED`

| Thing | State on 2026-09-11 |
|---|---|
| `Map290` "DUNGEON: Subterranean Depths" | the tree node, 0x0, one child |
| `Map331` "Subterranean Entrance" | **built**, 40x25, tileset 14, save platform, two durable posts, `_FF8-Flashback` BGM |
| `Map137` "Deeper We Go..." | mines-side room; its event 18 is the only transfer into the dungeon |
| `Map54` "Downward Spiral" | mines-side room; seven `Spire` events (enemy 31) clustered at (18-21, 8-11) |
| `Map332` "Shortcut" | 60x25 corridor joining `Map54` and `Map137` — **mines-internal**, despite the tree calling it "Shortcut to Subterranean" |
| `Map180` "Deeper Dive" | Forlorn Basin floor 4, descends to floor 5. **Nothing here reaches the Subterranean** |

**Both built approaches are in the Pearl Salt Mines.** The Forlorn Basin side of the canon's
two-entrance promise has no map and no link yet; see [the entrances](#the-two-entrances) below.

`Map331` is the design reference for the whole dungeon and is worth opening before drafting anything.
It uses the same tileset as the mines and looks nothing like them.

---

## The look `LOCKED`

Tileset 14 "Dungeon (VisuStella)", tiled and decorated nothing like the Pearl Salt Mines that share
it. Teal scaled rock, a magenta pool with an orange-crusted shoreline, red growths, a pink rim light
along every ledge, black drops into nothing, and two skeletons.

The intent is **alien and dark, and above all claustrophobic** (Jeremy, 2026-09-11). Not a cave —
somewhere you should not be, that does not care that you are there.

- **The lights go out.** `$gameSystem.setMaskTint` as used in the Room of Sacrifice, with torches and
  bioluminescence as the only light sources.
- **Ambient critters** drift slowly through — glowing butterflies as the working idea. They are not
  enemies, they ignore the player entirely, and their glow is what reads as "well, that's safe.
  Probably."
- **Even the lit chambers are dark.** Light is local and never fills a room.
- A **biological** reading of the same art — vascular growths, a membrane, something you are inside
  of rather than under — was floated and is compatible with alien-and-dark rather than a replacement
  for it. `PROPOSED`

---

## Topology

**The shape is a snake** `LOCKED (2026-09-11)`. The player should feel they are descending through
the body of one enormous serpent: a single winding descent rather than a branching cave system, with
corridors that bend so you never see far ahead. That is where the claustrophobia comes from, and it
is the structural commitment the whole dungeon hangs on.

**Both entrances lead to the same path** `LOCKED (2026-09-11)`. They are not two dungeons and not two
branches that merge.

`PROPOSED` — if the dungeon is a tube, the two entrances are not converging branches but **two
punctures into the same tube at different depths**. The Basin is deeper than the mines, so the Basin
mouth opens further down and a player arriving that way skips the upper section. That is a reward for
having explored the Basin, in the same spirit as the Basin's own central-spire shortcut.

`PROPOSED` — the consequence worth building around: **key every gradient to depth, not to progress.**
Darkness, bioluminescence density and heartbeat volume are per-map properties, so a player dropping
in from the Basin lands at the correct intensity with no scripting at all. Anything keyed to "how far
through the dungeon are you" breaks the moment somebody uses the second mouth.

---

## The two entrances

### Mines side `SHIPPED`

`Map137` "Deeper We Go..." → `Map331` "Subterranean Entrance". Built, reachable, save platform in
place. `Map331` currently dead-ends — it has no exit except back the way it came.

### Basin side `OPEN`

Canon promises a descent beneath the Forlorn Basin, snakerope-gated, and nothing is built. The Basin
is one enormous hole with grey stone walls, spires and rocks, descended by hopping between layers and
passing through holes; a single spire up the middle serves as a faster exit than backtracking
(Jeremy, 2026-09-11). The Basin is **deeper than the mines**, which is what sets the two mouths at
different depths.

Where exactly the Basin mouth sits — which floor, which passage, and whether it needs its own
entrance map the way the mines side got `Map331` — is undecided.

---

## Sound `LOCKED (2026-09-11)`

A **heartbeat as passive BGS**, growing louder as the player approaches the boss. Map BGS volume is
a map property, so the escalation is authored per map and costs nothing at runtime.

`PROPOSED` — the heartbeat **stops** when the player reaches her. She is the one thing down there
with no will to act and the beat is the only part of her still moving; silence after a descent's
worth of rising pulse is the strongest beat available and it is free. In phase two, when she opts
back in, it spikes.

---

## Rosters

The subgroups wanted here `LOCKED (intent, 2026-09-11)`:

- **snake reptiles** — slithering minions, the dungeon's signature
- **cube slimes** — needs a character sprite; nothing exists
- **crawler bugs** — centipedes
- **brood bugs** — spiders
- **orb constructs** — dangerous supporters of ruins

Every one of the five already has its subgroup allocated in `Enemies.json`, read from the live table
on 2026-09-11 rather than from [`../enemies/main.md`](../enemies/main.md), which predates the
five-tier recut and disagrees in several places:

| Wanted | Subgroup | What is actually in the slots |
|---|---|---|
| snake reptiles | Reptile → **Snake** `151-155` | Prince Cobra lv24, Asp lv51, then three `=== TBD Snake`. `!Vice Cobra` sits apart at `160` as a named rare |
| cube slimes | Slime → **Cube** `291-295` | five `=== TBD Cube` stubs and nothing else — **no rows authored and no character sprite** |
| crawler bugs | Insect → **Worm** `411-415` | Crawler lv17, Magma Worm lv43, Wriggle Worm lv64, then two stubs |
| brood bugs | Insect → **Lonewolf** `421-425` | the base row is literally named **`Brood`** (lv17), then four stubs. The subgroup label says Lonewolf and the row says Brood, so there is no conflict to resolve — the slots are there |
| orb constructs | Construct → **Runic Orb** `541-545` | base `Runic Orb` lv9, then four `=== TBD Runebound` at 26/34/42/50. [`nimbus.md`](./nimbus.md) earmarks the base for the Pearl Salt Mines "to imply technology and depth" and gives Nimbus a high Runebound tier. The Subterranean sits between those two, so the thread already runs through its doorstep |

So no new families are needed and no new subgroups either — what is missing is **authored rows in
band**. Every ladder above stops well short of 95-110, and the `<level:>` tags on the `TBD` stubs are
copy-pasted placeholders rather than plan, so they set no expectation.

The Cube slimes are the one subgroup with nothing at all in it. If the Subterranean takes all five
slots, cube slimes become a dungeon-exclusive family, which is a reasonable thing for them to be.

Already placed nearby and worth reusing: **cave bats** (enemy 361) appear in both mines-side rooms,
and **`@Durable Post`** (enemy 33) is standing in `Map331` itself — hookshot is the established
traversal verb here before the dungeon has a single room.

---

## The voidal question `OPEN`

Canon has Sloth manifesting endless voidal minion waves. Whether the player ever sees one **before**
the fight is undecided.

The facts that bear on it:

- **Void is element 9**, first-class.
- The **Undead block `101-150`** is already the void faction: its members attack with Void and most
  carry a Void rate of x0. Four subgroups, with open stubs in Ghost (`104-105`), Reborn (`113-115`),
  Wisp (`123-125`) and Hollow (`143-145`).
- But Undead's natural home is the **Desolate Graves** — that is the floated meaning of the hub's
  "voidal" door. Spending it here leaves the Graves with nothing to be.

`PROPOSED` — her minions are *manifested*, not native fauna; they are pieces of her rather than
things that live down there, so they should not be Undead at all. The foreshadowing then writes
itself: the player finds them **inert** on the way down, standing, not attacking, several of them
across several maps, and nothing ever happens. Not acting is the entire sin. Then the fight begins
and all of them move at once.

**`Skills[2587]` "Absolute Solitude"** — 180-frame cast, radius 99, *"a foul fog melts the field with
the despair of absolute solitude. Scales rapidly"* — exists and is referenced by **no enemy and no
class**. It sits next to `2585` Soul Siphon, `2586` Unholy Smite and `2588` Wave of the Void in what
reads as an unassigned void set.

---

## Open items

- **The Basin mouth.** No map, no link, no chosen floor.
- **Where the tube starts and ends.** `Map331` is the mines-side landing; the depth at which the
  Basin mouth joins, and how many maps sit between each mouth and the statue, are undecided.
- **Rest and save.** `Map331` carries a save platform. Whether the dungeon gets a proper rest map
  with a teleportal — the convention every shipped dungeon follows — and where it sits relative to
  the two mouths, is undecided.
- **Whether voidal minions appear before the fight**, per above.
- **The cube slime sprite** does not exist, and neither do the rows.

---

## Build punch list

- [ ] Decide the Basin mouth: floor, passage, and whether it needs its own entrance map.
- [ ] Map count and the descent's shape, mouth to statue.
- [ ] Rest map with save sigil and teleportal, plus its hub door.
- [ ] `Map331` needs an exit that is not the way it came.
- [ ] Enemy rows in band: Snake `153-155`, Cube `291-295` (and a sprite), Worm `414-415`,
      Lonewolf `422-425`, an orb-construct tier, plus Sloth herself.
- [ ] Darkness pass: mask tint, torches, bioluminescent props, the drifting critters.
- [ ] Heartbeat BGS as an `.ogg`, and per-map volume keyed to depth.
- [ ] Assign or deliberately retire `Skills[2587]` and its neighbours.
