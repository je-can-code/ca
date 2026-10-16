/**
 * scripts — no event script spreads its arguments into a call.
 *
 * A Script command is JavaScript that MZ stores as text and runs as written, against whatever the
 * plugins define at that moment. Nothing reads it before then: MZ never parses it, and rmmz-plugins'
 * gates never see Chef Adventure's events. So when a plugin changes the shape of a method, a script
 * calling it the old way keeps doing so until a player gets there.
 *
 * A spread is the old way that can be spotted mechanically. rmmz-plugins takes no rest parameters
 * (`verify:no-rest-parameters`), so a method that once gathered `...categoryKeys` now takes one array,
 * and a script still spreading its values into it hands over the first value as the whole list and
 * drops the rest. That is how common event 106 came to throw the first time Viktor taught a lesson.
 * So a spread anywhere in a call's arguments is reported, because no J plugin method can receive one.
 * A spread into a builtin such as `Math.max` would be reported too; Chef Adventure's scripts have none.
 *
 * Spreads that build an array or an object are ordinary JavaScript and are left alone.
 */

import { describeRow } from '../resolve.js';

/**
 * The event command that opens a script with its first line.
 * @type {number}
 */
const SCRIPT_FIRST_LINE = 355;

/**
 * The event command carrying each further line of the script above it.
 * @type {number}
 */
const SCRIPT_MORE_LINE = 655;

/**
 * Every script a command list runs, its lines joined, with the index of the command that opens it.
 * @param {object[]} list The event commands.
 * @returns {{ index: number, text: string }[]}
 */
const listScripts = list =>
{
  const scripts = [];

  list.forEach((command, index) =>
  {
    if (command.code === SCRIPT_FIRST_LINE) scripts.push({ index, text: command.parameters[0] });

    // MZ writes a continuation line straight after the line it continues, so it belongs to the last script.
    if (command.code === SCRIPT_MORE_LINE) scripts.at(-1).text += `\n${command.parameters[0]}`;
  });

  return scripts;
};

/**
 * Steps past a quoted string or a template literal.
 * @param {string} script The script's text.
 * @param {number} start The index of the opening quote.
 * @returns {number} The index just past the closing quote.
 */
const skipQuoted = (script, start) =>
{
  const quote = script[start];
  let index = start + 1;

  while (index < script.length && script[index] !== quote)
  {
    // a backslash carries the next character with it, so an escaped quote never closes the string.
    index += script[index] === '\\'
      ? 2
      : 1;
  }

  return index + 1;
};

/**
 * The name a call is made through: the identifiers and dots right before its opening bracket.
 *
 * A bracket with no name before it only groups, or opens an arrow function's parameters, and the
 * parameter list of a `function` declaration is no call either; all three come back empty.
 * @param {string} script The script's text.
 * @param {number} bracket The index of the `(`.
 * @returns {string} For example, `$gameParty.gainItem`.
 */
const calleeBefore = (script, bracket) =>
{
  let start = bracket;

  while (start > 0 && /[\w$.]/.test(script[start - 1])) start--;

  const name = script.slice(start, bracket);

  // `function (` and `function name(` both open a parameter list.
  const declaresParameters = name === 'function' || /\bfunction\s+$/.test(script.slice(0, start));

  return declaresParameters
    ? ''
    : name;
};

/**
 * The calls a script spreads arguments into, by the name each one is made through.
 *
 * Walks the script once, stepping over strings, template literals and comments, and keeps a stack of
 * the brackets it is inside. A `...` counts only when the innermost open bracket is a call's own: in a
 * `[` or a `{` it is building an array or an object, which is ordinary JavaScript.
 * @param {string} script The script's text.
 * @returns {string[]}
 */
const findSpreadCalls = script =>
{
  const open = [];
  const calls = [];
  let index = 0;

  while (index < script.length)
  {
    const character = script[index];
    const pair = script.slice(index, index + 2);

    // a line comment runs to the end of its line, and nothing in it is code.
    if (pair === '//')
    {
      const end = script.indexOf('\n', index);
      index = end === -1
        ? script.length
        : end;
      continue;
    }

    // a block comment runs to its closing mark.
    if (pair === '/*')
    {
      const end = script.indexOf('*/', index + 2);
      index = end === -1
        ? script.length
        : end + 2;
      continue;
    }

    // a string is text, whatever it says, so its "Loading..." is no spread.
    if (character === '\'' || character === '"' || character === '`')
    {
      index = skipQuoted(script, index);
      continue;
    }

    if (script.startsWith('...', index))
    {
      const innermost = open.at(-1);

      // only a call's own arguments can be spread into it.
      if (innermost && innermost.callee !== '') calls.push(innermost.callee);

      index += 3;
      continue;
    }

    if (character === '(') open.push({ callee: calleeBefore(script, index) });
    if (character === '[' || character === '{') open.push({ callee: '' });
    if (character === ')' || character === ']' || character === '}') open.pop();

    index++;
  }

  return calls;
};

/**
 * Every script an event runs, labelled for a report: map event pages, common events and troop pages.
 * @param {object} project The loaded project.
 * @returns {{ where: string, text: string }[]}
 */
const collectScripts = project =>
{
  const { tables, maps } = project;
  const scripts = [];

  // map events, page by page.
  [ ...maps.keys() ].sort((left, right) => left - right).forEach(mapId =>
  {
    const mapLabel = describeRow('Map', mapId, tables.MapInfos[mapId]);

    maps.get(mapId).events.forEach(event =>
    {
      if (!event) return;

      event.pages.forEach((page, index) => listScripts(page.list).forEach(({ index: command, text }) =>
        scripts.push({ where: `${mapLabel} event #${event.id} "${event.name}" page ${index + 1} command ${command}`, text })));
    });
  });

  // common events.
  tables.CommonEvents.forEach(commonEvent =>
  {
    if (!commonEvent) return;

    listScripts(commonEvent.list).forEach(({ index, text }) =>
      scripts.push({ where: `${describeRow('CommonEvents', commonEvent.id, commonEvent)} command ${index}`, text }));
  });

  // troop pages, which run in battle.
  tables.Troops.forEach(troop =>
  {
    if (!troop) return;

    troop.pages.forEach((page, index) => listScripts(page.list).forEach(({ index: command, text }) =>
      scripts.push({ where: `${describeRow('Troops', troop.id, troop)} page ${index + 1} command ${command}`, text })));
  });

  return scripts;
};

/**
 * Checks that no event script spreads its arguments into a call.
 * @param {object} project The loaded project.
 * @returns {{ findings: string[], summary: string }}
 */
export const checkScripts = project =>
{
  const scripts = collectScripts(project);

  const findings = scripts.flatMap(({ where, text }) => findSpreadCalls(text).map(callee =>
    `${where} spreads arguments into ${callee}(), and no J plugin method takes a rest parameter; pass it what its signature asks for instead.`));

  return {
    findings,
    summary: `${scripts.length} event script(s) read`,
  };
};