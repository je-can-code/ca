//region Fighter
import Cartographer from './Cartographer.js';
import Eyes from './Eyes.js';
import Thumbs from './Thumbs.js';

/**
 * Decides who to hit and how to get into position to hit them.
 *
 * The first version of this is deliberately not clever: find the nearest thing that can die, stand where
 * the mainhand reaches it, face it, and press the button. It does not guard or use a skill, which makes how
 * it fares a fair measure of the game: if mashing Cross clears a room, that says something about the room.
 * Getting out of the way is not this part's job at all. {@link Reflexes} takes the controls for that, and
 * the fight simply picks up from wherever that left the character.
 *
 * Reach comes from the skill the mainhand actually holds, so one rule serves everybody. A direct skill
 * like Rupert's reaches as far as its proximity and finds its own target, so across a gap the bot just
 * stands on the near side and fires.
 */
class Fighter
{
  /**
   * How far away an enemy has to be before it can be ignored on the way past, in tiles.
   * @type {number}
   */
  static EngageRange = 6;

  /**
   * How much closer than the very limit of a direct skill to stand, given the target is moving.
   * @type {number}
   */
  static DirectReachMargin = 0.5;

  /**
   * How far the bot will walk to reach an enemy it only happened to pass near, in tiles. Something six
   * tiles away as the crow flies can be a long way round through a wall, and is nobody's problem yet.
   * @type {number}
   */
  static EngageWalk = 12;

  /**
   * How many frames a route to a moving target stays worth following before it gets worked out again.
   * @type {number}
   */
  static RouteLifetime = 20;

  /**
   * How many frames to spend turning to face a target before swinging anyway. Pressing into something
   * solid moves nothing, and an unmoved character does not turn.
   * @type {number}
   */
  static TurnPatience = 12;

  /**
   * How many frames a target within reach can go without losing health before something has gone wrong.
   * @type {number}
   */
  static StandoffFrames = 300;

  /**
   * How far past its reach a target still counts as a fight in progress, in tiles. A character pressed up
   * against something it cannot quite reach is as stuck as one swinging at nothing.
   * @type {number}
   */
  static StandoffMargin = 1;

  /**
   * How many tiles to walk away from a standoff.
   * @type {number}
   */
  static SidestepTiles = 3;

  /**
   * How many frames to spend walking away from a standoff.
   * @type {number}
   */
  static SidestepFrames = 45;

  /**
   * The hands doing the pressing.
   * @type {Thumbs}
   */
  #thumbs;

  /**
   * The legs getting into position.
   * @type {Walker}
   */
  #walker;

  /**
   * Where lines go.
   * @type {Journal}
   */
  #journal;

  /**
   * How much of a melee skill's radius to count on.
   * @type {number}
   */
  #meleeReachShare;

  /**
   * The enemy currently being fought.
   * @type {JABS_Battler|null}
   */
  #foe = null;

  /**
   * How many frames the current route has been followed.
   * @type {number}
   */
  #routeAge = 0;

  /**
   * How many frames have been spent trying to turn to face the target.
   * @type {number}
   */
  #turningFor = 0;

  /**
   * How many enemies have fallen to the bot.
   * @type {number}
   */
  #kills = 0;

  /**
   * The target's health at the last look.
   * @type {number}
   */
  #foeHealth = 0;

  /**
   * The frame the target last lost any health.
   * @type {number}
   */
  #lastHitFrame = 0;

  /**
   * How many frames of walking away are left.
   * @type {number}
   */
  #sidesteppingFor = 0;

  /**
   * The last frame this fought, which shows when something else has had the controls in between.
   * @type {number}
   */
  #lastFrame = 0;

  /**
   * @param {Thumbs} thumbs The hands doing the pressing.
   * @param {Walker} walker The legs getting into position.
   * @param {Journal} journal Where lines go.
   * @param {number} meleeReachShare How much of a melee skill's radius to count on.
   */
  constructor(thumbs, walker, journal, meleeReachShare)
  {
    this.#thumbs = thumbs;
    this.#walker = walker;
    this.#journal = journal;
    this.#meleeReachShare = meleeReachShare;
  }

  /**
   * Gets how many enemies have been finished off so far.
   * @returns {number}
   */
  kills()
  {
    return this.#kills;
  }

  /**
   * Gathers everything on the map worth fighting. Inanimate things are scenery with a health bar as far
   * as this is concerned: a fire orb in a corridor is something to walk past.
   * @param {JABS_Battler} me The battler being played.
   * @returns {JABS_Battler[]}
   */
  #foesOf(me)
  {
    return JABS_AiManager.getOpposingBattlers(me)
      .filter(foe => foe.isInanimate() === false && foe.isInvincible() === false && foe.isDead() === false);
  }

  /**
   * Measures the straight line between the battler being played and another.
   * @param {JABS_Battler} me The battler being played.
   * @param {JABS_Battler} foe The other battler.
   * @returns {number} The distance, in tiles.
   */
  #distanceTo(me, foe)
  {
    return Math.hypot(foe.getX() - me.getX(), foe.getY() - me.getY());
  }

  /**
   * Finds the skill the mainhand holds right now.
   * @param {JABS_Battler} me The battler being played.
   * @returns {RPG_Skill}
   */
  #mainhandSkillOf(me)
  {
    return me.getSkill(me.getSkillIdForAction(JABS_Button.Mainhand));
  }

  /**
   * Works out how far away a target can be and still get hit by the mainhand.
   * @param {RPG_Skill} skill The skill the mainhand holds.
   * @returns {number} The reach, in tiles.
   */
  #reachOf(skill)
  {
    if (skill.jabsDirect) return skill.jabsProximity - Fighter.DirectReachMargin;

    return skill.jabsRadius * this.#meleeReachShare;
  }

  /**
   * Finds the direction that faces a target.
   * @param {JABS_Battler} me The battler being played.
   * @param {JABS_Battler} foe The target.
   * @returns {number} One of the engine's four directions.
   */
  #directionTo(me, foe)
  {
    const gapX = foe.getX() - me.getX();
    const gapY = foe.getY() - me.getY();

    if (Math.abs(gapX) > Math.abs(gapY)) return gapX > 0 ? 6 : 4;

    return gapY > 0 ? 2 : 8;
  }

  /**
   * Takes a swing, turning to face the target first if the skill cares about facing.
   * @param {JABS_Battler} me The battler being played.
   * @param {JABS_Battler} foe The target.
   * @param {RPG_Skill} skill The skill the mainhand holds.
   */
  #strike(me, foe, skill)
  {
    const wanted = this.#directionTo(me, foe);
    const isFacing = me.getCharacter()
      .direction() === wanted;

    // a direct skill finds its own target, so which way the caster looks makes no difference.
    if (skill.jabsDirect === false && isFacing === false && this.#turningFor < Fighter.TurnPatience)
    {
      this.#turningFor += 1;
      this.#thumbs.hold(Thumbs.DirectionButtons[wanted]);
      return;
    }

    this.#turningFor = 0;

    // pressing during a cast or a cooldown does nothing except make the journal lie.
    if (me.isCastingOrChanneling() || me.isSkillTypeCooldownReady(JABS_Button.Mainhand) === false) return;

    // the game will not swing with a pedestrian in front of it, so it pays to notice who it thinks that is.
    const refusedBy = Eyes.whatRefusesTheSwing(me);
    if (refusedBy !== '') this.#journal.complain('swing refused by event', refusedBy);

    this.#thumbs.tap('ok');
  }

  /**
   * Notices a fight that has stopped going anywhere, which is a target within reach that has not lost
   * any health in a long while.
   * @param {JABS_Battler} foe The target.
   * @returns {boolean} True if it is time to try something else.
   */
  #isStandoff(foe)
  {
    const { hp } = foe.getBattler();

    if (hp !== this.#foeHealth)
    {
      this.#foeHealth = hp;
      this.#lastHitFrame = Graphics.frameCount;
    }

    return Graphics.frameCount - this.#lastHitFrame >= Fighter.StandoffFrames;
  }

  /**
   * Starts walking away from a target, to the tile a few steps off that puts the most room between them.
   * It is what a person does when their swings stop landing, and being somewhere else clears up whatever
   * was in the way, whether or not anybody knows what that was.
   * @param {JABS_Battler} me The battler being played.
   * @param {JABS_Battler} foe The target.
   */
  #sidestep(me, foe)
  {
    const field = Cartographer.floodFrom(me.getCharacter());
    let best = null;
    let bestRoom = -1;

    field.forEach(tile =>
    {
      const room = Math.hypot(tile.x - foe.getX(), tile.y - foe.getY());
      if (tile.distance <= Fighter.SidestepTiles && room > bestRoom)
      {
        best = tile;
        bestRoom = room;
      }
    });

    this.#journal.note(`standoff with ${foe.getBattler().name()}, stepping away. ${Eyes.fight(me, foe)}`);
    this.#walker.follow(Cartographer.routeTo(best));
    this.#sidesteppingFor = Fighter.SidestepFrames;
    this.#lastHitFrame = Graphics.frameCount;
  }

  /**
   * Finds the closest tile a target can be hit from, by walking distance rather than as the crow flies.
   * That is the whole trick with a target across a gap: the near side of the gap is simply the closest
   * tile within reach. Nothing here has to know there is a gap at all.
   * @param {JABS_Battler} me The battler being played.
   * @param {JABS_Battler} foe The target.
   * @param {number} reach The reach of the mainhand, in tiles.
   * @returns {{x: number, y: number}[]|null} The route to get there, or null if nowhere reaches.
   */
  #routeWithinReach(me, foe, reach)
  {
    const field = Cartographer.floodFrom(me.getCharacter());
    let best = null;

    field.forEach(tile =>
    {
      const isInReach = Math.hypot(tile.x - foe.getX(), tile.y - foe.getY()) <= reach;
      if (isInReach && (best === null || tile.distance < best.distance)) best = tile;
    });

    return best === null ? null : Cartographer.routeTo(best);
  }

  /**
   * Walks towards a target for a frame.
   * @param {JABS_Battler} me The battler being played.
   * @param {JABS_Battler} foe The target.
   * @param {number} reach The reach of the mainhand, in tiles.
   * @param {number} maxWalk The longest walk worth taking, in tiles.
   * @returns {boolean} True if there is a way to get within reach.
   */
  #close(me, foe, reach, maxWalk)
  {
    this.#routeAge += 1;

    if (this.#routeAge >= Fighter.RouteLifetime || this.#routeAge === 1)
    {
      this.#routeAge = 1;

      const route = this.#routeWithinReach(me, foe, reach);
      if (route === null || route.length > maxWalk)
      {
        // nothing was decided on, so the next look at this fight has to start from scratch.
        this.#routeAge = 0;
        return false;
      }

      // already on the closest tile there is, so the rest of the way is a walk straight at them.
      this.#walker.follow(route.length === 0 ? [ { x: foe.getX(), y: foe.getY() } ] : route);
    }

    this.#walker.step();

    return true;
  }

  /**
   * Keeps count of the enemy being fought going down.
   */
  #countKill()
  {
    if (this.#foe === null || this.#foe.isDead() === false) return;

    this.#kills += 1;
    this.#journal.note(`defeats: ${this.#foe.getBattler().name()}`);
    this.#foe = null;
  }

  /**
   * Writes down the start of a new fight.
   * @param {JABS_Battler} foe The enemy being fought now.
   */
  #trackFoe(foe)
  {
    if (foe === this.#foe) return;

    const { hp } = foe.getBattler();
    this.#journal.note(`fights: ${foe.getBattler().name()} (${hp} hp)`);

    this.#foe = foe;
    this.#routeAge = 0;
    this.#turningFor = 0;
    this.#foeHealth = hp;
    this.#lastHitFrame = Graphics.frameCount;
  }

  /**
   * Fights for a frame.
   * @param {number} range How far out to look for somebody to fight.
   * @param {number} maxWalk The longest walk worth taking to reach them, in tiles.
   * @returns {boolean} True if there was somebody to fight, and a way of reaching them.
   */
  #fight(range, maxWalk)
  {
    // somebody else had the controls, so wherever the route was, the player no longer is.
    if (Graphics.frameCount - this.#lastFrame > 1)
    {
      this.#routeAge = 0;
      this.#sidesteppingFor = 0;
    }

    this.#lastFrame = Graphics.frameCount;
    this.#countKill();

    const me = $jabsEngine.getPlayer1();
    const nearby = this.#foesOf(me)
      .map(foe => ({ foe, distance: this.#distanceTo(me, foe) }))
      .filter(({ distance }) => distance <= range)
      .sort((left, right) => left.distance - right.distance);

    if (nearby.length === 0) return false;

    const [ { foe, distance } ] = nearby;
    this.#trackFoe(foe);

    const skill = this.#mainhandSkillOf(me);
    const reach = this.#reachOf(skill);

    if (this.#sidesteppingFor > 0)
    {
      this.#sidesteppingFor -= 1;
      this.#walker.step();
      return true;
    }

    // the clock on a standoff only runs while the two of them are actually in each other's face.
    if (distance > reach + Fighter.StandoffMargin) this.#lastHitFrame = Graphics.frameCount;

    if (this.#isStandoff(foe))
    {
      this.#sidestep(me, foe);
      return true;
    }

    if (distance <= reach)
    {
      this.#strike(me, foe, skill);
      return true;
    }

    return this.#close(me, foe, reach, maxWalk);
  }

  /**
   * Fights whatever has come too close to walk past.
   * @returns {boolean} True if a fight took this frame.
   */
  engage()
  {
    return this.#fight(Fighter.EngageRange, Fighter.EngageWalk);
  }

  /**
   * Goes looking for everything left alive on the map. Some rooms do not open until the last thing in
   * them is dead, and this is what the bot falls back on once it has run out of doors to try.
   * @returns {boolean} True if there was somebody to hunt.
   */
  hunt()
  {
    return this.#fight(Infinity, Infinity);
  }
}

export default Fighter;
//endregion Fighter
