import { exec } from 'child_process';
import pkg from '../package.json' assert { type: 'json' };
import Logger from './logger.js';

// explicitly enable logging.
Logger.enableLogging();

// don't recursively build everything, or start generating a bunch of empty directories.
const ignoredKeys = ["init", "all"];

// extract the scripts section of our package.json.
const { scripts } = pkg;

// initialize the collection of executions.
const executions = [];

// iterate over all the scripts from the "scripts" section of the package.json.
for (const key in scripts)
{
  // ignore the special scripts.
  if (ignoredKeys.includes(key)) continue;

  // skip the watcher scripts.
  if (key.includes("watch")) continue;

  // dictate the command.
  const command = `npm run ${key}`;

  // capture the execution as a promise for parallelization.
  const execution = new Promise(resolve =>
  {
    // kick off the command.
    const process = exec(command, { stdio: "pipe" }, () => resolve());

    // track the output and log it.
    process.stdout.on('data', data => Logger.log(data));
  })

  // add the execution to the collection.
  executions.push(execution);
}

// wait for all the promises to finish.
await Promise.all(executions);
Logger.logAnyway(`Builder™ has completed building all plugins. 💯✅`);