//region annotations
/*:
 * @target MZ
 * @plugindesc [v1.0.0 REGIONS] A plugin that controls passage by region ids.
 * @author JE
 * @url https://github.com/je-can-code/ca
 * @base J-Base
 * @orderAfter J-Base
 * @help
 * ============================================================================
 * OVERVIEW:
 * This plugin enables passage control via region ids while on the map.
 *
 * DETAILS:
 * Based on a per-tile basis and some simple tags on the map, you can now
 * control the following:
 * - force-restrict passage by region id(s).
 * - force-permit passage by region id(s).
 * ============================================================================
 * REGION PASSAGE:
 * Have you ever wanted a character on a particular map have the ability to
 * traverse otherwise untraversable tiles? Or possibly restrict traversal upon
 * tiles that are normally traversable? Well now you can! By adding the
 * appropriate tags to the map properties, you too can control variable
 * passage by region id!
 *
 * TAG USAGE:
 * - Map [Properties]
 *
 * TAG FORMAT:
 *  <allowRegions:[REGION_IDS]>
 *  <denyRegions:[REGION_IDS]>
 * Where REGION_IDS is a comma-delimited list of region ids used on the map.
 *
 * TAG EXAMPLES:
 *  <allowRegions:[1]>
 * A tile marked with the region id of 1 will become passable.
 *
 *  <denyRegions:[2,3,4]>
 * A tile marked with the region id of 2, 3, or 4 will become impassable.
 *
 * NOTE ABOUT OVERLAPPING IDS IN TAGS:
 * If you use the same region id in both tags on the same map, the deny will
 * take priority and prevent passage.
 *
 * ============================================================================
 * CHANGELOG:
 * - 1.0.0
 *    The initial release.
 * ============================================================================
 * @param globalAllowRegions
 * @type number[]
 * @text Global Allowed Regions
 * @desc The region ids that are always allowed on every map.
 * @default []
 *
 * @param globalDenyRegions
 * @type number[]
 * @text Global Denied Regions
 * @desc The region ids that are always denied on every map.
 * @default []
 *
 */
//endregion annotations