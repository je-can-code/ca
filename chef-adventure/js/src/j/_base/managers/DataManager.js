//region DataManager
/**
 * The over-arching object containing all of my added parameters.
 */
DataManager._j ||= {};

//region rewrite data
/**
 * Whether or not the database JSON data has been wrapped yet or not.
 * @type {boolean}
 */
DataManager._j._databaseRewriteProcessed = false;

/**
 * Determines whether or not the database wrapjob has been processed.
 * @returns {boolean}
 */
DataManager.isRewriteProcessed = function()
{
  return this._j._databaseRewriteProcessed;
};

/**
 * Flips the flag to indicate that the database wrapper rewrite
 * has been processed.
 */
DataManager.rewriteProcessed = function()
{
  this._j._databaseRewriteProcessed = true;
};

/**
 * Extends `isDatabaseLoaded` to give a hook to perform additional actions once the databsae is finished loading.
 */
J.BASE.Aliased.DataManager.set('isDatabaseLoaded', DataManager.isDatabaseLoaded);
DataManager.isDatabaseLoaded = function()
{
  const isLoaded = J.BASE.Aliased.DataManager.get('isDatabaseLoaded').call(this);
  if (isLoaded)
  {
    this.onDatabaseLoad();
  }

  return isLoaded;
};

/**
 * Performs additional actions upon the completion of the database loading.
 */
DataManager.onDatabaseLoad = function()
{
  // check to make sure we haven't already rewritten the database objects.
  if (!this.isRewriteProcessed())
  {
    // wrap the database objects with our wrappers.
    this.rewriteDatabaseData();
  }
};

/**
 * Rewrites the JSON objects extracted from the database and replaces them
 * with proper extendable classes.
 */
DataManager.rewriteDatabaseData = function()
{
  // add all the wrappers around the JSON objects from the database.
  this.rewriteActorData();
  this.rewriteArmorData();
  this.rewriteClassData();
  this.rewriteEnemyData();
  this.rewriteItemData();
  this.rewriteSkillData();
  this.rewriteStateData();
  this.rewriteWeaponData();

  // flip the flag so we don't try to wrap them all again.
  this.rewriteProcessed();
};

/**
 * Overwrites all actors used by JABS and replaces them with extendable classes!
 * These operate exactly as they used to, but now give developers a bit more of
 * an interface to work when coding with actors.
 */
DataManager.rewriteActorData = function()
{
  // start up a new collection of actors.
  const classifiedActors = [];

  // iterate over each actor from the database.
  $dataActors.forEach((actor, index) =>
  {
    // check if the actor is null; index 0 always is.
    if (!actor)
    {
      // we should keep the same indexing structure.
      classifiedActors.push(null);

      // and stop after this.
      return;
    }

    // grab a reference to the class we'll be using to rewrite enemies with.
    const actor_class = this.actorRewriteClass();

    // fill out this array like $dataActors normally is filled out.
    classifiedActors.push(new actor_class(actor, index));
  });

  // OVERWRITE the $dataActors object with this new actors array!
  $dataActors = classifiedActors;
};

/**
 * Gets the class reference to use when rewriting actors.
 * The return value of this class should be stored and re-used with
 * the `new` operator; see `DataManager.rewriteActorData()` for an example.
 * @returns {RPG_Enemy} The class reference.
 */
DataManager.actorRewriteClass = function()
{
  return RPG_Actor;
};

/**
 * Overwrites all armors used by JABS and replaces them with extendable classes!
 * These operate exactly as they used to, but now give developers a bit more of
 * an interface to work when coding with armors.
 */
DataManager.rewriteArmorData = function()
{
  // start up a new collection of armors.
  const classifiedArmors = [];

  // iterate over each armor from the database.
  $dataArmors.forEach((armor, index) =>
  {
    // check if the entry is null; index 0 always is.
    if (!armor)
    {
      // we should keep the same indexing structure.
      classifiedArmors.push(null);

      // and stop after this.
      return;
    }

    // grab a reference to the class we'll be using to rewrite armors with.
    const armor_class = this.armorRewriteClass();

    // fill out this array like $dataArmors normally is filled out.
    classifiedArmors.push(new armor_class(armor, index));
  });

  // OVERWRITE the $dataArmors object with this new armors array!
  $dataArmors = classifiedArmors;
};

/**
 * Gets the class reference to use when rewriting armors.
 * The return value of this class should be stored and re-used with
 * the `new` operator; see `DataManager.rewriteArmorData()` for an example.
 * @returns {RPG_Armor} The class reference.
 */
DataManager.armorRewriteClass = function()
{
  return RPG_Armor;
};

/**
 * Overwrites all class used by JABS and replaces them with extendable classes!
 * These operate exactly as they used to, but now give developers a bit more of
 * an interface to work when coding with classes.
 */
DataManager.rewriteClassData = function()
{
  // start up a new collection of classes.
  const classifiedClasses = [];

  // iterate over each class from the database.
  $dataClasses.forEach((klass, index) =>
  {
    // check if the actor is null; index 0 always is.
    if (!klass)
    {
      // we should keep the same indexing structure.
      classifiedClasses.push(null);

      // and stop after this.
      return;
    }

    // grab a reference to the class we'll be using to rewrite enemies with.
    const class_class = this.classRewriteClass();

    // fill out this array like $dataClasses normally is filled out.
    classifiedClasses.push(new class_class(klass, index));
  });

  // OVERWRITE the $dataClasses object with this new actors array!
  $dataClasses = classifiedClasses;
};

/**
 * Gets the class reference to use when rewriting classes.
 * The return value of this class should be stored and re-used with
 * the `new` operator; see `DataManager.rewriteClassData()` for an example.
 * @returns {RPG_Class} The class reference.
 */
DataManager.classRewriteClass = function()
{
  return RPG_Class;
};

/**
 * Overwrites all enemies used by JABS and replaces them with extendable classes!
 * These operate exactly as they used to, but now give developers a bit more of
 * an interface to work when coding with enemies.
 */
DataManager.rewriteEnemyData = function()
{
  // start up a new collection of enemies.
  const classifiedEnemies = [];

  // iterate over each enemy from the database.
  $dataEnemies.forEach((enemy, index) =>
  {
    // check if the enemy is null; index 0 always is.
    if (!enemy)
    {
      // we should keep the same indexing structure.
      classifiedEnemies.push(null);

      // and stop after this.
      return;
    }

    // grab a reference to the class we'll be using to rewrite enemies with.
    const enemy_class = this.enemyRewriteClass();

    // fill out this array like $dataEnemies normally is filled out.
    classifiedEnemies.push(new enemy_class(enemy, index));
  });

  // OVERWRITE the $dataEnemies object with this new enemies array!
  /** @type {RPG_Enemy[]} */
  $dataEnemies = classifiedEnemies;
};

/**
 * Gets the class reference to use when rewriting enemies.
 * The return value of this class should be stored and re-used with
 * the `new` operator; see `DataManager.rewriteEnemyData()` for an example.
 * @returns {RPG_Enemy} The class reference.
 */
DataManager.enemyRewriteClass = function()
{
  return RPG_Enemy;
};

/**
 * Overwrites all items used by JABS and replaces them with extendable classes!
 * These operate exactly as they used to, but now give developers a bit more of
 * an interface to work when coding with items.
 */
DataManager.rewriteItemData = function()
{
  // start up a new collection of items.
  const classifiedItems = [];

  // iterate over each item from the database.
  $dataItems.forEach((item, index) =>
  {
    // check if the enemy is null; index 0 always is.
    if (!item)
    {
      // we should keep the same indexing structure.
      classifiedItems.push(null);

      // and stop after this.
      return;
    }

    // grab a reference to the class we'll be using to rewrite items with.
    const item_class = this.itemRewriteClass();

    // fill out this array like $dataItems normally is filled out.
    classifiedItems.push(new item_class(item, index));
  });

  // OVERWRITE the $dataItems object with this new enemies array!
  $dataItems = classifiedItems;
};

/**
 * Gets the class reference to use when rewriting enemies.
 * The return value of this class should be stored and re-used with
 * the `new` operator; see `DataManager.rewriteItemData()` for an example.
 * @returns {RPG_Item} The class reference.
 */
DataManager.itemRewriteClass = function()
{
  return RPG_Item;
};

/**
 * Overwrites all skills used by JABS and replaces them with extendable classes!
 * These operate exactly as they used to, but now give developers a bit more of
 * an interface to work when coding with skills.
 */
DataManager.rewriteSkillData = function()
{
  // start up a new collection of skills.
  const classifiedSkills = [];

  // iterate over each skill from the database.
  $dataSkills.forEach((skill, index) =>
  {
    // check if the skill is null; index 0 always is.
    if (!skill)
    {
      // we should keep the same indexing structure.
      classifiedSkills.push(null);

      // and stop after this.
      return;
    }

    // grab a reference to the class we'll be using to rewrite skills with.
    const skill_class = this.skillRewriteClass();

    // fill out this array like $dataSkills normally is filled out.
    classifiedSkills.push(new skill_class(skill, index));
  });

  // OVERWRITE the $dataSkills object with this new skills array!
  $dataSkills = classifiedSkills;
};

/**
 * Gets the class reference to use when rewriting skills.
 * The return value of this class should be stored and re-used with
 * the `new` operator; see `DataManager.rewriteSkillData()` for an example.
 * @returns {RPG_Skill} The class reference.
 */
DataManager.skillRewriteClass = function()
{
  return RPG_Skill;
};

/**
 * Overwrites all states used by JABS and replaces them with extendable classes!
 * These operate exactly as they used to, but now give developers a bit more of
 * an interface to work when coding with states.
 */
DataManager.rewriteStateData = function()
{
  // start up a new collection of states.
  const classifiedStates = [];

  // iterate over each state from the database.
  $dataStates.forEach((state, index) =>
  {
    // check if the state is null; index 0 always is.
    if (!state)
    {
      // we should keep the same indexing structure.
      classifiedStates.push(null);

      // and stop after this.
      return;
    }

    // grab a reference to the class we'll be using to rewrite states with.
    const state_class = this.stateRewriteClass();

    // fill out this array like $dataStates normally is filled out.
    classifiedStates.push(new state_class(state, index));
  });

  // OVERWRITE the $dataStates object with this new states array!
  $dataStates = classifiedStates;
};

/**
 * Gets the class reference to use when rewriting states.
 * The return value of this class should be stored and re-used with
 * the `new` operator; see `DataManager.rewriteStateData()` for an example.
 * @returns {RPG_State} The class reference.
 */
DataManager.stateRewriteClass = function()
{
  return RPG_State;
};

/**
 * Overwrites all weapons used by JABS and replaces them with extendable classes!
 * These operate exactly as they used to, but now give developers a bit more of
 * an interface to work when coding with weapons.
 */
DataManager.rewriteWeaponData = function()
{
  // start up a new collection of weapons.
  const classifiedWeapons = [];

  // iterate over each weapon from the database.
  $dataWeapons.forEach((weapon, index) =>
  {
    // check if the skill is null; index 0 always is.
    if (!weapon)
    {
      // we should keep the same indexing structure.
      classifiedWeapons.push(null);

      // and stop after this.
      return;
    }

    // grab a reference to the class we'll be using to rewrite weapons with.
    const weapon_class = this.weaponRewriteClass();

    // fill out this array like $dataWeapons normally is filled out.
    classifiedWeapons.push(new weapon_class(weapon, index));
  });

  // OVERWRITE the $dataWeapons object with this new skills array!
  $dataWeapons = classifiedWeapons;
};

/**
 * Gets the class reference to use when rewriting weapons.
 * The return value of this class should be stored and re-used with
 * the `new` operator; see `DataManager.rewriteWeaponData()` for an example.
 * @returns {RPG_Weapon} The class reference.
 */
DataManager.weaponRewriteClass = function()
{
  return RPG_Weapon;
};
//endregion rewrite data

/**
 * Checks whether or not the unidentified object is a skill.
 * @param {RPG_Armor|RPG_Weapon|RPG_Item|RPG_Skill} unidentified The unidentified object.
 * @returns {boolean} True if the object is a skill, false otherwise.
 */
DataManager.isSkill = function(unidentified)
{
  return unidentified && ('stypeId' in unidentified);
};

/**
 * Checks whether or not the unidentified object is an item.
 * @param {RPG_Armor|RPG_Weapon|RPG_Item|RPG_Skill} unidentified The unidentified object.
 * @returns {boolean} True if the object is an item, false otherwise.
 */
DataManager.isItem = function(unidentified)
{
  return unidentified && ('itypeId' in unidentified);
};

/**
 * Checks whether or not the unidentified object is a weapon.
 * @param {RPG_Armor|RPG_Weapon|RPG_Item|RPG_Skill} unidentified The unidentified object.
 * @returns {boolean} True if the object is a weapon, false otherwise.
 */
DataManager.isWeapon = function(unidentified)
{
  return unidentified && ('wtypeId' in unidentified);
};

/**
 * Checks whether or not the unidentified object is an armor.
 * @param {RPG_Armor|RPG_Weapon|RPG_Item|RPG_Skill} unidentified The unidentified object.
 * @returns {boolean} True if the object is an armor, false otherwise.
 */
DataManager.isArmor = function(unidentified)
{
  return unidentified && ('atypeId' in unidentified);
};
//endregion DataManager