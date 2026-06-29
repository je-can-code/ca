# Weapon redesign — migration progress

The weapon redesign reorganizes all weapon skills into 18 contiguous 10-row lots (IDs 1–180), one per subgroup. Each lot gives every subgroup a proper offhand skill and a full proficiency ladder. Work per lot: transcribe the planned rows into `Skills.json` + weapon notetags (`<skillId>` / `<offhandSkillId>`), then wire the proficiency chain in `config.proficiency.json`. Testing: equip weapon, beat up a dummy, confirm skills behave as designed.

Full design detail: [`skill-lots.md`](./skill-lots.md) · Per-family docs: [`families/`](./families/)

---

| IDs | Family | Subgroup | Lot | Done |
|---|---|---|---|---|
| 1–10 | Blade | 1H | sharp | ✅ |
| 11–20 | Blade | 2H | beast | ✅ |
| 21–30 | Blade | Dual | twist | ✅ |
| 31–40 | Spear | Stab | pierce | ✅ |
| 41–50 | Spear | Basher | mortar | ✅ |
| 51–60 | Spear | Javelin | rend | ✅ |
| 61–70 | Gun | Pistol | gunfu | ✅ |
| 71–80 | Gun | Taser | conduit | ✅ |
| 81–90 | Gun | Shotgun | boomstick | ✅ |
| 91–100 | Axe | 1H Hatchet | buffer | ✅ |
| 101–110 | Axe | 2H Battleaxe | cleave | ✅ |
| 111–120 | Axe | Breaker | breaker | ✅ |
| 121–130 | Wand | 2H Staff | aura | ✅ |
| 131–140 | Wand | 1H | saturation | ✅ |
| 141–150 | Wand | Tome | lexicon | ✅ |
| 151–160 | Fist | Glove | flow | ✅ |
| 161–170 | Fist | Claw | gore | ✅ |
| 171–180 | Fist | Arm | dirty | ✅ |
