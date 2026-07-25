# Onboarding & tutorial backlog

> Action list derived from [`design-contract.md`](../design-contract.md).
> Goal: **story racers** still touch build+gear pillars once; grinders can ignore repeated prompts.

---

## Principles

1. **Do once, in fiction** — Jerald/Rupert bickering beats a neutral tutorial voice.
2. **Success gate** — player must **complete** an action (craft, equip, refine), not open a menu.
3. **Questopedia is source of truth** — every beat gets `active` / `completed` log lines.
4. **Don’t tutorialize mastery** — parry, anomalies, flux drives stay Tier C.

---

## P0 — Fixes “grindy friend skipped the game”

| ID | Beat | Gate | Unlock / script refs |
|----|------|------|----------------------|
| T-01 | **Smith is not optional** | `main-003` mansion entry blocked until `side-001` complete OR inline main step: “get Viktor sober” | `Smithing init` (CE 32), Creation smith categories (CE 21) |
| T-02 | **Craft your first weapon** | Cannot enter mine hole until party has **any JAFTING-crafted weapon** equipped | Verify recipe keys in CE 32; give materials in mansion wing if needed |
| T-03 | **Invest SDP points (soft)** | After **`???`** on **Map 14** (`mysterious figure`, Adventurer’s Fork): nudge to open **Empower** and spend **core points** into `ENC_1` / `FGT_1` (panel level ≥ 1). Panels are **unlocked** here; investment is optional (see Map 14 event—matches encourage-only design). Not a mine blocker unless we promote to Tier B | Switch **104**; `J-SDP` Unlock `ENC_1`, `FGT_1` |
| T-04 | **Armor path on main rail** | Move `Survival init` (CE 33) to **main** beat—e.g. Millie during `main-004` forest step, not optional wander | `survive-*` categories (CE 27) |
| T-05 | **Craft one armor piece** | Soft block kingdom route (`main-004`+) until one of off/body/feet crafted | Materials from Millie or shop |

---

## P1 — Clarity without force

| ID | Beat | Notes |
|----|------|-------|
| T-10 | Hub facility quest | Short “lap Raevula” with checkboxes: inn, shrine, smith, flux facility, merchant |
| T-11 | Refinement intro | Viktor or Viskra: refine one piece before Ch3 gear check |
| T-12 | Weapon family blurb | CMS equip or first weapon equip: one line per family role |
| T-13 | Danger / level read | Enable Danger Indicator for Ch1–3 **or** quest text: “if TTK > 60s, leave and level” |
| T-14 | Save tutorial in intro cave | Per walk doc TODO |

---

## P2 — Mastery & optional systems

| ID | Beat | Notes |
|----|------|-------|
| T-20 | Training rift ping | After first +10 level death, Questopedia hint to `train-000` |
| T-21 | Parry payoff showcase | Optional trap room reward for perfect parry (state/card) |
| T-22 | Omnipedia nudge | After first named enemy panel drop, open Monsterpedia once |
| T-23 | Flux facility | After first difficulty complaint, point to spatial flux engine |

---

## Done when

- [ ] New playtester (story-only) has crafted **food, weapon, armor** by end of Ch1–2 without wiki.
- [ ] Quest log shows **why** each craft mattered (one joke line each).
- [ ] Grinder can skip repeat prompts via switch (e.g. “tutorial complete”).

---

## See also

- [`design-contract.md`](../design-contract.md) — tiers A/B/C  
- [`walk/chapter1.md`](../walk/chapter1.md) — intended beats  
