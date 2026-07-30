//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.1.0 CMS_K] A redesign of the skill menu.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @orderAfter J-Base
 * @help
 * ============================================================================
 * This is a redesign of the skill menu.
 * It includes the ability to see more parameters when inspecting skills.
 *
 * Will reveal various JABS data points.
 * ============================================================================
 * NOTE ABOUT NOTETAGS:
 * This plugin has no notetags of its own- it is purely a scene/window
 * redesign of the native skill menu. Cost display data is read via the
 * consuming plugins' own getters (e.g. J-Resources), not tags belonging to
 * this plugin.
 * ============================================================================
 * CHANGELOG:
 * - 1.1.0
 *    Fixed long related-skill names overlapping the fixed-position
 *    required/current proficiency values; names now truncate with an
 *    ellipsis to fit the available column width.
 *    Migrated HP/MP/TP cost labels from TextManager.longParam(id) to the
 *    parameter catalog's parameterLabel('hcr'/'mcr'/'tcr').
 *    Replaced eval() with new Function() in the raw-damage preview.
 * - 1.0.1
 *    Added HP skill cost display to the skill detail window (requires J-Resources).
 *    Updated MP/TP cost display to reflect tag-based extra costs from J-Resources.
 * - 1.0.0
 *    Initial release.
 * ============================================================================
 */

//#region src/plugins/cms/ext/skill/_metadata/_pluginMetadata.js
var J_CmsSkill_PluginMetadata = class extends PluginMetadata {
	/**
	* Constructor.
	* @param {string} name The plugin name.
	* @param {string} version The plugin version.
	*/
	constructor(name, version) {
		super(name, version);
	}
};

//#endregion
//#region src/plugins/cms/ext/skill/_metadata/initialization.js
/**
* The core where all of my extensions live: in the `J` object.
*/
globalThis.J ||= {};
(() => {
	const requiredBaseVersion = "3.2.0";
	const hasBaseRequirement = J.BASE.Helpers.satisfies(J.BASE.Metadata.Version, requiredBaseVersion);
	if (hasBaseRequirement === false) {
		throw new Error(`Either missing J-Base or has a lower version than the required: ${requiredBaseVersion}`);
	}
})();
/**
* The plugin umbrella that governs all things related to this plugin.
*/
J.CMS_K = {};
/**
* The `metadata` associated with this plugin, such as version.
*/
J.CMS_K.Metadata = new J_CmsSkill_PluginMetadata("J-CMS-Skill", "1.1.0");
J.CMS_K.Aliased = {
	Scene_Skill: new Map(),
	Window_SkillList: new Map(),
	Window_EquipSlot: new Map()
};

//#endregion
//#region src/plugins/cms/ext/skill/_models/JCMS_ParameterKvp.js
/**
* A class representing a single key-value pair, with an optional long id.
* This is used for storing table-like data related to actors and skills.
*/
var JCMS_ParameterKvp = class {
	constructor(name, value = null, colorId = 0) {
		/**
		* The name of the parameter.
		* @type {string}
		*/
		this._name = name;
		/**
		* The value of the parameter.
		* @type {string|number|null}
		*/
		this._value = value;
		/**
		* The id of the color for this parameter when drawing.
		* @type {number|null}
		*/
		this._colorId = colorId;
	}
	/**
	* Gets the name of the parameter.
	* @returns {string}
	*/
	name() {
		return this._name;
	}
	/**
	* Gets the value of the parameter associated with this
	* @returns
	*/
	value() {
		return this._value;
	}
	/**
	* Gets the provided color of this parameter.
	* @returns {string}
	*/
	color() {
		return this._colorId;
	}
};

//#endregion
//#region src/plugins/cms/ext/skill/windows/Window_SkillDetail.js
/**
* A window responsible for showing various datapoints of a skill.
*/
var Window_SkillDetail = class extends Window_Base {
	constructor(rect) {
		super(rect);
		this.initMembers();
	}
	initMembers() {
		/**
		* The skill id this window is currently presenting data for.
		* @type {number}
		*/
		this._skillId = null;
		/**
		* The sprites for this skill.
		* @type {Map<string, Sprite>}
		*/
		this._skillSprites = new Map();
		/**
		* The actor who owns the skill of this skill.
		* @type {Game_Actor}
		*/
		this._actor = null;
		this.refresh();
	}
	/**
	* Gets the skill id.
	* @returns {number} The skillId.
	*/
	skillId() {
		return this._skillId;
	}
	/**
	* Gets the actor.
	* @returns {Game_Actor} The actor.
	*/
	actor() {
		return this._actor;
	}
	/**
	* Gets the skill sprites.
	* @returns {Map<string, Sprite>} The skillSprites.
	*/
	skillSprites() {
		return this._skillSprites;
	}
	/**
	* Sets the skill id of the window to this and refreshes the data.
	* @param {number} newSkillId The new skill id for this window.
	*/
	setSkillId(newSkillId) {
		this._skillId = newSkillId;
		if (this._skillId < 1) {
			this._skillId = 0;
			this.clear();
		} else {
			this.refresh();
		}
	}
	/**
	* Gets the skill currently being worked with.
	* @returns {RPG_Skill|null}
	*/
	skill() {
		if (!this.skillId()) {
			return null;
		} else {
			if (J.EXTEND && this.actor()) {
				return this.actor().skill(this.skillId());
			}
			return $dataSkills[this.skillId()];
		}
	}
	/**
	* Sets the actor to be the actor owning the window.
	* @param {Game_Actor} newActor The actor.
	*/
	setActor(newActor) {
		this._actor = newActor;
		this.refresh();
	}
	/**
	* Empties the window.
	*/
	clear() {
		this.contents.clear();
		this.clearSkillImages();
	}
	/**
	* Hides all skill images available.
	*/
	clearSkillImages() {
		this.skillSprites().forEach((sprite) => {
			sprite.hide();
		});
	}
	/**
	* Clears and redraws all contents of this window.
	*/
	refresh() {
		this.clear();
		this.drawContents();
	}
	/**
	* Draws all contents of this window.
	*/
	drawContents() {
		if (!this.skill()) return;
		this.drawHeader();
		this.drawSkillLogo();
		this.drawLeftColumn();
		this.drawMiddleColumn();
		this.drawRightColumn();
	}
	/**
	* Draws the header component of this window.
	*/
	drawHeader() {
		this.resetFontSettings();
		this.contents.fontSize += 12;
		this.toggleBold();
		this.drawText(this.skill().name, 0, 0, this.width);
		this.resetFontSettings();
	}
	/**
	* Places the 4x scaled-up skill icon (logo) onto the window.
	*/
	drawSkillLogo() {
		this.placeSkillIcon(0, this.skill());
	}
	/**
	* Places the corresponding skill icon image.
	* @param {number} x The `x` coordinate.
	* @param {RPG_Skill} skill The skill to draw this for.
	*/
	placeSkillIcon(x, skill) {
		const key = `skill-${skill.id}-icon-image`;
		const sprite = this.createIconSprite(key, skill.iconIndex);
		const y = this.height - sprite.height * (sprite.scale.x + 1);
		sprite.move(x, y);
		sprite.show();
	}
	/**
	* Generates the state icon sprite representing an afflicted state.
	* @param {string} key The key of this sprite.
	* @param {number} iconIndex The icon index of this sprite.
	*/
	createIconSprite(key, iconIndex) {
		let sprite = this.skillSprites().get(key);
		if (sprite) {
			return sprite;
		} else {
			sprite = new Sprite_Icon(iconIndex);
			sprite.scale.x = 4;
			sprite.scale.y = 4;
			this.skillSprites().set(key, sprite);
			this.addInnerChild(sprite);
			return sprite;
		}
	}
	/**
	* Draws the left column, which mostly includes skill costs.
	*/
	drawLeftColumn() {
		const skill = this.skill();
		const actor = this.actor();
		const params = [];
		params.push(this.makeSkillTypeParam(skill));
		params.push(this.makeDividerParam());
		if (J.RESOURCES) {
			params.push(this.makeHpCostParam(skill, actor));
		}
		params.push(this.makeMpCostParam(skill, actor));
		params.push(this.makeTpCostParam(skill, actor));
		const col = Math.floor(this.innerWidth / 3);
		const ox = 4;
		const oy = 60;
		const lh = this.lineHeight();
		const nameWidth = Math.floor(col * .42);
		const valueOffset = Math.floor(col * .44);
		const valueWidth = col - valueOffset - 4;
		params.forEach((param, index) => {
			this.resetTextColor();
			this.changeTextColor(param.color());
			this.drawText(`${param.name()}`, ox, oy + lh * index, nameWidth);
			if (param.value() !== null) {
				this.drawText(`${param.value()}`, ox + valueOffset, oy + lh * index, valueWidth);
			}
		});
	}
	/**
	* Draws the middle column, which contains various data points from the skill.
	*/
	drawMiddleColumn() {
		const skill = this.skill();
		const actor = this.actor();
		const params = [];
		params.push(this.makeProjectedDamageParam(skill, actor));
		params.push(this.makeHitsParam(skill, actor));
		params.push(this.makeDividerParam());
		params.push(...this.makeAttackStates(skill, actor));
		const col = Math.floor(this.innerWidth / 3);
		const ox = col + 4;
		const oy = 60;
		const lh = this.lineHeight();
		const nameWidth = Math.floor(col * .44);
		const valueOffset = Math.floor(col * .46);
		const valueWidth = col - valueOffset - 4;
		params.forEach((param, index) => {
			this.resetTextColor();
			this.changeTextColor(param.color());
			this.drawTextEx(`${param.name()}`, ox, oy + lh * index, nameWidth);
			if (param.value() !== null) {
				this.drawTextEx(`${param.value()}`, ox + valueOffset, oy + lh * index, valueWidth);
			}
		});
	}
	/**
	* Calculates the projected damage to build a parameter.
	*
	* If the skill lacks a formula, it won't try to project.
	* @param {RPG_Skill} skill The skill.
	* @param {Game_Actor} actor The actor.
	* @returns {JCMS_ParameterKvp}
	*/
	makeProjectedDamageParam(skill, actor) {
		if (skill.damage.type === 0) {
			return new JCMS_ParameterKvp(`\\C[8]Raw Damage\\C[0]`, "n/a");
		}
		const a = actor;
		const b = $gameEnemies.enemy(1);
		const v = $gameVariables._data;
		let p = 0;
		if (J.PROF) {
			const skillProficiency = actor.skillProficiencyBySkillId(skill.id);
			if (skillProficiency) {
				p = skillProficiency.proficiency;
			}
		}
		const sign = [3, 4].includes(skill.damage.type) ? -1 : 1;
		const value = Math.round(Math.max(new Function("a", "b", "v", "p", `return (${skill.damage.formula})`)(a, b, v, p), 0));
		const potential = isNaN(value) ? 0 : value;
		const color = sign > 0 ? 10 : 24;
		return new JCMS_ParameterKvp(`\\C[${color}]Raw Damage\\C[0]`, potential);
	}
	/**
	* Combines the total number of possible hits this skill can hit a foe.
	* @param {RPG_Skill} skill The skill.
	* @param {Game_Actor} actor The actor.
	* @returns {JCMS_ParameterKvp}
	*/
	makeHitsParam(skill, actor) {
		const value = skill.repeats - 1 + skill.jabsPierceCount;
		return new JCMS_ParameterKvp("Max Possible Hits", `x${value}`, ColorManager.textColor(0));
	}
	/**
	* Gets all the states and their chances of application for this skill.
	* @param {RPG_Skill} skill The skill.
	* @param {Game_Actor} actor The actor.
	* @returns {JCMS_ParameterKvp[]}
	*/
	makeAttackStates(skill, actor) {
		const stateEffects = skill.effects.filter((effect) => effect.code === 21);
		if (!stateEffects.length) return [];
		const attackStateParams = [];
		attackStateParams.push(new JCMS_ParameterKvp(`\\C[17]Applies States\\C[0]`, `\\C[1]\\}CHANCE\\{\\C[0]`));
		stateEffects.forEach((effect) => {
			const name = `\\State[${effect.dataId}]`;
			const chance = `${Math.round(effect.value1 * 100)}%`;
			attackStateParams.push(new JCMS_ParameterKvp(name, chance));
		});
		return attackStateParams;
	}
	/**
	* Draws the right column for proficiency and elements.
	*/
	drawRightColumn() {
		const skill = this.skill();
		const actor = this.actor();
		/** @type {JCMS_ParameterKvp[]} */
		const params = [];
		const col = Math.floor(this.innerWidth / 3);
		const nameWidth = Math.floor(col * .55);
		if (J.PROF) {
			params.push(...this.makeSkillProficiency(actor, skill, nameWidth));
		}
		params.push(...this.makeAttackElementsList(skill, actor));
		const ox = col * 2 + 4;
		const oy = 0;
		const lh = this.lineHeight();
		const valueOffset = Math.floor(col * .57);
		const valueWidth = col - valueOffset - 4;
		params.forEach((param, index) => {
			this.drawTextEx(`${param.name()}`, ox, oy + lh * index, param.value() !== null ? nameWidth : col - 8);
			if (param.value() !== null) {
				this.drawTextEx(`${param.value()}`, ox + valueOffset, oy + lh * index, valueWidth);
			}
		});
	}
	/**
	* Makes a parameter that displays this actor's proficiency with this skill.
	* @param {Game_Actor} actor The actor.
	* @param {RPG_Skill} skill The skill.
	* @param {number} nameWidth The pixel width available for the name column, used to keep
	* long related-skill names from overlapping the fixed-position required/current values.
	* @returns {JCMS_ParameterKvp[]}
	*/
	makeSkillProficiency(actor, skill, nameWidth) {
		const proficiencyParams = [];
		const skillProficiency = actor.tryGetSkillProficiencyBySkillId(skill.id);
		const proficiencyKey = "\\C[21]Proficiency:\\C[0]";
		const proficiencyValue = `${skillProficiency.proficiency}`;
		const proficiencyParam = new JCMS_ParameterKvp(proficiencyKey, proficiencyValue);
		proficiencyParams.push(proficiencyParam);
		proficiencyParams.push(...this.makeRelatedProficiencyConditionals(actor, skill, nameWidth));
		proficiencyParams.push(this.makeDividerParam());
		return proficiencyParams;
	}
	/**
	* Makes a parameter that displays this actor's proficiency with this skill.
	* @param {Game_Actor} actor The actor.
	* @param {RPG_Skill} skill The skill.
	* @param {number} nameWidth The pixel width available for the name column, used to keep
	* long related-skill names from overlapping the fixed-position required/current values.
	* @returns {JCMS_ParameterKvp[]}
	*/
	makeRelatedProficiencyConditionals(actor, skill, nameWidth) {
		const conditionals = actor.proficiencyConditionalBySkillId(skill.id);
		const params = [];
		const iconAllowance = (ImageManager.standardIconWidth + 4) * 2;
		const availableNameTextWidth = nameWidth - iconAllowance;
		conditionals.forEach((conditional) => {
			if (!conditional.skillRewards.length) return;
			conditional.skillRewards.forEach((skillRewardId) => {
				if (!skillRewardId) {
					console.warn(conditional);
					console.log(skillRewardId, "not a valid skill reward.");
					return;
				}
				const proficiencyRequirement = conditional.requirements.find((requirement) => requirement.skillId === skill.id);
				const actorKnowsSkill = actor.isLearnedSkill(skillRewardId);
				const extendedSkill = actor.skill(skillRewardId);
				const learnedIcon = actorKnowsSkill ? 91 : 90;
				const truncatedName = this.truncateToWidth(extendedSkill.name, availableNameTextWidth);
				const name = `\\I[${learnedIcon}]\\I[${extendedSkill.iconIndex}]${truncatedName}`;
				const currentProficiency = proficiencyRequirement.totalProficiency(actor);
				const requiredProficiency = proficiencyRequirement.proficiency;
				const value = `${currentProficiency} / ${requiredProficiency}`;
				params.push(new JCMS_ParameterKvp(name, value));
			});
		});
		if (params.length) {
			params.unshift(new JCMS_ParameterKvp(`\\C[17]Related Skills\\C[0]`, `\\C[1]\\}REQUIRED\\{\\C[0]`));
		}
		return params;
	}
	/**
	* Truncates plain (escape-code-free) text with an ellipsis so it fits within the
	* given pixel width under this window's current font, without touching the
	* position of whatever is drawn after it.
	* @param {string} text The plain text to measure and truncate.
	* @param {number} maxWidth The maximum pixel width the text may occupy.
	* @returns {string} The original text if it already fits, or an ellipsis-suffixed
	* truncation of it otherwise.
	*/
	truncateToWidth(text, maxWidth) {
		if (this.textWidth(text) <= maxWidth) return text;
		let truncated = text;
		while (truncated.length > 0 && this.textWidth(`${truncated}...`) > maxWidth) {
			truncated = truncated.slice(0, -1);
		}
		return `${truncated}...`;
	}
	/**
	* Creates a list of all elemenets contained by this skill.
	* @param {RPG_Skill} skill The skill.
	* @param {Game_Actor} actor The actor.
	* @returns {JCMS_ParameterKvp[]}
	*/
	makeAttackElementsList(skill, actor) {
		const elementParams = [];
		elementParams.push(new JCMS_ParameterKvp(`\\C[17]Elemental Affiliations\\C[0]`));
		const attackElements = [skill.damage.elementId];
		attackElements.push(...Game_Action.extractElementsFromAction(skill));
		attackElements.forEach((attackElement) => {
			const elementName = TextManager.element(attackElement) ?? `(Basic Attack)`;
			const iconIndex = IconManager.element(attackElement);
			const paramName = `\\I[${iconIndex}]\\C[6]${elementName}\\C[0]`;
			elementParams.push(new JCMS_ParameterKvp(paramName));
		});
		return elementParams;
	}
	/**
	* Makes a parameter that is used as a divider between other parameters.
	* @returns {JCMS_ParameterKvp}
	*/
	makeDividerParam() {
		return new JCMS_ParameterKvp("----------------");
	}
	/**
	* Makes the skill type key value parameter.
	* @param {RPG_Skill} skill The skill object.
	*/
	makeSkillTypeParam(skill) {
		const support = [0];
		const damage = [1, 2];
		const healer = [3, 4];
		const drain = [5, 6];
		let name = "";
		let color = ColorManager.normalColor();
		switch (true) {
			case support.includes(skill.damage.type):
				name = `Support`;
				color = ColorManager.textColor(0);
				break;
			case damage.includes(skill.damage.type):
				name = "Offensive";
				color = ColorManager.textColor(2);
				break;
			case healer.includes(skill.damage.type):
				name = "Restorative";
				color = ColorManager.textColor(3);
				break;
			case drain.includes(skill.damage.type):
				name = "Draining";
				color = ColorManager.textColor(31);
				break;
		}
		return new JCMS_ParameterKvp(name, null, color);
	}
	/**
	* Builds a human-readable cost breakdown string from the individual components.
	*
	* Only non-zero components are included. Flat and formula amounts are rounded
	* to whole numbers; the percent component shows both the raw percent and the
	* translated HP/MP/TP amount so the player understands the actual deduction.
	*
	* Examples:
	*   flat=50, no others           → "50"
	*   percent=10, calcPercent=70   → "10% (70)"
	*   flat=50, percent=10(70)      → "50 + 10% (70)"
	*   all three                    → "50 + 10% (70) + 30"
	*   all zero                     → "0"
	* @param {number} flat The flat cost amount (post-rate).
	* @param {number} percent The raw percent tag value (e.g. 10 for 10%).
	* @param {number} calculatedPercent The translated percent amount (post-rate).
	* @param {number} formula The formula cost result (post-rate).
	* @returns {string}
	*/
	buildCostBreakdownValue(flat, percent, calculatedPercent, formula) {
		const parts = [];
		if (flat !== 0) parts.push(`${Math.round(flat)}`);
		if (percent !== 0) parts.push(`${percent}% (${Math.round(calculatedPercent)})`);
		if (formula !== 0) parts.push(`${Math.round(formula)}`);
		if (parts.length === 0) return "0";
		return parts.join(" + ");
	}
	/**
	* Makes the hp cost key value parameter.
	* Requires J-Resources to be present.
	* @param {RPG_Skill} skill The skill object.
	* @param {Game_Actor} actor The actor.
	* @returns {JCMS_ParameterKvp}
	*/
	makeHpCostParam(skill, actor) {
		const hpName = TextManager.parameterLabel("hcr");
		const { flat, percent, calculatedPercent, formula } = ResourceCostManager.hpCostBreakdown(actor, skill);
		const hasAnyCost = flat !== 0 || percent !== 0 || formula !== 0;
		const hpColor = hasAnyCost ? ColorManager.hpCostColor() : ColorManager.damageColor();
		const value = this.buildCostBreakdownValue(flat, percent, calculatedPercent, formula);
		return new JCMS_ParameterKvp(hpName, value, hpColor);
	}
	/**
	* Makes the mp cost key value parameter.
	* @param {RPG_Skill} skill The skill object.
	* @param {Game_Actor} actor The actor.
	* @returns {JCMS_ParameterKvp}
	*/
	makeMpCostParam(skill, actor) {
		const mpName = TextManager.parameterLabel("mcr");
		if (J.RESOURCES) {
			const baseCost = J.RESOURCES.Aliased.Game_BattlerBase.get("skillMpCost").call(actor, skill);
			const { flat: extraFlat, percent, calculatedPercent, formula } = ResourceCostManager.extraMpCostBreakdown(actor, skill);
			const combinedFlat = baseCost + extraFlat;
			const hasAnyCost = combinedFlat !== 0 || percent !== 0 || formula !== 0;
			const mpColor = hasAnyCost ? ColorManager.mpCostColor() : ColorManager.damageColor();
			const value = this.buildCostBreakdownValue(combinedFlat, percent, calculatedPercent, formula);
			return new JCMS_ParameterKvp(mpName, value, mpColor);
		}
		const mpCost = parseFloat(actor.skillMpCost(skill).toFixed(2));
		const mpColor = mpCost === 0 ? ColorManager.damageColor() : ColorManager.mpCostColor();
		return new JCMS_ParameterKvp(mpName, mpCost, mpColor);
	}
	/**
	* Makes the tp cost key value parameter.
	* @param {RPG_Skill} skill The skill object.
	* @param {Game_Actor} actor The actor.
	* @returns {JCMS_ParameterKvp}
	*/
	makeTpCostParam(skill, actor) {
		const tpName = TextManager.parameterLabel("tcr");
		if (J.RESOURCES) {
			const baseCost = J.RESOURCES.Aliased.Game_BattlerBase.get("skillTpCost").call(actor, skill);
			const { flat: extraFlat, percent, calculatedPercent, formula } = ResourceCostManager.extraTpCostBreakdown(actor, skill);
			const combinedFlat = baseCost + extraFlat;
			const hasAnyCost = combinedFlat !== 0 || percent !== 0 || formula !== 0;
			const tpColor = hasAnyCost ? ColorManager.tpCostColor() : ColorManager.damageColor();
			const value = this.buildCostBreakdownValue(combinedFlat, percent, calculatedPercent, formula);
			return new JCMS_ParameterKvp(tpName, value, tpColor);
		}
		const tpCost = parseFloat(actor.skillTpCost(skill).toFixed(2));
		const tpColor = tpCost === 0 ? ColorManager.damageColor() : ColorManager.tpCostColor();
		return new JCMS_ParameterKvp(tpName, tpCost, tpColor);
	}
};

//#endregion
//#region src/plugins/cms/ext/skill/scenes/Scene_Skill.js
/**
* Re-parents the engine's skill scene onto the shared actor facet skeleton.
*
* Like the equip scene, this is one of RPG Maker's own- a function with a hand-built prototype chain
* and no `extends` clause to change- so its prototype is re-pointed at the base's. That is real
* inheritance: the base's rect math arrives as inherited methods, `super` inside them still resolves,
* this file's own definitions still shadow what they mean to override, and the scene remains an
* instance of {@link Scene_MenuBase} for everything that checks.
*/
Object.setPrototypeOf(Scene_Skill.prototype, Scene_ActorFacetBase.prototype);
/**
* Overwrites {@link Scene_Skill.initialize}.<br/>
* Reaches the facet skeleton's initialize so its members are seeded alongside this scene's.
*/
Scene_Skill.prototype.initialize = function() {
	Scene_ActorFacetBase.prototype.initialize.call(this);
};
/**
* Extends {@link Scene_ActorFacetBase.initMembers}.<br/>
* Also initializes this scene's own members.
*/
Scene_Skill.prototype.initMembers = function() {
	Scene_ActorFacetBase.prototype.initMembers.call(this);
	/**
	* Whether the extended skill detail pane is currently showing.
	* @type {boolean}
	*/
	this._j.moreVisible = false;
};
/**
* Overwrites {@link Scene_Skill.create}.<br/>
* Builds this scene's windows around the shared chrome.
*
* Deliberately does not call vanilla's own `create`. That builds a `Window_SkillStatus`- a full-width
* strip carrying the actor's face, name, level and gauges- which is the actor ribbon by another name,
* and a taller, less consistent one. The ribbon the base supplies replaces it, so the remaining window
* creations are listed here individually rather than inherited wholesale.
*/
Scene_Skill.prototype.create = function() {
	Scene_ActorFacetBase.prototype.create.call(this);
	this.createHelpWindow();
	this.createSkillTypeWindow();
	this.createItemWindow();
	this.createActorWindow();
	this.createSkillDetailWindow();
};
/**
* Overwrites {@link Scene_Skill.statusWindow}.<br/>
* Reports the actor ribbon in place of the retired status strip.
*
* Vanilla reaches for this in `refreshActor` and when returning from item use, so it answers rather
* than vanishing- and the ribbon genuinely is what describes the actor whose skills are listed now.
* @returns {Window_ActorRibbon}
*/
Scene_Skill.prototype.statusWindow = function() {
	return this.getActorRibbonWindow();
};
/**
* Implements {@link Scene_MenuFacetBase.controlLegendEntries}.<br/>
* Describes the controls this scene responds to.
* @returns {{semantic: (string|string[]), label: string}[]}
*/
Scene_Skill.prototype.controlLegendEntries = function() {
	return [
		{
			semantic: "ok",
			label: "use"
		},
		{
			semantic: ["actor-prev", "actor-next"],
			label: "switch character"
		},
		{
			semantic: "cancel",
			label: "back"
		}
	];
};
/**
* The proportion of the region given to the left column of skill types and skills.
* @returns {number}
*/
Scene_Skill.prototype.listColumnRatio = function() {
	return .32;
};
/**
* Overwrites {@link Scene_Skill.mainCommandWidth}.<br/>
* The width of the skill type and skill list column.
*
* A proportion of the region rather than the flat 400px it used to be, so the split holds at any
* resolution.
* @returns {number}
*/
Scene_Skill.prototype.mainCommandWidth = function() {
	return Math.round(this.contentAreaRect().width * this.listColumnRatio());
};
/**
* Overwrites {@link Scene_Skill.skillTypeWindowRect}.<br/>
* The skill-type picker, at the top of the list column.
* @returns {Rectangle}
*/
Scene_Skill.prototype.skillTypeWindowRect = function() {
	const contentArea = this.contentAreaRect();
	const ww = this.mainCommandWidth();
	const wx = this.isRightInputMode() ? contentArea.x + contentArea.width - ww : contentArea.x;
	return new Rectangle(wx, contentArea.y, ww, this.calcWindowHeight(4, true));
};
/**
* Overwrites {@link Scene_Skill.itemWindowRect}.<br/>
* The skill list, filling the rest of its column beneath the type picker.
* @returns {Rectangle}
*/
Scene_Skill.prototype.itemWindowRect = function() {
	const contentArea = this.contentAreaRect();
	const typeRect = this.skillTypeWindowRect();
	const wy = typeRect.y + typeRect.height;
	return new Rectangle(typeRect.x, wy, typeRect.width, contentArea.y + contentArea.height - wy);
};
/**
* Creates and wires the skill detail pane beside the skill list.
*/
Scene_Skill.prototype.createSkillDetailWindow = function() {
	const rect = this.skillDetailRect();
	this._skillDetailWindow = new Window_SkillDetail(rect);
	this.itemWindow().setSkillDetailWindow(this._skillDetailWindow);
	this.addWindow(this._skillDetailWindow);
};
/**
* Overwrites {@link Scene_Skill.skillDetailRect}.<br/>
* The detail pane, taking the whole column beside the list.
*
* Full height of the region now, rather than starting beneath a status strip that no longer exists.
* @returns {Rectangle}
*/
Scene_Skill.prototype.skillDetailRect = function() {
	const contentArea = this.contentAreaRect();
	const listWidth = this.mainCommandWidth();
	const wx = this.isRightInputMode() ? contentArea.x : contentArea.x + listWidth;
	return new Rectangle(wx, contentArea.y, contentArea.width - listWidth, contentArea.height);
};
/**
* Overwrites {@link #createButtons}.<br/>
* Removes the buttons because fuck the buttons.
*/
Scene_Skill.prototype.createButtons = function() {};
/**
* Overwrites {@link #buttonAreaHeight}.<br/>
* Replaces the button area height with 0 because fuck buttons.
* @returns {number}
*/
Scene_Skill.prototype.buttonAreaHeight = () => 0;

//#endregion
//#region src/plugins/cms/ext/skill/windows/Window_SkillList.js
/**
* Extends {@link #initialize}.<br/>
* Includes our skill detail window.
*/
J.CMS_K.Aliased.Window_SkillList.set("initialize", Window_SkillList.prototype.initialize);
Window_SkillList.prototype.initialize = function(rect) {
	J.CMS_K.Aliased.Window_SkillList.get("initialize").call(this, rect);
	/**
	* The detail window for the skill.
	*  @type {Window_SkillDetail}
	*/
	this._skillDetailWindow = null;
};
/**
* Sets the skill detail window to the provided window.
* @param {Window_SkillDetail} newWindow The new window.
*/
Window_SkillList.prototype.setSkillDetailWindow = function(newWindow) {
	this._skillDetailWindow = newWindow;
	this.refreshSkillDetailWindow();
};
/**
* Refreshes the skill details window.
*/
Window_SkillList.prototype.refreshSkillDetailWindow = function() {
	if (!this.skillDetailWindow()) return;
	let id = 0;
	const item = this.item();
	if (item) {
		({id} = item);
	}
	this.skillDetailWindow().setActor(this.actor());
	this.skillDetailWindow().setSkillId(id);
};
/**
* Extends `.select()` to also update our skill detail window if need-be.
*/
J.CMS_K.Aliased.Window_SkillList.set("select", Window_SkillList.prototype.select);
Window_SkillList.prototype.select = function(index) {
	J.CMS_K.Aliased.Window_SkillList.get("select").call(this, index);
	this.refreshSkillDetailWindow();
};
/**
* Overwrites {@link #maxCols}.<br/>
* Forces a single column for skills in this window.
* @returns {number}
*/
Window_SkillList.prototype.maxCols = function() {
	return 1;
};
/**
* Overwrites {@link #drawSkillCost}.<br/>
* Does not draw costs of any kind.
* @param {RPG_Skill} skill The skill to draw costs for.
* @param {number} x The `x` coordinate.
* @param {number} y The `y` coordinate.
* @param {number} width The text width.
*/
Window_SkillList.prototype.drawSkillCost = function(skill, x, y, width) {};
/**
* Overwrites {@link #includes}.<br/>
* Limits the skills displayed to those relevant to the actor's equipped weapon- if one exists.
* @param {RPG_Skill} skill The skill to see if filtering is necessary.
* @returns {boolean}
*/
Window_SkillList.prototype.includes = function(skill) {
	if (!skill) return false;
	const matchesSkillTypeId = skill.stypeId === this.stypeId();
	if (!this.actor()) return matchesSkillTypeId;
	const matchesWeaponTypeId = this.actor().isSkillWtypeOk(skill);
	return matchesSkillTypeId && matchesWeaponTypeId;
};
/**
* Gets the skill detail window.
* @returns {Window_Base} The skillDetailWindow.
*/
Window_SkillList.prototype.skillDetailWindow = function() {
	return this._skillDetailWindow;
};

//#endregion
//#region src/plugins/cms/ext/skill/windows/Window_SkillType.js
/**
* Overwrites {@link #maxCols}.<br/>
* Fixes the maximum columns for this screen to be 1.
* @returns {number}
*/
Window_SkillType.prototype.maxCols = function() {
	return 1;
};
Window_SkillType.prototype.makeCommandList = function() {
	/** @type {Game_Actor} */
	const currentActor = this.actor();
	if (!currentActor) return;
	/** @type {number[]} */
	const skillTypeIds = currentActor.addedSkillTypes().filter((x, i, self) => self.indexOf(x) === i);
	skillTypeIds.forEach((skillTypeId) => {
		const name = $dataSystem.skillTypes[skillTypeId];
		const icon = IconManager.skillType(skillTypeId);
		this.addCommand(name, "skill", true, skillTypeId, icon);
	});
};

//#endregion
//# sourceMappingURL=J-CMS-Skill.js.map