# Gun — Taser

> Parent: [`../gun.md`](../gun.md) · Skill lot: **conduit** (IDs **71–80** when migrated)
>
> Full row table: [`../../skill-lots.md`](../../skill-lots.md#gun-taser--lot-conduit-ids-7180-when-migrated)

Last updated: **2026-06-03**

---

## Identity

| | |
|---|---|
| **Fantasy** | **Pin → flip → fry** on main; **offhand nuke** stands alone |
| **Verb** | Wire a target, close the circuit, **mash** while damage ramps; separate **long-range blast** |
| **Tempo** | Main: **connect** chain `1→2→3` — **no `<freeCombo>`**; row **3** is a commit minigame |
| **Stat** | **MAT + LUK** |
| **Theme** | **conduit** (prof: Lethal Conduit, Tesla Coiling, …) |

**Mainchain3 scaling:** **`thisSkillHistoryBonus`** (rolling window) — **additive +5% damage per hit** in window (baseline **~6s**). Replaces legacy **Tased** stack ramp on the mash skill. **Stopping mash** drops the combo / history — no rising TP cost; row **3** does **not** grant TP (player banks TP elsewhere before committing).

**Offchain:** row **4** is **not** on the main chain — independent **nuke**.

**Prof rows:** **5–10** (global unlock order — see [`../../skill-lots.md`](../../skill-lots.md)).

## Row layout exception

**Three main rows (1–3)** + **one offchain row (4)** + **six prof rows (5–10)** — no offchain row 5.

**Weapon tags (migration):** `<skillId:71>` row **1**; `<offhandSkillId:74>` row **4**.

## Main chain (rows 1–3)

| Row | Job |
|---|---|
| 1 | Mid-range **pin** — single target |
| 2 | Mid-range **flip the switch** — **same** target (requires row **1** connect) |
| 3 | Mid-range **mash frenzy** — only after row **2**; **`thisSkillHistoryBonus`** ramp |

**Gates:** every step **connect-required** — no free combo; no row **3** without completing **1→2**.

**Baseline range:** proximity **~4** (prof **Extension Cord** → **~6** on all mains).

**Ramp (baseline):** **+5% additive damage per hit** over rolling **~6s** (~4 mashes/s ⇒ **~100%** bonus at full press, player-dependent).

## Offchain (row 4)

| Row | Job |
|---|---|
| 4 | **Giant long-range nuke** — off-chain; mean; tune CD/TP at migration |

## Prof rows (5–10)

| Row | Name | Effect |
|---|---|---|
| 5 | Lethal Conduit | Mainchain3 + offchain1: **+1 hit** each |
| 6 | Sizzling Static | Offchain1: **100% paralyze** on connect |
| 7 | Rising Amperage | Mainchain3: **+15% per hit** (was **+5%**) in rolling window |
| 8 | Extension Cord | All mainchains: range **4 → 6** |
| 9 | Big Ass Battery | Mainchain3: rolling window **6s → 10s** |
| 10 | Tesla Coiling | Mainchain3: **proficiency (`p`) scaling** in formula |

## Open (migration)

- [ ] Pin / same-target enforcement for row **2** (legacy `directStateTarget` pattern)
- [ ] Offchain **CD** + **TP** cost for nuke
- [ ] Execution history stack cap (if any) at extreme mash rates
- [ ] Boss paralyze immunity vs **Sizzling Static**

## Design note — mash-to-reduce-nuke-CD (deferred)

During javelin/rend design (2026-06-25), the idea surfaced of a notetag like `<thisReduceCooldown:[OTHER_SKILL_ID, AMOUNT_PER_USE]>` — "each use of this skill reduces another skill's cooldown." Taser was identified as a natural fit: **mashing row 3 reduces the offhand nuke CD**, rewarding sustained mash commitment with faster nuke access. Not designed or specced; flagging for when this lot gets implemented.

## Revision log

| Date | Note |
|---|---|
| 2026-06-03 | **Conduit lot locked:** pin→flip→mash + independent nuke. |
| 2026-06-25 | Added design note: mash-to-reduce-nuke-CD concept deferred from javelin discussion. |
