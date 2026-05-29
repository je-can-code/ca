# Chef Adventure — design contract

> Living doc for **what CA is trying to be** and **how we judge features, balance, and tutorials**.
> Spoilers for story structure. Pair with [`config.quest.json`](../chef-adventure/data/config.quest.json) for beat-by-beat truth.

---

## One-sentence pitch

**Chef Adventure is a comedy road-trip ARPG where you hunt monsters and materials to craft your build—weapon family and optional mastery layers (nodes, parry, skills)—while a food gag turns into a sins-and-elementals mystery across ruined Erocia.**

---

## Player fantasy (the box copy)

**Become the build you loot.**

- Kill things → earn **nodes** (SDP panels), materials, and recipes.
- Express combat through **weapon family** (six families × three types) plus actor skills.
- Go deeper only if you want: **parry/counter** builds, proficiency, aptitude, refinement, grind.

**Primary audience:** players who enjoy panel/grid growth (e.g. Shining Force EXA–style nodes) and weapon-main ARPG identity, with hub downtime and banter-heavy story.

**Not trying to be:** a pure action souls-like, a chef simulator, or a narrative-first RPG with light combat.

---

## Design pillars

| Pillar | Meaning |
|--------|---------|
| **Readable combat** | Mechanics are learnable; mastery (parry, timing, pixel positioning) is **optional spike**, not baseline difficulty. |
| **Weapon-led identity** | Family + type should answer “how does this character fight?” before SDP answers “how strong are they?” |
| **Trophy loop** | New systems should grant a **visible trophy**: node, recipe, weapon, tool, party slot, codex entry—not only invisible math. |
| **Comedy travelogue** | Story is episodic (hub → dungeon → hub); tone is irreverent; macro plot is sins / elementals / off-world hints—not “save the kingdom” sim. |
| **Respect level gaps** | ~**+10 levels** = scary; Level Master scaling should enforce “come back later” (e.g. mine orcs), not soft gates only. |

---

## Hybrid you chose (build + gear)

- **Build depth (#1):** SDP, proficiency, aptitude, passives, refinement—long-term optimization.
- **Gear identity (#3):** six weapon families, JAFTING creation tiers, named weapons in dungeons ([`weapons/main.md`](./weapons/main.md)).
- **Action (#2, bounded):** ABS on-map combat is **straightforward by default**; parry/guard/charge/pixel are **opt-in depth**.

If SDP or level scaling makes weapon params feel cosmetic, treat that as a **contract violation** (see [`weapon-tier-hardness` backlog](https://github.com/je-can-code/rmmz-plugins/blob/main/.backlog/unstarted/weapon-tier-hardness-damage-balance.md) in `rmmz-plugins`).

---

## Story spine (quest-driven, Ch1–4 intro)

| Arc | Main quests | Beat |
|-----|-------------|------|
| **Food hook** | `main-000`–`main-002` | Pudding hunt → Raevula → kitchen → bearcat genocide → craft pudding |
| **Sin reveal** | `main-003` | Mayor → mines → forest → **sin of gluttony** |
| **Kingdom trail** | `main-004`–`main-005` | Route east; alchemist/tool; cliffs; **water entity**; **Treis** at inn |
| **Ruins & elementals** | `main-006`–`main-008` | Isthmus → grotto → **fallen kingdom** + second sin → **Negative Peaks** elemental |

Intro loop complete through **`main-008`** (fourth elemental recruited). Chapters 4–7 in walk docs are post-intro structure.

---

## Balance contract

### Enemy side

- **Decade normalization** defines tier ladders and HP anchors ([`enemy-decade-normalization-tables.md`](../chef-adventure/docs/enemy-decade-normalization-tables.md)).
- **Story placement** should match **virtual tier**, not just enemy id band.

### Player side

- **Level targets** in walk/quest docs = **non-grindy story path** (author playthrough), not hard ceiling.
- **Grinders** will exceed targets; design for **floor (story) + ceiling (optional farms)** rather than one number.
- **+10 level rule:** content more than ~10 levels above party should feel **punishing** (0.1× dealt / 2× taken style), not merely “slow TTK.”

### Playtest probes (when tuning)

1. **Story floor:** fixed level, minimal nodes, one weapon family—TTT readable?
2. **Grinder ceiling:** same encounter after optional farm—still interesting or only faster?
3. **Per family:** swap weapon type within same family—does combat **feel** different?

---

## Onboarding contract (systems vs story)

**Problem observed:** story-mandated tutorials teach **combat + cooking**; **smithing weapons** and **armor JAFTING** unlock from **side content** (`side-001` Viktor, Millie / forest). Story racers (including grind-skippers) never engage—**not a player failure, a contract gap.**

### Three engagement tiers

| Tier | Rule | Examples |
|------|------|----------|
| **A — Story-required** | Main quest cannot advance until player **uses** the system once (not only unlocks menu). | Attack, skills, guard intro cave; craft **one** pudding; party cycle when forced |
| **B — Story-teased** | Main or strong side quest: NPC sends you, **fetch/craft/slay gate** before reward. | First **weapon** craft before mines PONR; craft **one armor piece** before forest PONR; refine demo before kingdom route |
| **C — Discoverable** | Omnipedia, anomalies, flux drives, optional farms, parry build—no main gate | Alchemy journal pages, sword in stone, orc node farm |

**Default for pillars:** anything in **build + gear** fantasy should be **A or B through end of Ch3**, not only C.

### JAFTING unlock map (current — verify in events)

| Content | Unlock source (per CommonEvents comments) | Tier today |
|---------|-------------------------------------------|------------|
| Cooking recipes | Inn / `main-002` | **A** |
| Smith weapon recipes | `side-001` (Viktor at pub) | **C** → should be **B** |
| Armor/survival recipes | Millie / forest | **C** → should be **B** |
| Refinement | Smith (switch menu) | **C** |
| Alchemy gems | Rescue Leo | **B/C** |

### Tutorial backlog (priority order)

Author these as **short, forced beats** (one screen + one success), not wiki pages.

1. **Ch1 — Raevula facility lap (B):** after pudding, before mayor—quest step “talk to smith” or block mansion until Viktor quest **started** (not only doc suggestion).
2. **Ch1 — Weapon craft gate (B):** before mine PONR, require **craft any tier-1 weapon in your family** (materials from mansion free bundle or shop).
3. **Ch2 — Armor craft gate (B):** tie `Survival init` to **main** beat (Millie or Treis), not only forest wander; craft **one** off/body/feet before basin depth.
4. **Ch1 — Node tutorial (encourage, don’t hard-gate):** `???` on **Map 14** (`mysterious figure`, display name Adventurer’s Fork) unlocks starter panels `ENC_1` / `FGT_1`; player **spends core points** in **Empower** to level panels—nodes are not equipped gear. Story may nudge investment but does not gate progress on it; optional quest can track **panel level ≥ 1** only if we deliberately want Tier B.
5. **Refinement (B):** one **refine +1** lesson before Fallen Kingdom or first gear wall.
6. **Optional mastery (C):** parry room in intro already jokes about laziness—keep; add **Lord of Training** pointers after first death to high-level enemy.

Track implementation in [`todo.md`](./todo.md) or Questopedia objectives—not only markdown.

---

## Feature guardrails (checklist for new work)

Before shipping a system or plugin to CA:

- [ ] What **trophy** does the player get (UI, inventory, codex, node)?
- [ ] Does it support **weapon family identity** or dilute it?
- [ ] Is tutorial **A, B, or C**—and is that intentional?
- [ ] Does story-racer skipping it break **Ch3 floor** balance?
- [ ] Is there a **quest log** line (active + completed) in player voice?

---

## Related docs

- [`main.md`](./main.md) — doc index  
- [`walk/main.md`](./walk/main.md) — chapter flow and level notes  
- [`quests/main.md`](./quests/main.md) — NPC index  
- [`nodes/main.md`](./nodes/main.md) — SDP / node families  

---

## Revision log

| Date | Note |
|------|------|
| 2026-05-24 | Initial contract from design/balance discussion; onboarding tiers after playtester skipped smith/armor JAFTING. |
