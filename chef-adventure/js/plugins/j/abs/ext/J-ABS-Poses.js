//region annoations
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 POSES] Enable action poses for JABS.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-ABS
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin enables "action poses", or "character sprite animations" within
 * the JABS engine.
 *
 * Integrates with others of mine plugins:
 * - J-Base; to be honest this is just required for all my plugins.
 * - J-ABS; allies and enemies will perform animations for various actions.
 *
 * ----------------------------------------------------------------------------
 * DETAILS:
 * A new functionality for "action poses" or "character sprite animations" is
 * now available by adding a variety of tags across the database. Mind you,
 * this will not animate your character sprites for you, under the hood it will
 * just swap out the regular character sprite defined in the database with
 * another for a given duration, and cycle through the stepping animation.
 *
 * ============================================================================
 * ACTION POSES:
 * Ever want to have your characters visually perform actions on the map when
 * doing things like attacking or casting a spell? Well now you can! By
 * applying the appropriate tags across the various database locations, you too
 * can have pseudo-animated character sprites when taking action!
 *
 * TAG USAGE:
 * - Skills
 * - Items
 *
 * TAG FORMAT:
 *    <poseSuffix:[SUFFIX,INDEX,DURATION]>
 *  Where SUFFIX is the suffix of the filename you want to swap out for.
 *  Where INDEX is the index in the character file to become.
 *  Where DURATION is the amount of frames to remain in this pose.
 *
 * TAG EXAMPLES:
 *    <poseSuffix:[-spell,0,25]>
 * As an example, if the character using the skill was a player with a
 * character sprite named "Actor1", the above tag would look for "Actor1-spell"
 * and swap to the 0th index (the upper left-most character) for 25 frames
 * (which is about a half second).
 *
 * WARNING:
 * This is not a highly tested feature of JABS and may not work as intended.
 * ============================================================================
 * CHANGELOG:
 * - 1.0.0
 *    The initial release.
 * ============================================================================
 *
 * @param parentConfig
 * @text SETUP
 *
 * @param menu-switch
 * @parent parentConfig
 * @type switch
 * @text Menu Switch ID
 * @desc When this switch is ON, then this command is visible in the menu.
 * @default 101
 */
//endregion annotations

//region plugin metadata
class J_PosesPluginMetadata
  extends PluginMetadata
{
  /**
   * Constructor.
   */
  constructor(name, version)
  {
    super(name, version);
  }

  /**
   *  Extends {@link #postInitialize}.<br>
   *  Includes translation of plugin parameters.
   */
  postInitialize()
  {
    // execute original logic.
    super.postInitialize();

    // ensure the user has the required dependencies.
    // TODO: re-add this after JABS uses plugin metadata as well.
    // this.validateHasJabsAtCorrectVersion();

    // initialize this plugin from configuration.
    this.initializeMetadata();
  }

  /**
   * Initializes the metadata associated with this plugin.
   */
  initializeMetadata()
  {
    /**
     * The id of a switch that represents whether or not this system is accessible in the menu.
     * @type {number}
     */
    this.menuSwitchId = parseInt(this.parsedPluginParameters['menu-switch']);
  }

  /**
   * Determine if JABS is available and the proper version to utilize this poses extension.
   * @return {boolean}
   */
  // validateHasJabsAtCorrectVersion()
  // {
  //   // if we're not connected, then do not.
  //   if (!this.hasJabsConnection())
  //   {
  //     throw new Error('JABS was not found to be registered above this plugin');
  //   }
  //
  //   // if we're not high enough version, then do not.
  //   if (!this.hasMinimumJabsVersion())
  //   {
  //     throw new Error('JABS was found to be registered, but not high enough version for this extension.');
  //   }
  //
  //   // lets do it!
  // }
  //
  // /**
  //  * Checks if the plugin metadata is detected for JABS.
  //  * @return {boolean}
  //  */
  // hasJabsConnection()
  // {
  //   // both plugins are not registered.
  //   if (!PluginMetadata.hasPlugin('J-ABS')) return false;
  //
  //   // both plugins are registered, nice!
  //   return true;
  // }
  //
  // /**
  //  * Checks if the JABS system meets the minimum version requirement for connecting with this crafting system.
  //  * @return {boolean}
  //  */
  // hasMinimumJabsVersion()
  // {
  //   // grab the minimum verison.
  //   const minimumVersion = this.minimumJabsVersion();
  //
  //   // check if we meet the minimum version threshold.
  //   const meetsThreshold = J.SDP.Metadata.version
  //     .satisfiesPluginVersion(minimumVersion);
  //
  //   // if the plugin exists but doesn't meet the threshold, then we're not connecting.
  //   if (!meetsThreshold) return false;
  //
  //   // we're good!
  //   return true;
  // }
  //
  // /**
  //  * Gets the current minimum version of the JABS system that supports this plugin.
  //  * @return {PluginVersion}
  //  */
  // minimumJabsVersion()
  // {
  //   return PluginVersion.builder
  //     .major('2')
  //     .minor('4') // TODO: update JABS to 2.5.0 when this plugin is complete.
  //     .patch('0')
  //     .build();
  // }
}

//endregion plugin metadata

//region initialization
/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.ABS.EXT.POSES = {};

/**
 * The plugin umbrella that governs all extensions related to the parent.
 */
J.ABS.EXT.POSES.EXT ||= {};

/**
 * The metadata associated with this plugin.
 */
J.ABS.EXT.POSES.Metadata = new J_PosesPluginMetadata('J-ABS-Poses', '1.0.0');

/**
 * A collection of all aliased methods for this plugin.
 */
J.ABS.EXT.POSES.Aliased = {};
J.ABS.EXT.POSES.Aliased.JABS_Battler = new Map();
J.ABS.EXT.POSES.Aliased.JABS_Engine = new Map();

/**
 * All regular expressions used by this plugin.
 */
J.ABS.EXT.POSES.RegExp = {};
J.ABS.EXT.POSES.RegExp.PoseSuffix = /<poseSuffix:[ ]?(\[[-_]?\w+,[ ]?\d+,[ ]?\d+])>/gi;
//endregion initialization

//region plugin commands
// NO PLUGIN COMMANDS FOR THIS PLUGIN.
//endregion plugin commands

//region RPG_Skill
/**
 * Gets the JABS pose suffix data for this skill.
 *
 * The zeroth index is the string suffix itself (no quotes needed).
 * The first index is the index on the suffixed character sheet.
 * The second index is the number of frames to spend in this pose.
 * @type {[string, number, number]|null}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsPoseData", {
  get: function()
  {
    return this.getJabsPoseData();
  },
});

/**
 * Gets the JABS pose suffix for this skill.
 * @type {string}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsPoseSuffix", {
  get: function()
  {
    return this.jabsPoseData[0];
  },
});

/**
 * Gets the JABS pose index for this skill.
 * @type {number}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsPoseIndex", {
  get: function()
  {
    return this.jabsPoseData[1];
  },
});

/**
 * Gets the JABS pose duration for this skill.
 * @type {number}
 */
Object.defineProperty(RPG_Skill.prototype, "jabsPoseDuration", {
  get: function()
  {
    return this.jabsPoseData[2];
  },
});

/**
 * Gets the JABS pose suffix data for this skill.
 * @returns {[string, number, number]|null}
 */
RPG_Skill.prototype.getJabsPoseData = function()
{
  return this.extractJabsPoseData();
};

/**
 * Extracts the JABS pose suffix data for this skill from its notes.
 * @returns {[string, number, number]|null}
 */
RPG_Skill.prototype.extractJabsPoseData = function()
{
  return this.getArrayFromNotesByRegex(J.ABS.EXT.POSES.RegExp.PoseSuffix, true);
};
//endregion RPG_Skill

//region JABS_Engine
/**
 * Handles the pose functionality behind this action.
 * @param {JABS_Battler} caster The `JABS_Battler` executing the JABS action.
 * @param {JABS_Action} action The JABS action to execute.
 */
JABS_Engine.handleActionPose = function(caster, action)
{
  // perform the action's corresponding pose.
  caster.performActionPose(action.getBaseSkill());
}

J.ABS.EXT.POSES.Aliased.JABS_Engine.set('executeMapAction', JABS_Engine.executeMapAction);
/**
 * Executes the provided JABS action.
 * It generates a copy of an event from the "ActionMap" and fires it off
 * based on it's move route.
 * @param {JABS_Battler} caster The `JABS_Battler` executing the JABS action.
 * @param {JABS_Action} action The JABS action to execute.
 * @param {number?} targetX The target's `x` coordinate, if applicable.
 * @param {number?} targetY The target's `y` coordinate, if applicable.
 */
JABS_Engine.executeMapAction = function(caster, action, targetX, targetY)
{
  // perform original logic.
  J.ABS.EXT.POSES.Aliased.JABS_Engine.get('executeMapAction')
    .call(this, caster, action, targetX, targetY);

  // handle the pose for this forced action.
  this.handleActionPose(caster, action);
}
//endregion JABS_Engine

//region JABS_Battler
//region getters/setters
J.ABS.EXT.POSES.Aliased.JABS_Battler.set('initialize', JABS_Battler.prototype.initialize);
/**
 * Extends {@link #initialize}.<br>
 * Also intializes the pose information.
 * @param {Game_Event} event The event the battler is bound to.
 * @param {Game_Actor|Game_Enemy} battler The battler data itself.
 * @param {JABS_BattlerCoreData} battlerCoreData The core data for the battler.
 */
JABS_Battler.prototype.initialize = function(event, battler, battlerCoreData)
{
  // perform original logic.
  J.ABS.EXT.POSES.Aliased.JABS_Battler.get('initialize')
    .call(this, event, battler, battlerCoreData);

  // also initialize the action poses.
  this.initPoseInfo();
};

/**
 * Initializes the properties of this battler that are related to the character posing.
 */
JABS_Battler.prototype.initPoseInfo = function()
{
  /**
   * The number of frames to pose for.
   * @type {number}
   */
  this._poseFrames = 0;

  /**
   * Whether or not this battler is currently posing.
   * @type {boolean}
   */
  this._posing = false;

  /**
   * The name of the file that contains this battler's character sprite (without extension).
   * @type {string}
   */
  this._baseSpriteImage = String.empty;

  /**
   * The index of this battler's character sprite in the `_baseSpriteImage`.
   * @type {number}
   */
  this._baseSpriteIndex = 0;

  // capture the default/base/original information of this battler upon initialization.
  this.captureBaseSpriteInfo();
};

/**
 * Gets the current number of remaining frames left to be posing.
 */
JABS_Battler.prototype.getPoseFrames = function()
{
  return this._poseFrames;
};

/**
 * Checks whether or not this battler has active pose frames remaining.
 * @returns {boolean}
 */
JABS_Battler.prototype.hasPoseFrames = function()
{
  return this._poseFrames > 0;
};

/**
 * Sets the current number of posing frames to the given amount.<br>
 * Also returns this amount.
 * @param {number} poseFrames The number of frames to pose for.
 */
JABS_Battler.prototype.setPoseFrames = function(poseFrames)
{
  this._poseFrames = poseFrames;
  return this._poseFrames;
};

/**
 * Adds the given amount of frames to the current number of pose frames.<br>
 * Use negative numbers to reduce the frame count by a given amount.
 * @param {number} modPoseFrames The number of frames to modify this amount by.
 */
JABS_Battler.prototype.modPoseFrames = function(modPoseFrames)
{
  this._poseFrames += modPoseFrames;
  return this._poseFrames;
};

/**
 * Gets the original character sprite's image name.
 */
JABS_Battler.prototype.getBaseSpriteImage = function()
{
  return this._baseSpriteImage;
};

/**
 * Sets the name of this battler's original character sprite.
 * @param {string} name The name to set.
 */
JABS_Battler.prototype.setBaseSpriteImage = function(name)
{
  this._baseSpriteImage = name;
};

/**
 * Gets this battler's original character sprite index.
 */
JABS_Battler.prototype.getBaseSpriteIndex = function()
{
  return this._baseSpriteIndex;
};

/**
 * Sets the index of this battler's original character sprite.
 * @param {number} index The index to set.
 */
JABS_Battler.prototype.setBaseSpriteIndex = function(index)
{
  this._baseSpriteIndex = index;
};

/**
 * Gets whether or not this battler is currently posing.
 * @returns {boolean}
 */
JABS_Battler.prototype.isPosing = function()
{
  return this._posing;
};

/**
 * Flags the battler to start posing.
 */
JABS_Battler.prototype.startPosing = function()
{
  this._posing = true;
};

/**
 * Ends the battler's posing status.
 */
JABS_Battler.prototype.endPosing = function()
{
  this._posing = false;
};

/**
 * Initializes the sprite info for this battler.
 */
JABS_Battler.prototype.captureBaseSpriteInfo = function()
{
  this.setBaseSpriteImage(this.getCharacterSpriteName());
  this.setBaseSpriteIndex(this.getCharacterSpriteIndex());
};

/**
 * Gets the name of this battler's current character sprite.
 * @returns {string}
 */
JABS_Battler.prototype.getCharacterSpriteName = function()
{
  return this.getCharacter()._characterName;
};

/**
 * Gets the index of this battler's current character sprite.
 * @returns {number}
 */
JABS_Battler.prototype.getCharacterSpriteIndex = function()
{
  return this.getCharacter()._characterIndex;
};

/**
 * Sets this battler's underlying character's pose pattern.
 * @param {number} pattern The pattern to set for this character.
 */
JABS_Battler.prototype.setPosePattern = function(pattern)
{
  this.getCharacter()._pattern = pattern;
};
//endregion getters/setters

//region execution
/**
 * Executes an action pose.
 * Will silently fail if the asset is missing.
 * @param {RPG_Skill} skill The skill to pose for.
 */
JABS_Battler.prototype.performActionPose = function(skill)
{
  // if we are still animating from a previous skill, prematurely end it.
  if (this._posing)
  {
    this.endAnimation();
  }

  // if we have a pose suffix for this skill, then try to perform the pose.
  if (skill.jabsPoseData)
  {
    this.tryStartPose(skill);
  }
};

/**
 * Executes the change of character sprite based on the action pose data
 * from within a skill's notes.
 * @param {RPG_Skill} skill The skill to pose for.
 */
JABS_Battler.prototype.tryStartPose = function(skill)
{
  // establish the base sprite data.
  const baseSpriteName = this.getCharacterSpriteName();
  this.captureBaseSpriteInfo();

  // define the duration for this pose.
  this.setPoseDuration(skill.jabsPoseDuration);

  // determine the new action pose sprite name.
  const newCharacterSprite = `${baseSpriteName}${skill.jabsPoseSuffix}`;

  // stitch the file path together with the sprite url.
  const spritePath = `img/characters/${Utils.encodeURI(newCharacterSprite)}.png`;

  // check if the sprite exists.
  const spriteExists = StorageManager.fileExists(spritePath);

  // only actually switch to the other character sprite if it exists.
  if (spriteExists)
  {
    // load the character into cache.
    ImageManager.loadCharacter(newCharacterSprite);

    // actually set the character.
    this.getCharacter()
      .setImage(newCharacterSprite, skill.jabsPoseIndex);
  }
  else
  {
    console.warn('Skill executed that declared pose data, but no matching sprite was found.');
    console.warn(`Skill of id [ ${skill.id} ]; consider cross-checking the database with your assets.`);
    console.warn('Parsed JABS pose data:');
    console.warn(skill.jabsPoseData);
  }
};

/**
 * Forcefully ends the pose animation.
 */
JABS_Battler.prototype.endAnimation = function()
{
  // immediately end the animation counter.
  this.setPoseDuration(0);

  // force-reset the pose back to the original one.
  this.resetPose();
};

/**
 * Sets the pose animation count to a given amount.
 * @param {number} frames The number of frames to animate for.
 */
JABS_Battler.prototype.setPoseDuration = function(frames)
{
  // sets the frames to a new amount.
  this.setPoseFrames(frames);

  // updates the posing state by the potentially new state.
  this.normalizePosing();
};

/**
 * Handles the state of posing for this battler based on the current pose frames.
 */
JABS_Battler.prototype.normalizePosing = function()
{
  // validate our animation count is above zero- just in case and start posing.
  if (this.getPoseFrames() > 0)
  {
    this.startPosing();
  }
  // if the animation count not above zero, then stop posing and cleanse the count.
  else
  {
    this.endPosing();
    this.setPoseFrames(0);
  }
};

/**
 * Resets the pose animation for this battler.
 */
JABS_Battler.prototype.resetPose = function()
{
  // don't reset the animation if there is nothing to reset to.
  if (!this.getBaseSpriteImage() && !this.getBaseSpriteIndex()) return;

  // check if we are currently posing.
  if (this.isPosing())
  {
    // stop that.
    this.endAnimation();
  }

  // use variable names to better describe the validation we're about to perform.
  const originalImage = this.getBaseSpriteImage();
  const originalIndex = this.getBaseSpriteIndex();
  const currentImage = this.getCharacterSpriteName();
  const currentIndex = this.getCharacterSpriteIndex();
  const character = this.getCharacter();

  // check if the character image and index are the same as the original.
  if (originalImage !== currentImage || originalIndex !== currentIndex)
  {
    // we are done posing- time to set the image back to the original.
    character.setImage(originalImage, originalIndex);
  }
};
//endregion execution

//region updates
J.ABS.EXT.POSES.Aliased.JABS_Battler.set('update', JABS_Battler.prototype.update);
/**
 * Things that are battler-respective and should be updated on their own.
 */
JABS_Battler.prototype.update = function()
{
  // perform original logic.
  J.ABS.EXT.POSES.Aliased.JABS_Battler.get('update')
    .call(this);

  // also update the pose effects.
  this.updatePoses();
};

/**
 * Update all character sprite animations executing on this battler.
 */
JABS_Battler.prototype.updatePoses = function()
{
  // if we cannot update pose effects, then do not.
  if (!this.canUpdatePoses()) return;

  // countdown the timer for posing.
  this.countdownPoseTimer();

  // manage the actual adjustments to the character's pose pattern.
  this.handlePosePattern();
};

/**
 * Determines whether or not this battler can update its own pose effects.
 * @returns {boolean}
 */
JABS_Battler.prototype.canUpdatePoses = function()
{
  // don't do JABS things if JABS isn't enabled.
  if (!$jabsEngine.absEnabled) return false;

  // we need to be currently animating in order to update animations.
  if (!this.isPosing()) return false;

  // update animations!
  return true;
};

/**
 * Counts down the pose animation frames and manages the pose pattern.
 */
JABS_Battler.prototype.countdownPoseTimer = function()
{
  // if guarding, then do not countdown the pose frames.
  if (this.guarding()) return;

  // check if we are still posing.
  if (this.hasPoseFrames())
  {
    // decrement the pose frames.
    this.modPoseFrames(-1);
  }
};

/**
 * Manages whether or not this battler is posing based on pose frames.
 */
JABS_Battler.prototype.handlePosePattern = function()
{
  // check if we are still posing.
  if (this.hasPoseFrames())
  {
    // manage the current pose pattern based on the animation frame count.
    this.managePosePattern();
  }
  // we are done posing now.
  else
  {
    // reset the pose back to default.
    this.resetPose();
  }
};

/**
 * Watches the current pose frames and adjusts the pose pattern accordingly.
 */
JABS_Battler.prototype.managePosePattern = function()
{

  // TODO: this should be probably optimized in some way?
  // TODO: direction should be dynamically determined based on current facing.


  // if the battler has 4 or less frames left.
  if (this.getPoseFrames() < 4)
  {
    // set the pose pattern to 0, the left side.
    this.setPosePattern(0);
  }
  // check ii the battler has more than 10 frames left.
  else if (this.getPoseFrames() > 10)
  {
    // set the pose pattern to 2, the right side.
    this.setPosePattern(2);
  }
  // the battler is between 5-9 pose frames.
  else
  {
    // set the pose pattern to 1, the middle.
    this.setPosePattern(1);
  }
};
//endregion updates

//region action poses
J.ABS.EXT.POSES.Aliased.JABS_Battler.set('startGuarding', JABS_Battler.prototype.startGuarding);
/**
 * Extends {@link #startGuarding}.
 * Executes an action pose when guarding.
 * @param {string} skillSlot The skill slot containing the guard data.
 */
JABS_Battler.prototype.startGuarding = function(skillSlot)
{
  // perform original logic.
  J.ABS.EXT.POSES.Aliased.JABS_Battler.get('startGuarding')
    .call(this, skillSlot);

  // set the pose!
  const skillId = this.getBattler()
    .getEquippedSkillId(skillSlot);
  const skill = this.getSkill(skillId);
  this.performActionPose(skill);
};

J.ABS.EXT.POSES.Aliased.JABS_Battler.set('executeDodgeSkill', JABS_Battler.prototype.executeDodgeSkill);
/**
 * Executes the provided dodge skill.
 * @param {RPG_Skill} skill The RPG item representing the dodge skill.
 */
JABS_Battler.prototype.executeDodgeSkill = function(skill)
{
  // perform original logic.
  J.ABS.EXT.POSES.Aliased.JABS_Battler.get('executeDodgeSkill')
    .call(this, skill);

  // change over to the action pose for the skill.
  this.performActionPose(skill);

  // TODO: should the function go before or after initial logic?
};
//endregion action poses
//endregion JABS_Battler