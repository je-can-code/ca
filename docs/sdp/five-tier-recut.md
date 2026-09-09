# The five-tier recut

> **Done 2026-09-09.** Every subgroup strip went from ten tiers to five, named anomalies moved to
> slot 10 and stopped granting panels, and every stat the old strip granted is preserved exactly.
>
> `deity-sin` and `deity-sin-votary` (1581–1600) were excluded and are untouched.
>
> Supporting docs: [`flow.md`](./flow.md) (authoring loop), [`mastery-cheatsheet.md`](./mastery-cheatsheet.md)
> (IDs and bands), [`panel-parameters-cheatsheet.md`](./panel-parameters-cheatsheet.md) (archetype pools),
> [`mastery-prose.md`](./mastery-prose.md) (description templates).

---

## Why

Ten tiers per subgroup implied roughly 500 enemies. The actual authored count was **101**, with a
median of **2** per subgroup after several years of work. Five hundred was the shape of the grid, not
a plan the content was ever tracking toward.

The design argument is independent of the enemy count and is the stronger one. A strip has three ideas
in it, which the three-act structure already admits: a base effect, a ramp, and a capstone. Ten tiers
forced eight intermediate numbers where only three ideas existed, producing ladders like
`humanoid-orc` at `+3/7/10/12/15/17/20/22/25/30%` cooldown reduction. Steps of two and three percent
are steps a player cannot feel, and a rank nobody feels is not a rank, it is a point sink.

At five tiers the acts are **2 / 2 / 1** and every step lands. Orc now reads `3 / 10 / 15 / 20 / 30`.

---

## Invariants

These held throughout. Anything that violates one is wrong, however convenient.

1. **Slot position is panel tier.** The enemy in slot 3 of a decade is tier 3 and drops the tier-3
   panel. This never becomes a lookup.
2. **A strip's total stat payout does not change.** Enemy scaling is tuned against the player's
   expected stat total, so halving the payout would silently break the difficulty curve everywhere.
3. **A strip's parameter identity does not change.** Every parameter that appeared anywhere in the old
   ten panels appears somewhere in the new five. The identity only moves where it lives.
4. **Anomalies grant no panel.** They pay SDP points, materials and guild rank. A panel behind a
   quest-spawned encounter is a completability hazard, and a capstone panel reachable in the tutorial
   zone is a trap for a new player.
5. **No parameter gain is an artifact of arithmetic.** Every `perRank` sits on a clean grid.

---

## The shape

| Slot | Holds |
|---|---|
| 1–5 | The strip. Five panels, five masteries, acts 2 / 2 / 1 |
| 6–9 | Empty. Reserved growth room |
| 10 | The named anomaly. No panel |

Slot 10 rather than slot 6 because `!Godless Glaze` already sat at 260, and because leaving 6–9 open
means a strip that later earns depth never has to move its anomaly a second time.

**Act boundaries moved from 3 / 9 to 2 / 4** — `BeginningActMaxTier` and `MiddleActMaxTier` in
`PanelMasteryProse`. That is what let every existing prose template keep working untouched, since
templates are authored per act rather than per tier.

| | Old | New |
|---|---|---|
| Rarity ladder | `0,1,2,2,3,3,4,4,4,5` | `0,2,3,4,5` |
| `maxRank` | `10 × 9`, then `20` | `10,10,10,10,20` |
| `perRank` | as authored | solved to preserve totals |

`maxRank` stayed at 10/20 deliberately. Doubling it would keep `perRank` near its authored values, but
rank cost grows at `1.06^rank`, so twenty ranks cost **2.8×** what ten do. A 20/40 strip costs 308% of
the old one; 20/30 costs 175%.

Strip cost to fully max: **1,433,333 against the old 1,845,962 — 78%.** Identical stats, 22% cheaper.
Accepted rather than corrected: there are half as many enemies to farm.

---

## Which tiers survived

Old tiers **1, 3, 5, 7, 10** became new tiers **1, 2, 3, 4, 5**.

```
old tier   1   2   3   4   5   6   7   8   9   10
            \      \      \      \          \
new tier     1      2      3      4          5
```

Even spacing with the capstone pulling ahead, which is what fixed the reward ladders. An earlier draft
used `1,3,6,9,10`; it preserved both act ceilings but produced lumpy steps (`3,10,17,25,30` on Orc, and
`3,9,18,27,30` on points).

Masteries were **moved whole** — state 1483 became 1482, byte for byte except its payload reference.
Nothing was interpolated, so a strip whose tag-and-trait shape changes irregularly needed no special
handling. `humanoid-cyclops` and `humanoid-kobold` were flagged for hand work on that basis and turned
out to need none; both were later retuned for a different reason, below.

---

## Panel parameters: a solve, not a multiply

The one part that was not mechanical.

Parameters could not select the way masteries did. Keeping only tiers `1,3,5,7,10` would have made
**26 parameters across 20 subgroups vanish outright**, because they only ever appeared on discarded
tiers, and the per-parameter shortfall was not uniform (`undead-reborn` needed `mmp` scaled ×2.15,
`mdf` ×1.75, `mhp` not at all).

So parameters **fold** instead. Every old tier's contribution lands on the surviving tier nearest its
source:

```
{1,2} -> t1    {3,4} -> t2    {5,6} -> t3    {7,8} -> t4    {9,10} -> t5
```

Three things then had to hold at once:

1. **Every `perRank` on a clean grid.** `0.05` for percentage-point parameters.
2. **Each parameter's strip total exact.** With `maxRank` of 10 and 20, a `0.05` grid expresses totals
   in steps of `0.5`, so the target is the old total snapped to the nearest `0.5` — which also repaired
   the 18 totals the source had drifted off (`-47.96` was always meant to be `-48`).
3. **Potency rising with tier.** Shape comes from the *mean* of the old `perRank` values that folded
   into each bucket. Summing a bucket instead left a middle tier stronger per rank than the capstone.

### Ten parameters do not use percentage points

`apr har sdr gdr dor sar ser lst mst tst` bind with a `baseParam` of **1** and live on a 0-to-1 rate
scale — `lst` of `0.075` is seven and a half percent of damage returned as health, where `mdf` of
`178` is 178%. Measuring both on one grid turned `undead-skeleton.ser` from −15% into −50%.

Rate parameters get a **`0.0005`** grid and snap their totals to their own step, never to `0.5`.
**152 rows across 24 subgroups** are affected.

### Result

```
parameters lost: 0          rows off their own grid: 0 of 1137
totals missing target: 0    rows at perRank 0: 0
367 parameter totals preserved exactly, 18 snapped (15 of them source repairs)
rows/panel: 182 of 240 at exactly 5
```

---

## Enemies

**46 enemies changed id**: 10 anomalies up to slot 10, and the regulars and placeholders below them
sliding down to close the gaps. `!Godless Glaze` was already at 260 and did not move.

The remap contains **swaps and chains** — `473 ↔ 476`, and `103 → 110` alongside `104 → 103`. Every
pass resolves against the original numbering and writes once; a sequential in-place rewrite reads its
own output and corrupts exactly the placements that matter.

`sdpDropData`, `sdpPoints` and the `sdpPlus` coefficient are all **derived from the new slot** rather
than carried over. That was deliberate, and it repaired **27 broken drop tags** in the process —
including two whole decades pointing at another subgroup's panels (`undead-armor` at `GHO_5`,
`reptile-lamia` at `SNK_3`).

The reward ladders resample at the same positions: `sdpPoints` **3, 9, 15, 21, 30** and `sdpPlus` K
**1, 1.44, 1.89, 2.33, 3**, with the anomaly paying the top rung.

**Existing saves break, and that was accepted.** `MonsterpediaObservations`, `StatistopediaRecords`
and `TrackedOmniObjective` all key by `enemyId`.

### `slime-puddle` was the one subgroup that lost content

Nine regulars will not fit five slots, so it kept Hard Syrup and the four canon elements — the ones
matching the elemental lords Earthie, Aqualock, Cynder and Skye.

```
251 Hard Syrup        lv3   -> SLI_1   generic      256-259  empty
252 Wet Mousse        lv6   -> SLI_2   Liquid       260 !Godless Glaze (no panel)
253 Sandy Pudding     lv22  -> SLI_3   Ground
254 Blinking Custard  lv35  -> SLI_4   Air
255 Molten Souffle    lv40  -> SLI_5   Heat
```

Deleted: `Radiant Flan`, `Umbral Molasses`, `Crystalline Candy`, `Majestic Meringue`.

Only Flan was placed in the world — 37 events across Forlorn Basin passages 9, 10, 11 and 13, the
second basin visit. Those became **Wet Mousse** on the `m_slimes` index 0 sprite it already wears
around Raevulaen Heartbeat, with an event-level `<level:30>` matching its neighbours (Spitting Frog 31,
Kappa Shaman 32, Aqualock 30).

---

## Cyclops and Kobold were retuned

Both lost long middle ramps — cyclops had six steps of Disabled resist, kobold added one food type per
tier — so the surviving rungs read as samples rather than a ladder. Both were set outright:

```
CYCLOPS   t1 Rooted 50% resist        KOBOLD   t1 healing +50%
          t2 Rooted immunity                   t2 healing +100%
          t3 + Disabled 50% resist             t3 all 6 food types, +25% to 6 stats
          t4 + Disabled immunity                t4 all 6 food types, +50% to 6 stats
          t5 + knockback resist 50%             t5 all food + foodChainImpervious
```

---

## What was touched

| | |
|---|---:|
| Subgroups recut | 48 |
| Panels | 542 → 302 |
| Mastery skills and states | 240 each, contiguous |
| Payload rows compressed | 10 bands of states, 7 of skills |
| Ordinals renumbered | 44 |
| Enemies moved / dropped | 46 / 4 |
| Map files, placements repointed | 51 / 317 |
| Basin placements rehomed | 37 |
| Reference events removed | 4 |
| Quest `slay.id` repointed | 9 |
| Descriptions rendering | **240 of 240** |

`Skills.json`, `States.json`, `Enemies.json` and the map files are written byte-for-byte in the
editor's own format — one object per line for the databases, and a bare brace with `data` and `events`
on their own lines for maps. `config.*.json` is two-space JSON with `&`, `<`, `>` and non-ASCII escaped
to `\uXXXX`. Getting that wrong turns a nine-line change into a whole-file diff.

---

## Known open

- **Two rows sit at 0.5% per panel.** `undead-ghosty.ctr` and `undead-wisp.ctr`, because their whole
  strip total is −1.5%. No split of 1.5% gives both rows a few percent. Raise it at the source or drop
  the parameter.
- **Strip depth against a level-150 endgame.** Five tiers across the whole curve is roughly 30 levels
  a step. That only matters if every subgroup is meant to span the game; if a subgroup occupies a
  slice, five is comfortable and some capstones become mid-game achievements.
- **The danger indicator.** `J-ABS-DangerIndicator` compares `getPowerLevel` ratios, not level deltas,
  and power level sums the player's parameters — so panel bonuses feed it directly, making it a live
  readout of whether this rescale landed. Its plugin-parameter descriptions still describe level-delta
  behaviour it no longer has. Default-off with `<showDangerIndicator>` on anomalies only is the version
  that carries information rather than restating a number already on screen.
