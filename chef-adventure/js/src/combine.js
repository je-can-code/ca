import glob from 'glob';
import { existsSync } from 'fs';
import * as fs from 'fs/promises';

// whether or not to use the debug logs.
const USE_DEBUG_LOGS = true;

// whether or not to include a timestamp of when this was bundled up.
const USE_BUNDLE_TIMESTAMP = true;

// do the work.
await main();

/**
 * Gets the passed in args, or defaults.
 * @returns {[string, string, string]} The three args.
 */
function getArgs()
{
  const args = process.argv.slice(2);

  const SRC_PATH = args[0] ?? "./src";
  const OUT_PATH = args[1] ?? "../plugins/j";
  const OUT_FILENAME = args[2] ?? "some_plugin.js";

  debuglog(`source path: ${SRC_PATH}`);
  debuglog(`output path: ${OUT_PATH}`);
  debuglog(`output filename: ${OUT_FILENAME}`);

  return [SRC_PATH, OUT_PATH, OUT_FILENAME];
}

/**
 * Validates that the output directory exists.
 * If it does not exist, it will be created.
 * @param {string} output_path The output path to confirm exists. 
 */
async function validateOutputDir(output_path)
{
  // check if the directory is missing.
  if (!existsSync(`${output_path}`))
  {
    // make sure the directory is created.
    await fs.mkdir(output_path, { recursive: true });

    debuglog(`output directory created: ${output_path}`);
  }
  else
  {
    debuglog(`output directory already exists; ${output_path}`);
  }
}

/**
 * Gets all paths associated with the 
 * @returns {string[]} An array of the absolute paths to the js files.
 */
function getFilepaths(src, out)
{
  const options = {
    ignore: ["node_modules/**/*", out],
    absolute: true
  };
  
  const filePaths = glob.sync(`${src}/**/*.js`, options);

  return filePaths;
}

/**
 * Retrieves all the js files as strings.
 * @param {string[]} filePaths The file paths to get js files. 
 * @returns {Promise<string[]>} The js files.
 */
async function getFiles(filePaths)
{
  // initialize the files to collect.
  const files = [];

  // iterate over all the file paths.
  for await (const filePath of filePaths)
  {
    // read the file.
    const file = await fs.readFile(filePath, 'utf-8');
    files.push(file);
  }

  debuglog(`found ${files.length} files to combine.`);

  // returns all the found files.
  return files;
}

/**
 * The main function that will do the work.
 */
async function main()
{
  debuglog(`starting cwd: ${process.cwd()}.`);

  // get the args.
  const [ SRC_PATH, OUT_PATH, OUT_FILENAME ] = getArgs();

  // determine the name.
  const filepathAndName = `${OUT_PATH}/${OUT_FILENAME}`;

  // validate the output directory exists.
  await validateOutputDir(OUT_PATH);

  // get the file paths for all js files to combine.
  const filePaths = getFilepaths(SRC_PATH, OUT_PATH);

  // the files to concat.
  const files = await getFiles(filePaths);

  // check if we're adding the bundle timestamp.
  if (USE_BUNDLE_TIMESTAMP)
  {
    // determine the current timestamp for this bundle.
    const timestamp = new Date(Date.now()).toString();

    // transform the timestamp into a comment at the top of the files.
    const timestampString = `/*  BUNDLED TIME: ${timestamp}  */`;

    // add our timestamp to the front.
    files.unshift(timestampString);
  }

  // concat the files into 1.
  const bundledJs = files.join("\n\n");

  // write the file to the designated location.
  await fs.writeFile(filepathAndName, bundledJs, 'utf-8');

  debuglog(`finished combining ${files.length} files into 1 as ${OUT_FILENAME}`);

  console.log(`combiner has completed execution.`);
}

/**
 * A debug log function to give control over logging.
 * @param {string} text The text to log.
 */
function debuglog(text)
{
  if (!USE_DEBUG_LOGS) return;

  console.log(`| ${text}`);
}