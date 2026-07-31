# EditorWindow Folder Documentation

This folder contains classes for managing the Unity Editor interface and configuration system for the Random Dungeon Maker tool.

## DungeonConfig.cs

**Purpose**: Serializable configuration class that stores all dungeon generation parameters and settings.

**Key Features**:
- Centralizes all dungeon configuration data in one place
- Supports serialization for saving/loading configurations
- Provides cloning functionality for creating configuration variants
- Includes nested DungeonEntity class for entity configuration

**Configuration Properties**:

### Generation Seeds:
- `RNGSeed`: Main seed for dungeon layout generation
- `RNGSeedInn`: Seed for inner room details
- `RNGSeedElement`: Seed for entity/element placement

### Dungeon Dimensions:
- `DungeonWidth`: Width of the dungeon grid
- `DungeonHeight`: Height of the dungeon grid
- `TotalBloquesDungeon`: Total number of blocks/tiles to generate

### Room Parameters:
- `DungeonRoomsWidthMin/Max`: Minimum and maximum room width
- `DungeonRoomsHeightMin/Max`: Minimum and maximum room height
- `FillDungeonRoomGap`: Whether to fill gaps between rooms

### Path Parameters:
- `DungeonPathLongMin/Max`: Path length range
- `DungeonPathSizeMin/Max`: Path width range

### Generation Modes:
- `DungeonMode`: Type of dungeon (LABYRINTH, CASTLE, TOWER, DUNGEON)
- `DungeonRoomsSizeAmbivalence`: Room size variance setting
- `LabyrinthInn`: Enable inner room generation
- `LabyrinthPathInn`: Enable inner path generation
- `StartPointX/Y`: Starting position for generation
- `OpenWorld`: Open world generation mode
- `OpenWorldRate`: Percentage of open world areas (0-1)
- `SupportPlatforms`: Enable platform generation

### Visual Settings:
- `TileSize`: Size of floor tiles
- `ScaleWallY`: Wall height scale
- `ScaleWallZ`: Wall depth scale
- `Tile`: Reference to tile prefab
- `Wall`: Reference to wall prefab
- `stretchWallType`: Wall rendering mode

### Entity Configuration:
- `lstEntities`: List of entities to spawn in the dungeon

**Nested Class - DungeonEntity**:

Configures individual entity spawn settings:
- `EntityObject`: Reference to the entity prefab
- `Total`: Number of instances to spawn
- `IsImportant`: Whether entity is critical for gameplay
- `OcuppedTolerance`: How many tiles entity occupies
- `NotIndoor`: Whether entity can spawn outdoors
- `ObligatoryBottomWall`: Bottom wall requirement
- `ObligatoryTopWall`: Top wall requirement
- `ObligatoryLeftWall`: Left wall requirement
- `ObligatoryRightWall`: Right wall requirement

**Methods**:
- `Clone()`: Creates a deep copy of the configuration
- `CloneShallow<T>()`: Helper method for shallow cloning

**Use Case**: Use this class to save different dungeon presets (e.g., "Easy Dungeon", "Boss Room", "Maze Level") and quickly switch between them during development or at runtime.

---

## DungeonEditorWindow.cs

**Purpose**: Custom Unity Editor Window that provides a user-friendly interface for configuring and generating dungeons.

**Key Features**:
- Visual editor interface for all dungeon parameters
- Real-time dungeon preview
- Configuration save/load system
- Multiple dungeon instance management
- Random seed generation
- Scene integration for existing dungeons

**Main Functionality**:

### Configuration Management:
- `LoadConfigDungeon()`: Loads configuration into RandomDungeonMaker object
- `LoadConfigDungeonBuilder()`: Applies configuration to DungeonBuilder
- `SaveDungeonToConfig()`: Saves current configuration as ScriptableObject
- `ResetToDefaults()`: Resets all parameters to default values

### Dungeon Management:
- `RefreshDungeonBuilders()`: Updates list of existing dungeons in the scene
- `SelectDungeon()`: Focuses on a selected dungeon in the scene
- Dropdown menu for selecting between dungeons or creating new ones

### File Operations:
- `LoadDungeonConfig()`: Loads configuration from file
- `SaveDungeonConfig()`: Saves configuration to file
- Supports multiple configuration files for different dungeon types

### Editor GUI:
- Scrollable interface for all parameters
- Grouped sections for related settings
- Random seed generation buttons
- Preview rendering functionality
- Scene view focus integration

**Menu Access**: 
`Tools > Random Dungeon Maker`

**Use Case**: This editor window is the primary tool for designers and developers to create and test dungeons without writing code. It provides immediate visual feedback and allows rapid iteration on dungeon designs.

**Workflow**:
1. Open the editor window from Tools menu
2. Configure dungeon parameters
3. Generate preview or create in scene
4. Save configuration for reuse
5. Load and modify existing configurations

---

## DungeonEditorWindowConfig.cs

**Purpose**: ScriptableObject wrapper for DungeonEditorWindow settings and preferences.

**Key Features**:
- Persists editor window state between Unity sessions
- Stores user preferences for automatic seed generation
- Manages starting point for dungeon placement

**Properties**:
- `dungeonConfig`: Reference to the main DungeonConfig
- `GenerateRandomSeedAfterUse`: Auto-generate new main seed after each use
- `GenerateRandomSeedInnAfterUse`: Auto-generate new inn seed after each use
- `GenerateRandomSeedElementAfterUse`: Auto-generate new element seed after each use
- `StartingPoint`: World position for dungeon placement

**Methods**:
- `Clone()`: Creates a deep copy of the window configuration

**Use Case**: This class ensures that editor preferences are maintained across Unity sessions, providing a consistent user experience and preventing configuration loss.

---

## Summary

The EditorWindow folder provides a complete editor integration for the Random Dungeon Maker:

1. **DungeonConfig** - Data container for all settings
2. **DungeonEditorWindow** - Visual interface for configuration
3. **DungeonEditorWindowConfig** - Persistent editor preferences

Together, these classes create a professional, user-friendly tool that allows non-programmers to create complex procedural dungeons through Unity's Editor interface without requiring any coding knowledge.
