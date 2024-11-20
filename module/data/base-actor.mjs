/**
 * @module data/base-actor
 * @description Base actor data model for Project Storyteller system
 */

import StorytellerDataModel from "./base-model.mjs";

/**
 * @class StorytellerActorBase
 * @extends {StorytellerDataModel}
 * @description Foundation class for all actor types in Project Storyteller
 * Defines common attributes and methods shared across all actors
 */
export default class StorytellerActorBase extends StorytellerDataModel {
  /**
   * @static
   * @returns {Object} Schema definition for actor data
   * @description Defines the data schema for actor documents, including:
   * - Aspects (Focus, Grace, Intellect, Might)
   * - Health tracking
   * - Action Points management
   */
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

  /**
   * @override
   * @description Calculates derived values for actor data
   * Currently computes aspect modifiers as floor(value/3)
   */
  prepareDerivedData() {
    for (const [aspect, data] of Object.entries(this.aspects)) {
      data.modifier = Math.floor(data.value / 3);
    }
  }
}
