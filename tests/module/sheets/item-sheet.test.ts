import { StorytellerItemSheet } from '../../../module/sheets/item-sheet';
import { StorytellerItem } from '../../../module/documents/item';
import { TextEditor } from '../../../types/base';
import { StorytellerItemModel } from '../../../module/data/_module';

jest.mock('../../../types/base', () => ({
  TextEditor: {
    enrichHTML: jest.fn().mockResolvedValue('enriched content')
  }
}));

describe('StorytellerItemSheet', () => {
  let sheet: StorytellerItemSheet;
  let mockItem: StorytellerItem;

  beforeEach(() => {
    const mockSystem = new StorytellerItemModel({
      description: 'Test Description',
      quantity: 1,
      weight: 2
    });

    mockItem = {
      name: 'Test Item',
      type: 'item',
      system: mockSystem,
      effects: new foundry.utils.Collection(),
      isOwner: true,
      createEmbeddedDocuments: jest.fn(),
      getRollData: () => ({}),
      toPlainObject: () => ({})
    } as unknown as StorytellerItem;

    // @ts-ignore - Mock constructor
    sheet = new StorytellerItemSheet(mockItem);
    sheet.options = { classes: [], width: 520, height: 480 };
  });

  describe('getData', () => {
    test('should return enriched data for rendering', async () => {
      const data = await sheet.getData();

      expect(data).toEqual({
        item: mockItem,
        system: mockItem.system,
        effects: {
          temporary: { type: 'temporary', label: 'Temporary Effects', effects: [] },
          passive: { type: 'passive', label: 'Passive Effects', effects: [] },
          inactive: { type: 'inactive', label: 'Inactive Effects', effects: [] }
        },
        enrichedDescription: 'enriched content',
        isOwner: true,
        limited: false,
        options: sheet.options,
        editable: true
      });

      expect(TextEditor.enrichHTML).toHaveBeenCalledWith(
        mockItem.system.description,
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
          <button class="effect-control" data-action="create"></button>
          <button class="effect-control" data-action="delete" data-effect-id="test"></button>
          <button class="effect-control" data-action="toggle" data-effect-id="test"></button>
        </form>
      `);

      mockItem.effects = new foundry.utils.Collection();
      mockItem.effects.set('test', mockEffect);
      sheet.activateListeners(html);
    });

    test('should set up effect control listeners', () => {
      html.find('[data-action="create"]').trigger('click');
      html.find('[data-action="delete"]').trigger('click');
      html.find('[data-action="toggle"]').trigger('click');

      expect(mockItem.createEmbeddedDocuments).toHaveBeenCalled();
      expect(mockEffect.delete).toHaveBeenCalled();
      expect(mockEffect.update).toHaveBeenCalled();
    });
  });
});
