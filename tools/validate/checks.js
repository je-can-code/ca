/**
 * checks — the whole suite, in the order its findings should be read.
 *
 * Kept apart from the command line so anything else can run it: a bulk script in `tools/` is the
 * riskiest writer in the repository and the one most likely to run right before a commit, and it can
 * load the project and call {@link runChecks} on its way out rather than leaving the answer to CI.
 */

import { checkConfigs } from './checks/configs.js';
import { checkHousekeeping } from './checks/housekeeping.js';
import { checkNotetags } from './checks/notetags.js';
import { checkParse } from './checks/parse.js';
import { checkPlugins } from './checks/plugins.js';

/**
 * Every check, in reading order. The ones that read database rows are marked, because they mean
 * nothing - and can crash - when a data file failed to parse.
 * @type {{ name: string, run: Function, readsData: boolean }[]}
 */
export const CHECKS = [
  { name: 'parse floor', run: checkParse, readsData: false },
  { name: 'housekeeping', run: checkHousekeeping, readsData: false },
  { name: 'plugin drift', run: checkPlugins, readsData: false },
  { name: 'notetags', run: checkNotetags, readsData: true },
  { name: 'config references', run: checkConfigs, readsData: true },
];

/**
 * Runs every check against a loaded project.
 * @param {object} project The loaded project.
 * @returns {{ name: string, findings: string[], summary: string }[]} One result per check, in order.
 */
export const runChecks = project =>
{
  const parsedCleanly = project.parseFailures.length === 0;

  return CHECKS.map(({ name, run, readsData }) =>
  {
    // a check that reads rows is skipped rather than run against a half-loaded database.
    if (readsData && parsedCleanly === false)
    {
      return { name, findings: [], summary: 'skipped until every data file parses' };
    }

    return { name, ...run(project) };
  });
};