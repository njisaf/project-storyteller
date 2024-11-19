import StorytellerDataModel from "./base-model.mjs";

export default class StorytellerActorBase extends StorytellerDataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = {};

    schema.aspects = new fields.SchemaField({
      focus: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
        modifier: new fields.NumberField({ ...requiredInteger, initial: 0 })
      }),
      grace: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
        modifier: new fields.NumberField({ ...requiredInteger, initial: 0 })
      }),
      intellect: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
        modifier: new fields.NumberField({ ...requiredInteger, initial: 0 })
      }),
      might: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
        modifier: new fields.NumberField({ ...requiredInteger, initial: 0 })
      })
    });

    schema.health = new fields.SchemaField({
      value: new fields.NumberField({ ...requiredInteger, initial: 10, min: 0 }),
      max: new fields.NumberField({ ...requiredInteger, initial: 10 })
    });

    schema.actionPoints = new fields.SchemaField({
      value: new fields.NumberField({ ...requiredInteger, initial: 3, min: 0 }),
      max: new fields.NumberField({ ...requiredInteger, initial: 3 })
    });

    return schema;
  }

  prepareDerivedData() {
    for (const [aspect, data] of Object.entries(this.aspects)) {
      data.modifier = Math.floor(data.value / 3);
    }
  }
}


