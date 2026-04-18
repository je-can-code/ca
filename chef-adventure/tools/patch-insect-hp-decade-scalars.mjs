/**
 * Post-normalize HP tuning for insect block 401–450.
 * Scales MHP uniformly per decade: hp'(L) = s * (B + (L ** 2.5) * M) via B' = s*B, M' = s*M
 * (same exponent; tier order inside each decade unchanged).
 *
 * Targets (approximate on L100 curve):
 *   bees 0.5 — squishy swarms
 *   worms 1.33 — tougher burrowers
 *   solo 0.67 — lighter solo stalkers
 *   jumpers 1 — unchanged
 *   parasites 0.2 — very fragile carriers
 *
 * Run after normalize-decade-tiers for 401–450 if you re-derive those rows.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ENEMIES_PATH = path.resolve(__dirname, '../data/Enemies.json');

const MHP_LINE_RE = /^<mhpBuffPlus:\[([^\]]*)\]>\s*$/m;
const MHP_INNER_RE = /\(a\.level \*\* 2\.5\) \* ([0-9]+(?:\.[0-9]+)?)/i;

const DECADES =
[
  { from: 401, to: 410, s: 0.5, label: 'bees' },
  { from: 411, to: 420, s: 1.33, label: 'worms' },
  { from: 421, to: 430, s: 0.67, label: 'solo' },
  { from: 431, to: 440, s: 1, label: 'jumpers' },
  { from: 441, to: 450, s: 0.2, label: 'parasites' },
];

function roundHundredth(n)
{
  return Math.round(n * 100) / 100;
}

function formatM(m)
{
  const r = roundHundredth(m);
  if (Number.isInteger(r)) return String(r);
  return r.toFixed(2);
}

function scaleDecade(data, from, to, s, label)
{
  if (s === 1)
  {
    console.log(`${label}: skip (s=1)`);
    return;
  }
  for (let id = from; id <= to; id++)
  {
    const e = data[id];
    if (!e) throw new Error(`Missing enemy ${id}`);
    const note = String(e.note || '').replace(/\r\n/g, '\n');
    const m = note.match(MHP_LINE_RE);
    if (!m) throw new Error(`Enemy ${id} missing mhpBuffPlus line`);
    const inner = m[1];
    const mm = inner.match(MHP_INNER_RE);
    if (!mm) throw new Error(`Enemy ${id} unexpected mhp inner: ${inner}`);
    const M = parseFloat(mm[1]);
    if (Number.isFinite(M) === false) throw new Error(`Enemy ${id} bad M`);
    const B = Number(e.params[0]);
    const newB = Math.max(1, Math.round(B * s));
    const newM = roundHundredth(M * s);
    const newInner = `(a.level ** 2.5) * ${formatM(newM)}`;
    e.note = note.replace(MHP_LINE_RE, `<mhpBuffPlus:[${newInner}]>`);
    e.params[0] = newB;
  }
  console.log(`${label}: scaled B and M by ${s}`);
}

function main()
{
  const data = JSON.parse(fs.readFileSync(ENEMIES_PATH, 'utf8'));
  for (const { from, to, s, label } of DECADES)
  {
    scaleDecade(data, from, to, s, label);
  }
  const chunks = ['[\n'];
  for (let j = 0; j < data.length; j++)
  {
    const rowJson = data[j] === null ? 'null' : JSON.stringify(data[j]);
    chunks.push(j < data.length - 1 ? `${rowJson},\n` : `${rowJson}\n`);
  }
  chunks.push(']');
  fs.writeFileSync(ENEMIES_PATH, chunks.join(''));
  console.log('Wrote insect HP decade scalars to Enemies.json.');
}

main();
