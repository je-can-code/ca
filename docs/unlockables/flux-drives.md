# Spacial Flux Engine (aka Difficulty System)

> NOTE: This is WIP; I am writing it for myself at this time so I can return back to this more seamlessly later.
>   This will likely be enhanced as a full guide as time goes on. If you found this without me personally directing
>   you to it, read at your own discretion!

## Overview
In the game of Chef Adventure, a Difficulty System is eventually unlocked called the "Spacial Flux Engine". This
difficulty system is similar to others that you might find in other games, with the exception that multiple can be
applied simultaneously. These layers of difficulty are called `Spacial Fluxes Routines` (or just `Fluxes` for short)
which are unlocked by delivering `Flux Drives` to the Difficulty Lord.

Read on to learn more about the available `Flux Drives`, what they do, and how they are acquired.

| Spacial Flux Engine                                 |
|-----------------------------------------------------|
| [Unlocking the Difficulty Lord](#unlock)            |
| [Gimmick of the Spacial Flux Engine](#how-it-works) |
| [All Difficulty Layers](#all-layers)                |
| [Flux Drive: Crimson](#drive-crimson)               |
| [Flux Drive: Saffron](#drive-saffron)               |
| [Flux Drive: Lemon](#drive-lemon)                   |

## <a name="unlock" /> Unlocking the `Spacial Flux Engine`
Unlocking the `Spacial Flux Engine` is straight-forward, the player only needs to:
- in `Raevula`, enter the building to the left of `The Comfy Bear` inn.
- interact with the robot to the left of the actual unit that is the `Spacial Flux Engine`.

Just unlocking the `Spacial Flux Engine` will bestow the player with two difficulty layers automatically:
- `Favor of the Food Lord I`
- `Challenge of the Food Lord I`

## <a name="how-it-works" /> Gimmick of the Spacial Flux Engine
There are a multitude of `Fluxes` that will be available in this game, of which the player can mix and match to their
preferred play style. If they want to make it harder, easier, faster, slower, lootier, drier, whatever, there is likely
to be a `Flux` for it, likely multiple. The main gimmick of this system is that any number, 0-all, can be applied
simultaneously. How does that work exactly, if you have one difficulty that raises one stat, and another that reduces
it?

At this time, all effects applied by difficulties are against numeric values, such as parameters (attack/defense/etc 
rates) and rewards (exp/gold/drop/etc rates). A single `Flux` will define one or more **percent-based 100-base
multipliers**, such as "actor attack = 125%", which translates to +25% attack for all actors. If you applied that
`Flux` and applied a second `Flux` that had "actor attack = 50%", which translates to -50% attack for all actors, what
would that look like? Here is how the math would look:

```
actor base attack default = 100;
first flux modifier = 125;
second flux modifier = 50;

result = 1.00 * 1.25 * 0.50 = 0.625;
```

> **`Flux` modifiers are sequentially multiplicative!**

The above fact is important to keep in mind when applying increasingly more `Fluxes`. Additionally, that logic applies
to ALL modifiers, not just the attack used in the example. All b/ex/sp parameters, my custom parameters, and rewards
found on `Spacial Flux Routines` are subject to **sequentially multiplied modifiers**!

## <a name="all-layers" /> All `Spacial Flux Routines`
For convenience, a list is provided of all `Fluxes` in Chef Adventure.

| Flux Name                 | Location                           | 
|---------------------------|------------------------------------|
| [Crimson](#drive-crimson) | Salt Mines - Mansion Entrance      |
| [Saffron](#drive-saffron) | Erocia Kingdom - Patrol Gate Entry |
| Lemon                     | ???? (undecided)                   |
| Viridian                  | ???? (undecided)                   |
| Aqua                      | ???? (undecided)                   |
| Royal                     | ???? (undecided)                   |
| Saffron                   | ???? (undecided)                   |


## <a name="drive-crimson" /> `Flux Drive: Crimson`
### Location
The `Spacial Flux Routine` of `Crimson` is located in the `Salt Mines`. It can be reached in the first pass through the
mines in Chapter 1. It is found on the very first map you arrive on in the `Salt Mines` in a chest.

> NOTE: the `Flux` will appear even if the `Spacial Flux Engine` hasn't been activated.

### About
The `Flux Drive: Crimson` unlocks `Crit Exchange`. This is a high-risk high-reward type of `Flux` that prevents enemies
from ever being able to dodge the player's critical hits by reducing their `Crit Evasion` parameter to -100%. In
exchange for this incredible advantage, the enemies also get a massive `Crit Chance` multiplier of 400% effectively
quadrupling their `Crit Chance`!

### Effects
#### Penalties
- Enemy `Crit Chance` multiplier of `400` (quadruple crit).

#### Bonuses
- Enemy `Crit Evasion` multiplier of `-100` (any evasion is negative now). 

#### Rewards
- `Exp Rate`/`Gold Rate`/`Drop Rate`/`Node Points Rate` multipliers of `120` (across the board `+20%` rewards!).

---
## <a name="drive-saffron" /> `Flux Drive: Saffron`
### Location
The `Spacial Flux Routine` of `Saffron` is located in the `Erocia Kingdom` behind a breakable wall on the entrance map.
It can be reached as a part of the main story progression near the end of chapter 3.

### About
The `Flux Drive: Saffron` unlocks `Sturdy Looting`. This is a `Flux` intended to reward those who can deal with more
durable enemies, possibly as a new game+ type of modifier. In exchange for giving enemies a significant boost to their
defensive parameters, they also will reward the player with more currency and loot drops!

### Effects
#### Penalties
- Enemy `Max HP`/`Endurance`/`Resist` multipliers of `150` (`+50%` durability increase).
- Enemy `Phys Dmg Rate`/`Magi Dmg Rate` multipliers of `50` (`-50%` phys/magi damage, aka more durability).

#### Bonuses
- Enemy `Crit Evasion` multiplier of `-100` (any evasion is negative now).

#### Rewards
- `Gold Rate`/`Drop Rate`/`Node Points Rate` multipliers of `150` (`+50%` to earned currency).