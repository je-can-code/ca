# Fork 3A — RNGesus

> Rupert doesn't pray to RNGesus — he IS RNGesus. Eliminate variance. Guaranteed outcomes. Proc manipulation.
> The outcome was never in question. Also bestows blessings.
>
> **Trunk:** [Fate](./trunk.md)
>
> **SDP affinities:** Cleric, Generalist

---

## Native Equipment

- **Weapons:** pistol, blade
- **Armor:** light armor, medium armor, relic

---

## Combat skills

| # | Name | Description |
|---|---|---|
| 1 | Miracle | Party-wide buff for 15 s, 1 min cooldown. Every chance roll the party makes succeeds for the duration: hits, crits, procs, counters, retaliations, drops, and their own parries and glancing blows. No rolls. Everything lands. Applied state uses `<veryLucky>` — a true bypass, not a reroll count; it lands states through any resistance, never through immunity. |
| 2 | Blessed | Party-wide buff for 15 s, 90 s cooldown. LUK ×50 (five ×10 traits and one ×5, stacked additively). Dominates the luck gap on harmful states — their debuffs land on everything, enemy debuffs bounce back. Luck never touches a blessing, so allies' buffs still land on each other. Also a raw damage multiplier for pistol and taser users. Cross-class contamination fully intended. |
| 3 | Benediction | Party-wide blessing for one minute, 2 min cooldown. Slow trickle regen of 1% HP, MP and TP every half-second tick. Not a heal. A blessing. The party is going to be fine. |
| 4 | Encore | **Signature.** State applied to all allies for 15 s, 5 min cooldown, the longest in the game. Every proc that lands fires again: states land twice, retaliations and evasion counters fire twice, drops come in pairs. Combined with Miracle: every proc guaranteed AND doubled. Combined with the multi-apply passive: each success stacks and then echoes. Applied state uses `<encoreRepeats:[1]>`. |

---

## Passives

| # | Name | Description |
|---|---|---|
| P1 | Luck +20% | +20% luck. |
| P2 | Equip Blade | Unlock. Grants access to the Blade weapon subgroup. |
| P3 | Extra Chance | Permanent +1 positive rolls. No trigger, no window — just always on. Uses `<luckyRolls:[1]>`. |
| P4 | Aggro -30% | −30% aggro. |
| P5 | Equip Relic | Unlock. Grants access to relic armor. |
| P6 | Power +30% | +30% attack. |
| P7 | Luck +30% | +30% luck. |
| P8 | Every Chance | **Accumulate mode.** Positive rolls count every success instead of stopping at the first. One hit stacks bleed three deep, lands burn twice, applies a state multiple times from a single proc. Uses `<accumulate>`. |
| P9 | Phys Evade +50% | +50% evasion. |
| P10 | Equip Claws | Unlock. Grants access to the Claws weapon subgroup. |
| P11 | Zero Chance | Critical hits always land every chance effect they carry, regardless of chance: the skill's own state effects, the on-hit state tags and the on-crit states. Stacks with Every Chance. Applied state uses `<forceCritProcs>` — scoped to critical hits only, unlike the battler-wide `<veryLucky>`. |
