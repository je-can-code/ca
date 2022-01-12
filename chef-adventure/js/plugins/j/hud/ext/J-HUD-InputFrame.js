//#region introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0 HUD-INPUT] A HUD frame that displays your leader's buttons data.
 * @author JE
 * @url https://github.com/je-can-code/rmmz
 * @base J-HUD
 * @orderAfter J-HUD
 * @help
 * ============================================================================
 * This plugin is an extension of the J-HUD system.
 *
 * This is the Input Frame, which displays the various action keys and their
 * corresponding cooldown and cost data points for the leader of the party.
 *
 * This includes the following data points for the currently selected leader:
 * - main and offhand action keys
 * - tool and dodge action keys
 * - ability keys (L1 + A/B/X/Y) action keys
 * - ability costs for all action keys, or item count remaining for tool.
 * ============================================================================
 */

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

//#region version checks
(() =>
{
  // Check to ensure we have the minimum required version of the J-Base plugin.
  const requiredBaseVersion = '1.0.0';
  const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
  if (!hasBaseRequirement)
  {
    throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
  }
})();
//#endregion version check

//#region metadata
/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.HUD.EXT_INPUT = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.HUD.EXT_INPUT = {};
J.HUD.EXT_INPUT.Metadata = {};
J.HUD.EXT_INPUT.Metadata.Version = '1.0.0';
J.HUD.EXT_INPUT.Metadata.Name = `J-HUD-InputFrame`;

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.HUD.EXT_INPUT.PluginParameters = PluginManager.parameters(J.HUD.EXT_INPUT.Metadata.Name);

/**
 * Extend this plugin's metadata with additional configurable data points.
 */
J.HUD.EXT_INPUT.Metadata =
  {
    // the previously defined metadata.
    ...J.HUD.EXT_INPUT.Metadata,

    // our configurable data points.
    InputFrameX: Number(J.HUD.EXT_INPUT.PluginParameters['inputFrameX']),
    InputFrameY: Number(J.HUD.EXT_INPUT.PluginParameters['inputFrameY']),
  };

/**
 * A collection of all aliased methods for this plugin.
 */
J.HUD.EXT_INPUT.Aliased = {
  Scene_Map: new Map(),
};
//#endregion metadata

//#region plugin commands
/**
 * Plugin command for hiding the hud.
 */
PluginManager.registerCommand(J.HUD.EXT_PARTY.Metadata.Name, "hideHud", () =>
{
  $hudManager.requestHideHud();
});

/**
 * Plugin command for showing the hud.
 */
PluginManager.registerCommand(J.HUD.EXT_PARTY.Metadata.Name, "showHud", () =>
{
  $hudManager.requestShowHud();
});

/**
 * Plugin command for hiding allies in the hud.
 */
PluginManager.registerCommand(J.HUD.EXT_PARTY.Metadata.Name, "hideAllies", () =>
{
  $hudManager.requestHideAllies();
});

/**
 * Plugin command for showing allies in the hud.
 */
PluginManager.registerCommand(J.HUD.EXT_PARTY.Metadata.Name, "showAllies", () =>
{
  $hudManager.requestShowAllies();
});

/**
 * Plugin command for refreshing the hud.
 */
PluginManager.registerCommand(J.HUD.EXT_PARTY.Metadata.Name, "refreshHud", () =>
{
  $hudManager.requestRefreshHud();
});

/**
 * Plugin command for refreshing the hud's image cache.
 */
PluginManager.registerCommand(J.HUD.EXT_PARTY.Metadata.Name, "refreshImageCache", () =>
{
  $hudManager.requestRefreshImageCache();
});
//#endregion plugin commands

//#endregion introduction

//#region Scene objects
//#region Scene_Map
/**
 * Hooks into `initialize` to add our hud.
 */
J.HUD.EXT_INPUT.Aliased.Scene_Map.set('initialize', Scene_Map.prototype.initialize);
Scene_Map.prototype.initialize = function()
{
  // perform original logic.
  J.HUD.EXT_INPUT.Aliased.Scene_Map.get('initialize').call(this);

  /**
   * All encompassing _j object for storing my custom properties.
   */
  this._j ||= {};

  /**
   * The input frame window on the map.
   * @type {Window_InputFrame}
   */
  this._j._inputFrame = null;
};

/**
 * Once the map is loaded, create the text log.
 */
J.HUD.EXT_INPUT.Aliased.Scene_Map.set('createAllWindows', Scene_Map.prototype.createAllWindows);
Scene_Map.prototype.createAllWindows = function()
{
  // perform original logic.
  J.HUD.EXT_INPUT.Aliased.Scene_Map.get('createAllWindows').call(this);

  // create the target frame.
  this.createInputFrame();
};

/**
 * Creates the log window and adds it to tracking.
 */
Scene_Map.prototype.createInputFrame = function()
{
  // create the rectangle of the window.
  const rect = this.inputFrameWindowRect();

  // assign the window to our reference.
  this._j._inputFrame = new Window_InputFrame(rect);

  // add window to tracking.
  this.addWindow(this._j._inputFrame);
};

/**
 * Creates the rectangle representing the window for the map hud.
 * @returns {Rectangle}
 */
Scene_Map.prototype.inputFrameWindowRect = function()
{
  const width = 500;
  const height = 160;
  const x = Graphics.boxWidth - width;
  const y = Graphics.boxHeight - height;
  return new Rectangle(x, y, width, height);
};

/**
 * Extend the update loop for the input frame.
 */
J.HUD.EXT_INPUT.Aliased.Scene_Map.set('updateHudFrames', Scene_Map.prototype.updateHudFrames);
Scene_Map.prototype.updateHudFrames = function()
{
  // perform original logic.
  J.HUD.EXT_INPUT.Aliased.Scene_Map.get('updateHudFrames').call(this);

  // manages hud refreshes.
  this.handleInputFrameUpdate();
};

/**
 * Processes incoming requests regarding the input frame.
 */
Scene_Map.prototype.handleInputFrameUpdate = function()
{
  // handles incoming requests to refresh the input frame.
  this.handleRefreshInputFrame();
};

/**
 * Processes incoming requests regarding the input frame.
 */
Scene_Map.prototype.handleRefreshInputFrame = function()
{
  // handles incoming requests to refresh the input frame.
  if ($hudManager.hasRequestRefreshInputFrame())
  {
    // refresh the input frame.
    this._j._inputFrame.refresh();

    // let the hud manager know we've done the deed.
    $hudManager.acknowledgeRefreshInputFrame();
  }
};

/**
 * Refreshes the hud on-command.
 */
J.HUD.EXT_INPUT.Aliased.Scene_Map.set('refreshHud', Scene_Map.prototype.refreshHud);
Scene_Map.prototype.refreshHud = function()
{
  // perform original logic.
  J.HUD.EXT_INPUT.Aliased.Scene_Map.get('refreshHud').call(this);

  // refresh the input frame.
  this._j._inputFrame.refreshCache();
  this._j._inputFrame.refresh();
};
//#endregion Scene_Map
//#endregion Scene objects

//#region Sprite objects
//#region Sprite_SkillSlotIcon
/**
 * A sprite that displays the icon represented by the assigned skill slot.
 */
class Sprite_SkillSlotIcon extends Sprite_Icon
{
  /**
   * Initializes this sprite with the designated icon.
   * @param {number} iconIndex The icon index of the icon for this sprite.
   * @param {JABS_SkillSlot} skillSlot The skill slot to monitor.
   */
  initialize(iconIndex = 0, skillSlot = null)
  {
    // perform original logic.
    super.initialize(iconIndex);

    // assign the skill slot to this sprite.
    this.setSkillSlot(skillSlot);
  };

  /**
   * Initialize all properties of this class.
   */
  initMembers()
  {
    // perform original logic.
    super.initMembers();

    /**
     * The skill slot that this sprite is watching.
     * @type {JABS_SkillSlot|null}
     */
    this._j._skillSlot = null;
  };

  /**
   * Sets the skill slot for this sprite's icon.
   * @param {JABS_SkillSlot} skillSlot The skill slot being assigned.
   */
  setSkillSlot(skillSlot)
  {
    this._j._skillSlot = skillSlot;
  };

  /**
   * Gets whether or not there is a skill slot currently being tracked.
   * @returns {boolean}
   */
  hasSkillSlot()
  {
    return !!this._j._skillSlot;
  };

  /**
   * Gets the skill slot currently assigned to this sprite.
   * @returns {JABS_SkillSlot|null}
   */
  skillSlot()
  {
    return this._j._skillSlot;
  };

  /**
   * Gets the icon associated with the tracked skill slot.
   * @returns {number}
   */
  skillSlotIcon()
  {
    // if there is no skill slot, return whatever is currently there.
    if (!this.hasSkillSlot()) return this._j._iconIndex;

    // if there is no leader, do not try to translate the slot into an icon.
    if (!$gameParty.leader()) return this._j._iconIndex;

    // if we are leveraging skill extensions, then grab the appropriate skill.
    let skill = this.skillSlot().data($gameParty.leader());

    // if nothing was in the slot, then don't draw it.
    if (!skill) return 0;

    // return the skill's icon index.
    return skill.iconIndex;
  };

  /**
   * The `JABS_Button` key that this skill slot belongs to.
   * @returns {string}
   */
  skillSlotKey()
  {
    return this._j._skillSlot.key;
  };

  /**
   * Gets the id of the skill associated with the currently assigned skill slot.
   * Accommodates skill comboing.
   * @returns {number}
   */
  skillSlotId()
  {
    // grab the cooldown data and the skillslot data from the leader based on the slot.
    const actionKeyData = $gameBattleMap
      .getPlayerMapBattler()
      .getActionKeyData(this.skillSlotKey());

    // if there is no data associated with this, then just return the id in the slot.
    if (!actionKeyData) return this._j._skillSlot.id;

    // check the comboing to see if we have a combo skill in the slot.
    const cooldownData = actionKeyData.cooldown;
    const skillId = (cooldownData.comboNextActionId > 0)
      ? cooldownData.comboNextActionId
      : this._j._skillSlot.id;

    // return the found id.
    return skillId;
  };

  /**
   * Extends the `update()` to monitor the icon index in case it changes.
   */
  update()
  {
    // perform original logic.
    super.update();

    // keep the icon index in-sync with the skill slot.
    this.synchronizeIconIndex();
  };

  synchronizeIconIndex()
  {
    // check if the icon index for this icon is up to date.
    if (this.iconIndex() !== this.skillSlotIcon())
    {
      // if it isn't, update it.
      this.setIconIndex(this.skillSlotIcon());
    }
  };

  /**
   * Upon becoming ready, execute this logic.
   * In this sprite's case, we render ourselves.
   * @param {number} iconIndex The icon index of this sprite.
   */
  onReady(iconIndex = 0)
  {
    // perform original logic.
    super.onReady(iconIndex);

    // only perform this logic if we have a skill slot.
    if (this.hasSkillSlot())
    {
      // set the icon index to be whatever the skill slot's icon is.
      this.setIconIndex(this.skillSlotIcon());
    }
  };
}
//#endregion Sprite_SkillIcon

//#region Sprite_BaseSkillSlot
/**
 * A sprite that represents a skill slot.
 * This is a base class for other things that need data from a skill slot.
 */
class Sprite_BaseSkillSlot extends Sprite_BaseText
{
  /**
   * Extend initialization of the sprite to assign a skill slot for tracking.
   * @param {JABS_SkillSlot} skillSlot The skill slot to track the name of.
   */
  initialize(skillSlot)
  {
    // perform original logic.
    super.initialize(String.empty);

    // sets the skill slot to trigger a refresh.
    this.setSkillSlot(skillSlot);
  };

  /**
   * Initialize all properties of this class.
   */
  initMembers()
  {
    // perform original logic.
    super.initMembers();

    /**
     * The skill slot associated with this sprite.
     * @type {JABS_SkillSlot|null}
     */
    this._j._skillSlot = null;
  };

  /**
   * Gets the skill slot associated with this sprite.
   * @returns {JABS_SkillSlot|null}
   */
  skillSlot()
  {
    return this._j._skillSlot;
  };

  /**
   * Gets whether or not there is a skill slot presently
   * assigned to this sprite.
   * @returns {boolean}
   */
  hasSkillSlot()
  {
    return !!this._j._skillSlot;
  };

  /**
   * Sets the skill slot for this sprite.
   * @param {JABS_SkillSlot} skillSlot The skill slot to assign.
   */
  setSkillSlot(skillSlot)
  {
    this._j._skillSlot = skillSlot;
    this.setText(this.skillName());
  };

  /**
   * Gets whether or not this slot is for an item instead of a skill.
   * @returns {boolean}
   */
  isItem()
  {
    return this.skillSlot().isItem();
  };

  /**
   * Get the cooldown data associated with the battler that owns
   * this skill slot.
   * @returns {JABS_Cooldown|null}
   */
  cooldownData()
  {
    // if we have no slot data, then we have no cooldown data.
    if (!this.hasSkillSlot()) return null;

    const jabsBattler = this.targetJabsBattler();

    if (!jabsBattler) return null;

    const inputType = this.skillSlot().key;

    // grab the cooldown data from the leader based on this slot.
    return jabsBattler.getCooldown(inputType);
  };

  /**
   * Gets the target `JABS_Battler` associated with this sprite.
   * @returns {JABS_Battler|null}
   */
  targetJabsBattler()
  {
    return $gameBattleMap.getPlayerMapBattler();
  };

  /**
   * Gets the target `Game_Actor` or `Game_Enemy`
   * @returns {Game_Actor|Game_Enemy|null}
   */
  targetBattler()
  {
    const jabsBattler = this.targetJabsBattler();
    if (!jabsBattler) return null;

    return jabsBattler.getBattler();
  };

  /**
   * Gets the skill currently assigned to the skill slot.
   * @returns {rm.types.Skill|null}
   */
  skill()
  {
    // if we do not have a skill slot, then the name is empty.
    if (!this.hasSkillSlot()) return null;

    // grab the cooldown data from the leader based on this slot.
    const cooldownData = this.cooldownData();

    // if we have no action key data for this slot, don't draw it.
    if (!cooldownData) return null;

    // grab the skill itself, either extended or not.
    return this.skillSlot().data(this.targetBattler(), this.skillId());
  };

  /**
   * Gets the skill (or item) id of the assigned ability of this skill slot.
   * Accommodates the possibility of
   * @returns {number}
   */
  skillId()
  {
    // the base id is of the skill slot's id.
    const skillId = this.skillSlot().id;

    // if it is an item, then the base skill id is the only id.
    if (this.skillSlot().isItem()) return skillId;

    // grab the cooldown data for this skill.
    const cooldownData = this.cooldownData();

    // if there is none, then return the default.
    if (!cooldownData) return skillId;

    // see if we should be grabbing the next combo skill, or this skill.
    const hasNextSkill = cooldownData.comboNextActionId > 0;
    return hasNextSkill
      ? cooldownData.comboNextActionId  // return the next skill in the combo.
      : skillId;                        // return the current skill.
  };

  /**
   * Gets the skill name of the skill currently in the slot.
   * This accommodates the possibility of combos and skill extensions.
   * @returns {string} The name of the skill.
   */
  skillName()
  {
    // grab the skill itself, either extended or not.
    let skill = this.skill();

    // if no skill is in the slot, then the name is empty.
    if (!skill) return String.empty;

    // return the found name.
    return skill.name;
  };
}
//#endregion Sprite_BaseSkillSlot

//#region Sprite_SkillName
/**
 * A sprite that represents a skill slot's assigned skill's name.
 */
class Sprite_SkillName extends Sprite_BaseSkillSlot
{
  /**
   * OVERWRITE Gets the font size for this sprite's text.
   * Skill names are hard-coded to be a fixed size, 12.
   * @returns {number}
   */
  fontSize()
  {
    return 12;
  };

  /**
   * Extends the `update()` to also synchronize the text to
   * match the skill slot it is
   */
  update()
  {
    // perform original logic.
    super.update();

    // sync the text.
    this.synchronizeText();
  };

  /**
   * Synchronizes the text with the underlying skill inside the
   * tracked skill slot. This allows dynamic updating when the slot
   * changes skill due to combos and such.
   */
  synchronizeText()
  {
    // check if the icon index for this icon is up to date.
    if (this.text() !== this.skillName())
    {
      // if it isn't, update it.
      this.setText(this.skillName());
    }
  };
}
//#endregion Sprite_SkillName

//#region Sprite_SkillCost
/**
 * A sprite that represents a skill slot's assigned skill's mp cost.
 */
class Sprite_SkillCost extends Sprite_BaseSkillSlot
{
  /**
   * The supported types of skill costs for this sprite.
   */
  static Types = {
    HP: "hp",
    MP: "mp",
    TP: "tp",
    Item: "item"
  };

  /**
   * Extend initialization of the sprite to assign a skill slot for tracking.
   * @param {JABS_SkillSlot} skillSlot The skill slot to track the name of.
   * @param {Sprite_SkillCost.Types} skillCostType The skillcost type for this sprite.
   */
  initialize(skillSlot, skillCostType)
  {
    // perform original logic.
    super.initialize(skillSlot);

    // assign the skill cost type to this sprite.
    this.setSkillCostType(skillCostType);
  };

  /**
   * Initialize all properties of this class.
   */
  initMembers()
  {
    // perform original logic.
    super.initMembers();

    /**
     * The skill cost type.
     * @type {Sprite_SkillCost.Types}
     */
    this._j._skillCostType = Sprite_SkillCost.Types.MP;
  };

  /**
   * Gets the skill cost type of this sprite.
   * @returns {Sprite_SkillCost.Types}
   */
  skillCostType()
  {
    return this._j._skillCostType;
  };

  /**
   * Gets the skill cost of this sprite.
   * @returns {number}
   */
  skillCost()
  {
    return this.skillCostByType();
  };

  /**
   * Calculates the skill cost accordingly to the type of this sprite.
   * @returns {number}
   */
  skillCostByType()
  {
    const leader = $gameParty.leader();
    if (!leader) return 0;

    const ability = this.skillSlot().data(leader);
    if (!ability) return 0;

    switch (this.skillCostType())
    {
      case Sprite_SkillCost.Types.HP:
        // TODO: implement HP costs.
        return 0;
      case Sprite_SkillCost.Types.MP:
        return ability.mpCost * leader.mcr;
      case Sprite_SkillCost.Types.TP:
        return ability.tpCost * leader.tcr;
      case Sprite_SkillCost.Types.Item:
        return $gameParty.numItems(ability);
    }
  };

  /**
   * Sets the skill cost type for this sprite.
   * @param {Sprite_SkillCost.Types} skillCostType The skill type to assign to this sprite.
   */
  setSkillCostType(skillCostType)
  {
    if (this.skillCostType() !== skillCostType)
    {
      this._j._skillCostType = skillCostType;
      this.refresh();
    }
  };

  /**
   * OVERWRITE Gets the color of the text for this sprite based on the
   * type of skill cost for this sprite, instead of the assigned color.
   * @returns {string}
   */
  color()
  {
    return this.colorBySkillCostType();
  };

  /**
   * Gets the hex color based on the type of skill cost this is.
   * @returns {string}
   */
  colorBySkillCostType()
  {
    switch (this.skillCostType())
    {
      case Sprite_SkillCost.Types.HP:
        return "#ff0000";
      case Sprite_SkillCost.Types.MP:
        return "#0077ff";
      case Sprite_SkillCost.Types.TP:
        return "#33ff33";
      default:
        return "#ffffff";
    }
  };

  /**
   * OVERWRITE Gets the font size for this sprite's text.
   * Skill costs are hard-coded to be a fixed size, 12.
   * @returns {number}
   */
  fontSize()
  {
    return 12;
  };

  /**
   * Extends the `update()` to also synchronize the text to
   * match the skill slot it is
   */
  update()
  {
    // perform original logic.
    super.update();

    // sync the text.
    this.synchronizeCostType();
  };

  /**
   * Synchronizes the text with the underlying skill inside the
   * tracked skill slot. This allows dynamic updating when the slot
   * changes skill due to combos and such.
   */
  synchronizeCostType()
  {
    // get the cost of the assigned skill as an integer.
    let skillCost = this.skillCostByType().toFixed(0);

    // check if the icon index for this icon is up to date.
    if (this.text() !== skillCost)
    {
      // check if the skill cost is actually 0.
      if (skillCost === "0")
      {
        // replace 0 with an empty string instead.
        skillCost = String.empty;
      }

      // if it isn't, update it.
      this.setText(skillCost);
    }
  };
}
//#endregion Sprite_SkillCost
//#endregion Sprite objects

//#region Window objects
//#region Window_InputFrame
/**
 * A window displaying available skills and button inputs.
 */
class Window_InputFrame extends Window_Frame
{
  /**
   * Constructor.
   * @param {Rectangle} rect The shape of this window.
   */
  constructor(rect) { super(rect); };

  /**
   * Initializes all members of this class.
   */
  initMembers()
  {
    // perform original logic.
    super.initMembers();

    /**
     * The battler of which to track inputs for.
     * @type {Game_Actor}
     */
    this._j._battler = null;

    /**
     * Whether or not the window needs a refresh internally.
     * This is toggled after all draws are executed and tracked to
     * prevent unnecessary redraws.
     * @type {boolean}
     */
    this._j._needsRefresh = true;
  };

  /**
   * Executes any one-time configuration required for this window.
   */
  configure()
  {
    // perform original logic.
    super.configure();

    // remove opacity for completely transparent window.
    this.opacity = 0;
  };

  /**
   * Requests this window to clear and redraw its contents.
   */
  requestInternalRefresh()
  {
    this._j._needsRefresh = true;
  };

  /**
   * Gets whether or not this window needs refresh.
   * @returns {boolean}
   */
  needsInternalRefresh()
  {
    return this._j._needsRefresh;
  };

  /**
   * Flags internally this window for successfully refreshing text.
   */
  acknowledgeInternalRefresh()
  {
    this._j._needsRefresh = false;
  };

  //#region caching
  /**
   * Ensures all sprites are created and available for use.
   */
  createCache()
  {
    // perform original logic.
    super.createCache();

    // with no leader, we have no inputs to make a cache.
    if (!$gameParty.leader()) return;

    // grab the leader and their battler for doing things.
    const leader = $gameParty.leader();

    // iterate over all potentially assignable inputs.
    JABS_Button.assignableInputs().forEach(input =>
    {
      // don't cache the tool sprite.
      if (input === JABS_Button.Tool) return;

      // grab the slot on the actor associated with the input.
      const skillSlot = leader.getSkillSlot(input);

      // if there is nothing associated with this slot, then do not.
      if (!skillSlot || skillSlot.isEmpty()) return;

      // cache the input key icon sprite.
      this.getOrCreateInputKeyIconSprite(skillSlot, input);
    });
  };

  /**
   * Creates the key for the input key icon sprite based on the parameters.
   * @param {JABS_SkillSlot} skillSlot The skillslot associated with this input key.
   * @param {JABS_Button} inputType The type of input for this key.
   * @returns {string}
   */
  makeInputKeyIconSpriteKey(skillSlot, inputType)
  {
    return `icon-${$gameParty.leader().name()}-${$gameParty.leader().actorId()}-${inputType}`;
  };

  /**
   * Creates an icon sprite for the given input key and caches it.
   * @param {JABS_SkillSlot} skillSlot The skillslot associated with this input key.
   * @param {JABS_Button} inputType The type of input for this key.
   * @returns {Sprite_Icon}
   */
  getOrCreateInputKeyIconSprite(skillSlot, inputType)
  {
    // determine the key for this sprite.
    const key = this.makeInputKeyIconSpriteKey(skillSlot, inputType);

    // check if the key already maps to a cached sprite.
    if (this._j._spriteCache.has(key))
    {
      // if it does, just return that.
      return this._j._spriteCache.get(key);
    }

    // create a new sprite.
    const sprite = new Sprite_SkillSlotIcon(0, skillSlot);

    // cache the sprite.
    this._j._spriteCache.set(key, sprite);

    // hide the sprite for now.
    sprite.hide();

    // add the sprite to tracking.
    this.addChild(sprite);

    // return the created sprite.
    return sprite;
  };

  /**
   * Creates the key for the input key ability cost sprite based on the parameters.
   * @param {number} amount The amount that is this cost.
   * @param {number} colorIndex The color index to draw this cost in.
   * @param {JABS_Button} inputType The type of input for this key.
   * @returns {string}
   */
  makeInputKeyAbilityCostSpriteKey(amount, colorIndex, inputType)
  {
    return `cost-${$gameParty.leader().name()}-${$gameParty.leader().actorId()}-${inputType}-${amount}-${colorIndex}`;
  };

  /**
   * Creates an ability cost sprite for the given input key and caches it.
   * @param {number} amount The amount that is this cost.
   * @param {number} colorIndex The color index to draw this cost in.
   * @param {JABS_Button} inputType The type of input for this key.
   * @param {number} itemId If this is an item, then the item id can be passed for tracking.
   * @returns {Sprite_AbilityCost}
   */
  getOrCreateInputKeyAbilityCostSprite(amount, colorIndex, inputType, itemId = 0)
  {
    // determine the key for this sprite.
    const key = this.makeInputKeyAbilityCostSpriteKey(amount, colorIndex, inputType);

    // check if the key already maps to a cached sprite.
    if (this._j._spriteCache.has(key))
    {
      // if it does, just return that.
      return this._j._spriteCache.get(key);
    }

    // create a new sprite.
    const sprite = new Sprite_AbilityCost(amount, colorIndex, itemId);

    // cache the sprite.
    this._j._spriteCache.set(key, sprite);

    // hide the sprite for now.
    sprite.hide();

    // add the sprite to tracking.
    this.addChild(sprite);

    // return the created sprite.
    return sprite;
  };

  /**
   * Creates the key for the input key ability cost sprite based on the parameters.
   * @param {Sprite_SkillCost.Types} costType The type of cost for this key.
   * @param {JABS_Button} inputType The type of input for this key.
   * @returns {string}
   */
  makeInputKeySkillCostSpriteKey(costType, inputType)
  {
    return `cost-${$gameParty.leader().name()}-${$gameParty.leader().actorId()}-${costType}-${inputType}`;
  };

  /**
   * Creates an skill cost sprite for the given input key and caches it.
   * @param {JABS_SkillSlot} skillSlot The slot associated with this skill.
   * @param {Sprite_SkillCost.Types} costType The type of cost this sprite is.
   * @param {JABS_Button} inputType The type of input for this key.
   * @returns {Sprite_AbilityCost}
   */
  getOrCreateInputKeySkillCostSprite(skillSlot, costType, inputType)
  {
    // determine the key for this sprite.
    const key = this.makeInputKeySkillCostSpriteKey(costType, inputType);

    // check if the key already maps to a cached sprite.
    if (this._j._spriteCache.has(key))
    {
      // if it does, just return that.
      return this._j._spriteCache.get(key);
    }

    // create a new sprite.
    const sprite = new Sprite_SkillCost(skillSlot, costType);

    // cache the sprite.
    this._j._spriteCache.set(key, sprite);

    // hide the sprite for now.
    sprite.hide();

    // add the sprite to tracking.
    this.addChild(sprite);

    // return the created sprite.
    return sprite;
  };

  /**
   * Creates the key for the input key cooldown timer sprite based on the parameters.
   * @param {JABS_Cooldown} cooldownData The cooldown data for a given skill slot.
   * @param {JABS_Button} inputType The type of input for this key.
   * @param {boolean} isItem Whether or not this cooldown timer is for the item slot.
   * @returns {string}
   */
  makeInputKeyCooldowntTimerSpriteKey(cooldownData, inputType, isItem)
  {
    return `cooldown-${$gameParty.leader().name()}-${$gameParty.leader().actorId()}-${inputType}-${isItem}`;
  };

  /**
   * Creates a cooldown timer sprite for the given input key and caches it.
   * @param {JABS_Cooldown} cooldownData The cooldown data for a given skill slot.
   * @param {string} inputType The type of input for this key.
   * @returns {Sprite_CooldownTimer}
   */
  getOrCreateInputKeyCooldownTimerSprite(cooldownData, inputType)
  {
    // we always are working with items when assigning
    const isItem = inputType === JABS_Button.Tool;

    // determine the key for this sprite.
    const key = this.makeInputKeyCooldowntTimerSpriteKey(cooldownData, inputType, isItem);

    // check if the key already maps to a cached sprite.
    if (this._j._spriteCache.has(key))
    {
      // if it does, just return that.
      return this._j._spriteCache.get(key);
    }

    // create a new sprite.
    const sprite = new Sprite_CooldownTimer(inputType, cooldownData, isItem);

    // cache the sprite.
    this._j._spriteCache.set(key, sprite);

    // hide the sprite for now.
    sprite.hide();

    // add the sprite to tracking.
    this.addChild(sprite);

    // return the created sprite.
    return sprite;
  };

  /**
   * Creates the key for the input key combo gauge sprite based on the parameters.
   * @param {JABS_Cooldown} cooldownData The cooldown data for a given skill slot.
   * @param {JABS_Button} inputType The type of input for this key.
   * @returns {string}
   */
  makeInputKeyComboGaugeSpriteKey(cooldownData, inputType)
  {
    return `combo-${$gameParty.leader().name()}-${$gameParty.leader().actorId()}-${inputType}`;
  };

  /**
   * Creates a combo gauge sprite for the given input key and caches it.
   * @param {JABS_Cooldown} cooldownData The cooldown data for a given skill slot.
   * @param {JABS_Button} inputType The type of input for this key.
   * @returns {Sprite_CooldownTimer}
   */
  getOrCreateInputKeyComboGaugeSprite(cooldownData, inputType)
  {
    // determine the key for this sprite.
    const key = this.makeInputKeyComboGaugeSpriteKey(cooldownData, inputType);

    // check if the key already maps to a cached sprite.
    if (this._j._spriteCache.has(key))
    {
      // if it does, just return that.
      return this._j._spriteCache.get(key);
    }

    // create a new sprite.
    const sprite = new Sprite_ComboGauge(cooldownData);

    // cache the sprite.
    this._j._spriteCache.set(key, sprite);

    // hide the sprite for now.
    sprite.hide();

    // configure the sprite per our unique needs.
    sprite.rotation = 270 * (Math.PI / 180);
    sprite.scale.x = 0.6;
    sprite.scale.y = 1.1;

    // add the sprite to tracking.
    this.addChild(sprite);

    // return the created sprite.
    return sprite;
  };

  /**
   * Creates the key for the input key skill name sprite based on the parameters.
   * @param {string} inputType The type of input for this key.
   * @returns {string}
   */
  makeInputKeySkillNameSpriteKey(inputType)
  {
    return `skillname-${$gameParty.leader().name()}-${$gameParty.leader().actorId()}-${inputType}`;
  };

  /**
   * Creates a skill name sprite for the given input key and caches it.
   * @param {JABS_SkillSlot} skillSlot The slot associated with this skill.
   * @param {string} inputType The type of input for this key.
   * @returns {Sprite_SkillName}
   */
  getOrCreateInputKeySkillNameSprite(skillSlot, inputType)
  {
    // determine the key for this sprite.
    const key = this.makeInputKeySkillNameSpriteKey(inputType);

    // check if the key already maps to a cached sprite.
    if (this._j._spriteCache.has(key))
    {
      // if it does, just return that.
      return this._j._spriteCache.get(key);
    }

    // create a new sprite.
    const sprite = new Sprite_SkillName(skillSlot);

    // cache the sprite.
    this._j._spriteCache.set(key, sprite);

    // hide the sprite for now.
    sprite.hide();

    // add the sprite to tracking.
    this.addChild(sprite);

    // return the created sprite.
    return sprite;
  };
  //#endregion caching

  /**
   * Refreshes the contents of this window.
   */
  refresh()
  {
    // clear out the window contents.
    this.contents.clear();

    // rebuilds the contents of the window.
    this.requestInternalRefresh();
  };

  /**
   * Updates the logic for this window frame.
   */
  updateFrame()
  {
    // perform original logic.
    super.updateFrame();

    // draw the contents.
    this.drawInputFrame();
  };

  inputKeyWidth()
  {
    return 72;
  };

  /**
   * Draws the input frame window in its entirety.
   */
  drawInputFrame()
  {
    // don't draw if we don't need to draw.
    if (!this.canDrawInputFrame()) return;

    // wipe the drawn contents.
    this.contents.clear();

    // hide all the sprites.
    this._j._spriteCache.forEach((sprite => sprite.hide()));

    // our origin x:y coordinates.
    const x = 0;
    const y = 0;

    // draw the primary section of our input.
    this.drawPrimaryInputKeys(x, y);

    // draw the secondary section of our input.
    this.drawSecondaryInputKeys(x+250, y);

    // flags that this has been refreshed.
    this.acknowledgeInternalRefresh();
  };

  /**
   * Determines whether or not we can draw the input frame.
   * @returns {boolean} True if we can, false otherwise.
   */
  canDrawInputFrame()
  {
    // if the leader is not present or available, we cannot draw.
    if (!$gameParty.leader()) return false;

    // if we don't need to draw it, we cannot draw.
    if (!this.needsInternalRefresh()) return false;

    // draw it!
    return true;
  };

  /**
   * Draws the primary set of input keys.
   * This includes: mainhand, offhand, dodge, and tool input keys.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  drawPrimaryInputKeys(x, y)
  {
    // shorthand the variables for re-use.
    const ikw = this.inputKeyWidth();
    const baseX = x + 16;
    const baseY = y + 8;

    // draw the four basic core functions of JABS.
    this.drawInputKey(JABS_Button.Main, baseX+ikw*0, baseY+32);
    this.drawInputKey(JABS_Button.Offhand, baseX+(ikw*1), baseY+32);
    this.drawInputKey(JABS_Button.Dodge, baseX+(ikw*2), baseY+64);
    this.drawInputKey(JABS_Button.Tool, baseX+(ikw*2), baseY);
  };

  /**
   * Draws the primary set of input keys.
   * This includes: all L1 and R1 combo inputs.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  drawSecondaryInputKeys(x, y)
  {
    // shorthand the variables for re-use.
    const ikw = this.inputKeyWidth();
    const baseX = x + 16;
    const baseY = y + 8;

    // draw the combat skills equipped for JABS.
    this.drawInputKey(JABS_Button.L1_X, baseX+ikw*0, baseY+32);
    this.drawInputKey(JABS_Button.L1_Y, baseX+(ikw*1), baseY);
    this.drawInputKey(JABS_Button.L1_A, baseX+(ikw*1), baseY+64);
    this.drawInputKey(JABS_Button.L1_B, baseX+(ikw*2), baseY+32);

    /*
    this.drawInputKey(JABS_Button.R1_X, baseX+ikw*3, baseY+32);
    this.drawInputKey(JABS_Button.R1_Y, baseX+(ikw*4), baseY);
    this.drawInputKey(JABS_Button.R1_A, baseX+(ikw*4), baseY+64);
    this.drawInputKey(JABS_Button.R1_B, baseX+(ikw*5), baseY+32);
    */
  };

  /**
   * Draws a single input key of the input frame.
   * @param {string} inputType The type of input key this is.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  drawInputKey(inputType, x, y)
  {
    // shorthand the player's JABS battler data.
    const jabsPlayer = $gameBattleMap.getPlayerMapBattler();

    // grab the cooldown data and the skillslot data from the leader based on the slot.
    const actionKeyData = jabsPlayer.getActionKeyData(inputType);

    // if we have no action key data for this slot, don't draw it.
    if (!actionKeyData) return;

    // extract the input key's data.
    const skillSlot =  actionKeyData.skillslot;
    const cooldownData = actionKeyData.cooldown;

    const skillId = (cooldownData.comboNextActionId > 0)
      ? cooldownData.comboNextActionId
      : skillSlot.id;

    // do not process empty skill slots that have 0 assigned.
    if (!skillId) return;

    // draw skillslot label.
    this.drawTextEx(`\\FS[14]${inputType}`, x, y-16, 200);

    // draw skill icon.
    this.drawInputKeySkillIcon(skillSlot, inputType, x, y);

    // draw costs.
    // if this isn't a tool, then draw the skill costs.
    if (inputType !== JABS_Button.Tool)
    {
      this.drawInputKeyHpCost(skillSlot, inputType, x, y);
      this.drawInputKeyMpCost(skillSlot, inputType, x, y);
      this.drawInputKeyTpCost(skillSlot, inputType, x, y);
    }
    // if this is a tool, then draw the item cost.
    else
    {
      this.drawInputKeyItemCost(skillSlot, inputType, x, y);
    }

    // draw skill combo gauge and cooldown timer.
    this.drawInputKeyComboGauge(cooldownData, inputType, x, y);
    this.drawInputKeyCooldownTimer(cooldownData, inputType, x, y);

    // draw skill name.
    this.drawInputKeySkillName(skillSlot, inputType, x, y);
  };

  canDrawInputKey(inputType)
  {

  };

  /**
   * Draws the input key's associated skill icon.
   * @param {JABS_SkillSlot} skillSlot The skillslot associated with this input key.
   * @param {string} inputType The type of input key this is.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  drawInputKeySkillIcon(skillSlot, inputType, x, y)
  {
    const sprite = this.getOrCreateInputKeyIconSprite(skillSlot, inputType);
    sprite.show();
    sprite.move(x+6, y+20);
  };

  /**
   * Draws the input key's associated mp cost.
   * @param {JABS_SkillSlot} skillSlot The skillslot associated with this input key.
   * @param {string} inputType The type of input key this is.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  drawInputKeyHpCost(skillSlot, inputType, x, y)
  {
    // relocate the sprite.
    const sprite = this.getOrCreateInputKeySkillCostSprite(
      skillSlot,
      Sprite_SkillCost.Types.HP,
      inputType);
    sprite.show();
    sprite.move(x-2, y-10);
  };

  /**
   * Draws the input key's associated mp cost.
   * @param {JABS_SkillSlot} skillSlot The skillslot associated with this input key.
   * @param {string} inputType The type of input key this is.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  drawInputKeyMpCost(skillSlot, inputType, x, y)
  {
    // relocate the sprite.
    const sprite = this.getOrCreateInputKeySkillCostSprite(
      skillSlot,
      Sprite_SkillCost.Types.MP,
      inputType);
    sprite.show();
    sprite.move(x-2, y);
  };

  /**
   * Draws the input key's associated tp cost.
   * @param {JABS_SkillSlot} skillSlot The skillslot associated with this input key.
   * @param {string} inputType The type of input key this is.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  drawInputKeyTpCost(skillSlot, inputType, x, y)
  {
    // relocate the sprite.
    const sprite = this.getOrCreateInputKeySkillCostSprite(
      skillSlot,
      Sprite_SkillCost.Types.TP,
      inputType);
    sprite.show();
    sprite.move(x-2, y+10);
  };

  /**
   * Draws the input key's associated item cost.
   * @param {JABS_SkillSlot} skillSlot The skillslot associated with this input key.
   * @param {string} inputType The type of input key this is.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  drawInputKeyItemCost(skillSlot, inputType, x, y)
  {
    // relocate the sprite.
    const sprite = this.getOrCreateInputKeySkillCostSprite(
      skillSlot,
      Sprite_SkillCost.Types.Item,
      inputType);
    sprite.show();
    sprite.move(x+36, y+10);
  };

  /**
   * Draws the input key's associated combo gauge.
   * @param {JABS_Cooldown} cooldownData The cooldown data for the skill.
   * @param {string} inputType The type of input key this is.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  drawInputKeyComboGauge(cooldownData, inputType, x, y)
  {
    // relocate the sprite.
    const sprite = this.getOrCreateInputKeyComboGaugeSprite(cooldownData, inputType);
    sprite.show();
    sprite.move(x+32, y+32);
  };

  /**
   * Draws the input key's associated cooldown data in text.
   * @param {JABS_Cooldown} cooldownData The cooldown data for the skill.
   * @param {string} inputType The type of input key this is.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  drawInputKeyCooldownTimer(cooldownData, inputType, x, y)
  {
    // relocate the sprite.
    const sprite = this.getOrCreateInputKeyCooldownTimerSprite(cooldownData, inputType);
    sprite.show();
    sprite.move(x+28, y+16);
  };

  /**
   * Draws the input key's skill's name.
   * @param {JABS_SkillSlot} skillSlot The skill slot associated with the skill anme
   * @param {string} inputType The type of input key this is.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  drawInputKeySkillName(skillSlot, inputType, x, y)
  {
      // determine the coordinates and sizing.
      const sprite = this.getOrCreateInputKeySkillNameSprite(skillSlot, inputType);
      sprite.show();
      sprite.move(x, y+24);
  };
}
//#endregion Window_InputFrame
//#endregion Window objects

//#region Custom objects
//#region JABS_InputManager
/**
 * The class that handles input in the context of JABS.
 */
class JABS_InputManager
{
  /**
   * The collection of inputs that JABS will take action with.
   * @type {Map<string, JABS_Input>}
   */
  Keys = new Map();

  constructor()
  {
    this.createKeys();
  };

  createKeys()
  {
    this.Keys.set(
      J.ABS.Input.A,
      new JABS_Input(
        JABS_Button.Main,
        () => console.log("hello world")));
  };

  update()
  {
    // don't swing all willy nilly while events are executing.
    if ($gameMap.isEventRunning() || $gameMessage.isBusy()) return;

    if (Input.isTriggered(J.ABS.Input.A))
    {
      this.Keys.get(J.ABS.Input.A).action();
    }
  };
}

/**
 * A class representing a key pressed and the functionality that it performs
 * in the context of JABS.
 */
class JABS_Input
{
  /**
   * The key representing this input.
   * @returns {string}
   */
  key = String.empty;

  /**
   * The action performed when this key is input.
   * @returns {any}
   */
  action = () => null;

  /**
   * Constructor.
   * @param {JABS_Button} key The key representing this input.
   * @param {function} action The action to execute for this input.
   */
  constructor(key, action)
  {
    this.key = key;
    this.action = action;
  };
}

/**
 * A static class containing all input keys available for JABS.
 */
class JABS_Button
{
  /**
   * The "start" key.
   * Used for bringing up the JABS menu on the map.
   * @type {string}
   */
  static Start = "Start";

  /**
   * The "select" key.
   * Used for party-cycling.
   * @type {string}
   */
  static Select = "Select";

  /**
   * The "main", "A" button, or "Z" key.
   * Used for executing the mainhand action.
   * @type {string}
   */
  static Main = "Main";

  /**
   * The "offhand", "B" button, or "X" key.
   * Used for executing the offhand action.
   * @type {string}
   */
  static Offhand = "Offhand";

  /**
   * The "tool", "Y" button, or "C" key.
   * Used for executing the currently selected tool skill.
   * @type {string}
   */
  static Tool = "Tool";

  /**
   * The "dodge", "R2" button, or "Tab" key.
   * Used for executing the currently selected dodge skill.
   * @type {string}
   */
  static Dodge = "Dodge";

  /**
   * The "strafe", "L2" button, or "Left Ctrl" key.
   * Used for locking the direction faced while the input is held.
   * @type {string}
   */
  static Strafe = "Strafe";

  /**
   * The "guard", "R1" button, or "W" and "E" key(s).
   * Used for guarding/parrying while the input is held.
   * @type {string}
   */
  static Guard = "Guard";

  /**
   * The "L1 + A" or 1 key.
   * Used for executing the 1st of 8 equippable skills.
   * @type {string}
   */
  static L1_A = "L1_A";

  /**
   * The "L1 + B" or 2 key.
   * Used for executing the 2nd of 8 equippable skills.
   * @type {string}
   */
  static L1_B = "L1_B";

  /**
   * The "L1 + X" or 3 key.
   * Used for executing the 3rd of 8 equippable skills.
   * @type {string}
   */
  static L1_X = "L1_X";

  /**
   * The "L1 + Y" or 4 key.
   * Used for executing the 4th of 8 equippable skills.
   * @type {string}
   */
  static L1_Y = "L1_Y";

  /**
   * The "R1 + A" or 5 key.
   * Used for executing the 5th of 8 equippable skills.
   * @type {string}
   */
  static R1_A = "R1_A";

  /**
   * The "R1 + B" or 6 key.
   * Used for executing the 6th of 8 equippable skills.
   * @type {string}
   */
  static R1_B = "R1_B";

  /**
   * The "R1 + X" or 7 key.
   * Used for executing the 7th of 8 equippable skills.
   * @type {string}
   */
  static R1_X = "R1_X";

  /**
   * The "R1 + Y" or 8 key.
   * Used for executing the 8th of 8 equippable skills.
   * @type {string}
   */
  static R1_Y = "R1_Y";

  /**
   * Gets all inputs that are available for assignment
   * in one way or another.
   * @returns {string[]} A collection of JABS-input keys' identifiers.
   */
  static assignableInputs()
  {
    return [
      // primary
      this.Main,
      this.Offhand,
      this.Tool,
      this.Dodge,

      // R1 + buttons
      this.R1_A,
      this.R1_B,
      this.R1_X,
      this.R1_Y,

      // L1 + buttons
      this.L1_A,
      this.L1_B,
      this.L1_X,
      this.L1_Y,
    ];
  };
}
//#endregion JABS_InputManager
//#endregion Custom objects


//ENDOFFILE