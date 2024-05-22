//region JAFT_RefinementData
/**
 * A class containing all the various data points extracted from notes.
 */
class JAFTING_RefinementData
{
  /**
   * @constructor
   * @param {string} notes The raw note box as a string.
   * @param {any} meta The `meta` object containing prebuilt note metadata.
   */
  constructor(notes, meta)
  {
    this._notes = notes.split(/[\r\n]+/);
    this._meta = meta;
    this.refinedCount = 0;
    this.maxRefineCount = this.getMaxRefineCount();
    this.maxTraitCount = this.getMaxTraitCount();
    this.notRefinementMaterial = this.isNotMaterial();
    this.notRefinementBase = this.isNotBase();
    this.unrefinable = this.isNotRefinable();
  }

  /**
   * The number of times this piece of equipment can be refined.
   * @returns {number}
   */
  getMaxRefineCount()
  {
    let count = 0;
    if (this._meta && this._meta[J.BASE.Notetags.MaxRefineCount])
    {
      count = parseInt(this._meta[J.BASE.Notetags.MaxRefineCount]) || count;
    }
    else
    {
      const structure = /<maxRefineCount:[ ]?(\d+)>/i;
      this._notes.forEach(note =>
      {
        if (note.match(structure))
        {
          count = parseInt(RegExp.$1);
        }
      })
    }

    return count;
  }

  /**
   * The number of transferable traits that this piece of equipment can have at any one time.
   * @returns {number}
   */
  getMaxTraitCount()
  {
    let count = 0;
    if (this._meta && this._meta[J.BASE.Notetags.MaxRefineTraits])
    {
      count = parseInt(this._meta[J.BASE.Notetags.MaxRefineTraits]) || count;
    }
    else
    {
      const structure = /<maxRefinedTraits:[ ]?(\d+)>/i;
      this._notes.forEach(note =>
      {
        if (note.match(structure))
        {
          count = parseInt(RegExp.$1);
        }
      })
    }

    return count;
  }

  /**
   * Gets whether or not this piece of equipment can be used in refinement as a material.
   * @returns {boolean}
   */
  isNotMaterial()
  {
    let notMaterial = false;
    if (this._meta && this._meta[J.BASE.Notetags.NotRefinementMaterial])
    {
      notMaterial = true;
    }
    else
    {
      const structure = /<notRefinementMaterial>/i;
      this._notes.forEach(note =>
      {
        if (note.match(structure))
        {
          notMaterial = true;
        }
      })
    }

    return notMaterial;
  }

  /**
   * Gets whether or not this piece of equipment can be used in refinement as a base.
   * @returns {boolean}
   */
  isNotBase()
  {
    let notBase = false;
    if (this._meta && this._meta[J.BASE.Notetags.NotRefinementBase])
    {
      notBase = true;
    }
    else
    {
      const structure = /<notRefinementBase>/i;
      this._notes.forEach(note =>
      {
        if (note.match(structure))
        {
          notBase = true;
        }
      })
    }

    return notBase;
  }

  /**
   * Gets whether or not this piece of equipment can be used in refinement.
   * If this is true, this will mean this cannot be used in refinement as base or material.
   * @returns
   */
  isNotRefinable()
  {
    let noRefine = false;
    if (this._meta && this._meta[J.BASE.Notetags.NoRefinement])
    {
      noRefine = true;
    }
    else
    {
      const structure = /<noRefine>/i;
      this._notes.forEach(note =>
      {
        if (note.match(structure))
        {
          noRefine = true;
        }
      })
    }

    return noRefine;
  }
}
//endregion JAFT_RefinementData

//region JAFTING_Trait
/**
 * A class representing a single trait on a piece of equipment that can be potentially
 * transferred by means of JAFTING's refinement mode.
 */
function JAFTING_Trait()
{
  this.initialize(...arguments);
}
JAFTING_Trait.prototype = {};
JAFTING_Trait.prototype.constructor = JAFTING_Trait;

/**
 * Initializes the members of this class.
 * @param {number} code The code of the trait.
 * @param {number} dataId The dataId of the trait.
 * @param {number} value The value of the trait.
 */
JAFTING_Trait.prototype.initialize = function(code, dataId, value)
{
  this._code = code;
  this._dataId = dataId;
  this._value = value;
};

/**
 * The defacto of what JAFTING considers a "divider" trait.
 * All traits defined AFTER this trait are considered transferable.
 * @returns {RPG_Trait}
 */
JAFTING_Trait.divider = function()
{
  return RPG_Trait.fromValues(J.BASE.Traits.NO_DISAPPEAR, 3, 1);
};

/**
 * Gets a standardized concatenation of the name and value for a given trait.
 * @returns {string}
 */
Object.defineProperty(JAFTING_Trait.prototype, "nameAndValue", {
  get()
  {
    return `${this.name} ${this.value}`;
  },
  configurable: true,
});

/**
 * Gets the friendly name of the trait based on the trait code.
 * @returns {string}
 */
Object.defineProperty(JAFTING_Trait.prototype, "name", {
  get()
  {
    switch (this._code)
    {
      // first tab.
      case 11:
        return `${$dataSystem.elements[this._dataId]} dmg`;
      case 12:
        return `${TextManager.param(this._dataId)} debuff rate`;
      case 13:
        return `${$dataStates[this._dataId].name} resist`;
      case 14:
        return `Immune to`;

      // second tab.
      case 21:
        return `${TextManager.param(this._dataId)}`;
      case 22:
        return `${TextManager.xparam(this._dataId)}`;
      case 23:
        return `${TextManager.sparam(this._dataId)}`;

      // third tab.
      case 31:
        return `Attack Element:`;
      case 32:
        return `${$dataStates[this._dataId].name} on-hit`;
      case 33:
        return `Skill Speed`;
      case 34:
        return `Times`;
      case 35:
        return `Basic Attack w/`;

      // fourth tab.
      case 41:
        return `Unlock:`;
      case 42:
        return `Lock:`;
      case 43:
        return `Learn:`;
      case 44:
        return `Seal:`;

      // fifth tab.
      case 51:
        return `${$dataSystem.weaponTypes[this._dataId]}`;
      case 52:
        return `${$dataSystem.armorTypes[this._dataId]}`;
      case 53:
        return `${$dataSystem.equipTypes[this._dataId]}`;
      case 54:
        return `${$dataSystem.equipTypes[this._dataId]}`;
      case 55:
        return `${this._dataId ? "Enable" : "Disable"}`;

      // sixth tab.
      case 61:
        return `Another turn chance:`;
      case 62:
        return `${this.translateSpecialFlag()}`;
      case 64:
        return `${this.translatePartyAbility()}`;

      case 63:
        return `TRANSFERABLE TRAITS`;
      default:
        return "All traits were implemented,";
    }
  },
  configurable: true,
});

/**
 * Gets the friendly value of the trait based on the trait code and value.
 * @returns {string}
 */
Object.defineProperty(JAFTING_Trait.prototype, "value", {
  get()
  {
    switch (this._code)
    {
      // first tab.
      case 11:
        const calculatedElementalRate = Math.round(100 - (this._value * 100));
        return `${calculatedElementalRate > 0 ? "-" : "+"}${calculatedElementalRate}%`;
      case 12:
        const calculatedDebuffRate = Math.round((this._value * 100) - 100);
        return `${calculatedDebuffRate > 0 ? "+" : "-"}${calculatedDebuffRate}%`;
      case 13:
        const calculatedStateRate = Math.round(100 - (this._value * 100));
        return `${calculatedStateRate > 0 ? "+" : "-"}${calculatedStateRate}%`;
      case 14:
        return `${$dataStates[this._dataId].name}`;

      // second tab.
      case 21:
        const calculatedBParam = Math.round((this._value * 100) - 100);
        return `${calculatedBParam >= 0 ? "+" : ""}${calculatedBParam}%`;
      case 22:
        const calculatedXParam = Math.round((this._value * 100));
        return `${calculatedXParam >= 0 ? "+" : ""}${calculatedXParam}%`;
      case 23:
        const calculatedSParam = Math.round((this._value * 100) - 100);
        return `${calculatedSParam >= 0 ? "+" : ""}${calculatedSParam}%`;

      // third tab.
      case 31:
        return `${$dataSystem.elements[this._dataId]}`;
      case 32:
        return `${(this._value * 100)}%`;
      case 33:
        return `${this._value > 0 ? "+" : "-"}${this._value}`;
      case 34:
        return `${this._value > 0 ? "+" : "-"}${this._value}`;
      case 35:
        return `${$dataSkills[this._value].name}`;

      // fourth tab.
      case 41:
        return `${$dataSystem.skillTypes[this._dataId]}`;
      case 42:
        return `${$dataSystem.skillTypes[this._dataId]}`;
      case 43:
        return `${$dataSkills[this._dataId].name}`;
      case 44:
        return `${$dataSkills[this._dataId].name}`;

      // fifth tab.
      case 51:
        return `proficiency`;
      case 52:
        return `proficiency`;
      case 53:
        return `is locked`;
      case 54:
        return `is sealed`;
      case 55:
        return `Dual-wield`;

      // sixth tab.
      case 61:
        return `${Math.round(this._value * 100)}%`;
      case 62:
        return ``;
      case 64:
        return ``;
      case 63:
        return ``;
      default:
        return "is this a custom trait?";
    }
  },
  configurable: true,
});

/**
 * Translates the data id of the trait into what it represents according to RMMZ.
 * @returns {string}
 */
JAFTING_Trait.prototype.translateSpecialFlag = function()
{
  switch (this._dataId)
  {
    case 0:
      return `Autobattle`;
    case 1:
      return `Empowered Guard`;
    case 2:
      return `Cover/Substitute`;
    case 3:
      return `Preserve TP`;
  }
};

/**
 * Translates the data id of the trait into what it represents according to RMMZ.
 * @returns {string}
 */
JAFTING_Trait.prototype.translatePartyAbility = function()
{
  switch (this._dataId)
  {
    case 0:
      return `Encounter Half`;
    case 1:
      return `Encounter None`;
    case 2:
      return `Prevent Surprise`;
    case 3:
      return `Frequent Pre-emptive`;
    case 4:
      return `Gold Dropped 2x`;
    case 5:
      return `Item Drop Chance 2x`;
  }
};

/**
 * Gets the original RM trait associated with this JAFTING trait.
 * @returns {RPG_Trait}
 */
JAFTING_Trait.prototype.convertToRmTrait = function()
{
  return RPG_Trait.fromValues(this._code, this._dataId, this._value);
};
//endregion JAFTING_Trait

//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.0.0 JAFT-Refine] An extension for JAFTING to enable equip refinement.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @orderAfter J-Base
 * @orderAfter J-JAFTING
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin enables the "refine" functionality of JAFTING.
 * The "refine" functionality is basically a trait transferrence system with
 * some guardrails in-place.
 *
 * Integrates with others of mine plugins:
 * - J-Base; to be honest this is just required for all my plugins.
 * - J-JAFTING; the core that this engine hooks into to enable upgrading.
 *
 * ============================================================================
 * UPGRADING
 * Ever want to upgrade your equips by sacrificing others in the name of
 * ascending to godliness? Well now you can! By using a variety of tags placed
 * deliberately on your equips throughout the database, you too can have a
 * dynamic and powerful upgrading system for equipment.
 *
 * HOW DOES IT WORK?
 * This is an extension of the JAFTING plugin to enable the ability to "refine"
 * equipment. "Refinement" is defined as "transfering the traits of one item
 * onto another". It is also important to note that "transferable traits" are
 * defined as "all traits on an equip in the database that are below the
 * divider".
 *
 * NOTE ABOUT THE DIVIDER
 * The "divider" is another trait: 'Collapse Effect'. It doesn't matter which
 * option you select in the dropdown for this (for now). Traits that are above
 * the "divider" are considered "passive" traits that cannot be transfered.
 *
 * NOTE ABOUT TRAIT REMOVAL
 * This plugin does not handle trait removal, so do keep that in mind.
 *
 * This functionality's exclusive target is equipment. The most common use case
 * for this type of plugin is to repeatedly upgrade a weapon or armor of a
 * given type with new/improved traits, allowing the player to keep their
 * equipment relevant longer (or hang onto stuff for sentimental reasons, I
 * guess). It works in tandem with a basic crafting system (the JAFTING base
 * system) to allow you, the RM dev, to come up with fun ways to allow not only
 * you, but the player as well, to flex creativity by using recipes to make
 * stuff, then using refinement to upgrade it. With a wide variety of traits
 * spread across various equipment, combined with the notetags below, this
 * extension on JAFTING can make for some interesting situations in-game (good
 * and bad).
 * ============================================================================
 * MENU MANAGEMENT
 * In order to enable or disable menu access for this plugin, you can use the
 * plugin parameter that identifies the switch and toggle that in-editor. The
 * enabling of the menu option for refinement will match the state of the
 * switch in the plugin parameters.
 *
 * ============================================================================
 * TAGS
 * Obviously, being able to willy nilly refine any equips with any equips could
 * be volatile for the RM dev being able to keep control on what the player
 * should be doing (such as refining a unique equipment onto another and there
 * by losing said unique equipment that could've been required for story!).
 *
 * TAG USAGE
 * - Weapons
 * - Armors
 *
 * ----------------------------------------------------------------------------
 * DISABLE REFINEMENT
 * Placing this tag onto equipment renders it unavailable to be refined at all.
 * That means it simply won't show up in the refinement menu's equip lists.
 *
 * TAG FORMAT
 *  <noRefine>
 *
 * ----------------------------------------------------------------------------
 * DISALLOW USING AS A "BASE"
 * Placing this tag onto equipment means it will be a disabled option when
 * selecting a base equip to refine. This most commonly would be used by
 * perhaps some kind of "fragile" types of equipment, or for equipment you
 * designed explicitly as a material.
 *
 * TAG FORMAT
 *  <notRefinementBase>
 *
 * ----------------------------------------------------------------------------
 * DISALLOW USING AS A "MATERIAL"
 * Placing this tag onto equipment means it will be a disabled option when
 * selecting a material equip to refine onto the base. This most commonly would
 * be used for preventing the player from sacrificing an equipment that is
 * required for story purposes.
 *
 * TAG FORMAT
 *  <notRefinementMaterial>
 *
 * ----------------------------------------------------------------------------
 * MAXIMUM REFINEMENT COUNT
 * Where NUM is a number that represents how many times this can be refined.
 * Placing this tag onto equipment means it can only be used as a base for
 * refinement NUM number of times.
 *
 * TAG FORMAT
 *  <maxRefineCount:NUM>
 *
 * TAG EXAMPLES
 *  <maxRefinementCount:3>
 * An equip with this can only be used as a "base" for refinement 3 times
 * OR
 * An equip can only achieve be fused to or beyond +3 once
 * (whichever comes first)
 *
 * NOTE ABOUT LIMITS
 * While the refinement count may be fixed, you can still refine equips beyond
 * their limits by leveraging already-refined equipment as the material. The
 * system will allow fusing something if there are still refinement counts
 * available, even if the material has +8 when there is only 1 count left.
 *
 * ----------------------------------------------------------------------------
 * MAXIMUM TRAITS PER EQUIP
 * Where NUM is a number that represents how many combined traits it can have.
 * Placing this tag onto equipment means it can only be used as a base as long
 * as the number of combined trait slots (see the screen while refining) is
 * lesser than or equal to NUM. This most commonly would be used to prevent
 * the player from adding an unreasonable number of traits onto an equip.
 *
 * TAG FORMAT
 *  <maxRefinedTraits:NUM>
 *
 * TAG EXAMPLES
 *  <maxRefinedTraits:3>
 * An equip with this can only have a total of 3 unique traits.
 *
 * NOTE ABOUT LIMITS
 * Attempting to fuse beyond the max will not be allowed, even if there are
 * additional refinement counts available. However, traits will intelligently
 * stack if they are the same, and powering up existing traits will still be
 * allowed.
 *
 * ============================================================================
 * CHANGELOG:
 *
 * - 1.0.0
 *    Initial release.
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
 * @default 106
 *
 * @param menu-name
 * @parent parentConfig
 * @type string
 * @text Menu Name
 * @desc The name of the command used for JAFTING's Refinement.
 * @default Refinement
 *
 * @param menu-icon
 * @parent parentConfig
 * @type number
 * @text Menu Icon
 * @desc The icon of the command used for JAFTING's Refinement.
 * @default 2565
 *
 *
 * @command call-menu
 * @text Call the Refinement Menu
 * @desc Calls the JAFTING Refinement scene.
 *
 */

//region plugin metadata
/**
 * Plugin metadata for the refinement JAFTING plugin.<br>
 * Because this plugin has little to be configured, it is pretty light.
 */
class J_CraftingRefinePluginMetadata extends PluginMetadata
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

    // initialize this plugin from configuration.
    this.initializeMetadata();
  }

  /**
   * Initializes the metadata associated with this plugin.
   */
  initializeMetadata()
  {
    /**
     * The id of a switch that represents whether or not this system is accessible
     * in the menu.
     * @type {number}
     */
    this.menuSwitchId = parseInt(this.parsedPluginParameters['menu-switch']);

    /**
     * The name used for the command when visible in a menu.
     * @type {string}
     */
    this.commandName = this.parsedPluginParameters['menu-name'] ?? 'Refinement';

    /**
     * The icon used alongside the command's name when visible in the menu.
     * @type {number}
     */
    this.commandIconIndex = parseInt(this.parsedPluginParameters['menu-icon']) ?? 0;
  }
}
//endregion plugin metadata

/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

/**
 * The plugin umbrella that governs all things related to this extension plugin.
 */
J.JAFTING.EXT.REFINE = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.JAFTING.EXT.REFINE.Metadata = new J_CraftingRefinePluginMetadata('J-JAFTING-Refinement', '1.0.0');


/**
 * A helpful mapping of the various messages that we use in JAFTING.
 */
J.JAFTING.EXT.REFINE.Messages = {
  /**
   * The name of the command for Refinement on the JAFTING mode menu.
   */
  RefineCommandName: "Refine",

  /**
   * The name of the command that executes refinement.
   */
  ExecuteRefinementCommandName: "Execute Refinement",

  /**
   * The name of the command that cancels the refinement process.
   */
  CancelRefinementCommandName: "Cancel",

  /**
   * When an item hasn't been selected somehow, this message shows in the help window.
   */
  NoItemSelected: "Nothing is selected.",

  /**
   * When the item being hovered over cannot be used in refinement as a base, show this.
   */
  CannotUseAsBase: "This cannot be used as a base for refinement.",

  /**
   * When the item being hovered over cannot be used in refinement as a material, show this.
   */
  CannotUseAsMaterial: "This cannot be used as a material for refinement.",

  /**
   * When the list window is the selection of a base to refine, this shows up in the mini window.
   */
  ChooseRefinementBase: "Choose Refinement Base",

  /**
   * When the list window is the selection of a material to add, this shows up in the mini window.
   */
  ChooseRefinementMaterial: "Choose Material to Add",

  /**
   * When a material has no traits, this message shows up in the help window.
   */
  NoTraitsOnMaterial: "This material has no traits to refine the base with.",

  /**
   * When the refinement would result in going over the base's max refine count, this shows up.
   */
  ExceedRefineCount: "Refining with this would result in exceeding refine count max:",

  /**
   * When the refinement would result in going over the base's max trait count, this shows up.
   */
  ExceedTraitCount: "Refining with this would result in exceeding trait count max:",

  /**
   * When the player hovers over an equip that has already reached it's max refine count, this shows up.
   */
  AlreadyMaxRefineCount: "This has already been refined the maximum number of times.",

  /**
   * When the player hovers over an equip that has already reached it's max trait count, this shows up.
   */
  AlreadyMaxTraitCount: "This has already been refined with as many traits as it can hold.",

  /**
   * This shows up over the base equip during refinement.
   */
  TitleBase: "Refinement Base",

  /**
   * This shows up over the material equip during refinement.
   */
  TitleMaterial: "Refinement Material",

  /**
   * This shows up over the output equip during refinement.
   */
  TitleOutput: "Refinement Output",

  /**
   * Shown when a material is disabled because it has no traits to grant the base equip.
   */
  NoTransferableTraits: "No transferable traits.",
};

/**
 * A helpful mapping of all the various RMMZ classes being extended.
 */
J.JAFTING.EXT.REFINE.Aliased = {};
J.JAFTING.EXT.REFINE.Aliased.Game_Item = new Map();
J.JAFTING.EXT.REFINE.Aliased.Game_Party = new Map();
J.JAFTING.EXT.REFINE.Aliased.Game_System = new Map();
J.JAFTING.EXT.REFINE.Aliased.RPG_Base = new Map();
J.JAFTING.EXT.REFINE.Aliased.Scene_Jafting = new Map();
J.JAFTING.EXT.REFINE.Aliased.Window_JaftingList = new Map();

/**
 * All regular expressions used by this plugin.
 */
J.JAFTING.EXT.REFINE.RegExp = {};
J.JAFTING.EXT.REFINE.RegExp.NotRefinementBase = /<notRefinementBase>/i;
J.JAFTING.EXT.REFINE.RegExp.NotRefinementMaterial = /<notRefinementMaterial>/i;
J.JAFTING.EXT.REFINE.RegExp.Unrefinable = /<unrefinable>/i;
J.JAFTING.EXT.REFINE.RegExp.MaxRefineCount = /<maxRefineCount:[ ]?(\d+)>/i;
J.JAFTING.EXT.REFINE.RegExp.MaxTraitCount = /<maxTraitCount:[ ]?(\d+)>/i;
//endregion Introduction

//region plugin commands
/**
 * A plugin command.<br>
 * Calls the JAFTING refinement menu.
 */
PluginManager.registerCommand(
  J.JAFTING.EXT.REFINE.Metadata.name,
  "call-menu", () => 
  {
    Scene_JaftingRefine.callScene();
  });
//endregion plugin commands

/**
 * Extends {@link RPG_Base._generate}.<br>
 *
 * Also mirrors additional JAFTING-related values to the new object.
 * @param {RPG_Base} overrides The overriding object.
 * @param {number} index The new index.
 * @returns {this}
 */
J.JAFTING.EXT.REFINE.Aliased.RPG_Base.set('_generate', RPG_Base.prototype._generate);
RPG_Base.prototype._generate = function(overrides, index)
{
  // perform original logic.
  const original = J.JAFTING.EXT.REFINE.Aliased.RPG_Base.get('_generate').call(this, overrides, index);

  // update the refined count to the latest.
  original.jaftingRefinedCount = overrides.jaftingRefinedCount;

  // return the modificaiton.
  return original;
};

//region refinedCount
/**
 * The number of times this equip has been refined.
 * @type {number}
 */
RPG_EquipItem.prototype.jaftingRefinedCount ||= 0;
//endregion refinedCount

//region notRefinementBase
/**
 * Whether or not this equip is blocked from being used as a base for refinement.
 * @type {boolean}
 */
Object.defineProperty(RPG_EquipItem.prototype, "jaftingNotRefinementBase",
  {
    get: function()
    {
      return this.getJaftingNotRefinementBase();
    },
  });

/**
 * Gets whether or not this equip is blocked from being used as a base for refinement.
 * @returns {boolean}
 */
RPG_EquipItem.prototype.getJaftingNotRefinementBase = function()
{
  return this.extractJaftingNotRefinementBase();
};

/**
 * Extracts the value from the notes.
 * @returns {boolean}
 */
RPG_EquipItem.prototype.extractJaftingNotRefinementBase = function()
{
  return this.getBooleanFromNotesByRegex(J.JAFTING.EXT.REFINE.RegExp.NotRefinementBase);
};
//endregion notRefinementBase

//region notRefinementMaterial
/**
 * Whether or not this equip is blocked from being used as a material for refinement.
 * @type {boolean}
 */
Object.defineProperty(RPG_EquipItem.prototype, "jaftingNotRefinementMaterial",
  {
    get: function()
    {
      return this.getJaftingNotRefinementBase();
    },
  });

/**
 * Gets whether or not this equip is blocked from being used as a material for refinement.
 * @returns {boolean}
 */
RPG_EquipItem.prototype.getJaftingNotRefinementBase = function()
{
  return this.extractJaftingNotRefinementMaterial();
};

/**
 * Extracts the value from the notes.
 * @returns {boolean}
 */
RPG_EquipItem.prototype.extractJaftingNotRefinementMaterial = function()
{
  return this.getBooleanFromNotesByRegex(J.JAFTING.EXT.REFINE.RegExp.NotRefinementMaterial);
};
//endregion notRefinementMaterial

//region unrefinable
/**
 * Whether or not this equip is blocked from being used in refinement at all.
 * This is equivalent to {@link jaftingNotRefinementBase} and {@link jaftingNotRefinementMaterial}
 * existing on the same equip.
 * @type {boolean}
 */
Object.defineProperty(RPG_EquipItem.prototype, "jaftingUnrefinable",
  {
    get: function()
    {
      return this.getJaftingUnrefinable();
    },
  });

/**
 * Gets whether or not this equip is blocked from being used as a material for refinement.
 * @returns {boolean}
 */
RPG_EquipItem.prototype.getJaftingUnrefinable = function()
{
  // check if the notes say this is explicitly unrefinable.
  let unrefinable = this.extractJaftingUnrefinable();

  // if the notes didn't have the tag, lets check for the other pair.
  if (!unrefinable)
  {
    // see if this equip cannot be used as both base and material for refinement.
    const notForBase = this.jaftingNotRefinementBase;
    const notForMaterial = this.jaftingNotRefinementMaterial;

    // check if it is alternatively unrefinable.
    if (notForBase && notForMaterial)
    {
      // flip the flag.
      unrefinable = true;
    }
  }

  // return our result.
  return unrefinable;
};

/**
 * Extracts the value from the notes.
 * @returns {boolean}
 */
RPG_EquipItem.prototype.extractJaftingUnrefinable = function()
{
  return this.getBooleanFromNotesByRegex(J.JAFTING.EXT.REFINE.RegExp.Unrefinable);
};
//endregion unrefinable

//region maxRefineCount
/**
 * The maximum number of times this equip can be refined.
 * @type {number}
 */
Object.defineProperty(RPG_EquipItem.prototype, "jaftingMaxRefineCount",
  {
    get: function()
    {
      return this.getJaftingMaxRefineCount();
    },
  });

/**
 * Gets how many times this equip can be refined.
 * @returns {number}
 */
RPG_EquipItem.prototype.getJaftingMaxRefineCount = function()
{
  return this.extractJaftingMaxRefineCount();
};

/**
 * Extracts the value from the notes.
 */
RPG_EquipItem.prototype.extractJaftingMaxRefineCount = function()
{
  return this.getNumberFromNotesByRegex(J.JAFTING.EXT.REFINE.RegExp.MaxRefineCount);
};
//endregion maxRefineCount

//region maxTraitCount
/**
 * The maximum number of traits this equip can be gain as a result of refinement.
 * This is defined as the number of traits that come after the divider.
 * @type {number}
 */
Object.defineProperty(RPG_EquipItem.prototype, "jaftingMaxTraitCount",
  {
    get: function()
    {
      return this.getJaftingMaxTraitCount();
    },
  });

/**
 * Gets how many traits this equip can have from refinement.
 * @returns {number}
 */
RPG_EquipItem.prototype.getJaftingMaxTraitCount = function()
{
  return this.extractJaftingMaxTraitCount();
};

/**
 * Extracts the value from the notes.
 */
RPG_EquipItem.prototype.extractJaftingMaxTraitCount = function()
{
  return this.getNumberFromNotesByRegex(J.JAFTING.EXT.REFINE.RegExp.MaxTraitCount);
};
//endregion maxRefineCount

//region JaftingManager
/**
 * A class responsible for handling interactions between the JAFTING data stores,
 * and the mutating the data itself.
 */
class JaftingManager
{
  /**
   * A collection of categories of equipment that are refinable.
   */
  static RefinementTypes = {
    Armor: "armor",
    Weapon: "weapon",
  }

  /**
   * The starting index for when our custom refined equips will be saved into the
   * target datastore.
   * @type {number}
   */
  static StartingIndex = 2001;

  /**
   * Parses all traits off the equipment that are below the "divider".
   * The divider is NOT parameterized, the "collapse effect" trait is the perfect trait
   * to use for this purpose since it has 0 use on actor equipment.
   * @param {RPG_EquipItem} equip An equip to parse traits off of.
   * @returns {JAFTING_Trait[]}
   */
  static parseTraits(equip)
  {
    // shallow copy of the traits (which is all we need- traits aren't layered).
    const allTraits = [...equip.traits];

    // identify where the divider is.
    const divider = allTraits.findIndex(trait => trait.code === 63);

    // if there was no divider, then there are no traits to parse.
    if (divider === -1) return Array.empty;

    // grab all the traits AFTER the divider.
    const availableTraits = allTraits.splice(divider + 1);

    // if we had a divider but nothing after it, then there are no traits to parse.
    if (availableTraits.length === 0) return Array.empty;

    // map all the traits into JAFTING traits for managing them properly.
    let jaftingTraits = availableTraits.map(t => new JAFTING_Trait(t.code, t.dataId, t.value));

    // combine all the various parameter-based traits.
    jaftingTraits = this.combineAllParameterTraits(jaftingTraits);

    // return the newly parsed traits.
    return jaftingTraits;
  }

  /**
   * Combines all parameter-related traits where applicable.
   * @param {JAFTING_Trait[]} traitList The list of traits.
   * @returns {JAFTING_Trait[]}
   */
  static combineAllParameterTraits(traitList)
  {
    traitList = this.combineBaseParameterTraits(traitList);
    traitList = this.combineExParameterTraits(traitList);
    traitList = this.combineSpParameterTraits(traitList);
    return traitList;
  }

  /**
   * Combines all b-parameter-traits that are applicable.
   * @param {JAFTING_Trait[]} traitList The list of traits.
   * @returns {JAFTING_Trait[]}
   */
  static combineBaseParameterTraits(traitList)
  {
    const canCombineCode = 21;
    let tempTraitList = JsonEx.makeDeepCopy(traitList);
    const traitTracker = {};
    const indices = [];
    traitList.forEach((trait, index) =>
    {
      if (trait._code !== canCombineCode) return;

      if (!traitTracker[trait._dataId])
      {
        // if we haven't started tracking it yet, add it.
        traitTracker[trait._dataId] = trait._value;
      }
      else
      {
        // if we have started tracking it, then increase the value by the bonus amount.
        traitTracker[trait._dataId] += trait._value - 1;
      }

      // mark the index to be removed and replaced later.
      indices.push(index);
    });

    // if we didn't have any traits to combine, then we're done.
    if (!indices.length)
    {
      return traitList;
    }

    // get rid of all the old traits.
    indices.forEach(i => tempTraitList.splice(i, 1, null));
    tempTraitList = tempTraitList.filter(element => !!element);

    // make the new combined traits and add them to the list.
    for (const dataId in traitTracker)
    {
      const value = parseFloat(traitTracker[dataId].toFixed(2));
      const newTrait = new JAFTING_Trait(canCombineCode, parseInt(dataId), value);
      tempTraitList.push(newTrait);
    }

    return tempTraitList;
  }

  /**
   * Combines all ex-parameter-traits that are applicable.
   * @param {JAFTING_Trait[]} traitList The list of traits.
   * @returns {JAFTING_Trait[]}
   */
  static combineExParameterTraits(traitList)
  {
    const canCombineCode = 22;
    let tempTraitList = JsonEx.makeDeepCopy(traitList);
    const traitTracker = {};
    const indices = [];
    traitList.forEach((trait, index) =>
    {
      if (trait._code !== canCombineCode) return;

      if (!traitTracker[trait._dataId])
      {
        // if we haven't started tracking it yet, add it.
        traitTracker[trait._dataId] = trait._value;
      }
      else
      {
        // if we have started tracking it, then increase the value by the bonus amount.
        traitTracker[trait._dataId] += trait._value;
      }

      // mark the index to be removed and replaced later.
      indices.push(index);
    });

    // if we didn't have any traits to combine, then we're done.
    if (!indices.length)
    {
      return traitList;
    }

    // get rid of all the old traits.
    indices.forEach(i => tempTraitList.splice(i, 1, null));
    tempTraitList = tempTraitList.filter(element => !!element);

    // make the new combined traits and add them to the list.
    for (const dataId in traitTracker)
    {
      const value = parseFloat(traitTracker[dataId].toFixed(2));
      const newTrait = new JAFTING_Trait(canCombineCode, parseInt(dataId), value);
      tempTraitList.push(newTrait);
    }

    return tempTraitList;
  }

  /**
   * Combines all sp-parameter-traits that are applicable.
   * @param {JAFTING_Trait[]} traitList The list of traits.
   * @returns {JAFTING_Trait[]}
   */
  static combineSpParameterTraits(traitList)
  {
    const canCombineCode = 23;
    let tempTraitList = JsonEx.makeDeepCopy(traitList);
    const traitTracker = {};
    const indices = [];
    traitList.forEach((trait, index) =>
    {
      if (trait._code !== canCombineCode) return;

      if (!traitTracker[trait._dataId])
      {
        // if we haven't started tracking it yet, add it.
        traitTracker[trait._dataId] = trait._value - 1;
      }
      else
      {
        // if we have started tracking it, then increase the value by the bonus amount.
        traitTracker[trait._dataId] += trait._value - 1;
      }

      // mark the index to be removed and replaced later.
      indices.push(index);
    });

    // if we didn't have any traits to combine, then we're done.
    if (!indices.length)
    {
      return traitList;
    }

    // get rid of all the old traits.
    indices.forEach(i => tempTraitList.splice(i, 1, null));
    tempTraitList = tempTraitList.filter(element => !!element);

    // make the new combined traits and add them to the list.
    for (const dataId in traitTracker)
    {
      const value = parseFloat(traitTracker[dataId].toFixed(2)) + 1;
      const newTrait = new JAFTING_Trait(canCombineCode, parseInt(dataId), value);
      tempTraitList.push(newTrait);
    }

    return tempTraitList;
  }

  /**
   * Determines the result of refining a given base with a given material.
   * @param {RPG_EquipItem} base An equip to parse traits off of.
   * @param {RPG_EquipItem} material An equip to parse traits off of.
   * @returns {RPG_EquipItem}
   */
  static determineRefinementOutput(base, material)
  {
    // don't process if we are missing a parameter.
    if (!base || !material) return null;

    let baseTraits = this.parseTraits(base);
    let materialTraits = this.parseTraits(material);

    [baseTraits, materialTraits] = this.removeIncompatibleTraits(baseTraits, materialTraits);

    [baseTraits, materialTraits] = this.#overwriteAllOverwritableTraits(baseTraits, materialTraits);

    // copy of primary equip that represents the projected result.
    const output = base._generate(base, base._index());

    // if the primary equip doesn't have any transferrable traits, then it also won't have a divider.
    if (!baseTraits.length)
    {
      // add a divider trait at the end of the primary equip's trait list.
      output.traits.push(JAFTING_Trait.divider());
    }
    else
    {
      // determine the divider's index.
      const index = output.traits.findIndex(trait => trait.code === 63);

      // check if we have a valid divider index and there is stuff after the divider.
      if (index > -1 && !!output.traits[index])
      {
        // if we have stuff after the divider, get rid of it.
        output.traits.splice(index + 1);
      }

      // add our modified primary traits.
      baseTraits.forEach(trait => output.traits.push(trait.convertToRmTrait()));
    }

    // iterate over all the secondary traits that can be transferred to the refined primary equip.
    materialTraits.forEach(trait =>
    {
      // if the trait is non-transferable, then skip it.
      if (!this.#isTransferableTrait(output, trait)) return;

      // create and add the new trait from the material onto the base.
      const newTrait = RPG_Trait.fromValues(trait._code, trait._dataId, trait._value);
      output.traits.push(newTrait);
    });

    if (material.jaftingRefinedCount > 0)
    {
      // the -1 at the end is to accommodate the default of +1 that occurs when an equip is refined.
      output.jaftingRefinedCount += material.jaftingRefinedCount - 1;
    }

    return output;
  }

  /**
   * Compares traits on the base item against those on the material, and purges
   * all conflicting traits from the result.
   * @param {JAFTING_Trait[]} baseTraits The traits from the base item.
   * @param {JAFTING_Trait[]} materialTraits The traits from the material.
   * @returns {[JAFTING_Trait[], JAFTING_Trait[]]}
   */
  static removeIncompatibleTraits(baseTraits, materialTraits)
  {
    // a list of traits that should be purged from the secondary list if found.
    const noDuplicateTraitCodes = [14, 31, 41, 42, 43, 44, 51, 52, 53, 54, 55, 62, 64];
    baseTraits.forEach(jaftingTrait =>
    {
      if (noDuplicateTraitCodes.includes(jaftingTrait._code))
      {
        this.purgeDuplicateTrait(jaftingTrait, materialTraits, jaftingTrait._code);
      }
    });

    // handle lock/unlock skills types.
    [baseTraits, materialTraits] = this.removeOppositeTrait(baseTraits, materialTraits, 41, 42);

    // handle lock/unlock skills.
    [baseTraits, materialTraits] = this.removeOppositeTrait(baseTraits, materialTraits, 43, 44);

    // overwrite basic attack skill.
    [baseTraits, materialTraits] = this.replaceTrait(baseTraits, materialTraits, 35);

    // overwrite enable/disable of dual-wield (unique case!)
    [baseTraits, materialTraits] = this.replaceTrait(baseTraits, materialTraits, 55);

    return [baseTraits, materialTraits];
  }

  /**
   * Compare one trait with a rolling trait list to see if the list has any conflicting
   * traits with it. If so, remove them.
   * @param {JAFTING_Trait} potentialJaftingTrait The trait potentially to add if it doesn't already exist.
   * @param {JAFTING_Trait[]} rollingJaftingTraitList The trait list to compare against.
   */
  static purgeDuplicateTrait(potentialJaftingTrait, rollingJaftingTraitList)
  {
    let donePurging = false;
    while (!donePurging)
    {
      const index = rollingJaftingTraitList.findIndex(trait => trait._code === potentialJaftingTrait._code);
      if (index > -1 && rollingJaftingTraitList[index]._dataId === potentialJaftingTrait._dataId)
      {
        rollingJaftingTraitList.splice(index, 1);
      }
      else
      {
        donePurging = true;
      }
    }
  }

  /**
   * Compares two lists of traits and looks for a pair of codes that could possibly be
   * opposing one another. If one code is found in one list, and the opposing code is found
   * in the other list, the traits are removed from their respective lists. This will look
   * in both lists for both codes, so repeating this function for both orders is not necessary.
   * This will also retroactively remove both codes if they somehow live in the same list.
   * @param {JAFTING_Trait[]} baseTraitList The primary list of traits.
   * @param {JAFTING_Trait[]} materialTraitList The secondary list of traits.
   * @param {number} code One of the codes to compare.
   * @param {number} opposingCode The opposing code to compare.
   * @returns {[JAFTING_Trait[], JAFTING_Trait[]]}
   */
  static removeOppositeTrait(baseTraitList, materialTraitList, code, opposingCode)
  {
    // determine (if any) the index of any designated trait codes.
    const hasTraitCode = trait => trait._code === code;
    const baseHasCode = baseTraitList.findIndex(hasTraitCode);
    const materialHasCode = materialTraitList.findIndex(hasTraitCode);

    // determine (if any) the index of any opposing trait codes.
    const hasOpposingTraitCode = trait => trait._code === opposingCode;
    const baseHasOpposingCode = baseTraitList.findIndex(hasOpposingTraitCode);
    const materialHasOpposingCode = materialTraitList.findIndex(hasOpposingTraitCode);

    // a re-usable function for checking if two indices were "found".
    const hasBothCodes = (leftIndex, rightIndex) => (leftIndex > -1 && rightIndex > -1);

    // if the primary has the base code, and secondary has opposing, remove both.
    if (hasBothCodes(baseHasCode, materialHasOpposingCode))
    {
      if (baseTraitList[baseHasCode]._dataId === materialTraitList[materialHasOpposingCode]._dataId)
      {
        baseTraitList.splice(baseHasCode, 1, null);
        materialTraitList.splice(materialHasOpposingCode, 1, null);
      }
    }

    // if the secondary has the base code, and primary has opposing, remove both.
    if (hasBothCodes(materialHasCode, baseHasOpposingCode))
    {
      if (baseTraitList[baseHasOpposingCode]._dataId === materialTraitList[materialHasCode]._dataId)
      {
        baseTraitList.splice(baseHasOpposingCode, 1, null);
        materialTraitList.splice(materialHasCode, 1, null);
      }
    }

    // if the primary list has both codes, remove both traits.
    if (hasBothCodes(baseHasCode, baseHasOpposingCode))
    {
      if (baseTraitList[baseHasCode]._dataId === baseTraitList[baseHasOpposingCode]._dataId)
      {
        baseTraitList.splice(baseHasCode, 1, null);
        baseTraitList.splice(baseHasOpposingCode, 1, null);
      }
    }

    // if the secondary list has both codes, remove both traits.
    if (hasBothCodes(materialHasCode, materialHasOpposingCode))
    {
      if (materialTraitList[materialHasCode]._dataId === materialTraitList[materialHasOpposingCode]._dataId)
      {
        materialTraitList.splice(materialHasCode, 1, null);
        materialTraitList.splice(materialHasOpposingCode, 1, null);
      }
    }

    // cleanup both our lists from any messy falsy traits.
    baseTraitList = baseTraitList.filter(trait => !!trait);
    materialTraitList = materialTraitList.filter(trait => !!trait);

    return [baseTraitList, materialTraitList];
  }

  /**
   * Removes a trait from the primary list if the same trait also lives on the secondary
   * list. This gives the illusion of overwriting the trait with the new one.
   * @param {JAFTING_Trait[]} baseTraitList The primary list of traits.
   * @param {JAFTING_Trait[]} materialTraitList The secondary list of traits.
   * @param {number} code The code to overwrite if it exists in both lists.
   * @returns {[JAFTING_Trait[], JAFTING_Trait[]]}
   */
  static replaceTrait(baseTraitList, materialTraitList, code)
  {
    // determine (if any) the index of any designated trait codes.
    const hasTraitCode = trait => trait._code === code;
    const baseHasCode = baseTraitList.findIndex(hasTraitCode);
    const materialHasCode = materialTraitList.findIndex(hasTraitCode);

    // a re-usable function for checking if two indices were "found".
    const hasBothCodes = (leftIndex, rightIndex) => (leftIndex > -1 && rightIndex > -1);

    // if both lists have the same trait, remove from base list.
    if (hasBothCodes(baseHasCode, materialHasCode))
    {
      baseTraitList.splice(baseHasCode, 1, null);
    }

    // cleanup both our lists from any removed traits.
    baseTraitList = baseTraitList.filter(trait => !!trait);
    return [baseTraitList, materialTraitList];
  }

  /**
   * Overwrites all traits from the two lists depending on which is better as applicable.
   * @param {JAFTING_Trait[]} baseTraits The primary list of traits.
   * @param {JAFTING_Trait[]} materialTraits The secondary list of traits.
   * @returns {[JAFTING_Trait[], JAFTING_Trait[]]}
   */
  static #overwriteAllOverwritableTraits(baseTraits, materialTraits)
  {
    const overwritableCodes = [11, 12, 13, 32, 33, 34, 61];
    overwritableCodes.forEach(code =>
    {
      [baseTraits, materialTraits] = this.#overwriteIfBetter(baseTraits, materialTraits, code);
    });

    return [baseTraits, materialTraits];
  }

  /**
   * Checks the material trait list to see if better versions of the traits in the base
   * trait list are already there. If so, purges them from the base to allow for "overwriting"
   * from the material.
   * @param {JAFTING_Trait[]} baseTraitList The primary list of traits.
   * @param {JAFTING_Trait[]} materialTraitList The secondary list of traits.
   * @param {number} code The code to overwrite if it exists in both lists.
   * @returns {[JAFTING_Trait[], JAFTING_Trait[]]}
   */
  static #overwriteIfBetter(baseTraitList, materialTraitList, code)
  {
    // a quick function to use against each element of the base trait list
    // to check and see if the material trait list has any of the same codes with dataIds
    const hasTraitCodeAndDataIdWithBetterValue = trait =>
    {
      if (trait._code !== code) return false;

      // check if another version of the trait exists on the material.
      const index = materialTraitList.findIndex(jaftingTrait =>
        jaftingTrait._code === code &&
        jaftingTrait._dataId === trait._dataId);
      return index > -1;
    };

    // get all indices that return true for the above function and store them.
    const sameIndices = [];
    baseTraitList.forEach((jaftingTrait, index) =>
    {
      if (hasTraitCodeAndDataIdWithBetterValue(jaftingTrait))
      {
        sameIndices.push(index);
      }
    });

    // if we have no matches to combine, then just return the lists untouched.
    if (!sameIndices.length) return [baseTraitList, materialTraitList];

    // create copies for working with.
    let tempBaseList = JsonEx.makeDeepCopy(baseTraitList);
    let tempMaterialList = JsonEx.makeDeepCopy(materialTraitList);

    const higherIsBetterCodes = [32, 33, 34, 61];
    const lowerIsBetterCodes = [11, 12, 13];

    // iterate over all shared traits to analyze them further.
    sameIndices.forEach(i =>
    {
      const baseTrait = baseTraitList[i];
      const materialTraitIndex = materialTraitList
        .findIndex(t => t._code === baseTrait._code && t._dataId === baseTrait._dataId);
      const materialTrait = materialTraitList[materialTraitIndex];
      // if the trait code prefers higher values, then compare that way.
      if (higherIsBetterCodes.includes(baseTrait._code))
      {
        if (baseTrait._value > materialTrait._value)
        {
          // if better on the base, then remove it from the material.
          tempMaterialList.splice(materialTraitIndex, 1, null);
        }
        else
        {
          // if better on the material, then remove it from the base.
          tempBaseList.splice(i, 1, null);
        }
        // if the trait code prefers lower values, then compare that way.
      }
      else if (lowerIsBetterCodes.includes(baseTrait._code))
      {
        if (baseTrait._value < materialTrait._value)
        {
          // if better on the base, then remove it from the material.
          tempMaterialList.splice(materialTraitIndex, 1, null);
        }
        else
        {
          // if better on the material, then remove it from the base.
          tempBaseList.splice(i, 1, null);
        }
      }
    });

    tempBaseList = tempBaseList
      .filter(t => !!t)
      .map(t => new JAFTING_Trait(t._code, t._dataId, t._value));
    tempMaterialList = tempMaterialList
      .filter(t => !!t)
      .map(t => new JAFTING_Trait(t._code, t._dataId, t._value));

    return [tempBaseList, tempMaterialList];
  }

  /**
   * Determines whether or not a trait should be transfered to the refined base equip.
   * @param {RPG_EquipItem} output The to-be refined base equip.
   * @param {JAFTING_Trait} jaftingTrait The new trait to be potentially transferred.
   * @returns {boolean}
   */
  static #isTransferableTrait(output, jaftingTrait)
  {
    switch (jaftingTrait._code)
    {
      case 11: // elemental damage rate - stackable.
      case 12: // debuff rate - stackable.
      case 13: // state rate - stackable.
      case 14: // state immunity - don't add the same twice.
      case 21: // base parameter rate - stackable.
      case 22: // ex-parameter rate - stackable.
      case 23: // sp-parameter rate - stackable.
      case 31: // attack element - uniquely stackable.
      case 32: // apply state chance - stackable.
      case 33: // skill speed - stackable.
      case 34: // repeat times - stackable.
      case 35: // change basic attack skill - overwrite.
      case 41: // unlock skill type - one or the other or none.
      case 42: // lock skill type - one or the other or none.
      case 43: // learn skill while equipped - one or the other or none.
      case 44: // unlearn skill while equipped - one or the other or none.
      case 51: // can use new weapon type - don't add the same twice.
      case 52: // can use new armor type - don't add the same twice.
      case 53: // (lock)cannot change equipment from slot.
      case 55: // enable/disable dual-wielding - overwrite.
      case 61: // action times percent boost - stackable.
      case 62: // special flag - don't add the same twice.
      case 64: // party ability - don't add the same twice.
        return true;

      case 54: // (seal) slot is not equippable while equipped.
        const sealingOwnEquipType = (jaftingTrait._dataId === output.etypeId);
        // don't transfer over slot sealing if it would seal the slot the equip is on.
        return !sealingOwnEquipType;
      default:
        console.error(`all traits are accounted for- is this a custom trait code: [${jaftingTrait._code}]?`);
        return false;
    }
  }

  /**
   * Takes the refinement result equip and creates it in the appropriate datastore, and adds it to
   * the player's inventory.
   * @param {RPG_EquipItem} outputEquip The equip to generate and add to the player's inventory.
   */
  static createRefinedOutput(outputEquip)
  {
    if (outputEquip.wtypeId)
    {
      this.generateRefinedEquip($dataWeapons, outputEquip, this.RefinementTypes.Weapon);
    }
    else if (outputEquip.atypeId)
    {
      this.generateRefinedEquip($dataArmors, outputEquip, this.RefinementTypes.Armor);
    }
  };

  /**
   * Generates the new entry in the corresponding datastore for the new equip data that was refined.
   * @param {RPG_Weapon[]|RPG_Armor[]} datastore The datastore to extend with new data.
   * @param {RPG_EquipItem} equip The equip to generate and add to the player's inventory.
   * @param {string} refinementType The type of equip this is; for incrementing the counter on custom data.
   * @returns {RPG_EquipItem}
   */
  static generateRefinedEquip(datastore, equip, refinementType)
  {
    equip.jaftingRefinedCount++;
    const suffix = `+${equip.jaftingRefinedCount}`;
    if (equip.jaftingRefinedCount === 1)
    {
      // first time refining, they don't have a name to replace.
      equip.name = `${equip.name} ${suffix}`;
    }
    else
    {
      // second or later time refining, they need to replace the suffix.
      const index = equip.name.indexOf("+");
      if (index > -1)
      {
        equip.name = `${equip.name.slice(0, index)}${suffix}`;
      }
      else
      {
        equip.name = `${equip.name} ${suffix}`;
      }
    }

    // generate the new entry in the database.
    const newIndex = $gameParty.getRefinementCounter(refinementType);
    equip._updateIndex(newIndex);
    datastore[newIndex] = equip;

    // gain the actual item.
    $gameParty.gainItem(datastore[newIndex], 1);

    // increment the index to ensure we don't overwrite it.
    $gameParty.incrementRefinementCounter(refinementType);

    // add it to our running list of everything we've literally ever created ever.
    if (equip.wtypeId)
    {
      $gameParty.addRefinedWeapon(equip);
    }
    else if (equip.atypeId)
    {
      $gameParty.addRefinedArmor(equip);
    }
    else
    {
      console.error(`The following equip failed to be captured because it was neither weapon nor armor.`);
      console.warn(equip);
      throw new Error("please stop crafting stuff that isn't valid.");
    }
  }
}
//endregion JaftingManager

//region Game_Item
/**
 * Largely overwrites this function to instead leverage an item's index value over
 * it's ID for setting objects to the item slot.
 */
J.JAFTING.EXT.REFINE.Aliased.Game_Item.set('setObject', Game_Item.prototype.setObject);
Game_Item.prototype.setObject = function(item)
{
  // perform original logic.
  J.JAFTING.EXT.REFINE.Aliased.Game_Item.get('setObject').call(this, item);

  // assign the item id to here.
  this._itemId = item
    ? item._key()
    : 0;
};
//endregion Game_Item

//region Game_Party
/**
 * Extends {@link #initialize}.<br>
 * Also initializes our jafting members.
 */
J.JAFTING.EXT.REFINE.Aliased.Game_Party.set('initialize', Game_Party.prototype.initialize);
Game_Party.prototype.initialize = function()
{
  // perform original logic.
  J.JAFTING.EXT.REFINE.Aliased.Game_Party.get('initialize').call(this);

  // init the members.
  this.initJaftingRefinementMembers();
};

/**
 * Initializes all refinement-related JAFTING members of this class.
 */
Game_Party.prototype.initJaftingRefinementMembers = function()
{
  /**
   * The shared root namespace for all of J's plugin data.
   */
  this._j ||= {};

  /**
   * A grouping of all properties associated with the jafting system.
   */
  this._j._refinement ||= {};

  /**
   * A collection of all weapons that have been refined.
   * @type {RPG_EquipItem[]}
   */
  this._j._refinement._weapons = [];

  /**
   * A collection of all armors that have been refined.
   * @type {RPG_EquipItem[]}
   */
  this._j._refinement._armors = [];

  /**
   * A collection of all current increment indices for refinable equipment types.
   * This ensures no refined equipment gets overwritten by another refined equipment.
   * @type {number}
   */
  this._j._refinement._increments = {};

  /**
   * The refinement increment index for weapons.
   * @type {number}
   */
  this._j._refinement._increments[JaftingManager.RefinementTypes.Weapon] = JaftingManager.StartingIndex;

  /**
   * The refinement increment index for armors.
   * @type {number}
   */
  this._j._refinement._increments[JaftingManager.RefinementTypes.Armor] = JaftingManager.StartingIndex;
};

/**
 * Gets all tracked weapons that have been refined.
 * @returns {RPG_EquipItem[]}
 */
Game_Party.prototype.getRefinedWeapons = function()
{
  return this._j._refinement._weapons;
};

/**
 * Gets all tracked armors that have been refined.
 * @returns {RPG_EquipItem[]}
 */
Game_Party.prototype.getRefinedArmors = function()
{
  return this._j._refinement._armors;
};

/**
 * Adds a newly refined weapon to the collection for tracking purposes.
 * @param {RPG_EquipItem} equip The newly refined weapon.
 */
Game_Party.prototype.addRefinedWeapon = function(equip)
{
  this._j._refinement._weapons.push(equip);
};

/**
 * Adds a newly refined armor to the collection for tracking purposes.
 * @param {RPG_EquipItem} equip The newly refined armor.
 */
Game_Party.prototype.addRefinedArmor = function(equip)
{
  this._j._refinement._armors.push(equip);
};

/**
 * Updates the $dataWeapons collection to include the player's collection of
 * refined weapons.
 */
Game_Party.prototype.refreshDatabaseWeapons = function()
{
  this.getRefinedWeapons().forEach(weapon =>
  {
    const updatedWeapon = new RPG_Weapon(weapon, weapon.index);
    $dataWeapons[updatedWeapon._key()] = updatedWeapon;
  });
};

/**
 * Updates the $dataArmors collection to include the player's collection of
 * refined armors.
 */
Game_Party.prototype.refreshDatabaseArmors = function()
{
  this.getRefinedArmors().forEach(armor =>
  {
    const updatedArmor = new RPG_Armor(armor, armor.index);
    $dataArmors[updatedArmor._key()] = updatedArmor;
  });
};

/**
 * Gets the current increment for a particular datastore's latest index.
 * @param {string} refinementType One of the refinement types.
 * @returns {number}
 */
Game_Party.prototype.getRefinementCounter = function(refinementType)
{
  return this._j._refinement._increments[refinementType];
};

/**
 * Increments the refinement index for a particular datastore.
 * @param {string} refinementType One of the refinement types.
 */
Game_Party.prototype.incrementRefinementCounter = function(refinementType)
{
  this._j._refinement._increments[refinementType]++;
};
//endregion Game_Party

//region Game_System
/**
 * Extends {@link #onAfterLoad}.<br>
 * Updates the database with the tracked refined equips.
 */
J.JAFTING.EXT.REFINE.Aliased.Game_System.set('onAfterLoad', Game_System.prototype.onAfterLoad);
Game_System.prototype.onAfterLoad = function()
{
  // perform original logic.
  J.JAFTING.EXT.REFINE.Aliased.Game_System.get('onAfterLoad').call(this);

  // update the weapons & armor.
  $gameParty.refreshDatabaseWeapons();
  $gameParty.refreshDatabaseArmors();
};
//endregion Game_System

//region Scene_Jafting
/**
 * Extends {@link #onRootJaftingSelection}.<br>
 * When JAFTING is selected, open the root JAFTING menu.
 */
J.JAFTING.EXT.REFINE.Aliased.Scene_Jafting
  .set('onRootJaftingSelection', Scene_Jafting.prototype.onRootJaftingSelection);
Scene_Jafting.prototype.onRootJaftingSelection = function()
{
  // grab which JAFTING mode was selected.
  const currentSelection = this.getRootJaftingKey();

  // check if the current selection is create.
  if (currentSelection === Scene_JaftingRefine.KEY)
  {
    // execute the monsterpedia.
    this.jaftingRefinementSelected();
  }
  // the current selection is not create.
  else
  {
    // possibly activate other choices.
    J.JAFTING.EXT.REFINE.Aliased.Scene_Jafting.get('onRootJaftingSelection').call(this);
  }
};

/**
 * Switch to the jafting creation scene when selected from the root jafting list.
 */
Scene_Jafting.prototype.jaftingRefinementSelected = function()
{
  // close the root jafting windows.
  this.closeRootJaftingWindows();

  // call the creation scene.
  Scene_JaftingRefine.callScene();
};
//endregion Scene_Jafting

//region Scene_JaftingRefine
class Scene_JaftingRefine extends Scene_MenuBase
{
  /**
   * Pushes this current scene onto the stack, forcing it into action.
   */
  static callScene()
  {
    SceneManager.push(this);
  }

  /**
   * The symbol representing the command for this scene from other menus.
   * @type {string}
   */
  static KEY = 'jafting-refine';

  /**
   * Constructor.
   */
  constructor()
  {
    // call super when having extended constructors.
    super();

    // jumpstart initialization on creation.
    this.initialize();
  }

  //region init
  /**
   * Initialize the window and all properties required by the scene.
   */
  initialize()
  {
    // perform original logic.
    super.initialize();

    // also initialize our scene properties.
    this.initMembers();
  }

  /**
   * Initialize all properties for our omnipedia.
   */
  initMembers()
  {
    // initialize the root-namespace definition members.
    this.initCoreMembers();

    // initialize the monsterpedia members.
    this.initPrimaryMembers();
  }

  /**
   * The core properties of this scene are the root namespace definitions for this plugin.
   */
  initCoreMembers()
  {
    /**
     * The shared root namespace for all of J's plugin data.
     */
    this._j ||= {};

    /**
     * A grouping of all properties associated with the omnipedia.
     */
    this._j._crafting = {};
  }

  /**
   * The primary properties of the scene are the initial properties associated with
   * the main list containing all pedias unlocked by the player along with some subtext of
   * what the pedia entails.
   */
  initPrimaryMembers()
  {
    /**
     * A grouping of all properties associated with the jafting type of refinement.
     * Refinement is a subcategory of the jafting system.
     */
    this._j._crafting._refine = {};

    /**
     * The window that shows the tertiary information about a refinable.
     * @type {Window_RefinementDescription}
     */
    this._j._crafting._refine._refinementDescription = null;

    /**
     * The window that shows the list of equips that can be used as a base for refinement.
     * @type {Window_RefinableList}
     */
    this._j._crafting._refine._baseRefinableList = null;

    /**
     * The window that shows the list of equips that can be used as fodder for refinement.
     * @type {Window_RefinableList}
     */
    this._j._crafting._refine._consumedRefinableList = null;

    /**
     * The window that shows the details of the refinement given the selected entries.
     * @type {Window_RefinementDetails}
     */
    this._j._crafting._refine._refinementDetails = null;

    /**
     * The window that shows the list of ingredients on the currently selected recipe.
     * @type {Window_RecipeIngredientList}
     */
    this._j._crafting._refine._confirmationPrompt = null;


    /**
     * The window that shows the list of tools on the currently selected recipe.
     * @type {Window_RecipeToolList}
     */
    this._j._crafting._refine._baseSelected = null;

    /**
     * The window that shows the list of outputs on the currently selected recipe.
     * @type {Window_RecipeOutputList}
     */
    this._j._crafting._refine._consumedSelected = null;
  }

  getBaseSelected()
  {
    return this._j._crafting._refine._baseSelected;
  }

  setBaseSelected(equip)
  {
    this._j._crafting._refine._baseSelected = equip;
  }

  getConsumedSelected()
  {
    return this._j._crafting._refine._consumedSelected;
  }

  setConsumedSelected(equip)
  {
    this._j._crafting._refine._consumedSelected = equip;
  }
  //endregion init

  //region create
  /**
   * Initialize all resources required for this scene.
   */
  create()
  {
    // perform original logic.
    super.create();

    // create the various display objects on the screen.
    this.createDisplayObjects();
  }

  /**
   * Creates the display objects for this scene.
   */
  createDisplayObjects()
  {
    // create all our windows.
    this.createAllWindows();

    // configure window relations and such now that they are all created.
    this.configureAllWindows();
  }

  /**
   * Creates all windows in this scene.
   */
  createAllWindows()
  {
    // create all the windows.
    this.createRefinementDescriptionWindow();
    this.createBaseRefinableListWindow();
    this.createConsumableRefinableListWindow();
    this.createRefinementDetailsWindow();
    this.createRefinementConfirmationWindow();
  }

  /**
   * Configures all windows.
   */
  configureAllWindows()
  {
    const listWindow = this.getBaseRefinableListWindow();

    // also update with the currently selected item, if one exists.
    this.getRefinementDescriptionWindow().setText(listWindow.currentHelpText() ?? String.empty);

    const selected = listWindow.currentExt();
    this.setBaseSelected(selected.data);

    const detailsWindow = this.getRefinementDetailsWindow();
    detailsWindow.primaryEquip = selected?.data;
  }

  /**
   * Overrides {@link Scene_MenuBase.prototype.createBackground}.<br>
   * Changes the filter to a different type from {@link PIXI.filters}.<br>
   */
  createBackground()
  {
    this._backgroundFilter = new PIXI.filters.AlphaFilter(0.1);
    this._backgroundSprite = new Sprite();
    this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
    this._backgroundSprite.filters = [this._backgroundFilter];
    this.addChild(this._backgroundSprite);
    //this.setBackgroundOpacity(220);
  }

  /**
   * Overrides {@link #createButtons}.<br>
   * Disables the creation of the buttons.
   * @override
   */
  createButtons()
  {
  }
  //endregion create

  //region refinement description
  /**
   * Creates the RefinementDescription window.
   */
  createRefinementDescriptionWindow()
  {
    // create the window.
    const window = this.buildRefinementDescriptionWindow();

    // update the tracker with the new window.
    this.setRefinementDescriptionWindow(window);

    // add the window to the scene manager's tracking.
    this.addWindow(window);
  }

  buildRefinementDescriptionWindow()
  {
    // define the rectangle of the window.
    const rectangle = this.getRefinementDescriptionRectangle();

    // create the window with the rectangle.
    const window = new Window_RefinementDescription(rectangle);

    // return the built and configured window.
    return window;
  }

  /**
   * Gets the rectangle associated with this window.
   * @returns {Rectangle}
   */
  getRefinementDescriptionRectangle()
  {
    // grab the rect for the recipe list this should be next to.
    const listWindow = this.getBaseRefinableListRectangle();

    // the description should live at the right side of the list.
    const x = listWindow.width + Graphics.horizontalPadding;

    // the window's origin coordinates are the box window's origin as well.
    const [ _, y ] = Graphics.boxOrigin;

    // define the width of the window.
    const width = Graphics.boxWidth - listWindow.width - Graphics.horizontalPadding;

    // define the height of the window.
    const height = 100;

    // build the rectangle to return.
    return new Rectangle(x, y, width, height);
  }

  /**
   * Gets the RefinementDescription window being tracked.
   */
  getRefinementDescriptionWindow()
  {
    return this._j._crafting._refine._refinementDescription;
  }

  /**
   * Sets the RefinementDescription window tracking.
   */
  setRefinementDescriptionWindow(someWindow)
  {
    this._j._crafting._refine._refinementDescription = someWindow;
  }
  //endregion refinement description

  //region base refinable list
  /**
   * Creates the base RefinableList window.
   */
  createBaseRefinableListWindow()
  {
    // create the window.
    const window = this.buildRefinableListWindow();

    // update the tracker with the new window.
    this.setBaseRefinableListWindow(window);

    // add the window to the scene manager's tracking.
    this.addWindow(window);
  }

  buildRefinableListWindow()
  {
    // define the rectangle of the window.
    const rectangle = this.getBaseRefinableListRectangle();

    // create the window with the rectangle.
    const window = new Window_RefinableList(rectangle);

    // designate this refinable list window as the primary.
    window.isPrimary = true;

    // assign cancel functionality.
    window.setHandler('cancel', this.onBaseRefinableListCancel.bind(this));

    // assign on-select functionality.
    window.setHandler('ok', this.onBaseRefinableListSelection.bind(this));

    // overwrite the onIndexChange hook with our local hook.
    window.onIndexChange = this.onBaseRefinableListIndexChange.bind(this);

    // return the built and configured window.
    return window;
  }

  /**
   * Gets the rectangle associated with this window.
   * @returns {Rectangle}
   */
  getBaseRefinableListRectangle()
  {
    // the window's origin coordinates are the box window's origin as well.
    const [x, y] = Graphics.boxOrigin;

    // define the width of the window.
    const width = 350;

    // define the height of the window.
    const height = Graphics.boxHeight - (Graphics.verticalPadding);

    // build the rectangle to return.
    return new Rectangle(x, y, width, height);
  }

  /**
   * Gets the RefinableList window being tracked.
   */
  getBaseRefinableListWindow()
  {
    return this._j._crafting._refine._baseRefinableList;
  }

  /**
   * Sets the RefinableList window tracking.
   */
  setBaseRefinableListWindow(someWindow)
  {
    this._j._crafting._refine._baseRefinableList = someWindow;
  }

  selectBaseRefinableListWindow()
  {
    // grab the window.
    const listWindow = this.getBaseRefinableListWindow();

    // reveal the window.
    listWindow.show();
    listWindow.activate();

    this.getRefinementDescriptionWindow()
      .setText(listWindow.currentHelpText());
  }

  deselectBaseRefinableListWindow()
  {
    // grab the window.
    const listWindow = this.getBaseRefinableListWindow();

    // reveal the window.
    listWindow.hide();
    listWindow.deactivate();
  }

  onBaseRefinableListIndexChange()
  {
    const listWindow = this.getBaseRefinableListWindow();

    const helpText = listWindow.currentHelpText();
    this.getRefinementDescriptionWindow().setText(helpText ?? String.empty);

    const baseRefinable = listWindow.currentExt();
    this.getRefinementDetailsWindow().primaryEquip = baseRefinable?.data;
  }

  onBaseRefinableListCancel()
  {
    // revert to the previous scene.
    SceneManager.pop();
  }

  onBaseRefinableListSelection()
  {
    const baseRefinableListWindow = this.getBaseRefinableListWindow();

    const baseRefinable = baseRefinableListWindow.currentExt().data;
    this.setBaseSelected(baseRefinable);

    this.deselectBaseRefinableListWindow();
    this.selectConsumableRefinableListWindow();
  }
  //endregion base refinable list

  //region consumable refinable list
  /**
   * Creates the consumable RefinableList window.
   */
  createConsumableRefinableListWindow()
  {
    // create the window.
    const window = this.buildConsumableRefinableListWindow();

    // update the tracker with the new window.
    this.setConsumableRefinableListWindow(window);

    // add the window to the scene manager's tracking.
    this.addWindow(window);
  }

  buildConsumableRefinableListWindow()
  {
    // define the rectangle of the window.
    const rectangle = this.getConsumableRefinableListRectangle();

    // create the window with the rectangle.
    const window = new Window_RefinableList(rectangle);

    // assign cancel functionality.
    window.setHandler('cancel', this.onConsumableRefinableListCancel.bind(this));

    // assign on-select functionality.
    window.setHandler('ok', this.onConsumableRefinableListSelection.bind(this));

    // overwrite the onIndexChange hook with our local hook.
    window.onIndexChange = this.onConsumableRefinableListIndexChange.bind(this);

    // also put the window away.
    window.hide();
    window.deactivate();

    // return the built and configured window.
    return window;
  }

  /**
   * Gets the rectangle associated with this window.
   * @returns {Rectangle}
   */
  getConsumableRefinableListRectangle()
  {
    // the window's origin coordinates are the box window's origin as well.
    const [x, y] = Graphics.boxOrigin;

    // define the width of the window.
    const width = 350;

    // define the height of the window.
    const height = Graphics.boxHeight - (Graphics.verticalPadding);

    // build the rectangle to return.
    return new Rectangle(x, y, width, height);
  }

  /**
   * Gets the consumable RefinableList window being tracked.
   */
  getConsumableRefinableListWindow()
  {
    return this._j._crafting._refine._consumedRefinableList;
  }

  /**
   * Sets the consumable RefinableList window tracking.
   */
  setConsumableRefinableListWindow(someWindow)
  {
    this._j._crafting._refine._consumedRefinableList = someWindow;
  }

  selectConsumableRefinableListWindow()
  {
    // grab the window.
    const listWindow = this.getConsumableRefinableListWindow();

    // reveal the window.
    listWindow.baseSelection = this.getBaseSelected();
    listWindow.refresh();
    listWindow.show();
    listWindow.activate();

    const selected = listWindow.currentExt()?.data;
    this.setConsumedSelected(selected);
    this.getRefinementDetailsWindow().secondaryEquip = selected;

    this.getRefinementDescriptionWindow()
      .setText(listWindow.currentHelpText());

  }

  deselectConsumableRefinableListWindow()
  {
    // grab the window.
    const listWindow = this.getConsumableRefinableListWindow();

    // reveal the window.
    listWindow.hide();
    listWindow.deactivate();
  }

  onConsumableRefinableListIndexChange()
  {
    const listWindow = this.getConsumableRefinableListWindow();

    const helpText = listWindow.currentHelpText();
    this.getRefinementDescriptionWindow().setText(helpText ?? String.empty);

    const consumedRefinable = listWindow.currentExt();
    this.getRefinementDetailsWindow().secondaryEquip = consumedRefinable.data;
  }

  onConsumableRefinableListCancel()
  {
    this.deselectConsumableRefinableListWindow();

    this.selectBaseRefinableListWindow();
  }

  onConsumableRefinableListSelection()
  {
    const listWindow = this.getConsumableRefinableListWindow();

    const consumedRefinable = listWindow.currentExt().data;
    this.setConsumedSelected(consumedRefinable);

    //this.deselectConsumableRefinableListWindow();
    this.selectRefinementConfirmationWindow();
  }
  //endregion consumable refinable list

  //region refinement details
  /**
   * Creates the RefinementDetails window.
   */
  createRefinementDetailsWindow()
  {
    // create the window.
    const window = this.buildRefinementDetailsWindow();

    // update the tracker with the new window.
    this.setRefinementDetailsWindow(window);

    // add the window to the scene manager's tracking.
    this.addWindow(window);
  }

  buildRefinementDetailsWindow()
  {
    // define the rectangle of the window.
    const rectangle = this.getRefinementDetailsRectangle();

    // create the window with the rectangle.
    const window = new Window_RefinementDetails(rectangle);

    // return the built and configured window.
    return window;
  }

  /**
   * Gets the rectangle associated with this window.
   * @returns {Rectangle}
   */
  getRefinementDetailsRectangle()
  {
    const widthReduction = this.getBaseRefinableListRectangle().width + Graphics.horizontalPadding;
    const x = 0 + widthReduction;

    const heightReduction = (this.getRefinementDescriptionWindow().height + Graphics.verticalPadding);
    const y = 0 + heightReduction;

    // define the width of the window.
    const width = Graphics.boxWidth - widthReduction;

    // define the height of the window.
    const height = Graphics.boxHeight - heightReduction;

    // build the rectangle to return.
    return new Rectangle(x, y, width, height);
  }

  /**
   * Gets the RefinementDetails window being tracked.
   */
  getRefinementDetailsWindow()
  {
    return this._j._crafting._refine._refinementDetails;
  }

  /**
   * Sets the RefinementDetails window tracking.
   */
  setRefinementDetailsWindow(someWindow)
  {
    this._j._crafting._refine._refinementDetails = someWindow;
  }
  //endregion refinement details

  //region confirmation prompt
  /**
   * Creates the RefinementConfirmation window.
   */
  createRefinementConfirmationWindow()
  {
    // create the window.
    const window = this.buildRefinementConfirmationWindow();

    // update the tracker with the new window.
    this.setRefinementConfirmationWindow(window);

    // add the window to the scene manager's tracking.
    this.addWindow(window);
  }

  buildRefinementConfirmationWindow()
  {
    // define the rectangle of the window.
    const rectangle = this.getRefinementConfirmationRectangle();

    // create the window with the rectangle.
    const window = new Window_RefinementConfirmation(rectangle);

    // assign cancel functionality.
    window.setHandler('cancel', this.onRefinementConfirmationCancel.bind(this));

    // assign on-select functionality.
    window.setHandler('ok', this.onRefinementConfirmationSelection.bind(this));

    // also put the window away.
    window.hide();
    window.deactivate();

    // return the built and configured window.
    return window;
  }

  /**
   * Gets the rectangle associated with this window.
   * @returns {Rectangle}
   */
  getRefinementConfirmationRectangle()
  {
    // define the width of the window.
    const width = 350;

    // define the height of the window.
    const height = 120;

    // define the window's origin coordinates.
    const x = (Graphics.boxWidth - width) / 2;
    const y = (Graphics.boxHeight - height) / 2;

    // build the rectangle to return.
    return new Rectangle(x, y, width, height);
  }

  /**
   * Gets the RefinementConfirmation window being tracked.
   */
  getRefinementConfirmationWindow()
  {
    return this._j._crafting._refine._confirmationPrompt;
  }

  selectRefinementConfirmationWindow()
  {
    // grab the window.
    const listWindow = this.getRefinementConfirmationWindow();

    // reveal the window.
    listWindow.show();
    listWindow.activate();
  }

  deselectRefinementConfirmationWindow()
  {
    // grab the window.
    const listWindow = this.getRefinementConfirmationWindow();

    // reveal the window.
    listWindow.hide();
    listWindow.deactivate();
  }

  /**
   * Sets the RefinementConfirmation window tracking.
   */
  setRefinementConfirmationWindow(someWindow)
  {
    this._j._crafting._refine._confirmationPrompt = someWindow;
  }

  onRefinementConfirmationCancel()
  {
    this.deselectRefinementConfirmationWindow();
    this.selectConsumableRefinableListWindow();
  }

  onRefinementConfirmationSelection()
  {
    // remove the materials being refined.
    $gameParty.gainItem(this.getBaseSelected(), -1);
    $gameParty.gainItem(this.getConsumedSelected(), -1);

    // generate the output.
    const detailsWindow = this.getRefinementDetailsWindow();
    const output = detailsWindow.outputEquip;
    JaftingManager.createRefinedOutput(output);

    // clear the existing data from the details window.
    detailsWindow.primaryEquip = null;
    detailsWindow.secondaryEquip = null;

    // reselect the original window.
    this.deselectConsumableRefinableListWindow();
    this.deselectRefinementConfirmationWindow();
    this.selectBaseRefinableListWindow();

    // clear the materials that were just used.
    this.setBaseSelected(null);
    this.setConsumedSelected(null);

    const listWindow = this.getBaseRefinableListWindow();
    listWindow.refresh();
    listWindow.select(0);

    this.getConsumableRefinableListWindow().refresh();
  }
  //endregion confirmation prompt
}
//endregion

//region Window_JaftingList
/**
 * Extends {@link #buildCommands}.<br>
 * Includes the refinement command as well as the rest.
 */
J.JAFTING.EXT.REFINE.Aliased.Window_JaftingList.set('buildCommands', Window_JaftingList.prototype.buildCommands);
Window_JaftingList.prototype.buildCommands = function()
{
  // get the original list of commands.
  const commands = J.JAFTING.EXT.REFINE.Aliased.Window_JaftingList.get('buildCommands').call(this);

  // add the creation command.
  commands.push(this.buildRefinementCommand());

  // return the compiled list.
  return commands;
};

/**
 * Builds the jafting refinement command for the main jafting types menu.
 * @return {BuiltWindowCommand}
 */
Window_JaftingList.prototype.buildRefinementCommand = function()
{
  return new WindowCommandBuilder(J.JAFTING.EXT.REFINE.Metadata.commandName)
    .setSymbol(Scene_JaftingRefine.KEY)
    .setEnabled($gameSwitches.value(J.JAFTING.EXT.REFINE.Metadata.menuSwitchId))
    .addSubTextLine("Give your equipment a personal touch.")
    .addSubTextLine("Modify your equips with trait transferrence and reach for godlihood!")
    .setIconIndex(J.JAFTING.EXT.REFINE.Metadata.commandIconIndex)
    .build();
};
//endregion Window_JaftingList

//region Window_JaftingEquip
/**
 * A window that shows a list of all equipment.
 */
class Window_RefinableList extends Window_Command
{
  /**
   * @constructor
   * @param {Rectangle} rect The rectangle that represents this window.
   */
  constructor(rect)
  {
    super(rect);
    this.initialize(rect);
    this.initMembers();
  }

  /**
   * Initializes the properties of this class.
   */
  initMembers()
  {
    /**
     * The currently selected index of this equip selection window.
     * @type {number}
     */
    this._currentIndex = null;

    /**
     * Whether or not this equip list window is the primary equip or not.
     * @type {boolean}
     */
    this._isPrimaryEquipWindow = false;

    /**
     * The current equip that is selected as the base for refinement.
     * @type {RPG_EquipItem}
     */
    this._primarySelection = null;

    /**
     * The projected result of refining the base item with the selected material.
     * @type {RPG_EquipItem}
     */
    this._projectedOutput = null;
  }

  /**
   * Gets whether or not this equip list window is the primary equip or not.
   * @returns {boolean}
   */
  get isPrimary()
  {
    return this._isPrimaryEquipWindow;
  }

  /**
   * Sets whether or not this equip list window is the base equip or not.
   */
  set isPrimary(primary)
  {
    this._isPrimaryEquipWindow = primary;
    this.refresh();
  }

  /**
   * Gets the base selection.
   * Always null if this is the primary equip window.
   * @returns {RPG_EquipItem}
   */
  get baseSelection()
  {
    return this._primarySelection;
  }

  /**
   * Sets the primary selection.
   */
  set baseSelection(equip)
  {
    this._primarySelection = equip;
  }

  /**
   * OVERWRITE Sets the alignment for this command window to be left-aligned.
   */
  itemTextAlign()
  {
    return "left";
  }

  /**
   * Creates a list of all available equipment in the inventory.
   */
  makeCommandList()
  {
    // this command list is based purely off of all equipment.
    let equips = $gameParty.equipItems();

    // don't make the list if we have nothing to draw.
    if (!equips.length) return;

    // if this is the primary equip window, don't show the "materials" equipment type.
    if (this.isPrimary)
    {
      // TODO: parameterize this.
      // omit armor type 5, which is "- materials -".
      equips = equips.filter(equip => equip.atypeId !== 5);
    }

    // sort equips first by weapons > armor, then by id in descending order to group equips.
    equips.sort((a, b) =>
    {
      if (a.etypeId > b.etypeId) return 1;
      if (a.etypeId < b.etypeId) return -1;
      if (a.id > b.id) return 1;
      if (a.id < b.id) return -1;
    });

    // iterate over each equip the party has in their inventory.
    equips.forEach(equip =>
    {
      // don't render equipment that are totally unrefinable. That's a tease!
      if (equip.jaftingUnrefinable) return;

      const equipCount = $gameParty.numItems(equip);

      const hasDuplicatePrimary = $gameParty.numItems(this.baseSelection) > 1;
      const isBaseSelection = equip === this.baseSelection;
      const canSelectBaseAgain = (isBaseSelection && hasDuplicatePrimary) || !isBaseSelection;
      let enabled = this.isPrimary
        ? true
        : canSelectBaseAgain; // only select the base again if you have 2+ copies of it.

      let {iconIndex} = equip;

      let errorText = "";

      // if the equipment is completely unable to
      if (equip.jaftingUnrefinable)
      {
        enabled = false;
        iconIndex = 90;
      }

      // if this is the second equip window...
      if (!this.isPrimary)
      {
        // and the equipment has no transferable traits, then disable it.
        if (!JaftingManager.parseTraits(equip).length)
        {
          enabled = false;
          errorText += `${J.JAFTING.EXT.REFINE.Messages.NoTraitsOnMaterial}\n`;
        }

        // prevent equipment explicitly marked as "not usable as material" from being used.
        if (equip.jaftingNotRefinementMaterial)
        {
          enabled = false;
          iconIndex = 90;
        }

        // or the projected equips combined would result in over the max refined count, then disable it.
        if (this.baseSelection)
        {
          const primaryHasMaxRefineCount = this.baseSelection.jaftingMaxRefineCount > 0;
          if (primaryHasMaxRefineCount)
          {
            const primaryMaxRefineCount = this.baseSelection.jaftingMaxRefineCount
            const projectedCount = this.baseSelection.jaftingRefinedCount + equip.jaftingRefinedCount;
            const overRefinementCount = primaryMaxRefineCount < projectedCount;
            if (overRefinementCount)
            {
              enabled = false;
              iconIndex = 90;
              errorText += `${J.JAFTING.EXT.REFINE.Messages.ExceedRefineCount} ${projectedCount}/${primaryMaxRefineCount}.<br>\n`;
            }
          }

          // check the max traits of the base equip and compare with the projected result of this item.
          // if the count is greater than the max (if there is a max), then prevent this item from being used.
          const baseMaxTraitCount = this.baseSelection.jaftingMaxTraitCount;
          const projectedResult = JaftingManager.determineRefinementOutput(this.baseSelection, equip);
          const projectedResultTraitCount = JaftingManager.parseTraits(projectedResult).length;
          const overMaxTraitCount = baseMaxTraitCount > 0 && projectedResultTraitCount > baseMaxTraitCount;
          if (overMaxTraitCount)
          {
            enabled = false;
            iconIndex = 92
            errorText += `${J.JAFTING.EXT.REFINE.Messages.ExceedTraitCount} ${projectedResultTraitCount}/${baseMaxTraitCount}.<br>\n`;
          }
        }

        // if this is the primary equip window...
      }
      else
      {
        const equipIsMaxRefined = (equip.jaftingMaxRefineCount === 0)
          ? false // 0 max refinements means you can refine as much as you want.
          : equip.jaftingMaxRefineCount <= equip.jaftingRefinedCount;
        const equipHasMaxTraits = equip.jaftingMaxTraitCount === 0
          ? false // 0 max traits means you can have as many as you want.
          : equip.jaftingMaxTraitCount <= JaftingManager.parseTraits(equip).length;
        if (equipIsMaxRefined)
        {
          enabled = false;
          iconIndex = 92;
          errorText += `${J.JAFTING.EXT.REFINE.Messages.AlreadyMaxRefineCount}\n`;
        }

        if (equipHasMaxTraits)
        {
          enabled = false;
          iconIndex = 92;
          errorText += `${J.JAFTING.EXT.REFINE.Messages.AlreadyMaxTraitCount}\n`;
        }

        // prevent equipment explicitly marked as "not usable as base" from being used.
        if (equip.jaftingNotRefinementBase)
        {
          enabled = false;
          iconIndex = 92;
        }
      }

      // finally, if we are using this as the base, give it a check regardless.
      if (isBaseSelection)
      {
        iconIndex = 91;
      }

      const extData = {data: equip, error: errorText};

      const command = new WindowCommandBuilder(equip.name)
        .setSymbol('refine-object')
        .setEnabled(enabled)
        .setExtensionData(extData)
        .setIconIndex(iconIndex)
        .setRightText(`x${equipCount}`)
        .setHelpText(equip.description)
        .build();

      this.addBuiltCommand(command);

      // this.addCommand(equip.name, 'refine-object', enabled, extData, iconIndex);
    });
  }
}
//endregion Window_JaftingEquip

//region Window_JaftingRefinementConfirmation
/**
 * A window that gives the player a chance to confirm or cancel their
 * refinement before executing.
 */
class Window_RefinementConfirmation extends Window_Command
{
  /**
   * @constructor
   * @param {Rectangle} rect The rectangle that represents this window.
   */
  constructor(rect)
  {
    super(rect);
    this.initialize(rect);
  }

  /**
   * OVERWRITE Creates the command list for this window.
   */
  makeCommandList()
  {
    this.addCommand(`${J.JAFTING.EXT.REFINE.Messages.ExecuteRefinementCommandName}`, `ok`, true, null, 91);
    this.addCommand(`${J.JAFTING.EXT.REFINE.Messages.CancelRefinementCommandName}`, `cancel`, true, null, 90);
  }
}
//endregion Window_JaftingRefinementConfirmation

//region Window_RefinementDescription
class Window_RefinementDescription extends Window_Help
{
  constructor(rect)
  {
    super(rect);
  }
}
//endregion Window_RefinementDescription

//region Window_RefinementDetails
/**
 * The window containing the chosen equips for refinement and also the projected results.
 */
class Window_RefinementDetails extends Window_Base
{
  /**
   * @constructor
   * @param {Rectangle} rect The rectangle that represents this window.
   */
  constructor(rect)
  {
    super(rect);
    this.initialize(rect);
    this.initMembers();
    this.opacity = 220;
  }

  /**
   * Initializes all members of this window.
   */
  initMembers()
  {
    /**
     * The primary equip that is the refinement target.
     * Traits from the secondary equip will be transfered to this equip.
     * @type {RPG_EquipItem}
     */
    this._primaryEquip = null;

    /**
     * The secondary equip that is the refinement material.
     * The transferable traits on this equip will be transfered to the target.
     * @type {RPG_EquipItem}
     */
    this._secondaryEquip = null;

    /**
     * The output of what would be the result from refining these items.
     * @type {RPG_EquipItem}
     */
    this._resultingEquip = null;
  }

  /**
   * Gets the primary equip selected, aka the refinement target.
   * @returns {RPG_EquipItem}
   */
  get primaryEquip()
  {
    return this._primaryEquip;
  }

  /**
   * Sets the primary equip selected, aka the refinement target.
   * @param {RPG_EquipItem} equip The equip to set as the target.
   */
  set primaryEquip(equip)
  {
    this._primaryEquip = equip;
    this.refresh();
  }

  /**
   * Gets the secondary equip selected, aka the refinement material.
   * @returns {RPG_EquipItem}
   */
  get secondaryEquip()
  {
    return this._secondaryEquip;
  }

  /**
   * Sets the secondary equip selected, aka the refinement material.
   * @param {RPG_EquipItem} equip The equip to set as the material.
   */
  set secondaryEquip(equip)
  {
    this._secondaryEquip = equip;
    this.refresh();
  }

  /**
   * Gets the resulting equip from the output.
   */
  get outputEquip()
  {
    return this._resultingEquip;
  }

  /**
   * Sets the resulting equip to the output to allow for the scene to grab the data.
   * @param {RPG_EquipItem} equip The equip to set.
   */
  set outputEquip(equip)
  {
    this._resultingEquip = equip;
  }

  lineHeight()
  {
    return 32;
  }

  refresh()
  {
    // redraw all the contents.
    this.contents.clear();
    this.drawContent();
  }

  /**
   * Draws all content in this window.
   */
  drawContent()
  {
    // if we don't have anything in the target slot, do not draw anything.
    if (!this.primaryEquip) return;

    this.drawRefinementHeaders();

    this.drawRefinementTarget();
    this.drawRefinementMaterial();
    this.drawRefinementResult();
  }

  /**
   * Draws all columns' titles.
   */
  drawRefinementHeaders()
  {
    const columnWidth = 350;
    const ox = 0;

    this.modFontSize(6);
    this.toggleBold(true);

    const baseX = ox + (columnWidth * 0);
    this.drawText(J.JAFTING.EXT.REFINE.Messages.TitleBase, baseX, 0, 200);

    const consumableX = ox + (columnWidth * 1);
    this.drawText(J.JAFTING.EXT.REFINE.Messages.TitleMaterial, consumableX, 0, 200);

    const outputX = ox + (columnWidth * 2);
    this.drawText(J.JAFTING.EXT.REFINE.Messages.TitleOutput, outputX, 0, 200);

    this.resetFontSettings();
  }

  /**
   * Draws the primary equip that is being used as a base for refinement.
   * Will draw whatever is being hovered over if nothing is selected.
   */
  drawRefinementTarget()
  {
    this.drawEquip(this.primaryEquip, 0, "base");
  }

  /**
   * Draws the secondary equip that is being used as a material for refinement.
   * Will draw whatever is being hovered over if nothing is selected.
   */
  drawRefinementMaterial()
  {
    if (!this.secondaryEquip) return;

    this.drawEquip(this.secondaryEquip, 350, "material");
  }

  /**
   * Draws one column of a piece of equip and it's traits.
   * @param {RPG_EquipItem} equip The equip to draw details for.
   * @param {number} x The `x` coordinate to start drawing at.
   * @param {string} type Which column this is.
   */
  drawEquip(equip, x, type)
  {
    const parsedTraits = JaftingManager.parseTraits(equip);
    const jaftingTraits = JaftingManager.combineBaseParameterTraits(parsedTraits);
    this.drawEquipTitle(equip, x, type);
    this.drawEquipTraits(jaftingTraits, x);
  }

  /**
   * Draws the title for this portion of the equip details.
   * @param {RPG_EquipItem} equip The equip to draw details for.
   * @param {number} x The `x` coordinate to start drawing at.
   * @param {string} type Which column this is.
   */
  drawEquipTitle(equip, x, type)
  {
    const lh = this.lineHeight();

    if (type === "output")
    {
      if (equip.jaftingRefinedCount === 0)
      {
        this.drawTextEx(`\\I[${equip.iconIndex}] \\C[6]${equip.name} +1\\C[0]`, x, lh * 1, 200);
      }
      else
      {
        const suffix = `+${equip.jaftingRefinedCount + 1}`;
        const index = equip.name.lastIndexOf("+");
        if (index > -1)
        {
          // if we found a +, then strip it out and add the suffix to it.
          const name = `${equip.name.slice(0, index)}${suffix}`;
          this.drawTextEx(`\\I[${equip.iconIndex}] \\C[6]${name}\\C[0]`, x, lh * 1, 200);
        }
        else
        {
          // in cases where a refined equip is being used as a material for a never-before refined
          // equip, then there won't be any string manipulation for it's name.
          const name = `${equip.name} ${suffix}`;
          this.drawTextEx(`\\I[${equip.iconIndex}] \\C[6]${name}\\C[0]`, x, lh * 1, 200);
        }
      }
    }
    else
    {
      this.drawTextEx(`\\I[${equip.iconIndex}] \\C[6]${equip.name}\\C[0]`, x, lh * 1, 200);
    }
  }

  /**
   * Draws all transferable traits on this piece of equipment.
   * @param {JAFTING_Trait[]} traits A list of transferable traits.
   * @param {number} x The `x` coordinate to start drawing at.
   */
  drawEquipTraits(traits, x)
  {
    const lh = this.lineHeight();
    if (!traits.length)
    {
      this.drawTextEx(`${J.JAFTING.EXT.REFINE.Messages.NoTransferableTraits}`, x, lh * 2, 250);
      return;
    }

    traits.sort((a, b) => a._code - b._code);

    traits.forEach((trait, index) =>
    {
      const y = (lh * 2) + (index * lh);
      this.drawTextEx(`${trait.nameAndValue}`, x, y, 250);
    });
  }

  /**
   * Draws the projected refinement result of fusing the material into the base.
   */
  drawRefinementResult()
  {
    // don't try to draw the result if the player hasn't made it to the material yet.
    if (!this.primaryEquip || !this.secondaryEquip) return;

    // produce the potential result if confirmed.
    const result = JaftingManager.determineRefinementOutput(this.primaryEquip, this.secondaryEquip);

    // render the projected merge results.
    this.drawEquip(result, 700, "output");

    // assign it for ease of retrieving from the scene.
    this.outputEquip = result;
  }
}
//endregion Window_RefinementDetails