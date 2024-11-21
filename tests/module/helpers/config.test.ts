import { PROJECT_STORYTELLER, ProjectStoryteller, AbilityScores } from "../../../module/helpers/config";

describe("Project Storyteller Configuration", () => {
  describe("PROJECT_STORYTELLER", () => {
    it("should have the correct structure", () => {
      expect(PROJECT_STORYTELLER).toBeDefined();
      expect(PROJECT_STORYTELLER.abilities).toBeDefined();
      expect(PROJECT_STORYTELLER.abilityAbbreviations).toBeDefined();
    });

    it("should have all required ability scores", () => {
      const expectedKeys = ["str", "dex", "con", "int", "wis", "cha"];

      expectedKeys.forEach(key => {
        expect(PROJECT_STORYTELLER.abilities[key as keyof AbilityScores]).toBeDefined();
        expect(PROJECT_STORYTELLER.abilityAbbreviations[key as keyof AbilityScores]).toBeDefined();
      });
    });

    it("should have correct localization key format", () => {
      const abilityKeyRegex = /^PROJECT_STORYTELLER\.Ability\.[A-Za-z]+\.(long|abbr)$/;

      Object.values(PROJECT_STORYTELLER.abilities).forEach(key => {
        expect(key).toMatch(abilityKeyRegex);
      });

      Object.values(PROJECT_STORYTELLER.abilityAbbreviations).forEach(key => {
        expect(key).toMatch(abilityKeyRegex);
      });
    });
  });
});
