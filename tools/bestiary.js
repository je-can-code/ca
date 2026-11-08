/**
 * bestiary — read the shipped enemy placements and say who lives where, and at what level.
 *
 * The bands are design, so they live in the table in docs/maps/progression-bands.md and this reads
 * them from there. Everything else is derived from `chef-adventure/data/`. No roster is written down
 * anywhere, because a roster in a doc is a second source of truth that goes stale the moment an enemy
 * moves. If the bestiary says something is true, the data said it first.
 *
 * Usage:
 *   bun tools/bestiary.js
 *   bun tools/bestiary.js first
 *   bun tools/bestiary.js line <name or id>
 *
 * See docs/maps/progression-bands.md for what each subcommand answers.
 */

const DATA_DIR = `${import.meta.dir}/../chef-adventure/data`;
const BANDS_DOC = `${import.meta.dir}/../docs/maps/progression-bands.md`;
const BANDS_HEADING = '## The bands, in play order';
const COMMENT_CODES = new Set([ 108, 408 ]);
const PLUGIN_COMMAND = 357;

// a line is ten rows: its five tiers, then room for named, of which only the last slot is used.
const LINE_ROWS = 10;
const TIERS = 5;
const NAMED_SLOT = 10;
const FIRST_LINE = 101;
const LAST_LINE = 571;

// this block holds the elemental bosses, not a ladder.
const NOT_A_LINE = 551;

// chapter 4 onward is a parallel set rather than a sequence, so nobody can be said to arrive there "first".
const LAST_ORDERED_CHAPTER = 3;

//region data loading

const infos = JSON.parse(await Bun.file(`${DATA_DIR}/MapInfos.json`).text());
const enemies = JSON.parse(await Bun.file(`${DATA_DIR}/Enemies.json`).text());
const infoById = new Map(infos.filter(info => info).map(info => [ info.id, info ]));

/**
 * Reads the band table out of the doc that owns it, in play order. A row's last column is where the
 * area sits in the map tree: a folder or map id, plus `from lvN` when two visits to the same maps are
 * told apart by level.
 * @returns {Promise<{label: string, band: string, chapter: number, root: number, from: number}[]>}
 */
const readAreas = async () =>
{
  const lines = (await Bun.file(BANDS_DOC).text()).split('\n');
  const heading = lines.indexOf(BANDS_HEADING);
  if (heading < 0) throw new Error(`no "${BANDS_HEADING}" section in ${BANDS_DOC}`);

  // the table runs to the first line that isn't one, and its first two lines are the header and rule.
  const start = lines.findIndex((line, index) => index > heading && line.startsWith('|'));
  const end = lines.findIndex((line, index) => index > start && !line.startsWith('|'));
  return lines.slice(start + 2, end).map(row =>
  {
    const [ label, band, chapter, tree ] = row.split('|').slice(1, -1).map(cell => cell.trim());
    const [ , root, from ] = tree.match(/^(\d+)(?: from lv(\d+))?$/);
    return { label, band, chapter: Number(chapter), root: Number(root), from: Number(from || 0) };
  });
};

const areas = await readAreas();

//endregion data loading

//region lines

/**
 * Gets the first row of the line an enemy belongs to.
 * @param {number} id The enemy's row id.
 * @returns {number}
 */
const firstOf = id => id - ((id - 1) % LINE_ROWS);

/**
 * Gets an enemy's rung on its line, where 1 through 5 are tiers and 10 is the line's named.
 * @param {number} id The enemy's row id.
 * @returns {number}
 */
const tierOf = id => id - firstOf(id) + 1;

const lineFirsts = [];
for (let first = FIRST_LINE; first <= LAST_LINE; first += LINE_ROWS)
{
  if (first !== NOT_A_LINE) lineFirsts.push(first);
}

/**
 * Determines whether a row is a tier or a named on a line. Harvestables, tool gimmicks, placeholders
 * and the bosses outside the ladders all carry levels too, and counting them distorts every band.
 * @param {number} id The enemy's row id.
 * @returns {boolean}
 */
const isOnALine = id =>
{
  const tier = tierOf(id);
  return lineFirsts.includes(firstOf(id)) && (tier <= TIERS || tier === NAMED_SLOT);
};

//endregion lines

//region placements

/**
 * Finds the area a placement belongs to. The nearest folder up the tree that the table claims decides
 * it, so a dungeon nested under a field stays its own area, and where two rows claim the same folder
 * the later one is the later visit, which takes over from its level.
 * @param {number} mapId The map the enemy stands on.
 * @param {number} level The level it stands at.
 * @returns {object|null} The area, or null for a map no area claims, such as a town or a test map.
 */
const areaOf = (mapId, level) =>
{
  for (let at = infoById.get(mapId); at; at = infoById.get(at.parentId))
  {
    const claims = areas.filter(area => area.root === at.id && area.from <= level);
    if (claims.length > 0) return claims[claims.length - 1];
  }

  return null;
};

/**
 * Gets a row's own level, which a page's tag can override.
 * @param {number} id The enemy's row id.
 * @returns {number}
 */
const rowLevel = id => Number(enemies[id].note.match(/<level: ?(\d+)>/)[1]);

/**
 * Lists everyone a page puts on the map: the enemy its comments name, and whoever it spawns with a
 * plugin command, which is how a named arrives.
 * @param {object} page The event page.
 * @returns {{id: number, level: number}[]}
 */
const enemiesOnPage = page =>
{
  const comments = page.list.filter(command => COMMENT_CODES.has(command.code)).map(command => String(command.parameters[0])).join(' ');
  const standing = comments.match(/<enemyId: ?(\d+)>/);
  const pageLevel = comments.match(/<(?:lv|lvl|level): ?(\d+)>/i);
  const spawned = page.list.filter(command => command.code === PLUGIN_COMMAND).map(command => Number(command.parameters[3].enemyEventId)).filter(id => id > 0);
  const ids = [ ...(standing ? [ Number(standing[1]) ] : []), ...spawned ].filter(isOnALine);
  return ids.map(id => ({ id, level: pageLevel ? Number(pageLevel[1]) : rowLevel(id) }));
};

/**
 * Reads every enemy placed on one map, one entry per page, because a page that changes hands after a
 * story beat is a second population on the same square.
 * @param {number} mapId The map to read.
 * @returns {Promise<{id: number, level: number, area: object, mapId: number}[]>}
 */
const placementsOn = async mapId =>
{
  const file = Bun.file(`${DATA_DIR}/Map${String(mapId).padStart(3, '0')}.json`);
  if (!(await file.exists())) return [];
  const { events } = JSON.parse(await file.text());
  const onMap = events.filter(event => event).flatMap(event => event.pages.flatMap(enemiesOnPage));
  return onMap.map(entry => ({ ...entry, area: areaOf(mapId, entry.level), mapId })).filter(entry => entry.area !== null);
};

const spots = (await Promise.all([ ...infoById.keys() ].map(placementsOn))).flat();

/**
 * Sums a list of placements by enemy, biggest population first.
 * @param {object[]} list The placements.
 * @param {function} labelOf How to name each group, given its first placement.
 * @param {function} keyOf What makes two placements the same group.
 * @returns {string[]} One "name lvN xCount" per group.
 */
const summarize = (list, labelOf, keyOf) =>
{
  const groups = new Map();
  list.forEach(entry =>
  {
    const key = keyOf(entry);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(entry);
  });
  return [ ...groups.values() ].sort((a, b) => b.length - a.length).map(group =>
  {
    const levels = group.map(entry => entry.level);
    const [ low, high ] = [ Math.min(...levels), Math.max(...levels) ];
    return `${labelOf(group[0])} lv${low === high ? low : `${low}-${high}`} x${group.length}`;
  });
};

//endregion placements

//region subcommands

/**
 * Prints every area in play order, with its band and who lives there, tier by tier.
 */
const showAreas = () =>
{
  areas.forEach(area =>
  {
    const here = spots.filter(entry => entry.area === area);
    console.log(`${area.label}, chapter ${area.chapter}, band ${area.band}`);
    [ 1, 2, 3, 4, 5, NAMED_SLOT ].forEach(tier =>
    {
      const list = here.filter(entry => tierOf(entry.id) === tier);
      if (list.length === 0) return;
      const label = tier === NAMED_SLOT ? 'named' : `T${tier}`;
      console.log(`  ${label}: ${summarize(list, entry => enemies[entry.id].name, entry => entry.id).join(', ')}`);
    });
  });
};

/**
 * Prints every line with where the player first meets it, and the tally by chapter. A line's first
 * meeting is the earliest area in play order that holds any of its tiers, at the lowest tier there.
 */
const showFirstMeetings = () =>
{
  const meetings = lineFirsts.map(first =>
  {
    const onLine = spots.filter(entry => firstOf(entry.id) === first && tierOf(entry.id) <= TIERS && entry.area.chapter <= LAST_ORDERED_CHAPTER);
    const earliest = areas.find(area => onLine.some(entry => entry.area === area));
    if (earliest === undefined) return { first, area: null };
    const there = onLine.filter(entry => entry.area === earliest);
    const lowest = Math.min(...there.map(entry => tierOf(entry.id)));
    const level = Math.min(...there.filter(entry => tierOf(entry.id) === lowest).map(entry => entry.level));
    return { first, area: earliest, tier: lowest, level };
  });
  const chapters = [ ...new Set(areas.map(area => area.chapter)) ].filter(chapter => chapter <= LAST_ORDERED_CHAPTER);
  const tally = chapters.map(chapter => `chapter ${chapter}: ${meetings.filter(meeting => meeting.area !== null && meeting.area.chapter === chapter).length}`);
  console.log(`${tally.join(', ')}, later: ${meetings.filter(meeting => meeting.area === null).length}`);
  const order = meeting => (meeting.area === null ? areas.length : areas.indexOf(meeting.area));
  [ ...meetings ].sort((a, b) => order(a) - order(b) || a.first - b.first).forEach(({ first, area, tier, level }) =>
  {
    const name = enemies[first].name;
    console.log(area === null ? `${name}: not before chapter 4` : `${name}: ${area.label}, T${tier} lv${level}`);
  });
};

/**
 * Prints one line's five tiers and its named, and where each one stands.
 * @param {string} query The name or row id of anyone on the line.
 */
const showLine = query =>
{
  // a named's row wears a bang, and nobody asks for it by that.
  const wanted = query.toLowerCase().replace(/^!/, '');
  const row = enemies.find(enemy => enemy && (String(enemy.id) === query || enemy.name.toLowerCase().replace(/^!/, '') === wanted));
  if (row === undefined || !lineFirsts.includes(firstOf(row.id))) throw new Error(`no line holds "${query}"`);
  const first = firstOf(row.id);
  [ 1, 2, 3, 4, 5, NAMED_SLOT ].forEach(tier =>
  {
    const id = first + tier - 1;
    const here = spots.filter(entry => entry.id === id);
    const label = tier === NAMED_SLOT ? 'named' : `T${tier}`;
    const homes = summarize(here, entry => entry.area.label, entry => entry.area);
    console.log(`${label} ${enemies[id].name}: ${homes.length > 0 ? homes.join(', ') : 'stands nowhere'}`);
  });
};

//endregion subcommands

const [ command = 'areas', ...rest ] = Bun.argv.slice(2);
if (command === 'areas') showAreas();
else if (command === 'first') showFirstMeetings();
else if (command === 'line') showLine(rest.join(' '));
else throw new Error(`unknown subcommand "${command}"; try areas, first, or line <name or id>`);
