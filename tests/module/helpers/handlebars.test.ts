import { registerHandlebarsHelpers } from '../../../module/helpers/handlebars';

interface MockHandlebars {
  registerHelper: jest.Mock;
}

declare global {
  const Handlebars: MockHandlebars;
}

describe('Handlebars Helpers', () => {
  let mockHandlebars: MockHandlebars;

  beforeEach(() => {
    mockHandlebars = {
      registerHelper: jest.fn()
    };
    (global as any).Handlebars = mockHandlebars;
  });

  describe('Helper Registration', () => {
    beforeEach(() => {
      registerHandlebarsHelpers();
    });

    test('should register concat helper', () => {
      expect(mockHandlebars.registerHelper).toHaveBeenCalledWith(
        'concat',
        expect.any(Function)
      );

      const concatHelper = mockHandlebars.registerHelper.mock.calls.find(
        call => call[0] === 'concat'
      )[1];

      expect(concatHelper('Hello', ' ', 'World')).toBe('Hello World');
    });

    test('should register times helper', () => {
      expect(mockHandlebars.registerHelper).toHaveBeenCalledWith(
        'times',
        expect.any(Function)
      );

      const timesHelper = mockHandlebars.registerHelper.mock.calls.find(
        call => call[0] === 'times'
      )[1];

      const result = timesHelper({ fn: (i: number) => i.toString() }, 3);
      expect(result).toBe('012');
    });

    test('should register aspectModifier helper', () => {
      expect(mockHandlebars.registerHelper).toHaveBeenCalledWith(
        'aspectModifier',
        expect.any(Function)
      );

      const aspectModifierHelper = mockHandlebars.registerHelper.mock.calls.find(
        call => call[0] === 'aspectModifier'
      )[1];

      expect(aspectModifierHelper(3)).toBe('+1');
      expect(aspectModifierHelper(6)).toBe('+2');
      expect(aspectModifierHelper(-3)).toBe('-1');
    });

    test('should register formatAspect helper', () => {
      expect(mockHandlebars.registerHelper).toHaveBeenCalledWith(
        'formatAspect',
        expect.any(Function)
      );

      const formatAspectHelper = mockHandlebars.registerHelper.mock.calls.find(
        call => call[0] === 'formatAspect'
      )[1];

      const mockAspect = { value: 6, modifier: 2 };
      expect(formatAspectHelper(mockAspect)).toBe('6 (+2)');
    });
  });
});
