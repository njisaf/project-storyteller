/**
 * @module project-storyteller
 * @description Main initialization module for the Project Storyteller system in FoundryVTT.
 * This module handles system setup, registration of document classes, sheets, and data models.
 * @see {@link https://foundryvtt.wiki/en/development/api/module} FoundryVTT Module Documentation
 */

// Import document classes.
import { StorytellerActor } from './documents/actor.mjs';
import { StorytellerItem } from './documents/item.mjs';
// Import sheet classes.
import { StorytellerActorSheet } from './sheets/actor-sheet.mjs';
import { StorytellerItemSheet } from './sheets/item-sheet.mjs';
// Import helper/utility classes and constants.
import { preloadHandlebarsTemplates } from './helpers/templates.mjs';
import { PROJECT_STORYTELLER } from './helpers/config.mjs';
// Import DataModel classes
import * as models from './data/_module.mjs';

/**
 * @hook init
 * @description Initializes the Project Storyteller system.
 * Registers document classes, data models, and sheet applications.
 */

Hooks.once('init', function () {
  /**
   * @property {Object} game.projectstoryteller
   * @description Global namespace for Project Storyteller system features.
   * Provides access to core Actor and Item classes and utility functions.
   */
  game.projectstoryteller = {
    StorytellerActor,
    StorytellerItem,
    rollItemMacro,
  };

  // Add custom constants for configuration.
  CONFIG.PROJECT_STORYTELLER = PROJECT_STORYTELLER;

  /**
   * @property {Object} CONFIG.Combat.initiative
   * @description Configure the initiative formula for the system.
   * Uses a d20 roll plus the character's Dexterity modifier.
   */
  CONFIG.Combat.initiative = {
    formula: '1d20 + @abilities.dex.mod',
    decimals: 2,
  };

  /**
   * @description Register document classes and their associated data models
   * @property {Class} CONFIG.Actor.documentClass - The base Actor document class
   * @property {Object} CONFIG.Actor.dataModels - Data models for different actor types
   * @property {Class} CONFIG.Item.documentClass - The base Item document class
   * @property {Object} CONFIG.Item.dataModels - Data models for different item types
   */
  CONFIG.Actor.documentClass = StorytellerActor;

  // Note that you don't need to declare a DataModel
  // for the base actor/item classes - they are included
  // with the Character/NPC as part of super.defineSchema()
  CONFIG.Actor.dataModels = {
    character: models.StorytellerCharacter,
    npc: models.StorytellerNPC
  }
  CONFIG.Item.documentClass = StorytellerItem;
  CONFIG.Item.dataModels = {
    item: models.StorytellerItem,
    feature: models.StorytellerFeature,
    spell: models.StorytellerSpell
  }

  /**
   * @description Configure Active Effects behavior
   * @property {boolean} CONFIG.ActiveEffect.legacyTransferral - Disable legacy effect transfer
   */
  CONFIG.ActiveEffect.legacyTransferral = false;

  /**
   * @description Register sheet application classes
   * Unregisters core sheets and registers system-specific actor and item sheets
   */
  Actors.unregisterSheet('core', ActorSheet);
  Actors.registerSheet('project-storyteller', StorytellerActorSheet, {
    makeDefault: true,
    label: 'PROJECT_STORYTELLER.SheetLabels.Actor',
  });
  Items.unregisterSheet('core', ItemSheet);
  Items.registerSheet('project-storyteller', StorytellerItemSheet, {
    makeDefault: true,
    label: 'PROJECT_STORYTELLER.SheetLabels.Item',
  });

  // Preload Handlebars templates.
  return preloadHandlebarsTemplates();
});

/* -------------------------------------------- */
/*  Handlebars Helpers                          */
/* -------------------------------------------- */

/**
 * @description Register custom Handlebars helpers for template rendering
 * @example
 * {{toLowerCase "TEXT"}} // Outputs: "text"
 */
Handlebars.registerHelper('toLowerCase', function (str) {
  return str.toLowerCase();
});

/* -------------------------------------------- */
/*  Ready Hook                                  */
/* -------------------------------------------- */

/**
 * @hook ready
 * @description Initializes hotbar functionality after all modules have loaded
 */
Hooks.once('ready', function () {
  // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
  Hooks.on('hotbarDrop', (bar, data, slot) => createItemMacro(data, slot));
});

/* -------------------------------------------- */
/*  Hotbar Macros                               */
/* -------------------------------------------- */

/**
 * @function createItemMacro
 * @description Creates or retrieves a macro for an item and assigns it to a hotbar slot
 * @param {Object} data - The dropped item data
 * @param {string} data.type - The type of the dropped data (must be 'Item')
 * @param {string} data.uuid - The UUID of the dropped item
 * @param {number} slot - The hotbar slot to assign the macro to
 * @returns {Promise<boolean>} False to prevent default drop handling
 * @throws {Warning} If the item is not owned by an actor
 */
async function createItemMacro(data, slot) {
  // First, determine if this is a valid owned item.
  if (data.type !== 'Item') return;
  if (!data.uuid.includes('Actor.') && !data.uuid.includes('Token.')) {
    return ui.notifications.warn(
      'You can only create macro buttons for owned Items'
    );
  }
  // If it is, retrieve it based on the uuid.
  const item = await Item.fromDropData(data);

  // Create the macro command using the uuid.
  const command = `game.projectstoryteller.rollItemMacro("${data.uuid}");`;
  let macro = game.macros.find(
    (m) => m.name === item.name && m.command === command
  );
  if (!macro) {
    macro = await Macro.create({
      name: item.name,
      type: 'script',
      img: item.img,
      command: command,
      flags: { 'project-storyteller.itemMacro': true },
    });
  }
  game.user.assignHotbarMacro(macro, slot);
  return false;
}

/**
 * @function rollItemMacro
 * @description Executes a macro created from an item
 * @param {string} itemUuid - The UUID of the item to roll
 * @throws {Warning} If the item cannot be found or is not owned
 */
function rollItemMacro(itemUuid) {
  // Reconstruct the drop data so that we can load the item.
  const dropData = {
    type: 'Item',
    uuid: itemUuid,
  };
  // Load the item from the uuid.
  Item.fromDropData(dropData).then((item) => {
    // Determine if the item loaded and if it's an owned item.
    if (!item || !item.parent) {
      const itemName = item?.name ?? itemUuid;
      return ui.notifications.warn(
        `Could not find item ${itemName}. You may need to delete and recreate this macro.`
      );
    }

    // Trigger the item roll
    item.roll();
  });
}
