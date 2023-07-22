//region Game_Actor
/**
 * Extends {@link #equipSlots}.
 * Adds a duplicate of the 5th type (accessory).
 */
J.CAMods.Aliased.Game_Actor.set("equipSlots", Game_Actor.prototype.equipSlots);
Game_Actor.prototype.equipSlots = function()
{
  // perform original logic to determine the base slots.
  const baseSlots = J.CAMods.Aliased.Game_Actor.get("equipSlots").call(this);

  // add a copy of the 5th equip type at the end of the list.
  baseSlots.push(5);

  // return the updated equip slots.
  return baseSlots;
};

/**
 * Overwrites {@link #performMapDamage}.
 * Forces the map damage flash to always happen because JABS is always in-battle.
 * Also shows an animation on the player when they take damage.
 */
Game_Actor.prototype.performMapDamage = function()
{
  // always flash the screen if taking damage.
  $gameScreen.startFlashForDamage();

  // always show an animation if taking damage.
  // TODO: add a tag for this when you need non-poison floors, ex: lava.
  $gamePlayer.requestAnimation(59, false);
};

/**
 * Extends {@link #basicFloorDamage}.
 * Replaces logic if there is a $dataMap available with calculated damage instead.
 */
J.CAMods.Aliased.Game_Actor.set("basicFloorDamage", Game_Actor.prototype.basicFloorDamage);
Game_Actor.prototype.basicFloorDamage = function()
{
  if (!$dataMap || !$dataMap.meta)
  {
    return J.CAMods.Aliased.Game_Actor.get("basicFloorDamage").call(this);
  }
  else
  {
    return this.calculateFloorDamage();
  }
};

/**
 * Calculates the amount of damage received from stepping on damage floors.
 * @returns {number}
 */
Game_Actor.prototype.calculateFloorDamage = function()
{
  // initialize damage to 0.
  let damage = 0;

  // grab all sources to get damage rates from.
  const objectsToCheck = this.floorDamageSources();

  // iterate over each of the sources to add to the damage.
  objectsToCheck.forEach(obj => damage += this.extractFloorDamageRate(obj));

  // return the calculated amount.
  return damage;
};

/**
 * Extracts the damage this object yields for floor damage.
 * @param {RPG_BaseItem} referenceData The database object to extract from.
 * @returns {number}
 */
Game_Actor.prototype.extractFloorDamageRate = function(referenceData)
{
  // if for some reason there is no note, then don't try to parse it.
  if (!referenceData.note) return 0;

  const notedata = referenceData.note.split(/[\r\n]+/);
  const structure1 = /<damageFlat:[ ]?([\d]+)>/i;
  const structure2 = /<damagePerc:[ ]?([\d]+)>/i;
  let damage = 0;
  notedata.forEach(line =>
  {
    // if we have flat damage, add that to the mix.
    if (line.match(structure1))
    {
      const flatDamage = parseInt(RegExp.$1);
      damage += flatDamage;
    }

    // if we have percent damage, calculate it and add it to the mix.
    if (line.match(structure2))
    {
      const percentDamage = (parseInt(RegExp.$1) / 100) * this.mhp;
      damage += percentDamage;
    }
  });

  return damage;
};

/**
 * Gets all sources that can possibly yield damage by stepping.
 * Open for extension.
 * @returns {*[]}
 */
Game_Actor.prototype.floorDamageSources = function()
{
  // start with no sources.
  const sources = [];

  // add the datamap as a source.
  sources.push($dataMap);

  // return the source collection.
  return sources;
};

/**
 * Refreshes all auto-equippable skills available to this battler.
 */
Game_Actor.prototype.refreshAutoEquippedSkills = function()
{
  const allSlots = this.getAllEquippedSkills();

  // iterate over each of the skills and auto-assign/equip them where applicable.
  this.skills().forEach(skill =>
  {
    // extract the skill id.
    const skillId = skill.id;

    // don't autoassign the same skill if a slot already has it somehow.
    if (allSlots.some(slot => slot.id === skillId)) return;

    // process the learned skill!
    this.jabsProcessLearnedSkill(skill.id);
  }, this);
};
//endregion Game_Actor