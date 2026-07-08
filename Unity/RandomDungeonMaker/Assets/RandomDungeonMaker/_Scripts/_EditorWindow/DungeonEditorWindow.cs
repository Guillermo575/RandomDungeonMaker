using UnityEngine;
using UnityEditor;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System;
using UnityEditor.SceneManagement;
using RDM;
using RDM.EditorWindow;
using static RDM.RandomDungeonMaker;
public class DungeonEditorWindow : EditorWindow
{
    #region private variables
    private Vector2 scrollPos;
    private DungeonEditorWindowConfig config;
    private int selectedEntityIndex = -1;
    private GameObject objDungeon;
    private int loops = 10000;
    private List<DungeonBuilder> dungeonBuilders = new List<DungeonBuilder>();
    private List<String> options;
    private int selectedIndex = 0;
    private const string newOptionLabel = "NEW";
    private string SelectedDungeon;
    private Texture2D previewTexture;
    #endregion

    #region Load/Save/reset Config
    private RandomDungeonMaker LoadConfigDungeon()
    {
        RandomDungeonMaker dungeon = new RandomDungeonMaker();
        dungeon.RNGSeed = config.dungeonConfig.RNGSeed;
        dungeon.RNGSeedElement = config.dungeonConfig.RNGSeedElement;
        dungeon.RNGSeedInn = config.dungeonConfig.RNGSeedInn;
        dungeon.DungeonWidth = config.dungeonConfig.DungeonWidth;
        dungeon.DungeonHeight = config.dungeonConfig.DungeonHeight;
        dungeon.TotalBloquesDungeon = config.dungeonConfig.TotalBloquesDungeon;
        dungeon.DungeonRoomsWidthMin = config.dungeonConfig.DungeonRoomsWidthMin;
        dungeon.DungeonRoomsWidthMax = config.dungeonConfig.DungeonRoomsWidthMax;
        dungeon.DungeonRoomsHeightMin = config.dungeonConfig.DungeonRoomsHeightMin;
        dungeon.DungeonRoomsHeightMax = config.dungeonConfig.DungeonRoomsHeightMax;
        dungeon.DungeonPathLongMin = config.dungeonConfig.DungeonPathLongMin;
        dungeon.DungeonPathLongMax = config.dungeonConfig.DungeonPathLongMax;
        dungeon.DungeonPathSizeMin = config.dungeonConfig.DungeonPathSizeMin;
        dungeon.DungeonPathSizeMax = config.dungeonConfig.DungeonPathSizeMax;
        dungeon.FillDungeonRoomGap = config.dungeonConfig.FillDungeonRoomGap;
        dungeon.DungeonRoomsSizeAmbivalence = config.dungeonConfig.DungeonRoomsSizeAmbivalence;
        dungeon.DungeonMode = config.dungeonConfig.DungeonMode;
        dungeon.LabyrinthInn = config.dungeonConfig.LabyrinthInn;
        dungeon.StartPointX = config.dungeonConfig.StartPointX;
        dungeon.StartPointY = config.dungeonConfig.StartPointY;
        dungeon.OpenWorld = config.dungeonConfig.OpenWorld;
        dungeon.OpenWorldRate = config.dungeonConfig.OpenWorldRate;
        dungeon.SupportPlatforms = config.dungeonConfig.SupportPlatforms;
        dungeon.lstEntities = new List<RandomDungeonMaker.Entities>();
        foreach (var item in config.dungeonConfig.lstEntities)
        {
            var newEntity = new RandomDungeonMaker.Entities(item.EntityObject.name, item.EntityObject.name, item.Total, item.IsImportant);
            newEntity.OcuppedTolerance = item.OcuppedTolerance;
            newEntity.NotIndoor = item.NotIndoor;
            newEntity.ObligatoryBottomWall = item.ObligatoryBottomWall;
            newEntity.ObligatoryTopWall = item.ObligatoryTopWall;
            newEntity.ObligatoryLeftWall = item.ObligatoryLeftWall;
            newEntity.ObligatoryRightWall = item.ObligatoryRightWall;
            dungeon.lstEntities.Add(newEntity);
        }
        return dungeon;
    }
    private DungeonBuilder LoadConfigDungeonBuilder(DungeonBuilder dungeonBuilder)
    {
        dungeonBuilder = dungeonBuilder == null ? new DungeonBuilder() : dungeonBuilder;
        dungeonBuilder.TileSize = config.dungeonConfig.TileSize;
        dungeonBuilder.ScaleWallY = config.dungeonConfig.ScaleWallY;
        dungeonBuilder.ScaleWallZ = config.dungeonConfig.ScaleWallZ;
        dungeonBuilder.Tile = config.dungeonConfig.Tile;
        dungeonBuilder.Wall = config.dungeonConfig.Wall;
        dungeonBuilder.StartingPoint = config.StartingPoint;
        dungeonBuilder.lstPrefabs = new List<GameObject>();
        foreach (var item in config.dungeonConfig.lstEntities)
        {
            dungeonBuilder.lstPrefabs.Add(item.EntityObject);
        }
        return dungeonBuilder;
    }
    private void SaveDungeonToConfig()
    {
        AssetDatabase.CreateAsset(config, GetAssetPath());
        AssetDatabase.SaveAssets();
        config = config.Clone();
    }
    private void ResetToDefaults()
    {
        config.dungeonConfig = new DungeonConfig();
        config.dungeonConfig.RNGSeed = 100;
        config.GenerateRandomSeedAfterUse = true;
        config.dungeonConfig.RNGSeedInn = 100;
        config.GenerateRandomSeedInnAfterUse = true;
        config.dungeonConfig.RNGSeedElement = 100;
        config.GenerateRandomSeedElementAfterUse = true;
        config.dungeonConfig.DungeonWidth = 10;
        config.dungeonConfig.DungeonHeight = 10;
        config.dungeonConfig.TotalBloquesDungeon = 80;
        config.dungeonConfig.DungeonRoomsWidthMin = 3;
        config.dungeonConfig.DungeonRoomsWidthMax = 5;
        config.dungeonConfig.DungeonRoomsHeightMin = 3;
        config.dungeonConfig.DungeonRoomsHeightMax = 5;
        config.dungeonConfig.DungeonPathLongMin = 1;
        config.dungeonConfig.DungeonPathLongMax = 3;
        config.dungeonConfig.DungeonPathSizeMin = 1;
        config.dungeonConfig.DungeonPathSizeMax = 1;
        config.dungeonConfig.FillDungeonRoomGap = false;
        config.dungeonConfig.DungeonRoomsSizeAmbivalence = enumDungeonRoomsSizeAmbivalence.NO;
        config.dungeonConfig.DungeonMode = enumDungeonMode.LABYRINTH;
        config.dungeonConfig.LabyrinthInn = enumLabyrinthInn.YES;
        config.dungeonConfig.StartPointX = enumStartPointX.CENTER;
        config.dungeonConfig.StartPointY = enumStartPointY.CENTER;
        config.dungeonConfig.OpenWorld = enumOpenWorld.NO;
        config.dungeonConfig.OpenWorldRate = 0.5m;
        config.dungeonConfig.SupportPlatforms = enumSupportPlatforms.NO;
        config.dungeonConfig.TileSize = 10f;
        config.dungeonConfig.ScaleWallY = 3f;
        config.dungeonConfig.ScaleWallZ = 1f;
        config.dungeonConfig.Tile = null;
        config.dungeonConfig.Wall = null;
        config.dungeonConfig.lstEntities = new List<DungeonConfig.DungeonEntity>();
    }
    private void RefreshDungeonBuilders()
    {
        int DungeonCountBefore = dungeonBuilders.Count;
        dungeonBuilders = FindObjectsByType<DungeonBuilder>(FindObjectsSortMode.InstanceID).OrderBy(x => x.gameObject.name).ToList();
        int DungeonCountNow = dungeonBuilders.Count;
        options = dungeonBuilders.Select(db => db.gameObject.name).OrderBy(x => x).ToList();
        options.Insert(0, newOptionLabel);
        selectedIndex = DungeonCountNow != DungeonCountBefore ? 0 : selectedIndex;
        SelectDungeon();
    }
    private void SelectDungeon()
    {
        if (selectedIndex > 0)
        {
            DungeonBuilder selectedBuilder = dungeonBuilders[selectedIndex - 1];
            objDungeon = selectedBuilder.gameObject;
            if (objDungeon != null)
            {
                config.dungeonConfig = selectedBuilder.dungeonConfig.Clone();
                FocusSceneViewOnObject(selectedBuilder.gameObject, (config.dungeonConfig.DungeonWidth + config.dungeonConfig.DungeonHeight) * 2);
                config.StartingPoint = selectedBuilder.gameObject.transform.position;
            }
            else
            {
                RefreshDungeonBuilders();
            }
        }
        else
        {
            objDungeon = null;
        }
    }
    #endregion

    #region Load ScriptableObject Default
    private string GetAssetPath()
    {
        string scriptPath = AssetDatabase.GetAssetPath(MonoScript.FromScriptableObject(this));
        string folder = Path.GetDirectoryName(scriptPath);
        return Path.Combine(folder, "DungeonEditorWindowConfig.asset");
    }
    private void LoadConfigSO()
    {
        config = AssetDatabase.LoadAssetAtPath<DungeonEditorWindowConfig>(GetAssetPath());
        if (config == null)
        {
            config = UnityEngine.ScriptableObject.CreateInstance<DungeonEditorWindowConfig>();
            ResetToDefaults();
            AssetDatabase.CreateAsset(config, GetAssetPath());
            AssetDatabase.SaveAssets();
        }
        config = config.Clone();
    }
    #endregion

    #region ScriptableObject file
    private void LoadDungeonConfig()
    {
        string path = EditorUtility.OpenFilePanel("Selecciona tu DungeonConfig", "Assets", "asset");
        if (!string.IsNullOrEmpty(path))
        {
            if (path.StartsWith(Application.dataPath))
            {
                string relativePath = "Assets" + path.Substring(Application.dataPath.Length);
                config = AssetDatabase.LoadAssetAtPath<DungeonEditorWindowConfig>(relativePath);
                if (config == null)
                {
                    Debug.LogWarning("No DungeonConfig in : " + relativePath);
                }
            }
            else
            {
                Debug.LogWarning("Please, select a file inside an Assets folder");
            }
        }
    }
    private void SaveDungeonConfig(DungeonEditorWindowConfig dungeonConfig)
    {
        if (config == null)
        {
            Debug.LogError("Config not assigned");
            return;
        }
        string path = EditorUtility.SaveFilePanel(
            "Guardar ScriptableObject",
            "Assets/",
            config.name + ".asset",
            "asset"
        );
        if (!string.IsNullOrEmpty(path))
        {
            if (path.StartsWith(Application.dataPath))
            {
                string relativePath = "Assets" + path.Substring(Application.dataPath.Length);
                AssetDatabase.CreateAsset(config.Clone(), relativePath);
                AssetDatabase.SaveAssets();
                Debug.Log("ScriptableObject guardado en: " + relativePath);
            }
            else
            {
                Debug.LogError("La ruta debe estar dentro de la carpeta Assets");
            }
        }
    }
    #endregion

    #region GUI
    [MenuItem("Tools/Random Dungeon Maker")]
    public static void ShowWindow()
    {
        GetWindow<DungeonEditorWindow>("Dungeon Editor");
    }
    private void OnEnable()
    {
        LoadConfigSO();
        RefreshDungeonBuilders();
    }
    private void OnGUI()
    {
        scrollPos = EditorGUILayout.BeginScrollView(scrollPos);

        #region Dungeon Select
        EditorGUILayout.BeginHorizontal();
        int newSelectedIndex = EditorGUILayout.Popup(selectedIndex, options.ToArray());
        if (newSelectedIndex != selectedIndex)
        {
            selectedIndex = newSelectedIndex;
            RefreshDungeonBuilders();
            SelectDungeon();
        }
        if (GUILayout.Button("Refresh", GUILayout.Width(100)))
        {
            RefreshDungeonBuilders();
        }
        EditorGUILayout.EndHorizontal();
        EditorGUILayout.Space();
        #endregion

        #region Save/Load/Reset Config
        EditorGUILayout.BeginHorizontal();
        EditorGUILayout.LabelField("Dungeon Configuration", EditorStyles.boldLabel, GUILayout.Width(200), GUILayout.Height(20));
        if (GUILayout.Button("Load", GUILayout.Width(getTextWidth("Load"))))
        {
            LoadDungeonConfig();
        }
        if (GUILayout.Button("Save", GUILayout.Width(getTextWidth("Save"))))
        {
            SaveDungeonToConfig();
        }
        if (GUILayout.Button("Save As", GUILayout.Width(getTextWidth("Save As"))))
        {
            SaveDungeonConfig(config);
        }
        if (GUILayout.Button("Reset", GUILayout.Width(getTextWidth("Reset"))))
        {
            ResetToDefaults();
        }
        EditorGUILayout.EndHorizontal();
        EditorGUILayout.Space();
        #endregion

        #region Seed
        EditorGUILayout.BeginHorizontal();
        EditorGUILayout.LabelField("Seed", GUILayout.Width(getTextWidth("Seed Element")));
        config.dungeonConfig.RNGSeed = EditorGUILayout.IntField(config.dungeonConfig.RNGSeed, GUILayout.Width(180));
        if (GUILayout.Button("Random Seed", GUILayout.Width(getTextWidth("Random Seed"))))
        {
            config.dungeonConfig.RNGSeed = new System.Random().Next(1, 999999999);
        }
        EditorGUILayout.LabelField("Generate new seed after use", GUILayout.Width(180));
        config.GenerateRandomSeedAfterUse = EditorGUILayout.Toggle(config.GenerateRandomSeedAfterUse, GUILayout.Width(30));
        EditorGUILayout.EndHorizontal();
        EditorGUILayout.Space();
        #endregion

        #region Seed Inn
        EditorGUILayout.BeginHorizontal();
        EditorGUILayout.LabelField("Seed Inn", GUILayout.Width(getTextWidth("Seed Element")));
        config.dungeonConfig.RNGSeedInn = EditorGUILayout.IntField(config.dungeonConfig.RNGSeedInn, GUILayout.Width(180));
        if (GUILayout.Button("Random Seed", GUILayout.Width(getTextWidth("Random Seed"))))
        {
            config.dungeonConfig.RNGSeedInn = new System.Random().Next(1, 999999999);
        }
        EditorGUILayout.LabelField("Generate new seed after use", GUILayout.Width(180));
        config.GenerateRandomSeedInnAfterUse = EditorGUILayout.Toggle(config.GenerateRandomSeedInnAfterUse, GUILayout.Width(30));
        EditorGUILayout.EndHorizontal();
        EditorGUILayout.Space();
        #endregion

        #region Seed Element
        EditorGUILayout.BeginHorizontal();
        EditorGUILayout.LabelField("Seed Element", GUILayout.Width(getTextWidth("Seed Element")));
        config.dungeonConfig.RNGSeedElement = EditorGUILayout.IntField(config.dungeonConfig.RNGSeedElement, GUILayout.Width(180));
        if (GUILayout.Button("Random Seed", GUILayout.Width(getTextWidth("Random Seed"))))
        {
            config.dungeonConfig.RNGSeedElement = new System.Random().Next(1, 999999999);
        }
        EditorGUILayout.LabelField("Generate new seed after use", GUILayout.Width(180));
        config.GenerateRandomSeedElementAfterUse = EditorGUILayout.Toggle(config.GenerateRandomSeedElementAfterUse, GUILayout.Width(30));
        EditorGUILayout.EndHorizontal();
        EditorGUILayout.Space();
        #endregion

        #region Size
        EditorGUILayout.BeginHorizontal();
        EditorGUILayout.LabelField("Width", GUILayout.Width(getTextWidth("Widt")));
        config.dungeonConfig.DungeonWidth = EditorGUILayout.IntField(config.dungeonConfig.DungeonWidth, GUILayout.Width(60));
        EditorGUILayout.LabelField("Height", GUILayout.Width(getTextWidth("Heigh")));
        config.dungeonConfig.DungeonHeight = EditorGUILayout.IntField(config.dungeonConfig.DungeonHeight, GUILayout.Width(60));
        EditorGUILayout.LabelField("Blocks", GUILayout.Width(getTextWidth("Bloc")));
        config.dungeonConfig.TotalBloquesDungeon = EditorGUILayout.IntField(config.dungeonConfig.TotalBloquesDungeon, GUILayout.Width(60));
        EditorGUILayout.LabelField("Start Point", GUILayout.Width(getTextWidth("StartPoi")));
        config.StartingPoint = EditorGUILayout.Vector3Field("", config.StartingPoint, GUILayout.Width(150));
        EditorGUILayout.EndHorizontal();
        EditorGUILayout.Space();
        #endregion

        #region Shape
        EditorGUILayout.BeginHorizontal();
        EditorGUILayout.LabelField("Dungeon Mode", GUILayout.Width(100));
        config.dungeonConfig.DungeonMode = (enumDungeonMode)EditorGUILayout.EnumPopup(config.dungeonConfig.DungeonMode, GUILayout.Width(120));
        EditorGUILayout.LabelField("Open World", GUILayout.Width(100));
        config.dungeonConfig.OpenWorld = (enumOpenWorld)EditorGUILayout.EnumPopup(config.dungeonConfig.OpenWorld, GUILayout.Width(120));
        EditorGUILayout.LabelField("Rate", GUILayout.Width(50));
        config.dungeonConfig.OpenWorldRate = (decimal)EditorGUILayout.Slider((float)config.dungeonConfig.OpenWorldRate, 0f, 1f, GUILayout.Width(100));
        EditorGUILayout.EndHorizontal();
        EditorGUILayout.BeginHorizontal();
        EditorGUILayout.LabelField("Start Point X", GUILayout.Width(100));
        config.dungeonConfig.StartPointX = (enumStartPointX)EditorGUILayout.EnumPopup(config.dungeonConfig.StartPointX, GUILayout.Width(120));
        EditorGUILayout.LabelField("Start Point Y", GUILayout.Width(100));
        config.dungeonConfig.StartPointY = (enumStartPointY)EditorGUILayout.EnumPopup(config.dungeonConfig.StartPointY, GUILayout.Width(120));
        EditorGUILayout.EndHorizontal();
        EditorGUILayout.Space();
        #endregion

        #region Rooms
        EditorGUILayout.BeginHorizontal();
        EditorGUILayout.LabelField("Rooms Width Min", GUILayout.Width(120));
        config.dungeonConfig.DungeonRoomsWidthMin = EditorGUILayout.IntField(config.dungeonConfig.DungeonRoomsWidthMin, GUILayout.Width(80));
        EditorGUILayout.LabelField("Rooms Width Max", GUILayout.Width(120));
        config.dungeonConfig.DungeonRoomsWidthMax = EditorGUILayout.IntField(config.dungeonConfig.DungeonRoomsWidthMax, GUILayout.Width(80));
        EditorGUILayout.EndHorizontal();
        EditorGUILayout.BeginHorizontal();
        EditorGUILayout.LabelField("Rooms Height Min", GUILayout.Width(120));
        config.dungeonConfig.DungeonRoomsHeightMin = EditorGUILayout.IntField(config.dungeonConfig.DungeonRoomsHeightMin, GUILayout.Width(80));
        EditorGUILayout.LabelField("Rooms Height Max", GUILayout.Width(120));
        config.dungeonConfig.DungeonRoomsHeightMax = EditorGUILayout.IntField(config.dungeonConfig.DungeonRoomsHeightMax, GUILayout.Width(80));
        EditorGUILayout.EndHorizontal();
        EditorGUILayout.BeginHorizontal();
        EditorGUILayout.LabelField("Inner walls", GUILayout.Width(120));
        config.dungeonConfig.LabyrinthInn = (enumLabyrinthInn)EditorGUILayout.EnumPopup(config.dungeonConfig.LabyrinthInn, GUILayout.Width(80));
        EditorGUILayout.LabelField("Rooms Size Ambivalence", GUILayout.Width(150));
        config.dungeonConfig.DungeonRoomsSizeAmbivalence = (enumDungeonRoomsSizeAmbivalence)EditorGUILayout.EnumPopup(config.dungeonConfig.DungeonRoomsSizeAmbivalence, GUILayout.Width(50));
        EditorGUILayout.EndHorizontal();
        #endregion

        #region Path
        if (config.dungeonConfig.DungeonMode == enumDungeonMode.DUNGEON)
        {
            EditorGUILayout.BeginHorizontal();
            EditorGUILayout.LabelField("Path Long Min", GUILayout.Width(120));
            config.dungeonConfig.DungeonPathLongMin = EditorGUILayout.IntField(config.dungeonConfig.DungeonPathLongMin, GUILayout.Width(80));
            EditorGUILayout.LabelField("Path Long Max", GUILayout.Width(120));
            config.dungeonConfig.DungeonPathLongMax = EditorGUILayout.IntField(config.dungeonConfig.DungeonPathLongMax, GUILayout.Width(80));
            EditorGUILayout.LabelField("Fill Room Gap", GUILayout.Width(90));
            config.dungeonConfig.FillDungeonRoomGap = EditorGUILayout.Toggle(config.dungeonConfig.FillDungeonRoomGap, GUILayout.Width(30));
            EditorGUILayout.EndHorizontal();
            EditorGUILayout.Space();
            EditorGUILayout.BeginHorizontal();
            EditorGUILayout.LabelField("Path Size Min", GUILayout.Width(120));
            config.dungeonConfig.DungeonPathSizeMin = EditorGUILayout.IntField(config.dungeonConfig.DungeonPathSizeMin, GUILayout.Width(80));
            EditorGUILayout.LabelField("Path Size Max", GUILayout.Width(120));
            config.dungeonConfig.DungeonPathSizeMax = EditorGUILayout.IntField(config.dungeonConfig.DungeonPathSizeMax, GUILayout.Width(80));
            EditorGUILayout.LabelField("Path Inn", GUILayout.Width(50));
            config.dungeonConfig.LabyrinthPathInn = (enumLabyrinthInn)EditorGUILayout.EnumPopup(config.dungeonConfig.LabyrinthPathInn, GUILayout.Width(80));
            EditorGUILayout.EndHorizontal();
            EditorGUILayout.Space();
        }
        #endregion

        #region Other
        //config.dungeonConfig.SupportPlatforms = (enumSupportPlatforms)EditorGUILayout.EnumPopup("Support Platforms", config.dungeonConfig.SupportPlatforms);
        #endregion

        #region Tile
        EditorGUILayout.BeginHorizontal();
        EditorGUILayout.LabelField("Tile", GUILayout.Width(getTextWidth("Tile")));
        config.dungeonConfig.Tile = (GameObject)EditorGUILayout.ObjectField(config.dungeonConfig.Tile, typeof(GameObject), false, GUILayout.Width(180));
        EditorGUILayout.LabelField("Size", GUILayout.Width(getTextWidth("Size  ")));
        config.dungeonConfig.TileSize = EditorGUILayout.FloatField(config.dungeonConfig.TileSize, GUILayout.Width(50));
        EditorGUILayout.EndHorizontal();
        #endregion

        #region Wall
        EditorGUILayout.BeginHorizontal();
        EditorGUILayout.LabelField("Wall", GUILayout.Width(getTextWidth("Wall")));
        config.dungeonConfig.Wall = (GameObject)EditorGUILayout.ObjectField(config.dungeonConfig.Wall, typeof(GameObject), false, GUILayout.Width(180));
        EditorGUILayout.LabelField("Scale Y", GUILayout.Width(getTextWidth("ScaleZ")));
        config.dungeonConfig.ScaleWallY = EditorGUILayout.FloatField(config.dungeonConfig.ScaleWallY, GUILayout.Width(50));
        EditorGUILayout.LabelField("Scale Z", GUILayout.Width(getTextWidth("ScaleZ")));
        config.dungeonConfig.ScaleWallZ = EditorGUILayout.FloatField(config.dungeonConfig.ScaleWallZ, GUILayout.Width(50));
        EditorGUILayout.LabelField("Stretch Wall", GUILayout.Width(100));
        config.dungeonConfig.stretchWallType = (DungeonBuilder.StretchWallType)EditorGUILayout.EnumPopup(config.dungeonConfig.stretchWallType, GUILayout.Width(120));
        EditorGUILayout.EndHorizontal();
        #endregion

        #region Elements
        EditorGUILayout.Space();
        EditorGUILayout.BeginHorizontal();
        EditorGUILayout.LabelField("Entities", EditorStyles.boldLabel, GUILayout.Width(getTextWidth("Entities")));
        if (GUILayout.Button("Add new", GUILayout.Width(80), GUILayout.Height(25)))
        {
            var newEntity = new DungeonConfig.DungeonEntity();
            newEntity.EntityObject = null;
            newEntity.OcuppedTolerance = 1;
            newEntity.NotIndoor = RandomDungeonMaker.Entities.enumIndoorConsideration.NOT_IMPORTANT;
            newEntity.ObligatoryBottomWall = RandomDungeonMaker.Entities.enumWallElementConsideration.NOT_IMPORTANT;
            newEntity.ObligatoryTopWall = RandomDungeonMaker.Entities.enumWallElementConsideration.NOT_IMPORTANT;
            newEntity.ObligatoryLeftWall = RandomDungeonMaker.Entities.enumWallElementConsideration.NOT_IMPORTANT;
            newEntity.ObligatoryRightWall = RandomDungeonMaker.Entities.enumWallElementConsideration.NOT_IMPORTANT;
            config.dungeonConfig.lstEntities.Add(newEntity);
        }
        EditorGUILayout.EndHorizontal();
        if (config.dungeonConfig.lstEntities != null)
        {
            for (int i = 0; i < config.dungeonConfig.lstEntities.Count; i++)
            {
                var entity = config.dungeonConfig.lstEntities[i];
                EditorGUILayout.BeginHorizontal();
                if (GUILayout.Button("Remove", GUILayout.Width(getTextWidth("Remove"))))
                {
                    config.dungeonConfig.lstEntities.Remove(entity);
                }
                var newObject = (GameObject)EditorGUILayout.ObjectField("", entity.EntityObject, typeof(GameObject), false, GUILayout.Width(180));
                if (newObject != entity.EntityObject && newObject != null)
                {
                    bool exists = config.dungeonConfig.lstEntities.Any(e => e.EntityObject != null && e.EntityObject.name == newObject.name);
                    if (exists)
                    {
                        newObject = null;
                        Debug.LogWarning("No se puede agregar un asset con un nombre duplicado.");
                        EditorUtility.DisplayDialog("Alerta", "No se puede agregar assets iguales.", "OK");
                    }
                }
                entity.EntityObject = newObject;
                EditorGUILayout.LabelField("Total", EditorStyles.boldLabel, GUILayout.Width(getTextWidth("Total")));
                entity.Total = EditorGUILayout.IntField(entity.Total, GUILayout.Width(50));
                EditorGUILayout.LabelField("Important", EditorStyles.boldLabel, GUILayout.Width(getTextWidth("Importa")));
                entity.IsImportant = EditorGUILayout.Toggle(entity.IsImportant, GUILayout.Width(30));
                EditorGUILayout.LabelField("OcuppedTolerance", EditorStyles.boldLabel, GUILayout.Width(getTextWidth("OcuppedTolerance")));
                entity.OcuppedTolerance = EditorGUILayout.IntField(entity.OcuppedTolerance, GUILayout.Width(50));
                EditorGUILayout.EndHorizontal();
            }
        }
        else
        {
            config.dungeonConfig.lstEntities = new List<DungeonConfig.DungeonEntity>();
        }
        EditorGUILayout.Space();
        #endregion

        #region Preview
        EditorGUILayout.BeginHorizontal();
        if (GUILayout.Button("Preview", GUILayout.Width(getTextWidth("Preview")), GUILayout.Height(20)))
        {
            RandomDungeonMaker dungeon = LoadConfigDungeon();
            dungeon.makeDungeon();
            GeneratePreviewTexture(dungeon);
        }
        EditorGUILayout.EndHorizontal();
        if (previewTexture != null)
        {
            float maxWidth = position.width - 20;
            float aspectRatio = (float)previewTexture.height / previewTexture.width;
            Rect rect = GUILayoutUtility.GetRect(300, 300);
            //Rect rect = GUILayoutUtility.GetRect(maxWidth, maxWidth * aspectRatio);
            GUI.DrawTexture(rect, previewTexture, ScaleMode.ScaleToFit);
        }
        #endregion

        #region Build
        EditorGUILayout.BeginHorizontal();
        if (GUILayout.Button("Make Dungeon", GUILayout.Width(300), GUILayout.Height(50)))
        {
            BuildDungeon();
        }
        //if (GUILayout.Button("Reset Dungeon", GUILayout.Width(150)))
        //{
        //    DestroyImmediate(objDungeon);
        //    BuildDungeon();
        //}
        //if (GUILayout.Button("Test", GUILayout.Width(40)))
        //{
        //    Test(loops);
        //}
        //loops = EditorGUILayout.IntField(loops, GUILayout.Width(80));
        EditorGUILayout.EndHorizontal();
        EditorGUILayout.Space();
        #endregion

        EditorGUILayout.EndScrollView();
    }
    #endregion

    #region GUI Methods
    public GameObject BuildDungeonObject(RandomDungeonMaker dungeon)
    {
        var allObjects = FindObjectsByType<DungeonBuilder>(FindObjectsSortMode.InstanceID).ToList();
        var Main = new GameObject();
        Main.name = "pDungeon_" + allObjects.Count;
        var pStructure = new GameObject();
        pStructure.name = "pStructure";
        pStructure.transform.parent = Main.transform;
        var pCameraPivot = new GameObject();
        pCameraPivot.name = "pCameraPivot";
        pCameraPivot.transform.parent = Main.transform;
        Main.AddComponent<DungeonBuilder>();
        DungeonBuilder dungeonBuilder = LoadConfigDungeonBuilder(Main.GetComponent<DungeonBuilder>());
        dungeonBuilder.dungeonConfig = config.dungeonConfig;
        return dungeonBuilder.BuildDungeon(dungeon, false, config.dungeonConfig.stretchWallType);
    }
    public void BuildDungeon()
    {
        bool NoObjectEntities = config.dungeonConfig.lstEntities.Any(e => e.EntityObject == null);
        if (config.dungeonConfig.Tile != null && config.dungeonConfig.Wall != null && !NoObjectEntities)
        {
            ValidateConfig();
            SaveDungeonToConfig();
            RandomDungeonMaker dungeon = LoadConfigDungeon();
            dungeon.makeDungeon();
            var objDungeonTemp = BuildDungeonObject(dungeon);
            if (objDungeon != null)
            {
                String NameDungeon = objDungeon.name;
                int indexSibling = objDungeon.transform.GetSiblingIndex();
                DestroyImmediate(objDungeon);
                objDungeonTemp.name = NameDungeon;
                objDungeonTemp.transform.SetSiblingIndex(indexSibling);
            }
            objDungeon = objDungeonTemp;
            Undo.RegisterCreatedObjectUndo(objDungeon, "Crear Objeto");
            EditorSceneManager.MarkSceneDirty(EditorSceneManager.GetActiveScene());
            RefreshDungeonBuilders();
            //FocusSceneViewOnObject(objDungeon, (dungeon.DungeonWidth + dungeon.DungeonHeight) * 2);
            config.dungeonConfig.RNGSeed = config.GenerateRandomSeedAfterUse ? new System.Random().Next(1, 999999999) : config.dungeonConfig.RNGSeed;
            config.dungeonConfig.RNGSeedInn = config.GenerateRandomSeedInnAfterUse ? new System.Random().Next(1, 999999999) : config.dungeonConfig.RNGSeedInn;
            config.dungeonConfig.RNGSeedElement = config.GenerateRandomSeedElementAfterUse ? new System.Random().Next(1, 999999999) : config.dungeonConfig.RNGSeedElement;
            Debug.Log("Dungeon generated");
        }
        else
        {
            if (config.dungeonConfig.Tile == null)
            {
                Debug.LogError("No Tile detected");
            }
            if (config.dungeonConfig.Wall == null)
            {
                Debug.LogError("No Wall detected");
            }
            if (NoObjectEntities)
            {
                Debug.LogError("You need to asign an asset on the entities");
            }
        }
    }
    public void ValidateConfig()
    {
        config.dungeonConfig.RNGSeed = config.dungeonConfig.RNGSeed < 1 ? 1 : config.dungeonConfig.RNGSeed;
        config.dungeonConfig.RNGSeedInn = config.dungeonConfig.RNGSeedInn < 1 ? 1 : config.dungeonConfig.RNGSeedInn;
        config.dungeonConfig.RNGSeedElement = config.dungeonConfig.RNGSeedElement < 1 ? 1 : config.dungeonConfig.RNGSeedElement;
        config.dungeonConfig.DungeonWidth = config.dungeonConfig.DungeonWidth < 5 ? 5 : config.dungeonConfig.DungeonWidth;
        config.dungeonConfig.DungeonHeight = config.dungeonConfig.DungeonHeight < 5 ? 5 : config.dungeonConfig.DungeonHeight;
        config.dungeonConfig.TotalBloquesDungeon = config.dungeonConfig.TotalBloquesDungeon < 10 ? 10 : config.dungeonConfig.TotalBloquesDungeon;
        config.dungeonConfig.DungeonRoomsWidthMin = config.dungeonConfig.DungeonRoomsWidthMin < 1 ? 1 : config.dungeonConfig.DungeonRoomsWidthMin;
        config.dungeonConfig.DungeonRoomsWidthMax = config.dungeonConfig.DungeonRoomsWidthMax < 1 ? 1 : config.dungeonConfig.DungeonRoomsWidthMax < config.dungeonConfig.DungeonRoomsWidthMin ? config.dungeonConfig.DungeonRoomsWidthMin : config.dungeonConfig.DungeonRoomsWidthMax;
        config.dungeonConfig.DungeonRoomsHeightMin = config.dungeonConfig.DungeonRoomsHeightMin < 1 ? 1 : config.dungeonConfig.DungeonRoomsHeightMin;
        config.dungeonConfig.DungeonRoomsHeightMax = config.dungeonConfig.DungeonRoomsHeightMax < 1 ? 1 : config.dungeonConfig.DungeonRoomsHeightMax < config.dungeonConfig.DungeonRoomsHeightMin ? config.dungeonConfig.DungeonRoomsHeightMin : config.dungeonConfig.DungeonRoomsHeightMax;
        config.dungeonConfig.DungeonPathLongMin = config.dungeonConfig.DungeonPathLongMin < 1 ? 1 : config.dungeonConfig.DungeonPathLongMin;
        config.dungeonConfig.DungeonPathLongMax = config.dungeonConfig.DungeonPathLongMax < 1 ? 1 : config.dungeonConfig.DungeonPathLongMax < config.dungeonConfig.DungeonPathLongMin ? config.dungeonConfig.DungeonPathLongMin : config.dungeonConfig.DungeonPathLongMax;
        config.dungeonConfig.DungeonPathSizeMin = config.dungeonConfig.DungeonPathSizeMin < 1 ? 1 : config.dungeonConfig.DungeonPathSizeMin;
        config.dungeonConfig.DungeonPathSizeMax = config.dungeonConfig.DungeonPathSizeMax < 1 ? 1 : config.dungeonConfig.DungeonPathSizeMax < config.dungeonConfig.DungeonPathSizeMin ? config.dungeonConfig.DungeonPathSizeMin : config.dungeonConfig.DungeonPathSizeMax;
        config.dungeonConfig.TileSize = config.dungeonConfig.TileSize < 1 ? 1 : config.dungeonConfig.TileSize;
        config.dungeonConfig.ScaleWallY = config.dungeonConfig.ScaleWallY < 1 ? 1 : config.dungeonConfig.ScaleWallY;
        config.dungeonConfig.ScaleWallZ = config.dungeonConfig.ScaleWallZ < 1 ? 1 : config.dungeonConfig.ScaleWallZ;
        if (config.dungeonConfig.lstEntities != null)
        {
            foreach (var objEnt in config.dungeonConfig.lstEntities)
            {
                objEnt.Total = objEnt.Total < 1 ? 1 : objEnt.Total;
                objEnt.OcuppedTolerance = objEnt.OcuppedTolerance < 1 ? 1 : objEnt.OcuppedTolerance;
            }
        }
    }
    public void Test(int ciclos)
    {
        try
        {
            for (int l = 0; l < ciclos; l++)
            {
                RandomDungeonMaker dungeon = LoadConfigDungeon();
                dungeon.RNGSeed = l;
                dungeon.RNGSeedInn = l;
                dungeon.RNGSeedElement = l;
                dungeon.makeDungeon();
                Debug.Log("Dungeon created");
            }
            Debug.Log("TERMINADO");
        }
        catch (System.Exception ex)
        {
            Debug.LogException(ex);
        }
    }
    public float getTextWidth(string text)
    {
        return (text.Length * 8) + 10f;
    }
    static void FocusSceneViewOnObject(GameObject obj, float size)
    {
        if (obj == null) return;
        Vector3 position = obj.transform.position;
        SceneView sceneView = SceneView.lastActiveSceneView;
        if (sceneView != null)
        {
            sceneView.LookAt(position);
            sceneView.size = size;
            sceneView.Repaint();
        }
    }
    #endregion

    #region Preview
    public void GeneratePreviewTexture(RandomDungeonMaker dungeon)
    {
        Color wallColor = Color.black;
        int texSize = 512;
        RenderTexture rt = RenderTexture.GetTemporary(texSize, texSize);
        RenderTexture.active = rt;
        GL.PushMatrix();
        GL.LoadPixelMatrix(0, texSize, texSize, 0);
        GL.Clear(true, true, Color.white);
        for (int l = 0; l < dungeon.DungeonHeight; l++)
        {
            for (int m = 0; m < dungeon.DungeonWidth; m++)
            {
                var block = dungeon.DungeonBlocks[l][m];
                float cellSize = texSize / (float)dungeon.DungeonWidth;
                float x = m * cellSize;
                float y = l * cellSize;
                Color fillColor = (block.Status == "OK") ? Color.yellow : Color.gray;
                DrawRect(new Rect(x, y, cellSize, cellSize), Color.white);
                DrawRect(new Rect(x + 1, y + 1, cellSize - 1, cellSize - 1), fillColor);
                float lineWidth = 4f;
                if (block.hasWallTop)
                    DrawLine(new Vector2(x, y), new Vector2(x + cellSize, y), wallColor, lineWidth);
                if (block.hasWallRight)
                    DrawLine(new Vector2(x + cellSize, y), new Vector2(x + cellSize, y + cellSize), wallColor, lineWidth);
                if (block.hasWallBottom)
                    DrawLine(new Vector2(x, y + cellSize), new Vector2(x + cellSize, y + cellSize), wallColor, lineWidth);
                if (block.hasWallLeft)
                    DrawLine(new Vector2(x, y), new Vector2(x, y + cellSize), wallColor, lineWidth);
                if (block.ConnectTop != null)
                    DrawDashedLine(new Vector2(x, y), new Vector2(x + cellSize, y), wallColor, lineWidth, cellSize * 0.1f);
                if (block.ConnectRight != null)
                    DrawDashedLine(new Vector2(x + cellSize, y), new Vector2(x + cellSize, y + cellSize), wallColor, lineWidth, cellSize * 0.1f);
                if (block.ConnectBottom != null)
                    DrawDashedLine(new Vector2(x, y + cellSize), new Vector2(x + cellSize, y + cellSize), wallColor, lineWidth, cellSize * 0.1f);
                if (block.ConnectLeft != null)
                    DrawDashedLine(new Vector2(x, y), new Vector2(x, y + cellSize), wallColor, lineWidth, cellSize * 0.1f);
            }
        }
        Texture2D tex = new Texture2D(texSize, texSize, TextureFormat.RGBA32, false);
        tex.ReadPixels(new Rect(0, 0, texSize, texSize), 0, 0);
        tex.Apply();
        RenderTexture.active = null;
        RenderTexture.ReleaseTemporary(rt);
        GL.PopMatrix();
        previewTexture = tex;
    }
    private void DrawRect(Rect rect, Color color)
    {
        Material mat = new Material(Shader.Find("Hidden/Internal-Colored"));
        mat.SetPass(0);
        GL.Begin(GL.QUADS);
        GL.Color(color);
        GL.Vertex3(rect.xMin, rect.yMin, 0);
        GL.Vertex3(rect.xMax, rect.yMin, 0);
        GL.Vertex3(rect.xMax, rect.yMax, 0);
        GL.Vertex3(rect.xMin, rect.yMax, 0);
        GL.End();
    }
    private void DrawLine(Vector2 start, Vector2 end, Color color, float width)
    {
        Material mat = new Material(Shader.Find("Hidden/Internal-Colored"));
        mat.SetPass(0);
        GL.Begin(GL.QUADS);
        GL.Color(color);
        Vector2 dir = (end - start).normalized;
        Vector2 perp = new Vector2(-dir.y, dir.x) * (width / 2f);
        GL.Vertex3(start.x + perp.x, start.y + perp.y, 0);
        GL.Vertex3(start.x - perp.x, start.y - perp.y, 0);
        GL.Vertex3(end.x - perp.x, end.y - perp.y, 0);
        GL.Vertex3(end.x + perp.x, end.y + perp.y, 0);
        GL.End();
    }
    private void DrawDashedLine(Vector2 start, Vector2 end, Color color, float width, float dashSpacing)
    {
        Material mat = new Material(Shader.Find("Hidden/Internal-Colored"));
        mat.SetPass(0);
        float totalDistance = Vector2.Distance(start, end);
        Vector2 direction = (end - start).normalized;
        float currentDistance = 0f;
        while (currentDistance < totalDistance)
        {
            Vector2 segmentStart = start + direction * currentDistance;
            float remainingDistance = totalDistance - currentDistance;
            float segmentLength = Mathf.Min(dashSpacing, remainingDistance);
            Vector2 segmentEnd = segmentStart + direction * segmentLength;
            DrawLine(segmentStart, segmentEnd, color, width);
            currentDistance += segmentLength + dashSpacing;
        }
    }
    #endregion
}