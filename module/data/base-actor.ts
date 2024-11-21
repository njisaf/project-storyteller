import { StorytellerDataModel } from "./base-model";

interface AspectData {
  value: number;
  modifier: number;
}

interface HealthData {
  value: number;
  max: number;
}

interface ActionPointsData {
  value: number;
  max: number;
}

interface AspectFields {
  focus: AspectData;
  grace: AspectData;
  intellect: AspectData;
  might: AspectData;
}

export interface StorytellerActorData {
  aspects: AspectFields;
  health: HealthData;
  actionPoints: ActionPointsData;
}

/**
 * Foundation class for all actor types in Project Storyteller
 * @extends {StorytellerDataModel}
 */
export class BaseActor extends StorytellerDataModel {
  declare aspects: AspectFields;
  declare health: HealthData;
  declare actionPoints: ActionPointsData;

  static override defineSchema(): foundry.data.fields.SchemaField<StorytellerActorData> {
    const fields = foundry.data.fields;
    const requiredInteger = {
      required: true,
      nullable: false,
      integer: true
    } as const;

    return new fields.SchemaField({
      aspects: new fields.SchemaField({
        focus: new fields.SchemaField({
          value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
          modifier: new fields.NumberField({ ...requiredInteger, initial: 0 })
        }),
        grace: new fields.SchemaField({
          value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
          modifier: new fields.NumberField({ ...requiredInteger, initial: 0 })
        }),
        intellect: new fields.SchemaField({
          value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
          modifier: new fields.NumberField({ ...requiredInteger, initial: 0 })
        }),
        might: new fields.SchemaField({
          value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
          modifier: new fields.NumberField({ ...requiredInteger, initial: 0 })
        })
      }),
      health: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 10, min: 0 }),
        max: new fields.NumberField({ ...requiredInteger, initial: 10 })
      }),
      actionPoints: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 3, min: 0 }),
        max: new fields.NumberField({ ...requiredInteger, initial: 3 })
      })
    });
  }

  /** @override */
  override prepareDerivedData(): void {
    super.prepareDerivedData();
    for (const [, data] of Object.entries(this.aspects)) {
      data.modifier = Math.floor(data.value / 3);
    }
  }
}
