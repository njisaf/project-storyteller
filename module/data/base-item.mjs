/**
 * @module data/base-item
 * @description Base item data model for Project Storyteller system
 */

import StorytellerDataModel from "./base-model.mjs";

/**
 * @class StorytellerItemBase
 * @extends {StorytellerDataModel}
 * @description Foundation class for all item types in Project Storyteller
 * Defines common attributes and methods shared across all items
 */
export default class StorytellerItemBase extends StorytellerDataModel {
  /**
   * @static
   * @returns {Object} Schema definition for base item data
   * @description Defines the core schema for all item documents:
   * - description: Text field for item descriptions
   */
  static defineSchema() {
    const fields = foundry.data.fields;
    const schema = {};

    schema.description = new fields.StringField({ required: true, blank: true });

    return schema;
  }

}
