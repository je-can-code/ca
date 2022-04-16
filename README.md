# Chef Adventure (for MZ)

Welcome to the public repository for `Chef Adventure`, a personal RPG Maker MZ project of mine.

> 🚧**This documentation is a work in progress**🚧

## What is Chef Adventure?
`Chef Adventure`, henceforth referred to as "`CA`", has been a pet project of mine for a long while.

### Short Version
It is a means of which I will be sharing with you the various functionalities of different plugins I've written. Most
prominently, I will be showcasing `JABS`.

### Long Version
It is indeed an partially completed but functional game that I am ever-working on.
As such, you can see the different functionalities that `JABS` has to offer, alongside a multitude of other plugins I've
written, such as my `SDP System`, my `Skill Extension System`, my `JAFTING and Refinement System`, and a bundle of
others that work to enhance the ABS experience. By presenting them to you in this fashion, you can see working examples
that you can think of as "defaults" that should be accelerate your own development!

When perusing this project, I insist you keep an open mind when thinking about what you can do with the variety of ways
I've allowed setup to be done. However, there are some things that have been designed in an opinionated way, so if you
desire a different functionality, do not be afraid to ask for it! Or better yet, feel free to contribute with a pull
request!

## Plugin Definitions
This RPG Maker MZ project showcases a number of plugins.

At a high-level, these are a set of plugins all developed by me with intention to be used in the context of a project
that is also leveraging `JABS`. Do keep in mind that using them outside of that context is largely untested, though I
did make an effort to keep things as compatible as possible with unrelated functionalities.

If you want to learn more about them, please click the below link to be taken to the details.

### Always Required
All of my plugins are coded by me, and thus they follow similar patterns. To reduce excess repeat of code, there is one
plugin that is always required to be present, updated, and at the top of the list:
- `J-BASE` the base plugin where most all of my shared logic lives, including some shared functionality.

### Full Systems
- [`JABS`, or `J's Action Battle System`](documentation/jabs/jabs-home.md)- an on-the-map and quick-paced form of 
battle; a tribute to the zelda franchise.
- [`SDP System`](documentation/sdp/sdp-home.md), a Stat Distribution System modeled after "panels"; a concept inspired
by Shining Force NEO/EXA.
- `JAFTING System`, a multi-purpose crafting and equipment modification system.
- `HUD Frame System`, a modular HUD with a few components; designed for JABS.
- `Proficiency System`, a conditional system based on skill usage granting rewards designed for the player.
- `Difficulty System`, a system enabling dynamic swapping of parameter modifiers against all enemies.
- `Elementalistics`, a system granting fine-tuned control over elemental functionality.
- `Skill Extend`, a system of allowing one or many skills extend the functionality of another.

### Lesser Utilities
- `Controlled Drops`, allows greater customization over the drops of an enemy.
- `One-Time Item Boost`, grants an actor permanent parameter bonuses the first time an item is consumed.
- `Log Window`, places a log window on the map that displays party/combat actions; designed for `JABS`.
- `Critical Factors`, a set of tags for modifying the way critical hits calculate in combat.
- `Level Master`, a utility that enables multiplier that scales with difference of level in combat.
- `Message Text Codes`, a message utility granting additional database-synced codes.
- `Event Describe`, a map utility for displaying text/icon data over character sprites on the map.
- `Passive Skill-States`, adds the ability for skills to grant passive effects- via states.
- `Text Pops`, a map utility for displaying popups on characters; designed for `JABS`.
- `TP Growth`, a battler utility for enabling growth of max TP via levels.

### Works in Progress
- `JABS CMS` aka `Custom Menu System` for `JABS`, some modified versions of screens to show additional data.
- `TIME` aka `Temporally Integrated Monitoring of Ecosystems`, used for tracking real or fake time.
- `System Utilities`, this is a small set of functionality I mostly wrote for myself.