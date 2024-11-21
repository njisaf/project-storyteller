import {
  StorytellerCharacter,
  StorytellerNPC,
  StorytellerItem,
  StorytellerFeature,
  StorytellerSpell
} from '../../../module/data/_module';

declare global {
  namespace NodeJS {
    interface Global {
      foundry: {
        data: {
          fields: {
            SchemaField: jest.Mock;
            NumberField: jest.Mock;
            StringField: jest.Mock;
            ArrayField: jest.Mock;
          }
        }
      }
    }
  }
}

// Mock foundry.data.fields
const mockSchemaField = jest.fn().mockImplementation((data) => data);
const mockNumberField = jest.fn().mockImplementation(() => ({ initial: 0 }));
const mockStringField = jest.fn().mockImplementation(() => ({ initial: '' }));
const mockArrayField = jest.fn().mockImplementation(() => ({ initial: [] }));

global.foundry = {
  data: {
    fields: {
      SchemaField: mockSchemaField,
      NumberField: mockNumberField,
      StringField: mockStringField,
      ArrayField: mockArrayField
    }
  }
};

describe('Data Models', () => {
  describe('StorytellerCharacter', () => {
    test('should define correct schema', () => {
      const schema = StorytellerCharacter.defineSchema();
      expect(schema).toHaveProperty('aspects');
      expect(schema).toHaveProperty('health');
      expect(schema).toHaveProperty('actionPoints');
      expect(schema).toHaveProperty('biography');
    });

    test('should validate aspect values', () => {
      const char = new StorytellerCharacter({
        aspects: {
          focus: { value: 3, modifier: 1 },
          grace: { value: 3, modifier: 1 },
          intellect: { value: 3, modifier: 1 },
          might: { value: 3, modifier: 1 }
        }
      });
      expect(char.aspects.focus.value).toBe(3);
      expect(char.aspects.focus.modifier).toBe(1);
    });
  });

  describe('StorytellerNPC', () => {
    test('should define correct schema', () => {
      const schema = StorytellerNPC.defineSchema();
      expect(schema).toHaveProperty('aspects');
      expect(schema).toHaveProperty('health');
      expect(schema).toHaveProperty('actionPoints');
      expect(schema).toHaveProperty('cr');
      expect(schema).toHaveProperty('description');
    });

    test('should validate CR value', () => {
      const npc = new StorytellerNPC({
        cr: 5,
        description: 'Test NPC'
      });
      expect(npc.cr).toBe(5);
      expect(npc.description).toBe('Test NPC');
    });
  });

  describe('StorytellerItem', () => {
    test('should define correct schema', () => {
      const schema = StorytellerItem.defineSchema();
      expect(schema).toHaveProperty('description');
      expect(schema).toHaveProperty('quantity');
      expect(schema).toHaveProperty('weight');
    });

    test('should validate numeric properties', () => {
      const item = new StorytellerItem({
        quantity: 2,
        weight: 1.5,
        description: 'Test Item'
      });
      expect(item.quantity).toBe(2);
      expect(item.weight).toBe(1.5);
    });
  });

  describe('StorytellerFeature', () => {
    test('should define correct schema', () => {
      const schema = StorytellerFeature.defineSchema();
      expect(schema).toHaveProperty('description');
      expect(schema).toHaveProperty('requirements');
    });

    test('should validate requirements', () => {
      const feature = new StorytellerFeature({
        requirements: 'Level 5',
        description: 'Test Feature'
      });
      expect(feature.requirements).toBe('Level 5');
    });
  });

  describe('StorytellerSpell', () => {
    test('should define correct schema', () => {
      const schema = StorytellerSpell.defineSchema();
      expect(schema).toHaveProperty('description');
      expect(schema).toHaveProperty('spellLevel');
      expect(schema).toHaveProperty('school');
      expect(schema).toHaveProperty('components');
      expect(schema).toHaveProperty('castingTime');
      expect(schema).toHaveProperty('range');
      expect(schema).toHaveProperty('duration');
    });

    test('should validate spell components', () => {
      const schema = StorytellerSpell.defineSchema();
      expect(schema.components).toBeDefined();
      expect(mockArrayField).toHaveBeenCalled();
    });

    test('should validate spell properties', () => {
      const spell = new StorytellerSpell({
        spellLevel: 3,
        school: 'evocation',
        components: ['verbal', 'somatic'],
        castingTime: '1 action',
        range: '30 feet',
        duration: 'Instantaneous',
        description: 'Test Spell'
      });
      expect(spell.spellLevel).toBe(3);
      expect(spell.school).toBe('evocation');
      expect(spell.components).toEqual(['verbal', 'somatic']);
    });
  });
});
