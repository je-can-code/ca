# Fork 2C — Splattershot

> Lazy contempt. Move in, BLAM them back. Step closer. BLAM. Methodical, AFK energy, deeply unimpressed with whatever it's shooting.
>
> **Trunk:** [Quicksilver](./trunk.md)
>
> **Natural weapons:** shotgun (boomstick — freeCombo spread, bleed, reload-to-clap)
>
> **SDP affinities:** Guardian, Artillery

**Block size:** 20 (4 combat + 8–12 passive target, remainder spare)

---

## Combat skills (4)

| # | Name | Description |
|---|---|---|
| 1 | March | Toggle. −30 MSB, +30% DEF/MDF, knockback immunity. You cannot be stopped. Getting close means consequences. |
| 2 | Shrapnel | Active. Applies a self-state; that state carries `<applyState:[BLEED_ID, CHANCE, DURATION, 20]>` and is consumed by the next skill used — delivering 20 bleed stacks to whatever you just hit. Fuck you. |
| 3 | Avalanche | Active. 150° cone, radius 3, knockback 3. The BLAM. Nobody uses the shotgun's version after learning this. |
| 4 | Entire Clip | Active. Unload everything into a massive forward cone. Glorious for you, not for them. |

---

## Passives

> TBD — second pass after all combat skills are defined across all trunks and forks.

### Passives uncovered during combat design

- **Magazine Enhancement** — new tag needed: `+N to stack cap on any positive state applied to self`. Example: default reload cap 4 → 6 with this passive equipped.
