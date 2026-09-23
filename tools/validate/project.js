/**
 * project — load everything the validator reads, once, into one plain object.
 *
 * Every check is a pure function over what this returns, which is what lets the selftest plant a bug
 * by swapping one row in memory and prove the check notices, without ever touching a file on disk.
 */

//region paths

/**
 * Where the MZ project's database lives, relative to the repository root.
 * @type {string}
 */
export const DATA_DIR = 'chef-adventure/data';

/**
 * Where rmmz-plugins' `copy:to-ca` step mirrors its build, relative to the repository root.
 * @type {string}
 */
export const BUILT_PLUGINS_DIR = 'chef-adventure/js/plugins/j';

/**
 * The file rmmz-plugins' build writes beside the plugins to describe them.
 * @type {string}
 */
export const MANIFEST_NAME = 'manifest.json';

/**
 * The MZ-owned database tables, by the name `data/<Name>.json` gives each one.
 * @type {string[]}
 */
export const TABLE_NAMES = [
  'Actors',
  'Animations',
  'Armors',
  'Classes',
  'CommonEvents',
  'Enemies',
  'Items',
  'MapInfos',
  'Skills',
  'States',
  'System',
  'Tilesets',
  'Troops',
  'Weapons',
];

//endregion paths

//region reading

/**
 * Parses one file's text, catching the failure rather than throwing it.
 *
 * A truncated tool write or an interrupted editor save is the thing the parse floor exists to catch,
 * so a failure here is a finding to report, never a crash that hides every other finding.
 * @param {string} text The file's contents.
 * @returns {{ value: any, error: string }} The parsed value, or the parser's complaint.
 */
export const parseJson = text =>
{
  try
  {
    return { value: JSON.parse(text), error: '' };
  }
  catch (error)
  {
    return { value: null, error: error.message };
  }
};

/**
 * Hashes a built plugin's text the same way rmmz-plugins' `generate-manifest` does.
 *
 * Line endings are normalised first, so a checkout configured to convert them cannot make every file
 * look edited.
 * @param {string} text The file's contents.
 * @returns {string} The hex SHA-256 of the LF-normalised text.
 */
export const hashText = text => new Bun.CryptoHasher('sha256')
  .update(text.replaceAll('\r\n', '\n'))
  .digest('hex');

/**
 * Every file under a directory, relative to it, sorted.
 * @param {string} dir The directory to list.
 * @param {string} pattern The glob to match within it.
 * @returns {Promise<string[]>}
 */
const listFiles = async (dir, pattern) =>
{
  const found = [];

  for await (const file of new Bun.Glob(pattern).scan({ cwd: dir, onlyFiles: true }))
  {
    found.push(file.replaceAll('\\', '/'));
  }

  return found.sort();
};

/**
 * Reads the plugin list out of `js/plugins.js`, which MZ writes as a script assigning one JSON array.
 * @param {string} text The file's contents.
 * @returns {object[]} Every registered plugin, with its name, status and parameters.
 */
const parsePluginsJs = text => JSON.parse(text.slice(text.indexOf('['), text.lastIndexOf(']') + 1));

/**
 * Every file git tracks in the repository, as repository-relative paths.
 *
 * Tracked rather than present, because the backups this feeds are only a problem once committed: a
 * backup sitting in a working tree is exactly what `.gitignore` tells authors to keep.
 * @param {string} root The repository root.
 * @returns {string[]}
 */
const listTrackedFiles = root =>
{
  const result = Bun.spawnSync([ 'git', '-C', root, 'ls-files', '-z' ]);

  if (result.exitCode !== 0)
  {
    throw new Error(`git ls-files failed in ${root}: ${result.stderr.toString().trim()}`);
  }

  return result.stdout.toString()
    .split('\0')
    .filter(path => path !== '');
};

/**
 * The map J-ABS clones action events from, as `js/plugins.js` configures it.
 * @param {object[]} plugins Every registered plugin.
 * @returns {number} The action map's id, or 0 when J-ABS is not registered or names none.
 */
const findActionMapId = plugins =>
{
  const jabs = plugins.find(plugin => plugin.name.endsWith('/J-ABS'));

  if (!jabs) return 0;

  return Number(jabs.parameters.actionMapId ?? 0);
};

//endregion reading

/**
 * Loads the whole project.
 *
 * Every `.json` under `data/` is parsed, at any depth, because the parse floor covers all of them;
 * the database tables, maps and plugin configs are then picked out by name for the checks that
 * resolve references. When anything fails to parse, the tables and configs may be incomplete, and the
 * caller is expected to report that before trusting any other check.
 * @param {string} root The repository root.
 * @returns {Promise<object>} The loaded project.
 */
export const loadProject = async root =>
{
  const dataDir = `${root}/${DATA_DIR}`;
  const dataFiles = await listFiles(dataDir, '**/*.json');

  const parsed = new Map();
  const parseFailures = [];

  for (const file of dataFiles)
  {
    const { value, error } = parseJson(await Bun.file(`${dataDir}/${file}`).text());

    if (error === '')
    {
      parsed.set(file, value);
    }
    else
    {
      parseFailures.push({ file: `${DATA_DIR}/${file}`, error });
    }
  }

  const tables = Object.fromEntries(TABLE_NAMES.map(name => [ name, parsed.get(`${name}.json`) ]));

  // maps are keyed by the id in their file name, which is the id MapInfos and transfers use.
  const maps = new Map();
  dataFiles
    .filter(file => /^Map\d+\.json$/.test(file) && parsed.has(file))
    .forEach(file => maps.set(Number(file.slice(3, -5)), parsed.get(file)));

  // plugin configs are keyed by the middle of their name: config.crafting.json is "crafting".
  const configs = new Map();
  dataFiles
    .filter(file => /^config\.[\w-]+\.json$/.test(file) && parsed.has(file))
    .forEach(file => configs.set(file.slice('config.'.length, -'.json'.length), parsed.get(file)));

  const plugins = parsePluginsJs(await Bun.file(`${root}/chef-adventure/js/plugins.js`).text());

  // the manifest is optional in the sense that its absence is a finding, not a crash.
  const builtDir = `${root}/${BUILT_PLUGINS_DIR}`;
  const manifestFile = Bun.file(`${builtDir}/${MANIFEST_NAME}`);
  const manifest = await manifestFile.exists()
    ? JSON.parse(await manifestFile.text())
    : null;

  // every built file but the manifest itself, hashed the way the manifest hashes them.
  const pluginFiles = new Map();
  for (const file of await listFiles(builtDir, '**/*'))
  {
    if (file === MANIFEST_NAME) continue;

    pluginFiles.set(file, hashText(await Bun.file(`${builtDir}/${file}`).text()));
  }

  return {
    root,
    dataFiles: dataFiles.map(file => `${DATA_DIR}/${file}`),
    parseFailures,
    tables,
    maps,
    configs,
    plugins,
    actionMapId: findActionMapId(plugins),
    manifest,
    pluginFiles,
    trackedFiles: listTrackedFiles(root),
  };
};