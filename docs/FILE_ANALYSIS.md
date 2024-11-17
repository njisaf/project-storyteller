# Project Storyteller File Analysis Todo List

## Core System Files
- [x] /home/ubuntu/repos/project-storyteller/system.json - Main system configuration file that defines:
  * System identification (id: "project-storyteller", version: "2.0.0")
  * Foundry VTT compatibility (minimum: 11, verified: "11.315")
  * Core file paths (esmodules, styles, languages)
  * Token configuration (gridDistance: 5, gridUnits: "ft")
  * Authors and metadata
  * Dependencies:
    - Referenced by module files for system data access
    - Requires presence of lang/en.json, module/project-storyteller.mjs, css/project-storyteller.css
  * Issues to Address:
    - Placeholder values need updating (url, bugs, manifest, download)
    - Verify all referenced files exist and paths are correct
- [x] /home/ubuntu/repos/project-storyteller/template.json - Core type definition file that:
  * Defines Actor types: "character" and "npc"
  * Defines Item types: "item", "feature", and "spell"
  * Related Implementation Files:
    - Actor types implemented in module/data/actor-*.mjs files
    - Item types implemented in module/data/item-*.mjs files
  * UI Integration:
    - Each type has corresponding template files in templates/actor/ and templates/item/
  * System Architecture:
    - Forms the foundation for the data model hierarchy
    - Types are registered and managed through StorytellerActor and StorytellerItem classes
- [x] /home/ubuntu/repos/project-storyteller/package.json - Build configuration and project metadata:
  * Version Management:
    - Current version: 2.0.0 (matches system.json)
    - Need to ensure version consistency across all files
  * Build System:
    - SCSS compilation configured with expanded style
    - Entry point: src/scss/project-storyteller.scss
    - Output: css/project-storyteller.css
  * Dependencies:
    - Uses sass v1.53.0 for stylesheet compilation
  * Scripts:
    - build: Compiles SCSS without source maps
    - watch: Compiles SCSS with source maps and file watching
  * Project Info:
    - Private package (not published to npm)
    - MIT licensed
    - Targets last 3 browser versions

## Documentation Files
- [x] /home/ubuntu/repos/project-storyteller/README.md - Primary project documentation:
  * System Overview:
    - Foundry VTT v11 compatible system
    - Base system for custom development
    - Similar to Simple World-building but with coded attributes
  * Setup Methods:
    - Generator CLI (requires Node.js v20+)
    - Manual file renaming and updating
    - Alternative Python-based generator available
  * Features:
    - Optional DataModel classes support
    - Vue 3 version available (separate repo)
    - Comprehensive CSS helper classes
  * Development Resources:
    - Official Foundry VTT Discord support
    - Knowledge Base and API Documentation
    - Tutorial available on Foundry Wiki
  * Implementation Notes:
    - Package naming requirements (alphanumeric-lowercase)
    - SCSS compilation support
    - Flexible sheet layout system
- [x] /home/ubuntu/repos/project-storyteller/CHANGELOG.md - Version history tracking:
  * Purpose:
    - Documents system changes and updates
    - Tracks version compatibility
    - Records feature additions and bug fixes
- [x] /home/ubuntu/repos/project-storyteller/LICENSE.txt - MIT License:
  * Terms:
    - Open source license terms
    - Usage permissions and limitations
    - Copyright information

## JavaScript Modules
- [x] /home/ubuntu/repos/project-storyteller/module/project-storyteller.mjs - Main system initialization module:
  * Core Functionality:
    - Imports and configures document classes (StorytellerActor, StorytellerItem)
    - Sets up sheet classes for UI rendering
    - Configures data models for characters, NPCs, and items
    - Initializes combat and initiative systems
  * System Configuration:
    - Registers custom document classes and data models
    - Disables legacy effect transferral
    - Sets up initiative formula (1d20 + dex modifier)
  * UI Integration:
    - Registers actor and item sheets
    - Preloads Handlebars templates
    - Provides toLowerCase helper for templates
  * Macro System:
    - Implements item macro creation and rolling
    - Handles hotbar integration
  * Dependencies:
    - Relies on multiple module imports from documents/, sheets/, helpers/, and data/
    - Requires proper initialization order for system components
- [x] /home/ubuntu/repos/project-storyteller/module/documents/actor.mjs - Core actor document class:
  * Data Management:
    - Extends base Foundry VTT Actor class
    - Implements systematic data preparation lifecycle
    - Handles derived data calculations
  * Roll Data:
    - Provides polymorphic roll data generation
    - Combines base Actor roll data with system-specific data
  * Data Serialization:
    - Custom toPlainObject() method for data model compatibility
    - Handles items and effects serialization
  * System Integration:
    - Uses projectstoryteller flags for system-specific data
    - Supports character and NPC actor types
  * Implementation Notes:
    - Follows Foundry VTT's data preparation sequence
    - Maintains clear separation between base and derived data
- [x] /home/ubuntu/repos/project-storyteller/module/documents/item.mjs - Core item document class:
  * Data Management:
    - Extends base Foundry VTT Item class
    - Implements data preparation lifecycle
    - Provides roll data generation
  * Roll Mechanics:
    - Handles clickable roll events
    - Supports formula-based and description-only items
    - Integrates with actor roll data when available
  * Chat Integration:
    - Creates formatted chat messages for items
    - Supports different roll modes
    - Includes item type and name in message labels
  * Data Serialization:
    - Custom toPlainObject() method for data model compatibility
    - Handles effects serialization
  * Implementation Notes:
    - Flexible roll data structure
    - Clear separation between item and actor data
    - Supports multiple item types (item, feature, spell)
- [x] /home/ubuntu/repos/project-storyteller/module/sheets/actor-sheet.mjs - Actor sheet UI component:
  * Sheet Configuration:
    - Extends base Foundry VTT ActorSheet class
    - Configures sheet dimensions and tabs
    - Implements dynamic template selection based on actor type
  * Data Management:
    - Prepares actor data for rendering
    - Organizes items into categories (gear, features, spells)
    - Handles character-specific data preparation
  * UI Interaction:
    - Manages item creation, editing, and deletion
    - Handles rollable abilities and drag-drop
    - Processes active effect management
  * Template Integration:
    - Uses type-specific templates (character/npc)
    - Enriches biography text with interactive elements
    - Supports HTML-based event delegation
  * Implementation Notes:
    - Comprehensive event listener setup
    - Clear separation of editable/non-editable functionality
    - Supports macro creation through drag-drop
- [x] /home/ubuntu/repos/project-storyteller/module/sheets/item-sheet.mjs - Item sheet UI component:
  * Sheet Configuration:
    - Extends base Foundry VTT ItemSheet class
    - Configures sheet dimensions and tabs
    - Implements dynamic template selection by item type
  * Data Management:
    - Prepares item data for rendering
    - Enriches description text with interactive elements
    - Handles active effect categories
  * UI Interaction:
    - Manages active effect controls
    - Supports editable/non-editable states
    - Provides template-specific functionality
  * Template Integration:
    - Uses type-specific templates (item/feature/spell)
    - Supports alternative template strategies
    - Maintains consistent path structure
  * Implementation Notes:
    - Focused event listener setup
    - Rich text enrichment for descriptions
    - Clear template organization pattern

## Templates
- [x] /home/ubuntu/repos/project-storyteller/templates/actor/actor-character-sheet.hbs - Character sheet template:
  * Sheet Structure:
    - Form-based layout with flexbox and grid systems
    - Header with character image and basic info
    - Tabbed interface for features, description, items, spells, and effects
  * Resource Management:
    - Health and power tracking with current/max values
    - Level display and modification
    - Ability scores with modifiers and roll integration
  * Template Integration:
    - Includes partial templates for specialized content:
      * actor-features.hbs: Character features display
      * actor-items.hbs: Inventory management
      * actor-spells.hbs: Spell list and casting
      * actor-effects.hbs: Active effects tracking
  * Data Bindings:
    - Direct system data access (health, power, abilities)
    - Rich text editing for biography
    - Dynamic ability score calculations
  * Implementation Notes:
    - Consistent CSS class structure
    - Comprehensive roll data integration
    - Modular template organization
- [x] /home/ubuntu/repos/project-storyteller/templates/actor/actor-npc-sheet.hbs - NPC sheet template:
  * Sheet Structure:
    - Simplified form-based layout with flexbox and grid systems
    - Header with NPC image and basic info
    - Streamlined tabs for description, items, and effects
  * Resource Management:
    - Health and power tracking with current/max values
    - Challenge Rating (CR) and Experience Points (XP) display
    - XP automatically calculated from CR (read-only)
  * Template Integration:
    - Includes essential partial templates:
      * actor-items.hbs: Inventory management
      * actor-effects.hbs: Active effects tracking
  * Data Bindings:
    - Core system data access (health, power)
    - NPC-specific fields (CR, XP)
    - Rich text editing for biography
  * Implementation Notes:
    - Consistent with character sheet CSS structure
    - Simplified interface for NPC management
    - Focused on essential NPC attributes
- [x] /home/ubuntu/repos/project-storyteller/templates/item/item-feature-sheet.hbs - Feature item template:
  * Sheet Structure:
    - Form-based layout with header and tabs
    - Profile image and name input
    - Three-tab interface: Description, Attributes, Effects
  * Data Management:
    - Basic item data (name, image)
    - Rich text description with roll support
    - Active effects integration
  * Template Integration:
    - Includes item-effects.hbs partial for effects management
    - Prepared for future attribute fields
    - Consistent with item sheet patterns
  * UI Components:
    - ProseMirror editor for descriptions
    - Tabbed interface for organization
    - Effects management interface
  * Implementation Notes:
    - Attributes tab intentionally empty for future expansion
    - Consistent with other item templates
    - Supports enriched text content
- [x] /home/ubuntu/repos/project-storyteller/templates/item/item-spell-sheet.hbs - Spell item template:
  * Sheet Structure:
    - Form-based layout with header and tabs
    - Profile image and name input
    - Two-tab interface: Description and Attributes
  * Data Management:
    - Basic item data (name, image)
    - Rich text description with roll support
    - Spell level tracking and validation
  * Template Integration:
    - Streamlined template without effects tab
    - Consistent with item sheet patterns
    - Focused on spell-specific attributes
  * UI Components:
    - ProseMirror editor for descriptions
    - Numeric input for spell level
    - Simplified tabbed interface
  * Implementation Notes:
    - Spell level validation (0-9 range)
    - Attributes tab contains spell-specific fields
    - Supports enriched text content

## Styles
- [x] /home/ubuntu/repos/project-storyteller/src/scss/project-storyteller.scss - Main stylesheet entry point:
  * Style Organization:
    - Modular SCSS architecture with clear separation of concerns
    - Utility-first approach with mixins and variables
    - Scoped component styles under .project-storyteller namespace
  * Utility Files:
    - Typography: Font family definitions and text styles
    - Colors: Project color palette and theme variables
    - Mixins: Reusable style patterns and utilities
    - Variables: Common measurements and values
  * Global Styles:
    - Window: Application window and container styles
    - Grid: Flexible grid system for layouts
    - Flex: Flexbox utility classes for alignment
  * Component Integration:
    - Forms: Input and control styling
    - Resource: Resource bar and stat displays
    - Items: Item list and management interfaces
    - Effects: Active effect styling and indicators
  * Implementation Notes:
    - Google Fonts integration for consistent typography
    - Organized import structure for maintainability
    - Scoped styles to prevent conflicts
- [x] /home/ubuntu/repos/project-storyteller/css/project-storyteller.css - Compiled CSS output:
  * Production Output:
    - Compiled from project-storyteller.scss source
    - Expanded style format for debugging
    - Browser-optimized selectors and rules
  * Style Components:
    - Global utility classes (.flexcol, .flexrow, .grid)
    - Scoped component styles under .project-storyteller
    - Form and resource management interfaces
    - Item and effect display components
  * Browser Support:
    - Modern browser compatibility
    - Foundry VTT v11.315 verified
    - Clean selector specificity
  * Performance Features:
    - Modular style organization
    - Efficient selector nesting
    - Consistent class naming
  * Implementation Notes:
    - Direct compilation from SCSS source
    - Maintains source organization
    - Production-ready styling

Each file will be analyzed and documented below as we process them.
