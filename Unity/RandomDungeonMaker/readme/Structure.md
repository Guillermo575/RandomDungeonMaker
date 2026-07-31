# Structure Folder Documentation

This folder contains the classes responsible for building and managing the visual representation of procedurally generated dungeons in Unity.

## DungeonFloor.cs

**Purpose**: Base class that represents common data for dungeon floors.

**Key Features**:
- Serves as a parent class for dungeon-related components
- Provides virtual methods for Unity lifecycle events (`Start`, `Update`)
- Stores floor metadata such as name and audio clip
- Designed to be inherited by more specialized floor management classes

**Properties**:
- `name`: Default name used during gameplay for the floor
- `Clip`: Audio clip associated with this floor

**Use Case**: This class acts as a foundation for creating different types of floors with shared basic functionality. It allows for easy extension and customization of floor behavior in inherited classes.

---

## DungeonBuilder.cs

**Purpose**: Main class that receives a RandomDungeonMaker (RDM) object and builds a physical dungeon in Unity using prefabs.

**Key Features**:
- Converts abstract dungeon data into 3D Unity GameObjects
- Handles tile and wall instantiation
- Manages entity placement (enemies, items, etc.)
- Groups dungeon components by rooms for better organization
- Supports NavMesh generation for AI pathfinding
- Provides multiple wall construction modes (normal, recursive, room-only)

**Properties**:
- `TileSize`: Size of the tile prefab (default: 10f)
- `ScaleWallY`: Y-axis scale for wall prefabs
- `ScaleWallZ`: Z-axis scale for wall prefabs
- `Tile`: Prefab used for floor tiles
- `Wall`: Prefab used for walls
- `lstPrefabs`: List of entity prefabs to spawn in the dungeon
- `CameraPosYAuto`: Automatically positions camera above all tiles
- `CameraPosY`: Manual camera Y position
- `StartingPoint`: Origin point for dungeon construction
- `dungeonConfig`: Configuration object containing all dungeon parameters

**Main Methods**:
- `BuildDungeon()`: Constructs the entire dungeon structure using tiles and walls
  - Parameters:
    - `RDM`: RandomDungeonMaker object with dungeon data
    - `ShowTileLabel`: Display tile ID labels
    - `stretchWallType`: Wall construction mode (NO, YES, ONLY_ROOM)
  - Returns: GameObject parent containing the entire dungeon

- `MakeElements()`: Instantiates entities (enemies, items, treasures) at their designated positions
- `MakeWall()`: Creates walls using individual wall prefabs
- `MakeWallsRecursive()`: Creates stretched walls for better performance
- `GroupByRooms()`: Organizes dungeon tiles and elements by room hierarchy

**Enums**:
- `StretchWallType`:
  - `NO`: Normal wall placement
  - `YES`: Stretched walls for all areas
  - `ONLY_ROOM`: Stretched walls only for rooms

**Use Case**: This is the primary class for rendering dungeons in Unity. It bridges the gap between the procedural generation algorithm (RandomDungeonMaker) and the visual representation in the game scene. Use this class when you need to instantiate a playable dungeon from generated data.

**Example Workflow**:
1. Configure a DungeonBuilder component on a GameObject
2. Assign tile and wall prefabs
3. Add entity prefabs to the list
4. Call `BuildDungeon()` with a RandomDungeonMaker object
5. The dungeon is automatically constructed in the scene

**Advantages**:
- Separates generation logic from rendering logic
- Supports dynamic dungeon creation at runtime
- Automatic NavMesh baking for AI navigation
- Flexible entity placement system
- Organized hierarchy for easy scene management
