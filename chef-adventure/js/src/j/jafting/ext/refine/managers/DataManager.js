//#region DataManager

/**
 * Whether or not the extra data was loaded into the multiple databases.
 */
DataManager._j ||= {
  /**
   * Whether or not the refinement data from the database has been loaded yet.
   * @type {boolean}
   */
  _refinementDataLoaded: false,
};
//#region save/load data
/**
 * Extends the game object creation to include creating the JAFTING manager.
 */
J.JAFTING.Aliased.DataManager.createGameObjects = DataManager.createGameObjects;
DataManager.createGameObjects = function()
{
  J.JAFTING.Aliased.DataManager.createGameObjects.call(this);
  $gameJAFTING = new Game_JAFTING();
};

/**
 * Extends the save content creation to include creating JAFTING data.
 */
J.JAFTING.Aliased.DataManager.makeSaveContents = DataManager.makeSaveContents;
DataManager.makeSaveContents = function()
{
  const contents = J.JAFTING.Aliased.DataManager.makeSaveContents.call(this);
  contents.jafting = $gameJAFTING;
  return contents;
};

/**
 * Extends the save content extraction to include extracting JAFTING data.
 *
 * NOTE: This is the first function encountered where I actually extend it _twice_.
 * As such, we accommodated that by numbering it.
 */
J.JAFTING.Aliased.DataManager.extractSaveContents2 = DataManager.extractSaveContents;
DataManager.extractSaveContents = function(contents)
{
  J.JAFTING.Aliased.DataManager.extractSaveContents2.call(this, contents);
  $gameJAFTING = contents.jafting;
  $gameJAFTING.updateDataWeapons();
  $gameJAFTING.updateDataArmors();
};
//#endregion save/load data

/**
 * Hooks into the database loading and loads our extra data from notes and such.
 */
J.JAFTING.Aliased.DataManager.isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function()
{
  // check if the database is loaded.
  const result = J.JAFTING.Aliased.DataManager.isDatabaseLoaded.call(this);
  if (result)
  {
    // if it is, then load our refinement data from it.
    this.loadRefinementData();
  }

  // continue with the loading.
  return result;
};

/**
 * Loads the additional required refinement data onto the database objects.
 */
DataManager.loadRefinementData = function()
{
  // check if we have already loaded the refinment data.
  if (!DataManager._j._refinementDataLoaded)
  {
    // load up the weapons and armors refinement data.
    this.loadWeaponRefinementData();
    this.loadArmorRefinementData();

    // set the flag to true so we only do this once.
    this._j._refinementDataLoaded = true;
  }
};

/**
 * Loads the refinement data from the notes of weapons.
 */
DataManager.loadWeaponRefinementData = function()
{
  // iterate over every weapon and process their refinement data.
  $dataWeapons.forEach(DataManager.processEquipForRefinement);
};

/**
 * Loads the refinement data from the notes of armors.
 */
DataManager.loadArmorRefinementData = function()
{
  $dataArmors.forEach(DataManager.processEquipForRefinement);
};

/**
 * The processing of adding the refinement data onto the equip.
 * This works for both weapons and armor.
 * @param {RPG_EquipItem} equip The equip to modify.
 * @param {number} index The index of the equip.
 */
DataManager.processEquipForRefinement = function(equip, index)
{
  // the first equip is always null.
  if (!equip) return;

  // add the JAFTING data onto it.
  equip._jafting = new JAFTING_RefinementData(equip.note, equip.meta);

  // assign the index for refinement reasons.
  equip.index = index;
};
//#endregion DataManager