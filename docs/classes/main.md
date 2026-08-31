# Class / job tree — design notes

> **Status:** brainstorm / pre-implementation. No RMMZ data authored yet.
>
> **Backlog item:** [`rmmz-plugins/.backlog/completed/ca-protag-class-job-tree-system.md`](../../../rmmz-plugins/.backlog/completed/ca-protag-class-job-tree-system.md)
>
> **Related:** [`../sdp/archetype-mapping.md`](../sdp/archetype-mapping.md) · [`../weapons/families.md`](../weapons/families.md)

---

## Design pillars

- Classes define **role verbs** (what you *do*). SDP panels define **stat profile** (what backs those verbs up). They are separate axes.
- **Positioning is a consequence of build**, not a hard constraint. "Frontliner" and "backliner" describe where a character *tends to end up*, not where they're locked.
- **Jerald = physical person. Rupert = magical person.** Their core identity never changes — only the *expression* of it does.
- Each protagonist has **3 trunk classes**. Trunks fork into **final expressions** (2–3 per trunk). Final expressions are where archetype coverage happens — no need for a distinct class per archetype.
- **Classes are weapon-agnostic.** Any skill in your library can theoretically be used with any weapon in hand. Classes are complete identities, not extensions of a specific weapon.
- **Equipment access comes from fork passives**, not trunks. Trunks have a union view of their forks' equipment for reference, but unlock nothing themselves. Taking an Equip passive cross-class is how gear access travels to other builds.
- **System unlock:** story-gated. Fourth-wall moment where the two veterans acknowledge they "didn't have this in the old days." Specific branches unlocked via NPC trainers / story beats in Raevula and surrounding regions.
- **Respec:** free or low-cost via menu after unlock. Discovery is gated; experimentation is not.
- **Block sizes:** trunks get 10 slots (3 actives, 5 passives, 2 wiggle room); forks get 20 slots (4 actives, 10 passives, 6 wiggle room).

---

## The journey to godhood

> *"Rupert we're gods now."*
> *"I know Jerald. Can we please just get the ingredients and go home."*

The class system is not a **selector** — it is a **progression toward transcendence**. Inspired by FF5's job mastery system and SMT's "keep consuming until you contain everything." The goal is not to pick an identity and stay there. The goal is to **consume every identity until you contain all of them.**

### Starting state — locked down

Both protagonists begin **heavily restricted**. No veteran power fantasy at the start — that is the *destination*, not the starting point. Early Jerald has axes, his default kit, and his feelings about goblins. That's it.

This makes the "veteran protagonists who can do anything" narrative feel **earned** rather than arbitrary. They *were* veterans. Then the planet took everything away and they had to rebuild from scratch. The godhood is incidental — it just kept happening while they were trying to leave.

### Mastery — cross-pollination

Mastering a class fork unlocks capabilities that **carry over permanently** into any other class. Almost everything is cross-pollinate-able (with a few intentional exceptions TBD). This includes:

- **Equip unlocks** — e.g. master a fork with Equip Taser → that equip passive is now portable into any other class
- **Passive traits** — permanent always-on bonuses from that fork's identity
- **Skills** — specific skills usable regardless of current class
- **Stat bonuses** — flat permanent gains that follow you everywhere
- **Special mechanics** — e.g. Lavos's debuff-before-nuke rhythm brought into a different fork

The magic is not in any one class. It's in what you **combine**. Mastering classes in a deliberate sequence creates builds that no single class could achieve alone.

**Example:** Rupert masters Lavos first (unlocks tome equip + MELTIMA). Pivots to Methodical Dismantler. Now he's grabbing things with a mech arm *and* casting MELTIMA. Nobody planned for this. It's fine.

### Progression arc

| Phase | State |
|---|---|
| **Early game** | Locked to default weapon + basic kit. One trunk accessible. |
| **Mid game** | First fork mastered. Cross-pollination begins. Builds start to feel personal. |
| **Late game** | Multiple forks mastered. Combinations emerge that no single class provides. |
| **Endgame** | All forks mastered. The restrictions are gone. They are simply forces of nature who came here for recipes. |

---

## Jerald

> *"Rams a sword up the foes' asshole, and twists. Also the sword is rusty."*
>
> **Identity:** physical person. Obstacle removal specialist. Self-preservation first — for himself and Rupert. Nothing stands between him and those recipes.
>
> **Motivation for class growth:** the planet keeps throwing bigger obstacles. He adapts because he has to, not because he wants to.

### Trunk 1 — Fucking Oni

> *"You fight like a fucking oni."* — something an NPC in Raevula probably says and immediately regrets.
>
> Pure melee aggressor. Gets in your face. The problem ceases to exist.

**SDP archetype affinities:** Berserker, Vanguard

#### Fork A — Raving Lunatic

> The alter ego. In the original game, Raving Lunatic was a post-game enemy Jerald could transform into — a separate entity with its own animations, including a 99-frame hand-drawn art piece of Jeremy jumping, hack-and-slashing with a massive axe, triple backfliping, and literally peeing on the enemy for ridiculous damage. CA lore: Jeremy and Raving Lunatic fused into one entity between games. That explains a lot about Jerald.
>
> **Expression:** blender cranked to 11. Fast, flurry, quantity of hits. Doesn't stop until everything is dead or he is. A living wood chipper that is outrageously mobile.

**SDP archetype affinities:** Berserker, Skirmisher

#### Fork B — Painbringer

> No backstory. Just misery incarnate. Deliberate, slow, methodical suffering on his schedule.
>
> **Expression:** slow and hard. Quality of suffering over quantity of hits. The null acid comes out. Compounding void-acid debuffs that self-stack without falling off — a team force multiplier the longer a fight goes.

**SDP archetype affinities:** Wizard, Vanguard

---

### Trunk 2 — "Quicksilver"

> Nickname. Quoted because shotguns are only fast in *finishing* the job, not necessarily drawing the weapon. Jerald solving the problem from the doorway so they can leave faster.

**SDP archetype affinities:** Artillery, Skirmisher

#### Fork A — Just Enough

> That javelin was thrown at exactly that speed on purpose. Throwing again would be unnecessary, and unnecessary is unacceptable.
>
> **Expression:** bare minimum executed with disgusting precision. Deliberate velocity control. One throw, calculated, handled. He's already thinking about leaving.

**SDP archetype affinities:** Artillery, Skirmisher

#### Fork B — Try Hard

> What Rupert calls him when he's been mashing the taser for 45 seconds straight on one enemy.
>
> **Expression:** hyperfocus. Pin one thing, flip the switch, mash the button. Playing chicken with the target while executing Saiki K-style 16-button-presses-per-second technique. It's 1v1 and Jerald takes it personally.

**SDP archetype affinities:** Berserker, Skirmisher

#### Fork C — Contemptuous

> **Expression:** lazy contempt. Move in, BLAM them back. Step closer. BLAM. Step. BLAM — oh, they were dead that last shot. Oh well. BLAM for good measure. Methodical, AFK energy, deeply unimpressed with whatever it's shooting.

**SDP archetype affinities:** Guardian, Artillery

---

### Trunk 3 — Medick

> Spelled wrong intentionally. Because he is a dick.
>
> "I keep us both standing long enough to finish this. I guess. If I have to." Not a healer. A guy who learned enough to make sure Rupert doesn't go down again, and adapted a few things to make fights end faster for everyone.

**SDP archetype affinities:** War Priest, Vanguard

#### Fork A — Orbiter

> *"Whoa, he isn't letting anyone get close. What is HIS problem?"*
>
> **Expression:** aggressive space control. Deeply offended that enemies keep approaching. Maintains a fixed perimeter — not to protect anyone noble, just because proximity is personally offensive. Everything revolves around him at a safe distance and god help you if you breach it.

**SDP archetype affinities:** Guardian, Vanguard

#### Fork B — Malpractician

> Aggressive debuffer who incidentally heals because he technically has to. Shared Suffering plants the setup; potions pop in the air every few hits like sad firecrackers, healing everyone nearby as a byproduct of him punching things. He is not paying attention to it. It just happens.
> "Here's a potion. Share it. I'm busy."
>
> **Expression:** apply Doomganosis, apply Shared Suffering, let Collateral Care handle the rest. SHIELD Rupert when needed. The heals are a side effect. Malpractice stacks are someone else's problem to take advantage of.

**SDP archetype affinities:** Medic, Wizard

---

## Rupert

> *"MELTIMA."*
>
> **Identity:** magical person. Always calculating the optimal outcome. Not cautious — *precise*. The spells are tools for executing the plan. Previously a hero in the prequel game ("a sword or hammer fighter who learned magic"), now the inverse — a caster who also wields weapons, somewhat clumsier with them by default due to low ATK stat. Classes will change that fundamentally.
>
> **Motivation for class growth:** efficiency. The planet keeps wasting his time and he intends to fix that.
>
> **Counterbalance to Jerald:** where Jerald's default answer is "apply force until problem stops," Rupert's is "what's the most *useful* thing I can do to this problem right now?" He's not squeamish — he just thinks Jerald's approach is inefficient. Sometimes.
>
> *"Oh Jerald, that would be wasteful. Lets do this so we don't have to stress about the stupid goblins on the next screen."*

### Trunk 1 — Strategist

> Pure offensive calculation. Kill it efficiently. "Oh god what is that guy — AHH WHAT IS HE DOING."
>
> Rupert has assessed the situation and determined that the optimal move is annihilation. He is executing on that.

**SDP archetype affinities:** Wizard, Skirmisher

#### Fork A — Lavos

> Self-proclaimed. Completely unironic. Rupert has decided he is the final boss of this situation and is conducting himself accordingly. Named after the Chrono Trigger final boss — a planet parasite that rains death from above. Rupert sees no reason this is not an accurate self-description.
>
> **Expression:** debuff you into oblivion first, *then* the rain of fire and lava and other horrible things. The wand machine gun bolts are almost insulting — you're already dying from seventeen other things and he's still shooting. MELTIMA lives here.

**SDP archetype affinities:** Wizard, Artillery

#### Fork B — Melufa

> Named after the most interesting weapon in Star Ocean 2 — coincidentally Ashton's best personal weapons. Rupert fell in love with Ashton (dual sword wielder) and brought that energy into his own fighting style.
>
> **Expression:** death by a thousand cuts. Up close with dual swords, elemental and MAT-infused. The blades are delivery mechanisms for whatever horrible elemental calculation he's currently running. Getting in melee range turns out to be somehow *worse* for the enemy than staying at range.

**SDP archetype affinities:** Wizard, Berserker

#### Fork C — The Architect

> Master of space. Every enemy is exactly where Rupert needs them — because he put them there.
> Self-assigned title. Completely unironic.
>
> **Expression:** Converge to pull them in for the melee window, Repel to send them to the shooting gallery, Compression to lock them in place, Meteor for applied astrophysics. The Architect decides where you are. You are there now.

**SDP archetype affinities:** Skirmisher, Artillery

---

### Trunk 2 — The Debilitator

> "The" included — it's a title. Self-assigned. Completely unironic. Sits comfortably next to "self-proclaimed Lavos" in the Rupert pantheon of ego.
>
> This enemy is more valuable to Rupert temporarily disabled than immediately dead. Also sometimes "this ally is more valuable to Rupert not dead yet." Same mental process, different target.

**SDP archetype affinities:** Wizard, Cleric

#### Fork A — Methodical Dismantler

> Too many syllables. Overly specific. Uncomfortable when you think about what it implies. Filed as a clinical report after the incident. Nobody wanted to write it but someone had to describe what happened.
> A tribute to Kore — a cat-humanoid who fought with claws. Rupert learned to fight like him. Honors him by doing it efficiently. RIP Kore.
>
> **Expression:** systematic, efficient stat stripping. Wing Clipper locks them down, Shell Cracker stuns and shreds DEF, Aura Burst evaporates MDF party-wide, and Avenge applies all three debuffs simultaneously in a single hit. By the time Avenge lands, there is nothing left to protect them.

**SDP archetype affinities:** Skirmisher, War Priest

#### Fork B — Equilibrium

> **Expression:** the battlefield is a closed system and Rupert is the force that keeps it balanced — always in his favor. Healing an ally damages a nearby enemy. Killing an enemy heals a nearby ally. Debuffs and buffs as two sides of the same ledger. Not a healer, not a debuffer — the thing that enforces the state he wants the battlefield to be in.
>
> Pairs naturally with the extensive heal-event tag library (`onSelf*Heal*`, `onAlly*Heal*`, etc.).

**SDP archetype affinities:** Medic, War Priest

---

### Trunk 3 — Fate

> "Ugh, do I have to deal with these goblins on the next screen?"
>
> Give us the home advantage. Proactive. Rupert isn't scrambling to keep up — he's already prepared the battlefield before the fight starts. Setting the terms, controlling the environment, making sure when things kick off it's on his schedule and his turf.
>
> Not reactive — *inevitable*. Fate doesn't try. Things just happen the way they were always going to happen. He just nudged things along.
>
> Also carries echoes of his ex-hero days — he used to believe in destiny and heroism. Now he just uses the *aesthetic* of it because it makes people cooperate faster.

**SDP archetype affinities:** Generalist, Wizard

#### Fork A — RNGesus

> "Jerald, listen. There are people who roll the dice and pray to RNGesus, and then there is ME."
>
> Rupert IS RNGesus. He doesn't pray to him — he transcends randomness entirely by having already accounted for every variable. What looks like luck to everyone else is just Rupert having read three moves ahead.
>
> **Expression:** eliminate variance. Guaranteed outcomes. Proc manipulation. Shield on Jerald before the tankbuster lands. Regen ticking before the bleed stacks. The outcome was never in question. Also bestows blessings — buffs, prosperity, favorable conditions. "I have blessed this encounter. You're welcome."

**SDP archetype affinities:** Cleric, Generalist

#### Fork B — Hexagonal

> The shape of a curse.
>
> **Expression:** engineer their misfortune. Stand behind a prism shield and do it freely because fuck you. Disarm, Mute, denial charge waves, wide circle control. RNGesus blesses your allies — Hexagonal specifically and deliberately makes things worse for the enemy. Same trunk, opposite direction. Fate controls the outcome either way.

**SDP archetype affinities:** Wizard, Guardian

---

## Resolved questions

- **Trunk naming:** trunks are shown to players as legit classes, same as forks — they're just "before" the forks in the tree, not hidden intermediate steps.
- **Unlock criteria:** the first trunk unlocks via the innkeeper main-scenario quest (killing bearcats), pre-dating the "veterans acknowledge the system" story beat. Every subsequent branch (remaining trunks, all forks) unlocks via NPC trainers scattered through Raevula.
- **Skill ID bands:** class skills start at **301** and run through however many bands are needed to cover all trunk + fork actives — placed after the weapon lots (1–180) and clear of existing character kit bands.
- **Respec:** none. No respec of classes — you learn what you learn, permanently, per the mastery/cross-pollination model. Class-changing (which class is "active") is a separate mechanic from unlocking/mastering.

## Open questions

- Elementals — separate class trees or fixed role kits? Deferred to its own dedicated conversation (see backlog item) — Jerald/Rupert design is not a template for how elementals will work.
