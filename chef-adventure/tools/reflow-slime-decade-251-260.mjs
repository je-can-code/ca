/**
 * Reflow slime decade 251–260: shared MHP curve (flat “same tier” band) and
 * six linear growth tags summing to budget 40, with thematic splits per entry.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ENEMIES_PATH = path.resolve(__dirname, '../data/Enemies.json');

const MHP_B = 200;
const MHP_M = 3.4;
const MHP_F = 2.5;
const MHP_INNER = `(a.level ** ${MHP_F}) * ${MHP_M}`;

const SIX = ['atkBuffPlus', 'defBuffPlus', 'matBuffPlus', 'mdfBuffPlus', 'agiBuffPlus', 'lukBuffPlus'];

/** @type {Record<number, { ks: number[], note?: string }>} */
const BY_ID =
{
  251:
  {
    ks: [7, 9, 5, 6, 4, 9],
    note: 'Hard syrup: sticky bruiser — high def, modest mat, slow, tricky luk.',
  },
  252:
  {
    ks: [4, 5, 9, 8, 8, 6],
    note: 'Wet mousse (water): fluid magical skirmisher — mat/mdf/agi.',
  },
  253:
  {
    ks: [8, 11, 3, 5, 4, 9],
    note: 'Sandy pudding (earth): grit and bulk — atk/def front, low mat.',
  },
  254:
  {
    ks: [5, 6, 10, 9, 6, 4],
    note: 'Radiant flan (light): luminous caster — mat/mdf core.',
  },
  255:
  {
    ks: [5, 4, 9, 5, 12, 5],
    note: 'Blinking custard (thunder): flicker striker — agi/mat.',
  },
  256:
  {
    ks: [11, 8, 4, 4, 5, 8],
    note: 'Molten souffle (fire): scorching bruiser — atk first, def/luk second, mat/mdf/agi tertiary.',
  },
  257:
  {
    ks: [4, 8, 9, 9, 3, 7],
    note: 'Umbral molasses (dark): viscous caster-tank — mat/mdf, low agi.',
  },
  258:
  {
    ks: [6, 7, 7, 9, 5, 6],
    note: 'Crystalline candy: prismatic shell — mdf/mat/def balanced.',
  },
  259:
  {
    ks: [9, 5, 6, 6, 10, 4],
    note: 'Majestic meringue: lofty whip — atk/agi, lighter defenses.',
  },
  260:
  {
    ks: [5, 7, 8, 9, 6, 5],
    note: 'Godless glaze (ice): brittle freeze — mdf/mat, solid def.',
  },
};

function formatQuarter(n)
{
  const r = Math.round(n * 4) / 4;
  if (Number.isInteger(r)) return String(r);
  const s = r.toFixed(2);
  if (s.endsWith('0')) return s.slice(0, -1);
  return s;
}

function replaceTagLine(note, tag, inner)
{
  const normalized = String(note || '').replace(/\r\n/g, '\n');
  const lineRe = new RegExp(`^<${tag}:\\[[^\\]]*\\]>\\s*$`, 'm');
  const newLine = `<${tag}:[${inner}]>`;

  if (lineRe.test(normalized))
  {
    return normalized.replace(lineRe, newLine);
  }

  const lines = normalized.split('\n');
  let insertAt = 0;
  const famRe = /^<monsterFamilyIcon:51>\s*$/m;
  const idx = lines.findIndex(l => famRe.test(l.trimEnd()));
  if (idx >= 0) insertAt = idx + 1;
  else
  {
    const levelIdx = lines.findIndex(l => /^<level:/i.test(l.trimStart()));
    insertAt = levelIdx >= 0 ? levelIdx + 1 : 0;
  }

  lines.splice(insertAt, 0, newLine);
  return lines.join('\n');
}

function assertBudget(ks, id)
{
  const s = ks.reduce((a, b) => a + b, 0);
  if (Math.abs(s - 40) > 1e-9) throw new Error(`id ${id}: ks sum ${s}, expected 40`);
}

function main()
{
  const data = JSON.parse(fs.readFileSync(ENEMIES_PATH, 'utf8'));

  for (let id = 251; id <= 260; id++)
  {
    const cfg = BY_ID[id];
    if (!cfg) throw new Error(`Missing cfg for ${id}`);
    assertBudget(cfg.ks, id);

    const e = data[id];
    if (!e) throw new Error(`Missing enemy ${id}`);

    const newParams = e.params.slice();
    newParams[0] = MHP_B;
    newParams[1] = newParams[1] || 0;
    for (let i = 0; i < 6; i++)
    {
      newParams[2 + i] = Math.round(cfg.ks[i] * 4);
    }
    e.params = newParams;

    let note = e.note || '';
    note = replaceTagLine(note, 'mhpBuffPlus', MHP_INNER);
    for (let i = 0; i < 6; i++)
    {
      const tag = SIX[i];
      const inner = `(a.level * ${formatQuarter(cfg.ks[i])})`;
      note = replaceTagLine(note, tag, inner);
    }
    e.note = note;
  }

  const chunks = ['[\n'];
  for (let j = 0; j < data.length; j++)
  {
    const rowJson = data[j] === null ? 'null' : JSON.stringify(data[j]);
    chunks.push(j < data.length - 1 ? `${rowJson},\n` : `${rowJson}\n`);
  }
  chunks.push(']');
  fs.writeFileSync(ENEMIES_PATH, chunks.join(''));

  console.log('Slime 251–260: MHP', MHP_INNER, 'B=', MHP_B);
  for (let id = 251; id <= 260; id++)
  {
    const cfg = BY_ID[id];
    console.log(id, data[id].name, 'Σk=40', cfg.ks.join(','), '|', cfg.note);
  }
}

main();
