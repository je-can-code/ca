# TODOs

## Incomplete Map TODOs

### Adventurer's Fork
#### Path to the North
This is available, but not yet implemented at all. It should lead to `FIELD: Desolate Graves`, but be gated by a tool,
possibly the "torch"-like tool?
Decided 2026-10-25: the way north stays open, so a level 1 can walk in, and the torch opens only the two crypts inside
the Graves. The Graves are drafted; see `docs/maps/graves.md`. The way in from `Map329` was wired 2026-10-26.


### FIELD: Raevula's Heartbeat
#### Riverside Stroll
There is a `Suspicious Crack` wall that is partially implemented with a `Durable Post` pair inside. The person beyond
there should be a rescuable person for a side quest or something that can unlock stuff in town- perhaps teaches you how
to upgrade your named weapons?
Placed 2026-10-26: a skeleton with Dilapidated Footwear in the rope pocket past the crack, `Map179` (20,5) (see
`docs/acquisition.md`).

#### Stone's Throw / A River Receded
There is a `Durable Post` pair that suggests there should be something behind the waterfall, but its not implemented at
all. Perhaps it should reveal a named weapon (wand)?
Placed 2026-10-26: behind the waterfall on A River Receded, `Map200` (10,10), a skeleton with a Perforated Suit (see
`docs/acquisition.md`).


### DUNGEON: Pearl Salt Mines
#### Northwestern Depths (southern caverns)
There is a `Durable Post` pair that connects to an unimplemented map.
Perhaps some loot should be here?

#### Dangerous Oneway (southern caverns)
There is a chest reachable by a pair of `Durable Posts`, but its contents have not yet been determined.
Perhaps it should be a flux drive?

#### Deeper We Go (southern caverns)
There is a `Durable Post` pair here that ultimately will lead to the `Subterranean Depths`, but that place is
completely unimplemented.
Drafted 2026-10-23: the Subterranean, entered from here through `Map331` and walkable end to end since 2026-10-26 (see
`docs/maps/subterranean.md`).

#### Downward Spiral (southern caverns)
There is a `Durable Post` pair here that leads somewhere undetermined.
Perhaps it should lead to a different location within the `Subterranean Depths`?
One of its pairs reaches a pocket on the west edge, whose door at (0,32) runs through `Map332`, a corridor inside the
mines, to Deeper We Go (`Map137`), where the Subterranean is entered.

#### AREA: Northern Caverns
There is currently no purpose for the player to explore other areas of the northern reaches of the `Pearl Salt Mines`.
Perhaps this should have new deposits for `Pearl Salt` (rarely) and other ore?

#### Offshoot N (northern caverns)
There is nothing here, but it was intended to have a `Suspicious Crack` leading to somewhere in the `Negative Peaks`.
Its one chest holds the named double swords, at (56,3). Drafted 2026-10-25: the mines reach the Peaks after all, through
the Windward Tunnels from Overmined Corner (`Map148`) to Where It Gets Colder (`Map302`); see `docs/maps/tunnels.md`.


### DUNGEON: Subterranean Depths
This is a completely unimplemented dungeon that is reachable after acquiring `Snakerope`.
Drafted 2026-10-23: six layers and the arena (`Map385`-`Map409`), entered from `Map331` under Deeper We Go. Walkable
end to end from the mines since 2026-10-26; what's left is in `docs/maps/subterranean.md`.


### DUNGEON: Forest of Dreams
#### Marshy Secret (riverside path)
It is named "secret", but there is nothing significant here. Perhaps add a named monster?

#### Mad Hops (riverside path)
This is a pretty significant path out of the way with no return. Perhaps add some loot or a named monster?
Placed 2026-10-26: the named glaive `"Crescent Blossom"` in a chest at (29,8) (see `docs/acquisition.md`).

#### Peaceful Respite (forest depths)
There is a well that is reachable by a `Durable Post` pair, but is not implemented.
Perhaps it should be a secret dungeon of some sort?
Placed 2026-10-26: a skeleton with Dilapidated Footwear at the well, `Map067` (24,2) (see `docs/acquisition.md`).


### FIELD: Outer Cliffs
#### Terraced Cliffside
There is a `Suspicious Crack` wall that should be able to be reached by dropping down (but it can't at the moment).
The named boomstick `"Blaster"` was meant for the walled-off ledge here at x 43-45, y 13-15; with nothing reaching it
yet, it went to the fallback in Up or Down (`Map353`) on 2026-10-26.

#### Inconspicuous Hole
There are multiple torches that should be lit by an uncreated "torch"-like tool.
Perhaps it should grant access to a path leading to the beach?
Decided 2026-10-25: the tool is the Red Wand, found on Cerak's dig in the Crystalline Ravine, and lighting these
torches opens the way down the cliffs to the Seashell Shores. Wired 2026-10-26: the fourth torch lit turns on switch
175, and a hole opens in the east wall (see `docs/maps/shores.md`).

#### Connector to More Cliffs
There is a `Durable Post` that leads to presumably more cliffs- but they aren't implemented yet.
Decided 2026-10-25: the more cliffs are the east ledge on Scaling the Cliffs (`Map111`), where the connector's far
exit already lands, and it stays as a treasure ledge. The ledge (x 47-54, rows 14-17) runs off the map's east edge,
where the cut swamp field would have joined, so its east end gets capped with cliff and a chest worth the trip goes
on it. Getting there takes bombs, for the crack at (42,12), and the snakerope, for the posts inside the connector.
The chest holds the fifth Alchemy Page, at (51,14) (2026-10-26, see `docs/unlockables/alchemy-pages.md`).


### DUNGEON: Forlorn Basin
#### Passage 8
There is a `Durable Post` pair here that leads to what appears to be an alternative depths to the main story path.
Perhaps this should lead into somewhere in the middle of the `Subterranean Depths`?
Checked 2026-10-27: the pair at (47,62) and (47,69) is only the stake picture so far, with no `<enemyId:33>`, so the
rope can't pull to it yet. Where the Basin's way into the Subterranean lands is still open in
`docs/maps/subterranean.md`. The named claws `"Brought Down"` went into the spire pocket at (72,6) on 2026-10-26.


### FIELD: Negative Peaks
#### Preparing to Ascend
There is a `Durable Post` pair that leads presumably to the maps that make up the `Negative Peaks`, but they are not
implemented.
The Negative Peaks are built: this map's north exit at (6,0) leads into Foothills (`Map301`), on the far side of the
posts in the connector (`Map235`).


### FIELD: Lakeside Road
#### Frozen Fortress
There is an `overly advanced gate` and an `out-of-place frozen fortress` here, gated by an un-implemented "keycard"
tool. This'll ultimately lead to the dungeon of `Frozen Fortress`, but it also is un-implemented.
Drafted 2026-10-24 to 10-25: the Fortress itself, `Map410`-`Map444` (see `docs/maps/fortress.md`). The gate, the keycard
and the joins between its parts are still to be evented.

#### Derelict Fork (going south)
There is a `Durable Post` pair that leads to the south, which ultimately will bring the player to the `Deluge Plains`,
but that place hasn't been woven into the story (the maps exist, though).
Drafted 2026-10-25: the Windward Tunnels under the valley, joining it to the mines' Overmined Corner (see
`docs/maps/tunnels.md`); all three of the valley's doors into them work both ways since 2026-10-26.

#### Derelict Fork (going east)
There is a `Durable Post` pair inside the connector map, which ultimately will lead the player to the `Frostbite
Fields`, but that place isn't implemented.

#### Lakeside View
The second Alchemy Page's chest stands on top of the rock pillar in the lake, at (24,7), but no `Durable Post` pair
reaches it yet (2026-10-26).
Placed 2026-10-27: the pair, one on the pillar right under the chest at (24,8) and one on the shore straight below at
(24,14).


### DUNGEON: Erocia Isthmus
#### Distant Hill
There is a `Durable Post` pair which leads to nothing.
Perhaps add some enemies and a secret dungeon and/or loot/named enemy?
Placed 2026-10-26: a skeleton with a Perforated Suit beside the named spear's chest, `Map218` (44,7) (see
`docs/acquisition.md`).

#### Watery Path
There is a `Durable Post` pair which ultimately will lead the player to the `Crystalline Ravine`, but that place isn't
implemented yet.
Drafted 2026-10-25: the Crystalline Ravine, entered past these posts through `Map330` (see `docs/maps/ravine.md`).


### FIELD: Highwater Way
#### Eastern / Western Ways
Both of these maps have only enemies on them, perhaps they should have loot and a named enemy?
The Eastern Way now holds the third Alchemy Page's chest, in the hilltop camp at (43,6) (2026-10-26).
The Western Way got a skeleton with Dilapidated Footwear at (18,19) (2026-10-26).


### DUNGEON: Volcanis Grotto
#### The Bellows
There are many `Durable Post` pairs that lead no where. Perhaps they should lead further into the grotto somehow?
Placed 2026-10-26: a skeleton with a Perforated Suit in the rope pocket at (7,21) (see `docs/acquisition.md`).


## Incomplete Feature TODOs

### Alchemy Pages
There have been no placement of any pages from the Alchemist's Journal. These need to be placed to grant the player the
ability to unlock new alchemy recipes.
Placed 2026-10-26: the "Alchemy Page" item (`Items[155]`) and chests for pages II-VI, plus a sixth page in the
Seashell Shores' low-tide cove. Page I is the Nimbus bird's drop. The quest moves when a page is turned in to Leo.
Lakeside View's posts went in 2026-10-27. What's left (the bird, the unlock beat at Leo, Leo's exchange) is in
`docs/unlockables/alchemy-pages.md`.

### Named Weapons
There are numerous named weapons that have yet to be placed.
Consult [The weapons section for more details][1]
Placed 2026-10-26: the five unplaced ⭐ weapons in chests, and all 27 salvage parts on skeletons
(`$o_skeleton.png`); every square is in `docs/acquisition.md`. The fourteen older named chests' messages were also
fixed to name the weapon they actually give.

### Named Enemies
There are numerous named enemies that should exist, but have yet to be created to add variance to the regions.



[1]: weapons/main.md