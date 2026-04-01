/**
 * Maps monster SDP panel keys onto enemies 101–600 in config order (same as sdp-grid-finalize).
 * Skips TUT / ENC / FGT.
 *
 * Drop % rules (ABS-friendly):
 * - New inserts (no prior tag): default 1%.
 * - Tiers 6–10: forced to 1% (scaffold / late-line panels).
 * - Enemies that first received a tag in the grid sync batch (no note tag before): 1%.
 * - Other tiers 1–5: preserve existing chance and optional item id.
 *
 * Run: node chef-adventure/tools/sdp-sync-enemy-notes.js
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const configPath = path.join(root, 'data', 'config.sdp.json');
const enemiesPath = path.join(root, 'data', 'Enemies.json');

const SKIP_PREFIX = new Set(['TUT', 'ENC', 'FGT']);

const SDP_TAG_RE = /<sdpDropData:\s*\[([A-Z0-9_]+),\s*(\d+)(?:,\s*(\d+))?\]>/i;

const DEFAULT_SDP_DROP_CHANCE = 1;

const INSERTED_SDP_TAG_ENEMY_IDS = new Set([
  372, 373, 374, 375, 376, 377, 378, 379, 380,
  514, 515, 516, 517, 518, 519, 520,
  561, 563,
]);

function tierFromSdpKey(key) {
  const m = key.match(/_(\d+)$/);
  if (!m) {
    return 0;
  }
  return parseInt(m[1], 10);
}

function monsterSdpKeysInOrder(cfg) {
  const keys = [];
  for (const p of cfg.sdps) {
    const m = p.key && p.key.match(/^([A-Z]+)_(\d+)$/);
    if (!m) {
      continue;
    }
    if (SKIP_PREFIX.has(m[1])) {
      continue;
    }
    keys.push(p.key);
  }
  return keys;
}

function buildTag(key, chance, itemId) {
  if (itemId !== undefined && itemId !== null && itemId !== '') {
    return `<sdpDropData:[${key}, ${chance}, ${itemId}]>`;
  }
  return `<sdpDropData:[${key}, ${chance}]>`;
}

function upsertSdpTag(note, key, defaultChance) {
  const m = note.match(SDP_TAG_RE);
  let chance = defaultChance;
  let itemId;
  if (m) {
    chance = parseInt(m[2], 10);
    if (m[3] !== undefined) {
      itemId = parseInt(m[3], 10);
    }
  }
  const tag = buildTag(key, chance, itemId);
  if (m) {
    return note.replace(SDP_TAG_RE, tag);
  }
  const levelMatch = note.match(/<level:\s*\d+>/i);
  if (levelMatch) {
    return note.replace(levelMatch[0], `${levelMatch[0]}\n${tag}`);
  }
  return `${note.trimEnd()}\n${tag}`;
}

function applyDropChanceRules(note, enemyId) {
  const m = note.match(SDP_TAG_RE);
  if (!m) {
    return note;
  }
  const key = m[1];
  const tier = tierFromSdpKey(key);
  let chance = parseInt(m[2], 10);
  let itemId;
  if (m[3] !== undefined) {
    itemId = parseInt(m[3], 10);
  }
  if (tier >= 6 || INSERTED_SDP_TAG_ENEMY_IDS.has(enemyId)) {
    chance = DEFAULT_SDP_DROP_CHANCE;
  }
  return note.replace(SDP_TAG_RE, buildTag(key, chance, itemId));
}

const cfg = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const keys = monsterSdpKeysInOrder(cfg);

if (keys.length !== 500) {
  console.error(`Expected 500 monster SDP keys, got ${keys.length}`);
  process.exit(1);
}

const enemies = JSON.parse(fs.readFileSync(enemiesPath, 'utf8'));

let updated = 0;
for (let id = 101; id <= 600; id++) {
  const enemy = enemies[id];
  if (!enemy) {
    console.error(`Missing enemy id ${id}`);
    process.exit(1);
  }
  const idx = id - 101;
  const panelKey = keys[idx];
  const hadTag = SDP_TAG_RE.test(enemy.note);
  let next = upsertSdpTag(enemy.note, panelKey, DEFAULT_SDP_DROP_CHANCE);
  next = applyDropChanceRules(next, id);
  if (next !== enemy.note) {
    enemy.note = next;
    updated++;
  }
  if (!hadTag) {
    SDP_TAG_RE.lastIndex = 0;
  }
}

fs.writeFileSync(enemiesPath, JSON.stringify(enemies, null, 2) + '\n', 'utf8');
console.log(`Wrote ${enemiesPath}; updated notes on ${updated} enemies (101–600).`);
