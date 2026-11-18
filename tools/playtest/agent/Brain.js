//region Brain
import Explorer from './Explorer.js';
import Eyes from './Eyes.js';
import Fighter from './Fighter.js';
import Journal from './Journal.js';
import Ledger from './Ledger.js';
import Menus from './Menus.js';
import Reflexes from './Reflexes.js';
import Talker from './Talker.js';
import Thumbs from './Thumbs.js';
import Walker from './Walker.js';

const fs = globalThis.require('fs');

/**
 * Runs the bot once a frame: looks at the game, decides, and presses.
 *
 * The decision is a plain list of priorities, read top to bottom and stopping at the first thing that
 * applies. A message on screen beats everything, a cutscene means keeping hands off the controller,
 * getting out of the way of an attack beats any plan, an enemy in the way comes before wandering, and only
 * once there is nothing left to try does it go looking for a fight or turn back. That list is the whole of
 * the bot's personality.
 *
 * It also keeps score. A run ends in one of a few ways, and how it ended is the point of the exercise:
 * reaching the goal is a pass, and getting stuck, dying or crashing the game are all findings.
 */
class Brain
{
  /**
   * The map a run is trying to reach. The Crossroads sits just outside the first dungeon, and the only
   * way to it is through everything the tutorial has.
   * @type {number}
   */
  static GoalMapId = 14;

  /**
   * How many game overs a run takes before the bot stops trying.
   * @type {number}
   */
  static GameOverLimit = 3;

  /**
   * How many frames to wait after arriving on a map before taking its picture, so that it has faded in.
   * @type {number}
   */
  static ShotDelay = 45;

  /**
   * How many frames apart the slower checks on the world run.
   * @type {number}
   */
  static WatchEvery = 30;

  /**
   * How many frames of nothing changing to stand around for once the bot is out of ideas.
   * @type {number}
   */
  static PauseFrames = 300;

  /**
   * How many frames of nothing changing before whatever is being attempted gets dropped.
   * @type {number}
   */
  static RestlessFrames = 1800;

  /**
   * How many frames of nothing changing before a run is called stuck.
   * @type {number}
   */
  static StuckFrames = 5400;

  /**
   * The most game frames a single rendered frame is allowed to run, so that a slow stretch cannot wind
   * up an endless debt of frames to catch up on.
   * @type {number}
   */
  static MostFramesPerTick = 60;

  /**
   * How often the darkness gets repainted while the game is being drawn for a film, in milliseconds.
   * @type {number}
   */
  static FilmLightingMs = 66;

  /**
   * How often the darkness gets repainted when nobody is watching, in milliseconds. It only needs to
   * be right for the odd screenshot.
   * @type {number}
   */
  static TurboLightingMs = 500;

  /**
   * What this run was told.
   * @type {{runDirectory: string, doneMarker: string, minutes: number, speed: number, draw: boolean,
   * story: boolean, reflexes: string}}
   */
  #config;

  /**
   * Where lines go.
   * @type {Journal}
   */
  #journal;

  /**
   * The hands doing the pressing.
   * @type {Thumbs}
   */
  #thumbs = new Thumbs();

  /**
   * The part that gets through dialogue.
   * @type {Talker}
   */
  #talker;

  /**
   * The part that gets through menus.
   * @type {Menus}
   */
  #menus;

  /**
   * The part that fights.
   * @type {Fighter}
   */
  #fighter;

  /**
   * The part that gets out of the way.
   * @type {Reflexes}
   */
  #reflexes;

  /**
   * The part that decides where to go.
   * @type {Explorer}
   */
  #explorer;

  /**
   * The books on every hit in the game.
   * @type {Ledger}
   */
  #ledger = new Ledger();

  /**
   * Whether the run is over.
   * @type {boolean}
   */
  #isFinished = false;

  /**
   * When the run started, in real time.
   * @type {number}
   */
  #startedAt = Date.now();

  /**
   * The frame the first map came up on, which is when the clock a player would care about starts.
   * @type {number}
   */
  #firstMapFrame = -1;

  /**
   * The map the player was on last frame.
   * @type {number}
   */
  #mapId = 0;

  /**
   * The maps the run went through, in order.
   * @type {{mapId: number, name: string, at: string}[]}
   */
  #mapLog = [];

  /**
   * The frame a picture of this map is due on, or 0 when none is.
   * @type {number}
   */
  #shotDueAt = 0;

  /**
   * Whether the map's interpreter was running last frame, which is how an event starting gets noticed.
   * @type {boolean}
   */
  #wasRunningEvent = false;

  /**
   * The last frame anything changed.
   * @type {number}
   */
  #lastProgressFrame = 0;

  /**
   * Whether the bot has already lost patience with what it is doing.
   * @type {boolean}
   */
  #isRestless = false;

  /**
   * The tiles that have been stood on.
   * @type {Set<string>}
   */
  #tilesSeen = new Set();

  /**
   * A summary of the switches and self switches, which changes whenever the world does.
   * @type {string}
   */
  #worldMark = '';

  /**
   * A summary of the quest log.
   * @type {string}
   */
  #questMark = '';

  /**
   * A summary of the enemies' health, which changes whenever anything lands a hit.
   * @type {number}
   */
  #foeHealth = -1;

  /**
   * The total of everybody's kills, pages and the like at the last look.
   * @type {number}
   */
  #tally = 0;

  /**
   * Which party members were down at the last look.
   * @type {Set<number>}
   */
  #fallen = new Set();

  /**
   * How many times a party member has gone down.
   * @type {number}
   */
  #falls = 0;

  /**
   * The lowest share of their health each party member has been down to, by name.
   * @type {Map<string, number>}
   */
  #lowestHealth = new Map();

  /**
   * How many times the whole party has gone down.
   * @type {number}
   */
  #gameOvers = 0;

  /**
   * Whether the game over screen is the one up, so that one screen only counts once.
   * @type {boolean}
   */
  #isOnGameOver = false;

  /**
   * @param {object} config What this run was told.
   * @param {Journal} journal Where lines go.
   */
  constructor(config, journal)
  {
    this.#config = config;
    this.#journal = journal;

    const walker = new Walker(this.#thumbs);
    this.#menus = new Menus(this.#thumbs, journal);
    this.#talker = new Talker(this.#thumbs, journal, () => this.#wantsToSave(), config.story);
    const { meleeReachShare } = Reflexes.Profiles[config.reflexes];

    this.#fighter = new Fighter(this.#thumbs, walker, journal, meleeReachShare);
    this.#reflexes = new Reflexes(this.#thumbs, walker, journal, config.reflexes);
    this.#explorer = new Explorer(this.#thumbs, walker, journal);
  }

  //region install
  /**
   * Plugs the bot into the running game. Called once, with the engine and every plugin already loaded.
   */
  install()
  {
    this.#hookFrames();
    this.#hookCrashes();
    this.#hookPacing();
    this.#hookLighting();
    this.#hookDamage();

    // a run without a film has nobody to draw for, and drawing is most of what a frame costs.
    if (this.#config.draw === false)
    {
      Graphics._canRender = () => false;
    }

    // focus is a property of a desktop this run does not have.
    SceneManager.isGameActive = () => true;
  }

  /**
   * Hooks the top of the game's frame, so that the bot sees and presses at the same point every frame,
   * however many of them are being run. Reaction times stay in game frames no matter the speed.
   */
  #hookFrames()
  {
    const brain = this;
    const originalUpdateMain = SceneManager.updateMain;

    SceneManager.updateMain = function()
    {
      brain.#frame();
      originalUpdateMain.call(this);
    };
  }

  /**
   * Hooks the handler the engine stops the game with, because a crash is the loudest finding of all.
   */
  #hookCrashes()
  {
    const brain = this;
    const originalCatchException = SceneManager.catchException;

    SceneManager.catchException = function(error)
    {
      const text = error && error.stack ? error.stack : String(error);
      brain.#finish('crashed', text.slice(0, 1500));
      originalCatchException.call(this, error);
    };
  }

  /**
   * Replaces the engine's pacing with a simple debt of frames owed by the wall clock.
   * Left alone, the engine runs one or two game frames for every frame drawn, so software rendering
   * would play the game in slow motion. Paying the debt off instead means a speed of 1 is real time on
   * film however few frames got drawn, and any higher speed is that many times faster.
   */
  #hookPacing()
  {
    const framesPerMillisecond = this.#config.speed * 60 / 1000;
    let last = performance.now();
    let owed = 0;

    SceneManager.determineRepeatNumber = () =>
    {
      const now = performance.now();
      owed = Math.min(owed + (now - last) * framesPerMillisecond, Brain.MostFramesPerTick);
      last = now;

      const due = Math.floor(owed);
      owed -= due;

      return due;
    };
  }

  /**
   * Hooks every action as it is applied, so that the ledger hears about each hit from the game itself.
   */
  #hookDamage()
  {
    const ledger = this.#ledger;
    const reflexes = this.#reflexes;
    const originalApply = Game_Action.prototype.apply;

    Game_Action.prototype.apply = function(target)
    {
      originalApply.call(this, target);
      ledger.record(this, target);
      reflexes.onHit(this, target);
    };
  }

  /**
   * Stops the darkness being repainted every game frame. A graphics card does that in nothing flat, and
   * a software renderer spends most of a frame on it, which would put the whole run at its mercy. All it
   * changes is how often the picture of the light is refreshed, never anything a character can touch.
   */
  #hookLighting()
  {
    const interval = this.#config.draw ? Brain.FilmLightingMs : Brain.TurboLightingMs;
    const originalRenderComposite = Sprite_LightMask.prototype.renderComposite;
    let lastPainted = 0;

    Sprite_LightMask.prototype.renderComposite = function()
    {
      const now = performance.now();
      if (now - lastPainted < interval) return;

      lastPainted = now;
      originalRenderComposite.call(this);
    };
  }

  //endregion install

  //region frame
  /**
   * Plays one frame.
   */
  #frame()
  {
    if (this.#isFinished) return;

    this.#update();

    // something above may have called the run, and a finished bot keeps its hands off.
    if (this.#isFinished === false) this.#thumbs.apply();
  }

  /**
   * Works out which screen this is and plays it.
   */
  #update()
  {
    const scene = SceneManager._scene;

    if (Date.now() - this.#startedAt > this.#config.minutes * 60_000)
    {
      this.#finish('out of time', `still going after ${this.#config.minutes} real minutes`);
      return;
    }

    if (scene === null) return;

    if (scene.constructor.name === 'Scene_Map')
    {
      this.#isOnGameOver = false;
      this.#playMap(scene);
      return;
    }

    if (scene.constructor.name === 'Scene_Gameover') this.#noteGameOver();

    this.#menus.update(scene);
  }

  /**
   * Plays a frame of the map. This list is the bot's priorities, top to bottom.
   * @param {Scene_Map} scene The map scene.
   */
  #playMap(scene)
  {
    // between maps there is nothing to see and nothing to press.
    if (scene.isActive() === false || $gamePlayer.isTransferring()) return;

    this.#watch();
    if (this.#isFinished) return;

    this.#reflexes.look(scene);

    if ($gameMessage.isBusy())
    {
      this.#markProgress();
      this.#talker.update(scene);
      return;
    }

    // hands off during a cutscene: a move route has the character, not the player.
    if ($gameMap.isEventRunning() || $gamePlayer.canMove() === false) return;

    this.#talker.clearMemory();
    this.#takeAction();
  }

  /**
   * Does the next thing a player would do, with the character free to move.
   */
  #takeAction()
  {
    // getting out of the way comes first, and whatever else was going on can wait a second.
    if (this.#reflexes.update()) return;

    this.#decide();

    // and wherever that came to, nobody walks into a telegraph they can see.
    this.#reflexes.review();
  }

  /**
   * Picks the next thing to do with a character that is in no immediate danger.
   */
  #decide()
  {
    // an enemy in the way comes first.
    if (this.#fighter.engage()) return;

    // then everything on this map, and anywhere new.
    if (this.#explorer.update(1)) return;

    // then some rooms do not open until everything in them is dead.
    if (this.#fighter.hunt()) return;

    // then going back the way it came, which may reveal something that changed.
    if (this.#explorer.update(2)) return;

    // the last enemy falling and the door opening are not the same frame, so give the world a moment.
    if (Graphics.frameCount - this.#lastProgressFrame < Brain.PauseFrames) return;

    // then starting over from the top, in case that is what it takes.
    if (this.#explorer.startNextPass()) return;

    // a probe driving the story itself empties rooms and plays long scenes between its steps; a patient run
    // stands and waits for whatever it does next, and only the clock ends it.
    if (this.#config.patient) return;

    this.#finish('stuck', 'every door, event and enemy within reach has been tried, and nothing moved');
  }

  //endregion frame

  //region watching
  /**
   * Takes in everything that may have changed since last frame.
   */
  #watch()
  {
    if (this.#firstMapFrame === -1) this.#firstMapFrame = Graphics.frameCount;

    this.#watchMap();
    if (this.#isFinished) return;

    this.#watchEvents();
    this.#watchTiles();

    if (Graphics.frameCount % Brain.WatchEvery === 0)
    {
      this.#watchWorld();
      this.#watchQuests();
      this.#watchParty();
      this.#watchTally();
    }

    this.#watchPatience();
  }

  /**
   * Takes note of arriving on a new map, which also takes care of the run's one happy ending.
   */
  #watchMap()
  {
    if (this.#shotDueAt !== 0 && Graphics.frameCount >= this.#shotDueAt)
    {
      this.#shotDueAt = 0;
      this.#journal.snap(`map-${this.#mapId}`);
    }

    const mapId = $gameMap.mapId();
    if (mapId === this.#mapId) return;

    this.#mapId = mapId;
    this.#markProgress();
    this.#explorer.onMapEntered(mapId);

    const name = $gameMap.displayName() || $dataMapInfos[mapId].name;
    this.#mapLog.push({ mapId, name, at: Journal.formatFrames(this.#gameFrames()) });
    const health = $gameParty.members()
      .map(member => `${member.name()} ${member.hp}/${member.mhp}`)
      .join(', ');
    this.#journal.note(`arrives: map ${mapId}, ${name} (${health})`);
    this.#shotDueAt = Graphics.frameCount + Brain.ShotDelay;

    if (mapId === Brain.GoalMapId)
    {
      this.#finish('reached the goal', `made it to ${name}`);
    }
  }

  /**
   * Notices an event starting, on the frame the map's interpreter takes it on.
   */
  #watchEvents()
  {
    const isRunning = $gameMap._interpreter.isRunning();

    if (isRunning && this.#wasRunningEvent === false)
    {
      this.#markProgress();
      this.#explorer.onEventStarted($gameMap._interpreter.eventId());
    }

    this.#wasRunningEvent = isRunning;
  }

  /**
   * Counts walking somewhere new as getting somewhere.
   */
  #watchTiles()
  {
    const key = `${this.#mapId}:${$gamePlayer.occupiedTileX()},${$gamePlayer.occupiedTileY()}`;
    if (this.#tilesSeen.has(key)) return;

    this.#tilesSeen.add(key);
    this.#markProgress();
  }

  /**
   * Notices the world changing. Anything that refused the bot before may not anymore, so this is what
   * sends it back to a door it could not get through.
   */
  #watchWorld()
  {
    const selfSwitches = Object.keys($gameSelfSwitches._data).length;
    const mark = `${$gameSwitches._data.map(Number).join('')}:${selfSwitches}`;
    if (mark === this.#worldMark) return;

    this.#worldMark = mark;
    this.#markProgress();
    this.#explorer.onWorldChanged();
  }

  /**
   * Notices the quest log moving, and writes it down.
   */
  #watchQuests()
  {
    const entries = Array.from($gameParty.getQuestopediaEntriesCache().values())
      .filter(quest => quest.objectives.some(objective => objective.state !== 0));

    const mark = entries
      .map(quest => `${quest.key}:${quest.objectives.map(objective => objective.state).join('')}`)
      .join(' ');

    if (mark === this.#questMark) return;

    this.#questMark = mark;
    this.#markProgress();
    this.#journal.note(`quest log: ${mark}`);
  }

  /**
   * Notices party members going down, which is news even when somebody else picks up the fight.
   */
  #watchParty()
  {
    $gameParty.members()
      .forEach(member =>
      {
        const id = member.actorId();
        const isDown = member.isDead();
        const lowest = this.#lowestHealth.get(member.name()) ?? 1;
        this.#lowestHealth.set(member.name(), Math.min(lowest, member.hp / member.mhp));

        if (isDown && this.#fallen.has(id) === false)
        {
          this.#fallen.add(id);
          this.#falls += 1;
          this.#journal.note(`falls: ${member.name()}`);
          this.#journal.snap(`fall-${member.name()}`);
        }

        if (isDown === false) this.#fallen.delete(id);
      });
  }

  /**
   * Counts kills, pages tried and any hit landed on an enemy as getting somewhere.
   */
  #watchTally()
  {
    const me = $jabsEngine.getPlayer1();
    const foeHealth = JABS_AiManager.getOpposingBattlers(me)
      .reduce((total, foe) => total + foe.getBattler().hp, 0);

    const tally = this.#fighter.kills() + this.#explorer.pagesTried();

    if (foeHealth === this.#foeHealth && tally === this.#tally) return;

    this.#foeHealth = foeHealth;
    this.#tally = tally;
    this.#markProgress();
  }

  /**
   * Loses patience with whatever is going on, and then with the whole run.
   */
  #watchPatience()
  {
    const idleFrames = Graphics.frameCount - this.#lastProgressFrame;

    if (idleFrames >= Brain.RestlessFrames && this.#isRestless === false)
    {
      this.#isRestless = true;
      this.#journal.note(`nothing has changed in a while, trying something else; ${Eyes.situation()}`);
      this.#journal.snap('restless');
      this.#explorer.refuseTarget();
    }

    if (idleFrames >= Brain.StuckFrames && this.#config.patient === false)
    {
      this.#finish('stuck', `nothing changed for ${Journal.formatFrames(idleFrames)}; ${Eyes.situation()}`);
    }
  }

  /**
   * Records that something happened.
   */
  #markProgress()
  {
    this.#lastProgressFrame = Graphics.frameCount;
    this.#isRestless = false;
  }

  /**
   * Counts a game over, once per screen, and calls the run if that has happened too many times.
   */
  #noteGameOver()
  {
    if (this.#isOnGameOver) return;

    this.#isOnGameOver = true;
    this.#gameOvers += 1;
    this.#journal.note(`game over, number ${this.#gameOvers}.`);
    this.#journal.snap('game-over');

    // a game over ends the game in memory, so what the bot remembers about the world goes with it.
    this.#mapId = 0;

    if (this.#gameOvers >= Brain.GameOverLimit)
    {
      this.#finish('gave up', `${this.#gameOvers} game overs`);
    }
  }

  /**
   * Decides whether to save when something offers. A save costs a few seconds and a game over costs
   * everything since the last one, so the answer is always yes.
   * @returns {boolean}
   */
  #wantsToSave()
  {
    return true;
  }

  //endregion watching

  //region finishing
  /**
   * Gets how much game has been played, from the moment the first map came up.
   * @returns {number} The frames played.
   */
  #gameFrames()
  {
    return this.#firstMapFrame === -1 ? 0 : Graphics.frameCount - this.#firstMapFrame;
  }

  /**
   * Describes how the party ended up.
   * @returns {{name: string, level: number, hp: number, mhp: number, lowestHealth: string}[]}
   */
  #partySummary()
  {
    return $gameParty.members()
      .map(member =>
      {
        const { level, hp, mhp } = member;
        const name = member.name();
        const lowest = Math.round((this.#lowestHealth.get(name) ?? 1) * 100);

        return { name, level, hp, mhp, lowestHealth: `${lowest}%` };
      });
  }

  /**
   * Ends the run, leaving behind the report and the marker the runner is waiting on.
   * @param {string} outcome How the run ended.
   * @param {string} reason The detail behind it.
   */
  #finish(outcome, reason)
  {
    if (this.#isFinished) return;

    this.#isFinished = true;
    this.#journal.note(`THE END: ${outcome}. ${reason}`);

    // a game that just crashed may not have a picture left to give.
    try
    {
      this.#journal.snap('the-end');
    }
    catch (error)
    {
      this.#journal.note(`no final picture: ${error.message}`);
    }

    this.#journal.writeReport({
      outcome,
      reason,
      gameTime: Journal.formatFrames(this.#gameFrames()),
      realSeconds: Math.round((Date.now() - this.#startedAt) / 1000),
      frames: this.#gameFrames(),
      deaths: this.#falls,
      gameOvers: this.#gameOvers,
      kills: this.#fighter.kills(),
      mapsVisited: this.#explorer.mapsVisited(),
      pagesTried: this.#explorer.pagesTried(),
      saved: this.#menus.hasSave(),
      party: this.#partySummary(),
      maps: this.#mapLog,
      damage: this.#ledger.rows(),
      reflexes: this.#reflexes.report(),
    });

    fs.writeFileSync(this.#config.doneMarker, outcome);
  }

  //endregion finishing
}

export default Brain;
//endregion Brain
