/**
 * Export all data models for Project Storyteller
 * @module data/_module
 */

import { BaseActor } from './base-actor';
import { BaseItem } from './base-item';

declare global {
  namespace foundry {
    namespace data {
      namespace fields {
        interface FieldOptions {
          required?: boolean;
          initial?: unknown;
        }

        interface NumberFieldOptions extends FieldOptions {
          initial?: number;
          min?: number;
          max?: number;
        }

        interface StringFieldOptions extends FieldOptions {
          initial?: string;
          blank?: boolean;
        }

        interface HTMLFieldOptions extends StringFieldOptions {}

        interface DataField<T = unknown, O extends FieldOptions = FieldOptions> {
          new(options?: O): DataField<T, O>;
        }

        interface HTMLField extends DataField<string, HTMLFieldOptions> {
          new(options?: HTMLFieldOptions): HTMLField;
        }
        interface NumberField extends DataField<number, NumberFieldOptions> {
          new(options?: NumberFieldOptions): NumberField;
        }
        interface StringField extends DataField<string, StringFieldOptions> {
          new(options?: StringFieldOptions): StringField;
        }
        interface ArrayField<T> extends DataField<T[]> {
          new(element: DataField<T>): ArrayField<T>;
        }
        interface SchemaField<T extends object> extends DataField<T> {
          new(fields: { [K in keyof T]: DataField<T[K]> }): SchemaField<T>;
        }
      }
    }
  }
}

// Character Models
export class StorytellerCharacter extends BaseActor {
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      ...super.defineSchema(),
      biography: new fields.HTMLField(),
      level: new fields.NumberField({
        required: true,
        initial: 1,
        min: 1,
        max: 20,
      }),
    };
  }
}

export class StorytellerNPC extends BaseActor {
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      ...super.defineSchema(),
      cr: new fields.NumberField({
        required: true,
        initial: 0,
        min: 0,
      }),
      description: new fields.HTMLField(),
    };
  }
}

// Item Models
export class StorytellerItem extends BaseItem {
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      ...super.defineSchema(),
      quantity: new fields.NumberField({
        required: true,
        initial: 1,
        min: 0,
      }),
      weight: new fields.NumberField({
        required: true,
        initial: 0,
        min: 0,
      }),
    };
  }
}

export class StorytellerFeature extends BaseItem {
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      ...super.defineSchema(),
      requirements: new fields.StringField(),
    };
  }
}

export class StorytellerSpell extends BaseItem {
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      ...super.defineSchema(),
      spellLevel: new fields.NumberField({
        required: true,
        initial: 1,
        min: 0,
        max: 9,
      }),
      school: new fields.StringField({
        required: true,
        initial: "evocation",
      }),
      components: new fields.ArrayField(new fields.StringField()),
      castingTime: new fields.StringField({
        required: true,
        initial: "1 action",
      }),
      range: new fields.StringField({
        required: true,
        initial: "30 feet",
      }),
      duration: new fields.StringField({
        required: true,
        initial: "Instantaneous",
      }),
    };
  }
}
