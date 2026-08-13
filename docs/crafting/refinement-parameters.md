# Refinement parameters and material families

Block position is the parameter: index `= (id - 301) / 5`.

| # | Key | Family | Block | Scaling |
|---:|---|---|---|---|
| 0 | mhp | — | a301-305 | |
| 1 | mmp | Powder | a306-310 | 1.05 → 1.25 |
| 30 | mtp | — | a311-315 | |
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

a446-455 is spare. ↓ = lower is better, so those families descend.

**13 gaps to fill:** mhp, mtp, agi, luk, eva, hrg, rec, pha, mcr, pdr, mdr, fdr, exr.

`mtp` is long-param 30 and has no trait form — trait codes reach only 27. Its family carries a note
instead:

```
<transferrableEffectsBelow>
<maxTp:5>
```

b-params (trait code 21) take a **multiplier**; x-params (22) and s-params (23) take a **flat rate**.
