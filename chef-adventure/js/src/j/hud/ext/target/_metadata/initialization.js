/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

//region version checks
(() =>
{
  // Check to ensure we have the minimum required version of the J-Base plugin.
  const requiredBaseVersion = '2.1.2';
  const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
  if (!hasBaseRequirement)
  {
    throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
  }

  // Check to ensure we have the minimum required version of the J-HUD plugin.
  const requiredHudVersion = '2.0.0';
  const hasHudRequirement = J.BASE.Helpers.satisfies(J.HUD.Metadata.Version, requiredHudVersion);
  if (!hasHudRequirement)
  {
    throw new Error(`Either missing J-HUD or has a lower version than the required: ${requiredHudVersion}`);
  }
})();
//endregion version check

/**
 * The plugin umbrella that governs all things related to this extension plugin.
 */
J.HUD.EXT.TARGET = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.HUD.EXT.TARGET.Metadata = {};
J.HUD.EXT.TARGET.Metadata.Version = '1.0.0';
J.HUD.EXT.TARGET.Metadata.Name = `J-HUD-TargetFrame`;

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.HUD.EXT.TARGET.PluginParameters = PluginManager.parameters(J.HUD.EXT.TARGET.Metadata.Name);

/**
 * Extend this plugin's metadata with additional configurable data points.
 */
J.HUD.EXT.TARGET.Metadata =
  {
    // the previously defined metadata.
    ...J.HUD.EXT.TARGET.Metadata,

    // our configurable data points.
    TargetFrameX: Number(J.HUD.EXT.TARGET.PluginParameters['targetFrameX']),
    TargetFrameY: Number(J.HUD.EXT.TARGET.PluginParameters['targetFrameY']),
    TargetFrameWidth: Number(J.HUD.EXT.TARGET.PluginParameters['targetFrameWidth']),
    TargetFrameHeight: Number(J.HUD.EXT.TARGET.PluginParameters['targetFrameHeight']),
    BackgroundGaugeImageX: Number(J.HUD.EXT.TARGET.PluginParameters['backgroundGaugeImageX']),
    BackgroundGaugeImageY: Number(J.HUD.EXT.TARGET.PluginParameters['backgroundGaugeImageY']),
    MiddlegroundGaugeImageX: Number(J.HUD.EXT.TARGET.PluginParameters['middlegroundGaugeImageX']),
    MiddlegroundGaugeImageY: Number(J.HUD.EXT.TARGET.PluginParameters['middlegroundGaugeImageY']),
    ForegroundGaugeImageX: Number(J.HUD.EXT.TARGET.PluginParameters['foregroundGaugeImageX']),
    ForegroundGaugeImageY: Number(J.HUD.EXT.TARGET.PluginParameters['foregroundGaugeImageY']),
    BackgroundFilename: J.HUD.EXT.TARGET.PluginParameters['backgroundImageFilename'],
    ForegroundFilename: J.HUD.EXT.TARGET.PluginParameters['foregroundImageFilename'],
    EnableHP: J.HUD.EXT.TARGET.PluginParameters['enableHp'] === "true",
    EnableMP: J.HUD.EXT.TARGET.PluginParameters['enableMp'] === "true",
    EnableTP: J.HUD.EXT.TARGET.PluginParameters['enableTp'] === "true",
    HpGaugeScaleX: Number(J.HUD.EXT.TARGET.PluginParameters['hpGaugeScaleX']),
    HpGaugeScaleY: Number(J.HUD.EXT.TARGET.PluginParameters['hpGaugeScaleY']),
    HpGaugeRotation: Number(J.HUD.EXT.TARGET.PluginParameters['hpGaugeRotation']),
    MpGaugeScaleX: Number(J.HUD.EXT.TARGET.PluginParameters['mpGaugeScaleX']),
    MpGaugeScaleY: Number(J.HUD.EXT.TARGET.PluginParameters['mpGaugeScaleY']),
    MpGaugeRotation: Number(J.HUD.EXT.TARGET.PluginParameters['mpGaugeRotation']),
    TpGaugeScaleX: Number(J.HUD.EXT.TARGET.PluginParameters['tpGaugeScaleX']),
    TpGaugeScaleY: Number(J.HUD.EXT.TARGET.PluginParameters['tpGaugeScaleY']),
    TpGaugeRotation: Number(J.HUD.EXT.TARGET.PluginParameters['tpGaugeRotation']),
  };

/**
 * A collection of all aliased methods for this plugin.
 */
J.HUD.EXT.TARGET.Aliased = {
  Game_System: new Map(),
  Hud_Manager: new Map(),
  JABS_Battler: new Map(),
  Scene_Map: new Map(),
};

/**
 * All regular expressions used by this plugin.
 */
J.HUD.EXT.TARGET.RegExp = {
  TargetFrameText: /<targetFrameText:([\w :"'.!+\-*/\\]*)>/i,
  TargetFrameIcon: /<targetFrameIcon:(\d+)>/i,
  HideTargetFrame: /<hideTargetFrame>/i,
  HideTargetText: /<hideTargetFrameText>/i,
  HideTargetHP: /<hideTargetHpBar>/i,
  HideTargetMP: /<hideTargetMpBar>/i,
  HideTargetTP: /<hideTargetTpBar>/i,
};
//endregion introduction