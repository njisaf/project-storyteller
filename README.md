# Storyteller System

![Foundry v11](https://img.shields.io/badge/foundry-v11-green)

A tabletop roleplaying game system for Foundry VTT that emphasizes narrative gameplay and character development through a flexible, attribute-based framework.

## Core Game Mechanics

### Character Creation Elements

- **Attributes**: Characters have four core attributes that influence all aspects of gameplay:
  - Focus: Mental acuity and perception
  - Grace: Physical agility and finesse
  - Intellect: Knowledge and reasoning
  - Might: Physical power and resilience

- **Skills and Aptitude Points**: Characters improve through four skill categories:
  - Combat: Physical conflict resolution
  - Social: Interaction and influence
  - Investigative: Information gathering
  - Magical: Supernatural abilities

- **Augmentations and Features**: Characters can be customized with special abilities and modifications.

### Combat and Gameplay Mechanics

- **Action Points (AP)**: Each character has 3 AP per round for various actions.

- **Dice Rolls**:
  - Base mechanic: 2d10 + modifiers vs. Challenge Threshold (CT)
  - Critical successes and failures add narrative weight

- **Combat Phases**:
  - Present: Turn-based tactical combat
  - Intermediate: Minutes to hours
  - Long-term: Days or longer
  - Passive: Ongoing effects

- **Health and Conditions**:
  - HP represents vitality
  - Conditions affect character effectiveness

### Social and Narrative Gameplay

- **Roleplaying**: Character-driven narrative with ST (Storyteller) guidance
- **Currency**: Four-tier system (Bronze, Silver, Gold, Platinum)

### Equipment and Inventory

- **Items and Modifiers**: Equipment affects gameplay mechanics
- **Carrying Capacity**: Based on Might attribute

### Gameplay Phases and Actions

- **Action Types**:
  - Present: Combat and immediate actions
  - Intermediate: Short-term activities
  - Long-term: Extended projects
  - Passive: Background activities

## System Architecture

### Core System Files
- `system.json` - System configuration:
  * System identification and version
  * Foundry VTT compatibility (v11+)
  * Core file paths and dependencies

### Data Models
- `module/data/` - Core data structures:
  * Actor models (character, NPC)
  * Item models (items, features, spells)
  * Base models and shared functionality

### Document Classes
- `module/documents/` - Core implementations:
  * `actor.mjs` - Actor type implementations
  * `item.mjs` - Item type implementations

### Sheet Classes
- `module/sheets/` - UI implementations:
  * `actor-sheet.mjs` - Character and NPC sheets
  * `item-sheet.mjs` - Item, feature, and spell sheets

### Helper Modules
- `module/helpers/` - Utility functions:
  * `effects.ts` - Active Effect management and categorization
  * `templates.ts` - Template preloading and registration
  * `config.ts` - System configuration and settings

### Templates
- `templates/actor/` - Actor sheet layouts
- `templates/item/` - Item sheet layouts

### Styles
- `css/project-storyteller.css` - System styling

## Development

For development documentation and API references, visit:
- [Foundry VTT API Documentation](https://foundryvtt.com/api/)
- [Official Foundry VTT Discord](https://discord.gg/foundryvtt)
