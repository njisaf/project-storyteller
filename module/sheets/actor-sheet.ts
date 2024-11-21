import { onManageActiveEffect, prepareActiveEffectCategories, EffectOwner as EffectsModuleOwner } from '../helpers/effects';
import '@types/jquery';

// Utility functions and type declarations
declare global {
  interface String {
    capitalize(): string;
  }

  interface DocumentSheet {
    getData(): Promise<Record<string, unknown>>;
  }

  class DocumentSheetClass extends DocumentSheet {
    static get defaultOptions(): DocumentSheet.Options;
  }

  namespace DocumentSheet {
    interface Options {
      classes?: string[];
      width?: number;
      height?: number;
      tabs?: {
        navSelector: string;
        contentSelector: string;
        initial: string;
      }[];
    }
  }

  namespace foundry {
    namespace utils {
      function duplicate<T>(original: T): T;
      function mergeObject<T>(original: T, other: Partial<T>): T;
    }

    interface Collection<T> {
      get(key: string): T | undefined;
      values(): IterableIterator<T>;
    }
  }
}

interface StorytellerActorSheetData extends Record<string, unknown> {
  actor: Actor;
  data: Record<string, unknown>;
  items: Item[];
  system: Record<string, unknown>;
  flags: Record<string, unknown>;
  cssClass: string;
  config: typeof CONFIG.PROJECT_STORYTELLER;
  effects: ReturnType<typeof prepareActiveEffectCategories>;
  enrichedBiography?: string;
  gear?: Item[];
  features?: Item[];
  spells?: Record<number, Item[]>;
}

function isEffectOwner(obj: unknown): obj is EffectsModuleOwner {
  return obj !== null &&
         typeof obj === 'object' &&
         'effects' in obj &&
         'createEmbeddedDocuments' in obj &&
         'uuid' in obj;
}

/**
 * Actor sheet implementation for Project Storyteller
 * @extends {DocumentSheetClass}
 */
export class StorytellerActorSheet extends DocumentSheetClass {
  declare actor: Actor;
  declare document: Actor & EffectsModuleOwner;
  declare isEditable: boolean;

  static get defaultOptions(): DocumentSheet.Options {
    return foundry.utils.mergeObject(super.defaultOptions as DocumentSheet.Options, {
      classes: ['project-storyteller', 'sheet', 'actor'],
      width: 600,
      height: 600,
      tabs: [{ navSelector: '.sheet-tabs', contentSelector: '.sheet-body', initial: 'features' }],
    });
  }

  get template(): string {
    return `systems/project-storyteller/templates/actor/actor-${this.actor.type}-sheet.hbs`;
  }

  async getData(): Promise<StorytellerActorSheetData> {
    const baseContext = await super.getData();
    const actorItems = Array.from(this.actor.items.values());
    const actorData = this.document.toObject();

    const context: StorytellerActorSheetData = {
      actor: this.actor,
      data: baseContext.data as Record<string, unknown>,
      items: actorItems,
      system: actorData.system as Record<string, unknown>,
      flags: actorData.flags as Record<string, unknown>,
      cssClass: 'storyteller-character-sheet',
      config: CONFIG.PROJECT_STORYTELLER,
      effects: prepareActiveEffectCategories([...this.actor.allApplicableEffects()]),
    };

    if (this.document.type === 'character') {
      this._prepareItems(context);
      this._prepareCharacterData(context);
    }

    if (this.document.type === 'npc') {
      this._prepareItems(context);
    }

    try {
      const rollData = this.actor.getRollData() || {};
      const biography = this.actor.system?.biography || '';

      context.enrichedBiography = await TextEditor.enrichHTML(biography, {
        secrets: this.document.isOwner,
        async: true,
        rollData,
        relativeTo: this.actor,
      });
    } catch (error) {
      console.error("Error enriching biography:", error);
      context.enrichedBiography = this.actor.system?.biography || '';
    }

    return context;
  }

  private _prepareCharacterData(_context: StorytellerActorSheetData): void {
    // Character-specific data preparation will be implemented later
  }

  private _prepareItems(context: StorytellerActorSheetData): void {
    const gear: Item[] = [];
    const features: Item[] = [];
    const spells: Record<number, Item[]> = {
      0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: []
    };

    for (const item of context.items) {
      if (!item) continue;

      const itemImg = item.img || Item.DEFAULT_ICON;
      Object.defineProperty(item, 'img', { value: itemImg, writable: true });

      if (item.type === 'item') {
        gear.push(item);
      } else if (item.type === 'feature') {
        features.push(item);
      } else if (item.type === 'spell' && 'spellLevel' in item.system) {
        const level = item.system.spellLevel as number;
        if (level >= 0 && level <= 9) {
          spells[level].push(item);
        }
      }
    }

    context.gear = gear;
    context.features = features;
    context.spells = spells;
  }

  activateListeners(html: JQuery): void {
    super.activateListeners(html);

    html.on('click', '.item-edit', (ev) => {
      const li = $(ev.currentTarget).parents('.item');
      const item = this.actor.items.get(li.data('itemId'));
      item?.sheet?.render(true);
    });

    if (!this.isEditable) return;

    html.on('click', '.item-create', this._onItemCreate.bind(this));

    html.on('click', '.item-delete', (ev) => {
      const li = $(ev.currentTarget).parents('.item');
      const item = this.actor.items.get(li.data('itemId'));
      item?.delete();
      li.slideUp(200, () => this.render(false));
    });

    html.on('click', '.effect-control', (ev) => {
      const row = ev.currentTarget.closest('li');
      if (!row) return;
      const document = row.dataset.parentId === this.actor.id
        ? this.actor
        : this.actor.items.get(row.dataset.parentId);
      if (document && isEffectOwner(document)) {
        onManageActiveEffect(ev as unknown as MouseEvent, document);
      }
    });

    html.on('click', '.rollable', this._onRoll.bind(this));

    if (this.actor.isOwner) {
      const handler = (ev: DragEvent) => this._onDragStart(ev);
      html.find('li.item').each((_i, li) => {
        if (li.classList.contains('inventory-header')) return;
        li.setAttribute('draggable', 'true');
        li.addEventListener('dragstart', handler, false);
      });
    }
  }

  private async _onItemCreate(event: Event): Promise<Item | undefined> {
    event.preventDefault();
    const header = event.currentTarget as HTMLElement;
    const type = header.dataset.type;
    const data = foundry.utils.duplicate(header.dataset);
    const name = `New ${(type as string).capitalize()}`;

    const itemData = {
      name,
      type,
      system: data,
    };
    delete itemData.system['type'];

    return await Item.create(itemData, { parent: this.actor });
  }

  private async _onRoll(event: Event): Promise<Roll | undefined> {
    event.preventDefault();
    const element = event.currentTarget as HTMLElement;
    const dataset = element.dataset;

    if (dataset.rollType === 'item') {
      const itemId = (element.closest('.item') as HTMLElement)?.dataset.itemId;
      if (itemId) {
        const item = this.actor.items.get(itemId);
        if (item?.roll) return item.roll();
      }
    }

    if (dataset.roll) {
      const label = dataset.label ? `[ability] ${dataset.label}` : '';
      const roll = new Roll(dataset.roll, this.actor.getRollData());
      roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: label,
        rollMode: game.settings.get('core', 'rollMode'),
      });
      return roll;
    }

    return undefined;
  }

  protected _onDragStart(event: DragEvent): void {
    const li = event.currentTarget as HTMLElement;
    if (li.dataset.itemId) {
      const item = this.actor.items.get(li.dataset.itemId);
      if (item) {
        const dragData = {
          type: "Item",
          uuid: item.uuid,
          data: item.toObject()
        };
        event.dataTransfer?.setData("text/plain", JSON.stringify(dragData));
      }
    }
  }
}
