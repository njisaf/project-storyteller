/**
 * @module helpers/config
 * @description Configuration constants for the Project Storyteller system
 */

/**
 * @constant {Object} PROJECT_STORYTELLER
 * @description Global configuration object for Project Storyteller system
 * @property {Object} abilities - Full names of ability scores
 * @property {Object} abilityAbbreviations - Abbreviated names of ability scores
 */
export const PROJECT_STORYTELLER = {};

/**
 * @constant {Object} PROJECT_STORYTELLER.abilities
 * @description Localization keys for full ability score names
 * @property {string} str - Strength localization key
 * @property {string} dex - Dexterity localization key
 * @property {string} con - Constitution localization key
 * @property {string} int - Intelligence localization key
 * @property {string} wis - Wisdom localization key
 * @property {string} cha - Charisma localization key
 */
PROJECT_STORYTELLER.abilities = {
  str: 'PROJECT_STORYTELLER.Ability.Str.long',
  dex: 'PROJECT_STORYTELLER.Ability.Dex.long',
  con: 'PROJECT_STORYTELLER.Ability.Con.long',
  int: 'PROJECT_STORYTELLER.Ability.Int.long',
  wis: 'PROJECT_STORYTELLER.Ability.Wis.long',
  cha: 'PROJECT_STORYTELLER.Ability.Cha.long',
};

/**
 * @constant {Object} PROJECT_STORYTELLER.abilityAbbreviations
 * @description Localization keys for abbreviated ability score names
 * @property {string} str - Abbreviated Strength localization key
 * @property {string} dex - Abbreviated Dexterity localization key
 * @property {string} con - Abbreviated Constitution localization key
 * @property {string} int - Abbreviated Intelligence localization key
 * @property {string} wis - Abbreviated Wisdom localization key
 * @property {string} cha - Abbreviated Charisma localization key
 */
PROJECT_STORYTELLER.abilityAbbreviations = {
  str: 'PROJECT_STORYTELLER.Ability.Str.abbr',
  dex: 'PROJECT_STORYTELLER.Ability.Dex.abbr',
  con: 'PROJECT_STORYTELLER.Ability.Con.abbr',
  int: 'PROJECT_STORYTELLER.Ability.Int.abbr',
  wis: 'PROJECT_STORYTELLER.Ability.Wis.abbr',
  cha: 'PROJECT_STORYTELLER.Ability.Cha.abbr',
};
