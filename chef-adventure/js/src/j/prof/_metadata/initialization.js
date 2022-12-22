/**
 * The core where all of my extensions live: in the `J` object.
 */
var J = J || {};

/**
 * The plugin umbrella that governs all things related to this plugin.
 */
J.PROF = {};

/**
 * The `metadata` associated with this plugin, such as version.
 */
J.PROF.Metadata =
  {
    /**
     * The version of this plugin.
     */
    Name: `J-Proficiency`,

    /**
     * The version of this plugin.
     */
    Version: '1.0.0',
  };

J.PROF.Helpers = new Map();
J.PROF.Helpers.TranslateProficiencyRequirements = function(obj)
{
  const parsedBlob = JSON.parse(obj);
  const conditionals = [];
  parsedBlob.forEach(conditionalBlob =>
  {
    const parsedConditional = JSON.parse(conditionalBlob);

    const { key } = parsedConditional;
    // skip proficiencies that are just headers for visual clarity.
    if (key.startsWith("===")) return;

    const actorIdBlob = JSON.parse(parsedConditional.actorIds);
    const actorIds = actorIdBlob.map(id => parseInt(id));
    const skillrewardBlob = JSON.parse(parsedConditional.skillRewards);
    const skillRewards = skillrewardBlob.map(id => parseInt(id));
    const reward = parsedConditional.jsRewards;
    const requirements = [];

    const parsedRequirements = JSON.parse(parsedConditional.requirements);
    parsedRequirements.forEach(requirementBlob =>
    {
      const parsedRequirement = JSON.parse(requirementBlob);
      const requirement = new ProficiencyRequirement(
        parseInt(parsedRequirement.skillId),
        parseInt(parsedRequirement.proficiency))
      requirements.push(requirement);
    });

    const conditional = new ProficiencyConditional(key, actorIds, requirements, skillRewards, reward);
    conditionals.push(conditional);
  })

  return conditionals;
};

/**
 * The actual `plugin parameters` extracted from RMMZ.
 */
J.PROF.PluginParameters = PluginManager.parameters(J.PROF.Metadata.Name);

/**
 * The various aliases associated with this plugin.
 */
J.PROF.Aliased =
  {
    Game_Actor: new Map(),
    Game_Action: new Map(),
    Game_Battler: new Map(),
    Game_Enemy: new Map(),
    Game_System: new Map(),
  };

/**
 * Plugin command for modifying proficiency for one or more actors for one or more skills by a given amount.
 */
PluginManager.registerCommand(J.PROF.Metadata.Name, "modifyActorSkillProficiency", args =>
{
  const { actorIds, skillIds } = args;
  const parsedActorIds = JSON.parse(actorIds).map(num => parseInt(num));
  const parsedSkillIds = JSON.parse(skillIds).map(num => parseInt(num));
  let { amount } = args;
  amount = parseInt(amount);
  parsedSkillIds.forEach(skillId =>
  {
    parsedActorIds.forEach(actorId =>
    {
      $gameActors
        .actor(actorId)
        .increaseSkillProficiency(skillId, amount);
    });
  });
});

/**
 * Plugin command for modifying proficiency of the whole party for one or more skills by a given amount.
 */
PluginManager.registerCommand(J.PROF.Metadata.Name, "modifyPartySkillProficiency", args =>
{
  const { skillIds } = args;
  let { amount } = args;
  const parsedSkillIds = JSON.parse(skillIds).map(num => parseInt(num));
  amount = parseInt(amount);
  $gameParty.members().forEach(actor =>
  {
    parsedSkillIds.forEach(skillId =>
    {
      actor.increaseSkillProficiency(skillId, amount);
    });
  });
});
//endregion Introduction