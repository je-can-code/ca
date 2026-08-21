# Recipe drafts

> **Status: notes, not data.** Drafted 2026-08-14. Names, descriptions, tools and ingredient slots
> only — no item ids, no icons, no `config.crafting.json` rows. The protein family below was authored
> first as a shape-finding exercise and **is expected to be revised** once the other lanes have a
> tier 1, because half of what protein wants to cook with does not exist yet.
>
> **Related:** [`recipe-system.md`](recipe-system.md) is the design authority;
> [`ingredient-sorting.md`](ingredient-sorting.md) is the ingredient roster these slots are written
> against.

---

## The tier pyramid

Tiers are expressed **only** by how many slots are pinned to a named item. Nothing is tagged, graded
or flagged — the ladder lives in the shape of the recipe roster and nowhere else.

| Tier | Count per family | Named things | Category slots |
|---|---|---|---|---|---|
|  | 1 | ~32 | none |  | all of them |
|  | 2 | ~16 | one, sometimes two | a couple |
|  | 3 | ~8 | two or three | one or two |
|  | 4 | ~4 | **all of them** | none |

**A "named thing" is any specific item the recipe asks for by name** — a raw ingredient like
`colossus gelatin`, or another recipe's output like `Mystery Meat Paste`. There is no third slot type
and components are not exempt: asking for a component is asking for a named thing, because the player
must go and have it.

**Name the thing the dish actually needs, at any tier.** If fried rice wants scallion, the slot says
`ao negi` — not `any greens` and a hope. The bands describe the *shape* of a tier, not a prohibition:
a low-tier dish demanding one or two specific ingredients because it genuinely demands them is correct
and stays low-tier. Hiding a requirement behind a category to protect a count is how a recipe stops
being a dish.

**These bands are a floor, not arithmetic.** Ingredient count is a *consequence* of getting the dish
right, never a target — the first pass of this document was authored to the numbers instead of to the
food, and it produced 188 four-ingredient recipes out of 360, zero fives, zero sixes, and all
twenty-four signatures at exactly four slots. A recipe is also free to use both the raw and the cooked
form of the same thing: `1x any onion` beside `2x Caramelised Onions` is a real technique and it makes
the description do work it otherwise could not.

### What a signature actually is

**One or two rare named ingredients, plus two to four components drawn from this lane and others.**

That shape is the whole point. A signature is not an expensive shopping list — it is **the sum of
everything your kitchen already knows how to make**, crowned with something you had to go and get.
Making one is an achievement because it presumes the rest of the roster, and the reward matches:

- the **OTIB** permanent passive, granted once per actor on first consume
- a **unique custom state** belonging to that dish alone, on top of its lane's ordinary food chain

Nothing else in the game grants a state of its own, which is what keeps twenty-four dishes special
across a roster of hundreds.

**A signature's name must be a wholly original dish name.** Never the star ingredient with a modifier
attached — not *Faerie Bouquet, Whole*, not *Ouroboros Rack*, and certainly not the item name repeated
back verbatim. Tiers 1 through 3 are allowed to be descriptive, because a player scanning a long list
needs to know what a thing is made of. A signature is the opposite job: it is a **title**, it is the
only name in the lane that has to be remembered rather than parsed, and inheriting its noun from the
shopping list is what stops it sounding like one. Name it for what it does, what it looks like, what
it cost you, or what it is trying to be.

**Signatures carry an OTIB.** `<otib:[STATE_ID, ...]>` grants a permanent passive on first consume,
per actor, through `J-Passive`'s OTIB extension. That is what makes spending a rare ingredient on a
temporary buff defensible — the buff is the repeat reward, the passive is the first one.

---

## Composition has a direction

**Discovered 2026-08-14, and it was already sitting in the roster.** Every ingredient in
`ingredient-sorting.md` is marked with where it comes from, and nine sub-categories say **cook**:

| Lane | Cooked, not found |
|---|---|
| carb | noodle (all 4), bread (all 4) |
| dairy | cheese, cream, butter, yogurt — 16 of 20 items |
| sweet | syrup, rock candy, powdered sugar, all 4 gummies |
| shared | oil — 6 of 7 |

The inverse is the useful half: **protein, vegetable and fruit contain zero cooked ingredients.**
Every one is shop, drop or farm.

So the lanes split into **makers** (carb, dairy, sweet, shared) and **finders** (protein, vegetable,
fruit), and composition runs from the first group into the second. A protein tier 3 wants a stock, a
butter, a bread and an oil — so it cannot be written until the maker lanes have a tier 1.

**Authoring order follows from that:** tier 1 across all lanes in maker-first order — carb, dairy,
sweet, shared, then protein, vegetable, fruit — then a sweep for tier 2, then 3, then 4.

### Rules for composing

- **Two hops maximum, one as the norm.** A tier 4 eating three tier 3s that each eat two tier 1s is a
  ten-craft tree for a ten-minute buff, and every hop is another trip through the crafting UI.
- **Compose where it is culinarily true, not where the tier says so.** Stock, paste, dough, oil,
  cream, cheese and noodle are real intermediate goods. A grilled flank is not an intermediate good,
  it is dinner.
- **Roughly 25-50% of tier 1 feeds tier 2, and every bit of it stays edible on its own.** Role is not
  a type. Mystery Meat Paste sits in the bag like anything else and the player is entitled to eat it
  straight.
- **Nothing gets stranded.** A component that no recipe consumes is either a dish or a mistake.
- **A duplicate is a duplicate dish, not a duplicate ingredient list.** Two recipes sharing a slot list
  are fine when the method makes different food — `any flank + oil + spice` is a steak over a hibachi
  and cracklings in a wok, and that pairing turns up in three lanes because hot fat and salt is most
  of cooking. The test is the **output**: if two recipes would sensibly produce the same `Items.json`
  row, one of them should not exist. Sweet had two dishes that both buried a slime under powdered
  sugar, wearing different names — that is one dish written twice.
- **Descriptive names hide duplication; evocative names hide it better.** Naming a dish after its
  contents is ugly, but two dishes with the same contents then *look* alike on the page. Renaming them
  well removes the tell without removing the problem, so run the shape check rather than trusting the
  page.
- **Never write "hazelnut butter" for browned butter.** *Beurre noisette* is butter cooked until the
  solids toast and it smells of hazelnuts — and **Hazelnut Butter** is a separate item made of actual
  hazelnuts. Say "butter cooked to hazelnut" and the collision disappears.
- **A crisp on something soft is the most reusable move in the roster**, and four already exist:
  Potato Crisps, Kale Crisps, Parmesan Crisps and Crisped Flank. Any soft dish — a stew, a soup, a
  loaded anything — is improved by scattering one over it, and a pepper-seasoned crisp is a gap
  worth filling deliberately rather than by accident.
- **A dish output never crosses lanes until every lane is drafted.** A **roster ingredient** is always
  fair game, including a cooked one — `any butter`, `parmesan` and `devil slick` are entries in
  `ingredient-sorting.md` and any lane may reach for them. An **invented dish output** is not, because
  writing carb against protein's dishes bakes the first lane drafted into every lane after it, and the
  later lanes never get to offer a better answer. Cross-lane composition is the cross-examination
  pass's job, once all six are on the table.

---

## PROTEIN

Tools: wok (sear/fry), pot (boil), donabe (stew), skillet (saute), hibachi (grill), obliterator
(puree), cocotte (bake/roast), vaporera (steam), caidao (chop/raw), icebox (chill).

`any X` is a category slot. A bare item name is a pinned slot. A **Titled Name** is another recipe's
output.

### Tier 1 — 32, every slot a category

| ❌ | # | Name | Tool | Types | 1 | 2 | 3 | 4 | 5 | 6 | 7 | Description |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  | 1 | Scrambies | skillet |  | 3x any egg | 1x any butter | 1x any spice |  |  |  |  | The default breakfast of anyone who woke up in a tent. Whisked hard, cooked fast, and seasoned by whoever is holding the shaker. |
|  | 2 | Egg Drop Situation | pot |  | 2x any egg | 2x any liquid | 1x any herb |  |  |  |  | Egg poured in a thin ribbon into water hot enough to catch it on the way down. Whether it becomes soup or wet egg depends entirely on your wrist. |
| ❌ | 3 | Boiled Eggs | pot |  | 4x any egg | 1x any liquid |  |  |  |  |  | A dozen minutes at a rolling boil and you have food that travels. Peel it over a rock and try not to think too hard about which creature laid it. |
|  | 4 | Omelette du Roadside | skillet |  | 3x any egg | 1x any cheese | 1x any herb |  |  |  |  | Folded once, badly, over whatever cheese was still in the bag. French in ambition and roadside in execution. |
|  | 5 | Seared Meat | skillet |  | 2x any meat | 1x any oil | 1x any spice |  |  |  |  | Hot pan, dry surface, hands off. This is less a recipe than the first thing anybody ever learns to do to an animal. |
|  | 6 | Backroad Skewers | hibachi |  | 3x any meat | 1x any vessel | 1x any spice |  |  |  |  | Cubes of whatever you killed threaded onto whatever you were carrying. The vessel is structural here rather than decorative. |
| ❌ | 7 | Slow Braise | donabe |  | 2x any meat | 2x any root | 1x any oil | 1x any liquid | 1x any herb |  |  | Browned hard in fat first, then three hours at a bare simmer, which turns the worst cut you own into the best thing you have eaten all week. Patience is the only expensive ingredient in it. |
|  | 8 | Mystery Meat Paste | obliterator | paste | 3x any meat | 1x any oil |  |  |  |  |  | Not a meal, and never trying to be. It goes into other things, it has never once apologised for existing, and yes, you may eat it with a spoon. |
|  | 9 | Roast of Indeterminate Origin | cocotte |  | 2x any meat | 2x any root | 1x any oil | 1x any spice |  |  |  | Lidded, buried in vegetables, and left alone until the pot stops rattling. Nobody at the table will ask what it was, which is precisely the point. |
| ❌ | 10 | Tail Stew | donabe |  | 2x any tail | 1x any onion | 1x any liquid | 1x any spice |  |  |  | Long bones, deep marrow, and a broth that goes sticky on your lips. The animal is a matter of opinion; the collagen is not. |
| ❌ | 11 | Tailmeat Buns | vaporera |  | 2x any tail | 1x any bread | 1x any greens |  |  |  |  | Shredded tail meat folded into dough and steamed until the whole basket fogs over. Best eaten standing up, immediately, burning your fingers. |
|  | 12 | Flank on the Grate | hibachi |  | 2x any flank | 1x any oil | 1x any spice |  |  |  |  | A big flat muscle over a hot grate, sliced against the grain. Do it wrong and it is a shoe; do it right and it is a Tuesday you remember. |
| ❌ | 13 | Rolled Flank Roulade | cocotte |  | 2x any flank | 1x any greens | 1x any cheese | 1x any herb |  |  |  | Pounded flat, stuffed, rolled and roasted under a lid. Slicing it reveals a spiral that makes you look like you know exactly what you are doing. |
|  | 14 | Charred Rack | hibachi |  | 3x any ribs | 1x any oil | 1x any spice |  |  |  |  | Bones on the outside so the fire has something to hold on to. There is no dignified way to eat this and nobody has ever attempted one. |
|  | 15 | Rib Broth | pot | liquid | 3x any ribs | 2x any liquid | 1x any onion |  |  |  |  | Bones, water, hours. Half of everything else in the kitchen is downstream of this one pot. |
|  | 16 | Fried Wing Pile | wok |  | 4x any wing | 1x any oil | 1x any spice |  |  |  |  | Twice through the oil, once to cook it and once for the crackle. Portion control remains theoretically possible. |
|  | 17 | Steamed Wings | vaporera |  | 3x any wing | 1x any herb | 1x any liquid |  |  |  |  | Gentle heat renders the fat without picking a fight with the skin. This is what you make when somebody in the party is ill. |
| ❌ | 18 | Eyeball Skewers | hibachi |  | 3x any eyeball | 1x any vessel | 1x any spice |  |  |  |  | They pop. That is the entire appeal, and if it is not, this dish is not for you. |
| ❌ | 19 | Ocular Consomme | pot |  | 2x any eyeball | 2x any liquid | 1x any egg | 1x any herb |  |  |  | Clarified through a raft of egg white until it is disturbingly clear, then salted until it is disturbingly good. Everyone drinks it and nobody looks directly into the bowl. |
|  | 20 | Blood Pudding | donabe |  | 2x any blood | 1x any grain | 1x any butter | 1x any spice |  |  |  | Set slowly over low heat until it will hold a spoon upright. An acquired taste that most people acquire somewhere around the second bite. |
|  | 21 | Crimson Custard | vaporera |  | 2x any blood | 2x any egg | 1x any cream |  |  |  |  | Steamed only until it barely sets, then eaten with a spoon. Savoury, iron-bright, and far better than its colour has any right to suggest. |
|  | 22 | Heartpaccio | caidao |  | 2x any heart | 1x any citrus | 1x any oil | 1x any spice |  |  |  | Raw, cut fine, dressed with acid and left alone for five minutes. Heart is the leanest muscle an animal owns and it tastes like the animal meant it. |
|  | 23 | Skewered Hearts | hibachi |  | 3x any heart | 1x any vessel | 1x any herb |  |  |  |  | Over coals, turned once, salted twice. Street food in every city the party has ever walked through and cheap in all of them. |
| ❌ | 24 | Wobble Cubes | icebox |  | 3x any gel | 1x any liquid | 1x any sugar |  |  |  |  | Set cold until it will hold an edge, then cut into cubes that refuse to hold still. Structurally a dessert and spiritually a toy. |
|  | 25 | Gel Stock | pot | liquid gel | 2x any gel | 2x any liquid | 1x any herb |  |  |  |  | Melted down into a broth that sets again the moment it cools. This is the base layer under half the fancy things you will ever make. |
|  | 26 | Jiggle Fritters | wok |  | 3x any gel | 1x any grain | 1x any oil |  |  |  |  | Coated and dropped into hot oil, where the outside crisps before the inside can escape. Bite carefully, because the middle is molten and holds a grudge. |
| ❌ | 27 | Pan Fish | skillet |  | 2x any fish | 1x any oil | 1x any spice |  |  |  |  | Skin down, pressed flat, and left alone until it releases itself from the pan. The pan tells you when it is ready and you should believe it. |
|  | 28 | Entire Steamed Fish | vaporera |  | 1x any fish | 1x any greens | 1x any herb | 1x any liquid |  |  |  | A whole fish laid over aromatics with the lid on for ten minutes. Serving it whole is a flex and everybody at the table knows it. |
|  | 29 | Fish Chowder | donabe |  | 2x any fish | 1x any tuber | 1x any milk | 1x any onion |  |  |  | Fish simmered so gently in milk that everything eventually agrees to be one thing. Thicker than a soup, looser than a stew, better than either. |
|  | 30 | Sashimi | caidao |  | 2x any fish | 1x any citrus | 1x any spice |  |  |  |  | No heat and nowhere to hide. This dish is entirely a referendum on your knife and your fish. |
|  | 31 | Crisped Flank | wok | crunch | 4x any flank | 1x any oil | 1x any spice |  |  |  |  | Sliced thin and fried hard until the fat renders out and what is left shatters between your fingers. It gets scattered over other food and it has never once made anything worse. |
|  | 32 | Meatballs | skillet |  | 3x any meat | 1x any grain | 1x any egg | 1x any herb |  |  |  | Bound with grain and egg, rolled between wet palms, browned all over and then finished in whatever sauce is going. Rolling them all the same size is the only difficult part and nobody manages it. |

### Tier 2 — 16, one pinned slot

| ❌ | # | Name | Tool | Types | 1 | 2 | 3 | 4 | 5 | 6 | 7 | Description |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  | 33 | Bearcat Burnt Ends | hibachi |  | 2x bearcat flank | 1x any sugar | 1x any oil | 1x any spice |  |  |  | The tips of the flank cut away, sauced, and returned to the coals until they candy. The best part of the animal, and there are only ever four of them. |
|  | 34 | Beefy Tail Ragu | donabe |  | 2x beefy tail | 1x any tomato | 1x any onion | 1x any herb |  |  |  | Simmered until the meat gives up entirely and joins the sauce. Traditionally served over anything that will hold still long enough. |
| ❌ | 35 | Lamia Rib Tips | wok |  | 2x lamia ribs | 1x any sugar | 1x any oil | 1x any spice |  |  |  | Serpent ribs are long, thin, and cook in a quarter of the time you would expect. Fry them hard and eat them with your hands. |
| ❌ | 36 | Double-Winged Confit | cocotte |  | 2x double wing | 2x any oil | 1x any herb |  |  |  |  | Submerged in fat and held at a whisper of a simmer for most of a day. It keeps for a month, which is the only reason anyone invented it. |
|  | 37 | Snooping Eyeball Bisque | obliterator |  | 2x snooping eyeball | 1x any cream | 1x any liquid | 1x any spice |  |  |  | Blended smooth so that nothing left in the bowl can look back at you. Rich, faintly briny, and best served to guests who did not ask what was in it. |
|  | 38 | Virgin Blood Sausage | vaporera |  | 2x virgin blood | 1x any grain | 1x any onion | 1x any spice |  |  |  | Bound with grain, cased, and steamed until it is firm all the way through. Sliced thin it goes translucent at the edges, which is how you know it worked. |
| ❌ | 39 | Hydro Heart Ceviche | caidao |  | 1x hydro heart | 2x any citrus | 1x any pepper | 1x any herb |  |  |  | The acid does all the cooking while you stand there contributing nothing. Twenty minutes later it is opaque, firm and outrageously good. |
| ❌ | 40 | Big Gelatin Terrine | icebox |  | 2x big gelatin | 1x any greens | 1x any herb | 1x any liquid |  |  |  | Set in a lined box with vegetables suspended mid-fall through it. Slicing it is the entire performance and everybody should be watching. |
| ❌ | 41 | Sparkling Fish Crudo | caidao |  | 2x sparkling fish | 1x any citrus | 1x any oil | 1x any spice |  |  |  | Sliced thin enough to read the plate through and dressed at the last possible second. The fish is doing all of the work here and it knows it. |
| ❌ | 42 | Froggo Egg Custard | vaporera |  | 3x froggo eggs | 1x any milk | 1x any spice |  |  |  |  | Steamed low and slow until the whole thing wobbles as a single piece. Silkier than a bird's egg and roughly twice as unsettling to watch. |
| ❌ | 43 | Too Much Garlic | wok |  | 2x any meat | 4x garlic | 1x any oil |  |  |  |  | Far more garlic than is reasonable, cooked down until it goes sweet and collapses. There is a genuine risk this becomes your signature dish socially. |
|  | 44 | Cumin-Crusted Ribs | cocotte |  | 3x any ribs | 2x cumin | 1x any oil | 1x any spice |  |  |  | Rubbed heavy, roasted low, and left until the crust is audible under a knife. Smells like a market street two towns over from wherever you are. |
|  | 45 | Bone-Drunk Tofu | donabe |  | 4x tofu | 2x **Rib Broth** | 1x any spice |  |  |  |  | Blocks of bean curd lowered into stock made from bones and left to drink until they come out heavier than they went in. The one ingredient in this lane that never lived, doing a better impression of everything that did. |
| ❌ | 46 | Fresh Fish Chowder | donabe |  | 2x fresh fish | 1x any tuber | 1x any cream | 1x any onion |  |  |  | The fish goes in barely poached at the very end so that it does not shred. Every chowder problem is a timing problem wearing a disguise. |
| ❌ | 47 | Bug Egg Scramble | skillet |  | 4x bug eggs | 1x any butter | 1x any herb |  |  |  |  | Tiny eggs by the handful, stirred constantly over the lowest heat you can manage. They set fast, so the pan comes off well before you think it should. |
| ❌ | 48 | Nutmeg Blood Pudding | donabe |  | 2x any blood | 2x nutmeg | 1x any cream | 1x any grain |  |  |  | Nutmeg is the spice that makes blood taste deliberate rather than accidental. Set gently, served warm, and spooned rather than sliced. |
|  | 49 | Second-Day Flank | skillet |  | 3x any flank | 1x **Pepper Paste** | 1x parmesan | 1x any greens | 1x any crunch |  |  | Yesterday's meat pressed back into a hot pan until the edges catch again, tossed through paste and hard cheese, then buried under something peppery and something that shatters. It has no business being this good and everybody who makes it says so out loud. |

### Tier 3 — 8, two pinned slots

| ❌ | # | Name | Tool | Types | 1 | 2 | 3 | 4 | 5 | 6 | 7 | Description |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  | 50 | Dargin Tail Braise | donabe |  | 2x dargin tail | 2x **Caramelised Onions** | 1x **Rib Broth** | 1x ao negi | 1x any herb |  |  | Dragon-kin tail browned hard and drowned in stock for half a day, with allium at both ends of the process — caramelised into the pot until it dissolves and goes black, then raw and green over the top at the last second. |
|  | 51 | Giga Flank Chateaubriand | cocotte |  | 2x giga flank | 2x **Browned Butter** | 1x any herb | 1x any spice |  |  |  | A cut this size demands a lidded pot and a certain amount of nerve. Basted continuously in butter that was already cooked to hazelnut before it ever touched the meat. |
|  | 52 | Peerless Consomme | pot |  | 2x peerless eyeball | 3x **Rib Broth** | 1x pure water | 1x any egg | 1x any herb |  |  | Stock lifted clear twice through a raft of egg white, then let down with the clearest water the party is carrying. It arrives looking like a glass of nothing and tastes like the sea's opinion of you. |
| ❌ | 53 | Blue Blood Terrine | icebox |  | 2x blue blood | 2x oversized gelatin | 2x **Gel Stock** | 1x any herb |  |  |  | Set cold in a mould with stock until it slices as cleanly as stone fruit. The colour alone has ended dinner parties that were going perfectly well. |
|  | 54 | Iridescent Confit | cocotte |  | 2x iridescent wing | 3x **meaty oil** | 1x any herb | 1x any spice |  |  |  | The feathers still refract after cooking, which the kitchen has collectively decided is a feature. Submerged entirely in rendered fat and held at a whisper for six hours. |
| ❌ | 55 | Yuzu Heart | caidao |  | 2x hydro heart | 2x yuzu | 1x **fruity oil** | 1x any spice |  |  |  | Raw heart and the sharpest citrus on the shelf, dressed in an oil that was never once heated. Bright, iron, and gone in about four bites. |
|  | 56 | Salt-Baked Sparkling Fish | cocotte |  | 1x sparkling fish | 3x salt | 2x **Green Puree** | 1x any egg | 1x any herb |  |  | Encased in a shell of salt and egg white and baked until the crust rings when tapped, then opened over a pool of green. Cracking it at the table is the entire reason to make it. |
|  | 57 | Ghosty Souffle | cocotte |  | 4x ghosty eggs | 2x **Cheese Sauce** | 1x kream | 1x any spice |  |  |  | Built on a sauce base, because loose cheese has never once risen. It goes higher than it should and stays there longer than it should, and nobody has been comfortable with why. |

### Tier 4 — 4 signatures

| ❌ | # | Name | Tool | Types | 1 | 2 | 3 | 4 | 5 | 6 | 7 | Description |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  | 58 | Deathless Cut | cocotte |  | 1x titan heart | 2x **Rib Broth** | 2x **meaty oil** | 1x **Roast of Indeterminate Origin** | 1x **Caramelised Onions** | 1x ao negi |  | A heart too large to cook through by any other means, buried for a day and a night in a pot lined with everything the kitchen already knew how to make, and finished with something raw and green so the whole thing does not simply flatten you. Eating it once permanently changes what your body believes it is capable of. |
|  | 59 | Full Circle | hibachi |  | 3x ouroboros ribs | 1x black cacao | 2x **Melted Chocolate** | 2x **Pepper Paste** | 1x **meaty oil** |  |  | The rack curls back onto itself and is grilled in a closed circle, painted the whole way round with a glaze of bitter chocolate and chilli. The last bite tastes exactly like the first, which is either the spice or the point. |
|  | 60 | Stained Glass | icebox |  | 1x colossus gelatin | 2x faerie bouquet | 2x **Gel Stock** | 1x **Sugar Glass** | 1x **Candied Petals** |  |  | A single flawless gel set around flowers held in two states at once — fresh blossoms and candied petals, suspended apart by nothing but stock and nerve. It holds its own weight, it holds the light, and it holds up under a spoon. |
|  | 61 | The Bare Blade | caidao |  | 3x pristine fish | 1x yuzu | 1x **Citrus Juice** | 1x **fruity oil** | 1x **Strained Yogurt** | 1x **Green Puree** | 1x **Sea Salt** | One fish broken down into every cut it has, each piece dressed differently and finished with flakes that dissolve on contact, so that a single cold plate becomes a survey of everything the kitchen can do. There is nowhere at all to hide: each sauce sits alone beside a piece of raw fish and answers for itself. |

### Components this lane exports

Tier 1 outputs that other recipes consume, and which stay edible on their own:

| Component | Consumed by |
|---|---|
| **Crisped Flank** (31) | The Gift (carb 59) — the bacon-bits slot, and it will be wanted everywhere |
| **Mystery Meat Paste** (8) | proposed Meat Rolls; likely more once carb has a bread |
| **Rib Broth** (15) | Dargin Tail Braise (50), Undaunted (58) |
| **Gel Stock** (25) | Blue Blood Terrine (53), Stained Glass (60) |

### Known gaps in this draft

- **The obliterator got 2 of 60.** Puree is a weak method for protein and is expected to carry
  vegetable, fruit and sweet instead. Not a hole to fill.
- **Tail and flank got two tier 1 recipes each** against four for egg and gel, because they are
  3-item families with narrow method range.
- **Every tier 1 leans on the shared pantry** — oil, spice, liquid, herb — so the whole lane is gated
  on those being reliably buyable.
- **Composition is thin at three sites** because the maker lanes have no tier 1 yet. Expect this
  section to grow substantially on the revision pass.
- Proposed but not yet placed in a tier: **Meat Rolls** — vaporera — 2x Mystery Meat Paste, 1x any
  bread, 1x any greens, 1x any spice. *Paste spread thin, rolled in flatbread, and steamed until it
  slices clean. The paste was never the destination and here is the proof.*

---

## CARB

**A maker lane behaves differently, in three ways worth knowing before reading it.**

- **Eight of these recipes output an ingredient that already exists.** Macaroni, roll, linguini, loaf,
  croissant, soba, baguette and tortellini are rows in `Items.json` today, marked `(cook)` in the
  roster. Those recipes need no new item, no new icon and no new `<food:>` tag — they are the lane
  paying its own way, and they are why carb is cheaper to ship than protein.
- **The maker recipes tier themselves by output.** Macaroni takes any grain and is tier 1; linguini
  pins wheat and is tier 2; baguette pins wheat and salt and is tier 3. The ladder of the noodle and
  bread families *is* the tier ladder, with no extra design applied.
- **The signature fantasy is technique, not the hunt.** Carb's top ingredients are farmed rather than
  dropped, so nothing here is gated on killing a named creature. A carb signature is earned by being
  good at this, which is a different feeling and probably the right one for bread.

**No flour or dough item exists**, so breads and noodles are made from grain directly. That is a
deliberate hop saved rather than an oversight — see the two-hop cap.

### Tier 1 — 32, every slot a category

| ❌ | # | Name | Tool | Types | 1 | 2 | 3 | 4 | 5 | 6 | 7 | Description |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ❌ | 1 | Boiled Grain | pot |  | 2x any grain | 2x any liquid |  |  |  |  |  | The floor of every meal on the road and the thing you eat when there is nothing else. Salt it or do not; it will not notice either way. |
|  | 2 | Morning Porridge | pot |  | 2x any grain | 1x any milk | 1x any sugar | 1x any spice |  |  |  | Cooked well past the point where the grain gives up its structure and turns into comfort. Somebody in every party insists on making it wrong. |
|  | 3 | Toasted Grain | skillet | crunch | 3x any grain | 1x any spice |  |  |  |  |  | Dry-toasted in a hot pan until it smells like a bakery and starts to pop. Keeps for weeks and makes everything downstream of it taste deliberate. |
|  | 4 | Egg Fried Rice | wok |  | 2x any grain | 1x any egg | 1x any oil | 1x any vegetable | 1x ao negi |  |  | Yesterday's grain, today's pan, whatever else survived the week, and scallion thrown in at the very end so the whole thing does not read as brown. The one dish that is better made with stale ingredients than fresh ones. |
| ❌ | 5 | Grain Patties | skillet |  | 2x any grain | 1x any egg | 1x any herb | 1x any oil |  |  |  | Cooked grain bound with egg and pressed flat until the edges crisp. It exists because somebody had leftovers and a spatula and refused to waste either. |
|  | 6 | Macaroni | pot | noodle | 2x any grain | 1x any egg | 1x any liquid |  |  |  |  | Dough rolled, cut into stubby tubes, and boiled for the length of one argument. Everything you have ever eaten off a noodle was waiting on somebody doing this first. |
|  | 7 | Roll | cocotte | bread | 2x any grain | 1x any liquid | 1x any oil |  |  |  |  | Mixed, left alone to do its own work, and baked under a lid until the tops go gold. The single most useful thing anyone ever learned to do with wheat. |
| ❌ | 8 | Boiled Tubers | pot |  | 3x any tuber | 1x any liquid | 1x any spice |  |  |  |  | Into the water whole, out when a knife goes through without resistance. There is no technique here and that is exactly why it always works. |
|  | 9 | Smashed Potatoes | pot |  | 3x any tuber | 1x any butter | 1x any milk |  |  |  |  | Boiled soft and broken up by hand in the pot they cooked in, then enriched well past the point of good sense. Never take a blade to them — it turns the starch to glue and there is no way back. |
|  | 10 | Roasted Tubers | cocotte |  | 3x any tuber | 1x any oil | 1x any herb | 1x any spice |  |  |  | Cut into wedges, tossed in oil, and roasted until the outsides go rough and golden. The inside is the reward and the outside is the reason. |
|  | 11 | Potato Crisps | wok |  | 2x any tuber | 2x any oil | 1x any spice |  |  |  |  | Sliced translucent and dropped into oil hot enough to seize them instantly. Nobody has ever made exactly as many of these as they intended to. |
|  | 12 | Cold Potato Salad | icebox |  | 3x any tuber | 1x any yogurt | 1x any crunch | 1x any onion |  |  |  | Dressed while still warm so it drinks everything, then chilled until the flavours settle down. Improves overnight, which makes it the only dish here that rewards forgetting about it. |
|  | 13 | Toasted Nuts | skillet | crunch | 3x any seed | 1x any oil | 1x any spice |  |  |  |  | Shaken over medium heat until they colour and the whole room notices. Thirty seconds separates perfect from ruined and the pan gives no warning. |
|  | 14 | Nut Butter | obliterator | butter paste | 4x any seed | 1x any oil |  |  |  |  |  | Blended long past the point where it looks like it has failed, until it suddenly turns. Patience is the entire recipe and the machine does the rest. |
|  | 15 | Candied Nuts | wok | crunch | 3x any seed | 1x any sugar | 1x any butter |  |  |  |  | Tossed in melting sugar until each one wears a shell that cracks. Road food, party food, and the reason several characters have chipped teeth. |
| ❌ | 16 | Nut Crumble | caidao |  | 2x any seed | 1x any bread | 1x any sugar |  |  |  |  | Chopped rough and cut through stale bread until it is all the same size. It goes on top of things, and things are better for it. |
|  | 17 | Noodles in Broth | pot |  | 2x any noodle | 2x any liquid | 1x any greens | 1x any crunch |  |  |  | Noodles, hot liquid, something green, and no further ambition. Eaten more often than any other dish in this document and never once photographed. |
| ❌ | 18 | Fried Noodles | wok |  | 2x any noodle | 1x any oil | 1x any vegetable | 1x any spice |  |  |  | Hot pan, minimal stirring, and enough patience to let the bottom catch. The burnt bits are the best bits and anyone who disagrees is wrong. |
| ❌ | 19 | Noodle Bake | cocotte |  | 2x any noodle | 2x any cheese | 1x any crunch | 1x any milk |  |  |  | Layered into the pot and baked until the top is brown and the middle is molten. Serves four, or one person having a difficult week. |
|  | 20 | Cold Noodles | icebox |  | 2x any noodle | 1x any citrus | 1x any oil | 1x any herb |  |  |  | Rinsed cold to stop them dead, then dressed sharp and eaten straight from the box. The only correct food for a hot afternoon on a long road. |
|  | 21 | Griddle Cakes | skillet |  | 2x any grain | 1x any milk | 1x any egg | 1x any sugar |  |  |  | Batter dropped onto a hot dry surface and turned exactly once, at the moment the bubbles on top stop closing over. Turning them twice is the mark of somebody nobody has told. |
|  | 22 | Toast | hibachi |  | 2x any bread | 1x any butter |  |  |  |  |  | Bread held over a live flame until it decides which side it prefers. The simplest entry in this document and the one you will make most often. |
|  | 23 | Bread Pudding | cocotte |  | 2x any bread | 2x any egg | 1x any milk | 1x any sugar |  |  |  | Stale bread drowned in custard and baked until the top sets and the middle does not. Invented by somebody who refused to throw bread away and vindicated ever since. |
|  | 24 | Breadcrumbs | obliterator | crunch | 3x any bread | 1x any herb |  |  |  |  |  | Dried hard and then blitzed to gravel. Not food, exactly, but the difference between a coating and a disappointment. |
| ❌ | 25 | Stuffed Bread | cocotte |  | 2x any bread | 1x any protein | 1x any cheese | 1x any herb |  |  |  | Hollowed out, packed full, and baked until the crust seals over the top. Portable, structural, and dangerously hot in the middle for far longer than seems fair. |
|  | 26 | Panzanella | caidao |  | 2x any bread | 2x any tomato | 1x any oil | 1x any herb |  |  |  | Torn bread left to sit in oil and tomato until it softens without surrendering. A salad that is mostly bread, which is the only kind worth eating. |
|  | 27 | Dumplings | vaporera |  | 2x any grain | 1x any protein | 1x any vegetable | 1x any spice |  |  |  | Wrapped, pleated badly, and steamed in a stack until translucent. The first few are ugly and the last few are art, and they all taste the same. |
| ❌ | 28 | Rice in a Leaf | vaporera |  | 2x any grain | 1x any leaf | 1x any protein | 1x any spice |  |  |  | Packed into a wrapped leaf and steamed until the whole parcel smells like the plant it came in. Travels well, unwraps dramatically, and needs no plate. |
|  | 29 | Cheesy Noods | pot |  | 2x any noodle | 2x any vegetable | 1x any oil | 1x any cheese |  |  |  | Boiled, drained deliberately badly so a little of the water goes into the pan with them, then tossed until the sauce stops sliding off. The starch in that water is the whole trick, which is why nobody who knows ever rinses them. |
|  | 30 | Savoury Congee | pot |  | 3x any grain | 2x any liquid | 1x any protein | 1x ao negi |  |  |  | Grain cooked in far too much water for far too long, until it bursts and the whole pot turns to silk. It is what gets made for somebody who is ill, and what they ask for again once they are not. |
| ❌ | 31 | Fritter Batter Fry | wok |  | 2x any grain | 1x any egg | 1x any liquid | 1x any vegetable |  |  |  | Anything at all, dipped in batter and dropped in hot oil. The batter does not care what is inside it and neither, after a few of these, will you. |
| ❌ | 32 | Chilled Grain Pudding | icebox |  | 2x any grain | 1x any milk | 1x any sugar | 1x any gel |  |  |  | Set cold until it holds a spoon standing up, sweet and faintly grainy. Breakfast pretending to be dessert, or the reverse, depending on who is asked. |

### Tier 2 — 16, one pinned slot

| ❌ | # | Name | Tool | Types | 1 | 2 | 3 | 4 | 5 | 6 | 7 | Description |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  | 33 | Linguini | pot | noodle | 2x wheat | 1x any egg | 1x any liquid |  |  |  |  | Rolled thinner and cut wider than macaroni, which changes everything about how sauce behaves on it. Wheat specifically, because nothing else holds a long noodle together. |
|  | 34 | Loaf | cocotte | bread | 3x wheat | 1x any liquid | 1x any oil |  |  |  |  | A full loaf rather than a roll, which means a longer rise and a real crust. It keeps for days and is the backbone of half the bread recipes above. |
|  | 35 | Hella Loaded Baked Potato | cocotte |  | 2x big ass potato | 1x any butter | 1x any cheese | 1x any herb |  |  |  | An hour in the pot and then split open while it is still steaming. It is a meal by itself, which is the entire reason it grew that way. |
|  | 36 | Hazelnut Butter | obliterator |  | 4x hazelnuts | 1x any oil | 1x any sugar |  |  |  |  | Toasted first, skinned badly, then blended until it goes glossy and dark. Worth the extra step over any other nut and every baker in the world knows it. |
| ❌ | 37 | Millet Porridge | pot |  | 2x millet | 1x any milk | 1x any sweet | 1x any spice |  |  |  | Smaller grain, faster cook, and a texture closer to cream than to cereal. The porridge you make when you actually want porridge rather than merely needing it. |
| ❌ | 38 | Walnut Crumble Top | caidao |  | 2x walnuts | 1x any bread | 1x any sugar | 1x any butter |  |  |  | Chopped, cut through crumbs and butter, and left in coarse lumps. Goes over fruit, over custard, over anything that needs a roof. |
| ❌ | 39 | Gold Potato Gratin | cocotte |  | 3x gold potato | 1x any cream | 1x any cheese | 1x any crunch |  |  |  | Sliced thin, layered flat, and baked until the cream is gone and the top is bronze. Gold potatoes hold their shape through it, which is the whole reason to use them. |
| ❌ | 40 | Oat Flatbread | hibachi |  | 3x oat | 1x any liquid | 1x any oil |  |  |  |  | No rise, no oven, just dough slapped straight onto a hot grate. Bread for people who did not plan ahead, which is most people most of the time. |
|  | 41 | Cooked Rice | pot |  | 3x rice | 1x any liquid |  |  |  |  |  | Rinsed until the water runs clear, measured exactly, and then left completely alone. The hardest easy thing in the kitchen and nobody respects it until they get it wrong. |
| ❌ | 42 | Peanut Noodles | wok |  | 2x any noodle | 2x peanuts | 1x any oil | 1x any spice |  |  |  | Ground peanut loosened into a sauce that clings to everything it touches. Rich enough that a small bowl is a real meal and a large bowl is a commitment. |
|  | 43 | Croissant | cocotte | bread | 2x any grain | 3x creamed cream | 1x any liquid |  |  |  |  | Dough and butter folded through each other until there are more layers than anyone can count. It has to be whole butter and never the clarified sort, because the water in it is what turns to steam and drives the layers apart. |
|  | 44 | Spekkled Mac and Cheese | cocotte |  | 3x macaroni | 2x any cheese | 1x **Breadcrumbs** | 1x **Crisped Flank** | 1x **Pepper Paste** | 1x any milk |  | Baked rather than stirred, because a crust is not optional, and built with three separate kinds of crunch — crumbs worked across the top, cracklings scattered over those, and a thin seam of pepper paste stirred through so the whole thing argues back. This is the dish that ends the argument about which version is correct. |
|  | 45 | Soba | pot | noodle | 3x millet | 1x any liquid |  |  |  |  |  | Dark, nutty, and cooked in barely three minutes before being shocked cold. Millet makes a noodle that tastes of something instead of merely carrying sauce. |
| ❌ | 46 | Stale Nut Brittle | pot |  | 4x stale nuts | 2x any sugar | 1x any butter |  |  |  |  | The nuts nobody wanted, drowned in caramel and cracked into shards. Proof that the worst ingredient in a family can make the best thing in it. |
|  | 47 | Whitecap Risotto | donabe |  | 2x any grain | 2x whitecap mushroom | 1x any butter | 1x any cheese | 1x any liquid |  |  | Started in butter and then stirred continuously while the liquid goes in a ladle at a time, for twenty unbroken minutes. Whitecaps count as carb here, which the recipe finds funny and the eater does not care about. |
|  | 48 | Soba on Ice | icebox |  | 2x soba | 1x ao negi | 1x any citrus | 1x any oil |  |  |  | Rinsed under cold water until the noodles squeak, dressed barely, and finished with green cut so fine it is almost a powder. Restraint is the technique and there is nothing else hiding in the bowl. |

### Tier 3 — 8, two pinned slots

| ❌ | # | Name | Tool | Types | 1 | 2 | 3 | 4 | 5 | 6 | 7 | Description |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  | 49 | Baguette | cocotte | bread | 3x wheat | 2x salt | 1x any liquid |  |  |  |  | Three ingredients, a long cold rise, and a crust that shatters loudly enough to turn heads. The salt is doing structural work here and cutting it produces something sad and pale. |
|  | 50 | Tortellini | pot | noodle | 2x wheat | 2x avian eggs | 1x any paste | 1x any cheese |  |  |  | Squares of egg dough folded around whatever paste is to hand and a little cheese, one at a time, several hundred times. Nobody has ever agreed on what belongs inside one, and the folding is the whole job regardless. |
| ❌ | 51 | Six-Hour Tuber | cocotte |  | 1x is this even still a potato | 2x devil slick | 1x **Herb Butter** | 1x any spice |  |  |  | One tuber the size of a helmet, buried in fat and forgotten about until evening, then opened and given a disc of herb butter that vanishes on contact. Nobody has explained what happened to it underground and the kitchen has stopped asking. |
| ❌ | 52 | Hazelnut Croissant | cocotte |  | 2x croissant | 2x **Hazelnut Butter** | 1x any crunch | 1x any sugar |  |  |  | Yesterday's croissants split, filled with nut butter, scattered with something toasted and baked a second time. Better on the second bake than the first, which should not be possible and is. |
| ❌ | 53 | Tortellini in Onion Broth | pot |  | 2x tortellini | 2x **Caramelised Onions** | 1x **Vegetable Stock** | 1x any herb |  |  |  | Thirty small parcels floated in a broth of nothing but onions cooked black and let down with stock. It is clear enough to read through and tastes like it should not be, which is the trick. |
|  | 54 | Walnut Loaf | cocotte |  | 3x millet | 2x walnuts | 1x **Toasted Grain** | 1x any butter | 1x any egg |  |  | Dense, dark, and heavy enough to work as a doorstop by the third day, with a soaker of toasted grain worked through it. Cut thin, toasted hard, it outlives every other bread in the bag. |
| ❌ | 55 | Cold Soba | icebox |  | 3x soba | 2x yuzu | 1x **Citrus Juice** | 1x ao negi |  |  |  | Noodles, citrus and green, and nothing else asked to carry any weight. Every flaw in the noodle is visible here, which is why it is made only when the noodle is good. |
|  | 56 | Big Gratin | cocotte |  | 3x gold potato | 2x parmesan | 1x **Breadcrumbs** | 1x any cream |  |  |  | The gratin taken seriously, with hard cheese grated into every single layer and a crumb crust over the top. It comes out of the pot in one piece and is cut like a cake. |

### Tier 4 — 4 signatures

| ❌ | # | Name | Tool | Types | 1 | 2 | 3 | 4 | 5 | 6 | 7 | Description |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  | 57 | Proof | cocotte |  | 3x wheat | 2x **Cheese Sauce** | 2x **Caramelised Onions** | 1x **Browned Butter** | 1x pure water | 1x salt |  | A whole loaf built around its own filling and baked sealed, so that nothing inside is visible until somebody cuts it. The proof is in that cut: either the layers are in there or you have made a very large roll. |
|  | 58 | Amber Bowl | pot |  | 3x **tortellini** | 2x **Vegetable Stock** | 2x **Caramelised Onions** | 1x **Browned Butter** | 1x **Parmesan Crisps** | 1x tropea onion |  | Thirty parcels in a stock cooked down with onions until it goes amber, finished at the table with butter cooked to hazelnut poured over and a sheet of lace-thin cheese laid across the top. The broth took a day and the crisp survives about ninety seconds against it. |
|  | 59 | The Gift | cocotte |  | 1x is this even still a potato | 2x **Cheese Sauce** | 2x **Caramelised Onions** | 1x **Crisped Flank** | 1x **Strained Yogurt** | 1x ao negi | 1x devil slick | A tuber the size of a helmet, rubbed in dark fat and roasted for most of a day until the skin goes to armour, then split at the table and loaded until it overflows. Everything goes on it — cheese, onions, cracklings, yogurt, and a fistful of ao negi cut fine over the top. |
|  | 60 | Couronne | cocotte |  | 3x **croissant** | 2x **Hazelnut Butter** | 2x kream | 1x **Candied Peel** | 1x powdered sugar |  |  | Laminated dough coiled into a ring, filled with nut butter and cream and studded with candied citrus before it goes back for a second bake. It takes two days and it is the only thing in this lane that is unambiguously showing off. |

### Components this lane exports

Carb is the lane the other lanes are waiting on. Eight of these are **existing roster ingredients**,
so the recipe costs no new item row:

| Component | Existing item | Consumed by |
|---|---|---|---|---|
| **Macaroni** (6) | yes | Macaroni and Cheese (44); any `any noodle` slot |
| **Roll** (7) | yes | any `any bread` slot |
| **Linguini** (33) | yes | any `any noodle` slot |
| **Loaf** (34) | yes | any `any bread` slot |
| **Croissant** (43) | yes | Hazelnut Croissant (52), Couronne (60) |
| **Soba** (45) | yes | Soba on Ice (48), Soba Cold and Correct (55) |
| **Baguette** (49) | yes | any `any bread` slot |
| **Tortellini** (50) | yes | Tortellini in Onion Broth (53), Amber Hours (58) |
| **Breadcrumbs** (24) | no | unplaced — its real home is a coating or gratin in another lane |
| **Toasted Grain** (3) | no | unplaced |
| **Nut Butter** (14) | no | unplaced — wants a sweet or fruit lane partner |
| **Noodle Nest** (21) | no | unplaced — designed to hold another dish up |

**No carb recipe consumes another lane's dish.** Where carb reaches outside itself it reaches for a
roster ingredient — cheese, butter, cream, onion, yuzu — never for something another lane cooked.
Cross-lane composition waits for the cross-examination pass.

### Known gaps in this draft

- **Four components are unplaced** — Nut Butter, Breadcrumbs, Toasted Grain and Noodle Nest. Each was
  written as infrastructure and none has a consumer yet, which is exactly the failure protein had.
  They are the first thing the cross-examination pass should resolve.
- **Carb has no hunted ingredient at all**, so its signature tier is gated on farming and technique
  rather than on killing anything. Whether that reads as weak next to Ouroboros ribs is a real
  question and probably wants a deliberate answer rather than a shrug.
- **The obliterator finally works** — 5 recipes here against 2 in protein, as predicted.
- **Mushrooms cross-tag into carb** (button, whitecap), which Whitecap Risotto (47) uses. Worth
  checking the vegetable pass does not accidentally claim the same dish.
- **Three cross-lane references were pulled on revision** and should be revisited deliberately at
  cross-examination rather than quietly restored: tortellini (50) was filled with a meat paste, and
  both tortellini dishes (53, 58) floated in a bone stock. A filled pasta genuinely wants a filling
  and a broth genuinely wants bones, so these are the strongest candidates in the lane for
  cross-lane composition — but they should be chosen against all six lanes, not against the only
  other lane that happened to exist.

---

## VEGETABLE

The largest lane by a distance: **12 sub-categories, 48 items**, against carb's five and protein's
ten. It is a finder lane — nothing in it is marked `(cook)` — but it behaves unlike protein in two
ways.

- **It is the sauce-and-stock lane.** Eight of its tier 1 recipes produce components: stocks, purees,
  pastes and a sauce. Most of those are infrastructure for *other* lanes rather than for vegetable, so
  a component sitting unconsumed here is expected rather than the stranding failure it was in carb.
- **The cross-tagging is heavy and mostly load-bearing.** Peppers are also spice, tomatoes also fruit,
  carrots also sweet, beans variously dairy, sweet and spice, sprouts variously fungus, sweet and
  citrus, mushrooms also carb, lettuce also liquid, romaine also a **vessel** and kale also **bread**.
  Several recipes below lean on the joke deliberately.

**A structural consequence worth stating once, because it holds for every lane:** consuming a
component is by definition a pinned slot, so **tier 1 can never consume a dish.** Tier 1 is raw
ingredients, always. Composition begins at tier 2.

### Tier 1 — 32, every slot a category

| ❌ | # | Name | Tool | Types | 1 | 2 | 3 | 4 | 5 | 6 | 7 | Description |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  | 1 | Wilted Greens | skillet |  | 3x any greens | 1x any oil | 1x any spice |  |  |  |  | Greens hit a hot pan and collapse to a quarter of their volume in under a minute. Everyone underestimates how many they need and everyone is wrong about it exactly once. |
| ❌ | 2 | Greens in Broth | pot |  | 3x any greens | 2x any liquid | 1x any onion |  |  |  |  | Simmered only long enough to go soft without going grey. The liquid left behind is the better half and pouring it away is a small crime. |
|  | 3 | Green Puree | obliterator | paste | 4x any greens | 1x any oil | 1x any liquid |  |  |  |  | Blitzed to a smooth, aggressive green that stains everything it touches. It goes under other food, over other food, and occasionally onto a wound. |
|  | 4 | Green Salad | caidao |  | 3x any salad | 1x any crunch | 1x any oil | 1x any citrus |  |  |  | Torn rather than cut, dressed at the last possible moment, eaten immediately. Everything about it is timing and none of it is technique. |
|  | 5 | Slaw | caidao |  | 3x any salad | 1x any carrot | 1x any crunch | 1x any yogurt |  |  |  | Shredded fine and left to sit until it gives up its water and softens. Better an hour later, which makes it the only salad worth making in advance. |
| ❌ | 6 | Charred Cabbage | hibachi |  | 2x any salad | 1x any oil | 1x any spice |  |  |  |  | Cut into thick wedges and left on the grate until the outer leaves go black. The burnt layers are not a mistake and should be eaten first. |
|  | 7 | Caramelised Onions | skillet | paste | 4x any onion | 1x any butter | 1x any spice |  |  |  |  | Forty minutes of low heat and near-constant attention to turn something sharp into something sweet. There is no faster version and every cook alive has gone looking for one. |
| ❌ | 8 | Onion Soup | donabe |  | 3x any onion | 1x any butter | 2x any liquid | 1x any bread | 1x any cheese |  |  | Onions cooked down in butter for hours before anything else happens, then drowned in stock and capped with bread and melted cheese. The bowl arrives far too hot and nobody has ever waited. |
|  | 9 | Onion Rings | wok |  | 3x any onion | 1x any grain | 1x any oil | 1x any egg |  |  |  | Sliced thick, battered, and dropped into oil until they float and go gold. The batter is a delivery mechanism and everybody involved knows it. |
|  | 10 | Roasted Carrots | cocotte |  | 4x any carrot | 1x any oil | 1x any herb | 1x any spice |  |  |  | Roasted long enough that the sugars come out and the edges go dark. Carrots are the only vegetable that improves the more you neglect them. |
|  | 11 | Carrot Puree | obliterator | paste | 4x any carrot | 1x any butter | 1x any liquid |  |  |  |  | Cooked soft and blended with enough butter to turn it glossy. Orange, silky, and considerably more sophisticated than a carrot has any right to be. |
| ❌ | 12 | Glazed Carrots | skillet |  | 3x any carrot | 1x any sugar | 1x any butter |  |  |  |  | Cooked in barely enough liquid to cover, until the liquid becomes a glaze. Judge it wrong and you have either raw carrots or syrup, with no middle ground. |
|  | 13 | Blistered Peppers | hibachi |  | 4x any pepper | 1x any oil | 1x any spice |  |  |  |  | Straight onto the grate until the skins blacken and lift away. One in every handful is unreasonably hot and there is no way at all to tell which. |
|  | 14 | Stuffed Peppers | cocotte |  | 3x any pepper | 1x any grain | 1x any protein | 1x any cheese |  |  |  | Hollowed, packed, and baked until the pepper slumps and the filling sets. Structurally a bowl that you are permitted to eat afterwards. |
|  | 15 | Pepper Paste | obliterator | paste spice | 4x any pepper | 1x any oil | 1x any spice |  |  |  |  | Blended into a thick red paste that keeps for months and improves nearly everything. A spoonful of it is the difference between a meal and a good meal. |
|  | 16 | Tomato Sauce | donabe | liquid paste | 4x any tomato | 1x any onion | 1x any oil | 1x any herb |  |  |  | Simmered slowly until the water leaves and what remains is dark and concentrated. Half the dishes in this document would like a spoonful of it. |
| ❌ | 17 | Blistered Tomatoes | wok |  | 3x any tomato | 1x any oil | 1x any spice |  |  |  |  | High heat until the skins split and the insides collapse into the pan. It takes four minutes and tastes like it took an hour. |
|  | 18 | Tomato Salad | caidao |  | 3x any tomato | 1x any crunch | 1x any herb | 1x any oil |  |  |  | Cut thick, salted early, and left alone to weep for ten minutes. The liquid in the bottom of the bowl is the best part of it and should be drunk directly. |
| ❌ | 19 | Blanched Pods | pot |  | 4x any pod | 2x any liquid | 1x any spice |  |  |  |  | Ninety seconds in furiously boiling water and then straight into cold. The colour is the entire point and overcooking loses it permanently. |
|  | 20 | Bean Stew | donabe |  | 3x any pod | 1x any onion | 1x any tomato | 1x any liquid | 1x any herb |  |  | Cooked long and low in enough liquid to keep them covered, until the beans give up and what is left thickens itself. Cheap, filling, and noticeably better on the second day. |
| ❌ | 21 | Fried Pods | wok |  | 3x any pod | 1x any oil | 1x any spice |  |  |  |  | Thrown into a very hot pan and left to blister and wrinkle. They squeak against your teeth, which is either delightful or intolerable and never anything between. |
|  | 22 | Raw Sprouts | caidao |  | 3x any sprout | 1x any citrus | 1x any oil |  |  |  |  | Rinsed, dressed, and eaten within the hour before they turn. Nothing is cooked and there is nothing to hide behind. |
| ❌ | 23 | Steamed Sprouts | vaporera |  | 4x any sprout | 1x any herb | 1x any spice |  |  |  |  | Barely three minutes over steam and then dressed while still hot. Any longer and they go from crisp to sad without giving any warning. |
|  | 24 | Vine Wraps | vaporera |  | 3x any vine | 1x any grain | 1x any protein | 1x any spice |  |  |  | Leaves off the trap-vines, softened over steam, and rolled tight around a filling. The vine still twitches occasionally and the kitchen has collectively agreed to ignore it. |
| ❌ | 25 | Braised Vines | donabe |  | 3x any vine | 1x any liquid | 1x any onion | 1x any oil |  |  |  | Cooked long enough that the tendrils stop being fibrous and start being tender. It is the only preparation that fully convinces them to stop moving. |
| ❌ | 26 | Petal Salad | caidao |  | 3x any petal | 1x any greens | 1x any crunch | 1x any oil |  |  |  | Faerie petals scattered over greens and dressed with something sharp. It tastes faintly of perfume, which people either adore or find deeply upsetting. |
|  | 27 | Candied Petals | icebox | crunch | 3x any petal | 2x any sugar | 1x any egg |  |  |  |  | Painted with egg white, dusted in sugar, and set cold until they go rigid. Half decoration and half confectionery, and entirely unnecessary, which is precisely the appeal. |
| ❌ | 28 | Fried Mushrooms | skillet |  | 4x any fungus | 1x any butter | 1x any herb |  |  |  |  | Dry pan first until the water leaves, then butter, then garlic, then silence. Somebody in every party regards this as the finest thing that can be done with a pan, and somebody else in every party disagrees violently. |
|  | 29 | Mushroom Broth | pot | liquid | 3x any fungus | 2x any liquid | 1x any herb |  |  |  |  | Simmered until the liquid goes brown and savoury and tastes vaguely of meat. It is the closest a vegetable ever comes to lying about what it is. |
| ❌ | 30 | Fried Sponge | wok |  | 3x any sponge | 2x any oil | 1x any spice |  |  |  |  | Cut into thick slabs and dropped into far more oil than seems reasonable, because it will drink every drop and then ask for more. What goes into the pan squeaking comes out of it silk. |
|  | 31 | Stuffed Sponge | cocotte |  | 2x any sponge | 1x **Breadcrumbs** | 1x any cheese | 1x any herb |  |  |  | Halved, hollowed, packed with crumbs and cheese and roasted until the shell slumps around whatever went inside it. Anything hollow enough to fill is a bowl the moment you decide it is. |
|  | 32 | Vegetable Stock | pot | liquid | 3x any vegetable | 2x any liquid | 1x any onion | 1x any herb |  |  |  | Everything slightly past its best, plus water, plus an hour of doing nothing. The most useful thing anyone can make out of what they were about to throw away. |

### Tier 2 — 16, one pinned slot

| ❌ | # | Name | Tool | Types | 1 | 2 | 3 | 4 | 5 | 6 | 7 | Description |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  | 33 | Wilted Emeralds | skillet |  | 3x verdant greens | 1x any butter | 1x any spice |  |  |  |  | The best greens on the roster given the simplest treatment available to anyone. Anything more elaborate is an insult and the kitchen will say so out loud. |
|  | 34 | Kale Crisps | cocotte |  | 4x kale | 1x any oil | 1x any spice |  |  |  |  | Roasted flat until they shatter, then seasoned while still too hot to handle. Kale is officially a bread ingredient, which nobody has ever satisfactorily explained. |
|  | 35 | Tropea Onion Soup | donabe |  | 3x tropea onion | 1x any butter | 2x any liquid | 1x any bread | 1x any cheese |  |  | The soup made with the onion that costs money, which turns out to matter enormously. Sweeter, darker, and worth the difference on every single occasion. |
|  | 36 | Glazed Happiness | skillet |  | 4x happiness carrot | 1x any sugar | 1x any butter |  |  |  |  | Named optimistically and, unusually for this roster, accurately. Eaten straight from the pan by people who claim they are only checking the seasoning. |
| ❌ | 37 | Heat Pepper Paste | obliterator |  | 4x heat pepper | 1x any oil | 1x any spice |  |  |  |  | The paste made properly hot, which converts it from a seasoning into a decision. One spoonful is generous and two is a message. |
| ❌ | 38 | Crimson Tomato Sauce | donabe |  | 4x crimson tomato | 1x any onion | 1x any oil | 1x any herb |  |  |  | The deepest tomato on the roster, reduced until it goes nearly black. It needs no sugar at all, which is the entire reason to use this tomato. |
| ❌ | 39 | Shiitake in Butter | skillet |  | 4x shiitake mushroom | 1x any butter | 1x any herb |  |  |  |  | Thick caps seared hard and finished in butter until they squeak against the pan. Jerald has strong feelings about this dish and will share them without being asked. |
| ❌ | 40 | Sugar Bean Braise | donabe |  | 3x sugar beans | 1x any onion | 1x any liquid | 1x any spice |  |  |  | Beans that arrive already sweet, cooked until they collapse into their own liquid. Somewhere between a side dish and a dessert and not comfortable in either role. |
|  | 41 | Tofu | pot | sponge protein | 4x round beans | 1x **Mineral Water** |  |  |  |  |  | Beans crushed to milk, heated, and set with mineral water until it holds a shape under its own weight. The minerals do all of the work and the kitchen mostly just waits for them. |
|  | 42 | Purple Goodness | wok |  | 3x eggplant | 2x devil slick | 1x any spice |  |  |  |  | Slabs laid into fat hot enough to hurt, where they squeak, resist, and then all at once stop resisting. It drinks every drop it is given and comes out silk, which is the only reason anybody forgives how much it drank. |
|  | 43 | Roasted Pumpkin | cocotte |  | 3x pumpkin | 1x any seed | 1x any oil | 1x any spice |  |  |  | Cut into wedges and roasted skin-on until the edges blacken and the flesh turns to sugar, with its own seeds toasted hard and thrown back over the top. Nothing is wasted, and the best part is the part most people throw away. |
|  | 44 | Blistered Tofu | wok |  | 3x tofu | 1x **Pepper Paste** | 1x ao negi | 1x any oil |  |  |  | Pressed dry and fried until the outside goes leathery and blistered, then hit with pepper paste while it is still spitting. Bland by nature and belligerent by preparation. |
| ❌ | 45 | Doomtrap Braise | donabe |  | 3x doomtrap vine | 1x any liquid | 1x any onion | 1x any oil |  |  |  | The most aggressive vine on the roster, cooked until it stops being aggressive. Preparation involves a lid and a certain amount of holding it down. |
| ❌ | 46 | Faerie Bouquet Salad | caidao |  | 3x faerie bouquet | 1x any greens | 1x any citrus | 1x any oil |  |  |  | A whole bouquet torn over greens, which is either elegant or vandalism depending on who grew it. It smells better than anything else in this document. |
| ❌ | 47 | Garlic Greens | skillet |  | 3x any greens | 4x garlic | 1x any oil |  |  |  |  | Greens cooked in more garlic than greens, which is the correct and only ratio. The pan will smell like this for two days and so, frankly, will you. |
| ❌ | 48 | Cumin Carrot Puree | obliterator |  | 4x any carrot | 2x cumin | 1x any butter |  |  |  |  | Cumin is what turns carrot puree from a nursery food into a grown-up one. Toast it whole first or do not bother making this at all. |
|  | 49 | Fungus Toss | wok |  | 4x maitake mushroom | 1x any oil | 1x any spice |  |  |  |  | Torn rather than sliced, so the ragged edges catch the oil and crisp. Maitake is the one mushroom that occasionally converts a skeptic. |
|  | 50 | Romaine Boats | caidao |  | 4x romaine | 1x **Crisped Flank** | 1x **Strained Yogurt** | 1x ao negi |  |  |  | Whole leaves used as the plate, loaded with cracklings and thick yogurt and eaten entirely by hand. Romaine counts as a vessel here, which is the roster making a joke that turns out to work. |
|  | 51 | Sour Sprout Salad | caidao |  | 4x sour sprouts | 1x any crunch | 1x any oil | 1x any herb |  |  |  | Sprouts that arrive already sour, leaving the dressing with almost nothing to do. Sharp enough to wake somebody up in the middle of a meal. |

### Tier 3 — 8, two pinned slots

| ❌ | # | Name | Tool | Types | 1 | 2 | 3 | 4 | 5 | 6 | 7 | Description |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ❌ | 52 | Tropea Greens | skillet |  | 3x verdant greens | 2x tropea onion | 1x any butter | 1x any spice |  |  |  | The finest entry from two different families, cooked in one pan with nothing else competing for attention. It is a show of confidence and it is not remotely subtle. |
|  | 53 | Citrus Coral | vaporera |  | 2x ancient coral | 2x yuzu | 1x any oil | 1x any herb |  |  |  | Steamed gently and finished with citrus sharp enough to cut straight through the mineral. The only preparation that makes coral taste deliberate rather than endured. |
| ❌ | 54 | Doomtrap Confit | donabe |  | 3x doomtrap vine | 2x devil slick | 1x any onion | 1x any liquid |  |  |  | The worst-tempered vine on the roster braised in the richest fat available until both give up. Named by somebody who thought it was funny and who was entirely correct. |
| ❌ | 55 | Faerie Blossom Confit | cocotte |  | 3x faerie blossom | 2x white oil | 1x any sugar | 1x any spice |  |  |  | Blossoms held in barely-warm oil for hours until they turn translucent. The oil afterwards is worth more than the flowers were and must not be thrown out. |
|  | 56 | Crimson Heat | obliterator |  | 3x crimson tomato | 2x **Pepper Paste** | 1x any oil | 1x any spice |  |  |  | The darkest tomato on the roster blended into the hottest paste in the kitchen. Nobody has ever described the result as mild and nobody ever will. |
| ❌ | 57 | Happiness in Butter | cocotte |  | 4x happiness carrot | 2x refined butter | 1x any herb | 1x any sugar |  |  |  | Slow-roasted in butter until the carrots collapse and the butter itself goes orange. It is absurd, it is indulgent, and the name stops being funny to anyone who has eaten it. |
|  | 58 | Parmesan Maitake | cocotte |  | 3x maitake mushroom | 2x parmesan | 1x any oil | 1x any herb |  |  |  | Roasted under a lid until the cheese fuses itself to the ragged edges. This is the dish produced as evidence whenever the mushroom argument restarts. |
|  | 59 | Edible Kale | hibachi |  | 4x kale | 2x heat pepper | 1x any oil | 1x any citrus |  |  |  | Grilled hard over open flame with enough chilli to change its personality outright. People who state confidently that they dislike kale have usually not met this one. |
|  | 60 | What the Ground Gave | caidao |  | 3x verdant greens | 2x crimson tomato | 2x **Green Puree** | 1x **Caramelised Onions** | 1x **Toasted Nuts** | 1x fruity oil |  | Everything finest the ground produced, laid raw across a sweep of its own greens blitzed to a sauce, with onions cooked down to jam and nuts toasted hard scattered over the top. No heat ever touches the plate itself, which is exactly why there is nowhere on it to hide. |

### Tier 4 — 4 signatures

| ❌ | # | Name | Tool | Types | 1 | 2 | 3 | 4 | 5 | 6 | 7 | Description |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  | 61 | Turnabout Braise | donabe |  | 3x doomtrap vine | 2x **Vegetable Stock** | 2x **Caramelised Onions** | 1x devil slick | 1x ao negi |  |  | A vine that fought back, browned hard in dark fat and then braised a full day in stock and onions until it surrenders completely, with something raw and green over it at the end. Eating a thing that tried to eat you first is a specific pleasure, and this dish is built around nothing else. |
|  | 62 | Ephemeral Bloom | cocotte |  | 2x faerie bouquet | 2x **white oil** | 1x **Candied Petals** | 1x **pure water** | 1x powdered sugar |  |  | An entire bouquet cooked whole and served whole in a broth of very nearly nothing, with petals from the same flower candied and set around it like frost. It is the most delicate thing anyone in this party has made and it survives exactly one trip across a room. |
|  | 63 | Kaleidoscope | cocotte |  | 3x eggplant | 2x zucchini | 2x **Pepper Paste** | 2x **Tomato Sauce** | 1x crimson tomato | 1x **fresh oil** |  | Every vegetable sliced to the same impossible thinness and stood on edge in a tight spiral over a base of pepper and tomato, then baked under a lid until the rings slump into one another. Cutting it open shows every layer it was built from, which is the only proof anyone gets that it took all day. |
|  | 64 | The Uncredited Root | cocotte |  | 4x happiness carrot | 2x **Caramelised Onions** | 2x **Browned Butter** | 1x **Carrot Puree** | 1x nutmeg |  |  | Roasted carrots laid over a puree of the same carrot, with onions cooked down for an hour into something nearly black and butter taken all the way to hazelnut. It is named after the carrot, but the onion does half the work and the carrot has never once acknowledged it. |

### Components this lane exports

Vegetable produces more components than any lane so far, and most are aimed outward:

| Component | Consumed in-lane by | Note |
|---|---|---|---|---|
| **Pepper Paste** (15) | Crimson and Heat (56) | placed |
| **Vegetable Stock** (32) | Turnabout (61) | placed |
| **Green Puree** (3) | — | expected cross-lane: a sauce under protein or fish |
| **Caramelised Onions** (7) | — | expected cross-lane: bread, meat, eggs |
| **Carrot Puree** (11) | — | expected cross-lane: under roasted things |
| **Tomato Sauce** (16) | — | expected cross-lane: every noodle dish in carb |
| **Candied Petals** (27) | — | expected cross-lane: sweet, as decoration |
| **Mushroom Broth** (29) | — | expected cross-lane: noodles, grain, anything savoury |

**Unconsumed here is not the same failure it was in carb.** A stock, a sauce and three purees are
infrastructure for the whole game rather than for their own lane, so they are *supposed* to leave.
The cross-examination pass should confirm each one actually lands somewhere.

**No vegetable recipe consumes another lane's dish.** Where it reaches outside itself it reaches for
roster ingredients only — butter, cheese, parmesan, devil slick, yuzu, garlic, cumin, nutmeg.

### Known gaps in this draft

- **The obliterator finally earns its place** — 6 recipes here against 5 in carb and 2 in protein.
  Purees, pastes and sauces are what a blender is for, exactly as predicted.
- **The caidao leads the lane at 9 recipes**, which is more raw preparation than the other two lanes
  combined. Salads are a vegetable privilege.
- **Coral's apologetic recipes are retired.** Boiled Coral and Roasted Coral were two ways of
  admitting there is no honest way to make a rock delicious, and Mineral Water gave coral a real job
  instead. It now appears in Mineral Water (pantry), Ancient Coral and Yuzu (53) and Turnabout (61) —
  three uses, none of them apologising.
- **Vegetable is no longer a pure finder lane.** Tofu is `(cook)`, which makes this the third hybrid
  after sweet and carb. It is also the roster's first vegetarian protein: cross-tagged
  `vegetable` + `protein`, so it satisfies `any protein` slots. Together with Coconut Milk answering
  `any milk` and Vegetable Stock replacing bone broth, a player who never fights can now cook — which
  is a real route through a game whose protein and dairy are both combat-gated, and it should be
  either embraced or closed on purpose rather than by accident.
- **Sprouts, vines and petals got two tier 1 recipes each**, against three for the big families. They
  are narrow ingredients and padding them would show.
- **Vegetable has real drops** — vines, petals, coral and greens all come off enemies — so unlike
  carb, its signature tier does carry a hunting fantasy. Turnabout (61) is the clearest case and is
  the best argument in the draft that a plant can headline a signature dish.
- **Fermentation is deferred as a method**, but `fermented sprouts` exists as a farmed ingredient. The
  world has fermentation; the kitchen does not. That is fine and probably invisible, but it is worth
  knowing before somebody writes a pickle recipe.

---

## DAIRY

**The purest maker lane in the roster, and the only one that is a chain rather than a list.**

- **Sixteen of twenty items are `(cook)`.** Fifteen of the sixty recipes below output an ingredient
  that already exists in `Items.json` — nearly twice carb's eight. Every `any butter`, `any cheese`
  and `any cream` slot written in any other lane is asking dairy to have done its job first.
- **Milk is the only raw sub-category**, and three of its four entries are **drops**: moo juice, bug
  juice and dragon juice. Only malk is bought. So the entire dairy economy bottoms out on hunting,
  which matches `recipe-system.md`'s ruling that dairy comes off the Minitaur/Megataur and Quadruped
  subgroup rather than off a shop counter.
- **The roster encodes a refinement ladder in its cross-tags.** Cream *is also* milk; butter *is also*
  cream; yogurt *is also* fungus. That is not decoration — it means a cream recipe takes milk and a
  butter recipe takes cream, and the lane composes with itself more than any other.

**Cheese and yogurt are tagged `fungus`, which has a matcher consequence nobody has stated yet.** An
`any fungus` slot currently accepts four mushrooms **and eight dairy items**, so vegetable's Fried
Mushrooms (28) will happily accept four blocks of cheddar. That is either a delightful accident or a
slot that wants narrowing, and it should be decided rather than discovered.

### The two-hop cap fails in this lane

Followed literally, the butter family is five deep: **milk → cream → creamed cream → refined butter →
fat paste → devil slick.** Every step is culinarily true — clarifying butter really is a thing you do
to butter — and the roster asks for all four butters to exist. The recipes below are written the
honest way, which means they break the cap.

Three ways out, and this wants a decision rather than a default:

- **Relax the cap for dairy only**, on the grounds that the ladder is the lane's entire identity.
- **Give the deep butters an alternate route** — makeable from cream directly at worse yield, so the
  chain is optional rather than mandatory.
- **Collapse the butter family**, which contradicts the same argument that saved the gelatins.

### Tier 1 — 32, every slot a category

| ❌ | # | Name | Tool | Types | 1 | 2 | 3 | 4 | 5 | 6 | 7 | Description |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  | 1 | Cream | icebox | cream milk | 3x any milk | 1x any liquid |  |  |  |  |  | Left cold and undisturbed until the fat rises far enough to be skimmed off the top. It is the least active recipe in this entire document and it still counts as cooking. |
|  | 2 | Creamed Cream | obliterator | butter cream | 3x any cream | 1x any spice |  |  |  |  |  | Cream beaten past whipped, past stiff, and out the other side until it breaks into fat and liquid. The moment it turns is unmistakable and slightly alarming the first time. |
|  | 3 | Cheddar | pot | cheese fungus | 3x any milk | 1x any citrus | 1x any spice | 1x any herb |  |  |  | Curdled with acid, cut, stacked and pressed, then left alone for far longer than feels reasonable. The first cheese anybody learns and the one they never stop making. |
|  | 4 | Whipped Yogy | obliterator | yogurt fungus | 3x any yogurt | 1x any milk |  |  |  |  |  | Beaten with a little milk until it loosens and goes airy under the blade. Officially a fungus, which the roster insists upon and nobody wants to think about. |
|  | 5 | Fondue | donabe |  | 3x any cheese | 1x any citrus | 1x any liquid | 1x any bread | 1x any spice |  |  | Melted slowly with liquid and something sharp, because cheese without acid seizes into rubber rather than melting. Eaten communally, which is either intimate or a hygiene incident depending entirely on the party. |
|  | 6 | Grilled Cheese | skillet |  | 2x any cheese | 2x any bread | 1x any butter |  |  |  |  | Butter on the outside, cheese on the inside, and patience over medium heat. Rushing it produces a burnt sandwich with a cold middle, and everybody has made exactly one. |
| ❌ | 7 | Baked Cheese | cocotte |  | 3x any cheese | 1x any herb | 1x any oil |  |  |  |  | A whole round baked in its own rind until the middle gives up and goes molten. The rind becomes the bowl, which is the most efficient thing cheese has ever done. |
|  | 8 | Cheese Sauce | pot | liquid | 3x any cheese | 1x any milk | 1x any butter | 1x any grain |  |  |  | Melted into thickened milk until it pours smooth and coats the back of a spoon. It goes over vegetables, over noodles, and over several things that did not ask for it. |
| ❌ | 9 | Fried Cheese | wok |  | 3x any cheese | 1x any grain | 1x any egg | 1x any oil |  |  |  | Breaded and fried fast enough that the crust sets before the inside can escape. There is a narrow window and it closes without warning. |
| ❌ | 10 | Cheese Board | caidao |  | 3x any cheese | 1x any fruit | 1x any crunch | 1x any bread |  |  |  | Nothing is cooked and nothing is combined; things are merely placed near each other. The only recipe in this document that is entirely an act of arrangement. |
| ❌ | 11 | Warm Milk | pot |  | 3x any milk | 1x any sugar | 1x any spice |  |  |  |  | Heated gently to just below a simmer and never once allowed to boil. It is a remedy rather than a meal and works about as well as remedies generally do. |
|  | 12 | Milk Pudding | pot |  | 3x any milk | 1x any grain | 1x any sugar | 1x any spice |  |  |  | Grain cooked slowly in milk until it thickens itself and the spoon stands unaided. Somebody's grandmother invented every version of this independently and all of them are correct. |
|  | 13 | Custard | vaporera | gel | 3x any milk | 2x any egg | 1x any sugar |  |  |  |  | Steamed low until it sets to a wobble and then stopped immediately. The line between custard and sweet scrambled egg is about ninety seconds wide. |
| ❌ | 14 | Milkshake | obliterator |  | 3x any milk | 1x any sweet | 1x any gel |  |  |  |  | Blended cold and thick enough to comprehensively defeat a straw. A drink by classification and a meal by consequence. |
| ❌ | 15 | Wobbly Milk | icebox |  | 3x any milk | 1x any gel | 1x any sugar | 1x any spice |  |  |  | Set cold with just enough gel to hold a shape and not one grain more. The correct amount trembles when the plate is set down; the incorrect amount bounces. |
|  | 16 | Whipped Cream | obliterator | cream | 3x any cream | 1x any sugar |  |  |  |  |  | Beaten until it holds a peak and stopped precisely one stroke before it would not. Everything about this recipe is knowing when to quit. |
| ❌ | 17 | Cream Sauce | skillet |  | 3x any cream | 1x any onion | 1x any herb | 1x any spice |  |  |  | Reduced with aromatics until it thickens enough to coat the back of a spoon. It makes anything taste expensive, which is both its use and its problem. |
|  | 18 | Ice Cream | icebox |  | 3x any cream | 2x any sugar | 1x any egg |  |  |  |  | Churned while freezing so the ice never gets a chance to form properly. Stop stirring for long enough and you have made a sweet brick instead. |
| ❌ | 19 | Cream of Whatever | pot |  | 2x any cream | 2x any vegetable | 1x any liquid | 1x any onion |  |  |  | Any vegetable at all, cooked soft and finished with cream until it stops being itself. The name is a shrug and the soup is genuinely excellent. |
|  | 20 | Browned Butter | skillet | oil | 3x any butter | 1x any spice |  |  |  |  |  | Cooked past melted until the solids toast and the whole pan smells of hazelnuts. Thirty seconds beyond that and it smells like a mistake instead. |
| ❌ | 21 | Herb Butter | caidao |  | 3x any butter | 2x any herb | 1x any spice |  |  |  |  | Softened, beaten through with herbs, rolled tight and set cold until firm. A disc of it melting on something hot is an entire technique pretending to be a garnish. |
| ❌ | 22 | Butter Sauce | pot |  | 3x any butter | 1x any citrus | 1x any liquid | 1x any spice |  |  |  | Whisked into barely-warm liquid one piece at a time until it emulsifies. Let it get too hot and it splits, and there is no route back from there. |
| ❌ | 23 | Butter Bath | skillet |  | 2x any butter | 2x any vegetable | 1x any herb |  |  |  |  | Cooked in rather more butter than the vegetables themselves displace. Nobody has ever asked how much butter was in it and been happier for the answer. |
|  | 24 | Strained Yogurt | caidao | cream | 4x any yogurt | 1x any spice |  |  |  |  |  | Hung in cloth overnight until the liquid drains away and what remains will hold a shape. Half the volume and twice the everything. |
| ❌ | 25 | Yogurt Sauce | caidao |  | 3x any yogurt | 1x any herb | 1x any citrus | 1x any spice |  |  |  | Loosened with citrus and stirred through with whatever herb is closest. It exists to sit beside something too rich for its own good, and it never fails at that. |
| ❌ | 26 | Frozen Yogurt | icebox |  | 3x any yogurt | 2x any sugar | 1x any fruit |  |  |  |  | Churned cold like ice cream but sharper and lighter across the tongue. Defended fiercely by people who are lying about preferring it. |
|  | 27 | Yogurt Marinade | caidao |  | 3x any yogurt | 1x any protein | 1x any spice | 1x any herb |  |  |  | Meat left sitting in seasoned yogurt overnight while the acid does quiet work on it. Nothing else tenderises this gently or this thoroughly. |
| ❌ | 28 | Cheese Toast | hibachi |  | 2x any cheese | 2x any bread | 1x any spice |  |  |  |  | Bread and cheese held over open flame until the cheese blisters and drips into the fire. The lost cheese is a tax and it is unquestionably worth paying. |
| ❌ | 29 | Dairy Gratin | cocotte |  | 2x any dairy | 2x any tuber | 1x any cheese | 1x any crunch |  |  |  | Layered flat, drowned in dairy, and baked under a scattered crust until the top browns and the edges bubble over. It is the same idea as every other gratin and it is correct every single time. |
| ❌ | 30 | Creamed Greens | skillet |  | 2x any cream | 3x any greens | 1x any spice |  |  |  |  | Greens wilted right down and then drowned in cream until nobody can tell they were virtuous. A vegetable dish in name and in absolutely no other respect. |
| ❌ | 31 | Milk Bread | cocotte |  | 2x any milk | 2x any grain | 1x any butter | 1x any sugar |  |  |  | Enriched with milk and butter until the crumb goes soft enough to tear rather than cut. It stales within a day, which has never mattered, because it has never lasted one. |
| ❌ | 32 | Cold Dairy Soup | icebox |  | 2x any yogurt | 1x any milk | 1x any vegetable | 1x any herb |  |  |  | Blended cold and served colder, thin enough to drink straight from the bowl. Unsettling the first time and then requested constantly. |

### Tier 2 — 16, one pinned slot

| ❌ | # | Name | Tool | Types | 1 | 2 | 3 | 4 | 5 | 6 | 7 | Description |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  | 33 | Thicc Cream | pot | cream milk | 3x moo juice | 1x any liquid |  |  |  |  |  | Reduced over low heat until it is half the volume and twice the opinion. Moo juice specifically, because the thinner milks simply refuse to cooperate. |
|  | 34 | Refined Butter | pot | butter cream | 3x creamed cream | 1x any spice |  |  |  |  |  | Melted, skimmed, and the clear fat poured carefully off the solids beneath. It keeps almost forever and burns at a far higher heat, which is the entire point of the exercise. |
| ❌ | 35 | Gouda | pot |  | 3x moo juice | 1x any citrus | 1x any liquid | 1x any spice |  |  |  | Curdled and then washed, which means rinsing part of the acid back out before pressing, which means sweetness. A small change of method and an entirely different cheese. |
|  | 36 | Brie | cocotte | cheese fungus | 3x malk | 1x any fungus | 1x any spice |  |  |  |  | Surface-ripened until a bloom forms and the inside goes to liquid underneath it. Deliberately and carefully mouldy, which is a thing the roster evidently already knew. |
|  | 37 | Parmesan | cocotte | cheese fungus | 3x moo juice | 1x salt | 1x any liquid |  |  |  |  | Pressed hard, salted heavily, and then aged for longer than any other item in this lane. It is the only cheese here that is genuinely a long-term investment. |
|  | 38 | Kream | obliterator | cream milk | 3x thicc cream | 1x any sugar |  |  |  |  |  | Whipped with sugar until it stiffens into something that holds a shape indefinitely. The deliberate misspelling is the roster's problem and not this recipe's. |
|  | 39 | Dragon Juice Custard | vaporera |  | 3x dragon juice | 2x any egg | 1x any sugar |  |  |  |  | Steamed until it sets, and it sets considerably faster than it has any right to. The tongue stays faintly warm a full minute afterwards for reasons nobody has chased down. |
|  | 40 | Bug Juice Ice Cream | icebox |  | 3x bug juice | 2x any sugar | 1x any cream |  |  |  |  | Churned cold into something pale green that tastes far better than its name suggests. Every single person has to be told twice before they will try it. |
|  | 41 | Parmesan Crisps | skillet | crunch | 4x parmesan | 1x any herb |  |  |  |  |  | Grated into a dry pan in small piles and left alone until they fuse and go lacy. Two ingredients, and one of them is arguably unnecessary. |
|  | 42 | Baked Brie | cocotte |  | 2x brie | 1x **Fruit Jam** | 1x any crunch | 1x any bread |  |  |  | Baked in its own rind until the centre gives up entirely and floods the plate when cut, then finished with jam and something toasted while it is still moving. Timing it is guesswork and overshooting is barely even a problem. |
|  | 43 | Cheddar Soup | donabe |  | 4x cheddar | 1x **Vegetable Stock** | 1x any grain | 1x any crunch | 1x any onion |  |  | Melted into thickened stock until it sits somewhere between a soup and a sauce, then buried under something crisp so there is one thing in the bowl that is not soft. Deeply unfashionable and defended to the death by everyone who grew up on it. |
|  | 44 | Malk Shake | obliterator |  | 3x malk | 1x any sweet | 1x any gel |  |  |  |  | The cheap milk, blended thick, and honestly rather better for it. Nobody has ever ordered one ironically more than once. |
|  | 45 | Nutmeg Cream Sauce | skillet |  | 3x any cream | 2x nutmeg | 1x any onion | 1x any spice |  |  |  | Nutmeg is the thing that stops a cream sauce tasting like warm paint. Grate it in at the very end and never a moment before. |
|  | 46 | Kream Puffs | cocotte |  | 3x any bread | 2x kream | 1x any egg | 1x any sugar |  |  |  | Hollow shells baked until crisp and then filled only once completely cool. Fill them warm and you have produced a bag of sweet soup. |
|  | 47 | Moo Juice Panna | icebox |  | 3x moo juice | 1x **Berry Coulis** | 1x any gel | 1x any sugar |  |  |  | The richest ordinary milk set barely firm, turned out onto a cold plate and flooded with coulis so it sits in a ring of its own colour. It should wobble alarmingly and it should not survive being carried far. |
| ❌ | 48 | Gouda Fondue | donabe |  | 4x gouda | 1x any citrus | 1x any liquid | 1x any bread |  |  |  | Washed-curd cheese melts sweeter and smoother than any other, which changes the pot entirely. This is the version people remember and cheddar is the version they endure. |

### Tier 3 — 8, two pinned slots

| ❌ | # | Name | Tool | Types | 1 | 2 | 3 | 4 | 5 | 6 | 7 | Description |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  | 49 | Fat Paste | obliterator | butter cream paste | 3x refined butter | 2x thicc cream | 1x any spice |  |  |  |  | Clarified butter beaten back together with cream into something spreadable and obscene. It is not a good idea and it has never claimed to be one. |
|  | 50 | Devil Slick | pot | butter cream | 3x fat paste | 2x dragon juice | 1x any spice |  |  |  |  | Rendered down with dragon milk until it goes dark, thin and faintly hot to the touch. It fries harder than anything else in the kitchen and it browns things it was not aimed at. |
|  | 51 | Volatile Cuhream | icebox | cream milk | 3x kream | 2x dragon juice | 1x any spice |  |  |  |  | Held just above freezing while something in the dragon milk refuses to settle. It is stable for as long as it is cold and for no longer than that. |
|  | 52 | Velvet Yoggert | donabe | yogurt fungus | 3x basic yogert | 2x thicc cream | 1x any sugar |  |  |  |  | Cultured slowly at a temperature that somebody has to physically sit and watch. The reward is a texture that coats a spoon and declines to run off it. |
|  | 53 | Liquigurt | obliterator | yogurt liquid | 3x velvet yoggert | 2x malk | 1x any sugar |  |  |  |  | Thinned until it can be drunk rather than spooned, and then thinned slightly further. Somewhere between a yogurt and a beverage, and legally recognised as neither. |
|  | 54 | Collapsing Cream | obliterator |  | 3x volatile cuhream | 2x powdered sugar | 1x any spice |  |  |  |  | It whips in about four seconds and it collapses in about nine. Everything about serving this is a logistics problem rather than a cooking one. |
|  | 55 | Cheesy Bread | cocotte |  | 3x brie | 2x parmesan | 1x any bread | 1x any herb |  |  |  | The youngest cheese and the oldest baked in the same dish, where one floods and one fuses. They have nothing in common and the pot does not care. |
|  | 56 | Dragon Ice | icebox |  | 3x dragon juice | 2x kream | 1x any sugar | 1x any egg |  |  |  | Churned hard and frozen harder, and still faintly warm on the way down. The contradiction is the entire dessert and the kitchen has stopped apologising for it. |

### Tier 4 — 4 signatures

| ❌ | # | Name | Tool | Types | 1 | 2 | 3 | 4 | 5 | 6 | 7 | Description |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  | 57 | Patience Cheese | cocotte |  | 3x parmesan | 2x brie | 2x **Breadcrumbs** | 1x **Candied Nuts** | 1x **Fruit Jam** | 1x refined butter |  | The oldest cheese in the kitchen grated through crumbs and baked over the youngest until one fuses and the other floods, then finished with jam and candied nuts while the crust is still cracking. Nothing in it can be hurried, and every attempt to hurry it has produced something worse. |
|  | 58 | Slow Fire Cream | icebox |  | 3x dragon juice | 2x volatile cuhream | 1x **Caramel** | 1x **Candied Peel** | 1x rock candy | 1x nutmeg |  | Frozen hard, served frozen, and yet warm on the tongue a full minute after the last of it is gone, with caramel and candied peel set through it so the cold has something to break against. The kitchen stopped trying to explain this and started charging for it instead. |
|  | 59 | Potted Gold | skillet |  | 3x devil slick | 2x fat paste | 2x **Caramelised Onions** | 1x **Crisped Flank** | 1x tropea onion | 1x **Sea Salt** |  | Onions cooked down in the two richest fats the kitchen owns until everything collapses into one dark spoonful, packed into a pot with cracklings through it and sealed under a lid of its own set fat, then finished with flakes that crack against all that softness. It is barely a dish and almost entirely a decision, and it keeps for a month. |
|  | 60 | The Mother Culture | donabe |  | 3x liquigurt | 2x velvet yoggert | 1x **Berry Compote** | 1x **Toasted Nuts** | 1x dragon juice | 1x nutmeg |  | Three generations of the same living culture fed and folded into one another across a week, then buried under compote and nuts toasted hard enough to crack. It tastes powerfully of somewhere specific, and no two people have ever agreed on where. |

### Components this lane exports

Dairy produces **fifteen existing roster ingredients** — nearly twice carb's eight, and the reason
every other lane can write `any butter` without thinking about it:

| Tier | Existing items produced |
|---|---|
|  | 1 | cream, creamed cream, cheddar, whipped yogy |
|  | 2 | thicc cream, refined butter, gouda, brie, parmesan, kream |
|  | 3 | fat paste, devil slick, volatile cuhream, velvet yoggert, liquigurt |

Plus seven invented components, all of which are aimed outward:

| Component | Expected consumer |
|---|---|
| **Cheese Sauce** (8) | carb — every noodle and tuber dish |
| **Custard** (13) | sweet — tarts, trifles, anything baked |
| **Whipped Cream** (16) | sweet and fruit, universally |
| **Cream Sauce** (17) | protein and vegetable |
| **Browned Butter** (20) | sweet, carb — it is a baking ingredient |
| **Herb Butter** (21) | protein — a disc melting on something grilled |
| **Strained Yogurt** (24) | vegetable — dips, and the marinade path |

**In-lane composition is heavy and mostly through roster items.** Kream feeds Kream Puffs (46),
Collapsing Cream (54), Volatile Cuhream (51) and Slow Fire (58); refined butter feeds Fat Paste (49)
and The Long Wait (57); dragon juice appears in five recipes across three tiers.

**No dairy recipe consumes another lane's invented dish.** Where it reaches outside itself it takes
roster ingredients only — grain, bread, egg, gel, tuber, greens, onion, nutmeg, salt, rock candy,
powdered sugar, tropea onion.

### Known gaps in this draft

- **The five-deep butter chain is the headline problem**, described above. It is the first thing the
  cross-examination pass has to rule on, because two other lanes already pin `refined butter` and
  `devil slick` in their signatures and both would inherit whatever depth is decided here.
- **`any fungus` accepts eight dairy items**, so any recipe wanting mushrooms specifically must say
  so. Vegetable's Fried Mushrooms (28) is the live case.
- **Milk has no tier 1 maker**, correctly — it is the lane's only raw input. But three of its four
  entries are drops, so dairy is gated on combat far harder than its shelf-stable reputation
  suggests, and a player who has not fought a bovine cannot make cheese at all.
- **The icebox and obliterator dominate** at 9 and 8 recipes. Dairy is the churning-and-chilling lane
  exactly as protein was the grilling one.
- **The hibachi got one recipe** (Cheese Toast, 28) and the caidao four, all of them cold assembly.
  Live fire has almost nothing to say to dairy, which is honest rather than a gap.
- **Basic yogert is shop-only and feeds two makers** (52, 53). If the shop is ever unavailable the
  entire yogurt sub-tree is unreachable, since nothing cooks or drops it.

---

## FRUIT

**The coldest lane, and the one most blocked on world wiring.**

- **Nothing here is cooked and almost nothing here drops.** Four berries carry drop markers; the
  other sixteen items are shop or farm only. `recipe-system.md` puts fruit on Tree harvest nodes,
  which it also records as *"mechanically exists, yields nothing worth stopping for"* — so of the six
  lanes this is the one whose supply is furthest from existing.
- **Fruit resists heat, and the method spread shows it.** Icebox, pot, caidao and obliterator carry 43
  of the 60 recipes below. The **donabe gets zero**, because nobody stews fruit — you compote it, and
  a compote is a pot. Skillet and vaporera get one apiece. That is an honest shape rather than a hole
  to pad.
- **It exports more components than any lane except dairy** — ten juices, curds, coulis, jams and
  sauces, nearly all of them aimed at sweet and dairy rather than at fruit.

**Two cross-tag consequences to decide rather than discover.** **Two matcher consequences to decide rather than discover.** The four tomatoes are tagged fruit, so
`any fruit` accepts them and Fruit Salad (30) will cheerfully include one — which is culinarily
defensible and worth confirming. And `sour sprouts` is tagged citrus, so a vegetable satisfies every
citrus slot in this lane.

### Tier 1 — 32, every slot a category

| ❌ | # | Name | Tool | Types | 1 | 2 | 3 | 4 | 5 | 6 | 7 | Description |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  | 1 | Berry Bowl | caidao |  | 3x any berry | 1x any cream | 1x any crunch | 1x any sugar |  |  |  | Berries, cream, sugar, and no further intervention of any kind whatsoever. The entire skill lies in not doing anything else to them. |
|  | 2 | Berry Coulis | obliterator | liquid | 4x any berry | 1x any sugar |  |  |  |  |  | Blended and pushed through cloth until it runs clean and glossy. It goes over everything pale and makes all of it look deliberate. |
|  | 3 | Berry Compote | pot | sweet paste | 3x any berry | 2x any sugar | 1x any citrus |  |  |  |  | Cooked down with sugar until the fruit slumps without entirely surrendering. Somewhere short of jam and considerably more useful than jam. |
| ❌ | 4 | Berry Tart | cocotte |  | 3x any berry | 2x any bread | 1x any butter | 1x any sugar |  |  |  | Baked in a shell until the fruit collapses and the juices catch at the edges. The burnt sugar around the rim is the best part and is always gone first. |
|  | 5 | Blistered Berries | skillet |  | 3x any berry | 1x any butter | 1x any spice |  |  |  |  | Thrown into a dry pan hot enough to pop the skins before the juice has time to run out of them. Thirty seconds, no sugar, and they come out tasting more like themselves than they went in. |
| ❌ | 6 | Berry Juice | obliterator |  | 4x any berry | 1x any liquid |  |  |  |  |  | Crushed, strained, and drunk within the hour before it starts thinking about becoming something else. It stains everything it meets and it stains it permanently. |
| ❌ | 7 | Tropical Salad | caidao |  | 3x any tropical | 1x any citrus | 1x any spice |  |  |  |  | Cut into blunt chunks and hit with acid so that it does not simply taste like syrup. Fruit this sweet needs something to argue with. |
| ❌ | 8 | Grilled Tropical | hibachi |  | 3x any tropical | 1x any sugar | 1x any butter |  |  |  |  | Straight onto the grate until the sugars catch and char into stripes. Fruit over fire is the oldest dessert there is and it has needed no revision. |
|  | 9 | Tropical Smoothie | obliterator |  | 3x any tropical | 1x any milk | 1x any gel |  |  |  |  | Blended thick enough that it must be eaten with a spoon and drunk with a straw simultaneously. A structural failure that absolutely everybody enjoys. |
| ❌ | 10 | Tropical Fritters | wok |  | 3x any tropical | 1x any grain | 1x any egg | 1x any oil |  |  |  | Battered and fried until the outside crisps and the inside turns to hot jam. Eating one immediately is a mistake and every single person makes it. |
| ❌ | 11 | Steamed Tropical Pudding | vaporera |  | 3x any tropical | 2x any grain | 1x any sugar | 1x any butter |  |  |  | Steamed for hours in a covered bowl until it goes dark and improbably dense. Heavy, old-fashioned, and unreasonably good after a long walk. |
|  | 12 | Tropical Salsa | caidao |  | 3x any tropical | 1x any pepper | 1x any onion | 1x any citrus |  |  |  | Diced small and hard, tossed with chilli and onion, and left twenty minutes to argue with itself. Fruit that has decided to be savoury, which offends people right up until they taste it. |
| ❌ | 13 | Citrus Salad | caidao |  | 3x any citrus | 1x any oil | 1x any herb | 1x any spice |  |  |  | Peeled to the flesh, sliced into wheels, and dressed with something savoury. Fruit refusing to be dessert, which visibly unsettles people. |
|  | 14 | Citrus Juice | obliterator | liquid | 4x any citrus | 1x any liquid |  |  |  |  |  | Squeezed and strained and served before the bitterness in the pith catches up. There is a window and it is roughly ten minutes wide. |
|  | 15 | Candied Peel | pot | crunch sugar | 3x any citrus | 3x any sugar |  |  |  |  |  | Peel simmered in syrup until it turns translucent and stops being bitter. It takes an entire day and produces about a handful. |
|  | 16 | Citrus Curd | pot | gel | 3x any citrus | 2x any egg | 1x any butter | 1x any sugar |  |  |  | Cooked gently with egg and butter until it thickens into something between a custard and a sauce. Overheat it and you have made citrus scrambled eggs. |
|  | 17 | Citrus Sorbet | icebox |  | 3x any citrus | 2x any sugar | 1x any liquid |  |  |  |  | Frozen and churned with nothing rich in it at all, which is exactly why it tastes so loud. Served between other things to reset the mouth. |
|  | 18 | Roasted Citrus | cocotte |  | 3x any citrus | 1x any oil | 1x any herb | 1x any spice |  |  |  | Halved and roasted until the cut faces caramelise and go jammy. Squeezed over other things afterwards, which was always the actual purpose. |
| ❌ | 19 | Orchard Salad | caidao |  | 3x any orchard | 1x any seed | 1x any citrus | 1x any oil |  |  |  | Sliced thin, tossed with acid to stop it browning, and scattered with something crunchy. It is a salad in the sense of being cold and in no other sense at all. |
|  | 20 | Baked Orchard | cocotte |  | 4x any orchard | 1x any butter | 1x any sugar | 1x any spice |  |  |  | Cored, filled, and baked until the skins split and the insides turn to sauce. The dish that smells better than it tastes, which in this lane is a high bar. |
|  | 21 | Orchard Pie | cocotte |  | 4x any orchard | 2x any bread | 1x any butter | 1x any sugar |  |  |  | Fruit under a lid of pastry, baked until the vents run and the top goes hard and gold. There is a correct number of vents and nobody has ever known it. |
| ❌ | 22 | Poached Orchard | pot |  | 3x any orchard | 2x any liquid | 2x any sugar | 1x any spice |  |  |  | Simmered in sweet liquid until translucent and only barely holding together. Lift them out a minute too late and you have made sauce instead. |
|  | 23 | Orchard Relish | pot |  | 4x any orchard | 2x any onion | 1x any spice | 1x any sugar |  |  |  | Cooked down with onion until the fruit gives up its shape and the whole pot goes sharp and dark. It exists to sit beside something fatty and it has never been the wrong answer to one. |
| ❌ | 24 | Pan-Caramelised Orchard | skillet |  | 3x any orchard | 1x any butter | 1x any sugar |  |  |  |  | Cooked hard in butter and sugar until the slices go deep amber at their edges. Four minutes of attention for something that tastes like an entire afternoon. |
|  | 25 | Fresh Melon | caidao |  | 3x any rind | 1x any spice | 1x any herb |  |  |  |  | Cut off the rind, cut into blocks, salted lightly, and left cold. Salt on melon is not a mistake, and arguing about it is a rite of passage. |
|  | 26 | Melon Juice | obliterator | liquid | 4x any rind | 1x any citrus |  |  |  |  |  | Blended and strained into something so pale it looks like water and tastes like summer. It separates within the hour and must be drunk before it manages it. |
| ❌ | 27 | Chilled Melon Soup | icebox |  | 3x any rind | 1x any cream | 1x any herb | 1x any spice |  |  |  | Blended cold with dairy and served in a bowl, which confuses everybody at the table. It is a soup, it is sweet, and both of those are true at once. |
| ❌ | 28 | Grilled Melon | hibachi |  | 3x any rind | 1x any oil | 1x any spice |  |  |  |  | Thick wedges over hot coals until the outside dries out and stripes. It turns savoury and firm and stops resembling itself entirely. |
| ❌ | 29 | Melon Granita | icebox |  | 4x any rind | 2x any sugar | 1x any citrus |  |  |  |  | Frozen flat and raked with a fork every twenty minutes until it becomes shards. The raking is tedious and skipping it produces a solid block. |
|  | 30 | Fruit Salad | caidao |  | 4x any fruit | 1x any crunch | 1x any citrus | 1x any herb |  |  |  | Everything in the bag, cut to the same size, tossed in acid so that nothing browns. The most honest recipe in this lane and it requires nothing but a knife. |
|  | 31 | Fruit Jam | pot | sweet paste | 4x any fruit | 3x any sugar | 1x any citrus |  |  |  |  | Cooked with sugar until it sets on a cold plate and not one minute longer. The test involves a saucer, something freezing, and a considerable amount of nerve. |
|  | 32 | Fruit Fool | obliterator |  | 3x any fruit | 2x any cream | 1x any sugar | 1x any crunch |  |  |  | Fruit crushed rough and folded through whipped cream just enough to streak it, never enough to mix it. Stirring it properly is the only way to ruin it and everyone is tempted. |

### Tier 2 — 16, one pinned slot

| ❌ | # | Name | Tool | Types | 1 | 2 | 3 | 4 | 5 | 6 | 7 | Description |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  | 33 | Coconut Milk | obliterator | milk liquid | 4x coconut | 2x any liquid |  |  |  |  |  | Grated flesh steeped in hot water and then wrung out through cloth. It is the only milk in this entire document that never met an animal. |
|  | 34 | Banana Bread | cocotte |  | 4x banana | 2x any grain | 1x **Browned Butter** | 1x **Nut Butter** | 1x any sugar |  |  | The blacker the banana the better the loaf, which makes this the only recipe that rewards neglect this directly, and the butter goes in already cooked to hazelnut. Somebody in every party is quietly saving three bananas for exactly this. |
| ❌ | 35 | Yuzu Curd | pot |  | 3x yuzu | 2x any egg | 1x any butter | 1x any sugar |  |  |  | The sharpest citrus on the roster turned into something rich enough to survive it. It is the only curd that fights back on the way down. |
|  | 36 | Mango Sorbet | icebox |  | 4x mango | 1x **Coconut Milk** | 2x any sugar | 1x any citrus |  |  |  | Blended and frozen with barely anything added, because it needs barely anything, and loosened with coconut milk so it scoops instead of shattering. Deep orange, faintly stringy, worth the mess. |
| ❌ | 37 | Elderberry Coulis | obliterator |  | 4x elderberry | 1x any sugar | 1x any citrus |  |  |  |  | Darker and more serious than any other berry sauce, and faintly medicinal with it. Used sparingly by people who know and generously by people who do not. |
|  | 38 | Cherry Pie | cocotte |  | 4x cherry | 2x any bread | 1x **Berry Compote** | 1x any butter | 1x any sugar |  |  | Pitted one at a time, which is the entire reason this is not made more often, and bulked out with compote so the filling sets instead of flooding. It stains the pastry through, which is how you know it is right. |
|  | 39 | Grilled Watermelon | hibachi |  | 4x watermelon | 1x **Crisped Flank** | 1x any oil | 1x any spice |  |  |  | Thick wedges over coals until they collapse into something dense and almost meaty, then scattered with cracklings while still too hot to hold. Salt, fat and fruit is an old trick and it has never once stopped working. |
|  | 40 | Pomelo Salad | caidao |  | 3x pomelo | 1x **Crisped Flank** | 1x any crunch | 1x any herb |  |  |  | Segments broken apart by hand into loose pink threads and tossed with cracklings and something crisp, so that every mouthful has three separate textures in it. The pith is thick and getting rid of it is most of the work. |
| ❌ | 41 | Plum Compote | pot |  | 4x plum | 2x any sugar | 1x any spice |  |  |  |  | Cooked until the skins split and dye everything underneath them purple. It goes on breakfast, it goes on meat, and nobody has ever objected to either. |
|  | 42 | Green Papaya | caidao |  | 4x papaya | 1x any crunch | 1x any citrus | 1x any spice |  |  |  | Shredded before it ripens, while it is still firm and faintly bitter. An entirely different ingredient from the ripe version and better in every savoury context. |
|  | 43 | Currant Buns | cocotte |  | 3x currants | 2x any bread | 1x **Candied Peel** | 1x any butter | 1x any milk |  |  | Studded through enriched dough with candied peel worked in beside them, then baked until the fruit catches at the surface. The scorched currants on top are the best ones and the argument about them never ends. |
| ❌ | 44 | Lemon Sorbet | icebox |  | 4x lemon | 2x any sugar | 1x any liquid |  |  |  |  | So sharp that it barely reads as sweet at all, which is precisely the point. Served in a small glass because a large one would constitute a threat. |
|  | 45 | Honeydew Granita | icebox |  | 4x honeydew | 2x **Melon Juice** | 1x any sugar | 1x any citrus |  |  |  | Flesh and pressed juice frozen together and raked apart, so the same melon arrives as both shards and syrup. Restrained to the point of seeming like a mistake, right up until it is not. |
|  | 46 | Apple Sauce | obliterator |  | 4x apple | 1x any sugar | 1x any spice |  |  |  |  | Cooked to collapse and blended smooth, and sharper than any shop version because you choose the sugar. It sits beside rich meat and pretends that is a coincidence. |
|  | 47 | Nutmeg Pear Poach | pot |  | 4x pear | 2x nutmeg | 1x **syrup** | 2x any liquid |  |  |  | Poached whole in syrup with the stems left on, until they turn translucent and stand upright on the plate. Nutmeg and pear is one of those pairings nobody needed to discover twice. |
| ❌ | 48 | Orange Marmalade | pot |  | 4x orange | 3x any sugar | 1x any citrus |  |  |  |  | Peel and flesh cooked together long enough that the bitterness stops being a flaw and becomes the point. The only preserve here that people argue about by thickness. |

### Tier 3 — 8, two pinned slots

| ❌ | # | Name | Tool | Types | 1 | 2 | 3 | 4 | 5 | 6 | 7 | Description |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  | 49 | Snowed Melon | icebox |  | 3x honeydew | 2x **Citrus Curd** | 1x **Melon Juice** | 1x any sugar |  |  |  | Juice pressed from the melon, frozen hard and shaved into drifts back over the flesh it came from, with sharp curd hidden underneath. The two never meet until a spoon makes them, and the whole thing collapses about a minute after it arrives. |
|  | 50 | Steamed Coconut Pudding | vaporera |  | 3x **Coconut Milk** | 2x mango | 1x any grain | 1x any sugar |  |  |  | Coconut milk thickened with grain and steamed under a lid until it sets just firm enough to hold a spoonprint, with mango laid over while it is still warm. The pudding declines to compete with the fruit, which is the only reason the fruit agrees to show up. |
| ❌ | 51 | Roasted Plums in Coulis | cocotte |  | 4x plum | 2x **Elderberry Coulis** | 1x any butter | 1x any spice |  |  |  | Halved and roasted cut-side down in butter until the edges caramelise and the fruit slumps into itself, then flooded with a coulis dark enough to pass for ink. Roasting concentrates the plum and the coulis reminds it that it is fruit. |
|  | 52 | Cherry Trifle | icebox |  | 4x cherry | 2x **Custard** | 1x **Berry Compote** | 1x any cream | 1x any bread |  |  | Bread soaked through with compote and layered wet with custard and cream, then left overnight until the layers stop being layers. It is built cold and improves entirely by being ignored. |
|  | 53 | Citrus, Three Ways | caidao |  | 3x pomelo | 1x **Citrus Curd** | 1x **Candied Peel** | 1x any oil |  |  |  | Raw segments, a spoonful of curd and a scatter of candied peel, so that the same fruit arrives sharp, rich and crunchy inside a single mouthful. Nothing on the plate came from anywhere else. |
| ❌ | 54 | Blistered Green Papaya | wok |  | 4x papaya | 2x **devil slick** | 1x any spice | 1x any herb |  |  |  | Shredded green papaya thrown into fat hot enough to smoke and moved constantly until the edges blister and catch. This is the version you learn before you learn the one with the bell. |
|  | 55 | Blistered Grapes | cocotte |  | 4x grapes | 2x parmesan | 1x **Browned Butter** | 1x any herb |  |  |  | Roasted hard until the grapes burst and the cheese fuses to the pan beneath them, then finished with butter cooked all the way to hazelnut. An unlikely pairing that stops being unlikely after precisely one mouthful. |
|  | 56 | Pressed Watermelon | caidao |  | 4x watermelon | 3x salt | 1x **Citrus Juice** | 1x any herb |  |  |  | Salted heavily and weighted for an hour until it surrenders its water and the flesh goes dense and almost meaty, then dressed with juice at the last second. Somewhere in the second hour it stops tasting like melon and starts tasting like something else entirely. |

### Tier 4 — 4 signatures

| ❌ | # | Name | Tool | Types | 1 | 2 | 3 | 4 | 5 | 6 | 7 | Description |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  | 57 | Midsummer Frost | icebox |  | 3x honeydew | 2x yuzu | 2x **pure water** | 1x **Candied Peel** | 1x **Citrus Juice** | 1x powdered sugar |  | Frozen flat and raked every twenty minutes for hours into shards so fine they are gone before they reach the back of the mouth, then scattered with peel candied until it snaps. It tastes like the one afternoon a year when nothing hurts and nothing is owed to anybody. |
|  | 58 | Nightfall Preserve | pot |  | 3x elderberry | 2x **Berry Compote** | 2x plum | 1x **syrup** | 1x **Citrus Juice** | 1x yuzu |  | Compote cooked down a second time with fresh fruit and syrup across a full day, until it is nearly black and thick enough to stand a spoon in. A single spoonful outlasts the meal it came with and most of the conversation after it. |
|  | 59 | Ninety Seconds | wok |  | 4x papaya | 2x **devil slick** | 1x **Pepper Paste** | 1x **Toasted Nuts** | 1x heat pepper | 1x yuzu |  | Green papaya into screaming fat with chilli paste, finished with citrus and a fistful of nuts thrown in at the last possible moment. It is named for exactly how long you have, and the kitchen keeps a bell for it. |
|  | 60 | Castaway Custard | cocotte |  | 3x coconut | 2x **Coconut Milk** | 2x mango | 1x **Caramel** | 1x papaya | 1x rock candy |  | Milk pressed from the same coconut, set with fruit into a custard and baked back inside its own shell until the top blisters, then hidden under a lid of hard caramel. It is absurd, it is enormous, and nobody has ever finished one without help. |

### Components this lane exports

Ten, second only to dairy, and almost all of them aimed at sweet and dairy rather than at fruit:

| Component | Expected consumer |
|---|---|
| **Berry Coulis** (2) | sweet, dairy — over anything pale |
| **Berry Compote** (3) | sweet, carb — breakfast and baking |
| **Berry Juice** (6) | sweet — drinks, and the bartender's roster |
| **Citrus Juice** (14) | every lane; it is the acid supply |
| **Candied Peel** (15) | sweet — baking and decoration |
| **Citrus Curd** (16) | sweet, carb — tarts and fillings |
| **Orchard Sauce** (23) | protein — beside rich meat |
| **Melon Juice** (26) | sweet — drinks |
| **Fruit Jam** (31) | carb, dairy — bread and yogurt |
| **Coconut Milk** (33) | dairy, sweet — see the open question below |

**Coconut Milk is the interesting one.** If it carries `<ingredientType:milk>` it satisfies every milk
slot in dairy, which means cheese, cream and butter become makeable without ever fighting a bovine —
a genuine second route through the game's most combat-gated lane. If it does not, it is a fruit
component with a misleading name. Either is defensible and it should be chosen deliberately.

**No fruit recipe consumes another lane's invented dish.** Outside references are roster ingredients
only — cream, kream, parmesan, devil slick, egg, bread, grain, gel, nutmeg, salt, heat pepper, cane
sugar, rock candy, powdered sugar.

### Known gaps in this draft

- **The donabe gets zero recipes**, and the skillet and vaporera one each. Fruit is a cold lane and
  padding it to spread the tools evenly would produce four dishes nobody believes in.
- **Fruit's supply is the least built in the game.** Sixteen of twenty items are farm-only against a
  harvest system the design doc itself calls unrewarding, so this lane is the one most likely to be
  unmakeable in practice regardless of how good the recipes are.
- **`any fruit` accepts the four tomatoes**, so Fruit Salad (30) may contain one. Culinarily correct
  and probably fine, but it is a real matcher behaviour rather than a hypothetical.
- **`any citrus` accepts sour sprouts**, a vegetable, in all six citrus slots in this lane.
- **Rind got five tier 1 recipes against six elsewhere**, because there are only so many things to do
  to a melon and three of them are already cutting it up.
- **Ninety Seconds (59) and Papaya and Devil Slick (54) are the same dish at two tiers**, deliberately
  — the tier 3 is the version you learn and the signature is the version with the bell. Worth
  confirming that reads as a progression rather than as a duplicate.

---

## SWEET

**The only split lane in the roster.** Its four sub-categories divide cleanly down the middle:

| Sub-category | Source | Behaves like |
|---|---|---|---|---|
| **sugar** | cane sugar farmed; syrup, rock candy, powdered sugar all `(cook)` | maker |
| **gummy** | all four `(cook)` | maker |
| **jelly** | all four **drop** — the slimes | finder |
| **chocolate** | all four shop/drop — the cacaos | finder |

Seven cooked items, so seven maker recipes; and because the slimes and cacaos are combat-and-shop
supply, sweet is gated on hunting almost as hard as dairy is. `recipe-system.md` already ruled that
**slime is sweet** — the dessert roster — and this lane is where that ruling has to earn itself.

- **Three of the four gummies are tagged `spice`**, along with powdered sugar. So `any spice` — which
  appears in roughly forty recipes across the other five lanes — currently accepts **minty dots**.
  Protein's Meat, Seared (5) will happily season itself with mint candy. This is the sharpest
  cross-tag collision in the roster and it wants a decision, not a discovery.
- **`any sweet` accepts the four carrots**, plus sugar beans and sticky sprouts. Candied Veg (32)
  leans on that deliberately, since a candied carrot is a real thing and not a joke.

### Tier 1 — 32, every slot a category

| ❌ | # | Name | Tool | Types | 1 | 2 | 3 | 4 | 5 | 6 | 7 | Description |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  | 1 | Syrup | pot | liquid sugar | 3x any sugar | 2x any liquid |  |  |  |  |  | Sugar and water held at a boil until it thickens and threads off the back of a spoon. It is the base of nearly every sweet thing that follows and it takes four minutes. |
|  | 2 | Gummy Rings | icebox | gummy | 3x any jelly | 2x any sugar | 1x any citrus |  |  |  |  | Slime cooked down with sugar, poured into moulds, and set cold until it bounces. Nobody eating these wants to hear where the slime originally came from. |
|  | 3 | Caramel | skillet | sugar liquid | 3x any sugar | 1x any butter | 1x any cream | 1x **Sea Salt** |  |  |  | Sugar cooked dry in a wide pan until it goes amber, stopped with fat before it goes black, and scattered with flakes while it is still moving. The window between caramel and charcoal is about eight seconds wide, and the salt is what keeps the sweetness from being the only thing there. |
|  | 4 | Brittle | pot | crunch | 3x any sugar | 2x any seed | 1x any butter |  |  |  |  | Molten sugar poured flat over nuts and left to set into a single sheet. Breaking it up is the best part and there is no wrong way to go about it. |
|  | 5 | Sugar Glass | pot | crunch | 4x any sugar | 1x any citrus | 1x any liquid |  |  |  |  | Boiled well past syrup with a squeeze of acid to stop it crystallising, then poured thin onto a cold surface where it sets clear and lethal. It shatters into edible shards and every one of them is a hazard. |
|  | 6 | Sweet Dough Fry | wok |  | 2x any sugar | 2x any grain | 1x any egg | 1x any oil |  |  |  | Dough dropped into hot oil and rolled in sugar the moment it comes back out. Best eaten standing beside the pot with no plate involved at any stage. |
|  | 7 | Plain Cake | cocotte |  | 3x any sugar | 2x any grain | 2x any egg | 1x any butter |  |  |  | Sugar, flour, egg, butter, and no cleverness whatsoever. Every cake anybody makes is this one with something else added to it. |
| ❌ | 8 | Sugared Fruit | caidao |  | 3x any sugar | 2x any fruit | 1x any spice |  |  |  |  | Fruit tossed in sugar and left alone until it draws out its own syrup. It is barely cooking and it works every single time. |
|  | 9 | Slime Pudding | icebox |  | 3x any jelly | 1x any milk | 1x any sugar | 1x any spice |  |  |  | Set cold into something that holds a shape and wobbles under the spoon. This is the dish that convinced everybody slime was food, which took some considerable doing. |
| ❌ | 10 | Slime Syrup | pot |  | 3x any jelly | 2x any sugar | 1x any liquid |  |  |  |  | Cooked down until it runs clear and thick and stops being identifiable as anything. This is the polite version and it ends up on absolutely everything. |
|  | 11 | Boiled Slime Sweets | pot |  | 3x any jelly | 3x any sugar | 1x any herb | 1x any spice |  |  |  | Cooked hard, cooled fast, and cut into pieces that stick to teeth for hours afterwards. Herb and spice rather than fruit, because a boiled sweet has to taste of something that survives the heat. |
|  | 12 | Slime Foam | obliterator | gel | 4x any jelly | 1x any sugar | 1x any egg |  |  |  |  | Whipped until it triples in volume and then holds a peak indefinitely. Physically improbable and structurally load-bearing in half the desserts below it. |
| ❌ | 13 | Fried Slime | wok |  | 3x any jelly | 1x any grain | 1x any oil | 1x any sugar |  |  |  | Coated and fried so that the outside crisps while the inside turns to lava. It is delicious and it will burn your mouth without a word of apology. |
| ❌ | 14 | Slime Jelly Cups | icebox |  | 3x any jelly | 1x any fruit | 1x any sugar | 1x any vessel |  |  |  | Set in individual glasses with fruit suspended halfway down through them. The suspension is a trick of timing and getting it wrong sinks the lot. |
|  | 15 | Melted Chocolate | donabe | liquid | 4x any chocolate | 1x any cream | 1x any butter |  |  |  |  | Melted slowly over the gentlest heat available and stirred until it turns glossy. Rush it and it seizes into something grainy that no amount of stirring recovers. |
| ❌ | 16 | Chocolate Bark | icebox |  | 3x any chocolate | 2x any seed | 1x any fruit |  |  |  |  | Poured out flat, scattered with whatever was on the shelf, and set cold. Broken into shards that are never the same size twice running. |
|  | 17 | Hot Chocolate | pot |  | 3x any chocolate | 2x any milk | 1x any sugar | 1x any spice |  |  |  | Melted directly into hot milk rather than stirred in as a powder, which is the entire difference. Thick enough that a spoon leaves a trail behind it. |
|  | 18 | Chocolate Cake | cocotte |  | 3x any chocolate | 2x any grain | 2x any egg | 1x any butter |  |  |  | Baked until the middle is barely set and the top has cracked all the way across. Underbaking it slightly is not a mistake; it is the recipe. |
|  | 19 | Chocolate Truffles | caidao |  | 3x any chocolate | 2x any cream | 1x any sugar |  |  |  |  | Rolled by hand into rough spheres and dusted before they have a chance to melt. They are supposed to be ugly and the ugly ones genuinely taste better. |
|  | 20 | Chocolate Mousse | obliterator |  | 3x any chocolate | 2x any egg | 1x any cream | 1x any sugar |  |  |  | Whipped and folded until it holds air, then set cold for several hours. Folding too hard undoes every bit of the work in about ten seconds. |
| ❌ | 21 | Chocolate Sauce | pot |  | 3x any chocolate | 1x any cream | 1x any sugar | 1x any liquid |  |  |  | Melted into cream until it pours in a ribbon and coats the back of a spoon. It goes over everything cold and improves all of it without exception. |
|  | 22 | Snap Cookies | cocotte | crunch | 3x any grain | 2x any sugar | 1x any butter | 1x any spice |  |  |  | Stiff dough rolled thin, chilled hard, and cut into whatever shape the kitchen owns a cutter for. It snaps rather than bends, which is the entire difference and the reason it travels. |
| ❌ | 23 | Gummy Cake | cocotte |  | 3x any gummy | 2x any grain | 1x any egg | 1x any butter |  |  |  | Baked with sweets folded through the batter, where they half-melt into pockets. The pockets are the point and finding one is a small event. |
| ❌ | 24 | Melted Gummy Glaze | pot |  | 3x any gummy | 1x any liquid | 1x any sugar |  |  |  |  | Melted down into a glaze that sets glossy and hard and dyes everything its own colour. Wildly artificial and entirely unapologetic about it. |
|  | 25 | Shortbread | cocotte |  | 3x any butter | 2x any grain | 1x any sugar |  |  |  |  | Three ingredients, more butter than flour, and nothing in it that could rise even if asked. Bake it pale — colour is a mistake here and nowhere else. |
| ❌ | 26 | Sweet Buns | vaporera |  | 2x any sweet | 2x any grain | 1x any milk | 1x any butter |  |  |  | Steamed until the tops go pale and shiny and the filling inside turns to liquid. They are best about three minutes after they should already have been eaten. |
| ❌ | 27 | Toasted Sweets | hibachi |  | 3x any sweet | 1x any bread | 1x any chocolate |  |  |  |  | Held over an open flame until the outside blackens and the inside collapses. Everybody burns the first one and everybody eats it anyway. |
| ❌ | 28 | Sweet Custard | vaporera |  | 2x any sweet | 3x any egg | 1x any milk |  |  |  |  | Steamed low until it just sets and then no further, which is the rule for every custard. Sweetened with whatever the lane happened to have spare. |
| ❌ | 29 | Sweet Soup | pot |  | 3x any sweet | 2x any liquid | 1x any fruit | 1x any spice |  |  |  | A hot sweet broth served in a bowl at the end of a meal, which surprises exactly half of any table. It is old, it is common, and it is not a joke. |
|  | 30 | Drop Cookies | cocotte |  | 2x any sugar | 2x any grain | 1x any egg | 1x any butter | 1x any crunch |  |  | Dropped in rough spoonfuls, studded with something that shatters, and pulled out while the middles still look wrong, because they go on setting after they leave the heat. Everybody holds a fixed opinion about the correct degree of underdone and everybody is wrong except themselves. |
|  | 31 | Sweet Crumble | cocotte |  | 2x any sweet | 2x any fruit | 1x any seed | 1x any butter |  |  |  | Fruit under a rubble of butter, sugar and nuts, baked until the top golds and the bottom bubbles up the sides. It is a pie for people who cannot make pastry. |
| ❌ | 32 | Candied Veg | pot |  | 3x any sugar | 2x any vegetable | 1x any citrus |  |  |  |  | Simmered in syrup over days until it turns translucent and forgets what it used to be. A carrot treated this way stops being a carrot somewhere around the third afternoon. |

### Tier 2 — 16, one pinned slot

| ❌ | # | Name | Tool | Types | 1 | 2 | 3 | 4 | 5 | 6 | 7 | Description |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  | 33 | Rock Candy | icebox | sugar crunch | 4x cane sugar | 2x any liquid |  |  |  |  |  | Supersaturated syrup left with a string in it for a week while crystals grow unattended. The only recipe in this document where waiting is the entire method. |
|  | 34 | Powdered Sugar | obliterator | sugar spice | 4x rock candy | 1x any grain |  |  |  |  |  | Ground to dust with a little grain worked in to stop it clumping in the damp. It gets on everything within reach and stays there for days. |
|  | 35 | Earthen Circle | icebox | gummy spice | 3x leftover slime | 2x any sugar | 1x any herb |  |  |  |  | Set into dark rings with something bitter and rooty worked all the way through. A sweet that tastes of soil on purpose, and it has defenders. |
| ❌ | 36 | Black Cacao Truffles | caidao |  | 4x black cacao | 2x any cream | 1x any sugar |  |  |  |  | The darkest cacao rolled with the least sugar that will still hold it together. Bitter enough that one of them is genuinely sufficient. |
| ❌ | 37 | Putrid Slime Sweets | pot |  | 4x putrid slime | 3x any sugar | 1x any citrus |  |  |  |  | Boiled hard with enough sugar and acid to shout down whatever the slime was doing. It is unnervingly good and nobody wants that fact written down. |
|  | 38 | Sandwich Cookies | icebox |  | 3x **Snap Cookies** | 2x kream | 1x **Fruit Jam** |  |  |  |  | Two thin cookies with cream and jam pressed between them, left cold until the filling stops trying to escape out of the sides. The correct ratio is more filling than anybody thinks is wise. |
| ❌ | 39 | Burgundy Mousse | obliterator |  | 3x burgundy cacao | 2x any egg | 1x any cream | 1x any sugar |  |  |  | The wine-dark cacao whipped into something tasting faintly of fruit it never met. Folding gently is not optional at any point here. |
|  | 40 | Rolled Sponge | cocotte |  | 3x any grain | 2x **Whipped Cream** | 1x **Fruit Jam** | 1x any egg |  |  |  | Baked flat and thin, turned out while still hot and rolled up inside cloth so it learns the shape before it cools. Unroll it cold, fill it, roll it back — done in the wrong order it cracks the whole way down and there is no hiding that. |
| ❌ | 41 | Minty Dots Ice | icebox |  | 4x minty dots | 2x any cream | 1x any sugar |  |  |  |  | Crushed through cream and frozen hard, staining the whole thing faintly green. The mint arrives after the cold does, which is the entire trick of it. |
|  | 42 | Syrup Cake | cocotte |  | 4x syrup | 2x any grain | 2x any egg | 1x any butter |  |  |  | Soaked in syrup while still hot from the pot so that it drinks the lot. Dense, sticky, and impossible to slice cleanly with any knife. |
| ❌ | 43 | Double Dark Sauce | pot |  | 4x double dark cacao | 1x any cream | 1x any sugar | 1x any liquid |  |  |  | Melted into cream until it pours thick and tastes very nearly savoury. It goes over cold things and makes all of them serious. |
|  | 44 | Fudge | pot |  | 3x cane sugar | 2x any cream | 1x any chocolate | 1x any butter |  |  |  | Boiled to exactly one temperature and then beaten hard while it cools, which is what forces the crystals small enough to read as silk instead of sand. Beat it a minute early and you have made grit that nobody will finish. |
|  | 45 | Nougat | pot |  | 3x **Slime Foam** | 2x any seed | 1x syrup | 1x any sugar |  |  |  | Foam beaten into boiling syrup until it stiffens past the point of pouring, then packed solid with nuts and pressed between sheets of paper overnight. It pulls at teeth and nobody has ever stopped at one piece because of that. |
|  | 46 | Chocolate Dipped | icebox |  | 3x **Melted Chocolate** | 2x any fruit | 1x any crunch |  |  |  |  | Anything dry enough to hold still, lowered into tempered chocolate and stood somewhere cold until the shell snaps under a thumb. The dipping takes four minutes and deciding what to dip takes considerably longer. |
| ❌ | 47 | Rock Candy Glass | pot |  | 4x rock candy | 1x any liquid |  |  |  |  |  | Remelted and poured thin into sheets that set clear and shatter loudly. Somebody will make a window out of it and somebody else will eat the window. |
|  | 48 | Slime Cordial | pot |  | 4x leftover slime | 1x **Citrus Juice** | 1x any sugar | 1x any liquid |  |  |  | The cheapest slime on the roster boiled down with citrus until it is thin enough to drink and sweet enough to want to. It is what gets poured when somebody asks for something cold and nobody wants to explain what is in it. |

### Tier 3 — 8, two pinned slots

| ❌ | # | Name | Tool | Types | 1 | 2 | 3 | 4 | 5 | 6 | 7 | Description |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  | 49 | Blazing Spiral | pot | gummy spice | 3x cane sugar | 2x heat pepper | 1x any jelly |  |  |  |  | Sugar cooked with enough chilli that the heat arrives second and then stays third. The spiral shape is traditional and nobody remembers why. |
|  | 50 | Minty Dots | icebox | gummy spice | 3x rock candy | 2x minty herbs | 1x any jelly |  |  |  |  | Crushed candy set with mint into dots small enough to eat by the handful. Overdo the mint and you have manufactured a medicine instead. |
|  | 51 | Bitter Drinking Chocolate | donabe |  | 3x black cacao | 2x heat pepper | 1x **Nut Butter** | 1x any cream |  |  |  | Cacao melted down into cream with chilli and ground nut, which is how it was drunk for centuries before anybody thought to add sugar to it. The oldest recipe in the lane and it tastes exactly that old. |
|  | 52 | Slime Under Snow | icebox |  | 3x archaic slime | 2x powdered sugar | 1x **Citrus Curd** | 1x any fruit |  |  |  | Old slime set until it slices like glass, then buried under enough sugar to pass for snowfall, with a seam of sharp curd hidden underneath it. The contrast is the whole dish and both halves are load-bearing. |
|  | 53 | Shattered Yuzu Ice | icebox |  | 3x rock candy | 2x yuzu | 1x **Citrus Juice** | 1x any jelly |  |  |  | Crystals crushed to gravel through the sharpest citrus in the kitchen and frozen until they fuse back into a sheet, so it cracks and stings in the same mouthful. A palate cleanser that overcorrects magnificently. |
| ❌ | 54 | Syrup-Fried Dough | wok |  | 3x syrup | 2x devil slick | 1x **Whipped Cream** | 1x any grain | 1x any egg |  |  | Dough fried in the richest fat the kitchen owns and drowned in syrup while it is still spitting, then given cream it absolutely does not need. Every individual part of this is a bad idea and the result is undeniable. |
|  | 55 | Midnight Icebox Cake | icebox |  | 3x double dark cacao | 2x kream | 1x **Berry Compote** | 1x any bread |  |  |  | Severe cacao folded through sweetened cream and layered wet with biscuit overnight, until the biscuit stops being biscuit. The cream stops it being punishing and the compote stops it being solemn. |
|  | 56 | The Notorious | donabe |  | 3x putrid slime | 2x black cacao | 1x **Melted Chocolate** | 1x any spice |  |  |  | Cooked down with the darkest cacao in the kitchen until the smell reaches the floor above and everybody up there forms an opinion about it. Nobody has ever been neutral, and the people who like it like it violently. |

### Tier 4 — 4 signatures

| ❌ | # | Name | Tool | Types | 1 | 2 | 3 | 4 | 5 | 6 | 7 | Description |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  | 57 | The Quiet Dark | donabe |  | 3x black cacao | 2x double dark cacao | 2x kream | 1x **Browned Butter** | 1x **Toasted Nuts** | 1x heat pepper |  | The two darkest cacaos melted down with browned butter and cream and a whisper of heat underneath, then scattered with nuts toasted almost to burning. It is not sweet and it is not comforting, and people stop talking when they eat it. |
|  | 58 | Vindication Jelly | icebox |  | 3x archaic slime | 2x putrid slime | 2x **Sugar Glass** | 1x **Citrus Curd** | 1x rock candy | 1x yuzu |  | Two slimes nobody would touch separately, set clear as window glass with sugar shards suspended through them and a layer of curd beneath. This is the dish produced whenever somebody claims slime is not food, and it has never lost. |
|  | 59 | The Cathedral | pot |  | 4x rock candy | 2x cane sugar | 1x **Caramel** | 1x **Candied Peel** | 1x pure water | 1x powdered sugar |  | Sugar boiled hard, pulled, blown and assembled into a structure that has no business existing, with caramel run through the joints and candied peel set into the panes. It takes a day, it survives exactly one carry, and it is eaten by being broken. |
|  | 60 | Crossfire Ice | icebox |  | 3x blazing spiral | 2x minty dots | 2x kream | 1x **Caramel** | 1x black cacao |  |  | Heat, cold, mint, bitterness and burnt sugar set into one dish that cannot decide what it is doing to you. Every mouthful contradicts the one before it and nobody puts the spoon down. |

### Components this lane exports

Seven existing roster items, plus five invented components:

| Tier | Existing items produced |
|---|---|
|  | 1 | syrup, gummy rings |
|  | 2 | rock candy, powdered sugar, earthen circle |
|  | 3 | blazing spiral, minty dots |

| Component | Expected consumer |
|---|---|
| **Caramel** (3) | dairy, carb — ice cream, buns, anything baked |
| **Slime Syrup** (10) | fruit, dairy — the cheap sweetener |
| **Melted Chocolate** (15) | fruit, dairy — coating and folding |
| **Chocolate Sauce** (21) | fruit, dairy — over everything cold |
| **Melted Gummy Glaze** (24) | carb — buns and pastry |

**In-lane composition is the deepest of any finder lane**, because the maker half feeds the finder
half: cane sugar feeds rock candy (33), which feeds powdered sugar (34) and minty dots (50), which
feed Crossfire (60) and Archaic and Powdered (52). That is a three-hop chain and it also exceeds the
two-hop cap — the same ruling dairy needs will settle this one.

**No sweet recipe consumes another lane's invented dish.** Outside references are roster ingredients
only — cream, kream, devil slick, milk, egg, butter, grain, bread, seed, vessel, heat pepper, minty
herbs, nutmeg, yuzu, pure water.

### Known gaps in this draft

- **`any spice` accepting three gummies and powdered sugar is the roster's worst collision.** Forty-odd
  slots across five lanes are affected and the failure is silent: a seared steak seasoned with mint
  candy matches perfectly and reads as correct to the matcher. Either the gummies lose the spice tag
  or savoury recipes must name their spices.
- **The skillet gets one recipe** (Caramel, 3) and the hibachi one (Toasted Sweets, 27). Combined
  with fruit's single skillet entry, **the skillet is the least-used tool in the roster** across all
  six lanes and may be worth re-examining as a method rather than padding lanes to feed it.
- **Sweet exceeds the two-hop cap** by the same mechanism dairy does, though only three deep rather
  than five. Whatever is decided for the butter chain should apply here unchanged.
- **Chocolate and jelly are pure supply lanes with no maker recipe**, so half of sweet cannot be
  produced at all — only found. That is correct for the design, but it means sweet's tier 1 is less
  self-sufficient than its item count suggests.
- **Gel-o (i526) and Slime Puree (i529) already exist as shipped dishes** in the sweet space. Neither
  is duplicated above, but both should be re-filed or retired during the cross-examination pass —
  Slime Puree is currently tagged `<food:protein>` despite being made of slime, which the ruling that
  slime is sweet contradicts directly.

---

## SHARED / PANTRY PARADISE

**Not a lane, and deliberately not sixty recipes.** `recipe-system.md` already scoped this bucket:
*"spices, herbs and vessels are bought, farmed or dropped and so need no recipes at all. Roughly ten
recipes."* What follows is nine.

**The shared bucket is the most-used and least-cooked thing in the system.** Across the 360 recipes
drafted above:

| Slot | Times requested |
|---|---|
| `any spice` | **121** |
| `any oil` | **77** |
| `any herb` | **73** |
| `any liquid` | **71** |
| `any vessel` | 6 |

Three of those five categories are pure supply — salt, cumin, garlic and nutmeg are shop or farm; the
four herbs are farm or drop; the four vessels are shop. Two hundred requests, zero recipes. That is
correct, and it means **the pantry is the single largest balance lever in cooking**: if spices are not
reliably buyable, roughly a third of every lane stops working at once.

### The oils map one-to-one onto the lanes

This falls straight out of the roster and is almost certainly why there are seven of them:

| Oil | Made from | Lane |
|---|---|---|---|---|
| **meaty oil** | rendered trimmings | protein |
| **fresh oil** | pressed greens | vegetable |
| **dense oil** | crushed seed | carb |
| **fruity oil** | pressed fruit | fruit |
| **white oil** | clarified butter | dairy |
| **candy oil** | sugar and fat | sweet |
| **neutral oil** | **bought — the only one** | — |

**Neutral oil being shop-only is what makes the whole system bootstrap.** Every lane's tier 1 asks for
`any oil`, and five of the six cooked oils are made from ingredients that themselves want oil to cook.
Without a purchasable oil sitting outside that loop, a fresh save cannot cook anything at all. It
should never become craftable-only.

### The nine recipes

| ❌ | # | Name | Tool | Types | 1 | 2 | 3 | 4 | 5 | 6 | 7 | Description |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  | 1 | Meaty Oil | pot | oil liquid | 4x any meat | 1x any spice |  |  |  |  |  | Fat rendered out of trimmings over the lowest possible heat and strained clean. It carries the animal into everything it touches, which is either the whole point or the whole problem. |
|  | 2 | Fresh Oil | obliterator | oil liquid | 4x any greens | 1x any herb |  |  |  |  |  | Greens crushed and pressed until they weep something violently green and grassy. It tastes of the field it came out of and it does not keep for long. |
|  | 3 | Dense Oil | obliterator | oil liquid | 4x any seed | 1x any spice |  |  |  |  |  | Nuts crushed under weight until the oil runs and separates out. Heavier and slower-moving than any other oil here, and it fries hotter than all of them. |
|  | 4 | Fruity Oil | obliterator | oil liquid | 4x any fruit | 1x any citrus |  |  |  |  |  | Pressed cold so that nothing in the fruit gets a chance to cook. Cloudy, green-gold, and best used somewhere it will never be heated. |
|  | 5 | White Oil | pot | oil liquid | 4x any butter | 1x any liquid |  |  |  |  |  | Butter melted and held until the solids drop away and the fat above runs clear and pale. The most refined thing in the pantry and the most forgiving thing to cook with. |
|  | 6 | Candy Oil | pot | oil liquid | 4x any sweet | 1x any liquid |  |  |  |  |  | Sugar and fat cooked together until they emulsify into something glossy and faintly wrong. Used only in desserts, and only by people who know exactly what they are doing. |
|  | 7 | Distilled Water | pot | liquid | 4x water |  |  |  |  |  |  | Boiled, caught as steam, and let fall back cold into a second vessel. It tastes of absolutely nothing at all, which is the entire specification. |
|  | 8 | Mineral Water | pot | liquid | 3x water | 2x any coral |  |  |  |  |  | Water held against coral until it takes up the minerals and goes faintly hard across the tongue. The only good reason to carry coral, and the kitchen is quietly relieved to have found one. |
|  | 9 | Pure Water | icebox | liquid | 4x distilled water |  |  |  |  |  |  | Frozen slowly, so that everything which is not water is pushed out ahead of the advancing ice. What remains when it melts is the cleanest thing in the game. |
|  | 10 | Sea Salt | pot | spice crunch | 4x mineral water |  |  |  |  |  |  | Mineral water boiled away to nothing across a full day, until all that is left in the pan is what the coral put into it, dried into flakes you can hear break. A handful costs a day and a great deal of fuel, which is why the coarse stuff still sells by the sack. |

### Notes

- **Mineral Water rescues coral.** Coral was flagged in the vegetable draft as the weakest
  sub-category, with two apologetic recipes and no honest way to make a rock delicious. It turns out
  its job was never to be eaten — it is the mineral source, and this is the cross-lane rescue that
  section asked for.
- **Specificity tiering barely applies here.** Seven of the nine take only category slots; Mineral
  Water and Pure Water each pin one. There is no meaningful 32/16/8/4 shape in a set of nine and
  imposing one would be arithmetic rather than design.
- **Pantry has no signature tier, and therefore no OTIB.** Every other tab carries four permanent
  unlocks and this one carries none, so a player who mains the pantry has nothing to aspire to. That
  is either correct — the pantry is infrastructure and infrastructure should not be glamorous — or it
  is a gap in one of the seven crafting tabs. It wants a deliberate answer.
- **Nothing here consumes another lane's invented dish.** Every input is a roster ingredient or, in
  Pure Water's case, another pantry output one hop back.
  cross-examination rather than quietly restored: tortellini (50) was filled with a meat paste, and
  both tortellini dishes (53, 58) floated in a bone stock. A filled pasta genuinely wants a filling
  and a broth genuinely wants bones, so these are the strongest candidates in the lane for
  cross-lane composition — but they should be chosen against all six lanes, not against the only
  other lane that happened to exist.
