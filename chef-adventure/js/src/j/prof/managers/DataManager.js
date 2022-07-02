//#region DataManager
/**
 * Extends the save content extraction to include updating to the latest plugin metadata.
 */
J.PROF.Aliased.DataManager.set("extractSaveContents", DataManager.extractSaveContents);
DataManager.extractSaveContents = function(contents)
{
  J.PROF.Aliased.DataManager.get("extractSaveContents").call(this, contents);
  $gameParty._j._conditionals = J.PROF.Metadata.ProficiencyConditionals;
  $gameActors._data.forEach(actor =>
  {
    // the first actor in this array is null, just skip it.
    if (!actor) return;

    // update all their conditionals with the latest.

    actor.updateOwnConditionals();
  });

};
//#endregion DataManager