# Nodes

"Nodes" are the fancy name given to the "panels" of my "Stat Distribution Panel System" aka SDP system. A single "Node"
represents a collection of parameters that will increase or decrease as the node is leveled up via a node-specific
currency.

> Lore about the SDP System: This system was modeled after a system observed in other games- Shining Force NEO
>   and Shining Force EXA. [See here for reference][1].

In the context of Chef Adventure, these offer the player a huge amount of control over how their protagonists grow and
play over the course of the game. They also provide the player incentives for performing certain behaviors (like
farming enemies) that shape the intended gameplay loop of the game.

## Node Families
At a high level, the concept of nodes could be used to provide a sort of "class" system to a game... but in Chef
Adventure, Nodes are MOSTLY acquired by chopping up monsters. As such, Nodes are fairly closely aligned with the
monsters from which they come from. This means that (in Chef Adventure at least), Nodes also have "families" and share
some characteristics! There are exceptions to the rule, and we will actually start with those.

### Family: Enchanter
#### Core Parameters
This family does not have core parameters.

#### Thoughts:
The Enchanter family of nodes is one of the few unique node families that do not come from a monster drop initially.
Instead, this is given to you as a part of the tutorial just outside of the intro cave. It is explicitly designed for
`Rupert`, and grants a number of stats that align closer to a mage/ranged playstyle. This family is intended to be
ranked up throughout the game, and mastering a panel will unlock another.

#### Implemented Nodes:
| Key     | Name              |
|---------|-------------------|
| `ENC_1` | Enchanter's Guile |
| `ENC_2` | Mages' Hands      |
| `ENC_3` | Warlock's Rage    |
| `ENC_4` | Sorcel Pledge     |
| `ENC_5` | Arcane Oath       |

### Family: Fighter
#### Core Parameters
This family does not have core parameters.

#### Thoughts:
The Fighter family of nodes is one of the few unique node families that do not come from a monster drop initially.
Instead, this is given to you as a part of the tutorial just outside of the intro cave. It is explicitly designed for
`Jerald`, and grants a number of stats that align closer to a physical/melee playstyle. This family is intended to be
ranked up throughout the game, and mastering a panel will unlock another.

#### Implemented Nodes:
| Key     | Name              |
|---------|-------------------|
| `ENC_1` | Enchanter's Guile |
| `ENC_2` | Mages' Hands      |
| `ENC_3` | Warlock's Rage    |
| `ENC_4` | Sorcel Pledge     |
| `ENC_5` | Arcane Oath       |

### Family: Ghosty
#### Core Parameters
- `Endurance`
- `Aggro`

#### Thoughts:
The Ghosty family of nodes is generally supposed to be the "easy to get" sort of panels. None of them have low drop
rates (comparitively) and while they do typically reduce your physical defense, they also lower aggro generated. These
were intended to be primarily ranked up by `Rupert` since he is a spell-casting powerhouse that should seldom get hit
and definitely dishes out heavy damage.

#### Implemented Nodes:
| Key     | Name              | Drop Enemy  | Location           |
|---------|-------------------|-------------|--------------------|
| `GHO_1` | Ghosty Presence   | Ghosty      | Intro Cave         |
| `GHO_2` | Otherworldly Dark | Wraith      | Salt Mines (upper) |
| `GHO_3` | Spooky Aura       | Spooky      | Earthen Layer      |
| `GHO_4` | ????              | Tsukumogami | Erocia Castle      |


> TODO: add the rest of the nodes.

---
[1]: https://shining.fandom.com/wiki/Force_Arts