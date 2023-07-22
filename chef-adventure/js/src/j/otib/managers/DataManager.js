//region DataManager
/**
 * Update save data with new plugin metadata.
 */
J.OTIB.Aliased.DataManager.extractSaveContents = DataManager.extractSaveContents;
DataManager.extractSaveContents = function(contents)
{
  contents.actors._data.forEach(actor =>
  {
    // skip if no actor to work with.
    if (!actor) return;

    // if there are no boosts saved, but boosts in the plugin settings, then assign them.
    if (!actor._j._otibs || !actor._j._otibs.length)
    {
      actor._j._otibs = J.OTIB.Metadata.OneTimeItemBoosts;
      return;
    }

    // update all boosts parameter data with new parameter data.
    J.OTIB.Metadata.OneTimeItemBoosts.forEach(otib =>
    {
      const foundBoost = actor.getOtibById(otib.itemId);
      if (foundBoost)
      {
        foundBoost.parameterData = otib.parameterData;
      }
      else
      {
        actor._j._otibs.push(otib);
      }
    });

    // go through each of the actors boosts and check to make sure they are not
    // stale/removed in the plugin settings.
    actor._j._otibs.forEach(otib =>
    {
      const stillExists = J.OTIB.Metadata.OneTimeItemBoosts
        .findIndex(boost => boost.itemId === otib.itemId);

      if (stillExists === -1)
      {
        actor._j._otibs.splice(stillExists, 1);
      }
    });

    // sort when we're all done because we like to keep porganized.
    actor._j._otibs.sort();
  });

  J.OTIB.Aliased.DataManager.extractSaveContents.call(this, contents);
};
//endregion DataManager