# Subgroup authoring flow

> Drop-in context for Claude. Read this at the start of a subgroup session.
>
> **Supporting docs:**
> - [`mastery-cheatsheet.md`](./mastery-cheatsheet.md) — IDs, act names, rarity/maxRank, tag cookbook, progress tracker
> - [`panel-parameters-cheatsheet.md`](./panel-parameters-cheatsheet.md) — archetype UP/DOWN pools, perRank rules
> - [`archetype-mapping.md`](./archetype-mapping.md) — full archetype + subgroup flavor designs
> - [`implementation-status.md`](./implementation-status.md) — notetag cookbook, shipped vs pending hooks

---

## Hard-learned rules (read these first)

- **Identity is the `subgroupKey`, not the display name.** Say `slime-puddle`, not "Puddle".
- **Before writing any JSON, read a verified neighbor entry first.** Confirm trait codes, field names, and shape. Do not guess trait codes — `11` is element rate, `23` is SP param rate; they are not interchangeable.
- **Let scripts do all arithmetic.** No mental math on accumulation totals. Write a bun inline script and trust the output.
- **Rate params (`fdr`, `pdr`, `mdr`, `cev`, etc.) use `isFlat: true`.** Percent-style `isFlat: false` is for unbounded stats that amplify a base value. Fixed-scale 0–100 params are flat.
- **Payload states must differ per tier if the spec says they differ.** Re-read the agreed spec before authoring — identical states pointing at the same effect is a silent wrong.
- **All arithmetic totals should be round numbers.** If an accumulation lands on a weird number, use the capstone tier as the tuning knob to hit the target cleanly.

---

## Step 0 — What is all this?

The **SDP (Stat Distribution Panel)** system is an alternative stat allocation system for the player and their party. Players spend points — earned primarily by defeating enemies, or from usable items — to rank up panels, each of which grants bonuses (and sometimes penalties) to specific parameters like ATK, HIT, REC, or CDM. Each panel has a fixed number of ranks, with rank costs scaling by rarity (similar to RPG leveling). Panels are ranked up per-battler independently.

Points are awarded to all party members simultaneously when earned (e.g. on enemy defeat). Each party member maintains their own personal point pool, and spending points on a panel draws from that individual's pool only — one character ranking up a panel does not affect anyone else's pool or progress.

Panels are colloquially called just **"panels"**.

In **Chef Adventure**, panels are the primary balance and design lever for player expression — they let players build toward their ideal party makeup. Each panel is associated with a combat **archetype** (Berserker, Wizard, Vanguard, etc.), with a set of core stats that always go up and always go down, plus secondary stats that rotate in and out across the strip's tiers.

### How panels are organized

Enemies are grouped into **10 families**, each containing **5 subgroups of 10 tiers** — approximately 500 enemies total. A subgroup is 10 escalating tiers of the same enemy type (e.g. ghosty → creepy → spooky → ...), with higher tiers having stronger base stats and potentially richer skill sets. Each enemy in a subgroup drops its corresponding panel, so farming a subgroup rewards the player with the playstyle of that enemy.

The 10 panels in a subgroup form a **strip**. Strips are divided into three **acts**:
- **Beginning (tiers 1–3):** entry-level potency, base effect established
- **Middle (tiers 4–9):** ramping potency, optional behavior layers added
- **End (tier 10 — capstone):** qualitative shift or dramatically amplified power, intentionally strong

### Masteries

Almost every panel also grants a **mastery** — a skill the battler learns when ranking up that panel. The mastery skill is a "wrapper": it does nothing on its own, but carries a `<passive:[STATE_ID]>` tag pointing to a state of the same ID. That state holds the actual mastery effects via notetags from the plugin ecosystem. The wrapper skill is hidden from the JABS quick menu (`<hideFromJabsMenu>`) but is visible in the standard skill menu under its assigned skill type. Masteries are thematically tied to the enemy subgroup and its archetype — farming Ghosty panels doesn't just make you hit harder with magic, it makes you *fight like a ghost*.

**Mastery passives always live on the ally that unlocked them** — never on enemies. Enemies do not receive mastery passives and will never use them against the player. The effects may still act adversely against enemies (e.g. a mastery that extends the duration of debuffs the ally applies to foes), but the passive itself is always on the ally side.

The capstone (tier 10) mastery is intentionally powerful — sometimes dramatically so. This is by design: acquiring a tier-10 panel drop from the highest-tier enemy of a subgroup is a meaningful feat, and the 20-rank point investment compounds that cost. Players who reach a capstone mastery are *supposed* to feel godly.

This document iterates over subgroups one at a time, authoring their panel parameters and masteries in sequence.

## Step 1 — Find the current strip

Check [`mastery-cheatsheet.md` § Authoring progress](./mastery-cheatsheet.md#authoring-progress-one-subgroup-at-a-time) for the 🔄 row. Note the subgroup name, `subgroupKey`, panel prefix (`KEY_*`), mastery ID band, and archetype.

Then pull the subgroup's flavor twist and mastery mechanic from the family table in the same doc and from [`archetype-mapping.md`](./archetype-mapping.md). Summarize both for JE before proceeding.

---

## Step 2 — Panel parameters

Propose a full parameter spread for the subgroup based on its archetype (UP/DOWN pool) and flavor twist. Present two things:

1. **Proposed panel rows** — a table of `parameterKey`, `perRank`, `isCore` for a representative tier (e.g. tier 5), with a note on how potency scales across tiers 1–9 and the capstone.
2. **Accumulated bonuses chart** — write and run an inline Bun script that calculates, for each parameter, the total bonus a player would accumulate by maxing every panel in the strip (perRank × maxRank, summed across all 10 panels).

Fiddle with JE until the spread feels right, then write the finalized values to `config.sdp.json` **using a single bun script** — load the file, patch all panels in memory, write it back in one operation. Never use serial Edit tool calls on the JSON directly.

**Rules (non-negotiable):**
- `isFlat: false` always.
- Every non-Generalist strip has at least one DOWN row.
- `isCore: true` on 2–4 rows only — identity UPs + primary DOWNs only. Flavor twist stats are NOT core.
- **4–5 rows per panel, not all stats on every tier.** Core params (`flavor UP` + primary DOWNs) appear every tier. Secondary UPs (`hrg`, `pha`, `mhp`, `lst`, etc.) rotate in across tiers — typically 3–5 appearances each, sprinkled across the strip. Never dump all secondaries on every panel.
- **`maxRank`: tiers 1–9 = `10`, tier 10 (capstone) = `20`. Always. No exceptions.**

---

## Step 3 — Mastery tiers

Discuss the mastery mechanic with JE — clarify intent, hook availability, and any P2 gaps. Then propose the three-act breakdown:

- **Beginning (tiers 1–3):** base effect, softest potency
- **Middle (tiers 4–9):** ramping potency, optional behavior layer
- **End (tier 10):** capstone — qualitative shift or maximum potency

Get agreement, then write the mastery effect tags into the mastery states in `States.json`.

**Pre-authored:** All mastery wrapper skills (with `<hideFromJabsMenu>` + `<passive:[N]>`) and all mastery state shells are already authored for every subgroup. Step 3 is purely filling in the custom effect tags on the states — never creating skills or state shells from scratch.

**Rules:**
- Skill `N` = State `N` (same ID). All effect tags go on the state, not the skill.
- Act names come from the three-act name index in mastery-cheatsheet — don't invent new ones.
- If a payload band is needed (e.g. ward states, venom states), claim the next free range and note it in the cheatsheet.

---

## Step 4 — Wire the test map

Run the unlock script to swap the test map (Map357, event 2) to the current subgroup's panel prefix:

```bash
bun chef-adventure/tools/rewrite-sdp-unlock-prefix.mjs --from PREV --to KEY --map 357 --apply
```

Replace `PREV` with the previous subgroup's prefix and `KEY` with the current one (e.g. `--from AER --to CUB`).

---

## Step 5 — Test

JE plays it. Debug and fix anything that surfaces. Repeat until LGTM.

---

## Step 6 — Mark verified

Once JE says LGTM, update [`mastery-cheatsheet.md` § Authoring progress](./mastery-cheatsheet.md#authoring-progress-one-subgroup-at-a-time):

1. Change the current 🔄 row to ✅ **Verified**.
2. Change the next row to 🔄 **Current**.
3. Increment the counter (e.g. `14 / 48` → `15 / 48`).
4. Update the `Last updated:` date and the summary line (family progress).
