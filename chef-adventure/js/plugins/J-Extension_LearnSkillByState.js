/*:
 * @target MZ
 * @plugindesc 
 * [v1.0 LBS] Enables "learning by state"- another way to learn skills.
 * @author JE
 * @help
 * ============================================================================
 * This plugin allows the ability for states to potentially teach the actor
 * afflicted new skills if they levelup while afflicted with them.
 * 
 * In order to utilize this functionality, add a tag in the "notes" section of
 * a state that matches the following structure below:
 * 
 * <learnByStateChance:SKILL_ID:PERCENT_CHANCE>
 * Where SKILL_ID is the id of the skill to learn
 * Where PERCENT_CHANCE is the percent to learn the skill on-levelup.
 * 
 * An example of this looks like:
 * <learnByStateChance:99:5>
 * 
 * Which translates to:
 * learn skill with id of 99 (from database)
 * with a 5% (5/100) chance upon levelup.
 * 
 * The tag isn't case sensitive, but it is whitespace sensitive, 
 * so I'd recommend keeping it basically without any spaces in the tag.
 * ============================================================================
*/

/**
* Allows the actor to potentially learn a new skill based on the collection of
* states that they are currently afflicted with.
*/
// capture the previous state of what this function looked like before we
// modified it.
const _gameActor_levelup_learnSkillByStateChance = Game_Actor.prototype.levelUp;
Game_Actor.prototype.levelUp = function() {
  // perform all the stuff that leveling up does before we do additional stuff.
  _gameActor_levelup_learnSkillByStateChance.call(this);

  // the actual REGEX to match stuff in the notes of a state in the database.
  // if you want to change it to something more meaningful to you, you can
  // change the "learnByStateChance" to whatever, and make sure it matches in
  // your database states' notes box.
  const structure = /<learnByStateChance:[ ]?(\d+)[ ]?:[ ]?(\d+)>/i;
  // capture a snapshot of this actor's states for iterating over.
  const states = this.states();
  // if we are not afflicted with any states, then do nothing.
  if (states.length === 0) return;
  // iterate over all states currently afflicted on this actor on-levelup.
  states.forEach(state => {
    // iterate over the notes of each state afflicted.
    const notedata = state.note.split(/[\r\n]+/);
    notedata.forEach(note => {
      // if the note contains the regex structure we care about, proceed.
      if (note.match(structure)) {
        // don't bother if we already know the skill.
        if (this.isLearnedSkill(RegExp.$1)) return;

        // compare a random number between 0-100 against the percent in
        // the notes to see if we learned anything.
        const luckyLearning = (Math.random() * 100) < parseInt(RegExp.$2);
        // "luckyLearning" is true/false, if true...
        if (luckyLearning) {
          // ...learn the skill id from the tag! 😀
          this.learnSkill(RegExp.$1);
        }
      }
    });
  });
};