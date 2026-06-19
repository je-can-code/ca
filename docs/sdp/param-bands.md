# SDP Parameter Bands

Reference for normalizing panel parameter values across all subgroups.
Every param's **total** (sum of `perRank × maxRank` across all 10 panels in a strip) should fall within the target band for its role.

---

## Vocabulary

### Bonus bands (UP — desirable direction)

| Label | Rate % total | Flat total (approx) | Use case |
|-------|-------------|---------------------|----------|
| **Extreme** | +170–220% | — | Core UP identity stat; the defining trait of the subgroup |
| **Very High** | +120–170% | — | Strong secondary identity or high-frequency cycling |
| **High** | +80–120% | — | Heavy cycling, late-tier focus |
| **Moderate** | +40–80% | — | Common cycling |
| **Gentle** | +15–40% | — | Light cycling, sparse presence |
| **Weak** | +5–15% | — | Flavor; T10-only or single-panel sprinkles |

### Penalty bands (DOWN — undesirable direction)

| Label | Rate % total | Notes |
|-------|-------------|-------|
| **Brutal** | -70% or worse | Avoid. Stacking risk across subgroups approaches zero-floor. |
| **Painful** | -50–70% | Core DOWN on glass-cannon identity only. Max one per subgroup. |
| **Bad** | -35–50% | Standard core DOWN. Safe for most identity penalties. |
| **Middling** | -20–35% | Common cycling penalty. |
| **Not Good** | -8–20% | Light cycling penalty. |
| **Itchy** | -1–8% | Flavor. Barely noticeable individually but can stack. |

**Stacking rule:** No single subgroup's core DOWN should exceed **Bad (-50%)** for any rate param.
Even at -50% each, two compatible subgroups stacking the same DOWN = -100%, which hits zero-floor for stats that have one.

---

## Per-parameter rules

Each param entry lists: **good direction**, **zero-floor risk**, **cap concern**, and **target band for core/cycling roles**.

---

### Base Parameters (b-params)

| Param | Good direction | Notes | Core UP target | Core DOWN target | Cycling range |
|-------|---------------|-------|----------------|-----------------|---------------|
| `mhp` | UP | No hard cap. Zero-floor (0 HP) is death, but MHP won't actually reach 0 from panel penalties alone. **Do not use as generic "squishy" shorthand** — only penalize when the subgroup has a clear identity reason for low HP (glass-cannon mage, fragile speed-type, luk-based gambler). Overuse dilutes the signal. | Extreme (+170–220%) | Bad (−35–50%) | Gentle–Moderate |
| `mmp` | UP | No hard cap. 0 MMP = can't cast; stay above -60% combined across subgroups. Valid core DOWN for brutish/melee archetypes (berserker, vanguard) that never cast. | Extreme | Bad | Gentle–Moderate |
| `atk` | UP | No hard cap on UP. DOWN below -100% is nonsensical but not a hard cliff in gameplay. | Extreme | Bad | Gentle–Moderate |
| `def` | UP | Same as ATK. | Extreme | Bad | Gentle–Moderate |
| `mat` | UP | Same as ATK. Scaling healing means very high MAT totals are significant. | Extreme | Bad | Gentle–Moderate |
| `mdf` | UP | Same as DEF. Also scales healing received. | Extreme | Bad | Gentle–Moderate |
| `agi` | UP | Turn order / action frequency. Behaves like any other b-param — fine as core DOWN. Note: AGI has nothing to do with movement speed in ABS; that is `msb`. | Extreme | Bad | Gentle–Moderate |
| `luk` | UP | Broad effects; generally fine at any level. Valid core DOWN for archetypes that are deliberately "dumb" or indifferent (guardian, medic). | Extreme | Bad | Gentle–Moderate |

---

### EX Parameters (x-params)

| Param | Good direction | Notes | Core UP target | Core DOWN target | Cycling range |
|-------|---------------|-------|----------------|-----------------|---------------|
| `hit` | UP | 0 HIT = never lands hits. Zero-floor risk for DOWN. Keep DOWN above -70% total. | Extreme | Bad (−35–50%) | Gentle–Moderate |
| `eva` | UP | 0 EVA = no auto-parries. Zero-floor risk. Keep DOWN above -70%. | High–Very High | — (cycling only) | Weak–Gentle |
| `cri` | UP | 0 CRI = never crits. Zero-floor for DOWN. 100 CRI UP = always crits (soft cap concern). Keep total UP below +150% for non-identity. | Extreme | Bad | Gentle–Moderate |
| `cev` | UP | 0 CEV = no crit mitigation. Cap UP not a concern in practice. | High–Very High | Not Good–Middling | Weak–Gentle |
| `mev` | UP | 0 MEV = no magic dodge. Cap UP not a concern. | High–Very High | Not Good–Middling | Weak–Gentle |
| `mrf` | UP | **Hard cap at 100 = reflects all magic permanently.** Keep per-subgroup total below +30%. Only ever cycling, never core UP. **Never penalize.** | — (cycling only, max Gentle) | — (never) | Weak–Gentle |
| `cnt` | UP | **Hard cap at 100 = autocounters every hit.** Keep per-subgroup total below +30. Only ever cycling, never core UP. Scorpion is the one subgroup with CNT as core; its total is ~24 — treat that as the ceiling for a core CNT identity. **Never penalize.** | — (Scorpion exception: Bad equivalent in flat) | — (never) | Weak–Gentle |
| `hrg` | UP | No hard cap. Very meaningful even at low values. Small amounts compound with REC. Valid core DOWN for irreverent archetypes (skirmisher, wizard) that don't care about sustained HP recovery. | Extreme | Bad | Gentle–Moderate |
| `mrg` | UP | Same as HRG. Compounds with REC and MCR direction. Valid core DOWN for brutish/low-intelligence archetypes (berserker, cyclops) that spam skills without mana discipline. | Extreme | Bad | Gentle–Moderate |
| `trg` | UP | Same as HRG/MRG. | High–Very High | Bad | Gentle–Moderate |

---

### SP Parameters (s-params)

| Param | Good direction | Notes | Core UP target | Core DOWN target | Cycling range |
|-------|---------------|-------|----------------|-----------------|---------------|
| `tgr` | Depends on role | **Zero-floor risk: 0 TGR = generates no aggro, AI ignores you entirely.** Tank roles want UP; stealth/support want DOWN. Keep any single subgroup's DOWN total above −35% (Not Good–Middling max). Never core DOWN — cycling only. | High–Very High (tank) | — (cycling only, max Not Good) | Weak–Not Good |
| `grd` | UP | 0 GRD = never parries. Zero-floor risk for DOWN. Keep DOWN above −60% total. **Do not use as generic cycling penalty** — GRD DOWN means the monster literally cannot deflect hits; reserve for subgroups where poor guard is a meaningful identity trait (glass-cannon, reckless attacker). When in doubt, use a different penalty. | Extreme | Bad | Gentle–Moderate |
| `rec` | UP | Amplifies all regen and incoming heals. Very powerful at high values. Valid core DOWN for archetypes that never rely on healing (wizard, artillery, skirmisher) — but hard floor: combined REC DOWN across all subgroups must stay above −100% or incoming heals do nothing. | Extreme | Bad | Gentle–Moderate |
| `pha` | UP | Amplifies item effectiveness. Valid core DOWN for archetypes that don't use items (vanguard, guardian) — hard floor: combined PHA DOWN must stay above −100% or items have no effect. | High–Very High | Not Good | Gentle |
| `mcr` | **DOWN** | **Good direction is DOWN (cheaper spells).** 0 MCR = free MP skill execution — hard floor. Keep total DOWN across subgroups above −80% combined. UP is a penalty (costs more). | — | — | Note: panel perRank sign is inverted vs intent. DOWN in perRank = bonus. UP = penalty. Max bonus total: Not Good–Middling (−20–35%). Penalty (UP): Itchy–Not Good only. |
| `tcr` | **DOWN** | Same inversion as MCR. 0 TCR = TP generation free. Keep combined DOWN above −80%. | — | — | Max bonus: Not Good–Middling. Penalty: Itchy only. |
| `pdr` | **DOWN** | Good direction is DOWN (less physical damage taken). -100 = immune to physical. UP = takes more damage (berserker penalty). Keep any UP total below +55% per subgroup (Painful max). | High–Very High (defensive) | — | Note: UP used as berserker penalty — keep Middling max. DOWN as bonus: Gentle–Moderate. |
| `mdr` | **DOWN** | Same as PDR but magical. | High–Very High (defensive) | — | UP penalty: Middling max. DOWN bonus: Gentle–Moderate. |
| `fdr` | **DOWN** | Environmental damage rate. Same logic as PDR/MDR but rare. | Gentle–Moderate | — | Weak–Gentle |
| `exr` | UP | Experience gain rate. **Protected — only ever UP, never penalized.** No hard cap concern; generous scaling fine. | Extreme (generalist identity) | — (never) | Gentle–Moderate |
| `sar` | UP | Shield amplifier (outgoing shield strength). Valid core DOWN for non-healer archetypes (berserker, skirmisher) that can never moonlight as shielders. Prevents best-of-both-worlds stacking. | Extreme | Bad | Gentle–Moderate |
| `ser` | UP | Shield effectiveness (incoming shield points received). Not SAR — this is the shield you receive from allies, not the one you give. | High–Very High | Not Good | Gentle |

---

### Plugin-Custom Parameters

| Param | Good direction | Notes | Core UP target | Core DOWN target | Cycling range |
|-------|---------------|-------|----------------|-----------------|---------------|
| `cdm` | UP | Crit damage intensity. 0 CDM = crits deal no bonus damage. Zero-floor risk for DOWN. Keep any subgroup's DOWN total above −55% (Painful max). | Extreme | Painful max (−55%) | Gentle–Moderate |
| `cdr` | UP | Crit block (incoming crit damage reduction). Not a zero-floor concern. UP is always beneficial. | High–Very High | Not Good | Gentle |
| `lst` | UP | **Disproportionately powerful.** Even +10% total lifesteal is significant in ABS. Keep per-subgroup total below +40% (Moderate max). Never core — cycling only. **Never penalize (no negative lst).** | — (cycling only, max Moderate) | — (never) | Weak–Gentle |
| `mst` | UP | Same as LST but restores MP. Same cap: Moderate max (+40%). **Never penalize.** | — (cycling only, max Moderate) | — (never) | Weak–Gentle |
| `tst` | UP | Same as LST but restores TP. Same cap: Moderate max (+40%). **Never penalize.** | — (cycling only, max Moderate) | — (never) | Weak–Gentle |
| `sar` | UP | See SP params above. | — | — | — |
| `apr` | UP | Aptitude rate (skill mastery track speed). **Protected — only ever UP, never penalized.** No hard cap concern. | High–Very High | — (never) | Gentle–Moderate |
| `gdr` | UP | Gold drop rate. **Protected — only ever UP, never penalized.** No hard cap concern. | Extreme (generalist) | — (never) | Gentle–Moderate |
| `dor` | UP | Item drop rate. **Protected — only ever UP, never penalized.** Same as GDR. | Extreme (generalist) | — (never) | Gentle–Moderate |
| `sdr` | UP | SDP point gain rate. **Protected — only ever UP, never penalized.** No hard cap concern. | Extreme (generalist) | — (never) | Gentle–Moderate |
| `prof` | UP | Proficiency gain rate. **Protected — only ever UP, never penalized.** No hard cap concern. | High–Very High | — (never) | Gentle |
| `msb` | UP | Move speed boost. **Extremely sensitive in ABS — avoid as panel parameter entirely if possible. Never use as DOWN.** | — (avoid) | — (never) | Weak only if used |
| `mrf` | UP | See EX params above. | — | — | — |

---

## Quick reference: stats with special rules

| Rule | Params |
|------|--------|
| **Zero-floor (0 = lose the stat)** | `tgr`, `grd`, `eva`, `cri`, `hit`, `mmp`, `cdm` |
| **Hard cap (100 = permanent effect)** | `cnt` (always counter), `mrf` (always reflect) |
| **Good direction is DOWN** | `mcr`, `tcr`, `pdr`, `mdr`, `fdr` |
| **UP is a penalty (berserker/glass-cannon use)** | `pdr` UP, `mdr` UP, `mcr` UP, `tgr` UP (taunt) |
| **Disproportionately powerful even at low values** | `lst`, `mst`, `tst`, `rec`, `hrg`, `mrg` |
| **Avoid as SDP DOWN entirely** | `msb` (move speed — ABS-sensitive), `tgr` (as core DOWN), `cnt`, `mrf`, `lst`, `mst`, `tst` |
| **Protected — only ever UP** | `exr`, `sdr`, `prof`, `gdr`, `dor`, `apr` |
| **Hard floor on combined DOWN** | `mmp` > −60%, `rec` > −100%, `pha` > −100%, `mcr`/`tcr` > −80% |
| **Per-subgroup cap** | `cnt` ≤ +30 total, `mrf` ≤ +30% total, `lst`/`mst`/`tst` ≤ +40% total, `cdm` DOWN ≥ −55% total |
| **Overuse warning** | `mhp` DOWN — 17/49 subgroups use it; only justify with clear identity. `grd` DOWN — 11/49; reserve for genuinely reckless types. |

---

## Archetype-specific penalty guidance

These params are valid as core DOWN only for specific monster archetypes. Outside those archetypes, they should not be penalized.

| Param | Valid as DOWN for | Notes |
|-------|-------------------|-------|
| `mmp` | Brutish melee (berserker, vanguard) | Never cast, so no MMP cost |
| `hrg` | Irreverent (skirmisher, wizard) | Don't rely on HP regen |
| `luk` | Indifferent (guardian, medic) | Deliberately "dumb" or mechanical |
| `mrg` | Brutish/low-intelligence (berserker, cyclops) | Mana discipline is not a trait they have |
| `sar` | Non-healer (berserker, skirmisher) | Can't moonlight as shielders |
| `rec` | Non-healing (wizard, artillery, skirmisher) | Don't care about incoming heal efficiency |
| `pha` | Non-item (vanguard, guardian) | Don't use items in combat |
| `mhp` | Glass-cannon mage, fragile speed-type, luk gambler | Must have clear identity reason — not generic "squishy" |
| `grd` | Reckless attacker, glass-cannon | Must have clear identity reason — not generic "low defense" |
