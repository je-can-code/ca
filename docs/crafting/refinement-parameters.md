# Refinement parameters and material families

Block position is the parameter: index `= (id - 301) / 5`. Region is `a301-a535`; `a536-650` is spare.

## Trait-granted (long-param 0-27)

These carry a payload trait after the code-63 divider. b-params (code 21) take a **multiplier**;
x-params (22) and s-params (23) take a **flat rate**.

| # | Key | Family | Block | Scaling |
|---:|---|---|---|---|
| 0 | mhp | — | a301-305 | |
| 1 | mmp | Powder | a306-310 | 1.05 → 1.25 |
| 30 | mtp | — | a311-315 | *note-granted* |
| 2 | atk | Horn | a316-320 | 1.02 → 1.10 |
| 3 | def | Root | a321-325 | 1.02 → 1.10 |
| 4 | mat | Tongue | a326-330 | 1.02 → 1.10 |
| 5 | mdf | Scales | a331-335 | 1.05 → 1.25 |
| 6 | agi | — | a336-340 | |
| 7 | luk | — | a341-345 | |
| 8 | hit | Stinger | a346-350 | .02 → .10 |
| 9 | eva | — | a351-355 | |
| 10 | cri | Fangs | a356-360 | .03 → .15 |
| 11 | cev | Talon | a361-365 | .03 → .15 |
| 12 | mev | Core | a366-370 | .03 → .15 |
| 13 | mrf | Branch | a371-375 | .01 → .05 |
| 14 | cnt | Spines | a376-380 | .01 → .05 |
| 15 | hrg | — | a381-385 | |
| 16 | mrg | Pelt | a386-390 | .05 → .25 |
| 17 | trg | Ear | a391-395 | .03 → .15 |
| 18 | tgr | Veil | a396-400 | .98 → .90 ↓ |
| 19 | grd | Stone | a401-405 | 1.03 → 1.15 |
| 20 | rec | — | a406-410 | |
| 21 | pha | — | a411-415 | |
| 22 | mcr | — | a416-420 | ↓ |
| 23 | tcr | Bone | a421-425 | .99 → .95 ↓ |
| 24 | pdr | — | a426-430 | ↓ |
| 25 | mdr | — | a431-435 | ↓ |
| 26 | fdr | — | a436-440 | ↓ |
| 27 | exr | — | a441-445 | |

`mtp` sits with the other two resource pools rather than in numeric order. It is long-param 30 and has
no trait form, so it is authored like the custom parameters below.

## Note-granted (long-param 28+, plus mtp)

Trait codes 21/22/23 cover ids 0-27 and stop, so **every parameter here is granted by a notetag**
placed under the transfer divider rather than by a payload trait:

```
<transferrableEffectsBelow>
<critMultiplier:5>
```

Refinement carries these because `JaftingManager.mergeTransferableNotes` moves everything below the
divider onto the output, and each parameter is summed off `getAllNotes()`, which includes equipment.

| # | Key | Block | Notetag | Value | Defined in |
|---:|---|---|---|---|---|
| 30 | mtp | a311-315 | `<maxTp:N>` | signed int | J-Base |
| 28 | cdm | a446-450 | `<critMultiplier:N>` | int, **no minus** | J-Critical |
| 29 | ctr | a451-455 | `<critReduction:N>` | int, **no minus** | J-Critical |
| 31 | msb | a456-460 | `<speedBoost:N>` | signed int | J-ABS-Speed |
| 32 | prof | a461-465 | `<proficiencyBonus:N>` | int, **no minus** | J-Proficiency |
| 33 | sdr | a466-470 | `<sdpMultiplier:N>` | decimal, signed | J-SDP |
| 34 | lp34 | a471-475 | — | — | *unassigned* |
| 35 | lst | a476-480 | `<lst:N>` | signed int, **percent** | J-Resources-ABS |
| 36 | mst | a481-485 | `<mst:N>` | signed int, **percent** | J-Resources-ABS |
| 37 | tst | a486-490 | `<tst:N>` | signed int, **percent** | J-Resources-ABS |
| 38 | sar | a491-495 | `<sar:N>` | signed int | J-ABS-Shield |
| 39 | ser | a496-500 | `<ser:N>` | signed int | J-ABS-Shield |
| 40 | apr | a501-505 | `<aptMultiplier:N>` | signed int | J-Aptitudes |
| 41 | gdr | a506-510 | `<goldMultiplier:N>` | signed int | J-Drops |
| 42 | dor | a511-515 | `<dropMultiplier:N>` | signed int | J-Drops |
| 43 | hcr | a516-520 | `<hcr:[FORMULA]>` | **formula** | J-Resources |
| 44 | cdr | a521-525 | `<cdr:[FORMULA]>` | **formula** | J-ABS |
| 45 | per | a526-530 | `<per:[FORMULA]>` | **formula** | J-ABS |
| 46 | har | a531-535 | `<har:N>` | signed int | J-Base |

Three of these take a **formula in brackets** rather than a plain number — `<cdr:[(a.level * 0.5)]>` —
so their families author differently from the rest.

`lst` / `mst` / `tst` are divided by 100 when read, so `<lst:5>` is 5%.

Long-param 34 has no key in `ParameterKeys`; its block is reserved as `lp34` until something claims it.

Do not confuse these with the **Natural growth** tags of similar name — `<cdmGrowthPlus:[…]>`,
`<ctrBuffRate:[…]>`, `<harGrowthPlus:[…]>` and friends drive per-level growth on a battler, not a flat
grant, and are the wrong tag for a material.

## Status

**16 families designed, 31 blocks reserved.** A reserved block's five rows are all named
`=== TBD <key>`, matching the `===` convention `Enemies.json` uses for placeholder rows — the tooling
treats a leading `===` as "not a material".

↓ = lower is better, so those families descend.
