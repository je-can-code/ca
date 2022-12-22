//region Metadata
/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

//region version checks
(() =>
{
  // Check to ensure we have the minimum required version of the J-Base plugin.
  const requiredBaseVersion = '2.1.0';
  const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
  if (!hasBaseRequirement)
  {
    throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
  }
})();
//endregion version check

/**
 * The over-arching extensions collection for this plugin.
 */
J.OMNI.EXT ||= {};

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.OMNI.EXT.MONSTER = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.OMNI.EXT.MONSTER.Metadata = {};

/**
 * The name of this plugin.
 */
J.OMNI.EXT.MONSTER.Metadata.Name = 'J-Omni-Monsterpedia';

/**
 * The version of this plugin.
 */
J.OMNI.EXT.MONSTER.Metadata.Version = '1.0.1';

/**
 * The plugin parameters for this plugin.
 */
J.OMNI.EXT.MONSTER.PluginParameters = PluginManager.parameters(J.OMNI.EXT.MONSTER.Metadata.Name);

/**
 * The various data points that define the command for the Omnipedia.
 */
J.OMNI.EXT.MONSTER.Metadata.Command = {};
J.OMNI.EXT.MONSTER.Metadata.Command.Name = "Monsterpedia";
J.OMNI.EXT.MONSTER.Metadata.Command.Symbol = "monster-pedia";
J.OMNI.EXT.MONSTER.Metadata.Command.IconIndex = 14;

/**
 * A collection of all aliased methods for this plugin.
 */
J.OMNI.EXT.MONSTER.Aliased = {};
J.OMNI.EXT.MONSTER.Aliased.Game_Enemy = new Map();
J.OMNI.EXT.MONSTER.Aliased.Game_Party = new Map();
J.OMNI.EXT.MONSTER.Aliased.Game_System = new Map();
J.OMNI.EXT.MONSTER.Aliased.JABS_Battler = new Map();
J.OMNI.EXT.MONSTER.Aliased.JABS_Engine = new Map();
J.OMNI.EXT.MONSTER.Aliased.Scene_Omnipedia = new Map();
J.OMNI.EXT.MONSTER.Aliased.Window_OmnipediaList = new Map();

/**
 * All regular expressions used by this plugin.
 */
J.OMNI.EXT.MONSTER.RegExp = {};
J.OMNI.EXT.MONSTER.RegExp.HideFromMonsterpedia = /<hideFromMonsterpedia>/i;
J.OMNI.EXT.MONSTER.RegExp.MonsterpediaFamilyIcon = /<monsterFamilyIcon:[ ]?(\d+)>/i;
J.OMNI.EXT.MONSTER.RegExp.MonsterpediaDescription = /<descriptionLine:[ ]?([\w\s.?!,\-'"]+)>/i;
J.OMNI.EXT.MONSTER.RegExp.MonsterpediaRegion = /<region:[ ]?([\w\s.?!,'"]+)>/i;
//endregion Metadata