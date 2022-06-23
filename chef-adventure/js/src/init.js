import { existsSync } from "fs";
import * as fs from 'fs/promises';

// whether or not to use the debug logs.
const USE_DEBUG_LOGS = true;

// an arbitrary list of folders that are the repeatable hierarchy for the combine.js script.
const DEV_DIR_PATHS = [
  "_metadata",
  "_models",
  "database",
  "managers",
  "objects",
  "scenes",
  "sprites",
  "windows",
]

// do the work.
await main();

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
  debuglog(`dev dir root path: ${TEMPLATE_PATH}`);

  // return what we found.
  return [ TEMPLATE_PATH ];
}

/**
 * Validates that the output directory exists.
 * If it does not exist, it will be created.
 * @param {string} template_path The output path to confirm exists.
 */
async function initializePluginDevDirectory(template_path)
{
  // iterate asynchronously and make all the dev directories.
  for await (const devDirPath of DEV_DIR_PATHS)
  {
    // the combined dev dir path with the template.
    const dirPath = `${template_path}/${devDirPath}`;

    // check if the directory is missing.
    if (!existsSync(dirPath))
    {
      // make sure the directory is created.
      await fs.mkdir(dirPath, { recursive: true });
      debuglog(`output directory created: ${dirPath}`);
    }
    else
    {
      debuglog(`output directory already exists; ${dirPath}`);
    }
  }
}

/**
 * The main function that will do the work.
 */
async function main()
{
  // get the args.
  const [ TEMPLATE_PATH ] = getArgs();

  // validate the initialized directory exists.
  await initializePluginDevDirectory(TEMPLATE_PATH);
}

/**
 * A debug log function to give control over logging.
 * @param {string} text The text to log.
 */
function debuglog(text)
{
  // don't log if we're not using debug.
  if (!USE_DEBUG_LOGS) return;

  console.log(`| ${text}`);
}