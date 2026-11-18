//region Reflexes
/**
 * Keeps the character out of whatever it can see coming.
 *
 * Every attack in this game is meant to be walked out of, so the bot gets exactly the warning a player gets
 * and no more: the telegraphs on the ground and the shots in the air. It reads what is on screen rather than
 * what an enemy has decided, so an attack that hides its telegraph is hidden from the bot too, and a person's
 * reaction time sits between a warning appearing and anything being done about it.
 *
 * "Would that hit me" is never worked out here. The body being asked about is the player with a different
 * position, the hazard is the same stand-in the telegraph was drawn from, and the question goes to the
 * engine's own collision, so the bot's idea of safe cannot drift away from the game's.
 *
 * It walks for as long as walking will do, which is what makes surviving an attack a fair statement about how
 * avoidable that attack is. The dodge button only comes out when the way out takes longer than the attack
 * gives it, and a party with nothing in that slot, which is everybody in the tutorial, has only its feet.
 *
 * It also keeps score per attack, which is the point of having it: how often each one threatened the
 * character, how often it landed anyway, and why. A hit that landed before there was time to react, one with
 * no way out, and one where the walk out takes longer than the attack gave are all statements about the
 * attack. One that had time and got hit anyway is a statement about this file. One that landed while the bot
 * could see it was clear is either a telegraph telling a lie or this file missing by a frame, so it leaves a
 * screenshot behind to settle which.
 */
class Reflexes
{
  /**
   * How a player plays, by name. A reaction is how many frames a warning has to be up before it gets acted
   * on, and scatter is how many more frames that can take on a bad day. Eighteen frames is three tenths of
   * a second, a person paying attention. A statue never reacts at all, and still keeps score.
   *
   * Footwork matters as much as reactions. An enemy only starts a swing once it is close enough, and how far
   * there is to walk once it has depends entirely on where the character was standing, so the reach share
   * is how much of a melee swing's radius gets counted on. Somebody who has learned how far things reach
   * pokes from the tip of their own, and somebody who hasn't walks right up to the target and stays there.
   * @type {Record<string, {reaction: number, scatter: number, meleeReachShare: number}>}
   */
  static Profiles = {
    sharp: { reaction: 18, scatter: 0, meleeReachShare: 0.85 },
    sloppy: { reaction: 18, scatter: 30, meleeReachShare: 0.6 },
    statue: { reaction: Infinity, scatter: 0, meleeReachShare: 0.6 },
  };

  /**
   * The eight ways a d-pad can point: the buttons that do it, and the way that takes the character. A
   * diagonal covers the same ground in a frame as a straight line does, split between the two axes.
   * @type {{buttons: string[], x: number, y: number}[]}
   */
  static Headings = [
    { buttons: [ 'down' ], x: 0, y: 1 },
    { buttons: [ 'left' ], x: -1, y: 0 },
    { buttons: [ 'right' ], x: 1, y: 0 },
    { buttons: [ 'up' ], x: 0, y: -1 },
    { buttons: [ 'down', 'left' ], x: -Math.SQRT1_2, y: Math.SQRT1_2 },
    { buttons: [ 'down', 'right' ], x: Math.SQRT1_2, y: Math.SQRT1_2 },
    { buttons: [ 'up', 'left' ], x: -Math.SQRT1_2, y: -Math.SQRT1_2 },
    { buttons: [ 'up', 'right' ], x: Math.SQRT1_2, y: -Math.SQRT1_2 },
  ];

  /**
   * How many frames of walking one hop of an imagined walk stands for.
   * @type {number}
   */
  static HopFrames = 3;

  /**
   * The most hops worth imagining in any one direction, which is five seconds of walking. That has to outlast
   * the longest wind-up in the game: a character slowed to half speed beside a boss's four second circle needs
   * well over two seconds to walk out of it, and a shorter horizon calls that trapped and stands there.
   * @type {number}
   */
  static MostHops = 100;

  /**
   * How many hops ahead a step gets checked before it is allowed to be taken.
   * @type {number}
   */
  static LookAheadHops = 2;

  /**
   * How close a hit has to be before the dodge button gets pressed, in frames. Pressing as soon as a long
   * wind-up appears would spend the dodge and leave the character standing there when it lands.
   * @type {number}
   */
  static DodgeLeadFrames = 30;

  /**
   * How far past the edge of a hitbox counts as being clear of it, in tiles. Standing exactly on the line
   * leaves the outcome to a single frame of walking.
   * @type {number}
   */
  static ClearanceTiles = 0.1;

  /**
   * How far apart a hitbox gets tested along the path it flies, in tiles, which is one frame of the fastest
   * shots there are. Any further apart and a wide arc leaves gaps a body can sit in.
   * @type {number}
   */
  static StopTiles = 0.25;

  /**
   * How many frames away a shot in the air has to be before it starts to matter. A telegraph promises a
   * whole lane, but a shot is only a problem as it arrives: anyone can cross behind one, and a corridor
   * with a stream of them down it would otherwise never be free.
   * @type {number}
   */
  static ShotWarningFrames = 30;

  /**
   * How many frames in a row a step can be refused before the character gives up waiting. Something sitting
   * on the only way forward has to be run through eventually, and a person would, but this has to outlast
   * the longest wind-up in the game, or it gets bored and strolls into a meteor just as it lands.
   * @type {number}
   */
  static RefusalPatience = 300;

  /**
   * How many frames the character spends ignoring everything once it has given up waiting.
   * @type {number}
   */
  static BraveFrames = 120;

  /**
   * The hands doing the pressing.
   * @type {Thumbs}
   */
  #thumbs;

  /**
   * The legs, which need telling when something else has stopped them.
   * @type {Walker}
   */
  #walker;

  /**
   * Where lines go.
   * @type {Journal}
   */
  #journal;

  /**
   * The name of how this bot reacts.
   * @type {string}
   */
  #profileName;

  /**
   * How this bot reacts.
   * @type {{reaction: number, scatter: number, meleeReachShare: number}}
   */
  #profile;

  /**
   * Everything in view that could hurt, by the action behind it. An attack keeps its one action from its
   * telegraph through to its flight, so one entry follows it the whole way.
   * @type {Map<JABS_Action, object>}
   */
  #hazards = new Map();

  /**
   * The score, one row per attacker and skill.
   * @type {Map<string, object>}
   */
  #attacks = new Map();

  /**
   * The way the character is being steered to get clear, or null when it is not.
   * @type {{buttons: string[], x: number, y: number}|null}
   */
  #heading = null;

  /**
   * How many times the character has set off to get out of the way.
   * @type {number}
   */
  #dodges = 0;

  /**
   * How many times the dodge button has been pressed.
   * @type {number}
   */
  #dodgePresses = 0;

  /**
   * How many steps have been refused over the whole run.
   * @type {number}
   */
  #refusedSteps = 0;

  /**
   * How many frames in a row a step has been refused.
   * @type {number}
   */
  #refusedFor = 0;

  /**
   * The frame the character goes back to caring about any of this.
   * @type {number}
   */
  #braveUntil = 0;

  /**
   * @param {Thumbs} thumbs The hands doing the pressing.
   * @param {Walker} walker The legs.
   * @param {Journal} journal Where lines go.
   * @param {string} profileName How this bot reacts, one of {@link Reflexes.Profiles}.
   */
  constructor(thumbs, walker, journal, profileName)
  {
    this.#thumbs = thumbs;
    this.#walker = walker;
    this.#journal = journal;
    this.#profileName = profileName;
    this.#profile = Reflexes.Profiles[profileName];
  }

  //region seeing
  /**
   * Takes in everything dangerous on screen. This runs whether or not the character can do anything about
   * it yet, because a reaction time starts when a warning appears and not when the hands are free.
   * @param {Scene_Map} scene The map scene.
   */
  look(scene)
  {
    const me = $jabsEngine.getPlayer1();

    this.#seeTelegraphs(scene, me);
    this.#seeShots(me);

    // anything that did not turn up this frame has landed, been interrupted or flown off.
    this.#hazards.forEach((hazard, action) =>
    {
      if (hazard.lastSeen === Graphics.frameCount) return;

      // a wind-up that never became anything was stopped, and stepping away from that is not a dodge.
      if (hazard.hasThreatened && action.getActionSprite() === null) hazard.score.fizzled += 1;

      this.#hazards.delete(action);
    });
  }

  /**
   * Reads the telegraphs off the map. The preview sprites are the telegraphs a player is actually being
   * shown, so a skill that opts out of showing one, or only shows one late, plays fair by simply not
   * being here yet.
   * @param {Scene_Map} scene The map scene.
   * @param {JABS_Battler} me The battler being played.
   */
  #seeTelegraphs(scene, me)
  {
    Object.values(scene._spriteset.castPreviewSprites())
      .forEach(sprite =>
      {
        const standIn = sprite._jabsCastPreviewAction;
        const action = standIn.getJabsAction();
        if (this.#threatens(me, action) === false) return;

        const hazard = this.#sighted(action);
        const tiles = standIn.flightPreviewTiles();

        hazard.way = $jabsEngine.dir8ToUnitVector(action.direction());
        hazard.speed = tiles / Math.min(JABS_CastPreviewAction.FlightPreviewFrames, action.getMaxDuration());
        hazard.stops = this.#stopsAlong(standIn, action, hazard.way, tiles);
        hazard.path = hazard.stops;
        this.#takeStock(hazard);
      });
  }

  /**
   * Reads what is already in the air. Plenty of it never had a telegraph: a trap just fires. Where a shot
   * is going gets read off how it has been moving, which is all anybody watching it has to go on, and
   * covers everything a route can do without needing to know what the route says.
   * @param {JABS_Battler} me The battler being played.
   */
  #seeShots(me)
  {
    $gameMap.actionEvents()
      .forEach(event =>
      {
        const action = event.getJabsAction();
        if (this.#threatens(me, action) === false) return;

        const hazard = this.#sighted(action);
        const stepX = event._realX - (hazard.lastX ?? event._realX);
        const stepY = event._realY - (hazard.lastY ?? event._realY);
        const step = Math.hypot(stepX, stepY);
        hazard.lastX = event._realX;
        hazard.lastY = event._realY;

        // a shot that stops and starts is still going wherever it was going.
        if (step > 0)
        {
          hazard.speed = step;
          hazard.way = { x: stepX / step, y: stepY / step };
        }

        const { way, speed } = hazard;
        const framesLeft = action.getMaxDuration() - action.getDuration();
        const framesAhead = Math.min(Reflexes.ShotWarningFrames, framesLeft);

        hazard.stops = this.#stopsAlong(event, action, way, speed * framesAhead);
        hazard.path = this.#stopsAlong(event, action, way, speed * framesLeft);
        this.#takeStock(hazard);
      });
  }

  /**
   * Determines whether an action is any of this character's business.
   * @param {JABS_Battler} me The battler being played.
   * @param {JABS_Action} action The action to check.
   * @returns {boolean} True if it is aimed at the character's side.
   */
  #threatens(me, action)
  {
    const isFromTheOtherSide = me.isOpposingTeam(action.getCaster()
      .getTeam());

    return isFromTheOtherSide && action.getAction()
      .isForOpponent();
  }

  /**
   * Finds the entry for an action in view, starting one the first time it shows up. That first time is
   * when the clock on reacting to it starts.
   * @param {JABS_Action} action The action in view.
   * @returns {object} The hazard.
   */
  #sighted(action)
  {
    if (this.#hazards.has(action) === false)
    {
      const { reaction, scatter } = this.#profile;

      this.#hazards.set(action, {
        action,
        score: this.#scoreFor(action.getCaster().getBattler().name(), action.getBaseSkill().name),
        noticedAt: Graphics.frameCount + reaction + Math.floor(Math.random() * scatter),
        stops: [],
        path: [],
        way: { x: 0, y: 0 },
        speed: 0,
        coversMe: false,
        hasThreatened: false,
        hasBeenDodged: false,
        isTrapped: false,
        framesNeeded: 0,
        framesGiven: 0,
        lastSeen: 0,
        lastX: null,
        lastY: null,
      });
    }

    const hazard = this.#hazards.get(action);
    hazard.lastSeen = Graphics.frameCount;

    return hazard;
  }

  /**
   * Lays out everywhere a hitbox is going to be over the stretch of its path anyone can see. The first stop
   * is what was passed in. The rest are as much of an action event as collision ever asks for.
   * @param {Game_Event|JABS_CastPreviewAction} start The action event, or the stand-in for one.
   * @param {JABS_Action} action The action itself.
   * @param {{x: number, y: number}} way The way it is headed, as a unit vector.
   * @param {number} distance How far along it to look, in tiles.
   * @returns {object[]} Things collision can test against.
   */
  #stopsAlong(start, action, way, distance)
  {
    const stops = [ start ];
    const originX = start.screenX();
    const originY = start.screenY();
    const tilePx = $gameMap.tileWidth();
    const getJabsAction = () => action;

    for (let tiles = Reflexes.StopTiles; tiles <= distance; tiles += Reflexes.StopTiles)
    {
      const x = originX + (way.x * tiles * tilePx);
      const y = originY + (way.y * tiles * tilePx);

      stops.push({ screenX: () => x, screenY: () => y, getJabsAction });
    }

    return stops;
  }

  /**
   * Determines whether a hitbox reaches a body from any of a list of stops.
   * @param {JABS_Action} action The action behind the hitbox.
   * @param {object[]} stops Where to test it from.
   * @param {Game_Character} body The body.
   * @returns {boolean}
   */
  #reaches(action, stops, body)
  {
    const facing = action.direction();
    const range = action.getCollisionRange();
    const shape = action.getShape();
    const innerRadius = action.getInnerRadius();

    return stops.some(stop => $jabsEngine.isTargetWithinRange(facing, body, stop, range, shape, innerRadius));
  }

  /**
   * Determines whether a hazard is about to reach a body where it stands.
   * @param {object} hazard The hazard.
   * @param {Game_Character} body The body.
   * @returns {boolean}
   */
  #covers(hazard, body)
  {
    return this.#reaches(hazard.action, hazard.stops, body);
  }

  /**
   * Determines whether a hazard reaches a body at any point in the rest of its life. Getting clear of a
   * shot means getting off the line it is flying down: the end of what it is about to reach moves as fast
   * as the shot does, and backing away from it is a race that nobody on foot wins.
   * @param {object} hazard The hazard.
   * @param {Game_Character} body The body.
   * @returns {boolean}
   */
  #everCovers(hazard, body)
  {
    return this.#reaches(hazard.action, hazard.path, body);
  }

  /**
   * Writes down whether a hazard covers the character right now, by the same hurtbox the hit would use.
   * @param {object} hazard The hazard.
   */
  #takeStock(hazard)
  {
    hazard.coversMe = this.#covers(hazard, $gamePlayer);

    if (hazard.coversMe && hazard.hasThreatened === false)
    {
      hazard.hasThreatened = true;
      hazard.score.threatened += 1;
    }
  }

  /**
   * Gathers the hazards the bot has had time to react to.
   * @returns {object[]}
   */
  #noticed()
  {
    if (this.#isBrave()) return [];

    return Array.from(this.#hazards.values())
      .filter(hazard => Graphics.frameCount >= hazard.noticedAt);
  }

  //endregion seeing

  //region walking
  /**
   * Builds an imaginary copy of the player standing where the real one is, to try things out on. It is the
   * player in every way that matters, so walls stop it and hitboxes hit it exactly as they would the real
   * thing, and nothing done to it reaches the real thing.
   * @returns {Game_Player}
   */
  #imaginaryBody()
  {
    const body = Object.create($gamePlayer);
    const tileWidth = $gameMap.tileWidth();
    const tileHeight = $gameMap.tileHeight();
    const clearance = Reflexes.ClearanceTiles * tileWidth;

    // the engine asks a character for its own hurtbox first, and that is where the clearance goes in.
    body.getPixelAbsBattlerAabbModel = () => JABS_Aabb.fromFeet(body.screenX(), body.screenY(), tileWidth, tileHeight)
      .expanded(clearance, clearance);

    // the party is told apart by identity, and a stranger standing on the player would be blocked by the player.
    body.getCollisionCandidates = () => $gamePlayer.getCollisionCandidates();

    return body;
  }

  /**
   * Moves an imaginary body one hop, asking about each axis apart the way the game does, so that a wall only
   * stops the half of a diagonal that runs into it and the rest slides along.
   * @param {Game_Player} body The body.
   * @param {{x: number, y: number}} heading The way to go.
   * @param {number} tiles How far to go.
   * @returns {boolean} True if it got anywhere.
   */
  #hop(body, heading, tiles)
  {
    const stepX = heading.x * tiles;
    const stepY = heading.y * tiles;
    const canGoAcross = stepX !== 0 && body.canPassStraight(stepX > 0 ? 6 : 4, Math.abs(stepX));
    const canGoAlong = stepY !== 0 && body.canPassStraight(stepY > 0 ? 2 : 8, Math.abs(stepY));

    if (canGoAcross === false && canGoAlong === false) return false;

    const x = body.x + (canGoAcross ? stepX : 0);
    const y = body.y + (canGoAlong ? stepY : 0);

    body._x = x;
    body._y = y;
    body._realX = x;
    body._realY = y;

    return true;
  }

  /**
   * Imagines walking one way until the character is clear of everything.
   * @param {{x: number, y: number}} heading The way to go.
   * @param {object[]} hazards What to get clear of.
   * @param {number} mostHops How many hops to give up after.
   * @returns {number} How many hops it took, or Infinity if that way leads nowhere.
   */
  #hopsToClear(heading, hazards, mostHops)
  {
    const body = this.#imaginaryBody();
    const hopTiles = $gamePlayer.distancePerFrame() * Reflexes.HopFrames;

    for (let hops = 1; hops <= mostHops; hops += 1)
    {
      if (this.#hop(body, heading, hopTiles) === false) return Infinity;
      if (hazards.some(hazard => this.#everCovers(hazard, body)) === false) return hops;
    }

    return Infinity;
  }

  /**
   * Finds the quickest way out of everything at once.
   * @param {object[]} hazards What to get clear of.
   * @returns {{heading: {buttons: string[], x: number, y: number}, frames: number}|null} The way to go and how
   * long it takes, or null if no way gets clear.
   */
  #quickestWayOut(hazards)
  {
    // the way it is already going is asked first, so that a tie keeps it walking instead of dithering.
    const headings = this.#heading === null ? Reflexes.Headings : [ this.#heading, ...Reflexes.Headings ];
    let fewestHops = Reflexes.MostHops + 1;
    let best = null;

    headings.forEach(heading =>
    {
      const hops = this.#hopsToClear(heading, hazards, fewestHops - 1);
      if (hops < fewestHops)
      {
        fewestHops = hops;
        best = heading;
      }
    });

    return best === null ? null : { heading: best, frames: fewestHops * Reflexes.HopFrames };
  }

  /**
   * Gets out of the way, if there is anything to get out of the way of. Standing clear of a telegraph that
   * was never going to hit is not a reason to do anything, so a miss causes no twitching at all.
   * @returns {boolean} True if that took this frame.
   */
  update()
  {
    const me = $jabsEngine.getPlayer1();

    // a dodge has the character until it is over, and nothing pressed in the meantime changes that.
    if (me.isDodging()) return true;

    const body = this.#imaginaryBody();
    const noticed = this.#noticed();
    const covering = noticed.filter(hazard => this.#covers(hazard, body));
    const wayOut = covering.length === 0 ? null : this.#quickestWayOut(noticed);

    if (covering.length > 0 && this.#shouldPressDodge(me, covering, wayOut))
    {
      this.#pressDodge(covering, wayOut);
      return true;
    }

    // with nowhere safe in reach there is nothing to gain by stopping, so whatever was going on carries on.
    if (wayOut === null)
    {
      covering.forEach(hazard =>
      {
        hazard.isTrapped = true;
      });

      this.#heading = null;
      return false;
    }

    this.#countDodges(covering, wayOut.frames);
    this.#heading = wayOut.heading;
    wayOut.heading.buttons.forEach(button => this.#thumbs.hold(button));
    this.#walker.dashIfSafe();

    return true;
  }

  /**
   * Decides whether this is the moment for the dodge button: there is one to press, the hit is close, and
   * walking will not get there first. In combat is the only place that button means dodge at all.
   * @param {JABS_Battler} me The battler being played.
   * @param {object[]} covering The hazards covering the character.
   * @param {{frames: number}|null} wayOut The quickest walk out, or null if there isn't one.
   * @returns {boolean}
   */
  #shouldPressDodge(me, covering, wayOut)
  {
    const battler = me.getBattler();
    const skillId = battler.getResolvedSkillId(JABS_Button.Dodge);

    if (!skillId || me.isInCombat() === false) return false;
    if (me.isSkillTypeCooldownReady(JABS_Button.Dodge) === false) return false;
    if (battler.canPaySkillCost(me.getSkill(skillId)) === false) return false;

    const soonest = Math.min(...covering.map(hazard => this.#framesUntilItLands(hazard)));
    if (soonest > Reflexes.DodgeLeadFrames) return false;

    return wayOut === null || wayOut.frames > soonest;
  }

  /**
   * Presses the dodge button, pointing the d-pad at the way out so that a dodge that goes where it is pushed
   * goes somewhere useful. One that goes forward or backward does what it was always going to.
   * @param {object[]} covering The hazards covering the character.
   * @param {{heading: {buttons: string[]}, frames: number}|null} wayOut The quickest walk out, if there is one.
   */
  #pressDodge(covering, wayOut)
  {
    this.#countDodges(covering, wayOut === null ? Infinity : wayOut.frames);
    this.#dodgePresses += 1;
    this.#journal.note(`presses dodge against: ${this.#describe(covering)}`);

    if (wayOut !== null) wayOut.heading.buttons.forEach(button => this.#thumbs.hold(button));

    this.#thumbs.tap('shift');
  }

  /**
   * Counts the attacks being stepped out of, each one only the once however long getting clear takes, and
   * writes down whether there was time. That is the moment the verdict on a hit gets decided.
   * @param {object[]} hazards The hazards covering the character.
   * @param {number} framesNeeded How long getting clear of them is going to take.
   */
  #countDodges(hazards, framesNeeded)
  {
    const fresh = hazards.filter(hazard => hazard.hasBeenDodged === false);
    if (fresh.length === 0) return;

    fresh.forEach(hazard =>
    {
      hazard.hasBeenDodged = true;
      hazard.framesNeeded = framesNeeded;
      hazard.framesGiven = this.#framesUntilItLands(hazard);
    });

    this.#dodges += fresh.length;
    this.#journal.note(`steps out of: ${this.#describe(fresh)}`);
  }

  /**
   * Works out how long a hazard takes to reach the character where it stands: whatever is left of its
   * wind-up, and then however long it has to fly.
   * @param {object} hazard The hazard.
   * @returns {number} The frames, which is 0 for something that can land right now.
   */
  #framesUntilItLands({ action, stops, speed })
  {
    const windUp = action.getActionSprite() === null ? action.getCaster()
      .getCastTimeCountdown() : 0;

    if (speed === 0) return windUp;

    const stopsAway = stops.findIndex(stop => this.#reaches(action, [ stop ], $gamePlayer));

    return windUp + ((Math.max(stopsAway, 0) * Reflexes.StopTiles) / speed);
  }

  /**
   * Determines whether walking on the way the d-pad is pushed would take the character into something it
   * can see. A character already standing in something is not asked, because with nowhere better to be
   * no step is any worse than another.
   * @param {{x: number, y: number}} pushed The way the d-pad is pushed.
   * @returns {boolean}
   */
  #isWalkingIntoTrouble({ x, y })
  {
    const hazards = this.#noticed();
    const body = this.#imaginaryBody();
    if (hazards.some(hazard => this.#covers(hazard, body))) return false;

    const heading = Reflexes.Headings.find(({ x: wayX, y: wayY }) => Math.sign(wayX) === x && Math.sign(wayY) === y);
    this.#hop(body, heading, $gamePlayer.distancePerFrame() * Reflexes.HopFrames * Reflexes.LookAheadHops);

    return hazards.some(hazard => this.#covers(hazard, body));
  }

  /**
   * Checks where the rest of the bot has decided to walk this frame, and takes its thumb off the d-pad if
   * that leads into something it can see. It is what stops the fight dragging it into a telegraph in the
   * middle of closing the distance, which covers everything that walks without any of it having to know.
   */
  review()
  {
    const pushed = this.#thumbs.pushed();
    const isPushed = pushed.x !== 0 || pushed.y !== 0;

    if (isPushed === false || this.#isBrave()) return;

    if (this.#isWalkingIntoTrouble(pushed) === false)
    {
      this.#refusedFor = 0;
      return;
    }

    this.#thumbs.releaseDirections();
    this.#walker.excuse();
    this.#refusedFor += 1;
    this.#refusedSteps += 1;

    if (this.#refusedFor < Reflexes.RefusalPatience) return;

    this.#journal.note(`gets tired of waiting and goes for it: ${this.#describe(this.#noticed())}`);
    this.#refusedFor = 0;
    this.#braveUntil = Graphics.frameCount + Reflexes.BraveFrames;
  }

  /**
   * Determines whether the character has given up waiting and is ignoring everything for a while.
   * @returns {boolean}
   */
  #isBrave()
  {
    return Graphics.frameCount < this.#braveUntil;
  }

  //endregion walking

  //region scoring
  /**
   * Finds or starts the score for an attack.
   * @param {string} attacker Who attacks with it.
   * @param {string} skill The attack.
   * @returns {object} The row.
   */
  #scoreFor(attacker, skill)
  {
    const key = `${attacker}|${skill}`;

    if (this.#attacks.has(key) === false)
    {
      this.#attacks.set(key, {
        attacker,
        skill,
        threatened: 0,
        fizzled: 0,
        hits: 0,
        tooSoon: 0,
        noWayOut: 0,
        outrun: 0,
        brave: 0,
        blown: 0,
        unwarned: 0,
        whileClear: 0,
      });
    }

    return this.#attacks.get(key);
  }

  /**
   * Scores something landing on the character being played. With nothing in view from that attacker the
   * hit came without any warning, which is worth counting, and is how an aura is supposed to work. Having
   * seen it and been clear of it is the thing a player would be right to complain about, so it gets
   * complained about. Otherwise it was seen and stood in, and the question is why.
   * @param {Game_Action} action The action that was applied.
   * @param {Game_Battler} target Who it was applied to.
   */
  onHit(action, target)
  {
    const subject = action.subject();
    const isOnMe = target === $jabsEngine.getPlayer1()
      .getBattler();
    if (isOnMe === false || subject.isEnemy() === false || target.result().isHit() === false) return;

    const score = this.#scoreFor(subject.name(), action.item().name);
    score.hits += 1;

    const sightings = Array.from(this.#hazards.values())
      .filter(hazard => hazard.score === score);

    if (sightings.length === 0)
    {
      score.unwarned += 1;
      return;
    }

    const { x, y } = $gamePlayer;
    const place = `at ${x.toFixed(2)},${y.toFixed(2)}`;
    const name = `${subject.name()}'s ${action.item().name}`;
    const standingIn = sightings.find(hazard => hazard.coversMe);

    if (standingIn !== undefined)
    {
      const { framesNeeded, framesGiven } = standingIn;
      const verdict = this.#verdictOn(standingIn);

      score[verdict] += 1;
      this.#journal.note(`hit by ${name} ${place}: ${verdict}, needed ${framesNeeded} frames, had ${framesGiven}`);
      return;
    }

    score.whileClear += 1;
    this.#journal.complain('hit while clear', `${name} ${place}`);
    this.#journal.snap('hit-while-clear');
  }

  /**
   * Decides why a hazard the character was standing in landed anyway. Most of these say something about the
   * attack: it was over before anyone could react, nowhere within two seconds of walking was clear of it,
   * or the way out took longer than the attack allowed. Brave is the character having given up on waiting.
   * The last one had time and still got hit, and that says something about this file.
   * @param {object} hazard The hazard that landed.
   * @returns {'tooSoon'|'noWayOut'|'outrun'|'brave'|'blown'} The column of the score it belongs in.
   */
  #verdictOn({ hasBeenDodged, isTrapped, framesNeeded, framesGiven })
  {
    if (this.#isBrave()) return 'brave';
    if (hasBeenDodged === false) return isTrapped ? 'noWayOut' : 'tooSoon';

    return framesNeeded > framesGiven ? 'outrun' : 'blown';
  }

  /**
   * Names what is being stepped out of, for the journal.
   * @param {object[]} hazards The hazards.
   * @returns {string}
   */
  #describe(hazards)
  {
    return hazards
      .map(({ score: { attacker, skill } }) => `${attacker}'s ${skill}`)
      .join(', ');
  }

  /**
   * Sums up the run.
   * @returns {{profile: string, walkTilesPerFrame: number, dodges: number, dodgePresses: number,
   * refusedSteps: number, hitsWhileClear: number, attacks: object[]}}
   */
  report()
  {
    const attacks = Array.from(this.#attacks.values())
      .sort((left, right) => right.threatened - left.threatened);

    return {
      profile: this.#profileName,
      walkTilesPerFrame: $gamePlayer.distancePerFrame(),
      dodges: this.#dodges,
      dodgePresses: this.#dodgePresses,
      refusedSteps: this.#refusedSteps,
      hitsWhileClear: attacks.reduce((total, { whileClear }) => total + whileClear, 0),
      attacks,
    };
  }

  //endregion scoring
}

export default Reflexes;
//endregion Reflexes
