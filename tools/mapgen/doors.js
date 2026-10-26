//region doors
/**
 * The doors between drafted maps, in Jeremy's format, shared by every dungeon recipe that writes them.
 *
 * A recipe's link table names both doorways of every door. Each side has `at`, the top-left square of its
 * opening, one in from the map's edge; `span`, the opening's width and height; and `dir`, the way the player
 * faces on arrival, which always points into the map. The transfer event stands at `at`, and an
 * `<areaEvent:[W,H]>` page comment (J-Pixelistics) stretches it across the whole opening, so nobody has to
 * walk into the exact centre of a three-wide door. The landing square is the middle of the opening, one step
 * further in, so the door never fires again on arrival. A `silent` side is a doorway the recipe does not
 * write, because it is Jeremy's to place.
 */
import { transferEvent } from './terrain.js';

/**
 * How far into a map the landing square sits from its doorway, by arrival facing.
 * @type {Object<number, number[]>}
 */
const DELTA = { 2: [ 0, 1 ], 4: [ -1, 0 ], 6: [ 1, 0 ], 8: [ 0, -1 ] };

/**
 * Each arrival facing's opposite: down and up, left and right.
 * @type {Object<number, number>}
 */
const OPPOSITE = { 2: 8, 4: 6, 6: 4, 8: 2 };

/**
 * Where a player arriving through a doorway lands: the middle of its opening, one step further in.
 * @param {{at: number[], span: number[], dir: number}} side One side of a link.
 * @returns {number[]}
 */
const landingOf = side =>
{
  const [ dx, dy ] = DELTA[side.dir];
  const middleX = side.at[0] + Math.floor(side.span[0] / 2);
  const middleY = side.at[1] + Math.floor(side.span[1] / 2);
  return [ middleX + dx, middleY + dy ];
};

/**
 * A doorway's transfer event, stretched across its opening the way Jeremy's converted Nimbus doors are:
 * the area comment leads the page, ahead of the sound and the transfer.
 * @param {number} id The event id.
 * @param {{name: string, x: number, y: number, span: number[], to: Object}} exit The doorway.
 * @returns {Object}
 */
const doorEvent = (id, exit) =>
{
  const event = transferEvent(id, exit.name, exit.x, exit.y, exit.to);
  const area = { code: 108, indent: 0, parameters: [ `<areaEvent:[${exit.span[0]},${exit.span[1]}]>` ] };
  event.pages[0].list.unshift(area);
  return event;
};

/**
 * Builds the door helpers for one recipe's link table.
 * @param {{a: Object, b: Object}[]} links Every doorway pair the recipe draws.
 * @param {function(number): string} nameOf The tree name of any map, drafted or shipped, for naming the doors
 * that lead to it.
 * @param {Set<number>} handedOver Drafted maps Jeremy has taken over to polish; their halves of any door are
 * his to place, exactly like a `silent` side.
 * @returns {{proveLinksKeepHeading: function(): void, exitsFor: function(number): Object[],
 * doorSquaresOf: function(number): number[][]}}
 */
const doorsFor = (links, nameOf, handedOver) =>
{
  /**
   * Proves every link keeps the player heading the way they were walking. You leave through a doorway by
   * walking against the way you arrive at it, so the far side has to arrive facing the opposite way: out
   * through the right side of one map, in on the left of the next, still facing right. A link that turns
   * the player around means that holding the key they walked out with carries them straight back through
   * the door, over and over, which is Jeremy's "one major peeve" about maps. A link that turns them
   * sideways breaks the same expectation, so both stop the run.
   */
  const proveLinksKeepHeading = () =>
  {
    links.forEach(link =>
    {
      if (OPPOSITE[link.a.dir] !== link.b.dir)
      {
        throw new Error(`Map${link.a.map} <-> Map${link.b.map}: walking out of one door would not keep the player's heading`);
      }
    });
  };

  /**
   * Every doorway the recipe writes on one map, each with the square it lands on at the other end.
   * @param {number} id The map id.
   * @returns {{name: string, x: number, y: number, span: number[], to: {map: number, x: number, y: number, dir: number}}[]}
   */
  const exitsFor = id =>
  {
    const exits = [];
    links.forEach(link =>
    {
      [ [ link.a, link.b ], [ link.b, link.a ] ].forEach(([ self, other ]) =>
      {
        if (self.map !== id || self.silent || handedOver.has(self.map))
        {
          return;
        }

        const [ toX, toY ] = landingOf(other);
        exits.push({
          name: `Transfer (${nameOf(other.map)})`,
          x: self.at[0],
          y: self.at[1],
          span: self.span,
          to: { map: other.map, x: toX, y: toY, dir: other.dir },
        });
      });
    });

    return exits;
  };

  /**
   * Every square a map's links need to stand on: the whole opening of each of its doorways, and the
   * landing square that arrives through it.
   * @param {number} id The map id.
   * @returns {number[][]}
   */
  const doorSquaresOf = id =>
  {
    const squares = [];
    links.forEach(link =>
    {
      [ link.a, link.b ].forEach(side =>
      {
        if (side.map !== id)
        {
          return;
        }

        for (let y = side.at[1]; y < side.at[1] + side.span[1]; y++)
        {
          for (let x = side.at[0]; x < side.at[0] + side.span[0]; x++)
          {
            squares.push([ x, y ]);
          }
        }

        squares.push(landingOf(side));
      });
    });

    return squares;
  };

  return { proveLinksKeepHeading, exitsFor, doorSquaresOf };
};

export { landingOf, doorEvent, doorsFor };
//endregion doors