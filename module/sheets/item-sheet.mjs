/**
 * @module sheets/item-sheet
 */

import {
  onManageActiveEffect,
  prepareActiveEffectCategories,
} from '../helpers/effects.mjs';

/**
 * @class StorytellerItemSheet
 * @extends {ItemSheet}
 * @description Item sheet (item interface) implementation for Project Storyteller.
 * Provides the interface for viewing and editing item data.
 * @see {@link https://foundryvtt.wiki/en/development/api/sheets} FoundryVTT Sheet Documentation
 */
export class StorytellerItemSheet extends ItemSheet {
  /**
   * @override
   * @static
   * @returns {Object} Default options for the item sheet
   * @property {Array} classes - CSS classes applied to the sheet
   * @property {number} width - Default sheet width
   * @property {number} height - Default sheet height
   * @property {Array} tabs - Tab configuration for the sheet
   */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ['project-storyteller', 'sheet', 'item'],
      width: 520,
      height: 480,
      tabs: [
        {
          navSelector: '.sheet-tabs',
          contentSelector: '.sheet-body',
          initial: 'description',
        },
      ],
    });
  }

  /**
   * @override
   * @returns {string} Path to the item sheet template
   * @description Returns a type-specific template path for different item types
   * @example
   * // For an item of type "weapon"
   * // Returns: "systems/project-storyteller/templates/item/item-weapon-sheet.hbs"
   */
  get template() {
    const path = 'systems/project-storyteller/templates/item';
    // Return a single sheet for all item types.
    // return `${path}/item-sheet.hbs`;

    // Alternatively, you could use the following return statement to do a
    // unique item sheet by type, like `weapon-sheet.hbs`.
    return `${path}/item-${this.item.type}-sheet.hbs`;
  }

  /* -------------------------------------------- */

  /**
   * @override
   * @async
   * @returns {Object} Data object to be passed to the sheet template
   * @description Prepares data for the item sheet template, including:
   * - Basic item data and flags
   * - Enriched HTML description
   * - Active effects categorized for display
   * - System configuration reference
   */
  async getData() {
    // Retrieve base data structure.
    const context = super.getData();

    // Use a safe clone of the item data for further operations.
    const itemData = this.document.toPlainObject();

    // Enrich description info for display
    // Enrichment turns text like `[[/r 1d20]]` into buttons
    context.enrichedDescription = await TextEditor.enrichHTML(
      this.item.system.description,
      {
        // Whether to show secret blocks in the finished html
        secrets: this.document.isOwner,
        // Necessary in v11, can be removed in v12
        async: true,
        // Data to fill in for inline rolls
        rollData: this.item.getRollData(),
        // Relative UUID resolution
        relativeTo: this.item,
      }
    );

    // Add the item's data to context.data for easier access, as well as flags.
    context.system = itemData.system;
    context.flags = itemData.flags;

    // Adding a pointer to CONFIG.PROJECT_STORYTELLER
    context.config = CONFIG.PROJECT_STORYTELLER;

    // Prepare active effects for easier access
    context.effects = prepareActiveEffectCategories(this.item.effects);

    return context;
  }

  /* -------------------------------------------- */

  /**
   * @override
   * @param {jQuery} html - The rendered HTML of the sheet
   * @description Activates event listeners for the item sheet
   * @listens click.effect-control - Manages active effects
   */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Roll handlers, click handlers, etc. would go here.

    // Active Effect management
    html.on('click', '.effect-control', (ev) =>
      onManageActiveEffect(ev, this.item)
    );
  }
}
