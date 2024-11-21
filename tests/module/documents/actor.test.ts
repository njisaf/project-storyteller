import { StorytellerActor } from '../../../module/documents/actor';
import { StorytellerCharacter, StorytellerNPC } from '../../../module/data/_module';
import { StorytellerActorBase } from '../../../module/data/base-actor';

describe('StorytellerActor', () => {
  let mockCreateActor: jest.Mock;
  let actor: StorytellerActor;

  beforeEach(() => {
    mockCreateActor = jest.fn().mockImplementation((data) => ({
      ...data,
      system: data.type === 'character'
        ? new StorytellerCharacter(data.system)
        : new StorytellerNPC(data.system),
      prepareDerivedData: jest.fn()
    }));

    // @ts-ignore - Mock constructor
    StorytellerActor.create = mockCreateActor;

    actor = mockCreateActor({
      name: 'Test Actor',
      type: 'character',
      system: {
        aspects: {
          focus: { value: 3, modifier: 1 },
          grace: { value: 3, modifier: 1 },
          intellect: { value: 3, modifier: 1 },
          might: { value: 3, modifier: 1 }
        },
        health: { value: 10, max: 10 },
        actionPoints: { value: 3, max: 3 }
      }
    });
  });

  describe('Character Type', () => {
    test('should use StorytellerCharacter data model', () => {
      expect(actor.system).toBeInstanceOf(StorytellerCharacter);
    });

    test('should calculate aspect modifiers correctly', () => {
      const aspects = actor.system.aspects;
      Object.values(aspects).forEach(aspect => {
        expect(aspect.modifier).toBe(Math.floor(aspect.value / 3));
      });
    });

    test('should handle health and action points', () => {
      expect(actor.system.health.value).toBe(10);
      expect(actor.system.health.max).toBe(10);
      expect(actor.system.actionPoints.value).toBe(3);
      expect(actor.system.actionPoints.max).toBe(3);
    });

    test('should update derived data on aspect change', () => {
      actor.system.aspects.might.value = 6;
      actor.prepareDerivedData();
      expect(actor.system.aspects.might.modifier).toBe(2);
    });
  });

  describe('NPC Type', () => {
    beforeEach(() => {
      actor = mockCreateActor({
        name: 'Test NPC',
        type: 'npc',
        system: {
          aspects: {
            focus: { value: 3, modifier: 1 },
            grace: { value: 3, modifier: 1 },
            intellect: { value: 3, modifier: 1 },
            might: { value: 3, modifier: 1 }
          },
          health: { value: 10, max: 10 },
          actionPoints: { value: 3, max: 3 },
          cr: 2,
          description: 'Test NPC Description'
        }
      });
    });

    test('should use StorytellerNPC data model', () => {
      expect(actor.system).toBeInstanceOf(StorytellerNPC);
    });

    test('should handle CR and description fields', () => {
      expect(actor.system.cr).toBe(2);
      expect(actor.system.description).toBe('Test NPC Description');
    });
  });

  describe('Common Functionality', () => {
    test('should validate aspect values', () => {
      expect(() => {
        actor.system.aspects.might.value = -1;
      }).toThrow();

      expect(() => {
        actor.system.aspects.might.value = 'invalid' as any;
      }).toThrow();
    });

    test('should handle effects', () => {
      const mockEffect = {
        id: 'test-effect',
        label: 'Test Effect',
        changes: [
          { key: 'system.aspects.might.value', mode: 2, value: 2 }
        ]
      };

      actor.effects = new Collection([['test-effect', mockEffect]]);
      actor.prepareDerivedData();

      expect(actor.system.aspects.might.value).toBe(5);
    });
  });
});
