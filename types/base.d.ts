declare module '../types/base' {
  export class DocumentSheet {
    getData(): Promise<Record<string, unknown>>;
    activateListeners(html: JQuery): void;
    options: Record<string, unknown>;
    defaultOptions: Record<string, unknown>;
    render(force?: boolean): Promise<void>;
    close(): Promise<void>;
    _getHeaderButtons(): { label: string; class: string; icon: string; onclick: () => void }[];
  }

  export class ItemSheet extends DocumentSheet {
    getData(): Promise<Record<string, unknown>>;
    activateListeners(html: JQuery): void;
    options: Record<string, unknown>;
    defaultOptions: Record<string, unknown>;
    render(force?: boolean): Promise<void>;
    item: Item;
    document: Item;
    isEditable: boolean;
    close(): Promise<void>;
    _getHeaderButtons(): { label: string; class: string; icon: string; onclick: () => void }[];
  }

  interface EffectOwner {
    effects: foundry.utils.Collection<ActiveEffect>;
    createEmbeddedDocuments(type: string, data: object[]): Promise<ActiveEffect[]>;
    uuid: string;
  }

  export interface DataModel {
    _source: Record<string, unknown>;
    toObject(): Record<string, unknown>;
    toPlainObject(): Record<string, unknown>;
    prepareDerivedData(): void;
  }

  export interface Item extends DocumentData, EffectOwner {
    id: string;
    type: string;
    name: string;
    img: string;
    system: StorytellerItemData & {
      description: string;
      quantity?: number;
      weight?: number;
      requirements?: string;
    };
    flags: Record<string, unknown>;
    isOwner: boolean;
    effects: foundry.utils.Collection<ActiveEffect>;
    getRollData(): Record<string, unknown>;
    toObject(): Record<string, unknown>;
    sheet: ItemSheet;
    parent: Actor | null;
    delete(): Promise<void>;
    roll(): Promise<Roll>;
  }

  export interface Actor extends DocumentData, EffectOwner {
    system: StorytellerActorData & {
      aspects: {
        focus: { value: number; modifier: number };
        grace: { value: number; modifier: number };
        intellect: { value: number; modifier: number };
        might: { value: number; modifier: number };
      };
    };
    items: foundry.utils.Collection<Item>;
    effects: foundry.utils.Collection<ActiveEffect>;
    isOwner: boolean;
    getRollData(): Record<string, unknown>;
  }

  interface ActiveEffect {
    id: string;
    label: string;
    icon: string;
    disabled: boolean;
    transfer: boolean;
    flags: Record<string, unknown>;
    parent: Item | Actor | null;
    duration: { startTime: number; seconds: number; rounds: number; turns: number; };
    origin: string | null;
    tint: string | null;
    statuses: Set<string>;
    isTemporary: boolean;
    sheet: {
      render: (force: boolean) => void;
    };
    delete(): Promise<void>;
    update(data: Partial<ActiveEffect>): Promise<void>;
  }

  export const TextEditor: {
    enrichHTML: (content: string, options: {
      secrets: boolean;
      async: boolean;
      rollData: Record<string, unknown>;
      relativeTo: unknown;
    }) => Promise<string>;
  };
}

export {};
