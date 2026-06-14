# Class / job tree — design notes

> **Status:** brainstorm / pre-implementation. No RMMZ data authored yet.
>
> **Backlog item:** [`rmmz-plugins/.backlog/unstarted/ca-protag-class-job-tree-system.md`](../../../rmmz-plugins/.backlog/unstarted/ca-protag-class-job-tree-system.md)
>
> **Related:** [`../sdp/archetype-mapping.md`](../sdp/archetype-mapping.md) · [`../weapons/families.md`](../weapons/families.md)

---

## Design pillars

- Classes define **role verbs** (what you *do*). SDP panels define **stat profile** (what backs those verbs up). They are separate axes.
- **Positioning is a consequence of build**, not a hard constraint. "Frontliner" and "backliner" describe where a character *tends to end up*, not where they're locked.
- **Jerald = physical person. Rupert = magical person.** Their core identity never changes — only the *expression* of it does.
- Each protagonist has **3 trunk classes**. Trunks fork into **final expressions** (2–3 per trunk). Final expressions are where archetype coverage happens — no need for a distinct class per archetype.
- **System unlock:** story-gated. Fourth-wall moment where the two veterans acknowledge they "didn't have this in the old days." Specific branches unlocked via NPC trainers / story beats in Raevula and surrounding regions.
- **Respec:** free or low-cost via menu after unlock. Discovery is gated; experimentation is not.

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

- **Equip unlocks** — e.g. master Lavos → unlock "equip 1H wand/tome" on any class
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

**Natural weapons:** blade (1H sharp, 2H beast, dual twist), fist (glove flow, claw gore, arm dirty), axe (1H hatchet, 2H battleaxe)

**SDP archetype affinities:** Berserker, Skirmisher, Vanguard

#### Fork A — Raving Lunatic

> The alter ego. In the original game, Raving Lunatic was a post-game enemy Jerald could transform into — a separate entity with its own animations, including a 99-frame hand-drawn art piece of Jeremy jumping, hack-and-slashing with a massive axe, triple backfliping, and literally peeing on the enemy for ridiculous damage. CA lore: Jeremy and Raving Lunatic fused into one entity between games. That explains a lot about Jerald.
>
> **Expression:** blender cranked to 11. Fast, flurry, quantity of hits. Doesn't stop until everything is dead or he is.

**Natural weapons:** dual blade (twist), fist glove (flow), 2H axe (battleaxe/cleave)

**SDP archetype affinities:** Berserker, Skirmisher, Artillery

#### Fork B — Painbringer

> No backstory. Just misery incarnate. Deliberate, slow, methodical suffering on his schedule.
>
> **Expression:** slow and hard. Quality of suffering over quantity of hits. The null acid comes out. Bleed, attrition, make it last.

**Natural weapons:** 1H axe (hatchet/buffer), 2H blade (beast/stun-execute), fist arm (dirty), fist claw (gore/bleed)

**SDP archetype affinities:** Skirmisher, War Priest, Vanguard

---

### Trunk 2 — "Quicksilver"

> Nickname. Quoted because shotguns are only fast in *finishing* the job, not necessarily drawing the weapon. Jerald solving the problem from the doorway so they can leave faster.

**Natural weapons:** javelin (rend), taser (conduit), shotgun (boomstick)

**SDP archetype affinities:** Artillery, Skirmisher, Berserker

#### Fork A — Spear Chucker

> **Expression:** maximum range. Stay away, build stacks, step in only for the Kalista-style RIP that detonates 100 javelins at once. Precise. The problem was solved before it knew Jerald was there.

**Natural weapons:** javelin (rend — stack ledger + RIP)

**SDP archetype affinities:** Artillery, Skirmisher

#### Fork B — Try Hard

> What Rupert calls him when he's been mashing the taser for 45 seconds straight on one enemy.
>
> **Expression:** hyperfocus. Pin one thing, flip the switch, mash the button. Playing chicken with the target while executing Saiki K-style 16-button-presses-per-second technique. It's 1v1 and Jerald takes it personally.

**Natural weapons:** taser (conduit — pin→flip→mash)

**SDP archetype affinities:** Skirmisher, Berserker

#### Fork C — Splattershot

> **Expression:** lazy contempt. Move in, BLAM them back. Step closer. BLAM. Step. BLAM — oh, they were dead that last shot. Oh well. BLAM for good measure. Methodical, AFK energy, deeply unimpressed with whatever it's shooting.

**Natural weapons:** shotgun (boomstick — freeCombo spread, bleed, reload-to-clap)

**SDP archetype affinities:** Artillery, Vanguard, Guardian

---

### Trunk 3 — Medick

> Spelled wrong intentionally. Because he is a dick.
>
> "I keep us both standing long enough to finish this. I guess. If I have to." Not a healer. A guy who learned enough to make sure Rupert doesn't go down again, and adapted a few things to make fights end faster for everyone.

**Natural weapons:** axe breaker (breaker), spear basher (mortar), 1H axe (hatchet/buffer)

**SDP archetype affinities:** War Priest, Cleric, Medic, Vanguard, Guardian

#### Fork A — Orbiter

> *"Whoa, he isn't letting anyone get close. What is HIS problem?"*
>
> **Expression:** aggressive space control. Deeply offended that enemies keep approaching. Maintains a fixed perimeter — not to protect anyone noble, just because proximity is personally offensive. Everything revolves around him at a safe distance and god help you if you breach it.

**Natural weapons:** spear basher (mortar — wide circle/denial), 1H axe (hatchet/buffer — self-buffs on execution)

**SDP archetype affinities:** Vanguard, Guardian, War Priest

#### Fork B — Tenderizer

> **Expression:** soften the target for the party. Not about Jerald's own damage — it's about making sure this fight ends faster so they can leave. Shred enemy PDR, stack Tenderizing, set up Exposed so everyone hits harder. Almost support-flavored, expressed entirely through controlled aggression.

**Natural weapons:** axe breaker (breaker — LLRL→SHATTER, Tenderizing→Exposed, party −PDR)

**SDP archetype affinities:** Medic, Cleric, War Priest, Generalist

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

**SDP archetype affinities:** Berserker, Artillery, Wizard, Skirmisher

#### Fork A — Lavos

> Self-proclaimed. Completely unironic. Rupert has decided he is the final boss of this situation and is conducting himself accordingly. Named after the Chrono Trigger final boss — a planet parasite that rains death from above. Rupert sees no reason this is not an accurate self-description.
>
> **Expression:** debuff you into oblivion first, *then* the rain of fire and lava and other horrible things. The 1H wand machine gun bolts are almost insulting — you're already dying from seventeen other things and he's still shooting. MELTIMA lives here.

**Natural weapons:** 1H wand (saturation — bullet hell MAT ramp), tome (lexicon — direct sentences + curse), taser (conduit — MAT+LUK, pin→mash)

**SDP archetype affinities:** Wizard, Artillery, Berserker

#### Fork B — Melufa

> Named after the most interesting weapon in Star Ocean 2 — coincidentally Ashton's best personal weapons. Rupert fell in love with Ashton (dual sword wielder) and brought that energy into his own fighting style.
>
> **Expression:** death by a thousand cuts. Up close with dual swords, elemental and MAT-infused. The blades are delivery mechanisms for whatever horrible elemental calculation he's currently running. Getting in melee range turns out to be somehow *worse* for the enemy than staying at range.

**Natural weapons:** dual blade (twist — widening arcs, two buttons, elemental; MAT support to be added on revamp)

**SDP archetype affinities:** Skirmisher, Wizard, Berserker

#### Fork C — Methodical Dismantler

> Too many syllables. Overly specific. Uncomfortable when you think about what it implies. Filed as a clinical report after the incident. Nobody wanted to write it but someone had to describe what happened.
>
> **Expression:** slow, deliberate, calculated dismantling. The fist arm lot — over-arm slam, lariat, cross-arm slam, Grab Ready!, Violation at capstone. Every hit is a step in a flowchart Rupert is executing in real time. "I have determined that the optimal move is to grab you and do something unspeakable to you. This was always the plan."

**Natural weapons:** fist arm (dirty — connect slams, Grab Ready! → Violation)

**SDP archetype affinities:** Vanguard, Guardian, Berserker

---

### Trunk 2 — The Debilitator

> "The" included — it's a title. Self-assigned. Completely unironic. Sits comfortably next to "self-proclaimed Lavos" in the Rupert pantheon of ego.
>
> This enemy is more valuable to Rupert temporarily disabled than immediately dead. Also sometimes "this ally is more valuable to Rupert not dead yet." Same mental process, different target.

**SDP archetype affinities:** Wizard, Cleric, Medic, War Priest, Guardian

#### Fork A — Kore Avenger

> "Kore" — romaji for "this" in Japanese. Also the name of a cat character Robert had in the previous game who wielded a massive hammer. Rupert took the hammer after he died. RIP Kore. Every stun-into-execute is dedicated to him.
>
> **Expression:** stun everything, then do unspeakable things to the stunned target. The 2H blade beast lot is purpose-built for this: Meat Tenderizer into charged Fat Melter, guaranteed crits vs stunned, 2× damage vs stunned, Blade of the Lotus removing offchain cooldown at capstone. The numbers are genuinely terrible for the target.

**Natural weapons:** 2H blade (beast — stun lord, charge execute, prof stun ladder)

**SDP archetype affinities:** Berserker, Artillery, Vanguard

#### Fork B — Equilibrium

> **Expression:** the battlefield is a closed system and Rupert is the accountant making sure the numbers balance — always in his favor. Healing an ally damages a nearby enemy. Killing an enemy heals a nearby ally. Debuffs and buffs as two sides of the same ledger. Not a healer, not a debuffer — a force that enforces the state he wants the battlefield to be in.
>
> Pairs naturally with the extensive heal-event tag library (`onSelf*Heal*`, `onAlly*Heal*`, etc.).

**Natural weapons:** 2H staff (aura — spray mains + charge→aura offchain, MRG/HRG/party AOE/prism shield)

**SDP archetype affinities:** Cleric, Medic, War Priest, Generalist

---

### Trunk 3 — Fate

> "Ugh, do I have to deal with these goblins on the next screen?"
>
> Give us the home advantage. Proactive. Rupert isn't scrambling to keep up — he's already prepared the battlefield before the fight starts. Setting the terms, controlling the environment, making sure when things kick off it's on his schedule and his turf.
>
> Not reactive — *inevitable*. Fate doesn't try. Things just happen the way they were always going to happen. He just nudged things along.
>
> Also carries echoes of his ex-hero days — he used to believe in destiny and heroism. Now he just uses the *aesthetic* of it because it makes people cooperate faster.

**SDP archetype affinities:** Generalist, Cleric, Medic, Skirmisher

#### Fork A — RNGesus

> "Jerald, listen. There are people who roll the dice and pray to RNGesus, and then there is ME."
>
> Rupert IS RNGesus. He doesn't pray to him — he transcends randomness entirely by having already accounted for every variable. What looks like luck to everyone else is just Rupert having read three moves ahead.
>
> **Expression:** eliminate variance. Guaranteed outcomes. Proc manipulation. Shield on Jerald before the tankbuster lands. Regen ticking before the bleed stacks. The outcome was never in question. Also bestows blessings — buffs, prosperity, favorable conditions. "I have blessed this encounter. You're welcome."

**Natural weapons:** tome (lexicon — healing grimoire expression, MDF/REC/PHA), 2H staff (aura — party buffs)

**SDP archetype affinities:** Cleric, Generalist, Medic

#### Fork B — Hexagonal

> The shape of a curse.
>
> **Expression:** engineer their misfortune. Shove the spear basher somewhere they don't appreciate, apply debuffs they don't want, stand behind a prism shield and do it freely because fuck you. Disarm, Mute, denial charge waves, wide circle control. RNGesus blesses your allies — Hexagonal specifically and deliberately makes things worse for the enemy. Same trunk, opposite direction. Fate controls the outcome either way.

**Natural weapons:** spear basher (mortar — wide circle denial, Disarm, Mute, charge waves, prism shield via staff aura crossover)

**SDP archetype affinities:** Wizard, Skirmisher, Guardian

---

## Open questions

- Do trunks have names before the fork, or do players just see the fork choices?
- Unlock criteria per branch — NPC trainers, story beats, or both?
- Skill ID bands for class skills (must not overlap weapon lots 1–180 or character kit bands)
- Does respec cost anything or is it purely free?
- Elementals — separate class trees or fixed role kits? (see backlog item)
- Taser — no class home by design; fits Lavos naturally as a weapon choice without being trunk-locked
