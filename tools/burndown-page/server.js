/**
 * burndown-page — the Chef Adventure burndown as a live page on the home network.
 *
 * The burndown page was first a hosted dashboard, which can only show the data uploaded into it, so it
 * stood still between uploads. This serves the same page from this machine instead, and every visit asks
 * `tools/burndown.js --json` for a fresh count, so what it shows is never older than the moment it was
 * opened. A visit records nothing: the history behind the chart grows only when someone runs the counter
 * with `--write`.
 *
 * Usage:
 *   bun tools/burndown-page/server.js   # serve on every address of this machine, as the service does
 *
 * It answers at http://j-desktop.local:1220 from any device at home. The port is the target date,
 * December 20, because port 80 already belongs to the recipes site. `burndown.service` beside this file
 * keeps it running, and its comment says how to install it.
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
 * Headers that keep a browser from showing yesterday's count out of its cache.
 * @type {Record<string, string>}
 */
const NEVER_CACHE = { 'cache-control': 'no-store' };

/**
 * Runs the counter and hands its data to the page.
 *
 * The counter runs as its own process, the same way it runs from a terminal, so the page and the command
 * line can never disagree about what is left. A failed count answers with the counter's own error, which
 * the page shows in place of the numbers rather than drawing a stale or empty chart.
 * @returns {Promise<Response>}
 */
const count = async () =>
{
  const run = Bun.spawn([ process.execPath, COUNTER_PATH, '--json' ], { stdout: 'pipe', stderr: 'pipe' });
  const [ data, problem, exitCode ] = await Promise.all([
    new Response(run.stdout).text(),
    new Response(run.stderr).text(),
    run.exited,
  ]);

  if (exitCode !== 0)
  {
    const reason = problem.trim() || `the counter stopped with exit code ${exitCode}.`;
    return new Response(reason, { status: 500, headers: NEVER_CACHE });
  }

  return new Response(data, { headers: { ...NEVER_CACHE, 'content-type': 'application/json' } });
};

Bun.serve({
  port: PORT,
  hostname: '0.0.0.0',
  routes: {
    '/': () => new Response(Bun.file(PAGE_PATH), { headers: NEVER_CACHE }),
    '/data': count,
  },
  fetch: () => new Response('Not found', { status: 404 }),
});

//endregion serving
