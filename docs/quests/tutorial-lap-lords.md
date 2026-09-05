# Forcing the Lords: the Academy and the Tutorial Lap

Status as of 2026-09-04: **quest data and event wiring are in. Dialogue is not.**

Three otherwise-optional characters are now mandatory. `main-001` gates on the **Trainer Lord's**
academy before the inn. The lap in `main-003` used to walk the player mayor's house → smith → pub →
Viskra → forge → mayor; it now walks mayor's house → smith → pub → Viskra → forge → **Difficulty Lord →
Hunting Lord** → mayor.

## How you arrive is the reveal

Nobody needs to explain the hierarchy, because the player is taught it by how they got places.

| | How you get there | What it means |
|---|---|---|
| **Trainer Lord** | a rift opens in a town that has never seen one | he takes you |
| **Difficulty Lord** | you walk in off a blacksmith's gossip | it cannot summon anyone |
| **Hunting Lord** | the lights dim and you are simply *there* | he takes you |

The two real Lords collect you. The imposter needs you to open its own door. By the time the Hunting
Lord reveals that "DIFFICULTY LORD" is a title the machine assigned itself, the player has already felt
the difference twice.

That is also why the Viskra gossip gate is deliberately the weakest of the three. It is the imposter's
summons, and it should feel like one.

## The gating problem

Smithing gates itself: you need a weapon, Viskra needs ore, and neither of you can proceed without the
other. Neither Lord had anything like that — both buildings just sit open in Raevula, so "go visit
them" was an errand with no engine behind it. The two gates below solve that, and only the first one is
a gate in the ordinary sense. The second removes the journey entirely.

### Gate 1 — Viskra's gossip (Difficulty Lord)

She repays the ore with a rumor rather than a job, which is why it does not read as a quest arrow: a
metal person roams the out-of-place building beside the inn, and she finds "a person made of metal"
genuinely amazing. Jerald, who has saved galaxies, does not — *"my imagination is not stimulated."*

**The pull is not the robot, it is Rupert doing the math out loud:** *how many OTHER robots do you see
around here?* That is a question rather than an instruction, so the player arrives at the conclusion
themselves. It also runs the established two-hander — Rupert reads the situation correctly, Jerald
shrugs and follows, exactly as in the lavatory.

Jerald agreeing to *"swing by on the way back to the mayor"* is what keeps this a stop rather than a
detour, and it matches the objective order exactly.

Note the free upgrade to the shipped scene: with this gate, Jerald has **not** come for recipes, so his
answer to `STATE YOUR PURPOSE` — `Recipeeeeeeeeees.` — becomes a non-sequitur instead of a restatement
of his goal.

### Gate 2 — there is no gate (Hunting Lord)

You are not directed to the guild. You are taken. On first completing the Difficulty Lord dialogue the
screen dims with no light source to explain it; Rupert asks why, Jerald guesses a cross-dimensional
summons and does not care, Rupert asks why he is so casual about it, and Jerald says **"Its a secret."**
The screen distorts, they blink, and they are standing in front of the Hunting Lord.

Two things make this work:

- **"Its a secret" is the second use.** The first is the lavatory mirror (`Map358` ev3), and it is the
  only other occurrence in the entire game — verified. Jerald being *bored* by a forced summons implies
  he knew it was coming, which retroactively ties both scenes to the same unnamed source. The payoff is
  Trainer Lord, twenty hours later.
- **The Hunting Lord names the machine by its real designation** — an unpronounceable string of symbols
  — so "DIFFICULTY LORD" is revealed as a title the machine assigned itself. It is an instrument the
  Hunting Lord built to maintain spacial integrity, not a Lord at all.

The geography makes the abduction free rather than costly. The facility sits in Raevula's
`Northeast Section (20)`; the guild and the mayor's mansion are both children of
`Northwest Section (22)`. So the summons carries the party across town in the direction they were
already headed, and they walk out of the guild onto the same map as the mansion. The player is done a
favor and never notices.

**The first scene already confessed this and nobody notices.** The machine's shipped line is
`CORE DIFFICULTY FUNCTIONALITY UNLOCKED.` / `ROLE AS DIFFICULTY LORD ENGAGED.` — it *engaged a role*,
picking the title up like a hat, moments after Jerald yelled "Recipeeeeeeeeees" at it. Against the Lords
definition in [`../story-canon.md`](../story-canon.md) — *the title IS the function; a being who has
mastered their own destiny* — a machine that names itself "Lord" is the one thing in the roster that
cannot be one.

> **Canon revision required.** `story-canon.md` currently lists DIFFICULTY LORD in the Lords roster
> alongside Trainer Lord, the Hunting Lord and the TIME Lordess. That needs a line noting the roster
> contains one instrument that named itself.

## What is already done

### `config.quest.json` — `main-001`

A `Quest` objective requiring `train-000` inserted before "enter the inn", making the academy
mandatory. **No event edits were needed.** The rift autorun (`Map020` ev8 page 0) already fires on
entering the Northeast Section, already calls `progress-quest main-001`, and already unlocks
`train-000` on the very same page — so the gate activates the moment the rift is noticed, and clears
itself when the academy is finished.

The auto-clear works because `flagAsCompleted()` calls `_processQuestCompletionQuestsCheck()`, which
sweeps for active `Quest` objectives whose requirements are now satisfied and advances them. Same
mechanism `main-003` already uses for `side-001`.

| new id | was | objective |
|---|---|---|
| 0-1 | 0-1 | unchanged, leave the cave and reach Raevula |
| **2** | — | **complete `train-000`** (the academy through the rift) |
| 3 | 2 | enter the inn |

The dialogue already has both of them agree to go — *"Maybe we should check it out?"* / *"I think so."* —
and the player could previously walk straight past. The gate just makes them keep their word.

**Ordering consequence, and it matters:** the academy now lands before the lavatory class-selection
scene, which sits inside `The Comfy Bear` in the same Northeast Section. So the player stands in front
of Trainer Lord *before* Jerald ever says "Its a secret" about the mirror. The source is met and not
recognised.

### `config.quest.json` — `main-003`

Two `Indiscriminate` objectives inserted after the `side-001` gate, and every objective renumbered so
ids stay contiguous. Sequence is array order, not id value (`_fastForwardToNextObjective` uses
`objectives.find`), so the renumber is cosmetic but keeps the file honest.

| new id | was | objective |
|---|---|---|
| 0-4 | 0-4 | unchanged, through the `side-001` quest gate |
| **5** | — | **follow up Viskra's gossip and register with the machine** |
| **6** | — | **be taken to the Hunting Lord** (no travel; the meeting comes to you) |
| 7-12 | 5-10 | unchanged, mayor through the boss |

**The objective log text is placeholder.** Functional and roughly the right voice, written to make the
quest legible rather than to be good. Punch it up.

### Event wiring

| File | Event | What was added |
|---|---|---|
| `Map032.json` "The Metal Petal" | ev1 `viskra the apprentice`, page 3 | comment stub — the gossip gate goes here |
| `Map238.json` "Engine Room" | ev4 `difficulty lord`, page 0 | `progress-quest main-003` guarded on switch 10, plus a stub for the dim-and-abduct beat |
| `Map300.json` "Main Area" | ev5 `Talk to Receptionist`, page 0 | `progress-quest main-003` guarded on switch 10, plus stubs for the designation reveal |

Both Lord scenes were **already fully written** and needed no new dialogue; they were simply never tied
to a quest. Page 0 of each ends by flipping its own gate switch (`sw90 enable: difficulty`,
`sw148 enable: anomalies`) and hands off to a repeat page, so each `progress-quest` fires exactly once
by construction. No new switches were allocated.

The guard is `switch 10` (`enable SMITHING`), which turns on during `side-001`'s forge step — one beat
before objective 5 activates. On for anyone arriving through the lap, off for anyone who wandered in
early.

## What is left

1. **Write the gossip dialogue** at `Map032` ev1 page 3. Everything depends on it — without it the
   player is told to go somewhere by the quest log and by nothing else in the world.
2. **Write and wire the abduction** at the tail of `Map238` ev4 page 0: dim, bicker, "Its a secret",
   distort, transfer to `Map300`.
3. **Restructure the arrival on `Map300`.** ev5 currently triggers on `2` (event touch — you walk into
   the receptionist at the counter). If the abduction drops the party in front of the Hunting Lord, that
   scene has to become the arrival instead, and the `progress-quest` rides along with it.
4. **Playtest the order**: register, get taken, and confirm objectives 5 and 6 complete in sequence and
   7 activates at the mayor's hall (`Map037` ev10 still drives that).
5. **Revise the Lords roster** in `story-canon.md` per the note above.

## Open decisions

**"There aren't even lights in this building"** — the facility exterior is conspicuously advanced. An
unlit interior may undercut that. Lights that are visibly working and dim anyway is the stronger read.

**An early wanderer consumes the scene and gets no quest credit.** Both buildings are open from the
start, so a player exploring during `main-002` can trigger either page 0 before switch 10 is on. They
get the system unlock — correct, and should not be taken from them — but page 0 never runs again, so the
matching objective can never complete and `main-003` stalls. Three ways out:

- **Accept it**, on the grounds that most players will not detour. Cheapest; a real stall if wrong.
- **Catch up on the repeat page.** Add the same guarded `progress-quest` to page 1 of each event with a
  second condition so it fires once. Costs two new switches.
- **Gate page 0 itself behind switch 10**, so neither Lord is reachable before the lap. Cleanest state
  machine, but it makes both rooms inert to an early visitor — arguably worse than the bug.

Left undecided on purpose: it is a design call about how much wandering the player is allowed, not a
mechanical one.
