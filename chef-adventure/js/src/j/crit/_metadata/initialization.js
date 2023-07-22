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
 * The plugin umbrella that governs all things related to this plugin.
 */
J.CRIT = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.CRIT.Metadata =
  {
    /**
     * The name of this plugin.
     */
    Name: `J-CriticalFactors`,

    /**
     * The version of this plugin.
     */
    Version: '1.0.0',
  };

/**
 * A collection of all aliased methods for this plugin.
 */
J.CRIT.Aliased =
  {
    Game_Action: new Map(),
    Game_Actor: new Map(),
    Game_Battler: new Map(),
    Game_BattlerBase: new Map(),
    Game_Enemy: new Map(),
    IconManager: new Map(),
    TextManager: new Map(),
    Window_SDP_Details: new Map(),
  };

/**
 * All regular expressions used by this plugin.
 */
J.CRIT.RegExp = {
  // base functionality.
  CritDamageReductionBase: /<critReductionBase:[ ]?(\d+)>/gi,
  CritDamageReduction: /<critReduction:[ ]?(\d+)>/gi,
  CritDamageMultiplierBase: /<critMultiplierBase:[ ]?(\d+)>/gi,
  CritDamageMultiplier: /<critMultiplier:[ ]?(\d+)>/gi,

  // for natural growths compatability.
  CritDamageReductionBuffPlus: /<cdrBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
  CritDamageReductionBuffRate: /<cdrBuffRate:\[([+\-*/ ().\w]+)]>/gi,
  CritDamageReductionGrowthPlus: /<cdrGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
  CritDamageReductionGrowthRate: /<cdrGrowthRate:\[([+\-*/ ().\w]+)]>/gi,

  // for natural growths compatability.
  CritDamageMultiplierBuffPlus: /<cdmBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
  CritDamageMultiplierBuffRate: /<cdmBuffRate:\[([+\-*/ ().\w]+)]>/gi,
  CritDamageMultiplierGrowthPlus: /<cdmGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
  CritDamageMultiplierGrowthRate: /<cdmGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
};
//endregion Introduction