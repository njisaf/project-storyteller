// Mock Foundry VTT globals
global.foundry = {
  abstract: {
    TypeDataModel: class TypeDataModel {
      constructor(data = {}, options = {}) {
        this._source = data._source || {};
      }
      toObject() {
        return this._source;
      }
    },
    DataModel: class DataModel {
      static defineSchema() {
        return {};
      }
    }
  },
  data: {
    fields: {
      SchemaField: class SchemaField {
        constructor(fields) {
          this.fields = fields;
        }
      },
      NumberField: class NumberField {
        constructor(options = {}) {
          this.options = options;
        }
      },
      StringField: class StringField {
        constructor(options = {}) {
          this.options = options;
        }
      },
      BooleanField: class BooleanField {
        constructor(options = {}) {
          this.options = options;
        }
      },
      ObjectField: class ObjectField {},
      ArrayField: class ArrayField {}
    }
  },
  documents: {
    BaseActor: class BaseActor {},
    BaseItem: class BaseItem {}
  }
};

// Mock game object
global.game = {
  i18n: {
    format: (key, data) => {
      return `${key}: ${data ? JSON.stringify(data) : ''}`;
    },
    localize: (key) => key
  },
  system: {
    model: {
      Actor: {},
      Item: {}
    }
  }
};

// Mock Hooks
global.Hooks = {
  on: jest.fn(),
  once: jest.fn(),
  call: jest.fn()
};

// Mock CONFIG
global.CONFIG = {
  Storyteller: {}
};
