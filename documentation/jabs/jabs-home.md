# `JABS` aka `J's Action Battle System`
```yaml
Plugin Name: J-ABS
Status: Complete
Version: 3.0.0
Documentation Last Updated: 15/4/2022

Requires:
- J-Base

Recommended:
- J-HUD
- J-
```
[Goto the plugin directory](/chef-adventure/js/plugins/j/jabs).

### Overview
Welcome to the `JABS` overview!

Here we will go over a variety of functionalities that `JABS` has to offer. There is a lot of different functionality,
as the project is well over 30k lines of code, but I'll do my best to explain all of it objectively, and provide some
examples of usage in the context of my own game, `Chef Adventure`.

This plugin definition will be split into two sections, the **academy**, and the **tags**. If you have never used
this plugin before, and/or are trying to set this up anew, it is strongly recommended that either you leverage this
project as the base, or start with the academy section and review the first time setup.

But first...

## What is `JABS`?
`JABS` is an acronym of `J's Action Battle System`. It also doubles as a kind of punny way to name an `ABS`.

By leveraging this system, you can build projects that perform combat actions while on the map instead of in a
conventional turn-based battle system that comes standard with RPG Maker MZ. 

## Tutorials
Putting together all the data in your head for the first time can be kind of daunting. Thus, I stood up the `JABS
Academy`! At the `JABS Academy`, we'll cover a variety of lessons and use-cases for things you might do fairly
frequently in your own game.

As such, I put it in a document all to its own.

### [click here to enter the `JABS Academy` of learning](academy/jabs-academy.md).

## Notetag tags
As you might suspect, to translate all the extra data that it takes to construct the complex things like enemy AI, your
skill's capabilities, and so on, I needed a way to add that kind of metadata to stuff in the database. The easiest and
most straight-forward way would be to leverage the numerous note fields found all throughout the database. However, now
there are a huge number of tags that you need to know about in order to make this a reality.

As such, I put it in a document all to its own.

### [click here for the `JABS Glossary` of tags](glossary/jabs-glossary.md).