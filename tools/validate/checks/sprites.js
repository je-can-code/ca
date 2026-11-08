/**
 * sprites — every character sprite the game is told to draw is a file, spelled exactly.
 *
 * An event wears its sprite by name. MZ stores the name as text and only asks `img/characters` for
 * `<name>.png` when the event first draws, so nothing reads the name before a player is standing there:
 * not the editor, which lists the folder and lets you pick, and not a bulk script that renames a sheet
 * or a hand edit that retypes one. A sprite renamed out from under its events stops the game with a
 * "Failed to load" error the first time anyone walks into that room.
 *
 * The comparison is exact, case included. Windows and macOS hand back `m_Orcs.png` when asked for
 * `m_orcs.png`; Linux does not. So a name that differs from its file only by case draws on one machine
 * and stops the game on another, which is how maps that had worked for years broke the day the project
 * moved to Linux. The file list comes from a directory listing for the same reason: a lookup made on a
 * forgiving filesystem would forgive the very mistake this exists to catch.
 *
 * What counts as naming a sprite: an event page's image; a Change Image step in a move route, either the
 * page's own or one a Set Movement Route command runs; Change Actor Images and Change Vehicle Image, in
 * map events, common events and troop pages; each actor's walking sprite; and the three vehicles' in
 * `System.json`. An empty name draws nothing and asks for no file, so it is never a finding.
 */

import { describeRow } from '../resolve.js';

/**
 * The event command that runs a move route on some character.
 * @type {number}
 */
const SET_MOVEMENT_ROUTE = 205;

/**
 * The event command that changes an actor's walking sprite, face and battler.
 * @type {number}
 */
const CHANGE_ACTOR_IMAGES = 322;

/**
 * The event command that changes a vehicle's sprite.
 * @type {number}
 */
const CHANGE_VEHICLE_IMAGE = 323;

/**
 * The move route step that changes the moving character's sprite.
 * @type {number}
 */
const ROUTE_CHANGE_IMAGE = 41;

/**
 * The three vehicles `System.json` describes, by the key it keeps each one under.
 * @type {string[]}
 */
const VEHICLES = [ 'boat', 'ship', 'airship' ];

/**
 * Every sprite a move route changes to, with the index of the step that does it.
 * @param {{ list: object[] }} route The move route.
 * @returns {{ step: number, name: string }[]}
 */
const listRouteImages = route =>
{
  const images = [];

  route.list.forEach((step, index) =>
  {
    // only a Change Image step names a sprite; every other step moves, turns, waits or toggles.
    if (step.code === ROUTE_CHANGE_IMAGE) images.push({ step: index, name: step.parameters[0] });
  });

  return images;
};

/**
 * Every sprite a command list names, with where in the list it is named.
 *
 * A Set Movement Route command carries its whole route as a parameter. MZ also writes each step of it
 * again as a display line straight after the command, but the game runs the route and never reads
 * those lines, so they are not read here either.
 * @param {object[]} list The event commands.
 * @returns {{ where: string, name: string }[]}
 */
const listCommandImages = list => list.flatMap((command, index) =>
{
  // a route's Change Image steps name the sprite that character switches to.
  if (command.code === SET_MOVEMENT_ROUTE)
  {
    return listRouteImages(command.parameters[1])
      .map(({ step, name }) => ({ where: `command ${index} (Set Movement Route, step ${step})`, name }));
  }

  // the actor's walking sprite is the second parameter, before its face and battler.
  if (command.code === CHANGE_ACTOR_IMAGES) return [ { where: `command ${index} (Change Actor Images)`, name: command.parameters[1] } ];

  // the vehicle's sprite is the second parameter, after which vehicle it is.
  if (command.code === CHANGE_VEHICLE_IMAGE) return [ { where: `command ${index} (Change Vehicle Image)`, name: command.parameters[1] } ];

  return [];
});

/**
 * Every character sprite the project names, labelled for a report.
 * @param {object} project The loaded project.
 * @returns {{ where: string, name: string }[]}
 */
const collectSpriteNames = project =>
{
  const { tables, maps } = project;
  const names = [];

  // map events, page by page: the page's own image, its own route, then its commands.
  [ ...maps.keys() ].sort((left, right) => left - right).forEach(mapId =>
  {
    const mapLabel = describeRow('Map', mapId, tables.MapInfos[mapId]);

    maps.get(mapId).events.forEach(event =>
    {
      if (!event) return;

      event.pages.forEach((page, index) =>
      {
        const pageLabel = `${mapLabel} event #${event.id} "${event.name}" page ${index + 1}`;

        names.push({ where: `${pageLabel} image`, name: page.image.characterName });
        listRouteImages(page.moveRoute).forEach(({ step, name }) => names.push({ where: `${pageLabel} move route step ${step}`, name }));
        listCommandImages(page.list).forEach(({ where, name }) => names.push({ where: `${pageLabel} ${where}`, name }));
      });
    });
  });

  // common events.
  tables.CommonEvents.forEach(commonEvent =>
  {
    if (!commonEvent) return;

    listCommandImages(commonEvent.list)
      .forEach(({ where, name }) => names.push({ where: `${describeRow('CommonEvents', commonEvent.id, commonEvent)} ${where}`, name }));
  });

  // troop pages, which run in battle.
  tables.Troops.forEach(troop =>
  {
    if (!troop) return;

    troop.pages.forEach((page, index) => listCommandImages(page.list)
      .forEach(({ where, name }) => names.push({ where: `${describeRow('Troops', troop.id, troop)} page ${index + 1} ${where}`, name })));
  });

  // each actor's walking sprite, which the party leader wears on every map.
  tables.Actors.forEach(actor =>
  {
    if (!actor) return;

    names.push({ where: `${describeRow('Actors', actor.id, actor)} walking sprite`, name: actor.characterName });
  });

  // the vehicles, which System.json keeps one apiece.
  VEHICLES.forEach(vehicle => names.push({ where: `System.json ${vehicle}`, name: tables.System[vehicle].characterName }));

  // an empty name draws nothing, so it asks MZ for no file.
  return names.filter(({ name }) => name !== '');
};

/**
 * Explains a name with no file of exactly that spelling: when a file differs from it only by case, the
 * finding names that file, because that is the mistake that loads on Windows and stops the game on Linux.
 * @param {Set<string>} files Every sprite file, by the name an event would use for it.
 * @param {string} name The name an event used.
 * @returns {string}
 */
const describeMissing = (files, name) =>
{
  const lowered = name.toLowerCase();
  const sameButCase = [ ...files ].find(file => file.toLowerCase() === lowered);

  return sameButCase
    ? `img/characters has "${sameButCase}.png", which differs only by case: it loads on Windows and macOS, and stops the game on Linux`
    : `img/characters has no ${name}.png, so the game stops with "Failed to load" when it first draws`;
};

/**
 * Checks that every character sprite the project names is a file of exactly that name.
 * @param {object} project The loaded project.
 * @returns {{ findings: string[], summary: string }}
 */
export const checkSprites = project =>
{
  const { characterImages } = project;
  const names = collectSpriteNames(project);

  const findings = names
    .filter(({ name }) => characterImages.has(name) === false)
    .map(({ where, name }) => `${where} draws "${name}", but ${describeMissing(characterImages, name)}.`);

  return {
    findings,
    summary: `${names.length} sprite name(s) checked against ${characterImages.size} file(s) in img/characters`,
  };
};