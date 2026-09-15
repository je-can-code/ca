//region plan
/**
 * Prints a generated map as a text floor plan.
 *
 * `map-atlas plan` answers the same question for shipped maps, but a map still sitting in staging
 * is not in `MapInfos.json` yet and the atlas cannot see it. This reads staging first and falls
 * back to the database, so the same command works either side of an install.
 *
 * Usage: bun tools/mapgen/plan.js 363 372
 */
import { loadMap } from './paths.js';

/**
 * One character per ground kind, chosen so a plan reads as terrain at a glance: lowercase for
 * soft ground, uppercase for worked or gilded surfaces.
 * @type {Object<number, string>}
 */
const GLYPH = { 28: '.', 34: 'g', 27: 's', 45: 'G', 36: 'o', 43: '=', 26: '-', 20: ':', 16: 'g', 91: '#', 93: '#' };

const args = process.argv.slice(2);
const preferStaging = args.includes('--staged');

/**
 * Loads a map for printing, honouring the `--staged` flag.
 * @param {number} id The map id.
 * @returns {Promise<Object>}
 */
const load = id => loadMap(id, preferStaging);

const ids = args.filter(a => !a.startsWith('--')).map(Number);

if (ids.length === 0)
{
  console.log('usage: bun tools/mapgen/plan.js [--staged] <mapId> [mapId...]');
}

for (const id of ids)
{
  const map = await load(id);
  const { width: w, height: h, data } = map;
  const events = {};
  map.events.filter(Boolean).forEach(e => events[`${e.x},${e.y}`] = 'T');

  console.log(`\n=== Map${id} "${map.displayName}" ${w}x${h} ===`);

  let ruler = '    ';
  for (let x = 0; x < w; x++) ruler += x % 10 === 0 ? String(Math.floor(x / 10)) : (x % 5 === 0 ? '+' : '-');
  console.log(ruler);

  for (let y = 0; y < h; y++)
  {
    let row = String(y).padStart(3) + ' ';
    for (let x = 0; x < w; x++)
    {
      if (events[`${x},${y}`])
      {
        row += 'T';
        continue;
      }

      const tile = data[(0 * h + y) * w + x];

      // a zero on the ground layer is open sky, which is also what makes the square impassable.
      if (tile === 0)
      {
        row += ' ';
        continue;
      }

      row += GLYPH[Math.floor((tile - 2048) / 48)] ?? '?';
    }
    console.log(row);
  }

  console.log('  legend: . cloud  g grass  s sand  G gild  o stone  = gold  - pale  # wall  T transfer  (blank) sky');
}
//endregion plan
