import { PROJECT_STORYTELLER } from '../../module/helpers/config';
import { preloadHandlebarsTemplates } from '../../module/helpers/templates';
import { StorytellerActor } from '../../module/documents/actor';
import { StorytellerItem } from '../../module/documents/item';
import { StorytellerActorSheet } from '../../module/sheets/actor-sheet';
import { StorytellerItemSheet } from '../../module/sheets/item-sheet';

jest.mock('../../module/helpers/templates', () => ({
  preloadHandlebarsTemplates: jest.fn().mockResolvedValue(undefined)
}));

describe('Project Storyteller System', () => {
  let mockHooks: { on: jest.Mock; once: jest.Mock };
  let mockGame: { system: { id: string }; actors: { documentClass: any }; items: { documentClass: any } };

  beforeEach(() => {
    mockHooks = {
      on: jest.fn(),
      once: jest.fn()
    };

    mockGame = {
      system: { id: 'project-storyteller' },
      actors: { documentClass: null },
      items: { documentClass: null }
    };

    global.Hooks = mockHooks;
    global.game = mockGame;
  });

  describe('System Initialization', () => {
    test('should register actor document class', () => {
      expect(mockGame.actors.documentClass).toBe(StorytellerActor);
    });

    test('should register item document class', () => {
      expect(mockGame.items.documentClass).toBe(StorytellerItem);
    });

    test('should register actor sheet', () => {
      expect(mockHooks.on).toHaveBeenCalledWith(
        'createActorSheet',
        expect.any(Function)
      );
    });

    test('should register item sheet', () => {
      expect(mockHooks.on).toHaveBeenCalledWith(
        'createItemSheet',
        expect.any(Function)
      );
    });

    test('should preload templates', () => {
      expect(preloadHandlebarsTemplates).toHaveBeenCalled();
    });
  });

  describe('System Configuration', () => {
    test('should initialize with correct system ID', () => {
      expect(mockGame.system.id).toBe('project-storyteller');
    });

    test('should have required config settings', () => {
      expect(PROJECT_STORYTELLER).toBeDefined();
      expect(PROJECT_STORYTELLER.aspects).toBeDefined();
      expect(PROJECT_STORYTELLER.aspectAbbreviations).toBeDefined();
    });
  });

  describe('Sheet Registration', () => {
    test('should register actor sheet with correct options', () => {
      const registerSheetCall = mockHooks.on.mock.calls.find(
        call => call[0] === 'createActorSheet'
      );
      const registerCallback = registerSheetCall[1];

      const sheetData = {
        baseApplication: StorytellerActorSheet,
        options: {
          classes: ['project-storyteller', 'sheet', 'actor'],
          width: 600,
          height: 600
        }
      };

      registerCallback(sheetData);
      expect(sheetData.baseApplication).toBe(StorytellerActorSheet);
    });

    test('should register item sheet with correct options', () => {
      const registerSheetCall = mockHooks.on.mock.calls.find(
        call => call[0] === 'createItemSheet'
      );
      const registerCallback = registerSheetCall[1];

      const sheetData = {
        baseApplication: StorytellerItemSheet,
        options: {
          classes: ['project-storyteller', 'sheet', 'item'],
          width: 520,
          height: 480
        }
      };

      registerCallback(sheetData);
      expect(sheetData.baseApplication).toBe(StorytellerItemSheet);
    });
  });
});
