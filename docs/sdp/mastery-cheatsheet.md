# SDP mastery authoring cheatsheet

> **Purpose:** Step-1 reference for the family → subgroup pass (masteries before panel rewrite).
> Sources: [`archetype-mapping.md`](./archetype-mapping.md), [`implementation-status.md`](./implementation-status.md) tag cookbook.
>
> Last updated: **2026-06-19** — `insect-brood` (Brood) verified. Shipped state extension via `OverlayManager.getExtendedState` + `<extendStateType:TYPE>` / `<extend:[IDs]>` tags; spread system updated to route through progenitor's `state()` view. **Last verified prefix: `HIV`**
>
> **Progress:** [Authoring progress](#authoring-progress-one-subgroup-at-a-time) — assistant updates when a subgroup pass is done.

---

## Authoring progress (one subgroup at a time)

> **Workflow:** author mastery rows (+ panels when ready) → tell the assistant the subgroup is done → table advances here.

**34 / 48 verified** · **current:** Scorpion (`insect-scorpion`) · **Family 1 Undead, Family 2 Reptile, Family 3 Aquatic, Family 4 Slime, Family 5 Plant complete**

> **Payload bands are per-database — Skills.json and States.json IDs are independent.**
> **Skills.json bands:** 1001–1010 Wraith ward pulse · 1011–1020 Crimson Vice thorns · 1021–1030 Goo Bat aura pulse · 1031–1040 Quadruped pack aura. Next free: **1041+**.
> **States.json bands:** 1001–1010 Wraith ward · 1011–1020 Skeletor rage · 1021–1030 Snake venom · 1031–1040 Frog MAT stacks · 1041–1050 Cephalopod ink cloud · 1051–1060 Hard Syrup elemental gel · 1061–1070 Cube slow (Gooped/Enmired/Subsumed) · 1071–1080 Garuda speed/evasion buff · 1081–1090 Quadruped pack DEF buff. Next free: **1091+**. *(Crawler uses no payload band — tags live directly on mastery states 1411–1420.)*

| # | Family | Subgroup | `subgroupKey` | Panels | Mastery IDs | Status |
|---:|---|---|---|---|---|---|
| 1 | Undead | Ghosty | `undead-ghosty` | `GHO_*` | 1101–1110 | ✅ Verified |
| 2 | Undead | Reborn | `undead-reborn` | `REB_*` | 1111–1120 | ✅ Verified — ward payloads **1001–1010** |
| 3 | Undead | Wisp | `undead-wisp` | `WIL_*` | 1121–1130 | ✅ Verified |
| 4 | Undead | Skeleton | `undead-skeleton` | `BON_*` | 1131–1140 | ✅ Verified — support states TBD |
| 5 | Undead | Armor | `undead-armor` | `ARM_*` | 1141–1150 | ✅ Verified — DEF↑ / MHP↓ traits; GRD + CDR capstone **1150** |
| 6 | Reptile | Snake | `reptile-snake` | `SNK_*` | 1151–1160 | ✅ Verified — masteries + payloads **1021–1030** + panel params |
| 7 | Reptile | Dargin | `reptile-dargin` | `DRG_*` | 1161–1170 | ✅ Verified |
| 8 | Reptile | Draconite | `reptile-draconite` | `DCO_*` | 1171–1180 | ✅ Verified |
| 9 | Reptile | Lamia | `reptile-lamia` | `LAM_*` | 1181–1190 | ✅ Verified |
| 10 | Reptile | Salamander | `reptile-salamander` | `SAL_*` | 1191–1200 | ✅ Verified |
| 11 | Aquatic | Kappa | `aquatic-kappa` | `KAP_*` | 1201–1210 | ✅ Verified |
| 12 | Aquatic | Frog | `aquatic-frog` | `FRG_*` | 1211–1220 | ✅ Verified — payload states **1031–1040** + `removeStateOnMove` hook |
| 13 | Aquatic | Crimson Vice | `aquatic-crab` | `CRB_*` | 1221–1230 | ✅ Verified — thorns payloads **1011–1020** + panel params; `<retaliate:[ID, 100, physical]>` |
| 14 | Aquatic | Fish | `aquatic-fish` | `FSH_*` | 1231–1240 | ✅ Verified |
| 15 | Aquatic | Cephalopod | `aquatic-cephalopod` | `CPH_*` | 1241–1250 | ✅ Verified — ink cloud payloads **1041–1050** + panel params |
| 16 | Slime | Hard Syrup | `slime-puddle` | `SLI_*` | 1251–1260 | ✅ Verified — elemental gel payloads **1051–1060** + panel params |
| 17 | Slime | Roper | `slime-roper` | `TNT_*` | 1261–1270 | ✅ Verified — `<perDebuffBuff:N>` + Roper Goop on-hit trait (state 70); capstone 5× goop |
| 18 | Slime | Jelly | `slime-jelly` | `JEL_*` | 1271–1280 | ✅ Verified — `<onSelfHpHealMp:[PCT, R]>` / `<onSelfAnyHealMp:[PCT, R]>` mana transfusion; panel params authored |
| 19 | Slime | Goo Bat | `slime-aerial` | `AER_*` | 1281–1290 | ✅ Verified — Cleric aura pulse payloads **1021–1030**; capstone `<hpPercent:5>` regen |
| 20 | Slime | Cube | `slime-cube` | `CUB_*` | 1291–1300 | ✅ Verified — slow payloads **1061–1070** |
| 21 | Plant | Trap | `plant-trap` | `TRP_*` | 1301–1310 | ✅ Verified |
| 22 | Plant | Fungus | `plant-fungus` | `FUN_*` | 1311–1320 | ✅ Verified |
| 23 | Plant | Dryad | `plant-dryad` | `FAE_*` | 1321–1330 | ✅ Verified |
| 24 | Plant | Treant | `plant-treant` | `TRE_*` | 1331–1340 | ✅ Verified |
| 25 | Plant | Flower | `plant-flower` | `FLW_*` | 1341–1350 | ✅ Verified |
| 26 | Beast | Bearcat | `beast-bearcat` | `HBR_*` | 1351–1360 | ✅ Verified |
| 27 | Beast | Bat | `beast-bat` | `WNG_*` | 1361–1370 | ✅ Verified |
| 28 | Beast | Garuda | `beast-beaker` | `BEK_*` | 1371–1380 | ✅ Verified |
| 29 | Beast | Rot Rat | `beast-rat` | `ROD_*` | 1381–1390 | ✅ Verified |
| 30 | Beast | Quadruped | `beast-quadruped` | `QUA_*` | 1391–1400 | ✅ Verified — pack aura payloads **1031–1040** (skills) + **1081–1090** (states); `<mdfBuffPlus:[a.def * 0.5]>` capstone |
| 31 | Insect | Needler | `insect-needler` | `STG_*` | 1401–1410 | ✅ Verified |
| 32 | Insect | Crawler | `insect-crawler` | `WRM_*` | 1411–1420 | ✅ Verified |
| 33 | Insect | Brood | `insect-brood` | `HIV_*` | 1421–1430 | ✅ Verified — `<extendStateType:poison>` + spread masteries; state extension shipped |
| 34 | Insect | Scorpion | `insect-scorpion` | `JMP_*` | 1431–1440 | 🔄 Current |
| 35 | Insect | Parasite | `insect-parasite` | `PAR_*` | 1441–1450 | 🟡 Panels done — masteries needed |
| 36 | Humanoid | Minotaur | `humanoid-minotaur` | `BUL_*` | 1451–1460 | 🔲 Todo |
| 37 | Humanoid | Orc | `humanoid-orc` | `ORC_*` | 1461–1470 | 🔲 Todo |
| 38 | Humanoid | Bandit | `humanoid-bandit` | `THF_*` | 1471–1480 | 🔲 Todo |
| 39 | Humanoid | Cyclops | `humanoid-cyclops` | `WLK_*` | 1481–1490 | 🔲 Todo |
| 40 | Humanoid | Kobold | `humanoid-kobold` | `CLN_*` | 1491–1500 | 🔲 Todo |
| 41 | Construct | Titan | `construct-titan` | `GOL_*` | 1501–1510 | 🟡 Panels done — masteries needed |
| 42 | Construct | Hazard | `construct-hazard` | `HAZ_*` | 1511–1520 | 🟡 Panels done — masteries needed |
| 43 | Construct | Bot | `construct-bot` | `RBT_*` | 1521–1530 | 🟡 Panels done — masteries needed |
| 44 | Construct | Puppet | `construct-puppet` | `HOM_*` | 1531–1540 | 🟡 Panels done — masteries needed |
| 45 | Construct | Orb | `construct-orb` | `RUN_*` | 1541–1550 | 🟡 Panels done — masteries needed |
| 46 | Deity | Elemental | `deity-elemental` | `ELE_*` | 1551–1560 | 🔲 Todo |
| 47 | Deity | Aspect | `deity-emotion` | `ASP_*` | 1561–1570 | 🔲 Todo |
| 48 | Deity | Sovereign | `deity-devil` | `SOV_*` | 1571–1580 | 🔲 Todo |
| 49 | Deity | Sin | `deity-sin` | `SIN_*` | 1581–1590 | 🔲 Todo |
| 50 | Deity | Sin Votary | `deity-sin-votary` | — | 1591–1600 | — (enemy decade only; no mastery pass) |

| Status | Meaning |
|---|---|
| ✅ **Verified** | Authored + in-map playtest pass. |
| 🔄 **Current** | Active strip — author and playtest this one next. |
| 🟡 **Panels done** | Panel parameters authored; masteries still needed. |
| 🟠 **Authored — playtest pending** | Tags/traits written; not yet tested in-map. |
| 🔲 **Todo** | Not verified yet (may still be scaffold shells in DB). |

One Cursor thread per subgroup works well — open with the row above (subgroup key + mastery ID band).

---

## Display naming (three acts)

Aligns with food arcs (beginning → middle → end). Same mechanics per act; potency scales by tier ID.

| Panel `subgroupTier` | Skill / state `name` in DB |
|---:|---|
| **1–3** | **Beginning** |
| **4–9** | **Middle** |
| **10** | **End** (capstone) |

Only one mastery skill active at a time; `<hideFromJabsMenu>` on all wrapper skills.

**Example (Ghosty):** 1101–1103 `Spectral Cascade` · 1104–1109 `Spectral Torrent` · **1110** `Spectral Avalanche`.

**SDP UI:** still show tier pips (`7/10`) — names mark **acts**, not panel rank depth.

**Exception — Sin panels:** ten **`SIN_*`** strips (not three-act); one mastery skill/state per panel at max rank. See [Sin panels](#sin-panels--one-panel-one-mastery-not-three-act).

---

## ID policy

| Rule | Value |
|---|---|
| **Skill ID = State ID** | Wrapper skill `N` → `<passive:[N]>`; tags on **state** `N`. |
| **Skill ID = Enemy ID + 1000** | Enemy **101** → mastery **1101**; holds for every family decade through **600 → 1600**. |
| **Per subgroup** | 10 enemy IDs + 10 mastery IDs; panel tier = last digit of panel key = decade step. |
| **Global range** | **1101–1600** (enemies **101–600**) |

**Formula (equivalent forms):**

- `masteryId = 1101 + (familyIndex × 50) + (subgroupIndexInFamily × 10) + (tier − 1)`
- `masteryId = enemyId + 1000` when `enemyId = 101 + (familyIndex × 50) + (subgroupIndexInFamily × 10) + (tier − 1)`

**Wrapper note:** `<hideFromJabsMenu>` + `<passive:[ID]>`

---

## Save policy (no player migration obligation)

**Chef Adventure is pre-release** — there are no shipped player saves we design migration paths for.

| Rule | Detail |
|---|---|
| **Grant moment** | Wrapper skill is learned when `PanelRanking.performMaxRankupEffects()` runs — the rank-up that **first** hits max rank on that panel. |
| **No migration product** | Do not spend effort on upgrade scripts, save-version gates, or one-off backfill tools aimed at legacy player saves. |
| **Dev convenience OK** | `SdpMasteryManager.reconcileAllForParty()` on map start is an **idempotent** safety net when content or plugin wiring changes mid dev save — keep it, but it is not a migration commitment. |
| **Author expectation** | Starting fresh (new game) is the normal verify path; stale dev saves can be discarded. |

Same **no player migration** bar applies to other SDP content passes (panel parameters, act renames, tag rewrites).

---

## Panel rarity, maxRank & cost

Rarity is **`0–5`** in data (`PanelRarity` / J-SDP plugin): **Common → Magical → Rare → Epic → Legendary → Godlike**.
Rarity drives **SDP cost per rank** (plugin-parameter defaults); it does **not** directly change stats.

### Rarity curve (all non-`SIN_*` subgroup strips)

| `subgroupTier` | Rarity idx | Label |
|---:|---:|---|
| 1 | 0 | Common |
| 2 | 1 | Magical |
| 3 | 2 | Rare |
| 4 | 2 | Rare |
| 5 | 3 | Epic |
| 6 | 3 | Epic |
| 7 | 4 | Legendary |
| 8 | 4 | Legendary |
| 9 | 4 | Legendary |
| 10 | 5 | Godlike |

Pattern: **`0 → 1 → 2 → 2 → 3 → 3 → 4 → 4 → 4 → 5`**

### maxRank policy (family / enemy subgroup strips)

| `subgroupTier` | `maxRank` | Why |
|---:|---:|---|
| **1–9** | **10** | Same purchase depth everywhere; **tier power = `perRank`**, not extra ranks |
| **10** (capstone) | **20** | Rare drop + best stats/rank + **End mastery** — grind matches reward |

**Exception — `SIN_*` panels:** own recipe (not this curve).

Capstone **20** at Godlike is intentionally a large share of the subgroup wallet (~64% of default-cost strip when tiers 1–9 are 10 each). That is by design.

**Power scaling:** even when **rarity holds** (e.g. tier 3 vs 4 both Rare), **tier 4+ uses higher `perRank`** — stronger yield per click, same rank cap and same cost-per-rank band.

---

## Status legend

**Authoring pass** (subgroup done / left): [progress table](#authoring-progress-one-subgroup-at-a-time) — ✅ Verified = playtest-passed.

**Tag recipe column** (plugin readiness only — not “mastery done”):

| Mark | Meaning |
|---|---|
| ✅ | Shipped hook |
| ⏳ | Plugin gap |
| TBD | Enemy strip incomplete |
| 🍽 | Food — Field Medic |

---

## Family 1: Undead (101–150)

| Subgroup | `subgroupKey` | Panel keys | Archetype | **1–3 Beginning** | **4–9 Middle** | **10 End** | IDs | What it does | Tag recipe |
|---|---|---|---|---|---|---|---:|---|---|
| Ghosty | `undead-ghosty` | `GHO_1`…`10` | Wizard | Spectral Cascade | Spectral Torrent | Spectral Avalanche | 1101–1110 | +X% damage per distinct skill used in a rolling window (6→30 skills tracked). Beginning: 4/7/10% per unique. Middle: 10% per unique, window grows 9→24. Capstone: 15% per unique, window 30. | ✅ `<skillHistoryBonus:[0, WINDOW, PCT, unique]>` |
| Wraith | `undead-reborn` | `REB_1`…`10` | Guardian | Ghastly Ward | Pale Bulwark | Wraithwall Eternal | 1111–1120 | Timed MP-weighted shield pulse. Beginning: pulse every 60s (wards 1001–1003). Middle: pulse accelerates 55s→30s (wards 1004–1009). Capstone: pulse every 15s, 3-stack `shieldProtect` ward. | ✅ two-layer — [Wraith reference](#reference-wraith--ghastly-ward-undead-reborn) |
| Wisp | `undead-wisp` | `WIL_1`…`10` | Artillery | Blistering Aura | Searing Mantle | Scorched Halo | 1121–1130 | Fire aura: pulses on enemies nearby every 3s, also triggers on taking HP damage. Middle tiers add proximity threshold (4 tiles). Capstone: also triggers at 2- and 4-enemy proximity thresholds + instant pulse on HP damage. | ✅ `<autoExecuteSkill:[ID, enemiesNearby, N, 180]>` + `<autoExecuteSkill:[ID, hpDmg, 30]>` |
| Skeletor | `undead-skeleton` | `BON_1`…`10` | Berserker | Undying Rage | Graveborn Fury | Deathless Fury | 1131–1140 | Below low HP threshold, grants ATK+MAT via payload states (1011–1020). Beginning: +1/2/3% at ≤20% HP. Middle: +3% ATK/MAT, threshold stays 20%, payload scales. Capstone: +5% ATK/MAT/−50% PDR/MDR, all debuff immunity. | ✅ `<passiveStateCount:[ID, lessIsMoreHp, MULT]>` + payload ATK/MAT buff tags |
| Rust Bucket | `undead-armor` | `ARM_1`…`10` | Vanguard | Hollow Armor | Brittle Bastion | Paper Fortress | 1141–1150 | High DEF, lower effective MHP. Beginning: +6/9/12% DEF, −2/4/6% MHP (traits). Middle: +28→30% DEF, −15% MHP + `<grdBuffRate>` scaling 10→30%. Capstone: +100% DEF, −50% MHP, `<grdBuffRate:50>` + `<critReduction:30>` + `<cdrBuffRate:50>`. | ✅ DEF↑ / MHP↓ traits + `<grdBuffRate>` |

---

## Family 2: Reptile (151–200)

| Subgroup | `subgroupKey` | Archetype | **1–3** | **4–9** | **10** | IDs | What it does | Tag recipe |
|---|---|---|---|---|---|---:|---|---|
| Snake | `reptile-snake` | Skirmisher | Venom Strike | Venom Surge | Venom Deluge | 1151–1160 | Crit applies one tier of venom (payloads 1021–1030). Beginning: 50/75/100% proc, extend-style. Middle: 100% proc, stacking up to 6. Capstone: 100% proc, %MHP slip + extend. | ✅ `<onCritApply:[ID, CHANCE]>` · payloads **1021–1030** |
| Dargin | `reptile-dargin` | Vanguard | Dragonheart | Dragonheart Stirring | Dragonheart Aflame | 1161–1170 | Below HP threshold, −X% PDR/MDR. Beginning: −10/15/20% PDR+MDR at ≤20% HP. Middle: −30→60% PDR+MDR at ≤30% HP + all-element resist 33%. Capstone: −80% PDR+MDR at ≤40% HP + all-element resist 33% + full debuff immunity. | ✅ `<passiveSourceRule:[hpBelow, N]>` + PDR/MDR traits + element/debuff immunity traits |
| Draconite | `reptile-draconite` | Guardian | Stone Scales | Stone Mantle | Granite Bastion | 1171–1180 | +X% DEF while not moving. Beginning: +50% DEF after 5/4/3s still. Middle: +50→200% DEF after 3s still. Capstone: +300% DEF after 3s still + `<grdBuffPlus:1000>`. | ✅ `<passiveSourceRule:[sinceLastMoved, N]>` + DEF% traits |
| Lamia | `reptile-lamia` | Artillery | Focusing Beam | Converging Beam | Coalesced Annihilation | 1181–1190 | Bonus damage scales with cast time. Beginning: +8/12/16% per cast second. Middle: +25→50% per cast second + 5→30% cast time reduction. Capstone: +100% per cast second + 50% cast time reduction. | ✅ `<castTimeDamageBonus:N>` + `<castTimePercent:[N]>` |
| Salamander | `reptile-salamander` | War Priest | Elemental Infusion | Elemental Attunement | Primal Conduit | 1191–1200 | Bonus elemental attack damage. Beginning: +11/22/33% fire+ice only. Middle: +5→30% all elements + 50% fire+ice stacked. Capstone: +25% neutral/all elements, +50% all non-neutral, +100% fire+ice. | ✅ `<boostElement:ID:PCT>` traits |

---

## Family 3: Aquatic (201–250)

| Subgroup | `subgroupKey` | Archetype | **1–3** | **4–9** | **10** | IDs | What it does | Tag recipe |
|---|---|---|---|---|---|---:|---|---|
| Kappa | `aquatic-kappa` | Generalist | Trickster's Luck | Trickster's Favor | Trickster's Gambit | 1201–1210 | Beginning: bonus drop rate only (+4/7/10%). Middle: drop rate escalates + flat EVA bonus (+25→50 EVA). Capstone: EVA, LUK, and drop rate all scale with actor level. | ✅ `<dropMultiplier:N>` + `<evaBuffPlus:[N]>` + `<lukBuffPlus:[a.level]>` |
| Frog | `aquatic-frog` | Artillery | Rooted Barrage | Rooted Tempest | Rooted Cataclysm | 1211–1220 | MAT stacks while standing still, reset on move. Beginning: stack after 3s still. Middle: stack after 2s still. Capstone: stack after 1s still. Payloads 1031–1040. | ✅ `<autoApplyState:[103X, stand, F]>` + `<removeStateOnMove:[103X]>` |
| Crimson Vice | `aquatic-crab` | Guardian | Iron Shell | Iron Rebuke | Shellbreaker Retort | 1221–1230 | Physical retaliate on every hit (100% proc). Tiers escalate payload damage (1011–1020). | ✅ `<retaliate:[ID, 100, physical]>` · payloads **1011–1020** |
| Fish | `aquatic-fish` | Skirmisher | Slippery | Swift Current | Slipstream | 1231–1240 | +X move speed after being attacked (window grows each tier). Beginning: +5/10/15 speed, 1s window. Middle: +20 speed, window grows 1.25s→2.5s. Capstone: +30 speed, 3s window + 25% crit rate bonus. | ✅ `<passiveSourceRule:[attackedWithin, N]>` + `<speedBoost:N>` + `<criBuffRate>` |
| Cephalopod | `aquatic-cephalopod` | War Priest | Ink Shroud | Murky Pall | Abyssal Veil | 1241–1250 | Taking HP damage triggers a DR cloud (8s cooldown, payloads 1041–1049). Capstone: triggers on any damage type + 8s cooldown. | ✅ `<autoApplyState:[104X, hpDmg, 480]>` / capstone `anyDmg` |

---

## Family 4: Slime (251–300)

| Subgroup | `subgroupKey` | Archetype | **1–3** | **4–9** | **10** | IDs | What it does | Tag recipe |
|---|---|---|---|---|---|---:|---|---|
| Hard Syrup | `slime-puddle` | Generalist | Adaptive Slime | Reactive Gel | Elemental Osmosis | 1251–1260 | On HP damage, apply Elemental Gel debuff (payloads 1051–1060). Beginning: 3s cooldown. Middle: 2s cooldown. Capstone: 1s cooldown. | ✅ `<autoApplyState:[105X, hpDmg, CD]>` |
| Roper | `slime-roper` | Berserker | Eldritch Fury | Eldritch Tempest | Eldritch Maelstrom | 1261–1270 | +X% damage per debuff on target. Beginning: +5/10/15%. Middle: +20→45%. Capstone: +50%. | ✅ `<perDebuffBuff:N>` |
| Jelly | `slime-jelly` | Medic | Mana Transfusion | Mana Weave | Arcane Transfusion | 1271–1280 | HP heals also restore MP. Beginning: 10/20/30% of HP heal as MP, self only. Middle: 50% of HP heal as MP + radius grows 1→6 tiles. Capstone: 50% of any heal (HP or MP) as MP, radius 6. | ✅ `<onSelfHpHealMp:[PCT, R]>` / capstone `<onSelfAnyHealMp:[PCT, R]>` |
| Goo Bat | `slime-aerial` | Cleric | Regeneration Aura | Miasma of Life | Spore Bloom | 1281–1290 | Periodic AoE heal pulse on nearby allies (payloads 1021–1030). Beginning: every 8s. Middle: every 7s→3s. Capstone: every 2s + personal 5% MHP regen per tick. | ✅ `<autoExecuteSkill:[102X, time, FRAMES]>` + `<hpPercent:5>` |
| Cube | `slime-cube` | Vanguard | Living Obstacle | Living Bulwark | Immovable Bulk | 1291–1300 | Nearby enemies are slowed (payloads 1061–1070), checked every 1s. All tiers check for 1+ enemy nearby. | ✅ `<autoApplyStateOnNearby:[106X, enemiesNearby, 1, 60]>` |

---

## Family 5: Plant (301–350)

| Subgroup | `subgroupKey` | Archetype | **1–3** | **4–9** | **10** | IDs | What it does | Tag recipe |
|---|---|---|---|---|---|---:|---|---|
| Wolftrap | `plant-wolftrap` | Wizard | Entangling Curse | Thorned Curse | Stranglethorn Curse | 1301–1310 | Your debuffs last X% longer. Beginning: +10/20/30%. Middle: +50→100%. Capstone: +200% duration + +100% damage to poisoned targets. | ✅ `<stateDurationPerc:N>` / capstone + `<bonusDamageIfState:[5, 100]>` |
| Fungrowth | `plant-fungrowth` | Berserker | Primal Instinct | Primal Surge | Primal Apex | 1311–1320 | +X% ATK while all skills are off cooldown. Beginning: +10/20/30% ATK. Middle: +50% ATK + escalating flat ATK bonus (20→100%). Capstone: +255% ATK + 255% flat ATK bonus + 2 bonus basic hits. | ✅ `<passiveSourceRule:[allOffCooldown]>` + ATK x-param + ATK b-param traits |
| Dryad | `plant-dryad` | Medic | Nature's Wrath | Nature's Ire | Nature's Judgment | 1321–1330 | +X% MAT while all allies above HP threshold. Beginning: +10/20/30% MAT at ≥75% HP. Middle: +50→100% MAT + +50% MDF (fixed) at ≥75% HP. Capstone: +200% MAT + +100% MDF at ≥50% HP. | ✅ `<passiveSourceRule:[hpAbove, N, allAllies, 8]>` + MAT/MDF traits |
| Treant | `plant-treant` | Vanguard | Ironbark | Tempered Ironbark | Ancient Ironbark | 1331–1340 | −X% PDR (+DEF% from tier 4) after N seconds without being hit. Beginning: −5/10/15% PDR after 8s. Middle: −20→70% PDR + 10→35% DEF after 5s. Capstone: −90% PDR + 50% DEF after 2s. | ✅ `<passiveSourceRule:[sinceLastHit, N]>` + PDR trait + DEF% trait |
| Flower | `plant-flower` | Cleric | Purifying Bloom | Cleansing Petals | Sacred Bloom | 1341–1350 | Periodic AoE cleanse of negative states on nearby allies. Beginning: 1 state, radius 2→4, every 6s. Middle: 1→6 states, radius 5, every 5s. Capstone: all negative states, radius 8, every 4s. | ✅ `<autoExecuteSkill:[ID, time, FRAMES]>` + `<purgeStates:[negative, false, N]>` |

---

## Family 6: Beast (351–400)

| Subgroup | `subgroupKey` | Archetype | **1–3** | **4–9** | **10** | IDs | What it does | Tag recipe |
|---|---|---|---|---|---|---:|---|---|
| Bearcat | `beast-bearcat` | Berserker | Void Resonance | Void Chord | Void Harmonics | 1351–1360 | X% ATK adds to MAT. | ✅ ATK→MAT % |
| Cave Bat | `beast-bat` | Skirmisher | Cauldron Instinct | Chittering Frenzy | Wingbeat Chorus | 1361–1370 | +X% HIT per nearby ally. | ✅ `<passiveSourceRule:[alliesNearby, N]>` |
| Garuda | `beast-beaker` | Artillery | Tailwind | Rising Gust | Gale Force | 1371–1380 | +X% MSB after using a skill. | ✅ `<passiveSourceRule:[attackedWithin, 180]>` |
| Rot Rat | `beast-rat` | Generalist | Resourceful Rodent | Nest Egg | Compound Interest | 1381–1390 | More SDP and gold. | ✅ `sdr` + `gdr` |
| Quadruped | `beast-quadruped` | Guardian | Alpha Presence | Alpha Howl | Pack Sovereignty | 1391–1400 | Allies +X% DEF. | ✅ `<passiveSourceRule:[alliesNearby, N]>` |

---

## Family 7: Insect (401–450)

| Subgroup | `subgroupKey` | Archetype | **1–3** | **4–9** | **10** | IDs | What it does | Tag recipe |
|---|---|---|---|---|---|---:|---|---|
| Needler | `insect-needler` | Skirmisher | Drilling Sting | Hive Puncture | Lance of the Hive | 1401–1410 | On-crit poison proc + bonus damage vs poison-type targets. | ✅ `<onCritApply:[16, CHANCE]>` + `<bonusDamageIfStateType:[poison, PCT]>` |
| Crawler | `insect-crawler` | War Priest | Spire Network | Spire Synapse | Spire Dominion | 1411–1420 | +X% HRG/LST with enemies in melee. | ✅ `<passiveSourceRule:[enemiesNearby, N]>` |
| Brood | `insect-brood` | Wizard | Plague Swarm | Endemic Swarm | Pandemic | 1421–1430 | Debuffs spread virally. | ✅ spread tags |
| Scorpion | `insect-scorpion` | Vanguard | Chitin Barbs | Chitin Lash | Barbed Retribution | 1431–1440 | Counters apply slow. | ⏳ counter hook |
| Parasite | `insect-parasite` | War Priest | Siphon Aura | Siphon Weave | Cradle of Leech | 1441–1450 | Lifesteal splashes to allies. | ✅ Lifesteal splash aura |

---

## Family 8: Humanoid (451–500)

| Subgroup | `subgroupKey` | Archetype | **1–3** | **4–9** | **10** | IDs | What it does | Tag recipe |
|---|---|---|---|---|---|---:|---|---|
| Minotaur | `humanoid-minotaur` | Artillery | Momentum | Gathering Thunder | Stampede | 1451–1460 | Move stacks ATK; charge cashes out. | ✅ `autoApplyState` `move` + `removeOnSkillExecution` |
| Orc | `humanoid-orc` | Generalist | Warchief's Command | Warchief's Banner | Warchief's Mandate | 1461–1470 | Allies +X% to highest base stat. | ✅ `<passiveSourceRule:[alliesNearby, N]>` |
| Bandit | `humanoid-bandit` | Skirmisher | Pocket Sand | Dirty Trick | Blinding Gambit | 1471–1480 | X% blind on attack. | ✅ On-hit blind |
| Cyclops | `humanoid-cyclops` | Vanguard | Thick Skull | Stone Temper | Adamant Mind | 1481–1490 | Immune disable/mute. | ✅ Immunity traits |
| Kobold | `humanoid-kobold` | Cleric | Field Medic | Trail Rations | Battlefield Banquet | 1491–1500 | Mid-arc re-feed; tail rescue. | 🍽 ✅ `<overstuffedImpervious>` |

---

## Family 9: Construct / Arcane (501–550)

| Subgroup | `subgroupKey` | Archetype | **1–3** | **4–9** | **10** | IDs | What it does | Tag recipe |
|---|---|---|---|---|---|---:|---|---|
| Heated Titan | `construct-titan` | Berserker | Unstoppable | Relentless March | Juggernaut | 1501–1510 | KB resist; +ATK per self-debuff. | ✅ KB + `passiveStateCount` |
| Hazard | `construct-hazard` | Artillery | Blast Radius | Blast Front | Ground Zero | 1511–1520 | Larger AoE tiles. | ✅ `<rangeRate>` / `<rangeBuff>` |
| Bot | `construct-bot` | War Priest | Self-Repair Subroutine | Maintenance Cycle | Autonomic Overdrive | 1521–1530 | Auto-heal % MHP on interval. | ✅ Periodic heal |
| Puppet | `construct-puppet` | Wizard | Soul Thread | Soul Bind | Soul Rend | 1531–1540 | Bonus vs debuffed/controlled. | ✅ `perDebuffBuff` + `bonusDamageIfState` |
| Runic Orb | `construct-orb` | Medic | Overcharge | Capacitor Surge | Meltdown | 1541–1550 | Shield break → AoE blast. | ✅ Shield-break explosion |

---

## Family 10: Deity (551–600)

Five subgroup slots (Kaiju sacked — Sin owns the last **two** enemy decades). **10** `SIN_*` panels (not 20); masteries **1581–1590**.

| Slot | Subgroup | `subgroupKey` | Panel prefix | Enemy IDs | Archetype | **1–3** | **4–9** | **10** | Mastery IDs | What it does | Tag recipe |
|---:|---|---|---|---|---|---|---|---|---:|---|---|
| 1 | Elemental | `deity-elemental` | `ELE` | 551–560 | Wizard | Elemental Saturation | Elemental Flux | Elemental Singularity | 1551–1560 | Pierce X% elemental resist. | ✅ `<pierceElement:[…]>` |
| 2 | Aspect | `deity-emotion` | `ASP` | 561–570 | Cleric | Empathic Bond | Empathic Echo | Empathic Nexus | 1561–1570 | Gain X% of ally heals in range. | ✅ `<onAllyHpHealHp:[PCT, R]>` |
| 3 | Sovereign | `deity-devil` | `SOV` | 571–580 | Generalist | Devil's Bargain | Devil's Wager | Devil's Due | 1571–1580 | +X% damage dealt and taken. | ✅ +/- damage % |
| 4 | Sin | `deity-sin` | `SIN` | 581–590 | Multi | — | — | — | 1581–1590 | One panel per sin; one mastery at panel max. | Per sin |
| 5 | Sin Votary | `deity-sin-votary` | — | 591–600 | Multi | — | — | — | 1591–1600 reserved | Helpers respawn; ~1% drop for matching `SIN_*` panel. | No panel strip |

### Sin panels — one panel, one mastery (not three-act)

**`SIN_1`…`SIN_10`** → `deity-sin`, mastery **`1580 + N`**. Bosses are unique; **votary** enemies (591–600) farm the panel. Mastery skill/state **name** is authored separately from the panel dogma title.

| Panel | Mastery ID | Enemy (boss) | Notes |
|---|---:|---:|---|
| `SIN_1` | 1581 | 581 | Gluttony |
| `SIN_2` | 1582 | 582 | Wrath |
| `SIN_3` | 1583 | 583 | Envy |
| `SIN_4` | 1584 | 584 | Pride |
| `SIN_5` | 1585 | 585 | Sloth |
| `SIN_6` | 1586 | 586 | Greed |
| `SIN_7` | 1587 | 587 | Lust |
| `SIN_8`–`SIN_10` | 1588–1590 | 588–590 | Meta / padding — TBD |

**1591–1600:** reserved shells (votary enemy decade; no mastery wiring yet).

---

## Three-act name index (all subgroups)

| Subgroup | 1–3 Beginning | 4–9 Middle | 10 End |
|---|---|---|---|
| Ghosty | Spectral Cascade | Spectral Torrent | Spectral Avalanche |
| Wraith | Ghastly Ward | Pale Bulwark | Wraithwall Eternal |
| Wisp | Blistering Aura | Searing Mantle | Scorched Halo |
| Skeletor | Undying Rage | Graveborn Fury | Deathless Fury |
| Rust Bucket | Hollow Armor | Brittle Bastion | Paper Fortress |
| Snake | Venom Strike | Venom Surge | Venom Deluge |
| Dargin | Dragonheart | Dragonheart Stirring | Dragonheart Aflame |
| Draconite | Stone Scales | Stone Mantle | Granite Bastion |
| Lamia | Focusing Beam | Converging Beam | Coalesced Annihilation |
| Salamander | Elemental Infusion | Elemental Attunement | Primal Conduit |
| Kappa | Trickster's Luck | Trickster's Favor | Trickster's Gambit |
| Frog | Rooted Barrage | Rooted Tempest | Rooted Cataclysm |
| Crimson Vice | Iron Shell | Iron Rebuke | Shellbreaker Retort |
| Fish | Slippery | Swift Current | Slipstream |
| Cephalopod | Ink Shroud | Murky Pall | Abyssal Veil |
| Hard Syrup | Adaptive Slime | Reactive Gel | Elemental Osmosis |
| Roper | Eldritch Fury | Eldritch Tempest | Eldritch Maelstrom |
| Jelly | Mana Transfusion | Mana Weave | Arcane Transfusion |
| Goo Bat | Regeneration Aura | Miasma of Life | Spore Bloom |
| Cube | Living Obstacle | Living Bulwark | Immovable Bulk |
| Wolftrap | Entangling Curse | Thorned Curse | Stranglethorn Curse |
| Fungrowth | Primal Instinct | Primal Surge | Primal Apex |
| Dryad | Nature's Wrath | Nature's Ire | Nature's Judgment |
| Treant | Ironbark | Tempered Ironbark | Ancient Ironbark |
| Flower | Purifying Bloom | Cleansing Petals | Sacred Bloom |
| Bearcat | Void Resonance | Void Chord | Void Harmonics |
| Cave Bat | Cauldron Instinct | Chittering Frenzy | Wingbeat Chorus |
| Garuda | Tailwind | Rising Gust | Gale Force |
| Rot Rat | Resourceful Rodent | Nest Egg | Compound Interest |
| Quadruped | Alpha Presence | Alpha Howl | Pack Sovereignty |
| Needler | Drilling Sting | Hive Puncture | Lance of the Hive |
| Crawler | Spire Network | Spire Synapse | Spire Dominion |
| Brood | Plague Swarm | Endemic Swarm | Pandemic |
| Scorpion | Chitin Barbs | Chitin Lash | Barbed Retribution |
| Parasite | Siphon Aura | Siphon Weave | Cradle of Leech |
| Minotaur | Momentum | Gathering Thunder | Stampede |
| Orc | Warchief's Command | Warchief's Banner | Warchief's Mandate |
| Bandit | Pocket Sand | Dirty Trick | Blinding Gambit |
| Cyclops | Thick Skull | Stone Temper | Adamant Mind |
| Kobold | Field Medic | Trail Rations | Battlefield Banquet |
| Heated Titan | Unstoppable | Relentless March | Juggernaut |
| Hazard | Blast Radius | Blast Front | Ground Zero |
| Bot | Self-Repair Subroutine | Maintenance Cycle | Autonomic Overdrive |
| Puppet | Soul Thread | Soul Bind | Soul Rend |
| Runic Orb | Overcharge | Capacitor Surge | Meltdown |
| Elemental | Elemental Saturation | Elemental Flux | Elemental Singularity |
| Aspect | Empathic Bond | Empathic Echo | Empathic Nexus |
| Sovereign | Devil's Bargain | Devil's Wager | Devil's Due |

**Sin panels (not in three-act index):** one name + one mastery at max — see sin table above.

---

## ID → display name map (authoring)

| Tier digit | Act | Ghosty example ID |
|---:|---|---|
| 1–3 | Beginning | 1101–1103 |
| 4–9 | Middle | 1104–1109 |
| 0 | End | 1110 |

---

## Quick reference: cookbook → mastery

| Hook | Tag pattern |
|---|---|
| Conditional gate | `<passiveSourceRule:[KIND, PARAM]>` |
| Stack scaling | `<passiveStateCount:[FORMULA]>` |
| On crit apply state | `<onCritApply:[STATE, CHANCE]>` |
| Skill history damage | `<skillHistoryBonus:[TYPE, WINDOW, PCT, unique]>` |
| Cast time damage | `<castTimeDamageBonus:N>` |
| Debuff damage amp | `<perDebuffBuff:N>` / `<bonusDamageIfState:[ID, PCT]>` |
| State-type damage amp | `<type:CLASSIFIER>` on state + `<bonusDamageIfStateType:[TYPE, PCT]>` (presence) / `<bonusDamagePerStateType:[TYPE, PCT]>` (count) — see [`implementation-status.md` § State type classifiers](./implementation-status.md#state-type-classifiers--j-base--j-abs-core) |
| AoE size | `<rangeRate:1.X>` / `<rangeBuff:N>` |
| Resist pierce | `<pierceElement:[ELEM, PCT]>` |
| Heal cascade | `<onSelfHpHealMp:[PCT, R]>` / `<onAllyHpHealHp:[PCT, R]>` |
| Viral debuff | `<spread:[…]>` `<viral>` `<spreadSkipAfflicted>` |
| Timed ward | `<autoApplyState:[WARD, time, FRAMES]>` |
| Scheduled aura / hazard | `<autoExecuteSkill:[SKILL, CONDITION, PARAM]>` — see [`implementation-status.md` § Auto-execute skill](./implementation-status.md#auto-execute-skill-auras--j-passive-conditional-next-release-merge-pending) |
| Move momentum | `<autoApplyState:[MOM, move, TILES]>` + `<removeOnSkillExecution:[STYPE, 100]>` |
| Stationary stack counter | `<autoApplyState:[PAYLOAD, stand, FRAMES]>` + `<removeStateOnMove:[PAYLOAD]>` on mastery; `<stackMax:N>` + `<loseAllStacksAtOnce>` on payload |
| Food medic | `<overstuffedImpervious>` |
| Suppress slip/regen popup | `<noHpPopup>` / `<noMpPopup>` / `<noTpPopup>` / `<noSlipPopup>` on state — use on permanent regen states to avoid eternal pop spam |
| Meta rates | `<goldMultiplier:N>` + `gdr`/`dor`/`sdr` |

---

## Reference: Wraith / Ghastly Ward (`undead-reborn`)

**Archetype:** Guardian · **Book** weapon affinity (MMP battery).

**Design origin:** started as an **MP shield**; ward formulas weight **`b.mmp`** heavily (with **`b.mhp`**) so panels, gear, and Book investment produce **chonkier** pulsed shields — not just flat DEF/MDF.

### Two-layer IDs (do not conflate)

| Layer | IDs | What the player sees | Notes |
|---|---|---|---|
| **Mastery passive** | **1111–1120** (skill = state) | Passives menu act names (Ghastly Ward / Pale Bulwark / Wraithwall Eternal) | `<indefiniteState>` + `<autoApplyState:[WARD_ID, time, FRAMES]>` on **this** row |
| **Combat ward** | **1001–1010** | Not shown in Passives (combat/HUD only) | `<shield:[…]>` on **WARD_ID**; optional `<shieldCap:[…]>`, `stackMax`, `shieldProtect` |

Wrapper skill shape unchanged: `<hideFromJabsMenu>` + `<passive:[N]>` on skill **N**; all combat tags live on state **N** (mastery) and ward states **1001–1010**.

### Reapply behavior

`autoApplyState` with condition **`time`** uses the same JABS **`addState`** path as any other application:

- **Uncapped shield:** reapply **refreshes** shield points on the existing ward state.
- **Capped shield** (Pale Bulwark): reapply stacks **current + new** toward **`shieldCap`** (with `stackMax:1`, two refreshes while healthy can approach **double** the base shield formula).

### Authored pulse intervals (CA `States.json`)

| Mastery ID | Panel tier | Act | Pulse (frames) | ~seconds | Applies ward |
|---:|---:|---|---:|---:|---:|
| 1111–1113 | 1–3 | Beginning | 3600 | ~60 | 1001–1003 |
| 1114 | 4 | Middle | 3300 | ~55 | 1004 |
| 1115 | 5 | Middle | 3000 | ~50 | 1005 |
| 1116 | 6 | Middle | 2700 | ~45 | 1006 |
| 1117 | 7 | Middle | 2400 | ~40 | 1007 |
| 1118 | 8 | Middle | 2100 | ~35 | 1008 |
| 1119 | 9 | Middle | 1800 | ~30 | 1009 |
| 1120 | 10 | End | 900 | ~15 | 1010 |

Middle act pulses **accelerate** as tier rises; capstone **900** frames is intentionally aggressive.

### Ward payload sketch (`1001–1010`)

| Ward IDs | Act | Shield | Cap / stack |
|---:|---|---|---|
| 1001–1003 | Beginning | `(b.mhp×5–15%) + (b.mmp×10–30%)` | `stackMax:1` |
| 1004–1009 | Middle | ramping shield + **`shieldCap` at 2×** shield formula | `stackMax:1` |
| 1010 | End | `(b.mhp×100%) + (b.mmp×200%)` | **`stackMax:3`**, **`shieldProtect`** |

**Optional orthogonal layer:** **`J-ABS-Shield`** MP-before-HP on a separate state/notetag — not required for the pulsed ward loop.

### Passives menu prose (future)

Like Ghosty **`skillHistoryBonus`**, timed wards may get generated detail text from **`autoApplyState`** (interval + ward name). Template TBD; descriptions on mastery rows remain empty for now.

Tag shape for authoring: `<autoApplyState:[WARD_ID, time, FRAMES]>`.

---

## Reference: Snake / Venom ladder (`reptile-snake`)

**Policy:** each mastery tier applies **only its current venom** on crit (no dogpile). Rank up → swap to a stronger payload. Tuning = one row, one knob (`stackMax`, formula, duration, or Strike proc %).

**Payload band:** **1021–1030** (combat debuffs, `hideFromPassiveList`, poison icon **2166**).

| Payload ID | Name | Act | Model | stackMax | Mastery |
|---:|---|---|---:|---|
| 1021 | Sting | Strike | extend | — | 1151 (50% proc) |
| 1022 | Bite | Strike | extend | — | 1152 (75%) |
| 1023 | Fang | Strike | extend | — | 1153 (100%) |
| 1024 | Coil | Surge | stack | 1 | 1154 |
| 1025 | Asp | Surge | stack | 2 | 1155 |
| 1026 | Mamba | Surge | stack | 3 | 1156 |
| 1027 | Naga | Surge | stack | 4 | 1157 |
| 1028 | Viper | Surge | stack | 5 | 1158 |
| 1029 | Neuro | Surge | stack | 6 | 1159 |
| 1030 | Deluge | Deluge | extend + `%MHP` slip | — | 1160 |

**Mastery tag shape:** `<indefiniteState>` + single `<onCritApply:[PAYLOAD_ID, CHANCE]>`.

**1030 Deluge** — capstone: `hpFormula` current + missing HP, `<hpPercent:6>`, extend refresh.

---

## Implementation order

**Infrastructure (done):** align panels · sort config · scaffold **1101–1600** shells · panel `masterySkillId` wiring.

**Content pass (sequential):** one subgroup → author tags/traits → in-map playtest → mark ✅ in [progress table](#authoring-progress-one-subgroup-at-a-time). Do not rely on the Tag recipe ✅ column for “done.”

**Current strip:** see progress table (`reptile-draconite` / Draconite **1171–1180**).

### Tooling (`chef-adventure/tools/`)

| Script | Purpose |
|---|---|
| `rewrite-sdp-unlock-prefix.mjs` | Flip Map357 Unlock/Lock SDP panel prefix (`--from DRG --to DCO --map 357 --event 1 --apply`) |
| `sdp-family-registry.mjs` | Shared family/subgroup map + ID helpers |
| `align-sdp-panel-mastery.mjs` | Wire `subgroupKey` / `masterySkillId` on panels |
| `normalize-sdp-progression.mjs` | Apply canonical `rarity` + `maxRank` to all subgroup strips (skip Sin / TUT / ENC / FGT) |
| `scaffold-mastery-skills-states.mjs` | Bulk skill/state shells from cheatsheet names |
| `migrate-deity-family-order.mjs` | One-shot deity enemy decade reorder |
| `sort-sdp-panels-by-mastery.mjs` | Panel sort (lives in `rmmz-plugins/project/tools/`) |

---

## Related docs

- [`archetype-mapping.md`](./archetype-mapping.md)  
- [`implementation-status.md`](./implementation-status.md)  
- [`work-items.md`](./work-items.md)  
- [`../database-decode-cheatsheet.md`](../database-decode-cheatsheet.md) — trait codes, param ids, `decode-db-trait.mjs` CLI
- [`panel-parameters-cheatsheet.md`](./panel-parameters-cheatsheet.md) — P4-1 panel stat rows, shared `perRank` rules
