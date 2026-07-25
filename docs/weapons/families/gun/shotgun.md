# Gun — Shotgun

> Parent: [`../gun.md`](../gun.md) · Skill lot: **boomstick** (IDs **81–90** when migrated)
>
> Full row table: [`../../skill-lots.md`](../../skill-lots.md#gun-shotgun--lot-boomstick-ids-8190-when-migrated)

Last updated: **2026-06-03**

---

## Identity

| | |
|---|---|
| **Fantasy** | **Boomstick** — wide spread, bleed, shove; **load to clap** |
| **Verb** | **`freeCombo`** main blasts; offhand **reloads shells** that buff the next main **presses** |
| **Tempo** | Main: **`freeCombo`** on rows **1–2**; **~2s CD** on main combo (prof → **~1s**) |
| **Stat** | **LUK** |
| **Theme** | **boomstick** (prof: Rustshot, Messyshot, …) |

**Bleed:** **baseline on both mains** — **50%** on connect (not prof-gated). Prof escalates bleed payoff and stacks.

**Shells (offchain reload):** **Reload** adds **2** stacks (name TBD at migration). While stacked, each **main button press** (row **1** or **2**) consumes **1 shell** and deals **+50% damage** on that shot. **One press = one shell** — not per hit/pellet.

**No ammo-equip layer** in base kit — prof upgrades **default shell** and main effects only.

## Row layout exception

**Two main rows (1–2)** + **one offchain row (3)** reload + **seven prof rows (4–10)**.

**Weapon tags (migration):** `<skillId:81>` row **1**; `<offhandSkillId:83>` row **3** (reload).

## Main chain (rows 1–2)

| Row | Hitbox (draft) | Job |
|---|---|---|
| 1 | Arc **140°**, **3.2** radius | Mid range spread — **50% bleed** |
| 2 | Arc **140°**, **3.2** radius | **50% bleed** + **1 tile knockback** |

**`<freeCombo>`** on both — fire main to your heart’s content on tempo (both bleed; no connect gate).

**Main combo CD:** **~2s** baseline (tune per-row at migration); prof **Quickshot** → **~1s**.

## Offchain (row 3)

| Row | Job |
|---|---|
| 3 | **Reload** — **+2 shell** stacks; each stack = **+50% damage** on next **main press** (consumes **1** stack per press) |

Reload CD tune at migration (separate from main combo CD).

## Prof rows (4–10)

| Row | Name | Effect |
|---|---|---|
| 4 | Rustshot | Mainchains: **+100% damage vs bleeding** targets |
| 5 | Messyshot | Mainchains: **+2 bleed stacks** on apply (on top of existing) |
| 6 | Bountyshot | Reload: **2 → 4** shell stacks |
| 7 | Slingshot | Mainchain2: knockback **1 → 2** tiles |
| 8 | Hustleshot | Reload: also **+25% move speed** (short duration) |
| 9 | Quickshot | Main combo CD **2s → 1s** |
| 10 | Splattershot | Mainchains: **1 → 3** hits per shot |

## Loop (base)

**Boom boom** on **`freeCombo`** (bleed spread) → **reload** when ready → **clap** with shell-buffed main presses → repeat. Prof deepens bleed punish, shell capacity, shove, mobility, tempo, pellet count.

## Open (migration)

- [ ] Shell stack state name + HUD
- [ ] Reload **CD**
- [ ] Main CD application with **`freeCombo`** (per-skill vs shared gate)
- [ ] Damage tuning: **2s** string worth vs other weapons

## Revision log

| Date | Note |
|---|---|
| 2026-06-03 | **Boomstick lot locked:** freeCombo main, reload shells, bleed baseline, prof 4–10. |
