# Burndown page

The Chef Adventure burndown as a live page on the home network, at **http://j-desktop.local:1220** from any
device at home. It counts the game fresh every time it is opened, so it is never older than the moment you
looked at it.

## How a visit gets to the screen

1. The browser asks the server for `/`, and gets `page.html`.
2. The page asks for `/data`.
3. The server runs `bun tools/burndown.js --json`. The counter reads `docs/content-complete.md` and measures
   the game's data, which takes about a second and a half.
4. The counter prints four datasets: every item on the list, the history, the new areas and the crafting
   supply. Today's count is added to the history in memory, and nothing is written.
5. The page works out the totals, the lanes, the line and the pace from those four, and draws everything. A tab
   left open counts again whenever it comes back into view.

## Where everything lives

| File | What it is |
|---|---|
| `server.js` | The Bun server on port 1220. `/` is the page, `/data` runs the counter. It also answers for the bestiary page at `/bestiary` (see `../bestiary-page/`) |
| `page.html` | The whole page: its styles, markup and script |
| `burndown.service` | The systemd user service that keeps the server running. Its comment has the install steps |
| `../burndown.js` | The counter. `--json` feeds this page, and `--write` records today in the history |
| `../../docs/content-complete.md` | The checklist the counter reads. Tick a box and the next visit shows it |
| `../../docs/content-complete-history.json` | One row per lane for each recorded day: the dots on the chart |

## Before you change it

- **The chart's dots come from the history, and only `--write` adds one.** A visit draws today as the line's
  last point without recording it, so a day nobody records leaves no dot behind.
- **The target date is the `target` constant in the page's `pace` calculation.** Move the date there.
- **Editing the page or the counter needs no restart**, since both are read fresh on every visit. A change to
  `server.js` does: `systemctl --user restart burndown`. Its log is `journalctl --user -u burndown`.
- **The port is 1220, the target date, because port 80 belongs to the recipes site.** A `.local` name can't
  carry a port of its own, so a prettier address means sharing port 80 with recipes.
- **The page started life as a hosted dashboard**, and its script keeps that shape: calculations declared with
  `dash.calc` and drawing done by `dash.draw`. The small `dash` object at the top of the script stands in for the
  runtime the dashboard used to supply.
