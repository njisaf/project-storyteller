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
  itemTypes: {
    item: string;
    feature: string;
    spell: string;
  };
  spellLevels: Record<number, string>;
  spellSchools: Record<string, string>;
  effectTypes: {
    temporary: string;
    passive: string;
    inactive: string;
  };
}

declare global {
  interface CONFIG {
    PROJECT_STORYTELLER: ProjectStoryteller;
  }
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
  },
  itemTypes: {
    item: 'PROJECT_STORYTELLER.ItemType.Item',
    feature: 'PROJECT_STORYTELLER.ItemType.Feature',
    spell: 'PROJECT_STORYTELLER.ItemType.Spell'
  },
  spellLevels: {
    0: 'PROJECT_STORYTELLER.SpellLevel.Cantrip',
    1: 'PROJECT_STORYTELLER.SpellLevel.1st',
    2: 'PROJECT_STORYTELLER.SpellLevel.2nd',
    3: 'PROJECT_STORYTELLER.SpellLevel.3rd',
    4: 'PROJECT_STORYTELLER.SpellLevel.4th',
    5: 'PROJECT_STORYTELLER.SpellLevel.5th',
    6: 'PROJECT_STORYTELLER.SpellLevel.6th',
    7: 'PROJECT_STORYTELLER.SpellLevel.7th',
    8: 'PROJECT_STORYTELLER.SpellLevel.8th',
    9: 'PROJECT_STORYTELLER.SpellLevel.9th'
  },
  spellSchools: {
    abj: 'PROJECT_STORYTELLER.SpellSchool.Abjuration',
    con: 'PROJECT_STORYTELLER.SpellSchool.Conjuration',
    div: 'PROJECT_STORYTELLER.SpellSchool.Divination',
    enc: 'PROJECT_STORYTELLER.SpellSchool.Enchantment',
    evo: 'PROJECT_STORYTELLER.SpellSchool.Evocation',
    ill: 'PROJECT_STORYTELLER.SpellSchool.Illusion',
    nec: 'PROJECT_STORYTELLER.SpellSchool.Necromancy',
    trs: 'PROJECT_STORYTELLER.SpellSchool.Transmutation'
  },
  effectTypes: {
    temporary: 'PROJECT_STORYTELLER.Effect.Temporary',
    passive: 'PROJECT_STORYTELLER.Effect.Passive',
    inactive: 'PROJECT_STORYTELLER.Effect.Inactive'
  }
};
