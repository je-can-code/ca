# Fork 3B — Hexagonal

> The shape of a curse. Engineer their misfortune. Stand behind a prism shield and do it freely because fuck you.
> Not a backline class — in their face, prism shield up, enemies locked and cursed while allies come to collect.
> RNGesus blesses allies — Hexagonal specifically and deliberately makes things worse for the enemy.
>
> **Trunk:** [Fate](./trunk.md)
>
> **SDP affinities:** Wizard, Guardian

---

## Native Equipment

- **Weapons:** tome, boomstick
- **Armor:** medium armor, shield

---

## Combat skills

| # | Name | Description |
|---|---|---|
| 1 | Terrorize | 50 MP, 45 s cooldown. Applies a custom paralysis state rooted in fear to a foe and anyone near it. They cannot act, cannot move. The duration is needlessly, offensively long: 8 s, 20 s with State Duration +150%. |
| 2 | Lobotomized | 75 MP, 30 s cooldown. Every roll they make fails. Not reduced. Not penalized. Zero. Their attacks miss unless they are Certain Hit, they never crit or parry, and none of their procs or follow-up casts fire. Applied state uses `<veryCursed>` — a true bypass, not a reroll count. |
| 3 | Eyes of Rupert | 100 MP, 45 s cooldown. Counter-curse. Every hit on Rupert retaliates with Rupert's Glare, which puts Rupertified on the attacker: every skill it uses costs it 10% of its MHP, hit or miss (`<on-cast-hp-gain:-10%>`). They stared into the abyss. It lashed back. Violently. Stacks with the tome curse's own HP cost. |
| 4 | Uninstall | **Signature.** 250 MP, 3 min cooldown. Terrorize, Lobotomized, and Rupertified applied simultaneously. You are done. Not dead — just removed from the fight as a functional entity. The allies will handle the rest. |

---

## Passives

| # | Name | Description |
|---|---|---|
| P1 | Equip Tome | Unlock. Grants access to the Tome weapon subgroup. |
| P2 | Endurance +20% | +20% defense. |
| P3 | State Duration +150% | Every state Rupert applies lasts two and a half times as long. |
| P4 | Equip Shield | Unlock. Grants access to shields. |
| P5 | MP Rejuv +80% | +80% MP regen. |
| P6 | Rupert's Retinas | Lesser, perpetual version of Eyes of Rupert. Every hit landed on Rupert retaliates with Rupert's Side-Eye, which puts Mild Rupertification on the attacker: 5% of its MHP for every skill it uses, for 8 s, renewed by every hit it lands on Rupert — no cast required, always live. |
| P7 | Endurance +30% | +30% defense. |
| P8 | Recovery Rate +50% | +50% recovery effectiveness. |
| P9 | Equip Boomstick | Unlock. Grants access to the Boomstick weapon subgroup. |
| P10 | Devastated | **Signature.** Enemies afflicted with a Rupert-authored state take +10% damage from anyone, per stack. Misery doesn't need to be delivered personally to be collected on. |
