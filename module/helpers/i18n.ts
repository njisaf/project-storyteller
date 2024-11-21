declare global {
  const game: {
    i18n: {
      translations: Record<string, string>;
    };
  };
}

/**
 * Load system languages and translations
 */
export async function loadSystemLanguages(): Promise<void> {
  game.i18n.translations = {
    // Aspects
    'PROJECT-STORYTELLER.Aspects.Focus': 'Focus',
    'PROJECT-STORYTELLER.Aspects.Grace': 'Grace',
    'PROJECT-STORYTELLER.Aspects.Intellect': 'Intellect',
    'PROJECT-STORYTELLER.Aspects.Might': 'Might',

    // Roll Messages
    'PROJECT-STORYTELLER.Roll.Critical': 'Critical Success with {aspect}!',
    'PROJECT-STORYTELLER.Roll.Fumble': 'Critical Failure with {aspect}!',
    'PROJECT-STORYTELLER.Roll.Aspect': '{aspect} Check {result}',

    // Item Types
    'PROJECT-STORYTELLER.ItemTypes.Feature': 'Feature',
    'PROJECT-STORYTELLER.ItemTypes.Spell': 'Spell',
    'PROJECT-STORYTELLER.ItemTypes.Equipment': 'Equipment',

    // Sheet Labels
    'PROJECT-STORYTELLER.Sheet.Aspects': 'Aspects',
    'PROJECT-STORYTELLER.Sheet.Description': 'Description',
    'PROJECT-STORYTELLER.Sheet.Effects': 'Effects'
  };
}
