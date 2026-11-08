# Content complete

Content complete means every event is built and theoretically works (Jeremy, 2026-11-05). The target is December 20,
2026. Minimal testing is fine along the way, and one full playthrough comes before the game is called done. Tile polish
is not on this list.

This file is the denominator behind the burndown. Tick a box when the thing exists in the data: `- [x]` is done and
`- [~]` is started. Add a line when something new turns up, and delete a line that stops mattering. A line can wrap onto
an indented second line. `bun tools/burndown.js` counts this file; the usage is at the top of that tool.

**Six headings below hold no lines because the tool reads them out of the game.** Their rules:

| Heading | Measured from | Done when |
|---|---|---|
| Townsfolk quests | the event pages that move each quest | every page has dialogue and no flag comment left (`GATE NEEDED`, `CONTENT NEEDED`, `REWARD NEEDED`, `CLOSURE NEEDED`, `OUTCOME STORAGE NEEDED`, `MAKER'S CALL`, `OFF-SITE`, `TODO dialogue`) |
| Enemies on the new maps | where creatures stand | three or more stand on the map, below the roster stamp in its top rows |
| Harvest nodes to place | every `*` row in `Enemies.json` | the node stands somewhere a player can reach |
| Node names and flavor | `config.sdp.json` | none of the subgroup's panels is still named `===TBD` |
| Things nothing supplies | every ingredient and tool a recipe asks for | a drop, chest, shop, event or recipe provides it |
| Named gear recipes | the recipe outputs in `config.crafting.json` | the line's upper rungs each have a recipe |

Rest rooms, arenas and rooms whose fight is listed by hand owe nothing to the enemy lane; `AREAS` in the tool names them.
**After the line** is listed so it isn't forgotten, and never counts toward the target.

## Nimbus

- [x] Room of Sacrifice: the tome, the spare gelatin in the urn, the offering and the ascent (Map322)
- [ ] Room of Sacrifice: the corpse by the coffin, clutching something expensive (Map322)
- [x] Hall of Repose: save platform and teleportal (Map378)
- [ ] Approach Rest: what the rest stop holds (Map374)
- [ ] The duo's banter on the way up, the joking the Subterranean later takes away (Map363)
- [ ] The Aerie: the named bird on its 4:00-8:00 window, dropping Leo's rucksack and the first page (Map369)
- [ ] Treasure on the islands and in the waterfall pockets
- [ ] Grass of Purity and its drop tag
- [ ] The gold urn destructible, feeding the urn materials
- [ ] West Gatehouse: Jerald's turn, control handed over by events (Map372)
- [ ] East Gatehouse: Rupert's turn (Map373)
- [ ] The palace gate opens once both gatehouses are clear (Map371)
- [ ] Pillared Hall: beam hazards, with the pillars as cover (Map376)
- [ ] Music for the islands and the palace, none of the eighteen maps has any
- [ ] The whisper network in Raevula after Nimbus: the miners and the boarded shaft

## The Subterranean

- [x] Respite: save platform and teleportal (Map406)
- [ ] Cavern 2d: the snakerope crossing onto teal ground (Map390)
- [ ] The Basin mouth: pick the floor, build the way in, land it on Dark 5b (Map405)
- [ ] Darkness pass: the torches thin out, bioluminescent props, a light on every save sigil
- [ ] The glowing butterflies on their own team, so the worms eat them
- [ ] The heartbeat BGS, its volume by depth, and the theme fading out as it rises
- [ ] The tonal pivot: the jokes stop (Map393)
- [ ] The inert voidal figures on the way down, if they stay
- [ ] Treasure in the ribs and the dead-end pockets
- [ ] Absolute Solitude and its neighbours: assign them or retire them

## The Frozen Fortress

- [ ] The gate opens to the hypercube, and the point of no return is signposted (Map116)
- [ ] Entry hall: the mundane exchange, the spring trap and the trapdoor (Map411)
- [ ] Who to follow: the moogle-style pick (Map411)
- [ ] Party cycle off from the trap to the reunion, with the dead button beat
- [ ] Sigils in the six switcher rooms move between lanes, and save with no way out
- [ ] Rafters: the spring lands Jerald on the beam, with the hall as parallax (Map413)
- [ ] Landing and slide: Rupert's fall, and no climbing back up (Map429)
- [ ] What the hazard grate does to Rupert (Map430, Map434, Map435)
- [ ] The floor collapse: unskippable, with its cross-cut and variant line (Map415)
- [ ] The lever: unskippable, with its cross-cut and variant line (Map431)
- [ ] Goop Ocean: the fallen chunk becomes the bridge (Map433)
- [ ] Dead elevator: power-gated, riding up to the Bolt Gallery (Map418)
- [ ] Bolt Gallery: traps in the niches, and Jerald's line about the old castle (Map419)
- [ ] Needless Hazards: destroying them all reverse-charges the circuit (Map420)
- [ ] Hazard Field: the switch puzzle, the jumps, and the light bridge both ways (Map435)
- [ ] Mini-boss: the elysian ghost (Map422)
- [ ] Mini-boss: the horde (Map438)
- [ ] Elevator ride: the climbing parallax, the robot waves and the care package trigger (Map423, Map424)
- [ ] Cultists' Lair: torches lighting as he nears, demon waves off the platforms (Map439)
- [ ] Dome Approach: the barely perceptible button (Map440)
- [ ] The two care packages in the final switcher rooms (Map425, Map441)
- [ ] The fall: the tumble, the flip motion, the monologue, the forced flip to Rupert (Map426, Map417)
- [ ] The VERY convenient elevator: Rupert's exit, the forced flip to Jerald (Map443)
- [ ] The reunion, with both duration lines (Map411)
- [ ] The courtyard gate needs the key behind Envy and the power (Map411, Map444)
- [ ] Votary rows 593-597
- [ ] Treasure in the lanes
- [ ] Music for the hall, the tower and the basement, none of the twenty-nine maps has any

## Boss fights

- [ ] Gloria: her row and look, and the ten homunculi dressed by affix (Map380)
- [ ] Gloria: her entrance, the duo asking if she drops recipes (Map380)
- [ ] Gloria: the showcase, intros shrinking to "FINE, I WILL DO THIS MYSELF" (Map380)
- [ ] Gloria: her fall, the Verte disk, and her theme as an .ogg (Map380)
- [ ] Sloth: her row, the void statue and its light (Map409)
- [ ] Sloth: phase one, the minion waves and the statue chipping away (Map409)
- [ ] Sloth: phase two, she opts back in (Map409)
- [ ] Sloth: the Bleu disk, and the oblique lore that points at Lust (Map409)
- [ ] Lust: his row and sprite (Map443)
- [ ] Lust: the approach on proximity beats (Map443)
- [ ] Lust: Rupert's flashback, the ship, the castle and the crater
- [ ] Lust: the fight, immune until he reaches, with the avoidable grab (Map443)
- [ ] Envy: her row and the off-sprite clone charset (Map426)
- [ ] Envy: the scene with the chatter stream under it (Map426)
- [ ] Envy: Jerald's flashbacks, Weird Island and the morph manifestation
- [ ] Envy: the fight, thirty invincible milling Jeralds and one wrong one (Map426)
- [ ] Grudj: his row and sprite, and stepping out from behind the statue (Map444)
- [ ] Grudj: the reveal and the thesis, said out loud (Map444)
- [ ] Grudj: the scrambler machine's cycle, ailments and SDP blackout (Map444)
- [ ] Grudj: Meltima as an enemy skill with a ten-second cast
- [ ] Grudj: the arsenal, blinks, beams, spirals, zap traps, quakes and void zones
- [ ] Grudj: the desperation cooldown reduction
- [ ] Grudj: the Treis gate, the baton's zap and the paralysis that never lands
- [ ] Earthie: design the fight, since all four elementals get fought
- [ ] Earthie: build the fight
- [ ] The sin panels drop from the right fights, with their real parameters

## Holding the story together

- [ ] Chapter 4's opening beat: who points the duo at the two disks
- [ ] Main quest for chapter 4, its objectives and logs
- [ ] Main quest for chapter 5, its objectives and logs
- [ ] The teleportal hub reckoning, and the Nimbus and Subterranean doors (Map194)
- [ ] RGB Technohypercube: the fusion at the Spacial Flux Engine
- [ ] `side-007`, the disk and hypercube descriptions read as the hypercube flow, and its third step can be moved
- [ ] The Bleu disk gate: what it opens (Map280)
- [ ] The Greed reveal: its thresholds and Trainer Lord's scene
- [ ] The Sabre cameo, somewhere before chapter 5
- [ ] Wyatt and Lucian stop calling themselves Lord of anything
- [ ] The final scene: the meal
- [ ] The credits

## Townsfolk quests

## What the quests need built

- [ ] `yelena-004`: the Matriarch's name, venue and row, and Yelena as a temporary ally
- [ ] `yelena-005`: the Family Cookbook and Nana's Ledger
- [ ] `treis-003`: the lab going up on the vacant lot in visible stages
- [ ] `treis-003`: the invention crafting unlock
- [ ] `richpoor-003` and `richpoor-005`: their fetch names a blank row, item 524
- [ ] `richpoor-005`: the vanity farm map
- [ ] `richpoor-006`: the potato plots
- [ ] `richpoor-010`: the daily produce crate loop
- [ ] `cerak-001`: the three sigils placed around Raevula
- [ ] `cerak-002`: the dig camp and the sigil-script (Map330, Map449)
- [ ] `cerak-002`: the Red Wand between its two ever-lit torches (Map449)
- [ ] `cerak-003`: the Graveyard Unit, four stones, the Echoes, the Mother-Sigil and its cache
- [ ] `gilbert-002`: the waystation camp map
- [ ] `gilbert-003`: the caravan graves and Gilbert's one line (Map461)
- [ ] `gilbert-003`: Naren Imports' stock
- [ ] `gilbert-004`: the loop trail
- [ ] `amy-001` and `amy-003`: the map secrets and the deep-entrance mark
- [ ] `silia-002`: the deep-shaft resolution, and the Miner's Charm
- [ ] `nyancy-003`: Cat's Grace, how a cat-woman teaches a passive
- [ ] `frederick-002`: the governance outcomes and the town's dialogue after them
- [ ] `frederick-003`: West Wing housing
- [ ] `cecil-001`: the sparring minigame
- [ ] `cecil-002`: the night patrol route
- [ ] `viktor` and `viskra`: the race, its order tracking, the closure and Viktor's exit
- [ ] `viskra-004`: the exotics, the stone tablet and her masterwork
- [ ] `mittens`: the tribute tiers, Feline Favor and the follow behavior
- [ ] `satoru-002`: his outcome
- [ ] `silverkayla-003`: the destination and the Promise Ring
- [ ] `leo-002`: Leo's Original formulas
- [ ] `alice-002`: the Acolyte's Favor
- [ ] `iris-001`: the Monsterpedia showing drop rates and node chances (plugin work)
- [ ] `iris-003`: the black market's stock
- [ ] `fortuitus-001`: the chase minigame, the five facts and somewhere to log them

## Side quests and unlocks

- [ ] `side-009`: the unlock beat at Leo
- [ ] `side-009`: Leo's exchange, formulas for each page and the finale on the sixth
- [ ] `treis-004`: write the Voltage Baton quest and add it to the quest list
- [ ] Learning with Treis: its event is still a TODO (CE111)
- [ ] Fork unlock quest: Fucking Oni's forks
- [ ] Fork unlock quest: "Quicksilver"'s forks
- [ ] Fork unlock quest: Medick's forks
- [ ] Fork unlock quest: Strategist's forks
- [ ] Fork unlock quest: Debilitator's forks
- [ ] Fork unlock quest: Fate's forks
- [ ] Transcendant and Omniscient: real stats, learnings, and every equip unslotted
- [ ] Transcendant and Omniscient: their unlock path
- [ ] Transcendant and Omniscient: a couple of preposterous skills, the reward for the endless grind
- [ ] The hunt board rebuilt around one named enemy for every group
- [ ] Legendary recipe unlocks placed in the world
- [ ] Survival's study shelf has no way in (CE28)
- [ ] Survival's inherited tier, above Millie
- [ ] Alchemy's "material mastery OK" gate: nothing ever sets switch 128 (CE24)
- [ ] The named two-hander's chest wants a recipe (Map321)
- [ ] Flux Drive homes: Lemon
- [ ] Flux Drive homes: Viridian
- [ ] Flux Drive homes: Aqua
- [ ] Flux Drive homes: Royal
- [ ] The two `Flux Drive: TBD` rows, make them or cut them
- [ ] The relic skill at row 210, still TBD

## Enemies on the new maps

## Harvest nodes to place

## Node names and flavor

## Things nothing supplies

## Named gear recipes

## Enemy passes

- [x] Pass 4: Undead T5s and named
- [x] Pass 4: Reptile T5s and named
- [x] Pass 4: Aquatic T5s and named
- [x] Pass 4: Slime T5s and named
- [x] Pass 4: Plant T5s and named
- [x] Pass 4: Beast T5s and named
- [x] Pass 4: Insect T5s and named
- [x] Pass 4: Humanoid T5s and named
- [x] Pass 4: Construct T5s and named
- [x] Pass 4: Deity T5s and named
- [x] Pass 4: roster stamps on the rough maps
- [x] Pass 5: Undead skills, traits and tricks
- [x] Pass 5: Reptile skills, traits and tricks
- [x] Pass 5: Aquatic skills, traits and tricks
- [x] Pass 5: Slime skills, traits and tricks
- [x] Pass 5: Plant skills, traits and tricks
- [x] Pass 5: Beast skills, traits and tricks
- [x] Pass 5: Insect skills, traits and tricks
- [x] Pass 5: Humanoid skills, traits and tricks
- [x] Pass 5: Construct skills, traits and tricks
- [x] Pass 5: Deity skills, traits and tricks
- [ ] `<no:exp>`, `<no:gold>`, `<no:ap>` and `<no:sdp>` on the breakables
- [ ] The Monsterpedia draws the character sprite

## Optional areas

- [ ] Crystalline Ravine: loot on the thirteen islands
- [ ] Crystalline Ravine: decide when the door opens
- [ ] Seashell Shores: the tide spawns as time pages
- [ ] Seashell Shores: treasure
- [ ] Desolate Graves: the ghost and the legendary rite (Map478)
- [ ] Desolate Graves: treasure
- [ ] Windward Tunnels: loot in the pockets
- [ ] Windward Tunnels: lights for the ambient dark

## Loose ends

- [ ] Northwestern Depths: its rope posts connect to nothing yet
- [ ] Dangerous Oneway: what the rope chest holds
- [ ] Northern Caverns: a reason to go there
- [ ] Marshy Secret: a secret
- [ ] Terraced Cliffside: a way to drop down to the crack
- [ ] Derelict Fork: its east posts pointed at the Frostbite Fields, which are gone
- [ ] Passage 8: its rope posts, once the Basin mouth is picked (Map102)
- [ ] `main-005`'s first objective sits off the road (Map116)
- [ ] The elemental cutscenes point their bubbles at the events that show them
- [ ] Onboarding: the armor path on the main rail, T-04 and T-05
- [ ] The save tutorial moves into the intro cave
- [ ] A couple of side quests for the people in the pub
- [ ] The deadly guard's warning should say something silly (Map276)
- [ ] Two known one-way doors: Raevula's north exit, and Kadepths to the Extended Tunnel
- [ ] Ice-slide puzzles under pixel movement: check they still work
- [ ] Iris Threads, Giga Deflect and Giga Protect still say TBD in their descriptions
- [ ] The Whisk's real icon
- [ ] Yelena's line about a utensil merchant who never existed
- [ ] Icons for the folk quests, their category and the ch5 tag
- [ ] Clear out the Recipe Journal leftovers (CE31, CE161-163)

## Calls to make

- [ ] Is the style picker, and the family prep line behind it, in 1.0?
- [ ] Is the HUD redesign in 1.0?
- [ ] Are spawner enemies in 1.0?
- [ ] One fork quest per trunk, or one per fork?
- [ ] Names for Sloth, Lust and Envy
- [ ] Where the meal happens, and whether Nare gets a map
- [ ] What fills the drop rows the berries left behind?
- [ ] Do ingredients need descriptions? 396 items have none
- [ ] Jerald and Rupert's new sprites from the character generator: in 1.0?
- [ ] Every character sheet a `$` single: in 1.0?
- [ ] Are the onboarding backlog's P1 and P2 beats in 1.0?

## After the line

- [ ] One full playthrough
- [ ] The balance fixes that playthrough turns up
- [ ] Player bundles and the release workflow, paused since 2026-10-17
- [ ] Prune the images and audio the game never uses
- [ ] Refresh `docs/enemies/main.md`
- [ ] Walkthrough guide
- [ ] The SDP boot check that throws on an unassigned subgroup, due at 1.0.0
