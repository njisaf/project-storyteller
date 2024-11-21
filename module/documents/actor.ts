/**
 * Extends the base Actor document for Project Storyteller system
 * @extends {Actor}
 */
export class StorytellerActor extends (globalThis as any).Actor {
  flags: {
    projectstoryteller: Record<string, unknown>;
    [key: string]: unknown;
  };

  system: {
    getRollData?: () => Record<string, unknown>;
    toPlainObject: () => Record<string, unknown>;
  } & Record<string, unknown>;

  items?: foundry.utils.Collection<unknown>;
  effects?: foundry.utils.Collection<unknown>;

  /**
   * @override
   * Prepares actor data, executing the data preparation workflow:
   * 1. Resets data (clearing active effects)
   * 2. Prepares base data
   * 3. Prepares embedded documents (including active effects)
   * 4. Prepares derived data
   */
  prepareData(): void {
    super.prepareData();
  }

  /**
   * @override
   * Prepares base actor data before processing embedded documents or derived data
   */
  prepareBaseData(): void {
    // Data modifications in this step occur before processing embedded documents or derived data
  }

  /**
   * @override
   * Augments actor data with additional dynamic data not handled by the DataModel
   */
  prepareDerivedData(): void {
    const actorData = this;
    const flags = actorData.flags.projectstoryteller || {};
  }

  /**
   * @override
   * Provides roll data for the actor
   * @returns Combined roll data from both Actor and DataModel
   */
  getRollData(): Record<string, unknown> {
    return { ...super.getRollData(), ...this.system.getRollData?.() ?? null };
  }

  /**
   * Converts the actor document to a plain object, preserving derived data
   * @returns Plain object containing actor properties, system data, items, and effects
   */
  toPlainObject(): Record<string, unknown> {
    const result = { ...this };
    result.system = this.system.toPlainObject();
    result.items = this.items?.size > 0 ? this.items.contents : [];
    result.effects = this.effects?.size > 0 ? this.effects.contents : [];
    return result;
  }
}
