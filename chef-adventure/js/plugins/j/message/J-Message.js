//region Introduction
/*:
 * @target MZ
 * @plugindesc [v2.1.1 MESSAGE] Gives access to more message window functionality.
 * @author JE
 * @url https://github.com/je-can-code/rmmz-plugins
 * @base J-Base
 * @orderAfter J-Base
 * @orderAfter J-SDP
 * @help
 * ============================================================================
 * OVERVIEW
 * This plugin grants additional message functionality.
 * - Adds new text codes for various database objects.
 * - Adds new conditionals for showing/hiding choices.
 * - Adds text codes that animate the text itself.
 * - Gives each speaker their own voice and reading pace.
 *
 * ============================================================================
 * NEW TEXT CODES:
 * Have you ever wanted to be able to reference a particular entry in the
 * database without having to hardcode the name of the entry and the icon into
 * the message window? Well now you can! By adding the correct text codes into
 * your message windows (or in your plugins using .drawTextEx()), you too can
 * leverage entries from the database without any significant difficulty!
 *
 * NOTE:
 * All new text codes except \Enemy[ID] will also prepend their corresponding
 * icon as well. This is because enemies don't have icons assigned to them.
 *
 * NEW TEXT CODES AVAILABLE:
 *  From their own respectively named tabs
 *  \Weapon[ID]
 *  \Armor[ID]
 *  \Item[ID]
 *  \State[ID]
 *  \Skill[ID]
 *  \Enemy[ID]
 *
 *  From the "Types" tab:
 *  \element[ID]
 *  \equipType[ID]
 *  \weaponType[ID]
 *  \armorType[ID]
 *  \skillType[ID]
 *
 *  From mine other plugins:
 *  \sdp[SDP_KEY]
 *  \quest[QUEST_KEY]
 *  \param[PARAM_KEY]
 *
 * Where ID is the id of the entry in the database.
 * Where SDP_KEY is the key of the panel.
 * Where QUEST_KEY is the key of the quest.
 * Where PARAM_KEY is a registered J-Base ParameterRegistry key (e.g. "atk", "mcr", "hcr").
 * An unrecognized PARAM_KEY renders as an unmistakable "!!! UNKNOWN PARAM !!!" in red with a
 * question-mark icon instead of failing silently- this is always an authoring mistake, never a
 * legitimate zero/empty result.
 *
 * NEW TEXT CODES EXAMPLES:
 *  \Weapon[4]
 * The text of "\Weapon[4]" will be replaced with:
 * - the icon of the weapon matching id 4 in the database.
 * - the name of the weapon matching id 4 in the database.
 *
 *  \Skill[101]
 * The text of "\Skill[101]" will be replaced with:
 * - the icon of the skill matching id 101 in the database.
 * - the name of the skill matching id 101 in the database.
 *
 *  \param[atk]
 * The text of "\param[atk]" will be replaced with:
 * - the icon of the "atk" parameter from the ParameterRegistry.
 * - the label of the "atk" parameter from the ParameterRegistry.
 *
 *  \param[typo]
 * An unregistered key like "typo" will be replaced with a bright red
 * "!!! UNKNOWN PARAM !!!" and a question-mark icon instead of doing nothing.
 *
 * ============================================================================
 * NEW TEXT STYLES:
 * Have you ever wanted to be able to style your already amazing comic sans ms
 * font with italics or bold? Well now you can! By adding the correct text
 * codes into your message windows (or in your plugins using .drawTextEx()),
 * you too can flourish with italics and/or stand stoic with bold!
 *
 * NOTE:
 * The following styles act as 'toggles', in the sense that all characters that
 * are surrounded by the text codes of \_ or \* would be of their corresponding
 * style- italics or bold respectively. See the examples for clarity.
 *
 * NEW TEXT STYLES AVAILABLE:
 *  \_      (italics)
 *  \*      (bold)
 *
 * NEW TEXT STYLES EXAMPLES:
 *  "so it is \*gilbert\*. We finally meet \_at last\_."
 * In the passage above, the word "gilbert" would be bolded.
 * In the passage above, the words "at last" would be italicized.
 *
 * ============================================================================
 * ANIMATED TEXT
 * Bold and italics change how a letter is drawn. These change what it does
 * afterward- the letters of a message are individually animated objects, so
 * they can be made to move and change colour while they sit there.
 *
 * Like bold and italics, each of these is a toggle: the first one opens the
 * effect and the next one closes it again. An effect left open closes on its
 * own at the end of the page.
 *
 * ANIMATED TEXT CODES AVAILABLE:
 *  \~  the text rolls up and down like a wave
 *  \%  the text trembles in place
 *  \=  the text cycles through the colours of the rainbow
 *  \+  the text swells and settles again, like breathing
 *
 * The symbols are picked to look like what they do, so that a passage full of
 * them still reads: a tilde is a wave, a percent sign cannot make up its mind
 * whether it is going up or down, and a plus is something getting bigger.
 *
 * NOTE ON \+ AND EVENT COMMENTS:
 * Of the four, only \+ may appear inside an event comment tag. The others are
 * dropped by the comment parser before any plugin sees them, because ~, % and =
 * are not in the character set it accepts. This only matters for tags, not for
 * Show Text, where all four work everywhere.
 *
 * ANIMATED TEXT EXAMPLES:
 *  "whoa, that is \~incredible\~."
 * In the passage above, the word "incredible" would roll like a wave.
 *
 *  "d-did you \%hear\% that?"
 * In the passage above, the word "hear" would tremble.
 *
 *  "the door is \+locked\+."
 * In the passage above, the word "locked" would swell and settle.
 *
 * These stack with everything else, so \*\~shouting\~\* is both bold and
 * waving, and a colour code inside a wave keeps its colour while it moves.
 *
 * ============================================================================
 * COMBINING MESSAGES
 * A long speech is uncomfortable to author as a single Show Text command. The
 * editor offers four lines, the box holds four lines, and a paragraph broken
 * across several commands reaches the player as several boxes with a button
 * press between each one.
 *
 * The text code below welds a message onto the one written directly after it.
 * The two are revealed as a single message, in a single window that grows to
 * hold all of it. The code itself is removed before anything is drawn.
 *
 * TEXT CODE FORMAT:
 *  \more
 *
 * Put it anywhere in a Show Text command whose text should run on into the next
 * one. The end of the last line is the tidiest place; a line holding nothing
 * but the code leaves an empty line behind in the message.
 *
 * TEXT CODE EXAMPLES:
 *  Show Text: "I have been thinking about this for a while.\more"
 *  Show Text: "And I still do not know what to tell you."
 * Both lines appear together in one window, and the player presses the confirm
 * button once rather than twice.
 *
 *  Show Text: "First.\more"
 *  Show Text: "Second.\more"
 *  Show Text: "Third."
 * All three are welded into a single message. A chain runs for as long as each
 * message in it carries the code; the message that ends the chain does not.
 *
 * WHAT THE COMBINED MESSAGE LOOKS LIKE:
 * The first message of a chain decides everything about presentation- the face
 * image, the Name field, the Background and Position dropdowns, and the \pop
 * target if J-Message-Bubbles is installed. Every message welded onto it
 * contributes its text and nothing else.
 *
 * The window grows downward to fit, up to the height of the screen. A chain
 * that would outgrow the screen stops before the message that would overflow
 * it, and that message is shown as an ordinary separate message instead.
 *
 * A chain only ever reaches the Show Text command written immediately after it.
 * Anything sitting in between- a conditional branch closing, a set of choices,
 * the end of the page- ends the chain, whether or not more was asked for.
 *
 * ============================================================================
 * SPEAKER VOICES
 * Every message already knows who is speaking- either from the Name field of
 * the Show Text command, or from the face image it carries. That is enough to
 * give each character a voice of their own without editing a single line of
 * dialogue that has already been written.
 *
 * A speaker profile controls:
 *  - the sound that plays as their letters appear, and its pitch
 *  - how many letters pass between one of those sounds and the next
 *  - how long they linger on each letter
 *  - how long they pause on particular punctuation
 *  - effects that act on everything they say, with no text code needed
 *
 * Profiles are authored in "data/config.message.json". Unlike the other
 * configs in this suite, this one is optional: a project without it behaves
 * exactly as it did before, with every speaker on the engine's own pace and no
 * sound at all.
 *
 * The profile key is whatever literally sits in the Name field, which means a
 * message whose Name field reads "\N[1]" is keyed as "\N[1]" and NOT as the
 * actor's name. Messages with no Name field fall back to a key built from the
 * face image and its index, like "People2:3", so that eight characters sharing
 * one face sheet can still sound like eight different people.
 *
 * ============================================================================
 * NEW CHOICE CONDITIONALS
 * Have you ever wanted to be able to conditionally make choices appear based
 * on a situation like a switch or who the leader currently is? Well now you
 * can! By adding tags into the comments of your 'Show Choices' branches, you
 * too can have conditionally appearing choices in events!
 *
 * NOTE:
 * It is untested how well this functions with nested 'Show Choices' commands,
 * if it functions at all as-intended. It is recommended to avoid nesting the
 * switches.
 *
 * TAG USAGE:
 * - Event Commands - specifically in a 'Show Choices' branch/choice.
 *
 * TAG FORMAT:
 *  <leaderChoiceCondition:ACTOR_ID>
 *  <notLeaderChoiceCondition:ACTOR_ID>
 *    Where ACTOR_ID represents the id of the actor
 *    to condition this choice for.
 *
 * <switchOnChoiceCondition:SWITCH_ID>
 * <switchOffChoiceCondition:SWITCH_ID>
 *    Where SWITCH_ID represents the id of the switch
 *    to condition this choice for.
 *
 * TAG EXAMPLES:
 *  <leaderChoiceCondition:4>
 * The choice with this in its branch will be visible only while the actor of
 * ACTOR_ID 4 is the leader when this event gets triggered.
 *
 *  <notLeaderChoiceCondition:17>
 * The choice with this in its branch will be hidden only while the actor of
 * ACTOR_ID 17 is the leader when this event gets triggered.
 *
 *  <switchOnChoiceCondition:222>
 * The choice with this in its branch will be visible only while the switch of
 * SWITCH_ID 222 is ON when this event gets triggered.
 *
 *  <switchOffChoiceCondition:74>
 * The choice with this in its branch will be visible only while the switch of
 * SWITCH_ID 74 is OFF when this event gets triggered.
 *
 * ============================================================================
 * CHANGELOG:
 * - 2.1.1
 *    A Show Choices, Input Number or Select Item with no Show Text above it no
 *    longer flashes an empty message box as it closes.
 * - 2.1.0
 *    Added the \more text code, which welds a message onto the one written
 *    after it. The box grows to hold whatever they add up to.
 * - 2.0.0
 *    Renamed from J-MessageTextCodes. Update the entry in js/plugins.js and
 *    delete the old file; nothing else in a project has to change.
 *    Message text is now drawn as one sprite per character rather than baked
 *    into the window's bitmap, which is what lets a letter move after it has
 *    been drawn. Added \~ wave, \% jitter, \= rainbow and \+ pulse, which
 *    nest with each other and with the engine's own codes.
 *    Added speaker profiles, read from data/config.message.json and keyed by
 *    the Name field or the face. A profile carries a voice, a pace, per-
 *    punctuation beats and effects that act on everything that speaker says,
 *    so dialogue already written gains a character without being edited.
 *    Added layoutMessageGlyphs, which builds a message's glyphs before any of
 *    them are revealed - the only way something drawing a container around
 *    them can know its size on the frame it opens.
 *    Effects now declare how far they travel, so a container can reserve room
 *    for an effect it has never heard of.
 *    Added a named-section accessor for the external config, so an extension
 *    can read its own settings without opening the file a second time.
 *    A finished message now fades out over about half a second rather than
 *    blinking away. The engine's own close hides a window's client area on
 *    its first frame, so the text always left instantly no matter how long
 *    the frame took to collapse. Length is the "fade" section of the config.
 * - 1.3.1
 *    Fixed choice conditionals not hiding branches inside called common events.
 * - 1.3.0
 *    Added \param[PARAM_KEY] text code, pulling name/icon/color from the
 *    shared J-Base ParameterRegistry catalog. An unregistered key renders as
 *    a loud red "!!! UNKNOWN PARAM !!!" instead of failing silently.
 * - 1.2.1
 *    Added helper for applying text color to fragments.
 * - 1.2.0
 *    Embedded a modified version of HIME's choice conditionals into this.
 *      Said plugin was added and modified and extended for other purposes.
 *    Implemented questopedia text code format.
 *    Added basic choice conditionals for switches and leader for choices.
 * - 1.1.0
 *    Implemented element, the four "types" from database data.
 *    Added plugin dependency of J-Base.
 *    Implemented SDP panel text code format.
 * - 1.0.0
 *    Initial release.
 *    Implemented style toggles for bold and italics.
 *    Implemented weapon/armor/item/state/skill/enemy names from database data.
 * ============================================================================
 */

//#region src/plugins/message/core/services/MessageConfig.js
/**
* The parsed contents of J-Message's external config, held where anything can ask for its own part
* of it.
*
* The config file is read exactly once, at load, and this is what keeps that true as the number of
* things reading it grows. An extension that read the file a second time would work, and would be
* wrong: two readers means two moments at which the file can disagree with itself, and the one that
* loses is whichever happened to run first.
*
* Sections are addressed by name rather than exposed as fields, so a ship that does not exist yet
* can claim a section of the config without anything in core changing to let it.
*
* **An absent section is an answer, not a failure.** The whole file is optional by design - a
* project that has written no config at all is a supported project - so every consumer has to hold
* its own defaults regardless, and handing back an empty section lets it merge over them with no
* special case for "the file was never written".
*/
var MessageConfig = class MessageConfig {
	/**
	* Every section of the config, exactly as the file was parsed.
	* @type {object}
	*/
	static #config = {};
	/**
	* Replaces everything this holds with the contents of a parsed config.
	*
	* Wholesale rather than incremental, for the same reason the profile resolver does it wholesale: a
	* reload during development must leave no trace of what it replaced, or a section deleted from the
	* file would go on being answered from memory.
	* @param {object} config The parsed message config.
	*/
	static load(config) {
		MessageConfig.#config = config;
	}
	/**
	* Hands back one named section of the config.
	* @param {string} name The section's key in the config file, ex: `chatter`.
	* @returns {object} The section, or an empty one if the config never mentioned it.
	*/
	static section(name) {
		const section = MessageConfig.#config[name];
		if (section === undefined) return {};
		return section;
	}
};

//#endregion
//#region src/plugins/message/core/__models/MessageSpeakerProfile.js
/**
* How one character's words arrive on screen.
*
* Everything here is a property of the *speaker* rather than of the line, which is the whole reason
* the class exists. An author emphasising a word types a text code; a character sounding like
* themselves should cost the author nothing at all, in any of the thousands of lines they were
* already given. That asymmetry is the leverage: a handful of profiles reaches back across every
* conversation already written and gives it a voice, with no line edited anywhere.
*
* The defaults below are deliberately the behaviour the game has today - one frame per character,
* no sound, no motion - so a speaker nobody has written a profile for reads exactly as they always
* did rather than as a bug.
*/
var MessageSpeakerProfile = class MessageSpeakerProfile {
	/**
	* The sound effect played as this character's letters appear, or empty for a silent speaker.
	*
	* Silence is the default and is a legitimate answer, not an oversight: narration, signs and
	* system text have no mouth, and a blip on a wooden noticeboard would be worse than nothing.
	* @type {string}
	*/
	voiceSeName = String.empty;
	/**
	* How loud this character's voice is.
	* @type {number}
	*/
	voiceVolume = 90;
	/**
	* The pitch this character's voice plays at.
	*
	* The single most recognisable thing about a voice made of one repeated blip - a low pitch reads
	* as large and slow, a high one as small and quick, before any other setting is touched.
	* @type {number}
	*/
	voicePitch = 100;
	/**
	* How far this character's voice sits off centre.
	* @type {number}
	*/
	voicePan = 0;
	/**
	* How far each blip may wander from this character's base pitch.
	*
	* The difference between a voice and a metronome. One sound repeated at one pitch reads as a
	* machine no matter how well the pitch is chosen; the same sound wandering a few points either
	* side of centre reads as somebody talking, and it is most of what Animal Crossing's cast is
	* actually made of. Zero is a flat tone, which is the default because it is what the game did
	* before anyone wrote a profile.
	* @type {number}
	*/
	voicePitchVariance = 0;
	/**
	* How many characters pass between one blip and the next.
	*
	* A sound on every single letter is a buzz rather than a voice, and the engine would refuse most
	* of them anyway - {@link AudioManager.playSe} declines to start the same sound twice in one
	* frame. Spacing them out is what turns a tone into speech.
	* @type {number}
	*/
	voiceStride = 2;
	/**
	* How many frames this character lingers on each letter.
	*
	* One is the engine's own pace and the default. Higher reads as deliberate or weary, and the
	* difference between a two and a three is the difference between two people who sound alike and
	* two people who do not.
	* @type {number}
	*/
	framesPerCharacter = 1;
	/**
	* Extra frames spent on particular characters, by the character itself.
	*
	* What lets a sentence breathe. A comma that costs a beat and a full stop that costs several are
	* most of what separates dialogue that reads aloud from dialogue that scrolls.
	* @type {Object<string, number>}
	*/
	punctuationFrames = {};
	/**
	* Effects that act on everything this character says.
	*
	* The half of the effect system an author never types. A ghost is not a line that happens to
	* wave; it is a character who always does.
	* @type {string[]}
	*/
	baselineEffects = [];
	/**
	* The profile used for anyone nobody has written one for.
	*
	* Narration, signs, system text and every NPC not yet given a voice all land here, and it must
	* therefore be indistinguishable from the game as it behaves today.
	* @returns {MessageSpeakerProfile}
	*/
	static default() {
		return new MessageSpeakerProfile();
	}
	/**
	* Builds a profile from one entry of the external config.
	*
	* Every field falls back to the class default when the config is silent about it, so an author
	* writing a profile only has to say the part that makes this character different.
	* @param {object} entry One speaker's entry from the config file.
	* @returns {MessageSpeakerProfile}
	*/
	static fromConfig(entry) {
		const profile = new MessageSpeakerProfile();
		profile.voiceSeName = entry.voiceSeName ?? profile.voiceSeName;
		profile.voiceVolume = entry.voiceVolume ?? profile.voiceVolume;
		profile.voicePitch = entry.voicePitch ?? profile.voicePitch;
		profile.voicePan = entry.voicePan ?? profile.voicePan;
		profile.voicePitchVariance = entry.voicePitchVariance ?? profile.voicePitchVariance;
		profile.voiceStride = entry.voiceStride ?? profile.voiceStride;
		profile.framesPerCharacter = entry.framesPerCharacter ?? profile.framesPerCharacter;
		profile.punctuationFrames = entry.punctuationFrames ?? profile.punctuationFrames;
		profile.baselineEffects = entry.baselineEffects ?? profile.baselineEffects;
		return profile;
	}
	/**
	* Whether this speaker makes any sound at all as their words appear.
	* @returns {boolean}
	*/
	hasVoice() {
		return this.voiceSeName !== String.empty;
	}
	/**
	* The sound effect object this speaker's voice plays, in the shape the engine's audio wants.
	* @param {number} [pitch] The pitch for this particular blip; defaults to this speaker's base.
	* @returns {{name: string, volume: number, pitch: number, pan: number}}
	*/
	voiceSe(pitch = this.voicePitch) {
		return {
			name: this.voiceSeName,
			volume: this.voiceVolume,
			pitch,
			pan: this.voicePan
		};
	}
};

//#endregion
//#region src/plugins/message/core/services/MessageProfileResolver.js
/**
* Works out who is talking, so their profile can be applied to what they say.
*
* There is no speaker id in an RMMZ message. There is a Name field and a face image, and between
* them they identify almost everybody: a project that has been filling in either one has been
* building this index for years without meaning to, which is what makes a voice system something
* that can be switched on rather than something that has to be migrated toward.
*
* **The name is asked first, and it is matched literally.** The Name field holds whatever the
* author typed, and `\N[1]` is a perfectly ordinary thing to type there - the message window
* resolves that code into an actor's name at draw time, but the field itself never does. So the key
* is the code, not the name it renders as, and a config entry written under the rendered name would
* match nothing at all. It is the single most likely way to author this wrong.
*
* The face is asked second and keyed with its index as well as its filename, because a shared sheet
* is eight different people. Keying on the sheet alone would hand one voice to all of them.
*
* Anyone neither question identifies gets the default profile, and that is a correct answer rather
* than a fallback: narration, signposts and system text have no speaker, and giving them one would
* be the actual mistake.
*/
var MessageProfileResolver = class MessageProfileResolver {
	/**
	* Separates a face sheet's filename from the index within it, in a config key.
	* @type {string}
	*/
	static FaceKeySeparator = ":";
	/**
	* The profiles keyed by the literal contents of a message's Name field.
	* @type {Map<string, MessageSpeakerProfile>}
	*/
	static #bySpeakerName = new Map();
	/**
	* The profiles keyed by face sheet and index.
	* @type {Map<string, MessageSpeakerProfile>}
	*/
	static #byFace = new Map();
	/**
	* The profile handed to anyone the other two cannot identify.
	* @type {MessageSpeakerProfile}
	*/
	static #fallback = MessageSpeakerProfile.default();
	/**
	* Replaces everything this resolver knows with the contents of a parsed config.
	*
	* Wholesale rather than incremental, because a reload during development should leave no trace of
	* the profile it replaced - a speaker deleted from the config must stop being recognised.
	* @param {object} config The parsed message config.
	*/
	static load(config) {
		MessageProfileResolver.#bySpeakerName = MessageProfileResolver.buildProfiles(config.bySpeakerName);
		MessageProfileResolver.#byFace = MessageProfileResolver.buildProfiles(config.byFace);
		MessageProfileResolver.#fallback = MessageProfileResolver.buildFallback(config.defaultProfile);
	}
	/**
	* Turns one keyed section of the config into profiles.
	* @param {object} section The config section, or nothing if it was omitted.
	* @returns {Map<string, MessageSpeakerProfile>}
	*/
	static buildProfiles(section) {
		const profiles = new Map();
		const entries = Object.entries(section ?? {});
		entries.forEach(([key, entry]) => {
			profiles.set(key, MessageSpeakerProfile.fromConfig(entry));
		});
		return profiles;
	}
	/**
	* Builds the profile used for unidentified speakers.
	* @param {object} entry The config's default profile entry, or nothing if it was omitted.
	* @returns {MessageSpeakerProfile}
	*/
	static buildFallback(entry) {
		if (entry === undefined) return MessageSpeakerProfile.default();
		return MessageSpeakerProfile.fromConfig(entry);
	}
	/**
	* The config key a face sheet and index are stored under.
	* @param {string} faceName The face sheet's filename.
	* @param {number} faceIndex The index within that sheet.
	* @returns {string}
	*/
	static faceKey(faceName, faceIndex) {
		return `${faceName}${MessageProfileResolver.FaceKeySeparator}${faceIndex}`;
	}
	/**
	* Resolves the profile for whoever is speaking the current message.
	* @param {string} speakerName The literal contents of the message's Name field.
	* @param {string} faceName The face sheet's filename, or empty if the message has no face.
	* @param {number} faceIndex The index within that sheet.
	* @returns {MessageSpeakerProfile}
	*/
	static resolve(speakerName, faceName, faceIndex) {
		const named = MessageProfileResolver.#bySpeakerName.get(speakerName);
		if (named !== undefined) return named;
		const key = MessageProfileResolver.faceKey(faceName, faceIndex);
		const faced = MessageProfileResolver.#byFace.get(key);
		if (faced !== undefined) return faced;
		return MessageProfileResolver.#fallback;
	}
};

//#endregion
//#region src/plugins/message/core/_metadata/_pluginMetadata.js
var J_MessagePluginMetadata = class J_MessagePluginMetadata extends PluginMetadata {
	/**
	* The project-relative path to this plugin's external configuration file.
	*
	* Unlike every other config in this codebase, **this one is optional**, and deliberately so.
	* J-Message shipped for years without it and every project already using it has thousands of
	* lines of dialogue that must keep rendering exactly as they do today. A voice is an enhancement
	* layered onto text that already works, so its absence means "nobody has written voices yet"
	* rather than "this install is broken".
	*
	* A config that exists and is malformed is still a loud failure, because that is an authoring
	* mistake rather than a choice.
	* @type {string}
	*/
	static CONFIG_PATH = "data/config.message.json";
	/**
	* Constructor.
	*/
	constructor(name, version) {
		super(name, version);
	}
	/**
	* Extends {@link PluginMetadata.postInitialize}.<br/>
	* Also loads the external config, if this project has written one.
	*/
	postInitialize() {
		super.postInitialize();
		this.initializeConfiguration();
	}
	/**
	* Reads the external config once and hands it to everything that reads a part of it.
	*
	* One read and one distribution point, so a section can be claimed by a new consumer without the
	* file gaining a second reader that could see a different version of it.
	*/
	initializeConfiguration() {
		const config = this.readConfig();
		MessageConfig.load(config);
		MessageProfileResolver.load(config);
	}
	/**
	* Reads and parses the external config.
	* @returns {object} The parsed config, or an empty one if this project has not written the file.
	*/
	readConfig() {
		const rawConfig = StorageManager.fsReadFile(J_MessagePluginMetadata.CONFIG_PATH);
		if (rawConfig === null || rawConfig === String.empty) return {};
		const options = ExternalJsonConfigLoaderOptions.Builder().pluginName("J-Message").configName("message configuration").build();
		return ExternalJsonConfigLoader.load(J_MessagePluginMetadata.CONFIG_PATH, options);
	}
};

//#endregion
//#region src/plugins/message/core/_metadata/initialization.js
/**
* The core where all of my extensions live: in the `J` object.
*/
globalThis.J ||= {};
/**
* The plugin umbrella that governs all things related to this plugin.
*/
J.MESSAGE = {};
/**
* The `metadata` associated with this plugin, such as version.
*/
J.MESSAGE.Metadata = new J_MessagePluginMetadata("J-Message", "2.1.1");
/**
* A collection of all base aliases.
*/
J.MESSAGE.Aliased = {};
J.MESSAGE.Aliased.Game_Interpreter = new Map();
J.MESSAGE.Aliased.Game_Message = new Map();
J.MESSAGE.Aliased.Window_Base = new Map();
J.MESSAGE.Aliased.Window_ChoiceList = new Map();
J.MESSAGE.Aliased.Window_Message = new Map();
/**
* The text codes that toggle a rendering effect, mapped to the effect they toggle.
*
* Symbols rather than words, and pictographic on purpose: a tilde is a wave, and a percent sign
* cannot make up its mind whether it is going up or down. That is the whole mnemonic, and it is
* what an author reading a map file three years from now has instead of documentation.
*
* These are permanent grammar the moment any map carries one, on exactly the same terms as the
* notetags - the game data becomes the thing that has to keep working, not this table.
* @type {Map<string, string>}
*/
J.MESSAGE.EffectCodes = new Map([
	["~", "wave"],
	["%", "jitter"],
	["=", "rainbow"],
	["+", "pulse"]
]);
J.MESSAGE.RegExp = {};
J.MESSAGE.RegExp.LeaderChoiceConditional = /<leaderChoiceCondition:[ ]?(\d+)>/i;
J.MESSAGE.RegExp.NotLeaderChoiceConditional = /<notLeaderChoiceCondition:[ ]?(\d+)>/i;
J.MESSAGE.RegExp.SwitchOnChoiceConditional = /<switchOnChoiceCondition:[ ]?(\d+)>/i;
J.MESSAGE.RegExp.SwitchOffChoiceConditional = /<switchOffChoiceCondition:[ ]?(\d+)>/i;
/**
* The text code welding a message to the one written after it.
*
* <pre>
* Structure:
*  \more
*
* Example:
*  I have been thinking about this for a while.\more
*
* Translation:
*  reveal this message and the next one together, as a single window.
* </pre>
*
* The trailing word boundary is what keeps this from matching the front of a longer code. Without
* it a `\moreover` somebody invents later would be silently eaten here, and the half of it left
* behind would be drawn to the screen for a player to read.
* @type {RegExp}
*/
J.MESSAGE.RegExp.MoreLink = /\\more\b/i;

//#endregion
//#region src/plugins/message/core/__models/BasicChoiceConditional.js
/**
* A basic choice conditional that can be checked for choice validity based on current leader or switch state.
*/
var BasicChoiceConditional = class BasicChoiceConditional {
	/**
	* A static property containing the strings representing validation types supported.
	*/
	static Types = {
		Leader: "leader",
		NotLeader: "not-leader",
		SwitchOn: "switch-on",
		SwitchOff: "switch-off"
	};
	/**
	* The {@link BasicChoiceConditional.Types} that this conditional is.
	* @type {string}
	*/
	type = String.empty;
	/**
	* The id corresponding with the conditional being validated.
	* @type {number}
	*/
	id = 0;
	/**
	* @constructor
	* @param {string} type The {@link BasicChoiceConditional.Types} that this conditional is.
	* @param {number} id The id that corresponds with the designated {@link BasicChoiceConditional.Types}.
	*/
	constructor(type, id) {
		this.type = type;
		this.id = id;
	}
	/**
	* Determines whether or not this {@link BasicChoiceConditional} is met.
	* @returns {boolean}
	*/
	isMet() {
		switch (this.type) {
			case BasicChoiceConditional.Types.Leader: return $gameParty.leader() && $gameParty.leader().actorId() === this.id;
			case BasicChoiceConditional.Types.NotLeader: return $gameParty.leader() && $gameParty.leader().actorId() !== this.id;
			case BasicChoiceConditional.Types.SwitchOn: return $gameSwitches.value(this.id) === true;
			case BasicChoiceConditional.Types.SwitchOff: return $gameSwitches.value(this.id) === false;
		}
		return true;
	}
};

//#endregion
//#region src/plugins/message/core/__models/FadingSprites.js
/**
* The sprites a layer is still showing on their way out.
*
* A plane that syncs itself against a list of records has one awkward moment: the record is gone and
* the sprite is not, because the sprite has half a second of leaving left to do. Held in the same
* map it was before, it would be found again by the next sync and read as still current; removed
* outright, it would blink away, which is the thing being fixed. So it moves here instead - out of
* the layer's living set and into one that is counting down.
*
* It holds sprites and does no drawing, which is what keeps the bookkeeping out of the layers. Two
* different planes in two different plugins do exactly this, and they have to do it identically or a
* conversation and the muttering behind it leave the screen at different rates.
*/
var FadingSprites = class {
	/**
	* Everything on its way out, by the key it used to be known under.
	* @type {Map<string, {sprite: object, elapsed: number, frames: number}>}
	*/
	#departing = new Map();
	/**
	* Starts a sprite fading.
	*
	* The length is taken once, here, rather than asked for on each frame: a config reloaded while
	* something is leaving must not change how long it has left.
	* @param {string} key What the sprite was known as.
	* @param {object} sprite The sprite to fade.
	* @param {number} frames How many frames it should take.
	*/
	begin(key, sprite, frames) {
		this.#departing.set(key, {
			sprite,
			elapsed: 0,
			frames,
			from: sprite.alpha
		});
	}
	/**
	* Whether a key is currently on its way out.
	* @param {string} key The key in question.
	* @returns {boolean}
	*/
	has(key) {
		return this.#departing.has(key);
	}
	/**
	* Stops a sprite fading and hands it back.
	*
	* What happens when somebody starts talking again halfway through having stopped. The sprite that
	* was leaving is not reused - it is showing the previous line - so it is handed over to be taken
	* off the plane, and the caller builds a new one.
	* @param {string} key The key that came back.
	* @returns {?object} The sprite that was leaving, or null if nothing was.
	*/
	take(key) {
		const departing = this.#departing.get(key);
		if (departing === undefined) return null;
		this.#departing.delete(key);
		return departing.sprite;
	}
	/**
	* Advances every fade by one frame.
	* @param {function(number, number): number} alphaAt How opaque a fade is at a given point.
	* @returns {Array<{key: string, sprite: object}>} Everything that finished leaving this frame.
	*/
	update(alphaAt) {
		const finished = [];
		this.#departing.forEach((departing, key) => {
			departing.elapsed += 1;
			departing.sprite.alpha = departing.from * alphaAt(departing.elapsed, departing.frames);
			if (departing.elapsed < departing.frames) return;
			finished.push({
				key,
				sprite: departing.sprite
			});
		});
		finished.forEach(({ key }) => this.#departing.delete(key));
		return finished;
	}
	/**
	* Everything currently on its way out.
	* @returns {object[]}
	*/
	sprites() {
		const all = [];
		this.#departing.forEach((departing) => all.push(departing.sprite));
		return all;
	}
};

//#endregion
//#region src/plugins/message/core/services/MessageFade.js
/**
* How a message leaves the screen.
*
* The engine's own answer is a vertical collapse over eight frames, and it has a flaw that is easy
* to miss and impossible to unsee: a window's client area is hidden the instant its openness drops
* below full, so the *text* disappears on the first frame of that animation and what plays out is an
* empty frame folding up. On anything drawn without a frame - a bubble, say - there is nothing left
* to watch at all, and a message simply blinks out of existence.
*
* So messages fade instead. The whole thing, letters included, goes translucent over about half a
* second and is gone. Nothing about it is load-bearing; it is entirely about a line of dialogue
* being allowed to finish rather than being switched off.
*
* **The length is a single knob, in one place, shared by everything that fades.** A bubble, the line
* behind it in the same conversation, and an NPC muttering across the square all have to leave at
* the same rate or the screen reads as three systems rather than one.
*/
var MessageFade = class MessageFade {
	/**
	* The section of J-Message's external config these settings live in.
	* @type {string}
	*/
	static ConfigSection = "fade";
	/**
	* How many frames a message takes to fade, before any project has said otherwise.
	*
	* About half a second. Long enough to read as a deliberate exit rather than a dropped frame, short
	* enough that somebody mashing through a conversation never waits on it.
	* @type {number}
	*/
	static DefaultFrames = 30;
	/**
	* How many frames a message takes to fade in this project.
	* @returns {number}
	*/
	static frames() {
		const section = MessageConfig.section(MessageFade.ConfigSection);
		return section.frames ?? MessageFade.DefaultFrames;
	}
	/**
	* How opaque a fading message is after a given number of frames.
	*
	* Linear on purpose. An eased fade reads as a thing being animated, and the point of this is for
	* nobody to notice anything happened at all beyond the message having finished.
	* A fade configured to take no frames at all answers zero from its very first tick, which is the
	* old instant behaviour and is what a project asking for no fade meant. Nothing special is done to
	* arrange that; a fade with nothing left has nothing left however it got there.
	* @param {number} elapsed How many frames the fade has been running.
	* @param {number} frames How many frames the whole fade takes.
	* @returns {number} The opacity, from one down to zero.
	*/
	static alphaAt(elapsed, frames) {
		const remaining = frames - elapsed;
		if (remaining <= 0) return 0;
		return remaining / frames;
	}
	/**
	* Whether a fade that has run this long is finished.
	* @param {number} elapsed How many frames the fade has been running.
	* @param {number} frames How many frames the whole fade takes.
	* @returns {boolean}
	*/
	static isFinished(elapsed, frames) {
		return elapsed >= frames;
	}
};

//#endregion
//#region src/plugins/message/core/objects/Game_Message.js
/**
* Extends {@link clear}.<br/>
* Also clears the custom choice data and forgets that the last message welded to another.
*/
J.MESSAGE.Aliased.Game_Message.set("clear", Game_Message.prototype.clear);
Game_Message.prototype.clear = function() {
	J.MESSAGE.Aliased.Game_Message.get("clear").call(this);
	/**
	* An object tracking key:value (index:boolean) pairs for whether or not an index of a choice is hidden.
	* @type {Map<number, boolean>}
	*/
	this.setHiddenChoiceConditions(new Map());
	/**
	* A container for backing up the choice collection.
	* @type {string[]}
	*/
	this.setOldChoices([]);
	/**
	* Whether the message being assembled continues into the one written after it.
	* @type {boolean}
	*/
	this.flagMoreLink(false);
};
/**
* Extends {@link add}.<br/>
* Also lifts the weld code out of the line before the line becomes something a player reads.
*
* Taken out here rather than while the message is being drawn, because by then the text has been
* measured, broken into lines and handed to a window - and a code still sitting in it has occupied
* width and, if nothing happened to consume it, been rendered to the screen. The line that reaches
* the message should already be the line the player sees.
* @param {string} text One line of the message.
*/
J.MESSAGE.Aliased.Game_Message.set("add", Game_Message.prototype.add);
Game_Message.prototype.add = function(text) {
	const spoken = this.extractMoreLink(text);
	J.MESSAGE.Aliased.Game_Message.get("add").call(this, spoken);
};
/**
* Reads the weld code out of a line, remembering that it was there.
*
* The flag is raised here and never lowered here. A message is several lines and the code may sit on
* any one of them, so a later line finding nothing says nothing about what an earlier line found.
* Lowering it belongs to the interpreter, which is the only thing that knows where one message ends
* and the next begins.
* @param {string} text One line of the message.
* @returns {string} The line without its weld code, or the line unchanged when it had none.
*/
Game_Message.prototype.extractMoreLink = function(text) {
	const match = J.MESSAGE.RegExp.MoreLink.exec(text);
	if (match === null) return text;
	this.flagMoreLink(true);
	return text.replace(match.at(0), String.empty);
};
/**
* Clones the original choice data into a backup for later use.
*/
Game_Message.prototype.backupChoices = function() {
	const backup = this.choices().clone();
	this.setOldChoices(backup);
};
/**
* Restores the cloned original choice data from backup.
*/
Game_Message.prototype.restoreChoices = function() {
	this._choices = this.oldChoices().clone();
};
/**
* Determines whether or not this choice is actually hidden.
* @param {number} choiceIndex The index of the option to check.
* @returns {boolean}
*/
Game_Message.prototype.isChoiceHidden = function(choiceIndex) {
	if (this.hiddenChoiceConditions().has(choiceIndex)) {
		return this.hiddenChoiceConditions().get(choiceIndex);
	}
	return false;
};
/**
* Sets a choice to be hidden or not.
* @param {number} choiceIndex The index of the option to set.
* @param {boolean} isHidden Whether or not this choice is hidden.
*/
Game_Message.prototype.hideChoice = function(choiceIndex, isHidden) {
	this.hiddenChoiceConditions().set(choiceIndex, isHidden);
};
/**
* Gets the hidden choice conditions.
* @returns {Map<number, boolean>} The hiddenChoiceConditions.
*/
Game_Message.prototype.hiddenChoiceConditions = function() {
	return this._hiddenChoiceConditions;
};
/**
* Sets the hidden choice conditions.
* @param {Map<number, boolean>} newHiddenChoiceConditions The new hiddenChoiceConditions.
*/
Game_Message.prototype.setHiddenChoiceConditions = function(newHiddenChoiceConditions) {
	this._hiddenChoiceConditions = newHiddenChoiceConditions;
};
/**
* Gets the old choices.
* @returns {string[]} The oldChoices.
*/
Game_Message.prototype.oldChoices = function() {
	return this._oldChoices;
};
/**
* Sets the old choices.
* @param {string[]} newOldChoices The new oldChoices.
*/
Game_Message.prototype.setOldChoices = function(newOldChoices) {
	this._oldChoices = newOldChoices;
};
/**
* The lines of the message being assembled.
*
* The engine keeps these in a private field and offers only `allText` and `hasText` against it, so
* anything wanting to know how many lines a message holds has had nowhere to ask until now.
* @returns {string[]} The texts.
*/
Game_Message.prototype.texts = function() {
	return this._texts;
};
/**
* Whether the message being assembled continues into the one written after it.
* @returns {boolean} True when an author welded it to the next message.
*/
Game_Message.prototype.hasMoreLink = function() {
	return this._moreLinked;
};
/**
* Sets whether the message being assembled continues into the one written after it.
* @param {boolean} moreLinked The new moreLinked.
*/
Game_Message.prototype.flagMoreLink = function(moreLinked) {
	this._moreLinked = moreLinked;
};

//#endregion
//#region src/plugins/message/core/services/MessageChain.js
/**
* The rules governing how many messages weld into one window, and how tall that window becomes.
*
* A message carrying `\more` is not finished when its Show Text command is - the next one joins it,
* and the pair reveals as a single uninterrupted utterance. Welding continues for as long as each
* message in turn asks for it, which lets a long speech be authored as the short, separate Show Text
* commands the editor is comfortable with while the player reads one continuous thing.
*
* **The ceiling is the screen, and it is computed rather than configured.** A welded message has to
* fit somewhere, and the only honest answer to "how much is too much" is "more than there is room
* for". A number instead would be a number that is wrong at the first resolution nobody tested, and
* an author who hit it would have no way to tell a deliberate limit from a bug.
*
* Everything here is arithmetic on rows and pixels, and it deliberately holds no opinion about where
* those numbers came from. The interpreter measures a chain before welding one; the window sizes
* itself once the welding is done; both ask the same questions of this. That shared answer is what
* stops the cap the interpreter enforced and the height the window built from disagreeing.
*/
var MessageChain = class {
	/**
	* How many whole rows of text a window of a given height can show.
	* @param {number} height The window's full height, frame included.
	* @param {number} lineHeight How tall a single row of text is.
	* @param {number} padding How much space the frame occupies along one edge.
	* @returns {number} The number of rows that fit.
	*/
	static rowsFor(height, lineHeight, padding) {
		const available = height - padding * 2;
		return Math.floor(available / lineHeight);
	}
	/**
	* How tall a window must be to show a given number of rows.
	*
	* Grown from the height the scene built rather than recalculated from the row count, because that
	* height is not simply four rows and a frame - the scene adds a handful of pixels of its own on
	* top. A window rebuilt from arithmetic would quietly lose them and sit a hair tighter than every
	* other message in the game.
	* @param {number} rows How many rows the message needs.
	* @param {number} defaultHeight The height the scene built the window at.
	* @param {number} defaultRows How many rows that height already shows.
	* @param {number} lineHeight How tall a single row of text is.
	* @returns {number} The height the window should be.
	*/
	static heightFor(rows, defaultHeight, defaultRows, lineHeight) {
		if (rows <= defaultRows) return defaultHeight;
		return defaultHeight + (rows - defaultRows) * lineHeight;
	}
	/**
	* How many rows a welded message may hold before it runs out of screen.
	*
	* Derived from the same growing the window performs rather than from the bare screen height, and
	* that is the entire point of it. Rows counted one way and grown another agree only where the
	* arithmetic happens to leave slack, and at a great many resolutions it leaves none: counting rows
	* straight off a 816 pixel screen answers twenty-two, and twenty-two rows grown from a 176 pixel
	* box stand 824 pixels tall. Asked this way instead, the height for this many rows is never taller
	* than the screen, by construction rather than by luck.
	* @param {number} screenHeight How tall the screen is.
	* @param {number} defaultHeight The height the scene built the window at.
	* @param {number} defaultRows How many rows that height already shows.
	* @param {number} lineHeight How tall a single row of text is.
	* @returns {number} The most rows a welded message may hold.
	*/
	static maxRows(screenHeight, defaultHeight, defaultRows, lineHeight) {
		const growth = screenHeight - defaultHeight;
		return defaultRows + Math.floor(growth / lineHeight);
	}
	/**
	* Whether a chain can take another message without outgrowing the room it has.
	*
	* Asked before a message is welded rather than after, so a chain stops one message short of the
	* ceiling instead of crossing it and being trimmed back. A message half-welded is a message whose
	* author wrote lines the player never sees.
	* @param {number} currentRows How many rows the chain holds already.
	* @param {number} incomingRows How many rows the next message would add.
	* @param {number} maxRows How many rows there is room for.
	* @returns {boolean}
	*/
	static fits(currentRows, incomingRows, maxRows) {
		return currentRows + incomingRows <= maxRows;
	}
};

//#endregion
//#region src/plugins/message/core/objects/Game_Interpreter.js
/**
* Extends {@link command101}.<br/>
* Also welds the messages written after this one onto it, for as long as they ask to be welded.
*
* Done from the interpreter because the interpreter is the only thing that can see what comes next.
* By the time a window is involved the message has been handed over as finished text, and the event
* commands it was assembled from are no longer part of the conversation.
* @param {Array} params The parameters of the Show Text command.
* @returns {boolean} True if the message was started.
*/
J.MESSAGE.Aliased.Game_Interpreter.set("command101", Game_Interpreter.prototype.command101);
Game_Interpreter.prototype.command101 = function(params) {
	const started = J.MESSAGE.Aliased.Game_Interpreter.get("command101").call(this, params);
	if (started === false) return false;
	const welded = this.weldLinkedMessages();
	if (welded === false) return true;
	this.setupMessageFollowUp();
	return true;
};
/**
* Swallows the messages written after this one, for as long as each in turn asks to be swallowed.
* @returns {boolean} True if at least one message was welded on.
*/
Game_Interpreter.prototype.weldLinkedMessages = function() {
	let welded = false;
	while (this.canWeldNextMessage()) {
		this.weldNextMessage();
		welded = true;
	}
	return welded;
};
/**
* Whether the message written after this one should join it.
* @returns {boolean}
*/
Game_Interpreter.prototype.canWeldNextMessage = function() {
	if ($gameMessage.hasMoreLink() === false) return false;
	if (this.nextEventCode() !== 101) return false;
	return this.willLinkedMessageFit();
};
/**
* Whether the message written after this one still has room on screen to be shown in.
* @returns {boolean}
*/
Game_Interpreter.prototype.willLinkedMessageFit = function() {
	const currentRows = $gameMessage.texts().length;
	const incomingRows = this.countLinkedMessageRows();
	const maxRows = this.maxWeldedMessageRows();
	return MessageChain.fits(currentRows, incomingRows, maxRows);
};
/**
* How many lines the message written after this one holds.
* @returns {number}
*/
Game_Interpreter.prototype.countLinkedMessageRows = function() {
	const commands = this.list();
	let index = this.index() + 2;
	let rows = 0;
	while (commands.at(index).code === 401) {
		rows += 1;
		index += 1;
	}
	return rows;
};
/**
* How many rows of text the screen has room to show at once.
*
* Every number here is read off a prototype, because an interpreter has neither a window nor a scene
* to ask - and because that is how the engine itself does it, `calcWindowHeight` reaching for
* `fittingHeight` on exactly these terms while building the very window being measured.
*
* The scene's own rectangle is asked for rather than assumed, because the cap has to be derived from
* the same box the window grows out of. A ceiling counted straight off the screen and a height grown
* from the message box agree only where the arithmetic leaves slack, which at most resolutions it
* does not.
* @returns {number}
*/
Game_Interpreter.prototype.maxWeldedMessageRows = function() {
	const lineHeight = Window_Base.prototype.lineHeight();
	const padding = $gameSystem.windowPadding();
	const defaultRect = Scene_Message.prototype.messageWindowRect();
	const defaultHeight = defaultRect.height;
	const defaultRows = MessageChain.rowsFor(defaultHeight, lineHeight, padding);
	return MessageChain.maxRows(Graphics.boxHeight, defaultHeight, defaultRows, lineHeight);
};
/**
* Swallows the Show Text written after this one, adding its lines to the message being assembled.
*/
Game_Interpreter.prototype.weldNextMessage = function() {
	$gameMessage.flagMoreLink(false);
	this.setIndex(this.index() + 1);
	while (this.nextEventCode() === 401) {
		this.setIndex(this.index() + 1);
		const command = this.currentCommand();
		const line = command.parameters.at(0);
		$gameMessage.add(line);
	}
};
/**
* Offers the command sitting after the welded message to the handlers that can claim it.
*
* A mirror of the dispatch the original performs, and it exists because the original performed it
* against the wrong command: it looked at the Show Text this message has since swallowed. Without
* this, a chain ending in a "Show Choices" would reach the player as a message with no choices
* beneath it, and the branch the author wrote would never run.
*/
Game_Interpreter.prototype.setupMessageFollowUp = function() {
	const code = this.nextEventCode();
	if (this.isMessageFollowUpCode(code) === false) return;
	this.setIndex(this.index() + 1);
	const command = this.currentCommand();
	const { parameters } = command;
	switch (code) {
		case 102:
			this.setupChoices(parameters);
			break;
		case 103:
			this.setupNumInput(parameters);
			break;
		case 104:
			this.setupItemChoice(parameters);
			break;
	}
};
/**
* Whether an event command code is one that a message hands off to as it finishes.
* @param {number} code The event command code in question.
* @returns {boolean}
*/
Game_Interpreter.prototype.isMessageFollowUpCode = function(code) {
	return code === 102 || code === 103 || code === 104;
};
/**
* Extends {@link setupChoices}.<br/>
* Backs up the original choices identified by the completed setup.
*/
J.MESSAGE.Aliased.Game_Interpreter.set("setupChoices", Game_Interpreter.prototype.setupChoices);
Game_Interpreter.prototype.setupChoices = function(params) {
	J.MESSAGE.Aliased.Game_Interpreter.get("setupChoices").call(this, params);
	$gameMessage.backupChoices();
	this.evaluateChoicesForVisibility(params);
};
/**
* A hook for evaluating visibility of choices programmatically.
* @param {RPG_EventListCommand[]} params The choices parameters being setup.
*/
Game_Interpreter.prototype.evaluateChoicesForVisibility = function(params) {
	this.hideSpecificChoiceBranches(params);
};
/**
* Hide all the choices that don't meet the criteria.
* @param {RPG_EventListCommand} params The event command parameters.
*/
Game_Interpreter.prototype.hideSpecificChoiceBranches = function(params) {
	const currentCommand = this.currentCommand();
	const currentPageCommands = this.list();
	const startShowChoiceIndex = currentPageCommands.findIndex((item) => item === currentCommand);
	const endShowChoiceIndex = currentPageCommands.findIndex((item, index) => index > startShowChoiceIndex && item.indent === currentCommand.indent && item.code === 404);
	const showChoiceIndices = currentPageCommands.map((command, index) => {
		if (index < startShowChoiceIndex || index > endShowChoiceIndex) return null;
		if (currentCommand.indent !== command.indent) return null;
		if (command.code === 402 || command.code === 404) return index;
		return null;
	}).filter((choiceIndex) => choiceIndex !== null);
	const choiceGroups = showChoiceIndices.reduce((runningCollection, choiceIndex, index) => {
		const startIndex = choiceIndex;
		const endIndex = showChoiceIndices.at(index + 1);
		let counterIndex = startIndex;
		const choiceGroup = [];
		while (counterIndex < endIndex) {
			choiceGroup.push(counterIndex);
			counterIndex++;
		}
		runningCollection.push(choiceGroup);
		return runningCollection;
	}, []);
	const choiceGroupsHidden = choiceGroups.map((choiceGroup) => choiceGroup.some(this.shouldHideChoiceBranch, this), this);
	choiceGroupsHidden.forEach((isGroupHidden, choiceIndex) => this.setChoiceHidden(choiceIndex, isGroupHidden), this);
};
/**
* Determines whether a choice group- as in, a branch in a "Show Choices" event command, should be hidden from view.
* If this value returns false, it will be displayed. If it returns true, the choice branch will be hidden.
* @param {number} subChoiceCommandIndex The index in the list of commands of an event that represents this branch.
* @returns {boolean}
*/
Game_Interpreter.prototype.shouldHideChoiceBranch = function(subChoiceCommandIndex) {
	const currentPageCommands = this.list();
	const subEventCommand = currentPageCommands.at(subChoiceCommandIndex);
	if (!Game_Event.filterInvalidEventCommand(subEventCommand)) return false;
	if (!Game_Event.filterCommentCommandsForBasicConditionals(subEventCommand)) return false;
	const conditional = Game_Event.toBasicConditional(subEventCommand);
	const met = conditional.isMet();
	if (met) return false;
	return true;
};
/**
* Sets a choice to be hidden- or not. The choiceIndex parameter is 0-based. Set the shouldHide parameter to true for a
* given choice to hide it.
* @param {number} choiceIndex The 1-based number of the choice.
* @param {boolean=} shouldHide Whether or not the choice should be hidden; defaults to true.
*/
Game_Interpreter.prototype.setChoiceHidden = function(choiceIndex, shouldHide = true) {
	$gameMessage.hideChoice(choiceIndex, shouldHide);
};

//#endregion
//#region src/plugins/message/core/objects/Game_Event.js
/**
* A filter function for only including comment event commands relevant to choice conditionals.
* @param {RPG_EventListCommand} command The command being evaluated.
* @returns {boolean}
*/
Game_Event.filterCommentCommandsForBasicConditionals = function(command) {
	const [comment] = command.parameters;
	if (!comment) return false;
	const { LeaderChoiceConditional, NotLeaderChoiceConditional, SwitchOnChoiceConditional, SwitchOffChoiceConditional } = J.MESSAGE.RegExp;
	return [
		LeaderChoiceConditional,
		NotLeaderChoiceConditional,
		SwitchOnChoiceConditional,
		SwitchOffChoiceConditional
	].some((regex) => regex.test(comment));
};
/**
* Converts a known comment event command into a conditional for basic control.
* @param {RPG_EventListCommand} commentCommand The comment command to parse into a conditional.
* @returns {BasicChoiceConditional}
*/
Game_Event.toBasicConditional = function(commentCommand) {
	const [comment] = commentCommand.parameters;
	let result = null;
	let type = String.empty;
	switch (true) {
		case J.MESSAGE.RegExp.LeaderChoiceConditional.test(comment):
			result = J.MESSAGE.RegExp.LeaderChoiceConditional.exec(comment);
			type = BasicChoiceConditional.Types.Leader;
			break;
		case J.MESSAGE.RegExp.NotLeaderChoiceConditional.test(comment):
			result = J.MESSAGE.RegExp.NotLeaderChoiceConditional.exec(comment);
			type = BasicChoiceConditional.Types.NotLeader;
			break;
		case J.MESSAGE.RegExp.SwitchOnChoiceConditional.test(comment):
			result = J.MESSAGE.RegExp.SwitchOnChoiceConditional.exec(comment);
			type = BasicChoiceConditional.Types.SwitchOn;
			break;
		case J.MESSAGE.RegExp.SwitchOffChoiceConditional.test(comment):
			result = J.MESSAGE.RegExp.SwitchOffChoiceConditional.exec(comment);
			type = BasicChoiceConditional.Types.SwitchOff;
			break;
	}
	const [, val] = result;
	const parsedVal = JsonMapper.parseObject(val);
	return new BasicChoiceConditional(type, parsedVal);
};

//#endregion
//#region src/plugins/message/core/windows/Window_Base.js
/**
* Extends {@link #convertEscapeCharacters}.<br/>
* Adds handling for new text codes for various database objects.
*/
J.MESSAGE.Aliased.Window_Base.set("convertEscapeCharacters", Window_Base.prototype.convertEscapeCharacters);
Window_Base.prototype.convertEscapeCharacters = function(text) {
	let textToModify = text;
	textToModify = this.translateQuestTextCode(textToModify);
	textToModify = this.translateWeaponTextCode(textToModify);
	textToModify = this.translateArmorTextCode(textToModify);
	textToModify = this.translateItemTextCode(textToModify);
	textToModify = this.translateStateTextCode(textToModify);
	textToModify = this.translateSkillTextCode(textToModify);
	textToModify = this.translateEnemyTextCode(textToModify);
	textToModify = this.translateElementTextCode(textToModify);
	textToModify = this.translateEquipTypeTextCode(textToModify);
	textToModify = this.translateWeaponTypeTextCode(textToModify);
	textToModify = this.translateArmorTypeTextCode(textToModify);
	textToModify = this.translateSkillTypeTextCode(textToModify);
	textToModify = this.translateSdpTextCode(textToModify);
	textToModify = this.translateParamTextCode(textToModify);
	return J.MESSAGE.Aliased.Window_Base.get("convertEscapeCharacters").call(this, textToModify);
};
/**
* Translates the text code into the name and icon of the weapon.
* @param {string} text The text that has a text code in it.
* @returns {string}
*/
Window_Base.prototype.translateWeaponTextCode = function(text) {
	return text.replace(/\\weapon\[(\d+)]/gi, (_, p1) => {
		const weaponColor = 4;
		const weapon = $dataWeapons[parseInt(p1)];
		return `\\I[${weapon.iconIndex}]\\C[${weaponColor}]${weapon.name}\\C[0]`;
	});
};
/**
* Translates the text code into the name and icon of the armor.
* @param {string} text The text that has a text code in it.
* @returns {string} The new text to parse.
*/
Window_Base.prototype.translateArmorTextCode = function(text) {
	return text.replace(/\\armor\[(\d+)]/gi, (_, p1) => {
		const armorColor = 5;
		const armor = $dataArmors[parseInt(p1)];
		return `\\I[${armor.iconIndex}]\\C[${armorColor}]${armor.name}\\C[0]`;
	});
};
/**
* Translates the text code into the name and icon of the item.
* @param {string} text The text that has a text code in it.
* @returns {string} The new text to parse.
*/
Window_Base.prototype.translateItemTextCode = function(text) {
	return text.replace(/\\item\[(\d+)]/gi, (_, p1) => {
		const itemColor = 3;
		const item = $dataItems[parseInt(p1)];
		return `\\I[${item.iconIndex}]\\C[${itemColor}]${item.name}\\C[0]`;
	});
};
/**
* Translates the text code into the name and icon of the state.
* @param {string} text The text that has a text code in it.
* @returns {string} The new text to parse.
*/
Window_Base.prototype.translateStateTextCode = function(text) {
	return text.replace(/\\state\[(\d+)]/gi, (_, p1) => {
		const stateColor = 6;
		const stateId = parseInt(p1);
		let name = "(Basic Attack)";
		let iconIndex = 0;
		if (stateId > 0) {
			const state = $dataStates[parseInt(p1)];
			name = state.name;
			iconIndex = state.iconIndex;
		}
		return `\\I[${iconIndex}]\\C[${stateColor}]${name}\\C[0]`;
	});
};
/**
* Translates the text code into the name and icon of the skill.
* @param {string} text The text that has a text code in it.
* @returns {string} The new text to parse.
*/
Window_Base.prototype.translateSkillTextCode = function(text) {
	return text.replace(/\\skill\[(\d+)]/gi, (_, p1) => {
		const skillColor = 1;
		const skill = $dataSkills[parseInt(p1)];
		return `\\I[${skill.iconIndex}]\\C[${skillColor}]${skill.name}\\C[0]`;
	});
};
/**
* Translates the text code into the name of the enemy.
* NOTE: No icon is assigned for enemies.
* @param {string} text The text that has a text code in it.
* @returns {string} The new text to parse.
*/
Window_Base.prototype.translateEnemyTextCode = function(text) {
	return text.replace(/\\enemy\[(\d+)]/gi, (_, p1) => {
		const enemyColor = 2;
		const enemy = $dataEnemies[parseInt(p1)];
		return `\\C[${enemyColor}]${enemy.name}\\C[0]`;
	});
};
/**
* Translates the text code into the name and icon of the element.
* @param {string} text The text that has a text code in it.
* @returns {string} The new text to parse.
*/
Window_Base.prototype.translateElementTextCode = function(text) {
	return text.replace(/\\element\[(\d+)]/gi, (_, p1) => {
		const elementId = parseInt(p1) ?? -1;
		const iconIndex = IconManager.element(elementId);
		const colorId = ColorManager.elementColorIndex(elementId);
		const name = TextManager.element(elementId);
		return `\\I[${iconIndex}]\\C[${colorId}]${name}\\C[0]`;
	});
};
/**
* Translates the text code into the name and icon of the skill type.
* @param {string} text The text that has a text code in it.
* @returns {string} The new text to parse.
*/
Window_Base.prototype.translateSkillTypeTextCode = function(text) {
	return text.replace(/\\skillType\[(\d+)]/gi, (_, p1) => {
		const skillTypeId = parseInt(p1) ?? -1;
		const iconIndex = IconManager.skillType(skillTypeId);
		const colorId = ColorManager.skillType(skillTypeId);
		const name = TextManager.skillType(skillTypeId);
		return `\\I[${iconIndex}]\\C[${colorId}]${name}\\C[0]`;
	});
};
/**
* Translates the text code into the name and icon of the weapon type.
* @param {string} text The text that has a text code in it.
* @returns {string} The new text to parse.
*/
Window_Base.prototype.translateWeaponTypeTextCode = function(text) {
	return text.replace(/\\weaponType\[(\d+)]/gi, (_, p1) => {
		const weaponTypeId = parseInt(p1) ?? -1;
		const iconIndex = IconManager.weaponType(weaponTypeId);
		const colorId = ColorManager.weaponType(weaponTypeId);
		const name = TextManager.weaponType(weaponTypeId);
		return `\\I[${iconIndex}]\\C[${colorId}]${name}\\C[0]`;
	});
};
/**
* Translates the text code into the name and icon of the armor type.
* @param {string} text The text that has a text code in it.
* @returns {string} The new text to parse.
*/
Window_Base.prototype.translateArmorTypeTextCode = function(text) {
	return text.replace(/\\armorType\[(\d+)]/gi, (_, p1) => {
		const armorTypeId = parseInt(p1) ?? -1;
		const iconIndex = IconManager.armorType(armorTypeId);
		const colorId = ColorManager.armorType(armorTypeId);
		const name = TextManager.armorType(armorTypeId);
		return `\\I[${iconIndex}]\\C[${colorId}]${name}\\C[0]`;
	});
};
/**
* Translates the text code into the name and icon of the equip type.
* @param {string} text The text that has a text code in it.
* @returns {string} The new text to parse.
*/
Window_Base.prototype.translateEquipTypeTextCode = function(text) {
	return text.replace(/\\equipType\[(\d+)]/gi, (_, p1) => {
		const equipTypeId = parseInt(p1) ?? -1;
		const iconIndex = IconManager.equipType(equipTypeId);
		const colorId = ColorManager.equipType(equipTypeId);
		const name = TextManager.equipType(equipTypeId);
		return `\\I[${iconIndex}]\\C[${colorId}]${name}\\C[0]`;
	});
};
/**
* Translates the text code into the name and icon of the corresponding SDP.
* @param {string} text The text that has a text code in it.
* @returns {string} The new text to parse.
*/
Window_Base.prototype.translateSdpTextCode = function(text) {
	if (!J.SDP) return text;
	return text.replace(/\\sdp\[(.*)]/gi, (_, p1) => {
		const sdpKey = p1 ?? String.empty;
		if (!sdpKey) return text;
		const sdp = J.SDP.Metadata.panelsMap.get(sdpKey);
		if (!sdp) return text;
		const { name, rarity: colorIndex, iconIndex } = sdp;
		return `\\I[${iconIndex}]\\C[${colorIndex}]${name}\\C[0]`;
	});
};
/**
* Translates the text code into the name and icon of the corresponding catalog parameter.<br/>
* Unlike the other lookups in this file, an unresolvable key is never silently swallowed- an
* unregistered STRING_KEY is always an authoring mistake (a typo, or a plugin whose registration
* didn't load), so it renders as an unmistakable red "!!! UNKNOWN PARAM !!!" with a question-mark
* icon instead of passing through untouched or vanishing quietly.
* @param {string} text The text that has a text code in it.
* @returns {string} The new text to parse.
*/
Window_Base.prototype.translateParamTextCode = function(text) {
	return text.replace(/\\param\[([\w-]+)]/gi, (_, p1) => {
		const parameterKey = p1 ?? String.empty;
		if (!TextManager.hasParameter(parameterKey)) {
			const unknownIconIndex = 93;
			const unknownColorIndex = 18;
			return `\\I[${unknownIconIndex}]\\C[${unknownColorIndex}]!!! UNKNOWN PARAM !!!\\C[0]`;
		}
		const name = TextManager.parameterLabel(parameterKey);
		const iconIndex = IconManager.parameterIcon(parameterKey);
		const colorIndex = ColorManager.parameterColor(parameterKey);
		return `\\I[${iconIndex}]\\C[${colorIndex}]${name}\\C[0]`;
	});
};
/**
* Translates the quest text code into the quest's name and icon.
*
* Core does not know what a quest is- this is a no-op hook that J-Omnipedia's quest extension
* overrides to supply the real behavior. Core never probes for extensions.
* @param {string} text The text that may contain a quest text code.
* @returns {string} The text, unchanged.
*/
Window_Base.prototype.translateQuestTextCode = function(text) {
	return text;
};

//#endregion
//#region src/plugins/message/core/windows/Window_ChoiceList.js
/**
* Extends {@link makeCommandList}.<br/>
* Post-modifies the commands to remove "hidden" choices.
*/
J.MESSAGE.Aliased.Window_ChoiceList.set("makeCommandList", Window_ChoiceList.prototype.makeCommandList);
Window_ChoiceList.prototype.makeCommandList = function() {
	$gameMessage.restoreChoices();
	this.clearChoiceMap();
	J.MESSAGE.Aliased.Window_ChoiceList.get("makeCommandList").call(this);
	let needsUpdate = false;
	for (let i = this.commandList().length; i > -1; i--) {
		if ($gameMessage.isChoiceHidden(i)) {
			this.commandList().splice(i, 1);
			$gameMessage._choices.splice(i, 1);
			needsUpdate = true;
		} else {
			this.choiceMap().unshift(i);
		}
	}
	if (needsUpdate === true) {
		this.updatePlacement();
	}
};
Window_ChoiceList.prototype.clearChoiceMap = function() {
	this.setChoiceMap([]);
};
/**
* Overwrites {@link callOkHandler}.<br/>
* Uses the index of our custom list instead of the original list.
*/
Window_ChoiceList.prototype.callOkHandler = function() {
	$gameMessage.onChoice(this.choiceMap()[this.index()]);
	this.messageWindow().terminateMessage();
	this.close();
};
/**
* Gets the choice map.
* @returns {number[]} The choiceMap.
*/
Window_ChoiceList.prototype.choiceMap = function() {
	return this._choiceMap;
};
/**
* Sets the choice map.
* @param {number[]} newChoiceMap The new choiceMap.
*/
Window_ChoiceList.prototype.setChoiceMap = function(newChoiceMap) {
	this._choiceMap = newChoiceMap;
};

//#endregion
//#region src/plugins/message/core/services/MessageEffectSet.js
/**
* Decides which effects are acting on the text at any point in a message.
*
* Two sources feed in and they are deliberately kept apart. A speaker's **baseline** comes from
* their profile and describes how that character always sounds on the page - a ghost whose words
* never sit still, a drunk whose letters wander. A **span** comes from a text code the author typed
* and describes an emphasis in this particular line. Baseline is who is talking; span is what they
* are doing right now.
*
* Holding them in one set and toggling within it looks simpler and is wrong in a way that only
* shows up in the writing. `\~` is a toggle, so an author reaching for a wave inside a line already
* waving would *switch the character's own voice off* for that span - the exact opposite of the
* emphasis they were adding. Keeping the two apart makes a baseline effect immune to its own toggle
* by construction rather than by a special case somebody has to remember, and the whole rule
* becomes "the union of who you are and what you are doing".
*
* Spans are also the half that resets. An author who opens `\~` and never closes it has ended that
* emphasis at the page break whether they said so or not; the speaker's baseline, being a property
* of the speaker, survives it.
*/
var MessageEffectSet = class {
	/**
	* The effects acting on text right now.
	*
	* Baseline first, then spans, so a reader of the resulting list sees identity before emphasis.
	* Duplicates are collapsed: an author emphasising something already in the baseline has said
	* nothing new, and an effect applied twice would displace the glyph twice as far.
	* @param {string[]} baselineEffects The speaker's own effects, from their profile.
	* @param {Set<string>} spanEffects The effects the author has opened and not yet closed.
	* @returns {string[]}
	*/
	static resolve(baselineEffects, spanEffects) {
		const resolved = [...baselineEffects];
		spanEffects.forEach((name) => {
			if (resolved.includes(name)) return;
			resolved.push(name);
		});
		return resolved;
	}
	/**
	* Flips one span effect on or off, the way the text code that names it does.
	* @param {Set<string>} spanEffects The effects the author has opened and not yet closed.
	* @param {string} name The effect the author just toggled.
	*/
	static toggle(spanEffects, name) {
		if (spanEffects.has(name) === true) {
			spanEffects.delete(name);
			return;
		}
		spanEffects.add(name);
	}
};

//#endregion
//#region src/plugins/message/core/__models/MessageGlyph.js
/**
* One character of a message, described completely enough to be drawn without the window.
*
* RMMZ draws message text straight into `contents`, which turns every glyph into pixels the instant
* it lands. That is fine for text that never moves and useless for text that does- once the letter
* is in the bitmap there is no longer a "that letter" to wave, jitter or recolour. So the pipeline
* stops drawing and starts emitting these instead, and a sprite layer turns them into things that
* can still be addressed a hundred frames later.
*
* Everything the renderer needs is captured here at emit time rather than read back from the window
* later, because the window's font state has moved on by then: a single line routinely changes size,
* colour and weight several times, and a glyph asked "what colour am I" after the fact would answer
* with whatever the last text code set.
*/
var MessageGlyph = class MessageGlyph {
	/**
	* The character this glyph draws, or empty when this glyph is an icon.
	* @type {string}
	*/
	character = String.empty;
	/**
	* The icon this glyph draws, or -1 when this glyph is a character.
	*
	* Icons are glyphs here rather than a second kind of thing, and they have to be. J-Message's
	* database text codes all expand to `\I[n]` followed by a coloured name, so an icon is almost
	* never alone in a line - and an icon that stayed baked into the window's contents while the
	* letters beside it became sprites would sit perfectly still inside a word that waves.
	* @type {number}
	*/
	iconIndex = -1;
	/**
	* The horizontal position within the window's contents, in logical pixels.
	* @type {number}
	*/
	x = 0;
	/**
	* The vertical position within the window's contents, in logical pixels.
	* @type {number}
	*/
	y = 0;
	/**
	* The advance this glyph contributes to the cursor, in logical pixels.
	*
	* Derived from the difference between two prefix measurements rather than from measuring the
	* character alone, so kerning against its neighbour is already accounted for.
	* @type {number}
	*/
	width = 0;
	/**
	* The height of the line this glyph sits on.
	*
	* Carried because the engine derives the text baseline from it- {@link Bitmap.drawText} places
	* text at `y + lineHeight / 2 + fontSize * 0.35`, so a glyph handed the same line height its run
	* was measured with reproduces the baseline it would have had.
	* @type {number}
	*/
	lineHeight = 0;
	/**
	* The font family this glyph renders in.
	* @type {string}
	*/
	fontFace = String.empty;
	/**
	* The font size this glyph renders at.
	* @type {number}
	*/
	fontSize = 0;
	/**
	* Whether this glyph renders bold.
	* @type {boolean}
	*/
	bold = false;
	/**
	* Whether this glyph renders italic.
	* @type {boolean}
	*/
	italic = false;
	/**
	* The colour this glyph renders in, as the CSS string the engine deals in.
	*
	* Not baked into the raster. The glyph is drawn white and tinted to this, which is what allows an
	* effect to recolour it per frame- tinting an already-red glyph toward orange multiplies the two
	* and arrives at neither. It also keeps colour out of the texture cache key, so one raster serves
	* every colour the same character is ever drawn in.
	* @type {string}
	*/
	textColor = String.empty;
	/**
	* The colour of the outline stroked around this glyph.
	*
	* This one *is* baked in, because it does not animate and because the engine's default is black-
	* and black survives an arbitrary tint, being unchanged by multiplication. A coloured outline
	* would not, which is worth knowing before anyone sets one.
	* @type {string}
	*/
	outlineColor = String.empty;
	/**
	* The width of the outline stroked around this glyph.
	* @type {number}
	*/
	outlineWidth = 0;
	/**
	* The effects active on this glyph, by registered name.
	*
	* Already resolved at emit time: the speaker's baseline unioned with whatever spans the author
	* left open. The glyph does not know what any of them mean.
	* @type {string[]}
	*/
	effects = [];
	/**
	* This glyph's position in the message, counted across runs and lines.
	*
	* What gives a wave its phase. Counting per-run would restart the wave at every colour change,
	* and counting per-line would restart it at every wrap, so the counter belongs to the message.
	* @type {number}
	*/
	index = 0;
	/**
	* Builds one glyph from what it draws and the style in force when it was emitted.
	* @param {string} character The character this glyph draws, or empty for an icon.
	* @param {number} iconIndex The icon this glyph draws, or -1 for a character.
	* @param {number} x The horizontal position within the window's contents.
	* @param {number} y The vertical position within the window's contents.
	* @param {number} width The advance this glyph contributes to the cursor.
	* @param {number} index This glyph's position in the message.
	* @param {MessageGlyphStyle} style The font, colour and effect state in force at emit time.
	*/
	constructor(character, iconIndex, x, y, width, index, style) {
		this.character = character;
		this.iconIndex = iconIndex;
		this.x = x;
		this.y = y;
		this.width = width;
		this.index = index;
		this.lineHeight = style.lineHeight;
		this.fontFace = style.fontFace;
		this.fontSize = style.fontSize;
		this.bold = style.bold;
		this.italic = style.italic;
		this.textColor = style.textColor;
		this.outlineColor = style.outlineColor;
		this.outlineWidth = style.outlineWidth;
		this.effects = style.effects;
	}
	/**
	* Builds a glyph that draws one character.
	* @param {string} character The character this glyph draws.
	* @param {number} x The horizontal position within the window's contents.
	* @param {number} y The vertical position within the window's contents.
	* @param {number} width The advance this glyph contributes to the cursor.
	* @param {number} index This glyph's position in the message.
	* @param {MessageGlyphStyle} style The font, colour and effect state in force at emit time.
	* @returns {MessageGlyph}
	*/
	static forCharacter(character, x, y, width, index, style) {
		return new MessageGlyph(character, -1, x, y, width, index, style);
	}
	/**
	* Builds a glyph that draws one icon.
	* @param {number} iconIndex The icon this glyph draws.
	* @param {number} x The horizontal position within the window's contents.
	* @param {number} y The vertical position within the window's contents.
	* @param {number} width The advance this glyph contributes to the cursor.
	* @param {number} index This glyph's position in the message.
	* @param {MessageGlyphStyle} style The font, colour and effect state in force at emit time.
	* @returns {MessageGlyph}
	*/
	static forIcon(iconIndex, x, y, width, index, style) {
		return new MessageGlyph(String.empty, iconIndex, x, y, width, index, style);
	}
	/**
	* Whether this glyph draws an icon rather than a character.
	* @returns {boolean}
	*/
	isIcon() {
		return this.iconIndex >= 0;
	}
	/**
	* The key identifying the raster this glyph can share with others.
	*
	* Colour is deliberately absent- the raster is white and tinted afterward, so two glyphs differing
	* only in colour are the same texture. Outline is present because it is baked in.
	* @returns {string}
	*/
	rasterKey() {
		return [
			this.character,
			this.fontFace,
			this.fontSize,
			this.bold,
			this.italic,
			this.outlineColor,
			this.outlineWidth,
			this.lineHeight
		].join("|");
	}
};

//#endregion
//#region src/plugins/message/core/services/MessageGlyphRunSplitter.js
/**
* Turns one buffered run of message text into individually addressable glyphs.
*
* The engine buffers characters as it walks a message and only draws when it hits a control
* character, so what arrives here is a whole run in one piece- "the innkeeper says" rather than
* sixteen separate letters. Splitting it is what makes per-letter motion possible at all, and
* getting the arithmetic right is the difference between a pipeline nobody notices and one that
* quietly reflows every line of dialogue in the game.
*
* **Positions come from cumulative prefix measurement, never from summing character widths.**
* A canvas measures a string as it would actually render it, kerning included, so the width of
* "AV" is not the width of "A" plus the width of "V"- the pair is tucked together and the real
* answer is smaller. Sum the parts and every word in the game grows by a fraction of a pixel per
* letter, which is invisible on any single word and obvious across a paragraph. Measuring the
* prefix instead asks the same question the engine asks, so glyph three sits exactly where the
* engine would have drawn it, and the run's total advance is unchanged.
*
* The measuring function is a parameter rather than a reach for `Bitmap.measureTextWidth` because
* this is the one rule in the pipeline that cannot be confirmed by reading: an implementation that
* sums and an implementation that measures prefixes agree on every one- and two-character run, and
* only diverge from the third character of a kerned pair onward. Injecting the measurement is what
* lets a test supply a font where kerning demonstrably exists.
*/
var MessageGlyphRunSplitter = class {
	/**
	* Splits a run of text into one glyph per character.
	* @param {string} run The buffered run, exactly as the engine accumulated it.
	* @param {{x: number, y: number, index: number}} origin Where the run begins, and the message's
	* running glyph count at that point.
	* @param {MessageGlyphStyle} style The font, colour and effect state in force for this run.
	* @param {function(string): number} measure Measures a string's rendered width in logical pixels.
	* @returns {MessageGlyph[]} One glyph per character, in reading order.
	*/
	static split(run, origin, style, measure) {
		const characters = [...run];
		const glyphs = [];
		let prefix = String.empty;
		let prefixWidth = 0;
		characters.forEach((character, offset) => {
			const grownPrefix = prefix + character;
			const grownWidth = measure(grownPrefix);
			const advance = grownWidth - prefixWidth;
			const glyph = MessageGlyph.forCharacter(character, origin.x + prefixWidth, origin.y, advance, origin.index + offset, style);
			glyphs.push(glyph);
			prefix = grownPrefix;
			prefixWidth = grownWidth;
		});
		return glyphs;
	}
};

//#endregion
//#region src/plugins/message/core/__models/MessageGlyphStyle.js
/**
* The font, colour and effect state in force at the moment a run of text was flushed.
*
* A snapshot rather than a reference, and that distinction is the whole point of the class. The
* window's `contents` carries exactly one font state at a time, and a single line of dialogue
* routinely changes it several times- `\C[2]` here, `\*` there, `\FS[18]` for an aside. A glyph
* that asked the window what colour it was after the fact would be told whatever the *last* code
* set, so the state is copied out while it is still true and travels with the glyphs it describes.
*
* It is built once per flush, not once per glyph: a run only ever ends at a control character, and
* every code that could change any of this is a control character, so every glyph within one run
* necessarily shares one style. That is what makes emitting per-glyph cheap.
*/
var MessageGlyphStyle = class MessageGlyphStyle {
	/**
	* The height of the line these glyphs sit on.
	* @type {number}
	*/
	lineHeight = 0;
	/**
	* The font family in force.
	* @type {string}
	*/
	fontFace = String.empty;
	/**
	* The font size in force.
	* @type {number}
	*/
	fontSize = 0;
	/**
	* Whether bold is in force.
	* @type {boolean}
	*/
	bold = false;
	/**
	* Whether italics are in force.
	* @type {boolean}
	*/
	italic = false;
	/**
	* The text colour in force, as the CSS string the engine deals in.
	* @type {string}
	*/
	textColor = String.empty;
	/**
	* The outline colour in force.
	* @type {string}
	*/
	outlineColor = String.empty;
	/**
	* The outline width in force.
	* @type {number}
	*/
	outlineWidth = 0;
	/**
	* The effects active on these glyphs, by registered name.
	* @type {string[]}
	*/
	effects = [];
	/**
	* Builds a style snapshot.
	* @param {number} lineHeight The height of the line these glyphs sit on.
	* @param {string} fontFace The font family in force.
	* @param {number} fontSize The font size in force.
	* @param {boolean} bold Whether bold is in force.
	* @param {boolean} italic Whether italics are in force.
	* @param {string} textColor The text colour in force.
	* @param {string} outlineColor The outline colour in force.
	* @param {number} outlineWidth The outline width in force.
	* @param {string[]} effects The effects active on these glyphs.
	*/
	constructor(lineHeight, fontFace, fontSize, bold, italic, textColor, outlineColor, outlineWidth, effects) {
		this.lineHeight = lineHeight;
		this.fontFace = fontFace;
		this.fontSize = fontSize;
		this.bold = bold;
		this.italic = italic;
		this.textColor = textColor;
		this.outlineColor = outlineColor;
		this.outlineWidth = outlineWidth;
		this.effects = effects;
	}
	/**
	* Snapshots the live font state off a window's contents bitmap.
	*
	* The one place that reads `contents` directly, so that nothing downstream has to. Effects and
	* line height do not live on the bitmap- they belong to the message and the line respectively-
	* and are handed in.
	* @param {Bitmap} contents The bitmap the window draws its text into.
	* @param {number} lineHeight The height of the line being flushed.
	* @param {string[]} effects The effects active on this run.
	* @returns {MessageGlyphStyle}
	*/
	static fromContents(contents, lineHeight, effects) {
		return new MessageGlyphStyle(lineHeight, contents.fontFace, contents.fontSize, contents.fontBold, contents.fontItalic, contents.textColor, contents.outlineColor, contents.outlineWidth, effects);
	}
};

//#endregion
//#region src/plugins/message/core/services/MessagePacing.js
/**
* How long a speaker lingers on each character they say.
*
* The engine reveals message text at exactly one character per frame and has no opinion about
* which character it is, so a full stop costs the same as the letter before it and a sentence
* arrives as an even scroll. Reading aloud does not work like that, and neither does characterisation
* - most of what separates a weary old merchant from an excitable one is where and how long they
* stop.
*
* Everything here is measured in **extra** frames rather than total ones, because that is what the
* consumer can safely apply. The engine's per-character wait is a shared counter that an author's
* own `\.` and `\|` also write to, and it is assigned rather than accumulated - so pacing that set
* a total would silently eat a deliberate pause written beside it. Adding a difference composes
* with the author instead of overruling them.
*/
var MessagePacing = class MessagePacing {
	/**
	* The engine's own pace, in frames per character.
	*
	* One, and the number matters: a profile asking for one frame per character is asking for no
	* change at all, which is what an unprofiled speaker must get.
	* @type {number}
	*/
	static EnginePace = 1;
	/**
	* How many extra frames to spend on one character, beyond what the engine already spends.
	* @param {string} character The character about to be revealed.
	* @param {MessageSpeakerProfile} profile The profile of whoever is speaking.
	* @returns {number} Frames to add to the pending wait; zero leaves the engine's pace alone.
	*/
	static extraFramesFor(character, profile) {
		const paceFrames = profile.framesPerCharacter - MessagePacing.EnginePace;
		const punctuationFrames = profile.punctuationFrames[character] ?? 0;
		const extraFrames = paceFrames + punctuationFrames;
		if (extraFrames < 0) return 0;
		return extraFrames;
	}
};

//#endregion
//#region src/plugins/message/core/services/MessageNoise.js
/**
* Randomness that is not random, for the two places a message needs something to look unpredictable.
*
* A trembling letter and a wobbling voice both want to seem unplanned, and both have to be perfectly
* reproducible: the renderer may ask for the same glyph on the same frame more than once, and
* anything reaching for `Math.random` would shimmer rather than tremble and would be untestable
* besides. Same seed, same answer, every time and forever.
*
* The mixing step below is the part that is easy to leave out and impossible to spot afterward.
* Callers pick a bucket with a remainder, which reads the *low* bits of the hash and nothing else,
* while two adjacent seeds differ almost entirely in the high bits. Without an avalanche, "random"
* values for neighbouring glyphs come out nearly equal - a line that trembles in unison, or a voice
* that drifts smoothly instead of wobbling.
*/
var MessageNoise = class MessageNoise {
	/**
	* The multiplier in the avalanche step, taken from a standard integer finalizer.
	* @type {number}
	*/
	static Mixer = 2246822507;
	/**
	* How many buckets a hash is reduced to before being scaled.
	*
	* A thousand is finer than any consumer here can resolve, and keeps the arithmetic in integers
	* until the last possible step.
	* @type {number}
	*/
	static Buckets = 1e3;
	/**
	* Scrambles an integer so that its low bits no longer reflect the structure of its inputs.
	* @param {number} value The raw hash.
	* @returns {number} The scrambled hash, as an unsigned integer.
	*/
	static avalanche(value) {
		let mixed = value ^ value >>> 15;
		mixed = Math.imul(mixed, MessageNoise.Mixer);
		mixed ^= mixed >>> 13;
		return mixed >>> 0;
	}
	/**
	* A reproducible value from a seed, spread evenly across the full swing either side of zero.
	* @param {number} seed The seed to derive from.
	* @returns {number} A value from -1 up to just under 1.
	*/
	static signedUnit(seed) {
		const hashed = MessageNoise.avalanche(seed);
		const unitPosition = hashed % MessageNoise.Buckets / MessageNoise.Buckets;
		return unitPosition * 2 - 1;
	}
};

//#endregion
//#region src/plugins/message/core/services/MessageVoiceSelector.js
/**
* Decides when a speaker's voice sounds as their words appear.
*
* The effect being aimed at is the one Animal Crossing built an entire cast out of: a single short
* blip, repeated as the text arrives, pitched and spaced per character. It is a remarkably cheap
* way to make somebody recognisable before they have said anything in particular, and it costs the
* writing nothing.
*
* Most of the work is deciding when *not* to play. A sound on every glyph is a buzz rather than a
* voice; a sound on a space is a voice that talks through the gaps; and a sound on the full stop
* lands on top of the pause the pacing just inserted, which is the one moment the line is supposed
* to be quiet. What remains after those three exclusions reads as speech.
*/
var MessageVoiceSelector = class MessageVoiceSelector {
	/**
	* Characters that pass silently, however loud the speaker is.
	*
	* Whitespace because a gap is not a sound, and terminal punctuation because the pacing has just
	* put a beat there on purpose - a blip would be the only thing audible during the pause it is
	* meant to create.
	* @type {string}
	*/
	static VoicelessCharacters = " \n	.,!?;:…";
	/**
	* The stride at or below which every eligible character is voiced.
	*
	* One means "every character", and so does zero - a config asking for a blip more often than
	* once per character is asking for the most often there is, rather than for a division nobody
	* can hear the result of.
	* @type {number}
	*/
	static ContinuousStride = 1;
	/**
	* A large odd multiplier spreading consecutive glyph indices across the hash space.
	* @type {number}
	*/
	static PitchSalt = 40503;
	/**
	* The lowest pitch the engine's audio accepts.
	* @type {number}
	*/
	static MinimumPitch = 50;
	/**
	* The highest pitch the engine's audio accepts.
	* @type {number}
	*/
	static MaximumPitch = 150;
	/**
	* The sound this speaker makes as the given character appears, if any.
	* @param {number} glyphIndex The character's position in the message.
	* @param {string} character The character about to be revealed.
	* @param {MessageSpeakerProfile} profile The profile of whoever is speaking.
	* @returns {?{name: string, volume: number, pitch: number, pan: number}} The sound to play, or
	* null when this character passes silently.
	*/
	static selectFor(glyphIndex, character, profile) {
		if (profile.hasVoice() === false) return null;
		if (MessageVoiceSelector.isVoiceless(character) === true) return null;
		if (MessageVoiceSelector.isSkippedByStride(glyphIndex, profile.voiceStride) === true) return null;
		const pitch = MessageVoiceSelector.pitchFor(glyphIndex, profile);
		return profile.voiceSe(pitch);
	}
	/**
	* The pitch this particular blip sounds at.
	*
	* Wandering rather than fixed, because one sound repeated at one pitch is a metronome however
	* carefully that pitch was chosen. A few points either side of centre, differently for each blip,
	* is the whole difference between a tone and somebody speaking - and it has to be reproducible,
	* so it comes from a hash of the glyph's position rather than from chance.
	* @param {number} glyphIndex The character's position in the message.
	* @param {MessageSpeakerProfile} profile The profile of whoever is speaking.
	* @returns {number}
	*/
	static pitchFor(glyphIndex, profile) {
		const swing = MessageNoise.signedUnit((glyphIndex + 1) * MessageVoiceSelector.PitchSalt);
		const wandered = profile.voicePitch + Math.round(profile.voicePitchVariance * swing);
		const notTooLow = Math.max(wandered, MessageVoiceSelector.MinimumPitch);
		return Math.min(notTooLow, MessageVoiceSelector.MaximumPitch);
	}
	/**
	* Whether a character passes silently regardless of who is speaking.
	* @param {string} character The character about to be revealed.
	* @returns {boolean}
	*/
	static isVoiceless(character) {
		return MessageVoiceSelector.VoicelessCharacters.includes(character);
	}
	/**
	* Whether this character falls between blips rather than on one.
	* @param {number} glyphIndex The character's position in the message.
	* @param {number} stride How many characters pass between one blip and the next.
	* @returns {boolean}
	*/
	static isSkippedByStride(glyphIndex, stride) {
		if (stride <= MessageVoiceSelector.ContinuousStride) return false;
		return glyphIndex % stride !== 0;
	}
};

//#endregion
//#region src/plugins/message/core/__models/MessageGlyphModulation.js
/**
* What one frame's worth of effects does to a single glyph.
*
* The deliberate shape here is that a modulation is a *difference*, never a position. A glyph
* already knows where it belongs - the splitter measured that once and it does not change - so an
* effect that returned coordinates would have to be told the layout in order to perturb it, and two
* effects on the same glyph could not both be right. Offsets compose; positions do not.
*
* Tint is the exception and is deliberately nullable, which is the one place this class admits a
* null at all. A glyph has a colour of its own from `\C[n]`, and most effects have no opinion about
* it; "no opinion" has to be distinguishable from "black", and zero is a real colour.
*/
var MessageGlyphModulation = class MessageGlyphModulation {
	/**
	* How far to displace the glyph horizontally this frame, in logical pixels.
	* @type {number}
	*/
	offsetX = 0;
	/**
	* How far to displace the glyph vertically this frame, in logical pixels.
	* @type {number}
	*/
	offsetY = 0;
	/**
	* The colour to override the glyph's own with this frame, or null to leave it alone.
	* @type {number|null}
	*/
	tint = null;
	/**
	* How much larger or smaller than its drawn size the glyph appears this frame.
	*
	* A multiplier rather than a size, for the same reason the offsets are differences: two effects
	* that both have an opinion about size can be combined, where two absolute sizes could only
	* argue. One is "exactly as drawn", which is what a glyph nothing is acting on gets.
	* @type {number}
	*/
	scale = 1;
	/**
	* Builds one frame's modulation.
	* @param {number} offsetX How far to displace the glyph horizontally.
	* @param {number} offsetY How far to displace the glyph vertically.
	* @param {?number} tint The colour to override with, or null to leave the glyph's own alone.
	* @param {number} scale How much larger or smaller than drawn the glyph appears.
	*/
	constructor(offsetX = 0, offsetY = 0, tint = null, scale = 1) {
		this.offsetX = offsetX;
		this.offsetY = offsetY;
		this.tint = tint;
		this.scale = scale;
	}
	/**
	* The modulation that changes nothing.
	*
	* What a glyph carrying no effects at all receives, and the seed every composition starts from.
	* @returns {MessageGlyphModulation}
	*/
	static none() {
		return new MessageGlyphModulation(0, 0, null, 1);
	}
	/**
	* Combines several modulations into the one the renderer actually applies.
	*
	* Offsets sum, because two effects displacing the same glyph both mean it - a character that
	* waves *and* trembles should do both, and summing is the only combination where neither effect
	* silently wins. Tint does not sum: colours are not displacements, and averaging two of them
	* produces a third that neither effect asked for. The last opinion expressed takes it, which
	* makes the order effects were resolved in the tiebreaker.
	*
	* Scale multiplies rather than sums, because it is a ratio: two effects each swelling a glyph by
	* a tenth should arrive at a fifth larger, and summing multipliers would double the glyph before
	* either effect had done anything at all.
	* @param {MessageGlyphModulation[]} modulations The modulations to combine, in resolution order.
	* @returns {MessageGlyphModulation}
	*/
	static compose(modulations) {
		const combined = MessageGlyphModulation.none();
		modulations.forEach((modulation) => {
			combined.offsetX += modulation.offsetX;
			combined.offsetY += modulation.offsetY;
			combined.scale *= modulation.scale;
			if (modulation.tint !== null) {
				combined.tint = modulation.tint;
			}
		});
		return combined;
	}
};

//#endregion
//#region src/plugins/message/core/services/MessageTintResolver.js
/**
* Converts the colours the engine speaks into the numbers PIXI tints with.
*
* Two different vocabularies meet here. RMMZ describes a text colour as a CSS string, because that
* is what a canvas context wants - `ColorManager.textColor` reads its answer out of the windowskin
* with {@link Bitmap.getPixel}, which builds a `#rrggbb` string one hex byte at a time. A PIXI
* sprite's `tint`, meanwhile, is a single integer. Nothing in either library converts between them,
* so the conversion lives here rather than being retyped at every call site that needs it.
*
* The reason any of this is necessary is that glyphs are rasterized white and coloured by tint
* afterward. Baking the colour into the raster would be simpler and would make `\=` impossible:
* tint multiplies, so a glyph already painted red can be darkened but never turned orange.
*/
var MessageTintResolver = class MessageTintResolver {
	/**
	* Degrees in a full turn of hue.
	* @type {number}
	*/
	static HueTurn = 360;
	/**
	* Converts one of the engine's CSS colour strings into a PIXI tint.
	*
	* The string is always `#rrggbb`: every text colour in a message arrives from
	* `ColorManager.textColor`, which reads a windowskin pixel and formats it that way. No other
	* shape is reachable from the message pipeline, so no other shape is interpreted here - a colour
	* that somehow arrived as something else should surface as a visibly wrong glyph rather than be
	* quietly coerced into a plausible one.
	* @param {string} cssColor The colour as `#rrggbb`.
	* @returns {number} The same colour as the integer PIXI tints with.
	*/
	static fromCssColor(cssColor) {
		const hexDigits = cssColor.slice(1);
		return parseInt(hexDigits, 16);
	}
	/**
	* Converts a hue into a fully saturated PIXI tint.
	*
	* Hue rather than an index into the windowskin palette, because the palette is sixteen discrete
	* swatches chosen for legibility and stepping through them reads as flashing rather than
	* cycling. A continuous hue is what makes the motion look deliberate.
	* @param {number} hue The hue in degrees; values outside a single turn wrap.
	* @returns {number} The colour as the integer PIXI tints with.
	*/
	static fromHue(hue) {
		const turn = MessageTintResolver.HueTurn;
		const wrappedHue = (hue % turn + turn) % turn;
		const [red, green, blue] = MessageTintResolver.hueToChannels(wrappedHue);
		return MessageTintResolver.fromChannels(red, green, blue);
	}
	/**
	* Resolves a hue into its three colour channels, each from zero to one.
	*
	* This is the standard HSL conversion narrowed to the one case we use: full saturation at half
	* lightness, where the chroma is exactly one and the black offset exactly zero. Written out as a
	* sector table rather than derived, because the six cases each name a recognisable third of the
	* colour wheel and a reader can check any one of them against a colour picker.
	* @param {number} hue The hue in degrees, already wrapped into a single turn.
	* @returns {number[]} The red, green and blue channels, each from zero to one.
	*/
	static hueToChannels(hue) {
		const position = hue / 60;
		const sector = Math.floor(position);
		const progress = position - sector;
		const ramp = sector % 2 === 0 ? progress : 1 - progress;
		switch (sector) {
			case 0: return [
				1,
				ramp,
				0
			];
			case 1: return [
				ramp,
				1,
				0
			];
			case 2: return [
				0,
				1,
				ramp
			];
			case 3: return [
				0,
				ramp,
				1
			];
			case 4: return [
				ramp,
				0,
				1
			];
			default: return [
				1,
				0,
				ramp
			];
		}
	}
	/**
	* Packs three zero-to-one colour channels into a single tint.
	* @param {number} red The red channel, from zero to one.
	* @param {number} green The green channel, from zero to one.
	* @param {number} blue The blue channel, from zero to one.
	* @returns {number}
	*/
	static fromChannels(red, green, blue) {
		const redByte = Math.round(red * 255);
		const greenByte = Math.round(green * 255);
		const blueByte = Math.round(blue * 255);
		return (redByte << 16) + (greenByte << 8) + blueByte;
	}
};

//#endregion
//#region src/plugins/message/core/services/MessageEffectRegistry.js
/**
* Every motion a message glyph is capable of, by name, and the seam for adding more.
*
* The pipeline that emits glyphs deliberately knows nothing about what "wave" means - it tags a
* glyph with a set of names and moves on. All the meaning is here, behind a lookup, which is what
* lets a later plugin teach messages a new trick by registering a function instead of editing a
* switch statement inside a window. J-Message owns three; an extension that wants `\GLOW` never
* has to touch this file's body.
*
* An effect is a pure function of `(glyphIndex, frame)` returning a {@link MessageGlyphModulation}.
* Both arguments matter and neither is optional: `frame` is what makes it move at all, and
* `glyphIndex` is what keeps a word from moving as one rigid block - a wave whose every letter
* shared a phase would be a bobbing rectangle rather than a wave.
*
* **Effects must be deterministic.** Not a stylistic preference: the renderer may be asked for the
* same glyph on the same frame more than once, and anything reaching for `Math.random` would
* shimmer rather than tremble. Jitter below is random-*looking* and entirely reproducible, which is
* also the only reason it can be tested at all.
*/
var MessageEffectRegistry = class MessageEffectRegistry {
	/**
	* How far a waving glyph travels from its resting line, in logical pixels.
	* @type {number}
	*/
	static WaveAmplitude = 4;
	/**
	* How many frames one full wave cycle takes.
	*
	* Forty is a touch over half a second, which reads as a lazy swell rather than a vibration.
	* @type {number}
	*/
	static WavePeriod = 40;
	/**
	* How far the wave's phase advances per glyph, in radians.
	*
	* Small enough that neighbouring letters stay visibly connected, large enough that a short word
	* still shows a crest and a trough rather than rising as a unit.
	* @type {number}
	*/
	static WavePhasePerGlyph = .6;
	/**
	* How far a jittering glyph can be thrown from rest on either axis, in logical pixels.
	*
	* Deliberately small. The effect is meant to read as an unsteady hand, and anything past a couple
	* of pixels stops looking nervous and starts looking broken.
	* @type {number}
	*/
	static JitterRadius = 2;
	/**
	* How many frames a jittering glyph holds each position before picking the next.
	*
	* At every frame the motion is too fast to resolve and reads as a blur; holding for three gives
	* the eye something to catch, which is what makes it look like trembling.
	* @type {number}
	*/
	static JitterHold = 3;
	/**
	* How far the cycled hue advances per frame, in degrees.
	*
	* Four degrees is a full turn in ninety frames - a second and a half, slow enough to read the
	* word underneath while it happens.
	* @type {number}
	*/
	static RainbowDegreesPerFrame = 4;
	/**
	* How far the cycled hue advances per glyph, in degrees.
	*
	* Eighteen spreads a full turn across twenty characters, so a word of ordinary length shows a
	* gradient rather than flashing as one solid colour.
	* @type {number}
	*/
	static RainbowDegreesPerGlyph = 18;
	/**
	* How far a pulsing glyph swells past its drawn size, as a fraction.
	*
	* Deliberately small. A glyph is drawn at the size the line was measured with, and the cursor
	* does not move to accommodate a swell - so anything much larger than this starts overlapping the
	* letters on either side rather than reading as emphasis.
	* @type {number}
	*/
	static PulseAmplitude = .18;
	/**
	* How many frames one full swell and settle takes.
	*
	* Slower than the wave, because size reads as breathing where position reads as motion, and a
	* fast breath is a twitch.
	* @type {number}
	*/
	static PulsePeriod = 52;
	/**
	* How far the pulse's phase advances per glyph, in radians.
	*
	* Smaller than the wave's, so a pulsing word swells closer to as one thing - the effect is meant
	* to read as a single emphasised phrase rather than as a travelling ripple.
	* @type {number}
	*/
	static PulsePhasePerGlyph = .35;
	/**
	* A large odd multiplier used to smear the glyph index across the hash space.
	* @type {number}
	*/
	static JitterIndexSalt = 73856093;
	/**
	* A second large odd multiplier, coprime with the first, used for the time input.
	* @type {number}
	*/
	static JitterTimeSalt = 19349663;
	/**
	* The constant distinguishing the horizontal axis from the vertical within the hash.
	*
	* Two axes asking the same hash the same question would get the same answer, and a glyph whose
	* horizontal and vertical displacement were always equal would not tremble - it would slide back
	* and forth along a diagonal. Salting them apart is what makes the motion two-dimensional.
	* @type {number}
	*/
	static JitterHorizontalSalt = 2654435769;
	/**
	* The constant distinguishing the vertical axis from the horizontal within the hash.
	* @type {number}
	*/
	static JitterVerticalSalt = 2246822507;
	/**
	* Every registered effect, by the name a glyph carries.
	*
	* Each entry pairs what the effect *does* on a given frame with how far it is ever willing to go.
	* The second half exists because something eventually has to draw a container around moving text -
	* a bubble, a panel, a frame - and sizing that container from where the glyphs are resting clips
	* them the moment they move. Asking each effect for its own worst case is the only version of that
	* question which keeps working when somebody registers a fifth effect.
	* @type {Map<string, {modulate: function(number, number): MessageGlyphModulation, excursion: MessageGlyphModulation}>}
	*/
	static #effects = new Map([
		["wave", {
			modulate: MessageEffectRegistry.wave,
			excursion: new MessageGlyphModulation(0, MessageEffectRegistry.WaveAmplitude, null, 1)
		}],
		["jitter", {
			modulate: MessageEffectRegistry.jitter,
			excursion: new MessageGlyphModulation(MessageEffectRegistry.JitterRadius, MessageEffectRegistry.JitterRadius, null, 1)
		}],
		["rainbow", {
			modulate: MessageEffectRegistry.rainbow,
			excursion: MessageGlyphModulation.none()
		}],
		["pulse", {
			modulate: MessageEffectRegistry.pulse,
			excursion: new MessageGlyphModulation(0, 0, null, 1 + MessageEffectRegistry.PulseAmplitude)
		}]
	]);
	/**
	* Teaches the pipeline a new effect.
	*
	* The extension seam. A plugin loading after J-Message registers its name here and adds the text
	* code that toggles it; nothing in core needs to learn the name.
	*
	* The excursion is optional and defaults to "this effect never moves the glyph", which is both the
	* safe answer for a purely colour-based effect and the honest answer for an author who has not
	* thought about it. An effect that does move and does not say so will be drawn correctly and
	* *measured* as though it were still, so anything sizing a container around it will clip it.
	* @param {string} name The name a glyph will carry to request this effect.
	* @param {function(number, number): MessageGlyphModulation} effect The modulation function.
	* @param {MessageGlyphModulation} excursion The furthest this effect ever displaces or swells a
	* glyph, as absolute magnitudes rather than as a displacement to apply.
	*/
	static register(name, effect, excursion = MessageGlyphModulation.none()) {
		MessageEffectRegistry.#effects.set(name, {
			modulate: effect,
			excursion
		});
	}
	/**
	* Takes an effect back out of the registry.
	*
	* The counterpart to the seam above, and the only honest way to undo a registration: the map is
	* private, so an effect registered over the top of with a placeholder would still answer
	* {@link isRegistered} with true and would still be reached for on every glyph carrying its name.
	* @param {string} name The name to forget.
	*/
	static unregister(name) {
		MessageEffectRegistry.#effects.delete(name);
	}
	/**
	* Whether a name has an effect behind it.
	* @param {string} name The effect name.
	* @returns {boolean}
	*/
	static isRegistered(name) {
		return MessageEffectRegistry.#effects.has(name);
	}
	/**
	* Resolves everything acting on one glyph this frame into a single modulation.
	*
	* An unregistered name is skipped rather than throwing. The names come from notetag-adjacent text
	* codes and a speaker's config file, so an effect can legitimately be absent because the plugin
	* that provides it is not installed - the same reason a message may mention a plugin's icon and
	* still need to render.
	* @param {string[]} effectNames The effects the glyph carries.
	* @param {number} glyphIndex The glyph's position in the message.
	* @param {number} frame How many frames the message has been revealing.
	* @returns {MessageGlyphModulation}
	*/
	static modulate(effectNames, glyphIndex, frame) {
		const modulations = [];
		effectNames.forEach((name) => {
			const effect = MessageEffectRegistry.#effects.get(name);
			if (effect === undefined) return;
			modulations.push(effect.modulate(glyphIndex, frame));
		});
		return MessageGlyphModulation.compose(modulations);
	}
	/**
	* The furthest everything acting on one glyph can ever throw or swell it.
	*
	* Not a modulation to apply - nothing should ever hand the result of this to a sprite. It is the
	* envelope those modulations live inside, for whoever has to reserve room for them: the offsets
	* are magnitudes in both directions rather than a signed displacement, and the scale is the
	* largest the glyph ever gets rather than the size it is right now.
	*
	* Composed the same way a frame's modulations are, and for the same reasons - offsets sum because
	* a glyph that waves *and* trembles reaches the sum of the two, and scales multiply because they
	* are ratios. Tint is meaningless here and is left wherever composition puts it.
	* @param {string[]} effectNames The effects the glyph carries.
	* @returns {MessageGlyphModulation}
	*/
	static excursionOf(effectNames) {
		const excursions = [];
		effectNames.forEach((name) => {
			const effect = MessageEffectRegistry.#effects.get(name);
			if (effect === undefined) return;
			excursions.push(effect.excursion);
		});
		return MessageGlyphModulation.compose(excursions);
	}
	/**
	* Rides the glyph up and down on a sine, offset per glyph so the word rolls.
	* @param {number} glyphIndex The glyph's position in the message.
	* @param {number} frame How many frames the message has been revealing.
	* @returns {MessageGlyphModulation}
	*/
	static wave(glyphIndex, frame) {
		const cycles = frame / MessageEffectRegistry.WavePeriod;
		const phase = cycles * Math.PI * 2 + glyphIndex * MessageEffectRegistry.WavePhasePerGlyph;
		const offsetY = -MessageEffectRegistry.WaveAmplitude * Math.sin(phase);
		return new MessageGlyphModulation(0, offsetY, null);
	}
	/**
	* Throws the glyph a pixel or two off rest, holding each position briefly.
	* @param {number} glyphIndex The glyph's position in the message.
	* @param {number} frame How many frames the message has been revealing.
	* @returns {MessageGlyphModulation}
	*/
	static jitter(glyphIndex, frame) {
		const step = Math.floor(frame / MessageEffectRegistry.JitterHold);
		const horizontal = MessageEffectRegistry.jitterAxis(glyphIndex, step, MessageEffectRegistry.JitterHorizontalSalt);
		const vertical = MessageEffectRegistry.jitterAxis(glyphIndex, step, MessageEffectRegistry.JitterVerticalSalt);
		return new MessageGlyphModulation(horizontal, vertical, null);
	}
	/**
	* One axis of jitter: a reproducible pseudo-random displacement within the radius.
	*
	* Both inputs are offset by one before they are multiplied, because the very first glyph of a
	* message on its very first step would otherwise multiply two zeroes, hash to zero, and land at
	* the exact extreme of its travel - so every trembling line in the game would begin with its
	* first letter thrown hard to one corner, identically, forever.
	* @param {number} glyphIndex The glyph's position in the message.
	* @param {number} step Which held interval this is.
	* @param {number} axisSalt The constant distinguishing this axis from the other.
	* @returns {number}
	*/
	static jitterAxis(glyphIndex, step, axisSalt) {
		const indexTerm = (glyphIndex + 1) * MessageEffectRegistry.JitterIndexSalt;
		const timeTerm = (step + 1) * MessageEffectRegistry.JitterTimeSalt;
		const swing = MessageNoise.signedUnit(indexTerm ^ timeTerm ^ axisSalt);
		return swing * MessageEffectRegistry.JitterRadius;
	}
	/**
	* Swells the glyph and lets it settle again, so a phrase breathes.
	*
	* The only round-one effect that changes size rather than position or colour, which means it is
	* also the only one that can overlap its neighbours - the line was measured once, at the drawn
	* size, and nothing re-measures it. That is why the amplitude is small and why the swell is
	* centred rather than growing from a corner.
	* @param {number} glyphIndex The glyph's position in the message.
	* @param {number} frame How many frames the message has been revealing.
	* @returns {MessageGlyphModulation}
	*/
	static pulse(glyphIndex, frame) {
		const cycles = frame / MessageEffectRegistry.PulsePeriod;
		const phase = cycles * Math.PI * 2 + glyphIndex * MessageEffectRegistry.PulsePhasePerGlyph;
		const scale = 1 + MessageEffectRegistry.PulseAmplitude * Math.sin(phase);
		return new MessageGlyphModulation(0, 0, null, scale);
	}
	/**
	* Cycles the glyph's colour through the wheel, offset per glyph so the word forms a gradient.
	* @param {number} glyphIndex The glyph's position in the message.
	* @param {number} frame How many frames the message has been revealing.
	* @returns {MessageGlyphModulation}
	*/
	static rainbow(glyphIndex, frame) {
		const timeHue = frame * MessageEffectRegistry.RainbowDegreesPerFrame;
		const glyphHue = glyphIndex * MessageEffectRegistry.RainbowDegreesPerGlyph;
		const tint = MessageTintResolver.fromHue(timeHue + glyphHue);
		return new MessageGlyphModulation(0, 0, tint);
	}
};

//#endregion
//#region src/plugins/message/core/sprites/Sprite_MessageGlyph.js
/**
* One character of a message, drawn as something that can still be moved after it is drawn.
*
* The engine's own message text goes straight into the window's `contents` bitmap, where it stops
* being letters and becomes pixels. That is why nothing in vanilla can wave a word: there is no
* word there any more. A sprite per glyph costs more than a single bitmap and buys the only thing
* worth buying here, which is that the letter is still an object on frame two hundred.
*
* **The raster is white and the colour arrives as a tint.** Painting the glyph its real colour
* would be simpler and would make colour cycling impossible - a tint multiplies, so a glyph already
* red can be dimmed but never turned green. Drawing white and multiplying by the real colour lands
* in exactly the same place for static text, and leaves the colour free to animate. It also means
* two glyphs that differ only in colour are the same picture, which is what makes the cache below
* worth having at all.
*
* Rasters are shared across every glyph in the game and deliberately never expire. Dialogue reuses
* a very small alphabet in a very small number of styles, so the cache stops growing within the
* first few messages and every message after that is pure lookup.
*/
var Sprite_MessageGlyph = class Sprite_MessageGlyph extends Sprite {
	/**
	* The colour every glyph is rasterized in, before its real colour is applied as a tint.
	* @type {string}
	*/
	static RasterColor = "#ffffff";
	/**
	* The tint that leaves artwork exactly as it was drawn.
	* @type {number}
	*/
	static IconTint = 16777215;
	/**
	* Every glyph picture built so far, by the key describing what makes it distinct.
	* @type {Map<string, Bitmap>}
	*/
	static #rasters = new Map();
	/**
	* The one bitmap used to measure text, shared by every glyph ever drawn.
	*
	* Measuring needs a canvas context and nothing else, so a single pixel of one is enough. Giving
	* each sprite its own measuring bitmap is the trap {@link Sprite_BaseText} falls into - that is a
	* whole canvas element per instance, which is fine for one label above a character's head and
	* ruinous at ninety per page of dialogue.
	* @type {Bitmap|null}
	*/
	static #measuringBitmap = null;
	/**
	* Measures a character at a given style, in logical pixels.
	*
	* The measuring bitmap is deliberately never device-scaled: `measureText` ignores the context
	* transform, so the answer is in logical pixels either way, and scaling it would only make the
	* shared canvas larger for no gain.
	* @param {MessageGlyph} glyph The glyph whose character and style to measure.
	* @returns {number}
	*/
	static measure(glyph) {
		Sprite_MessageGlyph.#measuringBitmap ||= new Bitmap(1, 1);
		const measuring = Sprite_MessageGlyph.#measuringBitmap;
		measuring.fontFace = glyph.fontFace;
		measuring.fontSize = glyph.fontSize;
		measuring.fontBold = glyph.bold;
		measuring.fontItalic = glyph.italic;
		return measuring.measureTextWidth(glyph.character);
	}
	/**
	* The picture for a glyph, built once and shared from then on.
	* @param {MessageGlyph} glyph The glyph to draw.
	* @returns {Bitmap}
	*/
	static rasterFor(glyph) {
		const key = glyph.rasterKey();
		const cached = Sprite_MessageGlyph.#rasters.get(key);
		if (cached !== undefined) return cached;
		const raster = Sprite_MessageGlyph.buildRaster(glyph);
		Sprite_MessageGlyph.#rasters.set(key, raster);
		return raster;
	}
	/**
	* Draws one glyph onto a bitmap of its own.
	*
	* Every measurement comes from {@link TextRasterMetrics}, which exists because canvas text
	* rasterization has three separate ways of quietly ruining a glyph - condensing it to fit a
	* fractional width, shaving the outline off at the edge, and landing the whole thing on a half
	* pixel. The outline width and colour, though, are taken from the glyph rather than from that
	* class: they describe what the window was already drawing, and the point of this pipeline is to
	* render what the engine rendered, not an improvement on it.
	* @param {MessageGlyph} glyph The glyph to draw.
	* @returns {Bitmap}
	*/
	static buildRaster(glyph) {
		const measuredWidth = Sprite_MessageGlyph.measure(glyph);
		const textWidth = TextRasterMetrics.textWidth(measuredWidth);
		const padding = TextRasterMetrics.padding(glyph.outlineWidth);
		const canvasWidth = TextRasterMetrics.canvasWidth(textWidth, padding);
		const canvasHeight = TextRasterMetrics.canvasHeight(glyph.fontSize);
		const raster = new Bitmap(canvasWidth, canvasHeight);
		raster.applyDeviceScale(Graphics.deviceScale);
		raster.fontFace = glyph.fontFace;
		raster.fontSize = glyph.fontSize;
		raster.fontBold = glyph.bold;
		raster.fontItalic = glyph.italic;
		raster.textColor = Sprite_MessageGlyph.RasterColor;
		raster.outlineColor = glyph.outlineColor;
		raster.outlineWidth = glyph.outlineWidth;
		raster.drawText(glyph.character, padding, 0, textWidth, glyph.lineHeight, "left");
		return raster;
	}
	/**
	* Extend initialization to draw the glyph this sprite represents.
	* @param {MessageGlyph} glyph The glyph to draw.
	*/
	initialize(glyph) {
		super.initialize();
		this.initMembers();
		this.setGlyph(glyph);
	}
	/**
	* Initialize all properties of this class.
	*/
	initMembers() {
		/**
		* The shared root namespace for all of J's plugin data.
		*/
		this._j ||= {};
		/**
		* The glyph this sprite draws.
		* @type {MessageGlyph|null}
		*/
		this._j._glyph = null;
		/**
		* How far the raster's transparent margin pushes the glyph right of the sprite's origin.
		* @type {number}
		*/
		this._j._rasterPadding = 0;
	}
	/**
	* The glyph this sprite draws.
	* @returns {MessageGlyph}
	*/
	glyph() {
		return this._j._glyph;
	}
	/**
	* How far the raster's transparent margin pushes the glyph right of this sprite's origin.
	* @returns {number}
	*/
	rasterPadding() {
		return this._j._rasterPadding;
	}
	/**
	* Sets how far the raster's transparent margin pushes the glyph right of this sprite's origin.
	* @param {number} padding The margin reserved on the left of the raster.
	*/
	setRasterPadding(padding) {
		this._j._rasterPadding = padding;
	}
	/**
	* How many icons sit in one row of the icon sheet.
	* @type {number}
	*/
	static IconsPerRow = 16;
	/**
	* Binds this sprite to a glyph and draws it at rest.
	* @param {MessageGlyph} glyph The glyph to draw.
	*/
	setGlyph(glyph) {
		this._j._glyph = glyph;
		if (glyph.isIcon() === true) {
			this.setupIcon(glyph);
		} else {
			this.setupCharacter(glyph);
		}
		this.settle();
	}
	/**
	* Draws this sprite as one character, from the shared raster cache.
	* @param {MessageGlyph} glyph The glyph to draw.
	*/
	setupCharacter(glyph) {
		this.setRasterPadding(TextRasterMetrics.padding(glyph.outlineWidth));
		this.bitmap = Sprite_MessageGlyph.rasterFor(glyph);
	}
	/**
	* Draws this sprite as one icon, copied out of the shared icon sheet into a bitmap of its own.
	*
	* Pointing the sprite at the sheet and framing a region of it looks cheaper and does not work
	* here: the frame is correct, the texture is ready, and nothing renders - the glyph plane draws
	* every other sprite from a bitmap it owns outright, and a sprite sharing a base texture with the
	* rest of the game does not survive the trip. Copying thirty-two pixels square into a private
	* bitmap sidesteps the question entirely, makes an icon behave exactly like a character all the
	* way down, and is what the engine's own `drawIcon` does anyway.
	*
	* The copy is cached like any other glyph raster, so an icon is only ever copied once however
	* many times a message mentions it.
	* @param {MessageGlyph} glyph The glyph to draw.
	*/
	setupIcon(glyph) {
		this.setRasterPadding(0);
		this.bitmap = Sprite_MessageGlyph.iconRasterFor(glyph.iconIndex);
	}
	/**
	* The private copy of one icon, built once and shared from then on.
	* @param {number} iconIndex The icon to copy.
	* @returns {Bitmap}
	*/
	static iconRasterFor(iconIndex) {
		const key = `icon:${iconIndex}`;
		const cached = Sprite_MessageGlyph.#rasters.get(key);
		if (cached !== undefined) return cached;
		const raster = Sprite_MessageGlyph.buildIconRaster(iconIndex);
		Sprite_MessageGlyph.#rasters.set(key, raster);
		return raster;
	}
	/**
	* Copies one icon out of the sheet onto a bitmap of its own.
	* @param {number} iconIndex The icon to copy.
	* @returns {Bitmap}
	*/
	static buildIconRaster(iconIndex) {
		const { iconWidth, iconHeight } = ImageManager;
		const sourceX = iconIndex % Sprite_MessageGlyph.IconsPerRow * iconWidth;
		const sourceY = Math.floor(iconIndex / Sprite_MessageGlyph.IconsPerRow) * iconHeight;
		const raster = new Bitmap(iconWidth, iconHeight);
		const iconSheet = ImageManager.loadSystem("IconSet");
		iconSheet.addLoadListener(() => raster.blt(iconSheet, sourceX, sourceY, iconWidth, iconHeight, 0, 0));
		return raster;
	}
	/**
	* The colour this sprite shows when nothing is acting on it.
	*
	* A character is rasterized white and owes its whole appearance to this. An icon is finished
	* artwork that arrives already coloured, so it is left alone - tinting it by the surrounding text
	* colour would repaint the art every time a name beside it changed colour.
	* @returns {number}
	*/
	restingTint() {
		const glyph = this.glyph();
		if (glyph.isIcon() === true) return Sprite_MessageGlyph.IconTint;
		return MessageTintResolver.fromCssColor(glyph.textColor);
	}
	/**
	* Places this sprite where the engine would have drawn its glyph, with nothing acting on it.
	*/
	settle() {
		const modulation = MessageGlyphModulation.none();
		this.applyModulation(modulation);
	}
	/**
	* Places this sprite for one frame, with whatever is currently acting on it.
	* @param {MessageGlyphModulation} modulation This frame's displacement and colour.
	*/
	applyModulation(modulation) {
		const glyph = this.glyph();
		const scale = Graphics.deviceScale;
		const restingX = glyph.x - this.rasterPadding();
		this.scale.set(modulation.scale, modulation.scale);
		const growth = modulation.scale - 1;
		const growthX = this.bitmap.width * growth / 2;
		const growthY = this.bitmap.height * growth / 2;
		this.x = TextRasterMetrics.snap(restingX + modulation.offsetX - growthX, scale);
		this.y = TextRasterMetrics.snap(glyph.y + modulation.offsetY - growthY, scale);
		if (modulation.tint === null) {
			this.tint = this.restingTint();
			return;
		}
		this.tint = modulation.tint;
	}
};

//#endregion
//#region src/plugins/message/core/sprites/Sprite_MessageGlyphLayer.js
/**
* The plane a message's letters live on, above the window's own contents.
*
* It exists to own two things the individual glyphs should not: the clock, and the list. A frame
* counter kept per glyph would drift between letters that are supposed to share a wave, and ninety
* sprites each deciding when to update is ninety times the bookkeeping for one shared answer.
*
* The layer is added to its window with `addInnerChild`, which is doing more work than it appears
* to. That parents it into the window's client area, which is already offset by the window's
* padding, already scrolled by the window's origin, already hidden while the window is opening or
* closing, and already drawn above the contents sprite - so the face still renders behind the text,
* the letters still disappear with the window, and none of it needed a coordinate system of its own.
*
* It also inherits its heartbeat for free: the engine's `Window.update` walks its children, the
* client area is a `Sprite`, and `Sprite.update` walks *its* children. Being a sprite in that chain
* is the whole subscription.
*/
var Sprite_MessageGlyphLayer = class extends Sprite {
	/**
	* Extend initialization to establish an empty plane.
	*/
	initialize() {
		super.initialize();
		this.initMembers();
	}
	/**
	* Initialize all properties of this class.
	*/
	initMembers() {
		/**
		* The shared root namespace for all of J's plugin data.
		*/
		this._j ||= {};
		/**
		* The sprites currently on this plane, in the order their glyphs were emitted.
		* @type {Sprite_MessageGlyph[]}
		*/
		this._j._glyphSprites = [];
		/**
		* How many frames this plane has been animating.
		*
		* Counted from when the page began rather than from when the game did, so an effect looks the
		* same every time a line is read rather than depending on how long the player has been playing.
		* @type {number}
		*/
		this._j._frame = 0;
	}
	/**
	* The sprites currently on this plane.
	* @returns {Sprite_MessageGlyph[]}
	*/
	glyphSprites() {
		return this._j._glyphSprites;
	}
	/**
	* How many frames this plane has been animating.
	* @returns {number}
	*/
	frame() {
		return this._j._frame;
	}
	/**
	* Sets how many frames this plane has been animating.
	* @param {number} frame The new frame count.
	*/
	setFrame(frame) {
		this._j._frame = frame;
	}
	/**
	* Puts one emitted glyph onto the plane.
	* @param {MessageGlyph} glyph The glyph to draw.
	*/
	addGlyph(glyph) {
		const sprite = new Sprite_MessageGlyph(glyph);
		this.glyphSprites().push(sprite);
		this.addChild(sprite);
	}
	/**
	* Empties the plane and restarts its clock.
	*
	* Called wherever the window clears its own contents, which is the start of every page. Resetting
	* the frame alongside the sprites is what keeps a wave from arriving mid-swell on page two.
	*/
	clearGlyphs() {
		this.glyphSprites().forEach((sprite) => this.removeChild(sprite));
		this._j._glyphSprites = [];
		this.setFrame(0);
	}
	/**
	* Extends {@link Sprite.update}.<br/>
	* Also advances the plane's clock and moves whatever is supposed to be moving.
	*/
	update() {
		super.update();
		this.setFrame(this.frame() + 1);
		this.updateGlyphs();
	}
	/**
	* Applies this frame's effects to every glyph carrying any.
	*/
	updateGlyphs() {
		const frame = this.frame();
		this.glyphSprites().forEach((sprite) => {
			const glyph = sprite.glyph();
			if (glyph.effects.length === 0) return;
			const modulation = MessageEffectRegistry.modulate(glyph.effects, glyph.index, frame);
			sprite.applyModulation(modulation);
		});
	}
};

//#endregion
//#region src/plugins/message/core/windows/Window_Message.js
/**
* The lowest character code that is a character rather than a command.
*
* The engine draws anything at or above this and interprets anything below it, so it is also the
* line between something a speaker says out loud and something an author typed at the engine.
* @type {number}
*/
var FIRST_PRINTABLE_CHAR_CODE = 32;
/**
* The gap the engine leaves after an inline icon, in pixels.
* @type {number}
*/
var ICON_TRAILING_GAP = 4;
/**
* Extends {@link #initMembers}.<br/>
* Also raises the plane that message glyphs are drawn on.
*/
J.MESSAGE.Aliased.Window_Message.set("initMembers", Window_Message.prototype.initMembers);
Window_Message.prototype.initMembers = function() {
	J.MESSAGE.Aliased.Window_Message.get("initMembers").call(this);
	this.initMessageGlyphMembers();
};
/**
* Initializes the members this plugin adds to the message window.
*
* This runs from `initMembers` rather than from the constructor body because the window's client
* area has to exist before anything can be parented into it, and `Window_Base.initialize` builds
* that on the way through to here.
*/
Window_Message.prototype.initMessageGlyphMembers = function() {
	/**
	* The shared root namespace for all of J's plugin data.
	*/
	this._j ||= {};
	/**
	* A grouping of all properties associated with the message system.
	*/
	this._j._message ||= {};
	/**
	* The profile of whoever is speaking the current message.
	* @type {MessageSpeakerProfile}
	*/
	this._j._message._profile = MessageSpeakerProfile.default();
	/**
	* The plane this window's glyphs are drawn on.
	* @type {Sprite_MessageGlyphLayer}
	*/
	this._j._message._glyphLayer = new Sprite_MessageGlyphLayer();
	/**
	* How many frames this window has been fading out for, or -1 when it is not.
	* @type {number}
	*/
	this._j._message._fadeElapsed = Window_Message.NotFading;
	/**
	* How many frames this window's fade runs for in total.
	*
	* Captured when the fade begins rather than asked for each frame, so a config reloaded mid-fade
	* cannot change the length of one already running.
	* @type {number}
	*/
	this._j._message._fadeFrames = 0;
	/**
	* The rectangle the scene built this window at.
	*
	* Captured rather than recomputed, because a message that welds several Show Text commands
	* together grows the window to hold all of them, and the ordinary message after it has to find
	* the window at the size the project laid out.
	* @type {Rectangle}
	*/
	this._j._message._defaultRect = new Rectangle(this.x, this.y, this.width, this.height);
	this.addInnerChild(this._j._message._glyphLayer);
};
/**
* The plane this window's glyphs are drawn on.
* @returns {Sprite_MessageGlyphLayer}
*/
Window_Message.prototype.messageGlyphLayer = function() {
	return this._j._message._glyphLayer;
};
/**
* The rectangle the scene built this window at.
* @returns {Rectangle}
*/
Window_Message.prototype.defaultMessageRect = function() {
	return this._j._message._defaultRect;
};
/**
* The rectangle this window should occupy for the message it is about to reveal.
*
* Everything but the height is the scene's answer passed straight back. A message is only ever
* allowed to grow downward, because how wide the box is and where it sits are the project's layout
* - not something any one line of dialogue gets an opinion about.
* @returns {Rectangle}
*/
Window_Message.prototype.messageRestingRect = function() {
	const rect = this.defaultMessageRect();
	const height = this.messageRestingHeight();
	return new Rectangle(rect.x, rect.y, rect.width, height);
};
/**
* How tall this window has to be to hold the message it is about to reveal.
*
* Deliberately not clamped to the screen. The ceiling is enforced where the decision to weld another
* Show Text onto this one is made, which is the only place that can stop before crossing it rather
* than trimming afterward - and the editor gives a single Show Text four lines, so a message that
* never welded cannot outgrow the box on its own.
* @returns {number}
*/
Window_Message.prototype.messageRestingHeight = function() {
	const rect = this.defaultMessageRect();
	const lineHeight = this.lineHeight();
	const defaultRows = MessageChain.rowsFor(rect.height, lineHeight, this.padding);
	const rows = $gameMessage.texts().length;
	return MessageChain.heightFor(rows, rect.height, defaultRows, lineHeight);
};
/**
* Puts this window at the size the message it is showing calls for.
*
* Named for restoring rather than resizing because that is what it does the overwhelming majority of
* the time: the message before this one grew the box, or floated it somewhere, and this is the box
* coming home. A message long enough to need more room is the rare case, not the ordinary one.
*/
Window_Message.prototype.restoreMessageRect = function() {
	const resting = this.messageRestingRect();
	if (this.width === resting.width && this.height === resting.height) return;
	this.move(resting.x, resting.y, resting.width, resting.height);
	this.createContents();
};
/**
* The profile of whoever is speaking the current message.
* @returns {MessageSpeakerProfile}
*/
Window_Message.prototype.messageProfile = function() {
	return this._j._message._profile;
};
/**
* Sets the profile of whoever is speaking the current message.
* @param {MessageSpeakerProfile} profile The speaker's profile.
*/
Window_Message.prototype.setMessageProfile = function(profile) {
	this._j._message._profile = profile;
};
/**
* Adds frames to however long this window is already waiting.
*
* Deliberately additive. The engine's own {@link Window_Message.startWait} assigns, and the author's
* `\.` and `\|` write to the very same counter - so pacing that assigned would silently swallow a
* beat somebody wrote on purpose, and would do it only when the two happened to land on the same
* frame, which is the worst possible way to find out.
* @param {number} frames How many frames to add.
*/
Window_Message.prototype.addMessageWait = function(frames) {
	const waiting = this.waitCount();
	this.setWaitCount(waiting + frames);
};
/**
* How many frames this window is still waiting before it reveals anything more.
* @returns {number}
*/
Window_Message.prototype.waitCount = function() {
	return this._waitCount;
};
/**
* Sets how many frames this window waits before it reveals anything more.
* @param {number} frames The frames remaining.
*/
Window_Message.prototype.setWaitCount = function(frames) {
	this._waitCount = frames;
};
/**
* Whether this window is currently racing to the end of the page.
*
* True while the player holds the confirm button, and while a line has been marked to show fast.
* Both mean the same thing for anything that happens per character: it is about to happen for the
* whole page within a single frame.
* @returns {boolean}
*/
Window_Message.prototype.isRushingMessage = function() {
	return this.showFast() === true || this.lineShowFast() === true;
};
/**
* Whether the player is currently holding the message forward.
* @returns {boolean}
*/
Window_Message.prototype.showFast = function() {
	return this._showFast;
};
/**
* Whether the current line has been marked to reveal without pausing.
* @returns {boolean}
*/
Window_Message.prototype.lineShowFast = function() {
	return this._lineShowFast;
};
/**
* The text state of the message currently being revealed, if there is one.
* @returns {?RPG_TextState}
*/
Window_Message.prototype.textState = function() {
	return this._textState;
};
/**
* Whether a text state belongs to the message this window is currently revealing.
*
* `Window_Message` inherits `drawTextEx` and `textSizeEx` from its base, and both run the whole text
* pipeline on a state of their own. Those are ordinary drawing and measuring operations that happen
* to be performed on this window, and they must keep landing in `contents` the way they always have
* - only the message being read aloud becomes glyphs.
* @param {RPG_TextState} textState The text state in question.
* @returns {boolean}
*/
Window_Message.prototype.isRevealingTextState = function(textState) {
	return textState === this.textState();
};
/**
* Extends {@link #startMessage}.<br/>
* Also works out who is speaking and how much room they need, before anything is built that needs
* to know either.
*/
J.MESSAGE.Aliased.Window_Message.set("startMessage", Window_Message.prototype.startMessage);
Window_Message.prototype.startMessage = function() {
	this.resolveMessageProfile();
	this.restoreMessageRect();
	J.MESSAGE.Aliased.Window_Message.get("startMessage").call(this);
};
/**
* Identifies the speaker of the current message and adopts their profile.
*/
Window_Message.prototype.resolveMessageProfile = function() {
	const speakerName = $gameMessage.speakerName();
	const faceName = $gameMessage.faceName();
	const faceIndex = $gameMessage.faceIndex();
	const profile = MessageProfileResolver.resolve(speakerName, faceName, faceIndex);
	this.setMessageProfile(profile);
};
/**
* Extends {@link #createTextState}.<br/>
* Also seeds the effect and glyph bookkeeping this plugin reads while revealing.
*
* Deliberately blind to who is speaking. This is a `Window_Base` method, so `drawTextEx` and
* `textSizeEx` reach it on this very window - seeding a speaker's baseline here would leak the
* current message's identity into drawing that has nothing to do with the message.
* @param {string} text The text to reveal.
* @param {number} x The x coordinate to begin at.
* @param {number} y The y coordinate to begin at.
* @param {number} width The width available.
* @returns {RPG_TextState}
*/
J.MESSAGE.Aliased.Window_Message.set("createTextState", Window_Base.prototype.createTextState);
Window_Message.prototype.createTextState = function(text, x, y, width) {
	const textState = J.MESSAGE.Aliased.Window_Message.get("createTextState").call(this, text, x, y, width);
	/**
	* The effects the author has opened with a text code and not yet closed.
	* @type {Set<string>}
	*/
	textState.spanEffects = new Set();
	/**
	* How many glyphs have been emitted so far, counted across runs and lines.
	* @type {number}
	*/
	textState.glyphIndex = 0;
	/**
	* Where this state's glyphs go instead of onto the window's plane, if anywhere.
	*
	* Null for the message actually being read, which emits onto the plane the player is looking at.
	* An array for a measuring pass, which wants the same glyphs handed back rather than displayed.
	* @type {?MessageGlyph[]}
	*/
	textState.glyphSink = null;
	return textState;
};
/**
* Builds a message's glyphs without showing any of them.
*
* The reason this exists: glyphs are emitted *as the text reveals*, a tick at a time, so on the frame
* a message opens there are none of them yet. Anything that needs to know how much room the message
* will occupy - a bubble sized to its own text, most obviously - is asking that question at the one
* moment the answer does not exist. This runs the entire pipeline ahead of time and collects what it
* produces, so the question has an answer before the first character appears.
*
* It is the whole pipeline on purpose rather than a cheaper estimate. Line breaking, face offsets,
* every escape code, font size changes mid-line and the database substitution codes all move glyphs
* around, and a measurement that reimplemented any of that would agree with the real thing right up
* until it did not.
* @param {string} text The message text, exactly as it will be revealed.
* @returns {MessageGlyph[]} Every glyph the message will produce, positioned.
*/
Window_Message.prototype.layoutMessageGlyphs = function(text) {
	const heldWaitCount = this.waitCount();
	const heldPause = this.pause;
	const textState = this.buildMessageLayoutState(text);
	this.processAllText(textState);
	this.setWaitCount(heldWaitCount);
	this.pause = heldPause;
	return textState.glyphSink;
};
/**
* Prepares a text state for measuring, set up exactly as the real one will be.
*
* Mirrors what `startMessage` and `newPage` do between them, because anything they do that moves a
* glyph has to have happened before the glyphs are counted: the face pushes the first line right,
* and the font settings decide how wide every character measures.
* @param {string} text The message text, exactly as it will be revealed.
* @returns {RPG_TextState}
*/
Window_Message.prototype.buildMessageLayoutState = function(text) {
	const textState = this.createTextState(text, 0, 0, this.innerWidth);
	textState.x = this.newLineX(textState);
	textState.startX = textState.x;
	textState.y = 0;
	textState.glyphSink = [];
	this.resetFontSettings();
	textState.height = this.calcTextHeight(textState);
	return textState;
};
/**
* Whether a text state should produce glyphs rather than pixels.
*
* Two kinds qualify: the message being read aloud, and a measuring pass that has somewhere to put
* what it builds. Everything else on this window - `drawTextEx` from a subclass, `textSizeEx` from
* the engine - is ordinary drawing and keeps landing in `contents` exactly as it always has.
* @param {RPG_TextState} textState The text state in question.
* @returns {boolean}
*/
Window_Message.prototype.isEmittingGlyphs = function(textState) {
	if (this.isRevealingTextState(textState) === true) return true;
	return textState.glyphSink !== null;
};
/**
* Files one glyph wherever the state it came from wants its glyphs.
* @param {MessageGlyph} glyph The glyph to file.
* @param {RPG_TextState} textState The text state that produced it.
*/
Window_Message.prototype.addMessageGlyph = function(glyph, textState) {
	if (textState.glyphSink !== null) {
		textState.glyphSink.push(glyph);
		return;
	}
	this.messageGlyphLayer().addGlyph(glyph);
};
/**
* Extends {@link #newPage}.<br/>
* Also empties the glyph plane and closes any emphasis left open on the page before.
*/
J.MESSAGE.Aliased.Window_Message.set("newPage", Window_Message.prototype.newPage);
Window_Message.prototype.newPage = function(textState) {
	J.MESSAGE.Aliased.Window_Message.get("newPage").call(this, textState);
	this.messageGlyphLayer().clearGlyphs();
	textState.spanEffects.clear();
};
/**
* The elapsed value meaning this window is not fading out.
* @type {number}
*/
Window_Message.NotFading = -1;
/**
* Extends {@link #terminateMessage}.<br/>
* Also begins fading the finished message out rather than letting it blink away.
*/
J.MESSAGE.Aliased.Window_Message.set("terminateMessage", Window_Message.prototype.terminateMessage);
Window_Message.prototype.terminateMessage = function() {
	J.MESSAGE.Aliased.Window_Message.get("terminateMessage").call(this);
	this.beginMessageFade();
};
/**
* How many frames this window has been fading out for.
* @returns {number}
*/
Window_Message.prototype.fadeElapsed = function() {
	return this._j._message._fadeElapsed;
};
/**
* Sets how many frames this window has been fading out for.
* @param {number} elapsed The frames elapsed, or {@link Window_Message.NotFading}.
*/
Window_Message.prototype.setFadeElapsed = function(elapsed) {
	this._j._message._fadeElapsed = elapsed;
};
/**
* How many frames this window's fade runs for in total.
* @returns {number}
*/
Window_Message.prototype.fadeFrames = function() {
	return this._j._message._fadeFrames;
};
/**
* Sets how many frames this window's fade runs for in total.
* @param {number} frames The length of the fade.
*/
Window_Message.prototype.setFadeFrames = function(frames) {
	this._j._message._fadeFrames = frames;
};
/**
* Whether this window is currently fading out.
* @returns {boolean}
*/
Window_Message.prototype.isFadingMessage = function() {
	return this.fadeElapsed() !== Window_Message.NotFading;
};
/**
* Starts fading the finished message out.
*
* The original `terminateMessage` has just called `close()`, which begins the engine's own vertical
* collapse - and the first frame of that collapse hides the window's client area, taking every
* letter with it. So the collapse is undone here and replaced with a fade: the window is held fully
* open and made progressively transparent instead, which is the only way the text is still on screen
* to leave with it.
*
* A window that was never opened declines the fade, because it has nothing on screen to fade. A Show
* Choices, Input Number or Select Item written without a Show Text above it starts with this window
* still shut, and still ends by terminating it - so fading from there would throw the empty box fully
* open for the whole length of the fade just to dissolve it again.
*/
Window_Message.prototype.beginMessageFade = function() {
	if (this.isClosed() === true) {
		this.finishMessageFade();
		return;
	}
	const frames = MessageFade.frames();
	this.setFadeFrames(frames);
	this.setFadeElapsed(0);
	if (frames <= 0) {
		this.finishMessageFade();
		return;
	}
	this.openness = 255;
	this.open();
};
/**
* Advances the fade by one frame, ending it when it has run its course.
*/
Window_Message.prototype.updateMessageFade = function() {
	if (this.isFadingMessage() === false) return;
	const frames = this.fadeFrames();
	const elapsed = this.fadeElapsed() + 1;
	this.setFadeElapsed(elapsed);
	this.setMessageAlpha(MessageFade.alphaAt(elapsed, frames));
	if (MessageFade.isFinished(elapsed, frames) === false) return;
	this.finishMessageFade();
};
/**
* Takes the faded message off the screen.
*/
Window_Message.prototype.finishMessageFade = function() {
	this.setFadeElapsed(Window_Message.NotFading);
	this.setMessageAlpha(1);
	this.openness = 0;
	this.messageGlyphLayer().clearGlyphs();
};
/**
* Abandons a fade because the next message has arrived.
*
* The openness is deliberately left alone. Vanilla keeps the box seamlessly open when the following
* text is already queued, and zeroing it here would make every line of a conversation re-open with
* a little squeeze that the engine never had.
*/
Window_Message.prototype.cancelMessageFade = function() {
	this.setFadeElapsed(Window_Message.NotFading);
	this.setMessageAlpha(1);
};
/**
* Sets how opaque the whole message is, plate included.
*
* The name plate is a window of its own that merely copies this one's openness, so left out of the
* fade it would sit at full brightness over a message dissolving underneath it and then snap away.
* @param {number} alpha The opacity, from one down to zero.
*/
Window_Message.prototype.setMessageAlpha = function(alpha) {
	this.alpha = alpha;
	this.nameBoxWindow().alpha = alpha;
};
/**
* The plate the engine draws a speaker's name on.
* @returns {Window_NameBox}
*/
Window_Message.prototype.nameBoxWindow = function() {
	return this._nameBoxWindow;
};
/**
* Extends {@link #update}.<br/>
* Also runs the fade, and abandons it the moment another message is waiting.
*
* The abandoning happens before the original on purpose. The original is what starts the next
* message, and a fade still running when it does would take the new message's own letters down with
* it.
*/
J.MESSAGE.Aliased.Window_Message.set("update", Window_Message.prototype.update);
Window_Message.prototype.update = function() {
	if (this.isFadingMessage() === true && $gameMessage.isBusy() === true) {
		this.cancelMessageFade();
	}
	J.MESSAGE.Aliased.Window_Message.get("update").call(this);
	this.updateMessageFade();
};
/**
* Extends {@link #processCharacter}.<br/>
* Also gives the speaker their voice and their pace.
*
* Purely observational- the original's buffering is untouched. That matters: the engine accumulates
* characters into a run and only draws when it reaches a command, and the glyph pipeline downstream
* depends on receiving whole runs rather than single letters.
* @param {RPG_TextState} textState The text state being revealed.
*/
J.MESSAGE.Aliased.Window_Message.set("processCharacter", Window_Message.prototype.processCharacter);
Window_Message.prototype.processCharacter = function(textState) {
	this.speakMessageCharacter(textState);
	J.MESSAGE.Aliased.Window_Message.get("processCharacter").call(this, textState);
};
/**
* Sounds and paces the character that is about to be revealed.
* @param {RPG_TextState} textState The text state being revealed.
*/
Window_Message.prototype.speakMessageCharacter = function(textState) {
	if (this.isRevealingTextState(textState) === false) return;
	if (this.isRushingMessage() === true) return;
	const character = textState.text[textState.index];
	if (character.charCodeAt(0) < FIRST_PRINTABLE_CHAR_CODE) return;
	const profile = this.messageProfile();
	this.playMessageVoice(textState, character, profile);
	const extraFrames = MessagePacing.extraFramesFor(character, profile);
	this.addMessageWait(extraFrames);
};
/**
* Plays the speaker's voice for one character, if this is a character they voice.
* @param {RPG_TextState} textState The text state being revealed.
* @param {string} character The character about to be revealed.
* @param {MessageSpeakerProfile} profile The speaker's profile.
*/
Window_Message.prototype.playMessageVoice = function(textState, character, profile) {
	const voice = MessageVoiceSelector.selectFor(textState.glyphIndex, character, profile);
	if (voice === null) return;
	AudioManager.playSe(voice);
};
/**
* Overwrites {@link #flushTextState}.<br/>
* Emits the buffered run as individually addressable glyphs instead of drawing it.
*
* The original is still reached for anything that is not the message being revealed, which is what
* keeps `drawTextEx` on this window behaving exactly as it does everywhere else.
* @param {RPG_TextState} textState The text state being flushed.
*/
J.MESSAGE.Aliased.Window_Message.set("flushTextState", Window_Base.prototype.flushTextState);
Window_Message.prototype.flushTextState = function(textState) {
	if (this.isEmittingGlyphs(textState) === false) {
		J.MESSAGE.Aliased.Window_Message.get("flushTextState").call(this, textState);
		return;
	}
	this.flushTextStateAsGlyphs(textState);
};
/**
* Performs the original flush's bookkeeping, emitting glyphs where it would have drawn.
*
* The cursor arithmetic below is the original's, reproduced rather than delegated to. Handing the
* original a state with `drawing` switched off would skip the draw, but it also performs the
* `outputWidth` and `outputHeight` accounting that a floating message window needs in order to size
* itself - so the draw is what gets replaced, and the accounting is what gets kept.
* @param {RPG_TextState} textState The text state being flushed.
*/
Window_Message.prototype.flushTextStateAsGlyphs = function(textState) {
	const { buffer: run, rtl, height, y } = textState;
	const width = this.textWidth(run);
	const x = rtl ? textState.x - width : textState.x;
	if (textState.drawing === true && run.length > 0) {
		this.emitMessageGlyphRun(run, x, y, textState);
	}
	textState.x += rtl ? -width : width;
	textState.buffer = this.createTextBuffer(rtl);
	const outputWidth = Math.abs(textState.x - textState.startX);
	if (textState.outputWidth < outputWidth) {
		textState.outputWidth = outputWidth;
	}
	textState.outputHeight = y - textState.startY + height;
};
/**
* Turns one buffered run into glyphs on the plane.
* @param {string} run The buffered run of characters.
* @param {number} x Where the run begins horizontally.
* @param {number} y Where the run begins vertically.
* @param {RPG_TextState} textState The text state being flushed.
*/
Window_Message.prototype.emitMessageGlyphRun = function(run, x, y, textState) {
	const style = this.buildMessageGlyphStyle(textState);
	const origin = {
		x,
		y,
		index: textState.glyphIndex
	};
	const measure = (text) => this.textWidth(text);
	const glyphs = MessageGlyphRunSplitter.split(run, origin, style, measure);
	glyphs.forEach((glyph) => this.addMessageGlyph(glyph, textState));
	textState.glyphIndex += glyphs.length;
};
/**
* Snapshots everything a glyph needs to know about how it should look.
* @param {RPG_TextState} textState The text state being flushed.
* @returns {MessageGlyphStyle}
*/
Window_Message.prototype.buildMessageGlyphStyle = function(textState) {
	const profile = this.messageProfile();
	const effects = MessageEffectSet.resolve(profile.baselineEffects, textState.spanEffects);
	return MessageGlyphStyle.fromContents(this.contents, textState.height, effects);
};
/**
* Overwrites {@link #processDrawIcon}.<br/>
* Emits an inline icon as a glyph instead of blitting it into the contents.
*
* An icon left behind in `contents` while the letters beside it became sprites would hold perfectly
* still inside a word that waves - and J-Message's own database codes all expand to an icon
* followed by a coloured name, so that pairing is the common case rather than a corner one.
* @param {number} iconIndex The icon to draw.
* @param {RPG_TextState} textState The text state being revealed.
*/
J.MESSAGE.Aliased.Window_Message.set("processDrawIcon", Window_Base.prototype.processDrawIcon);
Window_Message.prototype.processDrawIcon = function(iconIndex, textState) {
	if (this.isEmittingGlyphs(textState) === false) {
		J.MESSAGE.Aliased.Window_Message.get("processDrawIcon").call(this, iconIndex, textState);
		return;
	}
	this.emitMessageIconGlyph(iconIndex, textState);
};
/**
* Emits one inline icon as a glyph, and advances the cursor past it.
* @param {number} iconIndex The icon to draw.
* @param {RPG_TextState} textState The text state being revealed.
*/
Window_Message.prototype.emitMessageIconGlyph = function(iconIndex, textState) {
	const deltaX = ImageManager.standardIconWidth - ImageManager.iconWidth;
	const deltaY = ImageManager.standardIconHeight - ImageManager.iconHeight;
	const advance = ImageManager.standardIconWidth + ICON_TRAILING_GAP;
	if (textState.drawing === true) {
		const x = textState.x + deltaX / 2 + 2;
		const y = textState.y + deltaY / 2 + 2;
		const style = this.buildMessageGlyphStyle(textState);
		const glyph = MessageGlyph.forIcon(iconIndex, x, y, advance, textState.glyphIndex, style);
		this.addMessageGlyph(glyph, textState);
		textState.glyphIndex += 1;
	}
	textState.x += advance;
};
/**
* Extends {@link #obtainEscapeCode}.<br/>
* Also recognizes the symbols that toggle a rendering effect.
*
* Extended here rather than by widening J-Base's own escape code pattern, because that pattern
* serves every window in the game - a symbol recognized there but answered only here would be
* silently swallowed out of any menu that happened to contain it.
* @param {RPG_TextState} textState The text state being revealed.
* @returns {string} The escape code found, or an empty string.
*/
J.MESSAGE.Aliased.Window_Message.set("obtainEscapeCode", Window_Base.prototype.obtainEscapeCode);
Window_Message.prototype.obtainEscapeCode = function(textState) {
	const code = J.MESSAGE.Aliased.Window_Message.get("obtainEscapeCode").call(this, textState);
	if (code !== String.empty) return code;
	return this.obtainMessageEffectCode(textState);
};
/**
* Reads one effect-toggling symbol off the text, if that is what comes next.
* @param {RPG_TextState} textState The text state being revealed.
* @returns {string} The symbol found, or an empty string.
*/
Window_Message.prototype.obtainMessageEffectCode = function(textState) {
	const symbol = textState.text[textState.index];
	if (J.MESSAGE.EffectCodes.has(symbol) === false) return String.empty;
	textState.index += 1;
	return symbol;
};
/**
* Extends {@link #processEscapeCharacter}.<br/>
* Also toggles a rendering effect when the code is one of ours.
*
* The original is called first and unconditionally, because vanilla's own handler ends by
* delegating to the base - and the base is where J-Base's bold and italics live. Shadowing it
* without falling through would take `\*` and `\_` out of every message in the game.
* @param {string} code The escape code being processed.
* @param {RPG_TextState} textState The text state being revealed.
*/
J.MESSAGE.Aliased.Window_Message.set("processEscapeCharacter", Window_Message.prototype.processEscapeCharacter);
Window_Message.prototype.processEscapeCharacter = function(code, textState) {
	J.MESSAGE.Aliased.Window_Message.get("processEscapeCharacter").call(this, code, textState);
	this.processMessageEffectCode(code, textState);
};
/**
* Toggles the effect a code names, if it names one.
* @param {string} code The escape code being processed.
* @param {RPG_TextState} textState The text state being revealed.
*/
Window_Message.prototype.processMessageEffectCode = function(code, textState) {
	const effect = J.MESSAGE.EffectCodes.get(code);
	if (effect === undefined) return;
	MessageEffectSet.toggle(textState.spanEffects, effect);
};

//#endregion
//# sourceMappingURL=J-Message.js.map