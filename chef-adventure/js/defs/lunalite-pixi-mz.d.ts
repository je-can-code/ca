declare namespace rm.types {
	export const enum Frames {
		base = -1,
	}
}

declare namespace rm.types {
	export type AudioParameters = {
		name: string;
		pan: number;
		pitch: number;
		pos: number;
		volume: number;
	}
}

declare namespace rm.types {
	/**
	 * A superclass of actor, class, skill, item, weapon, armor, enemy, and state.
	 *
	 * Some items are unnecessary depending on the type of data, but they are included for convenience sake.
	 */
	export type BaseItem = {
		/**
		 * The description text.
		 */
		description: string;
		/**
		 * The icon number.
		 */
		iconIndex: number;
		/**
		 * The item ID.
		 */
		id: number;
		meta: Object;
		/**
		 * The item name.
		 */
		name: string;
		note: string;
	}
}

declare namespace rm.types {
	export type BattleRewards = {
		exp: number;
		gold: number;
		items: RPG_BaseItem[];
	}
}

declare namespace rm.types {
	export const enum BattleResult {
		base = -1,
	}
}

declare namespace rm.types {
	export const enum DamageColorType {
		HP_DAMAGE = 0,
		HP_RECOVER = 1,
		MP_DAMAGE = 2,
		MP_RECOVER = 3,
		DEFAULT = 4,
	}
}

declare namespace rm.types {
	export type ConfigData = {
		alwaysDash: boolean;
		bgmVolume: number;
		bgsVolume: number;
		commandRemember: boolean;
		meVolume: number;
		seVolume: number;
	}
}

declare namespace rm.types {
	/**
	 * Plugin Settings for RPGMakerMV/MZ
	 */
	export type PluginSettings = {
		/**
		 * Plugin Description
		 */
		description: string;
		/**
		 * Plugin Name
		 */
		name: string;
		/**
		 * Plugin Parameters in a map/dictionary like syntax.
		 * Example:
		 * ```js
		 * parameters["TextSpeed"]
		 * ```
		 */
		parameters: { [key: string]: any };
		/**
		 * Plugin Status On/Off
		 */
		status: string;
	}
}

declare namespace rm.types {
	/**
	 * The data class for enemy [Actions].
	 */
	export type EnemyAction = {
		/**
		 * The first parameter of the condition.
		 */
		conditionParam1: number;
		/**
		 * The second parameter of the condition.
		 */
		conditionParam2: number;
		/**
		 * The type of condition.
		 *
		 * 0: Always
		 * 1: Turn No.
		 * 2: HP
		 * 3: MP
		 * 4: State
		 * 5: Party Level
		 * 6: Switch
		 */
		conditionType: number;
		/**
		 * The action's priority rating (1..10).
		 */
		rating: number;
		/**
		 * The ID of skills to be employed as actions.
		 */
		skillId: number;
	}
}

declare namespace rm.types {
	/**
	 * The data class for damage.
	 */
	export type Damage = {
		/**
		 * Critical hit (true/false).
		 */
		critical: boolean;
		/**
		 * The element ID.
		 */
		elementId: number;
		/**
		 * The formula.
		 */
		formula: string;
		/**
		 * The type of damage.
		 *
		 * 0: None
		 * 1: HP damage
		 * 2: MP damage
		 * 3: HP recovery
		 * 4: MP recovery
		 * 5: HP drain
		 * 6: MP drain
		 */
		type: number;
		/**
		 * The degree of variability.
		 */
		variance: number;
	}
}

declare namespace rm.types {
	/**
	 * The data class for use effects.
	 */
	export type Effect = {
		/**
		 * The use effect code.
		 */
		code: number;
		/**
		 * The ID of data (state, parameter, and so on) according to the type of use effect.
		 */
		dataId: number;
		/**
		 * Value 1 set according to the type of use effect.
		 */
		value1: number;
		/**
		 * Value 2 set according to the type of use effect.
		 */
		value2: number;
	}
}

declare namespace rm.types {
	export type UsableItem = {
		/**
		 * The animation ID.
		 */
		animationId: number;
		/**
		 * Damage (RPG.Damage).
		 */
		damage: rm.types.Damage;
		/**
		 * The description text.
		 */
		description: string;
		/**
		 * A list of use effects. An RPG.Effect array.
		 */
		effects: rm.types.Effect[];
		/**
		 * The type of hit.
		 *
		 * 0: Certain hit
		 * 1: Physical attack
		 * 2: Magical attack
		 */
		hitType: number;
		/**
		 * The icon number.
		 */
		iconIndex: number;
		/**
		 * The item ID.
		 */
		id: number;
		meta: Object;
		/**
		 * The item name.
		 */
		name: string;
		note: string;
		/**
		 * When the item/skill may be used.
		 *
		 * 0: Always
		 * 1: Only in battle
		 * 2: Only from the menu
		 * 3: Never
		 */
		occasion: number;
		/**
		 * The number of repeats.
		 */
		repeats: number;
		/**
		 * The scope of effects.
		 * 
		 * 0: None
         * 
		 * 1: One Enemy
         * 
		 * 2: All Enemies
         * 
		 * 3: One Random Enemy
         * 
		 * 4: Two Random Enemies
         * 
		 * 5: Three Random Enemies
         * 
		 * 6: Four Random Enemies
         * 
		 * 7: One Ally
         * 
		 * 8: All Allies
         * 
		 * 9: One Ally (Dead)
         * 
		 * 10: All Allies (Dead)
         * 
		 * 11: The User
         *
		 */
		scope: number;
		/**
		 * The speed correction.
		 */
		speed: number;
		/**
		 * The success rate.
		 */
		successRate: number;
		/**
		 * The number of TP gained.
		 */
		tpGain: number;
	}
}

declare namespace rm.types {
	export type Trait = {
		/**
		 * The trait code.
		 */
		code: number;
		/**
		 * The ID of the data (such as elements or states) according to the type of the trait.
		 */
		dataId: number;
		/**
		 * The map tree expansion flag, which is used internally.
		 */
		expanded: boolean;
		/**
		 * The x-axis scroll position, which is used internally.
		 */
		scrollX: number;
		/**
		 * The y-axis scroll position, which is used internally.
		 */
		scrollY: number;
		/**
		 * The value set according to the type of the trait.
		 */
		value: number;
	}
}

declare namespace rm.types {
	/**
	 * The data class for state.
	 */
	export type State = {
        /**
         * The source of all JABS-related data for this state.
         */
        _j: JABS_StateData;
		/**
		 * The timing of automatic state removal.
		 *
		 * 0: None
		 * 1: At end of action
		 * 2: At end of turn
		 */
		autoRemovalTiming: number;
		/**
		 * Chance of state being removed by damage (%).
		 */
		chanceByDamage: number;
		description: string;
		doc: string;
		/**
		 * The icon number.
		 */
		iconIndex: number;
		/**
		 * The ID of the state from the database; starts at 1, not 0.
		 */
		id: number;
		internal: boolean;
		links: string[];
		/**
		 * The maximum turns of the duration.
		 */
		maxTurns: number;
		/**
		 * The message when an actor fell in the state.
		 */
		message1: string;
		/**
		 * The message when an enemy fell in the state.
		 */
		message2: string;
		/**
		 * The message when the state remains.
		 */
		message3: string;
		/**
		 * The message when the state is removed.
		 */
		message4: number;
        /**
         * The metadata autoparsed from RMMZ.
         */
         meta: Map<string, any>;
		/**
		 * The minimum turns of the duration.
		 */
		minTurns: number;
		/**
		 * The side-view motion.
		 */
		motion: number;
		/**
		 * The name.
		 */
		name: string;
        /**
         * The notes of this state.
         */
        note: string;
		/**
		 * The side-view overlay.
		 */
		overlay: number;
		/**
		 * The state priority (0..100).
		 */
		priority: number;
		releaseByDamage: boolean;
		/**
		 * Removes state at end of battle (true/false).
		 */
		removeAtBattleEnd: boolean;
		/**
		 * Removes state by damage (true/false).
		 */
		removeByDamage: boolean;
		/**
		 * Removes state by action restriction (true/false).
		 */
		removeByRestriction: boolean;
		/**
		 * Removes state by walking (true/false).
		 */
		removeByWalking: boolean;
		/**
		 * Action restrictions.
		 *
		 * 0: None
		 * 1: Attack enemy
		 * 2: Attack enemy or ally
		 * 3: Attack ally
		 * 4: Cannot act
		 */
		restriction: number;
		/**
		 * Number of steps until state is removed.
		 */
		stepsToRemove: number;
		/**
		 * The array of Trait data.
		 */
		traits: RPG_Trait[];
	}
}

declare namespace rm.types {
	/**
	 * The data class for skills.
	 */
	export type Skill = {
		/**
		 * The animation ID.
		 */
		animationId: number;
		/**
		 * Damage (RPG.Damage).
		 */
		damage: rm.types.Damage;
		/**
		 * The description text.
		 */
		description: string;
		/**
		 * A list of use effects. An RPG.Effect array.
		 */
		effects: rm.types.Effect[];
		/**
		 * The type of hit.
		 *
		 * 0: Certain hit
		 * 1: Physical attack
		 * 2: Magical attack
		 */
		hitType: number;
		/**
		 * The icon number.
		 */
		iconIndex: number;
		/**
		 * The item ID.
		 */
		id: number;
		/**
		 * The use message first line.
		 */
		message1: string;
		/**
		 * The use message second line.
		 */
		message2: string;
        /**
         * The type of message this is.
         */
        messageType: number;
		meta: Record<string, any>;
		/**
		 * Number of MP consumed.
		 */
		mpCost: number;
		/**
		 * The item name.
		 */
		name: string;
		note: string;
		/**
		 * When the item/skill may be used.
		 *
		 * 0: Always
		 * 1: Only in battle
		 * 2: Only from the menu
		 * 3: Never
		 */
		occasion: number;
		/**
		 * The number of repeats.
		 */
		repeats: number;
		/**
		 * Weapon type required.
		 */
		requiredWtypeId1: number;
		/**
		 * Weapon type required.
		 */
		requiredWtypeId2: number;
		/**
		 * The scope of effects.
		 *
		 * 0: None
         * 
		 * 1: One Enemy
         * 
		 * 2: All Enemies
         * 
		 * 3: One Random Enemy
         * 
		 * 4: Two Random Enemies
         * 
		 * 5: Three Random Enemies
         * 
		 * 6: Four Random Enemies
         * 
		 * 7: One Ally
         * 
		 * 8: All Allies
         * 
		 * 9: One Ally (Dead)
         * 
		 * 10: All Allies (Dead)
         * 
		 * 11: The User
		 */
		scope: number;
		/**
		 * The speed correction.
		 */
		speed: number;
		/**
		 * Skill type ID.
		 */
		stypeId: number;
		/**
		 * The success rate.
		 */
		successRate: number;
		/**
		 * Number of TP consumed
		 */
		tpCost: number;
		/**
		 * The number of TP gained.
		 */
		tpGain: number;
        /**
         * The various JABS-related data points.
         */
        _j: JABS_SkillData;
	}
}

declare namespace rm.types {
	/**
	 * The data class for items.
	 */
	export type Item = {
		/**
		 * The animation ID.
		 */
		animationId: number;
		/**
		 * The truth value indicating whether the item disappears when used.
		 */
		consumable: boolean;
		/**
		 * Damage (RPG.Damage).
		 */
		damage: rm.types.Damage;
		/**
		 * The description text.
		 */
		description: string;
		/**
		 * A list of use effects. An RPG.Effect array.
		 */
		effects: rm.types.Effect[];
		/**
		 * The type of hit.
		 *
		 * 0: Certain hit
		 * 1: Physical attack
		 * 2: Magical attack
		 */
		hitType: number;
		/**
		 * The icon number.
		 */
		iconIndex: number;
		/**
		 * The item ID.
		 */
		id: number;
		/**
		 * The item type ID.
		 *
		 * 1: Regular item
		 * 2: Key item
		 */
		itypeId: number;
		meta: Object;
		/**
		 * The item name.
		 */
		name: string;
		note: string;
		/**
		 * When the item/skill may be used.
		 *
		 * 0: Always
		 * 1: Only in battle
		 * 2: Only from the menu
		 * 3: Never
		 */
		occasion: number;
		/**
		 * The item's price.
		 */
		price: number;
		/**
		 * The number of repeats.
		 */
		repeats: number;
		/**
		 * The scope of effects.
		 *
		 * 0: None
		 * 1: One Enemy
		 * 2: All Enemies
		 * 3: One Random Enemy
		 * 4: Two Random Enemies
		 * 5: Three Random Enemies
		 * 6: Four Random Enemies
		 * 7: One Ally
		 * 8: All Allies
		 * 9: One Ally (Dead)
		 * 10: All Allies (Dead)
		 * 11: The User
		 */
		scope: number;
		/**
		 * The speed correction.
		 */
		speed: number;
		/**
		 * The success rate.
		 */
		successRate: number;
		/**
		 * The number of TP gained.
		 */
		tpGain: number;
	}
}

declare namespace rm.types {
	/**
	 * A superclass of weapons and armor.
	 */
	export type EquipItem = {
		/**
		 * The description text.
		 */
		description: string;
		/**
		 * The type of weapon or armor.
		 *
		 * 0: Weapon
		 * 1: Shield
		 * 2: Head
		 * 3: Body
		 * 4: Accessory
		 */
		etypeId: number;
		/**
		 * The icon number.
		 */
		iconIndex: number;
		/**
		 * The item ID.
		 */
		id: number;
		meta: Object;
		/**
		 * The item name.
		 */
		name: string;
        /**
         * The note of the equipment.
         * @type {string}
         */
		note: string;
		/**
		 * The amount of parameter change. An array of integers using the following IDs as subscripts:
		 *
		 * 0: Maximum hit points
         * 
		 * 1: Maximum magic points
		 * 
         * 2: Attack power
		 * 
         * 3: Defense power
		 * 
         * 4: Magic attack power
		 * 
         * 5: Magic defense power
		 * 
         * 6: Agility
		 * 
         * 7: Luck
		 */
		params: number[];
		/**
		 * The price of the weapon or armor.
		 */
		price: number;
		/**
		 * The array of Trait data.
		 */
		traits: RPG_Trait[];

        /**
         * Contains additional JABS-related info about this equip.
         */
        _j: JABS_EquipmentData;
	}
}

declare namespace rm.types {
	export type BattlerAnimation = {
		animationId: number;
		delay: number;
		mirror: boolean;
	}
}

declare namespace rm.types {
	export const enum MotionType {
		WALK = "walk",
		WAIT = "wait",
		CHANT = "chant",
		GUARD = "guard",
		DAMAGE = "damage",
		EVADE = "evade",
		THRUST = "thrust",
		MISSLE = "missle",
		SKILL = "SKILL",
		SPELL = "spell",
		ITEM = "item",
		ESCAPE = "escape",
		VICTORY = "victory",
		DYING = "dying",
		ABNORMAL = "abnormal",
		SLEEP = "sleep",
		DEAD = "dead",
	}
}

declare namespace rm.types {
	export const enum WeaponImageId {
		base = -1,
	}
}

declare namespace rm.types {
	export const enum AnimationId {
		base = -1,
	}
}

declare namespace rm.types {
	export const enum ActionState {
		base = "",
	}
}

declare namespace rm.types {
	/**
	 * The data class for actors.
	 */
	export type Actor = {
		/**
		 * The file name of the actor's battler graphic.
		 */
		battlerName: string;
		/**
		 * The index (0..7) of the actor's walking graphic.
		 */
		characterIndex: number;
		/**
		 * The file name of the actor's walking graphic.
		 */
		characterName: string;
		/**
		 * The actor's class ID.
		 */
		classId: number;
		/**
		 * The actor's initial equipment. An array of weapon IDs or armor IDs with the following subscripts:
		 */
		equips: number[];
		/**
		 * The index (0..7) of the actor's face graphic.
		 */
		faceIndex: number;
		/**
		 * The file name of the actor's face graphic.
		 */
		faceName: string;
		/**
		 * The ID.
		 */
		id: string;
		/**
		 * The actor's initial level.
		 */
		initialLevel: number;
		/**
		 * The actor's max level
		 */
		maxLevel: number;
        /**
         * The metadata extracted by RMMZ.
         */
        meta: {};
		/**
		 * The name.
		 */
		name: string;
		/**
		 * The actor's nickname.
		 */
		nickname: string;
        /**
         * The note on this actor.
         */
        note: string;
		/**
		 * The profile.
		 */
		profile: string;
		/**
		 * The array of Trait data.
		 */
		traits: RPG_Trait[];
	}
}

declare namespace rm.types {
	/**
	 * The data class for weapons.
	 */
	export type Weapon = {
		/**
		 * The animation ID when using the weapon.
		 */
		animationId: number;
		/**
		 * The description text.
		 */
		description: string;
		/**
		 * The type of weapon or armor.
		 *
		 * 0: Weapon
		 * 1: Shield
		 * 2: Head
		 * 3: Body
		 * 4: Accessory
		 */
		etypeId: number;
		/**
		 * The icon number.
		 */
		iconIndex: number;
		/**
		 * The item ID.
		 */
		id: number;
		meta: Object;
		/**
		 * The item name.
		 */
		name: string;
        /**
         * The note of this weapon.
         */
		note: string;
		/**
		 * The amount of parameter change. An array of integers using the following IDs as subscripts:
		 *
		 * 0: Maximum hit points
         *
		 * 1: Maximum magic points
         *
		 * 2: Attack power
 *
		 * 3: Defense power
		 *
		 * 4: Magic attack power
		 *
		 * 5: Magic defense power
		 *
		 * 6: Agility
 *
		 * 7: Luck
		 */
		params: number[];
		/**
		 * The price of the weapon or armor.
		 */
		price: number;
		/**
		 * The array of Trait data.
		 */
		traits: RPG_Trait[];
		/**
		 * The weapon type ID.
		 */
		wtypeId: number;
	}
}

declare namespace rm.types {
	/**
	 * The data class for armor.
	 */
	export type Armor = {
		/**
		 * The armor type ID.
		 */
		atypeId: number;
		/**
		 * The description text.
		 */
		description: string;
		/**
		 * The type of weapon or armor.
		 *
		 * 0: Weapon
         *
		 * 1: Shield
         *
		 * 2: Head
         *
		 * 3: Body
         *
		 * 4: Accessory
		 */
		etypeId: number;
		/**
		 * The icon number.
		 */
		iconIndex: number;
		/**
		 * The item ID.
		 */
		id: number;
		meta: Object;
		/**
		 * The item name.
		 */
		name: string;
        /**
         * The note of this armor.
         */
		note: string;
		/**
		 * The amount of parameter change. An array of integers using the following IDs as subscripts:
		 *
		 * 0: Maximum hit points
		 * 1: Maximum magic points
		 * 2: Attack power
		 * 3: Defense power
		 * 4: Magic attack power
		 * 5: Magic defense power
		 * 6: Agility
		 * 7: Luck
		 */
		params: number[];
		/**
		 * The price of the weapon or armor.
		 */
		price: number;
		/**
		 * The array of Trait data.
		 */
		traits: RPG_Trait[];
	}
}

declare namespace rm.types {
	/**
	 * The data class for a class's [Skills to Learn].
	 */
	export type ClassLearning = {
		/**
		 * The data class for a class's [Skills to Learn].
		 */
		level: number;
		/**
		 * The ID of the skill to learn.
		 */
		skillId: number;
        /**
         * The note on this skill learning.
         */
        note: string;
	}
}

declare namespace rm.types {
	/**
	 * The data class for class.
	 */
	export type RPGClass = {
		/**
		 * An array of values that decides the experience curve. The subscripts are as follows:
		 *
		 * 0: Base value
		 * 1: Extra value
		 * 2: Acceleration A
		 * 3: Acceleration B
		 */
		expParams: number[];
		/**
		 * The ID.
		 */
		id: number;
		/**
		 * The skills to learn. An array of RPG.Class.Learning.
		 */
		learnings: rm.types.ClassLearning[];
		/**
		 * The name.
		 */
		name: string;
		/**
		 * The parameter development curve. A 2-dimensional array containing ordinary parameters according to level (Table).
		 *
		 * The format is params[param_id, level], and param_id is assigned as follows:
		 *
		 * 0: Maximum hit points
		 * 
         * 1: Maximum magic points
		 * 
         * 2: Attack power
		 * 
         * 3: Defense power
		 * 
         * 4: Magic attack power
		 * 
         * 5: Magic defense power
		 * 
         * 6: Agility
		 * 
         * 7: Luck
		 */
		params: number[][];
		/**
		 * The array of Trait data.
		 */
		traits: RPG_Trait[];
	}
}

declare namespace rm.types {
	export const enum MoveSpeed {
		X8SLOWER = 1,
		X4SLOWER = 2,
		X2SLOWER = 3,
		NORMAL = 4,
		X2FASTER = 5,
		X4FASTER = 6,
	}
}

declare namespace rm.types {
	export const enum MoveFrequency {
		LOWEST = 1,
		LOWER = 2,
		NORMAL = 3,
		HIGHER = 4,
		HIGHEST = 5,
	}
}

declare namespace rm.types {
	export const enum Direction {
		base = -1,
	}
}

declare namespace rm.types {

}

declare namespace rm.types {
	export const enum CharacterPriority {
		BELOW_CHARACTERS = 0,
		SAME_AS_CHARACTERS = 1,
		ABOVE_CHARACTERS = 2,
	}
}

declare namespace rm.types {
	export const enum BalloonId {
		EXCLAMATION = 0,
		QUESTION = 1,
		MUSIC_NOTE = 2,
		HEART = 3,
		ANGER = 4,
		SWEAT = 5,
		COBWEB = 6,
		SILENCE = 7,
		LIGHT_BULB = 8,
		ZZZ = 9,
	}
}

declare namespace rm.types {
	/**
	 * The data class for the Move command.
	 */
	export type MoveCommand = {
		/**
		 * Move command code.
		 */
		code: number;
		/**
		 * An array containing the Move command's arguments. The contents vary for each command.
		 */
		parameters: any[];
	}
}

declare namespace rm.types {
	/**
	 * The data class for the Move route.
	 */
	export type MoveRoute = {
		/**
		 * Program contents. An RPG.MoveCommand array.
		 */
		list: rm.types.MoveCommand[];
		/**
		 * The truth value of the [Repeat Action] option.
		 */
		repeat: boolean;
		/**
		 * The truth value of the [Skip If Cannot Move] option.
		 */
		skippable: boolean;
		/**
		 * The truth value of the [Wait for Completion] option.
		 */
		wait: boolean;
	}
}

declare namespace rm.types {
	/**
	 * The data class for the Event command.
	 */
	export type EventCommand = {
		/**
		 * The event code.
		 */
		code: number;
		/**
		 * The indent depth. Usually 0. The [Conditional Branch] command, among others, adds 1 with every step deeper.
		 */
		indent: number;
		/**
		 * An array containing the Event command's arguments. The contents vary for each command.
		 */
		parameters: any[];
	}
}

declare namespace rm.types {
	/**
	 * The data class for common events.
	 */
	export type CommonEvent = {
		/**
		 * The event ID.
		 */
		id: number;
		/**
		 * A list of event commands. An RPG.EventCommand array.
		 */
		list: rm.types.EventCommand[];
		/**
		 * The event name.
		 */
		name: string;
		/**
		 * The condition switch ID.
		 */
		switchId: number;
		/**
		 * The event trigger (0: none, 1: autorun; 2: parallel).
		 */
		trigger: number;
	}
}

declare namespace rm.types {
	export type EnemyDropItem = {
		/**
		 * The ID of the data depending on the type of dropped item (item, weapon, or armor).
		 */
		dataId: number;
		/**
		 * N of the probability that the item will be dropped, 1/N.
		 */
		denominator: number;
		/**
		 * The type of dropped item.
		 *
		 * 0: None
		 * 1: Item
		 * 2: Weapon
		 * 3: Armor
		 */
		kind: number;
	}
}

declare namespace rm.types {
	export type Enemy = {
		/**
		 * The enemy's action pattern. An array of RPG.Enemy.Action.
		 */
		actions: RPG_EnemyAction[];
		/**
		 * The adjustment value for the battler graphic's hue (0..360).
		 */
		battlerHue: number;
		/**
		 * The file name of the enemy's battler graphic.
		 */
		battlerName: string;
		/**
		 * The items the enemy drops. An RPG.Enemy.DropItem array.
		 */
		dropItems: RPG_DropItem[];
		/**
		 * The enemy's experience.
		 */
		exp: number;
		/**
		 * The enemy's gold.
		 */
		gold: number;
		/**
		 * The ID of the enemy in the database.
		 *
		 * @type {number}
		 * @memberof Enemy
		 */
		id: number;
        /**
         * The level of this enemy; added by the `J-Base` plugin.
         * @type {number}
         */
        level: number;
        /**
         * The traits defined for this enemy in the database.
         * @type {RPG_Trait[]}
         */
        traits: RPG_Trait[];
		/**
		 * The name of the enemy in the database.
		 *
		 * @type {string}
		 * @memberof Enemy
		 */
		name: string;
		/**
		 * Parameters. An array of integers using the following IDs as subscripts:
		 *
		 * 0: Maximum hit points
		 * 1: Maximum magic points
		 * 2: Attack power
		 * 3: Defense power
		 * 4: Magic attack power
		 * 5: Magic defense power
		 * 6: Agility
		 * 7: Luck
		 */
		params: number[];
	}
}

declare namespace rm.types {
	export const enum MoveType {
		FIXED = 0,
		RANDOM = 1,
		APPROACH = 2,
		CUSTOM = 3,
	}
}

declare namespace rm.types {
	export const enum EventTrigger {
		base = -1,
	}
}

declare namespace rm.types {
	/**
	 * The data class for the event page conditions.
	 */
	export type EventPageConditions = {
		/**
		 * The ID of that actor if the [Actor] condition is valid.
		 */
		actorId: string;
		/**
		 * The truth value indicating whether the [Actor] condition is valid.
		 */
		actorValid: boolean;
		/**
		 * The ID of that item if the [Item] condition is valid.
		 */
		itemId: string;
		/**
		 * The truth value indicating whether the [Item] condition is valid.
		 */
		itemValid: boolean;
		/**
		 * The letter of that self switch ("A".."D") if the [Self Switch] condition is valid.
		 */
		selfSwitchCh: string;
		/**
		 * The truth value indicating whether the [Self Switch] condition is valid.
		 */
		selfSwitchValid: boolean;
		/**
		 * The ID of that switch if the first [Switch] condition is valid.
		 */
		switch1Id: number;
		/**
		 * The truth value indicating whether the first [Switch] condition is valid.
		 */
		switch1Valid: boolean;
		/**
		 * The ID of that switch if the second [Switch] condition is valid.
		 */
		switch2Id: number;
		/**
		 * The truth value indicating whether the second [Switch] condition is valid.
		 */
		switch2Valid: boolean;
		/**
		 * The ID of that variable if the [Variable] condition is valid.
		 */
		variableId: number;
		/**
		 * The truth value indicating whether the [Variable] condition is valid.
		 */
		variableValid: boolean;
		/**
		 * The standard value of that variable (x and greater) if the [Variable] condition is valid.
		 */
		variableValue: number;
	}
}

declare namespace rm.types {
	/**
	 * The data class for the Event page [Graphics].
	 */
	export type EventPageImage = {
		/**
		 * The index of the character's graphic file (0..7).
		 */
		characterIndex: number;
		/**
		 * The file name of the character's graphic.
		 */
		characterName: string;
		/**
		 * The direction in which the character is facing (2: down, 4: left, 6: right, 8: up).
		 */
		direction: number;
		/**
		 * The character's pattern (0..2).
		 */
		pattern: number;
		/**
		 * The tile ID. If the specified graphic is not a tile, this value is 0.
		 */
		tileId: number;
	}
}

declare namespace rm.types {
	/**
	 * The data class for the event page.
	 */
	export type EventPage = {
		/**
		 * The event condition (RPG.EventPage.Condition).
		 */
		conditions: rm.types.EventPageConditions;
		/**
		 * The truth value of the [Direction Fix] option.
		 */
		directionFix: boolean;
		/**
		 * The event graphic (RPG.EventPage.Image) .
		 */
		image: rm.types.EventPageImage;
		/**
		 * A list of event commands. An RPG.EventCommand array.
		 */
		list: rm.types.EventCommand[];
		/**
		 * The movement frequency (1: lowest, 2: lower, 3: normal, 4: higher, 5: highest).
		 */
		moveFrequency: number;
		/**
		 * The movement route (RPG.MoveRoute). Referenced only when the movement type is set to custom.
		 */
		moveRoute: rm.types.MoveRoute[];
		/**
		 * The movement speed (1: x8 slower, 2: x4 slower, 3: x2 slower, 4: normal, 5: x2 faster, 6: x4 faster).
		 */
		moveSpeed: number;
		/**
		 * The type of movement (0: fixed, 1: random, 2: approach, 3: custom).
		 */
		moveType: number;
		/**
		 * The priority type (0: below characters, 1: same as characters, 2: above characters).
		 */
		priorityType: number;
		/**
		 * The truth value of the [Stepping Animation] option.
		 */
		stepAnime: boolean;
		/**
		 * The truth value of the [Through] option.
		 */
		through: boolean;
		/**
		 * The event trigger (0: action button, 1: player touch, 2: event touch, 3: autorun, 4: parallel).
		 */
		trigger: number;
		/**
		 * The truth value of the [Walking Animation] option.
		 */
		walkAnime: boolean;
	}
}

declare namespace rm.types {
	/**
	 * The data class for map events.
	 */
	export type Event = {
		/**
		 * The event ID.
		 */
		id: number;
		meta: Object;
		/**
		 * The event name.
		 */
		name: string;
		note: string;
		/**
		 * The event pages. RPG.EventPage array.
		 */
		pages: rm.types.EventPage[];
		/**
		 * The event's x-coordinate on the map.
		 */
		x: number;
		/**
		 * The event's y-coordinate on the map.
		 */
		y: number;

        // extra JABS-related stuff.
        /**
         * The index of this jabs-action event, assigned on creation.
         */
        actionIndex: number;
        /**
         * The index of this jabs-loot event, assigned on creation.
         */
        lootIndex: number;
	}
}

declare namespace rm.types {
	/**
	 * The data class for tile sets.
	 */
	export type Tileset = {
		doc: string;
		/**
		 * The flags table. A 1-dimensional array containing a variety of flags (Table).
		 *
		 * Uses tile IDs as subscripts. The correspondence of each bit is as shown below:
		 *
		 * 0x0001: Impassable downward
		 * 0x0002: Impassable leftward
		 * 0x0004: Impassable rightward
		 * 0x0008: Impassable upward
		 * 0x0010: Display on normal character
		 * 0x0020: Ladder
		 * 0x0040: Bush
		 * 0x0080: Counter
		 * 0x0100: Damage floor
		 * 0x0200: Impassable by boat
		 * 0x0400: Impassable by ship
		 * 0x0800: Airship cannot land
		 * 0xF000: Terrain tag
		 * This manual does not discuss bit operations, but they are similar to those in C.
		 * We recommend an Internet search using keywords such as "hexadecimal bit operations" when necessary.
		 */
		flags: number[];
		/**
		 * The ID of the tile set.
		 */
		id: number;
		internal: boolean;
		links: string[];
		/**
		 * The mode of the tile set (0: Field type, 1: Area type, 2: VX compatible type).
		 */
		mode: number;
		/**
		 * The name of the tile set.
		 */
		name: string;
		parameters: string[];
		platforms: haxe.display.Platform[];
		targets: haxe.display.MetadataTarget[];
		/**
		 * The file name of the graphic used as the number index (0-8) tile set.
		 *
		 * The correspondence between numbers and sets is illustrated in the table below.
		 *
		 * 0 TileA1
		 * 1 TileA2
		 * 2 TileA3
		 * 3 TileA4
		 * 4 TileA5
		 * 5 TileB
		 * 6 TileC
		 * 7 TileD
		 * 8 TileE
		 */
		tilesetNames: string[];
	}
}

declare namespace rm.types {
	export type MapEncounter = {
		/**
		 * An array containing Region IDs.
		 */
		regionSet: number[];
		/**
		 * The enemy Troop ID.
		 */
		troopId: number;
		/**
		 * Weight/chance  among enemies on the map that you'll
		 * meet this enemy.
		 */
		weight: number;
	}
}

declare namespace rm.types {
	export const enum MessageBackgroundType {
		base = -1,
	}
}

declare namespace rm.types {
	export const enum MessagePositionType {
		base = -1,
	}
}

declare namespace rm.types {
	export const enum ChoiceDefaultType {
		base = -1,
	}
}

declare namespace rm.types {
	export const enum ChoiceCancelType {
		base = -1,
	}
}

declare namespace rm.types {
	export const enum ChocieBackgroundType {
		base = -1,
	}
}

declare namespace rm.types {
	export const enum ChoicePositionType {
		base = -1,
	}
}

declare namespace rm.types {
	/**
	 * The data class for audio file.
	 */
	export type AudioFile = {
		/**
		 * The sound file name.
		 */
		name: string;
		/**
		 * The pan.
		 */
		pan: number;
		/**
		 * The sound's pitch (50..150). The default value is 100.
		 */
		pitch: number;
		/**
		 * The sound's volume (0..100). The default values are 100 for BGM and ME and 80 for BGS and SE.
		 */
		volume: number;
	}
}

declare namespace rm.types {
	export type TroopMember = {
		/**
		 * The enemy ID.
		 */
		enemyId: number;
		/**
		 * The truth value of the [Appear Halfway] option.
		 */
		hidden: boolean;
		/**
		 * The troop member's x-coordinate.
		 */
		x: number;
		/**
		 * The troop member's y-coordinate.
		 */
		y: number;
	}
}

declare namespace rm.types {
	/**
	 * The data class of battle event [Conditions].
	 */
	export type PageCondition = {
		/**
		 * The HP percentage specified in the [Actor] condition.
		 */
		actorHp: number;
		/**
		 * The actor ID specified in the [Actor] condition.
		 */
		actorId: number;
		/**
		 * The truth value indicating whether the [Actor] condition is valid.
		 */
		actorValid: boolean;
		/**
		 * The HP percentage specified in the [Enemy] condition.
		 */
		enemyHp: number;
		/**
		 * The troop member index specified in the [Enemy] condition (0..7).
		 */
		enemyIndex: number;
		/**
		 * The truth value indicating whether the [Enemy] condition is valid.
		 */
		enemyValid: boolean;
		/**
		 * The switch ID specified in the [Switch] condition.
		 */
		switchId: number;
		/**
		 * The truth value indicating whether the [Switch] condition is valid.
		 */
		switchValid: boolean;
		/**
		 * The a and b values specified in the [Turn No.] condition. To be input in the form A + B * X.
		 */
		turnA: number;
		/**
		 * The a and b values specified in the [Turn No.] condition. To be input in the form A + B * X.
		 */
		turnB: number;
		/**
		 * The truth value indicating whether the [At End of Turn] condition is valid.
		 */
		turnEnding: boolean;
		/**
		 * The truth value indicating whether the [Turn No.] condition is valid.
		 */
		turnValid: boolean;
	}
}

declare namespace rm.types {
	/**
	 * The data class for battle events (pages).
	 */
	export type Page = {
		/**
		 * Condition (RPG.Troop.Page.Condition).
		 */
		condition: rm.types.PageCondition;
		/**
		 * Program contents. An RPG.EventCommand array.
		 */
		list: rm.types.EventCommand[];
		/**
		 * Span (0: battle, 1: turn, 2: moment).
		 */
		span: number;
	}
}

declare namespace rm.types {
	export type Troop = {
		/**
		 * The troop ID.
		 */
		id: number;
		/**
		 * The troop members. An RPG.Troop.Member array.
		 */
		members: rm.types.TroopMember[];
		/**
		 * The troop name.
		 */
		name: string;
		/**
		 * The battle events. An RPG.Troop.Page array.
		 */
		pages: rm.types.Page[];
	}
}

declare namespace rm.types {
	/**
	 * The data class for vehicles.
	 */
	export type SystemVehicle = {
		/**
		 * The vehicle's BGM (RPG.AudioFile).
		 */
		bgm: rm.types.AudioFile;
		/**
		 * The index of the vehicle's walking graphic (0..7).
		 */
		characterIndex: number;
		/**
		 * The file name of the vehicle's walking graphic.
		 */
		characterName: string;
		/**
		 * The map ID of the vehicle's initial position.
		 */
		startMapId: number;
		/**
		 * The map's x-coordinate of the vehicle's initial position.
		 */
		startX: number;
		/**
		 * The map's y-coordinate of the vehicle's initial position.
		 */
		startY: number;
	}
}

declare namespace rm.types {
	export const enum Money {
		base = -1,
	}
}

declare namespace rm.types {
	/**
	 * The data class for the timing of an animation's SE and flash effects.
	 */
	export type AnimationTiming = {
		/**
		 * The color of the flash (Color).
		 */
		flashColor: number[];
		/**
		 * The duration of the flash.
		 */
		flashDuration: number;
		/**
		 * The flash area (0: none, 1: target, 2: screen; 3: hide target).
		 */
		flashScope: number;
		/**
		 * The frame number. 1 less than the number displayed in RPG Maker.
		 */
		frame: number;
		/**
		 * The sound effect or SE (RPG.AudioFile).
		 */
		se: rm.types.AudioFile;
	}
}

declare namespace rm.types {
	/**
	 * The data class for animation.
	 */
	export type Animation = {
		/**
		 * The adjustment value for the hue of the first animation's graphic (0..360).
		 */
		animation1Hue: string;
		/**
		 * The file name of the first animation's graphic.
		 */
		animation1Name: string;
		/**
		 * The adjustment value for the hue of the second animation's graphic (0..360).
		 */
		animation2Hue: number;
		/**
		 * The file name of the second animation's graphic.
		 */
		animation2Name: string;
		/**
		 * Number of frames.
		 */
		frameMax: number;
		/**
		 * The three-dimensional array containing the frame contents.
		 */
		frames: number[][][];
		/**
		 * The animation ID.
		 */
		id: number;
		/**
		 * The animation name.
		 */
		name: string;
		/**
		 * The base position (0: head, 1: center, 2: feet, 3: screen).
		 */
		position: number;
		/**
		 * Timing for SE and flash effects. An RPG.Animation.Timing array.
		 */
		timings: rm.types.AnimationTiming[];
	}
}

declare namespace rm.types {
	export type Motion = {
		index: number;
		loop: boolean;
	}
}

declare namespace rm.types {
	export type TextState = {
		buffer: string;
		drawing: boolean;
		height: number;
		index: number;
		outputHeight: number;
		outputWidth: number;
		rtl: boolean;
		startX: number;
		startY: number;
		text: string;
		width: number;
	}
}

declare namespace rm.types {
	export const enum GaugeType {
		HP = "hp",
		MP = "mp",
		TP = "tp",
		TIME = "time",
	}
}

declare namespace rm.types {
	export const enum SkillTypeIdA {
		base = -1,
	}
}

declare namespace rm.windows {
	export type Info = {
		key: string;
	}
}

declare namespace rm.types {
	export const enum EquipTypeId {
		base = -1,
	}
}


interface AttackMotion {
  /**
   * The type of the motion.
   */
  type: number;

  /**
   * The ID of the weapon image.
   */
  weaponImageId: number;
}

interface Terms {
  /**
   * The basic status. A string array with the following subscripts:
   *
   * 0: Level
   * 1: Level (short)
   * 2: HP
   * 3: HP (short)
   * 4: MP
   * 5: MP (short)
   * 6: TP
   * 7: TP (short)
   * 8: EXP
   * 9: EXP (short)
   */
  basic: Array<string>;

  /**
   * Parameters. A string array with the following subscripts:
   *
   * 0: Maximum hit points
   * 1: Maximum magic points
   * 2: Attack power
   * 3: Defense power
   * 4: Magic attack power
   * 5: Magic defense power
   * 6: Agility
   * 7: Luck
   * 8: Hit
   * 9: Evasion
   */
  params: Array<string>;

  /**
   * 0: Fight
   * 1: Escape
   * 2: Attack
   * 3: Defend
   * 4: Item
   * 5: Skill
   * 6: Equip
   * 7: Status
   * 8: Sort
   * 9: Save
   * 10: Exit Game
   * 11: Option
   * 12: Weapon
   * 13: Armor
   * 14: Key Item
   * 15: Change Equipment
   * 16: Ultimate Equipment
   * 17: Remove All
   * 18: New Game
   * 19: Continue
   * 20: (not used)
   * 21: Go to Title
   * 22: Cancel
   * 23: (not used)
   * 24: Buy
   * 25: Sell
   */
  commands: Array<string>;

  /**
   * The messages.
   */
  messages: {[key: string]: string};
}

interface TestBattler {
  /**
   * The actor ID.
   */
  actorId: number;

  /**
   * The actor's level.
   */
  level: number;

  /**
   * The actor's equipment. An array of weapon IDs or armor IDs with the following subscripts:
   *
   * 0: Weapon
   * 1: Shield
   * 2: Head
   * 3: Body
   * 4: Accessory
   */
  equips: number[];
}

 type MapInfo = {
    /**
     * The map name.
     */
    name: string;
   
    /**
     * The parent map ID.
     */
     parentId: number;
   
    /**
     * The map tree display order, which is used internally.
     */
     order: number;
   }

    interface MetaData {
    /**
     * The text of the note.
     */
    note: string;

    /**
     * The Meta.
     */
    meta: {[key: string]: any};
}

/**
 * The data class for maps.
 */
 interface Map extends MetaData {
    /**
     * The map's display name.
     */
    displayName: string;

    /**
     * The map's tile set.
     */
    tilesetId: number;

    /**
     * The map's width.
     */
    width: number;

    /**
     * The map's height.
     */
    height: number;

    /**
     * The scroll type (0: No Loop, 1: Vertical Loop, 2: Horizontal Loop, 3: Both Loop).
     */
    scrollType: number;

    /**
     * The truth value indicating whether the battle background specification is enabled.
     */
    specifyBattleback: boolean;

    /**
     * The file name of the floor graphic if the battle background specification is enabled.
     */
    battleback1Name: string;

    /**
     * The file name of the wall graphic if the battle background specification is enabled.
     */
    battleback2_name: string;

    /**
     * The truth value indicating whether BGM autoswitching is enabled.
     */
    autoplayBgm: boolean;

    /**
     * The name of that BGM (RPG.AudioFile) if BGM autoswitching is enabled.
     */
    bgm: rm.types.AudioFile;

    /**
     * The truth value indicating whether BGS autoswitching is enabled.
     */
    autoplayBgs: boolean;

    /**
     * The name of that BGS (RPG.AudioFile) if BGS autoswitching is enabled.
     */
    bgs: rm.types.AudioFile;

    /**
     * The truth value of the [Disable Dashing] option.
     */
    disableDashing: boolean;

    /**
     * An encounter list. A RPG.Map.Encounter ID array.
     */
    encounterList: Array<rm.types.MapEncounter>;

    /**
     * The average number of steps between encounters.
     */
    encounterStep: number;

    /**
     * The file name of the parallax background's graphic.
     */
    parallaxName: string;

    /**
     * The truth value of the [Loop Horizontal] option for the parallax background.
     */
    parallaxLoopX: boolean;

    /**
     * The truth value of the [Loop Vertical] option for the parallax background.
     */
    parallaxLoopY: boolean;

    /**
     * The automatic x-axis scrolling speed for the parallax background.
     */
    parallaxSx: number;

    /**
     * The automatic y-axis scrolling speed for the parallax background.
     */
    parallaxSy: number;

    /**
     * The truth value of the [Show in the Editor] option for the parallax background.
     */
    parallaxShow: boolean;

    /**
     * The map data. A 3-dimensional tile ID array (Table).
     */
    data: number[];

    /**
     * The array of RPG.Event data.
     */
    events: rm.types.Event[];
}

interface System {
  /**
   * The game title.
   */
  gameTitle: string;

  /**
   * A random number used for update checks. The number changes every time data is saved in RPG Maker.
   */
  versionId: number;

  /**
   * The locale string such as "ja_JP" and "en_US".
   */
  locale: string;

  /**
   * The initial party. An array of actor IDs.
   */
  partyMembers: number[];

  /**
   * The unit of currency.
   */
  currencyUnit: string;

  /**
   * The window color.
   */
  windowTone: number[];

  /**
   * The array of System.AttackMotion data.
   */
  attackMotions: Array<rm.types.Motion>;

  /**
   * A list of elements. A string array using element IDs as subscripts, with the element in the 0 position being nil.
   */
  elements: Array<string>;

  /**
   * The equipment type. A string array with the following subscripts:
   * 1: Weapon
   * 2: Shield
   * 3: Head
   * 4: Body
   * 5: Accessory
   */
  equipTypes: Array<string>;

  /**
   * A list of skill types. A string array using skill type IDs as subscripts, with the element in the 0 position being nil.
   */
  skillTypes: Array<string>;

  /**
   * A list of weapon types. A string array using weapon type IDs as subscripts, with the element in the 0 position being nil.
   */
  weaponTypes: Array<string>;

  /**
   * A list of armor types. A string array using armor type IDs as subscripts, with the element in the 0 position being nil.
   */
  armorTypes: Array<string>;

  /**
   * A switch name list. A string array using switch IDs as subscripts, with the element in the 0 position being nil.
   */
  switches: Array<string>;

  /**
   * A variable name list. A string array using variable IDs as subscripts, with the element in the 0 position being nil.
   */
  variables: Array<string>;

  /**
   * Boat settings (RPG.System.Vehicle).
   */
  boat: rm.types.SystemVehicle;

  /**
   * Ship settings (RPG.System.Vehicle).
   */
  ship: rm.types.SystemVehicle;

  /**
   * Airship settings (RPG.System.Vehicle).
   */
  airship: rm.types.SystemVehicle;

  /**
   * The file name of the title (background) graphic.
   */
  title1Name: string;

  /**
   * The file name of the title (frame) graphic.
   */
  title2Name: string;

  /**
   * The truth value of the [Draw Game Title] option.
   */
  optDrawTitle: boolean;

  /**
   * The truth value of the [Start Transparent] option.
   */
  optTransparent: boolean;

  /**
   * The truth value of the [Show Player Followers] option.
   */
  optFollowers: boolean;

  /**
   * The truth value of the [K.O. by Slip Damage] option.
   */
  optSlipDeath: boolean;

  /**
   * The truth value of the [K.O. by Floor Damage] option.
   */
  optFloorDeath: boolean;

  /**
   * The truth value of the [Display TP in Battle] option.
   */
  optDisplayTp: boolean;

  /**
   * The truth value of the [Reserve Members' EXP] option.
   */
  optExtraExp: boolean;

  /**
   * The truth value of the [use side-view battle] option.
   */
  optSideView: boolean;

  /**
   * The title BGM (RPG.AudioFile).
   */
  titleBgm: rm.types.AudioFile;

  /**
   * The battle BGM (RPG.AudioFile).
   */
  battleBgm: rm.types.AudioFile;

  /**
   * The battle end ME (RPG.AudioFile).
   */
  battleEndMe: rm.types.AudioFile;

  /**
   * The gameover ME (RPG.AudioFile).
   */
  gameoverMe: rm.types.AudioFile;

  /**
   * Sound effects. An RPG.SE array.
   */
  sounds: Array<rm.types.AudioFile>;

  /**
   * The map ID of the player's initial position.
   */
  startMapId: number;

  /**
   * The map's x-coordinate of the player's initial position.
   */
  startX: number;

  /**
   * The map's y-coordinate of the player's initial position.
   */
  startY: number;

  /**
   * Terms (RPG.System.Terms).
   */
  terms: Terms;

  /**
   * Party settings for battle tests. An RPG.System.TestBattler array.
   */
  testBattlers: Array<TestBattler>;

  /**
   * The enemy troop ID for battle tests.
   */
  testTroopId: number;

  /**
   * The file name of the battle background (floor) graphic for use in editing enemy troops and battle tests.
   */
  battleback1Name: string;

  /**
   * The file name of the battle background (wall) graphic for use in editing enemy troops and battle tests.
   */
  battleback2Name: string;

  /**
   * The battler graphic file name for use in editing animations.
   */
  battlerName: string;

  /**
   * The adjustment value for the battler graphic's hue (0..360) for use in editing animations.
   */
  battlerHue: number;

  /**
   * The ID of the map currently being edited. For internal use.
   */
  editMapId: number;
}