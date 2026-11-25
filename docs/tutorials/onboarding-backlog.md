# Onboarding & tutorial backlog

> Action list derived from [`design-contract.md`](../design-contract.md).
> Goal: **story racers** still touch build+gear pillars once; grinders can ignore repeated prompts.

---

## Principles

1. **Do once, in fiction** — Jerald/Rupert bickering beats a neutral tutorial voice.
2. **Success gate** — player must **complete** an action (craft, equip, refine), not open a menu.
3. **Questopedia is source of truth** — every beat gets `active` / `completed` log lines.
4. **Don’t tutorialize mastery** — parry, anomalies, flux drives stay Tier C.

---

## P0 — Fixes “grindy friend skipped the game”

| ID | Beat | Gate | Unlock / script refs |
|----|------|------|----------------------|
| T-01 | **Smith is not optional** | `main-003` mansion entry blocked until `side-001` complete OR inline main step: “get Viktor sober” | `Smithing init` (CE 32), Creation smith categories (CE 21) |
| T-02 | **Craft your first weapon** | Cannot enter mine hole until party has **any JAFTING-crafted weapon** equipped | Verify recipe keys in CE 32; give materials in mansion wing if needed |
| T-03 | **Invest SDP points (soft)** | After **`???`** on **Map 14** (`mysterious figure`, Adventurer’s Fork): nudge to open **Empower** and spend **core points** into `ENC_1` / `FGT_1` (panel level ≥ 1). Panels are **unlocked** here; investment is optional (see Map 14 event—matches encourage-only design). Not a mine blocker unless we promote to Tier B | Switch **104**; `J-SDP` Unlock `ENC_1`, `FGT_1` |
| T-04 | **Armor path on main rail** | Move `Survival init` (CE 33) to **main** beat—e.g. Millie during `main-004` forest step, not optional wander | `survive-*` categories (CE 27) |
| T-05 | **Craft one armor piece** | Soft block kingdom route (`main-004`+) until one of off/body/feet crafted | Materials from Millie or shop |

**Where P0 stands, 2026-11-22.**

- **T-01 is met.** `main-003` makes the forge lesson a required step (its objective 4 is `side-001` itself).
- **T-02 is built.** `side-001` ends on "Craft any weapon off the bottom shelf and show Viskra". Her ingot turn-in
  (`Map032` ev1 page 6) asks for it, and her page 8 runs CE106 `refresh crafted wpns`, which totals every weapon
  recipe ever crafted into variable 9, then completes the quest once that reads 1 or more. `main-003` waits on
  `side-001` whole, and the facility door (`Map020` ev3) waits on `main-003`'s forge step, so nothing past the lesson
  opens until a weapon has been made. Plenty of starter recipes need only the tools she has handed over by then (a
  Claymore is two Iron Ingots).
- **T-04 and T-05 are built.** `side-002` ends on "Craft any armor piece at Millie's station and show her". Her
  lesson (`Map076` ev5 page 2) asks for it and opens `side-002` itself when the rumor-loving lady never did, and her
  page 4 runs CE113 `refresh crafted armor` (CE106's sibling, over every `survive-*` category) into variable 9. Once
  she has seen a piece she thanks the duo for the mayor if he has fallen (sw24) and tells them about Leo if the inn
  kid has sent them looking (`main-004` objective 1). The basin entrance on Triway Way (`Map085` ev6) waits on
  `side-002`, so armor is learned and made on the main road before the basin, whichever order the forest is met in.

---

## P1 — Clarity without force

| ID | Beat | Notes |
|----|------|-------|
| T-10 | Hub facility quest **covered** | Jeremy, 2026-11-22: "I think we're covered." `main-001` takes you to the inn, and `main-003`'s tutorial lap walks the smith, the pub, Viskra's forge and both Lords |
| T-11 | ~~Refinement intro~~ **dropped** | Refinement stays optional and off the main scenario (Jeremy, 2026-11-22): "The game is not a crafting game, its a cooking game. Refinement is optional, and IF you unlock it, then it encourages you to use it (but no requirement)." Viktor teaches it after 24 unique blueprints, and his lesson announces it |
| T-12 | Weapon family blurb **covered** | The academy already does it (Jeremy, 2026-11-22: "the beginner's tutorial (that is required) should explain this"): its weapon floor (`Map080`) has six teachers, one per family, and a graded test after |
| T-13 | ~~Danger / level read~~ **dropped** | Jeremy, 2026-11-22: "live and learn (or die and learn)" |
| T-14 | Save tutorial in intro cave | Per walk doc TODO |

**T-14 is built (2026-11-22).** The save talk moved from Riverside Stroll (`Map016` ev42, deleted) to Cave 7
(`Map010` ev11): a parallel watcher plays it once "as soon as you draw near", the moment the player steps into the
chamber around the save platform before the first boss (the rope drops them at the bottom of the map, and the only
way north runs through it). Jerald now names the cave's Ghosties and Ignihazards, and Rupert points at "one" save
point rather than "another".

---

## P2 — Mastery & optional systems

| ID | Beat | Notes |
|----|------|-------|
| T-20 | ~~Training rift ping~~ **dropped** | Jeremy, 2026-11-22: "you gameover when you die" |
| T-21 | Parry payoff showcase **built** | 2026-11-22, moved 2026-11-23 onto its own floor: the Parry Floor (`Map555`), a strip room between the Skills Test and the Third Floor, reached by the stairs that used to join those two. A "Parry Practice" book (ev2 label, ev3 reading) on a shelf like the Third Floor's, a harmless mannequin (ev4, Enemies 603 `@Parry Dummy`: the Aggro Dummy with ATK 1, hidden from the Monsterpedia), and a watcher (ev5) that stores JABS's precise-parry count (variable 75) in variable 31 on arrival and pays two Node Dust, once, the first time it climbs |
| T-22 | ~~Omnipedia nudge~~ **built as lines** | No nudge; instead "a few extra lines describing it when its unlocked via tutorial" (Jeremy, 2026-11-22). The Trainer Lord's handoff on the academy's Bottom Floor (`Map092` ev4, which turns on sw103 and so the Monsterpedia) now says what it records: defeat teaches name, family and stats, drops appear as they fall, and each element shows how it lands once it has hit |
| T-23 | ~~Flux facility~~ **dropped** | Wrong premise (Jeremy, 2026-11-22): the difficulty engine "isn't an answer to 'the game is too hard', its an answer to 'i want more and better loot' and 'i want a challenge'" |

---

## Done when

- [ ] A new player (story-only) has crafted **food, weapon, armor** by end of Ch1–2 without wiki.
- [ ] Quest log shows **why** each craft mattered (one joke line each).
- [ ] Grinder can skip repeat prompts via switch (e.g. “tutorial complete”).

---

## See also

- [`design-contract.md`](../design-contract.md) — tiers A/B/C  
- [`walk/chapter1.md`](../walk/chapter1.md) — intended beats  
