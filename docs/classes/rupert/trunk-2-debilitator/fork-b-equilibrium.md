# Fork 2B — Equilibrium

> The battlefield is a closed system and Rupert is the force that keeps it balanced — always in his favor.
> Not an accountant. The thing that balances. Numbers, forces, fates — all of it.
>
> **Trunk:** [The Debilitator](./trunk.md)
>
> **Natural weapons:** 2H staff (aura — spray mains + charge→aura offchain, MRG/HRG/party AOE/prism shield)
>
> **SDP affinities:** Medic, War Priest

**Block size:** 20 (4 combat + 8–12 passive target, remainder spare)

---

## Combat skills (4)

| # | Name | Description |
|---|---|---|
| 1 | Rebalance | Toggle. Flips the active equation direction. **Mode A:** healing an ally triggers damage on a nearby enemy. **Mode B:** damaging an enemy heals a nearby ally. One mode active at a time. |
| 2 | Extract | Offensive skill. Takes what is owed from an enemy. In Mode B, every hit feeds the damage→heal equation. |
| 3 | Distribute | Targeted. Big heal on a nearby ally. Provides what is needed. In Mode A, feeds the heal→damage equation immediately. |
| 4 | Equilibrium | **Signature.** Both equations active simultaneously for a short duration — heals trigger damage, damage triggers heals. The loop runs until the window closes. |

---

## Passives

> TBD — second pass after all combat skills are defined across all trunks and forks.

### Passive equations (pending engine requirements — see engine-requirements.md)

| # | Trigger | Effect |
|---|---|---|
| P-eq1 | `onAllyHeal` | Auto-execute a damage skill on a nearby enemy. Active in Mode A and during Equilibrium. |
| P-eq2 | `onDamageDealt` | Auto-execute a heal skill on a nearby ally. Active in Mode B and during Equilibrium. |
| P-eq3 | `onKill` | Auto-execute a heal skill on a nearby ally. A kill pays a dividend. Active always. |
