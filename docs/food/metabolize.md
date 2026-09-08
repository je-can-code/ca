# Metabolize — the panic button

> **Status as of 2026-09-07: engine built, skills and states authored, first-draft numbers in the
> database.** Every tag, resolver and hook described below ships in `rmmz-plugins`. Skills 231-248 and
> states 254-280 (the twelve post-burn slots) are authored in `Skills.json` / `States.json`, and all
> eighteen food states carry their `<slotTransform:>`. The numbers are a first draft meant to be tuned
> in play; see [The authored set](#the-authored-set). What remains is listed under
> [What is blocked](#what-is-blocked).
>
> **Related:** [`food-chain-durations.md`](food-chain-durations.md) (the arcs this consumes),
> [`recipe-system.md`](recipe-system.md) (where the ammo comes from),
> [`../enemies/drop-sources.md`](../enemies/drop-sources.md) (the drop tables this empties out).

---

## Why this exists

Food used to be how you healed — you ate it like potions, bottle and all. Food is now a **buff** system
with three-phase arcs, which quietly removed the only generic healing in the game and nobody noticed
until the hole was several systems deep.

Auditing what actually heals a player today:

| Source | What it is | Live? |
|---|---|---|
| Blueberries (2), Banaberry (4) | `<useOnPickup>`, 15% MHP, auto-consumed on walkover | **yes** — 377 drop rows each |
| Tiny Heartfruit (8) | `<useOnPickup>`, 40% MHP | **yes**, barely — 9 drop rows, all on `!` bosses |
| Heartfruit (9), Redberry (1), Nectar (10) | 15%-100% MHP | **no** — zero drop rows anywhere |
| Serum (5) | 100% MHP, occasion "always" | **no** — zero drops, zero shops, zero recipes |
| Draught (7) | 50% MHP, `<cooldown:18000>` | **no** — same, fully orphaned |
| Food chain states | 18 states across six groups | **no** — zero `hrgBuffPlus` anywhere in the system |
| Class kits | lifesteal, Medick sustain, passive regen | yes, but **build-gated and late** |

The entire live healing economy is therefore **three items**, and 754 of their 763 drop rows are two
kinds of berry.

**The fiction problem.** A Tsukumogami in the Fallen Kingdom does not drop a lively bunch of blueberries.
Every enemy dropping fruit was fine when berries were a Zelda heart; it is incoherent now that the game
has an ecology and a drop economy with opinions. Nerfing the berries fixed the numbers and left the
fiction exactly as broken as it was.

**The verb problem, which is the real one.** There has never been a moment where the player thinks
*"oh shit, I need to heal FAST"* and has an answer. Berries are attrition recovery you cannot aim.
The missing thing is not healing volume. It is **a deliberate action taken at a chosen moment.**

### Why food-as-regen was rejected

The obvious fix — put HP regen on the Well Fed phase — was considered and dropped:

- **Being full is not the same as recovering.** You wolfed a bowl of Rib Broth; you are not convalescing.
- **It leaves the arc's other five-plus minutes doing nothing.** Regen on entry, then dead air.
- **It still never produces a burst.** The panic moment stays unanswered.
- **Food-as-direct-heal is worse:** a 2-10 minute arc is a 2-10 minute cooldown on burst healing, and no
  heal magnitude compensates for that.
- **250+ dishes cannot each carry a heal value.** They would blur into indistinguishable numbers, and the
  dishes are supposed to be differentiated by their *buffs*.

---

## The mechanic

**Food is not the heal. Food is the ammo.**

You are not regenerating, you are **metabolizing**. The meal was already spent when you ate it; what you
burn now is the fullness sitting in you. Mechanically it is an ordinary skill executed through the
ordinary action pipeline, which locks you in place and plays the cast pulse — you stand still and work
the meal off, violently, on the spot.

### The trigger: R2 does the food thing appropriate to your state

Food already owns a dedicated input — `JABS_Button.UsableItem`, the R2 slot, which `J-ABS-Food` routes
food items to and excludes from the tool slot. Metabolize needs no new controller real estate, because it
is not a new verb on a new button. It is **the same button meaning the same thing**, resolved against
whether you currently have food in you.

| Player state | R2 does |
|---|---|
| No active food chain | **Eat.** Unchanged. |
| Any active phase — Well Fed, Peak, **or Tail** | **Metabolize.** Burn the chain for HP. |

Metabolizing is available in the tail on purpose. The dregs are worth less than a fresh meal, but the tail
stops being dead time — you are still carrying a charge, just a smaller one.

### What it costs

**Metabolizing ejects you from the food chain completely.** Not to the tail, not to Hangry, not to a
consolation phase — the chain is over, one hundred percent gone. You traded your buff for your life.

Once ejected you have no food state, so R2 means "eat" again and you may immediately eat another dish. The
limiter on the panic button is therefore **what you packed**, not a cooldown. That is Estus-shaped, and it
is the first thing in the game that makes cooking output genuinely get consumed.

---

## How it is wired

Three tags, and only one of them is new to the food extension. The other is J-ABS core's, and it was
built to be general on purpose.

### `<slotTransform:[SLOT_KEY, SKILL_ID]>` — J-ABS core, on any note source

Redirects an entire slot to a skill regardless of what is equipped in it.

```text
Structure:
 <slotTransform:[SLOT_KEY, SKILL_ID]>

Example:
 <slotTransform:[UsableItem, 512]>

Translation:
 while this note source is active, R2 executes skill 512
```

This is the slot-keyed sibling of the existing `<skillTransform:[BASE, OVERRIDE]>`. The distinction is
the whole reason it had to exist: a skill transform asks *"what is in this slot, and does anything
replace it"*, which cannot answer for a slot holding an **item id** or holding **nothing**. A slot
transform asks only *"which slot is this"*, so it reaches both. `getResolvedSkillId` had been
short-circuiting `Tool` and `UsableItem` out of transform resolution entirely, by name, with a comment
saying why; the slot transform is checked before that short-circuit.

**Put it on the food states.** That placement is the flexibility of the design: a chain's three phases
can each name a different skill, so burning a fresh meal and burning the dregs are not the same move.
Across six groups of three phases that is up to **18 distinct burns** to author, against 250+ dishes that
need none. Group identity extends past the buff — carbs burn slow and heal big, vegetables burn quick and
cheap, sweets burn fast and hot — and all of it is authored in ordinary skills.

Because states outrank equips, class and database row in the precedence chain, the arc claims the button
for exactly as long as it runs and hands it straight back when it lapses.

**Display resolves through the same path.** `JABS_SkillSlot.data()` would otherwise answer the icon,
name and cost question using the slot's *stored* type, so a transformed R2 holding a Rib Broth would
look up the metabolize skill id in `$dataItems` and draw whatever unrelated row lived at that index. It
now asks the user whether the id it was handed came from a slot transform, and treats it as a skill when
it did. Same for an empty slot, which used to refuse to draw anything at all.

### `<endFoodChain>` — J-ABS-Food, on skills

Executing a skill with this tag ends the caster's active food chain.

**Omitting it is a design choice, not an oversight, and nothing warns about its absence.** A skill that
burns fuel without spending the arc is an **endurance move** — bounded by the chain's own duration
rather than by a single use. That is a whole authoring lane: an "exercise fuel" chain whose burn is a
five-second set of squats you can repeat until the fuel runs out on its own.

### `<foodChainImpervious>` — J-ABS-Food, on any note source

The bearer's chains never end from a chain-ending skill. They still execute the skill and still receive
everything it does; they simply keep the arc. Read from every note source via `getAllNotes()` — passive,
equip, state, class or the battler's own row.

---

## Who ends the chain

**Core dispatches; the food extension listens.** This is the opposite of what an earlier draft of this
document argued, and the reason it flipped is worth keeping.

The original argument was that a dispatcher should not re-derive a fact it already holds — if the food
system fired the skill, it knows a burn happened and should end the arc itself, rather than trusting the
skill to declare it. That was correct for a design where the food system did the dispatching. Under
`slotTransform` it does not: **J-ABS core resolves the slot and executes the skill, and the food
extension never sees it happen.** So the tag on the skill is not a redundant restatement. It is the only
signal that exists.

The hook is `JABS_Engine.onExecuteMapAction`, aliased in the food extension — core's own documented seam
for "actions that happen as a side effect of executing an action". Every executed action passes through
it; the tagged ones end an arc, and everything else is untouched.

Reading the tag off the skill rather than tracking the dispatch also buys something the tracked version
could not: **an enemy attack can carry `<endFoodChain>` too**, and take the player's meal away.

### One correction worth recording

`forceMapAction` was the obvious way to execute the burn, and it is the wrong one. It builds the actions
and calls `executeMapAction` directly, seeding **no cast countdown at all** — the skill would fire
instantly with no root, no pulse, no exposure. The path that seeds a cast is the ordinary combat one
(`setDecidedAction` then `setCastCountdown`), so `performUsableItemAction` routes a transformed slot
through `performCombatAction` instead. Since the entire balance argument below rests on cast duration,
this was not a detail.

---

## What gets removed

### Berries

Blueberries (2), Banaberry (4) and Tiny Heartfruit (8) come out, along with their drop rows — 763 native
`dropItems` entries across the enemy roster, plus the `*Grass` and `*Mining Crate` harvest events. **This
empties a lot of drop tables, and what backfills them is unresolved.** Those rows were doing pacing work
as well as healing work.

Redberry (1), Heartfruit (9) and Nectar (10) heal but drop from nothing, and Serum (5) and Draught (7)
are orphaned outright — zero drops, zero shops, zero recipes. All five need a decision: delete them, or
give them a real place. None of them is the panic button. Metabolize is.

### Overstuffed and Bloated (states 281, 282)

Both come out, and the `overstuffed` chain type with them. The plugin side is already done: the
`ChainType` enum is gone, `#triggerOverstuffed` is deleted, and `resolveEat` now collapses to *no chain
→ start* / *any chain → replace*.

Overstuffed existed to punish food spam. **In the new design that brake is not removed, it is replaced
with a harder one:** you cannot eat while fed *at all*, because that button is doing something else. A
debuff is a tax you can choose to pay; this is simply not an available action.

Until states 281 and 282 are deleted from `States.json` they will still carry `<foodChain:overstuffed>`
and register an orphaned chain type at boot. That is expected and harmless — nothing routes to it any
more.

### `<overstuffedImpervious>` → Battlefield Banquet's new privilege

The tag was authored in exactly one place: **state 1500, Battlefield Banquet**, applied by passive skill
1500, granted by the **`humanoid-kobold` tier 10 subgroup mastery** (`config.sdp.json`, `sdps[442]`). Its
kit is PHA x2 and ATK/DEF/MAT/MDF/AGI/LUK all at x1.25, and its fantasy is *"food is not a constraint for
me, and food works better on me."*

That fantasy survives intact, pointed at the new verb: **Battlefield Banquet lets you metabolize without
ending your arc.** Burn for the HP, keep the buff. Same panel, same passive, same icon, same mastery.
**This retag is done** — state 1500 now reads `<foodChainImpervious>`.

A suppressor rather than a second skill was deliberate. Overriding the slot transform at higher state
priority would have worked, but it would have replaced *every* group's metabolize with one generic
workout skill, flattening exactly the per-group burn flavor the design rests on. The suppressor leaves
your protein burn feeling like a protein burn and just declines to charge you the meal — which is what
the passive claims, rather than "I do a different exercise".

Worth noting for scheduling: tier 10 is deep in the reserved headroom described in the SDP design, well
past where authored content currently reaches, so nothing in a real playthrough has this today.

---

## The authored set

Authored 2026-09-07. All numbers are a first draft; tune in play. Heals are the editor's HP Recover
damage formula (popups, REC and HAR all apply). Well Fed burns are 70% of Peak, Tail burns 40%. Well Fed
and Peak burns apply the group's Spike; Tail burns apply the Afterglow directly. Every skill carries
`<cannotMoveToInterrupt>`, `<thisCannotBeInterrupted>`, `<cooldown:0>`, `<hideFromJabsMenu>`,
`<endFoodChain>` and the squish burst (`<juiceMotion:squish>` with a repeat count and duration).

**Peak burns hottest, deliberately.** Processed fuel burns best, which puts the biggest heal on the exact
phase where the buff is also at its best. That is where the decision lives.

| Id | Skill | Group / phase | Cast | HP heal | Secondary | Applies |
|---|---|---|---|---|---|---|
| 231 | Bulk Up | carb / Well Fed | 90f | `a.mhp * 0.53` | | Bulked |
| 232 | Bulk Up | carb / Peak | 90f | `a.mhp * 0.75` | | Bulked |
| 233 | Bulk Up | carb / Tail | 60f | `a.mhp * 0.30` | | Sturdy |
| 234 | Churn | dairy / Well Fed | 75f | `a.mhp * 0.32` | `<mp-gain:[a.mmp * 0.42]>` | Milk Drunk |
| 235 | Churn | dairy / Peak | 75f | `a.mhp * 0.45` | `<mp-gain:[a.mmp * 0.60]>` | Milk Drunk |
| 236 | Churn | dairy / Tail | 45f | `a.mhp * 0.18` | `<mp-gain:[a.mmp * 0.24]>` | Lactose Tolerant |
| 237 | Flex | protein / Well Fed | 60f | `a.mhp * 0.42` | `<tp-gain:[a.maxTp() * 0.21]>` | Swole |
| 238 | Flex | protein / Peak | 60f | `a.mhp * 0.60` | `<tp-gain:[a.maxTp() * 0.30]>` | Swole |
| 239 | Flex | protein / Tail | 45f | `a.mhp * 0.24` | `<tp-gain:[a.maxTp() * 0.12]>` | Toned |
| 240 | Cleanse | vegetable / Well Fed | 60f | `a.mhp * 0.25` | HoT via Second Wind | Second Wind |
| 241 | Cleanse | vegetable / Peak | 60f | `a.mhp * 0.35` | HoT via Second Wind | Second Wind |
| 242 | Cleanse | vegetable / Tail | 30f | `a.mhp * 0.14` | | Purified |
| 243 | Radiate | fruit / Well Fed | 45f | `a.mhp * 0.32` | scope All Allies, `<radius:3>` | Radiant |
| 244 | Radiate | fruit / Peak | 45f | `a.mhp * 0.45` | scope All Allies, `<radius:3>` | Radiant |
| 245 | Radiate | fruit / Tail | 30f | `a.mhp * 0.18` | scope All Allies, `<radius:3>` | Zesty |
| 246 | Rush | sweet / Well Fed | 30f | `a.mhp * 0.25` | `<aggro:-300>` | Sugar High |
| 247 | Rush | sweet / Peak | 30f | `a.mhp * 0.35` | `<aggro:-300>` | Sugar High |
| 248 | Rush | sweet / Tail | 15f | `a.mhp * 0.14` | `<aggro:-300>` | Sugar Crash |

Carb has a built-in twist worth knowing: Well Fed (carb) is MHP×1.25 and Fortified MHP×1.1, so burning
drops your ceiling before the heal lands. Formulas read post-burn MHP. At low HP nothing clips; near full,
burning carbs literally shrinks you. The bread was holding your HP up.

### The post-burn states

Spike → Afterglow, chained with `<applyStateOnExpire>`. These are **plain buffs, not food chains**: no
`<foodChain:>` tag, no `<slotTransform:>`. So R2 means *eat* during them, and eating leaves them alone,
which is what allows eat → burn → eat to stack Well Fed with a Spike (never Peak with a Spike; re-eating
restarts the climb). Regen tags are flat per tick at two ticks a second. CRI/EVA use the same +100%
magnitude the existing peaks use, since those stats are contested.

| Id | State | Duration | Effects |
|---|---|---|---|
| 254 | Swole | 25s | ATK×1.3, `<lst:10>`, `<knockbackResist:1>` |
| 255 | Toned | 60s | REC×1.15, `<hrgBuffPlus:[a.mhp * 0.001]>` (~12% over the minute) |
| 259 | Second Wind | 20s | `<hpPercent:1>` (2%/s, 40% total) |
| 260 | Purified | 60s | MDF×1.1, `<har:25>` |
| 264 | Radiant | 20s | AGI×1.25, CRI+100%, `<lst:15>`, `<onSelfHpHealHp:[50, 3]>` |
| 265 | Zesty | 60s | `<trgBuffPlus:[2]>` (4 TP/s) |
| 269 | Bulked | 30s | DEF×1.3, PDR×0.7, `<critReduction:50>`, `<knockbackResist:2>` |
| 270 | Sturdy | 60s | DEF×1.1, MHP×1.05 |
| 274 | Milk Drunk | 25s | MAT×1.3, MCR×0.7, `<castSpeedRate:[-40]>` |
| 275 | Lactose Tolerant | 60s | MDF×1.1, `<mrgBuffPlus:[a.mmp * 0.002]>` (~24% over the minute) |
| 279 | Sugar High | 15s | EVA+100%, `<speedBoost:40>`, `<cdr:[50]>` |
| 280 | Sugar Crash | 45s | LUK×0.75, `<speedBoost:-10>` (the one negative Afterglow, by design) |

Radiant is the "I hit something, I splash healing" version: lifesteal routes through `gainHp` → `onHeal`
→ `HealEventManager.dispatch`, which reads the recipient's states, so the on-state `<onSelfHpHealHp>` fires
on every lifesteal tick. `on-attack-hp-gain` is skill-only and was never an option here.

### Chain fixes applied alongside

- **252 Pumped:** `<cdm:50>` was a dead tag (nothing parses bare `<cdm:`). Now `<cdmBuffPlus:[50]>`.
- **261 Well Fed (fruit):** had no traits at all. Now AGI×1.1.

### Cosmetic picks, all swappable in the editor

- Skill icons reuse each group's Well Fed food icon, so R2 shows the food being burned: carb 1964, dairy
  1953, protein 2097, vegetable 285, fruit 265, sweet 1952.
- Spike icons reuse the group's Peak icon (35-40); Afterglows reuse the Well Fed food icon; Sugar Crash
  reuses Gassy's (2727).
- Animation 41 "Heal One 1" on every self-burn; 43 "Heal All 1" on Radiate.
- Squish burst: 8 squats over 60f for carb, 4 over 30f for sweet, 6 over 45f for everything else.

---

## Balance

**The cast duration is the knob.** Skills in JABS are not interrupted by damage, and `JABS_InputAdapter`
gates input on `isCastingOrChanneling()` in three places, so a burn cannot be double-tapped or knocked
out of you. What that leaves is the only cost that matters: **you are standing still, and things are
hitting you the entire time.**

Longer squat, bigger heal, more exposure. The "carbs work off slower but heal more" idea therefore has
two ends, and the front end — how long you are a stationary target — is the one the player actually
feels.

Two consequences, both accepted deliberately:

- **Metabolize is proactive, not a last resort.** At 5% HP against anything with real damage output you
  will die mid-squat. The game saying *"too late"* is the correct answer, and it means the interesting
  decision happens at 50%, not at 5%.
- **Finding a safe window in a boss fight is the "Wait" verb** from the five-verb boss framework. The
  framework's own finding was that a real vulnerability window does not debut until boss 5; metabolize
  gives the player a reason to *want* one much earlier, and teaches window-reading before any boss
  demands it.

This also keeps the **+10 level rule** honest for free. Against something ten levels up, a window long
enough to metabolize in does not exist.

### Where sustain sits in the ladder

Not every class needs self-healing, and giving it to everyone would flatten Medick into a rounding error.
The intended shape is a ladder:

| Rung | What it is |
|---|---|
| **Floor** | Metabolize. Universal, on R2, live from `main-002` when cooking unlocks. |
| **Build** | Lifesteal, Medick sustain, passive regen — buys you partial independence from packing lunch. |
| **Capstone** | Battlefield Banquet — metabolize without spending the meal. |

The capstone is, straightforwardly, an unlimited heal bounded only by cast-time exposure. That is
intended rather than a hole: it is gated behind a tier 10 mastery, and an author who wants a repeatable
burn at any tier can simply omit `<endFoodChain>` from that chain's skill. The engine has no opinion
about which of those is "correct".

---

## Settled rules

Answered 2026-09-07. All four need no engine work — the behavior already falls out of what shipped.

**Metabolizing at full HP is allowed, not blocked.** A metabolize skill is not necessarily a pure heal;
it may carry buffs or other payloads worth having at any health. Wasting the heal is the player's call.

**Allies never metabolize.** The R2 slot is removed from their purview entirely, exactly as usable items
already are. This is also true by construction twice over: `resolveEat` applies the arc to the **leader
only** (buffet effects go party-wide, chain states do not), so an ally has no chain to burn.

**The skill owns its costs.** Nothing food-specific gates MP or TP — the ordinary skill cost check does,
and it already runs on this path: `getAttackData` calls `meetsSkillConditions` against the **resolved**
skill id and returns no actions when it fails, which makes the button decline to fire. Chef Adventure's
own metabolize skills will not carry costs beyond cast time, but the gate is there for anything that
wants one.

**R2 metabolizes anywhere in the arc**, Well Fed through tail, with no exceptions and no re-feed input.
The food states carry the slot transform; executing the skill ends the chain unless the battler carries
`<foodChainImpervious>`.

---

## What is blocked

The engine and the first draft of the content are both in. What remains is not the plugin's to decide.

1. **Play-tuning the numbers.** Every heal percent, cast time and state duration above is a first draft.
2. **What backfills the 763 drop rows the berries vacate.** The deletion is decided; the replacement is
   not, and those rows were doing pacing work as well as healing work.
3. **Whether the five non-dropping heal items get deleted or get a real place**: Redberry, Heartfruit,
   Nectar, Serum, Draught.
4. **Squishing *during* the cast, if wanted.** The squish burst plays at execution; the cast itself shows
   the existing casting swell. Moving the squats into the cast window is a small per-skill tag read at
   `tickCastingJuice`, not needed to ship this.
