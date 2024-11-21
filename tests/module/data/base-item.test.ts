/// <reference types="jest" />

import { StorytellerItemBase } from "../../../module/data/base-item";

describe("StorytellerItemBase", () => {
  let item: StorytellerItemBase;

  beforeEach(() => {
    // Mock foundry.data.fields
    const mockSchemaField = jest.fn().mockImplementation((data) => data);
    const mockStringField = jest.fn().mockImplementation(() => ({
      initial: '',
      options: { required: true, blank: true }
    }));

    global.foundry = {
      data: {
        fields: {
          SchemaField: mockSchemaField,
          StringField: mockStringField
        }
      }
    };

    // Create mock data
    const mockData = {
      description: "Test item description"
    };

    // @ts-ignore - Mock constructor
    item = new StorytellerItemBase();
    Object.assign(item, mockData);
  });

  describe("schema", () => {
    it("defines the expected schema structure", () => {
      const schema = StorytellerItemBase.defineSchema();
      expect(schema).toBeDefined();
      expect(schema.fields.description).toBeDefined();

      const descriptionField = schema.fields.description;
      expect(descriptionField.options.required).toBe(true);
      expect(descriptionField.options.blank).toBe(true);
    });
  });
});
