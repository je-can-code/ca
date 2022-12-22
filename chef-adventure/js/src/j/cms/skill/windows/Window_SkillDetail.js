//region Window_SkillDetail
/**
 * A window responsible for showing various datapoints of a skill.
 */
class Window_SkillDetail extends Window_Base
{
  constructor(rect)
  {
    super(rect);
    this.initMembers();
  }

  initMembers()
  {
    /**
     * The skill id this window is currently presenting data for.
     * @type {number}
     */
    this._skillId = null;

    /**
     * The sprites for this skill.
     * @type {Map<string, Sprite>}
     */
    this._skillSprites = new Map();

    /**
     * The actor who owns the skill of this skill.
     * @type {Game_Actor}
     */
    this._actor = null;

    this.refresh();
  }

  /**
   * Sets the skill id of the window to this and refreshes the data.
   * @param {number} newSkillId The new skill id for this window.
   */
  setSkillId(newSkillId)
  {
    this._skillId = newSkillId;
    if (this._skillId < 1)
    {
      this._skillId = 0;
      this.clear();
    }
    else
    {
      this.refresh();
    }
  }

  /**
   * Gets the skill currently being worked with.
   * @returns {RPG_Skill|null}
   */
  skill()
  {
    if (!this._skillId)
    {
      return null;
    }
    else
    {
      // if we're using the skill extension plugin, then grab the extended version.
      if (J.EXTEND && this._actor)
      {
        return OverlayManager.getExtendedSkill(this._actor, this._skillId);
      }

      // otherwise, return the base skill.
      return $dataSkills[this._skillId];
    }
  }

  /**
   * Sets the actor to be the actor owning the window.
   * @param {Game_Actor} newActor The actor.
   */
  setActor(newActor)
  {
    this._actor = newActor;
    this.refresh();
  }

  /**
   * Empties the window.
   */
  clear()
  {
    this.contents.clear();
    this.clearSkillImages();
  }

  /**
   * Hides all skill images available.
   */
  clearSkillImages()
  {
    this._skillSprites.forEach(sprite =>
    {
      sprite.hide();
    });
  }

  /**
   * Clears and redraws all contents of this window.
   */
  refresh()
  {
    this.clear();
    this.drawContents();
  }

  /**
   * Draws all contents of this window.
   */
  drawContents()
  {
    if (!this.skill()) return;

    this.drawHeader();
    this.drawSkillLogo();
    this.drawLeftColumn();
    this.drawMiddleColumn();
    this.drawRightColumn();
  }

  /**
   * Draws the header component of this window.
   */
  drawHeader()
  {
    this.resetFontSettings();
    this.contents.fontSize += 12;
    this.toggleBold();
    this.drawText(this.skill().name, 0, 0, this.width);
    this.resetFontSettings();
  }

  /**
   * Places the 4x scaled-up skill icon (logo) onto the window.
   */
  drawSkillLogo()
  {
    this.placeSkillIcon(0, this.skill());
  }

  /**
   * Places the corresponding skill icon image.
   * @param {number} x The `x` coordinate.
   * @param {RPG_Skill} skill The skill to draw this for.
   */
  placeSkillIcon(x, skill)
  {
    const key = `skill-${skill.id}-icon-image`;
    const sprite = this.createIconSprite(key, skill.iconIndex);
    const y = this.height - (sprite.height * (sprite.scale.x + 1));
    sprite.move(x, y);
    sprite.show();
  }

  /**
   * Generates the state icon sprite representing an afflicted state.
   * @param {string} key The key of this sprite.
   * @param {number} iconIndex The icon index of this sprite.
   */
  createIconSprite(key, iconIndex)
  {
    let sprite = this._skillSprites.get(key);
    if (sprite)
    {
      return sprite;
    }
    else
    {
      sprite = new Sprite_Icon(iconIndex);
      sprite.scale.x = 4.0;
      sprite.scale.y = 4.0;
      this._skillSprites.set(key, sprite);
      this.addInnerChild(sprite);
      return sprite;
    }
  }

  /**
   * Draws the left column, which mostly includes skill costs.
   */
  drawLeftColumn()
  {
    const skill = this.skill();
    const actor = this._actor;
    const params = [];

    /* TODO: add after implementing hp costs.
    const hpName = TextManager.longParam(21);
    const hpCost = parseFloat((skill.hpCost * actor.hcr).toFixed(2));
    const hpColor = ColorManager.hpCostColor();
    params.push(new JCMS_ParameterKvp(hpName, hpCost, hpColor));
    */

    params.push(this.makeSkillTypeParam(skill));
    params.push(this.makeDividerParam());
    params.push(this.makeMpCostParam(skill, actor));
    params.push(this.makeTpCostParam(skill, actor));

    const ox = 16;
    const oy = 60;
    const lh = this.lineHeight();
    params.forEach((param, index) =>
    {
      this.resetTextColor();
      this.changeTextColor(param.color());
      this.drawText(`${param.name()}`, ox, oy + (lh * index), 250);
      if (param.value() !== null)
      {
        this.drawText(`${param.value()}`, ox + 180, oy + (lh * index), 250);
      }
    });
  }

  /**
   * Draws the middle column, which contains various data points from the skill.
   */
  drawMiddleColumn()
  {
    const skill = this.skill();
    const actor = this._actor;
    const params = [];

    params.push(this.makeProjectedDamageParam(skill, actor));
    params.push(this.makeHitsParam(skill, actor));
    params.push(this.makeDividerParam());
    params.push(...this.makeAttackStates(skill, actor));

    const ox = 316;
    const oy = 60;
    const lh = this.lineHeight();
    params.forEach((param, index) =>
    {
      this.resetTextColor();
      this.changeTextColor(param.color());
      this.drawTextEx(`${param.name()}`, ox, oy + (lh * index), 250);
      if (param.value() !== null)
      {
        this.drawTextEx(`${param.value()}`, ox + 250, oy + (lh * index), 250);
      }
    });
  }

  /**
   * Calculates the projected damage to build a parameter.
   *
   * If the skill lacks a formula, it won't try to project.
   * @param {RPG_Skill} skill The skill.
   * @param {Game_Actor} actor The actor.
   * @returns {JCMS_ParameterKvp}
   */
  makeProjectedDamageParam(skill, actor)
  {
    // if its a skill that doesn't have a formula, don't try to parse it.
    if (skill.damage.type === 0)
    {
      return new JCMS_ParameterKvp(`\\C[8]Raw Damage\\C[0]`, 'n/a');
    }

    const a = actor;
    const b = $gameEnemies.enemy(1);
    const v = $gameVariables._data;
    let p = 0;
    if (J.PROF)
    {
      const skillProficiency = actor.skillProficiencyBySkillId(skill.id);
      if (skillProficiency)
      {
        p = skillProficiency.proficiency;
      }
    }
    const sign = [3, 4].includes(skill.damage.type) ? -1 : 1;
    const value = Math.round(Math.max(eval(skill.damage.formula), 0));
    const potential = isNaN(value) ? 0 : value;
    const color = sign > 0 ? 10 : 24;
    return new JCMS_ParameterKvp(`\\C[${color}]Raw Damage\\C[0]`, potential);
  }

  /**
   * Combines the total number of possible hits this skill can hit a foe.
   * @param {RPG_Skill} skill The skill.
   * @param {Game_Actor} actor The actor.
   * @returns {JCMS_ParameterKvp}
   */
  makeHitsParam(skill, actor)
  {
    const value = (skill.repeats - 1) + skill.jabsPierceCount;
    const param = new JCMS_ParameterKvp('Max Possible Hits', `x${value}`, ColorManager.textColor(0));
    return param;
  }

  /**
   * Gets all the states and their chances of application for this skill.
   * @param {RPG_Skill} skill The skill.
   * @param {Game_Actor} actor The actor.
   * @returns {JCMS_ParameterKvp[]}
   */
  makeAttackStates(skill, actor)
  {
    const stateEffects = skill.effects.filter(effect => effect.code === 21);
    if (!stateEffects.length) return [];

    const attackStateParams = [];
    attackStateParams.push(new JCMS_ParameterKvp(`\\C[17]Applies States\\C[0]`, `\\C[1]\\}CHANCE\\{\\C[0]`));
    stateEffects.forEach(effect =>
    {
      const name = `\\State[${effect.dataId}]`;
      const chance = `${Math.round(effect.value1 * 100)}%`;
      attackStateParams.push(new JCMS_ParameterKvp(name, chance));
    });

    return attackStateParams;
  }

  /**
   * Draws the right column for proficiency and elements.
   */
  drawRightColumn()
  {
    const skill = this.skill();
    const actor = this._actor;
    /** @type {JCMS_ParameterKvp[]} */
    const params = [];

    // add the skill proficiency of this skill.
    if (J.PROF)
    {
      params.push(...this.makeSkillProficiency(actor, skill));
    }

    params.push(...this.makeAttackElementsList(skill, actor));

    const ox = 700;
    const oy = 0;
    const lh = this.lineHeight();
    params.forEach((param, index) =>
    {
      this.drawTextEx(`${param.name()}`, ox, oy + (lh * index), 250);
      if (param.value() !== null)
      {
        this.drawTextEx(`${param.value()}`, ox + 300, oy + (lh * index), 250);
      }
    });
  }

  /**
   * Makes a parameter that displays this actor's proficiency with this skill.
   * @param {Game_Actor} actor The actor.
   * @param {RPG_Skill} skill The skill.
   * @returns {JCMS_ParameterKvp}
   */
  makeSkillProficiency(actor, skill)
  {
    const proficiencyParams = [];
    const skillProficiency = actor.tryGetSkillProficiencyBySkillId(skill.id);
    proficiencyParams.push(new JCMS_ParameterKvp(`\\C[21]Proficiency:\\C[0]`, skillProficiency.proficiency));
    proficiencyParams.push(...this.makeRelatedProficiencyConditionals(actor, skill));
    proficiencyParams.push(this.makeDividerParam());

    return proficiencyParams;
  }

  /**
   * Makes a parameter that displays this actor's proficiency with this skill.
   * @param {Game_Actor} actor The actor.
   * @param {RPG_Skill} skill The skill.
   * @returns {JCMS_ParameterKvp[]}
   */
  makeRelatedProficiencyConditionals(actor, skill)
  {
    const conditionals = actor.proficiencyConditionalBySkillId(skill.id);
    const params = [];
    conditionals.forEach(conditional =>
    {
      // if there are no rewards, then don't even draw the "related" section.
      if (!conditional.skillRewards.length) return;


      conditional.skillRewards.forEach(skillRewardId =>
      {
        if (!skillRewardId)
        {
          console.warn(conditional);
          console.log(skillRewardId,  "not a valid skill reward.");
          return;
        }

        // get the current/required proficiency level for the reward.
        const requiredProficiency = conditional.requirements
          .find(requirement => requirement.skillId === skill.id);

        const actorKnowsSkill = actor.isLearnedSkill(skillRewardId);
        const extendedSkill = actor.skill(skillRewardId);
        const learnedIcon = actorKnowsSkill ? 91 : 90;
        const name = `\\I[${learnedIcon}]\\Skill[${extendedSkill.id}]`;
        const value = `${requiredProficiency.proficiency}`;
        params.push(new JCMS_ParameterKvp(name, value));
      });
    });

    // if it turns out we have parameters to work with, then add the header.
    if (params.length)
    {
      params.unshift(new JCMS_ParameterKvp(`\\C[17]Related Skills\\C[0]`, `\\C[1]\\}REQUIRED\\{\\C[0]`));
    }

    return params;
  }

  /**
   * Creates a list of all elemenets contained by this skill.
   * @param {RPG_Skill} skill The skill.
   * @param {Game_Actor} actor The actor.
   * @returns {JCMS_ParameterKvp[]}
   */
  makeAttackElementsList(skill, actor)
  {
    const elementParams = [];
    elementParams.push(new JCMS_ParameterKvp(`\\C[17]Elemental Affiliations\\C[0]`));
    const attackElements = [skill.damage.elementId];
    attackElements.push(...Game_Action.extractElementsFromAction(skill));
    attackElements.forEach(attackElement =>
    {
      const elementName = TextManager.element(attackElement) ?? `(Basic Attack)`;
      const iconIndex = IconManager.element(attackElement);
      const paramName = `\\I[${iconIndex}]\\C[6]${elementName}\\C[0]`;
      elementParams.push(new JCMS_ParameterKvp(paramName))
    });

    return elementParams;
  }

  /**
   * Makes a parameter that is used as a divider between other parameters.
   * @returns {JCMS_ParameterKvp}
   */
  makeDividerParam()
  {
    return new JCMS_ParameterKvp("----------------");
  }

  /**
   * Makes the skill type key value parameter.
   * @param {RPG_Skill} skill The skill object.
   */
  makeSkillTypeParam(skill)
  {
    const support = [0];
    const damage = [1, 2];
    const healer = [3, 4];
    const drain = [5, 6];

    let name = "";
    let color = ColorManager.normalColor();
    switch (true)
    {
      case support.includes(skill.damage.type):
        name = `Support`;
        color = ColorManager.textColor(0);
        break;
      case damage.includes(skill.damage.type):
        name = "Offensive";
        color = ColorManager.textColor(2);
        break;
      case healer.includes(skill.damage.type):
        name = "Restorative";
        color = ColorManager.textColor(3);
        break;
      case drain.includes(skill.damage.type):
        name = "Draining";
        color = ColorManager.textColor(31);
        break;
    }

    return new JCMS_ParameterKvp(name, null, color);
  }

  /**
   * Makes the mp cost key value parameter.
   * @param {RPG_Skill} skill The skill object.
   * @param {Game_Actor} actor The actor.
   */
  makeMpCostParam(skill, actor)
  {
    const mpName = TextManager.longParam(22);
    let mpColor = ColorManager.mpCostColor();
    const mpCost = parseFloat((skill.mpCost * actor.mcr).toFixed(2));
    if (mpCost === 0)
    {
      mpColor = ColorManager.damageColor();
    }
    return new JCMS_ParameterKvp(mpName, mpCost, mpColor);
  }

  /**
   * Makes the tp cost key value parameter.
   * @param {RPG_Skill} skill The skill object.
   * @param {Game_Actor} actor The actor.
   */
  makeTpCostParam(skill, actor)
  {
    const tpName = TextManager.longParam(23);
    let tpColor = ColorManager.tpCostColor();
    const tpCost = parseFloat((skill.tpCost * actor.tcr).toFixed(2));
    if (tpCost === 0)
    {
      tpColor = ColorManager.damageColor();
    }

    return new JCMS_ParameterKvp(tpName, tpCost, tpColor);
  }
}
//endregion Window_SkillDetail