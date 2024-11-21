import { StorytellerDataModel } from "./base-model";

/**
 * Base item data interface for Project Storyteller system
 */
export interface StorytellerItemData {
  description: string;
}

/**
 * Foundation class for all item types in Project Storyteller
 * @extends {StorytellerDataModel}
 */
export class StorytellerItemBase extends StorytellerDataModel {
  declare description: string;

  /**
   * Defines the core schema for all item documents
   * @returns Schema definition for base item data
   */
  static override defineSchema() {
    const fields = (globalThis as any).foundry.data.fields;
    return new fields.SchemaField({
      description: new fields.StringField({ required: true, blank: true })
    });
  }
}
