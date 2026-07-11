# Fork 2B — Try Hard

> Hyperfocus. Pin one thing, flip the switch, mash the button. Playing chicken with the target. It's 1v1 and Jerald takes it personally.
>
> **Trunk:** [Quicksilver](./trunk.md)
>
> **SDP affinities:** Berserker, Skirmisher

---

## Native Equipment

- **Weapons:** Taser
- **Armor:** light

---

## Combat skills

| # | Name | Description |
|---|---|---|
| 1 | Button Mash | Hits `LUK/10` times in rapid succession. Damage almost irrelevant — exists to proc weapon on-hit states as many times as your LUK allows. Uses `<bonus-hits:[a.luk / 10]>`. |
| 2 | Lock-On | Toggle. While active, each hit applies a stacking debuff to the current target — the longer you commit, the more of a noob they become. Switching targets resets the stacks on a fresh target. |
| 3 | Roar of All Time | Jerald screams. Self and all nearby allies receive a morale buff. The nearby slime did not ask for this. |
| 4 | The Big Red Button | **Signature.** Execute. Scales dramatically with target's missing HP — meaningful at 70%, war crime at 30% or lower. |

---

## Passives

| # | Name | Description |
|---|---|---|
| P1 | MAT +10% | +10% magic attack. |
| P2 | Equip Taser | Unlock. Grants access to the Taser weapon subgroup. |
| P3 | LUK +10% | +10% luck. Scales Button Mash hits, basic attack bonus hits, and all proc odds simultaneously. |
| P4 | Abusive | Bonus damage to targets below 50% HP. Scales harder the lower they go. |
| P5 | LUK +20% | +20% luck. Scales Button Mash hits, basic attack bonus hits, and all proc odds simultaneously. |
| P6 | Basic Attack Hits +1 | Basic attacks hit one additional time. |
| P7 | MAT +20% | +20% magic attack. |
| P8 | CDR +20% | −20% cooldown duration. |
| P9 | Fully Committed | Basic attack bonus hits = `floor(1 + LUK/250 + AGI/250)`. The longer he's decided you're the problem, the more that decision shows. Uses `<bonus-hits-basic:[floor(1 + a.luk/250 + a.agi/250)]>`. |