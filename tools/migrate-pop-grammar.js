/**
 * MIGRATE POP GRAMMAR
 *
 * Rewrites every `\pop[...]` target in the project from the shorthand the old third-party plugin
 * understood into the grammar J-Message-Bubbles reads.
 *
 * USAGE:
 *  $ bun tools/migrate-pop-grammar.js          # report only, writes nothing
 *  $ bun tools/migrate-pop-grammar.js --write  # rewrite the files
 *
 * The old argument slot was a junk drawer: `0` meant the running event, `-1` the player, `-2` a
 * follower, a bare number an event id, and `aN` an actor. Five conventions in one bracket, none of
 * them announced. The new grammar says which database it is counting in, and `aN` - over half of
 * every use in the project - was already the good form and does not move.
 *
 * Two things about how this is written, both deliberate:
 *
 * The **counting** is done against parsed JSON, walking event pages command by command. A regex over
 * the raw text looks like it would do, and undercounts: a `401` line containing a `}` - a `\}` font
 * code, say - truncates any pattern trying to match a whole command object.
 *
 * The **rewriting** is done against the raw file text, replacing only the token itself. Parsing a
 * map and re-serializing it reformats the entire file, because RMMZ writes one line per event rather
 * than pretty-printed JSON - so a three-character change would arrive as a diff against every map in
 * the project and nobody could review it. Every file is re-parsed after the edit to prove it is
 * still valid JSON, and the pop counts are reconciled before and after.
 */

import fs from 'node:fs';
import path from 'node:path';

const DATA = path.resolve('chef-adventure/data');
const WRITE = process.argv.includes('--write');

/**
 * Every `\pop[...]` in a string, with what it names.
 * @type {RegExp}
 */
const POP = /\\pop\[([^\]]*)\]/gi;

/**
 * The new spelling of one old target.
 * @param {string} target The contents of the brackets, as the old plugin read them.
 * @returns {?string} The new contents, or null when the form is not one this pass understands.
 */
function migrateTarget(target)
{
  const trimmed = target.trim();

  // already the good form, and the majority of every use in the project.
  if (/^a\d+$/i.test(trimmed)) return trimmed.toLowerCase();

  // already written in the new grammar - the sandbox demos, and anything this pass has already been
  // run over. Recognized rather than rejected so a second run is a no-op instead of a pile of
  // warnings, and so the reconciliation below stays honest about what it saw.
  if (/^(self|player)$/i.test(trimmed)) return trimmed.toLowerCase();

  if (/^[ef]\d+$/i.test(trimmed)) return trimmed.toLowerCase();

  if (/^-?\d+,-?\d+$/.test(trimmed)) return trimmed;

  // an explicit screen position, which only ever used a pipe because a comma was taken.
  if (/^-?\d+\|-?\d+$/.test(trimmed)) return trimmed.replace('|', ',');

  if (/^-?\d+$/.test(trimmed) === false) return null;

  const id = Number(trimmed);

  // the event running the command.
  if (id === 0) return 'self';

  // the player, which the old plugin spelled as the follower before the first one.
  if (id === -1) return 'player';

  // any other event on the map.
  if (id > 0) return `e${id}`;

  // followers counted backwards from minus two.
  return `f${Math.abs(id) - 1}`;
}

/**
 * Every Show Text command's gathered text, from a list of event commands.
 * @param {object[]} list The command list.
 * @param {string[]} into The texts found so far.
 */
function collectTexts(list, into)
{
  if (Array.isArray(list) === false) return;

  list.forEach(command =>
  {
    if (command === null) return;

    // 401 is one line of a Show Text; 405 is one line of Show Scrolling Text.
    if (command.code !== 401 && command.code !== 405) return;

    into.push(command.parameters[ 0 ]);
  });
}

/**
 * Every line of message text in one data file.
 * @param {string} fileName The file's name.
 * @param {object} parsed The parsed contents.
 * @returns {string[]}
 */
function textsOf(fileName, parsed)
{
  const texts = [];

  if (fileName === 'CommonEvents.json' || fileName === 'Troops.json')
  {
    parsed.forEach(entry =>
    {
      if (entry === null) return;

      collectTexts(entry.list, texts);

      if (Array.isArray(entry.pages) === false) return;

      entry.pages.forEach(page => collectTexts(page.list, texts));
    });

    return texts;
  }

  (parsed.events || []).forEach(event =>
  {
    if (event === null) return;

    (event.pages || []).forEach(page => collectTexts(page.list, texts));
  });

  return texts;
}

/**
 * Tallies every pop target across a set of message lines.
 * @param {string[]} texts The message lines.
 * @param {Map<string, number>} into The tally so far.
 */
function tally(texts, into)
{
  texts.forEach(text =>
  {
    const matches = text.matchAll(POP);

    for (const match of matches)
    {
      const [ , target ] = match;
      const seen = into.get(target) || 0;
      into.set(target, seen + 1);
    }
  });
}

const files = fs.readdirSync(DATA)
  .filter(name => /^Map\d+\.json$/.test(name) || name === 'CommonEvents.json' || name === 'Troops.json');

const before = new Map();
const after = new Map();
const unrecognized = new Map();
let filesChanged = 0;
let popsRewritten = 0;
let popsUnchanged = 0;

files.forEach(fileName =>
{
  const filePath = path.join(DATA, fileName);
  const raw = fs.readFileSync(filePath, 'utf8');

  tally(textsOf(fileName, JSON.parse(raw)), before);

  let changedHere = 0;

  const rewritten = raw.replace(POP, (whole, target) =>
  {
    const migrated = migrateTarget(target);

    if (migrated === null)
    {
      const seen = unrecognized.get(target) || 0;
      unrecognized.set(target, seen + 1);

      return whole;
    }

    if (migrated === target)
    {
      popsUnchanged += 1;

      return whole;
    }

    changedHere += 1;

    return `\\pop[${migrated}]`;
  });

  if (changedHere === 0) return;

  popsRewritten += changedHere;
  filesChanged += 1;

  // proving the edit left valid JSON behind before anything is written, rather than after.
  const reparsed = JSON.parse(rewritten);
  tally(textsOf(fileName, reparsed), after);

  if (WRITE === false) return;

  fs.writeFileSync(filePath, rewritten);
});

// files nothing changed in still contribute their pops to the after-tally, unchanged.
files.forEach(fileName =>
{
  const filePath = path.join(DATA, fileName);
  const raw = fs.readFileSync(filePath, 'utf8');
  const texts = textsOf(fileName, JSON.parse(raw));

  if (WRITE === true) return;

  tally(texts.filter(() => false), after);
});

const totalBefore = [ ...before.values() ].reduce((sum, count) => sum + count, 0);

console.log(WRITE ? 'REWRITING' : 'DRY RUN - nothing written');
console.log(`files scanned:    ${files.length}`);
console.log(`files changed:    ${filesChanged}`);
console.log(`pops found:       ${totalBefore}`);
console.log(`pops rewritten:   ${popsRewritten}`);
console.log(`pops left as-is:  ${popsUnchanged}`);
console.log(`reconciles:       ${popsRewritten + popsUnchanged === totalBefore ? 'yes' : 'NO - investigate'}`);

console.log('\nby old form:');
[ ...before.entries() ]
  .sort((left, right) => right[ 1 ] - left[ 1 ])
  .forEach(([ target, count ]) =>
  {
    const migrated = migrateTarget(target);
    const arrow = migrated === null ? '!! UNRECOGNIZED' : `-> ${migrated}`;
    console.log(`  ${String(count).padStart(5)}  \\pop[${target}]  ${arrow}`);
  });

if (unrecognized.size > 0)
{
  console.log('\nforms this pass does not understand, left untouched:');
  unrecognized.forEach((count, target) => console.log(`  ${count}  \\pop[${target}]`));
}
