# Recipe Journals → Recipe Pages

> Rewritten 2026-08-14: the Journals are **RETIRED** (ruling 2026-08-11, executed in the same item-table
> effort that relocated the RGB Technohypercube, which now lives at `Items[174]`). This doc records what was removed, what
> replaced it, and what carried forward. The full replacement design lives in
> [recipe-system.md](../food/recipe-system.md) ("Recipe pages replace them" / "The study shop").

## What was retired

Items 461–463 (Recipe Journal I–III) and their ~353 tier-scaled `<drops:...>` entries are gone from the
database. The failure was structural, not cosmetic: a random drop taught seven unrelated dishes at once,
so nothing was earned, nothing was chosen, and the food-family lanes stayed invisible.

The residue is gone as of 2026-08-16, cleared in the same pass that landed the 250-recipe roster:

- **CommonEvents 161–163 ("Journal 1/2/3") are blanked.** Nothing called them — the journal items were
  already empty shells, so the twenty recipe keys they unlocked had no path to fire.
- **CE31 "Recipes init" survives and was repointed** at the new roster. The innkeeper's five starters are
  Erocian Pudding, Egg Drop Situation, Flank on the Grate, Entire Steamed Fish and Fried Wing Pile.
- **Millie's forest scene** (`Map076` event 5, quest `side-002`) handed over Journal II as its cooking
  half. That grant is gone and was not replaced: Millie's identity is **Survival**, so she becomes the
  vendor for pattern scraps rather than a cooking teacher. Her Shears and her Survivalist patterns
  (CE33) are untouched, and her spoken dialogue still discusses cooking recipes — it wants a rewrite
  when the scrap vendor lands.
- Nothing references items 461–463; the rows are blank shells.

## What replaced them

**Recipe pages** — a low-rate drop from enemies, spent at the study-shop vendor on a recipe **the player
picks**. Pages are a currency, not a lottery ticket; rarity is the price, and an unaffordable recipe is a
goal rather than a disappointment. Open question (per recipe-system.md): per-family pages vs one global
page.

## What carried forward

The lore layer survives, and lands better on pages than it ever did on journals: loose PAGES of field
journals, scattered across the continent's monsters, are exactly what a ranging family of hunter-cooks
would leave behind. The "journal of some famous chef" is **Yelena's family**; every page looted is a piece
of her family's life coming home. The recognition beat and the Family Cookbook capstone in
[Yelena's chain](../quests/NE-raevula/innkeeper.md) are unchanged, and Nana's Ledger re-points from
journal-currency to page-currency (its composition with the study shop is the Maker's call — see the
innkeeper doc).

The recipe-unlock doctrine also holds, re-expressed:

1. **Found** — recipe pages: common knowledge, exploration-paced, from drops.
2. **Taught** — Yelena's kitchen tiers and quest dishes (e.g., rich-and-poor's Wilted Wolftrap Salad /
   Seeing Jambalaya): situational knowledge, from people.
3. **Inherited** — the Family Cookbook: top-tier knowledge, from a relationship. Nana's Ledger bridges
   1→3: found pages, spent inside a relationship.

The same ladder holds per discipline, deliberately: cooking (pages → Yelena → Cookbook), alchemy (pages →
Leo → Leo's Original), smithing (scraps → Viktor → the smith's ghost in the Desolate Graves, see
[`../weapons/acquisition.md`](../weapons/acquisition.md)). **Found < taught < inherited.** Loot <
lessons < love.
