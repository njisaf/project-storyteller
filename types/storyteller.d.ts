declare global {
  interface StorytellerActorData {
    aspects: {
      focus: { value: number; modifier: number };
      grace: { value: number; modifier: number };
      intellect: { value: number; modifier: number };
      might: { value: number; modifier: number };
    };
    health: { value: number; max: number };
    actionPoints: { value: number; max: number };
  }

  interface StorytellerItemData {
    description: string;
    quantity?: number;
    weight?: number;
    spellLevel?: number;
    school?: string;
    components?: string[];
    castingTime?: string;
    range?: string;
    duration?: string;
    requirements?: string;
  }

  interface StorytellerActor extends Actor {
    system: StorytellerActorData;
    static create(data: object, options?: object): Promise<StorytellerActor>;
  }

  interface StorytellerItem extends Item {
    system: StorytellerItemData;
    static create(data: object, options?: object): Promise<StorytellerItem>;
  }

  interface StorytellerItemSheet extends ItemSheet {
    item: Item;
    document: Item;
    getData(): Promise<{
      item: Item;
      system: StorytellerItemData;
      flags: Record<string, unknown>;
      effects: {
        temporary: { type: 'temporary'; label: string; effects: ActiveEffect[] };
        passive: { type: 'passive'; label: string; effects: ActiveEffect[] };
        inactive: { type: 'inactive'; label: string; effects: ActiveEffect[] };
      };
      config: CONFIG['PROJECT_STORYTELLER'];
      enrichedDescription: string;
    }>;
  }

  interface StorytellerConfig extends ProjectStoryteller {
    aspects: {
      focus: string;
      grace: string;
      intellect: string;
      might: string;
    };
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
    Combat: {
      initiative: {
        formula: string;
        decimals: number;
      };
    };
    Actor: {
      documentClass: typeof StorytellerActor;
      dataModels: {
        character: unknown;
        npc: unknown;
      };
    };
    Item: {
      documentClass: typeof StorytellerItem;
      dataModels: {
        item: unknown;
        feature: unknown;
        spell: unknown;
      };
    };
    ActiveEffect: {
      legacyTransferral: boolean;
    };
  }

  namespace foundry {
    interface DataModel {
      parent: Actor | Item | null;
      toPlainObject(): Record<string, unknown>;
    }
  }
}

export {};
