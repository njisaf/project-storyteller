import { onManageActiveEffect, prepareActiveEffectCategories } from "../../../module/helpers/effects";

interface MockEffectData extends ActiveEffect {
  id: string;
  sheet: { render: jest.Mock };
  delete: jest.Mock;
  update: jest.Mock;
}

class MockCollection<T> implements foundry.utils.Collection<T> {
  private map: Map<string, T>;

  constructor(entries?: [string, T][]) {
    this.map = new Map(entries);
  }

  get(key: string): T | undefined {
    return this.map.get(key);
  }

  set(key: string, value: T): this {
    this.map.set(key, value);
    return this;
  }

  values(): IterableIterator<T> {
    return this.map.values();
  }

  [Symbol.iterator](): IterableIterator<T> {
    return this.values();
  }

  toArray(): T[] {
    return Array.from(this.values());
  }
}

describe("Effect Helpers", () => {
  let mockOwner: EffectOwner;
  let mockEvent: { currentTarget: HTMLElement } & Partial<MouseEvent>;
  let mockEffect: MockEffectData;

  beforeEach(() => {
    mockEffect = {
      id: 'test-id',
      sheet: { render: jest.fn() },
      delete: jest.fn().mockResolvedValue(undefined),
      update: jest.fn().mockResolvedValue(undefined),
      disabled: false,
      isTemporary: false
    };

    mockOwner = {
      effects: new MockCollection<ActiveEffect>().set('test-id', mockEffect),
      createEmbeddedDocuments: jest.fn().mockResolvedValue([]),
      uuid: "test-uuid"
    };

    const li = document.createElement('li');
    li.dataset.effectType = "temporary";
    const element = document.createElement('div');
    element.dataset.action = "create";
    element.dataset.effectId = "test-id";
    li.appendChild(element);

    mockEvent = {
      preventDefault: jest.fn(),
      currentTarget: element
    };
  });

  describe("onManageActiveEffect", () => {
    it("creates a new effect", async () => {
      await onManageActiveEffect(mockEvent as MouseEvent, mockOwner);
      expect(mockOwner.createEmbeddedDocuments).toHaveBeenCalledWith(
        "ActiveEffect",
        expect.arrayContaining([
          expect.objectContaining({
            origin: "test-uuid",
            "duration.rounds": 1
          })
        ])
      );
    });

    it("handles non-existent effect gracefully", async () => {
      const li = document.createElement('li');
      const element = document.createElement('div');
      element.dataset.action = "edit";
      element.dataset.effectId = "non-existent-id";
      li.appendChild(element);

      const event = { ...mockEvent, currentTarget: element };
      const result = await onManageActiveEffect(event as MouseEvent, mockOwner);
      expect(result).toBeUndefined();
    });

    it("handles unknown action type gracefully", async () => {
      const li = document.createElement('li');
      const element = document.createElement('div');
      element.dataset.action = "unknown";
      li.appendChild(element);

      const event = { ...mockEvent, currentTarget: element };
      const result = await onManageActiveEffect(event as MouseEvent, mockOwner);
      expect(result).toBeUndefined();
    });

    it("edits an existing effect", async () => {
      const li = document.createElement('li');
      li.dataset.effectId = "test-id";
      const element = document.createElement('div');
      element.dataset.action = "edit";
      li.appendChild(element);

      const event = { ...mockEvent, currentTarget: element };
      await onManageActiveEffect(event as MouseEvent, mockOwner);
      expect(mockEffect.sheet.render).toHaveBeenCalledWith(true);
    });

    it("deletes an existing effect", async () => {
      const li = document.createElement('li');
      li.dataset.effectId = "test-id";
      const element = document.createElement('div');
      element.dataset.action = "delete";
      li.appendChild(element);

      const event = { ...mockEvent, currentTarget: element };
      await onManageActiveEffect(event as MouseEvent, mockOwner);
      expect(mockEffect.delete).toHaveBeenCalled();
    });

    it("toggles an existing effect", async () => {
      const li = document.createElement('li');
      li.dataset.effectId = "test-id";
      const element = document.createElement('div');
      element.dataset.action = "toggle";
      li.appendChild(element);

      const event = { ...mockEvent, currentTarget: element };
      await onManageActiveEffect(event as MouseEvent, mockOwner);
      expect(mockEffect.update).toHaveBeenCalledWith({ disabled: true });
    });
  });

  describe("prepareActiveEffectCategories", () => {
    const effects = [
      { id: '1', disabled: true, isTemporary: false },
      { id: '2', disabled: false, isTemporary: true },
      { id: '3', disabled: false, isTemporary: false }
    ] as ActiveEffect[];

    it("categorizes Collection effects correctly", () => {
      const mockEffects = new MockCollection<ActiveEffect>(
        effects.map((e) => [e.id, e])
      );
      const categories = prepareActiveEffectCategories(mockEffects);
      expect(categories.inactive.effects).toContainEqual(effects[0]);
      expect(categories.temporary.effects).toContainEqual(effects[1]);
      expect(categories.passive.effects).toContainEqual(effects[2]);
    });

    it("categorizes Array effects correctly", () => {
      const categories = prepareActiveEffectCategories(effects);
      expect(categories.inactive.effects).toContainEqual(effects[0]);
      expect(categories.temporary.effects).toContainEqual(effects[1]);
      expect(categories.passive.effects).toContainEqual(effects[2]);
    });
  });
});
