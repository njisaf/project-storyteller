/// <reference types="jest" />

import { StorytellerActorBase } from "../../../module/data/base-actor";

describe("StorytellerActorBase", () => {
  let actor: StorytellerActorBase;

  beforeEach(() => {
    // Mock foundry.data.fields
    const mockSchemaField = jest.fn().mockImplementation((data) => data);
    const mockNumberField = jest.fn().mockImplementation(() => ({ initial: 0 }));

    global.foundry = {
      data: {
        fields: {
          SchemaField: mockSchemaField,
          NumberField: mockNumberField
        }
      }
    };

    // Create mock data
    const mockData = {
      aspects: {
        focus: { value: 3, modifier: 0 },
        grace: { value: 6, modifier: 0 },
        intellect: { value: 9, modifier: 0 },
        might: { value: 12, modifier: 0 }
      },
      health: { value: 10, max: 10 },
      actionPoints: { value: 3, max: 3 }
    };

    // @ts-ignore - Mock constructor
    actor = new StorytellerActorBase();
    Object.assign(actor, mockData);
  });

  describe("prepareDerivedData", () => {
    it("correctly calculates aspect modifiers", () => {
      actor.prepareDerivedData();

      expect(actor.aspects.focus.modifier).toBe(1);    // 3/3 = 1
      expect(actor.aspects.grace.modifier).toBe(2);    // 6/3 = 2
      expect(actor.aspects.intellect.modifier).toBe(3); // 9/3 = 3
      expect(actor.aspects.might.modifier).toBe(4);    // 12/3 = 4
    });
  });

  describe("schema validation", () => {
    it("enforces required integer fields", () => {
      const schema = StorytellerActorBase.defineSchema();
      expect(schema).toBeDefined();

      // Test that schema fields are properly configured
      const aspectFields = schema.fields.aspects.fields;
      expect(aspectFields.focus.fields.value.options.integer).toBe(true);
      expect(aspectFields.focus.fields.value.options.required).toBe(true);
    });
  });
});
