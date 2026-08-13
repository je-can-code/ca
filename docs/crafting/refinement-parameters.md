# Refinement parameters and material families

> **Verified against the live plugin registry 2026-08-13** — `ParameterKeys.js` and the various
> `register*Parameters.js` in `rmmz-plugins`, not from recollection. Regenerate rather than hand-editing
> if the two ever disagree.
>
> **Related:** [`material-tools.md`](material-tools.md) covers which tool works which material;
> this covers what a material *does* once refined onto something.

---

## What a refinable material looks like

Every material in `a301-a455` carries exactly two traits:

```
code 63, dataId 3, value 1     <- the refinement marker; identical on all of them
code 21|22|23, dataId N, value <- the payload: one parameter, one value
```

So a material family *is* a parameter. Refining one onto a piece of gear moves that one stat, and the
family's five tiers are five strengths of the same move.

**Families are always five wide**, and the block is laid out as a grid of thirty-one five-slots. There
are no one-off materials.

---

## The table

| # | Key | Family | Block | Scaling |
|---:|---|---|---|---|
| 0 | mhp | — | — | |
| 1 | mmp | **Powder** | a331-335 | 1.05 → 1.25 |
| 2 | atk | **Horn** | a316-320 | 1.02 → 1.10 |
| 3 | def | **Root** | a381-385 | 1.02 → 1.10 |
| 4 | mat | **Tongue** | a391-395 | 1.02 → 1.10 |
| 5 | mdf | — | — | |
| 6 | agi | — | — | |
| 7 | luk | — | — | |
| 8 | hit | — | — | |
| 9 | eva | — | — | |
| 10 | cri | **Stinger** | a326-330 | .02 → .10 |
| | | **Fangs** | a361-365 | .03 → .15 |
| 11 | cev | **Talon** | a351-355 | .03 → .15 |
| | | **Scales** | a376-380 | .05 → .25 |
| 12 | mev | **Core** | a451-455 | .03 → .15 |
| 13 | mrf | **Branch** | a311-315 | .01 → .05 |
| 14 | cnt | **Spines** | a306-310 | .01 → .05 |
| 15 | hrg | — | — | |
| 16 | mrg | **Pelt** | a301-305 | .05 → .25 |
| 17 | trg | **Ear** | a441-445 | .03 → .15 |
| 18 | tgr | **Veil** | a406-410 | .98 → .90 ↓ |
| 19 | grd | **Stone** | a336-340 | 1.03 → 1.15 |
| 20 | rec | — | — | |
| 21 | pha | — | — | |
| 22 | mcr | — | — | ↓ |
| 23 | tcr | **Bone** | a366-370 | .99 → .95 ↓ |
| 24 | pdr | — | — | ↓ |
| 25 | mdr | — | — | ↓ |
| 26 | fdr | — | — | ↓ |
| 27 | exr | — | — | |
| 28 | cdm | *not refinable* | | J-Crit |
| 29 | ctr | *not refinable* | | J-Crit |
| 30 | mtp | *not refinable* | | J-Base |
| 31 | msb | *not refinable* | | J-ABS-Speed |
| 32 | prof | *not refinable* | | J-Proficiency |
| 33 | sdr | *not refinable* | | J-SDP |
| 35 | lst | *not refinable* | | J-Resources-ABS |
| 36 | mst | *not refinable* | | J-Resources-ABS |
| 37 | tst | *not refinable* | | J-Resources-ABS |
| 38 | sar | *not refinable* | | J-ABS-Shield |
| 39 | ser | *not refinable* | | J-ABS-Shield |
| 40 | apr | *not refinable* | | J-Aptitude |
| 41 | gdr | *not refinable* | | J-Drops |
| 42 | dor | *not refinable* | | J-Drops |
| 43 | hcr | *not refinable* | | listed, **not registered** |
| 44 | cdr | *not refinable* | | listed, **not registered** |
| 45 | per | *not refinable* | | listed, **not registered** |
| 46 | har | *not refinable* | | J-Base |

**Everything from 28 upward is registry-only.** Those are SDP panel rows and have no trait form at all,
so no material can ever grant one — a material family is only possible for parameters 0-27.

`34` is a genuine gap in the id map. **↓** marks a stat where lower is better; those families descend.

---

## The fifteen empty blocks

The gaps are not random. They are exactly the food families that migrated out to `Items.json` — greens,
coral, tail, eyeball, blood, flank, ribs, gel, hearts, slime, wings, fish, petal, egg and vine. Fifteen
families left, fifteen holes, and their parameters left with them.

```
a321-325   a341-345   a346-350   a356-360   a371-375
a386-390   a396-400   a401-405   a411-415   a416-420
a421-425   a426-430   a431-435   a436-440   a446-450
```

Against **fourteen unclaimed parameters**:

```
ascending    b: mhp  mdf  agi  luk       x: hit  eva  hrg       s: rec  pha  exr
descending   s: mcr  pdr  mdr  fdr
```

One family each with a slot spare — and doubling is already permitted, since CRI and CEV each carry two
families at different rates.

### Magnitude conventions, for authoring a new family

The existing families are consistent per parameter type, and a new one should match rather than invent:

- **b-params** move in small multiplier steps — `1.02 → 1.10`, except Powder's MMP at `1.05 → 1.25`
- **x-params** are flat additions — `.01 → .05` for the powerful ones like CNT and MRF, `.03 → .15` or
  `.05 → .25` for softer ones like TRG and MRG
- **s-params** are multipliers stepping `.03` upward, or `.01`-`.02` downward where lower is better

So a new **mhp** family wants roughly `1.02 → 1.10`, not `1.05 → 1.25`, unless it is meant to be the
strongest material in the game.

---

## Two discrepancies found while verifying

**`cdr` (44) and `per` (45) resolve to nothing.** Every other key in `LEGACY_LONG_PARAM_TO_KEY` maps to a
live `ParameterRegistry.register` call; those two do not. Either they were planned and never built or
removed without cleaning the map. Harmless, but they read as real parameters to anyone consulting the
list.

**The editor and the plugin disagree about 29.**
`jmz-data-editor/app/src/services/sdp/sdpParameterKeys.ts` says `29: "cdr"`, while the plugin's
`ParameterKeys.js` says `29: 'ctr'` — and J-Crit registers `ctr`. The editor's copy is stale, and its own
comment says to keep it in sync with the plugin.
