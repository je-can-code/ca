//region Introduction
/*:
 * @target MZ
 * @plugindesc [v2.2.0 NATURAL] Enables level-based growth of all parameters.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
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
 * ----------------------------------------------------------------------------
 * DETAILS:
 * The "Natural Growths" are separated into two categories:
 * - "Buffs":   has effect while applied.
 * - "Growths": effect is applied permanently for every level gained.
 *
 * Additionally, each "Natural Growth" can be applied in two ways:
 * - "Plus": a flat bonus to the base parameter.
 * - "Rate": a multiplicative bonus to the (base parameter + "plus" bonus).
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
 * find the grand master list of all combinations of tags. Do note that the
 * hard brackets of [] are required to wrap the formula in the note tag.
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
 * of the 8 base parameters, 10 sp-parameters, or 10 ex-parameters, or max tp.
 *
 * TIP:
 * Within the FORMULA of the tag, the variable "a" is can be used to access
 * the actor for more complex calculations.
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
 *  <grdGrowthRate:[a.grd / 2]>
 * LOCATION:
 *  A class.
 * EFFECT:
 *  For every level gained by an actor using this class, they will gain a
 *  a permanent bonus of 50% of their current GRD added as a "rate" bonus,
 *  meaning it is a multiplied percent bonus against their base and plus
 *  values combined. Note that this is stored on the actor and will persist
 *  even after the class is changed.
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
 *  While afflicted, the actor's outgoing healing gains a flat +20 bonus on
 *  top of their base HAR. Lost as soon as the state wears off.
 *
 * ==============================================================================
 * GLOSSARY:
 * There are a lot of shorthands available for use with this plugin to build your
 * various buff and growth tags. Here is a comprehensive list of the shorthands
 * along with a translation to the actual parameter of all supported shorthands.
 *
 * NOTE:
 * Custom parameters will require their respective plugins added below this one.
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
 *
 * Rewards (plus only, no rate):
 * - exp
 * - gold
 * - sdp
 *
 * ============================================================================
 * CHANGELOG:
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
J.NATURAL.Metadata = new J_NaturalGrowthPluginMetadata("J-NaturalGrowth", "2.2.0");
/**
* A collection of all aliased methods for this plugin.
*/
J.NATURAL.Aliased = {
	Game_Actor: new Map(),
	Game_Battler: new Map(),
	Game_Enemy: new Map(),
	Game_Party: new Map(),
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
* Initializes the natural growth parameters for this battler.
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
	* The permanent flat bonus for max tp.
	* @type {number}
	*/
	this._j._natural._maxTpGrowthPlus = 0;
	/**
	* The permanent multiplier bonus for max tp.
	* @type {number}
	*/
	this._j._natural._maxTpGrowthRate = 0;
	/**
	* The cache of the temporary flat bonus for max tp.
	* @type {number}
	*/
	this._j._natural._maxTpBuffPlus = 0;
	/**
	* The cache of the temporary multiplier bonus for max tp.
	* @type {number}
	*/
	this._j._natural._maxTpBuffRate = 0;
	/**
	* The permanent flat bonus for HAR.
	* @type {number}
	*/
	this._j._natural._harGrowthPlus = 0;
	/**
	* The permanent multiplier bonus for HAR.
	* @type {number}
	*/
	this._j._natural._harGrowthRate = 0;
	/**
	* The cache of the temporary flat bonus for HAR.
	* @type {number}
	*/
	this._j._natural._harBuffPlus = 0;
	/**
	* The cache of the temporary multiplier bonus for HAR.
	* @type {number}
	*/
	this._j._natural._harBuffRate = 0;
	/**
	* The permanent flat bonuses for each of the base parameters.
	* @type {number[]}
	*/
	this._j._natural._bParamsGrowthPlus = [
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	];
	/**
	* The permanent multiplier bonuses for each of the base parameters.
	* @type {number[]}
	*/
	this._j._natural._bParamsGrowthRate = [
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	];
	/**
	* The cache of temporary flat bonuses for each of the base parameters.
	* @type {number[]}
	*/
	this._j._natural._bParamsBuffPlus = [
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	];
	/**
	* The cache of temporary multiplier bonuses for each of the base parameters.
	* @type {number[]}
	*/
	this._j._natural._bParamsBuffRate = [
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	];
	/**
	* The permanent flat bonuses for each of the sp-parameters.
	* @type {number[]}
	*/
	this._j._natural._sParamsGrowthPlus = [
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	];
	/**
	* The permanent multiplier bonuses for each of the sp-parameters.
	* @type {number[]}
	*/
	this._j._natural._sParamsGrowthRate = [
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	];
	/**
	* The cache of temporary flat bonuses for each of the sp-parameters.
	* @type {number[]}
	*/
	this._j._natural._sParamsBuffPlus = [
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	];
	/**
	* The cache of temporary multiplier bonuses for each of the sp-parameters.
	* @type {number[]}
	*/
	this._j._natural._sParamsBuffRate = [
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	];
	/**
	* The permanent flat bonuses for each of the ex-parameters.
	* @type {number[]}
	*/
	this._j._natural._xParamsGrowthPlus = [
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	];
	/**
	* The permanent multiplier bonuses for each of the ex-parameters.
	* @type {number[]}
	*/
	this._j._natural._xParamsGrowthRate = [
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	];
	/**
	* The cache of temporary flat bonuses for each of the ex-parameters.
	* @type {number[]}
	*/
	this._j._natural._xParamsBuffPlus = [
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	];
	/**
	* The cache of temporary multiplier bonuses for each of the ex-parameters.
	* @type {number[]}
	*/
	this._j._natural._xParamsBuffRate = [
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	];
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
* Gets the permanent flat bonus for max tp.
* @returns {number}
*/
Game_Battler.prototype.maxTpGrowthPlus = function() {
	return this._j._natural._maxTpGrowthPlus;
};
/**
* Modifies the permanent flat bonus for max tp by a given amount.
* @param {number} amount The amount to modify the bonus by.
*/
Game_Battler.prototype.modMaxTpGrowthPlus = function(amount) {
	this._j._natural._maxTpGrowthPlus += amount;
};
/**
* Gets the permanent multiplicative bonus for max tp.
* @returns {number}
*/
Game_Battler.prototype.maxTpGrowthRate = function() {
	return this._j._natural._maxTpGrowthRate;
};
/**
* Modifies the permanent multiplicative bonus for max tp by a given amount.
* @param {number} amount The amount to modify the bonus by.
*/
Game_Battler.prototype.modMaxTpGrowthRate = function(amount) {
	this._j._natural._maxTpGrowthRate += amount;
};
/**
* Gets the temporary flat bonus for max tp.
* @returns {number}
*/
Game_Battler.prototype.maxTpBuffPlus = function() {
	return this._j._natural._maxTpBuffPlus;
};
/**
* Modifies the temporary flat bonus for max tp by a given amount.
* @param {number} amount The amount to modify the bonus by.
*/
Game_Battler.prototype.setMaxTpBuffPlus = function(amount) {
	this._j._natural._maxTpBuffPlus = amount;
};
/**
* Gets the temporary multiplicative bonus for max tp.
* @returns {number}
*/
Game_Battler.prototype.maxTpBuffRate = function() {
	return this._j._natural._maxTpBuffRate;
};
/**
* Modifies the temporary multiplicative bonus for max tp by a given amount.
* @param {number} amount The amount to modify the bonus by.
*/
Game_Battler.prototype.setMaxTpBuffRate = function(amount) {
	this._j._natural._maxTpBuffRate = amount;
};
/**
* Gets the permanent flat bonus for HAR.
* @returns {number}
*/
Game_Battler.prototype.harGrowthPlus = function() {
	return this._j._natural._harGrowthPlus;
};
/**
* Modifies the permanent flat bonus for HAR by a given amount.
* @param {number} amount The amount to modify the bonus by.
*/
Game_Battler.prototype.modHarGrowthPlus = function(amount) {
	this._j._natural._harGrowthPlus += amount;
};
/**
* Gets the permanent multiplicative bonus for HAR.
* @returns {number}
*/
Game_Battler.prototype.harGrowthRate = function() {
	return this._j._natural._harGrowthRate;
};
/**
* Modifies the permanent multiplicative bonus for HAR by a given amount.
* @param {number} amount The amount to modify the bonus by.
*/
Game_Battler.prototype.modHarGrowthRate = function(amount) {
	this._j._natural._harGrowthRate += amount;
};
/**
* Gets the temporary flat bonus for HAR.
* @returns {number}
*/
Game_Battler.prototype.harBuffPlus = function() {
	return this._j._natural._harBuffPlus;
};
/**
* Modifies the temporary flat bonus for HAR by a given amount.
* @param {number} amount The amount to modify the bonus by.
*/
Game_Battler.prototype.setHarBuffPlus = function(amount) {
	this._j._natural._harBuffPlus = amount;
};
/**
* Gets the temporary multiplicative bonus for HAR.
* @returns {number}
*/
Game_Battler.prototype.harBuffRate = function() {
	return this._j._natural._harBuffRate;
};
/**
* Modifies the temporary multiplicative bonus for HAR by a given amount.
* @param {number} amount The amount to modify the bonus by.
*/
Game_Battler.prototype.setHarBuffRate = function(amount) {
	this._j._natural._harBuffRate = amount;
};
/**
* Extends the `har` getter defined by J.BASE.<br/>
* Layers temporary buffs on top of the notetag+SDP base factor. Growth is layered
* further on top of this by {@link Game_Actor}, which is why this capture/redefine
* happens here rather than being folded into a single combined getter.
*/
J.NATURAL.Aliased.Game_Battler.set("har", Object.getOwnPropertyDescriptor(Game_Battler.prototype, "har").get);
Object.defineProperty(Game_Battler.prototype, "har", {
	get: function() {
		const baseParam = J.NATURAL.Aliased.Game_Battler.get("har").call(this);
		return baseParam + this.getHarBuff(baseParam);
	},
	configurable: true
});
/**
* Gets the permanent flat bonus for a base parameter of the given id.
* @param {number} paramId The id of the parameter.
* @returns {number}
*/
Game_Battler.prototype.bParamGrowthPlus = function(paramId) {
	return this.bParamsGrowthPlus()[paramId] ?? 0;
};
/**
* Modifies the permanent flat bonus value of the given id by a given amount.
* @param {number} paramId The id of the parameter.
* @param {number} amount The amount to modify the parameter by.
*/
Game_Battler.prototype.modBparamGrowthPlus = function(paramId, amount) {
	this.bParamsGrowthPlus()[paramId] += amount;
};
/**
* Gets the permanent multiplier bonus for a base parameter of the given id.
* @param {number} paramId The id of the parameter.
* @returns {number}
*/
Game_Battler.prototype.bParamGrowthRate = function(paramId) {
	return this.bParamsGrowthRate()[paramId] ?? 0;
};
/**
* Modifies the permanent multiplier bonus value of the given id by a given amount.
* @param {number} paramId The id of the parameter.
* @param {number} amount The amount to modify the parameter by.
*/
Game_Battler.prototype.modBparamGrowthRate = function(paramId, amount) {
	this.bParamsGrowthRate()[paramId] += amount;
};
/**
* Gets the temporary flat bonus for a base parameter of the given id.
* @param {number} paramId The id of the parameter.
* @returns {number}
*/
Game_Battler.prototype.bParamBuffPlus = function(paramId) {
	return this.bParamsBuffPlus()[paramId] ?? 0;
};
/**
* Modifies the temporary flat bonus value of the given id by a given amount.
* @param {number} paramId The id of the parameter.
* @param {number} amount The amount to modify the parameter by.
*/
Game_Battler.prototype.setBparamBuffPlus = function(paramId, amount) {
	this.bParamsBuffPlus()[paramId] = amount;
};
/**
* Gets the temporary multiplier bonus for a base parameter of the given id.
* @param {number} paramId The id of the parameter.
* @returns {number}
*/
Game_Battler.prototype.bParamBuffRate = function(paramId) {
	return this.bParamsBuffRate()[paramId] ?? 0;
};
/**
* Modifies the temporary multiplier bonus value of the given id by a given amount.
* @param {number} paramId The id of the parameter.
* @param {number} amount The amount to modify the parameter by.
*/
Game_Battler.prototype.setBparamBuffRate = function(paramId, amount) {
	this.bParamsBuffRate()[paramId] = amount;
};
/**
* Gets the permanent flat bonus for a base parameter of the given id.
* @param {number} paramId The id of the parameter.
* @returns {number}
*/
Game_Battler.prototype.sParamGrowthPlus = function(paramId) {
	return this.sParamsGrowthPlus()[paramId] ?? 0;
};
/**
* Modifies the permanent flat bonus value of the given id by a given amount.
* @param {number} paramId The id of the parameter.
* @param {number} amount The amount to modify the parameter by.
*/
Game_Battler.prototype.modSparamGrowthPlus = function(paramId, amount) {
	this.sParamsGrowthPlus()[paramId] += amount;
};
/**
* Gets the permanent multiplier bonus for a base parameter of the given id.
* @param {number} paramId The id of the parameter.
* @returns {number}
*/
Game_Battler.prototype.sParamGrowthRate = function(paramId) {
	return this.sParamsGrowthRate()[paramId] ?? 0;
};
/**
* Modifies the permanent multiplier bonus value of the given id by a given amount.
* @param {number} paramId The id of the parameter.
* @param {number} amount The amount to modify the parameter by.
*/
Game_Battler.prototype.modSparamGrowthRate = function(paramId, amount) {
	this.sParamsGrowthRate()[paramId] += amount;
};
/**
* Gets the temporary flat bonus for a base parameter of the given id.
* @param {number} paramId The id of the parameter.
* @returns {number}
*/
Game_Battler.prototype.sParamBuffPlus = function(paramId) {
	return this.sParamsBuffPlus()[paramId] ?? 0;
};
/**
* Modifies the temporary flat bonus value of the given id by a given amount.
* @param {number} paramId The id of the parameter.
* @param {number} amount The amount to modify the parameter by.
*/
Game_Battler.prototype.setSparamBuffPlus = function(paramId, amount) {
	this.sParamsBuffPlus()[paramId] = amount;
};
/**
* Gets the temporary multiplier bonus for a base parameter of the given id.
* @param {number} paramId The id of the parameter.
* @returns {number}
*/
Game_Battler.prototype.sParamBuffRate = function(paramId) {
	return this.sParamsBuffRate()[paramId] ?? 0;
};
/**
* Modifies the temporary multiplier bonus value of the given id by a given amount.
* @param {number} paramId The id of the parameter.
* @param {number} amount The amount to modify the parameter by.
*/
Game_Battler.prototype.setSparamBuffRate = function(paramId, amount) {
	this.sParamsBuffRate()[paramId] = amount;
};
/**
* Gets the permanent flat bonus for a base parameter of the given id.
* @param {number} paramId The id of the parameter.
* @returns {number}
*/
Game_Battler.prototype.xParamGrowthPlus = function(paramId) {
	return this.xParamsGrowthPlus()[paramId] ?? 0;
};
/**
* Modifies the permanent flat bonus value of the given id by a given amount.
* @param {number} paramId The id of the parameter.
* @param {number} amount The amount to modify the parameter by.
*/
Game_Battler.prototype.modXparamGrowthPlus = function(paramId, amount) {
	this.xParamsGrowthPlus()[paramId] += amount;
};
/**
* Gets the permanent multiplier bonus for a base parameter of the given id.
* @param {number} paramId The id of the parameter.
* @returns {number}
*/
Game_Battler.prototype.xParamGrowthRate = function(paramId) {
	return this.xParamsGrowthRate()[paramId] ?? 0;
};
/**
* Modifies the permanent multiplier bonus value of the given id by a given amount.
* @param {number} paramId The id of the parameter.
* @param {number} amount The amount to modify the parameter by.
*/
Game_Battler.prototype.modXparamGrowthRate = function(paramId, amount) {
	this.xParamsGrowthRate()[paramId] += amount;
};
/**
* Gets the temporary flat bonus for a x parameter of the given id.
* @param {number} paramId The id of the parameter.
* @returns {number}
*/
Game_Battler.prototype.xParamBuffPlus = function(paramId) {
	return this.xParamsBuffPlus()[paramId] ?? 0;
};
/**
* Modifies the temporary flat bonus value of the given id by a given amount.
* @param {number} paramId The id of the parameter.
* @param {number} amount The amount to modify the parameter by.
*/
Game_Battler.prototype.setXparamBuffPlus = function(paramId, amount) {
	this.xParamsBuffPlus()[paramId] = amount;
};
/**
* Gets the temporary multiplier bonus for a x parameter of the given id.
* @param {number} paramId The id of the parameter.
* @returns {number}
*/
Game_Battler.prototype.xParamBuffRate = function(paramId) {
	return this.xParamsBuffRate()[paramId] ?? 0;
};
/**
* Modifies the temporary multiplier bonus value of the given id by a given amount.
* @param {number} paramId The id of the parameter.
* @param {number} amount The amount to modify the parameter by.
*/
Game_Battler.prototype.setXparamBuffRate = function(paramId, amount) {
	this.xParamsBuffRate()[paramId] = amount;
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
* @returns {number|number|*}
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
* Refreshes both plus/rate buffs for all parameters.
*/
Game_Battler.prototype.refreshAllParameterBuffs = function() {
	this.clearAllParameterBuffs();
	this.refreshMaxTpBuffs();
	this.refreshHarBuffs();
	this.refreshBParamBuffs();
	this.refreshSParamBuffs();
	this.refreshXParamBuffs();
	this.refreshRewardBonuses();
};
/**
* Clears all parameter buffs on this battler.
*/
Game_Battler.prototype.clearAllParameterBuffs = function() {
	this.setMaxTpBuffPlus(0);
	this.setMaxTpBuffRate(0);
	this.setHarBuffPlus(0);
	this.setHarBuffRate(0);
	this.setBParamsBuffPlus([
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	]);
	this.setBParamsBuffRate([
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	]);
	this.setSParamsBuffPlus([
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	]);
	this.setSParamsBuffRate([
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	]);
	this.setXParamsBuffPlus([
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	]);
	this.setXParamsBuffRate([
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	]);
	this.setExpPlus(0);
	this.setGoldPlus(0);
	this.setSdpsPlus(0);
};
/**
* Refreshes both max tp plus/rate buffs.
*/
Game_Battler.prototype.refreshMaxTpBuffs = function() {
	const baseParam = this.getBaseMaxTp();
	const [plusStructure, rateStructure, ,] = this.getRegexForMaxTp();
	const buffPlus = this.naturalParamBuff(plusStructure, baseParam);
	const buffRate = this.naturalParamBuff(rateStructure, baseParam);
	this.setMaxTpBuffPlus(buffPlus);
	this.setMaxTpBuffRate(buffRate);
};
/**
* Refreshes both HAR plus/rate buffs.
*/
Game_Battler.prototype.refreshHarBuffs = function() {
	const baseParam = this.baseHarFactor() + (this.getSdpBonusForParameterKey ? this.getSdpBonusForParameterKey("har", 1) : 0);
	const [plusStructure, rateStructure, ,] = this.getRegexForHar();
	const buffPlus = this.naturalParamBuff(plusStructure, baseParam);
	const buffRate = this.naturalParamBuff(rateStructure, baseParam);
	this.setHarBuffPlus(buffPlus);
	this.setHarBuffRate(buffRate);
};
/**
* Retrieves the four regular RegExps governing HAR buffs and growths.
* @returns {[RegExp, RegExp, RegExp, RegExp]} The [buffplus, buffrate, growthplus, growthrate] regex structures.
*/
Game_Battler.prototype.getRegexForHar = function() {
	return [
		J.NATURAL.RegExp.HarBuffPlus,
		J.NATURAL.RegExp.HarBuffRate,
		J.NATURAL.RegExp.HarGrowthPlus,
		J.NATURAL.RegExp.HarGrowthRate
	];
};
/**
* Get the current amount of HAR bonuses added from buffs.
* @param {number} baseParam The base parameter value.
* @returns {number}
*/
Game_Battler.prototype.getHarBuff = function(baseParam) {
	const buffPlus = this.harBuffPlus();
	const buffRate = this.harBuffRate();
	if (!buffPlus && !buffRate) return 0;
	return this.calculatePlusRate(baseParam, buffPlus, buffRate);
};
/**
* Refreshes both base parameter plus/rate buffs.
*/
J.NATURAL.Aliased.Game_Battler.set("paramBase", Game_Battler.prototype.paramBase);
Game_Battler.prototype.refreshBParamBuffs = function() {
	const paramIds = Game_BattlerBase.knownBaseParameterIds();
	paramIds.forEach((paramId) => {
		const baseParam = J.NATURAL.Aliased.Game_Battler.get("paramBase").call(this, paramId);
		const [plusStructure, rateStructure] = this.getRegexByParamId(paramId);
		const buffPlus = this.naturalParamBuff(plusStructure, baseParam);
		const buffRate = this.naturalParamBuff(rateStructure, baseParam) / 100;
		this.setBparamBuffPlus(paramId, buffPlus);
		this.setBparamBuffRate(paramId, buffRate);
	}, this);
};
/**
* Refreshes both ex-parameter plus/rate buffs.
*/
J.NATURAL.Aliased.Game_Battler.set("xparam", Game_Battler.prototype.xparam);
Game_Battler.prototype.refreshXParamBuffs = function() {
	const paramIds = Game_BattlerBase.knownExParameterIds();
	paramIds.forEach((paramId) => {
		const baseParam = J.NATURAL.Aliased.Game_Battler.get("xparam").call(this, paramId);
		const [plusStructure, rateStructure] = this.getRegexByExParamId(paramId);
		const buffPlus = this.naturalParamBuff(plusStructure, baseParam) / 100;
		const buffRate = this.naturalParamBuff(rateStructure, baseParam);
		this.setXparamBuffPlus(paramId, buffPlus);
		this.setXparamBuffRate(paramId, buffRate);
	}, this);
};
/**
* Refreshes both sp-parameter plus/rate buffs.
*/
J.NATURAL.Aliased.Game_Battler.set("sparam", Game_Battler.prototype.sparam);
Game_Battler.prototype.refreshSParamBuffs = function() {
	const paramIds = Game_BattlerBase.knownSpParameterIds();
	paramIds.forEach((paramId) => {
		const baseParam = J.NATURAL.Aliased.Game_Battler.get("sparam").call(this, paramId);
		const [plusStructure, rateStructure] = this.getRegexBySpParamId(paramId);
		const buffPlus = this.naturalParamBuff(plusStructure, baseParam) / 100;
		const buffRate = this.naturalParamBuff(rateStructure, baseParam);
		this.setSparamBuffPlus(paramId, buffPlus);
		this.setSparamBuffRate(paramId, buffRate);
	}, this);
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
* Translates a base parameter id into its corresponding RegExp buff plus and rate structures.
* @param {number} paramId The parameter id to find the RegExp structures for.
* @returns {[RegExp, RegExp]} The relevant RegExp structures for this parameter id.
*/
Game_Battler.prototype.getRegexByParamId = function(paramId) {
	switch (paramId) {
		case 0: return [J.NATURAL.RegExp.MaxLifeBuffPlus, J.NATURAL.RegExp.MaxLifeBuffRate];
		case 1: return [J.NATURAL.RegExp.MaxMagiBuffPlus, J.NATURAL.RegExp.MaxMagiBuffRate];
		case 2: return [J.NATURAL.RegExp.PowerBuffPlus, J.NATURAL.RegExp.PowerBuffRate];
		case 3: return [J.NATURAL.RegExp.DefenseBuffPlus, J.NATURAL.RegExp.DefenseBuffRate];
		case 4: return [J.NATURAL.RegExp.ForceBuffPlus, J.NATURAL.RegExp.ForceBuffRate];
		case 5: return [J.NATURAL.RegExp.ResistBuffPlus, J.NATURAL.RegExp.ResistBuffRate];
		case 6: return [J.NATURAL.RegExp.SpeedBuffPlus, J.NATURAL.RegExp.SpeedBuffRate];
		case 7: return [J.NATURAL.RegExp.LuckBuffPlus, J.NATURAL.RegExp.LuckBuffRate];
		default: return null;
	}
};
/**
* Translates a ex-parameter id into its corresponding RegExp buff plus and rate structures.
* @param {number} xParamId The ex-parameter id to find the RegExp structures for.
* @returns {[RegExp, RegExp]} The relevant RegExp structures for this parameter id.
*/
Game_Battler.prototype.getRegexByExParamId = function(xParamId) {
	switch (xParamId) {
		case 0: return [J.NATURAL.RegExp.HitBuffPlus, J.NATURAL.RegExp.HitBuffRate];
		case 1: return [J.NATURAL.RegExp.EvadeBuffPlus, J.NATURAL.RegExp.EvadeBuffRate];
		case 2: return [J.NATURAL.RegExp.CritChanceBuffPlus, J.NATURAL.RegExp.CritChanceBuffRate];
		case 3: return [J.NATURAL.RegExp.CritEvadeBuffPlus, J.NATURAL.RegExp.CritEvadeBuffRate];
		case 4: return [J.NATURAL.RegExp.MagiEvadeBuffPlus, J.NATURAL.RegExp.MagiEvadeBuffRate];
		case 5: return [J.NATURAL.RegExp.MagiReflectBuffPlus, J.NATURAL.RegExp.MagiReflectBuffRate];
		case 6: return [J.NATURAL.RegExp.CounterBuffPlus, J.NATURAL.RegExp.CounterBuffRate];
		case 7: return [J.NATURAL.RegExp.LifeRegenBuffPlus, J.NATURAL.RegExp.LifeRegenBuffRate];
		case 8: return [J.NATURAL.RegExp.MagiRegenBuffPlus, J.NATURAL.RegExp.MagiRegenBuffRate];
		case 9: return [J.NATURAL.RegExp.TechRegenBuffPlus, J.NATURAL.RegExp.TechRegenBuffRate];
		default: return null;
	}
};
/**
* Translates a sp-parameter id into its corresponding RegExp buff plus and rate structures.
* @param {number} sParamId The sp-parameter id to find the RegExp structures for.
* @returns {[RegExp, RegExp]} The relevant RegExp structures for this parameter id.
*/
Game_Battler.prototype.getRegexBySpParamId = function(sParamId) {
	switch (sParamId) {
		case 0: return [J.NATURAL.RegExp.AggroBuffPlus, J.NATURAL.RegExp.AggroBuffRate];
		case 1: return [J.NATURAL.RegExp.ParryBuffPlus, J.NATURAL.RegExp.ParryBuffRate];
		case 2: return [J.NATURAL.RegExp.HealingBuffPlus, J.NATURAL.RegExp.HealingBuffRate];
		case 3: return [J.NATURAL.RegExp.ItemFxBuffPlus, J.NATURAL.RegExp.ItemFxBuffRate];
		case 4: return [J.NATURAL.RegExp.MagiCostRateBuffPlus, J.NATURAL.RegExp.MagiCostRateBuffRate];
		case 5: return [J.NATURAL.RegExp.TechCostRateBuffPlus, J.NATURAL.RegExp.TechCostRateBuffRate];
		case 6: return [J.NATURAL.RegExp.PhysDmgRateBuffPlus, J.NATURAL.RegExp.PhysDmgRateBuffRate];
		case 7: return [J.NATURAL.RegExp.MagiDmgRateBuffPlus, J.NATURAL.RegExp.MagiDmgRateBuffRate];
		case 8: return [J.NATURAL.RegExp.FloorDmgRateBuffPlus, J.NATURAL.RegExp.FloorDmgRateBuffRate];
		case 9: return [J.NATURAL.RegExp.ExpGainRateBuffPlus, J.NATURAL.RegExp.ExpGainRateBuffRate];
		default: return null;
	}
};
/**
* Gets all natural growths for this base parameter.
* @param {number} paramId The parameter id in question.
* @param {number} baseParam The base parameter.
* @returns {number} The added value of the `baseParam` + `paramBuff` + `paramGrowth`.
*/
Game_Battler.prototype.getParamBaseNaturalBonuses = function(paramId, baseParam) {
	console.warn(`Leveraged a Game_Battler subclass that isn't recognized by this plugin.`, this);
	return 0;
};
/**
* Gets the temporary buff for a given base param for this battler.
* @param {number} paramId The b param id.
* @param {number} baseParam The base value of the parameter in question.
* @returns {number} The calculated buff amount for this parameter.
*/
Game_Battler.prototype.calculateBParamBuff = function(paramId, baseParam) {
	const buffPlus = this.bParamBuffPlus(paramId);
	const buffRate = this.bParamBuffRate(paramId);
	return baseParam * buffRate + buffPlus;
};
/**
* Gets the calculated buff for a given ex-param for this battler.
* @param {number} paramId The ex param id.
* @param {number} baseParam The base value of the parameter in question.
* @returns {number} The calculated buff amount for this parameter.
*/
Game_Battler.prototype.calculateExParamBuff = function(paramId, baseParam) {
	const buffPlus = this.xParamBuffPlus(paramId);
	const buffRate = this.xParamBuffRate(paramId);
	if (!buffPlus && !buffRate) return 0;
	return this.calculatePlusRate(baseParam, buffPlus, buffRate);
};
/**
* Gets the calculated buff for a given sp-param for this battler.
* @param {number} paramId The sp param id.
* @param {number} baseParam The base value of the parameter in question.
* @returns {number} The calculated buff amount for this parameter.
*/
Game_Battler.prototype.calculateSpParamBuff = function(paramId, baseParam) {
	const buffPlus = this.sParamBuffPlus(paramId);
	const buffRate = this.sParamBuffRate(paramId);
	if (!buffPlus && !buffRate) return 0;
	return this.calculatePlusRate(baseParam, buffPlus, buffRate);
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
	const baseParam = this.getBaseMaxTp();
	const baseBonusParam = this.getBaseMaxTpBonuses();
	const maxTpNaturalBonuses = this.maxTpNaturalBonuses();
	return baseParam + baseBonusParam + maxTpNaturalBonuses;
};
/**
* This is exclusively for access to the natural growth values, without the base max tp value added.
* @returns {number}
*/
Game_Battler.prototype.maxTpNaturalBonuses = function() {
	const baseParam = this.getBaseMaxTp();
	const baseBonusParam = this.getBaseMaxTpBonuses();
	const baseMaxTp = baseParam + baseBonusParam;
	return this.getMaxTpNaturalBonuses(baseMaxTp);
};
/**
* Gets all natural bonuses for max tp.
* @param {number} baseParam The base max tp value.
* @returns {number} The natural bonuses applied.
*/
Game_Battler.prototype.getMaxTpNaturalBonuses = function(baseParam) {
	return this.getMaxTpBuff(baseParam);
};
/**
* Retrieves the four regular RegExps governing max tp buffs and growths.
* @returns {[RegExp, RegExp, RegExp, RegExp]} The [buffplus, buffrate, growthplus, growthrate] regex structures.
*/
Game_Battler.prototype.getRegexForMaxTp = function() {
	return [
		J.NATURAL.RegExp.MaxTechBuffPlus,
		J.NATURAL.RegExp.MaxTechBuffRate,
		J.NATURAL.RegExp.MaxTechGrowthPlus,
		J.NATURAL.RegExp.MaxTechGrowthRate
	];
};
/**
* Get the current amount of max tp bonuses added from buffs.
* @param {number} baseParam The base parameter value.
* @returns {number}
*/
Game_Battler.prototype.getMaxTpBuff = function(baseParam) {
	const buffPlus = this.maxTpBuffPlus();
	const buffRate = this.maxTpBuffRate();
	if (!buffPlus && !buffRate) return 0;
	return this.calculatePlusRate(baseParam, buffPlus, buffRate);
};
/**
* Gets the b params growth plus.
* @returns {*} The bParamsGrowthPlus.
*/
Game_Battler.prototype.bParamsGrowthPlus = function() {
	return this._j._natural._bParamsGrowthPlus;
};
/**
* Gets the b params growth rate.
* @returns {*} The bParamsGrowthRate.
*/
Game_Battler.prototype.bParamsGrowthRate = function() {
	return this._j._natural._bParamsGrowthRate;
};
/**
* Gets the b params buff plus.
* @returns {*} The bParamsBuffPlus.
*/
Game_Battler.prototype.bParamsBuffPlus = function() {
	return this._j._natural._bParamsBuffPlus;
};
/**
* Sets the b params buff plus.
* @param {*} newBParamsBuffPlus The new bParamsBuffPlus.
*/
Game_Battler.prototype.setBParamsBuffPlus = function(newBParamsBuffPlus) {
	this._j._natural._bParamsBuffPlus = newBParamsBuffPlus;
};
/**
* Gets the b params buff rate.
* @returns {*} The bParamsBuffRate.
*/
Game_Battler.prototype.bParamsBuffRate = function() {
	return this._j._natural._bParamsBuffRate;
};
/**
* Sets the b params buff rate.
* @param {*} newBParamsBuffRate The new bParamsBuffRate.
*/
Game_Battler.prototype.setBParamsBuffRate = function(newBParamsBuffRate) {
	this._j._natural._bParamsBuffRate = newBParamsBuffRate;
};
/**
* Gets the s params growth plus.
* @returns {*} The sParamsGrowthPlus.
*/
Game_Battler.prototype.sParamsGrowthPlus = function() {
	return this._j._natural._sParamsGrowthPlus;
};
/**
* Gets the s params growth rate.
* @returns {*} The sParamsGrowthRate.
*/
Game_Battler.prototype.sParamsGrowthRate = function() {
	return this._j._natural._sParamsGrowthRate;
};
/**
* Gets the s params buff plus.
* @returns {*} The sParamsBuffPlus.
*/
Game_Battler.prototype.sParamsBuffPlus = function() {
	return this._j._natural._sParamsBuffPlus;
};
/**
* Sets the s params buff plus.
* @param {*} newSParamsBuffPlus The new sParamsBuffPlus.
*/
Game_Battler.prototype.setSParamsBuffPlus = function(newSParamsBuffPlus) {
	this._j._natural._sParamsBuffPlus = newSParamsBuffPlus;
};
/**
* Gets the s params buff rate.
* @returns {*} The sParamsBuffRate.
*/
Game_Battler.prototype.sParamsBuffRate = function() {
	return this._j._natural._sParamsBuffRate;
};
/**
* Sets the s params buff rate.
* @param {*} newSParamsBuffRate The new sParamsBuffRate.
*/
Game_Battler.prototype.setSParamsBuffRate = function(newSParamsBuffRate) {
	this._j._natural._sParamsBuffRate = newSParamsBuffRate;
};
/**
* Gets the x params growth plus.
* @returns {*} The xParamsGrowthPlus.
*/
Game_Battler.prototype.xParamsGrowthPlus = function() {
	return this._j._natural._xParamsGrowthPlus;
};
/**
* Gets the x params growth rate.
* @returns {*} The xParamsGrowthRate.
*/
Game_Battler.prototype.xParamsGrowthRate = function() {
	return this._j._natural._xParamsGrowthRate;
};
/**
* Gets the x params buff plus.
* @returns {*} The xParamsBuffPlus.
*/
Game_Battler.prototype.xParamsBuffPlus = function() {
	return this._j._natural._xParamsBuffPlus;
};
/**
* Sets the x params buff plus.
* @param {*} newXParamsBuffPlus The new xParamsBuffPlus.
*/
Game_Battler.prototype.setXParamsBuffPlus = function(newXParamsBuffPlus) {
	this._j._natural._xParamsBuffPlus = newXParamsBuffPlus;
};
/**
* Gets the x params buff rate.
* @returns {*} The xParamsBuffRate.
*/
Game_Battler.prototype.xParamsBuffRate = function() {
	return this._j._natural._xParamsBuffRate;
};
/**
* Sets the x params buff rate.
* @param {*} newXParamsBuffRate The new xParamsBuffRate.
*/
Game_Battler.prototype.setXParamsBuffRate = function(newXParamsBuffRate) {
	this._j._natural._xParamsBuffRate = newXParamsBuffRate;
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
* Gets all natural bonuses for max tp.
* Actors have growths as well as buffs.
* @param {number} baseParam The base max tp value.
* @returns {number} The natural bonuses applied.
*/
Game_Actor.prototype.getMaxTpNaturalBonuses = function(baseParam) {
	const maxTpBuff = this.getMaxTpBuff(baseParam);
	const maxTpGrowth = this.getMaxTpGrowth(baseParam);
	return maxTpBuff + maxTpGrowth;
};
/**
* Gets the current amount of max tp bonuses added from growths.
* @param {number} baseParam The base parameter value.
* @returns {number}
*/
Game_Actor.prototype.getMaxTpGrowth = function(baseParam) {
	const growthPlus = this.maxTpGrowthPlus();
	const growthRate = this.maxTpGrowthRate();
	if (!growthPlus && !growthRate) return 0;
	return this.calculatePlusRate(baseParam, growthPlus, growthRate);
};
/**
* Extends the `har` getter — already buff-inclusive from {@link Game_Battler} —
* to also layer in permanent growth. Actors are the only battler type that
* accrues growth, so this override lives here rather than on Game_Battler.
*/
J.NATURAL.Aliased.Game_Actor.set("har", Object.getOwnPropertyDescriptor(Game_Battler.prototype, "har").get);
Object.defineProperty(Game_Actor.prototype, "har", {
	get: function() {
		const baseParam = J.NATURAL.Aliased.Game_Actor.get("har").call(this);
		return baseParam + this.getHarGrowth(baseParam);
	},
	configurable: true
});
/**
* Gets the current amount of HAR bonuses added from growths.
* @param {number} baseParam The base parameter value.
* @returns {number}
*/
Game_Actor.prototype.getHarGrowth = function(baseParam) {
	const growthPlus = this.harGrowthPlus();
	const growthRate = this.harGrowthRate();
	if (!growthPlus && !growthRate) return 0;
	return this.calculatePlusRate(baseParam, growthPlus, growthRate);
};
/**
* Extends `.paramBase()` to include any additional growth bonuses as part of the base.
*/
J.NATURAL.Aliased.Game_Actor.set("paramBase", Game_Actor.prototype.paramBase);
Game_Actor.prototype.paramBase = function(paramId) {
	const baseParam = J.NATURAL.Aliased.Game_Actor.get("paramBase").call(this, paramId);
	const paramBaseNaturalBonuses = this.paramBaseNaturalBonuses(paramId);
	return baseParam + paramBaseNaturalBonuses;
};
/**
* This is exclusively for access to the natural growth values, without the base parameter value added.
* @param {number} paramId The parameter id in question.
* @returns {number}
*/
Game_Actor.prototype.paramBaseNaturalBonuses = function(paramId) {
	const structures = this.getRegexByParamId(paramId);
	if (!structures) return 0;
	const baseParam = J.NATURAL.Aliased.Game_Actor.get("paramBase").call(this, paramId);
	const paramNaturalBonuses = this.getParamBaseNaturalBonuses(paramId, baseParam);
	return paramNaturalBonuses;
};
/**
* Gets all natural growths for this base parameter.
* @param {number} paramId The parameter id in question.
* @param {number} baseParam The base parameter.
* @returns {number} The added value of the `baseParam` + `paramBuff` + `paramGrowth`.
*/
Game_Actor.prototype.getParamBaseNaturalBonuses = function(paramId, baseParam) {
	const paramBuff = this.calculateBParamBuff(paramId, baseParam);
	const paramGrowth = this.getBparamGrowth(paramId, baseParam);
	return paramBuff + paramGrowth;
};
/**
* Gets the permanent growth for a given base parameter based on the provided id.
* @param {number} paramId The parameter id to get the growth for.
* @param {number} baseParam The current value of the given parameter for rate multipliers.
* @returns {number} The calculated growth amount for this parameter.
*/
Game_Actor.prototype.getBparamGrowth = function(paramId, baseParam) {
	const growthPlus = this.bParamGrowthPlus(paramId);
	const growthRate = this.bParamGrowthRate(paramId);
	if (!growthPlus && !growthRate) return 0;
	return this.calculatePlusRate(baseParam, growthPlus, growthRate);
};
/**
* Extends `.xparam()` to include any additional growth bonuses.
*/
J.NATURAL.Aliased.Game_Actor.set("xparam", Game_Actor.prototype.xparam);
Game_Actor.prototype.xparam = function(xparamId) {
	const baseParam = J.NATURAL.Aliased.Game_Actor.get("xparam").call(this, xparamId);
	const xparamNaturalBonuses = this.xparamNaturalBonuses(xparamId);
	return baseParam + xparamNaturalBonuses;
};
/**
* This is exclusively for access to the natural growth values, without the ex-parameter value added.
* @param {number} xparamId The parameter id in question.
* @returns {number}
*/
Game_Actor.prototype.xparamNaturalBonuses = function(xparamId) {
	const structures = this.getRegexByExParamId(xparamId);
	if (!structures) return 0;
	const baseParam = J.NATURAL.Aliased.Game_Actor.get("xparam").call(this, xparamId);
	return this.getXparamNaturalBonuses(xparamId, baseParam);
};
/**
* Gets all natural growths for this ex-parameter.
* @param {number} xparamId The parameter id in question.
* @param {number} baseParam The base parameter.
* @returns {number} The added value of the `baseParam` + `paramBuff` + `paramGrowth`.
*/
Game_Actor.prototype.getXparamNaturalBonuses = function(xparamId, baseParam) {
	const paramBuff = this.calculateExParamBuff(xparamId, baseParam);
	const paramGrowth = this.getXparamGrowth(xparamId, baseParam) / 100;
	return paramBuff + paramGrowth;
};
/**
* Gets the permanent growth for a given ex-parameter based on the provided id.
* @param {number} paramId The parameter id to get the growth for.
* @param {number} baseParam The current value of the given parameter for rate multipliers.
* @returns {number} The calculated growth amount for this parameter.
*/
Game_Actor.prototype.getXparamGrowth = function(paramId, baseParam) {
	const growthPlus = this.xParamGrowthPlus(paramId);
	const growthRate = this.xParamGrowthRate(paramId);
	if (!growthPlus && !growthRate) return 0;
	return this.calculatePlusRate(baseParam, growthPlus, growthRate);
};
/**
* Extends `.sparam()` to include any additional growth bonuses.
*/
J.NATURAL.Aliased.Game_Actor.set("sparam", Game_Actor.prototype.sparam);
Game_Actor.prototype.sparam = function(sparamId) {
	const baseParam = J.NATURAL.Aliased.Game_Actor.get("sparam").call(this, sparamId);
	const sparamNaturalBonuses = this.sparamNaturalBonuses(sparamId);
	return baseParam + sparamNaturalBonuses;
};
/**
* This is exclusively for access to the natural growth values, without the sp-parameter value added.
* @param {number} sparamId The parameter id in question.
* @returns {number}
*/
Game_Actor.prototype.sparamNaturalBonuses = function(sparamId) {
	const baseParam = J.NATURAL.Aliased.Game_Actor.get("sparam").call(this, sparamId);
	const structures = this.getRegexBySpParamId(sparamId);
	if (!structures) return 0;
	const sparamNaturalBonuses = this.getSparamNaturalBonuses(sparamId, baseParam);
	return sparamNaturalBonuses;
};
/**
* Gets all natural growths for this sp-parameter.
* Actors have buffs and growths.
* @param {number} sparamId The parameter id in question.
* @param {number} baseParam The base parameter.
* @returns {number} The added value of the `baseParam` + `paramBuff` + `paramGrowth`.
*/
Game_Actor.prototype.getSparamNaturalBonuses = function(sparamId, baseParam) {
	const paramBuff = this.calculateSpParamBuff(sparamId, baseParam);
	const paramGrowth = this.getSparamGrowth(sparamId, baseParam) / 100;
	return paramBuff + paramGrowth;
};
/**
* Gets the permanent growth for a given sp-parameter based on the provided id.
* @param {number} paramId The parameter id to get the growth for.
* @param {number} baseParam The current value of the given parameter for rate multipliers.
* @returns {number} The calculated growth amount for this parameter.
*/
Game_Actor.prototype.getSparamGrowth = function(paramId, baseParam) {
	const growthPlus = this.sParamGrowthPlus(paramId);
	const growthRate = this.sParamGrowthRate(paramId);
	if (!growthPlus && !growthRate) return 0;
	return this.calculatePlusRate(baseParam, growthPlus, growthRate);
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
* Applies all natural growths applied to this actor at the present moment.
*/
Game_Actor.prototype.applyNaturalGrowths = function() {
	this.applyNaturalMaxTpGrowths();
	this.applyNaturalBparamGrowths();
	this.applyNaturalXparamGrowths();
	this.applyNaturalSparamGrowths();
	this.applyNaturalCustomGrowths();
};
/**
* Applies the growths for max tp.
*/
Game_Actor.prototype.applyNaturalMaxTpGrowths = function() {
	const [, , growthPlusStructure, growthRateStructure] = this.getRegexForMaxTp();
	const baseMaxTp = this.getBaseMaxTp();
	const growthPlus = this.naturalParamBuff(growthPlusStructure, baseMaxTp);
	this.modMaxTpGrowthPlus(growthPlus);
	const growthRate = this.naturalParamBuff(growthRateStructure, baseMaxTp);
	this.modMaxTpGrowthRate(growthRate);
};
/**
* Applies the growths for base parameters.
*/
Game_Actor.prototype.applyNaturalBparamGrowths = function() {
	const paramIds = Game_BattlerBase.knownBaseParameterIds();
	paramIds.forEach((paramId) => {
		const [plusStructure, rateStructure] = this.getGrowthRegexByBparamId(paramId);
		const baseParam = J.NATURAL.Aliased.Game_Actor.get("paramBase").call(this, paramId);
		const growthPlus = this.naturalParamBuff(plusStructure, baseParam);
		this.modBparamGrowthPlus(paramId, growthPlus);
		const growthRate = this.naturalParamBuff(rateStructure, baseParam);
		this.modBparamGrowthRate(paramId, growthRate);
	}, this);
};
/**
* Translates a base parameter id into its corresponding RegExp growth plus and rate structures.
* @param {number} paramId The parameter id to find the RegExp structures for.
* @returns {[RegExp, RegExp]} The relevant RegExp structures for this parameter id.
*/
Game_Actor.prototype.getGrowthRegexByBparamId = function(paramId) {
	switch (paramId) {
		case 0: return [J.NATURAL.RegExp.MaxLifeGrowthPlus, J.NATURAL.RegExp.MaxLifeGrowthRate];
		case 1: return [J.NATURAL.RegExp.MaxMagiGrowthPlus, J.NATURAL.RegExp.MaxMagiGrowthRate];
		case 2: return [J.NATURAL.RegExp.PowerGrowthPlus, J.NATURAL.RegExp.PowerGrowthRate];
		case 3: return [J.NATURAL.RegExp.DefenseGrowthPlus, J.NATURAL.RegExp.DefenseGrowthRate];
		case 4: return [J.NATURAL.RegExp.ForceGrowthPlus, J.NATURAL.RegExp.ForceGrowthRate];
		case 5: return [J.NATURAL.RegExp.ResistGrowthPlus, J.NATURAL.RegExp.ResistGrowthRate];
		case 6: return [J.NATURAL.RegExp.SpeedGrowthPlus, J.NATURAL.RegExp.SpeedGrowthRate];
		case 7: return [J.NATURAL.RegExp.LuckGrowthPlus, J.NATURAL.RegExp.LuckGrowthRate];
		default: return null;
	}
};
/**
* Applies the growths for ex-parameters.
*/
Game_Actor.prototype.applyNaturalXparamGrowths = function() {
	const paramIds = Game_BattlerBase.knownExParameterIds();
	paramIds.forEach((paramId) => {
		const [plusStructure, rateStructure] = this.getGrowthRegexByXparamId(paramId);
		const baseParam = J.NATURAL.Aliased.Game_Actor.get("xparam").call(this, paramId);
		const growthPlus = this.naturalParamBuff(plusStructure, baseParam) / 100;
		this.modXparamGrowthPlus(paramId, growthPlus);
		const growthRate = this.naturalParamBuff(rateStructure, baseParam);
		this.modXparamGrowthRate(paramId, growthRate);
	}, this);
};
/**
* Translates a ex-parameter id into its corresponding RegExp growth plus and rate structures.
* @param {number} xparamId The parameter id to find the RegExp structures for.
* @returns {[RegExp, RegExp]} The relevant RegExp structures for this parameter id.
*/
Game_Actor.prototype.getGrowthRegexByXparamId = function(xparamId) {
	switch (xparamId) {
		case 0: return [J.NATURAL.RegExp.HitGrowthPlus, J.NATURAL.RegExp.HitGrowthRate];
		case 1: return [J.NATURAL.RegExp.EvadeGrowthPlus, J.NATURAL.RegExp.EvadeGrowthRate];
		case 2: return [J.NATURAL.RegExp.CritChanceGrowthPlus, J.NATURAL.RegExp.CritChanceGrowthRate];
		case 3: return [J.NATURAL.RegExp.CritEvadeGrowthPlus, J.NATURAL.RegExp.CritEvadeGrowthRate];
		case 4: return [J.NATURAL.RegExp.MagiEvadeGrowthPlus, J.NATURAL.RegExp.MagiEvadeGrowthRate];
		case 5: return [J.NATURAL.RegExp.MagiReflectGrowthPlus, J.NATURAL.RegExp.MagiReflectGrowthRate];
		case 6: return [J.NATURAL.RegExp.CounterGrowthPlus, J.NATURAL.RegExp.CounterGrowthRate];
		case 7: return [J.NATURAL.RegExp.LifeRegenGrowthPlus, J.NATURAL.RegExp.LifeRegenGrowthRate];
		case 8: return [J.NATURAL.RegExp.MagiRegenGrowthPlus, J.NATURAL.RegExp.MagiRegenGrowthRate];
		case 9: return [J.NATURAL.RegExp.TechRegenGrowthPlus, J.NATURAL.RegExp.TechRegenGrowthRate];
		default: return null;
	}
};
/**
* Applies the growths for sp-parameters.
*/
Game_Actor.prototype.applyNaturalSparamGrowths = function() {
	const paramIds = Game_BattlerBase.knownSpParameterIds();
	paramIds.forEach((paramId) => {
		const [plusStructure, rateStructure] = this.getGrowthRegexBySparamId(paramId);
		const baseParam = J.NATURAL.Aliased.Game_Actor.get("sparam").call(this, paramId);
		const growthPlus = this.naturalParamBuff(plusStructure, baseParam) / 100;
		this.modSparamGrowthPlus(paramId, growthPlus);
		const growthRate = this.naturalParamBuff(rateStructure, baseParam);
		this.modSparamGrowthRate(paramId, growthRate);
	}, this);
};
/**
* Translates a sp-parameter id into its corresponding RegExp growth plus and rate structures.
* @param {number} sparamId The parameter id to find the RegExp structures for.
* @returns {[RegExp, RegExp]} The relevant RegExp structures for this parameter id.
*/
Game_Actor.prototype.getGrowthRegexBySparamId = function(sparamId) {
	switch (sparamId) {
		case 0: return [J.NATURAL.RegExp.AggroGrowthPlus, J.NATURAL.RegExp.AggroGrowthRate];
		case 1: return [J.NATURAL.RegExp.ParryGrowthPlus, J.NATURAL.RegExp.ParryGrowthRate];
		case 2: return [J.NATURAL.RegExp.HealingGrowthPlus, J.NATURAL.RegExp.HealingGrowthRate];
		case 3: return [J.NATURAL.RegExp.ItemFxGrowthPlus, J.NATURAL.RegExp.ItemFxGrowthRate];
		case 4: return [J.NATURAL.RegExp.MagiCostRateGrowthPlus, J.NATURAL.RegExp.MagiCostRateGrowthRate];
		case 5: return [J.NATURAL.RegExp.TechCostRateGrowthPlus, J.NATURAL.RegExp.TechCostRateGrowthRate];
		case 6: return [J.NATURAL.RegExp.PhysDmgRateGrowthPlus, J.NATURAL.RegExp.PhysDmgRateGrowthRate];
		case 7: return [J.NATURAL.RegExp.MagiDmgRateGrowthPlus, J.NATURAL.RegExp.MagiDmgRateGrowthRate];
		case 8: return [J.NATURAL.RegExp.FloorDmgRateGrowthPlus, J.NATURAL.RegExp.FloorDmgRateGrowthRate];
		case 9: return [J.NATURAL.RegExp.ExpGainRateGrowthPlus, J.NATURAL.RegExp.ExpGainRateGrowthRate];
		default: return null;
	}
};
/**
* A hook for applying additional custom growths that aren't native to RMMZ.
*/
Game_Actor.prototype.applyNaturalCustomGrowths = function() {
	this.applyNaturalHarGrowths();
};
/**
* Applies the growths for HAR.
*/
Game_Actor.prototype.applyNaturalHarGrowths = function() {
	const [, , growthPlusStructure, growthRateStructure] = this.getRegexForHar();
	const baseHar = this.baseHarFactor() + (this.getSdpBonusForParameterKey ? this.getSdpBonusForParameterKey("har", 1) : 0);
	const growthPlus = this.naturalParamBuff(growthPlusStructure, baseHar);
	this.modHarGrowthPlus(growthPlus);
	const growthRate = this.naturalParamBuff(growthRateStructure, baseHar);
	this.modHarGrowthRate(growthRate);
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
* Extends `.paramBase()` to include any additional growth bonuses as part of the base.
*/
J.NATURAL.Aliased.Game_Enemy.set("paramBase", Game_Enemy.prototype.paramBase);
Game_Enemy.prototype.paramBase = function(paramId) {
	const baseParam = J.NATURAL.Aliased.Game_Enemy.get("paramBase").call(this, paramId);
	const paramBaseNaturalBonuses = this.paramBaseNaturalBonuses(paramId);
	return baseParam + paramBaseNaturalBonuses;
};
/**
* This is exclusively for access to the natural growth values, without the base parameter value added.
* @param {number} paramId The parameter id in question.
* @returns {number}
*/
Game_Enemy.prototype.paramBaseNaturalBonuses = function(paramId) {
	const structures = this.getRegexByParamId(paramId);
	if (!structures) return 0;
	const baseParam = J.NATURAL.Aliased.Game_Enemy.get("paramBase").call(this, paramId);
	const paramNaturalBonuses = this.getParamBaseNaturalBonuses(paramId, baseParam);
	return paramNaturalBonuses;
};
/**
* Gets all natural growths for this base parameter.
* Enemies only have buffs.
* @param {number} paramId The parameter id in question.
* @param {number} baseParam The base parameter.
* @returns {number} The added value of the `baseParam` + `paramBuff` + `paramGrowth`.
*/
Game_Enemy.prototype.getParamBaseNaturalBonuses = function(paramId, baseParam) {
	return this.calculateBParamBuff(paramId, baseParam);
};
/**
* Extends `.xparam()` to include any additional growth bonuses.
*/
J.NATURAL.Aliased.Game_Enemy.set("xparam", Game_Enemy.prototype.xparam);
Game_Enemy.prototype.xparam = function(xparamId) {
	const baseParam = J.NATURAL.Aliased.Game_Enemy.get("xparam").call(this, xparamId);
	const xparamNaturalBonuses = this.xparamNaturalBonuses(xparamId);
	return baseParam + xparamNaturalBonuses;
};
/**
* This is exclusively for access to the natural growth values, without the ex-parameter value added.
* @param {number} xparamId The parameter id in question.
* @returns {number}
*/
Game_Enemy.prototype.xparamNaturalBonuses = function(xparamId) {
	const baseParam = J.NATURAL.Aliased.Game_Enemy.get("xparam").call(this, xparamId);
	const structures = this.getRegexByExParamId(xparamId);
	if (!structures) return 0;
	return this.getXparamNaturalBonuses(xparamId, baseParam);
};
/**
* Gets all natural growths for this ex-parameter.
* @param {number} xparamId The parameter id in question.
* @param {number} baseParam The base parameter.
* @returns {number} The added value of the `baseParam` + `paramBuff` + `paramGrowth`.
*/
Game_Enemy.prototype.getXparamNaturalBonuses = function(xparamId, baseParam) {
	return this.calculateExParamBuff(xparamId, baseParam);
};
/**
* Extends `.sparam()` to include any additional growth bonuses.
*/
J.NATURAL.Aliased.Game_Enemy.set("sparam", Game_Enemy.prototype.sparam);
Game_Enemy.prototype.sparam = function(sparamId) {
	const baseParam = J.NATURAL.Aliased.Game_Enemy.get("sparam").call(this, sparamId);
	const sparamNaturalBonuses = this.sparamNaturalBonuses(sparamId);
	return baseParam + sparamNaturalBonuses;
};
/**
* This is exclusively for access to the natural growth values, without the sp-parameter value added.
* @param {number} sparamId The parameter id in question.
* @returns {number}
*/
Game_Enemy.prototype.sparamNaturalBonuses = function(sparamId) {
	const baseParam = J.NATURAL.Aliased.Game_Enemy.get("sparam").call(this, sparamId);
	const structures = this.getRegexBySpParamId(sparamId);
	if (!structures) return 0;
	return this.getSparamNaturalBonuses(sparamId, baseParam);
};
/**
* Gets all natural growths for this sp-parameter.
* Enemies only have buffs.
* @param {number} sparamId The parameter id in question.
* @param {number} baseParam The base parameter.
* @returns {number} The added value of the `baseParam` + `paramBuff` + `paramGrowth`.
*/
Game_Enemy.prototype.getSparamNaturalBonuses = function(sparamId, baseParam) {
	return this.calculateSpParamBuff(sparamId, baseParam);
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
//# sourceMappingURL=J-NaturalGrowth.js.map