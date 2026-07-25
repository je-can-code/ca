# Gun — Pistol

> Parent: [`../gun.md`](../gun.md) · Skill lot: **gunfu** (IDs **61–70** when migrated)
>
> Full row table: [`../../skill-lots.md`](../../skill-lots.md#gun-pistol--lot-gunfu-ids-6170-when-migrated)

Last updated: **2026-06-03**

---

## Identity

| | |
|---|---|
| **Fantasy** | **Gun-fu** — melee string earns **strong shots**; offhand spends TP and **ammo stacks** |
| **Verb** | Connect **melee combo** → **Gun-fu** stacks → **offchain B** (replaces A while stocked) |
| **Tempo** | Main: **connect** `1→2→3` (no `freeCombo`); offchain: **5 TP** per shot (A or B) |
| **Stat** | **LUK** (+ ATK in melee formulas) |
| **Theme** | **gunfu** (runtime state: **Gun-fu** / `\State[43]` today) |

**Empowerment (Gun-fu stacks):**

- **Mainchain3 on connect:** **+1** stack of **Gun-fu** (baseline **stackMax: 2**).
- While **≥1** stack: **offchainA** is replaced by **offchainB** (`skillTransform` — much stronger shot).
- **Firing offchainB consumes 1 stack** — two stacks ⇒ two strong shots before you must melee again.
- **Legacy:** **Flowing Service** prof extend → **folded into mainchain3 base** (no prof gate for earning stacks).

**Not baseline identity:** free melee → infinite stack fishing; crit on every pistol whip (spikes on **B** / **Death Star** via prof).

## Main chain (rows 1–3)

| Row | Job |
|---|---|
| 1 | Short-range melee strike — starter |
| 2 | Short-range melee strike |
| 3 | Combo **finisher** — on connect: **+1 Gun-fu** stack |

**Connect only** — must land the string to bank strong ammo; no `freeCombo` on mains.

## Offchain (rows 4–5)

| Row | Job |
|---|---|
| 4 | **offchainA** — standard long-range shot — **5 TP** |
| 5 | **offchainB** — empowered shot when **Gun-fu ≥ 1** — **5 TP**, **consumes 1 stack** on use |

With **no stacks**, player uses row **4** only. With stacks, row **4** slot resolves to row **5** behavior (transform).

## Prof rows (6–10)

| Row | Name | Effect |
|---|---|---|
| 6 | Snap Crackle Pop | All mainchains: **+3 TP** per hit |
| 7 | PoooooOOOoooP | OffchainA + offchainB: **pierce** |
| 8 | pop Pop PoP POP | **Gun-fu stackMax 2 → 4** |
| 9 | KaPop | OffchainB: **proficiency scaling** in damage formula |
| 10 | Death Star | OffchainB: **charge tier** → massive long-range laser (**`p`** in release formula) |

## Weapon tags (migration)

- `<skillId:61>` row **1**
- `<offhandSkillId:64>` row **4** (transforms to row **5** when empowered)

## Open (migration)

- [ ] Align **Gun-fu** state **stackMax** baseline **2** (legacy **3** today)
- [ ] Death Star charge frames / CD separate from tap **B**
- [ ] Pierce + TP loop tuning with row **6**

## Revision log

| Date | Note |
|---|---|
| 2026-06-03 | **Gunfu lot locked:** Gun-fu stack ammo, 3+2+5 rows, Flowing Service folded into mainchain3. |
