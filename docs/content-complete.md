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
- [x] Absolute Solitude and its neighbours: already the Vampire King's kit, all four in use (Map284)

## The Frozen Fortress

- [x] The gate opens to the hypercube, and the point of no return is signposted (Map116)
- [ ] Entry hall: the mundane exchange, the spring trap and the trapdoor (Map411; the trap and trapdoor are wired,
      the exchange's lines are Jeremy's TODO)
- [x] Who to follow: the moogle-style pick (Map411)
- [ ] Party cycle off from the trap to the reunion, with the dead button beat (cycling is dead from the pick and
      live again from the reunion; the beat's lines are Jeremy's TODO, in CE25)
- [x] Sigils in the six switcher rooms move between lanes, and save with no way out
- [ ] Rafters: the spring lands Jerald on the beam, with the hall as parallax (Map413; the landing is wired and
      his beat on the beam is Jeremy's TODO; the parallax waits for the polished hall)
- [x] Landing and slide: Rupert's fall, and no climbing back up (Map429; the slide's line is Jeremy's TODO)
- [ ] What the hazard grate does to Rupert (Map430, Map434, Map435; the grate is plain passable floor today, so
      the field's hops and bridge save nothing until this is decided)
- [x] The floor collapse: unskippable, with its cross-cut and variant line (Map415; the cut into the goop is CE36,
      and the variant line is Jeremy's TODO)
- [x] The lever: unskippable, with its cross-cut and variant line (Map431; the cut up to the elevator is CE29)
- [x] Goop Ocean: the fallen chunk becomes the bridge (Map433)
- [x] Dead elevator: power-gated, riding up to the Bolt Gallery (Map418; the block flag, the cross-cut in CE29,
      and the variant line's TODO)
- [ ] Bolt Gallery: traps in the niches, and Jerald's line about the old castle (Map419; the seven traps are in,
      and the line is Jeremy's TODO)
- [x] Needless Hazards: destroying them all reverse-charges the circuit (Map420)
- [x] Hazard Field: the switch puzzle, the jumps, and the light bridge both ways (Map435; the puzzle is a
      placeholder of three coloured switches whose order the stones' lights give)
- [ ] Mini-boss: the elysian ghost (Map422)
- [ ] Mini-boss: the horde (Map438)
- [x] Elevator ride: the climbing parallax, the robot waves and the care package trigger (Map423, Map424; the
      parallax is a placeholder made from the tower's own stone)
- [ ] Cultists' Lair: torches lighting as he nears, demon waves off the platforms (Map439; the torches are in,
      and the waves wait for the votary rows)
- [x] Dome Approach: the barely perceptible button (Map440)
- [x] The two care packages in the final switcher rooms (Map425, Map441)
- [ ] The fall: the tumble, the flip motion, the monologue, the forced flip to Rupert (Map426, Map417; all wired,
      with the monologue and the thought bubble as Jeremy's TODO, and the shaft's windows still to place)
- [x] The VERY convenient elevator: Rupert's exit, the forced flip to Jerald (Map443; his remark and the thought
      bubble are Jeremy's TODO)
- [ ] The reunion, with both duration lines (Map411; the elevator, the drop and the party back together are wired,
      and both duration lines are Jeremy's TODO)
- [x] The courtyard gate needs the key behind Envy and the power (Map411, Map444; the key is a placeholder row,
      item 175)
- [ ] Votary rows 596 (Lust's succubi) and 598-599 (Greed's two shades); 597 is Hunger's, postgame
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
- [ ] Envy: her row, her sheet and her phase-4 glitch look (Map426)
- [ ] Envy: the scene with the chatter stream under it (Map426)
- [ ] Envy: Jerald's flashbacks, Weird Island and the morph manifestation
- [ ] Envy: the fight, Grudj's stolen remote cranked through four phases, then his intercom (Map426)
- [ ] Grudj: his row and sprite, and stepping out from behind the statue (Map444)
- [ ] Grudj: the reveal and the thesis, said out loud (Map444)
- [ ] Grudj: the scrambler machine's cycle, ailments and SDP blackout (Map444)
- [ ] Grudj: Meltima as an enemy skill with a ten-second cast
- [ ] Grudj: the arsenal, blinks, beams, spirals, zap traps, quakes and void zones
- [ ] Grudj: the desperation cooldown reduction
- [ ] Grudj: the Treis gate, the baton's zap and the paralysis that never lands
- [x] Earthie: design the fight, since all four elementals get fought
- [x] Earthie: build the fight
- [ ] The sin panels drop from the right fights, with their real parameters

## Holding the story together

- [ ] Chapter 4's opening beat: who points the duo at the two disks
- [ ] Main quest for chapter 4, its objectives and logs
- [ ] Main quest for chapter 5, its objectives and logs
- [ ] The teleportal hub reckoning, and the Nimbus and Subterranean doors (Map194)
- [ ] RGB Technohypercube: the fusion at the Spacial Flux Engine
- [ ] `side-007`, the disk and hypercube descriptions read as the hypercube flow, and its third step can be moved
- [ ] The Bleu disk gate: what it opens (Map280)
- [ ] The Greed reveal: its thresholds, Trainer Lord's lounge line, and the mirror battle he throws the duo into
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
- [ ] `leo-002`: the scene that unlocks Leo's Original (its eight gems and recipes are built, locked until then)
- [ ] `leo`: the new quest before "The Student", finding out what happened to his master, finished by killing Pride
- [ ] `alice-002`: the Acolyte's Favor
- [ ] `iris-001`: the Monsterpedia showing drop rates and node chances (plugin work)
- [ ] `iris-003`: the black market's stock
- [ ] `fortuitus-001`: the chase minigame, the five facts and somewhere to log them

## Side quests and unlocks

- [x] `side-009`: the unlock beat at Leo
- [x] `side-009`: Leo's exchange, formulas for each page and the finale on the sixth
- [ ] `treis-004`: write the Voltage Baton quest and add it to the quest list
- [ ] Learning with Treis: its event is still a TODO (CE111)
- [ ] Fork unlock quest: Fucking Oni's forks
- [ ] Fork unlock quest: "Quicksilver"'s forks
- [ ] Fork unlock quest: Medick's forks
- [ ] Fork unlock quest: Strategist's forks
- [ ] Fork unlock quest: Debilitator's forks
- [ ] Fork unlock quest: Fate's forks
- [ ] Transcendent and Omniscient: real stats, learnings, and every equip unslotted
- [ ] Transcendent and Omniscient: their unlock path
- [ ] Transcendent and Omniscient: a couple of preposterous skills, the reward for the endless grind
- [ ] The hunt board rebuilt around one named enemy for every group
- [ ] Legendary recipe unlocks placed in the world
- [x] Survival's study shelf has no way in (CE28)
- [ ] Survival's inherited tier, above Millie
- [x] Alchemy's "material mastery OK" gate: nothing ever sets switch 128 (CE24)
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
- [x] `<no:exp>`, `<no:gold>`, `<no:ap>` and `<no:sdp>` on the breakables
- [x] The Monsterpedia draws the character sprite

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
- [x] The elemental cutscenes point their bubbles at the events that show them (2026-11-23: the elementals stopped
  being party members, so the chatter scenes they talk in now bring their spirits out beside the duo with common events
  114 "Show Elementals" and 115 "Hide Elementals", and every elemental line bubbles off its spirit, The Bellows'
  pre-boss scene included. Three checks still asked for Earthie in the party and now ask whether she has joined
  (switch 66), which also unblocks cleansing Aqualock's bubble on Map192. Map167's "learn: support members" tutorial is
  gone. Two water-faced lines still carried Skye's nameplate from when Skye and Aqualock traded actor slots; both read
  Aqualock)
- [x] Onboarding: the armor path on the main rail, T-04 and T-05
- [x] The save tutorial moves into the intro cave
- [ ] A couple of side quests for the people in the pub
- [ ] The deadly guard's warning should say something silly (Map276)
- [ ] Two known one-way doors: Raevula's north exit, and Kadepths to the Extended Tunnel
- [ ] Ice-slide puzzles under pixel movement: check they still work
- [ ] Giga Deflect and Giga Protect still say TBD in their descriptions, until Jeremy decides what they become: "they are
  expected to radically change and enhance their respective guard types" (2026-11-22). Iris Threads' "TBD" is part of
  its joke ("yet to be determined") and stays
- [ ] The Whisk's real icon
- [ ] Yelena's line about a utensil merchant who never existed
- [x] Icons for the folk quests, their category and the ch5 tag (2026-11-22: each line got its own icon, picked for who
  they are and what they do, at Jeremy's word. The folk category already had icon 82, and the ch5 tag icon 2060, the
  grey book in the chapter set)
- [x] Clear out the Recipe Journal leftovers (CE31, CE161-163) (2026-11-22: nothing was left. CE161-163 and items
  461-463 were already blank, and CE31 "Recipes init" is live, the innkeeper's five starter recipes, called from Map28,
  Map1 and Map221, so it stays)
- [ ] J&R's lines that say they wiped out Majik's whole species (Map172, Map284, Map320)
- [ ] The HUD redesign (in 1.0.0, Jeremy 2026-11-22; what it covers is still being decided)
- [x] Every character sheet a `$` single (in 1.0.0, Jeremy 2026-11-22: "everything", objects and unused sheets too). Cut the same day: 155 sheets into 1,060 singles, every event repointed; the two unused off-grid sheets (`m_bats-sm`, `m_slimeMedium`) deleted at his word
- [x] Onboarding: the P1 and P2 beats (in 1.0.0, Jeremy 2026-11-22: "I can't have an incomplete tutorial"). Settled the same day: the save talk, the Monsterpedia lines and the parry corner built; the lap and the weapon blurbs already covered; the rest dropped (see `tutorials/onboarding-backlog.md`)

## Calls to make

- [x] Is the style picker, and the family prep line behind it, in 1.0? (No: parked for 1.1.0, Jeremy 2026-11-22)
- [x] Is the HUD redesign in 1.0?
- [x] Are spawner enemies in 1.0?
- [x] One fork quest per trunk, or one per fork? (Per trunk, Jeremy 2026-11-22: six quests plus the two pointers, one objective per fork; see `quests/fork-quests.md`)
- [x] Names for Sloth and Lust
- [x] Where the meal happens, and whether Nare gets a map (Nare, Jeremy 2026-11-22: he builds the map himself, custom at first for the scenes after the last boss; the tower stays post-game)
- [x] What fills the drop rows the berries left behind? (Nothing, Jeremy 2026-11-22: "Goodbye berries." Every drop comes from `<drops>` tags now)
- [x] Do ingredients need descriptions? 396 items have none (Yes, Jeremy 2026-11-22. Filled the same day: the 250 rows of `food/recipes.md`, eleven trimmed to fit the help box's two lines, and the 145 raw ingredients, 60 of them his own lines from before the redesign (the old armor rows in git, and `food/backup-items.yaml`), carried over as written. He tempers every description in the database later, in one pass. Soular Energy, which nothing referenced, was deleted at his word: "delete it.")
- [x] Jerald and Rupert's new sprites from the character generator: in 1.0?
- [x] Every character sheet a `$` single: in 1.0?
- [x] Are the onboarding backlog's P1 and P2 beats in 1.0?

## After the line

- [ ] One full playthrough
- [ ] The balance fixes that playthrough turns up
- [ ] Player bundles and the release workflow, paused since 2026-10-17
- [ ] Prune the images and audio the game never uses
- [ ] Refresh `docs/enemies/main.md`
- [ ] Walkthrough guide
- [ ] The SDP boot check that throws on an unassigned subgroup, due at 1.0.0
