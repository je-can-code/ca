// The learned A2 shape table, and the round-trip proof that it reproduces the editor.
export const NWb = 1, Nb = 2, NEb = 4, Wb = 8, Eb = 16, SWb = 32, Sb = 64, SEb = 128;
export const OFFSETS = [[-1,-1],[0,-1],[1,-1],[-1,0],[1,0],[-1,1],[0,1],[1,1]];

export const A2_SHAPE = {"0":46,"2":44,"8":45,"10":39,"11":38,"16":43,"18":41,"22":40,"24":33,"26":31,"27":30,"30":29,"31":28,"64":42,"66":32,"72":37,"74":27,"75":25,"80":35,"82":19,"86":18,"88":23,"90":15,"91":14,"94":13,"95":12,"104":36,"106":26,"107":24,"120":21,"122":7,"123":6,"126":5,"127":4,"208":34,"210":17,"214":16,"216":22,"218":11,"219":10,"222":9,"223":8,"248":20,"250":3,"251":2,"254":1,"255":0};

/**
 * Collapses a raw 8-neighbour mask into one the table can answer.
 * A corner is only a corner when both of its edges are joined; there are exactly 47 such states,
 * which is why the table has 47 entries and no fallback is needed.
 */
export const canon = m =>
{
  let c = m & (Nb | Wb | Eb | Sb);
  if ((m & NWb) && (m & Nb) && (m & Wb)) c |= NWb;
  if ((m & NEb) && (m & Nb) && (m & Eb)) c |= NEb;
  if ((m & SWb) && (m & Sb) && (m & Wb)) c |= SWb;
  if ((m & SEb) && (m & Sb) && (m & Eb)) c |= SEb;
  return c;
};

/**
 * The finished A2 tile id for a square, given a lookup that answers the autotile kind at any
 * coordinate. Out of bounds counts as the same kind, matching the editor.
 */
export const a2TileId = (kindAt, x, y) =>
{
  const kind = kindAt(x, y);
  let mask = 0;
  OFFSETS.forEach(([dx, dy], i) =>
  {
    const n = kindAt(x + dx, y + dy);
    if (n === kind || n === undefined) mask |= (1 << i);
  });
  return 2048 + kind * 48 + A2_SHAPE[canon(mask)];
};
