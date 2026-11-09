//region Explorer
import Cartographer from './Cartographer.js';
import Eyes from './Eyes.js';
import Thumbs from './Thumbs.js';

/**
 * Decides where to go next, the way a lost player does: walk up to everything, try every door.
 *
 * The quest log cannot steer this. Nearly every objective in the game is advanced by an event rather
 * than described by a location, so there are no coordinates to read. What the map does have is its
 * events, and an event's active page is a precise statement of what is on offer right now. So the bot
 * keeps a list of the pages it has tried, and a new page appearing is how it notices the world moved.
 *
 * Trying everything has a pleasant side effect. If every door has been tried, every page poked and
 * everything killed, and nothing moved, then a player could be stuck there too, and that is a bug report.
 */
class Explorer
{
  /**
   * How many frames to spend pushing against something solid at the end of a route. Reaching a tile next
   * to an event leaves a gap of nearly half a tile, and closing it is what turns the character to face it.
   * @type {number}
   */
  static BumpFrames = 24;

  /**
   * How many frames to wait around at a target for something to happen before calling it a dud.
   * @type {number}
   */
  static SettleFrames = 45;

  /**
   * How many times something else can interrupt the walk to a target before it counts as refused.
   * @type {number}
   */
  static Patience = 2;

  /**
   * How many times a route to a target can stall before it counts as refused.
   * @type {number}
   */
  static StallLimit = 3;

  /**
   * How many complete passes over every door on the way to calling the bot stuck. Doors are only tried
   * once a pass, and the second pass exists for maps whose doors changed meaning behind the bot's back.
   * @type {number}
   */
  static PassLimit = 2;

  /**
   * The hands doing the pressing.
   * @type {Thumbs}
   */
  #thumbs;

  /**
   * The legs doing the walking.
   * @type {Walker}
   */
  #walker;

  /**
   * Where lines go.
   * @type {Journal}
   */
  #journal;

  /**
   * The event pages that have been tried and have nothing further to say.
   * @type {Set<string>}
   */
  #settled = new Set();

  /**
   * The event pages that would not let the bot near them, tried again when the world changes.
   * @type {Set<string>}
   */
  #refused = new Set();

  /**
   * How many times each target has been interrupted or stalled on.
   * @type {Map<string, number>}
   */
  #attempts = new Map();

  /**
   * The maps that have been stood on.
   * @type {Set<number>}
   */
  #visited = new Set();

  /**
   * What is being walked towards.
   * @type {object|null}
   */
  #target = null;

  /**
   * Which part of reaching the target this is.
   * @type {'walking'|'finishing'}
   */
  #phase = 'walking';

  /**
   * How many frames have been spent on the finishing part.
   * @type {number}
   */
  #finishingFor = 0;

  /**
   * The last frame this walked, which shows when something else has had the controls in between.
   * @type {number}
   */
  #lastFrame = 0;

  /**
   * How many full passes over every door have been made.
   * @type {number}
   */
  #passes = 1;

  /**
   * How many event pages have been tried over the whole run.
   * @type {number}
   */
  #pagesTried = 0;

  /**
   * @param {Thumbs} thumbs The hands doing the pressing.
   * @param {Walker} walker The legs doing the walking.
   * @param {Journal} journal Where lines go.
   */
  constructor(thumbs, walker, journal)
  {
    this.#thumbs = thumbs;
    this.#walker = walker;
    this.#journal = journal;
  }

  /**
   * Gets how many maps have been stood on.
   * @returns {number}
   */
  mapsVisited()
  {
    return this.#visited.size;
  }

  /**
   * Gets how many event pages have been tried, which is one of the ways progress gets measured.
   * @returns {number}
   */
  pagesTried()
  {
    return this.#pagesTried;
  }

  //region world
  /**
   * Takes note of arriving on a map, dropping whatever was being walked towards on the last one.
   * @param {number} mapId The map arrived on.
   */
  onMapEntered(mapId)
  {
    this.#visited.add(mapId);
    this.#target = null;
  }

  /**
   * Takes note of the world having changed, which is the moment anything that refused the bot is worth
   * another go: a door that was sealed may well not be anymore.
   */
  onWorldChanged()
  {
    this.#refused.clear();
    this.#attempts.clear();
    this.#passes = 1;
  }

  /**
   * Takes note of an event starting. If it is the one being walked to then that target is done. If it
   * is any other, then something got in the way, which is how a door guarded by a "turn back" trigger
   * ends up refused instead of being walked into forever.
   * @param {number} eventId The event that started.
   */
  onEventStarted(eventId)
  {
    if (this.#target === null) return;

    if (eventId === this.#target.eventId)
    {
      this.#settle();
      return;
    }

    this.#countAttempt();
  }

  /**
   * Gives up on the current target until the world changes.
   */
  refuseTarget()
  {
    if (this.#target === null) return;

    this.#journal.note(`gives up on: ${this.#target.name}`);
    this.#refused.add(this.#target.key);
    this.#target = null;
  }

  /**
   * Starts another pass over the doors, for when the map has nothing left and neither does the bot.
   * @returns {boolean} True if there is a pass left to make.
   */
  startNextPass()
  {
    if (this.#passes >= Explorer.PassLimit) return false;

    this.#passes += 1;
    this.#settled.clear();
    this.#refused.clear();
    this.#attempts.clear();
    this.#journal.note(`nothing left, starting pass ${this.#passes} over everything.`);

    return true;
  }

  /**
   * Marks the current target as done with.
   */
  #settle()
  {
    this.#settled.add(this.#target.key);
    this.#pagesTried += 1;
    this.#target = null;
  }

  /**
   * Counts a failed attempt at the current target, refusing it once patience has run out.
   */
  #countAttempt()
  {
    const { key } = this.#target;
    const attempts = (this.#attempts.get(key) ?? 0) + 1;
    this.#attempts.set(key, attempts);

    if (attempts >= Explorer.Patience) this.refuseTarget();
  }

  //endregion world

  //region choosing
  /**
   * Finds the map a page's transfer leads to, if it has one. A transfer back onto the same map is just
   * how a cutscene repositions somebody, so that does not make an event a door.
   * @param {Game_Event} event The event to read.
   * @returns {number} The destination map id, or 0 if the page is not a door.
   */
  #doorDestinationOf(event)
  {
    const transfer = event.list()
      .find(command => command.code === 201);

    if (transfer === undefined) return 0;

    const [ designation, mapId ] = transfer.parameters;

    // a destination held in a variable can only be found out by going.
    if (designation !== 0) return -1;

    return mapId === $gameMap.mapId() ? 0 : mapId;
  }

  /**
   * Determines whether an event's page has anything on it for a player to set off. A torch is an event
   * too, and a page holding nothing but comments has never had anything to say.
   * @param {Game_Event} event The event to read.
   * @returns {boolean}
   */
  #hasContent(event)
  {
    const silentCodes = [ 0, 108, 408 ];

    return event.list()
      .some(command => silentCodes.includes(command.code) === false);
  }

  /**
   * Describes an event as something to go and try, if it is one.
   * @param {Game_Event} event The event to read.
   * @returns {object|null} The candidate, or null if there is nothing here to try.
   */
  #describe(event)
  {
    if (event.isErased() || event.page() === undefined) return null;

    // enemies are the fighter's business, and what a battle leaves lying around is nobody's.
    if (event.isJabsBattler() || event.isJabsAction() || event.isJabsLoot()) return null;

    // autorun and parallel pages start themselves, so walking up to them does nothing.
    if (event.isTriggerIn([ 0, 1, 2 ]) === false || this.#hasContent(event) === false) return null;

    const key = `${$gameMap.mapId()}:${event.eventId()}:${event._pageIndex}`;
    if (this.#settled.has(key) || this.#refused.has(key)) return null;

    const name = event.event().name;
    const eventId = event.eventId();
    const destination = this.#doorDestinationOf(event);
    const isAction = event.isTriggerIn([ 0 ]);

    return { event, eventId, key, name, destination, isAction, rank: this.#rankOf(destination) };
  }

  /**
   * Ranks a candidate. Anything on this map comes before leaving it, and a door somewhere new comes
   * before a door back to somewhere already seen, which is what makes the bot press forward.
   * @param {number} destination The map a door leads to, or 0 if it is not a door.
   * @returns {number} The rank, lowest first.
   */
  #rankOf(destination)
  {
    if (destination === 0) return 0;

    return this.#visited.has(destination) ? 2 : 1;
  }

  /**
   * Works out how to reach a candidate: standing on it if it can be stood on, otherwise pushing into it
   * from next door. An event's area can cover many tiles, and the nearest one is as good as any.
   * @param {object} candidate The candidate to reach.
   * @param {Map<string, object>} field The floor as flooded from where the player stands.
   * @returns {{tile: object, bump: number}|null} Where to go, or null if it cannot be reached.
   */
  #approachTo(candidate, field)
  {
    const { left, top, width, height } = candidate.event.areaBounds();
    let onto = null;
    let beside = null;

    for (let y = top; y < top + height; y += 1)
    {
      for (let x = left; x < left + width; x += 1)
      {
        const tile = field.get(Cartographer.keyOf(x, y));
        if (tile !== undefined && (onto === null || tile.distance < onto.tile.distance))
        {
          onto = { tile, bump: 0 };
        }

        Cartographer.Steps.forEach(step =>
        {
          const neighbor = field.get(Cartographer.keyOf(x - step.x, y - step.y));
          if (neighbor !== undefined && (beside === null || neighbor.distance < beside.tile.distance))
          {
            beside = { tile: neighbor, bump: step.direction };
          }
        });
      }
    }

    return onto ?? beside;
  }

  /**
   * Picks what to go and try next.
   * @param {number} maxRank The highest rank allowed.
   * @returns {object|null} The target with its approach worked out, or null if nothing qualifies.
   */
  #pick(maxRank)
  {
    const field = this.#floodFromPlayer();

    const options = $gameMap.events()
      .map(event => this.#describe(event))
      .filter(candidate => candidate !== null && candidate.rank <= maxRank)
      .map(candidate => ({ ...candidate, approach: this.#approachTo(candidate, field) }))
      .filter(candidate => candidate.approach !== null)
      .sort((left, right) => left.rank - right.rank || left.approach.tile.distance - right.approach.tile.distance);

    return options[0] ?? null;
  }

  /**
   * Floods the floor from where the player stands.
   * @returns {Map<string, object>}
   */
  #floodFromPlayer()
  {
    return Cartographer.floodFrom($gamePlayer);
  }

  /**
   * Starts walking to the current target, working the route out from scratch.
   * @returns {boolean} True if there is still a way to reach it.
   */
  #setOff()
  {
    const approach = this.#approachTo(this.#target, this.#floodFromPlayer());

    if (approach === null) return false;

    this.#target.approach = approach;
    this.#walker.follow(Cartographer.routeTo(approach.tile));
    this.#phase = 'walking';
    this.#finishingFor = 0;

    return true;
  }

  //endregion choosing

  //region walking
  /**
   * Finishes up at a target: pushes into it if it is solid, and presses the button if it wants one.
   * Waits a little before calling it a dud, since some events take a moment to get going.
   */
  #finish()
  {
    this.#finishingFor += 1;

    const { approach: { bump }, isAction } = this.#target;

    if (bump !== 0 && this.#finishingFor < Explorer.BumpFrames)
    {
      this.#thumbs.hold(Thumbs.DirectionButtons[bump]);
    }

    if (isAction && this.#finishingFor % Explorer.BumpFrames === 0)
    {
      this.#thumbs.tap('ok');
    }

    if (this.#finishingFor >= Explorer.BumpFrames + Explorer.SettleFrames)
    {
      this.#journal.note(`nothing happened at: ${this.#target.name}`);
      this.#settle();
    }
  }

  /**
   * Walks towards the current target for a frame.
   */
  #walk()
  {
    const status = this.#walker.step();

    if (status === 'arrived')
    {
      this.#phase = 'finishing';
      return;
    }

    if (status === 'stalled')
    {
      this.#journal.note(`stalled on the way to: ${this.#target.name}; ${Eyes.situation()}`);

      const { key } = this.#target;
      const attempts = (this.#attempts.get(key) ?? 0) + 1;
      this.#attempts.set(key, attempts);

      if (attempts >= Explorer.StallLimit || this.#setOff() === false) this.refuseTarget();
    }
  }

  /**
   * Explores for a frame.
   * @param {number} maxRank The highest rank of target to consider: 1 stays on this map or pushes on to
   * somewhere new, and 2 also allows going back.
   * @returns {boolean} True if there was something to do.
   */
  update(maxRank)
  {
    const wasInterrupted = Graphics.frameCount - this.#lastFrame > 1;
    this.#lastFrame = Graphics.frameCount;

    // somebody else had the controls, so wherever the route was, the player no longer is.
    if (this.#target !== null && wasInterrupted && this.#setOff() === false)
    {
      this.refuseTarget();
    }

    if (this.#target === null)
    {
      this.#target = this.#pick(maxRank);

      if (this.#target === null) return false;

      const { name, destination } = this.#target;
      const heading = destination === 0 ? '' : ` (door to map ${destination})`;
      this.#journal.note(`heads for: ${name}${heading}`);
      this.#setOff();
    }

    if (this.#phase === 'finishing')
    {
      this.#finish();
    }
    else
    {
      this.#walk();
    }

    return true;
  }

  //endregion walking
}

export default Explorer;
//endregion Explorer
