/**
 * Main initialization module for the Project Storyteller system in FoundryVTT
 */

import { StorytellerActor } from './documents/actor';
import { StorytellerItem } from './documents/item';
import { StorytellerActorSheet } from './sheets/actor-sheet';
import { StorytellerItemSheet } from './sheets/item-sheet';
import { preloadHandlebarsTemplates } from './helpers/templates';
import { PROJECT_STORYTELLER } from './helpers/config';
import { StorytellerCharacter, StorytellerNPC, StorytellerItem as StorytellerItemModel, StorytellerFeature, StorytellerSpell } from './data/_module';

declare global {
  namespace foundry {
    interface Collection<T> {
      find: (predicate: (item: T) => boolean) => T | undefined;
    }

    interface DataModel {
      _source: Record<string, unknown>;
      toObject(): Record<string, unknown>;
      toPlainObject(): Record<string, unknown>;
      prepareDerivedData(): void;
    }

    interface DocumentSheet {
      defaultOptions: Record<string, unknown>;
    }
  }

  interface ActorSheet extends foundry.DocumentSheet {}
  interface ItemSheet extends foundry.DocumentSheet {}

  interface Game {
    projectstoryteller: {
      StorytellerActor: typeof StorytellerActor;
      StorytellerItem: typeof StorytellerItem;
      rollItemMacro: (itemUuid: string) => void;
    };
    macros: foundry.utils.Collection<Macro>;
    user: User;
  }

  interface CONFIG {
    PROJECT_STORYTELLER: ProjectStoryteller;
    Combat: {
      initiative: {
        formula: string;
        decimals: number;
      };
    };
    Actor: {
      documentClass: typeof StorytellerActor;
      dataModels: {
        character: typeof StorytellerCharacter;
        npc: typeof StorytellerNPC;
      };
    };
    Item: {
      documentClass: typeof StorytellerItem;
      dataModels: {
        item: typeof StorytellerItemModel;
        feature: typeof StorytellerFeature;
        spell: typeof StorytellerSpell;
      };
    };
    ActiveEffect: {
      legacyTransferral: boolean;
    };
  }

  interface Actors {
    unregisterSheet: (scope: string, sheetClass: typeof ActorSheet) => void;
    registerSheet: (
      scope: string,
      sheetClass: typeof StorytellerActorSheet,
      options: { makeDefault: boolean; label: string }
    ) => void;
  }

  interface Items {
    unregisterSheet: (scope: string, sheetClass: typeof ItemSheet) => void;
    registerSheet: (
      scope: string,
      sheetClass: typeof StorytellerItemSheet,
      options: { makeDefault: boolean; label: string }
    ) => void;
  }

  interface Item extends foundry.DataModel {
    fromDropData(data: { type: string; uuid: string }): Promise<Item>;
    parent: Actor | null;
    name: string;
    img: string;
    roll(): Promise<Roll>;
  }

  interface Macro {
    name: string;
    command: string;
    create: (data: {
      name: string;
      type: string;
      img: string | undefined;
      command: string;
      flags: Record<string, unknown>;
    }) => Promise<Macro>;
  }

  interface User {
    assignHotbarMacro: (macro: Macro, slot: number) => void;
  }

  interface UI {
    notifications: {
      warn: (message: string) => void;
    };
  }

  var game: Game;
  var CONFIG: CONFIG;
  var Actors: Actors;
  var Items: Items;
  var Item: Item;
  var Macro: { create: Macro['create'] };
  var ui: UI;
  var Hooks: {
    once: (hook: string, callback: (...args: any[]) => void) => void;
    on: (hook: string, callback: (...args: any[]) => void) => void;
  };
  var Handlebars: {
    registerHelper: (name: string, fn: (str: string) => string) => void;
  };
}

// Initialize system
Hooks.once('init', async function() {
  game.projectstoryteller = {
    StorytellerActor,
    StorytellerItem,
    rollItemMacro,
  };

  CONFIG.PROJECT_STORYTELLER = PROJECT_STORYTELLER;

  CONFIG.Combat.initiative = {
    formula: '1d20 + @abilities.dex.mod',
    decimals: 2,
  };

  CONFIG.Actor.documentClass = StorytellerActor;
  CONFIG.Actor.dataModels = {
    character: StorytellerCharacter,
    npc: StorytellerNPC
  };

  CONFIG.Item.documentClass = StorytellerItem;
  CONFIG.Item.dataModels = {
    item: StorytellerItemModel,
    feature: StorytellerFeature,
    spell: StorytellerSpell
  };

  CONFIG.ActiveEffect.legacyTransferral = false;

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

  await preloadHandlebarsTemplates();
});

// Register Handlebars helpers
Handlebars.registerHelper('toLowerCase', function(str: string) {
  return str.toLowerCase();
});

// Initialize hotbar macros
Hooks.once('ready', function() {
  Hooks.on('hotbarDrop', (_bar, data, slot) => createItemMacro(data, slot));
});

async function createItemMacro(data: { type: string; uuid: string }, slot: number): Promise<boolean> {
  if (data.type !== 'Item') return true;

  if (!data.uuid.includes('Actor.') && !data.uuid.includes('Token.')) {
    ui.notifications.warn('You can only create macro buttons for owned Items');
    return false;
  }

  const item = await Item.fromDropData(data);
  const command = `game.projectstoryteller.rollItemMacro("${data.uuid}");`;

  let macro = game.macros.find(
    (m) => m.name === item.name && m.command === command
  );

  if (!macro) {
    macro = await Macro.create({
      name: item.name ?? '',
      type: 'script',
      img: item.img,
      command: command,
      flags: { 'project-storyteller.itemMacro': true },
    });
  }

  game.user.assignHotbarMacro(macro, slot);
  return false;
}

function rollItemMacro(itemUuid: string): void {
  const dropData = {
    type: 'Item',
    uuid: itemUuid,
  };

  Item.fromDropData(dropData).then((item) => {
    if (!item || !item.parent) {
      const itemName = item?.name ?? itemUuid;
      ui.notifications.warn(
        `Could not find item ${itemName}. You may need to delete and recreate this macro.`
      );
      return;
    }

    item.roll();
  });
}
