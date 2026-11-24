/**
 * burndown-page — the Chef Adventure burndown as a live page on the home network, and the bestiary beside it.
 *
 * The burndown page was first a hosted dashboard, which can only show the data uploaded into it, so it
 * stood still between uploads. This serves the same page from this machine instead, and every visit asks
 * `tools/burndown.js --json` for a fresh count, so what it shows is never older than the moment it was
 * opened. A visit records nothing: the history behind the chart grows only when someone runs the counter
 * with `--write`.
 *
 * The bestiary's first-meetings sheet began the same way, as a hosted page drawn from a one-off export,
 * and it lives here for the same reason: at `/bestiary`, every visit asks `tools/bestiary.js json` where
 * each line stands today. Its page is `tools/bestiary-page/page.html`.
 *
 * Usage:
 *   bun tools/burndown-page/server.js   # serve on every address of this machine, as the service does
 *
 * It answers at http://j-desktop.local:1220 from any device at home, and the bestiary at
 * http://j-desktop.local:1220/bestiary. The port is the target date, December 20, because port 80 already
 * belongs to the recipes site. `burndown.service` beside this file keeps it running, and its comment says
 * how to install it.
 */

//region serving

/**
 * The port the page answers on: 12/20, the content complete target.
 * @type {number}
 */
const PORT = 1220;

/**
 * The page itself, a single file holding its markup, styles and script.
 * @type {string}
 */
const PAGE_PATH = `${import.meta.dir}/page.html`;

/**
 * The counter that measures the game, run fresh for every visit.
 * @type {string}
 */
const COUNTER_PATH = `${import.meta.dir}/../burndown.js`;

/**
 * The bestiary's first-meetings sheet, a single file like the burndown page.
 * @type {string}
 */
const BESTIARY_PAGE_PATH = `${import.meta.dir}/../bestiary-page/page.html`;

/**
 * The bestiary, which reads where every line stands, run fresh for every visit to its sheet.
 * @type {string}
 */
const BESTIARY_PATH = `${import.meta.dir}/../bestiary.js`;

/**
 * Headers that keep a browser from showing yesterday's count out of its cache.
 * @type {Record<string, string>}
 */
const NEVER_CACHE = { 'cache-control': 'no-store' };

/**
 * Runs one of the read-only tools and hands what it prints to a page.
 *
 * The tool runs as its own process, the same way it runs from a terminal, so a page and the command line
 * can never disagree about what the game holds. A failed run answers with the tool's own error, which the
 * page shows in place of the numbers rather than drawing something stale or empty.
 * @param {string} toolPath The tool to run.
 * @param {string[]} toolArguments What to run it with, which is always its JSON form.
 * @returns {Promise<Response>}
 */
const runFresh = async (toolPath, toolArguments) =>
{
  const run = Bun.spawn([ process.execPath, toolPath, ...toolArguments ], { stdout: 'pipe', stderr: 'pipe' });
  const [ data, problem, exitCode ] = await Promise.all([
    new Response(run.stdout).text(),
    new Response(run.stderr).text(),
    run.exited,
  ]);

  if (exitCode !== 0)
  {
    const reason = problem.trim() || `the tool stopped with exit code ${exitCode}.`;
    return new Response(reason, { status: 500, headers: NEVER_CACHE });
  }

  return new Response(data, { headers: { ...NEVER_CACHE, 'content-type': 'application/json' } });
};

Bun.serve({
  port: PORT,
  hostname: '0.0.0.0',
  routes: {
    '/': () => new Response(Bun.file(PAGE_PATH), { headers: NEVER_CACHE }),
    '/data': () => runFresh(COUNTER_PATH, [ '--json' ]),
    '/bestiary': () => new Response(Bun.file(BESTIARY_PAGE_PATH), { headers: NEVER_CACHE }),
    '/bestiary/data': () => runFresh(BESTIARY_PATH, [ 'json' ]),
  },
  fetch: () => new Response('Not found', { status: 404 }),
});

//endregion serving
