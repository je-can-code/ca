/**
 * plugins — the mirrored J plugins must be exactly one build of rmmz-plugins, and nothing else.
 *
 * `js/plugins/j/` is generated: rmmz-plugins' `hotfix` mirrors its build output here and nobody edits
 * it by hand. The mirror copies but never prunes, so a ship that was renamed or retired upstream
 * leaves its last bundle behind in the game indefinitely. Nothing loads it until someone ticks it in
 * the plugin manager, and then a months-old copy of code that has since moved on runs beside the
 * current one - J-ABS-PixelMovement, from April, carried a third copy of a JABS_AiManager method two
 * live plugins already fight over.
 *
 * The build writes `manifest.json` beside the plugins, listing every file it produced and its hash.
 * This check holds the folder to it, in both directions, and holds `js/plugins.js` to it too: a
 * registered J plugin the build does not produce is a boot failure waiting for its checkbox.
 */

import { BUILT_PLUGINS_DIR, MANIFEST_NAME } from '../project.js';

/**
 * Checks the mirrored plugins against the manifest their build wrote.
 * @param {object} project The loaded project.
 * @returns {{ findings: string[], summary: string }}
 */
export const checkPlugins = project =>
{
  const { manifest, pluginFiles, plugins } = project;

  if (!manifest)
  {
    return {
      findings: [ `${BUILT_PLUGINS_DIR}/${MANIFEST_NAME} is missing; run \`bun run hotfix\` in rmmz-plugins to rebuild and mirror` ],
      summary: 'skipped',
    };
  }

  const findings = [];
  const built = new Map(Object.entries(manifest.files));

  // every file in the folder has to be one the build produced, unaltered.
  pluginFiles.forEach((hash, file) =>
  {
    if (built.has(file) === false)
    {
      findings.push(`${BUILT_PLUGINS_DIR}/${file} is not part of the build; nothing in rmmz-plugins produces it any more`);
    }
    else if (built.get(file) !== hash)
    {
      findings.push(`${BUILT_PLUGINS_DIR}/${file} differs from the build that produced it; it was edited here or copied partially`);
    }
  });

  // and every file the build produced has to have arrived.
  built.forEach((_, file) =>
  {
    if (pluginFiles.has(file) === false) findings.push(`${BUILT_PLUGINS_DIR}/${file} is missing; the build produced it but it was never mirrored`);
  });

  // every J plugin the game registers has to be one the build produces.
  const registered = plugins.filter(plugin => plugin.name.startsWith('j/'));
  registered.forEach(plugin =>
  {
    const file = `${plugin.name.slice('j/'.length)}.js`;
    const state = plugin.status
      ? 'enabled'
      : 'disabled';

    if (built.has(file) === false) findings.push(`js/plugins.js registers ${plugin.name} (${state}), which the build does not produce`);
  });

  return {
    findings,
    summary: `${pluginFiles.size} file(s) against a manifest of ${built.size}, ${registered.length} registered J plugin(s)`,
  };
};