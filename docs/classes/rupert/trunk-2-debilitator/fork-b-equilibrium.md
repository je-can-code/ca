# Fork 2B — Equilibrium

> The battlefield is a closed system and Rupert is the force that keeps it balanced — always in his favor.
> Not an accountant. The thing that balances. Numbers, forces, fates — all of it.
>
> **Trunk:** [The Debilitator](./trunk.md)
>
> **SDP affinities:** Medic, War Priest

---

## Native Equipment

- **Weapons:** cane, warstaff
- **Armor:** medium armor

---

## Combat skills

| # | Name | Description |
|---|---|---|
| 1 | Rebalance | Toggle, no cooldown. Switches between the two equations, one at a time; the first press picks Life. **Equation: Life:** every hit Rupert lands pulses a heal to the allies around him. **Equation: Entropy:** every heal Rupert lands pulses damage into the foes around him. |
| 2 | Extract | Targeted magic strike on a foe up to 10 tiles away, 8 s cooldown. Takes what is owed. Under Life, every hit feeds the damage→heal equation. |
| 3 | Distribute | Targeted big heal on an ally up to 10 tiles away, Rupert included, 8 s cooldown. Provides what is needed. Under Entropy, it feeds the heal→damage equation. |
| 4 | Equilibrium | **Signature.** 15 s of the Equilibrium state, which runs both equations at once on top of whichever one Rebalance has on, 45 s cooldown. Every hit Rupert lands pulses a heal, which pulses damage in turn, until the window closes. |

---

## Passives

| # | Name | Description |
|---|---|---|
| P1 | Resist +20% | +20% magic defense. |
| P2 | Equip Cane | Unlock. Grants access to the Cane weapon subgroup. |
| P3 | Reallocate | Killing a foe heals nearby allies. A kill pays a dividend. |
| P4 | Aggro +20% | +20% aggro. |
| P5 | Max Life +40% | +40% max HP. |
| P6 | Equip Warstaff | Unlock. Grants access to the Warstaff weapon subgroup. |
| P7 | Overclock | MP costs +50%, cast time −50%. |
| P8 | Resist +30% | +30% magic defense. |
| P9 | Hypercharge | MP costs +50%, damage +50%. |
| P10 | Aggro +30% | +30% aggro. |
| P11 | Max Life +60% | +60% max HP. |
| P12 | Equip Breaker | Unlock. Grants access to the Breaker weapon subgroup. Unwrapping them for the party is the whole point of the equation. |
| P13 | Equalize | Both equations, always, through the Equalize state, whatever class Rupert is wearing. Stacks with Rebalance's stance and Equilibrium's window: with Life on, Life runs twice. |

---

## Equation mechanics

Each equation is an `<autoExecuteSkill>` rule on a state. Every source that grants an equation carries its own copy of
the rule, and the engine times each copy on its own, so copies from different sources stack.

| Equation | Fires on | Payload |
|---|---|---|
| Life (157) | `onDamageDealt`: Rupert's damage lands on a foe | 579 Equation: Life, a heal of `a.mdf × 2` to every ally within 3 tiles of Rupert |
| Entropy (158) | `onHealDealt`: Rupert's skill heals anyone on his side, himself included | 580 Equation: Entropy, `(a.mat × 2) − (b.mdf × 1)` to every foe within 3 tiles of Rupert |

Each copy fires at most once a second. Neither pulse is `<direct>`, so both land around Rupert, never on whoever set
them off. Regeneration, lifesteal and heal cascades never trigger Entropy, since `onHealDealt` only hears a skill that
lands. With both equations up, a hit sets off one round: Life's heal pulse, then Entropy's damage pulse. That damage
lands inside Life's one-second timer, so the round ends there until Rupert's next hit or heal.

| Source | Life copies | Entropy copies |
|---|---|---|
| Rebalance's stance (157 or 158) | 1 in the Life stance | 1 in the Entropy stance |
| Equilibrium's window (184, 15 s) | 1 | 1 |
| Equalize (162, permanent) | 1 | 1 |
