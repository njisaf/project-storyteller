# Active Effects System

## Overview
The Active Effects system in Project Storyteller manages temporary and permanent effects on Actors and Items. Effects can modify attributes, add features, or apply conditions.

## Components

### Effect Categories
Effects are organized into three categories:
- **Temporary**: Time-limited effects (e.g., combat buffs)
- **Passive**: Permanent effects (e.g., innate abilities)
- **Inactive**: Disabled effects

### Effect Management
The system provides two main functions:

#### `onManageActiveEffect`
Handles effect operations through the UI:
- Creating new effects
- Editing existing effects
- Deleting effects
- Toggling effect status

#### `prepareActiveEffectCategories`
Organizes effects into categories for display and management.

## Usage Example
```typescript
// Creating a new temporary effect
await onManageActiveEffect(event, actor);

// Categorizing effects for display
const categories = prepareActiveEffectCategories(actor.effects);
```

## Integration with Foundry VTT
The system integrates with Foundry's Active Effect framework, supporting:
- Effect duration tracking
- Automatic application/removal
- Status icon display
- Effect value calculation

## Type Definitions
See `module/helpers/effects.ts` for detailed type definitions and interfaces.
