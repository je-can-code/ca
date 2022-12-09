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

  // Check to ensure we have the minimum required version of the J-ABS plugin.
  const requiredJabsVersion = '3.0.0';
  const hasJabsRequirement = J.BASE.Helpers.satisfies(J.ABS.Metadata.Version, requiredJabsVersion);
  if (!hasJabsRequirement)
  {
    throw new Error(`Either missing J-ABS or has a lower version than the required: ${requiredJabsVersion}`);
  }
})();
//#endregion version check

//#region plugin setup and configuration
/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.ALLYAI = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.ALLYAI.Metadata = {};
J.ALLYAI.Metadata.Name = `J-ABS-AllyAI`;
J.ALLYAI.Metadata.Version = '1.0.0';

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.ALLYAI.PluginParameters = PluginManager.parameters(J.ALLYAI.Metadata.Name);

// configuration for the main JABS quick menu command for ally AI.
J.ALLYAI.Metadata.AllyAiCommandName = J.ALLYAI.PluginParameters['jabsMenuAllyAiCommandName'];
J.ALLYAI.Metadata.AllyAiCommandIconIndex = Number(J.ALLYAI.PluginParameters['jabsMenuAllyAiCommandIconIndex']);
J.ALLYAI.Metadata.AllyAiCommandSwitchId = Number(J.ALLYAI.PluginParameters['jabsMenuAllyAiCommandSwitchId']);

// configuration for party-wide commands.
J.ALLYAI.Metadata.PartyAiPassiveText = J.ALLYAI.PluginParameters['partyWidePassiveText'];
J.ALLYAI.Metadata.PartyAiPassiveIconIndex = Number(J.ALLYAI.PluginParameters['partyWidePassiveIconIndex']);
J.ALLYAI.Metadata.PartyAiAggressiveText = J.ALLYAI.PluginParameters['partyWideAggressiveText'];
J.ALLYAI.Metadata.PartyAiAggressiveIconIndex = Number(J.ALLYAI.PluginParameters['partyWideAggressiveIconIndex']);

// configuration for the various ai modes.
J.ALLYAI.Metadata.AiModeEquippedIconIndex = Number(J.ALLYAI.PluginParameters['aiModeEquipped']);
J.ALLYAI.Metadata.AiModeNotEquippedIconIndex = Number(J.ALLYAI.PluginParameters['aiModeNotEquipped']);
J.ALLYAI.Metadata.AiModeDoNothingText = J.ALLYAI.PluginParameters['aiModeDoNothing'];
J.ALLYAI.Metadata.AiModeOnlyAttackText = J.ALLYAI.PluginParameters['aiModeOnlyAttack'];
J.ALLYAI.Metadata.AiModeVarietyText = J.ALLYAI.PluginParameters['aiModeVariety'];
J.ALLYAI.Metadata.AiModeFullForceText = J.ALLYAI.PluginParameters['aiModeFullForce'];
J.ALLYAI.Metadata.AiModeSupportText = J.ALLYAI.PluginParameters['aiModeSupport'];

/**
 * A collection of all aliased methods for this plugin.
 */
J.ALLYAI.Aliased = {
  Game_Actor: {},
  Game_BattleMap: new Map(),
  Game_Battler: {},
  Game_Follower: new Map(),
  Game_Followers: new Map(),
  Game_Interpreter: {},
  Game_Map: new Map(),
  Game_Party: new Map(),
  Game_Player: {},
  Game_Switches: {},
  JABS_AiManager: new Map(),
  JABS_Battler: {},
  Scene_Map: {},
  Window_AbsMenu: new Map(),
  Window_AbsMenuSelect: {},
};
//#endregion plugin setup and configuration
//#endregion Introduction