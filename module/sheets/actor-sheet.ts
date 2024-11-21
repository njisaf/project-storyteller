import { onManageActiveEffect, prepareActiveEffectCategories } from '../helpers/effects';

declare global {
  interface JQuery {
    slideUp: (duration: number, callback: () => void) => void;
    parents: (selector: string) => JQuery;
    data: (key: string) => any;
    find: (selector: string) => JQuery;
    each: (callback: (index: number, element: HTMLElement) => void) => void;
    on: (event: string, selector: string, callback: (event: JQuery.ClickEvent) => void) => void;
  }

  interface HTMLElement {
    dataset: DOMStringMap;
    classList: {
      contains: (className: string) => boolean;
    };
  }
}

/**
 * Actor sheet implementation for Project Storyteller
 * @extends {ActorSheet}
 */
export class StorytellerActorSheet extends (globalThis as any).ActorSheet {
  actor!: Actor;
  document!: Actor;
  isEditable!: boolean;

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ['project-storyteller', 'sheet', 'actor'],
      width: 600,
      height: 600,
      tabs: [
        {
          navSelector: '.sheet-tabs',
          contentSelector: '.sheet-body',
          initial: 'features',
        },
      ],
    });
  }

  get template(): string {
    return `systems/project-storyteller/templates/actor/actor-${this.actor.type}-sheet.hbs`;
  }

  async getData(): Promise<Record<string, unknown>> {
    const context = await super.getData();

    if (!context || !context.data) {
      console.error("Context data is missing.");
    }

    const actorData = this.document.toObject();

    context.system = actorData.system;
    context.flags = actorData.flags;
    context.cssClass = 'storyteller-character-sheet';
    context.config = CONFIG.PROJECT_STORYTELLER;

    if (actorData.type == 'character') {
      this._prepareItems(context);
      this._prepareCharacterData(context);
    }

    if (actorData.type == 'npc') {
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

    context.effects = prepareActiveEffectCategories(this.actor.allApplicableEffects());

    return context;
  }

  private _prepareCharacterData(context: Record<string, unknown>): void {
    // Character-specific data preparation
  }

  private _prepareItems(context: { items: Item[] } & Record<string, unknown>): void {
    const gear: Item[] = [];
    const features: Item[] = [];
    const spells: Record<number, Item[]> = {
      0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: []
    };

    for (const i of context.items) {
      i.img = i.img || Item.DEFAULT_ICON;

      if (i.type === 'item') {
        gear.push(i);
      } else if (i.type === 'feature') {
        features.push(i);
      } else if (i.type === 'spell' && i.system.spellLevel !== undefined) {
        spells[i.system.spellLevel].push(i);
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
      onManageActiveEffect(ev, document);
    });

    html.on('click', '.rollable', this._onRoll.bind(this));

    if (this.actor.isOwner) {
      const handler = (ev: DragEvent) => this._onDragStart(ev);
      html.find('li.item').each((i, li) => {
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
    const data = duplicate(header.dataset);
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

    if (dataset.rollType) {
      if (dataset.rollType === 'item') {
        const itemId = (element.closest('.item') as HTMLElement)?.dataset.itemId;
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
  }
}
