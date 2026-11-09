# Fork Quests

Status as of 2026-11-07: **design in progress. Nothing is built: no quest data, no events, no dialogue in
the game.** Jerald's half is sketched and approved. Rupert's half has a direction and two proposed scenes,
and five of his forks have nothing yet.

Labels used below: **Decided** is Jeremy's call. **Direction** is his idea, not pinned down yet.
**Proposed** is written down and waiting on his read. **Open** has no answer yet. **Parked** is his to
circle back to.

## What these quests are for

All six trunks open together at the first reflection in the inn's bathroom (`Map358` ev3). What's left is
fourteen forks, seven each, and these quests are how they unlock.

**Decided (2026-11-06):** a player could reach level 50 without playing a single fork, but that has to be a
deliberate choice, never an oops-didn't-notice. The game has to put every fork in front of the player
clearly enough that skipping one is a decision.

## The shape

**Decided (2026-11-06):** a pointer quest each for Jerald and Rupert, sending the player to whoever unlocks
the forks. Jerald's pointer is Amy: "Amy points Jerald to someone, one person per trunk."

**Working count:** six giver quests, one per trunk, plus the two pointers. Each fork still gets its own
scene, so a giver's quest has one objective per fork. The `content-complete.md` line "One fork quest per
trunk, or one per fork?" is still unticked.

**Decided, Jerald's half (2026-11-06, "That is logical."):** Amy passes on a rumor about what someone has
been calling Jerald. Whoever started it was looking for exactly that kind of person, so the rumor turns into
a job. Each fork is one job, a fight shaped like the fork, and a witness says the name out loud. Jerald gets
told what he is.

**Direction, Rupert's half (2026-11-06):** nobody hands Rupert his names. He goes somewhere fitting,
something happens, and he declares the name himself. In Jeremy's words:

> Maybe it is something he declares after saving someone from… something that happens in Volcanis Grotto
> since it's a fiery place? And… the dismantler… perhaps it's something that happens as a result of…
> hmm… idk, deconstructing robots somewhere?

The class docs already agree: Lavos is "Self-proclaimed", The Architect and The Debilitator are
"Self-assigned", all of them "Completely unironic." Rupert tells you what he is.

## How a fork unlocks

- **The command:** `j/class/J-Classes` `unlock-classes`, args `{ "actorId": "1", "classIds": "[\"3\"]" }`.
  The bathroom mirror already opens the trunks with it, and it takes any list of classes, so each fork can
  unlock on its own with no plugin work. Actor 1 is Jerald, actor 2 is Rupert.
- **The mastery check**, for any quest that wants one: `$gameActors.actor(1).isClassMastered(classId)`.
- **Why the pointer can't fire on mastery:** AP runs in parallel. Every teachable in the active class gets
  the full amount, so a class masters at its priciest row. Trunks master at 2,500 AP (Fucking Oni, Fate) or
  3,250 (the other four), and every fork tops out at 10,000. One clear of every placed enemy at 1x pays about
  3,800 AP by level 10, 5,100 by 20, 7,350 by 50 and 12,000 by the end. So a one-class player masters a trunk
  around level 10, while a player rotating all three trunks can reach level 50 with none mastered, and that
  second player is exactly who the pointer exists for.

| Trunk | id | Forks (id) |
|---|---:|---|
| Fucking Oni | 2 | Raving Lunatic (3), Painbringer (4) |
| "Quicksilver" | 5 | Just Enough (6), Try-Hard (7), Contemptuous (8) |
| Medick | 9 | Orbiter (10), Malpractician (11) |
| Strategist | 14 | Lavos (15), Melufa (16), The Architect (17) |
| Debilitator | 18 | Methodical Dismantler (19), Equilibrium (20) |
| Fate | 21 | RNGesus (22), Hexagonal (23) |

The capstones are Transcendant (12) and Omniscient (24).

## Jerald's half

**Decided (2026-11-06): approved as a set. "Jerald though? Gold."** Cecil was Jeremy's pick. Peter and
Silver and Kayla came with the sketches, picked because they can't vanish mid-game the way Viktor or
Vanderslop can. The scenes below are the approved draft, word for word.

### Fucking Oni: Cecil, the city guard

Cecil stands in the Metal Petal (`Map032`, SE Raevula).

```text
Jerald: WHO THE FUCK IS CALLING ME A FUCKING ONI?
Cecil:  ...it was me. Are you free Tuesday?
```

**Raving Lunatic.** 40 Cave Bats down the hole on Cecil's street (`Map021` ev17, which drops into `Map134`
Blue Skies).

```text
Cecil:  They're all dead. Why is he still running?
Rupert: He hasn't noticed.
Cecil:  That man is a raving lunatic.
```

**Painbringer.** One Treant. Its Ironbark passive only comes back after 3 seconds without a hit, so "keep
hitting it" is literally correct. Speakers aren't assigned yet.

```text
"What if it doesn't die?"
"You keep hitting it."
"For how long?"
"Bring a chair."

Later:

"It's trying to leave."
"I KNOW."
```

### "Quicksilver": Peter, the Average Man

Peter stands outside the inn beside Vanderslop (NE Raevula).

**Just Enough.** A Bandit steals his pouch.

```text
"How far did he get?"
"About a stone's throw."
```

One throw, fight over.

```text
Rupert: You're not even going to loot him?
Jerald: Unnecessary.
Rupert: ...Who are you?
```

It's the battleaxe-at-the-thief story from [the origins doc](../origins-the-roleplay.md), except the village
lives.

**Try-Hard.** Peter asks Jerald to move an old suit of armor a little to the left. It hits him.

```text
Peter:  Oh, it does that.
```

Then it's 1v1 with a Rust Bucket.

```text
Rupert: Forty-five seconds on a scarecrow. Try hard.
```

**Contemptuous.** Vanderslop's hired Bandits, with him yelling prices as they die.

```text
Vanderslop: THAT ONE HAD A PENSION!!
Vanderslop: LOOK AT ME WHEN I AM YELLING AT YOU.
            (Jerald looks.)
Vanderslop: NO. STOP. NOT LIKE THAT.
Peter:      I've never seen anyone look at him with so much contempt. And I've been not looking at him
            for years.
```

### Medick: Silver and Kayla, the adventurous duo

They hang out outside their house in SW Raevula.

**Orbiter.** Silver's training day at Bearcat Congregation. Jerald punts every bearcat before Silver lands
a hit.

```text
Silver: Whoa, he isn't letting anyone get close. What is HIS problem?
Rupert: The things going around him are the orbiters.
Jerald: I'M THE ORBITER.
```

**Malpractician.** A Rot Rat bites Silver and he turns purple. Jerald kills the rats and feeds him one. It
works.

```text
Kayla:  That is the worst malpractice I have ever seen.
Silver: Wow, you're a malpractician?!
Rupert: That isn't a word.
```

### Where each fight's enemy lives today

| Fork | Enemy (row) | Where it stands now |
|---|---|---|
| Raving Lunatic | Cave Bat (361) | `Map134` Blue Skies holds 2, at row level |
| Painbringer | Treant (331) | `Map162` Dreamy Expanse Core, 5 at row level |
| Just Enough, Contemptuous | Bandit (471) | 18 rooms at row level, `Map162` among them |
| Try-Hard | Rust Bucket (141) | the Mines Ground (`Map344` to `Map352`), levels 5 to 9 |
| Orbiter | Bearcat (351) | `Map18` Bearcat Congregation, 4 at level 3 |
| Malpractician | Rot Rat (381) | `Map47` Dungeon's Breadth and `Map53` Northwestern Depths, 3 each at row level |

## Rupert's half

### Lavos (15)

**Direction (Jeremy):** something he declares after saving someone in Volcanis Grotto, "since it's a fiery
place."

**Proposed (2026-11-06), waiting on Jeremy's read:** Volcanis is the one place Jerald is useless. He's weak
to heat and complains the whole way through, so it's Rupert's moment. The someone is Leo, who the main story
already rescues once in the Forlorn Basin, and whose shipped line is "Can you folks not treat me like I'm
some kind of side character or something?!"

```text
Jerald: IT'S SO FUCKING HOT.
Leo:    What ARE you?!
Rupert: I am Lavos.
Jerald: You're WHO?
```

**Open:** what Leo needs saving from.

### Methodical Dismantler (19)

**Direction (Jeremy):** "something that happens as a result of… deconstructing robots somewhere."

**Proposed (2026-11-06), waiting on Jeremy's read:** the thread is already in the game and nothing pulls it.
At the Metal Petal (`Map032` ev1) Rupert asks "How many OTHER robots are on it? And who put them here?", and
no map or common event ever follows up. Five security Bots (row 521) stand in the Mines Basement at level 12
(`Map46` x2, `Map47`, `Map51`, `Map142`). Rupert takes them apart to find out, then lays the pieces out in
neat rows in front of the Difficulty Lord (`Map238`), whose shipped line is `ROLE AS DIFFICULTY LORD ENGAGED.`

```text
DIFFICULTY LORD: ROLE AS METHODICAL DISMANTLER ENGAGED.
Jerald:          I don't think that's a compliment.
```

The Difficulty Lord's own title is one it assigned itself ([the lap doc](./tutorial-lap-lords.md)), the same
habit as Rupert. More of the robot line waits further on: Terminals (`Map149`, `Map150`), a Mainframe
(`Map271`), and !Segfault on Lakeside Road.

**Open:** everywhere else Rupert names himself, and here the machine says it. Whether it's echoing him is
undecided.

### Melufa (16), The Architect (17), Equilibrium (20), RNGesus (22), Hexagonal (23)

**Open.** No direction yet. Each needs a place and a happening.

### Rupert's pointer

**Open.** The first shape had a pointer quest for each of them. Whether Rupert's is Amy too, and what it
says to someone who names himself, isn't settled.

## The capstones

**Decided (2026-11-06):** Transcendant and Omniscient "will just auto-unlock, unless you can think of a
stylish way to unlock them."

**Parked ("Scribble that down for now, I'll circle back to that for later."):** the mirror. There's exactly
one mirror in the game, in the inn's bathroom (`Map358` ev4), and every class change happens there, so a
player who finishes their last class walks right back to it. No quest: the mirror notices when a character
has mastered every other class, and the first scene plays again with its lines broken. `isClassMastered` is
the gate and `unlock-classes` does the rest, so it needs no new maps, art or plugin work.

Omniscient. The first time all game Rupert has nothing to suggest, a callback to his "I have some ideas!":

```text
Jerald: So what class you wanna be, Rupert?
Rupert: ...
Rupert: I have no ideas.
```

Transcendant. The same choice box comes up, with one option:

```text
Rupert: What about you, Jerald? What do you think you wanna be?
Jerald: What if people called me...
        [ Jerald? ]
Rupert: That's what people call you.
Jerald: Yeah.
```

**Parked:** whether Transcendant is spelled on purpose or becomes Transcendent (Classes row 12, and the
capstone lines in `content-complete.md`).

## Retired

- "A trainer offers a quest", the old unlock plan: superseded by the shape above.
- Rupert putting up flyers, and the Skeptical Man judging Rupert's names: both retired 2026-11-06. Don't
  bring them back.

## What's left

1. **Rupert's other five forks** need places and happenings.
2. **Rupert's pointer.**
3. **When Jerald's pointer fires.** Not on mastery (see the AP math above). One candidate, proposed: Amy's own
   doc already has her flagging the duo down once `main-003` sets the town buzzing.
4. **Per trunk or per fork:** settle the `content-complete.md` line.
5. **Try-Hard is a 1v1, so Rupert has to sit out,** and no shipped event ever removes a party member.
6. **Contemptuous needs Vanderslop rich and outside the inn, and `richpoor-007` ends both.** A player who got
   that far in his chain first needs a fallback.
7. **The fights sit at chapter 1 levels, so a late arrival stomps them.** Painbringer suffers most, since it's
   meant to be long. The Crossroads' sw44 pages are the precedent for levelling enemies to the player.
8. **40 Cave Bats means spawning:** `Map134` holds 2 today.
9. **Painbringer and Just Enough don't have the moment yet where someone says the name.** Every other Jerald
   fork does.
10. **Lavos lands late.** Volcanis runs about level 39 to 44, and a Strategist player can master the trunk
    around level 10, so Lavos would arrive about 30 levels after its trunk.
11. **Orbiter is the same premise as `silverkayla-001` Training Montage,** where Silver asks the duo for coaching
    and it goes catastrophically ([their doc](./SW-raevula/adventurous-duo.md)). One scene or two?
12. **`story-canon.md` puts fork unlocks in chapter 4.** Its LOCKED phase intent for that chapter says "forks
    unlock via Raevula NPC questlines". Meanwhile a one-class player masters a trunk around level 10, these
    fights sit at chapter 1 levels, and reaching level 50 without a fork is meant to be a choice. One of them
    has to give.

## Canon rails

- The party is exactly Jerald and Rupert.
- Cecil calling Jerald a raving lunatic already lands on canon: RL is the alter-ego Jerald fused with
  ([story canon](../story-canon.md)). Let the name land and leave it there; the RL-uncage proposal was
  rejected on 2026-07-24, so RL stays light.
- Kore's death stays lost by decision ([origins](../origins-the-roleplay.md)): never named, never filled in.
- Melissa and Angela never appear.

## Docs that will need to agree once this settles

- `docs/content-complete.md`: the six fork quest lines, the three capstone lines, and the per trunk or per
  fork question.
- `docs/story-canon.md`, chapter 4's phase intent, if fork unlocks land earlier (item 12).
- `docs/classes/main.md`, `quests/main.md` and the four giver docs (Amy, Cecil, Peter, Silver and Kayla) only
  point here. Keep the detail in this doc so there's one copy to update.
