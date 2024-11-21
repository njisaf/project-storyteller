/**
 * Configuration types for Project Storyteller system
 */
export interface AbilityScores {
  str: string;
  dex: string;
  con: string;
  int: string;
  wis: string;
  cha: string;
}

export interface ProjectStoryteller {
  abilities: AbilityScores;
  abilityAbbreviations: AbilityScores;
}

/**
 * Global configuration object for Project Storyteller system
 */
export const PROJECT_STORYTELLER: ProjectStoryteller = {
  abilities: {
    str: 'PROJECT_STORYTELLER.Ability.Str.long',
    dex: 'PROJECT_STORYTELLER.Ability.Dex.long',
    con: 'PROJECT_STORYTELLER.Ability.Con.long',
    int: 'PROJECT_STORYTELLER.Ability.Int.long',
    wis: 'PROJECT_STORYTELLER.Ability.Wis.long',
    cha: 'PROJECT_STORYTELLER.Ability.Cha.long',
  },
  abilityAbbreviations: {
    str: 'PROJECT_STORYTELLER.Ability.Str.abbr',
    dex: 'PROJECT_STORYTELLER.Ability.Dex.abbr',
    con: 'PROJECT_STORYTELLER.Ability.Con.abbr',
    int: 'PROJECT_STORYTELLER.Ability.Int.abbr',
    wis: 'PROJECT_STORYTELLER.Ability.Wis.abbr',
    cha: 'PROJECT_STORYTELLER.Ability.Cha.abbr',
  }
};
