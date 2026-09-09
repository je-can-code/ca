# 🧑‍🍳Chef Adventure (for MZ)

Welcome to the public repository for `Chef Adventure`, a personal RPG Maker MZ project of mine.

> 🚧**This documentation is a work in progress**🚧

## What is Chef Adventure?
`Chef Adventure` has been a pet project of mine for a long while across the different iterations of RPG Maker, with this
current version being built in **RPG Maker MZ**.

## Where did all the plugins and their documentation go?
In previous version of this project, the source of all my plugins were stored within this game project. That has since
changed, and now lives in another of mine repos:
> https://github.com/je-can-code/rmmz-plugins

If you want to grab the latest version of a plugin, I'd encourage visiting over there. The `project/js/plugins/`
directory holds all the compiled plugins, each carrying its usage instructions in its own `@help` block. They're
sorted into a folder per plugin family rather than sitting in one flat pile, so `J-Base` lives under `base/`:
> https://github.com/je-can-code/rmmz-plugins/blob/main/project/js/plugins/base/J-Base.js

There's also a [notetag reference](https://github.com/je-can-code/rmmz-plugins/blob/main/docs/notetag-reference.md)
over there, which is the one flat list of every notetag across the whole ecosystem.

## How do I run it?
You'll need [NW.js](https://nwjs.io/) (the SDK build, if you want DevTools). Then from the repo root:
```bash
./debug.sh
```
That launches the game in playtest mode. The script uses `nw` from your `PATH`, or you can point the `NWJS_EXE`
environment variable at the binary if you keep it somewhere else:
```bash
export NWJS_EXE="$HOME/.local/bin/nw"
```
Fair warning: the script sends all output to `/dev/null` and backgrounds itself, so if the game fails to boot you get
a silent no-op rather than an error. When something's wrong, run `nw ./chef-adventure/ "test"` directly and read what
it prints.