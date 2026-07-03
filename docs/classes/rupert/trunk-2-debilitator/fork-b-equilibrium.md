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
| 1 | Rebalance | Toggle. Flips the active equation direction. **Mode A:** healing an ally triggers damage on a nearby enemy. **Mode B:** damaging an enemy heals a nearby ally. One mode active at a time. |
| 2 | Extract | Offensive skill. Takes what is owed from an enemy. In Mode B, every hit feeds the damage→heal equation. |
| 3 | Distribute | Targeted. Big heal on a nearby ally. Provides what is needed. In Mode A, feeds the heal→damage equation immediately. |
| 4 | Equilibrium | **Signature.** Both equations active simultaneously for a short duration — heals trigger damage, damage triggers heals. The loop runs until the window closes. |

---

## Passives

| # | Name | Description |
|---|---|---|
| P1 | Equip Cane | Unlock. Grants access to the Cane weapon subgroup. |
| P2 | Equip Warstaff | Unlock. Grants access to the Warstaff weapon subgroup. |
| P3 | MDF +20% | +20% magic defense. |
| P4 | MDF +30% | +30% magic defense. |
| P5 | TGR +20% | +20% aggro. |
| P6 | MHP +10% | +10% max HP. |
| P7 | Reallocate | Killing a foe heals nearby allies. A kill pays a dividend. |
| P8 | Overclock | MP costs +50%, cast time −50%. |
| P9 | Overcharge | MP costs +50%, damage +50%. |
| P10 | Equalize | Whenever Rupert heals himself, a nearby enemy takes a proportional hit of damage. Whenever Rupert deals damage, he heals himself for a proportional amount. Always active — doesn't care what class he's currently wearing. |
| P11 | Equip Breaker | Unlock. Grants access to the Breaker weapon subgroup. Unwrapping them for the party is the whole point of the equation. |

Medium armor is not unlocked here — Rupert already has it via Melufa.

---

## Rebalance mechanics (engine-gated — see engine-requirements.md)

Not equippable passives. Background toggle states that make Rebalance itself function — active only while a mode is selected or Equilibrium's window is open.

| Trigger | Effect |
|---|---|
| `onAllyHeal` | Auto-execute a damage skill on a nearby enemy. Active in Mode A and during Equilibrium. |
| `onDamageDealt` | Auto-execute a heal skill on a nearby ally. Active in Mode B and during Equilibrium. |
