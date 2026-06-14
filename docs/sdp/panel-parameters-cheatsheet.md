# SDP panel parameters authoring cheatsheet

> **Purpose:** P4-1 reference — **which stats** each panel row uses (settled) and **shared rules** for
> `perRank` authoring (magnitudes tuned per family pass).
>
> **Sources:** [`archetype-mapping.md`](./archetype-mapping.md) (archetype cores + subgroup flavors),
> [`mastery-cheatsheet.md`](./mastery-cheatsheet.md) (subgroup keys, tier acts, rarity).
>
> **Not covered here:** mastery passives / notetags → mastery cheatsheet + [`implementation-status.md`](./implementation-status.md) tag cookbook.
>
> Last updated: **2026-06-06** — **%-only panel policy** locked; Ghosty reference strip; class/job prerequisite noted.

---

## What is settled vs open

| Settled | Open (this pass) |
|---|---|
| Subgroup → **archetype** | Exact **`perRank`** per panel tier (magnitude tune) |
| Archetype **UP / DOWN** stat pools | Which **subset** of pool rows on a given tier (within recipe) |
| Subgroup **flavor twist** (weighting) | Playtest retune after first family strip |
| **All panel rows `%` only** (`isFlat: false`) | — |
| **Base stat identity** from class / gear / level — not panels | Class/job tree (**required** — see [§11](#11--only-panels-base-growth-elsewhere)) |

**Formula:** `Panel identity = Archetype core × Subgroup flavor × Tier magnitude`

---

## Config row shape

Each entry in `chef-adventure/data/config.sdp.json` → `panelParameters[]`:

```json
{
  "parameterKey": "mat",
  "perRank": 1.5,
  "isFlat": false,
  "isCore": true
}
```

| Field | Rule |
|---|---|
| `parameterKey` | Registry key (`mat`, `mhp`, `lst`, `gdr`, …) — see [Parameter keys](#parameter-keys-quick-reference) |
| `perRank` | Added **per panel rank** invested (see [Math](#math-how-perrank-applies)) |
| `isFlat` | **`false` always** — see [§11](#11--only-panels-base-growth-elsewhere). Legacy flat rows are obsolete. |
| `isCore` | **`true`** = gold highlight in SDP UI — identity ups + main downs only (2–4 rows typical) |

**Do not** duplicate the same `parameterKey` on one panel unless intentionally stacking (rare; avoid).

---

## Shared rules (all panels)

### 1. Every panel has real tradeoffs

- Every non-Generalist panel includes at least **one DOWN** row from its archetype penalty pool.
- Downs use **negative `perRank`** (same `isFlat` rules as ups).
- **Litmus test:** six characters cannot all stack offense + HRG and trivialize content — see archetype-mapping tradeoff section.

### 2. Archetype core is mandatory; flavor is weighting

- Pull **UP** stats only from the archetype’s approved list.
- Pull **DOWN** stats only from the archetype’s approved list.
- **Flavor twist** = which ups get **heavier `perRank`** or **`isCore: true`** — not a different stat pool.

### 3. Three-act tier bands (align with mastery)

Same rhythm as [`mastery-cheatsheet.md`](./mastery-cheatsheet.md) — **`perRank` potency** scales by **`subgroupTier`**, not panel display name.

| Act | `subgroupTier` | Rarity (idx) | `maxRank` | `perRank` budget |
|---|---:|---|---:|---|
| **Beginning** | 1–4 | 0–2 | **10** | softest |
| **Middle** | 5–9 | 2–4 | **10** | stronger (tier ↑ even when rarity holds) |
| **End** | 10 | 5 (Godlike) | **20** | capstone — best per-rank stats + End mastery |

**Exception — `SIN_*` panels:** one panel per sin; not this curve.

See [Progression: rarity & maxRank](#progression-rarity--maxrank) below for the full table.

### 4. Row count & `isCore`

| Row type | Count | `isCore` |
|---|---|---|
| Primary identity UP (flavor stat) | 1 | yes |
| Other archetype UPs | 1–2 | mixed |
| Primary downs (survival / defense tax) | 1–2 | yes |
| Secondary downs or flavor UP | 0–2 | no |

### 5. `%` rows only (`isFlat: false`)

**Every** panel row uses **`isFlat: false`**. Panels **amplify** existing capability; they do not grant flat stat chunks.

- **Ups:** positive `perRank` on `%` growth (e.g. `mat +1.0`/rank).
- **Downs:** negative `perRank` on `%` growth (e.g. `mhp −0.6`/rank).
- **Low-base actors** (e.g. Vanguard body ranking Wizard panels) gain little absolute value until **base** moves — class/job change, gear, level, other systems. That is intentional.

**COST_RATE params** (`mcr`, `tcr`): lower rate = cheaper skills. Beneficial “cost reduction” rows use **negative** `perRank` (see [`ParameterDefinition` COST_RATE policy](../../../rmmz-plugins/src/plugins/_base/models/ParameterDefinition.js)).

### 6. Penalty stats that confuse authors

| Key | Panel DOWN means | Notes |
|---|---|---|
| `pdr`, `mdr` | **Raise** rate → **take more** damage | Berserker tax; Dargin twist uses these |
| `grd`, `tgr`, … | **Lower** the stat | Normal “↓” on sheet |
| `mcr`, `tcr` | **Lower** the rate → **cheaper** MP/TP costs | Wizard UP uses **negative** `perRank` |
| `ser` (SHE) | **Lower** shield effectiveness on you | Skirmisher / Berserker penalty |
| `sar` (SHA) | **Raise** — shields you **apply** are stronger | Medic / War Priest UP |

### 7. Artillery ATK vs MAT

- **Shared core** allows **ATK or MAT** — subgroup flavor picks one as primary damage stat.
- Do not put both ATK and MAT UP heavily on the same panel unless flavor explicitly hybrid (none today).

### 8. Generalist panels

- **UP:** meta keys (`exr`, `gdr`, `sdr`, `prof`, `apr`, `luk`, …) — all **`%`** rows, same as combat archetypes.
- Optional: tiny **`%`** sprinkles across several combat params (Orc-style breadth), never flat additive.
- **DOWN:** no classic combat tax — opportunity cost is “you didn’t take a real archetype.”

### 9. Mastery vs panels

- **Panels** = steady stat growth every rank (`perRank` × ranks invested).
- **Mastery** (max rank on tier **10** panel only, within subgroup) = passive hook — do not duplicate mastery math on panel rows.
- Capstone panel: worst drop rate, **20 ranks**, highest `perRank`, Godlike costs, **End** mastery (e.g. Ghosty **Spectral Avalanche** — 30s rotation window, 15%/unique, Emptiness procs). Cost must match that bundle.

### 10. Panel downside floors (runtime)

SDP downs stack additively against pre-SDP base. Ups are uncapped.

| Stat | Floor after panels |
|---|---|
| **MHP** | **1** (0 MHP bricks the actor) |
| **Everything else** | **0** |

Enforced in `J-SDP` when applying panel totals (`Game_Actor.param` / `xparam` / `sparam` / `maxTp`). Glass cannon builds can go extreme; they cannot rank themselves invalid.

### 11. `%`-only panels; base growth elsewhere

SDP panels are **multipliers on who you already are**, not a second level-up table.

| System | Delivers |
|---|---|
| **Class / job / evolution** | Base param identity (Jerald Swordsman → Paladin/Sorcerer fork shifts MAT, MHP, role skills) |
| **Level, gear, traits, masteries** | Base stats + passive hooks |
| **SDP panels** | **`%` amplification** and archetype tradeoffs on top |

**Strict prerequisite:** [**protag class / job tree**](../../../rmmz-plugins/.backlog/unstarted/ca-protag-class-job-tree-system.md) (SD3-style). Without class swapping (or equivalent base-param pivot), `%`-only panels **crumble** — low-base actors never get meaningful value from off-archetype strips. This is **required for ship**, not a nice-to-have. Tracked in [`work-items.md`](./work-items.md) under P4-1.

**Reference strip:** `undead-ghosty` (`GHO_1`…`GHO_10`) — first panel pass authored to this policy.

---

## Progression: rarity & maxRank

**Rarity labels:** Common (0) · Magical (1) · Rare (2) · Epic (3) · Legendary (4) · Godlike (5).

| Tier | Rarity idx | Label | `maxRank` |
|---:|---:|---|---:|
| 1 | 0 | Common | 10 |
| 2 | 1 | Magical | 10 |
| 3 | 2 | Rare | 10 |
| 4 | 2 | Rare | 10 |
| 5 | 3 | Epic | 10 |
| 6 | 3 | Epic | 10 |
| 7 | 4 | Legendary | 10 |
| 8 | 4 | Legendary | 10 |
| 9 | 4 | Legendary | 10 |
| 10 | 5 | Godlike | **20** |

**Normalize sweep (P4-1):** apply rarity + `maxRank` to every non-Sin strip; then author `panelParameters` / `perRank`.

**Tier vs same-rarity neighbor:** tier **N+1** gets higher **`perRank`** than tier **N** when rarity index is unchanged (e.g. tier 3 vs 4 both Rare — tier 4 hits harder per rank, same 10 ranks, same cost-per-rank band).

---

## Math: how `perRank` applies

All rows are **`isFlat: false`** (percent growth):

- Actor bonus at rank `R`: `baseParam × (R × perRank) / 100` (see `Game_Actor` SDP hooks).
- UI preview: one rank ≈ `perRank` percent points on that param.
- **Cross-combine:** every ranked panel sums into the same pool — Wizard `−60% MHP` + Guardian `+100% MHP` ⇒ net `+40%` on base.

**Sanity check at max rank:** multiply `perRank × maxRank` for core lines — capstone panels (rank 20) should feel committal, not absurd.

---

## Draft magnitude anchors (% per rank, `isFlat: false`)

> **Draft only** — tune on first family strip (Ghosty). Scale linearly within act unless playtest says otherwise.

### Primary flavor UP (heavy line)

| Act | `perRank` anchor |
|---|---:|
| Beginning (1–4) | 1.0 – 1.5 |
| Middle (5–9) | 1.5 – 2.0 |
| End (10) | 2.0 – 2.5 |

### Secondary archetype UP (non-flavor)

| Act | `perRank` anchor |
|---|---:|
| Beginning | 0.5 – 1.0 |
| Middle | 0.8 – 1.5 |
| End | 1.0 – 1.8 |

### Core DOWN (defense / survivability tax)

| Act | `perRank` anchor (negative) |
|---|---:|
| Beginning | −0.4 – −0.6 |
| Middle | −0.5 – −0.8 |
| End | −0.6 – −1.0 |

### Secondary DOWN

| Act | `perRank` anchor (negative) |
|---|---:|
| Beginning | −0.2 – −0.4 |
| Middle | −0.3 – −0.5 |
| End | −0.4 – −0.6 |

**Ghosty example at GHO_10 (rank 20, mat 2%/rank):** +40% MAT from that row alone before other panels.

---

## Archetype cores (shared UP / DOWN)

Quick reference — full prose in [`archetype-mapping.md`](./archetype-mapping.md).

| Archetype | UP (pool) | DOWN (pool) |
|---|---|---|
| **Berserker** | `atk`, `cri`, `cdm`, `lst`, `trg`, `tcr` | `pdr`, `mdr`, `grd`, `ser` |
| **Guardian** | `def`, `mdf`, `mhp`, `tgr`, `grd`, `cdr`, `cev`, `cnt` | `atk`, `agi`, `cri`, `msb` |
| **Vanguard** | `atk`, `def`, `mhp`, `cev` | `cri`, `cdm`, `mat`, `mdf` |
| **War Priest** | `atk`, `hrg`, `rec`, `lst`, `cdr`, `hit`, `sar` | `mat`, `cri` |
| **Skirmisher** | `agi`, `luk`, `hit`, `cri`, `trg` | `mhp`, `def`, `ser`, `cdr` |
| **Artillery** | `atk` **or** `mat`, `cri`, `cdm`, `hit` | `mhp`, `def`, `grd`, `cev`, `ser`, `cdr` |
| **Wizard** | `mat`, `mmp`, `mcr` | `mhp`, `def`, `grd`, `tgr`, `cev`, `cdr` |
| **Cleric** | `rec`, `pha`, `mrg`, `mdf`, `ser`, `cev` | `atk`, `tgr`, `cdm` |
| **Medic** | `mdf`, `mrg`, `hrg`, `sar`, `pha` | `atk`, `cri`, `cdm` |
| **Generalist** | `luk`, `exr`, `gdr`, `sdr`, `prof`, `apr`, `pha`, modest **`%`** combat spread | (no combat downs) |

---

## Subgroup stat index (flavor twist)

`subgroupKey` → archetype → **flavor** (weight these keys heavier / `isCore`).

### Family 1: Undead

| Subgroup | `subgroupKey` | Archetype | Flavor twist (panel weight) |
|---|---|---|---|
| Ghosty | `undead-ghosty` | Wizard | **`mat`** steady |
| Wraith | `undead-reborn` | Guardian | **`mdf`** heavy |
| Wisp | `undead-wisp` | Artillery | **`mat`**, aura punisher |
| Skeletor | `undead-skeleton` | Berserker | **`hrg`** small |
| Rust Bucket | `undead-armor` | Vanguard | **`def`** spike, **`mhp`** down |

### Family 2: Reptile

| Subgroup | `subgroupKey` | Archetype | Flavor twist |
|---|---|---|---|
| Snake | `reptile-snake` | Skirmisher | **`cri`** heavy |
| Dargin | `reptile-dargin` | Vanguard | **`def`/`mrf`** rotate, **`mhp`** up, **`mat`** down; 4 rows/tier |
| Draconite | `reptile-draconite` | Guardian | **`def`** heavy, positional |
| Lamia | `reptile-lamia` | Artillery | **`mat`** heavy, cast wind-up |
| Salamander | `reptile-salamander` | War Priest | balanced sustain + **`agi`** |

### Family 3: Aquatic

| Subgroup | `subgroupKey` | Archetype | Flavor twist |
|---|---|---|---|
| Kappa | `aquatic-kappa` | Generalist | **`luk`**, **`exr`** |
| Frog | `aquatic-frog` | Artillery | **`mat`** heavy, stationary |
| Crimson Vice | `aquatic-crimson-vice` | Guardian | **`grd`**, anti-physical |
| Fish | `aquatic-fish` | Skirmisher | **`agi`**, **`msb`** |
| Cephalopod | `aquatic-cephalopod` | War Priest | **`rec`** heavy, **`mhp`** |

### Family 4: Slime

| Subgroup | `subgroupKey` | Archetype | Flavor twist |
|---|---|---|---|
| Hard Syrup | `slime-puddle` | Generalist | **`fdr`**, small **`hrg`** |
| Roper | `slime-roper` | Berserker | **`mat`** replaces **`atk`** lean |
| Jelly | `slime-jelly` | Medic | **`mrg`** heavy |
| Goo Bat | `slime-goo-bat` | Cleric | **`mrg`** heavy, regen |
| Cube | `slime-cube` | Vanguard | **`mhp`** spike, small **`tgr`** |

### Family 5: Plant

| Subgroup | `subgroupKey` | Archetype | Flavor twist |
|---|---|---|---|
| Wolftrap | `plant-wolftrap` | Wizard | **`mat`**, debuff affinity |
| Fungrowth | `plant-fungrowth` | Berserker | **`atk`** heavy; **`mcr`/`tcr`** up (costly skills) |
| Dryad | `plant-dryad` | Medic | **`mdf`** heavy |
| Treant | `plant-treant` | Vanguard | **`def`**, **`hrg`**, **`lst`** mod |
| Flower | `plant-flower` | Cleric | **`mdf`**, debuff resist |

### Family 6: Beast

| Subgroup | `subgroupKey` | Archetype | Flavor twist |
|---|---|---|---|
| Bearcat | `beast-bearcat` | Berserker | **`mat`** at higher tiers |
| Cave Bat | `beast-cave-bat` | Skirmisher | **`hit`**, **`agi`** |
| Garuda | `beast-garuda` | Artillery | **`atk`**, **`agi`** |
| Rot Rat | `beast-rot-rat` | Generalist | **`sdr`**, **`gdr`** |
| Quadruped | `beast-quadruped` | Guardian | **`tgr`**, pack aura |

### Family 7: Insect

| Subgroup | `subgroupKey` | Archetype | Flavor twist |
|---|---|---|---|
| Needler | `insect-needler` | Skirmisher | **`cri`**, **`cdm`** |
| Crawler | `insect-crawler` | War Priest | **`hrg`**, **`lst`**; **`msb`** down |
| Brood | `insect-brood` | Wizard | **`atk`** physical poker |
| Scorpion | `insect-scorpion` | Vanguard | **`atk`**, **`def`**, **`cnt`** |
| Parasite | `insect-parasite` | War Priest | **`lst`** heavy |

### Family 8: Humanoid

| Subgroup | `subgroupKey` | Archetype | Flavor twist |
|---|---|---|---|
| Minotaur | `humanoid-minotaur` | Artillery | **`atk`** heavy, momentum |
| Orc | `humanoid-orc` | Generalist | broad **`%`** spread, small **`mcr`** |
| Bandit | `humanoid-bandit` | Skirmisher | **`luk`** heavy |
| Cyclops | `humanoid-cyclops` | Vanguard | **`%`** raw stats, minimal rate stacking |
| Kobold | `humanoid-kobold` | Cleric | **`pha`** heavy |

### Family 9: Construct / Arcane

| Subgroup | `subgroupKey` | Archetype | Flavor twist |
|---|---|---|---|
| Heated Titan | `construct-heated-titan` | Berserker | **`mhp`** (one mistake buffer) |
| Hazard | `construct-hazard` | Artillery | **`mat`**, area |
| Bot | `construct-bot` | War Priest | **`hrg`** heavy, **`def`** |
| Puppet | `construct-puppet` | Wizard | **`mat`** heavy |
| Runic Orb | `construct-runic-orb` | Medic | **`sar`**, **`mmp`** |

### Family 10: Deity

| Subgroup | `subgroupKey` | Archetype | Flavor twist |
|---|---|---|---|
| Elemental | `deity-elemental` | Wizard | **`mat`**, elemental |
| Aspect | `deity-emotion` | Cleric | **`rec`** heavy |
| Sovereign | `deity-devil` | Generalist | **`luk`**, **`exr`** (Devil bargain mastery) |
| Sin | `deity-sin` | Multi | per-sin panel recipe — not three-act |
| Sin Votary | `deity-sin-votary` | Multi | no panel strip |

---

## Parameter keys quick reference

| Key | CA label (editor) | Typical role |
|---|---|---|
| `mhp`–`luk` | Max Life … Luck | Base params |
| `hit`–`trg` | Accuracy … TP Regen | EX params |
| `tgr`–`exr` | Aggro … Experience UP | SP params |
| `cdm`, `cdr` | Crit Amp, Crit Block | Registry |
| `msb`, `prof`, `sdr` | Move Speed+, Proficiency+, SDP Mult | Registry |
| `lst`, `mst`, `tst` | Lifesteal, Manasteal, Techsteal | Registry |
| `sar`, `ser` | Shield Amp, Shield Effectiveness | Registry |
| `apr`, `gdr`, `dor`, `hcr` | AP Mult, Gold+, Drop+, HP cost reduction | Registry |

Full trait/param decode: [`../database-decode-cheatsheet.md`](../database-decode-cheatsheet.md).

---

## Authoring workflow (one subgroup strip)

1. Look up **archetype + flavor** in [Subgroup stat index](#subgroup-stat-index-flavor-twist).
2. Build row list: flavor UP (core) + 1–2 archetype UPs + 1–2 core DOWNs + optional secondary.
3. Assign **`perRank`** from [Draft magnitude anchors](#draft-magnitude-anchors--per-rank-isflat-false) by act (`subgroupTier`).
4. Write `config.sdp.json` `panelParameters[]` for `GHO_1`…`GHO_10` (or family prefix).
5. In-game: rank panels, verify SDP detail window + CMS totals + tradeoff feel.

**First slice:** `undead-ghosty` (`GHO_1`…`10`) — **done** (reference strip for P4-1 `%`-only authoring).

---

## Related docs

- [`archetype-mapping.md`](./archetype-mapping.md) — design prose, cross-archetype tension, full stat matrix
- [`mastery-cheatsheet.md`](./mastery-cheatsheet.md) — mastery IDs, three-act names
- [`implementation-status.md`](./implementation-status.md) — registry combat hooks
- [`work-items.md`](./work-items.md) — P4-1 backlog
