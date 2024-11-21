import { PROJECT_STORYTELLER } from "../../../module/helpers/config";

describe("Project Storyteller Configuration", () => {
  describe("PROJECT_STORYTELLER", () => {
    it("should have the correct structure", () => {
      expect(PROJECT_STORYTELLER).toBeDefined();
      expect(PROJECT_STORYTELLER.abilities).toBeDefined();
      expect(PROJECT_STORYTELLER.abilityAbbreviations).toBeDefined();
      expect(PROJECT_STORYTELLER.itemTypes).toBeDefined();
      expect(PROJECT_STORYTELLER.spellLevels).toBeDefined();
      expect(PROJECT_STORYTELLER.spellSchools).toBeDefined();
      expect(PROJECT_STORYTELLER.effectTypes).toBeDefined();
    });

    it("should have all required abilities", () => {
      const expectedAbilities = ["str", "dex", "con", "int", "wis", "cha"];

      expectedAbilities.forEach(ability => {
        expect(PROJECT_STORYTELLER.abilities[ability as keyof typeof PROJECT_STORYTELLER.abilities]).toBeDefined();
        expect(PROJECT_STORYTELLER.abilityAbbreviations[ability as keyof typeof PROJECT_STORYTELLER.abilityAbbreviations]).toBeDefined();
      });
    });

    it("should have correct localization key format", () => {
      const abilityKeyRegex = /^PROJECT_STORYTELLER\.Ability\.[A-Za-z]+\.(long|abbr)$/;
      const itemTypeRegex = /^PROJECT_STORYTELLER\.ItemType\.[A-Za-z]+$/;
      const spellLevelRegex = /^PROJECT_STORYTELLER\.SpellLevel\.[A-Za-z0-9]+$/;
      const spellSchoolRegex = /^PROJECT_STORYTELLER\.SpellSchool\.[A-Za-z]+$/;
      const effectTypeRegex = /^PROJECT_STORYTELLER\.Effect\.[A-Za-z]+$/;

      Object.values(PROJECT_STORYTELLER.abilities).forEach(key => {
        expect(key).toMatch(abilityKeyRegex);
      });

      Object.values(PROJECT_STORYTELLER.abilityAbbreviations).forEach(key => {
        expect(key).toMatch(abilityKeyRegex);
      });

      Object.values(PROJECT_STORYTELLER.itemTypes).forEach(key => {
        expect(key).toMatch(itemTypeRegex);
      });

      Object.values(PROJECT_STORYTELLER.spellLevels).forEach(key => {
        expect(key).toMatch(spellLevelRegex);
      });

      Object.values(PROJECT_STORYTELLER.spellSchools).forEach(key => {
        expect(key).toMatch(spellSchoolRegex);
      });

      Object.values(PROJECT_STORYTELLER.effectTypes).forEach(key => {
        expect(key).toMatch(effectTypeRegex);
      });
    });
  });
});
