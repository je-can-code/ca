/**
 * Checks whether or not a file exists given the path with the file name.
 * @param pathWithFile
 * @returns {boolean}
 */
StorageManager.fileExists = function(pathWithFile)
{
  // import the "fs" nodejs library.
  const fs = require("fs");

  // return whether or not a file exists at the given path.
  return fs.existsSync(pathWithFile);
};