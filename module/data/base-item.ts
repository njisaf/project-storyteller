import { StorytellerDataModel } from "./base-model";

/**
 * Base item data interface for Project Storyteller system
 */
export interface StorytellerItemData {
  description: string;
  name?: string;
  type?: string;
  img?: string;
}

/**
 * Foundation class for all item types in Project Storyteller
 * @extends {StorytellerDataModel}
 */
export class BaseItem extends StorytellerDataModel {
  declare description: string;
  declare name: string;
  declare type: string;
  declare img: string;

  static override defineSchema(): foundry.data.fields.SchemaField<StorytellerItemData> {
    const fields = foundry.data.fields;
    return new fields.SchemaField({
      description: new fields.StringField({ required: true, blank: true }),
      name: new fields.StringField({ required: true }),
      type: new fields.StringField({ required: true }),
      img: new fields.StringField({ required: false, initial: "icons/svg/item-bag.svg" })
    });
  }

  override prepareDerivedData(): void {
    super.prepareDerivedData();
  }
}
