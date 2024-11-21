declare global {
  interface CONFIG {
    PROJECT_STORYTELLER: ProjectStoryteller;
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

  class StorytellerActor {
    static create(data: object, options?: object): Promise<StorytellerActor>;
  }

  class StorytellerItem {
    static create(data: object, options?: object): Promise<StorytellerItem>;
  }

  var CONFIG: CONFIG;
}

export {};
