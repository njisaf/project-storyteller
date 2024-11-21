/// <reference types="../../types/foundry" />
import { onManageActiveEffect, prepareActiveEffectCategories, EffectOwner } from '../helpers/effects';
import '@types/jquery';

declare global {
  class ItemSheetClass extends DocumentSheet {
    static get defaultOptions(): DocumentSheet.Options;
  }

  interface DocumentSheet {
    getData(): Promise<Record<string, unknown>>;
  }
}

interface StorytellerItemSheetData extends Record<string, unknown> {
  enrichedDescription?: string;
  system: Record<string, unknown>;
  flags: Record<string, unknown>;
  config: typeof CONFIG.PROJECT_STORYTELLER;
  effects: ReturnType<typeof prepareActiveEffectCategories>;
}

/**
 * Item sheet implementation for Project Storyteller
 * Extends the base ItemSheet class for handling item-specific UI elements
 * @extends {ItemSheet}
 */
export class StorytellerItemSheet extends ItemSheetClass {
  declare item: Item & EffectOwner;
  declare document: Item & EffectOwner;
  declare isEditable: boolean;

  static get defaultOptions(): DocumentSheet.Options {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ['project-storyteller', 'sheet', 'item'],
      width: 520,
      height: 480,
      tabs: [{ navSelector: '.sheet-tabs', contentSelector: '.sheet-body', initial: 'description' }],
    });
  }

  get template(): string {
    const path = 'systems/project-storyteller/templates/item';
    return `${path}/item-${this.item.type}-sheet.hbs`;
  }

  async getData(): Promise<StorytellerItemSheetData> {
    const baseContext = await super.getData();
    const itemData = this.document.toObject() as {
      system: Record<string, unknown>;
      flags: Record<string, unknown>;
    };
    const description = this.item.system.description || '';

    const context: StorytellerItemSheetData = {
      ...baseContext,
      system: itemData.system,
      flags: itemData.flags,
      config: CONFIG.PROJECT_STORYTELLER,
      effects: prepareActiveEffectCategories(this.item.effects),
    };

    try {
      context.enrichedDescription = await TextEditor.enrichHTML(description, {
        secrets: this.document.isOwner,
        async: true,
        rollData: this.item.getRollData(),
        relativeTo: this.item,
      });
    } catch (error) {
      console.error("Error enriching description:", error);
      context.enrichedDescription = description;
    }

    return context;
  }

  activateListeners(html: JQuery): void {
    super.activateListeners(html);
    if (!this.isEditable) return;
    html.on('click', '.effect-control', (ev) => onManageActiveEffect(ev as unknown as MouseEvent, this.item));
  }
}
