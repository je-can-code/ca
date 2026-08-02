//region introduction
/*:
 * @target MZ
 * @plugindesc
 * [v1.3.1 HUD-PARTY] A HUD frame that displays your party's data.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @base J-ABS
 * @base J-HUD
 * @orderAfter J-Base
 * @orderAfter J-ABS
 * @orderAfter J-HUD
 * @orderBefore J-ABS-Shield
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin is an extension of the J-HUD system.
 *
 * This is the Party Frame, which displays the leader and allied members that
 * the player currently has in their party.
 *
 * This plugin requires JABS.
 * This plugin requires the base HUD.
 * This plugin has no additional configuration required.
 * ----------------------------------------------------------------------------
 * DETAILS:
 * This includes the following data points for all actors:
 * - face portrait
 * - hp gauge
 * - mp gauge
 * - tp gauge
 *
 * And the additional following data points for the currently selected leader:
 * - current level
 * - experience gauge
 * - positive/negative state tracking
 * - in combat indicator
 * - shield gauge (if using J-ABS-Shield)
 * ============================================================================
 * NOTE ABOUT NOTETAGS:
 * This plugin has no notetags of its own- it purely reads live battler data
 * for display.
 * ============================================================================
 * CHANGELOG:
 * - 1.3.1
 *    Fixed boot and load failures left behind by the quick menu pare-down:
 *    Scene_Map#createJabsAbsMenu still called the six create-window methods
 *    that went with the removed assignment flows, so loading any save crashed
 *    before the map finished building. The quick menu has one window left.
 * - 1.3.0
 *    Leader affliction rendering now delegates to J-HUD core's shared
 *    StateAfflictionHudPresenter/StateAfflictionHudLayoutSpec instead of a
 *    duplicated local implementation (removed ~300 lines of local code).
 *    Window backdrop opacity default changed from 32 to fully transparent (0).
 * - 1.2.0
 *    Integrated J-ABS-Shields; supports display for shield gauge.
 *    Updated many classes to use modern class syntax.
 *    Updated visuals for clarity across many aspects of the HUD.
 * - 1.1.0
 *    Added visual tracking indicator for "in combat" for the leader.
 *    Retroactively added this changelog.
 * - 1.0.0
 *    Initial release.
 * ============================================================================
 */

//#region src/plugins/hud/ext/party/_metadata/_pluginMetadata.js
var JHudParty_PluginMetadata = class extends PluginMetadata {
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
//#region src/plugins/hud/ext/party/_metadata/initialization.js
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
	const requiredHudVersion = "2.0.0";
	const hasHudRequirement = J.BASE.Helpers.satisfies(J.HUD.Metadata.version.version(), requiredHudVersion);
	if (hasHudRequirement === false) {
		throw new Error(`Either missing J-HUD or has a lower version than the required: ${requiredHudVersion}`);
	}
})();
/**
* The plugin umbrella that governs all things related to this plugin.
*/
J.HUD.EXT.PARTY = {};
/**
* The `metadata` associated with this plugin, such as version.
* @type {JHudParty_PluginMetadata}
*/
J.HUD.EXT.PARTY.Metadata = new JHudParty_PluginMetadata("J-HUD-PartyFrame", "1.3.1");
/**
* A collection of all aliased methods for this plugin.
*/
J.HUD.EXT.PARTY.Aliased = { Scene_Map: new Map() };

//#endregion
//#region src/plugins/hud/ext/party/windows/Window_PartyFrame.js
/**
* A window containing the HUD data for the {@link Game_Party}.
*/
var Window_PartyFrame = class Window_PartyFrame extends Window_Base {
	/**
	* The static collection of gauge types supported.
	*/
	static gaugeTypes = {
		/**
		* The type of gauge for hp.
		*/
		HP: "hp",
		/**
		* The type of gauge for mp.
		*/
		MP: "mp",
		/**
		* The type of gauge for tp.
		*/
		TP: "tp",
		/**
		* The type of gauge for xp.
		* We borrow the "time" gauge for this, though.
		*/
		XP: "time",
		/**
		* Not actually a gauge, but does have an actorvalue representing
		* the actor's level.
		*/
		Level: "lvl"
	};
	/**
	* Constructor.
	* @param {Rectangle} rect The shape representing this window.
	*/
	constructor(rect) {
		super(rect);
	}
	/**
	* Initializes this class.
	* @param {Rectangle} rect The shape representing this window.
	*/
	initialize(rect) {
		super.initialize(rect);
		this.initMembers();
		this.configure();
		this.refresh();
	}
	/**
	* Initialize all properties of this class.
	*/
	initMembers() {
		/**
		* The cached collection of hud sprites.
		* @type {Map<string, Sprite_Face|Sprite_MapGauge|Sprite_ActorValue|Sprite_Icon|Sprite_BaseText>}
		*/
		this._hudSprites = new Map();
		/**
		* Shared affliction presenter for the leader row.
		* @type {StateAfflictionHudPresenter}
		*/
		this._afflictionPresenter = new StateAfflictionHudPresenter(this, this._hudSprites);
	}
	/**
	* Gets the hud sprites.
	* @returns {Map<string, Sprite_Face|Sprite_MapGauge|Sprite_ActorValue|Sprite_Icon|Sprite_BaseText>} The hudSprites.
	*/
	hudSprites() {
		return this._hudSprites;
	}
	/**
	* Gets the affliction presenter.
	* @returns {StateAfflictionHudPresenter} The afflictionPresenter.
	*/
	afflictionPresenter() {
		return this._afflictionPresenter;
	}
	/**
	* Performs the one-time setup and configuration per instantiation.
	*/
	configure() {
		this.opacity = 0;
		this.refreshCache();
	}
	/**
	* Redraw all contents of the window.
	*/
	refresh() {
		this.contents.clear();
		this.hideSprites();
		this.drawHud();
	}
	/**
	* Hide all sprites for the hud.
	*/
	hideSprites() {
		this.hudSprites().forEach((sprite, _) => {
			sprite.hide();
		});
	}
	/**
	* Empties and recreates the entire cache of sprites.
	*/
	refreshCache() {
		this.emptyCache();
		this.createCache();
	}
	/**
	* Empties the cache of all sprites.
	*/
	emptyCache() {
		this.hudSprites().forEach((value, _) => value.destroy());
		this.hudSprites().clear();
	}
	/**
	* Creates all sprites for this hud and caches them.
	*/
	createCache() {
		const gaugeTypes = this.gaugeTypes();
		$gameParty.battleMembers().forEach((actor) => {
			this.getOrCreateFullSizeFaceSprite(actor);
			this.getOrCreateMiniSizeFaceSprite(actor);
			gaugeTypes.forEach((gaugeType) => {
				this.getOrCreateFullSizeGaugeSprite(actor, gaugeType);
				this.getOrCreateMiniSizeGaugeSprite(actor, gaugeType);
				this.getOrCreateActorValueSprite(actor, gaugeType);
			});
		});
	}
	/**
	* Creates the key for an actor's face sprite based on the parameters.
	* @param {Game_Actor} actor The actor to create a key for.
	* @param {boolean} isFull Whether or not this is for a full-sized sprite.
	* @returns {string}
	*/
	makeFaceSpriteKey(actor, isFull) {
		return isFull ? `face-full-${actor.name()}-${actor.actorId()}` : `face-mini-${actor.name()}-${actor.actorId()}`;
	}
	/**
	* Creates a full-sized face sprite for the given actor and caches it.
	* @param {Game_Actor} actor The actor to draw a full face sprite for.
	* @returns {Sprite_Face} The full face sprite of the actor.
	*/
	getOrCreateFullSizeFaceSprite(actor) {
		const key = this.makeFaceSpriteKey(actor, true);
		if (this.hudSprites().has(key)) {
			return this.hudSprites().get(key);
		}
		const sprite = new Sprite_Face(actor.faceName(), actor.faceIndex());
		sprite.scale.x = 1;
		sprite.scale.y = 1;
		this.hudSprites().set(key, sprite);
		sprite.hide();
		this.addChild(sprite);
		return sprite;
	}
	/**
	* Creates a mini-sized face sprite for the given actor and caches it.
	* @param {Game_Actor} actor The actor to draw a mini face sprite for.
	* @returns {Sprite_Face} The mini face sprite of the actor.
	*/
	getOrCreateMiniSizeFaceSprite(actor) {
		const key = this.makeFaceSpriteKey(actor, false);
		if (this.hudSprites().has(key)) {
			return this.hudSprites().get(key);
		}
		const sprite = new Sprite_Face(actor.faceName(), actor.faceIndex());
		sprite.scale.x = .3;
		sprite.scale.y = .3;
		this.hudSprites().set(key, sprite);
		sprite.hide();
		this.addChild(sprite);
		return sprite;
	}
	/**
	* An array of all gauge types; for convenience.
	* @returns {string[]} The gauge types in a given order.
	*/
	gaugeTypes() {
		return [
			Window_PartyFrame.gaugeTypes.HP,
			Window_PartyFrame.gaugeTypes.MP,
			Window_PartyFrame.gaugeTypes.TP,
			Window_PartyFrame.gaugeTypes.XP
		];
	}
	/**
	* Creates the key for an actor's gauge sprite based on the parameters.
	* @param {Game_Actor} actor The actor to draw a full gauge sprite for.
	* @param {boolean} isFull Whether or not this is for a full-sized sprite.
	* @param {Window_PartyFrame.gaugeTypes} gaugeType The type of gauge this is.
	* @returns {string} The key for this gauge sprite.
	*/
	makeGaugeSpriteKey(actor, isFull, gaugeType) {
		const gaugeSize = isFull ? `full` : `mini`;
		return `gauge-${gaugeType}-${gaugeSize}-${actor.name()}-${actor.actorId()}`;
	}
	/**
	* Creates a full-sized gauge sprite for the given actor and caches it.
	* @param {Game_Actor} actor The actor to draw a gauge sprite for.
	* @param {Window_PartyFrame.gaugeTypes} gaugeType The type of gauge this is.
	* @returns {Sprite_MapGauge} The gauge sprite.
	*/
	getOrCreateFullSizeGaugeSprite(actor, gaugeType) {
		const key = this.makeGaugeSpriteKey(actor, true, gaugeType);
		if (this.hudSprites().has(key)) {
			return this.hudSprites().get(key);
		}
		const gaugeHeight = gaugeType === Window_PartyFrame.gaugeTypes.XP ? 12 : 24;
		const gaugeWidth = gaugeType === Window_PartyFrame.gaugeTypes.XP ? 114 : 144;
		const sprite = new Sprite_MapGauge(gaugeWidth, gaugeHeight, gaugeHeight);
		sprite.setup(actor, gaugeType);
		sprite.deactivateGauge();
		this.hudSprites().set(key, sprite);
		sprite.hide();
		this.addChild(sprite);
		return sprite;
	}
	/**
	* Creates a mini-sized gauge sprite for the given actor and caches it.
	* @param {Game_Actor} actor The actor to draw a gauge sprite for.
	* @param {Window_PartyFrame.gaugeTypes} gaugeType The type of gauge this is.
	* @returns {Sprite_MapGauge} The gauge sprite.
	*/
	getOrCreateMiniSizeGaugeSprite(actor, gaugeType) {
		const key = this.makeGaugeSpriteKey(actor, false, gaugeType);
		if (this.hudSprites().has(key)) {
			return this.hudSprites().get(key);
		}
		const bitmapHeight = 12;
		const bitmapWidth = gaugeType === Window_PartyFrame.gaugeTypes.XP ? 42 : 96;
		const sprite = new Sprite_MapGauge(bitmapWidth, bitmapHeight, bitmapHeight);
		sprite.setup(actor, gaugeType);
		sprite.deactivateGauge();
		this.hudSprites().set(key, sprite);
		sprite.hide();
		this.addChild(sprite);
		return sprite;
	}
	/**
	* Creates the key for an actor's gauge value sprite based on the parameters.
	* @param {Game_Actor} actor The actor to draw a actor value sprite for.
	* @param {Window_PartyFrame.gaugeTypes} gaugeType The type of actor value this is.
	* @returns {string} The key for this actor value sprite.
	*/
	makeValueSpriteKey(actor, gaugeType) {
		return `value-${gaugeType}-${actor.name()}-${actor.actorId()}`;
	}
	/**
	* Creates a actor value sprite for the given actor's gauge and caches it.
	*
	* It is important to note that there is no "mini" size of actor values!
	* Allies simply will not display the values, only gauges.
	* @param {Game_Actor} actor The actor to draw a gauge sprite for.
	* @param {Window_PartyFrame.gaugeTypes} gaugeType The type of gauge this is.
	* @returns {Sprite_MapGauge} The gauge sprite.
	*/
	getOrCreateActorValueSprite(actor, gaugeType) {
		const key = this.makeValueSpriteKey(actor, gaugeType);
		if (this.hudSprites().has(key)) {
			return this.hudSprites().get(key);
		}
		const valueFontSize = gaugeType === Window_PartyFrame.gaugeTypes.XP ? -6 : -2;
		const sprite = new Sprite_ActorValue(actor, gaugeType, valueFontSize);
		this.hudSprites().set(key, sprite);
		sprite.hide();
		this.addChild(sprite);
		return sprite;
	}
	/**
	* Creates or retrieves the combat icon sprite for the given actor.
	* @param {Game_Actor} actor The actor this icon represents.
	* @returns {Sprite_Icon} The combat icon sprite.
	*/
	getOrCreateCombatIcon(actor) {
		const key = `combat-icon-${actor.name()}-${actor.actorId()}`;
		if (this.hudSprites().has(key)) {
			return this.hudSprites().get(key);
		}
		const iconIndex = 31;
		const sprite = new Sprite_Icon(iconIndex);
		sprite.selfManageOpacity();
		this.hudSprites().set(key, sprite);
		sprite.hide();
		this.addChild(sprite);
		return sprite;
	}
	/**
	* Creates or retrieves the combat timer sprite for the given actor.
	* @param {Game_Actor} actor The actor this timer represents.
	* @returns {Sprite_BaseText} The combat seconds text sprite.
	*/
	getOrCreateCombatTimer(actor) {
		const key = `combat-timer-${actor.name()}-${actor.actorId()}`;
		if (this.hudSprites().has(key)) {
			return this.hudSprites().get(key);
		}
		const sprite = new Sprite_BaseText(String.empty);
		sprite.setFontFace($gameSystem.numberFontFace());
		sprite.setFontSize($gameSystem.mainFontSize() - 8);
		sprite.setAlignment(Sprite_BaseText.Alignments.Center);
		sprite.setMinWidth(ImageManager.iconWidth);
		sprite.selfManageOpacity();
		sprite.hide();
		this.hudSprites().set(key, sprite);
		this.addChild(sprite);
		return sprite;
	}
	/**
	* Creates or retrieves the combat label sprite for the given actor.
	* Shows a text blurb like "IN COMBAT" or "FREE" near the combat icon.
	* @param {Game_Actor} actor The actor this label represents.
	* @returns {Sprite_BaseText} The combat status label sprite.
	*/
	getOrCreateCombatLabel(actor) {
		const key = `combat-label-${actor.name()}-${actor.actorId()}`;
		if (this.hudSprites().has(key)) {
			return this.hudSprites().get(key);
		}
		const sprite = new Sprite_BaseText(String.empty);
		sprite.setFontFace($gameSystem.mainFontFace()).setFontSize($gameSystem.mainFontSize() - 8).setAlignment(Sprite_BaseText.Alignments.Center).setBold(true).setItalics(true).setMinWidth(Math.round(ImageManager.iconWidth * 2.5)).selfManageOpacity();
		this.hudSprites().set(key, sprite);
		this.addChild(sprite);
		return sprite;
	}
	/**
	* The per-frame update of this window.
	*/
	update() {
		super.update();
		this.drawHud();
	}
	/**
	* Manages visibility for the hud.
	*/
	manageVisibility() {
		this.handleMessageWindowInterference();
		if (this.playerInterference()) {
			this.handlePlayerInterference();
		} else {
			this.revertInterferenceOpacity();
		}
	}
	/**
	* Close and open the window based on whether or not the message window is up.
	*/
	handleMessageWindowInterference() {
		if ($gameMessage.isBusy() || $gameMap.isEventRunning()) {
			if (!this.isClosed()) {
				this.hideSprites();
				this.close();
			}
		} else {
			this.open();
		}
	}
	/**
	* Determines whether or not the player is in the way (or near it) of this window.
	* @returns {boolean} True if the player is in the way, false otherwise.
	*/
	playerInterference() {
		const playerX = $gamePlayer.screenX();
		const playerY = $gamePlayer.screenY();
		return playerX < this.width - 100 && playerY > this.y + 200;
	}
	/**
	* Manages opacity for all sprites while the player is interfering with the visibility.
	*/
	handlePlayerInterference() {
		this.hudSprites().forEach((sprite, _) => {
			if (this.canHandleSpriteInterference(sprite) === false) return;
			if (sprite.opacity > 64) {
				sprite.opacity -= 15;
			} else if (sprite.opacity < 64) {
				sprite.opacity += 1;
			}
		}, this);
	}
	/**
	* Reverts the opacity changes associated with the player getting in the way.
	*/
	revertInterferenceOpacity() {
		this.hudSprites().forEach((sprite, _) => {
			if (this.canHandleSpriteInterference(sprite) === false) return;
			if (sprite.opacity < 255) {
				sprite.opacity += 15;
			} else if (sprite.opacity > 255) {
				sprite.opacity = 255;
			}
		}, this);
	}
	/**
	* Checks if the given sprite should be handled for interference.
	* @param {Sprite_Face|Sprite_MapGauge|Sprite_ActorValue|Sprite_Icon|Sprite_BaseText} sprite The sprite driving this step.
	* @returns {boolean}
	*/
	canHandleSpriteInterference(sprite) {
		if (sprite.hasSelfManagedOpacity() === true) return false;
		return true;
	}
	/**
	* Draws the contents of the HUD.
	*/
	drawHud() {
		if (!$hudManager.canShowHud()) return;
		this.manageVisibility();
		const leaderX = 0;
		const leaderY = 0;
		this.drawLeader(leaderX, leaderY);
		if (!$hudManager.canShowAllies()) return;
		const alliesY = this.height - ImageManager.faceHeight - (this.lineHeight() + 12);
		this.drawAllies(leaderX, alliesY);
	}
	/**
	* Draw the leader's data for the HUD.
	* @param {number} x The x coordinate.
	* @param {number} y The y coordinate.
	*/
	drawLeader(x, y) {
		if (!$gameParty.leader()) return;
		const faceY = y + (this.height - ImageManager.faceHeight);
		this.drawLeaderFace(x, faceY);
		const gaugesX = x + ImageManager.faceWidth;
		const gaugeHeight = 24;
		const gaugesY = this.height - gaugeHeight * 3;
		this.drawLeaderResourceGauges(gaugesX, gaugesY);
		const extraneousX = x + 12;
		const extraneousY = faceY;
		this.drawLeaderExtraneousGauges(extraneousX, extraneousY);
		const layout = new StateAfflictionHudLayoutSpec();
		layout.originX = gaugesX;
		layout.originY = gaugesY - ImageManager.iconHeight * 2 - 48;
		this.afflictionPresenter().render($gameParty.leader(), layout);
		this.drawLeaderCombatIndicator(gaugesX, gaugesY);
	}
	/**
	* Draw the leader's face.
	* @param {number} x The x coordinate.
	* @param {number} y The y coordinate.
	*/
	drawLeaderFace(x, y) {
		const leader = $gameParty.leader();
		const sprite = this.getOrCreateFullSizeFaceSprite(leader);
		sprite.move(x, y);
		sprite.show();
	}
	/**
	* Draws all the various resource gauges for the leader.
	* @param {number} x The x coordinate.
	* @param {number} y The y coordinate.
	*/
	drawLeaderResourceGauges(x, y) {
		const leader = $gameParty.leader();
		const numbersX = x + 12;
		const hpGauge = this.getOrCreateFullSizeGaugeSprite(leader, Window_PartyFrame.gaugeTypes.HP);
		hpGauge.activateGauge();
		hpGauge.move(x, y);
		hpGauge.show();
		const hpNumbers = this.getOrCreateActorValueSprite(leader, Window_PartyFrame.gaugeTypes.HP);
		hpNumbers.move(numbersX, y - 2);
		hpNumbers.show();
		const mpGaugeY = y + 24;
		const mpGauge = this.getOrCreateFullSizeGaugeSprite(leader, Window_PartyFrame.gaugeTypes.MP);
		mpGauge.activateGauge();
		mpGauge.move(x, mpGaugeY);
		mpGauge.show();
		const mpNumbers = this.getOrCreateActorValueSprite(leader, Window_PartyFrame.gaugeTypes.MP);
		mpNumbers.move(numbersX, mpGaugeY - 2);
		mpNumbers.show();
		const tpGaugeY = y + 48;
		const tpGauge = this.getOrCreateFullSizeGaugeSprite(leader, Window_PartyFrame.gaugeTypes.TP);
		tpGauge.activateGauge();
		tpGauge.move(x, tpGaugeY);
		tpGauge.show();
		const tpNumbers = this.getOrCreateActorValueSprite(leader, Window_PartyFrame.gaugeTypes.TP);
		tpNumbers.move(numbersX, tpGaugeY - 2);
		tpNumbers.show();
	}
	/**
	* Draws all the extraneous resource gauges for the leader.
	* @param {number} x The x coordinate.
	* @param {number} y The y coordinate.
	*/
	drawLeaderExtraneousGauges(x, y) {
		const leader = $gameParty.leader();
		const xpY = y;
		const xpGauge = this.getOrCreateFullSizeGaugeSprite(leader, Window_PartyFrame.gaugeTypes.XP);
		xpGauge.activateGauge();
		xpGauge.move(x, xpY);
		xpGauge.show();
		const xpNumbers = this.getOrCreateActorValueSprite(leader, Window_PartyFrame.gaugeTypes.XP);
		xpNumbers.move(x + 4, xpY);
		xpNumbers.show();
		const levelNumbers = this.getOrCreateActorValueSprite(leader, Window_PartyFrame.gaugeTypes.Level);
		levelNumbers.move(x + 80, xpY);
		levelNumbers.show();
	}
	/**
	* Draws the leader's "in‑combat" indicator to the right of the gauges.
	* @param {number} gaugesX The x coordinate where gauges start.
	* @param {number} gaugesY The y coordinate where gauges start.
	*/
	drawLeaderCombatIndicator(gaugesX, gaugesY) {
		const leader = $gameParty.leader();
		const leaderBattler = $gameParty.leaderJabsBattler();
		if (!leader || !leaderBattler) return;
		const inCombat = leaderBattler.isInCombat();
		const icon = this.getOrCreateCombatIcon(leader);
		const timer = this.getOrCreateCombatTimer(leader);
		const label = this.getOrCreateCombatLabel(leader);
		const hpGauge = this.getOrCreateFullSizeGaugeSprite(leader, Window_PartyFrame.gaugeTypes.HP);
		const iconX = gaugesX + hpGauge.bitmapWidth() + ImageManager.iconWidth;
		const iconY = gaugesY + 10;
		icon.move(iconX, iconY);
		const timerWidth = timer.bitmap ? timer.bitmap.width : ImageManager.iconWidth;
		const timerX = iconX + Math.floor((ImageManager.iconWidth - timerWidth) / 2);
		const timerY = iconY + ImageManager.iconHeight - 16;
		timer.move(timerX, timerY);
		const labelX = iconX - Math.floor((label.bitmap.width - ImageManager.iconWidth) / 2);
		const labelY = iconY - label.bitmap.height + 20;
		label.move(labelX, labelY);
		const fadeStep = 9;
		if (inCombat) {
			icon.visible = true;
			icon.opacity = 255;
			const seconds = leaderBattler.getCombatSecondsRemaining();
			const secondsText = Number(seconds).toFixed(1);
			timer.setText(secondsText);
			timer.show();
			timer.opacity = 255;
			label.setColor("#ff3b3b");
			label.setText("IN COMBAT");
			label.show();
			label.opacity = 255;
		} else {
			if (icon.opacity > 0) {
				icon.opacity = Math.max(0, icon.opacity - fadeStep);
				icon.visible = true;
				if (icon.opacity === 0) icon.visible = false;
			} else {
				icon.visible = false;
			}
			if (timer.opacity > 0) {
				timer.opacity = Math.max(0, timer.opacity - fadeStep);
				if (timer.opacity === 0) timer.hide();
			} else {
				timer.hide();
			}
			label.setColor("#44ff66");
			label.setText("FREE");
			label.show();
			label.opacity = 255;
		}
	}
	/**
	* Draw all allies data for the hud.
	* @param {number} x The x coordinate.
	* @param {number} oy The origin y coordinate.
	*/
	drawAllies(x, oy) {
		const lh = this.lineHeight() + 26;
		$gameParty.battleMembers().forEach((ally, index) => {
			if (index === 0) return;
			const adjustedIndex = index - 1;
			const y = oy - lh * adjustedIndex;
			this.drawAlly(ally, x, y);
		});
	}
	/**
	* Draws a single ally's data for the hud.
	* @param {Game_Actor} ally The ally to draw.
	* @param {number} x The x coordinate.
	* @param {number} oy The origin y coordinate.
	*/
	drawAlly(ally, x, oy) {
		this.drawAllyFace(ally, x, oy);
		this.drawAllyGauges(ally, x + 40, oy + 6);
	}
	/**
	* Draws a single ally's mini face for the hud.
	* @param {Game_Actor} ally The ally to draw the face of.
	* @param {number} x The x coordinate.
	* @param {number} y The y coordinate.
	*/
	drawAllyFace(ally, x, y) {
		const sprite = this.getOrCreateMiniSizeFaceSprite(ally);
		sprite.move(x, y);
		sprite.show();
	}
	/**
	* Draws a single ally's mini gauges.
	* @param {Game_Actor} ally The ally to draw the gauges for.
	* @param {number} x The x coordinate.
	* @param {number} oy The original y coordinate.
	*/
	drawAllyGauges(ally, x, oy) {
		const lh = 12;
		const hpGauge = this.getOrCreateMiniSizeGaugeSprite(ally, Window_PartyFrame.gaugeTypes.HP);
		hpGauge.activateGauge();
		hpGauge.move(x, oy + lh * 0);
		hpGauge.show();
		const mpGauge = this.getOrCreateMiniSizeGaugeSprite(ally, Window_PartyFrame.gaugeTypes.MP);
		mpGauge.activateGauge();
		mpGauge.move(x, oy + lh * 1);
		mpGauge.show();
		const tpGauge = this.getOrCreateMiniSizeGaugeSprite(ally, Window_PartyFrame.gaugeTypes.TP);
		tpGauge.activateGauge();
		tpGauge.move(x, oy + lh * 2);
		tpGauge.show();
	}
};

//#endregion
//#region src/plugins/hud/ext/party/sprites/Sprite_ActorValue.js
/**
* A sprite that represents a value of an actor's parameter.
*/
var Sprite_ActorValue = class extends Sprite {
	/**
	* Constructor.
	* @param {Game_Actor} actor The actor to track the value of.
	* @param {string} parameter The parameter to track.
	* @param {number=} fontSizeMod The modification of the font size for this value.
	*/
	constructor(actor, parameter, fontSizeMod = 0) {
		super();
		this.initMembers(actor, parameter, fontSizeMod);
		this.bitmap = this.createBitmap();
	}
	/**
	* Initializes the properties associated with this sprite.
	* @param {object} actor The actor to track the value of.
	* @param {string} parameter The parameter to track.
	* @param {number} fontSizeMod The modification of the font size for this value.
	*/
	initMembers(actor, parameter, fontSizeMod) {
		this._j ||= {};
		/**
		* The parameter being tracked by this sprite.
		* @type {string}
		*/
		this._j._parameter = parameter;
		/**
		* The actor being tracked by this sprite.
		* @type {Game_Actor}
		*/
		this._j._actor = actor;
		/**
		* The font modification from the default font size.
		* @type {number}
		*/
		this._j._fontSizeMod = fontSizeMod;
		/**
		* A grouping of all the last-known values for this actor.
		*/
		this._j._last ||= {};
		/**
		* The last known hp value.
		* @type {number}
		*/
		this._j._last._hp = actor.hp;
		/**
		* The last known mp value.
		* @type {number}
		*/
		this._j._last._mp = actor.mp;
		/**
		* The last known tp value.
		* @type {number}
		*/
		this._j._last._tp = actor.tp;
		/**
		* The last known exp value- aka the current exp value.
		* @type {number}
		*/
		this._j._last._xp = actor.currentExp();
		/**
		* The last known level value- aka the current level.
		* @type {number}
		*/
		this._j._last._lvl = actor.level;
		/**
		* A counter for auto refreshing the value.
		* @type {number}
		*/
		this._j._autoCounter = 60;
	}
	/**
	* Gets the j.
	* @returns {*} The j.
	*/
	j() {
		return this._j;
	}
	/**
	* Gets the parameter being tracked by this sprite.
	* @returns {string}
	*/
	getParameter() {
		return this.j()._parameter;
	}
	/**
	* Gets the actor being tracked by this sprite.
	* @returns {Game_Actor}
	*/
	getActor() {
		return this.j()._actor;
	}
	/**
	* Gets the autorefresh counter.
	* @returns {number}
	*/
	getAutoCounter() {
		return this.j()._autoCounter;
	}
	/**
	* Decrements the autorefresh counter.
	*/
	decrementAutoCounter() {
		this.j()._autoCounter--;
	}
	/**
	* Resets the autorefresh counter to its default value.
	*/
	resetAutoCounter() {
		this.j()._autoCounter = 60;
	}
	/**
	* Updates the bitmap if it needs updating.
	*/
	update() {
		super.update();
		this.handleActorValueUpdates();
	}
	/**
	* Handles the update loop for the actor value tracking.
	*/
	handleActorValueUpdates() {
		if (this.hasParameterChanged()) {
			this.refresh();
			this.resetAutoCounter();
		}
		this.handleAutoRefresh();
	}
	/**
	* Automatically refreshes the value being represented by this sprite
	* after a fixed amount of time.
	*/
	handleAutoRefresh() {
		if (this.needsAutoRefresh()) {
			this.refresh();
			this.resetAutoCounter();
			return;
		}
		this.decrementAutoCounter();
	}
	/**
	* Determines whether or not we need to trigger an autorefresh.
	* @returns {boolean} True if we need to autorefresh, false otherwise.
	*/
	needsAutoRefresh() {
		if (this.getAutoCounter() <= 0) return true;
		return false;
	}
	/**
	* Refreshes the value being represented by this sprite.
	*/
	refresh() {
		this.bitmap = this.createBitmap();
	}
	/**
	* Checks whether or not a given parameter has changed.
	*/
	hasParameterChanged() {
		let changed;
		const actor = this.getActor();
		switch (this.getParameter()) {
			case Window_PartyFrame.gaugeTypes.HP: {
				changed = actor.hp !== this.j()._last._hp;
				if (changed) this.j()._last._hp = actor.hp;
				return changed;
			}
			case Window_PartyFrame.gaugeTypes.MP: {
				changed = actor.mp !== this.j()._last._mp;
				if (changed) this.j()._last._mp = actor.mp;
				return changed;
			}
			case Window_PartyFrame.gaugeTypes.TP: {
				changed = actor.tp !== this.j()._last._tp;
				if (changed) this.j()._last._tp = actor.tp;
				return changed;
			}
			case Window_PartyFrame.gaugeTypes.XP: {
				const current = actor.currentExp();
				changed = current !== this.j()._last._xp;
				if (changed) this.j()._last._xp = current;
				return changed;
			}
			case Window_PartyFrame.gaugeTypes.Level: {
				changed = actor.level !== this.j()._last._lvl;
				if (changed) this.j()._last._lvl = actor.level;
				return changed;
			}
		}
		return false;
	}
	/**
	* Creates a bitmap to attach to this sprite that shows the value.
	*/
	createBitmap() {
		const width = this.bitmapWidth();
		const height = this.fontSize() + 4;
		const bitmap = new Bitmap(width, height);
		const updatedBitmap = this.updateBitmapByParameter(bitmap);
		const value = this.getActorValue();
		updatedBitmap.drawText(value, 0, 0, bitmap.width, bitmap.height, "left");
		return bitmap;
	}
	/**
	* Gets the current value of the actor being tracked by this sprite.
	* @returns {number}
	*/
	getActorValue() {
		const actor = this.getActor();
		switch (this.getParameter()) {
			case Window_PartyFrame.gaugeTypes.HP: {
				return Math.round(actor.hp);
			}
			case Window_PartyFrame.gaugeTypes.MP: {
				return Math.round(actor.mp);
			}
			case Window_PartyFrame.gaugeTypes.TP: {
				return Math.round(actor.tp);
			}
			case Window_PartyFrame.gaugeTypes.XP: {
				const curExp = actor.nextLevelExp() - actor.currentLevelExp();
				const nextLv = actor.currentExp() - actor.currentLevelExp();
				return curExp - nextLv;
			}
			case Window_PartyFrame.gaugeTypes.Level: {
				return actor.level.padZero(3);
			}
		}
		return null;
	}
	/**
	* Mutates the bitmap based on the parameter being tracked.
	* @param {Bitmap} bitmap The bitmap to mutate.
	* @returns {Bitmap} The mutated bitmap.
	*/
	updateBitmapByParameter(bitmap) {
		const updatedBitmap = bitmap;
		switch (this.getParameter()) {
			case Window_PartyFrame.gaugeTypes.HP: {
				updatedBitmap.outlineWidth = 4;
				updatedBitmap.outlineColor = "rgba(128, 24, 24, 1.0)";
				break;
			}
			case Window_PartyFrame.gaugeTypes.MP: {
				updatedBitmap.outlineWidth = 4;
				updatedBitmap.outlineColor = "rgba(24, 24, 192, 1.0)";
				break;
			}
			case Window_PartyFrame.gaugeTypes.TP: {
				updatedBitmap.outlineWidth = 4;
				updatedBitmap.outlineColor = "rgba(24, 64, 24, 1.0)";
				break;
			}
			case Window_PartyFrame.gaugeTypes.XP: {
				updatedBitmap.outlineWidth = 4;
				updatedBitmap.outlineColor = "rgba(72, 72, 72, 1.0)";
				break;
			}
			case Window_PartyFrame.gaugeTypes.Level: {
				updatedBitmap.outlineWidth = 4;
				updatedBitmap.outlineColor = "rgba(72, 72, 72, 1.0)";
				break;
			}
		}
		updatedBitmap.fontFace = this.fontFace();
		updatedBitmap.fontSize = this.fontSize();
		return updatedBitmap;
	}
	/**
	* Defaults the bitmap width to be a fixed 200 pixels.
	*/
	bitmapWidth() {
		return 200;
	}
	/**
	* Defaults the font size to be an adjusted amount from the base font size.
	*/
	fontSize() {
		return $gameSystem.mainFontSize() + this.j()._fontSizeMod;
	}
	/**
	* Defaults the font face to be the number font.
	*/
	fontFace() {
		return $gameSystem.numberFontFace();
	}
};

//#endregion
//#region src/plugins/hud/ext/party/scenes/Scene_Map.js
/**
* Hooks into `initialize` to add our hud.
*/
J.HUD.EXT.PARTY.Aliased.Scene_Map.set("initialize", Scene_Map.prototype.initialize);
Scene_Map.prototype.initialize = function() {
	J.HUD.EXT.PARTY.Aliased.Scene_Map.get("initialize").call(this);
	/**
	* The shared root namespace for all of J's plugin data.
	*/
	this._j ||= {};
	/**
	* The hud window on the map.
	* @type {Window_PartyFrame}
	*/
	this._j._partyFrame = null;
};
/**
* Once the map is loaded, create the text log.
*/
J.HUD.EXT.PARTY.Aliased.Scene_Map.set("createAllWindows", Scene_Map.prototype.createAllWindows);
Scene_Map.prototype.createAllWindows = function() {
	J.HUD.EXT.PARTY.Aliased.Scene_Map.get("createAllWindows").call(this);
	this.createPartyFrameWindow();
};
/**
* Creates the party frame window and adds it to tracking.
*/
Scene_Map.prototype.createPartyFrameWindow = function() {
	const rect = this.partyFrameWindowRectangle();
	this.setPartyFrame(new Window_PartyFrame(rect));
	this.addWindow(this.partyFrame());
};
/**
* Creates the rectangle representing the window for the map hud.
* @returns {Rectangle}
*/
Scene_Map.prototype.partyFrameWindowRectangle = function() {
	const width = 360;
	const height = 400;
	const x = 0;
	const y = Graphics.boxHeight - height;
	return new Rectangle(x, y, width, height);
};
/**
* Overwrites {@link #mapNameWindowRect}.<br/>
* Relocates the map display name window to not overlap the hud.
*/
Scene_Map.prototype.mapNameWindowRect = function() {
	const wx = 400;
	const wy = 0;
	const ww = 360;
	const wh = this.calcWindowHeight(1, false);
	return new Rectangle(wx, wy, ww, wh);
};
/**
* Refreshes the hud on-command.
*/
J.HUD.EXT.PARTY.Aliased.Scene_Map.set("refreshHud", Scene_Map.prototype.refreshHud);
Scene_Map.prototype.refreshHud = function() {
	J.HUD.EXT.PARTY.Aliased.Scene_Map.get("refreshHud").call(this);
	this.partyFrame().refresh();
};
/**
* Extend the update loop for the party frame.
*/
J.HUD.EXT.PARTY.Aliased.Scene_Map.set("updateHudFrames", Scene_Map.prototype.updateHudFrames);
Scene_Map.prototype.updateHudFrames = function() {
	J.HUD.EXT.PARTY.Aliased.Scene_Map.get("updateHudFrames").call(this);
	this.handleRefreshPartyFrame();
	this.handleRefreshPartyFrameImageCache();
};
/**
* Handles incoming requests to refresh the hud.
*/
Scene_Map.prototype.handleRefreshPartyFrame = function() {
	if ($hudManager.hasRequestRefreshHud()) {
		this.partyFrame().refresh();
		$hudManager.acknowledgeRefreshHud();
	}
};
/**
* Handles incoming requests to refresh the hud's image cache.
*/
Scene_Map.prototype.handleRefreshPartyFrameImageCache = function() {
	if ($hudManager.hasRequestRefreshImageCache()) {
		this.partyFrame().refreshCache();
		this.partyFrame().refresh();
		$hudManager.acknowledgeRefreshImageCache();
	}
};
/**
* Gets the party frame.
* @returns {*} The partyFrame.
*/
Scene_Map.prototype.partyFrame = function() {
	return this._j._partyFrame;
};
/**
* Sets the party frame.
* @param {*} newPartyFrame The new partyFrame.
*/
Scene_Map.prototype.setPartyFrame = function(newPartyFrame) {
	this._j._partyFrame = newPartyFrame;
};

//#endregion
//# sourceMappingURL=J-HUD-PartyFrame.js.map