# Chef Adventure — menu architecture

> Living doc for **every scene the game leverages**, how they relate, and the rules that keep them
> coherent. Written 2026-07-27 while designing `Scene_JabsLoadout` and the shared scene skeleton.
> Pair with the plugin sources under `rmmz-plugins/src/plugins/`.

---

## The constraint that shapes everything

**The party is exactly two actors — Jerald and Rupert — for the entire game.**

This is new (it became true when the elementals were demoted from party members to NPCs) and almost
nothing is built for it yet. Every actor-scoped scene currently cycles through party members one at a
time, which is the correct design for a variable-size party and the wrong one for a fixed pair.

One consequence runs through this whole document: a fixed pair can be shown **side by side**, and "is
Rupert covering the gap in Jerald's kit?" is the question a two-person party actually asks.

But see [§4c](#4c-which-scenes-are-two-up--and-why-most-are-not) — the fixed pair makes two-up
*possible*, not *affordable*. Exactly one scene can pay for it.

---

## Tier 1 — actor-scoped scenes

These answer "something specific about this actor." They are the scenes that should share a skeleton.

| Scene | Plugin | Ribbon | Actor mechanism | Reached from |
|---|---|---|---|---|
| `Scene_Aptitude` | apt | `Window_AptitudeRibbon` → `Window_ActorRibbon` | `actor-next/prev` | Main menu — "Aptitude" |
| `Scene_SkillEquip` | sks | `Window_SkillEquipRibbon` → `Window_ActorRibbon` | `actor-next/prev` | Main menu — "Skill Equip" |
| `Scene_Passive` | passive | `Window_PassiveActorRibbon` → `Window_ActorRibbon` | `actor-next/prev` | Main menu |
| `Scene_SDP` | sdp | **bespoke** `Window_SdpHeader` | `actor-next/prev` → `cycleMembers` | Main menu + JABS quick menu |
| `Scene_Equip` | cms/ext/equip | `Window_EquipActorRibbon` → `Window_ActorRibbon` | `actor-next/prev` | Main menu (vanilla slot) |
| `Scene_Status` | cms/ext/status | none | 5 actor refs | Main menu (vanilla slot) |
| `Scene_Skill` | cms/ext/skill | none | light touch (97 lines, 4 alias hooks) | Main menu (vanilla slot) |
| `Scene_JabsLoadout` | *(proposed)* | — | — | — |

**Eight scenes.** Four ribbons share `Window_ActorRibbon`; SDP's went its own way.

## Tier 2 — global / party scenes

Never actor-scoped. These keep their own doors and stay out of any actor carousel.

| Scene | Plugin | Notes |
|---|---|---|
| `Scene_JabsRemap` | abs/ext/input | Global input bindings. No actor at all. Main menu — "JABS Controls" |
| `Scene_Difficulty` | diff | Global |
| `Scene_Jafting`, `…Salvage`, `…Create`, `…Refine` | jafting (+2 ext) | Party inventory |
| `Scene_Omnipedia`, `…Monsterpedia`, `…Questopedia` | omni (+2 ext) | Reference. Omnipedia also on the JABS quick menu |
| `Scene_Menu` | **cms/core** | 57 lines, zero alias hooks — already a full rewrite. **This is the hub.** |

## Tier 3 — still vanilla

`Scene_Item` · `Scene_Options` · `Scene_Save` · `Scene_Load`¹ · `Scene_Shop` · `Scene_GameEnd` ·
`Scene_Name` · `Scene_Title` · `Scene_Gameover` · `Scene_File` · `Scene_Debug` · `Scene_Battle` ·
`Scene_Message` · `Scene_Map` · `Scene_Splash` · `Scene_Boot`

¹ `Scene_Load` carries one JABS hook. `Scene_Equip` also gets a light touch from `natural`.

---

## Input vocabulary

`_base/windows/Window_Selectable.js` already defines a **central semantic input vocabulary**. Scenes
bind handler *names*, never physical buttons — the mapping lives in one place and applies everywhere.

| Semantic handler | Physical | Established meaning |
|---|---|---|
| `actor-prev` / `actor-next` | **L1 / R1** (`pageup`/`pagedown`) | change **who** |
| `content-prev` / `content-next` | **L2 / R2** | change **which subset**, within this scene |
| `context` | **Triangle** (`tab`) | contextual action on the highlighted row |
| `more` | **Square** (`shift`) | show extended detail |

**24 handler registrations across the ecosystem already obey this.** It is a real standard, not an
aspiration:

- SDP — `content-*` cycles family filters, `context` filters, `actor-*` cycles members
- Passive — `content-*` cycles tabs
- Questopedia — `content-*` cycles categories
- Aptitude — `context` toggles view mode
- SkillEquip / cms-Equip — `context` unequips the highlighted slot

> **Rule: L2/R2 means "change the view *within* this scene."** It does not mean "change scene."
> Any cross-scene navigation must not be built on it.

### L1/R1 stays actor cycling — everywhere

An earlier draft argued that showing both actors frees L1/R1 for cross-scene navigation. That died
with the two-up analysis: only Loadout is two-up, so **`actor-prev/next` remains the meaning of L1/R1
in all eight scenes**, and cross-scene navigation lives in the hub instead. There is no free shoulder
pair, and inventing one by overloading an existing meaning is how the vocabulary rots.

---

## Known drift

Measured, not theorised. All of it is independent implementations of one idea diverging over time.

| Concern | State |
|---|---|
| Container width | Aptitude centers a **66 %** container; SkillEquip is full-width with a magic **420 px** column; JabsRemap is a third thing |
| Internal consistency | Aptitude mixes `mainAreaTop()` and `Graphics.boxHeight` between its own rects |
| Actor ribbon | 4 scenes share `Window_ActorRibbon`; SDP has a bespoke `Window_SdpHeader` |
| Emphasis | SkillEquip gives the *available skills* picker the whole left side and squeezes the **slots** — the actual subject — into 420 px. Inverted |
| Button help | Only SDP had one (`Window_SdpControlsHint`). **Resolved for facet scenes** — `Window_ControlLegend` is now standard, and renders live glyphs for the device in hand. Still outstanding for the seven until Phase 5 reaches them |

---

## Reference implementation

**`Scene_SDP` is the furthest-evolved scene and should be the template**, not a clean-sheet design.
It already contains the entire proposed skeleton:

| Window | Role |
|---|---|
| `Window_SdpHeader` + `Window_SdpPoints` | actor ribbon |
| `Window_SdpHelp` → `Window_Help` | descriptions |
| `Window_SdpControlsHint` | **button help** |
| `Window_SdpList` / `Window_SdpParameterList` | list + detail |
| `Window_SdpMastery` / `Window_SdpRewardList` / `Window_SdpCart` | scene-specific content |

The shared base is an **extraction of what SDP already proved**, retrofitted onto the other seven.

---

## Decisions

### Settled

- **Merge the frame, never the scenes.** Merge when facets differ only in *data*; separate when they
  differ in *behaviour*. These differ in behaviour (SKS has a dual slot/point budget, SDP has
  cart-based rank-up, Aptitude tracks multi-source progress, Loadout derives input composition).
  - Evidence: `Window_AbsMenuSelect` **is** the merged design — one class, ten modes, a `switch`.
    It hardcodes `$gameParty.leader()` in every mode because a shared class has nowhere to put
    "which actor?" That merge *caused* the "must flip party leaders to edit an ally" problem.
- **The shared base lives in J-Base.** Zero new coupling: 25 of 29 plugin families already declare
  `@base J-Base`, and `Window_ActorRibbon` already sets the precedent for shared scene furniture.
- **No facet carousel.** An earlier draft routed cross-scene navigation through L2/R2. That is already
  the established meaning of "change the subset within this scene" (SDP families, Passive tabs,
  Questopedia categories — 24 registrations), so the carousel would have hijacked a working standard.
  The hub is the cross-scene navigator instead, and it costs zero input budget.
- **The base owns a *bounded* middle.** Contents free, rect fixed. Unbounded is how 66 % / 420 px /
  `mainAreaTop()` happened.

- **The base is single-actor, always.** Two-up is a window-level concern with exactly one consumer
  (`Window_LoadoutBoard`). The base has no `isTwoUp()`.
- **Cross-scene navigation lives in the hub**, not on a shoulder button. Both pairs are already spoken
  for and the round trip this was meant to shorten is already fixed by topology.
- **`Scene_Status` and `Scene_Skill` join the skeleton**, and their full-size actor profile is gutted —
  the hub is the only place a full portrait appears.
- **Names:** `Scene_MenuFacetBase` / `Scene_ActorFacetBase`.
- **The quick menu is retired, not pared** *(2026-07-29)*. A two-item menu whose first item opens
  another menu is a keypress charged for nothing. The map keeps no menu of its own; the menu button
  opens the hub. See section 4.
- **Button glyphs auto-detect the device; there is no "button style" setting** *(2026-07-29)*. The whole
  reason this work exists is a player who never found a feature — and that player does not open an
  options menu to tell the game what is in their hands. Auto-detect is right by default for everyone; a
  setting is right only for those who configure it. The glyph sheet is PlayStation + keyboard only, so
  the options would have read "PlayStation / Keyboard" — a fact about the player's desk, not a taste.
  `InputDeviceTracker.currentDevice()` is a one-method seam if this is ever revisited.

### Open

- Contents of the hub's center panel beyond face/name/level/gauges — deliberately deferred until the
  skeleton exists
- **The Group B reparenting mechanism** — `Object.setPrototypeOf`, a prototype mixin, or outright
  replacement, for the three engine-owned scenes. Deliberately deferred until Group A is done, since
  four retrofits will show what the base actually needs to expose. See Phase 5.

---

## The build plan

### 1. What lives in J-Base

**Already there — reuse unchanged:**

| Piece | Role |
|---|---|
| `Window_ActorRibbon` | actor face ribbon (4 scenes already extend it) |
| `Window_Help` | description window |
| `Window_Selectable` | **the semantic input vocabulary** — `context`, `content-*`, `actor-*`, `more` |
| `Window_Command` · `WindowCommandBuilder` · `BuiltWindowCommand` | command construction |
| `Window_MoreData` | extended detail popup |
| `Scene_Base` | `callScene()`, modal dimmer |

**New — the shared skeleton:**

| Piece | Role |
|---|---|
| `Window_ControlLegend` | **promoted from `Window_SdpControlsHint`.** Generalised from a hardcoded string to a list of `{semantic, label}` pairs. See the resolver note below |
| `Scene_MenuFacetBase extends Scene_MenuBase` | **outer layer, all 18 scenes.** Owns help rect, legend rect, and the *bounded* middle |
| `Scene_ActorFacetBase extends Scene_MenuFacetBase` | **inner layer, the 8.** Owns actor ribbon(s), two-up rendering, actor resolution |
| `WindowCommandBuilder.setMenuSection()` + `BuiltWindowCommand.menuSection` | routes a command to the actor column or the party column |

> `setExtensionData()` already exists but is used for arbitrary per-plugin payloads
> (`cmd.ext.kind`, `cmd.ext.ns`…). Section routing gets a first-class field so it cannot collide.

#### Legend icon resolution — verified, with a caveat

Live resolution *is* possible: `Window_Selectable`'s semantics use vanilla symbol strings, and those
strings **are** the `JabsInputSymbols` values — `context`→`'tab'`→`JabsInputSymbols.Tool`,
`content-next`→`'r2'`→`MobilitySkill`, `actor-prev`→`'pageup'`→`SkillTrigger`. `IconManager` holds a
symbol→icon registry keyed by exactly those.

**But that registry lives in `abs/ext/input`, which J-Base must not depend on.** So:

- `Window_ControlLegend` takes `{semantic, label}` pairs and renders **plain text by default**
- J-Base exposes an optional **icon-resolver hook**; J-ABS-Input registers itself into it at boot
- with the resolver present, legends render live controller glyphs that follow remapping
- without it, they degrade to readable text

Same registration pattern as the facet ring — no plugin names another, and nothing breaks when a
plugin is absent.

### 2. Hub layout — three columns, proportional

```
┌──────────────────────────────────────────────────────────────────────┐
│  HELP / description of the highlighted command                       │
├──────────────┬────────────────────────────────────┬──────────────────┤
│  ACTORS      │        Jerald    │    Rupert       │  PARTY           │
│    Status    │   face · lv · hp/mp/tp             │    Items         │
│    Equipment │   key params · weapon · states     │    Crafting      │
│    Skills    │                                    │    Bestiary      │
│    SkillEquip│                                    │    Quests        │
│    Loadout   │                                    │    Controls      │
│    Aptitude  │                                    │    Difficulty    │
│    Passive   │                                    │    Save          │
│    Nodes     │                                    │    Options       │
├──────────────┴────────────────────────────────────┴──────────────────┤
│  ✕ open    ○ back    □ more                                          │
└──────────────────────────────────────────────────────────────────────┘
```

**Everything derives — no literals.** All of it is expressed against `Graphics.boxWidth` /
`Graphics.boxHeight`, `mainAreaTop()`, `mainAreaHeight()`, and `lineHeight()`:

| Rect | Derivation |
|---|---|
| help height | `fittingHeight(2)` |
| legend height | `fittingHeight(1)` |
| main area | `Graphics.boxHeight − helpHeight − legendHeight` |
| side column width | `Math.floor(Graphics.boxWidth * COMMAND_COLUMN_RATIO)` |
| center width | `Graphics.boxWidth − (sideWidth * 2)` — absorbs any rounding remainder |
| per-actor cell | `centerWidth / $gameParty.size()` |

`COMMAND_COLUMN_RATIO` is a single named constant on the base (starting value ≈ `0.22`), overridable
per scene. At 1920 that yields ≈ 422 / 1076 / 422; at any other resolution it still fills the width,
because the center is defined as *the remainder* rather than a number.

The ribbon is **inert context**, not selectable — the actor-selection step is deleted, not relocated.

> **Rule: no hardcoded pixel dimensions anywhere in the base or the scenes built on it.** The magic
> `420` in `Scene_SkillEquip` is the exact failure this replaces.

### 3. Accommodating the existing menu-list extenders

Six plugins currently alias `Window_MenuCommand.addOriginalCommands` and call `addBuiltCommand`:
**omni, sks, apt, sdp, passive, abs/ext/input** — each switch-gated by its own plugin parameter.

**Do not change the registration API. Change the consumption.**

The hub builds the command list exactly as today, then *routes* each entry by `menuSection`:

- tagged `actor` → left column
- tagged `party` or **untagged** → right column

So all six keep working untouched, landing on the right, and get moved left by adding one
`.setMenuSection(MenuSection.Actor)` call whenever convenient. Any future plugin that never learns
about sections still works. Switch-gating, icons, and help text all continue to function unchanged.

### 4. Retiring the quick menu — *revised 2026-07-29*

This section originally planned to **pare** the quick menu down to two commands: `main-menu` and
`ally-ai`. That happened, and then the result was looked at, and the result was not good.

**A two-item menu whose first item opens another menu is not a menu.** Once the five `*-assign`
commands had moved into the loadout scene and SDP/omnipedia had been dropped, the quick menu's whole
remaining content was one redundant entry and one door to the last on-map window stack. It was a
keypress charged for nothing, on the most-used navigation in the game — and it overlapped the TIME
HUD in the top-right corner, which is what finally drew attention to it.

**So it is gone entirely.** `Window_AbsMenu` is deleted, along with the allyai extension that appended
to it.

| Was | Now |
|---|---|
| menu button → quick menu on map | menu button → **main menu**, directly. Same binding (`start`) |
| quick menu → `main-menu` | *(step no longer exists)* |
| quick menu → `ally-ai` → 3 stacked on-map windows | main menu → party column → **`Scene_JabsAllyAi`** |
| the five `*-assign` commands | `Scene_JabsLoadout` |
| `sdp-menu`, omnipedia | hub doors, as planned |

`Window_AbsMenuSelect` — flagged here as undeletable because Ally AI rode on it — **was** deleted, in
Phase 4's first pass. Its ally AI modes were extracted into a standalone `Window_AllyAiSelect`, which
is what made the scene promotion cheap later: the window was already free-standing.

**Deleting the on-map menu deleted two engine flags.** `$jabsEngine.requestAbsMenu` meant "a menu is
open on the map" and gated both player movement and JABS input; a scene needs neither, because
`Scene_Map` is not the running scene while it is open. `requestJabsMenuRefresh` existed so a switch
flip could re-render the quick menu's command list; a scene builds its list on creation. Both are gone,
along with the plugin command, the `Game_Switches` hook, and the two follower-visibility hooks that set
them.

⚠️ **One check had to move rather than die.** The quick menu greyed out its `main-menu` command when
`$gameSystem.isMenuEnabled()` was false. With no command left to grey out,
`JABS_InputAdapter._canPerformMenuAction()` now honours it — otherwise the menu opens during cutscenes
that disabled it. The separate refusal to let vanilla's `Scene_Map#callMenu` work is **unchanged and
must stay**: the key it listens for is the one JABS gives to the offhand attack.

**Loadout remains deliberately reachable only through the hub**, for the original reason — backing out
of it should return the player to the actor column, not dump them on the map.

**Net effect: 605 lines added, 1363 removed.**

### 4b. Loadout input map

The two-up focus problem dissolves: **the board is a two-column `Window_Command`** (`maxCols() = 2`,
column 0 Jerald, column 1 Rupert, one row per slot). Horizontal cursor movement between actors is
then *native grid navigation* — no binding invented, nothing hijacked.

| Input | Semantic | Loadout behaviour |
|---|---|---|
| D-pad ↑ ↓ | — | move between slots |
| D-pad ← → | — | move between actors (native 2-column grid) |
| ✕ | `ok` | assign a skill/item to the highlighted slot |
| ○ | `cancel` | back to the hub |
| △ | `context` | clear the highlighted slot |
| □ | `more` | detail on the slotted skill |
| L1 / R1 | `actor-prev/next` | **inert** — both actors are already visible |
| L2 / R2 | `content-prev/next` | **unused** — reserved, do not invent a use |

Slots per actor, in order: **offhand · combat 1-4 · dodge · tool · usable item** (eight rows).
Mainhand is *not* listed — it is weapon-derived and not player-assignable.

`L1/R1` staying inert rather than being repurposed is deliberate: `actor-*` means "change who"
everywhere, and in a scene showing everyone there is simply nobody to change to. Giving it a second
meaning here is how the vocabulary rots.

### 4c. Which scenes are two-up — and why most are not

Two-up only works when a scene has **no permanent picker or detail column**, because the picker
occupies exactly the space the second actor needs. That single test decides all eight:

| Scene | Two-up | Reason |
|---|---|---|
| **Loadout** | ✅ | eight fixed rows per actor; its picker is a **modal over** the board, not a column. The ONLY two-up scene |
| Status | ❌ | 3,542 lines across six paginated windows — the densest actor scene in the game |
| Skill | ❌ | long skill list **+** permanent detail panel |
| Equip | ❌ | slot list **+** permanent item picker |
| SkillEquip | ❌ | slot list **+** permanent candidate pool |
| Aptitude | ❌ | long progress lists **+** sources panel |
| Passive | ❌ | list **+** detail panel |
| SDP | ❌ | list **+** params **+** mastery **+** rewards **+** cart |

**So the base has no `isTwoUp()` at all.** Two-up is a **window-level** concern with exactly one
consumer: `Window_LoadoutBoard` sets `maxCols() = 2` and renders both actors itself. The base never
needs to know.

Earlier drafts got this wrong twice — first defaulting `true` on the reasoning that "the party is
always two, so always show both," then defaulting `false` with Status opting in. Both were wrong for
the same reason: **the fixed pair makes two-up *possible*, not *affordable*.** Status in particular
is 3,542 lines across six paginated windows — the densest actor scene in the game.

Consequence: `actor-prev/next` on L1/R1 is the meaning in **all eight** scenes, with no exceptions.
It is merely inert in Loadout, where both actors are already on screen and there is nobody left to
cycle to.

### 4d. Constraints the build mechanically enforces

`bun run verify:ships` runs 10 independent checks. Three of them govern this work directly, and the
first one will reject the most natural way to write it:

| Check | What it means here |
|---|---|
| **`source-no-cross-plugin-base-import`** | **A plugin may not `import` from another plugin — including J-Base.** The new base scenes, `Window_ControlLegend`, `MenuSection`, and `InputLegendResolver` must be consumed as **runtime globals**, exactly like `Window_ActorRibbon` and `DiaLogBuilder` already are. Writing `import Scene_ActorFacetBase from '../../../_base/scenes/…'` fails the build |
| `source-export-default-only` | each new file exports exactly one default |
| `source-j-namespace-bootstrap-in-init-only` / `…-no-runtime-state` | `J.*` namespace setup belongs in `_metadata/initialization.js`; no runtime state parked on the namespace |

Also enforced: `verify:docs` (1413 files), `verify:no-typeof`, `verify:no-instanceof`, and oxlint.

**Creating `abs/ext/loadout` uses the scaffolder** — `bun run plugin:init`, then follow the generated
`SCAFFOLD.md` for namespace, vite config, and the `package.json` build script. Do not hand-roll a new
plugin family; the build registration is easy to get subtly wrong.

### 4e. Work the phase table does not show

| Item | Notes |
|---|---|
| **Version bumps** | **Do not bump anything.** Versions are bumped once, at PR time, across everything, documented against main. Not per-phase |
| **Tests** | **Authored at the end, once the code is complete.** Tests here exist to guarantee nothing broke, not to build to a spec that is still moving. When written, cover the pure logic — `MenuSection`, `setMenuSection`, `InputLegendResolver`, base rect math. Scenes themselves stay untested per existing convention |
| Plugin annotations | `@help` / changelog blocks still need updating as files change — `verify:docs` gates the build on it |
| Legend content | Each scene must author its `{semantic, label}` pairs. Small per scene, but it is the entire discoverability payoff |
| Save compatibility | No `Game_*` or `$game*` state changes shape, so saves are unaffected. Scene-level members (SDP's `_j._sdp._cart`, etc.) are transient |

### 5. File-by-file mapping

#### Phase 1 — J-Base foundation *(additive; nothing breaks)*

| File | Change | Why |
|---|---|---|
| `_base/windows/Window_ControlLegend.js` | **new.** `extends Window_Base`. Takes `{semantic, label}[]`, renders a single reduced-size line. Ports the `padX`/`modFontSize(-4)`/vertical-center treatment from `Window_SdpControlsHint` | every scene needs button help; only SDP has it today |
| `_base/managers/InputLegendResolver.js` | **new.** Registry mapping a semantic (`context`, `content-next`, …) to a display glyph. Empty by default; returns the plain label when unresolved | lets J-ABS-Input supply controller glyphs **without J-Base depending on it** |
| `_base/scenes/Scene_MenuFacetBase.js` | **new.** `extends Scene_MenuBase`. Owns `helpWindowRect()`, `legendWindowRect()`, `facetAreaRect()` (the bounded middle), `COMMAND_COLUMN_RATIO`, and legend wiring. Subclasses fill the middle only | the outer layer, shared by all 18 scenes |
| `_base/scenes/Scene_ActorFacetBase.js` | **new.** `extends Scene_MenuFacetBase`. Adds the ribbon rect, actor resolution via `$gameParty.menuActor()`, and `actor-prev/next` wiring. **Single-actor always — there is no `isTwoUp()`** | the inner layer, the 8 actor scenes |
| `_base/models/WindowCommandBuilder.js` | **edit.** Add `setMenuSection(section)` | routes a command to the actor or party column |
| `_base/models/BuiltWindowCommand.js` | **edit.** Add `menuSection` field, defaulting to `party` | untagged commands must keep working |
| `_base/models/MenuSection.js` | **new.** `static Actor = 'actor'; static Party = 'party';` | avoid magic strings |
| `_base/entry.js` | **edit.** Import the four new files | build registration |
| `abs/ext/input/managers/IconManager.js` | **edit.** Register into `InputLegendResolver` at boot, mapping semantics through their vanilla symbol strings (`context`→`'tab'`→`JabsInputSymbols.Tool`→ icon) | live glyphs that follow remapping |

#### Phase 2 — the hub

| File | Change | Why |
|---|---|---|
| `cms/core/scenes/Scene_Menu.js` | **rewrite.** Three columns via `Scene_MenuFacetBase` math. Creates `Window_MenuActorCommand`, `Window_MenuPartyCommand`, and the center party panel. Deletes `commandWindowRect`/`statusWindowRect` overrides | the current file only nudges vanilla rects; the new layout is structural |
| `cms/core/windows/Window_MenuActorCommand.js` | **new.** Filters the built command list to `menuSection === Actor` | left column |
| `cms/core/windows/Window_MenuPartyCommand.js` | **new.** Filters to `Party` **and untagged** | right column; untagged default is what keeps unknown plugins working |
| `cms/core/windows/Window_MenuStatus.js` | **rewrite.** `numVisibleRows()` 6→`$gameParty.size()`; one column per actor across the center instead of stacked rows. **This is the only place a full-size actor portrait appears** (face now, real artwork later). Contents beyond face/name/level/gauges are deliberately left sparse until the skeleton exists | six stacked rows wastes the center; and concentrating the big portrait here is what lets every other scene drop to a ribbon |
| `cms/core/windows/Window_MenuCommand.js` | **edit.** Tag `skill`/`equip`/`status` as `Actor`; `item`/`options`/`gameEnd` stay `Party` | vanilla commands must land in the right columns |

**Rewiring the deleted actor-selection step — verified mechanics.** Vanilla routes three commands
through an actor picker:

```js
commandWindow.setHandler("skill",  this.commandPersonal.bind(this));   // → status window select
commandWindow.setHandler("equip",  this.commandPersonal.bind(this));   // → onPersonalOk
commandWindow.setHandler("status", this.commandPersonal.bind(this));   // → SceneManager.push(...)
```

So Phase 2 must additionally:

- give `skill` / `equip` / `status` **direct handlers** that push their scenes immediately
- override `commandPersonal`, `onPersonalOk`, `onPersonalCancel` to no-ops (or drop the bindings)
- **not** wire `ok`/`cancel` handlers on the center status window — it becomes inert context
- confirm `formation` is disabled; with a fixed pair it is meaningless, and it is the other vanilla
  command that drives the status window as a selector

Verified safe: `Game_Party.menuActor()` falls back to `members()[0]` when `_menuActorId` is not a
current member, so scenes entered without a selection step always resolve to a valid actor rather
than `undefined`. And `Scene_MenuBase` already provides `actor()`, `updateActor()`, `nextActor()`,
`previousActor()`, and `onActorChange()` — `Scene_ActorFacetBase` wires to those rather than
reimplementing them.

#### Phase 3 — `Scene_JabsLoadout`

| File | Change | Why |
|---|---|---|
| `abs/ext/loadout/**` | **new plugin family** — `entry.js`, `_metadata/*`, `scenes/Scene_JabsLoadout.js`, `windows/Window_LoadoutBoard.js`, `windows/Window_LoadoutPicker.js` | keeps it isolated; JABS-dependent so it lives under `abs/ext` |
| `Scene_JabsLoadout` | `extends Scene_ActorFacetBase`, `static callScene()`, board in the middle, picker as a modal over it | matches `Scene_SkillEquip` conventions |
| `Window_LoadoutBoard` | `extends Window_Command`, `maxCols() = 2`, 8 rows/actor, renders slot · content · derived input via `JABS_Button.combatSkillCompositions()` + live mapping | the two-up board |
| its `Window_MenuCommand` patch | adds a `loadout` command tagged `MenuSection.Actor` | hub entry |

#### Phase 4 — pare the quick menu

| File | Change | Why |
|---|---|---|
| `abs/core/windows/Window_AbsMenu.js` | **edit.** `buildCommands()` returns `[mainMenuCommand, ...]` only; delete the five `*-assign` builders and their help-text methods | target is Main Menu + Ally AI |
| `abs/core/scenes/Scene_Map.js` | **edit, large.** Remove the 10 window trackers, their getters/setters, builders, rects, and handlers (≈51 references across 2083 lines) | dead once the board ships |
| `abs/core/windows/Window_AbsMenuSelect.js` | **delete entirely** (670 lines) | see below |
| `abs/ext/allyai/windows/Window_AllyAiSelect.js` | **new.** Standalone `extends Window_Command` carrying the `ai-party-list` / `select-ai` modes, the `_chosenActorId` member, and `itemHeight()` — currently spread across 229 lines of aliases | the class was only ever shared infrastructure; once it is the *sole* consumer, inheriting from a gutted shell is worse than owning its own |
| `abs/ext/allyai/windows/Window_AbsMenuSelect.js` | **delete** (229 lines of aliases) | replaced by the standalone window |
| `abs/ext/allyai/scenes/Scene_Map.js` | **edit.** Point its 4 references at `Window_AllyAiSelect` | follows the rename |
| `sdp/core/windows/Window_AbsMenu.js` | **delete** | SDP fails the mid-dungeon test |
| `omni/core/windows/Window_AbsMenu.js` | **delete** | omnipedia fails it too |

#### Phase 5 — retrofit the seven

⚠️ **The seven are not seven of the same thing** *(found 2026-07-29, before starting)*. They split by
**who owns the class**, and the two halves need different mechanics:

| Group | Scenes | What "reparent" means |
|---|---|---|
| **A — plugin classes** | `Scene_Passive`, `Scene_Aptitude`, `Scene_SkillEquip`, `Scene_SDP` | a real `class X extends Scene_MenuBase`. Reparenting is **one word** |
| **B — engine classes** | `Scene_Skill`, `Scene_Equip`, `Scene_Status` | vanilla RMMZ scenes, patched via prototype from `cms/ext` (plus `natural/core` and `_base` for Equip). **There is no `extends` clause to change** |

Group B cannot be reparented as written below. `Scene_Status` is `function Scene_Status()` with a
hand-built prototype chain, so the options are rewriting the chain via `Object.setPrototypeOf`, mixing
the facet methods onto the prototype, or replacing the class outright — three very different bets, and
`Scene_Status` is 3,542 lines to be wrong about.

**Decision: do Group A first, and defer the Group B mechanism.** Not procrastination — after four
retrofits we will know exactly what the base provides and what subclasses actually override, which is
precisely the information needed to choose. Deciding now is guessing. Group A alone kills most of the
measured drift, and each scene is independently shippable.

⚠️ **`Scene_ActorFacetBase` has zero consumers.** It was written in Phase 1 and never used —
`Scene_JabsLoadout` and `Scene_JabsAllyAi` both extend `Scene_MenuFacetBase`, skipping it. So the first
Group A retrofit is also the first proof the actor base is correct, and it should be expected to need a
change or two on first contact. That is the reason to start small rather than a reason to delay.

**Group A order, one scene per commit, ascending size:** `Scene_Passive` → `Scene_Aptitude` →
`Scene_SkillEquip` → `Scene_SDP`.

**Group A status — ✅ COMPLETE (2026-07-29):**

| Scene | State | What it gave up |
|---|---|---|
| `Scene_Passive` | ✅ | a hardcoded 480px list column, a 72px ribbon height, and a constructor that initialized twice |
| `Scene_Aptitude` | ✅ | a centered 90% container, a dead `containerHeightPercent()`, and a details rect that started at `mainAreaTop()` while its sibling list started below the ribbon — it ran off the bottom of the screen |
| `Scene_SkillEquip` | ✅ | the fixed 420px slot column, and a one-line ribbon that was cropping the face it drew |
| `Scene_SDP` | ✅ | ten rects chained through each other, `Graphics.height` where `boxHeight` was meant, a flat `720` centre column, and `Window_SdpControlsHint` |

**The base needed exactly one change across all three:** `hasHelpWindow()`, defaulting true. Aptitude and
SkillEquip both carry a detail panel already and their command windows have no help text, so reserving the
strip left a blank band; declining it hands them the taller region instead. `Scene_ActorFacetBase` itself
needed nothing — which for a class that had never been extended was a better result than expected.

Three things recurred and are worth expecting in the remaining four:

- **`onCycleActorLeft`/`onCycleActorRight` are usually already there and identical to the base's.** Delete them.
- **`rebindAllWindowsToActor`-style methods set the ribbon's actor**, which the base now does in
  `onActorChange`. Remove that line or it is assigned twice.
- **The ribbon subclass stays.** Per JE: the base drawing only a face is deliberate, and adding name,
  points, or capacity is exactly what inheriting is for. Supply it through `buildActorRibbonWindow()` so
  the base still owns placement. Only delete a subclass that genuinely adds nothing.

#### `Scene_SDP` — notes worth keeping

The largest of the four and the one the base was extracted from, so it is fitting that it was the last to
actually sit on it. Two findings here corrected earlier assumptions in this document:

- ⚠️ **`Window_SdpHeader` is not the actor header.** Despite the name, it draws the *hovered panel's* name
  and flavour text. The drift-table entry naming it as SDP's bespoke ribbon was **wrong**, and following
  that instruction would have deleted a panel-detail window. It survives, and now spans only the centre
  column rather than running to the right edge across the mastery and cart windows — it describes the
  panel whose parameters sit beneath it, so that is the width it should have.
- ✅ **`Window_SdpPoints` was the ribbon all along**, and now inherits `Window_ActorRibbon`. It had
  reimplemented the parent wholesale: its own `_actor`, `actor()`, `setActor()`, and face drawing. The
  scene supplies it through `buildActorRibbonWindow()`, and the face dimensions are expressed as overrides
  of the parent's own accessors so the name column starts *from* the face instead of from a `140` that had
  to agree with a `128`.

Also of note:

- **`Window_SdpHelp` kept `hasHelpWindow()` true** — SDP is the one Group A scene whose commands carry
  help text. The window moved from the bottom of the screen to the base's top strip; it had been sitting
  directly above the controls hint, spanning the left and centre columns only, an arrangement that existed
  because both were competing for the bottom edge.
- **`cart-dec` and `cart-inc` are absent from the legend.** Both are wired (they adjust cart quantity) but
  neither semantic has an entry in `InputLegendResolver`, so listing them would render the raw strings
  `cart-dec` / `cart-inc`. Registering glyphs for them is a small outstanding item, and worth doing —
  adjusting quantity is exactly the kind of non-obvious control a legend is for.

**Group B order once its mechanism is settled:** `Scene_Skill` → `Scene_Equip` → **`Scene_Status` last**.

`Scene_Status` is the largest actor scene in the game — **3,542 lines across six windows**, one of
them (`Window_StatusStatBreakdown.js`) 2,251 lines on its own, and it is paginated. It goes last, not
because it is risky to get wrong, but because six rects is the most thorough exercise of the base and
it should run against a base already proven six times.

Each: reparent to `Scene_ActorFacetBase`, delete its bespoke rect methods, delete its ribbon subclass
where it merely re-derived the base, and supply a legend.

Scene-specific notes:

| Scene | Extra work |
|---|---|
| `Scene_Status` | **Gut the full-size actor profile.** `cms/ext/status/windows/Window_Status.js` overrides vanilla `drawBlock1`/`drawBlock2` and calls `drawActorFace(actor, 12, y)`. Delete those overrides; the ribbon replaces them |
| `Scene_Skill` | Same profile removal — the full portrait belongs only to the hub |
| `Scene_SDP` | Delete `Window_SdpControlsHint` in favour of the base legend, and retire the bespoke `Window_SdpHeader` in favour of the shared ribbon |

### 5b. Progress

As of **2026-07-29**, phases 1–4 are done, committed, and pushed to
`feat/testplay-rebalancing-fixing` (plugins) and `feat/testplay-rabalancing-fixing` (CA).

| Phase | State |
|---|---|
| 1 — J-Base foundation | ✅ done, and since **extended** — see below |
| 2 — the hub | ✅ done. Three columns, floating shrink-wrapped command columns, help + currency in the centre stack, full-width legend, D-pad **and** L2/R2 column switching, split help-text ownership |
| 3 — `Scene_JabsLoadout` | ✅ done, then **redesigned** — see below |
| 4 — retire the quick menu | ✅ done. Deleted outright rather than pared; ally AI promoted to `Scene_JabsAllyAi` |
| 5 — retrofit the seven | ⬜ not started. Now split into Group A / Group B |

`Window_LoadoutBoard` is deleted. The scene is **two
synced slot columns** sharing a `Window_LoadoutSpine` of labels down the middle, with a candidate picker
under each column filling the space the board left empty. The inactive column stays *selected but
deactivated*, so it keeps showing which slot it points at while the other holds the cursor — no modal,
no second window over the first. `Window_LoadoutSlots` resolves contents by asking
`JABS_SkillSlot#isItem()` rather than looking every id up in `$dataSkills`, which had been rendering an
Ether as whichever skill shared its id.

**Phase 1 grew four things Phase 5 needs to know about:**

- **`Window_Command.initMembers`** — a no-op hook in J-Base, called from an aliased `initialize` *before*
  the original logic. Command windows **must** seed state here: not as class fields, not in the
  constructor, both of which land after the command list has already been built. Enforced by
  `verify:no-late-window-command-state`. Implementations may **only assign fields** — the hook runs
  before `Window_Base.initialize`, so there is no `contents`, geometry, or font yet. See also: nothing on
  the `makeCommandList` path may touch a private member, since private brands are installed after
  `super()` returns.
- **`InputDevice` + `InputDeviceTracker`** — legends now draw glyphs for whichever device the player is
  actually holding, detected by aliasing the engine's only two device-specific writers into
  `Input._currentState`. `InputDeviceTracker.currentDevice()` is the single seam if this ever becomes a
  player-facing setting. Deliberately **not** an options entry — see Decisions.
- **`Window_ControlLegend` multi-semantic entries** — an entry may carry an array of semantics, joined
  with `/`, so a pair the player thinks of as one control (`focus-prev`/`focus-next`) reads as one line.
- **`focus-prev` / `focus-next`** — D-pad left/right became its own semantic region on
  `Window_Selectable`, so multi-column scenes stop borrowing L2/R2 (which already means "previous/next
  content"). `Window_Command.updateHelp` was centralized in the same pass; previously only one CMS window
  implemented it, and every other scene's help window silently cleared itself.

**Both former outstanding items are resolved:** J-ABS-Input registers an `InputLegendResolver` (all four
D-pad directions included, icons 2458–2461 / 2442–2445), and J-CMS sits at plugin load position 4.

**Verifications are now nine, not seven** — `verify:no-late-window-command-state` and
`verify:no-self-calling-accessors` joined during this work. Both were provoked by the same overnight
mechanical-rewrite sweep, and the second exists specifically to catch the failure mode the
`verify:no-direct-property-getset` rule creates when obeyed literally *inside* an accessor.

### 6. Sequencing

Each phase is independently shippable.

| Phase | Work | Risk |
|---|---|---|
| 1 | J-Base foundation: `Window_ControlLegend`, both base scenes, `setMenuSection` | low — additive only |
| 2 | Rebuild the hub as three columns | low — one scene |
| 3 | Build `Scene_JabsLoadout` on the base | medium — new behaviour |
| 4 | Pare the quick menu, delete `Window_AbsMenuSelect` | medium — deletions |
| 5 | Retrofit the other 7 actor scenes onto the base | **highest** — do last, one at a time |

Phase 5 is where the measured drift actually dies. Phases 1–4 do not require it, which is why it goes
last rather than first.

---

## The quick menu — *retired 2026-07-29*

Kept as a record, because the reasoning is worth more than the outcome.

It carried **nine** commands at the start of this work: `main-menu`, `offhand-assign`, `skill-assign`,
`dodge-assign`, `item-assign`, `usable-item-assign`, `sdp-menu`, `ally-ai`, and omnipedia. Five of those
nine were the same operation (bind a thing to a slot), implemented as ten modes of a single
`Window_AbsMenuSelect` — every one of them leader-only, which is what forced the player to flip party
leaders to edit an ally's skills.

The editorial rule applied was: **"I need this without breaking flow, between fights, mid-dungeon."**
Bindings passed. Ally AI passed. SDP and Omnipedia failed — deliberative, and already reachable from the
hub.

That rule was correct and it emptied the menu. Almost everything that felt like it needed to be
*immediate* turned out, on inspection, to be something you stop walking to do — and a thing you stop
walking for may as well be a scene, where it can be legible instead of cramped. What survived the rule
was one door to another menu.

**It had been in the game since JABS 1.0.0**, and it is the reason most of these scenes exist at all: it
was how each feature got reached while it was being built, and it proved each one was worth having before
any of them earned a home of its own. It did not get deleted for being bad. It got deleted because it
worked, and everything it held outgrew it.

Its final content, for the record: **Full Menu · Manage Ally AI.**

🫡
