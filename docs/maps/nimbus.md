# Map: Nimbus (Heaven, the Pride dungeon)

> Transcribed 2026-09-10 from the design session of 2026-08-31, where the dungeon was specced end to end
> and then never written down. Every decision below was made by Jeremy in that session unless marked
> otherwise. Status tags follow [`story-canon.md`](../story-canon.md): `SHIPPED` is in the data now,
> `LOCKED` is decided and unbuilt, `PROPOSED` is floated, `OPEN` is undecided. This page is the build
> spec; the canon's [Disk 1 section](../story-canon.md#disk-1--nimbus-pride-locked) stays the story
> authority and this page must agree with it.

Nimbus is chapter 4's first technodisk dungeon: a "Heaven" of walkable clouds above the Negative Peaks,
band 85-100, home to the Sin of Pride. It is the **comedy control group** for the chapter. Canon is
explicit that Nimbus does not need to be frightening at all; its job is to keep the duo joking so the
Subterranean has a reflex to break. If Nimbus goes even half-solemn, Hell lands softer.

---

## What exists in the data today `SHIPPED`

| Thing | State on 2026-09-10 |
|---|---|
| `Map122` "DUNGEON: Nimbus" | exists under Negative Peaks (`Map120`), 0x0 placeholder, no events |
| `Map322` "Room of Sacrifice" | built, under "Boss Ahead" (`Map317`), sibling of Peak Rest (`Map318`) |
| Tileset 20 "Elemental - Air" | configured: `FWAE_A1`, `FWAE_Wind_A2`, `FWAE_A4`, `FWAE_B`..`FWAE_E` |
| Switch 171 "pride sacrifice room" | set by the room's intro scene; gates the investigation pages |
| Switch 169 "need more keys" | gates whether the room is worth investigating yet |
| Enemy 583 | still `=== TBD Sin`; Gloria is not in the database |
| Enemy 259 | empty since the 2026-09-09 five-tier recut deleted Majestic Meringue |

The Room of Sacrifice already carries the front half of the gate scene. Event 7 has three pages: a
first visit that turns the duo around ("Maybe it is too early to come to this weird sacrificial
chamber"), an intro once switch 169 is set that disables party rotation and asks "do ya think this
place is useful?", and a comment-only third page recording the goal: interact with the open book on the
upper-left table to learn what the sacrifice is. Event 8 is Rupert on a custom route, looping past the
table, the book, the scroll, and the urns, with a two-second self-switch window at each so talking to
him there gets a comment on the thing he is looking at. The book, the offering, and the ascent are not
evented yet.

---

## The gate: Room of Sacrifice `LOCKED (drafted)`

The room is the gag's load-bearing half. Skull columns, a coffin, a corpse, a red pentagram, grasping
roots, four small torch radii in the dark. Every pixel promises a terrible price, and the price is
`Items[241]` **Droopy Gelatin**, the first slime drop in the game. Do not lighten the room; the grimmer it
reads, the harder the gelatin jiggles.

Staging, mapped onto the room as built:

- **The scripture is the book, top-left.** It sits inside a torch radius, so it is the one readable
  thing in a dark room. Jerald refuses to believe it; Rupert marches him across the dark to read it.
  The walk is staging.
- **The offering spot is the pentagram**, center of the room. The gelatin goes on the sacrificial
  circle, jiggles, melts, and the pentagram lights as the ascent point. The room is dark because it is
  heaven's antechamber, and the light only arrives when the door opens. The existing darkness event and
  torch radii are the tech; it needs the trigger. The ascent itself is a screen tint to white and a
  transfer to the arrival island (Jeremy, 2026-09-10).
- **The urns hold a spare Droopy Gelatin** `LOCKED (2026-09-10)`. A player who arrives without one
  cannot be stuck at the gate, and the cheapest offering in the game turning up in the trash when you
  go looking is the joke. Rupert's loop already comments on the urns; the check pays off after the
  book teaches the price.
- **The corpse by the coffin** is a previous supplicant who did not read the scripture and brought
  something magnificent. Pride's gate refused the grand offering and accepted the humble one. He should
  be clutching something visibly expensive, and Jerald loots it.
- **The scroll desk, top-right** is a spare readable. Could carry a warning nobody heeded. No decision
  needed.

Scene order: enter dark room, dread, Rupert's loop, scripture, disbelief, vindication, gelatin on the
pentagram (from the urns if the bag is empty), jiggle, melt, the screen tints white, transfer.

---

## The look `LOCKED`

- **Ground:** `FWAE_Wind_A2`. Walkable white cloud autotiles, cloud-edged platforms, and gold filigree
  flooring on the bottom row, plus layerable gold bits and crystals. The auto-layering is janky, so
  expect hand placement.
- **Backdrop:** `IslandofSky1.png` parallax, with `Clouds.png` and `BlueSky.png` as alternates for
  depth. Holes in the islands show sky below. The Soaring Path already taught the player not to think
  too hard about the sky beneath the cliffs; Nimbus just removes the cliff.
- **Gradient:** white to gold. Arrival islands are pure humble cloud. Gilding creeps in through the
  structures and the palace approach until the throne room is the most gilded screen in the game. The
  player reads the sin with their eyes before Pride says a word, and it bookends the door: the gate
  demanded humility, the resident hoarded glory.
- **Structures:** a few ornamental spires and a couple of two-story buildings on the islands, then the
  palace.

**Lineage note `LOCKED (lineage)`:** walkable clouds are where CA v2 (RMXP, ~2010) opened, a
chosen-in-the-clouds adventurer picking a class from a faceless entity, DQ3 style. Under the erasure
rules the land persists, so Nimbus is v2's opening screen still standing. Nobody comments on it, per
house style. `PROPOSED`: the faceless class-chooser rhymes with a certain Lord who "trained many"
heroes; whether that ever gets a whisper is undecided.

---

## Topology and rosters `LOCKED`

A chain of cloud islands with bridges, grassy patches, and waterfalls, paradise-adjacent. Not strictly
sequential, but the gist runs: arrival island, three or four island maps with waterfall side-pockets
(snakerope gaps for optional loot, reusing the tool vocabulary), the bird's nest, the twin gatehouses,
the palace approach with its rest map, then the palace. Roughly a dozen outdoor maps plus the palace,
about Peaks scale.

Waterfalls pour off the islands into the sky below. A link to the Deluge Plains was floated and
**rejected**: Nimbus is western Erocia and Deluge is the far east.

Four scenery types, four rosters, which is how a biome stays legible:

| Scenery | Roster |
|---|---|
| Outdoor islands | Beaks tier, the Nimbus slime (see open item) |
| Waterfall pockets | Sovereign (Pegasus line) with Beaks |
| Guard structures | Runebound tier around lv88, a light or gale hazard around lv87 |
| The palace | slimes, orbs, hazards, and Gloria |

Family homes in the database: Beaks `372-380` under Garuda, Sovereign `571-580` in the Deity family
under Pegasus, Runebound `542-550` under Runic Orb, Hazards `511-520`. The base Runic Orb (lv9) is
earmarked for the Pearlsalt Mines to imply technology and depth there; Nimbus takes a high tier, not
the base.

**The named bird `LOCKED`:** a `!`-named rare with a fixed nest map, not an RNG spawn, so the Leo
journal quest stays completable. It drops Leo's rucksack and **one** journal page only. The lore already
says the bird scattered the pages across the continent, so the rest stay where they are.

---

## The split `LOCKED (2026-08-31)`

The canon's two-switch seed, ratified. Two ornate gatehouses flank the palace approach and each must be
cleared to open the palace gate, so the split is unskippable and has a reason. Control is forfeited to
events for the duration: "first Jerald goes, then Rupert goes," nothing fancy, kept entirely comic.
Orbs and hazards inside; these can simply be the guard structures from the roster table.

Nobody says it out loud, but Pride's gate requires two people. The domain of the sin of self-sufficiency
cannot be entered alone. That converts the "why two switches in separate buildings" game logic into
load-bearing architecture for free.

Why it has to stay painless: it exists to train the reflex the Frozen Fortress takes away. In Nimbus
they are in two places but both present, and cycling works. In the Fortress the button is gone. Full
drafting under the canon's [THE SPLIT](../story-canon.md#the-split--the-duo-runs-the-fortress-alone-proposed-2026-08-06).

---

## The palace, six maps `LOCKED`

1. **Grand entry hall.**
2. **Pillared hall** with gilded nonsense. The pillars are hazard cover: beam hazards plus
   sightline-breaking pillars are the palace's combat identity. The intro cave taught guard-the-fireball;
   this is the graduate course.
3. **Stairs up.**
4. **Save map.** Enemy-free by convention, as every rest map is (corrected 2026-09-17: JABS enemies
   respawn on their own timers, not on map re-entry, so this is not an engine rule). Save sigil plus
   the **teleportal**, per the convention every shipped dungeon
   follows (Volcanis Rest Area, the castle's Custodial Closet, Peak Rest). The hub side is parked; see
   open items.
5. **The final door.**
6. **Throne room.** Gradient peak, most gilded screen in the game. Gloria, appalled that a disgusting
   flea like the protagonists would dare set foot in her luxurious and most definitely earned heavenly
   land.

---

## Gloria, the Sin of Pride `LOCKED (2026-08-31)`

Leo's master, the world-famous bard turned alchemist whose farewell note (the Bard Master note in
Leo's attic, `Map035`, `SHIPPED`) said she was leaving this stupid rock to find a new world. Shipped
text genders her: Rupert's reread line says "She must've been really smart." Canon's line for Nimbus,
"brimming with righteous glory," is her vocabulary, which is why the name was easy.

**Her transformation was real and internal.** Every other sin wears a monster; Gloria does not. Sinful
transformation does not have to be physical, and hers installed where nobody can see it. She is proof
the sin lives in the junction, not the flesh. Enemy 583 is her slot; she gets no Aspect form.

**The fight is a showcase, not a stat wall.** She does not fight. She manifests Seriously Prideful
Homunculi, her masterworks, and introduces each one with grandiose title and provenance, a gallery
exhibition of her genius. As the duo trash masterwork after masterwork the intros get shorter and
angrier, until around the tenth she snaps: "FINE, I WILL DO THIS MYSELF," jumps down from the balcony,
and dies at once, because she has charisma and smarts and no power. Pride goeth before a fall,
literally. She still gets the "the sin of pride will live on" line, and for her it is the most literal:
her lessers are the homunculi she built. The products outlive the maker.

- **Homunculi** live in the `531-540` family under Puppet. Ten distinct masterworks from one family via
  affix dress: level 80 with no affix, then weak, moderate and strong affixes, then the same at 82, then
  85 for the last. Placing this family also closes `Armors[501]` Vague Memory, an authored material with
  no source (see [drop-sources.md](../enemies/drop-sources.md)).
- **Difficulty:** an endurance trial. Not hard unless underleveled; it exists to make sure the player is
  eating food, using healing magic, and supporting or being supported by their ally. That is a rehearsal
  of the support loop the Fortress split later removes, and an endurance fight you eat your way through
  is the consumption thesis with a ballroom soundtrack.
- **Escalation garnish `PROPOSED`:** around the sixth masterwork Rupert notices out loud that it is the
  one from earlier with more glitter. Nothing enrages Pride like being told her portfolio repeats.
- **Differentiation from Sloth:** both fights are "untouchable boss, kill the adds," twice in one
  chapter. The framing is the fix. Sloth is endless anonymous waves in silence; Gloria is a counted
  showcase with narration. Same bones, opposite soul.
- **Music:** FF4's *Dancing Calcobrena*, the possessed-doll fight theme. Puppets dancing while the real
  villain watches from above, and the homunculus slot in drop-sources is already named construct-puppet.
  Needs a rip as an `.ogg` in `audio/bgm/`; nothing on the current shelf fits.
- **Comic register:** the duo treat her exactly as they treat Leo, a side character interrupting their
  loot run. She demands awe; they ask if she drops recipes. Wrath was mocked into his sin; Pride gets
  ignored into hers. Sins do not get to self-style "Lord of X" (ledger rule), so her declaration needs
  her own idiom of grandeur. Her energy can be a woman who spent her career demanding the manager and
  discovered in heaven that she is the manager now, without ever saying the word.

---

## Harvest and destructibles `LOCKED`

From [harvest-nodes.md](../enemies/harvest-nodes.md), which already carries the Nimbus row:

| Node | Note |
|---|---|
| Grass of Purity | regular grass with the Energy affix, state 386 Purity, dropping Salt `i426`. **The drop tag is still untagged**; tag it when the grass is placed |
| `*Orchard Tree`, `*Nut Tree` | assigned in the doc |
| `*Tree (Heartwood)` | enemy 16, unplaced, band 90-130; Nimbus is its home |
| Gold urn | **new destructible**, a `43-50` slot, feeding the urn material line `Armors[506-510]` Yellowish, Brass, Gilded, Golden, Midas. Midas urns in Pride's house |

Every new family needs its monster-material block in the Armors table before it goes in; read
drop-sources.md for the block layout rather than guessing positions.

---

## Open items and things that moved since the session

- **The Nimbus slime `OPEN`.** The session assigned Majestic Meringue (enemy 259) and on 2026-09-03
  Jeremy re-banded it to 75-85 for Nimbus. The five-tier recut of 2026-09-09 then deleted it along with
  Umbral Molasses and Crystalline Candy, keeping the slime family at Hard Syrup plus the four canon
  elements. Slots 256-259 are empty. Nimbus either gets a new Energy slime in one of them or goes
  without a dessert; undecided.
- **Family ladders were recut.** The session reasoned from ten-tier ladders topping out at 82/90. The
  stubs now run five per family (for example Sovereign `572-575`), and their `<level:>` tags are
  copy-pasta placeholders rather than plan. Levels for the Nimbus tiers get set when the rows are
  authored.
- **Gloria is not in the database.** Enemy 583 is the slot.
- **Teleportal hub (`Map194`) needs a reckoning `OPEN`.** Its ten doors were built for motivation and do
  not match reality: no Nimbus door, and the Forest of Dreams, a large dungeon, has no door at all.
  Ideas Jeremy liked: underwater becomes Crystalline Ravine, voidal becomes the Desolate Graves, tundra
  becomes Deluge Plains. Nothing locked; the count exceeds the doors and he wants to think on it. This
  does not gate Nimbus: the palace switch can point at the hub before its door art exists, which is the
  current state of the fortress and subterranean doors.
- **Whisper network ships with Nimbus, not with the Subterranean.** Canon says whisper density about the
  shaft rises after Nimbus, so those Raevula and miner events are part of this milestone.

---

## Build punch list

- [ ] `Map322`: the book event, the gelatin offering on the pentagram, the spare gelatin in the urns,
      the white tint and ascent transfer, the lootable corpse. Rupert's route and the intro scene exist.
- [ ] `Map122` and children: arrival island, island chain with waterfall pockets, the bird's nest, twin
      gatehouses, palace approach with rest map, palace x6. Tileset 20 is ready.
- [ ] Enemy rows: Beaks tier, Sovereign tier, Runebound tier, light hazard, the `!` bird, Gloria at 583,
      Prideful Homunculi in `531-540`, plus their Armors material blocks.
- [ ] Destructibles: Grass of Purity placements and the state 386 drop tag, gold urn row, Heartwood.
- [ ] The scripted split at the gatehouses (party-cycle disable window, per-protagonist control).
- [ ] Save map with sigil and teleportal switch.
- [ ] Gloria's theme as an `.ogg`.
- [ ] Whisper-network events in town, gated behind the Nimbus disk.
