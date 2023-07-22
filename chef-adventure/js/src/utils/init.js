/**
 * INITTER
 *
 * OVERVIEW:
 * This nodejs script is intended to be used to quickly scaffold a group of
 * common directories using this opinionated way of dividing up RMMZ plugin
 * code logic.
 *
 * USAGE:
 * To use this nodejs script, just run it with a single argument:
 *  1st arg = root path directory.
 *
 * SAMPLE INPUT:
 * $ node init.js ./j/abs/ext/charge
 *
 * SAMPLE OUTPUT:
 * 🔊 starting in cwd: /mnt/d/dev/code/gaming/ca/chef-adventure/js/src
 * 🔊 dev dir root path: ./j/abs/ext/charge
 * 🔊 output directory created: ./j/abs/ext/charge/_metadata
 * 🔊 output directory created: ./j/abs/ext/charge/_models
 * 🔊 output directory created: ./j/abs/ext/charge/database
 * 🔊 output directory created: ./j/abs/ext/charge/managers
 * 🔊 output directory created: ./j/abs/ext/charge/objects
 * 🔊 output directory created: ./j/abs/ext/charge/scenes
 * 🔊 output directory created: ./j/abs/ext/charge/sprites
 * 🔊 output directory created: ./j/abs/ext/charge/windows
 * 🔊 initialized file: ./j/abs/ext/charge/_metadata/_annotations.js
 * 🔊 initialized file: ./j/abs/ext/charge/_metadata/initialization.js
 * 👊 Initter has completed execution. 💯✅
 */

import { existsSync } from "fs";
import * as fs from 'fs/promises';
import Logger from "./logger.js";

// explicitly enable logging.
Logger.enableLogging();

// the initialization directory name.
// arbitrary, but needs to come first because its at the top of all plugins.
const INIT_DIR_NAME = "_metadata";

// the actual file names for the plugin metadata and setup.
const INIT_FILE_NAMES = [
  "_annotations.js",
  "initialization.js"
];

// an arbitrary list of folders that are the repeatable hierarchy for the combine.js script.
const DEV_DIR_PATHS = [
  INIT_DIR_NAME,
  "_models",
  "database",
  "managers",
  "objects",
  "scenes",
  "sprites",
  "windows",
];

// do the work.
await main();

/**
 * The main function that will do the work.
 */
async function main()
{
  Logger.log(`starting in cwd: ${process.cwd()}`);

  // get the args.
  const templatePaths = getArgs();

  // iterate asynchronously and make all the dev directories.
  for await (const templatePath of templatePaths)
  {
    // create the dev directory.
    await initializePluginDevDirectories(templatePath);

    // autocreate the initialization files, since they are required by all plugins.
    await addInitFiles(templatePath);
  }

  Logger.logAnyway(`Initter™ has completed execution. 💯✅`)
}

/**
 * Gets the passed in args, or defaults.
 * @returns {[string, string, string]} The three args.
 */
function getArgs()
{
  // grab the args.
  const args = process.argv.slice(2);

  // check if we have no args.
  if (!args.length)
  {
    console.error(`please provide the root path to initialize as an argument.`);
    console.error(`if running via npm, use a doubledash: "npm run init -- SOME_ROOT_DIR" to pass args.`);

    // exit because we have no args.
    process.exit(1)
  }

  // extract the template path for the new plugin dev directory.
  const TEMPLATE_PATH = args[0] ?? "./j";
  Logger.log(`dev dir root path: ${TEMPLATE_PATH}`);

  // return what we found.
  return [ TEMPLATE_PATH ];
}

/**
 * Validates that the output directory exists.
 * If it does not exist, it will be created.
 * @param {string} templatePath The output path to scaffold.
 */
async function initializePluginDevDirectories(templatePath)
{
  // iterate asynchronously and make all the dev directories.
  for await (const devDirPath of DEV_DIR_PATHS)
  {
    // the combined dev dir path with the template.
    const dirPath = `${templatePath}/${devDirPath}`;

    // perform the validation or creation.
    await validateOrCreateDirectory(dirPath);
  }
}

/**
 * Validates that the given directory exists.
 * If it does not exists, it will be created.
 * @param {string} dirPath The directory path.
 */
async function validateOrCreateDirectory(dirPath)
{
  // check if the directory is missing.
  if (!existsSync(dirPath))
  {
    // make sure the directory is created.
    await fs.mkdir(dirPath, { recursive: true });
    Logger.log(`output directory created: ${dirPath}`);
  }
  else
  {
    Logger.log(`output directory already exists; ${dirPath}`);
  }
}

/**
 * Adds initialization files to the scaffolding as well.
 * @param {string} template_path The template of the path.
 */
async function addInitFiles(template_path)
{
  // iterate asynchronously and make all the init files.
  for await (const initFileName of INIT_FILE_NAMES)
  {
    // the full file name for the file to create.
    const newFileName = `${template_path}/${INIT_DIR_NAME}/${initFileName}`;

    // write the empty file into existence.
    await fs.writeFile(newFileName, "", 'utf-8');

    Logger.log(`initialized file: ${newFileName}`)
  }
}