/**
 * @class StorytellerItem
 * @extends {Item}
 * @description Extends the base Item document for Project Storyteller system.
 * Implements custom roll handling and data preparation methods.
 * @see {@link https://foundryvtt.wiki/en/development/api/item} FoundryVTT Item Documentation
 */
export class StorytellerItem extends Item {
  /**
   * @override
   * @description Augments the basic Item data model with additional dynamic data.
   * Follows the standard document data preparation workflow.
   */
  prepareData() {
    // As with the actor class, items are documents that can have their data
    // preparation methods overridden (such as prepareBaseData()).
    super.prepareData();
  }

  /**
   * @override
   * @description Prepares roll data for dice commands against this Item
   * @returns {Object} Roll data object containing:
   * - Shallow copy of item's system data
   * - Actor's roll data (if item is owned by an actor)
   */
  getRollData() {
    // Starts off by populating the roll data with a shallow copy of `this.system`
    const rollData = { ...this.system };

    // Quit early if there's no parent actor
    if (!this.actor) return rollData;

    // If present, add the actor's roll data
    rollData.actor = this.actor.getRollData();

    return rollData;
  }

  /**
   * Convert the actor document to a plain object.
   *
   * The built in `toObject()` method will ignore derived data when using Data Models.
   * This additional method will instead use the spread operator to return a simplified
   * version of the data.
   *
   * @returns {object} Plain object either via deepClone or the spread operator.
   */
  toPlainObject() {
    const result = { ...this };

    // Simplify system data.
    result.system = this.system.toPlainObject();

    // Add effects.
    result.effects = this.effects?.size > 0 ? this.effects.contents : [];

    return result;
  }

  /**
   * @description Handles item rolls, creating appropriate chat messages
   * @returns {Promise<Roll|void>} Returns Roll object if formula exists, void otherwise
   * @example
   * ```javascript
   * const item = actor.items.getName("Sword");
   * await item.roll(); // Rolls the item and creates chat message
   * ```
   */
  async roll() {
    /**
     * @type {StorytellerItem}
     * @description Reference to the item being rolled
     */
    const item = this;

    // Initialize chat data.
    const speaker = ChatMessage.getSpeaker({ actor: this.actor });
    const rollMode = game.settings.get('core', 'rollMode');
    const label = `[${item.type}] ${item.name}`;

    // If there's no roll data, send a chat message.
    if (!this.system.formula) {
      ChatMessage.create({
        speaker: speaker,
        rollMode: rollMode,
        flavor: label,
        content: item.system.description ?? '',
      });
    }
    // Otherwise, create a roll and send a chat message from it.
    else {
      // Retrieve roll data.
      const rollData = this.getRollData();

      // Invoke the roll and submit it to chat.
      const roll = new Roll(rollData.formula, rollData.actor);
      // If you need to store the value first, uncomment the next line.
      // const result = await roll.evaluate();
      roll.toMessage({
        speaker: speaker,
        rollMode: rollMode,
        flavor: label,
      });
      return roll;
    }
  }
}
