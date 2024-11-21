/// <reference types="../../types/foundry" />
import { onManageActiveEffect, prepareActiveEffectCategories } from '../helpers/effects';

/**
 * Item sheet implementation for Project Storyteller
 * Extends the base ItemSheet class for handling item-specific UI elements
 * @extends {ItemSheet}
 */
export class StorytellerItemSheet extends ItemSheet {
  declare item: Item;
  declare document: Item;
  declare isEditable: boolean;

  static get defaultOptions() {
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

  async getData(): Promise<Record<string, unknown>> {
    const context = await super.getData();
    const itemData = this.document.toObject();
    const description = this.item.system.description || '';

    context.enrichedDescription = await TextEditor.enrichHTML(description, {
      secrets: this.document.isOwner,
      async: true,
      rollData: this.item.getRollData(),
      relativeTo: this.item,
    });

    context.system = itemData.system;
    context.flags = itemData.flags;
    context.config = CONFIG.PROJECT_STORYTELLER;
    context.effects = prepareActiveEffectCategories(this.item.effects);

    return context;
  }

  activateListeners(html: JQuery): void {
    super.activateListeners(html);
    if (!this.isEditable) return;
    html.on('click', '.effect-control', (ev) => onManageActiveEffect(ev, this.item));
  }
}
