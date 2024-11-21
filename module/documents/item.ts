/// <reference types="../../types/foundry" />

/**
 * Extends the base Item document for Project Storyteller system
 * @extends {Item}
 */
export class StorytellerItem extends Item {
  actor?: {
    getRollData: () => Record<string, unknown>;
  };

  system: {
    formula?: string;
    description?: string;
    toPlainObject: () => Record<string, unknown>;
  } & Record<string, unknown>;

  effects?: foundry.utils.Collection<unknown>;
  type: string;
  name: string;

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
    const result = { ...this };
    result.system = this.system.toPlainObject();
    result.effects = this.effects?.size > 0 ? this.effects.contents : [];
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

interface Roll {
  toMessage(options: {
    speaker: unknown;
    rollMode: string;
    flavor: string;
  }): void;
}
