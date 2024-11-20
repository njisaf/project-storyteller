/**
 * @module data/item-spell
 * @description Spell data model implementation for Project Storyteller
 */

import StorytellerItemBase from "./base-item.mjs";

/**
 * @class StorytellerSpell
 * @extends {StorytellerItemBase}
 * @description Data model for magical spells, implementing spell-specific
 * attributes and mechanics for the magic system
 */
export default class StorytellerSpell extends StorytellerItemBase {
  /**
   * @static
   * @returns {Object} Schema definition for spell data
   * @description Defines spell-specific fields:
   * - spellLevel: Integer 1-9 representing the spell's power level
   */
  static defineSchema() {
    const fields = foundry.data.fields;
    const schema = super.defineSchema();

    schema.spellLevel = new fields.NumberField({ required: true, nullable: false, integer: true, initial: 1, min: 1, max: 9 });

    return schema;
  }
}
