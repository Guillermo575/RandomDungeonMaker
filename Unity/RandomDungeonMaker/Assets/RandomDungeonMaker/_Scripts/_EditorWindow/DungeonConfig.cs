using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Reflection;
namespace RDM.EditorWindow
{
    [Serializable]
    public class DungeonConfig
    {
        #region Variables
        public int RNGSeed;
        public int RNGSeedInn;
        public int RNGSeedElement;
        public int DungeonWidth;
        public int DungeonHeight;
        public int TotalBloquesDungeon;
        public int DungeonRoomsWidthMin;
        public int DungeonRoomsWidthMax;
        public int DungeonRoomsHeightMin;
        public int DungeonRoomsHeightMax;
        public int DungeonPathLongMin;
        public int DungeonPathLongMax;
        public int DungeonPathSizeMin;
        public int DungeonPathSizeMax;
        public bool FillDungeonRoomGap;
        public RandomDungeonMaker.enumDungeonRoomsSizeAmbivalence DungeonRoomsSizeAmbivalence;
        public RandomDungeonMaker.enumDungeonMode DungeonMode;
        public RandomDungeonMaker.enumLabyrinthInn LabyrinthInn;
        public RandomDungeonMaker.enumLabyrinthInn LabyrinthPathInn;
        public RandomDungeonMaker.enumStartPointX StartPointX;
        public RandomDungeonMaker.enumStartPointY StartPointY;
        public RandomDungeonMaker.enumOpenWorld OpenWorld;
        public RandomDungeonMaker.enumSupportPlatforms SupportPlatforms;
        public List<DungeonEntity> lstEntities;
        public float TileSize;
        public float ScaleWallY;
        public float ScaleWallZ;
        public GameObject Tile;
        public GameObject Wall;
        public DungeonBuilder.StretchWallType stretchWallType;
        [Range(0f, 1f)] public decimal OpenWorldRate;
        #endregion

        #region DungeonEntity
        [Serializable]
        public class DungeonEntity
        {
            public GameObject EntityObject;
            public int Total = 1;
            public bool IsImportant = false;
            public int OcuppedTolerance = 1;
            public RandomDungeonMaker.Entities.enumIndoorConsideration NotIndoor = RandomDungeonMaker.Entities.enumIndoorConsideration.NOT_IMPORTANT;
            public RandomDungeonMaker.Entities.enumWallElementConsideration ObligatoryBottomWall = RandomDungeonMaker.Entities.enumWallElementConsideration.NOT_IMPORTANT;
            public RandomDungeonMaker.Entities.enumWallElementConsideration ObligatoryTopWall = RandomDungeonMaker.Entities.enumWallElementConsideration.NOT_IMPORTANT;
            public RandomDungeonMaker.Entities.enumWallElementConsideration ObligatoryLeftWall = RandomDungeonMaker.Entities.enumWallElementConsideration.NOT_IMPORTANT;
            public RandomDungeonMaker.Entities.enumWallElementConsideration ObligatoryRightWall = RandomDungeonMaker.Entities.enumWallElementConsideration.NOT_IMPORTANT;
        }
        #endregion

        #region Clone
        public T CloneShallow<T>(T original) where T : class, new()
        {
            if (original == null) return null;
            T clone = new T();
            FieldInfo[] fields = typeof(T).GetFields(BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic);
            foreach (var field in fields)
            {
                Type fieldType = field.FieldType;
                if (typeof(ICollection).IsAssignableFrom(fieldType) || fieldType.IsArray) continue;
                if (fieldType.IsGenericType && (fieldType.GetGenericTypeDefinition() == typeof(List<>) || fieldType.GetGenericTypeDefinition() == typeof(IList<>))) continue;
                field.SetValue(clone, field.GetValue(original));
            }
            return clone;
        }
        public DungeonConfig Clone()
        {
            DungeonConfig clone = CloneShallow(this);
            clone.lstEntities = null;
            if (this.lstEntities != null)
            {
                clone.lstEntities = new List<DungeonEntity>();
                foreach (var entity in this.lstEntities)
                {
                    clone.lstEntities.Add(CloneShallow(entity));
                }
            }
            return clone;
        }
        #endregion
    }
}