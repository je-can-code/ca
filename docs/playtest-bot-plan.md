# The playtest bot, next: reflexes that read like people, balanced levels, scenery, and personas

Written 2026-11-17 from Jeremy's wishlist ("I feel like there is REAL POTENTIAL in mini-claude-vX! Though, we should name
em properly."). Nothing here is built yet. The bot is `tools/playtest/` (`run.js` plus `agent/`); read its header and
`agent/main.js` before starting.

## Ground rules

- The repo stays neutral: no nicknames in code, files or logs. Persona and profile names are Jeremy's call (see Names).
- One playtest at a time (they share `/tmp/ca-playtest`), `--mute-audio` always, and the hidden display stays hidden.
- Every step ends with measured runs, and the report says what each run proved. A profile is judged by numbers, not by
  how a film feels.
- Reflexes stays walk-only unless a step says otherwise, so surviving stays a fair statement about the attack.

## 1. A godlike reflexes profile

**His words:** "frame-1 moving out of the way... basically psychic-level prediction."

- A new `--reflexes` profile beside sharp, sloppy and statue: reaction 0 frames, and it pokes from the tip of its reach
  like sharp.
- **Psychic:** the other profiles only see what a player sees (`collectActiveCastPreviewItems()` and hostile action
  events). This one also reads every nearby enemy's decided action (`getDecidedAction()`) the frame the AI decides, and
  builds the hazard from its skill's shape before any telegraph is drawn.
- **It doubles as the dodge audit.** A hit that lands on this profile is one no player could avoid, so the report gets a
  verdict of its own, `unavoidable`, listing the skill, the caster and why: no way out, or outrun even at frame 0. That
  makes his rule, "every attack should be avoidable", something a run can check.
- **Done when:** the tutorial and three gauntlets run on it, and every hit it takes is reported as `unavoidable` with
  its reason.

## 2. Reflexes that get caught up in the moment

**His words:** "usually moves out of the way in time, but sometimes is too 'caught up in the moment' to dodge- ya know,
like a real player."

- A `human` profile. Its reaction is usually close to sharp, but the chance of reacting late (or not at all) rises with
  how busy the moment is, rather than being a flat random delay. Real misses bunch up:
  - mid-swing, committed to its own attack;
  - two or more threats live at once;
  - its own HP low (panic);
  - its target nearly dead (greed).
- Each factor is a named, tunable weight at the top of `Reflexes.js`, next to the existing profile table.
- The report counts its "caught up" misses apart from every other verdict, so a human miss is never mistaken for an
  unavoidable attack.
- **Done when:** over the tutorial and three gauntlets, its hits land between sharp and sloppy, and most of them happen in
  busy moments.

## 3. Keeping the two levels balanced

**His rule:** "switch when behind by 2+ levels, go again until 2+ levels over, again and again."

- When the other party member trails the leader by 2 or more levels, swap to them, and stay on them until they lead by 2
  or more; then swap back. The band is ±2, so it never flips back and forth on a single level.
- The swap goes through the same input a player uses (Thumbs), never by script. Read which button cycles the party, and
  how this game shares EXP between the leader and the other member, before building it.
- The journal notes every swap with both levels.
- **Done when:** a long run keeps the two within about 2 levels of each other, and the journal shows the swaps.

## 4. Admiring the scenery

**His words:** occasionally "admire the scenery" in some maps.

- Out of combat, on a first visit to a map, it sometimes stops: stands for a few seconds, turns to look in two or three
  directions, maybe walks to the edge of an open area, then goes back to work. Never in combat, never when a hazard is
  live.
- Which maps are worth it: start with a chance on every first visit, and add a short list of Jeremy's favourites if he
  wants some maps to always get a look.
- The journal notes each pause ("admires the view").
- **Done when:** a filmed run shows a few pauses, and a timed run's total cost from them is under a minute.

## 5. Filming a whole dungeon

He asked whether a whole dungeon run could be filmed. It can.

- A probe stages the duo at the dungeon's entrance at the level and gear the dungeon expects, the way the boss probes do,
  then hands control to the bot. Speed 1, filming on (1280x720 at 15 fps).
- **Gap to close first:** the bot cannot heal, use items or guard yet, so a long dungeon can end in a Game Over. Teach it
  to drink a potion below a threshold, and to guard when it has the guard skill and the hit is coming, before a dungeon
  film is worth recording.
- Puzzle rooms that need more than "walk up to everything, try every door" will stall it, and it files a stuck report.
  That is a finding about the room, not a failure of the film.

## 6. Personas that keep their own saves

**His words:** "different agents that manage their own saves trying: godmode one class; spread across all classes;
prefers ranged/melee/magic; and so on."

- Each persona has its own save slots and plays on from them run after run, so a persona can go from a New Game to the
  endgame over many sessions.
- Personas, as a first list:
  - one class taken all the way;
  - spread evenly across every class;
  - a ranged, a melee and a magic leaning;
  - one that never takes a fork, which shows exactly where a player could miss one (his rule: going without a fork has
    to be a deliberate choice, never an "oops, didn't notice").
- **Prerequisites, in order:** saving and loading through the real menus; the rest of chapter 1 (level-ups, SDP, gear);
  reaching the class unlock in The Lavatory; then the class, skill and AP choices each persona makes.
- This is the long pole. It is worth planning in more detail once steps 1 to 4 have landed.

## Order

1, 2, 3, 4, then the healing and guarding that step 5 needs, then 5, then 6. Each step is its own pass with its own
measured runs.

## Names

**The taste tester brigade is in** (Jeremy, 2026-11-17: "taste tester brigade is great lmao. Lets do it. But we'll decide
when building"). They are taste testers rather than playtesters, and the reflex profiles are a kitchen brigade: statue
the commis, sloppy the line cook, sharp the sous chef, godlike the executive chef, and `human` somewhere between. Which
names land where, and what the personas are called, gets decided with him while building.
