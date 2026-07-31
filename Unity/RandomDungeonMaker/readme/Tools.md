# Tools Folder Documentation

This folder contains utility classes that provide essential functionality for the Random Dungeon Maker system.

## MathRNG.cs

**Purpose**: Pseudo-random number generator (PRNG) that provides deterministic random number generation using mathematical formulas.

**Key Features**:
- Seed-based random generation for reproducible results
- Multiple numeric type support (int, float, double, decimal)
- Custom mathematical catalyst formula for randomness
- Deterministic output - same seed always produces same sequence
- No dependency on Unity's random system during generation

**Why Use Custom RNG?**

Traditional random number generators (like `UnityEngine.Random` or `System.Random`) produce non-deterministic results or may vary between platforms. This custom RNG ensures:

1. **Reproducibility**: The same seed always generates the exact same dungeon
2. **Sharing**: Players can share seeds to play identical dungeons
3. **Testing**: Developers can reproduce specific dungeon layouts for debugging
4. **Cross-platform Consistency**: Same results across different platforms and Unity versions

**Properties**:
- `Seed`: The seed value that determines the random sequence
- `MinValue`: Minimum value for random range (when using parameterless methods)
- `MaxValue`: Maximum value for random range (when using parameterless methods)
- `Next`: Internal counter for sequence progression

**Constructors**:

```csharp
// Constructor with range and seed
MathRNG(decimal MinValue, decimal MaxValue, int Seed = 1)

// Constructor with seed only (for use with parameterized methods)
MathRNG(int Seed = 1)
```

**Core Methods**:

### Basic Random Generation:
- `GetRandom()`: Returns a random decimal value between 0 and 1
- `GetRandom(int MaxValue)`: Returns a random integer between 0 and MaxValue
- `GetRandom(int MinValue, int MaxValue)`: Returns a random integer in specified range

### Typed Random Generation:
- `NextValue()`: Returns decimal in constructor-defined range
- `NextValue(decimal MinValue, decimal MaxValue)`: Returns decimal in specified range
- `NextValueFloat()`: Returns float in constructor-defined range
- `NextValueFloat(float MinValue, float MaxValue)`: Returns float in specified range
- `NextValueDouble()`: Returns double in constructor-defined range
- `NextValueDouble(double MinValue, double MaxValue)`: Returns double in specified range
- `NextValueInt()`: Returns integer in constructor-defined range
- `NextValueInt(double MinValue, double MaxValue)`: Returns integer in specified range

### Algorithm:
- `GetCatalystSeed()`: Core formula that generates pseudo-random values
  - Uses sine function with dynamic seed modification
  - Alternates seed scaling based on iteration count
  - Normalizes output to range [0, 1]
  - Increments internal counter to progress sequence

**Mathematical Formula**:

The generator uses a custom catalyst formula:
```
SeedModified = Seed * scaling_factor (varies by iteration)
Catalyst = Sin(Next + SeedModified)
RandomValue = (Catalyst + 1) / 2  // Normalizes to [0, 1]
```

**Example Usage**:

```csharp
// Create RNG with seed
MathRNG rng = new MathRNG(12345);

// Generate room dimensions
int roomWidth = rng.GetRandom(3, 8);
int roomHeight = rng.GetRandom(3, 8);

// Generate probability check
float spawnChance = rng.NextValueFloat(0f, 1f);

// Same seed always produces same sequence
MathRNG rng1 = new MathRNG(100);
MathRNG rng2 = new MathRNG(100);
// rng1.GetRandom(10) == rng2.GetRandom(10) // Always true!
```

**Testing**:
- `Testing()`: Static method for validating randomness distribution
  - Tests unique value generation over multiple cycles
  - Measures maximum, minimum, and average unique values
  - Useful for verifying RNG quality

**Use Cases in RandomDungeonMaker**:

1. **Dungeon Layout** (`RNGSeed`): Determines overall structure, room placement, path connections
2. **Room Details** (`RNGSeedInn`): Controls inner room features, decorations, secondary elements
3. **Entity Placement** (`RNGSeedElement`): Decides where enemies, items, and treasures spawn

**Advantages**:

? **Deterministic**: Same seed = same dungeon every time  
? **Shareable**: Players can exchange seeds  
? **Debuggable**: Reproduce exact layouts for testing  
? **Independent**: Not affected by external random state  
? **Cross-platform**: Consistent across different systems  
? **Multiple Streams**: Three separate seeds for different aspects  
? **Overflow Protected**: Handles counter overflow gracefully  

**Limitations**:

?? **Not Cryptographically Secure**: Should not be used for security purposes  
?? **Predictable**: If someone knows the seed, they know the sequence  
?? **Sequential**: Must be called in same order to maintain consistency  

**Best Practices**:

1. Use separate RNG instances for different generation phases
2. Never skip random calls conditionally if reproducibility is important
3. Keep seed values positive for consistency
4. Store seeds with saved games for replay capability
5. Use different seed types (Seed, SeedInn, SeedElement) for independent control

**Integration with RandomDungeonMaker**:

The RandomDungeonMaker class uses three MathRNG instances:
- `MathRNGSeed`: Controls main dungeon structure
- `MathRNGSeedInn`: Controls room interior details  
- `MathRNGSeedElement`: Controls entity placement

This separation allows fine-grained control: you can keep the same layout but change entity positions by only modifying `RNGSeedElement`.

---

## Summary

The Tools folder currently contains the MathRNG class, which is the foundation of the entire procedural generation system. Its deterministic nature enables:

- **Level Design**: Create and save specific interesting layouts
- **Player Experience**: Share challenging or beautiful dungeons via seeds
- **Quality Assurance**: Test specific problematic layouts repeatedly
- **Competitive Play**: Ensure all players face the same challenges
- **Speedrunning**: Enable fair competition with identical layouts

This custom RNG implementation is a crucial component that transforms random chaos into controlled, reproducible procedural generation.
