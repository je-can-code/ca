# Academy accuracy audit

> Sweep of every factual claim made inside **ACADEMY: Intro School** (maps 79–92) against `data/` and the
> shipped plugins, on 2026-09-05. The academy is now a **required** stop — `main-001` gates on `train-000`
> — so every wrong statement is one the player is forced to walk past.
>
> Ground truth used: `Weapons.json` traits (Seal Equip → Offhand = two-handed; Dual Wield = code 55),
> `Skills.json` damage formulas and JABS notetags, `System.json` type tables, and
> [`../weapons/families.md`](../weapons/families.md) for family identity.
>
> **Status: every finding below is fixed in the map data** as of 2026-09-05 — 68 edits across
> `Map080`, `Map081`, `Map087` and `Map088`. Each fix corrected the *dialogue* to match the data;
> nothing in `Skills.json` or `Weapons.json` was touched, so no balance moved. Two findings had a
> "change the mechanic instead" option and are called out where they appear. The omissions at the
> bottom are the one section deliberately left alone.

---

## Where the claims live

| Map | Name | What it asserts |
|---|---|---|
| 79 | Entry Floor | Framing only — no mechanics claims |
| 80 | Learning Your Weapons | Six teachers, one per family, three subgroups each |
| 81 | Weapons Test | Six graded questions |
| 87 | Learning Skills | Weapon skills vs magic skills |
| 88 | Skills Test | Four graded questions |
| 89 | Combat Area | Three readable books: danger indicators, elements, proficiency |
| 92 | Bottom Floor | Reward handoff — no mechanics claims |

---

## Wrong — a graded answer or a stated mechanic that the data contradicts

### 1. "All spears are wielded in both hands" — the graded answer is backwards

**Map 81, question 2** grades **True** as correct, and Map 80 ev2 states the same thing as the *reason*
spears get their crit bonus.

Across all ten weapons of each subgroup:

| Subgroup | Seal Equip → Offhand | Reading |
|---|---|---|
| Pike (4) | 10 / 10 | two-handed |
| Warstaff (5) | 10 / 10 | two-handed |
| **Javelin (6)** | **0 / 10** | **one-handed** |

The correct answer is **False**. The follow-up line on the True branch — *"You can't use a spear without
sacrificing your offhand slot!"* — is wrong for the same reason.

The causal claim upstream fails twice over: javelins carry `<cdmBuffPlus:[50]>` through `[200]` and get
the crit-damage bonus **without** paying the two-hand cost, so "they get bonuses *because* they take two
hands" is not the mechanism.

**Fix:** flip the graded answer to False and rewrite the Pike branch's reasoning. The honest version is
that Pike and Warstaff are two-handed and the Javelin is not.

### 2. Flow state arrives on the third strike, not the fourth

**Map 81, question 6** grades **4**.

```
151 Left Jab  --<combo:[152,0,45]>-->  152 Left Straight  --<combo:[153,0,45]>-->  153 Left Flow
153 Left Flow --<combo:[153,0,60]>-->  153 Left Flow   (recurses on itself)
```

The third input *is* Left Flow. The right-hand chain (154 → 155 → **156 Right Flow**) is identical.

The question asks about the flow *state*, and that is literal: 153 carries `<onHitSelfState:[53,100]>`,
and state 53 is named **Moonflow** (56 is **Sunflow**). So the state lands when the third strike connects.

**Fix:** the answer is **3**. The Boxer's own line on map 80 — *"Combo-ing 4+ times in barely a second"* —
should become 3+ to match.

### 3. "Almost no amount of physical defense will stop your fists" — fists have no penetration at all

Defense subtraction across every family's opening mainhand skill:

| Defense term | Skills |
|---|---|
| `b.def*0.25` | 61 Snap (Handgun) |
| `b.def*0.5` | 51 Throw (Javelin), 81 Buckshot (Boomstick) |
| `b.def*0.75` | 31 Skewer (Pike) |
| **`b.def*1`** | 1 Rough Chop, 11 Primal Carve, 21 Julienne, 91 Hack, 101 Incision, 111 Curvature, **151 Left Jab**, **153 Left Flow**, 161 Rake, 171 Slam |

Full defense subtraction is the **melee default**, so fists are not uniquely bad — they are tied with
blades, axes, claws and arms. But they are also not special, and the claim asserts they are. The families
that genuinely shave defense are the ranged ones and the pike.

**Fix:** cut the claim, or move it — `b.def*0.25` makes it a true statement about *pistols*. Do not read
this finding as a case for buffing fists; the number is normal, the sentence is not.

### 4. "Most magic spells have significant parry ignore" — inverted

**Map 87 ev3.** Across the entire skill database, 19 skills carry `<unparryable>` and **zero** carry
`<ignoreParry:>`. Of those 19:

| Skill type | Unparryable skills |
|---|---|
| 4 Magecraft | **0** |
| 7 Weapon Skills | 6 — Lead Appetizer, Full Tasting, Shock, Bloodcircuit, Foie Gras Concentré, Sky Breaker |
| 2 Guarding | 10 |
| 0 / 3 | 3 |

Parry-ignore is a **weapon-skill** property in this game, not a magic one. The follow-up — *"Most magic
will eventually become immune to being parried at its highest ranks"* — has no support at any rank.

**And it is not a tags-versus-mechanics gap.** `JABS_Engine.executeSkillEffects` exempts an action from
parry in exactly two cases: `action.isUnparryable()`, or the action is healing. `canAttemptImplicitParry`
then refuses only when the *target* is guarding, casting/channeling, or dashing. Nothing anywhere checks
range, hitbox shape, `<direct>` or projectile-ness — so a spell cast from six tiles away is parried on
precisely the same terms as a sword swing.

`<ignoreParry:N>` does exist, but only on **Mace weapons**, climbing 10 → 20 → 30 by tier.

**Fix:** either give Magecraft the property the Magic Expert claims, or replace his argument. He has three
other true ones already: no TP management, elemental coverage via offhand artifacts, and specialist scaling.

### 5. "The wand will typically not contain as much force as the other mediums" — inverted

The witch's three mediums map to Cane (staff, two-handed), Rod (wand, one-handed) and Tome, confirmed by
weapon names — the Cane line reads *Plain Crook, Oak Staff, Mage Staff*, the Rod line reads *Taper Wand,
Condenser Rod, Convergence Rod*.

| Subgroup | Hands | MAT, t1 → legendary | Main skill coefficient |
|---|---|---|---|
| Cane — "the staff" | two | 20 → 500 | Laps: `a.mat*2 + a.mdf*1` |
| **Rod — "the wand"** | **one** | **50 → 990** | Induce: `a.mat*3.5` |
| Tome | one | 35 → 940 | Scathe: `a.mat*2 + a.mmp*0.10` |

The wand has the highest force of the three at every tier, and the higher coefficient on top of it.

Second problem in the same conversation: she credits **the wand** with "latent charging capabilities,"
gated behind proficiency. `<chargeTier:[1,60,125]>` sits on **124 Mystic Focus**, which is the *Cane's*
offhand skill. The Rod's 134 Saturation is `<thisApplyState:[45,100,300,1]>` — a stacking self-buff — and
its entire proficiency ladder is 135 Bifurcation / 138 Trifurcation / 140 Quadfurcation
(`<projectile:2>`, `3`, `4`) plus 136 Vectoration, 137 Supersaturation and 139 Alienation. **No
`<chargeTier>` appears anywhere in 131–140.** The wand does not charge at any rank; it multiplies
projectiles, which is exactly [`families.md`](../weapons/families.md)'s "additive MAT stacks, bullet-hell
prof ladder."

**Fix:** the two-handed staff is the *defensive, wide-spray* medium (it is the only one granting MDF, and
Laps sprays 180°); the one-handed wand is the *raw force* medium. Charging belongs to the staff. That is
close to a straight swap of the two branches' arguments.

### 6. The "Twin Axes" branch describes a weapon that does not exist

The axe family's third subgroup is **Mace** (wtype 12): Boardbreaker Cudgel, Ribcracker Flanged Mace,
Helmsplitter Morning Star, Mailpiercer Horseman's Pick, Harnesscracker Bec de Corbin, Wardbreaker
Godendag. [`families.md`](../weapons/families.md) records the rename `Breaker → Mace` and keeps
**breaker** as its lot codename.

| Dialogue says | Data says |
|---|---|
| "wicked fast" | speedBoost **−5 → −15** — the slowest axe subgroup (Hatchet −10, Glaive 0) |
| "swing them all around you with every swing" | 111 Curvature is `<hitbox:arc>` at **100°** — narrower than the claws' 150° |
| "Twin Axes" | ten maces, cudgels, morning stars and picks |

What the subgroup actually is: the anti-armor family. `<ignoreParry:10→30>` climbing per tier, and the
offhand 115 SHATTER carries `<shieldDamage:[b.currentShieldValue()]>` — it deletes the target's shield
outright.

**Fix:** rewrite the third branch as the breaker. It is a better beat than twin axes anyway — the Dancer
of Axes explaining that some enemies hide behind shields and this is the answer teaches something the
player will need. The `\Enemy[204]` origin line needs a new hook.

### 7. Wrong skill ids — four sites

| Where | Written | Resolves to | Should be |
|---|---|---|---|
| 80 ev6, flow footnote | `\Skill[79]` | **Big Ass Battery** (taser prof) | **157 Double Fisting** (`<extend:[153,156]>`) |
| 80 ev6, claws ×2 | `\Skill[79]` | same | same |
| 80 ev6, claws | `\Skill[81]` `\Skill[82]` `\Skill[83]` | **Buckshot / Butchery / Reload** (shotgun) | **161 Rake / 162 Swipe / 163 Gore** — off by 80 |
| 87 ev3, Rupert | `\Skill[151]` | **Left Jab** (glove) | a fire spell: 481 Cinders, 482 Dargin Breath, 483 Eruption, 484 Meltima |

The Boxer's underlying *point* about claws is correct — glove proficiency skills use `<extend:[151..156]>`
and so genuinely cannot reach the claw chain. Only the id is wrong.

One extra wrinkle on the same footnote: **flow needs no proficiency skill at all.** 153 Left Flow is the
base glove combo, available from the first glove. So *"beginners may not be able to enter flow state until
you learn X"* is wrong in premise, not just in id. 157 Double Fisting *extends* flow; it does not unlock it.

### 8. "That Shock will most certainly stun anything hit" — it never stuns

**Map 80 ev3.** 74 Shock has no `<thisApplyState>`, and taser weapons carry no attack-state trait. Nothing
routed through a taser applies state 8 Stunned.

What Shock actually has, unmentioned: `<unparryable>` and `<attackElements:[13]>` (vs Aquatic) — which is
a genuinely useful thing to know, and doubles as the joke setup for map 81's aquatic question.

**Fix:** either add `<thisApplyState:[8,…]>` to Shock, or change the line to "cannot be parried."

### 9. `\Skill[101]` as the example for "any skill with any weapon"

**Map 87 ev2** and **map 88 question 4.** The Weapons Expert's principle holds — nothing in JABS gates an
equipped combat skill by `wtypeId`. But both examples he reaches for are the *opposite* case:

- `\Skill[111]` **Curvature** is the Mace's mainhand swing, bound by `<skillId:111>` on every mace.
- `\Skill[101]` **Incision** is the Glaive's mainhand swing, bound the same way.

You cannot perform Incision with a gun, because Incision *is* what swinging a glaive does. Map 88 then asks
"which weapon type do you need to be wielding to use `\Skill[101]`" and grades **Any**.

**Fix:** swap in two equippable combat skills (stype 3 Techniques or 8 Superlatives). The lesson is right;
it just needs examples that aren't weapon attack skills.

### 10. `<speedBoost>` is walk speed, so nothing about an axe "swings faster"

Found while writing the fixes, and it corrects an earlier line in this very document. The tag resolves
through `J.ABS.EXT.SPEED.RegExp.WalkSpeedBoost` into `Game_Character.calculateSpeedBoostBonus`, which
adjusts **move speed**. It has nothing to do with attack rate.

Attack rate is `<cooldown:N>`, and every axe subgroup shares the same one:

| Skill | Subgroup | Cooldown | speedBoost |
|---|---|---|---|
| 1 Rough Chop | Sword | 60 | 0 |
| 91 Hack | Hatchet | 60 | −10 → −20 |
| 101 Incision | Glaive | 60 | 0 |

So three claims were wrong in the same way:

- Map 80 ev4, one-handers *"pay the price with reduced mobility **and higher cooldowns**"* — mobility
  yes, cooldowns no; they are identical.
- Map 80 ev4, the whole two-hander beat lands on *"wielding an axe with two hands means you can **swing
  it faster**"* — what two hands actually buys is that the axe stops slowing you down.
- Map 81 question 4 asks how many hands it takes to *"swing it quickly"* and explains the answer as
  *"almost as fast as a sword."*

The graded answer (**2**) survives, because two hands is still what removes the mobility penalty. Only
the framing had to change.

The Claymore line is unaffected — the sword student says Great Swords *"reduce your movespeed,"* which
is exactly what −15 does. He got it right; the Dancer of Axes did not.

---

## Overstated — right in direction, wrong in number

| Where | Claim | Data |
|---|---|---|
| 80 ev2 | Pike thrusts "**four** spaces away" | `<radius:2.5>` → 2.8 → 3.0 across the combo |
| 80 ev2 | "the **last two** hits will hit everything in line" | all three Pike hits are `<hitbox:line>`; what grows is thickness, 0.3 → 0.5 → 0.7 |
| 80 ev3 | shotgun combo "shoots in a **nova**" | Butchery is the same `<degrees:140>` arc as Buckshot, radius 3 instead of 2.5 |
| 80 ev3 | shotguns "**evenly** scale with Power and Luck" | Buckshot is `a.atk*5 + a.luk*1.5`; weapon params run ATK 20 / LUK 5 |
| 80 ev6 | fists: "the **only** stat that matters is Power" | Left Jab `a.atk*1 + a.agi*1`; Left Flow `a.atk*1.5 + a.agi*1.75` — AGI outweighs ATK on the flow hit. `families.md` does list the fist lean as ATK, so the direction is fine and "only" is not |
| 80 ev6 | cyber arms "**slow as molasses**" | Arm speedBoost is **0** — slowest fist, but unpenalised. Compare Claymore −15, Hatchet −20 |
| 89 book | Purple is "5 to **80** levels above you" | the tier is `powerLevel > 1.5×` yours, with no level term at all. Reads fine as fiction for "unbounded" — listed only so nobody later treats it as a spec |

---

## Verified correct — no action

**Blades.** Three subgroups. Claymore two-handed on all ten and −15 speed on all ten. Edge is the dual-wield
line (code 55 on all ten), weakest ATK of the three (10 → 210 against Sword 15 → 380 and Claymore 50 → 720),
and the only subgroup in the game with no `offhandSkillId` — which is exactly what "you get two weapon
skills instead of an offhand" means, and matches `families.md`'s "dual uses 4 main + 6 prof, no offchain."

Claymore's "huge TP gains on-hit" is right, and by a wide margin — `tpGain` runs **7 / 10 / 12** with the
offhand at **15**, against Sword's 4 / 5 / 6 and Edge's 2 / 3 / 1 / 2.

The Edge's "rapid TP generation" is true only by throughput, not per hit: its skills carry the *lowest*
`tpGain` in the family, but run on a 30-frame cooldown against Sword's 60 and Claymore's 90, across two
weapons. Worth half a clarifying sentence, since the same NPC correctly calls the Claymore the high-TP
weapon two paragraphs earlier and the two statements read as contradicting each other.

**Spears.** Crit-damage bonus real (`<cdmBuffPlus:[50]>` → `[400]` on Pike). Speed scaling real (Skewer
`a.atk*1 + a.agi*1.5`). Javelin flies 8 tiles (`<proximity:8>`) and returns to hand (`<freeCombo>`, 51 ⇄ 52).
Warstaff's chance to stun is real — attack-state trait, state 8 at 5%.

**Guns.** TP in place of ammo (Lead Appetizer 5, Zap 5, Shock 30) — map 81 q3 correct. Bullets narrow
(`<radius:0.3>`). Pistols Luck-heavy but Power still counts (`a.atk*1 + a.luk*5`). Taser zaps need no aiming
(`<direct>`), the follow-up does (Shock is not direct), and zaps recurse for as long as TP lasts
(`<combo:[73]>` onto itself). Tasers favour Force over Luck (`a.mat*2.5 + a.luk*1`).

**Axes.** One-handers keep the offhand and pay in mobility (no seal, −10 → −20). Damage leverages max life
(Hack `a.atk*2 + a.mhp*0.02`). Two-handers carry no mobility penalty at all (Glaive 0 against Hatchet −10)
— but see finding 10 for what that does and does not mean.

**Wands.** Tome one-handed and defensive (MDF + MMP, no seal). It locks on without aiming
(`<directLock>`, `<proximity:6>`) after a brief cast (`<castTime:15>`). Ancient tomes carry void — the named
147–150 add element 9, and 149/150 add element 20 vs Deity. So map 81 q5 is correct twice over: tomes are
for god-slaying, and aquatic is the *taser's* niche, which makes it a well-chosen distractor.

**Fists.** Cyber arms hit hard off weight (Slam `a.atk*4 + a.mhp*0.05`, MHP 200 → 3800). Premium arms stun
more often — **10%** on the six craftables, **25%** on the four named. Exactly as claimed.

**Skills.** Magic uses MP; TP comes from basic attacks; an offhand artifact covers your off-element — map 88
q1 through q3 all correct. Rupert's first orb casting `\Skill[191]` Lightning is right; 181–194 is the
artifact band.

**Books.** Seven danger tiers exist — Worthless, Simple, Easy, Average, Hard, Grueling, Deadly — matching
the book's seven colours in count, and bosses can suppress theirs via `setShowDangerIndicator(false)`.
*(The colour-to-tier mapping itself is unverified: the tiers resolve to icon indexes and the iconset is an
image, so "Sky Blue is Worthless" is assumed from ordering, not read.)* The book's safety advice lines up
with the thresholds either way — Dark Orange as the 5th tier is `1.1–1.3×` your power level, Red is
`1.3–1.5×`, Purple is anything above.

Popup suffixes are verbatim: `!!!` above 1× and `...` below, straight out of
`TextPopBuilder.isElemental`. Crits flash red, run bigger and linger longer.

---

## Omissions worth a line each

Not errors — mechanics the academy teaches *around*. Listed because this is the one place in the game that
exists to explain them.

- **Claws bleed by default** — Rake and Swipe apply state 15 at 33%, Gore at 100%. `families.md` calls it the
  gore lot's "baseline bleed" and the Boxer never mentions it.
- **The glove L/R cross-boost** — Left Flow deals +33% while Right Flow is active, and vice versa
  (`<bonusDamageIfState:[56,33]>`). Alternating hands is the whole skill expression of the subgroup.
- **Flow costs 5 TP a hit** (`<tp-cost:5>`). The Boxer says "it can be tiring" without the number.
- **Reload is the shotgun's gimmick** — 83 Reload grants state 29, which multiplies the next Buckshot or
  Butchery by 1.5 and is consumed on cast. Both also apply Bleed at 50%.
- **Mace breaks shields and ignores parry** — see finding 6.
