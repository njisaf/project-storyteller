import { StorytellerItem } from '../../../module/documents/item';
import { StorytellerItem as StorytellerItemModel, StorytellerFeature, StorytellerSpell } from '../../../module/data/_module';

describe('StorytellerItem', () => {
  let mockCreateItem: jest.Mock;
  let item: StorytellerItem;

  beforeEach(() => {
    mockCreateItem = jest.fn().mockImplementation((data) => ({
      ...data,
      system: (() => {
        switch (data.type) {
          case 'feature':
            return new StorytellerFeature(data.system);
          case 'spell':
            return new StorytellerSpell(data.system);
          default:
            return new StorytellerItemModel(data.system);
        }
      })(),
      prepareDerivedData: jest.fn()
    }));

    // @ts-ignore - Mock constructor
    StorytellerItem.create = mockCreateItem;
  });

  describe('Basic Item Type', () => {
    beforeEach(() => {
      item = mockCreateItem({
        name: 'Test Item',
        type: 'item',
        system: {
          description: 'Test Description',
          quantity: 1,
          weight: 2
        }
      });
    });

    test('should use StorytellerItem data model', () => {
      expect(item.system).toBeInstanceOf(StorytellerItemModel);
    });

    test('should handle basic item properties', () => {
      expect(item.system.description).toBe('Test Description');
      expect(item.system.quantity).toBe(1);
      expect(item.system.weight).toBe(2);
    });
  });

  describe('Feature Type', () => {
    beforeEach(() => {
      item = mockCreateItem({
        name: 'Test Feature',
        type: 'feature',
        system: {
          description: 'Test Feature Description',
          requirements: 'Level 5'
        }
      });
    });

    test('should use StorytellerFeature data model', () => {
      expect(item.system).toBeInstanceOf(StorytellerFeature);
    });

    test('should handle feature properties', () => {
      expect(item.system.requirements).toBe('Level 5');
    });
  });

  describe('Spell Type', () => {
    beforeEach(() => {
      item = mockCreateItem({
        name: 'Test Spell',
        type: 'spell',
        system: {
          description: 'Test Spell Description',
          spellLevel: 3,
          school: 'evocation',
          components: ['verbal', 'somatic'],
          castingTime: '1 action',
          range: '30 feet',
          duration: 'Instantaneous'
        }
      });
    });

    test('should use StorytellerSpell data model', () => {
      expect(item.system).toBeInstanceOf(StorytellerSpell);
    });

    test('should handle spell properties', () => {
      expect(item.system.spellLevel).toBe(3);
      expect(item.system.school).toBe('evocation');
      expect(item.system.components).toEqual(['verbal', 'somatic']);
      expect(item.system.castingTime).toBe('1 action');
      expect(item.system.range).toBe('30 feet');
      expect(item.system.duration).toBe('Instantaneous');
    });
  });

  describe('Common Functionality', () => {
    test('should validate required fields', () => {
      expect(() => {
        mockCreateItem({
          name: 'Invalid Item',
          type: 'item',
          system: {
            description: '',
            quantity: 1,
            weight: 2
          }
        });
      }).toThrow();
    });

    test('should handle effects', () => {
      const mockEffect = {
        id: 'test-effect',
        label: 'Test Effect',
        changes: [
          { key: 'system.quantity', mode: 2, value: 1 }
        ]
      };

      item.effects = new Collection([['test-effect', mockEffect]]);
      item.prepareDerivedData();

      expect(item.system.quantity).toBe(2);
    });

    test('should validate numeric fields', () => {
      expect(() => {
        item.system.quantity = -1;
      }).toThrow();

      expect(() => {
        item.system.weight = 'invalid' as any;
      }).toThrow();
    });
  });
});
