# Fork 1C — The Architect

> Master of space. Every enemy is exactly where Rupert needs them — because he put them there.
> Self-assigned title. Completely unironic.
>
> **Trunk:** [Strategist](./trunk.md)
>
> **SDP affinities:** Skirmisher, Artillery

---

## Native Equipment

- **Weapons:** tome
- **Armor:** light armor, relic

---

## Combat skills

| # | Name | Description |
|---|---|---|
| 1 | Converge | Drags a target toward Rupert. The opener. Sets up the melee window. |
| 2 | Repel | Knocks a target away from Rupert. Sends them to the shooting gallery. The cooldown gate. |
| 3 | Compression | Targeted. Slowly compresses the target, locking them in place while it happens. Because the Architect decided you'd be smaller now. |
| 4 | Meteor | **Signature.** Targeted. Yanks a passing rock from orbit and craters it into the target and nearby vicinity. Not moving the enemy. Not moving Rupert. Just applied astrophysics. |

---

## Passives

| # | Name | Description |
|---|---|---|
| P1 | Max Magi +40% | +40% max MP. |
| P2 | Equip Spear | Unlock. Grants access to the Spear weapon subgroup. The Architect decides reach is also his domain. |
| P3 | Temporal Hold | `onKnockback`: inflict Rooted. If you're not standing your ground, he'll pin you to one. |
| P4 | Projectile Duration +20% | Projectiles remain active 20% longer. |
| P5 | Time Collapse | After casting a skill, the next skill cast is instant and costs no MP. The Architect has collapsed the interval between two moments. A Red Mage's Dualcast: the passive carries `<toggleStateOnSkillExecution:[143, 4]>`, so any Magecraft spell that costs MP arms Instant Cast Ready and the next one spends it, instant and free, and the one after that arms it again. A cheap mover arms it (Converge, 15 MP), so the big spell after it fires free (Meteor, 100 MP); spells that cost nothing never touch it. Instant Cast Ready carries `<castSpeedRate:[-300]>` (headroom over Expound's and Trudge's slowdowns) + a triple-stacked MCR-to-zero trait (defensive redundancy against MCR debuffs/SDP bonuses), and lapses after 10 s unused. The dualcast spell still goes on its normal cooldown. |
| P6 | Magi Cost -20% | −20% skill cost. |
| P7 | Projectile Duration +40% | Projectiles remain active 40% longer. |
| P8 | Max Magi +60% | +60% max MP. |
| P9 | Deliberate Position | Rooted or paralyzed targets have PDR and MDR reduced to 0. |
| P10 | Magi Cost -30% | −30% skill cost. |
| P11 | Max Magi +80% | +80% max MP. |
| P12 | Equip Javelin | Unlock. Grants access to the Javelin weapon subgroup. |
| P13 | Infinite Canvas | All skill AoE radii and ranges +50%. (`<rangeRate:1.5>` — covers radius, proximity, and thickness together) |
