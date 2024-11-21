import { loadSystemLanguages } from '../../../module/helpers/i18n';

declare global {
  const game: {
    i18n: {
      translations: Record<string, string>;
    };
  };
}

describe('Internationalization', () => {
  let mockGame: { i18n: { translations: Record<string, string> } };

  beforeEach(() => {
    mockGame = {
      i18n: {
        translations: {}
      }
    };

    global.game = mockGame;
  });

  describe('loadSystemLanguages', () => {
    test('should load English translations', async () => {
      await loadSystemLanguages();

      expect(game.i18n.translations).toHaveProperty('PROJECT-STORYTELLER.Aspects.Focus');
      expect(game.i18n.translations).toHaveProperty('PROJECT-STORYTELLER.Aspects.Grace');
      expect(game.i18n.translations).toHaveProperty('PROJECT-STORYTELLER.Aspects.Intellect');
      expect(game.i18n.translations).toHaveProperty('PROJECT-STORYTELLER.Aspects.Might');
    });

    test('should include roll messages', async () => {
      await loadSystemLanguages();

      expect(game.i18n.translations).toHaveProperty('PROJECT-STORYTELLER.Roll.Critical');
      expect(game.i18n.translations).toHaveProperty('PROJECT-STORYTELLER.Roll.Fumble');
      expect(game.i18n.translations).toHaveProperty('PROJECT-STORYTELLER.Roll.Aspect');
    });

    test('should include item types', async () => {
      await loadSystemLanguages();

      expect(game.i18n.translations).toHaveProperty('PROJECT-STORYTELLER.ItemTypes.Feature');
      expect(game.i18n.translations).toHaveProperty('PROJECT-STORYTELLER.ItemTypes.Spell');
      expect(game.i18n.translations).toHaveProperty('PROJECT-STORYTELLER.ItemTypes.Equipment');
    });

    test('should include sheet labels', async () => {
      await loadSystemLanguages();

      expect(game.i18n.translations).toHaveProperty('PROJECT-STORYTELLER.Sheet.Aspects');
      expect(game.i18n.translations).toHaveProperty('PROJECT-STORYTELLER.Sheet.Description');
      expect(game.i18n.translations).toHaveProperty('PROJECT-STORYTELLER.Sheet.Effects');
    });
  });
});
