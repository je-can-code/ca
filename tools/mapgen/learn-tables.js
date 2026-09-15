//region learn-tables
/**
 * Derives the autotile shape table from the maps the editor itself authored.
 *
 * An A2 ground tile's id is its kind's base plus a shape in 0..47, and which shape a square gets
 * depends on which of its eight neighbours share its kind. Writing that table from memory is how
 * a generator ends up producing maps whose coastlines are subtly wrong in a way nobody can name -
 * so it is not written from memory. Every shipped map is a worked example of the correct answer,
 * and there are two hundred thousand of them, so the table is measured instead.
 *
 * Two facts make the measurement clean. A corner only counts as a corner when both of its edges
 * are already joined, which collapses the 256 raw neighbourhoods to exactly 47 distinct states -
 * and all 47 appear in the shipped maps, so there is no gap to guess at. And out-of-bounds counts
 * as the same kind, which is why a map's border never draws a coastline.
 *
 * The remaining disagreement is around 2%, almost all of it shape 0 appearing where the rule says
 * otherwise: squares somebody placed by hand with shift-click. The majority answer is the rule.
 *
 * Re-run this after adding a tileset or a batch of hand-authored maps, then paste the printed
 * table into `autotile.js` if it moved.
 *
 * Usage: bun tools/mapgen/learn-tables.js
 */
import { DATA } from './paths.js';
import { canon, OFFSETS } from './autotile.js';

/**
 * The autotile kind an id belongs to, or -1 when the id is not an autotile at all.
 * @param {number} id The tile id.
 * @returns {number}
 */
const kindOf = id => id >= 2048 ? Math.floor((id - 2048) / 48) : -1;

/**
 * Whether a kind is an A2 ground autotile. A2 occupies kinds 16 through 47.
 * @param {number} kind The autotile kind.
 * @returns {boolean}
 */
const isA2 = kind => kind >= 16 && kind < 48;

const counts = {};
let maps = 0;

for await (const file of new Bun.Glob('Map*.json').scan(DATA))
{
  const map = JSON.parse(await Bun.file(`${DATA}/${file}`).text());

  // container nodes in the map tree are 0x0 and hold nothing to learn from.
  if (!map.width || !map.height) continue;

  maps++;
  const { width: w, height: h, data } = map;

  // A-tiles live on layers 0 and 1; B through E sheets are not autotiles and never reach here.
  for (let z = 0; z <= 1; z++)
  {
    const at = (x, y) => (x < 0 || y < 0 || x >= w || y >= h) ? null : data[(z * h + y) * w + x];

    for (let y = 0; y < h; y++)
    {
      for (let x = 0; x < w; x++)
      {
        const id = at(x, y);
        const kind = kindOf(id);
        if (!isA2(kind)) continue;

        let mask = 0;
        OFFSETS.forEach(([ dx, dy ], i) =>
        {
          const neighbour = at(x + dx, y + dy);
          if (neighbour === null || kindOf(neighbour) === kind) mask |= (1 << i);
        });

        const key = canon(mask);
        const shape = (id - 2048) % 48;
        ((counts[key] ||= {})[shape] ||= 0);
        counts[key][shape]++;
      }
    }
  }
}

const table = {};
let total = 0;
let agreed = 0;

for (const key of Object.keys(counts).map(Number).sort((a, b) => a - b))
{
  const ranked = Object.entries(counts[key]).sort((a, b) => b[1] - a[1]);
  total += ranked.reduce((sum, entry) => sum + entry[1], 0);
  agreed += ranked[0][1];
  table[key] = Number(ranked[0][0]);
}

console.log(`maps scanned: ${maps}`);
console.log(`canonical neighbourhoods seen: ${Object.keys(table).length} of 47`);
console.log(`distinct shapes chosen: ${new Set(Object.values(table)).size}`);
console.log(`agreement with the majority answer: ${(100 * agreed / total).toFixed(3)}% of ${total} tiles`);
console.log(`\nA2_SHAPE = ${JSON.stringify(table)}`);
//endregion learn-tables
