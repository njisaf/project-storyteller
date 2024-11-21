import { preloadHandlebarsTemplates } from '../../../module/helpers/templates';

declare global {
  var loadTemplates: jest.Mock<Promise<void>, [string[]]>;
}

describe('Template Helper', () => {
  beforeAll(() => {
    // Mock global loadTemplates function
    global.loadTemplates = jest.fn().mockResolvedValue(undefined);
  });

  it('preloads all required templates', async () => {
    await preloadHandlebarsTemplates();

    expect(loadTemplates).toHaveBeenCalledWith([
      'systems/project-storyteller/templates/actor/parts/actor-features.hbs',
      'systems/project-storyteller/templates/actor/parts/actor-items.hbs',
      'systems/project-storyteller/templates/actor/parts/actor-spells.hbs',
      'systems/project-storyteller/templates/actor/parts/actor-effects.hbs',
      'systems/project-storyteller/templates/item/parts/item-effects.hbs',
    ]);
  });

  it('returns a promise that resolves', async () => {
    const result = preloadHandlebarsTemplates();
    await expect(result).resolves.toBeUndefined();
  });
});
