// Import types from foundry
import type { User, ChatMessage } from '../../types/foundry';

interface AspectData {
  value: number;
  modifier: number;
}

interface RollOptions {
  advantage?: boolean;
  disadvantage?: boolean;
  situationalBonus?: number;
}

/**
 * Roll an aspect check using the system's dice mechanics
 * @param aspectName - The name of the aspect being rolled
 * @param aspectData - The aspect's data including value and modifier
 * @param options - Additional roll options like advantage/disadvantage
 */
export async function rollAspectCheck(
  aspectName: string,
  aspectData: AspectData,
  options: RollOptions = {}
): Promise<Roll> {
  // Build the roll formula
  let formula = '2d6';
  const rollData: Record<string, number> = {
    mod: aspectData.modifier
  };

  // Handle advantage/disadvantage
  if (options.advantage) {
    formula = '3d6kh2';
  } else if (options.disadvantage) {
    formula = '3d6kl2';
  }

  // Add modifier
  formula += ' + @mod';

  // Add situational bonus if any
  if (options.situationalBonus) {
    formula += ' + @bonus';
    rollData.bonus = options.situationalBonus;
  }

  // Create and evaluate the roll
  const roll = new Roll(formula, rollData);
  await roll.evaluate();

  // Determine roll result type
  let resultType = '';
  if (roll.total >= 20) {
    resultType = game.i18n.format('PROJECT-STORYTELLER.Roll.Critical', {
      aspect: aspectName
    });
  } else if (roll.total <= 2) {
    resultType = game.i18n.format('PROJECT-STORYTELLER.Roll.Fumble', {
      aspect: aspectName
    });
  }

  // Create chat message
  await roll.toMessage({
    flavor: game.i18n.format('PROJECT-STORYTELLER.Roll.Aspect', {
      aspect: aspectName,
      result: resultType
    }),
    speaker: ChatMessage.getSpeaker({ actor: game.user?.character }),
    rollMode: 'roll'
  });

  return roll;
}
