declare global {
  interface CONFIG {
    PROJECT_STORYTELLER: ProjectStoryteller;
  }

  interface ProjectStoryteller {
    abilities: {
      str: string;
      dex: string;
      con: string;
      int: string;
      wis: string;
      cha: string;
    };
    abilityAbbreviations: {
      str: string;
      dex: string;
      con: string;
      int: string;
      wis: string;
      cha: string;
    };
    itemTypes: {
      item: string;
      feature: string;
      spell: string;
    };
    spellLevels: Record<number, string>;
    spellSchools: Record<string, string>;
    effectTypes: {
      temporary: string;
      passive: string;
      inactive: string;
    };
    aspects: {
      focus: string;
      grace: string;
      intellect: string;
      might: string;
    };
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
        item: typeof StorytellerItem;
        feature: typeof StorytellerFeature;
        spell: typeof StorytellerSpell;
      };
    };
    ActiveEffect: {
      legacyTransferral: boolean;
    };
  }

  class StorytellerActor {
    static create(data: object, options?: object): Promise<StorytellerActor>;
  }

  class StorytellerItem {
    static create(data: object, options?: object): Promise<StorytellerItem>;
  }

  class StorytellerCharacter extends StorytellerActor {
    static defineSchema(): foundry.data.fields.SchemaField<StorytellerActorData>;
  }

  class StorytellerNPC extends StorytellerActor {
    static defineSchema(): foundry.data.fields.SchemaField<StorytellerActorData>;
  }

  class StorytellerFeature extends StorytellerItem {
    static defineSchema(): foundry.data.fields.SchemaField<StorytellerItemData>;
  }

  class StorytellerSpell extends StorytellerItem {
    static defineSchema(): foundry.data.fields.SchemaField<StorytellerItemData>;
  }

  var CONFIG: CONFIG;
}

export {};
