//region ImageManager
/**
 * Generates a promise based on the resolution of the bitmap.
 * If the promise resolves successfully, it'll contain the bitmap.
 * If the promise rejects, then it is up to the handler how to deal with that.
 * @param {string} filename The name of the file without the file extension.
 * @param {string} directory The name of the directory to find the filename in (include trailing slash!).
 * @returns {Promise}
 */
ImageManager.loadBitmapPromise = function(filename, directory)
{
  // create a promise for the bitmap.
  const bitmapPromise = new Promise((resolve, reject) =>
  {
    // load the bitmap from our designated location.
    const bitmap = this.loadBitmap(`${directory}`, filename, 0, true);

    // and add a listener to the bitmap to resolve _onLoad.
    bitmap.addLoadListener(thisBitmap =>
    {
      // if everything is clear, resolve with the loaded bitmap.
      if (thisBitmap.isReady()) resolve(thisBitmap);

      // if there were problems, then reject.
      else if (thisBitmap.isError()) reject();
    });
  });

  // return the created promise.
  return bitmapPromise;
};

/**
 * The number of columns that exist on the iconsheet.
 * @type {number}
 */
ImageManager.iconColumns = 16;

//endregion ImageManager