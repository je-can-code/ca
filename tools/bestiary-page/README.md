# Bestiary page

Every line in the bestiary against every area in play order, as a live page on the home network, at
**http://j-desktop.local:1220/bestiary** from any device at home. It reads the game fresh every time it is
opened, so a monster moved this morning is where it stands now.

## What it shows

- **One row per line**, with its five tiers' names and its named, and where the player first meets it.
- **One column per area** from the band table in `docs/maps/progression-bands.md`, in play order, with its
  level range.
- **A chip for every rung that stands in an area**, coloured by tier, with the lowest level there (a `+`
  when the spots disagree; hover for the range and the count). The filled chip is the first meeting.
- **The tally** of lines by the chapter they are first met in. Chapter 4 onward is a parallel set, so a
  line nobody meets before it counts as "chapter 4 on" rather than by area.
- **The legend's rung chips are switches.** All six start on. Click one to take that rung out of the grid,
  and double-click one to see only that rung; double-click it again to bring every rung back. The rows stay
  where they are while filtering, so an empty row means that line's rung stands nowhere. Scroll down and the
  legend pins to the top of the window with the whole grid sized to fit beneath it, so the switches and the
  grid are always on screen together.

It shows who each spot names. A spot's pool can also roll the tiers above that, by weight, and those rolls
are not drawn.

## How a visit gets to the screen

1. The browser asks the burndown's server for `/bestiary`, and gets `page.html`.
2. The page asks for `/bestiary/data`.
3. The server runs `bun tools/bestiary.js json`, which reads the band table and every map's placements,
   in about a tenth of a second.
4. The page draws what comes back. A tab left open reads the game again whenever it comes back into view.

## Where everything lives

| File | What it is |
|---|---|
| `page.html` | The whole page: its styles, markup and script |
| `../bestiary.js` | The bestiary. `json` feeds this page, and `first` prints the same first meetings as text |
| `../burndown-page/server.js` | The server that answers for both pages, on port 1220 |
| `../../docs/maps/progression-bands.md` | The band table: the areas, their order, their bands and chapters |

Editing the page or the bestiary needs no restart, since both are read fresh on every visit. A change to
the server does: `systemctl --user restart burndown`.
