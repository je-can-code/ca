# `JABS Academy`
## Parameters in the context of `JABS`.
RPG Maker MZ comes with a whole lot of parameters. 28, in fact! Some of those got some special attention during the
development of `JABS`, and that is what we'll be going over in this section, so that you can make adjustments
accordingly within your game leveraging this plugin.

## The b-parameters aka "main" parameters
The b-params are often known as the "main" or "primary" parameters of an actor/enemy. They include:
### Max HP (and current HP)
Nothing has changed about this. Though you may want to make this higher than you'd otherwise thing to accommodate the
faster pace of battle due to it being real-time instead of turn-based.

### Max MP (and current MP)
Nothing has changed about this.

### Max TP (and current TP)
This plugin doesn't modify this directly, but enemies can use TP for their skills in combat, so it may be advised to
either use my plugin for TP Growth, or to find another that is compatible with my plugin. It is also worth noting that
this parameter isn't technically a part of any of the sets of parameters since you can't really modify it without a
plugin or something, but it fits best here.

### Attack
Nothing has changed about this.

### Defense
Nothing has changed about this.

### Magic Attack
Nothing has changed about this.

### Magic Defense
Nothing has changed about this.

### Agility
Nothing has changed about this.

### Luck
Nothing has changed about this.

## The sp-parameters aka "special"(?) parameters
I refer to these as "s-params". They govern some of the tertiary parameters that aren't as blately obvious. We should
probably go over these.

### ~~Target Rate~~ Aggro Rate
The `Target Rate` is kind of vague when it comes to how it even works. In short, it influences the rate at which an
actor is targeted in battle when the "skill-picking algorithm" (very loosely used) is deciding what to use. Since the
enemy actually has an AI of sorts, there is no need for the convoluted and messy algorithm under the hood. As such,
this parameter has been repurposed into "aggro rate". The default is 100, meaning no special influence, but by raising
this value, you can achieve an "aggro-seeker" type, or by lowering this value, you can achieve a "hidden in the
shadows" type. If you are unfamiliar with the concept of "aggro", it would be worth querying the interwebs for a more
concrete understanding of what this means.

### ~~Guard Effect~~ Parry Rate
The `Guard Effect` originally is literally the rate at which damage is taken while using the `Defend` command. Because
guarding in general has been completely revamped, I've opted not to use this parameter for this, but instead use this
as a sort of "parry" rating. The concept of "parry" is simply that if two battlers are facing eachother, there is a
parameter-based chance that an attack will be completely negated. This chance is based on the attacker's `HIT` and the
target's `GRD` aka parry. There is still "guarding", but you'll need to dig more into that section to find out more.
> If wanting to know the precise formula, do peek into the code to see it
> [over here](/chef-adventure/js/plugins/j/jabs/J-ABS.js).

### Recovery Effect
This now applies to natural regenerations via HRG/MRG/TRG now (which has also changed).

### Pharmacology
Nothing has changed about this.

### MP Cost Rate
Nothing has changed about this.

### TP Charge Rate
Nothing has changed about this.

### Physical Damage (rate)
Nothing has changed about this.

### Magical Damage (rate)
Nothing has changed about this.

### Floor Damage (rate)
Nothing has changed about this.

### Experience (rate)
Nothing has changed about this.

## The ex-parameters aka "extra"(?) parameters
I refer to these as "x-params". They govern some of the tertiary parameters that aren't as blately obvious. We should
probably go over these.

### Hit Rate
The `Hit Rate` originally is tied into the convoluted mess that is "landing a hit" in the base RPG Maker MZ. While it
does indeed still perform hit-check related things, it now also applies to reducing the rate at which you are parried by
your targets in combat. Check above under `Parry Rate` or in the other section about parrying for more details.

### ~~Evasion Rate~~ Parry Extension Rate
The `Evasion Rate` is a parameter that normally defines the random chance at which an attack can be "evaded". In the
context of an action battle system taking place on the map, this decision is no longer left to chance, and instead
reliant completely on the actual skill of the battler, either AI or player-controlled. So to make this more useful and
still somewhat related to mitigating damage, this would be better named `Parry Extension Rate`. The percent that this
parameter represents is multiplied directly against the number of frames defined in the database for a guard skill's
parry window. Having 50% EVA in `JABS` would translate to increasing all parry windows by 50% instead.

### Critical Rate
Nothing has changed about this.

### Critical Evasion (rate)
Nothing has changed about this.

### Magic Evasion (rate)
This parameter is no longer used in the context of `JABS`.
> It is in the works to add an extra tag for Magic Evasion rate to apply to skills defined as "magic" or something, but
> that is a work in progress.

### Magic Reflection (rate)
This parameter is no longer used in the context of `JABS`.
> It is in the works to build a "projectile reflection" functionality and use this parameter to represent that, but that
> is a work in progress.

### Counter Attack (rate)
Understandably, due to the flexibility of `JABS`, the blanket concept of performing a basic attack upon receiving a hit
is a little too boring. As such, this parameter still is related to countering, but now tied to guarding/parrying skills
and by increasing this parameter, a chance of auto-triggering this without a guard/parry becomes possible. It is
strongly recommended to read the section about guarding/parrying for more details.

### HP Regeneration
The concept of HP Regeneration in the base RPG Maker MZ scripts is just silly. Originally, it represents a % of your
maximum hp/mp/tp that will heal every turn, which by default is not really helpful at all to real-time combat that takes
place on the map. As such, this parameter has been reimplemented in the context of `JABS`. The number seen here will
represent the amount of HP recovered every five seconds while on the map. Please see the section about regeneration for
additional details.

### MP Regeneration
See HP Regeneration above, but pretend its talking about MP.

### TP Regeneration
See HP Regeneration above, but pretend its talking about TP.