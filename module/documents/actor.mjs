/**
 * @class StorytellerActor
 * @extends {Actor}
 * @description Extends the base Actor document for Project Storyteller system.
 * Implements custom roll data structure and data preparation methods.
 * @see {@link https://foundryvtt.wiki/en/development/api/actor} FoundryVTT Actor Documentation
 */
export class StorytellerActor extends Actor {
  /**
   * @override
   * @description Prepares actor data, executing the data preparation workflow:
   * 1. Resets data (clearing active effects)
   * 2. Prepares base data
   * 3. Prepares embedded documents (including active effects)
   * 4. Prepares derived data
   */
  prepareData() {
    // Prepare data for the actor. Calling the super version of this executes
    // the following, in order: data reset (to clear active effects),
    // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
    // prepareDerivedData().
    super.prepareData();
  }

  /**
   * @override
   * @description Prepares base actor data before processing embedded documents or derived data.
   * This is where you should modify core actor data that doesn't depend on items or effects.
   */
  prepareBaseData() {
    // Data modifications in this step occur before processing embedded
    // documents or derived data.
  }

  /**
   * @override
   * @description Augments actor data with additional dynamic data not handled by the DataModel.
   * Calculated data here is available both inside and outside character sheets.
   * @example Accessing derived data:
   * ```javascript
   * const actor = game.actors.get(actorId);
   * const derivedData = actor.system; // Contains data calculated here
   * ```
   */
  prepareDerivedData() {
    const actorData = this;
    const flags = actorData.flags.projectstoryteller || {};
  }

  /**
   * @override
   * @description Provides roll data for the actor by combining base roll data with system-specific data.
   * Uses a polymorphic approach to support different actor types with shared parent Document.
   * @returns {Object} Combined roll data from both Actor and DataModel
   */
  getRollData() {
    return { ...super.getRollData(), ...this.system.getRollData?.() ?? null };
  }

  /**
   * @description Converts the actor document to a plain object, preserving derived data.
   * Unlike the built-in toObject() method, this includes data calculated by Data Models.
   * @returns {Object} Plain object containing:
   * - All actor properties via spread operator
   * - Simplified system data
   * - Items array (if any exist)
   * - Effects array (if any exist)
   */
  toPlainObject() {
    const result = {...this};

    // Simplify system data.
    result.system = this.system.toPlainObject();

    // Add items.
    result.items = this.items?.size > 0 ? this.items.contents : [];

    // Add effects.
    result.effects = this.effects?.size > 0 ? this.effects.contents : [];

    return result;
  }

}
