//region Introduction
/*:
 * @target MZ
 * @plugindesc [v3.0.0 NATURAL] Enables level-based growth of all parameters.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @orderAfter J-Base
 * @orderAfter J-Base-Save
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin enables "Natural Growth", aka formulaic parameter growth, for
 * battlers. This "Natural Growth" enables temporary/permanent stat growth while
 * various tags are applied.
 *
 * Integrates with others of mine plugins:
 * - J-CriticalFactors; enables natural growths of CDM/CTR.
 * - J-Passives; updates with relic gain as well.
 * - J-LevelMaster; enables the ".lvl" access for formulas.
 * - J-SDP; adds SDP to the options for reward-based formulas.
 *
 * Any plugin that registers a parameter can bind natural growth to it, and
 * several of mine do- see the glossary at the bottom for every parameter and
 * the plugin it comes from. Plugin order does not matter for any of them.
 *
 * ----------------------------------------------------------------------------
 * DETAILS:
 * The "Natural Growths" are separated into two categories:
 * - "Buffs":   has effect while applied.
 * - "Growths": effect is applied permanently for every level gained.
 *
 * Additionally, each "Natural Growth" can be applied in two ways:
 * - "Plus": a flat bonus to the base parameter.
 * - "Rate": a multiplicative bonus to the (base parameter + "plus" bonus).
 *
 * ----------------------------------------------------------------------------
 * UNITS:
 * Every tag is written in the numbers the status screen shows, and never in
 * the fractions RMMZ keeps behind the scenes. A 75% chance is written as 75,
 * not 0.75, whichever parameter it is for.
 * - <lstGrowthPlus:[1.5]> is +1.5% lifesteal for every level gained.
 * - <criBuffPlus:[10]> is +10% critical hit rate while applied.
 * - <atkBuffPlus:[10]> is +10 attack, since attack is already a whole number.
 * - <harBuffRate:[10]> is 10% more of whatever healing rate the battler has.
 *
 * Parameters that are costs, such as life cost (hcr) or mp cost (mcr), move
 * the cost exactly as it is shown, so a negative number is what makes things
 * cheaper: <hcrGrowthPlus:[-2]> lowers life cost by 2% per level.
 * ============================================================================
 * NATURAL GROWTH:
 * Have you ever wanted an actor to gain a particular stat, but couldn't quite
 * make it as customizable as you wanted it to be? Well now you can! By adding
 * the correct tags to your notes across the various entries in the database,
 * you too can make your actors gain more specific stats!
 *
 * DETAILS:
 * By constructing tags using the format described below, you are given access
 * to a "Formula" box that behaves similar to a "Formula" box that defines the
 * damage of a skill. None of the tags are case sensitive, but the order is
 * specific. If you find yourself having trouble building the tags, you can
 * peek at the source code of this file and search for "J.NATURAL.RegExp =" to
 * find the master list for the engine's own parameters; every other plugin
 * keeps its parameters' tags in its own list. Do note that the hard brackets
 * of [] are required to wrap the formula in the note tag.
 *
 * THE PERMANENCE OF BUFF:
 * The "Buffs" effect, as indicated above, is applied temporarily at whatever
 * the formula would calculate out to when the parameter is requested. This
 * allows the application of these "buffs" to live on dynamic objects, such as
 * equipment or states, giving greater control over what stats are gained and
 * how much. However, it is important to note that if you put a "buff" tag on
 * a non-temporary object, such as the actor itself, it would be functionally
 * a permanent "buff".
 *
 * THE PERMANENCE OF GROWTH:
 * The "Growths" effect, as indicated above, is applied permanently for every
 * level gained. However, it is important to note that due to the nature of the
 * growth being permanent, it WILL NOT be lost if the level is reduced in some
 * way, and WILL be gained AGAIN if the level increases once more.
 *
 * NOTE1:
 * The "stats" word choice was deliberate vague because this can apply to any
 * of the 8 base parameters, 10 sp-parameters, or 10 ex-parameters, max tp,
 * healing rate, or any parameter another plugin has bound to natural growth.
 *
 * TIP:
 * Within the FORMULA of the tag, the variable "a" is can be used to access
 * the actor for more complex calculations. The variable "b" is the parameter's
 * own base before any natural bonus, in the same status-screen numbers the tag
 * is written in, so <atkBuffPlus:[b * 0.1]> is a tenth of the base attack.
 * Note that "a" gives the engine's values as they are stored, so a.hit is
 * 0.95 and not 95- multiply by 100 when a formula needs the percent.
 *
 * TAG USAGE:
 * - Actors
 * - Classes
 * - Skills
 * - Weapons
 * - Armors
 * - Enemies
 * - States
 *
 * TAG FORMAT:
 *  <(PARAM)(BUFF|GROWTH)(PLUS|RATE):[FORMULA]>
 * Where (PARAM) is the (base/sp/ex) parameter shorthand.
 * Where (BUFF|GROWTH) is literally one of either "Buff" or "Growth".
 * Where (PLUS|RATE) is literally one of either "Plus" or "Rate".
 * Where [FORMULA] is the formula to produce the amount.
 *
 * EXAMPLE:
 *  <hrgGrowthRate:[5]>
 * Gain +5% hp regen (hrg) per level.
 * This would result in gaining an ever-increasing amount of hp regen per level.
 *
 *  <exrBuffPlus:[25]>
 * Gain a flat 25 exp rate (exr) while this tag is applied to this battler.
 * This would be lost if the object this tag lived on was removed.
 *
 *  <atkGrowthPlus:[a.level * 3]>
 * Gain (the battler's level multiplied by 3) attack (atk) per level.
 * This would result in gaining an ever-increasing amount of attack per level.
 * ----------------------------------------------------------------------------
 * NATURAL GROWTHS AND REWARDS:
 * While the above parameters and such are shared between actors and enemies
 * alike, and thus a common pattern was useful, there are a couple of
 * "parameters" that are unique to enemies: rewards. Specifically, experience,
 * gold, and SDPs. Since they aren't directly useful in combat, their tags are
 * a bit different.
 *
 * NOTE:
 * The base value that is in the database will be added to the calculated
 * value for exp/gold/sdp, thus the static value in the database can be
 * thought of as a "base" value.
 *
 * TAG USAGE:
 * - Enemies
 * - States
 *
 * TAG FORMAT:
 *  <(REWARD)(PLUS):[FORMULA]>
 * Where (REWARD) is one of exp, gold, or sdp.
 * Where (PLUS) is... plus. There is no "rate" for this value.
 * Where [FORMULA] is the formula to produce the amount.
 *
 * EXAMPLE:
 *  <expPlus:[5 + a.lvl * 50]>
 * When defeating this enemy, the experience gained will be increased by the
 * enemy's level multiplied by 50, plus an extra 5.
 *
 *  <goldPlus:[100 + a.luk + a.level ** 2]>
 * When defeating this enemy, the gold gained will be increased by 100 plus the
 * enemy's luck value plus the enemy's level squared (to the second power).
 *
 *  <sdpPlus:[100 * a.atk]>
 * When defeating this enemy, the SDPs gained will be increased by 100 plus the
 * enemy's attack value.
 *
 * ==============================================================================
 * EXAMPLE IDEAS:
 * While you can read about the syntax in the next section below, here I wanted
 * to present you a few ideas of things you can do with this plugin, to better
 * illustrate what exactly this plugin can do.
 *
 * TAG:
 *  <mtpBuffPlus:[80]>
 * LOCATION:
 *  An actor.
 * EFFECT:
 *  The actor now has a permanent bonus of 80 to their max tp.
 *
 * TAG:
 *  <grdGrowthRate:[5]>
 * LOCATION:
 *  A class.
 * EFFECT:
 *  For every level gained by an actor using this class, they will gain a
 *  permanent 5% "rate" bonus to their GRD, meaning it is a multiplied percent
 *  bonus against their base and plus values combined. Note that this is
 *  stored on the actor and will persist even after the class is changed.
 *
 * TAG:
 *  <hrgBuffPlus:[(a.level**1.3)+(a.level*5)]>
 * LOCATION:
 *  An armor.
 * EFFECT:
 *  The actor will have a bonus of (5x their level) and (their level to the
 *  1.3rd power) added together worth of HRG.
 *
 * TAG:
 *  <atkGrowthPlus:[a.level]>
 * LOCATION:
 *  A state.
 * EFFECT:
 *  For every level gained by an actor afflicted with this state, they will
 *  gain their level's worth of attack permanently.
 *
 * TAG:
 *  <harBuffPlus:[20]>
 * LOCATION:
 *  A state.
 * EFFECT:
 *  While afflicted, the actor's outgoing healing is 20% stronger on top of
 *  their base HAR. Lost as soon as the state wears off.
 *
 * TAG:
 *  <lstGrowthPlus:[1.5]>
 * LOCATION:
 *  A class.
 * EFFECT:
 *  For every level gained by an actor using this class, they permanently
 *  gain 1.5% lifesteal. Requires J-Resources-ABS, which owns lifesteal.
 *
 * ==============================================================================
 * GLOSSARY:
 * There are a lot of shorthands available for use with this plugin to build your
 * various buff and growth tags. Here is a comprehensive list of the shorthands
 * along with a translation to the actual parameter of all supported shorthands.
 *
 * NOTE:
 * Custom parameters require their respective plugins to be installed. Where
 * each plugin sits in the plugin list does not matter.
 *
 * Base Parameters:
 * - mhp (max hp)
 * - mmp (max mp)
 * - atk (attack)
 * - def (defense)
 * - mat (magic attack)
 * - mdf (magic defense)
 * - agi (agility)
 * - luk (luck)
 *
 * Ex Parameters:
 * - hit (hit rate)
 * - eva (evasion rate)
 * - cri (critical hit rate)
 * - cev (critical evasion rate)
 * - mev (magic evasion rate)
 * - mrf (magic reflect rate)
 * - cnt (counter attack rate)
 * - hrg (hp regen rate)
 * - mrg (mp regen rate)
 * - trg (tp regen rate)
 *
 * Sp Parameters:
 * - tgr (targeting rate)
 * - grd (guarding rate)
 * - rec (recovery rate)
 * - pha (pharmacy rate)
 * - mcr (mp cost reduction rate)
 * - tcr (tp cost reduction rate)
 * - pdr (physical damage reduction rate)
 * - mdr (magical damage reduction rate)
 * - fdr (floor damage reduction rate)
 * - exr (experience gained rate)
 *
 * Custom Parameters:
 * - mtp (max tp)
 * - har (healing rate, requires J-Base 3.2.0+)
 * - cdm (critical damage multiplier, requires J-CriticalFactors)
 * - ctr (critical damage reduction, requires J-CriticalFactors)
 * - dor (drop rate, requires J-DropsControl)
 * - gdr (gold rate, requires J-DropsControl)
 * - hcr (life cost, requires J-Resources; negative is cheaper)
 * - lst (lifesteal, requires J-Resources-ABS)
 * - mst (manasteal, requires J-Resources-ABS)
 * - tst (techsteal, requires J-Resources-ABS)
 * - sar (shield amplification, requires J-ABS-Shield)
 * - ser (shield effectiveness, requires J-ABS-Shield)
 * - msb (move speed boost, requires J-ABS-Speed)
 * - apr (aptitude rate, requires J-Aptitude)
 * - prof (proficiency bonus, requires J-Proficiency)
 * - sdr (SDP rate, requires J-SDP)
 *
 * Rewards (plus only, no rate):
 * - exp
 * - gold
 * - sdp
 *
 * ============================================================================
 * CHANGELOG:
 * - 3.0.0
 *    Any plugin can now bind natural growth to its own parameters, and plugin
 *    order no longer matters. Every tag is written in the numbers the status
 *    screen shows. Growth accumulated in older saves does not carry over.
 *    Fixed ex- and sp-parameter growth delivering a hundredth of its value, and
 *    healing rate buffs landing as raw amounts rather than percents.
 *    Removed the per-parameter growth accessors and applyNaturalCustomGrowths;
 *    plugins bind their parameters through J-Base's registry instead.
 * - 2.4.1
 *    Routed the unrecognized-subclass warning through J-Base's new Diagnostics,
 *    so it names J-NaturalGrowth in the console.
 * - 2.4.0
 *    Routed the _natural namespace into its own save section, so accumulated
 *    growth lands in systems/natural.json rather than in the system blob.
 * - 2.3.0
 *    BREAKING (tag semantics): ex- and sp-parameter growth tags now take whole
 *    percents, matching the buff tags beside them. The growth path stored its
 *    flat bonus raw while the buff path divided by 100, so the same value in
 *    the two families differed by a factor of one hundred on any parameter the
 *    engine keeps as a 0-1 fraction: <hitBuffPlus:[5]> meant five percent hit
 *    while <hitGrowthPlus:[5]> meant five hundred, applied per level. Base
 *    parameters and max TP are untouched, since those are whole numbers where
 *    a tag of ten has always meant ten points.
 * - 2.2.0
 *    Added HAR (Healing Rate) growth and buff support — not a native param
 *    array member, so it gets its own dedicated tag set like max tp:
 *    <harGrowthPlus:[FORMULA]>, <harGrowthRate:[FORMULA]>,
 *    <harBuffPlus:[FORMULA]>, <harBuffRate:[FORMULA]>. Growth applies via
 *    the existing applyNaturalCustomGrowths hook (actors only); buffs apply
 *    to both actors and enemies. Requires J-Base 3.2.0+.
 * - 2.1.2
 *    Fixed issue with broken regex structures for max TP.
 *    Consumed `RPGManager` updates.
 * - 2.1.1
 *    Relocates basic max TP management to the J.BASE plugin.
 *    Adds ability to also add a bonus to SDP dropped.
 * - 2.1.0
 *    Added formula evaluation for enemy rewards on enemies.
 * - 2.0.1
 *    Fixed issue with buffs not being refreshed in Scene_Equip.
 * - 2.0.0
 *    Buff tracking has been refactored to be more compatible with J-Passives.
 *    Fixed issues with buffs/growths not being tracked correctly.
 * - 1.0.0
 *    Initial release.
 * ============================================================================
 * @param actorBaseTp
 * @type number
 * @min 0
 * @text Actor Base TP Max
 * @desc The base TP for actors is this amount. Any formulai add onto this.
 * @default 0
 *
 * @param enemyBaseTp
 * @type number
 * @min 0
 * @text Enemy Base TP Max
 * @desc The base TP for enemies is this amount. Any formulai add onto this.
 * @default 100
 */
//endregion Introduction

//#region src/plugins/natural/core/_metadata/_pluginMetadata.js
var J_NaturalGrowthPluginMetadata = class extends PluginMetadata {
	/**
	* Constructor.
	*/
	constructor(name, version) {
		super(name, version);
	}
	/**
	* Extends {@link #postInitialize}.<br/>
	* Maps plugin parameters into instance fields used by battler TP logic.
	*/
	postInitialize() {
		super.postInitialize();
		this.initializeNaturalGrowth();
	}
	/**
	* Initializes the metadata associated with this plugin from plugin parameters.
	*/
	initializeNaturalGrowth() {
		/**
		* The default base max TP for actors when notetag does not override.
		* @type {number}
		*/
		this.BaseTpMaxActors = Number(this.parsedPluginParameters["actorBaseTp"]);
		/**
		* The default base max TP for enemies when notetag does not override.
		* @type {number}
		*/
		this.BaseTpMaxEnemies = Number(this.parsedPluginParameters["enemyBaseTp"]);
	}
};

//#endregion
//#region src/plugins/natural/core/_metadata/initialization.js
/**
* The core where all of my extensions live: in the `J` object.
*/
globalThis.J ||= {};
/**
* The plugin umbrella that governs all things related to this plugin.
*/
J.NATURAL = {};
/**
* The `metadata` associated with this plugin, such as version.
*/
J.NATURAL.Metadata = new J_NaturalGrowthPluginMetadata("J-NaturalGrowth", "3.0.0");
/**
* A collection of all aliased methods for this plugin.
*/
J.NATURAL.Aliased = {
	Game_Actor: new Map(),
	Game_Battler: new Map(),
	Game_Enemy: new Map(),
	Game_Party: new Map(),
	Scene_Boot: new Map(),
	Scene_Equip: new Map(),
	Window_EquipItem: new Map()
};
/**
* All regular expressions used by this plugin.
*/
J.NATURAL.RegExp = {
	MaxLifeBuffPlus: /<mhpBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
	MaxMagiBuffPlus: /<mmpBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
	PowerBuffPlus: /<atkBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
	DefenseBuffPlus: /<defBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
	ForceBuffPlus: /<matBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
	ResistBuffPlus: /<mdfBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
	SpeedBuffPlus: /<agiBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
	LuckBuffPlus: /<lukBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
	MaxLifeBuffRate: /<mhpBuffRate:\[([+\-*/ ().\w]+)]>/gi,
	MaxMagiBuffRate: /<mmpBuffRate:\[([+\-*/ ().\w]+)]>/gi,
	PowerBuffRate: /<atkBuffRate:\[([+\-*/ ().\w]+)]>/gi,
	DefenseBuffRate: /<defBuffRate:\[([+\-*/ ().\w]+)]>/gi,
	ForceBuffRate: /<matBuffRate:\[([+\-*/ ().\w]+)]>/gi,
	ResistBuffRate: /<mdfBuffRate:\[([+\-*/ ().\w]+)]>/gi,
	SpeedBuffRate: /<agiBuffRate:\[([+\-*/ ().\w]+)]>/gi,
	LuckBuffRate: /<lukBuffRate:\[([+\-*/ ().\w]+)]>/gi,
	MaxLifeGrowthPlus: /<mhpGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
	MaxMagiGrowthPlus: /<mmpGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
	PowerGrowthPlus: /<atkGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
	DefenseGrowthPlus: /<defGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
	ForceGrowthPlus: /<matGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
	ResistGrowthPlus: /<mdfGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
	SpeedGrowthPlus: /<agiGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
	LuckGrowthPlus: /<lukGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
	MaxLifeGrowthRate: /<mhpGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
	MaxMagiGrowthRate: /<mmpGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
	PowerGrowthRate: /<atkGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
	DefenseGrowthRate: /<defGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
	ForceGrowthRate: /<matGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
	ResistGrowthRate: /<mdfGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
	SpeedGrowthRate: /<agiGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
	LuckGrowthRate: /<lukGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
	HitBuffPlus: /<hitBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
	EvadeBuffPlus: /<evaBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
	CritChanceBuffPlus: /<criBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
	CritEvadeBuffPlus: /<cevBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
	MagiEvadeBuffPlus: /<mevBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
	MagiReflectBuffPlus: /<mrfBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
	CounterBuffPlus: /<cntBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
	LifeRegenBuffPlus: /<hrgBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
	MagiRegenBuffPlus: /<mrgBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
	TechRegenBuffPlus: /<trgBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
	HitBuffRate: /<hitBuffRate:\[([+\-*/ ().\w]+)]>/gi,
	EvadeBuffRate: /<evaBuffRate:\[([+\-*/ ().\w]+)]>/gi,
	CritChanceBuffRate: /<criBuffRate:\[([+\-*/ ().\w]+)]>/gi,
	CritEvadeBuffRate: /<cevBuffRate:\[([+\-*/ ().\w]+)]>/gi,
	MagiEvadeBuffRate: /<mevBuffRate:\[([+\-*/ ().\w]+)]>/gi,
	MagiReflectBuffRate: /<mrfBuffRate:\[([+\-*/ ().\w]+)]>/gi,
	CounterBuffRate: /<cntBuffRate:\[([+\-*/ ().\w]+)]>/gi,
	LifeRegenBuffRate: /<hrgBuffRate:\[([+\-*/ ().\w]+)]>/gi,
	MagiRegenBuffRate: /<mrgBuffRate:\[([+\-*/ ().\w]+)]>/gi,
	TechRegenBuffRate: /<trgBuffRate:\[([+\-*/ ().\w]+)]>/gi,
	HitGrowthPlus: /<hitGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
	EvadeGrowthPlus: /<evaGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
	CritChanceGrowthPlus: /<criGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
	CritEvadeGrowthPlus: /<cevGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
	MagiEvadeGrowthPlus: /<mevGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
	MagiReflectGrowthPlus: /<mrfGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
	CounterGrowthPlus: /<cntGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
	LifeRegenGrowthPlus: /<hrgGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
	MagiRegenGrowthPlus: /<mrgGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
	TechRegenGrowthPlus: /<trgGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
	HitGrowthRate: /<hitGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
	EvadeGrowthRate: /<evaGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
	CritChanceGrowthRate: /<criGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
	CritEvadeGrowthRate: /<cevGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
	MagiEvadeGrowthRate: /<mevGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
	MagiReflectGrowthRate: /<mrfGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
	CounterGrowthRate: /<cntGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
	LifeRegenGrowthRate: /<hrgGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
	MagiRegenGrowthRate: /<mrgGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
	TechRegenGrowthRate: /<trgGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
	AggroBuffPlus: /<tgrBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
	ParryBuffPlus: /<grdBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
	HealingBuffPlus: /<recBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
	ItemFxBuffPlus: /<phaBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
	MagiCostRateBuffPlus: /<mcrBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
	TechCostRateBuffPlus: /<tcrBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
	PhysDmgRateBuffPlus: /<pdrBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
	MagiDmgRateBuffPlus: /<mdrBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
	FloorDmgRateBuffPlus: /<fdrBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
	ExpGainRateBuffPlus: /<exrBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
	AggroBuffRate: /<tgrBuffRate:\[([+\-*/ ().\w]+)]>/gi,
	ParryBuffRate: /<grdBuffRate:\[([+\-*/ ().\w]+)]>/gi,
	HealingBuffRate: /<recBuffRate:\[([+\-*/ ().\w]+)]>/gi,
	ItemFxBuffRate: /<phaBuffRate:\[([+\-*/ ().\w]+)]>/gi,
	MagiCostRateBuffRate: /<mcrBuffRate:\[([+\-*/ ().\w]+)]>/gi,
	TechCostRateBuffRate: /<tcrBuffRate:\[([+\-*/ ().\w]+)]>/gi,
	PhysDmgRateBuffRate: /<pdrBuffRate:\[([+\-*/ ().\w]+)]>/gi,
	MagiDmgRateBuffRate: /<mdrBuffRate:\[([+\-*/ ().\w]+)]>/gi,
	FloorDmgRateBuffRate: /<fdrBuffRate:\[([+\-*/ ().\w]+)]>/gi,
	ExpGainRateBuffRate: /<exrBuffRate:\[([+\-*/ ().\w]+)]>/gi,
	AggroGrowthPlus: /<tgrGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
	ParryGrowthPlus: /<grdGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
	HealingGrowthPlus: /<recGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
	ItemFxGrowthPlus: /<phaGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
	MagiCostRateGrowthPlus: /<mcrGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
	TechCostRateGrowthPlus: /<tcrGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
	PhysDmgRateGrowthPlus: /<pdrGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
	MagiDmgRateGrowthPlus: /<mdrGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
	FloorDmgRateGrowthPlus: /<fdrGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
	ExpGainRateGrowthPlus: /<exrGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
	AggroGrowthRate: /<tgrGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
	ParryGrowthRate: /<grdGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
	HealingGrowthRate: /<recGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
	ItemFxGrowthRate: /<phaGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
	MagiCostRateGrowthRate: /<mcrGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
	TechCostRateGrowthRate: /<tcrGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
	PhysDmgRateGrowthRate: /<pdrGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
	MagiDmgRateGrowthRate: /<mdrGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
	FloorDmgRateGrowthRate: /<fdrGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
	ExpGainRateGrowthRate: /<exrGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
	BaseMaxTech: /<baseMaxTp:\[([+\-*/ ().\w]+)]>/gi,
	MaxTechBuffPlus: /<mtpBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
	MaxTechBuffRate: /<mtpBuffRate:\[([+\-*/ ().\w]+)]>/gi,
	MaxTechGrowthPlus: /<mtpGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
	MaxTechGrowthRate: /<mtpGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
	HarBuffPlus: /<harBuffPlus:\[([+\-*/ ().\w]+)]>/gi,
	HarBuffRate: /<harBuffRate:\[([+\-*/ ().\w]+)]>/gi,
	HarGrowthPlus: /<harGrowthPlus:\[([+\-*/ ().\w]+)]>/gi,
	HarGrowthRate: /<harGrowthRate:\[([+\-*/ ().\w]+)]>/gi,
	RewardExp: /<expPlus:\[([+\-*/ ().\w]+)]>/gi,
	RewardGold: /<goldPlus:\[([+\-*/ ().\w]+)]>/gi,
	RewardSdps: /<sdpPlus:\[([+\-*/ ().\w]+)]>/gi
};

//#endregion
//#region src/plugins/natural/core/objects/Game_Battler.js
/**
* Extends `.initMembers()` to include initializing the natural growth parameters.
*/
J.NATURAL.Aliased.Game_Battler.set("initMembers", Game_Battler.prototype.initMembers);
Game_Battler.prototype.initMembers = function() {
	J.NATURAL.Aliased.Game_Battler.get("initMembers").call(this);
	this.initNaturalGrowthParameters();
};
/**
* Initializes the natural growth parameters for this battler.<br/>
* Every parameter's natural state lives in four tables keyed by that parameter's registry key, so a
* parameter bound to natural growth has somewhere to keep its buffs and growths without anything here
* having to name it. A key nothing has buffed or grown is simply absent from a table, and reads as zero.
*
* Every amount is held in the numbers its tags were authored in- the ones the status screen shows- and
* only converted into the parameter's own units when a bonus is finally resolved. A lifesteal growth
* of `1.5` per level is therefore stored as `1.5` and not as the `0.015` the engine will add.
*/
Game_Battler.prototype.initNaturalGrowthParameters = function() {
	/**
	* The J object where all my additional properties live.
	*/
	this._j ||= {};
	/**
	* A grouping of all properties associated with natural growth.
	*/
	this._j._natural ||= {};
	/**
	* The flat bonus each parameter's buff tags currently grant, keyed by registry key.<br/>
	* A cache rather than a record: it is rebuilt from scratch whenever this battler's note sources
	* change, which is how a buff disappears the moment its equipment or state does.
	* @type {Record<string, number>}
	*/
	this._j._natural._buffPlus = {};
	/**
	* The percent bonus each parameter's buff tags currently grant, keyed by registry key.<br/>
	* Rebuilt alongside the flat buffs, for the same reason.
	* @type {Record<string, number>}
	*/
	this._j._natural._buffRate = {};
	/**
	* The flat bonus each parameter has permanently grown by, keyed by registry key.<br/>
	* Accrued once per level gained, and never given back.
	* @type {Record<string, number>}
	*/
	this._j._natural._growthPlus = {};
	/**
	* The percent bonus each parameter has permanently grown by, keyed by registry key.<br/>
	* Accrued alongside the flat growth, for the same reason.
	* @type {Record<string, number>}
	*/
	this._j._natural._growthRate = {};
	/**
	* The amount of additional exp to gain. Only affects experience gained from an enemy's defeat.
	* @type {number}
	*/
	this._j._natural._expPlus = 0;
	/**
	* The amount of additional gold to gain. Only affects gold gained from an enemy's defeat.
	* @type {number}
	*/
	this._j._natural._goldPlus = 0;
	/**
	* The amount of additional SDP points to gain. Only affects points gained from an enemy's defeat.
	* @type {number}
	*/
	this._j._natural._sdpsPlus = 0;
};
/**
* Gets the table of flat buffs, keyed by registry key.
* @returns {Record<string, number>}
*/
Game_Battler.prototype.naturalBuffPlusTable = function() {
	return this._j._natural._buffPlus;
};
/**
* Replaces the table of flat buffs.
* @param {Record<string, number>} table The new table, keyed by registry key.
*/
Game_Battler.prototype.setNaturalBuffPlusTable = function(table) {
	this._j._natural._buffPlus = table;
};
/**
* Gets the table of percent buffs, keyed by registry key.
* @returns {Record<string, number>}
*/
Game_Battler.prototype.naturalBuffRateTable = function() {
	return this._j._natural._buffRate;
};
/**
* Replaces the table of percent buffs.
* @param {Record<string, number>} table The new table, keyed by registry key.
*/
Game_Battler.prototype.setNaturalBuffRateTable = function(table) {
	this._j._natural._buffRate = table;
};
/**
* Gets the table of flat growths, keyed by registry key.
* @returns {Record<string, number>}
*/
Game_Battler.prototype.naturalGrowthPlusTable = function() {
	return this._j._natural._growthPlus;
};
/**
* Gets the table of percent growths, keyed by registry key.
* @returns {Record<string, number>}
*/
Game_Battler.prototype.naturalGrowthRateTable = function() {
	return this._j._natural._growthRate;
};
/**
* Gets the flat buff a parameter's buff tags currently grant this battler.
* @param {string} parameterKey The registry key of the parameter.
* @returns {number} The buff, or zero when nothing is buffing the parameter.
*/
Game_Battler.prototype.naturalBuffPlus = function(parameterKey) {
	return this.naturalBuffPlusTable()[parameterKey] ?? 0;
};
/**
* Sets the flat buff a parameter's buff tags currently grant this battler.
* @param {string} parameterKey The registry key of the parameter.
* @param {number} amount The flat buff, in the numbers the tags were authored in.
*/
Game_Battler.prototype.setNaturalBuffPlus = function(parameterKey, amount) {
	this.naturalBuffPlusTable()[parameterKey] = amount;
};
/**
* Gets the percent buff a parameter's buff tags currently grant this battler.
* @param {string} parameterKey The registry key of the parameter.
* @returns {number} The buff, or zero when nothing is buffing the parameter.
*/
Game_Battler.prototype.naturalBuffRate = function(parameterKey) {
	return this.naturalBuffRateTable()[parameterKey] ?? 0;
};
/**
* Sets the percent buff a parameter's buff tags currently grant this battler.
* @param {string} parameterKey The registry key of the parameter.
* @param {number} amount The percent buff, as a whole percent.
*/
Game_Battler.prototype.setNaturalBuffRate = function(parameterKey, amount) {
	this.naturalBuffRateTable()[parameterKey] = amount;
};
/**
* Gets the flat bonus this battler has permanently grown a parameter by.
* @param {string} parameterKey The registry key of the parameter.
* @returns {number} The growth, or zero when the parameter has never grown.
*/
Game_Battler.prototype.naturalGrowthPlus = function(parameterKey) {
	return this.naturalGrowthPlusTable()[parameterKey] ?? 0;
};
/**
* Grows the flat bonus of a parameter by a given amount.<br/>
* Modified rather than assigned, because growth is the running total of every level ever gained.
* @param {string} parameterKey The registry key of the parameter.
* @param {number} amount The amount to grow by, in the numbers the tags were authored in.
*/
Game_Battler.prototype.modNaturalGrowthPlus = function(parameterKey, amount) {
	this.naturalGrowthPlusTable()[parameterKey] = this.naturalGrowthPlus(parameterKey) + amount;
};
/**
* Gets the percent bonus this battler has permanently grown a parameter by.
* @param {string} parameterKey The registry key of the parameter.
* @returns {number} The growth, or zero when the parameter has never grown.
*/
Game_Battler.prototype.naturalGrowthRate = function(parameterKey) {
	return this.naturalGrowthRateTable()[parameterKey] ?? 0;
};
/**
* Grows the percent bonus of a parameter by a given amount.<br/>
* Modified rather than assigned, for the same reason as the flat growth.
* @param {string} parameterKey The registry key of the parameter.
* @param {number} amount The amount to grow by, as a whole percent.
*/
Game_Battler.prototype.modNaturalGrowthRate = function(parameterKey, amount) {
	this.naturalGrowthRateTable()[parameterKey] = this.naturalGrowthRate(parameterKey) + amount;
};
/**
* Gets the bonus to rewarded experience.
* @returns {number}
*/
Game_Battler.prototype.expPlus = function() {
	return this._j._natural._expPlus;
};
/**
* Sets the bonus to rewarded experience.
* @param {number} expPlus The new bonus rewarded experience value.
*/
Game_Battler.prototype.setExpPlus = function(expPlus) {
	this._j._natural._expPlus = expPlus;
};
/**
* Gets the bonus to rewarded gold.
* @returns {number}
*/
Game_Battler.prototype.goldPlus = function() {
	return this._j._natural._goldPlus;
};
/**
* Sets the bonus to rewarded gold.
* @param {number} goldPlus The new bonus rewarded gold value.
*/
Game_Battler.prototype.setGoldPlus = function(goldPlus) {
	this._j._natural._goldPlus = goldPlus;
};
/**
* Gets the bonus to rewarded SDPs.
* @returns {number}
*/
Game_Battler.prototype.sdpsPlus = function() {
	return this._j._natural._sdpsPlus;
};
/**
* Sets the bonus to rewarded SDPs.
* @param {number} sdpsPlus The new bonus rewarded SDPs value.
*/
Game_Battler.prototype.setSdpsPlus = function(sdpsPlus) {
	this._j._natural._sdpsPlus = sdpsPlus;
};
/**
* Extends {@link #naturalBonus}.<br/>
* Adds this battler's buffs and growths for a bound parameter, resolved against that parameter's base.
* This is how every plugin-owned parameter receives its natural bonus: its owner adds this wherever it
* assembles the value, and never has to know whether this plugin is installed.
* @param {string} parameterKey The registry key of the parameter being assembled.
* @returns {number}
*/
J.NATURAL.Aliased.Game_Battler.set("naturalBonus", Game_Battler.prototype.naturalBonus);
Game_Battler.prototype.naturalBonus = function(parameterKey) {
	const otherBonuses = J.NATURAL.Aliased.Game_Battler.get("naturalBonus").call(this, parameterKey);
	const binding = ParameterRegistry.naturalBinding(parameterKey);
	if (this.hasNaturalBonus(parameterKey) === false) return otherBonuses;
	const base = binding.getBase(this);
	return otherBonuses + this.naturalBonusAgainst(parameterKey, base);
};
/**
* Resolves the natural bonus for one of the engine's own parameters, whose assembly this plugin wraps.<br/>
* Those wrappers already hold the engine's base when they get here, so the bonus is resolved against it
* directly rather than through {@link #naturalBonus}, which would have to ask the engine for it again.
* @param {string|null} parameterKey The registry key the engine id translates to, or null for an id
* outside the engine's own set.
* @param {number} base The engine's value for the parameter before natural bonuses.
* @returns {number}
*/
Game_Battler.prototype.engineNaturalBonus = function(parameterKey, base) {
	if (parameterKey === null) return 0;
	if (this.hasNaturalBonus(parameterKey) === false) return 0;
	return this.naturalBonusAgainst(parameterKey, base);
};
/**
* Whether anything is currently buffing or has ever grown a parameter on this battler.
* @param {string} parameterKey The registry key of the parameter.
* @returns {boolean}
*/
Game_Battler.prototype.hasNaturalBonus = function(parameterKey) {
	return this.naturalBuffPlus(parameterKey) !== 0 || this.naturalBuffRate(parameterKey) !== 0 || this.naturalGrowthPlus(parameterKey) !== 0 || this.naturalGrowthRate(parameterKey) !== 0;
};
/**
* Resolves this battler's natural bonus for a parameter against a known base.<br/>
* Tags are authored in the numbers the status screen shows, while the parameter itself may be stored as
* a fraction of them, so the base is lifted into those display numbers, the tags are applied there, and
* only the finished bonus is brought back down. Lifting the base too, rather than only shrinking the
* result, is what keeps a rate tag a percent of the base a person actually reads.
*
* Buffs and growths are each resolved against the same base and then summed, so neither compounds on
* the other- a buff does not grow with level, and a growth does not swell when a state is applied.
* @param {string} parameterKey The registry key of the parameter.
* @param {number} base The parameter's own value before natural bonuses, in its own units.
* @returns {number} The bonus, in the parameter's own units.
*/
Game_Battler.prototype.naturalBonusAgainst = function(parameterKey, base) {
	const scale = ParameterRegistry.get(parameterKey).displayScale();
	const displayBase = base * scale;
	const buffPlus = this.naturalBuffPlus(parameterKey);
	const buffRate = this.naturalBuffRate(parameterKey);
	const buffBonus = this.calculatePlusRate(displayBase, buffPlus, buffRate);
	const growthPlus = this.naturalGrowthPlus(parameterKey);
	const growthRate = this.naturalGrowthRate(parameterKey);
	const growthBonus = this.calculatePlusRate(displayBase, growthPlus, growthRate);
	return (buffBonus + growthBonus) / scale;
};
/**
* The base a parameter's tags see as `b`, in the numbers those tags are written in.<br/>
* This is the same base a rate tag is a percent of, lifted into display units so a formula such as
* `b * 0.1` means a tenth of the value the status screen shows.
* @param {string} parameterKey The registry key of the parameter.
* @returns {number}
*/
Game_Battler.prototype.naturalDisplayBase = function(parameterKey) {
	const binding = ParameterRegistry.naturalBinding(parameterKey);
	const base = binding.getBase(this);
	const scale = ParameterRegistry.get(parameterKey).displayScale();
	return base * scale;
};
/**
* Calculates the combination of base parameter value, param plus, and param rate.
* This can be overridden if alternative calculations is desired.
* @param {number} baseValue The base value of the parameter.
* @param {number} paramPlus The flat bonus value of the parameter.
* @param {number} paramRate The multiplier bonus value of the parameter.
* @returns {number} The calculated result.
*/
Game_Battler.prototype.calculatePlusRate = function(baseValue, paramPlus, paramRate) {
	const paramFactor = (paramRate + 100) / 100;
	const paramBase = baseValue + paramPlus;
	return paramBase * paramFactor - baseValue;
};
/**
* Refreshes both plus/rate buffs for all parameters.
*/
Game_Battler.prototype.refreshAllParameterBuffs = function() {
	this.clearAllParameterBuffs();
	ParameterRegistry.naturallyBoundKeys().forEach((parameterKey) => this.refreshParameterBuffs(parameterKey));
	this.refreshRewardBonuses();
};
/**
* Clears all parameter buffs on this battler.
*/
Game_Battler.prototype.clearAllParameterBuffs = function() {
	this.setNaturalBuffPlusTable({});
	this.setNaturalBuffRateTable({});
	this.setExpPlus(0);
	this.setGoldPlus(0);
	this.setSdpsPlus(0);
};
/**
* Resolves the buff tags of one parameter into this battler's buff tables.<br/>
* Only a parameter something is actually buffing gets an entry, which keeps the tables down to what
* matters and leaves a saved battler readable at a glance.
* @param {string} parameterKey The registry key of the parameter.
*/
Game_Battler.prototype.refreshParameterBuffs = function(parameterKey) {
	const binding = ParameterRegistry.naturalBinding(parameterKey);
	const base = this.naturalDisplayBase(parameterKey);
	const buffPlus = this.naturalParamBuff(binding.buffPlus, base);
	if (buffPlus !== 0) {
		this.setNaturalBuffPlus(parameterKey, buffPlus);
	}
	const buffRate = this.naturalParamBuff(binding.buffRate, base);
	if (buffRate !== 0) {
		this.setNaturalBuffRate(parameterKey, buffRate);
	}
};
/**
* Refreshes battle reward bonuses for the battler.
*/
Game_Battler.prototype.refreshRewardBonuses = function() {};
/**
* Calculates the bonus growth based on the provided regular expression.
* @param {RegExp} structure The RegExp structure for this parameter.
* @param {number} baseParam The original value of the given parameter.
* @returns {number} The growth amount.
*/
Game_Battler.prototype.naturalParamBuff = function(structure, baseParam) {
	const objectsToCheck = this.getAllNotes();
	const total = RPGManager.getResultsFromAllNotesByRegex(objectsToCheck, structure, baseParam, this, false);
	return total;
};
/**
* Overwrites {@link #maxTp}.<br/>
* Combines base max TP with formula-based values derived from tags.
* @returns {number}
*/
Game_Battler.prototype.maxTp = function() {
	return Math.max(0, this.actualMaxTp());
};
/**
* Get the actual calculated max tp for this battler.
* @returns {number}
*/
Game_Battler.prototype.actualMaxTp = function() {
	const baseMaxTp = this.maxTpBeforeNatural();
	const naturalBonus = this.naturalBonus("mtp");
	return baseMaxTp + naturalBonus;
};
/**
* The max tech this battler has before natural bonuses: the configured base plus every `<maxTp>` tag.<br/>
* This is the base max tech's natural tags see, and what its rate tags are a percent of.
* @returns {number}
*/
Game_Battler.prototype.maxTpBeforeNatural = function() {
	const baseParam = this.getBaseMaxTp();
	const baseBonusParam = this.getBaseMaxTpBonuses();
	return baseParam + baseBonusParam;
};

//#endregion
//#region src/plugins/natural/core/objects/Game_Actor.js
/**
* Extends {@link #setup}.<br/>
* Includes parameter buff initialization.
*/
J.NATURAL.Aliased.Game_Actor.set("setup", Game_Actor.prototype.setup);
Game_Actor.prototype.setup = function(actorId) {
	J.NATURAL.Aliased.Game_Actor.get("setup").call(this, actorId);
	this.refreshAllParameterBuffs();
};
/**
* Extends {@link #onBattlerDataChange}.<br/>
* Also refreshes all natural parameter buff values on the battler.
*/
J.NATURAL.Aliased.Game_Actor.set("onBattlerDataChange", Game_Actor.prototype.onBattlerDataChange);
Game_Actor.prototype.onBattlerDataChange = function() {
	J.NATURAL.Aliased.Game_Actor.get("onBattlerDataChange").call(this);
	this.refreshAllParameterBuffs();
};
/**
* Overwrites {@link #maxTp}.<br/>
* Replaces the `maxTp()` function with our custom one that will respect
* formulas and apply rates from tags, etc.
* @returns {number}
*/
Game_Actor.prototype.maxTp = function() {
	return this.actualMaxTp();
};
/**
* Extends `.paramBase()` to include any natural buffs and growths as part of the base.
*/
J.NATURAL.Aliased.Game_Actor.set("paramBase", Game_Actor.prototype.paramBase);
Game_Actor.prototype.paramBase = function(paramId) {
	const baseParam = this.paramBaseBeforeNatural(paramId);
	const parameterKey = ParameterKeys.bparamKey(paramId);
	const naturalBonus = this.engineNaturalBonus(parameterKey, baseParam);
	return baseParam + naturalBonus;
};
/**
* The engine's base for a base parameter, before any natural bonus.<br/>
* This is what a base parameter's natural tags see as their base.
* @param {number} paramId The id of the base parameter.
* @returns {number}
*/
Game_Actor.prototype.paramBaseBeforeNatural = function(paramId) {
	return J.NATURAL.Aliased.Game_Actor.get("paramBase").call(this, paramId);
};
/**
* Extends `.xparam()` to include any natural buffs and growths.
*/
J.NATURAL.Aliased.Game_Actor.set("xparam", Game_Actor.prototype.xparam);
Game_Actor.prototype.xparam = function(xparamId) {
	const baseParam = this.xparamBeforeNatural(xparamId);
	const parameterKey = ParameterKeys.xparamKey(xparamId);
	const naturalBonus = this.engineNaturalBonus(parameterKey, baseParam);
	return baseParam + naturalBonus;
};
/**
* The engine's value for an ex-parameter, before any natural bonus.<br/>
* This is what an ex-parameter's natural tags see as their base.
* @param {number} xparamId The id of the ex-parameter.
* @returns {number}
*/
Game_Actor.prototype.xparamBeforeNatural = function(xparamId) {
	return J.NATURAL.Aliased.Game_Actor.get("xparam").call(this, xparamId);
};
/**
* Extends `.sparam()` to include any natural buffs and growths.
*/
J.NATURAL.Aliased.Game_Actor.set("sparam", Game_Actor.prototype.sparam);
Game_Actor.prototype.sparam = function(sparamId) {
	const baseParam = this.sparamBeforeNatural(sparamId);
	const parameterKey = ParameterKeys.sparamKey(sparamId);
	const naturalBonus = this.engineNaturalBonus(parameterKey, baseParam);
	return baseParam + naturalBonus;
};
/**
* The engine's value for an sp-parameter, before any natural bonus.<br/>
* This is what an sp-parameter's natural tags see as their base.
* @param {number} sparamId The id of the sp-parameter.
* @returns {number}
*/
Game_Actor.prototype.sparamBeforeNatural = function(sparamId) {
	return J.NATURAL.Aliased.Game_Actor.get("sparam").call(this, sparamId);
};
/**
* Extends `.levelUp()` to include applying any natural growths the battler has.
*/
J.NATURAL.Aliased.Game_Actor.set("levelUp", Game_Actor.prototype.levelUp);
Game_Actor.prototype.levelUp = function() {
	J.NATURAL.Aliased.Game_Actor.get("levelUp").call(this);
	this.applyNaturalGrowths();
};
/**
* Applies all natural growths applied to this actor at the present moment.<br/>
* Every parameter bound to natural growth grows here, the engine's own and every plugin's alike, which
* is why a newly bound parameter needs nothing of its own to grow with level.
*/
Game_Actor.prototype.applyNaturalGrowths = function() {
	ParameterRegistry.naturallyBoundKeys().forEach((parameterKey) => this.applyNaturalGrowth(parameterKey));
};
/**
* Grows one parameter by whatever its growth tags evaluate to for this actor right now.<br/>
* Only a parameter that actually grows gets an entry, which keeps the growth tables down to what this
* actor has really earned.
* @param {string} parameterKey The registry key of the parameter.
*/
Game_Actor.prototype.applyNaturalGrowth = function(parameterKey) {
	const binding = ParameterRegistry.naturalBinding(parameterKey);
	const base = this.naturalDisplayBase(parameterKey);
	const growthPlus = this.naturalParamBuff(binding.growthPlus, base);
	if (growthPlus !== 0) {
		this.modNaturalGrowthPlus(parameterKey, growthPlus);
	}
	const growthRate = this.naturalParamBuff(binding.growthRate, base);
	if (growthRate !== 0) {
		this.modNaturalGrowthRate(parameterKey, growthRate);
	}
};

//#endregion
//#region src/plugins/natural/core/objects/Game_Enemy.js
/**
* Extends {@link Game_Enemy.setup}.<br/>
* Includes parameter buff initialization.
*/
J.NATURAL.Aliased.Game_Enemy.set("setup", Game_Enemy.prototype.setup);
Game_Enemy.prototype.setup = function(enemyId, x, y) {
	J.NATURAL.Aliased.Game_Enemy.get("setup").call(this, enemyId, x, y);
	this.refreshAllParameterBuffs();
};
/**
* Extends {@link #onBattlerDataChange}.<br/>
* Also refreshes all natural parameter buff values on the battler.
*/
J.NATURAL.Aliased.Game_Enemy.set("onBattlerDataChange", Game_Enemy.prototype.onBattlerDataChange);
Game_Enemy.prototype.onBattlerDataChange = function() {
	J.NATURAL.Aliased.Game_Enemy.get("onBattlerDataChange").call(this);
	this.refreshAllParameterBuffs();
};
/**
* Overwrites {@link #maxTp}.<br/>
* Replaces the `maxTp()` function with our custom one that will respect
* formulas and apply rates from tags, etc.
* @returns {number}
*/
Game_Enemy.prototype.maxTp = function() {
	return this.actualMaxTp();
};
/**
* Extends `.paramBase()` to include any natural buffs as part of the base.<br/>
* Enemies never level, so the growth half of their natural bonus is always empty.
*/
J.NATURAL.Aliased.Game_Enemy.set("paramBase", Game_Enemy.prototype.paramBase);
Game_Enemy.prototype.paramBase = function(paramId) {
	const baseParam = this.paramBaseBeforeNatural(paramId);
	const parameterKey = ParameterKeys.bparamKey(paramId);
	const naturalBonus = this.engineNaturalBonus(parameterKey, baseParam);
	return baseParam + naturalBonus;
};
/**
* The engine's base for a base parameter, before any natural bonus.<br/>
* This is what a base parameter's natural tags see as their base.
* @param {number} paramId The id of the base parameter.
* @returns {number}
*/
Game_Enemy.prototype.paramBaseBeforeNatural = function(paramId) {
	return J.NATURAL.Aliased.Game_Enemy.get("paramBase").call(this, paramId);
};
/**
* Extends `.xparam()` to include any natural buffs.
*/
J.NATURAL.Aliased.Game_Enemy.set("xparam", Game_Enemy.prototype.xparam);
Game_Enemy.prototype.xparam = function(xparamId) {
	const baseParam = this.xparamBeforeNatural(xparamId);
	const parameterKey = ParameterKeys.xparamKey(xparamId);
	const naturalBonus = this.engineNaturalBonus(parameterKey, baseParam);
	return baseParam + naturalBonus;
};
/**
* The engine's value for an ex-parameter, before any natural bonus.<br/>
* This is what an ex-parameter's natural tags see as their base.
* @param {number} xparamId The id of the ex-parameter.
* @returns {number}
*/
Game_Enemy.prototype.xparamBeforeNatural = function(xparamId) {
	return J.NATURAL.Aliased.Game_Enemy.get("xparam").call(this, xparamId);
};
/**
* Extends `.sparam()` to include any natural buffs.
*/
J.NATURAL.Aliased.Game_Enemy.set("sparam", Game_Enemy.prototype.sparam);
Game_Enemy.prototype.sparam = function(sparamId) {
	const baseParam = this.sparamBeforeNatural(sparamId);
	const parameterKey = ParameterKeys.sparamKey(sparamId);
	const naturalBonus = this.engineNaturalBonus(parameterKey, baseParam);
	return baseParam + naturalBonus;
};
/**
* The engine's value for an sp-parameter, before any natural bonus.<br/>
* This is what an sp-parameter's natural tags see as their base.
* @param {number} sparamId The id of the sp-parameter.
* @returns {number}
*/
Game_Enemy.prototype.sparamBeforeNatural = function(sparamId) {
	return J.NATURAL.Aliased.Game_Enemy.get("sparam").call(this, sparamId);
};
/**
* Overwrites {@link #refreshRewardBonuses}.<br/>
* Implements the refresh for battle reward bonuses for the enemy.
*/
Game_Enemy.prototype.refreshRewardBonuses = function() {
	this.refreshExpRewardBonuses();
	this.refreshGoldRewardBonuses();
	this.refreshSdpRewardBonuses();
};
/**
* Refreshes the experience reward bonuses for this enemy.
*/
Game_Enemy.prototype.refreshExpRewardBonuses = function() {
	const bonusExp = this.naturalParamBuff(J.NATURAL.RegExp.RewardExp, this.enemy().exp);
	this.setExpPlus(bonusExp);
};
/**
* Refreshes the gold reward bonuses for this enemy.
*/
Game_Enemy.prototype.refreshGoldRewardBonuses = function() {
	const bonusGold = this.naturalParamBuff(J.NATURAL.RegExp.RewardGold, this.enemy().gold);
	this.setGoldPlus(bonusGold);
};
/**
* Refreshes the SDP reward bonuses for this enemy.
*/
Game_Enemy.prototype.refreshSdpRewardBonuses = function() {
	if (!J.SDP) return;
	const sdpsBonus = this.naturalParamBuff(J.NATURAL.RegExp.RewardSdps, this.enemy().sdpPoints);
	this.setSdpsPlus(sdpsBonus);
};
/**
* Extends {@link #exp}.<br/>
* Also adds on any natural bonuses of experience.
* @returns {number}
*/
J.NATURAL.Aliased.Game_Enemy.set("exp", Game_Enemy.prototype.exp);
Game_Enemy.prototype.exp = function() {
	const baseReward = J.NATURAL.Aliased.Game_Enemy.get("exp").call(this);
	const bonus = this.expPlus();
	return baseReward + bonus;
};
/**
* Extends {@link #gold}.<br/>
* Also adds on any natural bonuses of gold.
* @returns {number}
*/
J.NATURAL.Aliased.Game_Enemy.set("gold", Game_Enemy.prototype.gold);
Game_Enemy.prototype.gold = function() {
	const baseReward = J.NATURAL.Aliased.Game_Enemy.get("gold").call(this);
	const bonus = this.goldPlus();
	return baseReward + bonus;
};
/**
* Extends {@link #sdpPoints}.<br/>
* Also adds on any natural bonuses of SDPs.
*/
J.NATURAL.Aliased.Game_Enemy.set("sdpPoints", Game_Enemy.prototype.sdpPoints);
Game_Enemy.prototype.sdpPoints = function() {
	const baseReward = J.NATURAL.Aliased.Game_Enemy.get("sdpPoints").call(this);
	const bonus = this.sdpsPlus();
	return baseReward + bonus;
};

//#endregion
//#region src/plugins/natural/core/objects/Game_Party.js
/**
* Extends {@link #gainItem}.<br/>
* Also refreshes the passive states for the party.
* @param {RPG_Item|RPG_Weapon|RPG_Armor} item The item to modify the quantity of.
* @param {number} amount The amount to modify the quantity by.
* @param {boolean} includeEquip Whether or not to include equipped items for equipment.
*/
J.NATURAL.Aliased.Game_Party.set("gainItem", Game_Party.prototype.gainItem);
Game_Party.prototype.gainItem = function(item, amount, includeEquip) {
	J.NATURAL.Aliased.Game_Party.get("gainItem").call(this, item, amount, includeEquip);
	this.refreshAllParameterBuffsForAll();
};
/**
* Refresh all parameter buffs for all party members.
*/
Game_Party.prototype.refreshAllParameterBuffsForAll = function() {
	this.members().forEach((member) => member.refreshAllParameterBuffs());
};

//#endregion
//#region src/plugins/natural/core/core/registerNaturalParameters.js
/**
* Boot-time natural growth bindings for the parameters J-NaturalGrowth answers for itself: the
* engine's twenty-eight, plus max tech and healing amplification.<br/>
* Every other plugin binds its own parameters from its own `register*Parameters.js`, because their
* tags live in their own `RegExp` tables. These thirty are the ones no other plugin owns, so they are
* bound here, after J-Base has registered the definitions they attach to.
*
* Each engine table below is ordered by the engine's own parameter id, and the id a row sits at is
* the id it binds- the same order {@link ParameterKeys} lists its keys in.
*/
var NaturalParameterRegistration = class {
	/**
	* Binds every parameter this plugin owns the tags for.
	*/
	static registerAll() {
		this.registerBaseParameters();
		this.registerExParameters();
		this.registerSpParameters();
		this.registerCustomParameters();
	}
	/**
	* Binds the engine's eight base parameters, which grow against the base the engine computes for them.
	*/
	static registerBaseParameters() {
		this.baseParameterTags().forEach((tags, paramId) => {
			const parameterKey = ParameterKeys.bparamKey(paramId);
			this.bind(parameterKey, tags, (battler) => battler.paramBaseBeforeNatural(paramId));
		});
	}
	/**
	* Binds the engine's ten ex-parameters, which grow against the value the engine computes for them.
	*/
	static registerExParameters() {
		this.exParameterTags().forEach((tags, xparamId) => {
			const parameterKey = ParameterKeys.xparamKey(xparamId);
			this.bind(parameterKey, tags, (battler) => battler.xparamBeforeNatural(xparamId));
		});
	}
	/**
	* Binds the engine's ten sp-parameters, which grow against the value the engine computes for them.
	*/
	static registerSpParameters() {
		this.spParameterTags().forEach((tags, sparamId) => {
			const parameterKey = ParameterKeys.sparamKey(sparamId);
			this.bind(parameterKey, tags, (battler) => battler.sparamBeforeNatural(sparamId));
		});
	}
	/**
	* Binds max tech and healing amplification, the two parameters RMMZ has no native slot for.
	*/
	static registerCustomParameters() {
		const tags = J.NATURAL.RegExp;
		const maxTechTags = [
			tags.MaxTechBuffPlus,
			tags.MaxTechBuffRate,
			tags.MaxTechGrowthPlus,
			tags.MaxTechGrowthRate
		];
		this.bind("mtp", maxTechTags, (battler) => battler.maxTpBeforeNatural());
		const healingTags = [
			tags.HarBuffPlus,
			tags.HarBuffRate,
			tags.HarGrowthPlus,
			tags.HarGrowthRate
		];
		this.bind("har", healingTags, (battler) => battler.baseHarFactor());
	}
	/**
	* Binds one parameter's four tags and its base with the registry.
	* @param {string} parameterKey The registry key of the parameter.
	* @param {[RegExp, RegExp, RegExp, RegExp]} tags The buff-plus, buff-rate, growth-plus and growth-rate tags.
	* @param {function(Game_Battler): number} getBase Resolves the parameter's value before natural bonuses.
	*/
	static bind(parameterKey, tags, getBase) {
		const [buffPlus, buffRate, growthPlus, growthRate] = tags;
		const binding = new NaturalParameterBinding(buffPlus, buffRate, growthPlus, growthRate, getBase);
		ParameterRegistry.bindNatural(parameterKey, binding);
	}
	/**
	* The four tags of each base parameter, ordered by engine param id.
	* @returns {[RegExp, RegExp, RegExp, RegExp][]}
	*/
	static baseParameterTags() {
		const tags = J.NATURAL.RegExp;
		return [
			[
				tags.MaxLifeBuffPlus,
				tags.MaxLifeBuffRate,
				tags.MaxLifeGrowthPlus,
				tags.MaxLifeGrowthRate
			],
			[
				tags.MaxMagiBuffPlus,
				tags.MaxMagiBuffRate,
				tags.MaxMagiGrowthPlus,
				tags.MaxMagiGrowthRate
			],
			[
				tags.PowerBuffPlus,
				tags.PowerBuffRate,
				tags.PowerGrowthPlus,
				tags.PowerGrowthRate
			],
			[
				tags.DefenseBuffPlus,
				tags.DefenseBuffRate,
				tags.DefenseGrowthPlus,
				tags.DefenseGrowthRate
			],
			[
				tags.ForceBuffPlus,
				tags.ForceBuffRate,
				tags.ForceGrowthPlus,
				tags.ForceGrowthRate
			],
			[
				tags.ResistBuffPlus,
				tags.ResistBuffRate,
				tags.ResistGrowthPlus,
				tags.ResistGrowthRate
			],
			[
				tags.SpeedBuffPlus,
				tags.SpeedBuffRate,
				tags.SpeedGrowthPlus,
				tags.SpeedGrowthRate
			],
			[
				tags.LuckBuffPlus,
				tags.LuckBuffRate,
				tags.LuckGrowthPlus,
				tags.LuckGrowthRate
			]
		];
	}
	/**
	* The four tags of each ex-parameter, ordered by engine xparam id.
	* @returns {[RegExp, RegExp, RegExp, RegExp][]}
	*/
	static exParameterTags() {
		const tags = J.NATURAL.RegExp;
		return [
			[
				tags.HitBuffPlus,
				tags.HitBuffRate,
				tags.HitGrowthPlus,
				tags.HitGrowthRate
			],
			[
				tags.EvadeBuffPlus,
				tags.EvadeBuffRate,
				tags.EvadeGrowthPlus,
				tags.EvadeGrowthRate
			],
			[
				tags.CritChanceBuffPlus,
				tags.CritChanceBuffRate,
				tags.CritChanceGrowthPlus,
				tags.CritChanceGrowthRate
			],
			[
				tags.CritEvadeBuffPlus,
				tags.CritEvadeBuffRate,
				tags.CritEvadeGrowthPlus,
				tags.CritEvadeGrowthRate
			],
			[
				tags.MagiEvadeBuffPlus,
				tags.MagiEvadeBuffRate,
				tags.MagiEvadeGrowthPlus,
				tags.MagiEvadeGrowthRate
			],
			[
				tags.MagiReflectBuffPlus,
				tags.MagiReflectBuffRate,
				tags.MagiReflectGrowthPlus,
				tags.MagiReflectGrowthRate
			],
			[
				tags.CounterBuffPlus,
				tags.CounterBuffRate,
				tags.CounterGrowthPlus,
				tags.CounterGrowthRate
			],
			[
				tags.LifeRegenBuffPlus,
				tags.LifeRegenBuffRate,
				tags.LifeRegenGrowthPlus,
				tags.LifeRegenGrowthRate
			],
			[
				tags.MagiRegenBuffPlus,
				tags.MagiRegenBuffRate,
				tags.MagiRegenGrowthPlus,
				tags.MagiRegenGrowthRate
			],
			[
				tags.TechRegenBuffPlus,
				tags.TechRegenBuffRate,
				tags.TechRegenGrowthPlus,
				tags.TechRegenGrowthRate
			]
		];
	}
	/**
	* The four tags of each sp-parameter, ordered by engine sparam id.
	* @returns {[RegExp, RegExp, RegExp, RegExp][]}
	*/
	static spParameterTags() {
		const tags = J.NATURAL.RegExp;
		return [
			[
				tags.AggroBuffPlus,
				tags.AggroBuffRate,
				tags.AggroGrowthPlus,
				tags.AggroGrowthRate
			],
			[
				tags.ParryBuffPlus,
				tags.ParryBuffRate,
				tags.ParryGrowthPlus,
				tags.ParryGrowthRate
			],
			[
				tags.HealingBuffPlus,
				tags.HealingBuffRate,
				tags.HealingGrowthPlus,
				tags.HealingGrowthRate
			],
			[
				tags.ItemFxBuffPlus,
				tags.ItemFxBuffRate,
				tags.ItemFxGrowthPlus,
				tags.ItemFxGrowthRate
			],
			[
				tags.MagiCostRateBuffPlus,
				tags.MagiCostRateBuffRate,
				tags.MagiCostRateGrowthPlus,
				tags.MagiCostRateGrowthRate
			],
			[
				tags.TechCostRateBuffPlus,
				tags.TechCostRateBuffRate,
				tags.TechCostRateGrowthPlus,
				tags.TechCostRateGrowthRate
			],
			[
				tags.PhysDmgRateBuffPlus,
				tags.PhysDmgRateBuffRate,
				tags.PhysDmgRateGrowthPlus,
				tags.PhysDmgRateGrowthRate
			],
			[
				tags.MagiDmgRateBuffPlus,
				tags.MagiDmgRateBuffRate,
				tags.MagiDmgRateGrowthPlus,
				tags.MagiDmgRateGrowthRate
			],
			[
				tags.FloorDmgRateBuffPlus,
				tags.FloorDmgRateBuffRate,
				tags.FloorDmgRateGrowthPlus,
				tags.FloorDmgRateGrowthRate
			],
			[
				tags.ExpGainRateBuffPlus,
				tags.ExpGainRateBuffRate,
				tags.ExpGainRateGrowthPlus,
				tags.ExpGainRateGrowthRate
			]
		];
	}
};

//#endregion
//#region src/plugins/natural/core/scenes/Scene_Boot.js
/**
* Extends {@link #onDatabaseLoaded}.<br/>
* Binds natural growth to the parameters this plugin owns the tags for, once J-Base has registered the
* definitions those bindings attach to.
*/
J.NATURAL.Aliased.Scene_Boot.set("onDatabaseLoaded", Scene_Boot.prototype.onDatabaseLoaded);
Scene_Boot.prototype.onDatabaseLoaded = function() {
	J.NATURAL.Aliased.Scene_Boot.get("onDatabaseLoaded").call(this);
	NaturalParameterRegistration.registerAll();
};

//#endregion
//#region src/plugins/natural/core/scenes/Scene_Equip.js
/**
* Extends {@link #executeEquipChange}.<br/>
* Also refreshes all natural parameter data.
*/
J.NATURAL.Aliased.Scene_Equip.set("executeEquipChange", Scene_Equip.prototype.executeEquipChange);
Scene_Equip.prototype.executeEquipChange = function() {
	J.NATURAL.Aliased.Scene_Equip.get("executeEquipChange").call(this);
	this.actor().refreshAllParameterBuffs();
};

//#endregion
//#region src/plugins/natural/core/windows/Window_EquipItem.js
/**
* Extends {@link #postEquipSetupActorClone}.<br/>
* Updates the buffs associated with the cloned actor so that it reflects in the
* status window comparison.
* @param {Game_Actor} actorClone The clone of the actor.
*/
J.NATURAL.Aliased.Window_EquipItem.set("postEquipSetupActorClone", Window_EquipItem.prototype.postEquipSetupActorClone);
Window_EquipItem.prototype.postEquipSetupActorClone = function(actorClone) {
	actorClone.refreshAllParameterBuffs();
};

//#endregion
//#region src/plugins/natural/core/registerNaturalSaveRoutes.js
/**
* Lifts this plugin's slice out of whatever host carries it and into its own section file.
*
* Without this the namespace still saves correctly - it simply rides inline on the host it was
* assigned to, which is where every plugin's state lived before the router existed. Registering
* is what gives J-NaturalGrowth a file of its own to read.
*
* The namespace check is the one this codebase allows: J-Base-Save is genuinely optional, and
* without it the engine's own save path carries this state inline just as it always did.
*/
if (J.BASE.EXT.SAVE) {
	SaveSectionRouter.registerNamespace("_natural", "natural");
}

//#endregion
//# sourceMappingURL=J-NaturalGrowth.js.map