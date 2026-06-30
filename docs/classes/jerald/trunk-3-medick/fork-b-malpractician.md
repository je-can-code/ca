# Fork 3B — Malpractician

> Aggressive debuffer who incidentally heals because he technically has to.
> Shared Suffering plants the setup; potions pop in the air every few hits like sad firecrackers, healing everyone nearby as a byproduct of him punching things. He is not paying attention to it. It just happens.
> "Here's a potion. Share it. I'm busy."
>
> **Trunk:** [Medick](./trunk.md)
>
> **Natural weapons:** axe breaker (breaker — LLRL→SHATTER, party −PDR), 1H axe (hatchet/buffer — self-buffs on execution)
>
> **SDP affinities:** Medic, Wizard

**Block size:** 20 (4 combat + 8–12 passive target, remainder spare)

---

## Combat skills (4)

| # | Name | Description |
|---|---|---|
| 1 | Collateral Care | Toggle stance. Slower CDR/cast time. Auto-executes a potion AoE heal on a timer via `<autoExecuteSkill>` — a byproduct of Jerald doing literally anything else. He is not paying attention to it. |
| 2 | Look its Confetti! | AoE burst. +5% DEF/MDF to all nearby allies. Sad party poppers. Deeply underwhelming. Scales through Medick tree investment exactly like Fine. |
| 3 | Doomganosis | Applies a silent debuff to a target. Does nothing for 10 seconds. On expiry, triggers a catastrophic second state. Diagnosis → doom. |
| 4 | SHIELD | Targeted. Applies an outrageous 5x max HP shield to one ally. "Rupert, just take this SHIELD and stop dying." |

---

## Passives

> TBD — second pass after all combat skills are defined across all trunks and forks.

### Passives uncovered during combat design

- **Collateral Care amplifier** — increase heal potency and/or frequency of the auto-potion proc.
- **Confetti upgrade** — same treatment as Fine.: passives make "Look its Confetti!" progressively less embarrassing to cast. Higher DEF/MDF, longer duration, wider radius.
- **Doom acceleration** — reduce Doomganosis countdown, increase severity of the triggered second state, or both.
