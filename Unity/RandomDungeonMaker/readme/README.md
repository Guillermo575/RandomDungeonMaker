# Random Dungeon Maker - Documentation

![Unity](https://img.shields.io/badge/Unity-2020.3+-blue)
![.NET](https://img.shields.io/badge/.NET%20Framework-4.7.1-purple)
![License](https://img.shields.io/badge/License-Check%20Repository-green)

## ?? Overview

**Random Dungeon Maker** is a powerful procedural dungeon generation system for Unity that creates fully navigable, deterministic maze-like structures. This system uses seed-based random generation to produce reproducible dungeons with customizable rooms, corridors, entity placement, and visual rendering.

---

## ?? Key Features

? **Deterministic Generation** - Same seed always produces identical dungeons  
?? **Multiple Dungeon Styles** - Labyrinth, Castle, Tower, and Dungeon modes  
?? **Intelligent Room Connection** - Automatic pathfinding and doorway placement  
?? **Open World Support** - Configurable wall removal for exploration  
?? **Smart Entity Placement** - Rule-based spawning for enemies, items, and treasures  
?? **Platform Generation** - Support for 3D platformer gameplay  
?? **Unity Editor Integration** - Visual configuration interface  
?? **Highly Configurable** - Extensive parameters for customization  

---

## ?? Documentation Structure

This documentation is organized by folder structure within the `_Scripts` directory:

### Core Documentation
- **[RandomDungeonMaker.md](RandomDungeonMaker.md)** - Main generation algorithm and core class

### Folder-Based Documentation
- **[Structure.md](Structure.md)** - Classes for building and rendering dungeons in Unity
  - `DungeonFloor.cs` - Base class for floor management
  - `DungeonBuilder.cs` - Converts generation data into 3D Unity scene

- **[EditorWindow.md](EditorWindow.md)** - Unity Editor tools and configuration
  - `DungeonConfig.cs` - Configuration data container
  - `DungeonEditorWindow.cs` - Visual editor interface
  - `DungeonEditorWindowConfig.cs` - Editor preferences

- **[Tools.md](Tools.md)** - Utility classes and helpers
  - `MathRNG.cs` - Custom pseudo-random number generator

---

## ?? Quick Start

### Basic Usage

```csharp
using RDM;

// Create and configure dungeon
var dungeon = new RandomDungeonMaker(20, 20, 200, 12345);
dungeon.DungeonMode = RandomDungeonMaker.enumDungeonMode.LABYRINTH;
dungeon.DungeonRoomsWidthMin = 3;
dungeon.DungeonRoomsWidthMax = 6;

// Generate the dungeon
dungeon.makeDungeon();

// Build in Unity scene
dungeonBuilder.BuildDungeon(dungeon);
```

### Using the Editor Window

1. Open Unity Editor
2. Navigate to: **Tools ? Random Dungeon Maker**
3. Configure parameters in the window
4. Click "Generate" to create dungeon
5. Adjust and iterate as needed

---

## ??? Architecture

### Generation Pipeline

```
RandomDungeonMaker.makeDungeon()
    ?
1. Initialize Grid
    ?
2. Generate Structure (MakeDungeonShape)
    ?
3. Create Rooms (MakeDungeonRoomShape)
    ?
4. Connect Rooms (MakeDungeonRoomConnections)
    ?
5. Inner Details (MakeDungeonRoomInner)
    ?
6. Platforms (MakeDungeonSupportPlatform)
    ?
7. Open World (ConfigureOpenWorld)
    ?
8. Entity Placement (DistributeDungeonElements)
    ?
9. Return Complete Dungeon
```

### Class Hierarchy

```
RandomDungeonMaker (Core Algorithm)
    ??? DungeonConfig (Configuration Data)
        ??? DungeonEditorWindowConfig (Editor State)
            ??? DungeonEditorWindow (Editor UI)

DungeonFloor (Base Class)
    ??? DungeonBuilder (Unity Renderer)

MathRNG (Random Generator)
```

---

## ?? Seed System

The system uses **three independent seeds** for fine-grained control:

| Seed | Purpose | Controls |
|------|---------|----------|
| `RNGSeed` | Main structure | Dungeon layout, room placement, connections |
| `RNGSeedInn` | Room details | Inner walls, room mazes, decorations |
| `RNGSeedElement` | Entity placement | Enemy positions, item spawns, treasures |

**Advantages:**
- Change entity positions without altering layout
- Share interesting dungeon seeds with others
- Reproduce specific layouts for testing
- Create variations of the same structure

---

## ?? Dungeon Modes

### LABYRINTH
- Organic, maze-like growth
- Interconnected passages
- Natural exploration flow
- Best for: Roguelikes, exploration games

### CASTLE
- Structured, fortress-style
- Rectangular rooms
- Defensive layout
- Best for: Strategic games, tower defense

### TOWER
- Vertical design priority
- Stacked rooms
- Climb-focused layout
- Best for: Platformers, vertical progression

### DUNGEON
- Room-and-corridor hybrid
- Mixed organic and structured
- Traditional RPG feel
- Best for: Classic dungeon crawlers

---

## ?? Configuration Options

### Dimensions
- **DungeonWidth/Height**: Grid size (tiles)
- **TotalBloquesDungeon**: Number of tiles to generate

### Room Sizes
- **DungeonRoomsWidthMin/Max**: Room width range (2-10 recommended)
- **DungeonRoomsHeightMin/Max**: Room height range (2-10 recommended)
- **DungeonRoomsSizeAmbivalence**: Force square rooms (YES/NO)

### Paths
- **DungeonPathLongMin/Max**: Corridor length (1-5 typical)
- **DungeonPathSizeMin/Max**: Corridor width (1-2 typical)

### Generation Behavior
- **StartPointX/Y**: Initial generation point (CENTER/LEFT/RIGHT/TOP/BOTTOM)
- **FillDungeonRoomGap**: Fill empty spaces between rooms
- **LabyrinthInn**: Generate inner room mazes
- **LabyrinthPathInn**: Generate inner path mazes

### World Type
- **OpenWorld**: Wall removal (NO/SEMI/YES)
- **OpenWorldRate**: Percentage of walls to remove (0.0-1.0)
- **SupportPlatforms**: Add wall platforms (YES/NO)

---

## ?? Entity Placement

Define entities with placement rules:

```csharp
var enemy = new RandomDungeonMaker.Entities("Enemy", "EnemyPrefab", 5, false);
enemy.NotIndoor = Entities.enumIndoorConsideration.NOT_INDOOR;
enemy.ObligatoryBottomWall = Entities.enumWallElementConsideration.YES;
dungeon.lstEntities.Add(enemy);
```

**Placement Rules:**
- **NotIndoor**: ONLY_INDOOR, NOT_INDOOR, NOT_IMPORTANT
- **ObligatoryWall[Side]**: YES, NO, BORDER, ROOM, NONE, NOT_IMPORTANT
- **OcuppedTolerance**: Maximum entities per tile
- **IsImportant**: Priority placement for critical items

---

## ?? Integration with Unity

### Setup Requirements

1. **Prefabs Needed:**
   - Floor tile prefab
   - Wall prefab
   - Entity prefabs (optional)

2. **DungeonBuilder Component:**
   - Attach to GameObject in scene
   - Assign tile and wall prefabs
   - Configure visual properties

3. **Generation:**
   ```csharp
   var rdm = new RandomDungeonMaker(20, 20, 200, seed);
   rdm.makeDungeon();
   dungeonBuilder.BuildDungeon(rdm);
   ```

### NavMesh Integration

DungeonBuilder automatically builds NavMesh if `NavMeshSurface` component is attached to the parent GameObject.

---

## ?? Tips & Best Practices

### Performance
- Limit `TotalBloquesDungeon` for faster generation
- Use simpler dungeon modes for larger areas
- Generate dungeons asynchronously for runtime creation

### Design
- Start with default values and iterate
- Use LABYRINTH mode for organic feel
- Use CASTLE mode for structured layouts
- Test different seeds to find interesting patterns

### Debugging
- Use `HTMLTable` property to visualize in browser
- Enable tile labels to see block IDs
- Check room connections with debug visualization

### Seed Management
- Store seeds with save games
- Allow players to input custom seeds
- Create seed libraries for handpicked dungeons
- Use different seeds for similar layouts

---

## ?? Use Cases

### Game Types
- **Roguelikes**: Infinite replayability with procedural generation
- **RPGs**: Dynamic dungeon content
- **Puzzle Games**: Maze-based challenges
- **Horror Games**: Unpredictable environments
- **Platformers**: Vertical dungeon exploration

### Development Workflows
- **Rapid Prototyping**: Quick layout testing
- **Level Design**: Template generation
- **Playtesting**: Reproducible test scenarios
- **Content Creation**: Base for manual refinement

---

## ?? Technical Specifications

- **Language**: C#
- **Unity Version**: 2020.3+ (compatible with newer versions)
- **Target Framework**: .NET Framework 4.7.1
- **Dependencies**: TMPro (TextMeshPro), Unity.AI.Navigation (optional)
- **Thread Safety**: Not thread-safe (use separate instances)

---

## ?? Contributing

When contributing to the project:
1. Follow existing code style
2. Update documentation for new features
3. Test with multiple seed values
4. Ensure backward compatibility

---

## ?? Support

For issues, questions, or suggestions:
- Check the detailed documentation in each .md file
- Review the code comments in source files
- Test with different configuration combinations

---

## ?? Version History

Check the GitHub repository for version history and updates.

---

## ?? License

Please refer to the repository's license file for usage terms.

---

## ?? Acknowledgments

This procedural dungeon generation system demonstrates advanced algorithms for creating engaging, replayable game content. The seed-based approach enables unique features like seed sharing, reproducibility, and controlled randomness.

---

## ?? Further Reading

For detailed information about specific components:

- **[RandomDungeonMaker.md](RandomDungeonMaker.md)** - Complete algorithm documentation
- **[Structure.md](Structure.md)** - Building and rendering system
- **[EditorWindow.md](EditorWindow.md)** - Editor tools and configuration
- **[Tools.md](Tools.md)** - Utility classes and helpers

---

**Happy Dungeon Generating! ???**
