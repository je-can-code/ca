# `JABS Academy`
## Initial setup and the required assets etc.
`JABS` is obviously a pretty sizable beast of a plugin, and so there is a few things that require some amount of setup.
This section will go over some of the basics for what you need to know to be able to run this monster!
1) The `Action Map` and what it does
2) The various required assets

## The `Action Map`
### Overview
At the core, the plugin is an action battle system. This means all combat will instead take place on the map in somewhat
real-time rather than a turn-based battle system that exists in a separate not-map-related scene.

In a turn-based battle system such as the default, there is no real observable visual associated with an action. When an
actor uses a skill, the skill simply applies to the target, whether that be ally or enemy or otherwise. When on the map,
there is an extra dimension of combat that must be accommodated for: spatial relativity between combatants! And of
course, obviously your selection of skills such as `Slash` and whatnot don't 100% hit their targets- as they can move
out of the way of your `Slash` attacks!

Effectively, we are replacing the `J` of `JRPG` with an `A` to make this an `ARPG` instead. As such, when you perform
your skills, they are typically represented by some manner of projectile on the map. This concept is brought to life in
the form of `Action Map`- a map full of events that will represent the visual component of a skill being executed on the
map.
> Despite being a map, it is absolutely not expected that the player be able to navigate to this map in any way.

### Implementation
If you opted against leveraging the demo project, then you'll need to create a brand new map for this purpose.

> The `Action Map` is **NOT** optional.

While the map can be named whatever you like, you do need to take note of the `mapId` of the newly-created `Action Map`.
This `mapId` is required to be entered into the plugin parameters to inform the engine what map to look to when creating
new actions on the map.

Over the course of your `JABS` journey, you'll likely create a number of different skills that actors and enemies alike
will be able to use. Chances are, most of these skills will want a visual component, like a `fireball` for your `Fire`
spell that your mage casts. When such a time comes, you'll need to create the event representing the movement pattern
and asset to match the skill. This is the map that such events will live in. These events are called "actions" and make
up the crux of the combat system this plugin offers.