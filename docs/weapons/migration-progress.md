# Weapon redesign — migration progress

The weapon redesign reorganizes all weapon skills into 18 contiguous 10-row lots (IDs 1–180), one per subgroup. Each lot gives every subgroup a proper offhand skill and a full proficiency ladder. Work per lot: transcribe the planned rows into `Skills.json` + weapon notetags (`<skillId>` / `<offhandSkillId>`), then wire the proficiency chain in `config.proficiency.json`. Testing: equip weapon, beat up a dummy, confirm skills behave as designed.

Full design detail: [`skill-lots.md`](./skill-lots.md) · Per-family docs: [`families/`](./families/)

---

**Subgroup** is the `weaponTypes` noun, which is also the recipe and proficiency key — see the canonical
vocabulary in [`families.md`](./families.md). **Lot** is the design codename, used only for naming the
skills inside the lot. The positional labels that used to sit in this column (1H / 2H / Dual) are kept in
the last column as prose, because they describe how a weapon is held and never appear in a key.

| IDs | Family | Subgroup (`wtypeId`) | Lot | Held | Done |
|---|---|---|---|---|---|
| 1–10 | Blade | Sword (1) | sharp | 1H | ✅ |
| 11–20 | Blade | Claymore (2) | beast | 2H | ✅ |
| 21–30 | Blade | Edge (3) | twist | dual | ✅ |
| 31–40 | Spear | Pike (4) | pierce | 2H | ✅ |
| 41–50 | Spear | Warstaff (5) | mortar | 2H | ✅ |
| 51–60 | Spear | Javelin (6) | rend | 1H thrown | ✅ |
| 61–70 | Gun | Handgun (7) | gunfu | 1H | ✅ |
| 71–80 | Gun | Taser (8) | conduit | 1H | ✅ |
| 81–90 | Gun | Boomstick (9) | boomstick | 2H | ✅ |
| 91–100 | Axe | Hatchet (10) | buffer | 1H | ✅ |
| 101–110 | Axe | Glaive (11) | cleave | 2H | ✅ |
| 111–120 | Axe | Mace (12) | breaker | 2H | ✅ |
| 121–130 | Wand | Cane (13) | aura | 2H | ✅ |
| 131–140 | Wand | Rod (14) | saturation | 1H | ✅ |
| 141–150 | Wand | Tome (15) | lexicon | 1H | ✅ |
| 151–160 | Fist | Gloves (16) | flow | dual | ✅ |
| 161–170 | Fist | Claws (17) | gore | dual | ✅ |
| 171–180 | Fist | Arm (18) | dirty | 2H | ✅ |
