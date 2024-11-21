declare global {
  type JQuery = any; // Temporary type until we properly import jQuery types

  class DocumentSheet {
    getData(): Promise<Record<string, unknown>>;
    activateListeners(html: JQuery): void;
    options: Record<string, unknown>;
    defaultOptions: Record<string, unknown>;
    render(force?: boolean): Promise<void>;
    close(): Promise<void>;
    _getHeaderButtons(): { label: string; class: string; icon: string; onclick: () => void }[];
  }

  class ItemSheet extends DocumentSheet {
    getData(): Promise<Record<string, unknown>>;
    activateListeners(html: JQuery): void;
    options: Record<string, unknown>;
    defaultOptions: Record<string, unknown>;
    render(force?: boolean): Promise<void>;
    item: Item;
    document: Item;
    isEditable: boolean;
    close(): Promise<void>;
    _getHeaderButtons(): { label: string; class: string; icon: string; onclick: () => void }[];
  }

  interface EffectOwner {
    createEmbeddedDocuments(type: string, data: unknown[]): Promise<unknown[]>;
    uuid: string;
    effects: ActiveEffect[];
  }

  interface EffectOwner {
    effects: ActiveEffect[];
  }

  namespace foundry {
    namespace utils {
      function mergeObject<T>(original: T, other: Partial<T>, options?: {
        insertKeys?: boolean;
        insertValues?: boolean;
        overwrite?: boolean;
        recursive?: boolean;
        inplace?: boolean;
        enforceTypes?: boolean;
      }): T;
      class Collection<T> extends Map<string, T> {
        get: (key: string) => T | undefined;
        set: (key: string, value: T) => this;
      }
    }

    namespace abstract {
      class TypeDataModel {
        toObject(): Record<string, unknown>;
        constructor(data: object, options?: object);
        protected _source: Record<string, unknown>;
      }
      class DataModel extends TypeDataModel {
        static defineSchema(): foundry.data.fields.SchemaField;
      }
    }

    namespace data {
      namespace fields {
        class SchemaField<T = Record<string, unknown>> {
          constructor(fields: Record<string, any>);
        }
        class NumberField {
          constructor(options?: {
            required?: boolean;
            nullable?: boolean;
            integer?: boolean;
            initial?: number;
            min?: number;
            max?: number;
          });
        }
        class StringField {
          constructor(options?: {
            required?: boolean;
            nullable?: boolean;
            initial?: string;
            blank?: boolean;
          });
        }
        class BooleanField {
          constructor(options?: {
            required?: boolean;
            nullable?: boolean;
            initial?: boolean;
          });
        }
      }
    }
  }

  interface Game {
    i18n: {
      format: (key: string, data?: Record<string, unknown>) => string;
      localize: (key: string) => string;
    };
    settings: {
      get: (module: string, key: string) => any;
    };
    projectstoryteller?: Record<string, unknown>;
  }

  interface DocumentData {
    toObject(): Record<string, unknown>;
  }

  interface Actor extends DocumentData {
    id: string;
    type: string;
    system: Record<string, any>;
    items: foundry.utils.Collection<Item>;
    effects: foundry.utils.Collection<Effect>;
    isOwner: boolean;
    allApplicableEffects: () => Generator<Effect>;
    getRollData: () => Record<string, unknown>;
  }

  interface Item extends DocumentData, EffectOwner {
    id: string;
    type: string;
    name: string;
    img: string;
    system: {
      description?: string;
      [key: string]: any;
    };
    flags: Record<string, unknown>;
    isOwner: boolean;
    effects: ActiveEffect[];
    getRollData(): Record<string, unknown>;
    toObject(): Record<string, unknown>;
    sheet: ItemSheet;
    parent: Actor | null;
    delete(): Promise<void>;
    roll(): Promise<Roll>;
    static DEFAULT_ICON: string;
    static create: (data: unknown, options: { parent: Actor }) => Promise<Item>;
  }

  interface Effect extends ActiveEffect {
    id: string;
    parent: Actor | Item;
  }

  interface ActiveEffect {
    id: string;
    disabled: boolean;
    isTemporary: boolean;
    sheet: {
      render: (force: boolean) => void;
    };
    delete: () => Promise<void>;
    update: (data: Partial<ActiveEffect>) => Promise<void>;
  }

  class Roll {
    constructor(formula: string, data?: Record<string, unknown>);
    toMessage(options: {
      speaker: unknown;
      flavor: string;
      rollMode: string;
    }): void;
  }

  interface CONFIG {
    PROJECT_STORYTELLER: {
      Effect: {
        Temporary: string;
        Passive: string;
        Inactive: string;
      };
      Combat: {
        initiative: {
          formula: string;
          decimals: number;
        };
      };
    };
    Actor: {
      documentClass: any;
      dataModels: Record<string, unknown>;
    };
    Item: {
      documentClass: any;
      dataModels: Record<string, unknown>;
    };
    ActiveEffect: {
      legacyTransferral: boolean;
    };
  }

  interface TextEditor {
    enrichHTML: (
      content: string,
      options: {
        secrets: boolean;
        async: boolean;
        rollData: Record<string, unknown>;
        relativeTo: unknown;
      }
    ) => Promise<string>;
  }

  interface ChatMessage {
    getSpeaker: (options: { actor: Actor }) => unknown;
  }

  var TextEditor: TextEditor;
  var ChatMessage: ChatMessage;
  var CONFIG: CONFIG;
  var game: Game;
  var Roll: typeof Roll;

  function loadTemplates(paths: string[]): Promise<void>;
}

export {};
