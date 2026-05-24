//region Introduction
/*:
 * @target MZ
 * @plugindesc
 * [v2.1.0 POPUPS] Map text popups for JABS and beyond.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @orderAfter J-Base
 * @param disablePopups
 * @text Disable all map popups
 * @type boolean
 * @default false
 * @desc When true, addTextPop ignores new pops.
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin is the core of the J-Popups system.
 *
 * Have you ever wanted floating text popups on your map for damage, healing,
 * experience, loot, and more? Well now you can! This plugin provides the
 * infrastructure for building and displaying text popups on map characters,
 * and is designed to be extended by the various J-Popups extension plugins.
 *
 * Integrates with others of mine plugins:
 * - J-Popups-ABS;      combat damage, healing, loot, and reward popups.
 * - J-Popups-APT;      aptitude point reward popups.
 * - J-Popups-SDP;      SDP point reward popups.
 * - J-Popups-Resources; skill cost and hit-based resource gain popups.
 *
 * ----------------------------------------------------------------------------
 * DETAILS:
 * Popups are built using the TextPopBuilder fluent interface, placed into a
 * layout ring on a map character, and rendered by Sprite_Damage. Each
 * extension plugin provides its own builders for the popup types it needs.
 *
 * NOTE:
 * Listeners on the optional PopupEmitter (J.POPUPS.Helpers.PopupEmitter) must
 * stay cheap- no heavy work per frame. Event names live in J.POPUPS.EventNames.
 *
 * ============================================================================
 * CHANGELOG:
 * - 2.1.0
 *    Sprite_MapDamage accumulation phase; merge helpers + PopupEmitter flush hooks.
 *    Merge idle flush is battler-wide (any merged stream refreshes the timer); strike floats release on that idle
 *    window only (not on unrelated combo-chain clear signals).
 * - 2.0.0
 *    Split from J-TextPops; plugin renamed J-Popups; layout rings + WeakMap
 *    stacking; addTextPop validation; J.POPUPS.EXT.* extensions for J-ABS,
 *    Aptitude, SDP, and Resources pop builders; disablePopups parameter
 *    (no J-ABS required).
 * - 1.1.0
 *    PopupEmitter lifecycle; DisablePopups; layout constants; variance/motion
 *    fixes; textAccent.
 * - 1.0.0
 *    Initial release (as J-TextPops).
 * ============================================================================
 */
//endregion Introduction

//#region src/plugins/popups/core/_metadata/_pluginMetadata.js
/**
* Plugin metadata for J-Popups.
*/
var J_PopupsPluginMetadata = class extends PluginMetadata {
	/**
	* Constructor.
	*/
	constructor(name, version) {
		super(name, version);
	}
	/**
	* Extends {@link #postInitialize}.<br>
	* Maps plugin parameters onto fields used by map popup dispatch.
	*/
	postInitialize() {
		super.postInitialize();
		this.initializeMetadata();
	}
	/**
	* Initializes the metadata associated with this plugin.
	*/
	initializeMetadata() {
		/**
		* When true, queued map popups are suppressed.
		* @type {boolean}
		*/
		this.disablePopups = this.parsedPluginParameters["disablePopups"] === "true";
	}
};

//#endregion
//#region src/plugins/popups/core/_metadata/initialization.js
/**
* The core where all my extensions live: in the `J` object.
*/
globalThis.J ||= {};
/**
* The plugin umbrella that governs all things related to this plugin.
*/
J.POPUPS = {};
/**
* The metadata associated with this plugin.
*/
J.POPUPS.Metadata = new J_PopupsPluginMetadata("J-Popups", "2.1.0");
/**
* Namespace for optional first-party extensions (J-Popups-ABS, J-Popups-APT, …).
*/
J.POPUPS.EXT = {};
/**
* Stable event names for {@link J.POPUPS.Helpers.PopupEmitter}.
*/
J.POPUPS.EventNames = {
	Queued: "popups/queued",
	SpriteSpawned: "popups/sprite-spawned",
	SpriteFinished: "popups/sprite-finished",
	FlushRequested: "popups/flush-requested",
	ComboChainCleared: "popups/combo-chain-cleared",
	MergeFlushAll: "popups/merge-flush-all"
};
/**
* A collection of all motion styles available for popups.
*/
J.POPUPS.MotionStyles = {
	/**
	* The default bounce motion.
	*/
	Bounce: "bounce",
	/**
	* A flyaway motion that floats up and fades out.
	*/
	Flyaway: "flyaway"
};
/**
* Default layout offsets for anchoring popup sprites to {@link Sprite_Character}.
*/
J.POPUPS.Layout = {
	/**
	* The horizontal offset from the character's center.
	* @type {number}
	*/
	AnchorOffsetX: 0,
	/**
	* The width of the bitmap used for damage values.
	* @type {number}
	*/
	ValueBitmapWidth: 400,
	/**
	* The scale of the icons in the popups.
	* @type {number}
	*/
	IconScale: .75,
	/**
	* The horizontal distance between slots in a layout ring.
	* @type {number}
	*/
	RingStepX: 12,
	/**
	* The vertical distance between slots in a layout ring.
	* @type {number}
	*/
	RingStepY: 16,
	/**
	* The vertical baseline offset for all popups.
	* @type {number}
	*/
	VerticalOffset: -20,
	/**
	* The horizontal baseline offset for all popups.
	* @type {number}
	*/
	HorizontalOffset: -20,
	/**
	* The horizontal padding from the character's center for motion popups.
	* @type {number}
	*/
	PaddingX: 24,
	/**
	* The vertical padding from the character's center for motion popups.
	* @type {number}
	*/
	PaddingY: 0,
	/**
	* The number of frames of inactivity before a layout ring resets to its first slot.
	* @type {number}
	*/
	ResetDuration: 30,
	/**
	* The base duration in frames that a popup sprite remains visible.
	* @type {number}
	*/
	BaseDuration: 60,
	/**
	* Encapsulated motion-related settings.
	*/
	Motion: {
		/**
		* Whether or not to enable motion for popups.
		* If this is false, none of the other motion-related settings matter.
		* @type {boolean}
		*/
		Enabled: true,
		/**
		* The style of motion to use for popups.
		* @type {string}
		*/
		Style: J.POPUPS.MotionStyles.Bounce,
		/**
		* The initial vertical jump velocity for the bounce motion.
		* Negative values go up.
		* @type {number}
		*/
		InitialJump: -2,
		/**
		* The gravity applied to the popup during motion.
		* Higher values make it fall faster.
		* @type {number}
		*/
		Gravity: .1,
		/**
		* The horizontal drift speed during motion.
		* @type {number}
		*/
		DriftSpeed: 1.1,
		/**
		* The maximum horizontal distance a popup can drift during motion.
		* @type {number}
		*/
		MaxDrift: 200
	}
};
/**
* Per-character slot offsets for {@link Map_TextPop.LayoutRings}. Ephemeral (WeakMap; not saved).
*/
J.POPUPS._layoutRingState = new WeakMap();
J.POPUPS.Helpers = {};
J.POPUPS.Helpers.PopupEmitter = new J_EventEmitter();
J.POPUPS.Aliased = {};
J.POPUPS.Aliased.Game_Character = new Map();
J.POPUPS.Aliased.Spriteset_Map = new Map();
J.POPUPS.Aliased.Sprite_Character = new Map();
J.POPUPS.Aliased.Sprite_Damage = new Map();
J.POPUPS.Aliased.Scene_Map = new Map();
/**
* Emits {@link J.POPUPS.EventNames.Queued} after a popup is queued on a character.
* @param {Game_Character} character The anchor character.
* @param {Map_TextPop} popup The queued popup model.
*/
J.POPUPS.notifyPopupQueued = function(character, popup) {
	J.POPUPS.Helpers.PopupEmitter.emit(J.POPUPS.EventNames.Queued, {
		character,
		popup
	});
};
/**
* Emits {@link J.POPUPS.EventNames.FlushRequested} after requestTextPop.
* @param {Game_Character} character The anchor character.
*/
J.POPUPS.notifyPopupFlushRequested = function(character) {
	J.POPUPS.Helpers.PopupEmitter.emit(J.POPUPS.EventNames.FlushRequested, { character });
};
/**
* Emits {@link J.POPUPS.EventNames.SpriteSpawned} after a {@link Sprite_Damage} is built and parented.
* @param {Game_Character} character The anchor character.
* @param {Map_TextPop} popup The source popup model.
* @param {Sprite_Damage} sprite The live popup sprite.
*/
J.POPUPS.notifyPopupSpriteSpawned = function(character, popup, sprite) {
	J.POPUPS.Helpers.PopupEmitter.emit(J.POPUPS.EventNames.SpriteSpawned, {
		character,
		popup,
		sprite
	});
};
/**
* Emits {@link J.POPUPS.EventNames.SpriteFinished} when a popup sprite finishes and is about to be destroyed.
* @param {Game_Character} character The anchor character.
* @param {Map_TextPop|null} popup The model captured at spawn (same reference as queue time).
* @param {Sprite_Damage} sprite The sprite being torn down.
*/
J.POPUPS.notifyPopupSpriteFinished = function(character, popup, sprite) {
	J.POPUPS.Helpers.PopupEmitter.emit(J.POPUPS.EventNames.SpriteFinished, {
		character,
		popup,
		sprite
	});
};
/**
* Emits {@link J.POPUPS.EventNames.ComboChainCleared} after JABS clears a combo id from a skill slot.
* Extensions may subscribe; strike merge release uses `mergeIdleFlushFrames` idle flush, not this event.
*
* @param {JABS_Battler} jabsBattler The battler who owned the chain.
* @param {string} cooldownKey The skill-slot cooldown key (mainhand/offhand/etc.).
*/
J.POPUPS.notifyComboChainCleared = function(jabsBattler, cooldownKey) {
	J.POPUPS.Helpers.PopupEmitter.emit(J.POPUPS.EventNames.ComboChainCleared, {
		jabsBattler,
		cooldownKey
	});
};
/**
* Requests merge accumulators to flush (listeners interpret scope).
*
* @param {string} reason Diagnostic tag for subscribers.
*/
J.POPUPS.notifyMergeFlushAll = function(reason) {
	J.POPUPS.Helpers.PopupEmitter.emit(J.POPUPS.EventNames.MergeFlushAll, { reason });
};

//#endregion
//#region src/plugins/popups/core/_models/TextPopBuilder.js
/**
* The fluent-builder for text pops on the map.
*/
var TextPopBuilder = class {
	/**
	* Whether or not this popup is the result of a critical skill usage.
	* @type {boolean}
	* @private
	*/
	#isCritical = false;
	/**
	* Whether or not this popup is healing of some sort.
	* @type {boolean}
	* @private
	*/
	#isHealing = false;
	/**
	* The icon index of the popup.<br/>
	* If none is provided, then this defaults to 0, which is no icon.
	* @type {number}
	* @private
	*/
	#iconIndex = 0;
	/**
	* The text color index of the popup.<br/>
	* This doesn't apply to icon-only popups.<br/>
	* This is the same color index used in message windows and the like.
	* @type {number}
	* @private
	*/
	#textColorIndex = 0;
	/**
	* The type of popup this is.
	* @type {Map_TextPop.Types}
	* @private
	*/
	#popupType = Map_TextPop.Types.HpDamage;
	/**
	* This text will be prepended to the "value" portion of the popup.
	* @type {string}
	* @private
	*/
	#prefix = String.empty;
	/**
	* The underlying base numeric value.
	* This is only applicable for numeric/damage popups.
	* @type {number}
	* @private
	*/
	#baseValue = 0;
	/**
	* The base text value of the popup.<br/>
	* This may look like a number, but it will be treated as a string.
	* @type {string}
	* @private
	*/
	#value = String.empty;
	/**
	* This text will be appended to the "value" portion of the popup.
	* @type {string}
	* @private
	*/
	#suffix = String.empty;
	/**
	* The variance on the X coordinate for this popup.
	* @type {number}
	* @private
	*/
	#xVariance = 0;
	/**
	* The variance on the Y coordinate for this popup.
	* @type {number}
	* @private
	*/
	#yVariance = 0;
	/**
	* Optional typography hint forwarded to {@link Sprite_Damage.prototype.createValue}.
	* @type {string|null}
	* @private
	*/
	#textAccent = null;
	/**
	* Layout ring for stacking offsets; only {@link Map_TextPop.LayoutRings} values are valid on build.
	* @type {string}
	* @private
	*/
	#layoutRing = Map_TextPop.LayoutRings.EnemyDamage;
	/**
	* When false, merge layer keeps {@link Sprite_MapDamage} in accumulation phase until flushed.
	* @type {boolean}
	* @private
	*/
	#jInstantRelease = true;
	/**
	* Constructor.
	* @param {number|string} value The text or value to be displayed in the popup.
	*/
	constructor(value) {
		this.setValue(value);
	}
	/**
	* Builds the popup based on the currently provided info.
	* @returns {Map_TextPop}
	*/
	build() {
		const popup = new Map_TextPop({
			iconIndex: this.#iconIndex,
			textColorIndex: this.#textColorIndex,
			popupType: this.#popupType,
			critical: this.#isCritical,
			value: this.#makePopupValue(),
			coordinateVariance: this.#makeCoordinateVariance(),
			healing: this.#isHealing,
			textAccent: this.#textAccent,
			layoutRing: this.#layoutRing,
			jInstantRelease: this.#jInstantRelease
		});
		this.#clear();
		return popup;
	}
	/**
	* Clears the current parameters for this popup.<br/>
	* This automatically runs after `build()` is run.
	* @private
	*/
	#clear() {
		this.#isCritical = false;
		this.#iconIndex = 0;
		this.#textColorIndex = 0;
		this.#popupType = Map_TextPop.Types.HpDamage;
		this.#prefix = String.empty;
		this.#value = String.empty;
		this.#suffix = String.empty;
		this.#xVariance = 0;
		this.#yVariance = 0;
		this.#textAccent = null;
		this.#layoutRing = Map_TextPop.LayoutRings.EnemyDamage;
		this.#jInstantRelease = true;
	}
	/**
	* Creates the actual text value that will be on the popup.
	* Concatenates the prefix, value, and suffix, all together in that order.
	* @returns {string}
	* @private
	*/
	#makePopupValue() {
		let valuePart = this.#value;
		if (valuePart.indexOf(`-`) !== -1) {
			valuePart = valuePart.substring(1);
		}
		return `${this.#prefix}${valuePart}${this.#suffix}`;
	}
	/**
	* Puts together the x and y coordinate variances into a single `[x,y]` array.
	* @returns {[number, number]}
	*/
	#makeCoordinateVariance() {
		return [this.#xVariance, this.#yVariance];
	}
	/**
	* Sets the value of the text pop you are building.
	* @param {number|string} value The new value to replace the old one with.
	* @returns {TextPopBuilder} The builder, for fluent chaining.
	*/
	setValue(value) {
		let underlyingValue;
		if (Number(value) === value) {
			underlyingValue = value > 0 ? Math.ceil(value) : Math.floor(value);
			this.#updateBaseValue(underlyingValue);
		} else {
			underlyingValue = value;
			this.#updateBaseValue(0);
		}
		this.#value = underlyingValue.toString();
		return this;
	}
	/**
	* Updates the underlying base value of the text popup.
	* This is only used by numeric/damage popups.
	* @param {number} value The base value.
	* @private
	*/
	#updateBaseValue(value) {
		this.#baseValue = value;
		if (value < 0) {
			this.setHealing(true);
		}
	}
	/**
	* Sets whether or not this popup is a critical skill usage.
	* @param {boolean} isCritical Whether or not this popup is critical.
	* @returns {TextPopBuilder} The builder, for fluent chaining.
	*/
	setCritical(isCritical = true) {
		this.#isCritical = isCritical;
		return this;
	}
	/**
	* Sets whether or not this popup is healing.
	* Normally this is set automatically by the constructor and/or by the `setValue()` call.
	* @param [isHealing=true] {boolean} isHealing True if this is healing, false otherwise.
	* @returns {TextPopBuilder} The builder, for fluent chaining.
	*/
	setHealing(isHealing = true) {
		this.#isHealing = isHealing;
		return this;
	}
	/**
	* Sets a typography hint for the value line (miss, evade, parry); avoids substring checks on localized text.
	* @param {string|null} accent The accent key, or null to clear.
	* @returns {TextPopBuilder} The builder, for fluent chaining.
	*/
	setTextAccent(accent) {
		this.#textAccent = accent;
		return this;
	}
	/**
	* Sets the icon index of the popup to the provided index.
	* This is the same icon index you can find in the RM editor.
	* If none is set, there will be no icon displayed.
	* @param {number} iconIndex The icon index to set.
	* @returns {TextPopBuilder} The builder, for fluent chaining.
	*/
	setIconIndex(iconIndex) {
		this.#iconIndex = iconIndex;
		return this;
	}
	/**
	* Sets the text color index of the popup to the provided index.
	* This is the same index used in message windows and the like.
	* @param {number} textColorIndex The text color index to set.
	* @returns {TextPopBuilder} The builder, for fluent chaining.
	*/
	setTextColorIndex(textColorIndex) {
		this.#textColorIndex = textColorIndex;
		return this;
	}
	/**
	* Sets the popup type of the popup to the provided type.
	* @param {Map_TextPop.Types} popupType The type of popup this is.
	* @returns {TextPopBuilder}
	*/
	setPopupType(popupType) {
		this.#popupType = popupType;
		return this;
	}
	/**
	* Set the prefix of the text popup to the given value.
	* @param {string} prefix The prefix to prepend to the value.
	* @returns {TextPopBuilder} The builder, for fluent chaining.
	*/
	setPrefix(prefix) {
		this.#prefix = prefix;
		return this;
	}
	/**
	* Set the suffix of the text popup to the given value.
	* @param {string} suffix The suffix to append to the value.
	* @returns {TextPopBuilder} The builder, for fluent chaining.
	*/
	setSuffix(suffix) {
		this.#suffix += suffix;
		return this;
	}
	/**
	* Sets the x variance coordinate for this popup.
	* @param {number} xVariance The x variance.
	* @returns {TextPopBuilder} The builder, for fluent chaining.
	*/
	setXVariance(xVariance) {
		this.#xVariance = xVariance;
		return this;
	}
	/**
	* Sets the y variance coordinate for this popup.
	* @param {number} yVariance The y variance.
	* @returns {TextPopBuilder} The builder, for fluent chaining.
	*/
	setYVariance(yVariance) {
		this.#yVariance = yVariance;
		return this;
	}
	/**
	* Sets both the x and y variance coordinates for this popup.
	* Under the covers, this simply executes both individual set functions
	* for the x and y coordinates.
	* @param {number} xVariance The x variance.
	* @param {number} yVariance The y variance.
	* @returns {TextPopBuilder} The builder, for fluent chaining.
	*/
	setCoordinateVariance(xVariance, yVariance) {
		this.setXVariance(xVariance);
		this.setYVariance(yVariance);
		return this;
	}
	/**
	* @returns {TextPopBuilder} The builder, for fluent chaining.
	*/
	forEnemyDamageRing() {
		this.#layoutRing = Map_TextPop.LayoutRings.EnemyDamage;
		this.setXVariance(0);
		this.setYVariance(0);
		return this;
	}
	/**
	* @returns {TextPopBuilder} The builder, for fluent chaining.
	*/
	forIncomingHealRing() {
		this.#layoutRing = Map_TextPop.LayoutRings.IncomingHeal;
		this.setXVariance(0);
		this.setYVariance(0);
		return this;
	}
	/**
	* @returns {TextPopBuilder} The builder, for fluent chaining.
	*/
	forSlipDamageRing() {
		this.#layoutRing = Map_TextPop.LayoutRings.SlipDamage;
		this.setXVariance(0);
		this.setYVariance(0);
		return this;
	}
	/**
	* @returns {TextPopBuilder} The builder, for fluent chaining.
	*/
	forRegenRing() {
		this.#layoutRing = Map_TextPop.LayoutRings.Regen;
		this.setXVariance(0);
		this.setYVariance(0);
		return this;
	}
	/**
	* @returns {TextPopBuilder} The builder, for fluent chaining.
	*/
	forRewardUpRing() {
		this.#layoutRing = Map_TextPop.LayoutRings.RewardUp;
		this.setXVariance(0);
		this.setYVariance(0);
		return this;
	}
	/**
	* @returns {TextPopBuilder} The builder, for fluent chaining.
	*/
	forLootDownRing() {
		this.#layoutRing = Map_TextPop.LayoutRings.LootDown;
		this.setXVariance(0);
		this.setYVariance(0);
		return this;
	}
	/**
	* @returns {TextPopBuilder} The builder, for fluent chaining.
	*/
	forCenterFocusRing() {
		this.#layoutRing = Map_TextPop.LayoutRings.CenterFocus;
		this.setXVariance(0);
		this.setYVariance(0);
		return this;
	}
	/**
	* @param {boolean} instant When false, {@link Sprite_MapDamage} waits for merge flush before motion.
	* @returns {TextPopBuilder} The builder, for fluent chaining.
	*/
	setJInstantRelease(instant) {
		this.#jInstantRelease = instant;
		return this;
	}
	/**
	* Changes the suffix based on elemental efficicacy associated with a damage pop.
	* @param {number} elementalRate The elemental factor, such as 0.4 or 1.75.
	* @returns {TextPopBuilder} The builder, for fluent chaining.
	*/
	isElemental(elementalRate) {
		if (elementalRate < 1) {
			this.setSuffix("...");
		} else if (elementalRate > 1) {
			this.setSuffix("!!!");
		}
		return this;
	}
	/**
	* An internal collection of hp/mp/tp damage and healing text color indices.
	*/
	#textColors = {
		/**
		* The text color index for HP damage.
		* @returns {number}
		*/
		hpDamage: 0,
		/**
		* The text color index for HP healing.
		* @returns {number}
		*/
		hpHealing: 21,
		/**
		* The text color index for MP damage.
		* @returns {number}
		*/
		mpDamage: 5,
		/**
		* The text color index for MP healing.
		* @returns {number}
		*/
		mpHealing: 23,
		/**
		* The text color index for TP damage.
		* @returns {number}
		*/
		tpDamage: 19,
		/**
		* The text color index for TP healing.
		* @returns {number}
		*/
		tpHealing: 29
	};
	/**
	* Add some convenient defaults for configuring hp damage.
	* @returns {TextPopBuilder} The builder, for fluent chaining.
	*/
	isHpDamage() {
		this.setPopupType(Map_TextPop.Types.HpDamage);
		if (this.#baseValue !== 0) {
			if (!this.#isHealing) {
				this.setTextColorIndex(this.#textColors.hpDamage);
			} else {
				this.setTextColorIndex(this.#textColors.hpHealing);
				this.setPrefix(`+`);
			}
		}
		return this;
	}
	/**
	* Add some convenient defaults for configuring mp damage.
	* @returns {TextPopBuilder} The builder, for fluent chaining.
	*/
	isMpDamage() {
		this.setPopupType(Map_TextPop.Types.MpDamage);
		if (this.#baseValue !== 0) {
			if (!this.#isHealing) {
				this.setTextColorIndex(this.#textColors.mpDamage);
			} else {
				this.setTextColorIndex(this.#textColors.mpHealing);
				this.setPrefix(`+`);
			}
		}
		return this;
	}
	/**
	* Add some convenient defaults for configuring tp damage.
	* @returns {TextPopBuilder} The builder, for fluent chaining.
	*/
	isTpDamage() {
		this.setPopupType(Map_TextPop.Types.TpDamage);
		if (this.#baseValue !== 0) {
			if (!this.#isHealing) {
				this.setTextColorIndex(this.#textColors.tpDamage);
			} else {
				this.setTextColorIndex(this.#textColors.tpHealing);
				this.setPrefix(`+`);
			}
		}
		return this;
	}
	/**
	* Add some convenient defaults for configuring earned experience popups.
	* @returns {TextPopBuilder} The builder, for fluent chaining.
	*/
	isExperience() {
		this.setPopupType(Map_TextPop.Types.Experience);
		this.setTextColorIndex(6);
		this.setIconIndex(125);
		this.forRewardUpRing();
		return this;
	}
	/**
	* Add some convenient defaults for configuring found gold popups.
	* @returns {TextPopBuilder} The builder, for fluent chaining.
	*/
	isGold() {
		this.setPopupType(Map_TextPop.Types.Gold);
		this.setTextColorIndex(14);
		this.setIconIndex(2048);
		this.forRewardUpRing();
		return this;
	}
	/**
	* Add some convenient defaults for configuring SDP points popups.
	* @returns {TextPopBuilder} The builder, for fluent chaining.
	*/
	isSdpPoints() {
		this.setPopupType(Map_TextPop.Types.Sdp);
		this.setTextColorIndex(17);
		this.setIconIndex(306);
		this.forRewardUpRing();
		return this;
	}
	/**
	* Add some convenient defaults for configuring collected loot popups.
	* @returns {TextPopBuilder} The builder, for fluent chaining.
	*/
	isLoot() {
		this.setPopupType(Map_TextPop.Types.Item);
		this.setTextColorIndex(1);
		this.forLootDownRing();
		return this;
	}
	/**
	* Add some convenient defaults for configuring level up popups.
	* @returns {TextPopBuilder} The builder, for fluent chaining.
	*/
	isLevelUp() {
		this.setPopupType(Map_TextPop.Types.Levelup);
		this.setTextColorIndex(24);
		this.setIconIndex(86);
		this.forRewardUpRing();
		return this;
	}
	/**
	* Add some convenient defaults for configuring skill used popups.
	* @param {number} skillIconIndex The icon index of the skill.
	* @returns {TextPopBuilder} The builder, for fluent chaining.
	*/
	isSkillUsed(skillIconIndex) {
		this.setPopupType(Map_TextPop.Types.SkillUsage);
		this.setTextColorIndex(7);
		this.setIconIndex(skillIconIndex);
		this.forCenterFocusRing();
		return this;
	}
	/**
	* Add some convenient defaults for configuring skill learned popups.
	* @param {number} skillIconIndex The icon index of the skill.
	* @returns {TextPopBuilder} The builder, for fluent chaining.
	*/
	isSkillLearned(skillIconIndex) {
		this.setPopupType(Map_TextPop.Types.Learn);
		this.setTextColorIndex(27);
		this.setIconIndex(skillIconIndex);
		this.setSuffix(` LEARNED!`);
		this.forRewardUpRing();
		return this;
	}
};

//#endregion
//#region src/plugins/popups/core/_models/Map_TextPop.js
/**
* A class representing a single popup on the map.
*/
function Map_TextPop() {
	this.initialize(...arguments);
}
Map_TextPop.prototype = {};
Map_TextPop.prototype.constructor = Map_TextPop;
/**
* A static collection of all types associated with text pops.
*/
Map_TextPop.Types = {
	/**
	* The popup type of "hp-damage", for displaying hp damage pops.
	*/
	HpDamage: "hp-damage",
	/**
	* The popup type of "mp-damage", for displaying mp damage pops.
	*/
	MpDamage: "mp-damage",
	/**
	* The popup type of "tp-damage", for displaying tp damage pops.
	*/
	TpDamage: "tp-damage",
	/**
	* The popup type of "evade", for evasion pops.
	* Though, these aren't officially supported by JABS.
	*/
	Evade: "evade",
	/**
	* The popup type of "parry", for when a skill was used, but also parried.
	*/
	Parry: "parry",
	/**
	* The popup type of "experience", for displaying gained experience pops.
	*/
	Experience: "exp",
	/**
	* The popup type of "gold", for displaying earned gold pops.
	*/
	Gold: "gold",
	/**
	* The popup type of "levelup", for displaying levelups pops.
	*/
	Levelup: "levelup",
	/**
	* The popup type of "item", for displaying loot pops.
	*/
	Item: "item",
	/**
	* The popup type of "slip", for displaying pops generated by slip damage/healing.
	*/
	Slip: "slip",
	/**
	* The popup type of "skillLearn", for displaying skills learned as a pop.
	*/
	Learn: "skillLearn",
	/**
	* The popup type of "sdp", for displaying SDP points earned after defeating foes.
	*/
	Sdp: "sdp",
	/**
	* The popup type of "skillUsage", for displaying used skills as popups off the battlers on the map.
	*/
	SkillUsage: "skillUsage"
};
/**
* Layout stream for ring stacking (orthogonal to {@link Map_TextPop.Types}).
* Set only via {@link TextPopBuilder} fluent helpers.
*/
Map_TextPop.LayoutRings = {
	EnemyDamage: "layout-enemy-damage",
	IncomingHeal: "layout-incoming-heal",
	SlipDamage: "layout-slip-damage",
	Regen: "layout-regen",
	RewardUp: "layout-reward-up",
	LootDown: "layout-loot-down",
	CenterFocus: "layout-center-focus"
};
/**
* Builds the text pop based on the given parameters.
*/
Map_TextPop.prototype.initialize = function({ iconIndex, textColorIndex, popupType, value, critical, coordinateVariance, healing, textAccent, layoutRing, jInstantRelease }) {
	/**
	* The id of the icon to display alongside this `Map_TextPop`.
	* @type {number}
	*/
	this.iconIndex = iconIndex;
	/**
	* The color index for the text color.
	* @type {number}
	*/
	this.textColorIndex = textColorIndex;
	/**
	* The type of popup this is, such as damage, experience, loot, etc.
	* @type {Map_TextPop.Types}
	*/
	this.popupType = popupType;
	/**
	* The value to display on the sprite for this popup.
	* @type {string}
	*/
	this.value = value || String.empty;
	/**
	* Whether or not this popup is critical.
	* For non-damage popups, this is always false.
	* @type {boolean}
	*/
	this.critical = critical || false;
	/**
	* The x and y coordinate variances into a single `[x,y]` array.
	* @type {[number, number]}
	*/
	this.coordinateVariance = coordinateVariance;
	/**
	* Whether or not this popup is healing.
	* Healing popups' motion is handled a bit differently.
	* @type {boolean}
	*/
	this.healing = healing;
	/**
	* Optional typography hint for the value line (e.g. miss, evade, parry).
	* @type {string|null|undefined}
	*/
	this.textAccent = textAccent;
	/**
	* Which layout ring advances for this pop (stacking); see {@link Map_TextPop.LayoutRings}.
	* @type {string}
	*/
	this.layoutRing = layoutRing;
	/**
	* When false, {@link Sprite_MapDamage} stays in accumulation phase until merge policy releases motion.
	* When true (default), motion plays immediately like legacy {@link Sprite_Damage} pops.
	* @type {boolean}
	*/
	this.jInstantRelease = jInstantRelease !== false;
};

//#endregion
//#region src/plugins/popups/core/sprites/Sprite_MapDamage.js
/**
* Map combat popup sprite that can hold motion until accumulation finishes, then reuse {@link Sprite_Damage} motion.
* Extends engine {@link Sprite_Damage} so Juicy bits (critical flash, colors) stay consistent.
*/
function Sprite_MapDamage() {
	this.initialize(...arguments);
}
Sprite_MapDamage.prototype = Object.create(Sprite_Damage.prototype);
Sprite_MapDamage.prototype.constructor = Sprite_MapDamage;
/**
* Runs after {@link Sprite_Damage.prototype.initialize}.
*/
Sprite_MapDamage.prototype.initialize = function() {
	Sprite_Damage.prototype.initialize.call(this);
	/**
	* When true, child motion is frozen so totals can climb in place on the anchor.
	* @type {boolean}
	*/
	this._j._popups._mapAccumulatePhase = true;
	/**
	* Frame index into {@link #kickMergeCombinePulse}; {@link #_mergePulseTotalFrames} or greater means idle.
	* @type {number}
	*/
	this._j._popups._mergePulseFrameIndex = 10;
	/**
	* How many frames the merge tally scale pulse currently runs.
	* @type {number}
	*/
	this._j._popups._mergePulseTotalFrames = 10;
	/**
	* The baseline duration of a normal merge pulse.
	* @type {number}
	*/
	this._j._popups._mergePulseBaseFrames = 10;
	/**
	* The number of frames to hold the current merge pulse at peak scale before easing down.
	* @type {number}
	*/
	this._j._popups._mergePulseHoldFrames = 0;
	/**
	* The current peak scale for the active merge pulse.
	*
	* Normal additions use a subtle bump, while notable additions such as critical
	* contributions can momentarily push this higher for stronger visual feedback.
	* @type {number}
	*/
	this._j._popups._mergePulsePeakScale = 1.33;
	/**
	* The maximum alpha for the transient merge pulse flash.
	* @type {number}
	*/
	this._j._popups._mergePulseFlashMaxAlpha = 0;
	/**
	* The current alpha for the transient merge pulse flash.
	* @type {number}
	*/
	this._j._popups._mergePulseFlashAlpha = 0;
};
/**
* Mirrors {@link Sprite_Damage.prototype.update} but skips the duration countdown while accumulating.
*
* Vanilla damage sprites always decrement {@link Sprite_Damage#_duration}; if we only gate motion in
* {@link Sprite_MapDamage.prototype.updateChild}, the popup still expires, {@link Sprite_Damage.prototype.isPlaying}
* returns false, and {@link Sprite_Character.prototype._removeTrackedPopSprite} destroys the sprite early.
* {@link JABS_PopupMergeController} then keeps a dead reference and combo-flush hits {@link Sprite.prototype.destroy}
* twice (PIXI tears down listeners that are already null).
*/
Sprite_MapDamage.prototype.update = function() {
	Sprite.prototype.update.call(this);
	if (this._duration > 0) {
		if (this._j._popups._mapAccumulatePhase !== true) {
			this._duration--;
		}
		for (let i = 0; i < this.children.length; i++) {
			this.updateChild(this.children[i]);
		}
	}
	this.updateFlash();
	this.updateOpacity();
	this.updateMergeCombinePulse();
};
/**
* Eases root scale after {@link #refreshDisplayedValue} so combined totals read as a pulse, not a silent swap.
*/
Sprite_MapDamage.prototype.updateMergeCombinePulse = function() {
	const idx = this._j._popups._mergePulseFrameIndex;
	const total = this._j._popups._mergePulseTotalFrames;
	const holdFrames = this._j._popups._mergePulseHoldFrames;
	if (idx >= total) {
		this.scale.x = 1;
		this.scale.y = 1;
		this._j._popups._mergePulseFlashAlpha = 0;
		return;
	}
	const peak = this._j._popups._mergePulsePeakScale;
	let scale = peak;
	if (idx >= holdFrames) {
		const decayFrames = Math.max(total - holdFrames, 1);
		const decayIndex = idx - holdFrames;
		const decayRatio = Math.min(decayIndex / decayFrames, 1);
		const easedRatio = Math.cos(Math.PI / 2 * decayRatio);
		scale = 1 + (peak - 1) * easedRatio;
	}
	const flashMaxAlpha = this._j._popups._mergePulseFlashMaxAlpha;
	if (flashMaxAlpha > 0) {
		const fadeRatio = 1 - idx / Math.max(total, 1);
		this._j._popups._mergePulseFlashAlpha = Math.round(flashMaxAlpha * fadeRatio);
	} else {
		this._j._popups._mergePulseFlashAlpha = 0;
	}
	this.scale.x = scale;
	this.scale.y = scale;
	this._j._popups._mergePulseFrameIndex = idx + 1;
};
/**
* Restarts the combine pulse when a merge refresh lands (stacking hits, slip ticks, mitigation counts).
*
* @param {boolean} largePulse Whether or not this pulse should be exaggerated.
*/
Sprite_MapDamage.prototype.kickMergeCombinePulse = function(largePulse = false) {
	const baseFrames = this._j._popups._mergePulseBaseFrames;
	this._j._popups._mergePulsePeakScale = largePulse ? 1.9 : 1.33;
	this._j._popups._mergePulseTotalFrames = largePulse ? baseFrames * 3 : baseFrames;
	this._j._popups._mergePulseHoldFrames = largePulse ? 6 : 0;
	this._j._popups._mergePulseFlashMaxAlpha = largePulse ? 192 : 0;
	this._j._popups._mergePulseFrameIndex = 0;
};
/**
* Ends the accumulation phase and allows normal bounce / flyaway motion to run.
*/
Sprite_MapDamage.prototype.releaseAccumulatePhase = function() {
	this._j._popups._mapAccumulatePhase = false;
	const baseDuration = J.POPUPS.Layout.BaseDuration;
	if (this._duration < baseDuration) {
		this._duration = baseDuration;
	}
};
/**
* Refreshes the primary value line without rebuilding icon geometry from scratch.
*
* @param {string} valueString The new display string (digits or mitigation label).
* @param {boolean} largePulse Whether or not this refresh should use an exaggerated combine pulse.
*/
Sprite_MapDamage.prototype.refreshDisplayedValue = function(valueString, largePulse = false) {
	let healingPopup = false;
	if (this._j._popups._sourcePopup && this._j._popups._sourcePopup.healing === true) {
		healingPopup = true;
	}
	const displayString = J.POPUPS.formatNumericPopupDisplayString(valueString, healingPopup);
	if (this._j._popups._sourcePopup) {
		this._j._popups._sourcePopup.value = displayString;
	}
	const iconRef = this._j._popups._iconSprite;
	const textSprite = this.children.find((child) => child !== iconRef && child.bitmap && child.bitmap.width === J.POPUPS.Layout.ValueBitmapWidth);
	if (!textSprite || !textSprite.bitmap) {
		return;
	}
	const w = J.POPUPS.Layout.ValueBitmapWidth;
	const h = this.fontSize();
	textSprite.bitmap.clear();
	let fontSize = 20;
	if (this._j._popups._isCritical) {
		fontSize += 12;
		textSprite.bitmap.fontBold = true;
	} else {
		const accent = this._j._popups._textAccent;
		const accentItalic = accent === "miss" || accent === "evade" || accent === "parry";
		const legacyItalic = displayString.includes("Missed") || displayString.includes("Evaded") || displayString.includes("Parry");
		if (accentItalic || legacyItalic) {
			fontSize -= 6;
			textSprite.bitmap.fontItalic = true;
		}
	}
	textSprite.bitmap.fontSize = fontSize;
	textSprite.bitmap.drawText(displayString, 0, 0, w, h, "center");
	this.repositionChildren();
	this.kickMergeCombinePulse(largePulse);
};
/**
* Gates motion during accumulation so numbers stay readable on the target.
*
* @param {Sprite} sprite Child motion sprite from {@link Sprite_Damage#createChildSprite}.
*/
Sprite_MapDamage.prototype.updateChild = function(sprite) {
	if (this._j._popups._mapAccumulatePhase === true) {
		const mergePulseFlashAlpha = this._j._popups._mergePulseFlashAlpha;
		if (mergePulseFlashAlpha > 0) {
			sprite.setBlendColor([
				255,
				64,
				64,
				mergePulseFlashAlpha
			]);
		} else {
			sprite.setBlendColor(this._flashColor);
		}
		return;
	}
	Sprite_Damage.prototype.updateChild.call(this, sprite);
};

//#endregion
//#region src/plugins/popups/core/_models/TextPopSpriteManager.js
/**
* A builder class for converting text pops to sprites.
*/
var TextPopSpriteManager = class {
	/**
	* Constructor.
	* A static class though, so don't construct it or you'll throw an error.
	*/
	constructor() {
		throw new Error(`The TextPopSpriteManager is a static class. Just use the "convert()" function on it.`);
	}
	/**
	* Converts a `Map_TextPop` into a {@link Sprite_MapDamage} (extends {@link Sprite_Damage}).
	* @param {Map_TextPop} popup The popup to convert.
	* @param {{ x?: number, y?: number }} ringExtra Extra offset from {@link J.POPUPS.consumeLayoutRingOffset}.
	* @returns {Sprite_MapDamage} The converted sprite.
	*/
	static convert(popup, ringExtra = {
		x: 0,
		y: 0
	}) {
		const sprite = new Sprite_MapDamage();
		const rx = ringExtra.x || 0;
		const ry = ringExtra.y || 0;
		sprite.setXVariance(popup.coordinateVariance[0] + rx);
		sprite.setYVariance(popup.coordinateVariance[1] + ry);
		if (popup.iconIndex > -1) {
			sprite.addIcon(popup.iconIndex);
		}
		sprite.addDuration(this.#getDurationByPopupType(popup.popupType));
		sprite.setHealingFlag(popup.healing);
		sprite.setDamageFlag(this.#isDamageFlagByPopupType(popup.popupType));
		sprite.setDamageColor(popup.textColorIndex);
		if (popup.critical) {
			sprite.setupCriticalEffect();
		}
		sprite._j._popups._textAccent = popup.textAccent || null;
		sprite._j._popups._sourcePopup = popup;
		sprite.createValue(popup.value);
		sprite.repositionChildren();
		if (popup.jInstantRelease !== false) {
			sprite.releaseAccumulatePhase();
		}
		return sprite;
	}
	/**
	* Gets the bonus duration based on the type of popup this is.
	* @param {Map_TextPop.Types} popupType The type of popup this is.
	* @returns {number} The bonus duration for this type.
	*/
	static #getDurationByPopupType(popupType) {
		switch (popupType) {
			case Map_TextPop.Types.HpDamage:
			case Map_TextPop.Types.MpDamage:
			case Map_TextPop.Types.TpDamage: return 30;
			case Map_TextPop.Types.Experience:
			case Map_TextPop.Types.Gold:
			case Map_TextPop.Types.Sdp:
			case Map_TextPop.Types.Item: return 120;
			case Map_TextPop.Types.Learn: return 120;
			case Map_TextPop.Types.Levelup: return 180;
			case Map_TextPop.Types.Parry:
			case Map_TextPop.Types.SkillUsage:
			case Map_TextPop.Types.Slip: return 0;
			default: return 0;
		}
	}
	/**
	* Checks whether or not the popup type is damage.
	* @param {Map_TextPop.Types} popupType The type of popup this is.
	* @returns {boolean} True if it is damage, false otherwise.
	*/
	static #isDamageFlagByPopupType(popupType) {
		switch (popupType) {
			case Map_TextPop.Types.HpDamage:
			case Map_TextPop.Types.MpDamage:
			case Map_TextPop.Types.TpDamage: return true;
			default: return false;
		}
	}
};

//#endregion
//#region src/plugins/popups/core/helpers/J_PopupLayoutRings.js
/**
* Step layout for each ring. Indices wrap at slotCount.
*/
J.POPUPS.Layout.RingLayout = {};
J.POPUPS.Layout.RingLayout[Map_TextPop.LayoutRings.EnemyDamage] = {
	slotCount: 8,
	stepX: J.POPUPS.Layout.RingStepX,
	stepY: J.POPUPS.Layout.RingStepY,
	dirX: 1,
	dirY: 1,
	baseX: 24,
	baseY: 24
};
J.POPUPS.Layout.RingLayout[Map_TextPop.LayoutRings.IncomingHeal] = {
	slotCount: 8,
	stepX: -J.POPUPS.Layout.RingStepX,
	stepY: J.POPUPS.Layout.RingStepY,
	dirX: 1,
	dirY: 1,
	baseX: -24,
	baseY: 24
};
J.POPUPS.Layout.RingLayout[Map_TextPop.LayoutRings.SlipDamage] = {
	slotCount: 8,
	stepX: J.POPUPS.Layout.RingStepX,
	stepY: -J.POPUPS.Layout.RingStepY,
	dirX: 1,
	dirY: 1,
	baseX: 24,
	baseY: -24
};
J.POPUPS.Layout.RingLayout[Map_TextPop.LayoutRings.Regen] = {
	slotCount: 8,
	stepX: -J.POPUPS.Layout.RingStepX,
	stepY: -J.POPUPS.Layout.RingStepY,
	dirX: 1,
	dirY: 1,
	baseX: -24,
	baseY: -24
};
J.POPUPS.Layout.RingLayout[Map_TextPop.LayoutRings.RewardUp] = {
	slotCount: 10,
	stepX: 0,
	stepY: -J.POPUPS.Layout.RingStepY,
	dirX: 1,
	dirY: 1,
	baseX: 0,
	baseY: -24
};
J.POPUPS.Layout.RingLayout[Map_TextPop.LayoutRings.LootDown] = {
	slotCount: 12,
	stepX: 0,
	stepY: J.POPUPS.Layout.RingStepY,
	dirX: 1,
	dirY: 1,
	baseX: 0,
	baseY: 24
};
/**
* Resolves how a popup participates in ring stacking vs center-only layout.
* @param {Map_TextPop} popup The queued popup model.
* @returns {{ usesRing: boolean, ring: string }} rings stack; center uses variance only.
*/
J.POPUPS.resolvePopupLayout = function(popup) {
	if (popup.layoutRing === Map_TextPop.LayoutRings.CenterFocus) {
		return {
			usesRing: false,
			ring: popup.layoutRing
		};
	}
	return {
		usesRing: true,
		ring: popup.layoutRing
	};
};
/**
* @param {Game_Character} character The anchor character.
* @returns {{}}
*/
J.POPUPS._getRingCountersForCharacter = function(character) {
	let state = J.POPUPS._layoutRingState.get(character);
	if (!state) {
		state = {};
		J.POPUPS._layoutRingState.set(character, state);
	}
	return state;
};
/**
* Advances the slot for this character and ring, returning pixel offset to add to builder variance.
* @param {Game_Character} character The anchor character.
* @param {Map_TextPop.LayoutRings} layoutRing The ring id.
* @returns {{ x: number, y: number }}
*/
J.POPUPS.consumeLayoutRingOffset = function(character, layoutRing) {
	const resolved = J.POPUPS.resolvePopupLayout({ layoutRing });
	if (resolved.usesRing === false) {
		return {
			x: 0,
			y: 0
		};
	}
	const spec = J.POPUPS.Layout.RingLayout[layoutRing];
	if (!spec) {
		return {
			x: 0,
			y: 0
		};
	}
	const counters = J.POPUPS._getRingCountersForCharacter(character);
	const lastTime = counters[`${layoutRing}_lastTime`] || 0;
	const currentTime = Graphics.frameCount;
	if (currentTime - lastTime > J.POPUPS.Layout.ResetDuration) {
		counters[layoutRing] = 0;
	}
	const idx = counters[layoutRing] || 0;
	counters[layoutRing] = (idx + 1) % spec.slotCount;
	counters[`${layoutRing}_lastTime`] = currentTime;
	const x = spec.stepX * idx * spec.dirX + (spec.baseX || 0);
	const y = spec.stepY * idx * spec.dirY + (spec.baseY || 0);
	return {
		x,
		y
	};
};
/**
* Resolves a simplified offset when motion is enabled.
* Healing to the left, damage to the right.
* @param {Map_TextPop} popup The popup model.
* @returns {{ x: number, y: number }}
*/
J.POPUPS.resolveMotionOffset = function(popup) {
	const px = J.POPUPS.Layout.PaddingX;
	const py = J.POPUPS.Layout.PaddingY;
	const x = popup.healing ? -px : px;
	let y = J.POPUPS.Layout.VerticalOffset + py;
	if (popup.healing) {
		switch (popup.popupType) {
			case Map_TextPop.Types.HpDamage:
				y -= 16;
				break;
			case Map_TextPop.Types.MpDamage:
				y += 0;
				break;
			case Map_TextPop.Types.TpDamage:
				y += 16;
				break;
		}
	}
	return {
		x,
		y
	};
};
/**
* @param {Map_TextPop} textPop The candidate popup.
* @returns {boolean} True if safe to queue.
*/
J.POPUPS.isValidTextPopForQueue = function(textPop) {
	if (!textPop || textPop.constructor !== Map_TextPop) {
		return false;
	}
	if (typeof textPop.layoutRing !== "string") {
		return false;
	}
	const known = Object.values(Map_TextPop.LayoutRings);
	for (let i = 0; i < known.length; i++) {
		if (known[i] === textPop.layoutRing) {
			return true;
		}
	}
	return false;
};

//#endregion
//#region src/plugins/popups/core/helpers/J_PopupNumericDisplay.js
/**
* Strips IEEE-754 dust from purely numeric popup labels immediately before bitmap draw.
*
* Floating merges (strike totals, slip ticks, …) can accumulate tiny fractional error in JS.
* Mitigation stacks, item names, and other letter-bearing labels must pass through untouched.
*
* @param {string|number} raw Value for {@link Sprite_Damage#createValue} or
* {@link Sprite_MapDamage#refreshDisplayedValue}.
* @param {boolean} [isHealingPopup] When true ( {@link Map_TextPop#healing} ), show regen/heal as `+N`
* using absolute magnitude — merge refreshes bypass {@link TextPopBuilder#makePopupValue}'s minus strip.
* @returns {string} Rounded integer text for numeric payloads; prose returns verbatim.
*/
J.POPUPS.formatNumericPopupDisplayString = function(raw, isHealingPopup) {
	const text = raw === undefined || raw === null ? "" : String(raw);
	const trimmed = text.trim();
	if (trimmed.length === 0) {
		return text;
	}
	if (/^[.\d-]+$/.test(trimmed) === false) {
		return text;
	}
	const n = Number(trimmed);
	if (!Number.isFinite(n)) {
		return text;
	}
	const rounded = Math.round(n);
	if (isHealingPopup === true) {
		return `+${Math.abs(rounded)}`;
	}
	return String(rounded);
};

//#endregion
//#region src/plugins/popups/core/helpers/J_PopupSpriteLocator.js
/**
* Locates the {@link Sprite_Character} that renders a given {@link Game_Character} on the current map scene.
*
* @param {Game_Character} gameCharacter The logical map character.
* @returns {Sprite_Character|null} The sprite wrapper when present.
*/
J.POPUPS.findSpriteCharacterForGameCharacter = function(gameCharacter) {
	const scene = SceneManager._scene;
	if (!scene || scene.constructor !== Scene_Map) {
		return null;
	}
	const spriteset = scene._spriteset;
	if (!spriteset || !spriteset._characterSprites) {
		return null;
	}
	const list = spriteset._characterSprites;
	for (let i = 0; i < list.length; i++) {
		const spriteCharacter = list[i];
		if (spriteCharacter.character() === gameCharacter) {
			return spriteCharacter;
		}
	}
	return null;
};

//#endregion
//#region src/plugins/popups/core/managers/TextPopManager.js
/**
* A static utility providing the canonical dispatch pattern for map popups.
* All popup extensions should route through here rather than calling
* addTextPop / requestTextPop directly, so the dispatch point stays singular.
*/
var TextPopManager = class {
	/**
	* Adds a single popup to a character and flags the flush request.
	* @param {Map_TextPop} pop The popup to display.
	* @param {Game_Character} character The character to anchor the popup on.
	*/
	static show(pop, character) {
		character.addTextPop(pop);
		character.requestTextPop();
	}
	/**
	* Adds multiple popups to a character, then flags a single flush request.
	* Prefer this over calling show() in a loop to avoid redundant flush signals.
	* @param {Map_TextPop[]} pops The popups to display.
	* @param {Game_Character} character The character to anchor the popups on.
	*/
	static showBatch(pops, character) {
		pops.forEach((pop) => character.addTextPop(pop));
		character.requestTextPop();
	}
};

//#endregion
//#region src/plugins/popups/core/sprites/Sprite_Damage.js
/**
* Extends this `.initialize()` function to include our parameters for all damage sprites.
*/
J.POPUPS.Aliased.Sprite_Damage.set("initialize", Sprite_Damage.prototype.initialize);
Sprite_Damage.prototype.initialize = function() {
	J.POPUPS.Aliased.Sprite_Damage.get("initialize").call(this);
	this.initMembers();
};
/**
* Initializes all members of this class.
*/
Sprite_Damage.prototype.initMembers = function() {
	/**
	* The master reference to the `_j` object containing all plugin properties.
	* @type {{}}
	*/
	this._j ||= {};
	/**
	* This plugins' relevant data points.
	* @type {{}}
	*/
	this._j._popups ||= {};
	/**
	* Whether or not this damage is flagged as critical.
	* @type {boolean}
	*/
	this._j._popups._isCritical = false;
	/**
	* Whether or not this damage is flagged as healing.
	* @type {boolean}
	*/
	this._j._popups._isHealing = false;
	/**
	* Whether or not this sprite is actually a damage popup, or a non-damage popup.
	* @type {boolean}
	*/
	this._j._popups._isDamage = false;
	/**
	* The text color index for this sprite's text.
	* @type {number}
	*/
	this._j._popups._damageColor = 0;
	/**
	* The x coordinate variance on this sprite.
	* @type {number}
	*/
	this._j._popups._xVariance = 0;
	/**
	* The y coordinate variance on this sprite.
	* @type {number}
	*/
	this._j._popups._yVariance = 0;
	/**
	* Typography hint from {@link Map_TextPop#textAccent}.
	* @type {string|null}
	*/
	this._j._popups._textAccent = null;
	/**
	* Source popup for lifecycle events (read-only for observers).
	* @type {Map_TextPop|null}
	*/
	this._j._popups._sourcePopup = null;
};
/**
* Gets whether or not this sprite is a damage popup.
* @returns {boolean} True if it is a damage popup, false if it is a non-damage popup.
*/
Sprite_Damage.prototype.isDamage = function() {
	return this._j._popups._isDamage;
};
/**
* Sets the damage flag to the specified value.
* @param {boolean} isDamage True if it is a damage popup, false if it is a non-damage popup.
*/
Sprite_Damage.prototype.setDamageFlag = function(isDamage) {
	this._j._popups._isDamage = isDamage;
};
/**
* Gets whether or not this sprite is a healing damage popup.
* @returns {boolean} True if it is a healing damage pop, false otherwise.
*/
Sprite_Damage.prototype.isHealing = function() {
	return this._j._popups._isHealing;
};
/**
* Sets the healing flag to the specified value.
* @param {boolean} isHealing True if it is a healing popup, false otherwise.
*/
Sprite_Damage.prototype.setHealingFlag = function(isHealing) {
	this._j._popups._isHealing = isHealing;
};
/**
* Get the x coordinate variance.
* @returns {number}
*/
Sprite_Damage.prototype.getXVariance = function() {
	return this._j._popups._xVariance;
};
/**
* Set the x variance for this damage sprite.
* @param {number} xVariance The x coordinate variance.
*/
Sprite_Damage.prototype.setXVariance = function(xVariance) {
	this._j._popups._xVariance = xVariance;
};
/**
* Get the y coordinate variance.
* @returns {number}
*/
Sprite_Damage.prototype.getYVariance = function() {
	return this._j._popups._yVariance;
};
/**
* Set the y variance for this damage sprite.
* @param {number} yVariance The y coordinate variance.
*/
Sprite_Damage.prototype.setYVariance = function(yVariance) {
	this._j._popups._yVariance = yVariance;
};
/**
* Extends `createChildSprite()` to add the additional properties to the child sprite.
*/
J.POPUPS.Aliased.Sprite_Damage.set("createChildSprite", Sprite_Damage.prototype.createChildSprite);
Sprite_Damage.prototype.createChildSprite = function(width, height) {
	const sprite = J.POPUPS.Aliased.Sprite_Damage.get("createChildSprite").call(this, width, height);
	this.setupMotionData(sprite);
	return sprite;
};
/**
* Sets up some additional variables
* @param sprite
*/
Sprite_Damage.prototype.setupMotionData = function(sprite) {
	sprite.anchor.x = .5;
	sprite.anchor.y = .5;
	const isMotionType = this.isDamage() || this.isHealing();
	if (J.POPUPS.Layout.Motion.Enabled === true && isMotionType) {
		sprite.y = 0;
		sprite.dy = J.POPUPS.Layout.Motion.InitialJump;
		sprite.zt = 0;
		sprite.ry = sprite.y;
		sprite.yf = 0;
		sprite.yf2 = 0;
		sprite.yf3 = 0;
		sprite.ex = false;
		sprite.bounceMaxX = sprite.x + J.POPUPS.Layout.Motion.MaxDrift;
	} else {
		sprite.y = J.POPUPS.Layout.VerticalOffset;
	}
};
/**
* Assigns the provided value to be the text of this popup.
* @param {string} value The value to display in the popup.
*/
Sprite_Damage.prototype.createValue = function(value) {
	let healingPopup = false;
	if (this._j._popups._sourcePopup && this._j._popups._sourcePopup.healing === true) {
		healingPopup = true;
	}
	const displayValue = J.POPUPS.formatNumericPopupDisplayString(value, healingPopup);
	if (this._j._popups._sourcePopup) {
		this._j._popups._sourcePopup.value = displayValue;
	}
	const w = J.POPUPS.Layout.ValueBitmapWidth;
	const h = this.fontSize();
	const sprite = this.createChildSprite(w, h);
	let fontSize = 20;
	if (this._j._popups._isCritical) {
		fontSize += 12;
		sprite.bitmap.fontBold = true;
	} else {
		const accent = this._j._popups._textAccent;
		const accentItalic = accent === "miss" || accent === "evade" || accent === "parry";
		const legacyItalic = displayValue.includes("Missed") || displayValue.includes("Evaded") || displayValue.includes("Parry");
		if (accentItalic || legacyItalic) {
			fontSize -= 6;
			sprite.bitmap.fontItalic = true;
		}
	}
	sprite.bitmap.fontSize = fontSize;
	sprite.bitmap.drawText(displayValue, 0, 0, w, h, "center");
};
/**
* Adds an icon to the damage sprite.
* @param {number} iconIndex The id/index of the icon on the iconset.
*/
Sprite_Damage.prototype.addIcon = function(iconIndex) {
	const sprite = this.createChildSprite(ImageManager.iconWidth, ImageManager.iconHeight);
	const bitmap = ImageManager.loadSystem("IconSet");
	const pw = ImageManager.iconWidth;
	const ph = ImageManager.iconHeight;
	const sx = iconIndex % 16 * pw;
	const sy = Math.floor(iconIndex / 16) * ph;
	sprite.bitmap.blt(bitmap, sx, sy, pw, ph, 0, 0);
	const iconScale = J.POPUPS.Layout.IconScale;
	sprite.scale.x = iconScale;
	sprite.scale.y = iconScale;
	this._j._popups._iconSprite = sprite;
	sprite.anchor.y = .5;
	sprite.x = 0;
};
/**
* Repositions children to be side-by-side if both icon and text exist.
*/
Sprite_Damage.prototype.repositionChildren = function() {
	const icon = this._j._popups._iconSprite;
	const text = this.children.find((child) => child !== icon && child.bitmap && child.bitmap.width === J.POPUPS.Layout.ValueBitmapWidth);
	if (icon && text) {
		const spacing = 4;
		const iconWidth = ImageManager.iconWidth * J.POPUPS.Layout.IconScale;
		const textWidth = text.bitmap.measureTextWidth(this._j._popups._sourcePopup.value);
		const totalWidth = iconWidth + spacing + textWidth;
		const startX = -(totalWidth / 2);
		icon.x = startX + iconWidth / 2;
		text.x = startX + iconWidth + spacing + textWidth / 2;
	}
};
/**
* Extends the duration of this sprite by the given amount in frames.
* @param {number} extraDuration The amount to extend in frames.
*/
Sprite_Damage.prototype.addDuration = function(extraDuration) {
	this._duration += extraDuration;
};
/**
* OVERWRITE Replaces the damage updating with our own motion management.
* @param {Sprite} sprite The sprite to udpate.
*/
Sprite_Damage.prototype.updateChild = function(sprite) {
	sprite.setBlendColor(this._flashColor);
	const isMotionType = this.isDamage() || this.isHealing();
	if (J.POPUPS.Layout.Motion.Enabled === true && isMotionType) {
		const style = J.POPUPS.Layout.Motion.Style;
		switch (style) {
			case J.POPUPS.MotionStyles.Bounce:
				if (this.isDamage()) {
					this.updateDamageSpriteMotion(sprite);
				} else {
					this.updateNonDamageSpriteMotion(sprite);
				}
				break;
			case J.POPUPS.MotionStyles.Flyaway:
				this.flyawayDamageSpriteMotion(sprite);
				break;
		}
	}
};
/**
* Updates the motion for the child of the non-damage sprite.
* NOTE: This is actually just copy-paste of the default bounce/motion that RMMZ uses.
* @param {Sprite} sprite The sprite to update.
*/
Sprite_Damage.prototype.updateNonDamageSpriteMotion = function(sprite) {
	sprite.dy += J.POPUPS.Layout.Motion.Gravity;
	sprite.ry += sprite.dy;
	if (sprite.ry >= 0) {
		sprite.ry = 0;
		sprite.dy *= -.6;
	}
	const drift = this.isHealing() ? -J.POPUPS.Layout.Motion.DriftSpeed : J.POPUPS.Layout.Motion.DriftSpeed;
	if (Math.abs(sprite.x) < J.POPUPS.Layout.Motion.MaxDrift) {
		sprite.x += drift;
	}
	sprite.y = Math.round(sprite.ry);
};
/**
* Updates the motion for the child of the damage sprite.
* @param {Sprite} sprite The sprite to update.
*/
Sprite_Damage.prototype.updateDamageSpriteMotion = function(sprite) {
	if (this.isHealing()) {
		this.updateNonDamageSpriteMotion(sprite);
	} else {
		this.defaultDamageSpriteMotion(sprite);
	}
};
/**
* The default motion for RMMZ's damage sprite children.
* The sprite bounces a little, and thats it.
* @param {Sprite} sprite The sprite to move.
*/
Sprite_Damage.prototype.defaultDamageSpriteMotion = function(sprite) {
	sprite.dy += J.POPUPS.Layout.Motion.Gravity;
	sprite.ry += sprite.dy;
	if (sprite.ry >= 0) {
		sprite.ry = 0;
		sprite.dy *= -.8;
	}
	const drift = this.isHealing() ? -J.POPUPS.Layout.Motion.DriftSpeed : J.POPUPS.Layout.Motion.DriftSpeed;
	if (Math.abs(sprite.x) < J.POPUPS.Layout.Motion.MaxDrift) {
		sprite.x += drift;
	}
	sprite.y = Math.round(sprite.ry);
};
/**
* A custom motion for damage sprites.
* Causes the damage sprite to fly vertically up and fade away.
* @param {Sprite} sprite The sprite to move.
*/
Sprite_Damage.prototype.flyawayDamageSpriteMotion = function(sprite) {
	sprite.yf3 -= 1;
	sprite.y = -sprite.yf2 + sprite.yf3;
	if (this._duration > 30) {
		sprite.opacity += 10;
	} else {
		sprite.opacity -= 10;
	}
};
/**
* OVERWRITE Updates the duration to start fading later, and for longer.
*/
Sprite_Damage.prototype.updateOpacity = function() {
	const baseDuration = J.POPUPS.Layout.BaseDuration;
	if (this._duration < baseDuration) {
		this.opacity = 255 * this._duration / baseDuration;
	}
};
/**
* Sets the color of the damage pop to be any of the text color indexes available.
* @param {number} damageColor The new color index.
*/
Sprite_Damage.prototype.setDamageColor = function(damageColor) {
	this._j._popups._damageColor = damageColor;
};
/**
* OVERWRITE Replaces the color with a designated color on-creation.
*/
Sprite_Damage.prototype.damageColor = function() {
	return ColorManager.textColor(this._j._popups._damageColor);
};
/**
* Applies the flash effects and extends duration of this sprite if the damage is critical.
*/
J.POPUPS.Aliased.Sprite_Damage.set("setupCriticalEffect", Sprite_Damage.prototype.setupCriticalEffect);
Sprite_Damage.prototype.setupCriticalEffect = function() {
	J.POPUPS.Aliased.Sprite_Damage.get("setupCriticalEffect").call(this);
	this._j._popups._isCritical = true;
	this._flashColor[3] = 240;
	this.addDuration(60);
};

//#endregion
//#region src/plugins/popups/core/sprites/Sprite_Character.js
/**
* Hooks into `Sprite_Character.initMembers` and adds our initiation for damage sprites.
*/
J.POPUPS.Aliased.Sprite_Character.set("initMembers", Sprite_Character.prototype.initMembers);
Sprite_Character.prototype.initMembers = function() {
	/**
	* The master reference to the `_j` object containing all plugin properties.
	* @type {{}}
	*/
	this._j ||= {};
	/**
	* This plugins' relevant data points.
	* @type {{}}
	*/
	this._j._popups ||= {};
	/**
	* The currently tracked damage pops, like weapon attacks or skills.
	* @type {Sprite_Damage[]}
	*/
	this._j._popups._damagePopSprites = [];
	/**
	* The currently tracked non-damage pops, like found loot or earned experience.
	* @type {Sprite_Damage[]}
	*/
	this._j._popups._nonDamagePopSprites = [];
	J.POPUPS.Aliased.Sprite_Character.get("initMembers").call(this);
};
/**
* Determines whether or not this character has damage pops.
* @returns {boolean} True if we have any, false otherwise.
*/
Sprite_Character.prototype.hasDamagePops = function() {
	return this._j._popups._damagePopSprites.length > 0;
};
/**
* Gets all damage pop sprites currently being tracked.
* @returns {Sprite_Damage[]}
*/
Sprite_Character.prototype.getDamagePops = function() {
	return this._j._popups._damagePopSprites;
};
/**
* Determines whether or not this character has non damage pops.
* @returns {boolean} True if we have any, false otherwise.
*/
Sprite_Character.prototype.hasNonDamagePops = function() {
	return this._j._popups._nonDamagePopSprites.length > 0;
};
/**
* Gets all non damage pop sprites currently being tracked.
* @returns {Sprite_Damage[]}
*/
Sprite_Character.prototype.getNonDamagePops = function() {
	return this._j._popups._nonDamagePopSprites;
};
/**
* Cleans up the `undefined` or `null` damage pop sprites that are invalid.
*/
Sprite_Character.prototype.cleanupDamagePops = function() {
	this._j._popups._damagePopSprites = this._j._popups._damagePopSprites.filter((pop) => !!pop);
};
/**
* Cleans up the `undefined` or `null` non damage pop sprites that are invalid.
*/
Sprite_Character.prototype.cleanupNonDamagePops = function() {
	this._j._popups._nonDamagePopSprites = this._j._popups._nonDamagePopSprites.filter((pop) => !!pop);
};
/**
* Hooks into the `Sprite_Character.update` and adds our ABS updates.
*/
J.POPUPS.Aliased.Sprite_Character.set("update", Sprite_Character.prototype.update);
Sprite_Character.prototype.update = function() {
	J.POPUPS.Aliased.Sprite_Character.get("update").call(this);
	this.processIncomingTextPops();
	this.updateTextPops();
};
/**
* Listens for a notification to process any new popups.
*/
Sprite_Character.prototype.processIncomingTextPops = function() {
	const character = this.character();
	if (character.hasTextPops()) {
		this.createIncomingTextPops();
		character.acknowledgeTextPops();
	}
};
/**
* Processes all of the popups that a `Game_Character` currently has on them.
*/
Sprite_Character.prototype.createIncomingTextPops = function() {
	const character = this.character();
	const newPopups = character.getTextPops();
	if (newPopups.length) {
		newPopups.forEach(this.createIncomingTextPop, this);
		character.emptyDamagePops();
	}
};
/**
* Creates a single incoming text pop.
* @param {Map_TextPop} popup The popup data.
*/
Sprite_Character.prototype.createIncomingTextPop = function(popup) {
	const character = this.character();
	const isMotionType = popup.popupType === Map_TextPop.Types.HpDamage || popup.popupType === Map_TextPop.Types.MpDamage || popup.popupType === Map_TextPop.Types.TpDamage || popup.healing === true;
	const useMotion = J.POPUPS.Layout.Motion.Enabled === true && isMotionType;
	const ringExtra = useMotion ? J.POPUPS.resolveMotionOffset(popup) : J.POPUPS.consumeLayoutRingOffset(character, popup.layoutRing);
	const sprite = TextPopSpriteManager.convert(popup, ringExtra);
	if (sprite.isDamage()) {
		this._j._popups._damagePopSprites.push(sprite);
	} else {
		this._j._popups._nonDamagePopSprites.push(sprite);
	}
	this.parent.addChild(sprite);
	J.POPUPS.notifyPopupSpriteSpawned(character, popup, sprite);
};
/**
* Parents a converted popup sprite that bypassed the pending queue (merge accumulation path).
*
* @param {Sprite_Damage} sprite The sprite from {@link TextPopSpriteManager.convert}.
* @param {Map_TextPop} popup The source popup model.
*/
Sprite_Character.prototype.attachConvertedDamagePopupSprite = function(sprite, popup) {
	if (sprite.isDamage()) {
		this._j._popups._damagePopSprites.push(sprite);
	} else {
		this._j._popups._nonDamagePopSprites.push(sprite);
	}
	this.parent.addChild(sprite);
	J.POPUPS.notifyPopupSpriteSpawned(this.character(), popup, sprite);
};
/**
* Handle the updating and processing of text popups.
*/
Sprite_Character.prototype.updateTextPops = function() {
	if (this.hasDamagePops()) {
		this.updateDamagePops();
	}
	if (this.hasNonDamagePops()) {
		this.updateNonDamagePops();
	}
};
/**
* Updates all damage popup sprites on this character.
*/
Sprite_Character.prototype.updateDamagePops = function() {
	this._updateTrackedPopupBucket(this.getDamagePops(), this.updateDamagePopLocation);
};
/**
* Updates all non-damage popup sprites on this character.
*/
Sprite_Character.prototype.updateNonDamagePops = function() {
	this._updateTrackedPopupBucket(this.getNonDamagePops(), this.updateNonDamagePopLocation);
};
/**
* Updates every sprite in a popup bucket; compacts the array after removals.
* @param {Sprite_Damage[]} bucket The live sprite list.
* @param {function(Sprite_Damage): void} updateLocationFn Hook for positioning (damage vs non-damage override).
*/
Sprite_Character.prototype._updateTrackedPopupBucket = function(bucket, updateLocationFn) {
	const deletedFlags = bucket.map((pop, index) => {
		if (!pop) return false;
		pop.update();
		updateLocationFn.call(this, pop);
		if (!pop.isPlaying()) {
			this._removeTrackedPopSprite(pop, index, bucket);
			return true;
		}
		return false;
	}, this);
	if (deletedFlags.some((flag) => flag === true)) {
		const next = bucket.filter((entry) => !!entry);
		bucket.length = 0;
		for (let i = 0; i < next.length; i++) {
			bucket.push(next[i]);
		}
	}
};
/**
* Detaches a finished popup, emits lifecycle, and destroys the sprite.
* @param {Sprite_Damage} sprite The popup sprite.
* @param {number} index Index in the bucket (may be sparse).
* @param {Sprite_Damage[]} bucket Owning array.
*/
Sprite_Character.prototype._removeTrackedPopSprite = function(sprite, index, bucket) {
	const character = this.character();
	this.parent.removeChild(sprite);
	J.POPUPS.notifyPopupSpriteFinished(character, sprite._j._popups._sourcePopup, sprite);
	sprite.destroy();
	delete bucket[index];
};
/**
* Default anchor for map text pops (override for custom layout).
* @param {Sprite_Damage} popSprite The popup sprite.
*/
Sprite_Character.prototype.updateTextPopAnchorPosition = function(popSprite) {
	const ox = J.POPUPS.Layout.AnchorOffsetX + J.POPUPS.Layout.HorizontalOffset;
	popSprite.x = this.x + ox + popSprite.getXVariance();
	popSprite.y = this.y + popSprite.getYVariance();
};
/**
* Handles the motion that a damage popup goes through.
* @param {Sprite_Damage} damageSprite The damage sprite that is moving.
*/
Sprite_Character.prototype.updateDamagePopLocation = function(damageSprite) {
	this.updateTextPopAnchorPosition(damageSprite);
};
/**
* Handles the motion that a non-damage popup goes through.
* @param {Sprite_Damage} nonDamageSprite The popup that is moving.
*/
Sprite_Character.prototype.updateNonDamagePopLocation = function(nonDamageSprite) {
	this.updateTextPopAnchorPosition(nonDamageSprite);
};

//#endregion
//#region src/plugins/popups/core/objects/Game_Character.js
/**
* Hooks into the `Game_Character.initMembers` and adds in action sprite properties.
*/
J.POPUPS.Aliased.Game_Character.set("initMembers", Game_Character.prototype.initMembers);
Game_Character.prototype.initMembers = function() {
	/**
	* The master reference to the `_j` object containing all plugin properties.
	* @type {{}}
	*/
	this._j ||= {};
	/**
	* The text pops that are pending processing.
	* @type {Map_TextPop[]}
	*/
	this._j._textPops = [];
	/**
	* Whether or not this character has a request for generating damage pops.
	* @type {boolean}
	*/
	this._j._textPopRequest = false;
	J.POPUPS.Aliased.Game_Character.get("initMembers").call(this);
};
/**
* Gets the `requestDamagePop` property from the `actionSpriteProperties` for this event.
*/
Game_Character.prototype.hasTextPops = function() {
	if (J.POPUPS.Metadata.disablePopups === true) return false;
	return this._j._textPopRequest;
};
/**
* Flags this character for requiring text pops to be processed.
*/
Game_Character.prototype.requestTextPop = function() {
	if (J.POPUPS.Metadata.disablePopups === true) return;
	this._j._textPopRequest = true;
	J.POPUPS.notifyPopupFlushRequested(this);
};
/**
* Acknowledges the request for generating text pops.
*/
Game_Character.prototype.acknowledgeTextPops = function() {
	this._j._textPopRequest = false;
};
/**
* Adds a text pop to this character.
* @param {Map_TextPop} textPop A text pop that will be displayed on the map.
*/
Game_Character.prototype.addTextPop = function(textPop) {
	if (J.POPUPS.Metadata.disablePopups === true) return;
	if (J.POPUPS.isValidTextPopForQueue(textPop) === false) {
		console.warn(`[${J.POPUPS.Metadata.name}] addTextPop rejected invalid Map_TextPop (bad type or layoutRing).`, textPop);
		return;
	}
	this._j._textPops.push(textPop);
	J.POPUPS.notifyPopupQueued(this, textPop);
};
/**
* Gets all currently waiting-to-be-processed text pops.
* @returns {Map_TextPop[]}
*/
Game_Character.prototype.getTextPops = function() {
	return this._j._textPops;
};
/**
* Remove all text pops from the collection.
*/
Game_Character.prototype.emptyDamagePops = function() {
	const textPops = this.getTextPops();
	textPops.splice(0, textPops.length);
};
/**
* Preferred name for clearing the pending popup queue (same as emptyDamagePops).
*/
Game_Character.prototype.clearPendingTextPops = function() {
	this.emptyDamagePops();
};

//#endregion
//# sourceMappingURL=J-Popups.js.map