/**
 * @module sheets/actor-sheet
 */

import {
  onManageActiveEffect,
  prepareActiveEffectCategories,
} from '../helpers/effects.mjs';

/**
 * @class StorytellerActorSheet
 * @extends {ActorSheet}
 * @description Actor sheet (character sheet) implementation for Project Storyteller.
 * Provides the interface for viewing and editing actor data.
 * @see {@link https://foundryvtt.wiki/en/development/api/sheets} FoundryVTT Sheet Documentation
 */
export class StorytellerActorSheet extends ActorSheet {
  /**
   * @override
   * @static
   * @returns {Object} Default options for the actor sheet
   * @property {Array} classes - CSS classes applied to the sheet
   * @property {number} width - Default sheet width
   * @property {number} height - Default sheet height
   * @property {Array} tabs - Tab configuration for the sheet
   */
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

  /**
   * @override
   * @returns {string} Path to the actor sheet template
   * @description Dynamically returns the appropriate template based on actor type
   */
  get template() {
    console.log("🚀 ~ StorytellerActorSheet ~ gettemplate ~ this.actor.type:", this.actor.type)
    return `systems/project-storyteller/templates/actor/actor-${this.actor.type}-sheet.hbs`;
  }

  /* -------------------------------------------- */

  /**
   * @override
   * @async
   * @returns {Object} Data object to be passed to the sheet template
   * @description Prepares data for the actor sheet template, including:
   * - Basic actor data and flags
   * - Prepared items sorted by category
   * - Enriched HTML content
   * - Active effects categorized for display
   */
  async getData() {
    // Retrieve the data structure from the base sheet. You can inspect or log
    // the context variable to see the structure, but some key properties for
    // sheets are the actor object, the data object, whether or not it's
    // editable, the items array, and the effects array.
    const context = super.getData();
    console.log("🚀 ~ StorytellerActorSheet ~ getData ~ context INITIAL:", context)

    if (!context || !context.data) {
      console.error("Context data is missing.");
    }

    // Use a safe clone of the actor data for further operations.
    const actorData = this.document.toPlainObject();

    // Add the actor's data to context.data for easier access, as well as flags.
    context.system = actorData.system;
    context.flags = actorData.flags;

    // Add cssClass
    // TODO: This can't be right
    context.cssClass = 'storyteller-character-sheet';

    // Adding a pointer to CONFIG.PROJECT_STORYTELLER
    context.config = CONFIG.PROJECT_STORYTELLER;

    // Prepare character data and items.
    if (actorData.type == 'character') {
      this._prepareItems(context);
      this._prepareCharacterData(context);
    }

    // Prepare NPC data and items.
    if (actorData.type == 'npc') {
      this._prepareItems(context);
    }

    // Enrich biography info for display
    // Enrichment turns text like `[[/r 1d20]]` into buttons
    context.enrichedBiography = await TextEditor.enrichHTML(
      this.actor.system.biography,
      {
        // Whether to show secret blocks in the finished html
        secrets: this.document.isOwner,
        // Necessary in v11, can be removed in v12
        async: true,
        // Data to fill in for inline rolls
        rollData: this.actor.getRollData(),
        // Relative UUID resolution
        relativeTo: this.actor,
      }
    );

    // Prepare active effects
    context.effects = prepareActiveEffectCategories(
      // A generator that returns all effects stored on the actor
      // as well as any items
      this.actor.allApplicableEffects()
    );
    console.log("🚀 ~ StorytellerActorSheet ~ getData ~ context FINAL:", context)

    return context;
  }

  /**
   * @private
   * @param {Object} context - The data context being prepared
   * @description Prepares character-specific data for the sheet
   */
  _prepareCharacterData(context) {
    // This is where you can enrich character-specific editor fields
    // or setup anything else that's specific to this type
  }

  /**
   * @private
   * @param {Object} context - The data context being prepared
   * @description Organizes items into categories (gear, features, spells)
   * for easier template rendering and management
   */
  _prepareItems(context) {
    // Initialize containers.
    const gear = [];
    const features = [];
    const spells = {
      0: [],
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
      7: [],
      8: [],
      9: [],
    };

    // Iterate through items, allocating to containers
    for (let i of context.items) {
      i.img = i.img || Item.DEFAULT_ICON;
      // Append to gear.
      if (i.type === 'item') {
        gear.push(i);
      }
      // Append to features.
      else if (i.type === 'feature') {
        features.push(i);
      }
      // Append to spells.
      else if (i.type === 'spell') {
        if (i.system.spellLevel != undefined) {
          spells[i.system.spellLevel].push(i);
        }
      }
    }

    // Assign and return
    context.gear = gear;
    context.features = features;
    context.spells = spells;
  }

  /* -------------------------------------------- */

  /**
   * @override
   * @param {jQuery} html - The rendered HTML of the sheet
   * @description Activates event listeners for the actor sheet
   * @listens click.item-edit - Opens item sheet for editing
   * @listens click.item-create - Creates new item
   * @listens click.item-delete - Deletes existing item
   * @listens click.effect-control - Manages active effects
   * @listens click.rollable - Handles ability/item rolls
   */
  activateListeners(html) {
    super.activateListeners(html);

    // Render the item sheet for viewing/editing prior to the editable check.
    html.on('click', '.item-edit', (ev) => {
      const li = $(ev.currentTarget).parents('.item');
      const item = this.actor.items.get(li.data('itemId'));
      item.sheet.render(true);
    });

    // -------------------------------------------------------------
    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Add Inventory Item
    html.on('click', '.item-create', this._onItemCreate.bind(this));

    // Delete Inventory Item
    html.on('click', '.item-delete', (ev) => {
      const li = $(ev.currentTarget).parents('.item');
      const item = this.actor.items.get(li.data('itemId'));
      item.delete();
      li.slideUp(200, () => this.render(false));
    });

    // Active Effect management
    html.on('click', '.effect-control', (ev) => {
      const row = ev.currentTarget.closest('li');
      const document =
        row.dataset.parentId === this.actor.id
          ? this.actor
          : this.actor.items.get(row.dataset.parentId);
      onManageActiveEffect(ev, document);
    });

    // Rollable abilities.
    html.on('click', '.rollable', this._onRoll.bind(this));

    // Drag events for macros.
    if (this.actor.isOwner) {
      let handler = (ev) => this._onDragStart(ev);
      html.find('li.item').each((i, li) => {
        if (li.classList.contains('inventory-header')) return;
        li.setAttribute('draggable', true);
        li.addEventListener('dragstart', handler, false);
      });
    }
  }

  /**
   * @private
   * @async
   * @param {Event} event - The originating click event
   * @returns {Promise<Item>} The newly created item
   * @description Creates a new item owned by the actor
   */
  async _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    // Get the type of item to create.
    const type = header.dataset.type;
    // Grab any data associated with this control.
    const data = duplicate(header.dataset);
    // Initialize a default name.
    const name = `New ${type.capitalize()}`;
    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      system: data,
    };
    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.system['type'];

    // Finally, create the item!
    return await Item.create(itemData, { parent: this.actor });
  }

  /**
   * @private
   * @param {Event} event - The originating click event
   * @returns {Promise<Roll>} The roll result if applicable
   * @description Handles clickable rolls from the character sheet
   * Supports both item rolls and direct formula rolls
   */
  _onRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

    // Handle item rolls.
    if (dataset.rollType) {
      if (dataset.rollType == 'item') {
        const itemId = element.closest('.item').dataset.itemId;
        const item = this.actor.items.get(itemId);
        if (item) return item.roll();
      }
    }

    // Handle rolls that supply the formula directly.
    if (dataset.roll) {
      let label = dataset.label ? `[ability] ${dataset.label}` : '';
      let roll = new Roll(dataset.roll, this.actor.getRollData());
      roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: label,
        rollMode: game.settings.get('core', 'rollMode'),
      });
      return roll;
    }
  }
}
