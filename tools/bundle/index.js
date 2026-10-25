/**
 * bundle — wrap Chef Adventure into something a player can double-click.
 *
 * A player should never need to know NW.js exists, which version of it the game was tested on, or that
 * plugins are a thing. So a bundle is one NW.js runtime with the game already inside it, packed into a
 * single archive per OS. The runtime's version lives in `nwjs.json` beside this file and nowhere else, so
 * moving to a new one is a single deliberate edit, made after playing the game on it.
 *
 * This is the same script the release workflow runs, so a bundle built at a desk and one built by CI are
 * the same bundle. The one step that differs is the Mac app's signature: Apple's `codesign` exists only
 * on macOS, so a Mac bundle built anywhere else comes out unsigned and has to be signed on a Mac before
 * its first launch.
 *
 * Usage:
 *   bun run bundle
 *   bun run bundle --version v0.7.1
 *   bun run bundle --targets windows,linux
 */

import fs from 'node:fs';
import path from 'node:path';
import { runChecks } from '../validate/checks.js';
import { loadProject } from '../validate/project.js';

//region paths and names

/**
 * The repository root.
 * @type {string}
 */
const ROOT = path.resolve(`${import.meta.dir}/../..`);

/**
 * The MZ project, relative to the repository root.
 * @type {string}
 */
const GAME_DIR = 'chef-adventure';

/**
 * Everything in the MZ project a player needs, by name.
 *
 * This lists what to take rather than what to leave, because the project folder also holds things that
 * must never ship, like the dev saves in `save/` and the map editor's `jmz-editor/`, and a new one of
 * those should stay home by default. MZ fixes this layout, so the list only changes if MZ does.
 * @type {string[]}
 */
const GAME_ENTRIES = [ 'audio', 'css', 'data', 'effects', 'fonts', 'icon', 'img', 'js', 'movies', 'index.html', 'package.json' ];

/**
 * The folder a player sees inside every archive, and the name the runtime is given on Windows and Mac.
 * @type {string}
 */
const BUNDLE_NAME = 'Chef Adventure';

/**
 * The name the shipped game gives NW.js, which also names its archives and its Linux launcher.
 *
 * NW.js keeps an app's data in a folder named after this, and MZ's default, `rmmz-game`, is shared by every
 * MZ game that never changed it.
 * @type {string}
 */
const APP_NAME = 'chef-adventure';

/**
 * Where finished archives land, relative to the repository root. Gitignored.
 * @type {string}
 */
const DIST_DIR = 'dist';

/**
 * Where downloaded NW.js archives are kept between runs, relative to the repository root. Gitignored.
 * @type {string}
 */
const CACHE_DIR = '.cache/nwjs';

/**
 * Where NW.js publishes every release, beside a checksum list for each one.
 * @type {string}
 */
const DOWNLOAD_BASE = 'https://dl.nwjs.io';

/**
 * Developer tools that only NW.js's SDK flavour is meant to carry. Bundles use the normal flavour, which
 * should not have them, but any that turn up are removed: a player has no use for a compiler or a test
 * driver.
 * @type {string[]}
 */
const DEVELOPER_TOOLS = [ 'nwjc', 'nwjc.exe', 'chromedriver', 'chromedriver.exe', 'payload', 'payload.exe' ];

/**
 * Every bundle this can build, by the name `--targets` and the archives use.
 *
 * - `platform` is NW.js's name for the runtime to download, and `download` is the archive it comes in.
 * - `layout` says where the game goes. `folder` puts it in a `package.nw/` folder beside the runtime, which
 *   NW.js loads on its own; `app` puts it inside the Mac app, where NW.js looks for `app.nw/`.
 * - `binary` is the runtime's executable, renamed to `launcher` so a player knows which file to open.
 * - `pack` is the archive the player downloads. Linux gets a tarball, because every extractor keeps the
 *   launcher's executable bit from one.
 * @type {object[]}
 */
const TARGETS = [
  { name: 'windows', platform: 'win-x64', download: 'zip', layout: 'folder', binary: 'nw.exe', launcher: `${BUNDLE_NAME}.exe`, pack: 'zip', readme: 'windows.txt' },
  { name: 'linux', platform: 'linux-x64', download: 'tar.gz', layout: 'folder', binary: 'nw', launcher: APP_NAME, pack: 'tar.gz', readme: 'linux.txt' },
  { name: 'macos-arm64', platform: 'osx-arm64', download: 'zip', layout: 'app', pack: 'zip', readme: 'macos.txt' },
  { name: 'macos-x64', platform: 'osx-x64', download: 'zip', layout: 'app', pack: 'zip', readme: 'macos.txt' },
];

//endregion paths and names

//region command line

/**
 * Reads the value that follows a flag on the command line.
 * @param {string[]} args The command-line arguments.
 * @param {string} flag The flag, such as `--version`.
 * @returns {string} The value, or empty when the flag is absent.
 */
const flagValue = (args, flag) =>
{
  const index = args.indexOf(flag);

  return index >= 0
    ? args[index + 1]
    : '';
};

/**
 * Reads the options this was run with.
 *
 * Without `--version` a bundle is labelled `dev`, which is what a build made at a desk is. The release
 * workflow passes the real one.
 * @param {string[]} args The command-line arguments.
 * @returns {{ version: string, targets: object[] }}
 */
const parseArgs = args =>
{
  const version = flagValue(args, '--version') || 'dev';
  const wanted = flagValue(args, '--targets');

  // no list means every target; a name nobody defined is a typo, and a typo should stop the run.
  const targets = wanted === ''
    ? TARGETS
    : wanted.split(',').map(name =>
    {
      const target = TARGETS.find(candidate => candidate.name === name.trim());

      if (!target) throw new Error(`no target named "${name}"; the targets are ${TARGETS.map(({ name }) => name).join(', ')}`);

      return target;
    });

  return { version, targets };
};

/**
 * The NW.js version every bundle is built on.
 * @returns {string} For example, `v0.118.0`.
 */
const readPinnedVersion = () => JSON.parse(fs.readFileSync(`${import.meta.dir}/nwjs.json`, 'utf8')).version;

/**
 * Runs a command and stops the build if it fails.
 * @param {string[]} command The program and its arguments.
 * @param {string} cwd The directory to run it in.
 */
const run = (command, cwd) =>
{
  const result = Bun.spawnSync(command, { cwd, stdout: 'pipe', stderr: 'pipe' });

  if (result.exitCode !== 0)
  {
    throw new Error(`${command.join(' ')} failed (exit ${result.exitCode}): ${result.stderr.toString().trim()}`);
  }
};

//endregion command line

//region the runtime

/**
 * Downloads a file to disk, one chunk at a time.
 *
 * The body is streamed through a writer by hand rather than handed to `Bun.write` whole. On Bun 1.3.13,
 * `Bun.write(path, response)` never writes a single byte of a download the size of an NW.js runtime; it
 * spins the CPU forever instead, which is the worst way a build can fail.
 * @param {string} url Where to download from.
 * @param {string} destination The file to write.
 * @returns {Promise<void>}
 */
const download = async (url, destination) =>
{
  const response = await fetch(url);

  if (response.ok === false) throw new Error(`${url} answered ${response.status} ${response.statusText}`);

  fs.mkdirSync(path.dirname(destination), { recursive: true });

  const writer = Bun.file(destination).writer();

  for await (const chunk of response.body)
  {
    writer.write(chunk);
  }

  await writer.end();
};

/**
 * The SHA-256 of a file on disk, read in chunks so a 200 MB archive never sits in memory whole.
 * @param {string} filePath The file to hash.
 * @returns {Promise<string>} The hex digest.
 */
const hashFile = async filePath =>
{
  const hasher = new Bun.CryptoHasher('sha256');

  for await (const chunk of Bun.file(filePath).stream())
  {
    hasher.update(chunk);
  }

  return hasher.digest('hex');
};

/**
 * The checksum NW.js publishes for every file of one release, by file name.
 * @param {string} version The NW.js version.
 * @returns {Promise<Map<string, string>>}
 */
const readChecksums = async version =>
{
  const listPath = `${ROOT}/${CACHE_DIR}/${version}/SHASUMS256.txt`;

  if (fs.existsSync(listPath) === false) await download(`${DOWNLOAD_BASE}/${version}/SHASUMS256.txt`, listPath);

  // each line is a digest, whitespace, then the file name, which `sha256sum` may prefix with a `*`.
  const entries = fs.readFileSync(listPath, 'utf8')
    .split('\n')
    .filter(line => line.trim() !== '')
    .map(line =>
    {
      const [ digest, fileName ] = line.trim().split(/\s+/);

      return [ fileName.replace(/^\*/, ''), digest ];
    });

  return new Map(entries);
};

/**
 * Fetches one NW.js runtime into the cache, unless a verified copy is already there.
 *
 * A download is written beside its final name and only renamed into place once its checksum matches the
 * one NW.js publishes, so an interrupted or corrupted download can never pass for a good one next run.
 * @param {string} version The NW.js version.
 * @param {object} target The target the runtime is for.
 * @param {Map<string, string>} checksums The release's published checksums.
 * @returns {Promise<string>} The cached archive's path.
 */
const fetchRuntime = async (version, target, checksums) =>
{
  const fileName = `nwjs-${version}-${target.platform}.${target.download}`;
  const expected = checksums.get(fileName);

  if (!expected) throw new Error(`NW.js ${version} publishes no checksum for ${fileName}`);

  const finalPath = `${ROOT}/${CACHE_DIR}/${version}/${fileName}`;

  if (fs.existsSync(finalPath) && await hashFile(finalPath) === expected) return finalPath;

  const partialPath = `${finalPath}.part`;

  console.log(`  downloading ${fileName}`);
  await download(`${DOWNLOAD_BASE}/${version}/${fileName}`, partialPath);

  const actual = await hashFile(partialPath);

  if (actual !== expected)
  {
    fs.rmSync(partialPath, { force: true });

    throw new Error(`${fileName} downloaded with checksum ${actual}, but NW.js publishes ${expected}`);
  }

  fs.renameSync(partialPath, finalPath);

  return finalPath;
};

/**
 * Unpacks a runtime into a staging folder and renames its top folder to the one the player sees.
 *
 * Zips go through Info-ZIP's `unzip` because the Mac runtime is full of symbolic links, one per framework
 * inside the app, and anything that flattened them would build an app that refuses to sign or start.
 * @param {string} archivePath The cached runtime archive.
 * @param {object} target The target being built.
 * @param {string} version The NW.js version, which names the archive's top folder.
 * @param {string} stageDir An empty folder to unpack into.
 * @returns {string} The bundle's folder.
 */
const unpackRuntime = (archivePath, target, version, stageDir) =>
{
  fs.mkdirSync(stageDir, { recursive: true });

  if (target.download === 'zip')
  {
    run([ 'unzip', '-q', archivePath, '-d', stageDir ], ROOT);
  }
  else
  {
    run([ 'tar', '-xzf', archivePath, '-C', stageDir ], ROOT);
  }

  const bundleDir = `${stageDir}/${BUNDLE_NAME}`;
  fs.renameSync(`${stageDir}/nwjs-${version}-${target.platform}`, bundleDir);

  DEVELOPER_TOOLS.forEach(tool => fs.rmSync(`${bundleDir}/${tool}`, { recursive: true, force: true }));

  return bundleDir;
};

//endregion the runtime

//region the game

/**
 * Copies the game into a bundle, then writes the `package.json` it ships with.
 *
 * The shipped manifest is generated rather than copied as-is, because MZ owns the project's own copy and
 * rewrites it. Two things change: the name NW.js files the game's data under, and a version, so a bundle
 * can say which build it is.
 * @param {string} destination The folder NW.js will load the game from.
 * @param {string} version The bundle's version, such as `v0.7.1` or `dev`.
 */
const copyGame = (destination, version) =>
{
  GAME_ENTRIES.forEach(entry => fs.cpSync(`${ROOT}/${GAME_DIR}/${entry}`, `${destination}/${entry}`, { recursive: true }));

  const manifest = JSON.parse(fs.readFileSync(`${ROOT}/${GAME_DIR}/package.json`, 'utf8'));
  const shipped = { ...manifest, name: APP_NAME, version: version.replace(/^v/, '') };

  fs.writeFileSync(`${destination}/package.json`, JSON.stringify(shipped, null, 4));
};

/**
 * Counts the symbolic links under a folder.
 * @param {string} dir The folder to search.
 * @returns {number}
 */
const countSymlinks = dir => fs.readdirSync(dir, { withFileTypes: true })
  .reduce((count, entry) =>
  {
    if (entry.isSymbolicLink()) return count + 1;

    if (entry.isDirectory()) return count + countSymlinks(`${dir}/${entry.name}`);

    return count;
  }, 0);

/**
 * Lays out a Windows or Linux bundle: the game in a `package.nw/` folder beside the runtime, which NW.js
 * loads without being told to, and the runtime renamed to what a player looks for.
 * @param {string} bundleDir The bundle's folder.
 * @param {object} target The target being built.
 * @param {string} version The bundle's version.
 */
const layoutFolder = (bundleDir, target, version) =>
{
  copyGame(`${bundleDir}/package.nw`, version);
  fs.renameSync(`${bundleDir}/${target.binary}`, `${bundleDir}/${target.launcher}`);
};

/**
 * Lays out a Mac bundle: the game inside the app, where NW.js looks for it, then a free ad-hoc signature
 * when this is running on a Mac.
 *
 * Only the app's folder is renamed. The executable inside keeps NW.js's name, because the app's
 * Info.plist and its helper apps find it by that name. Signing has to come last: anything written into
 * the app after it, the game included, breaks the signature again.
 * @param {string} bundleDir The bundle's folder.
 * @param {string} version The bundle's version.
 * @returns {boolean} Whether the app was signed.
 */
const layoutApp = (bundleDir, version) =>
{
  const appPath = `${bundleDir}/${BUNDLE_NAME}.app`;

  fs.renameSync(`${bundleDir}/nwjs.app`, appPath);
  copyGame(`${appPath}/Contents/Resources/app.nw`, version);

  // the runtime's frameworks are reached through symbolic links; an app without any lost them on the way.
  if (countSymlinks(appPath) === 0) throw new Error(`${appPath} has no symbolic links left, so it would not start`);

  if (process.platform !== 'darwin') return false;

  run([ 'codesign', '--force', '--deep', '--sign', '-', appPath ], ROOT);

  return true;
};

/**
 * Writes the player's README into a bundle, stamped with its version.
 * @param {string} bundleDir The bundle's folder.
 * @param {object} target The target being built.
 * @param {string} version The bundle's version.
 */
const writeReadme = (bundleDir, target, version) =>
{
  const template = fs.readFileSync(`${import.meta.dir}/readmes/${target.readme}`, 'utf8');

  fs.writeFileSync(`${bundleDir}/README.txt`, template.replaceAll('{VERSION}', version));
};

/**
 * Packs a staged bundle into the archive a player downloads.
 *
 * Zips go through 7-Zip with `-snl`, which stores the Mac app's symbolic links as links and keeps every
 * file's Unix permissions, so the app unpacks on a Mac exactly as it was built.
 * @param {string} stageDir The staging folder holding the bundle's folder.
 * @param {object} target The target being built.
 * @param {string} version The bundle's version.
 * @returns {string} The archive's path.
 */
const pack = (stageDir, target, version) =>
{
  const archive = `${ROOT}/${DIST_DIR}/${APP_NAME}-${version}-${target.name}.${target.pack}`;

  fs.rmSync(archive, { force: true });

  if (target.pack === 'tar.gz')
  {
    run([ 'tar', '-czf', archive, BUNDLE_NAME ], stageDir);
  }
  else
  {
    run([ '7z', 'a', '-tzip', '-snl', '-bso0', '-bsp0', archive, BUNDLE_NAME ], stageDir);
  }

  return archive;
};

//endregion the game

/**
 * Prints every finding `bun run validate` would report, and answers whether there were none.
 *
 * A bundle is a release candidate, and the checks stop exactly what a player would hit first: a game that
 * starts on a test map, a drop that names a blank row, a plugin that does not match its build.
 * @returns {Promise<boolean>} Whether every check came back clean.
 */
const validateFirst = async () =>
{
  const failing = runChecks(await loadProject(ROOT))
    .filter(({ findings }) => findings.length > 0);

  failing.forEach(({ name, findings }) =>
  {
    console.log(`  FAIL  ${name}`);
    findings.forEach(finding => console.log(`        ${finding}`));
  });

  return failing.length === 0;
};

/**
 * Builds every requested bundle, one after another.
 * @returns {Promise<number>} Exit code - 0 when every bundle was built, 1 when validation refused.
 */
const main = async () =>
{
  const { version, targets } = parseArgs(process.argv.slice(2));
  const nwjsVersion = readPinnedVersion();

  console.log(`bundle: Chef Adventure ${version} on NW.js ${nwjsVersion}, for ${targets.map(({ name }) => name).join(', ')}`);

  if (await validateFirst() === false)
  {
    console.log('bundle: refused, because `bun run validate` does not pass.');

    return 1;
  }

  const checksums = await readChecksums(nwjsVersion);
  const stageRoot = `${ROOT}/${DIST_DIR}/stage`;

  // one at a time on purpose: each staged bundle is half a gigabyte, and the downloads share one connection.
  for (const target of targets)
  {
    const stageDir = `${stageRoot}/${target.name}`;
    fs.rmSync(stageDir, { recursive: true, force: true });

    const runtime = await fetchRuntime(nwjsVersion, target, checksums);
    const bundleDir = unpackRuntime(runtime, target, nwjsVersion, stageDir);

    const signed = target.layout === 'app'
      ? layoutApp(bundleDir, version)
      : false;

    if (target.layout === 'folder') layoutFolder(bundleDir, target, version);

    writeReadme(bundleDir, target, version);

    const archive = pack(stageDir, target, version);
    const megabytes = Math.round(fs.statSync(archive).size / 1048576);
    const note = target.layout === 'app' && signed === false
      ? ' - unsigned, so sign it on a Mac before its first launch'
      : '';

    console.log(`  ${target.name}: ${path.relative(ROOT, archive)} (${megabytes} MB)${note}`);
    fs.rmSync(stageDir, { recursive: true, force: true });
  }

  fs.rmSync(stageRoot, { recursive: true, force: true });
  console.log('bundle: done.');

  return 0;
};

process.exit(await main());