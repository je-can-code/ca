# Chef Adventure (CA)

An RPG Maker MZ game by **Jeremy** (JE) — a long-running personal project carried across several RPG
Maker generations, now built in MZ on top of a large stack of his own hand-written plugins. On-the-map
hack-and-slash, grindy, loot-and-crafty, with a deliberately laughable story.

This repo is both the game and its design documentation. The plugins it runs on live in the sibling
`rmmz-plugins` repo and are copied in as built output — **never edit plugin code here.** Fix it in
`rmmz-plugins`, run `bun run hotfix` there, and let the copy step deliver it.

---

## Working with Jeremy

Be warm and personable, use emoji liberally in conversation, and explain what you did and why. Ask
before executing when something is ambiguous. **Never put emoji in code, comments, or commit messages.**

**Gamepad terminology:** PlayStation names. Face buttons are **Cross** (bottom), **Circle** (right),
**Square** (left), **Triangle** (top). Shoulders **L1/R1**, triggers **L2/R2**, and the **D-pad** is the
D-pad. Do not say "A/B/X/Y" unless Jeremy asks for a cross-platform mapping table.

**Bun only** for anything you run — never `npm`, never `node`, never Python. **Never modify data or
code with regex, `sed`, or `perl`**; read the file, then edit it, and ask before any bulk mechanical
pass.

## Layout

| Path | What it is |
|---|---|
| `chef-adventure/` | The MZ project itself — `data/`, `img/`, `audio/`, `js/`, `save/` |
| `chef-adventure/data/` | The database JSON. This is the real content: `Enemies.json`, `Skills.json`, `States.json`, `Classes.json`, `System.json`, plus `config.*.json` for plugin data |
| `chef-adventure/js/plugins/j/` | **Generated** — build output from `rmmz-plugins` via `bun run copy:to-ca`. Never edit; fix it upstream and re-copy |
| `chef-adventure/js/plugins/` (everything else) | Vendored third-party plugins — `casper/`, `kame/`, `others/`, `vs/`, and the separator files. These have **no upstream in `rmmz-plugins`**; if one needs a change, it happens here |
| `docs/` | Design documentation, and it is extensive |

### The docs tree

| Doc | What it covers |
|---|---|
| `main.md` | The hub — start here, it links everything below |
| `design-contract.md` | What CA is trying to be; how features, balance, and tutorials get judged |
| `story-bible.md` / `story-canon.md` | Chapters, the red-eyed gent, the seven sins, the ending |
| `database-decode-cheatsheet.md` | Trait `code` → meaning and `value` scaling. **Required reading before interpreting raw DB JSON** |
| `menu-architecture.md` | Menu and UI structure |
| `classes/`, `enemies/`, `weapons/`, `food/`, `quests/`, `maps/`, `walk/`, `unlockables/`, `tutorials/` | Per-system design |
| `nodes/`, `sdp/` | The stat distribution system — see terminology below |
| `todo.md` | Running work list |

## Terminology that matters

The stat distribution system is **SDP** in code and plugin namespaces. Two in-world names sit on top of
it, and each is documented in exactly one place:

- **"Nodes"** are the panels. Per `docs/nodes/main.md`: *"'Nodes' are the fancy name given to the
  'panels' of my 'Stat Distribution Panel System' aka SDP system."* A node is a collection of parameters
  that scale as it levels via a node-specific currency.
- **"Node Junction"** is the in-story name for the device that grants a character SDP access — it
  appears only in `docs/story-canon.md`, in narrative context ("he hands them their Node Junctions,
  enabling SDP").

Use the in-world names in player-facing text, and the code names when discussing implementation. If you
need the precise player-facing wording for something new, check those two docs rather than assuming —
the terminology is thinner on the ground than it looks.

**"NJS" is not a real acronym.** It appears nowhere in this project. Do not invent it.

---

## Reading the database

**Never infer meaning from raw numbers.** A trait row like `{"code":32,"dataId":14,"value":0.15}` cannot
be decoded by guessing what `32` means.

The workflow:

1. Read **`docs/database-decode-cheatsheet.md`** for `code` → meaning and how `value` scales.
2. Resolve names from **live data**, never from memory:
   - **Elements, skill types, weapon types, armor types, equip slots** — `chef-adventure/data/System.json`,
     where the **array index is the id**.
   - **States, skills, items, weapons, armors** — the respective `data/*.json`, matching the row's `id`
     field to its `name`.

Two that are easy to get wrong:

| code | Meaning | What `value` means |
|---:|---|---|
| `22` + dataId `3` | Crit Dodge (**cev**) | a multiplier |
| `32` + a state dataId | **on-hit state proc** | a **chance** — `0.15` is 15% |

**Mastery notetags** (`<skillHistoryBonus>`, `<passiveSourceRule>`, …) are **not** traits. See
`docs/sdp/implementation-status.md`.

**Editor parity:** `jmz-data-editor/app/src/presentation/hooks/useTraitMapping.ts` implements the same
code → meaning map. If the editor and the cheatsheet ever disagree, the editor's behavior is what
actually wrote the data.

> **Known gap:** the cheatsheet documents a `bun chef-adventure/tools/decode-db-trait.mjs` CLI in seven
> places. **That tool no longer exists** — `chef-adventure/tools/` is gone. The cheatsheet's tables and
> the live-data lookup rules above are still correct and sufficient; just do the resolution by hand and
> do not waste time trying to run the CLI.

### Enemy AI tags

Map event pages can carry the same AI trait and role tags as the enemy database rows, and **the map
event wins.** `Enemies.json` only supplies the default. Never judge whether an AI behavior is reachable
by reading the database alone — check the map events that spawn the enemy too.

### Action maps

On a skill, `<actionId:N>` selects the action-map event that renders it. Event **1** is "on caster"
(melee), event **2** is "no visual". A skill missing the tag **silently defaults to 1** rather than
erroring, which makes a missing tag look like a targeting bug.

---

## Git and pull requests

- **Never push directly to `main`.** Feature branch and a PR, always.
- **Squash-merge every PR.** No merge commits, no rebase merges.
- **Never reference Claude, Cursor, AI, or any AI tool** in a commit message, PR body, code comment, or
  anywhere else in the repo. No `Co-Authored-By` trailers, no "Generated with" footers. Jeremy is the
  sole author and commits must read in his own voice.
- Use the `gh` CLI for GitHub operations. Write PR bodies to a temp file and pass `--body-file` rather
  than inlining a heredoc — bodies contain backticks and `$`, and the shell will happily mangle both.
- **Commit the data.** When plugin work lands in `rmmz-plugins`, the corresponding `chef-adventure/data/*.json`,
  `plugins.js`, and anything else the editor or tooling touched belongs in a commit here too. Nothing
  that belongs in git should be left behind in either repo.
- Assume a sibling Claude session may be working in this repo right now. Unexplained changes in the tree
  are usually them, not corruption.

**Database JSON is high-value and hard to reconstruct.** A large cosmetic reformat is not evidence that
a change is safe — a whole-file rewrite can hide real data loss inside a diff that looks like nothing
but whitespace. Inspect before overwriting, and never route around a blocked destructive git command.
