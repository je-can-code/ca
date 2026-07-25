# Recipe Journals

> Un-staled 2026-07-24 (previously an empty stub — the system shipped, the doc didn't).

## The shipping system
Three tiers of cooking-recipe unlocks, dropped by the common enemies of Erocia, tier-scaled by region — roughly
one tier per chapter of progression:

| Item | Name | Flavor | Dropped by |
|---|---|---|---|
| 461 | Recipe Journal I | "recipes for every meal of the day" | early-tier enemies (Ghosty, Bearcat, slimes, ...) |
| 462 | Recipe Journal II | "satisfaction and fulfillment" | mid-tier enemies (Fallen Kingdom undead, dragons, ...) |
| 463 | Recipe Journal III | "breakfast and concentration" | high-tier enemies (Jelliton, Zaphazard, Vampire Shade, ...) |

Wiring: ~353 `<drops:[i,46X,...]>` entries across `Enemies.json`; unlock plumbing in `CommonEvents.json`
(CE31 "Recipes init", CE161–163 per journal). All three carry `<hideFromJabsMenu>`.

## The lore layer (2026-07-24)
The journals' own item text: pages from "a journal of **some famous chef**." The famous chef is **Yelena's
family** — hunter-cooks who ranged the continent for generations; their field journals are still out in the
wild. The player collects them all game without knowing; [Yelena's quest chain](../quests/NE-raevula/innkeeper.md)
names them (the recognition beat in quest 3, the **Family Cookbook** master-volume capstone in quest 5, and an
optional journal turn-in economy). Mechanics unchanged; meaning added.

## Nana's Ledger — journals as currency
Yelena's counter gains a second shop tab (staged: basic at her quest 3, premium at quest 5) where Journals
I–III are **spent as currency** on recipes. Journals retain their use-to-learn function, creating the core
economy decision: **consume now** (bundled commons) vs **bank for the Ledger** (premium picks). Premium
pricing sits above consume-value; excess journals stop being inventory lint and become savings.

## The recipe-unlock doctrine (how cooking knowledge flows)
1. **Found** — Journals I–III: common knowledge, exploration-paced, from drops. (Ships today.)
2. **Taught** — Yelena's kitchen tiers and quest dishes (e.g., rich-and-poor's Wilted Wolftrap Salad /
   Seeing Jambalaya): situational knowledge, from people.
3. **Inherited** — the Family Cookbook: top-tier knowledge, from a relationship. Nana's Ledger bridges 1→3:
   found pages, spent inside a relationship.

The same ladder holds per discipline, deliberately: cooking (journals → Yelena → Cookbook), alchemy (pages →
Leo → Leo's Original), smithing (scraps → Viktor → Named Steel). **Found < taught < inherited.** Loot <
lessons < love.
