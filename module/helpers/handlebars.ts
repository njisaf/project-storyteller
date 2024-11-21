/**
 * Type definition for Handlebars helper options
 */
interface HandlebarsOptions {
  fn: (context?: any) => string;
}

interface AspectData {
  value: number;
  modifier: number;
}

/**
 * Register custom Handlebars helpers used in the Project Storyteller system
 */
export function registerHandlebarsHelpers(): void {
  // Concatenate any number of strings
  Handlebars.registerHelper('concat', function(...args: any[]) {
    const params = args.slice(0, -1);
    return params.join('');
  });

  // Create a loop of n iterations
  Handlebars.registerHelper('times', function(options: HandlebarsOptions, n: number) {
    let result = '';
    for (let i = 0; i < n; i++) {
      result += options.fn(i);
    }
    return result;
  });

  // Format aspect modifier with + or - sign
  Handlebars.registerHelper('aspectModifier', function(value: number) {
    const modifier = Math.floor(value / 3);
    return modifier >= 0 ? `+${modifier}` : modifier.toString();
  });

  // Format aspect value and modifier
  Handlebars.registerHelper('formatAspect', function(aspect: AspectData) {
    return `${aspect.value} (${aspect.modifier >= 0 ? '+' : ''}${aspect.modifier})`;
  });
}
