# Weapon skill lots — 10-row schema (planning)

> **Purpose:** One **contiguous** skill block per weapon subgroup — actions + prof extends in one place. Plan the full map **first**, migrate **once** (data + weapons + prof keys + saves strategy TBD).
>
> Parent: [`families.md`](./families.md) · Per-subgroup detail: [`families/<family>/<subgroup>.md`](./families/blade/1h.md)
>
> Last updated: **2026-06-04**

---

## Blade family (planning **complete**)

| IDs | Lot | Rows 1–5 | Rows 6–10 |
|---|---|---|---|
| **1–10** | [**sharp**](#blade-1h--lot-sharp-ids-110-when-migrated) | 3 main + 2 offchain | 5 prof (bleed / sweep) |
| **11–20** | [**beast**](#blade-2h--lot-beast-ids-1120-when-migrated) | 3 main + 2 offchain (stun → charge Melter) | 5 prof (stun lord) |
| **21–30** | [**twist**](#blade-dual--lot-twist-ids-2130-when-migrated) | **4 main only** (no offchain) | 5 prof (rows **5–10**) |

Subgroup docs: [`families/blade/`](./families/blade.md).

## Spear family (planning **complete**)

| IDs | Lot | Rows 1–5 | Rows 6–10 |
|---|---|---|---|
| **31–40** | [**pierce**](#spear-stab--lot-pierce-ids-3140-when-migrated) | 3 main (cycle) + pin → dive star | 5 prof |
| **41–50** | [**mortar**](#spear-basher--lot-mortar-ids-4150-when-migrated) | **4 main** + 1 offchain (circle) | 5 prof |
| **51–60** | [**rend**](#spear-javelin--lot-rend-ids-5160-when-migrated) | **2 main** (`freeCombo`) + RIP off | 7 prof (rows **4–10**) |

Subgroup docs: [`families/spear/`](./families/spear.md).

## Gun family (planning **complete**)

| IDs | Lot | Rows 1–5 | Rows 6–10 |
|---|---|---|---|
| **61–70** | [**gunfu**](#gun-pistol--lot-gunfu-ids-6170-when-migrated) | 3 main + offchain A/B (TP) | 5 prof |
| **71–80** | [**conduit**](#gun-taser--lot-conduit-ids-7180-when-migrated) | 3 main (pin→mash) + 1 nuke off | 6 prof (rows **5–10**) |
| **81–90** | [**boomstick**](#gun-shotgun--lot-boomstick-ids-8190-when-migrated) | **2 main** (`freeCombo`) + reload off | 7 prof (rows **4–10**) |

Subgroup docs: [`families/gun/`](./families/gun.md).

## Axe family (**complete**)

| IDs | Doc | Rows 1–5 | Rows 6–10 |
|---|---|---|---|
| **91–100** | [**1H hatchet**](#axe-1h-hatchet--lot-buffer-ids-91100-when-migrated) | 3 main + charge → follow-up off | 5 prof |
| **101–110** | [**2H battleaxe**](#axe-2h-battleaxe--lot-cleave-ids-101110-when-migrated) | **5 main** (no offchain) | 5 prof |
| **111–120** | [**breaker**](#axe-breaker--ids-111120-when-migrated) | **4 main** + **SHATTER** off | 5 prof |

Subgroup docs: [`families/axe/`](./families/axe.md).

## Wand family (planning **complete**)

| IDs | Lot | Rows 1–5 | Rows 6–10 |
|---|---|---|---|
| **121–130** | [**aura**](#wand-2h-staff--lot-aura-ids-121130-when-migrated) | **3 main** (`freeCombo` spray) + **1 charge→aura off** | 6 prof (rows **5–10**) |
| **131–140** | [**saturation**](#wand-1h--lot-saturation-ids-131140-when-migrated) | **3 main** (`freeCombo` bolt) + **Saturation off** | 6 prof (rows **5–10**) |
| **141–150** | [**lexicon**](#wand-tome--lot-lexicon-ids-141150-when-migrated) | **2 main** (`direct`) + **cast-tempo off** | 7 prof (rows **4–10**) |

Subgroup docs: [`families/wand/`](./families/wand.md).

## Fist family (planning **complete**)

| IDs | Lot | Rows 1–5 | Rows 6–10 |
|---|---|---|---|
| **151–160** | [**flow**](#fist-glove--lot-flow-ids-151160-when-migrated) | **L1–L3** + **R1–R3** (6 action) | 4 prof (rows **7–10**) |
| **161–170** | [**gore**](#fist-claw--lot-gore-ids-161170-when-migrated) | 3 main (connect bleed) + **pounce** / **360°** off | 5 prof (Bloodthirst → Gambit) |
| **171–180** | [**dirty**](#fist-arm--lot-dirty-ids-171180-when-migrated) | 3 main + **offchain A/B** (**Grab Ready!**) | 5 prof |

Subgroup docs: [`families/fist/`](./families/fist.md).

---

## Row schema (every subgroup)

| Row | Role | Typical content |
|---|---|---|
| **1–3** | **Main chain** | Fast/normal combo — `<skillId>` starter is row **1**; terminal on row **3** |
| **4–5** | **Secondary chain** | `<offhandSkillId>` starter is row **4**; row **5** finisher — own CD policy per subgroup |
| **6–10** | **Prof extends** | `hideFromJabsMenu` + `skillExtend:[…]` — learned via `config.proficiency.json` |

**Prof unlock order (global):** for every weapon subgroup, **prof rows unlock in numeric row order** — row **6** before **7** before **8**, etc. (first prof row may be **4**, **5**, or **6** depending on lot layout; sequence always follows **ascending row number**). The row table order **is** the kit level-up path — not shuffled extends.

**Charge semantics (global):** **charge skills execute on button release** — not channeling. Nothing runs “while you hold” except **guard** and **dash**. Any “charge skill” in lot docs = **hold → release → X**.

**Not fixed across subgroups:** which prof rows buff **only secondary** (rows 4–5) vs **whole kit** (rows 1–5) vs **main only** — author per identity. 1H **sharp** is a reference blend.

**Dual exception:** rows **1–4** are **one main chain** (no separate offchain); rows **5–10** are prof only. Runtime: **dual-wield** = two buttons, **same** chain + **one** prof track — see [`families/blade/dual.md`](./families/blade/dual.md).

**Stab exception:** row **3** combos into row **1** on **connect** (cycle `1→2→3→1…`). **No `<freeCombo>`** on melee spear mains. Row **4** (pin) requires **connect** before row **5** unlocks — see [`families/spear/stab.md`](./families/spear/stab.md).

**Basher exception:** rows **1–4** are **one main chain** (connect combo, ends at row **4**); row **5** is the **only** secondary skill (~8s circle). **MAT + MP** — see [`families/spear/basher.md`](./families/spear/basher.md).

**Javelin exception:** rows **1–2** are **`freeCombo` throws** (stack ledger); row **3** is **RIP** only (no rows 4–5 offchain). **Seven prof rows (4–10)** — see [`families/spear/javelin.md`](./families/spear/javelin.md).

**Taser exception:** rows **1–3** connect chain (pin→flip→mash); row **4** offchain nuke **not** on chain — see [`families/gun/taser.md`](./families/gun/taser.md).

**Shotgun exception:** rows **1–2** **`freeCombo`** spread; row **3** **reload** only (shell stacks buff **main presses**). **Seven prof rows (4–10)** — see [`families/gun/shotgun.md`](./families/gun/shotgun.md).

**Battleaxe exception:** rows **1–5** are **one connect main chain** (no offchain); rows **6–10** prof only — see [`families/axe/battleaxe.md`](./families/axe/battleaxe.md).

**Breaker exception:** rows **1–4** connect main (**LLRL**); row **5** offchain **SHATTER** only; rows **6–10** prof — see [`families/axe/breaker.md`](./families/axe/breaker.md).

**Staff exception:** rows **1–3** **`freeCombo`** mid-range **spray(3)**; row **4** **charge→aura** offchain (on release); rows **5–10** prof — see [`families/wand/staff.md`](./families/wand/staff.md).

**Wand family (direction):** all three subgroups use **`<freeCombo>`** on ranged mains. **Staff** = spray + aura · **1H wand** = bolts + **Saturation** · **Tome** = **`<direct>`** + **cast-tempo offhand** (tap fast / charge slow for Artillery).

**1H wand exception:** rows **1–3** **`freeCombo`** single bolt; row **4** **Saturation** (**+25% MAT** per stack, stacks fall); rows **5–10** prof — see [`families/wand/1h.md`](./families/wand/1h.md).

**Tome exception:** rows **1–2** **`<direct>`** mains; row **3** cast-tempo offhand (tap **−50%** cast / charge tiers on prof **6**/**10**); rows **4–10** prof — see [`families/wand/tome.md`](./families/wand/tome.md).

**Arm exception:** rows **1–3** slow **connect** slams; rows **4–5** **offchainA/B** — **`skillTransform`** while **Grab Ready!** (**~1s** per main hit); prof **10** **Violation Ready!** tier — see [`families/fist/arm.md`](./families/fist/arm.md).

**Glove exception:** rows **1–3** **left** + **4–6** **right** — cross **L-boost** / **R-boost**; **L3** / **R3** **Flow** recurse **independently**; prof **7–10** — see [`families/fist/glove.md`](./families/fist/glove.md).

**Claw exception:** rows **1–3** **connect** bleed rakes (**no `<freeCombo>`**); row **4** **`freeCombo` pounce** gap-close; row **5** **360°** circle; prof **10** **Bloodgambit** spends **Bloodthirst** on circle — see [`families/fist/claw.md`](./families/fist/claw.md).

**Fist family (direction):** **fighting-game** grammar — **glove** L/R weave, **claw** bleed stack → circle spend, **arm** **Ready → special** (pistol **gunfu** parallel).

**Gun family (direction):** subgroup defines main/off split — **gunfu** (melee→ammo), **conduit** (pin→mash + nuke), **boomstick** (spread + **load to clap**). Only **boomstick** uses **`<freeCombo>`** on gun mains.

**Spear family (direction):** **no passive crit identity** on baseline spear skills — crit and spike payoffs live on prof / conditional offchain where authored. **Melee lots (pierce, mortar): no `<freeCombo>`.** **Javelin (rend)** uses **`<freeCombo>`** on main throws only.

---

## Proficiency wiring (runtime)

The prof system supports **main skill + subskills**: cumulative counters can include all rows that belong to a subgroup kit.

**Direction (Jeremy):**

- **Unlock sequence:** prof rows in each lot unlock in **strict numeric row order** (see row schema above). `config.proficiency.json` **JR-*` thresholds** must respect that sequence.
- **Whole-kit prof rows** (e.g. extend all five action skills) — count hits from **any** of rows 1–5 toward unlock.
- **Secondary-focused prof rows** — may count **only** rows 4–5 (offchain usage) so the grind matches the fantasy.

Exact `JR-*` keys and thresholds: per subgroup at migration time.

---

## ID map (target — **planning only**)

**18 subgroups × 10 rows = 180 skills** in one weapon band.

| IDs | Subgroup | Theme (draft) |
|---|---|---|
| 1–10 | Blade 1H | **sharp** |
| 11–20 | Blade 2H | **beast** (mouse → lotus prof names) |
| 21–30 | Blade dual | **twist** |
| 31–40 | Spear stab | **pierce** |
| 41–50 | Spear basher | **mortar** |
| 51–60 | Spear javelin | **rend** |
| 61–70 | Gun pistol | **gunfu** |
| 71–80 | Gun taser | **conduit** |
| 81–90 | Gun shotgun | **boomstick** |
| 91–100 | Axe 1H hatchet | **buffer** |
| 101–110 | Axe 2H battleaxe | **cleave** |
| 111–120 | Axe breaker | **breaker** |
| 121–130 | Wand 2H staff | **aura** |
| 131–140 | Wand 1H | **saturation** |
| 141–150 | Wand tome | **lexicon** |
| 151–160 | Fist glove | **flow** |
| 161–170 | Fist claw | **gore** |
| 171–180 | Fist arm | **dirty** |

**Collision note:** today's Jerald kit (**101–144**), guard, mobility, etc. **overlap** this plan. Migration must **relocate non-weapon bands** (e.g. character kit → **201+** or **401+**) in the **same** pass — do not carve 1–180 until the full map is agreed.

---

## Fighting-game framing (main vs secondary)

- **Main (1–3):** light/normal string — swift hit CD rhythm.
- **Secondary (4–5):** heavier/special — often wider, stronger, **longer CD** on the chain (1H: ~5s+ on the sweep).

Player-facing: **main hit** / **secondary hit**; notetags may still use `<offhandSkillId>`.

---

## Blade 1H — lot **sharp** (IDs **1–10** when migrated)

### Action rows

| Row | Slot | Name (draft) | Job |
|---|---|---|---|
| 1 | mainchain1 | **Rough Chop** | Small arc (~100°) |
| 2 | mainchain2 | **Prime Selection** | Medium arc (~120°) |
| 3 | mainchain3 | **Wicked Cut** | Main finisher (~120°) — **chain ends** |
| 4 | offchain1 | **Table Clearer** | Broad arc (~210°) — secondary starter |
| 5 | offchain2 | **360 Garnish** | Full circle — secondary finisher |

**CD tone:** main rows stay relatively swift; secondary chain carries a **hard ~5s+ CD** on access (effort / recovery — same sharp sword, big swings cost breath).

**Removed from 1H:** charge tier + **Endless Mince** release (old Sous Chef row). Burst/coverage lives on secondary, not hold-to-release on main.

### Prof rows (extends)

| Row | Name (draft) | Effect |
|---|---|---|
| 6 | **Vigorous Sword** | All five action skills: **+2 TP per hit** |
| 7 | **Flexible Sword** | Offchain (4–5): **increased range** |
| 8 | **Sharp Sword** | All five: **10% bleed** on hit |
| 9 | **Mirage Sword** | Offchain (4–5): **hits twice each** |
| 10 | **Ruthless Sword** | **Bonus damage vs bleeding** targets |

**Prof focus:** mix of whole-kit (6, 8, 10) and offchain-only (7, 9). Rows 8 → 10 synergize.

---

## Blade 2H — lot **beast** (IDs **11–20** when migrated)

**Identity:** **Stun lord** — wide cleave on main; secondary = narrow long stun → charge execute. Not everything can be stunned; main cleave stays relevant on stun-immune targets.

### Action rows

| Row | Slot | Name (draft) | Job |
|---|---|---|---|
| 1 | mainchain1 | **Primal Carve** | Big arc (~210°) |
| 2 | mainchain2 | **Cleaver Swing** | Big arc (~240°) |
| 3 | mainchain3 | **Culling Crescent** | Very big arc (~270°) — **main chain ends** |
| 4 | offchain1 | **Meat Tenderizer** | Narrow arc (~90°), relatively long reach — **long stun** on connect |
| 5 | offchain2 | **Fat Melter** | Big half-circle (~180°) — **charge release from row 4** |

**Tempo / CD:**

- Main rows: slow like today's 2H kit (no 1H-style hard 5s secondary gate).
- Row 4: slow swing; not strict 5s CD on access.
- **Charge (row 4 → 5):** hold input to charge; **does not require landing row 4**. Release = Fat Melter. **Charge track has its own multi-second cooldown** (self-limiting).
- **Stun immunity:** many targets cannot be stunned — identity is conditional, not deleted.

**Fat Melter (row 5):**

- **Without stun:** ~**5×** multiplier still fires but is a **dud** relative to cost/charge CD — player should stun first.
- **With stun:** full execute payoff (see prof row 9 for stacked bonuses).

**Charge removed from main** (old skill 9 `chargeTier`). Charge lives on **offchain only** — unlike 1H **sharp**.

### Prof rows (extends)

| Row | Name (draft) | Effect |
|---|---|---|
| 6 | **Blade of the Mouse** | **Leaning:** **mainchain (1–3) more damage** — early prof that still helps vs **stun-immune** targets. *Was drafted as mainchain3 shorter CD; open to flat damage, wider main CD shave, or other modest row-6 buff.* |
| 7 | **Blade of the Elephant** | Mainchain3 may apply **stun (25%)** |
| 8 | **Blade of the Tiger** | Offchain2 (**Fat Melter**): **guaranteed crit** |
| 9 | **Blade of the Dragon** | All **five** action skills: **2× damage vs stunned** ("destroy" = tons of damage, not instant death). Offchain2 still **more** than the universal stunned bonus (stacks with Melter's own multiplier). |
| 10 | **Blade of the Lotus** | Offchain2 **no cooldown** — **charge cooldown remains**. Still **conditional** (weak unless target is stunned). Capstone buff, not autopilot. |

**Prof focus:** stun → execute ladder (rows 7–10); row **6** deliberately **modest** and **main-leaning** so the subgroup is not dead on stun-immune content.

**Loop (base):** cleave on main → Tenderizer when stun matters → charge Melter on stunned target for execute. Prof escalates stun uptime and execute damage.

---

## Blade dual — lot **twist** (IDs **21–30** when migrated)

**Identity:** **Dual-wield is the weapon** — two buttons, **one** skill chain, **one** prof track. Not `<offhandSkillId>` on a single weapon; equip **two** blades, both use row **1** starter. **Charge removed** (old Twist Garnish → Centrifugal Blender).

### Action rows (rows 1–4 only — no offchain)

| Row | Slot | Name (draft) | Job |
|---|---|---|---|
| 1 | mainchain1 | *TBD* | ~**0.9** tile reach, wide arc (~180°) |
| 2 | mainchain2 | *TBD* | ~0.9 tile, wider arc (~210°) |
| 3 | mainchain3 | *TBD* | ~0.9 tile, wider arc (~240°) |
| 4 | mainchain4 | *TBD* | ~0.9 tile **circle** — chain ends |

Arcs **widen** through the string; row 4 replaces old charge-spin finisher with a **circle** on the same chain.

**Runtime:** main and secondary buttons both run this chain on **independent cooldowns** — blender = **overlap**, not two different skill lists.

**Prof counting:** all hits on rows **1–4** feed **one** subgroup prof pool (either button).

### Prof rows (extends — rows 5–10)

| Row | Name (draft) | Effect |
|---|---|---|
| 5 | **Twist of Momentum** | **+15% move speed** (self) |
| 6 | **Twist of Gemini** | All mainchains (1–4): **hit once more** (**2×** total per swing) |
| 7 | **Twist of Fates** | Mainchain4: **guaranteed crit** |
| 8 | **Twist of Spatia** | All mainchains: **+50% radius** |
| 9 | **Twist of Stiletto** | Formula rewrite on all mainchains (1–4): add **`b.mhp*0.01`** per hit — chip vs high-DEF / bosses, not instant death |
| 10 | **Twist of Trine** | All mainchains: **hit once more again** (**3×** total per swing) |

**Stiletto example:**

```text
before: (a.atk*2 - b.def*1)
after:  ((a.atk*2 + b.mhp*0.01) - b.def*1)
```

**Range:** base proximity ~**0.9** tiles; Spatia (+50% radius) ≈ **1.45** tiles — still shorter than 1H / 2H.

**Balance watch:** Trine + full chain + two button overlap → **~20–25% max HP** on one target in a burst — tune in playtest.

**Prof focus:** almost entirely **whole-kit** (rows 5–10). Fantasy escalates via **hit count**, **coverage**, **speed**, then **formula chip** — not a second button verb.

**Stacking note:** Gemini (2×) then Trine (3×) — implement via `bonus-hits` / extend ladder; row 10 must land at **3× total**, not stack to 4×.

**Row 5 early:** move speed supports blender uptime before damage spikes.

---

## Spear stab — lot **pierce** (IDs **31–40** when migrated)

**Identity:** **Conventional thrust** — cyclic **line** main (**connect** combo); secondary = **pin** (skillshot) → **gap-close + cross** starburst at mark. **No baseline crit** on the lot; crit and coverage come from prof.

### Action rows

| Row | Slot | Hitbox (draft) | Job |
|---|---|---|---|
| 1 | mainchain1 | Line **proximity 2.5**, thickness **0.3** | Mid thin thrust — starter |
| 2 | mainchain2 | Line **2.8**, **0.5** | Longer, wider |
| 3 | mainchain3 | Line **3.0**, **0.7** | Longer still — **combos to row 1** (cycle) |
| 4 | offchain1 | Pin, range **~10** | Ranged mark; **~12s CD**; **connect required** to unlock row 5 |
| 5 | offchain2 | Cross at mark **3.5**, **0.3** | Gap-close + **4-dir star** at pinned target |

**Main:** **connect** combo — row **3** → row **1** on hit. **No `<freeCombo>`**.

**Offchain:** pin must **connect** before row **5** (jump / dive) is available.

**Removed / avoided:** legacy charge release; family-wide **stacked crit chance** on every jab.

**Weapon tags (migration):** `<skillId:31>` row 1; `<offhandSkillId:34>` row 4 pin starter.

### Prof rows (extends)

| Row | Name (draft) | Effect |
|---|---|---|
| 6 | **Heart-throb** | Mainchain3: **guaranteed crit** on any targets struck |
| 7 | **Star-struck** | Offchain2: upgrades to **nova (8-dir)**; larger zone **4.5**, **0.5** |
| 8 | **Clear-eyed** | Mainchain3: **line → narrow arc** (~**45°**, ~**4** reach) before loop |
| 9 | **Speed-demon** | Offchain1: **−33% CD** (~**8s**) |
| 10 | **Wall-breaker** | Offchain2 + mainchain3: apply **slow** and **reduce defenses** |

**Prof focus:** mainchain3 is the **hinge** (rows 6, 8, 10); offchain dive (rows 7, 9, 10). Row **7** escalates star geometry; row **10** links dive payoff to the next cycle.

**Loop (base):** `1→2→3→1` in melee; on CD, pin → dive star on a marked target; prof deepens crit hinge, nova dive, arc finisher, pin cadence, debuffs.

---

## Spear basher — lot **mortar** (IDs **41–50** when migrated)

**Identity:** **War staff / MAT spear** — wide **line + arc** main; secondary = **circle** room tool. Supports **caster archetypes** (MAT, MP sustain/spend) so magic-lean builds are not locked to wand/tome only. **Not ATK-primary.**

### Action rows

| Row | Slot | Hitbox (draft) | Job |
|---|---|---|---|
| 1 | mainchain1 | Line **2.5**, **0.5** | Mid wide line — starter |
| 2 | mainchain2 | Line **2.5**, **0.7** | Mid, slightly wider |
| 3 | mainchain3 | Arc **~150°**, **1.5** | Short wide arc — pivot |
| 4 | mainchain4 | Line **2.5**, **1.5** | Mid, rather wide — **main chain ends** |
| 5 | offchain1 | **Circle**, radius **~4** | Secondary — **~8s CD** |

**Main:** **connect** combo `1→2→3→4` (no loop to row 1). **No `<freeCombo>`**.

**Offchain:** single row **5** — no row 5→6 offchain pair. Charge releases are **prof extends** on row 5 (rows 8, 10).

**Removed / avoided:** legacy **ATK+AGI** crit-forward basher formulas; treating basher as “fast wide stab.”

**Weapon tags (migration):** `<skillId:41>` row 1; `<offhandSkillId:45>` row 5.

### Prof rows (extends)

| Row | Name (draft) | Effect |
|---|---|---|
| 6 | **Plausible deniability** | Offchain1: **disarm** on hit (no weapon skills / basic attacks) |
| 7 | **Magic touch** | Mainchain (1–4): each hit recovers a **small amount of MP** |
| 8 | **Energy release** | Offchain1: **charge tier 1** → **magic wave** (costs **MP**) |
| 9 | **Implausible deniability** | Offchain1: **mute** on hit (no non-weapon skills — spells, combat skills) |
| 10 | **Cosmic release** | Offchain1: **charge tier 2** → **crippling wave** (costs **MP**) |

**Prof focus:** row **7** sustains **8** / **10**; rows **6** / **9** are **denial** branches on the same circle; capstone **10** is the heavy charged payoff.

**Loop (base):** wide main in melee; on CD, circle for space/control; prof adds MP loop, disarm or mute, then charged waves.

**Archetype note:** intentional **non-ATK** weapon subgroup — pairs with SDP caster panels without requiring staff/tome equip.

---

## Spear javelin — lot **rend** (IDs **51–60** when migrated)

**Identity:** **Throwy spear** — main loop is **`freeCombo` stack pressure** (Kalista-adjacent ledger), not a 1-2-3 throw string. Offchain = **RIP** (rend stacks for scaling damage). **No baseline slayer typing** on skills (legacy filler removed).

### Stack state (baseline)

| Rule | Value |
|---|---|
| **On main hit** | **+1 stack**; **refresh** decay (hit adds one and resets the clock) |
| **Cap** | **10** stacks (until prof **Limitless**) |
| **Decay (idle)** | Stacks drop **one at a time** — **~3s** per stack |

### Action rows

| Row | Slot | Hitbox (draft) | Job |
|---|---|---|---|
| 1 | mainchain1 | Line **8**, **0.2** | Thin throw — **+1 stack** |
| 2 | mainchain2 | Line **8**, **0.2** | Faster throw — **+1 stack** |
| 3 | offchain1 | **RIP** — **direct**, **~4** reach | Nearest **stacked** target; **25% damage per stack** removed; clears **all** stacks |

**Main:** `<freeCombo>` on rows **1–2** — `1↔2` on tempo.

**Offchain:** single row **3** — high **CD** (tune at migration). Player stacks at **~8** range, commits into **~4** for RIP.

**Removed / avoided:** legacy two-throw + charge nuke as whole identity; **crit on every throw**; skill-level **anti-aquatic/beast/flying** (prof kit is stack/RIP depth instead).

**Weapon tags (migration):** `<skillId:51>` row 1; `<offhandSkillId:53>` row 3.

### Prof rows (extends — rows 4–10)

| Row | Name (draft) | Effect |
|---|---|---|
| 4 | **RIP of Endurance** | Per-stack decay **~3s → ~6s** (one-at-a-time model) |
| 5 | **Flight of the RIP** | Mainchains: **+25% projectile duration** (**8 → ~10** range) |
| 6 | **RIP of the Limitless** | **No stack cap**; on decay failure **all stacks drop at once** |
| 7 | **Persevering RIP** | RIP removes **half** of stacks only |
| 8 | **RIP of duality** | Mainchains throw **two spears** at once |
| 9 | **Chain RIP** | RIP splashes (**~3** radius); hits on other **stacked** targets **chain** (hop cap at migration) |
| 10 | **RIP of penetration** | Mainchains **pierce** — **+1 stack per enemy** struck |

**Prof focus:** decay window → range → cap mode → partial rip → stack rate → pack detonation → lane stacks.

**Loop (base):** `freeCombo` throws to build/refresh stacks → step in → **RIP** → repeat; prof escalates pressure, payoff geometry, and stack rules.

---

## Gun pistol — lot **gunfu** (IDs **61–70** when migrated)

**Identity:** **Hybrid gun-fu** — short **connect** melee string banks **Gun-fu** stacks; offhand spends **5 TP** per shot. With **≥1** stack, **offchainA → offchainB** (strong shot); **each B fire consumes 1 stack**. Baseline **2** strong shots per full combo; prof raises cap to **4**.

**Runtime state:** **Gun-fu** (`\State[43]` today) — `skillTransform:[offchainA, offchainB]`, stacking. **Flowing Service** (legacy prof) → **mainchain3 base** (+1 stack on finisher connect).

### Action rows

| Row | Slot | Job |
|---|---|---|
| 1 | mainchain1 | Short-range melee — starter |
| 2 | mainchain2 | Short-range melee |
| 3 | mainchain3 | Finisher — on connect: **+1 Gun-fu** stack |
| 4 | offchainA | Standard long-range shot — **5 TP** |
| 5 | offchainB | Empowered shot while **Gun-fu ≥ 1** — **5 TP**, **−1 stack** on use |

**Main:** **connect** combo `1→2→3` — **no `<freeCombo>`** (must land string to earn ammo).

**Offchain:** row **4** is `<offhandSkillId>` starter; transforms to row **5** while stacked.

### Prof rows (extends)

| Row | Name (draft) | Effect |
|---|---|---|
| 6 | **Snap Crackle Pop** | All mainchains: **+3 TP** per hit |
| 7 | **PoooooOOOoooP** | OffchainA + offchainB: **pierce** |
| 8 | **pop Pop PoP POP** | **Gun-fu stackMax 2 → 4** |
| 9 | **KaPop** | OffchainB: **proficiency (`p`) scaling** in formula |
| 10 | **Death Star** | OffchainB: **charge tier** → massive long-range laser (**`p`** on release) |

**Prof focus:** TP fuel (6) → shot geometry (7) → ammo capacity (8) → B scaling (9) → charge capstone (10).

**Loop (base):** melee `1→2→3` → bank stacks → **pop** strong TP shots until empty → repeat.

**Weapon tags (migration):** `<skillId:61>` row 1; `<offhandSkillId:64>` row 4.

---

## Gun taser — lot **conduit** (IDs **71–80** when migrated)

**Identity:** **Pin → flip → mash** on main (**MAT + LUK**); **offhand nuke** is independent. Row **3** uses **`thisSkillHistoryBonus`** (additive **+5%/hit**, rolling **~6s**) — not legacy **Tased** stack ramp on mash. **Connect-only** chain — no `<freeCombo>`.

### Action rows

| Row | Slot | Job |
|---|---|---|
| 1 | mainchain1 | Mid-range **pin** — single target (~**4** reach) |
| 2 | mainchain2 | **Flip the switch** — same target after pin connects |
| 3 | mainchain3 | **Mash frenzy** — after row **2**; history ramp; **no TP gain** |
| 4 | offchain1 | **Long-range nuke** — **not** on main chain |

**Main gates:** **1→2→3** all require **connect** — no mash without full setup.

**Mash loop:** keep pressing row **3** or lose combo/history; **no** escalating TP cost on mash (legacy-style stamina = **stop mashing**).

**Offchain:** standalone blast — tune CD/TP at migration.

### Prof rows (extends — rows **5–10**)

| Row | Name (draft) | Effect |
|---|---|---|
| 5 | **Lethal Conduit** | Mainchain3 + offchain1: **+1 hit** each |
| 6 | **Sizzling Static** | Offchain1: **100% paralyze** |
| 7 | **Rising Amperage** | Mainchain3: **+15%/hit** in window (was **+5%**) |
| 8 | **Extension Cord** | All mainchains: range **4 → 6** |
| 9 | **Big Ass Battery** | Mainchain3: rolling window **6s → 10s** |
| 10 | **Tesla Coiling** | Mainchain3: **`p`** scaling in formula |

**Prof focus:** hit count → nuke CC → mash damage rate → reach → fry duration → capstone scaling.

**Loop (base):** pin → flip → mash until history peaks or target dies → offhand nuke when appropriate (separate CD).

**Weapon tags (migration):** `<skillId:71>` row 1; `<offhandSkillId:74>` row 4.

---

## Gun shotgun — lot **boomstick** (IDs **81–90** when migrated)

**Identity:** **Load to clap** — **`freeCombo`** wide spread on main; **bleed baseline** (not prof-gated); offhand **reloads shells** that buff **main button presses** (**+50% damage**, **1 shell per press**). **LUK** lean.

### Action rows

| Row | Slot | Hitbox (draft) | Job |
|---|---|---|---|
| 1 | mainchain1 | Arc **140°**, **3.2** radius | **50% bleed** |
| 2 | mainchain2 | Arc **140°**, **3.2** radius | **50% bleed** + **1 tile knockback** |
| 3 | offchain1 | **Reload** | **+2 shell** stacks (buff next main **presses**) |

**Main:** `<freeCombo>` on rows **1–2**. **~2s** main combo CD baseline; prof **Quickshot** → **~1s**.

**Shells:** while stacked, each **main press** consumes **1 shell** for **+50% damage** on that shot (not per pellet/hit).

**Offchain:** row **3** reload — tune reload CD at migration. **No** separate ammo-equip system in base kit.

### Prof rows (extends — rows **4–10**)

| Row | Name (draft) | Effect |
|---|---|---|
| 4 | **Rustshot** | Mainchains: **+100% damage vs bleeding** |
| 5 | **Messyshot** | Mainchains: **+2 bleed stacks** on apply |
| 6 | **Bountyshot** | Reload: **2 → 4** shell stacks |
| 7 | **Slingshot** | Mainchain2 knockback **1 → 2** tiles |
| 8 | **Hustleshot** | Reload: **+25% move speed** (short) |
| 9 | **Quickshot** | Main combo CD **2s → 1s** |
| 10 | **Splattershot** | Mainchains: **1 → 3** hits per shot |

**Prof focus:** bleed punish → bleed stacks → shell capacity → shove → reload mobility → tempo → pellet count.

**Loop (base):** `freeCombo` bleed spread → **reload** → shell-buffed **clap** presses → wait on main CD → repeat.

**Weapon tags (migration):** `<skillId:81>` row 1; `<offhandSkillId:83>` row 3.

---

## Axe 1H hatchet — lot **buffer** (IDs **91–100** when migrated)

**Identity:** **Slow face-tank chopper** — heavy **connect** main; offchain = **charge → follow-up** (connect on release). **Buffers** on **execution**, not charge wind-up. **No poison on skills** (gear may still poison). Contrast **2H** fast chain.

### Action rows

| Row | Slot | Hitbox (draft) | Job |
|---|---|---|---|
| 1 | mainchain1 | Arc **135°**, **2.5** | Regular chop |
| 2 | mainchain2 | **360°**, **2.5** | Circle slash |
| 3 | mainchain3 | Arc **75°**, **2.5** | Strong narrow finisher |
| 4 | offchain1 | Charge **~2s** → arc **90°**, **3.5** | Power chop — starter |
| 5 | offchain2 | Arc **90°**, **3.5** | Follow-up after row **4** release **connects** |

**Main:** **connect** `1→2→3`. **Slow** inter-hit CD + **end-of-string** pause.

**Offchain:** row **5** gated on charged row **4** hit. **Calamity** (row **10**) adds tier‑2 charge on row **4** (**+~3s**, **75°**, **5** radius, **long CD**).

### Prof rows (extends)

| Row | Name (draft) | Effect |
|---|---|---|
| 6 | **Healthy buffer** | Offchain1 **execution:** **+33% MHP** (brief) |
| 7 | **Reaching chop** | Mainchains: **+1** radius |
| 8 | **Deflecting chop** | Mainchain3 **execution:** **1 HP** `<shieldProtect>` |
| 9 | **Stalwart buffer** | Offchain2 **execution:** **−50% PDR/MDR** (short) |
| 10 | **Calamity buffer** | Offchain1: **charge tier 2** — atmosphere cleave |

**Loop (base):** slow main in melee → charge when safe → follow-up + buffer windows → **Calamity** on long CD.

**Weapon tags (migration):** `<skillId:91>` row 1; `<offhandSkillId:94>` row 4.

---

## Axe 2H battleaxe — lot **cleave** (IDs **101–110** when migrated)

**Identity:** **Fast hack-and-slash** — five-hit **connect** main (`1→2→3→4→5`). **Tight** combo windows; CDs **accelerate** through the string. **ATK** formulas (no skill **MHP**). Enemy debuff prof ladder: bleed/slow → crit vs bleed → crit triggers devastation. **No `<freeCombo>`** · **no offchain**. Contrast **1H** slow buffer + charge.

### Action rows

| Row | Slot | Hitbox (draft) | Job |
|---|---|---|---|
| 1 | mainchain1 | Arc **75°**, **1.5** | Narrow opener |
| 2 | mainchain2 | Arc **160°** (reverse), **1.5** | Wide slice |
| 3 | mainchain3 | **Circle**, **2** | Spin pivot |
| 4 | mainchain4 | Arc **120°**, **1.5** | Reverse wave |
| 5 | mainchain5 | Arc **200°**, **1.5** | Finisher — terminal |

**Main:** **connect** only. String **ends** at row **5**. Tuning at playtest (combo window, CD curve).

### Prof rows (extends)

| Row | Name | Effect |
|---|---|---|
| 6 | **Hamstring** | All mains: **−25%** move speed + **25%** chance **bleed** |
| 7 | **Moonshot** | Mainchain3: **+1** radius + **100%** **stun** |
| 8 | **Genocide** | All mains: **guaranteed crit** vs **bleeding** targets |
| 9 | **Euphoria** | Mainchain5 on hit: self **move speed / crit / CDM** buff |
| 10 | **Bloodlust** | Any mainchain **crit:** devastating debuff — **unique bleed** + **stun** |

**Loop (base):** connect fast string → stack bleed (**Hamstring**) → **Moonshot** stun on spin → **Genocide** crits → **Euphoria** finisher spike → **Bloodlust** on crits.

**Weapon tags (migration):** `<skillId:101>` row 1.

---

## Axe breaker (IDs **111–120** when migrated)

**Identity:** **Deconstruct** — **LLRL** connect main → offhand **SHATTER**. One **Tenderizing** stack currency on targets (**−PDR per stack = party buff** — everyone’s physical hits benefit). **SHATTER** dumps stacks (+5 baseline); **Crushing shatter** widens radius and adds more. At **~20 stacks**, **Exposed:** **0 PDR**, **×2 physical damage taken** (with other mults). Replaces legacy twin/helicopter.

**Almost support-ey:** soften targets for the **party**, not self sustain.

### Action rows

| Row | Slot | Hitbox (draft) | Job |
|---|---|---|---|
| 1 | mainchain1 | Arc **100°**, **1.8** | Small opener |
| 2 | mainchain2 | Arc **120°**, **1.8** | Medium swing |
| 3 | mainchain3 | Arc **180°** (reverse), **2** | Wide reverse |
| 4 | mainchain4 | Arc **75°**, **2** | Face hit |
| 5 | offchain1 | **SHATTER** — **Circle**, **3** | Shield break; **+5 Tenderizing** stacks |

**Main:** **connect** `1→2→3→4`. **Offchain:** row **5** independent (**pistol-style** earn string → spend snap); currency is **shred**, not shot damage.

### Prof rows (extends)

| Row | Name | Effect |
|---|---|---|
| 6 | **Breaking swings** | Mains: **+100% shield damage** |
| 7 | **Tenderizing swings** | Mains: apply **Tenderizing** stacks |
| 8 | **Crushing shatter** | **SHATTER:** **+radius** + **more stacks** |
| 9 | **Descaling swings** | Mains: anti-construct / dragon / aquatic |
| 10 | **Exposed** | **Max stacks (~20):** → **Exposed** — **0 PDR**, **×2 phys taken** |

**Loop (base):** LLRL peel → **SHATTER** stack dump → party physicals hit harder → **Exposed** finish.

**Weapon tags (migration):** `<skillId:111>` row 1; `<offhandSkillId:115>` row 5.

---

## Wand 2H staff — lot **aura** (IDs **121–130** when migrated)

**Identity:** **Magic stick** — mid-range **spray(3)** mains + **charge→aura** offhand (MRG recovery; prof buff spine). **MAT** (mod) + **MDF** (high on gear). **Not** a melee bonker — contrast **spear mortar** and **1H wand** spike.

**Layout:** **3 main** + **1 offchain** + **6 prof (rows 5–10)**.

**Main:** `<freeCombo>` on rows **1–3** — **`formation:spray`** (center + **±45°**) per press.

**Offchain:** row **4** — **charge, on release** → self **MRG** buff states (heavy). Prof extends aura (HRG, party AOE, TRG, prism shield).

### Action rows

| Row | Role | Job |
|---|---|---|
| 1 | mainchain1 | Mid-range **spray(3)** |
| 2 | mainchain2 | Mid-range **spray(3)** |
| 3 | mainchain3 | Mid-range **spray(3)** |
| 4 | offchain1 | **Charge → release:** **MRG** aura (self) |

### Prof rows (extends — rows **5–10**)

| Row | Name | Effect |
|---|---|---|
| 5 | **Nurturing aura** | Offchain1: + **HRG** |
| 6 | **Fractal aura** | Offchain1: **AOE** — same buffs to **allies nearby** |
| 7 | **Enduring waves** | Mains: **+1s duration** |
| 8 | **Energetic aura** | Offchain1: + **TRG** |
| 9 | **Gigant waves** | Mains: **+0.5 knockback** |
| 10 | **Prism aura** | Offchain1: massive **elemental shield** (magic elements) — **break → explosion** |

**Loop (base):** **`freeCombo` spray** → **charge offhand** → **release aura** → repeat. Prof: self sustain → party share → wave control → prism capstone.

**Weapon tags (migration):** `<skillId:121>` row 1; `<offhandSkillId:124>` row 4.

Detail: [`families/wand/staff.md`](./families/wand/staff.md).

---

## Wand 1H — lot **saturation** (IDs **131–140** when migrated)

**Identity:** **Bullet hell machine gun** — **`freeCombo`** single bolts (long range, low CD) + offhand **Saturation** (**+25% MAT** per stack, **~5s**, stacks **fall** when you stop maintaining). **MAT** glass cannon. Buff window applies to **other magic** too — **~1–2 spells** per ramp, not infinite DBZ.

**Layout:** **3 main** + **1 offchain** + **6 prof (rows 5–10)**.

**Saturation (base):** **+25% MAT** additive per stack · cap **4** (**+100%**) · offhand **~1s CD**. **Prof 7:** **4 stacks** per press · cap **40** (**+1000% / 10×** max — **ten** offhand executions to ceiling).

### Action rows

| Row | Role | Job |
|---|---|---|
| 1 | mainchain1 | Long-range **single bolt** |
| 2 | mainchain2 | Long-range **single bolt** |
| 3 | mainchain3 | Long-range **single bolt** |
| 4 | offchain1 | **Saturation** — **MAT** stack ramp |

### Prof rows (extends — rows **5–10**)

| Row | Name | Effect |
|---|---|---|
| 5 | **Bifurcation** | Mains: **1 → 2** projectiles |
| 6 | **Vectoration** | Mains: **homing** (last-hit target) |
| 7 | **Supersaturation** | Offchain: **4 stacks**/press · cap **40** |
| 8 | **Trifurcation** | Mains: **2 → 3** projectiles |
| 9 | **Alienation** | Mains: **`anti-undead`**, **`anti-construct`**, **`anti-deity`**, **`x-aura`** |
| 10 | **Quadfurcation** | Mains: **3 → 4** projectiles |

**Loop (base):** **pew** → **Saturation** weave (or backline stack) → **pew** / **1–2 spells** before stacks fall → prof → **four bolts homing with typing**.

**Weapon tags (migration):** `<skillId:131>` row 1; `<offhandSkillId:134>` row 4.

Detail: [`families/wand/1h.md`](./families/wand/1h.md).

---

## Wand tome — lot **lexicon** (IDs **141–150** when migrated)

**Identity:** **Dictionary direct** — **`<direct>`** sentence mains; offhand **cast tempo** (**tap −50%** cast **~10s** · **charge** tiers **+50%/+100%** cast with MAT/MDF buffs **~20s/~30s**). **MMP** gear lean; damage formula at migration. Synergy: **`castTimeDamageBonus`** (Lamia / Artillery).

**Layout:** **2 main** + **1 offchain** + **7 prof (rows 4–10)**.

### Action rows

| Row | Role | Job |
|---|---|---|
| 1 | mainchain1 | **Direct** single-target sentence |
| 2 | mainchain2 | **Direct** — **further** reach |
| 3 | offchain1 | **Tap:** cast **−50%** **~10s**; **charge** tiers prof **6** / **10** |

### Prof rows (extends — rows **4–10**)

| Row | Name | Effect |
|---|---|---|
| 4 | **Cursed language** | Mains: **Curse** — enemy **skills cost HP** |
| 5 | **Booming voice** | Mains: **AOE ~1.5** radius |
| 6 | **Monotonous monologue** | Offchain **charge tier 1** — **+50%** cast, **+50% MAT/MDF**, **~20s** |
| 7 | **Forked tongue** | Mains: **1% MST** + **10% MP damage** |
| 8 | **Ruthless insult** | Mains: **+100% vs cursed**; **anti-slime** |
| 9 | **Echoing voice** | Mains: **+2 hits**, bigger radius |
| 10 | **Mortal mindmelt** | Offchain **charge tier 2** — **+100%** cast, **+250% MAT/MDF**, **~30s** |

**Weapon tags (migration):** `<skillId:141>` row 1; `<offhandSkillId:143>` row 3.

Detail: [`families/wand/tome.md`](./families/wand/tome.md).

---

## Fist arm — lot **dirty** (IDs **171–180** when migrated)

**Identity:** **Cyber wrestler** — slow **slam** connect **1→2→3**; each hit **Grab Ready!** (**~1s**). **OffchainA** roundhouse / **offchainB** nut kick (**pistol gunfu** transform). Prof **10:** **Violation Ready!** → **both-feet nut**, then **Grab** nut follow-up.

**Layout:** **3 main** + **offchain A/B (4–5)** + **5 prof (6–10)**.

### Action rows

| Row | Slot | Job |
|---|---|---|
| 1 | mainchain1 | **Over-arm slam** — **90°**, **2** |
| 2 | mainchain2 | **Lariat** — **150°**, **2.5** |
| 3 | mainchain3 | **Cross-arm slam** — **120°**, **2.5** |
| 4 | offchainA | **Half roundhouse** — **180°**, **1.5** |
| 5 | offchainB | **Nut obliteration** — **45°**, **2.5** — **Grab Ready!** |

**Main:** **connect** `1→2→3`. **Offchain:** row **4** `<offhandSkillId>` → transforms to row **5** while **Grab Ready!** (prof **10** Violation tier on **5**).

### Prof rows (extends)

| Row | Name | Effect |
|---|---|---|
| 6 | **Collateral damage** | Mains: **+500% shield damage** |
| 7 | **Intentionally dirty** | **+1 Grab Ready!** stack |
| 8 | **Heavy duty** | Mainchain3: **100% stun** |
| 9 | **Full house** | OffchainA: **360°**, **+50% damage** |
| 10 | **Needlessly dirty** | **Violation Ready!** → both-feet nut; **Grab** follow-up nut |

**Weapon tags (migration):** `<skillId:171>` row 1; `<offhandSkillId:174>` row 4.

Detail: [`families/fist/arm.md`](./families/fist/arm.md).

---

## Fist glove — lot **flow** (IDs **151–160** when migrated)

**Identity:** **Boxing** — **L1–L3** (main) + **R1–R3** (offhand); **R-boost** / **L-boost** (~**1s**, **+30%** opposite hand, **LST**); **Flow** on **L3** / **R3** recurse (**independent** per side, **+10% ATK** / **+5 TCR** / stack, no cap). Weave **L↔R** for empowered alternation.

**Layout:** **6 action** (rows **1–6**) + **4 prof (7–10)**.

### Action rows

| Row | Hand | Job |
|---|---|---|
| 1 | **L1** | Jab — **R-boost** — line **1.1** |
| 2 | **L2** | Straight — **R-boost** — **1.3** |
| 3 | **L3** | Flow recurse — **Flow** + **R-boost** — **1.5** |
| 4 | **R1** | Jab — **L-boost** — **1.1** |
| 5 | **R2** | Straight — **L-boost** — **1.3** |
| 6 | **R3** | Flow recurse — **Flow** + **L-boost** — **1.5** |

### Prof rows (extends — rows **7–10**)

| Row | Name | Effect |
|---|---|---|
| 7 | **Double fisting** | **L3** / **R3**: **+1 hit** |
| 8 | **Familiar fisting** | Cross-boosts: **+1 stack** |
| 9 | **Rage fisting** | All punches: shared **Rage** (**+3% ATK/AGI**/stack, no cap) |
| 10 | **Ka-fisting** | **L3** ka: **+3 hits**, **+100% HIT** · **R3** ka: **guaranteed crit**, **+100% CDM** (stacks with other buffs) |

**Weapon tags (migration):** `<skillId:151>` row 1; `<offhandSkillId:154>` row 4.

Detail: [`families/fist/glove.md`](./families/fist/glove.md).

---

## Fist claw — lot **gore** (IDs **161–170** when migrated)

**Identity:** **Messy bleed rakes** — **connect** wide arcs → line finisher; **baseline stacking bleed** on the whole kit. **Offchain:** **`freeCombo` pounce** gap-close (row **4**); **360°** circle (row **5**). Prof **6** **Bloodthirst** (**+1 stack/hit**, cap **10**, **+5% ATK/AGI**, **−5% DEF**/stack); prof **10** **Bloodgambit** — row **5** **purges Bloodthirst** for **100% + 10%/stack** nearby, **defense ignored**.

**Layout:** **3 main** + **offchain A/B (4–5)** + **5 prof (6–10)**.

### Action rows

| Row | Slot | Job |
|---|---|---|
| 1 | mainchain1 | Medium rake — Arc **150°**, **2** — **bleed** |
| 2 | mainchain2 | Reverse rake — Arc **120°**, **2** — **more bleed** |
| 3 | mainchain3 | Finisher — Line **1.5** thick, **2** — **more bleed** |
| 4 | offchainA | **Pouncing slash** — Line **0.5**, **4** — **`freeCombo`** gap-close; bleed |
| 5 | offchainB | **Circle slash** — **360°**, **2** — bleed; prof **10** Gambit spend |

**Main:** **connect** `1→2→3` — **no `<freeCombo>`**. **Offchain:** row **4** `<offhandSkillId>`; row **5** circle (CD tune ~**5s+**, **sharp** parallel).

### Prof rows (extends)

| Row | Name | Effect |
|---|---|---|
| 6 | **Bloodthirst** | All kit hits: **+1 Bloodthirst stack** (cap **10**; **+5% ATK/AGI**, **−5% DEF**/stack) |
| 7 | **Bloodfest** | All kit: **+1 bleed stack** on apply |
| 8 | **Bloodcircuit** | All kit: **ignore parry** |
| 9 | **Bloodlet** | All kit: **2%** instant kill vs **bleeding** *(placeholder)* |
| 10 | **Bloodgambit** | **Offchain2** (row **5**): purge **Bloodthirst** → **100% + 10%/stack**, def ignored, nearby |

**Weapon tags (migration):** `<skillId:161>` row 1; `<offhandSkillId:164>` row 4.

Detail: [`families/fist/claw.md`](./families/fist/claw.md).

---

## Migration checklist (when executing — not started)

- [x] **Blade:** all three **10-row** lots (sharp / beast / twist)
- [x] **Spear:** all three **10-row** lots (pierce / mortar / rend) — IDs **31–60**
- [x] **Gun:** all three **10-row** lots (gunfu / conduit / boomstick) — IDs **61–90**
- [x] **Axe:** all three **10-row** lots — IDs **91–120**
- [x] **Wand staff:** **aura** lot — IDs **121–130**
- [x] **Wand 1H:** **saturation** lot — IDs **131–140**
- [x] **Wand tome:** **lexicon** lot — IDs **141–150** — **wand family complete**
- [x] **Fist arm:** **dirty** lot — IDs **171–180**
- [x] **Fist glove:** **flow** lot — IDs **151–160**
- [x] **Fist claw:** **gore** lot — IDs **161–170** — **fist family complete (151–180)**
- [x] **All 18 × 10-row weapon lots planned** — IDs **1–180**
- [ ] Relocate **character / guard / mobility / elemental** skill bands — zero overlap with **1–180**
- [ ] Rewrite `Skills.json` rows + weapon `<skillId>` / `<offhandSkillId>`
- [ ] Rewrite `config.proficiency.json` `JR-*` keys to new IDs + subskill lists
- [ ] Save migration / compat plan
- [ ] Tutorial & CMS copy pass

---

## Revision log

| Date | Note |
|---|---|
| 2026-06-03 | Created; 10-row schema; 1H **sharp** lot documented; prof subskill policy noted. |
| 2026-06-03 | **2H beast** lot (IDs 11–20): stun lord, charge on offchain, prof row 6 main-damage lean. |
| 2026-06-03 | **Dual twist** lot (IDs 21–30): 4× mainchain, no offchain/charge; prof rows 5–10; one prof track. |
| 2026-06-04 | Blade family planning **complete**; Stiletto formula + range notes; doc sync pass. |
| 2026-06-04 | **Spear stab pierce** lot (IDs 31–40): cyclic main, pin→dive star offchain, prof ladder locked. |
| 2026-06-03 | **Spear basher mortar** lot (IDs 41–50): 4× main, circle offchain, MAT/MP + denial/charge prof ladder locked. |
| 2026-06-03 | **Melee spear:** `<freeCombo>` lifted; javelin **rend** uses it on main only. |
| 2026-06-03 | **Spear javelin rend** lot (IDs 51–60): stack ledger + RIP, Chain RIP prof, seven prof rows locked. |
| 2026-06-03 | **Gun pistol gunfu** lot (IDs 61–70): Gun-fu stack ammo, 3+2+5, Death Star charge capstone. |
| 2026-06-03 | **Prof unlock order:** all subgroups — prof rows learned in **strict numeric row order** (global). |
| 2026-06-03 | **Gun shotgun boomstick** lot (IDs 81–90): freeCombo main, reload shells, 2s main CD, prof 4–10. |
| 2026-06-03 | **Axe 1H hatchet buffer** lot (IDs 91–100): slow chop, charge offchain, execution buffers. |
| 2026-06-03 | **Axe 2H battleaxe cleave** lot (IDs 101–110): 5× connect main, bleed/crit prof ladder. |
| 2026-06-03 | **Axe breaker** lot (IDs 111–120): LLRL→SHATTER, Tenderizing→Exposed, party PDR shred. **Axe family complete.** |
| 2026-06-03 | **Global:** charge skills = **on release** (not channeling). |
| 2026-06-03 | **Wand 2H staff aura** lot (IDs 121–130): spray mains + charge→aura offchain, prof 5–10. |
| 2026-06-03 | **Wand 1H saturation** lot (IDs 131–140): machine-gun bolts, additive MAT stacks, furcation + Alienation typing. |
| 2026-06-03 | **Wand tome lexicon** lot (IDs 141–150): direct mains, cast-tempo offchain, curse HP-cost debuff. **Wand family complete (121–150).** |
| 2026-06-03 | **Fist arm dirty** lot (IDs 171–180): Grab Ready! offchain A/B, Violation capstone (pistol gunfu grammar). |
| 2026-06-03 | **Fist glove flow** lot (IDs 151–160): L/R 3+3, cross-boost + LST, independent Flow, ka-fisting prof 10. |
| 2026-06-03 | **Fist claw gore** lot (IDs 161–170): connect bleed mains, freeCombo pounce, Bloodthirst → Gambit circle. **Fist family complete. All 18 lots planned (1–180).** |
