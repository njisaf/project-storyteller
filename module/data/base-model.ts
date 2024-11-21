/**
 * Foundation class for all Project Storyteller data models
 * Provides common functionality and data handling methods
 * @see {@link https://foundryvtt.wiki/en/development/api/data/data-model} FoundryVTT DataModel Documentation
 */

declare global {
  namespace foundry {
    namespace abstract {
      interface TypeDataModel {
        _source: Record<string, unknown>;
        static defineSchema(): foundry.data.fields.SchemaField<any>;
        toObject(): Record<string, unknown>;
        prepareDerivedData(): void;
      }
    }
  }
}

/**
 * Base data model for Project Storyteller system
 * @extends {foundry.abstract.TypeDataModel}
 */
export class StorytellerDataModel extends foundry.abstract.TypeDataModel {
  /**
   * Define the base schema for all Project Storyteller data models
   * @returns {Object} Schema definition
   */
  static defineSchema(): foundry.data.fields.SchemaField<any> {
    return new foundry.data.fields.SchemaField({});
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

  /**
   * Prepare derived data
   * @override
   */
  prepareDerivedData(): void {
    super.prepareDerivedData();
  }
}
