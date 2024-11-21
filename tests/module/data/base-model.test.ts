import { StorytellerDataModel } from "../../../module/data/base-model";

describe("StorytellerDataModel", () => {
  let model: StorytellerDataModel;

  beforeEach(() => {
    // Mock foundry.data.fields
    const mockSchemaField = jest.fn().mockImplementation((data) => data);
    const mockNumberField = jest.fn().mockImplementation(() => ({ initial: 0 }));
    const mockStringField = jest.fn().mockImplementation(() => ({ initial: '' }));

    global.foundry = {
      data: {
        fields: {
          SchemaField: mockSchemaField,
          NumberField: mockNumberField,
          StringField: mockStringField
        }
      }
    };

    // @ts-ignore - Mock constructor
    model = new StorytellerDataModel();
  });

  describe("toPlainObject", () => {
    it("converts model data to plain object", () => {
      const testData = {
        name: "Test Model",
        value: 42,
        nested: {
          prop: "test"
        }
      };

      Object.assign(model, testData);
      const result = model.toPlainObject();

      expect(result).toEqual(testData);
    });

    it("handles circular references", () => {
      const circular: any = {
        name: "Circular Test"
      };
      circular.self = circular;

      Object.assign(model, circular);
      const result = model.toPlainObject();

      expect(result.name).toBe("Circular Test");
      expect(result.self).toBe("[Circular Reference]");
    });

    it("handles null and undefined values", () => {
      const testData = {
        nullProp: null,
        undefinedProp: undefined,
        value: "test"
      };

      Object.assign(model, testData);
      const result = model.toPlainObject();

      expect(result.nullProp).toBeNull();
      expect(result.undefinedProp).toBeUndefined();
      expect(result.value).toBe("test");
    });
  });

  describe("schema", () => {
    it("defines base schema structure", () => {
      const schema = StorytellerDataModel.defineSchema();
      expect(schema).toBeDefined();
      expect(schema.fields).toBeDefined();
    });
  });
});
