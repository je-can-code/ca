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

Two consequences run through this whole document:

1. A fixed pair can be shown **side by side**. "Is Rupert covering the gap in Jerald's kit?" is the
   question a two-person party actually asks, and it is unanswerable one-actor-at-a-time.
2. Showing both **frees the actor-cycling input axis** — see [Input vocabulary](#input-vocabulary).

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

### The axis that showing both actors frees

If a fixed pair is rendered side by side, nothing needs `actor-prev`/`actor-next` anymore — and
**L1/R1 becomes available for cross-scene navigation**, which is the only free shoulder pair. This is
the single strongest argument for the two-up layout: it is not merely nicer to read, it unblocks an
input axis that every complex scene is currently starving for.

---

## Known drift

Measured, not theorised. All of it is independent implementations of one idea diverging over time.

| Concern | State |
|---|---|
| Container width | Aptitude centres a **66 %** container; SkillEquip is full-width with a magic **420 px** column; JabsRemap is a third thing |
| Internal consistency | Aptitude mixes `mainAreaTop()` and `Graphics.boxHeight` between its own rects |
| Actor ribbon | 4 scenes share `Window_ActorRibbon`; SDP has a bespoke `Window_SdpHeader` |
| Emphasis | SkillEquip gives the *available skills* picker the whole left side and squeezes the **slots** — the actual subject — into 420 px. Inverted |
| Button help | Only SDP has one (`Window_SdpControlsHint`). Every other scene expects the player to guess |

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
- **Cross-scene navigation is registration-based.** Scenes register into a ring held by J-Base; the
  ring contains only what is installed. No plugin ever names another plugin's scene class. 3 → ring,
  2 → toggle, 1 → the bar does not render.
- **The base owns a *bounded* middle.** Contents free, rect fixed. Unbounded is how 66 % / 420 px /
  `mainAreaTop()` happened.

### Open

- Two-up layout as the base default, or single-focus with a toggle?
- Which input carries cross-scene navigation (see the freed L1/R1 axis above)
- Whether `Scene_Status` / `Scene_Skill` join the skeleton or stay light
- Name for the base class

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
| centre width | `Graphics.boxWidth − (sideWidth * 2)` — absorbs any rounding remainder |
| per-actor cell | `centreWidth / $gameParty.size()` |

`COMMAND_COLUMN_RATIO` is a single named constant on the base (starting value ≈ `0.22`), overridable
per scene. At 1920 that yields ≈ 422 / 1076 / 422; at any other resolution it still fills the width,
because the centre is defined as *the remainder* rather than a number.

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

### 4. Accommodating the quick menu

`Window_AbsMenu.buildCommands()` today: `main-menu`, `offhand-assign`, `skill-assign`,
`dodge-assign`, `item-assign`, `usable-item-assign`, plus `sdp-menu` (sdp), `ally-ai` (allyai),
and omnipedia (omni) via `buildCommands` aliases.

**Target — two commands.**

| Command | Fate |
|---|---|
| `main-menu` | keep — it is the door |
| `ally-ai` | keep — tactical, passes the mid-dungeon test, and is party-scoped so it has no hub home |
| the five `*-assign` commands | **deleted** — absorbed by the loadout scene |
| `sdp-menu`, omnipedia | **deleted** — deliberative, already have hub doors |

**Loadout is deliberately *not* on the quick menu.** It is an actor-column scene like every other
actor scene, so it is one press deeper via the hub — and that is correct, because backing out of it
returns the player to the actor column rather than dumping them straight onto the map. The hub is the
place where "what else can I change about my guys?" is answered; a shortcut would fragment that.

⚠️ **`Window_AbsMenuSelect` cannot simply be deleted.** Ally AI — the one assign-style command being
kept — is built on it:

| Consumer | References |
|---|---|
| `abs/core/scenes/Scene_Map.js` | 51 |
| `abs/ext/allyai/windows/Window_AbsMenuSelect.js` | 18 (`party-member`, `select-ai`, `ally-formations`, `aggro-passive-toggle`, `do-nothing-toggle`) |
| `abs/ext/allyai/scenes/Scene_Map.js` | 4 |

So Phase 4 **pares** rather than deletes: remove the ten loadout-related selection modes and their
`Scene_Map` handlers, keep the class and the Ally AI modes riding on it. The hardcoded
`$gameParty.leader()` is retired from the deleted modes only — Ally AI is party-scoped anyway, so it
was never wrong there.

### Loadout input map — **must be written before Phase 3**

Two-up columns raise a question the vocabulary does not yet answer: **what moves focus between
Jerald's column and Rupert's column?** D-pad Left/Right is the natural answer, but that is exactly the
dead input SDP already hijacked for `cart-inc/dec` on single-column lists, so the rule has to be
stated rather than assumed.

Every input must be spelled out — ✕ ○ △ □ L1 R1 L2 R2 D-pad — and agreed **before** the scene is
written. Inventing bindings during implementation is precisely how the drift catalogued above
happened.

### 4b. Loadout input map — **resolved**

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

### 5. File-by-file mapping

#### Phase 1 — J-Base foundation *(additive; nothing breaks)*

| File | Change | Why |
|---|---|---|
| `_base/windows/Window_ControlLegend.js` | **new.** `extends Window_Base`. Takes `{semantic, label}[]`, renders a single reduced-size line. Ports the `padX`/`modFontSize(-4)`/vertical-centre treatment from `Window_SdpControlsHint` | every scene needs button help; only SDP has it today |
| `_base/managers/InputLegendResolver.js` | **new.** Registry mapping a semantic (`context`, `content-next`, …) to a display glyph. Empty by default; returns the plain label when unresolved | lets J-ABS-Input supply controller glyphs **without J-Base depending on it** |
| `_base/scenes/Scene_MenuFacetBase.js` | **new.** `extends Scene_MenuBase`. Owns `helpWindowRect()`, `legendWindowRect()`, `facetAreaRect()` (the bounded middle), `COMMAND_COLUMN_RATIO`, and legend wiring. Subclasses fill the middle only | the outer layer, shared by all 18 scenes |
| `_base/scenes/Scene_ActorFacetBase.js` | **new.** `extends Scene_MenuFacetBase`. Adds ribbon rect(s), `isTwoUp()` (default `true`), per-actor cell math, and actor resolution via `$gameParty.menuActor()` | the inner layer, the 8 actor scenes |
| `_base/models/WindowCommandBuilder.js` | **edit.** Add `setMenuSection(section)` | routes a command to the actor or party column |
| `_base/models/BuiltWindowCommand.js` | **edit.** Add `menuSection` field, defaulting to `party` | untagged commands must keep working |
| `_base/models/MenuSection.js` | **new.** `static Actor = 'actor'; static Party = 'party';` | avoid magic strings |
| `_base/entry.js` | **edit.** Import the four new files | build registration |
| `abs/ext/input/managers/IconManager.js` | **edit.** Register into `InputLegendResolver` at boot, mapping semantics through their vanilla symbol strings (`context`→`'tab'`→`JabsInputSymbols.Tool`→ icon) | live glyphs that follow remapping |

#### Phase 2 — the hub

| File | Change | Why |
|---|---|---|
| `cms/core/scenes/Scene_Menu.js` | **rewrite.** Three columns via `Scene_MenuFacetBase` math. Creates `Window_MenuActorCommand`, `Window_MenuPartyCommand`, and the centre party panel. Deletes `commandWindowRect`/`statusWindowRect` overrides | the current file only nudges vanilla rects; the new layout is structural |
| `cms/core/windows/Window_MenuActorCommand.js` | **new.** Filters the built command list to `menuSection === Actor` | left column |
| `cms/core/windows/Window_MenuPartyCommand.js` | **new.** Filters to `Party` **and untagged** | right column; untagged default is what keeps unknown plugins working |
| `cms/core/windows/Window_MenuStatus.js` | **rewrite.** `numVisibleRows()` 6→`$gameParty.size()`; one column per actor across the centre instead of stacked rows | six stacked rows in a 1080-wide centre is the space waste this fixes |
| `cms/core/windows/Window_MenuCommand.js` | **edit.** Tag `skill`/`equip`/`status` as `Actor`; `item`/`options`/`gameEnd` stay `Party` | vanilla commands must land in the right columns |

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
| `abs/core/windows/Window_AbsMenuSelect.js` | **edit.** Delete the 10 loadout selection types and their `make*List` methods. **Keep the class** | allyai aliases it for `ai-party-list` / `select-ai` |
| `sdp/core/windows/Window_AbsMenu.js` | **delete** | SDP fails the mid-dungeon test |
| `omni/core/windows/Window_AbsMenu.js` | **delete** | omnipedia fails it too |
| `abs/ext/allyai/**` | **unchanged** | it rides on the retained class |

#### Phase 5 — retrofit the seven

One scene per commit, in ascending risk: `Scene_Passive` → `Scene_Status` → `Scene_Aptitude` →
`Scene_Skill` → `Scene_Equip` → `Scene_SkillEquip` → `Scene_SDP`.

Each: reparent to `Scene_ActorFacetBase`, delete its bespoke rect methods, delete its ribbon subclass
where it merely re-derived the base, declare `isTwoUp()`, and supply a legend. **`Scene_SDP` goes
last and declares `isTwoUp() === false`** — it is too dense to double, and it keeps `actor-prev/next`
for cycling. `Window_SdpControlsHint` is deleted in favour of the base legend.

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

## The quick menu

`Window_AbsMenu` currently carries **nine** commands: `main-menu`, `offhand-assign`, `skill-assign`,
`dodge-assign`, `item-assign`, `usable-item-assign`, `sdp-menu`, `ally-ai`, and omnipedia.

Five of those nine are the same operation (bind a thing to a slot), implemented as ten modes of
`Window_AbsMenuSelect` — every one of them leader-only.

**Editorial rule for the quick menu: "I need this without breaking flow, between fights, mid-dungeon."**
Bindings pass. Ally AI passes. SDP and Omnipedia fail — they are deliberative and already have main
menu doors.

Target: **Loadout · Ally AI · Main Menu.**
