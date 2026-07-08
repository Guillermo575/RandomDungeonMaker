using RDM.EditorWindow;
using System;
using UnityEngine;
[Serializable]
public class DungeonEditorWindowConfig : UnityEngine.ScriptableObject
{
    public DungeonConfig dungeonConfig;
    public bool GenerateRandomSeedAfterUse;
    public bool GenerateRandomSeedInnAfterUse;
    public bool GenerateRandomSeedElementAfterUse;
    public Vector3 StartingPoint;
    public DungeonEditorWindowConfig Clone()
    {
        DungeonEditorWindowConfig clone = new DungeonEditorWindowConfig();
        clone.dungeonConfig = this.dungeonConfig.Clone();
        clone.GenerateRandomSeedAfterUse = this.GenerateRandomSeedAfterUse;
        clone.GenerateRandomSeedInnAfterUse = this.GenerateRandomSeedInnAfterUse;
        clone.GenerateRandomSeedElementAfterUse = this.GenerateRandomSeedElementAfterUse;
        clone.StartingPoint = this.StartingPoint;
        return clone;
    }
}