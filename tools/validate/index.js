/**
 * validate — find the breakage in Chef Adventure's data that no single writer can see.
 *
 * `chef-adventure/data` has three writers, and only one of them knows about the others. jmz-data-editor
 * owns the `config.*.json` files and keeps them consistent as it saves. RPG Maker MZ owns every other
 * table, and has never heard of a config file or read a note. The bulk scripts in `tools/` move rows
 * outright. So a row can be blanked or renumbered by one writer while another still points at it, and
 * nothing in the loop has any reason to notice - which is how 274 enemy drops came to name blank armor
 * rows and drop nothing, found by hand, weeks later.
 *
 * The value is at the seams between those writers, so that is what this checks:
 *
 * - **parse floor** - every data file parses
 * - **housekeeping** - no database backup is committed
 * - **plugin drift** - `js/plugins/j/` is exactly one build of rmmz-plugins, nothing stale beside it
 * - **notetags** - every id a tag names resolves, and every tag matches a pattern a plugin declares
 * - **config references** - every id a plugin config names in an MZ table resolves
 *
 * What a tag means comes from `js/plugins/j/manifest.json`, which rmmz-plugins' build writes and its
 * `hotfix` mirrors in with the plugins. This validator holds no knowledge of any plugin's tags itself.
 *
 * Usage:
 *   bun run validate
 *   bun run validate:selftest
 *   bun tools/validate/index.js --root <repository>
 */

import path from 'node:path';
import { runChecks } from './checks.js';
import { loadProject } from './project.js';
import { runSelftest } from './selftest.js';

/**
 * The repository to validate: `--root <path>` when given, otherwise the one this file lives in.
 * @param {string[]} args The command-line arguments.
 * @returns {string} An absolute path.
 */
const resolveRoot = args =>
{
  const flag = args.indexOf('--root');

  return flag >= 0
    ? path.resolve(args[flag + 1])
    : path.resolve(`${import.meta.dir}/../..`);
};

/**
 * Prints every check's outcome and its findings, then the totals.
 * @param {{ name: string, findings: string[], summary: string }[]} results One result per check.
 * @returns {number} Exit code - 0 when nothing was found, 1 otherwise.
 */
const report = results =>
{
  const width = Math.max(...results.map(({ name }) => name.length));

  results.forEach(({ name, findings, summary }) =>
  {
    const verdict = findings.length === 0
      ? 'ok  '
      : 'FAIL';
    const count = findings.length === 0
      ? ''
      : ` - ${findings.length} finding(s)`;

    console.log(`  ${verdict}  ${name.padEnd(width)}  ${summary}${count}`);
    findings.forEach(finding => console.log(`          ${finding}`));
  });

  const failing = results.filter(({ findings }) => findings.length > 0);
  const total = failing.reduce((sum, { findings }) => sum + findings.length, 0);

  if (failing.length === 0)
  {
    console.log('validate: OK (nothing found).');

    return 0;
  }

  console.log(`validate: FAILED (${total} finding(s) in ${failing.length} check(s)).`);

  return 1;
};

const args = process.argv.slice(2);
const root = resolveRoot(args);

console.log(`validate: ${root}`);

const project = await loadProject(root);

const exitCode = args.includes('--selftest')
  ? runSelftest(project)
  : report(runChecks(project));

process.exit(exitCode);