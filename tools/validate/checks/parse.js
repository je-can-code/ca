/**
 * parse — the floor every other check stands on: every data file has to parse.
 *
 * A truncated tool write or an interrupted editor save leaves a file that looks fine in a diff and
 * stops the game at boot. Catching it here turns a boot failure into a named file and a parser error,
 * and it is reported first because every other check reads these files and means nothing without them.
 */

/**
 * Reports every data file that failed to parse.
 * @param {object} project The loaded project.
 * @returns {{ findings: string[], summary: string }}
 */
export const checkParse = project => ({
  findings: project.parseFailures.map(({ file, error }) => `${file} does not parse: ${error}`),
  summary: `${project.dataFiles.length} data file(s)`,
});