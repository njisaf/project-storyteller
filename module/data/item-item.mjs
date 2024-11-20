/**
 * @module data/item-item
 * @description General item data model implementation for Project Storyteller
 */

import StorytellerItemBase from "./base-item.mjs";

/**
 * @class StorytellerItem
 * @extends {StorytellerItemBase}
 * @description Data model for general items, implementing inventory management
 * and roll formula construction for item-based actions
 */
export default class StorytellerItem extends StorytellerItemBase {
  /**
   * @static
   * @returns {Object} Schema definition for general item data
   * @description Defines fields for inventory items:
   * - quantity: Number of items in stack
   * - weight: Item weight for encumbrance
   * - roll: Structured fields for building roll formulas
   *   - diceNum: Number of dice to roll
   *   - diceSize: Type of die (d4, d6, d8, etc.)
   *   - diceBonus: Formula for additional modifiers
   * - formula: Computed roll formula string
   */
  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    schema.quantity = new fields.NumberField({ ...requiredInteger, initial: 1, min: 1 });
    schema.weight = new fields.NumberField({ required: true, nullable: false, initial: 0, min: 0 });

    // Break down roll formula into three independent fields
    schema.roll = new fields.SchemaField({
      diceNum: new fields.NumberField({ ...requiredInteger, initial: 1, min: 1 }),
      diceSize: new fields.StringField({ initial: "d20" }),
      diceBonus: new fields.StringField({ initial: "+@str.mod+ceil(@lvl / 2)" })
    })

    schema.formula = new fields.StringField({ blank: true });

    return schema;
  }

  /**
   * @override
   * @description Builds the complete roll formula from component parts
   * Combines number of dice, die size, and bonus modifiers into a single formula
   * @example
   * // With diceNum: 2, diceSize: "d8", diceBonus: "+@str.mod"
   * // Produces formula: "2d8+@str.mod"
   */
  prepareDerivedData() {
    // Build the formula dynamically using string interpolation
    const roll = this.roll;

    this.formula = `${roll.diceNum}${roll.diceSize}${roll.diceBonus}`
  }
}
