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
    effects: ActiveEffect[];
  }

  export interface Item extends DocumentData, EffectOwner {
    id: string;
    type: string;
    name: string;
    img: string;
    system: {
      description?: string;
      spellLevel?: number;
      [key: string]: any;
    };
    flags: Record<string, unknown>;
    isOwner: boolean;
    effects: ActiveEffect[];
    getRollData(): Record<string, unknown>;
    toObject(): Record<string, unknown>;
    sheet: ItemSheet;
    parent: Actor | null;
    delete(): Promise<void>;
    roll(): Promise<Roll>;
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
