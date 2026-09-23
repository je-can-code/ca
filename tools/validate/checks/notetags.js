/**
 * notetags — every tag in the database, map and event notes, checked two ways.
 *
 * **Resolution.** A tag whose payload names a row - `<drops:[a,ID,N]>`, `<enemyId:N>`, `<passive:[…]>`
 * - is a reference no writer in the loop checks. RPG Maker MZ moves and blanks rows without reading a
 * single note, and a tag naming a blank row is not an error, it is an effect that silently never
 * happens: 274 enemy drops once pointed at blank armor rows and dropped nothing. Which payload
 * position is an id, and which table it points into, comes from the manifest rmmz-plugins publishes
 * beside its build, because only the plugins know what a payload means.
 *
 * **Well-formedness.** A tag that matches no pattern any plugin declares parses as nothing, forever,
 * without a sound. A typo'd `<sght:5>` is the obvious case; a tag whose name is right but whose payload
 * the plugin's regex rejects - `<critReduction:-10>` where the pattern takes no sign - is the subtler
 * one. Both are reported.
 *
 * **The comment gate.** J-Base offers a map event's comment lines to plugins only when a line is one
 * whole tag drawn from a narrow character set - `J.BASE.RegExp.ParsableComment`. A line that fails it
 * is dropped before any regex runs, with no diagnostic, so a perfectly spelled tag with a stray `&` in
 * its label never arrives. The gate travels in the manifest, and a tag-carrying line it rejects is
 * reported as dropped.
 *
 * Only J-tag-shaped tokens are judged: `<name>` or `<name:payload>`, the name a single word. RPG Maker
 * and third-party plugins read tags with spaces in their names, and those are none of this check's
 * business.
 */

import { describeRow, RESOLVABLE_TABLES, resolveReference } from '../resolve.js';

/**
 * The manifest shape this check was written against.
 * @type {number}
 */
const MANIFEST_FORMAT_VERSION = 1;

/**
 * The database tables whose rows carry a `note`, and so can carry tags.
 * @type {string[]}
 */
const NOTE_TABLES = [
  'Actors',
  'Armors',
  'Classes',
  'Enemies',
  'Items',
  'Skills',
  'States',
  'Tilesets',
  'Weapons',
];

/**
 * A J-tag-shaped token: a single-word name, optionally followed by a colon and a payload.
 *
 * <pre>
 * Structure:
 *  <NAME> or <NAME:PAYLOAD>
 *
 * Example:
 *  <drops:[a,321,50]>
 *
 * Translation:
 *  name "drops", payload "[a,321,50]"
 * </pre>
 * @type {RegExp}
 */
const TAG_TOKEN = /<([A-Za-z][A-Za-z0-9_-]*)(?::([^<>]*))?>/g;

/**
 * How far a misspelled tag name may stray from a real one and still earn a suggestion.
 * @type {number}
 */
const SUGGESTION_DISTANCE = 2;

//region sources

/**
 * Every comment line in an event command list: each `108`, and each `408` continuing one.
 *
 * J-ABS reads enemy placements, AI overrides and most other map-side tags from event page comments,
 * never from the event's note, so a scan of notes alone would miss thousands of tags. Lines are kept
 * apart rather than joined into whole comments because that is how J-Base reads them: one line at a
 * time, each judged on its own.
 * @param {object[]} list The event commands.
 * @returns {string[]} Each comment line's text, in order.
 */
const commentLines = list => list
  .filter(command => command.code === 108 || command.code === 408)
  .map(command => command.parameters[0]);

/**
 * Every note and comment line in the project that can carry tags, labelled for a report.
 *
 * Each source records the table its row belongs to, which is what a `Self` target resolves against;
 * maps, events and comments belong to no table and record an empty one. Map event comment lines are
 * marked `gated`, because `Game_Event` drops any line that fails J-Base's comment gate before a plugin
 * ever sees it.
 * @param {object} project The loaded project.
 * @returns {{ where: string, text: string, table: string, gated: boolean }[]}
 */
export const collectTagSources = project =>
{
  const { tables, maps } = project;
  const sources = [];

  // database rows, each carrying its own table.
  NOTE_TABLES.forEach(table => tables[table].forEach(row =>
  {
    if (row && row.note) sources.push({ where: `${describeRow(table, row.id, row)} note`, text: row.note, table, gated: false });
  }));

  // maps, their events, and every comment line on every event page.
  [ ...maps.keys() ].sort((left, right) => left - right).forEach(mapId =>
  {
    const map = maps.get(mapId);
    const mapLabel = describeRow('Map', mapId, tables.MapInfos[mapId]);

    if (map.note) sources.push({ where: `${mapLabel} note`, text: map.note, table: '', gated: false });

    map.events.forEach(event =>
    {
      if (!event) return;

      const eventLabel = `${mapLabel} event #${event.id} "${event.name}"`;

      if (event.note) sources.push({ where: `${eventLabel} note`, text: event.note, table: '', gated: false });

      event.pages.forEach((page, index) => commentLines(page.list)
        .forEach(text => sources.push({ where: `${eventLabel} page ${index + 1} comment`, text, table: '', gated: true })));
    });
  });

  // common events and troop pages carry comments too, read by other paths than Game_Event's.
  tables.CommonEvents.forEach(commonEvent =>
  {
    if (!commonEvent) return;

    const label = `${describeRow('CommonEvents', commonEvent.id, commonEvent)} comment`;
    commentLines(commonEvent.list).forEach(text => sources.push({ where: label, text, table: '', gated: false }));
  });

  tables.Troops.forEach(troop =>
  {
    if (!troop) return;

    troop.pages.forEach((page, index) => commentLines(page.list)
      .forEach(text => sources.push({ where: `${describeRow('Troops', troop.id, troop)} page ${index + 1} comment`, text, table: '', gated: false })));
  });

  return sources;
};

//endregion sources

//region vocabulary

/**
 * Everything the manifest says about tags, arranged for lookup by name.
 *
 * Regex tags are looked up without regard to case, because the regex itself decides whether case
 * matters - most carry the `i` flag. Meta tags are kept exactly as spelled, because RPG Maker's native
 * `.meta` lookup is case-sensitive: `<NoToneChange>` is never seen by code reading `noToneChange`.
 * @param {object} manifest The parsed manifest.
 * @returns {{ patterns: Map<string, object[]>, metaTags: Set<string>, metaTagsByLowerName: Map<string, string>,
 *   targets: Map<string, object[]>, names: string[] }}
 */
const buildVocabulary = manifest =>
{
  const patterns = new Map();

  manifest.notetags.forEach(({ label, names, pattern, flags }) =>
  {
    // one match per token is all this check asks, so the stateful flags are dropped.
    const regex = new RegExp(pattern, flags.replace(/[gy]/g, ''));

    names.forEach(name =>
    {
      const key = name.toLowerCase();

      if (patterns.has(key) === false) patterns.set(key, []);
      patterns.get(key).push({ label, regex });
    });
  });

  const metaTags = new Set(manifest.metaTags);
  const metaTagsByLowerName = new Map(manifest.metaTags.map(name => [ name.toLowerCase(), name ]));
  const targets = new Map(Object.entries(manifest.idTargets).map(([ name, list ]) => [ name.toLowerCase(), list ]));

  // every spelling a suggestion could be drawn from.
  const names = [ ...new Set([ ...manifest.notetags.flatMap(entry => entry.names), ...manifest.metaTags ]) ];

  return { patterns, metaTags, metaTagsByLowerName, targets, names };
};

/**
 * The edit distance between two words, for suggesting what a misspelled tag meant.
 * @param {string} left One word.
 * @param {string} right The other.
 * @returns {number} How many single-character edits turn one into the other.
 */
const editDistance = (left, right) =>
{
  let previous = Array.from({ length: right.length + 1 }, (_, index) => index);

  for (let row = 1; row <= left.length; row++)
  {
    const current = [ row ];

    for (let column = 1; column <= right.length; column++)
    {
      const substitution = left[row - 1] === right[column - 1]
        ? 0
        : 1;

      current.push(Math.min(previous[column] + 1, current[column - 1] + 1, previous[column - 1] + substitution));
    }

    previous = current;
  }

  return previous[right.length];
};

/**
 * The known tag name closest to a misspelled one, if any is close enough to be worth suggesting.
 * @param {string[]} names Every known tag name.
 * @param {string} name The unrecognised name.
 * @returns {string} The suggestion, or empty when nothing is close.
 */
const suggestName = (names, name) =>
{
  const lowered = name.toLowerCase();

  let best = '';
  let bestDistance = SUGGESTION_DISTANCE + 1;

  names.forEach(candidate =>
  {
    const distance = editDistance(lowered, candidate.toLowerCase());

    if (distance < bestDistance)
    {
      best = candidate;
      bestDistance = distance;
    }
  });

  return best;
};

//endregion vocabulary

//region resolution

/**
 * Splits a payload into the values a target's position counts through.
 *
 * One pair of surrounding brackets is stripped and the rest split on commas, which is the shape every
 * id-bearing tag in the ecosystem uses: `[12, 100]`, `[3,4,5]`, or a lone `12`.
 * @param {string} payload The text after the tag's colon.
 * @returns {string[]}
 */
export const payloadValues = payload =>
{
  const trimmed = payload.trim();
  const unwrapped = trimmed.startsWith('[') && trimmed.endsWith(']')
    ? trimmed.slice(1, -1)
    : trimmed;

  return unwrapped.split(',').map(value => value.trim());
};

/**
 * Works out which table one target points into for this particular tag.
 * @param {string|object} table The target's table: a name, or a dispatch on another payload value.
 * @param {string[]} values The tag's payload values.
 * @param {string} sourceTable The table of the row carrying the tag, empty when there is none.
 * @returns {{ table: string, problem: string }} The table, or why none could be chosen.
 */
const chooseTable = (table, values, sourceTable) =>
{
  if (table === 'Self')
  {
    return sourceTable === ''
      ? { table: '', problem: 'names an id in its own table, but sits outside any database row' }
      : { table: sourceTable, problem: '' };
  }

  if (RESOLVABLE_TABLES.has(String(table))) return { table, problem: '' };

  // a dispatched table: another payload value picks the table by name.
  const selector = (values[table.byPosition] ?? '').toLowerCase();
  const chosen = Object.entries(table.cases).find(([ key ]) => key.toLowerCase() === selector);

  return chosen
    ? { table: chosen[1], problem: '' }
    : { table: '', problem: `picks its table with "${selector}", which names no table` };
};

/**
 * Every reason a recognised tag's ids fail to resolve.
 * @param {object} project The loaded project.
 * @param {object[]} targets The tag's id targets from the manifest.
 * @param {string} payload The tag's payload.
 * @param {string} sourceTable The table of the row carrying the tag, empty when there is none.
 * @returns {{ problems: string[], checked: number }} What failed, and how many ids were looked at.
 */
const resolveTag = (project, targets, payload, sourceTable) =>
{
  const values = payloadValues(payload);
  const problems = [];
  let checked = 0;

  targets.forEach(target =>
  {
    // an id that names something no table holds, such as a map region, is documented and skipped.
    if (target.table === null) return;

    const positions = target.position === 'each'
      ? values.map((_, index) => index)
      : [ target.position ];

    positions.forEach(position =>
    {
      // an optional value the author left off is simply absent, not wrong.
      if (position >= values.length) return;

      const { table, problem } = chooseTable(target.table, values, sourceTable);

      if (problem !== '')
      {
        problems.push(problem);

        return;
      }

      checked++;

      const unresolved = resolveReference(project, table, values[position], target);
      if (unresolved !== '') problems.push(`names ${unresolved}`);
    });
  });

  return { problems, checked };
};

//endregion resolution

/**
 * Judges one tag-shaped token: recognised or not, and if recognised, whether its ids resolve.
 * @param {object} project The loaded project.
 * @param {object} vocabulary What the manifest says about tags.
 * @param {RegExpMatchArray} match The token's match against {@link TAG_TOKEN}.
 * @param {string} sourceTable The table of the row carrying the tag, empty when there is none.
 * @returns {{ problems: string[], recognised: boolean, checked: number }}
 */
const judgeToken = (project, vocabulary, match, sourceTable) =>
{
  const [ token, name, payload = '' ] = match;
  const key = name.toLowerCase();
  const candidates = vocabulary.patterns.get(key) ?? [];

  // a regex tag is recognised when one of the patterns declared for its name accepts it whole.
  const isRegexTag = candidates.some(({ regex }) => regex.test(token));
  const isMetaTag = vocabulary.metaTags.has(name);

  if (isRegexTag || isMetaTag)
  {
    const { problems, checked } = resolveTag(project, vocabulary.targets.get(key) ?? [], payload, sourceTable);

    return { problems, recognised: true, checked };
  }

  // the name is right but the payload is not anything the plugin will parse.
  if (candidates.length > 0)
  {
    const labels = candidates.map(({ label }) => label).join(', ');

    return { problems: [ `matches none of the patterns declared for <${name}> (${labels})` ], recognised: false, checked: 0 };
  }

  // a meta tag spelled with the wrong case is a tag nothing will ever read.
  if (vocabulary.metaTagsByLowerName.has(key))
  {
    const spelling = vocabulary.metaTagsByLowerName.get(key);

    return { problems: [ `is read case-sensitively as <${spelling}>, so this spelling is never seen` ], recognised: false, checked: 0 };
  }

  const suggestion = suggestName(vocabulary.names, name);
  const hint = suggestion === ''
    ? ''
    : ` (did you mean <${suggestion}>?)`;

  return { problems: [ `matches no tag any plugin declares${hint}` ], recognised: false, checked: 0 };
};

/**
 * Checks every tag in the project against the manifest.
 * @param {object} project The loaded project.
 * @returns {{ findings: string[], summary: string }}
 */
export const checkNotetags = project =>
{
  const { manifest } = project;

  // without the manifest there is nothing to judge a tag against.
  if (!manifest) return { findings: [ 'no manifest to judge tags against; see the plugin drift findings' ], summary: 'skipped' };

  if (manifest.formatVersion !== MANIFEST_FORMAT_VERSION)
  {
    return {
      findings: [ `the manifest is format version ${manifest.formatVersion}, but this check reads version ${MANIFEST_FORMAT_VERSION}` ],
      summary: 'skipped',
    };
  }

  const findings = [];

  // a table the plugins publish but this validator was never taught is reported whether or not any
  // tag in the data uses it yet.
  Object.keys(manifest.idTables)
    .filter(table => RESOLVABLE_TABLES.has(table) === false)
    .forEach(table => findings.push(`the manifest names table "${table}", which tools/validate/resolve.js cannot resolve`));

  const vocabulary = buildVocabulary(manifest);
  const sources = collectTagSources(project);

  // one match per line is all the gate is asked, so its stateful flags are dropped too.
  const { label: gateLabel, pattern: gatePattern, flags: gateFlags } = manifest.commentLineGate;
  const gate = new RegExp(gatePattern, gateFlags.replace(/[gy]/g, ''));

  let tokens = 0;
  let recognised = 0;
  let checked = 0;
  let dropped = 0;

  sources.forEach(source =>
  {
    const matches = [ ...source.text.matchAll(TAG_TOKEN) ];
    tokens += matches.length;

    // a gated line carrying a tag that the gate rejects is never read at all, however well-formed.
    if (source.gated && matches.length > 0 && gate.test(source.text) === false)
    {
      dropped++;
      findings.push(`${source.where}: "${source.text}" never reaches a plugin; J-Base drops comment lines that fail ${gateLabel}`);

      return;
    }

    matches.forEach(match =>
    {
      const verdict = judgeToken(project, vocabulary, match, source.table);

      if (verdict.recognised) recognised++;
      checked += verdict.checked;

      verdict.problems.forEach(problem => findings.push(`${source.where}: ${match[0]} ${problem}`));
    });
  });

  return {
    findings,
    summary: `${tokens} tag(s) in ${sources.length} notes and comment lines, ${recognised} recognised, `
      + `${dropped} comment line(s) dropped by J-Base, ${checked} id(s) resolved`,
  };
};