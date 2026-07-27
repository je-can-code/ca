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

### 2. Hub layout — 1920 × 1080, three columns

```
┌──────────────────────────────────────────────────────────────────────┐
│  HELP / description of the highlighted command              1920×108 │
├──────────────┬────────────────────────────────────┬──────────────────┤
│  ACTORS      │        Jerald    │    Rupert       │  PARTY           │
│    Status    │   face · lv · hp/mp/tp             │    Items         │
│    Equipment │   key params · weapon · states     │    Crafting      │
│    Skills    │                                    │    Bestiary      │
│    SkillEquip│        (540)     │     (540)       │    Quests        │
│    Loadout   │                                    │    Controls      │
│    Aptitude  │                                    │    Difficulty    │
│    Passive   │                                    │    Save          │
│    Nodes     │                                    │    Options       │
│    (420)     │              (1080)                │      (420)       │
├──────────────┴────────────────────────────────────┴──────────────────┤
│  ✕ open    ○ back    □ more                                  1920×48 │
└──────────────────────────────────────────────────────────────────────┘
```

- Main area height `1080 − 108 − 48 = 924`
- Columns `420 + 1080 + 420 = 1920` — no dead margin
- The middle gives each actor **540 px**, enough for face, level, bars, key params, weapon, states
- The ribbon is **inert context**, not selectable — the actor-selection step is deleted, not relocated

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

**Target — three commands:**

| Command | Fate |
|---|---|
| `loadout` | **new** → `Scene_JabsLoadout.callScene()` |
| `ally-ai` | keep — tactical, passes the mid-dungeon test |
| `main-menu` | keep — it is the door |
| the five `*-assign` commands | **deleted** — absorbed by the loadout scene |
| `sdp-menu`, omnipedia | **deleted from the quick menu** — deliberative, already have hub doors |

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

### 5. Sequencing

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
