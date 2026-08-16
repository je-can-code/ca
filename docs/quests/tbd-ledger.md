# Townsfolk Quest TBD Ledger

> Written 2026-08-14, the day all 62 townsfolk quests were authored into `config.quest.json`
> (category `folk`, per-NPC keys). This is the list of everything those quests REFERENCE but do not
> DEFINE — every Maker's call, missing database row, and invented number. Check a chain's section
> here before building its events, so nothing surprises you mid-eventing. Delete entries as they
> get resolved; delete the file when it's empty.

## How the data was authored (context for everything below)

- Only things that exist in the database today are wired as `Fetch`/`Slay` with real ids. Everything
  else — event props, unbuilt enemies, "any cooked dish", choice-driven gathers — is
  `Indiscriminate`, completed by eventing. So a TBD below never blocks the quest DATA; it blocks the
  EVENTS.
- No folk quest uses `Quest`-type prerequisite objectives — chain gating is entirely event-side
  (switches/story state), per the docs' unlock notes. If any chain should instead be data-gated like
  the hunt waves, that's an addition to make before wiring.
- Rewards are not in quest data (the schema has no reward field) — all rewards are granted by
  events. Reward items marked "not in DB" below need database rows authored first.
- `recommendedLevel` values are ballparks derived from the story-canon leveling ladder; chapter tags
  are inferred from each doc's stated gates. Both are tunable freely — nothing references them.

## Global

- **Icons:** every folk quest, the `folk` category, and the `ch5` tag all sit at `iconIndex: 0`.
- **`main-008`** has `recommendedLevel: 0` (pre-existing; every other main is filled in).
- **`hunt-013`** is the pre-existing "Anomaly: TBD" placeholder (slay id 100 is a blank enemy row).
- **Hunting Lord extensions** (wave 4 "Deluge Safari", guild ranks) are NOT authored — they need the
  Deluge Plains named-enemy roster to exist first.
- **CE161–163 ("Journal 1/2/3") + CE31 "Recipes init"** are residue of the retired Recipe Journals —
  deletion candidates during the recipe-vendor work.

## Yelena (`yelena-001`–`005`)

- **Invented counts:** 6× Stonefur (001) and 3× Grimfang (002) — the docs said "some" and "a
  couple"; tune at will.
- **The design note needing ratification:** "no buried wound — Yelena is exactly what she appears
  to be" is flagged in her doc as a deliberate tonal call awaiting your yes.
- **003 Surf & Turf:** needs Seashell Shores TIME-gated tide-spawn gathering props; the recognition
  beat now references a *recipe page* (post-journal-retirement), and kitchen tier-up + Nana's Ledger
  basic tier trigger here.
- **004 The Matriarch:** the apex bearcat needs a NAME, a VENUE (deep Forest of Dreams vs Deluge
  Plains — Maker's call), an enemy row, and the Yelena temporary-ally battler (allyai tech).
- **005:** the Family Cookbook unlock mechanism (top-tier cooking) and Nana's Ledger premium tier —
  including how the Ledger composes with the study-shop vendor (suggested reading: Nana's Ledger IS
  the cooking lane of the study shop; your call, noted in her doc).

## Treis (`treis-001`–`003`)

- The ore and lumber CHOICE lists (which materials qualify) and the visual variant each choice
  produces for the lab's foundation/building.
- The lab construction stages on the vacant lot — Amy's chain watches this construction live, so
  the stages want to be visible states, not one flip.
- The "invent" JAFTING unlock (003's payoff) and moving her questgiving from inn to lab.

## Rich & Poor (`richpoor-001`–`010`)

- **Peter's farm canon ruling (doc OPEN, everything authored assumes option (a)):** (a) his own
  plot near Raevula / (b) he tends Millie's abandoned land / (c) other. Changes what Vanderslop can
  threaten and where 006's plots/potato interactions live.
- **The 4a money-killer interlock (PROPOSED, not ratified):** Frederick's probate freeze closes the
  tap, OR a standalone bad harvest-war gamble bankrupts him. Decide before wiring 007.
- **005:** the top-tier centerpiece dish (newly learnable at that chapter's kitchen tier) and the
  vanity farm map next to Peter's.
- **006:** potato plot interactions must yield item 311 (Brown Potato) for the Fetch to track; the
  optional TIME deadline (two in-game days) is unwired.
- **008:** Vanderslop's rock-bottom venue (doc suggests the Red Baron's darkest corner).
- **009:** the redemption/ruin fork's outcome storage — it feeds Frederick's succession AND the coda
  hire list.
- **010 The Deed:** 1,000,000G price is a playtest ballpark; the daily TIME-driven produce crate
  loop; hire availability (Peter always, Vanderslop redemption-path only).

## Cerak (`cerak-001`–`003`)

- **001:** the three sigils' map placements around Raevula, and which generalist SDP each parse
  rewards.
- **002:** the Crystalline Ravine dig camp map + the "survey-marked map secrets" after-effect.
- **003:** the whole Graveyard Unit build — four great gravestones, the four wordless Echo
  apparitions, the Mother-Sigil waking, and WHICH unique Panel cache it holds. Adjacency dialogue
  with Gilbert's chain if both have reached the graves (no hard gate either way).

## Gilbert (`gilbert-001`–`004`)

- **001:** the hostiles around the crates are Indiscriminate — could become a real Slay if you pick
  the mine enemy; the crate pile is an interact-prop (your ruling).
- **002:** the waystation camp map — the doc's implementation note: repurpose the ukelele-gated
  half's "dead end" tunnel into an exit (the old truncated mine half becomes the caravan route).
- **003:** the caravan graves site in the Desolate Graves; **Gilbert's one-liner at the graves is
  reserved for you to author — nobody else**; the stall memento; the "Naren Imports" premium stock
  list + best-in-game sell rates.
- **004:** the loop trail route; the "genuine Naren vacation brochure" flavor item (not in DB).

## Amy (`amy-001`–`003`)

- **001:** what counts as the firsthand proof (Stonefur hide = Yelena interlock, or basin sketch);
  which map secrets get marked (doc: a Suspicious Crack, a Durable Post spot).
- **002:** interlocks with `side-002` (the Nature-Lover already has a quest — decide whether Amy's
  ask reuses or extends it).
- **003:** the deep-entrance map marking (door only, never contents) + whisper-density escalation
  post-Nimbus.

## Silia (`silia-001`–`002`)

- **001:** the supplies (miner's rations, lamp oil, pearl salt) are NOT items — event props by
  design, or author items if you prefer a real Fetch.
- **002:** **the deep-shaft resolution is yours alone** (doc: "do not resolve cheaply") — what is
  found at/below the deep entrance, and her ending dialogue state. The **Miner's Charm** accessory
  (light-radius/darkness utility) does not exist in the DB.

## Nyancy (`nyancy-001`–`003`)

- **Cat's Grace** (small evasion/luck passive) needs a mechanism + DB row — how does a party learn
  a passive from a cat-woman? (State? Skill? SDP-adjacent?)
- The three audition scenes are pure eventing/comedy — no other blockers.

## Frederick (`frederick-001`–`003`)

- **001:** Wyatt's records content — this is where evidence for the OPEN Wyatt/Lucian origins
  thread (story-canon) lands, whatever you decide it says.
- **002:** the governance outcome space (Vanderslop redeemed vs rejected, a council, Frederick
  drafted) + how the player's involvement nudges it + town-wide dialogue state updates.
- **003:** West Wing player-housing scope (rest point, storage, trophy display — "scope to taste").

## Cecil (`cecil-001`–`002`)

- **001:** the guard/parry sparring minigame; the reward choice (guard-proficiency bump vs a small
  unique guard skill).
- **002:** the night patrol route (TIME), the night-only town secrets pointed out, and the
  post-succession formal recognition beat (interlocks with Frederick's outcome).

## Viktor (`viktor-001`–`004`) — THE RACE, missable side

- **001:** WHICH three blueprints from the /24 pool he assigns.
- **003:** the relic that forces the lesson — doc floats "one of the 57 named weapons laid on his
  bench"; pick it. **This quest is what saves Viskra; the game never says so.**
- **004:** the late-zone exotics list; the Soulcrystal synthesis recipe family in
  `config.crafting.json` (the ONLY recipes that consume named weapons live here); the named-weapon
  enhancement ("the new way") mechanics.
- **RACE mechanics (data is ready, events are everything):** order tracking between his chain and
  `viskra-004`, the MISSED marking of his remaining quests (their `missed` logs are already
  authored), the permanent Metal Petal closure state, and his full exit from the game.

## Viskra (`viskra-001`–`004`) — THE RACE, tragedy side

- **001/003:** her materials lists (modest mid-tier, then better/farther) and her shop line's three
  stock revisions.
- **004:** the exotics + THE STONE TABLET's location; both finale scenes are fully specced in her
  doc (tragedy: Claidheamh Soluis = `Weapons[8]`, verified real; averted: her masterwork item —
  name TBD, HER mark, not in DB).

## Mittens (`mittens-001`–`003`)

- What qualifies as each tribute tier ("an actual cooked dish" → "better" → "the finest you can
  craft") — likely food-chain tier gates; decide the thresholds.
- **Feline Favor** (small LUK passive) not in DB; the post-chain follow behavior + "sitting next to
  things worth noticing" markers.

## Satoru (`satoru-001`–`002`)

- **001:** the choice (tell him now vs take the letter in silence) — decide if/how it branches 002's
  opening.
- **002:** **his outcome is yours** (memorial in Raevula, staying, something else — doc: OPEN, the
  Maker's). The optional Kingdom heirloom accessory is not in DB. The expat cluster (royal at the
  pub, naren knight at the inn) resolves alongside — their dialogue states need updating together.

## Silver & Kayla (`silverkayla-001`–`003`)

- **002:** the night-grind scene (TIME) and the Jerald-almost-ruins-it beat.
- **003:** the trip's destination view (doc: "Lakeside? the cliffs?"); the **Promise Ring**
  accessory (paired-equip bonus OR party morale buff — "scope to taste") is not in DB.

## Leo (`leo-001`–`002`)

- **002 gates on Nimbus/Pride existing** (ch4 main content) — it's tagged ch4 but cannot be wired
  until the Pride fight is real. "Leo's Original" top-tier alchemy formulae line needs authoring.

## Alice (`alice-001`–`002`)

- **001:** the three reagents (cliffs / forest depths / "wherever you dare") — items or props; the
  rare-catalyst stock rotation.
- **002:** the hood's delivery is your call on DELIVERY, not truth (the truth is LOCKED: she's the
  v4 protagonist) — the authored data plays the option-(c) version (she says no; the friendship is
  the reveal; hood stays). The **Acolyte's Favor** unique catalyst is not in DB.

## Iris (`iris-001`–`003`)

- **001's after-effect is ENGINE WORK:** Monsterpedia/Omnipedia bestiary displaying drop
  percentages + SDP drop chances is a rmmz-plugins feature, not eventing. Flag for a plugin
  session.
- **002 gates on the succession thread** (Frederick 002 / Vanderslop collapse) and contains the
  one-time narrator device ("What Iris hears") — her doc marks it single-use, never to be reused.
- **003:** Gilbert's black market — the rare-accessory shop inventory and pricing (the second true
  gold sink alongside the farm deed).

## Fortuitus (`fortuitus-001`)

- The pixel-movement chase minigame (catching him IS the content).
- The five facts' actual text: escalating from "bearcats hate mint" → a real mechanic hint → a named
  anomaly location (Hunting Lord interlock) → **the quiet real one (free slot: a Nare mention, a
  Subterranean whisper, or whatever you want planted in the mouth of the one NPC nobody
  fact-checks)** → the free favorite (dumbest fact in the game, also true).
- The doc's dealer's-choice design option: ALL facts are true, including the absurd ones.
- Caught-fact logging ("somewhere reviewable" — codex/journal mechanism unpicked).
