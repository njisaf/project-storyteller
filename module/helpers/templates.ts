/**
 * @module helpers/templates
 * @description Manages preloading and caching of Handlebars templates for Project Storyteller
 */

declare global {
  var loadTemplates: (paths: string[]) => Promise<void>;
}

/**
 * List of template paths to be preloaded
 */
const templatePaths = [
  // Actor partials.
  'systems/project-storyteller/templates/actor/parts/actor-features.hbs',
  'systems/project-storyteller/templates/actor/parts/actor-items.hbs',
  'systems/project-storyteller/templates/actor/parts/actor-spells.hbs',
  'systems/project-storyteller/templates/actor/parts/actor-effects.hbs',
  // Item partials
  'systems/project-storyteller/templates/item/parts/item-effects.hbs',
] as const;

type TemplatePath = typeof templatePaths[number];

/**
 * Preloads and caches Handlebars template partials for faster rendering
 * @returns Promise that resolves when all templates are loaded
 * @example
 * // Usage in init hook:
 * Hooks.once('init', async function() {
 *   await preloadHandlebarsTemplates();
 * });
 *
 * @see {@link https://foundryvtt.wiki/en/development/api/handlebars} FoundryVTT Handlebars Documentation
 */
export const preloadHandlebarsTemplates = async function(): Promise<void> {
  return loadTemplates(templatePaths);
};
