//#region Initialization
/*:
 * @target MZ
 * @plugindesc 
 * Mods exclusive to Chef Adventure.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @help
 * These modifications of code are exclusive to Chef Adventure.
 * 
 * New things modified:
 * - variable assignment for a wide variety of battle data points.
 * - additional accessory for all actors (as accessory)
 * - "recover all" recovers TP too
 * - prevent passage on region id 1
 * - random variable assignment for "rare enemies appearance" on map transfer
 * - removal of touch buttons on the map
 * 
 * System adjustments unique to CA:
 * - loot drop x,y adjustment unique to CA
 * - 12% bonus movespeed unique to CA
 */

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.CAMods = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.CAMods.Metadata = {
  /**
   * The version of this plugin.
   */
  Name: `J-CA-Mods`,
};

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.CAMods.PluginParameters = PluginManager.parameters(J.CAMods.Metadata.Name);
J.CAMods.Metadata = {
  ...J.CAMods.Metadata,
  /**
   * The version of this plugin.
   */
  Version: 1.00,
};

/**
 * A collection of data points being tracked for CA, and their respective variable assignment.
 */
J.CAMods.Tracking = {
  EnemiesDefeated: 101,
  DestructiblesDestroyed: 102,
  TotalDamageDealt: 103,
  HighestDamageDealt: 104,
  NumberOfCritsDealt: 105,
  BiggestCritDealt: 106,
  NumberOfParries: 107,
  NumberOfPreciseParries: 108,
  TotalDamageTaken: 109,
  HighestDamageTaken: 110,
  NumberOfCritsTaken: 111,
  BiggestCritTaken: 112,
  MainhandSkillUsage: 113,
  OffhandSkillUsage: 114,
  AssignedSkillUsage: 115,
  DodgeSkillUsage: 116,
  NumberOfDeaths: 117,
};

/**
 * A collection of all aliased methods for this plugin.
 */
J.CAMods.Aliased = {
  Game_Action: {},
  Game_Actor: new Map(),
  Game_BattlerBase: {},
  Game_BattleMap: {},
  Game_Character: {},
  Game_Enemy: new Map(),
  Game_Map: {},
  Game_Party: {},
  Game_Player: {},
  JABS_Battler: {},
  Scene_Boot: new Map(),
};
//#endregion Initialization

//#region Game objects
//#region Game_Action
J.CAMods.Aliased.Game_Action.getAntiNullElementIds = Game_Action.prototype.getAntiNullElementIds;
Game_Action.prototype.getAntiNullElementIds = function()
{
  // elements that should bypass and count despite being 
  return [25, 26, 27];
};
//#endregion Game_Action

//#region Game_Actor
/**
 * Extends the base slots provided to have a duplicate of the 5th type (accessory).
 */
J.CAMods.Aliased.Game_Actor.set("equipSlots", Game_Actor.prototype.equipSlots);
Game_Actor.prototype.equipSlots = function()
{
  const baseSlots = J.CAMods.Aliased.Game_Actor.get("equipSlots").call(this);
  baseSlots.push(5);
  return baseSlots;
};

/**
 * OVERWRITE Forces the map damage flash to always happen because JABS is always in-battle.
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
 * Gets the amount of damage this actor can potentially take from damage floors on this map.
 * @returns {number}
 */
Game_Actor.prototype.calculateFloorDamage = function()
{
  let damage = 0;
  const objectsToCheck = this.floorDamageSources();
  objectsToCheck.forEach(obj => damage += this.extractFloorDamageRate(obj));
  return damage;
};

/**
 * Extracts the damage this object yields for floor damage.
 * @param {rm.types.BaseItem} referenceData The database object to extract from.
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
  const sources = [];
  sources.push($dataMap);
  return sources;
};
//#endregion Game_Actor

//#region Game_BattlerBase
/**
 * Extends the "recover all" event command to also restore all TP to the battlers.
 */
J.CAMods.Aliased.Game_BattlerBase.recoverAll = Game_BattlerBase.prototype.recoverAll;
Game_BattlerBase.prototype.recoverAll = function()
{
  J.CAMods.Aliased.Game_BattlerBase.recoverAll.call(this);
  this._tp = this.maxTp();
};
//#endregion Game_BattlerBase

//#region Game_BattleMap
/**
 * Fixes the weird problem where CA uniquely seems to want to move character sprites up
 * by 1 when generating loot.
 * @param {number} targetX The `x` coordiante where the loot will be dropped/placed.
 * @param {number} targetY The `y` coordinate where the loot will be dropped/placed.
 */
J.CAMods.Aliased.Game_BattleMap.addLootDropToMap = Game_BattleMap.prototype.addLootDropToMap;
Game_BattleMap.prototype.addLootDropToMap = function(targetX, targetY, item)
{
  targetY += 1;
  J.CAMods.Aliased.Game_BattleMap.addLootDropToMap.call(this, targetX, targetY, item);
};

/**
 * Extends the handling of defeated enemies to track data.
 * @param {JABS_Battler} defeatedTarget The `JABS_Battler` that was defeated.
 * @param {JABS_Battler} caster The `JABS_Battler` that defeated the target.
 */
J.CAMods.Aliased.Game_BattleMap.handleDefeatedEnemy = Game_BattleMap.prototype.handleDefeatedEnemy;
Game_BattleMap.prototype.handleDefeatedEnemy = function(defeatedTarget, caster)
{
  J.CAMods.Aliased.Game_BattleMap.handleDefeatedEnemy.call(this, defeatedTarget, caster);

  // determine whether to add to the destructibles count or regular count.
  if (defeatedTarget.isInanimate())
  {
    // add to destructibles destroyed count.
    J.BASE.Helpers.modVariable(J.CAMods.Tracking.DestructiblesDestroyed, 1);
  }
  else
  {
    // add to enemy defeated count.
    J.BASE.Helpers.modVariable(J.CAMods.Tracking.EnemiesDefeated, 1);
  }
};

/**
 * Extends the handling of defeated players to track data.
 */
J.CAMods.Aliased.Game_BattleMap.handleDefeatedPlayer = Game_BattleMap.prototype.handleDefeatedPlayer;
Game_BattleMap.prototype.handleDefeatedPlayer = function()
{
  J.BASE.Helpers.modVariable(J.CAMods.Tracking.NumberOfDeaths, 1);
  J.CAMods.Aliased.Game_BattleMap.handleDefeatedPlayer.call(this);
};

/**
 * Extends the post skill execution function to also track our data in variables.
 * @param {JABS_Action} action The action being executed.
 * @param {JABS_Battler} target The target to apply skill effects against.
 */
J.CAMods.Aliased.Game_BattleMap.postExecuteSkillEffects = Game_BattleMap.prototype.postExecuteSkillEffects;
Game_BattleMap.prototype.postExecuteSkillEffects = function(action, target)
{
  // execute the original method so the result is on the target.
  J.CAMods.Aliased.Game_BattleMap.postExecuteSkillEffects.call(this, action, target);

  // don't track these data points if its a tool.
  if (action.getCooldownType() !== "Tool")
  {
    // if the target is an enemy, track it as attack data.
    if (target.isEnemy())
    {
      this.trackAttackData(target);
    }
    // if the target is an actor, track it as defensive data.
    else if (target.isActor())
    {
      this.trackDefensiveData(target);
    }
  }
};

/**
 * Tracks various attack-related data points and assigns them to variables.
 * @param {JABS_Battler} target The target to analyze.
 */
Game_BattleMap.prototype.trackAttackData = function(target)
{
  const {hpDamage, critical} = target.getBattler().result();
  if (hpDamage)
  {
    // count all damage dealt.
    J.BASE.Helpers.modVariable(J.CAMods.Tracking.TotalDamageDealt, hpDamage);

    // track the highest damage dealt in a single hit.
    const highestDamage = $gameVariables.value(J.CAMods.Tracking.HighestDamageDealt);
    if (hpDamage > highestDamage)
    {
      $gameVariables.setValue(J.CAMods.Tracking.HighestDamageDealt, hpDamage);
    }

    if (critical)
    {
      // count of landed critical hits.
      J.BASE.Helpers.modVariable(J.CAMods.Tracking.NumberOfCritsDealt, 1);

      // track the biggest critical hit landed.
      const biggestCrit = $gameVariables.value(J.CAMods.Tracking.BiggestCritDealt);
      if (hpDamage > biggestCrit)
      {
        $gameVariables.setValue(J.CAMods.Tracking.BiggestCritDealt, hpDamage);
      }
    }
  }
};

/**
 * Tracks various defensive-related data points and assigns them to variables.
 * @param {JABS_Battler} target The target to analyze.
 */
Game_BattleMap.prototype.trackDefensiveData = function(target)
{
  const {hpDamage, critical, parried, preciseParried} = target.getBattler().result();
  if (hpDamage)
  {
    // count all damage received.
    J.BASE.Helpers.modVariable(J.CAMods.Tracking.TotalDamageTaken, hpDamage);

    // track the highest damage received in a single hit.
    const highestDamage = $gameVariables.value(J.CAMods.Tracking.HighestDamageTaken);
    if (hpDamage > highestDamage)
    {
      $gameVariables.setValue(J.CAMods.Tracking.HighestDamageTaken, hpDamage);
    }

    if (critical)
    {
      // count of landed critical hits.
      J.BASE.Helpers.modVariable(J.CAMods.Tracking.NumberOfCritsTaken, 1);

      // track the biggest critical hit landed.
      const biggestCrit = $gameVariables.value(J.CAMods.Tracking.BiggestCritTaken);
      if (hpDamage > biggestCrit)
      {
        $gameVariables.setValue(J.CAMods.Tracking.BiggestCritTaken, hpDamage);
      }
    }

  }
  else if (parried)
  {
    // count of all types of successful parries.
    J.BASE.Helpers.modVariable(J.CAMods.Tracking.NumberOfParries, 1);

    if (preciseParried)
    {
      // count of all types of successful parries.
      J.BASE.Helpers.modVariable(J.CAMods.Tracking.NumberOfPreciseParries, 1);
    }
  }
};

/**
 * Extends the handling of action execution to track data.
 * @param {JABS_Battler} caster The battler executing the action.
 * @param {JABS_Action} action The action being executed.
 * @param {number?} targetX The target's `x` coordinate, if applicable.
 * @param {number?} targetY The target's `y` coordinate, if applicable.
 */
J.CAMods.Aliased.Game_BattleMap.executeMapAction = Game_BattleMap.prototype.executeMapAction;
Game_BattleMap.prototype.executeMapAction = function(caster, action, targetX, targetY)
{
  J.CAMods.Aliased.Game_BattleMap.executeMapAction.call(this, caster, action, targetX, targetY);

  if (caster.isPlayer())
  {
    this.trackActionData(action);
  }
};

/**
 * Tracks mainhand/offhand/skill usage data points and assigns them to variables.
 * @param {JABS_Action} action
 */
Game_BattleMap.prototype.trackActionData = function(action)
{
  const cooldownType = action.getCooldownType();
  switch (cooldownType)
  {
    case Game_Actor.JABS_MAINHAND:
      J.BASE.Helpers.modVariable(J.CAMods.Tracking.MainhandSkillUsage, 1);
      break;
    case Game_Actor.JABS_OFFHAND:
      J.BASE.Helpers.modVariable(J.CAMods.Tracking.OffhandSkillUsage, 1);
      break;
    default:
      J.BASE.Helpers.modVariable(J.CAMods.Tracking.AssignedSkillUsage, 1);
      // any skills
      break;
  }
};
//#endregion Game_BattleMap

//#region Game_Enemy
/**
 * Extends the drop sources to include passive skill states.
 * This isn't a flavor everyone might like, so this is personal functionality instead.
 * @returns {rm.types.BaseItem[]}
 */
J.CAMods.Aliased.Game_Enemy.set("dropSources", Game_Enemy.prototype.dropSources);
Game_Enemy.prototype.dropSources = function()
{
  const sources = J.CAMods.Aliased.Game_Enemy.get("dropSources").call(this);
  sources.push(...$gameParty.extraDropSources());

  return sources;
};

J.CAMods.Aliased.Game_Enemy.set("makeDropItems", Game_Enemy.prototype.makeDropItems);
Game_Enemy.prototype.makeDropItems = function()
{
  if (this.enemy().meta && this.enemy().meta["noDrops"])
  {
    return [];
  }
  else
  {
    return J.CAMods.Aliased.Game_Enemy.get("makeDropItems").call(this);
  }
};
//#endregion Game_Enemy

//#region Game_Map
/**
 * OVERWRITE Disables the ability to walk over tiles with the terrain ID of 1.
 * In practice, this prevents battlers from getting knocked into otherwise
 * unreachable locations, like what is supposed to be ceiling tiles.
 * @param {number} x The `x` coordinate.
 * @param {number} y The `y` coordinate.
 * @param {number} bit The bitwise operator being checked.
 * @returns {boolean} True if the tile can be walked on, false otherwise.
 */
Game_Map.prototype.checkPassage = function(x, y, bit)
{
  const flags = this.tilesetFlags();
  const tiles = this.allTiles(x, y);
  for (const tile of tiles)
  {
    const flag = flags[tile];
    if ((flag & 0x10) !== 0)
    {
      // [*] No effect on passage
      continue;
    }
    if ((flag >> 12) === 1)
    {
      // [Terrain 1] No effect on passage
      return false;
    }
    if ((flag & bit) === 0)
    {
      // [o] Passable
      return true;
    }
    if ((flag & bit) === bit)
    {
      // [x] Impassable
      return false;
    }
  }
  return false;
};

/**
 * Extends `Game_Map.setup()` to conditionally parse out "rare" enemies that only
 * have a chance of appearing.
 */
J.CAMods.Aliased.Game_Map.setup = Game_Map.prototype.setup;
Game_Map.prototype.setup = function(mapId)
{
  J.CAMods.Aliased.Game_Map.setup.call(this, mapId);
  $gameVariables.setValue(13, Math.randomInt(100) + 1);
};
//#endregion Game_Map

//#region Game_Party
/**
 * Gets any additional sources to scan for drops when determining a drop item list on
 * an enemy. In this case, we are including passive skill states to potentially add
 * new items to every enemy.
 * @returns {rm.types.BaseItem[]}
 */
Game_Party.prototype.extraDropSources = function()
{
  const extraSources = [];

  // grab all passive skill states from all the members in the party.
  $gameParty.battleMembers()
    .forEach(member => extraSources.push(...member.allStates()));

  return extraSources;
};
//#endregion Game_Party

//#region Game_Player
/**
 * Extends the distance the player can move per frame by 12%.
 * CA only.
 * @return {number} The modified distance per frame to move.
 */
J.CAMods.Aliased.Game_Player.distancePerFrame = Game_Player.prototype.distancePerFrame;
Game_Player.prototype.distancePerFrame = function()
{
  const base = J.CAMods.Aliased.Game_Player.distancePerFrame.call(this);
  const caOnlyBonus = 1.12;
  return (base * caOnlyBonus);
};
//#endregion Game_Player
//#endregion Game objects

//#region Scene objects
/**
 * Extends the start of everything by turning on dev tools.
 */
J.CAMods.Aliased.Scene_Boot.set('start', Scene_Boot.prototype.start);
Scene_Boot.prototype.start = function()
{
  J.CAMods.Aliased.Scene_Boot.get('start').call(this);

  // show the dev tools automatically.
  SceneManager.showDevTools();

  // set a timer for after the devtools has loaded to focus the game window.
  setTimeout(() => nw.Window.get().focus(), 750);
};

Scene_Base.prototype.buttonAreaHeight = function()
{
  return 0;
};

Scene_Base.prototype.createButtons = function()
{
};

//#region Scene_Map
/**
 * OVERWRITE Removes the buttons on the map/screen.
 */
Scene_Map.prototype.createButtons = function()
{
};
//#endregion Scene_Map
//#endregion Scene objects

//ENDFILE