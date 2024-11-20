/**
 * @module data/actor-npc
 * @description NPC-specific data model implementation for Project Storyteller
 */

import StorytellerActorBase from "./base-actor.mjs";

/**
 * @class StorytellerNPC
 * @extends {StorytellerActorBase}
 * @description Data model for non-player character actors, implementing NPC-specific
 * attributes like Challenge Rating (CR) and Experience Points (XP)
 */
export default class StorytellerNPC extends StorytellerActorBase {
  /**
   * @static
   * @returns {Object} Schema definition for NPC-specific data
   * @description Defines additional fields for NPC documents:
   * - cr: Challenge Rating, determines NPC difficulty
   * - xp: Experience Points awarded for defeating the NPC
   */
  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    schema.cr = new fields.NumberField({ ...requiredInteger, initial: 1, min: 0 });
    schema.xp = new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 });

    return schema;
  }

  /**
   * @override
   * @description Calculates derived values for NPC data:
   * - Calls parent class calculations
   * - Computes XP value based on CR (CR² × 100)
   */
  prepareDerivedData() {
    super.prepareDerivedData();
    this.xp = this.cr * this.cr * 100;
  }
}
