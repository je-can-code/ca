//#region ImageManager
/**
 * Checks to see if a character asset is present.
 * @param characterFileName
 * @returns {Promise}
 */
ImageManager.probeCharacter = function(characterFileName)
{
  return new Promise((resolve, reject) =>
  {
    const xhr = new XMLHttpRequest();
    const characterImageUrl = `img/characters/${Utils.encodeURI(characterFileName)}.png`;
    xhr.open("HEAD", characterImageUrl, true);
    xhr.onload = resolve;

    // we have nothing to do with a failure, so we do not process it.
    // xhr.onerror = reject;
    xhr.send();
  });
};

/**
 * Generates a promise based on the resolution of the bitmap.<br/>
 * If the promise resolves successfully, it'll contain the bitmap.<br/>
 * If the promise rejects, then it is up to the handler how to deal with that.<br/>
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

ImageManager.iconColumns = 16;

//#endregion ImageManager