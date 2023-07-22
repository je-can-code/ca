//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v2.0.1 NATURAL] Enables level-based growth of all parameters.
 * @author JE
 * @url https://github.com/je-can-code/ca
 * @base J-Base
 * @help
 * ============================================================================
 * OVERVIEW:
 * This plugin enables "Natural Growth", aka formulaic parameter growth, for
 * battlers. This "Natural Growth" enables temporary/permanent stat growth while
 * various tags are applied.
 *
 * Integrates with others of mine plugins:
 * - J-CriticalFactors; enables natural growths of CDM/CDR.
 * - J-Passives; updates with relic gain as well.
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
 *  values combined.
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
 * - trg (targeting rate)
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
 *
 * ============================================================================
 * CHANGELOG:
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