declare global {
  class StorytellerActor {
    // Base actor class implementation
    static create(data: object, options?: object): Promise<StorytellerActor>;
  }

  class StorytellerItem {
    // Base item class implementation
    static create(data: object, options?: object): Promise<StorytellerItem>;
  }

  interface StorytellerItemSheet extends ItemSheet {
    item: Item;
    document: Item;
    getData(): Promise<{
      item: Item;
      system: Record<string, unknown>;
      flags: Record<string, unknown>;
      effects: ActiveEffect[];
      config: ProjectStoryteller;
      enrichedDescription: string;
    }>;
  }

  interface ProjectStoryteller {
    Effect: {
      Temporary: string;
      Passive: string;
      Inactive: string;
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
}

export {};
