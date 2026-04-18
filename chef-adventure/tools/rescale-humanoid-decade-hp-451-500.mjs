/**
 * Rescales MHP base (params[0]) and mhpBuffPlus multiplier M for enemies 451–500.
 *
 * Design (HP ≈ B + (L ** 2.5) * M; tier index t matches across decades: 451+t-1, …):
 * - Bull 451–460: ~+100% vs prior snapshot → ×2 on B and M.
 * - Orc 461–470: ~25% less than doubled bull → ×0.75 vs bull target = ×1.5 vs original bull snapshot.
 * - Thief 471–480: squishy → ×0.5 on prior thief B and M.
 * - Walker 481–490: beefiest → ×1.2 vs doubled bull = ×2.4 vs original bull snapshot (same tier).
 * - Clan 491–500: weaksauce swarm bodies → ×0.19 on prior clan B and M (×0.38 vs pre-pass snapshot, then halved again vs ghosty benchmark).
 *
 * Usage: node rescale-humanoid-decade-hp-451-500.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ENEMIES_PATH = path.resolve(__dirname, '../data/Enemies.json');

const MHP_RE = /<mhpBuffPlus:\[\(a\.level \*\* 2\.5\) \* ([0-9.]+)\]>/;

function roundHundredth(n)
{
  return Math.round(n * 100) / 100;
}

function formatMhpM(m)
{
  const r = roundHundredth(m);
  if (Number.isInteger(r)) return String(r);
  return r.toFixed(2);
}

function parseM(note)
{
  const m = String(note || '').match(MHP_RE);
  return m ? parseFloat(m[1]) : null;
}

function setMhpLine(note, m)
{
  const inner = `(a.level ** 2.5) * ${formatMhpM(m)}`;
  const lineRe = /^<mhpBuffPlus:\[[^\]]*\]>\s*$/m;
  const newLine = `<mhpBuffPlus:[${inner}]>`;
  const n = String(note || '').replace(/\r\n/g, '\n');
  if (lineRe.test(n) === false) throw new Error('mhpBuffPlus line missing or not single-line');
  return n.replace(lineRe, newLine);
}

function main()
{
  const apply = process.argv.includes('--apply');
  const data = JSON.parse(fs.readFileSync(ENEMIES_PATH, 'utf8'));

  const snap = {};
  for (let id = 451; id <= 500; id++)
  {
    const e = data[id];
    if (!e) throw new Error(`Missing enemy ${id}`);
    const B = Number(e.params[0]);
    const M = parseM(e.note);
    if (!Number.isFinite(B) || M === null) throw new Error(`Bad B/M for ${id}`);
    snap[id] = { B, M };
  }

  const bull = id => snap[id];

  const plan = [];

  for (let id = 451; id <= 460; id++)
  {
    const { B, M } = bull(id);
    plan.push({ id, B: Math.max(1, Math.round(B * 2)), M: roundHundredth(M * 2) });
  }

  for (let id = 461; id <= 470; id++)
  {
    const bId = id - 10;
    const { B, M } = bull(bId);
    plan.push({ id, B: Math.max(1, Math.round(B * 1.5)), M: roundHundredth(M * 1.5) });
  }

  for (let id = 471; id <= 480; id++)
  {
    const { B, M } = snap[id];
    plan.push({ id, B: Math.max(1, Math.round(B * 0.5)), M: roundHundredth(M * 0.5) });
  }

  for (let id = 481; id <= 490; id++)
  {
    const bId = id - 30;
    const { B, M } = bull(bId);
    plan.push({ id, B: Math.max(1, Math.round(B * 2.4)), M: roundHundredth(M * 2.4) });
  }

  for (let id = 491; id <= 500; id++)
  {
    const { B, M } = snap[id];
    plan.push({ id, B: Math.max(1, Math.round(B * 0.19)), M: roundHundredth(M * 0.19) });
  }

  const F = 2.5;
  function hpAt(Bv, Mv, L)
  {
    return Math.round(Bv + Math.pow(L, F) * Mv);
  }

  const anchors = [1, 10, 100];
  for (const L of anchors)
  {
    const t1 = (label, id) =>
    {
      const p = plan.find(x => x.id === id);
      return { label, hp: hpAt(p.B, p.M, L) };
    };
    const rows = [
      t1('bull451', 451),
      t1('orc461', 461),
      t1('thief471', 471),
      t1('walker481', 481),
      t1('clan491', 491),
    ];
    console.log(`L=${L}`, rows.map(r => `${r.label}=${r.hp}`).join(' | '));
  }

  if (apply === false)
  {
    console.log('Dry run. Pass --apply to write Enemies.json');
    return;
  }

  for (const p of plan)
  {
    const e = data[p.id];
    const p0 = e.params.slice();
    p0[0] = p.B;
    e.params = p0;
    e.note = setMhpLine(e.note, p.M);
  }

  const chunks = ['[\n'];
  for (let j = 0; j < data.length; j++)
  {
    const rowJson = data[j] === null ? 'null' : JSON.stringify(data[j]);
    chunks.push(j < data.length - 1 ? `${rowJson},\n` : `${rowJson}\n`);
  }
  chunks.push(']');
  fs.writeFileSync(ENEMIES_PATH, chunks.join(''));

  console.log('Wrote rescale-humanoid-decade-hp-451-500');
}

main();
