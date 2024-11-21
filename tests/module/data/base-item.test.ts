/// <reference types="jest" />

import { StorytellerItemBase } from "../../../module/data/base-item";

describe("StorytellerItemBase", () => {
  let item: StorytellerItemBase;

  beforeEach(() => {
    item = new StorytellerItemBase({
      _source: {
        description: "Test item description"
      }
    } as any, {});

    // Ensure the data is accessible on the instance
    Object.assign(item, item._source);
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
