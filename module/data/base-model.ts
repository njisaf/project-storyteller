/**
 * Foundation class for all Project Storyteller data models
 * Provides common functionality and data handling methods
 * @see {@link https://foundryvtt.wiki/en/development/api/data/data-model} FoundryVTT DataModel Documentation
 */
export class StorytellerDataModel extends (globalThis as any).foundry.abstract.TypeDataModel {
  /**
   * Define the base schema for all Project Storyteller data models
   * @returns {Object} Schema definition
   */
  static defineSchema(): Record<string, unknown> {
    return {};
  }

  /**
   * Convert the schema to a plain object.
   * The built in `toObject()` method will ignore derived data when using Data Models.
   * This additional method will instead use the spread operator to return a simplified
   * version of the data.
   * @returns Plain object via the spread operator.
   */
  toPlainObject(): Record<string, unknown> {
    return { ...this._source };
  }
}
