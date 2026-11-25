# Alchemy Pages

This effort is unlocked as a part of the quest "side-009" aka "The Journal of Alchemy". Each objective of the quest
will suggest the player reach some vaguely-described location where a page of the journal may be. After completing
each objective, the player can return to the alchemist to exchange the page for more formulai.

Reworked 2026-10-26 (Jeremy): the places moved into the quest's overview as the bird's six haunts, and the objectives
count turn-ins instead, from "Bring Leo a journal page (1/6)" to "Bring Leo the last page (6/6)". The player keeps
track of which spots they've already checked.

The location of the pages are below.

## First page, The Great Bird

The first page is in the possession of a giant named bird monster- an alternative Garuda- on the Negative Peaks. The
named bird only shows up for four hours in the early morning (4a-8a game time). Defeating it will give the player access
to its nest and in turn the first page.

No chest: per [nimbus.md](../maps/nimbus.md), the bird is a `!`-named rare with a fixed nest map in Nimbus's airspace,
and it drops this page along with Leo's rucksack. The 4a-8a window stands. The bird isn't in the database yet, so this
page has no source until it is.

## Second page, The Watery View

The second page is available for the player by simply reaching the southeastern elevated section of the map in the
Lakeside Road field. This requires the snakerope to reach.

Placed 2026-10-26: a chest on top of the rock pillar that stands in the lake on Lakeside View, `Map121` (24,7). That
pillar is the one spot on the map only the rope can reach, so the page went there instead of the southeast. Its rope
posts went in on 2026-10-27: one on the pillar right under the chest, at (24,8), and its partner on the shore six
squares straight below, at (24,14), so the pull lands the player facing the chest.

## Third page, The Warm Spot

The third page is available on the Northern Way of the Highwater Way field. This requires the snakerope to reach, but
the player should have that by the time this map is accessible.

Placed 2026-10-26 on the Eastern Way instead, where the quest's own hint pointed at the time ("Find the journal page
on the Eastern Way of Highwater Way"): a chest in the hilltop camp between the fire pits and the dead trees, `Map256`
(43,6). The stairs reach it, so it needs no rope.

## Fourth Page, The Hunting Spot

The fourth page is found in the Forest of Dreams dungeon, in the western-most section at the top of the multiple
cliff-jumping map.

Placed 2026-10-26: a chest at the far west end of the top terrace on Cliff Jumping, `Map069` (8,15), at the cliff's
edge just below the tree line.

## Fifth Page, The Toothpicks (???)

The fifth page is located on the north eastern part of the Terraced Cliffside map, within the Outer Cliffs field. The
player has to jump down from the top area to reach the cliff that has the page on it.

Moved 2026-10-26 to the east ledge on Scaling the Cliffs, `Map111` (51,14), just past a cluster of spires (the
toothpicks). Terraced Cliffside's drop-down doesn't exist yet, and the east ledge was kept to hold a treasure. Getting
there takes bombs for the crack and the snakerope through the rope cave (`Map182`). The ledge's east end is getting a
cliff cap, so the chest sits three squares in from the map edge.

## Sixth Page, The Seafood Spot

Added 2026-10-26 (Jeremy: "The cove on low tide is basically begging for one of those pages"): a chest in the Seashell
Shores' cove at low tide, `Map455` (50,15), tucked between the east tide pool and the cliff. The cove only drains at
moontide and in the afternoon. In the quest it's the sixth haunt in the overview: "go for seafood wherever the tide
goes out", which doubles as a tide clue.

## The page item

Decided 2026-10-26: every page is the same item, `Items[155]` "Alchemy Page", a sibling of the scraps in
`Items[151]`-`Items[154]`: one shared row with the next book icon along (1668) and "Turn these in for formulas to
Leo." Because the pages are interchangeable, "the last page" means the sixth one turned in. Turning in the sixth
completes the journal, and its payoff is the Philosopher's Stone recipe the quest overview promises.

Every chest is `chest-alchemy-page`, a copy of the Pearl Salt Mines' ore chest (`Map098` event 45): the same sound
and opening, one `\Item[155] was found!` line, and the page.

## Turning pages in

Decided 2026-10-26 (Jeremy): the quest moves at Leo, not at the chests. Every page found is turned in to Leo, and each
one teaches a set of formulas, better the more pages have come in. Turning in the last one gets "wow, you've found 'em
all!", and from there the quest wraps up and probably unlocks whatever comes next. The chests only announce the page
and hand it over.

- **The objectives count pages** (decided 2026-10-26): six turn-ins, 1/6 through 6/6, each moved along by
  `progress-quest` at Leo, since Leo only ever sees how many pages come in. The six places live in the overview as the
  bird's haunts, condensed from the old objectives' guesses, and the old "Perfect guess!" lines are the turn-in
  reactions now.
- **The beat that unlocks side-009 at Leo** is `unlock-quests` and `set-quest-tracking`, with no `progress-quest`:
  unlocking already makes the first turn-in, "Bring Leo a journal page (1/6)", active, and a `progress-quest` there
  would count a page nobody has brought yet. Built 2026-11-22 on his hunt page (`Map034` ev3 page 3), beside the
  switch that starts the hunt.

### The exchange as built `2026-11-22`

Leo's "I've got new pages." (`Map034` ev3 page 4) takes every page the party carries, one at a time: the duo read
each one aloud to him (the journal isn't in Erocian), variable 30 `journal pages turned in` counts it, his reaction
plays, the page's formula event runs, and `progress-quest` moves side-009 along. The sixth completes the quest. With
no pages he says so, and once the journal is whole he says that instead.

| Turn-in | Formula event | Teaches |
|---|---|---|
| Rescue | CE34 `Alchemy init` | Serum I, Ether I |
| 1 | CE190 `journal page 1` | gems tier 1 |
| 2 | CE191 `journal page 2` | gems tier 2 with Serum and Ether II (CE181), Cut, Poke and Blunt glyphs, Undead, Slime and Beast seals, Weapon Killer |
| 3 | CE192 `journal page 3` | gems tier 3 with III (CE182), Heat, Liquid, Air and Ground glyphs, Reptile, Aquatic, Insect and Plant seals, Flying Killer |
| 4 | CE193 `journal page 4` | gems tier 4 with IV (CE183), Energy and Void glyphs, Humanoid, Construct and Deity seals, Aura Killer |
| 5 | CE194 `journal page 5` | gems tier 5 with V (CE184) |
| 6 | CE195 `journal page 6` | Shield Killer and the Philosopher's Stone |

Every gem, rune and potion is taught exactly once across those seven events. CE196 (the old `anti-2`) is blank,
since everything it taught moved onto pages 3 and 4. Tier 6 gems are not on the ladder: they are **Leo's Original**,
after Nimbus (see `alchemist-bard.md`).

**His reactions paint the woman who wrote it**, in the order Jeremy approved: he knows her handwriting at once; she
skips whole steps as if the reader should keep up; there's not one name in the margins, not even his, though the
elemental glyph trick was his; she writes of "the next world" like a promotion she was owed; "Perfection is the only
acceptable failure," underlined twice. On the sixth: "Wow, you've found 'em all!", the Stone, her masterwork, "and
never once what she wanted it for", and Jerald's "Philosophy Stone" gets corrected. Nobody names her; the quest
keeps her unidentified until Nimbus.

**The Philosopher's Stone** is `Items[156]`, a key item. Its recipe (`a-philosophers-stone`) fuses one of each top
stone (Star Ruby, Twist Emerald, Imperial Topaz, Ethereal Sapphire, Power Crystal and Rainbow Diamond, all dropped by
the ore nodes) with the Cross-pein, Graver and Alembic. **Holding it opens Material Mastery and Material
Breakdown** at every alchemy station: CE24's gate reads the Stone where it used to read switch 128, which nothing ever
set. The transmutation formula is in [`crafting/material-tools.md`](../crafting/material-tools.md#transmutation-decided-2026-11-22).

## Still to do

- The named bird and its page drop. Decided 2026-11-22 (Jeremy): the bird is the T5 beak, **Hraesvelgr**, "with
  Prime or something attached", living on one of the offshoot maps he'll pick. Until it exists only five pages can
  be found, so the finale, the Stone and Material Mastery can't be reached in play.