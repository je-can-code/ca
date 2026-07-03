# Fork 2C — Contemptuous

> Lazy contempt. Move in, BLAM them back. Step closer. BLAM. Methodical, AFK energy, deeply unimpressed with whatever it's shooting.
>
> **Trunk:** [Quicksilver](./trunk.md)
>
> **SDP affinities:** Guardian, Artillery

---

## Native Equipment

- **Weapons:** Boomstick
- **Armor:** medium

---

## Combat skills

| # | Name | Description |
|---|---|---|
| 1 | March | Toggle. −30 MSB, +30% DEF/MDF, knockback immunity. You cannot be stopped. Getting close means consequences. |
| 2 | Shrapnel | Active. Applies a self-state; that state carries `<applyState:[BLEED_ID, CHANCE, DURATION, 20]>` and is consumed by the next skill used — delivering 20 bleed stacks to whatever you just hit. Fuck you. |
| 3 | Avalanche | Active. 150° cone, radius 3, knockback 3. The BLAM. Nobody uses the shotgun's version after learning this. |
| 4 | Entire Clip | Active. Unload everything into a massive forward cone. Glorious for you, not for them. |

---

## Passives

| # | Name | Description                                                                                                                          |
|---|---|--------------------------------------------------------------------------------------------------------------------------------------|
| P1 | PDR −5 | −5 PDR. He barely notices.                                                                                                           |
| P2 | MDR −5 | −5 PDR. Still barely notices.                                                                                                        |
| P3 | MHP +10% | +10% max HP. More of him to not care.                                                                                                |
| P4 | Equip Boomstick | Unlock. Grants access to the Boomstick weapon subgroup.                                                                              |
| P5 | Equip Medium Armor | Unlock. Grants access to medium armor. Cross-class source for Raving Lunatic players.                                                |
| P6 | Overloaded | Self stack maximum +3. Tune at playtesting — the number may become outrageous.                                                       |
| P7 | I Prefer Violence | +50% damage vs bleeding targets. He has a preference.                                                                                |
| P8 | Knockback +50% | +50% knockback distance. Fewer trips.                                                                                                |
| P9 | Exsanguination | Bleed states tick 50% more often. Requires state-type-specific tick rate modifier — see engine-requirements.                         |
| P10 | Hemorrhaging | Once bleed is applied, it self-generates stacks autonomously. Uses self-accumulating state stack mechanic — see engine-requirements. |
