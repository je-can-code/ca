//#region DataManager
/**
 * Updates existing save files with the updated SDP plugin metadata.
 */
J.SDP.Aliased.DataManager.extractSaveContents = DataManager.extractSaveContents;
DataManager.extractSaveContents = function(contents)
{
  const fromPluginSettingsSdp = $gameSystem._j._sdp;
  const fromSaveFileSdp = contents.system._j._sdp;
  fromSaveFileSdp._panels.forEach(savedSdp =>
  {
    const updatedSdp = fromPluginSettingsSdp._panels
      .find(settingsSdp => settingsSdp.key === savedSdp.key);
    // if the SDP no longer exists, don't do anything with it.
    if (!updatedSdp) return;

    // if it was unlocked before, it stays unlocked.
    if (savedSdp.isUnlocked())
    {
      if (updatedSdp)
      {
        updatedSdp.unlock();
      }
    }
  });

  // update the save file data with the modified plugin settings JAFTING data.
  contents.system._j._sdp = fromPluginSettingsSdp;
  J.SDP.Aliased.DataManager.extractSaveContents.call(this, contents);
};
//#endregion DataManager