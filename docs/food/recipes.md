# Recipes

> **The finished roster.** 250 recipes across six food lanes plus the pantry, cut down from 375 drafted.
> The working document with every rejected recipe and the reasoning behind each decision is
> [`recipe-drafts.md`](recipe-drafts.md); this file is what gets built.
>
> **Related:** [`recipe-system.md`](recipe-system.md) is the design authority.
> [`ingredient-sorting.md`](ingredient-sorting.md) is the ingredient roster these slots are written against.

---

## How to read a row

`any X` is a **category slot** — any item carrying `<ingredientType:X>` satisfies it.
A bare name is a **pinned slot** — that exact item and nothing else.
A **Bolded Name** is another recipe's output.

**Tools** are one per recipe and the tool *is* the method: wok (sear/fry), pot (boil), donabe (stew),
skillet (saute), hibachi (grill), obliterator (puree), cocotte (bake/roast), vaporera (steam),
caidao (chop/raw), icebox (chill).

---

## The tier pyramid

| Tier | Per lane | Named things | Category slots |
|---|---|---|---|
| 1 | ~20 | none | all of them |
| 2 | ~10 | one, sometimes two | a couple |
| 3 | ~6 | two or three | one or two |
| 4 | **4** | all of them | none |

A **named thing** is any specific item asked for by name — a raw ingredient like `colossus gelatin`
or another recipe's output like `Mystery Meat Paste`. There is no third slot type.

**The bands are a floor, not arithmetic.** Ingredient count is a consequence of getting the dish right,
never a target, and a recipe may name what it genuinely needs at any tier.

### What a signature is

**One or two rare named ingredients, plus two to four components drawn from this lane and others.**
A signature is the sum of everything your kitchen already knows how to make, crowned with something you
had to go and get. Its final act must be a **transformation** — never an assembly.

Each grants the **OTIB** permanent passive on first consume, per actor, plus a **unique custom state**
belonging to that dish alone on top of its lane's ordinary food chain.

---

## Tags

**Everything cooked carries `<food:TYPE>`** — it is edible and it fires that lane's chain. Not listed
here; it follows from the lane.

**Only components carry `<ingredientType:N>`.** A component is something you made in order to make
something else. The Types column lists them.

**A cooked thing may carry product tags. It may never carry a raw-material tag.**

| | tags |
|---|---|
| **product / function** — a form that is already the result of processing | cheese · noodle · bread · cream · butter · yogurt · sugar · gummy · oil · liquid · crunch · gel · sponge · spice · paste |
| **raw material** — implicitly *raw-X*, and off-limits to anything cooked | flank · tail · ribs · wing · heart · blood · eyeball · greens · carrot · onion · berry · tuber · grain · seed · tomato · pepper · fungus · coral · petal · pod · sprout · rind · milk · jelly · chocolate |

That rule is what stops a dish being made out of itself: every `any flank` or `any onion` slot is a
raw slot, and nothing you cook can reach it.

**`paste`** is new — a thick spreadable thing made to go inside or under something else. It is why
Tortellini asks for `any paste` and you can fold jam into one.


---

## PROTEIN — Meaty Members

**40 recipes.**


### Tier 1 — 23

| # | Name | Tool | Types | 1 | 2 | 3 | 4 | Description |
|---|---|---|---|---|---|---|---|---|
| 1 | Scrambies | skillet |  | 3x any egg | 1x any butter | 1x any spice |  | The default breakfast of anyone who woke up in a tent. Whisked hard, cooked fast, and seasoned by whoever is holding the shaker. |
| 2 | Egg Drop Situation | pot |  | 2x any egg | 2x any liquid | 1x any herb |  | Egg poured in a thin ribbon into water hot enough to catch it on the way down. Whether it becomes soup or wet egg depends entirely on your wrist. |
| 3 | Omelette du Roadside | skillet |  | 3x any egg | 1x any cheese | 1x any herb |  | Folded once, badly, over whatever cheese was still in the bag. French in ambition and roadside in execution. |
| 4 | Seared Meat | skillet |  | 2x any meat | 1x any oil | 1x any spice |  | Hot pan, dry surface, hands off. This is less a recipe than the first thing anybody ever learns to do to an animal. |
| 5 | Backroad Skewers | hibachi |  | 3x any meat | 1x any vessel | 1x any spice |  | Cubes of whatever you killed threaded onto whatever you were carrying. The vessel is structural here rather than decorative. |
| 6 | Mystery Meat Paste | obliterator | paste | 3x any meat | 1x any oil |  |  | Not a meal, and never trying to be. It goes into other things, it has never once apologised for existing, and yes, you may eat it with a spoon. |
| 7 | Roast of Indeterminate Origin | cocotte |  | 2x any meat | 2x any root | 1x any oil | 1x any spice | Lidded, buried in vegetables, and left alone until the pot stops rattling. Nobody at the table will ask what it was, which is precisely the point. |
| 8 | Flank on the Grate | hibachi |  | 2x any flank | 1x any oil | 1x any spice |  | A big flat muscle over a hot grate, sliced against the grain. Do it wrong and it is a shoe; do it right and it is a Tuesday you remember. |
| 9 | Charred Rack | hibachi |  | 3x any ribs | 1x any oil | 1x any spice |  | Bones on the outside so the fire has something to hold on to. There is no dignified way to eat this and nobody has ever attempted one. |
| 10 | Rib Broth | pot | liquid | 3x any ribs | 2x any liquid | 1x any onion |  | Bones, water, hours. Half of everything else in the kitchen is downstream of this one pot. |
| 11 | Fried Wing Pile | wok |  | 4x any wing | 1x any oil | 1x any spice |  | Twice through the oil, once to cook it and once for the crackle. Portion control remains theoretically possible. |
| 12 | Steamed Wings | vaporera |  | 3x any wing | 1x any herb | 1x any liquid |  | Gentle heat renders the fat without picking a fight with the skin. This is what you make when somebody in the party is ill. |
| 13 | Blood Pudding | donabe |  | 2x any blood | 1x any grain | 1x any butter | 1x any spice | Set slowly over low heat until it will hold a spoon upright. An acquired taste that most people acquire somewhere around the second bite. |
| 14 | Crimson Custard | vaporera |  | 2x any blood | 2x any egg | 1x any cream |  | Steamed only until it barely sets, then eaten with a spoon. Savoury, iron-bright, and far better than its colour has any right to suggest. |
| 15 | Heartpaccio | caidao |  | 2x any heart | 1x any citrus | 1x any oil | 1x any spice | Raw, cut fine, dressed with acid and left alone for five minutes. Heart is the leanest muscle an animal owns and it tastes like the animal meant it. |
| 16 | Skewered Hearts | hibachi |  | 3x any heart | 1x any vessel | 1x any herb |  | Over coals, turned once, salted twice. Street food in every city the party has ever walked through and cheap in all of them. |
| 17 | Gel Stock | pot | liquid gel | 2x any gel | 2x any liquid | 1x any herb |  | Melted down into a broth that sets again the moment it cools. This is the base layer under half the fancy things you will ever make. |
| 18 | Erocian Pudding | pot |  | 1x any gel |  |  |  | A single lump of gelatin boiled until it slumps and sets again, which is the whole recipe and the whole trick. It is a delicacy in Erocy, it smells inexplicably of oranges, and it is the first thing anybody here will teach you to make. |
| 19 | Entire Steamed Fish | vaporera |  | 1x any fish | 1x any greens | 1x any herb | 1x any liquid | A whole fish laid over aromatics with the lid on for ten minutes. Serving it whole is a flex and everybody at the table knows it. |
| 20 | Fish Chowder | donabe |  | 2x any fish | 1x any tuber | 1x any milk | 1x any onion | Fish simmered so gently in milk that everything eventually agrees to be one thing. Thicker than a soup, looser than a stew, better than either. |
| 21 | Sashimi | caidao |  | 2x any fish | 1x any citrus | 1x any spice |  | No heat and nowhere to hide. This dish is entirely a referendum on your knife and your fish. |
| 22 | Crisped Flank | wok | crunch | 4x any flank | 1x any oil | 1x any spice |  | Sliced thin and fried hard until the fat renders out and what is left shatters between your fingers. It gets scattered over other food and it has never once made anything worse. |
| 23 | Meatballs | skillet |  | 3x any meat | 1x any grain | 1x any egg | 1x any herb | Bound with grain and egg, rolled between wet palms, browned all over and then finished in whatever sauce is going. Rolling them all the same size is the only difficult part and nobody manages it. |

### Tier 2 — 7

| # | Name | Tool | Types | 1 | 2 | 3 | 4 | 5 | Description |
|---|---|---|---|---|---|---|---|---|---|
| 24 | Bearcat Burnt Ends | hibachi |  | 2x bearcat flank | 1x any sugar | 1x any oil | 1x any spice |  | The tips of the flank cut away, sauced, and returned to the coals until they candy. The best part of the animal, and there are only ever four of them. |
| 25 | Beefy Tail Ragu | donabe |  | 2x beefy tail | 1x any tomato | 1x any onion | 1x any herb |  | Simmered until the meat gives up entirely and joins the sauce. Traditionally served over anything that will hold still long enough. |
| 26 | Snooping Eyeball Bisque | obliterator |  | 2x snooping eyeball | 1x any cream | 1x any liquid | 1x any spice |  | Blended smooth so that nothing left in the bowl can look back at you. Rich, faintly briny, and best served to guests who did not ask what was in it. |
| 27 | Virgin Blood Sausage | vaporera |  | 2x virgin blood | 1x any grain | 1x any onion | 1x any spice |  | Bound with grain, cased, and steamed until it is firm all the way through. Sliced thin it goes translucent at the edges, which is how you know it worked. |
| 28 | Cumin-Crusted Ribs | cocotte |  | 3x any ribs | 2x cumin | 1x any oil | 1x any spice |  | Rubbed heavy, roasted low, and left until the crust is audible under a knife. Smells like a market street two towns over from wherever you are. |
| 29 | Bone-Drunk Tofu | donabe |  | 4x tofu | 2x **Rib Broth** | 1x any spice |  |  | Blocks of bean curd lowered into stock made from bones and left to drink until they come out heavier than they went in. The one ingredient in this lane that never lived, doing a better impression of everything that did. |
| 30 | Second-Day Flank | skillet |  | 3x any flank | 1x **Pepper Paste** | 1x parmesan | 1x any greens | 1x any crunch | Yesterday's meat pressed back into a hot pan until the edges catch again, tossed through paste and hard cheese, then buried under something peppery and something that shatters. It has no business being this good and everybody who makes it says so out loud. |

### Tier 3 — 6

| # | Name | Tool | Types | 1 | 2 | 3 | 4 | 5 | Description |
|---|---|---|---|---|---|---|---|---|---|
| 31 | Dargin Tail Braise | donabe |  | 2x dargin tail | 2x **Caramelised Onions** | 1x **Rib Broth** | 1x ao negi | 1x any herb | Dragon-kin tail browned hard and drowned in stock for half a day, with allium at both ends of the process — caramelised into the pot until it dissolves and goes black, then raw and green over the top at the last second. |
| 32 | Giga Flank Chateaubriand | cocotte |  | 2x giga flank | 2x **Browned Butter** | 1x any herb | 1x any spice |  | A cut this size demands a lidded pot and a certain amount of nerve. Basted continuously in butter that was already cooked to hazelnut before it ever touched the meat. |
| 33 | Peerless Consomme | pot |  | 2x peerless eyeball | 3x **Rib Broth** | 1x pure water | 1x any egg | 1x any herb | Stock lifted clear twice through a raft of egg white, then let down with the clearest water the party is carrying. It arrives looking like a glass of nothing and tastes like the sea's opinion of you. |
| 34 | Iridescent Confit | cocotte |  | 2x iridescent wing | 3x **meaty oil** | 1x any herb | 1x any spice |  | The feathers still refract after cooking, which the kitchen has collectively decided is a feature. Submerged entirely in rendered fat and held at a whisper for six hours. |
| 35 | Salt-Baked Sparkling Fish | cocotte |  | 1x sparkling fish | 3x salt | 2x **Green Puree** | 1x any egg | 1x any herb | Encased in a shell of salt and egg white and baked until the crust rings when tapped, then opened over a pool of green. Cracking it at the table is the entire reason to make it. |
| 36 | Ghosty Souffle | cocotte |  | 4x ghosty eggs | 2x **Cheese Sauce** | 1x kream | 1x any spice |  | Built on a sauce base, because loose cheese has never once risen. It goes higher than it should and stays there longer than it should, and nobody has been comfortable with why. |

### Tier 4 — 4

| # | Name | Tool | Types | 1 | 2 | 3 | 4 | 5 | 6 | 7 | Description |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 37 | Deathless Cut | cocotte |  | 1x titan heart | 2x **Rib Broth** | 2x **meaty oil** | 1x **Roast of Indeterminate Origin** | 1x **Caramelised Onions** | 1x ao negi |  | A heart too large to cook through by any other means, buried for a day and a night in a pot lined with everything the kitchen already knew how to make, and finished with something raw and green so the whole thing does not simply flatten you. Eating it once permanently changes what your body believes it is capable of. |
| 38 | Full Circle | hibachi |  | 3x ouroboros ribs | 1x black cacao | 2x **Melted Chocolate** | 2x **Pepper Paste** | 1x **meaty oil** |  |  | The rack curls back onto itself and is grilled in a closed circle, painted the whole way round with a glaze of bitter chocolate and chilli. The last bite tastes exactly like the first, which is either the spice or the point. |
| 39 | Stained Glass | icebox |  | 1x colossus gelatin | 2x faerie bouquet | 2x **Gel Stock** | 1x **Sugar Glass** | 1x **Candied Petals** |  |  | A single flawless gel set around flowers held in two states at once — fresh blossoms and candied petals, suspended apart by nothing but stock and nerve. It holds its own weight, it holds the light, and it holds up under a spoon. |
| 40 | The Bare Blade | caidao |  | 3x pristine fish | 1x yuzu | 1x **Citrus Juice** | 1x **fruity oil** | 1x **Strained Yogurt** | 1x **Green Puree** | 1x **Sea Salt** | One fish broken down into every cut it has, each piece dressed differently and finished with flakes that dissolve on contact, so that a single cold plate becomes a survey of everything the kitchen can do. There is nowhere at all to hide: each sauce sits alone beside a piece of raw fish and answers for itself. |

---

## CARB — Densecraft

**40 recipes.**


### Tier 1 — 22

| # | Name | Tool | Types | 1 | 2 | 3 | 4 | 5 | Description |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Morning Porridge | pot |  | 2x any grain | 1x any milk | 1x any sugar | 1x any spice |  | Cooked well past the point where the grain gives up its structure and turns into comfort. Somebody in every party insists on making it wrong. |
| 2 | Toasted Grain | skillet | crunch | 3x any grain | 1x any spice |  |  |  | Dry-toasted in a hot pan until it smells like a bakery and starts to pop. Keeps for weeks and makes everything downstream of it taste deliberate. |
| 3 | Egg Fried Rice | wok |  | 2x any grain | 1x any egg | 1x any oil | 1x any vegetable | 1x ao negi | Yesterday's grain, today's pan, whatever else survived the week, and scallion thrown in at the very end so the whole thing does not read as brown. The one dish that is better made with stale ingredients than fresh ones. |
| 4 | Macaroni | pot | noodle | 2x any grain | 1x any egg | 1x any liquid |  |  | Dough rolled, cut into stubby tubes, and boiled for the length of one argument. Everything you have ever eaten off a noodle was waiting on somebody doing this first. |
| 5 | Roll | cocotte | bread | 2x any grain | 1x any liquid | 1x any oil |  |  | Mixed, left alone to do its own work, and baked under a lid until the tops go gold. The single most useful thing anyone ever learned to do with wheat. |
| 6 | Smashed Potatoes | pot |  | 3x any tuber | 1x any butter | 1x any milk |  |  | Boiled soft and broken up by hand in the pot they cooked in, then enriched well past the point of good sense. Never take a blade to them — it turns the starch to glue and there is no way back. |
| 7 | Roasted Tubers | cocotte |  | 3x any tuber | 1x any oil | 1x any herb | 1x any spice |  | Cut into wedges, tossed in oil, and roasted until the outsides go rough and golden. The inside is the reward and the outside is the reason. |
| 8 | Potato Crisps | wok |  | 2x any tuber | 2x any oil | 1x any spice |  |  | Sliced translucent and dropped into oil hot enough to seize them instantly. Nobody has ever made exactly as many of these as they intended to. |
| 9 | Cold Potato Salad | icebox |  | 3x any tuber | 1x any yogurt | 1x any crunch | 1x any onion |  | Dressed while still warm so it drinks everything, then chilled until the flavours settle down. Improves overnight, which makes it the only dish here that rewards forgetting about it. |
| 10 | Toasted Nuts | skillet | crunch | 3x any seed | 1x any oil | 1x any spice |  |  | Shaken over medium heat until they colour and the whole room notices. Thirty seconds separates perfect from ruined and the pan gives no warning. |
| 11 | Nut Butter | obliterator | butter paste | 4x any seed | 1x any oil |  |  |  | Blended long past the point where it looks like it has failed, until it suddenly turns. Patience is the entire recipe and the machine does the rest. |
| 12 | Candied Nuts | wok | crunch | 3x any seed | 1x any sugar | 1x any butter |  |  | Tossed in melting sugar until each one wears a shell that cracks. Road food, party food, and the reason several characters have chipped teeth. |
| 13 | Noodles in Broth | pot |  | 2x any noodle | 2x any liquid | 1x any greens | 1x any crunch |  | Noodles, hot liquid, something green, and no further ambition. Eaten more often than any other dish in this document and never once photographed. |
| 14 | Cold Noodles | icebox |  | 2x any noodle | 1x any citrus | 1x any oil | 1x any herb |  | Rinsed cold to stop them dead, then dressed sharp and eaten straight from the box. The only correct food for a hot afternoon on a long road. |
| 15 | Griddle Cakes | skillet |  | 2x any grain | 1x any milk | 1x any egg | 1x any sugar |  | Batter dropped onto a hot dry surface and turned exactly once, at the moment the bubbles on top stop closing over. Turning them twice is the mark of somebody nobody has told. |
| 16 | Toast | hibachi |  | 2x any bread | 1x any butter |  |  |  | Bread held over a live flame until it decides which side it prefers. The simplest entry in this document and the one you will make most often. |
| 17 | Bread Pudding | cocotte |  | 2x any bread | 2x any egg | 1x any milk | 1x any sugar |  | Stale bread drowned in custard and baked until the top sets and the middle does not. Invented by somebody who refused to throw bread away and vindicated ever since. |
| 18 | Breadcrumbs | obliterator | crunch | 3x any bread | 1x any herb |  |  |  | Dried hard and then blitzed to gravel. Not food, exactly, but the difference between a coating and a disappointment. |
| 19 | Panzanella | caidao |  | 2x any bread | 2x any tomato | 1x any oil | 1x any herb |  | Torn bread left to sit in oil and tomato until it softens without surrendering. A salad that is mostly bread, which is the only kind worth eating. |
| 20 | Dumplings | vaporera |  | 2x any grain | 1x any protein | 1x any vegetable | 1x any spice |  | Wrapped, pleated badly, and steamed in a stack until translucent. The first few are ugly and the last few are art, and they all taste the same. |
| 21 | Cheesy Noods | pot |  | 2x any noodle | 2x any vegetable | 1x any oil | 1x any cheese |  | Boiled, drained deliberately badly so a little of the water goes into the pan with them, then tossed until the sauce stops sliding off. The starch in that water is the whole trick, which is why nobody who knows ever rinses them. |
| 22 | Savoury Congee | pot |  | 3x any grain | 2x any liquid | 1x any protein | 1x ao negi |  | Grain cooked in far too much water for far too long, until it bursts and the whole pot turns to silk. It is what gets made for somebody who is ill, and what they ask for again once they are not. |

### Tier 2 — 10

| # | Name | Tool | Types | 1 | 2 | 3 | 4 | 5 | 6 | Description |
|---|---|---|---|---|---|---|---|---|---|---|
| 23 | Linguini | pot | noodle | 2x wheat | 1x any egg | 1x any liquid |  |  |  | Rolled thinner and cut wider than macaroni, which changes everything about how sauce behaves on it. Wheat specifically, because nothing else holds a long noodle together. |
| 24 | Loaf | cocotte | bread | 3x wheat | 1x any liquid | 1x any oil |  |  |  | A full loaf rather than a roll, which means a longer rise and a real crust. It keeps for days and is the backbone of half the bread recipes above. |
| 25 | Hella Loaded Baked Potato | cocotte |  | 2x big ass potato | 1x any butter | 1x any cheese | 1x any herb |  |  | An hour in the pot and then split open while it is still steaming. It is a meal by itself, which is the entire reason it grew that way. |
| 26 | Hazelnut Butter | obliterator |  | 4x hazelnuts | 1x any oil | 1x any sugar |  |  |  | Toasted first, skinned badly, then blended until it goes glossy and dark. Worth the extra step over any other nut and every baker in the world knows it. |
| 27 | Cooked Rice | pot |  | 3x rice | 1x any liquid |  |  |  |  | Rinsed until the water runs clear, measured exactly, and then left completely alone. The hardest easy thing in the kitchen and nobody respects it until they get it wrong. |
| 28 | Croissant | cocotte | bread | 2x any grain | 3x creamed cream | 1x any liquid |  |  |  | Dough and butter folded through each other until there are more layers than anyone can count. It has to be whole butter and never the clarified sort, because the water in it is what turns to steam and drives the layers apart. |
| 29 | Spekkled Mac and Cheese | cocotte |  | 3x macaroni | 2x any cheese | 1x **Breadcrumbs** | 1x **Crisped Flank** | 1x **Pepper Paste** | 1x any milk | Baked rather than stirred, because a crust is not optional, and built with three separate kinds of crunch — crumbs worked across the top, cracklings scattered over those, and a thin seam of pepper paste stirred through so the whole thing argues back. This is the dish that ends the argument about which version is correct. |
| 30 | Soba | pot | noodle | 3x millet | 1x any liquid |  |  |  |  | Dark, nutty, and cooked in barely three minutes before being shocked cold. Millet makes a noodle that tastes of something instead of merely carrying sauce. |
| 31 | Whitecap Risotto | donabe |  | 2x any grain | 2x whitecap mushroom | 1x any butter | 1x any cheese | 1x any liquid |  | Started in butter and then stirred continuously while the liquid goes in a ladle at a time, for twenty unbroken minutes. Whitecaps count as carb here, which the recipe finds funny and the eater does not care about. |
| 32 | Soba on Ice | icebox |  | 2x soba | 1x ao negi | 1x any citrus | 1x any oil |  |  | Rinsed under cold water until the noodles squeak, dressed barely, and finished with green cut so fine it is almost a powder. Restraint is the technique and there is nothing else hiding in the bowl. |

### Tier 3 — 4

| # | Name | Tool | Types | 1 | 2 | 3 | 4 | 5 | Description |
|---|---|---|---|---|---|---|---|---|---|
| 33 | Baguette | cocotte | bread | 3x wheat | 2x salt | 1x any liquid |  |  | Three ingredients, a long cold rise, and a crust that shatters loudly enough to turn heads. The salt is doing structural work here and cutting it produces something sad and pale. |
| 34 | Tortellini | pot | noodle | 2x wheat | 2x avian eggs | 1x any paste | 1x any cheese |  | Squares of egg dough folded around whatever paste is to hand and a little cheese, one at a time, several hundred times. Nobody has ever agreed on what belongs inside one, and the folding is the whole job regardless. |
| 35 | Walnut Loaf | cocotte |  | 3x millet | 2x walnuts | 1x **Toasted Grain** | 1x any butter | 1x any egg | Dense, dark, and heavy enough to work as a doorstop by the third day, with a soaker of toasted grain worked through it. Cut thin, toasted hard, it outlives every other bread in the bag. |
| 36 | Big Gratin | cocotte |  | 3x gold potato | 2x parmesan | 1x **Breadcrumbs** | 1x any cream |  | The gratin taken seriously, with hard cheese grated into every single layer and a crumb crust over the top. It comes out of the pot in one piece and is cut like a cake. |

### Tier 4 — 4

| # | Name | Tool | Types | 1 | 2 | 3 | 4 | 5 | 6 | 7 | Description |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 37 | Proof | cocotte |  | 3x wheat | 2x **Cheese Sauce** | 2x **Caramelised Onions** | 1x **Browned Butter** | 1x pure water | 1x salt |  | A whole loaf built around its own filling and baked sealed, so that nothing inside is visible until somebody cuts it. The proof is in that cut: either the layers are in there or you have made a very large roll. |
| 38 | Amber Bowl | pot |  | 3x **tortellini** | 2x **Vegetable Stock** | 2x **Caramelised Onions** | 1x **Browned Butter** | 1x **Parmesan Crisps** | 1x tropea onion |  | Thirty parcels in a stock cooked down with onions until it goes amber, finished at the table with butter cooked to hazelnut poured over and a sheet of lace-thin cheese laid across the top. The broth took a day and the crisp survives about ninety seconds against it. |
| 39 | The Gift | cocotte |  | 1x is this even still a potato | 2x **Cheese Sauce** | 2x **Caramelised Onions** | 1x **Crisped Flank** | 1x **Strained Yogurt** | 1x ao negi | 1x devil slick | A tuber the size of a helmet, rubbed in dark fat and roasted for most of a day until the skin goes to armour, then split at the table and loaded until it overflows. Everything goes on it — cheese, onions, cracklings, yogurt, and a fistful of ao negi cut fine over the top. |
| 40 | Couronne | cocotte |  | 3x **croissant** | 2x **Hazelnut Butter** | 2x kream | 1x **Candied Peel** | 1x powdered sugar |  |  | Laminated dough coiled into a ring, filled with nut butter and cream and studded with candied citrus before it goes back for a second bake. It takes two days and it is the only thing in this lane that is unambiguously showing off. |

---

## VEGETABLE — Produce Power

**40 recipes.**


### Tier 1 — 20

| # | Name | Tool | Types | 1 | 2 | 3 | 4 | 5 | Description |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Wilted Greens | skillet |  | 3x any greens | 1x any oil | 1x any spice |  |  | Greens hit a hot pan and collapse to a quarter of their volume in under a minute. Everyone underestimates how many they need and everyone is wrong about it exactly once. |
| 2 | Green Puree | obliterator | paste | 4x any greens | 1x any oil | 1x any liquid |  |  | Blitzed to a smooth, aggressive green that stains everything it touches. It goes under other food, over other food, and occasionally onto a wound. |
| 3 | Green Salad | caidao |  | 3x any salad | 1x any crunch | 1x any oil | 1x any citrus |  | Torn rather than cut, dressed at the last possible moment, eaten immediately. Everything about it is timing and none of it is technique. |
| 4 | Slaw | caidao |  | 3x any salad | 1x any carrot | 1x any crunch | 1x any yogurt |  | Shredded fine and left to sit until it gives up its water and softens. Better an hour later, which makes it the only salad worth making in advance. |
| 5 | Caramelised Onions | skillet | paste | 4x any onion | 1x any butter | 1x any spice |  |  | Forty minutes of low heat and near-constant attention to turn something sharp into something sweet. There is no faster version and every cook alive has gone looking for one. |
| 6 | Onion Rings | wok |  | 3x any onion | 1x any grain | 1x any oil | 1x any egg |  | Sliced thick, battered, and dropped into oil until they float and go gold. The batter is a delivery mechanism and everybody involved knows it. |
| 7 | Roasted Carrots | cocotte |  | 4x any carrot | 1x any oil | 1x any herb | 1x any spice |  | Roasted long enough that the sugars come out and the edges go dark. Carrots are the only vegetable that improves the more you neglect them. |
| 8 | Carrot Puree | obliterator | paste | 4x any carrot | 1x any butter | 1x any liquid |  |  | Cooked soft and blended with enough butter to turn it glossy. Orange, silky, and considerably more sophisticated than a carrot has any right to be. |
| 9 | Blistered Peppers | hibachi |  | 4x any pepper | 1x any oil | 1x any spice |  |  | Straight onto the grate until the skins blacken and lift away. One in every handful is unreasonably hot and there is no way at all to tell which. |
| 10 | Stuffed Peppers | cocotte |  | 3x any pepper | 1x any grain | 1x any protein | 1x any cheese |  | Hollowed, packed, and baked until the pepper slumps and the filling sets. Structurally a bowl that you are permitted to eat afterwards. |
| 11 | Pepper Paste | obliterator | paste spice | 4x any pepper | 1x any oil | 1x any spice |  |  | Blended into a thick red paste that keeps for months and improves nearly everything. A spoonful of it is the difference between a meal and a good meal. |
| 12 | Tomato Sauce | donabe | liquid paste | 4x any tomato | 1x any onion | 1x any oil | 1x any herb |  | Simmered slowly until the water leaves and what remains is dark and concentrated. Half the dishes in this document would like a spoonful of it. |
| 13 | Tomato Salad | caidao |  | 3x any tomato | 1x any crunch | 1x any herb | 1x any oil |  | Cut thick, salted early, and left alone to weep for ten minutes. The liquid in the bottom of the bowl is the best part of it and should be drunk directly. |
| 14 | Bean Stew | donabe |  | 3x any pod | 1x any onion | 1x any tomato | 1x any liquid | 1x any herb | Cooked long and low in enough liquid to keep them covered, until the beans give up and what is left thickens itself. Cheap, filling, and noticeably better on the second day. |
| 15 | Raw Sprouts | caidao |  | 3x any sprout | 1x any citrus | 1x any oil |  |  | Rinsed, dressed, and eaten within the hour before they turn. Nothing is cooked and there is nothing to hide behind. |
| 16 | Vine Wraps | vaporera |  | 3x any vine | 1x any grain | 1x any protein | 1x any spice |  | Leaves off the trap-vines, softened over steam, and rolled tight around a filling. The vine still twitches occasionally and the kitchen has collectively agreed to ignore it. |
| 17 | Candied Petals | icebox | crunch | 3x any petal | 2x any sugar | 1x any egg |  |  | Painted with egg white, dusted in sugar, and set cold until they go rigid. Half decoration and half confectionery, and entirely unnecessary, which is precisely the appeal. |
| 18 | Mushroom Broth | pot | liquid | 3x any fungus | 2x any liquid | 1x any herb |  |  | Simmered until the liquid goes brown and savoury and tastes vaguely of meat. It is the closest a vegetable ever comes to lying about what it is. |
| 19 | Stuffed Sponge | cocotte |  | 2x any sponge | 1x **Breadcrumbs** | 1x any cheese | 1x any herb |  | Halved, hollowed, packed with crumbs and cheese and roasted until the shell slumps around whatever went inside it. Anything hollow enough to fill is a bowl the moment you decide it is. |
| 20 | Vegetable Stock | pot | liquid | 3x any vegetable | 2x any liquid | 1x any onion | 1x any herb |  | Everything slightly past its best, plus water, plus an hour of doing nothing. The most useful thing anyone can make out of what they were about to throw away. |

### Tier 2 — 11

| # | Name | Tool | Types | 1 | 2 | 3 | 4 | 5 | Description |
|---|---|---|---|---|---|---|---|---|---|
| 21 | Wilted Emeralds | skillet |  | 3x verdant greens | 1x any butter | 1x any spice |  |  | The best greens on the roster given the simplest treatment available to anyone. Anything more elaborate is an insult and the kitchen will say so out loud. |
| 22 | Kale Crisps | cocotte |  | 4x kale | 1x any oil | 1x any spice |  |  | Roasted flat until they shatter, then seasoned while still too hot to handle. Kale is officially a bread ingredient, which nobody has ever satisfactorily explained. |
| 23 | Tropea Onion Soup | donabe |  | 3x tropea onion | 1x any butter | 2x any liquid | 1x any bread | 1x any cheese | The soup made with the onion that costs money, which turns out to matter enormously. Sweeter, darker, and worth the difference on every single occasion. |
| 24 | Glazed Happiness | skillet |  | 4x happiness carrot | 1x any sugar | 1x any butter |  |  | Named optimistically and, unusually for this roster, accurately. Eaten straight from the pan by people who claim they are only checking the seasoning. |
| 25 | Tofu | pot | sponge protein | 4x round beans | 1x **Mineral Water** |  |  |  | Beans crushed to milk, heated, and set with mineral water until it holds a shape under its own weight. The minerals do all of the work and the kitchen mostly just waits for them. |
| 26 | Purple Goodness | wok |  | 3x eggplant | 2x devil slick | 1x any spice |  |  | Slabs laid into fat hot enough to hurt, where they squeak, resist, and then all at once stop resisting. It drinks every drop it is given and comes out silk, which is the only reason anybody forgives how much it drank. |
| 27 | Roasted Pumpkin | cocotte |  | 3x pumpkin | 1x any seed | 1x any oil | 1x any spice |  | Cut into wedges and roasted skin-on until the edges blacken and the flesh turns to sugar, with its own seeds toasted hard and thrown back over the top. Nothing is wasted, and the best part is the part most people throw away. |
| 28 | Blistered Tofu | wok |  | 3x tofu | 1x **Pepper Paste** | 1x ao negi | 1x any oil |  | Pressed dry and fried until the outside goes leathery and blistered, then hit with pepper paste while it is still spitting. Bland by nature and belligerent by preparation. |
| 29 | Fungus Toss | wok |  | 4x maitake mushroom | 1x any oil | 1x any spice |  |  | Torn rather than sliced, so the ragged edges catch the oil and crisp. Maitake is the one mushroom that occasionally converts a skeptic. |
| 30 | Romaine Boats | caidao |  | 4x romaine | 1x **Crisped Flank** | 1x **Strained Yogurt** | 1x ao negi |  | Whole leaves used as the plate, loaded with cracklings and thick yogurt and eaten entirely by hand. Romaine counts as a vessel here, which is the roster making a joke that turns out to work. |
| 31 | Sour Sprout Salad | caidao |  | 4x sour sprouts | 1x any crunch | 1x any oil | 1x any herb |  | Sprouts that arrive already sour, leaving the dressing with almost nothing to do. Sharp enough to wake somebody up in the middle of a meal. |

### Tier 3 — 5

| # | Name | Tool | Types | 1 | 2 | 3 | 4 | 5 | 6 | Description |
|---|---|---|---|---|---|---|---|---|---|---|
| 32 | Citrus Coral | vaporera |  | 2x ancient coral | 2x yuzu | 1x any oil | 1x any herb |  |  | Steamed gently and finished with citrus sharp enough to cut straight through the mineral. The only preparation that makes coral taste deliberate rather than endured. |
| 33 | Crimson Heat | obliterator |  | 3x crimson tomato | 2x **Pepper Paste** | 1x any oil | 1x any spice |  |  | The darkest tomato on the roster blended into the hottest paste in the kitchen. Nobody has ever described the result as mild and nobody ever will. |
| 34 | Parmesan Maitake | cocotte |  | 3x maitake mushroom | 2x parmesan | 1x any oil | 1x any herb |  |  | Roasted under a lid until the cheese fuses itself to the ragged edges. This is the dish produced as evidence whenever the mushroom argument restarts. |
| 35 | Edible Kale | hibachi |  | 4x kale | 2x heat pepper | 1x any oil | 1x any citrus |  |  | Grilled hard over open flame with enough chilli to change its personality outright. People who state confidently that they dislike kale have usually not met this one. |
| 36 | What the Ground Gave | caidao |  | 3x verdant greens | 2x crimson tomato | 2x **Green Puree** | 1x **Caramelised Onions** | 1x **Toasted Nuts** | 1x fruity oil | Everything finest the ground produced, laid raw across a sweep of its own greens blitzed to a sauce, with onions cooked down to jam and nuts toasted hard scattered over the top. No heat ever touches the plate itself, which is exactly why there is nowhere on it to hide. |

### Tier 4 — 4

| # | Name | Tool | Types | 1 | 2 | 3 | 4 | 5 | 6 | Description |
|---|---|---|---|---|---|---|---|---|---|---|
| 37 | Turnabout Braise | donabe |  | 3x doomtrap vine | 2x **Vegetable Stock** | 2x **Caramelised Onions** | 1x devil slick | 1x ao negi |  | A vine that fought back, browned hard in dark fat and then braised a full day in stock and onions until it surrenders completely, with something raw and green over it at the end. Eating a thing that tried to eat you first is a specific pleasure, and this dish is built around nothing else. |
| 38 | Ephemeral Bloom | cocotte |  | 2x faerie bouquet | 2x **white oil** | 1x **Candied Petals** | 1x **pure water** | 1x powdered sugar |  | An entire bouquet cooked whole and served whole in a broth of very nearly nothing, with petals from the same flower candied and set around it like frost. It is the most delicate thing anyone in this party has made and it survives exactly one trip across a room. |
| 39 | Kaleidoscope | cocotte |  | 3x eggplant | 2x zucchini | 2x **Pepper Paste** | 2x **Tomato Sauce** | 1x crimson tomato | 1x **fresh oil** | Every vegetable sliced to the same impossible thinness and stood on edge in a tight spiral over a base of pepper and tomato, then baked under a lid until the rings slump into one another. Cutting it open shows every layer it was built from, which is the only proof anyone gets that it took all day. |
| 40 | The Uncredited Root | cocotte |  | 4x happiness carrot | 2x **Caramelised Onions** | 2x **Browned Butter** | 1x **Carrot Puree** | 1x nutmeg |  | Roasted carrots laid over a puree of the same carrot, with onions cooked down for an hour into something nearly black and butter taken all the way to hazelnut. It is named after the carrot, but the onion does half the work and the carrot has never once acknowledged it. |

---

## DAIRY — Dairy Air

**40 recipes.**


### Tier 1 — 14

| # | Name | Tool | Types | 1 | 2 | 3 | 4 | 5 | Description |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Cream | icebox | cream milk | 3x any milk | 1x any liquid |  |  |  | Left cold and undisturbed until the fat rises far enough to be skimmed off the top. It is the least active recipe in this entire document and it still counts as cooking. |
| 2 | Creamed Cream | obliterator | butter cream | 3x any cream | 1x any spice |  |  |  | Cream beaten past whipped, past stiff, and out the other side until it breaks into fat and liquid. The moment it turns is unmistakable and slightly alarming the first time. |
| 3 | Cheddar | pot | cheese fungus | 3x any milk | 1x any citrus | 1x any spice | 1x any herb |  | Curdled with acid, cut, stacked and pressed, then left alone for far longer than feels reasonable. The first cheese anybody learns and the one they never stop making. |
| 4 | Whipped Yogy | obliterator | yogurt fungus | 3x any yogurt | 1x any milk |  |  |  | Beaten with a little milk until it loosens and goes airy under the blade. Officially a fungus, which the roster insists upon and nobody wants to think about. |
| 5 | Fondue | donabe |  | 3x any cheese | 1x any citrus | 1x any liquid | 1x any bread | 1x any spice | Melted slowly with liquid and something sharp, because cheese without acid seizes into rubber rather than melting. Eaten communally, which is either intimate or a hygiene incident depending entirely on the party. |
| 6 | Grilled Cheese | skillet |  | 2x any cheese | 2x any bread | 1x any butter |  |  | Butter on the outside, cheese on the inside, and patience over medium heat. Rushing it produces a burnt sandwich with a cold middle, and everybody has made exactly one. |
| 7 | Cheese Sauce | pot | liquid | 3x any cheese | 1x any milk | 1x any butter | 1x any grain |  | Melted into thickened milk until it pours smooth and coats the back of a spoon. It goes over vegetables, over noodles, and over several things that did not ask for it. |
| 8 | Milk Pudding | pot |  | 3x any milk | 1x any grain | 1x any sugar | 1x any spice |  | Grain cooked slowly in milk until it thickens itself and the spoon stands unaided. Somebody's grandmother invented every version of this independently and all of them are correct. |
| 9 | Custard | vaporera | gel | 3x any milk | 2x any egg | 1x any sugar |  |  | Steamed low until it sets to a wobble and then stopped immediately. The line between custard and sweet scrambled egg is about ninety seconds wide. |
| 10 | Whipped Cream | obliterator | cream | 3x any cream | 1x any sugar |  |  |  | Beaten until it holds a peak and stopped precisely one stroke before it would not. Everything about this recipe is knowing when to quit. |
| 11 | Ice Cream | icebox |  | 3x any cream | 2x any sugar | 1x any egg |  |  | Churned while freezing so the ice never gets a chance to form properly. Stop stirring for long enough and you have made a sweet brick instead. |
| 12 | Browned Butter | skillet | oil | 3x any butter | 1x any spice |  |  |  | Cooked past melted until the solids toast and the whole pan smells of hazelnuts. Thirty seconds beyond that and it smells like a mistake instead. |
| 13 | Strained Yogurt | caidao | cream | 4x any yogurt | 1x any spice |  |  |  | Hung in cloth overnight until the liquid drains away and what remains will hold a shape. Half the volume and twice the everything. |
| 14 | Yogurt Marinade | caidao |  | 3x any yogurt | 1x any protein | 1x any spice | 1x any herb |  | Meat left sitting in seasoned yogurt overnight while the acid does quiet work on it. Nothing else tenderises this gently or this thoroughly. |

### Tier 2 — 14

| # | Name | Tool | Types | 1 | 2 | 3 | 4 | 5 | Description |
|---|---|---|---|---|---|---|---|---|---|
| 15 | Thicc Cream | pot | cream milk | 3x moo juice | 1x any liquid |  |  |  | Reduced over low heat until it is half the volume and twice the opinion. Moo juice specifically, because the thinner milks simply refuse to cooperate. |
| 16 | Refined Butter | pot | butter cream | 3x creamed cream | 1x any spice |  |  |  | Melted, skimmed, and the clear fat poured carefully off the solids beneath. It keeps almost forever and burns at a far higher heat, which is the entire point of the exercise. |
| 17 | Brie | cocotte | cheese fungus | 3x malk | 1x any fungus | 1x any spice |  |  | Surface-ripened until a bloom forms and the inside goes to liquid underneath it. Deliberately and carefully mouldy, which is a thing the roster evidently already knew. |
| 18 | Parmesan | cocotte | cheese fungus | 3x moo juice | 1x salt | 1x any liquid |  |  | Pressed hard, salted heavily, and then aged for longer than any other item in this lane. It is the only cheese here that is genuinely a long-term investment. |
| 19 | Kream | obliterator | cream milk | 3x thicc cream | 1x any sugar |  |  |  | Whipped with sugar until it stiffens into something that holds a shape indefinitely. The deliberate misspelling is the roster's problem and not this recipe's. |
| 20 | Dragon Juice Custard | vaporera |  | 3x dragon juice | 2x any egg | 1x any sugar |  |  | Steamed until it sets, and it sets considerably faster than it has any right to. The tongue stays faintly warm a full minute afterwards for reasons nobody has chased down. |
| 21 | Bug Juice Ice Cream | icebox |  | 3x bug juice | 2x any sugar | 1x any cream |  |  | Churned cold into something pale green that tastes far better than its name suggests. Every single person has to be told twice before they will try it. |
| 22 | Parmesan Crisps | skillet | crunch | 4x parmesan | 1x any herb |  |  |  | Grated into a dry pan in small piles and left alone until they fuse and go lacy. Two ingredients, and one of them is arguably unnecessary. |
| 23 | Baked Brie | cocotte |  | 2x brie | 1x **Fruit Jam** | 1x any crunch | 1x any bread |  | Baked in its own rind until the centre gives up entirely and floods the plate when cut, then finished with jam and something toasted while it is still moving. Timing it is guesswork and overshooting is barely even a problem. |
| 24 | Cheddar Soup | donabe |  | 4x cheddar | 1x **Vegetable Stock** | 1x any grain | 1x any crunch | 1x any onion | Melted into thickened stock until it sits somewhere between a soup and a sauce, then buried under something crisp so there is one thing in the bowl that is not soft. Deeply unfashionable and defended to the death by everyone who grew up on it. |
| 25 | Malk Shake | obliterator |  | 3x malk | 1x any sweet | 1x any gel |  |  | The cheap milk, blended thick, and honestly rather better for it. Nobody has ever ordered one ironically more than once. |
| 26 | Nutmeg Cream Sauce | skillet |  | 3x any cream | 2x nutmeg | 1x any onion | 1x any spice |  | Nutmeg is the thing that stops a cream sauce tasting like warm paint. Grate it in at the very end and never a moment before. |
| 27 | Kream Puffs | cocotte |  | 3x any bread | 2x kream | 1x any egg | 1x any sugar |  | Hollow shells baked until crisp and then filled only once completely cool. Fill them warm and you have produced a bag of sweet soup. |
| 28 | Moo Juice Panna | icebox |  | 3x moo juice | 1x **Berry Coulis** | 1x any gel | 1x any sugar |  | The richest ordinary milk set barely firm, turned out onto a cold plate and flooded with coulis so it sits in a ring of its own colour. It should wobble alarmingly and it should not survive being carried far. |

### Tier 3 — 8

| # | Name | Tool | Types | 1 | 2 | 3 | 4 | Description |
|---|---|---|---|---|---|---|---|---|
| 29 | Fat Paste | obliterator | butter cream paste | 3x refined butter | 2x thicc cream | 1x any spice |  | Clarified butter beaten back together with cream into something spreadable and obscene. It is not a good idea and it has never claimed to be one. |
| 30 | Devil Slick | pot | butter cream | 3x fat paste | 2x dragon juice | 1x any spice |  | Rendered down with dragon milk until it goes dark, thin and faintly hot to the touch. It fries harder than anything else in the kitchen and it browns things it was not aimed at. |
| 31 | Volatile Cuhream | icebox | cream milk | 3x kream | 2x dragon juice | 1x any spice |  | Held just above freezing while something in the dragon milk refuses to settle. It is stable for as long as it is cold and for no longer than that. |
| 32 | Velvet Yoggert | donabe | yogurt fungus | 3x basic yogert | 2x thicc cream | 1x any sugar |  | Cultured slowly at a temperature that somebody has to physically sit and watch. The reward is a texture that coats a spoon and declines to run off it. |
| 33 | Liquigurt | obliterator | yogurt liquid | 3x velvet yoggert | 2x malk | 1x any sugar |  | Thinned until it can be drunk rather than spooned, and then thinned slightly further. Somewhere between a yogurt and a beverage, and legally recognised as neither. |
| 34 | Collapsing Cream | obliterator |  | 3x volatile cuhream | 2x powdered sugar | 1x any spice |  | It whips in about four seconds and it collapses in about nine. Everything about serving this is a logistics problem rather than a cooking one. |
| 35 | Cheesy Bread | cocotte |  | 3x brie | 2x parmesan | 1x any bread | 1x any herb | The youngest cheese and the oldest baked in the same dish, where one floods and one fuses. They have nothing in common and the pot does not care. |
| 36 | Dragon Ice | icebox |  | 3x dragon juice | 2x kream | 1x any sugar | 1x any egg | Churned hard and frozen harder, and still faintly warm on the way down. The contradiction is the entire dessert and the kitchen has stopped apologising for it. |

### Tier 4 — 4

| # | Name | Tool | Types | 1 | 2 | 3 | 4 | 5 | 6 | Description |
|---|---|---|---|---|---|---|---|---|---|---|
| 37 | Patience Cheese | cocotte |  | 3x parmesan | 2x brie | 2x **Breadcrumbs** | 1x **Candied Nuts** | 1x **Fruit Jam** | 1x refined butter | The oldest cheese in the kitchen grated through crumbs and baked over the youngest until one fuses and the other floods, then finished with jam and candied nuts while the crust is still cracking. Nothing in it can be hurried, and every attempt to hurry it has produced something worse. |
| 38 | Slow Fire Cream | icebox |  | 3x dragon juice | 2x volatile cuhream | 1x **Caramel** | 1x **Candied Peel** | 1x rock candy | 1x nutmeg | Frozen hard, served frozen, and yet warm on the tongue a full minute after the last of it is gone, with caramel and candied peel set through it so the cold has something to break against. The kitchen stopped trying to explain this and started charging for it instead. |
| 39 | Potted Gold | skillet |  | 3x devil slick | 2x fat paste | 2x **Caramelised Onions** | 1x **Crisped Flank** | 1x tropea onion | 1x **Sea Salt** | Onions cooked down in the two richest fats the kitchen owns until everything collapses into one dark spoonful, packed into a pot with cracklings through it and sealed under a lid of its own set fat, then finished with flakes that crack against all that softness. It is barely a dish and almost entirely a decision, and it keeps for a month. |
| 40 | The Mother Culture | donabe |  | 3x liquigurt | 2x velvet yoggert | 1x **Berry Compote** | 1x **Toasted Nuts** | 1x dragon juice | 1x nutmeg | Three generations of the same living culture fed and folded into one another across a week, then buried under compote and nuts toasted hard enough to crack. It tastes powerfully of somewhere specific, and no two people have ever agreed on where. |

---

## FRUIT — Fruition

**40 recipes.**


### Tier 1 — 19

| # | Name | Tool | Types | 1 | 2 | 3 | 4 | Description |
|---|---|---|---|---|---|---|---|---|
| 1 | Berry Bowl | caidao |  | 3x any berry | 1x any cream | 1x any crunch | 1x any sugar | Berries, cream, sugar, and no further intervention of any kind whatsoever. The entire skill lies in not doing anything else to them. |
| 2 | Berry Coulis | obliterator | liquid | 4x any berry | 1x any sugar |  |  | Blended and pushed through cloth until it runs clean and glossy. It goes over everything pale and makes all of it look deliberate. |
| 3 | Berry Compote | pot | sweet paste | 3x any berry | 2x any sugar | 1x any citrus |  | Cooked down with sugar until the fruit slumps without entirely surrendering. Somewhere short of jam and considerably more useful than jam. |
| 4 | Blistered Berries | skillet |  | 3x any berry | 1x any butter | 1x any spice |  | Thrown into a dry pan hot enough to pop the skins before the juice has time to run out of them. Thirty seconds, no sugar, and they come out tasting more like themselves than they went in. |
| 5 | Tropical Smoothie | obliterator |  | 3x any tropical | 1x any milk | 1x any gel |  | Blended thick enough that it must be eaten with a spoon and drunk with a straw simultaneously. A structural failure that absolutely everybody enjoys. |
| 6 | Tropical Salsa | caidao |  | 3x any tropical | 1x any pepper | 1x any onion | 1x any citrus | Diced small and hard, tossed with chilli and onion, and left twenty minutes to argue with itself. Fruit that has decided to be savoury, which offends people right up until they taste it. |
| 7 | Citrus Juice | obliterator | liquid | 4x any citrus | 1x any liquid |  |  | Squeezed and strained and served before the bitterness in the pith catches up. There is a window and it is roughly ten minutes wide. |
| 8 | Candied Peel | pot | crunch sugar | 3x any citrus | 3x any sugar |  |  | Peel simmered in syrup until it turns translucent and stops being bitter. It takes an entire day and produces about a handful. |
| 9 | Citrus Curd | pot | gel | 3x any citrus | 2x any egg | 1x any butter | 1x any sugar | Cooked gently with egg and butter until it thickens into something between a custard and a sauce. Overheat it and you have made citrus scrambled eggs. |
| 10 | Citrus Sorbet | icebox |  | 3x any citrus | 2x any sugar | 1x any liquid |  | Frozen and churned with nothing rich in it at all, which is exactly why it tastes so loud. Served between other things to reset the mouth. |
| 11 | Roasted Citrus | cocotte |  | 3x any citrus | 1x any oil | 1x any herb | 1x any spice | Halved and roasted until the cut faces caramelise and go jammy. Squeezed over other things afterwards, which was always the actual purpose. |
| 12 | Baked Orchard | cocotte |  | 4x any orchard | 1x any butter | 1x any sugar | 1x any spice | Cored, filled, and baked until the skins split and the insides turn to sauce. The dish that smells better than it tastes, which in this lane is a high bar. |
| 13 | Orchard Pie | cocotte |  | 4x any orchard | 2x any bread | 1x any butter | 1x any sugar | Fruit under a lid of pastry, baked until the vents run and the top goes hard and gold. There is a correct number of vents and nobody has ever known it. |
| 14 | Orchard Relish | pot |  | 4x any orchard | 2x any onion | 1x any spice | 1x any sugar | Cooked down with onion until the fruit gives up its shape and the whole pot goes sharp and dark. It exists to sit beside something fatty and it has never been the wrong answer to one. |
| 15 | Fresh Melon | caidao |  | 3x any rind | 1x any spice | 1x any herb |  | Cut off the rind, cut into blocks, salted lightly, and left cold. Salt on melon is not a mistake, and arguing about it is a rite of passage. |
| 16 | Melon Juice | obliterator | liquid | 4x any rind | 1x any citrus |  |  | Blended and strained into something so pale it looks like water and tastes like summer. It separates within the hour and must be drunk before it manages it. |
| 17 | Fruit Salad | caidao |  | 4x any fruit | 1x any crunch | 1x any citrus | 1x any herb | Everything in the bag, cut to the same size, tossed in acid so that nothing browns. The most honest recipe in this lane and it requires nothing but a knife. |
| 18 | Fruit Jam | pot | sweet paste | 4x any fruit | 3x any sugar | 1x any citrus |  | Cooked with sugar until it sets on a cold plate and not one minute longer. The test involves a saucer, something freezing, and a considerable amount of nerve. |
| 19 | Fruit Fool | obliterator |  | 3x any fruit | 2x any cream | 1x any sugar | 1x any crunch | Fruit crushed rough and folded through whipped cream just enough to streak it, never enough to mix it. Stirring it properly is the only way to ruin it and everyone is tempted. |

### Tier 2 — 11

| # | Name | Tool | Types | 1 | 2 | 3 | 4 | 5 | Description |
|---|---|---|---|---|---|---|---|---|---|
| 20 | Coconut Milk | obliterator | milk liquid | 4x coconut | 2x any liquid |  |  |  | Grated flesh steeped in hot water and then wrung out through cloth. It is the only milk in this entire document that never met an animal. |
| 21 | Banana Bread | cocotte |  | 4x banana | 2x any grain | 1x **Browned Butter** | 1x **Nut Butter** | 1x any sugar | The blacker the banana the better the loaf, which makes this the only recipe that rewards neglect this directly, and the butter goes in already cooked to hazelnut. Somebody in every party is quietly saving three bananas for exactly this. |
| 22 | Mango Sorbet | icebox |  | 4x mango | 1x **Coconut Milk** | 2x any sugar | 1x any citrus |  | Blended and frozen with barely anything added, because it needs barely anything, and loosened with coconut milk so it scoops instead of shattering. Deep orange, faintly stringy, worth the mess. |
| 23 | Cherry Pie | cocotte |  | 4x cherry | 2x any bread | 1x **Berry Compote** | 1x any butter | 1x any sugar | Pitted one at a time, which is the entire reason this is not made more often, and bulked out with compote so the filling sets instead of flooding. It stains the pastry through, which is how you know it is right. |
| 24 | Grilled Watermelon | hibachi |  | 4x watermelon | 1x **Crisped Flank** | 1x any oil | 1x any spice |  | Thick wedges over coals until they collapse into something dense and almost meaty, then scattered with cracklings while still too hot to hold. Salt, fat and fruit is an old trick and it has never once stopped working. |
| 25 | Pomelo Salad | caidao |  | 3x pomelo | 1x **Crisped Flank** | 1x any crunch | 1x any herb |  | Segments broken apart by hand into loose pink threads and tossed with cracklings and something crisp, so that every mouthful has three separate textures in it. The pith is thick and getting rid of it is most of the work. |
| 26 | Green Papaya | caidao |  | 4x papaya | 1x any crunch | 1x any citrus | 1x any spice |  | Shredded before it ripens, while it is still firm and faintly bitter. An entirely different ingredient from the ripe version and better in every savoury context. |
| 27 | Currant Buns | cocotte |  | 3x currants | 2x any bread | 1x **Candied Peel** | 1x any butter | 1x any milk | Studded through enriched dough with candied peel worked in beside them, then baked until the fruit catches at the surface. The scorched currants on top are the best ones and the argument about them never ends. |
| 28 | Honeydew Granita | icebox |  | 4x honeydew | 2x **Melon Juice** | 1x any sugar | 1x any citrus |  | Flesh and pressed juice frozen together and raked apart, so the same melon arrives as both shards and syrup. Restrained to the point of seeming like a mistake, right up until it is not. |
| 29 | Apple Sauce | obliterator |  | 4x apple | 1x any sugar | 1x any spice |  |  | Cooked to collapse and blended smooth, and sharper than any shop version because you choose the sugar. It sits beside rich meat and pretends that is a coincidence. |
| 30 | Nutmeg Pear Poach | pot |  | 4x pear | 2x nutmeg | 1x **syrup** | 2x any liquid |  | Poached whole in syrup with the stems left on, until they turn translucent and stand upright on the plate. Nutmeg and pear is one of those pairings nobody needed to discover twice. |

### Tier 3 — 6

| # | Name | Tool | Types | 1 | 2 | 3 | 4 | 5 | Description |
|---|---|---|---|---|---|---|---|---|---|
| 31 | Snowed Melon | icebox |  | 3x honeydew | 2x **Citrus Curd** | 1x **Melon Juice** | 1x any sugar |  | Juice pressed from the melon, frozen hard and shaved into drifts back over the flesh it came from, with sharp curd hidden underneath. The two never meet until a spoon makes them, and the whole thing collapses about a minute after it arrives. |
| 32 | Steamed Coconut Pudding | vaporera |  | 3x **Coconut Milk** | 2x mango | 1x any grain | 1x any sugar |  | Coconut milk thickened with grain and steamed under a lid until it sets just firm enough to hold a spoonprint, with mango laid over while it is still warm. The pudding declines to compete with the fruit, which is the only reason the fruit agrees to show up. |
| 33 | Cherry Trifle | icebox |  | 4x cherry | 2x **Custard** | 1x **Berry Compote** | 1x any cream | 1x any bread | Bread soaked through with compote and layered wet with custard and cream, then left overnight until the layers stop being layers. It is built cold and improves entirely by being ignored. |
| 34 | Citrus, Three Ways | caidao |  | 3x pomelo | 1x **Citrus Curd** | 1x **Candied Peel** | 1x any oil |  | Raw segments, a spoonful of curd and a scatter of candied peel, so that the same fruit arrives sharp, rich and crunchy inside a single mouthful. Nothing on the plate came from anywhere else. |
| 35 | Blistered Grapes | cocotte |  | 4x grapes | 2x parmesan | 1x **Browned Butter** | 1x any herb |  | Roasted hard until the grapes burst and the cheese fuses to the pan beneath them, then finished with butter cooked all the way to hazelnut. An unlikely pairing that stops being unlikely after precisely one mouthful. |
| 36 | Pressed Watermelon | caidao |  | 4x watermelon | 3x salt | 1x **Citrus Juice** | 1x any herb |  | Salted heavily and weighted for an hour until it surrenders its water and the flesh goes dense and almost meaty, then dressed with juice at the last second. Somewhere in the second hour it stops tasting like melon and starts tasting like something else entirely. |

### Tier 4 — 4

| # | Name | Tool | Types | 1 | 2 | 3 | 4 | 5 | 6 | Description |
|---|---|---|---|---|---|---|---|---|---|---|
| 37 | Midsummer Frost | icebox |  | 3x honeydew | 2x yuzu | 2x **pure water** | 1x **Candied Peel** | 1x **Citrus Juice** | 1x powdered sugar | Frozen flat and raked every twenty minutes for hours into shards so fine they are gone before they reach the back of the mouth, then scattered with peel candied until it snaps. It tastes like the one afternoon a year when nothing hurts and nothing is owed to anybody. |
| 38 | Nightfall Preserve | pot |  | 3x elderberry | 2x **Berry Compote** | 2x plum | 1x **syrup** | 1x **Citrus Juice** | 1x yuzu | Compote cooked down a second time with fresh fruit and syrup across a full day, until it is nearly black and thick enough to stand a spoon in. A single spoonful outlasts the meal it came with and most of the conversation after it. |
| 39 | Ninety Seconds | wok |  | 4x papaya | 2x **devil slick** | 1x **Pepper Paste** | 1x **Toasted Nuts** | 1x heat pepper | 1x yuzu | Green papaya into screaming fat with chilli paste, finished with citrus and a fistful of nuts thrown in at the last possible moment. It is named for exactly how long you have, and the kitchen keeps a bell for it. |
| 40 | Castaway Custard | cocotte |  | 3x coconut | 2x **Coconut Milk** | 2x mango | 1x **Caramel** | 1x papaya | 1x rock candy | Milk pressed from the same coconut, set with fruit into a custard and baked back inside its own shell until the top blisters, then hidden under a lid of hard caramel. It is absurd, it is enormous, and nobody has ever finished one without help. |

---

## SWEET — Confection Convection

**40 recipes.**


### Tier 1 — 19

| # | Name | Tool | Types | 1 | 2 | 3 | 4 | 5 | Description |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Syrup | pot | liquid sugar | 3x any sugar | 2x any liquid |  |  |  | Sugar and water held at a boil until it thickens and threads off the back of a spoon. It is the base of nearly every sweet thing that follows and it takes four minutes. |
| 2 | Gummy Rings | icebox | gummy | 3x any jelly | 2x any sugar | 1x any citrus |  |  | Slime cooked down with sugar, poured into moulds, and set cold until it bounces. Nobody eating these wants to hear where the slime originally came from. |
| 3 | Caramel | skillet | sugar liquid | 3x any sugar | 1x any butter | 1x any cream | 1x **Sea Salt** |  | Sugar cooked dry in a wide pan until it goes amber, stopped with fat before it goes black, and scattered with flakes while it is still moving. The window between caramel and charcoal is about eight seconds wide, and the salt is what keeps the sweetness from being the only thing there. |
| 4 | Brittle | pot | crunch | 3x any sugar | 2x any seed | 1x any butter |  |  | Molten sugar poured flat over nuts and left to set into a single sheet. Breaking it up is the best part and there is no wrong way to go about it. |
| 5 | Sugar Glass | pot | crunch | 4x any sugar | 1x any citrus | 1x any liquid |  |  | Boiled well past syrup with a squeeze of acid to stop it crystallising, then poured thin onto a cold surface where it sets clear and lethal. It shatters into edible shards and every one of them is a hazard. |
| 6 | Sweet Dough Fry | wok |  | 2x any sugar | 2x any grain | 1x any egg | 1x any oil |  | Dough dropped into hot oil and rolled in sugar the moment it comes back out. Best eaten standing beside the pot with no plate involved at any stage. |
| 7 | Plain Cake | cocotte |  | 3x any sugar | 2x any grain | 2x any egg | 1x any butter |  | Sugar, flour, egg, butter, and no cleverness whatsoever. Every cake anybody makes is this one with something else added to it. |
| 8 | Slime Pudding | icebox |  | 3x any jelly | 1x any milk | 1x any sugar | 1x any spice |  | Set cold into something that holds a shape and wobbles under the spoon. This is the dish that convinced everybody slime was food, which took some considerable doing. |
| 9 | Boiled Slime Sweets | pot |  | 3x any jelly | 3x any sugar | 1x any herb | 1x any spice |  | Cooked hard, cooled fast, and cut into pieces that stick to teeth for hours afterwards. Herb and spice rather than fruit, because a boiled sweet has to taste of something that survives the heat. |
| 10 | Slime Foam | obliterator | gel | 4x any jelly | 1x any sugar | 1x any egg |  |  | Whipped until it triples in volume and then holds a peak indefinitely. Physically improbable and structurally load-bearing in half the desserts below it. |
| 11 | Melted Chocolate | donabe | liquid | 4x any chocolate | 1x any cream | 1x any butter |  |  | Melted slowly over the gentlest heat available and stirred until it turns glossy. Rush it and it seizes into something grainy that no amount of stirring recovers. |
| 12 | Hot Chocolate | pot |  | 3x any chocolate | 2x any milk | 1x any sugar | 1x any spice |  | Melted directly into hot milk rather than stirred in as a powder, which is the entire difference. Thick enough that a spoon leaves a trail behind it. |
| 13 | Chocolate Cake | cocotte |  | 3x any chocolate | 2x any grain | 2x any egg | 1x any butter |  | Baked until the middle is barely set and the top has cracked all the way across. Underbaking it slightly is not a mistake; it is the recipe. |
| 14 | Chocolate Truffles | caidao |  | 3x any chocolate | 2x any cream | 1x any sugar |  |  | Rolled by hand into rough spheres and dusted before they have a chance to melt. They are supposed to be ugly and the ugly ones genuinely taste better. |
| 15 | Chocolate Mousse | obliterator |  | 3x any chocolate | 2x any egg | 1x any cream | 1x any sugar |  | Whipped and folded until it holds air, then set cold for several hours. Folding too hard undoes every bit of the work in about ten seconds. |
| 16 | Snap Cookies | cocotte | crunch | 3x any grain | 2x any sugar | 1x any butter | 1x any spice |  | Stiff dough rolled thin, chilled hard, and cut into whatever shape the kitchen owns a cutter for. It snaps rather than bends, which is the entire difference and the reason it travels. |
| 17 | Shortbread | cocotte |  | 3x any butter | 2x any grain | 1x any sugar |  |  | Three ingredients, more butter than flour, and nothing in it that could rise even if asked. Bake it pale — colour is a mistake here and nowhere else. |
| 18 | Drop Cookies | cocotte |  | 2x any sugar | 2x any grain | 1x any egg | 1x any butter | 1x any crunch | Dropped in rough spoonfuls, studded with something that shatters, and pulled out while the middles still look wrong, because they go on setting after they leave the heat. Everybody holds a fixed opinion about the correct degree of underdone and everybody is wrong except themselves. |
| 19 | Sweet Crumble | cocotte |  | 2x any sweet | 2x any fruit | 1x any seed | 1x any butter |  | Fruit under a rubble of butter, sugar and nuts, baked until the top golds and the bottom bubbles up the sides. It is a pie for people who cannot make pastry. |

### Tier 2 — 10

| # | Name | Tool | Types | 1 | 2 | 3 | 4 | Description |
|---|---|---|---|---|---|---|---|---|
| 20 | Rock Candy | icebox | sugar crunch | 4x cane sugar | 2x any liquid |  |  | Supersaturated syrup left with a string in it for a week while crystals grow unattended. The only recipe in this document where waiting is the entire method. |
| 21 | Powdered Sugar | obliterator | sugar spice | 4x rock candy | 1x any grain |  |  | Ground to dust with a little grain worked in to stop it clumping in the damp. It gets on everything within reach and stays there for days. |
| 22 | Earthen Circle | icebox | gummy spice | 3x leftover slime | 2x any sugar | 1x any herb |  | Set into dark rings with something bitter and rooty worked all the way through. A sweet that tastes of soil on purpose, and it has defenders. |
| 23 | Sandwich Cookies | icebox |  | 3x **Snap Cookies** | 2x kream | 1x **Fruit Jam** |  | Two thin cookies with cream and jam pressed between them, left cold until the filling stops trying to escape out of the sides. The correct ratio is more filling than anybody thinks is wise. |
| 24 | Rolled Sponge | cocotte |  | 3x any grain | 2x **Whipped Cream** | 1x **Fruit Jam** | 1x any egg | Baked flat and thin, turned out while still hot and rolled up inside cloth so it learns the shape before it cools. Unroll it cold, fill it, roll it back — done in the wrong order it cracks the whole way down and there is no hiding that. |
| 25 | Syrup Cake | cocotte |  | 4x syrup | 2x any grain | 2x any egg | 1x any butter | Soaked in syrup while still hot from the pot so that it drinks the lot. Dense, sticky, and impossible to slice cleanly with any knife. |
| 26 | Fudge | pot |  | 3x cane sugar | 2x any cream | 1x any chocolate | 1x any butter | Boiled to exactly one temperature and then beaten hard while it cools, which is what forces the crystals small enough to read as silk instead of sand. Beat it a minute early and you have made grit that nobody will finish. |
| 27 | Nougat | pot |  | 3x **Slime Foam** | 2x any seed | 1x syrup | 1x any sugar | Foam beaten into boiling syrup until it stiffens past the point of pouring, then packed solid with nuts and pressed between sheets of paper overnight. It pulls at teeth and nobody has ever stopped at one piece because of that. |
| 28 | Chocolate Dipped | icebox |  | 3x **Melted Chocolate** | 2x any fruit | 1x any crunch |  | Anything dry enough to hold still, lowered into tempered chocolate and stood somewhere cold until the shell snaps under a thumb. The dipping takes four minutes and deciding what to dip takes considerably longer. |
| 29 | Slime Cordial | pot |  | 4x leftover slime | 1x **Citrus Juice** | 1x any sugar | 1x any liquid | The cheapest slime on the roster boiled down with citrus until it is thin enough to drink and sweet enough to want to. It is what gets poured when somebody asks for something cold and nobody wants to explain what is in it. |

### Tier 3 — 7

| # | Name | Tool | Types | 1 | 2 | 3 | 4 | Description |
|---|---|---|---|---|---|---|---|---|
| 30 | Blazing Spiral | pot | gummy spice | 3x cane sugar | 2x heat pepper | 1x any jelly |  | Sugar cooked with enough chilli that the heat arrives second and then stays third. The spiral shape is traditional and nobody remembers why. |
| 31 | Minty Dots | icebox | gummy spice | 3x rock candy | 2x minty herbs | 1x any jelly |  | Crushed candy set with mint into dots small enough to eat by the handful. Overdo the mint and you have manufactured a medicine instead. |
| 32 | Bitter Drinking Chocolate | donabe |  | 3x black cacao | 2x heat pepper | 1x **Nut Butter** | 1x any cream | Cacao melted down into cream with chilli and ground nut, which is how it was drunk for centuries before anybody thought to add sugar to it. The oldest recipe in the lane and it tastes exactly that old. |
| 33 | Slime Under Snow | icebox |  | 3x archaic slime | 2x powdered sugar | 1x **Citrus Curd** | 1x any fruit | Old slime set until it slices like glass, then buried under enough sugar to pass for snowfall, with a seam of sharp curd hidden underneath it. The contrast is the whole dish and both halves are load-bearing. |
| 34 | Shattered Yuzu Ice | icebox |  | 3x rock candy | 2x yuzu | 1x **Citrus Juice** | 1x any jelly | Crystals crushed to gravel through the sharpest citrus in the kitchen and frozen until they fuse back into a sheet, so it cracks and stings in the same mouthful. A palate cleanser that overcorrects magnificently. |
| 35 | Midnight Icebox Cake | icebox |  | 3x double dark cacao | 2x kream | 1x **Berry Compote** | 1x any bread | Severe cacao folded through sweetened cream and layered wet with biscuit overnight, until the biscuit stops being biscuit. The cream stops it being punishing and the compote stops it being solemn. |
| 36 | The Notorious | donabe |  | 3x putrid slime | 2x black cacao | 1x **Melted Chocolate** | 1x any spice | Cooked down with the darkest cacao in the kitchen until the smell reaches the floor above and everybody up there forms an opinion about it. Nobody has ever been neutral, and the people who like it like it violently. |

### Tier 4 — 4

| # | Name | Tool | Types | 1 | 2 | 3 | 4 | 5 | 6 | Description |
|---|---|---|---|---|---|---|---|---|---|---|
| 37 | The Quiet Dark | donabe |  | 3x black cacao | 2x double dark cacao | 2x kream | 1x **Browned Butter** | 1x **Toasted Nuts** | 1x heat pepper | The two darkest cacaos melted down with browned butter and cream and a whisper of heat underneath, then scattered with nuts toasted almost to burning. It is not sweet and it is not comforting, and people stop talking when they eat it. |
| 38 | Vindication Jelly | icebox |  | 3x archaic slime | 2x putrid slime | 2x **Sugar Glass** | 1x **Citrus Curd** | 1x rock candy | 1x yuzu | Two slimes nobody would touch separately, set clear as window glass with sugar shards suspended through them and a layer of curd beneath. This is the dish produced whenever somebody claims slime is not food, and it has never lost. |
| 39 | The Cathedral | pot |  | 4x rock candy | 2x cane sugar | 1x **Caramel** | 1x **Candied Peel** | 1x pure water | 1x powdered sugar | Sugar boiled hard, pulled, blown and assembled into a structure that has no business existing, with caramel run through the joints and candied peel set into the panes. It takes a day, it survives exactly one carry, and it is eaten by being broken. |
| 40 | Crossfire Ice | icebox |  | 3x blazing spiral | 2x minty dots | 2x kream | 1x **Caramel** | 1x black cacao |  | Heat, cold, mint, bitterness and burnt sugar set into one dish that cannot decide what it is doing to you. Every mouthful contradicts the one before it and nobody puts the spoon down. |

---

## SHARED — Pantry Paradise

**10 recipes.**


### Pantry — 10

| # | Name | Tool | Types | 1 | 2 | Description |
|---|---|---|---|---|---|---|
| 1 | Meaty Oil | pot | oil | 4x any meat | 1x any spice | Fat rendered out of trimmings over the lowest possible heat and strained clean. It carries the animal into everything it touches, which is either the whole point or the whole problem. |
| 2 | Fresh Oil | obliterator | oil | 4x any greens | 1x any herb | Greens crushed and pressed until they weep something violently green and grassy. It tastes of the field it came out of and it does not keep for long. |
| 3 | Dense Oil | obliterator | oil | 4x any seed | 1x any spice | Nuts crushed under weight until the oil runs and separates out. Heavier and slower-moving than any other oil here, and it fries hotter than all of them. |
| 4 | Fruity Oil | obliterator | oil | 4x any fruit | 1x any citrus | Pressed cold so that nothing in the fruit gets a chance to cook. Cloudy, green-gold, and best used somewhere it will never be heated. |
| 5 | White Oil | pot | oil | 4x any butter | 1x any liquid | Butter melted and held until the solids drop away and the fat above runs clear and pale. The most refined thing in the pantry and the most forgiving thing to cook with. |
| 6 | Candy Oil | pot | oil | 4x any sweet | 1x any liquid | Sugar and fat cooked together until they emulsify into something glossy and faintly wrong. Used only in desserts, and only by people who know exactly what they are doing. |
| 7 | Distilled Water | pot | liquid | 4x water |  | Boiled, caught as steam, and let fall back cold into a second vessel. It tastes of absolutely nothing at all, which is the entire specification. |
| 8 | Mineral Water | pot | liquid | 3x water | 2x any coral | Water held against coral until it takes up the minerals and goes faintly hard across the tongue. The only good reason to carry coral, and the kitchen is quietly relieved to have found one. |
| 9 | Pure Water | icebox | liquid | 4x distilled water |  | Frozen slowly, so that everything which is not water is pushed out ahead of the advancing ice. What remains when it melts is the cleanest thing in the game. |
| 10 | Sea Salt | pot | spice crunch | 4x mineral water |  | Mineral water boiled away to nothing across a full day, until all that is left in the pan is what the coral put into it, dried into flakes you can hear break. A handful costs a day and a great deal of fuel, which is why the coarse stuff still sells by the sack. |

---

## Component index

77 recipes are made in order to make something else. Each carries the tags below and remains edible in its own right.

| Component | Lane | Types |
|---|---|---|
| Mystery Meat Paste | protein | `paste` |
| Rib Broth | protein | `liquid` |
| Gel Stock | protein | `liquid` `gel` |
| Crisped Flank | protein | `crunch` |
| Toasted Grain | carb | `crunch` |
| Macaroni | carb | `noodle` |
| Roll | carb | `bread` |
| Toasted Nuts | carb | `crunch` |
| Nut Butter | carb | `butter` `paste` |
| Candied Nuts | carb | `crunch` |
| Breadcrumbs | carb | `crunch` |
| Linguini | carb | `noodle` |
| Loaf | carb | `bread` |
| Croissant | carb | `bread` |
| Soba | carb | `noodle` |
| Baguette | carb | `bread` |
| Tortellini | carb | `noodle` |
| Green Puree | vegetable | `paste` |
| Caramelised Onions | vegetable | `paste` |
| Carrot Puree | vegetable | `paste` |
| Pepper Paste | vegetable | `paste` `spice` |
| Tomato Sauce | vegetable | `liquid` `paste` |
| Candied Petals | vegetable | `crunch` |
| Mushroom Broth | vegetable | `liquid` |
| Vegetable Stock | vegetable | `liquid` |
| Tofu | vegetable | `sponge` `protein` |
| Cream | dairy | `cream` `milk` |
| Creamed Cream | dairy | `butter` `cream` |
| Cheddar | dairy | `cheese` `fungus` |
| Whipped Yogy | dairy | `yogurt` `fungus` |
| Cheese Sauce | dairy | `liquid` |
| Custard | dairy | `gel` |
| Whipped Cream | dairy | `cream` |
| Browned Butter | dairy | `oil` |
| Strained Yogurt | dairy | `cream` |
| Thicc Cream | dairy | `cream` `milk` |
| Refined Butter | dairy | `butter` `cream` |
| Brie | dairy | `cheese` `fungus` |
| Parmesan | dairy | `cheese` `fungus` |
| Kream | dairy | `cream` `milk` |
| Parmesan Crisps | dairy | `crunch` |
| Fat Paste | dairy | `butter` `cream` `paste` |
| Devil Slick | dairy | `butter` `cream` |
| Volatile Cuhream | dairy | `cream` `milk` |
| Velvet Yoggert | dairy | `yogurt` `fungus` |
| Liquigurt | dairy | `yogurt` `liquid` |
| Berry Coulis | fruit | `liquid` |
| Berry Compote | fruit | `sweet` `paste` |
| Citrus Juice | fruit | `liquid` |
| Candied Peel | fruit | `crunch` `sugar` |
| Citrus Curd | fruit | `gel` |
| Melon Juice | fruit | `liquid` |
| Fruit Jam | fruit | `sweet` `paste` |
| Coconut Milk | fruit | `milk` `liquid` |
| Syrup | sweet | `liquid` `sugar` |
| Gummy Rings | sweet | `gummy` |
| Caramel | sweet | `sugar` `liquid` |
| Brittle | sweet | `crunch` |
| Sugar Glass | sweet | `crunch` |
| Slime Foam | sweet | `gel` |
| Melted Chocolate | sweet | `liquid` |
| Snap Cookies | sweet | `crunch` |
| Rock Candy | sweet | `sugar` `crunch` |
| Powdered Sugar | sweet | `sugar` `spice` |
| Earthen Circle | sweet | `gummy` `spice` |
| Blazing Spiral | sweet | `gummy` `spice` |
| Minty Dots | sweet | `gummy` `spice` |
| Meaty Oil | shared | `oil` `liquid` |
| Fresh Oil | shared | `oil` `liquid` |
| Dense Oil | shared | `oil` `liquid` |
| Fruity Oil | shared | `oil` `liquid` |
| White Oil | shared | `oil` `liquid` |
| Candy Oil | shared | `oil` `liquid` |
| Distilled Water | shared | `liquid` |
| Mineral Water | shared | `liquid` |
| Pure Water | shared | `liquid` |
| Sea Salt | shared | `spice` `crunch` |

---

## Before this can ship

Four things are known-missing and none of them are recipe problems.

**No leavening agent exists in the roster.** Roll, Loaf, Baguette and Croissant all rise on nothing.
Shortbread and Oat Flatbread are the only baked goods that honestly need none.

**`any spice` accepts three gummies and powdered sugar**, because those items carry `<spice>` in the
database. Roughly sixty savoury slots can therefore be seasoned with mint candy, and nothing will
complain. Either the gummies lose the tag or savoury recipes name their spices.

**`any fungus` accepts eight dairy items** — every cheese and yogurt carries `<fungus>` for the mould
and the cultures. Vegetable's Fried Mushrooms will take four blocks of cheddar.

**Sea Salt is a new roster ingredient** and needs a row in `Items.json` plus a line in
`ingredient-sorting.md` under spice, marked `(cook)`.

## Still to build

- **~180 new `Items.json` rows** — every recipe whose output is not already a roster ingredient, each
  needing a name, an icon and a `<food:TYPE>` tag.
- **`config.crafting.json`** — 250 recipe rows, plus the seven food-lane categories replacing
  `cook-meal` and `cook-drink`.
- **24 custom states**, one per signature, plus the OTIB state ids they grant.
