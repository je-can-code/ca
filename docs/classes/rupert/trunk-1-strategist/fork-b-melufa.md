# Fork 1B — Melufa

> Death by a thousand cuts. Up close with dual swords, elemental and MAT-infused. Getting in melee range is somehow worse for the enemy than staying at range.
> Named after Ashton Anchors' best weapon in Star Ocean: The Second Story. Completely intentional. Completely unironic.
>
> **Trunk:** [Strategist](./trunk.md)
>
> **Natural weapons:** dual blade (twist — widening arcs, two buttons, elemental; MAT support)
>
> **SDP affinities:** Wizard, Berserker

**Block size:** 20 (4 combat + 8–12 passive target, remainder spare)

---

## Combat skills (4)

| # | Name | Description |
|---|---|---|
| 1 | Heated Enchant | Infuses blades with heat. Basic attacks trigger a heat-element MAT-scaled follow-up hit. |
| 2 | Liquid Enchant | Infuses blades with liquid. Basic attacks trigger a liquid-element MAT-scaled follow-up hit. |
| 3 | Enchanted Whip | Short-range whirl. Executes the active enchant's effect as a burst AoE rather than a single follow-up hit. |
| 4 | Mince | Charge-based. Each activation swings a 270-degree oscillating arc — up to 3 hits per swing — and each hit procs the active enchant. No charge cap. Charges accumulate from enchant follow-up procs. One hit is a papercut. There is no ceiling on how many charges you can have. |

---

## Passives

> TBD — second pass after all combat skills are defined across all trunks and forks.

### Passives uncovered during combat design

| # | Name | Description |
|---|---|---|
| P1 | Untouchable | On evade, briefly apply `<invincible>` — removes Rupert from collision detection entirely, causing skills that would clip him post-dodge to also miss. |
