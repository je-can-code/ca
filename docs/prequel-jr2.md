# Prequel record: *J&R II: Disaster Of Time*

> The time adventure referenced in [story-canon.md](./story-canon.md) — the one Jerald and Rupert "barely
> remember." This document exists because its source is nearly gone, and what remains lives in one person's
> memory. Written 2026-07-31.

**This is not canon.** It is a *record of where canon came from*. Nothing here is binding on Chef Adventure;
it is raw material, marked so that a future reader can tell what actually existed from what was reconstructed.

## Provenance legend

Every claim below carries one of these. **Do not promote a claim to a stronger tag without new evidence.**

| Tag | Meaning |
|---|---|
| `RECOVERED` | Read verbatim off disk from the surviving VX project. Quotable as fact. |
| `REMEMBERED` | Jeremy's recall, 2026-07-31, of a project last touched in 2011. Uncorroborated unless noted. |
| `SPECULATION` | Jeremy reasoning in 2026 about what 2011 probably meant. **Not evidence.** |
| `LOST` | Known to have existed; content unrecoverable. |
| `INVENTED` | Created later for Chef Adventure. Belongs to CA, not to the prequel. |

## What survives

| Artifact | Status |
|---|---|
| **RM2k3 original** (the real one, more content than any other version) | `LOST` — see below |
| **VX remake**, `Dropbox/'The Maker' Files/VX_Projects/JR2` | Survives. Partial. |
| **Deployed build** `JR2 13.10.11.exe` (2011-10-13) | Survives, same content |
| **J&R1** (Robert's RM2K game, ~2003) | `LOST` — Robert likely no longer has it either |

The VX remake was an attempt to rebuild the RM2k3 original and **never reached parity**. Its map data stops
after the forest, when you first reach town — before Rupert is recruited, before the first Sabre fight, before
any of the return-to-the-cell interludes. Everything past that point exists only as `REMEMBERED`.

The RM2k3 original is gone and the search for it is closed: no `RPG_RT.*` / `*.lmu` / `*.lmt` / `*.lsd`
anywhere on any drive, nothing in OneDrive, Google Drive, Box, Sendspace, or email, and it was **never posted
to a forum** — it was purely personal, so no community copy exists. Jeremy had no computing setup of his own
until roughly 2016; everything before that lived on machines belonging to family and friends.

## The four artifacts `RECOVERED`

The single most important recovery. All four are `<key item>` in `Items.rvdata`, in this database order:

| # | Item | Description (verbatim) |
|---|---|---|
| 1 | **Sparkling Gem** | *"A beautiful gem empowered with the ability to manipulate **time**."* |
| 2 | **Chronocryst** | *"A mysterious **stone** that weighs drastically more than its size suggests."* |
| 3 | **Sparkling Stone** | *"A powerful stone empowered with the ability to manipulate **space**."* |
| 4 | **Chronogeist** | *"Raw Mineral. A beautiful **gem** translucent and red in color."* |

**This was never a pair of time gems. It is time and space.** The lesser pair states its function outright;
the Chrono pair states only its physical nature, which means their powers were meant to be *discovered*.

Note the inversion, which is unlikely to be accidental:

- The **Sparkling Gem** (a gem) governs **time** — and **Chronogeist** ("geist," spirit) *is* a gem.
- The **Sparkling Stone** (a stone) governs **space** — and **Chronocryst** ("cryst," crystal/matter) *is* a
  stone, one that "weighs drastically more than its size suggests," which is a description of *mass*, i.e. a
  thing doing something to the space around it.

So the material pairing and the database adjacency point in opposite directions, and the naming supports the
material reading: **gem→spirit→time, stone→matter→space.** `SPECULATION`, but well-founded.

The **first boss of the game — an orc encountered while escaping the collapsed mine — drops the Sparkling
Gem.** `REMEMBERED` A time-manipulating artifact, handed to the player in the opening dungeon, before the
word "Chronocryst" is ever spoken aloud in the flashback.

**Unresolved:** what happens when the two Chrono artifacts are brought together. Jeremy is confident something
awful was intended and does not recall what. `LOST`

## The frame story

Structure: a cold open, then the entire game is a flashback told from a jail cell. `REMEMBERED`

1. Jeremy and Robert are in a cave, crudely planning to mug a guard.
2. They ambush him. **Real combat, and they are level 80** — the guard is written as strong and is annihilated
   anyway. The fight exists to establish that these two are absurdly powerful, not to be a challenge.
3. Robert dons the guard's armor, **punches Jeremy unconscious** (for verisimilitude), and drags his body to
   Sabre's castle.
4. The castle guards challenge him. Robert, disguised, simply declares:
   *"I have brought Sabre's great nemesis, Jeremy! Step aside!"* — and they do.
5. Robert hauls Jeremy to the dungeons, throws him in a cell, and says he will be back after he investigates.

**What the infiltration was for** `REMEMBERED`: **Sabre himself.** The specifics are `LOST`, but the reasoning
survives — the two of them could not simply storm the castle. Strong, but not *2-versus-700* strong. The whole
prisoner gambit exists to get them inside past a garrison they could not fight through.

*(A frontal assault being suicide is a **turn-based** constraint. Jeremy's later engineering — JABS — is the
thing that makes 2-versus-700 a plausible afternoon.)*
6. Alone, Jeremy reminisces. He name-drops **Naer**, the **Chronocryst**, and the **Chronogeist**, states that
   he wanted them, and the flashback begins.

**The cell was revisited.** `REMEMBERED, RM2k3 only` — the player returned to the frame more than once. Robert
would check in and snap Jeremy out of his reverie with goofy nonsense; Jeremy would say some version of
*"ANYWAY, where was I?"* and the flashback would resume. None of this made it into the VX remake.

### The intended ending `REMEMBERED, never built`

The flashback was to catch up to the present — the cell — and then continue. Robert returns with a plan he
worked out while masquerading as a guard, walking the castle freely. A final showdown with Sabre follows.

Jeremy specifically wanted **a playable masquerade sequence**, exploring the castle in the stolen armor, and
never built it. Beyond "showdown with Sabre," the ending is speculation; it was never written.

### The opening scene, verbatim `RECOVERED`

From `Data/Map005.rvdata`, RPG Maker control codes stripped. Speaker attribution follows the `\nb[]` name-box
tags; line order follows byte order in the event data and is therefore inferred, not certain.

> **Robert:** Hey Jeremy! We're in. But were in!
> Now, as we decided with the plan......
> You just gotta stay in that cell a while.
> I'll be back later to check up on you.
>
> **Jeremy:** Whoa, wait, what?..
> Your leavin' me all alone in here?
> But it will give time to......think about stuff.
>
> Rob 'n I sure have come a long way in this......
> I remember just after we were seperated, I came to this planet in search of a legendary treasure that I had
> been seeking even before we decided to travel together.
> Before we had begun our previous trials, I heard about Naer debating on whether or not he would conquer the
> four elemental goddesses, or instead just gather and manipulate the crystal pair, Chronocryst and
> Chronogeist.
> So what did I do?! I just decided myself to follow up and hunt these two things down..
> You never know how useful they can be......
> Not TOO terribley long ago......

Sic throughout — the spelling and punctuation are 2011's.

## The flashback

The body of the game. Everything below is `REMEMBERED` except where marked; the VX remake covers only through
step 4.

1. **The mines.** Jeremy wakes to explosions. He is sleeping in a mine/cave — this is presented as normal.
   Two miners are using explosives, and their blast has **collapsed the cave entrance**, so Jeremy must take a
   scenic route out. He vows vengeance for the interrupted nap.
2. **The orc.** On the way out he fights an orc — the game's first boss — which drops the **Sparkling Gem**.
3. **The forest.** The miners flee into the forest surrounding the cave. It is small. Each is found hiding in
   a house, and each greets Jeremy with some version of *"I work for Sabre, how can I help you?"* — which is
   **how Jeremy learns Sabre exists** — and is then killed. **No combat**: an event animation and an
   erase-character.
4. **Into town**, hunting Sabre by name. *(The VX project ends here.)*
5. **The bar.** Jeremy finds Sabre and fights him on the spot. Real combat. **Jeremy loses**, is genuinely
   baffled that the Great Jeremy could lose, and flees into the sewers.
6. **Sewers to shore.** The sewers lead to a cliffside; down on the beach he finds **Robert**, and recruits
   him. They are old friends and effectively ex-gods. *(CA's **Seashell Shores**, reached from the Outer
   Cliffs, is a deliberate throwback to this beat — see story-canon.md.)*
7. **Rematch.** Together they nearly beat Sabre, who uses the **Chronocryst** to open a portal and escape.
8. **Through time.** They give chase, not understanding what the portal is. It drops them in the same town's
   distant past, landing them in a mystical forest.
9. **Melissa.** Lost in the forest, they meet Melissa — an elf/nymph/forest spirit — who offers to guide them
   through, and joins.
10. **The first town, and private actions.** Arriving in town, the game opens **Star Ocean 2-style private
    actions**: split off as any of the three party members to spend time with the others and with the townsfolk.
11. **A fourth recruit** existed as intent only — the actor was created in the database, never placed in the
    game. Who they were is `LOST`.

### The timelines `REMEMBERED, RM2k3 only`

Sabre was not a one-off. He was an **active villain hunted across eras**, and the RM2k3 original implemented:

1. **The present** — the base timeline the game opens in.
2. **The past** — entered *unknowingly*, chasing Sabre through the Chronocryst portal.
3. **The future** — entered *knowingly*, and **under construction when the project died**. The remembered
   beat: *"Jeremy! He is getting away through one of those portals again!"* Contents `LOST`.

The knowing/unknowing distinction is the arc: the party learns what the portals are, and starts using them
deliberately.

**Jeremy's stated motive:** having learned what the chrono artifacts can do, he decides *"I want those, you
are a bad person and shouldn't have them"* — which the game does not examine, and which is funny precisely
because Jeremy is not a good person either. Never fleshed out.

### Save points were mirrors `REMEMBERED`

Drawn from Final Fantasy VI, where interactable clocks yield free elixirs. In J&R2:

- **Save points are mirrors**, and the mirror **talks to Jeremy like he is an idiot** — which he is.
- **Every save point has a wall clock beside it**, and Jeremy has a **unique comment for each one**.
- The jail cell clock is the same tileset clock. Its examine text — *"Why do I have to see this clock"* — is
  Jeremy being baffled that one is **here, in Sabre's Castle, of all places**. `RECOVERED` text,
  `REMEMBERED` intent.

A running gag about clocks, in a game called *Disaster Of Time*, where the villain escapes through time.

## Named entities

| Name | What is known | Tag |
|---|---|---|
| **Jeremy** | Protagonist. Ex-god. Sleeps in caves. Kills people who wake him. | `RECOVERED` (actor data) |
| **Robert** | Protagonist. Recruited on the beach. Willing to concuss a friend for a plan. | `RECOVERED` (actor data) |
| **Sabre** | Antagonist. Named for the sword. Holds a castle, commands minions, holds at least one chrono artifact, hunted across three timelines, and is on nemesis terms with Jeremy by the frame story's present. | `REMEMBERED`; castle `RECOVERED` |
| **Naer** | Was "debating whether to conquer the four elemental goddesses, or gather and manipulate the crystal pair." Never seen on screen in surviving material. | `RECOVERED` (mention only) |
| **Melissa** | Forest elf/nymph guide, third party member. Originally **Jeremy's love interest** in the childhood roleplay — lovey-dovey, but deadly serious about the sanctity of her forest. See [origins-the-roleplay.md](./origins-the-roleplay.md). Role beyond guiding: `LOST` | `REMEMBERED` |
| **The orc** | First boss. Drops the Sparkling Gem. | `REMEMBERED` |
| **Angela** | Robert's love interest from the childhood roleplay — no-nonsense, genuinely strong. **Possibly** the unbuilt fourth recruit; unconfirmed. | `SPECULATION` |
| **Fourth recruit** | Actor created in the database; never added to the game. Possibly Angela. | `LOST` |

`Actors.rvdata` in the VX remake contains only Jeremy and Robert — Melissa and the fourth were never entered
there either.

## Design decisions worth preserving

- **No world map, ever.** `REMEMBERED` A deliberate 2011 choice: real, walkable, contiguous maps instead of an
  abstracted overworld. This is the direct ancestor of Chef Adventure's diegetic geography, and of the
  discomfort with pulling combat out into a separate arena.
- **Private actions.** `REMEMBERED` Star Ocean 2's party-splitting town scenes. **Chef Adventure has no
  equivalent system**, and Jerald/Rupert banter beats are already being written — this is the one mechanic
  here that is genuinely unused and genuinely portable.
- **Talking save points that insult the protagonist.** `REMEMBERED` Free characterization at zero narrative
  cost, and canon already establishes Jerald "has a hard time looking beyond the obvious."
- **The max-level cold open.** `REMEMBERED` Establishing the protagonists as overwhelming by having them
  casually destroy a nobody.

**Not inherited:** J&R2 had **no morph system**. Jeremy's transformations (Raving Lunatic, Jragyn) were a
J&R1 mechanic tied to elemental abilities — see [origins-the-roleplay.md](./origins-the-roleplay.md).

**Not coming forward:** Melissa is **omitted from Chef Adventure** by decision (2026-07-31), and Angela with
her. CA's romantic character is based on Jeremy's fiancée, and the childhood love interests are not being
retrofitted over someone real.

## Relationship to Chef Adventure canon

Verified against [story-canon.md](./story-canon.md):

- **Space is the missing mechanism.** Canon explains the **Frozen Fortress** as Skye's summit castle
  *"displaced to Lakeside Road, still wearing the winter of the day it was taken"* — and attributes it to
  Grudj's time-pause. But *displacement is not a time power.* A castle moved off a mountain is a **space**
  event, and canon currently has no mechanism for it. The Sparkling Stone — *"the ability to manipulate
  space"* — is one. `SPECULATION`, and the strongest single lead in this document.
- **Un-happening.** Grudj's power is regression — un-happening. Jeremy's 2026 reading of the artifact split is
  that one lets you *move through time* while the other lets *time move around you*, i.e. an un-happening and
  possibly a re-happening tool. That is a candidate origin for a power canon currently leaves unsourced.
  `SPECULATION` (note: regression-inheritance was cut from the main scenario; Trainer Lord reintroduces it in
  a post-1.0 patch).
- **The four elemental goddesses.** The `RECOVERED` monologue puts Naer's dilemma as *conquer the four
  elementals* **or** *take the artifacts*. CA's foundation is four rescued elementals and the pact; canon also
  has King Naer trading his princess Sophia "for the ultimate power" without ever saying what that power was.
- **Whose castle?** Sabre's castle is the frame story's setting. Canon's postgame has the **Tower of Naer**.
  Whether Sabre's castle later becomes Naer's is an open thought of Jeremy's, not a decision.
- **"I came to this planet"** corroborates canon's *"cross-dimensional travelers; they did not fly a ship here."*
- **"just after we were seperated"** — Jerald and Rupert were split up after J&R1. CA canon has no such beat.
- **"You never know how useful they can be"** is, verbatim in 2011, the joke Grudj's grievance is built on:
  he warned them, and they asked about loot.
- **The thesis in embryo.** Two ex-gods mug a no-name guard for fun and murder two workmen over a nap, with no
  combat, as comedy. *"Everyone is the protagonist of their own story"* was already operating fifteen years
  before it was written down as CA's theme.
- **Void clowns are not from here.** The species name, naming grammar, and history are `INVENTED` for CA. The
  only inherited facts are a black-skinned, red-eyed clown named **Majik**.

## Standing design intent

### The Sabre cameo `PROPOSED (2026-07-31)`

Sabre appears in Chef Adventure exactly once, as a **gag**, and dies in it. He is not a boss, not a rival,
and gets no fight. Beat sheet as designed by Jeremy:

1. An **interdimensional portal** opens in front of the duo while they're travelling somewhere.
2. **Sabre and a couple of lackeys tumble out**, wounded and exhausted — this is the moment *immediately
   after* one of his escapes in *Disaster Of Time*.
3. The duo: *"wtf?"*
4. Sabre and the lackeys, panicking: *"huff puff — wait, what are YOU TWO doing here?!"*
5. The duo get defensive: *"What do you MEAN 'you two', asswipe?! YOU are the one that jumped out of an
   interdimensional — probably time-travelly — portal in front of US!"*
6. Shocked silence. A lackey offers: *"yarr, i just work for sabre!"*
7. Jerald: *"ya know what, I don't have time for this."* **Slash animation. Erase character.**
8. Rupert, shaking his head: *"you'd think time travelers would watch where they are going."*

**Why it works:**

- **Sabre is panicking, not menacing.** He assumes they got ahead of him, because decades of being hunted
  taught him they always do. Nobody in the scene understands what is happening; there is no straight man.
- **Jerald kills him out of impatience**, not malice — and *"I don't have time for this"* is said to a time
  traveler, about time, immediately before ending his.
- **Rupert's button treats it as a traffic incident.** Not "who was that" — a complaint about driving.
- **The lackey's line is a fifteen-year callback.** In J&R2, Sabre's two miners greeted Jeremy with *"I work
  for Sabre, how can I help you?"* and were killed with **no combat — an animation and an erase-character.**
  Sabre now dies the same way, by the same method, at the hands of the same man, who still has no idea who
  he is. No player will catch it. It is true anyway.
- **It arms Grudj rather than spending him.** Grudj's Ch5 callback is *"I gave you your power. I TOLD you I
  was coming. You asked if there was a reward."* If Sabre lands first, the player has already watched the
  duo do exactly that — and laughed. Grudj's grievance arrives pre-corroborated. Sabre is the farce; Grudj
  is the same shape at tragic scale.
- **It is cheap.** One scripted encounter — no dungeon, no boss design, no arena, no slot in a locked
  chapter. Viable against a Christmas 2026 finish line in a way a real rivalry would not be.

**Placement:** `OPEN`. Ch4 is the only unbuilt pre-finale real estate, and Sabre must land **before** Ch5 for
the Grudj setup to work.

**Open:** does anything mark the encounter afterward — a drop, a bestiary line, a crafting-book entry — or
does the player never learn who that was?

## Open questions

Unanswered as of writing. Recorded so they are not lost a second time.

1. **What happens when the Chronocryst and Chronogeist are brought together?** Something awful was intended.
2. **Is JR2's Naer the same as CA's King Naer?** Did he have a kingdom, a tower, or a princess in JR2?
3. **Who held which artifact?** Sabre uses the Chronocryst. Did he also hold the Chronogeist, or did Naer?
4. **Who is Sabre,** and how did the nemesis relationship escalate from "killed my nap" to "great nemesis"?
5. **Why were Jeremy and Robert separated** after J&R1, and why was Jeremy sleeping in a mine?
6. **What was the future timeline?** It was under construction when the project died.
*(Answered: they were after Sabre himself — see the frame story above.)*
8. **Was the Sparkling Gem ever meant to become something?** Intended to be "polished" into a true form
   granting an ability; never implemented. What the true form was is `LOST`.

*(Melissa's origin — answered. See [origins-the-roleplay.md](./origins-the-roleplay.md).)*
