# The Hunting Lord

## Location
Raevula, the northwest section, inside the Hivemind Guild — behind the counter, behind the receptionist, behind
an air of knowing more than they say. The upstairs VIP floor is off-limits ("I'm afraid you don't have permission
to go up here").

## About
The Hunting Lord does not reveal their name — because, per the Lords cosmology (see `../../story-canon.md`), a
Lord's title IS the function. This is one of the benevolent Lords, running the anomaly-bounty system out of a
guild in a hub town, which raises questions nobody in-game thinks to ask (why does a being of that caliber
process paperwork in Raevula?). **Deliberately unexplained**, like the rest of the Lords.

**The VIP floor: OPEN mystery.** Someone ranks above the player at all times. Who has VIP status in a guild run
by a Lord? Unassigned — a free slot for future canon. Do not spend it cheaply.

**Reward family: hunts** — named-anomaly materials, sin-SDP drop routing (lesser spawns), guild rank.

## Quests

### The board rework (talked through 2026-11-06 and 11-07, nothing built yet)
Named enemies are often literal mythical entities now, and a god at level 15 feels wrong, so they're being made as
chapter 5 types of enemies instead. That leaves the early board with nothing to post, so the board changes what it
hunts. Each step opens as soon as the player finishes the one before it, with no chapter gates:

| Step | Targets | Standing |
|---|---|---|
| Wave 1 | A few stripes, a few mutants | Agreed |
| Wave 2 | Several stripes | Agreed. Later hunts ask for better tiers; the exact tiers wait for implementation |
| Wave 3 | Particular mutants, planted by region | Agreed |
| Freaks | The 30 freak named, in waves | Agreed. The sort and the waves wait for implementation |
| Gods | The 17 god named, as the finale | Agreed. The sort and the waves wait for implementation |

The board names are working labels.

#### Why the Lord doesn't have to change
Their script (Map300 ev5, CE44) already says nearly all of this:

- **Myths fit the definition:** an anomaly is "a space-time distorted monster that roams the land as a direct
  result of your choice to register with the Difficulty Lord."
- **Mutations are already anomalies:** "there is also another form of anomaly to be aware of", regular creatures
  "empowered beyond their normal levels", and "their rewards are greater."
- **The flux loop is already promised:** "the more flux drives you activate, the less stable space and time is,
  resulting in even more and greater enemy mutations."
- **The stripe is already taught:** mutated creatures "will have a small colored stripe by their name and level."
- **Later boards are already teased:** clearing the third wave says the board has "even more anomalies I've
  identified- some of which are getting rather deadly", with nothing behind it today.
- **Nothing promises a chapter:** waves gate on clearing the previous wave, and `ch1`-`ch3` are only quest tags.

One line will want a touch: "I will commission you for quests on a per-anomaly basis" doesn't fit a bounty on any
few striped creatures.

#### The two hunt kinds
Two different hunts, for variety:

- **Stripes, the increasingly dangerous ones:** prefixes carrying `<affix-tier:N>` (Origin, Vintage, Prime, Grand,
  Elysian). This is the hunt the flux loop feeds.
- **Mutants, the weird ones:** every affix that draws no stripe, because not every mutant is stronger. That's the
  ten plain prefixes (Dull, Fractured and the rest), which only weaken (Dull is x0.9 attack and defense), and the
  suffixes, which are ten element families: Cut, Poke, Blunt, Heat, Liquid, Air, Ground, Energy, Void and
  Typeless. Each family has its own ladder. In six families the base suffix drops an ingredient (Char drops Spicy
  Herbs, Brine drops Minty Herbs).

**Planting mutants by region:** particular mutants go where their element makes sense:

| Element | Homes |
|---|---|
| Heat | Volcanis Grotto |
| Liquid | Forlorn Basin, Deluge Valley |
| Ground | Earthen Layer, Crystalline Ravine |
| Air | Outer Cliffs, Negative Peaks, Windward Tunnels |
| Energy | Pearlsalt Mines, Nimbus |
| Void | Subterranean, Fallen Kingdom |

Heat is the only element with one zone. No other zone uses Volcanis's lava, and a corner of a zone another element
already owns wouldn't read as hot. So Heat's late home is Volcanis's own deep end, the spots it already holds for a
stronger player: behind the Titan fence (Direct Heat and Extended Tunnel), and beside the T5s, Molten Souffle in
Kadepths and Surtr in Fiery End.

Every element has a home in chapters 1-3, so wave 3 works whenever it opens. Cut, Poke, Blunt and Typeless have
no home and stay wild. Planting is data only: an enemy event's `<passive:[ID]>` comment beats the random roll, the
same way the Peaks boss wears Prime, and a planted event never rolls a random stripe on top. Planting also lets a
posting say where to look, the way a named posting does.

**Spotting the kill:** `J.PASSIVE.EXT.AFFIX.Helpers.resolvePassiveTierRank(enemy)` returns the stripe tier, or 0
for no stripe, so a stripe bounty needs no new tag and gets a minimum tier for free. A mutant bounty checks whether
the enemy carries any state from a list, which covers every mutant, one family or one specific affix. Passives live
apart from what `die()` clears, so the affix should still be readable in `onDeath`. That comes from reading the
code, so prove it with a test when this gets built.

#### The flux loop
Turn a drive on, the battle is affected, stripes get more common, and stripes pay more. Both ends already work, so
the middle is only data.

- **The payout already works:** each tier's `<rewardMultiplier>` tags scale EXP, gold, SDP, AP and drops on the
  kill.
- **The commonness is unset:** it lives in each layer's `affixEffects` in `config.difficulty.json`, which all seven
  layers leave empty today.

| Knob | What it does for stripes |
|---|---|
| `prefixChance` | **More** stripes. Every tier rises equally. A percent multiplier (100 changes nothing), and drives multiply together |
| `flatten` | **Better** stripes. Pulls every prefix toward the pool's average, which is what makes the rare tiers show up |
| `suffixChance` | Nothing, since suffixes draw no stripe |
| `grants` | Nothing yet. Only for affixes reserved at weight 0, and CA has none |

The Lord's "even more and greater" is those first two knobs.

Today's odds per spawn at the 8% default prefix chance, with made-up settings for scale:

| Setting | Any stripe | Prime or better | Elysian |
|---|---|---|---|
| Flux off | 1 in 49 | 1 in 395 | 1 in 3,356 |
| ×2 chance | 1 in 24 | 1 in 197 | 1 in 1,678 |
| ×2 chance, flatten 50 | 1 in 21 | 1 in 54 | 1 in 178 |

Stripes top out around 1 in 4 enemies, or 1 in 3 at full flatten, because the ten plain prefixes share the pool.
Six drives at 150 is already 91% of enemies rolling a prefix, so lowering the plain weights is what raises that
ceiling.

A drive can also pay directly: `<rewardMultiplier>` on its enemy state should apply to every kill under that drive,
striped or not. That comes from reading the code and hasn't been tested. None of the six carries one today.

#### The named boards
These are what close the "hunt board rebuilt around one named enemy for every group" line in
`../../content-complete.md`. The sort reads the name alone: a pun or invention is a freak, a straight name from
somebody's legend is a god. Levels play no part, since every named is late power. Spawn sites and the echo rule
stay as they are, and many of these live in chapter 1-3 zones, so the boards send the player back to old ground.
Since the boards are sequential and every named is late power, a board can open before the player can win it. That
makes it a come-back-stronger list, like the T5 spots, and the Lord already says "There is no rush."

First cut. The real sort waits for implementation:

- **Freaks (30):** Beelzebuck, Big Bad, Blistering Blaze, Buzzkill, Clawdius, Disastrophe, Failsafe, Forcman,
  Freeloader, Ghastly Ghosty, Godless Glaze, Holy Shiitake, Jellyviathan, Kapn' Kappa, KILLER, Lizard King,
  Magi Goo Bat, Magnum Opus, Octimperatrix, Queen of Stone, Safeword, Segfault, Sharkatana, Spoop Maestro,
  T-Wrecks, Tesseract, Venus, Vice Cobra, Wanted Criminal, Well-diver.
- **Gods (17):** Asterion, Benkei, Bjarki, Draugr, Fafnir, Heqet, Huginn, Mistletoe, Nidhogg, Nirvana, Odin's Eye,
  Polyphemus, Prometheus, Puck, Ratatoskr, Stheno, Yggdrasil.
- **Close calls:** Beelzebuck, Big Bad and Venus (sorted freak), Puck (sorted god).

#### Rewards (a leaning, decided at implementation)
- **Mutation waves:** today's flux capacity chips, 1, 1, then 2.
- **Freak and god boards:** maybe rare materials, maybe unique accessories for hunting. One shape: a unique
  accessory per board clear, themed on what was hunted, with rare materials for the bounties in between.

#### Left for implementation
Nothing is waiting on a ruling. These get decided while building:

1. How many kills each bounty asks for, and which tiers. Later hunts ask for better ones.
2. What the freak and god boards pay.
3. The freak and god sort, and how each board splits into waves.
4. The `affixEffects` numbers, drive by drive.

#### To build
- **J-Omni-Quests:** Slay learns two new matches, "any striped enemy, minimum tier" and "any enemy carrying one of
  these affix states". That touches the match in `Game_Enemy.processSlayQuestsCheck`, `SlayData` and its tracked
  copy on `TrackedOmniObjective`, and the objective line, which prints `Defeat 0 / 1 \Enemy[id].` and has no id to
  print here. J-Passive-Affix is an optional sibling, so the read needs one namespace check or a seam.
- **jmz-data-editor:** the new Slay fields (`QuestSlayData`, `Quests.d.ts`, `ObjectiveFulfillmentData.tsx`), plus
  fields for `affixEffects`, which the difficulty board carries through but can't edit.
- **CA data:** the hunt rows, CE45's postings, CE44's wave gates carried on through the freak and god boards, the
  planted mutant events, and the Lord's one line above.
- **Check what shouldn't count:** inanimate rows without a `<no-rng-*>` tag can roll a stripe. The Peaks boss's
  hand-placed `<passive:[303]>` should also read as Prime, so decide whether a scripted boss counts toward a bounty.

### The anomaly chain: `hunt-001` … `hunt-012`
What the data holds today, and what the rework above replaces. Authored in `config.quest.json`: three waves of
named anomalies (Kappa → Wraith → Faerie → wave gates → Wisp, Goobat, Cobra → Thief, Crab, Bear). The TBD
thirteenth was removed on 2026-09-28; anything past the third wave is an extension below. This doc just anchors
them to the NPC.

### Proposed extensions (`???`)
1. **Wave 4 — the Deluge Safari** (post-ch4): the Deluge Plains + Windward Tunnels named-enemy roster becomes the
   guild's biggest board yet (zone doctrine: Deluge = the safari zone). Overlaps the named boards above.
2. **Guild Rank**: cumulative hunt completion earns rank titles with small permanent perks (board discounts,
   anomaly tracking on the map). Final rank... still doesn't get you upstairs.

#### After effects
- Each wave cleared visibly updates the guild hall (trophies on walls — Yelena would approve).
