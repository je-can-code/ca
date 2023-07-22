//region ImageManager
/**
 * Generates a promise based on the resolution of the bitmap.<br/>
 * If the promise resolves successfully, it'll contain the bitmap.<br/>
 * If the promise rejects, then it is up to the handler how to deal with that.<br/>
 * @param {string} filename The name of the file without the file extension.
 * @returns {Promise}
 */
ImageManager.loadHudBitmap = function(filename)
{
  // return the created promise.
  return this.loadBitmapPromise(filename, 'img/hud/');
};
//endregion ImageManager