import { rollAspectCheck } from '../../../module/helpers/dice';

describe('Dice Rolling', () => {
  let mockGame: { i18n: { format: jest.Mock }; };

  beforeEach(() => {
    mockGame = {
      i18n: {
        format: jest.fn((key, data) => `Translated: ${key} ${JSON.stringify(data)}`)
      }
    };

    global.game = mockGame as any;
  });

  describe('rollAspectCheck', () => {
    test('should create roll with correct formula', async () => {
      const aspectData = {
        value: 6,
        modifier: 2
      };

      const roll = await rollAspectCheck('focus', aspectData, {});
      expect(roll.formula).toBe('2d6 + @mod');
      expect(roll.data).toEqual({ mod: 2 });
    });

    test('should handle roll options', async () => {
      const aspectData = {
        value: 6,
        modifier: 2
      };

      const options = {
        advantage: true,
        situationalBonus: 2
      };

      const roll = await rollAspectCheck('focus', aspectData, options);
      expect(roll.formula).toBe('3d6kh2 + @mod + @bonus');
      expect(roll.data).toEqual({ mod: 2, bonus: 2 });
    });

    test('should handle critical success', async () => {
      const aspectData = {
        value: 6,
        modifier: 2
      };

      // Override Roll's evaluate to return a critical success
      const originalRoll = global.Roll;
      global.Roll = class extends originalRoll {
        evaluate() {
          this.total = 20;
          this.terms = [{ total: 15 }, { total: 5 }];
          return Promise.resolve(this);
        }
      };

      await rollAspectCheck('focus', aspectData, {});

      expect(mockGame.i18n.format).toHaveBeenCalledWith(
        'PROJECT-STORYTELLER.Roll.Critical',
        expect.any(Object)
      );

      global.Roll = originalRoll;
    });

    test('should handle critical failure', async () => {
      const aspectData = {
        value: 6,
        modifier: 2
      };

      // Override Roll's evaluate to return a critical failure
      const originalRoll = global.Roll;
      global.Roll = class extends originalRoll {
        evaluate() {
          this.total = 2;
          this.terms = [{ total: 1 }, { total: 1 }];
          return Promise.resolve(this);
        }
      };

      await rollAspectCheck('focus', aspectData, {});

      expect(mockGame.i18n.format).toHaveBeenCalledWith(
        'PROJECT-STORYTELLER.Roll.Fumble',
        expect.any(Object)
      );

      global.Roll = originalRoll;
    });
  });
});
