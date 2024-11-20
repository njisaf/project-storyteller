/**
 * @module data/actor-character
 * @description Character-specific data model implementation for Project Storyteller
 */

import StorytellerActorBase from "./base-actor.mjs";

/**
 * @class StorytellerCharacter
 * @extends {StorytellerActorBase}
 * @description Data model for player character actors, implementing character-specific
 * attributes and mechanics including skills, background elements, and derived calculations
 */
export default class StorytellerCharacter extends StorytellerActorBase {
  /**
   * @static
   * @returns {Object} Schema definition for character-specific data
   * @description Defines the data schema for character documents, including:
   * - Background fields (descent, culture, vocation, role)
   * - Biography text
   * - Skill categories (combat, social, investigative, magical)
   * Each skill includes value, aptitude, and associated aspect
   */
  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    schema.descent = new fields.StringField({ required: true, blank: true });
    schema.culture = new fields.StringField({ required: true, blank: true });
    schema.vocation = new fields.StringField({ required: true, blank: true });
    schema.role = new fields.StringField({ required: true, blank: true });
    schema.biography = new fields.StringField({ required: true, blank: true });

    schema.skills = new fields.SchemaField({
      combat: new fields.SchemaField({
        melee: new fields.SchemaField({
          value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
          aptitude: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
          aspect: new fields.StringField({ required: true, initial: "might" })
        }),
        ranged: new fields.SchemaField({
          value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
          aptitude: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
          aspect: new fields.StringField({ required: true, initial: "grace" })
        }),
        defense: new fields.SchemaField({
          value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
          aptitude: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
          aspect: new fields.StringField({ required: true, initial: "grace" })
        })
      }),
      social: new fields.SchemaField({
        persuasion: new fields.SchemaField({
          value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
          aptitude: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
          aspect: new fields.StringField({ required: true, initial: "focus" })
        }),
        deception: new fields.SchemaField({
          value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
          aptitude: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
          aspect: new fields.StringField({ required: true, initial: "focus" })
        }),
        intimidation: new fields.SchemaField({
          value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
          aptitude: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
          aspect: new fields.StringField({ required: true, initial: "might" })
        })
      }),
      investigative: new fields.SchemaField({
        perception: new fields.SchemaField({
          value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
          aptitude: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
          aspect: new fields.StringField({ required: true, initial: "focus" })
        }),
        investigation: new fields.SchemaField({
          value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
          aptitude: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
          aspect: new fields.StringField({ required: true, initial: "intellect" })
        }),
        knowledge: new fields.SchemaField({
          value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
          aptitude: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
          aspect: new fields.StringField({ required: true, initial: "intellect" })
        })
      }),
      magical: new fields.SchemaField({
        spellcraft: new fields.SchemaField({
          value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
          aptitude: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
          aspect: new fields.StringField({ required: true, initial: "intellect" })
        }),
        ritual: new fields.SchemaField({
          value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
          aptitude: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
          aspect: new fields.StringField({ required: true, initial: "focus" })
        }),
        channeling: new fields.SchemaField({
          value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
          aptitude: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
          aspect: new fields.StringField({ required: true, initial: "grace" })
        })
      })
    });

    return schema;
  }

  /**
   * @override
   * @description Calculates derived values for character data:
   * - Calls parent class calculations
   * - Computes total skill values (value + aptitude + aspect modifier)
   */
  prepareDerivedData() {
    super.prepareDerivedData();

    // Calculate total skill values including aspect modifiers
    for (const category of Object.values(this.skills)) {
      for (const [skillName, skill] of Object.entries(category)) {
        const aspectMod = this.aspects[skill.aspect]?.modifier || 0;
        skill.total = skill.value + skill.aptitude + aspectMod;
      }
    }
  }

  /**
   * @returns {Object} Formatted data object for roll calculations
   * @description Prepares character data for use in roll formulas:
   * - Extracts aspect modifiers
   * - Formats skill totals with category prefixes
   * @example
   * // Returns object like: { aspects: { might: 2 }, skills: { "combat.melee": 5 } }
   */
  getRollData() {
    const data = {};

    // Add aspects to roll data
    data.aspects = Object.entries(this.aspects).reduce((acc, [key, value]) => {
      acc[key] = value.modifier;
      return acc;
    }, {});

    // Add skills to roll data
    data.skills = {};
    for (const [category, skills] of Object.entries(this.skills)) {
      for (const [skillName, skill] of Object.entries(skills)) {
        data.skills[`${category}.${skillName}`] = skill.total;
      }
    }

    return data;
  }
}
