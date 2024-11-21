/**
 * @module helpers/effects
 * Provides utilities for managing Active Effects in Project Storyteller
 * @see {@link https://github.com/njisaf/project-storyteller/blob/main/docs/effects.md|Effects Documentation}
 */

/**
 * @typedef {Object} EffectCategory
 * @property {('temporary'|'passive'|'inactive')} type - The category type of the effect
 * @property {string} label - Localized label for the category
 * @property {ActiveEffect[]} effects - Array of effects in this category
 */
interface EffectCategory {
  type: 'temporary' | 'passive' | 'inactive';
  label: string;
  effects: ActiveEffect[];
}

interface EffectCategories {
  temporary: EffectCategory;
  passive: EffectCategory;
  inactive: EffectCategory;
}

interface ActiveEffect {
  id: string;
  disabled: boolean;
  isTemporary: boolean;
  sheet: {
    render: (force: boolean) => void;
  };
  delete: () => Promise<void>;
  update: (data: Partial<ActiveEffect>) => Promise<void>;
}

/**
 * @typedef {Object} EffectOwner
 * @property {foundry.utils.Collection<ActiveEffect>|ActiveEffect[]} effects - Collection or array of active effects
 * @property {Function} createEmbeddedDocuments - Method to create new embedded documents
 * @property {string} uuid - Unique identifier for the effect owner
 */
export interface EffectOwner {
  effects: foundry.utils.Collection<ActiveEffect> | ActiveEffect[];
  createEmbeddedDocuments: (type: string, data: object[]) => Promise<ActiveEffect[]>;
  uuid: string;
}

declare global {
  interface Game {
    i18n: {
      format: (key: string, data: Record<string, unknown>) => string;
      localize: (key: string) => string;
    }
  }
}

/**
 * Manage Active Effect instances through an Actor or Item Sheet via effect control buttons.
 * @param {MouseEvent} event - The triggering click event
 * @param {EffectOwner} owner - The owning Actor or Item containing the effect
 * @returns {Promise<ActiveEffect|ActiveEffect[]|void>} The created, modified, or deleted effect(s)
 */
export function onManageActiveEffect(event: MouseEvent, owner: EffectOwner): Promise<ActiveEffect | ActiveEffect[] | void> {
  event.preventDefault();
  const a = event.currentTarget as HTMLElement;
  const li = a.closest('li') as HTMLElement;
  const effectId = li.dataset.effectId;
  const effect = effectId ? owner.effects.get(effectId) : null;

  switch (a.dataset.action) {
    case 'create':
      return owner.createEmbeddedDocuments('ActiveEffect', [{
        name: game.i18n.format('DOCUMENT.New', {
          type: game.i18n.localize('DOCUMENT.ActiveEffect'),
        }),
        icon: 'icons/svg/aura.svg',
        origin: owner.uuid,
        'duration.rounds': li.dataset.effectType === 'temporary' ? 1 : undefined,
        disabled: li.dataset.effectType === 'inactive',
      }]);
    case 'edit':
      if (effect) {
        effect.sheet.render(true);
        return Promise.resolve();
      }
      break;
    case 'delete':
      if (effect) return effect.delete();
      break;
    case 'toggle':
      if (effect) return effect.update({ disabled: !effect.disabled });
      break;
  }
  return Promise.resolve();
}

/**
 * Prepare the data structure for Active Effects which are currently embedded in an Actor or Item.
 */
export function prepareActiveEffectCategories(effects: foundry.utils.Collection<ActiveEffect> | ActiveEffect[]): EffectCategories {
  const categories: EffectCategories = {
    temporary: {
      type: 'temporary',
      label: game.i18n.localize('PROJECT_STORYTELLER.Effect.Temporary'),
      effects: [],
    },
    passive: {
      type: 'passive',
      label: game.i18n.localize('PROJECT_STORYTELLER.Effect.Passive'),
      effects: [],
    },
    inactive: {
      type: 'inactive',
      label: game.i18n.localize('PROJECT_STORYTELLER.Effect.Inactive'),
      effects: [],
    },
  };

  const effectsArray = Array.isArray(effects) ? effects : Array.from(effects.values());

  for (const e of effectsArray) {
    if (e.disabled) categories.inactive.effects.push(e);
    else if (e.isTemporary) categories.temporary.effects.push(e);
    else categories.passive.effects.push(e);
  }
  return categories;
}
