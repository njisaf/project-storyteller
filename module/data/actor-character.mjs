
import StorytellerActorBase from "./base-actor.mjs";

export default class StorytellerCharacter extends StorytellerActorBase {
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