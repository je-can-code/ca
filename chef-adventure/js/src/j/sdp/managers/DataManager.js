//region DataManager
/**
 * Updates existing save files with the updated SDP plugin metadata.
 */
J.SDP.Aliased.DataManager.set('extractSaveContents', DataManager.extractSaveContents);
DataManager.extractSaveContents = function(contents)
{
  // grab the sdp data from the current plugin parameters and the save file.
  const fromPluginParamsPanels = J.SDP.Helpers.TranslateSDPs(J.SDP.PluginParameters['SDPs']);
  const fromSaveFilePanels = contents.system._j._sdp._panels;

  // iterate over all the panels in the save file.
  fromSaveFilePanels.forEach(savedSdp =>
  {
    // grab the most updated panel data from plugin parameters that matches this key.
    const updatedSdp = fromPluginParamsPanels.find(settingsSdp => settingsSdp.key === savedSdp.key);

    // if the panel no longer exists, stop processing.
    if (!updatedSdp)
    {
      console.warn('no SDP found for key', savedSdp.key);
      return;
    }

    // if it was unlocked before, it stays unlocked.
    if (savedSdp.isUnlocked())
    {
      updatedSdp.unlock();
    }
  });

  // update the save file data with the modified plugin settings SDP data.
  contents.system._j._sdp._panels = fromPluginParamsPanels;

  // perform original logic.
  J.SDP.Aliased.DataManager.get('extractSaveContents').call(this, contents);
};
//endregion DataManager