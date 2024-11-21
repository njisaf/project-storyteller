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
      prepareDerivedData() {}
    }
  }
};

// Add DataModel to abstract after TypeDataModel is defined
global.foundry.abstract.DataModel = class DataModel extends global.foundry.abstract.TypeDataModel {
  static defineSchema() {
    return new foundry.data.fields.SchemaField({});
  }
  static cleanData(source, options = {}) {
    return source;
  }
};

global.foundry.data = {
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
};

global.foundry.utils = {
  mergeObject: (original, other) => ({ ...original, ...other }),
  Collection: class Collection extends Map {
    constructor(entries = []) {
      super(entries);
    }
  }
};

global.foundry.documents = {
  BaseActor: class BaseActor {},
  BaseItem: class BaseItem {}
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
      Actor: {
        CHARACTER: 'character',
        NPC: 'npc'
      },
      Item: {
        ITEM: 'item',
        FEATURE: 'feature',
        SPELL: 'spell'
      }
    }
  },
  loadTemplates: async (paths) => {}
};

// Mock Hooks
global.Hooks = {
  on: jest.fn(),
  once: jest.fn(),
  call: jest.fn()
};

// Mock CONFIG
global.CONFIG = {
  PROJECT_STORYTELLER: {
    abilities: {
      str: 'STR',
      dex: 'DEX',
      con: 'CON',
      int: 'INT',
      wis: 'WIS',
      cha: 'CHA'
    },
    abilityAbbreviations: {
      str: 'Str',
      dex: 'Dex',
      con: 'Con',
      int: 'Int',
      wis: 'Wis',
      cha: 'Cha'
    },
    itemTypes: {
      item: 'Item',
      feature: 'Feature',
      spell: 'Spell'
    },
    effectTypes: {
      temporary: 'Temporary',
      passive: 'Passive',
      inactive: 'Inactive'
    }
  }
};

// Mock Roll class
class Roll {
  constructor(formula, data = {}) {
    this.formula = formula;
    this.data = data;
    this.total = 0;
    this.terms = [];
  }

  evaluate() {
    this.total = 15;
    this.terms = [{ total: 10 }, { total: 5 }];
    return Promise.resolve(this);
  }

  toMessage(messageData) {
    return Promise.resolve();
  }
}

global.Roll = Roll;

Roll.prototype.toMessage = function(messageData) {
  return Promise.resolve();
};

global.Roll = Roll;

// Mock ChatMessage
global.ChatMessage = {
  getSpeaker: (options = {}) => ({
    actor: options.actor,
    user: options.user
  })
};

// Mock TextEditor
global.TextEditor = {
  enrichHTML: async (content, options) => content
};
