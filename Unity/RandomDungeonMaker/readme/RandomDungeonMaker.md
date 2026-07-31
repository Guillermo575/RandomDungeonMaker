# RandomDungeonMaker.cs - Core Documentation

## Overview

`RandomDungeonMaker.cs` is the heart of the procedural dungeon generation system. This class contains the core algorithm that creates fully functional, navigable dungeon layouts using deterministic random generation. It transforms configuration parameters into complex maze-like structures with rooms, corridors, and connections.

**Namespace**: `RDM`

---

## Purpose

This class generates procedural dungeons by:
1. Creating a grid-based layout
2. Generating rooms and paths
3. Connecting areas with doors/passages
4. Managing walls and interior details
5. Placing entities (enemies, items, treasures)
6. Supporting various dungeon styles and configurations

---

## Key Features

### ?? Deterministic Generation
- Uses three separate seed values for reproducible results
- Same seeds always produce identical dungeons
- Enables seed sharing between players

### ?? Multiple Dungeon Modes
- **LABYRINTH**: Organic, maze-like structures
- **CASTLE**: Structured, fortress-like layouts
- **TOWER**: Vertical-focused designs
- **DUNGEON**: Room-and-corridor style dungeons

### ?? Intelligent Room Generation
- Variable room sizes with min/max constraints
- Automatic room connection with pathways
- Optional inner room mazes (labyrinth within rooms)
- Fill mode to maximize space usage

### ?? Open World Support
- Three modes: NO, SEMI, YES
- Removes walls between adjacent tiles
- Creates open exploration areas
- Configurable wall removal percentage

### ?? Platform Generation
- Adds support platforms for 3D/platformer games
- Positioned on walls for climbing/jumping
- Zigzag placement for gameplay variety

### ?? Entity Placement System
- Spawn enemies, items, treasures, and more
- Rule-based placement (wall requirements, indoor/outdoor)
- Importance levels for critical items
- Occupancy tolerance to prevent clustering

---

## Configuration Properties

### Seeds
```csharp
public int RNGSeed = 100;          // Main dungeon structure seed
public int RNGSeedInn = 100;       // Inner room details seed
public int RNGSeedElement = 100;   // Entity placement seed
```

### Dimensions
```csharp
public int DungeonWidth;           // Grid width (tiles)
public int DungeonHeight;          // Grid height (tiles)
public int TotalBloquesDungeon;    // Total blocks to generate
```

### Room Configuration
```csharp
public int DungeonRoomsWidthMin = 2;    // Minimum room width
public int DungeonRoomsWidthMax = 4;    // Maximum room width
public int DungeonRoomsHeightMin = 2;   // Minimum room height
public int DungeonRoomsHeightMax = 4;   // Maximum room height
```

### Path Configuration
```csharp
public int DungeonPathLongMin = 1;      // Minimum path length
public int DungeonPathLongMax = 3;      // Maximum path length
public int DungeonPathSizeMin = 1;      // Minimum path width
public int DungeonPathSizeMax = 1;      // Maximum path width
```

### Generation Modes
```csharp
public enumDungeonMode DungeonMode = enumDungeonMode.LABYRINTH;
public enumLabyrinthInn LabyrinthInn = enumLabyrinthInn.YES;
public enumLabyrinthInn LabyrinthPathInn = enumLabyrinthInn.YES;
public enumStartPointX StartPointX = enumStartPointX.CENTER;
public enumStartPointY StartPointY = enumStartPointY.CENTER;
public enumOpenWorld OpenWorld = enumOpenWorld.NO;
public enumSupportPlatforms SupportPlatforms = enumSupportPlatforms.NO;
```

### Advanced Options
```csharp
public bool FillDungeonRoomGap = false;           // Fill gaps between rooms
public decimal OpenWorldRate = 0.5m;              // % of walls to remove (0-1)
public enumDungeonRoomsSizeAmbivalence            // Square room generation
    DungeonRoomsSizeAmbivalence = enumDungeonRoomsSizeAmbivalence.NO;
```

---

## Enumerations

### enumDungeonMode
```csharp
LABYRINTH  // Organic maze structure
CASTLE     // Structured fortress layout
TOWER      // Vertical design priority
DUNGEON    // Room-corridor hybrid
```

### enumStartPointX / enumStartPointY
```csharp
CENTER     // Start at center of grid
LEFT/TOP   // Start at edge
RIGHT/BOTTOM // Start at opposite edge
```

### enumOpenWorld
```csharp
NO    // Standard closed rooms
SEMI  // Some rooms opened
YES   // Maximum openness
```

### enumLabyrinthInn
```csharp
YES   // Generate inner room mazes
NO    // Solid room interiors
```

### enumSupportPlatforms
```csharp
YES   // Generate wall platforms
NO    // No platform generation
```

---

## Public Properties

### Output Data
```csharp
public Block[][] DungeonBlocks;        // 2D array of all dungeon tiles
public List<Room> DungeonRooms;        // List of generated rooms
public List<Entities> lstEntities;     // Entity placement list
public String HTMLTable;               // HTML visualization
public String HTMLTablePage;           // Complete HTML page
public string Status;                  // Generation status
```

---

## Main Methods

### Constructors

#### Default Constructor
```csharp
public RandomDungeonMaker()
```
Creates 8x8 dungeon with 50 blocks and random seeds.

#### Parametrized Constructor
```csharp
public RandomDungeonMaker(int Width, int Height, int Blocks)
```
Specify dimensions and block count, random seeds auto-generated.

#### Seeded Constructor
```csharp
public RandomDungeonMaker(int Width, int Height, int Blocks, int RNGSeed)
```
Full control including seed value. Use seed = 0 for random seed.

---

### Core Generation

#### makeDungeon()
```csharp
public RandomDungeonMaker makeDungeon()
```
**The main generation method** - Executes the complete dungeon generation pipeline.

**Process Flow**:
1. Initialize block grid
2. Execute generation based on DungeonMode:
   - DUNGEON mode: `MakeDungeonAndRoomShape()`
   - Others: `MakeDungeonShape()` ? `MakeDungeonRoomShape()` ? `MakeDungeonRoomConnections()`
3. Generate inner room details (if enabled)
4. Add support platforms (if enabled)
5. Configure open world (if enabled)
6. Distribute entities
7. Set status to "LOADED"

**Returns**: Self (for method chaining)

**Example**:
```csharp
var dungeon = new RandomDungeonMaker(20, 20, 200, 12345)
    .makeDungeon();
```

---

### Utility Methods

#### getBlock(int Id)
```csharp
public Block getBlock(int Id)
```
Retrieves a block by its ID number.

#### GetBlock(int x, int y)
```csharp
public Block GetBlock(int x, int y)
```
Retrieves a block by grid coordinates.

#### GraphiqueDungeon()
```csharp
public String GraphiqueDungeon()
```
Generates HTML table representation of the dungeon for visualization and debugging.

---

## Private Generation Methods

### MakeDungeonShape()
Generates the base dungeon structure using a growth algorithm:
- Starts from configured starting point
- Expands tile-by-tile based on available space
- Prioritizes recent blocks (CASTLE/TOWER) or random blocks (LABYRINTH)
- Creates the foundational layout

### MakeDungeonRoomShape()
Divides the dungeon into distinct rooms:
- Scans for ungrouped blocks
- Creates rooms of random size (within constraints)
- Uses backtracking to fill room boundaries
- Assigns unique room IDs

### MakeDungeonRoomConnections()
Connects isolated rooms with doorways:
- Uses depth-first traversal
- Ensures all rooms are reachable
- Places doors/passages intelligently
- Maintains connection list for pathfinding

### MakeDungeonAndRoomShape()
Combined method for DUNGEON mode:
- Alternates between room and path generation
- Creates room ? dig path ? create room pattern
- More organic than separate room/connection phases
- Produces natural dungeon flow

### MakeDungeonRoomInner()
Generates maze-like structures inside rooms:
- Creates winding paths within larger rooms
- Controlled by `LabyrinthInn` and `LabyrinthPathInn` flags
- Adds interior walls for complexity
- Skips single-tile rooms

### MakeDungeonSupportPlatform()
Places platforms on walls:
- Analyzes wall configurations
- Positions platforms at strategic points
- Uses zigzag pattern for variety
- Supports 3D/platformer gameplay

### ConfigureOpenWorld()
Removes walls for open exploration:
- Based on `OpenWorld` and `OpenWorldRate` settings
- Preserves structural integrity
- Can target specific rooms (SEMI mode)
- Creates more open environments

### DistributeDungeonElements()
Places entities throughout the dungeon:
- Respects placement rules (walls, indoor/outdoor)
- Handles important items specially
- Prevents overcrowding with occupancy tolerance
- Uses `RNGSeedElement` for placement

---

## Nested Classes

### Block
Represents a single tile in the dungeon grid.

**Properties**:
- Position: `X`, `Y`, `Id`
- Room data: `Room`, `RoomX`, `RoomY`
- Walls: `WallTop`, `WallBottom`, `WallLeft`, `WallRight`
- Room walls: `RoomWallTop`, `RoomWallBottom`, etc.
- Connections: `ConnectTop`, `ConnectBottom`, etc.
- Platforms: `SupportPlatformTop`, `SupportPlatformCenter`, `SupportPlatformBottom`
- Elements: `lstElementos`

### Room
Represents a generated room structure.

**Properties**:
- `Id`: Unique room identifier
- `Blocks`: 2D array of RoomBlock objects
- `Connections`: List of connected room IDs
- `roomType`: ROOM or PATH

### RoomBlock
Wraps a Block with room-relative coordinates.

### Entities
Configures entity spawning rules.

**Properties**:
- `NameTag`, `UID`: Identifiers
- `Total`: Number to spawn
- `IsImportant`: Critical item flag
- `OcuppedTolerance`: Tiles per entity
- `NotIndoor`: Indoor/outdoor requirement
- `ObligatoryWall[Top/Bottom/Left/Right]`: Wall requirements

**Enums**:
- `enumIndoorConsideration`: ONLY_INDOOR, NOT_INDOOR, NOT_IMPORTANT
- `enumWallElementConsideration`: YES, NO, BORDER, ROOM, NONE, NOT_IMPORTANT

### Element
Represents a placed entity instance.

**Properties**:
- `NameTag`: Display name
- `UID`: Unique identifier
- `IdBlock`: Block location
- `Element_id`: Instance ID

---

## Advantages & Strengths

### ? Reproducibility
Same seed = same dungeon every time. Perfect for:
- Level design testing
- Competitive gameplay
- Seed sharing communities
- Bug reproduction

### ? Flexibility
Supports multiple generation styles:
- Mazes and labyrinths
- Castle and fortress layouts
- Tower structures
- Mixed dungeon designs

### ? Scalability
- Works with any grid size
- Configurable complexity
- Block count limits prevent over-generation
- Efficient algorithms

### ? Integration
- Standalone C# class (no Unity dependencies in core logic)
- Works with DungeonBuilder for Unity rendering
- Exportable HTML visualization
- Clean separation of concerns

### ? Intelligent Placement
Entity system with:
- Rule-based spawning
- Wall proximity requirements
- Indoor/outdoor zones
- Occupancy management

### ? Extensibility
- Modular generation phases
- Easy to add new dungeon modes
- Customizable room shapes
- Platform for additional features

---

## Use Cases

### ?? Game Development
- Roguelike dungeons
- Procedural level generation
- Infinite replayability
- Dynamic content

### ??? Level Design
- Rapid prototyping
- Layout testing
- Seed-based iteration
- Template generation

### ?? Education & Research
- Algorithm visualization
- Procedural generation study
- Pathfinding testing
- AI training environments

### ?? Competitive Gaming
- Shared challenge levels
- Speedrunning seeds
- Tournament dungeons
- Fair competitive environments

---

## Integration Example

```csharp
using RDM;

// Create dungeon configuration
var dungeon = new RandomDungeonMaker(30, 30, 400, 54321);
dungeon.DungeonMode = RandomDungeonMaker.enumDungeonMode.CASTLE;
dungeon.DungeonRoomsWidthMin = 3;
dungeon.DungeonRoomsWidthMax = 7;
dungeon.OpenWorld = RandomDungeonMaker.enumOpenWorld.SEMI;
dungeon.SupportPlatforms = RandomDungeonMaker.enumSupportPlatforms.YES;

// Add entities
dungeon.lstEntities = new List<RandomDungeonMaker.Entities>();
dungeon.lstEntities.Add(new RandomDungeonMaker.Entities(
    "START", "START", 1, true
));
dungeon.lstEntities.Add(new RandomDungeonMaker.Entities(
    "Enemy", "EnemyPrefab", 10, false
));

// Generate dungeon
dungeon.makeDungeon();

// Use with DungeonBuilder (Unity)
dungeonBuilder.BuildDungeon(dungeon);
```

---

## Technical Notes

### Performance
- O(n) complexity for most operations (n = total blocks)
- Backtracking algorithms for room filling
- Efficient grid traversal
- Minimal memory overhead

### Thread Safety
?? Not thread-safe. Create separate instances for parallel generation.

### Dependencies
- `System.Collections.Generic`
- `System.Linq`
- Uses custom `MathRNG` class for randomization

---

## Summary

`RandomDungeonMaker.cs` is a powerful, flexible, and well-designed procedural dungeon generation system. Its strengths include:

?? **Deterministic** - Reproducible results via seeds  
?? **Versatile** - Multiple dungeon styles and configurations  
?? **Intelligent** - Smart room generation and entity placement  
?? **Scalable** - Works with any size and complexity  
?? **Extensible** - Easy to modify and expand  
?? **Professional** - Production-ready code quality  

Whether you're building a roguelike, need procedural levels, or want to study generation algorithms, RandomDungeonMaker provides a solid foundation with extensive customization options and reliable performance.
