/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

//region version checks
(() =>
{
  // Check to ensure we have the minimum required version of the J-Base plugin.
  const requiredBaseVersion = '2.1.3';
  const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
  if (!hasBaseRequirement)
  {
    throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
  }

  // Check to ensure we have the minimum required version of the J-ABS plugin.
  const requiredJabsVersion = '3.2.2';
  const hasJabsRequirement = J.BASE.Helpers.satisfies(J.ABS.Metadata.Version, requiredJabsVersion);
  if (!hasJabsRequirement)
  {
    throw new Error(`Either missing J-ABS or has a lower version than the required: ${requiredJabsVersion}`);
  }
})();
//endregion version check

//region plugin setup and configuration
/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.ABS.EXT.ALLYAI = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.ABS.EXT.ALLYAI.Metadata = {};
J.ABS.EXT.ALLYAI.Metadata.Name = `J-ABS-AllyAI`;
J.ABS.EXT.ALLYAI.Metadata.Version = '1.1.1';

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.ABS.EXT.ALLYAI.PluginParameters = PluginManager.parameters(J.ABS.EXT.ALLYAI.Metadata.Name);

// configuration for the main JABS quick menu command for ally AI.
J.ABS.EXT.ALLYAI.Metadata.AllyAiCommandName = J.ABS.EXT.ALLYAI.PluginParameters['jabsMenuAllyAiCommandName'];
J.ABS.EXT.ALLYAI.Metadata.AllyAiCommandIconIndex = Number(J.ABS.EXT.ALLYAI.PluginParameters['jabsMenuAllyAiCommandIconIndex']);
J.ABS.EXT.ALLYAI.Metadata.AllyAiCommandSwitchId = Number(J.ABS.EXT.ALLYAI.PluginParameters['jabsMenuAllyAiCommandSwitchId']);

// configuration for party-wide commands.
J.ABS.EXT.ALLYAI.Metadata.PartyAiPassiveText = J.ABS.EXT.ALLYAI.PluginParameters['partyWidePassiveText'];
J.ABS.EXT.ALLYAI.Metadata.PartyAiPassiveIconIndex = Number(J.ABS.EXT.ALLYAI.PluginParameters['partyWidePassiveIconIndex']);
J.ABS.EXT.ALLYAI.Metadata.PartyAiAggressiveText = J.ABS.EXT.ALLYAI.PluginParameters['partyWideAggressiveText'];
J.ABS.EXT.ALLYAI.Metadata.PartyAiAggressiveIconIndex = Number(J.ABS.EXT.ALLYAI.PluginParameters['partyWideAggressiveIconIndex']);

// configuration for the various ai modes.
J.ABS.EXT.ALLYAI.Metadata.AiModeEquippedIconIndex = Number(J.ABS.EXT.ALLYAI.PluginParameters['aiModeEquipped']);
J.ABS.EXT.ALLYAI.Metadata.AiModeNotEquippedIconIndex = Number(J.ABS.EXT.ALLYAI.PluginParameters['aiModeNotEquipped']);
J.ABS.EXT.ALLYAI.Metadata.AiModeDoNothingText = J.ABS.EXT.ALLYAI.PluginParameters['aiModeDoNothing'];
J.ABS.EXT.ALLYAI.Metadata.AiModeOnlyAttackText = J.ABS.EXT.ALLYAI.PluginParameters['aiModeOnlyAttack'];
J.ABS.EXT.ALLYAI.Metadata.AiModeVarietyText = J.ABS.EXT.ALLYAI.PluginParameters['aiModeVariety'];
J.ABS.EXT.ALLYAI.Metadata.AiModeFullForceText = J.ABS.EXT.ALLYAI.PluginParameters['aiModeFullForce'];
J.ABS.EXT.ALLYAI.Metadata.AiModeSupportText = J.ABS.EXT.ALLYAI.PluginParameters['aiModeSupport'];

/**
 * A collection of all aliased methods for this plugin.
 */
J.ABS.EXT.ALLYAI.Aliased = {
  Game_Actor: new Map(),
  Game_BattleMap: new Map(),
  Game_Battler: {},
  Game_Follower: new Map(),
  Game_Followers: new Map(),
  Game_Interpreter: {},
  Game_Map: new Map(),
  Game_Party: new Map(),
  Game_Player: {},

  JABS_AiManager: new Map(),
  JABS_Battler: new Map(),

  Scene_Map: {},

  Window_AbsMenu: new Map(),
  Window_AbsMenuSelect: new Map(),
};

/**
 * All regular expressions used by this plugin.
 */
J.ABS.EXT.ALLYAI.RegExp = {};
J.ABS.EXT.ALLYAI.RegExp.DefaultAi = /<defaultAi:(do-nothing|basic-attack|variety|full-force|support)>/i;
//endregion plugin setup and configuration
//endregion Introduction