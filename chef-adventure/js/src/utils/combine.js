/**
 * COMBINER
 *
 * OVERVIEW:
 * This nodejs script is intended to be used to quickly combine all files from
 * a single given directory and its subdirectories into a single long file. This
 * can allow an RMMZ plugin dev to build out all the different functions and
 * overrides into separate files to keep things as organized as needed.
 *
 * NOTE:
 * This does not actually transpile or do any fancy footwork about bundling.
 * It literally just concatenates the files together, but thanks to the directory
 * structure convention laid out by the Initter utility I wrote, it works pretty
 * well anyway.
 *
 * USAGE:
 * To use this nodejs script, just run it with three arguments:
 *  1st arg = directory path to combine files from.
 *  2nd arg = output directory path for the single combined file.
 *  3rd arg = The name of the output file.
 *
 * SAMPLE INPUT:
 * $ node combine.js ./j/abs/ext/star ../plugins/j/abs/ext J-ABS-Star.js
 *
 * SAMPLE OUTPUT:
 * 🔊 starting cwd: /mnt/d/dev/code/gaming/ca/chef-adventure/js/src.
 * 🔊 source path: ./j/abs/ext/star
 * 🔊 output path: ../plugins/j/abs/ext
 * 🔊 output filename: J-ABS-Star.js
 * 🔊 output directory already exists; ../plugins/j/abs/ext
 * 🔊 found 12 files to combine.
 * 🔊 finished combining 13 files into 1 as J-ABS-Star.js
 * 👊 Combiner™ has completed execution. 💯✅
 */

import glob from 'glob';
import { existsSync } from 'fs';
import * as fs from 'fs/promises';
import Logger from './logger.js';

// explicitly enable logging.
Logger.enableLogging();

// whether or not to include a timestamp of when this was bundled up.
const USE_BUNDLE_TIMESTAMP = true;

// do the work.
await main();


/**
 * The main function that will do the work.
 */
async function main()
{
  Logger.log(`starting in cwd: ${process.cwd()}`);

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

  Logger.log(`finished combining ${files.length} files into 1 as ${OUT_FILENAME}`);

  Logger.logAnyway(`Combiner™ has completed execution. 💯✅`);
}

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

  Logger.log(`source path: ${SRC_PATH}`);
  Logger.log(`output path: ${OUT_PATH}`);
  Logger.log(`output filename: ${OUT_FILENAME}`);

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

    Logger.log(`output directory created: ${output_path}`);
  }
  else
  {
    Logger.log(`output directory already exists; ${output_path}`);
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

  Logger.log(`found ${files.length} files to combine.`);

  // returns all the found files.
  return files;
}