/**
 * @module data/base-model
 * @description Base data model class for Project Storyteller system
 */

/**
 * @class StorytellerDataModel
 * @extends {foundry.abstract.TypeDataModel}
 * @description Foundation class for all Project Storyteller data models
 * Provides common functionality and data handling methods
 * @see {@link https://foundryvtt.wiki/en/development/api/data/data-model} FoundryVTT DataModel Documentation
 */
export default class StorytellerDataModel extends foundry.abstract.TypeDataModel {
  /**
   * Convert the schema to a plain object.
   *
   * The built in `toObject()` method will ignore derived data when using Data Models.
   * This additional method will instead use the spread operator to return a simplified
   * version of the data.
   *
   * @returns {object} Plain object either via deepClone or the spread operator.
   */
  toPlainObject() {
    return { ...this };
  }
}
