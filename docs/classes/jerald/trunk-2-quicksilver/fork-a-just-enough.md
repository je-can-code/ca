# Fork 2A — Just Enough

> One throw. Calculated. Handled. He's already thinking about leaving.
> Deliberate velocity control — not fast, not slow, exactly as hard as the job requires. Throwing again would be unnecessary, and unnecessary is unacceptable.
>
> **Trunk:** [Quicksilver](./trunk.md)
>
> **SDP affinities:** Artillery, Skirmisher

---

## Native Equipment

- **Weapons:** Javelin. The elemental weapons are long enough range to technically work — wrong stat spec, player's call.
- **Armor:** light

---

## Combat skills

| # | Name | Description |
|---|---|---|
| 1 | Back Off | Slow-moving projectile. Hits, knocks back, hits again, knocks back again — same target, same projectile, over and over. He threw it at exactly that speed on purpose. |
| 2 | Skyeroll | Channeled. Locks Jerald in place, rains sharp things on a target zone repeatedly over the duration. He is rolling his eyes the entire time. |
| 3 | Watch Your Step | Places a mine. On trigger: simultaneous root and heavy damage. He warned them. |
| 4 | I Said Back Off | **Signature.** An 8-tile wide wall of sharp, slow-moving death. No cooldown between hits — it grinds through everything it contacts with deliberate patience. Long cooldown. He said it once already. |

---

## Passives

| # | Name | Description |
|---|---|---|
| P1 | ATK +10% | +10% attack. |
| P2 | Projectile Duration +25% | Projectiles stay active 25% longer. Back Off bounces more. I Said Back Off grinds further. One throw, more work. |
| P3 | Radius +33% | +33% AoE radius on all skills. Bigger zone, wider wall, further mine trigger. |
| P4 | CDR +10% | −10% cooldown duration. Back Off comes back faster. |
| P5 | Equip Javelin | Unlock. Grants access to the Javelin weapon subgroup. |
| P6 | Trauma | `onKnockback`: apply stun. Every push is a setup. Requires new engine hook — see engine-requirements. |
| P7 | Passive Punishment | +5% damage per negative state active on the target. More afflictions, more damage. Uses `<perDebuffBuff:5>`. |
| P8 | Clear Mind | While no enemies are within melee range: +33% damage, −33% CDR. Playing correctly multiplies everything. |
| P9 | Trudge | All hits apply the Trudge state (ID 10). They slow down. The projectile doesn't. |
| P10 | Overdue | On first hit, plant the Overdue state on the target. It gains one stack per second on its own — no further input required. Damage dealt to the target increases by X% per stack. Trash mobs won't feel it. Bosses will. |
