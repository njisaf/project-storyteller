/**
 * Extends the base Actor document for Project Storyteller system
 * @extends {Actor}
 */

declare global {
  namespace foundry {
    namespace utils {
      class Collection<T> {
        size: number;
        contents: T[];
      }
    }
  }
  class Actor {
    prepareData(): void;
    prepareBaseData(): void;
    prepareDerivedData(): void;
    getRollData(): Record<string, unknown>;
  }
}

export class StorytellerActor extends Actor {
  declare flags: {
    projectstoryteller: Record<string, unknown>;
    [key: string]: unknown;
  };

  declare system: {
    getRollData?: () => Record<string, unknown>;
    toPlainObject: () => Record<string, unknown>;
  } & Record<string, unknown>;

  declare items?: foundry.utils.Collection<unknown>;
  declare effects?: foundry.utils.Collection<unknown>;

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
    super.prepareDerivedData();
    // Additional derived data calculations can be added here
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
    const result: Record<string, unknown> = { ...this };
    if (this.system.toPlainObject) {
      result.system = this.system.toPlainObject();
    }
    result.items = this.items?.size > 0 ? this.items.contents : [];
    result.effects = this.effects?.size > 0 ? this.effects.contents : [];
    return result;
  }
}
