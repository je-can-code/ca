# The recipe system

> **Status: ingredient layer built 2026-08-10, recipe layer unbuilt.** `config.crafting.json` carries all
> 56 `ingredientTypes`, 180 items in `i201-i432` carry their `<ingredientType:>` tags, and recipe
> ingredient slots accept categories — though only one recipe has been converted to use them so far.
> Categories, tools and the recipes themselves are still ahead. This is the plan for how cooking content gets
> authored from here on. It replaces "invent another dish and see how it feels," which produced 31
> good recipes and then a wall.
>
> **Related:** [`food-chain-durations.md`](food-chain-durations.md) (the state arcs a dish feeds
> into — unchanged by any of this) and [`../maps/progression-bands.md`](../maps/progression-bands.md)
> (where ingredients can be gated). The work item this answers is
> `.backlog/unstarted/ca-food-recipes-crafting-redo.md` in the sibling **rmmz-plugins** repo.

---

## Why this exists

The 31 shipped recipes were each modelled on a real dish, then built from whatever the local enemies
happened to drop. That produced individually fine dishes and no system, which is why authoring stalled
— there was no answer to "what should the 32nd recipe be?" other than "another random one."

The diagnosis that mattered was not the dishes. It was that **the drop economy could only ever supply
protein**. Monster materials are anatomical; fruit, grain and milk are agricultural. No amount of
retagging fixes a pantry that has no fruit in it.

Six findings from the 2026-08-04 audit, all reproducible from the shipped data:

- **No ingredient carries a `<food:TYPE>` tag.** Those tags exist only on finished meals, so a dish's
  family was always a hand-authored opinion rather than a consequence of what went into it.
- **Smithing uses 120 of the 155 monster-material slots; cooking uses 25.** The material grid was built
  for refinement, and cooking borrowed from it opportunistically.
- **Fruit and dairy have zero material families.** Carb has one (Root) that no recipe uses.
- **20 of 31 recipes are already "one tiered feature plus flat staples."** The pattern was there; it was
  never named, so it could not be leaned on.
- **The six recipes with no feature ingredient are exactly the starved lanes** — dairy, carb, vegetable,
  vegetable, sweet, fruit. A recipe has no star precisely when its family has no star to offer.
- **The tools are cooking methods.** Soup Pot says "boil and stew," Frying Pan says "saute, fry, or
  sear," Obliterator says "similar to a blender." The dish names follow: *Grilled* Bearcat, *Charred*
  Ribs, *Pan-seared* Cod, Slime *Puree*, Mushroom *Bisque*.

The last one is the whole unblock. The generator already existed and was never written down.

---

## The model

### Three independent axes

These get conflated constantly. They are not the same question.

| Axis | Values | Question it answers |
|---|---|---|
| **Role** | Star / Staple | does this ingredient define the dish, or support it |
| **State** | Raw / Prepared | has it been cooked yet |
| **Output tier** | Component / Cuisine | is this an input to more cooking, or a meal |

A Carrot is a **raw staple**. Bearcat Flank is a **raw star**. Toasted Rice is a **prepared
component**. Tasty Stew is a **cuisine**. Grilled Bearcat is a component *and* a cuisine depending on
what consumes it — role is not a type, and nothing needs to be decided at authoring time.

**Star vs Staple has an empirical test, not a taste one.** Count how many recipes an ingredient appears
in. Seasoning is in 13 of 31, Earthy Herbs 9, Butter 8, Water 7, Onion 7. The monster materials appear
once or twice each. Things that show up everywhere are background; things that show up once are the
point.

### Three layers

```
Method x Star                       ->  component        (combinatorial, always unlocked)
components + staples                ->  cuisine          (authored, taught by people)
cuisine + a named creature's part    ->  supreme cuisine  (authored, gated on a signature)
```

A **component** is cheap, fast, and does not need to be delicious. Pureed ribs is not a bad meal, it is
rib paste, and rib paste is a perfectly reasonable thing to have in a kitchen. Reframing the generated
layer as *components rather than meals* is what makes the odd combinations acceptable instead of
embarrassing.

A **cuisine** is a destination. It has a name, a joke, an icon, and it is worth going somewhere for.

A **supreme cuisine** is a cuisine that additionally requires a **signature** — a unique part from one
named creature. See "Common and signature ingredients" below.

**Not every cuisine should be deep.** A cuisine can be `1 component + 2 staples`, or `3 components`, or
all-raw for the humble stuff. Depth is a dial turned per dish. This is what makes the six featureless
recipes legitimate rather than broken — Fried Cheesy Eggs is a weeknight dish, and weeknight dishes are
allowed now.

**Tasty Stew keeps all ten ingredients.** It was a fetch-quest for Gilbert in both the RMXP and RMVXAce
versions and the sentiment is load-bearing. Under this model it stops being an outlier and becomes the
showcase: the one dish that legitimately asks you to go get everything.

### The star sets the family

A dish's `<food:TYPE>` is inherited from its star rather than hand-assigned. This is the structural fix
for the tagging drift that produced a gelatin pudding tagged protein and a meatless goulash tagged
protein — those were not mistakes of judgement, they were the absence of a rule.

**`<food:TYPE>` only means anything on a consumable.** It selects which chain fires when the item is
eaten, so it belongs on cuisines and on components that can be eaten alone. A raw Bearcat Flank you
cannot eat does not need one, and giving it one implies a behavior that never happens.

That leaves inheritance as an open question of *mechanism*, recorded under Open decisions:

- **As a code rule** — the plugin reads the star's lane and stamps the output. Raw ingredients then need
  a marker, and it should be a distinct tag (`<foodLane:carb>`) so it does not read as "eating this
  starts a carb chain."
- **As an authoring convention** — the finished dish is tagged correctly by hand and the lane lives in
  this document. No plugin work, no tags on raw ingredients, discipline carried by the author.

At the roster size this system is aimed at, the convention is likely sufficient. Promote it to a code
rule only if the roster outgrows what can be held in one head.

---

## Ingredients

### Armors are the forge's; items are the kitchen's

**Ratified 2026-08-04.** Food ingredients become **items**. Monster materials that feed refinement stay
**armors**. The split is absolute, and it exists because armors carry traits and items do not — an
armor is by definition something refinable onto gear.

The practical effect: you cannot hammer slime into a sword and you cannot cook ghastly powder. The
ambiguity disappears, and neither system has to reason about the other's materials.

Note that **items already drop**. Earthy Herbs, Minty Herbs, Spicy Herbs, Mushrooms, Butter and
Container all carry `<drops:[i,...]>` tags today. The armor/item choice never gated whether something
can come off an enemy; it only ever gated refinability.

### Food ingredients are not tiered

The 5-tier ladder was a refinement artifact. Food does not need it, because the ladder was never doing
the work anyway.

Look at what the Flank family actually holds: Bearcat Flank, Ripped Flank, Grim Flank, Volt Jelli
Flank, Gigacat Flank. Those are not quality grades of one meat — they are **five different animals**.
Progression came from which creature you can kill, not from a grade attached to the item. Bearcat Flank
is band 3-8; Grim Flank is band 56; Gigacat is 65. The ladder is the map.

### Common and signature ingredients

**Resolved 2026-08-04.** Graded food ingredients are rejected outright, because every grading scheme
picks one of two failure modes and both are unfun:

- **Obsolescence** — Bearcat Flank stops mattering the moment Grim Flank exists.
- **Backtracking** — a late, fancy dish requires a humble early ingredient, so the player flies back to
  band 6 to farm bearcats.

The resolution is not a middle grade. It is **two categories that do different jobs**:

| | Where it comes from | What it feeds | Rule |
|---|---|---|---|
| **Common** | many creatures, across **every band** | everything | never obsolete, never a reason to backtrack |
| **Signature** | **one named creature**, and only that one | supreme cuisines only | never required by an everyday recipe |

One common ingredient per lane per channel — `Flank`, `Root`, `Greens`, `Milk`. Bearcats give Flank.
Grimfangs give Flank. Gigacats give Flank. Where you are does not change what you can cook, so the
everyday kitchen simply works.

**Signatures carry the hunting fantasy instead.** They are named after the creature they come from — a
**Red Eye** from a Redeye, a **Dargin Heart** from a Dargin — which means the kitchen and the
Monsterpedia teach each other. You learn what a Dargin is because you cooked one.

The load-bearing rule: **a signature never raises the floor, only the ceiling.** Nothing everyday
requires one. You hunt a Grimfang because you want to cook the Grimfang dish, not because a recipe is
holding you hostage. That is what keeps hunting aspirational instead of mandatory.

This split is already latent in the shipped material names. The proper nouns were always marking the
signatures: **Dargin** Heart, **Dargin** Scales, **Dargin** Tail, **Titan** Heart, **Gigacat** Flank,
**Ouroboros** Ribs, **Kapn** Coral — against generic Animal Heart, Loose Scales, Bearcat Flank, Old
Bone. The five-slot families were never a quality ladder; they were two categories sharing a ladder.

**So the collapse is 5 → one common + zero-to-two signatures**, and the signatures are the entries with
a proper noun in the name. That is *fewer* total items than exist today, with the hunting fantasy
intact. Rough target: ~15 commons doing ninety percent of the work, ~20-30 signatures gating supreme
cuisines.

The families that genuinely were "the same thing, bigger" — Big / Large / Huge / Massive / Colossal
Gelatin — collapse to one outright.

#### Where signatures drop

**Resolved 2026-08-05: signatures come from repeatable creatures. Never from a one-kill boss.**

The reasoning generalises past signatures, and it is the sharpest rule in this document:

> **RNG must not determine whether you can get a temporary buff.**

Everything cooking produces is *temporary* — the food chains run three to ten minutes and then they are
gone. A permanent reward can justify a rare roll, because you keep it. A five-minute buff cannot: being
told "no" by a dice roll on something that expires is pure friction with no upside.

Two consequences, both binding:

- **No one-kill boss signatures.** A supreme cuisine must be cookable more than once, so its signature
  must come from something farmable. Where a boss flavour is wanted, the **lesser-spawn** pattern
  already solves it — Gluttonwolves after the Gluttonwolf Mayor, Vampire Shades after the Vampire King.
  The sin votary system is already a repeatable boss-ingredient pipeline built for SDP drops and works
  identically here.
- **Food drop rates should be generous relative to gear materials.** The same principle applies to
  common ingredients: a 1% roll on something that feeds a five-minute buff is the same mistake at a
  smaller scale. Cooking materials are consumables in a loop, not trophies.

### Three sources, not one

The single biggest structural fault today is that combat supplies two food families and one innkeeper
supplies four. Three channels fixes it, and two of the three already exist:

| Channel | Supplies | Status |
|---|---|---|
| **Slain** — enemy drops | protein, sweet (slimes), dairy (bovines) | works today |
| **Harvested** — destructible nodes | vegetable, carb (grass/grain), fruit (trees) | mechanically exists, yields nothing worth stopping for |
| **Bought / farmed** — shops | staples and dairy | one vendor, needs a network |

Harvest is the cheap win. Destructibles are already implemented as enemies, already respawn, and already
carpet the maps — and the band table says the player spends more time in the level 6-17 outdoor stretch
than anywhere else in the game. Way to the Forest (53 spawns), Tons of Grass (50) and Green Greenery
(27) are foraging grounds that currently reward nothing.

---

## Ingredient categories and matching

Recipes ask for a **category**, not an item id. `Grill + [any meat]` is one recipe that already covers
bearcat, grim flank, gigacat and lamia - and covers the ch5 monster that has not been invented yet, for
free. This is the property that makes the system closed: **adding an ingredient later costs zero
recipes.**

The concrete roster of lanes and sub-categories lives in
[`ingredient-sorting.md`](ingredient-sorting.md).

### Two tag families, doing two different jobs

They are constantly confused and they never overlap:

| Tag | Count per item | Purpose |
|---|---|---|
| `<ingredientType:X>` | **many** | recipe matching only |
| `<food:TYPE>` | **exactly one**, consumables only | selects which chain fires on eating |

An ingredient is promiscuous; a dish is decisive. A tomato can be tagged both `vegetable` and `fruit`
because it is only declaring which slots it can fill. A *dish* built around it commits to one arc,
declared by hand on the dish itself. Raw non-consumable ingredients never carry `<food:>` at all.

That also removes any need for a separate lane marker on raws, and any need for star-to-dish
inheritance to be a code rule - `<ingredientType>` already carries what the matcher needs.

### The matcher

Every type the **recipe** wants must be present on the item. Extra tags on the item never disqualify
it:

```javascript
desiredIngredientTypes.every(type => item.ingredientTypes.includes(type))
```

- wants `[protein]`, cod has `[protein, fish]` -> match
- wants `[protein, fish]`, cod has `[protein, fish]` -> match
- wants `[protein, fish]`, flank has `[protein, meat]` -> no match

One predicate gives both rustic slots (`<protein>`, anything) and precise ones (`<protein><fish>`).

### Rarity is specificity

Nothing here is designed - it falls out of slots being categories. With roughly four ingredients per
sub-category, each slot pinned to a named item divides the ways to make a dish by four:

| Dish | Slots | Ways to satisfy |
|---|---|---|
| common | 3 generic | **64** |
| uncommon | 2 generic + 1 named | **16** |
| rare | 1 generic + 2 named | **4** |
| signature | 3 named | **1** |

So a dish's difficulty is tuned by **choosing how many slots to nail down**, not by inventing a rarity
stat. Every common dish stays reachable because every sub-category has a shop-available baseline.

---

## Methods

**Resolved 2026-08-10: one tool, one method.** A method is a single tool rather than a combination, and
the dish name comes from the method plus the star.

The old scheme split one appliance into several methods with accessories — Frying Pan alone was fry,
plus Spatula was saute, plus Gripper was grill. It bought a wider method roster off a narrow tool roster,
and it cost more than it bought:

- **A combination can be written that means nothing.** `food_seeing-jambalaya` asks for Spoon + Frying
  Pan, a pairing that appears once in 329 recipes and maps to no method. Under one-to-one that recipe is
  unrepresentable rather than merely wrong.
- **The accessories never gated anything**, because they were shop stock sitting beside their primaries.
  A Spatula bought in the same transaction as the pan is ceremony.
- **A tool grant is a story beat now**, so ten tools is ten moments — which is the thing the accessories
  were supposed to provide and did not.

### Roster

| Method | Tool | Standing |
|---|---|---|
| Sear / fry | **wok** | 9 recipes today |
| Boil | **pot** | 8 today |
| Stew / simmer | **donabe** | 5 today |
| Saute / wilt | **skillet** | 3 today |
| Grill | **hibachi** | 3 today |
| Puree / blend | **processor** | 1 today; sauces, juices, smoothies, pastes |
| Bake / roast | **cocotte** | new — pies, breads, roasts, gratins, tarts |
| Steam | **vaporera** | new — dumplings, fish, buns, vegetables, custards |
| Chop / raw | **caidao** | new — salads, tartare, slaws, garnishes |
| Chill / freeze | **icebox** | new — ice cream, sorbet, jelly, chilled soup |

**The names are a collection gathered from everywhere the party has been.** A wok, a donabe, a hibachi,
a caidao, a cocotte, a vaporera — each one is a souvenir of a place, which is a far better reason to
hand somebody a grill than "you can grill now." It also suits a road trip, and it gives every tool grant
a person and a place to come from rather than a shop counter.

Three shipped dishes are already reaching for methods that do not exist: **Acorn Pie uses no tools at
all** and wants an oven, **Vanilla Bleu Cone makes ice cream in a Soup Pot**, and **Steamed Imp Tongue
steams in a Frying Pan**.

### Tools are shared, and crafting sorts them by material

**Tools are shared infrastructure across crafting professions, not cooking's property** — finding one
lights up several professions at once, so no tool is a single-purpose pickup.

Cooking's tools answer **how**, so a cooking recipe names exactly one. The rest of crafting sorts by
**what a thing is made of**, so those recipes name as many tools as they use materials. That asymmetry
is deliberate: they are answering different questions, and the questions have different cardinality.

| Tool | Material | Present in the shipped data as |
|---|---|---|
| **cross-pein** | metal | Iron / Silver / Bleu / Sandwraith / Engle / Deep / Might / Ultanium, as Ore and Ingot |
| **adze** | wood | Oak, Dreamwood, Negapine, Preserved / Dead / Dry Branch, Pokey Stick, Aged Crook |
| **graver** | gems | Ruby, Topaz, Sapphire, Crystal, Emerald, and the Raw colour stones |
| **wirestripper** | circuitry | Tech Battery I-IV, the Stun Gun / Shocker line, Voltaic Sabatons |
| **shears** | fabric | Wisp Pelt, Dense Pelt, Loose Scales, Dead Veil |
| **alembic** | catalysts | the six colour Essences, Magic Core, Smith's Soulcrystal |

**No tool is a legitimate requirement.** Fifteen of the twenty-two fist recipes ask for nothing, because
gloves get put together by hand. That is a real answer and not a gap.

**Circuitry has a roster but no materials yet.** The weapons and armors that need it are shipped; the
things they are built out of have not been authored. Alchemy is in the same position, which is why the
alembic covers potions and gem upgrades that do not exist yet either.

Two material families have real volume and no tool:

- **Stone** — Round Stone, Circular Stone, Worn Stone, heavy in fist-smithing and survive-off. The graver
  can plausibly swallow these; a graver is a stone-and-metal tool.
- **Bone, fang and claw** — Sharp Stinger, Double Fangs, Dull Talon, Mossy Bone, Red Spines, Intact
  Stinger, Pierced Ear, across fist, spear, gun and feet. These are genuinely homeless.

Because a crafting tool follows from the materials, **a recipe's tools can be checked against its
ingredients** and a mismatch reported. That is a consistency gate the profession-based tools could never
support, and it is the payoff for sorting by material.

### Tools are carried, so their names have to be portable

**Resolved 2026-08-10: tools stay inventory items. They do not become switches.**

The question that forced this was that an oven, a steamer and a refrigerator are *furniture*, and a
party hauling furniture is absurd in a way a party hauling a frying pan is not. The tempting fix is to
make a tool a switch — a capability the player has rather than an object they carry.

That reads the problem wrong. The absurdity is not possession, it is **naming an appliance that happens
to be furniture**. The Obliterator is a blender and it does not feel ridiculous, because it is named
like something a lunatic would strap to a backpack. So the fix is the name: a **cocotte** is a lidded
cast-iron pot you genuinely bake in, a **vaporera** is a pot with a rack in it, and an **icebox** is a
box. Every one of them goes in a bag.

Three reasons the item form is worth keeping, in increasing order of how much they would hurt to lose:

- Switches cost plugin work. A tool is a `CraftingComponent` checked through `hasEnough()`, and
  `isDatabaseEntry` throws on a type it does not recognise, so a switch means a new component type plus
  a way for `Window_RecipeToolList` to render something with no icon and no name.
- **A switch flipping in an event is not a moment.** The whole argument for shared tools is that finding
  one lights up several professions at once, and that only lands if it is a thing you picked up.
- **Tools may be categorical.** `CraftingRecipe` already says so. A slot wanting *any oven* — a camp
  oven, a brick oven, whatever turns up in chapter five — is free with items and impossible with a
  switch.

**Tools are given, never bought.** They used to be shop stock, gated by which page of the Temporal
Merchant's inventory you had unlocked, which meant the pickup was a transaction. Every tool now arrives
through a story beat instead. That is what makes the item form worth its cost — a purchase is not a
moment, and neither is a switch.

The alternative that is *not* refuted here is **stations**: cooking bound to a place, where the kitchen
you stand in declares which methods it offers. That is a different design with real plugin work, and it
would make food a thing you prepare before leaving rather than in the field. It is not chosen, and it is
not dismissed.

**Deferred 2026-08-05, not rejected:** *Cure / dry* (jerky and preserves — thematically ideal for a road
trip, and portable food is a real mechanical niche) and *Ferment* (cheese, pickles, drink). Both clear
five recipes easily. Both introduce **time** as a concept, which nothing else in cooking uses. Revisit
once the ten-method roster is built and proven.

---

## The menu is organised by lane

**Resolved 2026-08-10.** A crafting **category** is a tab in the crafting menu. Cooking's two —
`cook-meal` and `cook-drink` — are replaced by the six food lanes, plus a seventh for outputs that have
no lane.

### Why lanes, and not methods

Every other profession in the game already categorises by **what the recipe makes**, never by how it is
made:

| Profession | Category is | Method is |
|---|---|---|
| Bladesmithing, Spearcrafting, Gungineering, … | the weapon family | Hammer, or Hammer + Mitts — unnamed, invisible |
| Sole Defender, The Weaver, Fabulous Footwork | the equip slot | Hammer + Gripper, Scissors, … |
| Runic Creations, Gemology | the output classification | Gripper; Mitts + Gripper |
| **Cooking** | **meal or drink** | Frying Pan, Soup Pot, Soup Pot + Spoon, … |

Smithing reads as cut-and-dry precisely because those two axes are separated. Cooking read as chaotic
because it never had an output-family axis at all — "meal versus beverage" is a serving temperature, not
a family — so every bit of organising pressure fell onto the tool combination, which is the wrong axis
and was never named anyway.

The tool combination is a poor axis on its own evidence. Across all 329 shipped recipes there are only
about twenty distinct combinations: Gemology is forty recipes behind a single Gripper, Runic Creations
twenty behind a single Mitts + Gripper. A field that is re-stated identically forty times is a property
of the *method*, not of the recipe.

### The rule

> **A recipe lives in the lane of its first output.**

**This is an authoring rule, not a derivation.** `categoryKeys` is still written per recipe and no plugin
computes it from the output's tags — so nobody should go looking for resolution code, and nothing stops
a recipe being filed wrong. First output rather than any output, because a recipe may emit any mix of
items, weapons and armors; the same reason `finishableOutput` needs an index.

No new tagging is needed to follow the rule, because both tag families already speak the same six words:

```
<food:TYPE>            -> protein, vegetable, carb, fruit, dairy, sweet
<ingredientType:LANE>  -> those same six, plus vessel, herb, liquid, spice, oil
```

A consumable carries its lane in `<food:>`; an ingredient carries it in `<ingredientType:>`. Either way
the tab is read from a tag the author had to write regardless, so a dish is never classified twice.

### The tabs

| Lane | Category name |
|---|---|
| protein | **Meaty Members** |
| vegetable | **Produce Power** |
| carb | **Densecraft** |
| fruit | **Fruition** |
| dairy | **Dairy Air** |
| sweet | **Confection Convection** |
| *(none)* | **Pantry Paradise** |

**Pantry Paradise holds only what has no lane** — which today means the shared bucket, and in practice
means oils and waters. Six of the seven oils and three of the four waters are cooked; spices, herbs and
vessels are bought, farmed or dropped and so need no recipes at all. Roughly ten recipes.

It is tempting to widen Pantry into "crude components" and give it the breads, noodles, cheeses and
creams too. **Do not.** Bread has a lane and cheese has a lane, so filing them by how refined they are
instead reintroduces exactly the ambiguity this section removes: the player would have to know whether a
thing is grouped by what it is or by how processed it is. Pantry is the home for the laneless and
nothing else, which keeps the rule to one sentence with no judgement calls in it.

**Pantry is exclusive, not cross-cutting.** Oil is not protein-and-pantry, it is pantry.

### What retires, and what survives

`cook-meal` and `cook-drink` both go away. Leaving either one alongside the lanes would put "Protein"
and "Drink" on screen as siblings, and the player would have no way to learn what a tab even means.

That costs **Bar's Tender**, which is a good name attached to a real identity. It survives by becoming a
**person rather than a tab** — the bartender who teaches drink recipes. Cuisines are taught by chefs,
quests and story beats already, so this needs no schema and no menu space, and a drink simply files
under the lane of whatever it is made of: River Smoothie is fruit, Gel-o is sweet, Malk is dairy.

---

## Unlocks

The count of recipes and the method of delivery are circularly dependent — how many you can afford
depends on how they are delivered, and what delivery makes sense depends on how many there are. The cut
that resolves it:

**Components are all unlocked from the start. Cuisines are taught.**

| | Unlocked | Visible | Discovered |
|---|---|---|---|
| **Component** | always, all of them | **only when makeable** | flagged on first craft |
| **Cuisine** | when taught | **always, even when unmakeable** | flagged on first craft |

That asymmetry is the whole trick. Components hide when useless so the list never becomes hundreds long.
Cuisines stay visible when useless because an unmakeable cuisine is a **goal** — it tells you where to go.

This makes combinatorial volume free. Whether there are 60 components or 600, the player only ever sees
the handful they can cook right now, and none of them cost an unlock event.

`maskedUntilCrafted` already exists on every recipe row in `config.crafting.json` and is the discovered
flag this needs.

### What actually gets unlocked

Recipes are the wrong altitude. **Capabilities** are the right one:

- **Methods** — roughly ten moments. Acquiring the Obliterator retroactively opens a puree option on
  every ingredient already owned. That is a far better feeling than a journal handing over seven
  unrelated dishes.
- **Ingredient families** — arriving somewhere new introduces new stars, and every method already known
  lights up against them.
- **Flagship cuisines** — perhaps 15-20 across the whole game, taught by chefs, quests and story beats.
  These stay special precisely because everything else is ambient.

**The player has no concept of chapters** — chapters are an authoring structure. Cadence should key to
what the player perceives, which is *arriving somewhere new*.

### Recipe Journals I / II / III are retired

Items 461-463 and common events 161-163. Their own descriptions give the failure away: Journal I teaches
"a bundle of recipes for every meal of the day" — imp tongue, salad, coral, soup, an ice cream cone,
fried rice and a rack of ribs. Six food families in one drop. The problem was never that there were only
three journals; it was that a random drop taught seven unrelated dishes at once, so nothing was earned,
nothing was chosen, and the family lanes stayed invisible.

---

## Finishing touches

An optional extra ingredient chosen at craft time that modifies the output. In cooking it is a
**garnish**; at the forge it is **reinforce**; on accessories, **polish**. One concept, one code path,
different label.

**It is a create-time modifier and it is not refinement.** It does not count toward
`jaftingRefinedCount`, and a dish already in the bag can never be taken back to be garnished. You
garnish while cooking or not at all.

### Why it lives where it does

The machinery for minting a new database row - allocation, lineage, replay - belongs to
**J-JAFTING-Refinement**, which already does exactly this for equipment. The *moment* belongs to
**J-JAFTING-Creation**, because refinement's scene is built around picking two equips and previewing a
trait merge, and garnishing shares none of that UI. Making it fit there would mean a second large
scene plus asking the player to cook in one place and finish in another.

So create owns the step and calls into refine's minting, gated by the one namespace check this
codebase allows for a genuinely optional sibling:

```javascript
// GOOD - refinement is genuinely optional here.
if (J.JAFTING.EXT.REFINE)
{
  // the finisher step exists.
}
```

No refinement installed, or a category that has not opted in, and the step silently does not appear.
Core never learns about minting - putting it there would hand every extension a capability none of
them asked for.

### The domain is derived, never configured

Items carry **effects**; equipment carries **traits**. They are not interchangeable, so the finishable
output's type decides everything:

| Output type | Verb | Merges | Modifier lives in |
|---|---|---|---|
| item | garnish | effects | items - herbs, oils, citrus |
| weapon / armor | reinforce | traits | armors - the Core family (`a451-455`) |

"Can I garnish a sword" is not a validation rule that fails, it is a code path that does not exist.
Note this is the same rule the ingredient split already follows: **the datastore a thing lives in
declares which crafting verb can use it.** Ores and ingots are items, so they are things you build
*from*; the trait-bearing Cores are armors, so they are things you improve *with*.

### What a finished row is

A clone of the base, with the finisher's effects concatenated on and a prefix applied to the name -
`Sprig of Mint` + `Tasty Stew` becomes `Minty Tasty Stew`. The prefix comes from a tag on the finisher;
the `+N` suffix stays refinement's.

**The clone inherits the base's `<ingredientType>` tags**, so a garnished dish is still a valid
ingredient - Minty Grilled Bearcat satisfies `<any meat>` exactly as the plain one does.

**Prefixes do not cascade.** A garnished component used inside a cuisine does not push its prefix up;
the cuisine can be garnished on its own terms at its own craft time. This is what prevents
"Spicy Minty Curry Rice".

### Data shape

- **Category** carries a boolean for whether a finisher step exists at all. Absent means no, so no
  existing category needs touching.
- **Recipe** carries `finishableOutput`: `-1` never, `0` (or absent) the first output, `>0` an explicit
  index. This matters because a recipe may output any mix of items, weapons and armors in any
  quantity, and only one of them can be the finishable one.
- **One finisher per craft, finishing the whole batch.** Two stews and one sprig of mint yields two
  minty stews - which makes large batches more efficient to finish rather than more expensive.
- **Finisher item** carries `<garnish:[STATE_ID, DURATION, STACKS]>` and a prefix tag. Domain-specific
  tag names mean an item can be both a garnish and a polish without either system knowing the other
  exists.

### Reclamation, checked

Refinement already reclaims: when the last copy of a dynamic row leaves the party it splices the
lineage out of the tracked list and blanks the datastore row via `createEmpty`. `RPG_Item.createEmpty`
exists, so the item path has its primitive.

The counter is **monotonic** - `increments()[type]++` with no decrement and no free list - so reclaimed
indices are blanked but never reused. That is fine at food's churn rate: the index climbs by one per
garnished batch, blanked rows are cheap, `$dataItems` is never persisted (storing lineage instead of
rows is the whole design), and replay cost scales with *live* garnished stacks rather than historical
ones.

### Build work

**J-JAFTING-Refinement** - a third `RefinementTypes` entry; `$dataItems` in the datastore branch; an
item lineage list on `Game_Party`; `refreshDatabaseItems`; `determineFinishedOutput(base, finisher)`
merging effects beside the existing trait merge; an item branch in the reclaim path.

**J-JAFTING-Creation** - the finisher step in the craft flow, gated on the namespace check.

**Data** - the category flag, `finishableOutput`, and the finisher tags.

---

## Database migration

Nothing here needs new plugin work. A recipe is ingredients (consumed), tools (required, not consumed)
and outputs (generated), and all three accept any item, weapon or armor. A recipe consuming another
recipe's output already works — River Smoothie and Jelli Hors d'Oeuvres do it today.

1. **Tag every consumable** with `<food:TYPE>`. Currently only finished meals carry one. Raw
   non-consumable ingredients are excluded — see "The star sets the family" for why, and for the open
   question of whether they need a separate lane marker at all.
2. **Move food materials from armors to items**, leaving refinement materials as armors.
3. **Collapse each food family to one common ingredient plus its named signatures.** Drop tier
   semantics entirely. The signatures are the entries that already carry a proper noun.
4. **Author supreme cuisines** against those signatures, and confirm no everyday recipe requires one.
5. **Assign the orphaned lanes** — Root becomes **carb**, Gelatin becomes **protein** (it is slime
   meat), Slime becomes **sweet** (the dessert roster). *Resolved 2026-08-05.*
6. **Build fruit and dairy ingredient families.** Neither exists in any form today. Dairy is hunted
   from **Minitaur/Megataur and the Quadruped subgroup**; fruit comes from Tree harvest nodes.
7. **Give five ingredients a source.** Cooking Oil (in 5 recipes), Tomato, Bell Pepper, Green Beans and
   Nuts have no shop entry, no drop tag and no grant event anywhere.
8. **Wire up harvest nodes** so Grass and Trees yield grain, fruit and produce.
9. **Split the 31 existing recipes** across the component and cuisine layers. Most already sit naturally
   on one side.
10. **Reach the six unreachable recipes** — Ghastly Goulash, River Smoothie, Slime Puree, Jelli Hors
    d'Oeuvres, Blood-seared Asp and Grim Flankebobs are taught by nothing and are the six with `price: 0`.
11. **Fix Ghastly Goulash's ingredients rather than its tag.** Real goulash is a beef stew; the tag
    `protein` was right and the recipe — onions, oil and ghastly powder — is what is wrong.
12. **Adopt the three unused pantry items** already in the database and used by nothing: **Lettuce**
    (i81), **Pasta** (i89) and **Coconut** (i95). Coconut is a fruit, which is the emptiest lane.
13. **Retire Recipe Journals I-III** (items 461-463, events 161-163) and update
    `../unlockables/recipe-journals.md`.
14. **Replace the cooking categories** — delete `cook-meal` and `cook-drink`, add the six lane tabs plus
    Pantry Paradise, and re-file all 31 existing cooking recipes by the lane of their output.
15. **Replace the tool roster.** Twelve tools become sixteen, and none of the old names survive, so this
    is a re-assignment rather than a renumber — every one of the **423 references** (384 in
    `config.crafting.json`, 39 in map events) gets rewritten. Cooking is mechanical: each old tool
    *combination* maps to exactly one new tool, with the mis-tooled recipes below as the only
    exceptions. Crafting is not: each recipe's tools follow from the materials it consumes, so those are
    derived from ingredients and reviewed. [`backup-tools.json`](backup-tools.json) records the
    starting state; `bun tools/tool-ids.js plan` reports every reference the change strands.
16. **Take the tools out of the shop.** Tools stop being purchasable and become story grants. The
    Temporal Merchant (`Map20` event 31) stocks 6, 10 and 12 of them across its three pages, which is a
    progression gate that no longer has anything to gate. The event itself survives — tools are only a
    slice of its 18, 41 and 51 goods.
17. **Re-tool the six mis-tooled recipes.** Acorn Pie uses no tool and wants the Dutch Oven; Vanilla Bleu
    Cone wants the Icebox; Steamed Imp Tongue wants the Steamer Basket; River Smoothie wants the
    Obliterator; Molten Fried Rice boils in a Soup Pot and should fry; and Seeing Jambalaya carries a
    Spoon + Frying Pan pairing that exists nowhere else in 329 recipes and matches no method.

---

## Open decisions

- **The garnish state pool** - roughly eight utility states (antitoxin, regen, mana, braced, keen and
  so on). Deliberately left undefined; the architecture does not depend on the specific list.
- **Whether dishes differ beyond their garnish.** The chain is per-family and the same for every dish
  in it, so without garnishes a signature dish grants what a common one does. One-shot heal magnitudes
  were considered and rejected: food can only be eaten every 2-10 minutes, so a burst heal is an
  afterthought no matter how large.
- **What happens to the finisher on a cancelled craft** - consumed or returned.
- **World sources for fruit, dairy and sweet.** All three lanes exist on paper and have no drop or
  harvest wiring yet.

### Resolved

| Date | Decision |
|---|---|
| 2026-08-10 | **Crafting categories are the six food lanes**, plus Pantry Paradise for laneless outputs. `cook-meal` and `cook-drink` retire. |
| 2026-08-10 | **A recipe lives in its output's lane**, read from `<food:>` or `<ingredientType:>`. The two vocabularies already agree on the six names. |
| 2026-08-10 | **Method is never a tab.** It is a tool requirement, an unlock moment, and the dish-name generator — the same role Hammer + Mitts plays in smithing. |
| 2026-08-10 | **Pantry Paradise is exclusive and narrow** — the laneless only, not "crude components". Breads and cheeses file under carb and dairy. |
| 2026-08-10 | **Bar's Tender becomes a person, not a tab** — the bartender who teaches drink recipes. |
| 2026-08-10 | **Tools stay items, not switches**, and a new tool must be named as something portable rather than as furniture. Stations remain unchosen and unrejected. The specific names in the roster are proposals. |
| 2026-08-10 | **One tool, one method.** Secondary tools are gone; a cooking recipe names exactly one tool and that tool is the method. An unmeaning combination becomes unrepresentable. |
| 2026-08-10 | **Cooking tools are named as a global collection** — wok, donabe, hibachi, caidao, cocotte, vaporera — so each grant is a souvenir of a place rather than a capability unlock. |
| 2026-08-10 | **Crafting tools sort by material, not by profession** — cross-pein, adze, graver, wirestripper, shears, alembic. A crafting recipe names one per material it consumes, so its tools can be validated against its ingredients. |
| 2026-08-10 | **Requiring no tool is a legitimate answer.** Gloves are assembled by hand, which is why fifteen fist recipes ask for nothing. |
| 2026-08-10 | **Tools are given, never bought.** Every tool arrives through a story beat; the shop stops stocking them. Acquiring one is a moment, which is the whole reason they are items. |
| 2026-08-10 | **No method layer in the schema.** Method stays a convention the author holds, not a `methods` block — partly because ten methods fit in one head, and partly because the editor replaces `config.crafting.json` wholesale and would erase any block it does not know about. |
| 2026-08-05 | **Recipes match categories, not item ids.** Adding an ingredient later costs zero recipes. |
| 2026-08-05 | **`<ingredientType>` is many-per-item; `<food:TYPE>` is one, consumables only.** Ingredients are promiscuous, dishes are decisive. |
| 2026-08-05 | **Finishing touches are create-time and are not refinement.** No refine count, no re-garnishing after the fact. |
| 2026-08-05 | **Create owns the finisher step; refinement owns the minting.** Gated on `J.JAFTING.EXT.REFINE`; core stays out of it. |
| 2026-08-05 | **Garnish-vs-reinforce is derived from the output's type**, never configured. Items have effects, equipment has traits. |
| 2026-08-05 | **Gelatin is protein** (slime meat); **Slime is sweet** (the dessert roster). |
| 2026-08-05 | **Cure and Ferment deferred**, not rejected. Revisit after the ten-method roster proves out. |
| 2026-08-05 | **Dairy is hunted from Minitaur/Megataur and the Quadruped subgroup**, not primarily bought. |
| 2026-08-05 | **No one-kill boss signatures** — RNG must not gate a temporary buff. See "Where signatures drop." |
| 2026-08-04 | **Food ingredients are not graded** — one common per lane, plus named signatures. |
| 2026-08-04 | **Armors are refinement, items are food.** The split is absolute. |
| 2026-08-04 | **Components always unlocked and filtered by inventory; cuisines taught.** |
