/// <reference types="../../types/foundry" />

/**
 * Extends the base Item document for Project Storyteller system
 * @extends {Item}
 */
export class StorytellerItem extends Item {
  declare actor: Actor | null;

  declare system: {
    formula?: string;
    description?: string;
    toPlainObject: () => Record<string, unknown>;
  } & Record<string, unknown>;

  declare effects?: foundry.utils.Collection<unknown>;
  declare type: string;
  declare name: string;

  /**
   * @override
   * Augments the basic Item data model with additional dynamic data
   */
  prepareData(): void {
    super.prepareData();
  }

  /**
   * @override
   * Prepares roll data for dice commands against this Item
   */
  getRollData(): Record<string, unknown> {
    const rollData = { ...this.system };
    if (!this.actor) return rollData;
    rollData.actor = this.actor.getRollData();
    return rollData;
  }

  /**
   * Convert the item document to a plain object
   */
  toPlainObject(): Record<string, unknown> {
    const result: Record<string, unknown> = { ...this };
    if (this.system.toPlainObject) {
      result.system = this.system.toPlainObject();
    }
    if (this.effects?.size > 0) {
      result.effects = this.effects.contents;
    }
    return result;
  }

  /**
   * Handles item rolls, creating appropriate chat messages
   */
  async roll(): Promise<Roll | void> {
    const item = this;
    const speaker = ChatMessage.getSpeaker({ actor: this.actor });
    const rollMode = game.settings.get('core', 'rollMode');
    const label = `[${item.type}] ${item.name}`;

    if (!this.system.formula) {
      ChatMessage.create({
        speaker,
        rollMode,
        flavor: label,
        content: item.system.description ?? '',
      });
      return;
    }

    const rollData = this.getRollData();
    const roll = new Roll(this.system.formula, rollData);
    roll.toMessage({
      speaker,
      rollMode,
      flavor: label,
    });
    return roll;
  }
}
