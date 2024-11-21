import { StorytellerActorSheet } from '../../../module/sheets/actor-sheet';
import { StorytellerActor } from '../../../module/documents/actor';
import { TextEditor } from '../../../types/base';
import { StorytellerCharacter } from '../../../module/data/_module';

jest.mock('../../../types/base', () => ({
  TextEditor: {
    enrichHTML: jest.fn().mockResolvedValue('enriched content')
  }
}));

describe('StorytellerActorSheet', () => {
  let sheet: StorytellerActorSheet;
  let mockActor: StorytellerActor;

  beforeEach(() => {
    const mockSystem = new StorytellerCharacter({
      aspects: {
        focus: { value: 3, modifier: 1 },
        grace: { value: 3, modifier: 1 },
        intellect: { value: 3, modifier: 1 },
        might: { value: 3, modifier: 1 }
      },
      health: { value: 10, max: 10 },
      actionPoints: { value: 3, max: 3 },
      biography: 'Test Biography'
    });

    mockActor = {
      name: 'Test Actor',
      type: 'character',
      system: mockSystem,
      items: new foundry.utils.Collection(),
      effects: new foundry.utils.Collection(),
      isOwner: true,
      rollAspect: jest.fn(),
      createEmbeddedDocuments: jest.fn(),
      getRollData: () => ({}),
      toPlainObject: () => ({})
    } as unknown as StorytellerActor;

    // @ts-ignore - Mock constructor
    sheet = new StorytellerActorSheet(mockActor);
    sheet.options = { classes: [], width: 600, height: 400 };
  });

  describe('getData', () => {
    test('should return enriched data for rendering', async () => {
      const data = await sheet.getData();

      expect(data).toEqual({
        actor: mockActor,
        system: mockActor.system,
        effects: {
          temporary: { type: 'temporary', label: 'Temporary Effects', effects: [] },
          passive: { type: 'passive', label: 'Passive Effects', effects: [] },
          inactive: { type: 'inactive', label: 'Inactive Effects', effects: [] }
        },
        items: [],
        enrichedBiography: 'enriched content',
        isOwner: true,
        limited: false,
        options: sheet.options,
        editable: true
      });

      expect(TextEditor.enrichHTML).toHaveBeenCalledWith(
        mockActor.system.biography,
        expect.any(Object)
      );
    });
  });

  describe('activateListeners', () => {
    let html: JQuery;
    const mockEffect = { delete: jest.fn(), update: jest.fn() };

    beforeEach(() => {
      html = $(`
        <form>
          <button class="aspect-roll" data-aspect="focus"></button>
          <button class="effect-control" data-action="create"></button>
          <button class="effect-control" data-action="delete" data-effect-id="test"></button>
          <button class="effect-control" data-action="toggle" data-effect-id="test"></button>
        </form>
      `);

      mockActor.effects = new foundry.utils.Collection([['test', mockEffect]]);
      sheet.activateListeners(html);
    });

    test('should set up aspect roll listeners', () => {
      html.find('.aspect-roll').trigger('click');
      expect(mockActor.rollAspect).toHaveBeenCalledWith('focus');
    });

    test('should set up effect control listeners', () => {
      html.find('[data-action="create"]').trigger('click');
      html.find('[data-action="delete"]').trigger('click');
      html.find('[data-action="toggle"]').trigger('click');

      expect(mockActor.createEmbeddedDocuments).toHaveBeenCalled();
      expect(mockEffect.delete).toHaveBeenCalled();
      expect(mockEffect.update).toHaveBeenCalled();
    });
  });
});
