# Chef Adventure — database decode cheatsheet

> **Purpose:** Decode raw RPG Maker MZ database JSON (`traits`, effect codes, ids) without guessing.
> **Live names:** always resolve ids from `chef-adventure/data/*.json` — this doc explains **codes**, not every row.
>
> **CLI:** `bun chef-adventure/tools/decode-db-trait.mjs` (see [Quick decode](#quick-decode)).
>
> Last updated: **2026-06-06**

---

## Live data paths (CA)

| What | File | Lookup rule |
|---|---|---|
| **Elements** | `chef-adventure/data/System.json` → `elements[]` | **id = array index**, name = string value |
| **Skill types** | `System.json` → `skillTypes[]` | id = index |
| **Weapon types** | `System.json` → `weaponTypes[]` | id = index |
| **Armor types** | `System.json` → `armorTypes[]` | id = index |
| **Equip slots** | `System.json` → `equipTypes[]` | id = index |
| **States** | `chef-adventure/data/States.json` | row `id` field → `name` |
| **Skills** | `chef-adventure/data/Skills.json` | row `id` field → `name` |
| **Items / weapons / armors** | respective `data/*.json` | row `id` field → `name` |

**Editor parity:** `jmz-data-editor/app/src/presentation/hooks/useTraitMapping.ts` uses the same code → meaning map.

---

## Trait object shape

Every trait in CA JSON looks like:

```json
{"code": 32, "dataId": 14, "value": 0.15}
```

| Field | Role |
|---|---|
| `code` | **What kind** of modifier (see table below) |
| `dataId` | **Which** element, param, state, skill, slot, etc. (meaning depends on `code`) |
| `value` | Magnitude — **semantics depend on `code`** (see [Value scaling](#value-scaling)) |

**Do not infer `dataId` meaning from the number alone.** Always pair `code` + `dataId`.

### Common misread (Ghosty 1110)

```json
{"code": 32, "dataId": 14, "value": 0.15}
```

| Wrong guess | Correct decode |
|---|---|
| CEV / evasion | **On-Hit State:** 15% chance to apply **Emptiness** (state 14) on attack |

CEV would be **`code: 22`, `dataId: 3`** (EX Parameter → Crit Dodge), with `value` as a **multiplier**, not a proc rate.

---

## Trait codes (full map)

| Code | Name | `dataId` means | Typical `value` |
|---:|---|---|---|
| **11** | Element Rate | Element id → `System.json` `elements[]` | Multiplier (`1.0` = 100% damage taken) |
| **12** | Debuff Rate | Base param id (0–7) | Multiplier on debuff vulnerability |
| **13** | State Rate | State id → `States.json` | Multiplier on inflict chance |
| **14** | State Immunity | State id → `States.json` | `1` = immune (value ignored) |
| **21** | Base Parameter | Base param id (0–7) | Multiplier on MHP, ATK, … |
| **22** | EX Parameter | EX param id (0–9) | Multiplier on HIT, CRI, HRG, … |
| **23** | SP Parameter | SP param id (0–9) | Multiplier on TGR, GRD, PDR, … |
| **31** | Attack Element | Element id | Adds element to normal attacks |
| **32** | **On-Hit State** | State id → `States.json` | **Proc rate** (`0.15` = **15%**) |
| **33** | Attack Speed | (unused) | Additive speed value |
| **34** | Attack Times | (unused) | Extra hit count (`+N`) |
| **35** | Attack Skill | Skill id → `Skills.json` | Replaces normal attack |
| **41** | Add Skill Type | Skill type id | Grants whole stype |
| **42** | Seal Skill Type | Skill type id | Blocks whole stype |
| **43** | Add Skill | Skill id | Adds skill to list |
| **44** | Seal Skill | Skill id | Removes skill use |
| **51** | Add Weapon Type | Weapon type id | Can equip wtype |
| **52** | Add Armor Type | Armor type id | Can equip atype |
| **53** | Lock Equip Slot | Equip type id | Blocks slot |
| **54** | Seal Equip Slot | Equip type id | Disables slot |
| **55** | Dual Wield | (unused) | Enable flag |
| **61** | Extra Turn Chance | (unused) | Rate (`0.25` = 25%) |
| **62** | Special Flag | Index 0–3 | See [Special flags](#special-flags-code-62) |
| **63** | Collapse Effect | Index 0–3 | See [Collapse effects](#collapse-effects-code-63) |
| **64** | Party Ability | Index 0–5 | See [Party abilities](#party-abilities-code-64) |

---

## Parameter `dataId` tables (codes 12, 21, 22, 23)

### Base parameters — codes **12**, **21** (`dataId` 0–7)

| dataId | CA name | Key |
|---:|---|---|
| 0 | Max Life | `mhp` |
| 1 | Max Magi | `mmp` |
| 2 | Power | `atk` |
| 3 | Endurance | `def` |
| 4 | Force | `mat` |
| 5 | Resist | `mdf` |
| 6 | Speed | `agi` |
| 7 | Luck | `luk` |

### EX parameters — code **22** (`dataId` 0–9)

| dataId | CA name | Key |
|---:|---|---|
| 0 | Accuracy | `hit` |
| 1 | Parry Extend | `eva` |
| 2 | Crit Rate | `cri` |
| 3 | Crit Dodge | `cev` |
| 4 | Magic Evade | `mev` |
| 5 | Magic Reflect | `mrf` |
| 6 | Autocounter | `cnt` |
| 7 | HP Regen | `hrg` |
| 8 | MP Regen | `mrg` |
| 9 | TP Regen | `trg` |

### SP parameters — code **23** (`dataId` 0–9)

| dataId | CA name | Key |
|---:|---|---|
| 0 | Aggro | `tgr` |
| 1 | Parry | `grd` |
| 2 | Healing Rate | `rec` |
| 3 | Item Effects | `pha` |
| 4 | Magi Cost | `mcr` |
| 5 | Tech Cost | `tcr` |
| 6 | Phys Dmg Rate | `pdr` |
| 7 | Magi Dmg Rate | `mdr` |
| 8 | Environ Dmg Rate | `fdr` |
| 9 | Experience UP | `exr` |

Extended params (CDM, CDR, MTP, …) use **notetags** or plugin params — not vanilla trait codes 21–23.

---

## Value scaling

| Codes | How to read `value` |
|---|---|
| **11, 12, 13, 21, 22, 23** | **Multiplier.** `1.15` → +15%. `0.9` → −10%. Display: `(value × 100)%`. |
| **32, 61** | **Proc / chance rate.** `0.15` → **15%** (not a multiplier). |
| **33** | Additive attack speed. |
| **34** | Integer extra hits (`+value`). |
| **14, 41–44, 51–55, 62–64** | Usually `1` = on; magnitude often ignored. |

---

## Special flags (code 62)

| dataId | Label |
|---:|---|
| 0 | Self-auto-battle |
| 1 | Perpetual Guard |
| 2 | Will cover weak allies |
| 3 | TP carried between battles |

## Collapse effects (code 63)

| dataId | Label |
|---:|---|
| 0 | Normal |
| 1 | Boss |
| 2 | Instant |
| 3 | Disappear |

## Party abilities (code 64)

| dataId | Label |
|---:|---|
| 0 | Encounter rate halved |
| 1 | No random encounters |
| 2 | Cannot be surprised |
| 3 | Increased pre-emptive rate |
| 4 | 2× Gold from enemies |
| 5 | 2× Drop rate |

---

## Elements snapshot (CA — verify live file)

From `System.json` `elements[]` (index = id):

| Id | Name |
|---:|---|
| 1 | Cut |
| 2 | Poke |
| 3 | Blunt |
| 4 | Heat |
| 5 | Liquid |
| 6 | Air |
| 7 | Ground |
| 8 | Energy |
| 9 | Void |
| 10 | Typeless |
| 11–20 | vs Undead … vs Deity |
| 21–24 | x Weaponry, x Flying, x Shields, x Aura |

Full list: `bun chef-adventure/tools/decode-db-trait.mjs elements`

---

## Skill / state effects (non-trait)

Database `effects[]` on skills/items use **different** codes than traits:

| effect `code` | Meaning |
|---:|---|
| 11 | Recover HP (value1 = % or flat per data) |
| 12 | Recover MP |
| 13 | Recover TP |
| 21 | Add state (`dataId` = state id, `value1` = chance) |
| 22 | Remove state |
| 31 | Grow base param |
| 32 | Grow ex param |
| 33 | Grow sp param |
| 41 | Learn skill |
| 42 | Common event |
| 43 | … |

For skill effect code **21**, `value1: 0.5` = 50% add-state chance (battle formula context).

---

## Traits vs JMZ notetags (SDP masteries)

Many mastery effects are **not** vanilla traits — read the **`note`** field:

| Mechanism | Where | Example |
|---|---|---|
| Passive grant | Skill note | `<passive:[1101]>` on wrapper skill |
| Conditional gate | State note | `<passiveSourceRule:[hpBelow, 25]>` |
| Skill history dmg | State note | `<skillHistoryBonus:[0, 10, 5, unique]>` |
| On-crit state | Any note source | `<onCritApply:[14, 40]>` |
| Map duration | State note | `<stateDuration:3600>` |

Full mastery tag cookbook: [`sdp/implementation-status.md`](./sdp/implementation-status.md) (Tag authoring reference).

**Rule of thumb:** if you see `"traits": [...]` in JSON → use **this doc**. If you see `"note": "<...>"` → use **SDP implementation-status** + run plugin docs.

---

## Quick decode

From repo root `ca/`:

```bash
# One trait object
bun chef-adventure/tools/decode-db-trait.mjs trait '{"code":32,"dataId":14,"value":0.15}'

# All traits on a state or skill row
bun chef-adventure/tools/decode-db-trait.mjs state 1110
bun chef-adventure/tools/decode-db-trait.mjs skill 1101

# Dump element / skill-type tables from live System.json
bun chef-adventure/tools/decode-db-trait.mjs elements
bun chef-adventure/tools/decode-db-trait.mjs skill-types
```

---

## Related

- [`sdp/mastery-cheatsheet.md`](./sdp/mastery-cheatsheet.md) — subgroup mastery authoring
- [`sdp/implementation-status.md`](./sdp/implementation-status.md) — notetag cookbook
- `jmz-data-editor/.../useTraitMapping.ts` — editor UI decoder (keep in sync with trait table above)
