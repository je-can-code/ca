/**
 * playtest — boot a frozen copy of the game on a hidden display and let the bot play it.
 *
 * The bot is a scripted state machine injected into the running game. It reads the same state the game
 * draws from, decides what a player would do next, and presses simulated buttons. There is no learning
 * anywhere in it, so what it can do is exactly what its rules say. See `agent/main.js` for the bot.
 *
 * A run never touches the live project. Other work rewrites `chef-adventure/` while a run is going, and a
 * probe injected into it by another tool would otherwise be copied along with everything else, so each
 * run plays a private copy that only changes when it is asked to. That copy lives in tmpfs, because a
 * disk has no business paying for 400 MB of throwaway files.
 *
 * The game runs without the `test` flag, which is how a player runs it: no devtools, no debug walk, and
 * nothing in any plugin that asks whether this is a playtest gets to answer yes.
 *
 * Everything a run produces lands in the gitignored `dist/playtest/<stamp>/`:
 *   journal.log   what the bot did and saw, in order, stamped in game time
 *   report.json   how the run ended, and the numbers
 *   shots/        a screenshot per map, plus every death and stuck spot
 *   film.mp4      the hidden display, recorded
 *
 * Usage:
 *   bun tools/playtest/run.js             play the frozen copy, making one if there is none yet
 *   bun tools/playtest/run.js --fresh     copy the live game again first
 *   bun tools/playtest/run.js --no-film   skip the recording
 *   bun tools/playtest/run.js --minutes 5 stop the run after this much real time, default 30
 *   bun tools/playtest/run.js --speed 8   play this many times faster than real time, default 1. Films
 *                                         are skipped above 1, since nobody wants a film of a blur.
 *   bun tools/playtest/run.js --story     take the story branch of every choice instead of skipping
 *   bun tools/playtest/run.js --reflexes sloppy  how it plays: sharp reacts in 18 frames and pokes from the tip
 *                                         of its reach, sloppy reacts in 18 to 48 and hugs its target, and a
 *                                         statue never reacts and hugs too. Default sharp.
 *   bun tools/playtest/run.js --probe a.js inject a one-off measuring script alongside the bot
 *   bun tools/playtest/run.js --patient   never call a run stuck, so it only ends when time runs out. For a
 *                                         probe that drives the story itself: long scenes and rooms left
 *                                         empty between its steps would otherwise read as nothing left to do.
 */
//region playtest
const { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } = require('fs');
const { join, resolve } = require('path');
const { spawn, spawnSync } = require('child_process');

/**
 * The root of the Chef Adventure repository.
 * @type {string}
 */
const CA_ROOT = resolve(import.meta.dir, '..', '..');

/**
 * The live game, which is only ever read from.
 * @type {string}
 */
const LIVE_GAME = join(CA_ROOT, 'chef-adventure');

/**
 * Where the frozen copy and everything else disposable lives. The name the game is copied under does
 * not matter to NW.js, so it stays short and obvious in a process list.
 * @type {string}
 */
const WORK_ROOT = '/tmp/ca-playtest';

/**
 * The frozen copy of the game.
 * @type {string}
 */
const FROZEN_GAME = join(WORK_ROOT, 'game');

/**
 * The name the bot is given inside the frozen copy, resolved against the package root by NW.js.
 * @type {string}
 */
const INJECTED_NAME = '_playtest-agent.js';

/**
 * The size of the hidden display. The game is authored at 1920x1080 and scales down to fit, and software
 * rendering is noticeably kinder at this size.
 * @type {{width: number, height: number}}
 */
const DISPLAY_SIZE = { width: 1280, height: 720 };

/**
 * How many frames per second the film records at. Software rendering cannot keep up with much more.
 * @type {number}
 */
const FILM_FPS = 15;

/**
 * How long the bot gets to wrap up after a run is called, in milliseconds, before it is simply stopped.
 * @type {number}
 */
const GRACE_MS = 3000;

/**
 * Reads the command line into the handful of options a run takes.
 * @returns {{fresh: boolean, film: boolean, story: boolean, minutes: number, speed: number, probe: string,
 * reflexes: string, patient: boolean}}
 */
const readOptions = () =>
{
  const args = process.argv.slice(2);
  const minutesAt = args.indexOf('--minutes');
  const speedAt = args.indexOf('--speed');
  const probeAt = args.indexOf('--probe');
  const reflexesAt = args.indexOf('--reflexes');
  const speed = speedAt === -1 ? 1 : Number(args[speedAt + 1]);

  return {
    fresh: args.includes('--fresh'),
    film: speed === 1 && args.includes('--no-film') === false,
    story: args.includes('--story'),
    minutes: minutesAt === -1 ? 30 : Number(args[minutesAt + 1]),
    speed,
    probe: probeAt === -1 ? '' : args[probeAt + 1],
    reflexes: reflexesAt === -1 ? 'sharp' : args[reflexesAt + 1],
    patient: args.includes('--patient'),
  };
};

/**
 * Builds the name of a run's folder from the moment it started.
 * @returns {string}
 */
const stampOfNow = () =>
{
  // an iso stamp without the characters a folder name would rather not have.
  return new Date().toISOString()
    .slice(0, 19)
    .replaceAll(':', '-');
};

/**
 * Copies the live game into the frozen copy. A probe left behind by another tool stays behind, and so
 * do save slots, since a new player has none. Saves live under `save/` in the game folder, which is why
 * this copy has to be a real one rather than links back to the live game.
 */
const freezeGame = () =>
{
  mkdirSync(WORK_ROOT, { recursive: true });

  const args = [ '-a', '--delete', '--exclude=_probe.js', '--exclude=save/file*', `${LIVE_GAME}/`, FROZEN_GAME ];
  const result = spawnSync('rsync', args, { stdio: 'inherit' });

  // a half copied game would fail in ways that read like game bugs.
  if (result.status !== 0)
  {
    throw new Error(`copying the game failed with status ${result.status}`);
  }
};

/**
 * Bundles the bot into one script and points the frozen copy's manifest at it. The key is written over
 * whatever is there rather than added to it, because the manifest may have been copied while another
 * tool had its own probe named in it. Reads it back afterwards, since a run that silently plays with the
 * wrong script injected would report on the wrong thing.
 * @param {{runDirectory: string, doneMarker: string, minutes: number, speed: number, story: boolean,
 * draw: boolean, reflexes: string, patient: boolean}} config What the bot needs to know about this run.
 * @param {string} probe The path of a script to inject alongside the bot, or nothing.
 */
const injectAgent = async (config, probe) =>
{
  const built = await Bun.build({
    entrypoints: [ join(import.meta.dir, 'agent', 'main.js') ],
    target: 'browser',
    format: 'iife',
    define: { __PLAYTEST_CONFIG__: JSON.stringify(JSON.stringify(config)) },
  });

  if (built.success === false)
  {
    throw new Error(`bundling the bot failed: ${built.logs.join('\n')}`);
  }

  const [ bundle ] = built.outputs;
  const bot = await bundle.text();
  const extra = probe === '' ? '' : readFileSync(probe, 'utf8');
  writeFileSync(join(FROZEN_GAME, INJECTED_NAME), `${bot}\n${extra}`);

  const manifestPath = join(FROZEN_GAME, 'package.json');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  manifest.inject_js_start = INJECTED_NAME;
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  // the one line that keeps a stray probe from quietly playing instead of the bot.
  const { inject_js_start: injected } = JSON.parse(readFileSync(manifestPath, 'utf8'));
  if (injected !== INJECTED_NAME)
  {
    throw new Error(`the frozen manifest injects ${injected} instead of the bot`);
  }
};

/**
 * Finds an X display number nothing is using. Sibling tooling runs its own display, so this one starts
 * above the numbers that tooling reaches for.
 * @returns {number}
 */
const findFreeDisplay = () =>
{
  for (let display = 78; display < 100; display += 1)
  {
    if (existsSync(`/tmp/.X11-unix/X${display}`) === false) return display;
  }

  throw new Error('no free X display between :78 and :99');
};

/**
 * Starts the private hidden display, waiting until it has actually come up.
 * @param {number} display The display number.
 * @returns {Promise<ChildProcess>}
 */
const startDisplay = async display =>
{
  const { width, height } = DISPLAY_SIZE;
  const screen = `${width}x${height}x24`;
  const xvfb = spawn('Xvfb', [ `:${display}`, '-screen', '0', screen, '-nolisten', 'tcp' ], { stdio: 'ignore' });

  // the socket appearing is the display saying it is ready.
  for (let attempt = 0; attempt < 50; attempt += 1)
  {
    if (existsSync(`/tmp/.X11-unix/X${display}`)) return xvfb;
    await Bun.sleep(100);
  }

  throw new Error(`display :${display} never came up`);
};

/**
 * Starts recording the hidden display.
 * @param {number} display The display number.
 * @param {string} runDirectory The folder the film lands in.
 * @returns {ChildProcess}
 */
const startFilm = (display, runDirectory) =>
{
  const { width, height } = DISPLAY_SIZE;
  const size = `${width}x${height}`;
  const grab = [ '-f', 'x11grab', '-draw_mouse', '0', '-framerate', `${FILM_FPS}`, '-video_size', size, '-i', `:${display}` ];
  const encode = [ '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '28', '-pix_fmt', 'yuv420p' ];
  const args = [ '-y', '-loglevel', 'error', ...grab, ...encode, join(runDirectory, 'film.mp4') ];

  return spawn('ffmpeg', args, { stdio: [ 'pipe', 'ignore', 'ignore' ] });
};

/**
 * Starts the frozen game on the hidden display. Unsetting Wayland is what keeps the window off the real
 * desktop: Chromium prefers Wayland when it can reach it, whatever DISPLAY says. The private profile
 * keeps this run from handing itself off to any other NW.js window that happens to be open, and the game
 * is muted because nobody wants a boss theme coming out of nowhere.
 *
 * The display has no graphics card behind it, so Chromium's SwiftShader renders in software. It caps a
 * texture at 8192 pixels and the icon sheet is taller than that, so sprites drawn from the sheet (loot,
 * weapon swings, popups) come out as black squares on film. That is this rig and not the game: a real
 * card allows 16384. Going through ANGLE to the system's OpenGL allows it here too, but the film comes
 * out too slow and choppy to watch, and a watchable film is worth more than the icons.
 * @param {number} display The display number.
 * @returns {ChildProcess}
 */
const startGame = display =>
{
  const env = { ...process.env, DISPLAY: `:${display}` };
  delete env.WAYLAND_DISPLAY;

  const flags = [
    `--user-data-dir=${join(WORK_ROOT, 'profile')}`,
    '--ozone-platform=x11',
    '--enable-unsafe-swiftshader',
    '--mute-audio',
  ];

  return spawn('nw', [ FROZEN_GAME, ...flags ], { cwd: WORK_ROOT, env, stdio: 'ignore' });
};

/**
 * Waits for the bot to say it is done, for the game to die, or for the clock to run out.
 * @param {ChildProcess} game The running game.
 * @param {string} doneMarker The file the bot writes once it has finished.
 * @param {number} minutes How long to wait, in real minutes.
 * @returns {Promise<string>} What ended the wait.
 */
const waitForEnd = async (game, doneMarker, minutes) =>
{
  const deadline = Date.now() + minutes * 60_000;

  while (Date.now() < deadline)
  {
    if (existsSync(doneMarker)) return 'finished';
    if (game.exitCode !== null) return 'game exited';
    await Bun.sleep(500);
  }

  return 'timed out';
};

/**
 * Stops the film the way ffmpeg likes, so that the file comes out playable.
 * @param {ChildProcess} film The running recording.
 * @returns {Promise<void>}
 */
const stopFilm = async film =>
{
  // a polite "q" lets it write the index an abruptly killed mp4 would not have.
  film.stdin.write('q');
  film.stdin.end();

  for (let attempt = 0; attempt < 100 && film.exitCode === null; attempt += 1)
  {
    await Bun.sleep(100);
  }

  if (film.exitCode === null) film.kill('SIGKILL');
};

/**
 * Prints how the run ended from the report the bot left behind.
 * @param {string} runDirectory The run's folder.
 * @param {string} ending What ended the wait.
 */
const printEnding = (runDirectory, ending) =>
{
  console.log(`run ended: ${ending}`);
  console.log(`folder: ${runDirectory}`);

  const reportPath = join(runDirectory, 'report.json');
  if (existsSync(reportPath))
  {
    const { outcome, gameTime, deaths, mapsVisited, reflexes } = JSON.parse(readFileSync(reportPath, 'utf8'));
    const { profile, dodges, hitsWhileClear } = reflexes;
    console.log(`outcome: ${outcome}, game time ${gameTime}, deaths ${deaths}, maps ${mapsVisited}`);
    console.log(`reflexes: ${profile}, stepped out of ${dodges} attacks, ${hitsWhileClear} hits while clear`);
  }
  else
  {
    console.log('the bot left no report behind.');
  }
};

/**
 * Plays one run from start to finish, and always takes everything it started back down.
 */
const main = async () =>
{
  const { fresh, film, story, minutes, speed, probe, reflexes, patient } = readOptions();

  if (fresh || existsSync(FROZEN_GAME) === false) freezeGame();

  const runDirectory = join(CA_ROOT, 'dist', 'playtest', stampOfNow());
  mkdirSync(join(runDirectory, 'shots'), { recursive: true });

  const doneMarker = join(runDirectory, 'done');
  await injectAgent({ runDirectory, doneMarker, minutes, speed, story, draw: film, reflexes, patient }, probe);

  // the profile goes every run, so that nothing one run did leaks into the next.
  rmSync(join(WORK_ROOT, 'profile'), { recursive: true, force: true });

  const display = findFreeDisplay();
  const xvfb = await startDisplay(display);
  const recording = film ? startFilm(display, runDirectory) : null;
  const game = startGame(display);

  let ending = 'unknown';
  try
  {
    ending = await waitForEnd(game, doneMarker, minutes);
    await Bun.sleep(GRACE_MS);
  }
  finally
  {
    // only ever the processes this run started: other tools have their own games open.
    game.kill('SIGTERM');
    if (recording) await stopFilm(recording);
    xvfb.kill('SIGTERM');
  }

  printEnding(runDirectory, ending);
};

await main();
//endregion playtest
