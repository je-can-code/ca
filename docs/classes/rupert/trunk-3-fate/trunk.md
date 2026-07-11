# Trunk 3 — Fate

> Not reactive — inevitable. Rupert isn't scrambling to keep up. He already prepared the battlefield before the fight starts.
>
> **Forks:** [Fork A — RNGesus](./fork-a-rngesus.md) · [Fork B — Hexagonal](./fork-b-hexagonal.md)
>
> **SDP affinities:** Generalist, Wizard

---

## Native Equipment

- **Weapons:** tome, pistol, blade, boomstick
- **Armor:** light armor, medium armor, relic, shield

---

## Combat skills

| # | Name | Description |
|---|---|---|
| 1 | Curry Favor | Grants self positive rolls. Every chance proc Rupert makes now rolls multiple times — take any success. Fate bends toward him. Self-applied state uses `<luckyRolls:[N]>`. |
| 2 | Court Disaster | Applies negative rolls to a target. Their chance procs must now succeed consecutively or they fail entirely. Fate abandons them. Applied state uses `<cursedRolls:[N]>`. |
| 3 | Doom | Death sentence. Technically a percentage chance to apply. With Curry Favor active and Court Disaster on them, a formality. When the timer runs out, they die. |

---

## Mobility

| Name | Description |
|---|---|
| Inevitable | After a short delay, Rupert is pulled to wherever Jerald currently is. Not sudden, not reactive — they both already knew this is where he'd end up. |

---

## Passives

| # | Name | Description |
|---|---|---|
| P1 | LUK +10% | +10% luck. |
| P2 | DEF +10% | +10% defense. |
| P3 | Crit Damage +30% | +30% critical damage. |
| P4 | Aftershocks | On crit, applies Court Disaster's negative rolls to the target. After critting, yet more disaster befalls you. Uses `<onCritApply:[...]>` targeting the same `<cursedRolls:[N]>` state as Court Disaster. |
| P5 | Equip Pistol | Unlock. Grants access to the Pistol weapon subgroup. |
