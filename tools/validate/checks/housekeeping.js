/**
 * housekeeping — backups belong in a working tree, never in history.
 *
 * `.gitignore` already tells authors to keep a backup taken before a risky edit locally. This is the
 * other half: a backup that got committed anyway fails the build, because MZ ignores it and a reader
 * two years from now will not - they will reasonably wonder which copy of `Classes.json` is real.
 */

/**
 * Every name a committed backup goes by, as the glob an author would write and the test that applies
 * it to a file's name. Each one reads the name alone, never the folders above it, so a directory that
 * happens to be called `backups` cannot flag every file inside it. `*.backup*` is listed before
 * `*.bak*`, which would also match it, so a report names the convention the author actually used.
 *
 * <pre>
 * Structure:
 *  NAME.old.json, NAME.bak ANYTHING, NAME.backup ANYTHING
 *
 * Example:
 *  chef-adventure/data/Classes.old.json, Skills.json.bak, Armors.backup-0922.json
 *
 * Translation:
 *  three backups, one per convention
 * </pre>
 * @type {{ glob: string, test: RegExp }[]}
 */
const BACKUP_NAMES = [
  { glob: '*.old.json', test: /\.old\.json$/i },
  { glob: '*.backup*', test: /\.backup/i },
  { glob: '*.bak*', test: /\.bak/i },
];

/**
 * The first backup convention a file's name matches.
 * @param {string} file A repository-relative path.
 * @returns {string} The matching glob, or empty when the name is no backup's.
 */
const backupGlobFor = file =>
{
  const name = file.slice(file.lastIndexOf('/') + 1);
  const match = BACKUP_NAMES.find(({ test }) => test.test(name));

  return match
    ? match.glob
    : '';
};

/**
 * Checks what git tracks for committed backups.
 * @param {object} project The loaded project.
 * @returns {{ findings: string[], summary: string }}
 */
export const checkHousekeeping = project =>
{
  const findings = [];

  project.trackedFiles.forEach(file =>
  {
    const glob = backupGlobFor(file);

    if (glob !== '') findings.push(`${file} is a committed backup (${glob}); a backup belongs in a working tree, not in the repository`);
  });

  return {
    findings,
    summary: `${project.trackedFiles.length} tracked file(s)`,
  };
};